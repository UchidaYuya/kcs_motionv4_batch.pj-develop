//
//ＡＳＫＵＬ購買データ取込処理 （Process）
//
//更新履歴：<br>
//2008/04/01 前田 聡 作成
//
//SuoImportAskulProc
//
//@package SUO
//@subpackage Process
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2008/04/01
//@uses MtTableUtil
//@uses PactModel
//@uses BillModel
//@uses PostModel
//@uses PurchaseModel
//@uses FuncModel
//@uses ProcessBaseBatch
//@uses SuoImportAskulView
//@uses SuoImportAskulModel
//
//
//error_reporting(E_ALL|E_STRICT);

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/PurchaseModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/SuoImportAskulView.php");

require("model/script/SuoImportAskulModel.php");

//
//コンストラクタ
//
//@author maeda
//@since 2008/04/23
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2008/04/23
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2008/04/22
//
//@access public
//@return void
//
class SuoImportAskulProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("askul");
		this.O_View = new SuoImportAskulView();
		this.O_Model = new SuoImportAskulModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //処理開始
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
		this.infoOut("\uFF21\uFF33\uFF2B\uFF35\uFF2C\u8CFC\u8CB7\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + this.getSetting().KOUBAI_ASKUL_DIR + "/";

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, this.getSetting().KOUBAI_ASKUL + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			throw die(-1);
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
					this.errorOut(1000, "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
					throw die(-1);
				}

				var A_pactDone = Array();
			}

		var O_PactModel = new PactModel();
		var H_pactid = O_PactModel.getPactIdCompNameFromPact();
		var O_BillModel = new BillModel();
		var A_purchcoid = [this.getSetting().CARID];
		var H_utiwake = O_BillModel.getPurchaseUtiwake(A_purchcoid);
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var purchaseX_tb = "purchase_" + tableNo + "_tb";
		var purchdetails_tb = "purchase_details_" + tableNo + "_tb";
		var outPurchCnt = outPurchXCnt = outPurchdetailsCnt = 0;

		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		//PostModelインスタンスを作成
		//請求月用のルート部署を取得
		//PurchaseModelインスタンスを作成
		//請求月テーブルより削除されていない購買ＩＤマスターを取得する array(purchid)
		//請求月テーブルより削除されている購買ＩＤマスターを取得する array(purchid)
		//ASP料金が true:発生する、false:発生しない
		//FuncModelインスタンスを作成
		//会社権限リストを取得
		//ASP料金が発生する場合
		//購買明細
		//購買ＩＤ管理テーブル
		//削除フラグをfalseにする必要のある購買ＩＤリスト
		//現在テーブルにも追加する場合
		//購買ＩＤ一覧を取得
		//ファイルデータを１購買ＩＤずつ処理
		//ファイルデータを１購買ＩＤずつ処理 END
		//正常処理が完了した pactid のみリストに追加
		{
			if (undefined !== H_pactid[A_pactid[pactCounter]] == false) //次のpactidへスキップ
				//pactid が会社マスターに登録されている場合
				{
					this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
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
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
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
						var A_fileData = Array();
						var A_fileNameEle = split("-", str_replace(".txt", "", A_billFile[fileCounter].toLowerCase()));

						if (A_fileNameEle[0] != this.BillDate) {
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306E\u8ACB\u6C42\u5E74\u6708\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
							fileErrFlg = true;
						}

						if (A_fileNameEle[1] != A_pactid[pactCounter]) {
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306Epactid\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
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
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u4E0D\u6B63\u306A\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						} else //必要なデータのみ保持する
						//array(ログインＩＤ => array(売上日 => array(売上ＮＯ => array(売上行ＮＯ => DBDATA)))
						{
							var H_editAllFileData = this.O_Model.editBillData(A_allFileData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}

			var O_PostModel = new PostModel();
			var rootPostidX = O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo);
			var O_PurchaseModel = new PurchaseModel();
			var A_purchidX = O_PurchaseModel.getPurchid(A_pactid[pactCounter], this.getSetting().CARID, "false", tableNo);
			var A_purchidXDel = O_PurchaseModel.getPurchid(A_pactid[pactCounter], this.getSetting().CARID, "true", tableNo);
			var aspFlg = false;
			var O_FuncModel = new FuncModel();
			var H_pactFunc = O_FuncModel.getPactFunc(A_pactid[pactCounter], undefined, false);

			if (-1 !== Object.keys(H_pactFunc).indexOf("fnc_asp") == true) //ＡＳＰ料金を取得
				{
					aspFlg = true;
					var aspCharge = O_BillModel.getPurchaseAspCharge(A_pactid[pactCounter], this.getSetting().CARID);

					if ("" == aspCharge) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						}

					var asxCharge = +(aspCharge * this.getSetting().excise_tax);
				}

			var A_outPutPurchaseDetails = Array();
			var A_outPutPurchaseX = Array();
			var A_undoPurchidX = Array();

			if ("N" == this.TargetTable) //現在テーブルより削除されていない購買ＩＤマスターを取得する array(purchid)
				//現在テーブルより削除されている購買ＩＤマスターを取得する array(purchid)
				//購買ＩＤ管理テーブル
				//削除フラグをfalseにする必要のある購買ＩＤリスト
				{
					var A_purchid = O_PurchaseModel.getPurchid(A_pactid[pactCounter], this.getSetting().CARID, "false");
					var A_purchidDel = O_PurchaseModel.getPurchid(A_pactid[pactCounter], this.getSetting().CARID, "true");
					var A_outPutPurchase = Array();
					var A_undoPurchid = Array();
				}

			var allFileDataCnt = A_allFileData.length;
			var now = this.get_DB().getNow();
			var A_koubai_id = Object.keys(H_editAllFileData);
			A_koubai_id.sort();

			for (var koubai_id of Object.values(A_koubai_id)) //購買ＩＤが空のデータ（＝一括請求区分が一括ではない）は取り込みを行わない
			//detailno は購買ＩＤ毎に初期化
			//purchase_X_tb に登録する必要があるかどうか false：無、true：有
			//purchase_X_tb に購買ＩＤがない場合
			//売上日一覧を１件ずつ処理
			//売上日一覧を１件ずつ処理 END
			//ASP料金明細が発生する場合
			{
				if ("" == koubai_id) {
					continue;
				}

				var koubai_id = koubai_id + "";
				var detailno = 0;
				var purchaseAddFlgX = false;

				if (-1 !== A_purchidX.indexOf(this.getSetting().LOGINID_HEADER + koubai_id) == false) //削除済みの購買ＩＤとして登録が有る場合
					//購買ＩＤマスターに追加
					{
						if (-1 !== A_purchidXDel.indexOf(this.getSetting().LOGINID_HEADER + koubai_id) == true) //削除を取り消す購買ＩＤリストに追加
							{
								A_undoPurchidX.push(this.getSetting().LOGINID_HEADER + koubai_id);
							} else //purchase_X_tb へ登録する必要有り
							{
								purchaseAddFlgX = true;
							}

						A_purchidX.push(this.getSetting().LOGINID_HEADER + koubai_id);
					}

				if ("N" == this.TargetTable) //purchase_tb に登録する必要があるかどうか false：無、true：有
					//purchase_tb に購買ＩＤがない場合
					{
						var purchaseAddFlg = false;

						if (-1 !== A_purchid.indexOf(this.getSetting().LOGINID_HEADER + koubai_id) == false) //削除済みの購買ＩＤとして登録が有る場合
							//購買ＩＤマスターに追加
							{
								if (-1 !== A_purchidDel.indexOf(this.getSetting().LOGINID_HEADER + koubai_id) == true) //削除を取り消す購買ＩＤリストに追加
									{
										A_undoPurchid.push(this.getSetting().LOGINID_HEADER + koubai_id);
									} else //purchase_tb へ登録する必要有り
									{
										purchaseAddFlg = true;
									}

								A_purchid.push(this.getSetting().LOGINID_HEADER + koubai_id);
							}
					}

				var A_uriagebi = Object.keys(H_editAllFileData[koubai_id]);
				A_uriagebi.sort();

				for (var uriagebi of Object.values(A_uriagebi)) //売上ＮＯ一覧を取得
				//売上ＮＯ一覧を１件ずつ処理
				//売上ＮＯ一覧を１件ずつ処理 END
				{
					var A_uriageno = Object.keys(H_editAllFileData[koubai_id][uriagebi]);
					A_uriageno.sort();

					for (var uriageno of Object.values(A_uriageno)) //消費税は売上ＮＯ毎に初期化
					//$sumTax = $sumTaxEco = 0;
					//売上行ＮＯ一覧を取得
					//売上行ＮＯ一覧を１件ずつ処理
					//売上行ＮＯ一覧を１件ずつ処理 END
					//売上ＮＯ毎に消費税を出力
					{
						var sumTax = 0;
						var A_lineno = Object.keys(H_editAllFileData[koubai_id][uriagebi][uriageno]);
						A_lineno.sort();

						for (var lineno of Object.values(A_lineno)) //環境対応商品の場合
						//消費税を加算
						//purchase_details_X_tb 出力用配列へ格納
						//purchase_X_tb へ登録する必要有りの場合、一番最初の行の会社情報を使用する
						{
							if (this.getSetting().ECO_FLG == H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].green1 || this.getSetting().ECO_FLG == H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].green2 || this.getSetting().ECO_FLG == H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].green3 || this.getSetting().ECO_FLG == H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].green4) //通常商品の場合
								{
									var code = this.getSetting().UTIWAKE_ECO_CODE;
								} else {
								code = this.getSetting().UTIWAKE_CODE;
							}

							sumTax = sumTax + H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].tax;
							A_outPutPurchaseDetails.push({
								pactid: A_pactid[pactCounter],
								purchid: this.getSetting().LOGINID_HEADER + koubai_id,
								purchcoid: this.getSetting().CARID,
								code: code,
								codename: H_utiwake[this.getSetting().CARID][code].name,
								charge: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].charge,
								slipno: uriageno,
								itemcode: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].itemcode,
								itemname: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].itemname,
								itemsum: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].itemsum,
								buydate: uriagebi,
								comment: undefined,
								taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID][code].taxtype],
								detailno: detailno,
								recdate: now,
								green1: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].green1,
								green2: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].green2,
								green3: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].green3,
								green4: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].green4
							});
							detailno++;
							outPurchdetailsCnt++;

							if (true == purchaseAddFlgX) //purchase_X_tb 出力用配列へ格納
								//フラグを戻す
								{
									A_outPutPurchaseX.push({
										pactid: A_pactid[pactCounter],
										postid: rootPostidX,
										purchid: this.getSetting().LOGINID_HEADER + koubai_id,
										purchcoid: this.getSetting().CARID,
										loginid: undefined,
										registdate: undefined,
										registcomp: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].registcomp,
										registpost: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].registpost,
										registzip: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].registzip,
										registaddr1: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].registaddr1,
										registaddr2: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].registaddr2,
										registbuilding: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].registbuilding,
										registtelno: undefined,
										registfaxno: undefined,
										registemail: undefined,
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
										pre_purchid: undefined,
										pre_purchcoid: undefined
									});
									outPurchXCnt++;
									purchaseAddFlgX = false;
								}

							if ("N" == this.TargetTable && true == purchaseAddFlg) //purchase_tb 出力用配列へ格納
								//フラグを戻す
								{
									A_outPutPurchase.push({
										pactid: A_pactid[pactCounter],
										postid: rootPostidX,
										purchid: this.getSetting().LOGINID_HEADER + koubai_id,
										purchcoid: this.getSetting().CARID,
										loginid: undefined,
										registdate: undefined,
										registcomp: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].registcomp,
										registpost: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].registpost,
										registzip: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].registzip,
										registaddr1: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].registaddr1,
										registaddr2: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].registaddr2,
										registbuilding: H_editAllFileData[koubai_id][uriagebi][uriageno][lineno].registbuilding,
										registtelno: undefined,
										registfaxno: undefined,
										registemail: undefined,
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
										pre_purchid: undefined,
										pre_purchcoid: undefined
									});
									outPurchCnt++;
									purchaseAddFlg = false;
								}
						}

						if (0 != sumTax) //purchase_details_X_tb 出力用配列へ格納
							{
								code = this.getSetting().UTIWAKE_TAX_CODE;
								A_outPutPurchaseDetails.push({
									pactid: A_pactid[pactCounter],
									purchid: this.getSetting().LOGINID_HEADER + koubai_id,
									purchcoid: this.getSetting().CARID,
									code: code,
									codename: H_utiwake[this.getSetting().CARID][code].name,
									charge: sumTax,
									slipno: uriageno,
									itemcode: undefined,
									itemname: "\u6D88\u8CBB\u7A0E",
									itemsum: undefined,
									buydate: uriagebi,
									comment: undefined,
									taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID][code].taxtype],
									detailno: detailno,
									recdate: now,
									green1: undefined,
									green2: undefined,
									green3: undefined,
									green4: undefined
								});
								detailno++;
								outPurchdetailsCnt++;
							}
					}
				}

				if (true == aspFlg) //合計用に１つ進める
					//ASP利用料を出力
					{
						detailno++;
						A_outPutPurchaseDetails.push({
							pactid: A_pactid[pactCounter],
							purchid: this.getSetting().LOGINID_HEADER + koubai_id,
							purchcoid: this.getSetting().CARID,
							code: this.getSetting().UTIWAKE_ASP_CODE,
							codename: H_utiwake[this.getSetting().CARID][this.getSetting().UTIWAKE_ASP_CODE].name,
							charge: aspCharge,
							slipno: undefined,
							itemcode: undefined,
							itemname: "\uFF21\uFF33\uFF30\u5229\u7528\u6599",
							itemsum: undefined,
							buydate: undefined,
							comment: undefined,
							taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID][this.getSetting().UTIWAKE_ASP_CODE].taxtype],
							detailno: detailno,
							recdate: now,
							green1: undefined,
							green2: undefined,
							green3: undefined,
							green4: undefined
						});

						if (0 != asxCharge) //ASP利用料消費税を出力
							{
								detailno++;
								A_outPutPurchaseDetails.push({
									pactid: A_pactid[pactCounter],
									purchid: this.getSetting().LOGINID_HEADER + koubai_id,
									purchcoid: this.getSetting().CARID,
									code: this.getSetting().UTIWAKE_ASX_CODE,
									codename: H_utiwake[this.getSetting().CARID][this.getSetting().UTIWAKE_ASX_CODE].name,
									charge: asxCharge,
									slipno: undefined,
									itemcode: undefined,
									itemname: "\uFF21\uFF33\uFF30\u5229\u7528\u6599\u6D88\u8CBB\u7A0E",
									itemsum: undefined,
									buydate: undefined,
									comment: undefined,
									taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID][this.getSetting().UTIWAKE_ASX_CODE].taxtype],
									detailno: detailno,
									recdate: now,
									green1: undefined,
									green2: undefined,
									green3: undefined,
									green4: undefined
								});
							}

						outPurchdetailsCnt++;
					}
			}

			A_pactDone.push(A_pactid[pactCounter]);
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(purchase_tb:" + outPurchCnt + "\u4EF6," + purchaseX_tb + ":" + outPurchXCnt + "\u4EF6," + purchdetails_tb + ":" + outPurchdetailsCnt + "\u4EF6)\n", 1);
			outPurchCnt = outPurchXCnt = outPurchdetailsCnt = 0;
		}

		var pactDoneCnt = A_pactDone.length;

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
			//終了
			{
				this.warningOut(1000, "\u30A4\u30F3\u30DD\u30FC\u30C8\u53EF\u80FD\u306A\u8ACB\u6C42\u60C5\u5831\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw die(0);
			}

		if ("Y" == this.BackUpFlg) {
			var expFile = dataDir + purchdetails_tb + date("YmdHis") + ".exp";

			if (false == this.expData(purchdetails_tb, expFile, this.getSetting().NUM_FETCH)) {
				throw die(-1);
			}
		}

		this.get_DB().beginTransaction();

		for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //購買ＩＤの削除フラグをfalseにする必要がある場合
		{
			if (A_undoPurchidX.length != 0) {
				O_PurchaseModel.chgDelFlg(A_pactDone[pactDoneCounter], this.getSetting().CARID, A_undoPurchidX, "false", tableNo);
			}

			if (undefined !== A_undoPurchid == true && 0 != A_undoPurchid.length) {
				O_PurchaseModel.chgDelFlg(A_pactDone[pactDoneCounter], this.getSetting().CARID, A_undoPurchid, "false");
			}
		}

		if ("O" == this.Mode) {
			O_BillModel.delPurchaseDetailsData(A_pactDone, tableNo, A_purchcoid);
		}

		if (0 != A_outPutPurchaseDetails.length) //purchase_details_X_tb取込失敗
			{
				var rtn = this.get_DB().pgCopyFromArray(purchdetails_tb, A_outPutPurchaseDetails);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + purchdetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(purchdetails_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		if (0 != A_outPutPurchaseX.length) //purchase_X_tbへデータ取込
			//purchase_X_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray(purchaseX_tb, A_outPutPurchaseX);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + purchaseX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(purchaseX_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		if (undefined !== A_outPutPurchase == true && 0 != A_outPutPurchase.length) //purchase_tbへデータ取込
			//purchase_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray("purchase_tb", A_outPutPurchase);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\npurchase_tb \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut("purchase_tb \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		this.get_DB().commit();

		for (pactDoneCounter = 0;; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動元ディレクトリ
		//移動先ディレクトリ
		{
			var fromDir = dataDir + A_pactDone[pactDoneCounter];
			var finDir = fromDir + "/fin";
			this.mvFile(fromDir, finDir);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("\uFF21\uFF33\uFF2B\uFF35\uFF2C\u8CFC\u8CB7\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 1);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};