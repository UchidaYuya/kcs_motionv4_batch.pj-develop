//
//お問い合わせ　一覧
//
//更新履歴：<br>
//2008/08/27	石崎公久	作成
//
//@uses FAQViewBase
//@uses ViewFinish
//@uses QuickFormUtil
//@uses ArraySmarty
//@package FAQ
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//
//
//
//お問い合わせ　一覧
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@uses MtSession
//@package FAQ
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//

require("view/FAQ/FAQViewBase.php");

require("view/ViewFinish.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

//
//S_pub
//
//@var mixed
//@access protected
//
//
//O_Qf
//
//@var mixed
//@access private
//
//
//A_elements
//
//@var mixed
//@access protected
//
//
//A_rules
//
//@var mixed
//@access protected
//
//
//submitFlag
//
//@var mixed
//@access private
//
//
//fileErrorFlag
//
//@var mixed
//@access private
//
//
//__construct
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $H_navi
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
//setSubmitFlag
//
//@author ishizaki
//@since 2008/10/27
//
//@param mixed $submitFlag
//@access public
//@return void
//
//
//getAuthUser
//
//@author ishizaki
//@since 2008/08/27
//
//@access public
//@return void
//
//
//getAuthUser
//
//@author ishizaki
//@since 2008/08/27
//
//@access public
//@return void
//
//
//getFuncid
//
//@author ishizaki
//@since 2008/09/04
//
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
//checkCGIParam
//
//@author ishizaki
//@since 2008/09/05
//
//@access public
//@return void
//
//
//makeFormElements
//
//@author ishizaki
//@since 2008/09/05
//
//@access public
//@return void
//
//
//addFormElements
//
//@author ishizaki
//@since 2008/09/05
//
//@access protected
//@return void
//
//
//addFormRules
//
//@author ishizaki
//@since 2008/09/05
//
//@access protected
//@return void
//
//
//addDefaults
//
//@author ishizaki
//@since 2008/09/10
//
//@access protected
//@return void
//
//
//assignSmarty
//
//@author ishizaki
//@since 2008/09/05
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
//@return void
//
//
//displayHTML
//
//@author ishizaki
//@since 2008/08/01
//
//@access public
//@return void
//
//
//displayFinish
//
//@author ishizaki
//@since 2008/10/20
//
//@param mixed $comment
//@param mixed $url
//@param mixed $label
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
class InquiryBaseView extends FAQViewBase {
	static SUBMIT_VALUE = "\u767B\u9332";

	constructor(H_navi) {
		super(H_navi);
		this.O_Qf = new QuickFormUtil("form");
		this.submitFlag = false;
		this.fileErrorFlag = false;
		this.A_elements = Array();
		this.A_rules = Array();
	}

	getSubmitFlag() {
		return this.submitFlag;
	}

	setSubmitFlag(submitFlag) {
		this.submitFlag = submitFlag;
	}

	getAuthUser() {
		return this.O_Auth.getUserFuncId(this.gSess().userid, "all");
	}

	getAuthPact() {
		return this.O_Auth.getPactFuncid();
	}

	getFncid() {
		return this.Fncid;
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	checkCGIParam() {
		var temp = this.gSess().getSelf("POST");

		if (0 < _POST.length) {
			if (0 < _FILES.length) {
				for (var key in _FILES) //添付ファイルがある場合はファイルを/files以下に保存
				//添付のファイルサイズを取得
				{
					var value = _FILES[key];

					if (_FILES[key].name != "" && preg_match("/\\.(xls|xlt|csv|pdf|doc|ppt|zip|lzh|pgp|html|htm|text|txt|gif|jpg|jpeg)$/i", _FILES[key].name) == false) {
						return true;
					}

					if (_FILES[key].error == 2) {
						return true;
					}

					var getfile = pathinfo(_FILES[key].name);
					var tmpf_name = tempnam(KCS_DIR + "/files/", "FAQ" + this.shopid + "_");
					var f_name = tmpf_name + "." + getfile.extension;
					rename(tmpf_name, f_name);

					if (move_uploaded_file(_FILES[key].tmp_name, f_name) == true) {
						this.gSess().setSelf(key + "upfile", f_name);
						this.gSess().setSelf(key + "filestat", _FILES[key].error);
						var up_name = _FILES[key].name;
					} else //ファイル生成に失敗したらセッションからキーを消す
						{
							this.gSess().setSelf(key + "upfile", undefined);
						}

					var up_filesize = _FILES[key].size;

					if (up_filesize > 1024) {
						if (up_filesize > 1024 * 1024) {
							up_filesize = sprintf("%0.1f", up_filesize / (1024 * 1024)) + " Mbyte";
						} else {
							up_filesize = sprintf("%0.1f", up_filesize / 1024) + " Kbyte";
						}
					}

					this.gSess().setSelf(key, "filesize", up_filesize);
				}

				this.gSess().setSelf("FILES", _FILES);
			}

			var tempPost = _POST;

			if (!_POST.csrfid) {
				tempPost.csrfid = temp.csrfid;
			}

			this.gSess().setSelf("POST", tempPost);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		var H_post = this.gSess().getSelf("POST");

		if (InquiryBaseView.SUBMIT_VALUE == H_post.submit) {
			this.submitFlag = true;
		}
	}

	makeFormElements() {
		var H_SessPost = this.gSess().getSelf("POST");
		var csrfid = undefined;

		if (undefined !== H_SessPost.csrfid) {
			csrfid = H_SessPost.csrfid;
		} else {
			require("MtUniqueString.php");

			var O_unique = MtUniqueString.singleton();
			csrfid = O_unique.getNewUniqueId();
		}

		this.A_elements = [{
			name: "inquiryname",
			label: "\u30BF\u30A4\u30C8\u30EB",
			inputtype: "text",
			options: "size=50"
		}, {
			name: "contents",
			label: "\u304A\u554F\u3044\u5408\u308F\u305B\u306E\u5185\u5BB9",
			inputtype: "textarea",
			options: {
				cols: "65",
				rows: "15"
			}
		}, {
			name: "publiclevel",
			label: "\u4F1A\u793E\u5185\u3067\u516C\u958B",
			inputtype: "radio",
			data: {
				"0": ["\u516C\u958B\u3059\u308B"],
				"1": ["\u516C\u958B\u3057\u306A\u3044\uFF08\u203B\u7BA1\u7406\u8005\u306F\u4F8B\u5916\u3068\u306A\u308A\u307E\u3059\uFF09"]
			}
		}, {
			name: "csrfid",
			inputtype: "hidden",
			data: csrfid,
			options: {
				id: "csrfid"
			}
		}];

		if (false == (false == is_null(H_SessPost) && "\u78BA\u8A8D\u753B\u9762\u3078" == H_SessPost.submit)) {
			this.A_elements.push({
				name: "submit",
				label: "\u78BA\u8A8D\u753B\u9762\u3078",
				inputtype: "submit"
			});
		} else {
			this.A_elements.push({
				name: "submit",
				label: "\u767B\u9332",
				inputtype: "submit"
			});
			this.O_Qf.freezeWrapper();
			H_SessPost.submit = "";
			this.gSess().setSelf("POST", H_SessPost);
		}

		this.addFormElements();
		this.O_Qf.setFormElement(this.A_elements);
		var O_form = this.O_Qf.makeFormObject();
		this.O_Qf.setDefaultsWrapper({
			publiclevel: 0
		});

		if (false == is_null(H_SessPost)) {
			this.O_Qf.setDefaultsWrapper({
				inquiryname: stripslashes(H_SessPost.inquiryname)
			});
			this.O_Qf.setDefaultsWrapper({
				contents: stripslashes(H_SessPost.contents)
			});
			this.O_Qf.setDefaultsWrapper({
				publiclevel: stripslashes(H_SessPost.publiclevel)
			});
			this.addDefaults();
		} else if (undefined !== this.H_assign.formdefaults) {
			this.O_Qf.setDefaultsWrapper({
				inquiryname: this.H_assign.formdefaults.inquiryname
			});
			this.O_Qf.setDefaultsWrapper({
				contents: this.H_assign.formdefaults.contents
			});
			this.O_Qf.setDefaultsWrapper({
				publiclevel: this.H_assign.formdefaults.publiclevel
			});
			this.addDefaults();
		} else {
			this.O_Qf.setDefaultsWrapper({
				publiclevel: "0"
			});
			var temp = this.H_assign.InquiryDetail.length;

			if (0 < temp) {
				this.O_Qf.setDefaultsWrapper({
					inquiryname: "Re: " + this.H_assign.InquiryDetail[temp - 1].inquiryname
				});
			}
		}

		this.A_rules = [{
			name: "inquiryname",
			mess: "\u30BF\u30A4\u30C8\u30EB\u3092\u3054\u5165\u529B\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "contents",
			mess: "\u304A\u554F\u3044\u5408\u308F\u305B\u5185\u5BB9\u3092\u3054\u5165\u529B\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		}];
		this.addFormRules();

		for (var key in _FILES) {
			var value = _FILES[key];

			if (_FILES[key].name != "" && preg_match("/\\.(xls|xlt|csv|pdf|doc|ppt|zip|lzh|pgp|html|htm|text|txt|gif|jpg|jpeg)$/i", _FILES[key].name) == false) {
				this.O_Qf.setElementErrorWrapper(key, "\u8A31\u53EF\u3055\u308C\u3066\u3044\u306A\u3044\u30D5\u30A1\u30A4\u30EB\u306E\u7A2E\u985E\u306F\u6DFB\u4ED8\u3067\u304D\u307E\u305B\u3093");
			}

			if (_FILES[key].error == 2) {
				this.O_Qf.setElementErrorWrapper(key, "\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB\u306E\u6700\u5927\u30B5\u30A4\u30BA\u306F\uFF13MB\u307E\u3067\u3067\u3059");
			}
		}

		this.O_Qf.makeFormRule(this.A_rules);
		this.O_Qf.setDefaultWarningNote();
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	addFormElements() {}

	addFormRules() {}

	addDefaults() {}

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
	}

	displayHTML() {
		this.assignSmarty();
		this.get_Smarty().assign("Mode", this.Mode);
		this.get_Smarty().assign("php_self", _SERVER.php_self);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	displayFinish(comment, url, label) {
		this.gSess().clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish(comment, url, label);
	}

	__destruct() {
		super.__destruct();
	}

};