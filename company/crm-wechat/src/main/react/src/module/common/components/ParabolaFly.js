/**
 * @author chencheng
 * @date 2018/06/04
 * 抛物线飞行，主要用于加入购物车动画
 */

import React, {PureComponent} from 'react';

class ParabolaFly extends PureComponent {
    render(){
        return (
            <img  id={'parabolaFlyItem'} style={{position:'fixed', overflow:'hidden', zIndex:'1000',xwidth:'30px', height:'30px', visibility:'hidden', opacity:'0.5', filter: 'alpha(opacity=50)'}} />
        );
    }
}

export default ParabolaFly