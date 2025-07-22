require("dotenv").config();
const Shopify = require("shopify-api-node");
if (!process.env.SHOPIFY_STORE || !process.env.SHOPIFY_ACCESS_TOKEN) {
  throw new Error("Missing required Shopify environment variables");
}
const shopify = new Shopify({
  shopName: process.env.SHOPIFY_STORE,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN
});
module.exports = { shopify };
