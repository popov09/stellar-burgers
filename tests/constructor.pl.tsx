import { test, expect, Page } from '@playwright/test';
import path from 'path';
import { mockIngredients } from './mocks/ingredients';

const INGREDIENTS_HAR_PATH = path.resolve(
  __dirname,
  'mocks',
  'ingredients.har'
);
const USER_HAR_PATH = path.resolve(__dirname, 'mocks', 'auth-user.har');
const ORDER_HAR_PATH = path.resolve(__dirname, 'mocks', 'order.har');

const EXPECTED_ORDER_NUMBER = 54321;

async function navigateToConstructor(page: Page) {
  await page.routeFromHAR(INGREDIENTS_HAR_PATH, {
    url: '**/api/ingredients'
  });
  await page.goto('/');
  await expect(
    page.getByText(mockIngredients[0].name, { exact: true })
  ).toBeVisible();
}

async function addIngredient(page: Page, name: string) {
  await page
    .locator('li', { hasText: name })
    .getByRole('button', { name: 'Добавить' })
    .click();
}

function constructorSection(page: Page) {
  return page.locator('section', { hasText: 'Оформить заказ' });
}

test('добавление ингредиентов в конструктор', async ({ page }) => {
  await navigateToConstructor(page);

  await addIngredient(page, mockIngredients[0].name);
  await addIngredient(page, mockIngredients[1].name);

  const constructor = constructorSection(page);
  await expect(
    constructor.getByText(`${mockIngredients[0].name} (верх)`, {
      exact: true
    })
  ).toBeVisible();
  await expect(
    constructor.getByText(`${mockIngredients[0].name} (низ)`, {
      exact: true
    })
  ).toBeVisible();
  await expect(
    constructor.getByText(mockIngredients[1].name, { exact: true })
  ).toBeVisible();
});

test('модальное окно ингредиента открывается и закрывается по крестику', async ({
  page
}) => {
  await navigateToConstructor(page);

  await page.locator('a', { hasText: mockIngredients[0].name }).click();

  const modal = page.locator('#modals > div').first();
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('Детали ингредиента');
  await expect(modal).toContainText(mockIngredients[0].name);

  await modal.getByRole('button').click();
  await expect(modal).toBeHidden();
  await expect(page.locator('#modals')).toBeEmpty();
  await expect(page).toHaveURL('/');
});

test('модальное окно ингредиента закрывается по клику на оверлей', async ({
  page
}) => {
  await navigateToConstructor(page);

  await page.locator('a', { hasText: mockIngredients[0].name }).click();

  const modal = page.locator('#modals > div').first();
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('Детали ингредиента');

  await page
    .locator('#modals > div')
    .last()
    .click({ position: { x: 5, y: 5 } });
  await expect(modal).toBeHidden();
  await expect(page.locator('#modals')).toBeEmpty();
});

test('оформление заказа', async ({ page }) => {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'mock-access-token',
      url: 'http://localhost:4000/'
    }
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });

  await page.routeFromHAR(USER_HAR_PATH, { url: '**/api/auth/user' });
  await page.routeFromHAR(ORDER_HAR_PATH, { url: '**/api/orders' });

  await navigateToConstructor(page);

  await addIngredient(page, mockIngredients[0].name);
  await addIngredient(page, mockIngredients[1].name);
  await addIngredient(page, mockIngredients[2].name);

  const submitButton = page.getByRole('button', { name: 'Оформить заказ' });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  const modal = page.locator('#modals > div').first();
  await expect(modal).toBeVisible();
  await expect(modal).toContainText(String(EXPECTED_ORDER_NUMBER));
  await expect(modal).toContainText('идентификатор заказа');

  const constructor = constructorSection(page);
  await expect(constructor.getByText('Выберите начинку')).toBeVisible();
  await expect(constructor.getByText('Выберите булки')).toHaveCount(2);

  await modal.getByRole('button').click();
  await expect(modal).toBeHidden();
  await expect(page.locator('#modals')).toBeEmpty();
});