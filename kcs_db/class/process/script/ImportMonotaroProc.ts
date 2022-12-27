import PactModel from "../../model/PactModel";
import BillModel from "../../model/BillModel";
import PostModel from "../../model/PostModel";
import FuncModel from "../../model/FuncModel";
import ProcessBaseBatch from "../ProcessBaseBatch";
import ImportMonotaroView from "../../view/script/ImportMonotaroView";
import ImportMonotaroModel from "../../model/script/ImportMonotaroModel";

import * as fs from "fs";

export default class ImportMonotaroProc extends ProcessBaseBatch {

	static dirmono = "MonotaRO";
	PactId!: string;
	BillDate: string | undefined;
	BackUpFlg: string | undefined;
	Mode!: string;
	TargetTable!: string;

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this.getSetting().loadConfig("monotaro");
	}

	async doExecute(H_param: {} | any[] = Array()) //viewの作成
// 	//error_reporting(0);// 2022cvt_011
	//ini_set( 'display_errors', 0 );
// 	//ini_set( 'error_reporting', E_ERROR );	//	警告は表示しない// 2022cvt_011
	//固有ログディレクトリの作成取得
	//処理開始
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//顧客ID(pactid)
	//取込み対象月の指定
	//purchase_tbにも追加するかどうか
	//delete後Copyか追加か
	//バックアップについて
	//modelの作成
	//請求データディレクトリを取得
	//請求データディレクトリチェック（スクリプト終了）
	//処理する契約ＩＤ配列を初期化
	//処理する契約ＩＤを取得する
	//処理する契約ＩＤ数
	//処理する契約ＩＤが１件もない場合（スクリプト終了）
	//pactidごとに処理する
	//スクリプトの二重起動防止ロック解除
	//終了
	//exit(0);
	{
// 2022cvt_015
		var O_view = new ImportMonotaroView();
		this.set_Dirs(O_view.get_ScriptName());
		// this.infoOut("\u53D6\u8FBC\u307F\u958B\u59CB(" + date("Y-m-d H:i:s") + ")\n", 0);
		this.infoOut("取込み開始(" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ")\n", 0);
		this.lockProcess(O_view.get_ScriptName());
		this.PactId = O_view.get_HArgv("-p");
		this.BillDate = O_view.get_HArgv("-y");
		this.TargetTable = O_view.get_HArgv("-t");
		this.Mode = O_view.get_HArgv("-e");
		this.BackUpFlg = O_view.get_HArgv("-b");
// 2022cvt_015
		var O_model = new ImportMonotaroModel(this.get_MtScriptAmbient(), this.BillDate);
// 2022cvt_015
		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.BillDate + "/" + ImportMonotaroProc.dirmono;

		if (!this.isDirCheck(dataDir, "rw")) {
			this.errorOut(1000, "請求データファイルディレクトリ" + dataDir + "がみつかりません\n", 0, "", "");
			throw process.exit(-1);// 2022cvt_009
		}

		if ("Y" == this.BackUpFlg) //xxテーブルのバックアップ
			{
// 2022cvt_015
				var tbno = O_model.getTableNo();
// 2022cvt_015
				var purchdetails_tb = "purchase_details_" + tbno + "_tb";
// 2022cvt_015
				// var expFile = dataDir + "/" + purchdetails_tb + date("YmdHis") + ".exp";
				var expFile = dataDir + "/" + purchdetails_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";

				if (false == this.expData(purchdetails_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
					throw process.exit(-1);// 2022cvt_009
				}
			}

// 2022cvt_015
		var A_pactid = Array();
		A_pactid = this.getPactList(dataDir, this.PactId);
// 2022cvt_015
		var pactCnt = A_pactid.length;

		if (pactCnt <= 0) //エラー出力
			//ロック解除
			{
				this.errorOut(1000, "請求データファイルがみつかりません\n", 0, "", "");
				this.unLockProcess(O_view.get_ScriptName());
				throw process.exit(-1);// 2022cvt_009
			}

// 2022cvt_015
		var A_pactDone = Array();

// 2022cvt_015
		for (var pactid of (A_pactid)) //データディレクトリを開く
		//ディレクトリが開けたかチェック
		//ファイル一つずつ取得する
		//ディレクトリを閉じる
		//エラーでなければコミット
		{
// 2022cvt_015
			var dir = dataDir + "/" + pactid;
// 2022cvt_015
			// var handle = openDir(dir);// 2022cvt_004
			var handle;
			try {
				handle = fs.readdirSync(dir);
			} catch (e) {
				this.errorOut(1000, "pactid=" + pactid + "のデータディレクトリが開けませんでした\n", 0, "", "");
				this.errorOut(1000, dir + "が開けない\n", 0, "", "");
				continue;
			}

			if (!O_model.setPactID(pactid, this.Mode)) {
				// closedir(handle);
				this.errorOut(1000, "pactid=" + pactid + "の取込み失敗\n", 0, "", "");
				continue;
			}

			O_model.beginTransaction();
// 2022cvt_015
			var bError = false;
// 2022cvt_015
			var bSuccess = false;

			for (var __filename of handle)
			// while ((__filename = fs.readdirSync(handle)) !== null) //ファイルのみ取得// 2022cvt_005
			{
// 2022cvt_015
				var path = dir + "/" + __filename;

// 2022cvt_016
				// if (filetype(path) == "file") //ファイルを読み込んでDBに追加する
				if (fs.statSync(path).isFile()) //ファイルを読み込んでDBに追加する
					{
						if (await O_model.addDataByFile(path, this.TargetTable)) //読み込み成功しました
							{
								bSuccess = true;
							} else //何かしらのエラー。ロールバックする
							{
								bError = true;
								O_model.rollback();
								this.errorOut(1000, "pactid=" + pactid + "の取込み失敗\n", 0, "", "");
								break;
							}
					}
			}

			// closedir(handle);

			if (!bError && bSuccess) //ASP追加
				//コミットする
				{
					O_model.addASP();
					O_model.commit();
				}
		}

		this.unLockProcess(O_view.get_ScriptName());
		this.set_ScriptEnd();
		// this.infoOut("\u53D6\u8FBC\u307F\u7D42\u4E86(" + date("Y-m-d H:i:s") + ")\n", 0);
		this.infoOut("取込み終了(" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ")\n", 0);
		console.log(123);
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
