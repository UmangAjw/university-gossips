import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { Modal } from "react-responsive-modal";
import { useSelector } from "react-redux";
import { selectUser, logout } from "../features/userSlice";
import CloseIcon from "@material-ui/icons/Close";
import "./css/AllProducts.css";
import slugify from "react-slugify";
import axios from "axios";
import AllProductsItems from "./AllProductsItems";
import { NavLink } from "react-router-dom";

function AllProducts() {
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
  }

  useEffect(async () => {
    if (isMounted && productProfilePic !== "") {
      await handleAddProduct();
    }
  }, [productProfilePic]);

  const handleAddProduct = async () => {
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
        productName: productName,
        productPrice: productPrice,
        productDesc: productDesc,
        productStock: productStock,
        productProfilePic: productProfilePic,
      };

      await axios
        .post("/api/products", body, config)
        .then((res) => {
          console.log("Product added successfully");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="allproducts">
      <div className="allproduct_all_items">
        {Object.values(productDatas).map((productData, i) => (
          <NavLink
            className={"allproduct_all_items_link"}
            to={"/product/" + productData.slug}
            target="_top"
            key={i}
          >
            <AllProductsItems
              productProfilePic={productData.productProfilePic}
              productName={productData.productName}
              productPrice={productData.productPrice}
              key={i}
            />
          </NavLink>
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
          <div className="add_product_modal_fields">
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter Product Name"
              type="text"
            />
            <input
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Enter Product Price"
              type="number"
            />
            <textarea
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              placeholder="Enter product description"
            ></textarea>
            <input
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
              placeholder="Enter number of stock"
              type="number"
            />
            <input
              filename={file}
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              name="productProfilePic"
              id="Profile"
            />
          </div>
          <button
            onClick={() => {
              uploadProfilePic();
            }}
            type="submit"
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default AllProducts;
