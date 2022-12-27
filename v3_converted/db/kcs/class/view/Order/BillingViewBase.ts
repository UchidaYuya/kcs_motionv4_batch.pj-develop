//
//注文の請求先管理用ビューベース
//
//@uses ViewSmarty
//@package
//@author web
//@since 2013/03/22
//

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("model/PrefectureModel.php");

require("model/Order/BillingModelBase.php");

require("MtUniqueString.php");

//
//__construct
//
//@author web
//@since 2013/03/22
//
//@access public
//@return void
//
//
//setFormsLabel
//
//@author web
//@since 2013/03/28
//
//@access protected
//@return void
//
//
//都道府県一覧作成
//
//@author web
//@since 2013/04/05
//
//@access protected
//@return void
//
//
//請求先情報の入力フォーム作成
//
//@author web
//@since 2013/04/04
//
//@access public
//@return void
//
//
//入力制限作成
//
//@author web
//@since 2013/03/29
//
//@access public
//@return void
//
//
//getBillRules
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
//
//部署選択ルール作成
//
//@author web
//@since 2013/04/01
//
//@param mixed $rules
//@access public
//@return void
//
//
//getpostRules
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
//
//入力ルールをQuickFormに設定
//
//@author web
//@since 2013/03/29
//
//@param mixed $ruleList
//@access public
//@return void
//
//
//getForms
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
//
//setJsFile
//
//@author web
//@since 2013/04/02
//
//@param mixed $files
//@access public
//@return void
//
//
//assign
//
//@author web
//@since 2013/03/27
//
//@param mixed $key
//@param mixed $item
//@access public
//@return void
//
//
//画面描画
//
//@author web
//@since 2013/03/27
//
//@access public
//@return void
//
//
//getLocalSession
//
//@author web
//@since 2013/03/26
//
//@access public
//@return void
//
//
//処理進行状況取得
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
//
//endTemplate
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author web
//@since 2013/03/28
//
//@access protected
//@return void
//
//
//入力フォームをQuickFormにセット
//
//@author web
//@since 2013/03/28
//
//@access protected
//@return void
//
//
//assignBillView
//
//@author web
//@since 2013/04/09
//
//@access public
//@return void
//
//
//validate
//
//@author web
//@since 2013/03/29
//
//@access public
//@return void
//
//
//freeze
//
//@author web
//@since 2013/03/29
//
//@access public
//@return void
//
//
//初期値設定
//
//@author web
//@since 2013/04/03
//
//@access public
//@return void
//
//
//setModel
//
//@author web
//@since 2013/03/22
//
//@param mixed $model
//@access public
//@return void
//
//
//言語リストを取得
//
//@author web
//@since 2013/04/02
//
//@access public
//@return void
//
//
//getModel
//
//@author web
//@since 2013/03/22
//
//@access protected
//@return void
//
//
//CSRF用オブジェクト取得
//
//@author web
//@since 2013/04/11
//
//@access protected
//@return void
//
//
//CSRFバリデートのラッパー
//
//@author web
//@since 2013/04/11
//
//@access public
//@return void
//
//
//getNewCsrfId
//
//@author web
//@since 2013/04/11
//
//@access public
//@return void
//
//
//パンくずリンク設定
//
//@author web
//@since 2013/04/16
//
//@param mixed $list
//@access protected
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/03/22
//
//@access public
//@return void
//
class BillingViewBase extends ViewSmarty {
	static PUB = "/MTOrder";

	constructor(H_param = Array()) {
		this.O_Sess = MtSession.singleton();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.progress = 0;
		this.jsFiles = ["Order/bill.js"];
		this.langLists = {
			billname: {
				JPN: "\u8ACB\u6C42\u5148\u540D",
				ENG: "Account name",
				ERR: {
					required: {
						JPN: "\u8ACB\u6C42\u5148\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "\u8ACB\u6C42\u5148\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"
					}
				}
			},
			billpost: {
				JPN: "\u90E8\u7F72",
				ENG: "Department name",
				ERR: {
					required: {
						JPN: "\u8ACB\u6C42\u5148\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "\u8ACB\u6C42\u5148\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"
					}
				}
			},
			receiptname: {
				JPN: "\u53D7\u53D6\u4EBA\u540D",
				ENG: "Recipient name",
				ERR: {
					required: {
						JPN: "\u53D7\u53D6\u4EBA\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "\u53D7\u53D6\u4EBA\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"
					}
				}
			},
			zip1: {
				JPN: "\u90F5\u4FBF\u756A\u53F7",
				ENG: "Post Code",
				ERR: {
					required: {
						JPN: "\u90F5\u4FBF\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "\u90F5\u4FBF\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"
					},
					regex: {
						JPN: "\u90F5\u4FBF\u756A\u53F7\u306F\u534A\u89D2\u6570\u5B573\u6841\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "\u90F5\u4FBF\u756A\u53F7\u306F\u534A\u89D2\u6570\u5B573\u6841\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"
					}
				}
			},
			zip2: {
				JPN: "\u90F5\u4FBF\u756A\u53F7",
				ENG: "Post Code",
				ERR: {
					required: {
						JPN: "\u90F5\u4FBF\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "\u90F5\u4FBF\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"
					},
					regex: {
						JPN: "\u90F5\u4FBF\u756A\u53F7\u306F\u534A\u89D2\u6570\u5B574\u6841\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "\u90F5\u4FBF\u756A\u53F7\u306F\u534A\u89D2\u6570\u5B574\u6841\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"
					}
				}
			},
			addr1: {
				JPN: "\u90FD\u9053\u5E9C\u770C",
				ENG: "prefectures",
				ERR: {
					required: {
						JPN: "\u90FD\u9053\u5E9C\u770C\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "\u90FD\u9053\u5E9C\u770C\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
					}
				}
			},
			addr2: {
				JPN: "\u5E02\u533A\u753A\u6751\u756A\u5730",
				ENG: "Billing address",
				ERR: {
					required: {
						JPN: "\u5E02\u533A\u753A\u6751\u756A\u5730\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "\u5E02\u533A\u753A\u6751\u756A\u5730\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"
					}
				}
			},
			building: {
				JPN: "\u5EFA\u7269\u540D",
				ENG: "Building name"
			},
			billtel: {
				JPN: "\u9023\u7D61\u5148\u96FB\u8A71\u756A\u53F7",
				ENG: "Telephone number",
				ERR: {
					required: {
						JPN: "\u9023\u7D61\u5148\u96FB\u8A71\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "\u9023\u7D61\u5148\u96FB\u8A71\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"
					}
				}
			},
			billhow: {
				JPN: "\u652F\u6255\u3044\u65B9\u6CD5",
				ENG: "Payment",
				ERR: {
					required: {
						JPN: "\u652F\u6255\u3044\u65B9\u6CD5\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "\u652F\u6255\u3044\u65B9\u6CD5\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
					}
				},
				bank: {
					JPN: "\u9280\u884C\u632F\u8FBC(\u8ACB\u6C42\u66F8\u6255\u3044)",
					ENG: "Bank"
				},
				cash: {
					JPN: "\u73FE\u91D1",
					ENG: "Cash"
				},
				card: {
					JPN: "\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9\u6255\u3044",
					ENG: "Credit card"
				},
				misc: {
					JPN: "\u305D\u306E\u4ED6",
					ENG: "Other"
				}
			},
			defaultflg: {
				JPN: "\u6A19\u6E96\u306E\u8ACB\u6C42\u5148\u306B\u3059\u308B",
				ENG: "Default",
				ERR: {
					required: {
						JPN: "\u6A19\u6E96\u306E\u8ACB\u6C42\u5148\u3068\u3059\u308B\u304B\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "Please choose standard billing address."
					}
				},
				message: {
					add: {
						JPN: "(\u6A19\u6E96\u306E\u8ACB\u6C42\u5148\u306B\u3059\u308B\u5834\u5408\u3001\u30C1\u30A7\u30C3\u30AF\u3092\u5165\u308C\u3066\u304F\u3060\u3055\u3044)",
						ENG: "(When you chose a standard billing addres. please put in.)"
					},
					mod1: {
						JPN: "(\u6A19\u6E96\u8A2D\u5B9A\u306E\u89E3\u9664\u306F\u3067\u304D\u307E\u305B\u3093)",
						ENG: "(Default check cannot be canceled.)"
					},
					mod2: {
						JPN: "(\u6A19\u6E96\u8A2D\u5B9A\u3092\u6307\u5B9A\u3059\u308B\u3068\u3001\u65E2\u5B58\u306E\u6A19\u6E96\u8ACB\u6C42\u5148\u304C\u89E3\u9664\u3055\u308C\u307E\u3059)",
						ENG: "(If Choose a default check, existing default check is canceled.)"
					}
				}
			},
			postview: {
				JPN: "\u63B2\u8F09\u5148\u90E8\u7F72",
				ENG: "Aplly to Department code",
				ERR: {
					required: {
						JPN: "\u63B2\u8F09\u5148\u306E\u90E8\u7F72\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
						ENG: "Please choose Apply to department code"
					}
				}
			},
			next: {
				JPN: "\u6B21\u3078",
				ENG: "Next"
			},
			cancel: {
				JPN: "\u30AD\u30E3\u30F3\u30BB\u30EB",
				ENG: "Cancel"
			},
			before: {
				JPN: "\u4E00\u3064\u524D\u3078",
				ENG: "Before"
			},
			confirm: {
				JPN: "\u78BA\u8A8D",
				ENG: "Confirm"
			},
			regist: {
				JPN: "\u767B\u9332",
				ENG: "Regist"
			},
			selectdef: {
				JPN: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
				ENG: "--Please select--"
			},
			tableName: {
				JPN: "\u7AEF\u672B\u4EE3\u91D1\u8ACB\u6C42\u5148",
				ENG: "\u7AEF\u672B\u4EE3\u91D1\u8ACB\u6C42\u5148"
			},
			bcMenu: {
				JPN: "\u7AEF\u672B\u4EE3\u91D1\u8ACB\u6C42\u5148\u4E00\u89A7",
				ENG: "\u7AEF\u672B\u4EE3\u91D1\u8ACB\u6C42\u5148\u4E00\u89A7"
			},
			bcAdd: {
				JPN: "\u7AEF\u672B\u4EE3\u91D1\u8ACB\u6C42\u5148&nbsp;\u65B0\u898F\u767B\u9332",
				ENG: "\u7AEF\u672B\u4EE3\u91D1\u8ACB\u6C42\u5148&nbsp;\u65B0\u898F\u767B\u9332"
			},
			bcMod: {
				JPN: "\u7AEF\u672B\u4EE3\u91D1\u8ACB\u6C42\u5148&nbsp;\u7DE8\u96C6",
				ENG: "\u7AEF\u672B\u4EE3\u91D1\u8ACB\u6C42\u5148&nbsp;\u7DE8\u96C6"
			}
		};
		this.H_Dir = this.O_Sess.getPub(BillingViewBase.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	setFormsLabel() {
		this.setBillForms();
		return this;
	}

	makePrefecture() {
		var prefModel = new PrefectureModel();
		var prefList = prefModel.getPrefecture(this.gSess().language);
		prefList = {
			"": this.langLists.selectdef[this.gSess().language]
		} + prefList;
		return prefList;
	}

	setBillForms() {
		this.billForms = [["text", "billname", Array(), ""], ["text", "billpost", Array(), ""], ["text", "receiptname", Array(), ""], ["text", "zip1", ["maxlength=\"3\""], ""], ["text", "zip2", ["maxlength=\"4\""], ""], ["select", "addr1", this.makePrefecture(), ""], ["text", "addr2", Array(), ""], ["text", "building", Array(), ""], ["text", "billtel", Array(), ""], ["radio", "billhow", {
			bank: [this.langLists.billhow.bank[this.gSess().language], {
				id: "billbank"
			}],
			cash: [this.langLists.billhow.cash[this.gSess().language], {
				id: "billcash"
			}],
			card: [this.langLists.billhow.card[this.gSess().language], {
				id: "billcard"
			}],
			misc: [this.langLists.billhow.misc[this.gSess().language], {
				id: "billmisc"
			}]
		}, ""], ["checkbox", "defaultflg", {
			id: "defaultflg"
		}, "message"], ["groupcheckbox2", "postview", Array(), ""], ["submit", "next", Array(), ""], ["button", "cancel", {
			onclick: "javascript:ask_cancel('/MTOrder/billMenu.php')"
		}, ""], ["submit", "before", Array(), ""], ["submit", "confirm", Array(), ""], ["submit", "regist", Array(), ""], ["hidden", "csrfid", Array(), ""]];
		return this;
	}

	makeBillRules() {
		this.rules = {
			billname: [["required", this.langLists.billname.ERR.required[this.gSess().language], undefined, "client"]],
			billpost: [["required", this.langLists.billpost.ERR.required[this.gSess().language], undefined, "client"]],
			receiptname: [["required", this.langLists.receiptname.ERR.required[this.gSess().language], undefined, "client"]],
			zip1: [["required", this.langLists.zip1.ERR.required[this.gSess().language], undefined, "client"], ["regex", this.langLists.zip1.ERR.regex[this.gSess().language], "/^[0-9]{3}$/", "client"]],
			zip2: [["required", this.langLists.zip2.ERR.required[this.gSess().language], undefined, "client"], ["regex", this.langLists.zip2.ERR.regex[this.gSess().language], "/^[0-9]{4}$/", "client"]],
			addr1: [["required", this.langLists.addr1.ERR.required[this.gSess().language], undefined, "client"]],
			addr2: [["required", this.langLists.addr2.ERR.required[this.gSess().language], undefined, "client"]],
			billtel: [["required", this.langLists.billtel.ERR.required[this.gSess().language], undefined, "client"]],
			billhow: [["required", this.langLists.billhow.ERR.required[this.gSess().language], undefined, "client"]]
		};
		return this;
	}

	getBillRules() {
		return this.rules;
	}

	makePostRules(rules = undefined) {
		this.postRules = {
			postview: [["required", this.langLists.postview.ERR.required[this.gSess().language], undefined, "client"]]
		};
		return this;
	}

	getPostRules() {
		return this.postRules;
	}

	setRules(ruleList = undefined) {
		if (Array.isArray(ruleList)) {
			for (var formName in ruleList) {
				var rules = ruleList[formName];

				for (var rule of Object.values(rules)) {
					this.qForm.addRuleWrapper(formName, rule[1], rule[0], rule[2], rule[3]);
				}
			}
		}

		return this;
	}

	getForms() {
		return this.forms;
	}

	setJsFile(files = undefined) {
		if ("string" === typeof files) {
			this.jsFiles.push(files);
		}

		this.assign("H_jsfile", this.jsFiles);
	}

	assign(key, item) {
		this.get_Smarty().assign(key, item);
		return this;
	}

	displaySmarty() {
		var formRender = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.forms.accept(formRender);
		this.assign("form", formRender.toArray());
		this.setJsFile();
		this.setBreadCrumbs();
		var data = this.getLocalSession();

		if (undefined !== data.SELF.defaultflg) {
			this.assign("postview", "hidden");
		}

		if (!this.tplFile) {
			this.tplFile = this.getDefaultTemplate();
		}

		this.get_Smarty().display(this.tplFile);
		return this;
	}

	getLocalSession() {
		var result = {
			[BillingViewBase.PUB]: this.O_Sess.getPub(BillingViewBase.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return result;
	}

	getProgress() {
		if (0 != this.progress) {
			return this.progress;
		}

		this.progress = 0;

		if (undefined !== this.H_Local.regist) {
			this.progress = BillingModelBase.EXECUTE;
		} else if (undefined !== this.H_Local.confirm) {
			this.progress = BillingModelBase.CONFIRM;
		} else if (undefined !== this.H_Local.next) //$lSess = $this->gSess()->getSelfAll();
			//			$data = $this->getModel()->getBillData();
			//			$this->progress = BillingModelBase::POST;
			//			if (isset($lSess["defaultflg"])
			//			|| (isset($data["defaultflg"])
			//				&& $data["defaultflg"])) {
			//}
			{
				this.progress = BillingModelBase.CONFIRM;
			}

		if (undefined !== this.H_Local.before) {
			switch (this.progress) {
				case BillingModelBase.POST:
					this.progress = 0;
					break;

				case BillingModelBase.CONFIRM:
					this.progress = BillingModelBase.POST;
					break;
			}
		}

		delete this.H_Local.next;
		this.gSess().clearSessionKeySelf("next");
		delete this.H_Local.confirm;
		this.gSess().clearSessionKeySelf("confirm");
		delete this.H_Local.regist;
		this.gSess().clearSessionKeySelf("regist");
		delete this.H_Local.before;
		this.gSess().clearSessionKeySelf("before");
		this.assign("progress", this.progress);
		return this.progress;
	}

	endTemplate(tplFile) {
		delete this.H_Local;
		this.gSess().clearSessionSelf();
		this.writeLastForm();
		this.H_Local.registerd = true;
		this.gSess().setSelfAll(this.H_Local);
		this.tplFile = tplFile;
	}

	checkCGIParam() {
		this.H_Local = this.gSess().getSelfAll();

		for (var key in _POST) {
			var value = _POST[key];
			this.H_Local[key] = value;
		}

		for (var key in _GET) {
			var value = _GET[key];
			this.H_Local[key] = value;
		}

		this.gSess().setSelfAll(this.H_Local);
	}

	makeForms() {
		this.setFormsLabel();
		var forms = Array();
		var postTree = this.getModel().getPostTree();

		for (var post of Object.values(postTree)) {
			chkbox[post.postid] = post.postname;
		}

		for (var forms of Object.values(this.billForms)) {
			if ("radio" == forms[0]) {
				form.push({
					name: forms[1],
					label: this.langLists[forms[1]][this.gSess().language],
					inputtype: forms[0],
					data: forms[2]
				});
			} else if ("select" == forms[0]) {
				form.push({
					name: forms[1],
					label: this.langLists[forms[1]][this.gSess().language],
					inputtype: forms[0],
					data: forms[2]
				});
			} else if ("groupcheckbox2" == forms[0]) {
				form.push({
					name: forms[1],
					label: this.langLists[forms[1]][this.gSess().language],
					inputtype: forms[0],
					data: chkbox
				});
			} else {
				form.push({
					name: forms[1],
					label: this.langLists[forms[1]][this.gSess().language],
					inputtype: forms[0],
					options: forms[2]
				});
			}

			if ("message" == forms[3]) {
				if (undefined !== this.langLists[forms[1]][forms[3]][this.gSess().language]) {
					this.assign(forms[1] + "mes", this.langLists[forms[1]][forms[3]][this.gSess().language]);
				} else {
					{
						let _tmp_0 = this.langLists[forms[1]][forms[3]];

						for (var key in _tmp_0) {
							var mes = _tmp_0[key];

							if (undefined !== mes[this.gSess().language]) {
								this.assign(forms[1] + key + "mes", mes[this.gSess().language]);
							}
						}
					}
				}
			}
		}

		this.qForm = new QuickFormUtil("qform");
		this.qForm.setFormElement(form);
		this.forms = this.qForm.makeFormObject();
		this.setRules(this.makeBillRules().getBillRules());
		return this;
	}

	assignBillView() {
		this.getSetting().loadConfig("order");
		var billView = false;

		if (this.getSetting().existsKey("order_billing_select")) {
			var billgrp = this.getSetting().order_billing_select;
			var billGroup = billgrp.split(",");

			if (-1 !== billGroup.indexOf(this.gSess().groupid)) {
				billView = true;
			}
		}

		this.assign("billView", billView);
		return billView;
	}

	validate() {
		if (0 != this.progress) {
			var result = this.qForm.validateWrapper();

			if (!result) //一つ前に戻す(現在の画面を維持する)
				{
					this.assign("progress", --this.progress);
				}

			return result;
		}

		return false;
	}

	freeze() {
		this.qForm.freezeWrapper();
		return this;
	}

	setDefaults(value, filter = undefined) {
		var lSess = this.gSess().getSelfAll();

		if (Array.isArray(lSess)) {
			for (var key in lSess) {
				var val = lSess[key];

				if (undefined !== value[key] || "csrfid" == key) {
					value[key] = val;
				}
			}
		}

		if (BillingModelBase.EXECUTE != this.getProgress() && BillingModelBase.CONFIRM != this.getProgress()) {
			value.csrfid = this.getNewCsrfId().csrfid;
		}

		this.forms.setConstants(value);
		return this;
	}

	setModel(model) {
		if ("object" === typeof model) {
			this.model = model;
		}

		return this;
	}

	getLangLists(path = undefined) {
		if (is_null(path)) {
			return this.langLists;
		} else {
			if ("string" === typeof path) {
				path = [path];
			}

			for (var key of Object.values(path)) {
				if (!(undefined !== temp[key])) {
					if (undefined !== this.langLists[key]) {
						var temp = this.langLists[key];
						continue;
					}
				} else {
					temp = temp[key];
				}
			}

			return temp;
		}
	}

	getModel() {
		return this.model;
	}

	getUniqueObject() {
		if (!this.uniqueObject instanceof MtUniqueString) {
			this.uniqueObject = MtUniqueString.singleton();
		}

		return this.uniqueObject;
	}

	csrfValidate() {
		var lSess = this.gSess().getSelfAll();
		this.getUniqueObject().validate(lSess.csrfid);
	}

	getNewCsrfId() {
		this.csrfid = this.getUniqueObject().getNewUniqueId();
		return this;
	}

	assignBreadCrumbs(list) {
		require("MtUtil.php");

		var util = new MtUtil();

		if ("ENG" == this.gSess().language) {
			this.assign("page_path", util.getPankuzuLinkEng(list, "user"));
		} else {
			this.assign("page_path", util.getPankuzuLink(list, "user"));
		}
	}

	__destruct() {
		super.__destruct();
	}

};