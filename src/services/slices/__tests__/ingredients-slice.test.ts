import ingredientsReducer, { getIngredients } from '../ingredients-slice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image',
    image_mobile: 'image-mobile',
    image_large: 'image-large'
  },
  {
    _id: '2',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 2,
    fat: 2,
    carbohydrates: 2,
    calories: 2,
    price: 15,
    image: 'image',
    image_mobile: 'image-mobile',
    image_large: 'image-large'
  }
];

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [] as TIngredient[],
    isIngredientsLoading: false,
    error: null as string | null
  };

  test('возвращает начальное состояние при неизвестном экшене с undefined', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('обрабатывает экшен getIngredients.pending', () => {
    const state = ingredientsReducer(initialState, {
      type: getIngredients.pending.type
    });
    expect(state.isIngredientsLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обрабатывает экшен getIngredients.fulfilled', () => {
    const state = ingredientsReducer(initialState, {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    });
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.isIngredientsLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('обрабатывает экшен getIngredients.rejected', () => {
    const state = ingredientsReducer(initialState, {
      type: getIngredients.rejected.type,
      error: { message: 'Ошибка загрузки ингредиентов' }
    });
    expect(state.isIngredientsLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });

  test('использует сообщение по умолчанию, если ошибка не задана', () => {
    const state = ingredientsReducer(initialState, {
      type: getIngredients.rejected.type,
      error: {}
    });
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });
});
