//
//請求情報用汎用関数集
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Base
//@subpackage Bill
//@author houshiyama
//@filesource
//@since 2008/02/27
//@uses MtDBUtil
//@uses TableMake
//@uses MakeMonthlyBar
//@uses MakePageLink
//@uses MakePankuzuLink
//
//
//
//請求情報用汎用関数集
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Base
//@subpackage Bill
//@author houshiyama
//@filesource
//@since 2008/02/27
//@uses MtDBUtil
//@uses TableMake
//@uses MakeMonthlyBar
//@uses MakePageLink
//@uses MakePankuzuLink
//

require("MtUtil.php");

const FNC_BILL_RESTRICTION = 270;
const FNC_BILL_RESTRICTION_CANCEL = 271;

///kcs/conf_sync/bill.iniの内容
//対象顧客の権限を格納しておく
//対象ユーザーの権限を格納しておく
//bill_restriction_tb;
//
//コンストラクタ <br>
//
//DBオブジェクトと契約IDの取得 <br>
//
//@author houshiyama
//@since 2008/03/04
//
//@param mixed $O_db
//@param mixed $pactid
//@access public
//@return void
//
//
//表示タイプを返す（購買）
//
//@author houshiyama
//@since 2008/02/25
//
//@access public
//@return array
//
//
//表示タイプを返す（コピー機）
//
//@author houshiyama
//@since 2008/07/10
//
//@access public
//@return array
//
//
//表示タイプを返す（運送）
//
//@author houshiyama
//@since 2010/02/25
//
//@access public
//@return array
//
//
//表示タイプを返す（EV）
//
//@author miyazawa
//@since 2010/07/16
//
//@access public
//@return array
//
//
//表示タイプを返す（運送）
//
//@author date
//@since 2015/06/10
//
//@access public
//@return array
//
//
//数値条件のプルダウンを返す
//
//@author houshiyama
//@since 2008/03/25
//
//@access public
//@return void
//
//
//フォームの入力を日付型に整形する
//
//@author houshiyama
//@since 2008/03/13
//
//@param mixed $A_date
//@access public
//@return void
//
//
//getBillIni
//
//@author 伊達
//@since 2019/04/16
//
//@param mixed $pactid
//@access public
//@return void
//
//
//isAuthPact
//対象の会社に権限がついているか返す
//@author web
//@since 2019/04/19
//
//@param mixed $pactid
//@param mixed $fncid
//@access public
//@return void
//
//
//isAuthUser
//対象のユーザーの権限チェック
//@author web
//@since 2019/04/19
//
//@param mixed $pactid
//@param mixed $fncid
//@access public
//@return void
//
//
//getIniValue
//iniの値を返す
//@author 伊達
//@since 2019/05/31
//
//@param mixed $pactid
//@param mixed $key
//@param mixed $default
//@access private
//@return void
//
//
//getSumBillBack
//
//当月の請求がない場合、過去〇か月遡って請求のある月を表示する
//↑の〇の部分を返す
//
//@author 伊達
//@since 2019/05/31
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getMonthAddSum
//電話請求の年月バーのずれを取得する
//@author web
//@since 2019/04/17
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getFixedMonthSum
//確定月の加算値取得する
//@author web
//@since 2019/04/19
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getFixedDaySum
//確定日を取得する
//@author web
//@since 2019/04/18
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getFixedSumTime
//対象年月の確定日timeを取得する
//@author web
//@since 2019/04/26
//
//@param mixed $pactid
//@param mixed $tgt_year
//@param mixed $tgt_month
//@access public
//@return void
//
//
//isFixedSum
//対象月の請求が確定日を過ぎているかチェックする
//@author web
//@since 2019/05/09
//
//@param mixed $pactid
//@param mixed $userid
//@param mixed $tgt_year
//@param mixed $tgt_month
//@access public
//@return void
//
//
//getTelBillBack
//
//当月の請求がない場合、過去〇か月遡って請求のある月を表示する
//↑の〇の部分を返す
//
//@author 伊達
//@since 2019/05/31
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getMonthAddTel
//電話請求の年月バーのずれを取得する
//@author web
//@since 2019/04/17
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getFixedDayTel
//確定日を取得する
//@author web
//@since 2019/04/18
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getFixedMonthTel
//確定月を取得(0なら当月表示、1なら来月表示)
//@author web
//@since 2019/04/19
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getFixedTelTime
//確定日のtime取得
//@author web
//@since 2019/04/26
//
//@param mixed $pactid
//@param mixed $tgt_year
//@param mixed $tgt_month
//@access public
//@return void
//
//
//preloadBillRestriction
//予め読み込んでおく
//@author web
//@since 2019/05/13
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getBillRestriction
//
//@author web
//@since 2019/05/09
//
//@param mixed $pactid
//@param mixed $type
//@access private
//@return void
//
//
//isHayameView
//対象の請求を早めに見れる
//@author web
//@since 2019/05/08
//
//@access private
//@return void
//
//
//isCommonCheck
//共通のチェックだよ
//@author web
//@since 2019/05/09
//
//@param mixed $pactid
//@param mixed $userid
//@param mixed $mid
//@param mixed $tgt_year
//@param mixed $tgt_month
//@access private
//@return void
//
//
//isFixedTel
//対象月の請求が確定日を過ぎているかチェックする
//@author web
//@since 2019/04/18
//
//@param mixed $pactid
//@param mixed $tgt_year
//@param mixed $tgt_month
//@access public
//@return void
//
//
//deleteBillRestriction
//削除するよ、更新した件数を返す
//@author web
//@since 2019/05/10
//
//@param mixed $pactid
//@param mixed $type
//@access public
//@return void
//
//
//insertBillRestriction
//
//@author web
//@since 2019/05/10
//
//@param mixed $pactid
//@param mixed $type
//@param mixed $year
//@param mixed $month
//@access public
//@return void
//
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class BillUtil extends MtUtil {
	constructor() {
		super();
		this.bill_ini = undefined;
		this.auth_pact = Array();
		this.auth_user = Array();
		this.bill_rest = Array();
	}

	getPurchViewMode() {
		var H_res = {
			"0": "\u90E8\u7F72\u5358\u4F4D",
			"1": "ID\u5358\u4F4D"
		};
		return H_res;
	}

	getCopyViewMode() {
		var H_res = {
			"0": "\u90E8\u7F72\u5358\u4F4D",
			"1": "\u30B3\u30D4\u30FC\u6A5F\u5358\u4F4D"
		};
		return H_res;
	}

	getTranViewMode() {
		var H_res = {
			"0": "\u90E8\u7F72\u5358\u4F4D",
			"1": "\u904B\u9001ID\u5358\u4F4D"
		};
		return H_res;
	}

	getEvViewMode() {
		var H_res = {
			"0": "\u90E8\u7F72\u5358\u4F4D",
			"1": "ID\u5358\u4F4D"
		};
		return H_res;
	}

	getHealthViewMode() {
		var H_res = {
			"0": "\u90E8\u7F72\u5358\u4F4D",
			"1": "\u30D8\u30EB\u30B9\u30B1\u30A2ID\u5358\u4F4D"
		};
		return H_res;
	}

	getMoneyCondition() {
		var H_res = {
			">=": "\u4EE5\u4E0A",
			"=": "\u3068\u7B49\u3057\u3044",
			"<=": "\u4EE5\u4E0B"
		};
		return H_res;
	}

	convertDatetime(A_date) {
		if ("" != A_date.Y + A_date.m + A_date.d) {
			var date = A_date.Y + "-" + str_pad(A_date.m, 2, "0", STR_PAD_LEFT) + "-" + str_pad(A_date.d, 2, "0", STR_PAD_LEFT);
		} else {
			date = "";
		}

		return date;
	}

	getBillIni(pactid = undefined) //読込まれてないなら読込む
	{
		if (is_null(this.bill_ini)) //checkと本番で設定を分けたい場合を想定してconf下にiniファイルを置く
			{
				this.bill_ini = parse_ini_file(KCS_DIR + "/conf_sync/bill.ini", true);

				if (this.bill_ini === false) {
					this.bill_ini = Array();
				}
			}

		if (is_null(pactid)) {
			return this.bill_ini;
		}

		if (undefined !== this.bill_ini[pactid]) {
			return this.bill_ini[pactid];
		}

		if (undefined !== this.bill_ini[0]) {
			return this.bill_ini[0];
		}

		return false;
	}

	isAuthPact(pactid, fncid) //対象の企業の権限を取得する
	{
		if (!(undefined !== this.auth_pact[pactid])) {
			var db;
			MtDBUtil & (db = MtDBUtil.singleton());
			var sql = "SELECT fncid,true FROM fnc_relation_tb WHERE " + " pactid=" + pactid + " AND userid=0" + " ORDER BY fncid";
			this.auth_pact[pactid] = db.queryKeyAssoc(sql);
		}

		return undefined !== this.auth_pact[pactid][fncid];
	}

	isAuthUser(pactid, userid, fncid) //対象の企業の権限を取得する
	{
		if (!(undefined !== this.auth_user[pactid])) {
			var db;
			MtDBUtil & (db = MtDBUtil.singleton());
			var sql = "SELECT fncid,true FROM fnc_relation_tb WHERE " + " pactid=" + pactid + " AND userid=" + userid + " ORDER BY fncid";
			this.auth_user[userid] = db.queryKeyAssoc(sql);
		}

		return undefined !== this.auth_user[userid][fncid];
	}

	getIniValue(pactid, key, default) //対象のpactidのiniファイルを取得
	//失敗した場合はデフォルト値を返す
	{
		var ini = this.getBillIni(pactid);

		if (ini === false) {
			return default;
		}

		if (undefined !== ini[key]) {
			return ini[key];
		}

		return default;
	}

	getSumBillBack(pactid) {
		return +this.getIniValue(pactid, "sum_bill_back", 1);
	}

	getMonthAddSum(pactid) {
		return +this.getIniValue(pactid, "sum_ym_month_add", 0);
	}

	getFixedMonthSum(pactid) {
		return +this.getIniValue(pactid, "sum_fixed_month", 0);
	}

	getFixedDaySum(pactid) {
		return +this.getIniValue(pactid, "sum_fixed_day", 1);
	}

	getFixedSumTime(pactid, tgt_year, tgt_month) //念のため、0埋め処理をしておく
	//対象年
	//対象月
	//確定日
	//閲覧したい請求年月の確定日
	{
		tgt_year = +tgt_year;
		tgt_month = +tgt_month;
		var fixed_day = +this.getFixedDaySum(pactid);
		var fixed_month = +this.getFixedMonthSum(pactid);
		return mktime(0, 0, 0, tgt_month + fixed_month, fixed_day, tgt_year);
	}

	isFixedSum(pactid, userid, tgt_year, tgt_month) //management_tbのmidだよ
	//請求合計は0とする
	//権限や、指定されたmid、年月の請求が閲覧可能か調べる
	//対象の請求が閲覧できるのであればtrue
	{
		var mid = 0;

		if (this.isCommonCheck(pactid, userid, mid, tgt_year, tgt_month)) {
			return true;
		}

		var tgt_time = this.getFixedSumTime(pactid, tgt_year, tgt_month);
		return tgt_time <= Date.now() / 1000;
	}

	getTelBillBack(pactid) {
		return +this.getIniValue(pactid, "tel_bill_back", 1);
	}

	getMonthAddTel(pactid) {
		return +this.getIniValue(pactid, "tel_ym_month_add", 0);
	}

	getFixedDayTel(pactid) {
		return +this.getIniValue(pactid, "tel_fixed_day", 1);
	}

	getFixedMonthTel(pactid) {
		return +this.getIniValue(pactid, "tel_fixed_month", 0);
	}

	getFixedTelTime(pactid, tgt_year, tgt_month) //念のため、0埋め処理をしておく
	//対象年
	//対象月
	//確定日
	//閲覧したい請求年月の確定日 - 1秒を求める
	{
		tgt_year = +tgt_year;
		tgt_month = +tgt_month;
		var fixed_day = this.getFixedDayTel(pactid);
		var fixed_month = this.getFixedMonthTel(pactid);
		return mktime(0, 0, 0, tgt_month + fixed_month, fixed_day, tgt_year);
	}

	preloadBillRestriction(arg_pactid) //最初に呼ばれた時だけSQLを発行する
	//単一と配列に対応する
	//早めに請求確認するためのフラグが存在する？
	//おわりん
	{
		var db;
		MtDBUtil & (db = MtDBUtil.singleton());
		var pactid_list = Array();

		if (Array.isArray(arg_pactid)) {
			pactid_list = arg_pactid;
		} else {
			pactid_list = [arg_pactid];
		}

		var sql = "SELECT pactid, type, year,month FROM bill_restriction_tb WHERE " + "pactid IN (" + pactid_list.join(",") + ")";
		var res = db.queryHash(sql);

		if (!!res) {
			for (var key in res) //消す前に値保持
			//いらないものは消す
			//bill_rest[pactid][type] = year,monthといった形になる・・
			{
				var value = res[key];
				var pactid = value.pactid;
				var type = value.type;
				delete value.pactid;
				delete value.type;

				if (!(undefined !== this.bill_rest[pactid])) {
					this.bill_rest[pactid] = Array();
				}

				this.bill_rest[pactid][type] = value;
			}
		}

		for (var key in pactid_list) {
			var pactid = pactid_list[key];

			if (undefined !== this.bill_rest[pactid]) {
				continue;
			}

			this.bill_rest[pactid] = false;
		}

		return true;
	}

	getBillRestriction(pactid, type) //最初に呼ばれた時だけSQLを発行する
	{
		if (!(undefined !== this.bill_rest[pactid])) //早めに請求確認するためのフラグが存在する？
			//." AND type=".$db->dbQuote( $type,"integer",true);
			{
				var db;
				MtDBUtil & (db = MtDBUtil.singleton());
				var sql = "select pactid, type, year,month from bill_restriction_tb where" + " pactid=" + db.dbQuote(pactid, "integer", true);
				var res = db.queryHash(sql);

				if (!res) //データなかった(´・ω・`)
					{
						this.bill_rest[pactid] = false;
					} else //結果を扱いやすいように加工する
					//bill_rest[pactid][type] = year,monthといった形になる・・
					{
						var temp = Array();

						for (var key in res) //いらないやつは消しておく(´・ω・`)
						{
							var value = res[key];
							temp[value.type] = value;
							delete temp[value.type].pactid;
							delete temp[value.type].type;
						}

						this.bill_rest[pactid] = temp;
					}
			}

		if (!Array.isArray(this.bill_rest[pactid])) {
			return undefined;
		}

		if (undefined !== this.bill_rest[pactid][type]) {
			return this.bill_rest[pactid][type];
		}

		return undefined;
	}

	isHayameView(pactid, type, tgt_year, tgt_month) //
	{
		var data = this.getBillRestriction(pactid, type);

		if (!!data) //早めの閲覧許可がされている年月のtimeを求める
			//閲覧したい請求年月のtime
			//閲覧したい請求年月 < 閲覧許可年月
			{
				var hayame_time = mktime(0, 0, 0, data.month + 1, 0, data.year);
				var target_time = mktime(0, 0, 0, tgt_month, 1, tgt_year);
				return target_time < hayame_time;
			}

		return false;
	}

	isCommonCheck(pactid, userid, mid, tgt_year, tgt_month) //権限がなければ、閲覧可能
	{
		if (!this.isAuthPact(pactid, FNC_BILL_RESTRICTION)) {
			return true;
		}

		if (!is_null(userid)) {
			if (this.isAuthUser(pactid, userid, FNC_BILL_RESTRICTION_CANCEL)) {
				return true;
			}
		}

		if (this.isHayameView(pactid, mid, tgt_year, tgt_month)) {
			return true;
		}

		return false;
	}

	isFixedTel(pactid, userid, tgt_year, tgt_month) //management_tbのmidだよ
	//権限や、指定されたmid、年月の請求が閲覧可能か調べる
	//対象の請求が閲覧できるのであればtrue
	{
		var mid = 1;

		if (this.isCommonCheck(pactid, userid, mid, tgt_year, tgt_month)) {
			return true;
		}

		var tgt_time = this.getFixedTelTime(pactid, tgt_year, tgt_month);
		return tgt_time <= Date.now() / 1000;
	}

	deleteBillRestriction(pactid, type) {
		var db;
		MtDBUtil & (db = MtDBUtil.singleton());
		var sql = "DELETE FROM bill_restriction_tb WHERE" + " pactid=" + db.dbQuote(pactid, "integer", true) + " AND type=" + db.dbQuote(type, "integer", true);
		return db.exec(sql);
	}

	insertBillRestriction(pactid, type, year, month, fixdate, is_transaction = false) //トランザクション開始
	//INSERTする
	//更新
	{
		var db;
		MtDBUtil & (db = MtDBUtil.singleton());

		if (is_transaction) {
			db.beginTransaction();
		}

		this.deleteBillRestriction(pactid, type);
		var temp = Array();
		temp.pactid = db.dbQuote(pactid, "integer", 0);
		temp.type = db.dbQuote(type, "integer", 0);
		temp.year = db.dbQuote(year, "integer", 0);
		temp.month = db.dbQuote(month, "integer", 0);
		temp.fixdate = db.dbQuote(fixdate, "timestamp", true);
		var sql = "INSERT INTO bill_restriction_tb(" + Object.keys(temp).join(",") + ")VALUES(" + temp.join(",") + ")";

		if (db.exec(sql) == 0) //更新件数が0ですよ・・
			//トランザクション
			{
				if (is_transaction) {
					db.rollback();
				}

				return false;
			}

		if (is_transaction) {
			db.commit();
		}

		return true;
	}

	__destruct() {}

};