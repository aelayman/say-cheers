import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createCheers } from '../store/cheers';

/**
 * COMPONENT
 */
export const UserHome = (props) => {
  const { email } = props

  return (
    <div>
      <h3>Welcome, {email}</h3>
      <form className="review-form" onSubmit={props.handleSubmit}>
        <div className="form-group" id="contact-form">
          <label htmlFor="name">Email of Recipient</label>
          <input
            className="form-control"
            type="text"
            name="friendEmail"
            placeholder="Enter Email Here"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Say Cheers!</button>
        </div>
      </form>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email
  }
}

const mapDispatch = (dispatch, ownProps) => {
  return {
    handleSubmit(event) {
      event.preventDefault();
      const cheersData = {
        receiver: event.target.friendEmail.value
      }
      const history = ownProps.history;
      dispatch(createCheers(cheersData, history));
    }
  }
}

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
