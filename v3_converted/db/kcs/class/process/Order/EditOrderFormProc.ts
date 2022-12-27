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
//error_reporting(E_ALL|E_STRICT);
//
//プロセス実装
//
//@uses OrderFormProc
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("process/Order/OrderDetailFormProc.php");

require("model/Order/RecogFormModel.php");

require("model/Order/ShopOrderEditModel.php");

require("view/Order/RecogFormView.php");

require("view/Order/ShopOrderEditView.php");

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
//@param array $H_g_sess
//@param mixed $O_order
//@access protected
//@return void
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

	get_Model(H_g_sess: {} | any[]) {
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
	//権限一覧取得
	//注文データ取得
	//2次元配列じゃないとダメなので無理矢理arrayっておく
	//必要な情報をセッションにセットして読み込みなおし
	//Javascriptの生成
	//パンくずリンクの生成
	//CSSの決定
	//Smartyテンプレートの取得
	//価格表からのデータを作る
	//承認で注文の中身を作り直す場合
	//一つの配列にまとめる
	//注文情報から電話情報整形
	//注文情報の違約金をチェック
	//ディレクトリセッションに「H_product」「telinfo」として入れる
	//order_item_tbからフォーム表示項目を取得する
	//電話詳細情報入力フォーム作成
	//登録部署を設定	***** 開発途中！！　今は$H_g_sess["postid"]か電話の登録部署を返している *****
	//mt_addrule_tbから入力ルールを取得する
	//部署ツリー文字列取得
	//注文フォームのデフォルト値作成、セット
	//NG・必須チェック
	//※第二階層部署なら成り代わり先の部署になる（未実装）
	//電話を一件だけ入力する注文パターンはここで電話詳細情報を取得する
	//スタティック表示作成
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
		} else if (1 == H_param.site) {
			H_g_sess = O_view.getGlobalShopSession();
		}

		var O_order = new OrderUtil(H_g_sess);

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
		var A_auth = O_model.get_AuthIni();

		if (true == is_null(A_auth)) {
			A_auth = Array();
		}

		var H_view = O_view.get_View();
		var H_sess = O_view.getLocalSession();
		var H_order = O_model.getOrderInfo(H_sess[RecogFormProc.PUB].orderid);
		H_order.order = O_model.calcTotalTax(H_order.order);
		H_order.order.usepoint = O_model.calcUsePoint(H_order.sub);
		H_order.order = O_model.setMoneyFormat([H_order.order], true);
		H_order.sub = O_model.setMoneyFormat(H_order.sub, false);
		O_view.setOrderInfo(O_db0, H_g_sess, H_order, H_param.site);
		H_sess = O_view.getLocalSession();
		H_view.js = O_view.getHeaderJS();
		H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash());
		H_view.css = O_view.getCSS();
		H_view.smarty_template = "../MTOrder/" + O_model.getSmartyTemplate(H_sess[RecogFormProc.PUB]);
		var H_pricedetail = Array();
		var H_accedetail = Array();

		if (true == (undefined !== H_sess[RecogFormProc.PUB].price_detailid) || true == (undefined !== H_sess.SELF.productname)) //注文種別が付属品の場合とそれ以外では取得するものが異なる
			//それ以外は取得した注文データからカゴの中身を作る
			{
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
							//付属品の価格表取得
							{
								delete H_sess[RecogFormProc.PUB].H_product;
								H_pricedetail = O_model.getPriceDetail(H_sess[RecogFormProc.PUB].price_detailid);

								if (true == (undefined !== H_pricedetail.productid)) {
									H_accedetail = O_model.getRelatedProduct(H_g_sess, H_sess, A_auth, H_pricedetail.productid);
								}
							} else //手入力の付属品はINIファイルから取得する
							{
								H_pricedetail.productname = H_sess.SELF.productname;
								H_pricedetail.buyselid = H_sess.SELF.purchase;
								H_pricedetail.buyselname = O_view.convPurchaseId(H_sess[RecogFormProc.PUB].carid, H_sess.SELF.purchase);
								H_pricedetail.paycnt = H_sess.SELF.pay_frequency;
								H_accedetail = O_model.getRelatedProductHand(H_g_sess, H_sess, A_auth);
							}
					}
			} else {
			H_pricedetail = O_model.getPriceDetailFromOrderData(H_order);
			H_accedetail = O_model.getRelatedProductFromOrderData(H_order);
		}

		H_product.tel = H_pricedetail;
		H_product.acce = H_accedetail;
		H_product.purchase = O_view.convPurchaseId(H_sess[RecogFormProc.PUB].carid, H_sess.SELF.purchace);
		H_product.pay_frequency = O_view.convPayCountId(H_sess.SELF.pay_frequency);
		var H_telinfo = O_view.makeTelInfoFromOrderData(H_order);
		H_telinfo = O_telinfo_model.checkOrderPenalty(H_g_sess.pactid, H_telinfo);

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

		O_view.makeOrderBoxInputForm(O_model, H_sess);
		var H_items = O_model.getOrderItem(H_sess[RecogFormProc.PUB]);

		if (true == (undefined !== H_g_sess.pactid)) //1は電話のユーザ設定項目
			{
				var H_telproperty = ManagementPropertyTbModel.getManagementPropertyData(H_g_sess.pactid, 1);
			} else //1は電話のユーザ設定項目
			{
				H_telproperty = ManagementPropertyTbModel.getManagementPropertyData(H_order.order.pactid, 1);
			}

		[H_telitems, H_telitemrules] = O_telinfo_view.makeTelInfoForm(H_telproperty, H_sess[RecogFormProc.PUB].telcount);

		if (H_telitems.length > 0) {
			H_items = array_merge(H_items, H_telitems);
		}

		H_view.compname = H_g_sess.compname;

		if (false == is_null(O_view.gSess().memid)) {
			H_view.recogpostid = H_order.order.recogpostid;
		} else {
			H_view.recogpostid = O_view.makeRecogPostid(H_sess, H_g_sess);
		}

		if (false == is_null(O_view.gSess().memid)) {
			H_g_sess.pactid = O_model.getPactidFromOrderid(H_sess[RecogFormProc.PUB].orderid);
		}

		O_view.makeOrderForm(O_order, O_model, O_telinfo_model, H_items, H_sess[RecogFormProc.PUB], H_g_sess, H_sess[RecogFormProc.PUB].telcount, Array(), H_sess[RecogFormProc.PUB].H_product, H_view, H_order.order.pactid);
		var H_rules = O_model.getRule(H_sess[RecogFormProc.PUB]);

		if (H_telitemrules.length > 0) {
			H_rules = array_merge(H_rules, H_telitemrules);
		}

		if (H_sess.SELF.submitName == OrderFormView.NEXTNAME) {
			O_view.makeOrderRule(H_rules);
		}

		var O_post = new PostModel();
		H_view.rootpostid = O_post.getRootPostid(H_g_sess.pactid);
		H_view.posttreestr = O_view.makePosttreeband(H_sess, H_g_sess, H_view);
		var H_def = O_view.makeOrderDefault(H_g_sess, H_sess[RecogFormProc.PUB], O_model, H_view, H_order);
		H_view.O_OrderFormUtil.setDefaultsWrapper(H_def);

		if (H_sess[RecogFormProc.PUB].telinfo.length > 0) //電話情報のデフォルト値作成、セット
			//電話詳細情報の電話番号表示部分作成
			//電話詳細情報のMNPアラート表示部分作成
			//電話の違約金表示部分作成
			{
				var H_telinfo_separated = O_telinfo_view.separateTelInfo(H_sess[RecogFormProc.PUB].telinfo);
				H_view.O_OrderFormUtil.setDefaultsWrapper(H_telinfo_separated);
				H_view.teldisplay = O_view.makeTelInfoDisplay(H_sess[RecogFormProc.PUB].telinfo);
				H_view.mnpalert = O_view.makeTelInfoMNPAlert(H_sess[RecogFormProc.PUB].telinfo);

				if (true == (-1 !== ["C", "S", "P", "D"].indexOf(H_sess[RecogFormProc.PUB].type))) {
					H_view.telpenalty = O_view.makeTelPenalty(H_sess[RecogFormProc.PUB].telinfo);
				}
			}

		var H_message = Array();
		H_message += O_model.checkCombination(H_sess);
		var curpostid = H_g_sess.postid;
		var curpostname = H_g_sess.postname;
		var H_actord = Array();

		if (true == (-1 !== ["A", "T", "M"].indexOf(H_sess[RecogFormProc.PUB].type)) && H_sess.SELF.telno != "") //電話詳細情報取得
			{
				H_telinfo = O_telinfo_model.checkTelInfoOne(H_sess, H_g_sess);

				if (true == Array.isArray(H_telinfo) && 0 < H_telinfo.length) {
					for (var key in H_telinfo) {
						var val = H_telinfo[key];

						if (val.alert != "") {
							A_alert[str_replace("telno", "", key)] = val.alert;
						}
					}
				}

				if (true == Array.isArray(H_telinfo) && 0 < H_telinfo.length && 1 > A_alert.length) {
					O_inputtel_view.setTelInfoSession(H_telinfo);
				}

				H_sess = O_view.getLocalSession();
			}

		if (H_view.O_OrderFormUtil.validateWrapper() == true && H_message.length < 1 && H_sess.SELF.backName != OrderFormView.BACKNAME) //確認画面
			{
				if (H_sess.SELF.submitName == OrderFormView.NEXTNAME) //フォームをフリーズする
					//完了画面
					{
						O_view.freezeForm();
					} else if (H_sess.SELF.submitName == RecogFormView.RECNAME) //承認部署取得
					//ルート部署が第2階層の販売店へ発注をする場合、承認先を第2階層部署の承認先に変更
					//最終承認部署かどうかチェック
					//RecogFormModelにある
					//RecogFormModelにある
					//RecogFormModelにある
					//RecogFormModelにある
					//RecogFormModelにある
					//RecogFormModelにある
					//var_dump($H_olddet);
					//var_dump($H_newdet);
					//今までのカゴのデータをここで取得
					//var_dump($H_product_old);
					//現状のカゴのデータ
					//var_dump($H_product);
					//トランザクション開始
					//今までのカゴと現状のカゴのデータを比べてアップデート
					//OrderMainModelにある
					//OrderMainModelにある
					//違いがあったら更新
					//OrderMainModelにある
					//違いがあったら更新
					//OrderMainModelにある
					//違いがあったら更新
					//セッション削除処理・完了画面表示
					{
						var H_tmprecog = O_model.getRecogPost(H_g_sess, H_sess, curpostid, curpostname, H_actord);
						var H_recog = Array();

						if (H_tmprecog.postidto != undefined) {
							H_recog.postidto = H_tmprecog.postidto;
							H_recog.postname = H_tmprecog.postname;
						}

						var H_old = Array();
						var H_new = Array();
						H_old = O_model.makeUpdateOldData(H_order, "ord");
						H_new = O_model.makeUpdateNewData(H_sess.SELF, H_product, "ord");
						var H_oldsub = O_model.makeUpdateOldData(H_order, "sub");
						var H_newsub = O_model.makeUpdateNewData(H_sess.SELF, H_product, "sub");
						var H_olddet = O_model.makeUpdateOldData(H_order, "det");
						var H_newdet = O_model.makeUpdateNewData(H_sess.SELF, H_product, "det");
						H_product_old.tel = O_model.getPriceDetailFromOrderData(H_order);
						H_product_old.acce = O_model.getRelatedProductFromOrderData(H_order);
						this.get_DB().beginTransaction();
						O_order_modify_model.checkUpdateProduct(H_sess, H_product_old, H_product);
						var H_upd = O_order_modify_model.checkUpdateColumns(H_old, H_new);

						if (true == Array.isArray(H_upd)) //オーダーID入れる
							//OrderModifyModelBaseにある
							{
								H_upd.orderid = H_sess[RecogFormProc.PUB].orderid;
								O_order_modify_model.updateOrderTable(H_upd);
							}

						var H_updsub = O_order_modify_model.checkUpdateColumns(H_oldsub, H_newsub);

						if (true == Array.isArray(H_updsub)) //オーダーID入れる
							//OrderModifyModelBaseにある
							{
								H_updsub.orderid = H_sess[RecogFormProc.PUB].orderid;
								O_order_modify_model.updateSubTable(H_updsub);
							}

						var H_upddet = O_order_modify_model.checkUpdateColumns(H_olddet, H_newdet);

						if (true == Array.isArray(H_upddet)) //オーダーID入れる
							//OrderModifyModelBaseにある
							{
								H_upddet.orderid = H_sess[RecogFormProc.PUB].orderid;
								O_order_modify_model.updateDetTable(H_upddet);
							}

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

		O_view.makeFormStatic(H_g_sess, H_order);
		O_view.displaySmarty(H_sess, A_auth, H_product, H_message, H_g_sess);
	}

	__destruct() {
		super.__destruct();
	}

};