package com.imall.crm.web.wechat;

import com.imall.crm.commons.dicts.OrderTypeEnum;
import com.imall.crm.commons.utils.IpAddressUtils;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.log4j.Logger;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * @author chencheng
 * @date 2018/3/26
 * 微信支付
 */
@Controller
@RequestMapping("/wxpay")
public class WeChatPayController extends BaseController {
    private static final Logger logger = Logger.getLogger(WeChatPayController.class);

    /**
     * 发起微信支付
     */
    @RequestMapping(value = "/initPay")
    @ResponseBody
    public Object initPay(HttpServletRequest request, @WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, String orderType, String orderIds) {
        CrmResponse crmResponse = restTemplate.getForObject(
                getServicePath() + "/wxpay/initPay?chainId={chainId}&memberId={memberId}&orderType={orderType}&orderIds={orderIds}&payUserIp={payUserIp}&openid={openid}", CrmResponse.class,
                weChatCurrentUserProtocol.getChainId(), weChatCurrentUserProtocol.getMemberId(), orderType, orderIds,  IpAddressUtils.getIpAddress(request), weChatCurrentUserProtocol.getOpenId());
        return handleResponse(crmResponse);
    }

    /**
     * 微信支付回调
     */
    @RequestMapping(value = "/payCallback/{clearingDocumentNum}")
    public void processPayCallback(HttpServletRequest request, HttpServletResponse response, @PathVariable("clearingDocumentNum") String clearingDocumentNum) throws IOException {
        String xml = getPostData(request);
        logger.info("WeChatPayController》processPayCallback》微信支付回调，xml="+xml);
        LinkedMultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();
        multiValueMap.add("xml", xml);
        HttpHeaders httpHeaders = new HttpHeaders();
        //postForObject时，如果目标接口没有使@RequestBody，则需要手动设置ContentType为普通表单方式
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<LinkedMultiValueMap<String, String>> entity = new HttpEntity<>(multiValueMap, httpHeaders);

        CrmResponse crmResponse = restTemplate.postForObject(getServicePath() + "/wxpay/payCallback/" + clearingDocumentNum, entity, CrmResponse.class);
        logger.info("WeChatPayController》processPayCallback》回复微信="+crmResponse.getData());
        PrintWriter writer = response.getWriter();
        writer.print(crmResponse.getData());
        writer.close();
    }


    /**
     * 微信退款回调
     */
    @RequestMapping(value = "/refundCallback/{refundOrderNum}")
    public void refundCallback(HttpServletRequest request, HttpServletResponse response, @PathVariable("refundOrderNum") String refundOrderNum) throws IOException {
        String xml = getPostData(request);
        logger.info("WeChatPayController》refundCallback》微信退款回调，xml="+xml);
        LinkedMultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();
        multiValueMap.add("xml", xml);
        HttpHeaders httpHeaders = new HttpHeaders();
        //postForObject时，如果目标接口没有使@RequestBody，则需要手动设置ContentType为普通表单方式
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<LinkedMultiValueMap<String, String>> entity = new HttpEntity<>(multiValueMap, httpHeaders);

        CrmResponse crmResponse = restTemplate.postForObject(getServicePath() + "/wxpay/refundCallback/" + refundOrderNum, entity, CrmResponse.class);
        logger.info("WeChatPayController》refundCallback》回复微信="+crmResponse.getData());
        PrintWriter writer = response.getWriter();
        writer.print(crmResponse.getData());
        writer.close();
    }



    /**
     *  发起微信储值支付
     * @param money  金额
     */
    @RequestMapping(value = "/initStoreValuePay")
    @ResponseBody
    public Object initStoreValuePay(HttpServletRequest request, @WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, Double money) {
        CrmResponse crmResponse = restTemplate.getForObject(
                getServicePath() + "/wxpay/initStoreValuePay?chainId={chainId}&memberId={memberId}&orderType={orderType}&money={money}&payUserIp={payUserIp}&openid={openid}", CrmResponse.class,
                weChatCurrentUserProtocol.getChainId(), weChatCurrentUserProtocol.getMemberId(), OrderTypeEnum.STORE_VALUE.toCode(), money,  IpAddressUtils.getIpAddress(request), weChatCurrentUserProtocol.getOpenId());
        return handleResponse(crmResponse);
    }


}
