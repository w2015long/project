package com.imall.crm.web.sales;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.sales.protocol.wap.WapFullReductionProductProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @author lcl
 * @date 2018/12/27  15:44
 */
@Controller
@RequestMapping("/wap/fullReduction")
public class WapFullReductionController extends BaseController {
    @Autowired
    private FileResolver fileResolver;

    /**
     * 查询 满立减参与活动商品列表
     */
    @RequestMapping(value = "/findFullReductionProduct",method = RequestMethod.GET)
    @ResponseBody
    public Object findFullReductionProduct(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long fullReductionActivityId, HttpServletResponse response) throws IOException {
        String url = getServicePath() + "/wap/fullReduction/findFullReductionProduct?chainId={chainId}&fullReductionActivityId={fullReductionActivityId}&shopId={shopId}";
        CrmResponse crmResponse = restTemplate.getForObject(url,CrmResponse.class,currentUser.getChainId(),fullReductionActivityId,currentUser.getShopId());
        if (crmResponse.isHasException()) {
            return handleResponse(crmResponse);
        }
        if(null != crmResponse.getData()){
            Map<String,Object> map = (Map<String, Object>) crmResponse.getData();
            List<WapFullReductionProductProtocol> fullProductComment = (List<WapFullReductionProductProtocol>) map.get("fullProductComment");
            List<LinkedHashMap<String, String>> linkedHashMapList = (List<LinkedHashMap<String, String>>) map.get("fullProductComment");
            for(LinkedHashMap<String, String> orderItem : linkedHashMapList){
                if(null != orderItem.get("picture")){
                    orderItem.put("picture",fileResolver.getWebUrl(orderItem.get("picture"), "250X250"));
                }
            }
        }
        return handleResponse(crmResponse);
    }

}
