//
//請求情報Viewの基底クラス
//
//更新履歴：<br>
//2008/03/14 宝子山浩平 作成
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/03/14
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//請求情報Viewの基底クラス
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/03/14
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("BillUtil.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

//
//ディレクトリ名
//
//
//請求種別ID
//
//
//ASP内訳コード
//
//
//ASP消費税内訳コード
//
//
//購買消費税コード
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
//セッティングオブジェクト
//
//@var mixed
//@access protected
//
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
//@uses BillUtil
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
//ユーザ設定項目のフォーム用配列生成
//
//@author houshiyama
//@since 2008/03/21
//
//@param mixed $H_prop
//@param mixed $H_date
//@access protected
//@return array
//
//
//ユーザ設定項目のルール用配列生成
//
//@author houshiyama
//@since 2008/03/21
//
//@param mixed $H_prop
//@access protected
//@return array
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
//請求毎のスタイルシートを決定する
//
//@author houshiyama
//@since 2008/03/27
//
//@param mixed $mid
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
class BillViewBase extends ViewSmarty {
	static PUB = "/Bill";
	static TELMID = 1;
	static ETCMID = 2;
	static PURCHMID = 3;
	static COPYMID = 4;
	static TRANMID = 5;
	static ASPCODE = "ASP";
	static ASXCODE = "ASX";
	static PURCHTAXCODE = "009";

	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(BillViewBase.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
	}

	get_Pactid() {
		return this.pactid;
	}

	get_Postid() {
		return this.postid;
	}

	getLocalSession() {
		var H_sess = {
			[BillViewBase.PUB]: this.O_Sess.getPub(BillViewBase.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	get_View() {
		return this.H_View;
	}

	makePropertyForm(H_prop, H_date) {
		var A_propform = Array();

		for (var name in H_prop) {
			var label = H_prop[name];

			if (preg_match("/^date/", name) == true) {
				var A_tmp = {
					name: name,
					label: label,
					inputtype: "date",
					data: H_date
				};
			} else {
				A_tmp = {
					name: name,
					label: label,
					inputtype: "text",
					options: {
						id: name,
						size: 35
					}
				};
			}

			A_propform.push(A_tmp);
		}

		return A_propform;
	}

	makePropertyRule(H_prop) {
		var A_proprule = Array();

		for (var name in H_prop) {
			var label = H_prop[name];

			if (preg_match("/^int/", name) == true) {
				var A_tmp = {
					name: name,
					mess: label + "\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
					type: "numeric",
					format: undefined,
					validation: "client"
				};
				A_proprule.push(A_tmp);
			} else if (preg_match("/^date/", name) == true) {
				A_tmp = {
					name: name,
					mess: label + "\u306F\u5E74\u6708\u65E5\u3092\u5168\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u51FA\u6765\u307E\u305B\u3093\u3002",
					type: "QRCheckdate",
					format: undefined,
					validation: "client"
				};
				A_proprule.push(A_tmp);
			}
		}

		return A_proprule;
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
		if (undefined !== H_sess[BillViewBase.PUB].cym == false || undefined !== H_sess[BillViewBase.PUB].current_postid == false) {
			this.errorOut(8, "session\u304C\u7121\u3044", false);
			throw die();
		}
	}

	getBillCss(mid) {
		if (BillViewBase.TELMID == mid) {
			var css = "csManageTel";
		} else if (BillViewBase.ETCMID == mid) {
			css = "csManageEtc";
		} else if (BillViewBase.PURCHMID == mid) {
			css = "csManagePurch";
		} else if (BillViewBase.COPYMID == mid) {
			css = "csManageCopy";
		} else if (BillViewBase.TRANMID == mid) {
			css = "csManageTran";
		} else {
			css = "csManage";
		}

		return css;
	}

	__destruct() {
		super.__destruct();
	}

};