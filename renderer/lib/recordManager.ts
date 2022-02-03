import {initDatabase,createNewRecord,getDateRecords,getMonthRecords,updateRecord} from "./database";
import {att_data_t,att_read_data_t} from "../types";

/**************************************************************************************************
*private value
**************************************************************************************************/
const att_table_name : string = "ATT_TEST";


/**************************************************************************************************
* private function
**************************************************************************************************/

/**
 * @detail recordManagerと明記して、ログを表示する
 * 
 * @param _log ログに表示する文字列
 */
const writeRecordLog = (_log:string) => {
    console.log("[recordManager] "+_log);
}
/**
 * @detail 文字列で今日の日付を取得する
 * 
 * @returns 今日の日付を年/月/日の形で返却
 */
const getCurrentStringDate = () : string => {
    const current_date = new Date();
    //下はslice(-2)により後ろから2文字が切り出される。１桁だった場合は0を含み、2桁なら先頭の0は省略される仕組み
    const str_current_date =  current_date.getFullYear() + "/" + ('0'+(current_date.getMonth()+1)).slice(-2) + "/" + ('0'+current_date.getDate()).slice(-2);
    return str_current_date;
}
/**
 * @detail 文字列で今月を取得する
 * 
 * @returns 今月を年/月の形で返却
 */
const getCurrentStringMonth = () : string => {
    const current_date = new Date();
    const str_current_month =  current_date.getFullYear() + "/" + ('0'+(current_date.getMonth()+1)).slice(-2);
    return str_current_month;
}
/**
 * @detail 引数で指定した年と月を文字列で返す
 * 
 * @param year 年
 * @param month 月
 * @returns 指定した年と月を年/月の形で返却
 */
// const getTargetStringMonth = (year:number,month:number) : string => {
//     return  year + "/" + ('0'+(month+1)).slice(-2);
// }
/**
 * @detail 現時刻のunix timeを秒単位で取得
 * 
 * @returns number unix time 
 */
const getCurrentUnixTimeSec = () : number => {
    const current_date : Date = new Date();
    const unix_time_ms : number = current_date.getTime();
    const unix_time_sec : number = Math.floor(unix_time_ms / 1000);
    return unix_time_sec;
}

/**************************************************************************************************
*public value
**************************************************************************************************/
export const initRecordManager = () : boolean | att_read_data_t[] => {
    writeRecordLog("initRecordManager");
    if( initDatabase(att_table_name) ) {
        writeRecordLog("initDatabase success");
        //Databaseの初期化に成功したら、今月のデータを取得する
        const str_current_month:string = getCurrentStringMonth();
        const current_month_att_data = getMonthRecords(att_table_name,str_current_month);
        if("boolean" == typeof current_month_att_data) {
            //boolean型の場合はエラー
            writeRecordLog("getMonthRecords failed");
            return false;
        } else {
            //それ以外はオブジェクト型
            writeRecordLog("getMonthRecords success : " + (typeof current_month_att_data).toString() );
            return current_month_att_data;
        }
     } else {
        writeRecordLog("initDatabase failed");
         return false;
     }
}

export const writeCommutingTime = () : boolean | att_read_data_t[] => {
    writeRecordLog("writeCommutingTime");
    const str_today:string = getCurrentStringDate();
    let ret_att_data_array:att_read_data_t[] = [];
    let att_data = getDateRecords(att_table_name,str_today);
    if("boolean" == typeof att_data) {
        //getDateRecordsでboolean型の場合はfalseのみ
        //データがないので、追加
        const unix_time_sec : number = getCurrentUnixTimeSec();
        let new_att_data : att_data_t = {date:str_today,commuting_time:unix_time_sec,leave_work_time:0,rest_start_time:0,go_out_start_time:0,rest_total_time:0,go_out_total_time:0,total_work_time:0};
        if( createNewRecord(att_table_name,new_att_data) ) {
            writeRecordLog("createNewRecord success : "+new_att_data.date+","+new_att_data.commuting_time.toString());
            const new_ret_att_data:att_read_data_t = {date:str_today,commuting_time:unix_time_sec,leave_work_time:0,rest_start_time:0,go_out_start_time:0,rest_total_time:0,go_out_total_time:0,total_work_time:0,id:0};
            return [new_ret_att_data];
        } else {
            writeRecordLog("createNewRecord failed");
            return false;
        }
    } else {
        //データがある場合は更新
        //この場合のattはオブジェクト型
        writeRecordLog("getDateRecords has "+att_data.length.toString()+" att_data_t objects");
        const unix_time_sec : number = getCurrentUnixTimeSec();
        att_data.forEach((element,index) => {
            writeRecordLog("writeCommutingTime.for in att_data:"+index.toString());
            console.log(element);
            element.commuting_time = unix_time_sec;
            if( updateRecord(att_table_name,element.date,element) ){
                writeRecordLog("success updateRecord");
                ret_att_data_array.push(element);
            } else {
                writeRecordLog("failed updateRecord");
                return false;
            }
        });
        return ret_att_data_array;        
    }
}

