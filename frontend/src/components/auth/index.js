import React, { useState, useEffect } from "react";
import "../css/Login.css";
import { Button } from "@material-ui/core";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../../Firebase";
import CloseIcon from "@material-ui/icons/Close";
import { Modal } from "react-responsive-modal";
import { useParams } from "react-router-dom";
import axios from "axios";

function Login() {
  const [register, setRegister] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [referredBy, setReferredBy] = useState([]);
  const { username } = useParams();

  const isMounted = true;

  useEffect(async () => {
    if (isMounted && username) {
      axios
        .get("/api/userDetails/getuserbyusername/" + username)
        .then((res) => {
          console.log(res.data.data);
          setReferredBy(res.data.data);
        })
        .catch((e) => console.log(e, "Error getting referred by!"));
    }
  }, []);

  useEffect(() => {
    return () => {
      setReferredBy([]);
      setRegister(true);
      setEmail("");
      setPassword("");
      setLoading(false);
      setError("");
    };
  }, []);

  // const [isModalOpen, setisModalOpen] = useState(false);
  // const [username, setUsername] = useState("");
  // const [name, setName] = useState("");
  // const [profilePic, setProfilePic] = useState("");
  // const [userBio, setUserBio] = useState("");
  // const close = <CloseIcon />;

  console.log("Username", username);
  const toggleNewUser = () => {
    setRegister(!register);
    document.querySelector(
      "#ugossips_email"
    ).style.border = `1px solid var(--border-color)`;
    document.querySelector(".email-error").style.display = `none`;
  };

  const googleSignIn = () => {
    signInWithPopup(auth, provider).then((res) => {
      console.log("Successfully signed in with Google", res);
      window.location.href =
        username && referredBy && referredBy.username
          ? "/firstTimeLogin/referred-by/" + username
          : "/";
    });
  };

  const userRegister = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (document.querySelector(".pwd-error")) {
      document.querySelector(".pwd-error").style.display = `block`;
    }
    if (document.querySelector(".email-error")) {
      document.querySelector(".email-error").style.display = `block`;
    }
    if (email === "" || password === "") {
      setError("Required field is missing");
      setLoading(false);
      const ugossips_emailEl = document.querySelector("#ugossips_email");
      ugossips_emailEl.style.borderColor = "red";
      const ugossips_pwdEl = document.querySelector("#ugossips_pwd");
      ugossips_pwdEl.style.borderColor = "red";
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          setLoading(false);
          console.log("Successfully registered with email and password", res);

          window.location.href =
            username && referredBy && referredBy.username
              ? "/firstTimeLogin/referred-by/" + username
              : "/firstTimeLogin";
        })
        .catch((err) => {
          if (err.code === "auth/email-already-in-use") {
            const ugossips_emailEl = document.querySelector("#ugossips_email");
            ugossips_emailEl.style.borderColor = "red";
          } else if (err.code === "auth/weak-password") {
            const ugossips_pwdEl = document.querySelector("#ugossips_pwd");
            ugossips_pwdEl.style.borderColor = "red";
          }
          setError(err.code);
          console.log(error);
          setLoading(false);
        });
    }
  };

  const emailSignIn = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (document.querySelector(".pwd-error"))
      document.querySelector(".pwd-error").style.display = `block`;
    if (document.querySelector(".email-error"))
      document.querySelector(".email-error").style.display = `block`;
    if (email === "" || password === "") {
      const ugossips_emailEl = document.querySelector("#ugossips_email");
      ugossips_emailEl.style.borderColor = "red";
      const ugossips_pwdEl = document.querySelector("#ugossips_pwd");
      ugossips_pwdEl.style.borderColor = "red";
      setError("Required field is missing");
      setLoading(false);
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
          console.log("Successfully signed in with email,", res);
          setLoading(false);
          window.location.href = "/";
        })
        .catch((err) => {
          if (
            err.code === "auth/invalid-email" ||
            err.code === "auth/user-not-found"
          ) {
            const ugossips_emailEl = document.querySelector("#ugossips_email");
            ugossips_emailEl.style.borderColor = "red";
          } else if (err.code === "auth/wrong-password") {
            const ugossips_pwdEl = document.querySelector("#ugossips_pwd");
            ugossips_pwdEl.style.borderColor = "red";
          }
          setError(err.code);
          console.log(error);
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <div className="login-wrapper">
        <div
          style={{
            backgroundImage: `url(../../../img/root-bg.png)`,
          }}
          className="login-bg"
        >
          <div className="login-box">
            <div className="login-upper">
              <div className="uGossips-logo">uGossips</div>
              <div className="uGossips-caption">
                A Question &#38; Answer Website
              </div>
              <div className="login-left-right">
                <div className="login-left">
                  <div onClick={googleSignIn} className="login-google">
                    <img
                      src="/img/google-logo.png"
                      className="google-logo"
                      alt=""
                    />
                    &nbsp; Continue with Google
                  </div>
                  <div className="login-facebook">
                    <img
                      src="/img/facebook-logo.png"
                      className="facebook-logo"
                      alt=""
                    />
                    &nbsp; Continue with Facebook
                  </div>
                  <Button onClick={toggleNewUser} className="new-user-btn">
                    {register ? "Already registered?" : "New User?"}
                  </Button>
                  {/* <Button onClick={() => setisModalOpen(true)}>Check</Button> */}
                  <div className="horizontal-seperator"></div>
                  <div className="login-terms">
                    By continuing you indicate that you agree to our{" "}
                    <span className="login-terms-tos">Terms of Service</span>{" "}
                    and{" "}
                    <span className="login-terms-privacy">Privacy Policy</span>.
                  </div>
                </div>
                <div className="login-seperator"></div>

                <div className="login-right">
                  {register ? (
                    <>
                      <p className="login-label">
                        Register{" "}
                        <span className="register-referredby">
                          {username && referredBy && referredBy.name
                            ? "Invited by " + referredBy.name
                            : ""}
                        </span>{" "}
                      </p>
                      <div className="horizontal-seperator"></div>
                      <div className="login-email">
                        <label
                          className="login-field-label"
                          htmlFor="ugossips_email"
                        >
                          Email
                        </label>
                        <input
                          placeholder="Your email"
                          disabled={loading}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            document.querySelector(
                              "#ugossips_email"
                            ).style.border = `1px solid var(--border-color)`;
                            document.querySelector(
                              ".email-error"
                            ).style.display = `none`;
                          }}
                          type="email"
                          name="ugossips_email"
                          id="ugossips_email"
                        />
                        <p className="email-error">
                          {error === "auth/email-already-in-use"
                            ? "Account already exists with that e-mail address."
                            : ""}
                        </p>
                      </div>

                      <div className="login-pwd">
                        <label
                          className="login-field-label"
                          htmlFor="ugossips_pwd"
                        >
                          Password
                        </label>
                        <input
                          placeholder="Your password"
                          disabled={loading}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            document.querySelector(
                              "#ugossips_pwd"
                            ).style.border = `1px solid var(--border-color)`;
                            document.querySelector(".pwd-error").innerText = ``;
                          }}
                          type="password"
                          name="ugossips_pwd"
                          id="ugossips_pwd"
                        />

                        <p className="pwd-error">
                          {error === "auth/weak-password"
                            ? "Password should be more than 6 chars."
                            : ""}
                        </p>
                      </div>
                      <div className="login-right-last">
                        <a href="#" className="login-forget"></a>
                        <Button
                          disabled={loading}
                          onClick={userRegister}
                          className="login-btn"
                        >
                          {loading ? "Registering..." : "Register"}
                        </Button>
                        {/* <Button onClick={() => setisModalOpen(true)}>
                          Test Modal
                        </Button> */}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="login-label">Login</p>
                      <div className="horizontal-seperator"></div>
                      <div className="login-email">
                        <label
                          className="login-field-label"
                          htmlFor="ugossips_email"
                        >
                          Email
                        </label>
                        <input
                          placeholder="Your email"
                          value={email}
                          disabled={loading}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            document.querySelector(
                              "#ugossips_email"
                            ).style.border = `1px solid var(--border-color)`;
                            document.querySelector(
                              ".email-error"
                            ).style.display = `none`;
                          }}
                          type="email"
                          name="ugossips_email"
                          id="ugossips_email"
                        />
                        <p className="email-error">
                          {error === "auth/invalid-email"
                            ? "Invalid email"
                            : error === "auth/user-not-found"
                            ? "No account found for this email."
                            : ""}
                        </p>
                      </div>
                      <div className="login-pwd">
                        <label
                          className="login-field-label"
                          htmlFor="ugossips_pwd"
                        >
                          Password
                        </label>
                        <input
                          placeholder="Your password"
                          type="password"
                          disabled={loading}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            document.querySelector(
                              "#ugossips_pwd"
                            ).style.border = `1px solid var(--border-color)`;
                            document.querySelector(
                              ".pwd-error"
                            ).style.display = `none`;
                          }}
                          name="ugossips_pwd"
                          id="ugossips_pwd"
                        />
                        <p className="pwd-error">
                          {error === "auth/wrong-password"
                            ? "Incorrect Password."
                            : ""}
                        </p>
                      </div>
                      <div className="login-right-last">
                        <a
                          disabled="disabled"
                          href="#"
                          className="login-forget"
                        >
                          Forgot Password?
                        </a>
                        <Button
                          disabled={loading}
                          onClick={emailSignIn}
                          className="login-btn"
                        >
                          {loading ? "Signing in..." : "Login"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="login-footer">
              <a href="#">About</a>&nbsp;-&nbsp;<a href="#">Terms</a>
              &nbsp;-&nbsp;
              <a href="#">Privacy</a>&nbsp;-&nbsp;<a href="#">Acceptable Use</a>
            </div>
          </div>
        </div>
      </div>

      {/* <Modal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        closeIcon={close}
        center
      >
        <>
          <div className="userdetails_modal">
            <div className="userdetails_modal_title">
              <h4>Please fill up some more details to continue</h4>
            </div>
            <div className="userdetails_modal_fields">
              <div className="userdetails_modal_username">
                <label
                  className="login-field-label"
                  htmlFor="ugossips_user_name"
                >
                  Username
                </label>
                <input
                  placeholder="Enter username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  name="ugossips_user_name"
                  id="ugossips_user_name"
                />
              </div>
              <div className="userdetails_modal_display_name">
                <label
                  className="login-field-label"
                  htmlFor="ugossips_display_name"
                >
                  Name
                </label>
                <input
                  placeholder="What would you like to be called?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="ugossips_display_name"
                  id="ugossips_display_name"
                />
              </div>
              <div className="userdetails_modal_profile_pic">
                <label
                  className="login-field-label"
                  htmlFor="ugossips_profile_pic"
                >
                  Profile Pic
                </label>
                <div className="ugossips_profile_pic_box">
                  <input
                    type="file"
                    name="ugossips_profile_pic"
                    id="ugossips_profile_pic"
                  />
                </div>
              </div>
              {/* <div className="userdetails_modal_country">
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
      {/* <div className="userdetails_modal_bio">
                <label
                  className="login-field-label"
                  htmlFor="ugossips_user_bio"
                >
                  User Bio
                </label>
                <input
                  placeholder="Enter bio"
                  type="text"
                  name="ugossips_user_bio"
                  id="ugossips_user_bio"
                />
              </div>
            </div>
            <div className="userdetails_modal_footer_buttons">
              <Button className="userdetails_modal_footer_next">Next</Button>
            </div>
          </div>
        </>
      </Modal>  */}
    </div>
  );
}

export default Login;
