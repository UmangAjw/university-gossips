import React, { useState, useEffect } from "react";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Avatar, Button, Tooltip } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import "./css/AddQuestionModal.css";
import axios from "axios"; // for REST API integration
import { selectUser } from "../features/userSlice";
import slugify from "react-slugify";
import { useSelector } from "react-redux";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import { NavLink } from "react-router-dom";

function AddQuestionModal(props) {
  const [question, setQuestion] = useState("");
  const user = useSelector(selectUser);
  const spaceName = props.spaceName;
  const [mySlug, setMySlug] = useState("");
  const [existingQuestion, setExistingQuestion] = useState([]);
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

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // const updateXp = async () => {
  //   await axios
  //     .put(updateAnswerUrl, body, config)
  //     .then((res) => {
  //       console.log("Put request done votecounter = ", currentVoteCounter);

  //       // alert(res.data.message);
  //       // window.location.href = "/";
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //       alert("Error in upvoting!");
  //     });
  // };

  async function getExistingQuestion() {
    await axios
      .get(`/api/questions/findbyslug/${mySlug}`, config)
      .then((res) => {
        console.log(res.data.data);
        setExistingQuestion(res.data.data);
      })
      .catch((e) => {
        console.log(e);
        alert("Error in fetching existing question!");
      });
  }

  const submitQuestion = async () => {
    let noWhiteQuestion = question.replace(/^\s+|\s+$/g, "");
    setQuestion(noWhiteQuestion);
    console.log("I am pressed! SUBMIT QUESTION BUTTON", question);
    if (noWhiteQuestion !== "") {
      const slug = slugify(noWhiteQuestion);
      console.log(slug);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = {
        questionName: noWhiteQuestion,
        questionUrl: "",
        user: user,
        slug: slug,
        spaceName: spaceName,
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

      const questionAddedSuccessfully = await axios
        .post("/api/questions", body, config)
        .then((res) => {
          console.log(res.data);
          return true;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.status == 400) {
            setMySlug(slug);
            getExistingQuestion();
            document.querySelector(".modal_question_av").style.display =
              "block";
          }
          // alert("Error in adding question!");
        });
      console.log("questionAddedSuccessfully", questionAddedSuccessfully);
      console.log("Current xp", currentXp);

      if (questionAddedSuccessfully && Number.isInteger(currentXp)) {
        console.log("Inside question added ");
        currentXp += 10;

        const body = {
          xp: currentXp,
        };

        await axios
          .put("/api/userDetails/updateUserDetails/" + user.uid, body, config)
          .then((res) => {
            console.log("10 Xp rewarded", currentXp);

            alert("10 Xp rewarded!");
            if (props.spaceName === "") window.location.href = "/";
            else window.location.href = "/space/" + props.spaceName;
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
      <div className="add_question_modal">
        <div className="modal_title_wrapper">
          <div className="modal_title">
            <h4>Add question</h4>
            <ExpandMoreIcon className="modal_title_arrow" />
          </div>
        </div>
        <div className="modal_instructions">
          <h5 className="modal_instructions_heading">
            Tips on getting good answers quickly
          </h5>
          <ul className="modal_instructions_ul">
            <li>Make sure your question has not been asked already</li>
            <li>Keep your question short and to the point</li>
            <li>Double-check grammar and spelling</li>
          </ul>
        </div>
        <div className="modal_info_wrapper">
          <div className="modal_info">
            <Avatar
              src={
                userDetails && userDetails.profilePic
                  ? "/img/userprofilepics/" + userDetails.profilePic
                  : "/"
              }
              className="modal_info_profile_pic"
            />
            <p className="modal_info_profile_name">
              {userDetails && userDetails.name ? userDetails.name : "Temp Name"}{" "}
              asked
            </p>
          </div>
          <div className="modal_scope">
            <PeopleOutlineIcon className="modal_scope_people_icon" />
            <p className="modal_scope_people_text">Public</p>
            <ExpandMoreIcon />
          </div>
        </div>
        <div className="modal_inputs">
          <input
            value={question}
            onChange={(e) => {
              document.querySelector(".modal_question_av").style.display =
                "none";
              setQuestion(e.target.value);
            }}
            type="text"
            placeholder='Start your question with "What", "How", "Why", etc.'
            className="modal_question_input"
          />
          <NavLink
            className={"modal_question_existing_link"}
            to={
              existingQuestion
                ? existingQuestion[0]
                  ? "/question/" + existingQuestion[0][0].slug
                  : "/"
                : "/"
            }
          >
            <div className="modal_question_av">
              <CheckCircleOutlineOutlinedIcon className="modal_question_av_tick" />{" "}
              <div className="modal_question_av_txt">
                We found your question:
              </div>
              <div className="modal_question_existing_box">
                <div className="modal_question_existing_wrapper">
                  <div className="modal_question_existing_q">
                    {existingQuestion
                      ? existingQuestion[0]
                        ? existingQuestion[0][0].questionName
                        : ""
                      : ""}
                  </div>

                  <div className="modal_question_existing_count">
                    {existingQuestion
                      ? existingQuestion[1]
                        ? existingQuestion[1].length + " Answers"
                        : " 0 Answer"
                      : " 0 Answer"}
                  </div>
                </div>
                <div className="modal_question_existing_view">
                  View Answers
                  <ExpandMoreIcon className="modal_question_existing_pic" />
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="modal_footer_buttons">
          <Button className="modal_footer_cancel">Cancel</Button>
          <Button
            onClick={() => {
              submitQuestion();
            }}
            className="modal_footer_add_q"
          >
            Add question
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddQuestionModal;
