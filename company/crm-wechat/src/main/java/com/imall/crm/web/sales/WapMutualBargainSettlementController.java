package com.imall.crm.web.sales;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.sales.protocol.wap.WapMutualBargainSaveOrderProtocol;
import com.imall.crm.module.sales.protocol.wap.WapMutualBargainSettlementProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 互助砍价结算页
 * Created by kwy on 2018/12/28
 */

@RestController
@RequestMapping("/wap/mutualBargainSettlement")
public class WapMutualBargainSettlementController extends BaseController {


    @Autowired
    private FileResolver fileResolver;


    /**
     * 微店 获取 砍价结算页信息
     */
    @GetMapping(value = "/showBargainSettlementDetail")
    public Object listReceiverAddr(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, Long mutualBargainShareRecordId, Long mutualBargainActivityId) {
        String requestUrl = getServicePath() + "wap/mutualBargainSettlement/showBargainSettlementDetail?chainId={chainId}&memberId={memberId}&mutualBargainShareRecordId={mutualBargainShareRecordId}&mutualBargainActivityId={mutualBargainActivityId}";
        CrmResponse response = restTemplate.getForObject(requestUrl, CrmResponse.class, weChatCurrentUserProtocol.getChainId(), weChatCurrentUserProtocol.getMemberId(), mutualBargainShareRecordId, mutualBargainActivityId);
        if (response.isHasException()) {
            return handleResponse(response);
        }
        WapMutualBargainSettlementProtocol settlementProtocol = (WapMutualBargainSettlementProtocol) response.getData();
        if (settlementProtocol.getFileId() != null) {
            settlementProtocol.setPicture(fileResolver.getWebUrl(settlementProtocol.getFileId(), "220X220"));
        }
        return handleResponse(response);
    }

    /**
     * 微店 砍价 保存订单
     */
    @PostMapping(value = "/saveOrder")
    public Object saveOrder(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, @RequestBody WapMutualBargainSaveOrderProtocol wapMutualBargainSaveOrderProtocol) {
        wapMutualBargainSaveOrderProtocol.setChainId(weChatCurrentUserProtocol.getChainId());
        wapMutualBargainSaveOrderProtocol.setMemberId(weChatCurrentUserProtocol.getMemberId());
        wapMutualBargainSaveOrderProtocol.setOpenId(weChatCurrentUserProtocol.getOpenId());
        String requestUrl = getServicePath() + "wap/mutualBargainSettlement/saveOrder";
        CrmResponse response = restTemplate.postForObject(requestUrl, wapMutualBargainSaveOrderProtocol, CrmResponse.class);
        if (response.isHasException()) {
            return handleResponse(response);
        }
        return handleResponse(response);
    }
}
