//
//注文必須情報入力画面（電話番号入力）プロセス
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

require("view/Order/OrderInputTelView.php");

require("model/Order/OrderInputModelBase.php");

require("model/Order/OrderTelInfoModel.php");

require("model/PostModel.php");

require("model/Order/OrderModelBase.php");

require("model/ValidateAuthority/Order/OrderByCategory.php");

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
class OrderInputTelProc extends OrderInputProcBase {
	static PUB = "/MTOrder";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new OrderInputTelView();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//modelオブジェクトの生成
	//ログインチェック
	//用途別注文チェック
	//セッション情報取得（ローカル）
	//権限一覧取得
	//不要セッション削除
	//表示に必要なものを格納する配列を取得
	//フォーム部品生成
	//×ホットラインでドコモ、AUのプラン変の場合、またはAUの移行の場合、回線種別選択ラジオボタン
	//ホットラインでドコモ、AUのプラン変の場合、回線種別選択ラジオボタン
	//件数をカウント
	//$telcount = $O_view->countTel();
	//電話存在チェック
	//電話詳細情報取得
	//セッション再取得
	//注文フォームのデフォルト値作成、セット
	//デフォルトチェックをはずす
	//		if ("H" == PACTTYPE && 3 == $H_sess[self::PUB]["carid"] && "S" == $H_sess[self::PUB]["type"]) {
	//			if (!isset($H_sess[self::PUB]["cirid"]) || "78" != $H_sess[self::PUB]["cirid"]) {
	//				$ciridradio = "9";
	//			} else {
	//				$ciridradio = $H_sess[self::PUB]["cirid"];
	//			}
	//			$H_view["O_InputFormUtil"]->setDefaultsWrapper( array("ciridradio" => $ciridradio));
	//		}
	//パンくずリンクの生成（セッション再取得があるためここに置く）
	//CSSの決定
	//フォームにエラーが無い
	//if( $H_view["O_InputFormUtil"]->validateWrapper() == true && 1 > count($A_alert) ){
	{
		var O_view = this.get_View();
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
		O_view.makeInputForm(O_order, O_model, H_sess, H_g_sess);

		if ("H" == PACTTYPE) {
			if (-1 !== ["C", "P", "S"].indexOf(H_sess[OrderInputTelProc.PUB].type)) {
				O_view.makeFormCiridRadio(O_model, H_sess[OrderInputTelProc.PUB].carid);
			}
		}

		if ("H" == PACTTYPE && "P" == H_sess[OrderInputTelProc.PUB].type) {
			O_view.makeFormBuyselidSelect(O_model, H_sess[OrderInputTelProc.PUB].carid);
		}

		O_view.makeInputRule();
		var A_alert = Array();

		if (true == (undefined !== H_sess.SELF)) {
			var H_chkresult = O_info.isTheTelExists(H_g_sess.pactid, H_sess[OrderInputTelProc.PUB].carid, H_sess.SELF);

			for (var key in H_chkresult) {
				var val = H_chkresult[key];

				if (val.exist == false && "H" != PACTTYPE) {
					A_alert[key] = "\u96FB\u8A71\u756A\u53F7\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F";
				} else if (val.exist == 0 && "H" != PACTTYPE) {
					A_alert[key] = "\u3053\u306E\u756A\u53F7\u306F\u5B58\u5728\u3057\u307E\u305B\u3093";
				} else if (val.exist == 1) {
					A_alert[key] = "\u3053\u306E\u756A\u53F7\u306F\u30AD\u30E3\u30EA\u30A2\u304C\u9055\u3044\u307E\u3059";
				}
			}
		}

		var O_post = new PostModel();
		var A_post = O_post.getChildList(H_g_sess.pactid, H_g_sess.postid);
		var H_telinfo = O_info.checkTelInfo(H_sess, H_g_sess);

		if (true == Array.isArray(H_telinfo) && 0 < H_telinfo.length) {
			for (var key in H_telinfo) {
				var val = H_telinfo[key];

				if (val.alert != "" && "H" != PACTTYPE) {
					A_alert[str_replace("telno", "", key)] = val.alert;
				} else //配下の部署になかったら弾く
					{
						if (false == (-1 !== A_post.indexOf(+val.postid)) && "H" != PACTTYPE) {
							A_alert[str_replace("telno", "", key)] = "\u6709\u52B9\u306A\u756A\u53F7\u3067\u306F\u3042\u308A\u307E\u305B\u3093";
						}
					}
			}
		}

		if ("H" != PACTTYPE) {
			var A_cir_alert = O_info.checkTelInfoOrderType(H_telinfo, H_sess, H_g_sess);

			if (true == Array.isArray(A_cir_alert) && 0 < A_cir_alert.length) {
				for (var key in A_cir_alert) {
					var val = A_cir_alert[key];

					if (val.alert != "") {
						A_alert[str_replace("telno", "", key)] = val.alert;
					}
				}
			}
		}

		if ("H" == PACTTYPE) {
			if (true == Array.isArray(H_telinfo)) {
				for (var tk in H_telinfo) {
					var tv = H_telinfo[tk];
					H_tmp_telinfo[tk].telno = H_telinfo[tk].telno;
					H_tmp_telinfo[tk].telno_view = H_telinfo[tk].telno_view;

					if ("" != H_telinfo[tk].buyselid) {
						H_tmp_telinfo[tk].buyselid = H_telinfo[tk].buyselid;
					}
				}

				H_telinfo = H_tmp_telinfo;
			}
		}

		if (res && Array.isArray(H_telinfo)) {
			for (var key in H_telinfo) {
				var value = H_telinfo[key];

				if (value.division !== O_model.orderByCategoryPattern) {
					if (!A_alert[str_replace("telno", "", key)]) {
						switch (O_model.orderByCategoryPattern) {
							case 1:
								A_alert[str_replace("telno", "", key)] = "\u696D\u52D9\u7528\u3067\u306F\u3042\u308A\u307E\u305B\u3093";
								break;

							case 2:
								A_alert[str_replace("telno", "", key)] = "\u30C7\u30E2\u7528\u3067\u306F\u3042\u308A\u307E\u305B\u3093";
								break;
						}
					}
				}
			}
		}

		if (true == Array.isArray(H_telinfo) && 0 < H_telinfo.length && 1 > A_alert.length) {
			O_view.setTelInfoSession(H_telinfo, H_sess[OrderInputTelProc.PUB].cirid);
		}

		O_view.setOrderPatternSession(O_model);
		H_sess = O_view.getLocalSession();
		H_view.O_InputFormUtil.setDefaultsWrapper(H_sess.SELF);

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_order.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), MT_SITE, H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), MT_SITE);
		}

		H_view.css = O_view.getCSS(site_flg);

		if (H_view.O_InputFormUtil.validateWrapper() == true && 1 > A_alert.length) {
			header("Location: " + dirname(_SERVER.PHP_SELF) + "/order_form.php");
			throw die();
		} else //Smartyによる表示
			{
				O_view.displaySmarty(H_sess, A_auth, A_alert);
			}
	}

	__destruct() {
		super.__destruct();
	}

};