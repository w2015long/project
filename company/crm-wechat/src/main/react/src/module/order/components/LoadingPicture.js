/**
 * 加载图片
 */
import React from 'react';
import PropTypes from 'prop-types';
import shouchang2 from "../../../media/images/shouchang2.png";
import shouchang from "../../../media/images/shouchang.png";
const LoadingPicture = ({grade}) =>{
    return(
        <div className={'comment-details'}>
            <img src={grade>=1?shouchang2:shouchang} alt=""/>
            <img src={grade>=2?shouchang2:shouchang} alt=""/>
            <img src={grade>=3?shouchang2:shouchang} alt=""/>
            <img src={grade>=4?shouchang2:shouchang} alt=""/>
            <img src={grade>=5?shouchang2:shouchang} alt=""/>
        </div>
    );
};

LoadingPicture.propTypes = {
    grade:PropTypes.number
};

export default LoadingPicture;




