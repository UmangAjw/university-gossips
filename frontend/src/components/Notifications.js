import React, { useState, useEffect } from "react";
import "./css/Notifications.css";
import NotificationItems from "./NotificationItems";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import axios from "axios";
import EmptyZone from "./EmptyZone";

function Notifications() {
  const user = useSelector(selectUser);

  const [notificationContents, setNotificationContents] = useState([]);
  const isMounted = true;

  useEffect(async () => {
    if (isMounted && user && user.uid) {
      await axios
        .get("/api/spaces/getNotificationContents/" + user.uid)
        .then((res) => {
          console.log("Notification contents retreived");
          setNotificationContents(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(() => {
    return () => {
      setNotificationContents([]);
    };
  }, []);

  return (
    <div className="notifications">
      <div className="notifications_header">
        <h3>Notifications</h3>
      </div>

      {notificationContents.length !== 0 ? (
        <div className="notifications_content">
          {Object.values(
            notificationContents.sort(function (a, b) {
              return b.questionCreatedAt - a.questionCreatedAt;
            })
          ).map((eachNotificationContent, i) => (
            <NotificationItems
              key={i}
              eachNotificationContent={eachNotificationContent}
            />
          ))}
        </div>
      ) : (
        <EmptyZone
          heading1="No notifications!"
          heading2="You will be notified for every new post for the spaces you follow."
        />
      )}
    </div>
  );
}

export default Notifications;
