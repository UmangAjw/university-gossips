import React from "react";
import "./css/SidebarItems.css";

function SidebarItems(props) {
  // if (props.from === "FirstTimeLogin") {
  //   document.querySelector(".sidebarItem").style.width = "100% !important";

  //   if (document.querySelector(".sidebarItem"))
  //     document.querySelector(".sidebarItem").style.width = "100% !important";
  // }
  return (
    <div
      className="sidebarItem"
      // style={
      //   props.from === "FirstTimeLogin" ? { width: "auto" } : { width: "170px" }
      // }
    >
      <img className="sidebaritem_img" src={props.sideBarImg} alt="" />
      <p>{props.sideBarTxt}</p>
    </div>
  );
}

export default SidebarItems;
