export default{
	formatPrice(price=0){
		price = Math.floor(price);
		return '$' + price.toFixed(2);
	}
}