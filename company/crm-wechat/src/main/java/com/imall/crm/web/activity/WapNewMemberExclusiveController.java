package com.imall.crm.web.activity;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.activity.protocol.wap.WapNewMemberExclusiveInitProtocol;
import com.imall.crm.module.activity.protocol.wap.WapNewMemberExclusiveProductProtocol;
import com.imall.crm.module.activity.protocol.wap.WapNewMemberExclusiveProtocol;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * 新会员专题活动
 *
 * @author kwy
 * @date 2018/12/6
 */
@RestController
@RequestMapping("/wap/newMemberExclusive")
public class WapNewMemberExclusiveController extends BaseController {
    private static final Logger logger = Logger.getLogger(WapNewMemberExclusiveController.class);

    @Autowired
    private FileResolver fileResolver;

    @GetMapping("/getNewMemberExclusiveInitData")
    public Object getNewMemberExclusiveInitData(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol) {
        List<String> couponCodeList = new ArrayList<>();
        couponCodeList.add("104192");
        couponCodeList.add("838930");
        couponCodeList.add("383793");
        couponCodeList.add("364427");
        couponCodeList.add("107316");
        couponCodeList.add("472267");
        couponCodeList.add("513452");
        couponCodeList.add("607222");

        List<String> discountProductCodeList = new ArrayList<>();
        // 鹰派花旗参
        discountProductCodeList.add("32764");
        // 生和堂龟苓膏（红豆味）
        discountProductCodeList.add("31809");
        // 隆力奇 蛇油护手霜50g
        discountProductCodeList.add("27734");
        // 维达手帕纸（自然无香）
        discountProductCodeList.add("15742");
        // 隆力奇维生素E滋养润唇膏（柠檬味）4.5g
        discountProductCodeList.add("33086");
        // 爱上爱 避孕套（爽）12只
        discountProductCodeList.add("27411");
        // 星群 板蓝根颗粒 20袋
        discountProductCodeList.add("26447");
        // 香雪 抗病毒口服液 18支
        discountProductCodeList.add("26246");
        // 滴露洗手液（滋润倍护）500g
        discountProductCodeList.add("31486");

        WapNewMemberExclusiveInitProtocol protocol = new WapNewMemberExclusiveInitProtocol();
        protocol.setShopId((weChatCurrentUserProtocol.getShopId() == null || weChatCurrentUserProtocol.getShopId() == 0) ? 1 : weChatCurrentUserProtocol.getShopId());
        protocol.setChainId(weChatCurrentUserProtocol.getChainId());
        protocol.setCouponCodeList(couponCodeList);
        protocol.setDiscountProductCodeList(discountProductCodeList);

        String url = getServicePath() + "/wap/newMemberExclusive/getNewMemberExclusiveInitData";
        CrmResponse crmResponse = restTemplate.postForObject(url, protocol, CrmResponse.class);
        if (crmResponse.isHasException() || crmResponse.getData() == null) {
            return handleResponse(crmResponse);
        }

        WapNewMemberExclusiveProtocol wapNewMemberExclusiveInitProtocol = (WapNewMemberExclusiveProtocol) crmResponse.getData();
        LinkedList<WapNewMemberExclusiveProductProtocol> discountProductList = wapNewMemberExclusiveInitProtocol.getDiscountProductList();
        for (int i = 0; i < discountProductList.size(); i++) {
            WapNewMemberExclusiveProductProtocol wapNewMemberExclusiveProductProtocol = discountProductList.get(i);
            if ("32764".equals(wapNewMemberExclusiveProductProtocol.getProductCode())) {
                WapNewMemberExclusiveProductProtocol temp = wapNewMemberExclusiveProductProtocol;
                discountProductList.remove(i);
                discountProductList.addFirst(temp);
                wapNewMemberExclusiveProductProtocol.setCouponBeforePrice(10.0);
                wapNewMemberExclusiveProductProtocol.setCouponAfterPrice(0.0);
            }
            if ("31809".equals(wapNewMemberExclusiveProductProtocol.getProductCode())) {
                wapNewMemberExclusiveProductProtocol.setCouponBeforePrice(4.0);
                wapNewMemberExclusiveProductProtocol.setCouponAfterPrice(1.0);
            }
            if ("27734".equals(wapNewMemberExclusiveProductProtocol.getProductCode())) {
                wapNewMemberExclusiveProductProtocol.setCouponBeforePrice(4.8);
                wapNewMemberExclusiveProductProtocol.setCouponAfterPrice(1.0);
            }
            if ("15742".equals(wapNewMemberExclusiveProductProtocol.getProductCode())) {
                wapNewMemberExclusiveProductProtocol.setCouponBeforePrice(6.2);
                wapNewMemberExclusiveProductProtocol.setCouponAfterPrice(3.9);
            }
            if ("33086".equals(wapNewMemberExclusiveProductProtocol.getProductCode())) {
                wapNewMemberExclusiveProductProtocol.setCouponBeforePrice(18.0);
                wapNewMemberExclusiveProductProtocol.setCouponAfterPrice(9.9);
            }
            if ("27411".equals(wapNewMemberExclusiveProductProtocol.getProductCode())) {
                wapNewMemberExclusiveProductProtocol.setCouponBeforePrice(26.9);
                wapNewMemberExclusiveProductProtocol.setCouponAfterPrice(9.9);
            }
            if ("26447".equals(wapNewMemberExclusiveProductProtocol.getProductCode())) {
                wapNewMemberExclusiveProductProtocol.setCouponBeforePrice(19.0);
                wapNewMemberExclusiveProductProtocol.setCouponAfterPrice(9.9);
            }
            if ("26246".equals(wapNewMemberExclusiveProductProtocol.getProductCode())) {
                wapNewMemberExclusiveProductProtocol.setCouponBeforePrice(36.0);
                wapNewMemberExclusiveProductProtocol.setCouponAfterPrice(19.9);
            }
            if ("31486".equals(wapNewMemberExclusiveProductProtocol.getProductCode())) {
                wapNewMemberExclusiveProductProtocol.setCouponBeforePrice(26.9);
                wapNewMemberExclusiveProductProtocol.setCouponAfterPrice(23.9);
            }
            wapNewMemberExclusiveProductProtocol.setPictureUrl(fileResolver.getWebUrl(wapNewMemberExclusiveProductProtocol.getPicture(), "160X160"));
        }

        return handleResponse(crmResponse);
    }
}
