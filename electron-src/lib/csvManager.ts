
import {att_read_data_t} from "../types"
import {getTimeFromUnixTime,getStrHourMinuteSecondTime} from "../../renderer/utils/utility";
import fs from "fs";


export const writeCsvFile = (path:string,att_infos:att_read_data_t[]) : boolean => {
    let _write_data : string = "日付,出勤時間,退勤時間,休憩時間,外出時間,勤務時間\r\n";
    for(const att_data of att_infos){
        const _line = att_data.date+","+getTimeFromUnixTime(att_data.commuting_time) + "," + getTimeFromUnixTime(att_data.leave_work_time)
                        +","+getStrHourMinuteSecondTime(att_data.rest_total_time) + ","+getStrHourMinuteSecondTime(att_data.go_out_total_time) + "," + getStrHourMinuteSecondTime(att_data.total_work_time)+"\r\n";
        _write_data += _line;
    }
    try {
        fs.writeFileSync(path,_write_data);
        return true;
    } catch(e) {
        console.log(e);
        return false;
    }
}