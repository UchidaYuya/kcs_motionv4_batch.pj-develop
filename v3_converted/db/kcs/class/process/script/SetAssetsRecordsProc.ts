//
//パーク２４請求データ取込処理 （Process）
//
//更新履歴：<br>
//2010/11/29 宝子山浩平 作成
//
//@package script
//@subpackage Process
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2010/11/29
//@uses MtTableUtil
//@uses PactModel
//@uses BillModel
//@uses PostModel
//@uses FuncModel
//@uses ProcessBaseBatch
//@uses SetAssetsRecordsView
//@uses SetAssetsRecordsModel
//
//
//error_reporting(E_ALL|E_STRICT);

require("MtTableUtil.php");

require("process/ProcessBaseBatch.php");

require("view/script/SetAssetsRecordsView.php");

require("model/script/SetAssetsRecordsModel.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2010/11/29
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author houshiyama
//@since 2010/11/29
//
//@param array $H_param
//@access protected
//@return void
//
//
//初期処理
//
//@author
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//終了処理
//
//@author
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/11/29
//
//@access public
//@return void
//
class SetAssetsRecordsProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.O_View = new SetAssetsRecordsView();
		this.O_Model = new SetAssetsRecordsModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) {
		try //初期処理
		//端末レコードを持たない電話リスト取得
		//端末レコード作成
		{
			this.preExecute();
			this.O_Model.setTables(this.TableNo);
			var A_list = this.O_Model.getList(this.PactId, this.CarId, this.TelNo);

			if (!A_list == true) {
				this.infoOut("\u5BFE\u8C61\u96FB\u8A71\u306F0\u4EF6\u3067\u3057\u305F\n", 1);
			} else {
				this.infoOut("\u5BFE\u8C61\u96FB\u8A71\u306F" + A_list.length + "\u4EF6\u898B\u3064\u304B\u308A\u307E\u3057\u305F\n", 1);
				this.O_Model.createAssetsRecords(this.KeyValue, A_list);
			}

			if (this.Update == "Y") {
				this.infoOut("Update\u3057\u307E\u3059\n", 1);
				var cnt = this.O_Model.updateAssetsRecords(this.PactId, this.CarId, this.TelNo, this.KeyValue);
				this.infoOut(cnt + "\u4EF6\u66F4\u65B0\n", 1);
			}

			this.postExecute();
		} catch (e) {
			this.infoOut(e.getMessage(), 1);
		}
	}

	preExecute() //処理開始
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバー変数に
	{
		this.infoOut("\u8CC7\u7523\u30C7\u30FC\u30BF\u8A2D\u5B9A\u958B\u59CB\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());

		if (false == this.O_View.get_HArgv("-p")) {
			throw new Error("pactid\u306F\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\n");
		} else {
			this.PactId = this.O_View.get_HArgv("-p");
		}

		var H_argv = this.O_View.get_HArgv();
		this.TableNo = undefined !== H_argv["-x"] ? this.O_View.get_HArgv("-x") : undefined;
		this.CarId = undefined !== H_argv["-c"] ? this.O_View.get_HArgv("-c") : undefined;
		this.TelNo = undefined !== H_argv["-t"] ? this.O_View.get_HArgv("-t") : undefined;
		this.KeyValue = undefined !== H_argv["-v"] ? this.O_View.get_HArgv("-v") : undefined;
		this.Update = undefined !== H_argv["-u"] ? this.O_View.get_HArgv("-u") : undefined;
	}

	postExecute() //スクリプトの二重起動防止ロック解除
	//終了
	{
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("\u8CC7\u7523\u30C7\u30FC\u30BF\u8A2D\u5B9A\u7D42\u4E86\n", 1);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};