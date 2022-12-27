//
//ICCardPrintOutPersonalModel
//交通費出力PDFモデル
//@uses ModelBase
//@package
//@author date
//@since 2015/11/02
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("Authority.php");

require("TableMake.php");

require("model/PostModel.php");

require("MtPostUtil.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("model/Const/ConstLogModel.php");

//
//権限オブジェクト
//
//@var mixed
//@access protected
//
//
//H_define_ini
//define.iniの取得
//@var mixed
//@access private
//
//
//__construct
//コンストラクタ
//@author date
//@since 2015/11/02
//
//@param mixed $O_db0
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//setAllAuthIni
//権限の設定
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
//
//get_AuthIni
//権限の取得
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
//
//getList
//
//@author web
//@since 2016/03/24
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class ConstLogDownloadModel extends ModelBase {
	constructor(O_db0, H_g_sess) {
		super(O_db0);
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		this.setAllAuthIni();
		this.H_define_ini = parse_ini_file(KCS_DIR + "/conf_sync/define.ini", true);
	}

	setAllAuthIni() //shop側では使用しない
	{
		if (undefined !== this.H_G_Sess.pactid == true) {
			var super = false;

			if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
				super = true;
			}

			var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
			var A_pactauth = this.O_Auth.getPactFuncIni();
			this.A_Auth = array_merge(A_userauth, A_pactauth);
		} else {
			this.A_Auth = Array();
		}
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	getList(H_sess) //本当は継承して使いたかった・・
	//成り代わりログイン非表示権限
	//成り代わりログイン非表示権限があるか調べる
	//成り代わり操作非表示権限
	//成り代わり操作非表示権限があるか調べる
	//スーパーユーザ以外は削除されていない部署分のみ表示する	2005/08/17 s.maeda
	//検索で日付項目が指定されているかどうか
	{
		var O_auth = new Authority();
		var O_log_model = new ConstLogModel();
		var uri = "/Const/constlog.php";
		var A_co_auth = O_auth.getAllPactAuth(_SESSION.pactid);
		var joker_login_notview = false;

		if (-1 !== A_co_auth.indexOf(G_VIEW_JOKER_LOGIN) == true) {
			joker_login_notview = true;
		}

		var joker_operate_notview = false;

		if (-1 !== A_co_auth.indexOf(G_VIEW_JOKER_OPERATE) == true) {
			joker_operate_notview = true;
		}

		var A_postid_list = O_auth.getFollowerPost();
		var sql = "select distinct " + "mnglog_tb.postname," + "mnglog_tb.recdate," + "mnglog_tb.comment1," + "mnglog_tb.comment2," + "mnglog_tb.comment1_eng," + "mnglog_tb.comment2_eng," + "mnglog_tb.username " + "from " + "mnglog_tb " + "where ";
		sql += " " + O_log_model.makeWhereSql(joker_login_notview, joker_operate_notview) + "and mnglog_tb.pactid = " + _SESSION.pactid + " ";

		if (_SESSION.su == false) {
			sql = sql + "and (mnglog_tb.userid = " + _SESSION.userid + " or targetpostid in (" + join(",", A_postid_list) + ")) ";
		}

		var search_sql = O_log_model.makeLogSearchSQL(_SESSION.pactid, H_sess.search);
		sql += search_sql.sql;

		if (undefined !== search_sql.date) //指定されている、過去13か月のデータを指定するように設定する
			//(日付指定された場合、それ以上前のログも取れてしまうため)
			{
				sql += " and mnglog_tb.recdate >= '" + date("Y-m-d H:i:s", mktime(0, 0, 0, date("n") - 12, 1, date("Y"))) + "'";
			} else //対象年月のＳＱＬ文を作成
			//指定されていない、月ごとの日付指定を行う
			{
				if (_SESSION[uri + ",cy"] != "" && _SESSION[uri + ",cm"] != "") {
					var now_str = date("Y-m-d", mktime(0, 0, 0, _SESSION[uri + ",cm"], 1, _SESSION[uri + ",cy"]));
					var end_str = date("Y-m-d", mktime(0, 0, 0, _SESSION[uri + ",cm"] + 1, 0, _SESSION[uri + ",cy"]));
				} else {
					now_str = date("Y-m-01");
					end_str = date("Y-m-d", mktime(0, 0, 0, date("m") + 1, 0, date("Y")));
				}

				sql += " and date(mnglog_tb.recdate) between '" + now_str + "' and '" + end_str + "' ";
			}

		if (_SESSION[uri + ",s"] != "") //表示言語分岐
			{
				if ("ENG" === _SESSION.language) {
					var A_sort = ["comment2_eng", "postname", "username", "recdate"];
				} else {
					A_sort = ["comment2", "postname", "username", "recdate"];
				}

				var A_key = preg_split("/\\|/", _SESSION[uri + ",s"]);

				if (A_key[1] == "a") {
					var asc = "asc";
				} else if (A_key[1] == "d") {
					asc = "desc";
				}

				sql += " order by " + A_sort[A_key[0]] + " " + asc;
			} else {
			sql += " order by recdate desc";
		}

		var res = this.get_DB().queryHash(sql);
		return res;
	}

	__destruct() {
		super.__destruct();
	}

};