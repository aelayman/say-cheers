import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createCheers, setPendingCheers, removePendingCheers, fetchCheersRequest, fetchAllCheers, setRequestIntervalId, setCheersIntervalId } from '../store/cheers';
import AllCheers from './all-cheers'
import dateFormat from 'dateformat';
import { Link } from 'react-router-dom';


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
    let isTextHighlighted;
    let currentTime = new Date();
    //check which party is the user whose account this is....
    if (lastCheers !== undefined) {
      if (currentTime - new Date(lastCheers.time) < 30000) {
        isTextHighlighted = "highlight"
      } else {
        isTextHighlighted = "last-cheers"
      }
      displayLastCheers = (
        <div>
          <div className={isTextHighlighted}>Your last CHEERS was with {lastCheers.buddy.name} on {dateFormat(lastCheers.time, "dddd, mmmm dS")}, at {dateFormat(lastCheers.time, "h:MM TT")}
          </div>
          <button type="button" className="btn" id="view-cheers">
            <Link to={`/cheers`}>View Cheers</Link>
          </button>
        </div>
      )
    } else {
      displayLastCheers = (<div className="last-cheers">You haven't CHEERS'd with anyone<br /> Say CHEERS to a friend above</div>)
    }

    return (
      <div>
        <form className={formStyle} onSubmit={this.props.handleSubmit}>
          <fieldset disabled={hasPendingCheers}>
            <div className="form-group" id="contact-form">
              <label htmlFor="name"></label>
              <input
                id="friend-email"
                className="form-control"
                type="text"
                name="friendEmail"
                placeholder="Enter a friend's email"
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn" id="cheers-btn">
                <div>
                  <div>
                    <img id="cheers-image" src="https://i.imgur.com/pAxH5fc.png" />
                  </div>
                  <div id="cheers-btn-text">Say Cheers!</div>
                </div>
              </button>
            </div>
          </fieldset>
        </form>
        {
          hasPendingCheers &&
          <div id="wait-message">
            You must wait {timeRemaining} minutes before your next request
          </div>
        }
        <hr />
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
