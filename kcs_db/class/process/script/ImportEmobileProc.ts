import MtTableUtil from "../../MtTableUtil";
import PactModel from "../../model/PactModel";
import BillModel from "../../model/BillModel";
import PostModel from "../../model/PostModel";
import TelModel from "../../model/TelModel";
import FuncModel from "../../model/FuncModel";
import ProcessBaseBatch from "../ProcessBaseBatch";
import ImportEmobileView from "../../view/script/ImportEmobileView";
import ImportEmobileModel from "../../model/script/ImportEmobileModel"
import TelAmountModel from "../../model/script/TelAmountModel";

export default class ImportEmobileProc extends ProcessBaseBatch {
	A_unregistCodes: Array<any>;
	A_interim: Array<any>;
	A_reserve: { [key: string]: any };
	notPrtelnos: Array<any>;
	amountCharge: Array<any>;
	O_View: ImportEmobileView;
	O_Model: ImportEmobileModel;
	PactId: string | undefined;
	BillDate: string | undefined;
	BackUpFlg: string | undefined;
	Mode: string | undefined;
	TargetTable: string | undefined;
	O_tam!: TelAmountModel;
	m_listener: any;
	m_exit_on_error: any;
	putError: any;
	putOperator: any;
	// isDirCheck: any;

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.A_unregistCodes = Array();
		this.A_interim = Array();
		this.A_reserve = Array();
		this.notPrtelnos = ["A0-0000", "C0-0000", "D0-0000", "E0-0000", "H0-0000", "J0-0000", "M0-0000", "Y5-0000", "Z0-0000"];
		this.amountCharge = Array();
		this.getSetting().loadConfig("emobile");
		this.O_View = new ImportEmobileView();
		this.O_Model = new ImportEmobileModel(this.get_MtScriptAmbient());
		this.A_reserve.errPactId = Array();
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
	//内訳種別マスター情報を取得
	//対象テーブル番号を取得
	//テーブル名設定
	//出力件数カウント
	//pactid 毎に処理する
	//END FOR pactid 毎に処理する
	//処理する件数が０件なら直ちに終了する
	//処理が完了したファイルを移動
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.infoOut("ＥＭＯＢＩＬＥ請求データインポート開始\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");
// 2022cvt_015
		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.BillDate + this.getSetting().get("EMOBILE_DIR") + "/";

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, this.getSetting().get("EMOBILE") + "請求データファイルディレクトリ" + dataDir + "がみつかりません\n", 0, "", "");
			throw process.exit(-1);// 2022cvt_009
		} else //処理する契約ＩＤ配列を初期化
			//処理する契約ＩＤを取得する
			//pactidでソート
			//処理する契約ＩＤ数
			//処理する契約ＩＤが１件もない場合（スクリプト終了）
			{
// 2022cvt_015
				var A_pactid = Array();
				A_pactid = this.getPactList(dataDir, this.PactId!);
				A_pactid.sort();
// 2022cvt_015
				var pactCnt = A_pactid.length;

				if (0 == pactCnt) {
					this.errorOut(1000, "請求データファイルがみつかりません\n", 0, "", "");
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
		var H_utiwake = O_BillModel.getUtiwake([this.getSetting().get("CARID")]);
// 2022cvt_015
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
// 2022cvt_015
		var telX_tb = "tel_" + tableNo + "_tb";
// 2022cvt_015
		var teldetails_tb = "tel_details_" + tableNo + "_tb";
// 2022cvt_015
		// var outTelCnt = outTelXCnt = outTeldetailsCnt = 0;
		var outTelXCnt = 0;
		var outTelCnt = 0;
		var outTeldetailsCnt = 0;
// 2022cvt_015
		var A_checkedCodeName = Array();
// 2022cvt_015
		var A_checkedTaxKubun = Array();

// 2022cvt_015
		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		//PostModelインスタンスを作成
		//請求月用のルート部署を取得
		//TelModelインスタンスを作成
		//請求月テーブルより電話番号マスターを取得する array(CARID => array(telno))
		//ASP料金が true:発生する、false:発生しない
		//FuncModelインスタンスを作成
		//会社権限リストを取得
		//ASP料金が発生する場合
		//請求明細
		//電話番号管理テーブル
		//合計金額
		//請求合計額を取得
		//請求合計額をデータ配列から除去
		//現在テーブルにも追加する場合
		//電話番号一覧を取得
		//ファイルデータを１電話番号ずつ処理
		//ファイルデータを１電話番号ずつ処理 END
		{
			if (undefined !== H_pactid[A_pactid[pactCounter]] == false) //次のpactidへスキップ
				//pactid が会社マスターに登録されている場合
				{
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " は pact_tb に登録されていません スキップします\n", 1);
					continue;
				} else //pactid 毎の請求データディレクトリ設定
				//請求データファイル名を取得
				//処理するファイル数
				//請求データファイルがなかった場合（スクリプト続行 次のpactidへスキップ）
				//ファイルエラーフラグ
				//全ファイルデータ配列
				//会社一括請求は今の所なしの為コメントアウト
				//// ダミー電話番号とダミー電話番号用部署ＩＤを取得する
				//				$H_dummyData = $O_BillModel->getDummy($A_pactid[$pactCounter],$this->getSetting()->CARID,"",$tableNo);
				//				// ダミー電話番号が設定されていない場合
				//				if(count($H_dummyData) == 0){
				//					$this->warningOut(1000, "契約ＩＤ：" . $A_pactid[$pactCounter] .
				//									" のダミー電話番号が設定されていません スキップします\n",1);
				//					// 次のpactidへスキップ
				//					continue;
				//				}
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
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイルがみつかりません スキップします\n", 1);
							continue;
						}

					A_billFile.sort();
// 2022cvt_015
					var fileErrFlg = false;
// 2022cvt_015
					var A_allFileData = Array();

// 2022cvt_015
					for (var fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
					//データファイルを取得
					//データファイルチェックでエラーがあった場合（項目数）
					{
// 2022cvt_015
						var A_fileData: Array<any> | false = Array();
						A_fileData = this.O_Model.chkBillData(dataDirPact + "/" + A_billFile[fileCounter]);

						// if (A_fileData == false) {
						if (A_fileData == false) {
							fileErrFlg = true;
						}

						if (false == fileErrFlg) //請求年月とpactidをデータファイルの２行から取得（１行目はヘッダー行）
							//請求年月をチェック
							{
// 2022cvt_015
                                // var A_lineData = split(this.getSetting().DELIMITER, rtrim(A_fileData[1]));
								var A_lineData = A_fileData[1].split(this.getSetting().get("DELIMITER"), A_fileData[1].replace());

								// if (trim(A_lineData[0], "\"") != this.BillDate) {
								if (A_lineData[0].split("\"").join("") != this.BillDate) {
									this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイル " + A_billFile[fileCounter] + " の請求年月が不正です\n", 1);
									fileErrFlg = true;
								}
							}

						if (false == fileErrFlg) //pactidをチェック
							{
// 2022cvt_015
								// var pactid = O_BillModel.getPactid(this.getSetting().CARID, trim(A_lineData[1], "\""));
								var pactid = O_BillModel.getPactid(this.getSetting().get("CARID"), A_lineData[1].split("\"").join(""));


								if (pactid != A_pactid[pactCounter]) {
									this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイル " + A_billFile[fileCounter] + " のpactidが不正です\n", 1);
									fileErrFlg = true;
								}
							}

						if (false == fileErrFlg) //複数ファイルデータをマージ
							{
								// A_allFileData = array_merge(A_allFileData, A_fileData);
								A_allFileData = A_allFileData.concat(A_fileData);
							}
					}

					if (true == fileErrFlg) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ："  + A_pactid[pactCounter] + " の請求データファイルが不正な為、スキップします\n", 1);
							continue;
						} else //必要なデータのみ保持する
						//array(電話番号 => array(明細行番号 => DBDATA)
						//20110413
						{
// 2022cvt_015
							var H_editAllFileData = this.O_Model.editBillData(A_allFileData);
							this.O_tam = new TelAmountModel(dataDirPact, this, {
								erase: this.Mode
							}, this.O_View.get_ScriptName());
							this.O_tam.setBasicData({
								year: this.BillDate!.substring(0, 4),
								month: this.BillDate!.substring(5, 2),
								pactid: A_pactid[pactCounter]
							});
							this.O_tam.setPrtelNo(A_lineData[1].trim());
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}

// 2022cvt_015
			var O_PostModel = new PostModel();
// 2022cvt_015
			var rootPostidX = O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo);
// 2022cvt_015
			var O_TelModel = new TelModel();
// 2022cvt_015
			var H_telnoX = O_TelModel.getCaridTelno(A_pactid[pactCounter], tableNo, [this.getSetting().get("CARID")]);
// 2022cvt_015
			var aspFlg = false;
// 2022cvt_015
			var O_FuncModel = new FuncModel();
// 2022cvt_015
			var H_pactFunc = O_FuncModel.getPactFunc(A_pactid[pactCounter], undefined, false);
			var asxCharge;
			var A_outPutTelDetails;
			var A_outPutTelX;
			var aspCharge;

			if (-1 !== Object.keys(H_pactFunc).indexOf("fnc_asp") == true) //ＡＳＰ料金を取得
				{
					aspFlg = true;
// 2022cvt_015
					aspCharge = O_BillModel.getAspCharge(A_pactid[pactCounter], this.getSetting().get("CARID"));

					if (!aspCharge) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のＡＳＰ利用料が設定されていない為、スキップします\n", 1);
							continue;
						}

// 2022cvt_015
					asxCharge = +(aspCharge * this.getSetting().get("excise_tax"));
				}

			A_outPutTelDetails[A_pactid[pactCounter]] = Array();
			A_outPutTelX[A_pactid[pactCounter]] = Array();
// 2022cvt_015
			var sumcharge = 0;
// 2022cvt_015
			var allcharge = 0;

			if (undefined !== H_editAllFileData["00000000000"] == true) //複数ファイル分の請求合計額を集計
				{
// 2022cvt_015
					for (var cnt = 0; cnt < H_editAllFileData["00000000000"].length; cnt++) {
						allcharge = allcharge + H_editAllFileData["00000000000"][cnt].charge;
					}
				}

			delete H_editAllFileData["00000000000"];
			var A_outPutTel;
			var H_telno;

			if ("N" == this.TargetTable) //現在テーブルより電話番号マスターを取得する array(CARID => array(telno))
				//会社別に変更 20120601
				//電話番号管理テーブル
				{
// 2022cvt_015
					H_telno = O_TelModel.getCaridTelno(A_pactid[pactCounter], undefined, [this.getSetting().get("CARID")]);
					A_outPutTel[A_pactid[pactCounter]] = Array();
				}

// 2022cvt_015
			var now = this.get_DB().getNow();
// 2022cvt_015
			var A_telno = Object.keys(H_editAllFileData);
			A_telno.sort();

// 2022cvt_015
			for (var telno of (A_telno)) //電話番号を文字列認識させる
			//tel_X_tb に登録する必要があるかどうか false：無、true：有
			//tel_tb に登録する必要があるかどうか false：無、true：有
			//tel_X_tb に電話番号がない場合
			//明細を１件ずつ処理する
			//明細を１件ずつ処理する END
			//表示用電話番号追加	2009/7/6 maeda
			//tel_X_tb へ登録する必要有りの場合
			{
// 2022cvt_015
				var telno = telno + "";
// 2022cvt_015
				var telAddFlgX = false;
// 2022cvt_015
				var telAddFlg = false;

				if (-1 !== H_telnoX[this.getSetting().get("CARID")].indexOf(telno) == false) //tel_X_tb へ登録する必要有り
					//現在テーブルにも追加する場合
					{
						telAddFlgX = true;

						if ("N" == this.TargetTable) //tel_tb に電話番号がない場合
							{
								if (-1 !== H_telno[this.getSetting().get("CARID")].indexOf(telno) == false) //tel_tb へ登録する必要有り
									{
										telAddFlg = true;
									}
							}
					}

					interface H_data_Interface {
						pactid?: string,
						postid?,
						telno?: string
						telno_view?: string,
						code?: string,
						name?: string,
						kamoku?: string,
						codetype?: string,
						taxtype?: string,
						carid?: string,
						arid?: string,
						cirid?: string,
						fixdate: string,
						recdate: string
					;}
					var H_data: H_data_Interface;
// 2022cvt_015
				var A_detailno = Object.keys(H_editAllFileData[telno]);
				A_detailno.sort();

// 2022cvt_015
				for (var detailno of (A_detailno)as any) //未(仮)登録処理が済んでたら次へ
				//20110413
				{
					if (undefined !== this.A_reserve[H_editAllFileData[telno][detailno].code]) {
						continue;
					}

					if (undefined !== H_utiwake[this.getSetting().get("CARID")][H_editAllFileData[telno][detailno].code] == false) {
// 2022cvt_015
						H_data = {
							code: H_editAllFileData[telno][detailno].code,
							name: H_editAllFileData[telno][detailno].codename,
							kamoku: "6",
// 2022cvt_016
							codetype: "4",
// 2022cvt_016
							taxtype: H_editAllFileData[telno][detailno].taxkubun,
							carid: this.getSetting().get("ARID"),
							fixdate: now,
							recdate: now
						};
						this.A_reserve[H_editAllFileData[telno][detailno].code] = true;
						this.A_reserve.errPactId.push(A_pactid[pactCounter]);
						this.O_Model.setOutPut("utiwake_tb", this.A_unregistCodes, H_data);
						this.errorOut(1000, "登録されていない内訳コード[" + H_editAllFileData[telno][detailno].code + "]が見つかりました。\n内訳コードを更新してから、再度処理を行ってください。\n", 0, "", "");
						continue;
// 2022cvt_016
					} else if ("4" == H_utiwake[this.getSetting().get("CARID")][H_editAllFileData[telno][detailno].code].codetype) {
						if (!(undefined !== this.A_interim[H_editAllFileData[telno][detailno].code])) {
							this.A_interim[H_editAllFileData[telno][detailno].code] = true;
							this.A_reserve.errPactId.push(A_pactid[pactCounter]);
							this.errorOut(1000, "仮登録の内訳コード[" + H_editAllFileData[telno][detailno].code + "]が見つかりました。\n内訳コードを更新してから、再度処理を行ってください。\n", 0, "", "");
						}

						continue;
					}

					if (H_editAllFileData[telno][detailno].codename != H_utiwake[this.getSetting().get("CARID")][H_editAllFileData[telno][detailno].code].name && -1 !== A_checkedCodeName.indexOf(H_editAllFileData[telno][detailno].code) == false) //差異があった場合は警告を出す
						//差異があった場合はリストに追加
						{
							this.warningOut(1000, "内訳種別 " + H_utiwake[this.getSetting().get("CARID")][H_editAllFileData[telno][detailno].code].name + "(" + H_editAllFileData[telno][detailno].code + ")の内訳種別名称がマスターと異なります\n", 1);
							A_checkedCodeName.push(H_editAllFileData[telno][detailno].code);
						}

// 2022cvt_016
					if (H_editAllFileData[telno][detailno].taxkubun != H_utiwake[this.getSetting().get("CARID")][H_editAllFileData[telno][detailno].code].taxtype && -1 !== A_checkedTaxKubun.indexOf(H_editAllFileData[telno][detailno].code) == false) //差異があった場合は警告を出す
						//差異があった場合はリストに追加
						{
							this.warningOut(1000, "内訳種別 " + H_utiwake[this.getSetting().get("CARID")][H_editAllFileData[telno][detailno].code].name + "(" + H_editAllFileData[telno][detailno].code + ")の税区分がマスターと異なります\n", 1);
							A_checkedTaxKubun.push(H_editAllFileData[telno][detailno].code);
						}

// 2022cvt_015
					var prtelno: any;

					if (!(-1 !== this.notPrtelnos.indexOf(H_editAllFileData[telno][detailno].code))) //20110413
						{
							prtelno = H_editAllFileData[telno][detailno].prtelno;
						}

// 2022cvt_016
					if (this.getSetting().get("SAIKEI_NORMAL") == H_utiwake[this.getSetting().get("CARID")][H_editAllFileData[telno][detailno].code].codetype) {
						sumcharge = sumcharge + H_editAllFileData[telno][detailno].charge;

						if (!(undefined !== this.amountCharge[prtelno])) {
							this.amountCharge[prtelno] = 0;
						}

						this.amountCharge[prtelno] = this.amountCharge[prtelno] + H_editAllFileData[telno][detailno].charge;
					}

					A_outPutTelDetails[A_pactid[pactCounter]].push({
						pactid: A_pactid[pactCounter],
						telno: telno,
						code: H_editAllFileData[telno][detailno].code,
						codename: H_utiwake[this.getSetting().get("CARID")][H_editAllFileData[telno][detailno].code].name,
						charge: H_editAllFileData[telno][detailno].charge,
// 2022cvt_016
						taxkubun: this.getSetting().getArray("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][H_editAllFileData[telno][detailno].code].taxtype],
						detailno: detailno,
						recdate: now,
						carid: this.getSetting().get("CARID"),
						tdcomment: H_editAllFileData[telno][detailno].bikou,
						prtelno: prtelno,
						realcnt: undefined
					});
					outTeldetailsCnt++;
				}

// 2022cvt_015
				var telno_view = telno.substring(0, 3) + "-" + telno.substring(3, 4) + "-" + telno.substring(7, 4);

				if (true == telAddFlgX) //tel_X_tb 出力用配列へ格納
					//フラグを戻す
					{
						H_data = {
							pactid: A_pactid[pactCounter],
							postid: rootPostidX,
							telno: telno,
							telno_view: telno_view,
							carid: this.getSetting().get("CARID"),
							arid: this.getSetting().get("ARID"),
							cirid: this.getSetting().get("CARID"),
							recdate: now,
							fixdate: now
						};
						this.O_Model.setOutPut("tel_" + tableNo + "_tb", A_outPutTelX[A_pactid[pactCounter]], H_data);
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
							telno_view: telno_view,
							carid: this.getSetting().get("CARID"),
							arid: this.getSetting().get("ARID"),
							cirid: this.getSetting().get("CARID"),
							recdate: now,
							fixdate: now
						};
						this.O_Model.setOutPut("tel_tb", A_outPutTel[A_pactid[pactCounter]], H_data);
						outTelCnt++;
						telAddFlg = false;
					}

				if (true == aspFlg) //合計用に２つ進める
					//ASP利用料を出力
					{
						detailno++;
						detailno++;
						A_outPutTelDetails[A_pactid[pactCounter]].push({
							pactid: A_pactid[pactCounter],
							telno: telno,
							code: this.getSetting().get("UTIWAKE_ASP_CODE"),
							codename: H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_ASP_CODE")].name,
							charge: aspCharge,
// 2022cvt_016
							taxkubun: this.getSetting().getArray("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][this.getSetting().UTIWAKE_ASP_CODE].taxtype],
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
								A_outPutTelDetails[A_pactid[pactCounter]].push({
									pactid: A_pactid[pactCounter],
									telno: telno,
									code: this.getSetting().get("UTIWAKE_ASX_CODE"),
									codename: H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_ASX_CODE")].name,
									charge: asxCharge,
// 2022cvt_016
									taxkubun: this.getSetting().getArray("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_ASX_CODE")].taxtype],
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

			var amountData;
			if (!(-1 !== this.A_reserve.errPactId.indexOf(A_pactid[pactCounter]))) //請求書の合計金額がない場合（請求台数が１台の場合）合計金額チェックは行わないよう修正 2009/09/04 maeda
				{
// 2022cvt_015
					amountData = Array();

					if (0 == allcharge) //20110413
						//請求書の合計金額がある場合
						{
							this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") の請求データに合計金額明細が無かった為、合計金額チェックは行われませんでした\n", 1);
							{
								let _tmp_0 = this.amountCharge;

// 2022cvt_015
								for (var amprtel in _tmp_0) {
// 2022cvt_015
									var amcharge = _tmp_0[amprtel];
									amountData.push([this.O_tam.makeAmountData({
										pactid: A_pactid[pactCounter],
										carid: this.getSetting().get("CARID"),
										prtelno: amprtel,
										charge: amcharge,
										note: A_pactid[pactCounter] + "の請求データに合計金明細が無い為、PGの計算による参照値です",
										recdate: now,
										confirmation: undefined
									}, "array")]);
								}
							}
						} else //合計金額チェック
						{
							if (sumcharge != allcharge) //次のpactidへスキップ
								{
									this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の合計金額が一致しない為、スキップします\n", 1);
									continue;
								} else {
								{
									let _tmp_1 = this.amountCharge;

// 2022cvt_015
									for (var amprtel in _tmp_1) {
// 2022cvt_015
										var amcharge = _tmp_1[amprtel];
										amountData.push([this.O_tam.makeAmountData({
											pactid: A_pactid[pactCounter],
											carid: this.getSetting().get("CARID"),
											prtelno: amprtel,
											charge: amcharge,
											recdate: now,
											confirmation: undefined
										}, "array")]);
									}
								}
							}
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") インポートファイル出力完了(tel_tb:" + outTelCnt + "件," + telX_tb + ":" + outTelXCnt + "件," + teldetails_tb + ":" + outTeldetailsCnt + "件)\n", 1);
				}

			A_pactDone.push(A_pactid[pactCounter]);
			outTelCnt = outTelXCnt = outTeldetailsCnt = 0;
		}

// 2022cvt_015
		var pactDoneCnt = A_pactDone.length;

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
			//終了
			{
				this.warningOut(1000, "インポート可能な請求情報データがありませんでした\n", 1);
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw process.exit(0);// 2022cvt_009
			}

		if ("Y" == this.BackUpFlg) {
// 2022cvt_015
            // var expFile = dataDir + teldetails_tb + date("YmdHis") + ".exp";
			var expFile = dataDir + teldetails_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";

			if (false == this.expData(teldetails_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
				throw process.exit(-1);// 2022cvt_009
			}
		}

// 2022cvt_015
		for (var pid of (A_pactDone)) {
			if (!(-1 !== this.A_reserve.errPactId.indexOf(pid))) //トランザクション開始
				//モードがオーバーライトの時はデータをインポートする前にデリート
				{
					this.get_DB().beginTransaction();

					if ("O" == this.Mode) {
						O_BillModel.delTelDetailsData([pid], tableNo, [this.getSetting().get("CARID")]);
					}

					if (0 != A_outPutTelDetails[pid].length) //tel_details_X_tb取込失敗
						{
// 2022cvt_015
							var rtn = this.get_DB().pgCopyFromArray(teldetails_tb, A_outPutTelDetails[pid]);

							if (await rtn == false) {
								this.get_DB().rollback();
								this.errorOut(1000, "\n" + teldetails_tb + " へのデータ取込に失敗しました\n", 0, "", "");
								throw process.exit(-1);// 2022cvt_009
							} else {
								this.infoOut(teldetails_tb + " へデーターインポート完了\n", 1);
							}
						}

					if (0 != A_outPutTelX[pid].length) //tel_X_tbへデータ取込
						//tel_X_tb取込失敗
						{
							rtn = this.get_DB().pgCopyFromArray(telX_tb, A_outPutTelX[pid]);

							if (await rtn == false) {
								this.get_DB().rollback();
								this.errorOut(1000, "\n" + telX_tb + " へのデータ取込に失敗しました\n", 0, "", "");
								throw process.exit(-1);// 2022cvt_009
							} else {
								this.infoOut(telX_tb + " へデーターインポート完了\n", 1);
							}
						}

					if (undefined !== A_outPutTel[pid] == true && 0 != A_outPutTel[pid].length) //tel_tbへデータ取込
						//tel_tb取込失敗
						{
							rtn = this.get_DB().pgCopyFromArray("tel_tb", A_outPutTel[pid]);

							if (await rtn == false) {
								this.get_DB().rollback();
								this.errorOut(1000, "\ntel_tb へのデータ取込に失敗しました\n", 0, "", "");
								throw process.exit(-1);// 2022cvt_009
							} else {
								this.infoOut("tel_tb へデーターインポート完了\n", 1);
							}
						}

					if (undefined !== amountData && 0 != amountData.length) {
// 2022cvt_015
						for (var amData of (amountData)) {
							rtn = this.get_DB().pgCopyFromArray(this.O_tam.getTableName(), amData);

							if (!rtn) {
								this.get_DB().rollback();
								this.errorOut(1000, "\n" + this.O_tam.getTableName() + "へのデータ挿入失敗\n", 0, "", "");
								throw process.exit(-1);// 2022cvt_009
							} else {
								this.infoOut(this.O_tam.getTableName() + "へデータ挿入\n", 1);
							}
						}
					}

					this.get_DB().commit();
				} else {
				if (0 < this.A_unregistCodes.length) {
					this.get_DB().beginTransaction();
					rtn = this.get_DB().pgCopyFromArray("utiwake_tb", this.A_unregistCodes);

					if (!rtn) {
						this.get_DB().rollback();
						this.errorOut(1000, "内訳コードの仮登録に失敗しました\n", 0, "", "");
					} else {
						this.infoOut("utiwake_tbへのインポート完了\n", 1);
					}

					this.get_DB().commit();
				}

				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				this.getOut().flushMessage();
				this.infoOut("utiwake_tb\を確認してください\n", 1);
				throw process.exit(-1);// 2022cvt_009
			}
		}

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
		this.infoOut("ＥＭＯＢＩＬＥ請求データインポート終了\n", 1);
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
