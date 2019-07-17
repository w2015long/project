package com.imall.crm.commons.web;

import com.imall.crm.commons.dicts.BooleTypeEnum;
import com.imall.crm.commons.dicts.ShoppingCartTypeEnum;
import com.imall.crm.commons.utils.FileResolver;
import com.imall.crm.commons.utils.JsonUtils;
import com.imall.crm.module.cart.protocol.wap.WapNormalCartItemProtocol;
import com.imall.crm.module.cart.protocol.wap.WapNormalCartProtocol;
import com.imall.crm.module.commons.base.protocol.CrmResponse;
import com.imall.crm.module.wechat.protocol.WeChatCurrentUserProtocol;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 购物车工厂方法
 * @author frt
 * @date 2018/8/2 15:13
 */
@Component
public class CartFactory {
    private static final Logger logger = Logger.getLogger(CartFactory.class);
    private static String servicePath;
    private static RestTemplate restTemplate;
    private static Map<String, WapNormalCartProtocol> cartCache = new HashMap<>();
    private static FileResolver fileResolver;

    @Value("${api-crm-service-path}")
    public void setServicePath(String servicePath) {
        CartFactory.servicePath = servicePath;
    }

    @Autowired
    public void setRestTemplate(RestTemplate restTemplate) {
        CartFactory.restTemplate = restTemplate;
    }

    @Autowired
    public void setFileResolver(FileResolver fileResolver) {
        CartFactory.fileResolver = fileResolver;
    }

    private static String getCartKey(ShoppingCartTypeEnum cartTypeEnum, Long chainId){
        DefaultWebContext ctx = (DefaultWebContext) WebContextFactory.getWebContext();
        return String.join("_", cartTypeEnum.toCode(), String.valueOf(chainId), ctx.getSession().getId());
    }

    /**
     * 处理当前门店
     * @param currentUser
     * @param normalCart
     */
    private static void handleCurrentShop(WeChatCurrentUserProtocol currentUser, WapNormalCartProtocol normalCart){
        Long shopId = currentUser.getShopId();

        if(shopId==null){
            return;
        }

        //发生门店切换，收货地址需要重新选优
        if (!shopId.equals(normalCart.getCurrentShopId())) {
            normalCart.setReceiverAddrId(null);
            normalCart.setReceiverName(null);
            normalCart.setContactTel(null);
            normalCart.setDeliveryAddr(null);
        }

        normalCart.setCurrentShopId(shopId);
    }

    /**
     * 从缓存中获取购物车
     * @param currentUser   当前用户
     * @return
     */
    public static WapNormalCartProtocol getNormalCartFromCache(WeChatCurrentUserProtocol currentUser){
        Long chainId = currentUser.getChainId();
        Long shopId = currentUser.getShopId();
        String cartKey = getCartKey(ShoppingCartTypeEnum.NORMAL, chainId);
        WapNormalCartProtocol normalCart;

        //购物车已存在
        if(cartCache.containsKey(cartKey)){
            normalCart = cartCache.get(cartKey);
        }else{//购物车不存在
            normalCart = new WapNormalCartProtocol();
            normalCart.setMemberId(currentUser.getMemberId());
            normalCart.setOpenId(currentUser.getOpenId());
            normalCart.setCurrentShopId(shopId);
            normalCart.setChainId(chainId);
            normalCart.setObtainIntegral(0L);
            normalCart.setIsNeedInvoice(BooleTypeEnum.N.toCode());
            normalCart.setProductTotalAmountOfO2O(0L);
            normalCart.setProductTotalAmountOfB2C(0L);
            normalCart.setProductTotalAmount(0L);
            normalCart.setFreightDiscountAmountOfO2O(0L);
            normalCart.setFreightDiscountAmountOfB2C(0L);
            normalCart.setFreightDiscountAmount(0L);
            normalCart.setFreightAmountOfO2O(0L);
            normalCart.setFreightAmountOfB2C(0L);
            normalCart.setFreightAmount(0L);
            normalCart.setCouponDeductionAmount(0L);
            normalCart.setBalanceDeductionAmount(0L);
            normalCart.setDiscountTotalAmount(0L);
            normalCart.setOrderTotalAmount(0L);
            normalCart.setCartItems(new HashMap<>());
            normalCart.setCartItemList(new ArrayList<>());
            normalCart.setIsSelfExtract(BooleTypeEnum.N.toCode());
            cartCache.put(cartKey, normalCart);
        }

        return normalCart;
    }

    /**
     * 获取购物车
     * @param currentUser   当前用户
     * @return
     */
    public static Object getNormalCart(WeChatCurrentUserProtocol currentUser, String isCartRequest){
        Long memberId = currentUser.getMemberId();
        WapNormalCartProtocol normalCart = deepCopyCart(currentUser);
        normalCart.setMemberId(memberId);
        normalCart.setIsCartRequest(isCartRequest);
        //重新计算购物车
        String url = servicePath + "/wap/normalCart/getCart";
        CrmResponse crmResponse = restTemplate.postForObject(url, normalCart, CrmResponse.class);
        if(crmResponse.isHasException()){
            return crmResponse;
        }

        updateNormalCart(currentUser, (WapNormalCartProtocol)crmResponse.getData());
        return getNormalCartFromCache(currentUser);
    }

    /**
     * 更新购物车
     * @param currentUser   当前用户
     * @param normalCart    购物车
     */
    public static void updateNormalCart(WeChatCurrentUserProtocol currentUser, WapNormalCartProtocol normalCart){
        Long chainId = currentUser.getChainId();
        String cartKey = getCartKey(ShoppingCartTypeEnum.NORMAL, chainId);
        List<WapNormalCartItemProtocol> cartItemList = normalCart.getCartItemList();
        cartItemList.clear();
        cartItemList.addAll(normalCart.getCartItems().values());

        Map<Long, WapNormalCartItemProtocol> cartItems = normalCart.getCartItems();
        for(Long skuId : cartItems.keySet()){
            WapNormalCartItemProtocol cartItem = cartItems.get(skuId);
            if(StringUtils.isBlank(cartItem.getPicture())){
                cartItem.setPicture(fileResolver.getWebUrl(cartItem.getFileId(), "100X100"));
            }
        }

        cartCache.put(cartKey, normalCart);
    }

    /**
     * 购物车深拷贝
     * @param currentUser   当前用户
     * @return
     */
    public static WapNormalCartProtocol deepCopyCart(WeChatCurrentUserProtocol currentUser){
        WapNormalCartProtocol wapNormalCartProtocol = JsonUtils.toBean(JsonUtils.toJsonString(getNormalCartFromCache(currentUser)), WapNormalCartProtocol.class);
        if(wapNormalCartProtocol!=null){
            handleCurrentShop(currentUser, wapNormalCartProtocol);
        }

        return wapNormalCartProtocol;
    }

    /**
     * 清理购物车
     * @param currentUser           当前用户
     * @param handSettledItems      已经结算过的购物车项
     */
    public static WapNormalCartProtocol clearCart(WeChatCurrentUserProtocol currentUser, List<Long> handSettledItems){
        WapNormalCartProtocol normalCart = CartFactory.getNormalCartFromCache(currentUser);
        normalCart.setExpectArriveTime(null);
        normalCart.setFreightAmountOfO2O(0L);
        normalCart.setFreightDiscountAmountOfO2O(0L);
        normalCart.setFreightAmountOfB2C(0L);
        normalCart.setFreightDiscountAmountOfB2C(0L);
        normalCart.setReceiverAddrId(null);
        normalCart.setDeliveryAddr(null);
        normalCart.setReceiverName(null);
        normalCart.setContactTel(null);
        normalCart.setIsNeedInvoice(BooleTypeEnum.N.toCode());
        normalCart.setInvoiceTitle(null);
        normalCart.setTaxNum(null);
        normalCart.setMemberRemark(null);
        normalCart.setFreightAmount(0L);
        normalCart.setFreightDiscountAmount(0L);
        normalCart.setCouponPermissionId(null);
        normalCart.setCouponDeductionAmount(0L);
        normalCart.setIsUseBalance(BooleTypeEnum.N.toCode());
        normalCart.setIsUseCoupon(BooleTypeEnum.Y.toCode());
        normalCart.setBalanceDeductionAmount(0L);

        Map<Long, WapNormalCartItemProtocol> cartItems = normalCart.getCartItems();
        if(CollectionUtils.isNotEmpty(handSettledItems)){
            normalCart.setIsSelfExtract(BooleTypeEnum.N.toCode());

            for(Long skuId : handSettledItems){
                cartItems.remove(skuId);
            }
        }

        normalCart.getCartItemList().clear();
        normalCart.getCartItemList().addAll(cartItems.values());

        return normalCart;
    }

    /**
     * 清理购物车
     * @param currentUser           当前用户
     */
    public static WapNormalCartProtocol clearCart(WeChatCurrentUserProtocol currentUser){
        return clearCart(currentUser, new ArrayList<>());
    }
}
