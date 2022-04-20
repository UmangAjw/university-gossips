import React from "react";
import "./css/SpacesTiles.css";

function SpacesTiles(props) {
  return (
    <div className="spaces_tiles">
      <div className="spaces_tiles_banner">
        <img
          className="space_tiles_banner_img"
          src="/img/spaceimages/space-banners/space-banner.png"
          alt=""
        />
      </div>
      <div className="spaces_tiles_profile_pic_wrapper">
        <div className="spaces_tiles_profile_pic">
          <img
            className="spaces_tiles_profile_pic_img"
            src={props.widgetSpaceImg}
            alt=""
          />
        </div>
      </div>
      <div className="spaces_tiles_name">{props.widgetSpaceHeading}</div>
      <div className="spaces_tiles_desc">{props.widgetSpaceSubheading}</div>
    </div>
  );
}

export default SpacesTiles;
