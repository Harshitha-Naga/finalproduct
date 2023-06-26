// used as instance in payment controller
//to save this in database (i.e) by deleting the order collections we once done payment then the userOrders is shown in mongoDB
//compass with what payment we have done that order details is in the compass
//(i.e) order details is not manually created it will be there only when payment is done
//schema
const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  pay_id: { type: String },
  order_id: { type: String },
  signature: { type: String },
  orders: { type: Array },
  name: { type: String },
  email: { type: String },
  contact: { type: String },
  address: { type: String },
  totalAmount: { type: Number },
  rest_id: { type: mongoose.Schema.Types.ObjectId },
  rest_name: { type: String },
});
//model
const OrderModel = mongoose.model("order", OrderSchema, "userOrders"); //this userOrders in restaurant.jsx
//export
module.exports = OrderModel;
