//loading application redux reducer

import {
    LOADER_STATUS
} from '../actions/actionType';

const initialState = {
   loading: false,
   message: "FETCHING DETAILS"
}

const LoaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADER_STATUS:
            return {
                ...state,
                loading: action.payload.status,
                message: action.payload.message,
            }
        default:
            return state;
    }
}

export default LoaderReducer;