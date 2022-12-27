import ImportBaseModel from '../../model/script/ImportBaseModel';
import ViewBaseScript from '../../view/script/ViewBaseScript';
import ProcessBaseBatch from '../ProcessBaseBatch';

export default abstract class ImportBaseProc extends ProcessBaseBatch {
	debug: boolean = false;
	PactId: any;
	BillDate: string;
	TargetTable: any;
	Mode: any;
	BackUpFlg: any;
	A_TargetPactid: any;
	dataDirectory: any;
	
	//	objects
	O_model: ImportBaseModel;
	O_view: ViewBaseScript;

	//	abstract関数
	abstract createModel(BillDate : string) : ImportBaseModel;
	abstract createView() : ViewBaseScript;

	constructor(H_param: any = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this.O_view = this.getView();
		this.PactId = this.O_view.get_HArgv("-p");
		this.BillDate = this.O_view.get_HArgv("-y");
		this.TargetTable = this.O_view.get_HArgv("-t");
		this.Mode = this.O_view.get_HArgv("-e");
		this.BackUpFlg = this.O_view.get_HArgv("-b");
		this.O_model = this.getModel();
		this.debug = false;
	}

	getModel() {
		if (this.O_model) {
			return this.O_model;
		}

		return this.createModel(this.BillDate);
	}

	getView() {
		if (this.O_view) {
			return this.O_view;
		}

		return this.createView();
	}

	initCommon() //viewの作成
	//error_reporting(0);
	//ini_set( 'display_errors', 0 );
	//ini_set( 'error_reporting', E_ERROR );	//	警告は表示しない
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//顧客ID(pactid)
	//取込み対象月の指定
	//purchase_tbにも追加するかどうか
	//delete後Copyか追加か
	//バックアップについて
	//modelの作成
	//請求データディレクトリを取得
	//請求データディレクトリチェック（スクリプト終了）
	//処理する契約ＩＤを取得する
	//処理する契約ＩＤ数
	//処理する契約ＩＤが１件もない場合（スクリプト終了）
	{
		this.set_Dirs(this.O_view.get_ScriptName());

		if (!this.debug) {
			this.lockProcess(this.O_view.get_ScriptName());
		}
	
		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.BillDate + "/" + this.getSetting().get("DATA_DIRECTORY");

		if (!this.isDirCheck(dataDir, "rw")) {
			this.errorOut(1000, "請求データファイルディレクトリ（" + dataDir + "）がみつかりません\n", 0, "", "");
			throw process.exit(-1);
		}

		if ("Y" == this.BackUpFlg) {
			var tblist = this.O_model.getBackUpTableNameList();

			for (var tbname of Object.values(tblist)) {
				var expFile = dataDir + "/" + tbname + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";

				if (false == this.expData(tbname, expFile, this.getSetting().get("NUM_FETCH"))) {
					throw process.exit(-1);
				}
			}
		}

		var A_pactid = Array();
		A_pactid = this.getPactList(dataDir, this.PactId);
		var pactCnt = A_pactid.length;

		if (pactCnt <= 0) //エラー出力
			//ロック解除
			{
				this.errorOut(1000, "請求データファイルがみつかりません\n", 0, "", "");
				this.unLockProcess(this.O_view.get_ScriptName());
				throw process.exit(-1);
			}

		this.A_TargetPactid = A_pactid;
		this.dataDirectory = dataDir;
	}

	endCommon() //スクリプトの二重起動防止ロック解除
	{
		if (!this.debug) {
			this.unLockProcess(this.O_view.get_ScriptName());
		}

		this.set_ScriptEnd();
	}
};