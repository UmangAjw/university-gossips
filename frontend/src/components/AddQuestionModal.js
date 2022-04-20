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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

function AddQuestionModal(props) {
  const [question, setQuestion] = useState("");
  const user = useSelector(selectUser);
  const spaceName = props.spaceName;
  const [mySlug, setMySlug] = useState("");
  const [existingQuestion, setExistingQuestion] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
    console.log("first");
    console.log("from", props.from);

    let flag = 1;
    let noWhiteQuestion = question.replace(/^\s+|\s+$/g, "");
    setQuestion(noWhiteQuestion);

    if (noWhiteQuestion.length < 6 || noWhiteQuestion.length > 250) {
      document.querySelector(".question_name_length_error").style.display =
        "block";
      flag = 0;
    }
    if (flag && noWhiteQuestion !== "") {
      if (flag) {
        const slug = slugify(noWhiteQuestion);
        console.log(slug);
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        let tempQuestionType = document.getElementById(
          "modal_question_type"
        ).value;
        let questionType = tempQuestionType === "public" ? true : false;
        const body = {
          questionName: noWhiteQuestion,
          questionUrl: "",
          user: user,
          slug: slug,
          spaceName: spaceName,
          questionType: questionType,
        };

        let [currentXp, xpTransactions] = await axios
          .get("/api/userDetails/getuserbyid/" + user.uid, config)
          .then((res) => {
            console.log("Xp inside promise", typeof res.data.data.xp);
            return [res.data.data.xp, res.data.data.xpTransactions];
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
          const now = new Date();
          let currentDate = now.toDateString();
          const countOccurrences = (arr, val) =>
            arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
          if (countOccurrences(xpTransactions, currentDate) < 5) {
            const now = new Date();
            console.log("Inside question added ");
            currentXp += 5;
            let currentDate = [...xpTransactions, now.toDateString()];

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

                alert("Question added successfully & 5 Xp rewarded!");
                if (slug !== undefined && slug !== "")
                  window.location.href = "/question/" + slug;
                else window.location.href = "/";
              })
              .catch((e) => {
                console.log(e);
                alert("Error in adding xp!");
                window.location.href = "/";
              });
          } else {
            if (countOccurrences(xpTransactions, currentDate) >= 5) {
              alert(
                "Question added successfully! XP not rewarded as you have reached the daily limit of getting XP."
              );
              if (slug !== undefined && slug !== "")
                window.location.href = "/question/" + slug;
              else window.location.href = "/";
            }
          }
        }
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
            {/* <PeopleOutlineIcon className="modal_scope_people_icon" />
            <p className="modal_scope_people_text">Public</p>
            <ExpandMoreIcon /> */}

            <select name="modal_question_type" id="modal_question_type">
              <option value="public">Public</option>
              <option value="anonymous">Anonymous</option>
            </select>
          </div>
        </div>
        <div className="modal_inputs">
          <input
            id="question_input"
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
          <p className="question_name_length_error first_time_login_error">
            Question name character length must be between 6 to 250
          </p>
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
          <Button
            onClick={() => props.setisModalOpen(false)}
            className="modal_footer_cancel"
          >
            Cancel
          </Button>
          <Button
            id="add_question_btn"
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
