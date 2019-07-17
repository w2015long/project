package com.imall.crm.web.cart;

import com.imall.crm.commons.dicts.BooleTypeEnum;
import com.imall.crm.commons.web.CartFactory;
import com.imall.crm.commons.web.WeChatCurrentUser;
import com.imall.crm.module.cart.protocol.wap.WapNormalCartItemModifyProtocol;
import com.imall.crm.module.cart.protocol.wap.WapNormalCartItemProtocol;
import com.imall.crm.module.cart.protocol.wap.WapNormalCartProtocol;
import com.imall.crm.module.cart.protocol.wap.WapNormalCartSaveResultProtocol;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import com.imall.crm.web.base.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 普通购物车
 * Created by frt on 2018/3/23.
 */
@RestController
@RequestMapping("/wap/normalCart")
public class WapNormalCartController extends BaseController {
    private static final Logger logger = Logger.getLogger(WapNormalCartController.class);

    /**
     * 获取购物车
     * @param currentUser 当前登录的会员
     * @return
     */
    @GetMapping(value = "/getCart")
    public Object getCart(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String isCartRequest){
        return handleResponse(CartFactory.getNormalCart(currentUser, isCartRequest));
    }

    /**
     * 新增或更新购物车项
     * @param currentUser
     * @param modifyProtocol
     * @return
     */
    @PostMapping(value = "/addOrUpdateItem")
    public Object addOrUpdateItem(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapNormalCartItemModifyProtocol modifyProtocol){
        WapNormalCartProtocol normalCart = CartFactory.deepCopyCart(currentUser);
        normalCart.setIsCartRequest(BooleTypeEnum.Y.toCode());
        modifyProtocol.setMemberId(currentUser.getMemberId());
        modifyProtocol.setShopId(currentUser.getShopId());
        modifyProtocol.setChainId(currentUser.getChainId());
        modifyProtocol.setNormalCart(normalCart);

        String url = getServicePath() + "/wap/normalCart/addOrUpdateCartItem";
        CrmResponse crmResponse = restTemplate.postForObject(url, modifyProtocol, CrmResponse.class);
        if(crmResponse.isHasException()){
            return handleResponse(crmResponse);
        }

        //更新购物车
        WapNormalCartProtocol result = (WapNormalCartProtocol)crmResponse.getData();
        currentUser.setShopId(result.getCurrentShopId());
        CartFactory.updateNormalCart(currentUser, result);
        return handleResponse(CartFactory.getNormalCartFromCache(currentUser));
    }

    /**
     * 计算购物车
     * @param normalCart    普通购物车
     * @return
     */
    private Object calculateCart(WeChatCurrentUserProtocol currentUser, WapNormalCartProtocol normalCart){
        String url = getServicePath() + "/wap/normalCart/getCart";
        CrmResponse crmResponse = restTemplate.postForObject(url, normalCart, CrmResponse.class);
        if(crmResponse.isHasException()){
            return crmResponse;
        }else{
            //更新购物车
            CartFactory.updateNormalCart(currentUser, (WapNormalCartProtocol)crmResponse.getData());
            return CartFactory.getNormalCartFromCache(currentUser);
        }
    }

    /**
     * 购物车项选中状态变更
     * @param currentUser   当前会员
     * @param skuId         SKU Id
     * @return
     */
    @GetMapping(value = "/updateItemSelectStatus")
    public Object updateItemSelectStatus(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long skuId){
        WapNormalCartProtocol normalCart = CartFactory.deepCopyCart(currentUser);
        normalCart.setIsCartRequest(BooleTypeEnum.Y.toCode());
        Map<Long, WapNormalCartItemProtocol> cartItems = normalCart.getCartItems();
        WapNormalCartItemProtocol cartItem = cartItems.get(skuId);

        if(BooleTypeEnum.Y==BooleTypeEnum.fromCode(cartItem.getIsSelected())){
            cartItem.setIsSelected(BooleTypeEnum.N.toCode());
        }else{
            cartItem.setIsSelected(BooleTypeEnum.Y.toCode());
        }

        return handleResponse(calculateCart(currentUser, normalCart));
    }

    /**
     * 购物车项设置为选中
     * @param currentUser   当前会员
     * @param skuId         SKU Id
     * @return
     */
    @GetMapping(value = "/setItemSelect")
    public Object setItemSelect(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long skuId){
        WapNormalCartProtocol wapNormalCart = CartFactory.deepCopyCart(currentUser);
        wapNormalCart.setIsCartRequest(BooleTypeEnum.N.toCode());
        Map<Long, WapNormalCartItemProtocol> cartItems = wapNormalCart.getCartItems();
        WapNormalCartItemProtocol cartItem = cartItems.get(skuId);
        cartItem.setIsSelected(BooleTypeEnum.Y.toCode());
        return handleResponse(calculateCart(currentUser, wapNormalCart));
    }

    /**
     * 选中或取消选中所有的购物车项
     * @param currentUser
     * @return
     */
    @GetMapping(value = "/selectAll")
    public Object selectAll(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String isSelectAll){
        WapNormalCartProtocol normalCart = CartFactory.deepCopyCart(currentUser);
        normalCart.setIsCartRequest(BooleTypeEnum.Y.toCode());
        Map<Long, WapNormalCartItemProtocol> cartItems = normalCart.getCartItems();
        for(Long skuId : cartItems.keySet()){
            cartItems.get(skuId).setIsSelected(BooleTypeEnum.fromCode(isSelectAll).toCode());
        }

        return handleResponse(calculateCart(currentUser, normalCart));
    }

    /**
     * 移除已选中的购物车项
     * @param currentUser   当前会员
     * @return
     */
    @GetMapping(value = "/removeSelected")
    public Object removeSelected(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        WapNormalCartProtocol normalCart = CartFactory.deepCopyCart(currentUser);
        normalCart.setIsCartRequest(BooleTypeEnum.Y.toCode());
        Map<Long, WapNormalCartItemProtocol> cartItems = normalCart.getCartItems();
        List<Long> skuIdList = new ArrayList<>();
        for(Long skuId : cartItems.keySet()){
            if(BooleTypeEnum.Y==BooleTypeEnum.fromCode(cartItems.get(skuId).getIsSelected())){
                skuIdList.add(skuId);
            }
        }

        for(Long skuId : skuIdList){
            cartItems.remove(skuId);
        }

        return handleResponse(calculateCart(currentUser, normalCart));
    }

    /**
     * 清空失效宝贝
     * @param currentUser   当前会员
     * @return
     */
    @GetMapping("/removeInvalidItem")
    public Object removeInvalidItem(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        WapNormalCartProtocol normalCart = CartFactory.deepCopyCart(currentUser);
        normalCart.setIsCartRequest(BooleTypeEnum.Y.toCode());
        Map<Long, WapNormalCartItemProtocol> cartItems = normalCart.getCartItems();
        List<Long> skuIdList = new ArrayList<>();
        for(Long skuId : cartItems.keySet()){
            if(BooleTypeEnum.Y==BooleTypeEnum.fromCode(cartItems.get(skuId).getIsInvalid())){
                skuIdList.add(skuId);
            }
        }

        for(Long skuId : skuIdList){
            cartItems.remove(skuId);
        }

        return handleResponse(calculateCart(currentUser, normalCart));
    }


    /**
     * 更新配送地址
     * @param currentUser   当前会员
     * @return
     */
    @GetMapping(value = "/updateDeliveryAddr")
    public Object updateDeliveryAddr(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long receiverAddrId){
        WapNormalCartProtocol normalCart = CartFactory.deepCopyCart(currentUser);
        normalCart.setIsCartRequest(BooleTypeEnum.N.toCode());
        normalCart.setReceiverAddrId(receiverAddrId);
        return handleResponse(calculateCart(currentUser, normalCart));
    }

    /**
     * 更新期望送达时间
     * @param currentUser       当前会员
     * @param expectArriveTime  期望送达时间
     * @return
     */
    @GetMapping(value = "/updateExpectArriveTime")
    public Object updateExpectArriveTime(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String expectArriveTime){
        WapNormalCartProtocol normalCart = CartFactory.getNormalCartFromCache(currentUser);
        normalCart.setExpectArriveTime(expectArriveTime);
        return handleResponse(normalCart);
    }

    /**
     * 更新优惠券使用信息
     * @param currentUser           当前会员
     * @param couponPermissionId    优惠券使用权限Id
     * @return
     */
    @GetMapping(value = "/updateCouponInfo")
    public Object updateCouponInfo(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long couponPermissionId){
        WapNormalCartProtocol normalCart = CartFactory.deepCopyCart(currentUser);
        normalCart.setIsCartRequest(BooleTypeEnum.N.toCode());

        //取消使用优惠券
        if(couponPermissionId==-1){
            normalCart.setIsUseCoupon(BooleTypeEnum.N.toCode());
            normalCart.setCouponPermissionId(null);
            normalCart.setCouponDeductionAmount(0L);
        }else{//使用优惠券
            normalCart.setIsUseCoupon(BooleTypeEnum.Y.toCode());
            normalCart.setCouponPermissionId(couponPermissionId);
        }

        return handleResponse(calculateCart(currentUser, normalCart));
    }

    /**
     * 更新账户余额使用信息
     * @param currentUser     当前会员
     * @param isUseBalance    是否使用余额支付
     * @return
     */
    @GetMapping(value = "/updateBalanceDeductionInfo")
    public Object updateBalanceDeductionInfo(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String isUseBalance){
        WapNormalCartProtocol normalCart = CartFactory.deepCopyCart(currentUser);
        normalCart.setIsCartRequest(BooleTypeEnum.N.toCode());
        normalCart.setIsUseBalance(isUseBalance);
        return handleResponse(calculateCart(currentUser, normalCart));
    }

    /**
     * 更新发票信息
     * @param currentUser     当前会员
     * @param isNeedInvoice   是否需要开发票
     * @param invoiceTitle    发票抬头
     * @param taxNum          发票税号编码
     * @return
     */
    @GetMapping(value = "/updateInvoiceInfo")
    public Object updateInvoiceInfo(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, String isNeedInvoice, String invoiceTitle, String taxNum){
        WapNormalCartProtocol normalCart = CartFactory.getNormalCartFromCache(currentUser);
        normalCart.setIsNeedInvoice(isNeedInvoice);
        normalCart.setInvoiceTitle(invoiceTitle);
        normalCart.setTaxNum(taxNum);
        return handleResponse(normalCart);
    }

    /**
     * 修改订单取货方式
     * @param currentUser
     * @return
     */
    @GetMapping(value = "/changeSelfExtractState")
    public Object changeSelfExtractState(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        WapNormalCartProtocol normalCart = CartFactory.deepCopyCart(currentUser);
        String isSelfExtract = BooleTypeEnum.N==BooleTypeEnum.fromCode(normalCart.getIsSelfExtract()) ? BooleTypeEnum.Y.toCode() : BooleTypeEnum.N.toCode();
        normalCart.setIsSelfExtract(isSelfExtract);
        Object result = handleResponse(calculateCart(currentUser, normalCart));
        if(result instanceof WapNormalCartProtocol){
            normalCart = CartFactory.getNormalCartFromCache(currentUser);
            if(StringUtils.isNotBlank(normalCart.getExpectArriveTime())){
                if(normalCart.getExpectArriveTime().contains("尽快配送")){
                    normalCart.setExpectArriveTime(normalCart.getExpectArriveTime().replace("尽快配送", "立马取货"));
                }else{
                    normalCart.setExpectArriveTime(normalCart.getExpectArriveTime().replace("立马取货", "尽快配送"));
                }
            }

            return normalCart;
        }

        return result;
    }

    /**
     * 提交订单
     * @param currentUser   当前会员
     * @return
     */
    @PostMapping(value = "/saveOrder")
    public Object saveOrder(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, @RequestBody WapNormalCartProtocol protocol){
        WapNormalCartProtocol normalCart = CartFactory.deepCopyCart(currentUser);
        normalCart.setMemberRemark(protocol.getMemberRemark());
        normalCart.setIsCartRequest(BooleTypeEnum.N.toCode());
        String requestUrl = getServicePath() + "/wap/normalCart/saveOrder";
        CrmResponse crmResponse = restTemplate.postForObject(requestUrl, normalCart, CrmResponse.class);
        if(crmResponse.isHasException()){
            return handleResponse(crmResponse);
        }

        WapNormalCartSaveResultProtocol resultProtocol = (WapNormalCartSaveResultProtocol)crmResponse.getData();
        //清理购物车
        CartFactory.clearCart(currentUser, resultProtocol.getHandSettledItems());
        //返回购物车结算结果
        return handleResponse(crmResponse);
    }

    /**
     * 获取购物车商品数量
     * @param currentUser   当前会员
     * @return
     */
    @RequestMapping(value = "/getProductNum")
    public Object getProductNum(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        WapNormalCartProtocol normalCart = CartFactory.getNormalCartFromCache(currentUser);

        Integer productNum = 0;
        if(normalCart!=null){
            Map<Long, WapNormalCartItemProtocol> cartItems = normalCart.getCartItems();
            for(Long key : cartItems.keySet()){
                WapNormalCartItemProtocol itemProtocol = cartItems.get(key);
                if(BooleTypeEnum.Y==BooleTypeEnum.fromCode(itemProtocol.getIsSelected())
                        && BooleTypeEnum.N==BooleTypeEnum.fromCode(itemProtocol.getIsInvalid())){
                    productNum = productNum + cartItems.get(key).getQuantity();
                }
            }
        }

        return handleResponse(productNum);
    }

    /**
     * 获取配送时间初始化数据
     * @param currentUser   当前会员
     * @param shopId        砍价传递选择门店id
     * @return
     */
    @GetMapping("/getDeliveryTime")
    public Object getDeliveryTime(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser, Long shopId) {
        String requestUrl = getServicePath() + "/wap/normalCart/getDeliveryTime?shopId={shopId}&chainId={chainId}&isSelfExtract={isSelfExtract}";
        WapNormalCartProtocol normalCart = CartFactory.getNormalCartFromCache(currentUser);
        return handleResponse(restTemplate.getForObject(requestUrl, CrmResponse.class, shopId != null ? shopId : currentUser.getShopId(), currentUser.getChainId(), normalCart.getIsSelfExtract()));
    }

    /**
     * 离开结算页面前,清理购物车
     * @param currentUser
     * @return
     */
    @GetMapping("/clearCart")
    public Object clearCart(@WeChatCurrentUser WeChatCurrentUserProtocol currentUser){
        return handleResponse(CartFactory.clearCart(currentUser));
    }
}
