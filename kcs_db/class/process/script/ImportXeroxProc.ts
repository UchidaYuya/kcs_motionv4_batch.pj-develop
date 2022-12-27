import ProcessBaseBatch from "../ProcessBaseBatch";
import ImportXeroxModel from "../../model/script/ImportXeroxModel";
import ImportXeroxView from "../../view/script/ImportXeroxView";
import MtTableUtil from "../../MtTableUtil";

//
//__construct
//
//@author web
//@since 2013/04/19
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author web
//@since 2013/04/19
//
//@param array $H_param
//@access protected
//@return void
//
//
//XEROXのインポートモデルオブジェクトを取得
//
//@author web
//@since 2013/04/18
//
//@access protected
//@return void
//
//
//XEROXのインポートビューオブジェクトを取得
//
//@author web
//@since 2013/04/18
//
//@access protected
//@return void
//
export default class ImportXeroxProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) {
		super();
		this.getSetting().loadConfig("copy");
	}

	async doExecute(H_param: {} | any[] = Array()) //多重起動防止
	//ログディレクトリ作成
	//請求データディレクトリチェック
	//処理対象社取得
	//処理
	//多重動作チェック解除
	{
// 2022cvt_015
		var model = new ImportXeroxModel();
// 2022cvt_015
		var view = new ImportXeroxView();
		model.setView(view);
		await this.lockProcess(view.get_ScriptName());
		this.infoOut("XEROXインポート処理開始\n");
		this.set_Dirs(view.get_ScriptName());
// 2022cvt_015
		var dataDir = model.setCommonDataDir().getCommonDataDir();

		if (!dataDir) {
			this.errorOut(1000, "XEROX:請求データファイル・ディレクトリが見つかりません", 0, "", "");
			throw process.exit(-1);// 2022cvt_009
		}

		if (1 > model.makePactList().getPactCount()) {
			this.errorOut(1000, "XEROX:請求データファイルがみつかりません\n", 0, "", "");
			throw process.exit(-1);// 2022cvt_009
		}

		model.setTableNo(MtTableUtil.getTableNo(view.get_HArgv("-y"), false));
// 2022cvt_015
		var pactList = model.getPactList();

// 2022cvt_015
		for (var pactid of (pactList)) //処理中の会社設定->ファイル解析
		{
			this.infoOut("XEROX:PactId=" + pactid + "の処理開始\n");

			if (await model.setPactId(pactid).analysisFile()) //既存データ削除
				//終了ディレクトリへ
				{
					await model.begin();

					if (!await model.deleteDetailsData()) {
						this.errorOut(1000, "XEROX:旧データの削除に失敗しました\n", 0, "", "");
						throw process.exit(-1);// 2022cvt_009
					}

					if (!await model.importBillData()) {
						this.errorOut(1000, "XEROX:請求インポートに失敗しました\n", 0, "", "");
						throw process.exit(-1);// 2022cvt_009
					}

					if (!await model.importCopy()) {
						this.errorOut(1000, "XEROX:コピー機のインポートに失敗しました\n", 0, "", "");
						throw process.exit(-1);// 2022cvt_009
					}

					await model.commit();
// 2022cvt_015
					var mvDir = dataDir + "/" + pactid;
					this.mvFile(mvDir, mvDir + "/fin");
				}

// 2022cvt_015
			var resCnt = model.getSuccessPacts();
			this.infoOut("XEROX:PactId=" + pactid + "の処理終了(請求:" + resCnt[pactid].addrow + "件　コピー機：" + resCnt[pactid].addcopy + "件)\n");
		}

		resCnt = model.resultCount().getSuccessPacts();
		this.infoOut("XEROX:インポート処理終了(請求合計：" + resCnt.all.addrow + "件　コピー機合計：" + resCnt.all.addcopy + "件)\n");
		this.unLockProcess(view.get_ScriptName());
		throw process.exit(0);// 2022cvt_009
	}
};
