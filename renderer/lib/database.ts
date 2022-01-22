// const db = require('electron-db');
// //const path = require('path');
import path from 'path';
const db = require('electron-db');

export const createDbTable = () => {
    const savePath:string = "./database";//path.join("./database","");

    db.createTable('Test',"./database",(success,msg) => {
        if(success) {
            console.log(msg);
        } else {
            console.log("failed to createTable. "+msg);
        }
    });
};
