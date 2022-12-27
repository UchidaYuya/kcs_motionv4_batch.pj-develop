//error_reporting(E_ALL|E_STRICT);
//
//プロセス実装のサンプル
//
//更新履歴：<br>
//2008/02/08	中西達夫	作成<br>
//2009/01/21	石崎公久	管理記録出力<br>
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

require("view/Shop/User/ChgPasswordView.php");

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
class ChgPasswordProc extends ProcessBaseHtml {
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
	//フォームの作成
	//フォームルールの作成
	//フォームのデフォルト値をセット
	//(今回はDB不要だったのでView内でチェックした)
	//変更完了メッセージの有無
	//フォームにエラーが無い
	{
		var O_view = new ChgPasswordView();
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

		var memid = H_g_sess.memid;

		if ("" != H_sess.post.memid) {
			memid = H_sess.post.memid;
		}

		if (true == Array.isArray(H_support) && true == 0 < H_support.length) {
			var H_member_tmp = O_model.getMemberList(shopid);

			if (true == Array.isArray(H_member_tmp) && true == 0 < H_member_tmp.length) {
				var H_member = Array();

				for (var member of Object.values(H_member_tmp)) {
					H_member[member.memid] = member.username;
				}

				H_view.H_member = H_member;
			}
		}

		H_view.H_support = H_support;
		H_view.selected_shopid = shopid;
		H_view.selected_memid = memid;
		H_view.page_path = "<li class=\"csNavi\"><a href=\"/Shop/menu.php\" class=\"csNavi\">SHOP MENU</a> &gt; <span class=\"csNavi\">\u30D1\u30B9\u30EF\u30FC\u30C9\u5909\u66F4</span></li>";
		H_view.shop_person = H_g_sess.shopname + " " + H_g_sess.personname;
		H_view.js = "<script src=\"/js/cancel.js\" type=\"text/javascript\"></script>";
		H_view.title = "\u30D1\u30B9\u30EF\u30FC\u30C9\u5909\u66F4";
		var H_user = O_model.getMemberInfo(memid);
		O_view.makePassForm(H_user);
		O_view.makePassRule();
		var def_value = O_view.defaultPassForm(H_user);
		H_view.O_FormUtil.setDefaultsWrapper(def_value);

		if (H_sess.select_flg == false) //包括対応 20081212miya
			{
				O_view.checkInputError(H_sess.post.old_passwd, H_sess.post.passwd, H_user);
			}

		H_view.changed = false;

		if (H_view.O_FormUtil.validateWrapper() == true && H_sess.select_flg == false) //包括対応 20081212miya
			//ユーザー情報を更新
			//もしパスワードが空でなければ
			{
				if (O_model.updateMemberInfo(memid, H_user, H_sess.post) == false) //包括対応 20081212miya
					//エラー画面 * ここのエラー、* ToDo * もう少し別のものにしたい
					{
						this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Shop/menu.php");
					} else //変更完了
					{
						H_view.changed = true;
						var H_mnglog = {
							shopid: O_view.gSess().shopid,
							groupid: O_view.gSess().groupid,
							memid: O_view.gSess().memid,
							name: O_view.gSess().personname,
							postcode: O_view.gSess().postcode,
							comment1: "ID:" + O_view.gSess().memid,
							comment2: "\u30E1\u30F3\u30D0\u30FCID:" + memid + "\u306E\u30E1\u30F3\u30D0\u30FC\u60C5\u5831\u3092\u66F4\u65B0",
							kind: "User",
							type: "\u30E1\u30F3\u30D0\u30FC\u7BA1\u7406",
							joker_flag: 0
						};

						if (shopid != O_view.gSess().shopid) {
							H_mnglog.comment2 += "\uFF08" + H_support[shopid] + "\uFF09";
						}

						this.getOut().writeShopMnglog(H_mnglog);
					}

				if (H_sess.post.passwd != "") //パスワード更新
					{
						if (O_model.updatePassword(memid, H_sess.post.passwd) == true) //包括対応 20081212miya
							//変更完了
							{
								H_view.changed = true;
								H_mnglog = {
									shopid: O_view.gSess().shopid,
									groupid: O_view.gSess().groupid,
									memid: O_view.gSess().memid,
									name: O_view.gSess().personname,
									postcode: O_view.gSess().postcode,
									comment1: "ID:" + O_view.gSess().memid,
									comment2: "\u30E1\u30F3\u30D0\u30FCID:" + memid + "\u306E\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u66F4\u65B0",
									kind: "User",
									type: "\u30E1\u30F3\u30D0\u30FC\u7BA1\u7406",
									joker_flag: 0
								};

								if (shopid != O_view.gSess().shopid) {
									H_mnglog.comment2 += "\uFF08" + H_support[shopid] + "\uFF09";
								}

								this.getOut().writeShopMnglog(H_mnglog);
							} else //エラー画面 * ここのエラー、* ToDo * もう少し別のものにしたい
							{
								this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Shop/menu.php");
							}
					}
			}

		O_view.displaySmarty();
	}

};