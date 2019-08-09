export default {
    totalCar (state) {
        return state.car.reduce((pre,cur)=>{
            return pre + cur.count;
        },0)
    }
}
