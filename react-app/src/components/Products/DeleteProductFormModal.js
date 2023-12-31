import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteProductByIdThunk,fetchAllProducts, fetchProductById} from "../../store/product";
import { thunkDeleteMedia } from "../../store/media";

function DeleteProductFormModal({ productId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  // const product = useSelector((state) => state.products.singleProduct);
  // console.log(product)

  const handleDelete = async () => {
    const product = await dispatch(fetchProductById(productId));
    if (product && product.images) {
        for (let image of product.images) {
            await dispatch(thunkDeleteMedia(image.id));
        }
    }
    await dispatch(deleteProductByIdThunk(productId));
    await dispatch(fetchAllProducts())
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className="delete-product-confirmation-container">
    <h1 className="delete-product-confirmation-title">Confirm Delete</h1>
    <h2 className="delete-product-confirmation-text">Are you sure you want to remove this product from the listings?</h2>
    {sessionUser && (
        <div className="delete-product-confirmation-button-container">
            <button onClick={handleDelete} className="delete-button">
                Yes (Delete Product)
            </button>
            <button onClick={handleCancel} className="cancel-button">
                No (Keep Product)
            </button>
        </div>
    )}
</div>
);
}

export default DeleteProductFormModal;
