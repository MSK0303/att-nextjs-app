const db = require('electron-db');
const path = require('path');

interface test_object_t {
    name: string,
    date: string,
}

export const testDbFunction = () => {
    const savePath:string = path.join("./database","");
    if(!db.valid('Test',savePath)) {
        db.createTable('Test',savePath,(success:boolean,msg:string) => {
            if(success) {
                console.log(msg);
            } else {
                console.log("failed to createTable. "+msg);
            }
        });
    } else {
        console.log("already create Test table");
    }
    //テストデータの挿入
    const current_date = new Date();
    const str_now_time = ('0' + current_date.getHours()).slice(-2) + ":" + ('0' + current_date.getMinutes()).slice(-2);
    let test_data : test_object_t = {name:"MSK",date:str_now_time};
    db.insertTableContent('Test',savePath,test_data,(success:boolean,message:string) => {
        if(success) {
            console.log("insertTableContent success : "+message);
        } else {
            console.log("insertTableContent failed : "+message);
        }
    });
    //テスト読み込み
    db.getAll('Test',savePath,(success:boolean,data:[test_object_t])=> {
        if(success) {
            console.log("getAll success");
            console.log(data);
        } else {
            console.log("getAll failed");
        }
    });
};
