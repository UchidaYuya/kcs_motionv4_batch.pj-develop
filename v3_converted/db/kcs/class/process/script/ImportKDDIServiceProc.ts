//
//KDDIサービス取込み(伊達)
//
//error_reporting(E_ALL|E_STRICT);
//
//ImportKDDIServiceProc
//KDDIサービス取込み
//@uses ProcessBaseBatch
//@package
//@author web
//@since 2017/01/26
//

require("process/script/ImportBaseProc.php");

require("view/script/ImportKDDIServiceView.php");

require("model/script/ImportKDDIServiceModel.php");

//
//__construct
//コンストラクタ
//@author web
//@since 2017/02/22
//
//@param array $H_param
//@access public
//@return void
//
//
//getModel
//modelの作成
//@author web
//@since 2017/02/22
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@param 	 $billdate
//@access protected
//@return void
//
//
//getView
//viewの作成
//@author web
//@since 2017/02/22
//
//@access protected
//@return void
//
//
//doExecute
//実行
//@author web
//@since 2017/01/26
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author date
//@since 2015/07/10
//
//@access public
//@return void
//
class ImportKDDIServiceProc extends ImportBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		this.debug = true;
		super(H_param);
		this.getSetting().loadConfig("kddi_service");
	}

	createModel(billdate) //モデルの取得
	//script情報の設定
	//請求月の設定
	//テーブルの設定(setBillDateの後に呼ぶこと)
	//キャリアIDの設定
	{
		var model = new ImportKDDIServiceModel();
		model.setScriptAmbient(this.get_MtScriptAmbient());
		model.setBillDate(billdate);
		model.setTableName();
		model.setCarrierId(this.getSetting().CARID, this.getSetting().CIRID);
		return model;
	}

	createView() {
		return new ImportKDDIServiceView();
	}

	doExecute(H_param: {} | any[] = Array()) //処理開始
	//初期化
	//処理が終了した pactid を格納するための配列を初期化
	//pactidごとに処理する
	//exit(0);
	{
		this.infoOut("\u53D6\u8FBC\u307F\u958B\u59CB(" + date("Y-m-d H:i:s") + ")\n", 0);
		this.initCommon();
		var A_pactDone = Array();

		for (var pactid of Object.values(this.A_TargetPactid)) //データディレクトリを開く
		//ディレクトリが開けたかチェック
		{
			var dir = this.dataDirectory + "/" + pactid;
			var handle = opendir(dir);

			if (handle === false) {
				this.errorOut(1000, "pactid=" + pactid + "\u306E\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u958B\u3051\u307E\u305B\u3093\u3067\u3057\u305F\n", 0, "", "");
				this.errorOut(1000, dir + "\u304C\u958B\u3051\u306A\u3044\n", 0, "", "");
				continue;
			}

			if (!this.O_model.setPactID(pactid, this.Mode)) {
				closedir(handle);
				this.errorOut(1000, "pactid=" + pactid + "\u306E\u53D6\u8FBC\u307F\u5931\u6557\n", 0, "", "");
				continue;
			}

			while ((filename = readdir(handle)) !== false) //ファイルのみ取得
			{
				var path = dir + "/" + filename;

				if (filetype(path) == "file") //ファイルを読み込んでDBに追加する
					{
						if (this.O_model.addDataByFile(path, this.TargetTable)) {
							this.infoOut("\u53D6\u8FBC\u307F\u6210\u529F(" + path + ")\n", 0);
						} else {
							this.errorOut(1000, "\u53D6\u8FBC\u307F\u5931\u6557(" + path + ")\n", 0, "", "");
						}
					}
			}

			closedir(handle);
		}

		this.endCommon();
		this.infoOut("\u53D6\u8FBC\u307F\u7D42\u4E86(" + date("Y-m-d H:i:s") + ")\n", 0);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};