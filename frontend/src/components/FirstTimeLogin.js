import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser, logout } from "../features/userSlice";
import { Button } from "@material-ui/core";
import SidebarItems from "./SidebarItems";
import "./css/FirstTimeLogin.css";
import { useParams } from "react-router-dom";

function FirstTimeLogin() {
  const user = useSelector(selectUser);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [userBio, setUserBio] = useState("");
  const [file, setFile] = useState();
  const [displayImagePath, setdisplayImagePath] = useState();
  const [referredBy, setReferredBy] = useState([]);
  const [userAddedSuccessfully, setUserAddedSuccessfully] = useState(false);
  const firstTimeLoginURL = useParams();

  let spacesCounter = 0;
  const [sidebardatas, setSidebarDatas] = useState([]);

  // console.log(firstTimeLoginURL.username);
  let isMounted = true;

  useEffect(async () => {
    if (user) {
      await axios
        .get("/api/userDetails/getuserbyid/" + user.uid)
        .then((res) => {
          if (res.data.data.length !== 0) window.location.href = "/";
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(async () => {
    if (isMounted) {
      await axios
        .get("/api/spaces/getallspacesonly")
        .then((res) => {
          // console.log(res.data);
          setSidebarDatas(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });

      if (firstTimeLoginURL.username) {
        await axios
          .get(
            "/api/userDetails/getuserbyusername/" + firstTimeLoginURL.username
          )
          .then((res) => {
            console.log(res.data.data);
            setReferredBy(res.data.data);
          })
          .catch((e) => console.log(e, "Error getting referred by!"));
      }
    }
  }, []);

  useEffect(async () => {
    if (profilePic !== "") {
      await addUserInDB();
    }
  }, [profilePic]);

  useEffect(async () => {
    if (profilePic !== "" && userAddedSuccessfully) {
      await addFollowersInSpace();
    }
  }, [userAddedSuccessfully]);

  useEffect(() => {
    return () => {
      setUsername("");
      setName("");
      setProfilePic("");
      setUserBio("");
      setSidebarDatas([]);
      setFile();
      setdisplayImagePath();
      setReferredBy([]);
      setUserAddedSuccessfully(false);
    };
  }, []);

  function randomstring(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async function uploadProfilePic() {
    let noWhiteUsername = username.replace(/^\s+|\s+$/g, "");
    setUsername(noWhiteUsername);

    let noWhiteName = name.replace(/^\s+|\s+$/g, "");
    setName(noWhiteName);

    let noWhiteBio = userBio.replace(/^\s+|\s+$/g, "");
    setUserBio(noWhiteBio);

    const imgExtensionRegex = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
    let fileExtensionCheck;
    if (file) fileExtensionCheck = imgExtensionRegex.test(file.name);

    let flag = 1;

    if (
      noWhiteUsername !== "" &&
      noWhiteName !== "" &&
      noWhiteBio !== "" &&
      fileExtensionCheck
    ) {
      if (file) {
        if (noWhiteUsername.length < 6 || noWhiteUsername.length > 30) {
          document.querySelector(".username_length_error").style.display =
            "block";
          flag = 0;
        }
        if (noWhiteName.length < 6 || noWhiteName.length > 50) {
          document.querySelector(".name_length_error").style.display = "block";
          flag = 0;
        }
        if (noWhiteBio.length < 6 || noWhiteBio.length > 200) {
          document.querySelector(".bio_length_error").style.display = "block";
          flag = 0;
        }
        if (flag === 1) {
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
        alert("Please choose your profile pic.");
      }
    } else {
      alert("Please fill details properly.");
    }
  }

  async function addUserInDB() {
    console.log("Inside add user in db", user);
    let xp = 0;
    let xpTransactions = [];
    // let slug =
    //   user.email.substring(0, user.email.indexOf("@")) + "-" + randomstring(5);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // setdisplayImagePath(img_index.pop());

    // setProfilePic(displayImagePath);
    console.log(profilePic);

    if (profilePic) {
      console.log(user, xp, username, name, profilePic, userBio);

      if (firstTimeLoginURL.username) xp = 10;

      const body = {
        user: user,
        xp: xp,
        xpTransactions: xpTransactions,
        username: username,
        name: name,
        profilePic: profilePic,
        userBio: userBio,
      };

      const userAddSuccess = await axios
        .post("/api/userDetails", body, config)
        .then((res) => {
          console.log(res.data);
          setUserAddedSuccessfully(true);
          return true;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.status == 400) {
            document.querySelector(".create_space_modal_nav").style.display =
              "block";
          }
        });

      if (userAddSuccess && referredBy) {
        let currentXp = await axios
          .get(
            "/api/userDetails/getuserbyusername/" + referredBy.username,
            config
          )
          .then((res) => {
            console.log(
              "Xp inside promise of referred by",
              typeof res.data.data.xp
            );
            return res.data.data.xp;
          })
          .catch((e) => {
            console.log(e);
            alert("Error in getting xp!");
          });
        if (currentXp && Number.isInteger(currentXp)) {
          currentXp += 10;

          const body = {
            xp: currentXp,
          };

          await axios
            .put(
              "/api/userDetails/updateUserDetails/" + referredBy.user.uid,
              body,
              config
            )
            .then((res) => {
              console.log("10 Xp rewarded", currentXp);

              alert("10 Xp rewarded!");
              window.location.href = "/";
            })
            .catch((e) => {
              console.log(e);
              alert("Error in adding xp!");
            });
        }
      }
    }
  }

  const addFollowersInSpace = async () => {
    console.log("inside add followers in space");
    let form = document.querySelector(".firsttimelogin_all_choices");

    let allChoices = [];

    form.querySelectorAll("input").forEach(async (input) => {
      if (input.type === "checkbox" && input.checked) {
        console.log("Inside forech and if");
        let inputValue = input.value;
        let eachSpaceSlug = inputValue.substring(0, inputValue.indexOf(","));
        // let eachSpaceFollowers = [
        //   inputValue.indexOf(",") + 1 === inputValue.length
        //     ? ""
        //     : inputValue.substring(
        //         inputValue.indexOf(",") + 1,
        //         inputValue.length
        //       ),
        // ];

        let eachSpaceFollowers = inputValue
          .substring(inputValue.indexOf(",") + 1)
          .split(",");

        eachSpaceFollowers = eachSpaceFollowers.filter((item) => item);

        let temp_followers = eachSpaceFollowers;
        if (temp_followers !== undefined) {
          if (!temp_followers.includes(user.uid)) {
            temp_followers.push(user.uid);
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            const body = {
              followers: temp_followers,
            };
            const followerAddedSuccess = await axios
              .put("/api/spaces/updateSpace/" + eachSpaceSlug, body, config)
              .then((res) => {
                console.log("Follower added successfully!");
                // window.location.href = "/space/" + slug;
              })
              .catch((e) => {
                console.log(e);
                alert("Error in following!");
              });
          }
        }

        allChoices.push(eachSpaceFollowers);
      }
    });
    console.log(allChoices);
    // alert("User and followers added!");
    if (!firstTimeLoginURL.username) window.location.href = "/";
  };

  return (
    <div className="firsttimelogin">
      <div className="firsttimelogin_child_container">
        <div className="firsttimelogin-referredby">
          {referredBy && referredBy.username ? (
            <>
              <img
                className="firsttimelogin-referredby-pic"
                src={"/img/userprofilepics/" + referredBy.profilePic}
                alt=""
              />
              <p className="firsttimelogin-referredby-txt">
                {referredBy ? referredBy.name.toUpperCase() : "Temp Name"} HAS
                INVITED YOU TO uGossips.
              </p>{" "}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="firsttimelogin_header">
          Please fill up some more details to continue
        </div>
        <div className="firsttimelogin_wrapper">
          <div className="userdetails">
            <div className="userdetails_fields">
              <div className="userdetails_username">
                <label
                  className="login-field-label"
                  htmlFor="ugossips_user_name"
                >
                  Username
                  <span className="required_star">*</span>
                </label>
                <input
                  placeholder="Enter username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    document.querySelector(
                      ".username_length_error"
                    ).style.display = "none";
                  }}
                  name="ugossips_user_name"
                  id="ugossips_user_name"
                />
                <p className="create_space_modal_av">
                  This username is available.
                </p>
                <p className="create_space_modal_nav">
                  This username is unavailable.
                </p>
                <p className="username_length_error first_time_login_error">
                  Username character length must be between 6 to 30
                </p>
              </div>
              <div className="userdetails_display_name">
                <label
                  className="login-field-label"
                  htmlFor="ugossips_display_name"
                >
                  Name
                  <span className="required_star">*</span>
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
                />
                <p className="name_length_error first_time_login_error">
                  Name character length must be between 6 to 50
                </p>
              </div>
              <div className="userdetails_profile_pic">
                <label
                  className="login-field-label"
                  htmlFor="ugossips_profile_pic"
                >
                  Profile Pic (jpg, jpeg, gif, png only)
                  <span className="required_star">*</span>
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
              </div>
              {/* <div className="userdetails_country">
                <label className="login-field-label" htmlFor="ugossips_country">
                  Country
                </label>
                <div className="ugossips_country_box">
                  <select name="ugossips_country" id="ugossips_country">
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
              </div> */}
              <div className="userdetails_bio">
                <label
                  className="login-field-label"
                  htmlFor="ugossips_user_bio"
                >
                  User Bio
                  <span className="required_star">*</span>
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
                />
                <p className="bio_length_error first_time_login_error">
                  Bio character length must be between 6 to 200
                </p>
              </div>
            </div>
          </div>
          <div className="firsttimelogin_all_choices">
            <label className="login-field-label" htmlFor="">
              Follow spaces
              {/* <span className="required_star">*</span> */}
            </label>
            {Object.values(sidebardatas).map((sidebardata, i) => (
              <div key={i} className="each_choice">
                <input
                  type="checkbox"
                  name={"spaces_input_name"}
                  id={"spaces" + spacesCounter}
                  className={"each_choice_input"}
                  value={[sidebardata.slug, sidebardata.followers]}
                />
                <label htmlFor={"spaces" + spacesCounter++}>
                  <SidebarItems
                    from={"FirstTimeLogin"}
                    key={i}
                    sideBarImg={
                      "/img/spaceprofilepics/" + sidebardata.spaceProfilePic
                    }
                    sideBarTxt={sidebardata.spaceName}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="firsttimelogin_btn_wrapper">
          <Button
            // disabled={true}
            className="firsttimelogin_next_btn"
            onClick={() => {
              uploadProfilePic();
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FirstTimeLogin;
