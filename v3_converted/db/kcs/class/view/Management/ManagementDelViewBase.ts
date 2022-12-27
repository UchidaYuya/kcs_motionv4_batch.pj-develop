//
//削除のView基底
//
//更新履歴：<br>
//2008/03/10 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/02/20
//@filesource
//@uses ManagementViewBase
//@uses MtExceptReload
//@uses QuickFormUtil
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//error_reporting(E_ALL);
//
//削除のView基底
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/10
//@uses ManagementViewBase
//@uses MtExceptReload
//@uses QuickFormUtil
//@uses HTML_QuickForm_Renderer_ArraySmarty
//

require("view/Management/ManagementViewBase.php");

require("view/ViewFinish.php");

require("MtUniqueString.php");

//
//登録フォームオブジェクト
//
//@var mixed
//@access protected
//
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
//@since 2008/03/10
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//セッションが無い時デフォルト値を入れる
//
//@author houshiyama
//@since 2008/03/13
//
//@access private
//@return void
//
//
//購買一覧固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/03/13
//
//@abstract
//@access protected
//@return void
//
//
//削除画面共通のCGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//メニューから来たときはCGIパラメータを配列に入れる<br>
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
//購買一覧固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/03/13
//
//@abstract
//@access protected
//@return void
//
//
//削除フォームを作成する<br>
//
//@author houshiyama
//@since 2008/03/13
//
//@param mixed $O_manage
//@param mixed $O_model
//@param array $H_sess
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2008/03/13
//
//@abstract
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
//処理対象の存在チェック <br>
//2重登録防止チェック <br>
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
//QuickFormとSmartyを合体<br>
//各データをSmartyにassign<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/02/20
//
//@param array $H_sesstion（CGIパラメータ）
//@param array $A_auth（権限一覧）
//@param array $A_data（一覧データ）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//各ページ固有のdisplaySmarty
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
//完了時セッション削除
//
//@author houshiyama
//@since 2008/03/18
//
//@param mixed $O_manage
//@param mixed $H_sess
//@abstract
//@access public
//@return void
//
//
//削除権限が無いデータが含まれていたときのエラー
//
//@author houshiyama
//@since 2011/03/10
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
class ManagementDelViewBase extends ManagementViewBase {
	constructor() //submitボタン名（入力画面用）
	{
		super();

		if (this.O_Sess.language == "ENG") {
			this.NextName = "Next";
			this.RecName = "Delete";
		} else {
			this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
			this.RecName = "\u524A\u9664\u3059\u308B";
		}
	}

	setDefaultSession() {
		this.setDefaultSessionPeculiar();
	}

	checkCGIParam() //menuから来たとき
	{
		this.setDefaultSession();

		if (undefined !== _POST.before == true) //空の（hidden）要素は消す
			{
				this.H_Local.trg_list = _POST;
				{
					let _tmp_0 = this.H_Local.trg_list;

					for (var key in _tmp_0) {
						var val = _tmp_0[key];

						if (preg_match("/^id/", key) == true && "" == val) {
							delete this.H_Local.trg_list[key];
						}
					}
				}
			}

		if (undefined !== _POST.delsubmit == true) {
			this.H_Local.post = _POST;
		}

		if (undefined !== _GET.r == true && 1 == _GET.r) {
			delete this.H_Local.post;
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}

		this.checkCGIParamPeculiar();
		this.O_Sess.setPub(ManagementDelViewBase.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);
	}

	makeDelForm(O_manage, O_model, H_sess: {} | any[]) //表示言語分岐
	//ユニーク文字列生成用
	//クイックフォームオブジェクト生成
	{
		if (this.O_Sess.language == "ENG") //フォーム要素の配列作成
			{
				var A_formelement = [{
					name: "delsubmit",
					label: this.RecName,
					inputtype: "submit"
				}, {
					name: "cancel",
					label: "Cancel",
					inputtype: "button",
					options: {
						onClick: "javascript:ask_cancel()"
					}
				}, {
					name: "reset",
					label: "Reset",
					inputtype: "button",
					options: {
						onClick: "javascript:location.href='?r=1'"
					}
				}, {
					name: "recogpostid",
					label: "",
					inputtype: "hidden"
				}, {
					name: "recogpostname",
					label: "",
					inputtype: "hidden"
				}];
			} else //フォーム要素の配列作成
			{
				A_formelement = [{
					name: "delsubmit",
					label: this.RecName,
					inputtype: "submit"
				}, {
					name: "cancel",
					label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
					inputtype: "button",
					options: {
						onClick: "javascript:ask_cancel()"
					}
				}, {
					name: "reset",
					label: "\u30EA\u30BB\u30C3\u30C8",
					inputtype: "button",
					options: {
						onClick: "javascript:location.href='?r=1'"
					}
				}, {
					name: "recogpostid",
					label: "",
					inputtype: "hidden"
				}, {
					name: "recogpostname",
					label: "",
					inputtype: "hidden"
				}];
			}

		var O_unique = MtUniqueString.singleton();

		if (!(undefined !== H_sess.SELF.post.uniqueid)) {
			var A_tmp = {
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

		this.H_View.O_DelFormUtil = new QuickFormUtil("form");
		this.H_View.O_DelFormUtil.setFormElement(A_formelement);
		this.O_DelForm = this.H_View.O_DelFormUtil.makeFormObject();
	}

	getHeaderJS() {}

	checkParamError(H_sess, H_g_sess) //管理情報基底のパラメータチェック
	//リストが無ければ2重登録エラー（リストは正常終了時に消すため）
	{
		this.checkBaseParamError(H_sess, H_g_sess);

		if (undefined !== H_sess.SELF.trg_list == false || Array.isArray(H_sess.SELF.trg_list) == false) {
			this.errorOut(8, "\u51E6\u7406\u5BFE\u8C61\u304C\u7121\u3044", false, "./menu.php");
			throw die();
		}
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[], A_data: {} | any[]) //QuickFormとSmartyの合体
	//assign
	//ページ固有の表示処理
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_DelForm.accept(O_renderer);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("postname", H_sess.SELF.post.recogpostname);
		this.get_Smarty().assign("H_list", A_data);
		this.get_Smarty().assign("A_auth", A_auth);
		this.displaySmartyPeculiar(H_sess, A_auth);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	viewDeleteAuthError() //エラー画面表示
	{
		var O_err = new ViewError();

		if (this.O_Sess.language == "ENG") {
			O_err.display("You are not authorized to perform that operation.<br>You are not authorized to delete the telephone. Uncheck the telephone.", 0, "./menu.php", "Back");
		} else {
			O_err.display("\u96FB\u8A71\u524A\u9664\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093<br>\u30E1\u30CB\u30E5\u30FC\u304B\u3089\u96FB\u8A71\u3092\u5916\u3057\u3066\u9078\u629E\u3057\u306A\u304A\u3057\u3066\u4E0B\u3055\u3044", 0, "./menu.php", "\u623B\u308B");
		}
	}

	__destruct() {
		super.__destruct();
	}

};