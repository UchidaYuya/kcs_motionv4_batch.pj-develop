//Globalオブジェクトの要素の型を定義する。
export interface global {}
declare global {
  var LOGIN_GROUPNAME: string;
  var PACTTYPE: string;
  var GROUPID: any;
  var G_HELP_DISPLAY: any;
  var G_HELP_FILE: string;
  var WEB_DIR: string;
  var G_dsn_temp: {
    user: string,
    host: string,
    database: string,
    password: string,
    port: number
  };
  var G_dsn: {
    user: string,
    host: string,
    database: string,
    password: string,
    port: number
  }

  var GO_errlog: any;
  var GO_db: any;
  var debugging: boolean;
  var GH_dboption:{ persistent : true };
  var G_traceflg: any
  var GO_tracelog: any
  var GH_logopt: any
  var GO_debuglog: any
  var G_sesslimit: number
  var G_shop_sesslimit: number
  var G_mailsend: number
  var G_err_mailsend: number
  var G_mailsave: number
  var kcsmotion_key: string
  var def_errorto: string
  var mail_error_subj: string
  var def_from: string
  var def_subj: string
  var def_from_name: string
  var def_return_path: string
  var bcc_addr: string
  var sendmail_path : boolean
  var localsend : boolean
  var sendmail_args : boolean
  var smtp_host : boolean
  var smtp_port : boolean
  var O_conf  : any
  var GO_traceLogger:any
  var groupid :any
  var G_dsn_pg_pool_master: string;
  var G_dsn_pg_pool_secondary: string;
  var LocalLogFile: string;
}
