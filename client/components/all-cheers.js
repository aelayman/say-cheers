import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchAllCheers } from '../store/cheers';
import dateFormat from 'dateformat';
import { withRouter } from 'react-router-dom'


/**
 * COMPONENT
 */
const AllCheers = (props) => {

    return (
        <div>
            {
                props.allCheers.map(cheersInstance => {

                    return (
                        <div key={cheersInstance.time} className="cheers-instance">
                            <img className="cheers-image-bullet" src="https://i.imgur.com/pAxH5fc.png" />
                            <div className="cheers-info">
                                <div className="cheers-buddy">{cheersInstance.buddy.name}</div>
                                <div className="cheers-time">{dateFormat(cheersInstance.time, "h:MM TT") + " " + dateFormat(cheersInstance.time, "dddd, mmmm dS")}</div>
                            </div>
                        </div>

                    )

                })
            }
        </div>
    )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
    return {
        allCheers: state.cheers.allCheers
    }
}


export default withRouter(connect(mapState)(AllCheers));
