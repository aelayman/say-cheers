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

export function createCheers(receiver, history) { // how am I passing up the sender info?
    return function thunk(dispatch) {
        return axios.post('/api/cheersRequests', receiver)
            .then(res => res.data)
            .then(newRequest => {
                const action = setReceiver(receiver);
                dispatch(action);
                history.push('/');
            })
            .catch(error => console.log(error));
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
