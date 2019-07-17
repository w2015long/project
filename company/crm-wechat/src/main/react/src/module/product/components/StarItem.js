import React, {Component} from "react";
import yellowStar from '../../../media/images/shouchang2.png';
import greyStar from '../../../media/images/shouchang.png';
/**
 * 评价的星星
 */
class StarItem extends Component{

    render(){
        const comment = this.props.comment;
        const yellowStars = [];
        const greyStars = [];

        for (let i = 0; i < comment.grade; i++) {
            yellowStars.push(1);
        }
        for (let i = 0; i < 5 - comment.grade; i++) {
            greyStars.push(1);
        }
        return (
            <div className="score-box">
                <span>{comment.isAnonymity === "Y" ? "匿名" : comment.memberName}</span>
                {
                    yellowStars.map((star,index)=>{
                        return <img src={yellowStar} key={index} alt=""/>
                    })
                }
                {
                    greyStars.map((star,index)=>{
                        return <img src={greyStar}  key={index} alt=""/>
                    })
                }
            </div>
        )
    }
}

export default StarItem;