import { Button } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";
import "./css/EachUserHorizontalBar.css";

function EachUserHorizontalBar(props) {
  return (
    <div className="each_user_horizontal_bar">
      <NavLink
        exact
        to={
          "/" +
          ("user/" + (props && props.eachUserName ? props.eachUserName : ""))
        }
        className=" your-questions-btn"
      >
        <Button className=" your-questions">Questions</Button>
      </NavLink>
      <NavLink
        to={
          "/user/" +
          (props && props.eachUserName ? props.eachUserName : "") +
          "/answers"
        }
        className=" your-answers-btn"
      >
        <Button className=" your-answers">Answers</Button>
      </NavLink>
    </div>
  );
}

export default EachUserHorizontalBar;
