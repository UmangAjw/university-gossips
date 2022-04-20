import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import OrderItems from "./OrderItems";
import EmptyZone from "./EmptyZone";

function ManageOrders() {
  const [yourOrders, setYourOrders] = useState([]);
  const isMounted = true;

  useEffect(async () => {
    if (isMounted) {
      await axios
        .get("/api/orderDetails/getallorders")
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
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "70px" }}
    >
      <AdminSidebar />
      {yourOrders.length !== 0 ? (
        <div className="your_orders_container">
          {Object.values(yourOrders).map((yourOrder, i) => (
            <OrderItems
              from="OrderItems"
              key={i}
              orderId={yourOrder && yourOrder[0] ? yourOrder[0]._id : undefined}
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

export default ManageOrders;
