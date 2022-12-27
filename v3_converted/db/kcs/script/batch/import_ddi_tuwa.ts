//===========================================================================
//機能：通話明細ファイルインポートプロセス（DDI POCKET専用）
//
//作成：前田
//ＤＢ２重化対応 ＣＯＰＹ文を廃止 2006/05/25 s.Maeda
//公私分計対応 2006/08/04 s.Maeda
//複数ファイル一括取り込み対応 2006/09/13 s.Maeda
//着信地名がＰＲＩＮで付加サービスが通信時間の明細は通話明細表示が重複となるため除外する 2007/11/15 s.Maeda
//mb_convert_variablesでオーバーフローしている箇所を対処 2008/08/22 Kenichiro.Uesugi
//パケット料金を算出する際、小数点以下第３を四捨五入するよう変更 2010/06/25 s.maeda
//===========================================================================
//パケコミネットのプランＩＤ
//パケット単価
//パケコミネットのパケット単価
//ヘッダー区分
//区分開始バイト数
//区分桁数
//アカウント開始バイト数
//アカウント桁数
//請求年月度バイト数
//請求年月度桁数
//電話データ区分
//電話番号開始バイト数
//電話番号桁数
//通話月日開始バイト数
//通話月日桁数
//開始時間開始バイト数
//開始時間桁数
//発信元開始バイト数
//発信元桁数
//通話先開始バイト数
//通話先桁数
//着信地名開始バイト数
//着信地名桁数
//通話時間開始バイト数
//通話時間桁数
//料金開始バイト数
//料金桁数
//時間区分開始バイト数
//時間区分桁数
//付加サービス開始バイト数
//付加サービス桁数
//パケットデータ区分
//バイト数開始バイト数
//バイト数桁数
//電話のデータタイプ
//パケット、ＡＰセンタのデータタイプ
//一度にFETCHする行数
//データインポートする際の処理単位
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
//通話明細データファイルがあるディレクトリを指定
//通話明細データファイルのディレクトリチェック
//ディレクトリのパスが不正の場合
//２重起動防止ロックをかける
//pact_tb より登録されている契約ＩＤ、会社名を取得
//会社名マスターを作成
//公私分計の権限ある契約ＩＤを取得
//通話記録判定を使用する公私分計パターンを取得する
//通話記録判定を使用するパターン数
//パターンＩＤをキー、未登録の通話明細を公私のどちらにみなすかを値にした連想配列を作成
//テーブルＮＯ取得
//テーブル名設定
//$fromtel_tb = "kousi_fromtel_master_tb";
//処理する契約ＩＤ数
//pactidでソート
//処理が終了した pactid を格納するための配列
//commhistory_X_tb 用出力ファイル作成
//kousi_totel_master_tb 用出力ファイル作成
//データタイプの連想配列
//通話記録判定対象の通話明細データタイプを取得
//pactid 毎に処理する
//出力ファイルクローズ
//処理する件数が０件なら直ちに終了する
//処理する契約ＩＤはまずkousi_totel_master_tbから未登録電話を削除する
//モードがオーバーライトの時はcommhistoryデータをインポートする前にデリート
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
//ダミーの電話番号を取得する
//[引　数] $pactid：契約ＩＤ
//[返り値] ダミー電話番号文字列
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
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う
//[引　数] テーブル名、COPY用のファイル名、$db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//DBに書き込む現在日時に使用する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//公私分計フラグを返す
//[引　数] $pactid:契約ＩＤ
//$telno:掛け元電話番号
//$totelRep:掛け先電話番号
//$kubun:通話明細データ区分
//[返り値] commhistory_X_tbに設定する公私分計フラグ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

const DEBUG = 1;
const DDI_DIR = "/DDI/tuwa";
const FIN_DIR = "/fin";
const LOG_DELIM = " ";
const PRE_DUMMY_TEL = "DDI";
const SCRIPTNAME = "import_ddi_tuwa.php";
const PAKEKOMI = 388;
const PACKET_UNIT_PRICE = 0.05;
const PAKEKOMI_UNIT_PRICE = 0.03;
const HEADER_KUBUN = 10;
const KUBUN_START = 1;
const KUBUN_LEN = 2;
const ACCOUNT_START = 5;
const ACCOUNT_LEN = 10;
const BILLDATE_START = 86;
const BILLDATE_LEN = 6;
const TEL_DATA_KUBUN = 30;
const TEL_START = 13;
const TEL_LEN = 16;
const TUWA_DATE_START = 34;
const TUWA_DATE_LEN = 8;
const TUWA_TIME_START = 44;
const TUWA_TIME_LEN = 6;
const FROM_PLACE_START = 50;
const FROM_PLACE_LEN = 10;
const TO_TEL_START = 60;
const TO_TEL_LEN = 16;
const TO_PLACE_START = 76;
const TO_PLACE_LEN = 10;
const TEL_TIME_START = 86;
const TEL_TIME_LEN = 7;
const CHARGE_START = 93;
const CHARGE_LEN = 7;
const CHARGE_SEG_START = 100;
const CHARGE_SEG_LEN = 8;
const FUKA_SERVE_START = 108;
const FUKA_SERVE_LEN = 8;
const PACKET_KUBUN = 31;
const BYTE_START = 86;
const BYTE_LEN = 12;
const TEL_TYPE = "DN";
const PACKET_TYPE = "DP";
const NUM_FETCH = 10000;
const COPY_LINES = 10000;
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);

if (_SERVER.argv.length != 5) //数が正しい
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

			usage("");
		}
	}

print("BEGIN: \uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u901A\u8A71\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u958B\u59CB\n");
logh.putError(G_SCRIPT_BEGIN, "\uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u901A\u8A71\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u958B\u59CB");
var dataDir = DATA_DIR + "/" + year + month + DDI_DIR;

if (is_dir(dataDir) == false) //ディレクトリのパスが正しい場合
	{
		print("\n\uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n");
		logh.putError(G_SCRIPT_ERROR, "\uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
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
var H_result = dbh.getHash("select pactid,compname from pact_tb order by pactid", true);
var pactCnt = H_result.length;

for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) {
	H_pactid[H_result[pactCounter].pactid] = H_result[pactCounter].compname;
}

var sql_str = "select pactid from fnc_relation_tb where userid = 0 and fncid = " + G_AUTH_KOUSI;
var A_kousiPact = dbh.getCol(sql_str);
sql_str = "select patternid,comhistbaseflg from kousi_pattern_tb where carid = " + G_CARRIER_DDI + " and comhistflg = '1' order by patternid";
H_result = dbh.getHash(sql_str);
var comhistCnt = H_result.length;

for (var comhistCounter = 0; comhistCounter < comhistCnt; comhistCounter++) {
	H_comhist[H_result[comhistCounter].patternid] = H_result[comhistCounter].comhistbaseflg;
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var commhistory_tb = "commhistory_" + tableNo + "_tb";
var telX_tb = "tel_" + tableNo + "_tb";
var totel_tb = "kousi_totel_master_tb";
pactCnt = A_pactid.length;
A_pactid.sort();
var A_pactDone = Array();
var commhistoryFile = dataDir + "/" + commhistory_tb + year + month + pactid + ".ins";
var fp_commhistory = fopen(commhistoryFile, "w");
var totelFile = dataDir + "/" + totel_tb + year + month + pactid + ".ins";
var fp_totel = fopen(totelFile, "w");
var H_commtype = {
	[TEL_DATA_KUBUN]: "DN",
	[PACKET_KUBUN]: "DP"
};
sql_str = "select type from kousi_commtype_tb where carid = " + G_CARRIER_DDI;
var A_commtype = dbh.getCol(sql_str);

for (pactCounter = 0;; pactCounter < pactCnt; pactCounter++) //通話明細データディレクトリにある契約ＩＤがマスターに登録されている場合
{
	if (undefined !== H_pactid[A_pactid[pactCounter]] == true) //処理する通話明細データファイル名配列
		//通話明細データファイル名を取得する
		//ファイル名順でソート
		//通話明細データファイルがなかった場合
		//通話明細データディレクトリにある契約ＩＤがマスターに登録されていない場合
		{
			var A_commFile = Array();
			var dataDirPact = dataDir + "/" + A_pactid[pactCounter];
			dirh = opendir(dataDirPact);

			while (fileName = readdir(dirh)) {
				if (is_file(dataDirPact + "/" + fileName) == true) {
					A_commFile.push(fileName);
				}

				clearstatcache();
			}

			A_commFile.sort();

			if (A_commFile.length == 0) //通話明細データファイルがあった場合
				{
					print("WARNING: " + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\n");
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
					closedir(dirh);
					continue;
				} else //ファイルデータ格納配列
				//ファイルデータの契約ＩＤ
				//ファイルデータの請求年月
				//ファイルデータのアカウント
				//commhistory_X_tb インポートデータファイル出力用配列
				//電話のプランマスター
				//公私分計デフォルトパターン
				//「通話記録判定使用する」場合のみの公私分計パターン
				//kousi_totel_master_tb インポートデータファイル出力用配列
				//既に取り込みされているかどうか（false:されていない、true:されている）
				//$commCnt = 0;						// 同月データが既にある登録されている件数
				//$A_totelNoDel = array();			// 同月データが登録された際に登録された掛け先マスターで公私区分が
				//未登録になっている電話番号配列
				//追記モードなら既に別ファイルが取り込まれているかチェックする
				//電話のプランマスターを作成
				//公私分計権限があり、
				//kousi_pattern_tbに通話記録判定を使用するパターンが１件でもあれば
				//デフォルトパターンが通話記録判定を使用するパターンかどうかをチェックする
				//出力件数用変数初期化
				//UPDATE 2008/08/22 Kenichiro Uesugi
				//mb_convert_variables("UTF-8", "EUC-JP", $A_commOutputBuff);
				//commhistory_X_tb ファイル出力
				//UPDATE END 2008/08/22 Kenichiro Uesugi
				//バッファ出力
				//公私分計権限がある場合
				{
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + A_pactid[pactCounter] + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + LOG_DELIM + year + month + LOG_DELIM + A_commFile.join(","));
					var A_fileData = Array();
					var filePact = "";
					var fileBillDate = "";
					var fileAccount = "";
					var A_commOutputBuff = Array();
					var H_tel = Array();
					var defaultPtn = "";
					var H_telKousi = Array();
					var A_totelOutputBuff = Array();
					var importFlg = false;

					if (mode == "a") //既に取り込みが終了している件数
						//レコードがある場合
						{
							sql_str = "select count(*) from " + commhistory_tb + " where pactid = " + A_pactid[pactCounter] + " and carid = " + G_CARRIER_DDI;
							var rtn = dbh.getOne(sql_str);

							if (rtn > 0) //既に取り込みされている
								{
									importFlg = true;
								}
						}

					sql_str = "select telno,planid from " + telX_tb + " where pactid = " + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_DDI + " order by telno";
					H_result = dbh.getHash(sql_str);
					var telCnt = H_result.length;

					for (var telCounter = 0; telCounter < telCnt; telCounter++) {
						H_tel[H_result[telCounter].telno] = H_result[telCounter].planid;
					}

					if (-1 !== A_kousiPact.indexOf(A_pactid[pactCounter]) == true && comhistCnt != 0) //デフォルトパターンが「公私分計する」でそのパターンが「通話記録判定使用する」場合のみパターンＩＤがセットされる
						//「通話記録判定使用する」パターンが設定されている電話を取得する
						//デフォルトパターンも「通話記録判定使用する」場合はUNIONで連結
						//「通話記録判定使用する」電話の件数
						//通話記録判定使用する電話をキー、パターンＩＤ
						//通話記録判定使用する電話が１件でもあれば
						{
							sql_str = "select patternid from kousi_default_tb " + "where pactid = " + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_DDI + " and " + "kousiflg = '0' and " + "patternid in (" + Object.keys(H_comhist).join(",") + ")";
							defaultPtn = dbh.getOne(sql_str, true);
							sql_str = "select telno,kousiptn from " + telX_tb + " " + "where pactid = " + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_DDI + " and " + "kousiflg = '0' and " + "kousiptn in (" + Object.keys(H_comhist).join(",") + ") ";

							if (defaultPtn != "") {
								sql_str = sql_str + "union " + "select telno," + defaultPtn + " as kousiptn from " + telX_tb + " " + "where pactid = " + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_DDI + " and " + "kousiflg is null ";
							}

							sql_str = sql_str + "order by telno";
							H_result = dbh.getHash(sql_str);
							var telKousiCnt = H_result.length;

							for (telCounter = 0;; telCounter < telKousiCnt; telCounter++) {
								H_telKousi[H_result[telCounter].telno] = H_result[telCounter].kousiptn;
							}

							if (telKousiCnt != 0) //kousi_totel_master_tb より通話記録判定使用する電話の掛け先電話番号と公私分計フラグを取得する
								//別ファイルがまだ取り込みされていない場合はkousiflgが未登録は除く
								//別ファイルがまだ取り込みされているが追記モードではない場合はkousiflgが未登録は除く
								//別ファイルが取り込みされており、かつ追記モードの場合はkousiflgが未登録も含む（つまり全件が対象）
								//別ファイルがまだ取り込みされていない場合はkousiflgが未登録は除く
								//別ファイルがまだ取り込みされているが追記モードではない場合はkousiflgが未登録は除く
								//既に登録されている掛け先マスターの件数
								//掛け元をキー、掛け先がキーで公私分計フラグを値にした連想配列が値の連想配列を作成
								{
									sql_str = "select telno,totelno,kousiflg from " + totel_tb + " " + "where pactid = " + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_DDI + " and " + "telno in ('" + Object.keys(H_telKousi).join("','") + "') ";

									if (importFlg == false || importFlg == true && mode == "o") {
										sql_str = sql_str + "and kousiflg != 2 ";
									}

									sql_str = sql_str + "order by telno,totelno";
									H_result = dbh.getHash(sql_str);
									var totelCnt = H_result.length;
									var oldtelno = "";

									for (telCounter = 0;; telCounter < totelCnt; telCounter++) //前レコードと掛け元電話番号が違う場合
									//掛け元電話番号を退避
									{
										if (oldtelno != "" && oldtelno != H_result[telCounter].telno) {
											H_totel[oldtelno] = H_totelTmp;
											var H_totelTmp = Array();
										}

										H_totelTmp[H_result[telCounter].totelno] = H_result[telCounter].kousiflg;
										oldtelno = H_result[telCounter].telno;
									}

									if (totelCnt != 0) {
										H_totel[oldtelno] = H_totelTmp;
									}
								}
						}

					for (var fileCounter = 0; fileCounter < A_commFile.length; fileCounter++) //ファイルサイズチェック 固定長128+1 バイト 最終行改行1バイト
					//1行ずつの処理
					{
						if ((filesize(dataDirPact + "/" + A_commFile[fileCounter]) - 1) % 129 != 0) //エラーとなった契約ＩＤはとばすが処理は続ける
							{
								print("WARNING: " + dataDirPact + "/" + A_commFile[fileCounter] + " \u30D5\u30A1\u30A4\u30EB\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u4E0D\u6B63\u3067\u3059\n");
								logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + A_commFile[0] + "\uFF09\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u4E0D\u6B63\u3067\u3059");
								continue;
							}

						A_fileData[fileCounter] = file(dataDirPact + "/" + A_commFile[fileCounter]);

						for (var lineCounter = 0; lineCounter < A_fileData[fileCounter].length; lineCounter++) //区分を取得
						//区分が10ならヘッダー アカウントと請求年月度を取得する
						{
							var dataKubun = A_fileData[fileCounter][lineCounter].substr(KUBUN_START - 1, KUBUN_LEN);

							if (dataKubun == HEADER_KUBUN) //パラメータの請求年月の１ヶ月前とファイルの請求年月度が違う場合
								//pactid が見つからなかった場合
								{
									fileAccount = A_fileData[fileCounter][lineCounter].substr(ACCOUNT_START - 1, ACCOUNT_LEN);
									fileBillDate = A_fileData[fileCounter][lineCounter].substr(BILLDATE_START - 1, BILLDATE_LEN);

									if (fileBillDate != date("Ym", mktime(0, 0, 0, month - 1, 1, year))) //エラーとなった契約ＩＤはとばすが処理は続ける
										{
											print("WARNING: " + dataDirPact + "/" + A_commFile[fileCounter] + " \u30D5\u30A1\u30A4\u30EB\u306E\u8ACB\u6C42\u5E74\u6708\u304C\u4E0D\u6B63\u3067\u3059\n");
											logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + A_commFile[0] + "\uFF09\u8ACB\u6C42\u5E74\u6708\u304C\u4E0D\u6B63\u3067\u3059");
											continue;
										}

									var sql = "select pactid from bill_prtel_tb where carid = " + G_CARRIER_DDI + " " + "and prtelno = '" + fileAccount + "'";
									filePact = dbh.getOne(sql, true);

									if (filePact == "") //エラーとなった契約ＩＤはとばすが処理は続ける
										{
											print("WARNING: " + dataDirPact + "/" + A_commFile[fileCounter] + " \u306E\u304A\u5BA2\u69D8\u756A\u53F7\uFF08" + fileAccount + "\uFF09\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\n");
											logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + A_commFile[0] + "\uFF09\u306E\u304A\u5BA2\u69D8\u756A\u53F7\uFF08" + fileAccount + "\uFF09\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
											continue;
										}

									if (filePact != A_pactid[pactCounter]) //エラーとなった契約ＩＤはとばすが処理は続ける
										{
											print("WARNING: " + dataDirPact + "/" + A_commFile[fileCounter] + " \u30D5\u30A1\u30A4\u30EB\u306E\u5951\u7D04\uFF29\uFF24\u304C\u4E0D\u6B63\u3067\u3059\n");
											logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + A_commFile[0] + "\uFF09\u5951\u7D04\uFF29\uFF24\u304C\u4E0D\u6B63\u3067\u3059");
											continue;
										}
								} else if (dataKubun == TEL_DATA_KUBUN) //着信地名がＰＲＩＮで付加サービスが通信時間の明細は通話明細表示が重複となるため除外する
								//公私分計フラグを取得
								//区分が31ならパケットまたはＡＰセンタ
								{
									var telno = rtrim(str_replace("-", "", A_fileData[fileCounter][lineCounter].substr(TEL_START - 1, TEL_LEN)));
									var date = A_fileData[fileCounter][lineCounter].substr(TUWA_DATE_START - 1, TUWA_DATE_LEN) + " " + A_fileData[fileCounter][lineCounter].substr(TUWA_TIME_START - 1, TUWA_TIME_LEN);
									var fromplace = rtrim(A_fileData[fileCounter][lineCounter].substr(FROM_PLACE_START - 1, FROM_PLACE_LEN));
									var totelno = rtrim(A_fileData[fileCounter][lineCounter].substr(TO_TEL_START - 1, TO_TEL_LEN));
									var totelRep = rtrim(str_replace("-", "", totelno));
									var toplace = A_fileData[fileCounter][lineCounter].substr(TO_PLACE_START - 1, TO_PLACE_LEN);
									var time = A_fileData[fileCounter][lineCounter].substr(TEL_TIME_START - 1, TEL_TIME_LEN);
									var charge = A_fileData[fileCounter][lineCounter].substr(CHARGE_START - 1, CHARGE_LEN) / 10;
									var fuka = A_fileData[fileCounter][lineCounter].substr(FUKA_SERVE_START - 1, FUKA_SERVE_LEN);

									if (toplace == mb_convert_encoding("\uFF30\uFF32\uFF29\uFF2E\u3000", "CP51932", "UTF-8") && fuka == mb_convert_encoding("\u901A\u4FE1\u6642\u9593", "CP51932", "UTF-8")) {
										continue;
									}

									if (charge == 0) {
										charge = "\\N";
									}

									var chargeseg = A_fileData[fileCounter][lineCounter].substr(CHARGE_SEG_START - 1, CHARGE_SEG_LEN);
									var kousiflg = getKousiflg(filePact, telno, totelRep, TEL_DATA_KUBUN);
									A_commOutputBuff.push(filePact + "\t" + telno + "\t" + TEL_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t" + time + "\t" + charge + "\t\\N\t" + chargeseg + "\t" + G_CARRIER_DDI + "\t" + kousiflg + "\n");
								} else if (dataKubun == PACKET_KUBUN) //料金が０の場合
								//公私分計フラグを取得
								{
									telno = rtrim(str_replace("-", "", A_fileData[fileCounter][lineCounter].substr(TEL_START - 1, TEL_LEN)));
									date = A_fileData[fileCounter][lineCounter].substr(TUWA_DATE_START - 1, TUWA_DATE_LEN) + " " + A_fileData[fileCounter][lineCounter].substr(TUWA_TIME_START - 1, TUWA_TIME_LEN);
									fromplace = A_fileData[fileCounter][lineCounter].substr(FROM_PLACE_START - 1, FROM_PLACE_LEN);
									totelno = A_fileData[fileCounter][lineCounter].substr(TO_TEL_START - 1, TO_TEL_LEN);
									toplace = A_fileData[fileCounter][lineCounter].substr(TO_PLACE_START - 1, TO_PLACE_LEN);
									var byte = A_fileData[fileCounter][lineCounter].substr(BYTE_START - 1, BYTE_LEN);

									if (undefined !== H_tel[telno] == true) //料金プランがパケコミネットの場合
										{
											if (H_tel[telno] == PAKEKOMI) //小数点以下第３を四捨五入するよう変更 2010/06/25 s.maeda
												//変更したのをなかったコトにする 2012/09/12
												//$charge = round($byte / 128 * PAKEKOMI_UNIT_PRICE * 100) / 100;
												{
													charge = +(byte / 128 * PAKEKOMI_UNIT_PRICE);
												} else //小数点以下第３を四捨五入するよう変更 2010/06/25 s.maeda
												//変更したのをなかったコトにする 2012/09/12
												//$charge = round($byte / 128 * PACKET_UNIT_PRICE * 100) / 100;
												{
													charge = +(byte / 128 * PACKET_UNIT_PRICE);
												}
										} else //小数点以下第３を四捨五入するよう変更 2010/06/25 s.maeda
										//変更したのをなかったコトにする 2012/09/12
										//$charge = round($byte / 128 * PACKET_UNIT_PRICE * 100) / 100;
										{
											charge = +(byte / 128 * PACKET_UNIT_PRICE);
										}

									if (charge == 0) {
										charge = "\\N";
									}

									chargeseg = A_fileData[fileCounter][lineCounter].substr(CHARGE_SEG_START - 1, CHARGE_SEG_LEN);
									kousiflg = getKousiflg(filePact, telno, totelRep, PACKET_KUBUN);
									A_commOutputBuff.push(filePact + "\t" + telno + "\t" + PACKET_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t\\N\t" + charge + "\t" + byte + "\t" + chargeseg + "\t" + G_CARRIER_DDI + "\t" + kousiflg + "\n");
								}
						}
					}

					var outCommhistoryCnt = 0;
					var outTotelCnt = 0;

					for (var value of Object.values(A_commOutputBuff)) {
						mb_convert_variables("UTF-8", "EUC-JP", value);
						fwrite(fp_commhistory, value);
						outCommhistoryCnt++;
					}

					fflush(fp_commhistory);
					print("INFO: " + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(" + commhistory_tb + ":" + outCommhistoryCnt + "\u4EF6)\n");
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(" + commhistory_tb + ":" + outCommhistoryCnt + "\u4EF6)");

					if (-1 !== A_kousiPact.indexOf(A_pactid[pactCounter]) == true) //UPDATE 2008/08/22 Kenichiro Uesugi
						//mb_convert_variables("UTF-8", "EUC-JP", $A_totelOutputBuff);
						//kousi_totel_master_tb ファイル出力
						//UPDATE END 2008/08/22 Kenichiro Uesugi
						//バッファ出力
						{
							for (var value of Object.values(A_totelOutputBuff)) {
								mb_convert_variables("UTF-8", "EUC-JP", value);
								fwrite(fp_totel, value);
								outTotelCnt++;
							}

							fflush(fp_totel);
							print("INFO: " + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(" + totel_tb + ":" + outTotelCnt + "\u4EF6)\n");
							logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(" + totel_tb + ":" + outTotelCnt + "\u4EF6)");
						}

					A_pactDone.push(A_pactid[pactCounter]);
				}

			closedir(dirh);
		} else {
		print("WARNING: \u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\n");
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + " \u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
	}
}

fclose(fp_commhistory);
fclose(fp_totel);
var pactDoneCnt = A_pactDone.length;

if (pactDoneCnt == 0) //処理する件数が０件をログ出力
	//処理終了をログ出力
	{
		print("WARNING: \u30A4\u30F3\u30DD\u30FC\u30C8\u53EF\u80FD\u306A\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\n");
		logh.putError(G_SCRIPT_WARNING, "\u30A4\u30F3\u30DD\u30FC\u30C8\u53EF\u80FD\u306A\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F");
		print("END: \uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u901A\u8A71\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u7D42\u4E86\n");
		logh.putError(G_SCRIPT_END, "\uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u901A\u8A71\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u7D42\u4E86");
		lock(false);
		throw die(0);
	}

if (backup == "y") //tel_details_X_tb をエクスポートする
	//トランザクション開始
	//トランザクション内でないとカーソルが使えない
	//エクスポート失敗した場合
	//コミット
	//ＷＩＬＬＣＯＭではとりあえず必要なし
	//	// kousi_fromtel_master_tb をエクスポートする
	//	$sql_str = "select * from " . $fromtel_tb;
	//	$expFile = DATA_EXP_DIR . "/" . $fromtel_tb . date("YmdHis") . ".exp";
	//	// トランザクション開始
	//	// トランザクション内でないとカーソルが使えない
	//	$dbh->begin();
	//	// エクスポート失敗した場合
	//	if(doCopyExp($sql_str, $expFile, $dbh ) != 0){
	//		print "ERROR: " . $fromtel_tb . " のデータエクスポートに失敗しました " . $rtn->userinfo . "\n";
	//		$logh->putError(G_SCRIPT_ERROR, SCRIPTNAME . $fromtel_tb . " のデータエクスポートに失敗しました " . $rtn->userinfo);
	//	}else{
	//		print "INFO: " . $fromtel_tb . " のデータエクスポート完了\n";
	//		$logh->putError(G_SCRIPT_INFO, SCRIPTNAME . $fromtel_tb . " のデータエクスポート完了");
	//	}	
	//	// コミット
	//	$dbh->commit();
	//kousi_totel_master_tb をエクスポートする
	//トランザクション開始
	//トランザクション内でないとカーソルが使えない
	//エクスポート失敗した場合
	//コミット
	{
		sql_str = "select * from " + commhistory_tb;
		var expFile = DATA_EXP_DIR + "/" + commhistory_tb + date("YmdHis") + ".exp";
		dbh.begin();

		if (doCopyExp(sql_str, expFile, dbh) != 0) {
			print("ERROR: " + commhistory_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo + "\n");
			logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + commhistory_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
		} else {
			print("INFO: " + commhistory_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u5B8C\u4E86\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + commhistory_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}

		dbh.commit();
		sql_str = "select * from " + totel_tb;
		expFile = DATA_EXP_DIR + "/" + totel_tb + date("YmdHis") + ".exp";
		dbh.begin();

		if (doCopyExp(sql_str, expFile, dbh) != 0) {
			print("ERROR: " + totel_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo + "\n");
			logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + totel_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
		} else {
			print("INFO: " + totel_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u5B8C\u4E86\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + totel_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}

		dbh.commit();
	}

dbh.begin();

for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //ＷＩＬＬＣＯＭではとりあえず必要なし
//	// kousi_fromtel_masterの未登録電話を削除する
//	$sql_str = "delete from " . $fromtel_tb . " where pactid = " . $A_pactDone[$pactDoneCounter]
//			 . " and carid = " . G_CARRIER_DDI . " and kousiflg = '2'";
//	$rtn = $dbh->query($sql_str, false);
//	// delete失敗した場合
//	if(DB::isError($rtn) == true){
//		// ロールバック
//		$dbh->rollback();
//		print "ERROR: "  . $H_pactid[$A_pactid[$pactDoneCounter]] . "(pactid=" . $A_pactid[$pactDoneCounter] .
//			") " . $fromtel_tb . " の未登録電話の削除に失敗しました " . $rtn->userinfo . "\n";
//		$logh->putError(G_SCRIPT_ERROR, SCRIPTNAME . $H_pactid[$A_pactid[$pactDoneCounter]] . "(pactid=" . 
//			$A_pactid[$pactDoneCounter] . ") " . $fromtel_tb . " の未登録電話の削除に失敗しました " . $rtn->userinfo);
//	}else{
//		print "INFO: "  . $H_pactid[$A_pactid[$pactDoneCounter]] . "(pactid=" . $A_pactid[$pactDoneCounter] .
//			") " . $fromtel_tb . " の未登録電話の削除完了\n";
//		$logh->putError(G_SCRIPT_INFO, SCRIPTNAME . $H_pactid[$A_pactid[$pactDoneCounter]] . "(pactid=" . 
//			$A_pactid[$pactDoneCounter] . ") " . $fromtel_tb . " の未登録電話の削除完了");
//	}
//公私分計権限があり かつ
//別ファイルがまだ取り込みされていない場合　か
//別ファイルがまだ取り込みされているが追記モードではない場合
{
	if (-1 !== A_kousiPact.indexOf(A_pactDone[pactDoneCounter]) == true && (importFlg == false || importFlg == true && mode == "o")) //kousi_totel_masterの未登録電話を削除する
		//delete失敗した場合
		{
			sql_str = "delete from " + totel_tb + " where pactid = " + A_pactDone[pactDoneCounter] + " and carid = " + G_CARRIER_DDI + " and kousiflg = '2'";
			rtn = dbh.query(sql_str, false);

			if (DB.isError(rtn) == true) //ロールバック
				{
					dbh.rollback();
					print("ERROR: " + H_pactid[A_pactid[pactDoneCounter]] + "(pactid=" + A_pactid[pactDoneCounter] + ") " + totel_tb + " \u306E\u672A\u767B\u9332\u96FB\u8A71\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo + "\n");
					logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + H_pactid[A_pactid[pactDoneCounter]] + "(pactid=" + A_pactid[pactDoneCounter] + ") " + totel_tb + " \u306E\u672A\u767B\u9332\u96FB\u8A71\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				} else {
				print("INFO: " + H_pactid[A_pactid[pactDoneCounter]] + "(pactid=" + A_pactid[pactDoneCounter] + ") " + totel_tb + " \u306E\u672A\u767B\u9332\u96FB\u8A71\u306E\u524A\u9664\u5B8C\u4E86\n");
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + H_pactid[A_pactid[pactDoneCounter]] + "(pactid=" + A_pactid[pactDoneCounter] + ") " + totel_tb + " \u306E\u672A\u767B\u9332\u96FB\u8A71\u306E\u524A\u9664\u5B8C\u4E86");
			}
		}
}

if (mode == "o") //delete失敗した場合
	{
		sql_str = "delete from " + commhistory_tb + " where pactid in (" + A_pactDone.join(",") + ") and " + "carid = " + G_CARRIER_DDI;
		rtn = dbh.query(sql_str, false);

		if (DB.isError(rtn) == true) //ロールバック
			{
				dbh.rollback();
				print("ERROR: " + commhistory_tb + " \u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo + "\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + commhistory_tb + " \u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			print("INFO: " + commhistory_tb + " \u306E\u524A\u9664\u5B8C\u4E86\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + commhistory_tb + " \u306E\u524A\u9664\u5B8C\u4E86");
		}
	}

if (filesize(commhistoryFile) != 0) //commhistory_X_tb へのインポートが失敗した場合
	{
		var A_commhist_col = ["pactid", "telno", "type", "date", "totelno", "toplace", "fromplace", "time", "charge", "byte", "chargeseg", "carid", "kousiflg"];

		if (doCopyInsert(commhistory_tb, commhistoryFile, A_commhist_col, dbh) != 0) //if(doCopyIn($commhistory_tb, $commhistoryFile, $dbh) != 0){
			//ロールバック
			{
				dbh.rollback();
				print("ERROR: " + commhistory_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo + "\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + commhistory_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			print("INFO: " + commhistory_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + commhistory_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	}

if (filesize(totelFile) != 0) //totel_tb へのインポートが失敗した場合
	{
		var A_totel_col = ["pactid", "telno", "carid", "totelno", "kousiflg"];

		if (doCopyInsert(totel_tb, totelFile, A_totel_col, dbh) != 0) //ロールバック
			{
				dbh.rollback();
				print("ERROR: " + totel_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo + "\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + totel_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			print("INFO: " + totel_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + totel_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	}

dbh.commit();

for (pactDoneCounter = 0;; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動先ディレクトリ
//移動先ディレクトリがなければ作成
//ファイルの移動
{
	var finDir = dataDir + "/" + A_pactDone[pactDoneCounter] + FIN_DIR;

	if (is_dir(finDir) == false) //移動先ディレクトリ作成失敗
		{
			if (mkdir(finDir, 700) == false) {
				print("ERROR: \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			} else {
				print("INFO: \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u4F5C\u6210\u5B8C\u4E86\n");
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
					print("ERROR: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")\n");
					logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")");
				} else {
					print("INFO: \u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u5B8C\u4E86(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")\n");
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " \u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u5B8C\u4E86(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")");
				}
			}

		clearstatcache();
	}

	closedir(dirh);
}

lock(false);
print("END: \uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u901A\u8A71\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u7D42\u4E86\n");
logh.putError(G_SCRIPT_END, "\uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u901A\u8A71\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u7D42\u4E86");
throw die(0);

function usage(comment) {
	if (!("dbh" in global)) dbh = undefined;

	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + SCRIPTNAME + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N}\n");
	print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
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
				print("\n\u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\n\n");
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

function getDummyTel(pactid) {
	var preLeng = PRE_DUMMY_TEL.length;
	var pactLeng = pactid.length;
	var zeroCnt = DUMMY_TEL_LENG - preLeng - pactLeng;
	var getStr = PRE_DUMMY_TEL;

	for (var zeroCounter = 0; zeroCounter < zeroCnt; zeroCounter++) {
		getStr = getStr + "0";
	}

	getStr = getStr + pactid;
	return getStr;
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
	var sql_str = "select charge from asp_charge_tb where pactid = " + pactid + " and " + "carid = " + G_AUTH_ASP;
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
	var tm = localtime(time(), true);
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

function getKousiflg(pactid, telno, totelRep, kubun) //通話明細のタイプが公私分計対象 ＆＆ 通話記録判定使用する電話
{
	{
		if (!("A_commtype" in global)) A_commtype = undefined;
		if (!("A_totelOutputBuff" in global)) A_totelOutputBuff = undefined;
	}
	{
		if (!("H_commtype" in global)) H_commtype = undefined;
		if (!("H_telKousi" in global)) H_telKousi = undefined;
		if (!("H_totel" in global)) H_totel = undefined;
		if (!("H_comhist" in global)) H_comhist = undefined;
	}

	if (-1 !== A_commtype.indexOf(H_commtype[kubun]) == true && -1 !== Object.keys(H_telKousi).indexOf(telno) == true) //通話明細データに掛け先がある場合
		//通話明細のタイプが公私分計対象外 か 通話記録判定使用しない電話
		{
			if (totelRep != "") //kousi_totel_master_tb に掛け先が登録されている場合
				//通話明細データに掛け先がない場合
				{
					if (undefined !== H_totel[telno] == true && -1 !== Object.keys(H_totel[telno]).indexOf(totelRep) == true) //kousi_totel_master_tb のkousiflgをセットする
						//kousi_totel_master_tb に掛け先が未登録の場合
						{
							var kousiflg = H_totel[telno][totelRep];
						} else //電話に紐づいている公私分計パターンの公私分計フラグをセットする
						{
							kousiflg = H_comhist[H_telKousi[telno]];
							var buff = pactid + "\t" + telno + "\t" + G_CARRIER_DDI + "\t" + totelRep + "\t2\n";

							if (-1 !== A_totelOutputBuff.indexOf(buff) == false) //kousi_totel_master_tb に公私分計フラグを未登録でマスター登録する
								{
									A_totelOutputBuff.push(buff);
								}
						}
				} else //電話に紐づいている公私分計パターンの公私分計フラグをセットする
				{
					kousiflg = H_comhist[H_telKousi[telno]];
				}
		} else {
		kousiflg = "\\N";
	}

	return kousiflg;
};