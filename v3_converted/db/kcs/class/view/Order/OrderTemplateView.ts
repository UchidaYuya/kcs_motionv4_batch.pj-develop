//
//注文雛型View
//
//更新履歴：<br>
//2008/04/17 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/17
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//注文雛型View
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/17
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/Order/OrderViewBase.php");

//
//コンストラクタ <br>
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//雛型フォーム作成
//
//@author miyazawa
//@since 2008/09/11
//
//@param mixed $H_templatelist
//@access protected
//@return string
//
//
//雛型反映
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_sess
//@access protected
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
class OrderTemplateView extends OrderViewBase {
	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(OrderTemplateView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
	}

	makeTemplateForm(H_templatelist = Array(), site = 0) //代行注文ではデフォルト雛型をキャンセルできるよう引数追加 20091026miya
	//英語化 20090210miya
	{
		if (true == this.H_Dir.eng) {
			var defselstr = "Do not use template";
		} else {
			defselstr = "\u96DB\u578B\u3092\u4F7F\u7528\u3057\u306A\u3044";
		}

		var templateform = "";
		var temp_cnt = 0;

		if (true == (undefined !== H_templatelist) && 0 < H_templatelist.length) {
			for (var key in H_templatelist) {
				var var = H_templatelist[key];
				var title = "";
				temp_cnt++;
				templateform += "<option value=" + key;

				if (key == this.H_Dir.tempid) {
					templateform += " SELECTED";
				}

				var defflg_no = var.substr(0, 1);
				title = temp_cnt + ":" + var.substr(1);

				if (defflg_no == 1) //$siteで代行注文を識別 20091026miya
					{
						title = "\u25CE" + title;

						if (site != 1) {
							var defflg_chk = true;
						}
					}

				templateform += ">" + title + "</option>";
			}

			if (defflg_chk == false) {
				templateform = "<option value=\"-1\">" + defselstr + "</option>\n" + templateform;
			}
		}

		return templateform;
	}

	setTemplateValue(O_form) {
		var hoge = "";
		return hoge;
	}

	__destruct() {
		super.__destruct();
	}

};