//
//電話管理用AjaxのView
//
//更新履歴：<br>
//2008/05/28 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/05/28
//@filesource
//@uses ManagementAjaxViewBase
//
//
//error_reporting(E_ALL);
//
//電話管理用AjaxのView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/05/28
//@uses ManagementAjaxViewBase
//

require("view/Management/ManagementAjaxViewBase.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author houshiyama
//@since 2008/05/28
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//電話一覧AJAX固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/05/21
//
//@access protected
//@return void
//
//
//電話フォームの入れ替え部分を作成する<br>
//
//フォームのオブジェクト生成<br>
//
//@author houshiyama
//@since 2008/06/03
//
//@param object $O_manage
//@param object $O_model
//@param array $H_sess
//@access public
//@return void
//@uses QuickFormUtil
//
//
//電話一覧AJAX固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/05/21
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
//@since 2008/05/28
//
//@access public
//@return void
//
class ManagementTelAjaxView extends ManagementAjaxViewBase {
	constructor() {
		super();
	}

	checkCGIParamPeculiar() //キャリア選択実行された時
	{
		if (undefined !== _POST.carid == true) {
			this.H_Local.post.carid = _POST.carid;
		}

		if (undefined !== _POST.cirid == true) {
			this.H_Local.post.cirid = _POST.cirid;
		}

		if (undefined !== _POST.buyselid == true) {
			this.H_Local.post.buyselid = _POST.buyselid;
		}
	}

	makeForm(O_manage, O_model, H_sess: {} | any[], H_data: {} | any[]) //フォーム要素の配列作成
	{
		var A_formelement = [{
			name: "cirid",
			label: "\u56DE\u7DDA\u7A2E\u5225",
			inputtype: "select",
			data: H_data.cirid,
			options: {
				id: "cirid",
				onChange: "javascript:execTelAjax('cirid');"
			}
		}, {
			name: "buyselid",
			label: "\u8CFC\u5165\u65B9\u5F0F",
			inputtype: "select",
			data: H_data.buyselid,
			options: {
				id: "buyselid",
				onChange: "javascript:execTelAjax('buyselid');"
			}
		}, {
			name: "planid",
			label: "\u6599\u91D1\u30D7\u30E9\u30F3",
			inputtype: "select",
			data: H_data.planid,
			options: {
				id: "planid",
				onChange: "javascript:setHiddenValue('plan');"
			}
		}, {
			name: "packetid",
			label: "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF",
			inputtype: "select",
			data: H_data.packetid,
			options: {
				id: "packetid",
				onChange: "javascript:setHiddenValue('packet');"
			}
		}, {
			name: "pointid",
			label: "\u30DD\u30A4\u30F3\u30C8\u30B5\u30FC\u30D3\u30B9",
			inputtype: "select",
			data: H_data.pointid,
			options: {
				id: "pointid",
				onChange: "javascript:setHiddenValue('point');"
			}
		}, {
			name: "arid",
			label: "\u5730\u57DF\u4F1A\u793E",
			inputtype: "select",
			data: H_data.arid,
			options: {
				id: "arid",
				onChange: "javascript:setHiddenValue('ar');"
			}
		}, {
			name: "discountid",
			label: "\u5272\u5F15\u30B5\u30FC\u30D3\u30B9",
			inputtype: "groupcheckbox",
			data: H_data.discountid,
			options: {
				onChange: "javascript:setHiddenCheckBox('discount', this.name);"
			}
		}, {
			name: "opid",
			label: "\u30AA\u30D7\u30B7\u30E7\u30F3",
			inputtype: "groupcheckbox",
			data: H_data.opid,
			options: {
				onChange: "javascript:setHiddenCheckBox('op', this.name);"
			}
		}, {
			name: "kousiptnid",
			label: "\u4F7F\u7528\u3059\u308B\u30D1\u30BF\u30FC\u30F3",
			inputtype: "select",
			data: H_data.kousiptnid,
			options: {
				id: "kousiptnid",
				onChange: "javascript:setHiddenValue('kousiptn');"
			}
		}];

		if (undefined !== H_data.webrelief) {
			A_formelement.push({
				name: "webrelief",
				label: "\u30A6\u30A7\u30D6\u5B89\u5FC3\u30B5\u30FC\u30D3\u30B9ManagementTelAjax",
				inputtype: "radio",
				data: H_data.webrelief
			});
		}

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
	}

	__destruct() {
		super.__destruct();
	}

};