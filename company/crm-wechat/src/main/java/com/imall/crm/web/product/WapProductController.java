package com.imall.crm.web.product;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.commons.base.protocol.NormalPageProtocol;
import com.imall.crm.module.product.protocol.wap.WapCommentPointSearchProtocol;
import com.imall.crm.module.product.protocol.wap.WapNewProductSearchProtocol;
import com.imall.crm.module.product.protocol.wap.WapProductDetailProtocol;
import com.imall.crm.module.product.protocol.wap.WapProductSearchProtocol;
import com.imall.crm.module.wechat.protocol.SkuSearchProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;


/**
 * @author chencheng
 */
@RestController
@RequestMapping("/wap/product")
public class WapProductController extends BaseController {
    private Logger logger = Logger.getLogger(WapProductController.class);
    @Autowired
    private FileResolver fileResolver;

    /**
     * 商品详情
     */
    @RequestMapping(value = "/getProductDetail", method = RequestMethod.GET)
    public Object getProductDetail(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser, Long productId, String platformType,String shopId) {
        //todo:兼容无登录顾客访问商品详情,后期改为访问sku
        /*  Long shopIdOfProduct = weChatCurrentUser.getShopId() != null ? weChatCurrentUser.getShopId() : StringUtils.isNotBlank(shopId) && !shopId.equals("null") ? Long.valueOf(shopId) : null;*/
        Long shopIdOfProduct = (StringUtils.isNotBlank(shopId) && !shopId.equals("null")) ? Long.valueOf(shopId) : weChatCurrentUser.getShopId();
        logger.info("获取商品详情，shopId：" + shopIdOfProduct + ";productId：" + productId + ";platformType：" + platformType + ";memberId：" + weChatCurrentUser.getMemberId());
        String url = getServicePath() + "/wap/product/getProductDetail?chainId={chainId}&shopId={shopId}&productId={productId}&platformType={platformType}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, weChatCurrentUser.getChainId(), shopIdOfProduct, productId, platformType,weChatCurrentUser.getMemberId());
        if(crmResponse.isHasException()){
            return handleResponse(crmResponse);
        }
        WapProductDetailProtocol wapProductDetailProtocol = (WapProductDetailProtocol) crmResponse.getData();
        if(wapProductDetailProtocol ==null){
            return handleResponse(crmResponse);
        }
        wapProductDetailProtocol.setVideoFileId(fileResolver.getWebUrl(wapProductDetailProtocol.getVideoFileId()));
        wapProductDetailProtocol.setVideoFileImg(fileResolver.getWebUrl(wapProductDetailProtocol.getVideoFileImg()));
        wapProductDetailProtocol.setOpenId(weChatCurrentUser.getOpenId());
        if (StringUtils.isNotBlank(wapProductDetailProtocol.getPicture())){
            StringBuilder sb = new StringBuilder();
            for (String fileId : wapProductDetailProtocol.getPicture().split(",")) {
                sb.append(",");
                sb.append(fileResolver.getWebUrl(fileId));
            }
            if (sb.length() > 0) {
                sb.deleteCharAt(0);
            }
            wapProductDetailProtocol.setPicture(sb.toString());
        }
        return handleResponse(crmResponse);
    }

    /**
     * 根据条形码查询商品详情
     */
    @GetMapping("/findProductScanInfo")
    public Object findProductScanInfo(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser, String anccCode, String platformType) {
        String url = getServicePath() + "/wap/product/findProductScanInfo?chainId={chainId}&shopId={shopId}&anccCode={anccCode}&platformType={platformType}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, weChatCurrentUser.getChainId(), weChatCurrentUser.getShopId(), anccCode, platformType);
        return handleResponse(crmResponse);
    }
    /**
     * 获取商品简单数据(价格主图和名称)
     */
    @RequestMapping(value = "/getProductSimpleDetail", method = RequestMethod.GET)
    public Object getProductSimpleDetail(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser, Long productId, String platformType) {
        CrmResponse crmResponse = restTemplate.getForObject(getServicePath() + "/wap/product/getProductSimpleDetail?chainId={chainId}&shopId={shopId}&productId={productId}&platformType={platformType}", CrmResponse.class, weChatCurrentUser.getChainId(), weChatCurrentUser.getShopId(), productId, platformType);
        if(crmResponse.isHasException()){
            return handleResponse(crmResponse);
        }
        WapProductDetailProtocol wapProductDetailProtocol = (WapProductDetailProtocol) crmResponse.getData();
        if (StringUtils.isNotBlank(wapProductDetailProtocol.getPicture())){
            wapProductDetailProtocol.setPicture(fileResolver.getWebUrl(wapProductDetailProtocol.getPicture()));
        }
        return handleResponse(crmResponse);
    }

    /**
     * 商品列表
     */
    @RequestMapping(value = "/pageWapProduct", method = RequestMethod.POST)
    public Object pageWapProduct(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser, @RequestBody WapProductSearchProtocol wapProductSearchProtocol) {
        WapProductSearchProtocol searchProtocol = new WapProductSearchProtocol();
        BeanUtils.copyProperties(wapProductSearchProtocol, searchProtocol);
        wapProductSearchProtocol.setChainId(weChatCurrentUser.getChainId());
        wapProductSearchProtocol.setShopId(weChatCurrentUser.getShopId());
        String requestUrl = getServicePath() + "/wap/product/pageWapProduct";
        CrmResponse crmResponse = restTemplate.postForObject(requestUrl, wapProductSearchProtocol, CrmResponse.class);
        if (crmResponse.isHasException()){
            return handleResponse(crmResponse);
        }
        NormalPageProtocol pageProtocol = (NormalPageProtocol) crmResponse.getData();
        List<LinkedHashMap<String, String>> linkedHashMapList = pageProtocol.getData();
        for (LinkedHashMap<String, String> linkedHashMap : linkedHashMapList) {
            linkedHashMap.put("picture", fileResolver.getWebUrl(linkedHashMap.get("picture"),"100X100"));
        }
        return handleResponse(crmResponse);
    }

    /**
     * 商品列表 - 搜索支持优惠券搜索
     */
    @RequestMapping(value = "/newPageWapProduct", method = RequestMethod.POST)
    public Object newPageWapProduct(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser, @RequestBody WapNewProductSearchProtocol wapNewProductSearchProtocol) {
        WapNewProductSearchProtocol searchProtocol = new WapNewProductSearchProtocol();
        BeanUtils.copyProperties(wapNewProductSearchProtocol, searchProtocol);
        wapNewProductSearchProtocol.setChainId(weChatCurrentUser.getChainId());
        wapNewProductSearchProtocol.setShopId(weChatCurrentUser.getShopId());
        String requestUrl = getServicePath() + "/wap/product/newPageWapProduct";
        CrmResponse crmResponse = restTemplate.postForObject(requestUrl, wapNewProductSearchProtocol, CrmResponse.class);
        if (crmResponse.isHasException()){
            return handleResponse(crmResponse);
        }
        NormalPageProtocol pageProtocol = (NormalPageProtocol) crmResponse.getData();
        List<LinkedHashMap<String, String>> linkedHashMapList = pageProtocol.getData();
        for (LinkedHashMap<String, String> linkedHashMap : linkedHashMapList) {
            linkedHashMap.put("picture", fileResolver.getWebUrl(linkedHashMap.get("picture"),"200X200"));
        }
        return handleResponse(crmResponse);
    }

    /**
     * 获取商品所有的商品评论
     * @param productId 商品id
     */
    @GetMapping("/getProductComment")
    public Object getProductComment(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser,Long productId){
        String url = getServicePath() + "/wap/product/getProductComment?chainId={chainId}&productId={productId}";
        CrmResponse crmResponse = restTemplate.getForObject(url,CrmResponse.class,weChatCurrentUser.getChainId(),productId);
        if(crmResponse.isHasException()){
            return handleResponse(crmResponse);
        }
        return handleResponse(crmResponse);
    }

    /**
     * 根据分页参数查找商品评论 findProductCommentByGrade
     */
    @PostMapping("/pageProductCommentByGrade")
    public Object pageProductCommentByGrade(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser, @RequestBody WapCommentPointSearchProtocol protocol) {
        protocol.setChainId(weChatCurrentUser.getChainId());
        String url = getServicePath() + "/wap/product/pageProductCommentByGrade";
        CrmResponse crmResponse = restTemplate.postForObject(url, protocol, CrmResponse.class);
        NormalPageProtocol pageProtocol = (NormalPageProtocol) crmResponse.getData();
        List<LinkedHashMap<String, String>> wapOrderProductCommentProtocols = (List<LinkedHashMap<String, String>>) pageProtocol.getData();
        for(LinkedHashMap<String,String> linkedHashMap:wapOrderProductCommentProtocols){
            if(StringUtils.isNotBlank(linkedHashMap.get("imgFileIds"))){
                StringBuilder sb = new StringBuilder();
                for (String fileId : linkedHashMap.get("imgFileIds").split(",")) {
                    sb.append(",");
                    sb.append(fileResolver.getWebUrl(fileId));
                }
                if (sb.length() > 0) {
                    sb.deleteCharAt(0);
                }
                linkedHashMap.put("imgFileUrls",sb.toString());
            }
        }
        return handleResponse(crmResponse);
    }

    /**
     *
     * 获取商品列表（该门店，该商品分类）
     * @PageSearchParam PageSearchParameter pageSearchParameter,
     * @return
     */
    @RequestMapping(value = "/pageProductListByShopIdAndSellId", method = {RequestMethod.GET, RequestMethod.POST})
    public Object pageProductListByShopAndSellId(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, SkuSearchProtocol skuSearchProtocol) {
        SkuSearchProtocol searchProtocol = new SkuSearchProtocol();
        BeanUtils.copyProperties(skuSearchProtocol,searchProtocol);
        String requestUrl = getServicePath() + "wap/product/pageProductListByShopIdAndSellId";
        searchProtocol.setChainId(currentUser.getChainId());
        searchProtocol.setShopId(currentUser.getShopId());
        CrmResponse crmResponse = restTemplate.postForObject(requestUrl, searchProtocol, CrmResponse.class);
        NormalPageProtocol pageProtocol = (NormalPageProtocol)crmResponse.getData();
        List<LinkedHashMap<String, String>> linkedHashMapList = pageProtocol.getData();
        for (LinkedHashMap<String, String> linkedHashMap : linkedHashMapList) {
            if (StringUtils.isNotBlank(linkedHashMap.get("picture"))) {
                linkedHashMap.put("picture", fileResolver.getWebUrl(linkedHashMap.get("picture"),"220X220"));
            }
        }
        return handleResponse(crmResponse);
    }

    /**
     * 销售分类列表（包含商品数量统计信息）
     */
    @RequestMapping(value = "/listSellCategoryToCount", method = RequestMethod.GET)
    public Object listSellCategoryToCount(@WeChatCurrentUser WeChatCurrentUserProtocol currentUserProtocol, String keywords, String platformType) {
        String requestUrl = getServicePath() + "/wap/product/listSellCategoryToCount?chainId={chainId}&shopId={shopId}&keywords={keywords}&platformType={platformType}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class, currentUserProtocol.getChainId(), currentUserProtocol.getShopId(), keywords, platformType);
        return handleResponse(crmResponse);
    }

    /**
     * 销售分类列表（仅简单信息）
     */
    @RequestMapping(value = "/listSellCategoryToSimple", method = RequestMethod.GET)
    public Object listSellCategoryToSimple(@WeChatCurrentUser WeChatCurrentUserProtocol currentUserProtocol) {
        String requestUrl = getServicePath() + "/wap/product/listSellCategoryToSimple?chainId={chainId}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class, currentUserProtocol.getChainId());
        return handleResponse(crmResponse);
    }

    /**
     * 管理分类列表
     */
    @RequestMapping(value = "listMgrCategory")
    public Object listMgrCategory(@WeChatCurrentUser WeChatCurrentUserProtocol currentUserProtocol){
        String requestUrl = getServicePath() + "/wap/product/listMgrCategory?chainId={chainId}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class, currentUserProtocol.getChainId());
        return handleResponse(crmResponse);
    }
    /**
     * 常用分类列表
     */
    @RequestMapping(value = "listFrequentlyMgrCategory", method = RequestMethod.GET)
    public Object listFrequentlyMgrCategory(@WeChatCurrentUser WeChatCurrentUserProtocol currentUserProtocol){
        Integer limitNum = 10;
        String requestUrl = getServicePath() + "/wap/product/listFrequentlyMgrCategory?chainId={chainId}&limitNum={limitNum}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class, currentUserProtocol.getChainId(),limitNum);
        return handleResponse(crmResponse);
    }

    /**
     * 根据商品id找到支持门店id
     */
    @GetMapping("/findSupportShopIdsByProductId")
    public Object findSupportShopIdsByProductId(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser, Long productId) {
        String url = getServicePath() + "/wap/product/findSupportShopIdsByProductId?chainId={chainId}&productId={productId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, weChatCurrentUser.getChainId(), productId);
        if (crmResponse.isHasException()) {
            return handleResponse(crmResponse);
        }
        return handleResponse(crmResponse);
    }
}