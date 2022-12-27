//error_reporting(E_ALL);
//
//データベースを利用するプロセス基底クラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ProcessBase
//@abstract
//@package Base
//@subpackage Process
//@filesource
//@author nakanita
//@since 2008/02/08
//
//
//
//データベースを利用するプロセス基底クラス
//
//@uses ProcessBase
//@abstract
//@package Base
//@subpackage Process
//@author nakanita
//@since 2008/02/08
//

require("process/ProcessBase.php");

require("MtDBUtil.php");

//
//DB接続オブジェクト
//
//@var object
//@access private
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param integer $site WEB/BATCHのいずれか、省略時には自動判定
//@param array $H_param
//@access public
//@return void
//
//
//データベース接続オブジェクトを得る
//
//更新履歴<br>
//2008/03/07 メソッド名を getDB get_DB
//
//@author nakanita
//@since 2008/02/08
//
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
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class ProcessBaseDB extends ProcessBase {
	constructor(site = "", H_param: {} | any[] = Array()) {
		super(site, H_param);
		this.O_DB = MtDBUtil.singleton();
	}

	get_DB() {
		return this.O_DB;
	}

	execute(H_param: {} | any[] = Array()) {
		try {
			this.doExecute(H_param);
		} catch (ex) {
			if (ex instanceof MtExcept) {
				this.get_DB().rollbackAll();
				this.caught(ex);
			} else if (true) {
				this.get_DB().rollbackAll();
				this.caughtUnknown(ex);
			}
		}
	}

	__destruct() {
		super.__destruct();
	}

};