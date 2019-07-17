package com.imall.crm.web.sales;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.CartFactory;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.commons.base.protocol.NormalPageProtocol;
import com.imall.crm.module.sales.protocol.wap.WapCouponAcquireCentrePageSearchProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * wap 优惠券
 * Created by caixuan on 2018/4/9.
 * Time 15:13
 */

@RestController
@RequestMapping("/wap/coupon")
public class WapCouponController extends BaseController{
    @Value("${crm.web.root}")
    private String webRoot;

    @Autowired
    private FileResolver fileResolver;

    /**
     * 用户可以领取的优惠券列表
     * @param currentUser
     * @return
     */
    @RequestMapping(value = "/findReceiveCoupons",method = RequestMethod.GET)
    public Object findReceiveCoupons(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String url = getServicePath() + "/wap/coupon/findReceiveCoupons?chainId={chainId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId());
        return handleResponse(crmResponse);
    }

    /**
     * 领取优惠券
     * @param currentUser
     * @param couponId 优惠券id
     * @return
     */
    @RequestMapping(value = "/updateReceiveCoupons",method = RequestMethod.GET)
    public Object updateReceiveCoupons(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser,Long couponId){
        String url = getServicePath() + "/wap/coupon/updateReceiveCoupons?chainId={chainId}&couponId={couponId}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId(),couponId,currentUser.getMemberId());
        return handleResponse(crmResponse);
    }

    /**
     * 获取某个会员，当前时间能够使用的优惠券
     * @param currentUser           当前会员
     * @return
     */
    @GetMapping(value = "/searchCoupon")
    public Object searchCoupon(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String url = getServicePath() + "/wap/coupon/searchCoupon";
        return handleResponse(restTemplate.postForObject(url, CartFactory.deepCopyCart(currentUser), CrmResponse.class));
    }

    /**
     * 后台生成的优惠券二维码 ,
     *
     * 接口使用场景 :通过该接口跳转手机端领券页面
     * 扫码领取优惠券
     * @param couponId   优惠券id
     * @return
     */
    @GetMapping(value = "/sV/{couponId}/{receiveCouponUrl}")
    public void scanReceiveCouponView(HttpServletResponse response, @PathVariable(name = "couponId") Long couponId, @PathVariable(name = "receiveCouponUrl") String receiveCouponUrl) throws IOException {
        String url = webRoot  + "/#/coupon/sc/" +couponId +"/"+receiveCouponUrl;
        response.sendRedirect(url);
    }
    /**
     * 扫码领取优惠券
     * @param couponId   优惠券id
     * @return
     */
    @GetMapping(value = "/scanReceiveCoupon")
    public Object scanReceiveCoupon(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long couponId){
        String url =  getServicePath()+ "/wap/coupon/scanReceiveCoupon?memberId={memberId}&couponId={couponId}&chainId={chainId}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, currentUser.getMemberId(), couponId,currentUser.getChainId()));
    }

    /**
     * 使用优惠券
     * @param couponPermissionId 优惠券使用权限ID
     * @return
     */
    @GetMapping(value = "/useCoupon")
    public Object useCoupon(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long couponPermissionId){
        String url = getServicePath() + "/wap/coupon/useCoupon?couponPermissionId={couponPermissionId}&memberId={memberId}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, couponPermissionId,currentUser.getMemberId()));
    }

    /**
     * 查询优惠券使用情况
     * @param couponPermissionId 优惠券使用权限ID
     * @return
     */
    @GetMapping(value = "/queryCouponUseSituation")
    public Object queryCouponUseSituation(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long couponPermissionId){
        String url = getServicePath() + "/wap/coupon/queryCouponUseSituation?couponPermissionId={couponPermissionId}&memberId={memberId}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, couponPermissionId,currentUser.getMemberId()));
    }

    /**
     * 获取会员卡推广二维码

     * @param redirectUrl 领券回调url
     * @param shopId 门店id  追踪门店
     * @return
     */
    @RequestMapping(value = "/geMemberCardCode")
    @ResponseBody
    public Object geMemberCardCode(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser ,String redirectUrl) {
       Long chainId = currentUser.getChainId();
        CrmResponse crmResponse = restTemplate.getForObject(getServicePath() + "/wxapi/geMemberCardCodeUrl?chainId={chainId}&shopId={shopId}&redirectUrl={redirectUrl}", CrmResponse.class, chainId, null,redirectUrl);
        return handleResponse(crmResponse);
    }


    /**
     * 年会领卷
     * @param couponId  优惠券id
     * @param newMapLocation 经纬度
     */
    @GetMapping(value = "/yearMeetingReceive")
    public Object yearMeetingReceive(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser,Long couponId,String newMapLocation){
        String url = getServicePath() + "/wap/coupon/yearMeetingReceive?couponId={couponId}&memberId={memberId}&chainId={chainId}&newMapLocation={newMapLocation}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class,couponId, currentUser.getMemberId(),currentUser.getChainId(),newMapLocation));
    }

    /**
     * 新领券中心 --> 可领取优惠券分页列表
     */
    @ResponseBody
    @RequestMapping(value = "/pageReceiveCoupons", method = RequestMethod.POST)
    public Object pageReceiveCoupons(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapCouponAcquireCentrePageSearchProtocol searchProtocol) {
        searchProtocol.setChainId(currentUser.getChainId());
        searchProtocol.setMemberId(currentUser.getMemberId());
        CrmResponse crmResponse = restTemplate.postForObject(getServicePath() + "/wap/coupon/pageReceiveCoupons", searchProtocol, CrmResponse.class);
        if (crmResponse.isHasException()) {
            return handleResponse(crmResponse);
        }
        if (null != crmResponse.getData()){
            NormalPageProtocol pageProtocol = (NormalPageProtocol)crmResponse.getData();
            List<LinkedHashMap<String, String>> linkedHashMapList = pageProtocol.getData();
            for(LinkedHashMap<String, String> linkedHashMap : linkedHashMapList){
                if (StringUtils.isNotBlank(linkedHashMap.get("advertisementImg"))) {
                    linkedHashMap.put("advertisementImg", fileResolver.getWebUrl(linkedHashMap.get("advertisementImg")));
                }
            }
        }
        return handleResponse(crmResponse);
    }

    /**
     * 微商城 领券中心 优惠券分类
     */
    @RequestMapping(value = "/findCouponCat", method = RequestMethod.GET)
    @ResponseBody
    public Object findCouponCat(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser) {
        CrmResponse crmResponse = restTemplate.getForObject(getServicePath() + "/wap/coupon/findCouponCat?chainId={chainId}", CrmResponse.class, currentUser.getChainId());
        return handleResponse(crmResponse);
    }


    /**
     * 微商城 优惠券支持商品 优惠券详情
     */
    @GetMapping(value = "/wapFindCouponProductEmployDetails")
    @ResponseBody
    public Object wapFindCouponProductEmployDetails(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser,Long couponId) {
        String url = getServicePath() + "/wap/coupon/wapFindCouponProductEmployDetails?chainId={chainId}&shopId={shopId}&couponId={couponId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId(),currentUser.getShopId(),couponId);
        return handleResponse(crmResponse);
    }
}
