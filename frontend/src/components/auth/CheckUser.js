import React, { useEffect, useState } from "react";
import { login, logout, selectUser } from "../../features/userSlice";
import { auth } from "../../Firebase";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export const CheckUser = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photo: authUser.photoURL,
            displayName: authUser.displayName,
            email: authUser.email,
          })
        );
        setIsLoggedIn(true);
        localStorage.setItem("auth", true);
      } else {
        dispatch(logout());
        localStorage.removeItem("auth");
      }
    });
  }, [dispatch]);

  const isLogin = () => {
    if (localStorage.getItem("auth")) return true;
    return false;
  };
  return isLogin();
};

export default CheckUser;
