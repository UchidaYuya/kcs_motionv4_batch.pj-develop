//
//注文Proc基底クラス
//
//更新履歴：<br>
//2008/04/01 宮澤龍彦 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2008/04/01
//
//
//error_reporting(E_ALL|E_STRICT);
//
//注文Proc基底クラス
//
//@uses ProcessBaseHtml
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("process/ProcessBaseHtml.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author miyazawa
//@since 2008/04/01
//
//@abstract
//@access protected
//@return void
//
//
//各ページのモデル取得
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//
//
//プロセス処理の実質的なメイン<br>
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_param
//@abstract
//@access protected
//@return void
//@uses
//@uses
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class OrderProcBase extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	__destruct() {
		super.__destruct();
	}

};