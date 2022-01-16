import { useState,useEffect } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'

const IndexPage = () => {

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