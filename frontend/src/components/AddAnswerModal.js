import React, { useState, useEffect } from "react";
import "./css/AddAnswerModal.css";
import ReactQuill from "react-quill";
import { Button } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import moment from "moment";

function AddAnswerModal(props) {
  const [answer, setAnswer] = useState("");
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
  };

  const submitAnswer = async () => {
    if (props.postId && answer !== "") {
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

      let currentXp = await axios
        .get("/api/userDetails/getuserbyid/" + user.uid, config)
        .then((res) => {
          console.log("Xp inside promise", typeof res.data.data.xp);
          return res.data.data.xp;
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
        });

      if (answerAddedSuccessfully && Number.isInteger(currentXp)) {
        console.log("Inside question added ");
        currentXp += 15;

        const body = {
          xp: currentXp,
        };

        await axios
          .put("/api/userDetails/updateUserDetails/" + user.uid, body, config)
          .then((res) => {
            console.log("15 Xp rewarded", currentXp);

            alert("15 Xp rewarded!");
            window.location.href = "/";
          })
          .catch((e) => {
            console.log(e);
            alert("Error in adding xp!");
          });
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
        </div>
        <div className="modal_footer_buttons">
          <Button className="modal_footer_cancel">Cancel</Button>
          <Button onClick={submitAnswer} className="modal_footer_add_a">
            Add answer
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddAnswerModal;
