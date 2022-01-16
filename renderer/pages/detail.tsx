import { useState,useEffect } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'

const DetailPage = () => {

    const clickButton = () => {
        Router.push("/");
    }

    return (
    <Layout title="詳細ページ">
        <h1>詳細ページ</h1>
        <button onClick={clickButton}>メインページへ</button>
    </Layout>
    )
}

export default DetailPage
