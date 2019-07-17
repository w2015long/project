package com.imall.crm.web.order;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.commons.base.protocol.NormalPageProtocol;
import com.imall.crm.module.sales.protocol.OrderSearchProtocol;
import com.imall.crm.module.sales.protocol.wap.WapOrderDetailProtocol;
import com.imall.crm.module.sales.protocol.wap.WapOrderItemProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;

/**
 * wap 订单
 * Created by caixuan on 2018/3/31.
 * Time 14:41
 */
@RestController
@RequestMapping("/wap/order")
public class WapOrderController extends BaseController{

    @Autowired
    private FileResolver fileResolver;

    /**
     * 订单列表
     * @param weChatCurrentUserProtocol
     * @param orderSearchProtocol
     * @return
     */
    @RequestMapping(value = "/pageOrder",method = RequestMethod.GET)
    public Object pageOrder(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, OrderSearchProtocol orderSearchProtocol){
        OrderSearchProtocol searchProtocol = new OrderSearchProtocol();
        BeanUtils.copyProperties(orderSearchProtocol,searchProtocol);
        searchProtocol.setChainId(weChatCurrentUserProtocol.getChainId());
        searchProtocol.setMemberId(weChatCurrentUserProtocol.getMemberId());

        String requestUrl = getServicePath() + "wap/order/pageOrder";
        CrmResponse response = restTemplate.postForObject(requestUrl, searchProtocol, CrmResponse.class);
        NormalPageProtocol pageProtocol = (NormalPageProtocol)response.getData();
        List<LinkedHashMap<String, String>> linkedHashMapList = pageProtocol.getData();
        for(LinkedHashMap<String, String> linkedHashMap : linkedHashMapList){
            Object orderItems = linkedHashMap.get("orderItems");
            List<LinkedHashMap<String, String>> orderItemList =  (List<LinkedHashMap<String, String>>)orderItems;
            for(LinkedHashMap<String, String> orderItem : orderItemList){
                orderItem.put("picture", fileResolver.getWebUrl(orderItem.get("fileId"), "100X100"));
            }
        }
        return handleResponse(response);
    }

    /**
     * 查询该会员各订单状态的数量
     * @param weChatCurrentUserProtocol
     * @return
     */
    @RequestMapping(value = "/findOrderCountByType",method = RequestMethod.GET)
    public Object findOrderCountByType(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol){
        String requestUrl = getServicePath() + "wap/order/findOrderCountByState?memberId={memberId}&chainId={chainId}";
        CrmResponse response = restTemplate.getForObject(requestUrl, CrmResponse.class,weChatCurrentUserProtocol.getMemberId(),weChatCurrentUserProtocol.getChainId());
        return handleResponse(response);
    }

    /**
     * 取消订单
     * @param weChatCurrentUserProtocol
     * @return
     */
    @RequestMapping(value = "/cancelOrder",method = RequestMethod.GET)
    public Object cancelOrder(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, Long orderId, String closeReason) {
        String requestUrl = getServicePath() + "wap/order/updateCancelOrder?memberId={memberId}&orderId={orderId}&closeReason={closeReason}";
        CrmResponse response = restTemplate.getForObject(requestUrl, CrmResponse.class, weChatCurrentUserProtocol.getMemberId(), orderId, closeReason);
        return handleResponse(response);
    }

    /**
     * 催单
     * @param weChatCurrentUserProtocol
     * @return
     */
    @RequestMapping(value = "/reminderOrder",method = RequestMethod.GET)
    public Object reminderOrder(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,Long orderId){
        String requestUrl = getServicePath() + "wap/order/updateReminder?memberId={memberId}&orderId={orderId}";
        CrmResponse response = restTemplate.getForObject(requestUrl, CrmResponse.class,weChatCurrentUserProtocol.getMemberId(),orderId);
        return handleResponse(response);
    }

    /**
     * 确认订单已送达
     * @param weChatCurrentUserProtocol
     * @return
     */
    @RequestMapping(value = "/confirmArriveOrder",method = RequestMethod.GET)
    public Object confirmArriveOrder(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,Long orderId){
        String requestUrl = getServicePath() + "wap/order/updateConfirmArrive?memberId={memberId}&orderId={orderId}";
        CrmResponse response = restTemplate.getForObject(requestUrl, CrmResponse.class,weChatCurrentUserProtocol.getMemberId(),orderId);
        return handleResponse(response);
    }
    /**
     * 订单详情
     * @param weChatCurrentUserProtocol
     * @return
     */
    @RequestMapping(value = "/findOrderDetail",method = RequestMethod.GET)
    public Object findOrderDetail(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,Long orderId){
        String requestUrl = getServicePath() + "wap/order/findOrderDetail?memberId={memberId}&orderId={orderId}";
        CrmResponse response = restTemplate.getForObject(requestUrl, CrmResponse.class,weChatCurrentUserProtocol.getMemberId(),orderId);
        WapOrderDetailProtocol orderDetail = (WapOrderDetailProtocol) response.getData();
        for(WapOrderItemProtocol orderItem : orderDetail.getOrderItemProtocols()){
            orderItem.setPicture(fileResolver.getWebUrl(orderItem.getFileId(), "60X60"));
        }
        return handleResponse(response);
    }
    /**
     * 查询订单状态
     * @param weChatCurrentUserProtocol
     * @return
     */
    @RequestMapping(value = "/findOrderStatus",method = RequestMethod.GET)
    public Object findOrderStatus(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,Long orderId){
        String requestUrl = getServicePath() + "wap/order/findOrderStatus?memberId={memberId}&orderId={orderId}";
        CrmResponse response = restTemplate.getForObject(requestUrl, CrmResponse.class,weChatCurrentUserProtocol.getMemberId(),orderId);

        return handleResponse(response);
    }

}
