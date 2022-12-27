//
//Canonインポートプロセス
//
//@uses ProcessBaseBatch
//@package
//@author web
//@since 2013/06/18
//


import ProcessBaseBatch from "../../../class/process/ProcessBaseBatch";
// require("process/ProcessBaseBatch.php");


import ImportCanonModel from "../../model/script/ImportCanonModel";
// require("model/script/ImportCanonModel.php");


import ImportCanonView from "../../view/script/ImportCanonView";
// require("view/script/ImportCanonView.php");


import MtTableUtil from "../../MtTableUtil";
// require("MtTableUtil.php");

export default class ImportCanonProc extends ProcessBaseBatch {
	canonModel!: ImportCanonModel;
	canonView!: ImportCanonView;

	constructor(H_param: {} | any[] = Array()) {
		super();
		this.getSetting().loadConfig("copy");
	}

	doExecute(H_param: {} | any[] = Array()) //多重起動防止
	//ログディレクトリ作成
	//請求データディレクトリチェック
	//処理対象社取得
	//処理
	//多重動作チェック解除
	{

		var model = this.getCanonModel();

		var view = this.getCanonView();
		model.setView(view);
		this.lockProcess(view.get_ScriptName());
		this.infoOut("canon：インポート処理開始\n");
		this.set_Dirs(view.get_ScriptName());

		var dataDir = model.setCommonDataDir().getCommonDataDir();

		if (!dataDir) {
			this.errorOut(1000, "canon：インポート処理開始\n", 0, "", "");
			throw process.exit(-1);
		}

		if (1 > model.makePactList().getPactCount()) {
			this.errorOut(1000, "canon:請求データファイルがみつかりません\n", 0, "", "");
			throw process.exit(-1);
		}

		model.setTableNo(MtTableUtil.getTableNo(view.get_HArgv("-y"), false));

		var pactList = model.getPactList();


		for (var pactid of pactList) //処理中の会社設定->ファイル解析
		{
			this.infoOut("canon：PactId=" + pactid + "の処理開始\n");

			if (model.setPactId(pactid).analysisFile()) //既存データ削除
				//終了ディレクトリへ
				{
					model.begin();

					if (!model.deleteDetailsData()) {
						this.errorOut(1000, "canon：旧データの削除に失敗しました\m", 0, "", "");
						throw process.exit(-1);
					}

					if (!model.importBillData()) {
						this.errorOut(1000, "canon：請求インポートに失敗しました\n", 0, "", "");
						throw process.exit(-1);
					}

					if (!model.importCopy()) {
						this.errorOut(1000, "canon：コピー機のインポートに失敗しました\n", 0, "", "");
						throw process.exit(-1);
					}

					model.commit();

					var mvDir = dataDir + "/" + pactid;
					this.mvFile(mvDir, mvDir + "/fin");
				}


			var resCnt = model.getSuccessPacts();
			this.infoOut("canon：PactId=" + pactid + "の処理終了(請求：" + resCnt[pactid].addrow + "件　コピー機：" + resCnt[pactid].addcopy + "件)\n");
		}

		resCnt = model.resultCount().getSuccessPacts();
		this.infoOut("canon：インポート処理終了(請求合計：" + resCnt.all.addrow + "件　コピー機合計：" + resCnt.all.addcopy + "件)\n");
		this.unLockProcess(view.get_ScriptName());
		throw process.exit(0);
	}

	getCanonModel() {
		if (!(this.canonModel instanceof ImportCanonModel)) {
			this.canonModel = new ImportCanonModel();
		}

		return this.canonModel;
	}

	getCanonView() {
		if (!(this.canonView instanceof ImportCanonView)) {
			this.canonView = new ImportCanonView();
		}

		return this.canonView;
	}

};
