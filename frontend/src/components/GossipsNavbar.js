import React, { useState, useEffect } from "react";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import HomeIcon from "@material-ui/icons/Home";
import BallotOutlinedIcon from "@material-ui/icons/BallotOutlined";
import BallotIcon from "@material-ui/icons/Ballot";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Avatar, Button, Tooltip } from "@material-ui/core";
import "./css/GossipsNavbar.css";
import CloseIcon from "@material-ui/icons/Close";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import AddQuestionModal from "./AddQuestionModal";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, logout } from "../features/userSlice";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import { ADMIN_USER_UID } from "./auth/Constants";

function GossipsNavbar() {
  const [isModalOpen, setisModalOpen] = useState(false);
  const close = <CloseIcon />;
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState([]);
  const [URL, setURL] = useState("");

  const [posts, setPosts] = useState([]);

  let isMounted = true;

  // useEffect(async () => {
  //   if (user && URL !== "/firstTimeLogin")
  //     await axios
  //       .get("/api/userDetails/getuserbyid/" + user.uid)
  //       .then((res) => {
  //         if (res.data.data.length === 0) {
  //           window.location.href = "/firstTimeLogin";
  //         }
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });
  // }, []);

  useEffect(async () => {
    if (isMounted) {
      await axios
        .get("/api/questions/")
        .then((res) => {
          // console.log(res.data);
          res.data.reverse();
          setPosts(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(async () => {
    if (isMounted && user) {
      await axios
        .get("/api/userDetails/getuserbyid/" + user.uid)
        .then((res) => {
          // console.log(res.data.data);
          setUserDetails(res.data.data);
        })
        .catch((e) => {
          console.log(e, "Error fetching user details from username");
        });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      setisModalOpen(false);
      setUserDetails([]);
      setURL("");
      setPosts([]);
    };
  }, []);

  let logOutBtn = () => {
    if (window.confirm("Are you sure to logout ?")) {
      signOut(auth)
        .then(() => {
          dispatch(logout());
          console.log("Logged out");
          window.location.href = "/";
        })
        .catch(() => {
          console.log("error in logout");
        });
    }
  };

  let BtnHide = () => {
    let gNavbar_plus_btnEl = document.querySelector(".gNavbar_plus_btn");
    let gNavbar_overlayEl = document.querySelector(".gNavbar_overlay");
    let gNavbar_input_fieldEl = document.querySelector(".gNavbar_input_field");
    // let gNavbar_search_results = document.querySelector(
    //   ".MuiAutocomplete-popper"
    // );

    // gNavbar_plus_btnEl.style.display = "none";
    // gNavbar_input_fieldEl.style.width = "300px";
    gNavbar_overlayEl.style.display = "block";
    // gNavbar_search_results.style.display = "block !important";
  };
  let BtnShow = () => {
    let gNavbar_plus_btnEl = document.querySelector(".gNavbar_plus_btn");
    let gNavbar_overlayEl = document.querySelector(".gNavbar_overlay");
    // let gNavbar_search_results = document.querySelector(
    //   ".MuiAutocomplete-popper"
    // );

    // gNavbar_plus_btnEl.style.display = "flex";
    gNavbar_overlayEl.style.display = "none";
    // gNavbar_search_results.style.display = "none !important";
  };

  function profileMenu() {
    document.getElementById("myProfileDropdown").classList.toggle("show");
  }

  window.onClick = function (event) {
    if (!event.target.matches(".gNavbar_avatar")) {
      var dropdowns = document.getElementsByClassName(
        "profile_dropdown_content"
      );
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  };

  return (
    <div className="gNavbar-wrapper">
      <div className="gNavbar">
        <div className="gNavbar-content">
          <NavLink
            to={"/"}
            exact
            target={"_top"}
            style={{
              textDecoration: "none",
              color: "inherit",
              height: "auto",
              display: "flex",
            }}
          >
            <div className="gNavbar_logo">
              <h2 className="text-logo">uGossips</h2>
              {/* <img className="main-logo" src="/img/quora-logo.png" alt="" /> */}
            </div>
          </NavLink>
          <div className="gNavbar_icons">
            <Tooltip title="Home">
              <NavLink exact to="/" className="navbar_selected">
                <div className=" primary_icon gNavbar_icon">
                  <HomeIcon className="primary_svg gNavbar_svg" />
                  <HomeOutlinedIcon className="secondary_svg gNavbar_svg" />
                </div>
              </NavLink>
            </Tooltip>
            <Tooltip title="Following">
              <NavLink to="/following" className="navbar_selected">
                <div className=" primary_icon gNavbar_icon">
                  <BallotIcon className="primary_svg gNavbar_svg" />
                  <BallotOutlinedIcon className="secondary_svg gNavbar_svg" />
                </div>
              </NavLink>
            </Tooltip>
            <Tooltip title="Activity">
              <NavLink to="/activity" className="navbar_selected">
                <div className=" primary_icon gNavbar_icon">
                  <AssignmentTurnedInIcon className="primary_svg gNavbar_svg" />
                  <AssignmentTurnedInOutlinedIcon className="secondary_svg gNavbar_svg" />
                </div>
              </NavLink>
            </Tooltip>
            <Tooltip title="Spaces">
              <NavLink to="/spaces" className="navbar_selected">
                <div className=" primary_icon gNavbar_icon">
                  <PeopleAltIcon className="primary_svg gNavbar_svg" />
                  <PeopleAltOutlinedIcon className="secondary_svg gNavbar_svg" />
                </div>
              </NavLink>
            </Tooltip>
            <Tooltip title="Notifications">
              <NavLink to="/notifications" className="navbar_selected">
                <div className=" primary_icon gNavbar_icon">
                  <NotificationsActiveIcon className="primary_svg gNavbar_svg" />
                  <NotificationsActiveOutlinedIcon className="secondary_svg gNavbar_svg" />
                </div>
              </NavLink>
            </Tooltip>
          </div>
          {/* <div className="gNavbar_input">
            <div className="gNavbar_input_wrapper">
              <SearchIcon className="gNavbar_svg_search" />
              <input
                onFocus={BtnHide}
                onBlur={BtnShow}
                className="gNavbar_input_field"
                type="text"
                placeholder="Search uGossips"
              />
            </div>
            <div className="gNavbar_input_result">
              {posts.map((value, key) => (
                <NavLink to={"/question/" + value.slug}>
                  <p className="gNavbar_input_result_txt">
                    {value.questionName}
                  </p>
                </NavLink>
              ))}
            </div>
          </div> */}
          {/* <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={posts.map((option) => option.questionName)}
            renderInput={(params) => (
              <div ref={params.InputProps.ref} className="gNavbar_input">
                <SearchIcon className="gNavbar_svg_search" />
                <input
                  {...params.inputProps}
                  autoFocus
                  onFocus={BtnHide}
                  onBlur={BtnShow}
                  className="gNavbar_input_field"
                  type="text"
                  placeholder="Search uGossips"
                />
              </div>
            )}
            renderOption={(option) => {
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.location.href = `/question/${option.slug}`;
                }}
              >
                {option.questionName}
              </span>;
            }}
          /> */}
          <Autocomplete
            id="custom-input-demo"
            // options={posts.map((option) => option.questionName, option.slug)}
            options={posts}
            disableClearable
            forcePopupIcon={false}
            getOptionLabel={(option) => {
              return `${option.questionName}: ${option.slug}`;
            }}
            renderInput={(params) => (
              <div ref={params.InputProps.ref} className="gNavbar_input">
                <SearchIcon className="gNavbar_svg_search" />
                <input
                  {...params.inputProps}
                  onFocus={BtnHide}
                  onBlur={BtnShow}
                  className="gNavbar_input_field"
                  type="text"
                  placeholder="Search uGossips"
                />
              </div>
            )}
            renderOption={(option) => (
              <NavLink target="_top" to={"/question/" + option.slug}>
                {option.questionName}
              </NavLink>
            )}
          />
          <div className="gNavbar_end_buttons">
            <div className="gNavbar_plus_btn">
              <NavLink to="/redeemShop/" className="navbar_selected">
                <Button className="gNavbar_plus_btn_a">Redeem shop</Button>
              </NavLink>
            </div>
            <div onClick={profileMenu} className="gNavbar_avatar ">
              <Avatar
                src={
                  userDetails && userDetails.profilePic
                    ? "/img/userprofilepics/" + userDetails.profilePic
                    : "/"
                }
                className="gNavbar_svg user_img"
              />
            </div>
            {userDetails ? (
              <div className="profile_dropdown">
                <div
                  id="myProfileDropdown"
                  className="profile_dropdown_content"
                >
                  <NavLink
                    className={"profile_dropdown_link"}
                    to={"/user/" + userDetails.username}
                  >
                    View Public Profile
                  </NavLink>
                  <NavLink
                    target={"_top"}
                    className={"profile_dropdown_link"}
                    to="/account-settings"
                  >
                    Account Settings
                  </NavLink>
                  {user && user.uid === ADMIN_USER_UID ? (
                    <NavLink className={"profile_dropdown_link"} to="/admin/">
                      Admin Panel
                    </NavLink>
                  ) : (
                    ""
                  )}
                  <div onClick={logOutBtn} className={"profile_dropdown_link"}>
                    Logout
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="gNavbar_add_btn">
              <Button
                onClick={() => setisModalOpen(true)}
                className="gNavbar_add_btn_a"
              >
                Add question
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "none" }} className="gNavbar_overlay"></div>
      {/* <Modal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        closeIcon={close}
        center
      >
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
              <AccountCircleIcon className="modal_info_profile_pic" />
              <p className="modal_info_profile_name">Umang Ajwalia asked</p>
            </div>
            <div className="modal_scope">
              <PeopleOutlineIcon className="modal_scope_people_icon" />
              <p className="modal_scope_people_text">Public</p>
              <ExpandMoreIcon />
            </div>
          </div>
          <div className="modal_inputs">
            <input
              type="text"
              placeholder='Start your question with "What", "How", "Why", etc.'
              className="modal_question_input"
            />
          </div>
          <div className="modal_footer_buttons">
            <Button className="modal_footer_cancel">Cancel</Button>
            <Button className="modal_footer_add_q">Add question</Button>
          </div>
        </div>
      </Modal> */}
      <Modal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        closeIcon={close}
        center
      >
        <AddQuestionModal
          isModalOpen={isModalOpen}
          setisModalOpen={setisModalOpen}
          spaceName={""}
        />
      </Modal>
    </div>
  );
}

export default GossipsNavbar;
