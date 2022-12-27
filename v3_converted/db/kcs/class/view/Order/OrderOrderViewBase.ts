//
//顧客側注文フォームのView基底クラス
//
//更新履歴：<br>
//2008/04/09 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/09
//@filesource
//@uses OrderFormViewBase
//@uses MtExceptReload
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//error_reporting(E_ALL);
//
//顧客側注文フォームのView基底クラス
//
//@uses ViewSmarty
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/10
//@uses OrderFormViewBase
//@uses MtExceptReload
//@uses HTML_QuickForm_Renderer_ArraySmarty
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
//登録フォームオブジェクト
//
//@var mixed
//@access protected
//
//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
//
//セッションが無い時デフォルト値を入れる
//
//カレント部署がセッションが無ければ作る（デフォルトは自部署）<br>
//
//@author miyazawa
//@since 2008/03/13
//
//@access private
//@return void
//
//
//購買一覧固有のsetDeraultSession
//
//@author miyazawa
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
//@author miyazawa
//@since 2008/03/13
//
//@access public
//@return void
//
//
//購買一覧固有のcheckCGIParam
//
//@author miyazawa
//@since 2008/03/13
//
//@abstract
//@access protected
//@return void
//
//
//登録フォームのエラーチェック作成
//
//@author miyazawa
//@since 2008/03/13
//
//@abstract
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author miyazawa
//@since 2008/03/13
//
//@abstract
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author miyazawa
//@since 2008/03/07
//
//@access public
//@return void
//
//
//パラメータチェック <br>
//
//@author miyazawa
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
//@author miyazawa
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
//@author miyazawa
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
//@author miyazawa
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
//@author miyazawa
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
//@author miyazawa
//@since 2008/03/18
//
//@access public
//@return void
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
class OrderOrderViewBase extends OrderViewBase {
	static NEXTNAME = "\u78BA\u8A8D\u753B\u9762\u3078";
	static RECNAME = "\u6CE8\u6587\u3059\u308B";

	constructor() {
		super();
	}

	setDefaultSession() //カレント部署がセッションに無ければ作る（デフォルトは自部署）
	{
		if (undefined !== this.H_Local.post.recogpostid == false) {
			this.H_Local.post.recogpostid = this.H_Dir.current_postid;
		}

		this.setDefaultSessionPeculiar();
	}

	checkCGIParam() //submitが実行された時
	{
		this.setDefaultSession();

		if (undefined !== _POST.addsubmit == true && (_POST.addsubmit == OrderOrderViewBase.NEXTNAME || _POST.addsubmit == OrderOrderViewBase.RECNAME)) {
			this.H_Local.post = _POST;
		}

		if (_POST.length > 0 && 2 == _POST.flag) {
			delete _POST.flag;
			this.H_Dir.current_postid = _POST.recogpostid;
			this.H_Local.post = _POST;
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}

		if (undefined !== _GET.r == true && 1 == _GET.r) {
			delete this.H_Local.post;
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}

		this.checkCGIParamPeculiar();
		this.O_Sess.setPub(OrderOrderViewBase.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);
	}

	getHeaderJS() {}

	checkParamError(H_sess, H_g_sess) //管理情報基底のパラメータチェック
	{
		this.checkBaseParamError(H_sess, H_g_sess);
	}

	freezeForm() {
		this.H_View.O_AddFormUtil.updateElementAttrWrapper("addsubmit", {
			value: OrderOrderViewBase.RECNAME
		});
		this.H_View.O_AddFormUtil.updateAttributesWrapper({
			onsubmit: false
		});
		this.H_View.O_AddFormUtil.freezeWrapper();
	}

	unfreezeForm() {
		this.H_View.O_AddFormUtil.updateElementAttrWrapper("addsubmit", {
			value: OrderOrderViewBase.NEXTNAME
		});
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[]) //QuickFormとSmartyの合体
	//assign
	//ページ固有の表示処理
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_AddForm.accept(O_renderer);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("propcnt", this.H_Prop.length);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("post_name", H_sess.SELF.post.recogpostname);
		this.get_Smarty().assign("A_auth", A_auth);
		this.displaySmartyPeculiar(H_sess, A_auth);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};