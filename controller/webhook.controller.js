const { shopify } = require("../utils/shopify");

const Webhook = async (req, res) => {
  try {
    const order = req.body;
    console.log("📦 Incoming order:", order.id);

    let email;

    // 🔍 Extract email from line item properties
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

    // 🔁 Fallback to order.email
    if (!email && order.email) {
      email = order.email.trim();
    }

    if (!email) {
      console.warn("⚠️ Email not found in order or line items");
      return res.status(400).json({ message: "Email not found in order or line items." });
    }

    // 🔍 Check if customer exists
    const existingCustomers = await shopify.customer.search({ query: `email:${email}` });

    if (existingCustomers.length > 0) {
      console.log(`👤 Customer already exists: ${email}`);
      return res.status(200).json({ message: "Customer already exists", email });
    }

    // ✅ Create new customer with email only
    const createdCustomer = await shopify.customer.create({ email });

    console.log(`✅ Customer created: ${createdCustomer.id} (${email})`);
    return res.status(200).json({ message: "Customer created", email });

  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { Webhook };
