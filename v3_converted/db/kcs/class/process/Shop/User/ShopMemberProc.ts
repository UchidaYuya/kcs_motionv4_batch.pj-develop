//error_reporting(E_ALL|E_STRICT);
//
//プロセス実装のサンプル
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Sample
//@author nakanita
//@since 2008/02/08
//
//
//包括対応 20081212miya
//
//プロセス実装のサンプル
//
//@uses ProcessBaseHtml
//@package Sample
//@author nakanita
//@since 2008/02/08
//

require("process/ProcessBaseHtml.php");

require("model/ShopModel.php");

require("model/Shop/MemberModel.php");

require("view/Shop/User/ShopMemberView.php");

require("view/ViewFinish.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@access protected
//@return void
//
class ShopMemberProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//セッション情報取得
	//表示に必要なものを格納する配列を取得
	//包括対応 20081212miya
	//配下の販売店取得
	//販売店選択のPOSTを受ける
	//パンくずリンクの生成 * ToDo * できればViewにもってゆく
	//ショップ名、メンバー名の表示 * ToDo * できればViewにもってゆく
	//JavaScript を入れる * ToDo * できればViewにもってゆく
	//メンバー情報を得る
	//包括対応 20081212miya
	//フォームにエラーが無い
	{
		var O_view = new ShopMemberView();
		O_view.startCheck();
		var O_model = new MemberModel(this.get_DB());
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getSelfSession();
		var H_view = O_view.getView();
		var O_shopmodel = new ShopModel();
		var H_support = O_shopmodel.getIncludeShopWithName(H_g_sess.shopid, true);
		var shopid = H_g_sess.shopid;

		if ("" != H_sess.post.shopid) {
			shopid = H_sess.post.shopid;
		}

		H_view.H_support = H_support;
		H_view.selected_shopid = shopid;
		H_view.page_path = "<li class=\"csNavi\"><a href=\"/Shop/menu.php\" class=\"csNavi\">SHOP MENU</a> &gt; <span class=\"csNavi\">\u30B7\u30E7\u30C3\u30D7\u30E1\u30F3\u30D0\u30FC\u7BA1\u7406</span></li>";
		H_view.shop_person = H_g_sess.shopname + " " + H_g_sess.personname;
		H_view.js = "<script src=\"/js/cancel.js\" type=\"text/javascript\"></script>";
		H_view.title = "\u30B7\u30E7\u30C3\u30D7\u30E1\u30F3\u30D0\u30FC\u7BA1\u7406";
		var H_member = O_model.getMemberList(shopid);
		H_view.members = H_member;

		if (undefined !== H_sess.post.typ == true && H_sess.post.typ != "") //メンバー情報更新
			//包括対応 20081212miya
			//タイプ情報をクリアー
			{
				if (H_sess.post.typ == "mod") //管理記録
					{
						var idx = +H_sess.post.idx;

						if (O_model.updateMemberInfo(H_sess.post.memid, H_member[idx], H_sess.post) == false) //エラー画面 * ここのエラー、* ToDo * もう少し別のものにしたい
							{
								this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Shop/menu.php");
							}

						H_view.message = O_model.getErrorMessage();
						var H_mnglog = {
							shopid: O_view.gSess().shopid,
							groupid: O_view.gSess().groupid,
							memid: O_view.gSess().memid,
							name: O_view.gSess().personname,
							postcode: O_view.gSess().postcode,
							comment1: "ID:" + O_view.gSess().memid,
							comment2: "\u30E1\u30F3\u30D0\u30FCID:" + H_sess.post.memid + "\u306E\u30E1\u30F3\u30D0\u30FC\u60C5\u5831\u3092\u7DE8\u96C6",
							kind: "User",
							type: "\u30E1\u30F3\u30D0\u30FC\u7BA1\u7406",
							joker_flag: 0
						};
						this.getOut().writeShopMnglog(H_mnglog);
					} else if (H_sess.post.typ == "new") //管理記録
					{
						if (O_model.createMember(H_sess.post, shopid, "US", H_member) == false) //エラー画面 * ここのエラー、* ToDo * もう少し別のものにしたい
							{
								this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Shop/menu.php");
							}

						H_view.message2 = O_model.getErrorMessage();
						H_mnglog = {
							shopid: O_view.gSess().shopid,
							groupid: O_view.gSess().groupid,
							memid: O_view.gSess().memid,
							name: O_view.gSess().personname,
							postcode: O_view.gSess().postcode,
							comment1: "ID:" + O_view.gSess().memid,
							comment2: "\u65B0\u898F\u30E1\u30F3\u30D0\u30FC\u3092\u8FFD\u52A0",
							kind: "User",
							type: "\u30E1\u30F3\u30D0\u30FC\u7BA1\u7406",
							joker_flag: 0
						};
						this.getOut().writeShopMnglog(H_mnglog);
					} else if (H_sess.post.typ == "del") //管理記録
					{
						if (O_model.deleteMember(shopid, H_sess.post.memid) == false) //包括対応 20081212miya
							//エラー画面 * ここのエラー、* ToDo * もう少し別のものにしたい
							{
								this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Shop/menu.php");
							}

						H_view.message = O_model.getErrorMessage();
						H_mnglog = {
							shopid: O_view.gSess().shopid,
							groupid: O_view.gSess().groupid,
							memid: O_view.gSess().memid,
							name: O_view.gSess().personname,
							postcode: O_view.gSess().postcode,
							comment1: "ID:" + O_view.gSess().memid,
							comment2: "\u30E1\u30F3\u30D0\u30FCID:" + H_sess.post.memid + "\u306E\u30E1\u30F3\u30D0\u30FC\u60C5\u5831\u3092\u524A\u9664",
							kind: "User",
							type: "\u30E1\u30F3\u30D0\u30FC\u7BA1\u7406",
							joker_flag: 0
						};
						this.getOut().writeShopMnglog(H_mnglog);
					}

				H_member = O_model.getMemberList(shopid);
				H_view.members = H_member;
				O_view.resetSelfSessionTyp();
			}

		O_view.displaySmarty();
	}

};