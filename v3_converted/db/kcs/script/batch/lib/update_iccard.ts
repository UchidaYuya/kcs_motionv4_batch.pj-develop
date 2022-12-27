//===========================================================================
//機能：交通費の集計を行う
//
//作成：森原
//===========================================================================
//会社単位の交通費集計権限
//---------------------------------------------------------------------------
//機能：締め日・集計日の型
//備考：年月日のハッシュは以下の形式
//array(
//"year" => 年,
//"month" => 月,
//"date" => 日,
//);
//日を使わない場合もある。

require("update_bill_item.php");

const AUTH_ICCARD_CO = 148;

//元の締め日
//元の集計日
//補正日数
//機能：コンストラクタ
//引数：元の締め日
//元の集計日
//補正日数
//機能：パラメータを設定する
//引数：元の締め日
//元の集計日
//補正日数
//機能：年月日のハッシュを組み立てる
//引数：年
//月
//日
//機能：補正前の今日の日付を返す
//機能：補正後の今日の日付を返す
//機能：前月パターンならtrueを返す(集計日が翌月)
//機能：月末補正した締め日を返す
//引数：年月日のハッシュに締め日を設定して返す
//機能：月末補正した集計日を返す
//引数：年月日のハッシュに集計日を設定して返す
//機能：月末補正した日付を返す
//引数：年月日のハッシュを受け取って、日付を補正して返す
//機能：日付を補正する
//引数：年月日のハッシュを受け取って、年月日を補正して返す
//補正日数
//返値：無し
//機能：年月を受け取って、月末の日付を返す
//引数：年月日のハッシュ(日は使わない)
//返値：月末の日付を返す
//機能：来月の年月にする
//引数：年月日のハッシュ(日は使わない)を変更して返す
//機能：前月の年月にする
//引数：年月日のハッシュ(日は使わない)を変更して返す
//機能：指定された年月の締め日を、ハッシュ形式で返す
//引数：年月日のハッシュ
//締め日からの補正日数
//備考：前月パターンなら、前月の締め日を返す
//デフォルトで、締め日の次の日を返す
//機能：指定された年月の締め日を、SQLの日付形式で返す
//引数：年月日のハッシュ
//締め日からの補正日数
//備考：前月パターンなら、前月の締め日を返す
//デフォルトで、締め日の次の日を返す
//機能：今日が締め日動作ならtrueを返す
//引数：年月日ハッシュ
//機能：今日が集計日動作ならtrueを返す
//引数：年月日ハッシュ
//前月ならtrue
class CloseFunctionType {
	constructor(close = 0, calc = 0, diff = 0) {
		this.set(close, calc, diff);
	}

	set(close = 0, calc = 0, diff = 0) {
		this.m_close = close;
		this.m_calc = calc;
		this.m_diff = diff;
	}

	createYMD(year, month, date) {
		return {
			year: year,
			month: month,
			date: date
		};
	}

	getTodayRaw() {
		return this.createYMD(date("Y"), date("n"), date("j"));
	}

	getToday() {
		var H_ymd = this.getTodayRaw();
		this.moveDate(H_ymd, this.m_diff);
		return H_ymd;
	}

	isInvert() {
		return this.m_calc < this.m_close;
	}

	getClose(H_ymd: {} | any[]) {
		H_ymd.date = this.m_close;
		this.touchDate(H_ymd);
	}

	getCalc(H_ymd: {} | any[]) {
		H_ymd.date = this.m_calc;
		this.touchDate(H_ymd);
	}

	touchDate(H_ymd: {} | any[]) //この月の月末の日付を取得する
	//補正する日付が月末以降なら月末を返す
	{
		var last = this.LastDateOfMonth(H_ymd);
		if (last < H_ymd.date) H_ymd.date = last;
	}

	moveDate(H_ymd: {} | any[], diff) //タイムスタンプにする
	//補正日数を加算する
	//年月日をタイムスタンプから取り出す
	{
		var tm = mktime(0, 0, 0, H_ymd.month, H_ymd.date, H_ymd.year);
		tm += diff * 24 * 3600;
		H_ymd.year = date("Y", tm);
		H_ymd.month = date("n", tm);
		H_ymd.date = date("j", tm);
	}

	LastDateOfMonth(H_ymd: {} | any[]) //来月にする
	//一日前の日付にする
	//日付を返す
	{
		this.incMonth(H_ymd);
		H_ymd.date = 1;
		this.moveDate(H_ymd, -1);
		return H_ymd.date;
	}

	incMonth(H_ymd: {} | any[]) {
		H_ymd.month = H_ymd.month + 1;

		if (13 == H_ymd.month) {
			H_ymd.year = H_ymd.year + 1;
			H_ymd.month = 1;
		}
	}

	decMonth(H_ymd: {} | any[]) {
		H_ymd.month = H_ymd.month - 1;

		if (0 == H_ymd.month) {
			H_ymd.year = H_ymd.year - 1;
			H_ymd.month = 12;
		}
	}

	getCloseHash(H_ymd: {} | any[], diff = 1) //前月パターンなら前月とする
	//締め日を補正する
	{
		if (this.isInvert()) this.decMonth(H_ymd);
		this.getClose(H_ymd);
		this.moveDate(H_ymd, diff);
		return H_ymd;
	}

	getCloseSQL(H_ymd: {} | any[], diff = 1) //SQL形式にして返す
	{
		H_ymd = this.getCloseHash(H_ymd, diff);
		return "'" + H_ymd.year + "/" + H_ymd.month + "/" + H_ymd.date + " 00:00:00+09'";
	}

	isClose(H_ymd: {} | any[]) {
		return 1 == H_ymd.date;
	}

	isCalc(H_ymd: {} | any[], is_last) //前月
	//開始日から終了日に、今日の日付が含まれるか調査する
	{
		if (is_last) //前月の集計日を取り出す
			//前月の集計日の翌日を求める
			//それが今日の日付ならtrueを返す
			{
				var H_last = H_ymd;
				this.decMonth(H_last);
				this.getCalc(H_last);
				this.moveDate(H_last, 1);
				return H_last.year == H_ymd.year && H_last.month == H_ymd.month && H_last.date == H_ymd.date;
			}

		var H_start = Array();
		var H_end = Array();

		if (this.isInvert()) //前月パターン/月初から、集計日の翌日まで
			{
				H_start = H_ymd;
				H_start.date = 1;
				H_end = H_ymd;
				this.getCalc(H_end);
				this.moveDate(H_end, 1);
			} else //当月パターン/締め日の翌日から、集計日の翌日まで
			{
				H_start = H_ymd;
				this.getClose(H_start);
				this.moveDate(H_start, 1);
				H_end = H_ymd;
				this.getCalc(H_end);
				this.moveDate(H_end, 1);
			}

		var start = mktime(0, 0, 0, H_start.month, H_start.date, H_start.year);
		var end = mktime(0, 0, 0, H_end.month, H_end.date, H_end.year);
		var ymd = mktime(0, 0, 0, H_ymd.month, H_ymd.date, H_ymd.year);
		return start <= ymd && ymd <= end;
	}

};

//締め日機能型
//機能：何もしないコンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：交通費用の定数表を作る
//機能：交通費の集計を行う顧客ならtrueを返す
//引数：顧客ID
//機能：現在のトップの部署を返す
//引数：顧客ID
//機能：トップの部署を返す
//引数：顧客ID
//年
//月
//機能：トップの部署を返す
//引数：顧客ID
//部署連携テーブル名
//機能：締め日・集計日を読み出す
//引数：顧客ID
//現在の日付からの差分日数
//備考：差分日数は、エラーチェックのみに用いられ、
//返される日付はcard_close_tbから読み出された日付である
//機能：今日が締め日ならtrueを返す
//機能：今日が集計日ならtrueを返す
//引数：前月ならtrue
class UpdateBillNameICCard extends UpdateBillName {
	constructor(listener, db, table_no) {
		super(listener, db, table_no);
		this.m_O_close = new CloseFunctionType();
	}

	initICCard() {
		this.m_H_name = {
			history: "iccard_bill_history_tb",
			history_coid: "iccardcoid",
			details: "iccard_history_%X_tb",
			details_coid: "iccardcoid",
			details_id: "iccardid",
			bill: "iccard_bill_%X_tb",
			bill_coid: "iccardcoid",
			bill_id: "iccardid",
			kamoku: "",
			utiwake: "",
			utiwake_coid: "",
			rel: "",
			rel_coid: "",
			xxx: "iccard_%X_tb",
			xxx_coid: "iccardcoid",
			xxx_key: "iccardid",
			co: "iccard_co_tb",
			co_coid: "iccardcoid",
			postbill: "iccard_post_bill_%X_tb",
			postbill_coid: "iccardcoid",
			postbill_num: "",
			add_column: ""
		};
		this.m_H_setting = {
			A_code_excise: Array(),
			kamokuid_excise: -1,
			coid_all: 0,
			kamokuid_default: -1,
			kamokuid_limit: 0,
			code_asp: "",
			code_asx: ""
		};
	}

	isICCard(pactid) {
		var sql = "select count(*) from fnc_relation_tb where pactid=" + pactid + " and fncid=" + AUTH_ICCARD_CO + ";";
		return 0 < this.m_db.getOne(sql);
	}

	getTopPostidCurrent(pactid) {
		return this.getTopPostidNo(pactid, "post_relation_tb");
	}

	getTopPostid(pactid, year, month) {
		var no = this.getTableNo(year, month);
		return this.getTopPostidNo(pactid, "post_relation_" + no + "_tb");
	}

	getTopPostidNo(pactid, table_name) {
		var sql = "select postidparent from " + table_name + " where pactid=" + pactid + " and level=0" + ";";
		var line = this.m_db.getAll(sql);

		if (!line.length || !line[0].length) {
			this.putError(G_SCRIPT_WARNING, "\u30C8\u30C3\u30D7\u306E\u90E8\u7F72\u304C\u7121\u3044/table_name:=" + table_name);
			return -1;
		}

		return line[0][0];
	}

	getClose(pactid, diff) {
		var sql = "select closeday,calcday from iccard_close_tb" + " where pactid=" + pactid;
		sql += ";";
		var line = this.m_db.getAll(sql);

		if (!line.length || line[0].length < 2 || !(undefined !== line[0][0]) || !(undefined !== line[0][1]) || !line[0][0].length || !line[0][1].length || !is_numeric(line[0][0]) || !is_numeric(line[0][1])) {
			this.putError(G_SCRIPT_WARNING, "\u7DE0\u3081\u65E5\u30FB\u96C6\u8A08\u65E5\u304C\u7121\u3044/pactid:=" + pactid);
			return Array();
		}

		if (line[0][0] <= 0 || line[0][1] <= 0) {
			this.putError(G_SCRIPT_WARNING, "\u7DE0\u3081\u65E5\u30FB\u96C6\u8A08\u65E5\u304C\u30BC\u30ED\u4EE5\u4E0B" + "/pactid:=" + pactid + "/\u7DE0\u3081\u65E5:=" + line[0][0] + "/\u96C6\u8A08\u65E5:=" + line[0][1]);
			return Array();
		}

		this.m_O_close.set(line[0][0], line[0][1], diff);
		this.putError(G_SCRIPT_DEBUG, (this.m_O_close.isInvert() ? "\u524D\u6708\u30D1\u30BF\u30FC\u30F3" : "\u5F53\u6708\u30D1\u30BF\u30FC\u30F3") + "/pactid:=" + pactid + "/\u7DE0\u3081\u65E5:=" + line[0][0] + "/\u96C6\u8A08\u65E5:=" + line[0][1]);
		this.putError(G_SCRIPT_DEBUG, "\u30D0\u30C3\u30C1\u306F" + this.m_O_close.getToday().join("/") + "\u3068\u3057\u3066\u5B9F\u884C");
		return line[0];
	}

	isClose() {
		return this.m_O_close.isClose(this.m_O_close.getToday());
	}

	isCalc(is_last) {
		return this.m_O_close.isCalc(this.m_O_close.getToday(), is_last);
	}

};

//データ挿入型
//データベースのテーブルやカラムの名称
//「全て」を表すキャリアID
//すべてのキャリアID(「全て」を含まない)
//pactid => carid => array(ASP利用料, ASP消費税)
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//データベースのテーブルやカラムの名称
//データ挿入型
//機能：データベースのテーブルやカラムの名称を取り出す
//引数：キー
//テーブル番号
//機能：事前にASP利用料を決定する
//引数：顧客ID
//返値：ASP権限があるのにASP利用料が無ければfalseを返す
//機能：ユーザ単位の請求情報を削除する
//引数：顧客ID
//年
//月
//ファイル名
//返値：深刻なエラーが発生したらfalseを返す
//機能：締め日と集計の操作を行う
//引数：顧客ID
//年
//月
//締め日の処理を行うならtrue
//当月の集計の処理を行うならtrue
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：締め日の操作を行う
//引数：顧客ID
//移動先のテーブル番号
//返値：深刻なエラーが発生したらfalseを返す
//機能：postid,username,employeecodeをカードテーブルに反映する
//引数：顧客ID
//テーブル番号
//返値：深刻なエラーが発生したらfalseを返す
//機能：iccard_X_tbのpostidに混在があれば処理を打ち切る
//引数：顧客ID
//テーブル番号
//年
//月
//返値：混在があればtrueを返す
//機能：post_relation_X_tbにレコードが一件もなければ、順送りの一部を行う
//引数：顧客ID
//テーブル番号
//返値：深刻なエラーが発生したらfalseを返す
//機能：カードテーブルのpostidがpost_relation_X_tbに無ければトップとする
//引数：顧客ID
//テーブル番号
//トップの部署ID
//返値：深刻なエラーが発生したらfalseを返す
//機能：明細からユーザ単位の集計を行う
//引数：顧客ID
//テーブル番号
//返値：深刻なエラーが発生したらfalseを返す
class UpdateBillICCard extends ScriptDBAdaptor {
	constructor(listener, db, table_no, O_name, inserter) //全ての会社IDを読み出す
	{
		super(listener, db, table_no);
		this.m_inserter = inserter;
		this.m_inserter.setUnlock();
		this.m_O_name = O_name;
		this.m_H_asp = Array();
		this.m_coid_all = O_name.getSetting("coid_all");
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

	initAsp(pactid) //ASP権限があるか
	//ASP利用料の欠落が無いかチェックする
	{
		this.m_H_asp[pactid] = Array();

		for (var coid of Object.values(this.m_A_coid)) this.m_H_asp[pactid][coid] = [0, 0];

		var sql = "select count(*) from fnc_relation_tb where pactid=" + pactid + " and fncid=" + G_AUTH_ASP + ";";

		if (!this.m_db.getOne(sql)) //権限がないのでASP利用料はゼロでtrueを返す
			{
				this.putError(G_SCRIPT_INFO, "ASP\u4F7F\u7528\u6599\u6A29\u9650\u7121\u3057/pactid:=" + pactid);
				return true;
			}

		sql = "select iccardcoid,charge from iccard_asp_charge_tb" + " where pactid=" + pactid + ";";
		var result = this.m_db.getHash(sql);
		var A_ready = Array();

		for (var H_line of Object.values(result)) {
			var coid = H_line.iccardcoid;
			var charge = H_line.charge;
			var excise = +(charge * G_EXCISE_RATE);
			this.m_H_asp[pactid][coid] = [charge, excise];
			A_ready.push(coid);
		}

		var A_lack = Array();

		for (var coid of Object.values(this.m_A_coid)) if (!(-1 !== A_ready.indexOf(coid))) A_lack.push(coid);

		if (!A_lack.length) return true;
		this.putError(G_SCRIPT_WARNING, "ASP\u5229\u7528\u6A29\u9650\u304C\u3042\u308B\u304C\u3001asp\u4F7F\u7528\u6599\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044" + "/pactid:=" + pactid + "/iccardcoid:=" + A_lack.join(","));
		return false;
	}

	delete(pactid, year, month, fname) {
		var no = this.getTableNo(year, month);
		var sqlfrom = " from iccard_bill_" + no + "_tb" + " where pactid=" + this.escape(pactid);

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

	execute(pactid, year, month, is_close, is_calc) {
		var no = this.getTableNo(year, month);

		if (is_close) //締め日の処理を行う
			//明細を移動させる
			{
				if (!this.executeClose(pactid, no)) return false;
				if (!this.updatePostidUserName(pactid, no)) return false;
			}

		if (is_calc) //iccard_X_tbのpostidに混在があれば処理を打ち切る
			//挿入の準備をする
			{
				if (this.isBadPostid(pactid, no, year, month)) return false;
				if (!this.Changeover(pactid, no)) return false;
				var toppostid = this.m_O_name.getTopPostid(pactid, year, month);
				if (-1 == toppostid) return false;
				if (!this.UpdateLostPostid(pactid, no, toppostid)) return false;
				var table_no = "iccard_bill_" + no + "_tb";

				if (!this.m_inserter.begin(table_no)) {
					this.putError(G_SCRIPT_WARNING, "\u30C7\u30FC\u30BF\u633F\u5165\u306E\u6E96\u5099\u306B\u5931\u6557/pactid:=" + pactid + "/year:=" + year + "/month:=" + month + "/table:=" + table_no);
					return false;
				}

				if (!this.executeCalc(pactid, no)) return false;

				if (!this.m_inserter.end()) {
					this.putError(G_SCRIPT_WARNING, "\u30C7\u30FC\u30BF\u633F\u5165\u306B\u5931\u6557/pactid:=" + pactid + "/year:=" + year + "/month:=" + month + "/table:=" + table_no);
					return false;
				}
			}

		return true;
	}

	executeClose(pactid, no) //移動元と移動先のカード情報テーブル
	//移動元と移動先の明細テーブル
	//締め日を取り出す
	//SQLの条件にする(ANDは含まない)
	//移動が必要な明細をリストアップする
	{
		var from_iccard = "iccard_tb";
		var to_iccard = "iccard_" + no + "_tb";
		var from_history = "iccard_history_tb";
		var to_history = "iccard_history_" + no + "_tb";
		var close = this.m_O_name.m_O_close.getCloseSQL(this.m_O_name.m_O_close.getToday());
		var close_cond = "usedate<" + close;
		var sql = "select pactid,iccardid,iccardcoid" + ",case when handflg then 1 else 0 end as handflg" + " from " + from_history + " where pactid=" + pactid + " and fixflg=true" + " and " + close_cond + " and exists (" + " select * from " + from_iccard + " where iccard_history_tb.pactid=iccard_tb.pactid" + " and iccard_history_tb.iccardcoid=iccard_tb.iccardcoid" + " and iccard_history_tb.iccardid=iccard_tb.iccardid" + " and iccard_history_tb.handflg=iccard_tb.handflg" + " )" + " group by pactid,iccardid,iccardcoid,handflg" + ";";
		var result_all = this.m_db.getHash(sql);

		for (var H_info of Object.values(result_all)) //移動先のカード情報テーブルに既にカードがあるか
		//コピーが必要な明細を取り出すWHERE節を作る
		//コピーが必要な明細のfixdateを更新する
		//明細をコピーする
		//未確定から明細を削除する
		{
			var sql_where = "" + " where pactid=" + H_info.pactid + " and iccardid='" + H_info.iccardid + "'" + " and iccardcoid=" + H_info.iccardcoid + " and handflg=" + (H_info.handflg ? "true" : "false");
			sql = "select count(*) from " + to_iccard + sql_where + ";";

			if (!this.m_db.getOne(sql)) //カード情報をコピーする
				//コピーしたカード情報のfixdateを更新する
				{
					sql = "insert into " + to_iccard + " select * from " + from_iccard + sql_where + ";";
					this.putError(G_SCRIPT_SQL, sql);
					this.m_db.query(sql);
					sql = "update " + to_iccard + " set fixdate='" + date("Y-m-d H:i:s") + "'" + sql_where + ";";
					this.putError(G_SCRIPT_SQL, sql);
					this.m_db.query(sql);
				} else //削除済みのカード情報が無いか確認する
				{
					sql = "select count(*) from " + to_iccard + sql_where + " and coalesce(delflg,false)=true" + ";";

					if (this.m_db.getOne(sql)) //削除フラグを落とす
						{
							sql = "update " + to_iccard + " set delflg=false" + ",fixdate='" + date("Y-m-d H:i:s") + "'" + sql_where + " and coalesce(delflg,false)=true" + ";";
							this.putError(G_SCRIPT_SQL, sql);
							this.m_db.query(sql);
						}
				}

			var sql_where_history = sql_where + " and fixflg=true" + " and " + close_cond + " and not exists(" + " select * from " + to_history + " where " + from_history + ".pactid=" + to_history + ".pactid" + " and " + from_history + ".iccardid=" + to_history + ".iccardid" + " and " + from_history + ".iccardcoid=" + to_history + ".iccardcoid" + " and " + from_history + ".uniqueid=" + to_history + ".uniqueid" + " and " + from_history + ".handflg=" + to_history + ".handflg" + ")";
			sql = "update " + from_history + " set fixdate='" + date("Y-m-d H:i:s") + "'" + sql_where_history + ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
			sql = "insert into " + to_history + " select * from " + from_history + sql_where_history + ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
			sql = "delete from " + from_history + sql_where + " and fixflg=true" + " and " + close_cond + ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	updatePostidUserName(pactid, no) //postidの反映が必要なリストを作る
	//カードテーブルにユーザテーブルをJOINして、
	//カードテーブルとユーザテーブルの部署IDが食い違うリストを作る
	//ユーザテーブル側が存在しない場合は変更しない
	//コピーが必要なカラム名
	//カラム名に対してループする
	{
		var to_iccard = "iccard_" + no + "_tb";
		var sql = "select card_tb.pactid as pactid,iccardid,iccardcoid" + ",(case when handflg then 1 else 0 end) as handflg" + ",user_tb.postid as postid" + " from " + to_iccard + " as card_tb" + " left join user_tb" + " on card_tb.pactid=user_tb.pactid" + " and card_tb.userid=user_tb.userid" + " where card_tb.pactid=" + pactid + " and user_tb.postid is not null" + " and user_tb.postid!=card_tb.postid" + ";";
		var result_all = this.m_db.getHash(sql);

		for (var H_info of Object.values(result_all)) //postid変更が必要なカードテーブルの部署IDを書き換える
		{
			sql = "update " + to_iccard + " set postid=" + H_info.postid + ",fixdate='" + date("Y-m-d H:i:s") + "'" + " where pactid=" + H_info.pactid + " and iccardid='" + H_info.iccardid + "'" + " and iccardcoid=" + H_info.iccardcoid + " and handflg=" + (H_info.handflg ? "true" : "false") + ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		var A_A_setting = ["username", "employeecode"];

		for (var column of Object.values(A_A_setting)) //反映が必要なリストを作る
		//カードテーブルにユーザテーブルをJOINして、
		//カードテーブルとユーザテーブルのカラムが食い違うリストを作る
		//ユーザテーブル側が存在しない場合は変更しない
		{
			sql = "select card_tb.pactid as pactid,iccardid,iccardcoid" + ",(case when handflg then 1 else 0 end) as handflg" + ",user_tb." + column + " as " + column + " from " + to_iccard + " as card_tb" + " left join user_tb" + " on card_tb.pactid=user_tb.pactid" + " and card_tb.userid=user_tb.userid" + " where card_tb.pactid=" + pactid + " and user_tb." + column + " is not null" + " and user_tb." + column + "!=card_tb." + column + ";";
			result_all = this.m_db.getHash(sql);

			for (var H_info of Object.values(result_all)) //変更が必要なカードテーブルのカラムを書き換える
			{
				sql = "update " + to_iccard + " set " + column + "='" + this.m_db.escape(H_info[column]) + "'" + ",fixdate='" + date("Y-m-d H:i:s") + "'" + " where pactid=" + H_info.pactid + " and iccardid='" + H_info.iccardid + "'" + " and iccardcoid=" + H_info.iccardcoid + " and handflg=" + (H_info.handflg ? "true" : "false") + ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
			}
		}

		return true;
	}

	isBadPostid(pactid, no, year, month) //userid,postidでグループ化して、複数のpostidがあるuseridを選び出す
	{
		var sql = "select userid from(";
		sql += " select userid,postid from iccard_" + no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " group by userid,postid";
		sql += ") as sub_tb group by userid having count(*)>1";
		sql += ";";
		var result = this.m_db.getAll(sql);
		if (!result) return false;
		var msg = "";

		for (var A_line of Object.values(result)) {
			if (msg.length) msg += ",";
			msg += A_line[0];
		}

		this.putError(G_SCRIPT_WARNING, "\u30E6\u30FC\u30B6ID\u306B\u8907\u6570\u306Epostid\u304C\u5B58\u5728\u3059\u308B(pactid:=" + pactid + "/year:=" + year + "/month:=" + month + "/table:=iccard_" + no + "_tb" + "/userid:=" + msg + ")");
		return true;
	}

	Changeover(pactid, no) //post_X_tbにレコードがあるか確認する
	//post_relation_X_tbにレコードがあるか確認する
	//レコードがなければコピーする
	{
		var to_post = "post_" + no + "_tb";
		var to_rel = "post_relation_" + no + "_tb";
		var from_post = "post_tb";
		var from_rel = "post_relation_tb";
		var sql = "select count(*) from " + to_post + " where pactid=" + pactid + ";";
		var count_post = this.m_db.getOne(sql);
		sql = "select count(*) from " + to_rel + " where pactid=" + pactid + ";";
		var count_rel = this.m_db.getOne(sql);

		if (0 == count_rel) //post_X_tbにレコードがあれば、事前に削除する
			//post_relation_X_tbにpost_tbをコピーする
			{
				if (0 < count_post) {
					sql = "delete from " + to_post + " where pactid=" + pactid + ";";
					this.putError(G_SCRIPT_SQL, sql);
					this.m_db.query(sql);
				}

				sql = "insert into " + to_post + " select * from " + from_post + " where pactid=" + pactid + ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
				sql = "insert into " + to_rel + " select * from " + from_rel + " where pactid=" + pactid + ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
			}

		return true;
	}

	UpdateLostPostid(pactid, no, toppostid) //存在しない部署IDをトップの部署IDにする
	{
		var to_iccard = "iccard_" + no + "_tb";
		var to_rel = "post_relation_" + no + "_tb";
		var sql = "update " + to_iccard + " set postid=" + toppostid + ",fixdate='" + date("Y-m-d H:i:s") + "'" + " where pactid=" + pactid + " and postid not in (" + "select postidchild from " + to_rel + " where pactid=" + pactid + ")" + ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	executeCalc(pactid, no) //明細をユーザ単位に集計した値を取り出す
	{
		var H_asp = Array();
		if (undefined !== this.m_H_asp[pactid]) H_asp = this.m_H_asp[pactid];
		var sql = "select userid,username from iccard_" + no + "_tb" + " where pactid=" + pactid + " and username is not null" + " and length(username)>0" + " order by fixdate" + ";";
		var result_all = this.m_db.getHash(sql);
		var H_user = Array();

		for (var H_line of Object.values(result_all)) H_user[H_line.userid] = H_line.username;

		sql = "select i_tb.pactid as pactid" + ",i_tb.postid as postid" + ",i_tb.userid as userid" + ",h_tb.iccardcoid as iccardcoid" + ",sum(h_tb.charge) as charge" + " from iccard_history_" + no + "_tb as h_tb" + " left join iccard_" + no + "_tb as i_tb" + " on h_tb.pactid=i_tb.pactid" + " and h_tb.iccardid=i_tb.iccardid" + " and h_tb.iccardcoid=i_tb.iccardcoid" + " and h_tb.handflg=i_tb.handflg" + " where h_tb.pactid=" + pactid + " and coalesce(h_tb.delflg,false)=false" + " and coalesce(i_tb.delflg,false)=false" + " and i_tb.pactid is not null" + " group by i_tb.pactid,i_tb.postid,i_tb.userid" + ",h_tb.iccardcoid" + " order by i_tb.pactid,i_tb.postid,i_tb.userid" + ",h_tb.iccardcoid" + ";";
		result_all = this.m_db.getHash(sql);

		for (var H_src of Object.values(result_all)) //この会社のASPを取り出す
		//挿入する
		//ユーザ名を設定する
		{
			var A_asp = [0, 0];
			if (undefined !== H_asp[H_src.iccardcoid]) A_asp = H_asp[H_src.iccardcoid];
			var aspcharge = undefined !== A_asp[0] ? A_asp[0] : 0;
			var aspexcise = undefined !== A_asp[1] ? A_asp[1] : 0;
			var H_tgt = H_src;
			H_tgt.recdate = "now()";
			H_tgt.aspcharge = aspcharge;
			H_tgt.aspexcise = aspexcise;
			H_tgt.username = undefined !== H_user[H_src.userid] ? H_user[H_src.userid] : "";
			if (!this.m_inserter.insert(H_tgt)) return false;
		}

		return true;
	}

};

//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//データベースのテーブルやカラムの名称
//機能：集計対象のカラム名を返す(回線数を除く)
class UpdateBillPostICCard extends UpdateBillPost {
	constructor(listener, db, table_no, O_name) {
		super(listener, db, table_no, O_name);
	}

	getColumn() {
		var A_keys = "charge,aspcharge,aspexcise".split(",");
		return A_keys;
	}

};