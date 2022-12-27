//
//管理項目設定のView
//
//更新履歴：<br>
//2008/03/17 宝子山浩平 作成
//2009/9/8 maeda 英語化対応
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/02/20
//@filesource
//@uses ManagementViewBase
//@uses MtExceptReload
//@uses HTML_QuickForm_Renderer_ArraySmarty
//@uses ViewFinish
//
//
//error_reporting(E_ALL);
//
//管理項目設定のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/17
//@uses ManagementViewBase
//@uses MtExceptReload
//@uses HTML_QuickForm_Renderer_ArraySmarty
//@uses ViewFinish
//

require("view/Management/ManagementViewBase.php");

require("view/ViewFinish.php");

//
//submitボタン名（入力画面用）
//
//
//submitボタン名（確認画面用）
//
//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/03/17
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//セッションが無い時デフォルト値を入れる
//
//最初のアクセス時のみ2重登録防止セッションを作る<br>
//
//@author houshiyama
//@since 2008/03/13
//
//@access private
//@return void
//
//
//前メーニュー共通のCGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//submitが実行されたら配列に入れる<br>
//リセットが実行されたら配列を消してリロード<br>
//
//配列をセッションに入れる<br>
//
//@author houshiyama
//@since 2008/03/13
//
//@access public
//@return void
//
//
//getTypes
//各管理項目で使用する項目の初期化(電話管理ではselectを使う、など)
//@author web
//@since 2019/01/25
//
//@param mixed $mid
//@access private
//@return void
//
//
//設定項目変更フォーム作成
//
//@author houshiyama
//@since 2008/03/18
//
//@param mixed $O_model
//@param mixed $H_sess
//@access public
//@return void
//
//
//ルールの追加を行う
//
//@author date
//@since 2014/12/02
//
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2008/03/13
//
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/03/07
//
//@access public
//@return void
//
//
//パラメータチェック <br>
//
//@author houshiyama
//@since 2008/03/18
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//Smartyを用いた画面表示<br>
//
//@author houshiyama
//@since 2008/03/03
//
//@param mixed $H_sess
//@param mixed $A_auth
//@access public
//@return void
//
//
//freeze処理をする <br>
//
//ボタン名の変更 <br>
//エラーチェックを外す <br>
//freezeする <br>
//
//@author houshiyama
//@since 2008/03/11
//
//@access public
//@return void
//
//
//freezeさせない時の処理 <br>
//
//ボタン名の変更 <br>
//
//@author houshiyama
//@since 2008/03/12
//
//@access public
//@return void
//
//
//セッション削除 <br>
//完了画面表示 <br>
//
//@author houshiyama
//@since 2008/03/13
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
class ManagementPropertyView extends ManagementViewBase {
	static NEXTNAME = "\u78BA\u8A8D\u753B\u9762\u3078";
	static NEXTNAME_ENG = "To confirmation screen";
	static RECNAME = "\u767B\u9332\u3059\u308B";
	static RECNAME_ENG = "Register";

	constructor() {
		super();
		this.title_msg = Array();
	}

	setDefaultSession() {}

	checkCGIParam() //submitが実行された時
	{
		this.setDefaultSession();

		if (undefined !== _POST.addsubmit == true) {
			delete this.H_Local.post;
			this.H_Local.post = _POST;
		}

		if (_POST.length > 0 && undefined !== _POST.addsubmit == false) //ポストの入力値は消す
			{
				this.O_Sess.clearSessionSelf();
				delete this.H_Local.post;
				this.H_Local.post.mid = _POST.mid;
				this.O_Sess.setSelfAll(this.H_Local);
				MtExceptReload.raise(undefined);
			}

		if (undefined !== _GET.r == true && 1 == _GET.r) {
			delete this.H_Local.post;
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}

		this.title_msg = Array();
		this.title_msg.cb_shop_edit = "\u30C1\u30A7\u30C3\u30AF\u3059\u308B\u3068\u3001\u8CA9\u58F2\u5E97\u306B\u3066\u4FEE\u6B63\u53EF\u80FD\u306A\u9805\u76EE\u306B\u306A\u308A\u307E\u3059";
		this.title_msg.cb_req = "\u30C1\u30A7\u30C3\u30AF\u3059\u308B\u3068\u3001\u5165\u529B\u5FC5\u9808\u306A\u9805\u76EE\u306B\u306A\u308A\u307E\u3059";
		this.title_msg.sort = "\u6CE8\u6587\u3084\u96FB\u8A71\u7BA1\u7406\u3067\u306E\u9805\u76EE\u306E\u8868\u793A\u9806\u306B\u6307\u5B9A\u304C\u3042\u308B\u5834\u5408\u306B\u6570\u5024\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
		this.O_Sess.setPub(ManagementPropertyView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);
	}

	getTypes(mid) //文字列
	//数値
	//日付
	//メール
	//URL
	//説明文
	//電話でのみ使う
	{
		if ("ENG" == _SESSION.language) {
			var text = "Text";
			var int = "Value";
			var date = "Date";
			var mail = "E-mail address";
			var select = "Pulldown";
			var description = "Description";
		} else {
			text = "\u6587\u5B57\u5217";
			int = "\u6570\u5024";
			date = "\u65E5\u4ED8";
			mail = "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9";
			select = "\u30D7\u30EB\u30C0\u30A6\u30F3";
			description = "\u8AAC\u660E\u6587";
		}

		var types = Array();
		types.text = {
			name: "text",
			max: 15,
			comment: text
		};
		types.int = {
			name: "int",
			max: 6,
			comment: int
		};
		types.date = {
			name: "date",
			max: 6,
			comment: date
		};
		types.mail = {
			name: "mail",
			max: 3,
			comment: mail
		};
		types.url = {
			name: "url",
			max: 3,
			comment: "URL"
		};
		types.description = {
			name: "description",
			max: 3,
			comment: description
		};

		if (mid == ManagementPropertyView.TELMID) //プルダウン
			{
				types.select = {
					name: "select",
					max: 10,
					comment: select
				};
			}

		return types;
	}

	makePropertyForm(O_model, H_sess) //表示言語設定
	//ヘルスケアは未対応なので消しとく
	//管理項目名の設定など。20190124 伊達
	//
	//ユニーク文字列生成用
	//クイックフォームオブジェクト生成
	{
		if ("ENG" == _SESSION.language) {
			var H_mid = O_model.getUsableManagementTypeEng();
			var mid = "Admin type";
			var cancel = "Cancel";
			var reset = "Reset";
			var back = "To entry screen";
		} else {
			H_mid = O_model.getUsableManagementType();
			mid = "\u7BA1\u7406\u7A2E\u5225";
			cancel = "\u30AD\u30E3\u30F3\u30BB\u30EB";
			reset = "\u30EA\u30BB\u30C3\u30C8";
			back = "\u5165\u529B\u753B\u9762\u3078";
		}

		delete H_mid[ManagementPropertyView.HEALTHMID];
		var A_formelement = [{
			name: "mid",
			label: mid,
			inputtype: "select",
			data: H_mid,
			options: {
				onChange: "document.form.submit();"
			}
		}];
		var types = this.getTypes(H_sess.SELF.post.mid);

		for (var key in types) {
			var value = types[key];

			for (var cnt = 1; cnt <= value.max; cnt++) //項目名称
			//以下、追加 20090624iga
			//販売店からの修正を可能とする
			//S178管理項目必須 20141028date
			//必須項目とする
			//S178管理項目必須 20141028date
			//必須項目とする
			//S225 管理情報項目名変更、機能追加 20201019 hanashima
			//S225 管理情報項目名変更、機能追加 20201019 hanashima
			{
				var name = value.name + cnt;
				var A_tmp = {
					name: name,
					label: value.comment + mb_convert_case(cnt, MB_CASE_UPPER),
					inputtype: "text",
					options: {
						id: name,
						size: "35"
					}
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "cb" + name,
					label: "",
					inputtype: "checkbox",
					options: {
						id: "co" + name,
						title: this.title_msg.cb_shop_edit
					}
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "cbreq" + name,
					label: "",
					inputtype: "checkbox",
					options: {
						id: "cbreq" + name,
						title: this.title_msg.cb_req
					}
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "sort" + name,
					label: "",
					inputtype: "text",
					options: {
						id: "sort" + name,
						maxlength: 2,
						size: 1,
						title: this.title_msg.sort
					}
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "cbreqorder" + name,
					label: "",
					inputtype: "checkbox",
					options: {
						id: "cbreqorder" + name,
						title: this.title_msg.cb_req_order
					}
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "cbhide" + name,
					label: "",
					inputtype: "checkbox",
					options: {
						id: "cbhide" + name,
						title: this.title_msg.cb_hide
					}
				};
				A_formelement.push(A_tmp);
			}
		}

		A_tmp = [{
			name: "addsubmit",
			label: ManagementPropertyView.NEXTNAME,
			inputtype: "submit"
		}, {
			name: "cancel",
			label: cancel,
			inputtype: "button",
			options: {
				onClick: "javascript:ask_cancel_topmenu()"
			}
		}, {
			name: "reset",
			label: reset,
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='?r=1'"
			}
		}, {
			name: "back",
			label: back,
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
			}
		}, {
			name: "recogpostid",
			label: "",
			inputtype: "hidden"
		}, {
			name: "recogpostname",
			label: "",
			inputtype: "hidden"
		}, {
			name: "flag",
			label: "",
			inputtype: "hidden"
		}];
		A_formelement = array_merge(A_formelement, A_tmp);
		var O_unique = MtUniqueString.singleton();

		if (!(undefined !== H_sess.SELF.post.uniqueid)) {
			A_tmp = {
				name: "uniqueid",
				inputtype: "hidden",
				data: O_unique.getNewUniqueId(),
				options: {
					id: "uniqueid"
				}
			};
			A_formelement.push(A_tmp);
		} else {
			A_tmp = {
				name: "uniqueid",
				inputtype: "hidden",
				data: H_sess.SELF.post.uniqueid,
				options: {
					id: "uniqueid"
				}
			};
			A_formelement.push(A_tmp);
		}

		this.H_View.O_PropertyFormUtil = new QuickFormUtil("form");
		this.H_View.O_PropertyFormUtil.setFormElement(A_formelement);
		this.O_PropertyForm = this.H_View.O_PropertyFormUtil.makeFormObject();
	}

	makePropertyRule(H_sess) //ルール追加
	{
		var H_rules = Array();
		var types = this.getTypes(H_sess.SELF.post.mid);

		if (H_sess.SELF.post.mid == ManagementPropertyView.TELMID) //プルダウン
			//ソートについて
			{
				if ("ENG" == _SESSION.language) {
					var title = "Pulldown";
					var mess = ": Format is incorrect.";
				} else {
					title = "\u30D7\u30EB\u30C0\u30A6\u30F3";
					mess = "\u306E\u66F8\u5F0F\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059";
				}

				for (var cnt = 1; cnt <= types.select.max; cnt++) {
					var rule = {
						name: "select" + cnt,
						mess: title + cnt + mess,
						type: "QRManagementPropertyFormatCheck",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					};
					H_rules.push(rule);
				}

				for (var key in types) {
					var value = types[key];

					for (cnt = 1;; cnt <= value.max; cnt++) {
						var name = value.name + cnt;
						rule = {
							name: "sort" + name,
							mess: value.comment + cnt + "\u306F\u6570\u5024\u3092\u3044\u308C\u3066\u304F\u3060\u3055\u3044",
							type: "numeric",
							format: undefined,
							validation: "client",
							reset: false,
							force: false
						};
						H_rules.push(rule);
					}
				}
			}

		if (H_rules.length > 0) //言語対応
			//登録
			{
				if ("ENG" == _SESSION.language) {
					this.H_View.O_PropertyFormUtil.setDefaultWarningNoteEng();
				} else {
					this.H_View.O_PropertyFormUtil.setDefaultWarningNote();
				}

				this.H_View.O_PropertyFormUtil.makeFormRule(H_rules);
			}
	}

	makePankuzuLinkHash() //表示言語設定
	{
		if ("ENG" == _SESSION.language) {
			var H_link = {
				"": "Renaming department information category names"
			};
		} else {
			H_link = {
				"": "\u7BA1\u7406\u60C5\u5831\u9805\u76EE\u540D\u5909\u66F4"
			};
		}

		return H_link;
	}

	getHeaderJS() {}

	checkParamError(H_sess, H_g_sess) {}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[]) //QuickFormとSmartyの合体
	//assign
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_PropertyForm.accept(O_renderer);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("postname", H_sess.SELF.post.recogpostname);
		this.get_Smarty().assign("css", this.getManagementCss(H_sess.SELF.post.mid));
		this.get_Smarty().assign("mid", H_sess.SELF.post.mid);
		this.get_Smarty().assign("title_msg", this.title_msg);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	freezeForm() {
		if ("ENG" == _SESSION.language) {
			this.H_View.O_PropertyFormUtil.updateElementAttrWrapper("addsubmit", {
				value: ManagementPropertyView.RECNAME_ENG
			});
		} else {
			this.H_View.O_PropertyFormUtil.updateElementAttrWrapper("addsubmit", {
				value: ManagementPropertyView.RECNAME
			});
		}

		this.H_View.O_PropertyFormUtil.updateAttributesWrapper({
			onsubmit: false
		});
		this.H_View.O_PropertyFormUtil.freezeWrapper();
	}

	unfreezeForm() {
		if ("ENG" == _SESSION.language) {
			this.H_View.O_PropertyFormUtil.updateElementAttrWrapper("addsubmit", {
				value: ManagementPropertyView.NEXTNAME_ENG
			});
		} else {
			this.H_View.O_PropertyFormUtil.updateElementAttrWrapper("addsubmit", {
				value: ManagementPropertyView.NEXTNAME
			});
		}
	}

	endPropertyView() //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	//表示言語設定
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();

		if ("ENG" == _SESSION.language) {
			O_finish.displayFinish("Renaming department information category names", "/Menu/menu.php", undefined, undefined, "ENG");
		} else {
			O_finish.displayFinish("\u7BA1\u7406\u60C5\u5831\u9805\u76EE\u540D\u5909\u66F4", "/Menu/menu.php");
		}
	}

	__destruct() {
		super.__destruct();
	}

};