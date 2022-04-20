import React, { useState, useEffect } from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ForwardOutlinedIcon from "@material-ui/icons/ForwardOutlined";
import ForwardIcon from "@material-ui/icons/Forward";
import CachedIcon from "@material-ui/icons/Cached";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import CloseIcon from "@material-ui/icons/Close";
import { Modal } from "react-responsive-modal";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ReactQuill from "react-quill";

import "react-responsive-modal/styles.css";
import "./css/Post.css";
import "react-quill/dist/quill.snow.css";
import { Avatar, Button } from "@material-ui/core";
import AddAnswerModal from "./AddAnswerModal";
import ReactTimeAgo from "react-time-ago";
import moment from "moment";
import parse from "html-react-parser";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import { ADMIN_USER_UID } from "./auth/Constants";

function PostForEachUser(props) {
  const [isModalOpen, setisModalOpen] = useState(false);
  const close = <CloseIcon />;
  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorAnswerEl, setAnchorAnswerEl] = React.useState(null);

  const LastSeen = ({ date }) => {
    return (
      <div style={{ display: "inline" }}>
        <ReactTimeAgo date={date} locale="en-US" timeStyle="round" />
      </div>
    );
  };

  const blockAnonymousNavLink = (e) => {
    e.preventDefault();
  };

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

  const upvoteBtnClicked = async (eachAnswer) => {
    console.log("I am pressed");
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const tempUrl = "api/answers/findAnswer" + eachAnswer._id;
    console.log(tempUrl);
    await axios
      .get("api/answers/findAnswer", config)
      .then((res) => {
        console.log("Answers", res.data);
        alert(res.data.message);
        window.location.href = "/";
      })
      .catch((e) => {
        console.log(e);
        alert("Error in adding question!");
      });
    window.location.href = "/";
  };

  // console.log("Post answer", props.postAnswer);

  return (
    <div className="post">
      <div className="post_profile">
        <div className="post_profile_child">
          <Avatar
            src={
              props.postQuestionType
                ? props.postUserCompleteDetails &&
                  props.postUserCompleteDetails.profilePic
                  ? "/img/userprofilepics/" +
                    props.postUserCompleteDetails.profilePic
                  : "/"
                : "/img/incognito.png"
            }
            className="post_profile_pic"
          />
          <div className="post_profile_double_line">
            <div className="post_profile_row1">
              <NavLink
                className={"post_profile_name_link"}
                target={"_top"}
                to={
                  props.postQuestionType &&
                  props.postUserCompleteDetails &&
                  props.postUserCompleteDetails.username
                    ? "/user/" + props.postUserCompleteDetails.username
                    : "/"
                }
                onClick={(e) => {
                  if (!props.postQuestionType) e.preventDefault();
                }}
              >
                <h5 className="post_profile_name">
                  {props.postQuestionType
                    ? props.postUserCompleteDetails &&
                      props.postUserCompleteDetails.name
                      ? props.postUserCompleteDetails.name
                      : "Temp Name"
                    : "Anonymous"}
                </h5>
              </NavLink>
            </div>
            <div className="post_profile_row2">
              <h5 className="post_profile_bio">
                {props.postQuestionType
                  ? props.postUserCompleteDetails &&
                    props.postUserCompleteDetails.userBio
                    ? props.postUserCompleteDetails.userBio
                    : "temp user bio"
                  : ""}
              </h5>
              {props.postQuestionType ? <h5>&nbsp;-&nbsp;</h5> : ""}
              <h5 className="post_timestamp">
                {/* <LastSeen date={new Date(props.postTimestamp)} /> */}
                {moment(props.postTimestamp * 1000).fromNow()}
              </h5>
            </div>
          </div>
        </div>

        {(props.from &&
          props.from === "ManageFeed" &&
          user &&
          user.uid === ADMIN_USER_UID) ||
        (user && props.spaceModerators && props.spaceOwner
          ? user.uid === props.spaceOwner ||
            props.spaceModerators.includes(user.uid)
          : false) ||
        (user && user.uid === props.postUser.uid) ? (
          <div className="post_three_dot_menu">
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
              className="post_menu_three_dot_btn"
            >
              <MoreHorizOutlinedIcon className="post_menu_three_dot_pic" />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {(props.from &&
                props.from === "ManageFeed" &&
                user &&
                user.uid === ADMIN_USER_UID) ||
              (user && user.uid === props.postUser.uid) ? (
                <MenuItem
                  className="post_menu"
                  onClick={async () => {
                    setAnchorEl(null);

                    if (
                      window.confirm(
                        "Are you sure you want to delete this question?"
                      )
                    ) {
                      await axios
                        .delete("/api/questions/deletebyid/" + props.postId)
                        .then((res) => {
                          console.log(res.msg);
                          // window.location.href = "/";
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                      await axios
                        .delete("/api/questions/deleteallbyid/" + props.postId)
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
                  <span className="post_menu_text">Delete Question</span>
                </MenuItem>
              ) : (
                ""
              )}
              {(props.postSpaceName || props.spaceName) &&
              user &&
              user.uid &&
              (user.uid === props.spaceOwner ||
                (props.spaceModerators &&
                  props.spaceModerators.includes(user.uid))) ? (
                <MenuItem
                  onClick={async () => {
                    setAnchorEl(null);

                    if (
                      window.confirm(
                        "Are you sure you want to remove this question from space?"
                      )
                    ) {
                      // let questionToBeUpdated = await axios
                      //   .get("/api/questions/find/" + props.postId)
                      //   .then((res) => {
                      //     console.log(res.data.data[0][0]);
                      //     return res.data.data[0][0];
                      //     // window.location.href = "/";
                      //   })
                      //   .catch((e) => {
                      //     console.log(e);
                      //   });

                      // if (questionToBeUpdated) {
                      let tempSpaceName = "";
                      let body = {
                        spaceName: tempSpaceName,
                      };
                      const config = {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      };
                      await axios
                        .put(
                          "/api/questions/updateQuestion/" + props.postId,
                          body,
                          config
                        )
                        .then((res) => {
                          console.log(res.msg);
                          window.location.href = "/space/" + props.spaceSlug;
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                      // }
                    }
                  }}
                >
                  <span className="post_menu_text_d_s">
                    Delete Question from Space
                  </span>
                </MenuItem>
              ) : (
                ""
              )}
            </Menu>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="post_question">
        <NavLink
          className={"post_question_txt_wrapper"}
          to={"/question/" + props.postSlug}
        >
          <h4 className="post_question_txt">{props.postQuestion}</h4>
        </NavLink>
        <Button
          onClick={() => {
            setisModalOpen(true);
          }}
          className="post_answer_btn"
        >
          Answer
        </Button>
      </div>
      <div className="post_answer_count">
        {props.postAnswer ? props.postAnswer.length : ""}
        {props.postAnswer
          ? props.postAnswer.length > 1
            ? " Answers"
            : " Answer"
          : "0 Answer"}
      </div>
      {Object.values(
        props.postAnswer.sort(function (a, b) {
          return b.voteCounter - a.voteCounter;
        })
      ).map((eachAnswer, i) => (
        <div key={i} className="post_answer_wrapper">
          <hr className="post_answer_divider" />
          <div className="post_answers">
            <div className="post_answer_container">
              <div className="post_info">
                <div className="post_info_child">
                  {/* <AccountCircleIcon className="post_answer_pic" /> */}
                  <Avatar
                    src={
                      eachAnswer
                        ? eachAnswer.userDetails &&
                          eachAnswer.userDetails.profilePic
                          ? "/img/userprofilepics/" +
                            eachAnswer.userDetails.profilePic
                          : "/"
                        : "/img/incognito.png"
                    }
                    className="post_profile_pic"
                  />
                  <div className="post_answer_username_wrapper">
                    <h5 className="post_answer_profile_name">
                      {eachAnswer.userDetails.name
                        ? eachAnswer.userDetails.name
                        : "temp name"}
                    </h5>
                    <h5 className="post_answer_timestamp">
                      {"Answered " +
                        // moment(eachAnswer.createdAt * 1000).format("MMM D, YYYY")}
                        moment(eachAnswer.createdAt * 1000).calendar(null, {
                          nextDay: "MMM D, YYYY",
                          nextWeek: "MMM D, YYYY",
                          lastWeek: "MMM D, YYYY",
                          sameElse: "MMM D, YYYY",
                        })}
                    </h5>
                    {/* {user && user.uid === props.postUser.uid ? (
                      <button
                        onClick={async () => {
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
                        Delete
                      </button>
                    ) : (
                      ""
                    )} */}
                  </div>
                </div>
                {/* {user && user.uid === props.postUser.uid ? (
                  <div
                    onClick={async () => {
                      if (
                        window.confirm(
                          `"Are you sure you want to delete this answer?"`
                        )
                      ) {
                        await axios
                          .delete("/api/answers/deletebyid/" + eachAnswer._id)
                          .then((res) => {
                            console.log(res.msg);
                            window.location.href = "/";
                          })
                          .catch((e) => {
                            console.log(e);
                          });
                      }
                    }}
                    className="delete_post_by_user_btn"
                  >
                    <DeleteForeverIcon className="delete_post_by_user_pic" />
                  </div>
                ) : (
                  ""
                )} */}
              </div>
              <div className="post_answer">
                <div className="post_answer_txt">
                  {parse(eachAnswer.answer)}
                </div>
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
                        let voters = await axios
                          .get(
                            "/api/answers/findAnswer/" + eachAnswer._id,
                            config
                          )
                          .then((res) => res.data.data.voters)
                          .catch((e) => {
                            console.log(e);
                            alert("Error in getting voters!");
                          });

                        if (
                          voters[user.uid] === undefined ||
                          voters[user.uid] === -1
                        ) {
                          const findAnswerUrl =
                            "/api/answers/findAnswer/" + eachAnswer._id;
                          console.log(findAnswerUrl);

                          const updateAnswerUrl =
                            "/api/answers/updateAnswer/" + eachAnswer._id;

                          {
                            // let currentVoteCounter = await axios
                            //   .get(findAnswerUrl, config)
                            //   .then((res) => res.data.data.voteCounter)
                            //   .catch((e) => {
                            //     console.log(e);
                            //     alert("Error in getting votecounter!");
                            //   });
                            // let currentVoteCounter = ;
                            // const updateAnswerUrl =
                            //   "api/answers/updateAnswer/" + eachAnswer._id;
                            // const body = {
                            //   answer: eachAnswer.answer,
                            //   voteCounter: currentVoteCounter,
                            // };
                            // let voteCounterSuccess = await axios
                            //   .put(updateAnswerUrl, body, config)
                            //   .then((res) => {
                            //     console.log(
                            //       "Put request done votecounter = ",
                            //       currentVoteCounter
                            //     );
                            //     return true;
                            //     // alert(res.data.message);
                            //     // window.location.href = "/";
                            //   })
                            //   .catch((e) => {
                            //     console.log(e);
                            //     alert("Error in upvoting!");
                            //   });
                          }

                          let temp_voters = voters;
                          temp_voters[user.uid] = 1;
                          const newBody = {
                            voters: temp_voters,
                          };
                          let upvoterSuccess = await axios
                            .put(updateAnswerUrl, newBody, config)
                            .then((res) => {
                              console.log("Upvoter added!");
                              console.log(res.data.data.voters);
                              // alert("Alakh niranjan!");
                              return res.data.data.voters;
                            })
                            .catch((e) => {
                              console.log(e);
                            });

                          if (upvoterSuccess) {
                            let currentVoteCounter = Object.values(
                              upvoterSuccess
                            ).reduce((partialSum, a) => partialSum + a, 0);

                            const body = {
                              answer: eachAnswer.answer,
                              voteCounter: currentVoteCounter,
                            };

                            let voteCounterSuccess = await axios
                              .put(updateAnswerUrl, body, config)
                              .then((res) => {
                                console.log(
                                  "Put request done votecounter = ",
                                  currentVoteCounter
                                );
                                window.location.href =
                                  props.postSlug !== undefined
                                    ? "/question/" + props.postSlug
                                    : "/";
                                return true;
                                // alert(res.data.message);
                                // window.location.href = "/";
                              })
                              .catch((e) => {
                                console.log(e);
                                alert("Error in upvoting!");
                              });
                          }
                        } else if (voters[user.uid] === 1) {
                          const findAnswerUrl =
                            "/api/answers/findAnswer/" + eachAnswer._id;
                          console.log(findAnswerUrl);

                          const updateAnswerUrl =
                            "/api/answers/updateAnswer/" + eachAnswer._id;

                          let temp_voters = voters;
                          delete temp_voters[user.uid];
                          const newBody = {
                            voters: temp_voters,
                          };
                          let upvoterSuccess = await axios
                            .put(updateAnswerUrl, newBody, config)
                            .then((res) => {
                              console.log("Upvoter deleted!");
                              return res.data.data.voters;
                            })
                            .catch((e) => {
                              console.log(e);
                            });

                          if (upvoterSuccess) {
                            let currentVoteCounter = Object.values(
                              upvoterSuccess
                            ).reduce((partialSum, a) => partialSum + a, 0);

                            const body = {
                              answer: eachAnswer.answer,
                              voteCounter: currentVoteCounter,
                            };

                            let voteCounterSuccess = await axios
                              .put(updateAnswerUrl, body, config)
                              .then((res) => {
                                console.log(
                                  "Put request done votecounter = ",
                                  currentVoteCounter
                                );
                                window.location.href =
                                  props.postSlug !== undefined
                                    ? "/question/" + props.postSlug
                                    : "/";
                                return true;
                                // alert(res.data.message);
                                // window.location.href = "/";
                              })
                              .catch((e) => {
                                console.log(e);
                                alert("Error in upvoting!");
                              });
                          }
                        } else {
                          console.log("Voter already exists");
                        }
                      }}
                      className="post_vote_up_btn"
                    >
                      {user && eachAnswer.voters[user.uid] === 1 ? (
                        <ForwardIcon className="post_vote_up" />
                      ) : (
                        <ForwardOutlinedIcon className="post_vote_up" />
                      )}
                      <p className="post_vote_up_txt">
                        {/* {Object.values(eachAnswer.voters).reduce(
                          (partialSum, a) => partialSum + a,
                          0
                        )} */}
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
                        let voters = await axios
                          .get(
                            "/api/answers/findAnswer/" + eachAnswer._id,
                            config
                          )
                          .then((res) => res.data.data.voters)
                          .catch((e) => {
                            console.log(e);
                            alert("Error in getting voters!");
                          });

                        if (
                          voters[user.uid] === undefined ||
                          voters[user.uid] === 1
                        ) {
                          const findAnswerUrl =
                            "/api/answers/findAnswer/" + eachAnswer._id;
                          console.log(findAnswerUrl);
                          const updateAnswerUrl =
                            "/api/answers/updateAnswer/" + eachAnswer._id;

                          let temp_voters = voters;
                          temp_voters[user.uid] = -1;
                          const newBody = {
                            voters: temp_voters,
                          };
                          let upvoterSuccess = await axios
                            .put(updateAnswerUrl, newBody, config)
                            .then((res) => {
                              console.log("Upvoter added!");
                              return res.data.data.voters;
                            })
                            .catch((e) => {
                              console.log(e);
                            });

                          if (upvoterSuccess) {
                            let currentVoteCounter = Object.values(
                              upvoterSuccess
                            ).reduce((partialSum, a) => partialSum + a, 0);

                            const body = {
                              answer: eachAnswer.answer,
                              voteCounter: currentVoteCounter,
                            };

                            let voteCounterSuccess = await axios
                              .put(updateAnswerUrl, body, config)
                              .then((res) => {
                                console.log(
                                  "Put request done votecounter = ",
                                  currentVoteCounter
                                );
                                window.location.href =
                                  props.postSlug !== undefined
                                    ? "/question/" + props.postSlug
                                    : "/";
                                return true;
                                // alert(res.data.message);
                                // window.location.href = "/";
                              })
                              .catch((e) => {
                                console.log(e);
                                alert("Error in adding question!");
                              });
                          }
                          // window.location.href = "/";
                        } else if (voters[user.uid] === -1) {
                          const findAnswerUrl =
                            "/api/answers/findAnswer/" + eachAnswer._id;
                          console.log(findAnswerUrl);

                          const updateAnswerUrl =
                            "/api/answers/updateAnswer/" + eachAnswer._id;

                          let temp_voters = voters;
                          delete temp_voters[user.uid];
                          const newBody = {
                            voters: temp_voters,
                          };
                          let upvoterSuccess = await axios
                            .put(updateAnswerUrl, newBody, config)
                            .then((res) => {
                              console.log("Upvoter deleted!");
                              return res.data.data.voters;
                            })
                            .catch((e) => {
                              console.log(e);
                            });

                          if (upvoterSuccess) {
                            let currentVoteCounter = Object.values(
                              upvoterSuccess
                            ).reduce((partialSum, a) => partialSum + a, 0);
                            const body = {
                              answer: eachAnswer.answer,
                              voteCounter: currentVoteCounter,
                            };

                            let voteCounterSuccess = await axios
                              .put(updateAnswerUrl, body, config)
                              .then((res) => {
                                console.log(
                                  "Put request done votecounter = ",
                                  currentVoteCounter
                                );
                                window.location.href =
                                  props.postSlug !== undefined
                                    ? "/question/" + props.postSlug
                                    : "/";
                                return true;
                                // alert(res.data.message);
                                // window.location.href = "/";
                              })
                              .catch((e) => {
                                console.log(e);
                                alert("Error in upvoting!");
                              });
                          }

                          // window.location.href = "/";
                        } else {
                          console.log("Voter already exists");
                        }
                      }}
                      className="post_vote_down_btn"
                    >
                      {user && eachAnswer.voters[user.uid] === -1 ? (
                        <ForwardIcon className="post_vote_down" />
                      ) : (
                        <ForwardOutlinedIcon className="post_vote_down" />
                      )}
                      <p className="post_vote_down_txt"></p>
                    </div>
                  </div>
                  {/* <div className="post_share_btn">
                    <CachedIcon className="post_share_pic" />
                  </div>
                  <div className="post_comment_btn">
                    <QuestionAnswerOutlinedIcon className="post_comment_pic" />
                  </div> */}
                </div>
                <div className="post_buttons_group_two">
                  {/* <div className="post_share_all_btn">
                    <ShareOutlinedIcon className="post_share_all_pic" />
                  </div> */}
                  {(props.from &&
                    props.from === "ManageFeed" &&
                    user &&
                    user.uid === ADMIN_USER_UID) ||
                  (user && user.uid === eachAnswer.user.uid) ? (
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
                          <span className="post_menu_text">Delete Answer</span>
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
          </div>
        </div>
      ))}
      <Modal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        closeIcon={close}
        center
      >
        <AddAnswerModal
          postQuestionName={
            props.postQuestionType
              ? props.postUserCompleteDetails &&
                props.postUserCompleteDetails.name
                ? props.postUserCompleteDetails.name
                : "Temp Name"
              : "Anonymous"
          }
          postQuestion={props.postQuestion}
          postSlug={props.postSlug}
          postAnswer={props.postAnswer}
          postTimestamp={props.postTimestamp}
          postId={props.postId}
          from={props.from}
        />
      </Modal>
    </div>
  );
}

export default PostForEachUser;
