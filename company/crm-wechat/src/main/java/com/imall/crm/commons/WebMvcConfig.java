package com.imall.crm.commons;

import com.imall.crm.commons.web.WeChatCurrentUserMethodArgumentResolver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.List;

/**
 * Created by frt on 2018/3/22.
 */
@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {
    private String uploadPath;//文件上传保存路径
    private String pathHandler;

    private String resetPath(String path){
        return path.replaceAll("\\\\", "/");
    }

    @Value("${crm.fileUpload.uploadPath}")
    public void setUploadPath(String uploadPath) {
        uploadPath = resetPath(uploadPath);
        if(!uploadPath.endsWith("/")){
            uploadPath = uploadPath + "/";
        }

        this.uploadPath = uploadPath;
    }

    @Value("${crm.fileUpload.pathHandler}")
    public void setPathPrefix(String pathHandler) {
        this.pathHandler = resetPath(pathHandler);
    }

    /**
     * 添加自定义的接口方法参数解析
     */
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        //添加@WeChatCurrentUser方法注解的解析处理
        argumentResolvers.add(new WeChatCurrentUserMethodArgumentResolver());
        super.addArgumentResolvers(argumentResolvers);
    }

    /**
     * 处理上传文件静态资源的访问
     * @param registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(pathHandler).addResourceLocations("file:" + uploadPath);
        super.addResourceHandlers(registry);
    }
}
