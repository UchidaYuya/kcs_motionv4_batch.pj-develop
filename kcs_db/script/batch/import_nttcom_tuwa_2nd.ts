import { KCS_DIR } from "../../conf/batch_setting";
import { G_LOG, sprintf } from "../../db_define/define";
import import_ntt_tuwa_base from "../batch/lib/import_ntt_tuwa_base";
import { G_SCRIPT_ALL,
	G_SCRIPT_BEGIN,
	G_SCRIPT_END,
	G_SCRIPT_ERROR,
	G_SCRIPT_WARNING,
	ScriptLogAdaptor,
	ScriptLogBase,
	ScriptLogFile
} from "./lib/script_log";

export const G_OPENTIME = "import_ntt_tuwa_base"
export const G_PROCNAME_J_IMPORT = "通話詳細インポートプロセス[NTTコミュニケーションズ]";
export const G_PROCNAME_IMPORT = "import_ntt_com";
export const G_PROCNAME = "import_ntt_com";
export const G_COMPANY_ID = "NTT_com/tuwa";
export const G_CARRIER_ID = "9";
export const G_RECODE_ID = "3";

//ＮＴＴ西日本prime
//一行(固定長)を分割して処理する
export default class import_ntt_com extends import_ntt_tuwa_base {
	async doDivisionLine(line:any, ins_comm:any, a_bill_prtel:any) //レコード種別:G_RECODE_IDのみ
	{
// 2022cvt_015
		var recode_id = line.substring(0, 1);

		if (recode_id == G_RECODE_ID) //課金先電話番号
			//課金先電話番号の正当性確認
			//通話開始日時
			//通話先電話番号
			//件名コード(要変換)
			//通話時間
			//通話料金
			//通話種別コード
			//通話種別名称(通話種別コードを変換)
			//昼夜別コード(要変換)
			//チェック
			//for DEBUG
			{
// 2022cvt_015
				var bill_telno = line.substring(2 - 1, 13);
				bill_telno = this.cleaningTelno(bill_telno);
// 2022cvt_015
				var billtelnoIsCorrect = false;
				var yyyymm = this.m_year + this.m_month;

				if (a_bill_prtel.length > 0) {
// 2022cvt_015
					for (var bill_prtel of (a_bill_prtel)) {
						if (bill_prtel == bill_telno) {
							billtelnoIsCorrect = true;
							break;
						}
					}
				}

				if (this.m_first_flag) {
					if (!billtelnoIsCorrect) {
// 						echo(`警告：課金先電話番号(${bill_telno})が不正です。登録されている課金先電話番号と合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");// 2022cvt_010
						global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：課金先電話番号(${bill_telno})が不正です。登録されている課金先電話番号と合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "行目)", 4);
						return false;
					}
				}

				if (this.m_first_flag) {
// 2022cvt_015
					var sql = "select count(prtelno) from bill_prtel_tb where prtelno='" + bill_telno + "'";

					if (await this.m_db.getOne(sql) > 1) {
// 						echo("\u8AB2\u91D1\u5148\u96FB\u8A71\u756A\u53F7(" + bill_telno + ")\u304C\u8907\u6570\u5B58\u5728\u3057\u307E\u3059\u3002\n");// 2022cvt_010
						global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + "エラー： 課金先電話番号(" + bill_telno + ")が複数存在します。", 4);
						return false;
					}
				}

// 2022cvt_015
				var telno = line.substring(16 - 1, 13);
				telno = this.cleaningTelno(telno);
// 2022cvt_015
				var startdatetime : any;
// 2022cvt_015
				var startdatetime_str = "";
				//通話日付 [MMDD]
				//通話開始時刻 [HHMMSS]
				////１行目のみチェック
				//				if($this->m_first_flag) {
				//					$this->m_first_flag = false;
				//					if($MM != $this->getTableNo()) {
				//						// データの日付と処理対象の日付が異なる
// 				//						echo "警告：データの請求月が処理対象月と異なります。file:$this->m_targetFile (".$this->m_targetLine."行目) \n";// 2022cvt_010
				//						$GLOBALS["G_COMMON_LOG"]->putError(G_SCRIPT_ERROR,  $this->m_procname_j." ".$this->m_target_pactid." ".$this->m_compname." ".$yyyymm." ".$this->m_targetFile." 警告：データの請求月が処理対象月と異なります。file:$this->m_targetFile (".$this->m_targetLine."行目)", 3 );
				//						$this->m_warningCount++;
				//						return false;
				//					}
				//				}
				{
// 2022cvt_015
					var stardate = line.substring(46 - 1, 4);
// 2022cvt_015
					var startime = line.substring(50 - 1, 6);
// 2022cvt_015
					var YYYY = this.m_year;
// 2022cvt_015
					var MM = stardate.substring(0, 2);
// 2022cvt_015
					var DD = stardate.substring(2, 2);
// 2022cvt_015
					var H = startime.substring(0, 2);
// 2022cvt_015
					var M = startime.substring(2, 2);
// 2022cvt_015
					var S = startime.substring(4, 2);
// 2022cvt_021
					startdatetime_str = sprintf("%04d/%02d/%02d %02d:%02d:%02d", YYYY, MM, DD, H, M, S);
					// startdatetime = date(startdatetime_str);
					startdatetime = Date.parse(startdatetime_str);
				}
// 2022cvt_015
				var to_Telno = line.substring(56 - 1, 13);
// 2022cvt_015
				var ken_code = line.substring(69 - 1, 2);
// 2022cvt_015
				var ken_name = this.m_h_comm_area[ken_code];
// 2022cvt_015
				var tuwa_time_str = "";
				//通話時間フォーマット変更 by suehiro 2004.10.27
				//0.5秒単位＝7桁
				{
// 2022cvt_015
					var tuwa_time = line.substring(71 - 1, 8);
// 2022cvt_015
					var HH = tuwa_time.substring(1, 2);
					MM = tuwa_time.substring(3, 2);
// 2022cvt_015
					var SSS = tuwa_time.substring(5, 3);
					tuwa_time_str = HH + MM + SSS;
				}
// 2022cvt_015
				var tuwa_money_str = "";
				{
// 2022cvt_015
					var tuwa_money = line.substring(79 - 1, 10);
// 2022cvt_015
					var up = tuwa_money.substring(0, 9);
// 2022cvt_015
					var low = tuwa_money.substring(9, 1);
					tuwa_money_str = up + "." + low;
				}
// 2022cvt_015
				var tuwa_kind_code = line.substring(111 - 1, 3);
// 2022cvt_015
				var tuwa_kind_name = this.m_h_tuwa_kind[tuwa_kind_code];
// 2022cvt_015
				var hiruyoru_code = line.substring(114 - 1, 3);
// 2022cvt_015
				var hiruyoru_name = this.m_h_daynight[hiruyoru_code];

				if (this.m_h_comm_area[ken_code] == "") {
// 					echo(`警告：県名コード(${ken_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");// 2022cvt_010
					global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：県名コード(${ken_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "行目)", 4);
					this.m_warningCount++;
				} else if (this.m_h_tuwa_kind[tuwa_kind_code] == "") {
// 					echo(`警告：通話種別コード(${tuwa_kind_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");// 2022cvt_010
					global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：通話種別コード(${tuwa_kind_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "行目)", 4);
					this.m_warningCount++;
				} else if (this.m_h_daynight[hiruyoru_code] == "") {
// 					echo(`警告：昼夜別コード(${hiruyoru_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");// 2022cvt_010
					global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：昼夜別コード(${hiruyoru_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "行目)", 4);
					this.m_warningCount++;
				} else if (startime == "999999") {
// 					echo(`警告：通話開始時刻(${startime})が不正です。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");// 2022cvt_010
					global.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：通話開始時刻(${startime})が不正です。file:${this.m_targetFile} (` + this.m_targetLine + "行目)", 4);
					this.m_warningCount++;
				} else {
// 2022cvt_015
					var param = {
						pactid: this.m_target_pactid,
						telno: telno,
// 2022cvt_016
						type: "K",
						date: startdatetime,
						totelno: to_Telno,
						toplace: ken_name,
						time: tuwa_time_str,
						charge: tuwa_money_str,
						callseg: tuwa_kind_code,
						callsegname: tuwa_kind_name,
						chargeseg: hiruyoru_name,
						carid: G_CARRIER_ID
					};
					ins_comm.insert(param);
					this.m_insertCount++;
				}

				// if (DEBUG == 1) {
// 				if (DEBUG) {
// // 					echo(recode_id + ":\u30EC\u30B3\u30FC\u30C9\u7A2E\u5225:3\u306E\u307F\n");// 2022cvt_010
// // 					echo(telno + ":\u767A\u4FE1\u96FB\u8A71\u756A\u53F7\u30FB\u8AB2\u91D1\u5148\u96FB\u8A71\u756A\u53F7\n");// 2022cvt_010
// // 					echo(startdatetime + ":\u901A\u8A71\u958B\u59CB\u6642\u523B\n");// 2022cvt_010
// // 					echo(to_Telno + ":\u901A\u8A71\u5148\u96FB\u8A71\u756A\u53F7\n");// 2022cvt_010
// // 					echo(ken_code + ":\u770C\u540D\u30B3\u30FC\u30C9(\u8981\u5909\u63DB)\n");// 2022cvt_010
// // 					echo(ken_name + ":\u770C\u540D\n");// 2022cvt_010
// // 					echo(tuwa_time_str + ":\u901A\u8A71\u6642\u9593\n");// 2022cvt_010
// // 					echo(tuwa_money_str + ":\u901A\u8A71\u6599\u91D1\n");// 2022cvt_010
// // 					echo(tuwa_kind_code + ":\u901A\u8A71\u7A2E\u5225\n");// 2022cvt_010
// // 					echo(tuwa_kind_name + ":\u901A\u8A71\u7A2E\u5225\n");// 2022cvt_010
// // 					echo(hiruyoru_code + ":\u663C\u591C\u5225\u30B3\u30FC\u30C9\n");// 2022cvt_010
// // 					echo(hiruyoru_name + ":\u663C\u591C\u5225\u30B3\u30FC\u30C9\n");// 2022cvt_010
// // 					echo("\n");// 2022cvt_010
// 				}
			}

		return true;
	}

};
(async ()=>{
// 2022cvt_015
var dbLogFile = KCS_DIR + "/data/log/billbat.log";
// 2022cvt_015
var log_listener = new ScriptLogBase(0);
// 2022cvt_016
// 2022cvt_015
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
// 2022cvt_016
log_listener.putListener(log_listener_type);
// 2022cvt_016
// 2022cvt_015
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
// 2022cvt_016
log_listener.putListener(log_listener_typeView);
global.G_COMMON_LOG = new ScriptLogAdaptor(log_listener, true);
global.G_COMMON_LOG.putError(G_SCRIPT_BEGIN, G_PROCNAME_J_IMPORT + " 処理開始", 6);
// 2022cvt_015
var proc = new import_ntt_com(G_PROCNAME_IMPORT, G_PROCNAME_J_IMPORT, G_LOG, G_OPENTIME);

if (!proc.readArgs(undefined)) //異常終了
	{
		proc.cleanup();
// 		echo("\u30D1\u30E9\u30E1\u30FC\u30BF\u30C1\u30A7\u30C3\u30AF \u7570\u5E38\u7D42\u4E86\n");// 2022cvt_010
		global.G_COMMON_LOG.putError(G_SCRIPT_END, G_PROCNAME_J_IMPORT + " パラメータチェック 異常終了", 4);
		throw process.exit(1);// 2022cvt_009
	}

if (!proc.execute()) //異常終了
	{
		proc.cleanup();
// 		echo("\u5B9F\u884C\u6642 \u7570\u5E38\u7D42\u4E86\n");// 2022cvt_010
		global.G_COMMON_LOG.putError(G_SCRIPT_ERROR, G_PROCNAME_J_IMPORT + " 実行時 異常終了", 3);
	}

// 2022cvt_015
var warning = "";

if (proc.m_warningCountGross > 0) {
	warning = "(警告" + proc.m_warningCountGross + "件)";
}

proc.cleanup();
// 2022cvt_015
var endtime = proc.getLapsedTime();
var yyyymm: any;
// echo("\u51E6\u7406\u7D42\u4E86 " + proc.m_fileCount + "\u30D5\u30A1\u30A4\u30EB " + proc.m_insertCountGross + `件 ${warning} (${endtime})\n`);// 2022cvt_010
global.G_COMMON_LOG.putError(G_SCRIPT_END, G_PROCNAME_J_IMPORT + " " + proc.m_pactid + " " + proc.m_compname + " " + yyyymm + " " + proc.m_srcpath + " 処理終了 " + proc.m_fileCount + "ファイル " + proc.m_insertCountGross + `件 ${warning} (${endtime})`, 6);
throw process.exit(0);// 2022cvt_009
})();