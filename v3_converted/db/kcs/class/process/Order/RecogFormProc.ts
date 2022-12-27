//
//承認フォームページプロセス
//
//更新履歴：<br>
//2008/04/01 宮澤龍彦 作成
//
//@uses OrderFormProc
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2008/03/07
//
//
//
//error_reporting(E_ALL|E_STRICT);
//20091016miya
//
//プロセス実装
//
//@uses OrderFormProc
//@package Order
//@author miyazawa
//@since 2008/04/01
//
//

require("process/Order/OrderDetailFormProc.php");

require("model/Order/RecogFormModel.php");

require("model/Order/ShopOrderEditModel.php");

require("model/AreaModel.php");

require("model/PactModel.php");

require("view/Order/RecogFormView.php");

require("view/Order/ShopOrderEditView.php");

require("MtUniqueString.php");

require("model/Order/BillingModelBase.php");

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
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_g_sess
//@param mixed $O_order
//@access protected
//@return void
//
//
//
//各ページのModelオブジェクト取得
//
//@author igarashi
//@since 2008/09/08
//
//@param array $H_g_sess
//@param int 1(販売店で動作)
//
//@access protected
//@return void
//
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
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
//
class RecogFormProc extends OrderDetailFormProc {
	constructor(H_param: {} | any[] = Array(), flg = 1) {
		this.mode = flg;
		super(H_param);
	}

	get_View(H_param = {
		site: 0
	}) {
		if (0 == H_param.site) {
			return new RecogFormView();
		} else {
			return new ShopOrderEditView();
		}
	}

	get_Model(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new RecogFormModel(O_db0, H_g_sess, 0);
	}

	get_ShopModel(H_g_sess: {} | any[]) {
		return new ShopOrderEditModel(O_db0, H_g_sess, 1);
	}

	doExecute(H_param: {} | any[] = {
		site: 0
	}) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//表示に必要なものを格納する配列を取得
	//一括プラン変更の除外・戻し処理
	//2次元配列じゃないとダメなので無理矢理arrayっておく
	//一括プラン変更の全件数
	//必要な情報をセッションにセットして読み込みなおし
	//権限一覧取得
	//受注側の場合、この顧客に公私分計権限、請求閲覧権限があるかどうか見て、あれば$A_authに追加
	//（※本来販売店側からこのprocが呼ばれるときも$O_modelのコンストラクト時に権限がセットされるが、
	//受注の場合、modelを作ってから注文のpactidが判るので、ここで顧客側の権限を見る）
	//グローバルセッションに入れる 20100324miya
	//英語化権限 20090210miya
	//CSSの決定
	//Smartyテンプレートの取得
	//価格表からのデータを作る
	//カゴの中身作り直しフラグ 20100108miya
	//承認で注文の中身を作り直す場合
	//一つの配列にまとめる
	//使ってないはず
	//使ってないはず
	//注文情報から電話情報整形
	//注文情報の違約金をチェック
	//MNPは元キャリアから違約金情報を持ってこなければいけない 20090114miya
	//order_item_tbからフォーム表示項目を取得する
	//電話詳細情報入力フォーム作成
	//fjp以外ならfjp用フォーム削除
	//formの追加。DBからformを取得するのはメンテナンス性が微妙すぎる。内容はほぼコピペだし・・ね・・
	//会社名設定
	//第二階層参照しなければ$H_g_sess["compname"]と同じ
	//登録部署を設定
	//申請部署を設定 20090114miya
	//mt_addrule_tbから入力ルールを取得する
	//fjp以外ならfjp用ルール削除
	//オプションに指定割がない場合、ルールから指定割のルールを除外するため、ここでオプションを取得（除外しないと機種によってJavaScriptエラーになる）
	//入力ルールをフォームオブジェクトに入れる（確認画面に行くとき）
	//Javascriptで入力チェックを行う条件が間違っていたので修正 20090909miya
	//if ($H_sess["SELF"]["submitName"] == OrderFormView::NEXTNAME || $H_sess["SELF"]["submitName"] == OrderFormView::NEXTNAME_ENG) {
	//エラーメッセージ
	//付属品の合計数量が0だとエラーメッセージ出す
	//部署ツリー文字列取得
	//注文フォームのデフォルト値作成、セット
	//一括プラン変更
	//setDefaultsだとcheckboxがうまく入らない
	//NG・必須チェック
	//※第二階層部署なら成り代わり先の部署になる（未実装）
	//電話を一件だけ入力する注文パターンはここで電話詳細情報を取得する
	//上でmakeTelInfoFromOrderDataからtelinfo作ってるのを上書きしちゃうのでコメントアウト 20090410miya
	//		if ( true == in_array($H_sess[self::PUB]["type"], array("A","T","M")) && $H_sess["SELF"]["telno"] != "" ) {
	//			// 電話詳細情報取得
	//			$H_telinfo = $O_telinfo_model->checkTelInfoOne($H_sess, $H_g_sess);
	//			if (true == is_array($H_telinfo) && 0 < count($H_telinfo)) {
	//				foreach ($H_telinfo as $key=>$val) {
	//					if ($val["alert"] != "") {
	//						$A_alert[str_replace("telno", "", $key)] = $val["alert"];
	//					}
	//				}
	//			}
	//			// 取得した電話情報をSESSIONに入れる
	//			if ( true == is_array($H_telinfo) && 0 < count($H_telinfo) && 1 > count($A_alert) ) {
	//				$O_inputtel_view->setTelInfoSession($H_telinfo);
	//			}
	//			// セッション再取得
	//			$H_sess = $O_view->getLocalSession();
	//		}
	//フォームにエラーが無いし、エラーメッセージもないし、確認画面からの戻りでもなければ
	//注文時の価格を表示するためsubのanspasspriceを取得して別変数とする 20100107miya
	//viewに渡すため$H_orderに$H_productを入れる（カゴ情報）
	//スタティック表示作成
	//権限追加 20091009miya
	//Smartyによる表示
	{
		var O_view = this.get_View(H_param);

		if (false == is_null(O_view.gSess().memid)) {
			O_view.setSiteMode(1);
		}

		var O_telinfo_view = this.get_OrderTelInfoView();
		var O_inputtel_view = this.get_OrderInputTelView();

		if (0 == H_param.site) {
			var H_g_sess = O_view.getGlobalSession();
			this.O_unique = MtUniqueString.singleton();
		} else if (1 == H_param.site) {
			H_g_sess = O_view.getGlobalShopSession();
		}

		var O_order = OrderUtil.singleton(H_g_sess);

		if (0 == H_param.site) {
			var O_model = this.get_Model(H_g_sess, O_order);
			var O_telinfo_model = this.get_OrderTelInfoModel(H_g_sess);
			var O_order_modify_model = this.get_OrderModifyModel(H_g_sess);
		} else if (1 == H_param.site) {
			O_model = this.get_ShopModel(H_g_sess, O_order, H_param.site);
			O_telinfo_model = this.get_ShopOrderTelInfoModel(H_g_sess, H_param.site);
			O_order_modify_model = this.get_ShopOrderModifyModel(H_g_sess, H_param.site);
		}

		O_view.startCheck();
		var H_view = O_view.get_View();

		if (0 == H_param.site) //パンくずリンクの生成
			{
				if ("ENG" == H_g_sess.language) {
					H_view.pankuzu_link = O_order.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
				} else {
					H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "user");
				}
			} else if (1 == H_param.site) //パンくずリンクの生成
			{
				H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "shop");
			}

		var H_sess = O_view.getLocalSession();

		if ("B" == H_sess[RecogFormProc.PUB].type) {
			if ("" != H_sess.SELF.del) //$O_model->updateCount($H_sess[self::PUB]["orderid"], $H_sess["SELF"]["del"], "+");
				{
					O_model.updateBulkplan("del", H_sess[RecogFormProc.PUB].orderid, H_sess.SELF.del);
				}

			if ("" != H_sess.SELF.recover) //$O_model->updateCount($H_sess[self::PUB]["orderid"], $H_sess["SELF"]["del"], "+");
				{
					O_model.updateBulkplan("recover", H_sess[RecogFormProc.PUB].orderid, H_sess.SELF.recover);
				}
		}

		var H_order = O_model.getOrderInfo2(H_sess[RecogFormProc.PUB].orderid, H_g_sess.language);
		H_order.order = O_model.calcTotalTax(H_order.order);
		H_order.order.usepoint = O_model.calcUsePoint(H_order.sub);
		H_order.order = O_model.setMoneyFormat([H_order.order], true);
		H_order.sub = O_model.setMoneyFormat(H_order.sub, false);
		H_order.bulkcnt = H_order.sub.length;
		O_view.setOrderInfo(O_db0, H_g_sess, H_order, H_param.site);

		if (1 == H_param.site) //この部分のifが承認では抜けていたので修正 20091017miya
			//電話詳細情報を表示するのは新規、MNP、機変、移行。ホットラインはなし
			//スマートフォンもなし 20090312miya
			//上に持ってきた 20100325miya
			//会社タイプ取得
			//販売店側で受注内容変更する際、$H_g_sess["postid"]が入らずエラーになるので、ここで注文情報から注文部署のpostidを入れる 20090113miya
			//セッションのpactidと、orderidから取得したpactidが違ったら別窓警告 20100330miya
			{
				H_g_sess.pactid = H_order.order.pactid;
				var O_pact = new PactModel();
				var pacttype = O_pact.getPactType(H_order.order.pactid);
				H_g_sess.postid = H_order.order.applypostid;
				O_model.setShopAllAuthIni(H_g_sess);
				var H_pact = O_model.getPactFromOrder(H_sess[RecogFormProc.PUB].orderid);

				if (pacttype != H_pact.type) {
					this.errorOut(15, "pacttype\u304C\u4E00\u81F4\u3057\u306A\u3044", 0);
				}
			} else {
			pacttype = PACTTYPE;
		}

		H_g_sess.pacttype = pacttype;
		var A_auth = O_model.get_AuthIni();

		if (true == is_null(A_auth)) {
			A_auth = Array();
		}

		var O_fjp = this._getfjpModel(A_auth);

		O_view.setfjpModelObject(O_fjp);
		O_order_modify_model.setfjpModelObject(O_fjp);
		H_sess = O_view.getLocalSession();

		if ("ENG" == H_g_sess.language && 1 != H_param.site) //ローカルセッション取り直し
			{
				O_view.setEnglish(true);
				H_sess = O_view.getLocalSession();
			}

		if (1 == H_param.site) {
			if (false == (undefined !== H_sess[RecogFormProc.PUB].shopid) || false == is_numeric(H_sess[RecogFormProc.PUB].shopid)) {
				if (true == (undefined !== H_order.order.shopid) && true == (undefined !== H_order.order.shopmemid)) //ローカルセッション取り直し
					{
						H_shoptemp.shopid = H_order.order.shopid;
						H_shoptemp.memid = H_order.order.shopmemid;
						O_view.setShop(H_shoptemp);
						H_sess = O_view.getLocalSession();
					} else {
					this.errorOut(19, "shopid\u304C\u53D6\u5F97\u3067\u304D\u3066\u3044\u306A\u3044", 0);
				}
			}
		}

		H_view.js = O_view.getHeaderJS();
		H_view.css = O_view.getCSS();
		H_view.smarty_template = "../MTOrder/" + O_model.getSmartyTemplate(H_sess[RecogFormProc.PUB]);
		var H_pricedetail = Array();
		var H_accedetail = Array();
		H_view.reordflg = false;

		if ("" != H_sess[RecogFormProc.PUB].price_detailid || "" != H_sess.SELF.productname) //カゴの中身作り直しフラグ 20100108miya
			//注文種別が付属品の場合とそれ以外では取得するものが異なる
			//それ以外は取得した注文データからカゴの中身を作る
			{
				H_view.reordflg = true;

				if (H_sess[RecogFormProc.PUB].type == "A") //付属品の価格表取得
					{
						if (H_sess[RecogFormProc.PUB].price_detailid != "") //重複はスキップ
							{
								H_accedetail = Array();

								if (true == (undefined !== H_sess[RecogFormProc.PUB].H_product)) {
									H_accedetail = H_sess[RecogFormProc.PUB].H_product.acce;
								}

								var H_accedetail_temp = O_model.getAcceDetail(H_sess[RecogFormProc.PUB].price_detailid);
								var A_productid_chk = Array();

								for (var key in H_accedetail) {
									var val = H_accedetail[key];
									A_productid_chk.push(val.productid);
								}

								if (false == (-1 !== A_productid_chk.indexOf(H_accedetail_temp.productid))) {
									H_accedetail.push(H_accedetail_temp);
								}
							}
					} else //price_detail_tbから取得
					{
						if (true == (undefined !== H_sess[RecogFormProc.PUB].price_detailid)) //セッションのカゴ情報をきれいにする
							//電話の価格表取得
							//price_detailidから購入方式が取得できない場合に備えて別関数を作った 20090327miya
							//$H_pricedetail = $O_model->getPriceDetail($H_sess[self::PUB]["price_detailid"]);
							//付属品の価格表取得
							{
								delete H_sess[RecogFormProc.PUB].H_product;
								H_pricedetail = O_model.getPriceDetailCoverBuysel(H_sess);

								if (true == (undefined !== H_pricedetail.productid)) {
									H_accedetail = O_model.getRelatedProduct(H_g_sess, H_sess, A_auth, H_pricedetail.productid);
								}
							} else //セッションのカゴ情報をきれいにする
							//手入力の付属品はINIファイルから取得する
							{
								delete H_sess[RecogFormProc.PUB].H_product;
								H_pricedetail.productname = H_sess.SELF.productname;
								H_pricedetail.buyselid = H_sess.SELF.purchase;
								H_pricedetail.buyselname = O_view.convPurchaseId(H_sess[RecogFormProc.PUB].carid, H_sess.SELF.purchase);
								H_pricedetail.paycnt = H_sess.SELF.pay_frequency;
								H_accedetail = O_model.getRelatedProductHand(H_g_sess, H_sess, A_auth);
							}
					}
			} else //引数追加 20090428miya
			//$H_accedetail = $O_model->getRelatedProductFromOrderData($H_order);
			//選択されなかった付属品も選択できるようにした 20080109miya
			//付属品の場合は取得した注文データからそのまま持ってきて表示していい
			{
				H_pricedetail = O_model.getPriceDetailFromOrderData(H_order, H_g_sess.language);

				if (H_sess[RecogFormProc.PUB].type == "A") {
					H_accedetail = O_model.getRelatedProductFromOrderData(H_order);
				} else //price_detail_tbから取得
					{
						if (true == (undefined !== H_pricedetail.productid)) //手入力の場合
							{
								H_accedetail = O_model.getRelatedProduct(H_g_sess, H_sess, A_auth, H_pricedetail.productid);
							} else {
							H_accedetail = O_model.getRelatedProductHand(H_g_sess, H_sess, A_auth);
						}
					}
			}

		H_product.tel = H_pricedetail;
		H_product.acce = H_accedetail;
		H_product.purchase = O_view.convPurchaseId(H_sess[RecogFormProc.PUB].carid, H_sess.SELF.purchace);
		H_product.pay_frequency = O_view.convPayCountId(H_sess.SELF.pay_frequency);
		var H_telinfo = O_view.makeTelInfoFromOrderData(H_order);
		H_telinfo = O_telinfo_model.checkOrderPenalty(H_g_sess.pactid, H_telinfo);

		if ("Nmnp" == H_sess[RecogFormProc.PUB].type) {
			var H_sess_mnp = Array();
			var H_sess_mnp_SELF = Array();

			if (true == Array.isArray(H_order.sub)) {
				{
					let _tmp_0 = H_order.sub;

					for (var subky in _tmp_0) {
						var subvl = _tmp_0[subky];

						if (true == subvl.machineflg) {
							H_sess_mnp_SELF["telno_" + subky] = subvl.telno;
							H_sess_mnp_SELF["formercarid_" + subky] = subvl.formercarid;
							H_sess_mnp_SELF["mnpno_" + subky] = subvl.mnpno;
							H_sess_mnp_SELF["mnp_enable_date_" + subky] = subvl.mnp_enable_date;
						}
					}
				}
				H_sess_mnp.SELF = H_sess_mnp_SELF;
			}

			var H_telinfo_mnp = O_telinfo_model.checkTelInfoMNP(H_sess_mnp, H_g_sess, H_order.order.recogpostid);

			if ("" != H_telinfo_mnp) {
				for (var mnpky in H_telinfo_mnp) //違約金情報上書き
				{
					var mnpvl = H_telinfo_mnp[mnpky];
					H_telinfo[mnpky.replace(/^telno/g, "")].penalty = mnpvl.penalty;
				}
			}
		}

		if (H_product != "" || H_telinfo != "") //ローカルセッション取り直し
			{
				if (H_product != "") {
					O_view.setProductInfo(H_product);
				}

				if (H_telinfo != "") {
					O_view.setTelInfo(H_telinfo);
				}

				H_sess = O_view.getLocalSession();
			}

		O_view.makeOrderBoxInputForm(O_model, H_sess, H_param.site, H_order.sub[0]);
		var H_items = O_model.getOrderItem(H_sess[RecogFormProc.PUB]);

		if ("M" != H_sess[RecogFormProc.PUB].type) {
			var telcount = H_sess[RecogFormProc.PUB].telcount;
			var totalTelCnt = 0;

			for (var value of Object.values(H_order.sub)) {
				if (value.machineflg) {
					totalTelCnt++;
				}
			}
		} else {
			telcount = 1;
			totalTelCnt = 1;
		}

		var O_mptm = new ManagementPropertyTbModel();
		H_view.deleteOrderDisplayTelDetaile = false;

		if (true == (-1 !== ["N", "Nmnp", "C", "S", "M"].indexOf(H_sess[RecogFormProc.PUB].type)) && "H" != pacttype && 28 != H_sess[RecogFormProc.PUB].carid) {
			if (true == (undefined !== H_g_sess.pactid)) //1は電話のユーザ設定項目
				{
					var H_telproperty = O_mptm.getManagementPropertyDataForRequired(H_g_sess.pactid, 1);
				} else //1は電話のユーザ設定項目
				{
					H_telproperty = O_mptm.getManagementPropertyDataForrequired(H_order.order.pactid, 1);
				}

			[H_telitems, H_telitemrules] = O_telinfo_view.makeTelInfoForm2(H_telproperty, totalTelCnt, H_g_sess.language, H_sess);

			if (H_telitems.length > 0) {
				H_items = array_merge(H_items, H_telitems);
			}
		} else if (true == (-1 !== ["D", "A", "P"].indexOf(H_sess[RecogFormProc.PUB].type)) && "H" != PACTTYPE && 28 != H_sess[RecogFormProc.PUB].carid && -1 !== A_auth.indexOf("fnc_delete_order_display_tel_detaile")) //削除でも電話詳細情報を表示するため(編集不可) 20200715 hanashima
			//表示したいだけなのでバリデーションを空にする
			{
				if (true == (undefined !== H_g_sess.pactid)) //1は電話のユーザ設定項目
					{
						H_telproperty = O_mptm.getManagementPropertyDataForRequired(H_g_sess.pactid, 1);
					} else //1は電話のユーザ設定項目
					{
						H_telproperty = O_mptm.getManagementPropertyDataForrequired(H_order.order.pactid, 1);
					}

				[H_telitems, H_telitemrules] = O_telinfo_view.makeTelInfoForm2(H_telproperty, totalTelCnt, H_g_sess.language, H_sess);
				H_telitemrules = Array();

				if (H_telitems.length > 0) {
					H_items = array_merge(H_items, H_telitems);
				}

				H_view.deleteOrderDisplayTelDetaile = true;
			}

		H_items = O_fjp.excludeElements(H_items);
		var temp = O_view.getOrderForm(H_sess[RecogFormProc.PUB].type, H_sess[RecogFormProc.PUB].carid, H_sess[RecogFormProc.PUB].cirid, telcount, A_auth);
		H_items = array_merge(H_items, temp);
		H_view.compname = H_g_sess.compname;

		if (false == is_null(O_view.gSess().memid)) {
			H_view.recogpostid = H_order.order.recogpostid;
		} else {
			H_view.recogpostid = O_view.makeRecogPostid(H_sess, H_g_sess);
		}

		H_view.applypostid = H_order.order.applypostid;

		if (false == is_null(O_view.gSess().memid)) {
			var H_pactpost = O_model.getPactPostIDFromOrderid(H_sess[RecogFormProc.PUB].orderid);
			H_g_sess.pactid = H_pactpost.pactid;
			H_g_sess.postid = H_pactpost.postid;
			var H_tmp = O_view.gSess().getPub(RecogFormProc.PUB);
			H_tmp.pactid = H_g_sess.pactid;
			H_tmp.postid = H_g_sess.postid;
			O_view.gSess().setPub(RecogFormProc.PUB, H_tmp);
		}

		O_view.makeOrderForm(O_order, O_model, O_telinfo_model, H_items, H_sess[RecogFormProc.PUB], H_g_sess, totalTelCnt, Array(), H_sess[RecogFormProc.PUB].H_product, H_view, H_order.order.pactid);
		var H_rules = O_model.getRule(H_sess[RecogFormProc.PUB]);

		if (H_telitemrules.length > 0) {
			H_rules = array_merge(H_rules, H_telitemrules);
		}

		H_rules = O_fjp.excludeElements(H_rules, "name");

		if (!Array.isArray(H_rules)) {
			H_rules = Array();
		}

		if (1 == H_param.site) //販売店では要らないルールを除去 20090217miya
			{
				var H_shoprule = O_model.getFormRule();

				for (var rlno in H_rules) {
					var rule = H_rules[rlno];

					if ("DateBefore" == rule.type || "RadioDateBefore" == rule.type) //RadioDateBeforeが抜けていたので追加 20100625miya
						{
							delete H_rules[rlno];
						}
				}

				if (0 < H_rules.length) {
					H_rules = array_merge(H_rules, H_shoprule);
				} else {
					H_rules = H_shoprule;
				}
			}

		temp = O_view.getOrderRule(H_sess[RecogFormProc.PUB].type, H_sess[RecogFormProc.PUB].carid, H_sess[RecogFormProc.PUB].cirid, telcount, A_auth, H_order.order.pactid);
		H_rules = array_merge(H_rules, temp);
		var A_remove_rule = {
			"waribiki\\[33\\]": "waribiki\\[33\\]",
			"waribiki\\[44\\]": "waribiki\\[44\\]",
			"waribiki\\[76\\]": "waribiki\\[76\\]"
		};

		if ("" != H_product) {
			var H_option = O_model.getOrderOption(H_sess[RecogFormProc.PUB], H_product);

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

		var ptuni = O_model.getPointUnit(H_sess[RecogFormProc.PUB].carid);

		if (H_sess.SELF.submitName == "") {
			var telcnt = 0;

			if (telcount > 0) {
				telcnt = totalTelCnt;
			}

			O_view.makeOrderRule(H_rules, telcnt, A_auth, ptuni);
		}

		var validation_result = false;
		var H_message = Array();

		if (H_sess.SELF.submitName == RecogFormView.NEXTNAME || H_sess.SELF.submitName == RecogFormView.NEXTNAME_ENG) {
			if ("A" == H_sess[RecogFormProc.PUB].type) {
				var total = 0;
				{
					let _tmp_1 = H_product.acce;

					for (var key in _tmp_1) {
						var val = _tmp_1[key];

						if (true == is_numeric(val.productid)) {
							total += H_sess.SELF["acce" + val.productid];
						} else {
							total += H_sess.SELF["acce" + val.productname];
						}
					}
				}

				if (undefined !== H_sess[RecogFormProc.PUB].free_acce) {
					{
						let _tmp_2 = H_sess[RecogFormProc.PUB].free_acce;

						for (var ky in _tmp_2) {
							var vl = _tmp_2[ky];
							total += vl.free_count;
						}
					}
				}

				if (0 == total) {
					H_message.push("\u5408\u8A08\u6570\u91CF\u304C0\u3067\u306F\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093");
					O_view.clearSessionKeySelf("submitName");
				}
			}
		}

		if (H_sess.SELF.submitName == RecogFormView.NEXTNAME || H_sess.SELF.submitName == RecogFormView.RECNAME || H_sess.SELF.submitName == RecogFormView.NEXTNAME_ENG || H_sess.SELF.submitName == RecogFormView.RECNAME_ENG) {
			validation_result = H_view.O_OrderFormUtil.validateWrapper();

			if (undefined !== H_order.order.ordertype) {
				if ("Tpc" == H_order.order.ordertype) {
					if (undefined !== H_sess.SELF.transfer && "\u6CD5\u4EBA\uFF08\u81EA:\u81EA\u793E\u540D\u7FA9\uFF09\u2192\u500B\u4EBA\uFF08\u4ED6:\u4ED6\u793E\u540D\u7FA9\uFF09" == H_sess.SELF.transfer) {
						if (is_null(O_telinfo_model.getTelInfo(H_order.sub[0].telno, H_order.order.pactid, H_order.order.ordertype, H_order.order.carid))) {
							validation_result = false;

							if ("ENG" == H_g_sess.language) {
								H_message.push("This telephone number is not registered.");
							} else {
								H_message.push("\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u96FB\u8A71\u306F\u3001\u6CD5\u4EBA\u304B\u3089\u500B\u4EBA\u3078\u306E\u5909\u66F4\u306F\u9078\u629E\u3067\u304D\u307E\u305B\u3093");
							}
						}
					}
				}
			}

			if (false == validation_result) {
				delete H_sess.SELF.submitName;
			}
		}

		var H_ordersub = H_order.sub;
		var A_nodisptel = Array();

		if ("B" == H_sess[RecogFormProc.PUB].type && H_sess.SELF.submitName != RecogFormView.NEXTNAME && H_sess.SELF.submitName != RecogFormView.NEXTNAME_ENG) {
			var limit = undefined;
			var offset = 0;

			if ("" != H_sess[RecogFormProc.PUB].limit) {
				limit = H_sess[RecogFormProc.PUB].limit;
			}

			if ("" != H_sess[RecogFormProc.PUB].offset) {
				offset = H_sess[RecogFormProc.PUB].offset - 1;
			}

			if ("" != limit) //処理前の電話番号リスト作成
				//必要な部分だけ切り取り
				//処理後の電話番号リスト作成
				//画面に表示されない電話番号リスト作成
				//表示用にテンプレートに渡す
				{
					var A_beftel = Array();

					for (var H_subbef of Object.values(H_order.sub)) {
						A_beftel.push(H_subbef.telno);
					}

					H_ordersub = H_order.sub.slice(limit * offset, limit);
					var A_afttel = Array();

					for (var H_subaft of Object.values(H_ordersub)) {
						A_afttel.push(H_subaft.telno);
					}

					A_nodisptel = array_diff(A_beftel, A_afttel);
					H_view.A_nodisptel = A_nodisptel;
				}
		}

		if ("B" == H_sess[RecogFormProc.PUB].type) //地域会社取得
			//フォーム要素追加
			{
				var O_area = new AreaModel();
				var H_area = O_area.getAreaKeyHash(H_sess[RecogFormProc.PUB].carid);
				O_view.makeBulkPlanForm(H_order.sub, H_area, A_nodisptel);
			}

		var O_post = new PostModel();
		H_view.rootpostid = O_post.getRootPostid(H_g_sess.pactid);
		H_view.posttreestr = O_view.makePosttreeband(H_sess, H_g_sess, H_view);
		var H_def = O_view.makeOrderDefault(H_g_sess, H_sess, O_model, H_view, H_order, H_ordersub);
		O_fjp.setPreviousRecog(H_sess, H_def, H_order.order);
		O_fjp.setDefaultFJPExtension(H_sess, H_def, H_order.order);

		if (this.O_unique instanceof MtUniqueString && !H_sess.SELF.csrfid) {
			H_def.csrfid = this.O_unique.getInheritingUniqueId();
		} else {
			H_def.csrfid = H_sess.SELF.csrfid;
		}

		if ("B" == H_def.ordertype) //ページリンクの生成
			//結果配列用意
			{
				H_view.bulkplan = H_def.bulkplan;
				var page_link_temp = O_order.getPageLink(H_order.bulkcnt, H_sess[RecogFormProc.PUB].limit, H_sess[RecogFormProc.PUB].offset);
				var A_result = Array();

				if (0 < preg_match_all("/a href=\\?p=[0-9]+/", page_link_temp, A_result)) {
					for (var resultrow of Object.values(A_result[0])) //「a href=?p=2」という形式で来る
					//イコールで分割。上の例だと[0]=>a href, [1]=>?p, [2]=>2
					{
						var matched = resultrow;
						var A_spl = split("=", matched);
						var modified_str = "a href=\"#\" onClick=\"javascript:document.form.p.value=" + A_spl[2] + "; document.form.submit(); return false\" ";
						page_link_temp = preg_replace("/a href=\\?p=" + A_spl[2] + "/", modified_str, page_link_temp);
					}
				}

				H_view.page_link = page_link_temp;
			}

		H_constans.option = H_def.option;
		H_constans.waribiki = H_def.waribiki;
		H_constans.service = H_def.service;
		H_def.option = Array();
		H_def.waribiki = Array();
		H_def.service = Array();
		H_view.O_OrderFormUtil.setDefaultsWrapper(H_def);
		H_view.O_OrderFormUtil.O_Form.setConstants(H_constans);

		if (H_sess[RecogFormProc.PUB].telinfo.length > 0) //電話情報のデフォルト値作成、セット
			//電話詳細情報の電話番号表示部分作成
			//電話詳細情報のMNPアラート表示部分作成
			//電話の違約金表示部分作成
			{
				var H_telinfo_separated = O_telinfo_view.separateTelInfo(H_sess[RecogFormProc.PUB].telinfo);
				H_view.O_OrderFormUtil.setDefaultsWrapper(H_telinfo_separated);
				H_view.teldisplay = O_view.makeTelInfoDisplay(H_sess[RecogFormProc.PUB].telinfo);
				H_view.mnpalert = O_view.makeTelInfoMNPAlert(H_sess[RecogFormProc.PUB].telinfo);

				if (true == (-1 !== ["N", "Nmnp", "C", "S", "P", "Ppl", "Pdc", "Pop", "D"].indexOf(H_sess[RecogFormProc.PUB].type))) {
					H_view.telpenalty = O_view.makeTelPenalty(H_sess[RecogFormProc.PUB].telinfo);
				}
			}

		if (undefined !== H_sess.SELF.billid && !!H_sess.SELF.billid) {
			O_view.assignBillData(O_model.getBillData(O_view, H_sess.SELF.billid));
		} else {
			O_view.assignRegisterdBillData(H_order.order);
		}

		H_message += O_model.checkCombination(H_sess);
		var curpostid = H_g_sess.postid;
		var curpostname = H_g_sess.postname;
		var H_actord = Array();

		if (validation_result == true && H_message.length < 1 && H_sess.SELF.backName != OrderFormView.BACKNAME && H_sess.SELF.backName != OrderFormView.BACKNAME_ENG) //確認画面
			{
				if (H_sess.SELF.submitName == OrderFormView.NEXTNAME || H_sess.SELF.submitName == OrderFormView.NEXTNAME_ENG) //フォームをフリーズする
					//完了画面
					{
						O_view.freezeForm();
					} else if (H_sess.SELF.submitName == RecogFormView.RECNAME || H_sess.SELF.submitName == RecogFormView.RECNAME_ENG) //RecogFormModelにある
					//RecogFormModelにある
					//RecogFormModelにある
					//RecogFormModelにある
					//RecogFormModelにある
					//プラン変更は電話詳細情報が1件しか来ないので件数渡す必要あり 20100318miya
					//RecogFormModelにある
					//件数 20091027miya
					//トランザクション開始
					//今までのカゴと現状のカゴのデータを比べてアップデート
					//OrderMainModelにある
					//OrderMainModelにある
					//2014-08-25 障害26
					//OrderMainModelにある
					//違いがあったら更新
					//トランザクション終了
					//セッション削除処理・完了画面表示
					{
						if (this.O_unique instanceof MtUniqueString) {
							this.O_unique.validate(H_sess.SELF.csrfid);
						}

						if (0 == H_param.site) //承認部署取得
							//ルート部署が第2階層の販売店へ発注をする場合、承認先を第2階層部署の承認先に変更
							//最終承認部署かどうかチェック
							{
								var H_tmprecog = O_model.getRecogPost(H_g_sess, H_sess, curpostid, curpostname, H_actord);
								var H_recog = Array();

								if (H_tmprecog.postidto != undefined) {
									H_recog.postidto = H_tmprecog.postidto;
									H_recog.postname = H_tmprecog.postname;
								}
							}

						var H_old = Array();
						var H_new = Array();
						H_old = O_model.makeUpdateOldData(H_order, "ord");
						H_new = O_model.makeUpdateNewData(H_sess, H_product, "ord");
						var H_oldsub = O_model.makeUpdateOldData(H_order, "sub");
						var H_newsub = O_model.makeUpdateNewData(H_sess, H_product, "sub");
						var H_olddet = O_model.makeUpdateOldData(H_order, "det");
						var H_newdet = O_model.makeUpdateNewData(H_sess, H_product, "det", totalTelCnt);

						if (H_sess[RecogFormProc.PUB].type == "M") //その他は「数量」から入ってくる
							//現在の数量
							//新しい数量
							{
								H_old.telcnt = H_order.order.telcnt;
								H_oldsub.number = H_order.sub[0].number;
								H_olddet[0].number = H_order.sub[0].number;

								if ("" != H_sess.SELF.number) {
									H_new.telcnt = H_sess.SELF.number;
									H_newsub.number = H_new.telcnt;
									H_newdet[0].number = H_new.telcnt;
								} else {
									H_new.telcnt = undefined;
									H_newsub.number = 1;
									H_newdet[0].number = 1;
								}
							}

						H_product_old.tel = O_model.getPriceDetailFromOrderData(H_order);
						H_product_old.acce = O_model.getRelatedProductFromOrderData(H_order);
						this.get_DB().beginTransaction();
						O_order_modify_model.checkUpdateProduct(H_sess, H_product_old, H_product);
						var H_upd = O_order_modify_model.checkUpdateColumns(H_old, H_new);

						if (OrderModelBase.SITE_SHOP == H_param.site) {
							delete H_upd.smartphonetype;

							if (Array.isArray(H_upd) && H_upd.length == 0) {
								H_upd = true;
							}
						}

						if (true == Array.isArray(H_upd)) //オーダーID入れる
							//OrderModifyModelBaseにある
							{
								H_upd.orderid = H_sess[RecogFormProc.PUB].orderid;
								O_order_modify_model.updateOrderTable(H_upd);
							}

						var billModel = new BillingModelBase();
						billModel.setView(O_view);
						var execResult = billModel.updateRegisteredOrderBillingData();
						var H_updsub = O_order_modify_model.checkUpdateColumns(H_oldsub, H_newsub);

						if (true == Array.isArray(H_updsub)) //オーダーID入れる
							//OrderModifyModelBaseにある
							{
								H_updsub.orderid = H_sess[RecogFormProc.PUB].orderid;
								O_order_modify_model.updateSubTable(H_updsub);
							}

						if (true == Array.isArray(H_olddet)) {
							for (var okey in H_olddet) //一括プラン変更は旧データにプラン、パケットが入っていて新データはnullなので、放っておくとnullで上書きされてしまう！ 20100618miya
							//OrderMainModelにある
							{
								var oval = H_olddet[okey];

								if ("B" == H_sess[RecogFormProc.PUB].type) {
									oval.plan = undefined;
									oval.packet = undefined;
								}

								if (false == (-1 !== ["N", "Nmnp", "C", "S", "M"].indexOf(H_sess[RecogFormProc.PUB].type))) {
									H_newdet[okey].mail = oval.mail;
									H_newdet[okey].telusername = oval.telusername;
									H_newdet[okey].employeecode = oval.employeecode;
									H_newdet[okey].text1 = oval.text1;
									H_newdet[okey].text2 = oval.text2;
									H_newdet[okey].text3 = oval.text3;
									H_newdet[okey].text4 = oval.text4;
									H_newdet[okey].text5 = oval.text5;
									H_newdet[okey].text6 = oval.text6;
									H_newdet[okey].text7 = oval.text7;
									H_newdet[okey].text8 = oval.text8;
									H_newdet[okey].text9 = oval.text9;
									H_newdet[okey].text10 = oval.text10;
									H_newdet[okey].text11 = oval.text11;
									H_newdet[okey].text12 = oval.text12;
									H_newdet[okey].text13 = oval.text13;
									H_newdet[okey].text14 = oval.text14;
									H_newdet[okey].text15 = oval.text15;
									H_newdet[okey].int1 = oval.int1;
									H_newdet[okey].int2 = oval.int2;
									H_newdet[okey].int3 = oval.int3;
									H_newdet[okey].int4 = oval.int4;
									H_newdet[okey].int5 = oval.int5;
									H_newdet[okey].int6 = oval.int6;
									H_newdet[okey].date1 = oval.date1;
									H_newdet[okey].date2 = oval.date2;
									H_newdet[okey].date3 = oval.date3;
									H_newdet[okey].date4 = oval.date4;
									H_newdet[okey].date5 = oval.date5;
									H_newdet[okey].date6 = oval.date6;
									H_newdet[okey].mail1 = oval.mail1;
									H_newdet[okey].mail2 = oval.mail2;
									H_newdet[okey].mail3 = oval.mail3;
									H_newdet[okey].url1 = oval.url1;
									H_newdet[okey].url2 = oval.url2;
									H_newdet[okey].url3 = oval.url3;
									H_newdet[okey].select1 = oval.select1;
									H_newdet[okey].select2 = oval.select2;
									H_newdet[okey].select3 = oval.select3;
									H_newdet[okey].select4 = oval.select4;
									H_newdet[okey].select5 = oval.select5;
									H_newdet[okey].select6 = oval.select6;
									H_newdet[okey].select7 = oval.select7;
									H_newdet[okey].select8 = oval.select8;
									H_newdet[okey].select9 = oval.select9;
									H_newdet[okey].select10 = oval.select10;
									H_newdet[okey].memo = oval.memo;
								}

								var chkresult = O_order_modify_model.checkUpdateColumns(oval, H_newdet[okey]);

								if (true == Array.isArray(chkresult)) {
									H_upddet[okey] = chkresult;
								}
							}
						}

						if (true == Array.isArray(H_upddet)) //電話詳細情報が消える現象をキャッチ 20100318miya
							//if (true == in_array($H_sess[self::PUB]["type"], array("N","C","S"))) {
							//$H_upddet = $O_model->checkNullUpdateDetail($H_olddet,$H_upddet);
							//}
							{
								if (true == Array.isArray(H_upddet)) //オーダーID入れる
									//OrderModifyModelBaseにある
									{
										H_upddet.orderid = H_sess[RecogFormProc.PUB].orderid;
										O_order_modify_model.updateDetTable(H_upddet);
									}
							}

						if ("B" == H_sess[RecogFormProc.PUB].type) {
							O_order_modify_model.updateBulkPlan(H_sess[RecogFormProc.PUB].orderid, H_sess.SELF);
						}

						if (1 == H_param.site) {
							O_model.updateOrderHistory(H_g_sess, H_sess, H_order.order.status);
						}

						if ("B" != H_sess[RecogFormProc.PUB].type) {
							var H_cnt = O_order_modify_model.getSubNumber(H_sess[RecogFormProc.PUB].orderid);
						} else {
							H_cnt = O_order_modify_model.getBulkSubNumber(H_sess[RecogFormProc.PUB].orderid);
						}

						O_order_modify_model.putSubNumber(H_sess[RecogFormProc.PUB].orderid, H_order.order.shopid, H_cnt);
						this.get_DB().commit();
						O_view.endOrderFormView(H_sess[RecogFormProc.PUB].orderid);
						throw die();
					} else //フォームをフリーズさせない
					{
						O_view.unfreezeForm();
					}
			} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		var H_firstprice = Array();
		var H_fp_tmp = O_model.getFirstPrice(H_sess[RecogFormProc.PUB].orderid);

		if (true == Array.isArray(H_fp_tmp) and true == 0 < H_fp_tmp.length) {
			for (var fp of Object.values(H_fp_tmp)) //カゴの内容が注文時と変わらないなら、anspassprice*numberとsubtotalは同じはず
			{
				if (+(fp.anspassprice * +fp.number) == fp.subtotal) //linenoではなくproductidで価格を引く（productidがなければ手入力なので価格はない） 20100701miya
					{
						if (undefined != fp.productid) {
							H_firstprice[fp.productid] = fp.anspassprice;
						}
					}
			}
		}

		H_order.firstprice = H_firstprice;
		H_order.product = H_product;
		O_view.makeFormStatic(H_g_sess, H_order, A_auth);
		O_view.assignBillView();
		O_view.assignBillLang();
		O_view.displaySmarty(H_g_sess, H_sess, A_auth, H_order, H_message, H_param, ptuni);
	}

	_getFjpModel(A_auth) {
		if (!this.O_fjp instanceof fjpModel) {
			return this.O_fjp = new fjpModel(RecogFormProc.PUB, A_auth);
		}

		return this.O_fjp;
	}

	__destruct() {
		super.__destruct();
	}

};