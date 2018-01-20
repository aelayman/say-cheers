import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createCheers, setPendingCheers, removePendingCheers, fetchCheersRequest } from '../store/cheers';

/**
 * COMPONENT
 */
class UserHome extends Component {

  componentDidMount() {
    this.props.loadInitialData()

  }

  render() {
    const { email, hasPendingCheers, timeRemaining } = this.props
    let formStyle;
    if (hasPendingCheers) {
      formStyle = "cheers-faded-form";
    } else {
      formStyle = "cheers-form";
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
            You must wait {timeRemaining} seconds before your next request
          </div>
        }
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
    timeRemaining: state.cheers.timeRemaining
  }
}

const mapDispatch = (dispatch, ownProps) => {
  return {
    loadInitialData() {
      dispatch(fetchCheersRequest());
      setInterval(() => {
        dispatch(fetchCheersRequest()); // fetchingCheersRequest to see if existing cheers exist every 5 seconds
    }, 5000)
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

// document.getElementById('timer').innerHTML =
//   '30' + ":" + '00';
// startTimer();

// function startTimer() {
//   var presentTime = document.getElementById('timer').innerHTML;
//   var timeArray = presentTime.split(/[:]+/);
//   var m = timeArray[0];
//   var s = checkSecond((timeArray[1] - 1));
//   if(s==59){m=m-1}
//   //if(m<0){alert('timer completed')}

//   document.getElementById('timer').innerHTML =
//     m + ":" + s;
//   setTimeout(startTimer, 1000);
// }

// function checkSecond(sec) {
//   if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
//   if (sec < 0) {sec = "59"};
//   return sec;
// }