package com.imall.crm.web.msg;

import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.commons.web.WebContextFactory;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.UnsupportedEncodingException;

/**
 * @author wsh
 * @date 2018/3/22
 * 发送验证码
 */
@Controller
@RequestMapping("/wap/validateCode")
public class WapSendValidateCodeController extends BaseController {



    @RequestMapping(value = "/sendNormalValidateCode", method = RequestMethod.GET)
    @ResponseBody
    public Object sendNormalValidateCode(String mobile, @WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser) throws UnsupportedEncodingException {
        //用户未登录
        Long memberId = weChatCurrentUser.getMemberId();
        Long chainId = weChatCurrentUser.getChainId();

        //手机号码为空
        if (StringUtils.isBlank(mobile)) {
            throw new IllegalArgumentException("请输入手机号");
        }
        //获取真正的IP地址
        String ipAddress = getIpAddress(WebContextFactory.getWebContext().getRequest());
        String url = getServicePath() + "/wap/validateCode/sendNormalValidateCode?mobile={mobile}&memberId={memberId}&ipAddress={ipAddress}&chainId={chainId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, mobile, memberId, ipAddress, chainId);
        return handleResponse(crmResponse);
    }

}
