//error_reporting(E_ALL|E_STRICT);
//
//プロセス実装のサンプル
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Sample
//@author nakanita
//@since 2008/02/08
//
//
//
//プロセス実装のサンプル
//
//@uses ProcessBaseHtml
//@package Sample
//@author nakanita
//@since 2008/02/08
//

require("process/ProcessBaseHtml.php");

require("model/Sample/SampleModel.php");

require("view/Sample/SampleView.php");

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
//プロセス処理の実質的なメイン
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@access protected
//@return void
//
class SampleProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //// view の生成
	//$O_view->startCheck();
	//情報表示には infoOut
	//$this->infoOut("Hello!");
	//デバッグ表示には debugOut
	//$this->debugOut( $this->get_DB() );
	//$this->debugOut( $O_view->getAllAuth() );
	//// model の生成
	//var_dump( $this->getSetting() );
	//暗号化のチェック
	//require_once("MtCryptUtil.php");
	//$O_crypt =& MtCryptUtil::singleton();
	//print $O_crypt->getDecrypt('613faaa58603f8a1');	// mikumiku
	// DEBUG * エラーアウトのテスト
	// DEBUG * MtExceptのテスト
	//MtExcept::raise("テストでエラーしてみました");
	//シンプルな表示
	//$O_view->display( $H_data );
	//Smartyによる表示
	{
		var O_view = new SampleView();
		var O_model = new SampleModel(this.get_DB());
		var H_data = O_model.getData(Array());
		this.getOut().errorOut(15, "\u30C6\u30B9\u30C8\u3067\u30A8\u30E9\u30FC", 0, "", "\u3082\u3069\u308B\u30DC\u30BF\u30F3\u3067\u3059");
		O_view.displaySmarty(H_data);
	}

};