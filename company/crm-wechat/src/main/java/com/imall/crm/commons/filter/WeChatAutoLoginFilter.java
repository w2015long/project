package com.imall.crm.commons.filter;

import com.imall.crm.commons.dicts.BooleTypeEnum;
import com.imall.crm.commons.filter.base.BaseFilter;
import com.imall.crm.commons.global.Global;
import com.imall.crm.commons.web.DefaultWebContext;
import com.imall.crm.commons.web.WebContextFactory;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.module.wechat.protocol.WeChatPageAuthorizationProtocol;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.servlet.FilterChain;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

/**
 * Created by frt on 2018/3/9.
 * 微信自动登录
 */
@Component
public class WeChatAutoLoginFilter extends BaseFilter {
    private static Logger logger = Logger.getLogger(WeChatAutoLoginFilter.class);
    @Value("${api-crm-service-path}")
    private String servicePath;
    @Value("${crm.web.root}")
    private String webRoot;
    @Autowired
    private RestTemplate restTemplate;

    @Override
    protected void doRealFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();
        logger.info("======================================WeChatAutoLoginFilter：" + request.getRequestURL().toString());
        logger.info("===================================Session Id : " + ctx.getSession().getId());
        String userAgent = request.getHeader("User-Agent");
        String microMessenger = "MicroMessenger/";

        if (null != userAgent && userAgent.indexOf(microMessenger) > 0) {//微信浏览器访问
            logger.info("微信浏览器访问，User-Agent:" + userAgent);
            ctx.setSessionAttr(Global.IS_WE_CHAT_CLIENT, BooleTypeEnum.Y.toCode(), getCurrentChainId());

            WeChatCurrentUserProtocol currentUserProtocol = ctx.getWeChatUserInfo(getCurrentChainId());
            Object weChatHadAutoLogin = ctx.getSessionAttr(Global.WE_CHAT_HAD_AUTO_LOGIN, getCurrentChainId());
            if(weChatHadAutoLogin!=null && BooleTypeEnum.Y==BooleTypeEnum.fromCode(String.valueOf(weChatHadAutoLogin))){
                logger.info("已经授权登录过了，本次不拦截");
                filterChain.doFilter(request, response);
                return;
            }

            if(currentUserProtocol.getMemberId()==null){//没有登录，且没有授权过，需要授权登录
                logger.info("没有登录，且没有授权过，需要授权登录");
                //获取当前访问的页面地址
                String serviceUrl = request.getRequestURL().toString();
                if (StringUtils.isNotBlank(request.getQueryString())) {
                    // 解决微信开卡state过长的问题
                    ServletContext servletContext = request.getSession().getServletContext();
                    String uuid = UUID.randomUUID().toString();
                    logger.info("解决微信开卡state过长的问题,uuid" + uuid);
                    logger.info("解决微信开卡state过长的问题,request.getQueryString()" + request.getQueryString());
                    servletContext.setAttribute(uuid, request.getQueryString());
                    serviceUrl = serviceUrl + "?" + uuid;
                }
                logger.info("获取当前访问的页面地址"+serviceUrl);
                WeChatPageAuthorizationProtocol protocol = new WeChatPageAuthorizationProtocol();
                protocol.setServiceUrl(serviceUrl);
                protocol.setRedirectUrl(webRoot + "/wxapi/receivePageAuthorizationCode");
                protocol.setChainId(getCurrentChainId());
                CrmResponse<String> crmResponse = restTemplate.postForObject(servicePath + "/wxapi/getWeChatPageAuthUrl", protocol, CrmResponse.class);
                logger.info("返回授权:"+crmResponse.getData());
                response.sendRedirect(crmResponse.getData());
                return;
            }

            logger.info("已经登录，直接往下执行");
        }else{//其他浏览器访问
            logger.info("其他浏览器访问，User-Agent:" + userAgent);
            ctx.setSessionAttr(Global.IS_WE_CHAT_CLIENT, BooleTypeEnum.N.toCode(), getCurrentChainId());
            //TODO:frt 非微信浏览器访问微信页面，要如何处理？

        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected String excludeUrls() {
        return "/wxapi/receivePageAuthorizationCode";
    }
}
