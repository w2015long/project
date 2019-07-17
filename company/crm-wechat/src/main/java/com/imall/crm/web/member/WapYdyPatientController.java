package com.imall.crm.web.member;

import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.member.protocol.wap.WapYdyPatientProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.web.bind.annotation.*;


/**
 * 友德医患者信息
 *
 * @author kwy
 * @date 2019/5/8
 */
@RestController
@RequestMapping("/wap/ydyPatient")
public class WapYdyPatientController extends BaseController {

    /**
     * 保存或编辑友德医问诊患者信息
     */
    @PostMapping(value = "/saveOrUpdateYdyPatient")
    public Object saveOrUpdateYdyPatient(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapYdyPatientProtocol ydyPatientProtocol) {
        ydyPatientProtocol.setShopId(currentUser.getShopId());
        ydyPatientProtocol.setChainId(currentUser.getChainId());
        ydyPatientProtocol.setMemberId(currentUser.getMemberId());
        CrmResponse crmResponse = restTemplate.postForObject(getServicePath() + "/wap/ydyPatient/saveOrUpdateYdyPatient", ydyPatientProtocol, CrmResponse.class);
        return handleResponse(crmResponse);
    }

    /**
     * 删除友德医患者信息
     */
    @GetMapping(value = "/deleteYdyPatient")
    public Object deleteYdyPatient(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long patientId) {
        CrmResponse crmResponse = restTemplate.getForObject(getServicePath() + "wap/ydyPatient/deleteYdyPatient?chainId={chainId}&patientId={patientId}", CrmResponse.class,currentUser.getChainId(),patientId);
        return handleResponse(crmResponse);
    }

    /**
     * 第一次添加友德医患者信息
     */
    @GetMapping(value = "/initialPatient")
    public Object initialPatient(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser) {
        CrmResponse crmResponse = restTemplate.getForObject(getServicePath() + "wap/ydyPatient/initialPatient?chainId={chainId}&memberId={memberId}", CrmResponse.class,currentUser.getChainId(),currentUser.getMemberId());
        return handleResponse(crmResponse);
    }

    /**
     * 获取友德医患者信息列表
     */
    @GetMapping(value = "/findByYdyPatientList")
    public Object findByYdyPatientList(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser) {
        String url  = getServicePath() + "/wap/ydyPatient/findByYdyPatientList?chainId={chainId}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class,currentUser.getChainId(),currentUser.getMemberId());
        return handleResponse(crmResponse);
    }
}
