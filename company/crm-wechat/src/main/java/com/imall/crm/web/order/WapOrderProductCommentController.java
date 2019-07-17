package com.imall.crm.web.order;

import com.imall.crm.commons.dicts.BooleTypeEnum;
import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.commons.base.protocol.NormalPageProtocol;
import com.imall.crm.module.sales.protocol.CommentPreviousDataProtocol;
import com.imall.crm.module.sales.protocol.ProductInformationProtocol;
import com.imall.crm.module.sales.protocol.PublishCommentSaveProtocol;
import com.imall.crm.module.sales.protocol.wap.WapPageCommentProtocol;
import com.imall.crm.module.sales.protocol.wap.WebOrderCommentDetailsProtocol;
import com.imall.crm.module.sales.protocol.wap.WebOrderProductCommentProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;

/**
 * @author lcl
 * @date 2018/8/15  14:27
 * <p>
 * 我的评价
 */
@Controller
@RequestMapping("/wap/orderProductComment")
public class WapOrderProductCommentController extends BaseController {

    @Autowired
    private FileResolver fileResolver;

    /**
     * 查询 我的评价列表
     *
     * @param currentUser
     * @param
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/pageOrderProductComment", method = RequestMethod.POST)
    public Object pageMemberProductComment(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser,@RequestBody WapPageCommentProtocol wapPageComment) {
        WapPageCommentProtocol wapPageCommentProtocol = new WapPageCommentProtocol();
        BeanUtils.copyProperties(wapPageComment, wapPageCommentProtocol);
        wapPageCommentProtocol.setChainId(currentUser.getChainId());
        wapPageCommentProtocol.setMemberId(currentUser.getMemberId());
        String url = getServicePath() + "/wap/orderEvaluate/pageProductComment";
        CrmResponse crmResponse = restTemplate.postForObject(url, wapPageCommentProtocol, CrmResponse.class);
        if (crmResponse.isHasException()) {
            return handleResponse(crmResponse);
        }
        // 查询图片url
        NormalPageProtocol pageProtocol = (NormalPageProtocol) crmResponse.getData();
        List<LinkedHashMap<String, String>> linkedHashMapList = pageProtocol.getData();
        for (LinkedHashMap<String, String> linkedHashMap :linkedHashMapList ){
           Object productList = linkedHashMap.get("productList");
            List<LinkedHashMap<String, String>> orderItemList =  (List<LinkedHashMap<String, String>>)productList;
            for(LinkedHashMap<String, String> orderItem : orderItemList){
                orderItem.put("pictureStr", fileResolver.getWebUrl(orderItem.get("picture"), "60X60"));
            }
        }
        return handleResponse(crmResponse);

    }


    /**
     * 获取订单评论详情
     *
     * @return
     */
    @GetMapping(value = "/getOrderProductCommentDetails")
    @ResponseBody
    public Object getOrderProductCommentDetails(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long orderCommentId) {
        String requestUrl = getServicePath() + "/wap/orderEvaluate/getOrderProductCommentDetails?orderCommentId={orderCommentId}&memberId={memberId}&chainId={chainId}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class, orderCommentId, currentUser.getMemberId(), currentUser.getChainId());
        WebOrderCommentDetailsProtocol webOrderCommentDetailsProtocol = (WebOrderCommentDetailsProtocol) crmResponse.getData();
        for (WebOrderProductCommentProtocol webOrderProductCommentProtocol : webOrderCommentDetailsProtocol.getOrderProductCommentList()) {
            if (BooleTypeEnum.Y.toCode().equals(webOrderProductCommentProtocol.getIsHasImg())) {
                String[] imgFileId = webOrderProductCommentProtocol.getImgFileIds().split(",");
                StringBuilder picturesStr = new StringBuilder();
                for (String img : imgFileId) {
                    picturesStr.append(fileResolver.getWebUrl(img, "100X100")).append( ",");
                }
                webOrderProductCommentProtocol.setPicturesStr(picturesStr.toString().substring(0, picturesStr.length() - 1));
            }
            webOrderProductCommentProtocol.setPictureStr(fileResolver.getWebUrl(webOrderProductCommentProtocol.getPicture(), "100X100"));
        }
        return handleResponse(crmResponse);
    }


    /**
     * 发表评价（获取评论预先展示信息）
     * @param currentUser
     * @return
     */
    @PostMapping(value = "/getCommentPreviousData")
    @ResponseBody
    public Object getCommentPreviousData(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser,@RequestBody Long orderId){
        String requestUrl = getServicePath() + "/mall/oderComment/getCommentPreviousData?orderId={orderId}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl, CrmResponse.class,orderId,currentUser.getMemberId());
        CommentPreviousDataProtocol commentPreviousDataProtocol =(CommentPreviousDataProtocol)crmResponse.getData();
        for(ProductInformationProtocol productInformationProtocol : commentPreviousDataProtocol.getProductInformationProtocolList()){
            if (StringUtils.isNotBlank(productInformationProtocol.getPicture())) {
                productInformationProtocol.setPictureStr(fileResolver.getWebUrl(productInformationProtocol.getPicture(),"60X60"));
            }
        }
        return handleResponse(crmResponse);
    }

    /**
     * 保存发表评价
     * @param currentUser
     * @param protocol
     * @return
     */
    @PostMapping(value = "/savePublishComment")
    @ResponseBody
    public Object savePublishComment(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody PublishCommentSaveProtocol protocol){
        PublishCommentSaveProtocol publishCommentSaveProtocol = new PublishCommentSaveProtocol();
        BeanUtils.copyProperties(protocol, publishCommentSaveProtocol);
        publishCommentSaveProtocol.setShopId(currentUser.getShopId());
        publishCommentSaveProtocol.setChainId(currentUser.getChainId());
        publishCommentSaveProtocol.setMemberId(currentUser.getMemberId());
        String requestUrl = getServicePath() + "/mall/oderComment/savePublishComment";
        CrmResponse crmResponse = restTemplate.postForObject(requestUrl, publishCommentSaveProtocol, CrmResponse.class);
        return handleResponse(crmResponse);
    }

}
