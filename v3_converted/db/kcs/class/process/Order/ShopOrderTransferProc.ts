//
//受注振替Proc
//
//更新履歴：<br>
//2008/08/03 igarashi 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author igarashi
//@since 2008/08/03
//
//
//error_reporting(E_ALL|E_STRICT);
//
//受注振替Proc
//
//@uses OrderFormProcBase
//@package Order
//@author igarashi
//@since 2008/08/03
//

require("process/Order/ShopOrderDetailProcBase.php");

require("model/Order/ShopOrderTransferModel.php");

require("view/Order/ShopOrderTransferView.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/08/03
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author igarashi
//@since 2008/08/03
//
//@access protected
//@return void
//
//
//各ページのModelオブジェクト取得
//
//@author igarashi
//@since 2008/08/03
//
//@param array $H_g_sess
//@param mixed $O_order
//@access protected
//@return void
//
//
//Smartyで表示
//
//@author igarashi
//@since 2008/08/03
//
//@param $H_param
//@return none
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/08/03
//
//@access public
//@return void
//
class ShopOrderTransferProc extends ShopOrderDetailProcBase {
	constructor(H_param: {} | any[] = Array()) //$this->debagmode=true;
	{
		super(H_param);
	}

	get_View() {
		return new ShopOrderTransferView();
	}

	get_Model(H_g_sess: {} | any[], flg = OrderModelBase.SITE_SHOP) {
		return new ShopOrderTransferModel(O_db0, H_g_sess, flg);
	}

	doExecute(H_param: {} | any[] = Array()) //view作成
	//CGI取得
	//GlobalSESSION取得
	//LocalSESSION取得
	//model作成
	//権限一覧を取得
	//販売店権限の取得
	//統括販売店なら下位の販売店も拾う
	//振替先販売店を取得
	//formの初期値を取得
	//cssを取得
	//パンクズリンク取得
	//
	//form作成
	//
	//QuickFormにruleを設定
	//
	//表示用情報取得
	//
	//$H_view["permit"] = $O_model->makeUniqueArray(&$H_result["permit"]);
	//$H_view["unperm"] = $O_model->makeUniqueArray(&$H_result["unperm"]);
	//取得した情報をSESSIONに入れる
	//
	//更新
	//
	//QuickFormにデフォルト値をセット
	//入力チェック
	//表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getLocalSession();
		var O_model = this.get_Model(H_g_sess);
		var A_auth = O_model.get_AuthIni();
		var H_co_func = O_model.getFuncCO(H_g_sess.shopid);
		var bReTrans = -1 !== H_co_func.indexOf(207) ? true : false;
		H_view.flg.unify = O_model.checkUnifyShop(H_g_sess, H_g_sess.shopid);

		if (H_view.flg.unify) {
			var A_shopid = O_model.getChildShopID(H_g_sess, H_view.flg.unify, true);
			A_shopid = Object.keys(A_shopid);
		} else {
			A_shopid = [H_g_sess.shopid];
		}

		H_view.transhop = O_model.getTransfer(A_shopid, H_g_sess.shopid);
		H_view.default = O_view.getDefaultForm();
		H_view.js = O_view.getHeaderJS();
		H_view.pankuzu_link = this.O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "shop");
		O_view.makeShopOrderTransferForm(H_sess[ShopOrderTransferProc.PUB].count, H_view.transhop);
		O_view.setFormRule();
		var H_result = O_model.getOrderInfo(H_sess[ShopOrderTransferProc.PUB].orderid);
		H_result = O_model.checkTransferPossible(H_g_sess, H_sess.SELF, H_result, bReTrans);
		H_view.permit = H_result.permit;
		H_view.unperm = H_result.unperm;
		var H_permitid = H_result.permitorder;
		O_view.setSessionOrderInfo("permit", H_view.permit);
		O_view.setSessionOrderInfo("unperm", H_view.unperm);
		O_view.setSessionOrderInfo("permitorder", H_permitid);
		O_view.setDefaultsForm(H_view.default);

		if (true == (undefined !== H_sess.SELF.confirm)) {
			O_view.validate(H_sess.SELF);
		}

		if (true == (undefined !== H_sess.SELF.exitsub)) //振替ループ制御
			//後処理
			{
				var H_view = O_model.checkDuplicateShopID(H_g_sess, H_sess, H_view, A_shopid, bReTrans);
				H_view.permit = array_unique(H_view.permit);
				H_view.unperm = O_model.makeUniqueArray(H_view.unperm);

				if (Array() != H_view.permit || !!H_view.reperm || !!H_view.reperm_cancel) //更新するための前情報を持ってくる(振替回数とか)
					//エラーフラグ(振替元への振替で、通常処理前にキャンセル処理を入れる必要があるので・・)
					//キャンセル処理を行う。エラーがあればbErrorをtrueにする
					{
						var H_trans = O_model.getTransferInfomation(H_view.permit, A_shopid);
						var bError = false;

						if (!!H_view.reperm_cancel) //SQL実行
							//データ取り直す
							{
								var H_sql = O_model.retransferCancel(H_g_sess, H_trans, H_sess, H_view.permit, H_view.reperm_cancel);
								H_view.upflg = O_model.execUpdateStatusHand(H_sql, this.debagmode);

								if ("exec" == H_view.upflg.flg) {
									H_trans = O_model.getTransferInfomation(H_view.permit, A_shopid);
								} else {
									bError = true;
								}
							}

						if (!bError) //sql生成
							//更新実行
							//mail送信
							{
								H_sql = O_model.makeTransferSQL(H_g_sess, H_trans, H_sess, H_view.permit, H_view.reperm, H_view.reperm_cancel);
								H_view.upflg = O_model.execUpdateStatusHand(H_sql, this.debagmode);

								if ("exec" == H_view.upflg.flg) {
									if (!!H_view.permit) {
										O_model.sendOrderTransferMail(H_g_sess, H_sess, H_view.permit);
									}

									if (!!H_view.reperm) {
										O_model.sendOrderTransferMail(H_g_sess, H_sess, H_view.reperm);
									}
								} else if ("part" == H_view.upflg.flg) {
									O_model.sendOrderTransferMail(H_g_sess, H_sess, H_view.upflg.suc);
								}
							}

						if (0 < H_view.unperm.length) {
							H_view.upflg.flg = "part";
						}
					} else {
					H_view.upflg.flg = "unexec";
				}

				if (false == this.debagmode) {
					O_view.endUpdateProc([ShopOrderTransferProc.PUB, "/MTOrderList", "/Shop/MTOrder/rapid"]);
				}
			} else {
			H_view.upflg.flg = "unexec";
		}

		O_view.displaySmarty(H_g_sess, H_view);
	}

	__destruct() {
		super.__destruct();
	}

};