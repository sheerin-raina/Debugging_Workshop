
const assert = require("node:assert/strict");

const {
  findProductByName,
  lowStockProducts,
  productsSortedByPrice,
  categorySummary,
  revenueSummary
} = require("./reports");

const { getProducts } = require("./data");
const products = getProducts();

// ROOT CAUSE 1: Search normalization
assert.equal(
  findProductByName(products, "  KEYBOARD  ")?.id,
  "P100"
);
console.log("PASS: Product search");

// ROOT CAUSE 2: Low-stock boundaries
const lowStock = lowStockProducts(products, 5);
assert.deepEqual(
  lowStock.map(p => p.id).sort(),
  ["P101", "P103", "P105"].sort()
);
assert.equal(
  lowStockProducts([{ stock: 5 }], 5).length,
  1
);
console.log("PASS: Low-stock report");

// ROOT CAUSE 3: Price sorting and mutation
const originalOrder = products.map(p => p.id);
const sorted = productsSortedByPrice(products);

assert.deepEqual(
  sorted.map(p => p.price),
  [...products].map(p => p.price).sort((a, b) => a - b)
);
assert.deepEqual(
  products.map(p => p.id),
  originalOrder
);
console.log("PASS: Price sorting");

// ROOT CAUSE 4: Category summary
const categories = categorySummary(products);

assert.deepEqual(categories.Electronics, {
  productCount: 2,
  totalStock: 16
});
assert.deepEqual(categories.Office, {
  productCount: 2,
  totalStock: 30
});
assert.deepEqual(categories.Fitness, {
  productCount: 2,
  totalStock: 9
});
console.log("PASS: Category summary");

// ROOT CAUSE 5: Revenue summary
const orders = [
  { valid: true, subtotal: 100, total: 90 },
  { valid: false, subtotal: 200, total: 200 },
  { valid: true, subtotal: 50, total: 45 }
];

assert.deepEqual(revenueSummary(orders), {
  validOrders: 2,
  totalRevenue: 135
});
console.log("PASS: Revenue summary");

console.log("\nAll 5 reporting tests passed!");
