package com.imall.crm.commons.web;

import com.imall.crm.commons.global.Global;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 上下文
 * TODO:frt 需要考虑分布式 session 共享机制，通过 Ngnix 每次都将同一用户的所有请求转发至同一台服务器上？
 * Created by frt on 2018/3/19.
 */
public class DefaultWebContext implements IWebContext {
    private HttpServletRequest request;
    private HttpServletResponse response;
    private HttpSession session;

    @Override
    public HttpServletRequest getRequest() {
        return request;
    }

    @Override
    public void setRequest(HttpServletRequest request) {
        this.request = request;
    }

    @Override
    public HttpServletResponse getResponse() {
        return response;
    }

    @Override
    public void setResponse(HttpServletResponse response) {
        this.response = response;
    }

    @Override
    public HttpSession getSession() {
        return session;
    }

    @Override
    public void setSession(HttpSession session) {
        this.session = session;
    }

    @Override
    public void setSessionAttr(String key, Object value, Long chainId) {
        if(session!=null){
            session.setAttribute(createKey(key, chainId), value);
        }
    }

    @Override
    public Object getSessionAttr(String key, Long chainId) {
        if (session != null) {
            return session.getAttribute(createKey(key, chainId));
        }

        return null;
    }

    @Override
    public void removeSessionAttr(String key, Long chainId) {
        if (session != null) {
            session.removeAttribute(createKey(key, chainId));
        }
    }

    @Override
    public void setRequestAttr(String key, Object value, Long chainId) {
        if (request != null) {
            request.setAttribute(createKey(key, chainId), value);
        }
    }

    @Override
    public Object getRequestAttr(String key, Long chainId) {
        if (request != null) {
            request.getAttribute(createKey(key, chainId));
        }

        return null;
    }

    @Override
    public void removeRequestAttr(String key, Long chainId) {
        if (request != null) {
            request.removeAttribute(createKey(key, chainId));
        }
    }

    @Override
    public Cookie getCookie(String cookieName) {
        if (getCookies() != null) {
            for (Cookie c : getCookies()) {
                if (c.getName().equalsIgnoreCase(cookieName)) {
                    return c;
                }
            }
        }

        return null;
    }

    @Override
    public String getCookieValue(String cookieName) {
        Cookie cookie = getCookie(cookieName);
        return cookie == null ? "" : cookie.getValue();
    }

    @Override
    public Cookie[] getCookies() {
        return request.getCookies();
    }

    @Override
    public void setCookie(Cookie c) {
        response.addCookie(c);
    }

    @Override
    public void expireCookie(String cookieName) {
        Cookie cookie = getCookie(cookieName);
        if (cookie != null) {
            cookie.setMaxAge(-1);
            response.addCookie(cookie);
        }
    }

    @Override
    public void setWeChatUserInfo(WeChatCurrentUserProtocol protocol, Long chainId) {
        if (session != null) {
            session.setAttribute(createKey(Global.WE_CHAT_USER_INFO, chainId), protocol);
        }
    }

    @Override
    public WeChatCurrentUserProtocol getWeChatUserInfo(Long chainId) {
        if (session != null) {
            return (WeChatCurrentUserProtocol) session.getAttribute(createKey(Global.WE_CHAT_USER_INFO, chainId));
        }

        return null;
    }

    private String createKey(String preKey, Long chainId){
        return preKey + createSuffixKey(chainId);
    }

    private String createSuffixKey(Long chainId){
        return "_" + chainId;
    }
}
