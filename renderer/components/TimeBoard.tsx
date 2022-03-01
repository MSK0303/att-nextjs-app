import { Grid } from "@material-ui/core";
import {useState,useEffect} from "react"

/** Styles */
const TimeBoardStyle = {
    backgroundColor:"#00f0f0",
    padding:"10px",
    height:"100%",
    width:"100%"
};

const NowDateLabelStyle = {
    justifyContent:"center",
    marginTop:"20px",
    fontSize:"14px"
};

const NowTimeLabelStyle = {
    justifyContent:"center",
    marginTop:"40px",
    fontSize:"40px",
    fontWeight:"bold"
};

const TimeBoard = () => {
    /*! 現時刻表示のため*/
    const [strNowDate,setStrNowDate] = useState<string>("");
    const [strNowTime,setStrNowTime] = useState<string>(""); 

    const updateTime = () => {
        const now = new Date();
        const date:string = now.getFullYear() + "年" + ('0'+(now.getMonth()+1)).slice(-2) + "月" + ('0'+now.getDate()).slice(-2) + "日";
        const time:string = now.getHours() + " : " + ('0'+now.getMinutes()).slice(-2) + " : " + ('0'+now.getSeconds()).slice(-2);
        setStrNowDate(date);
        setStrNowTime(time);
    }

    useEffect(() => {
        console.log("[Time Board] useEffect!!");
        setInterval(updateTime,1000);
    }, []);

    return (
        <Grid item style={TimeBoardStyle}>
            {/* 年/月/日 */}
            <Grid container style={NowDateLabelStyle}>
                {strNowDate}
            </Grid>
            {/* 時間 hh:mm:ss */}
            <Grid container style={NowTimeLabelStyle}>
                {strNowTime}
            </Grid>
        </Grid>
    );
};

export default TimeBoard