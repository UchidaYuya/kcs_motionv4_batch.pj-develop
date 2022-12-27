//
//clamptask_tb消去プロセス
//
//更新履歴：<br>
//2009/09/08 宮澤龍彦 作成
//
//@uses ProcessBaseBatch
//@package DelClamptask
//@filesource
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/09/08
//
//
//error_reporting(E_ALL|E_STRICT);
//
//clamptask_tb消去プロセス
//
//@uses ProcessBaseBatch
//@package SBDownload
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/09/08
//

require("process/ProcessBaseBatch.php");

require("model/script/DelClamptaskModel.php");

require("view/script/DelClamptaskView.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2009/09/08
//
//@param array $H_param
//@param array $H_argv
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author miyazawa
//@since 2009/09/08
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2009/09/08
//
//@access public
//@return void
//
class DelClamptaskProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("au_download");
		this.O_View = new DelClamptaskView();
		this.O_Model = new DelClamptaskModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //引数の値をメンバーに
	{
		if ("" != this.O_View.ScriptName) //スクリプトの二重起動防止ロック解除
			{
				this.unLockProcess(this.O_View.ScriptName);
			}
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};