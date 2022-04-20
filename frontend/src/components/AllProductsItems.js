import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import "./css/AllProductsItems.css";

function AllProductsItems(props) {
  async function deleteProduct() {
    if (props.productId) {
      await axios
        .delete("/api/products/deletebyid/" + props.productId)
        .then((res) => {
          console.log("Product Deleted Successfully!");
          window.location.href = "/admin/manage-products";
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  return (
    <div className="allproducts_items">
      <div className="allproducts_items_pic_div">
        <img
          className="allproducts_items_pic_div"
          src={"/img/productprofilepics/" + props.productProfilePic}
          alt=""
        />
      </div>
      <div className="allproducts_items_info">
        <NavLink
          className={"allproduct_all_items_link"}
          to={"/product/" + props.productSlug}
          target="_top"
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="allproducts_items_name">
              <h4 className="allproducts_items_name_txt">
                {props.productName}
              </h4>
            </div>
            <div className="allproducts_items_price">{props.productPrice}</div>
          </div>
        </NavLink>
        {props.from && props.from === "ManageProducts" ? (
          <div
            onClick={() => deleteProduct()}
            style={{
              width: "auto",
              height: "auto",
              display: "flex",
              alignItems: "center",
            }}
            className="all_users_delete"
          >
            <svg
              className="MuiSvgIcon-root delete_post_by_user_pic"
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path>
            </svg>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default AllProductsItems;
