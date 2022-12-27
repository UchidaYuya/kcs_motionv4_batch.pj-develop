//===========================================================================
//機能：通話明細統計情報抽出プロセス(ドコモ、au、Softbank対応)
//
//作成：中西	2006/11/16
//更新：中西	2008/10/02	Softbank対応
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：通話明細統計情報抽出プロセス(ドコモ、au、Softbank対応)
// error_reporting(E_ALL);

// 2022cvt_026
// require("lib/process_base.php");

// 2022cvt_026
// require("lib/update_trend_nttdocomo.php");

// 2022cvt_026
// require("lib/update_trend_au.php");

// 2022cvt_026
// require("lib/update_trend_voda.php");

import { ProcessBase, ProcessCarid } from './lib/process_base';
import updateTrendNttDocomo from './lib/update_trend_nttdocomo';
import updateTrendAu from './lib/update_trend_au';
import updateTrendVoda from './lib/update_trend_voda';
import { TableInserter } from './lib/script_db';
import { G_SCRIPT_ERROR } from './lib/script_log';
import { G_LOG } from '../../db_define/define';
import { G_CARRIER_DOCOMO, G_CARRIER_AU, G_CARRIER_VODA, G_CLIENT_DB } from './lib/script_common';

const G_PROCNAME_TREND_ALL = "trend";
const G_OPENTIME_TREND_ALL = "0000,2400";

//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：引数の数をチェックする
//引数：引数
//返値：深刻なエラーが発生したらfalseを返す
//備考：キャリアID指定を必須としたいが為に用意した
//キャリアIDが指定されればTrue
//機能：キャリアIDが指定されたかどうかチェックする
//引数：なし
//返値：深刻なエラーが発生したらfalseを返す
//備考：キャリアID指定を必須としたいが為に用意した
//機能：一個のARGVの内容を確認する
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
export default class ProcessTrend extends ProcessCarid {
	IS_CARID: any;
	// constructor() {
	// 	super(...arguments);
	// 	this.IS_CARID = false;
	// }

	constructor(procname: any, logpath: any, opentime: any) {
		super(procname, logpath, opentime);
	}

	getProcname() {
		return "通話明細統計情報抽出プロセス(ドコモ、au、Softbank対応)";
	}

	checkArgCnt(args: string | any[]) {
		if (args.length <= 2) {
			this.putError(G_SCRIPT_ERROR, "キャリアID指定は必須です、-c=(" + G_CARRIER_DOCOMO + ":ドコモ, " + G_CARRIER_AU + ":au, " + G_CARRIER_VODA + ":Softbank)");
			return false;
		}

		return true;
	}

	checkIsCarid() {
		if (this.IS_CARID == false) {
			this.putError(G_SCRIPT_ERROR, "キャリアID指定は必須です、-c=(" + G_CARRIER_DOCOMO + ":ドコモ, " + G_CARRIER_AU + ":au, " + G_CARRIER_VODA + ":Softbank)");
			return false;
		}

		return true;
	}

	checkArg(args: { key: any; value: string; }) {
		if (!ProcessBase.checkArg(args)) return false;

		switch (args.key) {
			case "c":
				if (0 == args.value.length) {
					this.putError(G_SCRIPT_ERROR, "キャリアIDがない");
				}

// 2022cvt_015
				var A_carid:any = args.value.split(",");

// 2022cvt_015
				for (var carid of A_carid) {
					switch (carid) {
						case G_CARRIER_DOCOMO:
						case G_CARRIER_AU:
						case G_CARRIER_VODA:
							this.IS_CARID = true;
							break;

						default:
							this.putError(G_SCRIPT_ERROR, "対象外のキャリアID" + carid);
							return false;
					}
				}

				break;
		}

		return true;
	}

	executePactid(pactid: any, logpath: string) //更新型の作成
	//NTTドコモの場合
	//既存レコードの削除
	{
// 2022cvt_015
		var no = this.getTableNo();
// 2022cvt_015
		var ins_trend = new TableInserter(this.m_listener, this.m_db, logpath + "sim_trend_" + no + "_tb.insert", true);
// 2022cvt_015
		var ins_top = new TableInserter(this.m_listener, this.m_db, logpath + "sim_top_telno_" + no + "_tb.insert", true);

		if (this.m_carid == G_CARRIER_DOCOMO) {
// 2022cvt_015
			var update_trend:any = new updateTrendNttDocomo(this.m_listener, this.m_db, this.m_table_no, ins_trend, ins_top);
		} else if (this.m_carid == G_CARRIER_AU) {
			update_trend = new updateTrendAu(this.m_listener, this.m_db, this.m_table_no, ins_trend, ins_top);
		} else if (this.m_carid == G_CARRIER_VODA) {
			update_trend = new updateTrendVoda(this.m_listener, this.m_db, this.m_table_no, ins_trend, ins_top);
		} else {
			this.putError(G_SCRIPT_ERROR, `対象外のキャリアID, ${this.m_carid}`);
			return false;
		}

		if (!update_trend.delete(pactid, this.m_carid, this.m_year, this.m_month, logpath + "sim_trend_" + no + "_tb.delete", logpath + "sim_top_telno_" + no + "_tb.delete")) return false;
		if (!update_trend.execute(pactid, this.m_carid, this.m_year, this.m_month)) return false;
		return true;
	}

};

// checkClient(G_CLIENT_DB);
// 2022cvt_015
var proc = new ProcessTrend(G_PROCNAME_TREND_ALL, G_LOG, G_OPENTIME_TREND_ALL);
if (!proc.checkArgCnt(process.argv)) throw process.exit(1);
if (!proc.readArgs(undefined)) throw process.exit(1);
if (!proc.checkIsCarid()) throw process.exit(1);
if (!proc.execute()) throw process.exit(1);
throw process.exit(0);