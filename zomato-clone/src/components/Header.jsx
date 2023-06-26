import { GoogleOAuthProvider } from "@react-oauth/google"; //for login
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode"; //token
const Header = (props) => {
  // LOGIN/ SIGN UP
  let onSuccess = (credentialResponse) => {
    //console.log(credentialResponse.credential); ==> it will lik ea JWT(JSON Web Token) token
    // JWT TOKEN IS USED
    let token = credentialResponse.credential; //token is a generated string
    try {
      let data = jwt_decode(token);
      //to save data in browser ======= (i.e) to store token in local storage(inspect---Application---local storage there)
      localStorage.setItem("zc_token", token); //("key",data)
      //reload entire page (should come to HOME PAGE)
      alert("Login Successful");
      window.location.assign("/"); //automatically navigates to home page
    } catch (error) {
      console.log(error);
      //remove data from local storage
      localStorage.removeItem("zc_token");
    }
  };
  let onError = () => {
    console.log("Login Failed");
  };

  //LOGOUT/ SIGN OUT
  let logout = () => {
    let isLogout = window.confirm("Are you sure want to Logout"); //confirmation for logout
    if (isLogout) {
      localStorage.removeItem("zc_token"); //onclick is used in logout button
      window.location.reload();
    }
  };
  return (
    <>
      <GoogleOAuthProvider clientId="228299863552-nf2oke2p0h46lj5o1b7m2la76qike4m2.apps.googleusercontent.com">
        <div
          className="modal fade"
          id="login-sign-up"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Login/ SignUp
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <GoogleLogin onSuccess={onSuccess} onError={onError} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-10 d-flex justify-content-between py-2">
          {props.logo === false ? <p></p> : <p className="m-0 brand">e!</p>}

          <div>
            {props.user ? (
              <>
                <button className="btn btn-light">
                  Welcome, {props.user.name}
                </button>
                <button className="btn btn-light mx-2" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <button
                className="btn  btn-outline-light"
                data-bs-toggle="modal"
                data-bs-target="#login-sign-up"
              >
                Login/ Sign UP
              </button>
            )}
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};
export default Header;
