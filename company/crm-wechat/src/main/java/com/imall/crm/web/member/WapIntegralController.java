package com.imall.crm.web.member;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.commons.base.protocol.PageProtocol;
import com.imall.crm.module.loyalty.protocol.AccountTransLogSearchProtocol;
import com.imall.crm.module.sales.protocol.IntegralProductSearchProtocol;
import com.imall.crm.module.sales.protocol.wap.WapIntegralOrderSaveProtocol;
import com.imall.crm.module.sales.protocol.wap.WapIntegralProductProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.LinkedHashMap;
import java.util.List;

/**
 * Created by zzl on 2018/3/23.
 */
@Controller
@RequestMapping("/wap/integral")
public class WapIntegralController extends BaseController{

    @Autowired
    private FileResolver fileResolver;
    /**
     * 获取积分交易记录
     */
    @ResponseBody
    @RequestMapping(value = "/pageAccountTransLog", method = {RequestMethod.POST})
    public Object pageAccountTransLog(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, AccountTransLogSearchProtocol accountTransLogSearchProtocol) {
        AccountTransLogSearchProtocol searchProtocol = new AccountTransLogSearchProtocol();
        BeanUtils.copyProperties(accountTransLogSearchProtocol, searchProtocol);
        BeanUtils.copyProperties(currentUser, searchProtocol);
        String url = getServicePath() + "wap/accountTransLog/pageAccountTransLog";
        CrmResponse crmResponse = restTemplate.postForObject(url, searchProtocol, CrmResponse.class);
        return handleResponse(crmResponse);
    }

    /**
     * 获取用户的积分
     * @param currentUser
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getMemberIntegral", method = {RequestMethod.GET})
    public Object getMemberIntegral(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String url = getServicePath() + "wap/member/findMemberIntegralByMemberId?memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getMemberId());
        return  handleResponse(crmResponse);
    }

    /**
     * 积分商品列表
     */
    @ResponseBody
    @RequestMapping(value = "/pageIntegralProduct", method = {RequestMethod.GET})
    public Object pageIntegralProduct(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser,IntegralProductSearchProtocol integralProductSearchProtocol){
        IntegralProductSearchProtocol searchProtocol = new IntegralProductSearchProtocol();
        BeanUtils.copyProperties(integralProductSearchProtocol,searchProtocol);
        searchProtocol.setChainId(currentUser.getChainId());
        String requestUrl = getServicePath() + "wap/integralProduct/pageIntegralProduct";
        CrmResponse response = restTemplate.postForObject(requestUrl, searchProtocol, CrmResponse.class);
        PageProtocol pageProtocol = (PageProtocol)response.getData();
        List<LinkedHashMap<String, String>> linkedHashMapList = pageProtocol.getData();
        for(LinkedHashMap<String, String> linkedHashMap : linkedHashMapList){
            linkedHashMap.put("picUrl", fileResolver.getWebUrl(linkedHashMap.get("fileId"), "220X220"));
        }
        return handleResponse(response);
    }

    /**
     * 积分商品详情
     */
    @ResponseBody
    @RequestMapping(value = "/getIntegralProductDetail", method = {RequestMethod.GET})
    public Object getIntegralProductDetail(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser,Long integralProductId){
        String requestUrl = getServicePath() + "wap/integralProduct/getIntegralProductDetail?chainId={chainId}&integralProductId={integralProductId}";
        CrmResponse<WapIntegralProductProtocol> response = restTemplate.getForObject(requestUrl, CrmResponse.class, currentUser.getChainId(), integralProductId);
        WapIntegralProductProtocol integralProductProtocol = response.getData();
        integralProductProtocol.setPicUrl(fileResolver.getWebUrl(integralProductProtocol.getFileId()));
        return handleResponse(response);
    }

    /**
     * 获取用户签到积分信息
     */
    @ResponseBody
    @RequestMapping(value="/findMemberSignInIntegralInfo",method = RequestMethod.GET)
    public Object findMemberSignIntegralInfo(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String url = getServicePath() + "/wap/member/findMemberSignInIntegralInfo?chainId={chainId}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId(), currentUser.getMemberId());
        return handleResponse(crmResponse);
    }

    /**
     * 签到
     */
    @ResponseBody
    @RequestMapping(value="/signIn",method =RequestMethod.GET)
    public Object memberSign(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String url = getServicePath() + "/wap/member/signIn?chainId={chainId}&memberId={memberId}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId(), currentUser.getMemberId()));
    }

    /**
     * 兑换积分礼品
     */
    @ResponseBody
    @RequestMapping(value="/exchangeIntegralProduct",method = RequestMethod.POST)
    public Object exchangeIntegralProduct(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapIntegralOrderSaveProtocol integralOrderSaveProtocolTemp){
        WapIntegralOrderSaveProtocol saveProtocol = new WapIntegralOrderSaveProtocol();
        BeanUtils.copyProperties(integralOrderSaveProtocolTemp, saveProtocol);
        saveProtocol.setChainId(currentUser.getChainId());
        saveProtocol.setMemberId(currentUser.getMemberId());
        String url = getServicePath() + "/wap/integralOrder/saveIntegralOrder";
        CrmResponse crmResponse = restTemplate.postForObject(url, saveProtocol, CrmResponse.class);
        return handleResponse(crmResponse);
    }

}
