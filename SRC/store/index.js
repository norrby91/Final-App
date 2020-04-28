//REDUX STORE 
//APPLY REDUX PACKAGES TO SET UP STORE
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
//IMPPRT REDUCERS
import CartReducer from '../reducers/cartReducer';
import LoaderReducer from '../reducers/loaderReducer';
import SignInReducer from '../reducers/authentication/signInReducer';
import SignUpReducer from '../reducers/authentication/signUpReducer';
//CREATE CONST OF REDUCERS
const AppReducers = combineReducers({
    CartReducer,
    LoaderReducer,
    SignInReducer,
    SignUpReducer
});
//CREATE LOGGER FOR REDUCER TO SET STATE AND ACTION
const logger = createLogger({});
const rootReducer = (state, action) => {
    return AppReducers(state, action);
}
//CREATE STORE AND APPLY REDUX PACKAGES
let store = createStore(rootReducer, compose(applyMiddleware(thunk, logger)));
//EXPORT STORE 
export default store;
