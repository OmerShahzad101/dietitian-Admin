const stripe = require('stripe')(process.env.STRIPE_SERVER_TEST_KEY);

exports.create = async (req, res, next) => {
    try{
        // const {type, number, exp_month, exp_year, cvc} = req.body
        const createPayment = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "pkr",
                        product_data: {
                            name: "test product",
                        },
                        unit_amount: 100 * 100,
                    },
                    quantity: 2,
                },
            ],
            mode: "payment",
            success_url: `https://www.google.com`, // for test mode
            cancel_url: `https://www.facebook.com`, // for test mode
        });
        if(createPayment) return res.status(200).send({ success: true, message: "Payment successful" , data: createPayment });
        else return res.status(404).send({ success: false, message: "Payment failed" });
    } catch (error) {
        return next(error);
    }
}
