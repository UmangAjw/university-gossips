import React from "react";
import AdminSidebar from "./AdminSidebar";
import Feed from "./Feed";
import FeedTemp from "./FeedTemp";

function ManageFeed() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "70px" }}
    >
      <AdminSidebar />
      <FeedTemp from="ManageFeed" />
    </div>
  );
}

export default ManageFeed;
