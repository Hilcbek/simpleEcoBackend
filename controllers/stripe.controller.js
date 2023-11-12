import Stripe from 'stripe'
import expressAsync from 'express-async-handler'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
app.use(
  cors({
    origin: ["http", "http://localhost:5173"],
    credentials: true,
  })
);
let stripe = new Stripe(process.env.Stripe_key);
export let Payment = expressAsync(async (req,res,next) => {
    let { products } = req.body;
    try {
        let session = await stripe.checkout.sessions.create({
            line_items : [
                {
                   price_data : {
                    currency : "usd",
                    product_data : {
                        name : "Bekas",
                    },
                    unit_amount : 2000
                   },
                   quantity : 1
                }
            ],
            mode : 'payment',
            success_url : "http://localhost:5173/success",
            cancel_url : 'http://localhost:5173/cancel'
        })
        res.redirect(303,session.url)
    } catch (error) {
        next(error)
    }
})