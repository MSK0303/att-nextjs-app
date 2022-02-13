import { useState,useEffect } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'

import {test_object_t} from "../types";

const IndexPage = () => {

  useEffect(()=>{
    console.log("useEffect!!");
    global.ipcRenderer.send('db-init', 'db');
  },[]);

  useEffect(()=>{
    console.log("useEffect!!");
    global.ipcRenderer.addListener('db-init-resp', (_event, result) => {
      if(result){
        console.log("init database success");
      } else {
        console.log("init database failed");
      }
    });

    global.ipcRenderer.addListener('db-create-resp', (_event, result) => {
      if(result){
        console.log("init database success");
      } else {
        console.log("init database failed");
      }
    });

    global.ipcRenderer.addListener("db-get-all-resp",(_event, result) => {
      if("boolean" == typeof result) {
        console.log("get all failed");
      } else {
        console.log("get all success");
        console.log(result);
      }
    });

    global.ipcRenderer.addListener("db-get-specified-date-resp",(_event, result) => {
      if("boolean" == typeof result) {
        console.log("get specified data failed");
      } else {
        console.log("get specified data success");
        console.log(result);
      }
    });

    global.ipcRenderer.addListener("db-search-resp",(_event, result) => {
      if("boolean" == typeof result) {
        console.log("search data failed");
      } else {
        console.log("search data success");
        console.log(result);
      }
    });

    global.ipcRenderer.addListener("db-update-resp",(_event, result) => {
      if(result) {
        console.log("update data failed");
      } else {
        console.log("update data success");
      }
    });

    global.ipcRenderer.addListener("db-delete-resp",(_event, result) => {
      if(result) {
        console.log("delete data failed");
      } else {
        console.log("delete data success");
      }
    });

  },[]);

  const [memo,setMemo] = useState("");

  const clickButton = () => {
    Router.push("/detail");
  }

  const clickCreateButton = () => {
    console.log("clickCreateButton: memo="+memo);
    let create_date : test_object_t = {name:"MSK",date:"",memo:memo};
    const current_date : Date = new Date();
    create_date.date = current_date.getFullYear() + "/" + ('0'+(current_date.getMonth()+1)).slice(-2) + "/" + ('0'+current_date.getDate()).slice(-2) + " " +('0' + current_date.getHours()).slice(-2) + ":" + ('0' + current_date.getMinutes()).slice(-2);
    global.ipcRenderer.send('db-create', create_date);
  }

  const clickGetAllButton = () => {
    global.ipcRenderer.send('db-get-all');
  }

  const clickGetSpecifiedDataButton = () => {
    global.ipcRenderer.send('db-get-specified-date',"2022/02/07 22:38");
  }

  const clickSearchButton = () => {
    global.ipcRenderer.send('db-search',"2022/02/07");
  }

  const clickUpdateButton = () => {
    global.ipcRenderer.send('db-update',"2022/02/11 23:38","update memo");
  }

  const clickDeleteButton = () => {
    global.ipcRenderer.send('db-delete',"2022/02/11 23:38");
  }

  return (
    <Layout title="登録ページ">
      <h1>登録ページ</h1>
      <button onClick={clickButton}>Detailページへ</button>
      <h2>データ追加</h2>
      <input type="text" value={memo} onChange={(event)=>{setMemo(event.target.value);}} />
      <button onClick={clickCreateButton}>データを追加する</button>
      <h2>データ取得</h2>
      <button onClick={clickGetAllButton}>データ取得</button>
      <h2>データ取得2</h2>
      <button onClick={clickGetSpecifiedDataButton}>データ取得2</button>
      <h2>データ検索</h2>
      <button onClick={clickSearchButton}>データ検索</button>
      <h2>データ更新</h2>
      <button onClick={clickUpdateButton}>データ更新</button>
      <h2>データ削除</h2>
      <button onClick={clickDeleteButton}>データ更新</button>
    </Layout>
  )
}


export default IndexPage