const db = require('electron-db');
const path = require('path');

// interface test_object_t {
//     name: string,
//     date: string,
// }

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
