//===========================================================================
//機能：通話明細ファイルインポートプロセス（WILLCOM専用）
//
//作成：五十嵐(import_voda_tuwa.phpをコピーして置換しただけ)
//更新履歴
//２重起動防止チェックの不具合修正 2009/3/19 s.maeda
//===========================================================================
//このスクリプトの日本語処理名
//WILLCOMのキャリアID
//公私分計の権限
//以下はcommonで定義済み
//define("G_AUTH_ASP", 2);	//ASP使用料を表示するか
//define("G_CODE_ASP", "ASP");	//ASP利用料金
//define("G_CODE_ASX", "ASX");	//同税額
//define("G_EXCISE_RATE", 0.05);//消費税率
//END WillcomProcessBase
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//メイン処理
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

const SCRIPT_NAMEJ = "WILLCOM\u901A\u8A71\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8";
const SCRIPTNAME = "import_willcom_tuwa.php";
const WILLCOM_DIR = "/WILLCOM/tuwa";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const WILLCOM_CARRIER_ID = 2;
const KOUSI_FNCID = 47;

//スクリプト名、ＤＢロックに使用.
//このスクリプトの日本語処理名
//処理するファイル名パターン
//電話のデータタイプ
//レコード１行の長さ
//レコード１行の長さ
//処理すべきファイルタイプ
//ファイル名の CallX <- このXのところの数字
//管理レコード
//明細内訳レコード
//commhistory用出力バッファ
//infohistory用出力バッファ
//パケット按分用バッファ
//データベース・ハンドラ
//ログ・ハンドラ
//バックアップオプション
//モードオプション
//請求値月
//入力Pact
//対象となるテーブル
//対象となるテーブル
//commhistory用出力ファイル
//infohistory用出力ファイル
//データディレクトリ
//利用開始年
//処理が終了した pactid を格納するための配列
//読み込んだ明細件数
//関数ポインタのようなもの、実際には関数名が入る.
//電話に対する公私フラグ、ハッシュテーブルに持つ
//かけ先電話番号マスター
//kousi_totel_master_tb用出力バッファ
//kousi_totel_master用出力ファイル
//公私分計権限
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//機能：コンストラクタ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 パラメータの設定
//[引　数]
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 メイン処理
//[引　数] $line コマンドライン
//[返り値] 終了コード　1（失敗）
//END MainProcess
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 書き出し処理
//[引　数]
//[返り値] 終了コード　1（失敗）
//END OutputProcess
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 各ファイルについての処理
//[引　数] $fileName 対象ファイル名
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 各レコードについての処理
//[引　数] データ種別、処理すべき１レコード
//[返り値] 終了コード　1（失敗）、-1　未知の表示区分
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 各レコードについての処理、パケット用
//[引　数] データ種別、処理すべき１レコード
//[返り値] 終了コード　1（失敗）、-1　未知の表示区分
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 各レコードについての処理、パケット用
//[引　数] データ種別、処理すべき１レコード
//[返り値] 終了コード　1（失敗）、-1　未知の表示区分
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 管理レコードのチェック
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話明細内訳レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話明細内訳レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 パケットレコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話明細内訳レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話明細内訳レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話明細内訳レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話明細内訳レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話明細内訳レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 会社合計レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $str 元になる文字列
//$A_pos 区切り位置を有する配列
//[返り値] 分割された文字列の配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//電話に対する公私フラグを返す
//[引　数] pactid, 電話番号
//[返り値] 公私フラグ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//バックアップをとる
//[引　数] $db
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//旧データをＤＢから削除する
//[引　数] $db
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//データをＤＢにインポートする
//[引　数] $db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//データをＤＢにインポートする、info版
//[引　数] $db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//データをＤＢにインポートする、kousi_totel_master
//[引　数] $db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
//[引　数] テーブル名、入力ファイル名、カラム名の配列
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルにエクスポートを行う
//[引　数] SQL文、COPY用のファイル名
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//処理を終えたデータを移動する
//[引　数] $pactid
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//DBに書き込む現在日時に使用する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//clamptask_tb にレコードを追加し２重起動を防止する
//[引　数] $is_lock： true：ロックする、false：ロック解除
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
class WillcomProcessBase {
	WillcomProcessBase() //共通ログファイル名
	//ログListener を作成
	//ログファイル名、ログ出力タイプを設定
	//DEBUG * 標準出力に出してみる.
	//ログListener にログファイル名、ログ出力タイプを渡す
	//DBハンドル作成
	//エラー出力用ハンドル
	//処理が終了した pactid を格納するための配列
	//処理すべきファイル種別の番号
	{
		this.SCRIPT_FILENAME = "import_willcom_tuwa.php";
		var dbLogFile = DATA_LOG_DIR + "/billbat.log";
		var log_listener = new ScriptLogBase(0);
		var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
		var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
		log_listener.PutListener(log_listener_type);
		log_listener.PutListener(log_listener_type2);
		this.dbh = new ScriptDB(log_listener);
		this.logh = new ScriptLogAdaptor(log_listener, true);
		this.A_pactDone = Array();
		this.A_types = [0, 2, 3, 5, 6, 4, 7];
	}

	setParam(ctype) //管理レコード
	//データ長の設定	_C0だけ128
	//データ長の設定
	{
		this.Kanri_POS = [2, 12, 20, 26, 34, 42, 48, 60];
		this.HEAD_LINE_LENGTH = 256;
		this.BODY_LINE_LENGTH = 256;

		switch (ctype) {
			case 0:
				this.HEAD_LINE_LENGTH = 128;
				this.BODY_LINE_LENGTH = 128;
				this.WILLCOM_PAT = "/^Call0/";
				this.TEL_TYPE = "V0";
				this.Meisai_POS = [2, 15, 21, 23, 27, 33, 40, 53, 65, 71, 72, 84, 96, 108];
				this.doTelRecordPtr = "doTelRecord_C0";
				this.doEachLinePtr = "doEachLine";
				break;

			case 2:
				this.WILLCOM_PAT = "/^Call2/";
				this.TEL_TYPE = "V2";
				this.Meisai_POS = [2, 15, 21, 23, 27, 31, 35, 43, 63, 73, 78, 88, 94, 104];
				this.doTelRecordPtr = "doTelRecord_C2";
				this.doEachLinePtr = "doEachLinePacket";
				break;

			case 3:
				this.WILLCOM_PAT = "/^Call3/";
				this.TEL_TYPE = "V3";
				this.Meisai_POS = [2, 15, 21, 23, 27, 33, 40, 56, 76, 92, 104];
				this.doTelRecordPtr = "doTelRecord_C3";
				this.doEachLinePtr = "doEachLine";
				break;

			case 4:
				this.WILLCOM_PAT = "/^Call4/";
				this.TEL_TYPE = "V4";
				this.Meisai_POS = [2, 15, 21, 23, 27, 33, 73, 103, 123, 135];
				this.doTelRecordPtr = "doTelRecord_C4";
				this.doEachLinePtr = "doEachLineInfo";
				break;

			case 5:
				this.WILLCOM_PAT = "/^Call5/";
				this.TEL_TYPE = "V5";
				this.Meisai_POS = [2, 15, 21, 23, 27, 33, 40, 70, 90, 106, 126, 138];
				this.doTelRecordPtr = "doTelRecord_C5";
				this.doEachLinePtr = "doEachLine";
				break;

			case 6:
				this.WILLCOM_PAT = "/^Call6/";
				this.TEL_TYPE = "V6";
				this.Meisai_POS = [2, 15, 21, 23, 27, 33, 53, 66, 126, 143];
				this.doTelRecordPtr = "doTelRecord_C6";
				this.doEachLinePtr = "doEachLine";
				break;

			case 7:
				this.WILLCOM_PAT = "/^Call7/";
				this.TEL_TYPE = "V7";
				this.Meisai_POS = [2, 15, 21, 23, 27, 33, 58, 78, 98, 111, 125, 145, 177];
				this.doTelRecordPtr = "doTelRecord_C7";
				this.doEachLinePtr = "doEachLine";
				break;

			default:
				this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "\u672A\u77E5\u306Ectype\u3001" + ctype);
				throw die(1);
		}
	}

	MainProcess(argv) //開始メッセージ
	//メール出力を減らすためコメントアウト 20091109miya
	//$this->logh->putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ . LOG_DELIM . "処理開始.");
	//パラメータチェック
	//$cnt 0 はスクリプト名のため無視
	//END 引数の取得
	//通話明細データファイルがあるディレクトリを指定
	//処理する契約ＩＤ配列
	//契約ＩＤの指定が全て（all）の時
	//テーブル名設定
	//ファイルオープン
	//会社名マスターを作成
	//処理する契約ＩＤ
	//全てのPactについてLOOP.
	//END Pactごとの処理.
	//出力ファイルクローズ
	//ここまでに成功したファイルが無ければ終了する.
	{
		if (argv.length != 5) //数が正しくない
			{
				this.usage(argv, "");
				return 1;
			}

		var argvCnt = argv.length;

		for (var cnt = 1; cnt < argvCnt; cnt++) //mode を取得
		{
			if (ereg("^-e=", argv[cnt]) == true) //モード文字列チェック
				{
					this.mode = ereg_replace("^-e=", "", argv[cnt]).toLowerCase();

					if (ereg("^[ao]$", this.mode) == false) {
						this.usage(argv, "ERROR: \u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-y=", argv[cnt]) == true) //請求年月文字列チェック
				{
					this.billdate = ereg_replace("^-y=", "", argv[cnt]);

					if (ereg("^[0-9]{6}$", this.billdate) == false) {
						this.usage(argv, "ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					} else //年月チェック
						{
							var year = this.billdate.substr(0, 4);
							var month = this.billdate.substr(4, 2);

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								this.usage(argv, "ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059(" + this.billdate + ")");
							}
						}

					var diffmon = (date("Y") - year) * 12 + (date("m") - month);

					if (diffmon < 0) {
						this.usage(argv, "ERROR: \u8ACB\u6C42\u5E74\u6708\u306B\u672A\u6765\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + this.billdate + ")");
					} else if (diffmon >= 12) {
						this.usage(argv, "ERROR: \u8ACB\u6C42\u5E74\u6708\u306B\uFF11\u5E74\u4EE5\u4E0A\u524D\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + this.billdate + ")");
					}

					continue;
				}

			if (ereg("^-p=", argv[cnt]) == true) //契約ＩＤチェック
				{
					this.pactid_in = ereg_replace("^-p=", "", argv[cnt]).toLowerCase();

					if (ereg("^all$", this.pactid_in) == false && ereg("^[0-9]+$", this.pactid_in) == false) {
						this.usage(argv, "ERROR: \u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-b=", argv[cnt]) == true) //バックアップの有無のチェック
				{
					this.backup = ereg_replace("^-b=", "", argv[cnt]).toLowerCase();

					if (ereg("^[ny]$", this.backup) == false) {
						this.usage(argv, "ERROR: \u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			this.usage(argv, "");
		}

		this.dataDir = DATA_DIR + "/" + this.billdate + WILLCOM_DIR;

		if (is_dir(this.dataDir) == false) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + this.dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093.");
		}

		var A_pactid = Array();

		if (this.pactid_in == "all") //処理する契約ＩＤを取得する
			//契約ＩＤが指定されている場合
			{
				var fileName;
				var dirh = opendir(this.dataDir);

				while (fileName = readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
				{
					if (is_dir(this.dataDir + "/" + fileName) && fileName != "." && fileName != "..") {
						A_pactid.push(fileName);
					}

					clearstatcache();
				}

				closedir(dirh);
			} else {
			A_pactid.push(this.pactid_in);
		}

		if (A_pactid.length == 0) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093.");
			return 1;
		}

		if (this.lock(true) == false) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "\uFF12\u91CD\u8D77\u52D5\u3067\u3059\u3001\u524D\u56DE\u30A8\u30E9\u30FC\u7D42\u4E86\u306E\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059.");
			return 1;
		}

		var O_tableNo = new TableNo();
		var tableNo = O_tableNo.get(year, month);
		this.commhistory_tb = "commhistory_" + tableNo + "_tb";
		this.infohistory_tb = "infohistory_" + tableNo + "_tb";
		var telX_tb = "tel_" + tableNo + "_tb";
		this.commhistoryFile = this.dataDir + "/" + this.commhistory_tb + this.billdate + this.pactid_in + ".ins";
		var fp_comm = fopen(this.commhistoryFile, "w");

		if (fp_comm == undefined) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.commhistoryFile + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
			return 1;
		}

		this.infohistoryFile = this.dataDir + "/" + this.infohistory_tb + this.billdate + this.pactid_in + ".ins";
		var fp_info = fopen(this.infohistoryFile, "w");

		if (fp_info == undefined) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.infohistoryFile + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
			return 1;
		}

		this.totelmasterFile = this.dataDir + "/" + "kousi_totel_master_tb" + this.billdate + this.pactid_in + ".ins";
		var fp_totel = fopen(this.totelmasterFile, "w");

		if (fp_totel == undefined) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.totelmasterFile + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
			return 1;
		}

		var sql = "select pactid,compname from pact_tb order by pactid";
		var H_result = this.dbh.getHash(sql, true);
		var pactCnt = H_result.length;

		for (cnt = 0;; cnt < pactCnt; cnt++) //pactid => 会社名
		{
			H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
		}

		pactCnt = A_pactid.length;
		A_pactid.sort();

		for (cnt = 0;; cnt < pactCnt; cnt++) //請求データディレクトリにある契約ＩＤがマスターに登録されているか？
		//bill_prtel_tb より請求先番号を得る
		//公私分計処理：かけ先マスターを保持
		//commhistory_X_tb インポートデータファイル出力用配列
		//infohistory_X_tb インポートデータファイル出力用配列
		//kousi_totel_master_tb インポートデータファイル出力用配列
		//パケット按分用配列
		//まだ１つもファイルが読み込まれていないのでTrue
		//END ctype
		//// ここまでPactごとにメモリーにため込むわけ。
		//正常処理が終わった pactid のみ書き出し処理
		{
			if (undefined !== H_pactid[A_pactid[cnt]] == false) {
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "pactid=" + A_pactid[cnt] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093.");
				continue;
			}

			var pactid = A_pactid[cnt];
			var pactname = H_pactid[pactid];
			var A_codes = Array();
			sql = "select prtelno from bill_prtel_tb where pactid=" + pactid + " and carid=" + WILLCOM_CARRIER_ID;
			H_result = this.dbh.getHash(sql, true);

			for (var idx = 0; idx < H_result.length; idx++) {
				A_codes.push(H_result[idx].prtelno);
			}

			if (A_codes.length == 0) //次のPactの処理にスキップする.
				{
					this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + "pactid=" + pactid + "\u306B\u3064\u3044\u3066\u306E\u8ACB\u6C42\u5148\u756A\u53F7\u304Cbill_prtel_tb\u306B\u898B\u3064\u304B\u308A\u307E\u305B\u3093.");
					continue;
				}

			sql = "select count(*) from fnc_relation_tb where pactid=" + pactid + " and fncid=" + KOUSI_FNCID;
			cnt = this.dbh.getOne(sql, true);

			if (cnt > 0) //メール出力を減らすためコメントアウト 20091109miya
				//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $this->billdate . LOG_DELIM
				//. "公私分計処理開始." );
				{
					this.EnableKousi = true;
				} else {
				this.EnableKousi = false;
			}

			if (this.EnableKousi == true) //kousiflg = 2:未登録 の電話はマスターから削除することになるので拾わない
				//初期化
				//print_r( $this->H_totel_master );
				//公私フラグの初期化
				{
					sql = "select telno, totelno, kousiflg from kousi_totel_master_tb where pactid=" + pactid + " and carid=" + WILLCOM_CARRIER_ID + "and kousiflg != '2' order by telno, totelno";
					H_result = this.dbh.getHash(sql, true);
					var totelCnt = H_result.length;
					this.H_totel_master = Array();

					for (cnt = 0;; cnt < totelCnt; cnt++) //電話番号 => 相手先電話番号 => 公私フラグ
					//ハイフンを除く
					{
						var telno = H_result[cnt].telno;

						if (undefined !== this.H_totel_master[telno] == false) {
							this.H_totel_master[telno] = Array();
						}

						var totelno = H_result[cnt].totelno;
						totelno = totelno.trim().replace(/-/g, "");
						this.H_totel_master[telno][totelno] = H_result[cnt].kousiflg;
					}

					this.H_TelKousi = Array();
				}

			this.A_commFileData = Array();
			this.A_infoFileData = Array();
			this.A_totelFileData = Array();
			this.A_packetData = Array();
			var errFlag = true;

			for (var ctype of Object.values(this.A_types)) //処理するファイル種別ごとのパラメータ設定
			//処理する請求データファイル名配列
			//通話明細データファイル名を取得する
			//通話明細データファイルがなかった場合
			//各ファイルについての処理 -- ここが読み込みの中心処理
			{
				this.setParam(ctype);
				var A_billFile = Array();
				var dataDirPact = this.dataDir + "/" + pactid;
				dirh = opendir(dataDirPact);

				while (fileName = readdir(dirh)) {
					if (is_file(dataDirPact + "/" + fileName) == true) //ファイル名の先頭文字が適合するものだけ
						{
							if (preg_match(this.WILLCOM_PAT, fileName)) {
								A_billFile.push(fileName);
							}
						}

					clearstatcache();
				}

				if (A_billFile.length == 0) //ここの警告は抑制する 20091211miya
					//$this->logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $this->billdate . LOG_DELIM
					//. "pactid=" . $pactid . ", ctype=". $ctype ." の通話明細データファイルが見つかりません.");
					//次のPactの処理にスキップする.
					{
						closedir(dirh);
						continue;
					}

				closedir(dirh);
				A_billFile.sort();
				errFlag = false;

				for (var fileName of Object.values(A_billFile)) //メール出力を減らすためコメントアウト 20091109miya
				//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $this->billdate . LOG_DELIM
				//. $dataDirPact ."/". $fileName . LOG_DELIM . "データ読込処理開始." );
				//読込明細件数
				//動的に関数を呼び出す
				{
					this.ReadMeisaiCnt = 0;

					if (this.doEachFile(dataDirPact + "/" + fileName, pactid, A_codes) == 1) //エラーがあったらそこで中断.
						{
							errFlag = true;
							break;
						}
				}
			}

			if (errFlag == false) //ファイルに書き出す -- comm
				//メール出力を減らすためコメントアウト 20091109miya
				//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $this->billdate . LOG_DELIM
				//. "データ書出処理開始." );
				//ファイルに書き出す -- info
				//ファイルに書き出す -- totel
				{
					for (var value of Object.values(this.A_commFileData)) {
						if (fwrite(fp_comm, value) == false) //エラーがあったらそこで中断.
							{
								this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + this.commhistoryFile + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557.");
								errFlag = true;
								break;
							}
					}

					if (errFlag == true) //次のPactの処理にスキップする.
						{
							continue;
						}

					fflush(fp_comm);

					for (var value of Object.values(this.A_infoFileData)) {
						if (fwrite(fp_info, value) == false) //エラーがあったらそこで中断.
							{
								this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + this.infohistoryFile + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557.");
								errFlag = true;
								break;
							}
					}

					if (errFlag == true) //次のPactの処理にスキップする.
						{
							continue;
						}

					fflush(fp_info);

					for (var value of Object.values(this.A_totelFileData)) {
						if (fwrite(fp_totel, value) == false) //エラーがあったらそこで中断.
							{
								this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + this.totelmasterFile + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557.");
								errFlag = true;
								break;
							}
					}

					if (errFlag == true) //次のPactの処理にスキップする.
						{
							continue;
						}

					fflush(fp_totel);
					this.A_pactDone.push(pactid);
				}
		}

		fclose(fp_comm);
		fclose(fp_info);
		fclose(fp_totel);

		if (this.A_pactDone.length == 0) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "\u8AAD\u307F\u8FBC\u307F\u306B\u6210\u529F\u3057\u305FPact\u304C\uFF11\u3064\u3082\u7121\u304B\u3063\u305F.");
			return 1;
		}
	}

	OutputProcess() //バックアップをとる
	//データをインポートする前にデリート
	//メール出力を減らすためコメントアウト 20091109miya
	//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $this->pactid_in . LOG_DELIM . LOG_DELIM . $this->billdate . LOG_DELIM
	//. "インポート処理完了." );
	//処理済みのデータを移動
	//２重起動ロック解除
	//終了メッセージ
	//メール出力を減らすためコメントアウト 20091109miya
	//$this->logh->putError(G_SCRIPT_END, SCRIPT_NAMEJ . LOG_DELIM . $this->pactid_in . LOG_DELIM . LOG_DELIM . $this->billdate . LOG_DELIM
	//. "処理完了.");
	{
		if (this.backup == "y") //メール出力を減らすためコメントアウト 20091109miya
			//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $this->pactid_in . LOG_DELIM . LOG_DELIM . $this->billdate . LOG_DELIM
			//. "バックアップ処理開始." );
			//メール出力を減らすためコメントアウト 20091109miya
			//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $this->pactid_in . LOG_DELIM . LOG_DELIM . $this->billdate . LOG_DELIM
			//. "バックアップ処理完了." );
			{
				this.doBackup(this.dbh);
			}

		this.dbh.begin();

		if (this.mode == "o") //メール出力を減らすためコメントアウト 20091109miya
			//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $this->pactid_in . LOG_DELIM . LOG_DELIM . $this->billdate . LOG_DELIM
			//. "デリート処理開始." );
			//メール出力を減らすためコメントアウト 20091109miya
			//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $this->pactid_in . LOG_DELIM . LOG_DELIM . $this->billdate . LOG_DELIM
			//. "デリート処理完了." );
			{
				this.doDelete(this.A_pactDone, this.dbh);
			}

		this.doImportComm(this.commhistoryFile, this.dbh);
		this.doImportInfo(this.infohistoryFile, this.dbh);
		this.doImportTotel(this.totelmasterFile, this.dbh);
		this.dbh.commit();

		for (var pactid of Object.values(this.A_pactDone)) {
			var pactDir = this.dataDir + "/" + pactid;
			var finDir = pactDir + "/" + FIN_DIR;
			this.finalData(pactid, pactDir, finDir);
		}

		this.lock(false);
		return 0;
	}

	doEachFile(fileName, pactid, A_codes) //ファイルオープン
	//管理レコードのチェック
	{
		if (!("pactname" in global)) pactname = undefined;
		var fp = fopen(fileName, "rb");

		if (fp == undefined) {
			this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
			return 1;
		}

		if (flock(fp, LOCK_SH) == false) {
			this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u30ED\u30C3\u30AF\u306B\u5931\u6557.");
			fclose(fp);
			return 1;
		}

		var line = fgets(fp);
		line = rtrim(line, "\r\n");

		if (this.checkKanriRecord(line, fileName, pactid, A_codes) == 1) {
			flock(fp, LOCK_UN);
			fclose(fp);
			return 1;
		}

		var TotalUp = 0;

		while (line = fgets(fp)) //改行取り
		//１行の長さチェック
		//10:通話単位、20:請求先単位、30:請求先合計料
		//動的に関数を呼び出す
		//$ret_val = $this->doEachLine( $dataKind, $line, $pactid, &$TotalUp );
		{
			if (feof(fp)) //おしまい.
				{
					break;
				}

			line = rtrim(line, "\r\n");

			if (line.length != this.HEAD_LINE_LENGTH) {
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u4E00\u884C\u306E\u9577\u3055\u304C\u7570\u5E38(" + line.length + "!=" + this.HEAD_LINE_LENGTH + ").");
				flock(fp, LOCK_UN);
				fclose(fp);
				return 1;
			}

			var dataKind = line.substr(21, 2);
			var ret_val = call_user_func([this, this.doEachLinePtr], dataKind, line, pactid, TotalUp);

			if (ret_val == 1) //エラー発生
				{
					flock(fp, LOCK_UN);
					fclose(fp);
					return 1;
				} else if (ret_val == -1) //未知の表示区分
				{
					this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u672A\u77E5\u306E\u8868\u793A\u533A\u5206(" + dataKind + ").");
					flock(fp, LOCK_UN);
					fclose(fp);
					return 1;
				}
		}

		flock(fp, LOCK_UN);
		fclose(fp);
		return 0;
	}

	doEachLine(dataKind, line, pactid, TotalUp) //10:通話単位
	{
		if (dataKind == "10") //動的に関数を呼び出す
			//if( $this->doTelRecord_C0($line, $pactid, &$sum) == 1 ){
			{
				var sum = 0;

				if (call_user_func([this, this.doTelRecordPtr], line, pactid, sum) == 1) {
					flock(fp, LOCK_UN);
					fclose(fp);
					return 1;
				}

				TotalUp += sum;
			} else if (dataKind == "80" || dataKind == "90") //_C0
			{
				if (this.doTotalRecord(line, TotalUp) == 1) {
					flock(fp, LOCK_UN);
					fclose(fp);
					return 1;
				}
			} else //未知の表示区分
			{
				return -1;
			}

		return 0;
	}

	doEachLinePacket(dataKind, line, pactid, TotalUp) //10:通話単位
	{
		if (dataKind == "10") //動的に関数を呼び出す
			//if( $this->doTelRecord_C0($line, $pactid, &$sum) == 1 ){
			{
				if (call_user_func([this, this.doTelRecordPtr], line, pactid, sum) == 1) {
					return 1;
				}
			} else if (dataKind == "70") //パケット按分用配列の再初期化
			{
				var sum = 0;

				if (this.doPacketRecord(line, pactid, sum) == 1) //パケット処理専用関数
					{
						return 1;
					}

				TotalUp += sum;
				this.A_packetData = Array();
			} else if (dataKind == "80" || dataKind == "90") {
			if (this.doTotalRecord(line, TotalUp) == 1) {
				return 1;
			}
		} else //未知の表示区分
			{
				return -1;
			}

		return 0;
	}

	doEachLineInfo(dataKind, line, pactid, TotalUp) //10:通話単位
	{
		if (dataKind == "10") //動的に関数を呼び出す
			//if( $this->doTelRecord_C0($line, $pactid, &$sum) == 1 ){
			{
				var sum = 0;

				if (call_user_func([this, this.doTelRecordPtr], line, pactid, sum) == 1) {
					return 1;
				}

				TotalUp += sum;
			} else if (dataKind == "80") {
			if (this.doTotalRecord(line, TotalUp) == 1) {
				return 1;
			}
		} else if (dataKind == "90") //動的に関数を呼び出す
			//if( $this->doTelRecord_C0($line, $pactid, &$sum) == 1 ){
			{
				if (call_user_func([this, this.doTelRecordPtr], line, pactid, sum) == 1) {
					return 1;
				}
			} else //未知の表示区分
			{
				return -1;
			}

		return 0;
	}

	checkKanriRecord(line, fileName, pactid, A_codes) //１行の長さチェック
	//データ種類チェック
	//締日が遅い会社もある、１ヶ月前まで許容範囲とする -- 2006/07/21
	//請求年月 = 利用年月 + 1.
	{
		if (!("pactname" in global)) pactname = undefined;

		if (line.length != this.BODY_LINE_LENGTH) {
			this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u4E00\u884C\u306E\u9577\u3055\u304C\u7570\u5E38(" + line.length + "!=" + this.BODY_LINE_LENGTH + ").");
			return 1;
		}

		var record = this.splitFix(line, this.Kanri_POS);

		if (record[0] != "10") //管理レコードは"10"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u7BA1\u7406\u30EC\u30B3\u30FC\u30C9\u306B\u7570\u5E38(" + record[0] + ").");
				return 1;
			}

		var prtelno = record[1].trim();

		for (var a_code of Object.values(A_codes)) {
			var a_code = a_code.trim().replace(/-/g, "");
			var errFlag = true;

			if (prtelno == a_code) {
				errFlag = false;
				break;
			}
		}

		if (errFlag == true) //請求先番号が存在しない場合のメール送信予約追加20101202morihara
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + "\u8ACB\u6C42\u5148\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u89AA\u756A\u53F7\u3068\u7570\u306A\u3063\u3066\u3044\u307E\u3059(" + prtelno + ").");
				var sql = "insert into clamp_error_tb" + "(pactid,carid,error_type,message,is_send,recdate,fixdate)" + "values" + "(" + pactid + "," + WILLCOM_CARRIER_ID + ",'prtelno'" + ",'\u30BD\u30D5\u30C8\u30D0\u30F3\u30AF\u306E\u8ACB\u6C42\u5148\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u89AA\u756A\u53F7\u3068\u7570\u306A\u3063\u3066\u3044\u307E\u3059'" + ",false" + ",'" + date("Y/m/d H:i:s") + "'" + ",'" + date("Y/m/d H:i:s") + "'" + ")" + ";";
				this.dbh.query(sql);
				return 1;
			}

		var target_yyyy = record[3].substr(0, 4);
		var target_mm = record[3].substr(4, 2);
		var target_yyyymm0 = target_yyyy + target_mm;
		target_mm += 1;

		if (target_mm > 12) {
			target_mm = 1;
			target_yyyy++;
		}

		if (target_mm < 10) //２桁にする.
			{
				target_mm = "0" + target_mm;
			}

		var target_yyyymm = target_yyyy + target_mm;

		if (target_yyyymm != this.billdate && target_yyyymm0 != this.billdate) {
			this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u30D5\u30A1\u30A4\u30EB\u306E\u5E74\u6708\u304C\u5BFE\u8C61\u5E74\u6708\u3068\u7570\u306A\u308A\u307E\u3059(" + target_yyyymm + "!=" + this.billdate + ").");
			return 1;
		}

		this.use_year = record[4].substr(0, 4);
		return 0;
	}

	doTelRecord_C0(line, pactid, sum) //分割してみる.
	//DEBUG * 表示してみる
	//print "**** doTelRecord_C0 **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//データ種類チェック
	//'-'ハイフンを除く
	//ローミングを入れた
	//HHMMSSS、そのままで良し
	//データを配列に保持する.
	//公私フラグ
	//明細件数カウント.
	{
		if (!("pactname" in global)) pactname = undefined;
		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u30C7\u30FC\u30BF\u30EC\u30B3\u30FC\u30C9\u306B\u7570\u5E38(" + record[0] + ").");
				return 1;
			}

		if (record[4].trim() == "" && record[5].trim() == "" && +(record[11] == 0)) //金額が０円
			//処理をスキップする
			{
				return 0;
			}

		var telno = record[1].trim().replace(/-/g, "");
		var date = this.use_year + "-" + record[4].substr(0, 2) + "-" + record[4].substr(2, 2) + " " + record[5].substr(0, 2) + ":" + record[5].substr(2, 2) + ":" + record[5].substr(4, 2);
		var totelno = record[7].trim();
		var toplace = record[9].trim();
		var fromplace = "\\N";
		var time = record[6];
		var charge = +record[11];
		var kousiflg = this.getTelKousi(pactid, telno, totelno);
		this.A_commFileData.push(pactid + "\t" + telno + "\t" + this.TEL_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t" + time + "\t" + charge + "\t" + "\\N\t" + "\\N\t" + WILLCOM_CARRIER_ID + "\t" + kousiflg + "\n");
		sum += charge;
		this.ReadMeisaiCnt++;
		return 0;
	}

	doTelRecord_C2(line, pactid, sum) //分割してみる.
	//DEBUG * 表示してみる
	//print "**** doTelRecord_C2 **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//データ種類チェック
	//'-'ハイフンを除く
	//to時刻を見ると、必ずしも通話時間の長さを反映しないようだ。例えば「終日」=24:00とか。
	//時間帯区分
	//データ量
	//データを配列に保持する.
	//$sum += $charge;	-- ここでsumは使わない.
	//明細件数カウント.
	{
		if (!("pactname" in global)) pactname = undefined;
		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u30C7\u30FC\u30BF\u30EC\u30B3\u30FC\u30C9\u306B\u7570\u5E38(" + record[0] + ").");
				return 1;
			}

		H_packet.telno = record[1].trim().replace(/-/g, "");
		var HH_from = record[5].substr(0, 2);
		var MM_from = record[5].substr(2, 2);
		H_packet.date = this.use_year + "-" + record[4].substr(0, 2) + "-" + record[4].substr(2, 2) + " " + HH_from + ":" + MM_from + ":00";
		H_packet.chargeseg = record[7].trim();
		H_packet.byte = +record[9];
		this.A_packetData.push(H_packet);
		this.ReadMeisaiCnt++;
		return 0;
	}

	doPacketRecord(line, pactid, sum) //分割してみる.
	//DEBUG * 表示してみる
	//print "//// doPacketRecord //////////////////////////////////\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//データ種類チェック
	//'-'ハイフンを除く
	//相手先電話番号が無いので.
	//明細のバイト合計
	//データ量チェック -- ここの警告は抑制する. 2009/12/11 T.Naka
	//小計レコードは、ウェブ、メール（ＳＢ網）、メール、番号受信（ＳＢ）など複数レコードある.
	//なので、１つのレコードだけで比較していると、この警告は必ず出ていた.
	//if( $sum_bytes != (int)$record[9] ){
	//$this->logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $this->billdate . LOG_DELIM
	//. $telno . "のデータ量合計が一致しません(". $sum_bytes . " != " . (int)$record[9] . ")." );
	//}
	//明細の処理
	{
		if (!("pactname" in global)) pactname = undefined;
		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u30C7\u30FC\u30BF\u30EC\u30B3\u30FC\u30C9\u306B\u7570\u5E38(" + record[0] + ").");
				return 1;
			}

		var telno = record[1].trim().replace(/-/g, "");
		var totelno = "";
		var sum_bytes = 0;

		for (var H_packet of Object.values(this.A_packetData)) {
			sum_bytes += H_packet.byte;

			if (H_packet.telno != telno) {
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + "\u96FB\u8A71\u756A\u53F7\u304C\u660E\u7D30\u3068\u5408\u8A08\u3067\u98DF\u3044\u9055\u3063\u3066\u3044\u308B(" + H_packet.telno + " != " + telno + ").");
				return 1;
			}
		}

		if (sum_bytes == 0) //ここの警告は抑制する、バイト数０であれば未使用のはず 2009/12/11 T.Naka
			//$this->logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $this->billdate . LOG_DELIM
			//. $telno . "の使用バイト数が０です." );
			{
				return 1;
			}

		var kousiflg = this.getTelKousi(pactid, telno, totelno);

		for (var H_packet of Object.values(this.A_packetData)) //料金をバイト数で比例配分する.
		//データを配列に保持する.
		//公私フラグ
		{
			var charge = + +(record[13] * H_packet.byte / sum_bytes);
			this.A_commFileData.push(pactid + "\t" + H_packet.telno + "\t" + this.TEL_TYPE + "\t" + H_packet.date + "\t" + totelno + "\t" + "\\N\t" + "\\N\t" + "\\N\t" + charge + "\t" + H_packet.byte + "\t" + H_packet.chargeseg + "\t" + WILLCOM_CARRIER_ID + "\t" + kousiflg + "\n");
			sum += charge;
		}

		return 0;
	}

	doTelRecord_C3(line, pactid, sum) //分割してみる.
	//DEBUG * 表示してみる
	//print "**** doTelRecord_C3 **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//データ種類チェック
	//'-'ハイフンを除く
	//相手国エリア
	//HHMMSSS、そのままで良し
	//データを配列に保持する.
	//公私フラグ
	//明細件数カウント.
	{
		if (!("pactname" in global)) pactname = undefined;
		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u30C7\u30FC\u30BF\u30EC\u30B3\u30FC\u30C9\u306B\u7570\u5E38(" + record[0] + ").");
				return 1;
			}

		var telno = record[1].trim().replace(/-/g, "");
		var date = this.use_year + "-" + record[4].substr(0, 2) + "-" + record[4].substr(2, 2) + " " + record[5].substr(0, 2) + ":" + record[5].substr(2, 2) + ":" + record[5].substr(4, 2);
		var totelno = record[7].trim();
		var toplace = record[8].trim();
		var fromplace = "\\N";
		var time = record[6];
		var charge = +record[10];
		var kousiflg = this.getTelKousi(pactid, telno, totelno);
		this.A_commFileData.push(pactid + "\t" + telno + "\t" + this.TEL_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t" + time + "\t" + charge + "\t" + "\\N\t" + "\\N\t" + WILLCOM_CARRIER_ID + "\t" + kousiflg + "\n");
		sum += charge;
		this.ReadMeisaiCnt++;
		return 0;
	}

	doTelRecord_C4(line, pactid, sum) //分割してみる.
	//DEBUG * 表示してみる
	//print "**** doTelRecord_C4 **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//データ種類チェック
	//'-'ハイフンを除く
	//データを配列に保持する. -- ここは情報料明細なのでフォーマットが違う.
	//キャリアID
	//明細件数カウント.
	{
		if (!("pactname" in global)) pactname = undefined;
		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u30C7\u30FC\u30BF\u30EC\u30B3\u30FC\u30C9\u306B\u7570\u5E38(" + record[0] + ").");
				return 1;
			}

		var telno = record[1].trim().replace(/-/g, "");

		if (record[4] != "    ") //日付が空白でなければ
			//'で囲う
			{
				var date = this.use_year + "-" + record[4].substr(0, 2) + "-" + record[4].substr(2, 2);

				if (record[5] != "      ") //時間が空白で無ければ
					{
						date += " " + record[5].substr(0, 2) + ":" + record[5].substr(2, 2) + ":" + record[5].substr(4, 2);
					}

				date = "'" + date + "'";
			} else {
			date = "\\N";
		}

		var accounting = record[8].trim();
		var charge = +record[9];
		var sitename = record[6].trim();
		this.A_infoFileData.push(pactid + "\t" + telno + "\t" + sitename + "\t" + accounting + "\t" + date + "\t" + charge + "\t" + WILLCOM_CARRIER_ID + "\n");
		sum += charge;
		this.ReadMeisaiCnt++;
		return 0;
	}

	doTelRecord_C5(line, pactid, sum) //分割してみる.
	//DEBUG * 表示してみる
	//print "**** doTelRecord_C5 **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//データ種類チェック
	//'-'ハイフンを除く
	//発信、着信のいずれか。
	//HHMMSSS、そのままで良し
	//データを配列に保持する.
	//公私フラグ
	//明細件数カウント.
	{
		if (!("pactname" in global)) pactname = undefined;
		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u30C7\u30FC\u30BF\u30EC\u30B3\u30FC\u30C9\u306B\u7570\u5E38(" + record[0] + ").");
				return 1;
			}

		var telno = record[1].trim().replace(/-/g, "");
		var date = this.use_year + "-" + record[4].substr(0, 2) + "-" + record[4].substr(2, 2) + " " + record[5].substr(0, 2) + ":" + record[5].substr(2, 2) + ":" + record[5].substr(4, 2);
		var totelno = record[7].trim();
		var toplace = "\\N";
		var fromplace = "\\N";
		var fromto = record[10].trim();

		if (preg_match("/\u767A\u4FE1/", fromto)) {
			toplace = record[8].trim();
		} else if (preg_match("/\u7740\u4FE1/", fromto)) {
			fromplace = record[8].trim();
		}

		var time = record[6];
		var charge = +record[11];
		var kousiflg = this.getTelKousi(pactid, telno, totelno);
		this.A_commFileData.push(pactid + "\t" + telno + "\t" + this.TEL_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t" + time + "\t" + charge + "\t" + "\\N\t" + "\\N\t" + WILLCOM_CARRIER_ID + "\t" + kousiflg + "\n");
		sum += charge;
		this.ReadMeisaiCnt++;
		return 0;
	}

	doTelRecord_C6(line, pactid, sum) //分割してみる.
	//DEBUG * 表示してみる
	//print "**** doTelRecord_C6 **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//データ種類チェック
	//'-'ハイフンを除く
	//相手先電話番号が無いので.
	//利用地域
	//通信データ量
	//データを配列に保持する.
	//公私フラグ
	//明細件数カウント.
	{
		if (!("pactname" in global)) pactname = undefined;
		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u30C7\u30FC\u30BF\u30EC\u30B3\u30FC\u30C9\u306B\u7570\u5E38(" + record[0] + ").");
				return 1;
			}

		var telno = record[1].trim().replace(/-/g, "");
		var date = this.use_year + "-" + record[4].substr(0, 2) + "-" + record[4].substr(2, 2) + " " + record[5].substr(0, 2) + ":" + record[5].substr(2, 2) + ":" + record[5].substr(4, 2);
		var totelno = "";
		var toplace = record[8].trim();
		var fromplace = "\\N";
		var time = "\\N";
		var charge = +record[9];
		var bytes = +record[7];
		var kousiflg = this.getTelKousi(pactid, telno, totelno);
		this.A_commFileData.push(pactid + "\t" + telno + "\t" + this.TEL_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t" + time + "\t" + charge + "\t" + bytes + "\t" + "\\N\t" + WILLCOM_CARRIER_ID + "\t" + kousiflg + "\n");
		sum += charge;
		this.ReadMeisaiCnt++;
		return 0;
	}

	doTelRecord_C7(line, pactid, sum) //分割してみる.
	//DEBUG * 表示してみる
	//print "**** doTelRecord_C7 **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//データ種類チェック
	//'-'ハイフンを除く
	//利用地域
	//通信データ量
	//データを配列に保持する.
	//公私フラグ
	//明細件数カウント.
	{
		if (!("pactname" in global)) pactname = undefined;
		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "\u306E\u30C7\u30FC\u30BF\u30EC\u30B3\u30FC\u30C9\u306B\u7570\u5E38(" + record[0] + ").");
				return 1;
			}

		var telno = record[1].trim().replace(/-/g, "");
		var date = this.use_year + "-" + record[4].substr(0, 2) + "-" + record[4].substr(2, 2) + " " + record[5].substr(0, 2) + ":" + record[5].substr(2, 2) + ":" + record[5].substr(4, 2);
		var totelno = record[6].trim();
		var toplace = record[7].trim();
		var fromplace = "\\N";
		var time = "\\N";
		var charge = +record[10];
		var bytes = +record[9];
		var kousiflg = this.getTelKousi(pactid, telno, totelno);
		this.A_commFileData.push(pactid + "\t" + telno + "\t" + this.TEL_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t" + time + "\t" + charge + "\t" + bytes + "\t" + "\\N\t" + WILLCOM_CARRIER_ID + "\t" + kousiflg + "\n");
		sum += charge;
		this.ReadMeisaiCnt++;
		return 0;
	}

	doTotalRecord(line, TotalUp) //分割してみる.
	//DEBUG * 表示してみる
	//print "==== doTotalRecord ================================\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	// 電話ごと、地域ごとに合計が出来ているようだ ****
	// チェックをかけるのは難しそうだ。
	//		$total = (int)$record[7];
	//		if( $total != $TotalUp ){
	//			$this->logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $this->billdate . LOG_DELIM
	//				. "会社合計金額が異なります.(". $total ."!=". $TotalUp .")." );
	//			return 1;
	//		}
	//
	{
		if (!("pactid" in global)) pactid = undefined;
		if (!("pactname" in global)) pactname = undefined;
		var record = this.splitFix(line, this.Meisai_POS);
		return 0;
	}

	splitFix(str, A_pos) //１個目の要素
	//中間の要素
	//最後の要素
	{
		var A_ret = Array();
		var total_len = str.length;
		A_ret[0] = str.substr(0, A_pos[0]);

		for (var i = 0; i < A_pos.length - 1; i++) {
			A_ret[i + 1] = str.substr(A_pos[i], A_pos[i + 1] - A_pos[i]);
		}

		A_ret[i + 1] = str.substr(A_pos[i]);
		mb_convert_variables("UTF-8", "SJIS-win", A_ret);
		return A_ret;
	}

	getTelKousi(pactid, telno, totelno) //権限が無ければ何もしない
	//かけ先マスターに登録されているか？
	//'-'ハイフンを除く
	{
		if (!("pactname" in global)) pactname = undefined;

		if (this.EnableKousi == false) //print "DEBUG_00: No permission for kousi\n";
			{
				return undefined;
			}

		if (undefined !== this.H_TelKousi[telno]) //公私分計しないのであれば、そこで終了
			//print "DEBUG_07: H_TelKousi, comhistbaseflg=". $comhistbaseflg ."\n";
			{
				if (this.H_TelKousi[telno] == -1) {
					return undefined;
				}

				var comhistbaseflg = this.H_TelKousi[telno];
			} else //tel_tb から kousiflg を得る
			//print "DEBUG_01: tel_kousiflg=". $tel_kousiflg .", and  pattern_id=". $pattern_id ."\n";
			//null だったら会社のデフォルト値を適用
			//公私分計ありと決定。ここで comhistbaseflg の公私パターン(A) を記録する
			{
				var sql = "select kousiptn, COALESCE(kousiflg,'(null)') as nkflag from tel_tb where pactid=" + pactid + " and carid=" + WILLCOM_CARRIER_ID + " and telno='" + telno + "'";
				var H_result = this.dbh.getHash(sql, true);

				for (var idx = 0; idx < H_result.length; idx++) //nullの場合は'(null)'と入る
				{
					var pattern_id = H_result[idx].kousiptn;
					var tel_kousiflg = H_result[idx].nkflag;
				}

				if (undefined !== tel_kousiflg == false || tel_kousiflg == "(null)") //print "DEBUG_02: default_kousiflg=". $default_kousiflg .", and  pattern_id=". $pattern_id ."\n";
					//kousiflg 公私分計フラグ(0:する、1:しない)
					//0: するなら、patternid を保持して処理を続ける
					{
						sql = "select kousiflg, patternid from kousi_default_tb where pactid=" + pactid + " and carid=" + WILLCOM_CARRIER_ID;
						H_result = this.dbh.getHash(sql, true);

						if (H_result.length == 0) //公私フラグをハッシュに登録、nullの代わりに-1とする
							{
								this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + "kousi_default_tb \u304C\u672A\u8A2D\u5B9A\u3067\u3059. telno=" + telno);
								this.H_TelKousi[telno] = -1;
								return undefined;
							}

						for (idx = 0;; idx < H_result.length; idx++) {
							var default_kousiflg = H_result[idx].kousiflg;
							pattern_id = H_result[idx].patternid;
						}

						if (default_kousiflg == 0) //引き続き次の処理に持ち込みたいので、tel_kousiflgを書き換える
							{
								tel_kousiflg = 0;
							} else //if( $default_kousiflg == 1 )
							//nullの代わりに-1とする
							{
								this.H_TelKousi[telno] = -1;
								return undefined;
							}
					}

				if (tel_kousiflg == 0) //kousi_pattern_tb からフラグを取得
					//print "DEBUG_03: comhistflg=". $comhistflg .", and comhistbaseflg=". $comhistbaseflg ."\n";
					//通話記録を使用しないのであれば、処理終了。
					{
						sql = "select comhistflg, comhistbaseflg from kousi_pattern_tb where patternid=" + pattern_id + " and carid=" + WILLCOM_CARRIER_ID;
						H_result = this.dbh.getHash(sql, true);

						for (idx = 0;; idx < H_result.length; idx++) //comhistflg = 通話記録判定(0:使用しない、1:使用する)
						//未登録の通話明細を公私のどちらとみなすか(0:公、1:私、2:未登録), 公私パターンを記憶する。(A)
						{
							var comhistflg = H_result[idx].comhistflg;
							comhistbaseflg = H_result[idx].comhistbaseflg;
						}

						if (comhistflg == 0) //公私フラグをハッシュに登録、nullの代わりに-1とする
							{
								this.H_TelKousi[telno] = -1;
								return undefined;
							}
					} else //if( $tel_kousiflg == 1 )
					//公私フラグをハッシュに登録、nullの代わりに-1とする
					{
						this.H_TelKousi[telno] = -1;
						return undefined;
					}

				this.H_TelKousi[telno] = comhistbaseflg;
			}

		totelno = totelno.trim().replace(/-/g, "");

		if (totelno != "" && undefined !== this.H_totel_master[telno][totelno]) //あれば、マスターの値を用いる
			//print "DEBUG_04: found in H_totel_master, kousiflg=". $kousiflg ."\n";
			{
				var kousiflg = this.H_totel_master[telno][totelno];
			} else //print "DEBUG_06: comhistbaseflg base, kousiflg=". $kousiflg ."\n";
			{
				if (totelno != "") //「未登録」で kousi_totel_master に電話を登録する。
					//公私分計フラグ(0:公、1:私、2:未登録)
					//同一の登録を行わないように、かけ先マスターに追加登録する
					//2:未登録
					//print "DEBUG_05: kousi_totel_master: totelno=". $totelno ."\n";
					{
						this.A_totelFileData.push(pactid + "\t" + telno + "\t" + WILLCOM_CARRIER_ID + "\t" + totelno + "\t" + "2" + "\n");

						if (undefined !== this.H_totel_master[telno] == false) {
							this.H_totel_master[telno] = Array();
						}

						this.H_totel_master[telno][totelno] = 2;
					}

				kousiflg = comhistbaseflg;
			}

		return kousiflg;
	}

	doBackup(db) //commhistory_X_tb をエクスポートする
	//infohistory_X_tb をエクスポートする
	//kousi_totel_master_tb をエクスポートする
	{
		var day = date("YmdHis");
		db.begin();
		var sql = "select * from " + this.commhistory_tb;
		var filename = DATA_EXP_DIR + "/" + this.commhistory_tb + day + ".exp";

		if (this.doCopyExp(sql, filename, db) != 0) //ロールバック
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.commhistory_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			}

		db.commit();
		db.begin();
		sql = "select * from " + this.infohistory_tb;
		filename = DATA_EXP_DIR + "/" + this.infohistory_tb + day + ".exp";

		if (this.doCopyExp(sql, filename, db) != 0) //ロールバック
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.infohistory_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			}

		db.commit();
		db.begin();
		sql = "select * from kousi_totel_master_tb";
		filename = DATA_EXP_DIR + "/" + "kousi_totel_master_tb" + day + ".exp";

		if (this.doCopyExp(sql, filename, db) != 0) //ロールバック
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "kousi_totel_master_tb\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			}

		db.commit();
		return 0;
	}

	doDelete(A_pactDone, db) //commhistory_X_tb から削除する
	//delete失敗した場合
	//delete失敗した場合
	//未登録電話のみ削除する
	//delete失敗した場合
	{
		var sql_str = "delete from " + this.commhistory_tb + " where pactid in (" + A_pactDone.join(",") + ") and carid = " + WILLCOM_CARRIER_ID;
		var rtn = db.query(sql_str, false);

		if (DB.isError(rtn) == true) //ロールバック
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.commhistory_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
				db.rollback();
				throw die(1);
			}

		sql_str = "delete from " + this.infohistory_tb + " where pactid in (" + A_pactDone.join(",") + ") and carid = " + WILLCOM_CARRIER_ID;
		rtn = db.query(sql_str, false);

		if (DB.isError(rtn) == true) //ロールバック
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.infohistory_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
				db.rollback();
				throw die(1);
			}

		sql_str = "delete from kousi_totel_master_tb where pactid in (" + A_pactDone.join(",") + ") and carid = " + WILLCOM_CARRIER_ID + " and kousiflg = '2'";
		rtn = db.query(sql_str, false);

		if (DB.isError(rtn) == true) //ロールバック
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "kousi_totel_master_tb \u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
				db.rollback();
				throw die(1);
			}

		return 0;
	}

	doImportComm(commhistoryFile, db) //commhistory_XX_tbへのインポート
	{
		if (filesize(commhistoryFile) > 0) {
			var commhistory_col = ["pactid", "telno", "type", "date", "totelno", "toplace", "fromplace", "time", "charge", "byte", "chargeseg", "carid", "kousiflg"];

			if (this.doCopyInsert(this.commhistory_tb, commhistoryFile, commhistory_col, db) != 0) //ロールバック
				{
					this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.commhistory_tb + " \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
					db.rollback();
					throw die(1);
				} else //メール出力を減らすためコメントアウト 20091109miya
				//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $this->pactid_in . LOG_DELIM . LOG_DELIM . $this->billdate . LOG_DELIM
				//. $this->commhistory_tb . " のインポート完了." );
				{}
		}

		return 0;
	}

	doImportInfo(infohistoryFile, db) //infohistory_XX_tbへのインポート
	{
		if (filesize(infohistoryFile) > 0) {
			var infohistory_col = ["pactid", "telno", "sitename", "accounting", "fromdate", "charge", "carid"];

			if (this.doCopyInsert(this.infohistory_tb, infohistoryFile, infohistory_col, db) != 0) //ロールバック
				{
					this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.commhistory_tb + " \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
					db.rollback();
					throw die(1);
				} else //メール出力を減らすためコメントアウト 20091109miya
				//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $this->pactid_in . LOG_DELIM . LOG_DELIM . $this->billdate . LOG_DELIM
				//. $this->infohistory_tb . " のインポート完了." );
				{}
		}

		return 0;
	}

	doImportTotel(totelmasterFile, db) //kousi_totel_master_tbへのインポート
	{
		if (filesize(totelmasterFile) > 0) {
			var totel_col = ["pactid", "telno", "carid", "totelno", "kousiflg"];

			if (this.doCopyInsert("kousi_totel_master_tb", totelmasterFile, totel_col, db) != 0) //ロールバック
				{
					this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "kousi_totel_master_tb \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
					db.rollback();
					throw die(1);
				} else //メール出力を減らすためコメントアウト 20091109miya
				//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $this->pactid_in . LOG_DELIM . LOG_DELIM . $this->billdate . LOG_DELIM
				//. "kousi_totel_master_tb のインポート完了." );
				{}
		}

		return 0;
	}

	doCopyInsert(table, filename, columns, db) //ファイルを開く
	//$ins->setDebug( true );
	//インサート処理開始
	//インサート処理おしまい、実質的な処理はここで行われる.
	{
		var fp = fopen(filename, "rt");

		if (!fp) {
			this.logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
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
					this.logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002\u30C7\u30FC\u30BF=" + line);
					fclose(fp);
					return 1;
				}

			var H_ins = Array();
			var idx = 0;

			for (var col of Object.values(columns)) {
				if (A_line[idx] != "\\N") //\N の場合はハッシュに追加しない
					{
						H_ins[col] = A_line[idx];
					}

				idx++;
			}

			if (ins.insert(H_ins) == false) {
				this.logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F\u3001\u30C7\u30FC\u30BF=" + line);
				fclose(fp);
				return 1;
			}
		}

		if (ins.end() == false) {
			this.logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u306B\u5931\u6557.");
			fclose(fp);
			return 1;
		}

		fclose(fp);
		return 0;
	}

	doCopyExp(sql, filename, db) //一度にFETCHする行数
	//ファイルを開く
	{
		var NUM_FETCH = 100000;
		var fp = fopen(filename, "wt");

		if (!fp) {
			this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
			return 1;
		}

		db.query("DECLARE exp_cur CURSOR FOR " + sql);

		for (; ; ) //ＤＢから１行ずつ結果取得
		{
			var result = pg_query(db.m_db.connection, "FETCH " + NUM_FETCH + " IN exp_cur");

			if (result == undefined) {
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "Fetch error, " + sql);
				fclose(fp);
				return 1;
			}

			if ((A_line = pg_fetch_array(result)) == undefined) //ループ終了
				{
					break;
				}

			var str = "";

			do //データ区切り記号、初回のみ空
			{
				var delim = "";

				for (var item of Object.values(A_line)) //データ区切り記号
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

			if (fputs(fp, str) == false) {
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + filename + "\u3078\u306E\u66F8\u304D\u8FBC\u307F\u5931\u6557\u3001" + str);
				fclose(fp);
				return 1;
			}
		}

		db.query("CLOSE exp_cur");
		fclose(fp);
		return 0;
	}

	finalData(pactid, pactDir, finDir) //同名のファイルが無いか
	{
		if (is_file(finDir) == true) {
			this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + finDir + "\u306F\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3067\u306F\u3042\u308A\u307E\u305B\u3093.");
			return 1;
		}

		if (is_dir(finDir) == false) //なければ作成する
			{
				if (mkdir(finDir) == false) {
					this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "\u7570\u52D5\u5148\u306E" + finDir + "\u304C\u4F5C\u6210\u3067\u304D\u306A\u304B\u3063\u305F.");
					return 1;
				}
			}

		var retval = 0;
		var dirh = opendir(pactDir);

		while (fname = readdir(dirh)) {
			var fpath = pactDir + "/" + fname;

			if (is_file(fpath)) //ファイル名の先頭が'Call数字'のものだけ
				{
					if (preg_match("/^Call[0-9]+/", fname)) //ファイル移動
						{
							if (rename(fpath, finDir + "/" + fname) == false) {
								this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + fname + "\u306E\u7570\u52D5\u5931\u6557.");
								retval = 1;
							}
						}
				}

			clearstatcache();
		}

		closedir(dirh);
		return retval;
	}

	getTimestamp() {
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
	}

	usage(argv, comment) //ロック解除
	{
		if (comment == "") {
			comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
		}

		print("\n" + comment + "\n\n");
		print("Usage) " + argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N}\n");
		print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
		print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
		print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
		print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n\n");
		this.lock(false);
		throw die(1);
	}

	lock(is_lock) //ロックする
	{
		if (this.dbh == undefined) {
			return false;
		}

		var pre = "batch";

		if (is_lock == true) //２重起動防止チェックの不具合修正 2009/3/19 s.maeda
			//既に起動中
			//現在の日付を得る
			//ロック解除
			{
				this.dbh.begin();
				this.dbh.lock("clamptask_tb");
				var sql = "select count(*) from clamptask_tb " + "where command like '" + this.dbh.escape(pre + "_" + SCRIPTNAME) + "' and " + "status = 1;";
				var count = this.dbh.getOne(sql);

				if (count != 0) {
					this.dbh.rollback();
					return false;
				}

				var nowtime = WillcomProcessBase.getTimestamp();
				sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + this.dbh.escape(pre + "_" + SCRIPTNAME) + "',1,'" + nowtime + "');";
				this.dbh.query(sql);
				this.dbh.commit();
			} else {
			this.dbh.begin();
			this.dbh.lock("clamptask_tb");
			sql = "delete from clamptask_tb " + "where command = '" + this.dbh.escape(pre + "_" + SCRIPTNAME) + "';";
			this.dbh.query(sql);
			this.dbh.commit();
		}

		return true;
	}

};

var proc = new WillcomProcessBase();

if (proc.MainProcess(_SERVER.argv) != 0) {
	throw die(1);
}

proc.OutputProcess();