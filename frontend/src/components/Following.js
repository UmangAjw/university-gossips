import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Widget from "./Widget";
import "./css/Following.css";
import GossipsNavbar from "./GossipsNavbar";
import EmptyZone from "./EmptyZone";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import PostForEachUser from "./PostForEachUser";
import axios from "axios";

function Following() {
  const user = useSelector(selectUser);
  const [followingContents, setFollowingContents] = useState([]);
  const isMounted = true;

  useEffect(async () => {
    if (isMounted && user && user.uid) {
      await axios
        .get("/api/spaces/getFollowingContents/" + user.uid)
        .then((res) => {
          console.log("Following contents retreived");
          setFollowingContents(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(() => {
    return () => {
      setFollowingContents([]);
    };
  }, []);

  return (
    <div className="FollowingPage">
      <Sidebar />
      {followingContents &&
      followingContents[0] &&
      followingContents[0][0] !== undefined ? (
        <div className="following-feed">
          {followingContents &&
          followingContents[0] &&
          followingContents[0][0] !== undefined
            ? Object.values(
                followingContents[0].sort(function (a, b) {
                  return b[0][0].createdAt - a[0][0].createdAt;
                })
              ).map((postdata, i) => (
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
                />

                // <div>
                //   <br />
                //   <br />
                //   <p>{JSON.stringify(postdata[1][0])}</p>
                // </div>
              ))
            : ""}
          <Widget />
        </div>
      ) : (
        <div className="no-following-feed">
          <EmptyZone
            heading1={"Build your new following feed"}
            heading2={"Follow some spaces to start discovering stories"}
          />
          <Widget />
        </div>
      )}

      <div className="following-empty-div"></div>
    </div>
  );
}

export default Following;
