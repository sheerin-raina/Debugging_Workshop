
  // ROOT CAUSE 1:
  // Product names were lowercased, but search input was not.
  // FIX: Normalize both strings before comparing them.
  // This allows searches like "MOUSE" and "  keyboard ".

  function findProductByName(products, name) {
    if (typeof name !== "string") return undefined;

    const normalizedName = name.trim().toLowerCase();

    return products.find(
      product => product.name.trim().toLowerCase() === normalizedName
    );
  }
  
  
  // ROOT CAUSE 2: Incorrect low-stock boundary conditions
  // Problem: stock < threshold && stock > 0 excluded out-of-stock products
  // and products with stock exactly equal to the threshold.
  // Fix: Use stock <= threshold to include both boundary cases.
  // Expected: At threshold 5, Pen Pack (0), Yoga Mat (2), and Mouse (4)
  // are included. A product with exactly 5 units is also included.

  function lowStockProducts(products, threshold = 5) {
    return products.filter(product => product.stock <= threshold);
  }
  


// ROOT CAUSE 3 — Wrong sort key and mutation
// Original bug: sorted by stock using in-place .sort(), changing the original catalog.
// Fix: copy with spread syntax and sort numerically by price ascending.
// Check: prices ascend and the original product ID order remains unchanged.
function productsSortedByPrice(products) {
  return [...products].sort((a, b) => a.price - b.price);
}

// ROOT CAUSE 4 — Reversed category accumulators
// Original bug: productCount added stock while totalStock added one per product.
// Fix: increment productCount once and add each product.stock to totalStock.
// Check: Electronics reports 2 products and 16 units of stock.
function categorySummary(products) {
  const summary = {};
  for (const product of products) {
    if (!Object.hasOwn(summary, product.category)) {
      summary[product.category] = { productCount: 0, totalStock: 0 };
    }
    summary[product.category].productCount += 1;
    summary[product.category].totalStock += product.stock;
  }
  return summary;
}

// ROOT CAUSE 5 — Incomplete and incorrect revenue aggregation
// Original bug: slice(0, 1) considered only the first order and summed subtotal.
// Fix: inspect every order, count only valid orders, and sum final charged total.
// Check: two valid orders totaling 110.25 and 20.10 produce revenue 130.35.
function revenueSummary(processedOrders) {
  let totalRevenue = 0;
  let validOrders = 0;
  for (const order of processedOrders) {
    if (order.valid) {
      validOrders += 1;
      totalRevenue += order.total;
    }
  }
  return { validOrders, totalRevenue: Number(totalRevenue.toFixed(2)) };
}

module.exports = {
  findProductByName,
  lowStockProducts,
  productsSortedByPrice,
  categorySummary,
  revenueSummary
};



