

/**************************************************************************************************
* データベースに保存するフォーマット
**************************************************************************************************/
export interface att_data_t {
    date: string,
    commuting_time: number,
    leave_work_time: number,
    rest_total_time: number,
    go_out_total_time: number,
    rest_start_time: number,
    go_out_start_time: number,
    total_work_time: number,
}

export interface att_read_data_t {
    date: string,
    commuting_time: number,
    leave_work_time: number,
    rest_total_time: number,
    go_out_total_time: number,
    rest_start_time: number,
    go_out_start_time: number,
    total_work_time: number,
    id: number
}

/**************************************************************************************************
* レイアウト・コンポーネントに関係する型
**************************************************************************************************/
export interface timeboard_cb_t {
    /*! 日付が変わったことを通知 */
    changes_date_handler:()=>void;
}