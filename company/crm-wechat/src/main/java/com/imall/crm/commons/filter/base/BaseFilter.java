package com.imall.crm.commons.filter.base;

import com.imall.crm.commons.global.Global;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author chencheng
 * @date 2018/1/29
 * 自定义拦截器的父类
 * 使用方法：
 *          1、继承 BaseFilter
 *
 *          2、实现 doRealFilter 方法，在 doRealFilter 方法中写自己的业务逻辑，切记处理完自己的业务逻辑后，需要调用过滤链条的 doFilter 方法（重要）。示例：
 *                  filterChain.doFilter(request, response);
 *
 *          3、如果需要排除一些不需要过滤的 url，可以通过重写 BaseFilter 的 excludeUrls 方法即可，多个 url 用英文的逗号（,）隔开。示例：
 *                  @Value("${crm.filter.example.excludeUrls}")
 *                  private String excludeUrls;
 *
 *                  @Override
 *                  protected String excludeUrls() {
 *                      return excludeUrls;
 *                  }
 *
 *           4、在 com.imall.crm.commons.filter.base.ConfigurationFilter 注册过滤器，并根据实际情况，对过滤器进行排序，排在前面的先执行。实例：
 *
 *              @Bean
 *              public FilterRegistrationBean secondTestFilterRegistration(@Autowired SecondTestFilter secondTestFilter) {
 *                  FilterRegistrationBean registration = new FilterRegistrationBean();
 *                  registration.setFilter(secondTestFilter);
 *                  registration.addUrlPatterns("/*");
 *                  registration.setName("secondTestFilter");
 *                  return registration;
 *               }
 *
 *              @Bean
 *              public FilterRegistrationBean firstTestFilterRegistration(@Autowired FirstTestFilter firstTestFilter) {
 *                  FilterRegistrationBean registration = new FilterRegistrationBean();
 *                  registration.setFilter(firstTestFilter);
 *                  registration.addUrlPatterns("/*");
 *                  registration.setName("firstTestFilter");
 *                  return registration;
 *              }
 *
 *              上面的两个 Filter ，会先执行 SecondTestFilter 后执行 FirstTestFilter
 */
public abstract class BaseFilter implements Filter {

    /**
     * 拦截器具体实现，url过滤完成后执行
     * @param request 请求体
     * @param response 响应体
     * @param filterChain 拦截链
     */
    protected abstract void doRealFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)throws IOException, ServletException ;

    /**
     * 不拦截的url地址列表，多个过滤规则使用英文逗号（,）分隔
     * @return 过滤地址列表
     */
    protected String excludeUrls(){
        return null;
    }

    @Override
    public void init(FilterConfig filterConfig){

    }

    @Override
    public final void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        if(request instanceof HttpServletRequest){
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            String path = httpRequest.getServletPath();

            //如果排除，跳过当前拦截器
            if (isExclude(path)){
                filterChain.doFilter(request, response);
                return;
            }

            //否则执行拦截器
            doRealFilter(httpRequest, httpResponse, filterChain);
        }else {
            filterChain.doFilter(request, response);
        }
    }

    @Override
    public void destroy() {

    }

    /**
     * 是否排除
     */
    private boolean isExclude(String path){
        String excludeUrls = excludeUrls();
        if (StringUtils.isBlank(excludeUrls)){
            return isMatch(path, Global.FILTER_STATIC_SUFFIX);
        }else {
            return isMatch(path, Global.FILTER_STATIC_SUFFIX+excludeUrls);
        }
    }


    /**
     * 是否匹配
     * @param path 地址串
     * @param regxs 正值表达式，多个表达式使用英文逗号（,）分隔
     * @return 匹配结果
     */
    private boolean isMatch(String path, String regxs) {
        if(StringUtils.isBlank(path) || StringUtils.isBlank(regxs)){
            return false;
        }

        for(String regx : regxs.split(",")) {
            String regxTmp = regx.replaceAll("\\.", "\\\\.");
            regxTmp = regxTmp.replaceAll("\\*", "\\.*");
            if (regx.endsWith("/")) {
                regxTmp += ".*";
            }
            if (path.matches(regxTmp)) {
                return true;
            }
        }

        return false;
    }

    /**
     * TODO:frt 先写死连锁ID，后续需要考虑如何动态获取
     * @return
     */
    public Long getCurrentChainId(){
        return 1L;
    }
}
