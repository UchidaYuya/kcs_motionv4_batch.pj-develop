//
//管理情報一覧の基底クラス
//
//更新履歴：<br>
//2008/02/20 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/02/20
//@filesource
//@uses ManagementViewBase
//@uses MtExceptReload
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//error_reporting(E_ALL);
//
//管理情報一覧の基底クラス
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/02/20
//@uses ManagementViewBase
//@uses MtExceptReload
//@uses HTML_QuickForm_Renderer_ArraySmarty
//

require("view/Management/ManagementViewBase.php");

//
//ヘッダーフォームオブジェクト
//
//@var mixed
//@access protected
//
//
//検索フォームオブジェクト
//
//@var mixed
//@access private
//
//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/03/03
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//セッションが無い時デフォルト値を入れる
//
//年月セッションが無ければ作る（デフォルトは今月）<br>
//カレント部署がセッションが無ければ作る（デフォルトは自部署）<br>
//セッションのカレント部署とこのページのカレント部署が違っていたら同期してリロード
//部署の絞込条件セッションが無ければ作る（デフォルトは対象部署のみ）<br>
//表示件数セッションが無ければ作る（デフォルトは10）<br>
//ソート条件セッションが無ければ作る（デフォルトは部署降順）<br>
//検索条件がセッションに無ければ作る（デフォルトはAND）<br>
//カレントページがセッションに無ければ作る<br>
//
//@author houshiyama
//@since 2008/03/04
//
//@access private
//@return void
//
//
//各ページ固有のsetDefaultSession
//
//@author houshiyama
//@since 2008/03/10
//
//@abstract
//@access protected
//@return void
//
//
//メーニュー画面共通のCGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//表示年月の変更がされたら配列に入れる <br>
//部署の絞込み条件が変更されたら配列に入れる<br>
//部署選択がされたら配列に入れる <br>
//フリーワード検索が実行されたらフリーワードを配列に入れる<br>
//フリーワード検索リセットが実行されたらフリーワードを消す<br>
//表示件数が変更されたら配列に入れるCookieも書き換える） <br>
//ソート条件が変更されたら配列に入れる<br>
//検索が実行されたら配列に入れる<br>
//カレントページが変更されたら配列に入れる<br>
//
//ページが指定された時以外はページを１に戻す<br>
//配列をセッションに入れる<br>
//
//@author houshiyama
//@since 2008/02/22
//
//@access public
//@return void
//@uses MtExceptReload
//
//
//各ページ（管理）固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/03/03
//
//@abstract
//@access protected
//@return void
//
//
//header部分のフォームを作成する<br>
//
//表示部署のタイプ配列を生成<br>
//管理情報共通フォーム用の配列を作成<br>
//管理情報共通フォーム用のオブジェクトを生成<br>
//
//@author houshiyama
//@since 2008/02/21
//
//@param $O_manage（関数集オブジェクト）
//@access public
//@return void
//@uses QuickFormUtil
//
//
//一覧の検索フォームを作成する抽象メソッド<br>
//
//@author houshiyama
//@since 2008/02/21
//
//@param array $H_sess
//@param array $A_post
//@param mixed $O_manage
//@param mixed $O_model
//@access public
//@return void
//
//
//検索フォームのルール作成
//
//@author houshiyama
//@since 2008/04/08
//
//@access public
//@return void
//
//
//文字列、数値、日付項目の検索フォームを作成 <br>
//日付条件の配列を生成<br>
//日付型のフォーマット配列を生成<br>
//
//@author houshiyama
//@since 2008/03/25
//
//@param mixed $O_form
//@param mixed $H_prop
//@param object $O_manage
//@access protected
//@return void
//
//
//ユーザ設定項目のルール作成
//
//@author houshiyama
//@since 2008/11/19
//
//@param mixed $O_form
//@param mixed $H_prop
//@param mixed $O_manage
//@access protected
//@return void
//
//
//パンくずリンクを作成し返す
//
//@author houshiyama
//@since 2008/03/03
//
//@param object $O_manage
//@protected
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/03/07
//
//@abstract
//@access public
//@return void
//
//
//配下のセッション消し
//
//@author houshiyama
//@since 2008/03/14
//
//EV対応 2010/07/20 s.maeda
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
//ヘッダーフォームのデフォルト値を作成
//
//@author houshiyama
//@since 2008/03/06
//
//@param mixed $H_sess
//@access protected
//@return array
//
//
//検索フォームのデフォルト値を作成
//
//@author houshiyama
//@since 2009/03/10
//
//@param array $H_sess
//@access public
//@return void
//
//
//検索フォームの表示・非表示を返す
//
//@author houshiyama
//@since 2008/03/07
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//検索に入力された拡張項目を画面表示する為の配列生成
//
//@author houshiyama
//@since 2008/03/28
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//管理が唯一ならばタブを出さずにそのページへ移動する <br>
//全て一覧のみ継承で使用する <br>
//
//@author houshiyama
//@since 2008/04/04
//
//@param mixed $A_auth
//@access public
//@return void
//
//
//権限一覧から管理系の閲覧権限のみを取り出す
//
//@author houshiyama
//@since 2008/04/04
//
//@param mixed $A_auth
//@access public
//@return void
//
//
//Smartyを用いた画面表示<br>
//
//QuickFormとSmartyを合体<br>
//各データをSmartyにassign<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/02/20
//
//@param array $H_sesstion（CGIパラメータ）
//@param array $A_data（一覧データ）
//@param array $A_auth（権限一覧）
//@param array $O_manage（関数集オブジェクト）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//各ページ（管理）固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/03/03
//
//@protected
//@access protected
//@return void
//
//
//エラー表示
//
//@author houshiyama
//@since 2009/08/21
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
class ManagementMenuViewBase extends ManagementViewBase {
	constructor() {
		super();
	}

	setDefaultSession() //年月セッションが無ければ作る
	{
		if (undefined !== this.H_Dir.cym == false) {
			this.H_Dir.cym = this.YM;
		}

		if (undefined !== this.H_Dir.current_postid == false) {
			this.H_Dir.current_postid = _SESSION.current_postid;
		}

		if (_SESSION.current_postid != this.H_Dir.current_postid) {
			this.O_Sess.setGlobal("current_postid", this.H_Dir.current_postid);
			MtExceptReload.raise(undefined);
		}

		if (undefined !== this.H_Dir.posttarget == false) {
			this.H_Dir.posttarget = 1;
		}

		if (undefined !== this.H_Local.limit == false) //クッキーに表示件数があればそれを使う
			{
				if (undefined !== _COOKIE.management_limit == true) {
					this.H_Local.limit = _COOKIE.management_limit;
				} else {
					this.H_Local.limit = 10;
				}
			}

		if (undefined !== this.H_Local.sort == false) {
			this.H_Local.sort = "0,a";
		}

		if (undefined !== this.H_Local.post.search_condition == false) {
			this.H_Local.post.search_condition = "AND";
		}

		if (undefined !== this.H_Local.offset == false) {
			this.H_Local.offset = 1;
		}

		this.setDefaultSessionPeculiar();
	}

	checkCGIParam() //年月の変更が実行された時
	//ページが変更された時
	//ページ変更以外はページを１に戻す
	//getパラメータは消す
	{
		this.setDefaultSession();

		if (undefined !== _GET.ym == true && is_numeric(_GET.ym) == true) {
			this.H_Dir.cym = _GET.ym;
		}

		if (undefined !== _GET.pid == true && is_numeric(_GET.pid) == true) {
			this.H_Dir.current_postid = _GET.pid;
			this.O_Sess.setGlobal("current_postid", _GET.pid);
		}

		if (undefined !== _POST.viewchange == true) {
			this.H_Dir.posttarget = _POST.posttarget;
		}

		if (undefined !== _POST.freesearch == true) {
			this.H_Dir.freeword = _POST.freeword;
		}

		if (undefined !== _POST.freereset == true) {
			delete _POST.freeword;
			this.H_Dir.freeword = "";
		}

		if (undefined !== _POST.view == true) {
			if (is_numeric(_POST.limit) == true && _POST.limit > 0 && preg_match("/\\./", _POST.limit) == false) //クッキーセット
				{
					this.H_Local.limit = _POST.limit;
					setcookie("management_limit", _POST.limit, mktime(0, 0, 0, 12, 31, 2020));
				} else {
				this.H_Local.limit = 10;
				this.O_Sess.setSelfAll(this.H_Local);
				MtExceptReload.raise(undefined);
			}
		}

		if (undefined !== _GET.s == true) {
			this.H_Local.sort = _GET.s;
		}

		if (undefined !== _POST.search == true) {
			this.H_Local.post = _POST;
		} else {
			delete this.H_Local.post.search;
		}

		if (undefined !== _GET.p == true) {
			this.H_Local.offset = _GET.p;
		}

		this.checkCGIParamPeculiar();

		if ((_POST.length > 0 || _GET.length > 0) && undefined !== _GET.p == false) {
			this.H_Local.offset = 1;
		}

		this.O_Sess.setPub(ManagementMenuViewBase.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	makeHeaderForm(O_manage: ManagementUtil) //表示言語分岐
	//クイックフォームオブジェクト生成
	{
		if (this.O_Sess.language == "ENG") //表示部署のタイプ配列を生成
			//フォーム要素の配列作成
			{
				var H_posttarget = O_manage.getHashPostTargetEng();
				var A_formelement = [{
					name: "posttarget",
					label: "Department refinement",
					inputtype: "radio",
					options: {
						id: "posttarget"
					},
					data: H_posttarget
				}, {
					name: "viewchange",
					label: "Change",
					inputtype: "submit"
				}, {
					name: "freeword",
					label: "Search within admin information",
					inputtype: "text",
					options: {
						id: "freeword"
					}
				}, {
					name: "freesearch",
					label: "Search",
					inputtype: "submit"
				}, {
					name: "freereset",
					label: "Reset",
					inputtype: "submit"
				}, {
					name: "limit",
					label: "Limit view",
					inputtype: "text",
					options: {
						size: "3",
						maxlength: "3"
					}
				}, {
					name: "view",
					label: "Display",
					inputtype: "submit"
				}, {
					name: "move",
					label: "Shift",
					inputtype: "button",
					options: {
						onClick: "javascript:gotoMovePage();"
					}
				}, {
					name: "send_mail",
					label: "\u30E1\u30FC\u30EB\u9001\u4FE1",
					inputtype: "button",
					options: {
						onClick: "javascript:gotoSendMail();"
					}
				}, {
					name: "delete",
					label: "Delete",
					inputtype: "button",
					options: {
						onClick: "javascript:gotoDeletePage();"
					}
				}, {
					name: "back",
					label: "Back",
					inputtype: "button",
					options: {
						onClick: "javascript:location.href='/Menu/menu.php';"
					}
				}];
			} else //表示部署のタイプ配列を生成
			//フォーム要素の配列作成
			{
				H_posttarget = O_manage.getHashPostTarget();
				A_formelement = [{
					name: "posttarget",
					label: "\u90E8\u7F72\u7D5E\u8FBC",
					inputtype: "radio",
					options: {
						id: "posttarget"
					},
					data: H_posttarget
				}, {
					name: "viewchange",
					label: "\u5909\u66F4",
					inputtype: "submit"
				}, {
					name: "freeword",
					label: "\u7BA1\u7406\u60C5\u5831\u5185\u691C\u7D22",
					inputtype: "text",
					options: {
						id: "freeword"
					}
				}, {
					name: "freesearch",
					label: "\u691C\u7D22",
					inputtype: "submit"
				}, {
					name: "freereset",
					label: "\u30EA\u30BB\u30C3\u30C8",
					inputtype: "submit"
				}, {
					name: "limit",
					label: "\u8868\u793A\u4EF6\u6570",
					inputtype: "text",
					options: {
						size: "3",
						maxlength: "3"
					}
				}, {
					name: "view",
					label: "\u8868\u793A",
					inputtype: "submit"
				}, {
					name: "move",
					label: "\u79FB\u52D5\u3059\u308B",
					inputtype: "button",
					options: {
						onClick: "javascript:gotoMovePage();"
					}
				}, {
					name: "send_mail",
					label: "\u30E1\u30FC\u30EB\u9001\u4FE1",
					inputtype: "button",
					options: {
						onClick: "javascript:gotoSendMail();"
					}
				}, {
					name: "delete",
					label: "\u524A\u9664\u3059\u308B",
					inputtype: "button",
					options: {
						onClick: "javascript:gotoDeletePage();"
					}
				}, {
					name: "back",
					label: "\u623B\u308B",
					inputtype: "button",
					options: {
						onClick: "javascript:location.href='/Menu/menu.php';"
					}
				}];
			}

		this.H_View.O_HeaderFormUtil = new QuickFormUtil("headerform");
		this.H_View.O_HeaderFormUtil.setFormElement(A_formelement);
		this.O_HeaderForm = this.H_View.O_HeaderFormUtil.makeFormObject();
	}

	makeSearchRule() //ここで使用する自作関数の読込
	//表示言語分岐
	{
		var A_grouprule = this.makePropertyFormRule();
		var A_orgrule = ["QRSelectAndTextInput", "QRSelectAndNumeric", "QRSelectAndCheckDate"];
		this.H_View.O_SearchFormUtil.registerOriginalRules(A_orgrule);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_SearchFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_SearchFormUtil.setDefaultWarningNote();
		}

		this.H_View.O_SearchFormUtil.makeFormRule(A_grouprule);
	}

	makePropertyForm(O_form, H_prop, O_manage) //表示言語分岐
	//文字列項目
	//グループをオブジェクトに追加
	//表示言語分岐
	//数値項目
	//表示言語分岐（配列の順序が違う）
	//グループをオブジェクトに追加
	//表示言語分岐
	//日付項目
	//表示言語分岐（配列の順序が違う）
	//グループをオブジェクトに追加
	//表示言語分岐
	//メール項目
	//グループをオブジェクトに追加
	//表示言語分岐
	//URL項目
	//グループをオブジェクトに追加
	//表示言語分岐
	//プルダウン
	//名前変える
	//名前
	//グループをオブジェクトに追加
	//表示言語分岐
	{
		if (this.O_Sess.language == "ENG") //数値条件の配列を生成
			//日付条件の配列を生成
			//日付型のフォーマット配列を生成
			{
				var H_intcondition = O_manage.getIntConditionEng();
				var H_datecondition = O_manage.getDateConditionEng();
				var H_date = O_manage.getDateFormatEng();
			} else //数値条件の配列を生成
			//日付条件の配列を生成
			//日付型のフォーマット配列を生成
			{
				H_intcondition = O_manage.getIntCondition();
				H_datecondition = O_manage.getDateCondition();
				H_date = O_manage.getDateFormat();
			}

		var A_textgroup = [{
			name: "column",
			label: "\u6587\u5B57\u5217",
			inputtype: "select",
			data: H_prop.text
		}, {
			name: "val",
			label: "\u5024",
			inputtype: "text",
			options: {
				size: "25"
			}
		}];
		this.H_View.O_SearchFormUtil.setFormElement(A_textgroup);
		var A_group = this.H_View.O_SearchFormUtil.createFormElement(A_textgroup);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "text", "Text category", ["&nbsp;is include&nbsp;"]);
		} else {
			this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "text", "\u6587\u5B57\u5217\u9805\u76EE", ["&nbsp;\u304C&nbsp;"]);
		}

		if (this.O_Sess.language == "ENG") {
			var A_intgroup = [{
				name: "column",
				label: "\u6570\u5024",
				inputtype: "select",
				data: H_prop.int
			}, {
				name: "condition",
				label: "\u6761\u4EF6",
				inputtype: "select",
				data: H_intcondition
			}, {
				name: "val",
				label: "\u5024",
				inputtype: "text",
				options: {
					size: "25"
				}
			}];
		} else {
			A_intgroup = [{
				name: "column",
				label: "\u6570\u5024",
				inputtype: "select",
				data: H_prop.int
			}, {
				name: "val",
				label: "\u5024",
				inputtype: "text",
				options: {
					size: "25"
				}
			}, {
				name: "condition",
				label: "\u6761\u4EF6",
				inputtype: "select",
				data: H_intcondition
			}];
		}

		this.H_View.O_SearchFormUtil.setFormElement(A_intgroup);
		A_group = this.H_View.O_SearchFormUtil.createFormElement(A_intgroup);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "int", "Number category", ["&nbsp;is&nbsp;", "&nbsp;&nbsp;"]);
		} else {
			this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "int", "\u6570\u5024\u9805\u76EE", ["&nbsp;\u304C&nbsp;", "&nbsp;&nbsp;"]);
		}

		if (this.O_Sess.language == "ENG") {
			var A_dategroup = [{
				name: "column",
				label: "\u65E5\u4ED8",
				inputtype: "select",
				data: H_prop.date
			}, {
				name: "condition",
				label: "\u6761\u4EF6",
				inputtype: "select",
				data: H_datecondition
			}, {
				name: "val",
				label: "\u5024",
				inputtype: "date",
				data: H_date
			}];
		} else {
			A_dategroup = [{
				name: "column",
				label: "\u65E5\u4ED8",
				inputtype: "select",
				data: H_prop.date
			}, {
				name: "val",
				label: "\u5024",
				inputtype: "date",
				data: H_date
			}, {
				name: "condition",
				label: "\u6761\u4EF6",
				inputtype: "select",
				data: H_datecondition
			}];
		}

		this.H_View.O_SearchFormUtil.setFormElement(A_dategroup);
		A_group = this.H_View.O_SearchFormUtil.createFormElement(A_dategroup);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "date", "Date category", ["&nbsp;is&nbsp;", "&nbsp;&nbsp;"]);
		} else {
			this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "date", "\u65E5\u4ED8\u9805\u76EE", ["&nbsp;\u304C&nbsp;", "&nbsp;&nbsp;"]);
		}

		var A_mailgroup = [{
			name: "column",
			label: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
			inputtype: "select",
			data: H_prop.mail
		}, {
			name: "val",
			label: "\u5024",
			inputtype: "text",
			options: {
				size: "25"
			}
		}];
		this.H_View.O_SearchFormUtil.setFormElement(A_mailgroup);
		A_group = this.H_View.O_SearchFormUtil.createFormElement(A_mailgroup);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "mail", "Mail address category", ["&nbsp;is include&nbsp;"]);
		} else {
			this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "mail", "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u9805\u76EE", ["&nbsp;\u304C&nbsp;"]);
		}

		var A_urlgroup = [{
			name: "column",
			label: "url",
			inputtype: "select",
			data: H_prop.url
		}, {
			name: "val",
			label: "\u5024",
			inputtype: "text",
			options: {
				size: "25"
			}
		}];
		this.H_View.O_SearchFormUtil.setFormElement(A_urlgroup);
		A_group = this.H_View.O_SearchFormUtil.createFormElement(A_urlgroup);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "url", "URL category", ["&nbsp;is include&nbsp;"]);
		} else {
			this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "url", "URL\u9805\u76EE", ["&nbsp;\u304C&nbsp;"]);
		}

		{
			let _tmp_0 = H_prop.select;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				var tmp = value.split(":");
				H_prop.select[key] = tmp[0];
			}
		}
		var A_selectgroup = [{
			name: "column",
			label: "\u30D7\u30EB\u30C0\u30A6\u30F3",
			inputtype: "select",
			data: H_prop.select
		}, {
			name: "val",
			label: "\u5024",
			inputtype: "text",
			options: {
				size: "25"
			}
		}];
		this.H_View.O_SearchFormUtil.setFormElement(A_selectgroup);
		A_group = this.H_View.O_SearchFormUtil.createFormElement(A_selectgroup);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "select_val", "Pulldown category", ["&nbsp;is include&nbsp;"]);
		} else {
			this.H_View.O_SearchFormUtil.addGroupWrapper(A_group, "select_val", "\u30D7\u30EB\u30C0\u30A6\u30F3\u9805\u76EE", ["&nbsp;\u304C&nbsp;"]);
		}
	}

	makePropertyFormRule() //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var A_grouprule = [{
				name: "text",
				mess: "Enter both pull-down menu and text form field for text content",
				type: "QRSelectAndTextInput",
				format: "text",
				validation: "client"
			}, {
				name: "int",
				mess: "Enter both pull-down menu and text form field for number content",
				type: "QRSelectAndTextInput",
				format: "int",
				validation: "client"
			}, {
				name: "date",
				mess: "Enter both pull-down menu and date, month, and year for date content",
				type: "QRSelectAndTextInput",
				format: "date",
				validation: "client"
			}, {
				name: "mail",
				mess: "Enter both pull-down menu and text form field for E-mail address content",
				type: "QRSelectAndTextInput",
				format: "mail",
				validation: "client"
			}, {
				name: "url",
				mess: "Enter both pull-down menu and text form field for URL content",
				type: "QRSelectAndTextInput",
				format: "url",
				validation: "client"
			}, {
				name: "int",
				mess: "Enter single-byte characters for number content",
				type: "QRSelectAndNumeric",
				format: undefined,
				validation: "client"
			}, {
				name: "date",
				mess: "Specify date, month, and year for date content.  Non-existent date is not allowed",
				type: "QRSelectAndCheckDate",
				format: undefined,
				validation: "client"
			}, {
				name: "select_val",
				mess: "Enter both pull-down menu and text form field for Pulldown content",
				type: "QRSelectAndTextInput",
				format: "select",
				validation: "client"
			}];
		} else {
			A_grouprule = [{
				name: "text",
				mess: "\u6587\u5B57\u5217\u9805\u76EE\u306F\u30D7\u30EB\u30C0\u30A6\u30F3\u3068\u30C6\u30AD\u30B9\u30C8\u30D5\u30A9\u30FC\u30E0\u4E21\u65B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
				type: "QRSelectAndTextInput",
				format: "text",
				validation: "client"
			}, {
				name: "int",
				mess: "\u6570\u5024\u9805\u76EE\u306F\u30D7\u30EB\u30C0\u30A6\u30F3\u3068\u30C6\u30AD\u30B9\u30C8\u30D5\u30A9\u30FC\u30E0\u4E21\u65B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
				type: "QRSelectAndTextInput",
				format: "int",
				validation: "client"
			}, {
				name: "date",
				mess: "\u65E5\u4ED8\u9805\u76EE\u306F\u30D7\u30EB\u30C0\u30A6\u30F3\u3068\u5E74\u6708\u65E5\u4E21\u65B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
				type: "QRSelectAndTextInput",
				format: "date",
				validation: "client"
			}, {
				name: "mail",
				mess: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u9805\u76EE\u306F\u30D7\u30EB\u30C0\u30A6\u30F3\u3068\u30C6\u30AD\u30B9\u30C8\u30D5\u30A9\u30FC\u30E0\u4E21\u65B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
				type: "QRSelectAndTextInput",
				format: "mail",
				validation: "client"
			}, {
				name: "url",
				mess: "URL\u9805\u76EE\u306F\u30D7\u30EB\u30C0\u30A6\u30F3\u3068\u30C6\u30AD\u30B9\u30C8\u30D5\u30A9\u30FC\u30E0\u4E21\u65B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
				type: "QRSelectAndTextInput",
				format: "url",
				validation: "client"
			}, {
				name: "int",
				mess: "\u6570\u5024\u9805\u76EE\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
				type: "QRSelectAndNumeric",
				format: undefined,
				validation: "client"
			}, {
				name: "date",
				mess: "\u65E5\u4ED8\u9805\u76EE\u306F\u5E74\u6708\u65E5\u3092\u5168\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u51FA\u6765\u307E\u305B\u3093\u3002",
				type: "QRSelectAndCheckDate",
				format: undefined,
				validation: "client"
			}, {
				name: "select_val",
				mess: "\u30D7\u30EB\u30C0\u30A6\u30F3\u9805\u76EE\u306F\u30D7\u30EB\u30C0\u30A6\u30F3\u3068\u30C6\u30AD\u30B9\u30C8\u30D5\u30A9\u30FC\u30E0\u4E21\u65B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
				type: "QRSelectAndTextInput",
				format: "select_val",
				validation: "client"
			}];
		}

		return A_grouprule;
	}

	clearUnderSession() {
		this.clearLastForm();
		var A_exc = [ManagementMenuViewBase.PUB, "/Management/menu.php", "/Management/Tel/menu.php", "/Management/ETC/menu.php", "/Management/Purchase/menu.php", "/Management/Copy/menu.php", "/Management/Assets/menu.php", "/Management/Transit/menu.php", "/Management/Ev/menu.php"];
		this.O_Sess.clearSessionExcludeListPub(A_exc);
	}

	checkParamError(H_sess, H_g_sess) //管理情報基底のパラメータチェック
	{
		this.checkBaseParamError(H_sess, H_g_sess);
	}

	makeDefaultValue(H_sess: {} | any[]) {
		var H_default = Array();
		H_default = H_sess[ManagementMenuViewBase.PUB];
		H_default.limit = H_sess.SELF.limit;
		return H_default;
	}

	makeDefaultSearchValue(H_sess: {} | any[]) {}

	getShowForm(H_post: {} | any[]) {
		var str = "none";

		for (var key in H_post) //検索フォームの入力があればフォームを表示
		{
			var val = H_post[key];

			if (key != "search" && key != "r_mode" && key != "search_condition") //グループ要素はcolumnでチェック
				{
					if (Array.isArray(val) == true) {
						if (undefined !== val.column == true) {
							if (undefined !== val.column == true && val.column != "") {
								str = "block";
								break;
							}

							if (undefined !== val[1] == true && val[1] != "") {
								str = "block";
								break;
							}

							if (undefined !== val[2] == true && val[2] != "") {
								str = "block";
								break;
							}
						} else {
							if (undefined !== val.val.Y == true && val.val.Y != "") {
								str = "block";
								break;
							}
						}
					} else {
						if (val != "") {
							str = "block";
							break;
						}
					}
				}
		}

		return str;
	}

	getAddViewCol(H_addcol, H_post) {
		var H_viewcol = Array();

		for (var addkey in H_addcol) {
			var addval = H_addcol[addkey];

			for (var poskey in H_post) //ユーザ設定項目
			//検索があれば拡張表示
			{
				var posval = H_post[poskey];

				if (poskey == "text" || poskey == "int" || poskey == "mail" || poskey == "url") {
					var key = posval.column;
					var posval = posval.val;
				} else if (poskey == "date") {
					key = posval.column;
					posval = posval.val.Y + posval.val.m + posval.val.d;
				} else if (poskey == "userid") {
					key = "billusername";
				} else {
					key = poskey;
				}

				if (posval != "" && addkey == poskey) {
					H_viewcol[key] = addval;
				}
			}
		}

		return H_viewcol;
	}

	checkLocation(A_auth) {}

	getManageVwAuthIni(A_auth) {
		var A_managevw = Array();

		for (var cnt = 0; cnt < A_auth.length; cnt++) {
			if ("fnc_tel_manage_vw" == A_auth[cnt] || "fnc_etc_manage_vw" == A_auth[cnt] || "fnc_purch_manage_vw" == A_auth[cnt] || "fnc_copy_manage_vw" == A_auth[cnt] || "fnc_assets_manage_vw" == A_auth[cnt] || "fnc_tran_manage_vw" == A_auth[cnt] || "fnc_ev_manage_vw" == A_auth[cnt]) {
				A_managevw.push(A_auth[cnt]);
			}
		}

		return A_managevw;
	}

	displaySmarty(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_manage: ManagementUtil) //QuickFormとSmartyの合体
	//assaign
	//ページ固有の表示処理
	//display
	{
		var O_headrenderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_HeaderForm.accept(O_headrenderer);
		this.O_SearchForm.accept(O_renderer);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("current_script", _SERVER.PHP_SELF);
		this.get_Smarty().assign("H_sess", H_sess);
		this.get_Smarty().assign("monthly_bar", this.H_View.monthly_bar);
		this.get_Smarty().assign("showform", this.getShowForm(H_sess.SELF.post));
		this.get_Smarty().assign("page_link", this.H_View.page_link);
		this.get_Smarty().assign("O_headerform", O_headrenderer.toArray());
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("list_cnt", A_data[0]);
		this.get_Smarty().assign("H_list", A_data[1]);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("A_auth", A_auth);
		this.get_Smarty().assign("A_manage_auth", this.getManageVwAuthIni(A_auth));
		this.get_Smarty().assign("thismonthflg", this.getThisMonthFlg(H_sess[ManagementMenuViewBase.PUB].cym));
		this.get_Smarty().assign("cym", H_sess[ManagementMenuViewBase.PUB].cym);
		this.get_Smarty().assign("current_postid", H_sess[ManagementMenuViewBase.PUB].current_postid);
		this.displaySmartyPeculiar(H_sess, A_data, A_auth, O_manage);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	displayError(H_sess, A_data, A_auth, O_manage) //表示言語分岐
	//QuickFormとSmartyの合体
	{
		if (this.O_Sess.language == "ENG") {
			var message = "No department information";
			var template_dir = KCS_DIR + "/template/eng";
		} else {
			message = "\u90E8\u7F72\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093";
			template_dir = KCS_DIR + "/template";
		}

		var O_headrenderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_HeaderForm.accept(O_headrenderer);
		this.get_Smarty().assign("message", message);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("H_list", A_data[1]);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("A_auth", A_auth);
		this.get_Smarty().assign("H_sess", H_sess);
		this.get_Smarty().assign("A_manage_auth", this.getManageVwAuthIni(A_auth));
		this.get_Smarty().assign("monthly_bar", this.H_View.monthly_bar);
		this.get_Smarty().assign("O_headerform", O_headrenderer.toArray());
		this.get_Smarty().display(template_dir + "/Management/error.tpl");
	}

	__destruct() {
		super.__destruct();
	}

};