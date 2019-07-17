package com.imall.crm.web.member;

import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * 友德医问诊
 *
 * @author kwy
 * @date 2019/5/8
 */
@RestController
@RequestMapping("/wap/ydyInquiry")
public class WapYdyInquiryController extends BaseController {

    /**
     * 保存友德医问诊记录 并 获取友德医问诊url
     * @param patientId 患者信息id
     */
    @GetMapping(value = "/getYdyDoctorPageUrl")
    public Object getYdyDoctorPageUrl(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser ,Long patientId){
        String url = getServicePath() + "wap/ydyInquiry/getYdyDoctorPageUrl?chainId={chainId}&shopId={shopId}&patientId={patientId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class,currentUser.getChainId(),currentUser.getShopId(),patientId);
        return handleResponse(crmResponse);
    }


}
