export default {
    totalCar (state) {
        return state.car.reduce((pre,cur)=>{
            return pre + cur.count;
        },0)
    },
    getGoodsCarCount (state) {
        let opt = {};
      state.car.forEach(elem=>{
          opt[elem.id] = elem.count;
      });
      return opt;
    },
    getGoodsCarSelected (state) {
        let opt = {};
        state.car.forEach(elem=>{
            opt[elem.id] = elem.selected;
        });
        return opt;
    },
    getSelectedCountAndAmount (state) {
        let opt = {
            selectedCount:0,//勾选的数量
            selectedAmount:0//勾选的总价
        };
        state.car.forEach(elem=>{
            if (elem.selected) {
                opt.selectedCount += elem.count;
                opt.selectedAmount += parseFloat(elem.price) * parseFloat(elem.count);
            }
        });
        return opt;
    }
}
