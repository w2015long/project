import React, {Component} from "react";
import PropTypes from "prop-types";
import "../style/swiper.min.css";
import Img from "./Img";

/**
 * 商品详情 图片展示组件
 * 用法：
 *  images: 必需，此参数为一个数组
 *
 * 实例：
 *  <Swiper images={imageArray} />
 */
class Swiper extends Component {

    componentDidMount() {
        new window.Swiper('.product-tab', {
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swiper
            pagination: '.swiper-pagination',
            paginationType: 'fraction',
            spaceBetween: 30
        });
    }

    render() {
        const images = this.props.images||[];
        const videoSource = this.props.videoSource;
        const videoFileId = this.props.videoFileId;
        const videoFileImg = this.props.videoFileImg;
        const videoCode = this.props.videoCode;
        return (
            <div className="swiper-container product-tab">
            <div className="swiper-wrapper">
            {videoSource === 'INSTATION' && videoFileId &&
            <div className="swiper-slide">
            <video className="video" src={videoFileId}
        style={{"marginTop": "1.8rem", "height": "6rem", "width": "9rem"}}
        controlsList="nodownload" muted controls poster={videoFileImg}/>
        </div>
    }
        {videoSource === 'OUTSIDE' && videoCode &&
        <div className="swiper-slide" dangerouslySetInnerHTML={{__html: videoCode}}>
        </div>
        }
        {images.map((image, index) => {
            return (<div className="swiper-slide" key={index}>
                <a><Img src={image} alt="商品图片"/></a>
                </div>
        )
        })}
        {images.length <=0 &&
        <div className="swiper-slide" >
            <a><Img src="" alt="商品图片"/></a>
            </div>
        }
    </div>
        <div className="swiper-pagination"/>
            {/*<div className="blocking"/>*/}
            </div>
    )
    }
}


Swiper.propTypes = {
    images: PropTypes.array.isRequired,
    videoSource: PropTypes.string,
    videoFileId: PropTypes.string,
    videoFileImg: PropTypes.string,
    videoCode: PropTypes.string,
};

export default Swiper