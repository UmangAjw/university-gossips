import React, { useEffect } from "react";
import GossipsNavbar from "./GossipsNavbar";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import FeedTemp from "./FeedTemp";
import Widget from "./Widget";
import "./css/Gossips.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Following from "./Following";
import YourActivity from "./YourActivity";
import Spaces from "./Spaces";
import Notifications from "./Notifications";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import axios from "axios";

function Gossips() {
  const user = useSelector(selectUser);
  const isMounted = true;

  useEffect(async () => {
    if (user && isMounted)
      await axios
        .get("/api/userDetails/getuserbyid/" + user.uid)
        .then((res) => {
          if (res.data.data.length === 0) {
            window.location.href = "/firstTimeLogin";
          }
        })
        .catch((e) => {
          console.log(e);
        });
  }, []);

  return (
    // <div className="gossips">
    //   <Router>
    //     <GossipsNavbar />
    //     <div className="gossips_content">
    //       <div className="gossips_contents">
    //         <Routes>
    //           <Route
    //             path="/"
    //             element={
    //               <>
    //                 <Sidebar />
    //                 <Feed />
    //                 <Widget widgetWidth="210px" />
    //               </>
    //             }
    //           ></Route>
    //           <Route
    //             path="/following"
    //             element={
    //               <>
    //                 <Following />
    //               </>
    //             }
    //           ></Route>
    //           <Route
    //             path="/activity"
    //             element={
    //               <>
    //                 <YourActivity />
    //               </>
    //             }
    //           ></Route>
    //           <Route
    //             path="/spaces"
    //             element={
    //               <>
    //                 <Spaces />
    //               </>
    //             }
    //           ></Route>
    //           <Route
    //             path="/notifications"
    //             element={
    //               <>
    //                 <Notifications />
    //               </>
    //             }
    //           ></Route>
    //         </Routes>
    //       </div>
    //     </div>
    //   </Router>
    // </div>
    <div className="gossips-home">
      {/* <GossipsNavbar /> */}
      <Sidebar />
      {/* <Feed /> */}
      <FeedTemp />
      <Widget from={"Gossips"} user={user} widgetWidth="210px" />
    </div>
  );
}

export default Gossips;
