//
//端末管理用AjaxのView
//
//更新履歴：<br>
//2008/08/07 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/08/07
//@filesource
//@uses ManagementAjaxViewBase
//
//
//error_reporting(E_ALL);
//
//端末管理用AjaxのView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/08/07
//@uses ManagementAjaxViewBase
//

require("view/Management/ManagementAjaxViewBase.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author houshiyama
//@since 2008/08/07
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//端末一覧AJAX固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/08/07
//
//@access protected
//@return void
//
//
//端末フォームの入れ替え部分を作成する<br>
//
//フォームのオブジェクト生成<br>
//
//@author houshiyama
//@since 2008/08/07
//
//@param object $O_manage
//@param object $O_model
//@param array $H_sess
//@access public
//@return void
//@uses QuickFormUtil
//
//
//端末一覧AJAX固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/08/07
//
//@param mixed $H_sess
//@param array $H_data
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/07
//
//@access public
//@return void
//
class ManagementAssetsAjaxView extends ManagementAjaxViewBase {
	constructor() {
		super();
	}

	checkCGIParamPeculiar() //フォーム番号は常にある
	{
		if (undefined !== _POST.num == true) {
			this.H_Local.post.num = _POST.num;
		}

		if (undefined !== _POST.searchcarid == true) {
			this.H_Local.post.searchcarid = _POST.searchcarid;
			this.H_Local.post["searchcarid_" + _POST.num] = _POST.searchcarid;
		}

		if (undefined !== _POST.searchcirid == true) {
			this.H_Local.post.searchcirid = _POST.searchcirid;
			this.H_Local.post["searchcirid_" + _POST.num] = _POST.searchcirid;
		}

		if (undefined !== _POST.seriesid == true) {
			this.H_Local.post.seriesid = _POST.seriesid;
			this.H_Local.post["seriesid_" + _POST.num] = _POST.seriesid;
		}

		if (undefined !== _POST.productid == true) {
			var A_id = split(":", _POST.productid);
			this.H_Local.post.productid = A_id[0];
			this.H_Local.post["productid_" + _POST.num] = _POST.productid;
		}
	}

	makeForm(O_manage, O_model, H_sess: {} | any[], H_data: {} | any[]) //フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	{
		var A_formelement = [{
			name: "searchcirid_" + H_sess.SELF.post.num,
			label: "\u56DE\u7DDA\u7A2E\u5225",
			inputtype: "select",
			data: H_data.searchcirid,
			options: {
				id: "searchcirid_" + H_sess.SELF.post.num,
				onChange: "javascript:execAssetsAjax(this.name);"
			}
		}, {
			name: "seriesid_" + H_sess.SELF.post.num,
			label: "\u30B7\u30EA\u30FC\u30BA",
			inputtype: "select",
			data: H_data.seriesid,
			options: {
				id: "seriesid_" + H_sess.SELF.post.num,
				onChange: "javascript:execAssetsAjax(this.name);"
			}
		}, {
			name: "productid_" + H_sess.SELF.post.num,
			label: "\u6A5F\u7A2E",
			inputtype: "select",
			data: H_data.productid,
			options: {
				id: "productid_" + H_sess.SELF.post.num,
				onChange: "javascript:execAssetsAjax(this.name);"
			}
		}, {
			name: "branchid_" + H_sess.SELF.post.num,
			label: "\u8272",
			inputtype: "select",
			data: H_data.branchid,
			options: {
				id: "branchid_" + H_sess.SELF.post.num,
				onChange: "javascript:setHiddenValueAss(this.name);"
			}
		}, {
			name: "accessory_" + H_sess.SELF.post.num,
			label: "\u4ED8\u5C5E\u54C1",
			inputtype: "groupcheckbox",
			data: H_data.accessory,
			options: {
				id: "accessory_" + H_sess.SELF.post.num,
				onChange: "javascript:setHiddenCheckBox(this.name);"
			}
		}];
		this.H_View.O_FormUtil = new QuickFormUtil("ajaxform");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_AddForm = this.H_View.O_FormUtil.makeFormObject();
	}

	displaySmartyPeculiar(H_sess: {} | any[], H_data: {} | any[]) //QuickFormとSmartyの合体
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_AddForm.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("H_data", H_data);
		this.get_Smarty().assign("fkey", "_" + H_sess.SELF.post.num);
	}

	__destruct() {
		super.__destruct();
	}

};