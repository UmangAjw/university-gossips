import React from "react";
import AllProducts from "./AllProducts";
import RedeemShopSidebar from "./RedeemShopSidebar";
import UserRank from "./UserRank";
import "./css/RedeemShop.css";

function RedeemShop() {
  return (
    <div className="redeemshop">
      <RedeemShopSidebar />
      {/* <UserRank /> */}
      <AllProducts />
    </div>
  );
}

export default RedeemShop;
