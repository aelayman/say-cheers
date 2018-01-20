import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../store'

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
const Main = (props) => {
  const { children, handleClick, isLoggedIn, email, userName } = props

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
              <h1 id="user-name">{userName}</h1>
              <h3 id="num-cheers">Number of Cheers:</h3>
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
      <hr />
      {children}
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
    email: state.user.email,
    userName: state.user.name
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout())
    }
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
