import React, { useEffect, useState } from "react";

import "./css/ReferAndEarn.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser, logout } from "../features/userSlice";
import { NavLink } from "react-router-dom";

function ReferAndEarn() {
  const user = useSelector(selectUser);
  const [userDetails, setUserDetails] = useState([]);

  const isMounted = true;
  useEffect(async () => {
    if (isMounted && user) {
      await axios
        .get("/api/userDetails/getuserbyid/" + user.uid)
        .then((res) => {
          console.log(res.data.data);
          setUserDetails(res.data.data);
        })
        .catch((e) => {
          console.log(e, "Error fetching user details from username");
        });
    }
  }, []);

  useEffect(() => {
    return () => {
      setUserDetails([]);
    };
  }, []);

  function copyToClipboard() {
    var copyText = document.querySelector(".refer_and_earn_link_container");

    console.log(copyText.innerText);
    // copyText.select();
    // copyText.setSelectionRange(0, 99999); /* For mobile devices */

    navigator.clipboard.writeText(copyText.innerText);

    alert("Copied the text: " + copyText.innerText);
  }

  return (
    <div className="refer_and_earn">
      <div className="refer_and_earn_title_box">
        <h1 className="refer_and_earn_title">Refer Friends, win prizes!</h1>
        <p className="refer_and_earn_sub_title">
          If you enjoy sharing on uGossips, share your referral link with
          firends to win prizes. Learn and grow together with your friends.
        </p>
      </div>
      <div className="refer_and_earn_working_box">
        <h2 className="refer_and_earn_working_title">How it works?</h2>
        <div className="refer_and_earn_working_cols">
          <div className="refer_and_earn_working_each_col">
            <p className="refer_and_earn_working_each_col_title">
              Refer Someone
            </p>
            <p className="refer_and_earn_working_each_col_txt">
              You refer your friend with your custom referral link below. Once
              they create account, you will see an increase in your XP points.
            </p>
          </div>
          <div className="refer_and_earn_working_each_col">
            <p className="refer_and_earn_working_each_col_title">
              You get Exclusive XP points
            </p>
            <p className="refer_and_earn_working_each_col_txt">
              Apart from the regular XP gained through other actions. Over here
              both you and a new user sign ups using this link gets 10XP.
            </p>
          </div>
          <div className="refer_and_earn_working_each_col">
            <p className="refer_and_earn_working_each_col_title">
              You get free prizes
            </p>
            <p className="refer_and_earn_working_each_col_txt">
              Once valid person sign ups using your link, XP will be credited to
              your account and you can redeem the same in the redeem shop.
            </p>
          </div>
        </div>
      </div>
      <div className="refer_and_earn_copy_container">
        <div className="refer_and_earn_copy_container_title_box">
          <h2 className="refer_and_earn_copy_container_title">
            Share your link
          </h2>
          <p className="refer_and_earn_copy_container_txt">
            Copy your personal referral link and share it with your friends.
          </p>
        </div>
        <div className="refer_and_earn_link_container_wrapper">
          <div className="refer_and_earn_link_container">
            <NavLink
              target="_top"
              className={"refer_and_earn_link"}
              to={
                userDetails && userDetails.username
                  ? "auth/referred-by/" + userDetails.username
                  : "/"
              }
            >
              {userDetails && userDetails.username
                ? "http://localhost:3000/auth/referred-by/" +
                  userDetails.username
                : "/"}
            </NavLink>
          </div>
          <button onClick={copyToClipboard} className="refer_and_earn_link_btn">
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReferAndEarn;
