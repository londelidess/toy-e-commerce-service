import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProductThunk, fetchProductById } from "../../store/product";
import {
  thunkAddMediaToProduct,
  thunkDeleteMedia,
  thunkGetAllMediaByProductId,
} from "../../store/media";
import { useHistory, useParams, Redirect } from "react-router-dom";
import "./productform.css";

const UpdateProductForm = () => {
  const { productId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  // console.log("productId",productId)
  const dispatch = useDispatch();
  const history = useHistory();
  const [product, setProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const ALLOWED_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "mp4"]);
  const [touched, setTouched] = useState({
    name: true,
    description: true,
    price: true,
    categoryId: true,
  });
  const [previewURL1, setPreviewURL1] = useState(null);
  const [previewURL2, setPreviewURL2] = useState(null);
  const [previewURL3, setPreviewURL3] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/products/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories.");
        }
        const data = await response.json();
        console.log("fetch categories", data);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const validate = (fieldName) => {
    const validationErrors = {};

    if (
      touched.name &&
      (!name.trim() || name.trim().length < 3 || name.trim().length > 400)
    ) {
      validationErrors.name = "Name must be between 3 and 400 characters.";
    }

    if (
      touched.description &&
      (!description.trim() ||
        description.trim().length < 5 ||
        description.trim().length > 400)
    ) {
      validationErrors.description =
        "Description must be between 5 and 400 characters.";
    }

    if (touched.price && (!price || price <= 0)) {
      validationErrors.price = "Price must be a positive value.";
    }

    if (touched.categoryId && !categoryId) {
      validationErrors.categoryId = "Category ID is required.";
    }
    return validationErrors;
  };

  useEffect(() => {
    setErrors(validate());
  }, [name, description, price, categoryId, touched]);

  const isAllowedExtension = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    return ALLOWED_EXTENSIONS.has(ext);
  };

  const handleImageChange = (setImageFunction, setPreviewFunction, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!isAllowedExtension(file.name)) {
      alert("Invalid file type. Please upload a valid media file.");
      return;
    }

    if (file.size > maxSize) {
      alert("File is too large. Please upload a file smaller than 5MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewFunction(url);
    setImageFunction(file);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await dispatch(fetchProductById(productId));
        setProduct(fetchedProduct);
        setName(fetchedProduct.name);
        setDescription(fetchedProduct.description);
        setPrice(fetchedProduct.price);
        setCategoryId(fetchedProduct.category_id);
        if (fetchedProduct.images && fetchedProduct?.images.length > 0) {
          setImage(fetchedProduct.images[0] || null);
          setImage2(fetchedProduct.images[1] || null);
          setImage3(fetchedProduct.images[2] || null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
}, [dispatch, productId]);

  if (!sessionUser) {
    return <Redirect to="/" />;
  }

  const renderMedia = (media, previewURL, setImageFunction, mediaId) => {
    if (media && typeof media.media_url === "string") {
      return (
        <>
          {media?.media_url.endsWith(".mp4") ? (
            <video width="100" controls>
              <source src={media?.media_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={media?.media_url} alt="Media" width="100" />
          )}
          <button
          className="form-delete-media-btn"
          onClick={() => handleDeleteMedia(setImageFunction, mediaId)}
          >
            Delete
          </button>
        </>
      );
    } else if (previewURL) {
      return previewURL.endsWith(".mp4") ? (
        <video width="100" controls>
          <source src={previewURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={previewURL}
          alt="Preview"
          width="100"
          className="form-preview-image"
        />
      );
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const productData = {
      name,
      description,
      price,
      category_id: categoryId,
    };

    try {
      await dispatch(updateProductThunk(productId, productData));

      const images = [image, image2, image3];

      for (let img of images) {
        if (img && productId) {
          await dispatch(thunkAddMediaToProduct(productId, img));
        }
      }
      await dispatch(thunkGetAllMediaByProductId(productId));
      history.push("/products/manage");
    } catch (err) {
      setErrors({
        ...validationErrors,
        general: err.message.split("\n"),
      });
    }
  };

  const handleDeleteMedia = (setImageFunction, mediaId) => {
    dispatch(thunkDeleteMedia(mediaId));
    setImageFunction(null);
  };

  if (loading)  return <div className="centered">Loading...</div>;

  console.log(Object.keys(errors).length)
  return (
    <div className="product-form">
      <form onSubmit={handleSubmit}>
        {touched.name && errors.name && (
          <div className="error">{errors.name}</div>
        )}
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setTouched((prev) => ({ ...prev, name: true }));
            }}
            required
          />
        </label>
        {touched.description && errors.description && (
          <div className="error">{errors.description}</div>
        )}
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setTouched((prev) => ({ ...prev, description: true }));
            }}
            rows="10"
            cols="82"
            required
          ></textarea>
        </label>
        {touched.price && errors.price && (
          <div className="error">{errors.price}</div>
        )}
        <label>
          Price:$
          <input
            type="number"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setTouched((prev) => ({ ...prev, price: true }));
            }}
            required
          />
        </label>
        {touched.categoryId && errors.categoryId && (
          <div className="error">{errors.categoryId}</div>
        )}
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setTouched((prev) => ({ ...prev, categoryId: true }));
          }}
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="file-input-note">
          Upload images in PNG, JPG, JPEG, or GIF format. Videos should be in
          MP4 format. Each file should be less than 5MB.
        </div>

        <div className="form-preview-container">
          <label htmlFor="fileInput1">Media1:</label>
          <input
            id="fileInput1"
            type="file"
            accept=".png, .jpg, .jpeg, .gif, .mp4"
            onChange={(e) => handleImageChange(setImage, setPreviewURL1, e)}
            style={{ display: "none" }}
          />
          {renderMedia(image, previewURL1, setImage, image?.id)}
        </div>

        <div className="form-preview-container">
          <label htmlFor="fileInput2">Media2:</label>
          <input
            id="fileInput2"
            type="file"
            accept=".png, .jpg, .jpeg, .gif, .mp4"
            onChange={(e) => handleImageChange(setImage2, setPreviewURL2, e)}
            style={{ display: "none" }}
          />
          {renderMedia(image2, previewURL2, setImage2, image2?.id)}
        </div>

        <div className="form-preview-container">
          <label htmlFor="fileInput3">Media3:</label>
          <input
            id="fileInput3"
            type="file"
            accept=".png, .jpg, .jpeg, .gif, .mp4"
            onChange={(e) => handleImageChange(setImage3, setPreviewURL3, e)}
            style={{ display: "none" }}
          />
          {renderMedia(image3, previewURL3, setImage3, image3?.id)}
        </div>

        <button
          type="submit"
          disabled={
            !touched.name ||
            !touched.description ||
            !touched.price ||
            !touched.categoryId ||
            Object.keys(errors).length > 0
          }
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProductForm;
