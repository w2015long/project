package com.imall.crm.web.member;

import com.imall.crm.commons.dicts.BooleTypeEnum;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.ReceiverAddrProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by frt on 2018/4/2.
 */
@RestController
@RequestMapping(value = "/wap/receiverAddr")
public class WapReceiverAddrController extends BaseController{

    /**
     * 获取会员收货地址
     * @param currentUser                   当前会员
     * @param needJudgeDistributionRange    是否需要判断配送范围，是：Y，否：N
     * @return
     */
    @RequestMapping(value = "/listReceiverAddr", method = RequestMethod.GET)
    public Object listReceiverAddr(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String needJudgeDistributionRange){
        String url;
        List<Object> params = new ArrayList<>();
        //需要判断配送范围
        if(BooleTypeEnum.Y==BooleTypeEnum.fromCode(needJudgeDistributionRange)){
            url = getServicePath() + "/wap/receiverAddr/listReceiverAddr?memberId={memberId}&shopId={shopId}&chainId={chainId}";
            params.add(currentUser.getMemberId());
            params.add(currentUser.getShopId());
            params.add(currentUser.getChainId());
        }else{
            params.add(currentUser.getMemberId());
            url = getServicePath() + "/wap/receiverAddr/listReceiverAddrByMemberId?memberId={memberId}";
        }

        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, params.toArray()));
    }

    @RequestMapping(value = "/getMemberDefaultAddr", method = RequestMethod.GET)
    public Object getMemberDefaultAddr(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String requestUrl = getServicePath() + "/wap/receiverAddr/getMemberDefaultAddr?memberId={memberId}";
        return handleResponse(restTemplate.getForObject(requestUrl, CrmResponse.class, currentUser.getMemberId()));
    }

    /**
     * 添加或修改收货地址
     */
    @RequestMapping(value="/saveOrUpdateReceiverAddress",method =RequestMethod.POST)
    public Object saveOrUpdateReceiverAddress(@RequestBody ReceiverAddrProtocol receiverAddrProtocol, @WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        ReceiverAddrProtocol protocol = new ReceiverAddrProtocol();
        BeanUtils.copyProperties(receiverAddrProtocol, protocol);
        protocol.setMemberId(currentUser.getMemberId());
        String requestUrl = getServicePath() + "/wap/receiverAddr/saveOrUpdateReceiverAddress";
        CrmResponse crmResponse = restTemplate.postForObject(requestUrl, protocol, CrmResponse.class);
        return handleResponse(crmResponse);
    }

    /**
     * 获取用户收货地址列表
     */
    @RequestMapping(value="/findReceiverAddressList",method=RequestMethod.GET)
    public Object findReceiverAddressList(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String requestUrl = getServicePath() + "/wap/receiverAddr/findReceiverAddressList?memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class,currentUser.getMemberId());
        return handleResponse(crmResponse);
    }

    /**
     * 地址详情页
     */
    @RequestMapping(value="/findReceiverAddressDetail",method=RequestMethod.GET)
    public Object findReceiverAddressDetail(Long receiverId){
        String requestUrl = getServicePath() + "/wap/receiverAddr/findReceiverAddressDetail?receiverId={receiverId}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class,receiverId);
        return handleResponse(crmResponse);
    }

    /**
     * 删除收货地址
     */
    @RequestMapping(value="/deleteReceiverAddress",method=RequestMethod.GET)
    public Object deleteReceiverAddress(Long receiverId){
        String requestUrl = getServicePath() + "/wap/receiverAddr/deleteReceiverAddress?receiverId={receiverId}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class,receiverId);
        return handleResponse(crmResponse);
    }

    /**
     * 找出详细地址
     */
    @RequestMapping(value="/findDetailedAddress",method=RequestMethod.GET)
    public Object findDetailedAddress(String mapLocation){
        String requestUrl = getServicePath() + "/wap/shop/findDetailedAddress?mapLocation={mapLocation}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class,mapLocation);
        return handleResponse(crmResponse);
    }
}
