//
//代行注文一括処理
//作成 20080228	iga
//
//debug flag
//0->実行モード 1->インサートだけしない 2->画面出力
//define("DEBUG_FLAG", NOT_INS);
//スクリプト日本語名
//ログ デリミタ
//PHP パス
//define("PHP", "php -c /usr/local/etc/php-child.ini");
//オーダーファイルディレクトリ名
//終了後の移動先
//オーダー開始行
//一時データ判別子
//成形後ファイル拡張子
//table名
//キャリア
//発注種別
//無視するカラム
//カラム区切り
//ヘッダ要素数
//解約用ヘッダ要素数
//FOMA
//
//=============================================================================
//処理開始
//=============================================================================
//引数チェック
//ファイルオープン
//ファイルロック
//注文情報取得
//処理分岐
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

const ALL_EXEC = 0;
const NOT_INS = 1;
const LOG_OUT = 2;
const MOVE_ONLY = 1;
const DEL_ONLY = 2;
const DEBUG_FLAG = ALL_EXEC;
const REMOVE_FLAG = ALL_EXEC;
const SCRIPT_NAMEJ = "\u4EE3\u884C\u6CE8\u6587\u4E00\u62EC\u51E6\u7406";
const LOG_DELIM = " ";
const PHP = "php";
const AORD_DIR = "/ActOrder";
const FIN_DIR = "/fin";
const ORD_REC = "6";
const MAX_REC = "520";
const TMP_DET = "_detail";
const FILE_EXT = ".tmp";
const FILE_SQL = ".sql";
const ORDER_TB = "order_tb";
const ORDDET_TB = "order_teldetail_tb";
const ORDHIS_TB = "order_history_tb";
const TRANS_TB = "transfer_tb";
const CAR_DOC = 1;
const CAR_WIL = 2;
const CAR_AU = 3;
const CAR_SOF = 4;
const TYPE_NEW = "N";
const TYPE_CHN = "C";
const TYPE_SHI = "S";
const TYPE_DIS = "D";
const N_OPT = 11;
const N_ACE = 22;
const N_DISCNT = "13";
const NEW_DELIM = 39;
const CHN_DELIM = 33;
const SHI_DELIM = 30;
const ORD_HEAD = 8;
const DIS_HEAD = 1;
const ORD_NEW = 63;
const ORD_CHN = 57;
const ORD_SHI = 54;
const ORD_DIS = 11;
const DATA_REMAKE = 1;
const DATA_GET = 2;
const DATA_UNSET = 3;

//一括アップロード用ログファイル名
//DBハンドラ
//logハンドラ
//一括アップロードデータファイルディレクトリ
//処理するファイル名
//オーダー用一時ファイル
//オーダー詳細用一時ファイル
//振替用一時ファイル
//オーダー詳細用sqlファイル
//読み込みファイルポインタ
//書き込みファイルポインタ
//書き込みファイルポインタ2
//使用するorderid プログラム内で可変
//保持するorderid プログラム内で弄らない
//発注種別
//入力担当者
//契約名義
//契約タイプ
//インサート処理の実行可否フラグ
//注文ファイル内に含まれた部署を格納
//注文ファイル内に含まれたpostidの部署名
//注文ファイル内に含まれたpost情報　解約時のみ使用
//var $A_inttype;			// int型で定義されたDBカラム -> 必要なくなった
//text型で定義されたDBカラム
//現在時刻
//=============================================================================
//共通化
//=============================================================================
//warning出力
//この関数に飛ぶとコピー文は実行しない。ただし、それ以外の処理は続行される（エラーを全行表示するため）
//error出力
//シーケンスを取得し、件数分増加する
//arg:inc = 増加件数
//シーケンスを更新する
//部署名を取得する
//postidをキーにした部署名の連想配列を作成する
//現在時刻を返す
//=============================================================================
//ロジック
//=============================================================================
//引数チェック
//dataディレクトリの存在チェック
//ファイルを開く
//書き込み用ファイルを開く
//ファイルロック
//注文情報取得
//aridを返す
//caridを返す
//telnoを返す
//ファイルのカラム数がシステム条件と一致しているか確認
//discounttelが入力されていればシリアライズする
//SQL文字列はエスケープしておく
//改行はここでは扱わない(ファイルから読み込んだ時点で置換済み)
//エスケープ対象が増えたら追加する
//行端の特殊文字を削除する
//新規注文のメインループ
//解約のメインループ
//オーダー関連テーブルのカラム名管理
//森原ライブラリにカラムを渡すと、int型にも\\nを入れようとする。
//\\nはint型に入れようとすると型不一致で取り込めないため、カラムごと渡さないようにする
//渡さない条件はint型のカラムで、ファイルに入力されなかったもの
//渡したくないときはfalseを返す
//行単位で取得できない情報を別のところからとってきたり
//電話詳細情報が注文時に入力されていなければ、tel_tbの情報を使う
//transfer_tb用sql作成
//order_tel_detail_tbにひたすら\nを入れる
//電話番号の存在チェック
//sqlファイルを作成し、インサートする
//sqlを実行する
//getCommOrderInfoが値を返せばその値を入れる
//返り値がなければファイルから取得した値を入れる
//値がなければ\nをいれる
//解約用メインループ
class ActOrder {
	ActOrder() //共通ファイル名
	//ログリスナー作成
	//ログファイル名・出力タイプ設定
	//標準出力に表示
	//リスナーにファイル名、出力タイプを渡す
	//DBハンドル作成
	//エラーハンドル作成
	//データディレクトリ指定
	//未処理フラグ。trueならインサート処理を行わない
	//空のときはnullにしたいカラム入れとけ
	//$this->A_inttype = array("expectdate", "formercarid", "point", "applyprice", "datefrom", "dateto", "datechange",
	//"int1", "int2", "int3", "date1", "date2", "kousi");
	//改行のいらないtext型カラム入れとけ
	{
		this.dbLogFile = DATA_LOG_DIR + "/actorder.log";
		this.log_listener = new ScriptLogBase(0);
		this.log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, this.dbLogFile);
		this.log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
		this.log_listener.PutListener(this.log_listener_type);
		this.log_listener.PutListener(this.log_listener_type2);
		this.dbh = new ScriptDB(this.log_listener);
		this.logh = new ScriptLogAdaptor(this.log_listener, true);
		this.data_dir = DATA_DIR + AORD_DIR;
		this.fin_dir = this.data_dir + FIN_DIR;
		this.exit_out = false;
		this.A_telno = Array();
		this.A_strtype = ["postname", "type", "chargername", "contractor", "telusername", "telno", "model", "color", "planradio", "packetradio", "option", "discounttel", "passwd", "pointradio", "memory", "recovery", "billradio", "parent", "billaddress", "dateradio", "datechangeradio", "fee", "sendhow", "sendname", "sendaddress", "sendtel", "reason", "shopnote", "chpostname", "nextpostname", "anspost", "ansuser", "employeecode", "transfer", "holdername", "accessory", "ordtype", "mnpradio", "mnpno", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15"];
	}

	outWarningMessage(tmpStr, filename) {
		if ("" == filename) {
			filename = "\u4E0D\u660E\u306A\u30D5\u30A1\u30A4\u30EB\u540D";
		}

		this.exec_out = true;
		this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + filename + LOG_DELIM + tmpStr + "\n");
	}

	outErrorMessage(tmpStr, filename) {
		if ("" == filename) {
			filename = "\u4E0D\u660E\u306A\u30D5\u30A1\u30A4\u30EB\u540D";
		}

		this.logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + filename + LOG_DELIM + tmpStr + "\n");
	}

	getSequence(flag = false) {
		var sql = "select last_value from order_tb_orderid_seq";

		if (true == flag) {
			this.useorderid = this.dbh.getOne(sql);
			this.saveorderid = this.useorderid;
			return 0;
		} else {
			return this.dbh.getOne(sql);
		}
	}

	setSequence() {
		var sql = "select setval ('order_tb_orderid_seq', " + this.useorderid + ")";

		if (ALL_EXEC == DEBUG_FLAG) {
			this.dbh.query(sql);
		}
	}

	getPostName() {
		if (false == this.A_postid || undefined == this.A_postid || 0 == this.A_postid.length) {
			this.outErrorMessage("postid\u304C\u306A\u3044\u305F\u3081\u3001postname\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093", this.fileName);
			return false;
		}

		this.A_postid = array_unique(this.A_postid);
		var max = this.A_postid.length;

		if (max < 1) {
			this.outErrorMessage("postid\u304C\u306A\u3044\u305F\u3081\u3001postname\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093", this.fileName);
			throw die(1);
		}

		var cnt = 1;
		var sql = "select postid, postname from post_tb where postid in (";
		{
			let _tmp_0 = this.A_postid;

			for (var key in _tmp_0) {
				var val = _tmp_0[key];

				if (max == cnt) {
					sql += val + ")";
				} else {
					sql += val + ", ";
				}

				cnt++;
			}
		}
		var H_temp = this.dbh.getHash(sql);

		for (var key in H_temp) {
			var val = H_temp[key];
			this.A_postname[val.postid] = val.postname;
		}
	}

	getNowTime() {
		var result = date("Y-m-d H:i:s");
		return result;
	}

	checkArgv(H_hush) {
		if (2 != H_hush.length) {
			this.outWarningMessage("\u5F15\u6570\u306E\u6570\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093", this.fileName);
			throw die(1);
		}

		return true;
	}

	checkDataDir(dir) {
		if (false == is_dir(dir)) {
			this.outErrorMessage("\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093" + this.data_dir);
			throw die(1);
		}

		return true;
	}

	getDataFile(H_hush) {
		this.fileName = this.data_dir + "/" + H_hush[1];

		if (false == is_file(this.fileName)) {
			this.outErrorMessage("\u6307\u5B9A\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u304C\u5B58\u5728\u3057\u307E\u305B\u3093", this.fileName);
			throw die(1);
		}

		this.fp = fopen(this.fileName, "rb");

		if (this.fp == undefined) {
			this.outWarningMessage("\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u306B\u5931\u6557", this.fileName);
			throw die(1);
		}

		return true;
	}

	getCreateFile() {
		var tmpname = str_replace(".csv", FILE_EXT, this.fileName);
		var tmpdetail = str_replace(".csv", TMP_DET + FILE_EXT, this.fileName);
		this.tmpfile = tmpname;
		this.tmpdetail = tmpdetail;
		this.wfp = fopen(this.tmpfile, "w");

		if (this.wfp == undefined) {
			this.outWarningMessage("\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u306B\u5931\u6557", this.tmpfile);
			throw die(1);
		}

		this.wfp_detail = fopen(this.tmpdetail, "w");

		if (this.wfp_detail == undefined) {
			this.outWarningMessage("\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u306B\u5931\u6557", this.tmpdetail);
			fclose(this.wfp);
			throw die(1);
		}

		return true;
	}

	lockFile(fp) {
		if (false == flock(fp, LOCK_SH)) {
			this.outWarningMessage("\u30D5\u30A1\u30A4\u30EB\u30ED\u30C3\u30AF\u306B\u5931\u6557", this.fileName);
			return false;
		}

		return true;
	}

	getOrderInfo() {
		var line = "";
		line = fgets(this.fp);
		line = str_replace("\"STPG", "", line);
		var A_line = line.split(",");
		this.carid = A_line[0];

		if (TYPE_DIS != this.carid) {
			this.ordtype = A_line[1];
			this.pactid = A_line[3];
			this.shopid = A_line[4];
			this.shopmemid = A_line[5];
			this.chargername = mb_convert_encoding(A_line[6], "UTF-8", "SJIS");
			this.arid = this.getArid(this.carid);
			this.contractor = mb_convert_encoding(A_line[7], "UTF-8", "SJIS");
			this.conttype = A_line[8];
		} else //渡すときにエンコードした方がいいかも
			{
				this.ordtype = this.carid;
				this.pactid = A_line[4];
				this.shopid = A_line[5];
				this.shopmemid = A_line[6];
				this.chargername = mb_convert_encoding(A_line[7], "UTF-8", "SJIS");
				this.conttype = A_line[8];
				var temp = mb_convert_encoding(A_line[2], "UTF-8", "SJIS");
				this.carid = this.getCarid(temp);

				if ("" == this.carid) {
					this.outErrorMessage("\u30AD\u30E3\u30EA\u30A2\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F", this.fileName);
					return false;
				}
			}
	}

	getArid(carid) {
		switch (carid) {
			case CAR_DOC:
				var arid = 4;
				break;

			case CAR_WIL:
				arid = 31;
				break;

			case CAR_AU:
				arid = 13;
				break;

			case CAR_SOF:
				arid = 26;
		}

		return arid;
	}

	getCarid(name) {
		switch (name) {
			case "NTT\u30C9\u30B3\u30E2":
				var carid = CAR_DOC;
				break;

			case "WILLCOM":
				carid = CAR_WIL;
				break;

			case "au":
				carid = CAR_AU;
				break;

			case "\u30BD\u30D5\u30C8\u30D0\u30F3\u30AF":
				carid = CAR_SOF;
				break;

			default:
				carid = "";
				break;
		}

		return carid;
	}

	getTelNo(A_line, type) {
		if (TYPE_NEW == type || TYPE_DIS == type) {
			if (10 == A_line[4].length) {
				var temp = "0";
				temp += A_line[4];
			} else {
				temp = A_line[4];
			}
		} else if (TYPE_CHN == type || TYPE_SHI == type) {
			if (10 == A_line[3].length) {
				temp = "0";
				temp += A_line[3];
			} else {
				temp = A_line[3];
			}
		}

		return temp;
	}

	combRowsDissolution(line) {
		if (line == "") {
			return false;
		}

		var A_line = line.split(",");
		var cnt = A_line.length;

		if (ORD_DIS != cnt) {
			this.outWarningMessage("\u5165\u529B\u3055\u308C\u305F\u30AA\u30FC\u30C0\u30FC\u60C5\u5831\u6570\u306B\u8AA4\u308A\u304C\u3042\u308A\u307E\u3059" + LOG_DELIM + cnt, this.fileName);
		}

		var telno = this.getTelNo(A_line, this.ordtype);

		if (true == (undefined !== telno) && "" != telno) {
			if (false == this.getTelInfo(telno)) {
				return false;
			}
		} else {
			this.outWarningMessage("\u96FB\u8A71\u756A\u53F7\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002", this.fileName);
		}

		this.A_postid.push(this.H_telinfo[0].postid);
		var tempcol = A_line.length - 1;
		A_line[tempcol] = preg_replace("/(\n|\r\n|\r)/", "", A_line[tempcol]);
		line = ",".join(A_line);
		line = str_replace("\"STPG", "", line);
		line = str_replace("EDPG\"", "", line);
		line = this.encSQLString(line);
		line = mb_convert_encoding(line, "UTF-8", "SJIS");
		fwrite(this.wfp, line + "\n");
	}

	combRows(line) {
		if (line == "") {
			return false;
		}

		var A_line = line.split(",");
		this.cirid = A_line[1];
		var sql = "select count(postid) from post_tb where postid=" + A_line[2] + " and pactid=" + this.pactid;
		var cnt = this.dbh.getOne(sql);

		if (1 == cnt) {
			this.A_postid.push(A_line[2]);
		} else {
			this.outWarningMessage("\u6307\u5B9A\u3055\u308C\u305Fpostid\u304C\u5B58\u5728\u3057\u306A\u3044\u304B\u3001\u5225\u306E\u4F1A\u793E\u306E\u90E8\u7F72\u3067\u3059" + LOG_DELIM + A_line[2], this.fileName);
			return false;
		}

		cnt = A_line.length;
		this.combRowDetail(cnt, A_line, [ORD_NEW, ORD_CHN, ORD_SHI, ORD_DIS]);
	}

	combRowDetail(cnt, A_line, A_colcnt) //文字列エスケープ
	{
		var flag = false;
		var lpstart = 0;

		switch (this.ordtype) {
			case TYPE_NEW:
				if (cnt == A_colcnt[0]) //
					//欲しいのはシリアライズされた情報だけなので文字列は消す
					//シリアライズされた情報は消す
					//消さないとsql作成時にカラム数が合わなくなる
					{
						var size = NEW_DELIM;
						flag = true;
						lpstart = N_DISCNT + 1;
						A_line[N_DISCNT] = this.setDiscountTel([A_line[N_DISCNT], A_line[N_DISCNT + 1], A_line[N_DISCNT + 2], A_line[N_DISCNT + 3], A_line[N_DISCNT + 4]]);
						A_line[N_OPT] = A_line[N_OPT + 1];
						A_line[N_OPT + 1] = "";
						A_line[N_ACE] = A_line[N_ACE + 1];
						A_line[N_ACE + 1] = "";

						for (var idx = lpstart; idx < lpstart + 5; idx++) {
							A_temp[idx] = "";
						}
					}

				break;

			case TYPE_CHN:
				if (cnt == A_colcnt[1]) {
					flag = true;
					size = CHN_DELIM;
				}

				break;

			case TYPE_SHI:
				if (cnt == A_colcnt[2]) {
					flag = true;
					size = SHI_DELIM;
				}

				break;

			default:
				outWarningMessage("\u4E88\u671F\u3057\u306A\u3044\u767A\u6CE8\u7A2E\u5225\u3067\u3059" + LOG_DELIM + this.ordtype, this.fileName);
				return false;
		}

		if (false == flag) //ここまで来たら異常
			{
				this.outWarningMessage("\u5165\u529B\u3055\u308C\u305F\u30AA\u30FC\u30C0\u30FC\u60C5\u5831\u6570\u306B\u8AA4\u308A\u304C\u3042\u308A\u307E\u3059" + LOG_DELIM + cnt, this.fileName);
				return false;
			}

		var A_temp = array_chunk(A_line, size);
		A_temp[0][0] = A_temp[0][0].replace(/[^0-9]/g, "");
		var tmpmem = A_temp[1].length - 1;
		A_temp[1][tmpmem] = str_replace("EDPG\"", "", A_temp[1][tmpmem]);
		var line = ",".join(A_temp[0]);
		var line_detail = ",".join(A_temp[1]);
		line = this.encSQLString(line);
		line_detail = this.encSQLString(line_detail);
		line = mb_convert_encoding(line, "UTF-8", "SJIS");
		line_detail = mb_convert_encoding(line_detail, "UTF-8", "SJIS");
		fwrite(this.wfp, line + "\n");
		fwrite(this.wfp_detail, line_detail);
	}

	setDiscountTel(A_discnt) {
		var flag = false;

		for (var idx = 0; idx < 5; idx++) {
			if ("" != A_discnt[idx]) {
				flag = true;
			}
		}

		if (true == flag) {
			var result = serialize(A_discnt);
		} else {
			result = "";
		}

		return result;
	}

	encSQLString(line) {
		line = str_replace("'", "\\'", line);
		return line;
	}

	omitWorkString(tmpstr) {
		var resut = str_replace("\"STPG", "", tmpstr);
		resut = str_replace("EDPG\"", "", tmpstr);
		return result;
	}

	ordNewContract() //一時ファイル作成
	//処理行取得
	//fp解放
	//取得したpositdからpostnameを求める
	{
		this.getCreateFile();
		var row_cnt = 0;

		while (MAX_REC > row_cnt) //行末の改行以外は1文に納める
		//カラム数チェック->一時ファイル作成
		{
			if (true == feof(this.fp)) {
				row_cnt = MAX_REC;
			}

			if (ORD_REC > row_cnt) //fpを進めておく
				{
					var dustbox = fgets(this.fp);

					if (true == ereg("EDPG\"", dustbox)) {
						row_cnt++;
					}

					continue;
				}

			var line = fgets(this.fp);
			var flag = false;

			while (false == flag) {
				if (true == feof(this.fp)) {
					flag = true;
				} else if (true == ereg("EDPG\"", line)) {
					flag = true;
				} else {
					line = str_replace("\n", "LFkaigyoLF", line);
					line += fgets(this.fp);
				}
			}

			this.combRows(line);
			line = "";
			row_cnt++;
		}

		fclose(this.fp);
		fclose(this.wfp);
		fclose(this.wfp_detail);
		this.getPostName();
	}

	ordDissolution() //一時ファイル作成
	//処理行取得
	//fp解放
	//取得したpositdからpostnameを求める
	//$this->getPostName();
	{
		this.getCreateFile();
		var row_cnt = 0;

		while (MAX_REC > row_cnt) //行末の改行以外は1文に納める
		//カラム数チェック->一時ファイル作成
		{
			if (true == feof(this.fp)) {
				row_cnt = MAX_REC;
			}

			if (ORD_REC > row_cnt) //fpを進めておく
				{
					var dustbox = fgets(this.fp);

					if (true == ereg("EDPG\"", dustbox)) {
						row_cnt++;
					}

					continue;
				}

			var line = fgets(this.fp);
			var flag = false;

			while (false == flag) {
				if (true == feof(this.fp)) {
					flag = true;
				} else if (true == ereg("EDPG\"", line)) {
					flag = true;
				} else {
					line = str_replace("\n", "LFkaigyoLF", line);
					line += fgets(this.fp);
				}
			}

			this.combRowsDissolution(line);
			line = "";
			row_cnt++;
		}

		fclose(this.fp);
		fclose(this.wfp);
		fclose(this.wfp_detail);
	}

	writeSQLReady() //order_teldetail_tb
	//transfer_tb
	{
		if (TYPE_NEW == this.ordtype) //オーダー別情報
			{
				this.A_ordcol = {
					carid: 0,
					cirid: 0,
					postid: 2,
					formercarid: 3,
					mnpno: 5,
					telno: 4,
					model: 6,
					color: 7,
					applyprice: 8,
					plan: 9,
					packet: 10,
					option: 11,
					discounttel: 13,
					passwd: 18,
					number: 19,
					pointradio: 20,
					point: 21,
					accessory: 22,
					billradio: 24,
					parent: 25,
					billaddress: 26,
					dateradio: 27,
					datefrom: 28,
					note: 29,
					fee: 30,
					sendhow: 31,
					sendname: 32,
					sendaddress: 33,
					sendtel: 34,
					reason: 35,
					employeecode: 36,
					telusername: 37,
					shopcomment: 38,
					orderid: 0,
					pactid: 0,
					arid: 0,
					postname: 2,
					contractor: 0,
					type: 0,
					status: 0,
					shopid: 0,
					chargername: 0,
					chpostid: 2,
					chpostname: 2,
					shopmemid: 0,
					expectflg: 0,
					delflg: 0,
					actordershopid: 0,
					mnpradio: 3,
					recdate: 0,
					enddate: 0,
					ansdate: 0,
					ordtype: 0
				};
			} else if (TYPE_CHN == this.ordtype) {
			this.A_ordcol = {
				carid: 0,
				cirid: 0,
				postid: 2,
				telno: 3,
				model: 4,
				color: 5,
				applyprice: 6,
				plan: 7,
				packet: 8,
				pointradio: 9,
				point: 10,
				memory: 12,
				recovery: 13,
				accessory: 14,
				datechangeradio: 15,
				datechange: 16,
				dateradio: 19,
				datefrom: 20,
				dateto: 22,
				fee: 24,
				sendhow: 25,
				sendname: 26,
				sendaddress: 27,
				sendtel: 28,
				employeecode: 30,
				telusername: 31,
				shopcomment: 32,
				orderid: 0,
				pactid: 0,
				arid: 0,
				postname: 2,
				contractor: 0,
				type: 0,
				number: 0,
				status: 0,
				shopid: 0,
				chargername: 0,
				chpostid: 2,
				chpostname: 2,
				shopmemid: 0,
				expectflg: 0,
				delflg: 0,
				actordershopid: 0,
				recdate: 0,
				enddate: 0,
				ansdate: 0,
				ordtype: 0,
				option: 0
			};
		} else if (TYPE_SHI == this.ordtype) {
			this.A_ordcol = {
				carid: 0,
				cirid: 0,
				postid: 2,
				telno: 3,
				model: 4,
				color: 5,
				applyprice: 6,
				plan: 7,
				packet: 8,
				passwd: 9,
				pointradio: 10,
				point: 11,
				memory: 12,
				recovery: 13,
				accessory: 15,
				datechangeradio: 16,
				datechange: 17,
				dateradio: 19,
				datefrom: 20,
				fee: 21,
				note: 22,
				sendhow: 23,
				sendname: 24,
				sendaddress: 25,
				sendtel: 26,
				employeecode: 27,
				telusername: 28,
				shopcomment: 29,
				orderid: 0,
				pactid: 0,
				arid: 0,
				postname: 2,
				type: 0,
				number: 0,
				contractor: 0,
				status: 0,
				shopid: 0,
				chargername: 0,
				chpostid: 2,
				chpostname: 2,
				shopmemid: 0,
				expectflg: 0,
				delflg: 0,
				actordershopid: 0,
				recdate: 0,
				enddate: 0,
				ansdate: 0,
				ordtype: 0,
				option: 0
			};
		} else if (TYPE_DIS == this.ordtype) {
			this.A_ordcol = {
				carid: 0,
				cirid: 0,
				postid: 4,
				telno: 4,
				datechange: 5,
				fee: 7,
				reson: 8,
				note: 9,
				orderid: 0,
				pactid: 0,
				arid: 0,
				postname: 4,
				contractor: 3,
				type: 0,
				number: 0,
				status: 0,
				shopid: 0,
				chargername: 0,
				chpostid: 4,
				chpostname: 4,
				shopmemid: 0,
				expectflg: 0,
				delflg: 0,
				actordershopid: 0,
				recdate: 0,
				enddate: 0,
				ansdate: 0,
				ordtype: 0,
				shopcomment: 10
			};
		} else {
			this.outErrorMessage("\u767A\u6CE8\u7A2E\u5225\u304C\u4E0D\u660E\u3067\u3059\u3002\u51E6\u7406\u3059\u308B\u30AB\u30E9\u30E0\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F", this.fileName);
			throw die(1);
		}

		this.A_orddetail = {
			mail: 0,
			text1: 1,
			text2: 2,
			text3: 3,
			text4: 4,
			text5: 5,
			text6: 6,
			text7: 7,
			text8: 8,
			text9: 9,
			text10: 10,
			text11: 11,
			text12: 12,
			text13: 13,
			text14: 14,
			text15: 15,
			int1: 16,
			int2: 17,
			int3: 18,
			date1: 19,
			date2: 20,
			memo: 21,
			kousiradio: 22,
			kousi: 23,
			orderid: 0
		};
		this.A_transfer = ["fromshopid", "toshopid", "transfertype", "orderid"];
		this.A_history = ["orderid", "chdate", "shopid", "shopname", "shopperson", "shopcomment", "status"];
	}

	checkTypeAndValue(name, value) //if(true == in_array($name, $this->A_inttype)){		// 全てのカラムで抜かなきゃダメだった
	{
		if ("" == value || "\\N" == value || "\\N" == value) {
			return false;
		}

		return true;
	}

	getCommOrderInfo(name, A_column, A_order, A_line) //text1〜15をcaseにすると長いので細工
	{
		if (1 == preg_match("/text/", name)) //カラム名は1〜処理は0から。1は引いておく
			{
				var tmpcolno = name.replace(/[^0-9]/g, "");
				name = name.replace(/[^a-z]/g, "");
			} else if (1 == preg_match("/int/", name)) {
			if ("point" != name) {
				tmpcolno = name.replace(/[^0-9]/g, "");
				name = name.replace(/[^a-z]/g, "");
			}
		}

		switch (name) {
			case "orderid":
				this.useorderid++;
				A_order = [DATA_GET, this.useorderid];
				break;

			case "pactid":
				A_order = [DATA_GET, this.pactid];
				break;

			case "carid":
				A_order = [DATA_GET, this.carid];
				break;

			case "cirid":
				if (TYPE_DIS != this.ordtype) {
					A_order = [DATA_GET, this.cirid];
				} else {
					var temp = this.getTelNo(A_line, this.ordtype);
					A_order = [DATA_GET, this.H_dispostinfo[temp].cirid];
				}

				break;

			case "arid":
				if (TYPE_DIS != this.ordtype) {
					A_order = [DATA_GET, this.arid];
				} else {
					temp = this.getTelNo(A_line, this.ordtype);
					A_order = [DATA_GET, this.H_dispostinfo[temp].arid];
				}

				break;

			case "postname":
			case "chpostname":
				if (TYPE_DIS != this.ordtype) {
					A_order = [DATA_GET, this.A_postname[A_line[A_column[name]]]];
				} else {
					temp = this.getTelNo(A_line, this.ordtype);
					A_order = [DATA_GET, this.H_dispostinfo[temp].postname];
				}

				break;

			case "contractor":
				if (TYPE_DIS != this.ordtype) {
					A_order = [DATA_GET, this.contractor];
				} else {
					A_order = [DATA_GET, A_line[A_column[name]]];
				}

				break;

			case "type":
				A_order = [DATA_GET, this.ordtype];
				break;

			case "ordtype":
				A_order = [DATA_GET, this.conttype];

			case "status":
				A_order = [DATA_GET, 40];
				break;

			case "shopid":
			case "actordershopid":
				A_order = [DATA_GET, this.shopid];
				break;

			case "chargername":
				A_order = [DATA_GET, this.chargername];
				break;

			case "postid":
			case "chpostid":
				if (TYPE_DIS != this.ordtype) {
					A_order = [DATA_GET, A_line[A_column[name]]];
				} else {
					temp = this.getTelNo(A_line, this.ordtype);
					A_order = [DATA_GET, this.H_dispostinfo[temp].postid];
				}

				break;

			case "shopmemid":
				A_order = [DATA_GET, this.shopmemid];
				break;

			case "expectflg":
			case "delflg":
				A_order = [DATA_GET, true];
				break;

			case "telno":
				temp = this.getTelNo(A_line, this.ordtype);
				temp = serialize([temp]);
				A_order = [DATA_REMAKE, temp];
				break;

			case "recdate":
			case "enddate":
			case "ansdate":
				A_order = [DATA_GET, this.getNowTime()];
				break;

			case "model":
				A_order = [DATA_GET, A_line[A_column[name]]];
				break;

			case "color":
				A_order = [DATA_GET, A_line[A_column[name]]];
				break;

			case "applyprice":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "planradio":
				if ("\u5909\u66F4\u306A\u3057" == A_line[A_column[name]]) {
					temp = "stay";
				} else {
					temp = "change";
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "plan":
				if ("\u5909\u66F4\u306A\u3057" != A_line[A_column[name]]) //planid取得
					//取得に失敗したら終われ
					{
						var cont = A_line[A_column[name]];
						var sql = "select planid from plan_tb where carid=" + this.carid + " and cirid=" + this.cirid + " and arid=" + this.arid + " and planname='" + cont + "'";
						temp = this.dbh.getOne(sql);

						if (undefined == temp || false == temp) {
							this.outErrorMessage("planid\u306E\u5909\u63DB\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + cont, this.fileName);
							throw die(1);
						}
					} else {
					temp = "";
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "packetradio":
				if ("\u5909\u66F4\u306A\u3057" == A_line[A_column[name]]) {
					temp = "stay";
				} else {
					temp = "change";
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "packet":
				if ("\u5909\u66F4\u306A\u3057" != A_line[A_column[name]] && "" != A_line[A_column[name]]) //packetid取得
					//取得に失敗したら終われ
					{
						cont = A_line[A_column[name]];
						cont = mb_convert_kana(cont, "N");
						sql = "select packetid from packet_tb where carid=" + this.carid + " and cirid=" + this.cirid + " and arid=" + this.arid + " and packetname='" + cont + "'";
						temp = this.dbh.getOne(sql);

						if (undefined == temp || false == temp) {
							this.outWarningMessage("packetid\u306E\u5909\u63DB\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + cont, this.fileName);
						}
					} else {
					temp = "";
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "option":
				if (TYPE_NEW == this.ordtype) {
					temp = str_replace("\"\"", "\"", A_line[A_column[name]]);
				} else if (TYPE_DIS != this.ordtype) {
					sql = "select opid from option_tb where ordviewflg=true and carid=" + this.carid + " and cirid=" + this.cirid + " order by sort";
					var A_col = this.dbh.getHash(sql);

					for (var col of Object.values(A_col)) {
						H_option[col.opid] = "stay";
					}

					temp = serialize(H_option);
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "passwd":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "accessory":
				temp = str_replace("\"\"", "\"", A_line[A_column[name]]);
				A_order = [DATA_REMAKE, temp];
				break;

			case "number":
				if (TYPE_NEW == this.ordtype) {
					temp = A_line[A_column[name]];
				} else {
					temp = 1;
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "discounttel":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "pointradio":
				if ("\u53EF\u80FD\u306A\u9650\u308A" == A_line[A_column[name]]) {
					temp = "maximam";
				} else if ("\u4F7F\u7528\u3057\u306A\u3044" == A_line[A_column[name]]) {
					temp = "nouse";
				} else if ("\u30DD\u30A4\u30F3\u30C8\u6307\u5B9A" == A_line[A_column[name]]) {
					temp = "specify";
				} else {
					temp = "\\N";
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "point":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "memory":
				temp = "";

				if ("\u3059\u308B" == A_line[A_column[name]]) {
					temp = "do";
				} else if ("\u3057\u306A\u3044" == A_line[A_column[name]]) {
					temp = "dont";
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "recovery":
				temp = "";

				if ("\u3059\u308B" == A_line[A_column[name]]) {
					temp = "do";
				} else if ("\u3057\u306A\u3044" == A_line[A_column[name]]) {
					temp = "dont";
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "billradio":
				if (TYPE_NEW == this.ordtype) {
					var idx = A_column[name];
				}

				if ("\u4E00\u62EC\u8ACB\u6C42\u7D44\u8FBC\u307F" == A_line[idx]) {
					temp = "all";
				} else {
					temp = "sep";
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "parent":
				if (TYPE_NEW == this.ordtype) {
					idx = A_column[name];
				}

				A_order = [DATA_REMAKE, A_line[idx]];
				break;

			case "billaddress":
				if (TYPE_NEW == this.ordtype) {
					idx = A_column[name];
				}

				A_order = [DATA_REMAKE, A_line[idx]];
				break;

			case "dateradio":
				if ("\u6307\u5B9A\u3059\u308B" == A_line[A_column[name]]) {
					temp = "specify";
				} else {
					temp = "not_specify";
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "datefrom":
				if (TYPE_NEW == this.ordtype) {
					temp = A_line[A_column[name]];
				} else if (TYPE_CHN == this.ordtype) {
					temp = A_line[A_column[name]];

					if ("" != A_line[A_column[name] + 1]) {
						temp += " " + A_line[A_column[name] + 1] + ":00:00";
					}
				} else if (TYPE_SHI == this.ordtype) {
					temp = A_line[A_column[name]];
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "dateto":
				if (TYPE_CHN == this.ordtype) {
					temp = A_line[A_column[name]];

					if ("" != A_line[A_column[name]]) {
						temp += " " + A_line[A_column[name] + 1] + ":00:00";
					}
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "note":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "fee":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "datechangeradio":
				if ("\u6307\u5B9A\u3059\u308B" == A_line[A_column[name]]) {
					temp = "specify";
				} else {
					temp = "not_specify";
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "datechange":
				temp = A_line[A_column[name]];

				if ("" != A_line[A_column[name] + 1]) {
					temp += " " + A_line[A_column[name] + 1] + ":00:00";
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "sendhow":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "sendname":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "sendaddress":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "sendtel":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "employeecode":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "reason":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "telusername":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "mail":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "kousiradio":
				if ("\u3059\u308B" == A_line[A_column[name]]) {
					temp = "on";
				} else if ("\u3057\u306A\u3044" == A_line[A_column[name]]) {
					temp = "off";
				} else {
					temp = "";
				}

				A_order = [DATA_REMAKE, temp];
				break;

			case "kousi":
				temp = preg_replace("/(\n|\r\n|\r)/", "", A_line[A_column[name]]);
				A_order = [DATA_REMAKE, temp];
				break;

			case "memo":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "mnpradio":
				if ("" != A_line[A_column[name]]) {
					A_order = [DATA_REMAKE, "yes"];
				} else {
					A_order = [DATA_REMAKE, "no"];
				}

				break;

			case "mnpno":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "formercarid":
				var tempcarid = this.getCarid(A_line[A_column[name]]);
				A_order = [DATA_REMAKE, tempcarid];
				break;

			case "text":
				A_order = [DATA_REMAKE, A_line[tmpcolno]];
				break;

			case "int":
				A_order = [DATA_REMAKE, A_line[tmpcolno + 15]];
				break;

			case "date1":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			case "date2":
				A_order = [DATA_REMAKE, A_line[A_column[name]]];
				break;

			default:
				A_order = [DATA_UNSET, ""];
				break;
		}

		return A_order;
	}

	getRegisteredTelInfo(A_ordinfo, col) {
		if (false == (undefined !== this.H_telinfo[0][col])) {
			return A_ordinfo;
		}

		if ("" != this.H_telinfo[0][col] && "" == A_ordinfo[1]) {
			A_ordinfo[1] = this.H_telinfo[0][col];
		}

		return A_ordinfo;
	}

	writeCopyFileTransfer(table, writefile) {
		var ins = new TableInserter(this.logh, this.dbh, writefile, true);
		ins.begin(table);

		for (var idx = this.saveorderid; idx < this.maxorderid; idx++) {
			H_ins.fromshopid = this.shopid;
			H_ins.toshopid = this.shopid;
			H_ins.transfertype = "all";
			H_ins.orderid = idx + 1;

			if (ins.insert(H_ins) == false) {
				this.outWarningMessage("\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F", table);
				return false;
			}
		}

		if (ALL_EXEC == DEBUG_FLAG && false == this.exit_out) {
			if (ins.end() == false) {
				this.dbh.rollback();
				this.outWarningMessage("\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u5931\u6557", table);
				throw die(1);
			}
		}
	}

	writeCopyHistory(table, readfile, writefile) {
		this.fp = fopen(readfile, "rb");

		if (this.fp == undefined) {
			this.outWarningMessage("\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u306B\u5931\u6557", readfile);
		}

		var ins = new TableInserter(this.logh, this.dbh, writefile, true);
		var nowtime = this.getNowTime();
		var sql = "select sh.name as shopname, shmem.name as memname from shop_tb sh inner join shop_member_tb shmem on sh.shopid=shmem.shopid" + " where sh.shopid=" + this.shopid + " and shmem.memid=" + this.shopmemid;
		var result = this.dbh.getHash(sql);
		this.useorderid = this.saveorderid;
		this.useorderid++;
		ins.begin(table);

		while (line = fgets(this.fp)) {
			var A_line = line.split(",");
			H_ins.orderid = this.useorderid;
			H_ins.chdate = nowtime;
			H_ins.shopid = this.shopid;
			H_ins.shopname = result[0].shopname;
			H_ins.shopperson = result[0].memname;
			H_ins.shopcomment = preg_replace("/(\n|\r\n|\r)/", "", A_line[this.A_ordcol.shopcomment]);
			H_ins.status = 40;

			if (ins.insert(H_ins) == false) {
				this.outWarningMessage("\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F", table);
				return false;
			}
		}

		if (ALL_EXEC == DEBUG_FLAG && false == this.exit_out) {
			if (ins.end() == false) {
				this.dbh.rollback();
				this.outWarningMessage("\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u5931\u6557", table);
				throw die(1);
			}
		}
	}

	writeCopyTelDetail(writefile) {
		var table = "order_teldetail_tb";
		var ins = new TableInserter(this.logh, this.dbh, writefile, true);
		ins.begin(table);

		for (var idx = this.saveorderid; idx < this.maxorderid; idx++) {
			H_ins.orderid = idx + 1;

			if (ins.insert(H_ins) == false) {
				this.outWarningMessage("\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F", table);
				return false;
			}
		}

		if (ALL_EXEC == DEBUG_FLAG && false == this.exit_out) {
			if (ins.end() == false) {
				this.dbh.rollback();
				this.outWarningMessage("\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u5931\u6557", table);
				throw die(1);
			}
		}
	}

	getTelInfo(telno) {
		if (TYPE_NEW == this.ordtype && CAR_WIL != this.carid) {
			var carid = this.formercarid;
		} else {
			carid = this.carid;
		}

		telno = telno.replace(/[^0-9]/g, "");
		var sql = "select pos.postname, tel.telno_view, tel.postid, tel.arid, tel.carid, tel.cirid, tel.userid, tel.username, " + "tel.username, tel.employeecode, tel.mail, tel.planid, tel.text1, tel.text2, tel.text3, tel.text4, tel.text5, " + "tel.text6, tel.text7, tel.text8, tel.text9, tel.text10, tel.text11, tel.text12, tel.text13, tel.text14, tel.text15, " + "tel.int1, tel.int2, tel.int3, tel.date1, tel.date2, tel.memo, tel.kousiflg, tel.kousiptn ";
		sql += "from tel_tb tel inner join post_tb pos on tel.postid=pos.postid " + "where tel.telno='" + telno + "' and tel.pactid=" + this.pactid + " and tel.carid=" + carid;
		this.H_telinfo = this.dbh.getHash(sql);
		var cnt = this.H_telinfo.length;
		console.log(cnt);

		if (0 == cnt) {
			this.outWarningMessage("\u96FB\u8A71\u304C\u5B58\u5728\u3057\u307E\u305B\u3093" + LOG_DELIM + "tel=" + telno + LOG_DELIM + "carid=" + carid, this.fileName);
			return false;
		} else if (1 == cnt) {
			this.H_dispostinfo[telno] = {
				postname: this.H_telinfo[0].postname,
				postid: this.H_telinfo[0].postid,
				arid: this.H_telinfo[0].arid,
				cirid: this.H_telinfo[0].cirid
			};
			return true;
		} else if (1 < cnt) {
			this.outWarningMessage("\u540C\u3058\u96FB\u8A71\u304C2\u4EF6\u4EE5\u4E0A\u767B\u9332\u3055\u308C\u3044\u3066\u3044\u307E\u3059" + LOG_DELIM + telno, this.fileName);
			return false;
		} else {
			this.outWarningMessage("\u96FB\u8A71\u60C5\u5831\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + telno, this.fileName);
			return false;
		}
	}

	writeCopyFile(A_column, table, readfile, writefile, checkflag = false) //orderid initialise
	//copy文実行
	{
		this.fp = fopen(readfile, "rb");

		if (this.fp == undefined) {
			this.outWarningMessage("\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u306B\u5931\u6557", readfile);
		}

		var telidx = 0;
		var ins = new TableInserter(this.logh, this.dbh, writefile, true);
		ins.begin(table);

		while (line = fgets(this.fp)) //周回ごとに初期化する
		//取得した行を配列化
		//20080325 関数に置き換え
		//getTelInfoが呼ばれればH_telinfoが更新される
		//sqlファイル作成
		{
			var H_ins = Array();
			this.H_telinfo = Array();
			var A_ordinfo = [DATA_UNSET, "\\N"];
			var A_line = line.split(",");

			if (ORDER_TB == table && TYPE_NEW == this.ordtype) {
				this.formercarid = this.getCarid(A_line[A_column.formercarid]);
			} else if (TYPE_NEW != this.ordtype) {
				this.formercarid = this.carid;
			}

			var telno = this.getTelNo(A_line, this.ordtype);

			if (ORDER_TB == table) {
				this.A_telno.push(telno);
			} else {
				telno = this.A_telno[telidx];
			}

			telidx++;

			if (true == (undefined !== telno) && "" != telno && "" != this.formercarid) {
				if (false == this.getTelInfo(telno)) {
					return false;
				}
			} else if (TYPE_NEW != this.ordtype && ORDER_TB != table) {
				this.outWarningMessage("\u96FB\u8A71\u756A\u53F7\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u30AA\u30FC\u30C0\u30FC\u306F\u672A\u51E6\u7406\u3067\u3059", this.fileName);
				return false;
			}

			for (var col in A_column) //オーダーの共通情報取得orプルダウン情報の変換
			//機種変と移行の電話詳細情報は、オーダーファイルからの入力が空なら登録済みの電話情報を使う
			{
				var val = A_column[col];
				A_ordinfo[0] = DATA_UNSET;
				A_ordinfo[1] = "\\N";
				A_ordinfo = this.getCommOrderInfo(col, A_column, A_ordinfo, A_line);

				if (TYPE_DIS != this.ordtype && ORDDET_TB == table) {
					A_ordinfo = this.getRegisteredTelInfo(A_ordinfo, col);
				}

				H_ins = this.setCopyData(col, A_column, A_line, A_ordinfo, H_ins);
			}

			if (ins.insert(H_ins) == false) {
				this.outWarningMessage("\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F", table);
				fclose(this.fp);
				return false;
			}
		}

		this.checkOrderSequence(checkflag);
		this.useorderid = this.saveorderid;
		this.execOrderCopy(ins, table);
		fclose(this.fp);
		return true;
	}

	execOrderCopy(ins, table) {
		if (ALL_EXEC == DEBUG_FLAG && false == this.exec_out) {
			if (ins.end() == false) {
				this.dbh.rollback();
				this.outWarningMessage("\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u5931\u6557", table);
				fclose(this.fp);
				throw die(1);
			}
		} else if (true == this.exec_out) {
			this.outWarningMessage("sql\u751F\u6210\u306B\u5931\u6557\u3057\u3066\u3044\u308B\u306E\u3067sql\u306F\u5B9F\u884C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", table);
			fclose(this.fp);
			return false;
		}
	}

	checkOrderSequence(checkflag) //sql作成までにorderidが更新されてないかチェック order_tbの時だけでいい。
	{
		if (true == checkflag) {
			if (this.saveorderid != this.getSequence()) {
				this.outErrorMessage("\u51E6\u7406\u4E2D\u306Borderid\u304C\u66F4\u65B0\u3055\u308C\u307E\u3057\u305F\u3002\u518D\u5EA6batch\u3092\u8D77\u52D5\u3057\u3066\u304F\u3060\u3055\u3044", this.fileName);
				fclose(this.fp);
				throw die(1);
			} else //order_tb_orderid_seqを更新
				{
					this.setSequence();
					this.maxorderid = this.useorderid;
				}
		}
	}

	setCopyData(col, A_column, A_line, A_ordinfo, H_ins) //なぜかemployeecodeに入ってしまうので削除 ほかにも出そうなのでtext型のカラムからは改行消す
	{
		if (DATA_UNSET == A_ordinfo[0]) {
			if (false != A_ordinfo[1] && "" != A_ordinfo[1]) {
				if (LOG_OUT == DEBUG_FLAG && true == (undefined !== A_line[A_ordinfo[A_column[col]]])) {
					this.outWarningMessage(A_line[A_ordinfo[A_column[col]]] + LOG_DELIM + col + LOG_DELIM + "aaa", this.fileName);
				}
			} else {
				if (true == this.checkTypeAndValue(col, A_ordinfo[1])) {
					H_ins[col] = "\\N";
				}

				if (LOG_OUT == DEBUG_FLAG && true == (undefined !== A_line[A_column[col]])) {
					this.outWarningMessage(LOG_DELIM + col + LOG_DELIM + A_column[col] + LOG_DELIM + "bbb", this.fileName);
				}
			}
		} else //行から取得した情報を加工（プルダウンを数値にしたりしたもの）
			{
				if (DATA_REMAKE == A_ordinfo[0]) //int型のカラムで中身がなければtempファイルに書かない
					{
						if (true == this.checkTypeAndValue(col, A_ordinfo[1])) {
							H_ins[col] = A_ordinfo[1];
						}

						if (LOG_OUT == DEBUG_FLAG && true == (undefined !== A_line[A_column[col]])) {
							this.outWarningMessage(A_line[A_ordinfo[A_column[col]]] + LOG_DELIM + col + LOG_DELIM + "ccc", this.fileName);
						}
					} else if (DATA_GET == A_ordinfo[0]) {
					H_ins[col] = A_ordinfo[1];

					if (LOG_OUT == DEBUG_FLAG && true == (undefined !== A_line[A_column[col]])) {
						this.outWarningMessage(A_line[A_column[col]] + LOG_DELIM + col + LOG_DELIM + "ddd", this.fileName);
					}
				}
			}

		if (true == (-1 !== this.A_strtype.indexOf(col)) && true == (undefined !== H_ins[col])) {
			H_ins[col] = preg_replace("/(\n|\r\n|\r)/", "", H_ins[col]);
		}

		return H_ins;
	}

	writeCopyDissolution(A_column, table, readfile, writefile, checkflag = false) {
		this.fp = fopen(readfile, "rb");

		if (undefined == this.fp) {
			this.outWarningMessage("\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u306B\u5931\u6557", readfile);
		}

		var ins = new TableInserter(this.logh, this.dbh, writefile, true);
		ins.begin(table);

		while (line = fgets(this.fp)) //sqlファイル作成
		{
			var H_ins = Array();
			this.H_telinfo = Array();
			var A_ordinfo = [DATA_UNSET, 0, "\\N"];
			var A_line = line.split(",");

			for (var col in A_column) //オーダー情報をコピー文に変換
			//insert情報を取得
			{
				var val = A_column[col];
				A_ordinfo[0] = DATA_UNSET;
				A_ordinfo[1] = "\\N";
				A_ordinfo = this.getCommOrderInfo(col, A_column, A_ordinfo, A_line);
				H_ins = this.setCopyData(col, A_column, A_line, A_ordinfo, H_ins);
			}

			if (ins.insert(H_ins) == false) {
				this.outWarningMessage("\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F", table);
				fclose(this.fp);
				return false;
			}
		}

		this.checkOrderSequence(checkflag);
		this.useorderid = this.saveorderid;
		this.execOrderCopy(ins, table);
	}

	moveSuccessFile() {
		if (false == is_dir(this.fin_dir)) {
			if (false == mkdir(this.fin_dir)) {
				this.outWarningeMessage(finDir + "\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557", this.fileName);
				return false;
			}
		}

		var retval = true;
		var dirh = opendir(this.data_dir);
		var filename = str_replace(".csv", "", _SERVER.argv[1]);
		var filedetail = str_replace(".csv", "_detail", _SERVER.argv[1]);
		var filetrans = str_replace(".csv", "_trans", _SERVER.argv[1]);
		var A_file = [_SERVER.argv[1], filename + ".tmp", filename + ".sql", filedetail + ".csv", filedetail + ".tmp", filedetail + ".sql", filetrans + ".csv", filetrans + ".tmp", filetrans + ".sql"];

		while (fname = readdir(dirh)) {
			if (true == (-1 !== A_file.indexOf(fname))) {
				var fpath = this.data_dir + "/" + fname;

				if (true == ereg(".tmp", fname)) {
					if (REMOVE_FLAG == DEL_ONLY || REMOVE_FLAG == ALL_EXEC) //fail delete
						{
							if (false == unlink(fpath)) {
								this.outWarningMessage("\u30D5\u30A1\u30A4\u30EB\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F", fname);
								retval = false;
							}
						}
				} else {
					if (REMOVE_FLAG == MOVE_ONLY || REMOVE_FLAG == ALL_EXEC) {
						if (false == rename(fpath, this.fin_dir + "/" + fname)) {
							this.outWarningMessage("\u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F", fname);
							retval = false;
						}
					}
				}
			}
		}

		return retval;
	}

};

var O_order = new ActOrder();
O_order.logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "\u51E6\u7406\u958B\u59CB");
O_order.checkArgv(_SERVER.argv);
O_order.getDataFile(_SERVER.argv);
O_order.lockFile(O_order.fp);
O_order.getOrderInfo();

switch (O_order.ordtype) {
	case TYPE_NEW:
	case TYPE_CHN:
	case TYPE_SHI:
		O_order.ordNewContract();
		O_order.writeSQLReady();
		O_order.getSequence(true);

		if (DEBUG_FLAG == ALL_EXEC) {
			O_order.dbh.begin();
		}

		O_order.writeCopyFile(O_order.A_ordcol, ORDER_TB, O_order.tmpfile, str_replace(".csv", FILE_SQL, O_order.fileName), true);
		O_order.writeCopyFile(O_order.A_orddetail, ORDDET_TB, O_order.tmpdetail, str_replace(".csv", "_detail" + FILE_SQL, O_order.fileName));
		O_order.writeCopyHistory(ORDHIS_TB, O_order.tmpfile, str_replace(".csv", "_hist" + FILE_SQL, O_order.fileName));
		O_order.writeCopyFileTransfer(TRANS_TB, str_replace(".csv", "_trans" + FILE_SQL, O_order.fileName));

		if (DEBUG_FLAG == ALL_EXEC) {
			O_order.dbh.commit();
		}

		break;

	case TYPE_DIS:
		O_order.ordDissolution();
		O_order.writeSQLReady();
		O_order.getSequence(true);

		if (DEBUG_FLAG == ALL_EXEC) {
			O_order.dbh.begin();
		}

		O_order.writeCopyDissolution(O_order.A_ordcol, ORDER_TB, O_order.tmpfile, str_replace(".csv", FILE_SQL, O_order.fileName), true);
		O_order.writeCopyTelDetail(str_replace(".csv", "_detail" + FILE_SQL, O_order.fileName));
		O_order.writeCopyHistory(ORDHIS_TB, O_order.tmpfile, str_replace(".csv", "_hist" + FILE_SQL, O_order.fileName));
		O_order.writeCopyFileTransfer(TRANS_TB, str_replace(".csv", "_trans" + FILE_SQL, O_order.fileName));

		if (DEBUG_FLAG == ALL_EXEC) {
			O_order.dbh.commit();
		}

		O_order.moveSuccessFile();
		break;

	default:
		O_order.outErrorMessage("\u4E88\u671F\u3057\u306A\u3044\u767A\u6CE8\u7A2E\u5225\u3067\u3059" + LOG_DELIM + O_order.ordtype, O_order.fileName);
		break;
}