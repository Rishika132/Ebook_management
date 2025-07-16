// const { shopify } = require("../utils/shopify");

// const Webhook = async (req, res) => {
//   try {
//     const { order } = req.body; 
//     console.log("📦 Incoming order:", order.id);

//     let email;

//     for (const item of order.line_items || []) {
//       if (Array.isArray(item.properties)) {
//         for (const prop of item.properties) {
//           if (
//             typeof prop.name === "string" &&
//             prop.name.trim().toLowerCase() === "email" &&
//             typeof prop.value === "string"
//           ) {
//             email = prop.value.trim();
//             break;
//           }
//         }
//       }
//       if (email) break;
//     }

//     // 🔁 Fallback to order.email if not found in line_items
//     if (!email && order.email) {
//       email = order.email.trim();
//     }

//     if (!email) {
//       console.warn("⚠️ Email not found in order or line items");
//       return res.status(400).json({ message: "Email not found in order or line items." });
//     }

//     // 🔍 Check if customer already exists
//     const existingCustomers = await shopify.customer.search({ query: `email:${email}` });

//     if (existingCustomers.length > 0) {
//       console.log(`👤 Customer already exists: ${email}`);
//       return res.status(200).json({ message: "Customer already exists", email });
//     }

//     // ✅ Create customer with email
//     const createdCustomer = await shopify.customer.create({ email });

//     console.log(`✅ Customer created: ${createdCustomer.id} (${email})`);
//     return res.status(200).json({ message: "Customer created", email });

//   } catch (err) {
//     console.error("❌ Webhook Error:", err.message);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = { Webhook };


const { shopify } = require("../utils/shopify");

const Webhook = async (req, res) => {
  try {
    const { order } = req.body; 
    console.log("📦 Incoming order:", order.id);

    let email;

    // 🔍 Search for email in line_items properties
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

    // 🔍 Check if customer already exists
    const existingCustomers = await shopify.customer.search({ query: `email:${email}` });

    if (existingCustomers.length > 0) {
      console.log(`👤 Customer already exists: ${email}`);
      return res.status(200).json({ message: "Customer already exists", email });
    }

    // 🧾 Get additional info if available
    const first_name = order.billing_address?.first_name || "Shopify";
    const last_name = order.billing_address?.last_name || "Customer";
    const phone = order.billing_address?.phone || undefined;

    // ✅ Create customer with full details
    const createdCustomer = await shopify.customer.create({
      email,
      first_name,
      last_name,
      phone,
      verified_email: true,
      tags: "auto-created",
    });

    console.log(`✅ Customer created: ${createdCustomer.id} (${email})`);
    return res.status(200).json({ message: "Customer created", email });

  } catch (err) {
    console.error("❌ Webhook Error:", err.response?.body || err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { Webhook };
