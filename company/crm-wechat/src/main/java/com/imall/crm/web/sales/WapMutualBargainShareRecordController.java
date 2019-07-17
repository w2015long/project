package com.imall.crm.web.sales;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.ErrorCode;
import com.imall.crm.module.commons.base.protocol.BusinessException;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.commons.base.protocol.NormalPageProtocol;
import com.imall.crm.module.sales.protocol.wap.WapMutualBargainShareRecordSaveProtocol;
import com.imall.crm.module.sales.protocol.wap.WapMutualBargainShareRecordSearchProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;

/**
 * 互助砍价分享者记录
 * Created by liezihao on 2018/12/27
 */

@RestController
@RequestMapping("/wap/mutualBargainShareRecord")
public class WapMutualBargainShareRecordController extends BaseController{


    @Autowired
    private FileResolver fileResolver;

    /**
     * 微店 获取 该会员参加互助砍价活动
     */
    @PostMapping(value = "/pageMutualBargainShareRecord")
    public Object pageMutualBargainShareRecord(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,@RequestBody WapMutualBargainShareRecordSearchProtocol wapMutualBargainActivitySearchProtocol){
        wapMutualBargainActivitySearchProtocol.setChainId(weChatCurrentUserProtocol.getChainId());
        wapMutualBargainActivitySearchProtocol.setMemberId(weChatCurrentUserProtocol.getMemberId());

        String requestUrl = getServicePath() + "wap/mutualBargainShareRecord/pageMutualBargainShareRecord";
        CrmResponse response = restTemplate.postForObject(requestUrl, wapMutualBargainActivitySearchProtocol, CrmResponse.class);
        if (response.isHasException()) {
            return handleResponse(response);
        }
        NormalPageProtocol pageProtocol = (NormalPageProtocol)response.getData();
        List<LinkedHashMap<String, String>> linkedHashMapList = (List<LinkedHashMap<String, String>>)pageProtocol.getData();
        for(LinkedHashMap<String, String> linkedHashMap : linkedHashMapList){
            if(StringUtils.isBlank(linkedHashMap.get("productMainPic"))){
                continue;
            }
            String productMainPic = linkedHashMap.get("productMainPic");
            if(StringUtils.isNotBlank(productMainPic)){
                linkedHashMap.put("productMainPicUrl", fileResolver.getWebUrl(productMainPic, "220X220"));
            }else {
                linkedHashMap.put("productMainPicUrl", null);
            }
        }
        return handleResponse(response);
    }


    /**
     * 微店 获取 该会员参加互助砍价活动
     * @param mutualBargainActivityId 互助砍价活动ID
     * @param activityProductId 活动商品ID
     */
    @GetMapping(value = "/saveMutualBargainShareRecord")
    public Object saveMutualBargainShareRecord(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,Long mutualBargainActivityId, Long activityProductId){
        if(weChatCurrentUserProtocol.getMemberId() == null){
            return handleResponse( ErrorCode.SYS_USER_NOT_LOGIN.getCode());
        }
        WapMutualBargainShareRecordSaveProtocol wapMutualBargainShareRecordSaveProtocol = new  WapMutualBargainShareRecordSaveProtocol();
        wapMutualBargainShareRecordSaveProtocol.setChainId(weChatCurrentUserProtocol.getChainId());
        wapMutualBargainShareRecordSaveProtocol.setMemberId(weChatCurrentUserProtocol.getMemberId());
        wapMutualBargainShareRecordSaveProtocol.setMutualBargainActivityId(mutualBargainActivityId);
        wapMutualBargainShareRecordSaveProtocol.setActivityProductId(activityProductId);
        String requestUrl = getServicePath() + "wap/mutualBargainShareRecord/saveMutualBargainShareRecord";
        CrmResponse response = restTemplate.postForObject(requestUrl, wapMutualBargainShareRecordSaveProtocol, CrmResponse.class);
        return handleResponse(response);
    }


}
