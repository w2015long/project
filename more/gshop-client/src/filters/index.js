import moment from 'moment';
export default{
    //全局时间过滤器
    dateFormat(dateStr,formatStr="YYYY-MM-DD HH:mm:ss"){
        return moment(dateStr).format(formatStr);
    }
}