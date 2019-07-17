/**
 * 默认的空白页面
 * Created by caixuan on 2018/5/11.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import "../style/EmptyPage.css";
/**
 * 支持自定义空白提示文本，默认为 暂无内容
 */
class EmptyPage extends PureComponent {

    render(){
        const emptyTipText = this.props.emptyTipText;
        return (
            <div className="blank-page">
                <span>{emptyTipText || "暂无内容"}</span>
            </div>
        )
    }
}

EmptyPage.propTypes={
    emptyTipText:PropTypes.string
};

export default EmptyPage;
