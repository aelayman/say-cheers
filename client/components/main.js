import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../store'
import { clearRequestInterval, fetchCheersRequest, fetchAllCheers, setRequestIntervalId, setCheersIntervalId } from '../store/cheers';

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
class Main extends Component {

  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {

    const { children, handleClick, isLoggedIn, numCheers, userName } = this.props

    return (
      <div>
        <nav>
          {
            isLoggedIn
              ? <div>
                {/* The navbar will show these links after you log in */}
                <div className="nav-control">
                  <a href="#" id="logout" onClick={handleClick}>Logout</a>
                  <Link to="/" id="edit-profile">Edit Profile</Link>
                </div>
                <h1>
                  <Link to="/" id="username">{userName}</Link>
                </h1>
                <h3 id="num-cheers">
                  <div>
                    <Link id="number-cheers" to={`/cheers`}>{numCheers} Cheers</Link>
                  </div>
                </h3>
              </div>

              : <div>
                {/* The navbar will show these links before you log in */}
                <div className="nav-control">
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Sign Up</Link>
                </div>

              </div>
          }
        </nav>
        {children}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
    email: state.user.email,
    userName: state.user.name,
    numCheers: state.cheers.allCheers.length,

  }
}

const mapDispatch = (dispatch, ownProps) => {
  return {
    handleClick() {
      dispatch(logout())
      dispatch(clearRequestInterval());
    },
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
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Main))

/**
 * PROP TYPES
 */
// Main.propTypes = {
//   children: PropTypes.object,
//   handleClick: PropTypes.func.isRequired,
//   isLoggedIn: PropTypes.bool.isRequired
// }
