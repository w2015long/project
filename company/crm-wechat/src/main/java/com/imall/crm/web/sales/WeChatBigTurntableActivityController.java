package com.imall.crm.web.sales;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.sales.protocol.BigTurntablePrizeProtocol;
import com.imall.crm.module.sales.protocol.wap.WapBigTurntableActivityProtocol;
import com.imall.crm.module.sales.protocol.wap.WapBigTurntablePrizeProtocol;
import com.imall.crm.module.sales.protocol.wap.WapWinningRecordProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author ou
 */
@RestController
@RequestMapping("/wap/turntable")
public class WeChatBigTurntableActivityController extends BaseController {

    @Autowired
    private FileResolver fileResolver;

    @RequestMapping(value="/findWeChatCurrentBigTurntableActivity",method = RequestMethod.GET)
    public Object index(@WeChatCurrentUser WeChatCurrentUserProtocol chatCurrentUserProtocol) {

        String url = getServicePath() + "wap/bigTurntableActivity/findWeChatCurrentBigTurntableActivity?chainId={chainId}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, chatCurrentUserProtocol.getChainId(),chatCurrentUserProtocol.getMemberId());
        if (crmResponse.getData() == null) {
            return handleResponse(crmResponse);
        }
        WapBigTurntableActivityProtocol bigTurntableActivityProtocol = (WapBigTurntableActivityProtocol) crmResponse.getData();
        if (bigTurntableActivityProtocol.getBigTurntablePrizeProtocols() != null) {
            for (BigTurntablePrizeProtocol bigTurntablePrizeProtocol : bigTurntableActivityProtocol.getBigTurntablePrizeProtocols()) {
                bigTurntablePrizeProtocol.setPrizePicUrl(fileResolver.getWebUrl(bigTurntablePrizeProtocol.getPrizePic()));
            }
        }
        if (bigTurntableActivityProtocol.getWinningRecordProtocols() != null) {
            for (WapWinningRecordProtocol bigTurntablePrizeProtocol : bigTurntableActivityProtocol.getUserWinningRecordProtocols()) {
                bigTurntablePrizeProtocol.setPrizePic(fileResolver.getWebUrl(bigTurntablePrizeProtocol.getPrizePic()));
            }
        }

        return handleResponse(bigTurntableActivityProtocol);
    }
    @RequestMapping(value="/joinCurrentBigTurntableActivity" ,method = RequestMethod.GET)
    public Object joinCurrentBigTurntableActivity(@WeChatCurrentUser WeChatCurrentUserProtocol chatCurrentUserProtocol,Long bigTurntableActivityId) {
        String url = getServicePath() + "wap/bigTurntableActivity/joinCurrentBigTurntableActivity?chainId={chainId}&memberId={memberId}&bigTurntableActivityId={bigTurntableActivityId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, chatCurrentUserProtocol.getChainId(),chatCurrentUserProtocol.getMemberId(),bigTurntableActivityId);
        if (crmResponse.getData() != null) {
            WapBigTurntablePrizeProtocol bigTurntablePrizeWinProtocol = (WapBigTurntablePrizeProtocol) crmResponse.getData();
            bigTurntablePrizeWinProtocol.setPrizePic(fileResolver.getWebUrl(bigTurntablePrizeWinProtocol.getPrizePic()));
        }
        return handleResponse(crmResponse);
    }
}
