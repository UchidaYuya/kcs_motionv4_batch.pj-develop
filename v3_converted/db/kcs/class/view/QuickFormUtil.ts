//
//QuickFormオブジェクト生成のクラスライブラリ
//
//更新履歴：<br>
//2008/02/25 宝子山浩平 作成<br>
//
//@package Shared View
//@subpackage QuickForm
//@author houshiyama
//@since 2008/02/25
//@filesource
//@uses HTML_QuickForm
//
//
//
//Formオブジェクト生成クラス
//
//@package Shared View
//@subpackage QuickForm
//@access public
//@author houshiyama
//@since 2008/02/25
//@uses HTML_QuickForm
//

require("HTML/QuickForm.php");

require("BasicRule.php");

require("HTML/QuickForm/Rule.php");

require("HTML/QuickForm/Rule/Checkdate.php");

require("view/Rule/OriginalRule.php");

//
//フォームオブジェクト
//
//@var object
//@access private
//
//
//フォーム構造を記述した
//
//@var mixed
//@access private
//
//
//コンストラクター
//
//HTML_QuickFormの初期化<br>
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $form_name
//@param mixed $H_form_method
//@access public
//@return void
//@uses HTML_QuickForm
//
//
//setFromElement
//
//@author katsushi
//@since 2008/02/25
//
//@param array $H_form_element
//@access public
//@return void
//
//
//フォームオブジェクト作成関数
//
//フォーム構造を記述した配列からフォームオブジェクトを生成して返す
//
//@author houshiyama
//@since 2008/02/25
//
//@access public
//@return $this->O_form
//
//
//input type=submitのフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=textのフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=buttonのフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=resetのフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/28
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=hiddenのフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=selectのフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=checkbox（複数）のフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=checkboxのフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=advcheckboxのフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=radioのフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=date（select）のフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/27
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=textareaのフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=passwordのフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//単純表示のためのフォームオブジェクトを追加する
//
//@author nakanita
//@since 2008/05/20
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//addElementFile
//
//@author houshiyama
//@since 2008/10/22
//
//@param mixed $H_Element
//@access public
//@return void
//
//
//フォームエレメントを作成し配列を返す
//
//@author houshiyama
//@since 2008/02/27
//
//@access public
//@return array
//
//
//input type=submitのフォームオブジェクトを生成する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=textのフォームオブジェクトを生成する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=buttonのフォームオブジェクトを生成する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=resetのフォームオブジェクトを生成する
//
//@author houshiyama
//@since 2008/02/28
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=hiddenのフォームオブジェクトを生成する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=selectのフォームオブジェクトを生成する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=checkboxのフォームオブジェクトを生成する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=checkbox（複数）のフォームオブジェクトを追加する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=advcheckboxのフォームオブジェクトを生成する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=radioのフォームオブジェクトを生成する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=date（select）のフォームオブジェクトを生成する
//
//@author houshiyama
//@since 2008/02/27
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=textareaのフォームオブジェクトを生成する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//input type=passwordのフォームオブジェクトを生成する
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access protected
//@return void
//
//
//HTML_QuickFormのaddGroupのラッパー
//
//@author houshiyama
//@since 2008/02/25
//
//@param mixed $H_Element
//@access public
//@return void
//
//
//HTML_QuickFormのsetDefaultsのラッパー
//
//@author houshiyama
//@since 2008/02/26
//
//@param mixed $defaultValues
//@param mixed $filter
//@access public
//@return void
//
//
//HTML_QuickFormのvalidateのラッパー
//
//@author houshiyama
//@since 2008/02/29
//
//@access public
//@return void
//
//
//HTML_QuickFormのfreezeのラッパー
//
//@author houshiyama
//@since 2008/02/29
//
//@access public
//@return void
//
//
//HTML_QuickFormのupdateElementAttrのラッパー
//
//@author houshiyama
//@since 2008/03/11
//
//@param mixed $elements
//@param mixed $attrs
//@access public
//@return void
//
//
//HTML_QuickFormのupdateAttributesのラッパー
//
//@author houshiyama
//@since 2008/03/11
//
//@param array $A_inp
//@access public
//@return void
//
//
//HTML_QuickFormのaddRuleのラッパー
//
//@author houshiyama
//@since 2008/03/11
//
//@param mixed $element
//@param string $message
//@param string $type
//@param string $format
//@param string $validation
//@param boolean $reset
//@param boolean $force
//@access public
//@return void
//
//
//HTML_QuickFormのaddRuleのラッパー
//
//@author houshiyama
//@since 2008/03/11
//
//@param mixed $element
//@param string $message
//@param string $type
//@param string $format
//@param string $validation
//@param boolean $reset
//@param boolean $force
//@access public
//@return void
//
//
//渡された配列からフォームルールを作成する
//
//@author houshiyama
//@since 2008/03/10
//
//@param mixed $H_rule
//@access public
//@return void
//
//
//makeFormRuleにヘッダー、フッター処理を入れる
//
//@author houshiyama
//@since 2008/03/12
//
//@param array $H_rule
//@access public
//@return void
//
//
//HTML_QuickFormのsetRequiredNoteのラッパー
//
//@author houshiyama
//@since 2008/03/12
//
//@param mixed $note
//@access public
//@return void
//
//
//HTML_QuickFormのsetJsWarningsのラッパー
//
//@author houshiyama
//@since 2008/03/12
//
//@param mixed $pref
//@param mixed $post
//@access public
//@return void
//
//
//HTML_QuickFormのsetElementErrorのラッパー
//
//@author houshiyama
//@since 2008/03/12
//
//@param mixed $element
//@param mixed $mess
//@access public
//@return void
//
//
//HTML_QuickFormのregisterRuleのラッパー
//
//@author houshiyama
//@since 2008/04/08
//
//@param mixed $ruleName
//@param mixed $type
//@param mixed $data1
//@param mixed $data2
//@access public
//@return void
//
//
//自作ルールの読込
//
//@author houshiyama
//@since 2008/04/08
//
//@param mixed $A_rule
//@access public
//@return void
//
//
//addElementHierselect
//
//@author katsushi
//@since 2008/07/09
//
//@param mixed $H_Element
//@access public
//@return void
//
//
//setDefaultWarningNote
//
//@author katsushi
//@since 2008/08/29
//
//@access public
//@return void
//
//
//setDefaultWarningNote
//
//@author katsushi
//@since 2008/08/29
//
//@access public
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
class QuickFormUtil {
	constructor(formName = "", method = "post", action = "", target = "", attributes = undefined, trackSubmit = false) //QuickFormの初期化
	{
		this.O_Form = new HTML_QuickForm(formName, method, action, target, attributes, trackSubmit);
	}

	setFormElement(H_form_element: {} | any[]) {
		this.H_FormElement = H_form_element;
	}

	makeFormObject() {
		for (var cnt = 0; cnt < this.H_FormElement.length; cnt++) {
			switch (this.H_FormElement[cnt].inputtype) {
				case "submit":
					this.addElementSubmit(this.H_FormElement[cnt]);
					break;

				case "text":
					this.addElementText(this.H_FormElement[cnt]);
					break;

				case "hidden":
					this.addElementHidden(this.H_FormElement[cnt]);
					break;

				case "button":
					this.addElementButton(this.H_FormElement[cnt]);
					break;

				case "reset":
					this.addElementReset(this.H_FormElement[cnt]);
					break;

				case "select":
					this.addElementSelect(this.H_FormElement[cnt]);
					break;

				case "checkbox":
					this.addElementCheckbox(this.H_FormElement[cnt]);
					break;

				case "groupcheckbox":
					this.addGroupCheckbox(this.H_FormElement[cnt]);
					break;

				case "advcheckbox":
					this.addElementAdvCheckbox(this.H_FormElement[cnt]);
					break;

				case "radio":
					this.addGroupRadio(this.H_FormElement[cnt]);
					break;

				case "date":
					this.addElementDate(this.H_FormElement[cnt]);
					break;

				case "textarea":
					this.addElementTextarea(this.H_FormElement[cnt]);
					break;

				case "password":
					this.addElementPassword(this.H_FormElement[cnt]);
					break;

				case "header":
					this.addElementHeader(this.H_FormElement[cnt]);
					break;

				case "hierselect":
					this.addElementHierselect(this.H_FormElement[cnt]);
					break;

				case "file":
					this.addElementFile(this.H_FormElement[cnt]);
					break;

				case "groupcheckbox2":
					this.addGroupCheckbox2(this.H_FormElement[cnt]);
					break;

				default:
					MtExcept.raise("view/QuickFormUtil.php::makeFormObject: \u30B5\u30DD\u30FC\u30C8\u5916\u306Einput type\u3067\u3059\uFF08" + this.H_FormElement[cnt].name + ":" + this.H_FormElement[cnt].inputtype + "\uFF09");
					throw die();
			}
		}

		return this.O_Form;
	}

	addElementSubmit(H_Element) {
		this.O_Form.addElement("submit", H_Element.name, H_Element.label, H_Element.options);
	}

	addElementText(H_Element) {
		this.O_Form.addElement("text", H_Element.name, H_Element.label, H_Element.options);
	}

	addElementButton(H_Element) {
		this.O_Form.addElement("button", H_Element.name, H_Element.label, H_Element.options);
	}

	addElementReset(H_Element) {
		this.O_Form.addElement("reset", H_Element.name, H_Element.label, H_Element.data, H_Element.options);
	}

	addElementHidden(H_Element) {
		this.O_Form.addElement("hidden", H_Element.name, H_Element.data, H_Element.options);
	}

	addElementSelect(H_Element) {
		this.O_Form.addElement("select", H_Element.name, H_Element.label, H_Element.data, H_Element.options);
	}

	addGroupCheckbox(H_Element) {
		var A_group = Array();
		{
			let _tmp_0 = H_Element.data;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				A_group.push(HTML_QuickForm.createElement("checkbox", key, undefined, value, H_Element.options));
			}
		}

		if (undefined !== H_Element.separator == true && H_Element.separator != "") {
			var separator = H_Element.separator;
		} else {
			separator = "&nbsp;";
		}

		this.addGroupWrapper(A_group, H_Element.name, H_Element.label, separator);
	}

	addGroupCheckbox2(H_Element) {
		var A_group = Array();
		{
			let _tmp_1 = H_Element.data;

			for (var key in _tmp_1) {
				var value = _tmp_1[key];
				A_group.push(HTML_QuickForm.createElement("checkbox", key, value, undefined, H_Element.options));
			}
		}

		if (undefined !== H_Element.separator == true && H_Element.separator != "") {
			var separator = H_Element.separator;
		} else {
			separator = "&nbsp;";
		}

		this.addGroupWrapper(A_group, H_Element.name, H_Element.label, separator);
	}

	addElementCheckbox(H_Element) {
		this.O_Form.addElement("checkbox", H_Element.name, H_Element.label, H_Element.data, H_Element.options);
	}

	addElementAdvCheckbox(H_Element) {
		var A_group = Array();
		{
			let _tmp_2 = H_Element.data;

			for (var key in _tmp_2) {
				var value = _tmp_2[key];
				A_group.push(HTML_QuickForm.createElement("advcheckbox", key, undefined, value));
			}
		}
		this.addGroupWrapper(A_group, H_Element.name, H_Element.label, "&nbsp;");
	}

	addGroupRadio(H_Element) {
		var A_group = Array();
		{
			let _tmp_3 = H_Element.data;

			for (var key in _tmp_3) {
				var A_atteribute = _tmp_3[key];
				A_group.push(HTML_QuickForm.createElement("radio", undefined, undefined, A_atteribute[0], key, A_atteribute[1]));
			}
		}
		this.addGroupWrapper(A_group, H_Element.name, H_Element.label, H_Element.separator);
	}

	addElementDate(H_Element) {
		this.O_Form.addElement("date", H_Element.name, H_Element.label, H_Element.data);
	}

	addElementTextarea(H_Element) {
		this.O_Form.addElement("textarea", H_Element.name, H_Element.label, H_Element.options);
	}

	addElementPassword(H_Element) {
		this.O_Form.addElement("password", H_Element.name, H_Element.label, H_Element.options);
	}

	addElementHeader(H_Element) {
		this.O_Form.addElement("header", H_Element.name, H_Element.label, H_Element.options);
	}

	addElementFile(H_Element) {
		this.O_Form.addElement("file", H_Element.name, H_Element.label, H_Element.options);
	}

	createFormElement() {
		var A_group = Array();

		for (var cnt = 0; cnt < this.H_FormElement.length; cnt++) {
			switch (this.H_FormElement[cnt].inputtype) {
				case "submit":
					A_group.push(this.createElementSubmit(this.H_FormElement[cnt]));
					break;

				case "text":
					A_group.push(this.createElementText(this.H_FormElement[cnt]));
					break;

				case "hidden":
					A_group.push(this.createElementHidden(this.H_FormElement[cnt]));
					break;

				case "button":
					A_group.push(this.createElementButton(this.H_FormElement[cnt]));
					break;

				case "reset":
					A_group.push(this.createElementReset(this.H_FormElement[cnt]));
					break;

				case "select":
					A_group.push(this.createElementSelect(this.H_FormElement[cnt]));
					break;

				case "checkbox":
					A_group.push(this.createElementCheckbox(this.H_FormElement[cnt]));
					break;

				case "groupcheckbox":
					A_group.push(this.createGroupCheckbox(this.H_FormElement[cnt]));
					break;

				case "advcheckbox":
					A_group.push(this.createElementAdvCheckbox(this.H_FormElement[cnt]));
					break;

				case "radio":
					A_group.push(this.createGroupRadio(this.H_FormElement[cnt]));
					break;

				case "date":
					A_group.push(this.createElementDate(this.H_FormElement[cnt]));
					break;

				case "textarea":
					A_group.push(this.createElementTextarea(this.H_FormElement[cnt]));
					break;

				case "password":
					A_group.push(this.createElementPassword(this.H_FormElement[cnt]));
					break;

				case "groupcheckbox2":
					A_group.push(this.createGroupCheckbox2(this.H_FormElement[cnt]));
					break;

				default:
					MtExcept.raise("view/QuickFormUtil.php::createFormDlement: \u30B5\u30DD\u30FC\u30C8\u5916\u306Einput type\u3067\u3059\uFF08" + this.H_FormElement[cnt].inputtype + "\uFF09");
					throw die();
			}
		}

		return A_group;
	}

	createElementSubmit(H_Element) {
		return this.O_Form.createElement("submit", H_Element.name, H_Element.label, H_Element.data, H_Element.options);
	}

	createElementText(H_Element) {
		return this.O_Form.createElement("text", H_Element.name, H_Element.label, H_Element.options);
	}

	createElementButton(H_Element) {
		return this.O_Form.createElement("button", H_Element.name, H_Element.label, H_Element.data, H_Element.options);
	}

	createElementReset(H_Element) {
		return this.O_Form.createElement("reset", H_Element.name, H_Element.label, H_Element.data, H_Element.options);
	}

	createElementHidden(H_Element) {
		return this.O_Form.createElement("hidden", H_Element.name, H_Element.data, H_Element.options);
	}

	createElementSelect(H_Element) {
		return this.O_Form.createElement("select", H_Element.name, H_Element.label, H_Element.data);
	}

	createElementCheckbox(H_Element) {
		return this.O_Form.createElement("checkbox", H_Element.name, H_Element.label, H_Element.data, H_Element.options);
	}

	createGroupCheckbox(H_Element) {}

	createElementAdvCheckbox(H_Element) {
		return this.O_Form.createElement("advcheckbox", H_Element.name, H_Element.label, H_Element.data, H_Element.options);
	}

	createGroupRadio(H_Element) {}

	createElementDate(H_Element) {
		return this.O_Form.createElement("date", H_Element.name, H_Element.label, H_Element.data);
	}

	createElementTextarea(H_Element) {
		return this.O_Form.createElement("textarea", H_Element.name, H_Element.label, H_Element.options);
	}

	createElementPassword(H_Element) {
		return this.O_Form.createElement("password", H_Element.name, H_Element.label, H_Element.options);
	}

	addGroupWrapper(elements, name = undefined, groupLabel = "", separator = undefined, appendName = true) {
		this.O_Form.addGroup(elements, name, groupLabel, separator, appendName);
	}

	setDefaultsWrapper(defaultValues = undefined, filter = undefined) {
		this.O_Form.setDefaults(defaultValues, filter);
	}

	validateWrapper() {
		return this.O_Form.validate();
	}

	freezeWrapper() {
		this.O_Form.freeze();
	}

	updateElementAttrWrapper(elements, attrs) {
		this.O_Form.updateElementAttr(elements, attrs);
	}

	updateAttributesWrapper(A_inp: {} | any[]) {
		this.O_Form.updateAttributes(A_inp);
	}

	addRuleWrapper(element, message, type, format = "", validation = "server", reset = false, force = false) {
		this.O_Form.addRule(element, message, type, format, validation, reset, force);
	}

	addGroupRuleWrapper(element, message, type, format = "", validation = "server", reset = false, force = false) {
		this.O_Form.addGroupRule(element, message, type, format, validation, reset, force);
	}

	makeFormRule(H_rule: {} | any[]) {
		for (var cnt = 0; cnt < H_rule.length; cnt++) {
			var name = "";
			var mess = "";
			var type = "";
			var format = "";
			var validation = "client";
			var reset = false;
			var force = false;
			{
				let _tmp_4 = H_rule[cnt];

				for (var key in _tmp_4) {
					var value = _tmp_4[key];

					switch (key) {
						case "name":
							name = value;
							break;

						case "mess":
							mess = value;
							break;

						case "type":
							type = value;
							break;

						case "format":
							format = value;
							break;

						case "validation":
							if (value != "server" && value != "client") {
								MtExcept.raise("view/QuickFormUtil.php::makeFormRule: validation\u306B\u306Fserver\u304Bclient\u3092\u5165\u308C\u3066\u304F\u3060\u3055\u3044");
								throw die();
							}

							validation = value;
							break;

						case "reset":
							if (value != true && value != false) {
								MtExcept.raise("view/QuickFormUtil.php::makeFormRule: reset\u306B\u306Ftrue\u304Bfalse\u3092\u5165\u308C\u3066\u304F\u3060\u3055\u3044");
								throw die();
							}

							reset = value;
							break;

						case "force":
							if (value != true && value != false) {
								MtExcept.raise("view/QuickFormUtil.php::makeFormRule: force\u306B\u306Ftrue\u304Bfalse\u3092\u5165\u308C\u3066\u304F\u3060\u3055\u3044");
								throw die();
							}

							force = value;
							break;

						default:
							MtExcept.raise("view/QuickFormUtil.php::makeFormRule: \u30B5\u30DD\u30FC\u30C8\u5916\u306E\u30AD\u30FC\u3067\u3059\uFF08" + key + "\uFF09");
							throw die();
					}
				}
			}

			if ("" == name) {
				MtExcept.raise("view/QuickFormUtil.php::makeFormRule: name\u30AD\u30FC\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044");
				throw die();
			}

			if ("" == mess) {
				MtExcept.raise("view/QuickFormUtil.php::makeFormRule: mess\u30AD\u30FC\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044");
				throw die();
			}

			this.addRuleWrapper(name, mess, type, format, validation, reset, force);
		}
	}

	makeFormRulePack(H_rule: {} | any[], pref, post) {
		this.setJsWarningsWrapper(pref, post);
		this.makeFormRule(H_rule);
	}

	setRequiredNoteWrapper(note) {
		this.O_Form.setRequiredNote(note);
	}

	setJsWarningsWrapper(pref, post) {
		this.O_Form.setJsWarnings(pref, post);
	}

	setElementErrorWrapper(element, mess) {
		this.O_Form.setElementError(element, mess);
	}

	registerRuleWrapper(ruleName, type, data1, data2 = undefined) {
		this.O_Form.registerRule(ruleName, type, data1, data2);
	}

	registerOriginalRules(A_rule) {
		for (var name of Object.values(A_rule)) {
			this.registerRuleWrapper(name, undefined, name);
		}
	}

	addElementHierselect(H_Element) {
		var hierselect = this.O_Form.addElement("hierselect", H_Element.name, H_Element.label, H_Element.options, H_Element.separator);
		hierselect.setOptions(H_Element.data);
	}

	setDefaultWarningNote() {
		this.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
	}

	setDefaultWarningNoteEng() {
		this.setJsWarningsWrapper("Enter the following categories\n", "\nEnter correctly.");
		this.setRequiredNoteWrapper("<font color=red>\u203B required information</font>");
	}

	__destruct() {}

};