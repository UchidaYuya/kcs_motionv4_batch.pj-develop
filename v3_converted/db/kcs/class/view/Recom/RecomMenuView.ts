//
//シミュレーションメニューのＶｉｅｗ
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
//シミュレーションメニューのＶｉｅｗ
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
//自身のセッションを取得する
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
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
//不要なセッションを消去する
//
//@author nakanita
//@since 2008/12/22
//
//@access public
//@return void
//
//
//"YYYYMM"で与えられた文字列をパブリックセッションに付ける
//
//@author nakanita
//@since 2008/07/25
//
//@param string $yyyy
//@param string $mm
//@access public
//@return void
//
//
//キャリア情報をパブリックセッションに付ける
//
//@author nakanita
//@since 2008/07/30
//
//@param integer $carid
//@param string $carname
//@access public
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
//@return void
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
//条件指定保存に用いたセッションを消去する
//
//@author nakanita
//@since 2008/12/16
//
//@access public
//@return void
//
//
//実行依頼に用いたセッションを消去する
//
//@author nakanita
//@since 2008/12/19
//
//@access public
//@return void
//
//
//リセットに用いたセッションを消去する
//
//@author nakanita
//@since 2009/01/14
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
//デストラクタ
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return void
//
class RecomMenuView extends ViewSmarty {
	static PUB = "/Recom3";

	constructor(H_param: {} | any[] = Array()) {
		this.O_Sess = MtSession.singleton();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(RecomMenuView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getSelfSession() //$H_sess = array( self::PUB => $this->O_Sess->getPub( self::PUB ),
	//"SELF" => $this->O_Sess->getSelfAll() );
	{
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	getView() {
		return this.H_View;
	}

	checkCGIParam() {
		var sess_flg = false;

		if (undefined !== _POST.range == true && _POST.range != "") {
			this.H_Local.post.range = _POST.range;
			sess_flg = true;
		}

		if (undefined !== _POST.period == true && _POST.period != "") {
			this.H_Local.post.period = _POST.period;
			sess_flg = true;
		}

		if (undefined !== _POST.telno == true && _POST.telno != "") {
			this.H_Local.post.telno = _POST.telno;
			sess_flg = true;
		}

		if (undefined !== _POST.carid == true && _POST.carid != "") {
			this.H_Local.post.carid = _POST.carid;
			sess_flg = true;
		}

		if (undefined !== _POST.buysel_post == true && _POST.buysel_post != "") {
			this.H_Local.post.buysel = _POST.buysel;
			sess_flg = true;
		}

		if (undefined !== _POST.division == true && _POST.division != "") {
			this.H_Local.post.division = _POST.division;
			sess_flg = true;
		}

		if (undefined !== _POST.pakefree == true && _POST.pakefree.length) {
			this.H_Local.post.pakefree = _POST.pakefree;
			sess_flg = true;
		}

		if (undefined !== _POST.cond_open == true || _POST.cond_open === "") //block or none
			{
				this.H_Local.post.cond_open = _POST.cond_open;
				sess_flg = true;
			}

		if (undefined !== _POST.discount_way == true || _POST.discount_way === "") //画面表示用
			{
				this.H_Local.post.discount_way = _POST.discount_way;
				this.H_Local.post.discount_way_disp = _POST.discount_way;
				sess_flg = true;
			}

		if (undefined !== _POST.discount_base_0 == true || _POST.discount_base_0 === "") {
			this.H_Local.post.discount_base_0 = _POST.discount_base_0;
			sess_flg = true;
		}

		if (undefined !== _POST.discount_base_1 == true || _POST.discount_base_1 === "") {
			this.H_Local.post.discount_base_1 = _POST.discount_base_1;
			sess_flg = true;
		}

		if (undefined !== _POST.discount_tel_1 == true || _POST.discount_tel_1 === "") {
			this.H_Local.post.discount_tel_1 = _POST.discount_tel_1;
			sess_flg = true;
		}

		if (undefined !== _POST.discount_base_2 == true || _POST.discount_base_2 === "") {
			this.H_Local.post.discount_base_2 = _POST.discount_base_2;
			sess_flg = true;
		}

		if (undefined !== _POST.discount_tel_2 == true || _POST.discount_tel_2 === "") {
			this.H_Local.post.discount_tel_2 = _POST.discount_tel_2;
			sess_flg = true;
		}

		switch (_POST.discount_way) {
			case 1:
				this.H_Local.post.discount_base = this.H_Local.post.discount_base_0;
				this.H_Local.post.discount_tel = this.H_Local.post.discount_base_0;
				break;

			case 2:
				this.H_Local.post.discount_base = this.H_Local.post.discount_base_1;
				this.H_Local.post.discount_tel = this.H_Local.post.discount_tel_1;
				break;

			case 3:
				this.H_Local.post.discount_base = this.H_Local.post.discount_base_2;
				this.H_Local.post.discount_tel = this.H_Local.post.discount_tel_2;
				break;

			default:
				break;
		}

		if (undefined !== _POST.ratio_cellular == true || _POST.ratio_cellular === "") {
			this.H_Local.post.ratio_cellular = _POST.ratio_cellular;
			sess_flg = true;
		} else //デフォルト値
			{
				this.H_Local.post.ratio_cellular = 50;
			}

		if (undefined !== _POST.ratio_same_carrier == true || _POST.ratio_same_carrier === "") {
			this.H_Local.post.ratio_same_carrier = _POST.ratio_same_carrier;
			sess_flg = true;
		} else //デフォルト値
			{
				this.H_Local.post.ratio_same_carrier = 50;
			}

		if (undefined !== _POST.ratio_daytime == true || _POST.ratio_daytime === "") {
			this.H_Local.post.ratio_daytime = _POST.ratio_daytime;
			sess_flg = true;
		} else //デフォルト値
			{
				this.H_Local.post.ratio_daytime = 70;
			}

		if (undefined !== _POST.ratio_increase_tel == true || _POST.ratio_increase_tel === "") {
			this.H_Local.post.ratio_increase_tel = _POST.ratio_increase_tel;
			sess_flg = true;
		} else //デフォルト値
			{
				this.H_Local.post.ratio_increase_tel = 100;
			}

		if (undefined !== _POST.ratio_increase_comm == true || _POST.ratio_increase_comm === "") {
			this.H_Local.post.ratio_increase_comm = _POST.ratio_increase_comm;
			sess_flg = true;
		} else //デフォルト値
			{
				this.H_Local.post.ratio_increase_comm = 100;
			}

		if (undefined !== _POST.carid_after == true || _POST.carid_after === "") {
			this.H_Local.post.carid_after = _POST.carid_after;
			sess_flg = true;
		}

		if (undefined !== _POST.save_point == true || _POST.save_point === "") {
			this.H_Local.post.save_point = _POST.save_point;
			sess_flg = true;
		}

		if (undefined !== _POST.regist_point == true || _POST.regist_point === "") {
			this.H_Local.post.regist_point = _POST.regist_point;
			sess_flg = true;
		}

		if (undefined !== _POST.disp_point == true || _POST.disp_point === "") {
			this.H_Local.post.disp_point = _POST.disp_point;
			sess_flg = true;
		}

		if (undefined !== _POST.reset_point == true || _POST.reset_point === "") {
			this.H_Local.post.reset_point = _POST.reset_point;
			sess_flg = true;
		}

		if (_GET.pid != "") //ここだけはV2の互換性からセッションに直接値をかいている
			{
				_SESSION.current_postid = _GET.pid;
				sess_flg = true;
			}

		if (sess_flg == true) {
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}
	}

	clearPreSession() //ショップ側はディレクトリが異なる
	{
		var shop_dir = "";

		if (this.getSiteMode() == ViewBaseHtml.SITE_SHOP) {
			shop_dir = "/Shop";
		}

		this.O_Sess.clearSessionPub(shop_dir + "/Graph");
		this.O_Sess.clearSessionPub(shop_dir + "/Graph/RecomUseGraph.php");
		this.O_Sess.clearSessionPub(shop_dir + "/Graph/RecomUseGraphChart.php");
	}

	setYYYYMMSession(yyyy, mm) {
		this.H_Dir.year = yyyy;
		this.H_Dir.month = mm;
		this.O_Sess.setPub(RecomMenuView.PUB, this.H_Dir);
	}

	setCarrierInfo(carid, carname) {
		this.H_Dir.carid = carid;
		this.H_Dir.carname = carname;
		this.O_Sess.setPub(RecomMenuView.PUB, this.H_Dir);
	}

	checkParamError(H_sess, H_g_sess) {}

	makePankuzuLink() {
		var O_link = new MakePankuzuLink();
		var method = "makePankuzuLinkHTML";

		switch (this.getSiteMode()) {
			case ViewBaseHtml.SITE_SHOP:
				var H_link = {
					"../list.php": "\u304A\u5BA2\u69D8\u4E00\u89A7\u30FB\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3",
					"": "\u6599\u91D1\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3"
				};
				var type = "shop";
				break;

			case ViewBaseHtml.SITE_USER:
			default:
				if (this.O_Sess.language === "ENG") {
					H_link = {
						"": "Plan simulation"
					};
					method = "makePankuzuLinkHTMLEng";
				} else {
					H_link = {
						"": "\u6599\u91D1\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3"
					};
				}

				type = "user";
				break;
		}

		return O_link[method](H_link, type, true);
	}

	clearCondSession() // 画面上に残す必要があるので、消さずにおく
	//unset( $this->H_Local['post']['ratio_cellular'] );
	//unset( $this->H_Local['post']['ratio_same_carrier'] );
	//unset( $this->H_Local['post']['ratio_daytime'] );
	//unset( $this->H_Local['post']['ratio_increase_tel'] );
	//unset( $this->H_Local['post']['ratio_increase_comm'] );
	//unset( $this->H_Local['post']['carid_after'] );
	{
		delete this.H_Local.post.discount_way;
		delete this.H_Local.post.discount_base;
		delete this.H_Local.post.discount_tel;
		delete this.H_Local.post.save_point;
		delete this.H_Local.post.regist_point;
		delete this.H_Local.post.disp_point;
		this.O_Sess.setSelfAll(this.H_Local);
	}

	clearRegistSession() {
		delete this.H_Local.post.regist_point;
		this.O_Sess.setSelfAll(this.H_Local);
	}

	clearResetSession() {
		delete this.H_Local.post.reset_point;
		this.O_Sess.setSelfAll(this.H_Local);
	}

	displaySmarty() //表示に必要な項目を設定
	//部署ツリーの表示
	//JavaScriptの呼出
	//ツリーの呼出
	//検索リストの呼出
	//条件指定のオープン・クローズ
	//フォームを表示
	//var_dump( $this->H_View["H_sim"] );
	//シミュレーション条件リストを表示
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
		this.get_Smarty().assign("js", this.H_View.tree_js);
		this.get_Smarty().assign("tree", this.H_View.tree_str);
		this.get_Smarty().assign("xlist", this.H_View.xlist_str);
		this.get_Smarty().assign("post_path", this.H_View.post_path);
		this.get_Smarty().assign("cond_open", this.H_View.H_sim.cond_open);
		this.get_Smarty().assign("H_car", this.H_View.H_car);
		this.get_Smarty().assign("H_sim", this.H_View.H_sim);
		this.get_Smarty().assign("fnc_recom_download", this.H_View.fnc_recom_download);
		this.get_Smarty().assign("fnc_view_recomusegraph", this.H_View.fnc_view_recomusegraph);
		this.get_Smarty().assign("fnc_shop_condrecom", this.H_View.fnc_shop_condrecom);
		this.get_Smarty().assign("fnc_shop_recom_car", this.H_View.fnc_shop_recom_car);
		this.get_Smarty().assign("fnc_tel_division", this.H_View.fnc_tel_division);
		this.get_Smarty().assign("H_condlist", this.H_View.H_condlist);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};