import React, { useState, useEffect } from "react";
import "./css/AddAnswerModal.css";
import ReactQuill from "react-quill";
import { Button } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import moment from "moment";
import Parser from "html-react-parser";

function AddAnswerModal(props) {
  const [answer, setAnswer] = useState("");
  const user = useSelector(selectUser);
  const [userDetails, setUserDetails] = useState([]);
  const spaceName = props.postQuestionSpaceName;
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
          console.log(e, "Error fetching user details from user uid");
        });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      setUserDetails([]);
    };
  }, []);

  const handleReactQuill = (e) => {
    setAnswer(e);
    // document.querySelector(".answer_name_length_error").style.display = "none";
  };

  const submitAnswer = async () => {
    let flag = 1;
    let noWhiteAnswer;
    // noWhiteAnswer = answer.replace(/(<([^>]+)>)/gi, ""); // for removing html tags
    noWhiteAnswer = answer.replace(/(<([^>]+)>)/gi, ""); // for extracting value in between html tags
    noWhiteAnswer = noWhiteAnswer.replace(/^\s+|\s+$/g, ""); // for removing white space

    if (noWhiteAnswer.length === 0) setAnswer(noWhiteAnswer);

    if (noWhiteAnswer.length < 6 || noWhiteAnswer.length > 1500) {
      alert("Answer name character length must be between 6 to 1500");
      flag = 0;
    }
    console.log(flag, props.postId);
    if (flag && noWhiteAnswer !== "" && props.postId && answer !== "") {
      console.log(answer);
      if (flag) {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        let voters = {};
        const body = {
          answer: answer,
          voteCounter: 0,
          questionId: props.postId,
          user: user,
          voters: voters,
        };

        let [currentXp, xpTransactions] = await axios
          .get("/api/userDetails/getuserbyid/" + user.uid, config)
          .then((res) => {
            return [res.data.data.xp, res.data.data.xpTransactions];
          })
          .catch((e) => {
            console.log(e);
            alert("Error in getting xp!");
          });

        const answerAddedSuccessfully = await axios
          .post("/api/answers", body, config)
          .then((res) => {
            console.log(res.data);
            // alert("Answer added Successfully!");
            return true;
          })
          .catch((e) => {
            console.log(e);
            alert("Error adding answer!");
            window.location.href = "/";
          });

        if (answerAddedSuccessfully && Number.isInteger(currentXp)) {
          const now = new Date();
          let currentDate = now.toDateString();
          const countOccurrences = (arr, val) =>
            arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

          if (countOccurrences(xpTransactions, currentDate) < 5) {
            const now = new Date();
            let currentDate = [...xpTransactions, now.toDateString()];

            console.log("Inside question added ");
            currentXp += 5;

            const body = {
              xp: currentXp,
              xpTransactions: currentDate,
            };

            await axios
              .put(
                "/api/userDetails/updateUserDetails/" + user.uid,
                body,
                config
              )
              .then((res) => {
                console.log("5 Xp rewarded", currentXp);

                alert("Answer added successfully & 5 Xp rewarded!");
                // if (spaceName === undefined) window.location.href = "/";
                if (props.postSlug !== undefined)
                  window.location.href = "/question/" + props.postSlug;
                else window.location.href = "/";
              })
              .catch((e) => {
                console.log(e);
                alert("Error in adding xp!");
                window.location.href = "/";
              });
          } else {
            if (countOccurrences(xpTransactions, currentDate) >= 5) {
              console.log("inside else");

              alert(
                "Answer added successfully! XP not rewarded as you have reached the daily limit of getting XP."
              );
              if (props.postSlug !== undefined)
                window.location.href = "/question/" + props.postSlug;
              else window.location.href = "/";
            }
          }
        }
      }
    }
  };

  return (
    <div>
      <div className="add_answer_modal">
        <div className="modal_question">
          <h2 className="modal_question_txt">{props.postQuestion}</h2>
          <p className="modal_question_info">
            asked by{" "}
            <span className="modal_question_username">
              {props.postQuestionName}
            </span>
            &nbsp;on&nbsp;
            <span className="modal_question_date">
              {/* {new Date(props.postTimestamp).toLocaleString()} */}
              {moment(props.postTimestamp * 1000).calendar(null, {
                nextDay: "MMM D, YYYY",
                nextWeek: "MMM D, YYYY",
                lastWeek: "MMM D, YYYY",
                sameElse: "MMM D, YYYY",
              })}
            </span>
            {/* ,&nbsp;<span className="modal_question_time">03:33 PM</span> */}
          </p>
        </div>
        <div className="modal_answer">
          <ReactQuill
            value={answer}
            onChange={handleReactQuill}
            className="modal_answer_quill"
            placeholder="Write your answer"
          />
          {/* <p className="answer_name_length_error first_time_login_error">
            Answer name character length must be between 6 to 1500
          </p> */}
        </div>
        <div className="modal_footer_buttons">
          <Button
            onClick={() => props.setisModalOpen(false)}
            className="modal_footer_cancel"
          >
            Cancel
          </Button>
          <Button onClick={submitAnswer} className="modal_footer_add_a">
            Add answer
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddAnswerModal;
