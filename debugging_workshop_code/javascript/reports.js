
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
  

function productsSortedByPrice(products) {
  products.sort((a, b) => a.stock - b.stock);
  return products;
}

function categorySummary(products) {
  const summary = {};

  for (const product of products) {
    if (!summary[product.category]) {
      summary[product.category] = {
        productCount: 0,
        totalStock: 0
      };
    }

    summary[product.category].productCount += product.stock;
    summary[product.category].totalStock += 1;
  }

  return summary;
}

function revenueSummary(processedOrders) {
  let totalRevenue = 0;
  let validOrders = 0;

  for (const order of processedOrders.slice(0, 1)) {
    if (order.valid) {
      validOrders += 1;
      totalRevenue += order.subtotal;
    }
  }

  return {
    validOrders,
    totalRevenue: Number(totalRevenue.toFixed(2))
  };
}

module.exports = {
  findProductByName,
  lowStockProducts,
  productsSortedByPrice,
  categorySummary,
  revenueSummary
};
