package com.imall.crm.web.platform;

import com.imall.crm.commons.dicts.BooleTypeEnum;
import com.imall.crm.commons.utils.BigDecimalUtil;
import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.DefaultWebContext;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.commons.web.WebContextFactory;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.msg.protocol.MemberComplaintProtocol;
import com.imall.crm.module.platform.protocol.wap.WapAvailableProductShopSearchProtocol;
import com.imall.crm.module.platform.protocol.wap.WapShopProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * Created by Administrator on 2018/3/20.
 */
@RestController
@RequestMapping(value="/wap/shop")
public class WapShopController extends BaseController {
    private Logger logger = Logger.getLogger(WapShopController.class);
    @Autowired
    private FileResolver fileResolver;


    /**
     * 微信门店 首页门店
     */
    @RequestMapping(value="/findShopHome",method= RequestMethod.GET)
    @ResponseBody
    public Object findShopHome(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String mapLocation,String isForciblyLocation){
        //不强制定位,则按默认门店Id 获取门店信息
        if(BooleTypeEnum.fromCode(isForciblyLocation)!=BooleTypeEnum.Y &&currentUser.getShopId()!=null){
            CrmResponse crmResponse = getShopHomeByShopId(currentUser, mapLocation, currentUser.getShopId());
            return handleResponse(crmResponse);
        }
        DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();
        String requestUrl = getServicePath() + "/wap/shop/findShopHome?chainId={chainId}&useMapLocation={useMapLocation}&memberId={memberId}&openId={openId}";
        String openId = currentUser.getOpenId();
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl ,CrmResponse.class, currentUser.getChainId(), mapLocation , currentUser.getMemberId(), openId);
        WapShopProtocol wapShopProtocol = (WapShopProtocol) crmResponse.getData();
        if (wapShopProtocol != null) {
            wapShopProtocol.setWechatPhoto(fileResolver.getWebUrl(wapShopProtocol.getWechatPhoto()));
            WeChatCurrentUserProtocol currentUserProtocol = ctx.getWeChatUserInfo(currentUser.getChainId());
            currentUserProtocol.setShopId(wapShopProtocol.getShopId());
            wapShopProtocol.setIsLogin(openId!=null ||currentUser.getMemberId()!=null?BooleTypeEnum.Y.toCode():BooleTypeEnum.N.toCode());
            if(wapShopProtocol.getDistance() != null){
                if(wapShopProtocol.getDistance() >= 1000){
                    Double distance = BigDecimalUtil.divide(wapShopProtocol.getDistance(), 1000);
                    wapShopProtocol.setDistanceStr(distance+"km");
                }else {
                    wapShopProtocol.setDistanceStr(wapShopProtocol.getDistance()+"m");
                }
            }
        }
        return handleResponse(crmResponse);
    }
    /**
     * 根据门店id获取首页
     */
    @RequestMapping(value="/findShopHomeByShopId",method= RequestMethod.GET)
    @ResponseBody
    public Object findShopHomeByShopId(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String mapLocation,Long shopId){
        CrmResponse crmResponse = getShopHomeByShopId(currentUser, mapLocation, shopId);
        return handleResponse(crmResponse);
    }

    private CrmResponse getShopHomeByShopId(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String mapLocation, Long shopId) {
        DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();
        String requestUrl = getServicePath() + "/wap/shop/findShopHomeByShopId?chainId={chainId}&useMapLocation={useMapLocation}&shopId={shopId}";

        CrmResponse crmResponse = restTemplate.getForObject(requestUrl ,CrmResponse.class, currentUser.getChainId(), mapLocation , shopId);
        WapShopProtocol wapShopProtocol = (WapShopProtocol) crmResponse.getData();
        if (wapShopProtocol != null) {
            wapShopProtocol.setWechatPhoto(fileResolver.getWebUrl(wapShopProtocol.getWechatPhoto()));
            WeChatCurrentUserProtocol currentUserProtocol = ctx.getWeChatUserInfo(currentUser.getChainId());
            currentUserProtocol.setShopId(shopId);
            wapShopProtocol.setIsLogin(currentUser.getMemberId()!=null? BooleTypeEnum.Y.toCode():BooleTypeEnum.N.toCode());
            if(wapShopProtocol.getDistance() != null){
                if(wapShopProtocol.getDistance() >= 1000){
                    Double distance = BigDecimalUtil.divide(wapShopProtocol.getDistance(), 1000);
                    wapShopProtocol.setDistanceStr(distance+"km");
                }else {
                    wapShopProtocol.setDistanceStr(wapShopProtocol.getDistance()+"m");
                }
            }
        }
        return crmResponse;
    }

    /**
     * 微信门店 首页门店 列表 (返回符合要求的门店id)
     * (暂不过滤黑名单用户)
     * (暂不考虑营业时间)
     */
    @RequestMapping(value="/getUserLocation",method= RequestMethod.GET)
    @ResponseBody
    public Object getUserLocation(String mapLocation){
        String requestUrl = getServicePath() + "/wap/shop/getUserLocation?useMapLocation={useMapLocation}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl ,CrmResponse.class,  mapLocation );
        return handleResponse(crmResponse);
    }
    /**

     */
    @RequestMapping(value="/getNearByShopListSort",method= RequestMethod.GET)
    @ResponseBody
    public Object getNearByShopListSort(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String mapLocation){

        String requestUrl = getServicePath() + "/wap/shop/getNearByShopListSort?chainId={chainId}&useMapLocation={useMapLocation}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl ,CrmResponse.class, currentUser.getChainId(), mapLocation );
        List<LinkedHashMap<String, String>> wapShopProtocolHashMap = (ArrayList) crmResponse.getData();
        if(CollectionUtils.isNotEmpty(wapShopProtocolHashMap)){
            for (LinkedHashMap<String, String> linkedHashMap : wapShopProtocolHashMap) {
                linkedHashMap.put("wechatPhoto", fileResolver.getWebUrl(linkedHashMap.get("wechatPhoto")));
                Object distanceObject = linkedHashMap.get("distance");
                Double distance = (Double) distanceObject;
                if(distance != null){
                    if(distance >= 1000){
                        Double distanceKm = BigDecimalUtil.divide(distance, 1000);
                        linkedHashMap.put("distanceStr",distanceKm+"km");
                    }else {
                        linkedHashMap.put("distanceStr",distance+"m");
                    }
                }
            }
        }
        return handleResponse(crmResponse);
    }


    /**
     * 查询附近门店列表(支持搜索参数:例如，门店内是否包含某活动商品)
     */
    @PostMapping(value="/getAvailableProductShopList")
    @ResponseBody
    public Object getAvailableProductShopList(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser,@RequestBody WapAvailableProductShopSearchProtocol searchProtocol){
        String requestUrl = getServicePath() + "/wap/shop/getAvailableProductShopList";
        searchProtocol.setChainId(currentUser.getChainId());
        CrmResponse crmResponse = restTemplate.postForObject(requestUrl,searchProtocol,CrmResponse.class );
        List<LinkedHashMap<String, String>> wapShopProtocolHashMap = (ArrayList) crmResponse.getData();
        if(CollectionUtils.isNotEmpty(wapShopProtocolHashMap)){
            for (LinkedHashMap<String, String> linkedHashMap : wapShopProtocolHashMap) {
                linkedHashMap.put("wechatPhoto", fileResolver.getWebUrl(linkedHashMap.get("wechatPhoto")));
                Object distanceObject = linkedHashMap.get("distance");
                Double distance = (Double) distanceObject;
                if(distance != null){
                    if(distance >= 1000){
                        Double distanceKm = BigDecimalUtil.divide(distance, 1000);
                        linkedHashMap.put("distanceStr",distanceKm+"km");
                    }else {
                        linkedHashMap.put("distanceStr",distance+"m");
                    }
                }
            }
        }
        return handleResponse(crmResponse);
    }


    /**
     * 门店详情
     */
    @RequestMapping(value = "/findShopDetail", method = RequestMethod.GET)
    public Object findShopDetail(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long shopId) {
        String requestUrl = getServicePath() + "/wap/shop/findWechatShopById?chainId={chainId}&shopId={shopId}";
        CrmResponse<WapShopProtocol> crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class,currentUser.getChainId(), shopId);
        if (crmResponse.isHasException()){
            return handleResponse(crmResponse);
        }

        WapShopProtocol shopProtocol = crmResponse.getData();
        //门店头像链接处理
        String wechatPhoto = shopProtocol.getWechatPhoto();
        if (StringUtils.isNotBlank(wechatPhoto)){
            shopProtocol.setWechatPhoto(fileResolver.getWebUrl(wechatPhoto));
        }
        String shopPhotos = shopProtocol.getShopPhotos();
        //门店图片链接处理
        if (StringUtils.isNotBlank(shopPhotos)){
            String[] photos = shopPhotos.split(",");
            StringBuilder shopPhotoUrls = new StringBuilder();
            for (String photo : photos) {
                if (StringUtils.isBlank(photo)){
                    continue;
                }
                shopPhotoUrls.append(fileResolver.getWebUrl(photo)).append(",");
            }
            shopProtocol.setShopPhotos(shopPhotoUrls.toString());
        }
        return handleResponse(crmResponse);
    }

    /**
     * 新增门店投诉
     */
    @RequestMapping(value = "/addComplaint")
    public Object addComplaint(@WeChatCurrentUser WeChatCurrentUserProtocol currentUserProtocol, @RequestBody MemberComplaintProtocol memberComplaintProtocol) {
        String requestUrl = getServicePath() + "/wap/shop/addComplaint";
        memberComplaintProtocol.setChainId(currentUserProtocol.getChainId());
        memberComplaintProtocol.setMemberId(currentUserProtocol.getMemberId());
        memberComplaintProtocol.setComplainTitle(memberComplaintProtocol.getMemberName()+"投诉");
        CrmResponse crmResponse = restTemplate.postForObject(requestUrl,memberComplaintProtocol, CrmResponse.class);
        return handleResponse(crmResponse);
    }

    /**
     * 获取该门店销售分类第一个id
     */
    @RequestMapping(value = "/getShopSellClassifyFirstId")
    public Object getShopSellClassifyFirstId(@WeChatCurrentUser WeChatCurrentUserProtocol currentUserProtocol, Long shopId) {
        String requestUrl = getServicePath() + "/wap/shop/getShopSellClassifyFirstId?chainId={chain}&shopId={shopId}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class,currentUserProtocol.getChainId(),shopId);
        return handleResponse(crmResponse);
    }

    /**
     * 获取有货门店
     */
    @RequestMapping(value="/findNearbyShop",method= RequestMethod.GET)
    @ResponseBody
    public Object findNearbyShop(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String mapLocation,Long prescriptionId){
        String requestUrl = getServicePath() + "/wap/shop/findNearbyShop?chainId={chainId}&useMapLocation={useMapLocation}&prescriptionId={prescriptionId}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl ,CrmResponse.class, currentUser.getChainId(), mapLocation,prescriptionId );
        List<LinkedHashMap<String, String>> wapShopProtocolHashMap = (ArrayList) crmResponse.getData();
        if(CollectionUtils.isNotEmpty(wapShopProtocolHashMap)){
            for (LinkedHashMap<String, String> linkedHashMap : wapShopProtocolHashMap) {
                linkedHashMap.put("wechatPhoto", fileResolver.getWebUrl(linkedHashMap.get("wechatPhoto")));
                Object distanceObject = linkedHashMap.get("distance");
                Double distance = (Double) distanceObject;
                if(distance != null){
                    if(distance >= 1000){
                        Double distanceKm = BigDecimalUtil.divide(distance, 1000);
                        linkedHashMap.put("distanceStr",distanceKm+"km");
                    }else {
                        linkedHashMap.put("distanceStr",distance+"m");
                    }
                }
            }
        }
        return handleResponse(crmResponse);
    }
}
