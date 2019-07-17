package com.imall.crm.web.sales;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.utils.QRCodeUtil;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.module.wechat.protocol.WeChatParamQRCodeProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.net.URL;
import java.util.UUID;

/**
 * @author ou
 */
@RestController
@RequestMapping("/wap/promoteReward")
public class WeChatMemberPromoteRewardController extends BaseController {

    @Autowired
    private FileResolver fileResolver;
    @RequestMapping("/getpromoteUrlPic")
    public Object getPublicPromoteUrl(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long  sharerId) throws Exception {

        String qrUrl = getServicePath() + "/wxapi/getTemporaryQRCodeInfo?chainId={chainId}&sceneStr={sceneStr}&isForever={isForever}";
        String sceneStr = sharerId==null?"":("promoterMemberId:" + sharerId) ;
        CrmResponse<WeChatParamQRCodeProtocol> crmResponse = restTemplate.getForObject(qrUrl, CrmResponse.class, currentUser.getChainId(), sceneStr, true);
        if (crmResponse.isHasException()) {
            return handleResponse(crmResponse);
        } else {
            WeChatParamQRCodeProtocol weChatParamQRCodeProtocol = crmResponse.getData();
            File logo = null;
            DataInputStream dataInputStream = null;
            FileOutputStream fileOutputStream = null;
            File tmp = new File((fileResolver.getTmpPath()));
            if (StringUtils.isNotBlank(weChatParamQRCodeProtocol.getHeadImgUrl())) {
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
                    if (!tmp.exists()) {
                        tmp.mkdirs();
                    }
                    logo = File.createTempFile(String.valueOf(System.currentTimeMillis()), fileName, tmp);
                    fileOutputStream = new FileOutputStream(logo);
                    fileOutputStream.write(output.toByteArray());
                } catch (IOException e) {
                    e.printStackTrace();
                } finally {
                    if (dataInputStream != null) {
                        try {
                            dataInputStream.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }

                    if (fileOutputStream != null) {
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
            fileProtocol.setImgSpec("258X258");
            fileResolver.saveFile(fileProtocol);



            return fileResolver.getWebUrl(fileProtocol.getFileId(), "258X258");
        }
}

    /**
     * 获取列表
     */
    @RequestMapping(value = "/getPromoterList", method = RequestMethod.GET)
    @ResponseBody
    public Object getPromoterList(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser) {
        if (weChatCurrentUser.getMemberId() == null) {
            return "";
        }
        String url = getServicePath() + "/wap/wechatPromoteShareRecord/listWapWechatPromoteShareRecordProtocol?chainId={chainId}&memberId={memberId}";
        return handleResponse(restTemplate.getForObject(url, CrmResponse.class, weChatCurrentUser.getChainId(), weChatCurrentUser.getMemberId()));
    }
    /**
     * 获取登录用户Id
     */
    @RequestMapping(value = "/getLoginMemberId", method = RequestMethod.GET)
    @ResponseBody
    public Object getLoginMemberId(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser) {
        return weChatCurrentUser.getMemberId();
    }
}
