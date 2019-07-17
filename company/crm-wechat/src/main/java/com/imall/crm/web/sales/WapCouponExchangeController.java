package com.imall.crm.web.sales;

import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.sales.protocol.CouponExchangeSearchProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 兑换优惠券(wap端)
 *
 * @author wsh
 * @date 2018/04/02
 */
@Controller
@RequestMapping("/wap/exchangeCoupon")
public class WapCouponExchangeController extends BaseController {

    @ResponseBody
    @RequestMapping(value = "/pageExchangeCoupon", method = RequestMethod.GET)
    public Object pageExchangeCoupon(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, CouponExchangeSearchProtocol couponExchangeSearchProtocol) {
        CouponExchangeSearchProtocol searchProtocol = new CouponExchangeSearchProtocol();
        BeanUtils.copyProperties(couponExchangeSearchProtocol, searchProtocol);
        searchProtocol.setChainId(currentUser.getChainId());
        CrmResponse crmResponse = restTemplate.postForObject(getServicePath() + "/wap/couponExchange/pageExchangeCoupon", searchProtocol, CrmResponse.class);
        return handleResponse(crmResponse);
    }

    @ResponseBody
    @RequestMapping(value = "/getMemberIntegral", method = {RequestMethod.GET})
    public Object getMemberIntegral(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser) {
        String url = getServicePath() + "wap/member/findMemberIntegralByMemberId?memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getMemberId());
        return handleResponse(crmResponse);
    }

    @ResponseBody
    @RequestMapping(value = "/couponExchange", method = RequestMethod.GET)
    private Object couponExchange(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, Long couponExchangeId) {
        String url = getServicePath() + "wap/couponExchange/couponExchange?couponExchangeId={couponExchangeId}&chainId={chainId}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, couponExchangeId, weChatCurrentUserProtocol.getChainId(), weChatCurrentUserProtocol.getMemberId());
        return handleResponse(crmResponse);
    }

}
