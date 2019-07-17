package com.imall.crm.commons.file;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

/**
 * Created by frt on 2018/1/16.
 * 文件管理
 */
@Controller
@RequestMapping("/wap/file")
public class FileController extends BaseController {
    @Autowired
    private FileResolver fileResolver;

    /**
     * 文件上传
     * @param uploadFile 文件
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping(value = "/uploadFile", method = RequestMethod.POST)
    public Object uploadFile(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestParam(value = "file") MultipartFile uploadFile, String fileName) throws IOException {
        File tmp = new File((fileResolver.getTmpPath()));
        if(!tmp.exists()){
            tmp.mkdirs();
        }

        if (StringUtils.isBlank(fileName)) {
           fileName = uploadFile.getOriginalFilename();
        }
        File tmpFile = File.createTempFile(String.valueOf(System.currentTimeMillis()), uploadFile.getName(), tmp);
        uploadFile.transferTo(tmpFile);

        FileResolver.FileProtocol fileProtocol = fileResolver.new FileProtocol();
        fileProtocol.setChainId(currentUser.getChainId());
        fileProtocol.setFile(tmpFile);
        fileProtocol.setFileName(fileName);

        return fileResolver.saveFile(fileProtocol);
    }

    /**
     * 获取文件网络地址
     * @param fileId 文件 ID
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getFileWebUrl", method = RequestMethod.GET)
    public String getFileWebUrl(String fileId){
        return fileResolver.getWebUrl(fileId);
    }

    /**
     * 获取指定规格图片地址
     * @param fileId fileId 文件 ID
     * @param spec 规格
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getSmallImgUrl", method = RequestMethod.GET)
    public String getSmallImgUrl(String fileId, String spec){
        return fileResolver.getWebUrl(fileId, spec);
    }
}
