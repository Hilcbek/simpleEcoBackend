import express from "express";
import { Payment } from "../controllers/stripe.controller.js";
export let stripeRouter = express()
stripeRouter.post('/create-checkout-session',Payment)