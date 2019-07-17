/**
 * @author lcl
 * @date 2019/05/29
 * 页面加载进度条
 */

import React, {PureComponent} from 'react';
import {} from "../style/ProgressBar.css"



class ProgressBar extends PureComponent {

    state = {
        progress : 0 //进度值
    };

    componentDidMount() {
        const self= this;
        this.state.timer=setInterval(()=>{
            if(self.state.progress<100){
                self.setState({
                    progress:self.state.progress+5
                })
            }else {
                clearInterval(this.state.timer);
            }
        }, 200)
    }

    render() {
        let width = this.state.progress + "%";
        return (
            <div className="loading-main">
                <h5>页面加载中…{this.state.progress}% </h5>
                <p>
                    <span style={{width :width }}/>
                </p>
            </div>
        )
    }
}


export default ProgressBar;




