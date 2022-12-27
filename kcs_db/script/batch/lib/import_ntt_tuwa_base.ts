import { ProcessDefault } from "../lib/process_base";
// import log from "../../../class/log";

import  {sprintf} from "../../../db_define/define";
import {
	G_SCRIPT_WARNING,
	G_SCRIPT_ALL,
	G_SCRIPT_INFO,
	G_SCRIPT_ERROR,
	ScriptLogBase,
	ScriptLogFile,
	ScriptLogAdaptor
} from "../../batch/lib/script_log";
import { ScriptDB, TableInserter } from "../../batch/lib/script_db";
// const fs = require('fs');
import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as PATH from "path";
import { ScriptArgs } from "./script_command";
export const G_OPENTIME = "0000,2400";
export const DEBUG = 0;
export const KCS_DIR = "/kcs";
export const G_SCRIPT_ERROE = "import_ntt_tuwa_base";
export const G_CARRIER_ID = "import_nttcom_tuwa";
export const G_COMPANY_ID = "import_nttcom_tuwa";

//インポート前にテーブルをクリアするか
//ファイルを読み出すパス(nullならclampfile_tbから)
//DBから読む場合に、読み出す種別
//ローカル(スクリプト毎)なログ出力
//インポートファイルの出力先
//pactid=all を指定した場合、ディレクトリ名称から複数のpactidを積む
//処理中のm_a_pactidsの要素No.
//処理対象のpactid
//for ロギング
//開始時刻(経過時間算定のため)
//処理中のファイル
//処理中の行
//処理した行数(ファイル毎)
//処理した行数
//警告した行数(ファイル毎)
//警告した行数
//処理したファイル数
//処理名称（日本語）
//処理名称（半角英数）
//通話明細で使用するエリアコードデータ
//通話明細で使用する国コードデータ
//通話明細で使用する通話種別
//通話明細で使用する昼夜深
//通話明細で使用する昼夜深
//ファイル毎初期処理フラグ
//処理対象ファイル名称
//-----------------------------------------------------------------------
//機能：コンストラクタ
//引数：
//プロセス名(ログ保存フォルダに使用する)
//プロセス名２バイト文字(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//-----------------------------------------------------------------------
//機能：ARGVを処理する
//引数：ARGV(nullならグローバルのARGVを使用する)
//最初の一個を無視するならtrue
//返値：深刻なエラーが発生したらfalseを返す
//データディレクトリのPathなど初期化
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、実行するか問い合わせる
//返値：実行すべきならtrueを返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//機能：処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//不要ディレクトリ削除
//ここをオーバーライトして使用する
//一行(固定長)を分割して処理する
//update 2004/12/7 上杉顕一郎
//完了ディレクトリへ移動
//update end
//共通
//一ファイルを処理する
//共通
//共通電話番号の余分文字削除
//共通
//指定ディレクトリ以下のファイル・ディレクトリを返す
// 2022cvt_016
//$type
//file : ファイルのみ
//dir  : ディレクトリのみ
//both : ディレクトリ・ファイル両方
//共通
//経過時間を文字列で返す [HH:MM:SS]
export default class import_ntt_tuwa_base extends ProcessDefault {
	m_args!: ScriptArgs;
	m_clearflag: string;
	m_insertCountGross: number;
	m_warningCountGross: number;
	m_fileCount: number;
	m_beginTime: number;
	m_active_pact_idx: number;
	m_procname: string;
	m_procname_j: string;
	m_db!: ScriptDB;
	m_h_comm_area: Array<any> = [];
	m_h_wld_area: Array<any> = [];
	m_h_tuwa_kind: Array<any> = [];
	m_h_daynight: Array<any> = [];
	m_h_daynight_wld: Array<any> = [];
	m_listener!: ScriptLogBase;
	m_backupflag: string = "";
	m_exppath: string = "";
	o_log!: ScriptLogAdaptor;
	m_target_pactid: string = "";
	m_srcpath: string = "";
	m_compname: any;
	m_warningCount: number = 0;
	m_a_pactids: any;
	m_file_name: string = "";
	m_targetFile: string = "";
	m_targetLine: number = 0;
	m_insertCount: number = 0;
	m_first_flag: boolean = false;

	// import_ntt_tuwa_base(procname:any, procname_j:any, logpath:any, opentime:any) //初期化
	constructor(procname: string, procname_j: string, logpath: string, opentime: string) //初期化
	//県名コード→県名
	//通話種別コード→通話種別名称
	//昼夜深別コード→昼夜深別名称
	//昼夜深別コード→昼夜深別名称(国際用)
	{
		// this.ProcessDefault(procname, logpath, opentime, true);
		super(procname, logpath, opentime, true);
		this.m_clearflag = "";
		this.m_insertCountGross = 0;
		this.m_warningCountGross = 0;
		this.m_fileCount = 0;
		this.m_beginTime = Date.now() / 1000;
		this.m_active_pact_idx = 0;
		this.m_procname = procname;
		this.m_procname_j = procname_j;
	}

	async ini() {
		this.m_args.addSetting({
			e: {
// 2022cvt_016
				type: "string"
			},
			p: {
// 2022cvt_016
				type: "string"
			},
			y: {
// 2022cvt_016
				type: "string"
			},
			b: {
// 2022cvt_016
				type: "string"
			}
		});
// 2022cvt_016
// 2022cvt_015
		var sql = "select code, name, type from comm_area_tb where carid=" + G_CARRIER_ID;

// 		if (!DEBUG) {
// 		// if (DEBUG == 1) {
// // 			echo(sql + "\n");// 2022cvt_010
// 		}

// 2022cvt_015
		var O_result = await this.m_db.query(sql);

		// if (count(O_result) != 0) {
		if (O_result != 0) {
// 2022cvt_015
			var row = Array();
			var count = 0;
// 2022cvt_015
			//var count = 0;
			count = 0;

			while (row = O_result.fetchRow()) {
				if ("Pr" == row[2]) {
					this.m_h_comm_area[row[0]] = row[1];
				} else if ("Co" == row[2]) {
					this.m_h_wld_area[row[0]] = row[1];
				}
			}
		}

		O_result.free();
		sql = "select code,name from tuwa_tb where carid=" + G_CARRIER_ID;

// 		if (!DEBUG) {
// 		// if (DEBUG == 1) {
// // 			echo(sql + "\n");// 2022cvt_010
// 		}

		O_result = await this.m_db.query(sql);

		// if (count(O_result) != 0) {
		if (O_result != 0) {
			count = 0;

			while (row = O_result.fetchRow()) {
				this.m_h_tuwa_kind[row[0]] = row[1];
			}
		}

		O_result.free();
// 2022cvt_016
		sql = "select code,name from daynight_tb where servicetype='NONE' and carid=" + G_CARRIER_ID;

// 		if (!DEBUG) {
// 		// if (DEBUG == 1) {
// // 			echo(sql + "\n");// 2022cvt_010
// 		}

		O_result = await this.m_db.query(sql);

		// if (count(O_result) != 0) {
		if (O_result != 0) {
			count = 0;

			while (row = O_result.fetchRow()) {
				this.m_h_daynight[row[0]] = row[1];
			}
		}

		O_result.free();
// 2022cvt_016
		sql = "select code,name from daynight_tb where servicetype='30' and carid=" + G_CARRIER_ID;

		if (!DEBUG) {
		// if (DEBUG == 1) {
// 			echo(sql + "\n");// 2022cvt_010
		}

		O_result = await this.m_db.query(sql);

		// if (count(O_result) != 0) {
		if (O_result != 0) {
			count = 0;

			while (row = O_result.fetchRow()) {
				this.m_h_daynight_wld[row[0]] = row[1];
			}
		}

		O_result.free();
	}

	readArgs(A_argv: any, skip_first = true) //リセット
	//データディレクトリのPathなど初期化
	{
		this.m_year = 0;
		this.m_month = 0;

		if (!this.m_args.readAll(A_argv, skip_first)) {
			this.m_args.writeLog(this.m_listener);
			return false;
		}

		if (!this.checkArgs() || !this.commitArgs()) {
			return false;
		}

// 2022cvt_015
		var has_error = false;
		//01
		{
			if (this.m_clearflag == "") {
// 				echo("-e \u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044[\u5FC5\u9808]\n");// 2022cvt_010
				has_error = true;
			}

			if (this.m_pactid == "") {
// 				echo("-p \u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044[\u5FC5\u9808]\n");// 2022cvt_010
				has_error = true;
			}

			if (this.m_year == 0 || this.m_month == 0) {
// 				echo("-y \u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044[\u5FC5\u9808]\n");// 2022cvt_010
				has_error = true;
			}

			if (this.m_backupflag == "") {
// 				echo("-b \u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044[\u5FC5\u9808]\n");// 2022cvt_010
				has_error = true;
			}

			if (has_error) //エラー発生時終了
				{
					return false;
				}
		}
// 2022cvt_015
		var res = this.each_init();
		return res;
	}

	each_init() //インポートファイルの出力先のPath
	//ログオブジェクト生成
	//ディレクトリ確認
	//エラー出力用ハンドル
	//ソースフォルダのパスを生成
	//ログフォルダのパスを生成
	//ログ出力
	{
// 2022cvt_021
// 2022cvt_015
		var yyyymm = sprintf("%04d%02d", this.m_year.toString(), this.m_month.toString());
		this.m_exppath = KCS_DIR + "/data/" + yyyymm + "/" + G_COMPANY_ID;
// 2022cvt_015
		var dbLogFileDir = KCS_DIR + "/data/" + yyyymm + "/" + G_COMPANY_ID;

		try {
			if (!fs.existsSync(dbLogFileDir)) {
				global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " 作業用のディレクトリ(" + dbLogFileDir + ")が存在しません。", 4);
			}
		} catch (e) {
			return false;
		}
		// if (!file_exists(dbLogFileDir)) {
		if (!fs.existsSync(dbLogFileDir)) {
// 			echo("\u4F5C\u696D\u7528\u306E\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + dbLogFileDir + ")\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002\n");// 2022cvt_010
			global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " 作業用のディレクトリ(" + dbLogFileDir + ")が存在しません。", 4);
			return false;
		}

// 2022cvt_015
		var dbLogFile = dbLogFileDir + "/" + new Date().toJSON().slice(0,10).replace(/-/g,'-') + ".log";
// 2022cvt_015
		var log_listener = new ScriptLogBase(0);
// 2022cvt_016
// 2022cvt_015
		var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
// 2022cvt_016
		log_listener.putListener(log_listener_type);
		this.o_log = new ScriptLogAdaptor(log_listener, true);
// 		echo("\u30ED\u30FC\u30AB\u30EB\u30ED\u30B0\uFF1A" + KCS_DIR + "/data/" + yyyymm + "/" + G_COMPANY_ID + "/" + date("Ymd") + ".log\n");// 2022cvt_010
// 2022cvt_021
		yyyymm = sprintf("%04d%02d", this.m_year.toString(), this.m_month.toString());

		if (this.m_pactid != "all") //指定
			{
				this.m_target_pactid = this.m_pactid;
				this.m_srcpath = KCS_DIR + "/data/" + yyyymm + "/" + G_COMPANY_ID + "/" + this.m_pactid;
			} else //all
			{
				this.m_srcpath = KCS_DIR + "/data/" + yyyymm + "/" + G_COMPANY_ID;
			}

		this.m_logpath = KCS_DIR + "/data/" + yyyymm;
		this.m_args.writeLog(this.m_listener);
		return true;
	}

	commitArg(args: { [x: string]: any; key?: any; value?: any; }) {
		switch (args.key) {
			case "e":
				this.m_clearflag = args.value.toLowerCase();
				break;

			case "p":
				this.m_pactid = args.value.toLowerCase();
				break;

			case "y":
// 2022cvt_015
				var src = args.value;
				this.m_year = 0 + src.substring(0, 4);
				this.m_month = 0 + src.substring(4, 2);
				var d = new Date();
				var year: any;

				if (this.m_year > (d.getFullYear())) {
// 					echo("\u51E6\u7406\u5BFE\u8C61\u6708\u306B\u672A\u6765\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002\n");// 2022cvt_010
					global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + ` 処理対象月に未来の年月を指定 (${src}) `, 4);
					return false;
				}

				if (this.m_year == (d.getFullYear() - year)) {
					if (this.m_month > (d.getMonth() + 1)) {
// 						echo("\u51E6\u7406\u5BFE\u8C61\u6708\u306B\u672A\u6765\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002\n");// 2022cvt_010
						global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + ` 処理対象月に未来の年月を指定 (${src}) `, 4);
						return false;
					}
				}

				if (this.getTableNo() > 12) {
// 					echo("\u51E6\u7406\u5BFE\u8C61\u6708\u306B\u4E00\u5E74\u4EE5\u4E0A\u524D\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002\n");// 2022cvt_010
					global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + ` 処理対象月に一年以上前の年月を指定 (${src}) `, 4);
					return false;
				}

				break;

			case "b":
				this.m_backupflag = args.value.toLowerCase();
				break;

			case "h":
// 2022cvt_015
				var A_usage = this.getUsage();
// 2022cvt_015
				var maxlength = 0;

// 2022cvt_015
				for (var usage of (A_usage)) {
// 2022cvt_015
					var len = usage[0].length;
					if (maxlength < len) maxlength = len;
				}

				++maxlength;
// 2022cvt_015
				var body = "";

// 2022cvt_015
				for (var usage of (A_usage)) {
// 2022cvt_015
					var line = "\t" + usage[0];

					while (line.length < maxlength) line += " ";

					line += usage[1];
					body += line + "\n";
				}

				console.log(body);
				throw process.exit(0);// 2022cvt_009
		}

		return true;
	}

	getUsage() {
// 2022cvt_015
		var rval = Array();
		rval.push(["-e={a|o}", "インポート前にDBからレコードを削除 a:しない[append]、o:する[overwrite]"]);
		rval.push(["-p={(pactid)|ALL}", " pactid:処理対象顧客の指定、 ALL:全顧客"]);
		rval.push(["-y={YYYYMM}", "処理対象年月(請求年月)"]);
		rval.push(["-b={Y|n}", "バックアップを行うか"]);
		return rval;
	}

	async askManual() //pact 存在確認
	//対象年月のフォーマットチェック
	{
		if (!this.m_manualflag) return true;
// 		echo(this.getManual());// 2022cvt_010
// 2022cvt_015
		var hasError_flag = false;

		if (this.m_pactid != "all") {
			// if (is_numeric(this.m_pactid)) {
			if (!isNaN(Number(this.m_pactid))) {
// 2022cvt_015
				var sql = "select count(pactid) from pact_tb where pactid='" + this.m_pactid + "'";
				this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + " SQL:"+ sql +" ");

				if (await this.m_db.getOne(sql) == 0) {
// 					echo("\u6307\u5B9A\u306E\u5BFE\u8C61\u9867\u5BA2(" + this.m_pactid + ")\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002\n");// 2022cvt_010
					global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " 指定の対象顧客(" + this.m_pactid + ")は存在しません。", 4);
					hasError_flag = true;
				} else {
					sql = "select compname from pact_tb where pactid='" + this.m_pactid + "'";
					this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + " SQL:" + sql + " ");
					this.m_compname = this.m_db.getOne(sql);
				}
			} else {
// 				echo("\u5BFE\u8C61\u9867\u5BA2\u6307\u5B9A\u306E\u5024(" + this.m_pactid + ")\u304C\u4E0D\u6B63\u3067\u3059\u3002\n");// 2022cvt_010
				global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " 対象顧客指定の値(" + this.m_pactid + ")が不正です。", 4);
				hasError_flag = true;
			}
		} else {
			this.m_compname = " ";
		}

// 2022cvt_015
		var yyyymm = this.m_year + this.m_month;

		// if (!is_numeric(yyyymm)) {
		if (isNaN(Number(yyyymm))) {
// 			echo("\u5BFE\u8C61\u5E74\u6708(\u8ACB\u6C42\u5E74\u6708)\u6307\u5B9A\u306E\u5024(" + this.m_pactid + ")\u304C\u4E0D\u6B63\u3067\u3059\u3002\n");// 2022cvt_010
			global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " 対象年月(請求年月)指定の値(" + this.m_pactid + ")が不正です。", 4);
			hasError_flag = true;
		}

		if (!(this.m_clearflag == "a" || this.m_clearflag == "o")) {
// 			echo("\u30EC\u30B3\u30FC\u30C9\u524A\u9664\u30D5\u30E9\u30B0\u306E\u5024(" + this.m_clearflag + ")\u306F\u4E0D\u6B63\u3067\u3059\u3002\n");// 2022cvt_010
			global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " レコード削除フラグの値(" + this.m_clearflag + ")が不正です。", 4);
			hasError_flag = true;
		}

		if (!(this.m_backupflag == "y" || this.m_backupflag == "n")) {
// 			echo("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30D5\u30E9\u30B0\u306E\u5024(" + this.m_backupflag + ")\u306F\u4E0D\u6B63\u3067\u3059\u3002\n");// 2022cvt_010
			global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " バックアップフラグの値(" + this.m_backupflag + ")が不正です。", 4);
			hasError_flag = true;
		}

		try {
			if (!fs.existsSync(this.m_srcpath)) {
				global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " 対象のディレクトリ(" + this.m_srcpath + ")が存在しません。", 4);
			}
		} catch (e) {
			hasError_flag = true;
		}
		// if (!file_exists(this.m_srcpath)) {
// 		if (!fs.existsSync(this.m_srcpath)) {
// // 			echo("\u5BFE\u8C61\u306E\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002\n");// 2022cvt_010
// 			global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " 対象のディレクトリ(" + this.m_srcpath + ")が存在しません。", 4);
// 			hasError_flag = true;
// 		}

// 2022cvt_015
		var backup_path = KCS_DIR + "/data/exp/";

		if (!fs.existsSync(backup_path)) {
			fs.mkdirSync(backup_path);
		}

		// if (!file_exists(backup_path)) {
		// if (!fs.existsSync(backup_path)) {
		// 	//mkdir(backup_path);
		// 	fs.mkdirSync(backup_path);

		// }

// 2022cvt_015
		var log_path = KCS_DIR + "/data/log/";

		if (!fs.existsSync(log_path)) {
			fs.mkdirSync(log_path)
		}

		// if (!file_exists(log_path)) {
		// if (!fs.existsSync(log_path)) {
		// 	//mkdir(backup_path);
		// 	fs.mkdirSync(log_path);
		// }

		if (hasError_flag) {
			return false;
		}

// 2022cvt_021
		yyyymm = parseInt(sprintf("%04d%02d", this.m_year.toString(), this.m_month.toString()));
		global.G_COMMON_LOG.putError(G_SCRIPT_INFO, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + " " + "パラメータ情報", 6);
		return true;
	}

	getManual() //01
	//04
	//05
	//06
	//07
	//08
	//09
	{
// 2022cvt_015
		var rval = "";
		if (this.m_debugflag) rval += "デバッグモード\n";
		rval += "ロック制御" + (this.m_lockflag ? "あり" : "なし") + "\n";
		rval += "動作許可時刻";

		if (this.m_checktime) {
// 2022cvt_015
			for (var pair of (this.m_opentime.m_A_time)) rval += "/" + pair[0] + "-" + pair[1];
		} else rval += "せず";

		rval += "\n";

		if (this.m_clearflag == "a") {
			rval += "インポート前にDBからレコードを削除しない(append)\n";
		} else {
			rval += "インポート前にDBからレコードを削除する(overwrite)\n";
		}

		if (this.m_backupflag == "y") {
			rval += "バックアップする\n";
		} else {
			rval += "バックアップしない\n";
		}

		rval += "対象顧客" + this.m_pactid + "\n";
		rval += "対象年月(請求年月)" + this.m_year + "年" + this.m_month + "月\n";
		rval += "ソースフォルダ" + this.m_srcpath + "\n";
		return rval;
	}

	async execute() //2004.12.02 by suehiro 失敗時は、ロックを残す
	{
		var yyyymm = this.m_year + this.m_month;
		if (!this.askManual()) return true;

		if (!this.isOpen()) {
// 			echo("\u52D5\u4F5C\u53EF\u80FD\u6642\u9593\u5916\n");// 2022cvt_010
			global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + " 動作可能時間外 ", 4);
			throw process.exit(1);// 2022cvt_009
		}

		if (!this.init()) return false;
// 2022cvt_015
		var startime = this.getLapsedTime();
		var manual: any
// 2022cvt_015
		manual = this.getManual();
		manual = manual.split("\n");

// 2022cvt_015
		for (var line of (manual)) {
			if (line.length) {}
		}

		if (!this.lock(true)) {
// 			echo("\u30ED\u30C3\u30AF\u5931\u6557\n");// 2022cvt_010
			global.G_COMMON_LOG.putError(G_SCRIPT_ERROE, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + " ロック失敗 ", 3);
			return false;
		}

		if (!this.begin()) {
			if (!this.lock(false)) return false;
// 			echo("begin()\u5931\u6557\n");// 2022cvt_010
			global.G_COMMON_LOG.putError(G_SCRIPT_ERROE, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + " begin()失敗 ", 3);
			return false;
		}

// 2022cvt_015
    var status: boolean;
		status = await this.do_execute();
		status &&= this.end(status);

		if (status) //成功時（ロックを外す)
			{
				status &&= await this.lock(false);
			}

// 2022cvt_015
		var endtime = this.getLapsedTime();
		return status;
	}

	async do_execute() //コピー分作成
	//インポートインスタンスを初期化
	//インポートインスタンスにデータを構築
	//ファイル一覧取得 : オプション -p
	{
		var yyyymm = this.m_year + this.m_month;
		this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + " 処理開始 ");
// 2022cvt_015
		var no = this.getTableNo();

		if (no > 12) //対象外 範囲：01-12
			{
// 				echo(" \u30A8\u30E9\u30FC\uFF1A\u30A4\u30F3\u30B5\u30FC\u30C8\u7528\u30C6\u30FC\u30D6\u30EB\u306E\u5BFE\u8C61\u304C\u7BC4\u56F2\u5916\u3067\u3059 : commhistory_" + no + "_tb \n");// 2022cvt_010
				global.G_COMMON_LOG.putError(G_SCRIPT_INFO, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + " エラー：インサート用テーブルの対象が範囲外です : commhistory_" + no + "_tb ", 3);
				return false;
			}

// 2022cvt_015
		var ins_filepath = this.m_exppath + "/commhistory_" + no + "_tb_" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".ins";
		// var ins_filepath = this.m_exppath + "/commhistory_" + no + "_tb_" + date(YmdHis) + ".ins";
// 2022cvt_015
		var ins_comm = new TableInserter_tuwa(this.m_listener, this.m_db, ins_filepath, false);
		ins_comm.begin("commhistory_" + no + "_tb");

		if (this.m_pactid == "all") //case : pactid=all : 複数ディレクトリ＆複数ファイル
			//対象データチェック
			{
// 2022cvt_015
				var a_res = this.getdirtree(this.m_srcpath, "dir");

				if (a_res) {
					if (!DEBUG) {
					// if (DEBUG == 1) {
// 						echo("HIT! " + this.m_srcpath + "\n");// 2022cvt_010
					}

// 2022cvt_015
					var keys = Object.keys(a_res);
					keys.sort();
					for (var key of keys) //2004.12.02 by suehiro バグ対応 : $this->m_target_pactid 取得方法修正
					//pactidの正当性チェック
					{
// 2022cvt_015
                        // var a_temp = split("/", data);
						var a_temp = a_res[key].split("/");
						this.m_target_pactid = a_temp[a_temp.length - 1];
// 2022cvt_015
						var sql = "select count(pactid) from pact_tb where pactid='" + this.m_target_pactid + "'";
						this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + " SQL:" + sql + " ");

						if (await this.m_db.getOne(sql) == 0) {
// 							echo("\u8B66\u544A\uFF1A\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u793A\u3059\u5BFE\u8C61\u9867\u5BA2(" + this.m_target_pactid + ")\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002\n");// 2022cvt_010
							global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + "警告：ディレクトリが示す対象顧客(" + this.m_target_pactid + ")は存在しません。", 4);
							this.m_warningCount++;
							continue;
						} else //会社名取得
							{
								sql = "select compname from pact_tb where pactid='" + this.m_target_pactid + "'";
								this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + " SQL:" + sql + " ");
								this.m_compname = this.m_db.getOne(sql);
							}

// 2022cvt_015
						var a_res2 = this.getdirtree(data, "file");

						if (a_res2) {
// 2022cvt_015
							var keys = Object.keys(a_res2);
							keys.sort();
							for (var key of keys) //インサート用ファイル（コピー分）作成
							{
								if (!DEBUG) {
								// if (DEBUG == 1) {
// 									echo(`    ${data2}\n`);// 2022cvt_010
								}

								this.doDivisionFile(a_res2[key], ins_comm);
							}
						}
					}
				} else //指定ディレクトリ以下が空
					{
// 						if (!DEBUG) {
// 						// if (DEBUG == 1) {
// // 							echo("NO HIT! " + this.m_srcpath + "\n");// 2022cvt_010
// 						}

// 						echo("\u6307\u5B9A\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + this.m_srcpath + ")\u4EE5\u4E0B\u304C\u7A7A\n");// 2022cvt_010
						this.o_log.putError(G_SCRIPT_WARNING, this.m_procname_j + " 指定ディレクトリ(" + this.m_srcpath + ")以下が空 ");
						return false;
					}
			} else //case : pactid=指定ID : 複数ファイル
			//対象データチェック
			{
				a_res = this.getdirtree(this.m_srcpath, "file");

				if (a_res) {
// 					if (!DEBUG) {
// 					// if (DEBUG == 1) {
// // 						echo("HIT! " + this.m_srcpath + "\n");// 2022cvt_010
// 					}

// 2022cvt_015
					for (var data of (a_res)) //インサート用ファイル（コピー分）作成
					{
// 						if (!DEBUG) {
// 						// if (DEBUG == 1) {
// // 							echo(`${data}\n`);// 2022cvt_010
// 						}

						this.doDivisionFile(data, ins_comm);
					}
				} else //指定ディレクトリ以下が空
					{
// 						if (!DEBUG) {
// 						// if (DEBUG == 1) {
// // 							echo("NO HIT! " + this.m_srcpath + "\n");// 2022cvt_010
// 						}

// 						echo("\u6307\u5B9A\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + this.m_srcpath + ")\u4EE5\u4E0B\u304C\u7A7A\n");// 2022cvt_010
						this.o_log.putError(G_SCRIPT_WARNING, this.m_procname_j + " 指定ディレクトリ(" + this.m_srcpath + ")以下が空 ");
						return false;
					}
			}

		if (this.m_insertCountGross > 0) //対象テーブルのバックアップ(backupフラグ有効時) : オプション -b
			{
				if (this.m_backupflag == "y") //バックアップ
					//仕様を元に戻す場合に備えて残してある by suehiro
					//$sqlfrom = " from commhistory_" . $no . "_tb";
					//				$sqlfrom .= " where ";
					//				if( $this->m_pactid != "all" ) {
					//					$sqlfrom .= " pactid=" . $this->m_pactid;
					//				} else {
					//					foreach ($this->m_a_pactids as $pactid) {
					//						$pactids[] = " pactid=" . $pactid;
					//					}
					//					$sqlfrom .= join(" and ",$pactids);
					//				}
					//				$sqlfrom .= " and carid=" . G_CARRIER_ID;
					//				$this->o_log->putError(G_SCRIPT_INFO,  $this->m_procname_j." SQL：バックアップ : select *" . $sqlfrom." ", 6 );
					//				$exp_file_path = KCS_DIR."/data/exp/commhistory_".$no."_tb_".date(YmdHis).".exp";
					//				if ( ! $this->m_db->backup($exp_file_path, "select *" . $sqlfrom . ";")) {
					{
// 2022cvt_015
						var startime = this.getLapsedTime();
// 						echo(`処理：バックアップ 開始 (${startime})\n`);// 2022cvt_010
						this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：バックアップ 開始 (${startime}) `);
// 2022cvt_015
						var exp_file_path = KCS_DIR + "/data/exp/commhistory_" + no + "_tb_" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";

						if (!this.m_db.backupAll(exp_file_path, "commhistory_" + no + "_tb")) {
// 2022cvt_015
							var endtime = this.getLapsedTime();
// 							echo(`バックアップ失敗 (${endtime})\n`);// 2022cvt_010
							this.o_log.putError(G_SCRIPT_ERROR, this.m_procname_j + ` エラー：バックアップ失敗 (${endtime}) `);
							global.G_COMMON_LOG.putError(G_SCRIPT_ERROR, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + ` エラー：バックアップ失敗 (${endtime}) `, 3);
						}

						endtime = this.getLapsedTime();
// 						echo(`処理：バックアップ 終了 (${endtime})\n`);// 2022cvt_010
						this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：バックアップ 終了 : ${exp_file_path} : (${endtime}) `);
						global.G_COMMON_LOG.putError(G_SCRIPT_INFO, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + ` 出力：バックアップファイル : ${exp_file_path} (${endtime}) `, 6);
					}

				if (this.m_clearflag == "o") //テーブルクリア
					//既存のレコードを削除
					{
						startime = this.getLapsedTime();
// 						echo(`処理：テーブルクリア 開始 (${startime})\n`);// 2022cvt_010
						this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：テーブルクリア 開始 (${startime}) `);
// 2022cvt_015
						var sqlfrom = " from commhistory_" + no + "_tb";
						sqlfrom += " where ";
						var pactids;

						if (this.m_pactid != "all") {
							sqlfrom += " pactid=" + this.m_pactid;
						} else {
							// delete pactids;
							pactids = undefined;

// 2022cvt_015
							for (var pactid of (this.m_a_pactids)) {
								pactids.push(" pactid=" + pactid);
							}

							// sqlfrom += join(" and ", pactids);
							sqlfrom += pactids.join(" and ");
						}

						sqlfrom += " and carid=" + G_CARRIER_ID;
						sql = "delete" + sqlfrom;

// 						if (!DEBUG) {
// 						// if (DEBUG == 1) {
// // 							echo("SQL:" + sql + "\n");// 2022cvt_010
// 						}

						this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` SQL:テーブルクリア : ${sql} `);
						this.m_db.query(sql);
						endtime = this.getLapsedTime();
// 						echo(`処理：テーブルクリア 終了 (${endtime})\n`);// 2022cvt_010
						this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：テーブルクリア 終了 (${endtime}) `);
					}

				startime = this.getLapsedTime();
// 				echo(`処理：インサート実行 開始 (${startime})\n`);// 2022cvt_010
				this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：インサート実行 開始 (${startime}) `);
				ins_comm.end();
				endtime = this.getLapsedTime();
// 				echo(`処理：インサート実行 終了 (${endtime})\n`);// 2022cvt_010
				this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：インサート実行 終了 (${endtime}) `);
				this.o_log.putError(G_SCRIPT_WARNING, this.m_procname_j + ` 処理終了 (${endtime})`);
				global.G_COMMON_LOG.putError(G_SCRIPT_INFO, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + ` 出力：インサート用コピー文ファイル : ${ins_filepath} (${endtime}) `, 6);
				return true;
			}
			return true;
	}

	cleanup() //不要ディレクトリ削除
	{
// 2022cvt_015
		var a_logdirs = this.getdirtree(KCS_DIR + "/data", "dir");
		var a_logfiles: any;

		if (a_logdirs) {
// 2022cvt_015
			for (var dir_path of (a_logdirs)) {
				// if (strpos(dir_path, this.m_procname)) {
				if (dir_path.indexOf(this.m_procname)) {
// 2022cvt_015
					a_logfiles = this.getdirtree(dir_path);

// 2022cvt_015
					for (var file_path of (a_logfiles)) {
						fs.unlinkSync(file_path);
					// 	fs.unlinkSync(file_path);// 2022cvt_007
					}
					fs.rmdirSync(dir_path);
					// fs.rmdirSync(dir_path);
				}
			}
		}
	}

	async doDivisionLine(line: string, ins_comm: any, a_bill_prtel: any) {
		return false;
	}

	finMove(targetName) //ファイルの移動
	{
		var yyyymm = this.m_year + this.m_month;
// 2022cvt_015
		//var finDir = dirname(targetName) + "/fin";
		var path = PATH.parse(targetName);
		var finDir = path.dir + "/fin";

		if (fs.existsSync(finDir) == false) //完了ディレクトリの作成// 2022cvt_003
			{
			try {
				fs.mkdirSync(finDir, 700);
			} catch (e) {
				global.G_COMMON_LOG.putError(G_SCRIPT_INFO, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + ` 出力：インサート用コピー文ファイル : ${ins_filepath} (${endtime}) `, 6);
				global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " 完了ディレクトリの作成に失敗しました:" + finDir + "\n", 4);
				return false;
			}
				//if (mkdirSync(finDir, 700) == false) {
				// if (fs.mkdirSync(finDir, 700) == null) {
				// 	global.G_COMMON_LOG.putError(G_SCRIPT_INFO, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + ` 出力：インサート用コピー文ファイル : ${ins_filepath} (${endtime}) `, 6);
				// 	global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " 完了ディレクトリの作成に失敗しました:" + finDir + "\n", 4);
				// 	return false;
				// }
			}

// 		clearstatcache();// 2022cvt_012
// 		echo(`処理：ファイル移動:${targetName}\n`);// 2022cvt_010
        try {
					fs.renameSync(targetName, finDir + "/" + path.base);
	    	} catch (e) {
					global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " ファイルの移動に失敗しました:" + targetName + "\n", 4);
					return false;
				}
        // if (rename(targetName, finDir + "/" + basename(targetName)) == false) {
		// if (fs.renameSync(targetName, finDir + "/" + path.base) == null) {
		// 	global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " ファイルの移動に失敗しました:" + targetName + "\n", 4);
		// 	return false;
		// }

		return true;
	}

	doDivisionFile(path: string, ins_comm: any) //対象 pactid の 親電話番号・請求番号を取得
	//UPDATE 2004/12/07 上杉顕一郎
	//UPDATE 2004/12/07 上杉顕一郎
	//処理成功の場合、完了ディレクトリに移動
	{
// 2022cvt_015
        // var A_path = split("/", path);
		var A_path = path.split("/");
		this.m_file_name = A_path[count(A_path) - 1];
		this.m_targetFile = path;
		this.m_targetLine = 0;
		this.m_insertCount = 0;
		this.m_warningCount = 0;
		this.m_fileCount++;
		this.m_first_flag = true;
// 2022cvt_015
		var sql = "select prtelno from bill_prtel_tb where pactid=" + this.m_target_pactid + " and carid=" + G_CARRIER_ID;

// 		if (!DEBUG) {
// 		// if (DEBUG == 1) {
// // 			echo(sql + "\n");// 2022cvt_010
// 		}

		this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + " SQL/:対象 pactid の 親電話番号・請求番号を取得 : " + sql + " ");
// 2022cvt_015
		var O_result = this.m_db.query(sql);
		var a_bill_prtel:any;

		if (count(O_result) != 0) {
// 2022cvt_015
			var row;
// 2022cvt_015
			var count;

			while (row = O_result.fetchRow()) {
				a_bill_prtel.push(this.cleaningTelno(row[0]));
			}
		} else //親番号が設定されていない pactid
			{}

		O_result.free();
// 		echo(`処理：ファイルオープン:${path}\n`);// 2022cvt_010
// 2022cvt_015
		var starttime = this.getLapsedTime();
		this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：ファイルオープン:${path} (${starttime}) `);
// 2022cvt_015
        // var fp = fopen(path, "r");
		var buffer = fs.readFileSync(path, "utf8");
		var text = Encoding.convert(buffer, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		});
		var lines = text.toString().split("\r\n");

// 2022cvt_015
		var errFlg = false;

		// while (!feof(fp)) {
		for (var line of lines) {
			this.m_targetLine++;
// 2022cvt_015
            // var buf = fgets(fp, 1024);
			var buf = line;
			//buf = fs.chopSync(buf);

			if (!this.doDivisionLine(buf, ins_comm, a_bill_prtel)) //ファイル処理中にエラー
				//UPDATE 2004/12/07 上杉顕一郎
				{
					errFlg = true;
					break;
				}
		}

		// fclose(fp);

// 2022cvt_015
		var endtime = this.getLapsedTime();
// 		echo(`処理：ファイルクローズ:${path}\n`);// 2022cvt_010
		this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：ファイルクローズ:${path} ` + this.m_insertCount + "/" + this.m_targetLine + `行 (${endtime}) `);
		this.m_insertCountGross += this.m_insertCount;
		this.m_warningCountGross += this.m_warningCount;

		if (errFlg == false) {
			this.finMove(path);
		}
	}

	cleaningTelno(srctelno: any) {
// 2022cvt_015
		var desttelno = srctelno;
// 2022cvt_020
		// desttelno = str_replace("(", "", desttelno);
		desttelno = desttelno.replace("(", "");
// 2022cvt_020
		desttelno = desttelno.replace(")", "");
// 2022cvt_020
		desttelno = desttelno.replace("-", "",);
// 2022cvt_020
		desttelno = desttelno.replace(" ", "");
		return desttelno;
	}

// 2022cvt_016
	getdirtree(dir: string, type = "file") //ディレクトリでなければ false を返す
	//戻り値用の配列
	{
		var handle: { [key: string]: any } = {};
		if (!fs.existsSync(dir)) {// 2022cvt_003
			return false;
		}

// 2022cvt_015
		var tree = Array();

		// if (handle = openDir(dir)) //uasort() でないと添え字が失われます// 2022cvt_004
		if (handle = fs.readdirSync(dir)) //uasort() でないと添え字が失われます// 2022cvt_004
			{
// 2022cvt_015
				var file: any;

				// while (false !== (file = fs.readdir(handle))) //自分自身と上位階層のディレクトリを除外// 2022cvt_005
				for (__filename in handle) //自分自身と上位階層のディレクトリを除外// 2022cvt_005
				{
					if (file != "." && file != "..") {
// 2022cvt_016
						if (type == "file") {
							if (!fs.existsSync(dir + "/" + file)) {// 2022cvt_003
								tree[file] = dir + "/" + file;
							}
// 2022cvt_016
						} else if (type == "dir") {
							if (fs.existsSync(dir + "/" + file)) {// 2022cvt_003
								tree[file] = dir + "/" + file;
								this.m_a_pactids.push(file);
							}
						} else {
							tree[file] = dir + "/" + file;
						}
					}
				}

				// closedir(handle);
				// uasort(tree, "strcmp");
			}

		return tree;
	}

	getLapsedTime() {
		var  diff =  Date.now() / 1000 - this.m_beginTime
        var h = Math.floor(diff / 3600);
        var m = Math.floor(diff / 60) % 60;
        var s = diff %60
        return h + ":" + m + "s"
		// return gmstrftime("%T", Date.now() / 1000 - this.m_beginTime);
	}

};

//機能：ログ出力を行う
//引数：メッセージ種別
//メッセージ
export class TableInserter_tuwa extends TableInserter {
	begin: any;
	end: any;
// 2022cvt_016

	log(type:any, message:any) //機能を止めるための空実装
	{}

};
