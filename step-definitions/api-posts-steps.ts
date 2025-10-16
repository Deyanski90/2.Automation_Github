import { When, Then } from '@cucumber/cucumber';
import axios from 'axios';
import { expect } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
let response: any;

When('I request all posts', async function () {
  response = await axios.get(`${BASE_URL}/posts`);
});

When('I request post with id {int}', async function (id: number) {
  response = await axios.get(`${BASE_URL}/posts/${id}`);
});

When('I create a post with title {string} and body {string} for user {int}', async function (title: string, body: string, userId: number) {
  response = await axios.post(`${BASE_URL}/posts`, { title, body, userId });
});

When('I update post with id {int} to title {string} and body {string} for user {int}', async function (id: number, title: string, body: string, userId: number) {
  response = await axios.put(`${BASE_URL}/posts/${id}`, { id, title, body, userId });
});

When('I delete post with id {int}', async function (id: number) {
  response = await axios.delete(`${BASE_URL}/posts/${id}`);
});

Then('the response status should be {int}', function (status: number) {
  expect(response.status).toBe(status);
});

Then('the response should contain a list of posts', function () {
  expect(Array.isArray(response.data)).toBeTruthy();
  expect(response.data.length).toBeGreaterThan(0);
});

Then('the response should contain post with id {int}', function (id: number) {
  expect(response.data.id).toBe(id);
});

Then('the response should contain the created post', function () {
  expect(response.data).toHaveProperty('id');
  expect(response.data).toHaveProperty('title');
  expect(response.data).toHaveProperty('body');
  expect(response.data).toHaveProperty('userId');
});

Then('the response should contain the updated post', function () {
  expect(response.data).toHaveProperty('id');
  expect(response.data).toHaveProperty('title');
  expect(response.data).toHaveProperty('body');
  expect(response.data).toHaveProperty('userId');
});
