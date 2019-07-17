package com.imall.crm.web.member;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.commons.base.protocol.NormalPageProtocol;
import com.imall.crm.module.sales.protocol.IntegralOrderSearchProtocol;
import com.imall.crm.module.sales.protocol.wap.WapIntegralOrderItemProtocol;
import com.imall.crm.module.sales.protocol.wap.WapIntegralOrderProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.LinkedHashMap;
import java.util.List;

/**
 * @author chencheng
 * @date 2018/5/8
 * 积分订单
 */
@Controller
@RequestMapping("/wap/integralOrder")
public class WapIntegralOrderController extends BaseController {

    @Autowired
    private FileResolver fileResolver;

    /**
     * 会员积分订单
     */
    @ResponseBody
    @RequestMapping(value = "/pageIntegralOrder", method = RequestMethod.GET)
    public Object pageIntegralProduct(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, IntegralOrderSearchProtocol searchProtocolTemp){
        IntegralOrderSearchProtocol searchProtocol = new IntegralOrderSearchProtocol();
        BeanUtils.copyProperties(searchProtocolTemp, searchProtocol);
        searchProtocol.setChainId(currentUser.getChainId());
        searchProtocol.setMemberId(currentUser.getMemberId());

        String url = getServicePath() + "/wap/integralOrder/pageIntegralOrder";
        CrmResponse crmResponse = restTemplate.postForObject(url, searchProtocol, CrmResponse.class);

        NormalPageProtocol pageProtocol = (NormalPageProtocol)crmResponse.getData();
        List<LinkedHashMap<String, Object>> orderList = pageProtocol.getData();
        for (LinkedHashMap<String, Object> order : orderList) {
            List<LinkedHashMap<String, String>> orderItems = (List<LinkedHashMap<String, String>>) order.get("orderItems");
            for (LinkedHashMap<String, String> orderItem : orderItems) {
                orderItem.put("picFileUrl", fileResolver.getWebUrl(orderItem.get("picFileId")));
            }
        }
        return handleResponse(crmResponse);
    }

    /**
     * 获取未发货积分订单数量
     */
    @ResponseBody
    @RequestMapping(value = "/getNoSentQuantity")
    public Object getNoSentQuantity(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String url = getServicePath() + "/wap/integralOrder/getNoSentQuantity?chainId={chainId}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId(), currentUser.getMemberId());
        return handleResponse(crmResponse);
    }

    /**
     * 获取未收货积分订单数量
     */
    @ResponseBody
    @RequestMapping(value = "/getNoReceivedQuantity")
    public Object getNoReceivedQuantity(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String url = getServicePath() + "/wap/integralOrder/getNoReceivedQuantity?chainId={chainId}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId(), currentUser.getMemberId());
        return handleResponse(crmResponse);
    }

    /**
     * 获取未收货积分订单数量
     */
    @ResponseBody
    @RequestMapping(value = "/orderReceive")
    public Object orderReceive(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long integralOrderId){
        String url = getServicePath() + "/wap/integralOrder/orderReceive?chainId={chainId}&memberId={memberId}&integralOrderId={integralOrderId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId(), currentUser.getMemberId(), integralOrderId);
        return handleResponse(crmResponse);
    }

    /**
     * 获取积分订单详情
     */
    @ResponseBody
    @RequestMapping(value = "/getIntegralOrderDetail")
    public Object getIntegralOrderDetail(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long integralOrderId){
        String url = getServicePath() + "/wap/integralOrder/getIntegralOrderDetail?chainId={chainId}&memberId={memberId}&integralOrderId={integralOrderId}";
        CrmResponse<WapIntegralOrderProtocol> crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId(), currentUser.getMemberId(), integralOrderId);
        WapIntegralOrderProtocol orderProtocol = crmResponse.getData();
        if (null != orderProtocol){
            for (WapIntegralOrderItemProtocol orderItemProtocol : orderProtocol.getOrderItems()) {
                orderItemProtocol.setPicFileUrl(fileResolver.getWebUrl(orderItemProtocol.getPicFileId()));
            }
        }
        return handleResponse(crmResponse);
    }

}
