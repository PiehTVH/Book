"use strict";
const { VNPay } = require("vnpay");
const paypal = require("paypal-rest-sdk");
const {
  payment: { paypal_data, vnpay_data },
} = require("../configs/config");

class PaymentService {
  //paypal
  static paypal = async ({ urlReturn, urlCancel, totalPrice, description }) => {
    const EXCHANGE_CURRENCY = 25000;
    paypal.configure({
      mode: "sandbox", //sandbox or live
      client_id: paypal_data.clientId,
      client_secret: paypal_data.clientSecret,
    });

    var create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: urlReturn, //"http://127.0.0.1:5173/order-detail/1"
        cancel_url: urlCancel,
      },
      transactions: [
        {
          amount: {
            currency: "USD",
            total: (totalPrice / EXCHANGE_CURRENCY).toFixed(2),
          },
          description,
        },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          reject(error);
        } else {
          resolve({
            method: "paypal",
            paymentUrl: payment.links[1].href,
          });
        }
      });
    });
  };

  //vnpay
  static vnpay = async ({ orderId, urlReturn, totalPrice, description }) => {
    const vnpay = new VNPay({
      tmnCode: vnpay_data.clientId,
      secureSecret: vnpay_data.clientSecret,
      api_Host: vnpay_data.apiHost,
      // testMode: true, // optional
      hashAlgorithm: "SHA512", // optional
    });

    const urlString = vnpay.buildPaymentUrl({
      vnp_Amount: totalPrice.toFixed(2),
      vnp_IpAddr: "1.1.1.1",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: description,
      vnp_OrderType: "other",
      vnp_ReturnUrl: urlReturn, //`http://127.0.0.1:5173/order-detail/1`,
    });
    // redirect to payment url if you use a server like MVC or SSR
    // res.redirect(urlString);

    // Or return payment url to front-end client if you use a back-end server
    return { method: "vnpay", paymentUrl: urlString };
  };
}

module.exports = PaymentService;
