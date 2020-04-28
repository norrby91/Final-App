// cart actions 

import { ADD_TO_CART, REMOVE_FROM_CART, EMPTY_CART, CHANGE_PRODUCT_QUANTITY } from './actionType';

export const addToCart = (item) => dispatch => {
	dispatch({
		type: ADD_TO_CART,
		payload: item
	})
}

export const removeItem = (item) => dispatch => {
	dispatch({
		type: REMOVE_FROM_CART,
		payload: { item }
	})
}

export const emptyCart = () => dispatch => {
	dispatch({
		type: EMPTY_CART
	})
}
export const changeProductQuantity = (productId, quantity, maxquantity) => dispatch => {
	dispatch({
		type: CHANGE_PRODUCT_QUANTITY,
		payload: { productId: productId, quantity: quantity, maxquantity: maxquantity }
	})
}

