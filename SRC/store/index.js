import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import CartReducer from '../reducers/cartReducer';
import LoaderReducer from '../reducers/loaderReducer';
import SignInReducer from '../reducers/authentication/signInReducer';
import SignUpReducer from '../reducers/authentication/signUpReducer';

const AppReducers = combineReducers({
    CartReducer,
    LoaderReducer,
    SignInReducer,
    SignUpReducer
});

const logger = createLogger({});
const rootReducer = (state, action) => {
    return AppReducers(state, action);
}

let store = createStore(rootReducer, compose(applyMiddleware(thunk, logger)));
export default store;
