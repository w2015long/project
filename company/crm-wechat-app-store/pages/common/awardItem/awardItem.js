
Component({
    properties: {//上次进组件的数据
        maximumNumberOfPromoters: {
            type: Number,
            value: 1
        },
        thatDayPromoteNum: {
            type: Number,
            value: 1
        },
      recordList: {
            type:Object,
            value: {}
        },
      fn: {
        type: Function,
      },

    },
    data: {//组件内部的数据

    },
    methods: {//组件内部的方法

        childFn(e) {
          this.triggerEvent("fn", {
              userpromotebonusrecordid: e.currentTarget.dataset.userpromotebonusrecordid
          });
        }

    }

});