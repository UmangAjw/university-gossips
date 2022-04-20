import React from "react";
import "./css/AllUsersItems.css";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { ADMIN_USER_UID } from "./auth/Constants.js";
import BlockIcon from "@material-ui/icons/Block";

function AllUsersItems(props) {
  const deleteUser = async () => {
    console.log(props.allUsers.user.uid);
    if (props.allUsers && props.allUsers.user && props.allUsers.user.uid) {
      await axios
        .delete(
          "/api/userDetails/deleteuserdetailsbyuserid/" +
            props.allUsers.user.uid
        )
        .then((res) => {
          // console.log(res.msg);
          window.location.href = "/admin/";
        })
        .catch((e) => {
          console.log(e);
        });
      // await axios
      //   .delete(
      //     "/api/userDetails/deletespacesbyuserid/" + props.allUsers.user.uid
      //   )
      //   .then((res) => {
      //     console.log(res.msg);
      //     window.location.href = "/admin/";
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
      // await axios
      //   .delete(
      //     "/api/userDetails/deleteorderdetailsbyuserid/" +
      //       props.allUsers.user.uid
      //   )
      //   .then((res) => {
      //     console.log(res.msg);
      //     window.location.href = "/admin/";
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
      // await axios
      //   .delete(
      //     "/api/userDetails/deleteanswersbyuserid/" + props.allUsers.user.uid
      //   )
      //   .then((res) => {
      //     console.log(res.msg);
      //     window.location.href = "/admin/";
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
      // await axios
      //   .delete(
      //     "/api/userDetails/deletequestionsbyuserid/" + props.allUsers.user.uid
      //   )
      //   .then((res) => {
      //     console.log(res.msg);
      //     window.location.href = "/admin/";
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
    }
  };

  return (
    <div className="all_users_items">
      <div className="all_users_index">
        {props && props.index ? props.index : ""}
      </div>
      <NavLink
        className={"widget-navlink"}
        target="_top"
        to={`/user/${props.allUsers.username}`}
      >
        <div className="all_users_name">
          <img
            className="eachrank-pic"
            src={"/img/userprofilepics/" + props.allUsers.profilePic}
            alt=""
          />{" "}
          <p className="all_users_name_txt">
            {props && props.allUsers.name ? props.allUsers.name : ""}
          </p>
        </div>
      </NavLink>
      {props.allUsers &&
      props.allUsers.user &&
      props.allUsers.user.uid &&
      props.allUsers.user.uid !== ADMIN_USER_UID ? (
        <div
          onClick={async () => {
            if (
              props.allUsers &&
              props.allUsers.user &&
              props.allUsers.user.uid
            ) {
              let userDetailsDeleteSuccess = await axios
                .delete(
                  "/api/userDetails/deleteuserdetailsbyuserid/" +
                    props.allUsers.user.uid
                )
                .then((res) => {
                  // console.log(res.msg);
                })
                .catch((e) => {
                  console.log(e);
                });

              let userSpacesDeleteSuccess = await axios
                .delete(
                  "/api/userDetails/deletespacesbyuserid/" +
                    props.allUsers.user.uid
                )
                .then((res) => {
                  // console.log(res.msg);
                })
                .catch((e) => {
                  console.log(e);
                });

              let userQuestionsDeleteSuccess = await axios
                .delete(
                  "/api/userDetails/deletequestionsbyuserid/" +
                    props.allUsers.user.uid
                )
                .then((res) => {
                  // console.log(res.msg);
                })
                .catch((e) => {
                  console.log(e);
                });

              let userAnswersDeleteSuccess = await axios
                .delete(
                  "/api/userDetails/deleteanswersbyuserid/" +
                    props.allUsers.user.uid
                )
                .then((res) => {
                  // console.log(res.msg);
                })
                .catch((e) => {
                  console.log(e);
                });

              let userOrdersDeleteSuccess = await axios
                .delete(
                  "/api/userDetails/deleteorderdetailsbyuserid/" +
                    props.allUsers.user.uid
                )
                .then((res) => {
                  // console.log(res.msg);
                  window.location.href = "/admin/";
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          }}
          className="all_users_delete"
        >
          <DeleteForeverIcon className="delete_post_by_user_pic" />
          {/* <p>{props.allUsers.user}</p> */}
        </div>
      ) : (
        <BlockIcon
          style={{ color: "green" }}
          className="delete_post_by_user_pic"
        />
      )}
    </div>
  );
}

export default AllUsersItems;
