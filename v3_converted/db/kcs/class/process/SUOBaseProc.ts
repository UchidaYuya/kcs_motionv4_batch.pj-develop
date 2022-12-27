//
//SUO基底　(process)
//
//更新履歴：<br>
//2008/03/28 石崎公久 作成
//
//@uses ProcessBaseBatch
//@package SUO
//@subpackage Process
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/28
//
//
//error_reporting(E_ALL|E_STRICT);
//
//SUO基底　(process)
//
//@uses ProcessBaseBatch
//@package SUO
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/28
//

require("process/ProcessBaseBatch.php");

//
//コンストラクター
//
//SUOの設定ファイルを起動時に読み込む
//
//@author ishizaki
//@since 2008/08/05
//
//@param array $H_param
//@access public
//@return void
//
//
//エラーが起きた電話番号の処理
//
//請求情報のレコード確認時に処理対象の電話番号について<br>
//何らかのエラーが発生した場合にこの関数を呼び出す。
//この関数が前回呼ばれたときと同じ電話番号で呼び出され<br>
//ていた場合は、何もせず呼び出し元に戻る。<br>
//そうでない場合は、エラー電話番号を入れ替え、エラー<br>
//メッセージを表示し、呼び出し元に戻る。
//
//@author ishizaki
//@since 2008/04/04
//
//@param string $telno
//@param string $errorcode
//@param string $errormsg
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
class SUOBaseProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.getSetting().loadConfig("SUO");
	}

	errorTel(telno, errorcode, errormsg) {
		if (this.TelNoError != telno) {
			this.TelNoError = telno;
			this.errorOut(errorcode, errormsg);
		}
	}

	__destruct() {
		super.__destruct();
	}

};