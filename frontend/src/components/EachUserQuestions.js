import React, { useState, useEffect } from "react";
import EachUser from "./EachUser";
import { useSelector } from "react-redux";
import { selectUser, logout } from "../features/userSlice";
import axios from "axios";
import Post from "./Post";
import "./css/EachUserQuestions.css";
import PostForEachUser from "./PostForEachUser";
import EmptyZone from "./EmptyZone";

function EachUserQuestions() {
  const user = useSelector(selectUser);
  const isMounted = true;
  const [questions, setQuestions] = useState([]);

  const URL = window.location.pathname;
  const lastForwardSlash = URL.lastIndexOf("/");

  const username =
    lastForwardSlash !== -1
      ? URL.substring(lastForwardSlash + 1) !== ""
        ? URL.substring(lastForwardSlash + 1)
        : null
      : null;
  console.log(typeof username);

  useEffect(async () => {
    if (isMounted) {
      if (username) {
        await axios
          .get("/api/questions/findbyusername3/" + username)
          .then((res) => {
            console.log(res.data.data);
            setQuestions(res.data.data);
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
    };
  }, []);

  return (
    <div className="each_user_questions">
      {/* <EachUser /> */}
      {questions && questions[0] && questions[0][0] !== undefined ? (
        <div className="each_user_questions_question">
          {questions && questions[0] && questions[0][0] !== undefined
            ? Object.values(questions[0]).map((postdata, i) => (
                <React.Fragment key={i}>
                  {postdata[0][0].questionType ? (
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
                  ) : i + 1 === questions[0].length ? (
                    <EmptyZone
                      heading1={"No questions here"}
                      heading2={"Please ask some questions to view over here."}
                    />
                  ) : (
                    ""
                  )}
                </React.Fragment>

                // <div>
                //   <br />
                //   <br />
                //   <p>{JSON.stringify(postdata[1][0])}</p>
                // </div>
              ))
            : ""}

          {/* {JSON.stringify(questions[0])} */}
        </div>
      ) : (
        <EmptyZone
          heading1={"No questions here"}
          heading2={"Please ask some questions to view over here."}
        />
      )}
    </div>
  );
}

export default EachUserQuestions;
