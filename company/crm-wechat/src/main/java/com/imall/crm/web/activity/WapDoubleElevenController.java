package com.imall.crm.web.activity;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.module.activity.protocol.wap.WapDoubleElevenInitProtocol;
import com.imall.crm.module.activity.protocol.wap.WapDoubleElevenProductProtocol;
import com.imall.crm.module.activity.protocol.wap.WapDoubleElevenProtocol;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.web.base.BaseController;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * 双十一活动
 * @author frt
 * @date 2018/11/9 11:26
 */
@RestController
@RequestMapping("/wap/doubleEleven")
public class WapDoubleElevenController extends BaseController {
    private static final Logger logger = Logger.getLogger(WapDoubleElevenController.class);
    private static final Long JIN_KANG_CHE_BEI_SHOP_ID = 1L;
    @Autowired
    private FileResolver fileResolver;

    @GetMapping("/getDoubleElevenInitData")
    public Object getDoubleElevenInitData() {
        List<String> discountProductCodeList = new ArrayList<>();
        discountProductCodeList.add("5344");
        discountProductCodeList.add("29743");

        List<String> secondKillProductCodeList = new ArrayList<>();
        secondKillProductCodeList.add("1776");
        secondKillProductCodeList.add("1582");
        secondKillProductCodeList.add("2382");
        secondKillProductCodeList.add("4049");
        secondKillProductCodeList.add("5327");
        secondKillProductCodeList.add("2420");
        secondKillProductCodeList.add("26246");
        secondKillProductCodeList.add("3236");
        secondKillProductCodeList.add("3962");
        secondKillProductCodeList.add("4251");
        secondKillProductCodeList.add("4983");
        secondKillProductCodeList.add("1960");

        WapDoubleElevenInitProtocol protocol = new WapDoubleElevenInitProtocol();
        protocol.setShopId(JIN_KANG_CHE_BEI_SHOP_ID);
        protocol.setDiscountProductCodeList(discountProductCodeList);
        protocol.setSecondKillProductCodeList(secondKillProductCodeList);

        String url = getServicePath() + "/wap/doubleEleven/getDoubleElevenInitData";
        CrmResponse crmResponse = restTemplate.postForObject(url, protocol, CrmResponse.class);
        if(crmResponse.isHasException() || crmResponse.getData()==null){
            return handleResponse(crmResponse);
        }

        WapDoubleElevenProtocol wapDoubleElevenProtocol = (WapDoubleElevenProtocol)crmResponse.getData();
        for(WapDoubleElevenProductProtocol wapDoubleElevenProductProtocol : wapDoubleElevenProtocol.getDiscountProductList()){
            wapDoubleElevenProductProtocol.setPictureUrl(fileResolver.getWebUrl(wapDoubleElevenProductProtocol.getPicture(), "160X160"));
        }

        for(WapDoubleElevenProductProtocol wapDoubleElevenProductProtocol : wapDoubleElevenProtocol.getSecondKillProductList()){
            wapDoubleElevenProductProtocol.setPictureUrl(fileResolver.getWebUrl(wapDoubleElevenProductProtocol.getPicture(), "160X160"));
        }

        return handleResponse(crmResponse);
    }
}
