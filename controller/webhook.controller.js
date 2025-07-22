const { shopify } = require("../utils/shopify");
const Webhook = async (req, res) => {
  try {
    const order = req.body; 
    let email;
    for (const item of order.line_items || []) {
      if (Array.isArray(item.properties)) {
        for (const prop of item.properties) {
          if (
            typeof prop.name === "string" &&
            prop.name.trim().toLowerCase() === "email" &&
            typeof prop.value === "string"
          ) {
            email = prop.value.trim();
            break;
          }
        }
      }
      if (email) break;
    }
    if (!email && order.email) {
      email = order.email.trim();
    }
    if (!email) {
      return res.status(400).json({ message: "Email not found in order or line items." });
    }
    const existingCustomers = await shopify.customer.search({ query: `email:${email}` });
    if (existingCustomers.length > 0) {
      return res.status(200).json({ message: "Customer already exists", email });
    }
    const createdCustomer = await shopify.customer.create({ email });
    console.log(` Customer created: ${createdCustomer.id} (${email})`);
    return res.status(200).json({ message: "Customer created", email });

  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { Webhook };
