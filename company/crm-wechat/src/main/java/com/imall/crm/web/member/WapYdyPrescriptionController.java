package com.imall.crm.web.member;

import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.member.protocol.wap.WapYdyInquiryDetailsProtocol;
import com.imall.crm.module.member.protocol.wap.WapYdyInquirySearchProtocol;
import com.imall.crm.module.member.protocol.wap.WapYdyPrescriptionItemProtocol;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/wap/ydyPrescription")
public class WapYdyPrescriptionController extends BaseController {

    @Autowired
    private FileResolver fileResolver;

    /**
     * 分页搜索 - 会员问诊记录
     */
    @ResponseBody
    @PostMapping(value = "/pageYdyPrescription")
    public Object pageYdyPrescription(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapYdyInquirySearchProtocol wapYdyInquirySearchProtocol) {
        wapYdyInquirySearchProtocol.setChainId(currentUser.getChainId());
        wapYdyInquirySearchProtocol.setMemberId(currentUser.getMemberId());
        CrmResponse crmResponse = restTemplate.postForObject(getServicePath() + "wap/ydyPrescription/pageYdyPrescription", wapYdyInquirySearchProtocol, CrmResponse.class);
        return handleResponse(crmResponse);
    }

    /**
     * 查询- 问诊详情
     */
    @ResponseBody
    @GetMapping(value = "/findYdyPrescriptionDetails")
    public Object findYdyPrescriptionDetails(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser,Long inquiryId){
        String url = getServicePath() + "wap/ydyPrescription/findYdyPrescriptionDetails?chainId={chainId}&inquiryId={inquiryId}&memberId={memberId}&shopId={shopId}";
        CrmResponse crmResponse = restTemplate.getForObject(url, CrmResponse.class,currentUser.getChainId(), inquiryId,currentUser.getMemberId(),currentUser.getShopId());
        WapYdyInquiryDetailsProtocol wapYdyInquiryDetailsProtocol = (WapYdyInquiryDetailsProtocol) crmResponse.getData();
        wapYdyInquiryDetailsProtocol.setPrescriptionUrl(fileResolver.getWebUrl(wapYdyInquiryDetailsProtocol.getPrescriptionFileId()));
        for ( WapYdyPrescriptionItemProtocol protocol: wapYdyInquiryDetailsProtocol.getYdyPrescriptionItemList()) {
            if(StringUtils.isNotBlank(protocol.getPictureFile())){
                protocol.setPictureFile(fileResolver.getWebUrl(protocol.getPictureFile(),"100X100"));
            }
        }
        return handleResponse(crmResponse);
    }
}
