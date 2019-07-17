package com.imall.crm.web.sales;

import com.imall.crm.commons.dicts.BooleTypeEnum;
import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.commons.base.protocol.NormalPageProtocol;
import com.imall.crm.module.sales.protocol.wap.WapMutualBargainActivityDetailProtocol;
import com.imall.crm.module.sales.protocol.wap.WapMutualBargainActivitySearchProtocol;
import com.imall.crm.module.sales.protocol.wap.WapMutualBargainHistoryRecordProtocol;
import com.imall.crm.module.sales.protocol.wap.WapMutualBargainShareRecordDetailProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;

/**
 * 互助砍价活动
 * Created by liezihao on 2018/12/27
 */

@RestController
@RequestMapping("/wap/mutualBargainActivity")
public class WapMutualBargainActivityController extends BaseController{


    @Autowired
    private FileResolver fileResolver;

    /**
     * 微店 获取 助力砍价活动
     */
    @PostMapping(value = "/pageMutualBargainActivity")
    public Object pageMutualBargainActivity(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,@RequestBody WapMutualBargainActivitySearchProtocol wapMutualBargainActivitySearchProtocol){
        wapMutualBargainActivitySearchProtocol.setChainId(weChatCurrentUserProtocol.getChainId());
        wapMutualBargainActivitySearchProtocol.setMemberId(weChatCurrentUserProtocol.getMemberId());

        String requestUrl = getServicePath() + "wap/mutualBargainActivity/pageMutualBargainActivity";
        CrmResponse response = restTemplate.postForObject(requestUrl, wapMutualBargainActivitySearchProtocol, CrmResponse.class);
        if (response.isHasException()) {
            return handleResponse(response);
        }
        NormalPageProtocol pageProtocol = (NormalPageProtocol)response.getData();
        List<LinkedHashMap<String, String>> linkedHashMapList = pageProtocol.getData();
        for(LinkedHashMap<String, String> linkedHashMap : linkedHashMapList){
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
     * 微店 获取 助力砍价活动
     */
    @GetMapping(value = "/getMutualBargainActivityDetail")
    public Object getMutualBargainActivityDetail(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,Long mutualBargainShareRecordId){

        String url = getServicePath() + "/wap/mutualBargainActivity/getMutualBargainActivityDetail?chainId={chainId}&memberId={memberId}&openId={openId}&mutualBargainShareRecordId={mutualBargainShareRecordId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, weChatCurrentUserProtocol.getChainId(),weChatCurrentUserProtocol.getMemberId(),weChatCurrentUserProtocol.getOpenId(),mutualBargainShareRecordId);
        if (crmResponse.isHasException()) {
            return handleResponse(crmResponse);
        }
        WapMutualBargainActivityDetailProtocol pageProtocol = (WapMutualBargainActivityDetailProtocol)crmResponse.getData();
        pageProtocol.setProductMainPic(fileResolver.getWebUrl(pageProtocol.getProductMainPic()));
        pageProtocol.setMemberHeadIcon(fileResolver.getWebUrl(pageProtocol.getMemberHeadIcon()));
        for (WapMutualBargainHistoryRecordProtocol wapMutualBargainHistoryRecordProtocol : pageProtocol.getWapMutualBargainHistoryRecordProtocols()) {
            if(StringUtils.isBlank(wapMutualBargainHistoryRecordProtocol.getMemberHeadIcon())||wapMutualBargainHistoryRecordProtocol.getMemberHeadIcon().indexOf("thirdwx.qlogo.cn")>0){
                // 跳过微信头像
                continue;
            }
            wapMutualBargainHistoryRecordProtocol.setMemberHeadIcon(fileResolver.getWebUrl(wapMutualBargainHistoryRecordProtocol.getMemberHeadIcon()));
        }
        for (WapMutualBargainShareRecordDetailProtocol wapMutualBargainShareRecordDetailProtocol : pageProtocol.getWapMutualBargainShareRecordDetailProtocols()) {
            if(StringUtils.isBlank(wapMutualBargainShareRecordDetailProtocol.getBoostHeadIcon())||wapMutualBargainShareRecordDetailProtocol.getBoostHeadIcon().indexOf("thirdwx.qlogo.cn")>0){
                // 跳过微信头像
                continue;
            }
            wapMutualBargainShareRecordDetailProtocol.setBoostHeadIcon(fileResolver.getWebUrl(wapMutualBargainShareRecordDetailProtocol.getBoostHeadIcon()));
        }
        pageProtocol.setBoostPrizePic(fileResolver.getWebUrl(pageProtocol.getBoostPrizePic()));
        pageProtocol.setIsLogin(weChatCurrentUserProtocol.getMemberId()!=null?BooleTypeEnum.Y.toCode():BooleTypeEnum.N.toCode());
           return handleResponse(crmResponse);
    }


}
