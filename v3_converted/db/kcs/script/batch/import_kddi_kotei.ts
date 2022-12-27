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
//税区分 内税
//税区分 非対称等
//改行コードを除いたレコードサイズ
//区分開始位置
//区分桁数
//アカウントヘッドレコード区分
//通信明細区分
//国内通信料金区分
//国際通信料金区分
//割引料金区分
//基本料、工事料区分
//統合請求明細区分
//コンテンツ明細区分
//番号毎の小計（区分：３９）が０円なのに請求明細がある場合は、請求明細を除外する 2010/9/9 s.maeda
//番号毎の小計区分
//アカウント単位に発生する料金
//請求合計区分
//国内通信（課税対象分）
//国内通信（非課税）
//通話料国内割引対象（課税対象分）
//国際通信
//define("KOKUSAI_WARIBIKI", "kokusai-waribiki");				// 国際通信割引額
//消費税
//前月繰越金額
//調整額
//延滞金利息
//充当料金
//請求金額
//一度にFETCHする行数
//データインポートする際の処理単位
//通話明細通話タイプ
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//パラメータチェック
//数が正しくない
//処理開始をログ出力
//請求データファイルがあるディレクトリを指定
//請求データファイルのディレクトリチェック
//ディレクトリのパスが不正の場合
//２重起動防止ロックをかける
//税区分（共通）
//サービス分類（通信明細用）
//サービス種別（通信明細用）
//適用通信区分（割引明細用）
//適用通信区分（基本料・工事料用）
//pact_tb より登録されている契約ＩＤ、会社名を取得
//会社名マスターを作成
//utiwake_tb より内訳コード、内訳名称を取得
//初期化
//内訳コードマスターを作成
//テーブルＮＯ取得
//テーブル名設定
//処理する契約ＩＤ
//pactidでソート
//処理が終了した pactid を格納するための配列
//出力ファイル作成
//DBに書き込む現在日時を取得
//pactid 毎に処理する
//出力ファイルクローズ
//処理する件数が０件なら直ちに終了する
//モードがオーバーライトの時はデータをインポートする前にデリート
//完了したファイルを移動
//ロック解除
//処理終了をログ出力
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//clamptasl_tb にレコードを追加し２重起動を防止する
//[引　数] $is_lock： true：ロックする、false：ロック解除
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//請求明細書のお客様番号よりダミーの電話番号と所属部署を取得する
//[引　数] $pactid：契約ＩＤ
//$reqno:お客様番号
//[返り値] ダミー電話番号と所属部署ＩＤ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ルート部署のシステム用部署ＩＤを取得する
//[引　数] $pactid：契約ＩＤ
//$table：テーブル名
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ＡＳＰ利用料表示設定があるかないか
//[引　数] $pactid：契約ＩＤ
//[返り値] ある：true、ない：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ＡＳＰ利用料金の取得
//[引　数] $pactid：契約ＩＤ
//[返り値] ＡＳＰ利用料金
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルにエクスポートを行う
//pgpoolでのＤＢ２重化による対応
//[引　数] テーブル名、COPY用のファイル名、$db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
//[引　数] テーブル名、入力ファイル名、カラム名の配列
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う
//[引　数] テーブル名、COPY用のファイル名、$db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//DBに書き込む現在日時に使用する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

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
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type_stdout = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
log_listener.PutListener(log_listener_type);
log_listener.PutListener(log_listener_type_stdout);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);

if (_SERVER.argv.length != 6) //数が正しい
	{
		usage("");
	} else //$argvCounter 0 はスクリプト名のため無視
	{
		var argvCnt = _SERVER.argv.length;

		for (var argvCounter = 1; argvCounter < argvCnt; argvCounter++) //mode を取得
		{
			if (ereg("^-e=", _SERVER.argv[argvCounter]) == true) //モード文字列チェック
				{
					var mode = ereg_replace("^-e=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^[ao]$", mode) == false) {
						usage("\u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-y=", _SERVER.argv[argvCounter]) == true) //請求年月文字列チェック
				{
					var billdate = ereg_replace("^-y=", "", _SERVER.argv[argvCounter]);

					if (ereg("^[0-9]{6}$", billdate) == false) {
						usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					} else //年月チェック
						{
							var year = billdate.substr(0, 4);
							var month = billdate.substr(4, 2);

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
							}
						}

					continue;
				}

			if (ereg("^-p=", _SERVER.argv[argvCounter]) == true) //契約ＩＤチェック
				{
					var pactid = ereg_replace("^-p=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("\u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-b=", _SERVER.argv[argvCounter]) == true) //バックアップの有無のチェック
				{
					var backup = ereg_replace("^-b=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^[ny]$", backup) == false) {
						usage("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-t=", _SERVER.argv[argvCounter]) == true) //電話テーブルの指定をチェック
				{
					var teltable = ereg_replace("^-t=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^[no]$", teltable) == false) {
						usage("\u96FB\u8A71\u30C6\u30FC\u30D6\u30EB\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			usage("");
		}
	}

logh.putError(G_SCRIPT_BEGIN, "\uFF2B\uFF24\uFF24\uFF29\u56FA\u5B9A\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u958B\u59CB");
var dataDir = DATA_DIR + "/" + year + month + KDDI_KOTEI_DIR;

if (is_dir(dataDir) == false) //ディレクトリのパスが正しい場合
	{
		logh.putError(G_SCRIPT_ERROR, "\uFF2B\uFF24\uFF24\uFF29\u56FA\u5B9A\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
	} else //処理する契約ＩＤ配列
	//ディレクトリハンドル
	//契約ＩＤの指定が全て（all）の時
	{
		var A_pactid = Array();
		var dirh = opendir(dataDir);

		if (pactid == "all") //処理する契約ＩＤを取得する
			//契約ＩＤが指定されている場合
			{
				var fileName;

				while (fileName = readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
				{
					if (is_dir(dataDir + "/" + fileName) == true && fileName != "." && fileName != "..") {
						A_pactid.push(fileName);
					}

					clearstatcache();
				}
			} else {
			A_pactid.push(pactid);
		}

		closedir(dirh);
	}

lock(true);
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
var H_TaxMaster = {
	"0": "\u8AB2\u7A0E",
	"1": "\u975E\u8AB2\u7A0E"
};
var H_ServiceBunrui = {
	A: "0077\u5E02\u5185\u96FB\u8A71\u30B5\u30FC\u30D3\u30B9",
	B: "0077\u5E02\u5916\u96FB\u8A71\u30B5\u30FC\u30D3\u30B9",
	T: "001\u56FD\u969B\u96FB\u8A71\u30B5\u30FC\u30D3\u30B9",
	K: "001\u56FD\u5185\u96FB\u8A71\u30B5\u30FC\u30D3\u30B9",
	R: "\u56FD\u969B\u7121\u7DDA\u96FB\u8A71\u30B5\u30FC\u30D3\u30B9",
	M: "\u6D77\u5916\u885B\u661F\u96FB\u8A71\u30B5\u30FC\u30D3\u30B9",
	H: "\u7A7A\u6E2F\u885B\u661F\u96FB\u8A71\u30B5\u30FC\u30D3\u30B9",
	D: "\u6D77\u5916HSD\u30B5\u30FC\u30D3\u30B9",
	Z: "DOD\u30B5\u30FC\u30D3\u30B9"
};
var H_ServiceSyubetsu = {
	"01": "\u30D1\u30FC\u30BD\u30CA\u30EB\u30B3\u30FC\u30EB",
	"02": "0077\u30A2\u30AF\u30BB\u30B9\u30B3\u30FC\u30EB",
	"03": "23\u30D5\u30EA\u30FC\u30B3\u30FC\u30EB",
	"04": "\u30AF\u30EC\u30B8\u30C3\u30C8\u30B3\u30FC\u30EB",
	"05": "0077\u30D5\u30EA\u30FC\u30B3\u30FC\u30EBDX/S",
	"06": "0070\u30D5\u30EA\u30FC\u30D5\u30A9\u30F3",
	"08": "\u30AB\u30B9\u30BF\u30DE\u30B3\u30F3\u30C8\u30ED\u30FC\u30EB",
	"09": "\u56FD\u969B\u30ED\u30FC\u30DF\u30F3\u30B0",
	"10": "\u56FD\u969B\u30D7\u30EA\u30DA\u30A4\u30C9",
	"11": "0120\u30A2\u30AF\u30BB\u30B9\u30B3\u30FC\u30EB",
	"12": "0120\u30D5\u30EA\u30FC\u30B3\u30FC\u30EBDX/S",
	B: "\u30A8\u30B3\u30CE\u30DF\u30FC\u96FB\u8A71\uFF08\u518D\u8CA9\u4E8B\u696D\u8005\u5411\uFF09",
	C: "\u767A\u4FE1\u81EA\u52D5\u30AF\u30EC\u30B8\u30C3\u30C8\u901A\u8A71(SWC)",
	D: "\u30A8\u30B3\u30CE\u30DF\u30FC\u96FB\u8A71\uFF08\u500B\u4EBA\u5411\uFF09",
	E: "\u5185\u7DDA\u63A5\u7D9A",
	H: "\u30C6\u30EC\u30AF\u30EC\u30B8\u30C3\u30C8\u901A\u8A71",
	I: "0053\u30EA\u30D3\u30EA\u30F3\u30B0",
	J: "IODC(\u767A\u7740)",
	M: "GN\u7D4C\u7531WAC",
	P: "\u30D0\u30FC\u30CD\u30C3\u30C8",
	R: "IDAC(\u767A\u7740)",
	T: "ITFC(\u767A\u7740)",
	W: "WAC",
	Y: "\u7B2C\u4E09\u8005\u8AB2\u91D1\u901A\u8A71",
	"\u25B3": "\u305D\u306E\u4ED6"
};
var H_TekiyouTuusinKubunWaribiki = {
	"10": "\u5E02\u5185",
	"20": "\u5E02\u5916",
	"23": "PHS\u7740",
	"24": "au\u7740",
	"25": "au\u4EE5\u5916\u7740",
	"2A": "\u79FB\u52D5\u4F53\u767A",
	"30": "FC-DX",
	"31": "FC-DX\u96FB\u8A71\u767A\u96FB\u8A71\u7740",
	"32": "FC-DX\u96FB\u8A71\u767ADL\u7740",
	"36": "FC-DX\u643A\u5E2F\u767A\u96FB\u8A71\u7740",
	"37": "FC-DX\u643A\u5E2F\u767ADL\u7740",
	"38": "FC-DXPHS\u767A\u96FB\u8A71\u7740",
	"39": "FC-DXPHS\u767ADL\u7740",
	"3B": "FC-DX\u96FB\u8A71\u767AIP\u96FB\u8A71\u7740",
	"3C": "FC-DX\u643A\u5E2F\u767AIP\u96FB\u8A71\u7740",
	"3D": "FC-DXPHS\u767AIP\u96FB\u8A71\u7740",
	"41": "\uFF8C\uFF98\uFF70\uFF8C\uFF6B\uFF9D\u96FB\u8A71\u767A\u96FB\u8A71\u7740",
	"42": "\uFF8C\uFF98\uFF70\uFF8C\uFF6B\uFF9D\u96FB\u8A71\u767ADL\u7740",
	"46": "\uFF8C\uFF98\uFF70\uFF8C\uFF6B\uFF9D\u643A\u5E2F\u767A\u96FB\u8A71\u7740",
	"47": "\uFF8C\uFF98\uFF70\uFF8C\uFF6B\uFF9D\u643A\u5E2F\u767ADL\u7740",
	"48": "\uFF8C\uFF98\uFF70\uFF8C\uFF6B\uFF9DPHS\u767A\u96FB\u8A71\u7740",
	"49": "\uFF8C\uFF98\uFF70\uFF8C\uFF6B\uFF9DPHS\u767ADL\u7740",
	"4B": "\uFF8C\uFF98\uFF70\uFF8C\uFF6B\uFF9D\u96FB\u8A71\u767AIP\u96FB\u8A71\u7740",
	"4C": "\uFF8C\uFF98\uFF70\uFF8C\uFF6B\uFF9D\u643A\u5E2F\u767AIP\u96FB\u8A71\u7740",
	"4D": "\uFF8C\uFF98\uFF70\uFF8C\uFF6B\uFF9DPHS\u767AIP\u96FB\u8A71\u7740",
	"52": "23\uFF8C\uFF98\uFF70\uFF7A\uFF70\uFF99\u96FB\u8A71\u767ADL\u7740",
	"5B": "23\uFF8C\uFF98\uFF70\uFF7A\uFF70\uFF99\u96FB\u8A71\u767AIP\u96FB\u8A71\u7740",
	"5C": "23\uFF8C\uFF98\uFF70\uFF7A\uFF70\uFF99\u643A\u5E2F\u767AIP\u96FB\u8A71\u7740",
	"5D": "23\uFF8C\uFF98\uFF70\uFF7A\uFF70\uFF99PHS\u767AIP\u96FB\u8A71\u7740",
	"60": "\u56FD\u5185DOD(\uFF72\uFF9D\uFF84\uFF97)",
	"70": "\u56FD\u5185DOD(\uFF71\uFF90\uFF6D\uFF70\uFF7D\uFF9E\uFF92\uFF9D\uFF84)",
	"80": "\u56FD\u969B",
	"90": "au\u7279\u5225\uFF80\uFF98\uFF8C",
	A0: "\u56FD\u5185DOD\u30D1\u30C3\u30AF"
};
var H_TekiyouTuusinKubun = {
	"20": "\u56FD\u5185",
	"80": "\u56FD\u969B"
};
var H_Result = dbh.getHash("select pactid,compname from pact_tb order by pactid", true);
var pactCnt = H_Result.length;

for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) {
	H_Pactid[H_Result[pactCounter].pactid] = H_Result[pactCounter].compname;
}

H_Result = dbh.getHash("select code,name from utiwake_tb where carid = " + G_CARRIER_KDDI_KOTEI + "order by code", true);
var codeCnt = H_Result.length;
var H_Code = Array();

for (var codeCounter = 0; codeCounter < codeCnt; codeCounter++) //内訳コードマスターを作成
{
	H_Code[H_Result[codeCounter].code] = H_Result[codeCounter].name;
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var tel_tb = "tel_tb";
var postrel_tb = "post_relation_tb";
var telX_tb = "tel_" + tableNo + "_tb";
var postX_tb = "post_" + tableNo + "_tb";
var postrelX_tb = "post_relation_" + tableNo + "_tb";
var teldetails_tb = "tel_details_" + tableNo + "_tb";
var dummytel_tb = "dummy_tel_tb";
var commhistory_tb = "commhistory_" + tableNo + "_tb";
pactCnt = A_pactid.length;
A_pactid.sort();
var A_pactDone = Array();
var teldetailsFile = dataDir + "/" + teldetails_tb + year + month + pactid + ".ins";
var telFile = dataDir + "/" + tel_tb + year + month + pactid + ".ins";
var telXFile = dataDir + "/" + telX_tb + year + month + pactid + ".ins";
var commhistoryFile = dataDir + "/" + commhistory_tb + year + month + pactid + ".ins";
var fp_teldetails = fopen(teldetailsFile, "w");
var fp_tel = fopen(telFile, "w");
var fp_telX = fopen(telXFile, "w");
var fp_commhistory = fopen(commhistoryFile, "w");
var now = getTimestamp();

for (pactCounter = 0;; pactCounter < pactCnt; pactCounter++) //請求データディレクトリにある契約ＩＤがマスターに登録されている場合
{
	if (undefined !== H_Pactid[A_pactid[pactCounter]] == true) //処理する請求データファイル名配列
		//請求データファイル名を取得する
		//ファイル名順でソート
		//請求データファイルがなかった場合
		//請求データディレクトリにある契約ＩＤがマスターに登録されていない場合
		{
			var A_billFile = Array();
			var dataDirPact = dataDir + "/" + A_pactid[pactCounter];
			dirh = opendir(dataDirPact);

			while (fileName = readdir(dirh)) {
				if (is_file(dataDirPact + "/" + fileName) == true) {
					A_billFile.push(fileName);
				}

				clearstatcache();
			}

			A_billFile.sort();

			if (A_billFile.length == 0) //請求データファイルがあった場合
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
					closedir(dirh);
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
					var H_FileData = Array();
					var H_filePact = Array();
					var H_fileBillDate = Array();
					var H_MargeData = Array();
					var H_MargeDataDummy = Array();
					var H_MargeDataTuusin = Array();
					var A_telno = Array();
					var A_telnoX = Array();
					var H_telnoXAnother = Array();
					var aspFlg = false;
					var aspCharge = 0;
					var A_telOutputBuff = Array();
					var A_telXOutputBuff = Array();
					var A_teldetailsOutputBuff = Array();
					var A_commhistoryOutputBuff = Array();
					var H_DummyData = Array();
					var H_DummyTel = "";
					var H_kokyakuno = Array();
					var A_tmp = Array();
					var multifileCnt = 0;
					var old_kokyakuno = "";
					var A_uniqTelnoX = Array();
					var rootPostid = getRootPostid(A_pactid[pactCounter], postrel_tb);
					var rootPostidX = getRootPostid(A_pactid[pactCounter], postrelX_tb);

					for (var fileCounter = 0; fileCounter < A_billFile.length; fileCounter++) //請求年月チェック
					//レコードサイズチェック
					//お客様番号がキーとして存在していない場合
					//契約ＩＤチェック
					{
						if (undefined !== H_fileBillDate[A_billFile[fileCounter]] == false) //パラメータの請求年月とファイル名の請求年月が違う場合
							{
								if (A_billFile[fileCounter].substr(4, 6) != date("Ym", mktime(0, 0, 0, month, 1, year))) //エラーとなった契約ＩＤはとばすが処理は続ける
									{
										logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + A_billFile[fileCounter] + "\uFF09\u8ACB\u6C42\u5E74\u6708\u304C\u4E0D\u6B63\u3067\u3059");
										continue;
									}

								H_fileBillDate[A_billFile[fileCounter]] = A_billFile[fileCounter].substr(4, 6);
							}

						H_FileData[A_billFile[fileCounter]] = file(dataDirPact + "/" + A_billFile[fileCounter]);

						if (LINESIZE != rtrim(H_FileData[A_billFile[fileCounter]][0], "\r\n").length) //エラーとなった契約ＩＤはとばすが処理は続ける
							{
								logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + A_billFile[fileCounter] + "\uFF09\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u4E0D\u6B63\u3067\u3059");
								continue;
							}

						for (var lineCounter = 0; lineCounter < H_FileData[A_billFile[fileCounter]].length; lineCounter++) //レコード区分が「１０」のレコードを検索(複数ある場合も最初の１個のみ取得)
						{
							if (ACCOUNT_HEADER_KUBUN == H_FileData[A_billFile[fileCounter]][lineCounter].substr(KUBUN_START, KUBUN_LENGTH)) {
								var account = H_FileData[A_billFile[fileCounter]][lineCounter].substr(2, 10);
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
								var sql = "select pactid from bill_prtel_tb where carid = " + G_CARRIER_KDDI_KOTEI + " " + "and prtelno = '" + account + "'";
								H_filePact[A_billFile[fileCounter]] = dbh.getOne(sql, true);

								if (H_filePact[A_billFile[fileCounter]] == "") //エラーとなった契約ＩＤはとばすが処理は続ける
									{
										logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + A_billFile[fileCounter] + "\uFF09\u306E\u304A\u5BA2\u69D8\u756A\u53F7\uFF08" + account + "\uFF09\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
										continue;
									}

								if (H_filePact[A_billFile[fileCounter]] != A_pactid[pactCounter]) //エラーとなった契約ＩＤはとばすが処理は続ける
									{
										logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + A_billFile[fileCounter] + "\uFF09\u5951\u7D04\uFF29\uFF24\u304C\u4E0D\u6B63\u3067\u3059");
										continue;
									}
							}
					}

					asort(H_kokyakuno);
					multifileCnt = Object.keys(H_kokyakuno).length;

					for (var kokyakuno of Object.values(Object.keys(H_kokyakuno))) //お客様番号が切り替わった時の処理
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

						for (var filename of Object.values(H_kokyakuno[kokyakuno])) //番号毎の小計（区分：３９）が０円なのに請求明細がある場合は、請求明細を除外する 2010/9/9 s.maeda
						//１行ずつ処理する
						//END １行ずつ処理する
						{
							var A_exceptTelno = Array();

							for (lineCounter = 0;; lineCounter < H_FileData[filename].length; lineCounter++) //初期化
							//$A_tmp = array();
							//ダミー電話番号を未取得の場合
							//初期化
							//区分毎の処理
							{
								if (undefined !== H_DummyTel[kokyakuno] == false) //pactidとお客様番号をもとにダミー電話番号とダミー電話番号用部署ＩＤを取得する
									//ダミー電話番号が設定されていない場合
									{
										H_DummyData = getDummy(A_pactid[pactCounter], kokyakuno);

										if (H_DummyData.length == 0) //エラーとなった契約ＩＤはとばすが処理は続ける
											//ダミー電話番号が設定されていた場合
											{
												logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + filename + "\uFF09\u306E\u30C0\u30DF\u30FC\u96FB\u8A71\u756A\u53F7\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
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
																logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + filename + "\uFF09\u306E\u30C0\u30DF\u30FC\u96FB\u8A71\u756A\u53F7\uFF08" + H_DummyData[0].telno + "\uFF09\u306E\u6240\u5C5E\u90E8\u7F72\uFF29\uFF24\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
																continue;
															} else //ダミー電話番号とダミー電話番号を所属させる部署ＩＤ
															{
																H_DummyTel[kokyakuno] = [H_DummyData[0].telno, H_DummyData[0].postid];
															}
													}
											}
									}

								var kubun = H_FileData[filename][lineCounter].substr(KUBUN_START, KUBUN_LENGTH);
								var telno_view = telno = utiwake_code = charge = tax_kubun = comment = "";
								var tax_taisyou_charge = tougetu = tax_charge = kurikoshi = tyousei = entai = jyuutou = seikyuu = "";
								var bunrui = syubetu = totelno = date = time = tuwajikan = fromplace = toplace = "";

								switch (kubun) {
									case TUUSIN_MEISAI_KUBUN:
										telno = str_replace("-", "", rtrim(H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].telno.start, H_Format[TUUSIN_MEISAI_KUBUN].telno.length), " "));

										if ("" != rtrim(H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].bunrui.start, H_Format[TUUSIN_MEISAI_KUBUN].bunrui.length), " ")) {
											bunrui = H_ServiceBunrui[H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].bunrui.start, H_Format[TUUSIN_MEISAI_KUBUN].bunrui.length)];
										}

										if ("" != rtrim(H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].syubetu.start, H_Format[TUUSIN_MEISAI_KUBUN].syubetu.length), " ")) {
											syubetu = H_ServiceSyubetsu[H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].syubetu.start, H_Format[TUUSIN_MEISAI_KUBUN].syubetu.length).trim()];
										}

										totelno = rtrim(H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].totelno.start, H_Format[TUUSIN_MEISAI_KUBUN].totelno.length), " ");
										date = H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].date.start, H_Format[TUUSIN_MEISAI_KUBUN].date.length);
										time = H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].time.start, H_Format[TUUSIN_MEISAI_KUBUN].time.length);
										tuwajikan = H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].tuwajikan.start, H_Format[TUUSIN_MEISAI_KUBUN].tuwajikan.length);
										fromplace = mb_convert_encoding(rtrim(H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].fromplace.start, H_Format[TUUSIN_MEISAI_KUBUN].fromplace.length), " "), "UTF-8", "JIS");
										toplace = mb_convert_encoding(rtrim(H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].toplace.start, H_Format[TUUSIN_MEISAI_KUBUN].toplace.length), " "), "UTF-8", "JIS");
										charge = H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_MEISAI_KUBUN].charge.start, H_Format[TUUSIN_MEISAI_KUBUN].charge.length) / 100;
										break;

									case WARIBIKI_MEISAI_KUBUN:
										telno_view = rtrim(H_FileData[filename][lineCounter].substr(H_Format[WARIBIKI_MEISAI_KUBUN].telno.start, H_Format[WARIBIKI_MEISAI_KUBUN].telno.length), " ");
										telno = str_replace("-", "", telno_view);
										utiwake_code = WARIBIKI_MEISAI_KUBUN + "-" + H_FileData[filename][lineCounter].substr(H_Format[WARIBIKI_MEISAI_KUBUN].utiwake.start, H_Format[WARIBIKI_MEISAI_KUBUN].utiwake.length);
										charge = H_FileData[filename][lineCounter].substr(H_Format[WARIBIKI_MEISAI_KUBUN].charge.start, H_Format[WARIBIKI_MEISAI_KUBUN].charge.length) * -1;
										tax_kubun = H_TaxMaster[H_FileData[filename][lineCounter].substr(H_Format[WARIBIKI_MEISAI_KUBUN].tax_kubun.start, H_Format[WARIBIKI_MEISAI_KUBUN].tax_kubun.length)];
										comment = H_TekiyouTuusinKubunWaribiki[H_FileData[filename][lineCounter].substr(H_Format[WARIBIKI_MEISAI_KUBUN].tekiyou.start, H_Format[WARIBIKI_MEISAI_KUBUN].tekiyou.length)];
										break;

									case KIHON_KOUJI_KUBUN:
										telno_view = rtrim(H_FileData[filename][lineCounter].substr(H_Format[KIHON_KOUJI_KUBUN].telno.start, H_Format[KIHON_KOUJI_KUBUN].telno.length), " ");
										telno = str_replace("-", "", telno_view);
										utiwake_code = KIHON_KOUJI_KUBUN + "-" + H_FileData[filename][lineCounter].substr(H_Format[KIHON_KOUJI_KUBUN].utiwake.start, H_Format[KIHON_KOUJI_KUBUN].utiwake.length);
										charge = H_FileData[filename][lineCounter].substr(H_Format[KIHON_KOUJI_KUBUN].charge.start, H_Format[KIHON_KOUJI_KUBUN].charge.length) * 1;
										tax_kubun = H_TaxMaster[H_FileData[filename][lineCounter].substr(H_Format[KIHON_KOUJI_KUBUN].tax_kubun.start, H_Format[KIHON_KOUJI_KUBUN].tax_kubun.length)];
										comment = H_TekiyouTuusinKubun[H_FileData[filename][lineCounter].substr(H_Format[KIHON_KOUJI_KUBUN].tekiyou.start, H_Format[KIHON_KOUJI_KUBUN].tekiyou.length)];
										break;

									case TOUGOU_SEIKYUU_KUBUN:
										telno_view = rtrim(H_FileData[filename][lineCounter].substr(H_Format[TOUGOU_SEIKYUU_KUBUN].telno.start, H_Format[TOUGOU_SEIKYUU_KUBUN].telno.length), " ");
										telno = str_replace("-", "", telno_view);
										utiwake_code = TOUGOU_SEIKYUU_KUBUN + "-" + H_FileData[filename][lineCounter].substr(H_Format[TOUGOU_SEIKYUU_KUBUN].utiwake.start, H_Format[TOUGOU_SEIKYUU_KUBUN].utiwake.length);
										charge = H_FileData[filename][lineCounter].substr(H_Format[TOUGOU_SEIKYUU_KUBUN].charge.start, H_Format[TOUGOU_SEIKYUU_KUBUN].charge.length) * 1;
										tax_kubun = H_TaxMaster[H_FileData[filename][lineCounter].substr(H_Format[TOUGOU_SEIKYUU_KUBUN].tax_kubun.start, H_Format[TOUGOU_SEIKYUU_KUBUN].tax_kubun.length)];
										comment = "\u3054\u5229\u7528\u671F\u9593 ";
										comment += H_FileData[filename][lineCounter].substr(H_Format[TOUGOU_SEIKYUU_KUBUN].riyou_kaishi.start, H_Format[TOUGOU_SEIKYUU_KUBUN].riyou_kaishi.length);
										comment += "\uFF5E" + H_FileData[filename][lineCounter].substr(H_Format[TOUGOU_SEIKYUU_KUBUN].riyou_syuuryou.start, H_Format[TOUGOU_SEIKYUU_KUBUN].riyou_syuuryou.length);
										break;

									case KONTENTU_MEISAI_KUBUN:
										telno_view = rtrim(H_FileData[filename][lineCounter].substr(H_Format[KONTENTU_MEISAI_KUBUN].telno.start, H_Format[KONTENTU_MEISAI_KUBUN].telno.length), " ");
										telno = str_replace("-", "", telno_view);
										utiwake_code = KONTENTU_MEISAI_KUBUN + "-" + H_FileData[filename][lineCounter].substr(H_Format[KONTENTU_MEISAI_KUBUN].utiwake.start, H_Format[KONTENTU_MEISAI_KUBUN].utiwake.length);
										charge = H_FileData[filename][lineCounter].substr(H_Format[KONTENTU_MEISAI_KUBUN].charge.start, H_Format[KONTENTU_MEISAI_KUBUN].charge.length) * 1;
										tax_kubun = H_TaxMaster[H_FileData[filename][lineCounter].substr(H_Format[KONTENTU_MEISAI_KUBUN].tax_kubun.start, H_Format[KONTENTU_MEISAI_KUBUN].tax_kubun.length)];
										comment = "\u3054\u5229\u7528\u671F\u9593 ";
										comment += H_FileData[filename][lineCounter].substr(H_Format[KONTENTU_MEISAI_KUBUN].riyou_kaishi.start, H_Format[KONTENTU_MEISAI_KUBUN].riyou_kaishi.length);
										comment += "\uFF5E" + H_FileData[filename][lineCounter].substr(H_Format[KONTENTU_MEISAI_KUBUN].riyou_syuuryou.start, H_Format[KONTENTU_MEISAI_KUBUN].riyou_syuuryou.length);
										break;

									case TUUSIN_KOKUNAI_KUBUN:
										telno_view = rtrim(H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_KOKUNAI_KUBUN].telno.start, H_Format[TUUSIN_KOKUNAI_KUBUN].telno.length), " ");
										telno = str_replace("-", "", telno_view);
										utiwake_code = KOKUNAI_KAZEI;
										charge = H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_KOKUNAI_KUBUN].charge.start, H_Format[TUUSIN_KOKUNAI_KUBUN].charge.length) * 1;
										var waribiki = H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_KOKUNAI_KUBUN].waribiki.start, H_Format[TUUSIN_KOKUNAI_KUBUN].waribiki.length) * 1;
										var kihon_kouji = H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_KOKUNAI_KUBUN].kihon_kouji.start, H_Format[TUUSIN_KOKUNAI_KUBUN].kihon_kouji.length) * 1;
										tax_taisyou_charge = H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_KOKUNAI_KUBUN].tax_taisyou_charge.start, H_Format[TUUSIN_KOKUNAI_KUBUN].tax_taisyou_charge.length) * 1;
										tax_kubun = H_TaxMaster[0];
										break;

									case TUUSIN_KOKUSAI_KUBUN:
										telno_view = rtrim(H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_KOKUSAI_KUBUN].telno.start, H_Format[TUUSIN_KOKUSAI_KUBUN].telno.length), " ");
										telno = str_replace("-", "", telno_view);
										utiwake_code = KOKUSAI;
										charge = H_FileData[filename][lineCounter].substr(H_Format[TUUSIN_KOKUSAI_KUBUN].charge.start, H_Format[TUUSIN_KOKUSAI_KUBUN].charge.length) * 1;
										tax_kubun = H_TaxMaster[1];
										break;

									case BANGOU_SYOUKEI_KUBUN:
										telno_view = rtrim(H_FileData[filename][lineCounter].substr(H_Format[BANGOU_SYOUKEI_KUBUN].telno.start, H_Format[BANGOU_SYOUKEI_KUBUN].telno.length), " ");
										telno = str_replace("-", "", telno_view);
										charge = H_FileData[filename][lineCounter].substr(H_Format[BANGOU_SYOUKEI_KUBUN].charge.start, H_Format[BANGOU_SYOUKEI_KUBUN].charge.length) * 1;
										break;

									case ACCOUNT_MEISAI_KUBUN:
										telno = telno_view = H_DummyTel[kokyakuno][0];
										utiwake_code = ACCOUNT_MEISAI_KUBUN + "-" + H_FileData[filename][lineCounter].substr(H_Format[ACCOUNT_MEISAI_KUBUN].utiwake.start, H_Format[ACCOUNT_MEISAI_KUBUN].utiwake.length);
										charge = H_FileData[filename][lineCounter].substr(H_Format[ACCOUNT_MEISAI_KUBUN].charge.start, H_Format[ACCOUNT_MEISAI_KUBUN].charge.length) * 1;
										break;

									case SEIKYUU_GOUKEI_KUBUN:
										telno = telno_view = H_DummyTel[kokyakuno][0];
										tougetu = H_FileData[filename][lineCounter].substr(H_Format[SEIKYUU_GOUKEI_KUBUN].tougetu.start, H_Format[SEIKYUU_GOUKEI_KUBUN].tougetu.length) * 1;
										tax_charge = H_FileData[filename][lineCounter].substr(H_Format[SEIKYUU_GOUKEI_KUBUN].tax_charge.start, H_Format[SEIKYUU_GOUKEI_KUBUN].tax_charge.length) * 1;
										kurikoshi = H_FileData[filename][lineCounter].substr(H_Format[SEIKYUU_GOUKEI_KUBUN].kurikoshi.start, H_Format[SEIKYUU_GOUKEI_KUBUN].kurikoshi.length) * 1;
										tyousei = H_FileData[filename][lineCounter].substr(H_Format[SEIKYUU_GOUKEI_KUBUN].tyousei.start, H_Format[SEIKYUU_GOUKEI_KUBUN].tyousei.length) * 1;
										entai = H_FileData[filename][lineCounter].substr(H_Format[SEIKYUU_GOUKEI_KUBUN].entai.start, H_Format[SEIKYUU_GOUKEI_KUBUN].entai.length) * 1;
										jyuutou = H_FileData[filename][lineCounter].substr(H_Format[SEIKYUU_GOUKEI_KUBUN].jyuutou.start, H_Format[SEIKYUU_GOUKEI_KUBUN].jyuutou.length) * 1;
										seikyuu = H_FileData[filename][lineCounter].substr(H_Format[SEIKYUU_GOUKEI_KUBUN].seikyuu.start, H_Format[SEIKYUU_GOUKEI_KUBUN].seikyuu.length) * 1;
										break;

									default:
										break;
								}

								if (-1 !== Object.keys(H_Format).indexOf(kubun) == true) //番号毎の小計（区分：３９）が０円なのに請求明細がある場合は、請求明細を除外する 2010/9/9 s.maeda
									//請求合計区分、番号毎の小計区分以外で料金が０円の場合はスキップする
									{
										if (SEIKYUU_GOUKEI_KUBUN != kubun && BANGOU_SYOUKEI_KUBUN != kubun && 0 == charge) //番号毎の小計区分の場合
											{
												continue;
											} else if (BANGOU_SYOUKEI_KUBUN == kubun) //料金が０円の場合
											{
												if (0 == charge) //除外する電話番号リストに追加する
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
												H_MargeData[kokyakuno].push([telno, telno_view, KOKUNAI_KAZEI, tax_taisyou_charge - kihon_kouji, "", H_TaxMaster[0]]);

												if (waribiki != 0) //割引額
													{
														H_MargeData[kokyakuno].push([telno, telno_view, KOKUNAI_KAZEI_WARIBIKI, waribiki, "", H_TaxMaster[0]]);
													}
											} else if (ACCOUNT_MEISAI_KUBUN == kubun) //区分が請求合計の場合の処理
											{
												H_MargeDataDummy[kokyakuno].push([telno, telno_view, utiwake_code, charge, "", ""]);
											} else if (SEIKYUU_GOUKEI_KUBUN == kubun) //消費税
											{
												if (0 != tax_charge) {
													H_MargeDataDummy[kokyakuno].push([telno, telno_view, TAX, tax_charge, "", ""]);
												}

												if (0 != kurikoshi) {
													H_MargeDataDummy[kokyakuno].push([telno, telno_view, KURIKOSHI, kurikoshi, "", ""]);
												}

												if (0 != tyousei) {
													H_MargeDataDummy[kokyakuno].push([telno, telno_view, TYOUSEI, tyousei, "", ""]);
												}

												if (0 != entai) {
													H_MargeDataDummy[kokyakuno].push([telno, telno_view, ENTAIRISOKU, entai, "", ""]);
												}

												if (0 != jyuutou) {
													H_MargeDataDummy[kokyakuno].push([telno, telno_view, JYUUTOU, jyuutou, "", ""]);
												}

												if (0 != seikyuu) {
													H_MargeDataDummy[kokyakuno].push([telno, telno_view, SEIKYUU, seikyuu, "", ""]);
												}
											} else if (TUUSIN_MEISAI_KUBUN == kubun) //区分が国内通信・請求合計以外、または国内通信全てが課税対象の場合の処理
											{
												var timestamp = date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2) + " " + time.substr(0, 2) + ":" + time.substr(2, 2) + ":" + time.substr(4, 2);
												var tuwajikan_formated = tuwajikan.substr(0, 3) + ":" + tuwajikan.substr(3, 2) + ":" + tuwajikan.substr(5, 2) + "." + tuwajikan.substr(7, 1);
												H_MargeDataTuusin[kokyakuno].push([telno, bunrui, syubetu, totelno, timestamp, tuwajikan_formated, fromplace, toplace, charge]);
											} else {
											H_MargeData[kokyakuno].push([telno, telno_view, utiwake_code, charge, comment, tax_kubun]);
										}
									}
							}
						}

						var dataCnt = H_MargeData[kokyakuno].length;

						for (var cnt = 0; cnt < dataCnt; cnt++) //除外対象電話番号かをチェック
						{
							if (-1 !== A_exceptTelno.indexOf(H_MargeData[kokyakuno][cnt][0]) == true) //除外対象なら請求データを削除する
								{
									delete H_MargeData[kokyakuno][cnt];
								}
						}

						old_kokyakuno = kokyakuno;
					}

					ksort(H_MargeData);

					if (chkAsp(A_pactid[pactCounter]) == true) //ASP利用料を取得
						//ASP利用料が設定されていない場合
						{
							aspFlg = true;
							aspCharge = getAsp(A_pactid[pactCounter]);

							if (is_null(aspCharge)) //エラーとなった契約ＩＤはとばすが処理は続ける
								{
									logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\uFF2B\uFF24\uFF24\uFF29\u56FA\u5B9A \uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
									continue;
								}
						}

					var sql_str = `select telno from ${tel_tb} where pactid = ` + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_KDDI_KOTEI + " order by telno";

					for (var data of Object.values(dbh.getHash(sql_str, true))) {
						A_telno.push(data.telno);
					}

					sql_str = `select telno from ${telX_tb} where pactid = ` + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_KDDI_KOTEI + " order by telno";

					for (var data of Object.values(dbh.getHash(sql_str, true))) {
						A_telnoX.push(data.telno);
					}

					sql_str = "select postid,telno,telno_view,carid,employeecode,username," + "mail,text1,text2,text3,text4,text5,text6,text7,text8,text9,text10," + "text11,text12,text13,text14,text15,int1,int2,int3,date1,date2,memo," + "int4,int5,int6,date3,date4,date5,date6,mail1,mail2,mail3,url1,url2,url3 " + `from ${telX_tb} where pactid = ` + A_pactid[pactCounter] + " and " + "carid != " + G_CARRIER_KDDI_KOTEI + " order by telno,carid";
					var oldTelno = "";

					for (var data of Object.values(dbh.getHash(sql_str, true))) {
						if (data.telno != oldTelno) {
							if ("" == data.int1) {
								var int1 = "\\N";
							}

							if ("" == data.int2) {
								var int2 = "\\N";
							}

							if ("" == data.int3) {
								var int3 = "\\N";
							}

							if ("" == data.int4) {
								var int4 = "\\N";
							}

							if ("" == data.int5) {
								var int5 = "\\N";
							}

							if ("" == data.int6) {
								var int6 = "\\N";
							}

							if ("" == data.date1) {
								var date1 = "\\N";
							}

							if ("" == data.date2) {
								var date2 = "\\N";
							}

							if ("" == data.date3) {
								var date3 = "\\N";
							}

							if ("" == data.date4) {
								var date4 = "\\N";
							}

							if ("" == data.date5) {
								var date5 = "\\N";
							}

							if ("" == data.date6) {
								var date6 = "\\N";
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

						for (var data of Object.values(dbh.getHash(sql_str, true))) {
							A_uniqTelnoX.push(data.telno);
						}
					}

					var telCnt = A_telno.length;
					var telCntX = A_telnoX.length;
					var A_uniqTelno = Array();
					var H_dupliTelno = Array();
					var A_telAddList = Array();
					var A_telXAddList = Array();

					for (var kokyakuno of Object.values(Object.keys(H_kokyakuno))) //マージ配列のソート（電話番号、内訳コード昇順）
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
						var margeCnt = H_MargeData[kokyakuno].length;
						var telChkFlg = false;
						var telAddFlg = true;
						var telAddFlgX = true;
						var detailNo = 0;
						oldTelno = "";
						var sumChargePact = 0;
						var sumCharge = 0;
						var sumTax = 0;
						var noTaxCharge = 0;
						var billTax = 0;
						var billKurikoshi = 0;
						var billTyousei = 0;
						var billEntai = 0;
						var billJyuutou = 0;
						var billSeikyuu = 0;
						var H_DummyCharge = Array();

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
													logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF(" + H_kokyakuno[kokyakuno].join(",") + ")\u306B\u3042\u308B\u96FB\u8A71\u756A\u53F7" + H_MargeData[kokyakuno][margeCounter][0] + "\u304C\u65E2\u306B\uFF24\uFF22\u306E\u5B58\u5728\u3059\u308B\u305F\u3081\u8FFD\u8A18\u30E2\u30FC\u30C9\u3067\u53D6\u308A\u8FBC\u307F\u3067\u304D\u307E\u305B\u3093\u3002");
													continue;
												}
										}
								}

							oldTelno = H_MargeData[kokyakuno][margeCounter][0];
						}

						oldTelno = "";

						for (margeCounter = 0;; margeCounter < margeCnt; margeCounter++) //電話番号が変わったときの処理
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
													var memo = str_replace(["\r\n", "\n"], "LFkaigyoLF", H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].memo);
													A_telXOutputBuff.push(A_pactid[pactCounter] + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].postid + "\t" + H_MargeData[kokyakuno][margeCounter][0] + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].telno_view + "\t" + "\\N\t" + G_CARRIER_KDDI_KOTEI + "\t" + KDDI_KOTEI_AREA_ID + "\t" + KDDI_KOTEI_CIRCUIT_ID + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].employeecode + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].username + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].mail + "\t" + "\\N\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text2 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text3 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text4 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text5 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text6 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text7 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text8 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text9 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text10 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text11 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text12 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text13 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text14 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].text15 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int2 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int3 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date2 + "\t" + memo + "\t" + "\\N\t\\N\t\\N\t" + now + "\t" + now + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int4 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int5 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].int6 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date3 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date4 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date5 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].date6 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].mail1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].mail2 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].mail3 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].url1 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].url2 + "\t" + H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].url3 + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N" + "\n");
												} else //tel_X_tb に追加する電話を出力
												{
													if (H_MargeData[kokyakuno][margeCounter][0] != H_DummyTel[kokyakuno][0]) {
														A_telXOutputBuff.push(A_pactid[pactCounter] + "\t" + rootPostidX + "\t" + H_MargeData[kokyakuno][margeCounter][0] + "\t" + H_MargeData[kokyakuno][margeCounter][1] + "\t\\N\t" + G_CARRIER_KDDI_KOTEI + "\t" + KDDI_KOTEI_AREA_ID + "\t" + KDDI_KOTEI_CIRCUIT_ID + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t" + now + "\t" + now + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\n");
													} else {
														A_telXOutputBuff.push(A_pactid[pactCounter] + "\t" + H_DummyTel[kokyakuno][1] + "\t" + H_MargeData[kokyakuno][margeCounter][0] + "\t" + H_MargeData[kokyakuno][margeCounter][1] + "\t\\N\t" + G_CARRIER_KDDI_KOTEI + "\t" + KDDI_KOTEI_AREA_ID + "\t" + KDDI_KOTEI_CIRCUIT_ID + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\tKDDI\u56FA\u5B9A\u8ABF\u6574\u91D1\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t" + now + "\t" + now + "\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t\\N\t" + "\\N\t\\N\n");
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
																memo = str_replace(["\r\n", "\n"], "LFkaigyoLF", H_telnoXAnother[H_MargeData[kokyakuno][margeCounter][0]].memo);
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
								logh.putError(G_SCRIPT_ERROR, "\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u5185\u8A33\u30B3\u30FC\u30C9[" + H_MargeData[kokyakuno][margeCounter][2] + "]\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F\n\u5185\u8A33\u30B3\u30FC\u30C9\u3092\u66F4\u65B0\u3057\u3066\u304B\u3089\u3001\u518D\u5EA6\u51E6\u7406\u3092\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002");
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
													var keyNo = array_search(A_pactid[pactCounter] + "\t" + H_MargeData[kokyakuno][margeCounter][0] + "\t" + G_CODE_ASP + "\t" + H_Code[G_CODE_ASP] + "\t" + aspCharge + "\t\\N\t" + (detailNo + 1) + "\t" + now + "\t" + G_CARRIER_KDDI_KOTEI + "\t\t\n", A_teldetailsOutputBuff);
													var A_teldetailsOutputBuff_bef = A_teldetailsOutputBuff.slice(0, keyNo);
													var A_teldetailsOutputBuff_aft = A_teldetailsOutputBuff.slice(keyNo + 2);
													A_teldetailsOutputBuff = array_merge(A_teldetailsOutputBuff_bef, A_teldetailsOutputBuff_aft);
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

							for (var code of Object.values(Object.keys(H_DummyCharge))) //消費税の場合
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
								logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u5408\u8A08\u91D1\u984D\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093");
								continue;
							}

						for (var recCnt = 0; recCnt < H_MargeDataTuusin[kokyakuno].length; recCnt++) {
							A_commhistoryOutputBuff.push(A_pactid[pactCounter] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][0] + "\t" + TUWA_TYPE + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][4] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][3] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][7] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][6] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][5] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][8] + "\t" + G_CARRIER_KDDI_KOTEI + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][1] + "\t" + H_MargeDataTuusin[kokyakuno][recCnt][2] + "\n");
						}
					}

					var outTelCnt = outTelXCnt = outTeldetailsCnt = outCommhistoryCnt = 0;

					for (var value of Object.values(A_telOutputBuff)) {
						fwrite(fp_tel, value);
						outTelCnt++;
					}

					fflush(fp_tel);

					for (var value of Object.values(A_telXOutputBuff)) {
						fwrite(fp_telX, value);
						outTelXCnt++;
					}

					fflush(fp_telX);

					for (var value of Object.values(A_teldetailsOutputBuff)) {
						fwrite(fp_teldetails, value);
						outTeldetailsCnt++;
					}

					fflush(fp_teldetails);

					for (var value of Object.values(A_commhistoryOutputBuff)) {
						fwrite(fp_commhistory, value);
						outCommhistoryCnt++;
					}

					fflush(fp_commhistory);
					A_pactDone.push(A_pactid[pactCounter]);
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + H_Pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(" + tel_tb + ":" + outTelCnt + "\u4EF6," + telX_tb + ":" + outTelXCnt + "\u4EF6," + teldetails_tb + ":" + outTeldetailsCnt + "\u4EF6," + commhistory_tb + ":" + outCommhistoryCnt + "\u4EF6)");
				}

			closedir(dirh);
		} else {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + " \u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
	}
}

fclose(fp_teldetails);
fclose(fp_tel);
fclose(fp_telX);
fclose(fp_commhistory);
var pactDoneCnt = A_pactDone.length;

if (pactDoneCnt == 0) //処理する件数が０件をログ出力
	//処理終了をログ出力
	{
		logh.putError(G_SCRIPT_WARNING, "\u30A4\u30F3\u30DD\u30FC\u30C8\u53EF\u80FD\u306A\u8ACB\u6C42\u60C5\u5831\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F");
		logh.putError(G_SCRIPT_END, "\uFF2B\uFF24\uFF24\uFF29\u56FA\u5B9A\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u7D42\u4E86");
		lock(false);
		throw die(0);
	}

if (backup == "y") //tel_details_X_tb をエクスポートする
	//トランザクション開始
	//トランザクション内でないとカーソルが使えない
	//エクスポート失敗した場合
	//コミット
	{
		sql_str = "select * from " + teldetails_tb;
		var expFile = DATA_EXP_DIR + "/" + teldetails_tb + date("YmdHis") + ".exp";
		dbh.begin();

		if (doCopyExp(sql_str, expFile, dbh) != 0) {
			logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + teldetails_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
		} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + teldetails_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u5B8C\u4E86");
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
		var rtn = dbh.query(sql_str, false);

		if (DB.isError(rtn) == true) //ロールバック
			{
				dbh.rollback();
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + teldetails_tb + " \u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + teldetails_tb + " \u306E\u30C7\u30EA\u30FC\u30C8\u5B8C\u4E86");
		}

		sql_str = "delete from " + commhistory_tb + " where pactid in (" + A_pactDone.join(",") + ") and " + "carid = " + G_CARRIER_KDDI_KOTEI;
		rtn = dbh.query(sql_str, false);

		if (DB.isError(rtn) == true) //ロールバック
			{
				dbh.rollback();
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + commhistory_tb + " \u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + commhistory_tb + " \u306E\u30C7\u30EA\u30FC\u30C8\u5B8C\u4E86");
		}
	}

if (teltable == "n" && filesize(telFile) != 0) //tel_tb へのインポートが失敗した場合
	{
		var A_tel_col = ["pactid", "postid", "telno", "telno_view", "userid", "carid", "arid", "cirid", "machine", "color", "planid", "planalert", "packetid", "packetalert", "pointstage", "employeecode", "username", "mail", "orderdate", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "date1", "date2", "memo", "movepostid", "moveteldate", "delteldate", "recdate", "fixdate", "options", "contractdate", "finishing_f", "schedule_person_name", "schedule_person_userid", "schedule_person_postid", "kousiflg", "kousiptn", "exceptflg", "handflg", "hand_detail_flg", "username_kana", "kousi_fix_flg", "int4", "int5", "int6", "date3", "date4", "date5", "date6", "mail1", "mail2", "mail3", "url1", "url2", "url3", "buyselid", "discounts", "simcardno", "pre_telno", "pre_carid", "dummy_flg"];

		if (doCopyInsert(tel_tb, telFile, A_tel_col, dbh) != 0) //ロールバック
			{
				dbh.rollback();
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + tel_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + tel_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	}

if (filesize(telXFile) != 0) //tel_X_tb へのインポートが失敗した場合
	{
		var A_telX_col = ["pactid", "postid", "telno", "telno_view", "userid", "carid", "arid", "cirid", "machine", "color", "planid", "planalert", "packetid", "packetalert", "pointstage", "employeecode", "username", "mail", "orderdate", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "date1", "date2", "memo", "movepostid", "moveteldate", "delteldate", "recdate", "fixdate", "options", "contractdate", "finishing_f", "schedule_person_name", "schedule_person_userid", "schedule_person_postid", "kousiflg", "kousiptn", "exceptflg", "handflg", "hand_detail_flg", "username_kana", "kousi_fix_flg", "int4", "int5", "int6", "date3", "date4", "date5", "date6", "mail1", "mail2", "mail3", "url1", "url2", "url3", "buyselid", "discounts", "simcardno", "pre_telno", "pre_carid", "dummy_flg"];

		if (doCopyInsert(telX_tb, telXFile, A_telX_col, dbh) != 0) //ロールバック
			{
				dbh.rollback();
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + telX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + telX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	}

if (filesize(teldetailsFile) != 0) //tel_details_X_tb へのインポートが失敗した場合
	{
		var A_teldetails_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "tdcomment", "prtelno"];

		if (doCopyInsert(teldetails_tb, teldetailsFile, A_teldetails_col, dbh) != 0) //ロールバック
			{
				dbh.rollback();
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + teldetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + teldetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	}

if (filesize(commhistoryFile) != 0) //commhistory_X_tb へのインポートが失敗した場合
	{
		var A_commhistory_col = ["pactid", "telno", "type", "date", "totelno", "toplace", "fromplace", "time", "charge", "carid", "comservice", "sendrec"];

		if (doCopyInsert(commhistory_tb, commhistoryFile, A_commhistory_col, dbh) != 0) //ロールバック
			{
				dbh.rollback();
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + commhistory_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + commhistory_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	}

dbh.commit();

for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動先ディレクトリ
//移動先ディレクトリがなければ作成
//ファイルの移動
{
	var finDir = dataDir + "/" + A_pactDone[pactDoneCounter] + FIN_DIR;

	if (is_dir(finDir) == false) //移動先ディレクトリ作成失敗
		{
			if (mkdir(finDir, 700) == false) {
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			} else {
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u4F5C\u6210\u5B8C\u4E86");
			}
		}

	clearstatcache();
	dirh = opendir(dataDir + "/" + A_pactDone[pactDoneCounter]);

	while (mvFileName = readdir(dirh)) //ファイルなら移動する
	{
		if (is_file(dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName) == true) //移動が失敗した場合
			{
				if (rename(dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName, finDir + "/" + mvFileName) == false) {
					logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")");
				} else {
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " \u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u5B8C\u4E86(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")");
				}
			}

		clearstatcache();
	}

	closedir(dirh);
}

lock(false);
logh.putError(G_SCRIPT_END, "\uFF2B\uFF24\uFF24\uFF29\u56FA\u5B9A\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u7D42\u4E86");
throw die(0);

function usage(comment) {
	if (!("dbh" in global)) dbh = undefined;

	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n");
	print("Usage) " + SCRIPTNAME + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
	print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
	print("\t\t-t \u96FB\u8A71\u30C6\u30FC\u30D6\u30EB (N:tel_tb \u3078\u30A4\u30F3\u30B5\u30FC\u30C8,O:tel_X_tb \u3078\u30A4\u30F3\u30B5\u30FC\u30C8)\n\n");
	dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
	throw die(1);
};

function lock(is_lock) //ロックする
{
	if (!("dbh" in global)) dbh = undefined;
	var pre = "batch";
	var now = getTimestamp();

	if (is_lock == true) //既に起動中
		//ロック解除
		{
			dbh.begin();
			dbh.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "' and " + "status = 1;";
			var count = dbh.getOne(sql);

			if (count != 0) {
				dbh.rollback();
				dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + "\u591A\u91CD\u52D5\u4F5C");
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

function getDummy(pactid, reqno) //dummy_tbから所属部署ＩＤが取得できた場合
{
	if (!("dbh" in global)) dbh = undefined;
	if (!("dummytel_tb" in global)) dummytel_tb = undefined;
	if (!("postX_tb" in global)) postX_tb = undefined;
	var sql = "select telno,postid from " + dummytel_tb + " where pactid = " + pactid + " and " + "carid = " + G_CARRIER_KDDI_KOTEI + " and reqno = '" + reqno + "'";
	var H_data = dbh.getHash(sql);

	if (H_data.length != 0 && H_data[0].postid != "") //本当にpost_X_tbに存在しているかチェックする
		//post_X_tbに部署が存在しなかった場合はdummy_tbで所得した部署ＩＤはなかったことにする
		{
			var sql_str = `select postid from ${postX_tb} where pactid = ` + pactid + " and postid = " + H_data[0].postid;
			var rtn = dbh.getOne(sql_str);

			if (rtn == "") {
				H_data[0].postid = "";
			}
		}

	return H_data;
};

function getRootPostid(pactid, table) {
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select postidparent from " + table + " where pactid = " + pactid + " and " + "postidparent = postidchild and " + "level = 0";
	var rootPostid = dbh.getOne(sql_str, true);
	return rootPostid;
};

function chkAsp(pactid) {
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select count(*) from fnc_relation_tb where pactid = " + pactid + " and " + "fncid = " + G_AUTH_ASP;
	var count = dbh.getOne(sql_str);

	if (count == 0) {
		return false;
	} else {
		return true;
	}
};

function getAsp(pactid) {
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select charge from asp_charge_tb where pactid = " + pactid + " and " + "carid = " + G_CARRIER_KDDI_KOTEI;
	var charge = dbh.getOne(sql_str);
	return charge;
};

function doCopyExp(sql, filename, db) //ログファイルハンドラ
//エクスポートファイルを開く
//エクスポートファイルオープン失敗
//無限ループ
//カーソルを開放
{
	if (!("logh" in global)) logh = undefined;
	var fp = fopen(filename, "wt");

	if (fp == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		return 1;
	}

	db.query("declare exp_cur cursor for " + sql);

	for (; ; ) //ＤＢから結果取得
	{
		var result = pg_query(db.m_db.connection, "fetch " + NUM_FETCH + " in exp_cur");

		if (result == false) //ファイルクローズ
			//カーソルを開放
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "Fetch error, " + sql);
				fclose(fp);
				db.query("close exp_cur");
				return 1;
			}

		var A_line = pg_fetch_array(result);

		if (A_line == false) //ループ終了
			{
				break;
			}

		var str = "";

		do //データ区切り記号、初回のみ空
		{
			var delim = "";

			for (var item of Object.values(A_line)) //データ区切り記号
			//値がない場合はヌル（\N）をいれる
			{
				str += delim;
				delim = "\t";

				if (item == undefined) //nullを表す記号
					{
						str += "\\N";
					} else {
					str += item;
				}
			}

			str += "\n";
		} while (A_line = pg_fetch_array(result));

		if (fputs(fp, str) == false) //カーソルを開放
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "\u3078\u306E\u66F8\u304D\u8FBC\u307F\u5931\u6557\u3001" + str);
				fclose(fp);
				db.query("CLOSE exp_cur");
				return 1;
			}
	}

	db.query("CLOSE exp_cur");
	fclose(fp);
	return 0;
};

function doCopyInsert(table, filename, columns, db) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	if (!("logh" in global)) logh = undefined;
	if (!("pactid" in global)) pactid = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var fp = fopen(filename, "rt");

	if (!fp) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	var ins = new TableInserter(logh, db, filename + ".sql", true);
	ins.begin(table);

	while (line = fgets(fp)) //データはtab区切り
	//インサート行の追加
	{
		var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) //要素数が異なっていたら
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002\u30C7\u30FC\u30BF=" + line);
				fclose(fp);
				return 1;
			}

		var H_ins = Array();
		var idx = 0;

		for (var col of Object.values(columns)) //\N の場合はハッシュに追加しない
		{
			if (A_line[idx] != "\\N") {
				H_ins[col] = A_line[idx];
			}

			idx++;
		}

		if (ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F\u3001\u30C7\u30FC\u30BF=" + line);
			fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u306B\u5931\u6557.");
		fclose(fp);
		return 1;
	}

	fclose(fp);
	return 0;
};

function doCopyIn(table, filename, db) //ログファイルハンドラ
//インポートファイルを開く
//最後のあまり行を処理する
{
	if (!("logh" in global)) logh = undefined;
	var fp = fopen(filename, "rt");

	if (fp == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		return 1;
	}

	var line_cnt = 0;
	var H_lines = Array();

	while (line = fgets(fp)) //COPY文の文字列そのものを取得して配列に溜める
	//array_push( $H_lines, $line );
	//...こっちの方が速いらしい。
	//一定行数読み込んだら処理を行う
	{
		H_lines.push(line);
		line_cnt++;

		if (line_cnt >= COPY_LINES) //コピー処理を行う
			//空にする
			{
				var res_cpfile = pg_copy_from(db.m_db.connection, table, H_lines);

				if (res_cpfile == false) {
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "\u306E\u30B3\u30D4\u30FC\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F.");
					fclose(fp);
					return 1;
				}

				H_lines = Array();
				line_cnt = 0;
			}
	}

	if (line_cnt > 0) //コピー処理を行う
		{
			res_cpfile = pg_copy_from(db.m_db.connection, table, H_lines);

			if (res_cpfile == false) {
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "\u306E\u30B3\u30D4\u30FC\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F.");
				fclose(fp);
				return 1;
			}
		}

	fclose(fp);
	return 0;
};

function getTimestamp() {
	var tm = localtime(Date.now() / 1000, true);
	var yyyy = tm.tm_year + 1900;
	var mm = tm.tm_mon + 1;
	if (mm < 10) mm = "0" + mm;
	var dd = tm.tm_mday + 0;
	if (dd < 10) dd = "0" + dd;
	var hh = tm.tm_hour + 0;
	if (hh < 10) hh = "0" + hh;
	var nn = tm.tm_min + 0;
	if (nn < 10) nn = "0" + nn;
	var ss = tm.tm_sec + 0;
	if (ss < 10) ss = "0" + ss;
	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};