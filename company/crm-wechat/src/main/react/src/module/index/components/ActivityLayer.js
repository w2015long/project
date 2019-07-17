import React from 'react';
import PropTypes from 'prop-types';
import "../style/ActivityLayer.css";
import layer540x510 from '../../../media/images/layer540x510.png';
import {Link} from "react-router-dom";
/**
 * 活动页
 */
const ActivityLayer = ({closeActivityLayer=()=>{}}) => {
    return (

        <div className="activity-layer layer-box">
            <div className="mask"></div>
            <div className="cont">
                <Link to={'/activity/newMemberExclusive'}  onClick={()=>{closeActivityLayer()}}><img src={layer540x510}/></Link>
                <a className="close-btn" onClick={()=>{closeActivityLayer()}}></a>
            </div>
        </div>

    );
};
ActivityLayer.propTypes = {
    closeActivityLayer:PropTypes.func.isRequired
};

export default ActivityLayer