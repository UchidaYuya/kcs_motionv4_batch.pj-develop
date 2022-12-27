//
//注文履歴Viewの基底クラス
//
//更新履歴：<br>
//2008/05/28 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/05/28
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//注文履歴Viewの基底クラス
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/05/28
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("ManagementUtil.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("OrderViewBase.php");

//
//ディレクトリ名
//
//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//protected $O_Sess;
//
//ディレクトリ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//protected $H_Dir;
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//protected $H_Local;
//
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//protected $H_View;
//
//セッティングオブジェクト
//
//@var mixed
//@access protected
//
//protected $O_Set;
//
//ユーザ設定項目
//
//@var mixed
//@access protected
//
//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/03/03
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//セッションのpactidを返す
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
//
//セッションのpostidを返す
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
//
//ローカルセッションを取得する
//
//@author houshiyama
//@since 2008/03/11
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author houshiyama
//@since 2008/03/07
//
//@access public
//@return mixed
//
//
//表示しているものが当月ならばtrue <br>
//表示しているものが当月以外ならばfalse <br>
//
//@author houshiyama
//@since 2008/03/27
//
//@param mixed $cym
//@access protected
//@return void
//
//
//最低限必要なセッション情報が無ければエラー表示
//
//@author houshiyama
//@since 2008/04/04
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//管理毎のスタイルシートを決定する
//
//@author houshiyama
//@since 2008/03/27
//
//@param mixed $mid
//@access protected
//@return void
//
//
//各ページ固有のsetDefaultSession
//
//@author houshiyama
//@since 2008/03/10
//
//@abstract
//@access protected
//@return void
//
//
//各ページ（管理）固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/03/03
//
//@abstract
//@access protected
//@return void
//
//
//各ページ固有のdisplaySmarty
//
//@author miyazawa
//@since 2008/05/29
//
//@protected
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class OrderListViewBase extends OrderViewBase {
	static PUB = "/MTOrderList";

	constructor(H_param: {} | any[] = Array()) //$this->O_Sess =& MtSession::singleton(); ここでやる必要ない
	//$this->O_Set = MtSetting::singleton(); ここでやる必要ない
	{
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(OrderListViewBase.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	get_Pactid() {
		return this.pactid;
	}

	get_Postid() {
		return this.postid;
	}

	getLocalSession() {
		var H_sess = {
			[OrderListViewBase.PUB]: this.O_Sess.getPub(OrderListViewBase.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	get_View() {
		return this.H_View;
	}

	getThisMonthFlg(cym) {
		if (date("Ym") == cym) {
			return true;
		} else {
			return false;
		}
	}

	checkBaseParamError(H_sess, H_g_sess) //最低限必要なセッションが無ければエラー
	{
		if (undefined !== H_sess[OrderListViewBase.PUB].search.cym == false || undefined !== H_sess[OrderListViewBase.PUB].search.current_postid == false || undefined !== H_sess[OrderListViewBase.PUB].search.posttarget == false) {
			this.errorOut(8, "session\u304C\u7121\u3044", false);
			throw die();
		}
	}

	getOrderListCss() {
		var css = "csOrderList";
		return css;
	}

	__destruct() {
		super.__destruct();
	}

};