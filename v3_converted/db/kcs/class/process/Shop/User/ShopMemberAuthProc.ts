//error_reporting(E_ALL|E_STRICT);
//
//ショップメンバー権限変更
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Shop
//@author nakanita
//@since 2008/02/08
//
//
//
//ショップメンバー権限変更
//
//@uses ProcessBaseHtml
//@package Shop
//@author nakanita
//@since 2008/02/08
//

require("process/ProcessBaseHtml.php");

require("model/Shop/MemberModel.php");

require("model/ShopFuncModel.php");

require("view/Shop/User/ShopMemberAuthView.php");

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
class ShopMemberAuthProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//model の生成
	//セッション情報取得
	//表示に必要なものを格納する配列を取得
	//対象となるメンバーＩＤをセットする
	//包括対応 20081212miya
	//販売店選択のGETを受ける
	//メンバー権限一覧を得る
	//包括対応 20081212miya
	//フォームの作成
	//フォームルールの作成
	//フォームのデフォルト値をセットする
	//フォームにエラーが無い
	{
		var O_view = new ShopMemberAuthView();
		O_view.startCheck();
		var O_model = new MemberModel(this.get_DB());
		var O_authmodel = new ShopFuncModel(this.get_DB());
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getSelfSession();
		var H_view = O_view.getView();
		H_view.memid = H_sess.get.memid;
		H_view.mode = H_sess.get.mode;
		var shopid = H_g_sess.shopid;

		if ("" != H_sess.get.shopid) {
			shopid = H_sess.get.shopid;
		}

		var H_user = O_model.getMemberInfo(H_sess.get.memid);
		var H_auth = O_authmodel.getUserFuncList(shopid, H_sess.get.memid);
		O_view.makeAuthForm(H_user, H_auth);
		O_view.makeAuthRule();
		var def_value = O_view.defaultAuthForm(H_auth);

		if (H_view.O_FormUtil.validateWrapper() == true) //メンバー情報更新
			//セッション情報をクリアー
			{
				if (H_sess.post.mode == "update") //権限情報を更新する
					//変更完了
					{
						if (O_model.updateMemberAuth(shopid, H_sess.get.memid, H_sess.post) == false) //包括対応 20081212miya
							//エラー画面 * ここのエラー、* ToDo * もう少し別のものにしたい
							{
								this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Shop/menu.php");
							}

						if (H_sess.post.passwd != "") //パスワードがあったなら
							{
								if (O_model.updatePassword(H_sess.get.memid, H_sess.post.passwd) == false) //エラー画面 * ここのエラー、* ToDo * もう少し別のものにしたい
									{
										this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Shop/menu.php");
									}
							}

						H_view.changed = true;
					}

				var H_mnglog = {
					shopid: O_view.gSess().shopid,
					groupid: O_view.gSess().groupid,
					memid: O_view.gSess().memid,
					name: O_view.gSess().personname,
					postcode: O_view.gSess().postcode,
					comment1: "ID:" + O_view.gSess().memid,
					comment2: "\u30E1\u30F3\u30D0\u30FCID:" + H_sess.get.memid + "\u306E\u6A29\u9650\u30FB\u30D1\u30B9\u30EF\u30FC\u30C9\u306E\u5909\u66F4",
					kind: "User",
					type: "\u30E1\u30F3\u30D0\u30FC\u7BA1\u7406\u6A29\u9650\u5909\u66F4",
					joker_flag: 0
				};
				this.getOut().writeShopMnglog(H_mnglog);
				delete H_sess.post;
			}

		O_view.displaySmarty();
	}

};