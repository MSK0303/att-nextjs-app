import {initDatabase,createNewRecord,getDateRecords,getMonthRecords,updateRecord} from "./database";
import {att_data_t,att_read_data_t} from "../types";

/**************************************************************************************************
*private value
**************************************************************************************************/
/*! テーブル名 */
const att_table_name : string = "ATT_TEST";
/*! 初期化完了しているか */
let init_end_flag : boolean = false;
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
 * @detail 引数で指定した年と月を文字列で返す
 * 
 * @param year 年
 * @param month 月
 * @returns 指定した年と月を年/月の形で返却
 */
export const getTargetStringMonth = (year:number,month:number) : string => {
    return  year + "/" + ('0'+(month+1)).slice(-2);
}
/**
 * @detail 引数で指定した年と月と日を文字列で返す
 * 
 * @param year 年
 * @param month 月
 * @param day 日
 * @returns 指定した年と月を年/月/日の形で返却
 */
export const getTargetStringDate = (year:number,month:number,day:number) : string => {
    return  year + "/" + ('0'+(month+1)).slice(-2) + "/" + ('0'+day).slice(-2);
}
/**
 * @detail 現時刻のunix timeを秒単位で取得
 * 
 * @returns number unix time 
 */
export const getCurrentUnixTimeSec = () : number => {
    const current_date : Date = new Date();
    const unix_time_ms : number = current_date.getTime();
    const unix_time_sec : number = Math.floor(unix_time_ms / 1000);
    return unix_time_sec;
}
/**
 * @detail readデータからwriteデータにコピーする
 * 
 * @param read コピーするreadデータ
 * @returns コピーしたwriteデータ
 */
const setAttDataFromReadData=(read:att_read_data_t) : att_data_t => {
    let ret : att_data_t = {date:"",commuting_time:0,leave_work_time:0,rest_start_time:0,go_out_start_time:0,rest_total_time:0,go_out_total_time:0,total_work_time:0};
    ret.date = read.date;
    ret.commuting_time = read.commuting_time;
    ret.leave_work_time = read.leave_work_time;
    ret.rest_total_time = read.rest_total_time;
    ret.go_out_total_time = read.go_out_total_time;
    ret.rest_start_time = read.rest_start_time;
    ret.go_out_start_time = read.go_out_start_time;
    ret.total_work_time = read.total_work_time;
    return ret;
}
/**************************************************************************************************
*public value
**************************************************************************************************/
/**
 * @detail 今日の日付のレコードを作成
 * 
 * @returns 作成結果 (true:成功, false:失敗)
 */
export const createCurrentDateRecord = () : boolean => {
    const str_today:string = getCurrentStringDate();
    let att_data = getDateRecords(att_table_name,str_today);
    if(att_data.length == 0){
        //レコードが存在しないので作成
        let new_record : att_data_t = {date:str_today,commuting_time:0,leave_work_time:0,rest_start_time:0,go_out_start_time:0,rest_total_time:0,go_out_total_time:0,total_work_time:0};
        if( createNewRecord(att_table_name,new_record) ) {
            writeRecordLog("createCurrentDateRecord success : "+new_record.date);
            return true;
        } else {
            writeRecordLog("createCurrentDateRecord failed");
            return false;
        }
    } else {
        //レコードが存在しているので
        writeRecordLog("createCurrentDateRecord already exist record");
        return true;
    }
}
/**
 * @detail 文字列で今月を取得する
 * 
 * @returns 今月を年/月の形で返却
 */
 export const getCurrentStringMonth = () : string => {
    const current_date = new Date();
    const str_current_month =  current_date.getFullYear() + "/" + ('0'+(current_date.getMonth()+1)).slice(-2);
    return str_current_month;
}
/**
 * @detail データベース初期化
 * 
 * @returns 結果(true:成功, false:失敗)
 */
export const initRecordManager = () : boolean  => {
    writeRecordLog("initRecordManager");
    if(init_end_flag) return true; 
    if( initDatabase(att_table_name) ) {
        writeRecordLog("initDatabase success");
        createCurrentDateRecord();
        init_end_flag = true;
        return true;
     } else {
        writeRecordLog("initDatabase failed");
         return false;
     }
}
/**
 * @detail ターゲット年月を含んだ出退勤データのリストを取得する
 * 
 * @param year 年
 * @param month 月
 * @returns 出退勤データのリスト
 */
export const readTargetMonth = (year:number,month:number) : att_read_data_t[] => {
    let _list:att_read_data_t[] = [];
    const _str_target_month:string = getTargetStringMonth(year,month);
    const _get_result = getMonthRecords(att_table_name,_str_target_month);
    if("boolean" != typeof _get_result) {
        console.log("readTargetMonth.getMonthRecords success");
        console.log(_get_result)
        _list = _get_result;
    }
    return _list;
}

export const readTargetAttInfo = (year:number,month:number,day:number) : att_read_data_t | null => {
    console.log("readTargetAttInfo:year="+year+",month="+month+",day="+day);
    const _str_target_date:string = getTargetStringDate(year,month,day);
    let _read_att = getDateRecords(att_table_name,_str_target_date);
    if(_read_att.length>0) {
        console.log("readTargetAttInfo.getDateRecords success : "+_read_att.length);
        console.log(_read_att[0]);
        return _read_att[0];
    } else {
        console.log("readTargetAttInfo.getDateRecords failed");
        return null;
    }
}

/**************************************************************************************************
* 以下はdate以外の更新(dateは起動した時点で作成するのでupdateで対応)
**************************************************************************************************/
/**
 * @detail 出勤時間を記録
 * 
 * @returns 出勤時間を記録したデータ
 */
export const writeCommutingTime = () : att_read_data_t | null => {
    const str_today:string = getCurrentStringDate();
    const unix_time_sec : number = getCurrentUnixTimeSec();
    //更新するデータを取得
    let att_data = getDateRecords(att_table_name,str_today);
    if(att_data.length > 0 ) {
        //出勤時間のみを更新
        att_data[0].commuting_time = unix_time_sec;
        let update_data:att_data_t = setAttDataFromReadData(att_data[0]);
        writeRecordLog("writeCommutingTime: att_data length = "+att_data.length);
        if( updateRecord(att_table_name,att_data[0].date,update_data) ){
            writeRecordLog("success updateRecord");
            return att_data[0];
        } else {
            writeRecordLog("failed updateRecord");
            return null;
        }
    } else {
        //ここは本当は通るはずがない
        writeRecordLog("current date data does not exist...");
        return null;
    }
}
/**
 * @detail 退勤時間を記録
 * 
 * @returns 退勤時間と勤務時間を記録したデータ
 */
export const writeLeaveWorkTime = () : att_read_data_t | null => {
    const str_today:string = getCurrentStringDate();
    const unix_time_sec : number = getCurrentUnixTimeSec();
    //更新するデータを取得
    let att_data = getDateRecords(att_table_name,str_today);
    if(att_data.length > 0 ) {
        //退勤時間のみを更新
        att_data[0].leave_work_time = unix_time_sec;
        //退勤なので、勤務時間を決定
        let total_time:number = att_data[0].leave_work_time - att_data[0].commuting_time;
        total_time -= att_data[0].rest_total_time;
        total_time -= att_data[0].go_out_total_time;
        writeRecordLog("writeLeaveWorkTime: work total time = "+total_time);
        att_data[0].total_work_time = total_time;
        let update_data:att_data_t = setAttDataFromReadData(att_data[0]);
        writeRecordLog("writeLeaveWorkTime: att_data length = "+att_data.length);
        if( updateRecord(att_table_name,att_data[0].date,update_data) ){
            writeRecordLog("success updateRecord");
            return att_data[0];
        } else {
            writeRecordLog("failed updateRecord");
            return null;
        }
    } else {
        //ここは本当は通るはずがない
        writeRecordLog("current date data does not exist...");
        return null;
    }
}
/**
 * @detail 休憩時間を記録
 * 
 * @returns 休憩時間を記録したデータ
 */
export const writeRestTotalTime = () : att_read_data_t | null => {
    const str_today:string = getCurrentStringDate();
    const unix_time_sec : number = getCurrentUnixTimeSec();
    //更新するデータを取得
    let att_data = getDateRecords(att_table_name,str_today);
    if(att_data.length > 0 ) {
        //休憩合計時間のみを更新
        let diff_time:number = 0;
        if(att_data[0].rest_start_time!=0) {
            diff_time = unix_time_sec - att_data[0].rest_start_time; //差分を計算(現在時刻-休憩スタート時間)
        }
        //現時点の休憩時間に加算する
        att_data[0].rest_total_time = att_data[0].rest_total_time + diff_time;
        //休憩開始時間を0の戻す
        att_data[0].rest_start_time = 0;
        let update_data:att_data_t = setAttDataFromReadData(att_data[0]);
        writeRecordLog("writeRestTotalTime: att_data length = "+att_data.length);
        if( updateRecord(att_table_name,att_data[0].date,update_data) ){
            writeRecordLog("success updateRecord");
            return att_data[0];
        } else {
            writeRecordLog("failed updateRecord");
            return null;
        }
    } else {
        //ここは本当は通るはずがない
        writeRecordLog("current date data does not exist...");
        return null;
    }
}
/**
 * @detail 外出時間を記録
 * 
 * @returns 外出時間を記録したデータ
 */
export const writeGoOutTotalTime = () : att_read_data_t | null => {
    const str_today:string = getCurrentStringDate();
    const unix_time_sec : number = getCurrentUnixTimeSec();
    //更新するデータを取得
    let att_data = getDateRecords(att_table_name,str_today);
    if(att_data.length > 0 ) {
        //休憩合計時間のみを更新
        let diff_time:number = 0;
        if(att_data[0].go_out_start_time!=0) {
            diff_time = unix_time_sec - att_data[0].go_out_start_time; //差分を計算(現在時刻-休憩スタート時間)
        }
        //現時点の外出時間に加算する
        att_data[0].go_out_total_time = att_data[0].go_out_total_time + diff_time;
        //外出開始時間を0に戻す
        att_data[0].go_out_start_time = 0;
        let update_data:att_data_t = setAttDataFromReadData(att_data[0]);
        writeRecordLog("writeGoOutTotalTime: att_data length = "+att_data.length);
        if( updateRecord(att_table_name,att_data[0].date,update_data) ){
            writeRecordLog("success updateRecord");
            return att_data[0];
        } else {
            writeRecordLog("failed updateRecord");
            return null;
        }
    } else {
        //ここは本当は通るはずがない
        writeRecordLog("current date data does not exist...");
        return null;
    }
}
/**
 * @detail 休憩開始時間を記録
 * 
 * @returns 休憩開始時間を記録したデータ
 */
export const writeRestStartTime = () : att_read_data_t | null => {
    const str_today:string = getCurrentStringDate();
    const unix_time_sec : number = getCurrentUnixTimeSec();
    //更新するデータを取得
    let att_data = getDateRecords(att_table_name,str_today);
    if(att_data.length > 0 ) {
        //休憩開始時間のみを更新
        att_data[0].rest_start_time = unix_time_sec;
        let update_data:att_data_t = setAttDataFromReadData(att_data[0]);
        writeRecordLog("writeRestStartTime: att_data length = "+att_data.length);
        if( updateRecord(att_table_name,att_data[0].date,update_data) ){
            writeRecordLog("success updateRecord");
            return att_data[0];
        } else {
            writeRecordLog("failed updateRecord");
            return null;
        }
    } else {
        //ここは本当は通るはずがない
        writeRecordLog("current date data does not exist...");
        return null;
    }
}
/**
 * @detail 外出開始時間を記録
 * 
 * @returns 外出開始時間を記録したデータ
 */
export const writeGoOutStartTime = () : att_read_data_t | null => {
    const str_today:string = getCurrentStringDate();
    const unix_time_sec : number = getCurrentUnixTimeSec();
    //更新するデータを取得
    let att_data = getDateRecords(att_table_name,str_today);
    if(att_data.length > 0 ) {
        //休憩開始時間のみを更新
        att_data[0].go_out_start_time = unix_time_sec;
        let update_data:att_data_t = setAttDataFromReadData(att_data[0]);
        writeRecordLog("writeGoOutStartTime: att_data length = "+att_data.length);
        if( updateRecord(att_table_name,att_data[0].date,update_data) ){
            writeRecordLog("success updateRecord");
            return att_data[0];
        } else {
            writeRecordLog("failed updateRecord");
            return null;
        }
    } else {
        //ここは本当は通るはずがない
        writeRecordLog("current date data does not exist...");
        return null;
    }
}

