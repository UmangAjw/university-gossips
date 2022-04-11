import React from "react";
import "./css/EmptyZone.css";

function EmptyZone(props) {
  return (
    <div className="empty-feed">
      <img className="empty-img" src="/img/no-following.png" alt="" />
      <h4>{props.heading1}</h4>
      <p>{props.heading2}</p>
    </div>
  );
}

export default EmptyZone;
