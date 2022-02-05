import { useState,useEffect } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'


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