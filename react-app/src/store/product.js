// Constants
const SET_ALL_PRODUCTS = "products/SET_ALL_PRODUCTS";
const SET_PRODUCT = "products/SET_PRODUCT";
const ADD_PRODUCT = "products/ADD_PRODUCT";
const UPDATE_PRODUCT = "products/UPDATE_PRODUCT";
const REMOVE_PRODUCT = "products/REMOVE_PRODUCT";

// Action Creators
const setProducts = (products) => ({
  type: SET_ALL_PRODUCTS,
  products,
});

const setProduct = (product) => ({
  type: SET_PRODUCT,
  product,
});

const addProduct = (product) => ({
  type: ADD_PRODUCT,
  product,
});

const updateProductAction = (product) => ({
  type: UPDATE_PRODUCT,
  product,
});

const removeProduct = (productId) => ({
  type: REMOVE_PRODUCT,
  productId,
});

// Thunks
export const fetchAllProducts = () => async (dispatch) => {
  const response = await fetch("/api/products");
  if (response.ok) {
    const products = await response.json();
    dispatch(setProducts(products));
  }
};

export const fetchProductById = (productId) => async (dispatch) => {
  const response = await fetch(`/api/products/${productId}`);
  if (response.ok) {
    const product = await response.json();
    dispatch(setProduct(product));
  }
};

export const createProductThunk = (productData) => async (dispatch) => {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create the product.");
  }
//   if (!response.ok) {
//     throw new Error("Failed to create the product.");
//   }

    const product = await response.json();
    console.log("This is post from thunkCreate", product)
    dispatch(addProduct(product));

};

export const updateProductThunk = (productId, productData) => async (dispatch) => {
  const response = await fetch(`/api/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update the product.");
  }

    const updatedProduct = await response.json();
    dispatch(updateProductAction(updatedProduct));

};

export const deleteProductByIdThunk = (productId) => async (dispatch) => {
  const response = await fetch(`/api/products/${productId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete the product.");
  }

    dispatch(removeProduct(productId));

};

// Reducer
const initialState = {
  allProducts: {},
  singleProduct: {},
};

export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_PRODUCTS:
      const allProducts = {};
      action.products.forEach((product) => {
        allProducts[product.id] = product;
      });
      return { ...state, allProducts };
    case SET_PRODUCT:
      return { ...state, singleProduct: { [action.product.id]: action.product } };
    case ADD_PRODUCT:
      return { ...state, allProducts: { ...state.allProducts, [action.product.id]: action.product } };
    case UPDATE_PRODUCT:
      return { ...state, allProducts: { ...state.allProducts, [action.product.id]: action.product } };
    case REMOVE_PRODUCT:
      const newState = { ...state.allProducts };
      delete newState[action.productId];
      return { ...state, allProducts: newState };
    default:
      return state;
  }
}