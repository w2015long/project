package com.imall.crm.web.msg;

import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.msg.protocol.InfoProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
/**
 * Created by zhongzheng on 2018/8/15.
 */
@Controller
@RequestMapping("/wap/info")
public class WapInfoController extends BaseController {

    /**
     * 资讯分页
     * @param infoProtocol
     * @return
     */
    @RequestMapping(value = "/pageInfo", method = RequestMethod.POST)
    @ResponseBody
    public Object pageInfo(@RequestBody InfoProtocol infoProtocol, @WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser  ){
        InfoProtocol protocol = new InfoProtocol();
        BeanUtils.copyProperties(infoProtocol,protocol);
        protocol.setChainId(weChatCurrentUser.getChainId());
        CrmResponse crmResponse = restTemplate.postForObject(getServicePath() + "info/pageInfo",protocol,CrmResponse.class);
        return handleResponse(crmResponse);

    }

    /**
     * 查询咨询分类
     * @return
     */
    @RequestMapping(value = "/listInfoCategory", method = RequestMethod.GET)
    @ResponseBody
    public Object listInfoCategory( @WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser){
        return handleResponse(restTemplate.getForObject(getServicePath() + "infoCategory/listInfoCategory?chainId={chainId}", CrmResponse.class, weChatCurrentUser.getChainId()));
    }
    /**
     * 详情
     *
     * @return
     */
    @RequestMapping(value = "/findByInfoId", method = RequestMethod.GET)
    @ResponseBody
    public Object findByInfoId(@WeChatCurrentUser WeChatCurrentUserProtocol weChatCurrentUser, Long infoId) {
        CrmResponse crmResponse = restTemplate.getForObject(getServicePath() + "info/findByInfoId?chainId={chainId}&infoId={infoId}", CrmResponse.class, weChatCurrentUser.getChainId(), infoId);
        return handleResponse(crmResponse);
    }
}
