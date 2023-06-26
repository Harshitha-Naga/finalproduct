import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Search from "./components/Search";
import Restaurant from "./components/Restaurant";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./components/Api url";

function App() {
  //user details for login
  let getUserDetails = () => {
    // get data from local storage if inspect Application token given wrong then it returns null
    let token = localStorage.getItem("zc_token");
    if (token === null) {
      return null;
    } else {
      try {
        let data = jwt_decode(token);
        return data;
      } catch (error) {
        return null;
      }
    }
  };

  //state for login
  let [user, setUser] = useState(getUserDetails());

  //props
  let [locationList, setLocationList] = useState([]);
  let getLocationList = async () => {
    try {
      let url = BASE_URL + "get-location-list";
      let { data } = await axios.get(url);
      setLocationList(data.locationList); //updating locationList which is in API
    } catch (error) {
      alert("server error");
    }
  };
  useEffect(() => {
    getLocationList();
    console.log(user); //for login
  }, []);

  return (
    <>
      <Routes>
        {/* //user is passed as props (i.e* data or null if token correct means data comes or else null comes)  //dynamic url */}
        <Route
          path="/"
          element={<Home locationList={locationList} user={user} />}
        />
        <Route
          path="/search/:id/:name"
          element={<Search locationList={locationList} user={user} />}
        />
        <Route path="/restaurant/:id" element={<Restaurant user={user} />} />
      </Routes>
    </>
  );
}

export default App;
