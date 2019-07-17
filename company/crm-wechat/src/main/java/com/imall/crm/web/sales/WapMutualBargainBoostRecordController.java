package com.imall.crm.web.sales;

import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 互助砍价活动
 * Created by liezihao on 2018/12/27
 */

@RestController
@RequestMapping("/wap/mutualBargainBoostRecord")
public class WapMutualBargainBoostRecordController extends BaseController{

    /**
     * 微店 获取 首次助力助力
     */
    @GetMapping(value = "/updateMutualBargainBoostState")
    public Object getMutualBargainActivityDetail(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,Long mutualBargainShareRecordId){

        String url = getServicePath() + "/wap/mutualBargainBoostRecord/updateMutualBargainBoostState?chainId={chainId}&memberId={memberId}&mutualBargainShareRecordId={mutualBargainShareRecordId}&openId={openId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, weChatCurrentUserProtocol.getChainId(),weChatCurrentUserProtocol.getMemberId(),mutualBargainShareRecordId,weChatCurrentUserProtocol.getOpenId());
        return handleResponse(crmResponse);
    }


}
