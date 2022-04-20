import { Button } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import "./css/OrderItems.css";
import axios from "axios";

function OrderItems(props) {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let body = {
    orderStatus: "Order Approved by Admin",
  };

  async function approveOrder() {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let body = {
      orderStatus: "Order Approved by Admin!",
    };
    if (props.orderId) {
      axios
        .put(
          "/api/orderDetails/updateOrderDetails/" + props.orderId,
          body,
          config
        )
        .then((res) => {
          console.log("Order approved successfully!");
          window.location.href = "/admin/manage-orders";
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  async function declineOrder() {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let body = {
      orderStatus: "Order Declined by Admin!",
    };
    if (props.orderId) {
      axios
        .put(
          "/api/orderDetails/updateOrderDetails/" + props.orderId,
          body,
          config
        )
        .then((res) => {
          console.log("Order declined by Admin!");
          window.location.href = "/admin/manage-orders";
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  return (
    <div
      style={{ display: "flex", justifyContent: "space-between" }}
      className="order_items"
    >
      {/* User ID<p className="order_items_user_id">{props.user.uid}</p>
      Product ID<p className="order_items_product_id">{props.productId}</p>
      Full Name<p className="order_items_full_name">{props.fullName}</p>
      Mobile Number
      <p className="order_items_mobile_number">{props.mobileNumber}</p>
      Pincode<p className="order_items_pincode">{props.pincode}</p>
      Address Line 1
      <p className="order_items_address_line_1">{props.addressLine1}</p>
      Address Line 2
      <p className="order_items_address_line_2">{props.addressLine2}</p>
      City <p className="order_items_city">{props.city}</p>
      State <p className="order_items_state">{props.state}</p>
      Country <p className="order_items_country">{props.country}</p>
      Order Status{" "}
      <p className="order_items_order_status">{props.orderStatus}</p> */}
      <div style={{ display: "flex" }}>
        <div className="order_items_left">
          <img
            className="order_items_left_pic"
            src={
              "/img/productprofilepics/" +
              (props.productDetails
                ? props.productDetails.productProfilePic
                : "")
            }
            alt=""
          />
        </div>
        <div className="order_items_right">
          <NavLink
            className={"allproduct_all_items_link"}
            to={
              "/product/" +
              (props.productDetails ? props.productDetails.slug : "")
            }
            target="_top"
          >
            <p className="order_items_product_name">
              {props.productDetails ? props.productDetails.productName : ""}
            </p>
          </NavLink>
          <div className="order_items_product_sold_by">
            Sold by: <p>uGossips</p>
          </div>
          <div className="order_items_product_price">
            XP:{" "}
            <p>
              {props.productDetails ? props.productDetails.productPrice : ""}
            </p>
          </div>
          <div className="order_items_ordered_by">
            Ordered by:&nbsp;
            <p className="order_items_username">
              @{props.userCompleteDetails.username}
            </p>
          </div>
          <div className="order_items_status">
            Billing Name: <p>{props.fullName}</p>
          </div>
          <div className="order_items_status">
            Mobile Number: <p>{props.mobileNumber}</p>
          </div>
          <div className="order_items_status">
            Address: <p>{props.addressLine1}, </p>
            <p>{props.addressLine2}, </p>
            <p>
              {props.city}, {props.state}, {props.country}
            </p>
          </div>
          <div className="order_items_status">
            Status: <p>{props.orderStatus}</p>
          </div>
        </div>
      </div>
      {props.from && props.from === "OrderItems" ? (
        <div>
          {/* <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          className="post_menu_three_dot_btn"
        >
          <MoreHorizOutlinedIcon className="post_menu_three_dot_pic" />
        </Button> */}
          <div onClick={() => approveOrder()}>
            <CheckCircleIcon
              style={{
                color: "green",
                cursor: "pointer",
                height: "30px",
                width: "30px",
              }}
            />
          </div>
          <div onClick={() => declineOrder()}>
            <CancelIcon
              style={{
                color: "red",
                cursor: "pointer",
                height: "30px",
                width: "30px",
              }}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default OrderItems;
