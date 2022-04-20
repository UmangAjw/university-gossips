import React, { useEffect, useState } from "react";
import "./css/ModeratorWidgetItems.css";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { NavLink } from "react-router-dom";
import axios from "axios";
import SecurityIcon from "@material-ui/icons/Security";

function ModeratorWidgetItems(props) {
  // console.log("ModeratorWidgetItems", props.moderatorWidgetDatas);

  const deleteModerator = async () => {
    let spaceModeratorsIds = props.spaceModeratorsIds;

    const index = spaceModeratorsIds.indexOf(props.moderatorId);
    spaceModeratorsIds.splice(index, 1);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = {
      moderators: spaceModeratorsIds,
    };

    await axios
      .put("/api/spaces/updateSpace/" + props.spaceName, body, config)
      .then((res) => {
        alert("Moderator deleted Successfully!");
        window.location.href = "/space/" + props.spaceName;
      })
      .catch((e) => {
        console.log(e);
        alert("Error in deleting moderator!");
      });
  };

  return (
    <div className="moderator_widget_item">
      <div className="moderator_widget_item_img_div">
        <img
          className="moderator_widget_item_img"
          src={props.widgetImg}
          alt=""
        />
      </div>
      <div className="moderator_widget_item_txt">
        <NavLink
          className={"widget-navlink"}
          target="_top"
          to={`/user/${props.moderatorUsername}`}
        >
          <div className="moderator_widget_item_heading_wrapper">
            <p className="moderator_widget_item_heading">
              {props.widgetHeading}
            </p>
            <p className="moderator_widget_item_subheading">
              @{props.widgetSubheading}
            </p>
          </div>
        </NavLink>
        {props.userIsOwnerOrModerator ? (
          <DeleteForeverIcon
            onClick={deleteModerator}
            className="delete_post_by_user_pic"
          />
        ) : (
          ""
        )}
        {props.widgetAdmin ? (
          <SecurityIcon
            className="delete_post_by_user_pic"
            style={{ color: "var(--link-color)" }}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ModeratorWidgetItems;
