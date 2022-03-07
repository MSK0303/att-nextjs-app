import { Grid } from "@material-ui/core";
import {useState,useEffect} from "react"
import useInterval from "use-interval";
import { timeboard_cb_t } from "../../electron-src/types";

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



const TimeBoard = (props:timeboard_cb_t) => {
    /*! 現時刻表示のため*/
    //const [strNowDate,setStrNowDate] = useState<string>("");
    //const [strNowTime,setStrNowTime] = useState<string>(""); 
    /** 日付が変わったことを通知するため */
    const [currentDate,setCurrentDate] = useState<Date>(new Date());

    const getStrDate = (val:Date) : string => {
        const date:string = val.getFullYear() + "年" + ('0'+(val.getMonth()+1)).slice(-2) + "月" + ('0'+val.getDate()).slice(-2) + "日";
        return date;
    }
    
    const getStrTime = (val:Date) : string => {
        const time:string = val.getHours() + " : " + ('0'+val.getMinutes()).slice(-2) + " : " + ('0'+val.getSeconds()).slice(-2);
        return time;
    }

    const updateTime = () => {
        const now = new Date();
        // const date:string = now.getFullYear() + "年" + ('0'+(now.getMonth()+1)).slice(-2) + "月" + ('0'+now.getDate()).slice(-2) + "日";
        // const time:string = now.getHours() + " : " + ('0'+now.getMinutes()).slice(-2) + " : " + ('0'+now.getSeconds()).slice(-2);
        
        //console.log("current:"+currentDate.getDate()+",now:"+now.getDate());
        if(currentDate.getDate() != now.getDate()){
            console.log("[time board]changes date!!");
            props.changes_date_handler();
        }
        // console.log(strNowDate+","+date+" : "+(strNowDate!=date));
        // if(strNowDate != date){
        //     console.log("[time board]changes date!!");
        //     props.changes_date_handler();
        // }
        // setStrNowDate(date);
        // setStrNowTime(time);
        setCurrentDate(now);
    }
    useInterval(()=>{
        updateTime();
    },1000);
    // useEffect(() => {
    //     console.log("[Time Board] useEffect!!");
    //     setInterval(updateTime,1000);
    // }, []);

    return (
        <Grid item style={TimeBoardStyle}>
            {/* 年/月/日 */}
            <Grid container style={NowDateLabelStyle}>
                {getStrDate(currentDate)/*strNowDate*/}
            </Grid>
            {/* 時間 hh:mm:ss */}
            <Grid container style={NowTimeLabelStyle}>
                {getStrTime(currentDate)/*strNowTime*/}
            </Grid>
        </Grid>
    );
};

export default TimeBoard