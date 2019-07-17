package com.imall.crm.commons.web;

import com.imall.crm.commons.global.Global;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Created by frt on 2018/3/21.
 */
public class WeChatCurrentUserMethodArgumentResolver implements HandlerMethodArgumentResolver {
    //TODO:frt 写死连锁ID，后续需要考虑如何动态获取
    private Long chainId = 1L;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(WeChatCurrentUser.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();
        return ctx.getSessionAttr(Global.WE_CHAT_USER_INFO, chainId);
    }
}
