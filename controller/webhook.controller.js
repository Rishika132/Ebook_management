
const { shopify } = require("../utils/shopify");

const Webhook = async (req, res) => {
  try {
    const order = req.body;
    console.log(order);
    const email = order.email;

    const existingCustomers = await shopify.customer.search({ query: `email:${email}` });

    if (existingCustomers.length > 0) {
      console.log(`👤 Customer already exists: ${email}`);
      return res.status(200).json({ message: "Customer already exists", email });
    }

    const customerData = {
      email,
      first_name: order.customer?.first_name || "Unknown",
      last_name: order.customer?.last_name || "",
      verified_email: true,
      send_email_welcome: true
    };

    const createdCustomer = await shopify.customer.create(customerData);

    console.log(`✅ Customer created: ${createdCustomer.id} (${email})`);
    return res.status(200).json({ message: "Customer created", email });

  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { Webhook };
