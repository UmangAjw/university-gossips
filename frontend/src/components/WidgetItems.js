import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";

import "./css/WidgetItems.css";

function WidgetItems(props) {
  async function deleteSpace() {
    if (props.widgetSpaceId) {
      await axios
        .delete("/api/spaces/deletebyid/" + props.widgetSpaceId)
        .then((res) => {
          console.log("Space Deleted Successfully!");
          window.location.href = "/admin/manage-spaces";
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  return (
    <div style={{ justifyContent: "space-between" }} className="widgetItem">
      <NavLink
        // key={i}
        className={"widget-navlink"}
        target="_top"
        to={`/space/${props.widgetSpaceSlug}`}
      >
        <div style={{ display: "flex", width: "100%" }}>
          <div className="widget_space_img_div">
            <img
              className="widget_space_img"
              src={props.widgetSpaceImg}
              alt=""
            />
          </div>
          <div className="widget_space_txt">
            <p className="widget_space_heading">{props.widgetSpaceHeading}</p>
            <p className="widget_space_subheading">
              {props.widgetSpaceSubheading}
            </p>
          </div>
        </div>
      </NavLink>
      {props.from === "ManageSpaces" ? (
        <div
          className="all_users_delete"
          style={{
            width: "auto",
            height: "auto",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => deleteSpace()}
        >
          <svg
            className="MuiSvgIcon-root delete_post_by_user_pic"
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path>
          </svg>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default WidgetItems;
