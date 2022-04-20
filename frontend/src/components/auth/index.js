import React, { useState, useEffect } from "react";
import "../css/Login.css";
import { Button } from "@material-ui/core";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { auth, provider, facebookProvider } from "../../Firebase";
import CloseIcon from "@material-ui/icons/Close";
import { Modal } from "react-responsive-modal";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Login() {
  const [register, setRegister] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [referredBy, setReferredBy] = useState([]);
  const { username } = useParams();
  const history = useHistory();

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

  // console.log("Username", username);
  const toggleNewUser = () => {
    setRegister(!register);
    document.querySelector(
      "#ugossips_email"
    ).style.border = `1px solid var(--border-color)`;
    document.querySelector(".email-error").style.display = `none`;
  };

  const googleSignIn = async () => {
    let userCredential = await signInWithPopup(auth, provider)
      .then((userCredential) => {
        console.log("Successfully signed in with Google", userCredential);
        // return userCredential;
        window.location.href =
          username && referredBy && referredBy.username
            ? "/firstTimeLogin/referred-by/" + username
            : "/";
      })
      .catch((e) => {
        console.log(e);
      });
    // if (userCredential.providerId === "facebook.com") {
    //   alert(`${email} account already exists with Facebook.`);
    // }
  };

  const facebookSignIn = async () => {
    let userCredential = await signInWithPopup(auth, facebookProvider)
      .then((userCredential) => {
        console.log("Successfully signed in with Facebook", userCredential);
        // return userCredential;
        window.location.href =
          username && referredBy && referredBy.username
            ? "/firstTimeLogin/referred-by/" + username
            : "/";
      })
      .catch((e) => {
        console.log(e);
        if (e.code === "auth/account-exists-with-different-credential") {
          alert(`This account already exists with Google.`);
          window.location.href =
            username && referredBy && referredBy.username
              ? "/firstTimeLogin/referred-by/" + username
              : "/";
        }
      });
    // if (userCredential.providerId === "google.com") {
    // }
  };

  const userRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let flag = 1;
    // let noWhiteEmail = email.replace(/^\s+|\s+$/g, "");
    // setEmail(noWhiteEmail);

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let emailCheck = emailRegex.test(email);
    console.log(emailCheck);

    if (document.querySelector(".pwd-error")) {
      document.querySelector(".pwd-error").style.display = `block`;
    }
    if (document.querySelector(".email-error")) {
      document.querySelector(".email-error").style.display = `block`;
    }

    if (!emailCheck) {
      flag = 0;
      document.querySelector(".email_auth_check").style.display = "block";
    }

    if (email === "") {
      setError("Required field is missing");
      setLoading(false);
      const ugossips_emailEl = document.querySelector("#ugossips_email");
      ugossips_emailEl.style.borderColor = "red";
    } else if (password === "") {
      setError("Required field is missing");
      setLoading(false);
      const ugossips_pwdEl = document.querySelector("#ugossips_pwd");
      ugossips_pwdEl.style.borderColor = "red";
    } else {
      let userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
        .then(async (userCredential) => {
          setLoading(false);
          console.log(
            "Successfully registered with email and password",
            userCredential
          );
          alert(
            `We have sent an email to ${email}. Please use that link to verify and then try logging in.`
          );
          return userCredential;
          // auth.signOut();
          // window.location.href =
          //   username && referredBy && referredBy.username
          //     ? "/firstTimeLogin/referred-by/" + username
          //     : "/firstTimeLogin";
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

      if (userCredential && Object.keys(userCredential).length !== 0) {
        await sendEmailVerification(userCredential.user);

        let interval = setInterval(async () => {
          if (userCredential.user.emailVerified) {
            clearInterval(interval);
            let redirect_url =
              username && referredBy && referredBy.username
                ? "/firstTimeLogin/referred-by/" + username
                : "/firstTimeLogin";
            console.log(redirect_url);
            // history.push(redirect_url);
            window.location.href = redirect_url;
          }
          await userCredential.user.reload();
        }, 1000);
      }
    }
  };

  const emailSignIn = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let flag = 1;
    // let noWhiteEmail = email.replace(/^\s+|\s+$/g, "");
    // setEmail(noWhiteEmail);

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let emailCheck = emailRegex.test(email);

    if (document.querySelector(".pwd-error"))
      document.querySelector(".pwd-error").style.display = `block`;
    if (document.querySelector(".email-error"))
      document.querySelector(".email-error").style.display = `block`;

    if (!emailCheck) {
      flag = 0;
      document.querySelector(".email_auth_check").style.display = "block";
    }

    // if (flag && noWhiteEmail !== "") {
    if (email === "") {
      setError("Required field is missing");
      setLoading(false);
      const ugossips_emailEl = document.querySelector("#ugossips_email");
      ugossips_emailEl.style.borderColor = "red";
    } else if (password === "") {
      setError("Required field is missing");
      setLoading(false);
      const ugossips_pwdEl = document.querySelector("#ugossips_pwd");
      ugossips_pwdEl.style.borderColor = "red";
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
    // }
    // else {
    //   setLoading(false);

    //   alert("Please enter valid email");
    //   window.location.href = "/";
    // }
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
                  <div onClick={facebookSignIn} className="login-facebook">
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
                            document.querySelector(
                              ".email_auth_check"
                            ).style.display = "none";
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
                        <p className="email_auth_check first_time_login_error">
                          Please enter valid email
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
                            document.querySelector(
                              ".email_auth_check"
                            ).style.display = "none";
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
                        <p className="email_auth_check first_time_login_error">
                          Please enter valid email
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
                        {/* <a
                          disabled="disabled"
                          href="#"
                          className="login-forget"
                        >
                          Forgot Password?
                        </a> */}
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
              <NavLink target="_top" to="/about">
                About
              </NavLink>
              &nbsp;-&nbsp;
              <NavLink target="_top" to="/terms">
                Terms
              </NavLink>
              &nbsp;-&nbsp;
              <NavLink target="_top" to="/privacy">
                Privacy
              </NavLink>
              &nbsp;-&nbsp;
              <NavLink target="_top" to="/acceptable-use">
                Acceptable Use
              </NavLink>
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
