import React, { useEffect, useState } from "react";
import "./css/ModeratorWidget.css";
import axios from "axios";
import { NavLink } from "react-router-dom";
import ModeratorWidgetItems from "./ModeratorWidgetItems";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

function ModeratorWidget(props) {
  console.log(props.owner);
  let [moderatorWidgetDatas, setModeratorWidgetDatas] = useState([]);
  let [spaceOwner, setSpaceOwner] = useState();
  let isMounted = true;
  const user = useSelector(selectUser);

  useEffect(async () => {
    if (isMounted && props.owner) {
      await axios
        .get("/api/userDetails/getuserbyid/" + props.owner.uid)
        .then((res) => {
          console.log(res.data.data);
          setSpaceOwner(res.data.data);
        })
        .catch((e) => {
          console.log(e, "Error fetching user details from username");
        });
    }
  }, []);

  useEffect(async () => {
    if (isMounted) {
      await axios
        .get("/api/spaces/getModeratorsObject/" + props.slug)
        .then((res) => {
          console.log(res.data.data);
          setModeratorWidgetDatas(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(() => {
    return () => {
      setModeratorWidgetDatas([]);
      setSpaceOwner();
    };
  }, []);

  return (
    <div className="moderator_widget">
      <div className="moderator_widget_header">
        <h4 className="moderator_widget_header_txt">Contributors</h4>
        {user &&
        // user.uid &&
        spaceOwner &&
        // spaceOwner.uid &&
        spaceOwner.user.uid == user.uid ? (
          <div
            onClick={() => props.setisModeratorModalOpen(true)}
            className="edit_moderators_btn"
          >
            {/* <EditOutlinedIcon className="edit_moderators_pic" /> */}
            Edit
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="moderator_wodget_content">
        <NavLink
          className={"widget-navlink"}
          target="_top"
          to={`/user/${spaceOwner?.username}`}
        >
          <ModeratorWidgetItems
            widgetImg={
              props && spaceOwner && spaceOwner?.profilePic
                ? "/img/userprofilepics/" + spaceOwner?.profilePic
                : "/"
            }
            widgetHeading={spaceOwner?.name}
            widgetSubheading={spaceOwner?.username}
          />
        </NavLink>
        {Object.values(moderatorWidgetDatas).map((moderatorWidgetData, i) => (
          <NavLink
            key={i}
            className={"widget-navlink"}
            target="_top"
            to={`/user/${moderatorWidgetData.username}`}
          >
            <ModeratorWidgetItems
              key={i}
              widgetImg={
                moderatorWidgetData && moderatorWidgetData.profilePic
                  ? "/img/userprofilepics/" + moderatorWidgetData.profilePic
                  : "/"
              }
              widgetHeading={moderatorWidgetData.name}
              widgetSubheading={moderatorWidgetData.username}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default ModeratorWidget;
