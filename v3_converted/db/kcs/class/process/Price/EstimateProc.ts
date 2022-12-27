//
//見積ページプロセス
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
//
//プロセス実装
//
//@uses OrderFormProcBase
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("process/Order/OrderFormProc.php");

require("model/Price/EstimateModel.php");

require("view/Price/EstimateView.php");

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
class EstimateProc extends OrderFormProc {
	static PUB = "/MTOrder";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EstimateView();
	}

	get_Model(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new EstimateModel(O_db0, H_g_sess, site_flg);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//ログインチェック
	//セッション情報取得（ローカル）
	//権限一覧取得
	//英語化権限 20090210miya
	//Javascriptの生成
	//パンくずリンクの生成
	//CSSの決定
	//Smartyテンプレートの取得
	//価格表からのデータを作る
	//$H_sess をデバッグ
	//価格表取得
	//注文画面では$H_pricedetailに電話、$H_accedetailに付属品を入れているが、ここではすべて$H_accedetailにどんどん入れている
	//フォームオブジェクトを生成してフォーム要素を入れる
	//注文フォームのデフォルト値作成、セット
	//入力チェック（確認画面に行くとき）
	//フォームにエラーが無いし、確認画面からの戻りでもなければ
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var site_flg = OrderModelBase.SITE_USER;
		var O_order = new OrderUtil(H_g_sess);
		var O_model = this.get_Model(H_g_sess, site_flg);
		O_view.setSiteMode(site_flg);
		O_view.startCheck();
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
		H_view.smarty_template = O_model.getSmartyTemplate();
		var H_pricedetail = Array();
		var H_accedetail = Array();
		var H_product = Array();
		this.getOut().debugOutEx(H_sess, false);

		if (H_sess[EstimateProc.PUB].price_detailid != "") //重複はスキップ……ではなく後勝ちにした
			{
				H_accedetail = Array();

				if (true == (undefined !== H_sess[EstimateProc.PUB].H_product)) {
					H_accedetail = H_sess[EstimateProc.PUB].H_product.acce;
				}

				var H_accedetail_temp = O_model.getPriceDetail(H_sess);
				var A_productid_chk = Array();

				if (true == Array.isArray(H_accedetail)) {
					for (var key in H_accedetail) //後勝ち処理追加
					{
						var val = H_accedetail[key];

						if (val.productid == H_accedetail_temp.productid) {
							delete H_accedetail[key];
						} else {
							A_productid_chk.push(val.productid);
						}
					}
				}

				if (false == (-1 !== A_productid_chk.indexOf(H_accedetail_temp.productid))) {
					H_accedetail.push(H_accedetail_temp);
				}
			}

		if (0 < H_pricedetail.length || 0 < H_accedetail.length) {
			H_product.tel = H_pricedetail;
			H_product.acce = H_accedetail;
		}

		if (H_product != "") //ローカルセッション取り直し
			{
				O_view.setProductInfo(H_product);
				H_sess = O_view.getLocalSession();
			}

		O_view.makeOrderBoxInputForm(O_model, H_sess, site_flg);
		O_view.makeOrderForm();
		var H_def = O_view.makeEstimateDefault(H_sess);
		H_view.O_OrderFormUtil.O_Form.setConstants(H_def);
		var validation_result = false;
		validation_result = H_view.O_OrderFormUtil.validateWrapper();

		if (validation_result == true && H_sess.SELF.backName != OrderFormView.BACKNAME && H_sess.SELF.backName != OrderFormView.BACKNAME_ENG) //確認画面
			{
				if (H_sess.SELF.submitName == OrderFormView.NEXTNAME || H_sess.SELF.submitName == OrderFormView.NEXTNAME_ENG) //フォームをフリーズする
					{
						O_view.freezeForm();
					} else //フォームをフリーズさせない
					{
						O_view.unfreezeForm();
					}
			} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		O_view.displaySmarty(H_sess, A_auth, H_product, H_g_sess);
	}

	__destruct() {
		super.__destruct();
	}

};