
import MtTableUtil from '../../MtTableUtil';
import PactModel from '../../model/PactModel';
import BillModel from '../../model/BillModel';
import PostModel from '../../model/PostModel';
import TelModel from '../../model/TelModel';
import FuncModel from '../../model/FuncModel';
import ProcessBaseBatch from '../ProcessBaseBatch';
import {SuoImportSoftTeleView} from '../../view/script/SuoImportSoftTeleView';
import {SuoImportSoftTeleModel} from '../../model/script/SuoImportSoftTeleModel';

export class SuoImportSoftTeleProc extends ProcessBaseBatch {

	O_View: SuoImportSoftTeleView;
	O_Model: SuoImportSoftTeleModel;
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
		this.getSetting().loadConfig("sbtelecom");
		this.O_View = new SuoImportSoftTeleView();
		this.O_Model = new SuoImportSoftTeleModel(this.get_MtScriptAmbient());
	}

	async doExecute(H_param: {} | any[] = Array()) //メモリが足りないので・・
	//SUOメモリ足りないので上げる
	//処理開始
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//データディレクトリを取得
	//データディレクトリチェック（スクリプト終了）
	//PactModelインスタンス作成
	//会社マスターを作成
	//BillModelインスタンスを作成
	//内訳種別マスター情報を取得
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
		// ini_set("max_execution_time", 6000);
		// ini_set("memory_limit", "3000M");
		//this.infoOut(this.getSetting().SBTELECOM + "\u958B\u59CB\n", 1);
		this.infoOut(this.getSetting().get("SBTELECOM") + "開始\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");

		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.BillDate + this.getSetting().get("SBTELECOM_DIR") + "/";

		// if (this.isDirCheck(dataDir, "rw") == false) {
		if (this.isDirCheck(dataDir) == false) {
			// this.errorOut(1000, this.getSetting().SBTELECOM + "\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			this.errorOut(1000, this.getSetting().get("SBTELECOM") + "データファイルディレクトリ" + dataDir + "がみつかりません\n", 0, "", "");
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
				// this.errorOut(1000, "\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
				this.errorOut(1000, "データファイルがみつかりません\n", 0, "", "");
				throw process.exit(-1);
			}


			var A_pactDone = Array();
		}


		var O_PactModel = new PactModel();

		var H_pactid = O_PactModel.getPactIdCompNameFromPact();

		var O_BillModel = new BillModel();

		var H_utiwake = O_BillModel.getUtiwake([this.getSetting().get("CARID")]);

		// var tableNo = new MtTableUtil(this.BillDate, false);
		var tableNo = new MtTableUtil();

		var telX_tb = "tel_" + tableNo + "_tb";

		var teldetails_tb = "tel_details_" + tableNo + "_tb";

		var commhistory_tb = "commhistory_" + tableNo + "_tb";

		var outTelCnt  = 0;
		var outTelXCnt = 0;
		var outTeldetailsCnt = 0;
		var outCommhistoryCnt = 0;
		var A_outPutTelDetails = Array();
		var A_outPutTelX = Array();
		var A_outPutCommhistory = Array();
		var A_outPutTel = Array();


		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		//PostModelインスタンスを作成
		//請求月用のルート部署を取得
		//TelModelインスタンスを作成
		//請求月テーブルより電話番号マスターを取得する array(CARID => array(telno))
		//とりあえず保留
		//// 請求月テーブルに登録済み電話番号の部署ＩＤを取得する（キャリアが異なる同一電話番号が異なる部署ＩＤのものは除外）
		//$H_postidUniqX = $O_TelModel->getTelnoPostid($A_pactid[$pactCounter],$tableNo);
		//ASP料金が true:発生する、false:発生しない
		//FuncModelインスタンスを作成
		//会社権限リストを取得
		//ASP料金が発生する場合
		//請求明細
		//通話明細
		//電話番号管理テーブル
		//現在テーブルにも追加する場合
		//電話番号一覧を取得
		//ファイルデータを１電話番号ずつ処理
		//ファイルデータを１電話番号ずつ処理 END
		//合計金額チェック
		//電話番号一覧を取得
		//ファイルデータを１電話番号ずつ処理
		//ファイルデータを１電話番号ずつ処理 END
		//正常処理が完了した pactid のみリストに追加
		{
			if (undefined !== H_pactid[A_pactid[pactCounter]] == false) //次のpactidへスキップ
				//pactid が会社マスターに登録されている場合
			{
				// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
				this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " は pact_tb に登録されていません スキップします\n", 1);
				continue;
			} else //pactid 毎のデータディレクトリ設定
				//データファイル名を取得
				//処理するファイル数
				//データファイルがなかった場合（スクリプト続行 次のpactidへスキップ）
				//ファイルエラーフラグ
				//合計金額全ファイルデータ配列
				//請求データ全ファイルデータ配列
				//通話明細全ファイルデータ配列
				//ダミー電話番号とダミー電話番号用部署ＩＤを取得する
				//ダミー電話番号が設定されていない場合
				//１ファイルでも不備があれば、そのpactidはスキップする（スクリプト続行 次のpactidへスキップ）
				//ログ出力
			{

				var dataDirPact = dataDir + A_pactid[pactCounter];

				var A_billFile = this.getFileList(dataDirPact);

				var fileCnt = A_billFile.length;

				if (0 == fileCnt) //次のpactidへスキップ
				{
					// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
					this.warningOut(1000, "契約ID" + A_pactid[pactCounter] + " のデータファイルがみつかりません スキップします\n", 1);
					continue;
				}

				A_billFile.sort();

				var fileErrFlg = false;

				var A_allSumData = Array();

				var A_allBillData = Array();

				var A_allTuwaData = Array();

				var H_dummyData = await O_BillModel.getDummy(A_pactid[pactCounter], this.getSetting().get("CARID"), "", tableNo.toString());

				if (H_dummyData.length == 0) //次のpactidへスキップ
				{
					// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u30C0\u30DF\u30FC\u96FB\u8A71\u756A\u53F7\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のダミー電話番号が設定されていません スキップします\n", 1);
					continue;
				}

				
				for (var fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイル名から請求年月とpactidを取得するための準備
					//ファイル名から請求年月をチェック
					//データファイルチェックでエラーがあった場合（項目数）
				{
					var A_sumData = Array();

					var A_billData = Array();

					var A_tuwaData = Array();

					var A_fileNameEle =   A_billFile[fileCounter].toLowerCase().replace(".csv", "").split("-");

					if (A_fileNameEle[0] != this.BillDate) {
						// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306E\u8ACB\u6C42\u5E74\u6708\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
						this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のデータファイル " + A_billFile[fileCounter] + " の請求年月が不正です\n", 1);
						fileErrFlg = true;
					}

					if (A_fileNameEle[1] != A_pactid[pactCounter]) {
						// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306Epactid\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
						this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のデータファイル " + A_billFile[fileCounter] + "のpactidが不正です\n", 1);
						fileErrFlg = true;
					}

					var rtnCode = this.O_Model.chkBillData(dataDirPact + "/" + A_billFile[fileCounter], A_sumData, A_billData, A_tuwaData);

					if (rtnCode == false) //データファイルチェックでエラーがなかった場合
					{
						fileErrFlg = true;
					} else //複数ファイルデータをマージ
					{
						A_allSumData = A_allSumData.concat(A_allSumData, A_sumData);
						A_allBillData = A_allBillData.concat(A_allBillData, A_billData);
						A_allTuwaData = A_allTuwaData.concat(A_allTuwaData, A_tuwaData);
					}
				}

				if (true == fileErrFlg) //次のpactidへスキップ
				{
					// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u4E0D\u6B63\u306A\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のデータファイルが不正な為、スキップします\n", 1);
					continue;
				} else //必要なデータのみ保持する
						//請求金額合計
						//請求情報
						//通話明細
				{
					var billCharge = this.O_Model.editSumData(A_allSumData);

					var H_editAllBillData = this.O_Model.editBillData(A_allBillData);

					var H_editAllTuwaData = this.O_Model.editTuwaData(A_allTuwaData);
				}

				this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
			}


			var O_PostModel = new PostModel();

			var rootPostidX = O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo.toString());

			var O_TelModel = new TelModel();

			var H_telnoX = O_TelModel.getCaridTelno(A_pactid[pactCounter], tableNo.toString(), [this.getSetting().get("CARID")]);

			var aspFlg = false;

			var O_FuncModel = new FuncModel();

			var H_pactFunc = O_FuncModel.getPactFunc(A_pactid[pactCounter], undefined, false);

			if (-1 !== Object.keys(H_pactFunc).indexOf("fnc_asp") == true) //ＡＳＰ料金を取得
			{
				aspFlg = true;

				var aspCharge = await O_BillModel.getAspCharge(A_pactid[pactCounter], this.getSetting().get("CARID"));
				var asxCharge;
				if ("" == aspCharge) //次のpactidへスキップ
				{
					// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のＡＳＰ利用料が設定されていない為、スキップします\n", 1);
					continue;
				}

				asxCharge = +(aspCharge * this.getSetting().get("excise_tax"));
			}


			// var A_outPutTelDetails = Array();

			// var A_outPutCommhistory = Array();

			// var A_outPutTelX = Array();

			var H_telno: any;

			if ("N" == this.TargetTable) //現在テーブルより電話番号マスターを取得する array(CARID => array(telno))
				//電話番号管理テーブル
				//とりあえず保留
				//// 電話管理に登録済み電話番号の部署ＩＤを取得する（キャリアが異なる同一電話番号が異なる部署ＩＤのものは除外）
				//$H_postidUniq = $O_TelModel->getTelnoPostid($A_pactid[$pactCounter],null);
			{

				H_telno = O_TelModel.getCaridTelno(A_pactid[pactCounter], undefined, [this.getSetting().get("CARID")]);

				A_outPutTel = Array();
			}


			var now = this.get_DB().getNow();

			var sumCharge = 0;

			var sumChargeInt = 0;

			var A_telno = Object.keys(H_editAllBillData);
			A_telno.sort();

			var detailno = 0;

			for (var telno of A_telno) //電話番号を文字列認識させる
			//tel_X_tb に登録する必要があるかどうか false：無、true：有
			//tel_X_tb に電話番号がない場合
			//明細を１件ずつ処理する
			//tel_X_tb へ登録する必要有りの場合
			{

				var telno = telno + "";

				var telAddFlgX = false;

				var telAddFlg;

				if (-1 !== H_telnoX[this.getSetting().get("CARID")].indexOf(telno) == false) //tel_X_tb へ登録する必要有り
				{
					telAddFlgX = true;
				}
				if ("N" == this.TargetTable) //tel_tb に登録する必要があるかどうか false：無、true：有
					//tel_tb に電話番号がない場合
				{
					if (-1 !== H_telno[this.getSetting().get("CARID")].indexOf(telno) == false) //tel_tb へ登録する必要有り
					{
						telAddFlg = true;
					}
				}
				var A_detailno_tmp = Object.keys(H_editAllBillData[telno]);
				var A_detailno = A_detailno_tmp.map(Number); //string[] -> number[]
				//var A_detailno = H_editAllBillData[telno].key();
				A_detailno.sort();


				for (detailno of A_detailno) //内訳コードマスターに存在しないコードがあった場合は処理中止
				//再掲区分が通常のもののみ合計金額へ加算する
				{
					if (undefined !== H_utiwake[this.getSetting().get("CARID")][H_editAllBillData[telno][detailno].code] == false) {
						// this.errorOut(1000, "\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u5185\u8A33\u30B3\u30FC\u30C9[" + H_editAllBillData[telno][detailno].code + "]\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F\u3002\n\u5185\u8A33\u30B3\u30FC\u30C9\u3092\u66F4\u65B0\u3057\u3066\u304B\u3089\u3001\u518D\u5EA6\u51E6\u7406\u3092\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002\n", 0, "", "");
						this.errorOut(1000, "登録されていない内訳コード[" + H_editAllBillData[telno][detailno].code + "]が見つかりました。\n内訳コードを更新してから、再度処理を行ってください。\n", 0, "", "");
						throw process.exit(-1);
					}

					A_outPutTelDetails.push({
					pactid: A_pactid[pactCounter],
					telno: telno,
					code: H_editAllBillData[telno][detailno].code,
					codename: H_utiwake[this.getSetting().get("CARID")][H_editAllBillData[parseInt(telno)][detailno].code].name,
					charge: +(H_editAllBillData[telno][detailno].charge / 100),
					taxkubun: H_editAllBillData[telno][detailno].taxkubun,
					detailno: detailno,
					recdate: now,
					carid: this.getSetting().get("CARID"),
					tdcomment: undefined,
					prtelno: H_editAllBillData[telno][detailno].billno,
					realcnt: undefined
					});

					if (H_utiwake[this.getSetting().get("CARID")][H_editAllBillData[telno][detailno].code].codetype == this.getSetting().get("SAIKEI_NORMAL")) //合計金額を算出
					{
						sumCharge += H_editAllBillData[telno][detailno].charge;
						sumChargeInt += +(H_editAllBillData[telno][detailno].charge / 100);
					}

					outTeldetailsCnt++;
				}

				if (true == telAddFlgX) //tel_X_tb 出力用配列へ格納
					//フラグを戻す
				{

					var H_data = {
						pactid: A_pactid[pactCounter],
						postid: rootPostidX,
						telno: telno,
						telno_view: H_editAllBillData[parseInt(telno)][0].telnoview,
						userid: undefined, //下で新しい配列を代入する際に、ここで項目を定義していないとエラーになる。
						carid: this.getSetting().get("CARID"),
						arid: this.getSetting().get("ARID"),
						cirid: this.getSetting().get("CIRID"),
						recdate: now,
						fixdate: now
					};
					this.O_Model.setOutPut(telX_tb, A_outPutTelX, H_data);
					outTelXCnt++;
					telAddFlgX = false;
				}

				if ("N" == this.TargetTable && true == telAddFlg) //tel_tb 出力用配列へ格納
					//フラグを戻す
				{
					H_data = {
						pactid: A_pactid[pactCounter],
						postid: rootPostidX,
						telno: telno,
						telno_view: H_editAllBillData[telno][0].telnoview,
						userid: undefined,
						carid: this.getSetting().get("CARID"),
						arid: this.getSetting().get("ARID"),
						cirid: this.getSetting().get("CIRID"),
						recdate: now,
						fixdate: now
					};
					this.O_Model.setOutPut("tel_tb", A_outPutTel, H_data);
					outTelCnt++;
					telAddFlg = false;
				}

				if (true == aspFlg) //合計用に２つ進める
				//ASP利用料を出力
				{
					detailno++
					detailno++;
					A_outPutTelDetails.push({
						pactid: A_pactid[pactCounter],
						telno: telno,
						code: this.getSetting().get("UTIWAKE_ASP_CODE"),
						codename: H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_ASP_CODE")].name,
						charge: aspCharge,

						taxkubun: this.getSetting().get("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_ASP_CODE")].taxtype],
						detailno: detailno,
						recdate: now,
						carid: this.getSetting().get("CARID"),
						tdcomment: undefined,
						prtelno: undefined,
						realcnt: undefined
					});
					outTeldetailsCnt++;

					if (0 != asxCharge) //ASP利用料消費税を出力
					{
						detailno++;
						A_outPutTelDetails.push({
							pactid: A_pactid[pactCounter],
							telno: telno,
							code: this.getSetting().get("UTIWAKE_ASX_CODE"),
							codename: H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_ASX_CODE")].name,
							charge: asxCharge,

							taxkubun: this.getSetting().get("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_ASX_CODE")].taxtype],
							detailno: detailno,
							recdate: now,
							carid: this.getSetting().get("CARID"),
							tdcomment: undefined,
							prtelno: undefined,
							realcnt: undefined
						});
						outTeldetailsCnt++;
					}
				}
			}

			if (billCharge != +(sumCharge / 100)) //次のpactidへスキップ
			{
				// this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u5408\u8A08\u91D1\u984D\u304C\u4E00\u81F4\u3057\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
				this.warningOut(1000, "契約ID" + A_pactid[pactCounter] + " の合計金額が一致しない為、処理をスキップします\n", 1);
				continue;
			}

			if (+(sumCharge / 100 - sumChargeInt != 0)) //tel_details_X_tb 出力用配列へ格納
				//tel_X_tb に電話番号がない場合
			{

				// var detailno = 0;
				A_outPutTelDetails.push({
					pactid: A_pactid[pactCounter],
					telno: H_dummyData[0].telno,
					code: this.getSetting().get("UTIWAKE_TYOUSEI_CODE"),
					codename: H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_TYOUSEI_CODE")].name,
					charge: +(sumCharge / 100 - sumChargeInt),

					taxkubun: this.getSetting().get("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_TYOUSEI_CODE")].taxtype],
					detailno: detailno,
					recdate: now,
					carid: this.getSetting().get("CARID"),
					tdcomment: undefined,
					prtelno: undefined,
					realcnt: undefined
				});
				outTeldetailsCnt++;

				if (-1 !== H_telnoX[this.getSetting().get("CARID")].indexOf(H_dummyData[0].telno) == false) //tel_X_tb 出力用配列へ格納
				{
					H_data = {
						pactid: A_pactid[pactCounter],
						postid: H_dummyData[0].postid,
						telno: H_dummyData[0].telno,
						telno_view: H_dummyData[0].telno,
						userid: undefined,
						carid: this.getSetting().get("CARID"),
						arid: this.getSetting().get("ARID"),
						cirid: this.getSetting().get("CIRID"),
						recdate: now,
						fixdate: now
					};
					this.O_Model.setOutPut(telX_tb, A_outPutTelX, H_data);
					outTelXCnt++;
				}
			}

			// this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u8ACB\u6C42\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(tel_tb:" + outTelCnt + "\u4EF6," + telX_tb + ":" + outTelXCnt + "\u4EF6," + teldetails_tb + ":" + outTeldetailsCnt + "\u4EF6)\n", 1);
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") 請求明細ファイル出力完了(tel_tb:" + outTelCnt + "件," + telX_tb + ":" + outTelXCnt + "件," + teldetails_tb + ":" + outTeldetailsCnt + "件\n", 1);
			A_telno = Object.keys(H_editAllTuwaData);
			A_telno.sort();


			for (var telno of A_telno) //電話番号を文字列認識させる
			//明細番号一覧を取得
			//明細を１件ずつ処理する
			//明細を１件ずつ処理する END
			{
				telno = telno + "";
				////A_detailno = Object.keys(H_editAllTuwaData[parseInt(telno)]);
				var A_detailno_tmp = Object.keys(H_editAllTuwaData[telno]);
				var A_detailno = A_detailno_tmp.map(Number); //string[] -> number[]
				A_detailno.sort();


				for (var detailno of (A_detailno)) //commhistory_X_tb 出力用配列へ格納
				{
					A_outPutCommhistory.push({
						pactid: A_pactid[pactCounter],
						telno: telno,

						type: this.getSetting().get("TUWA_TYPE"),
						date: H_editAllTuwaData[parseInt(telno)][detailno].date,
						totelno: H_editAllTuwaData[parseInt(telno)][detailno].totelno,
						toplace: undefined,
						fromplace: undefined,
						time: H_editAllTuwaData[parseInt(telno)][detailno].time,
						charge: H_editAllTuwaData[parseInt(telno)][detailno].charge,
						byte: undefined,
						callseg: undefined,
						callsegname: undefined,
						chargeseg: undefined,
						discountseg: undefined,
						occupseg: undefined,
						kubun1: undefined,
						kubun2: undefined,
						kubun3: undefined,
						carid: this.getSetting().get("CARID"),
						byte_mail: undefined,
						byte_site: undefined,
						byte_other: undefined,
						kousiflg: undefined,
						multinumber: undefined,
						comservice: undefined,
						comorg: undefined,
						sendrec: undefined,
						decoratemode: undefined
					});
					outCommhistoryCnt++;
				}
			}

			// this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u901A\u8A71\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(" + commhistory_tb + ":" + outCommhistoryCnt + "\u4EF6)\n", 1);
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") 通話明細ファイル出力完了(" + commhistory_tb + ":" + outCommhistoryCnt + "件)\n", 1);
			A_pactDone.push(A_pactid[pactCounter]);
			outTelCnt = 0;
			outTelXCnt = 0;
			outTeldetailsCnt = 0;
			outCommhistoryCnt = 0;
		}


		var pactDoneCnt = A_pactDone.length;

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
		//終了
		{
			// this.warningOut(1000, "\u30A4\u30F3\u30DD\u30FC\u30C8\u53EF\u80FD\u306A\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
			this.warningOut(1000, "インポート可能なデータがありませんでした\n", 1);
			this.unLockProcess(this.O_View.get_ScriptName());
			this.set_ScriptEnd();
			throw process.exit(0);
		}

		if ("Y" == this.BackUpFlg) //請求明細バックアップファイル名
			//請求明細をバックアップ
			//通話明細をバックアップ
		{
			var expFile = dataDir + teldetails_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join(""); + ".exp";

			if (false == this.expData(teldetails_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
				throw process.exit(-1);
			}

			expFile = dataDir + commhistory_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join(""); + ".exp";

			if (false == this.expData(commhistory_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
				throw process.exit(-1);
			}
		}

		this.get_DB().beginTransaction();

		if ("O" == this.Mode) //請求明細
		//通話明細
		{
			O_BillModel.delTelDetailsData(A_pactDone, tableNo.toString(), [this.getSetting().get("CARID")]);
			O_BillModel.delCommhistoryData(A_pactDone, tableNo.toString(), [this.getSetting().get("CARID")]);
		}

		if (0 != A_outPutTelDetails.length) //tel_details_X_tb取込失敗
		{

			var rtn = this.get_DB().pgCopyFromArray(teldetails_tb, A_outPutTelDetails);

			if (await rtn == false) {
				this.get_DB().rollback();
				// this.errorOut(1000, "\n" + teldetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
				this.errorOut(1000, "\n" + teldetails_tb + " へのデータ取込に失敗しました\n", 0, "", "");
				throw process.exit(-1);
			} else {
				// this.infoOut(teldetails_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				this.infoOut(teldetails_tb + " へデーターインポート完了\n", 1);
			}
		}

		if (0 != A_outPutTelX.length) //tel_X_tbへデータ取込
		//tel_X_tb取込失敗
		{
			rtn = this.get_DB().pgCopyFromArray(telX_tb, A_outPutTelX);

			if (await rtn == false) {
				this.get_DB().rollback();
				// this.errorOut(1000, "\n" + telX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
				this.errorOut(1000, "\n" + telX_tb + " へのデータ取込に失敗しました\n", 0, "", "");
				throw process.exit(-1);
			} else {
				// this.infoOut(telX_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				this.infoOut(telX_tb + " へデーターインポート完了\n", 1);
			}
		}

		if (undefined !== A_outPutTel == true && 0 != A_outPutTel.length) //tel_tbへデータ取込
		//tel_tb取込失敗
		{
			rtn = this.get_DB().pgCopyFromArray("tel_tb", A_outPutTel);

			if (await rtn == false) {
				this.get_DB().rollback();
				// this.errorOut(1000, "\ntel_tb \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
				this.errorOut(1000, "\ntel_tb へのデータ取込に失敗しました\n", 0, "", "");
				throw process.exit(-1);
			} else {
				// this.infoOut("tel_tb \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				this.infoOut("tel_tb へデーターインポート完了\n", 1);
			}
		}

		if (undefined !== A_outPutCommhistory == true && 0 != A_outPutCommhistory.length) //出力件数取得
		//一定行数以上は分割して複数回で取込む
		{

			var outCnt = A_outPutCommhistory.length;

			var roopCnt = Math.floor(outCnt / this.getSetting().get("NUM_FETCH")) + 1;


			for (var doCnt = 0; doCnt < roopCnt; doCnt++) //一定行数を取り出す
			//取込み
			//commhistory_X_tb取込失敗
			{

				var A_doCommhistory = A_outPutCommhistory.slice(doCnt * this.getSetting().get("NUM_FETCH"), this.getSetting().get("NUM_FETCH"));
				rtn = this.get_DB().pgCopyFromArray(commhistory_tb, A_doCommhistory);

				if (await rtn == false) {
					this.get_DB().rollback();
					// this.errorOut(1000, "\n" + commhistory_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					this.errorOut(1000, "\n" + commhistory_tb + " へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);
				}
			}

			// this.infoOut(commhistory_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
			this.infoOut(commhistory_tb + " へデーターインポート完了\n", 1);
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
		// this.infoOut(this.getSetting().SBTELECOM + "\u7D42\u4E86\n", 1);
		this.infoOut(this.getSetting().get("SBTELECOM") + "終了\n", 1);
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
