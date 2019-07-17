package com.imall.crm.web.base;

import com.imall.crm.module.commons.base.protocol.CrmResponse;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;


public class BaseController {
    @Value("${api-crm-service-path}")
    private String servicePath;
    @Autowired
    protected RestTemplate restTemplate;

    protected String getServicePath(){
        return servicePath;
    }

    protected Object handleResponse(Object result){
        if (result instanceof CrmResponse) {
            CrmResponse crmResponse = (CrmResponse) result;
            if (crmResponse.isHasException()) {
                //获取本次请求对应的response
                ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
                HttpServletResponse response = requestAttributes.getResponse();
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                return crmResponse;
            } else {
                return crmResponse.getData();
            }
        }else {
            return result;
        }
    }



    /**
     * 从request中读取post过来的数据
     */
    protected String getPostData(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        BufferedReader in = request.getReader();
        String line;
        while ((line = in.readLine()) != null) {
            sb.append(line);
        }
        in.close();
        return sb.toString();
    }

    /**
     * 获取真正的IP地址
     *
     * @param request 请求对象
     * @return IP地址
     */
    public static String getIpAddress(HttpServletRequest request) {
        String forwardedStr = request.getHeader("x-forwarded-for");
        String realIp = "";
        if (StringUtils.isNotBlank(forwardedStr)) {
            String[] ips = forwardedStr.split(",");
            for (String ip : ips) {
                if (StringUtils.isNotBlank(ip) && !"unknown".equals(ip)) {
                    realIp = ip;
                }
            }
        }
        return StringUtils.isBlank(realIp) ? request.getRemoteAddr() : realIp;
    }
}
