import { useState, useEffect } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'

import { att_data_t, att_read_data_t } from "../types";

const IndexPage = () => {
    //useState
    /*! ボタンに表示するため */
    const [attData,setAttData] = useState<att_data_t>();
    /*! 現時刻表示のため*/
    const [strNowTime,setStrNowTime] = useState<string>(""); 
    //コールバック関数
    /**
     * @detail データベース初期化完了コールバック
     * 
     * @param result 結果(true:成功, false:失敗)
     * @param list 今月の出退勤データのリスト
     */
    const db_init_resp_handler = (result: boolean) => {
        if (result) {
            console.log("db_init_resp_handler.success");
        } else {
            //初期化が失敗した場合にはエラーを表示するべきでは?
            //TODO : ポップアップでウィンドを表示してエラーを通知
            console.log("db_init_resp_handler.failed");
        }
    }
    /*! 初期画面でやること */
    useEffect(() => {
        console.log("useEffect!!");
        global.ipcRenderer.send('db-init', 'db');
    }, []);
    //リスナーを登録するEffect
    useEffect(() => {
        /*! データベース初期化完了通知 */
        global.ipcRenderer.addListener('db-init-resp', db_init_resp_handler);
        /*! 出勤登録完了通知 */

    }, []);

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