// 引入react组件
import React, {Component} from "react";
import PropTypes from 'prop-types';
import "../style/AddressSelect.css";
import JsBarcode from 'jsbarcode';

/*参考网址  https://gitee.com/hjm100/codes/q6hjp8zm9rwfnl7cv1od344#JsBarcode.html  */
class BarCode extends Component {

    state = {
        codeWidth: 2,                /*较细处条形码的宽度*/
        codeHeight: 100,             /*条形码的宽度，无高度直接设置项，由位数决定*//*也可以通过CSS去调整*/
        codeDisplayValue :  false,   /*是否在条形码下方显示文字*/
        codeLineColor : '#000',      /*条形码颜色*/
    };


    //初始化条形码  在第一次渲染后调用
    componentDidMount(){
       let barcode = document.getElementById('barcode');
       let str = this.props.codeNumber;
       let options = {
               width: this.props.codeWidth ? this.props.codeWidth : this.state.codeWidth,
               height:this.props.codeHeight ? this.props.codeHeight : this.state.codeHeight,
               format: "CODE128",
               displayValue:this.props.codeDisplayValue ? this.props.codeDisplayValue :  this.state.codeDisplayValue,//是否在条形码下方显示文字
           fontSize: 24,
               lineColor:this.props.codeLineColor ?this.props.codeLineColor : this.state.codeLineColor//条形码颜色
           };
       JsBarcode(barcode, str, options); //原生
   }

    // 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
    componentWillReceiveProps() {
        let barcode = document.getElementById('barcode');
        let str = this.props.codeNumber;
        let options = {
            width: this.props.codeWidth ? this.props.codeWidth : this.state.codeWidth,
            height: this.props.codeHeight ? this.props.codeHeight : this.state.codeHeight,
            format: "CODE128",
            displayValue: this.props.codeDisplayValue ? this.props.codeDisplayValue : this.state.codeDisplayValue,//是否在条形码下方显示文字
            fontSize: 24,
            lineColor: this.props.codeLineColor ? this.props.codeLineColor : this.state.codeLineColor//条形码颜色
        };
        JsBarcode(barcode, str, options); //原生
    }

    render() {
        return (
            <div className="barcodeBox">
                <img className="barcodeImg" id="barcode"/>
            </div>
        )
    }
}

/*定义条形码组件属性类型*/
BarCode.propTypes = {
    /*条形码号码*/
    codeNumber: PropTypes.number,

    /*较细处条形码的宽度*/
    codeWidth: PropTypes.number,

    /*条形码的宽度，无高度直接设置项，由位数决定*/
    /*也可以通过CSS去调整*/
    codeHeight: PropTypes.number,

    /*是否在条形码下方显示文字*/
    codeDisplayValue :  PropTypes.bool,

    /*条形码颜色*/
    codeLineColor : PropTypes.string,

};

export default BarCode