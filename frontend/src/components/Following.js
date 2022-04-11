import React from "react";
import Sidebar from "./Sidebar";
import Widget from "./Widget";
import "./css/Following.css";
import GossipsNavbar from "./GossipsNavbar";
import EmptyZone from "./EmptyZone";

function Following() {
  return (
    <div className="FollowingPage">
      <Sidebar />
      <div className="following-feed">
        {/* <div className="no-following-feed"> */}
        <EmptyZone
          heading1={"Build your new following feed"}
          heading2={"Follow some spaces to start discovering stories"}
        />
        {/* </div> */}
        <Widget />
      </div>
      <div className="following-empty-div"></div>
    </div>
  );
}

export default Following;
