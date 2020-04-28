//on load action 

import {LOADER_STATUS} from './actionType';

export const loaderStatus = (data) => dispatch => {
    dispatch({
        type: LOADER_STATUS,
        payload: data,
    })
}