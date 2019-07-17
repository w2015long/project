package com.imall.crm.web.platform;

import com.imall.crm.commons.global.Global;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.platform.protocol.wap.WapChainSysSettingProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by frt on 2018/4/2.
 */
@RestController
@RequestMapping(value = "/wap/chainSysSetting")
public class WapChainSysSettingController extends BaseController{
    /**
     * 获取短信发送间隔时间
     * @return
     */
    @RequestMapping(value = "/getSendSmsFrequency", method = RequestMethod.GET)
    public Object getSendSmsFrequency(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String requestUrl = getServicePath() + "/wap/chainSysSetting/findByCodeAndChainId?code={code}&chainId={chainId}";
        CrmResponse<WapChainSysSettingProtocol> crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class, Global.SEND_SMS_FREQUENCY, currentUser.getChainId());
        if(crmResponse.isHasException()){
            return handleResponse(crmResponse);
        }

        return handleResponse(crmResponse.getData().getVariableValue());
    }
}
