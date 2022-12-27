//===========================================================================
//機能：購買・コピーの請求一覧を作成する(要素毎)電話のtel_bill_X_tbに相当する
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：定数名を管理する

require("lib/script_db.php");

require("lib/script_common.php");

require("lib/process_base.php");

//データベースのテーブルやカラムの名称
//以下の要素の%Xはテーブル番号に置き換えられる
//details			xxx_details_X_tb
//details_coid	xxx_details_X_tb::キャリアID
//details_id		xxx_details_X_tb::要素ID
//bill			xxx_bill_X_tb
//bill_coid		xxx_bill_X_tb::キャリアID
//bill_id			xxx_bill_X_tb::要素ID
//kamoku			xxx_kamoku_tb
//utiwake			xxx_utiwake_tb
//utiwake_coid	xxx_utiwake_tb::キャリアID
//rel				xxx_kamoku_rel_utiwake_tb
//rel_coid		xxx_kamoku_rel_utiwake_tb::キャリアID
//xxx				xxx_tb(tel_X_tbに相当)
//xxx_coid		xxx_tb::キャリアID
//xxx_key			xxx_tb::要素ID
//co				xxx_co_tb
//co_coid			xxx_co_tb::キャリアID
//history			xxx_history_tb
//history_coid	xxx_history_tb::キャリアID
//postbill		xxx_post_bill_tb
//postbill_coid	xxx_post_bill_tb::キャリアID
//postbill_num	xxx_post_bill_X_tb::回線数
//add_column		追加カラム名
//追加カラム名は、以下の書式
//details,tel_bill,billの各テーブルでの
//テーブル名を、カンマで連結する。
//追加カラム名が複数ある場合は、
//上記のカンマで接続したものを、
//スラッシュで連結する。
//設定情報
//A_code_excise	消費税と見なすコード(配列)
//kamokuid_excise	消費税の振り分け先の科目ID
//coid_all		「全て」を表す会社ID
//kamokuid_default設定が無い場合の科目ID
//kamokuid_limit	科目の個数
//code_asp		ASP利用料のコード
//code_asx		ASX消費税額のコード
//is_excise		消費税を集計するか
//is_dummy		ダミー回線が存在するか
//機能：何もしないコンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：データベースのテーブルやカラムの名称を取り出す
//引数：キー
//テーブル番号
//機能：設定情報を取り出す
//引数：キー
//機能：追加カラムを返す
//引数：添え字
//機能：購買用の定数表を作る
//機能：コピー用の定数表を作る
//機能：通運用の定数表を作る
//機能：電気自動車用の定数表を作る
class UpdateBillName extends ScriptDBAdaptor {
	constructor(listener, db, table_no) {
		super(listener, db, table_no);
		this.m_H_name = Array();
		this.m_H_setting = Array();
	}

	getName(key, table_no) {
		var name = "";

		if (undefined !== this.m_H_name[key]) {
			name = this.m_H_name[key];
		} else {
			this.putError(G_SCRIPT_ERROR, "\u5185\u90E8\u30A8\u30E9\u30FC:\u672A\u5B9A\u7FA9\u30AD\u30FC\u30EF\u30FC\u30C9(DB)/" + key);
		}

		if (table_no.length) name = str_replace("%X", table_no, name);else name = str_replace("_%X", "", name);
		return name;
	}

	getSetting(key) {
		if (undefined !== this.m_H_setting[key]) {
			return this.m_H_setting[key];
		} else {
			this.putError(G_SCRIPT_ERROR, "\u5185\u90E8\u30A8\u30E9\u30FC:\u672A\u5B9A\u7FA9\u30AD\u30FC\u30EF\u30FC\u30C9(\u8A2D\u5B9A)/" + key);
		}
	}

	getAdd(idx) {
		var add_line = this.getName("add_column", "");
		if (!add_line.length) return Array();
		var A_line = add_line.split("/");
		var A_result = Array();

		for (var line of Object.values(A_line)) {
			var A_temp = line.split(",");
			A_result.push(A_temp[idx]);
		}

		return A_result;
	}

	initPurchase() {
		this.m_H_name = {
			history: "purchase_history_tb",
			history_coid: "purchcoid",
			details: "purchase_details_%X_tb",
			details_coid: "purchcoid",
			details_id: "purchid",
			bill: "purchase_bill_%X_tb",
			bill_coid: "purchcoid",
			bill_id: "purchid",
			kamoku: "purchase_kamoku_tb",
			utiwake: "purchase_utiwake_tb",
			utiwake_coid: "purchcoid",
			rel: "purchase_kamoku_rel_utiwake_tb",
			rel_coid: "purchcoid",
			xxx: "purchase_%X_tb",
			xxx_coid: "purchcoid",
			xxx_key: "purchid",
			co: "purchase_co_tb",
			co_coid: "purchcoid",
			postbill: "purchase_post_bill_%X_tb",
			postbill_coid: "purchcoid",
			postbill_num: "purchid_num",
			add_column: "itemsum,itemsum,itemsum"
		};
		this.m_H_setting = {
			A_code_excise: Array(),
			kamokuid_excise: 8,
			coid_all: 0,
			kamokuid_default: 9,
			kamokuid_limit: 10,
			code_asp: "ASP",
			code_asx: "ASX",
			is_excise: true,
			is_dummy: true
		};
	}

	initCopy() {
		this.m_H_name = {
			history: "copy_history_tb",
			history_coid: "copycoid",
			details: "copy_details_%X_tb",
			details_coid: "copycoid",
			details_id: "copyid",
			bill: "copy_bill_%X_tb",
			bill_coid: "copycoid",
			bill_id: "copyid",
			kamoku: "copy_kamoku_tb",
			utiwake: "copy_utiwake_tb",
			utiwake_coid: "copycoid",
			rel: "copy_kamoku_rel_utiwake_tb",
			rel_coid: "copycoid",
			xxx: "copy_%X_tb",
			xxx_coid: "copycoid",
			xxx_key: "copyid",
			co: "copy_co_tb",
			co_coid: "copycoid",
			postbill: "copy_post_bill_%X_tb",
			postbill_coid: "copycoid",
			postbill_num: "copyid_num",
			add_column: "printcount,printcount,printcount"
		};
		this.m_H_setting = {
			A_code_excise: Array(),
			kamokuid_excise: 8,
			coid_all: 0,
			kamokuid_default: 9,
			kamokuid_limit: 10,
			code_asp: "ASP",
			code_asx: "ASX",
			is_excise: true,
			is_dummy: true
		};
	}

	initTransit() {
		this.m_H_name = {
			history: "transit_history_tb",
			history_coid: "trancoid",
			details: "transit_details_%X_tb",
			details_coid: "trancoid",
			details_id: "tranid",
			bill: "transit_bill_%X_tb",
			bill_coid: "trancoid",
			bill_id: "tranid",
			kamoku: "transit_kamoku_tb",
			utiwake: "transit_utiwake_tb",
			utiwake_coid: "trancoid",
			rel: "transit_kamoku_rel_utiwake_tb",
			rel_coid: "trancoid",
			xxx: "transit_%X_tb",
			xxx_coid: "trancoid",
			xxx_key: "tranid",
			co: "transit_co_tb",
			co_coid: "trancoid",
			postbill: "transit_post_bill_%X_tb",
			postbill_coid: "trancoid",
			postbill_num: "tranid_num",
			add_column: "weight,weight,weight/sendcount,sendcount,sendcount"
		};
		this.m_H_setting = {
			A_code_excise: Array(),
			kamokuid_excise: 8,
			coid_all: 0,
			kamokuid_default: 9,
			kamokuid_limit: 10,
			code_asp: "ASP",
			code_asx: "ASX",
			is_excise: true,
			is_dummy: true
		};
	}

	initEv() {
		this.m_H_name = {
			history: "ev_bill_history_tb",
			history_coid: "evcoid",
			details: "ev_details_%X_tb",
			details_coid: "evcoid",
			details_id: "evid",
			bill: "ev_bill_%X_tb",
			bill_coid: "evcoid",
			bill_id: "evid",
			kamoku: "ev_kamoku_tb",
			utiwake: "ev_utiwake_tb",
			utiwake_coid: "evcoid",
			rel: "ev_kamoku_rel_utiwake_tb",
			rel_coid: "evcoid",
			xxx: "ev_%X_tb",
			xxx_coid: "evcoid",
			xxx_key: "evid",
			co: "ev_co_tb",
			co_coid: "evcoid",
			postbill: "ev_post_bill_%X_tb",
			postbill_coid: "evcoid",
			postbill_num: "evid_num",
			add_column: ""
		};
		this.m_H_setting = {
			A_code_excise: Array(),
			kamokuid_excise: -1,
			coid_all: 0,
			kamokuid_default: 9,
			kamokuid_limit: 10,
			code_asp: "ASP",
			code_asx: "ASX",
			is_excise: false,
			is_dummy: false
		};
	}

};

//データベースのテーブルやカラムの名称
//プロセス名
//再計算用ならtrue
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//データベースのテーブルやカラムの名称
//計算プロセスのプロセス名(xxx_history_tbのusernameに使う)
//再計算用ならtrue
//機能：データベースのテーブルやカラムの名称を取り出す
//引数：キー
//機能：設定情報を取り出す
//引数：キー
//機能：計算中の履歴を挿入する
//引数：顧客ID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：計算中の履歴を計算終了に更新する
//引数：顧客ID
//年
//月
//計算処理に失敗していたらtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：計算要求の個数を返す
//機能：計算要求のステータスを計算中に変更する
//引数：{year,month,pactid}
//返値：深刻なエラーが発生したらfalseを返す
//機能：計算要求を取り出す
//引数：{pactid,year,month,carid}を返す(要素がなければ空配列)
//何番目の要素を取り出すか
//デバッグモードならtrue
//返値：深刻なエラーが発生したらfalseを返す
class UpdateBillHistory extends ScriptDBAdaptor {
	constructor(listener, db, table_no, O_name, procname, is_recalc) {
		super(listener, db, table_no);
		this.m_O_name = O_name;
		this.m_procname = procname;
		this.m_is_recalc = is_recalc;
	}

	getName(key) //テーブルNoは付けない
	{
		return this.m_O_name.getName(key, "");
	}

	getSetting(key) {
		return this.m_O_name.getSetting(key);
	}

	insert(pactid, year, month) {
		var sql = PGPOOL_NO_INSERT_LOCK + "insert into " + this.getName("history");
		sql += "(pactid,year,month";
		sql += ",username,recdate,status," + this.getName("history_coid") + ")values";
		sql += "(" + this.m_db.escape(pactid);
		sql += "," + this.m_db.escape(year);
		sql += "," + this.m_db.escape(month);
		sql += ",'" + this.m_db.escape(this.m_procname) + "'";
		sql += ",'" + date("Y-m-d H:i:s") + "'";
		sql += ",'1'," + this.getSetting("coid_all") + ")";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	update(pactid, year, month, is_fail) {
		var sql = "";

		if (is_fail) //処理に失敗した
			{
				if (this.m_is_recalc) //再計算なら、計算中を計算要求に戻す
					{
						sql += "update " + this.getname("history") + " set status='0'";
					} else //計算要求なら、計算中フラグを削除する
					{
						sql += "delete from " + this.getname("history");
					}
			} else //処理に成功したので、計算中フラグを計算終了にする
			{
				sql += "update " + this.getname("history");

				if (this.m_is_recalc) {
					sql += " set status='2'";
				} else {
					sql += " set status='2C'";
				}
			}

		sql += " where pactid=" + this.m_db.escape(pactid);
		sql += " and year=" + this.m_db.escape(year);
		sql += " and month=" + this.m_db.escape(month);
		sql += " and status='1'";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	getLimit() {
		var sql = "select count(*) from " + this.getName("history");
		sql += " where status='0'";
		sql += ";";
		return this.m_db.getOne(sql);
	}

	start(H_status) {
		var sql = "update " + this.getname("history");
		sql += " set status='1'";
		sql += " where status='0'";
		sql += " and pactid=" + this.m_db.escape(H_status.pactid);
		sql += " and year=" + this.m_db.escape(H_status.year);
		sql += " and month=" + this.m_db.escape(H_status.month);
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	get(H_status, idx, is_debugmode) {
		H_status = Array();
		var sql = "select pactid,year,month," + this.getName("history_coid") + " from " + this.getName("history");
		sql += " where status='0'";
		sql += " order by recdate,year,month,pactid";
		sql += " limit 1";

		if (is_debugmode) {
			sql += " offset " + this.m_db.escape(idx);
		}

		sql += ";";
		var param = this.m_db.getHash(sql);

		if (0 == param.length) {
			return true;
		}

		param = param[0];
		H_status = {
			pactid: param.pactid,
			year: param.year,
			month: param.month
		};
		return true;
	}

};

//データ挿入型
//データベースのテーブルやカラムの名称
//消費税と見なすコード
//消費税の振り分け先のコード
//「全て」を表すキャリアID
//設定が無い場合の科目ID(0が先頭)
//科目の個数
//ASP利用料のコード
//ASP消費税額のコード
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//データベースのテーブルやカラムの名称
//データ挿入型
//機能：データベースのテーブルやカラムの名称を取り出す
//引数：キー
//テーブル番号
//機能：年と月からテーブル番号を返す
//引数：年
//月
//返値：テーブル番号
//機能：既存のxxx_bill_X_tbからレコードを削除する
//引数：顧客ID
//年
//月
//保存先ファイル名(空文字列ならファイル保存せず)
//返値：深刻なエラーが発生したらfalseを返す
//機能：xxx_bill_X_tbを作る
//引数：顧客ID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：キャリアIDごとの処理を行う
//引数：顧客ID
//キャリアID(全キャリア以外)
//年
//月
//処理するテーブルNo
//この顧客の科目設定があればtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客の請求明細を読み出し、サマリを作る
//引数：顧客ID
//キャリアID
//テーブルNo
//"T" . 要素番号 -> {kamoku, axp, asx, charge, excise}
//この顧客の科目設定があればtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：電話情報に相当する情報を取り出す
//引数：顧客ID
//キャリアID
//テーブルNo
//{id, coid}*を返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：集計結果を挿入する
//引数：顧客ID
//キャリアID(全キャリア以外)
//部署ID
//年
//月
//処理するテーブルNo
//電話番号に相当するID
//集計結果
//返値：深刻なエラーが発生したらfalseを返す
class UpdateBillItem extends ScriptDBAdaptor {
	constructor(listener, db, table_no, O_name, inserter) {
		super(listener, db, table_no);
		this.m_inserter = inserter;
		this.m_inserter.setUnlock();
		this.m_O_name = O_name;
		this.m_A_code_excise = O_name.getSetting("A_code_excise");
		this.m_kamokuid_excise = O_name.getSetting("kamokuid_excise");
		this.m_coid_all = O_name.getSetting("coid_all");
		this.m_kamokuid_default = O_name.getSetting("kamokuid_default");
		this.m_kamokuid_limit = O_name.getSetting("kamokuid_limit");
		this.m_code_asp = O_name.getSetting("code_asp");
		this.m_code_asx = O_name.getSetting("code_asx");
	}

	getName(key, table_no) {
		return this.m_O_name.getName(key, table_no);
	}

	getTableNo(year, month) {
		if (0 == year || 0 == month) return "";
		return super.getTableNo(year, month);
	}

	delete(pactid, year, month, fname) {
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from " + this.getName("bill", table_no) + " where pactid=" + this.escape(pactid);

		if (fname.length) {
			if (false == this.m_db.backup(fname, "select *" + sqlfrom + ";")) {
				return false;
			}
		}

		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	execute(pactid, year, month) //この顧客の科目設定があるか確認する
	//キャリア一覧を取り出す
	//挿入準備をする
	//挿入を実行する
	{
		var table_no = this.getTableNo(year, month);
		var sql = "select count(*) from " + this.getName("kamoku", table_no) + " where pactid=" + this.escape(pactid) + ";";
		var is_kamoku = 0 < this.m_db.getOne(sql);
		sql = "select " + this.getName("co_coid", table_no) + " from " + this.getName("co", table_no) + " where " + this.getName("co_coid", table_no) + "!=" + this.escape(this.m_coid_all, table_no) + " order by " + this.getName("co_coid", table_no) + ";";
		var A_coid = this.m_db.getAll(sql);

		if (false == this.m_inserter.begin(this.getName("bill", table_no))) {
			return false;
		}

		for (var A_item of Object.values(A_coid)) {
			var coid = A_item[0];

			if (false == this.executeCoid(pactid, coid, year, month, table_no, is_kamoku)) {
				return false;
			}
		}

		if (false == this.m_inserter.end()) {
			return false;
		}

		return true;
	}

	executeCoid(pactid, coid, year, month, table_no, is_kamoku) //明細を取り出す
	{
		var H_details = Array();

		if (false == this.getDetails(pactid, coid, table_no, H_details, is_kamoku)) {
			return false;
		}

		var A_info = Array();

		if (false == this.getInfo(pactid, coid, table_no, A_info)) {
			return false;
		}

		for (var H_info of Object.values(A_info)) //明細が存在しなければ処理しない
		{
			var id = H_info.id;

			if (false == (undefined !== H_details["T" + id])) {
				continue;
			}

			if (false == this.insert(pactid, H_info.coid, H_info.postid, year, month, table_no, id, H_details["T" + id])) {
				return false;
			}
		}

		return true;
	}

	getDetails(pactid, coid, table_no, H_details, is_kamoku) //科目明細を取り出す
	//free必要
	//結果を整形する
	{
		H_details = Array();
		var sql = "select details_tb" + "." + this.getName("details_id", table_no) + " as id";
		sql += ",details_tb.charge as charge";
		sql += ",details_tb.code as code";
		sql += ",(case when rel_tb.kamokuid is null then " + this.m_kamokuid_default + " else rel_tb.kamokuid end) as kamokuid";
		var A_col = this.m_O_name.getAdd(0);

		for (var col of Object.values(A_col)) {
			sql += ",coalesce(details_tb." + col + ",0) as " + " details_tb_" + col;
		}

		sql += " from " + this.getName("details", table_no) + " as details_tb";
		sql += " left join " + this.getName("utiwake", table_no) + " as utiwake_tb";
		sql += " on details_tb.code=utiwake_tb.code";
		sql += " and details_tb." + this.getName("details_coid", table_no) + "=utiwake_tb." + this.getName("utiwake_coid", table_no);
		sql += " left join " + this.getName("rel", table_no) + " as rel_tb";
		sql += " on details_tb.code=rel_tb.code";
		sql += " and details_tb." + this.getName("details_coid", table_no) + "=rel_tb." + this.getName("rel_coid", table_no);

		if (is_kamoku) {
			sql += " and details_tb.pactid=rel_tb.pactid";
		} else {
			sql += " and rel_tb.pactid=0";
		}

		sql += " where details_tb.pactid=" + this.escape(pactid);
		sql += " and details_tb." + this.getName("details_coid", table_no) + "=" + this.escape(coid);
		sql += " and utiwake_tb.codetype='0'";
		sql += " order by details_tb." + this.getName("details_id", table_no);
		sql += ";";
		var O_result = this.m_db.query(sql);
		var H_init = {
			kamoku: Array(),
			asp: 0,
			asx: 0,
			charge: 0,
			excise: 0,
			add: Array()
		};

		for (var cnt = 0; cnt < this.m_kamokuid_limit; ++cnt) {
			H_init.kamoku.push(0);
		}

		for (var col of Object.values(A_col)) {
			H_init.add.push(0);
		}

		while (H_line = O_result.fetchRow(DB_FETCHMODE_ASSOC)) //新しく要素番号が出現したら、バッファを作る
		//ASP利用料・ASP消費税を加算する
		//追加項目
		{
			var id = H_line.id;
			var charge = H_line.charge;
			var code = H_line.code;
			var kamokuid = H_line.kamokuid;
			var key = "T" + id;

			if (false == (undefined !== H_details[key])) {
				H_details[key] = H_init;
			}

			if (false == (undefined !== H_details[key].kamoku[kamokuid])) {
				this.putError(G_SCRIPT_WARNING, "\u5927\u304D\u3059\u304E\u308B\u79D1\u76EEID" + kamokuid);
			} else {
				H_details[key].kamoku[kamokuid] += charge;
			}

			if (0 == strcmp(this.m_code_asp, code)) {
				H_details[key].asp += charge;
			}

			if (0 == strcmp(this.m_code_asx, code)) {
				H_details[key].asx += charge;
			}

			if (-1 !== this.m_A_code_excise.indexOf(code) || this.m_kamokuid_excise == kamokuid) {
				H_details[key].excise += charge;
			} else {
				H_details[key].charge += charge;
			}

			for (cnt = 0;; cnt < A_col.length; ++cnt) {
				var col = A_col[cnt];

				if (undefined !== H_line["details_tb_" + col]) {
					H_details[key].add[cnt] += H_line["details_tb_" + col];
				}
			}
		}

		O_result.free();
		return true;
	}

	getInfo(pactid, coid, table_no, A_info) {
		var sql = "select " + this.getName("xxx_key", table_no) + " as id";
		sql += ",postid";
		sql += "," + this.getName("xxx_coid", table_no) + " as coid";
		sql += " from " + this.getName("xxx", table_no);
		sql += " where pactid=" + this.escape(pactid);
		sql += " and " + this.getName("xxx_coid", table_no) + "=" + this.escape(coid);
		sql += " order by coid,id";
		sql += ";";
		var result = this.m_db.getHash(sql);
		A_info = Array();

		for (var H_result of Object.values(result)) {
			A_info.push(H_result);
		}

		return true;
	}

	insert(pactid, coid, postid, year, month, table_no, id, H_details) //共通部分
	//科目
	//総額・消費税(ASP利用料・ASP消費税額を引いた値)
	//ASP利用料・ASP消費税額
	//追加項目
	//追加して終了する
	{
		var H_cur = Array();
		H_cur.pactid = pactid;
		H_cur.postid = postid;
		H_cur[this.getName("details_id", table_no)] = id;
		H_cur[this.getName("details_coid", table_no)] = coid;
		H_cur.recdate = "now()";

		for (var cnt = 0; cnt < this.m_kamokuid_limit; ++cnt) {
			H_cur["kamoku" + (cnt + 1)] = H_details.kamoku[cnt];
		}

		if (this.m_O_name.getSetting("is_excise")) {
			H_cur.charge = H_details.charge - H_details.asp;
			H_cur.excise = H_details.excise - H_details.asx;
		} else {
			H_cur.charge = H_details.charge - H_details.asx - H_details.asp;
		}

		H_cur.aspcharge = H_details.asp;
		H_cur.aspexcise = H_details.asx;
		var A_col = this.m_O_name.getAdd(1);

		for (cnt = 0;; cnt < A_col.length; ++cnt) {
			H_cur[A_col[cnt]] = H_details.add[cnt];
		}

		this.m_inserter.insert(H_cur);
		return true;
	}

};

//データベースのテーブルやカラムの名称
//「全て」を表すキャリアID
//すべてのキャリアID(「全て」を含まない)
//科目の個数
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//データベースのテーブルやカラムの名称
//機能：データベースのテーブルやカラムの名称を取り出す
//引数：キー
//テーブル番号
//機能：集計対象のカラム名を返す(回線数を除く)
//機能：年と月からテーブル番号を返す
//引数：年
//月
//返値：テーブル番号
//機能：部署テーブルの名前を返す
//引数：テーブル番号
//機能：部署連携テーブルの名前を返す
//引数：テーブル番号
//機能：既存のxxx_post_bill_X_tbからレコードを削除する
//引数：顧客ID
//年
//月
//保存先ファイル名(空文字列ならファイル保存せず)
//返値：深刻なエラーが発生したらfalseを返す
//機能：post_bill_X_tbを作る
//引数：顧客ID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：部署と部署連携の情報を読み出す
//備考：部署情報が無かったら、トップの部署IDが無効である
//引数：顧客ID
//年
//月
//テーブルNo
//部署連係情報{parent,child,level}を返す
//トップの部署IDを返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：自部署・キャリア別の要素を作る
//引数：顧客ID
//年
//月
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
//機能：除外回線数を引く
//引数：顧客ID
//年
//月
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
//機能：配下部署の要素を作る
//引数：顧客ID
//年
//月
//テーブルNo
//部署連係情報{parent,child,level}
//トップの部署ID
//返値：深刻なエラーが発生したらfalseを返す
//機能：自部署と配下部署・全キャリアの要素を作る
//引数：顧客ID
//年
//月
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
class UpdateBillPost extends ScriptDBAdaptor {
	constructor(listener, db, table_no, O_name) //すべてのキャリアIDをマスターから読み出す
	{
		super(listener, db, table_no);
		this.m_O_name = O_name;
		this.m_coid_all = O_name.getSetting("coid_all");
		this.m_kamokuid_limit = O_name.getSetting("kamokuid_limit");
		var sql = "select " + this.getName("co_coid", "") + " from " + this.getName("co", "") + " order by " + this.getName("co_coid", "");
		sql += ";";
		var result = this.m_db.getAll(sql);
		this.m_A_coid = Array();

		for (var line of Object.values(result)) {
			if (this.m_coid_all != line[0]) {
				this.m_A_coid.push(line[0]);
			}
		}
	}

	getName(key, table_no) {
		return this.m_O_name.getName(key, table_no);
	}

	getColumn() {
		var A_keys = "charge,aspcharge,aspexcise".split(",");
		if (this.m_O_name.getSetting("is_excise")) A_keys.push("excise");

		for (var cnt = 0; cnt < this.m_kamokuid_limit; ++cnt) A_keys.push("kamoku" + (1 + cnt));

		return A_keys;
	}

	getTableNo(year, month) {
		if (0 == year || 0 == month) return "";
		return super.getTableNo(year, month);
	}

	getTableNamePost(table_no) {
		if (table_no.length) return "post_" + table_no + "_tb";else return "post_tb";
	}

	getTableNamePostRelation(table_no) {
		if (table_no.length) return "post_relation_" + table_no + "_tb";else return "post_relation_tb";
	}

	delete(pactid, year, month, fname) {
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from " + this.getName("postbill", table_no) + " where pactid=" + this.escape(pactid);

		if (fname.length) {
			if (false == this.m_db.backup(fname, "select *" + sqlfrom + ";")) {
				return false;
			}
		}

		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	execute(pactid, year, month) //部署情報を取り出す
	//部署連係情報{parent,child,level}*
	//トップの部署ID
	{
		var table_no = this.getTableNo(year, month);
		var A_rel = Array();
		var toppostid = undefined;

		if (false == this.getPostRel(pactid, year, month, table_no, A_rel, toppostid)) {
			return false;
		}

		if (0 == toppostid.length) {
			this.putOperator(G_SCRIPT_WARNING, "\u90E8\u7F72\u60C5\u5831\u53D6\u5F97\u5931\u6557" + pactid);
			return false;
		}

		if (false == this.updateOwn(pactid, year, month, table_no)) {
			return false;
		}

		if (false == this.updateDummy(pactid, year, month, table_no)) {
			return false;
		}

		if (false == this.updateChild(pactid, year, month, table_no, A_rel, toppostid)) {
			return false;
		}

		if (false == this.updateAllCoid(pactid, year, month, table_no)) {
			return false;
		}

		return true;
	}

	getPostRel(pactid, year, month, table_no, A_rel, toppostid) {
		var sql = "select postidparent,postidchild,level";
		sql += " from " + this.getTableNamePostRelation(table_no);
		sql += " where pactid=" + this.escape(pactid);
		sql += " order by level,postidparent";
		sql += ";";
		var result = this.m_db.getHash(sql);

		for (var line of Object.values(result)) {
			var level = line.level;
			var parent = line.postidparent;
			var child = line.postidchild;

			if (0 == level) {
				toppostid = line.postidparent;
			}

			var H_rel = {
				parent: parent,
				child: child,
				level: level
			};

			if (false == (-1 !== A_rel.indexOf(H_rel))) {
				A_rel.push(H_rel);
			}
		}

		return true;
	}

	updateOwn(pactid, year, month, table_no) //集計するカラム名
	//集計するキャリアID
	//レコードを作って挿入する
	{
		var A_keys = this.getColumn();
		var A_coid = this.m_A_coid;
		var sql = PGPOOL_NO_INSERT_LOCK + "insert into " + this.getName("postbill", table_no) + "(pactid,postid,flag,recdate";
		sql += "," + this.getName("postbill_coid", table_no);
		if (this.getName("postbill_num", table_no).length) sql += "," + this.getName("postbill_num", table_no);

		for (var key of Object.values(A_keys)) sql += "," + key;

		var A_col = this.m_O_name.getAdd(2);

		for (var col of Object.values(A_col)) {
			sql += "," + col;
		}

		sql += ")";
		sql += " select " + this.escape(pactid);
		sql += ",sub_tb.postid,'0','" + date("Y-m-d H:i:s") + "'";
		sql += ",sub_tb.coid";
		if (this.getName("postbill_num", table_no).length) sql += ",count(child_tb.*)";

		for (var key of Object.values(A_keys)) sql += `,sum(case when ${key} is null then 0 else ${key} end)`;

		A_col = this.m_O_name.getAdd(1);

		for (var col of Object.values(A_col)) {
			sql += `,sum(case when ${col} is null then 0 else ${col} end)`;
		}

		sql += " from (select pactid" + "," + this.getName("co_coid", table_no) + " as coid" + ",postid from " + this.getName("co", table_no);
		sql += "," + this.getTableNamePost(table_no);
		sql += " where " + this.getName("co_coid", table_no) + " in (";
		var comma = false;

		for (var coid of Object.values(A_coid)) {
			if (comma) sql += ",";
			comma = true;
			sql += coid;
		}

		sql += ")";
		sql += " and pactid=" + this.escape(pactid);
		sql += " order by coid,postid";
		sql += ") as sub_tb";
		sql += " left join " + this.getName("bill", table_no) + " as child_tb";
		sql += " on sub_tb.coid=child_tb." + this.getName("bill_coid", table_no);
		sql += " and sub_tb.postid=child_tb.postid";
		sql += " and sub_tb.pactid=child_tb.pactid";
		sql += " group by sub_tb.coid,sub_tb.postid";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	updateDummy(pactid, year, month, table_no) //自部署・各キャリアから、除外回線数だけ回線数を減じる
	{
		if (!this.getName("postbill_num", table_no).length) return true;
		if (!this.m_O_name.getSetting("is_dummy")) return true;
		var sql = "select count(root_tb.*) as dummy_num" + ",root_tb.postid as postid" + ",root_tb." + this.getName("xxx_coid", table_no) + " as coid" + " from " + this.getName("xxx", table_no) + " as root_tb";
		sql += " where coalesce(dummy_flg,false)=true";
		sql += " and pactid=" + this.escape(pactid);
		sql += " and " + this.getName("xxx_coid", table_no) + " in (" + this.m_A_coid.join(",") + ")";
		sql += " group by postid" + "," + this.getName("xxx_coid", table_no);
		sql += " order by postid" + "," + this.getName("xxx_coid", table_no);
		sql += ";";
		var result = this.m_db.getHash(sql);

		for (var H_line of Object.values(result)) {
			sql = "update " + this.getName("postbill", table_no);
			sql += " set " + this.getName("postbill_num", table_no) + "=" + this.getName("postbill_num", table_no) + "-" + (0 + H_line.dummy_num);
			sql += " where pactid=" + this.escape(pactid);
			sql += " and postid=" + this.escape(H_line.postid);
			sql += " and " + this.getName("xxx_coid", table_no) + "=" + this.escape(H_line.coid);
			sql += " and flag='0'";
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		return true;
	}

	updateChild(pactid, year, month, table_no, A_rel, toppostid) //配下部署のリストを作る
	//部署IDから、自部署を含む配下部署の配列
	//SQL文を作る
	{
		var sql = "select postid from " + this.getTableNamePost(table_no);
		sql += " where pactid=" + this.escape(pactid);
		sql += " order by postid";
		sql += ";";
		var result = this.m_db.getAll(sql);
		var A_child = Array();

		for (var line of Object.values(result)) {
			var postid = line[0];
			var tgt = [postid];
			var add = Array();

			do {
				add = Array();

				for (var rel of Object.values(A_rel)) {
					if (!(-1 !== tgt.indexOf(rel.parent))) continue;
					if (-1 !== tgt.indexOf(rel.child)) continue;
					add.push(rel.child);
				}

				for (var id of Object.values(add)) tgt.push(id);
			} while (add.length);

			A_child[postid] = tgt;
		}

		var A_keys = this.getColumn();
		if (this.getName("postbill_num", table_no).length) A_keys.push(this.getName("postbill_num", table_no));
		var A_col = this.m_O_name.getAdd(2);

		for (var col of Object.values(A_col)) {
			A_keys.push(col);
		}

		var coid = this.getName("postbill_coid", table_no);

		for (var postid in A_child) //挿入SQLを作成する
		{
			var A_child = A_child[postid];
			sql = PGPOOL_NO_INSERT_LOCK + "insert into " + this.getName("postbill", table_no);
			sql += "(pactid,postid,flag,recdate," + coid;

			for (var key of Object.values(A_keys)) sql += "," + key;

			sql += ")";
			sql += " select " + this.escape(pactid);
			sql += "," + this.escape(postid);
			sql += ",'1','" + date("Y-m-d H:i:s") + "'," + coid;

			for (var key of Object.values(A_keys)) sql += `,sum(case when ${key} is null then 0 else ${key} end)`;

			sql += " from " + this.getName("postbill", table_no);
			sql += " where pactid=" + this.escape(pactid);
			sql += " and postid in(" + A_child.join(",") + ")";
			sql += " and flag='0'";
			sql += " group by " + coid;
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		return true;
	}

	updateAllCoid(pactid, year, month, table_no) //集計するカラム名(回線数を含む)
	//レコードを作って挿入する
	{
		var A_keys = this.getColumn();
		if (this.getName("postbill_num", table_no).length) A_keys.push(this.getName("postbill_num", table_no));
		var A_col = this.m_O_name.getAdd(2);

		for (var col of Object.values(A_col)) {
			A_keys.push(col);
		}

		var sql = PGPOOL_NO_INSERT_LOCK + "insert into " + this.getName("postbill", table_no) + "(pactid,postid,flag,recdate";
		sql += "," + this.getName("postbill_coid", table_no);

		for (var key of Object.values(A_keys)) sql += "," + key;

		sql += ")";
		sql += " select " + this.escape(pactid);
		sql += ",post_tb.postid,flag,'" + date("Y-m-d H:i:s") + "'," + this.escape(this.m_coid_all);

		for (var key of Object.values(A_keys)) sql += `,sum(case when ${key} is null then 0 else ${key} end)`;

		sql += " from " + this.getTableNamePost(table_no) + " as post_tb";
		sql += " left join " + this.getName("postbill", table_no) + " as parent_tb";
		sql += " on post_tb.pactid=parent_tb.pactid";
		sql += " and post_tb.postid=parent_tb.postid";
		sql += " where post_tb.pactid=" + this.escape(pactid);
		sql += " and parent_tb." + this.getName("postbill_coid", table_no) + "!=" + this.escape(this.m_coid_all);
		sql += " group by post_tb.postid,flag";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

};

//日本語のプロセス名
//計算履歴のユーザ名
//定数一覧
//UpdateBillHistoryインスタンス
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//日本語のプロセス名
//計算履歴のユーザ名
//機能：このプロセスの日本語処理名を返す
//機能：プロセスを初期化する
//機能：定数名を設定する
//機能：顧客毎の処理を開始する
//引数：顧客ID
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を終了する
//引数：顧客ID
//executePactidの実行結果
//返値：深刻なエラーが発生したらfalseを返す
class ProcessCalcBase extends ProcessDefault {
	constructor(procname, logpath, opentime, procname_long, username = "") {
		super(procname, logpath, opentime);
		this.m_procname_long = procname_long;

		if (0 == username.length) {
			username = procname;
		}

		this.m_username = username;
		this.m_O_name = new UpdateBillName(this.m_listener, this.m_db, this.m_table_no);
	}

	getProcname() {
		return this.m_procname_long;
	}

	initHist() {
		this.initName();
		this.m_O_hist = new UpdateBillHistory(this.m_listener, this.m_db, this.m_table_no, this.m_O_name, this.m_username, false);
	}

	initName() //派生型で実装する
	//this->m_O_name->initPurchaseかinitCopyのどちらかを実行する
	{}

	beginPactid(pactid) //計算中の履歴を作る
	{
		if (false == this.beginDB()) {
			return false;
		}

		if (false == this.m_O_hist.insert(pactid, this.m_year, this.m_month)) {
			this.endDB(false);
			return false;
		}

		if (false == this.endDB(true)) {
			return false;
		}

		if (false == this.beginDB()) {
			return false;
		}

		return true;
	}

	executePactid(pactid, logpath) //tel_bill_X_tb更新型の作成
	//bill_X_tb更新型の作成
	//既存レコードの削除
	{
		var no = this.getTableNo();
		var ins_tel_bill = new TableInserter(this.m_listener, this.m_db, logpath + this.m_O_name.getName("bill", no) + ".insert", true);
		var tel_bill = new UpdateBillItem(this.m_listener, this.m_db, this.m_table_no, this.m_O_name, ins_tel_bill);
		var bill = new UpdateBillPost(this.m_listener, this.m_db, this.m_table_no, this.m_O_name);

		if (false == tel_bill.delete(pactid, this.m_year, this.m_month, logpath + this.m_O_name.getName("bill", no) + ".delete")) {
			return false;
		}

		if (false == bill.delete(pactid, this.m_year, this.m_month, logpath + this.m_O_name.getName("postbill", no) + ".delete")) {
			return false;
		}

		if (false == tel_bill.execute(pactid, this.m_year, this.m_month)) {
			return false;
		}

		if (false == bill.execute(pactid, this.m_year, this.m_month)) {
			return false;
		}

		return true;
	}

	endPactid(pactid, status) //通常のトランザクション終了
	{
		if (false == this.endDB(status)) {
			return false;
		}

		if (false == this.beginDB()) {
			return false;
		}

		var is_fail = !status;

		if (false == this.m_O_hist.update(pactid, this.m_year, this.m_month, is_fail)) {
			this.endDB(false);
			return false;
		}

		if (false == this.endDB(true)) {
			return false;
		}

		return true;
	}

};

//日本語のプロセス名
//定数一覧
//UpdateBillHistoryインスタンス
//処理中の顧客ID(ログ出力用)
//処理中の年(ログ出力用)
//処理中の月(ログ出力用)
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//日本語のプロセス名
//機能：このプロセスの日本語処理名を返す
//機能：プロセスを初期化する
//機能：定数名を設定する
//機能：現在処理中の顧客IDを返す
//備考：特定の顧客を処理中で無い場合は、ゼロを返す
//機能：現在処理中の年月を返す(yyyy/mm形式)
//備考：特定の年月を処理していない場合は空文字列を返す
//機能：処理すべきデータが無ければfalseを返す
//備考：エラーがあってもログを出さず処理を継続する
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：再計算を行う
//引数：計算パラメータ{pactid,year,month}
//ログ出力先
//返値：深刻なエラーが発生したらfalseを返す
class ProcessRecalcBase extends ProcessBase {
	constructor(procname, logpath, opentime, procname_long) {
		super(procname, logpath, opentime);
		this.m_O_name = new UpdateBillName(this.m_listener, this.m_db, this.m_table_no);
		this.m_procname_long = procname_long;
	}

	getProcname() {
		return this.m_procname_long;
	}

	initHist() {
		this.initName();
		this.m_O_hist = new UpdateBillHistory(this.m_listener, this.m_db, this.m_table_no, this.m_O_name, "", true);
	}

	initName() //派生型で実装する
	//this->m_O_name->initPurchaseかinitCopyのどちらかを実行する
	{}

	getCurrentPactid() {
		return this.m_cur_pactid;
	}

	getCurrentMonth() {
		return this.m_cur_year + "/" + this.m_cur_month;
	}

	isRequest() {
		return 0 < this.m_O_hist.getLimit();
	}

	do_execute() //処理回数
	{
		var count = 0;
		var all_status = true;

		for (; true; ++count) //計算要求を取り出す
		//ログ保存先フォルダを作成する
		//計算要求のステータスを計算中に変更する
		//計算要求のステータスを計算終了にする
		{
			if (false == this.beginDB()) {
				return false;
			}

			var H_param = Array();
			this.m_O_hist.get(H_param, count, this.m_debugflag);

			if (0 == count(H_param)) {
				if (false == this.endDB(false)) {
					return false;
				}

				break;
			}

			this.m_cur_pactid = H_param.pactid;
			this.m_cur_year = H_param.year;
			this.m_cur_month = H_param.month;
			var log = new ProcessLog();
			log.setPath(this.m_listener, this.m_curpath, H_param.pactid + "_" + sprintf("%04d%02d", H_param.year, H_param.month) + "/");
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(log);
			this.m_listener.putListener(this.m_listener_error);
			this.putError(G_SCRIPT_BEGIN, "\u518D\u8A08\u7B97\u958B\u59CB" + H_param.pactid + "," + H_param.year + H_param.month);
			this.m_O_hist.start(H_param);

			if (false == this.endDB(true)) {
				return false;
			}

			if (false == this.beginDB()) {
				return false;
			}

			var status = this.executeParam(H_param, log.m_path);
			this.m_O_hist.update(H_param.pactid, H_param.year, H_param.month, !status);

			if (false == this.endDB(status)) {
				return false;
			}

			this.putError(G_SCRIPT_BEGIN, "\u518D\u8A08\u7B97\u7D42\u4E86" + H_param.pactid + "," + H_param.year + H_param.month);
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(this.m_listener_process);
			this.m_listener.putListener(this.m_listener_error);
			all_status &= status;
			delete log;

			if (false == status) {
				return status;
			}

			this.m_cur_pactid = 0;
			this.m_cur_year = 0;
			this.m_cur_month = 0;
		}

		return all_status;
	}

	executeParam(H_param, logpath) //tel_bill_X_tb更新型の作成
	//bill_X_tb更新型の作成
	//既存レコードの削除
	{
		var pactid = H_param.pactid;
		var year = H_param.year;
		var month = H_param.month;
		var no = this.m_table_no.get(year, month);
		var ins_tel_bill = new TableInserter(this.m_listener, this.m_db, logpath + this.m_O_name.getName("bill", no) + ".insert", true);
		var tel_bill = new UpdateBillItem(this.m_listener, this.m_db, this.m_table_no, this.m_O_name, ins_tel_bill);
		var bill = new UpdateBillPost(this.m_listener, this.m_db, this.m_table_no, this.m_O_name);

		if (false == tel_bill.delete(pactid, year, month, logpath + this.m_O_name.getName("bill", no) + ".delete")) {
			return false;
		}

		if (false == bill.delete(pactid, year, month, logpath + this.m_O_name.getName("postbill", no) + ".delete")) {
			return false;
		}

		if (false == tel_bill.execute(pactid, year, month)) {
			return false;
		}

		if (false == bill.execute(pactid, year, month)) {
			return false;
		}

		return true;
	}

};