package com.imall.crm.commons.web;

import org.springframework.stereotype.Component;
import org.springframework.web.context.ServletContextAware;

import javax.servlet.ServletContext;

/**
 *
 * Created by frt on 2018/3/19.
 */
@Component
public class WebContextFactory implements ServletContextAware {
    private static ServletContext servletContext;
    private static ThreadLocal<IWebContext> ctxStore = new ThreadLocal<>();

    @Override
    public void setServletContext(ServletContext servletContext) {
        setContext(servletContext);
    }

    public static synchronized void setContext(ServletContext servletContext) {
        WebContextFactory.servletContext = servletContext;
    }

    public static void setWebContext(IWebContext ctx) {
        ctxStore.set(ctx);
    }

    public static IWebContext getWebContext() {
        IWebContext ctx =  ctxStore.get();
        if (ctx == null) {
            ctx = new DefaultWebContext();
            setWebContext(ctx);
        }

        return  ctxStore.get();
    }
}
