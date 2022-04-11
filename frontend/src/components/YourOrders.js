import React, { useState, useEffect } from "react";
import RedeemShopSidebar from "./RedeemShopSidebar";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import "./css/YourOrders.css";
import OrderItems from "./OrderItems";
import EmptyZone from "./EmptyZone";

function YourOrders() {
  const isMounted = true;
  const user = useSelector(selectUser);

  const [yourOrders, setYourOrders] = useState([]);

  useEffect(async () => {
    if (isMounted && user) {
      await axios
        .get("/api/orderDetails/getorderbyid/" + user.uid)
        .then((res) => {
          console.log(res.data.data);
          setYourOrders(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);
  useEffect(() => {
    return () => {
      setYourOrders([]);
    };
  }, []);
  return (
    <div className="your_orders">
      <RedeemShopSidebar />
      {yourOrders.length !== 0 ? (
        <div className="your_orders_container">
          {Object.values(yourOrders).map((yourOrder, i) => (
            <OrderItems
              key={i}
              user={yourOrder && yourOrder[0] ? yourOrder[0].user : undefined}
              productId={
                yourOrder && yourOrder[0] ? yourOrder[0].productId : undefined
              }
              fullName={
                yourOrder && yourOrder[0] ? yourOrder[0].fullName : undefined
              }
              mobileNumber={
                yourOrder && yourOrder[0]
                  ? yourOrder[0].mobileNumber
                  : undefined
              }
              pincode={
                yourOrder && yourOrder[0] ? yourOrder[0].pincode : undefined
              }
              addressLine1={
                yourOrder && yourOrder[0]
                  ? yourOrder[0].addressLine1
                  : undefined
              }
              addressLine2={
                yourOrder && yourOrder[0]
                  ? yourOrder[0].addressLine2
                  : undefined
              }
              city={yourOrder && yourOrder[0] ? yourOrder[0].city : undefined}
              state={yourOrder && yourOrder[0] ? yourOrder[0].state : undefined}
              country={
                yourOrder && yourOrder[0] ? yourOrder[0].country : undefined
              }
              createdAt={
                yourOrder && yourOrder[0] ? yourOrder[0].createdAt : undefined
              }
              orderStatus={
                yourOrder && yourOrder[0] ? yourOrder[0].orderStatus : undefined
              }
              productDetails={
                yourOrder && yourOrder[1] ? yourOrder[1] : undefined
              }
              userCompleteDetails={
                yourOrder && yourOrder[2] ? yourOrder[2] : undefined
              }
            />
          ))}
        </div>
      ) : (
        <EmptyZone />
      )}
    </div>
  );
}

export default YourOrders;
