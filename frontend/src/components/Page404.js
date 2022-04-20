import { Button } from "@material-ui/core";
import React from "react";
import Modal from "react-responsive-modal";
import CloseIcon from "@material-ui/icons/Close";
import AddQuestionModal from "./AddQuestionModal";
import { useState } from "react";

function Page404() {
  const [isModalOpen, setisModalOpen] = useState(false);
  const close = <CloseIcon />;
  return (
    <div className="page_404">
      <div
        className="page_404_content"
        style={{
          marginTop: "70px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <video autoPlay muted loop playsInline>
          <source src="/video/404.mp4" type="video/mp4" />
        </video>
        <h1 style={{ fontSize: "60px" }} className="page_404_content_title">
          404 Not Found
        </h1>
        <p
          style={{ fontSize: "30px", margin: "10px 0px" }}
          className="page_404_content_subtitle"
        >
          Try asking a question instead
        </p>
        <div className="gNavbar_add_btn">
          <Button
            style={{ transform: "scale(1.5)", margin: "10px 0px" }}
            onClick={() => setisModalOpen(true)}
            className="gNavbar_add_btn_a"
          >
            Add question
          </Button>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        closeIcon={close}
        center
      >
        <AddQuestionModal
          isModalOpen={isModalOpen}
          setisModalOpen={setisModalOpen}
          spaceName={""}
        />
      </Modal>
    </div>
  );
}

export default Page404;
