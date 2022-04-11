import React, { useState, useEffect } from "react";
import EachRank from "./EachRank";
import "./css/UserRank.css";
import axios from "axios";
import { NavLink } from "react-router-dom";
import RedeemShopSidebar from "./RedeemShopSidebar";

function UserRank() {
  const [users, setUsers] = useState([]);
  const isMounted = true;
  useEffect(() => {
    if (isMounted) {
      axios
        .get("/api/userDetails/getallusers")
        .then((res) => {
          console.log(res.data.data);
          setUsers(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);
  useEffect(() => {
    return () => {
      setUsers([]);
    };
  }, []);
  let index = 1;
  return (
    <div className="userrank">
      <RedeemShopSidebar />
      <div className="userrank-table">
        <div className="userrank-table-header">
          <div className="userrank-header-rank">Rank</div>
          <div className="userrank-header-user">User</div>
          <div className="userrank-header-xp">Total XP</div>
        </div>
        <div className="userrank-allusers">
          {Object.values(
            users.sort(function (a, b) {
              return b.xp - a.xp;
            })
          ).map((eachUsers, i) => (
            <EachRank key={i} index={index++} allUsers={eachUsers} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserRank;
