//
//Canonインポートプロセス
//
//@uses ProcessBaseBatch
//@package
//@author web
//@since 2013/06/18
//

require("process/ProcessBaseBatch.php");

require("model/script/ImportCanonModel.php");

require("view/script/ImportCanonView.php");

require("MtTableUtil.php");

//
//__construct
//
//@author web
//@since 2013/06/19
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author web
//@since 2013/06/19
//
//@param array $H_param
//@access protected
//@return void
//
//
//canonのインポートモデルオブジェクトを取得
//
//@author web
//@since 2013/06/18
//
//@access protected
//@return void
//
//
//canonのインポートビューオブジェクトを取得
//
//@author web
//@since 2013/06/18
//
//@access protected
//@return void
//
class ImportCanonProc extends ProcessBaseBatch {
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
		this.infoOut("canon\uFF1A\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u958B\u59CB\n");
		this.set_Dirs(view.get_ScriptName());
		var dataDir = model.setCommonDataDir().getCommonDataDir();

		if (!dataDir) {
			this.errorOut(1000, "canon:\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30FB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			throw die(-1);
		}

		if (1 > model.makePactList().getPactCount()) {
			this.errorOut(1000, "canon:\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			throw die(-1);
		}

		model.setTableNo(MtTableUtil.getTableNo(view.get_HArgv("-y"), false));
		var pactList = model.getPactList();

		for (var pactid of Object.values(pactList)) //処理中の会社設定->ファイル解析
		{
			this.infoOut("canon\uFF1APactId=" + pactid + "\u306E\u51E6\u7406\u958B\u59CB\n");

			if (model.setPactId(pactid).analysisFile()) //既存データ削除
				//終了ディレクトリへ
				{
					model.begin();

					if (!model.deleteDetailsData()) {
						this.errorOut(1000, "canon\uFF1A\u65E7\u30C7\u30FC\u30BF\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F\\m", 0, "", "");
						throw die(-1);
					}

					if (!model.importBillData()) {
						this.errorOut(1000, "canon\uFF1A\u8ACB\u6C42\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
						throw die(-1);
					}

					if (!model.importCopy()) {
						this.errorOut(1000, "canon\uFF1A\u30B3\u30D4\u30FC\u6A5F\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
						throw die(-1);
					}

					model.commit();
					var mvDir = dataDir + "/" + pactid;
					this.mvFile(mvDir, mvDir + "/fin");
				}

			var resCnt = model.getSuccessPacts();
			this.infoOut("canon\uFF1APactId=" + pactid + "\u306E\u51E6\u7406\u7D42\u4E86(\u8ACB\u6C42\uFF1A" + resCnt[pactid].addrow + "\u4EF6\u3000\u30B3\u30D4\u30FC\u6A5F\uFF1A" + resCnt[pactid].addcopy + "\u4EF6)\n");
		}

		resCnt = model.resultCount().getSuccessPacts();
		this.infoOut("canon\uFF1A\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u7D42\u4E86(\u8ACB\u6C42\u5408\u8A08\uFF1A" + resCnt.all.addrow + "\u4EF6\u3000\u30B3\u30D4\u30FC\u6A5F\u5408\u8A08\uFF1A" + resCnt.all.addcopy + "\u4EF6)\n");
		this.unLockProcess(view.get_ScriptName());
		throw die(0);
	}

	getCanonModel() {
		if (!this.canonModel instanceof ImportCanonModel) {
			this.canonModel = new ImportCanonModel();
		}

		return this.canonModel;
	}

	getCanonView() {
		if (!this.canonView instanceof ImportCanonView) {
			this.canonView = new ImportCanonView();
		}

		return this.canonView;
	}

};