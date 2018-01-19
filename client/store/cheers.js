import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const SET_RECEIVER = 'SET_RECEIVER'


/**
 * INITIAL STATE
 */
const initialReceiverState = {
    receiver: {}
}

/**
 * ACTION CREATORS
 */
const setReceiver = receiver => ({type: SET_RECEIVER, receiver})

/**
 * THUNK CREATORS
 */

export function createCheers(receiverEmail, history) {
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

    default:
      return state
  }
}
