
/**
 * データベースに保存するフォーマット
 */
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