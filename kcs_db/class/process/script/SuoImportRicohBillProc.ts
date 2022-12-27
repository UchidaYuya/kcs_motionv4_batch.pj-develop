
import MtTableUtil from '../../MtTableUtil';
import PactModel from '../../model/PactModel';
import BillModel from '../../model/BillModel';
import PostModel from '../../model/PostModel';
import {CopyModel} from '../../model/CopyModel';
import FuncModel from '../../model/FuncModel';
import ProcessBaseBatch from '../ProcessBaseBatch';
import {SuoImportRicohBillView} from '../../view/script/SuoImportRicohBillView';
import {SuoImportRicohBillModel} from '../../model/script/SuoImportRicohBillModel';

export class SuoImportRicohBillProc extends ProcessBaseBatch {

	O_View: SuoImportRicohBillView;
	O_Model: SuoImportRicohBillModel;

	PactId: string = "";
	BillDate: string = "";
	BackUpFlg: string = "";
	Mode: string = "";
	TargetTable: string = "";

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("ricoh");
		this.O_View = new SuoImportRicohBillView();
		this.O_Model = new SuoImportRicohBillModel(this.get_MtScriptAmbient());
	}

	async doExecute(H_param: {} | any[] = Array()) //処理開始
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//請求データディレクトリを取得
	//請求データディレクトリチェック（スクリプト終了）
	//PactModelインスタンス作成
	//会社マスターを作成
	//BillModelインスタンスを作成
	//処理するキャリアＩＤリスト
	//内訳種別マスター情報を取得
	//対象テーブル番号を取得
	//テーブル名設定
	//出力件数カウント
	//pactid 毎に処理する
	//END FOR pactid 毎に処理する
	//処理する件数が０件なら直ちに終了する
	//契約ＩＤ分処理する
	//モードがオーバーライトの時はデータをインポートする前にデリート
	//処理が完了したファイルを移動
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		// this.infoOut("\u30EA\u30B3\u30FC\u30B3\u30D4\u30FC\u6A5F\u8ACB\u6C42\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);
		this.infoOut("リコーコピー機請求データインポート開始\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");

		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.BillDate + this.getSetting().get("COPY_RICOH_BILL_DIR") + "/";

		// if (this.isDirCheck(dataDir, "rw") == false) {
		if (this.isDirCheck(dataDir) == false) {
			// this.errorOut(1000, this.getSetting().COPY_RICOH_BILL + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			this.errorOut(1000, this.getSetting().get("COPY_RICOH_BILL") + "請求データファイルディレクトリ" + dataDir + "がみつかりません\n", 0, "", "");
			throw process.exit(-1);
		} else //処理する契約ＩＤ配列を初期化
			//処理する契約ＩＤを取得する
			//pactidでソート
			//処理する契約ＩＤ数
			//処理する契約ＩＤが１件もない場合（スクリプト終了）
			{

				var A_pactid = Array();
				A_pactid = this.getPactList(dataDir, this.PactId);
				A_pactid.sort();

				var pactCnt = A_pactid.length;

				if (0 == pactCnt) {
					// this.errorOut(1000, "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
					this.errorOut(1000, "請求データファイルがみつかりません\n", 0, "", "");
					throw process.exit(-1);
				}


				var A_pactDone = Array();
			}


		var O_PactModel = new PactModel();

		var H_pactid = O_PactModel.getPactIdCompNameFromPact();

		var O_BillModel = new BillModel();

		var A_copycoid = [this.getSetting().get("COPYCOID")];

		var H_utiwake = O_BillModel.getCopyUtiwake(A_copycoid);

		// var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);

		var copyX_tb = "copy_" + tableNo + "_tb";

		var copydetails_tb = "copy_details_" + tableNo + "_tb";

		var outCopyCnt = 0;
		var outCopyXCnt = 0;
		var outCopydetailsCnt = 0;

		var A_undoCopyidX;
		var O_CopyModel;
		var A_outPutCopyDetails;
		var A_outPutCopyX;


		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		//PostModelインスタンスを作成
		//請求月用のルート部署を取得
		//CopyModelインスタンスを作成
		//請求月テーブルより削除されていないコピー機ＩＤマスターを取得する array(copyid)
		//請求月テーブルより削除されているコピー機ＩＤマスターを取得する array(copyid)
		//ASP料金が true:発生する、false:発生しない
		//FuncModelインスタンスを作成
		//会社権限リストを取得
		//ASP料金が発生する場合
		//コピー機請求明細
		//コピー機ＩＤ管理テーブル
		//削除フラグをfalseにする必要のあるコピー機ＩＤリスト
		//現在テーブルにも追加する場合
		//コピー機ＩＤ一覧を取得
		//ファイルデータを１コピー機ＩＤずつ処理
		//ファイルデータを１コピー機ＩＤずつ処理 END
		//正常処理が完了した pactid のみリストに追加
		{
			if (undefined !== H_pactid[A_pactid[pactCounter]] == false) //次のpactidへスキップ
				//pactid が会社マスターに登録されている場合
				{
					// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " は pact_tb に登録されていません スキップします\n", 1);
					continue;
				} else //pactid 毎の請求データディレクトリ設定
				//請求データファイル名を取得
				//処理するファイル数
				//請求データファイルがなかった場合（スクリプト続行 次のpactidへスキップ）
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
							// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイルがみつかりません スキップします\n", 1);
							continue;
						}

					A_billFile.sort();

					var fileErrFlg = false;

					var A_allFileData = Array();


					for (var fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
					//ファイル名から請求年月とpactidを取得するための準備
					//ファイル名から請求年月をチェック
					//データファイルチェックでエラーがあった場合（項目数）
					{

						// var A_fileData = Array();
						var A_fileData: string[] | false;

						// var A_fileNameEle = split("-", str_replace(".txt", "", A_billFile[fileCounter].toLowerCase()));
						var A_fileNameEle = A_billFile[fileCounter].toLowerCase().replace(".txt", "").split("-");

						if (A_fileNameEle[0] != this.BillDate) {
							// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306E\u8ACB\u6C42\u5E74\u6708\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイル " + A_billFile[fileCounter] + " の請求年月が不正です\n", 1);
							fileErrFlg = true;
						}

						if (A_fileNameEle[1] != A_pactid[pactCounter]) {
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイル " + A_billFile[fileCounter] + " のpactidが不正です\n", 1);
							fileErrFlg = true;
						}

						A_fileData = this.O_Model.chkBillData(dataDirPact + "/" + A_billFile[fileCounter]);

						// if (A_fileData == false) //データファイルチェックでエラーがなかった場合
						if (!A_fileData)
							{
								fileErrFlg = true;
							} else //複数ファイルデータをマージ
							{
								// A_allFileData = array_merge(A_allFileData, A_fileData);
								A_allFileData = A_allFileData.concat(A_fileData);
							}
					}

					if (true == fileErrFlg) //次のpactidへスキップ
						{
							// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u4E0D\u6B63\u306A\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + "  の請求データファイルが不正な為、スキップします\n", 1);
							continue;
						} else //必要なデータのみ保持する
						//array(コピー機ＩＤ => DBDATA)))
						{

							var H_editAllFileData = this.O_Model.editBillData(A_allFileData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}


			var O_PostModel = new PostModel();

			var rootPostidX = O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo);

			// var O_CopyModel = new CopyModel.CopyModel();
			O_CopyModel = new CopyModel();

			// var A_copyidX = O_CopyModel.getCopyid(A_pactid[pactCounter], this.getSetting().COPYCOID, "false", tableNo);
			var A_copyidX = O_CopyModel.getCopyid(A_pactid[pactCounter], this.getSetting().get("COPYCOID"), false, tableNo);
			
			// var A_copyidXDel = O_CopyModel.getCopyid(A_pactid[pactCounter], this.getSetting().COPYCOID, "true", tableNo);
			var A_copyidXDel = O_CopyModel.getCopyid(A_pactid[pactCounter], this.getSetting().get("COPYCOID"), true, tableNo);
			
			var aspFlg = false;

			var O_FuncModel = new FuncModel();

			var H_pactFunc = O_FuncModel.getPactFunc(A_pactid[pactCounter], undefined, false);

			var asxCharge;

			if (-1 !== Object.keys(H_pactFunc).indexOf("fnc_asp") == true) //ＡＳＰ料金を取得
				{
					aspFlg = true;

					var aspCharge = await O_BillModel.getCopyAspCharge(A_pactid[pactCounter], this.getSetting().get("COPYCOID"));

					if ("" == aspCharge) //次のpactidへスキップ
						{
							// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のＡＳＰ利用料が設定されていない為、スキップします\n", 1);
							continue;
						}


					// var asxCharge = +(aspCharge * this.getSetting().excise_tax);
					asxCharge = +(aspCharge * this.getSetting().get("excise_tax"));
				}


			// var A_outPutCopyDetails = Array();
			A_outPutCopyDetails = Array();

			// var A_outPutCopyX = Array();
			A_outPutCopyX = Array();

			// var A_undoCopyidX = Array();
			A_undoCopyidX = Array();

			var A_copyid;
			var A_copyidDel;
			var A_undoCopyid;
			var A_outPutCopy;

			if ("N" == this.TargetTable) //現在テーブルより削除されていないコピー機ＩＤマスターを取得する array(copyid)
				//現在テーブルより削除されているコピー機ＩＤマスターを取得する array(copyid)
				//コピー機ＩＤ管理テーブル
				//削除フラグをfalseにする必要のあるコピー機ＩＤリスト
				{

					// var A_copyid = O_CopyModel.getCopyid(A_pactid[pactCounter], this.getSetting().get("COPYCOID"), "false");
					A_copyid = O_CopyModel.getCopyid(A_pactid[pactCounter], this.getSetting().get("COPYCOID"), false);

					// var A_copyidDel = O_CopyModel.getCopyid(A_pactid[pactCounter], this.getSetting().get("COPYCOID"), "true");
					A_copyidDel = O_CopyModel.getCopyid(A_pactid[pactCounter], this.getSetting().get("COPYCOID"), true);

					// var A_outPutCopy = Array();
					A_outPutCopy = Array();

					// var A_undoCopyid = Array();
					A_undoCopyid = Array();
				}


			var allFileDataCnt = A_allFileData.length;

			var now = this.get_DB().getNow();

			var A_copy_id = Object.keys(H_editAllFileData);
			A_copy_id.sort();


			// for (var copy_id of Object.values(A_copy_id)) //コピー機ＩＤが空のデータは取り込みを行わない
			for (var copy_id of A_copy_id)
			//detailno はコピー機ＩＤ毎に初期化
			//copy_X_tb に登録する必要があるかどうか false：無、true：有
			//copy_X_tb にコピー機ＩＤがない場合
			//利用枚数
			//copy_details_X_tb 出力用配列へ格納
			//copy_details_X_tb 出力用配列へ格納
			//copy_X_tb へ登録する必要有りの場合、一番最初の行の会社情報を使用する
			{
				if ("" == copy_id) {
					continue;
				}


				var copy_id = copy_id + "";

				var detailno = 0;

				var copyAddFlgX = false;

				var copyAddFlg;

				if (-1 !== A_copyidX.indexOf(copy_id) == false) //削除済みのコピー機ＩＤとして登録が有る場合
					//コピー機ＩＤマスターに追加	llFileData[$copy_id])$H_editAllFileData[$copy_id])
					{
						if (-1 !== A_copyidXDel.indexOf(copy_id) == true) //削除を取り消すコピー機ＩＤリストに追加
							{
								A_undoCopyidX.push(copy_id);
							} else //copy_X_tb へ登録する必要有り
							{
								copyAddFlgX = true;
							}

						A_copyidX.push(copy_id);
					}

				if ("N" == this.TargetTable) //copy_tb に登録する必要があるかどうか false：無、true：有
					//copy_tb にコピー機ＩＤがない場合
					{

						// var copyAddFlg = false;
						copyAddFlg = false;

						if (-1 !== A_copyid.indexOf(copy_id) == false) //削除済みのコピー機ＩＤとして登録が有る場合
							//コピー機ＩＤマスターに追加
							{
								if (-1 !== A_copyidDel.indexOf(copy_id) == true) //削除を取り消すコピー機ＩＤリストに追加
									{
										A_undoCopyid.push(copy_id);
									} else //copy_tb へ登録する必要有り
									{
										copyAddFlg = true;
									}

								A_copyid.push(copy_id);
							}
					}


				var code = this.getSetting().get("UTIWAKE_CODE");

				var printcount = H_editAllFileData[copy_id].monocnt - H_editAllFileData[copy_id].monocntpast + (H_editAllFileData[copy_id].colorcnt - H_editAllFileData[copy_id].colorcntpast);
				A_outPutCopyDetails.push({
					pactid: A_pactid[pactCounter],
					copyid: copy_id,
					copycoid: this.getSetting().get("COPYCOID"),
					code: code,
					codename: H_utiwake[this.getSetting().get("COPYCOID")][code].name,
					charge: H_editAllFileData[copy_id].charge,
					// taxkubun: "\u500B\u5225",
					taxkubun: "個別",
					printcount: printcount,
					detailno: detailno,
					recdate: now
				});
				detailno++;
				outCopydetailsCnt++;
				code = this.getSetting().get("UTIWAKE_TAX_CODE");
				A_outPutCopyDetails.push({
					pactid: A_pactid[pactCounter],
					copyid: copy_id,
					copycoid: this.getSetting().get("COPYCOID"),
					code: code,
					codename: H_utiwake[this.getSetting().get("COPYCOID")][code].name,
					charge: H_editAllFileData[copy_id].tax,
					taxkubun: undefined,
					printcount: undefined,
					detailno: detailno,
					recdate: now
				});
				detailno++;
				outCopydetailsCnt++;

				if (true == copyAddFlgX) //copy_X_tb 出力用配列へ格納
					//フラグを戻す
					{
						A_outPutCopyX.push({
							pactid: A_pactid[pactCounter],
							postid: rootPostidX,
							copyid: copy_id,
							copycoid: this.getSetting().get("COPYCOID"),
							copyname: H_editAllFileData[copy_id].copyname,
							username: undefined,
							employeecode: undefined,
							memo: undefined,
							recdate: now,
							fixdate: now,
							text1: undefined,
							text2: undefined,
							text3: undefined,
							text4: undefined,
							text5: undefined,
							text6: undefined,
							text7: undefined,
							text8: undefined,
							text9: undefined,
							text10: undefined,
							text11: undefined,
							text12: undefined,
							text13: undefined,
							text14: undefined,
							text15: undefined,
							int1: undefined,
							int2: undefined,
							int3: undefined,
							int4: undefined,
							int5: undefined,
							int6: undefined,
							date1: undefined,
							date2: undefined,
							date3: undefined,
							date4: undefined,
							date5: undefined,
							date6: undefined,
							mail1: undefined,
							mail2: undefined,
							mail3: undefined,
							url1: undefined,
							url2: undefined,
							url3: undefined,
							delete_flg: "false",
							dummy_flg: "false",
							delete_date: undefined,
							pre_copyid: undefined,
							pre_copycoid: undefined
						});
						outCopyXCnt++;
						copyAddFlgX = false;
					}

				if ("N" == this.TargetTable && true == copyAddFlg) //copy_tb 出力用配列へ格納
					//フラグを戻す
					{
						A_outPutCopy.push({
							pactid: A_pactid[pactCounter],
							postid: rootPostidX,
							copyid: copy_id,
							copycoid: this.getSetting().get("COPYCOID"),
							copyname: H_editAllFileData[copy_id].copyname,
							username: undefined,
							employeecode: undefined,
							memo: undefined,
							recdate: now,
							fixdate: now,
							text1: undefined,
							text2: undefined,
							text3: undefined,
							text4: undefined,
							text5: undefined,
							text6: undefined,
							text7: undefined,
							text8: undefined,
							text9: undefined,
							text10: undefined,
							text11: undefined,
							text12: undefined,
							text13: undefined,
							text14: undefined,
							text15: undefined,
							int1: undefined,
							int2: undefined,
							int3: undefined,
							int4: undefined,
							int5: undefined,
							int6: undefined,
							date1: undefined,
							date2: undefined,
							date3: undefined,
							date4: undefined,
							date5: undefined,
							date6: undefined,
							mail1: undefined,
							mail2: undefined,
							mail3: undefined,
							url1: undefined,
							url2: undefined,
							url3: undefined,
							delete_flg: "false",
							dummy_flg: "false",
							delete_date: undefined,
							pre_copyid: undefined,
							pre_copycoid: undefined
						});
						outCopyCnt++;
						copyAddFlg = false;
					}

				if (true == aspFlg) //合計用に１つ進める
					//ASP利用料を出力
					{
						detailno++;
						A_outPutCopyDetails.push({
							pactid: A_pactid[pactCounter],
							copyid: copy_id,
							copycoid: this.getSetting().get("COPYCOID"),
							code: this.getSetting().get("UTIWAKE_ASP_CODE"),
							codename: H_utiwake[this.getSetting().get("COPYCOID")][this.getSetting().get("UTIWAKE_ASP_CODE")].name,
							charge: aspCharge,
							// taxkubun: "\u500B\u5225",
							taxkubun: "個別",
							printcount: undefined,
							detailno: detailno,
							recdate: now
						});

						if (0 != asxCharge) //ASP利用料消費税を出力
							{
								detailno++;
								A_outPutCopyDetails.push({
									pactid: A_pactid[pactCounter],
									copyid: copy_id,
									copycoid: this.getSetting().get("COPYCOID"),
									code: this.getSetting().get("UTIWAKE_ASX_CODE"),
									codename: H_utiwake[this.getSetting().get("COPYCOID")][this.getSetting().get("UTIWAKE_ASX_CODE")].name,
									charge: asxCharge,
									taxkubun: undefined,
									printcount: undefined,
									detailno: detailno,
									recdate: now
								});
								outCopydetailsCnt++;
							}

						outCopydetailsCnt++;
					}
			}

			A_pactDone.push(A_pactid[pactCounter]);
			// this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(copy_tb:" + outCopyCnt + "\u4EF6," + copyX_tb + ":" + outCopyXCnt + "\u4EF6," + copydetails_tb + ":" + outCopydetailsCnt + "\u4EF6)\n", 1);
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ")インポートファイル出力完了(copy_tb:" + outCopyCnt + "件," + copyX_tb + ":" + outCopyXCnt + "件," + copydetails_tb + ":" + outCopydetailsCnt + "件)\n", 1);
			outCopyCnt = 0;
			outCopyXCnt = 0;
			outCopydetailsCnt = 0;
		}


		var pactDoneCnt = A_pactDone.length;

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
			//終了
			{
				// this.warningOut(1000, "\u30A4\u30F3\u30DD\u30FC\u30C8\u53EF\u80FD\u306A\u8ACB\u6C42\u60C5\u5831\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
				this.warningOut(1000, "インポート可能な請求情報データがありませんでした\n", 1);
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw process.exit(0);
			}

		if ("Y" == this.BackUpFlg) {

			// var expFile = dataDir + copydetails_tb + date("YmdHis") + ".exp";
			var expFile = dataDir + copydetails_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";

			if (false == this.expData(copydetails_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
				throw process.exit(-1);
			}
		}

		this.get_DB().beginTransaction();


		for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //コピー機ＩＤの削除フラグをfalseにする必要がある場合
		{
			if (A_undoCopyidX.length != 0) {
				O_CopyModel.chgDelFlg(A_pactDone[pactDoneCounter], this.getSetting().get("COPYCOID"), A_undoCopyidX, "false", tableNo);
			}

			if (undefined !== A_undoCopyid == true && 0 != A_undoCopyid.length) {
				O_CopyModel.chgDelFlg(A_pactDone[pactDoneCounter], this.getSetting().get("COPYCOID"), A_undoCopyid, "false");
			}
		}

		if ("O" == this.Mode) {
			O_BillModel.delCopyDetailsData(A_pactDone, tableNo, A_copycoid);
		}

		if (0 != A_outPutCopyDetails.length) //copy_details_X_tb取込失敗
			{

				var rtn = this.get_DB().pgCopyFromArray(copydetails_tb, A_outPutCopyDetails);

				if (await rtn == false) {
					this.get_DB().rollback();
					// this.errorOut(1000, "\n" + copydetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					this.errorOut(1000, "\n" + copydetails_tb + " へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);
				} else {
					// this.infoOut(copydetails_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
					this.infoOut(copydetails_tb + " へデーターインポート完了\n", 1);
				}
			}

		if (0 != A_outPutCopyX.length) //copy_X_tbへデータ取込
			//copy_X_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray(copyX_tb, A_outPutCopyX);

				if (await rtn == false) {
					this.get_DB().rollback();
					// this.errorOut(1000, "\n" + copyX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					this.errorOut(1000, "\n" + copyX_tb + " へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);
				} else {
					// this.infoOut(copyX_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
					this.infoOut(copyX_tb + " へデーターインポート完了\n", 1);
				}
			}

		if (undefined !== A_outPutCopy == true && 0 != A_outPutCopy.length) //copy_tbへデータ取込
			//copy_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray("copy_tb", A_outPutCopy);

				if (await rtn == false) {
					this.get_DB().rollback();
					// this.errorOut(1000, "\ncopy_tb \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					this.errorOut(1000, "\ncopy_tb へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);
				} else {
					// this.infoOut("copy_tb \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
					this.infoOut("copy_tb へデーターインポート完了\n", 1);
				}
			}

		this.get_DB().commit();

		for (pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動元ディレクトリ
		//移動先ディレクトリ
		{

			var fromDir = dataDir + A_pactDone[pactDoneCounter];

			var finDir = fromDir + "/fin";
			this.mvFile(fromDir, finDir);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		// this.infoOut("\u30EA\u30B3\u30FC\u30B3\u30D4\u30FC\u6A5F\u8ACB\u6C42\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 1);
		this.infoOut("リコーコピー機請求データインポート終了\n", 1);
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
