import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const SET_RECEIVER = 'SET_RECEIVER'
const SET_PENDING_CHEERS = 'SET_PENDING_CHEERS'
const REMOVE_PENDING_CHEERS = 'REMOVE_PENDING_CHEERS'

/**
 * INITIAL STATE
 */
const initialReceiverState = {
    receiver: {},
    hasPendingCheers: false,
    timeRemaining: 0
}

/**
 * ACTION CREATORS
 */
const setReceiver = receiver => ({type: SET_RECEIVER, receiver})
export const setPendingCheers = () => ({type: SET_PENDING_CHEERS}) // alert message to user to wait certain time
export const removePendingCheers = () => ({type: REMOVE_PENDING_CHEERS})

/**
 * THUNK CREATORS
 */

export function createCheers(receiverEmail, history) {
    // TODO do not allow dispatch of an action if hasPendingCheers is true SECURITY on backend
    // first check if the state.hasPendingCheers is false, then allow the axios.post
    return function thunk(dispatch) {
        return axios.post('/api/cheersRequests', receiverEmail)
            .then(res => {
                const responseData = res.data;
                if (responseData.isCheers) {
                    console.log("block created")
                } else {
                    console.log("request created", responseData.model)
                }
                history.push('/');
            })
            .catch(error => {
                console.log(error);
                dispatch(removePendingCheers());
                alert(error.response.data.error); //TODO something other than alert
            })
    }
}

export function fetchCheersRequest() {
    return function thunk(dispatch) {
        return axios.get('/api/cheersRequests')
            .then(res => res.data)
            .then(response => {
                if (response.exists) {
                    dispatch(setPendingCheers())
                } else {
                    dispatch(removePendingCheers())
                }
            })
            .catch(error => console.log(error));
    };
}

/**
 * REDUCER
 */
export default function (state = initialReceiverState, action) {
  switch (action.type) {
    case SET_RECEIVER:
      return Object.assign({}, state, { receiver: action.receiver })

    case SET_PENDING_CHEERS: {
        let pendingCheersStatus = true;
        return Object.assign({}, state, {hasPendingCheers: pendingCheersStatus})
    }

    case REMOVE_PENDING_CHEERS: {
        let pendingCheersStatus = false;
        return Object.assign({}, state, {hasPendingCheers: pendingCheersStatus})
    }
    default:
      return state
  }
}
