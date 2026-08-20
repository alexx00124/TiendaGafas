import PropType from 'prop-types';

export const productShape = PropType.shape({
  id: PropType.string,
  name: PropType.string,
  brand: PropType.string,
  price: PropType.number,
  quantity: PropType.number,
  maxQuantity: PropType.number,
  description: PropType.string,
  keywords: PropType.arrayOf(PropType.string),
  selectedSize: PropType.string,
  selectedColor: PropType.string,
  imageCollection: PropType.arrayOf(PropType.shape({
    id: PropType.oneOfType([PropType.string, PropType.number]),
    url: PropType.string
  })),
  sizes: PropType.arrayOf(PropType.oneOfType([PropType.string, PropType.number])),
  image: PropType.string,
  imageUrl: PropType.string,
  isFeatured: PropType.bool,
  isRecommended: PropType.bool,
  dateAdded: PropType.number,
  availableColors: PropType.arrayOf(PropType.string)
});

export const historyShape = PropType.shape({
  push: PropType.func
});
