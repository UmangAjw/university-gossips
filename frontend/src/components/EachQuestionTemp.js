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
import PostForEachUser from "./PostForEachUser";
import EmptyZone from "./EmptyZone";

function EachQuestionTemp(props) {
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
        .get("/api/questions/findbyslug2/" + slug)
        .then((res) => {
          setQuestion(res.data.data);
          if(res.data.data[0].length === 0) window.location.href='/page-404'
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
        {question && question[0] && question[0][0] !== undefined ? (
          <div className="each_question_question">
            {question && question[0] && question[0][0] !== undefined
              ? Object.values(question[0]).map((postdata, i) => (
                  <React.Fragment key={i}>
                    {postdata[0][0].questionType ? (
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
                        from={"EachQuestionTemp"}
                      />
                    ) : (
                      ""
                    )}
                  </React.Fragment>

                  // <div>
                  //   <br />
                  //   <br />
                  //   <p>{JSON.stringify(postdata[1][0])}</p>
                  // </div>
                ))
              : ""}

            {/* {JSON.stringify(questions[0])} */}
          </div>
        ) : (
          ""
        )}
      </div>
      {/* <div className="each-question-empty-div"></div> */}
      <Widget widgetWidth="210px" />
      {/* <Modal
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
      </Modal> */}
    </div>
  );
}

export default EachQuestionTemp;
