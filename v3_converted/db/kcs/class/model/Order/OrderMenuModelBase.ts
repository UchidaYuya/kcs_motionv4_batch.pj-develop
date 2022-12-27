//
//注文メニュー用Model基底クラス
//
//更新履歴：<br>
//2008/04/16 宮澤龍彦 作成
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
//注文メニュー用Model基底クラス
//
//@uses ModelBase
//@package
//@author miyazawa
//@since 2008/04/16
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("MtTableUtil.php");

require("Post.php");

require("TreeAJAX.php");

require("ListAJAX.php");

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
//承認部署の取得
//
//@author miyazawa
//@since 2008/05/13
//
//@param mixed $H_sess
//@access public
//@return
//
//
//注文パターンの取得
//
//@author miyazawa
//@since 2008/05/13
//
//@access public
//@return array
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
class OrderMenuModelBase extends ModelBase {
	static PUB = "/MTOrder";

	constructor(O_db0, H_g_sess: {} | any[], O_order) {
		super(O_db0);
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		this.O_order = O_order;
		this.NowTime = date("Y-m-d H:i:s");
		this.O_Set = MtSetting.singleton();
		this.setAllAuthIni();
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

	getRecogPost() {
		var sql = "SELECT postidto FROM recognize_tb WHERE pactid=" + this.H_G_Sess.pactid + " AND postidfrom=" + this.H_G_Sess.postid;
		return this.get_DB().queryHash(sql);
	}

	getOrderPattern() {
		var sql = "SELECT " + "shcar.carid," + "shcar.shopid," + "shcar.arid," + "shrel.memid," + "ptn.type," + "ptn.ptnname," + "ptn.tplfile," + "ptn.cirid," + "ptn.ppid," + "car.carname " + "FROM " + "shop_relation_tb shrel INNER JOIN mt_order_pattern_tb ptn ON shrel.carid=ptn.carid " + "INNER JOIN shop_carrier_tb shcar ON shcar.shopid=shrel.shopid and shrel.carid=shcar.carid " + "INNER JOIN carrier_tb car ON shcar.carid=car.carid " + "WHERE " + "shrel.pactid = " + this.H_G_Sess.pactid + " " + "AND shrel.postid = " + this.H_G_Sess.postid + " " + "AND ptn.show = true " + "ORDER BY " + "ptn.ptn_order";
		return this.get_DB().queryHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};