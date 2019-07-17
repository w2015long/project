package com.imall.crm.web.sales;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.sales.protocol.wap.WapCouponReceiveProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * wap 赠券记录
 * @author ljt
 * @date 2019/5/21 0021
 */
@RestController
@RequestMapping("/wap/couponGiftLog")
public class WapCouponGiftLogController extends BaseController {
    @Autowired
    private FileResolver fileResolver;

    /**
     * 好友接受页面接口
     */
    @ResponseBody
    @RequestMapping(value = "/receiveCoupon",method = RequestMethod.GET)
    public Object receiveCoupon(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser,String couponShareCode){
        String url = getServicePath() + "/wap/couponGiftLog/receiveCoupon?chainId={chainId}&memberId={memberId}&couponShareCode={couponShareCode}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class,currentUser.getChainId(),currentUser.getMemberId(),couponShareCode);
        if(crmResponse.getData() != null){
            WapCouponReceiveProtocol protocol = (WapCouponReceiveProtocol) crmResponse.getData();
            if(protocol.getIconFileId() != null){
                if(protocol.getIconFileId().contains("http://") ){
                    return handleResponse(crmResponse);
                }
                if (protocol.getIconFileId().contains("https://")){
                    return handleResponse(crmResponse);
                }
                protocol.setIconFileId(fileResolver.getWebUrl(protocol.getIconFileId()));
            }
        }
        return handleResponse(crmResponse);
    }

    /**
     * wap 好友赠送优惠券
     * @param currentUser 用户
     * @param couponPermissionId 优惠券使用权限Id
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/sendCouponToFriend",method = RequestMethod.GET)
    public Object sendCouponToFriend(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long couponPermissionId){
        String url = getServicePath() + "/wap/couponGiftLog/sendCouponToFriend?chainId={chainId}&memberId={memberId}&couponPermissionId={couponPermissionId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId(),currentUser.getMemberId(),couponPermissionId);
        return handleResponse(crmResponse);
    }
    /**
     * wap 撤回优惠券
     */
    @ResponseBody
    @RequestMapping(value = "/withdrawCouponGift",method = RequestMethod.GET)
    public Object withdrawCouponGift(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long couponPermissionId){
        String url = getServicePath() + "/wap/couponGiftLog/withdrawCouponGift?memberId={memberId}&couponPermissionId={couponPermissionId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getMemberId(),couponPermissionId);
        return handleResponse(crmResponse);
    }

    /**
     * wap 好友领取优惠券
     */
    @ResponseBody
    @RequestMapping(value = "/receiveCouponFromFriend",method = RequestMethod.GET)
    public Object receiveCouponFromFriend(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String couponShareCode){
        String url = getServicePath() + "/wap/couponGiftLog/receiveCouponFromFriend?chainId={chainId}&memberId={memberId}&couponShareCode={couponShareCode}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class,currentUser.getChainId(),currentUser.getMemberId(),couponShareCode);
        return handleResponse(crmResponse);
    }

}
