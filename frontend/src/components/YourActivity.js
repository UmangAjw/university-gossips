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
import PostForEachUser from "./PostForEachUser";

function YourActivity() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([]);
  const isMounted = true;

  useEffect(async () => {
    if (isMounted && user) {
      await axios
        .get("api/questions/findbyuser2/" + user.uid)
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

  useEffect(() => {
    return () => {
      setQuestions([]);
    };
  }, []);

  // if (questions)
  //   if (questions[0])
  //     if (questions[0].length === 0)
  //       document.querySelector(".activity-posts").style.display = "none";
  //     else document.querySelector(".no-activity-posts").style.display = "none";

  return (
    <div className="your-activity">
      <YourActivitySideBar />
      <div className="activity-posts-wrapper">
        <div className="activity-posts">
          {questions && questions[0] && questions[0][0] !== undefined ? (
            <div className="each_user_questions_question">
              {questions && questions[0] && questions[0][0] !== undefined
                ? Object.values(questions[0]).map((postdata, i) => (
                    <React.Fragment key={i}>
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
                        from={"EachUserQuestions"}
                      />
                    </React.Fragment>

                    // <div>
                    //   <br />
                    //   <br />
                    //   <p>{JSON.stringify(postdata[1][0])}</p>
                    // </div>
                  ))
                : ""}
            </div>
          ) : (
            <EmptyZone
              heading1={"No questions here"}
              heading2={"Please ask some questions to view over here."}
            />
          )}
        </div>
      </div>
      <div className="your-activity-empty-div"></div>
    </div>
  );
}

export default YourActivity;
