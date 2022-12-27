//
//注文必須情報入力画面（MNP）プロセス
//
//更新履歴：<br>
//2008/04/17 宮澤龍彦 作成
//
//@uses OrderInputProcBase
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2008/04/17
//
//
//error_reporting(E_ALL|E_STRICT);
//
//プロセス実装
//
//@uses OrderInputProcBase
//@package Order
//@author miyazawa
//@since 2008/04/17
//

require("process/Order/OrderInputProcBase.php");

require("view/Order/OrderInputMNPView.php");

require("model/Order/OrderInputModelBase.php");

require("model/ValidateAuthority/Order/OrderByCategory.php");

require("model/PostModel.php");

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
class OrderInputMNPProc extends OrderInputProcBase {
	static PUB = "/MTOrder";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new OrderInputMNPView();
	}

	get_Post() {
		return new PostModel();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//postオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//modelオブジェクトの生成
	//ログインチェック
	//用途別注文チェック
	//セッション情報取得（ローカル）
	//権限一覧取得
	//不要セッション削除
	//表示に必要なものを格納する配列を取得
	//ツリー作成
	//セッション再取得
	//CSSの決定
	//電話番号から登録部署取得 20090929miya
	//登録部署を設定
	//電話が単一の部署に所属していたときのみ、電話の部署を登録部署とする 20090929miya
	//登録部署をSESSIONに入れる 20090929miya
	//これをやらないとツリーから入力した部署によって上書きされてしまい、電話情報から部署が取得できない
	//セッション再取得
	//フォーム部品生成
	//入力チェック生成
	//hiddenで登録部署パラメータ作成
	//注文フォームのデフォルト値作成、セット
	//件数をカウント
	//sessionの有無を確認
	//SESSIONがあるかはViewで見ないとダメ。
	//表示するキャリア名、注文種別をSESSIONに入れる
	//スタティック表示作成
	//セッション再取得
	//パンくずリンクの生成（セッション再取得があるためここに置く）
	//フォームにエラーが無い
	{
		var O_view = this.get_View();
		var O_post = this.get_Post();
		var H_g_sess = O_view.getGlobalSession();
		var site_flg = OrderModelBase.SITE_USER;

		if (H_param.site == "shop") {
			site_flg = OrderModelBase.SITE_SHOP;
			var H_g_shop_sess = O_view.getGlobalShopSession();
			H_g_sess = H_g_sess + H_g_shop_sess;
		}

		var O_order = OrderUtil.singleton();
		var O_model = this.get_Model(H_g_sess, site_flg);
		var O_info = this.get_TelInfoModel(H_g_sess, site_flg);
		O_view.setSiteMode(site_flg);
		O_view.startCheck();
		O_model.setValidateAuthority(new ValidateAuthorityOrderOrderByCategory());
		var res = O_model.checkOrderByCategory();

		if (is_null(res)) {
			header("Location: /Menu/menu.php");
			throw die();
		} else {
			O_model.setOrderByCategoryFlag(res);
			O_view.setOrderByCategory(res);
		}

		var H_sess = O_view.getLocalSession();
		var A_auth = O_model.get_AuthIni();
		O_view.clearUnderSession();
		var H_view = O_view.get_View();
		H_view.H_tree = O_model.getOrderTreeJS(H_sess[OrderInputMNPProc.PUB]);
		H_view.js = H_view.H_tree.js;
		H_sess = O_view.getLocalSession();
		H_view.css = O_view.getCSS(site_flg);
		var A_postid = O_info.getRecogpostid(H_sess, H_g_sess);

		if (true == Array.isArray(A_postid) && 1 == A_postid.length && true == is_numeric(A_postid[0])) //それ以外はツリーから選択した部署
			//実際にはこっちを通っても下のcheckTelInfoMNPで複数部署のMNPは撥ねられる
			{
				H_view.recogpostid = A_postid[0];
			} else {
			H_view.recogpostid = O_view.makeRecogPostid(H_sess, H_g_sess);
		}

		H_view.recogpostname = O_model.getPostNameString(H_view.recogpostid);
		O_view.setRecogPost();
		H_sess = O_view.getLocalSession();
		O_view.makeInputForm(O_order, O_model, H_sess, O_info, A_auth);
		O_view.makeInputRule();
		O_view.makeHiddenParam();
		H_view.O_InputFormUtil.setDefaultsWrapper(H_sess.SELF);
		var telcount = O_view.countTel();
		O_view.setOrderPatternSession(O_model);
		O_view.makeFormStatic(H_g_sess);
		H_sess = O_view.getLocalSession();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_order.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), MT_SITE, H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), MT_SITE);
		}

		var A_alert = Array();

		if (H_view.O_InputFormUtil.validateWrapper() == true) //電話存在チェックと詳細情報取得
			//他部署に所属する電話のMNP許可のため$site_flgを引数に追加 20091006miya
			{
				if (OrderModelBase.SITE_SHOP == site_flg) {
					var applypostid = H_view.recogpostid;
				} else {
					applypostid = H_g_sess.postid;
				}

				if (res != false) {
					O_info.setOrderByCategoryFlag(res);
				}

				var H_telinfo = O_info.checkTelInfoMNP(H_sess, H_g_sess, applypostid, site_flg);

				if (true == Array.isArray(H_telinfo) && 0 < H_telinfo.length) {
					for (var key in H_telinfo) {
						var val = H_telinfo[key];
						var idx = str_replace("telno", "", key);
						var alert = "";

						if (val.alert != "") {
							alert = val.alert;
						}

						if (!alert) //mnp予約番号の必須入力チェックと有効日の必須チェック
							{
								if (-1 !== A_auth.indexOf("fnc_mnp_req")) {
									if (!H_sess.SELF["mnpno_" + idx]) {
										alert += "MNP\u4E88\u7D04\u756A\u53F7\u306F\u5FC5\u9808\u3067\u3059<br>";
									}

									if (-1 !== A_auth.indexOf("fnc_mnp_date_show")) {
										var temp = H_sess.SELF["mnp_enable_date_" + idx].Y + H_sess.SELF["mnp_enable_date_" + idx].m + H_sess.SELF["mnp_enable_date_" + idx].d;

										if (temp == "") {
											alert += "MNP\u4E88\u7D04\u756A\u53F7\u6709\u52B9\u65E5\u306F\u5FC5\u9808\u3067\u3059<br>";
										}
									}
								}
							}

						if (alert != "") {
							A_alert[idx] = alert;
						}
					}
				}

				if (true == Array.isArray(H_telinfo) && 0 < H_telinfo.length && 1 > A_alert.length) {
					O_view.setTelInfoSession(H_telinfo);
				}

				if (1 > A_alert.length) {
					H_view.recogpostname = O_post.getPostNameOne(H_view.recogpostid);
					O_view.setRecogPost();
					header("Location: " + dirname(_SERVER.PHP_SELF) + "/order_form.php");
					throw die(0);
				} else {
					O_view.displaySmarty(H_sess, A_auth, A_alert);
				}
			} else //Smartyによる表示
			{
				O_view.displaySmarty(H_sess, A_auth, A_alert);
			}
	}

	__destruct() {
		super.__destruct();
	}

};