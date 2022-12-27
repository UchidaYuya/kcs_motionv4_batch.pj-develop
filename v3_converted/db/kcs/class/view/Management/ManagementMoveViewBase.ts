//
//移動のView基底
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
//@uses QuickFormUtil
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//error_reporting(E_ALL);
//
//移動のView基底
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/10
//@uses ManagementViewBase
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
//最初のアクセス時のみ2重登録防止セッションを作る<br>
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
//前メーニュー共通のCGIパラメータのチェックを行う<br>
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
//各ページ固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/03/13
//
//@abstract
//@access protected
//@return void
//
//
//移動フォームを作成する<br>
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
//移動フォームのエラーチェック作成
//
//@author houshiyama
//@since 2008/03/13
//
//@param mixed $O_manage
//@param mixed $O_model
//@param array $H_sess
//@param array $A_data（電話移動でしか使わない）
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
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ManagementMoveViewBase extends ManagementViewBase {
	constructor() //submitボタン名（入力画面用）
	{
		super();

		if (this.O_Sess.language == "ENG") {
			this.NextName = "Next";
			this.RecName = "Shift";
		} else {
			this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
			this.RecName = "\u79FB\u52D5\u3059\u308B";
		}
	}

	setDefaultSession() //2重登録防止セッション
	{
		if (undefined !== _POST.before == true && undefined !== this.H_Local.dupli == false) {
			this.H_Local.dupli = "1";
		}

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

		if (undefined !== _POST.movesubmit == true) {
			this.H_Local.post = _POST;
		}

		if (undefined !== _GET.r == true && 1 == _GET.r) {
			delete this.H_Local.post;
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}

		this.checkCGIParamPeculiar();
		this.O_Sess.setPub(ManagementMoveViewBase.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);
	}

	makeMoveForm(O_manage, O_model, H_sess: {} | any[]) //表示言語分岐
	//ユニーク文字列生成用
	//クイックフォームオブジェクト生成
	{
		if (this.O_Sess.language == "ENG") //フォーム要素の配列作成
			//現在管理かつ15日以前ならチェックボックスを表示
			{
				var A_formelement = [{
					name: "movesubmit",
					label: this.NextName,
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
					name: "back",
					label: "Back",
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
				}];

				if (date("d") < this.O_Set.manage_clamp_date && date("Ym") == H_sess[ManagementMoveViewBase.PUB].cym) {
					var A_check = {
						name: "pastflg",
						label: "Shift previous month's data",
						inputtype: "checkbox",
						options: "1"
					};
					A_formelement.push(A_check);
				}
			} else //フォーム要素の配列作成
			//現在管理かつ15日以前ならチェックボックスを表示
			{
				A_formelement = [{
					name: "movesubmit",
					label: this.NextName,
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
					name: "back",
					label: "\u5165\u529B\u753B\u9762\u3078",
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
				}];

				if (date("d") < this.O_Set.manage_clamp_date && date("Ym") == H_sess[ManagementMoveViewBase.PUB].cym) {
					A_check = {
						name: "pastflg",
						label: "\u524D\u6708\u5206\u79FB\u52D5",
						inputtype: "checkbox",
						options: "1"
					};
					A_formelement.push(A_check);
				}
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

		this.H_View.O_MoveFormUtil = new QuickFormUtil("form");
		this.H_View.O_MoveFormUtil.setFormElement(A_formelement);
		this.O_MoveForm = this.H_View.O_MoveFormUtil.makeFormObject();
	}

	makeMoveRule(O_manage, O_model, H_sess: {} | any[], A_data: {} | any[]) //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var A_rule = [{
				name: "recogpostid",
				mess: "Select department",
				type: "required",
				format: undefined,
				validation: "client"
			}];
			this.H_View.O_MoveFormUtil.setDefaultWarningNoteEng();
		} else {
			A_rule = [{
				name: "recogpostid",
				mess: "\u90E8\u7F72\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
				type: "required",
				format: undefined,
				validation: "client"
			}];
			this.H_View.O_MoveFormUtil.setDefaultWarningNote();
		}

		this.H_View.O_MoveFormUtil.makeFormRule(A_rule);
	}

	getHeaderJS() {}

	checkParamError(H_sess, H_g_sess) //リストが無ければエラー
	{
		if (undefined !== H_sess.SELF.trg_list == false || Array.isArray(H_sess.SELF.trg_list) == false) {
			this.errorOut(8, "\u51E6\u7406\u5BFE\u8C61\u304C\u7121\u3044", false, "./menu.php");
			throw die();
		}

		if (undefined !== H_sess.SELF.dupli == false) {
			this.errorOut(34, "\u5B8C\u4E86\u753B\u9762\u30EA\u30ED\u30FC\u30C9", false, "./menu.php");
			throw die();
		}
	}

	freezeForm() {
		this.H_View.O_MoveFormUtil.updateElementAttrWrapper("movesubmit", {
			value: this.RecName
		});
		this.H_View.O_MoveFormUtil.updateAttributesWrapper({
			onsubmit: false
		});
		this.H_View.O_MoveFormUtil.freezeWrapper();
	}

	unfreezeForm() {
		this.H_View.O_MoveFormUtil.updateElementAttrWrapper("movesubmit", {
			value: this.NextName
		});
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[], A_data: {} | any[]) //QuickFormとSmartyの合体
	//assign
	//ページ固有の表示処理
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_MoveForm.accept(O_renderer);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("postname", H_sess.SELF.post.recogpostname);
		this.get_Smarty().assign("H_list", A_data);
		this.get_Smarty().assign("A_auth", A_auth);
		this.get_Smarty().assign("thismonthflg", this.getThisMonthFlg(H_sess[ManagementMoveViewBase.PUB].cym));
		this.displaySmartyPeculiar(H_sess, A_auth);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};