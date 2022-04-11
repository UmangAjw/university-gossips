import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@material-ui/core";
import "./css/AdminSidebar.css";

function AdminSidebar() {
  return (
    <div className="admin_sidebar">
      <h4 className="admin_sidebar_title">Admin Section</h4>
      <hr className="admin_sidebar_divider" />
      <NavLink exact to={"/admin"} className=" your-questions-btn">
        <Button className=" your-questions">Manage Users</Button>
      </NavLink>
      <NavLink to={"/admin" + "/manage-feed"} className=" your-answers-btn">
        <Button className=" your-answers">Manage Feed</Button>
      </NavLink>
      <NavLink to={"/admin" + "/manage-spaces"} className=" your-answers-btn">
        <Button className=" your-answers">Manage Spaces</Button>
      </NavLink>
      <NavLink to={"/admin" + "/manage-orders"} className=" your-answers-btn">
        <Button className=" your-answers">Manage Orders</Button>
      </NavLink>
      <NavLink to={"/admin" + "/manage-products"} className=" your-answers-btn">
        <Button className=" your-answers">Manage Products</Button>
      </NavLink>
    </div>
  );
}

export default AdminSidebar;
