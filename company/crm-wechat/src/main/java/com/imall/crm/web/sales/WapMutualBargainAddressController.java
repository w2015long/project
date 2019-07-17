package com.imall.crm.web.sales;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 互助砍价参与地址
 * Created by kwy on 2018/12/28
 */

@RestController
@RequestMapping("/wap/mutualBargainAddress")
public class WapMutualBargainAddressController extends BaseController {


    @Autowired
    private FileResolver fileResolver;


    /**
     * 微店 获取 助力砍价活动
     */
    @GetMapping(value = "/listReceiverAddr")
    public Object listReceiverAddr(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, Long mutualBargainActivityId, Long mutualBargainShareRecordId) {
        String requestUrl = getServicePath() + "wap/mutualBargainAddress/listReceiverAddr?chainId={chainId}&mutualBargainActivityId={mutualBargainActivityId}&mutualBargainShareRecordId={mutualBargainShareRecordId}";
        CrmResponse response = restTemplate.getForObject(requestUrl, CrmResponse.class, weChatCurrentUserProtocol.getChainId(), mutualBargainActivityId, mutualBargainShareRecordId);
        if (response.isHasException()) {
            return handleResponse(response);
        }
        return handleResponse(response);
    }
}
