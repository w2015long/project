package com.imall.crm.web.sales;

import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.sales.protocol.wap.WapPrescriptionRegisterSaveProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by olx on 2018/8/15/015
 * 处方登记
 */
@Controller
@RequestMapping("/wap/prescription")
public class WapPrescriptionRegisterController extends BaseController {

    /**
     * 保存
     */
    @RequestMapping(value = "/savePrescriptionRegister", method = RequestMethod.POST)
    @ResponseBody
    public Object savePrescriptionRegister(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapPrescriptionRegisterSaveProtocol wapPrescriptionRegisterSaveProtocol) {
        wapPrescriptionRegisterSaveProtocol.setChainId(currentUser.getChainId());
        wapPrescriptionRegisterSaveProtocol.setShopId(currentUser.getShopId());
        wapPrescriptionRegisterSaveProtocol.setMemberId(currentUser.getMemberId());
        CrmResponse crmResponse = restTemplate.postForObject(getServicePath() + "/wap/prescription/savePrescriptionRegister", wapPrescriptionRegisterSaveProtocol, CrmResponse.class);
        return handleResponse(crmResponse);
    }

    /**
     * 获取会员中心会员信息
     */
    @ResponseBody
    @RequestMapping(value = "/findSimpleMemberInfo")
    public Object findMemberInfo(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser) {
        String url = getServicePath() + "/wap/member/findSimpleMemberInfo?chainId={chainId}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.postForObject(url, null, CrmResponse.class, currentUser.getChainId(), currentUser.getMemberId());
        return handleResponse(crmResponse);
    }
}
 

 
