import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser, logout } from "../features/userSlice";
import axios from "axios";
import { useParams } from "react-router-dom";

function EachUserTemp() {
  const { username } = useParams();

  const user = useSelector(selectUser);
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [displayImagePath, setdisplayImagePath] = useState();

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("image", file);

    const result = await axios.post(
      "/api/userDetails/uploadprofilepic",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    const img_index = result.data.imagePath.split("\\");
    setdisplayImagePath(img_index.pop());
    // setImage(result.data.imagePath);
    setImage(result.data.imagePath);
  };

  //   const storage = () => {
  //     multer.diskStorage({
  //       destination: function (req, res, next) {
  //         next(null, "../../public/img/userprofiles");
  //       },
  //       filename: (req, res, next) => {
  //         next(null, Date.now() + path.extname(file.originalname));
  //       },
  //     });
  //   };

  //   const upload = multer({
  //     storage: storage,
  //   }).single("user-profile");

  console.log(user);
  return (
    <div>
      Hello, {user ? user.email : ""}
      <input
        filename={file}
        onChange={(e) => setFile(e.target.files[0])}
        type="file"
        accept="image/*"
        name="user-profile"
      />
      <button onClick={handleSubmit} type="submit">
        Submit
      </button>
      {displayImagePath ? (
        <img src={"/img/userprofilepics/" + displayImagePath} alt="" />
      ) : (
        ""
      )}
      {/* <img src="/img/userprofilepics/some_random.png" alt="" /> */}
    </div>
  );
}

export default EachUserTemp;
