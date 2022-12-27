import ImportBaseProc from "../../process/script/ImportBaseProc"
import ImportKDDIServiceView from "../../view/script/ImportKDDIServiceView";
import ImportKDDIServiceModel from "../../model/script/ImportKDDIServiceModel";
import * as fs from "fs";
// import * as fs from "fs";
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
export default class ImportKDDIServiceProc extends ImportBaseProc {
	// debug: any;
	// A_TargetPactid: any;
	// dataDirectory: any;
	// O_model: any;
	// Mode: any;
	// TargetTable: any;
	// getSetting: any;
	// get_MtScriptAmbient: any;
	// infoOut: any;
	// initCommon: any;
	// errorOut: any;
	// endCommon: any;

	constructor(H_param: {} | any[] = Array()) {
		super();
		this.debug = true;
		super(H_param);
		this.getSetting().loadConfig("kddi_service");
	}

	createModel(billdate: string) //モデルの取得
	//script情報の設定
	//請求月の設定
	//テーブルの設定(setBillDateの後に呼ぶこと)
	//キャリアIDの設定
	{
// 2022cvt_015
		var model = new ImportKDDIServiceModel();
		model.setScriptAmbient(this.get_MtScriptAmbient());
		model.setBillDate(billdate);
		model.setTableName();
		model.setCarrierId(this.getSetting().get("CARID"), this.getSetting().get("CIRID"));
		return model;
	}

	createView() {
		return new ImportKDDIServiceView();
	}

	async doExecute(H_param: {} | any[] = Array()) //処理開始
	//初期化
	//処理が終了した pactid を格納するための配列を初期化
	//pactidごとに処理する
	//exit(0);
	{
		// this.infoOut("\u53D6\u8FBC\u307F\u958B\u59CB(" + date("Y-m-d H:i:s") + ")\n", 0);
		this.infoOut("取込み開始(" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ")\n", 0);
		this.initCommon();
// 2022cvt_015
		var A_pactDone = Array();

// 2022cvt_015
		for (var pactid of (this.A_TargetPactid)) //データディレクトリを開く
		//ディレクトリが開けたかチェック
		{
// 2022cvt_015
			var dir = this.dataDirectory + "/" + pactid;

			try {
				var handle = fs.readdirSync(dir);
			} catch (e) {
				this.errorOut(1000, "pactid=" + pactid + "のデータディレクトリが開けませんでした\n", 0, "", "");
				this.errorOut(1000, dir + "が開けない\n", 0, "", "");
				continue;
			}

			// if (!this.O_model.setPactID(pactid, this.Mode)) {
			// 	// closedir(handle);
			// 	this.errorOut(1000, "pactid=" + pactid + "の取込み失敗\n", 0, "", "");
			// 	continue;
			// }

			for (var __filename of handle)
			// while ((__filename = fs.readdirSync(handle)) !== null) //ファイルのみ取得// 2022cvt_005
			{
// 2022cvt_015
				var path = dir + "/" + __filename;

// 2022cvt_016
				// if (fs.filetype(path) == "file") //ファイルを読み込んでDBに追加する
				// if (filetype(path) == "file") //ファイルを読み込んでDBに追加する
				if (fs.statSync(path).isFile()) //ファイルを読み込んでDBに追加する
					{
						if (await this.O_model.addDataByFile(path, this.TargetTable)) {
							this.infoOut("取込み成功(" + path + ")\n", 0);
						} else {
							this.errorOut(1000, "取込み失敗(" + path + ")\n", 0, "", "");
						}
					}
			}

			// closedir(handle);
		}

		this.endCommon();
		// this.infoOut("\u53D6\u8FBC\u307F\u7D42\u4E86(" + date("Y-m-d H:i:s") + ")\n", 0);
		this.infoOut("取込み終了(" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ")\n", 0);
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
