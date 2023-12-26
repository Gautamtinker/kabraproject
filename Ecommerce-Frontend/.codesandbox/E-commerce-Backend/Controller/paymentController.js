import stripe from "stripe";
import asyncErrorHandler from "../middleware/asyncError.js";

const stripeInst = stripe(
  "sk_test_51NnKfuSJR2WoDGPi2jHzxiipIoNy8sEsoaxkyawP1ZKQ0W9ZNKDjszMQIFQyxRNQkm31o9BDOqFwTGAFdrhQM1gJ00l1pgOuaZ"
);

var latestSession;

const payment = asyncErrorHandler(async (req, res) => {
  console.log("in payment");
  const session = await stripeInst.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Total Price",
            // You can add more product details as needed
          },
          unit_amount: req.body.totalPrice * 100, // Amount in cents (e.g., $9.99 is 999 cents)
        },
        quantity: 1,
      },
    ],
    success_url:
      "https://ecommerce-frontend-one-rho.vercel.app/sucess?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://mail.google.com/",
  });

  //session.success_url = `http://localhost:3000/sucess?session_id=${session.id}`;

  latestSession = session;

  console.log(session);
  res.json({ id: session.id, session: session });
});

const getSession = asyncErrorHandler(async (req, res) => {
  console.log("get session call");
  res.json({
    latestSession,
  });
});

export { payment, getSession };
