//===========================================================================
//機能：ETC利用明細ファイルインポートプロセス
//NICOSカード取り込み時に作成した
//
//作成：中西　達夫
//作成日：2008/05/07
//===========================================================================
//---------------------------------------------------------------------------
//END class ImportEtcCardBase
// error_reporting(E_ALL);// 2022cvt_011

// 2022cvt_026
// require("lib/script_db.php");
import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../../db_define/define";
import TableNo, { ScriptDB, TableInserter } from "../lib/script_db";

// 2022cvt_026
// require("lib/script_log.php");
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../lib/script_log";

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as flock from "proper-lockfile";
import { G_AUTH_ASP } from "./script_common";

export default abstract class ImportEtcCardBase {
	log_listener!: ScriptLogBase;
	dbh!: ScriptDB;
	logh!: ScriptLogAdaptor;
	target: string = "";
	SUOspec: string = "";
	CoDir: string = "";
	SCRIPT_NAME: string = "";
	DataTitle: string = "";
	LocalLogFile: string = "";
	LocalLogName: string = "";
	DEBUG: any;
	nowtime: any;
	detail_write_buf: string = "";
	history_write_buf: string = "";
	card_write_buf: string = "";
	card_xx_write_buf: string = "";
	card_meigi_write_buf: any[] = Array();
	card_xx_meigi_write_buf: any[] = Array();
	COID: string = "";
	aspFlg: boolean = false;
	asp_charge: any;

	async Execute() //共通ログファイル名
	{
		this.iniSetting();
// 2022cvt_015
		var dbLogFile = DATA_LOG_DIR + "/card_billbat.log";
// 2022cvt_015
		this.log_listener = new ScriptLogBase(0);
// 2022cvt_016
// 2022cvt_015
		var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
// 2022cvt_016
// 2022cvt_015
		var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
// 2022cvt_016
		this.log_listener.putListener(log_listener_typeView);
// 2022cvt_016
		this.log_listener.putListener(log_listener_type);
		this.dbh = new ScriptDB(this.log_listener);
		this.logh = new ScriptLogAdaptor(this.log_listener, true);
// 2022cvt_015
		var A_para = 5;
		var mode = "";
		var year = 0;
		var month = 0;
		var month_view = "";
		var pactid = "";
		var backup = "";
		var fin_pact = Array();

		if (process.argv.length != 7 + 1) //数が正しくない
			{
				this.usage("");
			} else //数が正しい
			//$cnt 0 はスクリプト名のため無視
			//パラメータの指定が無かったものがあった時
			{
// 2022cvt_015
				var argvCnt = process.argv.length;
// 2022cvt_015
				for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
				{
					if (process.argv[cnt].match("^-e="))
					// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード指定変数
						//モード文字列チェック
						{
// 2022cvt_015
							mode = process.argv[cnt].replace("^-e=", "").toLowerCase();
							// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();

							if (!mode.match("^[ao]$")) {
							// if (ereg("^[ao]$", mode) == false) {
								this.usage("モードの指定が不正です。" + process.argv[cnt]);
							}

							A_para -= 1;
							continue;
						}

					if (process.argv[cnt].match("^-y="))
					// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //年月指定変数
						//請求年月文字列チェック
						//指定済のパラメータを配列から削除
						{
// 2022cvt_015
							var billdate = process.argv[cnt].replace("^-y=", "");
							// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

							if (!billdate.match("^[0-9]{6}$")) {
							// if (ereg("^[0-9]{6}$", billdate) == false) {
								this.usage("請求年月の指定が不正です。" + process.argv[cnt]);
							} else //表示用の月
								{
// 2022cvt_015
									year = parseInt(billdate.substring(0, 4));
// 2022cvt_015
									month = parseInt(billdate.substring(4, 2));
// 2022cvt_015
									month_view = billdate.substring(4, 2);

									if (month < 10) {
										month_view = month_view.replace("0", "");
										// month_view = trim(month, "0");
									}

									if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
										this.usage("請求年月の指定が不正です。" + process.argv[cnt]);
									}

// 2022cvt_015
									var A_riyou = this.getRiyouYM(year, month);
								}

							A_para -= 1;
							continue;
						}

					if (process.argv[cnt].match("^-p="))
					// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //会社ID指定変数
						//契約ＩＤチェック
						{
// 2022cvt_015
							pactid = process.argv[cnt].replace("^-p=", "").toLowerCase();
							// var pactid = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

							if (!pactid.match("^all$") && !pactid.match("^[0-9]+$")) {
							// if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
								this.usage("会社コードの指定が不正です。" + process.argv[cnt]);
							}

							A_para -= 1;
							continue;
						}

					if (process.argv[cnt].match("^-b="))
					// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップ指定変数
						//バックアップの有無のチェック
						{
// 2022cvt_015
							backup = process.argv[cnt].replace("^-b=", "").toLowerCase();
							// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

							if (!backup.match("^[ny]$")) {
							// if (ereg("^[ny]$", backup) == false) {
								this.usage("バックアップの指定が不正です。" + process.argv[cnt]);
							}

							A_para -= 1;
							continue;
						}

					if (process.argv[cnt].match("^-t=")) {
					// if (ereg("^-t=", _SERVER.argv[cnt]) == true) {

						this.target = process.argv[cnt].replace("^-t=", "").toLowerCase();
						// this.target = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

						if (!this.target.match("^[no]$")) {
						// if (ereg("^[no]$", this.target) == false) {
							this.usage("対象月の（最新/過去）の指定が不正です。" + process.argv[cnt]);
						}

						A_para -= 1;
						// delete A_para[4];
						continue;
					}

					if (process.argv[cnt].match("^-s")) {
					// if (ereg("^-s", _SERVER.argv[cnt]) == true) {
						this.SUOspec = process.argv[cnt].replace("^-s=", "").toLowerCase();
						// this.SUOspec = ereg_replace("^-s=", "", _SERVER.argv[cnt]).toLowerCase();

						if (!this.SUOspec.match("^[ny]$")) {
						// if (ereg("^[ny]$", this.SUOspec) == false) {
							this.usage("使用者によるカード名義の上書き（あり/なし）指定が不正です。" + process.argv[cnt]);
						}

						A_para -= 1;
						continue;
					}

					this.usage("パラメータの指定が不正です。" + process.argv[0]);
				}

				if (A_para != 0) {
					this.usage("パラメータの指定が不正です。" + process.argv[0]);
				}
			}

// 2022cvt_015
		var ETC_DIR = DATA_DIR + "/" + year + month + this.CoDir;

		if (fs.existsSync(ETC_DIR) == false) {// 2022cvt_003
			this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + this.DataTitle + "ディレクトリ（" + ETC_DIR + "）がみつかりません");
			throw process.exit(1);// 2022cvt_009
		}

		try {
			var dirh = fs.readdirSync(ETC_DIR);
		} catch (e) {
			this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + this.DataTitle + "ディレクトリ（" + ETC_DIR + "）を開けません");
			throw process.exit(1);// 2022cvt_009
		}

		this.logh.putError(G_SCRIPT_BEGIN, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 処理を開始します");
		this.LocalLogFile = DATA_DIR + "/" + year + month + "/ETC/" + this.LocalLogName;

		try {
			var ifp = fs.openSync(this.LocalLogFile, "a");
			fs.closeSync(ifp);
		} catch (e) {
			this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 ログファイル（" + this.LocalLogFile + "）を開けません");
			throw process.exit(1);// 2022cvt_009
		}

		if (this.DEBUG) {
			this.logging("START: " + this.DataTitle + "取込処理(" + this.SCRIPT_NAME + ")を開始します");
		}

		if (String(pactid === "all")) {
			if (fs.existsSync(ETC_DIR) == false) {// 2022cvt_003
				if (this.DEBUG) {
					this.logging(this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + this.DataTitle + "ディレクトリ（" + ETC_DIR + "）はみつかりません");
				}
				this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + this.DataTitle + "ディレクトリ（" + ETC_DIR + "）がみつかりません");
				throw process.exit(1);// 2022cvt_009
			} else {
				if (this.DEBUG)  {
					this.logging(this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + this.DataTitle + "ディレクトリ（" + ETC_DIR + "）はみつかりました");
				}
			}
		} else {
			if (fs.existsSync(ETC_DIR + "/" + pactid) == false) {// 2022cvt_003
				if (this.DEBUG) {
					this.logging(this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + this.DataTitle + "ディレクトリ（" + ETC_DIR + "/" + pactid + "）はみつかりません");
				}
				this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + this.DataTitle + "ディレクトリ（" + ETC_DIR + "/以下）がみつかりません");
				throw process.exit(1);// 2022cvt_009
			} else {
				if (this.DEBUG) {
					this.logging(this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + this.DataTitle + "ディレクトリ（" + ETC_DIR + "/" + pactid + "）はみつかりました");
				}
			}
		}

// 		clearstatcache();// 2022cvt_012
// 2022cvt_015
		var A_pactid = Array();

		if (String(pactid === "all")) ///kcs/data/yyyymm/ETC以下のディレクトリを開く
			//処理する契約ＩＤを取得する
			{
// 2022cvt_015
				var dirh = fs.readdirSync(ETC_DIR);
				// var dirh = openDir(ETC_DIR);// 2022cvt_004

				for (var pactName of dirh)
				// while (pactName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
				{
// 2022cvt_019
					if (fs.existsSync(ETC_DIR + "/" + pactName) && !pactName.match("/\\./")) {// 2022cvt_003
						if (-1 !== A_pactid.indexOf(pactName) == false) {
							A_pactid.push(pactName);
						}

						if (this.DEBUG) {
							this.logging("INFO: 対象ディレクトリ " + ETC_DIR + "/" + pactName);
						}
					}

// 					clearstatcache();// 2022cvt_012
				}

				// closedir(dirh);
			} else ///kcs/data/yyyymm/ETC以下のディレクトリを開く
			//処理する契約ＩＤを取得する
			{
				A_pactid.push(pactid);
				var dirh = fs.readdirSync(ETC_DIR + "/" + pactid);
				// dirh = openDir(ETC_DIR + "/" + pactid);// 2022cvt_004

				for (var pactName of dirh)
				// while (pactName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
				{
					if (fs.existsSync(ETC_DIR + "/" + pactid + "/" + pactName) && pactName != "." && pactName != "..") {// 2022cvt_003
						if (this.DEBUG) {
							this.logging("INFO: 対象ディレクトリ " + ETC_DIR);
						}
					}

// 					clearstatcache();// 2022cvt_012
				}

				// closedir(dirh);
			}

		A_pactid.sort();

		if (A_pactid.length == 0 || undefined !== A_pactid == false) //エラー終了
			{
				if (this.DEBUG) {
					this.logging("ERROR: Pact用データディレクトリが１つもありません");
				}
				this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 Pact用データディレクトリが１つもありません");
				throw process.exit(1);// 2022cvt_009
			}

		if (await this.lock(true, this.dbh) == false) {
			if (this.DEBUG) {
				this.logging("ERROR: 既に起動しています");
			}
			this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理  既に起動しています");
			throw process.exit(1);// 2022cvt_009
		}

// 2022cvt_015
		var O_tableNo = new TableNo();
// 2022cvt_015
		var tableNo = O_tableNo.get(year, month);
// 2022cvt_015
		var cardX_tb = "card_" + tableNo + "_tb";
// 2022cvt_015
		var carddetailX_tb = "card_details_" + tableNo + "_tb";
// 2022cvt_015
		var cardusehistoryX_tb = "card_usehistory_" + tableNo + "_tb";

		var card_filename = "";

		if (this.DEBUG) {
			this.logging("INFO: 対象テーブル " + cardX_tb + " & " + cardusehistoryX_tb);
		}
// 2022cvt_015
		var card_xx_filename = ETC_DIR + "/" + cardX_tb + year + month + pactid + ".ins";
// 2022cvt_015
		var card_xx_fp;
		try {
			card_xx_fp = fs.openSync(card_xx_filename, "w");
		} catch (e) {
			if (this.DEBUG) this.logging("ERROR: " + card_xx_filename + "のオープン失敗");
			this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + card_xx_filename + "のオープン失敗");
			throw process.exit(1);// 2022cvt_009
		}
		// var card_xx_fp = fopen(card_xx_filename, "w");

		if (this.DEBUG) {
			this.logging("INFO: card_XX_tbへのcopy文ファイルOPEN " + card_xx_filename);
		}

		if (String(this.target === "n")) {
// 2022cvt_015
			card_filename = ETC_DIR + "/card_tb" + year + month + pactid + ".ins";
// 2022cvt_015
			var card_fp;
			try {
				card_fp = fs.openSync(card_filename, "w");
			} catch (e) {
				if (this.DEBUG) this.logging("ERROR: " + card_fp + "のオープン失敗");
				this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + card_fp + "のオープン失敗");
				throw process.exit(1);// 2022cvt_009
			}
			// var card_fp = fopen(card_filename, "w");

			if (this.DEBUG) {
				this.logging("INFO: card_tbへのcopy文ファイルOPEN " + card_filename);
			}
		}

// 2022cvt_015
		var carddetail_filename = ETC_DIR + "/" + carddetailX_tb + year + month + pactid + ".ins";
// 2022cvt_015
		var carddetail_fp;
		try {
			carddetail_fp = fs.openSync(carddetail_filename, "w");
		} catch (e) {
			if (this.DEBUG) {
				this.logging("ERROR: " + carddetail_filename + "のオープン失敗");
			}
			this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + carddetail_filename + "のオープン失敗");
			throw process.exit(1);// 2022cvt_009
		}
		// var carddetail_fp = fopen(carddetail_filename, "w");

		if (this.DEBUG) {
			this.logging("INFO: card_details_XX_tbへのcopy文ファイルOPEN " + carddetail_filename);
		}
// 2022cvt_015
		var cardusehistory_filename = ETC_DIR + "/" + cardusehistoryX_tb + year + month + pactid + ".ins";
// 2022cvt_015
		var cardusehistory_fp;
		try {
			cardusehistory_fp = fs.openSync(cardusehistory_fp, "w");
		} catch (e) {
			if (this.DEBUG) this.logging("ERROR: " + cardusehistory_filename + "のオープン失敗");
			this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + cardusehistory_filename + "のオープン失敗");
			throw process.exit(1);// 2022cvt_009
		}
		// var cardusehistory_fp = fopen(cardusehistory_filename, "w");

		if (this.DEBUG) {
			this.logging("INFO: card_usehistory_XX_tbへのcopy文ファイルOPEN " + cardusehistory_filename);
		}
// 2022cvt_015
		var fin_cnt = 0;
		this.nowtime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("");
// 2022cvt_015
		var A_del_sql = Array();

		for (cnt = 0; cnt < A_pactid.length; cnt++)
		{
// 2022cvt_015
			var out_rec_cnt = 0;
// 2022cvt_015
			var error_flg = false;
			this.detail_write_buf = "";
			this.history_write_buf = "";
			this.card_write_buf = "";
			this.card_xx_write_buf = "";
			this.card_meigi_write_buf = Array();
			this.card_xx_meigi_write_buf = Array();
// 2022cvt_015
			var PACT_result = await this.dbh.getOne("select compname from pact_tb where pactid = " + this.dbh.escape(A_pactid[cnt]) + ";", true);

			if (PACT_result == "") {
				if (this.DEBUG) {
					this.logging("WARNING:  対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
				}
				this.logh.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
				continue;
			}

			if (this.DEBUG) {
				this.logging("INFO: 対象会社の会社名を取得 " + PACT_result);
			}
			if (this.DEBUG) {
				this.logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "のデータの処理を開始します");
			}
			this.logh.putError(G_SCRIPT_INFO, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + PACT_result + " " + A_pactid[cnt] + " 処理を開始します");
// 2022cvt_015
			var A_billFile = Array();
// 2022cvt_015
			var dataDirPact = ETC_DIR + "/" + A_pactid[cnt];

			if (fs.existsSync(dataDirPact) == true) {// 2022cvt_003
				var dirh = fs.readdirSync(dataDirPact);
				// dirh = openDir(dataDirPact);// 2022cvt_004

				for (var fileName of dirh) {
				// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
// 2022cvt_019
					if (fs.statSync(dataDirPact + "/" + fileName).isFile() && fileName.match("/\\.txt/") || fileName.match("/\\.TXT/")) {
					// if (is_file(dataDirPact + "/" + fileName) == true && (preg_match("/\\.txt/", fileName) == true || preg_match("/\\.TXT/", fileName) == true)) {
						A_billFile.push(dataDirPact + "/" + fileName);
						if (this.DEBUG) {
							this.logging("INFO: 対象請求データファイル名 " + dataDirPact + "/" + fileName);
						}
					}

// 					clearstatcache();// 2022cvt_012
				}

				// closedir(dirh);
			}

			if (A_billFile.length == 0) {
				if (this.DEBUG) {
					this.logging("WARNING: 対象ファイルがみつかりません（" + dataDirPact + "/以下）");
				}
				this.logh.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + PACT_result + " " + dataDirPact + "/以下 対象ファイルがみつかりません（" + dataDirPact + "）");
				continue;
			}

			if (this.DEBUG) {
				this.logging("INFO: 対象請求データファイル数 " + A_billFile.length);
			}
// 2022cvt_015
			var CARD_result = await this.dbh.getCol("select cardno from " + cardX_tb + " where pactid = " + this.dbh.escape(A_pactid[cnt]) + ";", true);

			if (Array.isArray(CARD_result) == false) {
				CARD_result = Array();
			}

			if (this.DEBUG) {
				this.logging("INFO: 対象会社の登録ETCカードのリストを取得 " + CARD_result.length + "件 select cardno from " + cardX_tb + " where pactid = " + this.dbh.escape(A_pactid[cnt]) + " ;");
			}

			if (String(this.target === "n")) {
// 2022cvt_015
				var CARD_now_result = await this.dbh.getCol("select cardno from card_tb where delete_flg = false and pactid = " + this.dbh.escape(A_pactid[cnt]) + " ;", true);

				if (Array.isArray(CARD_now_result) == false) {
					CARD_now_result = Array();
				}

				if (this.DEBUG) {
					this.logging("INFO: 最新の登録ETCカードのリストを取得 " + CARD_now_result.length + "件 select cardno from card_tb where delete_flg = false and pactid = " + this.dbh.escape(A_pactid[cnt]) + " ;");
				}
// 2022cvt_015
				var CARD_now_delete_result = await this.dbh.getCol("select cardno from card_tb where delete_flg = true and pactid = " + this.dbh.escape(A_pactid[cnt]) + " ;", true);

				if (Array.isArray(CARD_now_delete_result) == false) {
					CARD_now_delete_result = Array();
				}

				if (this.DEBUG) {
					this.logging("INFO: 最新の登録ETCカードのリストを取得（削除済み） " + CARD_now_delete_result.length + "件 select cardno from card_tb where delete_flg=true and pactid = " + this.dbh.escape(A_pactid[cnt]) + " ;");
				}
			} else {
				CARD_now_result = Array();
				CARD_now_delete_result = Array();
			}

// 2022cvt_015
			var A_prcardno = await this.dbh.getCol("select card_master_no from card_bill_master_tb where pactid = " + this.dbh.escape(A_pactid[cnt]) + " and cardcoid in (" + this.COID + ");", true);

			if (A_prcardno.length == 0) {
				if (this.DEBUG) {
					this.logging("WARNING: 請求先コード（法人番号）が１つも登録されていません" + "select card_master_no from card_bill_master_tb where pactid = " + this.dbh.escape(A_pactid[cnt]) + " and cardcoid = " + this.COID + ";");
				}
				this.logh.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + PACT_result + " " + A_pactid[cnt] + " 請求先コード（法人番号）が１つも登録されていません");
				continue;
			}

			this.aspFlg = false;

			if (await this.chkAsp(this.dbh.escape(A_pactid[cnt])) == true) //ASP使用料が数字以外で返って来た時
				{
					this.aspFlg = true;
					if (this.DEBUG) {
						this.logging("INFO: ASP利用料表示設定がＯＮ");
					}
					this.asp_charge = await this.dbh.getOne("select charge from card_asp_charge_tb where pactid = " + this.dbh.escape(A_pactid[cnt]) + " and cardcoid = " + this.COID + " ;", true);

					if (!isNaN(this.asp_charge) == false) {
					// if (is_numeric(this.asp_charge) == false) {
						if (this.DEBUG) {
							this.logging("WARNING: ASP使用料が設定されていません pactid：" + A_pactid[cnt]);
						}
						this.logh.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + PACT_result + " " + A_pactid[cnt] + " ASP使用料が設定されていません ");
						continue;
					}

					if (this.DEBUG) {
						this.logging("INFO: ASP使用料取得　" + this.asp_charge);
					}
				}

// 2022cvt_015
			for (var fcnt = 0; fcnt < A_billFile.length; fcnt++) //------------------------------------
			//レコード毎の処理（１行毎）
			//------------------------------------
			//対象ファイルオープン
			//ファイルが開けなかった時
			//ファイルハンドルが無い時
			{
// 2022cvt_015
				var buffer = "";
				try {
					buffer = fs.readFileSync(A_billFile[fcnt], "utf8");
				} catch (e) {
					if (this.DEBUG) {
						this.logging("WARNING: ファイルのOPENに失敗しました" + A_billFile[fcnt]);
					}
					this.logh.putError(G_SCRIPT_WARNING, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + PACT_result + " " + A_pactid[cnt] + " ファイルのOPENに失敗しました " + A_billFile[fcnt]);
					error_flg = true;
					break;
				}
				// var ifp = fopen(A_billFile[fcnt], "r");

				if (this.DEBUG) {
					this.logging("INFO: 対象ファイル=" + A_billFile[fcnt]);
				}
				error_flg = this.doEachFile(ifp, A_billFile[fcnt], A_pactid[cnt], A_prcardno, PACT_result, CARD_result, CARD_now_result, CARD_now_delete_result, A_del_sql);

				// if (ifp != undefined) {
				// 	fclose(ifp);
				// }
			}

			if (error_flg == true) {
				continue;
			}

			fs.writeFileSync(card_xx_fp, this.card_xx_write_buf);// 2022cvt_006
			// fflush(card_xx_fp);

			if (String(this.target === "n")) {
				fs.writeFileSync(card_fp, this.card_write_buf);// 2022cvt_006
				// fflush(card_fp);
			}

			fs.writeFileSync(carddetail_fp, this.detail_write_buf);// 2022cvt_006
			// fflush(carddetail_fp);
			fs.writeFileSync(cardusehistory_fp, this.history_write_buf);// 2022cvt_006
			// fflush(cardusehistory_fp);
			if (this.DEBUG) {
				this.logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "件のデータの処理を行いました");
			}
			this.logh.putError(G_SCRIPT_INFO, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + PACT_result + " " + A_pactid[cnt] + ` . ${out_rec_cnt}` + "件の処理を行いました");
			fin_pact[fin_cnt] = A_pactid[cnt];
			fin_cnt++;
		}

		fs.closeSync(card_xx_fp);
		// fclose(card_xx_fp);

		if (String(this.target === "n")) {
			fs.closeSync(card_fp);
			// fclose(card_fp);
		}

		fs.closeSync(cardusehistory_fp);
		// fclose(cardusehistory_fp);

		if (fin_cnt < 1) //２重起動ロック解除
			{
				this.lock(false, this.dbh);
				if (this.DEBUG) {
					this.logging("ERROR: １件も成功しませんでした");
				}
				this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 １件も成功しませんでした");
				throw process.exit(1);// 2022cvt_009
			}

		if (String(backup === "y")) //CARD_DETAILS_X_TBのバックアップ
			//エクスポート失敗した場合
			//CARD_usehistory_X_TBのバックアップ
			//エクスポート失敗した場合
			{
// 2022cvt_015
				var carddetailX_exp = DATA_EXP_DIR + "/" + carddetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
// 2022cvt_015
				var sql_str = "select * from " + carddetailX_tb;
// 2022cvt_015
				var rtn = await this.dbh.backup(carddetailX_exp, sql_str);

				if (rtn == false) {
					if (this.DEBUG) {
						this.logging("ERROR: " + carddetailX_tb + "のデータエクスポートに失敗しました ");
					}
					this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + carddetailX_tb + "のデータエクスポートに失敗しました" + carddetailX_exp);
				} else {
					if (this.DEBUG) {
						this.logging("INFO: " + carddetailX_exp + "のデータエクスポートを行いました " + carddetailX_tb);
					}
				}

// 2022cvt_015
				var cardusehistoryX_exp = DATA_EXP_DIR + "/" + cardusehistoryX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
				sql_str = "select * from " + cardusehistoryX_tb;
				var rtn = await this.dbh.backup(cardusehistoryX_exp, sql_str);

				if (rtn == false) {
					if (this.DEBUG) {
						this.logging("ERROR: " + cardusehistoryX_tb + "のデータエクスポートに失敗しました ");
					}
					this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + cardusehistoryX_tb + "のデータエクスポートに失敗しました" + cardusehistoryX_exp);
				} else {
					if (this.DEBUG) {
						this.logging("INFO: " + cardusehistoryX_tb + "のデータエクスポートを行いました " + cardusehistoryX_exp);
					}
				}
			}

		this.dbh.begin();

		if (String(mode === "o")) //対象pactidを１つの文字列に変換
			//CARD_DETAIL_XX_TBの削除
			//CARD_usehistory_XX_TBの削除
			{
// 2022cvt_015
				var pactin = "";

				for (cnt = 0; cnt < fin_cnt; cnt++) {
					pactin += fin_pact[cnt] + ",";
				}

				pactin = pactin.replace(",", "");
				// pactin = rtrim(pactin, ",");
				this.dbh.query("delete from " + carddetailX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + this.COID + ");", true);
				if (this.DEBUG) {
					this.logging("INFO: " + carddetailX_tb + "の既存データの削除を行いました " + "delete from " + carddetailX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + this.COID + ");");
				}
				this.logh.putError(G_SCRIPT_INFO, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + carddetailX_tb + "の既存データの削除を行いました" + carddetailX_tb);
				this.dbh.query("delete from " + cardusehistoryX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + this.COID + ");", true);
				if (this.DEBUG) {
					this.logging("INFO: " + cardusehistoryX_tb + "の既存データの削除を行いました " + "delete from " + cardusehistoryX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + this.COID + ");");
				}
				this.logh.putError(G_SCRIPT_INFO, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + cardusehistoryX_tb + "の既存データの削除を行いました" + cardusehistoryX_tb);
			}

		if (fs.statSync(card_xx_filename).size != 0)
		// if (filesize(card_xx_filename) != 0) //card_X_tb へインポート
			//インポート失敗した場合
			{
// 2022cvt_015
				var cardX_col = ["pactid", "postid", "cardno", "cardno_view", "bill_cardno", "bill_cardno_view", "card_corpno", "card_corpname", "card_meigi", "card_membername", "car_no", "cardcoid", "recdate", "fixdate", "delete_flg"];

				if (String(this.SUOspec === "y")) //SUO特別対応
					//使用者
					{
						cardX_col.push("username");
					}

				var rtn2 = await this.doCopyInsert(cardX_tb, card_xx_filename, cardX_col, this.dbh);

				if (rtn2 != 0) //ロールバック
					{
						if (this.DEBUG) {
							this.logging("ERROR: " + cardX_tb + "のデータインポートに失敗しました ");
						}
						this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + cardX_tb + "のデータインポートに失敗しました ");
						this.dbh.rollback();
						throw process.exit(1);// 2022cvt_009
					} else {
					if (this.DEBUG) {
						this.logging("INFO: " + cardX_tb + "のデータインポートを行いました " + card_xx_filename);
					}
					this.logh.putError(G_SCRIPT_INFO, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + cardX_tb + "のデータインポートを行いました " + card_xx_filename);
				}
			}

		if (String(this.target === "n")) {
			if (fs.statSync(card_filename).size != 0)
			// if (filesize(card_filename) != 0) //削除フラグが立っている電話でコピー文に含まれる電話はcard_tbから消す
				//card_tb へインポート
				//インポート失敗した場合
				{
// 2022cvt_015
					for (var sql of A_del_sql) {
						this.dbh.query(sql, true);
						this.logh.putError(G_SCRIPT_INFO, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 card_tbの削除済カードの削除を行いました(" + sql + ")");
						if (this.DEBUG) {
							this.logging("INFO: " + this.DataTitle + "取込処理 card_tbの削除済カードの削除を行いました(" + sql + ")");
						}
					}

// 2022cvt_015
					var card_col = ["pactid", "postid", "cardno", "cardno_view", "bill_cardno", "bill_cardno_view", "card_corpno", "card_corpname", "card_meigi", "card_membername", "car_no", "cardcoid", "recdate", "fixdate", "delete_flg"];

					if (String(this.SUOspec === "y")) //SUO特別対応
						//使用者
						{
							card_col.push("username");
						}

					var rtn2 = await this.doCopyInsert("card_tb", card_filename, card_col, this.dbh);

					if (rtn2 != 0) //ロールバック
						{
							if (this.DEBUG) {
								this.logging("ERROR: card_tbのデータインポートに失敗しました ");
							}
							this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 card_tbのデータインポートに失敗しました ");
							this.dbh.rollback();
							throw process.exit(1);// 2022cvt_009
						} else {
						if (this.DEBUG) {
							this.logging("INFO: card_tbのデータインポートを行いました " + card_filename);
						}
						this.logh.putError(G_SCRIPT_INFO, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 card_tbのデータインポートを行いました " + card_filename);
					}
				}
		}

		if (fs.statSync(carddetail_filename).size != 0)
		// if (filesize(carddetail_filename) != 0) //card_details_X_tb へインポート
			//インポート失敗した場合
			{
// 2022cvt_015
				var carddetailX_col = ["pactid", "cardno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "cardcoid", "card_corpno"];
				var rtn2 = await this.doCopyInsert(carddetailX_tb, carddetail_filename, carddetailX_col, this.dbh);

				if (rtn2 != 0) //ロールバック
					{
						if (this.DEBUG) {
							this.logging("ERROR: " + carddetailX_tb + "のデータインポートに失敗しました ");
						}
						this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + carddetailX_tb + "のデータインポートに失敗しました ");
						this.dbh.rollback();
						throw process.exit(1);// 2022cvt_009
					} else {
					if (this.DEBUG) {
						this.logging("INFO: " + carddetailX_tb + "のデータインポートを行いました " + carddetail_filename);
					}
					this.logh.putError(G_SCRIPT_INFO, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + carddetailX_tb + "のデータインポートを行いました " + carddetail_filename);
				}
			}

		if (fs.statSync(cardusehistory_filename).size != 0)
		// if (filesize(cardusehistory_filename) != 0) //card_usehistory_X_tb へインポート
			//インポート失敗した場合
			{
// 2022cvt_016
// 2022cvt_015
				var cardusehistoryX_col = ["pactid", "cardno", "card_corpno", "route_name", "in_id", "in_name", "out_id", "out_name", "date", "time", "charge", "discount1", "note", "car_type", "cardcoid"];
				var rtn2 = await this.doCopyInsert(cardusehistoryX_tb, cardusehistory_filename, cardusehistoryX_col, this.dbh);

				if (rtn2 != 0) //ロールバック
					{
						if (this.DEBUG) {
							this.logging("ERROR: " + cardusehistoryX_tb + "のデータインポートに失敗しました ");
						}
						this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + cardusehistoryX_tb + "のデータインポートに失敗しました ");
						this.dbh.rollback();
						throw process.exit(1);// 2022cvt_009
					} else {
					if (this.DEBUG) {
						this.logging("INFO: " + cardusehistoryX_tb + "のデータインポートを行いました " + cardusehistory_filename);
					}
					this.logh.putError(G_SCRIPT_INFO, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 " + cardusehistoryX_tb + "のデータインポートを行いました " + cardusehistory_filename);
				}
			}

		if (String(this.SUOspec === "y")) {
			if (this.DEBUG) {
				this.logging("INFO: SUO特例処理、カード名義で使用者を上書きします");
			}
			var rtn = this.doSUOspec(cardX_tb);
		}

		this.dbh.commit();

		for (cnt = 0; cnt < fin_cnt; cnt++) //データディレクトリがある時
		{
// 2022cvt_015
			var dataDir = ETC_DIR + "/" + fin_pact[cnt];

			if (fs.existsSync(dataDir) == true) //ファイルの移動// 2022cvt_003
				{
// 2022cvt_015
					var finDir = dataDir + "/fin";

					if (fs.existsSync(finDir) == false) //完了ディレクトリの作成// 2022cvt_003
						{
							try {
								fs.mkdirSync(finDir, 700);
								if (this.DEBUG) {
									this.logging("INFO: 完了ディレクトリの作成しました " + finDir);
								}
								this.logh.putError(G_SCRIPT_INFO, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理  完了ディレクトリの作成しました " + finDir);
							} catch (e) {
								if (this.DEBUG) {
									this.logging("ERROR: 完了ディレクトリの作成に失敗しました " + finDir);
								}
								this.logh.putError(G_SCRIPT_ERROR, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理  完了ディレクトリの作成に失敗しました " + finDir);
								throw process.exit(1);// 2022cvt_009
							}
						}

// 					clearstatcache();// 2022cvt_012
					var dirh = fs.readdirSync(dataDir);
					// dirh = openDir(dataDir);// 2022cvt_004

					for (var copyfileName of dirh) {
					// while (copyfileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
// 2022cvt_019
						if (fs.statSync(ETC_DIR + "/" + fin_pact[cnt] + "/" + copyfileName).isFile() && copyfileName.match("/\\.txt$/i")) {
						// if (is_file(ETC_DIR + "/" + fin_pact[cnt] + "/" + copyfileName) == true && preg_match("/\\.txt$/i", copyfileName) == true) {
							try {
								fs.renameSync(ETC_DIR + "/" + fin_pact[cnt] + "/" + copyfileName, finDir + "/" + copyfileName);
								if (this.DEBUG) {
									this.logging("ERROR: ファイルの移動に失敗しました" + ETC_DIR + "/" + fin_pact[cnt] + "/" + copyfileName);
								}
								this.logh.putError(G_SCRIPT_INFO, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理  ファイルの移動に失敗しました " + ETC_DIR + "/" + fin_pact[cnt] + "/" + copyfileName);
							} catch (e) {
								if (this.DEBUG) {
									this.logging("INFO: ファイルの移動をしました " + ETC_DIR + "/" + fin_pact[cnt] + "/" + copyfileName);
								}
								this.logh.putError(G_SCRIPT_ERROR, "import_etc_coprhist.php " + this.DataTitle + "取込処理  ファイルの移動をしました " + ETC_DIR + "/" + fin_pact[cnt] + "/" + copyfileName);
							}

// 							clearstatcache();// 2022cvt_012
						}
					}

					// closedir(dirh);
				}
		}

		this.lock(false, this.dbh);
		console.log("" + this.DataTitle + "取込処理(" + this.SCRIPT_NAME + ")を終了しました。\n");
		if (this.DEBUG) {
			this.logging("END: " + this.DataTitle + "取込処理(" + this.SCRIPT_NAME + ")を終了しました");
		}
		this.logh.putError(G_SCRIPT_END, this.SCRIPT_NAME + " " + this.DataTitle + "取込処理 処理を終了しました");
	}

	async doCopyInsert(table: string, filename: string, columns: Array<any>, db: ScriptDB) //ファイルを開く
	//インサート処理開始
	//インサート処理おしまい、実質的な処理はここで行われる.
	{
// 2022cvt_015
		var buffer = "";
		try {
			buffer = fs.readFileSync(filename, "utf8");
		} catch (e) {
			this.logh!.putError(G_SCRIPT_ERROR, filename + "のファイルオープン失敗.");
			return 1;
		}
		var text = Encoding.convert(buffer, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		});
		var lines = text.toString().split("\r\n");
		// var fp = fopen(filename, "rt");

// 2022cvt_015
		var ins = new TableInserter(this.log_listener, db, filename + ".sql", true);
		ins.begin(table);

		for (var line of lines)
		// while (line = fgets(fp)) //tabで区切り配列に
		//要素数チェック
		//カラム名をキーにした配列を作る
		//インサート行の追加
		{
// 2022cvt_015
			var A_line = line.split("\t");
			// var A_line = split("\t", rtrim(line, "\n"));

			if (A_line.length != columns.length) {
				this.logh.putError(G_SCRIPT_ERROR, filename + "のデータ数が設定と異なります。データ=" + line);
				// fclose(fp);
				return 1;
			}

// 2022cvt_015
			var H_ins = {};
// 2022cvt_015
			var idx = 0;

// 2022cvt_015
			for (var col of columns) {
				H_ins[col] = A_line[idx];
				idx++;
			}

			if (await ins.insert(H_ins) == false) {
				this.logh.putError(G_SCRIPT_ERROR, filename + "のインサート中にエラー発生、データ=" + line);
				// fclose(fp);
				return 1;
			}
		}

		if (ins.end() == false) {
			this.logh.putError(G_SCRIPT_ERROR, filename + "のインサート処理に失敗.");
			// fclose(fp);
			return 1;
		}

		// fclose(fp);
		return 0;
	}

	usage(comment: string) {
		if (comment == "") {
			comment = "パラメータが不正です";
		}

		console.log("\n" + comment + "\n\n");
		console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={PACTID} -b={Y|N} -t={N|O} -s={Y|N}\n");
		console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
		console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
		console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
		console.log("		-b バックパップ	 (Y:バックアップする,N:バックアップしない)\n");
		console.log("		-t 対象月が最新/過去	(N:最新,O:過去) \n");
		console.log("		-s カード名義を使用者で	(Y:上書きする,N:しない) \n\n");
		throw process.exit(1);// 2022cvt_009
	}

	async lock(is_lock: boolean, db: ScriptDB) //ロックする
	{
		if (db == undefined) {
			return false;
		}

// 2022cvt_015
		var pre = db.escape("batch_" + this.SCRIPT_NAME);

		if (is_lock == true) //既に起動中
			//現在の日付を得る
			{
				db.begin();
				db.lock("clamptask_tb");
// 2022cvt_015
				var sql = "select count(*) from clamptask_tb " + "where command = '" + pre + "' and " + "status = 1;";
// 2022cvt_015
				var count = await db.getOne(sql);

				if (count != 0) {
					db.rollback();
					db.putError(G_SCRIPT_WARNING, "多重動作");
					return false;
				}

				this.nowtime = this.getTimestamp();
				sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + pre + "',1,'" + this.nowtime + "');";
				db.query(sql);
				db.commit();
			} else {
			db.begin();
			db.lock("clamptask_tb");
			sql = "delete from clamptask_tb " + "where command = '" + pre + "';";
			db.query(sql);
			db.commit();
		}

		return true;
	}

	logging(lstr: string) {
// 2022cvt_015
		var log_buf = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/") + " : " + lstr + "\n";
// 2022cvt_015
		var lfp = fs.openSync(this.LocalLogFile, "a");
		// var lfp = fopen(this.LocalLogFile, "a");
		flock.lockSync(this.LocalLogFile);
		// flock(lfp, LOCK_EX);
		fs.writeFileSync(lfp, log_buf);// 2022cvt_006
		flock.unlockSync(this.LocalLogFile);
		// flock(lfp, LOCK_UN);
		fs.closeSync(lfp);
		// fclose(lfp);
		return;
	}

	getTimestamp() {
		var tm = new Date();
		// var tm = localtime(Date.now() / 1000, true);
	// 2022cvt_015
		var yyyy = tm.getFullYear();
		// var yyyy = tm.tm_year + 1900;
	// 2022cvt_015
		var mm = (tm.getMonth() + 1).toString();
		// var mm = tm.tm_mon + 1;
		if (mm.length == 1) {
			mm = "0" + mm;
		}
		// if (mm < 10) mm = "0" + mm;
	// 2022cvt_015
		var dd = (tm.getDate() + 0).toString();
		// var dd = tm.tm_mday + 0;
		if (dd.length == 1) {
			dd = "0" + dd;
		}
		// if (dd < 10) dd = "0" + dd;
	// 2022cvt_015
		var hh = (tm.getHours() + 0).toString();
		// var hh = tm.tm_hour + 0;
		if (hh.length == 1) {
			hh = "0" + hh;
		}
		// if (hh < 10) hh = "0" + hh;
	// 2022cvt_015
		var nn = (tm.getMinutes() + 0).toString();
		// var nn = tm.tm_min + 0;
		if (nn.length == 1) {
			nn = "0" + nn;
		}
		// if (nn < 10) nn = "0" + nn;
	// 2022cvt_015
		var ss = (tm.getSeconds() + 0).toString();
		if (ss.length == 1) {
			ss = "0" + ss;
		}
		// var ss = tm.tm_sec + 0;
		// if (ss < 10) ss = "0" + ss;
		return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
	}

	async chkAsp(pactid: string) {
// 2022cvt_015
		var sql_str = "select count(*) from fnc_relation_tb where pactid = " + pactid + " and " + "fncid = " + G_AUTH_ASP;
// 2022cvt_015
		var count = await this.dbh.getOne(sql_str);

		if (count == 0) {
			return false;
		}

		return true;
	}

	getRiyouYM(year: number, month: number) //１月請求の時は１２月、年も－１
	{
// 2022cvt_015
		var A_riyou: { year: number, month: number } = {
			year: 0,
			month: 0
		};
// 2022cvt_015
		var riyou_year = year;
// 2022cvt_015
		var riyou_month = month - 1;

		if (month == 1) {
			riyou_month = 12;
			riyou_year = year - 1;
		}

		A_riyou.year = riyou_year;
		A_riyou.month = riyou_month;
		return A_riyou;
	}

	abstract iniSetting();
	abstract doSUOspec(cardX_tb: string): boolean;
	abstract doEachFile(ifp: number, A_billFile: string, A_pactid: any[], A_prcardno: any[], PACT_result: any[], CARD_result: any[], CARD_now_result: any[], CARD_now_delete_result: any[], A_del_sql: any[]): boolean;
};
