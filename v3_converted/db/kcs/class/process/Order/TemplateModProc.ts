//
//注文雛型変更Proc
//
//更新履歴：<br>
//2008/07/17 宮澤龍彦 作成
//
//@uses OrderFormProc
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2008/07/17
//
//
//error_reporting(E_ALL|E_STRICT);
//
//注文雛型変更Proc
//
//@uses OrderFormProc
//@package Order
//@author miyazawa
//@since 2008/07/17
//

require("process/Order/TemplateAddProc.php");

require("model/Order/TemplateModModel.php");

require("model/Order/TemplateModifyModel.php");

require("view/Order/TemplateModView.php");

require("view/Order/TemplateTelInfoView.php");

require("MtAuthority.php");

require("model/WriteShopActlog.php");

require("model/PactModel.php");

require("model/Order/fjpModel.php");

require("MtUniqueString.php");

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
//@since 2008/04/17
//
//@access protected
//@return void
//
//
//雛型画面の電話詳細情報入力欄用Viewオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@access protected
//@return void
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2008/07/08
//
//@param array $H_g_sess
//@access protected
//@return void
//
//
//注文修正Modelオブジェクト取得
//
//@author miyazawa
//@since 2008/07/08
//
//@param array $H_g_sess
//@access protected
//@return void
//
//
//プロセス処理の実質的なメイン<br>
//
//@author miyazawa
//@since 2008/07/08
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
class TemplateModProc extends TemplateAddProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TemplateModView();
	}

	get_TemplateTelInfoView() {
		return new TemplateTelInfoView();
	}

	get_Model(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new TemplateModModel(O_db0, H_g_sess, site_flg);
	}

	get_TemplateModifyModel(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new TemplateModifyModel(O_db0, H_g_sess, site_flg);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//$O_model = $this->get_Model( $H_g_sess, $O_order, $site_flg );
	//shop_mnglog 20090216miya
	//ログインチェック
	//セッション情報取得（ローカル）
	//権限一覧取得
	//英語化権限 20090210miya
	//テンプレートの削除の処理はここから
	//ツリー作成
	//パンくずリンクの生成
	//CSSの決定
	//Smartyテンプレートの取得（order_formとは異なり、ModelではなくViewから取得している）
	//登録部署がなければ設定
	//if文追加 20090204miya
	//$H_sess をデバッグ
	//雛型の中身を作り直す場合
	//ディレクトリセッションに「H_product」として入れる
	//order_item_tbからフォーム表示項目を取得する
	//雛型用のマスク作成
	//電話詳細情報入力フォーム作成
	//1は電話のユーザ設定項目
	//電話詳細情報を表示するのは新規、機変、移行かつお客様側
	//スマートフォンには表示なし 20090119miya
	//付属品のmask追加する D053 付属品マスク
	//fjp用発注種別:納品先特別処理
	//フォームオブジェクトを生成してフォーム要素を入れる
	//mt_order_rule_tbから入力ルールを取得する
	//fjp以外ならfjp用ルール削除
	//ＤＢから取得したルールと予備項目のルールをマージする
	//hiddenで登録部署パラメータ作成
	//既定の雛型選択項目作成
	//商品リストクリアボタン 20091116miya
	//オプションに指定割がない場合、ルールから指定割のルールを除外するため、ここでオプションを取得（除外しないと機種によってJavaScriptエラーになる）
	//入力ルールをフォームオブジェクトに入れる
	//ルート部署取得
	//部署ツリー文字列取得
	//エラーメッセージ
	//NG・必須チェック
	//スタティック表示作成
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var O_telinfo_view = this.get_TemplateTelInfoView();
		var H_g_sess = O_view.getGlobalSession();
		var site_flg = OrderModelBase.SITE_USER;

		if (H_param.site == "shop") {
			site_flg = OrderModelBase.SITE_SHOP;
			var H_g_shop_sess = O_view.getGlobalShopSession();
			H_g_sess = H_g_sess + H_g_shop_sess;
		}

		this.O_unique = MtUniqueString.singleton();
		var O_order = OrderUtil.singleton(H_g_sess);
		var O_model = this.get_Model(H_g_sess, site_flg);
		var O_telinfo_model = this.get_OrderTelInfoModel(H_g_sess, site_flg);
		var O_template_modify_model = this.get_TemplateModifyModel(H_g_sess, site_flg);

		if (H_param.site == "shop") {
			var O_mnglog = WriteShopActlog.singleton();
			var O_pact = new PactModel();
		}

		O_view.setSiteMode(site_flg);
		O_view.startCheck();
		var H_sess = O_view.getLocalSession();
		H_sess = O_model.changeTemplate(H_sess);
		var A_auth = O_model.get_AuthIni();

		var O_fjp = this._getfjpModel(A_auth);

		O_view.setfjpModelObject(O_fjp);

		if ("ENG" == H_g_sess.language && "shop" != H_param.site) //ローカルセッション取り直し
			{
				O_view.setEnglish(true);
				H_sess = O_view.getLocalSession();
				H_sess = O_model.changeTemplate(H_sess);
			}

		var O_oimb = new OrderInputModelBase(O_db0, H_g_sess, site_flg);
		var orderpatern = O_oimb.getOrderPatternName(H_sess[TemplateModProc.PUB]);
		O_view.setPtnWord(orderpatern);
		O_view.setShop(orderpatern);
		H_sess = O_view.getLocalSession();
		H_sess = O_model.changeTemplate(H_sess);

		if (H_sess.SELF.mode == "del") {
			if (H_sess.SELF.tempid != "") {
				if (this.O_unique instanceof MtUniqueString) {
					this.O_unique.validate(H_sess.SELF.csrfid_del);
				}

				if (O_model.delTemplateData(H_sess.SELF.tempid) == true) //shop_mnglog 20090216miya
					{
						if (H_param.site == "shop") //管理記録書き込み
							{
								var H_mnglog = {
									shopid: H_g_sess.shopid,
									groupid: H_g_sess.groupid,
									memid: H_g_sess.memid,
									name: H_g_sess.personname,
									postcode: H_g_sess.postcode,
									comment1: "ID:" + H_g_sess.memid,
									comment2: O_pact.getCompname(H_g_sess.pactid) + " V3\u96DB\u578BID:" + H_sess[TemplateModProc.PUB].tempid + "\u3092\u524A\u9664",
									kind: "MTHLTemplate",
									type: "V3Hotline\u6CE8\u6587\u96DB\u578B",
									joker_flag: 0
								};
								O_mnglog.writeShopMnglog(H_mnglog);
							}

						var phpself = "/^" + _SERVER.PHP_SELF.replace(/\//g, "\\/") + "/";

						for (var key in _SESSION) {
							var val = _SESSION[key];

							if (preg_match(phpself, key)) {
								delete _SESSION[key];
							}
						}
					}
			}

			O_view.endTemplateDelView();
			throw die();
		}

		if (H_sess[TemplateModProc.PUB].tempid != "") //データ取得
			//引数追加 20090428miya
			//デフォルト値として整形
			//エスケープ解除 20091008miya
			{
				var H_template = O_model.getTemplateData(H_sess[TemplateModProc.PUB].tempid, H_g_sess.language);

				if (String(H_template.tempname != "")) {
					var deftempname = H_template.tempname;
				}

				if (String(H_template.defflg != "")) {
					var deftemp = H_template.defflg;
				}

				if (String(H_template.mask != "")) {
					var H_defmask = unserialize(H_template.mask);
				}

				if (String(H_template.value != "")) {
					var H_defval = unserialize(H_template.value);
				}

				O_model.renameFjpcode(H_defval);

				if (Array.isArray(H_defval)) //配列じゃない時がある。warning出ないようにする
					{
						for (var dkey in H_defval) //日付など配列はstripslashesかけると崩れるので回避
						{
							var dval = H_defval[dkey];

							if (false == Array.isArray(dval)) {
								H_defval[dkey] = stripslashes(dval);
							}
						}
					}

				H_defval = O_view.changeTemplateValueLanguage(H_defval);

				if (undefined !== H_defval.othercarid && strpos(H_defval.othercarid, "-") !== false && !(undefined !== H_sess.SELF.carid)) //$O_view->makeFormStatic($H_g_sess);
					{
						var other_carid, other_cirid;
						[other_carid, other_cirid] = H_defval.othercarid.split("-");
						H_sess[TemplateModProc.PUB].carid = other_carid;
						H_sess[TemplateModProc.PUB].cirid = other_cirid;
						O_view.setCaridAndCirid(other_carid, other_cirid);
					}

				if (1 == H_sess.SELF.prflg) {
					var H_defproduct = Array();
					var H_deffreeacce = Array();
				} else {
					if (String(H_template.product != "")) //雛型に入っている購入方式名を言語に合わせる 20090508miya
						{
							H_defproduct = unserialize(H_template.product);
							H_defproduct = O_view.changeTemplateProductLangage(H_defproduct);
						}

					if (String(H_template.free_acce != "")) {
						H_deffreeacce = unserialize(H_template.free_acce);
					}
				}
			}

		var H_view = O_view.get_View();
		H_view.H_tree = O_model.getOrderTreeJS(H_sess[TemplateModProc.PUB]);
		H_view.js = H_view.H_tree.js;

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_order.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), MT_SITE, H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), MT_SITE);
		}

		H_view.css = O_view.getCSS();
		H_view.smarty_template = O_view.getSmartyTemplate(H_sess[TemplateModProc.PUB]);

		if ("" == H_view.recogpostid) {
			H_view.recogpostid = H_template.postid;
			H_view.recogpostname = O_model.getPostNameString(H_view.recogpostid);
		}

		var H_pricedetail = Array();
		var H_accedetail = Array();
		var H_product = Array();
		this.getOut().debugOutEx(H_sess, false);

		if (true == (undefined !== H_sess[TemplateModProc.PUB].price_detailid) || true == (undefined !== H_sess.SELF.productname)) //注文種別が付属品の場合とそれ以外では取得するものが異なる
			//一つの配列にまとめる
			{
				if (H_sess[TemplateModProc.PUB].type == "A") //付属品の価格表取得
					{
						if (H_sess[TemplateModProc.PUB].price_detailid != "") //重複はスキップ
							{
								H_accedetail = Array();

								if (true == (undefined !== H_sess[TemplateModProc.PUB].H_product)) {
									H_accedetail = H_sess[TemplateModProc.PUB].H_product.acce;
								}

								var H_accedetail_temp = O_model.getAcceDetail(H_sess[TemplateModProc.PUB].price_detailid);
								var A_productid_chk = Array();

								if (0 < H_accedetail.length) {
									for (var key in H_accedetail) {
										var val = H_accedetail[key];
										A_productid_chk.push(val.productid);
									}
								}

								if (false == (-1 !== A_productid_chk.indexOf(H_accedetail_temp.productid))) {
									H_accedetail.push(H_accedetail_temp);
								}
							}
					} else //price_detail_tbから取得
					{
						if (true == (undefined !== H_sess[TemplateModProc.PUB].price_detailid)) //セッションのカゴ情報をきれいにする
							//電話の価格表取得
							//price_detailidから購入方式が取得できない場合に備えて別関数を作った 20090327miya
							//$H_pricedetail = $O_model->getPriceDetail($H_sess[self::PUB]["price_detailid"]);
							//付属品の価格表取得
							{
								delete H_sess[TemplateModProc.PUB].H_product;
								H_pricedetail = O_model.getPriceDetailCoverBuysel(H_sess);

								if (true == (undefined !== H_pricedetail.productid)) {
									H_accedetail = O_model.getRelatedProduct(H_g_sess, H_sess, A_auth, H_pricedetail.productid);
								}
							} else //POSTがあったら
							{
								if (true == (undefined !== H_sess.SELF.productname)) //手入力の付属品はINIファイルから取得する
									//なかったらセッションから取得（確認画面以降）
									{
										H_pricedetail.productname = H_sess.SELF.productname;
										H_pricedetail.buyselid = H_sess.SELF.purchase;
										H_pricedetail.buyselname = BuySelectModel.getBuySelectName(H_sess.SELF.purchase);
										H_pricedetail.paycnt = H_sess.SELF.pay_frequency;
										H_accedetail = O_model.getRelatedProductHand(H_g_sess, H_sess, A_auth);
									} else {
									if (H_sess.SELF.submitName == TemplateAddView.NEXTNAME || H_sess.SELF.submitName == TemplateAddView.NEXTNAME_ENG) //手入力の付属品はINIファイルから取得する
										{
											H_pricedetail = H_sess[TemplateModProc.PUB].H_product.tel;
											this.debugOut("process/Order/OrderFormProc::H_pricedetail\u5C55\u958B", false);
											this.getOut().debugOutEx(H_pricedetail, false);

											if (true == (undefined !== H_pricedetail)) {
												H_accedetail = O_model.getRelatedProductHand(H_g_sess, H_sess, A_auth);
											}
										}
								}
							}
					}

				if (0 < H_pricedetail.length || 0 < H_accedetail.length) //使っていない
					//使っていない
					{
						H_product.tel = H_pricedetail;
						H_product.acce = H_accedetail;
						H_product.purchase = BuySelectModel.getBuySelectName(H_sess.SELF.purchase);
						H_product.pay_frequency = O_view.convPayCountId(H_sess.SELF.pay_frequency);
					}
			} else {
			if (true == Array.isArray(H_defproduct)) //開発中				$H_product = $O_model->getPriceDetailFromTemplate($H_defproduct, $H_sess[self::PUB]["shopid"], $H_g_sess["pactid"], $H_view["recogpostid"], $H_sess[self::PUB]["type"], $H_sess[self::PUB]["carid"]);
				{
					H_product = H_defproduct;
				}

			if (true == Array.isArray(H_deffreeacce)) {
				var H_free_acce = H_deffreeacce;
			}
		}

		if (H_product != "") //ローカルセッション取り直し
			{
				O_view.setProductInfo(H_product);
				H_sess = O_view.getLocalSession();
			}

		if (H_free_acce != "") {
			if (false == Array.isArray(H_sess[TemplateModProc.PUB].free_acce) && 1 > H_sess[TemplateModProc.PUB].free_acce.length) //ローカルセッション取り直し
				{
					O_view.setFreeAcce(H_free_acce);
					H_sess = O_view.getLocalSession();
				}
		}

		O_view.makeOrderBoxInputForm(O_model, H_sess, site_flg, {
			color: "pulldownonly"
		});
		H_order.purchase = O_view.convPurchaseId(H_sess[TemplateModProc.PUB].carid, H_sess.SELF.purchase);
		H_order.pay_frequency = O_view.convPayCountId(H_sess.SELF.pay_frequency);
		var H_items = O_model.getOrderItem(H_sess[TemplateModProc.PUB]);
		O_view.makeBascketMask();
		var O_mptm = new ManagementPropertyTbModel();
		var H_telproperty = O_mptm.getManagementPropertyDataForRequired(H_g_sess.pactid, 1);

		if (true == (-1 !== ["N", "Nmnp", "C", "S"].indexOf(H_sess[TemplateModProc.PUB].type)) && SMARTPHONECARID != H_sess[TemplateModProc.PUB].carid) {
			if (MT_SITE != "shop") {
				var H_item_and_mask = O_telinfo_view.makeTelInfoForm2(H_telproperty, H_sess[TemplateModProc.PUB].telcount, H_g_sess.language);
			}
		}

		var H_telitems = H_item_and_mask.item;
		var A_telitemmask = H_item_and_mask.mask;
		var temp = !H_accedetail ? H_defproduct.acce : H_accedetail;

		if (!!temp) {
			for (var key in temp) {
				var value = temp[key];

				if (is_null(value.productid)) {
					A_telitemmask.push("acce" + value.productname);
				} else {
					A_telitemmask.push("acce" + value.productid);
				}
			}
		}

		if (H_telitems.length > 0) {
			H_items = array_merge(H_items, H_telitems);
		}

		H_items = O_fjp.settingSendhow(H_g_sess, H_items);
		O_view.makeOrderForm(O_order, O_model, O_telinfo_model, H_items, H_sess[TemplateModProc.PUB], H_g_sess, H_sess[TemplateModProc.PUB].telcount, A_telitemmask, Array(), Array(), H_defval);
		var H_rules_db = O_model.getRule(H_sess[TemplateModProc.PUB]);
		H_rules_db = O_fjp.excludeElements(H_rules_db, "name");

		if (H_item_and_mask.rule.length > 0) {
			var H_rules = array_merge(H_rules_db, H_item_and_mask.rule);
		} else {
			H_rules = H_rules_db;
		}

		O_view.makeHiddenParam();
		O_view.makeFormDefTemp();
		O_view.makeProductResetButton();
		var A_remove_rule = {
			"waribiki\\[33\\]": "waribiki\\[33\\]",
			"waribiki\\[44\\]": "waribiki\\[44\\]",
			"waribiki\\[76\\]": "waribiki\\[76\\]"
		};

		if ("" != H_product) {
			var H_option = O_model.getOrderOption(H_sess[TemplateModProc.PUB], H_product);

			for (var op of Object.values(H_option)) {
				if (true == (-1 !== [33].indexOf(op.opid))) {
					delete A_remove_rule["waribiki\\[33\\]"];
				} else if (true == (-1 !== [44].indexOf(op.opid))) {
					delete A_remove_rule["waribiki\\[44\\]"];
				} else if (true == (-1 !== [76].indexOf(op.opid))) {
					delete A_remove_rule["waribiki\\[76\\]"];
				}
			}

			if (true == Array.isArray(H_rules) && 0 < A_remove_rule.length) {
				for (var rlno in H_rules) {
					var rule = H_rules[rlno];

					if ("" != rule.format) {
						for (var rmrl of Object.values(A_remove_rule)) {
							if (true == ereg(rmrl, rule.format)) {
								delete H_rules[rlno];
								break;
							}
						}
					}
				}
			}
		}

		var ptuni = O_model.getPointUnit(H_sess[TemplateModProc.PUB].carid);
		O_view.makeOrderRule(H_rules, 0, A_auth, ptuni);
		var O_post = new PostModel();
		H_view.rootpostid = O_post.getRootPostid(H_g_sess.pactid);
		H_view.posttreestr = O_view.makePosttreeband(H_sess, H_g_sess, H_view);

		if (this.O_unique instanceof MtUniqueString) {
			if (undefined !== _POST.csrfid) {
				var csrfid = _POST.csrfid;
			} else if (undefined !== H_sess.SELF.csrfid) {
				csrfid = H_sess.SELF.csrfid;
			} else {
				csrfid = this.O_unique.getInheritingUniqueId();
			}
		}

		if (false == (undefined !== H_sess.SELF.submitName) && false == (undefined !== H_sess.SELF.backName)) //雛型デフォルトセット
			//$H_view["O_OrderFormUtil"]->setDefaultsWrapper( array("mask" => $H_defmask) );		// V2の雛形ではすんなり入るのにうまくいかない
			//こっちだとうまくいく……setDefaultsのバグか？
			//同上。checkboxはsetDefaultsでは入らないらしい
			{
				H_view.O_OrderFormUtil.setDefaultsWrapper({
					tempname: deftempname
				});
				H_view.O_OrderFormUtil.setDefaultsWrapper({
					deftemp: deftemp
				});
				H_view.O_OrderFormUtil.O_Form.setConstants({
					mask: H_defmask
				});
				H_view.O_OrderFormUtil.O_Form.setConstants(H_defval);
				H_view.O_OrderFormUtil.setDefaultsWrapper(H_telinfo_separated);
				var H_def = Array();
				H_def = O_view.makeOrderDefault(H_g_sess, H_sess, O_model, H_view);
				var H_fjpdef = O_view.makeFjpDefault();

				if (Array.isArray(H_fjpdef)) {
					H_def = array_merge(H_def, H_fjpdef);
				}

				H_def.csrfid = csrfid;
				O_view.setCsrfidDel(csrfid);
				H_view.O_OrderFormUtil.O_Form.setConstants(H_def);
			} else {
			H_def = O_view.makeFjpDefault();
			H_def.csrfid = csrfid;
			O_view.setCsrfidDel(csrfid);

			if (undefined !== _POST.csrfid) {}

			H_view.O_OrderFormUtil.O_Form.setConstants(H_def);
		}

		var H_message = Array();
		H_message += O_model.checkCombination(H_sess);

		if (H_sess.SELF.submitName == TemplateModView.NEXTNAME || H_sess.SELF.submitName == TemplateModView.NEXTNAME_ENG || H_sess.SELF.submitName == TemplateModView.RECNAME || H_sess.SELF.submitName == TemplateModView.RECNAME_ENG) {
			if ((false == (undefined !== H_product) || 1 > H_product.length) && (false == (undefined !== H_sess[TemplateModProc.PUB].free_acce) || 1 > H_sess[TemplateModProc.PUB].free_acce.length) && "1" == String(_POST.mask.product)) {
				if ("ENG" == H_g_sess.language) {
					H_message.push("Shopping cart can not be fixed without selecting a model. ");
				} else {
					H_message.push("\u5546\u54C1\u3092\u9078\u3070\u305A\u306B\u8CB7\u3044\u7269\u30AB\u30B4\u3092\u56FA\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093");
				}
			}
		}

		var validation_result = false;

		if (H_sess.SELF.submitName == TemplateModView.NEXTNAME || H_sess.SELF.submitName == TemplateModView.NEXTNAME_ENG || H_sess.SELF.submitName == TemplateModView.RECNAME || H_sess.SELF.submitName == TemplateModView.RECNAME_ENG) {
			validation_result = H_view.O_OrderFormUtil.validateWrapper();
		}

		if (validation_result) //端末選択のマスク・入力チェックがquickform/javascriptじゃやりにくいので逃げる
			{
				var product_err = O_model.checkGivenProduct(H_sess);

				if (true !== product_err) {
					H_message.product_err = product_err;
					validation_result = false;
				}
			}

		if (+(H_sess.SELF.boxflg != 1)) {
			if (validation_result == true && H_message.length < 1 && H_sess.SELF.backName != TemplateModView.BACKNAME && H_sess.SELF.backName != TemplateModView.BACKNAME_ENG) //権限チェック
				//$O_make_model->checkOrderAuth( $H_sess );
				//確認画面
				{
					if (H_sess.SELF.submitName == TemplateModView.NEXTNAME || H_sess.SELF.submitName == TemplateModView.NEXTNAME_ENG) //フォームをフリーズする
						//完了画面
						{
							O_view.freezeForm();
						} else if (H_sess.SELF.submitName == TemplateModView.RECNAME || H_sess.SELF.submitName == TemplateModView.RECNAME_ENG) //UPDATE用データ整形
						//sql文を作成
						//新しく作る雛型の規定フラグがTRUEだったら、INSERT前にその部署の既存の規定フラグをすべてfalseにする 20090204miya
						//shop_mnglog 20090216miya
						{
							this.O_unique.validate(H_sess.SELF.csrfid);
							var H_data = O_view.makeTemplateData(H_g_sess, H_sess);

							if (true == H_sess.SELF.deftemp) {
								O_template_modify_model.clearTemplateDefault(H_sess);
							}

							O_template_modify_model.updateTemplate(H_sess, H_data);

							if (H_param.site == "shop") //管理記録書き込み
								{
									H_mnglog = {
										shopid: H_g_sess.shopid,
										groupid: H_g_sess.groupid,
										memid: H_g_sess.memid,
										name: H_g_sess.personname,
										postcode: H_g_sess.postcode,
										comment1: "ID:" + H_g_sess.memid,
										comment2: O_pact.getCompname(H_g_sess.pactid) + " V3\u96DB\u578BID:" + H_sess[TemplateModProc.PUB].tempid + "\u3092\u5909\u66F4",
										kind: "MTHLTemplate",
										type: "V3Hotline\u6CE8\u6587\u96DB\u578B",
										joker_flag: 0
									};
									O_mnglog.writeShopMnglog(H_mnglog);
								}

							O_view.endOrderFormView();
							throw die();
						} else //フォームをフリーズさせない
						{
							O_view.unfreezeForm();
						}
				} else //フォームをフリーズさせない
				{
					O_view.unfreezeForm();
				}
		} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		O_view.makeFormStatic(H_g_sess);

		if (undefined !== H_sess.SELF.billid) {
			O_view.assignBillData(O_model.getBillData(O_view, H_sess.SELF.billid));
		} else if (undefined !== H_defval.billid) {
			O_view.assignBillData(O_model.getBillData(O_view, H_defval.billid));
		}

		O_view.assignPlanList(H_sess, H_defval, H_g_sess);
		O_view.assignBillLang();
		O_view.assignBillView();
		O_view.displaySmarty(H_sess, A_auth, H_product, H_message, ptuni);
	}

	__destruct() {
		super.__destruct();
	}

};