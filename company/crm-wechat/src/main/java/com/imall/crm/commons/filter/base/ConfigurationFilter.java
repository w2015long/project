package com.imall.crm.commons.filter.base;

import com.imall.crm.commons.filter.WeChatAutoLoginFilter;
import com.imall.crm.commons.filter.WebContextFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 统一配置过滤器，定义前面的过滤器会先执行
 */
@Configuration
public class ConfigurationFilter {

    @Bean
    public FilterRegistrationBean webContextFilterRegistration(@Autowired WebContextFilter webContextFilter) {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(webContextFilter);
        registration.addUrlPatterns("/*");
        registration.setName("webContextFilter");
        return registration;
    }

    @Bean
    public FilterRegistrationBean weChatAutoLoginFilterRegistration(@Autowired WeChatAutoLoginFilter weChatAutoLoginFilter) {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(weChatAutoLoginFilter);
        registration.addUrlPatterns("/", "/wap/redirect/*", "/wxapi/wxUrl");
        registration.setName("weChatAutoLoginFilter");
        return registration;
    }

}
