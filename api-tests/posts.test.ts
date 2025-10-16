import axios from 'axios';
const BASE_URL = 'https://jsonplaceholder.typicode.com';

describe('Posts API', () => {
  it('GET /posts returns all posts', async () => {
    const res = await axios.get(`${BASE_URL}/posts`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBeTruthy();
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('GET /posts/:id returns a single post', async () => {
    const res = await axios.get(`${BASE_URL}/posts/1`);
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(1);
  });

  it('POST /posts creates a post', async () => {
    const payload = { title: 'foo', body: 'bar', userId: 1 };
    const res = await axios.post(`${BASE_URL}/posts`, payload);
    expect(res.status).toBe(201);
    expect(res.data).toMatchObject(payload);
  });

  it('PUT /posts/:id updates a post', async () => {
    const payload = { id: 1, title: 'updated', body: 'updated', userId: 1 };
    const res = await axios.put(`${BASE_URL}/posts/1`, payload);
    expect(res.status).toBe(200);
    expect(res.data).toMatchObject(payload);
  });

  it('DELETE /posts/:id deletes a post', async () => {
    const res = await axios.delete(`${BASE_URL}/posts/1`);
    expect(res.status).toBe(200);
  });
});
