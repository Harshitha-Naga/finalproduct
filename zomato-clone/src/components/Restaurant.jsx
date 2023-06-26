import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Header from "./Header";
import { BASE_URL } from "./Api url";

const Restaurant = (props) => {
  let { id } = useParams();

  //to get restaurant detail by rest_id
  const [rDetails, setRDetails] = useState({});

  // to store menu items
  const [menuItemList, setMenuItemList] = useState([]);

  //to add and reduce the menuItems stored in Total
  const [total, setTotal] = useState(0);

  //addQty adding menuItems
  let addQty = (index) => {
    let _menuItemList = [...menuItemList];
    _menuItemList[index].qty += 1;
    let newTotal = _menuItemList[index].price + total;
    setTotal(newTotal);
    setMenuItemList(_menuItemList);
  };

  //removeQty adding menuItems
  let removeQty = (index) => {
    let _menuItemList = [...menuItemList];
    _menuItemList[index].qty -= 1;
    let newTotal = total - _menuItemList[index].price;
    setTotal(newTotal);
    setMenuItemList(_menuItemList);
  };

  //user details filled in form
  const [name, setName] = useState(props.user ? props.user.name : "");
  const [email, setEmail] = useState(props.user ? props.user.email : "");
  const [address, setAddress] = useState("Tamil nadu");
  const [phoneNo, setPhoneNo] = useState("9999999999");

  //main restaurant details fetching from server by axios method
  let getRestaurantDetails = async () => {
    let url = BASE_URL + "get-restaurant-details-by-restaurant-id/" + id;
    let { data } = await axios.get(url);
    setRDetails(data.restaurantList);
    console.log(data.restaurantList);
  };

  let [isContact, setIsContact] = useState(false);

  //main menu items details fetching from server by axios method
  let getMenuItems = async () => {
    let url = BASE_URL + "get-menu-items-by-restaurant-id/" + id;
    let { data } = await axios.get(url);
    setTotal(0);
    setMenuItemList(data.MenuItemsList);
    console.log(data.MenuItemsList);
  };

  //payment [razorpay]
  let makePayment = async () => {
    let url = BASE_URL + "gen-order-details"; //API from post method of order details
    let { data } = await axios.post(url, { amount: total });
    if (data.status === false) {
      alert("Unable to create order details");
      return false;
    }
    let { order } = data;
    var options = {
      key: "rzp_test_RB0WElnRLezVJ5", // Enter the Key ID generated from the Dashboard PUBLIC KEY
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Zomato-clone",
      description: "Online Food Delivery",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/b/bb/Square_zomato_logo_new.png?20180511061014",
      order_id: order.id, //This is a sample Order ID.//server order_id //SECRET KEY

      //Handling order details
      handler: async (response) => {
        //to save data
        let userOrders = menuItemList.filter((menu_item) => {
          //these are the order details saved in verify payment(server==Model(orderModel))
          return menu_item.qty > 0;
        });
        //to send data
        let sendData = {
          //pop-ups for pay_id, order_id, signature
          pay_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          signature: response.razorpay_signature, // WANT TO VERIFY this server_sign === client_sign [ALL THESE THREE POP-UP's]
          orders: userOrders, //these are the order details saved in verify payment(server==Model(orderModel))
          name: name,
          email: email,
          contact: phoneNo,
          address: address,
          totalAmount: total,
          rest_id: rDetails._id,
          rest_name: rDetails.name,
        };

        //verify payment axios post
        let url = BASE_URL + "verify-payment";
        let { data } = await axios.post(url, sendData); //data in payment controller
        if (data.status === true) {
          alert("Payment done Successfully");
        } else {
          alert("Payment Failed");
        }
      },
      prefill: {
        name: name,
        email: email,
        contact: phoneNo,
      },
    };
    var razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    razorpay.open();
  };

  useEffect(() => {
    //on mounting
    getRestaurantDetails();
    getMenuItems();
  }, []);

  return (
    <>
      {/*MODAL FOR CAROUSEL (i.e) click gallery*/}
      <div
        className="modal fade"
        id="slideShow"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg " style={{ height: "75vh " }}>
          <div className="modal-content">
            <div className="modal-body h-75">
              {rDetails.thumb ? (
                <Carousel showThumbs={false} infiniteLoop={true}>
                  {rDetails.thumb.map((value, index) => {
                    return (
                      <div key={index} className="w-100">
                        <img src={"/images/" + value} />
                      </div>
                    );
                  })}
                </Carousel>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* MENU ITEMS MODAL */}
      <div
        className="modal fade"
        id="modalMenuItem" //(modalMenuItem) should be same in id of MENU ITEM MODAL as (#modalMenuItem)
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">
                {rDetails.name} Menus
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body ">
              {menuItemList.map((item, index) => {
                return (
                  <div className="row p-2" key={index}>
                    <div className="col-8">
                      <p className="mb-1 h6">{item.name}</p>
                      <p className="mb-1">Rs. {item.price}</p>
                      <p className="small text-muted">{item.description}</p>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                      <div className="menu-food-item">
                        <img src={"/images/" + item.image} alt="" />
                        {/* if my qty is greater than 0 then show menu items details else show the ADD btn (i.e) ternary loop is used */}

                        {item.qty > 0 ? (
                          <div className="order-item-count section ">
                            <span
                              className="hand"
                              onClick={() => removeQty(index)}
                            >
                              -
                            </span>
                            <span>{item.qty}</span>
                            <span
                              className="hand"
                              onClick={() => addQty(index)}
                            >
                              +
                            </span>
                          </div>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm add"
                            onClick={() => addQty(index)}
                          >
                            ADD
                          </button>
                        )}
                      </div>
                    </div>
                    <hr className=" p-0 my-2" />
                  </div>
                );
              })}

              {/* the TOTAL is that [+ and -] we get that adding and reducing menuitems in Total  */}

              {/* this total we use LOOP because if total > 0 then only show total as footer of pop-up else hide it when 
               we click od ADD btn then the total automatically appears */}
              {total > 0 ? (
                <div className="d-flex justify-content-between">
                  <h3>Total {total}</h3>
                  <button
                    className="btn btn-danger"
                    data-bs-target="#userForm" // (#userForm) should be same in id of USER FORM MODAL as (userForm)
                    data-bs-toggle="modal"
                  >
                    Process
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* USER FORM MODAL */}
      <div
        className="modal fade"
        id="userForm" // (userForm) should be same in target of MENU ITEM MODAL as (#userForm)
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        {/* //FORM */}
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                {rDetails.name} User Form
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter full Name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Address
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value);
                  }}
                ></textarea>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Phone No
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter Phone No"
                  value={phoneNo}
                  onChange={(event) => {
                    setPhoneNo(event.target.value);
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                data-bs-target="#modalMenuItem" //(#modalMenuItem) should be same in id of USER FORM MODAL as (modalMenuItem)
                data-bs-toggle="modal"
              >
                Back
              </button>
              <button className="btn btn-success" onClick={makePayment}>
                Make Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row bg-danger justify-content-center">
          <Header user={props.user} />
        </div>
        {/* <!-- section -->  */}
        <div className="row justify-content-center">
          <div className="col-10">
            <div className="row">
              <div className="col-12 mt-5">
                <div className="restaurant-main-image position-relative">
                  <img src={"/images/" + rDetails.image} alt="" className="" />
                  <button
                    className="btn btn-outline-light position-absolute btn-gallery"
                    data-bs-toggle="modal"
                    data-bs-target="#slideShow"
                  >
                    Click To Get Image Gallery
                  </button>
                </div>
              </div>
              <div className="col-12">
                <h3 className="mt-4 name">{rDetails.name}</h3>
                <div className="d-flex justify-content-between">
                  <ul className="list-unstyled d-flex gap-3">
                    <li
                      className={
                        isContact === false
                          ? "border-bottom border-3 border-danger cursor-pointer"
                          : "hand"
                      }
                      onClick={() => setIsContact(false)}
                    >
                      Overview
                    </li>
                    <li
                      className={
                        isContact === true
                          ? "border-bottom border-3 border-danger "
                          : "hand"
                      }
                      onClick={() => setIsContact(true)}
                    >
                      Contact
                    </li>
                  </ul>

                  <button
                    className="btn btn-danger align-self-start"
                    data-bs-toggle="modal"
                    href="#modalMenuItem"
                    role="button"
                    onClick={getMenuItems}
                    disabled={props.user ? false : true}
                  >
                    {/* // here once we login only we can work with menu items else hide that menu items */}
                    {props.user ? " Menu Items" : "Login For Menu "}
                  </button>
                </div>

                <hr className="mt-0" />

                {isContact === false ? (
                  <div className="over-view">
                    <p className="h5 mb-4 name">About this place</p>
                    <p className="mb-0 fw-bold name">Cuisine</p>
                    <p className="name1">
                      {rDetails.cuisine
                        ? rDetails.cuisine
                            .map((value) => {
                              return value.name;
                            })
                            .join(", ")
                        : null}
                    </p>

                    <p className="mb-0 fw-bold name">MinCost</p>
                    <p className="name1">₹{rDetails.min_price}</p>
                  </div>
                ) : (
                  <div className="over-view">
                    <p className="mb-0 fw-bold name">Phone Number</p>
                    <p className="name1">{rDetails.contact_number}</p>

                    <p className="mb-0 fw-bold name">Address</p>
                    <p className="name1">
                      {rDetails.locality}, {rDetails.city}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Restaurant;
