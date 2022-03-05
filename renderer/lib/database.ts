const db = require('electron-db');
const path = require('path');

import {att_data_t,att_read_data_t} from "../types";

const save_location:string = path.join("./database","");

/**
 * @detail データベース処理の初期化
 * 
 * @param table_name テーブル名
 * @returns true 作成成功/作成済み, false 作成失敗
 */
export const initDatabase = (table_name:string) : boolean => {
    let result : boolean = false;
    if(!db.tableExists(table_name,save_location)) {
        console.log(table_name+" table is not exist");
        db.createTable(table_name, save_location, (success:boolean, message:string) => {
            console.log(message);
            if(success) {
                result = true;
            } else {
                result = false;
            }
        });
    } else {
        //既に存在する場合はJsonファイルとして問題ないかをチェック
        if(db.valid(table_name,save_location)){
            console.log("[database] "+table_name+" table is already created & valid json file");
            result = true;
        } else {
            console.log("[database] "+table_name+" table is already created but invalid json file");
            result = false;
        }
    }
    return result;
}
/**
 * @detail 新しいレコードを追加する
 * 
 * @param table_name テーブル名
 * @param new_data 新しく追加するデータ
 * @returns true : 追加完了 , false : 追加失敗
 */
export const createNewRecord = (table_name:string,new_data:att_data_t) : boolean => {
    let result : boolean = false;
    //テーブルが存在するかチェック
    if(db.tableExists(table_name,save_location)){
        //テーブルが存在する場合はデータを挿入
        db.insertTableContent(table_name,save_location,new_data,(success:boolean,message:string) => {
            console.log(message);
            if(success){
                console.log("[database] success to insertTableContent");
                result = true;
            } else {
                console.error("[database] failed to insertTableContent");
                result = false;
            }
        });
    } else {
        //テーブルが存在しない場合はエラーとする
        console.error("[database] createNewRecord : table does not exist");
        result = false;
    }

    return result;
}
/**
 * @detail 全レコードを取得
 * 
 * @param table_name テーブル名
 * @returns [att_read_data_t] 取得したデータの配列 , false 取得失敗
 */
export const getAllRecords = (table_name:string) : boolean | att_read_data_t[] => {
    let result : boolean | att_read_data_t[] = false;
    //テーブルが存在するかチェック
    if(db.tableExists(table_name,save_location)){
        db.getAll(table_name,save_location,(success:boolean,data:att_read_data_t[]) => {
            if(success) {
                console.log(data);
                result = data;
            } else {
                console.error("[database] failed to getAll");
                result = false;
            }
        });
    } else {
        //テーブルが存在しない場合はエラーとする
        console.error("[database] getAllRecords : table does not exist");
        result = false;
    }

    return result;
}
/**
 * @detail 指定した日付が入っているレコードを取得する
 * 
 * @note target_dateは完全一致する必要がある
 * 
 * @param table_name テーブル名
 * @param target_date 取得する日付
 * @returns 
 */
export const getDateRecords = (table_name:string,target_date:string) :  att_read_data_t[] => {
    let ret: att_read_data_t[] = [];
    //テーブルが存在するかチェック
    if(db.tableExists(table_name,save_location)){
        console.log("[database] getDateRecords.target_date = "+target_date);
        db.getRows(table_name,save_location,{date: target_date},(success:boolean,result:att_read_data_t[]) => {
            if(success) {
                console.log("[database] success to getRows");
                console.log(result);
                ret = result;
            } else {
                console.log("[database] faield to getRows");
                ret = [];
            }
        });
    } else {
        //テーブルが存在しない場合はエラーとする
        console.error("[database] getDateRecords : table does not exist");
        ret = [];
    }
    return ret;
}
/**
 * @detail 指定した年/月が入っているレコードを取得する
 * 
 * @note target_monthはdateフィールドに含まれていれば検索にかかる（部分一致でOK）
 * 
 * @param table_name テーブル名
 * @param target_month 取得する月(指定は年/月の形)
 * @returns 
 */
export const getMonthRecords = (table_name:string, target_month:string) : boolean | att_read_data_t[] => {
    let ret : boolean | att_read_data_t[] = false;
    if(db.tableExists(table_name,save_location)){
        db.search(table_name,save_location,"date",target_month,(success:boolean,result:att_read_data_t[]) => {
            if(success) {
                console.log("[database] success to search");
                console.log(result);
                ret = result;
            } else {
                console.log("[database] failed to search");
                ret = false;
            }
        });
    } else {
        //テーブルが存在しない場合はエラーとする
        console.error("[database] getMonthRecords : table does not exist");
        ret = false;
    }

    return ret;
}
/**
 * @detail データベースの内容を更新する
 * 
 * @param table_name テーブル名
 * @param target_date 更新する日付(年/月/日の形式)
 * @param update_data アップデートする内容
 * @returns 
 */
export const updateRecord = (table_name:string, target_date:string,update_data:att_data_t) : boolean => {
    let ret : boolean = false;
    //先にその日付が存在するか確認
    let find_ret = getDateRecords(table_name,target_date);
    //型をチェック
    if('boolean' != typeof find_ret) {
        //boolean型でないならば、オブジェクト型なので個数をチェック
        if(find_ret.length>0) {
            console.log("updateRecord : getRecords result is success");
            db.updateRow(table_name,save_location,{"date":target_date},update_data,(success:boolean,message:string) => {
                if(success) {
                    console.log("[database] success to updateRecord : "+message);
                    ret = true;
                } else {
                    console.log("[database] failed to updateRecord : "+message);
                    ret = false;
                }
            });
        }
    }
    return ret;
}
/**
 * @detail 指定した日付のデータを消去する
 * 
 * @param table_name テーブル名
 * @param target_date 消去する日付(年/月/日の形式)
 * @returns 
 */
export const deleteRecord = (table_name:string, target_date:string) : boolean => {
    let ret : boolean = false;
    //先にその日付が存在するか確認
    let find_ret = getDateRecords(table_name,target_date);
    //型をチェック
    if('boolean' != typeof find_ret) {
        //boolean型でないならば、オブジェクト型なので個数をチェック
        if(find_ret.length>0) {
            find_ret.forEach((data) => {
                db.deleteRow(table_name,save_location,{'id': data.id},(success:boolean,message:string) => {
                    if(success) {
                        console.log("[database] success to deleteRecord : "+message);
                        ret = true;
                    } else {
                        console.log("[database] failed to deleteRecord : "+message);
                        ret = false;
                    }
                });
            });
        }
    }
    return ret;
}