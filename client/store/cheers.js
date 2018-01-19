import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const SET_RECEIVER = 'SET_RECEIVER'
const TOGGLE_PENDING_CHEERS = 'TOGGLE_PENDING_CHEERS'

/**
 * INITIAL STATE
 */
const initialReceiverState = {
    receiver: {},
    hasPendingCheers: false
}

/**
 * ACTION CREATORS
 */
const setReceiver = receiver => ({type: SET_RECEIVER, receiver})
export const togglePendingCheers = () => ({type: TOGGLE_PENDING_CHEERS})

/**
 * THUNK CREATORS
 */

export function createCheers(receiverEmail, history) {
    // TODO do not allow dispatch of an action if hasPendingCheers is true
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
                alert(error.response.data.error);
            })
    }
}

/**
 * REDUCER
 */
export default function (state = initialReceiverState, action) {
  switch (action.type) {
    case SET_RECEIVER:
      return Object.assign({}, state, { receiver: action.receiver })

    case TOGGLE_PENDING_CHEERS: {
        let pendingCheersStatus;
        if (state.hasPendingCheers) {
            pendingCheersStatus = false;
        } else {
            pendingCheersStatus = true;
        }
        return Object.assign({}, state, {hasPendingCheers: pendingCheersStatus})
    }
    default:
      return state
  }
}
