import { Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./css/AccountSettings.css";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import axios from "axios";

function AccountSettings() {
  const user = useSelector(selectUser);
  const [name, setName] = useState("");
  const [userBio, setUserBio] = useState("");
  const [file, setFile] = useState();
  const [userDetails, setUserDetails] = useState([]);
  const [profilePic, setProfilePic] = useState("");

  let isMounted = true;

  useEffect(async () => {
    if (isMounted && user) {
      await axios
        .get("/api/userDetails/getuserbyid/" + user.uid)
        .then((res) => {
          console.log(res.data.data);
          setUserDetails(res.data.data);
        })
        .catch((e) => {
          console.log(e, "Error fetching user details from user uid");
        });
    }
  }, [user]);

  useEffect(async () => {
    if (user && user.uid && isMounted && profilePic !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        profilePic: profilePic,
      };

      await axios
        .put("/api/userDetails/updateUserDetails/" + user.uid, body, config)
        .then((res) => {
          console.log("Profile Pic updated successfully");
          window.location.href = "/account-settings";
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [profilePic]);

  useEffect(() => {
    return () => {
      setName("");
      setUserBio("");
      setFile();
      setUserDetails("");
      setProfilePic("");
    };
  }, []);

  const updateName = async () => {
    let flag = 1;

    let noWhiteName = name.replace(/^\s+|\s+$/g, "");
    setName(noWhiteName);

    if (noWhiteName.length < 6 || noWhiteName.length > 30) {
      document.querySelector(".name_length_error").style.display = "block";
      flag = 0;
    }

    if (flag && user && user.uid && noWhiteName !== "" && name !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        name: name,
      };

      await axios
        .put("/api/userDetails/updateUserDetails/" + user.uid, body, config)
        .then((res) => {
          console.log("Name updated successfully");
          window.location.href = "/account-settings";
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (name === "") {
      document.getElementById("ugossips_display_name").style.borderColor =
        "red";
    }
  };

  const updateUserBio = async () => {
    let flag = 1;

    let noWhiteBio = userBio.replace(/^\s+|\s+$/g, "");
    setUserBio(noWhiteBio);

    if (noWhiteBio.length < 6 || noWhiteBio.length > 200) {
      document.querySelector(".bio_length_error").style.display = "block";
      flag = 0;
    }

    if (flag && user && user.uid && noWhiteBio !== "" && userBio !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        userBio: userBio,
      };

      await axios
        .put("/api/userDetails/updateUserDetails/" + user.uid, body, config)
        .then((res) => {
          console.log("Bio updated successfully");
          window.location.href = "/account-settings";
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (userBio === "") {
      document.getElementById("ugossips_user_bio").style.borderColor = "red";
    }
  };

  async function uploadProfilePic() {
    const imgExtensionRegex = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
    let fileExtensionCheck;

    if (file) fileExtensionCheck = imgExtensionRegex.test(file.name);
    if (fileExtensionCheck) {
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const result = await axios.post(
          "/api/userDetails/uploadprofilepic",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(result);
        const img_index = result.data.imagePath.split("\\");
        setProfilePic(img_index.pop());
      }
    } else {
      alert("Only jpg, jpeg, png, gif are allowed!");
    }
    if (!file)
      document.querySelector(".ugossips_profile_pic_box").style.borderColor =
        "red";
  }

  // const userDetailsDisplayNameEl = document.querySelector(
  //   ".userdetails_display_name"
  // );
  // const userDetailsBioEl = document.querySelector(".userdetails_bio");
  // const userDetailsProfilePicEl = document.querySelector(
  //   ".userdetails_profile_pic"
  // );

  // if (
  //   userDetailsDisplayNameEl &&
  //   userDetailsDisplayNameEl.style &&
  //   userDetailsDisplayNameEl.style.display
  // )
  //   userDetailsDisplayNameEl.style.display = "none";

  // if (
  //   userDetailsBioEl &&
  //   userDetailsBioEl.style &&
  //   userDetailsBioEl.style.display
  // )
  //   userDetailsBioEl.style.display = "none";

  // if (
  //   userDetailsProfilePicEl &&
  //   userDetailsProfilePicEl.style &&
  //   userDetailsProfilePicEl.style.display
  // )
  //   userDetailsProfilePicEl.style.display = "none";

  const toggle = (classnameToBeModified, spanToBeModified) => {
    let displayProp = document.querySelector(classnameToBeModified);
    console.log(displayProp.style.display);

    if (displayProp.style.display === "none") {
      displayProp.style.display = "block";
      let tempText = document.querySelector(spanToBeModified).innerText;
      tempText = "Hide " + tempText;
      document.querySelector(spanToBeModified).innerText = tempText;
    } else if (displayProp.style.display === "block") {
      displayProp.style.display = "none";
      let tempText = document.querySelector(spanToBeModified).innerText;
      tempText = tempText.substring(4);
      document.querySelector(spanToBeModified).innerText = tempText;
      // document.querySelector("#ugossips_display_name").style.borderColor =
      //   "1px solid var(--border-color)";
      // document.querySelector("#ugossips_user_bio").style.borderColor =
      //   "1px solid var(--border-color)";
    }
  };

  return (
    <div className="account_settings">
      <div className="account_settings_child_container">
        <div className="account_settings_header">
          <div className="account_settings_header_title">
            <h3>Account Settings</h3>
          </div>
        </div>
        <div className="account_settings_content">
          <hr className="account_settings_divider" />
          <div className="account_settings_content_row1">
            <p className="account_settings_content_email_label">Email</p>
            <p className="account_settings_content_email">
              {userDetails && userDetails.user && userDetails.user.email}
            </p>
          </div>
          <hr className="account_settings_divider" />

          <div className="account_settings_content_row2">
            <p className="account_settings_content_name_label">Name</p>
            <div className="account_settings_content_name">
              {userDetails && userDetails.name}
              <span
                onClick={() =>
                  toggle(
                    ".userdetails_display_name",
                    ".account_settings_content_name_btn"
                  )
                }
                className="account_settings_content_name_btn"
              >
                Change Name
              </span>
              <div
                className="userdetails_display_name"
                style={{ display: "none" }}
              >
                <label
                  className="login-field-label"
                  htmlFor="ugossips_display_name"
                >
                  Name
                </label>
                <input
                  placeholder="What would you like to be called?"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    document.querySelector(".name_length_error").style.display =
                      "none";
                  }}
                  type="text"
                  name="ugossips_display_name"
                  id="ugossips_display_name"
                  style={{ border: "1px solid var(--border-color)" }}
                />
                <p className="name_length_error first_time_login_error">
                  Name character length must be between 6 to 30
                </p>
                <Button
                  id="add_question_btn"
                  onClick={() => {
                    updateName();
                  }}
                  className="modal_footer_add_q"
                >
                  Update Name
                </Button>
              </div>
            </div>
          </div>
          <hr className="account_settings_divider" />

          <div className="account_settings_content_row3">
            <p className="account_settings_content_username_label">Username</p>
            <p className="account_settings_content_username">
              @{userDetails && userDetails.username}
            </p>
          </div>
          <hr className="account_settings_divider" />

          <div className="account_settings_content_row4">
            <p className="account_settings_content_userbio_label">Userbio</p>
            <div className="account_settings_content_userbio">
              {userDetails && userDetails.userBio}
              <span
                onClick={() =>
                  toggle(
                    ".userdetails_bio",
                    ".account_settings_content_userbio_btn"
                  )
                }
                className="account_settings_content_userbio_btn"
              >
                Change Bio
              </span>
              <div className="userdetails_bio" style={{ display: "none" }}>
                <label
                  className="login-field-label"
                  htmlFor="ugossips_user_bio"
                >
                  User Bio
                </label>
                <input
                  value={userBio}
                  onChange={(e) => {
                    setUserBio(e.target.value);
                    document.querySelector(".bio_length_error").style.display =
                      "none";
                  }}
                  placeholder="Enter bio"
                  type="text"
                  name="ugossips_user_bio"
                  id="ugossips_user_bio"
                  style={{ border: "1px solid var(--border-color)" }}
                />
                <p className="bio_length_error first_time_login_error">
                  User bio character length must be between 6 to 200
                </p>
                <Button
                  id="add_question_btn"
                  onClick={() => {
                    updateUserBio();
                  }}
                  className="modal_footer_add_q"
                >
                  Update Bio
                </Button>
              </div>
            </div>
          </div>
          <hr className="account_settings_divider" />

          <div className="account_settings_content_row5">
            <p className="account_settings_content_userprofilepic_label">
              Profile Pic <br />
              (only jpg, jpeg, png, gif)
            </p>
            <div className="account_settings_content_userprofilepic_wrapper">
              <img
                className="account_settings_content_userprofilepic"
                src={
                  userDetails && userDetails.profilePic
                    ? "/img/userprofilepics/" + userDetails.profilePic
                    : "/"
                }
                alt=""
              />
              <span
                onClick={() =>
                  toggle(
                    ".userdetails_profile_pic",
                    ".account_settings_content_userprofilepic_btn"
                  )
                }
                className="account_settings_content_userprofilepic_btn"
              >
                Change Profile Pic
              </span>
              <div
                className="userdetails_profile_pic"
                style={{ display: "none" }}
              >
                <label
                  className="login-field-label"
                  htmlFor="ugossips_profile_pic"
                >
                  Profile Pic
                </label>
                <div className="ugossips_profile_pic_box">
                  <input
                    filename={file}
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    name="ugossips_profile_pic"
                    id="ugossips_profile_pic"
                  />
                </div>
                <Button
                  id="add_question_btn"
                  onClick={() => {
                    uploadProfilePic();
                  }}
                  className="modal_footer_add_q"
                >
                  Update Profile Pic
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
