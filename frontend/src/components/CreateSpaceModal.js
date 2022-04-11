import React, { useState, useEffect } from "react";
import "./css/CreateSpaceModal.css";
import { Button } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import slugify from "react-slugify";

function CreateSpaceModal() {
  const user = useSelector(selectUser);
  const [spaceName, setSpaceName] = useState("");
  const [spaceDesc, setSpaceDesc] = useState("");
  const [spaceProfilePic, setSpaceProfilePic] = useState("");
  const [file, setFile] = useState();
  const [displayImagePath, setdisplayImagePath] = useState();
  const isMounted = true;

  useEffect(async () => {
    if (isMounted && spaceProfilePic !== "") {
      await createNewSpace();
    }
  }, [spaceProfilePic]);

  useEffect(() => {
    return () => {
      setSpaceName("");
      setSpaceDesc("");
      setSpaceProfilePic("");
      setFile("");
      setdisplayImagePath("");
    };
  }, []);

  async function uploadProfilePic() {
    const formData = new FormData();
    formData.append("image", file);

    const result = await axios.post(
      "/api/spaces/uploadspaceprofilepic",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log(result);
    const img_index = result.data.imagePath.split("\\");
    setSpaceProfilePic(img_index.pop());
  }

  const createNewSpace = async () => {
    let noWhiteSpaceName = spaceName.replace(/^\s+|\s+$/g, "");
    setSpaceName(noWhiteSpaceName);
    let noWhiteSpaceDesc = spaceDesc.replace(/^\s+|\s+$/g, "");
    setSpaceDesc(noWhiteSpaceDesc);
    console.log("I am pressed! create new space", spaceName, spaceDesc);

    if (noWhiteSpaceDesc !== "" && noWhiteSpaceDesc !== "") {
      const slug = slugify(noWhiteSpaceName);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const followers = [];
      const moderators = [];
      const body = {
        spaceName: noWhiteSpaceName,
        spaceDesc: noWhiteSpaceDesc,
        user: user,
        slug: slug,
        followers: followers,
        moderators: moderators,
        spaceProfilePic: spaceProfilePic,
      };
      await axios
        .post("api/spaces", body, config)
        .then((res) => {
          console.log(res.data);
          // alert(res.data.message);
          window.location.href = "/space/" + slug;
          return true;
        })
        .catch((e) => {
          if (e.response.status == 400) {
            document.querySelector(".create_space_modal_nav").style.display =
              "block";
          }
          // alert("Error in adding question!");
        });
    }
  };

  return (
    <div className="create_space_modal">
      <div className="create_space_modal_title">
        <h3>Create a Space</h3>
        <p>Share your interests, curate content, host discussions, and more.</p>
      </div>
      <div className="create_space_modal_name_wrapper">
        <label
          className="create_space_modal_name_label"
          htmlFor="create_space_modal_name"
        >
          Name
          <span className="required_star">*</span>
        </label>
        <input
          value={spaceName}
          onChange={(e) => {
            document.querySelector(".create_space_modal_nav").style.display =
              "none";
            document.querySelector(".create_space_modal_av").style.display =
              "none";

            setSpaceName(e.target.value);
          }}
          type="text"
          id="create_space_modal_name"
          name="create_space_modal_name"
        />
        <p className="create_space_modal_av">This name is available.</p>
        <p className="create_space_modal_nav">This name is unavailable.</p>
      </div>
      <div className="create_space_modal_desc_wrapper">
        <label
          className="create_space_modal_desc_label"
          htmlFor="create_space_modal_desc"
        >
          Brief Description
          <span className="required_star">*</span>
        </label>
        <p className="create_space_modal_desc_sub_label">
          Include a few keywords to show people what to expect if they join.
        </p>
        <input
          value={spaceDesc}
          onChange={(e) => setSpaceDesc(e.target.value)}
          type="text"
          id="create_space_modal_desc"
          name="create_space_modal_desc"
        />
      </div>
      <div className="create_space_modal_profile_pic_wrapper">
        <label
          className="create_space_modal_profile_pic_label"
          htmlFor="create_space_modal_profile_pic"
        >
          Profile Picture<span className="required_star">*</span>
        </label>
        <div className="create_space_modal_profile_pic_box">
          <input
            filename={file}
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            name="create_space_modal_profile_pic"
            id="create_space_modal_profile_pic"
          />
        </div>
      </div>
      <div className="create_space_modal_footer">
        <div className="create_space_modal_footer_divider"></div>
        <div className="create_space_modal_footer_btns">
          <Button onClick={uploadProfilePic} className="create_space_modal_btn">
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateSpaceModal;
