//
//ダウンロードパターン登録画面View
//
//更新履歴：<br>
//2009/02/17 宝子山浩平 作成
//
//@package VariousDL
//@subpackage View
//@author houshiyama
//@since 2009/02/17
//@filesource
//@uses ViewSmarty
//@uses MtExceptReload
//@uses HTML_QuickForm_Renderer_ArraySmarty
//@uses ViewFinish
//@uses MtOutput
//@uses MtSession
//@uses MtUtil
//@uses QuickFormUtil
//@uses ArraySmarty
//@uses VariousDLRule
//
//
//error_reporting(E_ALL);
//
//ダウンロードパターン登録画面View
//
//@package VariousDL
//@subpackage View
//@author houshiyama
//@since 2009/02/17
//@uses ViewSmarty
//@uses MtExceptReload
//@uses HTML_QuickForm_Renderer_ArraySmarty
//@uses ViewFinish
//@uses MtOutput
//@uses MtSession
//@uses QuickFormUtil
//@uses ArraySmarty
//@uses VariousDLRule
//
//
//

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

require("MtOutput.php");

require("MtSession.php");

require("MtUtil.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/Rule/VariousDLRule.php");

require("MtUniqueString.php");

//
//ディレクトリ名
//
//
//管理種別ID
//
//交通費対応 20100527miya
//
//モード
//
//交通費対応 20100527miya
//交通費対応 20100527miya
//
//メンバー変数
//
//@var mixed
//@access private
//
//MtSessionオブジェクト
//MtAuthorityオブジェクト
//権限一覧
//ディレクトリセッション
//ローカルセッション
//MtSettingオブジェクト
//MtUtilオブジェクト
//表示用変数格納用
//フォーム要素
//
//ボタン表示
//
//@var mixed
//@access protected
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
//ローカルセッションを取得する
//
//@author houshiyama
//@since 2008/03/11
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author houshiyama
//@since 2009/02/17
//
//@access public
//@return void
//
//
//セッションが無い時デフォルト値を入れる
//
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
//DLパターン登録フォーム作成
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@param mixed $H_sess
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2009/02/17
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
//電話情報用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@param mixed $H_sess
//@access public
//@return void
//
//
//部署情報用のフォーム作成関数<br>
//
//以下make..FromElement系<br>
//key・・・カラム名<br>
//name・・・登録フォーム、csvファイルで表示する日本語名<br>
//type・・・登録フォームでの型<br>
//data・・・型がselectのときの内容<br>
//tb・・・どのテーブルのカラムか<br>
//alias・・・他とkey名がかぶった時にkeyに別名をつけるので、元のkey名<br>
//where・・・where句でのカラム（keyと違う時）<br>
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@access private
//@return void
//
//
//電話情報用のフォーム要素作成関数
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//ETC情報用のフォーム要素作成関数
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//購買情報用のフォーム要素作成関数
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//コピー機情報用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//資産情報用のフォーム要素作成関数
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//電話請求情報（部署単位）用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//電話請求情報（電話単位）用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/20
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//ETC請求情報（部署単位）用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//ETC請求情報（カード単位）用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/20
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//購買請求情報（部署単位）用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//購買請求情報（購買ID単位）用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/20
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//コピー機請求情報（部署単位）用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//コピー機請求情報（コピー機ID単位）用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/20
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//交通費請求情報（部署単位）用のフォーム作成関数
//
//@author miyazawa
//@since 2010/05/27
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//交通費請求情報（ユーザ単位）用のフォーム作成関数
//
//@author miyazawa
//@since 2010/05/27
//
//@param mixed $O_model
//@param mixed $allflg
//@access private
//@return void
//
//
//部署・電話情報用のフォーム作成関数
//
//@author houshiyama
//@since 2009/07/01
//
//@param mixed $O_model
//@access private
//@return void
//
//
//部署・ETC情報用のフォーム作成関数
//
//@author houshiyama
//@since 2009/07/01
//
//@param mixed $O_model
//@access private
//@return void
//
//
//部署・購買情報用のフォーム作成関数
//
//@author houshiyama
//@since 2009/07/01
//
//@param mixed $O_model
//@access private
//@return void
//
//
//部署・コピー機情報用のフォーム作成関数
//
//@author houshiyama
//@since 2009/07/01
//
//@param mixed $O_model
//@access private
//@return void
//
//
//部署・資産情報用のフォーム作成関数
//
//@author houshiyama
//@since 2009/07/01
//
//@param mixed $O_model
//@access private
//@return void
//
//
//請求・部署・電話情報用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $O_model
//@access private
//@return void
//
//
//請求・部署・ETC情報用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $O_model
//@access private
//@return void
//
//
//請求・部署・購買情報用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $O_model
//@access private
//@return void
//
//
//請求・部署・コピー機情報用のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $O_model
//@access private
//@return void
//
//
//部署管理ユーザ設定項目のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/20
//
//@param mixed $O_model
//@access private
//@return void
//
//
//管理情報ユーザ設定項目のフォーム作成関数
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_form
//@param mixed $O_db
//@param mixed $mid
//@access private
//@return void
//
//
//科目フォーム要素作成
//
//@author houshiyama
//@since 2009/02/20
//
//@param mixed $O_model
//@param mixed $mid
//@param mixed $tb
//@access private
//@return void
//
//
//合計フォーム要素作成
//
//@author houshiyama
//@since 2009/02/20
//
//@param mixed $O_model
//@param mixed $tb
//@access private
//@return void
//
//
//フォームのルール作成
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//DBを使ったパラメータチェック <br>
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $O_model
//@param mixed $H_post
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
//選択されたパターン情報を取得しパラメータをセットする
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $O_model
//@param mixed $H_sess
//@access public
//@return void
//
//
//セッション削除 <br>
//完了画面表示（登録・変更用） <br>
//
//@author houshiyama
//@since 2008/03/13
//
//@access public
//@return void
//
//
//セッション削除 <br>
//完了画面表示（削除用） <br>
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
class PatternAddView extends ViewSmarty {
	static PUB = "/VariousDL";
	static TELMID = 1;
	static ETCMID = 2;
	static PURCHMID = 3;
	static COPYMID = 4;
	static ASSMID = 5;
	static ICCARDMID = 6;
	static POSTMODE = "post";
	static TELMODE = "tel";
	static ETCMODE = "etc";
	static PURCHMODE = "purch";
	static COPYMODE = "copy";
	static ASSMODE = "assets";
	static POSTTELMODE = "posttel";
	static POSTETCMODE = "postetc";
	static POSTPURCHMODE = "postpurch";
	static POSTCOPYMODE = "postcopy";
	static POSTASSMODE = "postassets";
	static TELBILLMODE = "telbill";
	static ETCBILLMODE = "etcbill";
	static PURCHBILLMODE = "purchbill";
	static COPYBILLMODE = "copybill";
	static TELPOSTBILLMODE = "telpostbill";
	static ETCPOSTBILLMODE = "etcpostbill";
	static PURCHPOSTBILLMODE = "purchpostbill";
	static COPYPOSTBILLMODE = "copypostbill";
	static ICCARDPOSTBILLMODE = "iccardpostbill";
	static ICCARDUSERBILLMODE = "iccarduserbill";
	static TELALLMODE = "telall";
	static ETCALLMODE = "etcall";
	static PURCHALLMODE = "purchall";
	static COPYALLMODE = "copyall";

	constructor() //完了画面の戻るから来た時
	//form作成用配列
	//submitボタン名（入力画面用）
	{
		this.O_Sess = MtSession.singleton();

		if (undefined !== _GET.finish == true || preg_match("/\\/Menu\\/menu\\.php/", _SERVER.HTTP_REFERER) == true) {
			this.O_Sess.clearSessionPub("/_lastform");
		}

		var H_param = Array();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(PatternAddView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();

		if (is_numeric(this.O_Sess.pactid) == true) {
			this.O_Auth = MtAuthority.singleton(this.O_Sess.pactid);
		} else {
			this.errorOut(10, "\u30BB\u30C3\u30B7\u30E7\u30F3\u306Bpactid\u304C\u7121\u3044", false);
		}

		this.A_Auth = array_merge(this.O_Auth.getUserFuncIni(this.O_Sess.userid, false), this.O_Auth.getPactFuncIni());
		this.O_Set = MtSetting.singleton();
		this.O_Util = new MtUtil();
		this.H_View = Array();
		this.H_Element = Array();

		if ("ENG" == this.O_Sess.language) {
			this.NextName = "Next";
			this.RecName = "Regist";
		} else {
			this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
			this.RecName = "\u767B\u9332\u3059\u308B";
		}
	}

	getLocalSession() {
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	get_View() {
		return this.H_View;
	}

	setDefaultSession() //カレント部署が無ければ作る
	{
		if (undefined !== this.H_Local.post.recogpostid == false) {
			this.H_Local.post.recogpostid = this.O_Sess.current_postid;
		}

		if (undefined !== this.H_Local.post.use == false) {
			this.H_Local.post.use = "-1";
		}
	}

	checkCGIParam() //対象部署リンクの部署がクリックされた時
	//getパラメータは消す
	{
		this.setDefaultSession();

		if (undefined !== _GET.pid == true) {
			this.H_Local.post.recogpostid = _GET.pid;
		}

		if (undefined !== _POST == true && _POST.length > 0) {
			if (_POST.buttonName == "use") {
				for (var key in _POST) {
					var val = _POST[key];

					if (key != "use" && key != "recogpostid") {
						delete _POST[key];
					}
				}

				this.H_Local.post = _POST;
			} else {
				this.H_Local.post = _POST;
			}
		}

		this.O_Sess.setPub(PatternAddView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	makePatternAddForm(O_model, H_sess) //用途
	//パターン
	//区切り文字
	//引用符
	//対象部署
	//表示言語分岐
	//用途が決定していれば下部のフォーム作成
	//クイックフォームオブジェクト生成
	{
		var H_usage = O_model.getUsage();
		var H_pattern = O_model.getDLPattern();
		var H_separator = O_model.getSeparator();
		var H_quote = O_model.getQuote();
		var H_trg = O_model.getPostTarget();

		if ("ENG" == this.O_Sess.language) {
			var A_formelement = [{
				name: "use",
				label: "Purpose",
				inputtype: "select",
				data: H_usage,
				options: {
					id: "use",
					onChange: "javaScript:changeForm();"
				}
			}, {
				name: "pattern",
				label: "Pattern selection",
				inputtype: "select",
				data: H_pattern
			}, {
				name: "pattern_btn",
				label: "Choose",
				inputtype: "button",
				options: {
					id: "pattern_btn",
					onClick: "appPattern( 'change' );"
				}
			}, {
				name: "pattern_del",
				label: "Delete",
				inputtype: "button",
				options: {
					id: "pattern_del",
					onClick: "appPattern( 'delete' );"
				}
			}, {
				name: "separator",
				label: "Delimiter",
				inputtype: "select",
				data: H_separator,
				options: {
					id: "separator"
				}
			}, {
				name: "textize",
				label: "Quotation marks",
				inputtype: "select",
				data: H_quote,
				options: {
					id: "textize"
				}
			}, {
				name: "usablepost_type",
				label: "Available to use",
				inputtype: "select",
				data: H_trg,
				options: {
					id: "usablepost_type"
				}
			}, {
				name: "checkall",
				label: "\u5168\u3066\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u3092\u9078\u629E",
				inputtype: "checkbox",
				options: {
					id: "checkall",
					onClick: "javascript:checkAll();"
				}
			}, {
				name: "dlname",
				label: "Pattern name",
				inputtype: "text",
				options: {
					size: "40",
					maxlength: "200"
				}
			}, {
				name: "addsubmit",
				label: this.NextName,
				inputtype: "submit"
			}, {
				name: "back",
				label: "Back",
				inputtype: "button",
				options: {
					onClick: "javascript:location.href='/Menu/menu.php';"
				}
			}, {
				name: "buttonName",
				label: "",
				inputtype: "hidden",
				data: this.NextName
			}, {
				name: "reset",
				label: "Reset",
				inputtype: "button",
				options: {
					onClick: "javascript:location.href='?r=1'"
				}
			}, {
				name: "back",
				label: "To entry screen",
				inputtype: "button",
				options: {
					onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
				}
			}, {
				name: "cancel",
				label: "Cancel",
				inputtype: "button",
				options: {
					onClick: "javascript:ask_cancel('/Menu/menu.php')"
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
		} else {
			A_formelement = [{
				name: "use",
				label: "\u7528\u9014",
				inputtype: "select",
				data: H_usage,
				options: {
					id: "use",
					onChange: "javaScript:changeForm();"
				}
			}, {
				name: "pattern",
				label: "\u30D1\u30BF\u30FC\u30F3\u9078\u629E",
				inputtype: "select",
				data: H_pattern
			}, {
				name: "pattern_btn",
				label: "\u9078\u629E",
				inputtype: "button",
				options: {
					id: "pattern_btn",
					onClick: "appPattern( 'change' );"
				}
			}, {
				name: "pattern_del",
				label: "\u524A\u9664",
				inputtype: "button",
				options: {
					id: "pattern_del",
					onClick: "appPattern( 'delete' );"
				}
			}, {
				name: "separator",
				label: "\u533A\u5207\u308A\u6587\u5B57",
				inputtype: "select",
				data: H_separator,
				options: {
					id: "separator"
				}
			}, {
				name: "textize",
				label: "\u6587\u5B57\u5217\u5F15\u7528\u7B26",
				inputtype: "select",
				data: H_quote,
				options: {
					id: "textize"
				}
			}, {
				name: "usablepost_type",
				label: "\u5BFE\u8C61\u90E8\u7F72",
				inputtype: "select",
				data: H_trg,
				options: {
					id: "usablepost_type"
				}
			}, {
				name: "checkall",
				label: "\u5168\u3066\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u3092\u9078\u629E",
				inputtype: "checkbox",
				options: {
					id: "checkall",
					onClick: "javascript:checkAll();"
				}
			}, {
				name: "dlname",
				label: "\u30D1\u30BF\u30FC\u30F3\u540D",
				inputtype: "text",
				options: {
					size: "40",
					maxlength: "200"
				}
			}, {
				name: "addsubmit",
				label: this.NextName,
				inputtype: "submit"
			}, {
				name: "back",
				label: "\u623B\u308B",
				inputtype: "button",
				options: {
					onClick: "javascript:location.href='/Menu/menu.php';"
				}
			}, {
				name: "buttonName",
				label: "",
				inputtype: "hidden",
				data: this.NextName
			}, {
				name: "reset",
				label: "\u30EA\u30BB\u30C3\u30C8",
				inputtype: "button",
				options: {
					onClick: "javascript:location.href='?r=1'"
				}
			}, {
				name: "back",
				label: "\u5165\u529B\u753B\u9762\u3078",
				inputtype: "button",
				options: {
					onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
				}
			}, {
				name: "cancel",
				label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
				inputtype: "button",
				options: {
					onClick: "javascript:ask_cancel('/Menu/menu.php')"
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
		}

		if (undefined !== H_sess.post.use == true) {
			var A_select = Array();

			if ("ENG" == this.O_Sess.language) {
				var label_str = "\u7D5E\u8FBC\u90E8\u7F72";
				var post_str = "Department information";
				var bill_str = "Billing information";
				var tel_str = "Telephone information";
				var card_str = "ETC information";
				var purch_str = "Purchase ID information";
				var copy_str = "Copy machine information";
				var ass_str = "Property information";
				var ic_str = "IC\u30AB\u30FC\u30C9\u60C5\u5831";
			} else {
				label_str = "\u7D5E\u8FBC\u90E8\u7F72";
				post_str = "\u90E8\u7F72\u60C5\u5831";
				bill_str = "\u8ACB\u6C42\u60C5\u5831";
				tel_str = "\u96FB\u8A71\u60C5\u5831";
				card_str = "ETC\u60C5\u5831";
				purch_str = "\u8CFC\u8CB7\u60C5\u5831";
				copy_str = "\u30B3\u30D4\u30FC\u6A5F\u60C5\u5831";
				ass_str = "\u8CC7\u7523\u60C5\u5831";
				ic_str = "IC\u30AB\u30FC\u30C9\u60C5\u5831";
			}

			switch (H_sess.post.use) {
				case PatternAddView.POSTTELMODE:
					A_select = "te";
					break;

				case PatternAddView.POSTETCMODE:
					A_select = {
						po: post_str,
						ca: card_str
					};
					break;

				case PatternAddView.POSTPURCHMODE:
					A_select = {
						po: post_str,
						pu: purch_str
					};
					break;

				case PatternAddView.POSTCOPYMODE:
					A_select = {
						po: post_str,
						co: copy_str
					};
					break;

				case PatternAddView.POSTASSMODE:
					A_select = {
						po: post_str,
						ass: ass_str
					};
					break;

				case PatternAddView.TELBILLMODE:
					A_select = "teb";
					break;

				case PatternAddView.ETCBILLMODE:
					A_select = {
						po: post_str,
						cab: bill_str
					};
					break;

				case PatternAddView.PURCHBILLMODE:
					A_select = {
						po: post_str,
						pub: bill_str
					};
					break;

				case PatternAddView.COPYBILLMODE:
					A_select = {
						po: post_str,
						cob: bill_str
					};
					break;

				case PatternAddView.TELPOSTBILLMODE:
					A_select = "tepob";
					break;

				case PatternAddView.ETCPOSTBILLMODE:
					A_select = {
						po: post_str,
						capob: bill_str
					};
					break;

				case PatternAddView.PURCHPOSTBILLMODE:
					A_select = {
						po: post_str,
						pupob: bill_str
					};
					break;

				case PatternAddView.COPYPOSTBILLMODE:
					A_select = {
						po: post_str,
						copob: bill_str
					};
					break;

				case PatternAddView.TELALLMODE:
					label_str = "\u96FB\u8A71\u7D5E\u8FBC\u307F";
					A_select = {
						te: "\u5168\u3066\u306E\u96FB\u8A71\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9",
						teb: "\u8ACB\u6C42\u304C\u767A\u751F\u3057\u3066\u3044\u308B\u96FB\u8A71\u306E\u307F\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
					break;

				case PatternAddView.ETCALLMODE:
					A_select = {
						po: post_str,
						ca: card_str,
						cab: bill_str
					};
					break;

				case PatternAddView.PURCHALLMODE:
					A_select = {
						po: post_str,
						pu: purch_str,
						pub: bill_str
					};
					break;

				case PatternAddView.COPYALLMODE:
					A_select = {
						po: post_str,
						co: copy_str,
						cob: bill_str
					};
					break;

				default:
					A_select = Array();
					break;
			}

			if (!!A_select) {
				if (Array.isArray(A_select)) //選択肢がある
					{
						A_formelement.push({
							name: "postid_table",
							label: label_str,
							inputtype: "select",
							data: A_select
						});
					} else //選択肢ない
					{
						A_formelement.push({
							name: "postid_table",
							inputtype: "hidden",
							data: A_select
						});
					}
			}

			var A_tmp = this.makeColumnForm(O_model, H_sess);
			A_formelement = array_merge(A_formelement, A_tmp);
		}

		var O_unique = MtUniqueString.singleton();

		if (undefined !== H_sess.post.uniqueid == false) {
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
				data: H_sess.post.uniqueid,
				options: {
					id: "uniqueid"
				}
			};
			A_formelement.push(A_tmp);
		}

		this.H_View.O_FormUtil = new QuickFormUtil("form");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_Form = this.H_View.O_FormUtil.makeFormObject();
	}

	makePankuzuLinkHash() //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var H_link = {
				"": "Create download format"
			};
		} else {
			H_link = {
				"": "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u767B\u9332"
			};
		}

		return H_link;
	}

	getHeaderJS() //表示言語分岐
	{
		if ("ENG" == this.O_Sess.language) {
			var str = "<script type=\"text/javascript\" language=\"JavaScript\" src=\"/js/eng/VariousDL.js\"></script>";
		} else {
			str = "<script type=\"text/javascript\" language=\"JavaScript\" src=\"/js/VariousDL.js\"></script>";
		}

		return str;
	}

	checkParamError(H_sess, H_g_sess) {}

	makeColumnForm(O_model, H_sess) //ソート種類
	//日付型のフォーマット配列を生成
	//表示言語分岐
	//フォーム要素取得
	{
		var H_sort = O_model.getSortArray();

		if ("ENG" == this.O_Sess.language) {
			var H_date = this.O_Util.getDateFormatEng();
			var H_month = this.O_Util.getMonthFormatEng(2);
		} else {
			H_date = this.O_Util.getDateFormat();
			H_month = this.O_Util.getMonthFormat(2);
		}

		if (H_sess.post.use == PatternAddView.POSTMODE) {
			this.makePostFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.TELMODE) {
			this.makeTelFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.ETCMODE) {
			this.makeEtcFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.PURCHMODE) {
			this.makePurchaseFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.COPYMODE) {
			this.makeCopyFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.ASSMODE) {
			this.makeAssetsFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.TELPOSTBILLMODE) {
			this.makeTelPostBillFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.TELBILLMODE) {
			this.makeTelBillFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.ETCPOSTBILLMODE) {
			this.makeEtcPostBillFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.ETCBILLMODE) {
			this.makeEtcBillFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.PURCHPOSTBILLMODE) {
			this.makePurchasePostBillFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.PURCHBILLMODE) {
			this.makePurchaseBillFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.COPYPOSTBILLMODE) {
			this.makeCopyPostBillFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.COPYBILLMODE) {
			this.makeCopyBillFormElement(O_model);
		} else if (H_sess.post.use == PatternAddView.ICCARDPOSTBILLMODE) //交通費対応 20100527miya
			{
				this.makeICCardPostBillFormElement(O_model);
			} else if (H_sess.post.use == PatternAddView.ICCARDUSERBILLMODE) //交通費対応 20100527miya
			{
				this.makeICCardUserBillFormElement(O_model);
			} else if (H_sess.post.use == PatternAddView.POSTTELMODE) {
			this.makePostTelFormElement(O_model, true);
		} else if (H_sess.post.use == PatternAddView.POSTETCMODE) {
			this.makePostEtcFormElement(O_model, true);
		} else if (H_sess.post.use == PatternAddView.POSTPURCHMODE) {
			this.makePostPurchaseFormElement(O_model, true);
		} else if (H_sess.post.use == PatternAddView.POSTCOPYMODE) {
			this.makePostCopyFormElement(O_model, true);
		} else if (H_sess.post.use == PatternAddView.POSTASSMODE) {
			this.makePostAssetsFormElement(O_model, true);
		} else if (H_sess.post.use == PatternAddView.TELALLMODE) {
			this.makeTelAllFormElement(O_model, true);
		} else if (H_sess.post.use == PatternAddView.ETCALLMODE) {
			this.makeEtcAllFormElement(O_model, true);
		} else if (H_sess.post.use == PatternAddView.PURCHALLMODE) {
			this.makePurchaseAllFormElement(O_model, true);
		} else if (H_sess.post.use == PatternAddView.COPYALLMODE) {
			this.makeCopyAllFormElement(O_model, true);
		}

		var A_element = Array();
		{
			let _tmp_0 = this.H_Element;

			for (var col in _tmp_0) //表示言語分岐
			//チェック
			//表示順
			//ソート順
			//ソート条件
			//条件
			//値
			{
				var H_row = _tmp_0[col];
				var label = "";

				if ("ENG" == this.O_Sess.language) {
					if (H_row.type == "text") {
						label = "*Text";
					} else if (H_row.type == "integer") {
						label = "*Number";
					}
				} else {
					if (H_row.type == "text") {
						label = "\u203B\u6587\u5B57\u5217";
					} else if (H_row.type == "integer") {
						label = "\u203B\u6570\u5024";
					}
				}

				var A_tmp = {
					name: col + "_c",
					label: label,
					inputtype: "checkbox"
				};
				A_element.push(A_tmp);
				A_tmp = {
					name: col + "_v",
					label: "",
					inputtype: "text",
					options: {
						size: 2,
						maxlength: 2
					}
				};
				A_element.push(A_tmp);
				A_tmp = {
					name: col + "_s",
					label: "",
					inputtype: "text",
					options: {
						size: 2,
						maxlength: 2
					}
				};
				A_element.push(A_tmp);
				A_tmp = {
					name: col + "_t",
					label: "",
					inputtype: "select",
					data: H_sort
				};
				A_element.push(A_tmp);
				A_tmp = {
					name: col + "_p",
					label: "",
					inputtype: "select",
					data: O_model.getSignArray(H_row.type)
				};
				A_element.push(A_tmp);

				if (H_row.type == "text" || H_row.type == "integer") {
					var max = "200";

					if (H_row.type == "integer") {
						max = "9";
					}

					A_tmp = {
						name: col,
						label: H_row.name,
						inputtype: "text",
						options: {
							size: "40",
							maxlength: max
						}
					};
				} else if (H_row.type == "select") {
					A_tmp = {
						name: col,
						label: H_row.name,
						inputtype: "select",
						data: H_row.data
					};
				} else if (H_row.type == "date") {
					A_tmp = {
						name: col,
						label: H_row.name,
						inputtype: "date",
						data: H_date
					};
				} else if (H_row.type == "month") {
					A_tmp = {
						name: col,
						label: H_row.name,
						inputtype: "date",
						data: H_month
					};
				}

				A_element.push(A_tmp);
			}
		}
		return A_element;
	}

	makePostFormElement(O_model) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
	//表示言語分岐
	//ユーザ設定項目
	{
		if ("ENG" == this.O_Sess.language) {
			this.H_Element.postid = {
				name: "System department ID",
				type: "integer",
				tb: "post_X_tb"
			};
			this.H_Element.userpostid = {
				name: "Department ID",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.postname = {
				name: "Department name",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.postidparent = {
				name: "System department id of upper hierarchical level",
				type: "integer",
				tb: "post_relation_X_tb"
			};
			this.H_Element.userpostidparent = {
				name: "Department id of upper hierarchical level",
				type: "text",
				tb: "post_X_tb2",
				alias: "userpostid"
			};
			this.H_Element.postnameparent = {
				name: "Department name of upper hierarchical level",
				type: "text",
				tb: "post_X_tb2",
				alias: "postname"
			};
			this.H_Element.zip = {
				name: "Postal code",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.addr1 = {
				name: "Address",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.addr2 = {
				name: "Address (street address/code)",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.building = {
				name: "Address (building)",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.telno = {
				name: "Destination telephone number",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.faxno = {
				name: "FAX number",
				type: "text",
				tb: "post_X_tb"
			};
		} else {
			this.H_Element.postid = {
				name: "\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72ID",
				type: "integer",
				tb: "post_X_tb"
			};
			this.H_Element.userpostid = {
				name: "\u90E8\u7F72ID",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.postname = {
				name: "\u90E8\u7F72\u540D\u79F0",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.postidparent = {
				name: "\u30B7\u30B9\u30C6\u30E0\u6240\u5C5E\u90E8\u7F72ID",
				type: "integer",
				tb: "post_relation_X_tb"
			};
			this.H_Element.userpostidparent = {
				name: "\u6240\u5C5E\u90E8\u7F72ID",
				type: "text",
				tb: "post_X_tb2",
				alias: "userpostid"
			};
			this.H_Element.postnameparent = {
				name: "\u6240\u5C5E\u90E8\u7F72\u540D\u79F0",
				type: "text",
				tb: "post_X_tb2",
				alias: "postname"
			};
			this.H_Element.zip = {
				name: "\u90F5\u4FBF\u756A\u53F7",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.addr1 = {
				name: "\u4F4F\u6240\uFF08\u90FD\u9053\u5E9C\u770C\uFF09",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.addr2 = {
				name: "\u4F4F\u6240",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.building = {
				name: "\u5EFA\u7269",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.telno = {
				name: "\u9867\u5BA2\u96FB\u8A71\u756A\u53F7",
				type: "text",
				tb: "post_X_tb"
			};
			this.H_Element.faxno = {
				name: "\u9867\u5BA2FAX\u756A\u53F7",
				type: "text",
				tb: "post_X_tb"
			};
		}

		var H_property = this.makePostPropertyFormElement(O_model);
		this.H_Element = array_merge(this.H_Element, H_property);
	}

	makeTelFormElement(O_model, allflg = false) //電話会社
	//回線種別
	//表示言語分岐
	//ユーザ設定項目
	{
		var H_car = O_model.getCarrierHash();
		var H_cir = O_model.getCircuitHash();

		if ("ENG" == this.O_Sess.language) //主端末
			//ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//内線番号管理権限があればフォーム作成
			//請求閲覧者権限があればフォーム作成
			{
				var H_active = {
					"": "",
					true: "Active",
					false: "Unused"
				};

				if (allflg == false) {
					this.H_Element.userpostid = {
						name: "Department ID",
						type: "text",
						tb: "post_X_tb"
					};
					this.H_Element.postname = {
						name: "Department name",
						type: "text",
						tb: "post_X_tb"
					};
				}

				this.H_Element.telno_view = {
					name: "Phone number",
					type: "text",
					tb: "tel_X_tb",
					where: "telno"
				};

				if (-1 !== this.A_Auth.indexOf("fnc_extension_tel_co") == true) {
					this.H_Element.extensionno = {
						name: "Extension number",
						type: "text",
						tb: "tel_X_tb"
					};
				}

				this.H_Element.carname_eng = {
					name: "Carrier",
					type: "select",
					data: H_car,
					tb: "carrier_tb",
					where: "carid"
				};
				this.H_Element.cirname_eng = {
					name: "Service type",
					type: "select",
					data: H_cir,
					tb: "circuit_tb"
				};
				this.H_Element.buyselname_eng = {
					name: "Purchase method",
					type: "text",
					tb: "buyselect_tb"
				};
				this.H_Element.arname_eng = {
					name: "Regional subsidiaries",
					type: "text",
					tb: "area_tb"
				};
				this.H_Element.planname_eng = {
					name: "Billing plan",
					type: "text",
					tb: "plan_tb"
				};
				this.H_Element.packetname_eng = {
					name: "Packet pack",
					type: "text",
					tb: "packet_tb"
				};
				this.H_Element.pointname_eng = {
					name: "Point service",
					type: "text",
					tb: "point_tb"
				};
				this.H_Element.options = {
					name: "Options",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.discounts = {
					name: "Discount service",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.employeecode = {
					name: "Employee number",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.username = {
					name: "User",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.mail = {
					name: "Mail address",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.orderdate = {
					name: "Date of purchase of latest model",
					type: "date",
					tb: "tel_X_tb"
				};
				this.H_Element.contractdate = {
					name: "Contract date",
					type: "date",
					tb: "tel_X_tb"
				};
				this.H_Element.memo = {
					name: "Memo",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.username_kana = {
					name: "User(KANA)",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.simcardno = {
					name: "USIM number",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.assetsno = {
					name: "Admin number",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.productname = {
					name: "Product name",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.property = {
					name: "Color",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.smpcirname_eng = {
					name: "Handset type",
					type: "text",
					tb: "smart_circuit_tb"
				};
				this.H_Element.serialno = {
					name: "IMEI number",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.bought_date = {
					name: "Purchase date",
					type: "date",
					tb: "assets_X_tb"
				};
				this.H_Element.bought_price = {
					name: "Purchase cost",
					type: "integer",
					tb: "assets_X_tb"
				};
				this.H_Element.pay_startdate = {
					name: "First month of installment month",
					type: "month",
					tb: "assets_X_tb"
				};
				this.H_Element.pay_frequency = {
					name: "At the time of installment payment",
					type: "integer",
					tb: "assets_X_tb"
				};
				this.H_Element.pay_monthly_sum = {
					name: "Payment of monthly installment",
					type: "integer",
					tb: "assets_X_tb"
				};
				this.H_Element.firmware = {
					name: "Firmware",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.version = {
					name: "Version",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.accessory = {
					name: "Version ",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.main_flg = {
					name: "Active handset",
					type: "select",
					data: H_active,
					tb: "tel_rel_assets_X_tb"
				};

				if (-1 !== this.A_Auth.indexOf("fnc_kojinbetu_vw") == true) {
					this.H_Element.uname = {
						name: "Billing viewer",
						type: "text",
						tb: "user_tb",
						alias: "username"
					};
				}

				if (this.O_Auth.chkPactFuncIni("fnc_kousi") == true && -1 !== this.A_Auth.indexOf("fnc_usr_kousi") == true) {
					this.H_Element.kousiflg = {
						name: "Business and private classification",
						type: "text",
						tb: "tel_X_tb"
					};
					this.H_Element.patternname = {
						name: "Business and private classification pattern",
						type: "text",
						tb: "kousi_pattern_tb"
					};
				}

				if (this.O_Auth.chkPactFuncIni("fnc_fjp_co") == true) //用途区分（英語化なし）
					//k86 end
					//FJP2018 entry
					//FJP2018 end
					{
						this.H_Element.recogname = {
							name: "\u627F\u8A8D\u8005\u540D",
							type: "text",
							tb: "recogu"
						};
						this.H_Element.recogcode = {
							name: "\u627F\u8A8D\u8005\u30B3\u30FC\u30C9",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.pbpostname = {
							name: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u540D",
							type: "text",
							tb: "pbp"
						};
						this.H_Element.pbpostcode = {
							name: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.cfbpostname = {
							name: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u540D",
							type: "text",
							tb: "cfbp"
						};
						this.H_Element.cfbpostcode = {
							name: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.ioecode = {
							name: "\u8CFC\u5165\u30AA\u30FC\u30C0",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.coecode = {
							name: "\u901A\u4FE1\u8CBB\u30AA\u30FC\u30C0",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.commflag = {
							name: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5909\u66F4\u30D5\u30E9\u30B0  ",
							type: "select",
							data: {
								"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
								auto: "\u81EA\u52D5\u66F4\u65B0\u3059\u308B",
								manual: "\u81EA\u52D5\u66F4\u65B0\u3057\u306A\u3044"
							},
							tb: "tel_X_tb"
						};

						if (this.O_Auth.chkPactFuncIni("fnc_tel_division") == true) {
							this.H_Element.division = {
								name: "\u7528\u9014  ",
								type: "select",
								data: {
									"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
									1: "\u696D\u52D9\u7528",
									2: "\u30C7\u30E2\u7528",
									-1: "\u4E0D\u660E\u56DE\u7DDA"
								},
								tb: "tel_X_tb"
							};
						}

						this.H_Element.employee_class = {
							name: "\u793E\u54E1\u533A\u5206",
							type: "select",
							data: {
								"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
								"1": "\u4E00\u822C\u793E\u54E1",
								"2": "\u5E79\u90E8\u793E\u54E1"
							},
							tb: "tel_X_tb"
						};
						this.H_Element.executive_no = {
							name: "\u5E79\u90E8\u793E\u54E1\u5F93\u696D\u54E1\u756A\u53F7",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.executive_name = {
							name: "\u5E79\u90E8\u793E\u54E1\u6C0F\u540D",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.executive_mail = {
							name: "\u5E79\u90E8\u793E\u54E1\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.salary_source_name = {
							name: "\u7D66\u4E0E\u8CA0\u62C5\u5143\u8077\u5236\u540D",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.salary_source_code = {
							name: "\u7D66\u4E0E\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.office_code = {
							name: "\u4E8B\u696D\u6240\u30B3\u30FC\u30C9",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.office_name = {
							name: "\u4E8B\u696D\u6240\u540D",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.building_name = {
							name: "\u30D3\u30EB\u540D",
							type: "text",
							tb: "tel_X_tb"
						};
					}
			} else //主端末
			//ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//内線番号管理権限があればフォーム作成
			//請求閲覧者権限があればフォーム作成
			{
				H_active = {
					"": "",
					true: "\u4F7F\u7528\u4E2D",
					false: "\u672A\u4F7F\u7528"
				};

				if (allflg == false) {
					this.H_Element.userpostid = {
						name: "\u90E8\u7F72ID",
						type: "text",
						tb: "post_X_tb"
					};
					this.H_Element.postname = {
						name: "\u90E8\u7F72\u540D\u79F0",
						type: "text",
						tb: "post_X_tb"
					};
				}

				this.H_Element.telno_view = {
					name: "\u96FB\u8A71\u756A\u53F7",
					type: "text",
					tb: "tel_X_tb",
					where: "telno"
				};

				if (-1 !== this.A_Auth.indexOf("fnc_extension_tel_co") == true) {
					this.H_Element.extensionno = {
						name: "\u5185\u7DDA\u756A\u53F7",
						type: "text",
						tb: "tel_X_tb"
					};
				}

				this.H_Element.carname = {
					name: "\u30AD\u30E3\u30EA\u30A2",
					type: "select",
					data: H_car,
					tb: "carrier_tb",
					where: "carid"
				};
				this.H_Element.cirname = {
					name: "\u56DE\u7DDA\u7A2E\u5225",
					type: "select",
					data: H_cir,
					tb: "circuit_tb"
				};
				this.H_Element.buyselname = {
					name: "\u8CFC\u5165\u65B9\u5F0F",
					type: "text",
					tb: "buyselect_tb"
				};
				this.H_Element.arname = {
					name: "\u5730\u57DF\u4F1A\u793E",
					type: "text",
					tb: "area_tb"
				};
				this.H_Element.planname = {
					name: "\u6599\u91D1\u30D7\u30E9\u30F3",
					type: "text",
					tb: "plan_tb"
				};
				this.H_Element.packetname = {
					name: "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF",
					type: "text",
					tb: "packet_tb"
				};
				this.H_Element.pointname = {
					name: "\u30DD\u30A4\u30F3\u30C8\u30B5\u30FC\u30D3\u30B9",
					type: "text",
					tb: "point_tb"
				};
				this.H_Element.options = {
					name: "\u30AA\u30D7\u30B7\u30E7\u30F3",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.discounts = {
					name: "\u5272\u5F15\u30B5\u30FC\u30D3\u30B9",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.employeecode = {
					name: "\u793E\u54E1\u756A\u53F7",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.username = {
					name: "\u4F7F\u7528\u8005",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.mail = {
					name: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.orderdate = {
					name: "\u6700\u65B0\u6A5F\u7A2E\u8CFC\u5165\u65E5",
					type: "date",
					tb: "tel_X_tb"
				};
				this.H_Element.contractdate = {
					name: "\u5951\u7D04\u65E5",
					type: "date",
					tb: "tel_X_tb"
				};
				this.H_Element.memo = {
					name: "\u30E1\u30E2",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.username_kana = {
					name: "\u4F7F\u7528\u8005\u540D\uFF08\u304B\u306A\uFF09",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.simcardno = {
					name: "SIM\u30AB\u30FC\u30C9\u756A\u53F7",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.assetsno = {
					name: "\u7BA1\u7406\u756A\u53F7",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.productname = {
					name: "\u6A5F\u7A2E",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.property = {
					name: "\u8272",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.smpcirname = {
					name: "\u7AEF\u672B\u7A2E\u5225",
					type: "text",
					tb: "smart_circuit_tb"
				};
				this.H_Element.serialno = {
					name: "\u88FD\u9020\u756A\u53F7",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.bought_date = {
					name: "\u6A5F\u7A2E\u8CFC\u5165\u65E5",
					type: "date",
					tb: "assets_X_tb"
				};
				this.H_Element.bought_price = {
					name: "\u53D6\u5F97\u4FA1\u683C",
					type: "integer",
					tb: "assets_X_tb"
				};
				this.H_Element.pay_startdate = {
					name: "\u5272\u8CE6\u958B\u59CB\u6708",
					type: "month",
					tb: "assets_X_tb"
				};
				this.H_Element.pay_frequency = {
					name: "\u5272\u8CE6\u56DE\u6570",
					type: "integer",
					tb: "assets_X_tb"
				};
				this.H_Element.pay_monthly_sum = {
					name: "\u5272\u8CE6\u6708\u984D",
					type: "integer",
					tb: "assets_X_tb"
				};
				this.H_Element.firmware = {
					name: "\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.version = {
					name: "\u30D0\u30FC\u30B8\u30E7\u30F3",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.accessory = {
					name: "\u4ED8\u5C5E\u54C1",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.main_flg = {
					name: "\u7AEF\u672B\u4F7F\u7528\u4E2D",
					type: "select",
					data: H_active,
					tb: "tel_rel_assets_X_tb"
				};

				if (-1 !== this.A_Auth.indexOf("fnc_kojinbetu_vw") == true) {
					this.H_Element.uname = {
						name: "\u8ACB\u6C42\u95B2\u89A7\u8005",
						type: "text",
						tb: "user_tb",
						alias: "username"
					};
				}

				if (this.O_Auth.chkPactFuncIni("fnc_kousi") == true && -1 !== this.A_Auth.indexOf("fnc_usr_kousi") == true) {
					this.H_Element.kousiflg = {
						name: "\u516C\u79C1\u533A\u5206",
						type: "text",
						tb: "tel_X_tb"
					};
					this.H_Element.patternname = {
						name: "\u516C\u79C1\u5206\u8A08\u30D1\u30BF\u30FC\u30F3",
						type: "text",
						tb: "kousi_pattern_tb"
					};
				}

				if (this.O_Auth.chkPactFuncIni("fnc_fjp_co") == true) //用途区分（英語化なし）
					//k86 end
					//FJP2018 entry
					//FJP2018 end
					{
						this.H_Element.recogname = {
							name: "\u627F\u8A8D\u8005\u540D",
							type: "text",
							tb: "recogu"
						};
						this.H_Element.recogcode = {
							name: "\u627F\u8A8D\u8005\u30B3\u30FC\u30C9",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.pbpostname = {
							name: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u540D",
							type: "text",
							tb: "pbp"
						};
						this.H_Element.pbpostcode = {
							name: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.cfbpostname = {
							name: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u540D",
							type: "text",
							tb: "cfbp"
						};
						this.H_Element.cfbpostcode = {
							name: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.ioecode = {
							name: "\u8CFC\u5165\u30AA\u30FC\u30C0",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.coecode = {
							name: "\u901A\u4FE1\u8CBB\u30AA\u30FC\u30C0",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.commflag = {
							name: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5909\u66F4\u30D5\u30E9\u30B0  ",
							type: "select",
							data: {
								"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
								auto: "\u81EA\u52D5\u66F4\u65B0\u3059\u308B",
								manual: "\u81EA\u52D5\u66F4\u65B0\u3057\u306A\u3044"
							},
							tb: "tel_X_tb"
						};

						if (this.O_Auth.chkPactFuncIni("fnc_tel_division") == true) {
							this.H_Element.division = {
								name: "\u7528\u9014  ",
								type: "select",
								data: {
									"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
									1: "\u696D\u52D9\u7528",
									2: "\u30C7\u30E2\u7528",
									-1: "\u4E0D\u660E\u56DE\u7DDA"
								},
								tb: "tel_X_tb"
							};
						}

						this.H_Element.employee_class = {
							name: "\u793E\u54E1\u533A\u5206",
							type: "select",
							data: {
								"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
								"1": "\u4E00\u822C\u793E\u54E1",
								"2": "\u5E79\u90E8\u793E\u54E1"
							},
							tb: "tel_X_tb"
						};
						this.H_Element.executive_no = {
							name: "\u5E79\u90E8\u793E\u54E1\u5F93\u696D\u54E1\u756A\u53F7",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.executive_name = {
							name: "\u5E79\u90E8\u793E\u54E1\u6C0F\u540D",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.executive_mail = {
							name: "\u5E79\u90E8\u793E\u54E1\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.salary_source_name = {
							name: "\u7D66\u4E0E\u8CA0\u62C5\u5143\u8077\u5236\u540D",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.salary_source_code = {
							name: "\u7D66\u4E0E\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.office_code = {
							name: "\u4E8B\u696D\u6240\u30B3\u30FC\u30C9",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.office_name = {
							name: "\u4E8B\u696D\u6240\u540D",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.building_name = {
							name: "\u30D3\u30EB\u540D",
							type: "text",
							tb: "tel_X_tb"
						};
					}
			}

		var H_property = this.makeManagePropertyFormElement(O_model, PatternAddView.TELMID);
		this.H_Element = array_merge(this.H_Element, H_property);
	}

	makeEtcFormElement(O_model, allflg = false) //カード会社
	//表示言語分岐
	//ユーザ設定項目
	{
		var H_co = O_model.getCardCoHash();

		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//請求閲覧者権限があればフォーム作成
			{
				if (allflg == false) {
					this.H_Element.userpostid = {
						name: "Department ID",
						type: "text",
						tb: "post_X_tb"
					};
					this.H_Element.postname = {
						name: "Department name",
						type: "text",
						tb: "post_X_tb"
					};
				}

				this.H_Element.cardno_view = {
					name: "Card number",
					type: "text",
					tb: "card_X_tb",
					where: "cardno"
				};
				this.H_Element.cardconame_eng = {
					name: "Credit card company",
					type: "select",
					data: H_co,
					tb: "card_co_tb",
					where: "cardcoid"
				};
				this.H_Element.card_meigi = {
					name: "Cardholder's name",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.bill_cardno_view = {
					name: "Card number 2",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.card_corpno = {
					name: "Corporate number",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.card_corpname = {
					name: "Card's corporate name",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.card_membername = {
					name: "Card member name",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.car_no = {
					name: "Vehicle number",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.employeecode = {
					name: "Employee number",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.username = {
					name: "User",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.memo = {
					name: "Memo",
					type: "text",
					tb: "card_X_tb"
				};

				if (-1 !== this.A_Auth.indexOf("fnc_kojinbetu_vw") == true) {
					this.H_Element.uname = {
						name: "Billing viewer",
						type: "text",
						tb: "user_tb",
						alias: "username"
					};
				}
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//請求閲覧者権限があればフォーム作成
			{
				if (allflg == false) {
					this.H_Element.userpostid = {
						name: "\u90E8\u7F72ID",
						type: "text",
						tb: "post_X_tb"
					};
					this.H_Element.postname = {
						name: "\u90E8\u7F72\u540D\u79F0",
						type: "text",
						tb: "post_X_tb"
					};
				}

				this.H_Element.cardno_view = {
					name: "\u30AB\u30FC\u30C9\u756A\u53F7",
					type: "text",
					tb: "card_X_tb",
					where: "cardno"
				};
				this.H_Element.cardconame = {
					name: "\u30AB\u30FC\u30C9\u4F1A\u793E",
					type: "select",
					data: H_co,
					tb: "card_co_tb",
					where: "cardcoid"
				};
				this.H_Element.card_meigi = {
					name: "\u30AB\u30FC\u30C9\u540D\u7FA9",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.bill_cardno_view = {
					name: "\u30AB\u30FC\u30C9\u756A\u53F72",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.card_corpno = {
					name: "\u6CD5\u4EBA\u756A\u53F7",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.card_corpname = {
					name: "\u30AB\u30FC\u30C9\u6CD5\u4EBA\u540D",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.card_membername = {
					name: "\u30AB\u30FC\u30C9\u4F1A\u54E1\u540D\u79F0",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.car_no = {
					name: "\u8ECA\u4E21\u756A\u53F7",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.employeecode = {
					name: "\u793E\u54E1\u756A\u53F7",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.username = {
					name: "\u4F7F\u7528\u8005",
					type: "text",
					tb: "card_X_tb"
				};
				this.H_Element.memo = {
					name: "\u30E1\u30E2",
					type: "text",
					tb: "card_X_tb"
				};

				if (-1 !== this.A_Auth.indexOf("fnc_kojinbetu_vw") == true) {
					this.H_Element.uname = {
						name: "\u8ACB\u6C42\u95B2\u89A7\u8005",
						type: "text",
						tb: "user_tb",
						alias: "username"
					};
				}
			}

		var H_property = this.makeManagePropertyFormElement(O_model, PatternAddView.ETCMID);
		this.H_Element = array_merge(this.H_Element, H_property);
	}

	makePurchaseFormElement(O_model, allflg = false) //購買先
	//表示言語分岐
	//ユーザ設定項目
	{
		var H_co = O_model.getPurchaseCoHash();

		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			{
				if (allflg == false) {
					this.H_Element.userpostid = {
						name: "Department ID",
						type: "text",
						tb: "post_X_tb"
					};
					this.H_Element.postname = {
						name: "Department name",
						type: "text",
						tb: "post_X_tb"
					};
				}

				this.H_Element.purchid = {
					name: "Purchase ID",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.purchconame_eng = {
					name: "Purchase source",
					type: "select",
					data: H_co,
					tb: "purchase_co_tb",
					where: "purchcoid"
				};
				this.H_Element.loginid = {
					name: "Login ID",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registcomp = {
					name: "Registered company name",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registpost = {
					name: "Registered department name",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registtelno = {
					name: "Registered telephone number",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registfaxno = {
					name: "Registered fax number",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registzip = {
					name: "Registered postal code",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registaddr1 = {
					name: "Registered address (town, city, prefecture/state/province)",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registaddr2 = {
					name: "Registered address (street code)",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registbuilding = {
					name: "Registered address (building)",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registemail = {
					name: "Registered e-mail address",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registdate = {
					name: "Date of registration",
					type: "date",
					tb: "purchase_X_tb"
				};
				this.H_Element.employeecode = {
					name: "Employee number",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.username = {
					name: "User",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.memo = {
					name: "Memo",
					type: "text",
					tb: "purchase_X_tb"
				};
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			{
				if (allflg == false) {
					this.H_Element.userpostid = {
						name: "\u90E8\u7F72ID",
						type: "text",
						tb: "post_X_tb"
					};
					this.H_Element.postname = {
						name: "\u90E8\u7F72\u540D\u79F0",
						type: "text",
						tb: "post_X_tb"
					};
				}

				this.H_Element.purchid = {
					name: "\u8CFC\u8CB7ID",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.purchconame = {
					name: "\u8CFC\u8CB7\u5148",
					type: "select",
					data: H_co,
					tb: "purchase_co_tb",
					where: "purchcoid"
				};
				this.H_Element.loginid = {
					name: "\u30ED\u30B0\u30A4\u30F3ID",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registcomp = {
					name: "\u767B\u9332\u4F1A\u793E\u540D",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registpost = {
					name: "\u767B\u9332\u90E8\u7F72\u540D",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registtelno = {
					name: "\u767B\u9332\u96FB\u8A71\u756A\u53F7",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registfaxno = {
					name: "\u767B\u9332FAX\u756A\u53F7",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registzip = {
					name: "\u767B\u9332\u90F5\u4FBF\u756A\u53F7",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registaddr1 = {
					name: "\u767B\u9332\u4F4F\u6240\uFF08\u90FD\u9053\u5E9C\u770C\uFF09",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registaddr2 = {
					name: "\u767B\u9332\u4F4F\u6240\uFF08\u5E02\u533A\u753A\u6751\u3001\u756A\u5730\uFF09",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registbuilding = {
					name: "\u767B\u9332\u4F4F\u6240\uFF08\u5EFA\u7269\uFF09",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registemail = {
					name: "\u767B\u9332\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.registdate = {
					name: "\u767B\u9332\u65E5",
					type: "date",
					tb: "purchase_X_tb"
				};
				this.H_Element.employeecode = {
					name: "\u793E\u54E1\u756A\u53F7",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.username = {
					name: "\u4F7F\u7528\u8005",
					type: "text",
					tb: "purchase_X_tb"
				};
				this.H_Element.memo = {
					name: "\u30E1\u30E2",
					type: "text",
					tb: "purchase_X_tb"
				};
			}

		var H_property = this.makeManagePropertyFormElement(O_model, PatternAddView.PURCHMID);
		this.H_Element = array_merge(this.H_Element, H_property);
	}

	makeCopyFormElement(O_model, allflg = false) //購買先
	//表示言語分岐
	//ユーザ設定項目
	{
		var H_co = O_model.getCopyCoHash();

		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			{
				if (allflg == false) {
					this.H_Element.userpostid = {
						name: "Department ID",
						type: "text",
						tb: "post_X_tb"
					};
					this.H_Element.postname = {
						name: "Department name",
						type: "text",
						tb: "post_X_tb"
					};
				}

				this.H_Element.copyid = {
					name: "Copy machine ID",
					type: "text",
					tb: "copy_X_tb"
				};
				this.H_Element.copyconame_eng = {
					name: "Manufacturer",
					type: "select",
					data: H_co,
					tb: "copy_co_tb",
					where: "copycoid"
				};
				this.H_Element.copyname = {
					name: "Model",
					type: "text",
					tb: "copy_X_tb"
				};
				this.H_Element.employeecode = {
					name: "Employee number",
					type: "text",
					tb: "copy_X_tb"
				};
				this.H_Element.username = {
					name: "User",
					type: "text",
					tb: "copy_X_tb"
				};
				this.H_Element.memo = {
					name: "Memo",
					type: "text",
					tb: "copy_X_tb"
				};
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			{
				if (allflg == false) {
					this.H_Element.userpostid = {
						name: "\u90E8\u7F72ID",
						type: "text",
						tb: "post_X_tb"
					};
					this.H_Element.postname = {
						name: "\u90E8\u7F72\u540D\u79F0",
						type: "text",
						tb: "post_X_tb"
					};
				}

				this.H_Element.copyid = {
					name: "\u30B3\u30D4\u30FC\u6A5FID",
					type: "text",
					tb: "copy_X_tb"
				};
				this.H_Element.copyconame = {
					name: "\u30E1\u30FC\u30AB\u30FC",
					type: "select",
					data: H_co,
					tb: "copy_co_tb",
					where: "copycoid"
				};
				this.H_Element.copyname = {
					name: "\u6A5F\u7A2E",
					type: "text",
					tb: "copy_X_tb"
				};
				this.H_Element.employeecode = {
					name: "\u793E\u54E1\u756A\u53F7",
					type: "text",
					tb: "copy_X_tb"
				};
				this.H_Element.username = {
					name: "\u4F7F\u7528\u8005",
					type: "text",
					tb: "copy_X_tb"
				};
				this.H_Element.memo = {
					name: "\u30E1\u30E2",
					type: "text",
					tb: "copy_X_tb"
				};
			}

		var H_property = this.makeManagePropertyFormElement(O_model, PatternAddView.COPYMID);
		this.H_Element = array_merge(this.H_Element, H_property);
	}

	makeAssetsFormElement(O_model, allflg = false) //資産種別
	//電話会社
	//回線種別
	//表示言語分岐
	//ユーザ設定項目
	{
		var H_type = O_model.getAssetsTypeHash();
		var H_car = O_model.getCarrierHash();
		var H_cir = O_model.getCircuitHash();

		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//請求閲覧者権限があればフォーム作成
			{
				if (allflg == false) {
					this.H_Element.userpostid = {
						name: "Department ID",
						type: "text",
						tb: "post_X_tb"
					};
					this.H_Element.postname = {
						name: "Department name",
						type: "text",
						tb: "post_X_tb"
					};
				}

				this.H_Element.assetsno = {
					name: "Admin number",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.assetstypename = {
					name: "Admin type",
					type: "select",
					data: H_type,
					tb: "assets_type_tb",
					where: "assetstypeid"
				};
				this.H_Element.productname = {
					name: "Product name",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.property = {
					name: "Color",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.smpcirname_eng = {
					name: "Handset type",
					type: "text",
					tb: "smart_circuit_tb"
				};
				this.H_Element.serialno = {
					name: "IMEI number ",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.bought_date = {
					name: "Purchase date",
					type: "date",
					tb: "assets_X_tb"
				};
				this.H_Element.bought_price = {
					name: "Purchase cost",
					type: "integer",
					tb: "assets_X_tb"
				};
				this.H_Element.pay_startdate = {
					name: "First month of installment month",
					type: "month",
					tb: "assets_X_tb"
				};
				this.H_Element.pay_frequency = {
					name: "At the time of installment payment",
					type: "integer",
					tb: "assets_X_tb"
				};
				this.H_Element.pay_monthly_sum = {
					name: "Payment of monthly installment",
					type: "integer",
					tb: "assets_X_tb"
				};
				this.H_Element.firmware = {
					name: "Firmware",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.version = {
					name: "Version",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.accessory = {
					name: "Accessories",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.telno_view = {
					name: "Phone number",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.carname_eng = {
					name: "Carrier",
					type: "select",
					data: H_car,
					tb: "carrier_tb2",
					where: "carid"
				};
				this.H_Element.cirname_eng = {
					name: "Service type",
					type: "select",
					data: H_cir,
					tb: "circuit_tb2"
				};
				this.H_Element.buyselname_eng = {
					name: "Payment method",
					type: "text",
					tb: "buyselect_tb"
				};
				this.H_Element.arname_eng = {
					name: "Region",
					type: "text",
					tb: "area_tb"
				};
				this.H_Element.planname_eng = {
					name: "Billing plan",
					type: "text",
					tb: "plan_tb"
				};
				this.H_Element.packetname_eng = {
					name: "Packetpack",
					type: "text",
					tb: "packet_tb"
				};
				this.H_Element.pointname_eng = {
					name: "Point service",
					type: "text",
					tb: "point_tb"
				};
				this.H_Element.options = {
					name: "Option",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.discounts = {
					name: "Discount service",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.employeecode = {
					name: "Employee number",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.username = {
					name: "User",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.mail = {
					name: "E-mail address",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.orderdate = {
					name: "Date of purchase of latest model",
					type: "date",
					tb: "tel_X_tb"
				};
				this.H_Element.contractdate = {
					name: "Contracted date",
					type: "date",
					tb: "tel_X_tb"
				};
				this.H_Element.simcardno = {
					name: "USIM number",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.memo = {
					name: "Memo",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.username_kana = {
					name: "User(KANA)",
					type: "text",
					tb: "tel_X_tb"
				};

				if (-1 !== this.A_Auth.indexOf("fnc_kojinbetu_vw") == true) {
					this.H_Element.uname = {
						name: "Billing viewer",
						type: "text",
						tb: "user_tb"
					};
				}

				if (this.O_Auth.chkPactFuncIni("fnc_kousi") == true && -1 !== this.A_Auth.indexOf("fnc_usr_kousi") == true) {
					this.H_Element.kousiflg = {
						name: "Business and private classification",
						type: "text",
						tb: "tel_X_tb"
					};
					this.H_Element.patternname = {
						name: "Business and private classification pattern",
						type: "text",
						tb: "kousi_pattern_tb"
					};
				}
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//請求閲覧者権限があればフォーム作成
			{
				if (allflg == false) {
					this.H_Element.userpostid = {
						name: "\u90E8\u7F72ID",
						type: "text",
						tb: "post_X_tb"
					};
					this.H_Element.postname = {
						name: "\u90E8\u7F72\u540D\u79F0",
						type: "text",
						tb: "post_X_tb"
					};
				}

				this.H_Element.assetsno = {
					name: "\u7BA1\u7406\u756A\u53F7",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.assetstypename = {
					name: "\u7BA1\u7406\u7A2E\u5225",
					type: "select",
					data: H_type,
					tb: "assets_type_tb",
					where: "assetstypeid"
				};
				this.H_Element.productname = {
					name: "\u6A5F\u7A2E",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.property = {
					name: "\u8272",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.smpcirname = {
					name: "\u7AEF\u672B\u7A2E\u5225",
					type: "text",
					tb: "smart_circuit_tb"
				};
				this.H_Element.serialno = {
					name: "\u88FD\u9020\u756A\u53F7",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.bought_date = {
					name: "\u8CFC\u5165\u65E5",
					type: "date",
					tb: "assets_X_tb"
				};
				this.H_Element.bought_price = {
					name: "\u53D6\u5F97\u4FA1\u683C",
					type: "integer",
					tb: "assets_X_tb"
				};
				this.H_Element.pay_startdate = {
					name: "\u5272\u8CE6\u958B\u59CB\u6708",
					type: "month",
					tb: "assets_X_tb"
				};
				this.H_Element.pay_frequency = {
					name: "\u5272\u8CE6\u56DE\u6570",
					type: "integer",
					tb: "assets_X_tb"
				};
				this.H_Element.pay_monthly_sum = {
					name: "\u5272\u8CE6\u6708\u984D",
					type: "integer",
					tb: "assets_X_tb"
				};
				this.H_Element.firmware = {
					name: "\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.version = {
					name: "\u30D0\u30FC\u30B8\u30E7\u30F3",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.accessory = {
					name: "\u4ED8\u5C5E\u54C1",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.telno_view = {
					name: "\u96FB\u8A71\u756A\u53F7",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.carname = {
					name: "\u30AD\u30E3\u30EA\u30A2",
					type: "select",
					data: H_car,
					tb: "carrier_tb2",
					where: "carid"
				};
				this.H_Element.cirname = {
					name: "\u56DE\u7DDA\u7A2E\u5225",
					type: "select",
					data: H_cir,
					tb: "circuit_tb2"
				};
				this.H_Element.buyselname = {
					name: "\u8CFC\u5165\u65B9\u5F0F",
					type: "text",
					tb: "buyselect_tb"
				};
				this.H_Element.arname = {
					name: "\u5730\u57DF\u4F1A\u793E",
					type: "text",
					tb: "area_tb"
				};
				this.H_Element.planname = {
					name: "\u6599\u91D1\u30D7\u30E9\u30F3",
					type: "text",
					tb: "plan_tb"
				};
				this.H_Element.packetname = {
					name: "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF",
					type: "text",
					tb: "packet_tb"
				};
				this.H_Element.pointname = {
					name: "\u30DD\u30A4\u30F3\u30C8\u30B9\u30C6\u30FC\u30B8",
					type: "text",
					tb: "point_tb"
				};
				this.H_Element.options = {
					name: "\u30AA\u30D7\u30B7\u30E7\u30F3",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.discounts = {
					name: "\u5272\u5F15\u30B5\u30FC\u30D3\u30B9",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.employeecode = {
					name: "\u793E\u54E1\u756A\u53F7",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.username = {
					name: "\u4F7F\u7528\u8005",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.mail = {
					name: "\u643A\u5E2F\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.orderdate = {
					name: "\u6700\u65B0\u6A5F\u7A2E\u8CFC\u5165\u65E5",
					type: "date",
					tb: "tel_X_tb"
				};
				this.H_Element.contractdate = {
					name: "\u5951\u7D04\u65E5",
					type: "date",
					tb: "tel_X_tb"
				};
				this.H_Element.simcardno = {
					name: "SIM\u30AB\u30FC\u30C9\u756A\u53F7",
					type: "text",
					tb: "tel_X_tb"
				};
				this.H_Element.memo = {
					name: "\u30E1\u30E2",
					type: "text",
					tb: "assets_X_tb"
				};
				this.H_Element.username_kana = {
					name: "\u4F7F\u7528\u8005\u540D\uFF08\u304B\u306A\uFF09",
					type: "text",
					tb: "tel_X_tb"
				};

				if (-1 !== this.A_Auth.indexOf("fnc_kojinbetu_vw") == true) {
					this.H_Element.uname = {
						name: "\u8ACB\u6C42\u95B2\u89A7\u8005",
						type: "text",
						tb: "user_tb"
					};
				}

				if (this.O_Auth.chkPactFuncIni("fnc_kousi") == true && -1 !== this.A_Auth.indexOf("fnc_usr_kousi") == true) {
					this.H_Element.kousiflg = {
						name: "\u516C\u79C1\u533A\u5206",
						type: "text",
						tb: "tel_X_tb"
					};
					this.H_Element.patternname = {
						name: "\u516C\u79C1\u5206\u8A08\u30D1\u30BF\u30FC\u30F3",
						type: "text",
						tb: "kousi_pattern_tb"
					};
				}
			}

		var H_property = this.makeManagePropertyFormElement(O_model, PatternAddView.ASSMID);
		this.H_Element = array_merge(this.H_Element, H_property);
	}

	makeTelPostBillFormElement(O_model, allflg = false) //表示言語分岐
	//科目取得
	//合計項目
	{
		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			//会社に公私分計権限があればフォーム作成
			{
				if (allflg == false) //電話会社
					{
						var H_car = O_model.getCarrierHash(true);
						this.H_Element.userpostid = {
							name: "Department ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "Department name",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.carname_eng = {
							name: "Carrier",
							type: "select",
							data: H_car,
							tb: "carrier_tb",
							where: "carid"
						};
					}

				this.H_Element.phone = {
					name: "Total number of billed handsets",
					type: "integer",
					tb: "bill_X_tb"
				};
				this.H_Element.tpcharge = {
					name: "Total telephone bill(excluding tax)",
					type: "integer",
					tb: "bill_X_tb",
					alias: "charge"
				};
				this.H_Element.tpexcise = {
					name: "Total tax for telephone bill",
					type: "integer",
					tb: "bill_X_tb",
					alias: "excise"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.tpaspcharge = {
						name: "ASP amount",
						type: "integer",
						tb: "bill_X_tb",
						alias: "aspcharge"
					};
					this.H_Element.tpaspexcise = {
						name: "ASP tax",
						type: "integer",
						tb: "bill_X_tb",
						alias: "aspexcise"
					};
				}

				this.H_Element.tppoint = {
					name: "Point",
					type: "integer",
					tb: "bill_X_tb",
					alias: "point"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_kousi") == true && -1 !== this.A_Auth.indexOf("fnc_usr_kousi") == true) {
					this.H_Element.tppubliccharge = {
						name: "Business use charge",
						type: "integer",
						tb: "kousi_bill_X_tb",
						alias: "publiccharge"
					};
					this.H_Element.tppublictax = {
						name: "Business use charge(consumption tax)",
						type: "integer",
						tb: "kousi_bill_X_tb",
						alias: "publictax"
					};
					this.H_Element.tpprivatecharge = {
						name: "Private use charge",
						type: "integer",
						tb: "kousi_bill_X_tb",
						alias: "privatecharge"
					};
					this.H_Element.tpprivatetax = {
						name: "Private use charge(consumption tax)",
						type: "integer",
						tb: "kousi_bill_X_tb",
						alias: "privatetax"
					};
				}
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			//会社に公私分計権限があればフォーム作成
			{
				if (allflg == false) //電話会社
					{
						H_car = O_model.getCarrierHash(true);
						this.H_Element.userpostid = {
							name: "\u90E8\u7F72ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "\u90E8\u7F72\u540D\u79F0",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.carname = {
							name: "\u30AD\u30E3\u30EA\u30A2",
							type: "select",
							data: H_car,
							tb: "carrier_tb",
							where: "carid"
						};
					}

				this.H_Element.phone = {
					name: "\u8ACB\u6C42\u53F0\u6570",
					type: "integer",
					tb: "bill_X_tb"
				};
				this.H_Element.tpcharge = {
					name: "\u96FB\u8A71\u6599\u91D1\u5408\u8A08(\u7A0E\u629C\u304D)",
					type: "integer",
					tb: "bill_X_tb",
					alias: "charge"
				};
				this.H_Element.tpexcise = {
					name: "\u96FB\u8A71\u6599\u91D1\u5408\u8A08\u6D88\u8CBB\u7A0E",
					type: "integer",
					tb: "bill_X_tb",
					alias: "excise"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.tpaspcharge = {
						name: "ASP\u4F7F\u7528\u6599\u91D1",
						type: "integer",
						tb: "bill_X_tb",
						alias: "aspcharge"
					};
					this.H_Element.tpaspexcise = {
						name: "ASP\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "bill_X_tb",
						alias: "aspexcise"
					};
				}

				this.H_Element.tppoint = {
					name: "\u30DD\u30A4\u30F3\u30C8",
					type: "integer",
					tb: "bill_X_tb",
					alias: "point"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_kousi") == true && -1 !== this.A_Auth.indexOf("fnc_usr_kousi") == true) {
					this.H_Element.tppubliccharge = {
						name: "\u516C\u7528\u6599\u91D1",
						type: "integer",
						tb: "kousi_bill_X_tb",
						alias: "publiccharge"
					};
					this.H_Element.tppublictax = {
						name: "\u516C\u7528\u6599\u91D1\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "kousi_bill_X_tb",
						alias: "publictax"
					};
					this.H_Element.tpprivatecharge = {
						name: "\u79C1\u7528\u6599\u91D1",
						type: "integer",
						tb: "kousi_bill_X_tb",
						alias: "privatecharge"
					};
					this.H_Element.tpprivatetax = {
						name: "\u79C1\u7528\u6599\u91D1\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "kousi_bill_X_tb",
						alias: "privatetax"
					};
				}
			}

		var H_kamoku = this.makeKamokuFormElement(O_model, PatternAddView.TELMID, "bill_X_tb");
		this.H_Element = array_merge(this.H_Element, H_kamoku);
		var H_formula = this.makeFormulaFormElement(O_model, "summary_bill_X_tb");
		this.H_Element = array_merge(this.H_Element, H_formula);
	}

	makeTelBillFormElement(O_model, allflg = false) //表示言語分岐
	//科目取得
	//合計項目
	{
		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			//会社に公私分計権限があればフォーム作成
			{
				if (allflg == false) //電話会社
					{
						var H_car = O_model.getCarrierHash();
						this.H_Element.userpostid = {
							name: "Department ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "Department name",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.telno_view = {
							name: "Phone number",
							type: "text",
							tb: "tel_X_tb",
							where: "telno"
						};
						this.H_Element.username = {
							name: "User",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.carname_eng = {
							name: "Carrier",
							type: "select",
							data: H_car,
							tb: "carrier_tb",
							where: "carid"
						};
					}

				this.H_Element.charge = {
					name: "Total telephone bill(excluding tax)",
					type: "integer",
					tb: "tel_bill_X_tb"
				};
				this.H_Element.excise = {
					name: "Total tax for telephone bill",
					type: "integer",
					tb: "tel_bill_X_tb"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.aspcharge = {
						name: "ASP amount",
						type: "integer",
						tb: "tel_bill_X_tb"
					};
					this.H_Element.aspexcise = {
						name: "ASP tax",
						type: "integer",
						tb: "tel_bill_X_tb"
					};
				}

				this.H_Element.point = {
					name: "Point",
					type: "integer",
					tb: "tel_bill_X_tb"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_kousi") == true && -1 !== this.A_Auth.indexOf("fnc_usr_kousi") == true) {
					this.H_Element.publiccharge = {
						name: "Business use charge",
						type: "integer",
						tb: "kousi_tel_bill_X_tb"
					};
					this.H_Element.publictax = {
						name: "Business use charge(consumption tax)",
						type: "integer",
						tb: "kousi_tel_bill_X_tb"
					};
					this.H_Element.privatecharge = {
						name: "Private use charge",
						type: "integer",
						tb: "kousi_tel_bill_X_tb"
					};
					this.H_Element.privatetax = {
						name: "Private use charge(consumption tax)",
						type: "integer",
						tb: "kousi_tel_bill_X_tb"
					};
					this.H_Element.kousibunkei = {
						name: "Business and private classification",
						type: "integer",
						tb: "kousi_tel_bill_X_tb"
					};
				}

				if (this.O_Auth.chkPactFuncIni("fnc_fjp_co") == true) {
					if (this.O_Auth.chkPactFuncIni("fnc_tel_division") == true) {
						this.H_Element.division = {
							name: "\u7528\u9014  ",
							type: "select",
							data: {
								"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
								1: "\u696D\u52D9\u7528",
								2: "\u30C7\u30E2\u7528",
								-1: "\u4E0D\u660E\u56DE\u7DDA"
							},
							tb: "tel_X_tb"
						};
					}
				}
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			//会社に公私分計権限があればフォーム作成
			{
				if (allflg == false) //電話会社
					{
						H_car = O_model.getCarrierHash();
						this.H_Element.userpostid = {
							name: "\u90E8\u7F72ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "\u90E8\u7F72\u540D\u79F0",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.telno_view = {
							name: "\u96FB\u8A71\u756A\u53F7",
							type: "text",
							tb: "tel_X_tb",
							where: "telno"
						};
						this.H_Element.username = {
							name: "\u4F7F\u7528\u8005",
							type: "text",
							tb: "tel_X_tb"
						};
						this.H_Element.carname = {
							name: "\u30AD\u30E3\u30EA\u30A2",
							type: "select",
							data: H_car,
							tb: "carrier_tb",
							where: "carid"
						};
					}

				this.H_Element.charge = {
					name: "\u96FB\u8A71\u6599\u91D1\u5408\u8A08(\u7A0E\u629C\u304D)",
					type: "integer",
					tb: "tel_bill_X_tb"
				};
				this.H_Element.excise = {
					name: "\u96FB\u8A71\u6599\u91D1\u5408\u8A08\u6D88\u8CBB\u7A0E",
					type: "integer",
					tb: "tel_bill_X_tb"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.aspcharge = {
						name: "ASP\u4F7F\u7528\u6599\u91D1",
						type: "integer",
						tb: "tel_bill_X_tb"
					};
					this.H_Element.aspexcise = {
						name: "ASP\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "tel_bill_X_tb"
					};
				}

				this.H_Element.point = {
					name: "\u30DD\u30A4\u30F3\u30C8",
					type: "integer",
					tb: "tel_bill_X_tb"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_kousi") == true && -1 !== this.A_Auth.indexOf("fnc_usr_kousi") == true) {
					this.H_Element.publiccharge = {
						name: "\u516C\u7528\u6599\u91D1",
						type: "integer",
						tb: "kousi_tel_bill_X_tb"
					};
					this.H_Element.publictax = {
						name: "\u516C\u7528\u6599\u91D1\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "kousi_tel_bill_X_tb"
					};
					this.H_Element.privatecharge = {
						name: "\u79C1\u7528\u6599\u91D1",
						type: "integer",
						tb: "kousi_tel_bill_X_tb"
					};
					this.H_Element.privatetax = {
						name: "\u79C1\u7528\u6599\u91D1\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "kousi_tel_bill_X_tb"
					};
					this.H_Element.kousibunkei = {
						name: "\u516C\u79C1\u5206\u8A08",
						type: "integer",
						tb: "kousi_tel_bill_X_tb"
					};
				}

				if (this.O_Auth.chkPactFuncIni("fnc_fjp_co") == true) {
					if (this.O_Auth.chkPactFuncIni("fnc_tel_division") == true) {
						this.H_Element.division = {
							name: "\u7528\u9014  ",
							type: "select",
							data: {
								"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
								1: "\u696D\u52D9\u7528",
								2: "\u30C7\u30E2\u7528",
								-1: "\u4E0D\u660E\u56DE\u7DDA"
							},
							tb: "tel_X_tb"
						};
					}
				}
			}

		var H_kamoku = this.makeKamokuFormElement(O_model, PatternAddView.TELMID, "tel_bill_X_tb");
		this.H_Element = array_merge(this.H_Element, H_kamoku);
		var H_formula = this.makeFormulaFormElement(O_model, "summary_tel_bill_X_tb");
		this.H_Element = array_merge(this.H_Element, H_formula);
	}

	makeEtcPostBillFormElement(O_model, allflg = false) //表示言語分岐
	//科目取得
	{
		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //電話会社
					{
						var H_co = O_model.getCardCoHash();
						this.H_Element.userpostid = {
							name: "Department ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "Department name",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.cardconame_eng = {
							name: "Credit card company",
							type: "select",
							data: H_co,
							tb: "card_co_tb",
							where: "cardcoid"
						};
					}

				this.H_Element.card = {
					name: "Total number of billed cards",
					type: "integer",
					tb: "card_post_bill_X_tb"
				};
				this.H_Element.cpcharge = {
					name: "Total",
					type: "integer",
					tb: "card_post_bill_X_tb",
					alias: "charge"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.cpaspcharge = {
						name: "ASP amount",
						type: "integer",
						tb: "card_post_bill_X_tb",
						alias: "aspcharge"
					};
					this.H_Element.cpaspexcise = {
						name: "ASP tax",
						type: "integer",
						tb: "card_post_bill_X_tb",
						alias: "aspexcise"
					};
				}
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //電話会社
					{
						H_co = O_model.getCardCoHash();
						this.H_Element.userpostid = {
							name: "\u90E8\u7F72ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "\u90E8\u7F72\u540D\u79F0",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.cardconame = {
							name: "\u30AB\u30FC\u30C9\u4F1A\u793E",
							type: "select",
							data: H_co,
							tb: "card_co_tb",
							where: "cardcoid"
						};
					}

				this.H_Element.card = {
					name: "\u8ACB\u6C42\u30AB\u30FC\u30C9\u6570",
					type: "integer",
					tb: "card_post_bill_X_tb"
				};
				this.H_Element.cpcharge = {
					name: "\u5408\u8A08",
					type: "integer",
					tb: "card_post_bill_X_tb",
					alias: "charge"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.cpaspcharge = {
						name: "ASP\u4F7F\u7528\u6599\u91D1",
						type: "integer",
						tb: "card_post_bill_X_tb",
						alias: "aspcharge"
					};
					this.H_Element.cpaspexcise = {
						name: "ASP\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "card_post_bill_X_tb",
						alias: "aspexcise"
					};
				}
			}

		var H_kamoku = this.makeKamokuFormElement(O_model, PatternAddView.ETCMID, "card_post_bill_X_tb");
		this.H_Element = array_merge(this.H_Element, H_kamoku);
	}

	makeEtcBillFormElement(O_model, allflg = false) //表示言語分岐
	//科目取得
	{
		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //カード会社
					{
						var H_co = O_model.getCardCoHash();
						this.H_Element.userpostid = {
							name: "Department ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "Department name",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.cardno_view = {
							name: "Card number",
							type: "text",
							tb: "card_X_tb",
							where: "cardno"
						};
						this.H_Element.username = {
							name: "User",
							type: "text",
							tb: "card_X_tb"
						};
						this.H_Element.cardconame_eng = {
							name: "Credit card company",
							type: "select",
							data: H_co,
							tb: "card_co_tb",
							where: "cardcoid"
						};
					}

				this.H_Element.charge = {
					name: "Total",
					type: "integer",
					tb: "card_bill_X_tb"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.aspcharge = {
						name: "ASP amount",
						type: "integer",
						tb: "card_bill_X_tb"
					};
					this.H_Element.aspexcise = {
						name: "ASP tax",
						type: "integer",
						tb: "card_bill_X_tb"
					};
				}
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //カード会社
					{
						H_co = O_model.getCardCoHash();
						this.H_Element.userpostid = {
							name: "\u90E8\u7F72ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "\u90E8\u7F72\u540D\u79F0",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.cardno_view = {
							name: "\u30AB\u30FC\u30C9\u756A\u53F7",
							type: "text",
							tb: "card_X_tb",
							where: "cardno"
						};
						this.H_Element.username = {
							name: "\u4F7F\u7528\u8005",
							type: "text",
							tb: "card_X_tb"
						};
						this.H_Element.cardconame = {
							name: "\u30AB\u30FC\u30C9\u4F1A\u793E",
							type: "select",
							data: H_co,
							tb: "card_co_tb",
							where: "cardcoid"
						};
					}

				this.H_Element.charge = {
					name: "\u5408\u8A08",
					type: "integer",
					tb: "card_bill_X_tb"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.aspcharge = {
						name: "ASP\u4F7F\u7528\u6599\u91D1",
						type: "integer",
						tb: "card_bill_X_tb"
					};
					this.H_Element.aspexcise = {
						name: "ASP\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "card_bill_X_tb"
					};
				}
			}

		var H_kamoku = this.makeKamokuFormElement(O_model, PatternAddView.ETCMID, "card_bill_X_tb");
		this.H_Element = array_merge(this.H_Element, H_kamoku);
	}

	makePurchasePostBillFormElement(O_model, allflg = false) //表示言語分岐
	//科目取得
	{
		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //購買先
					{
						var H_co = O_model.getPurchaseCoHash();
						this.H_Element.userpostid = {
							name: "Department ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "Department name",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.purchconame_eng = {
							name: "Purchase source",
							type: "select",
							data: H_co,
							tb: "purchase_co_tb",
							where: "purchcoid"
						};
					}

				this.H_Element.purchid_num = {
					name: "Number of purchase IDs",
					type: "integer",
					tb: "purchase_post_bill_X_tb"
				};
				this.H_Element.ppitemsum = {
					name: "Quantity",
					type: "integer",
					tb: "purchase_post_bill_X_tb",
					alias: "itemsum"
				};
				this.H_Element.ppcharge = {
					name: "Billing amount",
					type: "integer",
					tb: "purchase_post_bill_X_tb",
					alias: "charge"
				};
				this.H_Element.ppexcise = {
					name: "Consumption tax",
					type: "integer",
					tb: "purchase_post_bill_X_tb",
					alias: "excise"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.ppaspcharge = {
						name: "ASP amount",
						type: "integer",
						tb: "purchase_post_bill_X_tb",
						alias: "aspcharge"
					};
					this.H_Element.ppaspexcise = {
						name: "ASP tax",
						type: "integer",
						tb: "purchase_post_bill_X_tb",
						alias: "aspexcise"
					};
				}
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //購買先
					{
						H_co = O_model.getPurchaseCoHash();
						this.H_Element.userpostid = {
							name: "\u90E8\u7F72ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "\u90E8\u7F72\u540D\u79F0",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.purchconame = {
							name: "\u8CFC\u8CB7\u5148",
							type: "select",
							data: H_co,
							tb: "purchase_co_tb",
							where: "purchcoid"
						};
					}

				this.H_Element.purchid_num = {
					name: "\u8CFC\u8CB7ID\u6570",
					type: "integer",
					tb: "purchase_post_bill_X_tb"
				};
				this.H_Element.ppitemsum = {
					name: "\u8CFC\u8CB7\u6570\u91CF",
					type: "integer",
					tb: "purchase_post_bill_X_tb",
					alias: "itemsum"
				};
				this.H_Element.ppcharge = {
					name: "\u8ACB\u6C42\u5408\u8A08",
					type: "integer",
					tb: "purchase_post_bill_X_tb",
					alias: "charge"
				};
				this.H_Element.ppexcise = {
					name: "\u6D88\u8CBB\u7A0E",
					type: "integer",
					tb: "purchase_post_bill_X_tb",
					alias: "excise"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.ppaspcharge = {
						name: "ASP\u4F7F\u7528\u6599\u91D1",
						type: "integer",
						tb: "purchase_post_bill_X_tb",
						alias: "aspcharge"
					};
					this.H_Element.ppaspexcise = {
						name: "ASP\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "purchase_post_bill_X_tb",
						alias: "aspexcise"
					};
				}
			}

		var H_kamoku = this.makeKamokuFormElement(O_model, PatternAddView.PURCHMID, "purchase_post_bill_X_tb");
		this.H_Element = array_merge(this.H_Element, H_kamoku);
	}

	makePurchaseBillFormElement(O_model, allflg = false) //表示言語分岐
	//科目取得
	{
		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //購買先
					{
						var H_co = O_model.getPurchaseCoHash();
						this.H_Element.userpostid = {
							name: "Department ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "Department name",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.purchid = {
							name: "Purchase ID",
							type: "text",
							tb: "purchase_X_tb"
						};
						this.H_Element.username = {
							name: "User",
							type: "text",
							tb: "purchase_X_tb"
						};
						this.H_Element.purchconame_eng = {
							name: "Purchase source",
							type: "select",
							data: H_co,
							tb: "purchase_co_tb",
							where: "purchcoid"
						};
					}

				this.H_Element.itemsum = {
					name: "Quantity",
					type: "integer",
					tb: "purchase_bill_X_tb"
				};
				this.H_Element.charge = {
					name: "Billing amount",
					type: "integer",
					tb: "purchase_bill_X_tb"
				};
				this.H_Element.excise = {
					name: "Consumption tax",
					type: "integer",
					tb: "purchase_bill_X_tb"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.aspcharge = {
						name: "ASP amount",
						type: "integer",
						tb: "purchase_bill_X_tb"
					};
					this.H_Element.aspexcise = {
						name: "ASP tax",
						type: "integer",
						tb: "purchase_bill_X_tb"
					};
				}
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //購買先
					{
						H_co = O_model.getPurchaseCoHash();
						this.H_Element.userpostid = {
							name: "\u90E8\u7F72ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "\u90E8\u7F72\u540D\u79F0",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.purchid = {
							name: "\u8CFC\u8CB7ID",
							type: "text",
							tb: "purchase_X_tb"
						};
						this.H_Element.username = {
							name: "\u4F7F\u7528\u8005",
							type: "text",
							tb: "purchase_X_tb"
						};
						this.H_Element.purchconame = {
							name: "\u8CFC\u8CB7\u5148",
							type: "select",
							data: H_co,
							tb: "purchase_co_tb",
							where: "purchcoid"
						};
					}

				this.H_Element.itemsum = {
					name: "\u8CFC\u8CB7\u6570\u91CF",
					type: "integer",
					tb: "purchase_bill_X_tb"
				};
				this.H_Element.charge = {
					name: "\u8ACB\u6C42\u5408\u8A08",
					type: "integer",
					tb: "purchase_bill_X_tb"
				};
				this.H_Element.excise = {
					name: "\u6D88\u8CBB\u7A0E",
					type: "integer",
					tb: "purchase_bill_X_tb"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.aspcharge = {
						name: "ASP\u4F7F\u7528\u6599\u91D1",
						type: "integer",
						tb: "purchase_bill_X_tb"
					};
					this.H_Element.aspexcise = {
						name: "ASP\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "purchase_bill_X_tb"
					};
				}
			}

		var H_kamoku = this.makeKamokuFormElement(O_model, PatternAddView.PURCHMID, "purchase_bill_X_tb");
		this.H_Element = array_merge(this.H_Element, H_kamoku);
	}

	makeCopyPostBillFormElement(O_model, allflg = false) //表示言語分岐
	//科目取得
	{
		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //購買先
					{
						var H_co = O_model.getCopyCoHash();
						this.H_Element.userpostid = {
							name: "Department ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "Department name",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.copyconame_eng = {
							name: "Manufacturer",
							type: "select",
							data: H_co,
							tb: "copy_co_tb",
							where: "copycoid"
						};
					}

				this.H_Element.copyid_num = {
					name: "Number of copy machines",
					type: "integer",
					tb: "copy_post_bill_X_tb"
				};
				this.H_Element.cpprintcount = {
					name: "Count",
					type: "integer",
					tb: "copy_post_bill_X_tb",
					alias: "printcount"
				};
				this.H_Element.cpcharge = {
					name: "Billing amount",
					type: "integer",
					tb: "copy_post_bill_X_tb",
					alias: "charge"
				};
				this.H_Element.cpexcise = {
					name: "Consumption tax",
					type: "integer",
					tb: "copy_post_bill_X_tb",
					alias: "excise"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.cpaspcharge = {
						name: "ASP amount",
						type: "integer",
						tb: "copy_post_bill_X_tb",
						alias: "aspcharge"
					};
					this.H_Element.cpaspexcise = {
						name: "ASP tax",
						type: "integer",
						tb: "copy_post_bill_X_tb",
						alias: "aspexcise"
					};
				}
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //購買先
					{
						H_co = O_model.getCopyCoHash();
						this.H_Element.userpostid = {
							name: "\u90E8\u7F72ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "\u90E8\u7F72\u540D\u79F0",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.copyconame = {
							name: "\u30E1\u30FC\u30AB\u30FC",
							type: "select",
							data: H_co,
							tb: "copy_co_tb",
							where: "copycoid"
						};
					}

				this.H_Element.copyid_num = {
					name: "\u30B3\u30D4\u30FC\u6A5F\u6570",
					type: "integer",
					tb: "copy_post_bill_X_tb"
				};
				this.H_Element.cpprintcount = {
					name: "\u30AB\u30A6\u30F3\u30C8",
					type: "integer",
					tb: "copy_post_bill_X_tb",
					alias: "printcount"
				};
				this.H_Element.cpcharge = {
					name: "\u8ACB\u6C42\u5408\u8A08",
					type: "integer",
					tb: "copy_post_bill_X_tb",
					alias: "charge"
				};
				this.H_Element.cpexcise = {
					name: "\u6D88\u8CBB\u7A0E",
					type: "integer",
					tb: "copy_post_bill_X_tb",
					alias: "excise"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.cpaspcharge = {
						name: "ASP\u4F7F\u7528\u6599\u91D1",
						type: "integer",
						tb: "copy_post_bill_X_tb",
						alias: "aspcharge"
					};
					this.H_Element.cpaspexcise = {
						name: "ASP\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "copy_post_bill_X_tb",
						alias: "aspexcise"
					};
				}
			}

		var H_kamoku = this.makeKamokuFormElement(O_model, PatternAddView.COPYMID, "copy_post_bill_X_tb");
		this.H_Element = array_merge(this.H_Element, H_kamoku);
	}

	makeCopyBillFormElement(O_model, allflg = false) //表示言語分岐
	//科目取得
	{
		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //購買先
					{
						var H_co = O_model.getCopyCoHash();
						this.H_Element.userpostid = {
							name: "Department ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "Department name",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.copyid = {
							name: "Copy machine ID",
							type: "text",
							tb: "copy_X_tb"
						};
						this.H_Element.username = {
							name: "User",
							type: "text",
							tb: "copy_X_tb"
						};
						this.H_Element.copyconame_eng = {
							name: "Manufacturer",
							type: "select",
							data: H_co,
							tb: "copy_co_tb",
							where: "copycoid"
						};
					}

				this.H_Element.printcount = {
					name: "Count",
					type: "integer",
					tb: "copy_bill_X_tb"
				};
				this.H_Element.charge = {
					name: "Billing amount",
					type: "integer",
					tb: "copy_bill_X_tb"
				};
				this.H_Element.excise = {
					name: "Consumption tax",
					type: "integer",
					tb: "copy_bill_X_tb"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.aspcharge = {
						name: "ASP amount",
						type: "integer",
						tb: "copy_bill_X_tb"
					};
					this.H_Element.aspexcise = {
						name: "ASP tax",
						type: "integer",
						tb: "copy_bill_X_tb"
					};
				}
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //購買先
					{
						H_co = O_model.getCopyCoHash();
						this.H_Element.userpostid = {
							name: "\u90E8\u7F72ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "\u90E8\u7F72\u540D\u79F0",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.copyid = {
							name: "\u30B3\u30D4\u30FC\u6A5FID",
							type: "text",
							tb: "copy_X_tb"
						};
						this.H_Element.username = {
							name: "\u4F7F\u7528\u8005",
							type: "text",
							tb: "copy_X_tb"
						};
						this.H_Element.copyconame = {
							name: "\u30E1\u30FC\u30AB\u30FC",
							type: "select",
							data: H_co,
							tb: "copy_co_tb",
							where: "copycoid"
						};
					}

				this.H_Element.printcount = {
					name: "\u30AB\u30A6\u30F3\u30C8",
					type: "integer",
					tb: "copy_bill_X_tb"
				};
				this.H_Element.charge = {
					name: "\u8ACB\u6C42\u5408\u8A08",
					type: "integer",
					tb: "copy_bill_X_tb"
				};
				this.H_Element.excise = {
					name: "\u6D88\u8CBB\u7A0E",
					type: "integer",
					tb: "copy_bill_X_tb"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.aspcharge = {
						name: "ASP\u4F7F\u7528\u6599\u91D1",
						type: "integer",
						tb: "copy_bill_X_tb"
					};
					this.H_Element.aspexcise = {
						name: "ASP\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "copy_bill_X_tb"
					};
				}
			}

		var H_kamoku = this.makeKamokuFormElement(O_model, PatternAddView.COPYMID, "copy_bill_X_tb");
		this.H_Element = array_merge(this.H_Element, H_kamoku);
	}

	makeICCardPostBillFormElement(O_model, allflg = false) //表示言語分岐
	//科目取得 交通費に科目はない 20100527miya
	//$H_kamoku = $this->makeKamokuFormElement( $O_model, self::ICCARDMID, "iccard_post_bill_X_tb" );
	//$this->H_Element = array_merge( $this->H_Element, $H_kamoku );
	{
		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //購買先
					{
						var H_co = O_model.getPurchaseCoHash();
						this.H_Element.userpostid = {
							name: "Department ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "Department name",
							type: "text",
							tb: "post_X_tb"
						};
					}

				this.H_Element.iccharge = {
					name: "Billing amount",
					type: "integer",
					tb: "iccard_post_bill_X_tb",
					alias: "charge"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.icaspcharge = {
						name: "ASP amount",
						type: "integer",
						tb: "iccard_post_bill_X_tb",
						alias: "aspcharge"
					};
					this.H_Element.icaspexcise = {
						name: "ASP tax",
						type: "integer",
						tb: "iccard_post_bill_X_tb",
						alias: "aspexcise"
					};
				}
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //購買先
					{
						H_co = O_model.getPurchaseCoHash();
						this.H_Element.userpostid = {
							name: "\u90E8\u7F72ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "\u90E8\u7F72\u540D\u79F0",
							type: "text",
							tb: "post_X_tb"
						};
					}

				this.H_Element.iccharge = {
					name: "\u8ACB\u6C42\u5408\u8A08",
					type: "integer",
					tb: "iccard_post_bill_X_tb",
					alias: "charge"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.icaspcharge = {
						name: "ASP\u4F7F\u7528\u6599\u91D1",
						type: "integer",
						tb: "iccard_post_bill_X_tb",
						alias: "aspcharge"
					};
					this.H_Element.icaspexcise = {
						name: "ASP\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "iccard_post_bill_X_tb",
						alias: "aspexcise"
					};
				}
			}
	}

	makeICCardUserBillFormElement(O_model, allflg = false) //表示言語分岐
	//科目取得 交通費に科目はない 20100527miya
	//$H_kamoku = $this->makeKamokuFormElement( $O_model, self::PURCHMID, "iccard_bill_X_tb" );
	//$this->H_Element = array_merge( $this->H_Element, $H_kamoku );
	{
		if ("ENG" == this.O_Sess.language) //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //購買先
					{
						var H_co = O_model.getPurchaseCoHash();
						this.H_Element.userpostid = {
							name: "Department ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "Department name",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.username = {
							name: "User",
							type: "text",
							tb: "iccard_bill_X_tb"
						};
					}

				this.H_Element.charge = {
					name: "Billing amount",
					type: "integer",
					tb: "iccard_bill_X_tb"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.aspcharge = {
						name: "ASP amount",
						type: "integer",
						tb: "iccard_bill_X_tb"
					};
					this.H_Element.aspexcise = {
						name: "ASP tax",
						type: "integer",
						tb: "iccard_bill_X_tb"
					};
				}
			} else //ダウンロード項目（カラム追加があったときはこの配列に追加して下さい）
			//会社にASP権限あればフォーム作成
			{
				if (allflg == false) //購買先
					{
						H_co = O_model.getPurchaseCoHash();
						this.H_Element.userpostid = {
							name: "\u90E8\u7F72ID",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.postname = {
							name: "\u90E8\u7F72\u540D\u79F0",
							type: "text",
							tb: "post_X_tb"
						};
						this.H_Element.username = {
							name: "\u4F7F\u7528\u8005",
							type: "text",
							tb: "iccard_bill_X_tb"
						};
					}

				this.H_Element.charge = {
					name: "\u8ACB\u6C42\u5408\u8A08",
					type: "integer",
					tb: "iccard_bill_X_tb"
				};

				if (this.O_Auth.chkPactFuncIni("fnc_asp") == true) {
					this.H_Element.aspcharge = {
						name: "ASP\u4F7F\u7528\u6599\u91D1",
						type: "integer",
						tb: "iccard_bill_X_tb"
					};
					this.H_Element.aspexcise = {
						name: "ASP\u6D88\u8CBB\u7A0E",
						type: "integer",
						tb: "iccard_bill_X_tb"
					};
				}
			}
	}

	makePostTelFormElement(O_model) {
		this.makePostFormElement(O_model);
		this.makeTelFormElement(O_model, true);
	}

	makePostEtcFormElement(O_model) {
		this.makePostFormElement(O_model);
		this.makeEtcFormElement(O_model, true);
	}

	makePostPurchaseFormElement(O_model) {
		this.makePostFormElement(O_model);
		this.makePurchaseFormElement(O_model, true);
	}

	makePostCopyFormElement(O_model) {
		this.makePostFormElement(O_model);
		this.makeCopyFormElement(O_model, true);
	}

	makePostAssetsFormElement(O_model) {
		this.makePostFormElement(O_model);
		this.makeAssetsFormElement(O_model, true);
	}

	makeTelAllFormElement(O_model) {
		this.makePostFormElement(O_model);
		this.makeTelFormElement(O_model, true);
		this.makeTelPostBillFormElement(O_model, true);
		this.makeTelBillFormElement(O_model, true);
	}

	makeEtcAllFormElement(O_model) {
		this.makePostFormElement(O_model);
		this.makeEtcFormElement(O_model, true);
		this.makeEtcPostBillFormElement(O_model, true);
		this.makeEtcBillFormElement(O_model, true);
	}

	makePurchaseAllFormElement(O_model) {
		this.makePostFormElement(O_model);
		this.makePurchaseFormElement(O_model, true);
		this.makePurchasePostBillFormElement(O_model, true);
		this.makePurchaseBillFormElement(O_model, true);
	}

	makeCopyAllFormElement(O_model) {
		this.makePostFormElement(O_model);
		this.makeCopyFormElement(O_model, true);
		this.makeCopyPostBillFormElement(O_model, true);
		this.makeCopyBillFormElement(O_model, true);
	}

	makePostPropertyFormElement(O_model) //DBから項目を取得
	//H_values内の要素を指定するためのカウント
	//文字項目
	//数値項目
	//日付項目
	{
		var H_property = Array();
		var H_values = O_model.getPostPropertyHash(mid);
		var colid = 1;

		for (var count = 1; count <= 15; count++) {
			var label = H_values[count];

			if (label == "") //表示言語分岐
				{
					if ("ENG" == this.O_Sess.language) {
						label = "Text" + count;
					} else {
						label = "\u6587\u5B57\u5217" + count;
					}
				}

			H_property["ptext" + count] = {
				name: label,
				type: "text",
				tb: "post_X_tb"
			};
		}

		for (count = 16;; count <= 18; count++) {
			label = H_values[count];
			var kcount = count - 15;

			if (label == "") //表示言語分岐
				{
					if ("ENG" == this.O_Sess.language) {
						label = "Number" + kcount;
					} else {
						label = "\u6570\u5024" + kcount;
					}
				}

			H_property["pint" + kcount] = {
				name: label,
				type: "integer",
				tb: "post_X_tb"
			};
		}

		for (count = 19;; count <= 20; count++) {
			label = H_values[count];
			kcount = count - 18;

			if (label == "") //表示言語分岐
				{
					if ("ENG" == this.O_Sess.language) {
						label = "Date" + kcount;
					} else {
						label = "\u65E5\u4ED8" + kcount;
					}
				}

			H_property["pdate" + kcount] = {
				name: label,
				type: "date",
				tb: "post_X_tb"
			};
		}

		return H_property;
	}

	makeManagePropertyFormElement(O_model, mid) //DBから項目を取得
	//H_values内の要素を指定するためのカウント
	//テーブル名
	//数値項目
	//日付項目
	//メール項目
	//URL項目
	//プルダウン項目
	{
		var H_property = Array();
		var H_values = O_model.getManagementPropertyHash(mid);
		var colid = 1;

		if (mid == PatternAddView.TELMID) {
			var tb = "tel_X_tb";
		} else if (mid == PatternAddView.ETCMID) {
			tb = "card_X_tb";
		} else if (mid == PatternAddView.PURCHMID) {
			tb = "purchase_X_tb";
		} else if (mid == PatternAddView.COPYMID) {
			tb = "copy_X_tb";
		} else if (mid == PatternAddView.ASSMID) {
			tb = "assets_X_tb";
		}

		for (var count = 1; count <= 15; count++) {
			var label = H_values["text" + count];

			if (label == "") //表示言語分岐
				{
					if ("ENG" == this.O_Sess.language) {
						label = "Text" + count;
					} else {
						label = "\u6587\u5B57\u5217" + count;
					}
				}

			H_property["text" + count] = {
				name: label,
				type: "text",
				tb: tb
			};
		}

		for (count = 1;; count <= 6; count++) {
			label = H_values["int" + count];

			if (label == "") //表示言語分岐
				{
					if ("ENG" == this.O_Sess.language) {
						label = "Number" + count;
					} else {
						label = "\u6570\u5024" + count;
					}
				}

			H_property["int" + count] = {
				name: label,
				type: "integer",
				tb: tb
			};
		}

		for (count = 1;; count <= 6; count++) {
			label = H_values["date" + count];

			if (label == "") //表示言語分岐
				{
					if ("ENG" == this.O_Sess.language) {
						label = "Date" + count;
					} else {
						label = "\u65E5\u4ED8" + count;
					}
				}

			H_property["date" + count] = {
				name: label,
				type: "date",
				tb: tb
			};
		}

		for (count = 1;; count <= 3; count++) {
			label = H_values["mail" + count];

			if (label == "") //表示言語分岐
				{
					if ("ENG" == this.O_Sess.language) {
						label = "Mail address" + count;
					} else {
						label = "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" + count;
					}
				}

			H_property["mail" + count] = {
				name: label,
				type: "text",
				tb: tb
			};
		}

		for (count = 1;; count <= 3; count++) {
			label = H_values["url" + count];

			if (label == "") {
				label = "URL" + count;
			}

			H_property["url" + count] = {
				name: label,
				type: "text",
				tb: tb
			};
		}

		for (count = 1;; count <= 10; count++) {
			label = H_values["select" + count];

			if (label != "") {
				var temp = label.split(":");
				label = temp[0];
			}

			if (label == "") {
				label = "\u30D7\u30EB\u30C0\u30A6\u30F3" + count;
			}

			H_property["select" + count] = {
				name: label,
				type: "text",
				tb: tb
			};
		}

		return H_property;
	}

	makeKamokuFormElement(O_model, mid, tb) {
		var H_kamoku = Array();
		var str = "";

		if ("bill_X_tb" == tb) {
			str = "tp";
		} else if ("card_post_bill_X_tb" == tb) {
			str = "cp";
		} else if ("purchase_post_bill_X_tb" == tb) {
			str = "pp";
		} else if ("copy_post_bill_X_tb" == tb) {
			str = "cp";
		} else if ("iccard_post_bill_X_tb" == tb) //交通費対応 20100527miya
			{
				str = "ic";
			}

		var H_data = O_model.getManageKamokuHash(mid);

		for (var col in H_data) {
			var name = H_data[col];
			H_kamoku[str + col] = {
				name: name,
				type: "integer",
				tb: tb,
				alias: col
			};
		}

		return H_kamoku;
	}

	makeFormulaFormElement(O_model, tb) {
		var H_formula = Array();
		var str = "";

		if ("summary_bill_X_tb" == tb) {
			str = "tp";
		}

		var H_data = O_model.getFormulaHash();

		for (var col in H_data) {
			var name = H_data[col];
			H_formula[str + col] = {
				name: name,
				type: "integer",
				tb: tb,
				alias: col
			};
		}

		return H_formula;
	}

	makePatternAddRule(H_sess) //表示言語分岐
	//ここで使用する自作関数の読込
	//表示言語分岐
	{
		if ("ENG" == this.O_Sess.language) //下部のフォームがある時
			{
				var A_rule = [{
					name: "use",
					mess: "Please choose intended purpose.",
					type: "alphanumeric",
					format: "-1",
					validation: "client"
				}, {
					name: "dlname",
					mess: "Please input a pattern name",
					type: "required",
					format: undefined,
					validation: "client"
				}];
				{
					let _tmp_1 = this.H_Element;

					for (var label in _tmp_1) {
						var H_row = _tmp_1[label];

						if (H_row.type == "integer") {
							var A_tmp = {
								name: label,
								mess: "Single byte numeric is required for a " + H_row.name + ".",
								type: "numeric",
								format: undefined,
								validation: "client"
							};
							A_rule.push(A_tmp);
						}

						if (H_row.type == "date") {
							A_tmp = {
								name: label,
								mess: "Specify date, month, and year for " + H_row.name + ". Non-existent date is not allowed.",
								type: "QRCheckDate",
								format: undefined,
								validation: "client"
							};
							A_rule.push(A_tmp);
						}

						if (H_row.type == "month") {
							A_tmp = {
								name: label,
								mess: "Specify month and year for " + H_row.name + ". Non-existent date is not allowed.",
								type: "QRCheckMonth",
								format: undefined,
								validation: "client"
							};
							A_rule.push(A_tmp);
						}

						A_tmp = {
							name: label + "_v",
							mess: "The indication order of the " + H_row.name + " must be, single byte alphanumeric",
							type: "numeric",
							format: undefined,
							validation: "client"
						};
						A_rule.push(A_tmp);
						A_tmp = {
							name: label + "_v",
							mess: "There are some invalid specification which is overlap with the indication order of the " + H_row.name,
							type: "QRCheckDupliNumberView",
							format: label,
							validation: "server"
						};
						A_rule.push(A_tmp);
						A_tmp = {
							name: label + "_s",
							mess: "Please input the sorting order of the " + H_row.name + " must be single byte numeric.",
							type: "numeric",
							format: undefined,
							validation: "client"
						};
						A_rule.push(A_tmp);
						A_tmp = {
							name: label + "_s",
							mess: "There are some invalid specification which is overlap with the sorting order of the " + H_row.name,
							type: "QRCheckDupliNumberSort",
							format: label,
							validation: "server"
						};
						A_rule.push(A_tmp);
					}
				}

				if (this.H_Element.length > 1) {
					A_tmp = {
						name: "dlname",
						mess: "Please choose the object to be downloaded",
						type: "QRCheckNoCheck",
						format: undefined,
						validation: "client"
					};
					A_rule.push(A_tmp);
				}
			} else //下部のフォームがある時
			{
				A_rule = [{
					name: "use",
					mess: "\u7528\u9014\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
					type: "alphanumeric",
					format: "-1",
					validation: "client"
				}, {
					name: "dlname",
					mess: "\u30D1\u30BF\u30FC\u30F3\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
					type: "required",
					format: undefined,
					validation: "client"
				}];
				{
					let _tmp_2 = this.H_Element;

					for (var label in _tmp_2) {
						var H_row = _tmp_2[label];

						if (H_row.type == "integer") {
							A_tmp = {
								name: label,
								mess: H_row.name + "\u306E\u5024\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
								type: "numeric",
								format: undefined,
								validation: "client"
							};
							A_rule.push(A_tmp);
						}

						if (H_row.type == "date") {
							A_tmp = {
								name: label,
								mess: H_row.name + "\u306E\u5024\u306F\u5E74\u6708\u65E5\u5168\u3066\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306F\u9078\u3079\u307E\u305B\u3093",
								type: "QRCheckDate",
								format: undefined,
								validation: "client"
							};
							A_rule.push(A_tmp);
						}

						if (H_row.type == "month") {
							A_tmp = {
								name: label,
								mess: H_row.name + "\u306E\u5024\u306F\u5E74\u6708\u5168\u3066\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306F\u9078\u3079\u307E\u305B\u3093",
								type: "QRCheckMonth",
								format: undefined,
								validation: "client"
							};
							A_rule.push(A_tmp);
						}

						A_tmp = {
							name: label + "_v",
							mess: H_row.name + "\u306E\u8868\u793A\u9806\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
							type: "numeric",
							format: undefined,
							validation: "client"
						};
						A_rule.push(A_tmp);
						A_tmp = {
							name: label + "_v",
							mess: H_row.name + "\u306E\u8868\u793A\u9806\u3068\u91CD\u8907\u3057\u3066\u3044\u308B\u3082\u306E\u304C\u3042\u308A\u307E\u3059",
							type: "QRCheckDupliNumberView",
							format: label,
							validation: "server"
						};
						A_rule.push(A_tmp);
						A_tmp = {
							name: label + "_s",
							mess: H_row.name + "\u306E\u30BD\u30FC\u30C8\u9806\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
							type: "numeric",
							format: undefined,
							validation: "client"
						};
						A_rule.push(A_tmp);
						A_tmp = {
							name: label + "_s",
							mess: H_row.name + "\u306E\u30BD\u30FC\u30C8\u9806\u3068\u91CD\u8907\u3057\u3066\u3044\u308B\u3082\u306E\u304C\u3042\u308A\u307E\u3059",
							type: "QRCheckDupliNumberSort",
							format: label,
							validation: "server"
						};
						A_rule.push(A_tmp);
					}
				}

				if (this.H_Element.length > 1) {
					A_tmp = {
						name: "dlname",
						mess: "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5BFE\u8C61\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
						type: "QRCheckNoCheck",
						format: undefined,
						validation: "client"
					};
					A_rule.push(A_tmp);
				}
			}

		var A_orgrule = ["QRCheckDate", "QRCheckMonth", "QRCheckDupliNumberView", "QRCheckDupliNumberSort", "QRCheckPatternSelect", "QRCheckNoCheck"];
		this.H_View.O_FormUtil.registerOriginalRules(A_orgrule);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_FormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_FormUtil.setDefaultWarningNote();
		}

		this.H_View.O_FormUtil.makeFormRule(A_rule);
	}

	checkInputError(O_model, H_post) {
		if (undefined !== H_post.addsubmit == true) //同名のパターンあり
			{
				var A_dlid = O_model.getDlidFromPatternName(H_post.dlname);

				if (A_dlid.length > 0) {
					if (this.O_Sess.language == "ENG") {
						this.H_View.message = "Specified name for downloading format has already been used, all information will be replaced if you continue.";
					} else {
						this.H_View.message = "\u65E2\u306B\u540C\u540D\u306E\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u306E\u767B\u9332\u304C\u3042\u308A\u307E\u3059\u3002\u3053\u306E\u307E\u307E\u64CD\u4F5C\u3092\u5B9F\u884C\u3059\u308B\u3068\u65B0\u3057\u3044\u5185\u5BB9\u3067\u4E0A\u66F8\u304D\u3055\u308C\u307E\u3059\u3002";
					}
				}
			}
	}

	displaySmarty(H_sess: {} | any[]) //QuickFormとSmartyの合体
	//部署名
	//assign
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		var O_post = new MtPostUtil();
		H_sess.post.recogpostname = O_post.getPostTreeBand(this.O_Sess.pactid, this.O_Sess.postid, H_sess.post.recogpostid, "", " -> ", "", 1, true, false);
		this.get_Smarty().assign("H_post", H_sess.post);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("H_element", this.H_Element);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("message", this.H_View.message);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	freezeForm() {
		this.H_View.O_FormUtil.updateElementAttrWrapper("addsubmit", {
			value: this.RecName
		});
		this.H_View.O_FormUtil.updateAttributesWrapper({
			onSubmit: false
		});
		this.H_View.O_FormUtil.freezeWrapper();
	}

	unfreezeForm() {
		this.H_View.O_FormUtil.updateElementAttrWrapper("addsubmit", {
			value: this.NextName
		});
	}

	setSelectPattern(O_model, H_sess) //DBから値取得
	//パラメータ置き換え
	{
		var H_res = O_model.getSelectPattern(H_sess.post.pattern);

		if (H_res.length > 0) {
			H_sess.post.recogpostid = H_res[0].postid;
			H_sess.post.use = H_res[0].template_type;
			H_sess.post.separator = H_res[0].separator;
			H_sess.post.textize = H_res[0].textize;
			H_sess.post.usablepost_type = H_res[0].usablepost_type;
			H_sess.post.dlname = H_res[0].dlname;
			H_sess.post.postid_table = H_res[0].postid_table;

			for (var cnt = 0; cnt < H_res.length; cnt++) {
				if (H_res[cnt].download == 1) {
					H_sess.post[H_res[cnt].col_name + "_c"] = 1;
				}

				H_sess.post[H_res[cnt].col_name + "_v"] = H_res[cnt].view_order;
				H_sess.post[H_res[cnt].col_name + "_s"] = H_res[cnt].sort_order;
				H_sess.post[H_res[cnt].col_name + "_t"] = H_res[cnt].sort_type;
				H_sess.post[H_res[cnt].col_name + "_p"] = H_res[cnt].sign;
				H_sess.post[H_res[cnt].col_name] = H_res[cnt].value;
			}

			H_sess.post.buttonName = "";
		}

		this.O_Sess.setSelfAll(H_sess);
		MtExceptReload.raise(undefined);
	}

	endPatternAddView() //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();

		if (this.O_Sess.language == "ENG") {
			O_finish.displayFinish("Create download format", "/VariousDL/PatternAdd.php?finish=1", "Back", "", "ENG");
		} else {
			O_finish.displayFinish("\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30D1\u30BF\u30FC\u30F3\u767B\u9332", "/VariousDL/PatternAdd.php?finish=1");
		}
	}

	endPatternDeleteView() //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();

		if (this.O_Sess.language == "ENG") {
			O_finish.displayFinish("Delete the download pattern", "/VariousDL/PatternAdd.php?finish=1", "Back", "", "ENG");
		} else {
			O_finish.displayFinish("\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30D1\u30BF\u30FC\u30F3\u524A\u9664", "/VariousDL/PatternAdd.php?finish=1");
		}
	}

	__destruct() {
		super.__destruct();
	}

};