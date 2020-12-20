const express = require('express')
const ejs = require('ejs')
const paypal = require('paypal-rest-sdk')

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Abx9eip8NMYAbzTDvwsZXwR8ZN1hxrHZiv6sycHpCKQoJjCpw_2Ph_KJ6yEmPgow5iSV-qnTAuPBlmbZ',
    'client_secret': 'EMsblehmrYEl_knQMXqqtlfpYPUshBZrMsdUjv4ifXHQIqyAX47WOzXzp4JUwIlJlI3wzHZKaZ7hctRt'
  });

const app = express()

app.set('veiw engine', 'ejs')

app.get('/', (req, res) => res.render('ppindex.ejs'))

app.get('/success', (req, res) => {


    const payerId = req.query.PayerID

    const paymentId = req.query.paymentId

    const execute_payment_json = {
        "payer_id": payerId,
        'transactions': [{
            "amount" : {
                "currency": "USD",
                "total": "5.00"
            }
            
        }]
    }

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if(error) {
            console.log(error.response)
            throw error
        } else {
            console.log('Get Payment Response')
            console.log(JSON.stringify(payment))
            res.render('ppindex.ejs')
        }
    })
})

app.get('/fail', (req, res) => res.send('Donation Failed! Please Try Again.'))


//postmethod that takes you to the paypal website
app.post('/pay', (req, res) => {

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3001/success",
            "cancel_url": "http://localhost:3001/fail"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Donation",
                    "sku": "item",
                    "price": "5.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "5.00"
            },
            "description": "$5 Donation to How-Was-School"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0; i < payment.links.length; i++){
                if(payment.links[i].rel === 'approval_url')
                res.redirect(payment.links[i].href)

            }
        }
    });
    
})

app.listen(3001, () => console.log('Server Started'))