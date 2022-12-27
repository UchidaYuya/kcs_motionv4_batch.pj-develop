//
//EV ID変更のView
//
//更新履歴：<br>
//2010/07/23 前田 作成
//
//@package Management
//@subpackage View
//@author maeda
//@since 2010/07/23
//@uses ManagementModViewBase
//@uses QuickFormUtil
//@uses ManagementUtil
//@uses ViewError
//@uses ViewFinish
//
//
//error_reporting(E_ALL);
//
//EV ID変更のView
//
//@package Management
//@subpackage View
//@author maeda
//@since 2010/07/23
//@uses ManagementModViewBase
//@uses QuickFormUtil
//@uses ManagementUtil
//@uses ViewError
//@uses ViewFinish
//

require("view/Management/ManagementModViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author maeda
//@since 2010/07/23
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//各ページ用各権限チェック
//
//@author maeda
//@since 2010/07/23
//
//@access protected
//@return void
//
//
//EV 一覧固有のsetDeraultSession
//
//@author maeda
//@since 2010/07/23
//
//@access protected
//@return void
//
//
//EV 一覧固有のcheckCGIParam
//
//@author maeda
//@since 2010/07/23
//
//@access protected
//@return void
//
//
//EV IDの登録変更フォームを作成する<br>
//
//日付条件の配列を生成<br>
//日付型のフォーマット配列を生成<br>
//フォーム要素の配列を作成<br>
//フォームのオブジェクト生成<br>
//
//@author maeda
//@since 2010/07/23
//
//@param object $O_manage
//@param object $O_model
//@param array $H_sess
//@access public
//@return void
//@uses O_ManagementUtil
//@uses QuickFormUtil
//
//
//EV ID変更フォームのエラーチェック作成
//
//@author maeda
//@since 2010/07/23
//
//@access public
//@return void
//
//
//キーカラムの変更が無ければfalse <br>
//キーカラムの変更があればtrue <br>
//キーカラムの変更があれば変更前のキーを保持（DBに書込むため） <br>
//
//@author maeda
//@since 2010/07/23
//
//@param mixed $H_sess
//@param mixed $O_manage
//@access public
//@return void
//
//
//EV ID変更固有のdisplaySmarty
//
//@author maeda
//@since 2010/07/23
//
//@param mixed $H_session
//@param mixed $H_tree
//@param mixed $A_data
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author maeda
//@since 2010/07/23
//
//@access public
//@return array
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author maeda
//@since 2010/07/23
//
//@access public
//@return void
//
//public function getHeaderJS(){
//	}
//
//エラー画面表示
//
//@author maeda
//@since 2010/07/23
//
//@access protected
//@return void
//
//
//完了画面表示 <br>
//
//セッションクリア <br>
//2重登録防止メソッド呼び出し <br>
//完了画面表示 <br>
//
//@author maeda
//@since 2010/07/23
//
//@param array $H_sess
//@access protected
//@return void
//@uses ViewFinish
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/23
//
//@access public
//@return void
//
class EvModView extends ManagementModViewBase {
	constructor() {
		super();
	}

	checkCustomAuth() {
		var A_auth = this.getAllAuth();

		if (-1 !== A_auth.indexOf("fnc_ev_manage_adm") == false) {
			this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", false, "./menu.php");
		}
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	makeModForm(O_manage, O_model, H_sess: {} | any[]) //VOLTAからの同期が未実行なら編集可能にする
	//基底クラスから登録変更フォーム要素取得
	//現在の変更のとき
	{
		if (false == H_sess.SELF.post.sync_flg) //キャリアの配列を生成
			//VOLTAから同期処理実行済み
			{
				var H_co = O_model.getEvCoData();
				var A_formelement = [{
					name: "evid",
					label: "ID",
					inputtype: "text",
					options: {
						id: "tranid",
						size: "35",
						maxlength: "9"
					}
				}, {
					name: "evcoid",
					label: "\u30AD\u30E3\u30EA\u30A2",
					inputtype: "select",
					data: H_co
				}];
			} else {
			A_formelement = [{
				name: "evid",
				label: "ID",
				inputtype: "hidden"
			}, {
				name: "evcoid",
				label: "\u30AD\u30E3\u30EA\u30A2",
				inputtype: "hidden"
			}, {
				name: "username",
				inputtype: "hidden"
			}, {
				name: "ev_car_number",
				inputtype: "hidden"
			}, {
				name: "ev_car_type",
				inputtype: "hidden"
			}, {
				name: "ev_telno",
				inputtype: "hidden"
			}, {
				name: "ev_mail",
				inputtype: "hidden"
			}, {
				name: "ev_zip",
				inputtype: "hidden"
			}, {
				name: "ev_addr1",
				inputtype: "hidden"
			}, {
				name: "ev_addr2",
				inputtype: "hidden"
			}, {
				name: "ev_building",
				inputtype: "hidden"
			}];
		}

		A_formelement = array_merge(A_formelement, this.getEvModFormElement(O_manage, O_model));
		var A_tmp = {
			name: "modsubmit",
			label: this.NextName,
			inputtype: "submit"
		};
		A_formelement.push(A_tmp);

		if (date("Ym") == H_sess[EvModView.PUB].cym) {
			A_tmp = {
				name: "pastflg",
				label: "\u524D\u6708\u5206\u3082\u5909\u66F4\u3059\u308B\u5834\u5408\u306F\u30C1\u30A7\u30C3\u30AF\u3092\u5165\u308C\u3066\u304F\u3060\u3055\u3044",
				inputtype: "checkbox",
				options: "1"
			};
			A_formelement.push(A_tmp);
		}

		this.H_View.O_ModFormUtil = new QuickFormUtil("form");
		this.H_View.O_ModFormUtil.setFormElement(A_formelement);
		this.O_ModForm = this.H_View.O_ModFormUtil.makeFormObject();
	}

	makeModRule(O_manage, O_model, H_sess: {} | any[]) //VOLTAから同期処理未実行
	//基底クラスから新規登録フォームルール取得
	//ここで使用する自作関数の読込
	{
		if (false == H_sess.SELF.post.sync_flg) //VOLTAから同期処理実行済み
			{
				var A_rule = [{
					name: "evid",
					mess: "ID\uFF08\uFF19\u6841\uFF09\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
					type: "required",
					format: undefined,
					validation: "client"
				}, {
					name: "evid",
					mess: "ID\u306F\u534A\u89D2\u6570\u5B57\uFF19\u6841\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
					type: "regex",
					format: "/^[0-9]{9}/",
					validation: "client"
				}, {
					name: "evcoid",
					mess: "\u30AD\u30E3\u30EA\u30A2\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
					type: "required",
					format: undefined,
					validation: "client"
				}];
			} else {
			A_rule = Array();
		}

		A_rule = array_merge(A_rule, this.getEvModFormRule());
		var A_orgrule = ["QRCheckDate", "QRIntNumeric", "QRalnumRegex"];
		this.H_View.O_ModFormUtil.registerOriginalRules(A_orgrule);
		this.H_View.O_ModFormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.H_View.O_ModFormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.H_View.O_ModFormUtil.makeFormRule(A_rule);
	}

	checkModKeyCol(H_sess, O_manage) //キーカラムの変更無し
	{
		if (H_sess.post.evid == H_sess.get.manageno && H_sess.post.evcoid == H_sess.get.coid) {
			H_sess.post.pre_evid = "";
			H_sess.post.pre_evcoid = "";
			return false;
		} else {
			H_sess.post.pre_evid = H_sess.get.manageno;
			H_sess.post.pre_evcoid = H_sess.get.coid;
			return true;
		}
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) {}

	makePankuzuLinkHash() {
		var H_link = {
			"/Management/Ev/menu.php": "\u7BA1\u7406\u60C5\u5831",
			"": "EV ID\u5909\u66F4"
		};
		return H_link;
	}

	viewChgKeyError() //エラー画面表示
	{
		var O_err = new ViewError();
		O_err.display("\u8ACB\u6C42\u304C\u3042\u308BEV ID\u306EID\u3001\u30AD\u30E3\u30EA\u30A2\u306F\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002", 0, _SERVER.PHP_SELF, "\u623B\u308B");
	}

	endModView(H_sess: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("EV ID\u5909\u66F4", "/Management/Ev/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
	}

	__destruct() {
		super.__destruct();
	}

};