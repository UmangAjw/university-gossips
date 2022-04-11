import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import "./css/GossipBox.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { Avatar } from "@material-ui/core";
import axios from "axios";

function GossipBox() {
  const user = useSelector(selectUser);
  const [userDetails, setUserDetails] = useState([]);

  const isMounted = true;
  useEffect(async () => {
    if (isMounted && user) {
      await axios
        .get("/api/userDetails/getuserbyid/" + user.uid)
        .then((res) => {
          console.log(res.data.data);
          setUserDetails(res.data.data);
        })
        .catch((e) => {
          console.log(e, "Error fetching user details from user id");
        });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      setUserDetails([]);
    };
  }, []);

  return (
    <div className="gossipBox">
      <div className="gossipBox_profile">
        <Avatar
          src={
            userDetails && userDetails.profilePic
              ? "/img/userprofilepics/" + userDetails.profilePic
              : "/"
          }
          className="gossipBox_profile_pic"
        />
        <p className="gossipBox_profile_name">
          {userDetails && userDetails.name ? userDetails.name : "Temp Name"}
        </p>
      </div>
      <div className="gossipBox_ask">
        <h3 className="gossipBox_ask_txt">What do you want to ask or share?</h3>
      </div>
    </div>
  );
}

export default GossipBox;
