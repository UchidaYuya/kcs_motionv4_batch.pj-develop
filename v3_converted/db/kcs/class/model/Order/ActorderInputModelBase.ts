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
//電話存在チェック
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed
//@access public
//@return
//
//使わない
//	public function isTheTelExists ( array $H_memberhensu = array() ) {
//		$A_telexist = array();
//		foreach ($H_memberhensu as $key=>$val) {
//			$sql = "SELECT telno_view FROM tel_tb WHERE telno='" .  $val["telno"] . "' AND carid='" . $val["carid"] . "' AND pactid=" . $this->H_G_Sess["pactid"];
//			$A_telexist[$val] = $this->get_DB()->getOne( $sql );
//		}
//		return $A_telexist;
//	}
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
//注文パターンの名とテンプレートファイル名を取得
//
//@author miyazawa
//@since 2008/05/21
//
//@param mixed $H_Dir
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
class ActorderInputModelBase extends OrderMainModel {
	constructor(H_g_sess: {} | any[]) {
		super(this.getDB(), H_g_sess, ActorderInputModelBase.SITE_SHOP);
	}

	checkTelBuysel(A_telno, carid) {
		var sql = "SELECT buyselid, telno FROM tel_tb WHERE telno in('" + A_telno.join("','") + "') AND carid = " + this.getDB().dbQuote(carid, "integer", true);
		return this.getDB().queryAssoc(sql);
	}

	setAllAuthIni() {
		var super = false;

		if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
			super = true;
		}

		var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
		var A_pactauth = this.O_Auth.getPactFuncIni(this.H_G_Sess.pactid);
		this.A_Auth = array_merge(A_userauth, A_pactauth);
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	isThePostCanOrder(memberhensu) {
		var sql = "hoge";
		return this.get_DB().queryHash(sql);
	}

	getOrderPatternName(H_Dir) //$sql = "SELECT car.carname, ptn.ptnname, ptn.tplfile FROM mt_order_pattern_tb ptn, carrier_tb car ";
	//$sql.= "WHERE car.carid=ptn.carid AND ptn.type='" . $H_Dir["type"] . "' AND ptn.carid=" . $H_Dir["carid"] . " AND ptn.cirid=" . $H_Dir["cirid"];
	//販売店のグローバルセッションにゃねぇのよ、pactとかpost
	{
		if (false == (undefined !== this.H_G_Sess.pactid) && false == (undefined !== this.H_G_Sess.postid)) {
			var sql = "SELECT pactid, postid FROM mt_order_tb WHERE orderid=" + H_Dir.orderid;
			var temp = this.get_DB().queryRowHash(sql);
			var pactid = temp.pactid;
			var postid = temp.postid;
		} else {
			pactid = this.H_G_Sess.pactid;
			postid = this.H_G_Sess.postid;
		}

		sql = "SELECT " + "shcar.shopid," + "shcar.arid," + "shrel.memid," + "ptn.ptnname," + "ptn.tplfile," + "car.carname " + "FROM " + "mt_order_pattern_tb ptn INNER JOIN shop_relation_tb shrel ON shrel.carid=ptn.carid " + "INNER JOIN shop_carrier_tb shcar ON ptn.carid=shcar.carid " + "INNER JOIN carrier_tb car on ptn.carid=car.carid " + "WHERE " + "shrel.pactid = " + pactid + " " + "AND shrel.postid = " + postid + " " + "AND shrel.shopid = shcar.shopid " + "AND ptn.type='" + H_Dir.type + "' AND ptn.carid=" + H_Dir.carid + " AND ptn.cirid=" + H_Dir.cirid;
		return this.get_DB().queryRowHash(sql);
	}

	getOrderTreeJS(H_Dir: {} | any[]) {
		var O_tree = new TreeAJAX();
		H_tree.tree_str = O_tree.makeTreeOrderForm(this.H_G_Sess.current_postid, "", H_Dir.carid);
		var O_xlist = new ListAJAX();
		O_xlist.type = "regist";
		O_xlist.carid = H_Dir.carid;
		H_tree.xlist_str = O_xlist.makeList();
		H_tree.js = O_tree.treeJs() + O_xlist.xlistJs();
		return H_tree;
	}

	__destruct() {
		super.__destruct();
	}

};