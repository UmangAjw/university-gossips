import React, { useEffect, useState } from "react";
import "./css/Feed.css";
import GossipBox from "./GossipBox";
import Post from "./Post";
import postdatas from "../data/postdata.json";
import AddQuestionModal from "./AddQuestionModal";
import Modal from "react-responsive-modal";
import { Button, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import { set } from "mongoose";
import InfiniteScroll from "react-infinite-scroll-component";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";

function Feed(props) {
  const user = useSelector(selectUser);

  const [isModalOpen, setisModalOpen] = useState(false);
  const close = <CloseIcon />;
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(null);
  const [userDetails, setUserDetails] = useState([]);

  const reloadPostsPerRender = 4;

  let isMounted = true;

  // useEffect(async () => {
  //   if (isMounted) {
  //     await axios
  //       .get("/questions/questions/gettotalpages/" + reloadPostsPerRender)
  //       .then((res) => {
  //         setTotalPages(res.data.data);
  //       })
  //       .catch((e) => console.log(e));
  //   }
  // }, []);

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

  const getTotalPages = async () => {
    setTotalPages(
      await axios
        .get("/questions/questions/gettotalpages/" + reloadPostsPerRender)
        .then((res) => {
          return res.data.data;
        })
        .catch((e) => console.log(e))
    );
  };

  // useEffect(() => {
  //   axios
  //     .get("/api/questions")
  //     .then((res) => {
  //       // console.log(res.data);
  //       res.data.reverse();
  //       setPosts(res.data);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // }, []);

  const fetchData = async () => {
    await getTotalPages();
    // console.log("Fetch data called");
    console.log(page, reloadPostsPerRender);
    await axios
      .get(
        "/api/questions/findquestionspagebypage/" +
          page +
          "/" +
          reloadPostsPerRender
      )
      .then((res) => {
        // console.log(res.data);
        // res.data.reverse();
        if (
          Object.keys(res.data).length === 0
          // || page > totalPages
        ) {
          console.log("Stop ", page);
          setHasMore(false);
          setPage(1);
        }
        console.log(res.data);
        setPosts([...posts, ...res.data]);
        console.log(posts);
      })
      .catch((e) => {
        console.log(e);
      });
    setPage(page + 1);
  };

  useEffect(async () => {
    if (isMounted) {
      await fetchData();
    }
  }, []);

  useEffect(() => {
    return () => {
      setisModalOpen(false);
      setPosts([]);
      setPage(1);
      // setTotalPages(null);
      setUserDetails([]);
      setHasMore(true);
    };
  }, []);

  return (
    <div className="feed">
      <div className="gossipBox-wrapper" onClick={() => setisModalOpen(true)}>
        <GossipBox />
      </div>
      <div className="posts">
        <InfiniteScroll
          dataLength={posts.length} //This is important field to render the next data
          next={fetchData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <div style={{ textAlign: "center" }}>
              <div className="end-game">
                <img className="end-game-img" src="/img/end_game.png" alt="" />
                <h4>You've reached the end of your feed.</h4>
                <p>Add some more questions to discover</p>
              </div>
            </div>
          }
          // below props only if you need pull down functionality
          // refreshFunction={this.refresh}
          // pullDownToRefresh
          // pullDownToRefreshThreshold={50}
          // pullDownToRefreshContent={
          //   <h3 style={{ textAlign: "center" }}>
          //     &#8595; Pull down to refresh
          //   </h3>
          // }
          // releaseToRefreshContent={
          //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
          // }
        >
          {Object.values(posts).map((postdata, i) => (
            <Post
              key={i}
              from={props.from}
              // postProfilePic={postdata.postProfilePic}
              // postProfileName={postdata.postProfileName}
              // postProfileBio={postdata.postProfileBio}
              postUser={postdata.user}
              postUserCompleteDetails={postdata.userCompleteDetails[0]}
              postTimestamp={postdata.createdAt}
              postQuestion={postdata.questionName}
              postSpaceName={postdata.spaceName}
              postQuestionType={postdata.questionType}
              postAnswer={postdata.allAnswers}
              postId={postdata._id}
              postSlug={postdata.slug}
            />
          ))}
        </InfiniteScroll>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        closeIcon={close}
        center
      >
        <AddQuestionModal
          isModalOpen={isModalOpen}
          setisModalOpen={setisModalOpen}
        />
      </Modal>
    </div>
  );
}

export default Feed;
