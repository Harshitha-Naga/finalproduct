const RestaurantModel = require("../Model/RestaurantModel");
const MenuItemsModel = require("../Model/MenuItemsModel");
module.exports.getRestaurantListByLocationId = async (request, response) => {
  //id is used for locations because if location name changed means also id will not change
  // Bombay 1 ==> Mumbai <==> New Mumbai
  let { loc_id } = request.params; //to filter by location_id
  try {
    //projections are used ==> find({filter},{projections})
    //to get restaurant details as(img, locality, cityName, id's )by cityName
    let filter = { location_id: loc_id }; //location_id === loc_id(this is uri)
    let projection = {
      name: 1,
      city: 1,
      image: 1,
      location_id: 1,
      city_id: 1,
      locality: 1,
    };
    let restaurantList = await RestaurantModel.find(filter, projection); //find(filter,projections)

    let sendData = {
      status: restaurantList.length === 0 ? false : true,
      restaurantList,
      count: restaurantList.length,
    };
    response.status(200).send(sendData);
  } catch (error) {
    let errorObj = { status: false, error };
    response.status(500).send(errorObj);
  }
};

module.exports.getRestaurantDetailsByRestaurantId = async (
  request,
  response
) => {
  let { id } = request.params;
  try {
    let restaurantList = await RestaurantModel.findById(id); // findById----for finding restaurant_id (primary_id)--finding

    let sendData = {
      status: restaurantList.length === 0 ? false : true,
      restaurantList,
      count: restaurantList.length,
    };
    response.status(200).send(sendData);
  } catch (error) {
    let errorObj = { status: false, error };
    response.status(500).send(errorObj);
  }
};

module.exports.getMenuItemsByRestaurantId = async (request, response) => {
  let { r_id } = request.params;
  try {
    let MenuItemsList = await MenuItemsModel.find({ restaurantId: r_id });
    let sendData = {
      status: MenuItemsList.length === 0 ? false : true,
      MenuItemsList,
      count: MenuItemsList.length,
    };
    response.status(200).send(sendData);
  } catch (error) {
    let errorObj = { status: false, error };
    response.status(500).send(errorObj);
  }
};

//POST METHOD

module.exports.filter = async (request, response) => {
  //required filter and sort part
  let { mealType_id, loc_id, lCost, hCost, sort, page, cuisine } = request.body;

  //page
  page = page ? page : 1;
  itemsPerPage = 2;
  itemsPerPage = itemsPerPage ? itemsPerPage : 2;
  let startIndex = page * itemsPerPage - itemsPerPage;
  let endIndex = page * itemsPerPage;

  let filter = {};
  //to get all data from server

  //mealType
  if (mealType_id !== undefined) filter["mealtype_id"] = mealType_id;

  //location_id
  if (loc_id !== undefined) filter["location_id"] = loc_id;

  //min_price
  if (lCost !== undefined && hCost !== undefined) {
    filter["min_price"] = { $lt: hCost, $gt: lCost };
  }

  //cuisine
  if (cuisine !== undefined) filter["cuisine_id"] = { $in: cuisine };
  console.log(filter);

  try {
    let RestaurantList = await RestaurantModel.find(filter).sort({
      min_price: sort,
    });

    const filterResult = RestaurantList.slice(startIndex, endIndex);

    let sendData = {
      status: RestaurantList.length === 0 ? false : true,
      RestaurantList: filterResult,
      RestaurantList,
    };
    response.status(200).send(sendData);
  } catch (error) {
    let errorObj = { status: false, error };
    response.status(500).send(errorObj);
  }
};
