package com.imall.crm.web.mall;

import com.imall.crm.commons.dicts.PlatformTypeEnum;
import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.commons.base.protocol.NormalPageProtocol;
import com.imall.crm.module.decoration.provider.wap.WapPageModuleObjectCommodityProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * Created by zhongzheng on 2018/8/17.
 */
@Controller
@RequestMapping("/wap/mall/index")
public class WapMallIndexController extends BaseController {

    @Autowired
    private FileResolver fileResolver;

    /**
     * wap 商品tab 查询
     * @param weChatCurrentUser
     * @param moduleInnerCode 内部编码
     * @return
     */
    @RequestMapping(value = "/getModuleTabList", method = RequestMethod.GET)
    @ResponseBody
    public Object getModuleTabList(String moduleInnerCode,  @WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser) {
        String url=getServicePath()+"/wap/mall/index/getModuleTabList?chainId={chainId}&moduleInnerCode={moduleInnerCode}";
        CrmResponse crmResponse = restTemplate.getForObject(url,CrmResponse.class,weChatCurrentUser.getChainId(),moduleInnerCode);
        return handleResponse(crmResponse);
    }

    /**
     *  页面 模块 对象 分页查询
     * @param weChatCurrentUser
     * @param protocol
     * @return
     */
    @RequestMapping(value = "/pagePageModuleObject", method =RequestMethod.POST)
    @ResponseBody
    public Object findModuleObject(@RequestBody WapPageModuleObjectCommodityProtocol protocol, @WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser) {
        String url=getServicePath()+"/wap/mall/index/pagePageModuleObject";

        WapPageModuleObjectCommodityProtocol wapPageModuleObjectCommodityProtocol = new WapPageModuleObjectCommodityProtocol();
        BeanUtils.copyProperties(protocol, wapPageModuleObjectCommodityProtocol);
        wapPageModuleObjectCommodityProtocol.setChainId(weChatCurrentUser.getChainId());
        wapPageModuleObjectCommodityProtocol.setPlatformType(PlatformTypeEnum.B2C.toCode());
        CrmResponse crmResponse = restTemplate.postForObject(url, wapPageModuleObjectCommodityProtocol, CrmResponse.class);
        NormalPageProtocol pageProtocol = (NormalPageProtocol) crmResponse.getData();
        List<LinkedHashMap<String, String>> linkedHashMapList = (List<LinkedHashMap<String, String>>) pageProtocol.getData();
        for (LinkedHashMap<String, String> linkedHashMap : linkedHashMapList) {
            String fileId = linkedHashMap.get("fileId");
            if (StringUtils.isNotBlank(fileId)) {
                linkedHashMap.put("fileId", fileResolver.getWebUrl(fileId, "220X220"));

            }
        }
        return handleResponse(crmResponse);
    }
    /**
     * 查询 商城公告
     *
     * @param weChatCurrentUser
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/findByInfoList", method = {RequestMethod.GET})
    public Object findByInfoList(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser,String  categoryCode) {
        String url = getServicePath() + "/wap/mall/index/findByInfoList?chainId={chainId}&categoryCode={categoryCode}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, weChatCurrentUser.getChainId(),categoryCode);
        return handleResponse(crmResponse);
    }
    /**
     * 查询 首页轮播（广告位）
     * @param weChatCurrentUser
     * @param moduleInnerCode 内部编码
     * @return
     */
    @RequestMapping(value = "/findAdvertisingPageModuleObject",method = RequestMethod.GET)
    @ResponseBody
    public Object findAdvertisingPageModuleObject(String moduleInnerCode,@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser){
        String url=getServicePath()+"/wap/mall/index/findAdvertisingPageModuleObject?chainId={chainId}&moduleInnerCode={moduleInnerCode}";
        CrmResponse crmResponse = restTemplate.getForObject(url,CrmResponse.class,weChatCurrentUser.getChainId(),moduleInnerCode);
        ArrayList<LinkedHashMap> listProtocol = (ArrayList<LinkedHashMap>)crmResponse.getData();
        for(HashMap advertisingPageModuleObjectProtocol : listProtocol){
            if(advertisingPageModuleObjectProtocol.get("imgFileId")!=null){
                advertisingPageModuleObjectProtocol.put("imgFileId",fileResolver.getWebUrl(advertisingPageModuleObjectProtocol.get("imgFileId").toString()));
            }
        }
        return handleResponse(crmResponse);
    }

}
