const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');
const Shovelee = mongoose.model('Shovelee');
const sms = require('../handlers/sms');
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_SANDBOX_CLIENT_ID,
  client_secret: process.env.PAYPAL_SANDBOX_SECRET
});

exports.pay = (req, res) => {
  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: `${req.protocol}://${req.get(
        'host'
      )}/listing/payment/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/listing/payment/cancel`
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: req.body.title,
              sku: req.listingId,
              price: req.listingPrice,
              currency: 'USD',
              quantity: 1
            },
            {
              name: 'ShovelPros Fees',
              sku: req.listingId,
              price: req.listingFee,
              currency: 'USD',
              quantity: 1
            }
          ]
        },
        amount: {
          currency: 'USD',
          total: req.listingTotal
        },
        description: `Job Type: ${req.body.shovelJob} - Address: ${
          req.body.address
        }`
      }
    ]
  };

  paypal.payment.create(create_payment_json, (err, payment) => {
    if (err) {
      for (let i = 0; i < err.response.details.length; i++) {
        console.log(err.response.details[i]);
      }
      console.log(err);
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
};

exports.execute = async (req, res) => {
  const payerId = { payer_id: req.query.PayerID };
  const paymentId = req.query.paymentId;
  paypal.payment.execute(paymentId, payerId, async (err, payment) => {
    if (err) console.error(JSON.stringify(err));
    else {
      if (payment.state == 'approved') {
        const listingId = payment.transactions[0].item_list.items[0].sku;
        const paymentId = payment.id;
        const transactionId =
          payment.transactions[0].related_resources[0].sale.id;
        const listing = await Listing.findById(listingId);
        const user = await Shovelee.findById(listing.shovelee);
        listing.active = true;
        listing.paymentId = paymentId;
        listing.transactionId = transactionId;
        await listing.save();
        sms.jobPostedMessage(listing.title, user.name, user.phone);
        req.flash('success', 'Payment completed successfully!');
        res.redirect(`/listing/${listingId}`);
      } else {
        req.flash('error', 'Payment not successful');
        res.redirect('/account');
      }
    }
  });
};

exports.payOutShoveler = (req, res) => {
  const sender_batch_id = Math.random()
    .toString(36)
    .substring(9);
  const companyFee = parseFloat(
    ((7.5 / 100) * req.listingPrice).toPrecision(2)
  );
  const payOutAmount = req.listingPrice - companyFee;
  const create_payout_json = {
    sender_batch_header: {
      sender_batch_id: sender_batch_id,
      email_subject: 'You have recieved a payment!'
    },
    items: [
      {
        recipient_type: 'EMAIL',
        amount: {
          value: payOutAmount,
          currency: 'USD'
        },
        receiver: `${req.user.paymentEmail}`,
        note: 'ShovelPros Payment',
        sender_item_id: req.listingId
      }
    ]
  };

  paypal.payout.create(create_payout_json, (err, payout) => {
    if (err) {
      for (let i = 0; i < err.response.details.length; i++) {
        console.log(err.response.details[i]);
      }
      console.log(err);
    } else {
      req.flash(
        'success',
        'Payout initiated, you should recieve the funds soon'
      );
      res.redirect('/account');
    }
  });
};
