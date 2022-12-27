//===========================================================================
//機能：シミュレーションプロセス(夜間自動実行)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//===========================================================================
//機能：シミュレーションプロセス(夜間自動実行)
// error_reporting(E_ALL);// 2022cvt_011

// 2022cvt_026
// require("lib/process_base.php");

// 2022cvt_026
// require("lib/update_recom_base3.php");

// 2022cvt_026
// require("lib/update_recom_docomo3.php");

// 2022cvt_026
// require("lib/update_recom_au3.php");

// 2022cvt_026
// require("lib/update_recom_softbank3.php");

// 2022cvt_026
// require("lib/update_recom_index3.php");

import moduleName from 'module';
import { G_LOG, G_LOG_HAND } from '../../db_define/define';
import { ProcessDefault } from "./lib/process_base";
import { G_CARRIER_ALL, G_CARRIER_AU, G_CARRIER_DOCOMO } from './lib/script_common';
import { TableInserter } from './lib/script_db';
import { G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING } from './lib/script_log';
import UpdateRecomAU from './lib/update_recom_au3';
import UpdateRecomDocomo from './lib/update_recom_docomo3';
import UpdateRecomIndex from './lib/update_recom_index3';


export const G_PROCNAME_RECOM3 = "recom3v";
export const G_OPENTIME_RECOM3 = "0000,2400";

//追加ログ出力レベル
//sim_log_tbを保存するならtrue
//処理するキャリアID
//処理する電話番号
//処理しない電話番号
//シミュレーション期間
//当月のデータがあっても処理をするならtrue
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：一個のARGVの内容を確認する
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//-----------------------------------------------------------------------
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
//機能：25日用の処理を行う
//引数：顧客ID
//作業ファイル保存先
//テーブル番号
//返値：深刻なエラーが発生したらfalseを返す
export class ProcessRecom extends ProcessDefault {
	m_is_timeout: boolean;
	m_args: any;
	m_level: number;
	m_is_write_log: boolean;
	m_A_carid: number[];
	m_A_telno_in: any[];
	m_A_telno_out: any[];
	m_A_monthcnt: number[];
	m_force_sim: boolean;
	constructor(procname, logpath, opentime) //デフォルト値の設定
	{
		super(procname, logpath, opentime);
		this.m_is_timeout = true;
		this.m_args.addSetting({
			D: {
// 2022cvt_016
				type: "int"
			},
			L: {
// 2022cvt_016
				type: "int"
			},
			c: {
// 2022cvt_016
				type: "string"
			},
			t: {
// 2022cvt_016
				type: "string"
			},
			T: {
// 2022cvt_016
				type: "string"
			},
			s: {
// 2022cvt_016
				type: "string"
			},
			x: {
// 2022cvt_016
				type: "int"
			}
		});
		this.m_level = 3;
		this.m_is_write_log = false;
		this.m_A_carid = [G_CARRIER_ALL];
		this.m_A_telno_in = Array();
		this.m_A_telno_out = Array();
		this.m_A_monthcnt = [1, 2, 3, 6, 12];
		this.m_force_sim = false;
	}

	getProcname() {
		return "シミュレーションプロセス(自動実行)";
	}

	checkArg(args) {
		if (!super.checkArg(args)) return false;

		switch (args.key) {
			case "c":
// 2022cvt_015
				var result = args.value.split(",");

// 2022cvt_015
				for (var item of result) {
// 2022cvt_016
					if (!isNaN(item)) {
						this.putError(G_SCRIPT_ERROR, "キャリアID不正" + args.value);
						return false;
					}
				}

				break;

			case "s":
// 2022cvt_015
				var A_month = args.value.split(",");

// 2022cvt_015
				for (var month of A_month) {
					if (month < 1 || 12 < month) {
						this.putError(G_SCRIPT_ERROR, `シミュレーション期間が不正${month}`);
						return false;
					}
				}

				if (0 == A_month.length) {
					this.putError(G_SCRIPT_ERROR, "シミュレーション期間がない" + args.value);
					return false;
				}

				break;
		}

		return true;
	}

	commitArg(args) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "D":
				this.m_level = args.value;
				break;

			case "L":
				this.m_is_write_log = args.value;
				break;

			case "c":
				this.m_A_carid = args.value.split(",");
				break;

			case "t":
// 2022cvt_015
				var telno = args.value.split(",");

// 2022cvt_015
				for (var no of Object.values(telno)) this.m_A_telno_in.push(no);

				break;

			case "T":
				telno = args.value.split(",");

// 2022cvt_015
				for (var no of Object.values(telno)) this.m_A_telno_out.push(no);

				break;

			case "s":
				this.m_A_monthcnt = Array();
// 2022cvt_015
				var A_month = args.value.split(",");

// 2022cvt_015
				for (var month of A_month) {
					if (1 <= month && month <= 12) {
						if (!(-1 !== this.m_A_monthcnt.indexOf(month))) this.m_A_monthcnt.push(month);
					}
				}

				break;

			case "x":
				this.m_force_sim = args.value;
				break;
		}

		return true;
	}

	getUsage() {
// 2022cvt_015
		var rval = super.getUsage();
		rval.push(["-D=0,1,2", "追加ログ出力レベル"]);
		rval.push(["-L={0,1}", "sim_log_tbを保存するなら1(0)"]);
		rval.push(["-c=1,2,3", "処理するキャリアID(1,3,4)"]);
		rval.push(["-t=telno[,telno...]", "処理する電話番号(全部)"]);
		rval.push(["-T=telno[,telno...]", "処理しない電話番号(なし)"]);
		rval.push(["-s=num[,num...]", "処理する月数(1,3,6,12)"]);
		rval.push(["-x={0|1}", "当月を処理済みでも再実行するなら1(0)"]);
		return rval;
	}

	getManual() {
// 2022cvt_015
		var rval = super.getManual();
		rval += "追加ログ出力レベル:" + this.m_level + "\n";
		rval += "sim_log_tbに保存" + (this.m_is_write_log ? "する" : "しない") + "\n";
		rval += "処理するキャリア:" + this.m_A_carid.join(",") + "\n";

		if (this.m_A_telno_in.length) {
			rval += "処理する電話番号:" + this.m_A_telno_in.join(",") + "\n";
		}

		if (this.m_A_telno_out.length) {
			rval += "処理しない電話番号:" + this.m_A_telno_out.join(",") + "\n";
		}

		rval += "処理する期間:" + this.m_A_monthcnt.join(",") + "\n";
		rval += "当月処理済の場合:" + (this.m_force_sim ? "実行する" : "実行しない") + "\n";
		return rval;
	}

	executePactid(pactid, logpath) {
		if (-1 !== this.m_A_carid.indexOf(G_CARRIER_ALL)) {
			this.m_A_carid = [G_CARRIER_DOCOMO, G_CARRIER_AU, UpdateRecomSoftbank.g_carid];
		}

// 2022cvt_015
		var no = this.getTableNo();
		return this.executeSim(pactid, logpath, no);
	}

	executeSim(pactid, logpath, no) //更新型を作成する
	//統計情報がなければ処理を打ち切る
	//挿入準備を行う
	//挿入処理を行う
	{
// 2022cvt_015
		var O_index = new UpdateRecomIndex(this.m_listener, this.m_db, this.m_table_no);
// 2022cvt_015
		var H_ym = {
			year: this.m_year,
			month: this.m_month
		};

		if (!O_index.isReadyTrend(H_ym, pactid, this.m_A_carid)) {
			this.putError(G_SCRIPT_INFO, "sim_trend_X_tb\u306Bcarid(" + this.m_A_carid.join(",") + ")のレコードが無いので処理せず" + pactid);
			return true;
		}

		if (!this.m_force_sim) //当月が処理済みなら処理を打ち切る
			//夜間実行の結果を取り出す
			//is_hotlineは無視する
			//回線管理からのシミュレーション結果を取り出す
			//is_hotlineがtrue
			//両方の内、どちらかでもあれば処理済みである
			{
// 2022cvt_015
				var A_simid = O_index.getSimID(pactid, [UpdateRecomIndex.g_status_end], undefined, undefined, [false], [false], {
					year: this.m_year,
					month: this.m_month
				}, this.m_A_carid, Array());
// 2022cvt_015
				var A_simid_2 = O_index.getSimID(pactid, [UpdateRecomIndex.g_status_end], undefined, undefined, [false], [true], {
					year: this.m_year,
					month: this.m_month
				}, this.m_A_carid, [true]);

				if (A_simid.length || A_simid_2.length) {
					this.putError(G_SCRIPT_INFO, "\u5F53\u6708\u51E6\u7406\u6E08\u307F" + pactid + "/" + this.m_year + "/" + this.m_month + "/" + A_simid.join(","));
					return true;
				}
			}

// 2022cvt_015
		var O_inserter_details = new TableInserter(this.m_listener, this.m_db, logpath + "sim_details_tb.insert", true);
		O_inserter_details.setUnlock();
// 2022cvt_015
		var O_inserter_index = new TableInserter(this.m_listener, this.m_db, logpath + "sim_index_tb.insert", true);
		O_inserter_index.setUnlock();
// 2022cvt_015
		var O_inserter_log = new TableInserter(this.m_listener, this.m_db, logpath + "sim_log_tb.insert", true);
		O_inserter_log.setUnlock();

		if (!O_inserter_index.begin("sim_index_tb")) {
			this.putError(G_SCRIPT_ERROR, "sim_index_tb->begin\u5931\u6557");
			return false;
		}

		if (!O_inserter_details.begin("sim_details_tb")) {
			this.putError(G_SCRIPT_ERROR, "sim_details_tb->begin\u5931\u6557");
			return false;
		}

		if (!O_inserter_log.begin("sim_log_tb")) {
			this.putError(G_SCRIPT_ERROR, "sim_log_tb->begin\u5931\u6557");
			return false;
		}

		if (-1 !== this.m_A_carid.indexOf(G_CARRIER_DOCOMO)) {
// 2022cvt_015
			var O_docomo = new UpdateRecomDocomo(this.m_listener, this.m_db, this.m_table_no, O_inserter_log, this.m_level);
			O_index.addCarrier(G_CARRIER_DOCOMO, O_docomo);
		}

		if (-1 !== this.m_A_carid.indexOf(G_CARRIER_AU)) {
// 2022cvt_015
			var O_au = new UpdateRecomAU(this.m_listener, this.m_db, this.m_table_no, O_inserter_log, this.m_level);
			O_index.addCarrier(G_CARRIER_AU, O_au);
		}

		if (-1 !== this.m_A_carid.indexOf(UpdateRecomSoftbank.g_carid)) {
// 2022cvt_015
			var O_softbank = new UpdateRecomSoftbank(this.m_listener, this.m_db, this.m_table_no, O_inserter_log, this.m_level);
			O_index.addCarrier(UpdateRecomSoftbank.g_carid, O_softbank);
		}

// 2022cvt_015
		for (var carid of Object.values(this.m_A_carid)) //既存レコードを削除する
		//is_saveとis_manualが両方ともfalseのレコードを削除する
		//-tと-Tオプションで条件を指定しても、すべてが削除される
		//is_hotlineは無視する
		//同時に、is_manualがtrueでis_hotlineがtrueのレコードも削除する
		//is_hotlineがtrue
		{
			A_simid = O_index.getSimID(pactid, [UpdateRecomIndex.g_status_end], carid, carid, [false], [false], Array(), Array(), Array());
			A_simid_2 = O_index.getSimID(pactid, [UpdateRecomIndex.g_status_end], carid, carid, [false], [true], Array(), Array(), [true]);

// 2022cvt_015
			for (var simid of Object.values(A_simid_2)) if (!(-1 !== A_simid.indexOf(simid))) A_simid.push(simid);

			if (A_simid.length) {
				this.putError(G_SCRIPT_INFO, "既存自動レコード削除" + A_simid.join(","));

				if (!O_index.deleteSimID(A_simid, logpath + "sim_details_tb.delete." + carid, false)) {
					this.putError(G_SCRIPT_WARNING, "sim_details_tb(自動)削除失敗" + carid);
					return false;
				}

				if (!O_index.deleteSimID(A_simid, logpath + "sim_index_tb.delete." + carid, true)) {
					this.putError(G_SCRIPT_WARNING, "sim_index_tb削除失敗" + carid);
					return false;
				}
			}

// 2022cvt_015
			var A_param = O_index.createIndex(pactid, carid, carid, this.m_year, this.m_month, this.m_A_monthcnt, [0, 1, 2], [true, false]);
// 2022cvt_015
			var H_part = O_index.partIndex(A_param);
// 2022cvt_015
			var A_simid_error = Array();

			if (!O_index.execute(O_inserter_details, A_simid_error, H_part, this.m_A_telno_in, this.m_A_telno_out, new Date().toJSON().slice(0,10).replace(/-/g,'-'))) {
				this.putError(G_SCRIPT_WARNING, "シミュレーション失敗" + pactid + "/" + carid);
				return false;
			}

			O_index.putIndex(O_inserter_index, A_param, A_simid_error);
		}

		if (!O_inserter_index.end()) {
			this.putError(G_SCRIPT_ERROR, "sim_index_tb->end失敗");
			return false;
		}

		if (!O_inserter_details.end()) {
			this.putError(G_SCRIPT_ERROR, "sim_details_tb->end失敗");
			return false;
		}

		if (this.m_is_write_log) {
			if (!O_inserter_log.end()) {
				this.putError(G_SCRIPT_ERROR, "sim_log_tb->end失敗");
				return false;
			}
		} else {
			this.putError(G_SCRIPT_INFO, "sim_log_tbへは書き込まず");
		}

		return true;
	}

};

// checkClient(G_CLIENT_DB);
// 2022cvt_015
var log = G_LOG;
// 2022cvt_016
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
// 2022cvt_015
var proc = new ProcessRecom(G_PROCNAME_RECOM3, log, G_OPENTIME_RECOM3);
if (!proc.readArgs(undefined)) throw process.exit(1);// 2022cvt_009
if (!proc.execute()) throw process.exit(1);// 2022cvt_009
throw process.exit(0);// 2022cvt_009
