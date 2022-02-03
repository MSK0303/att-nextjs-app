import { useState,useEffect } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'

import {att_data_t,att_read_data_t} from "../types";

const IndexPage = () => {

  const [att_info,setAttInfo] = useState<[att_read_data_t]>();

  useEffect(()=>{
    console.log("useEffect!!");
    global.ipcRenderer.send('db-init', 'db');
  },[]);

  useEffect(()=>{
    global.ipcRenderer.addListener('db-init-resp-failed', () => {
      console.log("failed to db-init");
    });
    global.ipcRenderer.addListener('db-init-success', (data:[att_read_data_t]) => {
      console.log("success to db-init");
      setAttInfo(data);
    });
  },[]);

  const clickButton = () => {
    Router.push("/detail");
  }

  return (
    <Layout title="登録ページ">
      <h1>登録ページ</h1>
      <button onClick={clickButton}>Detailページへ</button>
    </Layout>
  )
}


export default IndexPage