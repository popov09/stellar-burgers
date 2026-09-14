export const mockIngredients = [
  {
    _id: 'mock-bun-01',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: 'mock-sauce-01',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 2,
    fat: 2,
    carbohydrates: 2,
    calories: 2,
    price: 15,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  },
  {
    _id: 'mock-main-01',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/main-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/main-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/main-01-large.png'
  }
];

export const mockIngredientsResponse = {
  success: true,
  data: mockIngredients
};