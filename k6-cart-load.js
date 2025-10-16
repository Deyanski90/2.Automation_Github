import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '60s',
};

export default function () {
  const res = http.post('https://your-app-url.com/api/cart', JSON.stringify({ itemId: 'item-123', quantity: 1 }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has cartId': (r) => r.json('cartId') !== undefined,
  });
  sleep(1);
}
