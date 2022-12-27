//
//請求情報用Model基底クラス
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/02/27
//@uses ModelBase
//@uses AuthModel
//@uses MtTableUtil
//@uses PostLinkBill
//@uses MtPostUtil
//@uses TreeAJAX
//@uses ListAJAX
//
//
//
//請求情報用Model基底クラス
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@since 2008/03/14
//@uses ModelBase
//@uses AuthModel
//@uses MtTableUtil
//@uses PostLinkBill
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("MtTableUtil.php");

require("PostLinkBill.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("MtPostUtil.php");

//
//ディレクトリ名
//
//
//管理種別ID
//
//
//テーブル名一覧取得
//
//@var mixed
//@access protected
//
//
//部署の絞込部分のSQL
//
//@var mixed
//@access protected
//
//
//管理情報共通の関数集オブジェクト
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
//コンストラクター
//
//@author houshiyama
//@since 2008/02/21
//
//@param MtSetting $O_Set0
//@param array $H_g_sess
//@param objrct $O_manage
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
//SQL中で使用するテーブルの名前を決める
//
//@author houshiyama
//@since 2008/02/27
//
//@param mixed $cym
//@access protected
//@return void
//
//
//利用明細のDLを行うかどうか
//
//autor date
//since 2014/12/25
//
//access public
//return bool
//
//
//部署の絞込み部分のSQL作成
//
//@author houshiyama
//@since 2008/04/16
//
//@param array $A_post
//@param mixed $postid
//@param mixed $tb
//@param float $trg
//@access protected
//@return void
//
//
//共通でwhere句に必要なSQL文生成
//
//@author houshiyama
//@since 2008/04/16
//
//@param mixed $postid
//@param mixed $tb
//@param mixed $trg
//@access protected
//@return strint
//
//
//直下の部署一覧又は配下全ての部署一覧を返す
//
//@author houshiyama
//@since 2008/04/18
//
//@param mixed $postid
//@param mixed $A_postid
//@param mixed $allflg
//@access public
//@return void
//
//
//部署ツリー作成
//
//@author houshiyama
//@since 2008/04/16
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//ツリー表示のための一連の処理をする
//
//部署テーブル名の決定
//Javascriptの生成
//部署名の取得
//
//@author houshiyama
//@since 2008/02/27
//
//@param mixed $H_sess（CGIパラメータ）
//@param mixed $postid
//@access public
//@return array
//@uses PostLinkPost
//@uses TreeAJAX
//@uses ListAJAX
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
class BillModelBase extends ModelBase {
	static PUB = "/Bill";
	static TELMID = 1;
	static ETCMID = 2;
	static PURCHMID = 3;
	static COPYMID = 4;

	constructor(O_db0, H_g_sess: {} | any[], O_manage) {
		super(O_db0);
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		this.O_Post = new PostModel();
		this.O_Manage = O_manage;
		this.NowTime = this.get_db().getNow();
		this.O_Set = MtSetting.singleton();
		this.setAllAuthIni();
	}

	setAllAuthIni() {
		var super = false;

		if (undefined !== this.H_G_Sess.su === true && this.H_G_Sess.su == 1) {
			super = true;
		}

		var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
		var A_pactauth = this.O_Auth.getPactFuncIni(this.H_G_Sess.pactid);
		this.A_Auth = array_merge(A_userauth, A_pactauth);
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	setTableName(cym) //対象テーブル番号の取得
	//対象テーブル名
	//福山対応 20100224
	//EV対応 20100716miya
	//ヘルスケア 20150610
	//未集計対応 20100916miya
	{
		var O_table = new MtTableUtil();
		this.H_Tb.tableno = O_table.getTableNo(cym);
		this.H_Tb.tel_tb = "tel_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.post_tb = "post_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.post_relation_tb = "post_relation_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.card_tb = "card_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.purchase_tb = "purchase_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.copy_tb = "copy_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.tel_details_tb = "tel_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.bill_tb = "tel_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.tel_bill_tb = "tel_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.card_details_tb = "card_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.card_usehistory_tb = "card_usehistory_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.card_post_bill_tb = "card_post_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.card_bill_tb = "card_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.purchase_details_tb = "purchase_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.purchase_post_bill_tb = "purchase_post_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.purchase_bill_tb = "purchase_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.copy_details_tb = "copy_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.copy_history_tb = "copy_history_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.copy_post_bill_tb = "copy_post_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.copy_bill_tb = "copy_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.transit_tb = "transit_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.transit_bill_tb = "transit_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.transit_details_tb = "transit_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.transit_usehistory_tb = "transit_usehistory_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.transit_post_bill_tb = "transit_post_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.ev_tb = "ev_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.ev_details_tb = "ev_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.ev_usehistory_tb = "ev_usehistory_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.ev_post_bill_tb = "ev_post_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.ev_bill_tb = "ev_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.healthcare_tb = "healthcare_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.healthcare_post_bill_tb = "healthcare_post_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.healthcare_bill_tb = "healthcare_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.healthcare_rechistory_tb = "healthcare_rechistory_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.healthcare_details_tb = "healthcare_details_" + this.H_Tb.tableno + "_tb";

		if ("" == this.H_Tb.tableno) {
			{
				let _tmp_0 = this.H_Tb;

				for (var key in _tmp_0) {
					var val = _tmp_0[key];
					this.H_Tb[key] = ereg_replace("__", "_", val);
				}
			}
		}
	}

	isDownloadUsageDetails() {
		if (this.H_Tb.tableno <= 12) {
			return true;
		}

		return false;
	}

	makePostWhereSQL(A_post, postid, tb, trg = 0) //対象部署のみ
	{
		if ("2" === trg) {
			var sql = tb + ".postid=" + postid + " ";
		} else {
			sql = tb + ".postid in (" + A_post.join(",") + ") ";
		}

		return sql;
	}

	makeCommonWhereSQL(A_post, postid, tb, trg = "0") {
		var A_sql = Array();
		A_sql.push(tb + ".pactid=" + this.H_G_Sess.pactid);
		A_sql.push(this.makePostWhereSQL(A_post, postid, tb, trg));
		var sql = A_sql.join(" and ");
		return sql;
	}

	getUnderChildPostid(postid, A_postid, allflg = false) //配下全ての部署の時はそのまま部署一覧を返す
	{
		if (true === allflg) {
			return A_postid;
		}

		var sql = "select postidchild from " + this.H_Tb.post_relation_tb + " where " + " pactid=" + this.H_G_Sess.pactid + " and postidparent=" + postid;
		var A_data = this.get_db().queryCol(sql);
		return A_data;
	}

	getPostTree(H_sess) //テーブル名決定
	{
		this.setTableName(H_sess[BillModelBase.PUB].cym);
		var O_post = new PostLinkBill();

		if (H_sess.SELF.mode === "0") {
			O_post.m_link_tail = false;
		} else {
			O_post.m_link_tail = true;
		}

		O_post.m_mode = "0";

		if (O_post.m_empty_login || O_post.m_empty_postid) {
			var post_tree = "\u90E8\u7F72\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093";
		} else {
			post_tree = O_post.getPosttreeBand(this.H_G_Sess.pactid, this.H_G_Sess.postid, H_sess[BillModelBase.PUB].current_postid, this.H_Tb.post_tb, this.H_Tb.post_relation_tb, " -> ", 1, 0);
		}

		if (strip_tags(post_tree) === "") {
			post_tree = "\u90E8\u7F72\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093";
		}

		return post_tree;
	}

	getTreeJS(H_sess) //テーブル名の決定
	//対象テーブル名
	{
		var H_tree = Array();
		this.setTableName(H_sess.cym);
		var post_tb = this.H_Tb.post_tb;
		var post_relation_tb = this.H_Tb.post_relation_tb;
		var tb_no = this.H_Tb.tableno;
		H_tree.js = TreeAJAX.treeJs() + ListAJAX.xlistJs();
		var O_post = new MtPostUtil();
		H_tree.post_name = O_post.getPostTreeBand(this.H_G_Sess.pactid, this.H_G_Sess.postid, H_sess.current_postid, tb_no, " -> ", "", 1, false);
		var O_tree = new TreeAJAX();
		O_tree.post_tb = this.H_Tb.post_tb;
		O_tree.post_relation_tb = this.H_Tb.post_relation_tb;
		H_tree.tree_str = O_tree.makeTree(this.H_G_Sess.postid);
		var O_xlist = new ListAJAX();
		O_xlist.post_tb = this.H_Tb.post_tb;
		O_xlist.post_relation_tb = this.H_Tb.post_relation_tb;
		H_tree.xlist_str = O_xlist.makeList();
		return H_tree;
	}

	__destruct() {
		super.__destruct();
	}

};