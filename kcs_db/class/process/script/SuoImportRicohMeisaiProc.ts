import MtTableUtil from "../../MtTableUtil";
import PactModel from "../../model/PactModel";
import BillModel from "../../model/BillModel";
import ProcessBaseBatch from "../ProcessBaseBatch";
import SuoImportRicohMeisaiView from "../../view/script/SuoImportRicohMeisaiView";
import SuoImportRicohMeisaiModel from "../../model/script/SuoImportRicohMeisaiModel";

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
export default class SuoImportRicohMeisaiProc extends ProcessBaseBatch {
	O_View:  SuoImportRicohMeisaiView;
	O_Model: SuoImportRicohMeisaiModel;
	PactId: string = "";
	BillDate: string = "";
	BackUpFlg: string = "";
	Mode: string = "";

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("ricoh");
		this.O_View = new SuoImportRicohMeisaiView();
		this.O_Model = new SuoImportRicohMeisaiModel(this.get_MtScriptAmbient());
	}

	async doExecute(H_param: {} | any[] = Array()) //処理開始
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
		var A_outPutCopyHistory = Array();

		this.infoOut("リコーコピー機利用明細データインポート開始\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
// 2022cvt_015
		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.BillDate + this.getSetting().get("COPY_RICOH_MEISAI_DIR") + "/";

		if (this.isDirCheck(dataDir) == false) {
			this.errorOut(1000, this.getSetting().get("COPY_RICOH_BILL") + "利用明細データファイルディレクトリ（" + dataDir + "）がみつかりません\n", 0, "", "");
			throw process.exit(-1);// 2022cvt_009
		} else //処理する契約ＩＤ配列を初期化
			//処理する契約ＩＤを取得する
			//pactidでソート
			//処理する契約ＩＤ数
			//処理する契約ＩＤが１件もない場合（スクリプト終了）
			{
// 2022cvt_015
				var A_pactid = Array();
				A_pactid = this.getPactList(dataDir, this.PactId);
				sort(A_pactid);
// 2022cvt_015
				var pactCnt = A_pactid.length;

				if (0 == pactCnt) {
					this.errorOut(1000, "利用明細データファイルがみつかりません\n", 0, "", "");
					throw process.exit(-1);// 2022cvt_009
				}

// 2022cvt_015
				var A_pactDone = Array();
			}

// 2022cvt_015
		var O_PactModel = new PactModel();
// 2022cvt_015
		var H_pactid = O_PactModel.getPactIdCompNameFromPact();
// 2022cvt_015
		var O_BillModel = new BillModel();
// 2022cvt_015
		var A_copycoid = [this.getSetting().get("COPYCOID")];
// 2022cvt_015
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
// 2022cvt_015
		var copyhistory_tb = "copy_history_" + tableNo + "_tb";
// 2022cvt_015
		var outCopyHistoryCnt = 0;

// 2022cvt_015
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
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " は pact_tb に登録されていません スキップします\n", 1);
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
// 2022cvt_015
					var dataDirPact = dataDir + A_pactid[pactCounter];
// 2022cvt_015
					var A_billFile = this.getFileList(dataDirPact);
// 2022cvt_015
					var fileCnt = A_billFile.length;

					if (0 == fileCnt) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の利用明細データファイルがみつかりません スキップします\n", 1);
							continue;
						}

					sort(A_billFile);
// 2022cvt_015
					var fileErrFlg = false;
// 2022cvt_015
					var A_allFileData = Array();

// 2022cvt_015
					for (var fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
					//ファイル名から請求年月とpactidを取得するための準備
					//ファイル名から請求年月をチェック
					//データファイルチェックでエラーがあった場合（項目数）
					{
// 2022cvt_015
						var A_fileData = Array();
// 2022cvt_020
// 2022cvt_015
						var A_fileNameEle = A_billFile[fileCounter].split("-", A_billFile[fileCounter].replace(".txt", "", A_billFile[fileCounter].toLowerCase()));

						if (A_fileNameEle[0] != this.BillDate) {
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の利用明細データファイル " + A_billFile[fileCounter] + " の請求年月が不正です\n", 1);
							fileErrFlg = true;
						}

						if (A_fileNameEle[1] != A_pactid[pactCounter]) {
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の利用明細データファイル " + A_billFile[fileCounter] + " のpactidが不正です\n", 1);
							fileErrFlg = true;
						}

						A_fileData = this.O_Model.chkBillData(dataDirPact + "/" + A_billFile[fileCounter]);

						if (!A_fileData == false) //データファイルチェックでエラーがなかった場合
							{
								fileErrFlg = true;
							} else //複数ファイルデータをマージ
							{
								A_allFileData = A_allFileData.concat(A_allFileData, A_fileData);
							}
					}

					if (true == fileErrFlg) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の利用明細データファイルが不正な為、スキップします\n", 1);
							continue;
						} else //必要なデータのみ保持する
						//array(コピー機ＩＤ => DBDATA)))
						{
// 2022cvt_015
							var H_editAllFileData = this.O_Model.editBillData(A_allFileData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}

// 2022cvt_015
			A_outPutCopyHistory = Array();
// 2022cvt_015
			var allFileDataCnt = A_allFileData.length;
// 2022cvt_015
			var now = this.get_DB().getNow();
// 2022cvt_015
			var A_copy_id = Object.keys(H_editAllFileData);
			sort(A_copy_id);

// 2022cvt_015
			for (var copy_id of (A_copy_id) as any) //コピー機ＩＤが空のデータは取り込みを行わない
			//detailno はコピー機ＩＤ毎に初期化
			//copy_X_tb に登録する必要があるかどうか false：無、true：有
			//並び順一覧を取得
			//並び順一覧を１件ずつ処理
			//並び順一覧を１件ずつ処理 END
			{
				if ("" == copy_id) {
					continue;
				}

// 2022cvt_015
				// var copy_id = copy_id + "";
// 2022cvt_015
				var detailno = 0;
// 2022cvt_015
				var copyAddFlgX = false;
// 2022cvt_015
				var A_sort = Object.keys(H_editAllFileData[copy_id]);
				sort(A_sort);

// 2022cvt_015
				for (var sort of (A_sort) as any) //copy_history_X_tb 出力用配列へ格納
				{
					A_outPutCopyHistory.push({
						pactid: A_pactid[pactCounter],
						copyid: copy_id,
						copycoid: this.getSetting().get("COPYCOID"),
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
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] +  ") インポートファイル出力完了(" + copyhistory_tb + ":" + outCopyHistoryCnt + "件)\n", 1);
			outCopyHistoryCnt = 0;
		}

// 2022cvt_015
		var pactDoneCnt = A_pactDone.length;

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
			//終了
			{
				this.warningOut(1000, "インポート可能な利用明細データがありませんでした\n", 1);
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw process.exit(0);// 2022cvt_009
			}

		if ("Y" == this.BackUpFlg) {
// 2022cvt_015
			var expFile = dataDir + copyhistory_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join(""); + ".exp";

			if (false == this.expData(copyhistory_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
				throw process.exit(-1);// 2022cvt_009
			}
		}

		this.get_DB().beginTransaction();

		if ("O" == this.Mode) {
			O_BillModel.delCopyHistoryData(A_pactDone, tableNo, A_copycoid);
		}

		if (0 != A_outPutCopyHistory.length) //copy_history_X_tb取込失敗
			{
// 2022cvt_015
				var rtn = this.get_DB().pgCopyFromArray(copyhistory_tb, A_outPutCopyHistory);

				if (await rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + copyhistory_tb + " へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);// 2022cvt_009
				} else {
					this.infoOut(copyhistory_tb + " へデーターインポート完了\n", 1);
				}
			}

		this.get_DB().commit();

// 2022cvt_015
		for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動元ディレクトリ
		//移動先ディレクトリ
		{
// 2022cvt_015
			var fromDir = dataDir + A_pactDone[pactDoneCounter];
// 2022cvt_015
			var finDir = fromDir + "/fin";
			this.mvFile(fromDir, finDir);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("リコーコピー機利用明細データインポート終了\n", 1);
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
