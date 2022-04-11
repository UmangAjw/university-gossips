import React from "react";
import "./css/ModeratorWidgetItems.css";

function ModeratorWidgetItems(props) {
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
        <p className="moderator_widget_item_heading">{props.widgetHeading}</p>
        <p className="moderator_widget_item_subheading">
          @{props.widgetSubheading}
        </p>
      </div>
    </div>
  );
}

export default ModeratorWidgetItems;
