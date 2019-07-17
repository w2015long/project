package com.imall.crm.web.msg;

import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.msg.protocol.MemberComplaintProtocol;
import com.imall.crm.web.base.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Administrator on 2018/3/20.
 */
@Controller
@RequestMapping(value="/memberComplaint")
public class MemberComplaintController extends BaseController{

    /**
     * 微信端保存投诉建议
     */
    @RequestMapping(value="/weChatAddComplaint",method= RequestMethod.POST)
    @ResponseBody
    public Object weChatAddComplaint(@RequestBody MemberComplaintProtocol memberComplaintProtocol){
        String requestUrl = getServicePath() + "/memberComplaint/weChatAddComplaint";
        CrmResponse crmResponse = restTemplate.postForObject(requestUrl, memberComplaintProtocol, CrmResponse.class);
        return handleResponse(crmResponse);
    }

}
