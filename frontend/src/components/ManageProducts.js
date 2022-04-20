import React from "react";
import AdminSidebar from "./AdminSidebar";
import AllProducts from "./AllProducts";

function ManageProducts() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "70px",
      }}
    >
      <AdminSidebar />
      <AllProducts from="ManageProducts" />
    </div>
  );
}

export default ManageProducts;
