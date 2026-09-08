import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotal } from '../src/cart.js';

test('empty cart costs zero', () => assert.equal(calculateTotal([]), 0));
test('total includes every unit of each item', () => {
  assert.equal(calculateTotal([
    { price: 10000, quantity: 2 },
    { price: 5000, quantity: 3 },
  ]), 35000);
});
