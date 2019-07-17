package com.imall.crm.commons.filter;

import com.imall.crm.commons.filter.base.BaseFilter;
import com.imall.crm.commons.global.Global;
import com.imall.crm.commons.web.DefaultWebContext;
import com.imall.crm.commons.web.WebContextFactory;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * 将会话信息保存到上下文中
 * Created by frt on 2018/3/19.
 */
@Component
public class WebContextFilter extends BaseFilter {
    private static final Logger logger = Logger.getLogger(WebContextFilter.class);
    @Value("${spring.profiles.active}")
    private String profilesName;

    @Override
    protected void doRealFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        logger.info("======================================WebContextFilter：" + request.getRequestURL().toString());
        HttpSession session = request.getSession();
        //设置 session 永不过期
        session.setMaxInactiveInterval(-1);
        DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();
        ctx.setRequest(request);
        ctx.setResponse(response);
        ctx.setSession(session);

        logger.info("===================================Session Id : " + ctx.getSession().getId());

        if(ctx.getWeChatUserInfo(getCurrentChainId())==null){
            WeChatCurrentUserProtocol currentUserProtocol = new WeChatCurrentUserProtocol();
            currentUserProtocol.setChainId(getCurrentChainId());

            if (Global.SPRING_PROFILES_NAME_SUFFIX_DEV.equals(profilesName)){//开发环境，自动注入会员1
                currentUserProtocol.setShopId(1L);
                currentUserProtocol.setMemberId(2L);
                currentUserProtocol.setOpenId("obOSOwuKmMSOqOc3j7sS74zJEYUQ");
            }

            ctx.setWeChatUserInfo(currentUserProtocol, getCurrentChainId());
        }

        logger.info("======================================WebContextFilter：" + ctx.getWeChatUserInfo(getCurrentChainId()).toString());

        filterChain.doFilter(request, response);
    }

}
