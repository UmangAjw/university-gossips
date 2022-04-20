import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { Modal } from "react-responsive-modal";
import { useSelector } from "react-redux";
import { selectUser, logout } from "../features/userSlice";
import CloseIcon from "@material-ui/icons/Close";
import "./css/AllProducts.css";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

import slugify from "react-slugify";
import axios from "axios";
import AllProductsItems from "./AllProductsItems";
import { NavLink } from "react-router-dom";

function AllProducts(props) {
  const user = useSelector(selectUser);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [productDatas, setProductDatas] = useState([]);
  const close = <CloseIcon />;
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productDesc, setProductDesc] = useState("");
  const [productStock, setProductStock] = useState(0);
  const [productProfilePic, setProductProfilePic] = useState("");
  const [file, setFile] = useState();
  const [displayImagePath, setdisplayImagePath] = useState();

  const isMounted = true;

  useEffect(async () => {
    if (isMounted) {
      await axios
        .get("/api/products")
        .then((res) => {
          console.log(res.data.data);
          setProductDatas(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(() => {
    return () => {
      setisModalOpen(false);
      setProductDatas([]);
      setProductName("");
      setProductPrice(0);
      setProductDesc("");
      setProductStock(0);
      setProductProfilePic("");
      setdisplayImagePath();
    };
  }, []);

  async function uploadProfilePic() {
    let flag = 1;
    let noWhiteProductName = productName.replace(/^\s+|\s+$/g, "");
    setProductName(noWhiteProductName);

    let noWhiteProductDesc = productDesc.replace(/^\s+|\s+$/g, "");
    setProductDesc(noWhiteProductDesc);

    let productPriceInt = parseInt(productPrice);
    let productStockInt = parseInt(productStock);

    const imgExtensionRegex = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
    let fileExtensionCheck;

    if (file) fileExtensionCheck = imgExtensionRegex.test(file.name);

    // console.log(typeof productPriceInt, typeof productStockInt);
    // console.log(productPriceInt, productStockInt);

    if (noWhiteProductName.length < 6 || noWhiteProductName.length > 50) {
      document.querySelector(".product_name_length_error").style.display =
        "block";
      flag = 0;
    }
    if (noWhiteProductDesc.length < 6 || noWhiteProductDesc.length > 500) {
      document.querySelector(".product_desc_length_error").style.display =
        "block";
      flag = 0;
    }

    if (
      flag &&
      noWhiteProductName !== "" &&
      noWhiteProductDesc !== "" &&
      !isNaN(productPriceInt) &&
      productPriceInt > 0 &&
      !isNaN(productStockInt) &&
      productStockInt > 0 &&
      fileExtensionCheck
    ) {
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const result = await axios.post(
          "/api/products/uploadproductprofilepic",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(result);
        const img_index = result.data.imagePath.split("\\");
        setProductProfilePic(img_index.pop());
      } else {
        alert("Please choose product image.");
      }
    } else {
      alert("Please fill details properly.");
    }
  }

  useEffect(async () => {
    if (isMounted && productProfilePic !== "") {
      await handleAddProduct();
    }
  }, [productProfilePic]);

  const handleAddProduct = async () => {
    let noWhiteProductName = productName.replace(/^\s+|\s+$/g, "");
    setProductName(noWhiteProductName);

    let noWhiteProductDesc = productDesc.replace(/^\s+|\s+$/g, "");
    setProductDesc(noWhiteProductDesc);

    const slug = slugify(productName);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (productProfilePic) {
      const body = {
        user: user,
        slug: slug,
        productName: noWhiteProductName,
        productPrice: productPrice,
        productDesc: noWhiteProductDesc,
        productStock: productStock,
        productProfilePic: productProfilePic,
      };

      await axios
        .post("/api/products", body, config)
        .then((res) => {
          console.log("Product added successfully");
          window.location.href = "/admin/manage-products";
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="allproducts">
      {props.from && props.from === "ManageProducts" ? (
        <div className="allproducts_header_top_card">
          <img
            className="allproducts_header_top_card_bg"
            src="/img/spaces_bg_cover.png"
            alt=""
          />
          <h3>Welcome To Products</h3>
          <p>Click on Add Products to add new products </p>
          <div className="allproducts_header_top_card_btn_wrapper">
            <div
              onClick={() => setisModalOpen(true)}
              className="allproducts_header_top_card_create_btn"
            >
              <AddOutlinedIcon className="allproducts_header_top_card_create_svg"></AddOutlinedIcon>
              Add Product
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="allproduct_all_items">
        {Object.values(productDatas).map((productData, i) => (
          <AllProductsItems
            from={props.from}
            productSlug={productData.slug}
            productProfilePic={productData.productProfilePic}
            productName={productData.productName}
            productPrice={productData.productPrice}
            key={i}
            productId={productData._id}
          />
        ))}
      </div>
      {/* <Button onClick={() => setisModalOpen(true)}>Add product</Button> */}
      <Modal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        closeIcon={close}
        center
      >
        <div className="add_product_modal">
          <div className="add_product_header">
            <h3>Add Product</h3>
            <p>
              This added product will be directly visible to the end user in
              Redeem Shop.
            </p>
          </div>
          <div className="add_product_modal_fields">
            <label
              className="login-field-label"
              htmlFor="ugossips_display_name"
            >
              Product Name
              <span className="required_star">*</span>
            </label>
            <input
              id="add_product_product_name"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                document.querySelector(
                  ".product_name_length_error"
                ).style.display = "none";
              }}
              placeholder="Enter Product Name"
              type="text"
            />
            <p className="product_name_length_error first_time_login_error">
              Product name character length must be between 6 to 50
            </p>
            <label
              className="login-field-label"
              htmlFor="ugossips_display_name"
            >
              Product Description
              <span className="required_star">*</span>
            </label>
            <textarea
              rows="2"
              id="add_product_product_desc"
              value={productDesc}
              onChange={(e) => {
                setProductDesc(e.target.value);
                document.querySelector(
                  ".product_desc_length_error"
                ).style.display = "none";
              }}
              placeholder="Enter product description"
            ></textarea>
            <p className="product_desc_length_error first_time_login_error">
              Product desc character length must be between 6 to 500
            </p>

            <div className="add_product_product_price_and_stock">
              <div className="add_product_price_wrapper">
                <label
                  className="login-field-label"
                  htmlFor="ugossips_display_name"
                >
                  Product Price
                  <span className="required_star">*</span>
                </label>
                <input
                  id="add_product_product_price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="Enter Product Price"
                  type="number"
                />
              </div>
              <div className="add_product_stock_wrapper">
                <label
                  className="login-field-label"
                  htmlFor="ugossips_display_name"
                >
                  Product Stock
                  <span className="required_star">*</span>
                </label>
                <input
                  id="add_product_product_stock"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  placeholder="Enter number of stock"
                  type="number"
                />
              </div>
            </div>
            <label
              className="login-field-label"
              htmlFor="ugossips_display_name"
            >
              Product Image (jpg, jpeg, png, gif only)
              <span className="required_star">*</span>
            </label>
            <div className="ugossips_profile_pic_box">
              <input
                id="add_product_product_image"
                filename={file}
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                name="productProfilePic"
              />
            </div>
          </div>
          <div className="add_product_footer">
            {" "}
            <div className="create_space_modal_footer_divider"></div>
            <div className="add_product_footer_buttons">
              <Button
                className="create_space_modal_btn add_product_modal_btn"
                onClick={() => {
                  uploadProfilePic();
                }}
                type="submit"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AllProducts;
