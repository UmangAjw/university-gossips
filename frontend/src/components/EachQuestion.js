import { Button, makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./css/EachQuestion.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ForwardOutlinedIcon from "@material-ui/icons/ForwardOutlined";
import CachedIcon from "@material-ui/icons/Cached";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import Widget from "./Widget";
import { useParams } from "react-router-dom";
import axios from "axios";
import CloseIcon from "@material-ui/icons/Close";
import parse from "html-react-parser";
import Modal from "react-responsive-modal";
import AddAnswerModal from "./AddAnswerModal";
import Popper from "@material-ui/core/Popper";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Page404 from "./Page404";

function EachQuestion(props) {
  const { slug } = useParams();
  const [question, setQuestion] = useState([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const close = <CloseIcon />;
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector(selectUser);
  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorAnswerEl, setAnchorAnswerEl] = React.useState(null);
  const isMounted = true;

  function handlePopperOpen(e) {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAnswerClose = () => {
    setAnchorAnswerEl(null);
  };
  const handleAnswerClick = (event) => {
    setAnchorAnswerEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const idPopper = open ? "simple-popper" : undefined;

  useEffect(() => {
    if (isMounted) {
      axios
        .get("/api/questions/findbyslug/" + slug)
        .then((res) => {
          setQuestion(res.data.data);
          console.log(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });

      console.log(question);
    }
  }, []);

  useEffect(() => {
    return () => {
      setQuestion([]);
      setisModalOpen(false);
      setAnchorEl(null);
      setAnchorAnswerEl(null);
    };
  }, []);
  // console.log(question[0][0]);
  return (
    <div className="each-question">
      {/* {question && question[0] && question[0].length ? question[0].length : ""} */}

      <div className="each-question-main">
        <div className="each-question-question">
          <h3 className="each-question-txt">
            {question[0] ? question[0][0].questionName : ""}
          </h3>
          <Button
            onClick={() => setisModalOpen(true)}
            className="each-question-answer-btn"
          >
            Answer
          </Button>
        </div>
        <hr className="each-question-divider" />
        <p className="each-question-answer-count">
          {question[1] ? question[1].length + " Answers" : "0 Answers"}
        </p>
        <hr className="each-question-divider" />
        {question[1]
          ? Object.values(
              question[1].sort((a, b) => b.voteCounter - a.voteCounter)
            ).map((eachAnswer, i) => (
              <div key={i} className="each-question-answer">
                <div className="each-question-answer-info">
                  <AccountCircleIcon className="each-question-answer-pic" />
                  <div className="each-question-answer-username-wrapper">
                    <h5 className="each-question-answer-name">
                      {eachAnswer.user.displayName
                        ? eachAnswer.user.displayName
                        : eachAnswer.user.email}
                    </h5>
                    <h5 className="each-question-answer-timestamp">
                      {new Date(eachAnswer.createdAt).toLocaleString()}
                    </h5>
                  </div>
                </div>
                <div className="each-question-answer-txt">
                  {parse(eachAnswer.answer)}
                </div>
                <div className="post_buttons">
                  <div className="post_buttons_group_one">
                    <div className="post_vote">
                      <div
                        onClick={async () => {
                          console.log("I am pressed");
                          const config = {
                            headers: {
                              "Content-Type": "application/json",
                            },
                          };
                          const findAnswerUrl =
                            "/api/answers/findAnswer/" + eachAnswer._id;
                          console.log(findAnswerUrl);

                          let currentVoteCounter = await axios
                            .get(findAnswerUrl, config)
                            .then((res) => {
                              console.log(res.data.data);
                              return res.data.data.voteCounter;
                            })
                            .catch((e) => {
                              console.log(e);
                              alert("Error in upvoting!");
                            });

                          currentVoteCounter++;
                          const updateAnswerUrl =
                            "/api/answers/updateAnswer/" + eachAnswer._id;

                          const body = {
                            answer: eachAnswer.answer,
                            voteCounter: currentVoteCounter,
                          };

                          await axios
                            .put(updateAnswerUrl, body, config)
                            .then((res) => {
                              console.log(
                                "Put request done votecounter = ",
                                currentVoteCounter
                              );

                              // alert(res.data.message);
                              // window.location.href = "/";
                            })
                            .catch((e) => {
                              console.log(e);
                              alert("Error in upvoting!");
                            });
                          window.location.href = "/question/" + slug;
                        }}
                        className="post_vote_up_btn"
                      >
                        <ForwardOutlinedIcon className="post_vote_up" />
                        <p className="post_vote_up_txt">
                          {eachAnswer.voteCounter}
                        </p>
                      </div>
                      <div
                        onClick={async () => {
                          console.log("I am pressed");
                          const config = {
                            headers: {
                              "Content-Type": "application/json",
                            },
                          };
                          const findAnswerUrl =
                            "/api/answers/findAnswer/" + eachAnswer._id;
                          console.log(findAnswerUrl);

                          let currentVoteCounter = await axios
                            .get(findAnswerUrl, config)
                            .then((res) => res.data.data.voteCounter)
                            .catch((e) => {
                              console.log(e);
                              alert("Error in downvoting!");
                            });

                          currentVoteCounter--;
                          const updateAnswerUrl =
                            "/api/answers/updateAnswer/" + eachAnswer._id;

                          const body = {
                            answer: eachAnswer.answer,
                            voteCounter: currentVoteCounter,
                          };

                          await axios
                            .put(updateAnswerUrl, body, config)
                            .then((res) => {
                              console.log(
                                "Put request done votecounter = ",
                                currentVoteCounter
                              );

                              // alert(res.data.message);
                              // window.location.href = "/";
                            })
                            .catch((e) => {
                              console.log(e);
                              alert("Error in downvoting!");
                            });
                          window.location.href = "/question/" + slug;
                        }}
                        className="post_vote_down_btn"
                      >
                        <ForwardOutlinedIcon className="post_vote_down" />
                        <p className="post_vote_down_txt"></p>
                      </div>
                    </div>
                    <div className="post_share_btn">
                      <CachedIcon className="post_share_pic" />
                    </div>
                    <div className="post_comment_btn">
                      <QuestionAnswerOutlinedIcon className="post_comment_pic" />
                    </div>
                  </div>
                  <div className="post_buttons_group_two">
                    <div
                      onClick={handlePopperOpen}
                      className="post_share_all_btn"
                    >
                      <ShareOutlinedIcon className="post_share_all_pic" />
                    </div>
                    <Popper id={idPopper} open={open} anchorEl={anchorEl}>
                      <div className="share-btn-popper">Copy link</div>
                    </Popper>
                    {/* <div className="post_more_btn">
                      <MoreHorizOutlinedIcon className="post_more_pic" />
                    </div> */}

                    {user && user.uid === eachAnswer.user.uid ? (
                      <div className="post_three_dot_menu">
                        <Button
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={handleAnswerClick}
                          className="post_menu_three_dot_btn"
                        >
                          <MoreHorizOutlinedIcon className="post_menu_three_dot_pic" />
                        </Button>
                        <Menu
                          id="simple-menu"
                          anchorEl={anchorAnswerEl}
                          keepMounted
                          open={Boolean(anchorAnswerEl)}
                          onClose={handleAnswerClose}
                        >
                          <MenuItem
                            className="post_menu"
                            onClick={async () => {
                              handleAnswerClose();

                              if (
                                window.confirm(
                                  `"Are you sure you want to delete this answer?"`
                                )
                              ) {
                                await axios
                                  .delete(
                                    "/api/answers/deletebyid/" + eachAnswer._id
                                  )
                                  .then((res) => {
                                    console.log(res.msg);
                                    window.location.href = "/";
                                  })
                                  .catch((e) => {
                                    console.log(e);
                                  });
                              }
                            }}
                          >
                            <span className="post_menu_text">
                              Delete Answer
                            </span>
                          </MenuItem>
                          {/* <MenuItem>Delete Question from Space</MenuItem> */}
                        </Menu>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            ))
          : ""}
      </div>
      {/* <div className="each-question-empty-div"></div> */}
      <Widget widgetWidth="210px" />
      <Modal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        closeIcon={close}
        center
      >
        <AddAnswerModal
          from={"EachQuestion"}
          postSlug={slug}
          postQuestion={question[0] ? question[0][0].questionName : ""}
          postAnswer={""}
          postTimestamp={question[0] ? question[0][0].createdAt : ""}
          postId={question[0] ? question[0][0]._id : ""}
        />
      </Modal>
    </div>
  );
}

export default EachQuestion;
