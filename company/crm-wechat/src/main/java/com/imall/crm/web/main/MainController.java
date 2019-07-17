package com.imall.crm.web.main;

import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.SimpleDateFormat;
import java.util.Date;


@Controller
public class MainController extends BaseController {
    private Logger logger = Logger.getLogger(MainController.class);
    /**
     * 首页
     */
    @RequestMapping("/")
    public String index() {
        return "build/index.html";
    }

    @RequestMapping("/wap/systemTime")
    @ResponseBody
    public Object getSystemTime(){
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        return simpleDateFormat.format(new Date() );
    }

    @ResponseBody
    @RequestMapping(value = "/wap/findLogistics", method = RequestMethod.GET)
    public Object findLogistics(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUserProtocol, String logisticsOrderNum, String logisticsCompanyCode) {
        String url = getServicePath() + "logistics/findLogistics?chainId={chainId}&shipperCode={logisticsCompanyCode}&logisticCode={logisticsOrderNum}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class, weChatCurrentUserProtocol.getChainId(), logisticsCompanyCode, logisticsOrderNum);
        return handleResponse(crmResponse);
    }
}