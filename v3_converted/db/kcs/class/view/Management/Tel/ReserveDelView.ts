//
//予約削除のview
//
//更新履歴：<br>
//2008/08/15 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/08/15
//@filesource
//@uses ManagementViewBase
//@uses MtExceptReload
//
//
//error_reporting(E_ALL);
//
//予約削除のview
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/08/15
//@uses ManagementViewBase
//@uses MtExceptReload
//

require("view/Management/ManagementViewBase.php");

//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/08/15
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//セッションが無い時デフォルト値を入れる
//
//@author houshiyama
//@since 2008/08/15
//
//@access private
//@return void
//
//
//CGIパラメータのチェックを行う<br>
//
//配列をセッションに入れる<br>
//
//@author houshiyama
//@since 2008/08/15
//
//@access public
//@return void
//@uses MtExceptReload
//
//
//終了処理（menu.phpへ） <br>
//
//@author houshiyama
//@since 2008/08/15
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/15
//
//@access public
//@return void
//
class ReserveDelView extends ManagementViewBase {
	constructor() {
		super();
	}

	setDefaultSession() {}

	checkCGIParam() //削除が実行された時
	{
		this.setDefaultSession();

		if (_GET.length > 0) {
			this.H_Local.get = _GET;
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}
	}

	endReserveDel() //メニューへリダイレクト
	{
		MtExceptReload.raise("/Management/Tel/menu.php#reserve_look");
	}

	__destruct() {
		super.__destruct();
	}

};