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

  },[]);

  const clickButton = () => {
    Router.push("/detail");
  }

  const clickCreateButton = () => {
    console.log("clickCreateButton");
    let create_date : test_object_t = {name:"MSK",date:""};
    const current_date : Date = new Date();
    create_date.date = current_date.getFullYear() + "/" + ('0'+(current_date.getMonth()+1)).slice(-2) + "/" + ('0'+current_date.getDate()).slice(-2) + " " +('0' + current_date.getHours()).slice(-2) + ":" + ('0' + current_date.getMinutes()).slice(-2);
    global.ipcRenderer.send('db-create', create_date);
  }

  return (
    <Layout title="登録ページ">
      <h1>登録ページ</h1>
      <button onClick={clickButton}>Detailページへ</button>
      <h2>データ追加</h2>
      <button onClick={clickCreateButton}>データを追加する</button>
    </Layout>
  )
}


export default IndexPage