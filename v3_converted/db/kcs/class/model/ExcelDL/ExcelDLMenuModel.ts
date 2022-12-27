//
//エクセルダウンロードページModel
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/06/24
//@uses ManagementModelBase
//@uses CardCoModel
//
//
//
//エクセルダウンロードページModel
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/06/24
//@uses ModelBase
//@uses CardCoModel
//

require("model/ModelBase.php");

require("MtPostUtil.php");

require("TreeAJAX.php");

require("ListAJAX.php");

//
//ディレクトリ名
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
//権限オブジェクト
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
//@since 2008/06/24
//
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
//@since 2008/06/24
//
//@access public
//@return array
//
//
//権限一覧のゲッター
//
//@author houshiyama
//@since 2008/06/24
//
//@access public
//@return void
//
//
//SQL中で使用するテーブルの名前を決める
//
//@author houshiyama
//@since 2008/06/24
//
//@param mixed $cym
//@access protected
//@return void
//
//
//種別のプルダウンデータ作成
//
//@author houshiyama
//@since 2008/06/24
//
//@access public
//@return void
//
//
//移動用ツリー作成
//
//@author houshiyama
//@since 2008/06/24
//
//@param array $H_sess
//@param array $A_auth
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/21
//
//@access public
//@return void
//
class ExcelDLMenuModel extends ModelBase {
	static PUB = "/ExcelDL";

	constructor(H_g_sess: {} | any[]) {
		super(this.get_DB());
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
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

	setTableName(cym) //対象テーブル番号の取得
	//対象テーブル名
	{
		var O_table = new MtTableUtil();
		this.H_Tb.tableno = O_table.getTableNo(cym);
		this.H_Tb.post_tb = "post_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.post_relation_tb = "post_relation_" + this.H_Tb.tableno + "_tb";
	}

	getMtypeKeyHash() //電話請求権限あれば追加
	{
		var H_mtype = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};

		if (-1 !== this.A_Auth.indexOf("fnc_tel_bill") == true) {}

		if (-1 !== this.A_Auth.indexOf("fnc_card_detail") == true) {
			H_mtype[2] = "ETC\u30AB\u30FC\u30C9\u8ACB\u6C42";
		}

		if (-1 !== this.A_Auth.indexOf("fnc_copy_bill") == true) {
			H_mtype[4] = "\u30B3\u30D4\u30FC\u6A5F\u8ACB\u6C42";
		}

		if (-1 !== this.A_Auth.indexOf("fnc_purch_bill") == true) {
			H_mtype[3] = "\u8CFC\u8CB7\u8ACB\u6C42";
			H_mtype[103] = "SAT/MonotaRo\u8ACB\u6C42";
		}

		if (-1 !== this.A_Auth.indexOf("fnc_tran_bill") == true) {
			H_mtype[5] = "\u798F\u5C71\u901A\u904B";
		}

		if (-1 !== this.A_Auth.indexOf("fnc_addbill") == true) {
			H_mtype[243] = "\u540D\u523A/\u5C01\u7B52\u8ACB\u6C42";
		}

		return H_mtype;
	}

	getTreeJS(H_sess: {} | any[]) //ツリーのルート部署設定
	//ツリー作成
	//部署管理型
	{
		this.setTableName(H_sess.SELF.post.trgmonth);

		if (-1 !== this.A_Auth.indexOf("fnc_treefree") == true) //部署ツリー権限解除時ルート部署を表示しない場合
			{
				if (-1 !== this.A_Auth.indexOf("fnc_not_view_root") == true) {
					var O_post = new Post();
					var postid_of_tree = O_post.getTargetRootPostid(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.post_relation_tb, 2);
				} else //制限解除権限あり
					{
						var sql = "select postidchild from " + this.H_Tb.post_relation_tb + " where level = 0 and pactid = " + this.H_G_Sess.pactid;
						postid_of_tree = this.get_db().queryOne(sql);
					}
			} else //制限解除権限なし
			{
				postid_of_tree = this.H_G_Sess.postid;
			}

		H_tree.js = TreeAJAX.treeJs() + ListAJAX.xlistJs();
		var O_tree = new TreeAJAX();
		O_tree.post_tb = this.H_Tb.post_tb;
		O_tree.post_relation_tb = this.H_Tb.post_relation_tb;
		H_tree.tree_str = O_tree.makeTreeMove(postid_of_tree);
		var O_xlist = new ListAJAX();
		O_xlist.type = "move";
		O_xlist.post_tb = this.H_Tb.post_tb;
		O_xlist.post_relation_tb = this.H_Tb.post_relation_tb;
		H_tree.xlist_str = O_xlist.makeList();
		return H_tree;
	}

	__destruct() {
		super.__destruct();
	}

};