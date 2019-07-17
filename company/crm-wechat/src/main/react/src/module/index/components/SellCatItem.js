import React from 'react';
import PropTypes from 'prop-types';


/**
 * 首页销售分类
 * @param sellCategoryId 当前销售分类Id
 * @param weChatSellCatProtocols 销售分类列表
 * @param onclickFunc   销售分类点击事件:展示该分类
 * @param isStickyCatItem   是否显示分类悬浮
 * @returns {*}
 * @constructor
 */
const SellCatItem = ({sellCategoryId, weChatSellCatProtocols,isStickyCatItem,onclickFunc}) => {
    return (

            <div className={isStickyCatItem==="Y"?"mc-lt suspension":"mc-lt"}   >
                <ul>
                    {
                        weChatSellCatProtocols.map((sellCat, index) => {
                            return (
                                <li className={sellCat.sellCategoryId === sellCategoryId||("" === sellCategoryId&&index===0) ? "cur" : ""}
                                    key={index}>
                                    <a onClick={() => onclickFunc(sellCat.sellCategoryId)}> {sellCat.title}</a>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

    );
};
SellCatItem.propTypes = {
    sellCategoryId:PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    weChatSellCatProtocols:PropTypes.array.isRequired,
    onclickFunc:PropTypes.func.isRequired
};

export default SellCatItem