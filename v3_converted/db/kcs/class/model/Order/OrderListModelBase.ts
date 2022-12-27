//
//管理情報用Model基底クラス
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/02/27
//@uses ModelBase
//@uses MtAuthority
//@uses MtTableUtil
//@uses Post
//@uses TreeAJAX
//@uses ListAJAX
//@uses ViewError
//
//
//
//管理情報用Model基底クラス
//
//@package OrderList
//@subpackage Model
//@author miyazawa
//@since 2008/03/14
//@uses ModelBase
//@uses MtAuthority
//@uses MtTableUtil
//@uses Post
//@uses TreeAJAX
//@uses ListAJAX
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("MtTableUtil.php");

require("model/PostModel.php");

require("Post.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("view/ViewError.php");

require("view/Order/BillingViewBase.php");

//
//ディレクトリ名
//
//
//注文情報共通の関数集オブジェクト
//
//@var mixed
//@access protected
//
//
//権限オブジェクト
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
//インサート用現在時刻
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
//販売店機能からの呼出しか否か
//0=一般　1=販売店
//
//@var mixed
//@access protected
//
//
//エラーオブジェクト
//
//@var ombject
//@access protected
//
//
//コンストラクター
//
//@author miyazawa
//@since 2008/05/28
//
//@param MtSetting $O_Set0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//@uses AuthModel
//@uses PostModel
//
//
//権限一覧を取得する
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return array
//
//
//権限一覧のゲッター
//
//@author houshiyama
//@since 2008/03/19
//
//@access public
//@return void
//
//
//部署一覧取得（自部署のみか配下全てに対応）
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $postid
//@param mixed $trg
//@access public
//@return void
//
//
//部署名の取得
//
//@author houshiyama
//@since 2008/03/14
//
//@param mixed $postid
//@access public
//@return string
//
//注文一覧取得時のSQL文のFrom句生成
//
//@author miyazawa
//@since 2008/05/28
//
//@access protected
//@return string
//
//
//注文一覧取得時のSQL文のwhere句生成
//
//@author miyazawa
//@since 2008/05/28
//
//@param array $A_post
//@param mixed $tb
//@param mixed $trg
//@access protected
//@return strint
//
//
//承認一覧取得時のSQL文のwhere句生成
//
//@author miyazawa
//@since 2009/02/25
//
//@param array $A_post
//@param mixed $tb
//@param mixed $trg
//@access protected
//@return strint
//
//
//注文一覧を取得するSQL文作成
//
//@author miyazawa
//@since 2008/05/27
//
//@param array $A_post
//@access protected
//@return string
//
//
//承認一覧を取得するSQL文作成
//
//@author miyazawa
//@since 2009/02/25
//
//@param array $A_post
//@access protected
//@return string
//
//
//注文一覧の件数を取得するSQL文作成
//
//@author miyazawa
//@since 2008/05/27
//
//@param array $A_post
//@access protected
//@return string
//
//
//承認一覧の件数を取得するSQL文作成
//
//@author miyazawa
//@since 2009/02/25
//
//@param array $A_post
//@access protected
//@return string
//
//
//検索条件を結合する
//
//@author houshiyama
//@since 2008/03/18
//
//@param mixed $A_where
//@param mixed $condition
//@access protected
//@return string
//
//
//setfjpModelObject
//
//@author igarashi
//@since 2011/06/13
//
//@param mixed $fjp
//@access public
//@return void
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
class OrderListModelBase extends ModelBase {
	static PUB = "/MTOrderList";
	static ORD_TB = "mt_order_tb";
	static ORD_SUB_TB = "mt_order_sub_tb";
	static ORD_DET_TB = "mt_order_teldetail_tb";
	static ORD_TRN_TB = "mt_transfer_tb";
	static SITE_USER = 0;
	static SITE_SHOP = 1;

	constructor(O_db0, H_g_sess: {} | any[]) //販売店の場合はAuth系が変わる
	{
		super(O_db0);
		this.H_G_Sess = H_g_sess;
		this.O_Post = new PostModel();
		this.O_order = OrderUtil.singleton();
		this.NowTime = this.get_DB().getNow();
		this.O_Set = MtSetting.singleton();
		this.O_Out = this.getOut();
		this.O_billView = new BillingViewBase();

		if (false == (undefined !== this.siteflg) || OrderListModelBase.SITE_USER == this.siteflg) {
			this.siteflg = OrderListModelBase.SITE_USER;
			this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
			this.setAllAuthIni();
		} else {
			this.siteflg = OrderListModelBase.SITE_SHOP;
			this.O_Auth = MtShopAuthority.singleton(this.H_G_Sess.shopid);
		}
	}

	setAllAuthIni() {
		var super = false;

		if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
			super = true;
		}

		if (undefined !== this.H_G_Sess.joker == true && this.H_G_Sess.joker == 1) //成り代わりだったら権限の時間制限を見ない
			{
				var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid, "all");
				var A_pactauth = this.O_Auth.getPactFuncIni("all");
			} else {
			A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
			A_pactauth = this.O_Auth.getPactFuncIni();
		}

		this.A_Auth = array_merge(A_userauth, A_pactauth);
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	getPostidList(postid, trg) //部署一覧取得
	{
		if (1 == trg) {
			var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, postid);
		} else {
			A_post = [postid];
		}

		return A_post;
	}

	getPostName(postid, cym = undefined) {
		if (cym == undefined) {
			this.setTableName(date("Ym"));
		} else {
			this.setTableName(cym);
		}

		var postname = PostModel.getPostNameOne(postid, this.H_Tb.post_tb);
		return postname;
	}

	makeOrderFromSQL() {
		var sql = "mt_order_tb ord INNER JOIN mt_status_tb ON ord.status=mt_status_tb.status " + "LEFT JOIN mt_order_pattern_tb ptn ON ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid " + "INNER JOIN carrier_tb car ON ord.carid=car.carid " + "LEFT JOIN mt_order_sub_tb sub ON ord.orderid=sub.orderid " + "LEFT JOIN mt_order_teldetail_tb de ON ord.orderid=de.orderid " + "INNER JOIN shop_tb ON ord.shopid=shop_tb.shopid " + "LEFT JOIN user_tb u ON ord.recoguserid=u.userid ";
		return sql;
	}

	makeOrderWhereSQL(A_post) //スーパーユーザでない場合、配下部署の条件を追加する
	//$wheresql.=
	//"AND (ord.ordertype IS NULL OR (ord.ordertype IS NOT NULL AND ord.ordertype != 'HL')) " ;	// Hotlineと分ける必要なし 200903223miya
	//// 対象年月のＳＱＬ文を作成
	//		if($_SESSION[$_SERVER["PHP_SELF"] . ",cy"] != "" && $_SESSION[$_SERVER["PHP_SELF"] . ",cm"] != "" &&
	//			$_SESSION[$_SERVER["PHP_SELF"] . ",cy"] != "all" && $_SESSION[$_SERVER["PHP_SELF"] . ",cm"] != "all"){
	//			$now_str = date("Y-m-d", mktime(0, 0, 0, $_SESSION[$_SERVER["PHP_SELF"] . ",cm"], 1, $_SESSION[$_SERVER["PHP_SELF"] . ",cy"]));
	//			$end_str = date("Y-m-d", mktime(0, 0, 0, $_SESSION[$_SERVER["PHP_SELF"] . ",cm"]+1, 0, $_SESSION[$_SERVER["PHP_SELF"]  . ",cy"]));
	//			$current_month = "and (date(ord.recdate) between '" . $now_str . "' and '" . $end_str . "') ";
	//		}
	//		else{
	//			$current_month = "";
	//		}
	//		// ステータスを条件句に整形
	//		if(count($H_search["status"]) > 0){
	//			$status_str = "and ord.status in (" . join(",", $H_search["status"]) . ") ";
	//		}
	//		else{
	//			$status_str = "and ord.status = -1 ";
	//		}
	//		// 入力担当者
	//		if($H_search["charger"] != ""){
	//			$charger_str = "and ord.chargername like '%" . $H_search["charger"] . "%' ";
	//		}
	//		else{
	//			$charger_str = "";
	//		}
	//		// オーダー番号
	//		if($H_search["orderno"] != ""){
	//			$H_search["orderno"] = mb_convert_kana($H_search["orderno"], "a");
	//			$ordnumber = preg_replace("/^.*-/", "", $H_search["orderno"]);
	//			$ordnumber = preg_replace("/[^0-9]/", "", $ordnumber);
	//			$orderno_str = "and ord.orderid =" . intval($ordnumber) . " and ord.status >= 40 ";
	//		}
	//		else{
	//			$orderno_str = "";
	//		}
	//					$status_str .
	//					$charger_str .
	//					$orderno_str .
	//					$current_month;
	{
		var wheresql = "ord.pactid = " + this.H_G_Sess.pactid;

		if (!this.H_G_Sess.su) {
			var A_folpost = PostModel.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid);
			wheresql += " AND (" + " ord.postid in (" + join(",", A_folpost) + ")" + " OR ord.applyuserid = " + this.H_G_Sess.userid + ") ";
		}

		wheresql += " ";
		return wheresql;
	}

	makeRecogWhereSQL(A_post) //20110609
	//ordertypeはNOT NULL制約付きです。そしてordertypeは発注種別であり、pacttypeではありません。恐ろしいわ。
	//$wheresql.=
	//"AND (ord.ordertype IS NULL OR (ord.ordertype IS NOT NULL AND ord.ordertype != 'HL')) " ;
	{
		var wheresql = "ord.pactid = " + this.H_G_Sess.pactid + " ";
		wheresql += "AND ord.pacttype != 'H' ";
		return wheresql;
	}

	makeOrderListSQL(A_post: {} | any[]) {
		var sql = "SELECT " + this.makeOrderSelectSQL() + " FROM " + this.makeOrderFromSQL() + "WHERE " + this.makeOrderWhereSQL(A_post);
		return sql;
	}

	makeRecogListSQL(A_post: {} | any[]) {
		var sql = "SELECT " + this.makeOrderSelectSQL() + " FROM " + this.makeOrderFromSQL() + "WHERE " + this.makeRecogWhereSQL(A_post);
		return sql;
	}

	makeOrderListCntSQL(A_post: {} | any[]) {
		var sql = "SELECT count(distinct ord.orderid) FROM " + this.makeOrderFromSQL() + "WHERE " + this.makeOrderWhereSQL(A_post);
		return sql;
	}

	makeRecogListCntSQL(A_post: {} | any[]) {
		var sql = "SELECT count(distinct ord.orderid) FROM " + this.makeOrderFromSQL() + "WHERE " + this.makeRecogWhereSQL(A_post);
		return sql;
	}

	implodeWhereArray(A_where, condition) {
		if (A_where.length > 0) {
			if (condition == "or" || condition == "OR") {
				var sql = " and (" + A_where.join(" or ") + ") ";
			} else {
				sql = " and (" + A_where.join(" and ") + ") ";
			}
		}

		return sql;
	}

	setfjpModelObject(fjp) {
		require("model/Order/fjpModel.php");

		if (fjp instanceof fjpModel) {
			this.O_fjp = fjp;
		}

		return this.O_fjp;
	}

	__destruct() {
		super.__destruct();
	}

};