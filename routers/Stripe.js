import dotenv from 'dotenv'
import Stripe from 'stripe'
import asyncHandler from 'express-async-handler'
import cors from 'cors'
dotenv.config();
let stripe = Stripe(process.env.Stripe_key);
import express from 'express'
export let routerStripe = express.Router()
routerStripe.post("/create-checkout-session",asyncHandler( async (req, res) => {
    let lineItems = req.body.products.map((product) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product?.title,
            description: String(product?.desc).substring(
              0,
              String(product?.desc).length - String(product?.desc).length / 5
            ),
          },
          unit_amount: product?.price * 100,
        },
        quantity: product?.quantity,
      };
    });
  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `http://localhost:5173/success`,
    cancel_url: `http://localhost:5173`,
  });

  res.send({url : session.url});
}));
