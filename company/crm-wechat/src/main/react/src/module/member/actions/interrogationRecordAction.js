import {
    INTERROGATION_RECORD_LIST,
    INTERROGATION_RECORD_DETAILS,
    YDY_IN_SHOP_LIST,
} from "../constants/ActionTypes";

/**
 * 查找会员问诊记录列表
 */
export function pageYdyPrescription(page, size, prescriptionList = []) {
    return (dispatch) => {
        const url = '/wap/ydyPrescription/pageYdyPrescription';
        let data = {page: page, size: size};

        window.jsonFetch(
            url,
            {
                method: 'post',
                body: JSON.stringify(data)
            },
            json => {
                const action = {
                    type: INTERROGATION_RECORD_LIST,
                    data: {
                        page: page,
                        size: size,
                        recordsFiltered: json.recordsFiltered,
                        prescriptionData: prescriptionList.concat(json.data)
                    }
                };
                dispatch(action)
            }
        );
    }
}

/**
 * 查询问诊详情
 * @param inquiryId 问诊Id
 * @returns {Function}
 */
export function findYdyPrescriptionDetails(inquiryId) {
    return (dispatch) => {
        const url = '/wap/ydyPrescription/findYdyPrescriptionDetails?inquiryId=' + inquiryId;

        window.jsonFetch(
            url,
            {},
            success => {
                const action = {
                    type: INTERROGATION_RECORD_DETAILS,
                    data: success,
                };
                dispatch(action)
            }
        )
    }
}

/**
 * 查询有货门店
 * @param mapLocation
 * @param prescriptionId  处方Id
 * @returns {Function}
 */
export function findYdyPrescriptionShopList(mapLocation,prescriptionId) {
    return (dispatch) => {
        const url = '/wap/shop/getAvailableProductShopList';
        let data = {mapLocation: mapLocation, prescriptionId: prescriptionId};
        window.jsonFetch(
            url,
            {
                method: 'post',
                body: JSON.stringify(data)
            },
            success => {
                const action = {
                    type: YDY_IN_SHOP_LIST,
                    data: success,
                };
                dispatch(action)
            }
        )
    }
}