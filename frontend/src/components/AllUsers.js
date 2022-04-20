import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { NavLink } from "react-router-dom";
import AllUsersItems from "./AllUsersItems";
import "./css/AllUsers.css";

function AllUsers() {
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
          console.log(e.msg);
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
    <div className="all_users">
      <div className="all_users_table">
        <div className="all_users_table_header">
          <div className="all_users_table_header_sr_no">Sr. No.</div>
          <div className="all_users_table_header_user">User</div>
          <div className="all_users_table_header_sr_no">Action</div>
        </div>
        <div className="all_users_array">
          {Object.values(users).map((eachUsers, i) => (
            <AllUsersItems key={i} index={index++} allUsers={eachUsers} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllUsers;
