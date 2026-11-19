const { applyDiscounts } = require("./discounts");
const { reserveInventory } = require("./inventory");
const { findCustomerById, findProductById, validateOrder } = require("./validators");

function calculateSubtotal(order, products) {
  let subtotal = 0;

  for (const item of order.items) {
    const product = findProductById(products, item.productId);
    if (!product) continue;

    /*
    Root Cause #1: Incorrect Subtotal Formula

    Acording to 1. Validation and order processing, the accepted orders formula is
    product price * ordered quantity. Subtotal variable was fixed
    */
    subtotal += product.price * item.quantity;
  }

  return Number(subtotal.toFixed(2));
}

    /*
    Root Cause #3: Tax Rate for Incorrect States 
    
    Customers in states not listed in the table were charged a default 7%,
    and customers with no state were charged NJ's rate. I changed this so that
    only NJ, NY, and PA are taxed, and any other or missing state is 0%. I deleted the
    or NJ for const state because so that a missing state isn't treated as NJ
    and replaced || 0.07 with ?? 0 so any state not in the table gets a 0% rate.

    */
function calculateTax(customer, discountedSubtotal, taxRates) {
  const state = customer.state;
  const rate = taxRates[state] ?? 0;
  return Number((discountedSubtotal * rate).toFixed(2));
}

function calculateShipping(discountedSubtotal) {
  if (discountedSubtotal > 100) {
    return 0;
  }
  return 8.99;
}

function processOrder(order, products, customers, taxRates) {
  const customer = findCustomerById(customers, order.customerId);
  const errors = validateOrder(order, products, customers);

  const subtotal = calculateSubtotal(order, products);
  const discounts = applyDiscounts(order, customer, products, subtotal);

  /*
    Root Cause #2: Incorrect Pre-Discount Subtotal Calculation

    Originally, the tax and shipping variables were calculating the tax while passing the subtotal variable instead of the discounted 
    subtotal variable. So, I replaced subtotal in both formulas with 'discounts.discountedSubtotal'.
    */
  const tax = calculateTax(customer, discounts.discountedSubtotal, taxRates);
  const shipping = calculateShipping(discounts.discountedSubtotal);

  const total = discounts.discountedSubtotal + tax + shipping;

  reserveInventory(products, order);

  return {
    orderId: order.id,
    customer: customer ? customer.name : "UNKNOWN",
    valid: errors.length === 0,
    errors,
    subtotal: Number(subtotal.toFixed(2)),
    discounts,
    tax: Number(tax.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    total: Number(total.toFixed(2))
  };
}

module.exports = {
  calculateSubtotal,
  calculateTax,
  calculateShipping,
  processOrder
};
