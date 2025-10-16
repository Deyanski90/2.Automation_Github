import { test, expect, request } from '@playwright/test';

test('Add item to cart via API (HAR flow)', async ({ request }) => {
  // Simulate POST /api/cart as captured in HAR
  const res = await request.post('/api/cart', {
    data: { itemId: 'item-123', quantity: 1 }
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toHaveProperty('cartId');
  expect(body.items).toContainEqual({ itemId: 'item-123', quantity: 1 });
});
