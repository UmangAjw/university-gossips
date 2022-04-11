import React, { useState, useEffect, useRef } from "react";
import SidebarItems from "./SidebarItems";
// import sidebardatas from "../data/sidebaritems.json";
import { Button } from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import CloseIcon from "@material-ui/icons/Close";
import { Modal } from "react-responsive-modal";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser, logout } from "../features/userSlice";
import "./css/Sidebar.css";
import CreateSpaceModal from "./CreateSpaceModal";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const [isModalOpen, setisModalOpen] = useState(false);
  const close = <CloseIcon />;
  let spacesCounter = 0;
  const user = useSelector(selectUser);

  const [sidebardatas, setSidebarDatas] = useState([]);
  const [sidebarownerdatas, setSidebarOwnerDatas] = useState([]);

  let isMounted = true;

  useEffect(async () => {
    if (isMounted && user) {
      await axios
        .get("/api/spaces/getspacesbyfollower/" + user.uid)
        .then((res) => {
          // console.log(res.data);
          setSidebarDatas(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });

      await axios
        .get("/api/spaces/getspacesbyowner/" + user.uid)
        .then((res) => {
          // console.log(res.data);
          setSidebarOwnerDatas(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(() => {
    return () => {
      setSidebarDatas([]);
      setisModalOpen(false);
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-create-btn-div">
        <Button
          onClick={() => setisModalOpen(true)}
          className="sidebar_create_btn"
        >
          <AddOutlinedIcon className="sidebar_create_btn_plus"></AddOutlinedIcon>
          &ensp;Create Space
        </Button>
      </div>
      <div className="sidebaritems">
        {Object.values(sidebarownerdatas).map((sidebarownerdata, i) => (
          <NavLink
            key={i}
            className={"sidebar-navlink"}
            target="_top"
            to={`/space/${sidebarownerdata.slug}`}
          >
            <SidebarItems
              // key={i}
              // sideBarImg={sidebarownerdata.sideBarImg}
              // sideBarTxt={sidebarownerdata.sideBarTxt}
              from={"Home"}
              key={i}
              sideBarImg={
                sidebarownerdata && sidebarownerdata.spaceProfilePic
                  ? "/img/spaceprofilepics/" + sidebarownerdata.spaceProfilePic
                  : "/"
              }
              sideBarTxt={sidebarownerdata.spaceName}
            />
          </NavLink>
        ))}
        {Object.values(sidebardatas).map((sidebardata, i) => (
          <NavLink
            key={i}
            className={"sidebar-navlink"}
            target="_top"
            to={`/space/${sidebardata.slug}`}
          >
            <SidebarItems
              // key={i}
              // sideBarImg={sidebardata.sideBarImg}
              // sideBarTxt={sidebardata.sideBarTxt}
              from={"Home"}
              key={i}
              sideBarImg={
                sidebardata && sidebardata.spaceProfilePic
                  ? "/img/spaceprofilepics/" + sidebardata.spaceProfilePic
                  : "/"
              }
              sideBarTxt={sidebardata.spaceName}
            />
          </NavLink>
        ))}
      </div>

      <div className="sidebar-discover-btn-div">
        <Button className="sidebar_discover_btn">
          <ExploreOutlinedIcon className="sidebar_discover_btn_explore"></ExploreOutlinedIcon>
          &ensp;Discover Spaces
        </Button>
      </div>
      <div className="sidebar-bottom">
        <hr className="sidebar-bottom-divider" />
        <div className="sidebar-bottom-links">
          <NavLink to="/">About</NavLink> -&nbsp;<NavLink to="/">Terms</NavLink>{" "}
          -&nbsp;
          <NavLink to="/">Privacy</NavLink> -&nbsp;{" "}
          <NavLink to="/">Acceptable Use</NavLink> -&nbsp;{" "}
          <NavLink to="/refer-and-earn">Refer & Earn</NavLink>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        closeIcon={close}
        center
      >
        <CreateSpaceModal />
      </Modal>
    </div>
  );
}

export default Sidebar;
