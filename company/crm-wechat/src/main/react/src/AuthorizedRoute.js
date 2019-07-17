/**
 * @author chencheng
 * @date 2018/4/9
 * 为路由提供登录过滤，访问某些页面时，如果没有登录则跳转到登录页
 */
import React from 'react'
import {Redirect, Route} from 'react-router-dom'


class AuthorizedRoute extends React.Component {

    state = {
        pending: true,//请求回来前保持挂起状态
        logged: false//是否已经登录
    };

    componentWillMount() {
        const self = this;
        const url = "/wap/member/getCurrentMember";
        window.jsonFetch(
            url,
            {},
            json => {
                if (json && json.memberId) {
                    self.setState({
                        pending: false,
                        logged: true
                    });
                } else {
                    self.setState({
                        pending: false,
                        logged: false
                    });
                }
            },
            err => {
                self.setState({
                    pending: false,
                    logged: false
                });
                return false
            }
        )
    }

    render() {
        const {pending, logged} = this.state;
        const {component: Component, ...rest} = this.props;
        const url = this.props.computedMatch.url;

        return (
            <Route {...rest} render={
                props => {
                    if (pending) {
                        return null;
                    } else {
                        return logged
                            ? <Component {...props} />
                            : <Redirect to={{pathname: '/member/memberLoginIn',
                                search: '?redirect='+url,}}  />
                    }
                }}
            />
        )
    }
}

export default AuthorizedRoute
