//
//請求ダウンロード設定（出力基底）
//
//更新履歴：<br>
//2010/10/01	石崎公久	作成
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@package BDSettings
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/01
//
//
//
//請求ダウンロード設定（出力基底）
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@package BDSettings
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/01
//

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

//
//MySess
//
//@var mixed
//@access protected
//
//
//O_Auth
//
//@var mixed
//@access protected
//
//
//O_Qf
//
//@var mixed
//@access protected
//
//
//H_assign
//
//@var mixed
//@access protected
//
//
//Mode
//
//@var mixed
//@access protected
//
//
//Fncid
//
//@var mixed
//@access protected
//
//
//submitFlag
//
//@var mixed
//@access protected
//
//
//__construct
//
//
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $H_navi
//@access public
//@return void
//
//
//setAssign
//
//@author ishizaki
//@since 2008/08/13
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//setNaviHTML
//
//@author ishizaki
//@since 2008/08/27
//
//@param mixed $H_navi
//@access public
//@return void
//
//
//assignSmarty
//
//@author ishizaki
//@since 2008/08/27
//
//@access protected
//@return void
//
//
//displaySmarty
//
//@author ishizaki
//@since 2008/07/30
//
//@param string $err_str
//@access public
//@return BDSettingsViewBase
//
//
//displayHTML
//
//@author ishizaki
//@since 2008/10/19
//
//@access public
//@return BDSettingsViewBase
//
//
//getPost
//
//@author
//@since 2010/10/22
//
//@access public
//@return void
//
//
//getSubmitFlag
//
//@author ishizaki
//@since 2008/09/10
//
//@access public
//@return void
//
//
//__destruct
//
//@author ishizaki
//@since 2008/07/30
//
//@access public
//@return void
//
class BDSettingsViewBase extends ViewSmarty {
	constructor(H_param = undefined) {
		this.H_assign = Array();
		this.submitFlag = false;

		if (!is_null(H_param)) {
			super(H_param);
		} else {
			super();
		}

		this.O_Qf = new QuickFormUtil("form");
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	setNaviHTML(H_navi) {
		this.H_assign.page_path = MakePankuzuLink.makePankuzuLinkHTML(H_navi);
		return this;
	}

	assignSmarty() {
		if (0 < this.H_assign.length) {
			{
				let _tmp_0 = this.H_assign;

				for (var key in _tmp_0) {
					var value = _tmp_0[key];
					this.get_Smarty().assign(key, value);
				}
			}
		}
	}

	displaySmarty(err_str = "") {
		this.get_Smarty().assign("err_str", err_str);
		this.get_Smarty().display(this.getDefaultTemplate());
		return this;
	}

	displayHTML() {
		this.assignSmarty();
		this.get_Smarty().display(this.getDefaultTemplate());
		return this;
	}

	getPost() {
		return _POST;
	}

	getSubmitFlag() {
		return this.submitFlag;
	}

	__destruct() {
		super.__destruct();
	}

};