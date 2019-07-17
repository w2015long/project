package com.imall.crm.commons.web;

import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 上下文接口
 * Created by frt on 2018/3/19.
 */
public interface IWebContext {
    HttpServletRequest getRequest();

    void setRequest(HttpServletRequest request);

    HttpServletResponse getResponse();

    void setResponse(HttpServletResponse response);

    HttpSession getSession();

    void setSession(HttpSession session);

    void setSessionAttr(String key, Object value, Long chainId);

    Object getSessionAttr(String key, Long chainId);

    void removeSessionAttr(String key, Long chainId);

    void setRequestAttr(String key, Object value, Long chainId);

    Object getRequestAttr(String key, Long chainId);

    void removeRequestAttr(String key, Long chainId);

    Cookie getCookie(String cookieName);

    String getCookieValue(String cookieName);

    Cookie[] getCookies();

    void setCookie(Cookie c);

    void expireCookie(String cookieName);

    void setWeChatUserInfo(WeChatCurrentUserProtocol protocol, Long chainId);

    WeChatCurrentUserProtocol getWeChatUserInfo(Long chainId);
}
