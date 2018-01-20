import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createCheers, setPendingCheers, removePendingCheers, fetchCheersRequest, fetchAllCheers, setRequestIntervalId, setCheersIntervalId } from '../store/cheers';

/**
 * COMPONENT
 */
class UserHome extends Component {

  componentDidMount() {
    this.props.loadInitialData()

  }

  render() {
    const { email, lastCheers, hasPendingCheers, timeRemaining, allCheers } = this.props
    let formStyle;
    if (hasPendingCheers) {
      formStyle = "cheers-faded-form";
    } else {
      formStyle = "cheers-form";
    }
    let displayLastCheers;
    //check which party is the user whose account this is....
    if (lastCheers.time.length > 0) {
      displayLastCheers = (
        <div>Your last CHEERS was at {lastCheers.time}, with {lastCheers.buddy.name}  </div>
      )
    } else {
      displayLastCheers = (<div>You have not created any CHEERS</div>)
    }


    return (
      <div>
        <form className={formStyle} onSubmit={this.props.handleSubmit}>
          <fieldset disabled={hasPendingCheers}>
            <div className="form-group" id="contact-form">
              <label htmlFor="name"></label>
              <input
                className="form-control"
                type="text"
                name="friendEmail"
                placeholder="Enter Email Here"
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary" id="cheers-btn">Say Cheers!</button>
            </div>
          </fieldset>
        </form>
        {
          hasPendingCheers &&
          <div>
            You must wait {timeRemaining} minutes before your next request
          </div>
        }
        {displayLastCheers}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email,
    hasPendingCheers: state.cheers.hasPendingCheers,
    timeRemaining: state.cheers.timeRemaining,
    lastCheers: state.cheers.lastCheers,
    allCheers: state.cheers.allCheers
  }
}

const mapDispatch = (dispatch, ownProps) => {
  return {
    loadInitialData() {
      dispatch(fetchCheersRequest());
      dispatch(fetchAllCheers());
      let cheersIntervalId = setInterval(() => {
        dispatch(fetchAllCheers());
      }, 5000)
        dispatch(setCheersIntervalId(cheersIntervalId)); // set interval returns the specific interval id which i can then pass to clear interval
      let requestIntervalId = setInterval(() => {
        dispatch(fetchCheersRequest()); // fetchingCheersRequest to see if existing cheers exist every 5 seconds
      }, 5000)
      dispatch(setRequestIntervalId(requestIntervalId))
    },
    handleSubmit(event) {
      event.preventDefault();
      const cheersData = {
        receiverEmail: event.target.friendEmail.value,
      }
      const history = ownProps.history;
      dispatch(createCheers(cheersData, history));
    }
  }
}

export default connect(mapState, mapDispatch)(UserHome)
