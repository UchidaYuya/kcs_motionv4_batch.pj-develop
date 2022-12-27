//
//内線番号設定ビュー
//
//更新履歴：
//2011/10/13 宝子山浩平 作成
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
//内線番号設定ビュー
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
//@param array $H_data
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
//数値が最小と最大の間にあるか？チェック
//
//@author houshiyama
//@since 2011/10/14
//
//@param mixed $data
//@param mixed $min
//@param mixed $max
//@access public
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
class ExtensionSettingView extends ViewSmarty {
	static INPUT_STATUS = "input";
	static FINISH_STATUS = "finish";
	static ERROR_STATUS = "error";

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
		this.errorOut(15, "ExtensionSetting:pactid\u304C\u6B63\u3057\u304F\u306A\u3044", 0);
	}

	checkParams() //POSTの有無を確認
	//pactidの設定
	{
		this.checkPost();
		this.setPactId();
	}

	checkPost() //現在の状態（デフォルトは入力）
	//保存するASP使用料
	//POSTされた場合
	{
		this.current_status = ExtensionSettingView.INPUT_STATUS;
		this.A_save_data = Array();

		if (true == (undefined !== _POST.save)) //POSTされた内容が正しい場合
			{
				if (true == (undefined !== _POST.min_no) && true == this.checkPostData(_POST)) //POSTされた内容が正しくない場合
					{
						this.A_save_data = _POST;
						this.current_status = ExtensionSettingView.FINISH_STATUS;
					} else {
					this.current_status = ExtensionSettingView.ERROR_STATUS;
				}
			}
	}

	checkPostData(H_data) //返り値
	//エラーメッセージ
	{
		var return = false;
		var range = false;
		var maxlen = 0;
		var A_message = Array();

		if ("" != H_data.digit_number) {
			if (false == is_numeric(H_data.digit_number) || false == ctype_digit(H_data.digit_number)) {
				A_message.push("\u6841\u6570\u306F\u534A\u89D2\u6570\u5B57\u3067\u6B63\u306E\u6574\u6570\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
			}
		}

		{
			let _tmp_1 = H_data.min_no;

			for (var key in _tmp_1) {
				var value = _tmp_1[key];

				if ("" != value && false == ctype_digit(value)) {
					A_message.push(H_data.carname[key] + "\u306E\u6700\u5C0F\u5024\u306F\u534A\u89D2\u6570\u5B57\u3067\u6B63\u306E\u6574\u6570\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
				}

				if ("" != value && "" == H_data.max_no[key]) {
					A_message.push(H_data.carname[key] + "\u306E\u6700\u5927\u5024\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
				}

				if ("" != value && "" != H_data.max_no[key] && Math.round(value) > Math.round(H_data.max_no[key])) {
					A_message.push(H_data.carname[key] + "\u306F\u6700\u5927\u5024\u3088\u308A\u5C0F\u3055\u3044\u5024\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
				}

				if ("" != value) {
					{
						let _tmp_0 = H_data.min_no;

						for (var carid in _tmp_0) {
							var data = _tmp_0[carid];

							if (!range && !!data && key != carid && this.checkRange(value, H_data.min_no[carid], H_data.max_no[carid])) {
								range = true;
								A_message.push("\u7BC4\u56F2\u304C\u91CD\u306A\u3089\u306A\u3044\u3088\u3046\u306B\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
								break;
							}
						}
					}
				}
			}
		}
		{
			let _tmp_3 = H_data.max_no;

			for (var key in _tmp_3) {
				var value = _tmp_3[key];

				if ("" != value && false == ctype_digit(value)) {
					A_message.push(H_data.carname[key] + "\u306E\u6700\u5927\u5024\u306F\u534A\u89D2\u6570\u5B57\u3067\u6B63\u306E\u6574\u6570\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
				}

				if ("" != value && "" == H_data.min_no[key]) {
					A_message.push(H_data.carname[key] + "\u306E\u6700\u5C0F\u5024\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
				}

				if ("" != value && value.length > maxlen) {
					maxlen = value.length;
				}

				if ("" != value) {
					{
						let _tmp_2 = H_data.max_no;

						for (var carid in _tmp_2) {
							var H_val = _tmp_2[carid];

							if (!range && key != carid && this.checkRange(value, H_data.min_no[carid], H_data.max_no[carid])) {
								range = true;
								A_message.push("\u7BC4\u56F2\u304C\u91CD\u306A\u3089\u306A\u3044\u3088\u3046\u306B\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
								break;
							}
						}
					}
				}
			}
		}

		if (maxlen > H_data.digit_number) {
			A_message.push("\u6841\u6570\u306F\u6700\u5927\u5024\u306E\u6841\u6570\u3088\u308A\u5927\u304D\u306A\u5024\u3092\u5165\u308C\u3066\u4E0B\u3055\u3044");
		}

		if (H_data.digit_number > 18) {
			A_message.push("\u6841\u6570\u306F19\u6841\u3088\u308A\u5C0F\u3055\u306A\u5024\u3092\u5165\u308C\u3066\u4E0B\u3055\u3044");
		}

		if (!!A_message) {
			this.message = A_message.join("<br>");
		} else {
			return = true;
		}

		return return;
	}

	setPactId() //入力画面を表示する場合
	{
		if (true == (undefined !== _GET.pactid) && true == is_numeric(_GET.pactid) && (ExtensionSettingView.INPUT_STATUS == this.current_status || ExtensionSettingView.ERROR_STATUS == this.current_status)) //完了画面を表示する場合
			{
				this.pact_id = _GET.pactid;
			} else if (true == (undefined !== _POST.pactid) && true == is_numeric(_POST.pactid) && ExtensionSettingView.FINISH_STATUS == this.current_status) //正しくpactidが設定されていない場合
			{
				this.pact_id = _POST.pactid;
			} else {
			this.pact_id = undefined;
		}
	}

	checkRange(data, min, max) {
		if (!data.trim().length) {
			return true;
		}

		if (!is_numeric(data)) {
			return false;
		}

		if (Math.round(data) >= Math.round(min) && Math.round(data) <= Math.round(max)) {
			return true;
		} else {
			return false;
		}
	}

	__destruct() {
		super.__destruct();
	}

};