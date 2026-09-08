import { pathToFileURL } from 'node:url';

// Prices are whole-number paise (100 paise = 1 rupee).
export function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log('Cart total in paise:', calculateTotal([{ price: 10000, quantity: 2 }]));
}
