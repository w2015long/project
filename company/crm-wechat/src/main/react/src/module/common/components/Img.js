/**
 * olx: 扩展多规格，多模块默认图片
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DefaultProductPic from "../../../media/images/default-product-pic.jpg";
import "../style/Img.css"

class Img extends PureComponent {

    showDefaultPic(e){
        e.target.onerror=null;
        e.target.src = DefaultProductPic;
    }

    render(){
        return(
            <div className={"commonImg"}>
                <img src={this.props.src ? this.props.src : DefaultProductPic} onError={(e) => this.showDefaultPic(e)} onClick={this.props.onClick ? () => this.props.onClick() : () => {}} alt={this.props.alt?this.props.alt:"图片"}/>
                {this.props.platformType &&
                <span  style={{ color:" #fff",fontSize: "11px;"}} className={this.props.platformType === 'O2O' ? "arrive bg-green" : "arrive bg-blue"}>
                    {this.props.platformType === 'O2O' ? '当天达' : '3-5天达'}
                    </span>
                }
            </div>

        );
    }
}

Img.propTypes = {
    platformType: PropTypes.string,
    src: PropTypes.string,
    alt: PropTypes.string,
    onClick: PropTypes.func
};

export default Img;