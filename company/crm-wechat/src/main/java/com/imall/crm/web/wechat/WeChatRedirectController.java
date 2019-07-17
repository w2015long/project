package com.imall.crm.web.wechat;

import com.imall.crm.commons.dicts.ShareObjTypeEnum;
import com.imall.crm.commons.dicts.ShareSourceTypeEnum;
import com.imall.crm.commons.dicts.SharerIdentityTypeEnum;
import com.imall.crm.commons.web.DefaultWebContext;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.commons.web.WebContextFactory;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.sales.protocol.wap.WapWechatPromoteShareRecordProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

/**
 * @author kwy
 * @date 2018/11/08
 * 微商城中转重定向处理
 */
@Controller
@RequestMapping("/wap/redirect")
public class WeChatRedirectController extends BaseController {
    private static final Logger logger = Logger.getLogger(WeChatRedirectController.class);

    @Value("${crm.web.root}")
    private String webRoot;

    @Value("${crm.fileUpload.uploadPath}")
    private String uploadPath;

    /**
     * 首页
     * @param response
     * @throws IOException
     */
    @GetMapping(value = "/index")
    public void index(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,HttpServletResponse response) throws IOException {
        DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();
        WeChatCurrentUserProtocol currentUserProtocol = ctx.getWeChatUserInfo(weChatCurrentUserProtocol.getChainId());
        currentUserProtocol.setShopId(null);
        response.sendRedirect("/");
    }

    /**
     * 友德医对接问诊详情
     * @param response
     * @throws IOException
     */
    @GetMapping(value = "/ydyInterrogationRecord/details/{thirdRequireCode}")
    public void toInterrogationRecordDetail( HttpServletResponse response, @PathVariable String thirdRequireCode) throws IOException {
        logger.info( "友德医对接问诊详情" +"当前类=WeChatRedirectController.toInterrogationRecordDetail(),thirdRequireCode = [" + thirdRequireCode + "]");
        if(StringUtils.isNotBlank(thirdRequireCode) && thirdRequireCode.contains("crm_jk_")){
            String inquiryId = thirdRequireCode.split("crm_jk_")[1];
            response.sendRedirect("/#/ydy/interrogationRecord/details/" +inquiryId);
        }else{
            response.sendRedirect("/");
        }
    }

    /**
     * 分享商品 推广
     *
     * @throws IOException
     */
    @RequestMapping(value = "/product/{productId}/{platformType}/{wechatPromoteActivityId}/{shopId}/{userId}", method = RequestMethod.GET)
    public void getWechatProductDetailUrl(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, HttpServletResponse response, @PathVariable Long productId, @PathVariable String platformType, @PathVariable Long wechatPromoteActivityId, @PathVariable Long shopId, @PathVariable Long userId) throws IOException {
        logger.info("跳转的页面" + webRoot + "/#/product/detail/" + productId + "/" + platformType + "/" + wechatPromoteActivityId + "/" + shopId + "/" + userId+weChatCurrentUserProtocol.getOpenId()+"分享商品 推广");
        // 记录到推广记录表
        WapWechatPromoteShareRecordProtocol wapWechatPromoteShareRecordProtocol = new WapWechatPromoteShareRecordProtocol();
        wapWechatPromoteShareRecordProtocol.setChainId(weChatCurrentUserProtocol.getChainId());
        wapWechatPromoteShareRecordProtocol.setWechatPromoteActivityId(wechatPromoteActivityId);
        wapWechatPromoteShareRecordProtocol.setShareSourceType(ShareSourceTypeEnum.ACTIVITY.toCode());
        wapWechatPromoteShareRecordProtocol.setSharerIdentityType(SharerIdentityTypeEnum.USER.toCode());
        wapWechatPromoteShareRecordProtocol.setSharerId(userId);
        wapWechatPromoteShareRecordProtocol.setReceiverCode(weChatCurrentUserProtocol.getOpenId());
        wapWechatPromoteShareRecordProtocol.setShareObjType(ShareObjTypeEnum.PRODUCT.toCode());
        wapWechatPromoteShareRecordProtocol.setShareObjId(productId);
        logger.info( "" +"当前类=WeChatRedirectController.getWechatProductDetailUrl()"+ "wapWechatPromoteShareRecordProtocol = [" + wapWechatPromoteShareRecordProtocol + "]");
        // 头像
        wapWechatPromoteShareRecordProtocol.setWechatPic(weChatCurrentUserProtocol.getIconFileId());
        String url = getServicePath() + "/wap/wechatPromoteShareRecord/saveWechatPromoteShareRecord";
        restTemplate.postForObject(url, wapWechatPromoteShareRecordProtocol, CrmResponse.class);
        logger.info("跳转的页面 /#/product/detail/" + productId + "/" + platformType + "/" + shopId);

        //为了现实A门店的商品分享出来，B会员不管在哪里下单都要先 自动定位到离B会员最近的门店，如果最近有门店就定位到门店，没有就定位到B2C
        //简单解决方法如下
        platformType = null;
        shopId = null;

        response.sendRedirect("/#/product/detail/" + productId + "/" + platformType + "/" + shopId);
    }

    /**
     * 分享商品
     *
     * @throws IOException
     */
    @RequestMapping(value = "/product/{productId}/{platformType}/{openId}/{shopId}", method = RequestMethod.GET)
    public void getWechatProductDetailUrl(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,HttpServletResponse response, @PathVariable Long productId, @PathVariable String platformType, @PathVariable String openId, @PathVariable String shopId) throws IOException {
        logger.info("跳转的页面 /#/product/detail/" + productId + "/" + platformType + "/" + openId + "/" + shopId);
        if (StringUtils.isNotBlank(shopId) && !"null".equals(shopId)) {
            DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();
            WeChatCurrentUserProtocol currentUserProtocol = ctx.getWeChatUserInfo(weChatCurrentUserProtocol.getChainId());
            currentUserProtocol.setShopId(Long.valueOf(shopId));
        }

        //为了现实A门店的商品分享出来，B会员不管在哪里下单都要先 自动定位到离B会员最近的门店，如果最近有门店就定位到门店，没有就定位到B2C
        //简单解决方法如下
        platformType = null;
        shopId = null;

        response.sendRedirect("/#/product/detail/" + productId + "/" + platformType + "/" + openId + "/" + shopId);
    }

    /**
     * 通过普通商品二维码进入
     *
     * @throws IOException
     */
    @RequestMapping(value = "/product/{productId}", method = RequestMethod.GET)
    public void getWechatCommonProductDetailUrl(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, HttpServletResponse response, @PathVariable Long productId) throws IOException {

        if(productId.equals(17688L)){
            synchronized (this){
                logger.info("开始读取商品访问次数。。。。。。。。" );
                File file = new File(uploadPath+"/productText.txt");
                String newNumberStr = readProductVisitNumber(file);
                newNumberStr = newNumberStr.trim(); //清除前后空格
                if(StringUtils.isBlank(newNumberStr)){ //如何什么都没有 给默认值
                    newNumberStr = "0";
                }
                Long newNumber = Long.parseLong(newNumberStr);
                logger.info("字符串newNumberStr:"+newNumberStr+"》》》》》》》》》转成Long类型newNumber:"+ newNumber);
                ++newNumber;
                logger.info("开始写入新的商品访问次数》》》》GO!GO!GO!" );
                writeProductVisitNumber(uploadPath+"/productText.txt",newNumber);
                logger.info("保存新的商品访问次数》》》》结束！！！！" );
            }
        }


        logger.info("跳转的页面 /#/product/detail/" + productId);
        response.sendRedirect("/#/product/detail/" + productId);
    }


    /**
     *  年会领卷
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = "/coupon/yearMeetingReceive/{couponId}", method = RequestMethod.GET)
    public void yearMeetingReceive( HttpServletResponse response, @PathVariable Long couponId) throws IOException {
        logger.info("跳转的页面 /coupon/yearMeetingReceive/"+couponId );
        response.sendRedirect("/#/coupon/yearMeetingReceive/" +couponId);
    }

    /**
     *  优惠券大礼包
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = "/coupon/couponGiftPacksDetails/{couponGiftPacksId}", method = RequestMethod.GET)
    public void couponGiftPacksDetails( HttpServletResponse response, @PathVariable Long couponGiftPacksId) throws IOException {
        logger.info("跳转的页面 /coupon/yearMeetingReceive/"+couponGiftPacksId );
        response.sendRedirect("/#/couponGiftPack/findDetails/" +couponGiftPacksId);
    }

    /**
     * 砍价
     * @param response
     * @throws IOException
     */
    @RequestMapping(value = "/bargain/mutualBargain/{mutualBargainShareRecordId}", method = RequestMethod.GET)
    public void toMutualBargain( HttpServletResponse response, @PathVariable Long mutualBargainShareRecordId) throws IOException {
        response.sendRedirect("/#/bargain/mutualBargain/" +mutualBargainShareRecordId);
    }


    /**
     * 跳转到双十一活动页面
     *
     */
    @GetMapping(value = "/gotoDoubleElevenPage")
    public void gotoDoubleElevenPage(HttpServletResponse response) throws IOException {
        response.sendRedirect(webRoot + "/#/activity/doubleEleven");
    }

    /**
     * 来自会员卡入口跳入的主页,则直接重定向到有微信支付授权的首页 且清除门店id
     *
     */
    @RequestMapping(value = "/payHome", method = RequestMethod.GET)
    public void payHome(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol,HttpServletResponse response, HttpServletRequest request) throws IOException {
        String params = request.getQueryString();//params 里有会员openID,会员卡code等信息,可以识别从会员卡进入该接口的会员信息,后续可根据业务拓展
        DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();
        WeChatCurrentUserProtocol currentUserProtocol = ctx.getWeChatUserInfo(weChatCurrentUserProtocol.getChainId());
        currentUserProtocol.setShopId(null);
        response.sendRedirect(webRoot);
    }

    /**
     * 微信会员卡优惠券查看
     *
     * @param request
     * @throws IOException
     */
    @RequestMapping(value = "/wxGoToCouponLIst", method = RequestMethod.GET)
    public void getWechatMemberCardCouponReturnUrl(HttpServletResponse response, HttpServletRequest request) throws IOException {
        logger.info( "跳转的优惠券页面" +webRoot  + "/#/coupon/list?" + request.getQueryString());
        response.sendRedirect(webRoot  + "/#/coupon/list?" + request.getQueryString());
    }


    /**
     * 微信会员卡积分查看
     *
     * @param request
     * @throws IOException
     */
    @RequestMapping(value = "/wxGoToIntegralDetail", method = RequestMethod.GET)
    public void wxGoToIntegralDetail(HttpServletResponse response, HttpServletRequest request) throws IOException {
        logger.info( "跳转积分页面" +webRoot  + "/#/member/integral/index?" + request.getQueryString());
        response.sendRedirect(webRoot  + "/#/member/integral/index?" + request.getQueryString());
    }

    /**
     * 微信 会员推广奖励
     *
     * @param request
     * @throws IOException
     */
    @RequestMapping(value = "/wxGoToPromoterReward/{sharerId}", method = RequestMethod.GET)
    public void wxPromoterReward(HttpServletResponse response, HttpServletRequest request,@PathVariable Long sharerId) throws IOException {
        logger.info( "跳转会员推广奖励页面" +webRoot  + "/#/member/promote" + sharerId);
        response.sendRedirect(webRoot  + "/#/member/promote/"+ sharerId );
    }


    /**
     *  砍价活动
     * @throws IOException
     */
    @RequestMapping(value = "/bargain/bargainActivity", method = RequestMethod.GET)
    public void bargainActivity( HttpServletResponse response) throws IOException {
        logger.info("跳转的页面 /bargain/bargainActivity");
        response.sendRedirect("/#/bargain/bargainActivity");
    }



    /**
     * 写入商品访问次数
     * @param fileStr 文件地址
     * @param newNumber 要写入的访问次数
     */
    public  void writeProductVisitNumber(String fileStr ,Long newNumber) {
        File file = null;
        FileWriter fw = null;
        file = new File(fileStr);
        try {
            if (!file.exists()) {
                file.createNewFile();
            }
            fw = new FileWriter(file);
            fw.write(String.valueOf(newNumber));
            fw.flush();
            logger.info("WeChatRedirectController》》》》writeProductCallNumber》》》》》写入文本成功！！！》》》新的访问次数newNumber:"+ newNumber);
        } catch (IOException e) {
            e.printStackTrace();
        }finally{
            if(fw != null){
                try {
                    fw.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }


    /**
     * 读取商品访问次数
     * @param file 文件地址
     */
    public String readProductVisitNumber(File file) {
        StringBuilder result = new StringBuilder();
        try {
            //判断text是否存在，不存在就创建出一个
            if (!file.exists()) {
                file.createNewFile();
            }
            BufferedReader br = new BufferedReader(new FileReader(file));//构造一个BufferedReader类来读取文件
            String s = null;
            while ((s = br.readLine()) != null) {//使用readLine方法，一次读一行
                result.append(System.lineSeparator() + s);
            }
            br.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        logger.info("WeChatRedirectController》》》》readProductCallNumber》》》》》读取商品访问次数文本成功！！！》》》原访问次数:"+ result.toString());
        return result.toString();
    }



    /**
     * 分享好友优惠券
     *
     * @throws IOException
     */
    @RequestMapping(value = "/receiveShareCoupon/{couponShareCode}", method = RequestMethod.GET)
    public void receiveShareCoupon(HttpServletResponse response,@PathVariable String couponShareCode) throws IOException {
        System.out.println("跳转的页面" + webRoot + "/#/coupon/receiveShareCoupon/" + couponShareCode );
        response.sendRedirect(webRoot+"/#/coupon/receiveShareCoupon/" + couponShareCode );
    }


    /**
     * 金康年中618
     *
     * @throws IOException
     */
    @RequestMapping(value = "/yearMetaphase", method = RequestMethod.GET)
    public void yearMetaphase(HttpServletResponse response) throws IOException {
        // http://v.etaoyao.com/wap/redirect/yearMetaphase
        System.out.println("跳转的页面：" + webRoot+"/#/activity/yearMetaphase" );
        response.sendRedirect(webRoot+"/#/activity/yearMetaphase" );
    }



}
