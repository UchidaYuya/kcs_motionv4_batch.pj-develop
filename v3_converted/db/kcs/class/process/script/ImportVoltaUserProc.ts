//
//Voltaユーザ取込処理 （Process）
//
//更新履歴：<br>
//2010/08/05 石崎公久 作成
//
//@package script
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@filesource
//@since 2010/08/05
//@uses MtTableUtil
//@uses PactModel
//@uses BillModel
//@uses PostModel
//@uses TelModel
//@uses FuncModel
//@uses ProcessBaseBatch
//@uses ImportVoltaView
//@uses ImportVoltaModel
//
//error_reporting(E_ALL|E_STRICT);
//
//Voltaユーザ取込処理 （Process）
//
//@uses ProcessBaseBatch
//@package script
//@author ishizaki
//@since 2010/08/05
//

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/TelModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/ImportVoltaUserView.php");

require("model/script/ImportVoltaUserModel.php");

//
//コンストラクタ
//
//@author ishizaki
//@since 2010/08/05
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author ishizaki
//@since 2010/08/05
//
//@param array $H_param
//@access protected
//@return void
//
//
//ユーザデータの取り込み
//
//@author
//@since 2010/08/09
//
//@access protected
//@return void
//
//
//外部APIからデータの取得
//
//@author  ishizaki
//@since 2010/08/06
//
//@access protected
//@return void
//
//
//getApiUrl
//
//@author ishizaki
//@since 2010/08/06
//
//@access protected
//@return void
//
//
//_scriptEnd
//
//@author
//@since 2010/08/06
//
//@access protected
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2010/08/05
//
//@access public
//@return void
//
class ImportVoltaUserProc extends ProcessBaseBatch {
	static API_URI = "member/evimport/";

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//設定取得
	//View,Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("volta");
		this.O_View = new ImportVoltaUserView();
		this.O_Model = new ImportVoltaUserModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//処理開始
	//スクリプトの二重起動防止ロック
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.infoOut("Volta\u30E6\u30FC\u30B6\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);
		this.lockProcess(this.O_View.get_ScriptName());

		try //引数の値をメンバーに
		//ユーザ一覧の取得l
		//取得データの取り込み
		{
			this.PactIds = this.O_Model.getPactIds(this.O_View.get_HArgv("-p"));

			this._setUserData();

			this._importUser();
		} catch (e) {
			this.infoOut(e.getMessage() + "\n", 1);

			this._scriptEnd();
		}

		this._scriptEnd();
	}

	_importUser() {
		if ("1000" != this._returnData.responsecode) {
			throw new Error("\u901A\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002");
		}

		this.infoOut("\u901A\u4FE1\u306B\u6210\u529F\u3057\u307E\u3057\u305F\u3002\n", 1);
		var evUsers = this._returnData.evlist;
		var evUsersCount = evUsers.length;

		if (1 > evUsersCount) {
			throw new Error("\u53D6\u308A\u8FBC\u307F\u53EF\u80FD\u306A\u30C7\u30FC\u30BF\u306F\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
		}

		this.infoOut("\u53D6\u308A\u8FBC\u307F\u5BFE\u8C61" + evUsersCount + "\u4EF6\u3002\n", 1);

		for (var i = 0; i < evUsersCount; i++) {
			var res = this.O_Model.saveUserData(evUsers[i]);
		}
	}

	_setUserData() {
		var postData = {
			apikey: this.getSetting().API_KEY,
			pactcodes: this.PactIds
		};
		var params = {
			http: {
				method: "POST",
				header: [this.getSetting().VOLTA_HEADER, this.getSetting().VOLTA_CONTENT_TYPE],
				content: http_build_query(postData)
			}
		};
		var fp = fopen(this._getApiUrl(), "rb", false, stream_context_create(params));

		if (false == fp) {
			throw new Error("\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
		}

		parse_str(stream_get_contents(fp), this._returnData);
	}

	_getApiUrl() {
		return this.getSetting().VOLTA_URL + ImportVoltaUserProc.API_URI;
	}

	_scriptEnd() //スクリプトの二重起動防止ロック解除
	//スクリプト終了処理
	{
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("Volta\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 1);
		throw die();
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};