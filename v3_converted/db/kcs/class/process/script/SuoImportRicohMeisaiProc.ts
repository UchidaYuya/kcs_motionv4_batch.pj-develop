//
//リコーコピー機利用明細データ取込処理 （Process）
//
//更新履歴：<br>
//2008/07/02 前田 聡 作成
//
//SuoImportRicohMeisaiProc
//
//@package SUO
//@subpackage Process
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2008/07/02
//@uses MtTableUtil
//@uses PactModel
//@uses BillModel
//@uses ProcessBaseBatch
//@uses SuoImportRicohMeisaiView
//@uses SuoImportRicohMeisaiModel
//
//
//error_reporting(E_ALL|E_STRICT);

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/SuoImportRicohMeisaiView.php");

require("model/script/SuoImportRicohMeisaiModel.php");

//
//コンストラクタ
//
//@author maeda
//@since 2008/07/02
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2008/07/02
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2008/07/02
//
//@access public
//@return void
//
class SuoImportRicohMeisaiProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("ricoh");
		this.O_View = new SuoImportRicohMeisaiView();
		this.O_Model = new SuoImportRicohMeisaiModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //処理開始
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//利用明細データディレクトリを取得
	//利用明細データディレクトリチェック（スクリプト終了）
	//PactModelインスタンス作成
	//会社マスターを作成
	//BillModelインスタンスを作成
	//処理するキャリアＩＤリスト
	//対象テーブル番号を取得
	//テーブル名設定
	//出力件数カウント
	//pactid 毎に処理する
	//END FOR pactid 毎に処理する
	//処理する件数が０件なら直ちに終了する
	//モードがオーバーライトの時はデータをインポートする前にデリート
	//処理が完了したファイルを移動
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.infoOut("\u30EA\u30B3\u30FC\u30B3\u30D4\u30FC\u6A5F\u5229\u7528\u660E\u7D30\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + this.getSetting().COPY_RICOH_MEISAI_DIR + "/";

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, this.getSetting().COPY_RICOH_BILL + "\u5229\u7528\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			throw die(-1);
		} else //処理する契約ＩＤ配列を初期化
			//処理する契約ＩＤを取得する
			//pactidでソート
			//処理する契約ＩＤ数
			//処理する契約ＩＤが１件もない場合（スクリプト終了）
			{
				var A_pactid = Array();
				A_pactid = this.getPactList(dataDir, this.PactId);
				sort(A_pactid);
				var pactCnt = A_pactid.length;

				if (0 == pactCnt) {
					this.errorOut(1000, "\u5229\u7528\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
					throw die(-1);
				}

				var A_pactDone = Array();
			}

		var O_PactModel = new PactModel();
		var H_pactid = O_PactModel.getPactIdCompNameFromPact();
		var O_BillModel = new BillModel();
		var A_copycoid = [this.getSetting().COPYCOID];
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var copyhistory_tb = "copy_history_" + tableNo + "_tb";
		var outCopyHistoryCnt = 0;

		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		//出力用配列
		//コピー機利用明細
		//総行数取得
		//コピー機ＩＤ一覧を取得
		//ファイルデータを１コピー機ＩＤずつ処理
		//ファイルデータを１コピー機ＩＤずつ処理 END
		//正常処理が完了した pactid のみリストに追加
		{
			if (undefined !== H_pactid[A_pactid[pactCounter]] == false) //次のpactidへスキップ
				//pactid が会社マスターに登録されている場合
				{
					this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
					continue;
				} else //pactid 毎の利用明細データディレクトリ設定
				//利用明細データファイル名を取得
				//処理するファイル数
				//利用明細データファイルがなかった場合（スクリプト続行 次のpactidへスキップ）
				//ファイルエラーフラグ
				//全ファイルデータ配列
				//ファイル数分処理する
				//１ファイルでも不備があれば、そのpactidはスキップする（スクリプト続行 次のpactidへスキップ）
				//ログ出力
				{
					var dataDirPact = dataDir + A_pactid[pactCounter];
					var A_billFile = this.getFileList(dataDirPact);
					var fileCnt = A_billFile.length;

					if (0 == fileCnt) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u5229\u7528\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						}

					sort(A_billFile);
					var fileErrFlg = false;
					var A_allFileData = Array();

					for (var fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
					//ファイル名から請求年月とpactidを取得するための準備
					//ファイル名から請求年月をチェック
					//データファイルチェックでエラーがあった場合（項目数）
					{
						var A_fileData = Array();
						var A_fileNameEle = split("-", str_replace(".txt", "", A_billFile[fileCounter].toLowerCase()));

						if (A_fileNameEle[0] != this.BillDate) {
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u5229\u7528\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306E\u8ACB\u6C42\u5E74\u6708\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
							fileErrFlg = true;
						}

						if (A_fileNameEle[1] != A_pactid[pactCounter]) {
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u5229\u7528\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306Epactid\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
							fileErrFlg = true;
						}

						A_fileData = this.O_Model.chkBillData(dataDirPact + "/" + A_billFile[fileCounter]);

						if (A_fileData == false) //データファイルチェックでエラーがなかった場合
							{
								fileErrFlg = true;
							} else //複数ファイルデータをマージ
							{
								A_allFileData = array_merge(A_allFileData, A_fileData);
							}
					}

					if (true == fileErrFlg) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u5229\u7528\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u4E0D\u6B63\u306A\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						} else //必要なデータのみ保持する
						//array(コピー機ＩＤ => DBDATA)))
						{
							var H_editAllFileData = this.O_Model.editBillData(A_allFileData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}

			var A_outPutCopyHistory = Array();
			var allFileDataCnt = A_allFileData.length;
			var now = this.get_DB().getNow();
			var A_copy_id = Object.keys(H_editAllFileData);
			sort(A_copy_id);

			for (var copy_id of Object.values(A_copy_id)) //コピー機ＩＤが空のデータは取り込みを行わない
			//detailno はコピー機ＩＤ毎に初期化
			//copy_X_tb に登録する必要があるかどうか false：無、true：有
			//並び順一覧を取得
			//並び順一覧を１件ずつ処理
			//並び順一覧を１件ずつ処理 END
			{
				if ("" == copy_id) {
					continue;
				}

				var copy_id = copy_id + "";
				var detailno = 0;
				var copyAddFlgX = false;
				var A_sort = Object.keys(H_editAllFileData[copy_id]);
				sort(A_sort);

				for (var sort of Object.values(A_sort)) //copy_history_X_tb 出力用配列へ格納
				{
					A_outPutCopyHistory.push({
						pactid: A_pactid[pactCounter],
						copyid: copy_id,
						copycoid: this.getSetting().COPYCOID,
						text1: H_editAllFileData[copy_id][sort].text1,
						text2: H_editAllFileData[copy_id][sort].text2,
						text3: H_editAllFileData[copy_id][sort].text3,
						text4: H_editAllFileData[copy_id][sort].text4,
						text5: undefined,
						int1: undefined,
						int2: undefined,
						int3: undefined,
						date1: undefined,
						date2: undefined,
						sort: detailno
					});
					detailno++;
					outCopyHistoryCnt++;
				}
			}

			A_pactDone.push(A_pactid[pactCounter]);
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(" + copyhistory_tb + ":" + outCopyHistoryCnt + "\u4EF6)\n", 1);
			outCopyHistoryCnt = 0;
		}

		var pactDoneCnt = A_pactDone.length;

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
			//終了
			{
				this.warningOut(1000, "\u30A4\u30F3\u30DD\u30FC\u30C8\u53EF\u80FD\u306A\u5229\u7528\u660E\u7D30\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw die(0);
			}

		if ("Y" == this.BackUpFlg) {
			var expFile = dataDir + copyhistory_tb + date("YmdHis") + ".exp";

			if (false == this.expData(copyhistory_tb, expFile, this.getSetting().NUM_FETCH)) {
				throw die(-1);
			}
		}

		this.get_DB().beginTransaction();

		if ("O" == this.Mode) {
			O_BillModel.delCopyHistoryData(A_pactDone, tableNo, A_copycoid);
		}

		if (0 != A_outPutCopyHistory.length) //copy_history_X_tb取込失敗
			{
				var rtn = this.get_DB().pgCopyFromArray(copyhistory_tb, A_outPutCopyHistory);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + copyhistory_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(copyhistory_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		this.get_DB().commit();

		for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動元ディレクトリ
		//移動先ディレクトリ
		{
			var fromDir = dataDir + A_pactDone[pactDoneCounter];
			var finDir = fromDir + "/fin";
			this.mvFile(fromDir, finDir);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("\u30EA\u30B3\u30FC\u30B3\u30D4\u30FC\u6A5F\u5229\u7528\u660E\u7D30\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 1);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};