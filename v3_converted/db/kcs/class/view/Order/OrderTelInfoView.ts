//
//電話詳細情報表示View
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
//電話詳細情報表示View
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/17
//@uses MtSetting
//@uses MtSession
//

require("view/Order/OrderFormView.php");

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
//電話詳細情報入力フォーム要素作成
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_telproperty
//@param int $telcount
//@param mixed $H_items
//@param text $language
//@access public
//@return array
//
//
//電話詳細情報入力フォーム要素作成
//
//@author date
//@since 2014/10/28
//
//@param mixed $H_telproperty
//@param int $telcount
//@param mixed $H_items
//@param text $language
//@access public
//@return array
//
//
//必須項目を入力せずにマスクした際に表示する警告文の取得
//
//@author date
//@since 2014/11/12
//
//@param language
//@param name
//@access public
//@return string
//
//
//電話詳細情報入力フォーム要素作成
//
//@author date
//@since 2014/10/28
//
//@param mixed $H_telproperty
//@param int $telcount
//@param mixed $H_items
//@param text $language
//@access public
//@return array
//
//
//電話情報をフォームに合致するよう整形
//
//@author miyazawa
//@since 2008/06/11
//
//@access public
//@param mixed $H_telinfo
//@return array
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
class OrderTelInfoView extends OrderFormView {
	constructor() {
		super();
	}

	makeTelInfoForm(H_telproperty: {} | any[], telcount = 1, language = "JPN") {
		var H_telitems = Array();
		var H_telitemrules = Array();

		if ("ENG" == language) {
			var mail_mess = ": Invalid E-mail address format.";
			var int_mess = ": Enter in single-byte characters.";
			var date_mess = ": Date is invalid.";
			var mail_n_mess = ": E-mail address format is invalid.";
		} else {
			mail_mess = "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u66F8\u5F0F\u304C\u9055\u3044\u307E\u3059";
			int_mess = "\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
			date_mess = "\u306E\u65E5\u4ED8\u304C\u7121\u52B9\u3067\u3059";
			mail_n_mess = "\u306E\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u66F8\u5F0F\u304C\u9055\u3044\u307E\u3059";
		}

		for (var i = 0; i < telcount; i++) {
			H_telitemrules.push({
				name: "mail_" + i,
				mess: mail_mess,
				type: "email",
				format: undefined,
				validation: "client",
				reset: false,
				force: false
			});

			for (var name in H_telproperty) {
				var title = H_telproperty[name];

				if (preg_match("/^text|^url/", name) == true) {
					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "text",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							size: 30
						})
					});
				} else if (preg_match("/^int/", name) == true) {
					H_telitemrules.push({
						name: name + "_" + i,
						mess: title + int_mess,
						type: "numeric",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					});
					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "text",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							maxlength: 9
						})
					});
				} else if (preg_match("/^date/", name) == true) {
					H_telitemrules.push({
						name: name + "_" + i,
						mess: title + date_mess,
						type: "QRCheckDate",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					});
					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "date",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							minYear: "1985",
							maxYear: date("Y") + 11,
							addEmptyOption: true,
							format: "Y \u5E74 m \u6708 d \u65E5"
						})
					});
				} else if (preg_match("/^mail[0-9]+/", name) == true) {
					H_telitemrules.push({
						name: name + "_" + i,
						mess: title + mail_n_mess,
						type: "email",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					});
					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "text",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							size: 30
						})
					});
				}
			}
		}

		return [H_telitems, H_telitemrules];
	}

	makeTelInfoForm2(H_telproperty: {} | any[], telcount = 1, language = "JPN", H_sess = undefined) {
		var H_telitems = Array();
		var H_telitemrules = Array();

		if ("ENG" == language) {
			var mail_mess = ": Invalid E-mail address format.";
			var int_mess = ": Enter in single-byte characters.";
			var date_mess = ": Date is invalid.";
			var mail_n_mess = ": E-mail address format is invalid.";
			var required_mess = ": Please enter.";
			var required_select_mess = ":Please select.";
		} else {
			mail_mess = "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u66F8\u5F0F\u304C\u9055\u3044\u307E\u3059";
			int_mess = "\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
			date_mess = "\u306E\u65E5\u4ED8\u304C\u7121\u52B9\u3067\u3059";
			mail_n_mess = "\u306E\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u66F8\u5F0F\u304C\u9055\u3044\u307E\u3059";
			required_mess = "\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
			required_select_mess = "\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
		}

		for (var i = 0; i < telcount; i++) {
			H_telitemrules.push({
				name: "mail_" + i,
				mess: mail_mess,
				type: "email",
				format: undefined,
				validation: "client",
				reset: false,
				force: false
			});

			for (var name in H_telproperty) //$required = $value['requiredflg'];
			//S225 hanashima 20201023
			//S225 hanashima 20201023
			{
				var value = H_telproperty[name];
				var title = value.colname;
				var required = value.ordrequiredflg;

				if (preg_match("/^text|^url|^description/", name) == true) {
					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "text",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							size: 30
						})
					});

					if (required == true) {
						H_telitemrules.push({
							name: name + "_" + i,
							mess: title + required_mess,
							type: "required",
							format: undefined,
							validation: "client",
							reset: false,
							force: false
						});
					}
				} else if (preg_match("/^int/", name) == true) {
					H_telitemrules.push({
						name: name + "_" + i,
						mess: title + int_mess,
						type: "numeric",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					});

					if (required == true) {
						H_telitemrules.push({
							name: name + "_" + i,
							mess: title + required_mess,
							type: "required",
							format: undefined,
							validation: "client",
							reset: false,
							force: false
						});
					}

					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "text",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							maxlength: 9
						})
					});
				} else if (preg_match("/^date/", name) == true) {
					H_telitemrules.push({
						name: name + "_" + i,
						mess: title + date_mess,
						type: "QRCheckDate",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					});

					if (required == true) {
						H_telitemrules.push({
							name: name + "_" + i,
							mess: title + required_mess,
							type: "required",
							format: undefined,
							validation: "client",
							reset: false,
							force: false
						});
						H_telitemrules.push({
							name: name + "_" + i,
							mess: title + required_mess,
							type: "QRCheckDateEmptyYMD",
							format: undefined,
							validation: "client",
							reset: false,
							force: false
						});
					}

					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "date",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							minYear: "1985",
							maxYear: date("Y") + 11,
							addEmptyOption: true,
							format: "Y \u5E74 m \u6708 d \u65E5"
						})
					});
				} else if (preg_match("/^mail[0-9]+/", name) == true) {
					H_telitemrules.push({
						name: name + "_" + i,
						mess: title + mail_n_mess,
						type: "email",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					});

					if (required == true) {
						H_telitemrules.push({
							name: name + "_" + i,
							mess: title + required_mess,
							type: "required",
							format: undefined,
							validation: "client",
							reset: false,
							force: false
						});
					}

					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "text",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							size: 30
						})
					});
				} else if (preg_match("/^select/", name) == true) {
					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "select",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							size: 30
						})
					});

					if (required == true) {
						var temp = title.split(":");
						H_telitemrules.push({
							name: name + "_" + i,
							mess: temp[0] + required_select_mess,
							type: "required",
							format: undefined,
							validation: "client",
							reset: false,
							force: false
						});
					}
				}
			}
		}

		return [H_telitems, H_telitemrules];
	}

	getRuleMessageForMask(language, name, type = "text") {
		if ("ENG" == langauge) {
			switch (type) {
				case "text":
					var tail = "enter.";
					break;

				case "select":
					tail = "select.";
					break;

				default:
					tail = "enter.";
					break;
			}
		} else {
			switch (type) {
				case "text":
					tail = " \u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
					break;

				case "select":
					tail = " \u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
					break;

				default:
					tail = " \u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
					break;
			}
		}

		if ("ENG" == language) {
			return "For mask " + name + ",please " + tail;
		}

		return name + "\u3092\u30DE\u30B9\u30AF\u3059\u308B\u5834\u5408\u306F\u3001" + name + tail;
	}

	makeTelInfoFormForTemplate(H_telproperty: {} | any[], telcount = 1, language = "JPN") {
		var H_telitems = Array();
		var H_telitemrules = Array();

		if ("ENG" == language) {
			var mail_mess = ": Invalid E-mail address format.";
			var int_mess = ": Enter in single-byte characters.";
			var date_mess = ": Date is invalid.";
			var mail_n_mess = ": E-mail address format is invalid.";
		} else {
			mail_mess = "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u66F8\u5F0F\u304C\u9055\u3044\u307E\u3059";
			int_mess = "\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
			date_mess = "\u306E\u65E5\u4ED8\u304C\u7121\u52B9\u3067\u3059";
			mail_n_mess = "\u306E\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u66F8\u5F0F\u304C\u9055\u3044\u307E\u3059";
		}

		for (var i = 0; i < telcount; i++) {
			H_telitemrules.push({
				name: "mail_" + i,
				mess: mail_mess,
				type: "email",
				format: undefined,
				validation: "client",
				reset: false,
				force: false
			});

			for (var name in H_telproperty) {
				var value = H_telproperty[name];
				var title = value.colname;
				var required = value.requiredflg;

				if (preg_match("/^text|^url/", name) == true) {
					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "text",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							size: 30
						})
					});

					if (required == true) {
						H_telitemrules.push({
							name: name + "_" + i,
							mess: this.getRuleMessageForMask(language, title),
							type: "CheckboxCompare",
							format: "mask[" + name + "]",
							validation: "client",
							reset: false,
							force: false
						});
					}
				} else if (preg_match("/^int/", name) == true) {
					H_telitemrules.push({
						name: name + "_" + i,
						mess: this.getRuleMessageForMask(language, title),
						type: "numeric",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					});

					if (required == true) {
						H_telitemrules.push({
							name: name + "_" + i,
							mess: this.getRuleMessageForMask(language, title),
							type: "CheckboxCompare",
							format: "mask[" + name + "]",
							validation: "client",
							reset: false,
							force: false
						});
					}

					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "text",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							maxlength: 9
						})
					});
				} else if (preg_match("/^date/", name) == true) {
					H_telitemrules.push({
						name: name + "_" + i,
						mess: title + date_mess,
						type: "QRCheckDate",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					});

					if (required == true) {
						H_telitemrules.push({
							name: name + "_" + i,
							mess: this.getRuleMessageForMask(language, title),
							type: "CheckboxCompareDateEmptyYMD",
							format: "mask[" + name + "]",
							validation: "client",
							reset: false,
							force: false
						});
					}

					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "date",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							minYear: "1985",
							maxYear: date("Y") + 11,
							addEmptyOption: true,
							format: "Y \u5E74 m \u6708 d \u65E5"
						})
					});
				} else if (preg_match("/^mail[0-9]+/", name) == true) {
					H_telitemrules.push({
						name: name + "_" + i,
						mess: title + mail_n_mess,
						type: "email",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					});

					if (required == true) {
						H_telitemrules.push({
							name: name + "_" + i,
							mess: this.getRuleMessageForMask(language, title),
							type: "CheckboxCompare",
							format: "mask[" + name + "]",
							validation: "client",
							reset: false,
							force: false
						});
					}

					H_telitems.push({
						itemname: title,
						itemgrade: 0,
						inputtype: "text",
						inputname: name + "_" + i,
						inputdef: "",
						usertype: "all",
						property: serialize({
							size: 30
						})
					});
				} else if (preg_match("/^select/", name) == true) //雛形の必須チェック追加 20150130 date
					{
						H_telitems.push({
							itemname: title,
							itemgrade: 0,
							inputtype: "select",
							inputname: name + "_" + i,
							inputdef: "",
							usertype: "all",
							property: serialize({
								size: 30
							})
						});

						if (required == true) {
							var select_title = title.split(":");
							H_telitemrules.push({
								name: name + "_" + i,
								mess: this.getRuleMessageForMask(language, select_title[0], "select"),
								type: "CheckboxCompare",
								format: "mask[" + name + "]",
								validation: "client",
								reset: false,
								force: false
							});
						}
					}
			}
		}

		return [H_telitems, H_telitemrules];
	}

	separateTelInfo(H_telinfo: {} | any[]) {
		var H_separated_telinfo = Array();

		for (var key in H_telinfo) {
			var val = H_telinfo[key];
			var cnt = str_replace("telno", "", key);

			for (var val_key in val) {
				var val_val = val[val_key];
				H_separated_telinfo[val_key + "_" + cnt] = val_val;
			}
		}

		return H_separated_telinfo;
	}

	__destruct() {
		super.__destruct();
	}

};