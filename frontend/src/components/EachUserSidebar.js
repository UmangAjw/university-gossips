import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import WidgetItems from "./WidgetItems";
import EmptyZone from "./EmptyZone";
import "./css/EachUserSidebar.css";

function EachUserSidebar(props) {
  const [ownerSpacesDatas, setOwnerSpacesDatas] = useState([]);

  let isMounted = true;

  useEffect(async () => {
    if (isMounted && props && props.spaceOwnerId) {
      await axios
        .get("/api/spaces/getspacesbyowner/" + props.spaceOwnerId)
        .then((res) => {
          console.log(res.data.data);
          setOwnerSpacesDatas(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(() => {
    return () => {
      setOwnerSpacesDatas([]);
    };
  }, []);

  return (
    <div className="each_user_sidebar">
      <div className="each_user_sidebar_header">
        <h4 className="each_user_sidebar_header_txt">
          {props.spaceOwnerName}'s Spaces
        </h4>
      </div>

      <div className="each_user_sidebar_content">
        {ownerSpacesDatas.length !== 0 ? (
          Object.values(ownerSpacesDatas).map((ownerSpacesData, i) => (
            // <NavLink
            //   key={i}
            //   className={"widget-navlink"}
            //   target="_top"
            //   to={`/space/${ownerSpacesData.slug}`}
            // >
            <WidgetItems
              key={i}
              widgetSpaceImg={
                ownerSpacesData && ownerSpacesData.spaceProfilePic
                  ? "/img/spaceprofilepics/" + ownerSpacesData.spaceProfilePic
                  : "/"
              }
              widgetSpaceSlug={ownerSpacesData.slug}
              widgetSpaceHeading={ownerSpacesData.spaceName}
              widgetSpaceSubheading={ownerSpacesData.spaceDesc}
            />
            // </NavLink>
          ))
        ) : (
          <EmptyZone
            heading1={"No spaces"}
            heading2={"This user has not created any spaces"}
          />
        )}
      </div>
    </div>
  );
}

export default EachUserSidebar;
