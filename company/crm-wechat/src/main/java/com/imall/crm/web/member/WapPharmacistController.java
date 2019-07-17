package com.imall.crm.web.member;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.commons.base.protocol.NormalPageProtocol;
import com.imall.crm.module.platform.protocol.wap.WapPharmacistSearchProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.log4j.Logger;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.LinkedHashMap;
import java.util.List;

/**
 * 药师咨询(wap端)
 *
 * @author wsh
 * @date 2018/3/20
 */
@Controller
@RequestMapping("/wap/pharmacist")
public class WapPharmacistController extends BaseController {
    @Autowired
    private FileResolver fileResolver;

    private Logger logger = Logger.getLogger(WapPharmacistController.class);

    @RequestMapping(value = "/pageWapPharmacist", method = RequestMethod.GET)
    @ResponseBody
    public Object pageWapPharmacist(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, WapPharmacistSearchProtocol wapPharmacistSearchProtocol) {
        WapPharmacistSearchProtocol pharmacistSearchProtocol = new WapPharmacistSearchProtocol();
        BeanUtils.copyProperties(wapPharmacistSearchProtocol, pharmacistSearchProtocol);
        pharmacistSearchProtocol.setChainId(weChatCurrentUserProtocol.getChainId());
        pharmacistSearchProtocol.setShopId(weChatCurrentUserProtocol.getShopId());
        String requestUrl = getServicePath() + "/wap/pharmacist/pageWapPharmacist";
        CrmResponse crmResponse = restTemplate.postForObject(requestUrl, pharmacistSearchProtocol, CrmResponse.class);
        NormalPageProtocol pageProtocol = (NormalPageProtocol) crmResponse.getData();
        List<LinkedHashMap<String, String>> linkedHashMapList = pageProtocol.getData();
        for (LinkedHashMap<String, String> linkedHashMap : linkedHashMapList) {
            linkedHashMap.put("url", fileResolver.getWebUrl(linkedHashMap.get("iconFileId")));
        }
        return handleResponse(crmResponse);
    }

}
