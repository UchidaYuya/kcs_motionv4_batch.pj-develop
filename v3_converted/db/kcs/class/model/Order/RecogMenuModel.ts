//
//承認履歴一覧トップページ用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/06/30
//@uses OrderListModelBase
//@uses OrderUtil
//
//
//
//承認履歴一覧トップページ用Model
//
//@package Order
//@subpackage Model
//@author miyazawa
//@since 2008/06/30
//@uses OrderListMenuModel
//

require("model/Order/OrderListMenuModel.php");

require("OrderUtil.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/05/26
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//承認一覧のデータを生成する <br>
//
//承認一覧取得<br>
//
//@author miyazawa
//@since 2008/10/04
//
//@param array $H_sess（CGIパラメータ）
//@param array $A_post（部署一覧）
//@param mixed $dounload
//@param array $H_g_sess
//@access public
//@return array
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
class RecogMenuModel extends OrderListMenuModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess);
	}

	getList(H_sess: {} | any[], A_post: {} | any[], download = false, H_g_sess: {} | any[], A_auth = Array()) //検索条件
	//申請部署
	//入力担当者
	//オーダー番号
	//電話番号
	//対象年月のＳＱＬ文を作成
	//承認一覧で表示するものを限定
	//用途
	//WHERE句をつなげる
	//MakeOrderListSQLから承認一覧用の関数を分けた 20090225miya
	//sql文をunionで合体させる
	{
		var A_listsql = Array();
		var A_cntsql = Array();
		var A_data = Array();
		var mid = "";
		var H_search = H_sess[RecogMenuModel.PUB].search.post;

		if (this.O_fjp.checkAuth("recog")) {
			if (Array.isArray(H_search.status) && -1 !== H_search.status.indexOf("10")) {
				H_search.status.push("5");
			}

			if (Array.isArray(H_search.status) && -1 !== H_search.status.indexOf("20")) {
				H_search.status.push("7");
			}
		}

		if (H_search.status.length > 0) {
			var status_str = "AND ord.status IN (" + join(",", H_search.status) + ") ";
		} else {
			status_str = "AND ord.status = -1 ";
		}

		if (H_search.postcd != "") {
			var postcd_str = "AND ord.postname LIKE '%" + H_search.postcd + "%' ";
		} else {
			postcd_str = "";
		}

		if (H_search.charger != "") {
			var charger_str = "AND ord.chargername LIKE '%" + H_search.charger + "%' ";
		} else {
			charger_str = "";
		}

		if (H_search.orderno != "") {
			H_search.orderno = mb_convert_kana(H_search.orderno, "a");
			var ordnumber = H_search.orderno.replace(/^.*-/g, "");
			ordnumber = ordnumber.replace(/[^0-9]/g, "");
			var orderno_str = "AND ord.orderid =" + Math.round(ordnumber) + " ";
		} else {
			orderno_str = "";
		}

		if (H_search.telno != "" && H_search.telno.replace(/^-/g, "") != "") {
			var telno_str = "AND de.telno LIKE '%" + H_search.telno.replace(/-/g, "") + "%' ";
		} else {
			telno_str = "";
		}

		if (H_sess[RecogMenuModel.PUB].search.cym != "" && H_sess[RecogMenuModel.PUB].search.cym != "all") {
			var now_str = date("Y-m-d", mktime(0, 0, 0, H_sess[RecogMenuModel.PUB].search.cym.substr(4, 2), 1, H_sess[RecogMenuModel.PUB].search.cym.substr(0, 4)));
			var end_str = date("Y-m-d", mktime(0, 0, 0, H_sess[RecogMenuModel.PUB].search.cym.substr(4, 2) + 1, 0, H_sess[RecogMenuModel.PUB].search.cym.substr(0, 4)));
			var current_month = "AND (date(ord.recdate) BETWEEN '" + now_str + "' AND '" + end_str + "') ";
		} else {
			current_month = "";
		}

		var fjprecog = "OR recoguserid=" + this.get_DB().dbQuote(H_g_sess.userid, "int", true);

		if (-1 !== A_auth.indexOf("fnc_su_all_recog") && H_g_sess.su) //スーパーユーザー全承認権限がある場合、スーパーユーザーは部署、次の承認部署の影響を受けない。
			//つまり、全て表示する
			{
				var post_str = "";
			} else //承認先のみ表示する
			//"OR ord.nextpostid = " . $H_g_sess["postid"] . ") OR (ord.chpostid in (" . join(",", $A_post) . ") AND ord.actordershopid IS NOT NULL)" . $fjprecog . ") ";
			{
				post_str = " AND (\n\t\t\t\t\t\t(ord.orderid IN (SELECT orderid FROM mt_order_history_tb WHERE chpostid = " + H_g_sess.postid + " GROUP BY orderid) " + "OR (ord.nextpostid = " + H_g_sess.postid + " AND ord.status not in (5,7))) " + "OR (ord.chpostid in (" + join(",", A_post) + ") AND ord.actordershopid IS NOT NULL)" + fjprecog + ") ";
			}

		if (H_search.division != "") {
			var division_str = "AND ord.division = " + H_search.division;
		} else {
			division_str = "";
		}

		var wheresql = status_str + postcd_str + charger_str + orderno_str + telno_str + current_month + post_str + division_str;

		if (undefined !== H_sess[RecogMenuModel.PUB].search.post == false) {
			H_sess[RecogMenuModel.PUB].search.post = Array();
		}

		if (undefined !== H_sess[RecogMenuModel.PUB].search.post.mid == true) {
			mid = H_sess[RecogMenuModel.PUB].search.post.mid;
		}

		if (false == download) //MakeOrderListCntSQLから承認一覧用の関数を分けた 20090225miya
			{
				A_cntsql.push(this.makeRecogListCntSQL(A_post, H_sess[RecogMenuModel.PUB].search.post));
			}

		A_listsql.push(this.makeRecogListSQL(A_post));

		if (A_listsql.length > 0) //ダウンロードでは使用しない
			{
				if (false == download) {
					var cntsql = "SELECT (" + A_cntsql.join(") + (") + wheresql + ")";
				}

				var listsql = A_listsql.join(" UNION ") + wheresql + this.makeGroupBySQL() + this.makeOrderBySQL(H_sess[RecogMenuModel.PUB].search.sort);
			}

		if (false == download) {
			A_data[0] = this.get_DB().queryOne(cntsql);
			this.get_DB().setLimit(H_sess[RecogMenuModel.PUB].search.limit, (H_sess[RecogMenuModel.PUB].search.offset - 1) * H_sess[RecogMenuModel.PUB].search.limit);
		}

		A_data[1] = this.get_DB().queryHash(listsql);

		if (false == download) {
			return A_data;
		} else {
			return A_data[1];
		}
	}

	__destruct() {
		super.__destruct();
	}

};