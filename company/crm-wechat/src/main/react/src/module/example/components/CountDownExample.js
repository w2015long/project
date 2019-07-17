/**
 * @author chencheng
 * @date 2018/4/02
 * 倒计时示例
 */

import React from 'react';
import CountDown from '../../common/components/CountDown';


const CountDownExample = () =>{

    const callback=()=>{
        console.log('倒计时结束')
    };

    const rendering1 = (
        <div>
            活动剩余：<span>@day@</span>天<span>@hour@</span>小时<span>@minute@</span>分<span>@second@</span>秒
        </div>
    );

    const rendering2 = (
        <div>
            活动剩余：<span>@day1@|@day2@</span>天<span>@hour1@|@hour2@</span>小时<span>@minute1@|@minute2@</span>分<span>@second1@|@second2@</span>秒
        </div>
    );

    const rendered = (
        <div>
            已结束
        </div>
    );

    const endDateStr = '2222/4/12 13:15:00';

    return(
        <div>
            <CountDown endDateStr={endDateStr} callBackFunc={callback} rendering={rendering1} rendered={rendered} />
            <br/>
            <CountDown endDateStr={'2018/4/8 10:30:00'} callBackFunc={callback} rendering={rendering2} rendered={rendered} />
        </div>
    );
};

export default CountDownExample



