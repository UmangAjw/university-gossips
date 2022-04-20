import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import GossipsNavbar from "./GossipsNavbar";
import "./css/Spaces.css";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import SpacesTiles from "./SpacesTiles";
import axios from "axios";
import { NavLink } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "react-responsive-modal";
import CreateSpaceModal from "./CreateSpaceModal";

function Spaces() {
  const [isModalOpen, setisModalOpen] = useState(false);
  const close = <CloseIcon />;
  const [widgetitemsdatas, setWidgetItemsDatas] = useState([]);

  let isMounted = true;

  useEffect(async () => {
    if (isMounted) {
      await axios
        .get("/api/spaces/getallspacesonly")
        .then((res) => {
          // console.log(res.data.data);
          setWidgetItemsDatas(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(() => {
    return () => {
      setWidgetItemsDatas([]);
    };
  }, []);

  return (
    <div className="spaces">
      <div className="spaces_child_container">
        <div className="spaces_header">
          <div className="spaces_header_top_card">
            <img
              className="spaces_header_top_card_bg"
              src="/img/spaces_bg_cover.png"
              alt=""
            />
            <h3>Welcome To Spaces</h3>
            <p>Follow Spaces to explore your interests on uGossips. </p>
            <div className="spaces_header_top_card_btn_wrapper">
              <div
                onClick={() => setisModalOpen(true)}
                className="space_header_top_card_create_btn"
              >
                <AddOutlinedIcon className="spaces_header_top_card_create_svg"></AddOutlinedIcon>
                Create a space
              </div>
              <a
                style={{ textDecoration: "none", color: "inherit" }}
                href="#spaces_content"
              >
                <div className="space_header_top_card_discover_btn">
                  <ExploreOutlinedIcon className="spaces_header_top_card_discover_svg"></ExploreOutlinedIcon>
                  Discover Spaces
                </div>
              </a>
            </div>
          </div>
        </div>

        <div id="spaces_content" className="spaces_content">
          <h2>Discover Spaces</h2>
          <p>Spaces you might like</p>
          <div className="spaces_all_tiles">
            {Object.values(widgetitemsdatas).map((widgetitemsdata, i) => (
              <NavLink
                key={i}
                className={"widget-navlink"}
                target="_top"
                to={`/space/${widgetitemsdata.slug}`}
              >
                <SpacesTiles
                  key={i}
                  widgetSpaceImg={
                    widgetitemsdata && widgetitemsdata.spaceProfilePic
                      ? "/img/spaceprofilepics/" +
                        widgetitemsdata.spaceProfilePic
                      : "/"
                  }
                  widgetSpaceHeading={widgetitemsdata.spaceName}
                  widgetSpaceSubheading={widgetitemsdata.spaceDesc}
                />
              </NavLink>
            ))}
          </div>
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

export default Spaces;
