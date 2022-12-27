//
//ASP使用料設定ビュー
//
//@package Admin
//@subpackage Regist
//@author kitamura
//@since 2009/03/13
//@filesource
//@uses ViewSamrty
//@uses ViewFinish
//@uses ViewError
//
//
//
//ASP使用料設定ビュー
//
//@package Admin
//@subpackage Regist
//@author kitamura
//@since 2009/03/13
//@uses ViewSamrty
//@uses ViewFinish
//@uses ViewError
//
//

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

require("view/ViewError.php");

//
//入力処理フラグ
//
//
//
//完了処理フラグ
//
//
//
//エラー処理フラグ
//
//
//
//電話ASP使用料を設定
//
//
//
//カードASP使用料を設定
//
//
//
//購買ASP使用料を設定
//
//
//
//コピー機ASP使用料を設定
//
//
//
//交通費ASP使用料を設定 20100707miya
//
//
//
//pactid
//
//@var integer
//@access protected
//
//
//
//保存するASP使用料
//
//@var array
//@access protected
//
//
//
//現在の状態（入力・完了・エラー）
//
//@var string
//@access protected
//
//
//
//設定するASP使用料の識別名
//
//@var string
//@access protected
//
//
//
//メッセージ
//
//@var string
//@access protected
//
//
//
//コンストラクタ
//
//@author kitamura
//@since 2009/03/13
//
//@access public
//@return void
//
//
//
//pactidを取得
//
//@author kitamura
//@since 2009/03/13
//
//@access public
//@return integer
//
//
//
//保存するASP使用料を配列で取得
//
//@author kitamura
//@since 2009/03/13
//
//@access public
//@return array
//
//
//
//現在の状態を取得
//
//@author kitamura
//@since 2009/03/13
//
//@access public
//@return string
//
//
//
//設定するASP使用料の識別名を取得
//
//@author kitamura
//@since 2009/03/13
//
//@access public
//@return string
//
//
//
//ASP使用料の識別名を確認
//
//@author kitamura
//@since 2009/03/17
//
//@access public
//@return boolean
//
//
//
//完了時のメッセージを設定
//
//@author kitamura
//@since 2009/03/18
//
//@param mixed $message
//@access public
//@return void
//
//
//
//Smartyにアサイン
//
//@author kitamura
//@since 2009/03/13
//
//@param string $key
//@param mixed $value
//@access public
//@return void
//
//
//
//画面表示
//
//@author kitamura
//@since 2009/03/13
//
//@access public
//@return void
//
//
//
//GETパラメータが正しくない場合のエラー表示
//
//@author kitamura
//@since 2009/03/19
//
//@access public
//@return void
//
//
//
//パラメータのチェックと設定
//
//@author kitamura
//@since 2009/03/13
//
//@access protected
//@return void
//
//
//
//POSTの有無を確認
//
//@author kitamura
//@since 2009/03/13
//
//@access protected
//@return void
//
//
//
//POSTの内容を判別
//
//@author kitamura
//@since 2009/03/17
//
//@param array $A_data
//@access protected
//@return boolean
//
//
//
//pactidをGETから設定
//
//@author kitamura
//@since 2009/03/13
//
//@access protected
//@return void
//
//
//
//ASP使用料設定ページの識別名を設定
//
//@author kitamura
//@since 2009/03/16
//
//@access protected
//@return void
//
//
//
//デストラクタ
//
//@author kitamura
//@since 2009/03/13
//
//@access public
//@return void
//
//
class AspSettingView extends ViewSmarty {
	static INPUT_STATUS = "input";
	static FINISH_STATUS = "finish";
	static ERROR_STATUS = "error";
	static ACCESS_TYPE_TEL = "tel";
	static ACCESS_TYPE_CARD = "card";
	static ACCESS_TYPE_PURCHASE = "purchase";
	static ACCESS_TYPE_COPY = "copy";
	static ACCESS_TYPE_ICCARD = "iccard";

	constructor() {
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.checkParams();
	}

	getPactId() {
		return this.pact_id;
	}

	getSaveData() {
		return this.A_save_data;
	}

	getCurrentStatus() {
		return this.current_status;
	}

	getAccessType() {
		return this.access_type;
	}

	checkAccessType() //ASP使用料の識別名が設定されていれば真
	{
		switch (this.access_type) {
			case AspSettingView.ACCESS_TYPE_TEL:
				var result = true;
				break;

			case AspSettingView.ACCESS_TYPE_CARD:
				result = true;
				break;

			case AspSettingView.ACCESS_TYPE_PURCHASE:
				result = true;
				break;

			case AspSettingView.ACCESS_TYPE_COPY:
				result = true;
				break;

			case AspSettingView.ACCESS_TYPE_ICCARD:
				result = true;
				break;

			default:
				result = false;
				break;
		}

		return result;
	}

	setFinishMessage(message) {
		if (true === message) {
			this.message = "\u4FDD\u5B58\u3057\u307E\u3057\u305F";
		} else if (false === message) {
			this.message = "\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F";
		} else {
			this.message = message;
		}
	}

	assign(key, value) {
		this.get_Smarty().assign(key, value);
	}

	display() //メッセージを設定
	{
		this.assign("message", this.message);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	paramError() {
		this.errorOut(15, "AspSetting:pactid\u3082\u3057\u304F\u306Faccess\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u6B63\u3057\u304F\u306A\u3044", 0);
	}

	checkParams() //POSTの有無を確認
	//pactidの設定
	//ASP使用料設定ページの識別名を設定
	{
		this.postCheck();
		this.setPactId();
		this.setAccessType();
	}

	postCheck() //現在の状態（デフォルトは入力）
	//保存するASP使用料
	//POSTされた場合
	{
		this.current_status = AspSettingView.INPUT_STATUS;
		this.A_save_data = Array();

		if (true == (undefined !== _POST.save)) //POSTされた内容が正しい場合
			{
				if (true == (undefined !== _POST.data) && true == this.checkPostData(_POST.data)) //POSTされた内容が正しくない場合
					{
						this.A_save_data = _POST.data;
						this.current_status = AspSettingView.FINISH_STATUS;
					} else {
					this.current_status = AspSettingView.ERROR_STATUS;
				}
			}
	}

	checkPostData(A_data) //返り値
	{
		var return = false;

		if (true == Array.isArray(A_data)) {
			return = true;

			for (var key in A_data) {
				var value = A_data[key];

				if (false == is_numeric(key) || false == ctype_digit(value)) {
					this.message = "\u4F7F\u7528\u6599\u306F\u534A\u89D2\u6570\u5B57\u3067\u6B63\u306E\u6574\u6570\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
					return = false;
					break;
				}
			}
		}

		return return;
	}

	setPactId() //入力画面を表示する場合
	{
		if (true == (undefined !== _GET.pactid) && true == is_numeric(_GET.pactid) && (AspSettingView.INPUT_STATUS == this.current_status || AspSettingView.ERROR_STATUS == this.current_status)) //完了画面を表示する場合
			{
				this.pact_id = _GET.pactid;
			} else if (true == (undefined !== _POST.pactid) && true == is_numeric(_POST.pactid) && AspSettingView.FINISH_STATUS == this.current_status) //正しくpactidが設定されていない場合
			{
				this.pact_id = _POST.pactid;
			} else {
			this.pact_id = undefined;
		}
	}

	setAccessType() //入力画面を表示する場合
	{
		if (true == (undefined !== _GET.access) && (AspSettingView.INPUT_STATUS == this.current_status || AspSettingView.ERROR_STATUS == this.current_status)) //完了画面を表示する場合
			{
				this.access_type = _GET.access;
			} else if (true == (undefined !== _POST.access) && AspSettingView.FINISH_STATUS == this.current_status) //正しく設定されていない場合
			{
				this.access_type = _POST.access;
			} else {
			this.access_type = undefined;
		}
	}

	__destruct() {
		super.__destruct();
	}

};