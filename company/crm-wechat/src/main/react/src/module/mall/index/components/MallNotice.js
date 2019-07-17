import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
// 引入方法
import {getInfo,} from "../actions/mallIndexActions";

import {Link} from "react-router-dom";

/**
 * 微商城首页 频道页（商城公告）
 */
class MallNotice extends Component{
//在组件首次渲染之前调用，这时候DOM还没有，而且整个生命周期中只会被执行一次，在这里面setState是无效的
    componentWillMount(){
    }
    //在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentDidMount() {
        //加载 公告
        this.props.actions.getInfo("000001",()=>MallNotice.init());
    }
  static  init(){
      new window.Swiper('.swiper-container2', {
          direction: 'vertical',
          pagination: {
              el: '.swiper-pagination',
              clickable: true,
          },
          autoplay: 1000,//可选选项，自动滑动
      });
    }

    render(){
        let {infoS} = this.props.mallIndexState;
        let infoList =  infoS || [];
        return (
            <div>
                <div className="notice">
                    <div className="cont">
                        <span className="color-blue">商城</span>
                        <span className="color-gray">公告</span>



                        <div className="swiper-container2" style={{height: "1rem"}} >
                            <div className="swiper-wrapper">
                                {
                                    infoList.map((info,index) => {
                                        return(
                                         <div className="swiper-slide swiper-slide-notice" style={{height:"10px"}} key={index}>
                                            <em className="emcls">{info.createTimeStr}</em>

                                                 <p className="elli"><Link to={"/msg/info/detail/"+info.infoId} >{info.title}</Link></p>

                                        </div>
                                        )
                                    })
                                }

                            </div>
                            <div className="swiper-pagination"/>
                        </div>



                    </div>
                </div>
               {/* <div className="service">
                    <div className="item">100%正品</div>
                    <div className="item">药监认证</div>
                    <div className="item">按时发货</div>
                    <div className="item">极速退款</div>
                </div>*/}
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        mallIndexState: store.mallIndexState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getInfo}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MallNotice);
