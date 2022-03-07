import { useState, useEffect } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'
//material-ui
import {Grid,Button,Container} from "@material-ui/core";
import TimeBoard from "../components/TimeBoard";
import {  att_read_data_t } from "../../electron-src/types";

import {getTimeFromUnixTime,getStrHourMinuteSecondTime} from "../utils/utility";

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
    height: "90%",//"100%",
    width: "100%"
}



/**
 * 
 * @returns 登録ページのビュー
 */
const IndexPage = () => {
    //useState
    /*! ボタンに表示するため */
    const [commutingTime,setCommutingTime] = useState<number>(0);
    const [leaveTime,setLeaveTime] = useState<number>(0);
    const [restTotalTime,setRestTotalTime] = useState<number>(0);
    const [goOutTotalTime,setGoOutTotalTime] = useState<number>(0);
    const [restStartTime,setRestStartTime] = useState<number>(0);
    const [goOutStartTime,setGoOutStartTime] = useState<number>(0);
    //コールバック関数
    /**
     * @detail データベース初期化完了コールバック
     * 
     * @param result 結果(true:成功, false:失敗)
     * @param list 今月の出退勤データのリスト
     */
    const db_init_resp_handler = (_event,result: boolean) => {
        if (result) {
            console.log("db_init_resp_handler.success");
            //成功したら今日の情報を取得
            const now:Date = new Date();
            global.ipcRenderer.send("db-r-td",now.getFullYear(),now.getMonth(),now.getDate());
        } else {
            //初期化が失敗した場合にはエラーを表示するべきでは?
            //TODO : ポップアップでウィンドを表示してエラーを通知
            console.log("db_init_resp_handler.failed");
        }
    }

    const db_read_target_day_att_info_resp_handler = (_event,result:boolean,content:att_read_data_t) => {
        if(result){
            console.log("db_read_target_day_att_info_resp_handler success");
            console.log(content);
            setCommutingTime(content.commuting_time);
            setLeaveTime(content.leave_work_time);
            setRestStartTime(content.rest_start_time);
            setRestTotalTime(content.rest_total_time);
            setGoOutStartTime(content.go_out_start_time);
            setGoOutTotalTime(content.go_out_total_time);
        } else {
            console.log("db_read_target_day_att_info_resp_handler failed");
        }
    }

    const db_write_commuting_time_resp_handler = (_event,result:Boolean,content:number) => {
        if(result) {
            setCommutingTime(content);
            console.log("db_write_commuting_time_resp_handler:success");
            console.log(content);
        } else {
            console.log("db_write_commuting_time_resp_handler:failed");
        }
    }

    const db_write_leave_time_resp_handler = (_event,result:Boolean,content:number) => {
        if(result) {
            setLeaveTime(content);
            console.log("db_write_leave_time_resp_handler:success");
            console.log(content);
        } else {
            console.log("db_write_leave_time_resp_handler:failed");
        }
    }

    const db_write_rest_time_resp_handler = (_event,result:Boolean,content:number) => {
        if(result) {
            setRestTotalTime(content);
            setRestStartTime(0);
            console.log("db_write_leave_time_resp_handler:success");
            console.log(content);
        } else {
            console.log("db_write_leave_time_resp_handler:failed");
        }
    }

    const db_write_go_out_time_resp_handler = (_event,result:Boolean,content:number) => {
        if(result) {
            setGoOutTotalTime(content);
            setGoOutStartTime(0);
            console.log("db_write_go_out_time_resp_handler:success");
            console.log(content);
        } else {
            console.log("db_write_go_out_time_resp_handler:failed");
        }
    }

    const db_write_rest_start_time_resp_handler = (_event,result:Boolean,content:number) => {
        if(result) {
            setRestStartTime(content);
            console.log("db_write_rest_start_time_resp_handler:success");
            console.log(content);
        } else {
            console.log("db_write_rest_start_time_resp_handler:failed");
        }
    }

    const db_write_go_out_start_time_resp_handler = (_event,result:Boolean,content:number) => {
        if(result) {
            setGoOutStartTime(content);
            console.log("db_write_go_out_start_time_resp_handler:success");
            console.log(content);
        } else {
            console.log("db_write_go_out_start_time_resp_handler:failed");
        }
    }
    /*! 初期画面でやること */
    useEffect(() => {
        console.log("useEffect!!");
        global.ipcRenderer.send('db-init');
    }, []);
    //リスナーを登録するEffect
    useEffect(() => {
        /*! データベース初期化完了通知 */
        global.ipcRenderer.addListener('db-init-resp', db_init_resp_handler);
        /*! 今日のデータベースの中身を取得通知*/
        global.ipcRenderer.addListener('db-r-td-resp', db_read_target_day_att_info_resp_handler);
        /*! 出勤登録完了通知 */
        global.ipcRenderer.addListener('db-w-ct-resp', db_write_commuting_time_resp_handler);
        /*! 退勤登録完了通知 */
        global.ipcRenderer.addListener('db-w-lwt-resp', db_write_leave_time_resp_handler);
        /*! 休憩完了通知 */
        global.ipcRenderer.addListener('db-w-rtt-resp', db_write_rest_time_resp_handler);
        /*! 外出完了通知 */
        global.ipcRenderer.addListener('db-w-gott-resp', db_write_go_out_time_resp_handler);
        /*! 休憩開始完了通知 */
        global.ipcRenderer.addListener('db-w-rst-resp', db_write_rest_start_time_resp_handler);
        /*! 外出開始完了通知 */
        global.ipcRenderer.addListener('db-w-gost-resp', db_write_go_out_start_time_resp_handler);
    }, []);

    /**
     * 新しい日付になったことを通知
     */
    const changedDateHandler = () => {
        /** 今までのプロパティをクリア */
        setCommutingTime(0);
        setLeaveTime(0);
        setRestStartTime(0);
        setRestTotalTime(0);
        setGoOutStartTime(0);
        setGoOutTotalTime(0);
        /** 新しく日付を付けたカラムを作成 */
        global.ipcRenderer.send("db-c-new");
    }

    const clickChangeDetailPageButton = () => {
        Router.push("/detail");
    }

    const clickCommutingTimeButton = () => {
        global.ipcRenderer.send("db-w-ct");
    }

    const clickLeaveTimeButton = () => {
        global.ipcRenderer.send("db-w-lwt");
    }

    const clickRestButton = () => {
        if(restStartTime == 0){
            console.log("clickRestButton:writeRestStartTime");
            global.ipcRenderer.send("db-w-rst");
        } else {
            console.log("clickRestButton:writeRestTotalTime");
            global.ipcRenderer.send("db-w-rtt");
        }
    }

    const clickGoOutButton = () => {
        if(goOutStartTime == 0) {
            console.log("clickGoOutButton:writeGoOutStartTime");
            global.ipcRenderer.send("db-w-gost");
        } else {
            console.log("clickGoOutButton:writeGoOutTotalTime");
            global.ipcRenderer.send("db-w-gott");
        }
    }

    return (
        <Layout title="登録ページ">
            <Container maxWidth="xl" style={content_style}>
                {/*１行目 タイムボードと履歴ページへのボタン配置 */}
                <Grid container spacing={5} style={timeboard_grid_style} >
                    <Grid item xs={10} sm={8} >
                        <TimeBoard changes_date_handler={changedDateHandler}/>
                    </Grid>
                    <Grid item xs={2} sm={4}>
                        <Button variant='outlined' style={{height:"100%",width:"100%"}} onClick={clickChangeDetailPageButton}>履歴へ</Button>
                    </Grid>
                </Grid>

                {/*2行目 出勤・退勤ボタン配置 */}
                <Grid container spacing={5} style={button_grid_style}>
                    <Grid item xs={6} >
                        
                        <Button variant={commutingTime==0?'outlined':'contained'} style={button_style} onClick={clickCommutingTimeButton} disabled={commutingTime==0?false:true}>
                            {commutingTime != 0 ? getTimeFromUnixTime(commutingTime) : ""}
                            <br/>出勤
                        </Button>                        
                    </Grid>
                    <Grid item xs={6} >
                        <Button variant={leaveTime==0?'outlined':'contained'} style={button_style} onClick={clickLeaveTimeButton} disabled={leaveTime==0?false:true}>
                            {leaveTime != 0 ? getTimeFromUnixTime(leaveTime) : ""}
                            <br/>退勤
                        </Button>  
                    </Grid>
                </Grid>
 
                {/*3行目 休憩・外出ボタン配置 */}
                <Grid container spacing={5}  style={button_grid_style}>
                    <Grid item xs={6} >
                        <Button variant={leaveTime==0?'outlined':'contained'} style={button_style} onClick={clickRestButton} disabled={leaveTime==0?false:true}>
                            {restTotalTime != 0 ? getStrHourMinuteSecondTime(restTotalTime) : ""}
                            <br/>{(restStartTime==0) ? "休憩":"休憩中"}
                        </Button>  
                    </Grid>
                    <Grid item xs={6} >
                        <Button variant={leaveTime==0?'outlined':'contained'} style={button_style} onClick={clickGoOutButton} disabled={leaveTime==0?false:true}>
                            {goOutTotalTime != 0 ? getStrHourMinuteSecondTime(goOutTotalTime) : ""}
                            <br/>{(goOutStartTime==0) ? "外出" : "外出中"}
                        </Button>  
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    )
}


export default IndexPage