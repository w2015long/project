package com.imall.crm.web.activity;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.activity.protocol.wap.WapDoubleTwelveInitProtocol;
import com.imall.crm.module.activity.protocol.wap.WapDoubleTwelveProductProtocol;
import com.imall.crm.module.activity.protocol.wap.WapDoubleTwelveProtocol;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
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
 *
 * @author kwy
 * @date 2018/12/6 11:26
 */
@RestController
@RequestMapping("/wap/doubleTwelve")
public class WapDoubleTwelveController extends BaseController {
    private static final Logger logger = Logger.getLogger(WapDoubleTwelveController.class);

    @Autowired
    private FileResolver fileResolver;

    @GetMapping("/getDoubleTwelveInitData")
    public Object getDoubleTwelveInitData(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol) {
        // 秒杀商品Id 限购一件
        List<String> secondKillProductCodeList = new ArrayList<>();
        secondKillProductCodeList.add("27057");
        // 换购商品 限购五件
        List<String> redemptionProductCodeList = new ArrayList<>();
        redemptionProductCodeList.add("16509");
        // 精选尖货 限购五件
        List<String> discountProductCodeList = new ArrayList<>();
        discountProductCodeList.add("4049");
        discountProductCodeList.add("9372");
        discountProductCodeList.add("2420");
        discountProductCodeList.add("27702");
        discountProductCodeList.add("32833");
        discountProductCodeList.add("26596");
        discountProductCodeList.add("3422");
        discountProductCodeList.add("5344");
        discountProductCodeList.add("28753");
        discountProductCodeList.add("33056");
        discountProductCodeList.add("1960");
        discountProductCodeList.add("15738");
        discountProductCodeList.add("28207");
        discountProductCodeList.add("3455");
        discountProductCodeList.add("12518");

        WapDoubleTwelveInitProtocol protocol = new WapDoubleTwelveInitProtocol();
        protocol.setShopId(weChatCurrentUserProtocol.getShopId());
        protocol.setChainId(weChatCurrentUserProtocol.getChainId());
        protocol.setSecondKillProductCodeList(secondKillProductCodeList);
        protocol.setRedemptionProductCodeList(redemptionProductCodeList);
        protocol.setDiscountProductCodeList(discountProductCodeList);

        String url = getServicePath() + "/wap/doubleTwelve/getDoubleTwelveInitData";
        CrmResponse crmResponse = restTemplate.postForObject(url, protocol, CrmResponse.class);
        if (crmResponse.isHasException() || crmResponse.getData() == null) {
            return handleResponse(crmResponse);
        }

        WapDoubleTwelveProtocol wapDoubleTwelveInitProtocol = (WapDoubleTwelveProtocol) crmResponse.getData();
        for (WapDoubleTwelveProductProtocol wapDoubleTwelveProductProtocol : wapDoubleTwelveInitProtocol.getDiscountProductList()) {
            wapDoubleTwelveProductProtocol.setPictureUrl(fileResolver.getWebUrl(wapDoubleTwelveProductProtocol.getPicture(), "160X160"));
        }
        for (WapDoubleTwelveProductProtocol wapDoubleTwelveProductProtocol : wapDoubleTwelveInitProtocol.getDiscountProductList()) {
            wapDoubleTwelveProductProtocol.setPictureUrl(fileResolver.getWebUrl(wapDoubleTwelveProductProtocol.getPicture(), "160X160"));
        }
        for (WapDoubleTwelveProductProtocol wapDoubleTwelveProductProtocol : wapDoubleTwelveInitProtocol.getDiscountProductList()) {
            wapDoubleTwelveProductProtocol.setPictureUrl(fileResolver.getWebUrl(wapDoubleTwelveProductProtocol.getPicture(), "160X160"));
        }

        return handleResponse(crmResponse);
    }
}
