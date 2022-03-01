import { useState, useEffect } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'
//material-ui
import {Grid,Button,Container,Box} from "@material-ui/core";
import TimeBoard from "../components/TimeBoard";
import { att_data_t, att_read_data_t } from "../types";

/** Style */
const content_style = {
    height: "100vh",
    marginTop: "20px",
    minWidth: "600px",
    minHeight: "560px",
}

const timeboard_grid_style = {
    height: "40%",
}

const button_grid_style = {
    height: "20%",
    marginTop: "20px",
}

const button_style = {
    height: "100%",
    width: "100%"
}



/**
 * 
 * @returns 登録ページのビュー
 */
const IndexPage = () => {
    //useState
    /*! ボタンに表示するため */
    const [attData,setAttData] = useState<att_data_t>();

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
            <Container maxWidth="xl" style={content_style}>
                {/*１行目 タイムボードと履歴ページへのボタン配置 */}
                <Grid container spacing={5} style={timeboard_grid_style} >
                    <Grid item xs={10} sm={8} >
                        <TimeBoard />
                    </Grid>
                    <Grid item xs={2} sm={4}>
                        <Button variant='outlined' style={{height:"100%",width:"100%"}}>履歴へ</Button>
                    </Grid>
                </Grid>

                {/*2行目 出勤・退勤ボタン配置 */}
                <Grid container spacing={5} style={button_grid_style}>
                    <Grid item xs={6} >
                        <Button variant='outlined' style={button_style}>出勤</Button>                        
                    </Grid>
                    <Grid item xs={6} >
                        <Button variant='outlined' style={button_style}>退勤</Button>  
                    </Grid>
                </Grid>
 
                {/*3行目 休憩・外出ボタン配置 */}
                <Grid container spacing={5}  style={button_grid_style}>
                    <Grid item xs={6} >
                        <Button variant='outlined' style={button_style}>休憩</Button>  
                    </Grid>
                    <Grid item xs={6} >
                        <Button variant='outlined' style={button_style}>外出</Button>  
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    )
}


export default IndexPage