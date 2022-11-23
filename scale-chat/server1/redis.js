const { createClient } = require("redis");

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

const subscriber = client.duplicate();
const publisher = client.duplicate();

(async () => {
  await subscriber.connect();
  await publisher.connect();
})();

module.exports = {
  subscriber,
  publisher,
};
