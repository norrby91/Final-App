// sign in redux reducer

import * as Actions from '../../actions/authentication/actionTypes';

const initialState = {
    logindetails: {},
    status: null,
    error: false,
    errormessage: "",
}

const SignInReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.LOGIN_SERVICE_SUCCESS:
            return {
                ...state,
                logindetails: action.payload,
                error: false,
                errormessage: "",
                status: "success"
            }
        case Actions.LOGIN_SERVICE_PENDING:
            return {
                ...state,
                status: "pending",
                error: false,
                errormessage: "",
            }
        case Actions.LOGIN_SERVICE_ERROR:
            return {
                ...state,
                status: "error",
                error: true,
                errormessage: action.payload,
            }
        default:
            return state;
    }
}

export default SignInReducer;
