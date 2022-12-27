//
//注文雛型メニュー用Model基底クラス
//
//更新履歴：<br>
//2008/06/04 宮澤龍彦 作成
//
//@package Order
//@subpackage Model
//@author miyazawa
//@filesource
//@since 2008/06/04
//@uses ModelBase
//@uses
//
//
//
//注文雛型メニュー用Model基底クラス
//
//@uses ModelBase
//@package
//@author miyazawa
//@since 2008/06/04
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("MtTableUtil.php");

require("Post.php");

require("view/ViewError.php");

//
//ディレクトリ名
//
//
//注文共通の関数集オブジェクト
//
//@var mixed
//@access protected
//
//
//セッティングオブジェクト
//
//@var mixed
//@access protected
//
//
//権限一覧
//
//@var mixed
//@access protected
//
//
//グローバルセッション
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param MtSetting $O_Set0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//権限一覧を取得する
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return array
//
//
//権限一覧のゲッター
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
//
//setDivisionPattern
//
//@author web
//@since 2013/10/04
//
//@param mixed $pattern
//@access public
//@return void
//
//
//注文パターンの名とテンプレートファイル名を取得
//
//@author miyazawa
//@since 2008/06/04
//
//@param mixed $H_Dir
//@access public
//@return
//
//
//雛型登録データを読み込む
//
//@author miyazawa
//@since 2008/06/04
//
//@param mixed $H_Dir
//@access public
//@return
//
//
//editOtherCarrier
//
//@author web
//@since 2012/10/01
//
//@param mixed $list
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class TemplateMenuModel extends ModelBase {
	static PUB = "/MTTemplate";

	constructor(O_db0, H_g_sess: {} | any[]) {
		super(O_db0);
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		this.O_Set = MtSetting.singleton();
		this.setAllAuthIni();
	}

	setAllAuthIni() {
		var super = false;

		if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
			super = true;
		}

		var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
		var A_pactauth = this.O_Auth.getPactFuncIni();
		this.A_Auth = array_merge(A_userauth, A_pactauth);
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	setDivisionPattern(pattern) {
		this.pattern = pattern;
	}

	getTemplateList(postid_str, A_orderauth: {} | any[]) //英語化権限 20090210miya
	{
		if ("ENG" == this.H_G_Sess.language) {
			var carname_str = "car.carname_eng as carname,";
			var carname_gr_str = "car.carname_eng";
			var ptnname_str = "ptn.ptnname_eng";
		} else {
			carname_str = "car.carname,";
			carname_gr_str = "car.carname";
			ptnname_str = "ptn.ptnname";
		}

		var H_list = Array();

		if (true == 0 < A_orderauth.length) //パターンをしぼり込む
			//$ptn_sql.= "AND tmp.cirid NOT IN (8, 2) ";
			{
				var ptn_sql = "SELECT " + "ptn.type || '-' || ptn.carid || '-' || ptn.cirid || '-' || COALESCE(ptn.ppid,0)," + "car.carid," + carname_str + ptnname_str + " as ptnname " + "FROM " + "mt_template_tb tmp " + "INNER JOIN mt_order_pattern_tb ptn on tmp.carid=ptn.carid AND tmp.type=ptn.type AND tmp.cirid=ptn.cirid AND COALESCE(tmp.ppid,0)=COALESCE(ptn.ppid,0) " + "INNER JOIN carrier_tb car ON ptn.carid=car.carid " + "INNER JOIN shop_relation_tb shrel ON shrel.carid=ptn.carid ";
				ptn_sql += "WHERE ";
				ptn_sql += "tmp.pactid=0 ";
				ptn_sql += "AND shrel.pactid = " + this.H_G_Sess.pactid + " ";
				ptn_sql += "AND tmp.carid IN (" + join(",", A_orderauth) + ") ";
				ptn_sql += "GROUP BY ptn.type, ptn.carid, ptn.cirid, ptn.ppid, ptn.ptn_order, car.carid, " + carname_gr_str + ", " + ptnname_str + " ";
				ptn_sql += "ORDER BY " + "ptn.carid, ptn.ptn_order";
				H_list = this.get_DB().querykeyAssoc(ptn_sql);
			}

		return H_list;
	}

	getTemplateData(postid_str, A_orderauth: {} | any[]) {
		var tbname = "";

		if (!is_null(this.pattern) && this.pattern != "") {
			tbname = "_" + this.pattern;
		}

		var H_data = Array();

		if (true == 0 < A_orderauth.length) {
			var sql_t = "select " + "tm.tempid," + "tm.carid," + "tm.type," + "tm.cirid," + "tm.ppid," + "tm.tempname," + "ar.arname," + "pos.postname," + "pos.userpostid," + "tm.defflg " + "from " + "mt_template" + tbname + "_tb tm inner join area_tb ar on tm.arid=ar.arid " + "LEFT JOIN post_tb pos ON tm.postid=pos.postid ";
			sql_t += "where ";
			sql_t += "tm.pactid = " + this.H_G_Sess.pactid + " ";
			sql_t += "AND tm.postid IN (" + postid_str + ") ";
			sql_t += "AND tm.carid IN (" + join(",", A_orderauth) + ") ";
			sql_t += "AND (tm.ordtype IS NULL OR (tm.ordtype IS NOT NULL AND tm.ordtype != 'HL')) ";
			sql_t += "order by tm.tempid";
			H_data = this.get_DB().queryHash(sql_t);
		}

		return H_data;
	}

	editOtherCarrier(list) {
		var others = this.get_DB().queryCol("SELECT carid FROM shop_relation_tb" + " WHERE pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "int", true) + " GROUP BY carid ORDER BY carid");

		for (var id of Object.values(others)) {
			list.push(id);
		}

		return list;
	}

	__destruct() {
		super.__destruct();
	}

};