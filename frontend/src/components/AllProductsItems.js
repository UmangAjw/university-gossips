import React from "react";
import "./css/AllProductsItems.css";

function AllProductsItems(props) {
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
        <div style={{ display: "flex", "flex-direction": "column" }}>
          <div className="allproducts_items_name">
            <h4 className="allproducts_items_name_txt">{props.productName}</h4>
          </div>
          <div className="allproducts_items_price">{props.productPrice}</div>
        </div>
        {/* <div class="all_users_delete">
          <svg
            class="MuiSvgIcon-root delete_post_by_user_pic"
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path>
          </svg>
        </div> */}
      </div>
    </div>
  );
}

export default AllProductsItems;
