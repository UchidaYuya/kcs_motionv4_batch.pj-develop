
import {ProcessBase} from "../batch/lib/process_base";
// import * as fjp_hrm_const from "../batch/lib/fjp_hrm_const";
import FJPProcCopyType from "../batch/lib/fjp_hrm_common";
import { G_LOG, G_LOG_HAND } from "../../db_define/define";
import { setTimeout } from 'timers/promises';

export const G_PROCNAME_FJP_HRM_COPY = "fjp_hrm_copy";
export const G_OPENTIME_FJP_HRM_COPY = "0000,2400";

//ロックファイルができるのを待つならtrue
//親プロセスを使わず単独動作ならtrue
//設定ファイル名(省略したらデフォルト値)
//0ならチェックのみ/1なら移動/2ならコピー
//ロックファイルを削除するならtrue
//コピー元のディレクトリ(省略したらデフォルト値)
//コピー先のディレクトリ(省略したらデフォルト値)
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//-----------------------------------------------------------------------
//機能：DB挿入プロセスが完了するまで待機する
//備考：動作可能時刻が設定されていなければ無限ループに陥る可能性がある
//引数：モデル
//返値：コピー可能になったらtrueを返す
//タイムオーバーしたらfalseを返す
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
export default class ProcessFJPHRMCopy extends ProcessBase {
	m_is_wait_for_lock: boolean;
	m_is_standalone: boolean;
	m_fname_setting: string;
	m_finish_mode: number;
	m_is_delete_lock: boolean;
	m_dir_to: string;
	m_dir_from: string;

	constructor(procname: string, logpath: string, opentime: string) {
		super(procname, logpath, opentime);
		this.m_is_wait_for_lock = true;
		this.m_is_standalone = true;
		this.m_fname_setting = "";
		this.m_finish_mode = 1;
		this.m_is_delete_lock = true;
		this.m_dir_to = "";
		this.m_dir_from = "";
		this.m_args.addSetting({
			w: {
// 2022cvt_016
				type: "int"
			},
			a: {
// 2022cvt_016
				type: "int"
			},
			s: {
// 2022cvt_016
				type: "string"
			},
			M: {
// 2022cvt_016
				type: "int"
			},
			W: {
// 2022cvt_016
				type: "int"
			},
			f: {
// 2022cvt_016
				type: "string"
			},
			F: {
// 2022cvt_016
				type: "string"
			}
		});
	}

	getProcname() {
		return "FJP人事マスタコピープロセス";
	}

	commitArg(args: { [x: string]: any; key?: any; value?: any; }) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "w":
				this.m_is_wait_for_lock = 0 != args.value;
				break;

			case "a":
				this.m_is_standalone = 0 != args.value;
				break;

			case "s":
				this.m_fname_setting = args.value;
				break;

			case "M":
				this.m_finish_mode = args.value + 0;
				break;

			case "W":
				this.m_is_delete_lock = 0 != args.value;
				break;

			case "f":
				this.m_dir_to = args.value;
				break;

			case "F":
				this.m_dir_from = args.value;
				break;
		}

		return true;
	}

	getUsage() {
// 2022cvt_015
		// var rval = ProcessBase.getUsage();
		var rval = super.getUsage();
		rval.push(["-w={0|1}", "ロックファイルができるのを待つか(1)"]);
		rval.push(["-a={0|1}", "親プロセスから呼ぶなら0(1)"]);
		rval.push(["-s=fname", "設定ファイル(フルパス)省略したらデフォルト値"]);
		rval.push(["-M={0|1|2}", "チェックなら0/移動なら1/コピーなら2(1)"]);
		rval.push(["-W={0|1}", "ロックファイルを削除するなら1(1)"]);
		rval.push(["-f=dir/", "コピー先ディレクトリ(右端は/)"]);
		rval.push(["-F=dir/", "コピー元ディレクトリ(右端は/)"]);
		return rval;
	}

	getManual() {
// 2022cvt_015
		// var rval = ProcessBase.getManual();
		var rval = super.getManual();
		rval += "ロックファイルができるのを";
		rval += this.m_is_wait_for_lock ? "待つ": "待たない";
		rval += "\n";
		rval += (this.m_is_standalone ? "単独動作": "親プロセスから呼び出し") + "\n";
		rval += "設定ファイルは" + (this.m_fname_setting.length ? this.m_fname_setting : "デフォルト値") + "\n";
		rval += "実行モードは";

		switch (this.m_finish_mode) {
			case 0:
				rval += "チェックのみ";
				break;

			case 1:
				rval += "移動";
				break;

			case 2:
				rval += "コピー";
				break;
		}

		rval += "\n";
		rval += "ロックファイルを削除" + (this.m_is_delete_lock ? "する": "しない") + "\n";
		rval += "コピー先ディレクトリ" + (this.m_dir_to.length ? this.m_dir_to : "デフォルト値") + "\n";
		rval += "コピー元ディレクトリ" + (this.m_dir_from.length ? this.m_dir_from : "デフォルト値") + "\n";
		return rval;
	}

	async wait(O_model: FJPProcCopyType) {
		if (!this.m_is_wait_for_lock) return true;

		while (true) //タイムアウトしたらfalseを返す
		{
			if (!this.isOpen()) return false;
			if (O_model.isReadyLock()) break;
			await setTimeout(10);
			// sleep(10);
		}
// 
		return true;
	}

	async do_execute() //モデルを生成する
	//設定ファイルが開けなかったら終了する
	//トランザクション開始
	//移動を実行する
	//トランザクション破棄または反映
	{
// 2022cvt_015
        let d = new Date();
		// var O_model = new FJPProcCopyType(this.m_listener, this.m_db, this.m_table_no, date("Y"), date("n"), this.m_listener_process.m_path, this.m_is_standalone, this.m_fname_setting, this.m_finish_mode, this.m_is_delete_lock && this.m_is_wait_for_lock, this.m_dir_from, this.m_dir_to);
		var O_model = new FJPProcCopyType(this.m_listener, this.m_db, this.m_table_no, (d.getFullYear()+1).toString(), (d.getMonth()+1).toString(), this.m_listener_process!.m_path, this.m_is_standalone, this.m_fname_setting, this.m_finish_mode, this.m_is_delete_lock && this.m_is_wait_for_lock, this.m_dir_from, this.m_dir_to);
		if (O_model.isFailSetting()) return false;
// 2022cvt_015
		var is_timeout = !this.wait(O_model);
		this.beginDB();
// 2022cvt_015
		var is_ok = O_model.execute(is_timeout);
		this.endDB(is_ok);
		return is_ok;
	}

};

// checkClient(G_CLIENT_DB);
// 2022cvt_015
var log = G_LOG;
// 2022cvt_016
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
// 2022cvt_015
var proc = new ProcessFJPHRMCopy(G_PROCNAME_FJP_HRM_COPY, log, G_OPENTIME_FJP_HRM_COPY);
if (!proc.readArgs(undefined)) throw process.exit(1);// 2022cvt_009
if (!proc.execute()) throw process.exit(1);// 2022cvt_009
throw process.exit(0);// 2022cvt_009
