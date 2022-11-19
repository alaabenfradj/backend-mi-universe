const express = require("express");
const { auth } = require("../lib/utils");
const { verifyTokenAdmin } = require("../middleware/verifyToken");
const paiment = require("../models/paiment");
const event = require("../models/event")



var router = express.Router();

// This is your test secret API key.
const stripe = require("stripe")('sk_test_51KnZ9PJNoRIV4UsgutLDZSdjrxVjSXSdwuzoUpxSL3KJZePn4Uc2lt0q3hUmljhc6yIBalmssxB6iV8ZBACajxKQ00CnHmN9iW');



const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    let subtotal = items;
    let taxes = items * 5 / 100;
    return subtotal + taxes + 5;
};

router.post("/create-payment-intent", async (req, res) => {
    const { amount } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(calculateOrderAmount(amount)),
        currency: "eur",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
        paymentIntent
    });
});

router.post("/add", async (req, res) => {
    let products=req.body.products;
    products.forEach(prod => {
        const event1 = new event({
            userToken:req.body.customer,
            ObjectID:prod,
            eventType:"conversion",
            eventName:"Product add to cart"

        })
        event1.save();
            });
                
           
    new paiment({ ...req.body })
        .save()
        .then((paiment) => {
            
           
            
            return res.status(201).json({
                success: true,
                message: "paiment created !",
                paiment: paiment,
            });
           
        })
        .catch((err) => {
            return res.status(500).json({ success: false, message: err.message });
        });

});






router.get("/invoices", [auth, verifyTokenAdmin], async (req, res) => {
    try {
        const invoices = await paiment.find().populate("customer")
        if (!invoices) {
            return res.status(500).json({ success: false, invoices: [] });;
        }
        return res.status(200).json({ success: true, invoices: invoices });
    } catch (error) {
        res.status(500).json(error.message);
    }
});
router.get("/:id", [auth], async (req, res) => {
    try {
        const invoice = await paiment.findOne({ paymentId: req.params.id }).populate("customer").populate("products");
        if (!invoice) {
            return res.status(500).json({ success: false, invoice: null });;
        }
        return res.status(200).json({ success: true, invoice: invoice });
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.get("/", [auth], async (req, res) => {
    try {
        const invoices = await paiment.find({ customer: req.user._id }).populate("products");
        if (!invoices) {
            return res.status(500).json({ success: false, invoices: null });;
        }
        return res.status(200).json({ success: true, invoices: invoices });
    } catch (error) {
        res.status(500).json(error.message);
    }
});
router.delete("/:id", [auth], async (req, res) => {
    paiment.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) {
            res.status(500).json({ success: false })
        }
        else {
            res.status(200).json({ success: true })
        }
    })
});

module.exports = router;