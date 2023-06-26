const OrderModel = require("../Model/OrderModel");
const Razorpay = require("razorpay");
const KEY_ID = "rzp_test_RB0WElnRLezVJ5"; //public key
const KEY_SECRET = "VLMCIrqKxRMNR9EcRcbL2UG8"; //private key
var crypto = require("crypto"); //IS USED BY REACT FOR VERIFYING the SIGNATURE
let instance = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

module.exports.genOrderDetails = (request, response) => {
  let data = request.body; // send this amount from react to express

  var options = {
    amount: data.amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_receiptId_11",
  };
  instance.orders.create(options, function (error, order) {
    if (error) {
      let errorObj = { status: false, error };
      response.status(500).send(errorObj);
    } else {
      let sendData = {
        status: true,
        order,
      };
      response.status(200).send(sendData);
    }
  });
};

module.exports.verifyPayment = async (request, response) => {
  let { pay_id, order_id, signature } = request.body;
  let data = request.body; //data is client
  let payment_data = order_id + "|" + pay_id;

  var serverSignature = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(payment_data.toString())
    .digest("hex");
  // console.log("sig received ", signature);
  // console.log("sig generated ", serverSignature);
  //serverSignature+1 ==> payment failed pop up comes (i.e)signature is added by 1 so
  if (serverSignature === signature) {
    // order details
    await saveOrder(data);
    response.send({
      status: true,
    });
  } else {
    response.send({
      status: false,
    });
  }
};
//To save data in database so created instance
let saveOrder = async (data) => {
  // save a data in database
  // here data variable is an {} & it's a client data
  // save single data
  let saveData = {
    pay_id: data.pay_id,
    order_id: data.order_id,
    signature: data.signature,
    orders: data.orders,
    name: data.name,
    email: data.email,
    contact: data.contact,
    address: data.address,
    totalAmount: data.totalAmount,
    rest_id: data.rest_id,
    rest_name: data.rest_name,
  };
  // save in data in database
  let newOrder = new OrderModel(saveData); //Schema in OrderModel
  let result = await newOrder.save();

  if (result) {
    return true;
  } else {
    return false;
  }
};
