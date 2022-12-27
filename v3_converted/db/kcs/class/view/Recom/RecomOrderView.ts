//
//シミュレーション電話１件のプラン変更Ｖｉｅｗ
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/08/20
//
//
//error_reporting(E_ALL);
//require_once("view/QuickFormUtil.php");
//require_once("HTML/QuickForm/Renderer/ArraySmarty.php");
//
//シミュレーション電話１件のプラン変更Ｖｉｅｗ
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/08/20
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

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
//パラメーターのチェックを行う
//
//@author nakanita
//@since 2008/09/16
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//受注に必要な情報をセッションに付加する
//
//@author nakanita
//@since 2008/09/16
//
//@param mixed $H_order_pattern
//@param mixed $H_sess
//@access public
//@return void
//
//-- Smartyによる表示は行わない --
//	public function displaySmarty(){
//		
//		// 表示に必要な項目を設定	
//		$this->get_Smarty()->assign( "page_path", $this->H_View['page_path'] );
//		
//		// 部署ツリーの表示
//		$this->get_Smarty()->assign("js", $this->H_View['tree_js'] ); // JavaScriptの呼出
//		$this->get_Smarty()->assign( "post_path", $this->H_View["post_path"] );
//		
//		// フォームを表示
//		$this->get_Smarty()->assign( "H_car", $this->H_View["H_car"] );
//		$this->get_Smarty()->assign( "H_sim", $this->H_View["H_sim"] );
//		
//		// 表示
//		$this->get_Smarty()->display( $this->getDefaultTemplate() );
//	}
//
//デストラクタ
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return void
//
class RecomOrderView extends ViewSmarty {
	static PUB = "/Recom3";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(RecomOrderView.PUB);
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

		if (undefined !== _POST.result_telno == true && _POST.result_telno != "") {
			this.H_Local.post.telno = _POST.result_telno;
			sess_flg = true;
		}

		if (undefined !== _POST.carid == true && _POST.carid != "") {
			this.H_Local.post.carid = _POST.carid;
			sess_flg = true;
		}

		if (undefined !== _POST.cirid == true && _POST.cirid != "") {
			this.H_Local.post.cirid = _POST.cirid;
			sess_flg = true;
		}

		if (undefined !== _POST.recplanid == true && _POST.recplanid != "") {
			this.H_Local.post.recplanid = _POST.recplanid;
			sess_flg = true;
		}

		if (undefined !== _POST.recpacketid == true && _POST.recpacketid != "") {
			this.H_Local.post.recpacketid = _POST.recpacketid;
			sess_flg = true;
		}

		if (undefined !== _POST.planradio == true && _POST.planradio != "") //change 又は 空
			{
				this.H_Local.post.planradio = _POST.planradio;
				sess_flg = true;
			}

		if (undefined !== _POST.packetradio == true && _POST.packetradio != "") //change 又は 空
			{
				this.H_Local.post.packetradio = _POST.packetradio;
				sess_flg = true;
			}

		if (undefined !== _POST.ordermode == true && _POST.ordermode != "") //P 又は C
			{
				this.H_Local.post.ordermode = _POST.ordermode;
				sess_flg = true;
			}

		if (sess_flg == true) {
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}
	}

	checkParamError(H_sess, H_g_sess) //直打ち対策、必須パラメータチェック
	{
		if (H_g_sess.pactid == "" || H_sess.post.telno == "" || H_sess.post.carid == "" || H_sess.post.cirid == "" || H_sess.post.ordermode == "") {
			this.errorOut(8, "\u5FC5\u9808\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u304C\u7121\u3044");
		}
	}

	setOrderSession(H_order_pattern, H_sess) //var_dump( $H_order_pattern );
	//var_dump( $H_sess );
	//exit(0);
	//一般ユーザー側
	//}
	//P or C
	//$_SESSION[ $order_sess ]['H_product'] = array();
	//ここでシミュレーションからのオーダーを表す印を付ける
	//注文から戻ってくるときに使う
	//完了フォームの付けたセッションがあれば消す
	{
		if (is_null(H_order_pattern) == true || H_order_pattern.length == 0) {
			this.errorOut(8, "\u30AA\u30FC\u30C0\u30FC\u30D1\u30BF\u30FC\u30F3\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044");
		}

		var order_sess = "/MTOrder";
		_SESSION[order_sess].carid = H_sess.post.carid;
		_SESSION[order_sess].cirid = H_sess.post.cirid;
		_SESSION[order_sess].type = H_sess.post.ordermode;
		_SESSION[order_sess].ppid = H_order_pattern.ppid;
		_SESSION[order_sess].carname = H_order_pattern.carname;
		_SESSION[order_sess].ptnname = H_order_pattern.ptnname;
		_SESSION[order_sess].shopid = H_order_pattern.shopid;
		_SESSION[order_sess].memid = H_order_pattern.memid;
		_SESSION[order_sess].tplfile = H_order_pattern.tplfile;
		_SESSION[order_sess].plan = H_sess.post.recplanid;
		_SESSION[order_sess].packet = H_sess.post.recpacketid;
		var planradio = H_sess.post.planradio;

		if (planradio == "") //デフォルト値で"stay"とする
			{
				planradio = "stay";
			}

		_SESSION[order_sess].planradio = planradio;
		var packetraio = H_sess.post.packetradio;

		if (packetraio == "") //デフォルト値で"stay"とする
			{
				packetraio = "stay";
			}

		_SESSION[order_sess].packetradio = packetraio;

		if (this.getSiteMode() == ViewBaseHtml.SITE_SHOP) {
			var frompage = "/Shop/MTHotline/Recom3/RecomHotlineResult.php";
		} else {
			frompage = "/Recom3/RecomResult.php";
		}

		_SESSION[order_sess].frompage = frompage;

		if (_SESSION["/_lastform"] != "") {
			delete _SESSION["/_lastform"];
		}
	}

	gotoNextPage() //var_dump( $_SESSION );
	//exit(0);	// * DEBUG *
	{
		if (this.getSiteMode() == ViewBaseHtml.SITE_SHOP) //ショップ側の場合は代行注文に
			{
				var next_url = "/Shop/MTActorder/order_form.php";
			} else //通常の注文画面に
			{
				next_url = "/MTOrder/order_form.php";
			}

		MtExceptReload.raise(next_url);
	}

	__destruct() {
		super.__destruct();
	}

};