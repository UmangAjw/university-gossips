import React from "react";
import AdminSidebar from "./AdminSidebar";
import Feed from "./Feed";

function ManageFeed() {
  return (
    <div style={{ display: "flex", "justify-content": "center" }}>
      <AdminSidebar />
      <Feed />
    </div>
  );
}

export default ManageFeed;
