//
//管理情報一覧の基底クラス
//
//更新履歴：<br>
//2008/05/28 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/05/28
//@filesource
//@uses ManagementViewBase
//
//
//error_reporting(E_ALL);
//
//管理情報一覧の基底クラス
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/05/28
//@uses ManagementViewBase
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
//@since 2008/05/28
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//各ページ（管理）固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/05/28
//
//@abstract
//@access protected
//@return void
//
//
//CGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//キャリア選択が実行されたら配列に入れる<br>
//回線選択が実行されたら配列に入れる<br>
//
//配列をセッションに入れる<br>
//
//@author houshiyama
//@since 2008/05/28
//
//@access public
//@return void
//@uses MtExceptReload
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
//@since 2008/05/28
//
//@param array $H_sess（CGIパラメータ）
//@param array $H_data（マスターデータ）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/28
//
//@access public
//@return void
//
class ManagementAjaxViewBase extends ManagementViewBase {
	constructor() {
		super();
	}

	checkCGIParam() //各ページ固有のcheckCGI実行
	//パラメータは消す
	{
		this.checkCGIParamPeculiar();
		this.O_Sess.setSelfAll(this.H_Local);

		if (_POST.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	displaySmarty(H_sess: {} | any[], H_data: {} | any[]) //ページ固有の表示処理
	//display
	{
		this.displaySmartyPeculiar(H_sess, H_data);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};