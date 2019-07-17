package com.imall.crm.web.wechat;

import com.google.zxing.WriterException;
import com.imall.crm.commons.dicts.BooleTypeEnum;
import com.imall.crm.commons.global.Global;
import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.utils.JsonUtils;
import com.imall.crm.commons.utils.QRCodeUtil;
import com.imall.crm.commons.web.DefaultWebContext;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.commons.web.WebContextFactory;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.module.wechat.protocol.WeChatPageAuthorizationResultProtocol;
import com.imall.crm.module.wechat.protocol.WeChatParamQRCodeProtocol;
import com.imall.crm.module.wechat.protocol.wap.WapMemberActivateProtocol;
import com.imall.crm.module.wechat.protocol.wap.WapMemberActivateTickerProtocol;
import com.imall.crm.module.wechat.protocol.wap.WapUserBindMemberCardProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Created by frt on 2018/3/22.
 */
@Controller
@RequestMapping("/wxapi")
public class WeChatApiController extends BaseController {
    private static final Logger logger = Logger.getLogger(WeChatApiController.class);

    @Autowired
    private FileResolver fileResolver;
    @Value("${crm.wechat.qr.code.spec:258X258,344X344,430X430,860X860,1280X1280}")
    private String weChatQrCodeSpec;
    @Value("${crm.web.root}")
    private String webRoot;


    /**
     * 获取临时参数二维码
     * @return
     * @throws IOException
     * @throws WriterException
     */
    @RequestMapping(value = "/getTemporaryQRCode", method = RequestMethod.GET)
    @ResponseBody
    public Object getTemporaryQRCode(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String sceneStr) throws IOException, WriterException {
        String url = getServicePath() + "/wxapi/getTemporaryQRCodeInfo?chainId={chainId}&sceneStr={sceneStr}&isForever={isForever}";
        CrmResponse<WeChatParamQRCodeProtocol> crmResponse = restTemplate.getForObject(url, CrmResponse.class, currentUser.getChainId(), sceneStr, false);
        if(crmResponse.isHasException()){
            return handleResponse(crmResponse);
        }else{
            WeChatParamQRCodeProtocol weChatParamQRCodeProtocol = crmResponse.getData();
            File logo = null;
            DataInputStream dataInputStream = null;
            FileOutputStream fileOutputStream = null;
            File tmp = new File((fileResolver.getTmpPath()));
            if(StringUtils.isNotBlank(weChatParamQRCodeProtocol.getHeadImgUrl())){
                try {
                    URL imgUrl = new URL(weChatParamQRCodeProtocol.getHeadImgUrl());
                    dataInputStream = new DataInputStream(imgUrl.openStream());

                    ByteArrayOutputStream output = new ByteArrayOutputStream();
                    byte[] buffer = new byte[1024];
                    int length;
                    while ((length = dataInputStream.read(buffer)) > 0) {
                        output.write(buffer, 0, length);
                    }

                    String fileName = UUID.randomUUID().toString();
                    if(!tmp.exists()){
                        tmp.mkdirs();
                    }
                    logo = File.createTempFile(String.valueOf(System.currentTimeMillis()), fileName, tmp);
                    fileOutputStream = new FileOutputStream(logo);
                    fileOutputStream.write(output.toByteArray());
                } catch (IOException e) {
                    e.printStackTrace();
                }finally {
                    if(dataInputStream!=null){
                        try {
                            dataInputStream.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }

                    if(fileOutputStream!=null){
                        try {
                            fileOutputStream.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }

            String qrCodeFileName = UUID.randomUUID().toString() + ".png";
            File qrCodeTempFile = File.createTempFile(String.valueOf(System.currentTimeMillis()), qrCodeFileName, tmp);
            QRCodeUtil.encode(weChatParamQRCodeProtocol.getQrCodeUrl(), qrCodeTempFile, logo, 1280);
            FileResolver.FileProtocol fileProtocol = fileResolver.new FileProtocol();
            fileProtocol.setChainId(currentUser.getChainId());
            fileProtocol.setFile(qrCodeTempFile);
            fileProtocol.setFileName(qrCodeFileName);
            fileProtocol.setImgSpec(weChatQrCodeSpec);
            fileResolver.saveFile(fileProtocol);

            return handleResponse(fileProtocol.getWebUrl());
        }
    }

    @RequestMapping(value = "/receivePageAuthorizationCode")
    public void receivePageAuthorizationCode(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, HttpServletRequest request, WeChatPageAuthorizationResultProtocol protocol) throws IOException {
        DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();

        logger.info("微信页面授权回调结果：" + JsonUtils.toJsonString(protocol));
        if(StringUtils.isBlank(protocol.getCode())){//用户禁止授权
            logger.info("用户禁止授权");
            ctx.setSessionAttr(Global.WE_CHAT_HAD_AUTO_LOGIN, BooleTypeEnum.Y.toCode(), currentUser.getChainId());
            ctx.getResponse().sendRedirect("/");
        }else{//用户允许授权
            logger.info("用户允许授权");
            //获取微信用户信息
            protocol.setChainId(currentUser.getChainId());
            CrmResponse weChatUserInfoResponse = restTemplate.postForObject(getServicePath() + "/wxapi/getWeChatUserInfo", protocol, CrmResponse.class);

            if(!weChatUserInfoResponse.isHasException() && weChatUserInfoResponse.getData()!=null){
                WeChatCurrentUserProtocol resultProtocol = (WeChatCurrentUserProtocol)weChatUserInfoResponse.getData();
                logger.info("获取微信用户信息>>receivePageAuthorizationCode>>" + resultProtocol.toString());
                //保存登录信息到上下文中
                WeChatCurrentUserProtocol currentUserProtocol = ctx.getWeChatUserInfo(currentUser.getChainId());
                currentUserProtocol.setMemberId(resultProtocol.getMemberId());
                currentUserProtocol.setOpenId(resultProtocol.getOpenId());
                currentUserProtocol.setIsSubscriptionWechat(resultProtocol.getIsSubscriptionWechat());
                currentUserProtocol.setIconFileId(resultProtocol.getIconFileId());
                currentUserProtocol.setChainId(resultProtocol.getChainId());
                currentUserProtocol.setRedirectUrl(resultProtocol.getRedirectUrl());
                // 解决微信开卡state过长的问题
                if (StringUtils.isNotBlank(protocol.getState())) {
                    String[] stateArr = protocol.getState().split("\\?");
                    ServletContext servletContext = request.getSession().getServletContext();
                    String param = stateArr.length > 1 ? "?" + servletContext.getAttribute(stateArr[1]) : "";
                    protocol.setState(stateArr[0] + param);
                    logger.info("解决微信开卡state过长的问题,执行真正请求：" + protocol.getState());
                }
                if(StringUtils.isBlank(protocol.getState())){
                    logger.info( "跳转网址：/#/member/memberLoginIn");
                    ctx.setSessionAttr(Global.WE_CHAT_HAD_AUTO_LOGIN, BooleTypeEnum.Y.toCode(), currentUser.getChainId());
                    ctx.getResponse().sendRedirect("/#/member/memberLoginIn");
                }else{
                    logger.info( "跳转网址：" + protocol.getState());
                    ctx.setSessionAttr(Global.WE_CHAT_HAD_AUTO_LOGIN, BooleTypeEnum.Y.toCode(), currentUser.getChainId());
                    ctx.getResponse().sendRedirect(protocol.getState());
                }
            }else{
                logger.info("无法获取微信用户信息");
                ctx.setSessionAttr(Global.WE_CHAT_HAD_AUTO_LOGIN, BooleTypeEnum.Y.toCode(), currentUser.getChainId());
                ctx.getResponse().sendRedirect("/");
            }
        }
    }

    @RequestMapping(value = "/getJSSDKConfig")
    @ResponseBody
    public Object getJSSDKConfig(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String url){
        logger.info("=================currentUrl:" + url);
        Long chainId = currentUser.getChainId();
        CrmResponse crmResponse = restTemplate.getForObject(getServicePath() + "/wxapi/getJSSDKConfig?chainId={chainId}&currentUrl={currentUrl}", CrmResponse.class, chainId, url);
        return handleResponse(crmResponse);
    }


    /**
     * 微信会员卡回调接口
     * 步骤1:微信用户填写会员信息后点击"激活会员卡",微信触发该回调跳转到开发者页面进行处理
     *
     * @param request
     * @throws IOException
     */
    @RequestMapping(value = "/wxUrl", method = RequestMethod.GET)
    public void getWechatMemberCardReturnUrl(HttpServletResponse response, HttpServletRequest request) throws IOException {
        logger.info( "跳转的页面" +webRoot  + "/#/card?" + request.getQueryString());
        response.sendRedirect(webRoot  + "/#/card?" + request.getQueryString());
    }


    /**
     * 获取会员注册信息
     * 步骤2:用户触发该回调跳到开发者页面后,该页面通过该接口获取用户填写的会员信息
     * @param currentUser
     * @return
     */
    @RequestMapping(value = "/getWapMemberRegisterInfo", method = RequestMethod.POST)
    @ResponseBody
    public Object getWapMemberRegisterInfo(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapMemberActivateTickerProtocol wapMemberActivateTickerProtocol) {

        Map<String, String> params = new HashMap<>(2);
        params.put("chainId", currentUser.getChainId().toString());
        params.put("activateTicket", wapMemberActivateTickerProtocol.getActivateTicket());
        CrmResponse crmResponse = restTemplate.postForObject(getServicePath() + "/wxapi/getWapMemberRegisterInfo", params, CrmResponse.class);
        return handleResponse(crmResponse);
    }

    /**
     * 开发者后台生成会员
     * 步骤3:用户确认开发者页面上填写的会员信息无误,点击生成会员,开发者后台创建会员,调用微信接口激活指定预设卡号等操作,此时会员卡领取成功
     * @param currentUser
     * @param wapMemberActivateProtocol
     * @return
     */
    @RequestMapping(value = "/activateMemberCard", method = RequestMethod.POST)
    @ResponseBody
    public Object activateMemberCard(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapMemberActivateProtocol wapMemberActivateProtocol) {
        wapMemberActivateProtocol.setChainId(currentUser.getChainId());
        CrmResponse<WapUserBindMemberCardProtocol> crmResponse = restTemplate.postForObject(getServicePath() + "/wxapi/activateMemberCard", wapMemberActivateProtocol, CrmResponse.class);
        if(crmResponse.isHasException()){
           return handleResponse(crmResponse);
        }

        WapUserBindMemberCardProtocol wapUserBindMemberCardProtocol = crmResponse.getData();
        WeChatCurrentUserProtocol currentUserProtocol = wapUserBindMemberCardProtocol.getWapUserLoginProtocol();
        logger.info("============================saveAndLogin:登录成功，该会员为"+currentUserProtocol.getMemberId());
        currentUser.setMemberId(currentUserProtocol.getMemberId());
        currentUser.setIsSubscriptionWechat(currentUserProtocol.getIsSubscriptionWechat());
        currentUser.setIconFileId(currentUserProtocol.getIconFileId());
        DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();
        ctx.setWeChatUserInfo(currentUser, currentUser.getChainId());
        //登录成功，重定向到首页
        logger.info("============================saveAndLogin:登录成功，重定向到首页"+currentUser);
        return handleResponse(wapUserBindMemberCardProtocol);
    }

}
