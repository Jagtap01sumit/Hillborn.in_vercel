const sdk = require("api")("@cashfreedocs-new/v2#5qon17l8k4gqrl");
const ErrorHandler = require("../utils/ErrorHandler");

exports.getClientDetails = async (req, res, next) => {
  const { price, email, phone, customerId ,name} = req.body;
  // const order_id = `${Math.random() * 100000000000000000 + "order"}`;
  try {
    await sdk.server("https://api.cashfree.com/pg/orders");
    sdk
      .CreateOrder(
        {
          order_id: `${Math.random() * 100000000000000000 + "order"}`,
          order_amount: price,
          order_currency: "INR",
          customer_details: {
            customer_id: customerId,
            customer_email: email,
            customer_phone: phone,
            customer_name:name,
          },
          order_meta: {
            // return_url: `https://localhost:3000/order_id={order_id}`,
            return_url: `https://wa.me/message/BZCLAKUBIOEWO1`,
            notify_url: "https://b8af79f41056.eu.ngrok.io/webhook.php",
          },
        },
        {
          "x-api-version": "2022-01-01",
          "x-client-id": process.env.PAY_CLIENT_ID,
          "x-client-secret": process.env.PAY_CLIENT_SECRET,
        }
      )
      .then((res) => {
        return res;
      })
      .then((data) => {
        if (data) {
          return res.status(200).json({
            success: true,
            data
          });
        }
      })
      .catch((error) => {
        return next(new ErrorHandler(error, error.status));
      });
  } catch (error) {
    return next(new ErrorHandler(error, error.status));
  }
};
