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

function EachProduct() {
  const user = useSelector(selectUser);
  const [eachProduct, setEachProduct] = useState();
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
    };
  }, []);

  const handleOrder = async (e) => {
    e.preventDefault();
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
        fullName: "",
        mobileNumber: 0,
        pincode: 0,
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
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
          })
          .catch((e) => {
            console.log(e);
            alert("Error in deducting xp");
          });
      }
    } else {
      alert("Sorry, you donot have enough XP!");
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
            onClick={() => setisModalOpen(true)}
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
        <div className="address_modal"></div>
      </Modal>
    </div>
  );
}

export default EachProduct;
