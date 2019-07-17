package com.imall.crm.web.member;

import com.imall.crm.commons.dicts.BooleTypeEnum;
import com.imall.crm.commons.global.RegExp;
import com.imall.crm.commons.utils.BigDecimalUtil;
import com.imall.crm.commons.utils.DateTimeUtils;
import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.utils.MD5Utils;
import com.imall.crm.commons.web.DefaultWebContext;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.commons.web.WebContextFactory;
import com.imall.crm.module.commons.ErrorCode;
import com.imall.crm.module.commons.base.protocol.BusinessException;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.commons.base.protocol.NormalPageProtocol;
import com.imall.crm.module.member.protocol.MemberSaveOrUpdateProtocol;
import com.imall.crm.module.member.protocol.wap.WapMemberProtocol;
import com.imall.crm.module.sales.protocol.CouponPermissionSearchProtocol;
import com.imall.crm.module.sales.protocol.wap.WapCouponApplyProductSearchProtocol;
import com.imall.crm.module.sales.protocol.wap.WapCouponDetailsProtocol;
import com.imall.crm.module.sales.protocol.wap.WapMemberCouponSearchProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.module.wechat.protocol.WeChatParamQRCodeProtocol;
import com.imall.crm.module.wechat.protocol.wap.WapUserLoginProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.regex.Pattern;

/**
 * wap 用户中心
 * Created by caixuan on 2018/3/29.
 * Time 15:53
 */
@RestController
@RequestMapping("/wap/member")
public class WapMemberController extends BaseController {
    private final Logger logger = Logger.getLogger(WapMemberController.class);

    @Autowired
    private FileResolver fileResolver;

    /**
     * 会员优惠券列表
     * @param currentUser
     * @param protocol
     * @return
     */
    @RequestMapping(value = "/findMemberCoupon", method = {RequestMethod.GET})
    public Object findMemberCoupon(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, CouponPermissionSearchProtocol protocol) {
        CouponPermissionSearchProtocol searchProtocol = new CouponPermissionSearchProtocol();
        BeanUtils.copyProperties(protocol, searchProtocol);
        BeanUtils.copyProperties(currentUser, searchProtocol);
        String url = getServicePath() + "wap/couponPermission/findMemberCouponPermission";
        return handleResponse(restTemplate.postForObject(url,searchProtocol, CrmResponse.class));
    }
    /**
     * 会员优惠券列表
     * @param currentUser
     * @return
     */
    @RequestMapping(value = "/getWechatCardUrl", method = {RequestMethod.GET})
    public Object getWechatCardUrl(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser) {
        Long shopId = 1L;//todo:olx 给个默认值，不然这个方法无法处理shopID缺失的问题

        String qrUrl = getServicePath() + "/wxapi/geMemberCardCodeMoreSpecifications?chainId={chainId}&shopId={shopId}";
        WeChatParamQRCodeProtocol weChatParamQRCodeProtocol = new WeChatParamQRCodeProtocol();
        CrmResponse forObject = restTemplate.getForObject(qrUrl, CrmResponse.class, currentUser.getChainId(), shopId);
        if(forObject.isHasException()){
            return "";
        }
        return handleResponse(forObject);
    }

    /**
     * 获取会员权益
     */
    @RequestMapping(value = "/findMemberInterestsByLevelId/{levelId}")
    public Object findMemberInterestsByLevelId(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @PathVariable Long levelId) {
        String url = getServicePath() + "/wap/memberInterests/findMemberInterestsByLevelId?levelId={levelId}&chainId={chainId}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, levelId, currentUser.getChainId()));
    }

    /**
     * 获取会员等级
     */
    @RequestMapping(value = "/memberLevelList")
    public Object memberLevelList(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser) {
        String url = getServicePath() + "/wap/memberLevel/listByChainId?chainId={chainId}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId()));
    }

    /**
     * 获取会员中心会员信息
     */
    @RequestMapping(value = "/findMemberInfo")
    public Object findMemberInfo(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser) {
        String url = getServicePath() + "/wap/member/findMemberInfo?chainId={chainId}&memberId={memberId}";
        CrmResponse crmResponse = restTemplate.postForObject(url, null, CrmResponse.class, currentUser.getChainId(), currentUser.getMemberId());
        return handleResponse(crmResponse);
    }

    /**
     * 修改手机号码
     */
    @RequestMapping(value = "/changeMobile", method = RequestMethod.POST)
    public Object changePhone(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String mobile) {
        String url = getServicePath() + "/wap/member/changeMobile?chainId={chainId}&memberId={memberId}&mobile={mobile}";
        CrmResponse crmResponse = restTemplate.postForObject(url, null, CrmResponse.class, currentUser.getChainId(), currentUser.getMemberId(), mobile);
        return handleResponse(crmResponse);
    }

    /**
     * 校验验证码
     */
    @RequestMapping(value = "/validateCode")
    public Object validateCode(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String mobile, String validCode) {
        String url = getServicePath() + "/wap/validateCodeLog/checkValidateCode?chainId={chainId}&mobile={mobile}&validateCode={validCode}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId(), mobile, validCode));
    }


    /**
     * 查看手机号是否已经注册，如果已经注册，直接登录；如果没有，则需要进一步完善信息
     * @param userLoginProtocol
     * @return
     */
    @RequestMapping(value = "/checkMember", method = RequestMethod.POST)
    public Object checkMember(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapUserLoginProtocol userLoginProtocol) {
        if(!Pattern.matches(RegExp.MOBILE, userLoginProtocol.getMobile())){
            throw new BusinessException(ErrorCode.MOBILE_PHONE_ERROR);
        }

        String checkUrl = getServicePath() + "/wap/validateCodeLog/checkValidateCode?mobile={mobile}&validateCode={validateCode}&chainId={chainId}";
        CrmResponse validateCodeResponse = restTemplate.getForObject(checkUrl, CrmResponse.class, userLoginProtocol.getMobile(), userLoginProtocol.getValidateCode(), currentUser.getChainId());
        if(validateCodeResponse.isHasException()){
            return handleResponse(validateCodeResponse);
        }

        userLoginProtocol.setChainId(currentUser.getChainId());
        userLoginProtocol.setOpenId(currentUser.getOpenId());
        CrmResponse<WapMemberProtocol> crmResponse = restTemplate.postForObject(getServicePath() + "/wap/member/findByChainIdAndMobile", userLoginProtocol, CrmResponse.class);
        if(crmResponse.getData()!=null){//当前连锁已经存在这个用户，直接登录
            logger.info("=========================当前连锁已经存在这个用户，直接登录");
            DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();
            WapMemberProtocol memberProtocol = crmResponse.getData();
            currentUser.setMemberId(memberProtocol.getMemberId());
            currentUser.setIsSubscriptionWechat(memberProtocol.getIsSubscriptionWechat());
            currentUser.setIconFileId(memberProtocol.getIconFileId());
            currentUser.setOpenId(memberProtocol.getOpenId());
            ctx.setWeChatUserInfo(currentUser, currentUser.getChainId());
            logger.info("============================checkMember:登录成功，重定向到首页");
            return handleResponse(BooleTypeEnum.Y.toCode());
        }

        //当前连锁不存在这个用户
        return handleResponse(BooleTypeEnum.N.toCode());
    }

    /**
     * 保存并登录
     * @param loginProtocol
     * @throws IOException
     */
    @RequestMapping(value = "/saveAndLogin", method = RequestMethod.POST)
    public void saveAndLogin(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapUserLoginProtocol loginProtocol) throws IOException {
        DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();
        MemberSaveOrUpdateProtocol protocol = new MemberSaveOrUpdateProtocol();
        protocol.setName(loginProtocol.getName());
        protocol.setChainId(currentUser.getChainId());
        protocol.setMobile(loginProtocol.getMobile());
        protocol.setOpenId(currentUser.getOpenId());
        protocol.setIsSubscriptionWechat(currentUser.getIsSubscriptionWechat());
        logger.info("=============================保存用户注册信息：" + protocol.toString());
        CrmResponse<WeChatCurrentUserProtocol> crmResponse = restTemplate.postForObject(getServicePath() + "/wap/member/saveMemberForWeChatSignUp", protocol, CrmResponse.class);
        if(crmResponse.isHasException()){
            handleResponse(crmResponse);
        }

        WeChatCurrentUserProtocol currentUserProtocol = crmResponse.getData();
        currentUser.setMemberId(currentUserProtocol.getMemberId());
        currentUser.setIsSubscriptionWechat(currentUserProtocol.getIsSubscriptionWechat());
        currentUser.setIconFileId(currentUserProtocol.getIconFileId());
        ctx.setWeChatUserInfo(currentUser, currentUser.getChainId());
        //登录成功，重定向到首页
        logger.info("============================saveAndLogin:登录成功，重定向到首页");
    }

    @RequestMapping("/getCurrentMember")
    @ResponseBody
    public Object getCurrentMember(@WeChatCurrentUser WeChatCurrentUserProtocol currentUserProtocol){
        return currentUserProtocol;
    }

    /**
     * 获取会员手机号
     */
    @GetMapping(value = "/getMemberMobile")
    public Object getMemberMobile(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        String url = getServicePath() + "/wap/member/getMemberMobile?memberId={memberId}&chainId={chainId}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, currentUser.getMemberId(), currentUser.getChainId()));
    }

    /**
     * 修改密码
     */
    @PostMapping("/updatePayPassword")
    public Object updatePayPassword(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapMemberProtocol protocol){
        protocol.setMemberId(currentUser.getMemberId());
        protocol.setChainId(currentUser.getChainId());
        protocol.setEncryptedPassword(MD5Utils.getMD5String(protocol.getEncryptedPassword()));
        String url = getServicePath() + "/wap/member/updatePayPassword";
        return handleResponse(restTemplate.postForObject(url, protocol, CrmResponse.class));
    }

    /**
     * 修改密码
     */
    @PostMapping("/checkPayPassWord")
    public Object checkPayPassWord(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapMemberProtocol protocol){
        protocol.setMemberId(currentUser.getMemberId());
        protocol.setChainId(currentUser.getChainId());
        protocol.setEncryptedPassword(MD5Utils.getMD5String(protocol.getEncryptedPassword()));
        String url = getServicePath() + "/wap/member/checkPayPassWord";
        return handleResponse(restTemplate.postForObject(url, protocol, CrmResponse.class));
    }

    /**
     * 检查该用户是否已设置支付密码
     */
    @GetMapping(value = "/checkMemberPayPasswordIsExist")
    public Object checkMemberPayPasswordIsExist(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser) {
        String url = getServicePath() + "/wap/member/checkMemberPayPasswordIsExist?memberId={memberId}&chainId={chainId}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, currentUser.getMemberId(), currentUser.getChainId()));
    }


    /**
     * 新会员优惠券列表
     * @param currentUser
     * @return
     */
    @RequestMapping(value = "/pageNewMemberCoupon", method = {RequestMethod.POST})
    public Object pageNewMemberCoupon(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser,@RequestBody WapMemberCouponSearchProtocol wapMemberCouponSearchProtocol) {
        WapMemberCouponSearchProtocol searchProtocol = new WapMemberCouponSearchProtocol();
        BeanUtils.copyProperties(wapMemberCouponSearchProtocol, searchProtocol);
        BeanUtils.copyProperties(currentUser, searchProtocol);
        String url = getServicePath() + "wap/couponPermission/pageNewMemberCoupon";
        return handleResponse(restTemplate.postForObject(url,searchProtocol, CrmResponse.class));
    }

    /**
     * 会员优惠券详情
     */
    @RequestMapping(value = "/findMemberCouponDetails", method = {RequestMethod.GET})
    public Object findMemberCouponDetails(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long couponPermissionId) {
        String url = getServicePath() + "wap/couponPermission/findMemberCouponDetails?chainId={chainId}&memberId={memberId}&couponPermissionId={couponPermissionId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class,currentUser.getChainId(),currentUser.getMemberId(), couponPermissionId);
        if(null != crmResponse.getData()){
            WapCouponDetailsProtocol couponDetails = (WapCouponDetailsProtocol) crmResponse.getData();
            couponDetails.setFileId(fileResolver.getWebUrl(couponDetails.getFileId()));
            couponDetails.setAdvertisementImg(fileResolver.getWebUrl(couponDetails.getAdvertisementImg()));
        }
        return handleResponse(crmResponse);
    }

    /**
     * 优惠券 适用商品 分页列表
     */
    @RequestMapping(value = "/pageCouponApplyProduct", method = RequestMethod.POST)
    public Object pageCouponApplyProduct(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapCouponApplyProductSearchProtocol searchProtocol) {
        searchProtocol.setChainId(currentUser.getChainId());
        CrmResponse crmResponse = restTemplate.postForObject(getServicePath() + "/wap/couponPermission/pageCouponApplyProduct", searchProtocol, CrmResponse.class);
        if (crmResponse.isHasException()) {
            return handleResponse(crmResponse);
        }
        if (null != crmResponse.getData()){
            NormalPageProtocol pageProtocol = (NormalPageProtocol)crmResponse.getData();
            List<LinkedHashMap<String, String>> linkedHashMapList = pageProtocol.getData();
            for(LinkedHashMap<String, String> linkedHashMap : linkedHashMapList){
                if (StringUtils.isNotBlank(linkedHashMap.get("picture"))) {
                    linkedHashMap.put("picture", fileResolver.getWebUrl(linkedHashMap.get("picture")));
                }
            }
        }
        return handleResponse(crmResponse);
    }


    /**
     * 会员优惠券适用门店
     */
    @RequestMapping(value="/getMemberApplyShopList",method= RequestMethod.GET)
    @ResponseBody
    public Object getMemberApplyShopList(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long couponId, String mapLocation){
        String requestUrl = getServicePath() + "/wap/shop/getMemberApplyShopList?couponId={couponId}&chainId={chainId}&useMapLocation={useMapLocation}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl ,CrmResponse.class, couponId, currentUser.getChainId(), mapLocation );
        List<LinkedHashMap<String, String>> wapShopProtocolHashMap = (ArrayList) crmResponse.getData();
        if(CollectionUtils.isNotEmpty(wapShopProtocolHashMap)){
            for (LinkedHashMap<String, String> linkedHashMap : wapShopProtocolHashMap) {
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
     * 完善会员信息-保存会员姓名和会员身份证
     */
    @RequestMapping(value="/saveMemberNameAndIdentityNumber",method= RequestMethod.GET)
    @ResponseBody
    public Object saveMemberNameAndIdentityNumber(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String name, String identityNumber){
        String requestUrl = getServicePath() + "/wap/member/saveMemberNameAndIdentityNumber?memberId={memberId}&chainId={chainId}&name={name}&identityNumber={identityNumber}";
        CrmResponse crmResponse = restTemplate.getForObject(requestUrl ,CrmResponse.class,currentUser.getMemberId(),currentUser.getChainId(),name,identityNumber);
        return handleResponse(crmResponse);
    }


    /**
     * 查询会员账单
     * @param currentUser 会员登录信息
     * @param month 查询账单日期
     * @return 账单明细
     */
    @GetMapping("/findAccountTransLog")
    public Object findAccountTransLog(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String month){
        String url = getServicePath() + "wap/accountTransLog/findAccountTransLog?memberId={memberId}&month={month}";
        return handleResponse(restTemplate.getForObject(url,CrmResponse.class,currentUser.getMemberId(),month));
    }

    /**
     * 查询会员账单详情
     */
    @GetMapping("/findAccountTransLogDetails")
    public Object findAccountTransLogDetails(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long transLogId){
        String url = getServicePath() + "wap/accountTransLog/findAccountTransLogDetails?memberId={memberId}&transLogId={transLogId}";
        return handleResponse(restTemplate.getForObject(url,CrmResponse.class,currentUser.getMemberId(),transLogId));
    }

    /**
     * 获取系统时间
     */
    @GetMapping("/getSystemTime")
    public Object getSystemTime() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return simpleDateFormat.format(new Date());
    }
}
