
const { shopify } = require("../utils/shopify");

const Webhook = async (req, res) => {
  try {
    const order = req.body;
    console.log(order);
       let email;

    for (const item of order.line_items || []) {
      if (item.properties) {
        for (const prop of item.properties) {
          if (prop.name.toLowerCase() === "email" || prop.name.toLowerCase().includes("email")) {
            email = prop.value;
            break;
          }
        }
      }
      if (email) break;
    }

    // 🔁 If not found in line_items, fallback to order.email
    if (!email) {
      email = order.email;
    }

    if (!email) {
      return res.status(400).json({ message: "Email not found in order or line items." });
    }

    const existingCustomers = await shopify.customer.search({ query: `email:${email}` });

    if (existingCustomers.length > 0) {
      console.log(`👤 Customer already exists: ${email}`);
      return res.status(200).json({ message: "Customer already exists", email });
    }
 
    const createdCustomer = await shopify.customer.create(email);

    console.log(`✅ Customer created: ${createdCustomer.id} (${email})`);
    return res.status(200).json({ message: "Customer created", email });

  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { Webhook };
