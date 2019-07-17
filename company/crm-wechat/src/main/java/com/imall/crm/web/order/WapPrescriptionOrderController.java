package com.imall.crm.web.order;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.commons.base.protocol.NormalPageProtocol;
import com.imall.crm.module.wechat.protocol.PrescriptionOrderSearchProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.module.wechat.protocol.wap.WapPrescriptionOrderDetailProtocol;
import com.imall.crm.module.wechat.protocol.wap.WapPrescriptionOrderSaveProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;

/**
 * Created by zzl on 2018/3/21.
 */
@RestController
@RequestMapping("/wap/prescriptionOrder")
public class WapPrescriptionOrderController extends BaseController {

    @Autowired
    private FileResolver fileResolver;

    @ResponseBody
    @RequestMapping(value = "/pagePrescriptionOrder", method = {RequestMethod.POST,RequestMethod.GET})
    public Object pagePrescriptionOrder(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, PrescriptionOrderSearchProtocol tempPrescriptionOrderSearchProtocol) {
        PrescriptionOrderSearchProtocol searchProtocol = new PrescriptionOrderSearchProtocol();
        BeanUtils.copyProperties(tempPrescriptionOrderSearchProtocol, searchProtocol);
        BeanUtils.copyProperties(weChatCurrentUserProtocol, searchProtocol);
        searchProtocol.setChainId(weChatCurrentUserProtocol.getChainId());
        searchProtocol.setShopId(weChatCurrentUserProtocol.getShopId());
        String url = getServicePath() + "wap/prescriptionOrder/pagePrescriptionOrder";
        CrmResponse crmResponse = restTemplate.postForObject(url, searchProtocol, CrmResponse.class);
        NormalPageProtocol pageProtocol = (NormalPageProtocol) crmResponse.getData();
        List<LinkedHashMap<String, String>> linkedHashMapList = (List<LinkedHashMap<String, String>>) pageProtocol.getData();
        for (LinkedHashMap<String, String> linkedHashMap : linkedHashMapList) {
            String prescriptionPic2 = linkedHashMap.get("prescriptionPic2");
            String prescriptionPic1 = linkedHashMap.get("prescriptionPic1");
            String prescriptionPic3 = linkedHashMap.get("prescriptionPic3");
            if (StringUtils.isNotBlank(prescriptionPic1)) {
                linkedHashMap.put("prescriptionPic1", fileResolver.getWebUrl(prescriptionPic1));
            }
            if (StringUtils.isNotBlank(prescriptionPic2)) {
                linkedHashMap.put("prescriptionPic2", fileResolver.getWebUrl(prescriptionPic2));
            }
            if (StringUtils.isNotBlank(prescriptionPic3)) {
                linkedHashMap.put("prescriptionPic3", fileResolver.getWebUrl(prescriptionPic3));
            }
        }
        return handleResponse(crmResponse);
    }

    @ResponseBody
    @RequestMapping(value = "/getOrderStateNum", method = RequestMethod.GET)
    public Object getOrderStateNum(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol) {
        String countUrl = getServicePath() + "wap/prescriptionOrder/countMemberOrderStateNum?chainId={chainId}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(countUrl, CrmResponse.class, weChatCurrentUserProtocol.getChainId(), weChatCurrentUserProtocol.getMemberId());
        return handleResponse(crmResponse);
    }

    @ResponseBody
    @RequestMapping(value = "/findLogisticsDetail", method = RequestMethod.GET)
    public Object findLogisticsDetail(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, String logisticCode, String shipperCode) {
        String url = getServicePath() + "logistics/findLogistics?chainId={chainId}&shipperCode={shipperCode}&logisticCode={logisticCode}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, weChatCurrentUserProtocol.getChainId(), shipperCode, logisticCode));
    }

    @ResponseBody
    @RequestMapping(value = "/findPrescriptionOrderDetail/{prescriptionOrderId}")
    public Object findPrescriptionOrderDetail(@PathVariable("prescriptionOrderId") Long prescriptionOrderId, @WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol) {
        String url = getServicePath() + "wap/prescriptionOrder/findPrescriptionOrderDetail?prescriptionOrderId=" + prescriptionOrderId + "&chainId=" + weChatCurrentUserProtocol.getChainId();
        CrmResponse crmResponse = restTemplate.getForEntity(url, CrmResponse.class).getBody();
        WapPrescriptionOrderDetailProtocol prescriptionOrderProtocol = (WapPrescriptionOrderDetailProtocol) crmResponse.getData();
        if (StringUtils.isNotBlank(prescriptionOrderProtocol.getPrescriptionPic1())) {
            String prescriptionPic1 = fileResolver.getWebUrl(prescriptionOrderProtocol.getPrescriptionPic1());
            prescriptionOrderProtocol.setPrescriptionPic1Url(prescriptionPic1);
        }
        if (StringUtils.isNotBlank(prescriptionOrderProtocol.getPrescriptionPic2())) {
            String prescriptionPic2 = fileResolver.getWebUrl(prescriptionOrderProtocol.getPrescriptionPic2());
            prescriptionOrderProtocol.setPrescriptionPic2Url(prescriptionPic2);
        }
        if (StringUtils.isNotBlank(prescriptionOrderProtocol.getPrescriptionPic3())) {
            String prescriptionPic3 = fileResolver.getWebUrl(prescriptionOrderProtocol.getPrescriptionPic3());
            prescriptionOrderProtocol.setPrescriptionPic3Url(prescriptionPic3);
        }
        return handleResponse(crmResponse);
    }

    @ResponseBody
    @RequestMapping(value = "/savePrescriptionOrder", method = {RequestMethod.POST})
    public Object saveOrder(@RequestBody WapPrescriptionOrderSaveProtocol prescriptionOrderProtocol,@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol) {
        WapPrescriptionOrderSaveProtocol wapPrescriptionOrderSaveProtocol = new WapPrescriptionOrderSaveProtocol();
        BeanUtils.copyProperties(prescriptionOrderProtocol, wapPrescriptionOrderSaveProtocol);
        wapPrescriptionOrderSaveProtocol.setChainId(weChatCurrentUserProtocol.getChainId());
        wapPrescriptionOrderSaveProtocol.setShopId(weChatCurrentUserProtocol.getShopId());
        wapPrescriptionOrderSaveProtocol.setMemberId(weChatCurrentUserProtocol.getMemberId());
        String url = getServicePath() + "/wap/prescriptionOrder/savePrescriptionOrder";
        return handleResponse(restTemplate.postForObject(url, wapPrescriptionOrderSaveProtocol, CrmResponse.class));
    }

    /**
     * 获取代煎规则说明
     * @return
     */
    @RequestMapping(value = "/getDecoctionRuleDescription", method = {RequestMethod.GET})
    public Object getDecoctionRuleDescription(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol) {
        String requestUrl = getServicePath() + "wap/distributionSetting/findDistributionSetting?chainId={chainId}";
        return handleResponse( restTemplate.getForObject(requestUrl, CrmResponse.class,weChatCurrentUserProtocol.getChainId()));
    }

    @ResponseBody
    @RequestMapping(value = "/signOrder/{prescriptionOrderId}")
    public Object signOrder(@PathVariable("prescriptionOrderId") Long prescriptionOrderId) {
        String url = getServicePath() + "prescriptionOrder/signOrder?prescriptionOrderId={prescriptionOrderId}";
        return handleResponse(restTemplate.getForEntity(url, CrmResponse.class, prescriptionOrderId));
    }

    @ResponseBody
    @RequestMapping(value = "/findPrescriptionLogDetail/{prescriptionOrderId}")
    public Object findPrescriptionLogDetail(@PathVariable("prescriptionOrderId") Long prescriptionOrderId) {
        String url = getServicePath() + "wap/prescriptionOrder/findPrescriptionLogDetail?prescriptionOrderId=" + prescriptionOrderId;
        CrmResponse crmResponse = restTemplate.getForEntity(url, CrmResponse.class).getBody();
        return handleResponse(crmResponse);
    }

    @ResponseBody
    @RequestMapping(value = "/changeOrderState", method = RequestMethod.GET)
    private Object changeOrderState(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,Long prescriptionOrderId, String orderState) {
        String url = getServicePath() + "wap/prescriptionOrder/changeOrderState?prescriptionOrderId={prescriptionOrderId}&orderState={orderState}&chainId={chainId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, prescriptionOrderId, orderState, weChatCurrentUserProtocol.getChainId());
        return handleResponse(crmResponse);
    }

}
