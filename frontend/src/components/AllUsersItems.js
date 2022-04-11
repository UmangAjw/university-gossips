import React from "react";
import "./css/AllUsersItems.css";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

function AllUsersItems(props) {
  return (
    <div className="all_users_items">
      <div className="all_users_index">
        {props && props.index ? props.index : ""}
      </div>
      <div className="all_users_name">
        <img
          className="eachrank-pic"
          src={"/img/userprofilepics/" + props.allUsers.profilePic}
          alt=""
        />{" "}
        {props && props.allUsers.name ? props.allUsers.name : ""}
      </div>
      <div className="all_users_delete">
        <DeleteForeverIcon className="delete_post_by_user_pic" />
      </div>
    </div>
  );
}

export default AllUsersItems;
