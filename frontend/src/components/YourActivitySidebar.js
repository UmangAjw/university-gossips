import React from "react";
import "./css/YourActivitySidebar.css";
import { NavLink } from "react-router-dom";
import { Button } from "@material-ui/core";

function ActivitySidebar() {
  return (
    <div className="your-activity-sidebar">
      <h4 className="activity-sidebar-title">Your Activity</h4>
      <hr className="activity-sidebar-divider" />
      <NavLink exact to={"/activity"} className=" your-questions-btn">
        <Button className=" your-questions">Your questions</Button>
      </NavLink>
      <NavLink to={"/activity" + "/your-answers"} className=" your-answers-btn">
        <Button className=" your-answers">Your answers</Button>
      </NavLink>
    </div>
  );
}

export default ActivitySidebar;
