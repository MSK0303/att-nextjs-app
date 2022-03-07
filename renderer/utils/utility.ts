//時間を求める関数
export const getTimeFromUnixTime = (value:number) => {
    let dateTime = new Date(value*1000);
    return ("0"+dateTime.getHours()).slice(-2)+":"+("0"+dateTime.getMinutes()).slice(-2)+":"+("0"+dateTime.getSeconds()).slice(-2);
}
//合計時間から時分秒を求める関数
export const getStrHourMinuteSecondTime = (value:number) => {
    const hour : number = Math.floor(value / 3600);
    let remain_sec : number = value - hour;
    const minute : number = Math.floor(remain_sec/60);
    remain_sec -= minute;
    return ('0'+hour).slice(-2)+":"+('0'+minute).slice(-2)+":"+('0'+remain_sec).slice(-2);
}