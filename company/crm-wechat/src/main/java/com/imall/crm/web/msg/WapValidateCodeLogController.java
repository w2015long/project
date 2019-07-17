package com.imall.crm.web.msg;

import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author frt
 * @date 2018/8/15 16:24
 */
@RestController
@RequestMapping("/wap/validateCodeLog")
public class WapValidateCodeLogController extends BaseController {

    @GetMapping(value = "/checkValidateCode")
    public Object checkValidateCode(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser, String mobile, String validateCode){
        String url = getServicePath() + "/wap/validateCodeLog/checkValidateCode?mobile={mobile}&validateCode={validateCode}&chainId={chainId}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, mobile, validateCode, weChatCurrentUser.getChainId()));
    }

}
