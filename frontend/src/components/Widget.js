import React from "react";
import WidgetItems from "./WidgetItems";
import "./css/Widget.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// import widgetitemsdatas from "../data/widgetitems.json";

function Widget(props) {
  const [widgetitemsdatas, setWidgetItemsDatas] = useState([]);

  let isMounted = true;

  function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let randomNum = randomNumber(1, 5);

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
    <div className="widget" style={{ flex: "0 0 " + props.widgetWidth }}>
      <div className="widget_header">
        <h4 className="widget_header_txt">Spaces to follow</h4>
      </div>
      <div className="widget_content">
        {Object.values(widgetitemsdatas).map((widgetitemsdata, i) => (
          <NavLink
            key={i}
            className={"widget-navlink"}
            target="_top"
            to={`/space/${widgetitemsdata.slug}`}
          >
            <WidgetItems
              key={i}
              widgetSpaceImg={
                widgetitemsdata && widgetitemsdata.spaceProfilePic
                  ? "/img/spaceprofilepics/" + widgetitemsdata.spaceProfilePic
                  : "/"
              }
              widgetSpaceHeading={widgetitemsdata.spaceName}
              widgetSpaceSubheading={widgetitemsdata.spaceDesc}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Widget;
