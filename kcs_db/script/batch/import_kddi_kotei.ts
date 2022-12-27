//===========================================================================
//機能：請求情報ファイルインポートプロセス（KDDI 固定専用）
//
//作成：前田 2008/02/20
//更新履歴
//V3対応 2009/11/26 s.maeda
//国内通話料非課税額算出ルール仕様変更（割引対象通話料を除く） 2009/12/17 s.maeda
//国内通話料非課税額算出ルール仕様変更（基本料/工事料を除く）2009/12/21 s.maeda
//番号毎の小計（区分：３９）が０円なのに請求明細がある場合は、請求明細を除外する 2010/9/9 s.maeda
//===========================================================================

// 2022cvt_026
import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define";
import TableNo, { ScriptDB, TableInserter } from "../batch/lib/script_db";
// require("lib/script_db.php");

// 2022cvt_026
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../batch/lib/script_log";
// require("lib/script_log.php");

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import { G_AUTH_ASP, G_CARRIER_KDDI_KOTEI, G_CODE_ASP, G_CODE_ASX, G_EXCISE_RATE } from "./lib/script_common";
import { array_merge_recursive } from "../../class/array_merge_recursive";
import { expDataByCursor, pg_copy_from } from "../pg_function";

(async () => {
const DEBUG = 1;
const KDDI_KOTEI_DIR = "/KDDI_kotei";
const FIN_DIR = "/fin";
const LOG_DELIM = " ";
const KDDI_KOTEI_AREA_ID = 47;
const KDDI_KOTEI_CIRCUIT_ID = 35;
const SCRIPTNAME = "import_kddi_kotei.php";
const UTIZEI = 3;
const HITAISYOU = 4;
const LINESIZE = 300;
const KUBUN_START = 0;
const KUBUN_LENGTH = 2;
const ACCOUNT_HEADER_KUBUN = "10";
const TUUSIN_MEISAI_KUBUN = "20";
const TUUSIN_KOKUNAI_KUBUN = "31";
const TUUSIN_KOKUSAI_KUBUN = "32";
const WARIBIKI_MEISAI_KUBUN = "21";
const KIHON_KOUJI_KUBUN = "22";
const TOUGOU_SEIKYUU_KUBUN = "24";
const KONTENTU_MEISAI_KUBUN = "25";
const BANGOU_SYOUKEI_KUBUN = "39";
const ACCOUNT_MEISAI_KUBUN = "70";
const SEIKYUU_GOUKEI_KUBUN = "80";
const KOKUNAI_KAZEI = "kokunai-kazei";
const KOKUNAI_HIKAZEI = "kokunai-hikazei";
const KOKUNAI_KAZEI_WARIBIKI = "kokunai-kazei-waribiki";
const KOKUSAI = "kokusai";
const TAX = "tax";
const KURIKOSHI = "kurikoshi";
const TYOUSEI = "tyousei";
const ENTAIRISOKU = "entairisoku";
const JYUUTOU = "jyuutou";
const SEIKYUU = "seikyuu";
const NUM_FETCH = 10000;
const COPY_LINES = 10000;
const TUWA_TYPE = "KK";
// 2022cvt_015
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
// 2022cvt_015
var log_listener = new ScriptLogBase(0);
// 2022cvt_016
// 2022cvt_015
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
// 2022cvt_016
// 2022cvt_015
var log_listener_type_stdout = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
// 2022cvt_016
log_listener.putListener(log_listener_type);
// 2022cvt_016
log_listener.putListener(log_listener_type_stdout);
// 2022cvt_015
var dbh = new ScriptDB(log_listener);
// 2022cvt_015
var logh = new ScriptLogAdaptor(log_listener, true);

var mode = "";
var billdate = "";
var year = 0;
var month = 0;
var pactid = "";
var backup = "";
var teltable = "";

if (process.argv.length != 6 + 1) //数が正しい
	{
		usage("");
	} else //$argvCounter 0 はスクリプト名のため無視
	{
// 2022cvt_015
		var argvCnt = process.argv.length;

// 2022cvt_015
		for (var argvCounter = 1 + 1; argvCounter < argvCnt; argvCounter++) //mode を取得
		{
			if (process.argv[argvCounter].match("^-e="))
			// if (ereg("^-e=", _SERVER.argv[argvCounter]) == true) //モード文字列チェック
				{
// 2022cvt_015
					mode = process.argv[argvCounter].replace("^-e=", "").toLowerCase();
					// var mode = ereg_replace("^-e=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (!mode.match("^[ao]$")) {
					// if (ereg("^[ao]$", mode) == false) {
						usage("モードの指定が不正です");
					}

					continue;
				}

			if (process.argv[argvCounter].match("^-y="))
			// if (ereg("^-y=", _SERVER.argv[argvCounter]) == true) //請求年月文字列チェック
				{
// 2022cvt_015
					billdate = process.argv[argvCounter].replace("^-y=", "");
					// var billdate = ereg_replace("^-y=", "", _SERVER.argv[argvCounter]);

					if (!billdate.match("^[0-9]{6}$")) {
					// if (ereg("^[0-9]{6}$", billdate) == false) {
						usage("請求年月の指定が不正です");
					} else //年月チェック
						{
// 2022cvt_015
							year = parseInt(billdate.substring(0, 4));
// 2022cvt_015
							month = parseInt(billdate.substring(4, 2));

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("請求年月の指定が不正です");
							}
						}

					continue;
				}

			if (process.argv[argvCounter].match("^-p="))
			// if (ereg("^-p=", _SERVER.argv[argvCounter]) == true) //契約ＩＤチェック
				{
// 2022cvt_015
					pactid = process.argv[argvCounter].replace("^-p=", "").toLowerCase();
					// var pactid = ereg_replace("^-p=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (!pactid.match("^all$") && !pactid.match("^[0-9]+$")) {
					// if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("契約ＩＤの指定が不正です");
					}

					continue;
				}

			if (process.argv[argvCounter].match("^-b="))
			// if (ereg("^-b=", _SERVER.argv[argvCounter]) == true) //バックアップの有無のチェック
				{
// 2022cvt_015
					backup = process.argv[argvCounter].replace("^-b=", "").toLowerCase();
					// var backup = ereg_replace("^-b=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (!backup.match("^[ny]$")) {
					// if (ereg("^[ny]$", backup) == false) {
						usage("バックアップの指定が不正です");
					}

					continue;
				}

			if (process.argv[argvCounter].match("^-t="))
			// if (ereg("^-t=", _SERVER.argv[argvCounter]) == true) //電話テーブルの指定をチェック
				{
// 2022cvt_015
					teltable = process.argv[argvCounter].replace("^-t=", "").toLowerCase();
					// var teltable = ereg_replace("^-t=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (!teltable.match("^[no]$")) {
					// if (ereg("^[no]$", teltable) == false) {
						usage("電話テーブルの指定が不正です");
					}

					continue;
				}

			usage("");
		}
	}

logh.putError(G_SCRIPT_BEGIN, "ＫＤＤＩ固定請求情報ファイルインポート処理開始");
// 2022cvt_015
var dataDir = DATA_DIR + "/" + year + month + KDDI_KOTEI_DIR;

var A_pactid = Array();

if (fs.existsSync(dataDir) == false) //ディレクトリのパスが正しい場合// 2022cvt_003
	{
		logh.putError(G_SCRIPT_ERROR, "ＫＤＤＩ固定請求データファイルディレクトリ（" + dataDir + "）がみつかりません");
	} else //処理する契約ＩＤ配列
	//ディレクトリハンドル
	//契約ＩＤの指定が全て（all）の時
	{
// 2022cvt_015
		A_pactid = Array();
// 2022cvt_015
		var dirh = fs.readdirSync(dataDir);
		// var dirh = openDir(dataDir);// 2022cvt_004

		if (pactid == "all") //処理する契約ＩＤを取得する
			//契約ＩＤが指定されている場合
			{

				for (var fileName of dirh)
				// while (fileName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
				{
					if (fs.existsSync(dataDir + "/" + fileName) == true && fileName != "." && fileName != "..") {// 2022cvt_003
						A_pactid.push(fileName);
					}

// 					clearstatcache();// 2022cvt_012
				}
			} else {
			A_pactid.push(pactid);
		}

		// closedir(dirh);
	}

lock(true);
// 2022cvt_015
var H_Format = {
	[TUUSIN_MEISAI_KUBUN]: {
		telno: {
			start: 32,
			length: 20
		},
		bunrui: {
			start: 52,
			length: 1
		},
		syubetu: {
			start: 53,
			length: 2
		},
		totelno: {
			start: 76,
			length: 20
		},
		date: {
			start: 96,
			length: 8
		},
		time: {
			start: 104,
			length: 6
		},
		tuwajikan: {
			start: 111,
			length: 8
		},
		fromplace: {
			start: 119,
			length: 10
		},
		toplace: {
			start: 129,
			length: 10
		},
		charge: {
			start: 182,
			length: 11
		}
	},
	[WARIBIKI_MEISAI_KUBUN]: {
		telno: {
			start: 32,
			length: 20
		},
		utiwake: {
			start: 92,
			length: 6
		},
		charge: {
			start: 124,
			length: 11
		},
		tax_kubun: {
			start: 135,
			length: 1
		},
		tekiyou: {
			start: 136,
			length: 2
		}
	},
	[KIHON_KOUJI_KUBUN]: {
		telno: {
			start: 32,
			length: 20
		},
		utiwake: {
			start: 52,
			length: 10
		},
		charge: {
			start: 62,
			length: 11
		},
		tax_kubun: {
			start: 73,
			length: 1
		},
		tekiyou: {
			start: 74,
			length: 2
		}
	},
	[TOUGOU_SEIKYUU_KUBUN]: {
		telno: {
			start: 32,
			length: 20
		},
		utiwake: {
			start: 88,
			length: 10
		},
		charge: {
			start: 117,
			length: 11
		},
		tax_kubun: {
			start: 128,
			length: 1
		},
		riyou_kaishi: {
			start: 72,
			length: 8
		},
		riyou_syuuryou: {
			start: 80,
			length: 8
		}
	},
	[KONTENTU_MEISAI_KUBUN]: {
		telno: {
			start: 32,
			length: 20
		},
		utiwake: {
			start: 113,
			length: 4
		},
		charge: {
			start: 117,
			length: 11
		},
		tax_kubun: {
			start: 128,
			length: 1
		},
		riyou_kaishi: {
			start: 72,
			length: 8
		},
		riyou_syuuryou: {
			start: 80,
			length: 8
		}
	},
	[TUUSIN_KOKUNAI_KUBUN]: {
		telno: {
			start: 32,
			length: 20
		},
		charge: {
			start: 81,
			length: 11
		},
		waribiki: {
			start: 114,
			length: 11
		},
		kihon_kouji: {
			start: 125,
			length: 11
		},
		tax_taisyou_charge: {
			start: 147,
			length: 11
		}
	},
	[TUUSIN_KOKUSAI_KUBUN]: {
		telno: {
			start: 32,
			length: 20
		},
		charge: {
			start: 81,
			length: 11
		}
	},
	[BANGOU_SYOUKEI_KUBUN]: {
		telno: {
			start: 32,
			length: 20
		},
		charge: {
			start: 52,
			length: 11
		}
	},
	[ACCOUNT_MEISAI_KUBUN]: {
		utiwake: {
			start: 12,
			length: 10
		},
		charge: {
			start: 22,
			length: 11
		}
	},
	[SEIKYUU_GOUKEI_KUBUN]: {
		tougetu: {
			start: 53,
			length: 11
		},
		tax_charge: {
			start: 64,
			length: 11
		},
		kurikoshi: {
			start: 75,
			length: 11
		},
		tyousei: {
			start: 86,
			length: 11
		},
		entai: {
			start: 97,
			length: 11
		},
		jyuutou: {
			start: 108,
			length: 11
		},
		seikyuu: {
			start: 119,
			length: 11
		}
	}
};
// 2022cvt_015
var H_TaxMaster = {
	"0": "課税",
	"1": "非課税"
};
// 2022cvt_015
var H_ServiceBunrui = {
	A: "0077市内電話サービス",
	B: "0077市外電話サービス",
	T: "001国際電話サービス",
	K: "001国内電話サービス",
	R: "国際無線電話サービス",
	M: "海外衛星電話サービス",
	H: "空港衛星電話サービス",
	D: "海外HSDサービス",
	Z: "DODサービス"
};
// 2022cvt_015
var H_ServiceSyubetsu = {
	"01": "パーソナルコール",
	"02": "0077アクセスコール",
	"03": "23フリーコール",
	"04": "クレジットコール",
	"05": "0077フリーコールDX/S",
	"06": "0070フリーフォン",
	"08": "カスタマコントロール",
	"09": "国際ローミング",
	"10": "国際プリペイド",
	"11": "0120アクセスコール",
	"12": "0120フリーコールDX/S",
	B: "エコノミー電話（再販事業者向）",
	C: "発信自動クレジット通話(SWC)",
	D: "エコノミー電話（個人向）",
	E: "内線接続",
	H: "テレクレジット通話",
	I: "0053リビリング",
	J: "IODC(発着)",
	M: "GN経由WAC",
	P: "バーネット",
	R: "IDAC(発着)",
	T: "ITFC(発着)",
	W: "WAC",
	Y: "第三者課金通話",
	"△": "その他"
};
// 2022cvt_015
var H_TekiyouTuusinKubunWaribiki = {
	"10": "市内",
	"20": "市外",
	"23": "PHS着",
	"24": "au着",
	"25": "au以外着",
	"2A": "移動体発",
	"30": "FC-DX",
	"31": "FC-DX電話発電話着",
	"32": "FC-DX電話発DL着",
	"36": "FC-DX携帯発電話着",
	"37": "FC-DX携帯発DL着",
	"38": "FC-DXPHS発電話着",
	"39": "FC-DXPHS発DL着",
	"3B": "FC-DX電話発IP電話着",
	"3C": "FC-DX携帯発IP電話着",
	"3D": "FC-DXPHS発IP電話着",
	"41": "ﾌﾘｰﾌｫﾝ電話発電話着",
	"42": "ﾌﾘｰﾌｫﾝ電話発DL着",
	"46": "ﾌﾘｰﾌｫﾝ携帯発電話着",
	"47": "ﾌﾘｰﾌｫﾝ携帯発DL着",
	"48": "ﾌﾘｰﾌｫﾝPHS発電話着",
	"49": "ﾌﾘｰﾌｫﾝPHS発DL着",
	"4B": "ﾌﾘｰﾌｫﾝ電話発IP電話着",
	"4C": "ﾌﾘｰﾌｫﾝ携帯発IP電話着",
	"4D": "ﾌﾘｰﾌｫﾝPHS発IP電話着",
	"52": "23ﾌﾘｰｺｰﾙ電話発DL着",
	"5B": "23ﾌﾘｰｺｰﾙ電話発IP電話着",
	"5C": "23ﾌﾘｰｺｰﾙ携帯発IP電話着",
	"5D": "23ﾌﾘｰｺｰﾙPHS発IP電話着",
	"60": "国内DOD(ｲﾝﾄﾗ)",
	"70": "国内DOD(ｱﾐｭｰｽﾞﾒﾝﾄ)",
	"80": "国際",
	"90": "au特別ﾀﾘﾌ",
	"A0": "国内DODパックF"
};
// 2022cvt_015
var H_TekiyouTuusinKubun = {
	"20": "国内",
	"80": "国際"
};
// 2022cvt_015
var H_Result = await dbh.getHash("select pactid,compname from pact_tb order by pactid", true);
// 2022cvt_015
var pactCnt = H_Result.length;

// 2022cvt_015
var H_Pactid = Array();
for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) {
	H_Pactid[H_Result[pactCounter].pactid] = H_Result[pactCounter].compname;
}

H_Result = await dbh.getHash("select code,name from utiwake_tb where carid = " + G_CARRIER_KDDI_KOTEI + "order by code", true);
// 2022cvt_015
var codeCnt = H_Result.length;
// 2022cvt_015
var H_Code = Array();

// 2022cvt_015
for (var codeCounter = 0; codeCounter < codeCnt; codeCounter++) //内訳コードマスターを作成
{
	H_Code[H_Result[codeCounter].code] = H_Result[codeCounter].name;
}

// 2022cvt_015
var O_tableNo = new TableNo();
// 2022cvt_015
var tableNo = O_tableNo.get(year, month);
// 2022cvt_015
var tel_tb = "tel_tb";
// 2022cvt_015
var postrel_tb = "post_relation_tb";
// 2022cvt_015
var telX_tb = "tel_" + tableNo + "_tb";
// 2022cvt_015
var postX_tb = "post_" + tableNo + "_tb";
// 2022cvt_015
var postrelX_tb = "post_relation_" + tableNo + "_tb";
// 2022cvt_015
var teldetails_tb = "tel_details_" + tableNo + "_tb";
// 2022cvt_015
var dummytel_tb = "dummy_tel_tb";
// 2022cvt_015
var commhistory_tb = "commhistory_" + tableNo + "_tb";
pactCnt = A_pactid.length;
A_pactid.sort();
// 2022cvt_015
var A_pactDone = Array();
// 2022cvt_015
var teldetailsFile = dataDir + "/" + teldetails_tb + year + month + pactid + ".ins";
// 2022cvt_015
var telFile = dataDir + "/" + tel_tb + year + month + pactid + ".ins";
// 2022cvt_015
var telXFile = dataDir + "/" + telX_tb + year + month + pactid + ".ins";
// 2022cvt_015
var commhistoryFile = dataDir + "/" + commhistory_tb + year + month + pactid + ".ins";
// 2022cvt_015
var fp_teldetails = fs.openSync(teldetailsFile, "w");
// var fp_teldetails = fopen(teldetailsFile, "w");
// 2022cvt_015
var fp_tel = fs.openSync(telFile, "w");
// var fp_tel = fopen(telFile, "w");
// 2022cvt_015
var fp_telX = fs.openSync(telXFile, "w");
// var fp_telX = fopen(telXFile, "w");
// 2022cvt_015
var fp_commhistory = fs.openSync(commhistoryFile, "w");
// var fp_commhistory = fopen(commhistoryFile, "w");
// 2022cvt_015
var now = getTimestamp();

for (pactCounter = 0; pactCounter < pactCnt; pactCounter++) //請求データディレクトリにある契約ＩＤがマスターに登録されている場合
{
	if (undefined !== H_Pactid[A_pactid[pactCounter]] == true) //処理する請求データファイル名配列
		//請求データファイル名を取得する
		//ファイル名順でソート
		//請求データファイルがなかった場合
		//請求データディレクトリにある契約ＩＤがマスターに登録されていない場合
		{
// 2022cvt_015
			var A_billFile = Array();
// 2022cvt_015
			var dataDirPact = dataDir + "/" + A_pactid[pactCounter];
			var dirh = fs.readdirSync(dataDirPact);
			// dirh = openDir(dataDirPact);// 2022cvt_004

			for (var fileName of dirh) {
			// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
				if (fs.statSync(dataDirPact + "/" + fileName).isFile()) {
				// if (is_file(dataDirPact + "/" + fileName) == true) {
					A_billFile.push(fileName);
				}

// 				clearstatcache();// 2022cvt_012
			}

			A_billFile.sort();

			if (A_billFile.length == 0) //請求データファイルがあった場合
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の請求データファイルが見つかりません");
					// closedir(dirh);
					continue;
				} else //ファイル名をキー、ファイルデータを値とした連想配列
				//ファイル名をキー、契約ＩＤを値とした連想配列
				//ファイル名をキー、請求年月を値とした連想配列
				//お客様番号をキー、マージしたファイルデータを値とした連想配列
				//お客様番号をキー、マージしたファイルデータを値とした連想配列(ダミー電話用)
				//お客様番号をキー、マージしたファイルデータを値とした連想配列(通信明細用)
				//tel_tb 登録済み電話番号リスト
				//tel_X_tb 登録済み電話番号リスト
				//tel_X_tb 登録済みのＫＤＤＩ固定以外の電話情報リスト
				//ASP利用料表示権限があるかないか ある：true、ない：false
				//ASP利用料金
				//tel_tb インポートデータファイル出力用配列
				//telX_tb インポートデータファイル出力用配列
				//tel_details_X_tb インポートデータファイル出力用配列
				//commhistory_X_tb インポートデータファイル出力用配列
				//ダミー電話番号とその電話を所属させる部署
				//お客様番号をキー、array(ダミー電話番号,部署ＩＤ)を値とした連想配列
				//お客様番号をキー、ファイル名配列を値とした連想配列
				//作業用配列
				//お客様番号数
				//お客様番号退避用変数
				//既にtel_details_X_tbに取り込まれている電話番号
				//ルート部署を取得
				//現在用
				//請求月用
				//ファイル数分処理を行う
				//お客様番号でソート
				//お客様番号数 = 取込ファイル数
				//お客様番号毎で処理する
				//お客様番号でソート
				//権限チェック 「ASP利用料表示設定」 がＯＮになっているか
				//請求月電話番号マスター作成(同一キャリアＩＤ)
				//請求月電話番号マスター作成(他キャリアＩＤで登録されている同一電話番号は登録情報を引き継ぐ)
				//追加モードの場合は既に取り込み完了している電話番号を取得する
				//現在の登録電話番号数
				//請求月の電話番号数
				//異なるお客様番号ファイルのどれかにしか存在しない電話番号（ユニーク）
				//異なるお客様番号ファイルに重複して存在している電話番号をキー、
				//明細番号(detailno)を値にした連想配列
				//tel_tb へ追加する電話番号
				//tel_X_tb へ追加する電話番号
				//お客様番号毎で処理する
				//出力件数用変数初期化
				//tel_tb ファイル出力
				//バッファ出力
				//tel_X_tb ファイル出力
				//バッファ出力
				//tel_details_X_tb ファイル出力
				//バッファ出力
				//commhistory_X_tb ファイル出力
				//バッファ出力
				//正常処理が終わった pactid のみリストに追加
				{
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + A_pactid[pactCounter] + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + LOG_DELIM + year + month + LOG_DELIM + A_billFile.join(","));
// 2022cvt_015
					var H_FileData = Array();
// 2022cvt_015
					var H_filePact = Array();
// 2022cvt_015
					var H_fileBillDate = Array();
// 2022cvt_015
					var H_MargeData = Array();
// 2022cvt_015
					var H_MargeDataDummy = Array();
// 2022cvt_015
					var H_MargeDataTuusin = Array();
// 2022cvt_015
					var A_telno = Array();
// 2022cvt_015
					var A_telnoX = Array();
// 2022cvt_015
					var H_telnoXAnother = Array();
// 2022cvt_015
					var aspFlg = false;
// 2022cvt_015
					var aspCharge = 0;
// 2022cvt_015
					var A_telOutputBuff = Array();
// 2022cvt_015
					var A_telXOutputBuff = Array();
// 2022cvt_015
					var A_teldetailsOutputBuff = Array();
// 2022cvt_015
					var A_commhistoryOutputBuff = Array();
// 2022cvt_015
					var H_DummyData = Array();
// 2022cvt_015
					var H_DummyTel = "";
// 2022cvt_015
					var H_kokyakuno = Array();
// 2022cvt_015
					var A_tmp = Array();
// 2022cvt_015
					var multifileCnt = 0;
// 2022cvt_015
					var old_kokyakuno = "";
// 2022cvt_015
					var A_uniqTelnoX = Array();
// 2022cvt_015
					var rootPostid = getRootPostid(A_pactid[pactCounter], postrel_tb);
// 2022cvt_015
					var rootPostidX = getRootPostid(A_pactid[pactCounter], postrelX_tb);

// 2022cvt_015
					for (var fileCounter = 0; fileCounter < A_billFile.length; fileCounter++) //請求年月チェック
					//レコードサイズチェック
					//お客様番号がキーとして存在していない場合
					//契約ＩＤチェック
					{
						if (undefined !== H_fileBillDate[A_billFile[fileCounter]] == false) //パラメータの請求年月とファイル名の請求年月が違う場合
							{
								if (A_billFile[fileCounter].substring(4, 6) != new Date(year, month, 1, 0, 0, 0).toJSON().slice(0, 8).replace(/-/g, ''))
								// if (A_billFile[fileCounter].substr(4, 6) != date("Ym", mktime(0, 0, 0, month, 1, year))) //エラーとなった契約ＩＤはとばすが処理は続ける
									{
										logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の請求データファイル（" + dataDirPact + "/" + A_billFile[fileCounter] + "）請求年月が不正です");
										continue;
									}

								H_fileBillDate[A_billFile[fileCounter]] = A_billFile[fileCounter].substring(4, 6);
							}

						H_FileData[A_billFile[fileCounter]] = fs.readFileSync(dataDirPact + "/" + A_billFile[fileCounter]).toString().split("\r\n");
						// H_FileData[A_billFile[fileCounter]] = file(dataDirPact + "/" + A_billFile[fileCounter]);

						if (LINESIZE != H_FileData[A_billFile[fileCounter]][0].length)
						// if (LINESIZE != rtrim(H_FileData[A_billFile[fileCounter]][0], "\r\n").length) //エラーとなった契約ＩＤはとばすが処理は続ける
							{
								logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の請求データファイル（" + dataDirPact + "/" + A_billFile[fileCounter] + "）のフォーマットが不正です");
								continue;
							}

// 2022cvt_015
						for (var lineCounter = 0; lineCounter < H_FileData[A_billFile[fileCounter]].length; lineCounter++) //レコード区分が「１０」のレコードを検索(複数ある場合も最初の１個のみ取得)
						{
							if (ACCOUNT_HEADER_KUBUN == H_FileData[A_billFile[fileCounter]][lineCounter].substring(KUBUN_START, KUBUN_LENGTH)) {
// 2022cvt_015
								var account = H_FileData[A_billFile[fileCounter]][lineCounter].substring(2, 10);
								break;
							}
						}

						if (undefined !== H_kokyakuno[account] == false) //お客様番号をキー、ファイル名配列を値とした連想配列
							//お客様番号が既にキーとして存在している場合
							{
								H_kokyakuno[account] = [A_billFile[fileCounter]];
							} else //お客様番号をキー、ファイル名配列を値とした連想配列
							{
								H_kokyakuno[account].push(A_billFile[fileCounter]);
							}

						if (undefined !== H_filePact[A_billFile[fileCounter]] == false) //お客様番号からpactidを取得しセットする
							//pactid が見つからなかった場合
							{
// 2022cvt_015
								var sql = "select pactid from bill_prtel_tb where carid = " + G_CARRIER_KDDI_KOTEI + " " + "and prtelno = '" + account + "'";
								H_filePact[A_billFile[fileCounter]] = dbh.getOne(sql, true);

								if (H_filePact[A_billFile[fileCounter]] == "") //エラーとなった契約ＩＤはとばすが処理は続ける
									{
										logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の請求データファイル（" + dataDirPact + "/" + A_billFile[fileCounter] + "）のお客様番号（" + account + "）が見つかりません");
										continue;
									}

								if (H_filePact[A_billFile[fileCounter]] != A_pactid[pactCounter]) //エラーとなった契約ＩＤはとばすが処理は続ける
									{
										logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の請求データファイル（" + dataDirPact + "/" + A_billFile[fileCounter] + "）契約ＩＤが不正です");
										continue;
									}
							}
					}

					H_kokyakuno.sort();
					// asort(H_kokyakuno);
					multifileCnt = Object.keys(H_kokyakuno).length;

					var A_exceptTelno = Array();

// 2022cvt_015
					for (var kokyakuno of Object.keys(H_kokyakuno)) //お客様番号が切り替わった時の処理
					//END ファイル毎で処理する
					//番号毎の小計（区分：３９）が０円なのに請求明細がある場合は、請求明細を除外する 2010/9/9 s.maeda
					//請求データ（$H_MargeData)から除外
					//会社請求データ（$H_MargeDataDummy）にはダミー番号しか入らないはずなので除外
					//通信明細データ（$H_MargeDataTuusin）も本来なら削除すべきだが、レコード件数が多いので問題が発生しない限り、
					//そのままとした。（請求が無い限り表示されないはず）
					//請求データの件数を取得
					//請求データを１件ずつ処理する
					//END 番号毎の小計（区分：３９）が０円なのに請求明細がある場合は、請求明細を除外する 2010/9/9 s.maeda
					//お客様番号を退避
					{
						if (old_kokyakuno != "" && old_kokyakuno != kokyakuno) //初期化
							//ファイル名をキー、契約ＩＤを値とした連想配列
							{
								H_filePact = Array();
							}

// 2022cvt_015
						for (var filename of H_kokyakuno[kokyakuno]) //番号毎の小計（区分：３９）が０円なのに請求明細がある場合は、請求明細を除外する 2010/9/9 s.maeda
						//１行ずつ処理する
						//END １行ずつ処理する
						{
// 2022cvt_015
							A_exceptTelno = Array();

							for (lineCounter = 0; lineCounter < H_FileData[filename].length; lineCounter++) //初期化
							//$A_tmp = array();
							//ダミー電話番号を未取得の場合
							//初期化
							//区分毎の処理
							{
								if (undefined !== H_DummyTel[kokyakuno] == false) //pactidとお客様番号をもとにダミー電話番号とダミー電話番号用部署ＩＤを取得する
									//ダミー電話番号が設定されていない場合
									{
										H_DummyData = await getDummy(A_pactid[pactCounter], kokyakuno);

										if (H_DummyData.length == 0) //エラーとなった契約ＩＤはとばすが処理は続ける
											//ダミー電話番号が設定されていた場合
											{
												logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の請求データファイル（" + dataDirPact + "/" + filename + "）のダミー電話番号が設定されていません");
												continue;
											} else //お客様番号が１つの場合
											{
												if (multifileCnt == 1) //ダミー電話番号を所属させる部署ＩＤが指定されていない場合
													//複数一括取り込みの場合
													{
														if (H_DummyData[0].postid == "") //ダミー電話番号とダミー電話番号を所属させる部署ＩＤ(ルート部署ＩＤ)
															//ダミー電話番号を所属させる部署ＩＤが指定されている場合
															{
																H_DummyTel[kokyakuno] = [H_DummyData[0].telno, rootPostidX];
															} else //ダミー電話番号とダミー電話番号を所属させる部署ＩＤ
															{
																H_DummyTel[kokyakuno] = [H_DummyData[0].telno, H_DummyData[0].postid];
															}
													} else //ダミー電話番号を所属させる部署ＩＤが指定されていない場合
													//代りにルート部署を設定するのではなくＷＡＲＮＩＮＧ扱いとする
													{
														if (H_DummyData[0].postid == "") //エラーとなった契約ＩＤはとばすが処理は続ける
															{
																logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の請求データファイル（" + dataDirPact + "/" + filename + "）のダミー電話番号（" + H_DummyData[0].telno + "）の所属部署ＩＤが設定されていません");
																continue;
															} else //ダミー電話番号とダミー電話番号を所属させる部署ＩＤ
															{
																H_DummyTel[kokyakuno] = [H_DummyData[0].telno, H_DummyData[0].postid];
															}
													}
											}
									}

// 2022cvt_015
								var kubun = H_FileData[filename][lineCounter].substring(KUBUN_START, KUBUN_LENGTH);
// 2022cvt_015
								var telno_view = "";
								var telno = "";
								var utiwake_code = "";
								var charge = "";
								var tax_kubun = "";
								var comment = "";
// 2022cvt_015
								var tax_taisyou_charge = "";
								var tougetu = "";
								var tax_charge = "";
								var kurikoshi = "";
								var tyousei = "";
								var entai = "";
								var jyuutou = "";
								var seikyuu = "";
// 2022cvt_015
								var bunrui = "";
								var syubetu = "";
								var totelno = "";
								var date = "";
								var time = "";
								var tuwajikan = "";
								var fromplace = "";
								var toplace = "";

								var kihon_kouji = 0;
								var waribiki = 0;

								switch (kubun) {
									case TUUSIN_MEISAI_KUBUN:
// 2022cvt_020
										telno = H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_MEISAI_KUBUN].telno.start, H_Format[TUUSIN_MEISAI_KUBUN].telno.length).trimEnd().replace("-", "");
										// telno = str_replace("-", "", rtrim(H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].telno.start, H_Format[TUUSIN_MEISAI_KUBUN].telno.length), " "));

										if ("" != H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_MEISAI_KUBUN].bunrui.start, H_Format[TUUSIN_MEISAI_KUBUN].bunrui.length).trimEnd()) {
										// if ("" != rtrim(H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].bunrui.start, H_Format[TUUSIN_MEISAI_KUBUN].bunrui.length), " ")) {
											bunrui = H_ServiceBunrui[H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_MEISAI_KUBUN].bunrui.start, H_Format[TUUSIN_MEISAI_KUBUN].bunrui.length)];
										}

										if ("" != H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_MEISAI_KUBUN].syubetu.start, H_Format[TUUSIN_MEISAI_KUBUN].syubetu.length).trimEnd()) {
											syubetu = H_ServiceSyubetsu[H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_MEISAI_KUBUN].syubetu.start, H_Format[TUUSIN_MEISAI_KUBUN].syubetu.length).trim()];
										}

										totelno = H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_MEISAI_KUBUN].totelno.start, H_Format[TUUSIN_MEISAI_KUBUN].totelno.length).trimEnd();
										date = H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_MEISAI_KUBUN].date.start, H_Format[TUUSIN_MEISAI_KUBUN].date.length);
										time = H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_MEISAI_KUBUN].time.start, H_Format[TUUSIN_MEISAI_KUBUN].time.length);
										tuwajikan = H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_MEISAI_KUBUN].tuwajikan.start, H_Format[TUUSIN_MEISAI_KUBUN].tuwajikan.length);
										fromplace = H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_MEISAI_KUBUN].fromplace.start, H_Format[TUUSIN_MEISAI_KUBUN].fromplace.length).trimEnd();
										toplace = H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].toplace.start, H_Format[TUUSIN_MEISAI_KUBUN].toplace.length).trimEnd();
										charge = (H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_MEISAI_KUBUN].charge.start, H_Format[TUUSIN_MEISAI_KUBUN].charge.length) / 100).toString();
										break;

									case WARIBIKI_MEISAI_KUBUN:
										telno_view = H_FileData[filename][lineCounter].substr(H_Format[WARIBIKI_MEISAI_KUBUN].telno.start, H_Format[WARIBIKI_MEISAI_KUBUN].telno.length).trimEnd();
// 2022cvt_020
										telno = telno_view.replace("-", "");
										// telno = str_replace("-", "", telno_view);
										utiwake_code = WARIBIKI_MEISAI_KUBUN + "-" + H_FileData[filename][lineCounter].substring(H_Format[WARIBIKI_MEISAI_KUBUN].utiwake.start, H_Format[WARIBIKI_MEISAI_KUBUN].utiwake.length);
										charge = (H_FileData[filename][lineCounter].substring(H_Format[WARIBIKI_MEISAI_KUBUN].charge.start, H_Format[WARIBIKI_MEISAI_KUBUN].charge.length) * -1).toString();
										tax_kubun = H_TaxMaster[H_FileData[filename][lineCounter].substring(H_Format[WARIBIKI_MEISAI_KUBUN].tax_kubun.start, H_Format[WARIBIKI_MEISAI_KUBUN].tax_kubun.length)];
										comment = H_TekiyouTuusinKubunWaribiki[H_FileData[filename][lineCounter].substring(H_Format[WARIBIKI_MEISAI_KUBUN].tekiyou.start, H_Format[WARIBIKI_MEISAI_KUBUN].tekiyou.length)];
										break;

									case KIHON_KOUJI_KUBUN:
										telno_view = H_FileData[filename][lineCounter].substr(H_Format[KIHON_KOUJI_KUBUN].telno.start, H_Format[KIHON_KOUJI_KUBUN].telno.length).trimEnd();
// 2022cvt_020
										telno = telno_view.replace("-", "");
										// telno = str_replace("-", "", telno_view);
										utiwake_code = KIHON_KOUJI_KUBUN + "-" + H_FileData[filename][lineCounter].substring(H_Format[KIHON_KOUJI_KUBUN].utiwake.start, H_Format[KIHON_KOUJI_KUBUN].utiwake.length);
										charge = (H_FileData[filename][lineCounter].substring(H_Format[KIHON_KOUJI_KUBUN].charge.start, H_Format[KIHON_KOUJI_KUBUN].charge.length) * 1).toString();
										tax_kubun = H_TaxMaster[H_FileData[filename][lineCounter].substring(H_Format[KIHON_KOUJI_KUBUN].tax_kubun.start, H_Format[KIHON_KOUJI_KUBUN].tax_kubun.length)];
										comment = H_TekiyouTuusinKubun[H_FileData[filename][lineCounter].substring(H_Format[KIHON_KOUJI_KUBUN].tekiyou.start, H_Format[KIHON_KOUJI_KUBUN].tekiyou.length)];
										break;

									case TOUGOU_SEIKYUU_KUBUN:
										telno_view = H_FileData[filename][lineCounter].substr(H_Format[TOUGOU_SEIKYUU_KUBUN].telno.start, H_Format[TOUGOU_SEIKYUU_KUBUN].telno.length).trimEnd();
// 2022cvt_020
										telno = telno_view.replace("-", "");
										// telno = str_replace("-", "", telno_view);
										utiwake_code = TOUGOU_SEIKYUU_KUBUN + "-" + H_FileData[filename][lineCounter].substring(H_Format[TOUGOU_SEIKYUU_KUBUN].utiwake.start, H_Format[TOUGOU_SEIKYUU_KUBUN].utiwake.length);
										charge = (H_FileData[filename][lineCounter].substring(H_Format[TOUGOU_SEIKYUU_KUBUN].charge.start, H_Format[TOUGOU_SEIKYUU_KUBUN].charge.length) * 1).toString();
										tax_kubun = H_TaxMaster[H_FileData[filename][lineCounter].substring(H_Format[TOUGOU_SEIKYUU_KUBUN].tax_kubun.start, H_Format[TOUGOU_SEIKYUU_KUBUN].tax_kubun.length)];
										comment = "ご利用期間 ";
										comment += H_FileData[filename][lineCounter].substring(H_Format[TOUGOU_SEIKYUU_KUBUN].riyou_kaishi.start, H_Format[TOUGOU_SEIKYUU_KUBUN].riyou_kaishi.length);
										comment += "～" + H_FileData[filename][lineCounter].substring(H_Format[TOUGOU_SEIKYUU_KUBUN].riyou_syuuryou.start, H_Format[TOUGOU_SEIKYUU_KUBUN].riyou_syuuryou.length);
										break;

									case KONTENTU_MEISAI_KUBUN:
										telno_view = H_FileData[filename][lineCounter].substring(H_Format[KONTENTU_MEISAI_KUBUN].telno.start, H_Format[KONTENTU_MEISAI_KUBUN].telno.length).trimEnd();
// 2022cvt_020
										telno = telno_view.replace("-", "");
										// telno = str_replace("-", "", telno_view);
										utiwake_code = KONTENTU_MEISAI_KUBUN + "-" + H_FileData[filename][lineCounter].substring(H_Format[KONTENTU_MEISAI_KUBUN].utiwake.start, H_Format[KONTENTU_MEISAI_KUBUN].utiwake.length);
										charge = (H_FileData[filename][lineCounter].substring(H_Format[KONTENTU_MEISAI_KUBUN].charge.start, H_Format[KONTENTU_MEISAI_KUBUN].charge.length) * 1).toString();
										tax_kubun = H_TaxMaster[H_FileData[filename][lineCounter].substring(H_Format[KONTENTU_MEISAI_KUBUN].tax_kubun.start, H_Format[KONTENTU_MEISAI_KUBUN].tax_kubun.length)];
										comment = "ご利用期間 ";
										comment += H_FileData[filename][lineCounter].substring(H_Format[KONTENTU_MEISAI_KUBUN].riyou_kaishi.start, H_Format[KONTENTU_MEISAI_KUBUN].riyou_kaishi.length);
										comment += "～" + H_FileData[filename][lineCounter].substring(H_Format[KONTENTU_MEISAI_KUBUN].riyou_syuuryou.start, H_Format[KONTENTU_MEISAI_KUBUN].riyou_syuuryou.length);
										break;

									case TUUSIN_KOKUNAI_KUBUN:
										telno_view = H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_KOKUNAI_KUBUN].telno.start, H_Format[TUUSIN_KOKUNAI_KUBUN].telno.length).trimEnd();
// 2022cvt_020
										telno = telno_view.replace("-", "");
										// telno = str_replace("-", "", telno_view);
										utiwake_code = KOKUNAI_KAZEI;
										charge = (H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_KOKUNAI_KUBUN].charge.start, H_Format[TUUSIN_KOKUNAI_KUBUN].charge.length) * 1).toString();
// 2022cvt_015
										waribiki = H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_KOKUNAI_KUBUN].waribiki.start, H_Format[TUUSIN_KOKUNAI_KUBUN].waribiki.length) * 1;
// 2022cvt_015
										kihon_kouji = H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_KOKUNAI_KUBUN].kihon_kouji.start, H_Format[TUUSIN_KOKUNAI_KUBUN].kihon_kouji.length) * 1;
										tax_taisyou_charge = (H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_KOKUNAI_KUBUN].tax_taisyou_charge.start, H_Format[TUUSIN_KOKUNAI_KUBUN].tax_taisyou_charge.length) * 1).toString();
										tax_kubun = H_TaxMaster[0];
										break;

									case TUUSIN_KOKUSAI_KUBUN:
										telno_view = H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_KOKUSAI_KUBUN].telno.start, H_Format[TUUSIN_KOKUSAI_KUBUN].telno.length).trimEnd();
// 2022cvt_020
										telno = telno_view.replace("-", "");
										// telno = str_replace("-", "", telno_view);
										utiwake_code = KOKUSAI;
										charge = (H_FileData[filename][lineCounter].substring(H_Format[TUUSIN_KOKUSAI_KUBUN].charge.start, H_Format[TUUSIN_KOKUSAI_KUBUN].charge.length) * 1).toString();
										tax_kubun = H_TaxMaster[1];
										break;

									case BANGOU_SYOUKEI_KUBUN:
										telno_view = H_FileData[filename][lineCounter].substr(H_Format[BANGOU_SYOUKEI_KUBUN].telno.start, H_Format[BANGOU_SYOUKEI_KUBUN].telno.length).trimEnd();
// 2022cvt_020
										telno = telno_view.replace("-", "");
										// telno = str_replace("-", "", telno_view);
										charge = (H_FileData[filename][lineCounter].substring(H_Format[BANGOU_SYOUKEI_KUBUN].charge.start, H_Format[BANGOU_SYOUKEI_KUBUN].charge.length) * 1).toString();
										break;

									case ACCOUNT_MEISAI_KUBUN:
										telno = telno_view = H_DummyTel[kokyakuno][0];
										utiwake_code = ACCOUNT_MEISAI_KUBUN + "-" + H_FileData[filename][lineCounter].substring(H_Format[ACCOUNT_MEISAI_KUBUN].utiwake.start, H_Format[ACCOUNT_MEISAI_KUBUN].utiwake.length);
										charge = (H_FileData[filename][lineCounter].substring(H_Format[ACCOUNT_MEISAI_KUBUN].charge.start, H_Format[ACCOUNT_MEISAI_KUBUN].charge.length) * 1).toString();
										break;

									case SEIKYUU_GOUKEI_KUBUN:
										telno = telno_view = H_DummyTel[kokyakuno][0];
										tougetu = (H_FileData[filename][lineCounter].substring(H_Format[SEIKYUU_GOUKEI_KUBUN].tougetu.start, H_Format[SEIKYUU_GOUKEI_KUBUN].tougetu.length) * 1).toString();
										tax_charge = (H_FileData[filename][lineCounter].substring(H_Format[SEIKYUU_GOUKEI_KUBUN].tax_charge.start, H_Format[SEIKYUU_GOUKEI_KUBUN].tax_charge.length) * 1).toString();
										kurikoshi = (H_FileData[filename][lineCounter].substring(H_Format[SEIKYUU_GOUKEI_KUBUN].kurikoshi.start, H_Format[SEIKYUU_GOUKEI_KUBUN].kurikoshi.length) * 1).toString();
										tyousei = (H_FileData[filename][lineCounter].substring(H_Format[SEIKYUU_GOUKEI_KUBUN].tyousei.start, H_Format[SEIKYUU_GOUKEI_KUBUN].tyousei.length) * 1).toString();
										entai = (H_FileData[filename][lineCounter].substring(H_Format[SEIKYUU_GOUKEI_KUBUN].entai.start, H_Format[SEIKYUU_GOUKEI_KUBUN].entai.length) * 1).toString();
										jyuutou = (H_FileData[filename][lineCounter].substring(H_Format[SEIKYUU_GOUKEI_KUBUN].jyuutou.start, H_Format[SEIKYUU_GOUKEI_KUBUN].jyuutou.length) * 1).toString();
										seikyuu = (H_FileData[filename][lineCounter].substring(H_Format[SEIKYUU_GOUKEI_KUBUN].seikyuu.start, H_Format[SEIKYUU_GOUKEI_KUBUN].seikyuu.length) * 1).toString();
										break;

									default:
										break;
								}

								if (-1 !== Object.keys(H_Format).indexOf(kubun) == true) //番号毎の小計（区分：３９）が０円なのに請求明細がある場合は、請求明細を除外する 2010/9/9 s.maeda
									//請求合計区分、番号毎の小計区分以外で料金が０円の場合はスキップする
									{
										if (SEIKYUU_GOUKEI_KUBUN != kubun && BANGOU_SYOUKEI_KUBUN != kubun && "0" == charge) //番号毎の小計区分の場合
											{
												continue;
											} else if (BANGOU_SYOUKEI_KUBUN == kubun) //料金が０円の場合
											{
												if ("0" == charge) //除外する電話番号リストに追加する
													{
														A_exceptTelno.push(telno);
													}

												continue;
											}

										if (undefined !== H_MargeData[kokyakuno] == false) {
											H_MargeData[kokyakuno] = Array();
											H_MargeDataDummy[kokyakuno] = Array();
											H_MargeDataTuusin[kokyakuno] = Array();
										}

										if (TUUSIN_KOKUNAI_KUBUN == kubun) //課税対象分（基本料／工事料を除く）
											//割引額が発生している場合
											{
												H_MargeData[kokyakuno].push([telno, telno_view, KOKUNAI_KAZEI, parseInt(tax_taisyou_charge) - kihon_kouji, "", H_TaxMaster[0]]);

												if (waribiki != 0) //割引額
													{
														H_MargeData[kokyakuno].push([telno, telno_view, KOKUNAI_KAZEI_WARIBIKI, waribiki, "", H_TaxMaster[0]]);
													}
											} else if (ACCOUNT_MEISAI_KUBUN == kubun) //区分が請求合計の場合の処理
											{
												H_MargeDataDummy[kokyakuno].push([telno, telno_view, utiwake_code, charge, "", ""]);
											} else if (SEIKYUU_GOUKEI_KUBUN == kubun) //消費税
											{
												if ("0" != tax_charge) {
													H_MargeDataDummy[kokyakuno].push([telno, telno_view, TAX, tax_charge, "", ""]);
												}

												if ("0" != kurikoshi) {
													H_MargeDataDummy[kokyakuno].push([telno, telno_view, KURIKOSHI, kurikoshi, "", ""]);
												}

												if ("0" != tyousei) {
													H_MargeDataDummy[kokyakuno].push([telno, telno_view, TYOUSEI, tyousei, "", ""]);
												}

												if ("0" != entai) {
													H_MargeDataDummy[kokyakuno].push([telno, telno_view, ENTAIRISOKU, entai, "", ""]);
												}

												if ("0" != jyuutou) {
													H_MargeDataDummy[kokyakuno].push([telno, telno_view, JYUUTOU, jyuutou, "", ""]);
												}

												if ("0" != seikyuu) {
													H_MargeDataDummy[kokyakuno].push([telno, telno_view, SEIKYUU, seikyuu, "", ""]);
												}
											} else if (TUUSIN_MEISAI_KUBUN == kubun) //区分が国内通信・請求合計以外、または国内通信全てが課税対象の場合の処理
											{
// 2022cvt_015
												var timestamp = date.substring(0, 4) + "-" + date.substring(4, 2) + "-" + date.substring(6, 2) + " " + time.substring(0, 2) + ":" + time.substring(2, 2) + ":" + time.substring(4, 2);
// 2022cvt_015
												var tuwajikan_formated = tuwajikan.substring(0, 3) + ":" + tuwajikan.substring(3, 2) + ":" + tuwajikan.substring(5, 2) + "." + tuwajikan.substring(7, 1);
												H_MargeDataTuusin[kokyakuno].push([telno, bunrui, syubetu, totelno, timestamp, tuwajikan_formated, fromplace, toplace, charge]);
											} else {
											H_MargeData[kokyakuno].push([telno, telno_view, utiwake_code, charge, comment, tax_kubun]);
										}
									}
							}
						}

// 2022cvt_015
						var dataCnt = H_MargeData[kokyakuno].length;

// 2022cvt_015
						for (var cnt = 0; cnt < dataCnt; cnt++) //除外対象電話番号かをチェック
						{
							if (-1 !== A_exceptTelno.indexOf(H_MargeData[kokyakuno][cnt][0]) == true) //除外対象なら請求データを削除する
								{
									delete H_MargeData[kokyakuno][cnt];
								}
						}

						old_kokyakuno = kokyakuno;
					}

					var keys = Object.keys(H_MargeData);
					keys.sort((a, b) => { return (a < b) ? -1 : 1 });
					// ksort(H_MargeData);

					if (await chkAsp(A_pactid[pactCounter]) == true) //ASP利用料を取得
						//ASP利用料が設定されていない場合
						{
							aspFlg = true;
							aspCharge = await getAsp(A_pactid[pactCounter]);

							if (!aspCharge)
							// if (is_null(aspCharge)) //エラーとなった契約ＩＤはとばすが処理は続ける
								{
									logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") のＫＤＤＩ固定 ＡＳＰ利用料が設定されていません");
									continue;
								}
						}

// 2022cvt_015
					var sql_str = `select telno from ${tel_tb} where pactid = ` + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_KDDI_KOTEI + " order by telno";

// 2022cvt_015
					for (var data of await dbh.getHash(sql_str, true)) {
						A_telno.push(data.telno);
					}

					sql_str = `select telno from ${telX_tb} where pactid = ` + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_KDDI_KOTEI + " order by telno";

// 2022cvt_015
					for (var data of await dbh.getHash(sql_str, true)) {
						A_telnoX.push(data.telno);
					}

					sql_str = "select postid,telno,telno_view,carid,employeecode,username," + "mail,text1,text2,text3,text4,text5,text6,text7,text8,text9,text10," + "text11,text12,text13,text14,text15,int1,int2,int3,date1,date2,memo," + "int4,int5,int6,date3,date4,date5,date6,mail1,mail2,mail3,url1,url2,url3 " + `from ${telX_tb} where pactid = ` + A_pactid[pactCounter] + " and " + "carid != " + G_CARRIER_KDDI_KOTEI + " order by telno,carid";
// 2022cvt_015
					var oldTelno = "";

// 2022cvt_015
					var int1 = "";
					var int2 = "";
					var int3 = "";
					var int4 = "";
					var int5 = "";
					var int6 = "";
					var date1 = "";
					var date2 = "";
					var date3 = "";
					var date4 = "";
					var date5 = "";
					var date6 = "";
					for (var data of await dbh.getHash(sql_str, true)) {
						if (data.telno != oldTelno) {
							if ("" == data.int1) {
// 2022cvt_015
								int1 = "\\N";
							}

							if ("" == data.int2) {
// 2022cvt_015
								int2 = "\\N";
							}

							if ("" == data.int3) {
// 2022cvt_015
								int3 = "\\N";
							}

							if ("" == data.int4) {
// 2022cvt_015
								int4 = "\\N";
							}

							if ("" == data.int5) {
// 2022cvt_015
								int5 = "\\N";
							}

							if ("" == data.int6) {
// 2022cvt_015
								int6 = "\\N";
							}

							if ("" == data.date1) {
// 2022cvt_015
								date1 = "\\N";
							}

							if ("" == data.date2) {
// 2022cvt_015
								date2 = "\\N";
							}

							if ("" == data.date3) {
// 2022cvt_015
								date3 = "\\N";
							}

							if ("" == data.date4) {
// 2022cvt_015
								date4 = "\\N";
							}

							if ("" == data.date5) {
// 2022cvt_015
								date5 = "\\N";
							}

							if ("" == data.date6) {
// 2022cvt_015
								date6 = "\\N";
							}

							H_telnoXAnother[data.telno] = {
								postid: data.postid,
								telno_view: data.telno_view,
								employeecode: data.employeecode,
								username: data.username,
								mail: data.mail,
								text1: data.text1,
								text2: data.text2,
								text3: data.text3,
								text4: data.text4,
								text5: data.text5,
								text6: data.text6,
								text7: data.text7,
								text8: data.text8,
								text9: data.text9,
								text10: data.text10,
								text11: data.text11,
								text12: data.text12,
								text13: data.text13,
								text14: data.text14,
								text15: data.text15,
								int1: int1,
								int2: int2,
								int3: int3,
								date1: date1,
								date2: date2,
								memo: data.memo,
								int4: int4,
								int5: int5,
								int6: int6,
								date3: date3,
								date4: date4,
								date5: date5,
								date6: date6,
								mail1: data.mail1,
								mail2: data.mail2,
								mail3: data.mail3,
								url1: data.url1,
								url2: data.url2,
								url3: data.url3
							};
						}

						oldTelno = data.telno;
					}

					if (mode == "a") {
						sql_str = "select distinct telno from " + teldetails_tb + " where pactid = " + A_pactid[pactCounter] + " and carid = " + G_CARRIER_KDDI_KOTEI + " order by telno";

// 2022cvt_015
						for (var data of await dbh.getHash(sql_str, true)) {
							A_uniqTelnoX.push(data.telno);
						}
					}

// 2022cvt_015
					var telCnt = A_telno.length;
// 2022cvt_015
					var telCntX = A_telnoX.length;
// 2022cvt_015
					var A_uniqTelno = Array();
// 2022cvt_015
					var H_dupliTelno = Array();
// 2022cvt_015
					var A_telAddList = Array();
// 2022cvt_015
					var A_telXAddList = Array();

// 2022cvt_015
					for (var kokyakuno of Object.keys(H_kokyakuno)) //マージ配列のソート（電話番号、内訳コード昇順）
					//ダミー電話番号データをマージする
					//ファイル出力準備
					//tel_X_tb で電話番号存在チェックしたか 未チェック：false、済み：true
					//tel_tb に電話登録する必要があるか 必要なし：false、必要あり：true
					//tel_X_tb に電話登録する必要があるか 必要なし：false、必要あり：true
					//明細行番号
					//会社単位の合計金額
					//消費税計算するために金額を集計しておく
					//電話毎に計算した消費税合計 請求データ消費税額 - $sumTax したものをダミー電話で調整する
					//電話毎の非課税対象金額
					//消費税
					//前月繰越金額
					//調整額
					//延滞金利息
					//充当料金
					//請求金額
					//電話毎のデータを処理する前にアカウント毎の請求を会社（のファイル）毎にまとめる
					//同時に追記モードで取込可能かをチェックする
					//初期化
					//請求データを１行ずつ処理
					//最後がダミー電話番号ではなかった場合
					//print "bill:sum=" . $billSeikyuu . ":" . $sumChargePact . "\n";
					//合計金額チェック
					{
						H_MargeData[kokyakuno].sort();
						H_MargeData[kokyakuno] = array_merge_recursive(H_MargeData[kokyakuno], H_MargeDataDummy[kokyakuno]);
// 2022cvt_015
						var margeCnt = H_MargeData[kokyakuno].length;
// 2022cvt_015
						var telChkFlg = false;
// 2022cvt_015
						var telAddFlg = true;
// 2022cvt_015
						var telAddFlgX = true;
// 2022cvt_015
						var detailNo = 0;
						oldTelno = "";
// 2022cvt_015
						var sumChargePact = 0;
// 2022cvt_015
						var sumCharge = 0;
// 2022cvt_015
						var sumTax = 0;
// 2022cvt_015
						var noTaxCharge = 0;
// 2022cvt_015
						var billTax = 0;
// 2022cvt_015
						var billKurikoshi = 0;
// 2022cvt_015
						var billTyousei = 0;
// 2022cvt_015
						var billEntai = 0;
// 2022cvt_015
						var billJyuutou = 0;
// 2022cvt_015
						var billSeikyuu = 0;
// 2022cvt_015
						var H_DummyCharge = Array();

// 2022cvt_015
						for (var margeCounter = 0; margeCounter < margeCnt; margeCounter++) //ダミー電話番号の場合、会社単位の請求金額を調べる
						{
							if (H_MargeData[kokyakuno][margeCounter][0] == H_DummyTel[kokyakuno][0]) //ダミー電話番号以外の場合
								{
									if (undefined !== H_DummyCharge[H_MargeData[kokyakuno][margeCounter][2]] == false) {
										H_DummyCharge[H_MargeData[kokyakuno][margeCounter][2]] = H_MargeData[kokyakuno][margeCounter][3];
									} else {
										H_DummyCharge[H_MargeData[kokyakuno][margeCounter][2]] = H_DummyCharge[H_MargeData[kokyakuno][margeCounter][2]] + H_MargeData[kokyakuno][margeCounter][3];
									}
								} else //電話番号が変わった場合
								{
									if (H_MargeData[kokyakuno][margeCounter][0] != oldTelno) //追記モード かつ ＤＢに同じ電話番号がある場合はWARNINGを出して処理をスキップする
										{
											if (mode == "a" && -1 !== A_uniqTelnoX.indexOf(H_MargeData[kokyakuno][margeCounter][0]) == true) //エラーとなった契約ＩＤはとばすが処理は続ける
												{
													logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の請求データ(" + H_kokyakuno[kokyakuno].join(",") + ")にある電話番号" + H_MargeData[kokyakuno][margeCounter][0] + "が既にＤＢの存在するため追記モードで取り込みできません。");
													continue;
												}
										}
								}

							oldTelno = H_MargeData[kokyakuno][margeCounter][0];
						}

						oldTelno = "";

						for (margeCounter = 0; margeCounter < margeCnt; margeCounter++) //電話番号が変わったときの処理
						//請求金額以外の場合
						{
							if (H_MargeData[kokyakuno][margeCounter][0] != oldTelno && oldTelno != "" && oldTelno != H_DummyTel[kokyakuno][0]) //消費税を求める
								//初期化
								//初期化
								//初期化
								//電話番号存在チェックフラグを初期化
								//初期化 デフォルトは追加する
								//初期化 デフォルトは追加する
								{
// 2022cvt_015
									var tax = Math.floor((sumCharge - noTaxCharge) * G_EXCISE_RATE);

									if (0 != tax) //消費税を出力
										{
											A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + TAX + "\t" + H_Code[TAX] + "\t" + tax + "\t\\N\t" + detailNo + "\t" + now + "\t" + G_CARRIER_KDDI_KOTEI + "\t\t" + kokyakuno + "\n");
											detailNo++;
										}

									if (aspFlg == true && oldTelno != H_DummyTel[kokyakuno][0]) //合計用に１つ進める
										//ASP利用料を出力
										//ASP利用料消費税を出力
										{
											detailNo++;
											A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + G_CODE_ASP + "\t" + H_Code[G_CODE_ASP] + "\t" + aspCharge + "\t\\N\t" + detailNo + "\t" + now + "\t" + G_CARRIER_KDDI_KOTEI + "\t\t\n");
											detailNo++;
											A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + G_CODE_ASX + "\t" + H_Code[G_CODE_ASX] + "\t" + Math.floor(aspCharge * G_EXCISE_RATE) + "\t\\N\t" + detailNo + "\t" + now + "\t" + G_CARRIER_KDDI_KOTEI + "\t\t\n");
										}

									H_dupliTelno[oldTelno] = detailNo;
									detailNo = 0;
									sumCharge = 0;
									noTaxCharge = 0;
									telChkFlg = false;
									telAddFlg = true;
									telAddFlgX = true;
									sumTax = sumTax + tax;
								}

							if (false == telChkFlg) //tel_X_tbに同一キャリアで存在しているか、お客様番号が違うファイルで既に登録処理済みかチェック
								//電話番号があった場合
								{
									if (true == (-1 !== A_telnoX.indexOf(H_MargeData[kokyakuno][margeCounter][0])) || true == (-1 !== A_telXAddList.indexOf(H_MargeData[kokyakuno][margeCounter][0]))) //tel_X_tb に登録する必要なし
										{
											telAddFlgX = false;
										}

									if (true == telAddFlgX) //tel_X_tbに異なるキャリアで存在している場合は登録情報を引き継ぐ
										//tel_X_tb に追加処理した電話番号をリストへ追加
										//tel_tb にも追加するモード（-t=n）でダミー電話番号以外の時
										{
											if (true == (-1 !== Object.keys(H_telnoXAnother).indexOf(H_MargeData[kokyakuno][margeCounter][0]))) //
												{
// 2022cvt_020
// 2022cvt_015
													var memo = H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].memo.replace(["\r\n", "\n"], "LFkaigyoLF");
													// var memo = str_replace(["\r\n", "\n"], "LFkaigyoLF", H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].memo);
													A_telXOutputBuff.push(A_pactid[pactCounter] + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].postid + "\t" + H_MargeData[kokyakuno][margeCounter][0] + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].telno_view + "\t" + "\\N\t" + G_CARRIER_KDDI_KOTEI + "\t" + KDDI_KOTEI_AREA_ID + "\t" + KDDI_KOTEI_CIRCUIT_ID + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].employeecode + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].username + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].mail + "\t" + "\\N\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text2 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text3 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text4 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text5 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text6 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text7 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text8 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text9 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text10 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text11 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text12 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text13 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text14 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text15 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int2 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int3 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date2 + "\t" + memo + "\t" + "\\N\t\\N\t\\N\t" + now + "\t" + now + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int4 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int5 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int6 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date3 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date4 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date5 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date6 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].mail1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].mail2 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].mail3 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].url1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].url2 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].url3 + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N" + "\n");
												} else //tel_X_tb に追加する電話を出力
												{
													if (H_MargeData[kokyakuno][margeCounter][0] != H_DummyTel[kokyakuno][0]) {
														A_telXOutputBuff.push(A_pactid[pactCounter] + "\t" + rootPostidX + "\t" + H_MargeData[kokyakuno][margeCounter][0] + "\t" + H_MargeData[kokyakuno][margeCounter][1] + "\t\\N\t" + G_CARRIER_KDDI_KOTEI + "\t" + KDDI_KOTEI_AREA_ID + "\t" + KDDI_KOTEI_CIRCUIT_ID + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t" + now + "\t" + now + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\n");
													} else {
														A_telXOutputBuff.push(A_pactid[pactCounter] + "\t" + H_DummyTel[kokyakuno][1] + "\t" + H_MargeData[kokyakuno][margeCounter][0] + "\t" + H_MargeData[kokyakuno][margeCounter][1] + "\t\\N\t" + G_CARRIER_KDDI_KOTEI + "\t" + KDDI_KOTEI_AREA_ID + "\t" + KDDI_KOTEI_CIRCUIT_ID + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\tKDDI固定調整金\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t" + now + "\t" + now + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\n");
													}
												}

											telAddFlgX = false;
											A_telXAddList.push(H_MargeData[kokyakuno][margeCounter][0]);

											if (teltable == "n" && H_MargeData[kokyakuno][margeCounter][0] != H_DummyTel[kokyakuno][0]) //tel_tbに存在しているか、お客様番号が違うファイルで既に登録処理済みかチェック
												//電話番号があった場合
												{
													if (-1 !== A_telno.indexOf(H_MargeData[kokyakuno][margeCounter][0]) == true || -1 !== A_telAddList.indexOf(H_MargeData[kokyakuno][margeCounter][0]) == true) //tel_tb に登録する必要なし
														{
															telAddFlg = false;
														}

													if (telAddFlg == true) //tel_X_tbに異なるキャリアで存在している場合はtel_tbにも登録情報を引き継ぐ
														//tel_tb に追加処理した電話番号をリストへ追加
														{
															if (true == (-1 !== Object.keys(H_telnoXAnother).indexOf(H_MargeData[kokyakuno][margeCounter][0]))) {
// 2022cvt_020
																memo = H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].memo.replace(["\r\n", "\n"], "LFkaigyoLF");
																// memo = str_replace(["\r\n", "\n"], "LFkaigyoLF", H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].memo);
																A_telOutputBuff.push(A_pactid[pactCounter] + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].postid + "\t" + H_MargeData[kokyakuno][margeCounter][0] + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].telno_view + "\t" + "\\N\t" + G_CARRIER_KDDI_KOTEI + "\t" + KDDI_KOTEI_AREA_ID + "\t" + KDDI_KOTEI_CIRCUIT_ID + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].employeecode + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].username + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].mail + "\t" + "\\N\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text2 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text3 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text4 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text5 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text6 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text7 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text8 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text9 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text10 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text11 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text12 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text13 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text14 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text15 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int2 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int3 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date2 + "\t" + memo + "\t" + "\\N\t\\N\t\\N\t" + now + "\t" + now + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int4 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int5 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int6 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date3 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date4 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date5 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date6 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].mail1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].mail2 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].mail3 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].url1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].url2 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].url3 + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N" + "\n");
															} else //tel_tb に追加する電話を出力
																{
																	A_telOutputBuff.push(A_pactid[pactCounter] + "\t" + rootPostid + "\t" + H_MargeData[kokyakuno][margeCounter][0] + "\t" + H_MargeData[kokyakuno][margeCounter][1] + "\t\\N\t" + G_CARRIER_KDDI_KOTEI + "\t" + KDDI_KOTEI_AREA_ID + "\t" + KDDI_KOTEI_CIRCUIT_ID + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t" + now + "\t" + now + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\n");
																}

															telAddFlg = false;
															A_telAddList.push(H_MargeData[kokyakuno][margeCounter][0]);
														}
												}
										}

									telChkFlg = true;
								}

							if (undefined !== H_Code[H_MargeData[kokyakuno][margeCounter][2]] == false && H_MargeData[kokyakuno][margeCounter][2] != SEIKYUU) {
								logh.putError(G_SCRIPT_ERROR, "登録されていない内訳コード[" + H_MargeData[kokyakuno][margeCounter][2] + "]が見つかりました\n内訳コードを更新してから、再度処理を行ってください。");
							}

							if (H_MargeData[kokyakuno][margeCounter][0] != H_DummyTel[kokyakuno][0]) //$detailNo が初期値で
								//お客様番号が違うファイルで同じ電話番号が存在し
								//既に取り込み処理をしている場合は $detailNo を続き番号に付け替える
								{
									if (detailNo == 0 && undefined !== H_dupliTelno[H_MargeData[kokyakuno][margeCounter][0]] == true && H_dupliTelno[H_MargeData[kokyakuno][margeCounter][0]] != 0) //ASP利用料表示する場合は $detailNo を２つもどしてからセットする
										{
											if (aspFlg == true) //$detailNo を２つ戻してセットする
												//既にバッファに格納されている対象電話番号のASP利用料を探して要素番号を取得する
												//対象の電話番号のASPとASXを除いた配列を作り直す
												//ASP利用料表示しない場合は退避していた $detailNo をそのままセットする
												{
													detailNo = H_dupliTelno[H_MargeData[kokyakuno][margeCounter][0]] - 2;
// 2022cvt_015
													var keyNo = A_teldetailsOutputBuff.indexOf(A_pactid[pactCounter] + "\t" + H_MargeData[kokyakuno][margeCounter][0] + "\t" + G_CODE_ASP + "\t" + H_Code[G_CODE_ASP] + "\t" + aspCharge + "\t\\N\t" + (detailNo + 1) + "\t" + now + "\t" + G_CARRIER_KDDI_KOTEI + "\t\t\n");
													// var keyNo = array_search(A_pactid[pactCounter] + "\t" + H_MargeData[kokyakuno][margeCounter][0] + "\t" + G_CODE_ASP + "\t" + H_Code[G_CODE_ASP] + "\t" + aspCharge + "\t\\N\t" + (detailNo + 1) + "\t" + now + "\t" + G_CARRIER_KDDI_KOTEI + "\t\t\n", A_teldetailsOutputBuff);
// 2022cvt_015
													var A_teldetailsOutputBuff_bef = A_teldetailsOutputBuff.slice(0, keyNo);
// 2022cvt_015
													var A_teldetailsOutputBuff_aft = A_teldetailsOutputBuff.slice(keyNo + 2);
													A_teldetailsOutputBuff = A_teldetailsOutputBuff.concat(A_teldetailsOutputBuff_aft);
													// A_teldetailsOutputBuff = array_merge(A_teldetailsOutputBuff_bef, A_teldetailsOutputBuff_aft);
												} else {
												detailNo = H_dupliTelno[H_MargeData[kokyakuno][margeCounter][0]];
											}
										}

									A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + H_MargeData[kokyakuno][margeCounter][0] + "\t" + H_MargeData[kokyakuno][margeCounter][2] + "\t" + H_Code[H_MargeData[kokyakuno][margeCounter][2]] + "\t" + H_MargeData[kokyakuno][margeCounter][3] + "\t" + H_MargeData[kokyakuno][margeCounter][5] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_KDDI_KOTEI + "\t" + H_MargeData[kokyakuno][margeCounter][4] + "\t" + kokyakuno + "\n");
								}

							oldTelno = H_MargeData[kokyakuno][margeCounter][0];

							if (H_MargeData[kokyakuno][margeCounter][2] != SEIKYUU) //電話単位小計
								//会社単位合計
								//税区分が非課税であれば電話番号毎に非課税対象額をサマリーする
								{
									sumCharge = sumCharge + H_MargeData[kokyakuno][margeCounter][3];
									sumChargePact = sumChargePact + H_MargeData[kokyakuno][margeCounter][3];

									if (H_TaxMaster[1] == H_MargeData[kokyakuno][margeCounter][5]) {
										noTaxCharge = noTaxCharge + H_MargeData[kokyakuno][margeCounter][3];
									}

									detailNo++;
								}
						}

						if (oldTelno != H_DummyTel[kokyakuno][0]) //消費税を求める
							//最後がダミー電話番号だった場合
							{
								tax = Math.floor((sumCharge - noTaxCharge) * G_EXCISE_RATE);

								if (0 != tax) //消費税を出力
									{
										A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + TAX + "\t" + H_Code[TAX] + "\t" + tax + "\t\\N\t" + detailNo + "\t" + now + "\t" + G_CARRIER_KDDI_KOTEI + "\t\t" + kokyakuno + "\n");
										detailNo++;
									}

								if (aspFlg == true && oldTelno != H_DummyTel[kokyakuno][0]) //合計用に１つ進める
									//ASP利用料を出力
									//ASP利用料消費税を出力
									{
										detailNo++;
										A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + G_CODE_ASP + "\t" + H_Code[G_CODE_ASP] + "\t" + aspCharge + "\t\\N\t" + detailNo + "\t" + now + "\t" + G_CARRIER_KDDI_KOTEI + "\t\t\n");
										detailNo++;
										A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + G_CODE_ASX + "\t" + H_Code[G_CODE_ASX] + "\t" + Math.floor(aspCharge * G_EXCISE_RATE) + "\t\\N\t" + detailNo + "\t" + now + "\t" + G_CARRIER_KDDI_KOTEI + "\t\t\n");
									}

								H_dupliTelno[oldTelno] = detailNo;
							} else {
							detailNo = 0;

// 2022cvt_015
							for (var code of Object.keys(H_DummyCharge)) //消費税の場合
							{
								if (TAX == code) {
									if (0 != H_DummyCharge[code] - sumTax) //$sumChargePact = $sumChargePact + ($H_DummyCharge[$code] - $sumTax);		// 会社単位合計
										{
											A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + H_DummyTel[kokyakuno][0] + "\t" + code + "\t" + H_Code[code] + "\t" + (H_DummyCharge[code] - sumTax) + "\t\\N\t" + detailNo + "\t" + now + "\t" + G_CARRIER_KDDI_KOTEI + "\t\t" + kokyakuno + "\n");
											detailNo++;
										}
								} else if (SEIKYUU == code) {
									billSeikyuu = H_DummyCharge[code];
								} else //会社単位の請求のみ会社毎合計に追加する（それ以外のものは既に追加済み）
									{
										A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + H_DummyTel[kokyakuno][0] + "\t" + code + "\t" + H_Code[code] + "\t" + H_DummyCharge[code] + "\t\\N\t" + detailNo + "\t" + now + "\t" + G_CARRIER_KDDI_KOTEI + "\t\t" + kokyakuno + "\n");
										detailNo++;

										if (TYOUSEI == code || ENTAIRISOKU == code || JYUUTOU == code) //会社単位合計
											{
												sumChargePact = sumChargePact + H_DummyCharge[code];
											}
									}
							}
						}

						if (billSeikyuu != sumChargePact) //エラーとなった契約ＩＤはとばすが処理は続ける
							{
								logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の合計金額が一致しません");
								continue;
							}

// 2022cvt_015
						for (var recCnt = 0; recCnt < H_MargeDataTuusin[kokyakuno].length; recCnt++) {
							A_commhistoryOutputBuff.push(A_pactid[pactCounter] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][0] + "\t" + TUWA_TYPE + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][4] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][3] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][7] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][6] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][5] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][8] + "\t" + G_CARRIER_KDDI_KOTEI + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][1] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][2] + "\n");
						}
					}

// 2022cvt_015
					var outTelCnt = 0;
					var outTelXCnt = 0;
					var outTeldetailsCnt = 0;
					var outCommhistoryCnt = 0;

// 2022cvt_015
					for (var value of A_telOutputBuff) {
						fs.writeFileSync(fp_tel, value);// 2022cvt_006
						outTelCnt++;
					}

					// fflush(fp_tel);

// 2022cvt_015
					for (var value of A_telXOutputBuff) {
						fs.writeFileSync(fp_telX, value);// 2022cvt_006
						outTelXCnt++;
					}

					// fflush(fp_telX);

// 2022cvt_015
					for (var value of A_teldetailsOutputBuff) {
						fs.writeFileSync(fp_teldetails, value);// 2022cvt_006
						outTeldetailsCnt++;
					}

					// fflush(fp_teldetails);

// 2022cvt_015
					for (var value of A_commhistoryOutputBuff) {
						fs.writeFileSync(fp_commhistory, value);// 2022cvt_006
						outCommhistoryCnt++;
					}

					// fflush(fp_commhistory);
					A_pactDone.push(A_pactid[pactCounter]);
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") インポートファイル出力完了(" + tel_tb + ":" + outTelCnt + "件," + telX_tb + ":" + outTelXCnt + "件," + teldetails_tb + ":" + outTeldetailsCnt + "件," + commhistory_tb + ":" + outCommhistoryCnt + "件)");
				}

			// closedir(dirh);
		} else {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + " 契約ＩＤ：" + A_pactid[pactCounter] + " は pact_tb に登録されていません");
	}
}

fs.closeSync(fp_teldetails);
// fclose(fp_teldetails);
fs.closeSync(fp_tel);
// fclose(fp_tel);
fs.closeSync(fp_telX);
// fclose(fp_telX);
fs.closeSync(fp_commhistory);
// fclose(fp_commhistory);
// 2022cvt_015
var pactDoneCnt = A_pactDone.length;

if (pactDoneCnt == 0) //処理する件数が０件をログ出力
	//処理終了をログ出力
	{
		logh.putError(G_SCRIPT_WARNING, "インポート可能な請求情報データがありませんでした");
		logh.putError(G_SCRIPT_END, "ＫＤＤＩ固定請求情報ファイルインポート処理終了");
		lock(false);
		throw process.exit(0);// 2022cvt_009
	}

if (backup == "y") //tel_details_X_tb をエクスポートする
	//トランザクション開始
	//トランザクション内でないとカーソルが使えない
	//エクスポート失敗した場合
	//コミット
	{
		sql_str = "select * from " + teldetails_tb;
// 2022cvt_015
		var expFile = DATA_EXP_DIR + "/" + teldetails_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
		//dbh.begin();

		if (expDataByCursor(sql_str, expFile, dbh.m_db) != 1) {
			logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + teldetails_tb + " のデータエクスポートに失敗しました");
		} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + teldetails_tb + " のデータエクスポート完了");
		}

		dbh.commit();
	}

dbh.begin();

if (mode == "o") //請求明細
	//delte失敗した場合
	//通話明細
	//delte失敗した場合
	{
		sql_str = "delete from " + teldetails_tb + " where pactid in (" + A_pactDone.join(",") + ") and " + "carid = " + G_CARRIER_KDDI_KOTEI;
// 2022cvt_015
		var rtn = await dbh.query(sql_str, false);

		if (dbh.isError() == true) //ロールバック
			{
				dbh.rollback();
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + teldetails_tb + " のデリートに失敗しました ");
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + teldetails_tb + " のデリート完了 のデリート完了");
		}

		sql_str = "delete from " + commhistory_tb + " where pactid in (" + A_pactDone.join(",") + ") and " + "carid = " + G_CARRIER_KDDI_KOTEI;
		rtn = await dbh.query(sql_str, false);

		if (dbh.isError() == true) //ロールバック
			{
				dbh.rollback();
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + commhistory_tb + " のデリートに失敗しました ");
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + commhistory_tb + " のデリート完了");
		}
	}

if (teltable == "n" && fs.statSync(telFile).size != 0)
// if (teltable == "n" && filesize(telFile) != 0) //tel_tb へのインポートが失敗した場合
	{
// 2022cvt_015
		var A_tel_col = ["pactid", "postid", "telno", "telno_view", "userid", "carid", "arid", "cirid", "machine", "color", "planid", "planalert", "packetid", "packetalert", "pointstage", "employeecode", "username", "mail", "orderdate", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "date1", "date2", "memo", "movepostid", "moveteldate", "delteldate", "recdate", "fixdate", "options", "contractdate", "finishing_f", "schedule_person_name", "schedule_person_userid", "schedule_person_postid", "kousiflg", "kousiptn", "exceptflg", "handflg", "hand_detail_flg", "username_kana", "kousi_fix_flg", "int4", "int5", "int6", "date3", "date4", "date5", "date6", "mail1", "mail2", "mail3", "url1", "url2", "url3", "buyselid", "discounts", "simcardno", "pre_telno", "pre_carid", "dummy_flg"];

		if (await doCopyInsert(tel_tb, telFile, A_tel_col, dbh) != 0) //ロールバック
			{
				dbh.rollback();
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + tel_tb + " へのデータインポートが失敗しました ");
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + tel_tb + " へのデータインポート完了");
		}
	}

if (fs.statSync(telXFile).size != 0)
// if (filesize(telXFile) != 0) //tel_X_tb へのインポートが失敗した場合
	{
// 2022cvt_015
		var A_telX_col = ["pactid", "postid", "telno", "telno_view", "userid", "carid", "arid", "cirid", "machine", "color", "planid", "planalert", "packetid", "packetalert", "pointstage", "employeecode", "username", "mail", "orderdate", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "date1", "date2", "memo", "movepostid", "moveteldate", "delteldate", "recdate", "fixdate", "options", "contractdate", "finishing_f", "schedule_person_name", "schedule_person_userid", "schedule_person_postid", "kousiflg", "kousiptn", "exceptflg", "handflg", "hand_detail_flg", "username_kana", "kousi_fix_flg", "int4", "int5", "int6", "date3", "date4", "date5", "date6", "mail1", "mail2", "mail3", "url1", "url2", "url3", "buyselid", "discounts", "simcardno", "pre_telno", "pre_carid", "dummy_flg"];

		if (await doCopyInsert(telX_tb, telXFile, A_telX_col, dbh) != 0) //ロールバック
			{
				dbh.rollback();
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + telX_tb + " へのデータインポートが失敗しました ");
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + telX_tb + " へのデータインポート完了");
		}
	}

if (fs.statSync(teldetailsFile).size != 0)
// if (filesize(teldetailsFile) != 0) //tel_details_X_tb へのインポートが失敗した場合
	{
// 2022cvt_015
		var A_teldetails_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "tdcomment", "prtelno"];

		if (await doCopyInsert(teldetails_tb, teldetailsFile, A_teldetails_col, dbh) != 0) //ロールバック
			{
				dbh.rollback();
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + teldetails_tb + " へのデータインポートが失敗しました ");
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + teldetails_tb + " へのデータインポート完了");
		}
	}

if (fs.statSync(commhistoryFile).size != 0)
// if (filesize(commhistoryFile) != 0) //commhistory_X_tb へのインポートが失敗した場合
	{
// 2022cvt_016
// 2022cvt_015
		var A_commhistory_col = ["pactid", "telno", "type", "date", "totelno", "toplace", "fromplace", "time", "charge", "carid", "comservice", "sendrec"];

		if (await doCopyInsert(commhistory_tb, commhistoryFile, A_commhistory_col, dbh) != 0) //ロールバック
			{
				dbh.rollback();
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + commhistory_tb + " へのデータインポートが失敗しました ");
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + commhistory_tb + " へのデータインポート完了");
		}
	}

dbh.commit();

// 2022cvt_015
for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動先ディレクトリ
//移動先ディレクトリがなければ作成
//ファイルの移動
{
// 2022cvt_015
	var finDir = dataDir + "/" + A_pactDone[pactDoneCounter] + FIN_DIR;

	if (fs.existsSync(finDir) == false) //移動先ディレクトリ作成失敗// 2022cvt_003
		{
			try {
				fs.mkdirSync(finDir, 700);
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " 移動先ディレクトリ(" + finDir + ")の作成に失敗しました");
			} catch (e) {
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " 移動先ディレクトリ(" + finDir + ")作成完了");
			}
		}

// 	clearstatcache();// 2022cvt_012
	var dirh = fs.readdirSync(dataDir + "/" + A_pactDone[pactDoneCounter]);
	// dirh = openDir(dataDir + "/" + A_pactDone[pactDoneCounter]);// 2022cvt_004

	for (var mvFileName of dirh)
	// while (mvFileName = fs.readdir(dirh)) //ファイルなら移動する// 2022cvt_005
	{
// 2022cvt_028
		if (fs.statSync(dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName).isFile())
		// if (is_file(dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName) == true) //移動が失敗した場合
			{
				try {
					fs.renameSync(dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName, finDir + "/" + mvFileName);
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " ファイルの移動に失敗しました(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")");
				} catch (e) {
					logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " ファイル移動完了(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")");
				}
			}

// 		clearstatcache();// 2022cvt_012
	}

	// closedir(dirh);
}

lock(false);
logh.putError(G_SCRIPT_END, "ＫＤＤＩ固定請求情報ファイルインポート処理終了");
throw process.exit(0);// 2022cvt_009

function usage(comment: string) {
	// if (!("dbh" in global)) dbh = undefined;

	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n");
	console.log("Usage) " + SCRIPTNAME + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
	console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
	console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("		-b バックパップ (Y:バックアップする,N:バックアップしない)\n");
	console.log("		-t 電話テーブル (N:tel_tb へインサート,O:tel_X_tb へインサート)\n\n");
	dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
	throw process.exit(1);// 2022cvt_009
};

	async function lock(is_lock: boolean) //ロックする
{
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var pre = "batch";
// 2022cvt_015
	var now = getTimestamp();

	if (is_lock == true) //既に起動中
		//ロック解除
		{
			dbh.begin();
			dbh.lock("clamptask_tb");
// 2022cvt_015
			var sql = "select count(*) from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "' and " + "status = 1;";
// 2022cvt_015
			var count = await dbh.getOne(sql);

			if (count != 0) {
				dbh.rollback();
				dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + "多重動作");
				return false;
			}

			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + dbh.escape(pre + "_" + SCRIPTNAME) + "',1,'" + now + "');";
			dbh.query(sql);
			dbh.commit();
		} else {
		dbh.begin();
		dbh.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "';";
		dbh.query(sql);
		dbh.commit();
	}

	return true;
};

	async function getDummy(pactid: string, reqno: string) //dummy_tbから所属部署ＩＤが取得できた場合
{
	// if (!("dbh" in global)) dbh = undefined;
	// if (!("dummytel_tb" in global)) dummytel_tb = undefined;
	// if (!("postX_tb" in global)) postX_tb = undefined;
// 2022cvt_015
	var sql = "select telno,postid from " + dummytel_tb + " where pactid = " + pactid + " and " + "carid = " + G_CARRIER_KDDI_KOTEI + " and reqno = '" + reqno + "'";
// 2022cvt_015
	var H_data = await dbh.getHash(sql);

	if (H_data.length != 0 && H_data[0].postid != "") //本当にpost_X_tbに存在しているかチェックする
		//post_X_tbに部署が存在しなかった場合はdummy_tbで所得した部署ＩＤはなかったことにする
		{
// 2022cvt_015
			var sql_str = `select postid from ${postX_tb} where pactid = ` + pactid + " and postid = " + H_data[0].postid;
// 2022cvt_015
			var rtn = await dbh.getOne(sql_str);

			if (rtn == "") {
				H_data[0].postid = "";
			}
		}

	return H_data;
};

function getRootPostid(pactid: string, table: string) {
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var sql_str = "select postidparent from " + table + " where pactid = " + pactid + " and " + "postidparent = postidchild and " + "level = 0";
// 2022cvt_015
	var rootPostid = dbh.getOne(sql_str, true);
	return rootPostid;
};

	async function chkAsp(pactid: string) {
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var sql_str = "select count(*) from fnc_relation_tb where pactid = " + pactid + " and " + "fncid = " + G_AUTH_ASP;
// 2022cvt_015
	var count = await dbh.getOne(sql_str);

	if (count == 0) {
		return false;
	} else {
		return true;
	}
};

function getAsp(pactid: string) {
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var sql_str = "select charge from asp_charge_tb where pactid = " + pactid + " and " + "carid = " + G_CARRIER_KDDI_KOTEI;
// 2022cvt_015
	var charge = dbh.getOne(sql_str);
	return charge;
};

// function doCopyExp(sql: string, filename: string, db: ScriptDB) //ログファイルハンドラ
// //エクスポートファイルを開く
// //エクスポートファイルオープン失敗
// //無限ループ
// //カーソルを開放
// {
// 	// if (!("logh" in global)) logh = undefined;
// // 2022cvt_015
// 	var fp;
// 	try {
// 		fp = fs.openSync(filename, "wt");
// 	} catch (e) {
// 		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "のファイルオープン失敗");
// 		return 1;
// 	}
// 	// var fp = fopen(filename, "wt");

// 	db.query("declare exp_cur cursor for " + sql);

// 	for (; ; ) //ＤＢから結果取得
// 	{
// // 2022cvt_015
// 		var result = pg_query(db.m_db.connection, "fetch " + NUM_FETCH + " in exp_cur");

// 		if (result == false) //ファイルクローズ
// 			//カーソルを開放
// 			{
// 				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "Fetch error, " + sql);
// 				fs.closeSync(fp);
// 				// fclose(fp);
// 				db.query("close exp_cur");
// 				return 1;
// 			}

// // 2022cvt_015
// 		var A_line = pg_fetch_array(result);

// 		if (A_line == false) //ループ終了
// 			{
// 				break;
// 			}

// // 2022cvt_015
// 		var str = "";

// 		do //データ区切り記号、初回のみ空
// 		{
// // 2022cvt_015
// 			var delim = "";

// // 2022cvt_015
// 			for (var item of A_line) //データ区切り記号
// 			//値がない場合はヌル（\N）をいれる
// 			{
// 				str += delim;
// 				delim = "\t";

// 				if (item == undefined) //nullを表す記号
// 					{
// 						str += "\\N";
// 					} else {
// 					str += item;
// 				}
// 			}

// 			str += "\n";
// 		} while (A_line = pg_fetch_array(result));

// 		try {
// 			fs.writeSync(fp, str);
// 		} catch (e) {
// 			logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "への書き込み失敗、" + str);
// 			fs.closeSync(fp);
// 			// fclose(fp);
// 			db.query("CLOSE exp_cur");
// 			return 1;
// 		}
// 	}

// 	db.query("CLOSE exp_cur");
// 	fs.closeSync(fp);
// 	// fclose(fp);
// 	return 0;
// };

	async function doCopyInsert(table: string, filename: string, columns: Array<any>, db: ScriptDB) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid" in global)) pactid = undefined;
	// if (!("billdate" in global)) billdate = undefined;
// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(filename, "utf8");
	} catch(e) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
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
	var ins = new TableInserter(log_listener, db, filename + ".sql", true);
	ins.begin(table);

	for (var line of lines)
	// while (line = fgets(fp)) //データはtab区切り
	//インサート行の追加
	{
// 2022cvt_015
		var A_line = line.split("\t");
		// var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) //要素数が異なっていたら
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のデータ数が設定と異なります。データ=" + line);
				// fclose(fp);
				return 1;
			}

// 2022cvt_015
		var H_ins = {};
// 2022cvt_015
		var idx = 0;

// 2022cvt_015
		for (var col of columns) //\N の場合はハッシュに追加しない
		{
			if (A_line[idx] != "\\N") {
				H_ins[col] = A_line[idx];
			}

			idx++;
		}

		if (await ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート中にエラー発生、データ=" + line);
			// fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート処理に失敗.");
		// fclose(fp);
		return 1;
	}

	// fclose(fp);
	return 0;
};

function doCopyIn(table: any, filename: string, db: ScriptDB) //ログファイルハンドラ
//インポートファイルを開く
//最後のあまり行を処理する
{
	// if (!("logh" in global)) logh = undefined;
// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(filename, "utf8");
	} catch (e) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "のファイルオープン失敗");
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
	var line_cnt = 0;
// 2022cvt_015
	var H_lines = Array();

	for (var line of lines)
	// while (line = fgets(fp)) //COPY文の文字列そのものを取得して配列に溜める
	//array_push( $H_lines, $line );
	//...こっちの方が速いらしい。
	//一定行数読み込んだら処理を行う
	{
		H_lines.push(line);
		line_cnt++;

		if (line_cnt >= COPY_LINES) //コピー処理を行う
			//空にする
			{
// 2022cvt_015
				var res_cpfile = pg_copy_from(db.m_db, table, H_lines);

				if (res_cpfile == false) {
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "のコピー中にエラー発生.");
					// fclose(fp);
					return 1;
				}

				H_lines = Array();
				line_cnt = 0;
			}
	}

	if (line_cnt > 0) //コピー処理を行う
		{
			res_cpfile = pg_copy_from(db.m_db, table, H_lines);

			if (res_cpfile == false) {
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "のコピー中にエラー発生.");
				// fclose(fp);
				return 1;
			}
		}

	// fclose(fp);
	return 0;
};

function getTimestamp() {
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
};
})();
