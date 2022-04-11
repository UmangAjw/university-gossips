import React from "react";
import AdminSidebar from "./AdminSidebar";
import Widget from "./Widget";

function ManageSpaces() {
  return (
    <div style={{ display: "flex", "justify-content": "center" }}>
      <AdminSidebar />
      <Widget widgetWidth="800px" />
    </div>
  );
}

export default ManageSpaces;
