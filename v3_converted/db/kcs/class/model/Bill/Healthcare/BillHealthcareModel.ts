//
//運送請求用モデル
//
//@package Bill
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2010/02/25
//@uses ModelBase
//@uses TransitCoModel
//
//
//require_once("model/TransitKamokuModel.php");
//
//運送請求用モデル
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@since 2010/02/25
//@uses ModelBase
//@uses TransitCoModel
//

require("model/Bill/BillModelBase.php");

require("model/HealthcareCoModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2010/02/25
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_Out0
//@access public
//@return void
//
//
//運送会社一覧データ取得
//
//@author houshiyama
//@since 2010/02/25
//
//@param string $lang	言語追加 20090702miya
//@access public
//@return void
//
//
//請求あり運送会社一覧データ取得
//
//@author houshiyama
//@since 2010/02/25
//
//@param array $H_sess
//@param string $lang	言語追加 20090702miya
//@access public
//@return array
//
//
//運送科目データ取得
//
//@author houshiyama
//@since 2010/02/25
//
//@param mixed $select
//@param int $pactid
//@param string $lang	言語追加 20090702miya
//@access public
//@return array
//
//
//transit_tbへの固定的なwhere句作成
//
//@author houshiyama
//@since 2010/02/25
//
//@param mixed $tranid
//@param mixed $trancoid
//@param mixed $delflg
//@access protected
//@return void
//
//
//運送部署単位請求情報取得
//
//@author houshiyama
//@since 2010/02/25
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@param mixed $sort
//@param mixed $mode
//@access public
//@return void
//
//
//請求部署単位のselect句作成
//
//@author houshiyama
//@since 2010/02/25
//
//@access private
//@return void
//
//
//運送運送ID単位請求情報取得自のFROM句作成
//
//@author houshiyama
//@since 2010/02/25
//
//@access protected
//@return void
//
//
//運送運送ID単位請求情報取得自のWhere句作成
//
//@author houshiyama
//@since 2010/02/25
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//請求運送ID単位の時のOrder句作成
//
//@author houshiyama
//@since 2010/02/25
//
//@param mixed $sort
//@access protected
//@return void
//
//
//再計算中か調べる
//
//@author houshiyama
//@since 2010/02/25
//
//@param mixed $year
//@param mixed $month
//@access public
//@return void
//
//
//集計日時取得
//
//@author houshiyama
//@since 2010/02/25
//
//@param mixed $year
//@param mixed $month
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/02/25
//
//@access public
//@return void
//
class BillHealthcareModel extends BillModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getHealthcareCoData(lang = "JPN") {
		var H_co = HealthcareCoModel.getHealthcareCoKeyHash(false, lang);
		return H_co;
	}

	getBillHealthcareCoData(H_sess, lang = "JPN") //テーブル名の決定
	//全てを追加
	//現在表示中の運送会社追加
	{
		var H_co = HealthcareCoModel.getHealthcareCoKeyHash(false, lang);
		this.setTableName(H_sess[BillHealthcareModel.PUB].cym);
		var sql = "select healthcoid" + " from " + this.H_Tb.healthcare_post_bill_tb + " where " + " pactid=" + this.H_G_Sess.pactid + " and " + " postid=" + H_sess[BillHealthcareModel.PUB].current_postid + " and " + " flag='1' " + " and " + " coalesce(healthid_num,0)>0" + " group by healthcoid";
		var A_coid = this.get_DB().queryCol(sql);
		A_coid.push(0);

		if (-1 !== A_coid.indexOf(H_sess.SELF.healthcoid) === false) {
			A_coid.push(H_sess.SELF.healthcoid);
		}

		var A_data = Array();

		for (var key in H_co) {
			var val = H_co[key];

			if (-1 !== A_coid.indexOf(key) === true) {
				A_data[key] = val;
			}
		}

		return A_data;
	}

	getKamokuData(select = false, pactid = 0, lang = "JPN") //$O_model = new TransitKamokuModel();
	//		if( true === $select ){
	//			if ("ENG" == $lang) {
	//				$A_data = array( "" => "--please select--" );
	//			} else {
	//				$A_data = array( "" => "--kamoku選択してください--" );
	//			}
	//			$A_data += $O_model->getTranKamokuKeyHash( $pactid, $lang );
	//		}
	//		else{
	//			$A_data = $O_model->getTranKamokuKeyHash( $pactid, $lang );
	//		}
	//		return $A_data;
	{
		return Array();
	}

	makeCommonHealthWhere(tranid, trancoid, delflg = "false") {
		var sql = " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and healthid=" + this.get_db().dbQuote(tranid, "text", true) + " and healthcoid=" + this.get_db().dbQuote(trancoid, "integer", true) + " and dummy_flg=false";

		if (delflg !== undefined) {
			sql += " and delete_flg=" + delflg;
		}

		return sql;
	}

	makeBillDataSQL(A_post, postid, H_post, sort, mode) {
		var sql = "select " + this.makeBillSelectSQL() + " from " + this.makeBillFromSQL() + " where " + this.makeCommonWhereSQL(A_post, postid, "bill", mode);

		if (this.makeBillWhereSQL(H_post) != "") {
			sql += " and " + this.makeBillWhereSQL(H_post);
		}

		sql += this.makeBillOrderBySQL(sort);
		return sql;
	}

	makeBillSelectSQL() //pb,tb....bill は healthcare_bill_xx_tb
	//pt,ph....hlt は healthcare_xx_tb
	{
		var A_col = ["bill.pactid", "bill.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "bill.healthid", "bill.healthcoid", "healthcare_co_tb.healthconame", "hlt.username", "bill.steps", "bill.calories", "bill.move"];
		return A_col.join(",");
	}

	makeBillFromSQL() //bill...healthcare_bill_xx_tb
	//hlt....healthcare_xx_tb
	{
		var sql = this.H_Tb.healthcare_bill_tb + " as bill" + " left join " + this.H_Tb.post_tb + " on bill.postid=" + this.H_Tb.post_tb + ".postid" + " left join " + this.H_Tb.healthcare_tb + " as hlt on bill.pactid=hlt.pactid" + " and bill.healthid=hlt.healthid and bill.healthcoid=hlt.healthcoid" + " left join healthcare_co_tb on bill.healthcoid=healthcare_co_tb.healthcoid";
		return sql;
	}

	makeBillWhereSQL(H_post) //請求元
	{
		var A_where = Array();

		if (undefined !== H_post.healthcoid === true && H_post.healthcoid !== "0") {
			A_where.push("bill.healthcoid=" + H_post.healthcoid);
		}

		if (undefined !== H_post.healthid === true && H_post.healthid !== "") {
			A_where.push("bill.healthid like '%" + H_post.healthid + "%'");
		}

		if (undefined !== H_post.username === true && H_post.username !== "") {
			A_where.push("hlt.username like '%" + H_post.username + "%'");
		}

		if (undefined !== H_post.steps === true && H_post.steps !== "") {
			A_where.push("bill.steps" + H_post.steps_condition + H_post.steps);
		}

		if (undefined !== H_post.calories === true && H_post.calories !== "") {
			A_where.push("bill.calories" + H_post.calories_condition + H_post.calories);
		}

		if (undefined !== H_post.move === true && H_post.move !== "") {
			A_where.push("bill.move" + H_post.move_condition + H_post.move);
		}

		if (A_where.length > 0) {
			var str = "(" + A_where.join(" and ") + ")";
		}

		return str;
	}

	makeBillOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = [this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "bill.healthid", "bill.healthcoid", "hlt.username", "bill.steps", "bill.calories", "bill.move"];

		if ("00" === A_sort[0]) {
			var sql = " order by " + A_col[0];
		} else {
			sql = " order by " + A_col[A_sort[0]];
		}

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		if (A_sort[0] !== "0") {
			sql += "," + this.H_Tb.post_tb + ".userpostid ";
		}

		if (A_sort[0] !== "2") {
			sql += ",bill.healthid ";
		}

		if (A_sort[0] !== "4") {
			sql += ",healthcare_co_tb.healthconame ";
		}

		return sql;
	}

	checkInRecalc(year, month) {
		var sql = "select to_char(recdate, 'yyyy/mm/dd hh24:mi')" + " from healthcare_bill_history_tb" + " where pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and year=" + this.get_DB().dbQuote(year, "text", true) + " and month=" + this.get_DB().dbQuote(month, "text", true) + " and (status='0' or status='1');";
		var cnt = this.get_db().queryOne(sql);

		if (cnt > 0) {
			return true;
		} else {
			return false;
		}
	}

	getRecalcDateTime(year, month) {
		var sql = "select to_char(recdate, 'yyyy/mm/dd hh24:mi')" + " from healthcare_bill_history_tb" + " where pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and year=" + this.get_DB().dbQuote(year, "integer", true) + " and month=" + this.get_DB().dbQuote(month, "integer", true) + " and status like '2%'" + " order by recdate desc;";
		var last_history = this.get_db().queryOne(sql);
		return last_history;
	}

	__destruct() {
		super.__destruct();
	}

};