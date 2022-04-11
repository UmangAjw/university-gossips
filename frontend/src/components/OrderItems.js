import { Button } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";

import "./css/OrderItems.css";

function OrderItems(props) {
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
            end
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
            Status: <p>{props.orderStatus}</p>
          </div>
        </div>
      </div>
      <div>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          className="post_menu_three_dot_btn"
        >
          <MoreHorizOutlinedIcon className="post_menu_three_dot_pic" />
        </Button>
      </div>
    </div>
  );
}

export default OrderItems;
