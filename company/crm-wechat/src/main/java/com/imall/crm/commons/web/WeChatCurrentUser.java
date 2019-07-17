package com.imall.crm.commons.web;

import java.lang.annotation.*;

/**
 * Created by frt on 2018/3/21.
 */
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface WeChatCurrentUser {
    String value() default "";
}
