import moment from "moment";
import React from "react";
import "./css/NotificationItems.css";
import { NavLink } from "react-router-dom";

function NotificationItems(props) {
  return (
    <div className="notification_items">
      <div className="notification_items_child_wrapper">
        <div className="notification_items_left">
          <img
            src={
              "/img/spaceprofilepics/" +
              (props.eachNotificationContent &&
              props.eachNotificationContent.spaceProfilePic
                ? props.eachNotificationContent.spaceProfilePic
                : "")
            }
            alt=""
          />
        </div>
        <div className="notification_items_right">
          <div className="notification_items_right_row1">
            Posted in&nbsp;
            <p className="notification_items_space_name">
              {props.eachNotificationContent &&
              props.eachNotificationContent.spaceName
                ? props.eachNotificationContent.spaceName
                : "/"}
            </p>
            &nbsp;Space -&nbsp;
            <p className="notification_items_time">
              {props.eachNotificationContent &&
              props.eachNotificationContent.questionCreatedAt
                ? moment(
                    props.eachNotificationContent.questionCreatedAt * 1000
                  ).fromNow()
                : ""}
            </p>
          </div>
          <div className="notification_items_right_row2">
            <NavLink
              className={"widget-navlink"}
              to={
                "/question/" +
                (props.eachNotificationContent &&
                props.eachNotificationContent.questionSlug
                  ? props.eachNotificationContent.questionSlug
                  : "/")
              }
            >
              <div className="notification_items_question_name">
                {props.eachNotificationContent &&
                props.eachNotificationContent.questionName
                  ? props.eachNotificationContent.questionName
                  : "/"}
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationItems;
