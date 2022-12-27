//
//シミュレーション表示カラム変更のＶｉｅｗ
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/07/17
//
//
//error_reporting(E_ALL);
//require_once("view/QuickFormUtil.php");
//require_once("HTML/QuickForm/Renderer/ArraySmarty.php");
//ページリンクを作る
//
//シミュレーション表示カラム変更のＶｉｅｗ
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/02/08
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

require("view/MakePankuzuLink.php");

//
//ディレクトリ名
//
//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//ディレクトリ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//
//フォームオブジェクト
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//ディレクトリ固有のセッションを取得する
//
//@author nakanita
//@since 2008/10/07
//
//@access public
//@return array
//
//
//自身のセッションを取得する
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return array
//
//
//表示に使用する物を格納する配列を返す
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return mixed
//
//
//ログインのチェックを行う
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//protected function checkLogin(){
//// ログインチェックを行わないときには、何もしないメソッドで親を上書きする
//}
//
//CGIパラメータのチェックを行う
//
//セッションにCGIパラメーターを付加する<br/>
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//パラメーターのチェックを行う
//
//@author nakanita
//@since 2008/07/23
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return boolean
//
//
//パンくずリンクを返す
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
//
//
//設定値をセッションに入れる
//
//@author nakanita
//@since 2008/09/26
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//デフォルトの設定値をセッションに入れる
//
//@author nakanita
//@since 2008/10/09
//
//@access public
//@return void
//
//
//Smartyを用いた画面表示
//
//@author nakanita
//@since 2008/02/08
//
//@access public
//@return void
//
//
//結果のページにリダイレクトする
//
//@author nakanita
//@since 2008/09/26
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return void
//
class RecomColumnView extends ViewSmarty {
	static PUB = "/Recom3";

	constructor(H_param: {} | any[] = Array()) {
		this.O_Sess = MtSession.singleton();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(RecomColumnView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getPubSession() {
		return this.H_Dir;
	}

	getSelfSession() {
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	getView() {
		return this.H_View;
	}

	checkCGIParam() //mode == 'set' のときに、セッション書き換えを行う
	{
		var sess_flg = false;

		if (undefined !== _POST.mode == true && _POST.mode != "") {
			this.H_Local.post.mode = _POST.mode;
			sess_flg = true;
		}

		if (_POST.mode === "set") //順序指定カラムが7個
			//表示指定チェックボックスが15個
			{
				for (var idx = 1; idx <= 7; idx++) {
					var key = "order_" + idx;

					if (undefined !== _POST[key] == true && _POST[key] != "") //$this->H_Dir[$key] = $_POST[$key];
						{
							this.H_Local.post[key] = _POST[key];
							sess_flg = true;
						}
				}

				for (idx = 1;; idx <= 17; idx++) {
					key = "chk_" + idx;

					if (undefined !== _POST[key] == true && _POST[key] != "") //$this->H_Dir[$key] = 1;
						{
							this.H_Local.post[key] = _POST[key];
							sess_flg = true;
						} else //チェックボックスが空の場合
						{
							this.H_Local.post[key] = 0;
						}
				}
			}

		if (sess_flg == true) //$this->O_Sess->setPub( self::PUB, $this->H_Dir );
			{
				this.O_Sess.setSelfAll(this.H_Local);
				MtExceptReload.raise(undefined);
			}
	}

	checkParamError(H_sess, H_g_sess) {}

	makePankuzuLink() {
		var O_link = new MakePankuzuLink();
		var method = "makePankuzuLinkHTML";

		switch (this.getSiteMode()) {
			case ViewBaseHtml.SITE_SHOP:
				var H_link = {
					"RecomHotlineResult.php": "\u6599\u91D1\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3",
					"": "\u8868\u793A\u9805\u76EE\u306E\u5909\u66F4 "
				};
				var type = "shop";
				break;

			case ViewBaseHtml.SITE_USER:
			default:
				var page = "RecomResult.php";

				if (this.O_Sess.language === "ENG") {
					H_link = {
						"menu.php": "Plan simulation",
						[page]: "Simulation result",
						"": "Change display categories"
					};
					method = "makePankuzuLinkHTMLEng";
				} else {
					H_link = {
						"menu.php": "\u6599\u91D1\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3",
						[page]: "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u7D50\u679C",
						"": "\u8868\u793A\u9805\u76EE\u306E\u5909\u66F4 "
					};
				}

				type = "user";
				break;
		}

		return O_link[method](H_link, type, true);
	}

	setColumns(H_sess) //var_dump( $H_sess );	// * DEBUG
	//順序指定カラムが7個
	//表示指定チェックボックスが15個
	//以下のカラムは RecomResultView.php の内容と合わせている
	//固定で非表示にできない項目は'on'としてある
	//部署名		// 1
	//回線種別		// 2
	//$H_sess["chk_3"];	// 電話番号		// 3
	//使用者		// 4
	//社員番号		// 5
	//現行購入方式	// 6
	//$H_sess["chk_7"];	// 料金プラン / パケット	// 7
	//$H_sess["chk_8"];	// 推奨購入方式		// 8
	//$H_sess["chk_9"];	// 推奨料金プラン / パケット	// 9
	//上位通話先	// 10
	//平均ご利用額	// 11
	//予測削減額	// 12
	//違約金		// 13
	//採算分岐月数	// 14
	//$H_sess["chk_15"];	// 変更申請		// 15
	//用途権限	// 16
	//権限抑止	// 17
	//共通セッションに追加する
	{
		var H_arrange = Array();

		for (var idx = 1; idx <= 7; idx++) {
			var key = "order_" + idx;
			A_arrange[idx] = H_sess[key];
		}

		var H_dispcol = Array();
		H_dispcol.postname = H_sess.chk_1;
		H_dispcol.cirname = H_sess.chk_2;
		H_dispcol.telno_view = "on";
		H_dispcol.username = H_sess.chk_4;
		H_dispcol.employeecode = H_sess.chk_5;
		H_dispcol.buyselname = H_sess.chk_6;
		H_dispcol.planname = "on";
		H_dispcol.recbuyselname = "on";
		H_dispcol.recplanname = "on";
		H_dispcol.mass_target_1 = H_sess.chk_10;
		H_dispcol.avecharge = H_sess.chk_11;
		H_dispcol.diffcharge = H_sess.chk_12;
		H_dispcol.penalty_money = H_sess.chk_13;
		H_dispcol.penalty_monthcnt = H_sess.chk_14;
		H_dispcol.order = "on";
		H_dispcol.division = H_sess.chk_16;
		H_dispcol.alert = H_sess.chk_17;
		this.H_Dir.A_arrange = A_arrange;
		this.H_Dir.H_dispcol = H_dispcol;
		this.O_Sess.setPub(RecomColumnView.PUB, this.H_Dir);
	}

	defaultColumns() //まだセッションに無ければデフォルト値を付加
	{
		if (Array.isArray(this.H_Dir.A_arrange) == false) //0 は未使用、1～7まで
			//共通セッションに追加する
			{
				var A_arrange = [0, 1, 2, 3, 4, 5, 6, 7];
				this.H_Dir.A_arrange = A_arrange;
				this.O_Sess.setPub(RecomColumnView.PUB, this.H_Dir);
			}

		if (Array.isArray(this.H_Dir.H_dispcol) == false) //部署名		// 1
			//回線種別		// 2
			//電話番号		// 3
			//使用者		// 4
			//社員番号		// 5
			//現行購入方式	// 6
			//料金プラン / パケット	// 7
			//推奨購入方式		// 8
			//推奨料金プラン / パケット	// 9
			//上位通話先	// 10
			//平均ご利用額	// 11
			//予測削減額	// 12
			//違約金		// 13
			//採算分岐月数	// 14
			//変更申請		// 15
			//用途権限		// 16
			//警告			// 17
			//共通セッションに追加する
			{
				var H_dispcol = Array();
				H_dispcol.postname = "on";
				H_dispcol.cirname = "on";
				H_dispcol.telno_view = "on";
				H_dispcol.username = 0;
				H_dispcol.employeecode = 0;
				H_dispcol.buyselname = "on";
				H_dispcol.planname = "on";
				H_dispcol.recbuyselname = "on";
				H_dispcol.recplanname = "on";
				H_dispcol.mass_target_1 = "on";
				H_dispcol.avecharge = "on";
				H_dispcol.diffcharge = "on";
				H_dispcol.penalty_money = "on";
				H_dispcol.penalty_monthcnt = "on";
				H_dispcol.order = "on";
				H_dispcol.division = "on";
				H_dispcol.alert = "on";
				this.H_Dir.H_dispcol = H_dispcol;
				this.O_Sess.setPub(RecomColumnView.PUB, this.H_Dir);
			}
	}

	displaySmarty() //表示に必要な項目を設定
	//var_dump($this->H_Dir['A_arrange']);
	//var_dump($this->H_Dir['H_dispcol']);
	//部署ツリーの表示
	//$this->get_Smarty()->assign( "post_path", $this->H_View["post_path"] );
	//表示
	{
		if (this.getSiteMode() == ViewBaseHtml.SITE_SHOP) //ショップの場合、ショップ名、メンバー名を表示する
			{
				var page_path = "shop_submenu";
				var shop_person = this.O_Sess.name + " " + this.O_Sess.personname;
				this.get_Smarty().assign("shop_person", shop_person);
			} else {
			page_path = "page_path";
		}

		this.get_Smarty().assign(page_path, this.H_View.page_path);
		this.get_Smarty().assign("A_arrange", this.H_Dir.A_arrange);
		this.get_Smarty().assign("H_dispcol", this.H_Dir.H_dispcol);
		this.get_Smarty().assign("fnc_tel_division", this.H_View.fnc_tel_division);
		this.get_Smarty().assign("fnc_show_admonition", this.H_View.fnc_show_admonition);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	gotoResult() {
		this.O_Sess.clearSessionSelf();
		MtExceptReload.raise("RecomResult.php");
	}

	__destruct() {
		super.__destruct();
	}

};