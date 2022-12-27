// require("lib/script_db.php");
import TableNo, { ScriptDB, TableInserter } from "../../script/batch/lib/script_db"


// require("lib/script_log.php");
import { G_SCRIPT_ALL, G_SCRIPT_ERROR, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../../script/batch/lib/script_log"

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as lockfile from "proper-lockfile"
import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define";
import { expDataByCursor } from "../pg_function";

const SCRIPT_NAMEJ = "vodafone通話明細ファイルインポート";
const SCRIPTNAME = "import_voda_tuwa.php";
const VODA_DIR = "/vodafone/tuwa";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const VODA_CARRIER_ID = 4;
const KOUSI_FNCID = 47;

var pactname = "";
var pactid = 0;


class VodaProcessBase {
	SCRIPT_FILENAME: string;
	log_listener: ScriptLogBase;
	dbh: ScriptDB;
	logh: ScriptLogAdaptor;
	A_pactDone: Array<any>;
	A_types: Array<number>;
	Kanri_POS: Array<number>;
	HEAD_LINE_LENGTH: number;
	BODY_LINE_LENGTH: number;
	VODA_PAT: string;
	TEL_TYPE: string;
	Meisai_POS: Array<number>;
	doTelRecordPtr: ( a: string,  b: string, c: { [key: string]: number }, e: string) =>any = function(line: string, pactid: string, sum: { [key: string]: number }, fileName: string){};
	doEachLinePtr: ( a: string,  b: string, c: any, d: { [key: string]: number }, e: string, f: { [key: string]: number }) =>any = function(dataKind: string, line: string, pactid: any, TotalUp: { [key: string]: number }, fileName: string, sum: { [key: string]: number }){};
	pactid_in: string;
	billdate: string;
	mode: string;
	backup: string;
	dataDir: string;
	commhistory_tb: string;
	infohistory_tb: string;
	commhistoryFile: string;
	infohistoryFile: string;
	totelmasterFile: string;
	EnableKousi: boolean;
	H_totel_master: Array<any>;
	H_TelKousi: Array<any>;
	A_commFileData: Array<any>;
	A_infoFileData: Array<any>;
	A_totelFileData: Array<any>;
	A_packetData: Array<any>;
	ReadMeisaiCnt: number;
	use_year: string;

	constructor() //共通ログファイル名
	//ログListener を作成
	//ログファイル名、ログ出力タイプを設定
	//DEBUG * 標準出力に出してみる.
	//ログListener にログファイル名、ログ出力タイプを渡す
	//DBハンドル作成
	//エラー出力用ハンドル
	//処理が終了した pactid を格納するための配列
	//処理すべきファイル種別の番号
	{
		this.SCRIPT_FILENAME = "import_voda_tuwa.php";

		var dbLogFile = DATA_LOG_DIR + "/billbat.log";

		// var log_listener = new ScriptLogBase(0);
		this.log_listener = new ScriptLogBase(0);


		var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);


		var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");

		this.log_listener.putListener(log_listener_type);

		this.log_listener.putListener(log_listener_type2);
		this.dbh = new ScriptDB(this.log_listener);
		this.logh = new ScriptLogAdaptor(this.log_listener, true);
		this.A_pactDone = Array();

		this.A_types = [0, 2, 3, 5, 6, 4, 7];
		this.Kanri_POS = [];
		this.HEAD_LINE_LENGTH = 0;
		this.BODY_LINE_LENGTH = 0;
		this.VODA_PAT = "";
		this.TEL_TYPE = "";
		this.Meisai_POS = [];
		// this.doTelRecordPtr = "";
		// this.doEachLinePtr = "";
		this.pactid_in = "";
		this.billdate = "";
		this.mode = "";
		this.backup = "";
		this.dataDir = "";
		this.commhistory_tb = ""
		this.infohistory_tb = ""
		this.commhistoryFile = ""
		this.infohistoryFile = ""
		this.totelmasterFile = ""
		this.EnableKousi = false
		this.H_totel_master = [];
		this.H_TelKousi = [];
		this.A_commFileData = [];
		this.A_infoFileData = [];
		this.A_totelFileData = [];
		this.A_packetData = [];
		this.ReadMeisaiCnt = 0;
		this.use_year = ""
	}


	setParam(ctype: string | number) //管理レコード
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
				this.VODA_PAT = "/^Call0/";
				this.TEL_TYPE = "V0";
				this.Meisai_POS = [2, 15, 21, 23, 27, 33, 40, 53, 65, 71, 72, 84, 96, 108];
				this.doTelRecordPtr = this.doTelRecord_C0;
				this.doEachLinePtr = this.doEachLine;
				break;

			case 2:
				this.VODA_PAT = "/^Call2/";
				this.TEL_TYPE = "V2";
				this.Meisai_POS = [2, 15, 21, 23, 27, 31, 35, 43, 63, 73, 78, 88, 94, 104];
				this.doTelRecordPtr = this.doTelRecord_C2;
				this.doEachLinePtr = this.doEachLinePacket;
				break;

			case 3:
				this.VODA_PAT = "/^Call3/";
				this.TEL_TYPE = "V3";
				this.Meisai_POS = [2, 15, 21, 23, 27, 33, 40, 56, 76, 92, 104];
				this.doTelRecordPtr = this.doTelRecord_C3;
				this.doEachLinePtr = this.doEachLine;
				break;

			case 4:
				this.VODA_PAT = "/^Call4/";
				this.TEL_TYPE = "V4";
				this.Meisai_POS = [2, 15, 21, 23, 27, 33, 73, 103, 123, 135];
				this.doTelRecordPtr = this.doTelRecord_C4;
				this.doEachLinePtr = this.doEachLineInfo;
				break;

			case 5:
				this.VODA_PAT = "/^Call5/";
				this.TEL_TYPE = "V5";
				this.Meisai_POS = [2, 15, 21, 23, 27, 33, 40, 70, 90, 106, 126, 138];
				this.doTelRecordPtr = this.doTelRecord_C5;
				this.doEachLinePtr = this.doEachLine;
				break;

			case 6:
				this.VODA_PAT = "/^Call6/";
				this.TEL_TYPE = "V6";
				this.Meisai_POS = [2, 15, 21, 23, 27, 33, 53, 66, 126, 143];
				this.doTelRecordPtr = this.doTelRecord_C6;
				this.doEachLinePtr = this.doEachLine;
				break;

			case 7:
				this.VODA_PAT = "/^Call7/";
				this.TEL_TYPE = "V7";
				this.Meisai_POS = [2, 15, 21, 23, 27, 33, 58, 78, 98, 111, 125, 145, 177];
				this.doTelRecordPtr = this.doTelRecord_C7;
				this.doEachLinePtr = this.doEachLine;
				break;

			default:

				this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "未知のctype、" + ctype);
				throw process.exit(1);// 2022cvt_009
		}
	}

	async MainProcess(argv: any[])//開始メッセージ
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
		if (argv.length != 5 + 1) //数が正しくない
			{
				this.usage(argv, "");
				return 1;
			}


		var argvCnt = argv.length;

		var year = parseInt(this.billdate.substring(0, 4));
		var month = parseInt(this.billdate.substring(4, 2));


		for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
		{
			if (argv[cnt].match(/^-e=/))
			// if (ereg("^-e=", argv[cnt]) == true) //モード文字列チェック
				{
					this.mode = argv[cnt].replace(/^-e=/, "").toLowerCase();
					// this.mode = ereg_replace("^-e=", "", argv[cnt]).toLowerCase();

					if (!this.mode.match(/^[ao]$/)) {
					// if (ereg("^[ao]$", this.mode) == false) {
						this.usage(argv, "ERROR: モードの指定が不正です");
					}

					continue;
				}

			if (argv[cnt].match(/^-y=/))
			// if (ereg("^-y=", argv[cnt]) == true) //請求年月文字列チェック
				{
					this.billdate = argv[cnt].replace(/^-y=/, "");
					// this.billdate = ereg_replace("^-y=", "", argv[cnt]);

					if (!this.billdate.match(/^[0-9]{6}$/)) {
					// if (ereg("^[0-9]{6}$", this.billdate) == false) {
						this.usage(argv, "ERROR: 請求年月の指定が不正です");
					} else //年月チェック
						{

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								this.usage(argv, "ERROR: 請求年月の指定が不正です(" + this.billdate + ")");
							}
						}

					var diffmon = (new Date().getFullYear() - year) * 12 + (new Date().getMonth() + 1 - month);
					// var diffmon = (date("Y") - year) * 12 + (date("m") - month);

					if (diffmon < 0) {
						this.usage(argv, "ERROR: 請求年月に未来の年月を指定することはできません(" + this.billdate + ")");
					} else if (diffmon >= 12) {
						this.usage(argv, "ERROR: 請求年月に１年以上前の年月を指定することはできません(" + this.billdate + ")");
					}

					continue;
				}

			if (argv[cnt].match(/^-p=/))
			// if (ereg("^-p=", argv[cnt]) == true) //契約ＩＤチェック
				{
					this.pactid_in = argv[cnt].replace(/^-p=/, "").toLowerCase();
					// this.pactid_in = ereg_replace("^-p=", "", argv[cnt]).toLowerCase();

					if (!this.pactid_in.match(/^all$/) && !this.pactid_in.match(/^[0-9]+$/)) {
					// if (ereg("^all$", this.pactid_in) == false && ereg("^[0-9]+$", this.pactid_in) == false) {
						this.usage(argv, "ERROR: 契約ＩＤの指定が不正です");
					}

					continue;
				}

			if (argv[cnt].match(/^-b=/))
			// if (ereg("^-b=", argv[cnt]) == true) //バックアップの有無のチェック
				{
					this.backup = argv[cnt].replace(/^-b=/, "").toLowerCase();
					// this.backup = ereg_replace("^-b=", "", argv[cnt]).toLowerCase();

					if (!this.backup.match(/^[ny]$/)) {
					// if (ereg("^[ny]$", this.backup) == false) {
						this.usage(argv, "ERROR: バックアップの指定が不正です");
					}

					continue;
				}

			this.usage(argv, "");
		}

		this.dataDir = DATA_DIR + "/" + this.billdate + VODA_DIR;

		if (fs.existsSync(this.dataDir) == false) {// 2022cvt_003
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "通話明細データファイルディレクトリ（" + this.dataDir + "）がみつかりません.");
		}


		var A_pactid = Array();

		if (this.pactid_in == "all") //処理する契約ＩＤを取得する
			//契約ＩＤが指定されている場合
			{

				var dirh = fs.readdirSync(this.dataDir);
				// var dirh = openDir(this.dataDir);// 2022cvt_004

				for (var fileName of dirh)
				// while (fileName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
				{
					if (fs.existsSync(this.dataDir + "/" + fileName) && fileName != "." && fileName != "..") {// 2022cvt_003
						A_pactid.push(fileName);
					}

// 					clearstatcache();// 2022cvt_012
				}

				// closedir(dirh);
			} else {
			A_pactid.push(this.pactid_in);
		}

		if (A_pactid.length == 0) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "Pact用データディレクトリが１つもありません.");
			return 1;
		}

		if (await this.lock(true) == false) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "２重起動です、前回エラー終了の可能性があります.");
			return 1;
		}


		var O_tableNo = new TableNo();

		var tableNo = O_tableNo.get(year, month);
		this.commhistory_tb = "commhistory_" + tableNo + "_tb";
		this.infohistory_tb = "infohistory_" + tableNo + "_tb";

		var telX_tb = "tel_" + tableNo + "_tb";
		this.commhistoryFile = this.dataDir + "/" + this.commhistory_tb + this.billdate + this.pactid_in + ".ins";

		// var fp_comm = fopen(this.commhistoryFile, "w");
		var fp_comm;
		try {
			fp_comm = fs.openSync(this.commhistoryFile, "w");
		} catch (e) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.commhistoryFile + "の書き込みオープン失敗.");
			return 1;
		}

		this.infohistoryFile = this.dataDir + "/" + this.infohistory_tb + this.billdate + this.pactid_in + ".ins";

		var fp_info;
		try {
			fp_info = fs.openSync(this.infohistoryFile, "w");
		} catch (e) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.infohistoryFile + "の書き込みオープン失敗.");
			return 1;
		}
		// var fp_info = fopen(this.infohistoryFile, "w");

		this.totelmasterFile = this.dataDir + "/" + "kousi_totel_master_tb" + this.billdate + this.pactid_in + ".ins";

		// var fp_totel = fopen(this.totelmasterFile, "w");
		var fp_totel;
		try {
			fp_totel = fs.openSync(this.totelmasterFile, "w")
		} catch (e) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.totelmasterFile + "の書き込みオープン失敗.");
			return 1;
		}


		var sql = "select pactid,compname from pact_tb order by pactid";

		var H_result = await this.dbh.getHash(sql, true);

		var pactCnt = H_result.length;

		var H_pactid: { [key: string]: any } = {}

		for (cnt = 0; cnt < pactCnt; cnt++) //pactid => 会社名
		{
			H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
		}

		pactCnt = A_pactid.length;
		A_pactid.sort();

		for (cnt = 0; cnt < pactCnt; cnt++) //請求データディレクトリにある契約ＩＤがマスターに登録されているか？
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
			if (!(typeof H_pactid[A_pactid[cnt]] !== undefined && typeof H_pactid[A_pactid[cnt]] !== null))
			if (undefined !== H_pactid[A_pactid[cnt]] == false) {
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "pactid=" + A_pactid[cnt] + " は pact_tb に登録されていません.");
				continue;
			}


			var pactid = A_pactid[cnt];

			var pactname = H_pactid[pactid];

			var A_codes = Array();
			sql = "select prtelno from bill_prtel_tb where pactid=" + pactid + " and carid=" + VODA_CARRIER_ID;
			H_result = await this.dbh.getHash(sql, true);


			for (var idx = 0; idx < H_result.length; idx++) {
				A_codes.push(H_result[idx].prtelno);
			}

			if (A_codes.length == 0) //次のPactの処理にスキップする.
				{
					this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + "pactid=" + pactid + "についての請求先番号がbill_prtel_tbに見つかりません.");
					continue;
				}

			sql = "select count(*) from fnc_relation_tb where pactid=" + pactid + " and fncid=" + KOUSI_FNCID;
			cnt = await this.dbh.getOne(sql, true);

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
					sql = "select telno, totelno, kousiflg from kousi_totel_master_tb where pactid=" + pactid + " and carid=" + VODA_CARRIER_ID + "and kousiflg != '2' order by telno, totelno";
					H_result = await this.dbh.getHash(sql, true);

					var totelCnt = H_result.length;
					this.H_totel_master = Array();

					for (cnt = 0; cnt < totelCnt; cnt++) //電話番号 => 相手先電話番号 => 公私フラグ
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



			for (var ctype of this.A_types)
			// for (var ctype of Object.values(this.A_types)) //処理するファイル種別ごとのパラメータ設定
			//処理する請求データファイル名配列
			//通話明細データファイル名を取得する
			//通話明細データファイルがなかった場合
			//各ファイルについての処理 -- ここが読み込みの中心処理
			{

				this.setParam(ctype);

				var A_billFile: string[] = Array();

				var dataDirPact = this.dataDir + "/" + pactid;
				var dirh = fs.readdirSync(dataDirPact);
				// dirh = openDir(dataDirPact);// 2022cvt_004
				for (var fileName of dirh) {
				// while (fileName = fs.readdir(dirh)) {// 2022cvt_005

					if (fs.statSync(dataDirPact + "/" + fileName).isFile())
					// if (is_file(dataDirPact + "/" + fileName) == true) //ファイル名の先頭文字が適合するものだけ
						{
// 2022cvt_019
							if (fileName.match(this.VODA_PAT)) {
							// if (preg_match(this.VODA_PAT, fileName)) {
								A_billFile.push(fileName);
							}
						}

// 					clearstatcache();// 2022cvt_012
				}

				if (A_billFile.length == 0) //ここの警告は抑制する 20091211miya
					//$this->logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $this->billdate . LOG_DELIM

					//. "pactid=" . $pactid . ", ctype=". $ctype ." の通話明細データファイルが見つかりません.");
					//次のPactの処理にスキップする.
					{
						// closedir(dirh);
						continue;
					}

				// closedir(dirh);
				A_billFile.sort();
				errFlag = false;


				for (var fileName of A_billFile) //メール出力を減らすためコメントアウト 20091109miya
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

					for (var value of this.A_commFileData) {
						try {
							fs.writeFileSync(fp_comm, value);
						} catch (e) {
							this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + this.commhistoryFile + "ファイルの書き出しに失敗.");
							errFlag = true;
							break;
						}
					}

					if (errFlag) //次のPactの処理にスキップする.
						{
							continue;
						}

					// fflush(fp_comm);


					for (var value of this.A_infoFileData) {
						try {
							fs.writeFileSync(fp_info, value)
						} catch (e) {
							this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + this.infohistoryFile + "ファイルの書き出しに失敗.");
							errFlag = true;
							break;
						}
					}

					if (errFlag) //次のPactの処理にスキップする.
						{
							continue;
						}

					// fflush(fp_info);


					for (var value of this.A_totelFileData) {
						try {
							fs.writeFileSync(fp_totel, value);
						} catch (e) {
							this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + this.totelmasterFile + "ファイルの書き出しに失敗.");
							errFlag = true;
							break;
						}
					}

					if (errFlag) //次のPactの処理にスキップする.
						{
							continue;
						}

					// fflush(fp_totel);
					this.A_pactDone.push(pactid);
				}
		}

		fs.closeSync(fp_comm);
		// fclose(fp_comm);
		fs.closeSync(fp_info);
		// fclose(fp_info);
		fs.closeSync(fp_totel);
		// fclose(fp_totel);

		if (this.A_pactDone.length == 0) {
			this.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "読み込みに成功したPactが１つも無かった.");
			return 1;
		}
		return 0;
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


		for (var pactid of this.A_pactDone) {

			var pactDir = this.dataDir + "/" + pactid;

			var finDir = pactDir + "/" + FIN_DIR;
			this.finalData(pactid, pactDir, finDir);
		}

		this.lock(false);
		return 0;
	}

	doEachFile(fileName: string, pactid: string, A_codes: any[]) //ファイルオープン
	//管理レコードのチェック
	{
		// if (!("pactname" in global)) pactname = undefined;

		var buffer = "";
		try {
			buffer = fs.readFileSync(fileName, 'utf8');
		} catch (e) {
			this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "のオープン失敗.");
			return 1;
		}
		var text = Encoding.convert(buffer, {
			from: 'SJIS',
			to: 'UNICODE',
			type: 'string'
		});
		var lines = text.toString().split("\r\n")
		// var fp = fopen(fileName, "rb");

		if (lockfile.checkSync(fileName)) {
		// if (flock(fp, LOCK_SH) == false) {
			this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "のロックに失敗.");
			// fclose(fp);
			return 1;
		}
		lockfile.lockSync(fileName);


		// var line = fgets(fp);
		// line = rtrim(line, "\r\n");

		if (this.checkKanriRecord(lines[0], fileName, pactid, A_codes) == 1) {
			lockfile.unlockSync(fileName);
			// flock(fp, LOCK_UN);
			// fclose(fp);
			return 1;
		}


		var TotalUp = { "value": 0 };
		var sum = { "value": 0 };

		for (var line of lines.splice(1))
		// while (line = fgets(fp)) //改行取り
		//１行の長さチェック
		//10:通話単位、20:請求先単位、30:請求先合計料
		//動的に関数を呼び出す
		//$ret_val = $this->doEachLine( $dataKind, $line, $pactid, &$TotalUp );
		{
			// if (feof(fp)) //おしまい.
			// 	{
			// 		break;
			// 	}

			// line = rtrim(line, "\r\n");

			if (line.length != this.HEAD_LINE_LENGTH) {
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "の一行の長さが異常(" + line.length + "!=" + this.HEAD_LINE_LENGTH + ").");
				lockfile.unlockSync(fileName);
				// flock(fp, LOCK_UN);
				// fclose(fp);
				return 1;
			}


			var dataKind = line.substring(21, 2);

			var ret_val = this.doEachLinePtr(dataKind, line, pactid, TotalUp, fileName, sum);
			// var ret_val = call_user_func([this, this.doEachLinePtr], dataKind, line, pactid, TotalUp);

			if (ret_val == 1) //エラー発生
				{
					lockfile.unlockSync(fileName);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return 1;
				} else if (ret_val == -1) //未知の表示区分
				{
					this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "未知の表示区分(" + dataKind + ").");
					lockfile.unlockSync(fileName);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return 1;
				}
		}

		lockfile.unlockSync(fileName);
		// flock(fp, LOCK_UN);
		// fclose(fp);
		return 0;
	}

	doEachLine(dataKind: string, line: string, pactid: any, TotalUp: { [key: string]: number }, fileName: string, sum: { [key: string]: number }) //10:通話単位
	{
		if (dataKind == "10") //動的に関数を呼び出す
			//if( $this->doTelRecord_C0($line, $pactid, &$sum) == 1 ){
			{
				sum.value = 0;

				if (this.doTelRecordPtr(line, pactid, sum, fileName) == 1) {
				// if (call_user_func([this, this.doTelRecordPtr], line, pactid, sum) == 1) {
					lockfile.unlockSync(fileName);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return 1;
				}

				TotalUp.value += sum.value;
			} else if (dataKind == "80" || dataKind == "90") //_C0
			{
				if (this.doTotalRecord(line, TotalUp) == 1) {
					lockfile.unlockSync(fileName);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return 1;
				}
			} else //未知の表示区分
			{
				return -1;
			}

		return 0;
	}

	doEachLinePacket(dataKind: string, line: string, pactid: string, TotalUp: { [key: string]: number }, fileName: string, sum: { [key: string]: number }) //10:通話単位
	{
		if (dataKind == "10") //動的に関数を呼び出す
			//if( $this->doTelRecord_C0($line, $pactid, &$sum) == 1 ){
			{
				if (this.doTelRecordPtr(line, pactid, sum, fileName) == 1) {
				// if (call_user_func([this, this.doTelRecordPtr], line, pactid, sum) == 1) {
					return 1;
				}
			} else if (dataKind == "70") //パケット按分用配列の再初期化
			{

				sum.value = 0;
				if (this.doPacketRecord(line, pactid, sum, fileName) == 1) //パケット処理専用関数
					{
						return 1;
					}

				TotalUp.value += sum.value;
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

	doEachLineInfo(dataKind: string, line: string, pactid: any, TotalUp: { [key: string]: number }, fileName: string, sum: { [key: string]: number }) //10:通話単位
	{
		if (dataKind == "10") //動的に関数を呼び出す
			//if( $this->doTelRecord_C0($line, $pactid, &$sum) == 1 ){
			{

				sum.value = 0;

				if (this.doTelRecordPtr(line, pactid, sum, fileName) == 1) {
				// if (call_user_func([this, this.doTelRecordPtr], line, pactid, sum) == 1) {
					return 1;
				}

				TotalUp.value += sum.value;
			} else if (dataKind == "80") {
			if (this.doTotalRecord(line, TotalUp) == 1) {
				return 1;
			}
		} else if (dataKind == "90") //動的に関数を呼び出す
			//if( $this->doTelRecord_C0($line, $pactid, &$sum) == 1 ){
			{
				if (this.doTelRecordPtr(line, pactid, sum, fileName) == 1) {
				// if (call_user_func([this, this.doTelRecordPtr], line, pactid, sum) == 1) {
					return 1;
				}
			} else //未知の表示区分
			{
				return -1;
			}

		return 0;
	}

	checkKanriRecord(line: string, fileName: string, pactid: string, A_codes: any[]) //１行の長さチェック
	//データ種類チェック
	//締日が遅い会社もある、１ヶ月前まで許容範囲とする -- 2006/07/21
	//請求年月 = 利用年月 + 1.
	{
		// if (!("pactname" in global)) pactname = undefined;

		if (line.length != this.BODY_LINE_LENGTH) {
			this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "の一行の長さが異常(" + line.length + "!=" + this.BODY_LINE_LENGTH + ").");
			return 1;
		}


		var record = this.splitFix(line, this.Kanri_POS);

		if (record[0] != "10") //管理レコードは"10"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "の管理レコードに異常(" + record[0] + ").");
				return 1;
			}


		var prtelno = record[1].trim();
		var errFlag = false;


		for (var a_code of A_codes) {

			var a_code = a_code.trim().replace(/-/g, "");

			var errFlag = true;

			if (prtelno == a_code) {
				errFlag = false;
				break;
			}
		}

		if (errFlag == true) //請求先番号が存在しない場合のメール送信予約追加20101202morihara
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + "請求先番号が登録されている親番号と異なっています(" + prtelno + ").");


				var sql = "insert into clamp_error_tb" + "(pactid,carid,error_type,message,is_send,recdate,fixdate)" + "values" + "(" + pactid + "," + VODA_CARRIER_ID + ",'prtelno'" + ",'ソフトバンクの請求先番号が登録されている親番号と異なっています'" + ",false" + ",'" +
				new Date().toISOString().replace(/T/, '').replace(/\..+/, '').replace("-", "/") + "'" + ",'" + new Date().toISOString().replace(/T/, '').replace(/\..+/, '').replace("-", "/") + "'" + ")" + ";";
				this.dbh.query(sql);
				return 1;
			}


		var target_yyyy = record[3].substring(0, 4);

		var target_mm = record[3].substring(4, 2);

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
			this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "ファイルの年月が対象年月と異なります(" + target_yyyymm + "!=" + this.billdate + ").");
			return 1;
		}

		this.use_year = record[4].substring(0, 4);
		return 0;
	}

	doTelRecord_C0(line: string, pactid: string, sum: { [key: string]: number }, fileName: string) //分割してみる.
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
		// if (!("pactname" in global)) pactname = undefined;

		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "のデータレコードに異常(" + record[0] + ").");
				return 1;
			}

		if (record[4].trim() == "" && record[5].trim() == "" && +(record[11] == 0)) //金額が０円
			//処理をスキップする
			{
				return 0;
			}


		var telno = record[1].trim().replace(/-/g, "");

		var date = this.use_year + "-" + record[4].substring(0, 2) + "-" + record[4].substring(2, 2) + " " + record[5].substring(0, 2) + ":" + record[5].substring(2, 2) + ":" + record[5].substring(4, 2);

		var totelno = record[7].trim();

		var toplace = record[9].trim();

		var fromplace = "\\N";

		var time = record[6];

		var charge = +record[11];

		var kousiflg = this.getTelKousi(pactid, telno, totelno);
		this.A_commFileData.push(pactid + "\t" + telno + "\t" + this.TEL_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t" + time + "\t" + charge + "\t" + "\\N\t" + "\\N\t" + VODA_CARRIER_ID + "\t" + kousiflg + "\n");
		sum.value += charge;
		this.ReadMeisaiCnt++;
		return 0;
	}

	doTelRecord_C2(line: string, pactid: string, sum: { [key: string]: number }, fileName: string) //分割してみる.
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
		// if (!("pactname" in global)) pactname = undefined;

		var record = this.splitFix(line, this.Meisai_POS);
		var H_packet: { [key: string]: any } = {}

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "のデータレコードに異常(" + record[0] + ").");
				return 1;
			}

		H_packet.telno = record[1].trim().replace(/-/g, "");

		var HH_from = record[5].substring(0, 2);

		var MM_from = record[5].substring(2, 2);
		H_packet.date = this.use_year + "-" + record[4].substring(0, 2) + "-" + record[4].substring(2, 2) + " " + HH_from + ":" + MM_from + ":00";
		H_packet.chargeseg = record[7].trim();
		H_packet.byte = +record[9];
		this.A_packetData.push(H_packet);
		this.ReadMeisaiCnt++;
		return 0;
	}

	doPacketRecord(line: string, pactid: string, sum: { [key: string]: number }, fileName: string) //分割してみる.
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
	//2014-04-02
	//		if( $sum_bytes == 0 ){
	//		// ここの警告は抑制する、バイト数０であれば未使用のはず 2009/12/11 T.Naka
	//	//		$this->logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $this->billdate . LOG_DELIM
	//	//			. $telno . "の使用バイト数が０です." );
	//			return 1;
	//		}
	//明細の処理
	{
		// if (!("pactname" in global)) pactname = undefined;

		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "のデータレコードに異常(" + record[0] + ").");
				return 1;
			}


		var telno = record[1].trim().replace(/-/g, "");

		var totelno = "";

		var sum_bytes = 0;


		for (var H_packet of this.A_packetData) {
			sum_bytes += H_packet.byte;

			if (H_packet.telno != telno) {
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + "電話番号が明細と合計で食い違っている(" + H_packet.telno + " != " + telno + ").");
				return 1;
			}
		}


		var kousiflg = this.getTelKousi(pactid, telno, totelno);


		for (var H_packet of this.A_packetData) //料金をバイト数で比例配分する.
		//データを配列に保持する.
		//公私フラグ
		{

			var charge = + +(record[13] * H_packet.byte / sum_bytes);
			this.A_commFileData.push(pactid + "\t" + H_packet.telno + "\t" + this.TEL_TYPE + "\t" + H_packet.date + "\t" + totelno + "\t" + "\\N\t" + "\\N\t" + "\\N\t" + charge + "\t" + H_packet.byte + "\t" + H_packet.chargeseg + "\t" + VODA_CARRIER_ID + "\t" + kousiflg + "\n");
			sum.value += charge;
		}

		return 0;
	}

	doTelRecord_C3(line: string, pactid: string, sum: { [key: string]: number }, fileName: string) //分割してみる.
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
		// if (!("pactname" in global)) pactname = undefined;

		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "のデータレコードに異常(" + record[0] + ").");
				return 1;
			}


		var telno = record[1].trim().replace(/-/g, "");

		var date = this.use_year + "-" + record[4].substring(0, 2) + "-" + record[4].substring(2, 2) + " " + record[5].substring(0, 2) + ":" + record[5].substring(2, 2) + ":" + record[5].substring(4, 2);
		// var date = this.use_year + "-" + record[4].substr(0, 2) + "-" + record[4].substr(2, 2) + " " + record[5].substr(0, 2) + ":" + record[5].substr(2, 2) + ":" + record[5].substr(4, 2);

		var totelno = record[7].trim();

		var toplace = record[8].trim();

		var fromplace = "\\N";

		var time = record[6];

		var charge = +record[10];

		var kousiflg = this.getTelKousi(pactid, telno, totelno);
		this.A_commFileData.push(pactid + "\t" + telno + "\t" + this.TEL_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t" + time + "\t" + charge + "\t" + "\\N\t" + "\\N\t" + VODA_CARRIER_ID + "\t" + kousiflg + "\n");
		sum.value += charge;
		this.ReadMeisaiCnt++;
		return 0;
	}

	doTelRecord_C4(line: string, pactid: string, sum: { [key: string]: number }, fileName: string) //分割してみる.
	//DEBUG * 表示してみる
	//print "**** doTelRecord_C4 **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//データ種類チェック
	//'-'ハイフンを除く
	//データを配列に保持する. -- ここは情報料明細なのでフォーマットが違う.
	//キャリアID
	//明細件数カウント.
	{
		// if (!("pactname" in global)) pactname = undefined;

		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "のデータレコードに異常(" + record[0] + ").");
				return 1;
			}


		var telno = record[1].trim().replace(/-/g, "");

		if (record[4] != "    ") //日付が空白でなければ
			//'で囲う
			{

				var date = this.use_year + "-" + record[4].substring(0, 2) + "-" + record[4].substring(2, 2);

				if (record[5] != "      ") //時間が空白で無ければ
					{
						date += " " + record[5].substring(0, 2) + ":" + record[5].substring(2, 2) + ":" + record[5].substring(4, 2);
					}

				date = "'" + date + "'";
			} else {
			date = "\\N";
		}


		var accounting = record[8].trim();

		var charge = +record[9];

		var sitename = record[6].trim();
		this.A_infoFileData.push(pactid + "\t" + telno + "\t" + sitename + "\t" + accounting + "\t" + date + "\t" + charge + "\t" + VODA_CARRIER_ID + "\n");
		sum.value += charge;
		this.ReadMeisaiCnt++;
		return 0;
	}

	doTelRecord_C5(line: string, pactid: string, sum:{ [key: string]: number }, fileName: string) //分割してみる.
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
		// if (!("pactname" in global)) pactname = undefined;

		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "のデータレコードに異常(" + record[0] + ").");
				return 1;
			}


		var telno = record[1].trim().replace(/-/g, "");

		var date = this.use_year + "-" + record[4].substring(0, 2) + "-" + record[4].substring(2, 2) + " " + record[5].substring(0, 2) + ":" + record[5].substring(2, 2) + ":" + record[5].substring(4, 2);

		var totelno = record[7].trim();

		var toplace = "\\N";

		var fromplace = "\\N";

		var fromto = record[10].trim();

// 2022cvt_019
		if (fromto.match("/発信/")) {
		// if (preg_match("/\u767A\u4FE1/", fromto)) {
			toplace = record[8].trim();
// 2022cvt_019
		} else if (fromto.match("/着信/")) {
		// } else if (preg_match("/\u7740\u4FE1/", fromto)) {
			fromplace = record[8].trim();
		}


		var time = record[6];

		var charge = +record[11];

		var kousiflg = this.getTelKousi(pactid, telno, totelno);
		this.A_commFileData.push(pactid + "\t" + telno + "\t" + this.TEL_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t" + time + "\t" + charge + "\t" + "\\N\t" + "\\N\t" + VODA_CARRIER_ID + "\t" + kousiflg + "\n");
		sum.value += charge;
		this.ReadMeisaiCnt++;
		return 0;
	}

	doTelRecord_C6(line: string, pactid: string, sum: { [key: string]: number }, fileName: string) //分割してみる.
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
		// if (!("pactname" in global)) pactname = undefined;

		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "のデータレコードに異常(" + record[0] + ").");
				return 1;
			}


		var telno = record[1].trim().replace(/-/g, "");

		var date = this.use_year + "-" + record[4].substring(0, 2) + "-" + record[4].substring(2, 2) + " " + record[5].substring(0, 2) + ":" + record[5].substring(2, 2) + ":" + record[5].substring(4, 2);

		var totelno = "";

		var toplace = record[8].trim();

		var fromplace = "\\N";

		var time = "\\N";

		var charge = +record[9];

		var bytes = +record[7];

		var kousiflg = this.getTelKousi(pactid, telno, totelno);
		this.A_commFileData.push(pactid + "\t" + telno + "\t" + this.TEL_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t" + time + "\t" + charge + "\t" + bytes + "\t" + "\\N\t" + VODA_CARRIER_ID + "\t" + kousiflg + "\n");
		sum.value += charge;
		this.ReadMeisaiCnt++;
		return 0;
	}

	doTelRecord_C7(line: string, pactid: string, sum: { [key: string]: number }, fileName: string) //分割してみる.
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
		// if (!("pactname" in global)) pactname = undefined;

		var record = this.splitFix(line, this.Meisai_POS);

		if (record[0] != "20") //データレコードは"20"
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + fileName + "のデータレコードに異常(" + record[0] + ").");
				return 1;
			}


		var telno = record[1].trim().replace(/-/g, "");

		var date = this.use_year + "-" + record[4].substring(0, 2) + "-" + record[4].substring(2, 2) + " " + record[5].substring(0, 2) + ":" + record[5].substring(2, 2) + ":" + record[5].substring(4, 2);

		var totelno = record[6].trim();

		var toplace = record[7].trim();

		var fromplace = "\\N";

		var time = "\\N";

		var charge = +record[10];

		var bytes = +record[9];

		var kousiflg = this.getTelKousi(pactid, telno, totelno);
		this.A_commFileData.push(pactid + "\t" + telno + "\t" + this.TEL_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t" + time + "\t" + charge + "\t" + bytes + "\t" + "\\N\t" + VODA_CARRIER_ID + "\t" + kousiflg + "\n");
		sum.value += charge;
		this.ReadMeisaiCnt++;
		return 0;
	}

	doTotalRecord(line: string, TotalUp: { [key: string]: number }) //分割してみる.
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
		// if (!("pactid" in global)) pactid = undefined;
		// if (!("pactname" in global)) pactname = undefined;

		var record = this.splitFix(line, this.Meisai_POS);
		return 0;
	}

	splitFix(str: string, A_pos: Array<any>) //１個目の要素
	//中間の要素
	//最後の要素
	{

		var A_ret = Array();

		var total_len = str.length;
		A_ret[0] = str.substring(0, A_pos[0]);


		for (var i = 0; i < A_pos.length - 1; i++) {
			A_ret[i + 1] = str.substring(A_pos[i], A_pos[i + 1] - A_pos[i]);
		}

		A_ret[i + 1] = str.substring(A_pos[i]);

		// mb_convert_variables("UTF-8", "SJIS-win", A_ret);
		return A_ret;
	}

	async getTelKousi(pactid: string, telno: string, totelno: string) //権限が無ければ何もしない
	//かけ先マスターに登録されているか？
	//'-'ハイフンを除く
	{
		// if (!("pactname" in global)) pactname = undefined;

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

				var sql = "select kousiptn, COALESCE(kousiflg,'(null)') as nkflag from tel_tb where pactid=" + pactid + " and carid=" + VODA_CARRIER_ID + " and telno='" + telno + "'";

				var H_result = await this.dbh.getHash(sql, true);


				for (var idx = 0; idx < H_result.length; idx++) //nullの場合は'(null)'と入る
				{

					var pattern_id = H_result[idx].kousiptn;

					var tel_kousiflg = H_result[idx].nkflag;
				}

				if (undefined !== tel_kousiflg == false || tel_kousiflg == "(null)") //print "DEBUG_02: default_kousiflg=". $default_kousiflg .", and  pattern_id=". $pattern_id ."\n";
					//kousiflg 公私分計フラグ(0:する、1:しない)
					//0: するなら、patternid を保持して処理を続ける
					{
						sql = "select kousiflg, patternid from kousi_default_tb where pactid=" + pactid + " and carid=" + VODA_CARRIER_ID;
						H_result = await this.dbh.getHash(sql, true);

						if (H_result.length == 0) //公私フラグをハッシュに登録、nullの代わりに-1とする
							{
								this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + this.billdate + LOG_DELIM + "kousi_default_tb が未設定です. telno=" + telno);
								this.H_TelKousi[telno] = -1;
								return undefined;
							}

						for (idx = 0; idx < H_result.length; idx++) {

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
						sql = "select comhistflg, comhistbaseflg from kousi_pattern_tb where patternid=" + pattern_id + " and carid=" + VODA_CARRIER_ID;
						H_result = await this.dbh.getHash(sql, true);

						for (idx = 0; idx < H_result.length; idx++) //comhistflg = 通話記録判定(0:使用しない、1:使用する)
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
						this.A_totelFileData.push(pactid + "\t" + telno + "\t" + VODA_CARRIER_ID + "\t" + totelno + "\t" + "2" + "\n");

						if (undefined !== this.H_totel_master[telno] == false) {
							this.H_totel_master[telno] = Array();
						}

						this.H_totel_master[telno][totelno] = 2;
					}

				kousiflg = comhistbaseflg;
			}

		return kousiflg;
	}

	doBackup(db: ScriptDB) //commhistory_X_tb をエクスポートする
	//infohistory_X_tb をエクスポートする
	//kousi_totel_master_tb をエクスポートする
	{

		var day = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("");
		db.begin();

		var sql = "select * from " + this.commhistory_tb;

		var filename = DATA_EXP_DIR + "/" + this.commhistory_tb + day + ".exp";

		if (expDataByCursor(sql, filename, db.m_db) != 1) //ロールバック
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.commhistory_tb + "のデータエクスポートに失敗しました.");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			}

		db.commit();
		db.begin();
		sql = "select * from " + this.infohistory_tb;
		filename = DATA_EXP_DIR + "/" + this.infohistory_tb + day + ".exp";

		if (expDataByCursor(sql, filename, db.m_db) != 1) //ロールバック
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.infohistory_tb + "kousi_totel_master_tbのデータエクスポートに失敗しました.");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			}

		db.commit();
		db.begin();
		sql = "select * from kousi_totel_master_tb";
		filename = DATA_EXP_DIR + "/" + "kousi_totel_master_tb" + day + ".exp";

		if (expDataByCursor(sql, filename, db.m_db) != 1) //ロールバック
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "kousi_totel_master_tbのデータエクスポートに失敗しました.");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			}

		db.commit();
		return 0;
	}

	doDelete(A_pactDone: any[], db: ScriptDB) //commhistory_X_tb から削除する
	//delete失敗した場合
	//delete失敗した場合
	//未登録電話のみ削除する
	//delete失敗した場合
	{

		var sql_str = "delete from " + this.commhistory_tb + " where pactid in (" + A_pactDone.join(",") + ") and carid = " + VODA_CARRIER_ID;

		var rtn = db.query(sql_str, false);

		if (db.isError()) //ロールバック
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.commhistory_tb + "のデリートに失敗しました、");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			}

		sql_str = "delete from " + this.infohistory_tb + " where pactid in (" + A_pactDone.join(",") + ") and carid = " + VODA_CARRIER_ID;
		rtn = db.query(sql_str, false);

		if (db.isError()) //ロールバック
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.infohistory_tb + "のデリートに失敗しました、");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			}

		sql_str = "delete from kousi_totel_master_tb where pactid in (" + A_pactDone.join(",") + ") and carid = " + VODA_CARRIER_ID + " and kousiflg = '2'";
		rtn = db.query(sql_str, false);

		if (db.isError()) //ロールバック
			{
				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "kousi_totel_master_tb のデリートに失敗しました、");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			}

		return 0;
	}

	async doImportComm(commhistoryFile: string, db: ScriptDB) //commhistory_XX_tbへのインポート
	{
		if (fs.statSync(commhistoryFile).size > 0) {
		// if (filesize(commhistoryFile) > 0) {


			var commhistory_col = ["pactid", "telno", "type", "date", "totelno", "toplace", "fromplace", "time", "charge", "byte", "chargeseg", "carid", "kousiflg"];

			if (await this.doCopyInsert(this.commhistory_tb, commhistoryFile, commhistory_col, db) != 0) //ロールバック
				{
					this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.commhistory_tb + " のインポートに失敗しました.");
					db.rollback();
					throw process.exit(1);// 2022cvt_009
				} else //メール出力を減らすためコメントアウト 20091109miya
				//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $this->pactid_in . LOG_DELIM . LOG_DELIM . $this->billdate . LOG_DELIM
				//. $this->commhistory_tb . " のインポート完了." );
				{}
		}

		return 0;
	}

	async doImportInfo(infohistoryFile: string, db: ScriptDB) //infohistory_XX_tbへのインポート
	{
		if (fs.statSync(infohistoryFile).size > 0) {
		// if (filesize(infohistoryFile) > 0) {

			var infohistory_col = ["pactid", "telno", "sitename", "accounting", "fromdate", "charge", "carid"];

			if (await this.doCopyInsert(this.infohistory_tb, infohistoryFile, infohistory_col, db) != 0) //ロールバック
				{
					this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + this.commhistory_tb + " のインポートに失敗しました.");
					db.rollback();
					throw process.exit(1);// 2022cvt_009
				} else //メール出力を減らすためコメントアウト 20091109miya
				//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $this->pactid_in . LOG_DELIM . LOG_DELIM . $this->billdate . LOG_DELIM
				//. $this->infohistory_tb . " のインポート完了." );
				{}
		}

		return 0;
	}

	async doImportTotel(totelmasterFile: string, db: ScriptDB) //kousi_totel_master_tbへのインポート
	{
		if (fs.statSync(totelmasterFile).size > 0) {
		// if (filesize(totelmasterFile) > 0) {

			var totel_col = ["pactid", "telno", "carid", "totelno", "kousiflg"];

			if (await this.doCopyInsert("kousi_totel_master_tb", totelmasterFile, totel_col, db) != 0) //ロールバック
				{
					this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "kousi_totel_master_tb のインポートに失敗しました.");
					db.rollback();
					throw process.exit(1);// 2022cvt_009
				} else //メール出力を減らすためコメントアウト 20091109miya
				//$this->logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $this->pactid_in . LOG_DELIM . LOG_DELIM . $this->billdate . LOG_DELIM
				//. "kousi_totel_master_tb のインポート完了." );
				{}
		}

		return 0;
	}

	async doCopyInsert(table: string, filename: fs.PathOrFileDescriptor, columns: any[], db: ScriptDB) //ファイルを開く
	//$ins->setDebug( true );
	//インサート処理開始
	//インサート処理おしまい、実質的な処理はここで行われる.
	{

		var buffer = "";
		try {

		} catch (e) {
			this.logh.putError(G_SCRIPT_ERROR, filename + "のファイルオープン失敗.");
			return 1;
		}
		buffer = fs.readFileSync(filename, "utf8");
		var text = Encoding.convert(buffer, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		});
		var lines = text.toString().split("\r\n");
		// var fp = fopen(filename, "rt");


		var ins = new TableInserter(this.log_listener, db, filename + ".sql", true);
		ins.begin(table);

		for (var line of lines)
		// while (line = fgets(fp)) //データはtab区切り
		//インサート行の追加
		{

			var A_line = line.replace("\n", "").split("\t");
			// var A_line = split("\t", rtrim(line, "\n"));

			if (A_line.length != columns.length) //要素数が異なっていたら
				{
					this.logh.putError(G_SCRIPT_ERROR, filename + "のデータ数が設定と異なります。データ=" + line);
					// fclose(fp);
					return 1;
				}


			var H_ins = {};

			var idx = 0;


			for (var col of columns) {
				if (A_line[idx] != "\\N") //\N の場合はハッシュに追加しない
					{
						H_ins[col] = A_line[idx];
					}

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

// 	doCopyExp(sql: string, filename: fs.PathLike, db: ScriptDB) //一度にFETCHする行数
// 	//ファイルを開く
// 	{
//
// 		var NUM_FETCH = 100000;
//
// 		var fp;
// 		try {
// 			fp = fs.openSync(filename, "wt");
// 		} catch (e) {
// 			this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
// 			return 1;
// 		}
// 		// var fp = fopen(filename, "wt");

// 		db.query("DECLARE exp_cur CURSOR FOR " + sql);

// 		for (; ; ) //ＤＢから１行ずつ結果取得
// 		{
//
// 			var result = pg_query(db.m_db.connection, "FETCH " + NUM_FETCH + " IN exp_cur");

// 			if (result == undefined) {
// 				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "Fetch error, " + sql);
// 				fs.closeSync(fp);
// 				// fclose(fp);
// 				return 1;
// 			}

// 			var A_line = pg_fetch_array(result);
// 			if (A_line == undefined) //ループ終了
// 				{
// 					break;
// 				}

//
// 			var str = "";

// 			do //データ区切り記号、初回のみ空
// 			{
//
// 				var delim = "";

//
// 				for (var item of A_line) //データ区切り記号
// 				{
// 					str += delim;
// 					delim = "\t";

// 					if (item == undefined) //nullを表す記号
// 						{
// 							str += "\\N";
// 						} else {
// 						str += item;
// 					}
// 				}

// 				str += "\n";
// 			} while (A_line = pg_fetch_array(result));

// 			try {
// 				fs.writeSync(fp, str);
// 			} catch (e) {
// 				this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + this.pactid_in + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + filename + "への書き込み失敗、" + str);
// 				fs.closeSync(fp);
// 				// fclose(fp);
// 				return 1;
// 			}
// 		}

// 		db.query("CLOSE exp_cur");
// 		fs.closeSync(fp);
// 		// fclose(fp);
// 		return 0;
// 	}

	finalData(pactid: string, pactDir: string, finDir: fs.PathLike) //同名のファイルが無いか
	{

		if (fs.statSync(finDir).isFile()) {
		// if (is_file(finDir) == true) {
			this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + finDir + "はディレクトリではありません.");
			return 1;
		}

		if (fs.existsSync(finDir) == false) //なければ作成する// 2022cvt_003
			{
				try {
					fs.mkdirSync(finDir);
				} catch (e) {
					this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + "異動先の" + finDir + "が作成できなかった.");
					return 1;
				}
			}


		var retval = 0;

		var dirh = fs.readdirSync(pactDir);
		// var dirh = openDir(pactDir);// 2022cvt_004

		for (var fname of dirh) {
		// while (fname = fs.readdir(dirh)) {// 2022cvt_005

			var fpath = pactDir + "/" + fname;


			if (fs.statSync(fpath).isFile())
			// if (is_file(fpath)) //ファイル名の先頭が'Call数字'のものだけ
				{
// 2022cvt_019
					if (fname.match("/^Call[0-9]+/"))
					// if (preg_match("/^Call[0-9]+/", line)) //ファイル移動
						{
							try {
								fs.renameSync(fpath, finDir + "/" + fname);
							} catch (e) {
								this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + this.billdate + LOG_DELIM + fname + "の異動失敗.");
								retval = 1;
							}
						}
				}

// 			clearstatcache();// 2022cvt_012
		}

		// closedir(dirh);
		return retval;
	}

	getTimestamp() {
		var tm = new Date();
		// var tm = localtime(Date.now() / 1000, true);

		var yyyy = tm.getFullYear();
		// var yyyy = tm.tm_year + 1900;

		var mm = (tm.getMonth() + 1).toString();
		// var mm = tm.tm_mon + 1;
		if (mm.length == 1) {
			mm = "0" + mm;
		}
		// if (mm < 10) mm = "0" + mm;

		var dd = (tm.getDate() + 0).toString();
		// var dd = tm.tm_mday + 0;
		if (dd.length == 1) {
			dd = "0" + dd;
		}
		// if (dd < 10) dd = "0" + dd;

		var hh = (tm.getHours() + 0).toString();
		// var hh = tm.tm_hour + 0;
		if (hh.length == 1) {
			hh = "0" + hh;
		}
		// if (hh < 10) hh = "0" + hh;

		var nn = (tm.getMinutes() + 0).toString();
		// var nn = tm.tm_min + 0;
		if (nn.length == 1) {
			nn = "0" + nn;
		}
		// if (nn < 10) nn = "0" + nn;

		var ss = (tm.getSeconds() + 0).toString();
		if (ss.length == 1) {
			ss = "0" + ss;
		}
		// var ss = tm.tm_sec + 0;
		// if (ss < 10) ss = "0" + ss;
		return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
	}

	usage(argv: Array<any>, comment: string) //ロック解除
	{
		if (comment == "") {
			comment = "パラメータが不正です";
		}

		console.log("\n" + comment + "\n\n");
		console.log("Usage) " + argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N}\n");
		console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
		console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
		console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
		console.log("		-b バックパップ (Y:バックアップする,N:バックアップしない)\n\n");
		this.lock(false);
		throw process.exit(1);// 2022cvt_009
	}

	async lock(is_lock: boolean) //ロックする
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

				var count = await this.dbh.getOne(sql);

				if (count != 0) {
					this.dbh.rollback();
					return false;
				}


				var nowtime = this.getTimestamp();
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

(async () => {

var proc = new VodaProcessBase();
//var r = await proc.MainProcess(process.argv);
if (await proc.MainProcess(process.argv) != 0) {
	throw process.exit(1);// 2022cvt_009
}

proc.OutputProcess();
})();
