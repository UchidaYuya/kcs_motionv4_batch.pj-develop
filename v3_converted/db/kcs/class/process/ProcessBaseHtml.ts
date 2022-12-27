//error_reporting(E_ALL);
//
//ウェブページ表示の基底クラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ProcessBaseDB
//@abstract
//@package Base
//@subpackage Process
//@filesource
//@author nakanita
//@since 2008/02/08
//
//
//
//ウェブページ表示の基底クラス
//
//@uses ProcessBaseDB
//@abstract
//@package Base
//@subpackage Process
//@author nakanita
//@since 2008/02/08
//

require("MtExceptReload.php");

require("process/ProcessBaseDB.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス実行の起点となる関数
//いわゆるメイン関数
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@access public
//@return void
//
//
//リロード例外を受け取った後の処理ハンドラー
//指定されたページに飛ぶ
//
//@author nakanita
//@since 2008/02/08
//
//@param MtExceptReload $ex リロード例外
//@access protected
//@return void
//
//
//デストラクター
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class ProcessBaseHtml extends ProcessBaseDB {
	constructor(H_param: {} | any[] = Array()) {
		super(MtOutput.SITE_WEB, H_param);
	}

	execute(H_param: {} | any[] = Array()) {
		try {
			this.doExecute(H_param);
		} catch (ex) {
			if (ex instanceof MtExceptReload) {
				this.get_DB().rollbackAll();
				this.caughtReload(ex);
			} else if (ex instanceof MtExcept) {
				this.get_DB().rollbackAll();
				this.caught(ex);
			} else if (true) {
				this.get_DB().rollbackAll();
				this.caughtUnknown(ex);
			}
		}
	}

	caughtReload(ex: MtExceptReload) {
		header("Location: " + ex.getUrl());
		throw die(0);
	}

	__destruct() {
		super.__destruct();
	}

};