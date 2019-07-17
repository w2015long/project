package com.imall.crm.web.sales;

import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 优惠券大礼包 wap端
 */
@RestController
@RequestMapping("/wap/couponGiftPacks")
public class WapCouponGiftPacksController extends BaseController {

    /**
     * 查询优惠券大礼包 详情
     *
     * @param currentUser       当前登录微信用户信息
     * @param couponGiftPacksId 大礼包Id
     * @return
     */
    @GetMapping("/wapFindCouponGiftPacksDetails")
    public Object wapFindCouponGiftPacksDetails(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long couponGiftPacksId) {
        String url = getServicePath() + "/wap/couponGiftPacks/wapFindCouponGiftPacksDetails?couponGiftPacksId={couponGiftPacksId}&chainId={chainId}&shopId={shopId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, couponGiftPacksId, currentUser.getChainId(),currentUser.getShopId());
        return handleResponse(crmResponse);
    }

    /**
     * 领取优惠券大礼包
     * @param currentUser 当前登录微信用户信息
     * @param couponGiftPacksId     大礼包Id
     */
    @GetMapping("/receiveCouponGiftPacks")
    public Object receiveCouponGiftPacks(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long couponGiftPacksId) {
        String url = getServicePath() + "/wap/couponGiftPacks/receiveCouponGiftPacks?couponGiftPacksId={couponGiftPacksId}&chainId={chainId}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, couponGiftPacksId, currentUser.getChainId(),currentUser.getMemberId());
        return handleResponse(crmResponse);
    }
}
