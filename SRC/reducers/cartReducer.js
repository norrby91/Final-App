//cart redux reducer

import { ADD_TO_CART, REMOVE_FROM_CART, EMPTY_CART, CHANGE_PRODUCT_QUANTITY } from '../actions/actionType';

const initialStates = {
    cart: [],
    cartTotal: 0,
}

const _calcCartTaxTotal = (cartitems) => {
    let total = 0;
    let taxtotal = 0;
    cartitems.forEach((item) => {
        total = (item.unitcost * item.quantity)
        taxtotal += (parseFloat(total) * parseFloat(item.taxrate));
    })
    return taxtotal;
}

const _calcCartTotal = (cartitems) => {
    let total = 0;
    console.log("calc total");
    console.log(cartitems);
    cartitems.forEach((item) => {
        total += (parseFloat(item.price) * parseInt(item.qty))
    })
    console.log(total);
    return total;
}

const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  };

const CartReducer = (state = initialStates, action) => {
    let tempCart;
    switch (action.type) {
        case ADD_TO_CART:
            const productExistInCart = state.cart.find(p => p.key === action.payload.key);
            if (productExistInCart) {
                productExistInCart.qty = action.payload.qty || 1;
                return {
                    cart: [...state.cart, productExistInCart],
                    ...state
                }
            } else {
                // const product = {
                //     vendorid: action.payload.vendorid,
                //     productid: action.payload.productid,
                //     unitcost: action.payload.unitcost,
                //     quantity: action.payload.quantity || 1,
                //     total: action.payload.unitcost,
                //     taxrate: action.payload.taxrate
                // };
                const product = action.payload;
                tempCart = [product, ...state.cart]
                console.log("Temp Cart")
                console.log(JSON.stringify(tempCart));

                return {
                    ...state,
                    cart: tempCart,
                    cartTotal: _calcCartTotal(tempCart),
                    // cartTaxTotal: _calcCartTaxTotal(tempCart),
                    // cartGrandTotal: _calcCartTotal(tempCart) + _calcCartTaxTotal(tempCart)
                }
            }

        case REMOVE_FROM_CART:
            tempCart = state.cart.filter((item) => item.key !== action.payload.item.key)
            return {
                ...state,
                cart: tempCart,
                cartTotal: _calcCartTotal(tempCart),
                // cartTaxTotal: _calcCartTaxTotal(tempCart),
                // cartGrandTotal: _calcCartTotal(tempCart) + _calcCartTaxTotal(tempCart)
            }
        case EMPTY_CART:
            return {
                ...state,
                cart: [],
                cartTotal: 0
            }
        case CHANGE_PRODUCT_QUANTITY:
            tempCart = [...state.cart];
            tempCart.forEach((product) => {
                console.log("dddd");
                console.log(product);
                if (product.key === action.payload.productId) {
                    console.log("hhh");
                    console.log(product);
                    product.qty = action.payload.quantity;
                    product.total = (product.qty * product.price);
                    return;
                }
            })
            return {
                ...state,
                cart: tempCart,
                cartTotal: _calcCartTotal(state.cart),
                cartTaxTotal: _calcCartTaxTotal(state.cart),
                cartGrandTotal: _calcCartTotal(state.cart) + _calcCartTaxTotal(state.cart)
            }
        default:
            return state;
    }
}

export default CartReducer;
