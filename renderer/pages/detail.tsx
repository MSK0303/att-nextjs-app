import { useState,useEffect } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'

import {att_read_data_t} from "../../electron-src/types";

import {Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper} from "@material-ui/core";
import {ArrowBackIos,ArrowForwardIos} from "@material-ui/icons";

import {getTimeFromUnixTime,getStrHourMinuteSecondTime} from "../utils/utility";

const TABLE_HEAD_LABEL_TABLE = [
    "日付","出勤時間","退勤時間","休憩時間","外出時間","勤怠時間",
];

const DetailPage = () => {
    const [attInfo,setAttInfo] = useState<att_read_data_t[]>([]);
    const [targetDate,setTargetDate] = useState<Date>(new Date());

    useEffect(() => {
        global.ipcRenderer.addListener("db-r-tm-resp",(_event,result:boolean,contents:att_read_data_t[])=>{
            if(result){
                console.log("DetailPage:can not get att info");
                setAttInfo(contents);
            } else {
                console.log("DetailPage:can not get att info");
            }
        });
    },[]);

    useEffect(() => {
        console.log("DetailPage useEffect!!");
        const current_date:Date = new Date();
        global.ipcRenderer.send("db-r-tm",current_date.getFullYear(),current_date.getMonth());
    }, []);

    const getTargetDateMessage = () : string => {
        return targetDate.getFullYear()+"年"+('0'+(targetDate.getMonth()+1)).slice(-2)+"月の勤怠状況";
    }


    return (
    <Layout title="詳細ページ">
        {/* メインページに戻る */}
        <Button onClick={()=>{Router.push("/")}} style={{fontSize:"10px",marginLeft:"5px"}}>メインページに戻る</Button>
        {/* 機能部分 */}
        <div style={{display:"flex",marginTop:"10px"}}>
            <button>
                <ArrowBackIos />
            </button>
            <span style={{margin:"auto 10px auto 10px"}}>{getTargetDateMessage()}</span>
            <button>
                <ArrowForwardIos /> 
            </button>

            <Button variant='contained' style={{marginLeft:"auto"}}>csvファイル出力</Button>
        </div>
        {/* テーブル */}
        <TableContainer component={Paper} style={{marginTop:"10px"}}>
            <Table style={{minWidth:"650px"}}>
                <TableHead>
                    {TABLE_HEAD_LABEL_TABLE.map((row) => (
                        <TableCell align='center'>{row}</TableCell>
                    ))}
                </TableHead>
                <TableBody>
                    {attInfo.map((row)=>(
                        <TableRow>
                            <TableCell align='center'>{row.date}</TableCell>
                            <TableCell align='center'>{getTimeFromUnixTime(row.commuting_time)}</TableCell>
                            <TableCell align='center'>{getTimeFromUnixTime(row.leave_work_time)}</TableCell>
                            <TableCell align='center'>{getStrHourMinuteSecondTime(row.rest_total_time)}</TableCell>
                            <TableCell align='center'>{getStrHourMinuteSecondTime(row.go_out_total_time)}</TableCell>
                            <TableCell align='center'>{getStrHourMinuteSecondTime(row.total_work_time)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Layout>
    )
}

export default DetailPage
