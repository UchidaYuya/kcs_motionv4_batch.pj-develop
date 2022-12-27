//
//発送先画面プロセス
//
//更新履歴：<br>
//2009/08/14 宮澤龍彦 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2009/08/14
//
//
//error_reporting(E_ALL|E_STRICT);
//
//プロセス実装
//
//@uses ProcessBaseHtml
//@package Order
//@author miyazawa
//@since 2009/08/14
//

require("process/ProcessBaseHtml.php");

require("view/Order/ShiptoView.php");

require("model/Order/ShiptoModel.php");

require("model/Order/OrderModelBase.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author miyazawa
//@since 2008/04/01
//
//@access protected
//@return void
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2008/04/01
//
//@access protected
//@return void
//
//
//プロセス処理の実質的なメイン<br>
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_param
//@protected
//@access protected
//@return void
//@uses
//@uses
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
class ShiptoProc extends ProcessBaseHtml {
	static PUB = "/MTOrder";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ShiptoView();
	}

	get_Model() {
		return new ShiptoModel();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//お客様か販売店か
	//modelオブジェクトの生成
	//ログインチェック
	//CGIパラメータ取得
	//セッション情報取得（ローカル）
	//shiptoidが飛んできたとき
	//一覧がないときは反映ボタンを不活性に
	{
		var O_view = this.get_View();
		var site_flg = OrderModelBase.SITE_USER;

		if (H_param.site == "shop") {
			site_flg = OrderModelBase.SITE_SHOP;
			var H_g_sess = O_view.getGlobalShopSession();
		} else {
			H_g_sess = O_view.getGlobalSession();
		}

		O_view.setSiteMode(site_flg);
		O_view.H_View.site_flg = site_flg;
		var O_model = this.get_Model();
		O_view.startCheck();
		O_view.checkCGIParam();
		var H_sess = O_view.getLocalSession();

		if (O_view.H_View.shiptoid != "" && O_view.H_View.shiptoid != undefined) //削除
			{
				if (+(O_view.H_View.del == 1)) {
					if (+(O_view.H_View.shiptoid != undefined)) {
						var result = O_model.delShipto(O_view.H_View.pactid, O_view.H_View.unittype, O_view.H_View.unitid, O_view.H_View.shiptoid);
					}

					if (result == false) {
						if ("ENG" == H_g_sess.language) {
							O_view.H_View.message = "<p><img src='/images/navi.gif' border=0 align=absmiddle>Unable to Delete.</p>";
						} else {
							O_view.H_View.message = "<p><img src='/images/navi.gif' border=0 align=absmiddle>\u767A\u9001\u5148\u304C\u524A\u9664\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F</p>";
						}
					} else {
						if ("ENG" == H_g_sess.language) {
							O_view.H_View.message = "<p><img src='/images/navi.gif' border=0 align=absmiddle>Deletion is completed.</p>";
						} else {
							O_view.H_View.message = "<p><img src='/images/navi.gif' border=0 align=absmiddle>\u767A\u9001\u5148\u3092\u4E00\u4EF6\u524A\u9664\u3057\u307E\u3057\u305F</p>";
						}
					}
				} else if (+(O_view.H_View.set == 1)) {
					O_view.H_View.H_shiprow = O_model.getShiptoList(O_view.H_View.pactid, O_view.H_View.unittype, O_view.H_View.unitid, O_view.H_View.shiptoid);
				}
			}

		if (+(O_view.H_View.ins == 1)) {
			var H_addData = Array();
			H_addData.pactid = O_view.H_View.pactid;
			H_addData.username = O_view.H_View.username;
			H_addData.postname = O_view.H_View.postname;
			H_addData.ziphead = O_view.H_View.ziphead;
			H_addData.ziptail = O_view.H_View.ziptail;
			H_addData.pref = O_view.H_View.pref;
			H_addData.addr = O_view.H_View.addr;
			H_addData.building = O_view.H_View.building;
			H_addData.telno = O_view.H_View.telno;
			O_model.addShipto(O_view.H_View.unittype, O_view.H_View.unitid, H_addData);
		}

		var H_list = O_model.getShiptoList(O_view.H_View.pactid, O_view.H_View.unittype, O_view.H_View.unitid);

		if (H_list.length < 1) {
			if ("ENG" == H_g_sess.language) {
				O_view.H_View.error_message = "<p><img src='/images/navi.gif' border=0 align=absmiddle>No Data</p>";
			} else {
				O_view.H_View.error_message = "<p><img src='/images/navi.gif' border=0 align=absmiddle>\u767A\u9001\u5148\u306F\u307E\u3060\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093</p>";
			}
		}

		O_view.H_View.H_list = H_list;

		if (O_view.H_View.error_message != "") {
			O_view.H_View.disableflg = "DISABLED";
		}

		O_view.displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};