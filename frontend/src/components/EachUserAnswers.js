import React, { useState, useEffect } from "react";
import EachUser from "./EachUser";
import { useSelector } from "react-redux";
import { selectUser, logout } from "../features/userSlice";
import axios from "axios";
import Post from "./Post";
import "./css/EachUserQuestions.css";
import PostForEachUser from "./PostForEachUser";
import ReplyOutlinedIcon from "@material-ui/icons/ReplyOutlined";
import EachUserHorizontalBar from "./EachUserHorizontalBar";
import "./css/EachUser.css";
import EachUserSidebar from "./EachUserSidebar";
import EmptyZone from "./EmptyZone";
import Page404 from "./Page404";

function EachUserAnswers() {
  const user = useSelector(selectUser);
  const isMounted = true;
  const [questions, setQuestions] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  const URL = window.location.pathname;
  // console.log(URL);
  //   console.log(URL.split("").reverse().join(""));

  const firstForwardSlash = 5;
  const lastForwardSlash = URL.lastIndexOf("/");
  // console.log(firstForwardSlash, lastForwardSlash);

  const username =
    firstForwardSlash && lastForwardSlash !== -1
      ? URL.substring(firstForwardSlash + 1, lastForwardSlash) !== ""
        ? URL.substring(firstForwardSlash + 1, lastForwardSlash)
        : null
      : null;

  // console.log(username);

  useEffect(async () => {
    if (isMounted) {
      await axios
        .get("/api/userDetails/getuserbyusername/" + username)
        .then((res) => {
          // console.log(res.data.data);
          setUserDetails(res.data.data);
        })
        .catch((e) => {
          console.log(e, "Error fetching user details from username");
        });
    }
  }, []);

  useEffect(async () => {
    if (isMounted) {
      if (username) {
        await axios
          .get("/api/questions/findanswerbyusername/" + username)
          .then((res) => {
            console.log(res.data.data);
            setQuestions(res.data.data);
            if (res.data.data.length === 0) window.location.href = "/page-404";
            // console.log("Questions", questions);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      setQuestions([]);
      setUserDetails([]);
    };
  }, []);

  return (
    <div className="eachuser">
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

          <div className="each_user_questions">
            {questions && questions[0] && questions[0][0] !== undefined ? (
              <div className="each_user_questions">
                {/* <EachUser /> */}
                <div className="each_user_questions_question">
                  {questions && questions[0] && questions[0][0] !== undefined
                    ? Object.values(questions[0]).map((postdata, i) => (
                        <PostForEachUser
                          key={i}
                          // postProfilePic={postdata.postProfilePic}
                          // postProfileName={postdata.postProfileName}
                          // postProfileBio={postdata.postProfileBio}
                          postUser={postdata[0][0].user}
                          postUserCompleteDetails={postdata[0][1]}
                          postTimestamp={postdata[0][0].createdAt}
                          postQuestion={postdata[0][0].questionName}
                          postQuestionType={postdata[0][0].questionType}
                          postAnswer={postdata[1]}
                          postId={postdata[0][0]._id}
                          postSlug={postdata[0][0].slug}
                        />

                        // <div>
                        //   <br />
                        //   <br />
                        //   <p>{JSON.stringify(postdata[1][0])}</p>
                        // </div>
                      ))
                    : ""}
                </div>
              </div>
            ) : (
              <EmptyZone
                heading1={"No answers here"}
                heading2={"Please add some answers to view over here."}
              />
            )}
          </div>
        </div>
        {/* </div> */}
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

export default EachUserAnswers;
