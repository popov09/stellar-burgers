import { test, expect, Page } from '@playwright/test';
import path from 'path';
import { mockIngredients } from './mocks/ingredients';

const HAR_PATH = path.resolve(__dirname, 'mocks', 'ingredients.har');

const MOCK_USER = { success: true, user: { email: 'test@yandex.ru', name: 'Тест' } };

const MOCK_ORDER = {
  success: true,
  name: 'Флюоресцентный бургер',
  order: {
    _id: 'mock-order-id',
    status: 'done',
    name: 'Флюоресцентный бургер',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    number: 54321,
    price: 1000
  }
};

async function navigateToConstructor(page: Page) {
  await page.routeFromHAR(HAR_PATH, { url: '**/api/ingredients' });
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

test('добавление ингредиентов в конструктор', async ({ page }) => {
  await navigateToConstructor(page);

  await addIngredient(page, mockIngredients[0].name);
  await addIngredient(page, mockIngredients[1].name);

  await expect(
    page.getByText(`${mockIngredients[0].name} (верх)`, { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText(`${mockIngredients[0].name} (низ)`, { exact: true })
  ).toBeVisible();

  const constructorSection = page.locator('section', {
    hasText: 'Оформить заказ'
  });
  await expect(
    constructorSection.getByText(mockIngredients[1].name, { exact: true })
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

  await page.locator('#modals > div').last().click({ position: { x: 5, y: 5 } });
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

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json;charset=utf-8',
      body: JSON.stringify(MOCK_USER)
    });
  });

  await page.route('**/api/orders', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json;charset=utf-8',
        body: JSON.stringify(MOCK_ORDER)
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json;charset=utf-8',
        body: JSON.stringify({ success: false, message: 'Не авторизован' })
      });
    }
  });

  await navigateToConstructor(page);

  await addIngredient(page, mockIngredients[0].name);
  await addIngredient(page, mockIngredients[1].name);
  await addIngredient(page, mockIngredients[2].name);

  const submitButton = page.getByRole('button', { name: 'Оформить заказ' });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  const modal = page.locator('#modals > div').first();
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('54321');
  await expect(modal).toContainText('идентификатор заказа');

  await expect(page.getByText('Выберите начинку')).toBeVisible();

  await modal.getByRole('button').click();
  await expect(modal).toBeHidden();
  await expect(page.locator('#modals')).toBeEmpty();
});