//sign up redux reducer 

import * as Actions from '../../actions/authentication/actionTypes';

const initialState = {
    status: null,
    errormessage: "",
}

const SignUpReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.SIGNUP_SERVICE_SUCCESS:
            return {
                ...state,
                errormessage: "",
                status: "success"
            }
        case Actions.SIGNUP_SERVICE_PENDING:
            return {
                ...state,
                status: "pending",
                errormessage: "",
            }
        case Actions.SIGNUP_SERVICE_ERROR:
            return {
                ...state,
                status: "error",
                errormessage: action.payload,
            }
        default:
            return state;
    }
}

export default SignUpReducer;
