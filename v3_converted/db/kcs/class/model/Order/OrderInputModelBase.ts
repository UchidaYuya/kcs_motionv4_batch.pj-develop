//
//注文必須情報入力用Model基底クラス
//
//更新履歴：<br>
//2008/04/17 宮澤龍彦 作成
//
//@package Order
//@subpackage Model
//@author miyazawa
//@filesource
//@since 2008/04/16
//@uses ModelBase
//@uses
//
//
//
//注文必須情報入力用Model基底クラス
//
//@uses ModelBase
//@package
//@author miyazawa
//@since 2008/04/17
//

require("OrderMainModel.php");

require("MtAuthority.php");

require("MtTableUtil.php");

require("Post.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("view/ViewError.php");

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
//買い方セレクトのチェック
//
//@author ishizaki
//@since 2008/09/09
//
//@param mixed $A_telno
//@param mixed $carid
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
//電話番号入力画面用の回線種別取得
//
//@author miyazawa
//@since 2008/10/09
//
//@param mixed
//@access public
//@return
//
//
//注文できる部署かどうかチェック
//
//@author miyazawa
//@since 2008/04/01
//
//@param mixed $H_sess
//@access public
//@return
//
//
//新規発注用ツリー作成
//
//@author miyazawa
//@since 2008/07/14
//
//@param array $H_Dir
//@access public
//@return mixed
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
class OrderInputModelBase extends OrderMainModel {
	constructor(O_db0, H_g_sess: {} | any[], site_flg = OrderInputModelBase.SITE_USER) {
		super(O_db0, H_g_sess, site_flg);
	}

	checkTelBuysel(A_telno, carid) //条件にpactidが抜けていたので修正 20090319miya
	{
		var sql = "SELECT buyselid, telno FROM tel_tb WHERE telno in('" + A_telno.join("','") + "') AND pactid = " + this.H_G_Sess.pactid + " AND carid = " + this.getDB().dbQuote(carid, "integer", true);
		return this.getDB().queryAssoc(sql);
	}

	setAllAuthIni() {
		var super = false;

		if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
			super = true;
		}

		var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
		var A_pactauth = this.O_Auth.getPactFuncIni("all");
		this.A_Auth = array_merge(A_userauth, A_pactauth);
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	getOrderCircuit(carid) {
		var A_ordcirid = {
			1: [1, 79, 96],
			2: [6],
			3: [9, 78, 97],
			4: [11],
			15: [33],
			28: [48]
		};
		var H_circuit = Array();

		if (true == Array.isArray(A_ordcirid[carid]) && 0 < A_ordcirid[carid].length) {
			var sql = "SELECT cirid, cirname FROM circuit_tb WHERE carid=" + carid + " AND cirid IN (" + join(",", A_ordcirid[carid]) + ") ORDER BY sort";
			H_circuit = this.get_DB().queryHash(sql);
		}

		return H_circuit;
	}

	isThePostCanOrder(memberhensu) {
		var sql = "hoge";
		return this.get_DB().queryHash(sql);
	}

	getOrderTreeJS(H_Dir: {} | any[]) {
		var O_tree = new TreeAJAX();
		H_tree.tree_str = O_tree.makeTreeOrderForm(this.H_G_Sess.current_postid, "", H_Dir.carid);
		var O_xlist = new ListAJAX();
		O_xlist.type = "regist";
		O_xlist.carid = H_Dir.carid;

		if (MT_SITE == "shop") {
			O_xlist.shop_auth = true;
		}

		H_tree.xlist_str = O_xlist.makeList();
		H_tree.js = O_tree.treeJs() + O_xlist.xlistJs();
		return H_tree;
	}

	__destruct() {
		super.__destruct();
	}

};