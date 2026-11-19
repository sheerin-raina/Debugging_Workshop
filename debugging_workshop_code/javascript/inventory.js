function reserveInventory(products, order) {
    // bug 4: validates the entire order before modifying inventory.
    // Invalid orders should not cause partial stock updates.
    if (!order || !Array.isArray(order.items) ||
        order.items.length === 0) {
        return;
    }

    const requested = new Map();

    for (const item of order.items) {
       // bug 4: Reject invalid quantities.
        if (!item || !Number.isInteger(item.quantity) ||
            item.quantity <= 0) {
            return;
        }

        const product = products.find(
            p => p.id === item.productId
        );

        if (!product) {
            return;
        }

        const totalQuantity =
            (requested.get(item.productId) || 0) +
            item.quantity;

        // bug 3: Prevent negative inventory by checking available stock before reserving any items.
        if (totalQuantity > product.stock) {
            return;
        }

        requested.set(item.productId, totalQuantity);
    }


    for (const [productId, quantity] of requested) {
        const product = products.find(
            p => p.id === productId
        );

        // bug 2: subtract the actual purchased quantity
        product.stock -= quantity;
    }
}

function restockProduct(products, productId, amount) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    return null;
  }
// bug 1: Add incoming stock to existing inventory, instead of replacing the current stock.
  product.stock += amount;
  return product;
}

module.exports = {
  reserveInventory,
  restockProduct
};
