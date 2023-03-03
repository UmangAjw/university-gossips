import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@material-ui/core";
import { Modal } from "react-responsive-modal";
import Post from "./Post";
import CloseIcon from "@material-ui/icons/Close";
import AddQuestionModal from "./AddQuestionModal";
import { useRef } from "react";
import axios from "axios";
import "./css/EachSpace.css";
import Widget from "./Widget";
import EmptyZone from "./EmptyZone";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import ModeratorWidget from "./ModeratorWidget";
import Page404 from "./Page404";
import PostForEachUser from "./PostForEachUser";

function EachSpaceTemp() {
  const { slug } = useParams();
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isModeratorModalOpen, setisModeratorModalOpen] = useState(false);
  const close = <CloseIcon />;
  const user = useSelector(selectUser);
  const [moderatorDetails, setModeratorDetails] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [eachSpaceQuestions, setEachSpaceQuestions] = useState([]);

  const [moderatorUsername, setModeratorUsername] = useState("");
  const [followers, setFollowers] = useState([]);
  const [followersWithTime, setFollowersWithTime] = useState({});

  const isMounted = true;

  useEffect(async () => {
    if (isMounted) {
      await axios
        .get("/api/spaces/eachSpace/" + slug)
        .then((res) => {
          console.log(res.data.data);
          setQuestions(res.data.data);
          let temp_data = res.data.data;
          if (temp_data[1].length === 0) window.location.href = "/page-404";
          // console.log("Questions", questions);
        })
        .catch((e) => {
          console.log(e);
          window.location.href = "/page-404";
        });

      await axios
        .get("/api/spaces/getFollowers/" + slug)
        .then((res) => {
          // console.log(res.data.data);
          setFollowers(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });

      await axios
        .get("/api/spaces/getFollowersWithTime/" + slug)
        .then((res) => {
          // console.log(res.data.data);
          setFollowersWithTime(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });

      await axios
        .get("/api/spaces/eachSpaceQuestionDetails/" + slug)
        .then((res) => {
          // console.log(res.data.data);
          setEachSpaceQuestions(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(async () => {
    if (isMounted && moderatorDetails.length !== 0) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("inside add mod");
      // let spaceFollowers =
      //   questions[1] && questions[1][0] && questions[1][0].followers
      //     ? questions[1][0].followers
      //     : [];

      let currentModerators = await axios
        .get("/api/spaces/getModerators/" + slug)
        .then((res) => {
          console.log(res.data.data);
          return res.data.data;
        })
        .catch((e) => {
          console.log(e, "Error fetching user details from username");
        });
      if (currentModerators) {
        if (moderatorDetails.user.uid === questions[1][0].user.uid) {
          document.querySelector(
            ".username_admin_moderator_modal_av"
          ).style.display = "block";
        } else {
          if (currentModerators) {
            if (!currentModerators.includes(moderatorDetails.user.uid)) {
              currentModerators.push(moderatorDetails.user.uid);
              const body = {
                moderators: currentModerators,
              };
              await axios
                .put("/api/spaces/updateSpace/" + slug, body, config)
                .then((res) => {
                  console.log("Moderator Added Successfully!");
                  window.location.href = "/space/" + slug;
                })
                .catch((e) => {
                  console.log(e);
                  alert("Error in adding moderator!");
                });
            } else {
              document.querySelector(
                ".username_mod_moderator_modal_av"
              ).style.display = "block";
            }
          }
        }
      }
    }
  }, [moderatorDetails]);

  useEffect(() => {
    return () => {
      setisModalOpen(false);
      setisModeratorModalOpen(false);
      setModeratorDetails([]);
      setQuestions([]);
      setFollowers([]);
      setModeratorUsername("");
      setFollowersWithTime({});
      setEachSpaceQuestions([]);
    };
  }, []);

  const flipFollow = (num) => {
    if (num) {
      if (document.querySelector("#follow-btn"))
        document.querySelector("#follow-btn").innerText = "Unfollow";
    } else {
      if (document.querySelector("#follow-btn"))
        document.querySelector("#follow-btn").innerText = "Follow";
    }
    if (document.querySelector("#follow-btn"))
      document
        .querySelector("#follow-btn")
        .classList.toggle("eachspace-unfollow-btn");
  };

  const handleFollow = async () => {
    console.log(followers, followersWithTime);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let temp_followers = followers;
    let temp_followersWithTime = followersWithTime;

    if (temp_followers !== undefined && temp_followersWithTime !== undefined) {
      if (!temp_followers.includes(user.uid)) {
        const now = new Date();
        const secondsSinceEpoch = Math.round(now.getTime() / 1000);
        temp_followersWithTime[user.uid] = secondsSinceEpoch;

        temp_followers.push(user.uid);
        setFollowers(temp_followers);
        setFollowersWithTime(temp_followersWithTime);

        const body = {
          followers: temp_followers,
          followersWithTime: temp_followersWithTime,
        };
        await axios
          .put("/api/spaces/updateSpace/" + slug, body, config)
          .then((res) => {
            console.log("Follower added successfully!");
            flipFollow(1);
            // window.location.href = "/space/" + slug;
          })
          .catch((e) => {
            console.log(e);
            alert("Error in following!");
          });
      } else {
        const index = temp_followers.indexOf(user.uid);
        temp_followers.splice(index, 1);

        if (temp_followersWithTime[user.uid] !== undefined) {
          delete temp_followersWithTime[user.uid];
        }

        setFollowers(temp_followers);
        setFollowersWithTime(temp_followersWithTime);

        const body = {
          followers: temp_followers,
          followersWithTime: temp_followersWithTime,
        };
        await axios
          .put("/api/spaces/updateSpace/" + slug, body, config)
          .then((res) => {
            console.log("Unfollowed successfully!");
            flipFollow(0);
            // window.location.href = "/space/" + slug;
          })
          .catch((e) => {
            console.log(e);
            alert("Error in unfollowing!");
          });
      }
    }
  };

  const handleModerator = async () => {
    let noWhiteModeratorUsername = moderatorUsername.replace(/^\s+|\s+$/g, "");
    setModeratorUsername(noWhiteModeratorUsername);

    if (noWhiteModeratorUsername !== "") {
      if (questions && moderatorUsername) {
        const usernameExists = await axios
          .get("/api/userDetails/getuserbyusername/" + moderatorUsername)
          .then((res) => {
            console.log(res.data.data);
            if (res.data.data.length === 0) {
              document.querySelector(
                ".username_moderator_modal_nav"
              ).style.display = "block";
            } else setModeratorDetails(res.data.data);
            return true;
          })
          .catch((e) => {
            console.log(e, "Error fetching user details from username");
          });

        console.log(moderatorDetails);
      }
    } else {
      alert("Please fill details properly.");
    }
  };

  if (user) {
    if (user.uid) {
      if (followers !== undefined) {
        if (followers.includes(user.uid)) {
          flipFollow(1);
        } else {
          flipFollow(0);
        }
      }
    }
  }

  return (
    <div className="eachspace">
      {/* {questions && questions[1] && questions[1]
        ? questions[1].length
        : JSON.stringify(questions)} */}

      <div className="eachspace-header">
        <div className="eachspace-banner-wrapper">
          <img
            className="eachspace-banner"
            src="/img/spaceimages/space-banners/space-banner.png"
            alt=""
          />
        </div>
        <div className="eachspace-header-child">
          <img
            className="eachspace-pic"
            src={
              questions[1] && questions[1][0] && questions[1][0].spaceProfilePic
                ? "/img/spaceprofilepics/" + questions[1][0].spaceProfilePic
                : "/"
            }
            alt=""
          />
          <div className="eachspace-header-wrapper">
            <div>
              <p className="eachspace-spacename">
                {questions && questions[1] ? questions[1][0].spaceName : ""}
              </p>
              <p className="eachspace-spacedesc">
                {questions[1] ? questions[1][0].spaceDesc : ""}
              </p>
            </div>
            <div>
              <Button
                className="eachspace-add-q-btn"
                onClick={() => setisModalOpen(true)}
              >
                Add Question
              </Button>

              {/* <Button onClick={handleUnfollow} className="eachspace-unfollow-btn">
              Unfollow
            </Button> */}

              {user &&
              questions[1] &&
              questions[1][0].user &&
              questions[1][0].user.uid == user.uid ? (
                ""
              ) : (
                <Button
                  id="follow-btn"
                  onClick={handleFollow}
                  className="eachspace-follow-btn"
                >
                  .......
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="eachspace-wrapper-widget">
        <div className="eachspace-wrapper">
          <div className="space-questions">
            {eachSpaceQuestions &&
            eachSpaceQuestions[0] &&
            eachSpaceQuestions[0][0] !== undefined ? (
              <div style={{ marginTop: "0px" }} className="each_user_questions">
                {/* <EachUser /> */}
                <div className="each_user_questions_question">
                  {eachSpaceQuestions &&
                  eachSpaceQuestions[0] &&
                  eachSpaceQuestions[0][0] !== undefined
                    ? Object.values(eachSpaceQuestions[0]).map(
                        (postdata, i) => (
                          <PostForEachUser
                            key={i}
                            // postProfilePic={postdata.postProfilePic}
                            // postProfileName={postdata.postProfileName}
                            // postProfileBio={postdata.postProfileBio}
                            spaceSlug={slug}
                            spaceOwner={questions[1][0].user.uid}
                            spaceModerators={questions[1][0].moderators}
                            spaceName={questions[1][0].spaceName}
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
                        )
                      )
                    : ""}
                </div>
              </div>
            ) : (
              <div className="eachspace-emptyzone">
                <EmptyZone
                  heading1={"No questions here"}
                  heading2={"Please add some questions to view over here."}
                />
              </div>
            )}
          </div>
          {/* <div className="space-no-questions">
                <EmptyZone
                  heading1={"There are no questions over here."}
                  heading2={"Start asking questions."}
                />
              </div> */}
          <Modal
            open={isModalOpen}
            onClose={() => setisModalOpen(false)}
            center
            closeIcon={close}
          >
            <AddQuestionModal
              isModalOpen={isModalOpen}
              setisModalOpen={setisModalOpen}
              spaceName={slug ? slug : ""}
            />
          </Modal>
          <Modal
            open={isModeratorModalOpen}
            onClose={() => setisModeratorModalOpen(false)}
            center
            closeIcon={close}
          >
            <div className="moderator_modal">
              <div className="moderator_modal_title">
                <h3>Edit Moderators</h3>
              </div>
              <div className="moderator_modal_input_field">
                <label
                  className="moderator_modal_input_label"
                  htmlFor="moderator_modal_input"
                >
                  Add Moderators
                  <span className="required_star">*</span>
                </label>
                <input
                  id="moderator_modal_input"
                  value={moderatorUsername}
                  onChange={(e) => {
                    setModeratorUsername(e.target.value);
                    document.querySelector(
                      ".username_admin_moderator_modal_av"
                    ).style.display = "none";
                    document.querySelector(
                      ".username_mod_moderator_modal_av"
                    ).style.display = "none";
                    document.querySelector(
                      ".username_moderator_modal_nav"
                    ).style.display = "none";
                  }}
                  placeholder="Enter username to Add Moderators"
                  type="text"
                />
                <p className="username_moderator_modal_nav first_time_login_error">
                  This username doesnot exist.
                </p>
                <p className="username_admin_moderator_modal_av first_time_login_error">
                  This username is already a admin.
                </p>
                <p className="username_mod_moderator_modal_av first_time_login_error">
                  This username is already a moderator.
                </p>
              </div>

              <div className="moderator_modal_footer">
                <div className="moderator_modal_footer_divider"></div>
                <div className="moderator_modal_footer_btns">
                  <Button
                    onClick={handleModerator}
                    className="moderator_modal_btn"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
        <div className="eachspace-widget">
          {user && questions[1] && questions[1][0].user ? (
            <div>
              <ModeratorWidget
                isModeratorModalOpen={isModeratorModalOpen}
                setisModeratorModalOpen={setisModeratorModalOpen}
                owner={
                  user && questions[1] && questions[1][0].user
                    ? questions[1][0].user
                    : ""
                }
                slug={slug}
                spaceModeratorsIds={
                  questions[1] && questions[1][0]
                    ? questions[1][0].moderators
                    : []
                }
                spaceName={slug}
              />
              <Widget />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default EachSpaceTemp;
