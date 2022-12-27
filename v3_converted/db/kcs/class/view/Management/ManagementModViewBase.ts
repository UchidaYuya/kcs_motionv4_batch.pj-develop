//
//変更のView基底クラス
//
//更新履歴：<br>
//2008/03/20 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/20
//@filesource
//@uses ManagementViewBase
//@uses MtExceptReload
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//error_reporting(E_ALL);
//
//変更のView基底クラス
//
//@uses ViewSmarty
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/20
//@uses ManagementViewBase
//@uses MtExceptReload
//@uses HTML_QuickForm_Renderer_ArraySmarty
//

require("view/Management/ManagementViewBase.php");

require("view/ViewFinish.php");

require("MtPostUtil.php");

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
//カレント部署がセッションが無ければ作る（デフォルトは自部署）<br>
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
//確認画面へが実行されたら配列に入れる<br>
//部署変更が実行されたら配列を書換え<br>
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
//全て一覧の検索フォームを作成する<br>
//
//@author houshiyama
//@since 2008/03/13
//
//@param mixed $O_manage
//@param mixed $O_model
//@param array $H_sess
//@abstract
//@access public
//@return void
//
//
//登録フォームのエラーチェック作成
//
//@author houshiyama
//@since 2008/03/13
//
//@abstract
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
//データの取得を兼ねたパラメータチェック <br>
//
//getInfoParamCheck
//
//@author houshiyama
//@since 2008/07/31
//
//@param mixed $O_model
//@param array $H_sess
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
//完了時セッション削除 <br>
//完了画面表示 <br>
//
//@author houshiyama
//@since 2008/03/18
//
//@param array $H_sess
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
class ManagementModViewBase extends ManagementViewBase {
	constructor() //submitボタン名（入力画面用）
	{
		super();

		if (this.O_Sess.language == "ENG") {
			this.NextName = "Next";
			this.RecName = "Change";
		} else {
			this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
			this.RecName = "\u5909\u66F4\u3059\u308B";
		}
	}

	setDefaultSession() //カレント部署がセッションに無ければ作る（デフォルトは自部署）
	{
		if (undefined !== this.H_Local.post.recogpostid == false) {
			this.H_Local.post.recogpostid = this.H_Dir.current_postid;
		}

		this.setDefaultSessionPeculiar();
	}

	checkCGIParam() //初期アクセス時ＩＤをセッションに入れリロード
	{
		this.setDefaultSession();

		if (undefined !== _GET.id == true) {
			var A_id = split(":", _GET.id);
			this.H_Local.get.manageno = A_id[0];
			this.H_Local.get.coid = A_id[1];
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}

		if (undefined !== _POST.modsubmit == true && (_POST.modsubmit == this.NextName || _POST.modsubmit == this.RecName)) {
			this.H_Local.post = _POST;
		}

		if (undefined !== _GET.r == true && 1 == _GET.r) {
			delete this.H_Local.post;
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}

		this.checkCGIParamPeculiar();
		this.O_Sess.setPub(ManagementModViewBase.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);
	}

	getHeaderJS() {}

	checkParamError(H_sess, H_g_sess) //管理情報基底のパラメータチェック
	//直アクセス
	{
		this.checkBaseParamError(H_sess, H_g_sess);

		if (undefined !== H_sess.SELF.get.manageno == false) {
			this.errorOut(8, "\u7BA1\u7406\u756A\u53F7\u304C\u7121\u3044", false, "./menu.php");
			throw die();
		}
	}

	getInfoParamCheck(O_model, H_sess: {} | any[]) {}

	freezeForm() {
		this.H_View.O_ModFormUtil.updateElementAttrWrapper("modsubmit", {
			value: this.RecName
		});
		this.H_View.O_ModFormUtil.updateAttributesWrapper({
			onsubmit: false
		});
		this.H_View.O_ModFormUtil.freezeWrapper();
	}

	unfreezeForm() {
		this.H_View.O_ModFormUtil.updateElementAttrWrapper("modsubmit", {
			value: this.NextName
		});
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[]) //QuickFormとSmartyの合体
	//部署名
	//assign
	//EV ID変更では修正不可の表示項目が必要な為に追加 2010/07/29 maeda
	//ページ固有の表示処理
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_ModForm.accept(O_renderer);
		var O_post = new MtPostUtil();
		var postname = O_post.getPostTreeBand(this.O_Sess.pactid, this.O_Sess.postid, H_sess.SELF.post.recogpostid, H_sess.SELF.tableno, " -> ", "", 1, true, false);
		this.get_Smarty().assign("su", this.O_Sess.su);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("propcnt", this.H_Prop.length);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("post_name", postname);
		this.get_Smarty().assign("A_auth", A_auth);
		this.get_Smarty().assign("thismonthflg", this.getThisMonthFlg(H_sess[ManagementModViewBase.PUB].cym));
		this.get_Smarty().assign("H_data", H_sess.SELF.post);
		this.get_Smarty().assign("evconame", H_sess.SELF.carrier[H_sess.SELF.post.evcoid]);
		this.displaySmartyPeculiar(H_sess, A_auth);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};