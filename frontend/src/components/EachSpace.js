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

function EachSpace() {
  const { slug } = useParams();
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isModeratorModalOpen, setisModeratorModalOpen] = useState(false);
  const close = <CloseIcon />;
  const user = useSelector(selectUser);
  const [moderatorDetails, setModeratorDetails] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [moderatorUsername, setModeratorUsername] = useState("");
  const [followers, setFollowers] = useState([]);

  const isMounted = true;

  useEffect(async () => {
    if (isMounted) {
      await axios
        .get("/api/spaces/eachSpace/" + slug)
        .then((res) => {
          // console.log(res.data.data);
          setQuestions(res.data.data);
          // console.log("Questions", questions);
        })
        .catch((e) => {
          console.log(e);
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
    }
  }, []);

  useEffect(async () => {
    if (moderatorDetails.length !== 0) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
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
        if (
          currentModerators.length === 0 ||
          !currentModerators.includes(moderatorDetails.user.uid)
        ) {
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
    console.log(followers);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let temp_followers = followers;
    if (temp_followers !== undefined) {
      if (!temp_followers.includes(user.uid)) {
        temp_followers.push(user.uid);
        const body = {
          followers: temp_followers,
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
        setFollowers(temp_followers);
        const body = {
          followers: temp_followers,
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
    if (questions && moderatorUsername) {
      const usernameExists = await axios
        .get("/api/userDetails/getuserbyusername/" + moderatorUsername)
        .then((res) => {
          console.log(res.data.data);
          setModeratorDetails(res.data.data);
          return true;
        })
        .catch((e) => {
          console.log(e, "Error fetching user details from username");
        });

      console.log(moderatorDetails);
    }
  };

  // const handleUnfollow = async () => {
  //   console.log(followers);
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };
  //   let temp_followers = followers;
  //   if (temp_followers !== undefined) {
  //     if (temp_followers.includes(user.uid)) {
  //       const index = temp_followers.indexOf(user.uid);
  //       temp_followers.splice(index, 1);
  //       setFollowers(temp_followers);
  //       const body = {
  //         followers: temp_followers,
  //       };
  //       await axios
  //         .put("/api/spaces/updateSpace/" + slug, body, config)
  //         .then((res) => {
  //           console.log("Unfollowed successfully!");
  //           document.querySelector(".eachspace-unfollow-btn").style.display =
  //             "none";
  //           document.querySelector(".eachspace-follow-btn").style.display =
  //             "block";
  //           // window.location.href = "/space/" + slug;
  //         })
  //         .catch((e) => {
  //           console.log(e);
  //           alert("Error in unfollowing!");
  //         });
  //     }
  //   }
  // };

  if (questions)
    if (questions[0])
      if (questions[0].length === 0)
        document.querySelector(".space-questions").style.display = "none";
      else document.querySelector(".space-no-questions").style.display = "none";

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
                {questions[1] ? questions[1][0].spaceName : ""}
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
            {questions[0] && questions[1] && questions[1][0]
              ? Object.values(questions[0]).map((postdata, i) => (
                  <Post
                    key={i}
                    // postProfilePic={postdata.postProfilePic}
                    // postProfileName={postdata.postProfileName}
                    // postProfileBio={postdata.postProfileBio}
                    spaceSlug={slug}
                    spaceOwner={questions[1][0].user.uid}
                    spaceModerators={questions[1][0].moderators}
                    postUser={postdata[0].user}
                    postUserCompleteDetails={postdata[2][0]}
                    postTimestamp={postdata[0].createdAt}
                    postQuestion={postdata[0].questionName}
                    postAnswer={postdata[1]}
                    postId={postdata[0]._id}
                    postSlug={postdata[0].slug}
                  />
                ))
              : ""}
          </div>
          <div className="space-no-questions">
            <EmptyZone
              heading1={"There are no questions over here."}
              heading2={"Start asking questions."}
            />
          </div>
          <Modal
            open={isModalOpen}
            onClose={() => setisModalOpen(false)}
            center
            closeIcon={close}
          >
            <AddQuestionModal spaceName={slug ? slug : ""} />
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
                  onChange={(e) => setModeratorUsername(e.target.value)}
                  placeholder="Enter username to Add Moderators"
                  type="text"
                />
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

export default EachSpace;
