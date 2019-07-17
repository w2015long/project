/**
 * @author chencheng
 * @date 2018/3/19
 */
import React from 'react';
import { Link } from 'react-router-dom'

const Index = ()=>{
    return (
        <div >
            <h1>这是首页</h1>
            <Link to='/example/1'>example1</Link>
            <p/>
            <Link to='/example/2/chencheng?age=18'>example2</Link>
        </div>
    )
};

export default Index



