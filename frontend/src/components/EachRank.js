import React from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import "./css/EachRank.css";
import { NavLink } from "react-router-dom";

function EachRank(props) {
  return (
    <div className="eachrank">
      <div className="eachrank-rank">
        <span className="eachrank-rank-container">
          {" "}
          {props ? props.index : ".."}{" "}
        </span>
      </div>
      <div className="eachrank-name">
        {/* <AccountCircleIcon className="eachrank-pic" />{" "} */}
        <img
          className="eachrank-pic"
          src={"/img/userprofilepics/" + props.allUsers.profilePic}
          alt=""
        />
        <NavLink
          className={"eachrank-link"}
          to={"/user/" + props.allUsers.username}
        >
          <p className="eachrank-name-txt">
            {props.allUsers && props.allUsers.user
              ? props.allUsers.name
              : "......"}
          </p>
        </NavLink>
      </div>{" "}
      <div className="eachrank-xp">
        <span className="eachrank-xp-container">
          +{props.allUsers ? props.allUsers.xp : "..."}
        </span>
      </div>{" "}
    </div>
  );
}

export default EachRank;
