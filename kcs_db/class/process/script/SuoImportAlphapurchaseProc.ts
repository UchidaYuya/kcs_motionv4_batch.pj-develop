//error_reporting(E_ALL|E_STRICT);// 2022cvt_011

import MtTableUtil from '../../MtTableUtil';
import PactModel from '../../model/PactModel';
import BillModel from '../../model/BillModel';
import PostModel from '../../model/PostModel';
import {PurchaseModel} from '../../model/PurchaseModel';
import FuncModel from '../../model/FuncModel';
import ProcessBaseBatch from '../ProcessBaseBatch';
import {SuoImportAlphapurchaseView} from '../../view/script/SuoImportAlphapurchaseView';
import SuoImportAlphapurchaseModel from '../../model/script/SuoImportAlphapurchaseModel';

export class SuoImportAlphapurchaseProc extends ProcessBaseBatch {

	O_View: SuoImportAlphapurchaseView;
	O_Model: SuoImportAlphapurchaseModel;
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
		this.getSetting().loadConfig("alphapurchase");
		this.O_View = new SuoImportAlphapurchaseView();
		this.O_Model = new SuoImportAlphapurchaseModel(this.get_MtScriptAmbient());
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
		// this.infoOut("\u30A2\u30EB\u30D5\u30A1\u30D1\u30FC\u30C1\u30A7\u30B9\u8CFC\u8CB7\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);
		this.infoOut("アルファパーチェス購買データインポート開始\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");

		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.BillDate + this.getSetting().get("KOUBAI_ALPHAPURCHASE_DIR") + "/";

		// if (this.isDirCheck(dataDir, "rw") == false) {
		// if (this.isDirCheck(dataDir, "rw") == false) {
		if (this.isDirCheck(dataDir)) {
			// this.errorOut(1000, this.getSetting().KOUBAI_ALPHAPURCHASE + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			this.errorOut(1000, this.getSetting().get("KOUBAI_ALPHAPURCHASE") + "請求データファイルディレクトリ" + dataDir + "がみつかりません\n", 0, "", "");
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

		var A_purchcoid = [this.getSetting().get("CARID")];

		var H_utiwake = O_BillModel.getPurchaseUtiwake(A_purchcoid);

		// var tableNo = getTableNo(this.BillDate, false);
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);

		var purchaseX_tb = "purchase_" + tableNo + "_tb";

		var purchdetails_tb = "purchase_details_" + tableNo + "_tb";

		var outPurchCnt = 0;
		var outPurchXCnt = 0;
		var outPurchdetailsCnt = 0;

		var A_undoPurchidX = Array();
		var O_PurchaseModel = new PurchaseModel();
		var A_outPutPurchaseDetails = Array();
		var A_outPutPurchaseX = Array();


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
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + "  の請求データファイルがみつかりません スキップします\n", 1);
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

						var A_fileData: string[] | false;

						// var A_fileNameEle = split("-", str_replace(".txt", "", A_billFile[fileCounter].toLowerCase()));
						var A_fileNameEle = A_billFile[fileCounter].toLowerCase().replace(".txt", "").split("-");

						if (A_fileNameEle[0] != this.BillDate) {
							// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306E\u8ACB\u6C42\u5E74\u6708\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイル  " + A_billFile[fileCounter] + " の請求年月が不正です\n", 1);
							fileErrFlg = true;
						}

						if (A_fileNameEle[1] != A_pactid[pactCounter]) {
							// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306Epactid\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイル " + A_billFile[fileCounter] + " のpactidが不正です\n", 1);
							fileErrFlg = true;
						}

						A_fileData = this.O_Model.chkBillData(dataDirPact + "/" + A_billFile[fileCounter]);

						// if (!A_fileData == false) //データファイルチェックでエラーがなかった場合
						if (!A_fileData) //データファイルチェックでエラーがなかった場合
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
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイルが不正な為、スキップします\n", 1);
							continue;
						} else //必要なデータのみ保持する
						//array(顧客コード => array(受注日 => array(受注番号 => array(受注明細番号 => DBDATA)))
						{

							var H_editAllFileData = this.O_Model.editBillData(A_allFileData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}


			var O_PostModel = new PostModel();

			var rootPostidX = O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo);

			// var O_PurchaseModel = new PURCHASEMODEL.PurchaseModel();

			// var A_purchidX = O_PurchaseModel.getPurchid(A_pactid[pactCounter], this.getSetting().CARID, "false", tableNo);
			var A_purchidX = await O_PurchaseModel.getPurchid(A_pactid[pactCounter], this.getSetting().get("CARID"), false, tableNo);


			// var A_purchidXDel = O_PurchaseModel.getPurchid(A_pactid[pactCounter], this.getSetting().CARID, "true", tableNo);
			var A_purchidXDel = await O_PurchaseModel.getPurchid(A_pactid[pactCounter], this.getSetting().get("CARID"), true, tableNo);


			var aspFlg = false;

			var O_FuncModel = new FuncModel();

			var H_pactFunc = O_FuncModel.getPactFunc(A_pactid[pactCounter], undefined, false);

			var asxCharge;

			if (-1 !== Object.keys(H_pactFunc).indexOf("fnc_asp") == true) //ＡＳＰ料金を取得
				{
					aspFlg = true;

					var aspCharge = await O_BillModel.getPurchaseAspCharge(A_pactid[pactCounter], this.getSetting().get("CARID"));

					if ("" == aspCharge) //次のpactidへスキップ
						{
							// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のＡＳＰ利用料が設定されていない為、スキップします\n", 1);
							continue;
						}


					asxCharge = +(aspCharge * this.getSetting().get("excise_tax"));
				}


			// var A_outPutPurchaseDetails = Array();

			// var A_outPutPurchaseX = Array();

			// var A_undoPurchidX = Array();

			var A_purchid;

			var A_purchidDel;

			var A_undoPurchid;

			var A_outPutPurchase;

			if ("N" == this.TargetTable) //現在テーブルより削除されていない購買ＩＤマスターを取得する array(purchid)
				//現在テーブルより削除されている購買ＩＤマスターを取得する array(purchid)
				//購買ＩＤ管理テーブル
				//削除フラグをfalseにする必要のある購買ＩＤリスト
				{

					// A_purchid = O_PurchaseModel.getPurchid(A_pactid[pactCounter], this.getSetting().CARID, "false");
					A_purchid = O_PurchaseModel.getPurchid(A_pactid[pactCounter], this.getSetting().get("CARID"), false);

					// A_purchidDel = O_PurchaseModel.getPurchid(A_pactid[pactCounter], this.getSetting().CARID, "true");
					A_purchidDel = O_PurchaseModel.getPurchid(A_pactid[pactCounter], this.getSetting().get("CARID"), true);


					A_outPutPurchase = Array();

					A_undoPurchid = Array();
				}


			var allFileDataCnt = A_allFileData.length;

			var now = this.get_DB().getNow();

			var A_koubai_id = Object.keys(H_editAllFileData);
			A_koubai_id.sort();


			// for (var koubai_id of Object.values(A_koubai_id)) //購買ＩＤが空のデータは取り込みを行わない
			for (var koubai_id of A_koubai_id)
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

				if (-1 !== A_purchidX.indexOf(koubai_id) == false) //削除済みの購買ＩＤとして登録が有る場合
					//購買ＩＤマスターに追加
					{
						if (-1 !== A_purchidXDel.indexOf(koubai_id) == true) //削除を取り消す購買ＩＤリストに追加
							{
								A_undoPurchidX.push(koubai_id);
							} else //purchase_X_tb へ登録する必要有り
							{
								purchaseAddFlgX = true;
							}

						A_purchidX.push(koubai_id);
					}
				var purchaseAddFlg = false;
				if ("N" == this.TargetTable) //purchase_tb に登録する必要があるかどうか false：無、true：有
					//purchase_tb に購買ＩＤがない場合
					{

						// var purchaseAddFlg = false;

						if (-1 !== A_purchid.indexOf(koubai_id) == false) //削除済みの購買ＩＤとして登録が有る場合
							//購買ＩＤマスターに追加
							{
								if (-1 !== A_purchidDel.indexOf(koubai_id) == true) //削除を取り消す購買ＩＤリストに追加
									{
										A_undoPurchid.push(koubai_id);
									} else //purchase_tb へ登録する必要有り
									{
										purchaseAddFlg = true;
									}

								A_purchid.push(koubai_id);
							}
					}


				var A_uriagebi = Object.keys(H_editAllFileData[koubai_id]);
				A_uriagebi.sort();


				// for (var uriagebi of Object.values(A_uriagebi)) //売上ＮＯ一覧を取得
				for (var uriagebi of A_uriagebi)
				//売上ＮＯ一覧を１件ずつ処理
				//売上ＮＯ一覧を１件ずつ処理 END
				{

					var A_uriageno = Object.keys(H_editAllFileData[koubai_id][uriagebi]);
					A_uriageno.sort();


					// for (var uriageno of Object.values(A_uriageno)) //伝票計（税抜）は売上ＮＯ毎に初期化
					for (var uriageno of A_uriageno)
					//消費税は売上ＮＯ毎に初期化
					//注文先情報は売上ＮＯ毎に初期化
					//お届け先情報は売上ＮＯ毎に初期化
					//送料は売上ＮＯ毎に初期化
					//注文先行は売上ＮＯ毎に先頭行へ出力
					//注文先行用に明細行ＮＯを確保する
					//納品先行は注文先行の次へ出力
					//納品先行用に明細行ＮＯを確保する
					//赤黒区分一覧を取得
					//赤黒区分一覧を１件ずつ処理
					//赤黒区分一覧を１件ずつ処理 END
					//注文先情報を出力
					//purchase_details_X_tb 出力用配列へ格納
					//納品先情報を出力
					//purchase_details_X_tb 出力用配列へ格納
					//送料があった場合は送料を出力
					{

						var sum = 0;

						var sumTax = 0;

						var ordername = "";

						var shiptoname = "";

						var delcharge = "";
						// var delcharge = 0;

						var orn_detailno = detailno;
						detailno++;

						var shn_detailno = detailno;
						detailno++;

						var A_akakuro = Object.keys(H_editAllFileData[koubai_id][uriagebi][uriageno]);
						A_akakuro.sort();


						// for (var akakuro of Object.values(A_akakuro)) //売上行ＮＯ一覧を取得
						for (var akakuro of A_akakuro) //売上行ＮＯ一覧を取得
						//売上行ＮＯ一覧を１件ずつ処理
						//売上行ＮＯ一覧を１件ずつ処理 END
						{

							var A_lineno = Object.keys(H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro]);
							A_lineno.sort();


							// for (var lineno of Object.values(A_lineno)) //注文先情報を取得
							for (var lineno of A_lineno)
							//伝票計（税抜）を加算
							//消費税を加算
							//purchase_details_X_tb 出力用配列へ格納
							//送料がある場合
							{
								if ("" == ordername) {
									ordername = H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].registpost + " " + H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].username;
								}

								if ("" == shiptoname) {
									shiptoname = H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].shiptoname1 + " " + H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].shiptoname2 + " " + H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].shiptoname3;
								}

								if (this.getSetting().get("ECO_FLG") == H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].green1 || this.getSetting().get("ECO_FLG") == H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].green2 || this.getSetting().get("ECO_FLG") == H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].green3) //通常商品の場合
									{

										var code = this.getSetting().get("UTIWAKE_ECO_CODE");
									} else {
									code = this.getSetting().get("UTIWAKE_CODE");
								}

								sum = sum + H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].charge;
								sumTax = sumTax + H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].tax;
								A_outPutPurchaseDetails.push({
									pactid: A_pactid[pactCounter],
									purchid: koubai_id,
									purchcoid: this.getSetting().get("CARID"),
									code: code,
									codename: H_utiwake[this.getSetting().get("CARID")][code].name,
									charge: H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].charge,
									slipno: uriageno,
									itemcode: H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].itemcode,
									itemname: H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].itemname,
									itemsum: H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].itemsum,
									buydate: uriagebi,
									comment: undefined,
									taxkubun: undefined,
									detailno: detailno,
									recdate: now,
									green1: H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].green1,
									green2: H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].green2,
									green3: H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].green3,
									green4: undefined
								});
								detailno++;
								outPurchdetailsCnt++;

								if (0 != H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].delcharge && "" == delcharge) //伝票計（税抜）を加算
								// if (0 != H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].delcharge && 0 == delcharge) //伝票計（税抜）を加算
								
									//消費税を加算
									{
										delcharge = H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].delcharge;
										// sum = sum + delcharge;
										sum = sum + parseInt(delcharge);
										sumTax = sumTax + H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].delchargetax;
									}

								if (true == purchaseAddFlgX) //purchase_X_tb 出力用配列へ格納
									//フラグを戻す
									{
										A_outPutPurchaseX.push({
											pactid: A_pactid[pactCounter],
											postid: rootPostidX,
											purchid: koubai_id,
											purchcoid: this.getSetting().get("CARID"),
											loginid: undefined,
											registdate: undefined,
											registcomp: H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].registcomp,
											registpost: H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].registpost,
											registzip: undefined,
											registaddr1: undefined,
											registaddr2: undefined,
											registbuilding: undefined,
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
											purchid: koubai_id,
											purchcoid: this.getSetting().get("CARID"),
											loginid: undefined,
											registdate: undefined,
											registcomp: H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].registcomp,
											registpost: H_editAllFileData[koubai_id][uriagebi][uriageno][akakuro][lineno].registpost,
											registzip: undefined,
											registaddr1: undefined,
											registaddr2: undefined,
											registbuilding: undefined,
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
						}

						code = this.getSetting().get("UTIWAKE_ORN_CODE");
						A_outPutPurchaseDetails.push({
							pactid: A_pactid[pactCounter],
							purchid: koubai_id,
							purchcoid: this.getSetting().get("CARID"),
							code: code,
							codename: H_utiwake[this.getSetting().get("CARID")][code].name,
							charge: 0,
							slipno: uriageno,
							itemcode: undefined,
							// itemname: H_utiwake[this.getSetting().CARID][code].name + "\uFF1A" + ordername,
							itemname: H_utiwake[this.getSetting().get("CARID")][code].name + "：" + ordername,
							itemsum: undefined,
							buydate: uriagebi,
							comment: undefined,
							taxkubun: undefined,
							detailno: orn_detailno,
							recdate: now,
							green1: undefined,
							green2: undefined,
							green3: undefined,
							green4: undefined
						});
						outPurchdetailsCnt++;
						code = this.getSetting().get("UTIWAKE_SHN_CODE");
						A_outPutPurchaseDetails.push({
							pactid: A_pactid[pactCounter],
							purchid: koubai_id,
							purchcoid: this.getSetting().get("CARID"),
							code: code,
							codename: H_utiwake[this.getSetting().get("CARID")][code].name,
							charge: 0,
							slipno: uriageno,
							itemcode: undefined,
							// itemname: H_utiwake[this.getSetting().CARID][code].name + "\uFF1A" + shiptoname,
							itemname: H_utiwake[this.getSetting().get("CARID")][code].name + "：" + shiptoname,
							itemsum: undefined,
							buydate: uriagebi,
							comment: undefined,
							taxkubun: undefined,
							detailno: shn_detailno,
							recdate: now,
							green1: undefined,
							green2: undefined,
							green3: undefined,
							green4: undefined
						});
						outPurchdetailsCnt++;

						if ("" != delcharge) //purchase_details_X_tb 出力用配列へ格納
							{
								code = this.getSetting().get("UTIWAKE_DEL_CODE");
								A_outPutPurchaseDetails.push({
									pactid: A_pactid[pactCounter],
									purchid: koubai_id,
									purchcoid: this.getSetting().get("CARID"),
									code: code,
									codename: H_utiwake[this.getSetting().get("CARID")][code].name,
									charge: delcharge,
									slipno: uriageno,
									itemcode: undefined,
									itemname: H_utiwake[this.getSetting().get("CARID")][code].name,
									itemsum: undefined,
									buydate: uriagebi,
									comment: undefined,
									taxkubun: this.getSetting().get("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][code].taxtype],
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

						if (0 != sum) //purchase_details_X_tb 出力用配列へ格納
							{
								code = this.getSetting().get("UTIWAKE_SUM_CODE");
								A_outPutPurchaseDetails.push({
									pactid: A_pactid[pactCounter],
									purchid: koubai_id,
									purchcoid: this.getSetting().get("CARID"),
									code: code,
									codename: H_utiwake[this.getSetting().get("CARID")][code].name,
									charge: sum,
									slipno: uriageno,
									itemcode: undefined,
									itemname: H_utiwake[this.getSetting().get("CARID")][code].name,
									itemsum: undefined,
									buydate: uriagebi,
									comment: undefined,
									taxkubun: this.getSetting().get("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][code].taxtype],
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

						if (0 != sumTax) //purchase_details_X_tb 出力用配列へ格納
							{
								code = this.getSetting().get("UTIWAKE_TAX_CODE");
								A_outPutPurchaseDetails.push({
									pactid: A_pactid[pactCounter],
									purchid: koubai_id,
									purchcoid: this.getSetting().get("CARID"),
									code: code,
									codename: H_utiwake[this.getSetting().get("CARID")][code].name,
									charge: sumTax,
									slipno: uriageno,
									itemcode: undefined,
									itemname: H_utiwake[this.getSetting().get("CARID")][code].name,
									itemsum: undefined,
									buydate: uriagebi,
									comment: undefined,
									taxkubun: this.getSetting().get("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][code].taxtype],
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

						if (0 != sum || 0 != sumTax) //purchase_details_X_tb 出力用配列へ格納
							{
								code = this.getSetting().get("UTIWAKE_SUX_CODE");
								A_outPutPurchaseDetails.push({
									pactid: A_pactid[pactCounter],
									purchid: koubai_id,
									purchcoid: this.getSetting().get("CARID"),
									code: code,
									codename: H_utiwake[this.getSetting().get("CARID")][code].name,
									charge: sum + sumTax,
									slipno: uriageno,
									itemcode: undefined,
									itemname: H_utiwake[this.getSetting().get("CARID")][code].name,
									itemsum: undefined,
									buydate: uriagebi,
									comment: undefined,
									taxkubun: this.getSetting().get("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][code].taxtype],
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
						code = this.getSetting().get("UTIWAKE_ASP_CODE");
						A_outPutPurchaseDetails.push({
							pactid: A_pactid[pactCounter],
							purchid: koubai_id,
							purchcoid: this.getSetting().get("CARID"),
							code: this.getSetting().get("UTIWAKE_ASP_CODE"),
							codename: H_utiwake[this.getSetting().get("CARID")][code].name,
							charge: aspCharge,
							slipno: undefined,
							itemcode: undefined,
							itemname: H_utiwake[this.getSetting().get("CARID")][code].name,
							itemsum: undefined,
							buydate: undefined,
							comment: undefined,
							taxkubun: this.getSetting().get("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][code].taxtype],
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
								code = this.getSetting().get("UTIWAKE_ASX_CODE");
								A_outPutPurchaseDetails.push({
									pactid: A_pactid[pactCounter],
									purchid: koubai_id,
									purchcoid: this.getSetting().get("CARID"),
									code: this.getSetting().get("UTIWAKE_ASX_CODE"),
									codename: H_utiwake[this.getSetting().get("CARID")][code].name,
									charge: asxCharge,
									slipno: undefined,
									itemcode: undefined,
									itemname: H_utiwake[this.getSetting().get("CARID")][code].name,
									itemsum: undefined,
									buydate: undefined,
									comment: undefined,
									taxkubun: this.getSetting().get("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][code].taxtype],
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
			// this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(purchase_tb:" + outPurchCnt + "\u4EF6," + purchaseX_tb + ":" + outPurchXCnt + "\u4EF6," + purchdetails_tb + ":" + outPurchdetailsCnt + "\u4EF6)\n", 1);
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ")  インポートファイル出力完了(purchase_tb:" + outPurchCnt + "件," + purchaseX_tb + ":" + outPurchXCnt + "件," + purchdetails_tb + ":" + outPurchdetailsCnt + "件)\n", 1);
			outPurchCnt = outPurchXCnt = outPurchdetailsCnt = 0;
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

			// var expFile = dataDir + purchdetails_tb + date("YmdHis") + ".exp";
			var expFile = dataDir + purchdetails_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join(""); + ".exp";

			if (false == this.expData(purchdetails_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
				throw process.exit(-1);
			}
		}

		this.get_DB().beginTransaction();


		for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //購買ＩＤの削除フラグをfalseにする必要がある場合
		{
			if (A_undoPurchidX.length != 0) {
				O_PurchaseModel.chgDelFlg(A_pactDone[pactDoneCounter], this.getSetting().get("CARID"), A_undoPurchidX, "false", tableNo);
			}

			if (undefined !== A_undoPurchid == true && 0 != A_undoPurchid.length) {
				O_PurchaseModel.chgDelFlg(A_pactDone[pactDoneCounter], this.getSetting().get("CARID"), A_undoPurchid, "false");
			}
		}

		if ("O" == this.Mode) {
			O_BillModel.delPurchaseDetailsData(A_pactDone, tableNo, A_purchcoid);
		}

		if (0 != A_outPutPurchaseDetails.length) //purchase_details_X_tb取込失敗
			{

				var rtn = this.get_DB().pgCopyFromArray(purchdetails_tb, A_outPutPurchaseDetails);

				if (await rtn == false) {
					this.get_DB().rollback();
					// this.errorOut(1000, "\n" + purchdetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					this.errorOut(1000, "\n" + purchdetails_tb + " へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);
				} else {
					// this.infoOut(purchdetails_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
					this.infoOut(purchdetails_tb + " へデーターインポート完了\n", 1);
				}
			}

		if (0 != A_outPutPurchaseX.length) //purchase_X_tbへデータ取込
			//purchase_X_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray(purchaseX_tb, A_outPutPurchaseX);

				if (await rtn == false) {
					this.get_DB().rollback();
					// this.errorOut(1000, "\n" + purchaseX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					this.errorOut(1000, "\n" + purchaseX_tb + " へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);
				} else {
					// this.infoOut(purchaseX_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
					this.infoOut(purchaseX_tb + " へデーターインポート完了\n", 1);
				
				}
			}

		if (undefined !== A_outPutPurchase == true && 0 != A_outPutPurchase.length) //purchase_tbへデータ取込
			//purchase_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray("purchase_tb", A_outPutPurchase);

				if (await rtn == false) {
					this.get_DB().rollback();
					// this.errorOut(1000, "\npurchase_tb \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					this.errorOut(1000, "\npurchase_tb へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);
				} else {
					// this.infoOut("purchase_tb \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
					this.infoOut("purchase_tb へデーターインポート完了\n", 1);
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
		// this.infoOut("\u30A2\u30EB\u30D5\u30A1\u30D1\u30FC\u30C1\u30A7\u30B9\u8CFC\u8CB7\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 1);
		this.infoOut("アルファパーチェス購買データインポート終了\n", 1);
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
