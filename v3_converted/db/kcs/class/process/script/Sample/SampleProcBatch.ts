//
//プロセス実装のサンプル（バッチ編）
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ProcessBaseBatch
//@package Sample
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/02/22
//
//
//error_reporting(E_ALL|E_STRICT);
//
//プロセス実装のサンプル（バッチ編）
//
//@uses ProcessBaseBatch
//@package Sample
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/02/22
//

require("process/ProcessBaseBatch.php");

require("model/script/Sample/SampleModel.php");

require("view/script/Sample/SampleViewBatch.php");

//
//コンストラクター
//
//@author ishizaki
//@since 2008/02/22
//
//@param array $H_param
//@param array $H_argv
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author ishizaki
//@since 2008/02/22
//
//@param array $H_param
//@access protected
//@return void
//
class SampleProcBatch extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //// view の生成
	//情報表示には infoOut
	//// model の生成
	//$H_data = $O_model->getData( array() );
	//シンプルな表示
	{
		var O_view = new SampleViewBatch(this.getSetting(), this.getOut());
		this.infoOut("Hello!\n");
		var O_model = new SampleModel(this.getSetting(), this.getOut(), this.get_DB());
		O_view.display();
	}

};