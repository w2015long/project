package com.imall.crm.web.sales;

import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * wap 优惠券
 * Created by caixuan on 2018/4/9.
 * Time 15:13
 */

@RestController
@RequestMapping("/wap/memberCardActivateRewardSetting")
public class WapMemberCardActivateRewardController extends BaseController{
    @Value("${crm.web.root}")
    private String webRoot;
    /**
     * 用户可以领取的优惠券列表
     * @param currentUser
     * @return
     */
    @RequestMapping(value = "/listNewMemberCardActivateReward",method = RequestMethod.GET)
    public Object listNewMemberCardActivateReward(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String url = getServicePath() + "/wap/memberCardActivateRewardSetting/listNewMemberCardActivateReward?chainId={chainId}&shopId={shopId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId(),currentUser.getShopId());
        return handleResponse(crmResponse);
    }



}
