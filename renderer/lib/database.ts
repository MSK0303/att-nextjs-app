const db = require('electron-db');
const path = require('path');

import {test_object_t,test_read_object_t} from "../types";

const test_table_name:string = "TEST";
const save_path:string = path.join("./database","");


export const initDatabase = () : boolean => {
    let result:boolean = false;
    if(!db.tableExists(test_table_name,save_path)) {
        // テーブルが存在しないので作成
        db.createTable(test_table_name,save_path,(success:boolean, message:string) => {
            if(success) {
                console.log("createTable success : "+message);
                result = true;
            } else {
                console.log("createTable failed : "+message);
                result = false;
            }
        });
    } else {
        console.log("failed to initDatabase");
        result = true;
    }
    return result;
}

export const createTestData = (create_data:test_object_t) : boolean => {
    let result : boolean = false;
    db.insertTableContent(test_table_name,save_path,create_data,(success:boolean, message:string) => {
        if(success){
            console.log("insertTableContent success : "+message);
            result = true;
        } else {
            console.log("insertTableContent failed : "+message);
            result = false;
        }
    });
    return result;
}

export const getAllTestData = () : test_read_object_t[] | boolean => {
    let result : test_read_object_t[] | boolean = false;
    if(db.tableExists(test_table_name,save_path)) {
        //テーブルが存在するならgetAll
        db.getAll(test_table_name,save_path,(success:boolean,contents:test_read_object_t[]) => {
            if(success) {
                console.log("getAll success");
                console.log(contents);
                result = contents;
            } else {
                console.log("getAll failed");
                result = false;
            }
        });
    } else {
        console.log("table is not exist");
        result = false;
    }
    return result;
}

export const getSpecifiedTestData = (date: string) : test_read_object_t[] | boolean => {
    let result : test_read_object_t[] | boolean = false;
    //テーブルが存在するか
    if(db.tableExists(test_table_name,save_path)) {
        db.getRows(test_table_name,save_path,{date: date},(success:boolean,contents:test_read_object_t[]) => {
            if(success) {
                console.log("getRows success : "+contents.length.toString());
                console.log(contents);
                if(contents.length > 0) {
                    result = contents;
                } else {
                    return false;
                }
                
            } else {
                console.log("getRows failed");
                result = false;
            }
        })
    } else {
        console.log("table is not exist");
        result = false;
    }
    return result;
}

export const searchTestData = (date: string) : test_read_object_t[] | boolean => {
    let result : test_read_object_t[] | boolean = false;
    //テーブルが存在するか
    if(db.tableExists(test_table_name,save_path)) {
        db.search(test_table_name,save_path,"date",date,(success:boolean,contents:test_read_object_t[]) => {
            if(success) {
                console.log("search success : "+contents.length.toString());
                console.log(contents);
                if(contents.length > 0) {
                    result = contents;
                } else {
                    return false;
                }
            } else {
                console.log("search failed");
                result = false;
            }
        })
    } else {
        console.log("table is not exist");
        result = false;
    }
    return result;
}

export const updateTestData = (date:string,memo:string) : boolean => {
    let result : boolean = false;
    //テーブルが存在するか
    if(db.tableExists(test_table_name,save_path)) {
        //dateが存在するかチェック
        db.getRows(test_table_name,save_path,{date:date},(success:boolean,contents:test_read_object_t[]) => {
            if(success) {
                console.log("updateTestData.getRows success.");
                console.log(contents);
                result = true;
            } else {
                console.log("updateTestData.getRows failed. "+date+" is not exist");
                result = false;
            }
        });
        //resultがtrueなら更新
        if(result) {
            db.updateRow(test_table_name,save_path,{"date":date},{"memo":memo},(success:boolean,message:string) => {
                if(success) {
                    console.log("updateTestData.updateRow success."+message);
                    result = true;
                } else {
                    console.log("updateTestData.updateRow failed."+message);
                    result = false;
                }
            });
        }
    } else {
        console.log("table is not exist");
        result = false;
    }
    return result;
}

// export const testDbFunction = () => {
    
//     if(!db.valid('Test',savePath)) {
//         db.createTable('Test',savePath,(success:boolean,msg:string) => {
//             if(success) {
//                 console.log(msg);
//             } else {
//                 console.log("failed to createTable. "+msg);
//             }
//         });
//     } else {
//         console.log("already create Test table");
//     }
//     //テストデータの挿入
//     const current_date = new Date();
//     const str_now_time = ('0' + current_date.getHours()).slice(-2) + ":" + ('0' + current_date.getMinutes()).slice(-2);
//     let test_data : test_object_t = {name:"MSK",date:str_now_time};
//     db.insertTableContent('Test',savePath,test_data,(success:boolean,message:string) => {
//         if(success) {
//             console.log("insertTableContent success : "+message);
//         } else {
//             console.log("insertTableContent failed : "+message);
//         }
//     });
//     //テスト読み込み
//     db.getAll('Test',savePath,(success:boolean,data:[test_object_t])=> {
//         if(success) {
//             console.log("getAll success");
//             console.log(data);
//         } else {
//             console.log("getAll failed");
//         }
//     });
// };
