import React from "react";
import AdminSidebar from "./AdminSidebar";
import AllUsers from "./AllUsers";
import "./css/Admin.css";

function Admin() {
  return (
    <div className="admin_wrapper">
      <AdminSidebar />
      <AllUsers />
    </div>
  );
}

export default Admin;
