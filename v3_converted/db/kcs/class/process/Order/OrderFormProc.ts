//
//顧客側注文画面ページプロセス
//
//更新履歴：<br>
//2008/04/01 宮澤龍彦 作成
//
//@uses OrderFormProcBase
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2008/03/07
//
//
//error_reporting(E_ALL|E_STRICT);
//require_once("view/Order/OrderFormViewBase.php");
//
//プロセス実装
//
//@uses OrderFormProcBase
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("process/Order/OrderFormProcBase.php");

require("model/Order/OrderTemplateModel.php");

require("model/Order/OrderTelInfoModel.php");

require("model/Order/OrderFormModel.php");

require("model/Order/OrderModifyModel.php");

require("model/PostModel.php");

require("MtPostUtil.php");

require("model/ManagementPropertyTbModel.php");

require("model/BuySelectModel.php");

require("view/Order/OrderFormView.php");

require("view/Order/OrderTemplateView.php");

require("view/Order/OrderProductView.php");

require("view/Order/OrderTelInfoView.php");

require("view/Order/OrderInputTelView.php");

require("model/Order/OrderModelBase.php");

require("model/WriteShopActlog.php");

require("model/Order/OrderLightModel.php");

require("view/Order/AttachFilesView.php");

require("MtUniqueString.php");

require("model/ValidateAuthority/Order/OrderByCategory.php");

require("MtMailUtil.php");

//D010
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
//@since 2008/04/17
//
//@access protected
//@return void
//
//
//雛型Viewオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@access protected
//@return void
//
//
//商品Viewオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@access protected
//@return void
//
//
//電話情報Viewオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@access protected
//@return void
//
//
//電話情報入力Viewオブジェクト取得
//
//@author miyazawa
//@since 2008/08/22
//
//@access protected
//@return void
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@param array $H_g_sess
//@access protected
//@return void
//
//
//雛型Modelオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@param array $H_g_sess
//@access protected
//@return void
//
//
//商品Modelオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@param array $H_g_sess
//@access protected
//@return void
//
//
//電話情報Modelオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@param array $H_g_sess
//@access protected
//@return void
//
//
//注文フォームデータ操作Modelオブジェクト取得
//
//@author miyazawa
//@since 2008/05/22
//
//@param array $H_g_sess
//@access protected
//@return void
//
//
//注文更新Modelオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@param array $H_g_sess
//@access protected
//@return void
//
//
//電話情報Modelオブジェクト取得<br>
//販売店用
//
//@author igarashi
//@since 2008/09/08
//
//@param array $H_g_sess
//@access protected
//@return object
//
//
//注文更新Modelオブジェクト取得<br>
//販売店用
//
//@author miyazawa
//@since 2008/04/17
//
//@param array $H_g_sess
//@access protected
//@return object
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
//注文時の添付ファイルを所定のディレクトリに移動する
//
//@author
//@since 2010/12/08
//
//@param mixed $orderid
//@access protected
//@return void
//
//
//_writeFilesinformation
//
//@author
//@since 2010/12/08
//
//@param mixed $attach
//@param mixed $dir
//@access public
//@return void
//
//
//_signedAttach
//
//@author
//@since 2011/02/16
//
//@param mixed $orderid
//@access protected
//@return void
//
//
//_attachDeleteDecision
//
//@author ishizaki
//@since 2011/03/04
//
//@param mixed $orderid
//@access protected
//@return void
//
//
//_checkOrderFilesDIr
//
//@author
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//_getFjpModel
//
//@author igarashi
//@since 2011/06/09
//
//@access protected
//@return void
//
//
//orderMailSend
//
//@author hanashima
//@since 2020/03/17
//
//@access public
//@return void
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
class OrderFormProc extends OrderFormProcBase {
	static PUB = "/MTOrder";
	static ATTACH = "/OrderAttach";
	static ATTACH_INFO = "attach_";
	static PRIVATE_RECOG_STAT = 5;
	static PRIVATE_HOLD_STAT = 7;
	static ORDER_FIN_MAIL_SEND = 273;

	constructor(H_param: {} | any[] = Array()) //D010
	{
		super(H_param);
		this.O_Set = undefined;
		this.O_Set = MtSetting.singleton();
		this.O_Set.loadConfig("H_employee_number_validation");
	}

	get_View() {
		return new OrderFormView();
	}

	get_OrderTemplateView() {
		return new OrderTemplateView();
	}

	get_OrderProductView() {
		return new OrderProductView();
	}

	get_OrderTelInfoView() {
		return new OrderTelInfoView();
	}

	get_OrderInputTelView() {
		return new OrderInputTelView();
	}

	get_Model(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new OrderFormModel(O_db0, H_g_sess, site_flg);
	}

	get_OrderTemplateModel(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new OrderTemplateModel(O_db0, H_g_sess, site_flg);
	}

	get_OrderProductModel(H_g_sess: {} | any[]) {
		return new OrderProductModel(O_db0, H_g_sess, O_order);
	}

	get_OrderTelInfoModel(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new OrderTelInfoModel(O_db0, H_g_sess, site_flg);
	}

	get_OrderFormModel(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new OrderFormModel(O_db0, H_g_sess, site_flg);
	}

	get_OrderModifyModel(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new OrderModifyModel(O_db0, H_g_sess, site_flg);
	}

	get_ShopOrderTelInfoModel(H_g_sess, site_flg) {
		return new OrderTelInfoModel(O_db0, H_g_sess, site_flg);
	}

	get_ShopOrderModifyModel(H_g_sess, site_flg) {
		return new OrderModifyModel(O_db0, H_g_sess, site_flg);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//shop_mnglog 20090216miya
	//ログインチェック
	//用途別注文チェック
	//$resだと他にも使われている可能性があるので$categoryに$resの値を代入
	//if (is_null($res))
	//		{
	//			header("Location: /Menu/menu.php");
	//			exit;
	//		}
	//		elseif ($res)
	//		{
	//}
	//セッション情報取得（ローカル）
	//権限一覧取得
	//英語化権限 20090210miya
	//Javascriptの生成
	//パンくずリンクの生成
	//CSSの決定
	//Smartyテンプレートの取得
	//登録部署を設定
	//申請部署を設定 20090114miya
	//代行注文ならordermenuで設定されたapplypostidを取得
	//親部署リスト取得
	//ルート部署取得
	//電話を一件だけ入力する注文パターンはここで電話詳細情報を取得する
	//第二階層対応で上に持ってきた 20100727miya
	//QuickFormObjectまだできてないので作る 2010802miya
	//デフォルト雛型取得
	//代行注文ではデフォルト雛型をキャンセルできる 20091026miya
	//雛型が選択されてたら取得
	//価格表からのデータを作る
	//$H_sess をデバッグ
	//雛型の色の「指定なし」を言語に合わせる 20090508miya
	//一つの配列にまとめる
	//order_item_tbからフォーム表示項目を取得する
	//fjp以外ならfjp用フォーム削除
	//fjp用発注種別:納品先特別処理
	//電話詳細情報入力フォーム作成
	//電話詳細情報を表示するのは新規、MNP、機変、移行。ホットラインはなし
	//スマートフォンもなし 20090312miya
	//販売店代行注文では消していたが、田村様との話し合いの結果、表示して構わないということになった 20090528miya
	//S224 解約注文時電話詳細項目表示 hanashima 20200717
	//会社名設定（第二階層対応）
	//代行注文ならコメント欄
	//池袋用処理を施す D77 池袋処理 20190329 伊達
	//フォームオブジェクトを生成してフォーム要素を入れる
	//order_rule_tbから入力ルールを取得する
	//fjp以外ならfjp用ルール削除
	//D010 社員番号がある場合、ruleを追加する(この処理はviewに移したほうが良いい)
	//Viewは別案件でいじってるので、とりあえずここに書いてしまった
	//オプションに指定割がない場合、ルールから指定割のルールを除外するため、ここでオプションを取得（除外しないと機種によってJavaScriptエラーになる）
	//入力ルールをフォームオブジェクトに入れる
	//部署ツリー文字列取得（第二階層対応）
	//注文フォームのデフォルト値作成、セット
	//csrfidセット
	//$H_view["O_OrderFormUtil"]->setDefaultsWrapper( $H_def );	// setDefaultsだとcheckboxがうまく入らない
	//NG・必須チェック
	//雛型反映
	//$O_form = $O_template_view->setTemplateValue( $O_form );
	//電話を一件だけ入力する注文パターンはここで電話詳細情報を取得する
	//ここにあったが第二階層対応で上に持っていった 20100727miya
	//第二階層部署なら成り代わり先の部署になる
	//新規以外で$H_view["actready"]がtrueの場合、電話が一件だけなら、電話の所属部署を取得 20090623miya
	//スタティック表示作成
	//請求先言語リストをSmartyに渡す
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var O_telinfo_view = this.get_OrderTelInfoView();
		var O_inputtel_view = this.get_OrderInputTelView();
		this.O_unique = MtUniqueString.singleton();
		var H_g_sess = O_view.getGlobalSession();
		var site_flg = OrderModelBase.SITE_USER;

		if (H_param.site == "shop") {
			site_flg = OrderModelBase.SITE_SHOP;
			var H_g_shop_sess = O_view.getGlobalShopSession();
			H_g_sess = H_g_sess + H_g_shop_sess;
		}

		if (_POST.order_mail_send) {
			this.orderMailSend(H_g_sess, site_flg);
			throw die();
		}

		var O_order = OrderUtil.singleton(H_g_sess);
		var O_model = this.get_Model(H_g_sess, site_flg);
		var O_template_model = this.get_OrderTemplateModel(H_g_sess, site_flg);
		var O_telinfo_model = this.get_OrderTelInfoModel(H_g_sess, site_flg);
		var O_order_modify_model = this.get_OrderModifyModel(H_g_sess, site_flg);
		var O_post = new PostModel();

		if (H_param.site == "shop") {
			var O_mnglog = WriteShopActlog.singleton();
		}

		O_view.setSiteMode(site_flg);
		O_view.startCheck();
		O_model.setValidateAuthority(new ValidateAuthorityOrderOrderByCategory());
		var res = O_model.checkOrderByCategory();
		O_view.setOrderByCategoryFlag(res);
		var order_category_flag = res;
		O_telinfo_model.setOrderByCategoryFlag(res);
		O_order_modify_model.setOrderByCategoryFlag(res);
		var temp = O_view.getLocalSession();

		if (!("telinfo" in temp[OrderFormProc.PUB]) || !("division" in temp[OrderFormProc.PUB].telinfo.telno0)) {
			O_template_model.setOrderByCategoryFlag(res);
			O_view.setOrderByCategory(res);
		} else {
			var t = temp[OrderFormProc.PUB].telinfo.telno0.division;
			var pattern = undefined;

			switch (t) {
				case 1:
					pattern = "business";
					break;

				case 2:
					pattern = "demo";
					break;
			}

			if (pattern) {
				O_view.setOrderByCategory(pattern);
				O_template_model.setOrderByCategoryFlag(pattern);
			}
		}

		var H_sess = O_view.getLocalSession();
		var A_auth = O_model.get_AuthIni();

		if ("ENG" == H_g_sess.language && "shop" != H_param.site) //ローカルセッション取り直し
			{
				O_view.setEnglish(true);
				H_sess = O_view.getLocalSession();
			}

		var H_view = O_view.get_View();
		H_view.js = O_view.getHeaderJS();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_order.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), MT_SITE, H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), MT_SITE);
		}

		H_view.css = O_view.getCSS(site_flg);
		H_view.smarty_template = O_model.getSmartyTemplate(H_sess[OrderFormProc.PUB]);
		H_view.recogpostid = O_view.makeRecogPostid(H_sess, H_g_sess);
		H_view.recogpostname = O_post.getPostNameOne(H_view.recogpostid);

		if (true == ereg("MTActorder", getcwd()) && true == (undefined !== H_sess[OrderFormProc.PUB].applypostid)) {
			H_view.applypostid = H_sess[OrderFormProc.PUB].applypostid;
		} else {
			H_view.applypostid = H_g_sess.postid;
		}

		var A_parentlist = O_post.getParentList(H_view.recogpostid);
		H_view.rootpostid = O_post.getRootPostid(H_g_sess.pactid);

		var O_fjp = this._getfjpModel(A_auth);

		O_view.setfjpModelObject(O_fjp);
		O_order_modify_model.setfjpModelObject(O_fjp);
		O_model.setfjpModelObject(O_fjp);

		if (false == ("object" === typeof H_view.O_OrderFormUtil)) {
			H_view.O_OrderFormUtil = new QuickFormUtil("form");
		}

		if (true == (-1 !== ["A", "T", "M"].indexOf(H_sess[OrderFormProc.PUB].type)) && H_sess.SELF.telno != "") //配下の部署ID取得
			//電話詳細情報取得
			//取得した電話情報をSESSIONに入れる
			{
				var A_post = O_post.getChildList(H_g_sess.pactid, H_g_sess.postid);
				var H_telinfo = O_telinfo_model.checkTelInfoOne(H_sess, H_g_sess);

				if (true == Array.isArray(H_telinfo) && 0 < H_telinfo.length) {
					for (var key in H_telinfo) {
						var val = H_telinfo[key];

						if (val.alert != "") //名義変更の「個人（他:他社名義）→法人（自:自社名義）」は電話が登録されていなくても通す
							//ホットラインの場合は全通し
							{
								if ("\u500B\u4EBA\uFF08\u4ED6:\u4ED6\u793E\u540D\u7FA9\uFF09\u2192\u6CD5\u4EBA\uFF08\u81EA:\u81EA\u793E\u540D\u7FA9\uFF09" == H_sess.SELF.transfer || "H" == PACTTYPE) {
									H_telinfo = Array();
									H_telinfo[key] = {
										telno: H_sess.SELF.telno,
										telno_view: H_sess.SELF.telno,
										carid: H_sess[OrderFormProc.PUB].carid,
										cirid: H_sess[OrderFormProc.PUB].cirid
									};
								} else //電話のエラーメッセージをここで書く
									{
										A_alert[str_replace("telno", "", key)] = val.alert;
										H_view.O_OrderFormUtil.setElementErrorWrapper("telno", A_alert[str_replace("telno", "", key)]);
									}
							} else //配下の部署になかったら弾く
							{
								if (false == (-1 !== A_post.indexOf(+val.postid))) //電話のエラーメッセージをここで書く
									{
										if ("ENG" == H_g_sess.language) {
											A_alert[str_replace("telno", "", key)] = "Invalid phone number.";
										} else {
											A_alert[str_replace("telno", "", key)] = "\u6709\u52B9\u306A\u756A\u53F7\u3067\u306F\u3042\u308A\u307E\u305B\u3093";
										}

										H_view.O_OrderFormUtil.setElementErrorWrapper("telno", A_alert[str_replace("telno", "", key)]);
									}
							}
					}
				} else //Hotlineだったら電話番号だけセット 20090409miya
					{
						H_telinfo.telno0.telno = H_sess.SELF.telno;
						H_telinfo.telno0.telno_view = H_sess.SELF.telno;
					}

				if (true == Array.isArray(H_telinfo) && 0 < H_telinfo.length && 1 > A_alert.length) {
					O_inputtel_view.setTelInfoSession(H_telinfo);
				}

				H_sess = O_view.getLocalSession();
			}

		H_view.actready = false;

		if (H_param.site != "shop" && -1 !== A_auth.indexOf("fnc_root_actorder") == true && H_view.rootpostid == H_g_sess.postid) //新規のときは選択した部署が自部署でなければ第二階層部署代行注文
			{
				if ("N" == H_sess[OrderFormProc.PUB].type) {
					if (H_view.recogpostid != H_g_sess.postid) {
						H_view.actready = true;
					}
				} else {
					if (1 == H_sess[OrderFormProc.PUB].telinfo.length && "" != H_sess[OrderFormProc.PUB].telinfo.telno0.postid) {
						if (H_sess[OrderFormProc.PUB].telinfo.telno0.postid != H_g_sess.postid) {
							H_view.recogpostid = H_sess[OrderFormProc.PUB].telinfo.telno0.postid;
							H_view.recogpostname = O_post.getPostNameOne(H_view.recogpostid);
							H_view.actready = true;
						}
					}
				}
			}

		if (true == H_view.actready) //電話登録先部署の上位にある第2階層部署を取得
			{
				if ("" != A_parentlist[1]) //第2階層部署の販売店を取得
					//第2階層の販売店担当者IDを取得
					{
						var lvpost = A_parentlist[1];
						var lvshop = O_model.getShopIdFromPostId(lvpost, H_sess[OrderFormProc.PUB].carid);

						if ("" != lvshop) {
							var lvmem = O_model.getMemIdFromPostId(lvpost, H_sess[OrderFormProc.PUB].carid, lvshop);
						}

						if ("" != lvshop && "" != lvmem) //ローカルセッション取り直し
							{
								H_lv.shopid = lvshop;
								H_lv.memid = lvmem;
								O_view.setShop(H_lv);
								H_sess = O_view.getLocalSession();
							}
					}
			}

		H_view.H_templatelist = O_template_model.getOrderTemplate(H_g_sess.pactid, A_parentlist, H_sess[OrderFormProc.PUB].type, H_sess[OrderFormProc.PUB].cirid, H_sess[OrderFormProc.PUB].carid);
		H_view.def_template = O_template_model.getOrderDefTemplate(H_g_sess.pactid, A_parentlist, H_sess[OrderFormProc.PUB].type, H_sess[OrderFormProc.PUB].cirid, H_sess[OrderFormProc.PUB].carid);

		if (undefined != H_view.def_template && undefined == H_sess[OrderFormProc.PUB].tempid) //雛型が選択されてない場合はセッションにセット
			//ローカルセッションに入れる
			//雛型が指定されたものとしてcheckCGIParamしなおすとディレクトリセッションに雛型が入る
			//ローカルセッション取り直し
			{
				O_view.setDefaultTemplate(H_view.def_template);
				O_view.checkCGIParam();
				H_sess = O_view.getLocalSession();
			}

		var O_template_view = this.get_OrderTemplateView();
		H_view.templateform = O_template_view.makeTemplateForm(H_view.H_templatelist, site_flg);

		if (H_sess[OrderFormProc.PUB].tempid != "") {
			var H_templatedetail = O_template_model.getOrderTemplateDetail(H_sess[OrderFormProc.PUB].tempid, H_g_sess.pactid);
			H_view.H_templatemask = unserialize(H_templatedetail.mask);
			H_view.H_templatevalue = unserialize(H_templatedetail.value);
			H_view.H_templateproduct = unserialize(H_templatedetail.product);
			H_view.H_templatefreeacce = unserialize(H_templatedetail.free_acce);
		}

		if (undefined !== H_sess.SELF.billid && !!H_sess.SELF.billid) {
			var billData = O_model.getBillData(O_view, H_sess.SELF.billid);
		} else if (undefined !== H_view.H_templatevalue.billid) //雛形からbillidを取得して請求先をSmartyに渡す
			{
				billData = O_model.getBillData(O_view, H_view.H_templatevalue.billid);
			} else //デフォルトの請求先をSmartyに渡す
			{
				billData = O_model.getBillDefault(O_view, O_view.gSess().pactid);
			}

		if (!(undefined !== billData) || is_null(billData)) {
			billData = O_model.getCompAddr(O_view);
		}

		O_view.assignBillData(billData);
		var H_pricedetail = Array();
		var H_accedetail = Array();
		var H_product = Array();
		this.getOut().debugOutEx(H_sess, false);
		H_view.H_templatevalue = O_view.changeTemplateValueLanguage(H_view.H_templatevalue);
		O_fjp.renameTemplateValue(H_view.H_templatevalue);

		if (true == (undefined !== H_view.H_templateproduct) && 0 < H_view.H_templateproduct.length && false != H_view.H_templateproduct) //雛型に入っている購入方式名を言語に合わせる 20090508miya
			{
				H_view.H_templateproduct = O_view.changeTemplateProductLangage(H_view.H_templateproduct);
				H_product = H_view.H_templateproduct;
			} else //注文種別が付属品の場合とそれ以外では取得するものが異なる
			{
				if (H_sess[OrderFormProc.PUB].type == "A") //付属品の価格表取得
					{
						if (H_sess[OrderFormProc.PUB].price_detailid != "") //重複はスキップ
							{
								H_accedetail = Array();

								if (true == (undefined !== H_sess[OrderFormProc.PUB].H_product)) {
									H_accedetail = H_sess[OrderFormProc.PUB].H_product.acce;
								}

								var H_accedetail_temp = O_model.getAcceDetail(H_sess[OrderFormProc.PUB].price_detailid);
								var A_productid_chk = Array();

								if (true == Array.isArray(H_accedetail)) {
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
						if (true == (undefined !== H_sess[OrderFormProc.PUB].price_detailid)) //セッションのカゴ情報をきれいにする
							//電話の価格表取得
							//price_detailidから購入方式が取得できない場合に備えて別関数を作った 20090327miya
							//$H_pricedetail = $O_model->getPriceDetail($H_sess[self::PUB]["price_detailid"]);
							//付属品の価格表取得
							{
								delete H_sess[OrderFormProc.PUB].H_product;
								H_pricedetail = O_model.getPriceDetailCoverBuysel(H_sess);

								if (true == (undefined !== H_pricedetail.productid)) {
									H_accedetail = O_model.getRelatedProduct(H_g_sess, H_sess, A_auth, H_pricedetail.productid);
								}
							} else //手入力のPOSTがあったら
							{
								if (true == (undefined !== H_sess.SELF.productname)) //手入力の付属品はINIファイルから取得する
									//なかったらセッションから取得（確認画面以降と戻りの場合）
									{
										H_pricedetail.productname = H_sess.SELF.productname;
										H_pricedetail.buyselid = H_sess.SELF.purchase;

										if ("ENG" == H_g_sess.language && "shop" != H_param.site) {
											H_pricedetail.buyselname = BuySelectModel.getBuySelectNameEng(H_sess.SELF.purchase);
										} else {
											H_pricedetail.buyselname = BuySelectModel.getBuySelectName(H_sess.SELF.purchase);
										}

										H_pricedetail.paycnt = H_sess.SELF.pay_frequency;
										H_accedetail = O_model.getRelatedProductHand(H_g_sess, H_sess, A_auth);
									} else {
									if (H_sess.SELF.submitName == OrderFormView.NEXTNAME || H_sess.SELF.submitName == OrderFormView.RECNAME || H_sess.SELF.backName == OrderFormView.BACKNAME || H_sess.SELF.submitName == OrderFormView.NEXTNAME_ENG || H_sess.SELF.submitName == OrderFormView.RECNAME_ENG || H_sess.SELF.backName == OrderFormView.BACKNAME_ENG) //手入力の付属品はINIファイルから取得する
										{
											H_pricedetail = H_sess[OrderFormProc.PUB].H_product.tel;
											this.debugOut("process/Order/OrderFormProc::H_pricedetail\u5C55\u958B", false);
											this.getOut().debugOutEx(H_pricedetail, false);
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

		if (H_product != "") //ローカルセッション取り直し
			{
				O_view.setProductInfo(H_product);
				H_sess = O_view.getLocalSession();
			}

		var H_free_acce = H_view.H_templatefreeacce;

		if (H_free_acce != "") {
			if (false == Array.isArray(H_sess[OrderFormProc.PUB].free_acce) && 1 > H_sess[OrderFormProc.PUB].free_acce.length) //ローカルセッション取り直し
				{
					O_view.setFreeAcce(H_free_acce);
					H_sess = O_view.getLocalSession();
				}
		}

		if (true == Array.isArray(H_telinfo) && 0 < H_telinfo.length && 1 > A_alert.length) {
			O_inputtel_view.setTelInfoSession(H_telinfo);
			H_sess = O_view.getLocalSession();
		}

		O_view.makeOrderBoxInputForm(O_model, H_sess, site_flg, H_view.H_templatevalue);
		var H_items = O_model.getOrderItem(H_sess[OrderFormProc.PUB]);
		H_items = O_fjp.excludeElements(H_items);
		H_items = O_fjp.settingSendhow(H_g_sess, H_items);
		this.debugOut("process/Order/OrderFormProc::H_items\u5C55\u958B", false);
		this.getOut().debugOutEx(H_items, false);

		if ("M" != H_sess[OrderFormProc.PUB].type) {
			var telcount = H_sess[OrderFormProc.PUB].telcount;
		} else {
			telcount = 1;
		}

		var O_mptm = new ManagementPropertyTbModel();
		var is_req_tel_property = false;
		H_view.deleteOrderDisplayTelDetaile = false;

		if (true == (-1 !== ["N", "Nmnp", "C", "S", "M"].indexOf(H_sess[OrderFormProc.PUB].type)) && "H" != PACTTYPE && 28 != H_sess[OrderFormProc.PUB].carid) //1は電話のユーザ設定項目
			{
				var H_telitems, H_telitemrules;
				var H_telproperty = O_mptm.getManagementPropertyDataForRequired(H_g_sess.pactid, 1);
				[H_telitems, H_telitemrules] = O_telinfo_view.makeTelInfoForm2(H_telproperty, telcount, H_g_sess.language);

				if (H_telitems.length > 0) {
					H_items = array_merge(H_items, H_telitems);
				}

				for (var key in H_telproperty) //if( $value["requiredflg"] == true){ //S225 hanashima 20201023
				{
					var value = H_telproperty[key];

					if (value.ordrequiredflg == true) {
						is_req_tel_property = true;
						break;
					}
				}
			} else if (true == (-1 !== ["D", "A", "P"].indexOf(H_sess[OrderFormProc.PUB].type)) && "H" != PACTTYPE && 28 != H_sess[OrderFormProc.PUB].carid && -1 !== A_auth.indexOf("fnc_delete_order_display_tel_detaile")) //削除でも電話詳細情報を表示するため(編集不可) 20200715 hanashima
			//1は電話のユーザ設定項目
			//表示したいだけなのでバリデーションを空にする
			{
				H_telproperty = O_mptm.getManagementPropertyDataForRequired(H_g_sess.pactid, 1);
				[H_telitems, H_telitemrules] = O_telinfo_view.makeTelInfoForm2(H_telproperty, telcount, H_g_sess.language);
				H_telitemrules = Array();

				if (H_telitems.length > 0) {
					H_items = array_merge(H_items, H_telitems);
				}

				H_view.deleteOrderDisplayTelDetaile = true;
			}

		temp = O_view.getOrderForm(H_sess[OrderFormProc.PUB].type, H_sess[OrderFormProc.PUB].carid, H_sess[OrderFormProc.PUB].cirid, telcount, A_auth);
		H_items = array_merge(H_items, temp);
		H_view.compname = O_view.makeCompname(H_sess, H_g_sess, H_view, A_auth);

		if (true == ereg("MTActorder", getcwd())) //カレントディレクトリを見る
			{
				O_view.makeActorderCommentForm(O_model, H_g_shop_sess.shopid);
			}

		H_view.accQuant = O_model.preCheckAccQuant(H_sess[OrderFormProc.PUB]);
		H_items = O_view.dealingWithIkebururo(H_sess[OrderFormProc.PUB].type, H_items, H_g_sess.groupid);
		O_view.makeOrderForm(O_order, O_model, O_telinfo_model, H_items, H_sess[OrderFormProc.PUB], H_g_sess, telcount, Array(), H_sess[OrderFormProc.PUB].H_product, H_view);
		var H_rules = O_model.getRule(H_sess[OrderFormProc.PUB]);
		H_rules = O_fjp.excludeElements(H_rules, "name");

		if (H_telitemrules.length > 0) {
			H_rules = array_merge(H_rules, H_telitemrules);
		}

		if (true == 0 < H_rules.length && true == 0 < H_view.H_templatemask.length) {
			H_rules = O_view.removeMaskedRules(H_rules, H_view.H_templatemask);
		}

		temp = O_view.getOrderRule(H_sess[OrderFormProc.PUB].type, H_sess[OrderFormProc.PUB].carid, H_sess[OrderFormProc.PUB].cirid, telcount, A_auth);
		H_rules = array_merge(H_rules, temp);
		var is_req = false;

		if (H_telitemrules) //$is_req =  $this->O_Set->require_pacts[$H_g_sess["pactid"]];
			//付属品、解約、プラン、その他
			//if( !empty($is_req) || !empty($size) ){
			{
				var size = this.O_Set.pacts[H_g_sess.pactid];

				if (!!size) {
					for (var key in H_items) //社員番号以外は無視
					{
						var value = H_items[key];

						if (value.inputname != "employeecode") {
							continue;
						}

						if (ctype_digit(size) and size > 0) {
							for (var i = 0; i < telcount; i++) {
								H_rules.push({
									name: "employeecode_" + i,
									mess: "\u793E\u54E1\u756A\u53F7\u306F" + size + "\u6841\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
									type: "regex",
									format: "/^[\\d\\w-\\/+*=]*$/",
									validation: "client",
									reset: false,
									force: false
								});
								H_rules.push({
									name: "employeecode_" + i,
									mess: "\u793E\u54E1\u756A\u53F7\u306F" + size + "\u6841\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
									type: "rangelength",
									format: [size, size],
									validation: "client",
									reset: false,
									force: false
								});
							}
						}

						break;
					}
				}
			}

		H_view.is_view_tel_property = is_req_tel_property || is_req;
		var A_remove_rule = {
			"waribiki\\[33\\]": "waribiki\\[33\\]",
			"waribiki\\[44\\]": "waribiki\\[44\\]",
			"waribiki\\[76\\]": "waribiki\\[76\\]"
		};

		if ("" != H_product) {
			var H_option = O_model.getOrderOption(H_sess[OrderFormProc.PUB], H_product);

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

		var ptuni = O_model.getPointUnit(H_sess[OrderFormProc.PUB].carid);
		var telcnt = 0;

		if (telcount > 0) {
			telcnt = telcount;
		}

		O_view.makeOrderRule(H_rules, telcnt, A_auth, ptuni);
		H_view.posttreestr = O_view.makePosttreeband(H_sess, H_g_sess, H_view, A_auth);
		var H_def = O_view.makeOrderDefault(H_g_sess, H_sess, O_model, H_view, A_auth);

		if (undefined !== H_sess.SELF.csrfid) {
			H_def.csrfid = H_sess.SELF.csrfid;
		}

		if (!(undefined !== _POST.submitName)) {
			H_def.csrfid = this.O_unique.getNewUniqueId();
		}

		if (O_fjp.checkAuth("co")) {
			O_fjp.getPreviousRecog(H_def, H_g_sess, H_sess, H_view.H_templatevalue);
			O_fjp.getDefaultFJPExtension(H_def, H_g_sess, H_sess, H_view, order_category_flag);
			O_fjp.getClaimViewer(H_def, H_g_sess, H_sess);
		}

		O_fjp.setSendhow(H_def);
		H_view.O_OrderFormUtil.O_Form.setConstants(H_def);

		if (H_sess[OrderFormProc.PUB].telinfo.length > 0) //電話情報のデフォルト値作成、セット
			//電話詳細情報の電話番号表示部分作成
			//電話詳細情報のMNPアラート表示部分作成
			//電話の違約金表示部分作成
			{
				var H_telinfo_separated = O_telinfo_view.separateTelInfo(H_sess[OrderFormProc.PUB].telinfo);
				var notexists = O_model.getNotExistsTels(H_sess[OrderFormProc.PUB].telinfo);
				H_view.O_OrderFormUtil.setDefaultsWrapper(H_telinfo_separated);
				H_view.teldisplay = O_view.makeTelInfoDisplay(H_sess[OrderFormProc.PUB].telinfo);
				H_view.mnpalert = O_view.makeTelInfoMNPAlert(H_sess[OrderFormProc.PUB].telinfo);

				if (true == (-1 !== ["N", "Nmnp", "C", "S", "P", "Ppl", "Pdc", "Pop", "D"].indexOf(H_sess[OrderFormProc.PUB].type))) {
					H_view.telpenalty = O_view.makeTelPenalty(H_sess[OrderFormProc.PUB].telinfo);
				}

				if (O_fjp.checkAuth("co")) {
					O_fjp.setOutsourcerInfo(H_view, H_g_sess.userid, telcount, notexists);
				}
			} else if ("N" == H_sess[OrderFormProc.PUB].type) {
			if (O_fjp.checkAuth("co")) {
				O_fjp.setOutsourcerInfo(H_view, H_g_sess.userid, telcount, undefined);
			}
		}

		H_view.orderShippingMask = false;

		if (true == (-1 !== ["N", "Nmnp", "C", "A", "M"].indexOf(H_sess[OrderFormProc.PUB].type)) && -1 !== A_auth.indexOf("fnc_order_shipping_mask")) {
			H_view.orderShippingMask = true;
		}

		var H_message = Array();
		H_message += O_model.checkCombination(H_sess);
		var curpostid = H_g_sess.postid;
		var curpostname = H_g_sess.postname;

		if (H_sess[OrderFormProc.PUB].recogpostid != undefined) {
			curpostname = O_post.getPostNameOne(H_sess[OrderFormProc.PUB].recogpostid);
		} else if (H_sess[OrderFormProc.PUB].telinfo.telno0.postid) {
			curpostname = O_post.getPostNameOne(H_sess[OrderFormProc.PUB].telinfo.telno0.postid);
		}

		var H_actord = Array();

		if ("N" != H_sess[OrderFormProc.PUB].type && true == H_view.actready) {
			if (1 == H_sess[OrderFormProc.PUB].telinfo.length && "" != H_sess[OrderFormProc.PUB].telinfo.telno0.postid) {
				H_actord.actorder = true;
				H_actord.curpostid = H_sess[OrderFormProc.PUB].telinfo.telno0.postid;
				H_actord.curpostname = O_post.getPostNameOne(H_sess[OrderFormProc.PUB].telinfo.telno0.postid);
			} else if (false == H_sess[OrderFormProc.PUB].telinfo.telno0 && true == Array.isArray(H_telinfo.telno0) && "" != H_telinfo.telno0.postid) {
				H_actord.actorder = true;
				H_actord.curpostid = H_telinfo.telno0.postid;
				H_actord.curpostname = O_post.getPostNameOne(H_telinfo.telno0.postid);
			}
		} else if ("N" == H_sess[OrderFormProc.PUB].type && true == H_view.actready) {
			H_actord.actorder = true;
			H_actord.curpostid = H_view.recogpostid;
			H_actord.curpostname = O_post.getPostNameOne(H_view.recogpostid);
		}

		if (false == ereg("MTActorder", getcwd())) //カレントディレクトリを見る。代行注文ではやらない
			{
				if (-1 !== A_auth.indexOf("fnc_select_recog_mail")) {
					temp = O_model.getRecogPostUser(H_g_sess, H_sess, curpostid, curpostname, H_actord);

					if (temp != false) //-------
						//承認部署取得
						//ルート部署が第2階層の販売店へ発注をする場合、承認先を第2階層部署の承認先に変更
						//最終承認部署かどうかチェック
						{
							var autorecog = true;

							var _tmprecog = O_model.getRecogPost(H_g_sess, H_sess, curpostid, curpostname, H_actord);

							var _recog = Array();

							if (_tmprecog.postidto != undefined) {
								_recog.postidto = _tmprecog.postidto;
							}

							if (!O_fjp.checkAuth("co")) {
								autorecog = O_order_modify_model.getAutoRecogCondition(H_g_sess.pactid, H_g_sess.postid, H_g_sess.userid, _recog.postidto, true);
							} else if (O_fjp.checkAuth("co") && preg_match("/MTActorder/", _SERVER.PHP_SELF)) //個人承認は処理しないのに、販売店代行注文では代行注文なのに自動承認かつ履歴まで残すという糞仕様
								{
									autorecog = O_order_modify_model.getAutoRecogCondition(H_g_sess.pactid, H_g_sess.postid, H_g_sess.userid, _recog.postidto, true);
								}

							if (!autorecog) {
								[H_view.select_recog_mail_flg, H_view.recog_list, H_view.recog_mail_null_flg] = temp;
								O_view.makeSelectRecogMail(H_view.recog_list);
							}
						}
				}
			}

		var validation_result = false;

		if (H_sess.SELF.submitName == OrderFormView.NEXTNAME || H_sess.SELF.submitName == OrderFormView.RECNAME || H_sess.SELF.submitName == OrderFormView.NEXTNAME_ENG || H_sess.SELF.submitName == OrderFormView.RECNAME_ENG) //付属品の数量を数える
			{
				if ("A" == H_sess[OrderFormProc.PUB].type) {
					var acce_no = 0;
					{
						let _tmp_0 = H_sess.SELF;

						for (var ky in _tmp_0) {
							var vl = _tmp_0[ky];

							if (true == ereg("^acce", ky) || true == ereg("^free_acce", ky)) {
								if (true == is_numeric(vl)) {
									acce_no = acce_no + +vl;
								} else //一つでも数値以外が入っていたら止める 20090403miya
									{
										acce_no = 0;
										break;
									}
							}
						}
					}
				}

				if ("A" == H_sess[OrderFormProc.PUB].type && (1 > H_product.acce.length && 1 > H_sess[OrderFormProc.PUB].free_acce.length)) {
					validation_result = false;

					if ("ENG" == H_g_sess.language) {
						H_message.push("Order can not be completed without entering a model.");
					} else {
						H_message.push("\u5546\u54C1\u672A\u5165\u529B\u3067\u6CE8\u6587\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093");
					}
				} else if ("A" == H_sess[OrderFormProc.PUB].type && acce_no < 1) //新規、MNP、機変、移行で何も注文していないとき 20090319miya
					//} elseif (true == in_array($H_sess[self::PUB]["type"], array("N","Nmnp","C","S")) && 1 > count($H_product["tel"])) {
					{
						validation_result = false;

						if ("ENG" == H_g_sess.language) {
							H_message.push("Order can not be completed without entering quantity.");
						} else {
							H_message.push("\u5546\u54C1\u306E\u6570\u3092\u5165\u529B\u305B\u305A\u306B\u6CE8\u6587\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093");
						}
					} else if (true == (-1 !== ["N", "Nmnp", "C", "S"].indexOf(H_sess[OrderFormProc.PUB].type)) && !H_product.tel.productname) //手入力の付属品がついてしまうので消す
					{
						validation_result = false;
						delete H_product.acce;

						if ("ENG" == H_g_sess.language) {
							H_message.push("Order can not be completed without selecting a model.");
						} else {
							H_message.push("\u5546\u54C1\u3092\u9078\u629E\u305B\u305A\u306B\u6CE8\u6587\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093");
						}
					} else {
					validation_result = H_view.O_OrderFormUtil.validateWrapper();
				}
			}

		if (validation_result == true && H_message.length < 1 && H_sess.SELF.backName != OrderFormView.BACKNAME && H_sess.SELF.backName != OrderFormView.BACKNAME_ENG) //確認画面
			{
				if (H_sess.SELF.submitName == OrderFormView.NEXTNAME || H_sess.SELF.submitName == OrderFormView.NEXTNAME_ENG) //その他で電話情報取得されていない場合電話管理から取得して表示
					//完了画面
					{
						if ("M" == H_sess[OrderFormProc.PUB].type && undefined !== H_sess.SELF.misctelno && !H_sess.SELF.misctelno) {
							H_view.O_OrderFormUtil.O_Form.setConstants(H_telinfo_separated);
						}

						O_view.freezeForm();
					} else if (H_sess.SELF.submitName == OrderFormView.RECNAME || H_sess.SELF.submitName == OrderFormView.RECNAME_ENG) //承認部署取得
					//ルート部署が第2階層の販売店へ発注をする場合、承認先を第2階層部署の承認先に変更
					//最終承認部署かどうかチェック
					//fjp(個人承認)は処理しない
					//ただし、個人承認と発注者が同じなら処理する
					//FJP divisionチェック
					//代行注文は販売店コメントを入れる
					//orderidを表示するかどうか判別
					//これで下のメール送信の有無も判別するようにした 20090219miya
					//ルート部署の第2階層代行注文権限があれば表示しない（$H_view["actready"]がtrueの場合 20090619miya）
					//自動承認なら通過(true === $H_recog["autorecog"]) 20110204iga
					//承認先がない(自部署承認ですらない)場合の暫定対応(ケツの||追加) 20110204iga
					//if($H_g_sess["pacttype"] == "H"
					//					|| ($H_g_sess["pacttype"] == "M" && in_array("fnc_mt_recog", $A_auth) == true
					//						&& $H_recog["postidto"] == $H_g_sess["postid"] && $H_actord["actorder"] != true && $H_view["actready"] != true)
					//					|| MT_SITE == "shop"
					//					|| true === $H_recog["autorecog"]
					//					|| (false === $H_recog["autorecog"] && empty($H_recog["postidto"]))
					//					|| (true === $H_recog["authautorecog"] && $H_actord["actorder"] && $H_view["actready"])
					//				){
					//					$orderid_disp = true;
					//				} else {
					//					$orderid_disp = false;
					//				}
					//orderid_dispとか煩雑な条件で制御するくらいならステータスとり直して50だったら表示でいいと思う
					//メール作成・送信
					//shop_mnglog 20090216miya
					{
						this.O_unique.validate(H_sess.SELF.csrfid);
						var H_tmprecog = O_model.getRecogPost(H_g_sess, H_sess, curpostid, curpostname, H_actord);
						var H_recog = Array();

						if (H_tmprecog.postidto != undefined) {
							H_recog.postidto = H_tmprecog.postidto;
							H_recog.postname = H_tmprecog.postname;
						}

						if ("" == H_sess[OrderFormProc.PUB].telcount || 1 > H_sess[OrderFormProc.PUB].telcount) {
							H_sess[OrderFormProc.PUB].telcount = 1;
						}

						var orderid = O_order_modify_model.getNextOrderid();

						if (!O_fjp.checkAuth("co")) {
							H_recog.autorecog = O_order_modify_model.getAutoRecogCondition(H_g_sess.pactid, H_g_sess.postid, H_g_sess.userid, H_recog.postidto, true);
							H_recog.authautorecog = O_order_modify_model.getAutoRecogCondition(H_g_sess.pactid, H_g_sess.postid, H_g_sess.userid, H_recog.postidto, false);
						} else if (O_fjp.checkAuth("co") && preg_match("/MTActorder/", _SERVER.PHP_SELF)) //個人承認は処理しないのに、販売店代行注文では代行注文なのに自動承認かつ履歴まで残すという糞仕様
							{
								H_recog.autorecog = O_order_modify_model.getAutoRecogCondition(H_g_sess.pactid, H_g_sess.postid, H_g_sess.userid, H_recog.postidto, true);
								H_recog.authautorecog = O_order_modify_model.getAutoRecogCondition(H_g_sess.pactid, H_g_sess.postid, H_g_sess.userid, H_recog.postidto, false);
							}

						var H_sub_data = O_order_modify_model.makeOrderSubData(orderid, H_g_sess, H_sess, H_recog, A_auth, H_actord);
						var A_order_data = O_order_modify_model.makeOrderTableData(orderid, O_model, O_view, H_g_sess, H_sess, H_recog, A_auth, H_actord, H_view, H_sub_data);
						var H_detail_data = O_order_modify_model.makeOrderDetailData(orderid, H_g_sess, H_sess, H_recog, A_auth, H_actord);

						if (O_fjp.checkAuth("co") && -1 !== A_auth.indexOf("fnc_tel_division")) //divisionは後ろについてる前提。後ろ以外だと駄目
							{
								var idx = A_order_data.length - 1;

								if (A_order_data[idx] == "NULL") {
									this.errorOut(1, "\u7528\u9014\u533A\u5206\u30A8\u30E9\u30FC", 0);
								}
							}

						O_order_modify_model.makeOrderRelatedSQL(A_order_data, H_sub_data, H_detail_data);
						O_order_modify_model.insertOrderRelatedSQL();

						this._moveAttachFiles(orderid);

						this._attachDeleteDecision(orderid);

						if (true == ereg("MTActorder", getcwd())) //カレントディレクトリを見る
							{
								O_order_modify_model.insertActorderHistory(orderid, H_g_shop_sess, H_sess);

								if (O_fjp.checkAuth("co")) {
									O_order_modify_model.insertAutoRecogHistory(orderid, H_g_sess, H_sess, H_recog, true);
								}
							} else if (H_recog.autorecog) {
							O_order_modify_model.insertAutoRecogHistory(orderid, H_g_sess, H_sess, H_recog, false);
						}

						var H_cnt = O_order_modify_model.getSubNumber(orderid);
						O_order_modify_model.putSubNumber(orderid, H_sess[OrderFormProc.PUB].shopid, H_cnt);
						var checkstatus = O_model.getOrderStatus(orderid);
						var orderid_disp = false;

						if (50 <= checkstatus) {
							orderid_disp = true;
						}

						var H_mailparam = {
							type: H_sess[OrderFormProc.PUB].type,
							cirid: H_sess[OrderFormProc.PUB].cirid,
							carid: H_sess[OrderFormProc.PUB].carid,
							postname: curpostname,
							applypostname: curpostname,
							compname: H_view.compname,
							orderid: orderid,
							pacttype: H_g_sess.pacttype,
							pactid: H_g_sess.pactid
						};

						if (orderid_disp == false) //最終承認部署でなければ
							//自動承認はメール飛ばさない 20101129iga	orderid_dispの設定のif分追加したからいらないけど残しておく
							{
								if (!H_recog.autorecog) //申請メール
									//空白にしておけば共通メール設定のデフォルトメールアドレスが入る
									{
										var H_addr_JPN = Array();
										var H_addr_ENG = Array();
										var from = "";
										var from_name = O_model.getSystemName(H_g_sess.groupid, H_g_sess.language, H_g_sess.pacttype);

										if (O_fjp.checkAuth("co")) //個人承認へのメール 20090417miya
											{
												H_addr_JPN = O_fjp.getPrivateApplyMailSendList(orderid);
											} else if (undefined !== H_sess.SELF.select_recog_mail && H_sess.SELF.select_recog_mail != "") //選択した承認者のみメールを送る。
											//但し、メールアドレスが登録されていない、申請メールを受取らない設定のユーザーには送らない。
											{
												H_addr_JPN = O_model.getApplyMailSendByUserId(H_g_sess.pactid, H_recog.postidto, H_sess.SELF.select_recog_mail);
											} else //日本語ユーザへのメール 20090417miya
											//英語ユーザへのメール 20090417miya
											{
												H_addr_JPN = O_model.getApplyMailSendList(H_g_sess.pactid, H_recog.postidto, "JPN");
												H_addr_ENG = O_model.getApplyMailSendList(H_g_sess.pactid, H_recog.postidto, "ENG");
											}

										if (true == 0 < H_addr_JPN.length) {
											var H_mailcontent = O_model.orderMailWrite("apply", H_mailparam, H_sess[OrderFormProc.PUB].shopid, "JPN");
											O_model.sendOrderMail(H_mailcontent, H_addr_JPN, from, from_name);
										}

										if (true == 0 < H_addr_ENG.length) {
											H_mailcontent = O_model.orderMailWrite("apply", H_mailparam, H_sess[OrderFormProc.PUB].shopid, "ENG");
											O_model.sendOrderMail(H_mailcontent, H_addr_ENG, from, from_name);
										}
									} else {
									O_model.settingOrderMail(O_post, H_g_sess, H_sess, A_auth, H_view, H_mailparam);
								}
							} else //発注メール class化 20101129iga
							{
								O_model.settingOrderMail(O_post, H_g_sess, H_sess, A_auth, H_view, H_mailparam);
							}

						if (H_param.site == "shop") //管理記録書き込み
							{
								var H_mnglog = {
									shopid: H_g_sess.shopid,
									groupid: H_g_sess.groupid,
									memid: H_g_sess.memid,
									name: H_g_sess.personname,
									postcode: H_g_sess.postcode,
									comment1: "ID:" + H_g_sess.memid,
									comment2: H_view.compname + " V3\u53D7\u6CE8ID:" + orderid + "\u3092\u4EE3\u884C\u6CE8\u6587",
									kind: "MTActorder",
									type: "V3\u4EE3\u884C\u6CE8\u6587",
									joker_flag: 0
								};
								O_mnglog.writeShopMnglog(H_mnglog);
							}

						var ini = parse_ini_file(KCS_DIR + "/conf_sync/order_fin_mail_pact_cc.ini");
						var iniMailFrom = "";
						var inirMailFromName = "";

						if (!!ini && (!!H_g_sess.pactid && H_g_sess.pactid != 0)) {
							iniMailFrom = undefined !== ini["mail_from_" + H_g_sess.pactid] ? ini["mail_from_" + H_g_sess.pactid] : "";
							inirMailFromName = undefined !== ini["mail_from_name_" + H_g_sess.pactid] ? ini["mail_from_name_" + H_g_sess.pactid] : "";
						}

						var orderMailData = undefined;
						var orderMailFrom = !iniMailFrom ? H_sess.SELF.chargermail : iniMailFrom;
						var orderMailFromName = !inirMailFromName ? H_g_sess.loginname : inirMailFromName;

						if (H_param.site != "shop" && -1 !== O_view.getAuthPact().indexOf(OrderFormProc.ORDER_FIN_MAIL_SEND) && -1 !== ["N", "Nmnp", "C", "P", "D", "A", "M"].indexOf(H_sess[OrderFormProc.PUB].type)) //送信先のメールアドレスなど取得
							{
								var orderMail = O_model.getMtOrderTeldetailMailAddressList(orderid, H_g_sess.pactid);

								if (!!orderMail && !!orderMailFrom && !!orderMailFromName) {
									orderMailData[0] = orderMail;
									orderMailData[1].from = orderMailFrom;
									orderMailData[1].fromName = orderMailFromName;
									orderMailData[1].tpl = O_model.getOrderMailTemplate(H_g_sess.userid);
								}
							}

						O_view.endOrderFormView(orderid, orderid_disp, site_flg, H_sess[OrderFormProc.PUB].frompage, H_g_sess.groupid, orderMailData);
						throw die();
					} else //フォームをフリーズさせない
					{
						O_view.unfreezeForm(H_view.accQuant);
					}
			} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm(H_view.accQuant);
			}

		O_view.makeFormStatic(H_g_sess, Array(), H_view);
		O_view.assignBillLang();
		O_view.assignBillView();
		O_view.displaySmarty(H_sess, A_auth, H_product, H_message, H_g_sess, ptuni);
	}

	_moveAttachFiles(orderid) {
		var dir = this._getOrderFilesDir() + "/" + orderid;
		var tempDir = KCS_DIR + "/files/temp_" + session_id();
		var attach = this.get_View().gSess().getPub(OrderFormProc.ATTACH);

		if (!is_null(attach) && is_dir(tempDir) && !file_exists(dir + "/" + orderid)) {
			exec("/bin/mv " + tempDir + " " + dir);

			this._writeFilesinformation(attach, dir);

			this._signedAttach(orderid);
		}

		this.get_View().gSess().clearSessionPub(OrderFormProc.ATTACH);
	}

	_writeFilesinformation(attach, dir) {
		for (var type in attach) {
			var value = attach[type];
			var fh = fopen(dir + "/" + OrderFormProc.ATTACH_INFO + type + ".txt", "w+");
			fwrite(fh, serialize(value) + "\n");
			fclose(fh);
		}
	}

	_signedAttach(orderid) {
		var view = new AttachFilesView();
		var model = new OrderLightModel();

		view.setModel(model)._isExistAttacheFile(orderid, this._getOrderFilesDir() + "/" + orderid);
	}

	_attachDeleteDecision(orderid) {
		var view = new AttachFilesView();
		var model = new OrderLightModel();
		view.setModel(model).attachDeleteDecision(orderid, this._getOrderFilesDir() + "/" + orderid);
	}

	_getOrderFilesDir() {
		var dir = KCS_DIR + "/files/OrderFiles";

		if (!is_dir(dir)) {
			mkdir(dir);
		}

		return dir;
	}

	_getFjpModel(A_auth) {
		if (!this.O_fjp instanceof fjpModel) {
			return this.O_fjp = new fjpModel(OrderFormProc.PUB, A_auth);
		}

		return this.O_fjp;
	}

	orderMailSend(H_g_sess, site_flg) {
		var toDatas = _POST.to;

		if (!!toDatas) //モデル取得
			//メール送信とテンプレート保存
			{
				var ccDatas = _POST.cc;
				mailData.tpl = _POST.mail_message;
				mailData.from = _POST.mail_from;
				mailData.name = _POST.mail_from_name;
				var userData = _POST.userdata;
				var O_model = this.get_Model(H_g_sess, site_flg);
				O_model.orderMailSend(H_g_sess, toDatas, ccDatas, mailData, userData);
			}

		var url = _POST.back_url;
		header("Location: " + url);
		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};