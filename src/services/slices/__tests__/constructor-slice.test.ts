import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructor-slice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const bun: TIngredient = {
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
};

const sauce: TIngredient = {
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
};

const main: TIngredient = {
  _id: '3',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'image',
  image_mobile: 'image-mobile',
  image_large: 'image-large'
};

const bun2: TIngredient = {
  _id: '4',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'image',
  image_mobile: 'image-mobile',
  image_large: 'image-large'
};

describe('burgerConstructorSlice', () => {
  const initialState = {
    bun: null as TIngredient | null,
    ingredients: [] as TConstructorIngredient[]
  };

  test('возвращает начальное состояние при неизвестном экшене с undefined', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('addIngredient добавляет булку', () => {
    const state = constructorReducer(initialState, addIngredient(bun));
    expect(state.bun).toEqual({ ...bun, id: expect.any(String) });
    expect(state.ingredients).toHaveLength(0);
  });

  test('addIngredient булкой заменяет текущую булку', () => {
    let state = constructorReducer(initialState, addIngredient(bun));
    state = constructorReducer(state, addIngredient(bun2));
    expect(state.bun).not.toBeNull();
    expect((state.bun as TIngredient).name).toBe(bun2.name);
  });

  test('addIngredient добавляет начинку в конец списка', () => {
    let state = constructorReducer(initialState, addIngredient(sauce));
    state = constructorReducer(state, addIngredient(main));
    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients.map((item) => item.name)).toEqual([
      sauce.name,
      main.name
    ]);
  });

  test('removeIngredient удаляет начинку по id', () => {
    let state = constructorReducer(initialState, addIngredient(sauce));
    const removedId = state.ingredients[0].id;
    state = constructorReducer(state, addIngredient(main));
    state = constructorReducer(state, removeIngredient(removedId));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe(main.name);
  });

  test('moveIngredient перемещает начинку', () => {
    let state = constructorReducer(initialState, addIngredient(sauce));
    state = constructorReducer(state, addIngredient(main));
    state = constructorReducer(state, moveIngredient({ from: 0, to: 1 }));
    expect(state.ingredients.map((item) => item.name)).toEqual([
      main.name,
      sauce.name
    ]);
  });

  test('clearConstructor очищает конструктор', () => {
    let state = constructorReducer(initialState, addIngredient(bun));
    state = constructorReducer(state, addIngredient(sauce));
    state = constructorReducer(state, addIngredient(main));
    state = constructorReducer(state, clearConstructor());
    expect(state).toEqual(initialState);
  });
});
