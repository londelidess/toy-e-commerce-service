// constants
const SET_FAVORITES = "favorites/SET_FAVORITES";
const SET_IS_FAVORITE = "favorites/SET_IS_FAVORITE";
const ADD_FAVORITE = "favorites/ADD_FAVORITE";
const REMOVE_FAVORITE = "favorites/REMOVE_FAVORITE";

// action creators
const setFavorites = (favorites) => ({
	type: SET_FAVORITES,
	payload: favorites,
});

const setIsFavorite = (productId, isFavorite) => ({
    type: SET_IS_FAVORITE,
    payload: { productId, isFavorite },
});

const addFavorite = (favorite) => ({
	type: ADD_FAVORITE,
	payload: favorite,
});

const removeFavorite = (productId) => ({
	type: REMOVE_FAVORITE,
	payload: productId,
});


// thunks
export const fetchFavorites = () => async (dispatch) => {
    try {
      const response = await fetch("/api/favorites/my-favorites", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }
      const favorites = await response.json();
	  // console.log(favorites)
      dispatch(setFavorites(favorites));
    } catch (error) {
      console.error(error);
    }
  };

  export const checkIsFavorite = (productId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/favorites/is-favorite/${productId}`);
        if (!response.ok) {
            throw new Error("Failed to check if product is a favorite");
        }
        const data = await response.json();
        dispatch(setIsFavorite(productId, data.is_favorite));
        return data.is_favorite;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const addProductToFavorites = (productId) => async (dispatch) => {
	const response = await fetch(`/api/favorites/${productId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		dispatch(addFavorite(data));
	} else {
		const data = await response.json();
		console.error("Error adding to favorites:", data.message);
	}
};

export const removeProductFromFavorites = (productId) => async (dispatch) => {
	const response = await fetch(`/api/favorites/${productId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		dispatch(removeFavorite(productId));
	} else {
		const data = await response.json();
		console.error("Error removing from favorites:", data.message);
	}
};

const initialState = [];

// reducer
export default function favoriteReducer(state = initialState, action) {
  switch (action.type) {
	case SET_IS_FAVORITE:
    const updatedState = [];
    for (let product of state) {
        if (product.id === action.payload.productId) {
            updatedState.push({ ...product, isFavorite: action.payload.isFavorite });
        } else {
            updatedState.push(product);
        }
    }
    return updatedState;
    case SET_FAVORITES:
      return action.payload;
    case ADD_FAVORITE:
      return [...state, action.payload];
    case REMOVE_FAVORITE:
      return state.filter(favorite => favorite.id !== action.payload);
    default:
      return state;
  }
}
