import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import axios from "axios";
import "./css/EachProduct.css";
import { Button } from "@material-ui/core";
import RedeemShopSidebar from "./RedeemShopSidebar";
import Modal from "react-responsive-modal";
import CloseIcon from "@material-ui/icons/Close";
import Page404 from "./Page404";

function EachProduct() {
  const user = useSelector(selectUser);
  const [eachProduct, setEachProduct] = useState();
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState(0);
  const [pincode, setPincode] = useState(0);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");

  const [isModalOpen, setisModalOpen] = useState(false);
  const close = <CloseIcon />;
  const { slug } = useParams();
  const isMounted = true;
  const [userDetails, setUserDetails] = useState([]);

  useEffect(async () => {
    if (user && isMounted) {
      await axios
        .get("/api/products/getproductbyslug/" + slug)
        .then((res) => {
          console.log(res.data.data);
          setEachProduct(res.data.data);
          if (res.data.data.length === 0) window.location.href = "/page-404";
        })
        .catch((e) => {
          console.log(e);
        });
      await axios
        .get("/api/userDetails/getuserbyid/" + user.uid)
        .then((res) => {
          console.log(res.data.data);
          setUserDetails(res.data.data);
        })
        .catch((e) => {
          console.log(e, "Error fetching user details from username");
        });
    }
  }, []);

  useEffect(() => {
    return () => {
      setUserDetails([]);
      setEachProduct();
      setisModalOpen(false);
      setFullName("");
      setMobileNumber("");
      setPincode("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setCountry("India");
    };
  }, []);

  const handleOrder = async (e) => {
    let flag = 1;
    const indianPhoneNumberRegex =
      /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/gm;

    const indianPincodeRegex = /^[1-9][0-9]{5}$/gm;

    let noWhiteFullName = fullName.replace(/^\s+|\s+$/g, "");
    setFullName(noWhiteFullName);

    let checkMobileNumber = indianPhoneNumberRegex.test(mobileNumber);

    let checkPincode = indianPincodeRegex.test(pincode);

    let noWhiteAddressLine1 = addressLine1.replace(/^\s+|\s+$/g, "");
    setAddressLine1(noWhiteAddressLine1);

    let noWhiteAddressLine2 = addressLine2.replace(/^\s+|\s+$/g, "");
    setAddressLine2(noWhiteAddressLine2);

    let noWhiteCity = city.replace(/^\s+|\s+$/g, "");
    setCity(noWhiteCity);

    let noWhiteState = state.replace(/^\s+|\s+$/g, "");
    setState(noWhiteState);

    let noWhiteCountry = country.replace(/^\s+|\s+$/g, "");
    setCountry(noWhiteCountry);

    if (noWhiteFullName.length < 6 || noWhiteFullName.length > 50) {
      document.querySelector(".full_name_length_error").style.display = "block";
      flag = 0;
    }
    if (noWhiteAddressLine1.length < 6 || noWhiteAddressLine1.length > 100) {
      document.querySelector(".address_line1_length_error").style.display =
        "block";
      flag = 0;
    }
    if (noWhiteAddressLine2.length < 6 || noWhiteAddressLine2.length > 100) {
      document.querySelector(".address_line2_length_error").style.display =
        "block";
      flag = 0;
    }
    if (noWhiteCity.length < 2 || noWhiteCity.length > 30) {
      document.querySelector(".city_length_error").style.display = "block";
      flag = 0;
    }
    if (noWhiteState.length < 2 || noWhiteState.length > 30) {
      document.querySelector(".state_length_error").style.display = "block";
      flag = 0;
    }
    if (noWhiteCountry.length < 2 || noWhiteCountry.length > 30) {
      document.querySelector(".country_length_error").style.display = "block";
      flag = 0;
    }

    // e.preventDefault();
    if (
      flag &&
      noWhiteFullName !== "" &&
      checkMobileNumber &&
      checkPincode &&
      noWhiteAddressLine1 !== "" &&
      noWhiteAddressLine2 !== "" &&
      noWhiteCity !== "" &&
      noWhiteState !== "" &&
      noWhiteCountry !== ""
    ) {
      if (
        eachProduct &&
        userDetails &&
        userDetails.xp > eachProduct[0].productPrice
      ) {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        let tempProductId = eachProduct[0]._id;
        const body = {
          user: user,
          productId: tempProductId,
          fullName: noWhiteFullName,
          mobileNumber: mobileNumber,
          pincode: pincode,
          addressLine1: noWhiteAddressLine1,
          addressLine2: noWhiteAddressLine2,
          city: noWhiteCity,
          state: noWhiteState,
          country: noWhiteCountry,
          orderStatus: "Order placed Successfully!",
        };
        let orderSuccess = await axios
          .post("/api/orderDetails/", body, config)
          .then((res) => {
            console.log("Order placed successfully");
            return true;
          })
          .catch((e) => {
            console.log(e);
            alert("FAILED! Try again");
          });
        let xp = userDetails.xp;
        xp -= eachProduct[0].productPrice;
        if (orderSuccess) {
          const body = {
            xp: xp,
          };
          await axios
            .put("/api/userDetails/updateUserDetails/" + user.uid, body, config)
            .then((res) => {
              console.log("User xp deducted");
              alert("Order Placed Successfully");
              window.location.href = "/redeemShop/your-orders";
            })
            .catch((e) => {
              console.log(e);
              alert("Error in deducting xp");
            });
        }
      } else {
        alert("Sorry, you donot have enough XP!");
      }
    } else {
      console.log("inside else");
      alert("Please fill all the details properly!");
    }
  };

  return (
    <div className="each_product">
      <RedeemShopSidebar />
      <div className="each_product_container">
        <div className="each_product_left">
          <img
            className="each_product_pic"
            src={
              "/img/productprofilepics/" +
              (eachProduct ? eachProduct[0].productProfilePic : "")
            }
            alt=""
          />
        </div>
        <div className="each_product_right">
          <h1 className="each_product_title">
            {eachProduct ? eachProduct[0].productName : ""}
          </h1>
          <div className="each_product_features_wrapper">
            <h3 className="each_product_desc_features">Features</h3>
            <pre className="each_product_desc_text">
              {eachProduct ? eachProduct[0].productDesc : ""}
            </pre>
          </div>
          <div className="each_product_stock_wrapper">
            <h4 className="each_product_av">Availability:&nbsp;</h4>
            <p className="each_product_stock">
              {eachProduct
                ? eachProduct[0].productStock >= 1
                  ? "In Stock"
                  : "Out Of Stock"
                : ""}
            </p>
          </div>
          <div className="each_product_price_wrapper">
            <h4 className="each_product_price_title">XP:&nbsp;</h4>
            <p className="each_product_price_text">
              {eachProduct ? eachProduct[0].productPrice : ""}
            </p>
          </div>
          <Button
            onClick={() => {
              if (
                eachProduct &&
                userDetails &&
                userDetails.xp > eachProduct[0].productPrice
              ) {
                setisModalOpen(true);
              } else {
                alert("Sorry, you donot have enough XP!");
              }
            }}
            className="each_product_btn"
          >
            Get this product!
          </Button>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        closeIcon={close}
        center
      >
        <div className="address_modal">
          <div className="address_modal_wrapper">
            <div className="address_header">
              <h3>Enter shipping details</h3>
              <p>Please double check your address and pincode</p>
            </div>
            <div className="address_modal_fields">
              <div className="address_modal_full_name_wrapper">
                <label
                  className="login-field-label"
                  htmlFor="address_modal_full_name"
                >
                  Full Name
                  <span className="required_star">*</span>
                </label>
                <input
                  placeholder="Enter full name"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    document.querySelector(
                      ".full_name_length_error"
                    ).style.display = "none";
                  }}
                  name="address_modal_full_name"
                  id="address_modal_full_name"
                />
                <p className="full_name_length_error first_time_login_error">
                  Full name character length must be between 6 to 50
                </p>
              </div>

              <div className="mobile_pincode_wrapper">
                <div className="address_modal_mobile_number_wrapper">
                  <label
                    className="login-field-label"
                    htmlFor="address_modal_mobile_number"
                  >
                    Mobile Number (Indian only)
                    <span className="required_star">*</span>
                  </label>
                  <input
                    placeholder="Enter mobile number"
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    name="address_modal_mobile_number"
                    id="address_modal_mobile_number"
                  />
                </div>
                <div className="address_modal_pincode_wrapper">
                  <label
                    className="login-field-label"
                    htmlFor="address_modal_pincode"
                  >
                    Pincode
                    <span className="required_star">*</span>
                  </label>
                  <input
                    placeholder="Enter pincode"
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    name="address_modal_pincode"
                    id="address_modal_pincode"
                  />
                </div>
              </div>
              <div className="address_modal_add_line1_wrapper">
                <label
                  className="login-field-label"
                  htmlFor="address_modal_add_line1"
                >
                  Address Line 1<span className="required_star">*</span>
                </label>
                <input
                  placeholder="Enter address line 1"
                  type="text"
                  value={addressLine1}
                  onChange={(e) => {
                    setAddressLine1(e.target.value);
                    document.querySelector(
                      ".address_line1_length_error"
                    ).style.display = "none";
                  }}
                  name="address_modal_add_line1"
                  id="address_modal_add_line1"
                />
                <p className="address_line1_length_error first_time_login_error">
                  Address line 1 character length must be between 6 to 100
                </p>
              </div>
              <div className="address_modal_add_line2">
                <label
                  className="login-field-label"
                  htmlFor="address_modal_add_line2"
                >
                  Address Line 2<span className="required_star">*</span>
                </label>
                <input
                  placeholder="Enter address line 2"
                  type="text"
                  value={addressLine2}
                  onChange={(e) => {
                    setAddressLine2(e.target.value);
                    document.querySelector(
                      ".address_line2_length_error"
                    ).style.display = "none";
                  }}
                  name="address_modal_add_line2"
                  id="address_modal_add_line2"
                />
                <p className="address_line2_length_error first_time_login_error">
                  Address line 2 character length must be between 6 to 100
                </p>
              </div>

              <div className="city_state_country_wrapper">
                <div className="address_modal_city_wrapper">
                  <label
                    className="login-field-label"
                    htmlFor="address_modal_city"
                  >
                    City
                    <span className="required_star">*</span>
                  </label>
                  <input
                    placeholder="Enter city"
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      document.querySelector(
                        ".city_length_error"
                      ).style.display = "none";
                    }}
                    name="address_modal_city"
                    id="address_modal_city"
                  />
                  <p className="city_length_error first_time_login_error">
                    City character length must be between 2 to 30
                  </p>
                </div>
                <div className="address_modal_state_wrapper">
                  <label
                    className="login-field-label"
                    htmlFor="address_modal_state"
                  >
                    State
                    <span className="required_star">*</span>
                  </label>
                  <input
                    placeholder="Enter state"
                    type="text"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      document.querySelector(
                        ".state_length_error"
                      ).style.display = "none";
                    }}
                    name="address_modal_state"
                    id="address_modal_state"
                  />
                  <p className="state_length_error first_time_login_error">
                    State character length must be between 2 to 30
                  </p>
                </div>
                <div className="address_modal_country_wrapper">
                  <label
                    className="login-field-label"
                    htmlFor="address_modal_country"
                  >
                    Country
                    <span className="required_star">*</span>
                  </label>
                  <input
                    placeholder="Enter state"
                    type="text"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      document.querySelector(
                        ".country_length_error"
                      ).style.display = "none";
                    }}
                    name="address_modal_country"
                    id="address_modal_country"
                  />
                  <p className="country_length_error first_time_login_error">
                    Country character length must be between 2 to 30
                  </p>
                </div>
              </div>
            </div>
            <div className="address_footer">
              <div className="create_space_modal_footer_divider"></div>
              <div className="address_footer_buttons">
                <Button
                  // disabled={true}
                  className="create_space_modal_btn address_modal_btn"
                  onClick={() => {
                    handleOrder();
                  }}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EachProduct;
