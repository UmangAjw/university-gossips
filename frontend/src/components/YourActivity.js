import React, { useState, useEffect } from "react";
import "./css/YourActivity.css";
import Post from "./Post";
import YourActivitySideBar from "./YourActivitySidebar";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser, logout } from "../features/userSlice";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import { useDispatch } from "react-redux";
import EmptyZone from "./EmptyZone";

function YourActivity() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([]);

  useEffect(async () => {
    if (user) {
      await axios
        .get("api/questions/findbyuser/" + user.uid)
        .then((res) => {
          console.log(res.data.data);
          setQuestions(res.data.data);
          console.log("Questions", questions);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  if (questions)
    if (questions[0])
      if (questions[0].length === 0)
        document.querySelector(".activity-posts").style.display = "none";
      else document.querySelector(".no-activity-posts").style.display = "none";

  return (
    <div className="your-activity">
      <YourActivitySideBar />
      <div className="activity-posts-wrapper">
        <div className="activity-posts">
          {questions
            ? questions[0]
              ? Object.values(questions[0]).map((postdata, i) => (
                  <Post
                    key={i}
                    // postProfilePic={postdata.postProfilePic}
                    // postProfileName={postdata.postProfileName}
                    // postProfileBio={postdata.postProfileBio}
                    postUser={postdata[0].user}
                    postTimestamp={postdata[0].createdAt}
                    postQuestion={postdata[0].questionName}
                    postAnswer={postdata[1]}
                    postId={postdata[0]._id}
                    postSlug={postdata[0].slug}
                  />
                ))
              : ""
            : ""}
        </div>
        <div className="no-activity-posts">
          <EmptyZone
            heading1={"You haven't asked any questions."}
            heading2={"Start asking questions."}
          />
        </div>
      </div>
      <div className="your-activity-empty-div"></div>
    </div>
  );
}

export default YourActivity;
