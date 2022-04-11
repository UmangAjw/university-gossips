import React from "react";
import AdminSidebar from "./AdminSidebar";
import AllProducts from "./AllProducts";

function ManageProducts() {
  return (
    <div style={{ display: "flex", "justify-content": "center" }}>
      <AdminSidebar />
      <AllProducts />
    </div>
  );
}

export default ManageProducts;
