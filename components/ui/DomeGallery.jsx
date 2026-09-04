'use client';

// DomeGallery — React Bits (JS-CSS variant), adapted for this site:
//  • slow self-rotation that yields to drag / hover / an open frame,
//  • only animates while the section is on screen (IntersectionObserver),
//  • per-photo tile aspect so landscape and portrait frames read differently,
//  • an injected caption (title · place · EXIF · tags) on the enlarged frame,
//  • dark ground + colour (no grayscale) + Lenis-aware scroll lock.

import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import './DomeGallery.css';

const DEFAULT_IMAGES = [];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 19,
  rows: 3,
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeAngle = d => ((d % 360) + 360) % 360;
const wrapAngleSigned = deg => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el, name, fallback) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

// Small deterministic PRNG (mulberry32 over an FNV-1a hash) so the masonry
// layout is stable across renders and identical on server + client.
function seededRand(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const normalizePool = pool =>
  pool.map((image, i) =>
    typeof image === 'string'
      ? { src: image, alt: '', _k: 's' + i }
      : {
          src: image.src || '',
          alt: image.alt || '',
          aspect: image.aspect,
          featured: image.featured,
          title: image.title,
          place: image.place,
          exif: image.exif,
          tags: image.tags,
          _k: (image.src || 'x') + ':' + i,
        },
  );

// Masonry pack onto a `seg × rows` cell grid that wraps horizontally. Tiles
// take footprints of 1×1 / 2×1 / 1×2 / 2×2 cells, biased by each photo's
// orientation (wide for landscape, tall for portrait) so frames interlock
// like a brick wall instead of sitting in a plain grid. One cell == the base
// sizeX:2 / sizeY:2 tile; X0/Y0 keep the whole thing centred on the equator.
function buildItems(pool, seg, rows) {
  const cols = Math.max(2, seg);
  const nRows = Math.max(1, rows);
  const X0 = -37;
  const Y0 = 1.5 - nRows;

  const occ = Array.from({ length: cols }, () => new Array(nRows).fill(false));
  const canFit = (c, r, w, h) => {
    if (r + h > nRows) return false;
    for (let dc = 0; dc < w; dc++) {
      const cc = (c + dc) % cols;
      for (let dr = 0; dr < h; dr++) if (occ[cc][r + dr]) return false;
    }
    return true;
  };
  const claim = (c, r, w, h) => {
    for (let dc = 0; dc < w; dc++) {
      const cc = (c + dc) % cols;
      for (let dr = 0; dr < h; dr++) occ[cc][r + dr] = true;
    }
  };
  const place = (p, c, r, w, h) => ({
    ...p,
    x: X0 + 2 * c,
    y: Y0 + 2 * r + 2 * (h - 1),
    sizeX: 2 * w,
    sizeY: 2 * h,
  });

  if (!pool || pool.length === 0) {
    const out = [];
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < nRows; r++) out.push(place({ src: '', alt: '' }, c, r, 1, 1));
    return out;
  }

  const norm = normalizePool(pool);
  const items = [];
  let pi = 0;
  let lastSrc = null;
  const nextPhoto = () => {
    let p = norm[pi % norm.length];
    if (norm.length > 1 && p.src && p.src === lastSrc) {
      pi += 1;
      p = norm[pi % norm.length];
    }
    pi += 1;
    lastSrc = p.src;
    return p;
  };

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < nRows; r++) {
      if (occ[c][r]) continue;
      const p = nextPhoto();
      const rnd = seededRand(p._k + '#' + c + '#' + r);
      const a = Number.isFinite(p.aspect) && p.aspect > 0 ? p.aspect : 1;

      // Mostly 1×1 with a strong helping of orientation-matched 2×1 / 1×2 to
      // give the wall its brick rhythm; the full 2×2 is a rare accent, a touch
      // more common for featured frames.
      const wide = a >= 1.25;
      const tall = a <= 0.82;
      const stretch = wide ? [2, 1] : tall ? [1, 2] : null;

      let w = 1;
      let h = 1;
      const rBig = p.featured ? 0.24 : 0.07;
      const rStretch = p.featured ? 0.58 : 0.5;
      if (rnd() < rBig && canFit(c, r, 2, 2)) {
        w = 2;
        h = 2;
      } else if (stretch && rnd() < rStretch && canFit(c, r, stretch[0], stretch[1])) {
        [w, h] = stretch;
      }

      claim(c, r, w, h);
      items.push(place(p, c, r, w, h));
    }
  }

  return items;
}

function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  fitBasis = 'auto',
  minRadius = 440,
  maxRadius = Infinity,
  padFactor = 0.12,
  overlayBlurColor = '#080809',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  rows = DEFAULTS.rows,
  dragDampening = 2,
  openedImageWidth = null,
  openedImageHeight = null,
  imageBorderRadius = '14px',
  openedImageBorderRadius = '18px',
  grayscale = false,
  autoRotate = true,
  autoRotateSpeed = 0.055,
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const frameRef = useRef(null);
  const viewerRef = useRef(null);
  const scrimRef = useRef(null);
  const focusedElRef = useRef(null);
  const originalTilePositionRef = useRef(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);

  const hoverRef = useRef(false);
  const hoverTimerRef = useRef(null);
  const inViewRef = useRef(true);
  const applyTransformRef = useRef(null);

  const scrollLockedRef = useRef(false);
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.classList.add('dg-scroll-lock');
    try { window.__lenis?.stop(); } catch { /* no lenis */ }
  }, []);
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute('data-enlarging') === 'true') return;
    scrollLockedRef.current = false;
    document.body.classList.remove('dg-scroll-lock');
    try { window.__lenis?.start(); } catch { /* no lenis */ }
  }, []);

  const items = useMemo(() => buildItems(images, segments, rows), [images, segments, rows]);

  const applyTransform = (xDeg, yDeg) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };
  applyTransformRef.current = applyTransform;

  const lockedRadiusRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width),
        h = Math.max(1, cr.height);
      const minDim = Math.min(w, h),
        maxDim = Math.max(w, h),
        aspect = w / h;
      let basis;
      switch (fitBasis) {
        case 'min':
          basis = minDim;
          break;
        case 'max':
          basis = maxDim;
          break;
        case 'width':
          basis = w;
          break;
        case 'height':
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      applyTransform(rotationRef.current.x, rotationRef.current.y);

      const enlargedOverlay = viewerRef.current?.querySelector('.enlarge');
      if (enlargedOverlay && frameRef.current && mainRef.current) {
        const frameR = frameRef.current.getBoundingClientRect();
        const mainR = mainRef.current.getBoundingClientRect();

        const hasCustomSize = openedImageWidth && openedImageHeight;
        if (hasCustomSize) {
          const tempDiv = document.createElement('div');
          tempDiv.style.cssText = `position: absolute; width: ${openedImageWidth}; height: ${openedImageHeight}; visibility: hidden;`;
          document.body.appendChild(tempDiv);
          const tempRect = tempDiv.getBoundingClientRect();
          document.body.removeChild(tempDiv);

          const centeredLeft = frameR.left - mainR.left + (frameR.width - tempRect.width) / 2;
          const centeredTop = frameR.top - mainR.top + (frameR.height - tempRect.height) / 2;

          enlargedOverlay.style.left = `${centeredLeft}px`;
          enlargedOverlay.style.top = `${centeredTop}px`;
        } else {
          enlargedOverlay.style.left = `${frameR.left - mainR.left}px`;
          enlargedOverlay.style.top = `${frameR.top - mainR.top}px`;
          enlargedOverlay.style.width = `${frameR.width}px`;
          enlargedOverlay.style.height = `${frameR.height}px`;
        }
      }
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius,
    openedImageWidth,
    openedImageHeight,
  ]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  // ── only spin while the dome is on screen ────────────────────────────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // ── slow self-rotation ──────────────────────────────────────────────────
  useEffect(() => {
    if (!autoRotate) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const tick = () => {
      const idle =
        inViewRef.current &&
        !draggingRef.current &&
        !openingRef.current &&
        !focusedElRef.current &&
        !hoverRef.current &&
        !inertiaRAF.current;
      if (idle) {
        const nextY = wrapAngleSigned(rotationRef.current.y + autoRotateSpeed);
        rotationRef.current = { x: rotationRef.current.x, y: nextY };
        applyTransformRef.current?.(rotationRef.current.x, nextY);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotate, autoRotateSpeed]);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx, vy) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening ?? 0.6, 0, 1);
      const frictionMul = 0.94 + 0.055 * d;
      const stopThreshold = 0.015 - 0.01 * d;
      const maxFrames = Math.round(90 + 270 * d);
      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia],
  );

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current) return;
        stopInertia();
        const evt = event;
        draggingRef.current = true;
        movedRef.current = false;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: evt.clientX, y: evt.clientY };
        rootRef.current?.setAttribute('data-dragging', 'true');
      },
      onDrag: ({ event, last, velocity = [0, 0], direction = [0, 0], movement }) => {
        if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
        const evt = event;
        const dxTotal = evt.clientX - startPosRef.current.x;
        const dyTotal = evt.clientY - startPosRef.current.y;
        if (!movedRef.current) {
          const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
          if (dist2 > 16) movedRef.current = true;
        }
        const nextX = clamp(
          startRotRef.current.x - dyTotal / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg,
        );
        const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / dragSensitivity);
        if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
          rotationRef.current = { x: nextX, y: nextY };
          applyTransform(nextX, nextY);
        }
        if (last) {
          draggingRef.current = false;
          rootRef.current?.removeAttribute('data-dragging');
          let [vMagX, vMagY] = velocity;
          const [dirX, dirY] = direction;
          let vx = vMagX * dirX;
          let vy = vMagY * dirY;
          if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
            const [mx, my] = movement;
            vx = clamp((mx / dragSensitivity) * 0.02, -1.2, 1.2);
            vy = clamp((my / dragSensitivity) * 0.02, -1.2, 1.2);
          }
          if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy);
          if (movedRef.current) lastDragEndAt.current = performance.now();
          movedRef.current = false;
        }
      },
    },
    { target: mainRef, eventOptions: { passive: true } },
  );

  useEffect(() => {
    const scrim = scrimRef.current;
    if (!scrim) return;
    const close = () => {
      if (performance.now() - openStartedAtRef.current < 250) return;
      const el = focusedElRef.current;
      if (!el) return;
      const parent = el.parentElement;
      const overlay = viewerRef.current?.querySelector('.enlarge');
      if (!overlay) return;
      const refDiv = parent.querySelector('.item__image--reference');
      const originalPos = originalTilePositionRef.current;
      if (!originalPos) {
        overlay.remove();
        if (refDiv) refDiv.remove();
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');
        el.style.visibility = '';
        el.style.zIndex = 0;
        focusedElRef.current = null;
        rootRef.current?.removeAttribute('data-enlarging');
        openingRef.current = false;
        unlockScroll();
        return;
      }
      const currentRect = overlay.getBoundingClientRect();
      const rootRect = rootRef.current.getBoundingClientRect();
      const originalPosRelativeToRoot = {
        left: originalPos.left - rootRect.left,
        top: originalPos.top - rootRect.top,
        width: originalPos.width,
        height: originalPos.height,
      };
      const overlayRelativeToRoot = {
        left: currentRect.left - rootRect.left,
        top: currentRect.top - rootRect.top,
        width: currentRect.width,
        height: currentRect.height,
      };
      const animatingOverlay = document.createElement('div');
      animatingOverlay.className = 'enlarge-closing';
      animatingOverlay.style.cssText = `position:absolute;left:${overlayRelativeToRoot.left}px;top:${overlayRelativeToRoot.top}px;width:${overlayRelativeToRoot.width}px;height:${overlayRelativeToRoot.height}px;z-index:9999;border-radius: var(--enlarge-radius, 18px);overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:all ${enlargeTransitionMs}ms ease-out;pointer-events:none;margin:0;transform:none;`;
      const originalImg = overlay.querySelector('img');
      if (originalImg) {
        const img = originalImg.cloneNode();
        img.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#08080a;';
        animatingOverlay.appendChild(img);
      }
      overlay.remove();
      rootRef.current.appendChild(animatingOverlay);
      void animatingOverlay.getBoundingClientRect();
      requestAnimationFrame(() => {
        animatingOverlay.style.left = originalPosRelativeToRoot.left + 'px';
        animatingOverlay.style.top = originalPosRelativeToRoot.top + 'px';
        animatingOverlay.style.width = originalPosRelativeToRoot.width + 'px';
        animatingOverlay.style.height = originalPosRelativeToRoot.height + 'px';
        animatingOverlay.style.opacity = '0';
      });
      let cleanedUp = false;
      const cleanup = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        // essential state reset — must always run so the page never stays locked
        animatingOverlay.remove();
        originalTilePositionRef.current = null;
        if (refDiv) refDiv.remove();
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');
        parent.style.transition = '';
        el.style.transition = '';
        el.style.visibility = '';
        el.style.opacity = '';
        el.style.zIndex = 0;
        focusedElRef.current = null;
        openingRef.current = false;
        rootRef.current?.removeAttribute('data-enlarging');
        unlockScroll();
      };
      animatingOverlay.addEventListener('transitionend', cleanup, { once: true });
      // fallback — transitionend can be missed (interrupted transition, throttled
      // tab, reduced motion). Never leave the gallery in a locked state.
      setTimeout(cleanup, enlargeTransitionMs + 160);
    };
    scrim.addEventListener('click', close);
    const onKey = e => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      scrim.removeEventListener('click', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [enlargeTransitionMs, unlockScroll]);

  const openItemFromElement = useCallback(
    el => {
      if (openingRef.current) return;
      openingRef.current = true;
      openStartedAtRef.current = performance.now();
      lockScroll();
      const parent = el.parentElement;
      focusedElRef.current = el;
      el.setAttribute('data-focused', 'true');
      const offsetX = getDataNumber(parent, 'offsetX', 0);
      const offsetY = getDataNumber(parent, 'offsetY', 0);
      const sizeX = getDataNumber(parent, 'sizeX', 2);
      const sizeY = getDataNumber(parent, 'sizeY', 2);
      const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments);
      const parentY = normalizeAngle(parentRot.rotateY);
      const globalY = normalizeAngle(rotationRef.current.y);
      let rotY = -(parentY + globalY) % 360;
      if (rotY < -180) rotY += 360;
      const rotX = -parentRot.rotateX - rotationRef.current.x;
      parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
      parent.style.setProperty('--rot-x-delta', `${rotX}deg`);
      const refDiv = document.createElement('div');
      refDiv.className = 'item__image item__image--reference';
      refDiv.style.opacity = '0';
      refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
      parent.appendChild(refDiv);

      void refDiv.offsetHeight;

      const tileR = refDiv.getBoundingClientRect();
      const mainR = mainRef.current?.getBoundingClientRect();
      const frameR = frameRef.current?.getBoundingClientRect();

      if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
        openingRef.current = false;
        focusedElRef.current = null;
        parent.removeChild(refDiv);
        unlockScroll();
        return;
      }

      originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
      el.style.visibility = 'hidden';
      el.style.zIndex = 0;
      const overlay = document.createElement('div');
      overlay.className = 'enlarge';
      overlay.style.position = 'absolute';
      overlay.style.left = frameR.left - mainR.left + 'px';
      overlay.style.top = frameR.top - mainR.top + 'px';
      overlay.style.width = frameR.width + 'px';
      overlay.style.height = frameR.height + 'px';
      overlay.style.opacity = '0';
      overlay.style.zIndex = '30';
      overlay.style.willChange = 'transform, opacity';
      overlay.style.transformOrigin = 'top left';
      overlay.style.transition = `transform ${enlargeTransitionMs}ms ease, opacity ${enlargeTransitionMs}ms ease`;
      const rawSrc = parent.dataset.src || el.querySelector('img')?.src || '';
      const rawAlt = el.querySelector('img')?.alt || parent.dataset.title || '';
      const img = document.createElement('img');
      img.src = rawSrc;
      img.alt = rawAlt;
      overlay.appendChild(img);

      // detail caption — title · place · EXIF · tags
      const capTitle = parent.dataset.title;
      if (capTitle) {
        const cap = document.createElement('figcaption');
        cap.className = 'dg-caption';
        const h = document.createElement('div');
        h.className = 'dg-cap-title';
        h.textContent = capTitle;
        cap.appendChild(h);
        if (parent.dataset.place) {
          const s = document.createElement('div');
          s.className = 'dg-cap-sub';
          s.textContent = parent.dataset.place;
          cap.appendChild(s);
        }
        if (parent.dataset.exif) {
          const e = document.createElement('div');
          e.className = 'dg-cap-exif';
          e.textContent = parent.dataset.exif;
          cap.appendChild(e);
        }
        if (parent.dataset.tags) {
          const wrap = document.createElement('div');
          wrap.className = 'dg-cap-tags';
          parent.dataset.tags
            .split('|')
            .map(t => t.trim())
            .filter(Boolean)
            .slice(0, 5)
            .forEach(t => {
              const c = document.createElement('span');
              c.className = 'dg-cap-tag';
              c.textContent = t;
              wrap.appendChild(c);
            });
          if (wrap.childNodes.length) cap.appendChild(wrap);
        }
        overlay.appendChild(cap);
      }

      viewerRef.current.appendChild(overlay);
      const tx0 = tileR.left - frameR.left;
      const ty0 = tileR.top - frameR.top;
      const sx0 = tileR.width / frameR.width;
      const sy0 = tileR.height / frameR.height;

      const validSx0 = isFinite(sx0) && sx0 > 0 ? sx0 : 1;
      const validSy0 = isFinite(sy0) && sy0 > 0 ? sy0 : 1;

      overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${validSx0}, ${validSy0})`;

      setTimeout(() => {
        if (!overlay.parentElement) return;
        overlay.style.opacity = '1';
        overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
        rootRef.current?.setAttribute('data-enlarging', 'true');
      }, 16);

      const wantsResize = openedImageWidth || openedImageHeight;
      if (wantsResize) {
        const onFirstEnd = ev => {
          if (ev.propertyName !== 'transform') return;
          overlay.removeEventListener('transitionend', onFirstEnd);
          const prevTransition = overlay.style.transition;
          overlay.style.transition = 'none';
          const tempWidth = openedImageWidth || `${frameR.width}px`;
          const tempHeight = openedImageHeight || `${frameR.height}px`;
          overlay.style.width = tempWidth;
          overlay.style.height = tempHeight;
          const newRect = overlay.getBoundingClientRect();
          overlay.style.width = frameR.width + 'px';
          overlay.style.height = frameR.height + 'px';
          void overlay.offsetWidth;
          overlay.style.transition = `left ${enlargeTransitionMs}ms ease, top ${enlargeTransitionMs}ms ease, width ${enlargeTransitionMs}ms ease, height ${enlargeTransitionMs}ms ease`;
          const centeredLeft = frameR.left - mainR.left + (frameR.width - newRect.width) / 2;
          const centeredTop = frameR.top - mainR.top + (frameR.height - newRect.height) / 2;
          requestAnimationFrame(() => {
            overlay.style.left = `${centeredLeft}px`;
            overlay.style.top = `${centeredTop}px`;
            overlay.style.width = tempWidth;
            overlay.style.height = tempHeight;
          });
          const cleanupSecond = () => {
            overlay.removeEventListener('transitionend', cleanupSecond);
            overlay.style.transition = prevTransition;
          };
          overlay.addEventListener('transitionend', cleanupSecond, { once: true });
        };
        overlay.addEventListener('transitionend', onFirstEnd);
      }
    },
    [enlargeTransitionMs, lockScroll, openedImageHeight, openedImageWidth, segments, unlockScroll],
  );

  const onTileClick = useCallback(
    e => {
      if (draggingRef.current) return;
      if (movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 80) return;
      if (openingRef.current) return;
      openItemFromElement(e.currentTarget);
    },
    [openItemFromElement],
  );

  const onTilePointerUp = useCallback(
    e => {
      if (e.pointerType !== 'touch') return;
      if (draggingRef.current) return;
      if (movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 80) return;
      if (openingRef.current) return;
      openItemFromElement(e.currentTarget);
    },
    [openItemFromElement],
  );

  const onDomeEnter = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    hoverRef.current = true;
  }, []);
  const onDomeLeave = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      hoverRef.current = false;
      hoverTimerRef.current = null;
    }, 700);
  }, []);

  useEffect(() => {
    return () => {
      document.body.classList.remove('dg-scroll-lock');
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      try { window.__lenis?.start(); } catch { /* no lenis */ }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="sphere-root"
      style={{
        ['--segments-x']: segments,
        ['--segments-y']: segments,
        ['--overlay-blur-color']: overlayBlurColor,
        ['--tile-radius']: imageBorderRadius,
        ['--enlarge-radius']: openedImageBorderRadius,
        ['--image-filter']: grayscale ? 'grayscale(1)' : 'none',
        ['--dg-accent']: '#e8935a',
      }}
    >
      <main
        ref={mainRef}
        className="sphere-main"
        onPointerEnter={onDomeEnter}
        onPointerLeave={onDomeLeave}
      >
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="item"
                data-src={it.src}
                data-offset-x={it.x}
                data-offset-y={it.y}
                data-size-x={it.sizeX}
                data-size-y={it.sizeY}
                data-aspect={it.aspect ?? ''}
                data-featured={it.featured ? 'true' : undefined}
                data-title={it.title ?? ''}
                data-place={it.place ?? ''}
                data-exif={it.exif ?? ''}
                data-tags={it.tags ?? ''}
                style={{
                  ['--offset-x']: it.x,
                  ['--offset-y']: it.y,
                  ['--item-size-x']: it.sizeX,
                  ['--item-size-y']: it.sizeY,
                }}
              >
                <div
                  className="item__image"
                  role="button"
                  tabIndex={0}
                  aria-label={it.alt || it.title || 'Open image'}
                  onClick={onTileClick}
                  onPointerUp={onTilePointerUp}
                >
                  <img src={it.src} draggable={false} alt={it.alt} loading="lazy" decoding="async" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overlay" />
        <div className="overlay overlay--blur" />
        <div className="edge-fade edge-fade--top" />
        <div className="edge-fade edge-fade--bottom" />
        <div className="edge-fade edge-fade--left" />
        <div className="edge-fade edge-fade--right" />

        <div className="viewer" ref={viewerRef}>
          <div ref={scrimRef} className="scrim" />
          <div ref={frameRef} className="frame" />
        </div>
      </main>
    </div>
  );
}
