import React, { useEffect, useState } from "react";
import ReplyOutlinedIcon from "@material-ui/icons/ReplyOutlined";
import "./css/EachUser.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import EachUserSidebar from "./EachUserSidebar";
import EachUserHorizontalBar from "./EachUserHorizontalBar";
import EachUserQuestions from "./EachUserQuestions";
import Page404 from "./Page404";

function EachUser() {
  const { username } = useParams();
  const [userDetails, setUserDetails] = useState([]);

  const isMounted = true;
  useEffect(async () => {
    if (isMounted) {
      await axios
        .get("/api/userDetails/getuserbyusername/" + username)
        .then((res) => {
          console.log(res.data.data);
          setUserDetails(res.data.data);
          if (Object.keys(res.data.data).length === 0)
            window.location.href = "/page-404";
        })
        .catch((e) => {
          console.log(e, "Error fetching user details from username");
        });
    }
  }, []);

  useEffect(() => {
    return () => {
      setUserDetails([]);
    };
  }, []);

  return (
    <div className="eachuser">
      {/* {userDetails && userDetails ? JSON.stringify(userDetails) : "sad"} */}

      <div className="eachuser_child_container">
        <div className="eachuser_left">
          <div className="eachuser_info">
            <div className="eachuser_info_splitter">
              <div className="eachuser_profile_pic_wrapper">
                <img
                  className="eachuser_profile_pic"
                  src={
                    userDetails
                      ? "/img/userprofilepics/" + userDetails.profilePic
                      : "/"
                  }
                  alt=""
                />
              </div>
              <div className="eachuser_name_and_details">
                <h1 className="eachuser_profile_name">
                  {userDetails ? userDetails.name : "Temp Name"}
                </h1>
                <p className="eachuser_username">
                  @
                  <span className="eachuser_username_txt">
                    {userDetails ? userDetails.username : "temp_username"}
                  </span>
                </p>
                <p className="eachuser_user_bio">
                  {userDetails ? userDetails.userBio : "Temp Bio"}
                </p>
              </div>
            </div>
            {/* <div className="eachuser_share">
              <div className="eachuser_share_btn">
                <ReplyOutlinedIcon className="eachuser_share_pic" />
              </div>
            </div> */}
          </div>
          <EachUserHorizontalBar
            eachUserId={
              username &&
              userDetails &&
              userDetails.user &&
              userDetails.user.uid
                ? userDetails.user.uid
                : ""
            }
            eachUserName={
              username && userDetails && userDetails.username
                ? userDetails.username
                : ""
            }
          />
          <EachUserQuestions />
        </div>
        <div className="eachuser_right">
          {username &&
          userDetails &&
          userDetails.user &&
          userDetails.user.uid ? (
            <EachUserSidebar
              spaceOwnerId={
                username &&
                userDetails &&
                userDetails.user &&
                userDetails.user.uid
                  ? userDetails.user.uid
                  : ""
              }
              spaceOwnerName={
                username && userDetails && userDetails.name
                  ? userDetails.name
                  : ""
              }
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default EachUser;
