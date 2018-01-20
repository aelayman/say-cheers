import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const SET_RECEIVER = 'SET_RECEIVER'
const SET_PENDING_CHEERS = 'SET_PENDING_CHEERS'
const REMOVE_PENDING_CHEERS = 'REMOVE_PENDING_CHEERS'
const SET_REMAINING_TIME = 'SET_REMAINING_TIME'
const SET_LAST_CHEERS = 'SET_LAST_CHEERS'
const SET_ALL_CHEERS = 'SET_ALL_CHEERS'

/**
 * INITIAL STATE
 */
const initialReceiverState = {
    receiver: {},
    hasPendingCheers: false,
    timeRemaining: 0,
    lastCheers: {time: "", buddy: {}},
    allCheers: []
}

/**
 * ACTION CREATORS
 */
const setReceiver = receiver => ({type: SET_RECEIVER, receiver})
export const setPendingCheers = () => ({type: SET_PENDING_CHEERS}) // alert message to user to wait certain time
export const removePendingCheers = () => ({type: REMOVE_PENDING_CHEERS})
export const setRemainingTime = (time) => ({type: SET_REMAINING_TIME, time})
export const setLastCheers = (time, buddy) => ({type: SET_LAST_CHEERS, time, buddy})
export const setAllCheers = (allCheers) => ({type: SET_ALL_CHEERS, allCheers})

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
                    console.log("this is the blockchain creation response from the other server", responseData.model)
                    dispatch(setLastCheers(responseData.model.time, responseData.buddy ))
                } else {
                    console.log("request created", responseData.model)
                    dispatch(setRemainingTime(responseData.timeRemaining));
                    dispatch(setPendingCheers());
                }
                history.push('/');
            })
            .catch(error => {
                console.log(error);
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
                dispatch(setRemainingTime(response.timeRemaining))
            })
            .catch(error => console.log(error));
    };
}

export function fetchAllCheers() {
    return function thunk(dispatch) {
        return axios.get('/api/cheers')
            .then(res => res.data)
            .then(response => {
                dispatch(setAllCheers(response.cheers))
            })
            .catch(error => console.log(error))
    }
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

    case SET_REMAINING_TIME:
        return Object.assign({}, state, {timeRemaining: action.time})

    case SET_LAST_CHEERS:
        return Object.assign({}, state, {lastCheers: {time: action.time, buddy: action.buddy} })

    case SET_ALL_CHEERS:
        return Object.assign({}, state, {allCheers: action.allCheers}, {lastCheers: action.allCheers[action.allCheers.length - 1]})

    default:
      return state
  }
}
