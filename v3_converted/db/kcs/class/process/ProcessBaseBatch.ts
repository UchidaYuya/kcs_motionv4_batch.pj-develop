//
//バッチの基底クラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ProcessBaseBatch
//@abstract
//@package Base
//@subpackage Process
//@filesource
//@author nakanita
//@since 2008/02/08
//
//
//error_reporting(E_ALL);
//
//バッチの基底クラス
//
//@uses ProcessBaseBatch
//@abstract
//@package Base
//@subpackage Process
//@author nakanita
//@since 2008/02/08
//

require("process/ProcessBaseDB.php");

require("MtOutput.php");

require("MtScriptAmbient.php");

//
//スクリプトが正常に終了したかを格納
//
//デフォルトはfalse で、子のスクリプトクラスが<br>
//処理動作の最後に true をたてる運用方法
//
//@private
//@var boolean
//
//
//スクリプト用　環境処理系オブジェクト
//
//@var MtScriptAmbient
//@access private
//
//
//コンストラクタ
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
//@since 2008/03/18
//
//@access public
//@return void
//
//
//スクリプトが正常終了したときにフラグをtrueにする
//
//@author ishizaki
//@since 2008/03/18
//
//@access public
//@return void
//
//
//メンバーにあるMtScriptAmbientオブジェクトを返す
//
//@author ishizaki
//@since 2008/03/18
//
//@access protected
//@return MtScriptAmbient
//
//
//スクリプトの固有ログの作成など
//
//受け取ったスクリプト名を元に /kcs/log 以下に固有ディレクトリを無かったら作る
//
//@author ishizaki
//@since 2008/03/18
//
//@param String $scriptname
//@access protected
//@return void
//
//
//MtScriptAmbientのisDirCheckでチェック
//
//@author ishizaki
//@since 2008/03/18
//
//@param String $dirpath
//@access protected
//@return boolean
//
//
//MtScriptAmbientのgetPactListでpactの一覧を取得
//
//@author ishizaki
//@since 2008/03/18
//
//@param String $datadir
//@param String $argv_p
//@access protected
//@return void
//
//
//MtScriptAmbientのgetFileListのラッパー
//
//@author maeda
//@since 2008/04/09
//
//@param mixed $datadir
//@access protected
//@return void
//
//
//MtScriptAmbientのexpDataのラッパー
//
//@author maeda
//@since 2008/04/17
//
//@param mixed $table
//@param mixed $outFileName
//@param mixed $fetchRow
//@access protected
//@return void
//
//
//MtScriptAmbientのmvFileのラッパー
//
//@author maeda
//@since 2008/04/18
//
//@param mixed $fromDir
//@param mixed $toDir
//@access protected
//@return void
//
//
//MtScriptAmbientのmakeDirのラッパー
//
//@author maeda
//@since 2009/06/02
//
//@param mixed $targetDir
//@access protected
//@return void
//
//
//MtScriptAmbientのロックを呼び出す
//
//@author ishizaki
//@since 2008/03/18
//
//@param String $scriptname
//@access protected
//@return void
//
//
//MtScriptAmbientのアンロックを呼び出す
//
//@author ishizaki
//@since 2008/03/18
//
//@param String $scriptname
//@access protected
//@return void
//
//
//ファイルの存在確認、権限チェックなど
//
//@author ishizaki
//@since 2008/03/18
//
//@param String $filepath
//@access protected
//@return String
//
class ProcessBaseBatch extends ProcessBaseDB {
	constructor(H_param: {} | any[] = Array()) //バッチの共通設定
	{
		super(MtOutput.SITE_BATCH, H_param);
		this.ScriptEnd = false;
		this.O_MtScriptAmbient = new MtScriptAmbient();
		this.getOut().scriptCommonOut("@BEGIN-KCSMotionScript:" + basename(_SERVER.PHP_SELF) + " \u958B\u59CB\n");
		this.getSetting().loadConfig("define");
		this.getSetting().loadConfig("batch");
	}

	__destruct() {
		super.__destruct();

		if (this.ScriptEnd == true) {
			var str = " \u6B63\u5E38\u7D42\u4E86";
		} else {
			str = " \u4E0D\u6B63\u7D42\u4E86";
		}

		this.getOut().scriptCommonOut("@END-KCSMotionScrpt:" + basename(_SERVER.PHP_SELF) + str + "\n");
	}

	set_ScriptEnd() {
		this.ScriptEnd = true;
	}

	get_MtScriptAmbient() {
		return this.O_MtScriptAmbient;
	}

	set_Dirs(scriptname) //固有ディレクトリ作成場所
	{
		var log_dir = this.getSetting().script_own_dir + "/" + basename(scriptname, ".php");

		if (false == this.O_MtScriptAmbient.isDirCheck(log_dir)) //作成に失敗
			{
				this.infoOut("\u30B9\u30AF\u30EA\u30D7\u30C8\u56FA\u6709\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u5B58\u5728\u3057\u306A\u3044\u305F\u3081\u3001\u4F5C\u6210\u3057\u307E\u3059\uFF1A" + log_dir + "\n");

				if (false == mkdir(log_dir)) {
					this.errorOut(0, "\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\u3002\n");
				}
			}

		this.O_MtScriptAmbient.set_ScriptLog(log_dir);
	}

	isDirCheck(dirpath) {
		return this.O_MtScriptAmbient.isDirCheck(dirpath);
	}

	getPactList(datadir, argv_p) {
		return this.O_MtScriptAmbient.getPactList(datadir, argv_p);
	}

	getFileList(datadir) {
		return this.O_MtScriptAmbient.getFileList(datadir);
	}

	expData(table, outFileName, fetchRow) {
		return this.O_MtScriptAmbient.expData(table, outFileName, fetchRow);
	}

	mvFile(fromDir, toDir) {
		return this.O_MtScriptAmbient.mvFile(fromDir, toDir);
	}

	makeDir(targetDir) {
		return this.O_MtScriptAmbient.makeDir(targetDir);
	}

	lockProcess(scriptname) {
		this.O_MtScriptAmbient.lockProcess(scriptname);
	}

	unLockProcess(scriptname) {
		this.O_MtScriptAmbient.unLockProcess(scriptname);
	}

	isFileCheck(filepath) {
		return this.O_MtScriptAmbient.isFileCheck(filepath);
	}

};