import { Button } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";
import "./css/RedeemShopSidebar.css";

function RedeemShopSidebar() {
  return (
    <div className="redeem-shop-sidebar">
      <h4 className="redeem-shop-sidebar-title">Redeem Shop</h4>
      <hr className="redeem-shop-sidebar-divider" />
      <NavLink exact to={"/redeemShop"} className=" your-questions-btn">
        <Button className=" your-questions">All Products</Button>
      </NavLink>
      <NavLink
        to={"/redeemShop" + "/leaderboard"}
        className=" your-answers-btn"
      >
        <Button className=" your-answers">XP Leaderboard</Button>
      </NavLink>
      <NavLink
        to={"/redeemShop" + "/your-orders"}
        className=" your-answers-btn"
      >
        <Button className=" your-answers">Your Orders</Button>
      </NavLink>
    </div>
  );
}

export default RedeemShopSidebar;
