const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function cld(publicId, transforms = 'f_auto,q_auto') {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transforms}/${publicId}`;
}

export function blurUrl(publicId) {
  return cld(publicId, 'w_20,h_20,f_auto,q_10,e_blur:1000');
}

export const PHOTOS = [
  {
    id: 1,
    title: 'Placeholder',
    location: 'Mumbai',
    category: 'street',
    publicId: 'photography/placeholder1',
    featured: true,
  },
  {
    id: 2,
    title: 'Placeholder',
    location: 'Mumbai',
    category: 'portrait',
    publicId: 'photography/placeholder2',
    featured: false,
  },
  {
    id: 3,
    title: 'Placeholder',
    location: 'Mumbai',
    category: 'architecture',
    publicId: 'photography/placeholder3',
    featured: false,
  },
];

export const CATEGORIES = ['all', 'street', 'portrait', 'architecture', 'nature'];
