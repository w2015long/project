package com.imall.crm.web.member;

import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * wap 用户储值中心
 * @author lcl
 */
@RestController
@RequestMapping("/wap/storedValue")
public class WapStoredValueController extends BaseController {


    /**
     * 查询会员储值余额
     */
    @GetMapping("/findMemberStoredValueBalance")
    public Object findMemberStoredValueBalance(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser) {
        String url = getServicePath() + "/wap/storedValue/findMemberStoredValueBalance?chainId={chainId}&memberId={memberId}";
        return handleResponse(restTemplate.getForObject(url,CrmResponse.class,currentUser.getChainId(),currentUser.getMemberId()));
    }

    /**
     * 查询会员登记身份证号
     */
    @GetMapping("/findMemberRegisterIDCard")
    public Object findMemberRegisterIDCard(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser) {
        String url = getServicePath() + "/wap/storedValue/findMemberRegisterIDCard?chainId={chainId}&memberId={memberId}";
        return handleResponse(restTemplate.getForObject(url,CrmResponse.class,currentUser.getChainId(),currentUser.getMemberId()));
    }

    /**
     * 查询当前会员储值最优匹配金额规则
     * @param amount 自定义充值金额
     */
    @GetMapping("/findOptimalStoredValueRule")
    public Object findOptimalStoredValueRule(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser,Double amount,Long storeValueRuleId){
        String url = getServicePath() + "/wap/storedValue/findOptimalStoredValueRule?chainId={chainId}&amount={amount}&memberId={memberId}&storeValueRuleId={storeValueRuleId}";
        return handleResponse(restTemplate.getForObject(url,CrmResponse.class,currentUser.getChainId(),amount,currentUser.getMemberId(),storeValueRuleId));
    }

    /**
     * 查询充值规则详情
     */
    @GetMapping("/findStoreValueRuleDetails")
    public Object findStoreValueRuleDetails(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String url = getServicePath() + "/wap/storedValue/findStoreValueRuleDetails?chainId={chainId}&memberId={memberId}";
        return handleResponse(restTemplate.getForObject(url,CrmResponse.class,currentUser.getChainId(),currentUser.getMemberId()));
    }
    
}
