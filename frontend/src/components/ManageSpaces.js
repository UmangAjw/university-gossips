import React from "react";
import AdminSidebar from "./AdminSidebar";
import Widget from "./Widget";

function ManageSpaces() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "70px" }}
    >
      <AdminSidebar />
      <Widget from="ManageSpaces" widgetWidth="800px" />
    </div>
  );
}

export default ManageSpaces;
