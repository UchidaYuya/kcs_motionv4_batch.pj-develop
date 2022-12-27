//
//ＥＭＯＢＩＬＥ請求データ取込処理 （Process）
//
//更新履歴：<br>
//2009/02/04 前田 聡 作成
//2009/09/04 maed 請求書の合計金額がない場合（請求台数が１台の場合）合計金額チェックは行わないよう修正
//
//ImportEmobileProc
//
//@package script
//@subpackage Process
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/02/04
//@uses MtTableUtil
//@uses PactModel
//@uses BillModel
//@uses PostModel
//@uses TelModel
//@uses FuncModel
//@uses ProcessBaseBatch
//@uses ImportEmobileView
//@uses ImportEmobileModel
//
//
//更新履歴
//
//表示用電話番号追加	2009/7/6 maeda
//
//error_reporting(E_ALL|E_STRICT);
//20110413

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/TelModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/ImportEmobileView.php");

require("model/script/ImportEmobileModel.php");

require("model/script/TelAmountModel.php");

//
//コンストラクタ
//
//@author maeda
//@since 2009/02/04
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2009/02/04
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2009/02/04
//
//@access public
//@return void
//
class ImportEmobileProc extends ProcessBaseBatch {
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

	doExecute(H_param: {} | any[] = Array()) //処理開始
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
		this.infoOut("\uFF25\uFF2D\uFF2F\uFF22\uFF29\uFF2C\uFF25\u8ACB\u6C42\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + this.getSetting().EMOBILE_DIR + "/";

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, this.getSetting().EMOBILE + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
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
		var H_utiwake = O_BillModel.getUtiwake([this.getSetting().CARID]);
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var telX_tb = "tel_" + tableNo + "_tb";
		var teldetails_tb = "tel_details_" + tableNo + "_tb";
		var outTelCnt = outTelXCnt = outTeldetailsCnt = 0;
		var A_checkedCodeName = Array();
		var A_checkedTaxKubun = Array();

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
					this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
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
					//データファイルを取得
					//データファイルチェックでエラーがあった場合（項目数）
					{
						var A_fileData = Array();
						A_fileData = this.O_Model.chkBillData(dataDirPact + "/" + A_billFile[fileCounter]);

						if (A_fileData == false) {
							fileErrFlg = true;
						}

						if (false == fileErrFlg) //請求年月とpactidをデータファイルの２行から取得（１行目はヘッダー行）
							//請求年月をチェック
							{
								var A_lineData = split(this.getSetting().DELIMITER, rtrim(A_fileData[1]));

								if (trim(A_lineData[0], "\"") != this.BillDate) {
									this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306E\u8ACB\u6C42\u5E74\u6708\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
									fileErrFlg = true;
								}
							}

						if (false == fileErrFlg) //pactidをチェック
							{
								var pactid = O_BillModel.getPactid(this.getSetting().CARID, trim(A_lineData[1], "\""));

								if (pactid != A_pactid[pactCounter]) {
									this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB " + A_billFile[fileCounter] + " \u306Epactid\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
									fileErrFlg = true;
								}
							}

						if (false == fileErrFlg) //複数ファイルデータをマージ
							{
								A_allFileData = array_merge(A_allFileData, A_fileData);
							}
					}

					if (true == fileErrFlg) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u4E0D\u6B63\u306A\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						} else //必要なデータのみ保持する
						//array(電話番号 => array(明細行番号 => DBDATA)
						//20110413
						{
							var H_editAllFileData = this.O_Model.editBillData(A_allFileData);
							this.O_tam = new TelAmountModel(dataDirPact, this, {
								erase: this.Mode
							}, this.O_View.get_ScriptName());
							this.O_tam.setBasicData({
								year: this.BillDate.substr(0, 4),
								month: this.BillDate.substr(5, 2),
								pactid: A_pactid[pactCounter]
							});
							this.O_tam.setPrtelNo(A_lineData[1].trim());
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}

			var O_PostModel = new PostModel();
			var rootPostidX = O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo);
			var O_TelModel = new TelModel();
			var H_telnoX = O_TelModel.getCaridTelno(A_pactid[pactCounter], tableNo, [this.getSetting().CARID]);
			var aspFlg = false;
			var O_FuncModel = new FuncModel();
			var H_pactFunc = O_FuncModel.getPactFunc(A_pactid[pactCounter], undefined, false);

			if (-1 !== Object.keys(H_pactFunc).indexOf("fnc_asp") == true) //ＡＳＰ料金を取得
				{
					aspFlg = true;
					var aspCharge = O_BillModel.getAspCharge(A_pactid[pactCounter], this.getSetting().CARID);

					if ("" == aspCharge) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						}

					var asxCharge = +(aspCharge * this.getSetting().excise_tax);
				}

			A_outPutTelDetails[A_pactid[pactCounter]] = Array();
			A_outPutTelX[A_pactid[pactCounter]] = Array();
			var sumcharge = 0;
			var allcharge = 0;

			if (undefined !== H_editAllFileData["00000000000"] == true) //複数ファイル分の請求合計額を集計
				{
					for (var cnt = 0; cnt < H_editAllFileData["00000000000"].length; cnt++) {
						allcharge = allcharge + H_editAllFileData["00000000000"][cnt].charge;
					}
				}

			delete H_editAllFileData["00000000000"];

			if ("N" == this.TargetTable) //現在テーブルより電話番号マスターを取得する array(CARID => array(telno))
				//会社別に変更 20120601
				//電話番号管理テーブル
				{
					var H_telno = O_TelModel.getCaridTelno(A_pactid[pactCounter], undefined, [this.getSetting().CARID]);
					A_outPutTel[A_pactid[pactCounter]] = Array();
				}

			var now = this.get_DB().getNow();
			var A_telno = Object.keys(H_editAllFileData);
			A_telno.sort();

			for (var telno of Object.values(A_telno)) //電話番号を文字列認識させる
			//tel_X_tb に登録する必要があるかどうか false：無、true：有
			//tel_tb に登録する必要があるかどうか false：無、true：有
			//tel_X_tb に電話番号がない場合
			//明細を１件ずつ処理する
			//明細を１件ずつ処理する END
			//表示用電話番号追加	2009/7/6 maeda
			//tel_X_tb へ登録する必要有りの場合
			{
				var telno = telno + "";
				var telAddFlgX = false;
				var telAddFlg = false;

				if (-1 !== H_telnoX[this.getSetting().CARID].indexOf(telno) == false) //tel_X_tb へ登録する必要有り
					//現在テーブルにも追加する場合
					{
						telAddFlgX = true;

						if ("N" == this.TargetTable) //tel_tb に電話番号がない場合
							{
								if (-1 !== H_telno[this.getSetting().CARID].indexOf(telno) == false) //tel_tb へ登録する必要有り
									{
										telAddFlg = true;
									}
							}
					}

				var A_detailno = Object.keys(H_editAllFileData[telno]);
				A_detailno.sort();

				for (var detailno of Object.values(A_detailno)) //未(仮)登録処理が済んでたら次へ
				//20110413
				{
					if (undefined !== this.A_reserve[H_editAllFileData[telno][detailno].code]) {
						continue;
					}

					if (undefined !== H_utiwake[this.getSetting().CARID][H_editAllFileData[telno][detailno].code] == false) {
						var H_data = {
							code: H_editAllFileData[telno][detailno].code,
							name: H_editAllFileData[telno][detailno].codename,
							kamoku: "6",
							codetype: "4",
							taxtype: H_editAllFileData[telno][detailno].taxkubun,
							carid: this.getSetting().CARID,
							fixdate: now,
							recdate: now
						};
						this.A_reserve[H_editAllFileData[telno][detailno].code] = true;
						this.A_reserve.errPactId.push(A_pactid[pactCounter]);
						this.O_Model.setOutPut("utiwake_tb", this.A_unregistCodes, H_data);
						this.errorOut(1000, "\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u5185\u8A33\u30B3\u30FC\u30C9[" + H_editAllFileData[telno][detailno].code + "]\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F\u3002\n\u5185\u8A33\u30B3\u30FC\u30C9\u3092\u66F4\u65B0\u3057\u3066\u304B\u3089\u3001\u518D\u5EA6\u51E6\u7406\u3092\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002\n", 0, "", "");
						continue;
					} else if ("4" == H_utiwake[this.getSetting().CARID][H_editAllFileData[telno][detailno].code].codetype) {
						if (!(undefined !== this.A_interim[H_editAllFileData[telno][detailno].code])) {
							this.A_interim[H_editAllFileData[telno][detailno].code] = true;
							this.A_reserve.errPactId.push(A_pactid[pactCounter]);
							this.errorOut(1000, "\u4EEE\u767B\u9332\u306E\u5185\u8A33\u30B3\u30FC\u30C9[" + H_editAllFileData[telno][detailno].code + "]\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F\u3002\n\u5185\u8A33\u30B3\u30FC\u30C9\u3092\u66F4\u65B0\u3057\u3066\u304B\u3089\u3001\u518D\u5EA6\u51E6\u7406\u3092\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002\n", 0, "", "");
						}

						continue;
					}

					if (H_editAllFileData[telno][detailno].codename != H_utiwake[this.getSetting().CARID][H_editAllFileData[telno][detailno].code].name && -1 !== A_checkedCodeName.indexOf(H_editAllFileData[telno][detailno].code) == false) //差異があった場合は警告を出す
						//差異があった場合はリストに追加
						{
							this.warningOut(1000, "\u5185\u8A33\u7A2E\u5225 " + H_utiwake[this.getSetting().CARID][H_editAllFileData[telno][detailno].code].name + "(" + H_editAllFileData[telno][detailno].code + ")\u306E\u5185\u8A33\u7A2E\u5225\u540D\u79F0\u304C\u30DE\u30B9\u30BF\u30FC\u3068\u7570\u306A\u308A\u307E\u3059\n", 1);
							A_checkedCodeName.push(H_editAllFileData[telno][detailno].code);
						}

					if (H_editAllFileData[telno][detailno].taxkubun != H_utiwake[this.getSetting().CARID][H_editAllFileData[telno][detailno].code].taxtype && -1 !== A_checkedTaxKubun.indexOf(H_editAllFileData[telno][detailno].code) == false) //差異があった場合は警告を出す
						//差異があった場合はリストに追加
						{
							this.warningOut(1000, "\u5185\u8A33\u7A2E\u5225 " + H_utiwake[this.getSetting().CARID][H_editAllFileData[telno][detailno].code].name + "(" + H_editAllFileData[telno][detailno].code + ")\u306E\u7A0E\u533A\u5206\u304C\u30DE\u30B9\u30BF\u30FC\u3068\u7570\u306A\u308A\u307E\u3059\n", 1);
							A_checkedTaxKubun.push(H_editAllFileData[telno][detailno].code);
						}

					var prtelno = undefined;

					if (!(-1 !== this.notPrtelnos.indexOf(H_editAllFileData[telno][detailno].code))) //20110413
						{
							prtelno = H_editAllFileData[telno][detailno].prtelno;
						}

					if (this.getSetting().SAIKEI_NORMAL == H_utiwake[this.getSetting().CARID][H_editAllFileData[telno][detailno].code].codetype) {
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
						codename: H_utiwake[this.getSetting().CARID][H_editAllFileData[telno][detailno].code].name,
						charge: H_editAllFileData[telno][detailno].charge,
						taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID][H_editAllFileData[telno][detailno].code].taxtype],
						detailno: detailno,
						recdate: now,
						carid: this.getSetting().CARID,
						tdcomment: H_editAllFileData[telno][detailno].bikou,
						prtelno: prtelno,
						realcnt: undefined
					});
					outTeldetailsCnt++;
				}

				var telno_view = telno.substr(0, 3) + "-" + telno.substr(3, 4) + "-" + telno.substr(7, 4);

				if (true == telAddFlgX) //tel_X_tb 出力用配列へ格納
					//フラグを戻す
					{
						H_data = {
							pactid: A_pactid[pactCounter],
							postid: rootPostidX,
							telno: telno,
							telno_view: telno_view,
							carid: this.getSetting().CARID,
							arid: this.getSetting().ARID,
							cirid: this.getSetting().CIRID,
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
							carid: this.getSetting().CARID,
							arid: this.getSetting().ARID,
							cirid: this.getSetting().CIRID,
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
							code: this.getSetting().UTIWAKE_ASP_CODE,
							codename: H_utiwake[this.getSetting().CARID][this.getSetting().UTIWAKE_ASP_CODE].name,
							charge: aspCharge,
							taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID][this.getSetting().UTIWAKE_ASP_CODE].taxtype],
							detailno: detailno,
							recdate: now,
							carid: this.getSetting().CARID,
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
									code: this.getSetting().UTIWAKE_ASX_CODE,
									codename: H_utiwake[this.getSetting().CARID][this.getSetting().UTIWAKE_ASX_CODE].name,
									charge: asxCharge,
									taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID][this.getSetting().UTIWAKE_ASX_CODE].taxtype],
									detailno: detailno,
									recdate: now,
									carid: this.getSetting().CARID,
									tdcomment: undefined,
									prtelno: undefined,
									realcnt: undefined
								});
								outTeldetailsCnt++;
							}
					}
			}

			if (!(-1 !== this.A_reserve.errPactId.indexOf(A_pactid[pactCounter]))) //請求書の合計金額がない場合（請求台数が１台の場合）合計金額チェックは行わないよう修正 2009/09/04 maeda
				{
					var amountData = Array();

					if (0 == allcharge) //20110413
						//請求書の合計金額がある場合
						{
							this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u306B\u5408\u8A08\u91D1\u984D\u660E\u7D30\u304C\u7121\u304B\u3063\u305F\u70BA\u3001\u5408\u8A08\u91D1\u984D\u30C1\u30A7\u30C3\u30AF\u306F\u884C\u308F\u308C\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
							{
								let _tmp_0 = this.amountCharge;

								for (var amprtel in _tmp_0) {
									var amcharge = _tmp_0[amprtel];
									amountData.push([this.O_tam.makeAmountData({
										pactid: A_pactid[pactCounter],
										carid: this.getSetting().CARID,
										prtelno: amprtel,
										charge: amcharge,
										note: A_pactid[pactCounter] + "\u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u306B\u5408\u8A08\u91D1\u660E\u7D30\u304C\u7121\u3044\u70BA\u3001PG\u306E\u8A08\u7B97\u306B\u3088\u308B\u53C2\u7167\u5024\u3067\u3059",
										recdate: now,
										confirmation: undefined
									}, "array")]);
								}
							}
						} else //合計金額チェック
						{
							if (sumcharge != allcharge) //次のpactidへスキップ
								{
									this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u5408\u8A08\u91D1\u984D\u304C\u4E00\u81F4\u3057\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
									continue;
								} else {
								{
									let _tmp_1 = this.amountCharge;

									for (var amprtel in _tmp_1) {
										var amcharge = _tmp_1[amprtel];
										amountData.push([this.O_tam.makeAmountData({
											pactid: A_pactid[pactCounter],
											carid: this.getSetting().CARID,
											prtelno: amprtel,
											charge: amcharge,
											recdate: now,
											confirmation: undefined
										}, "array")]);
									}
								}
							}
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(tel_tb:" + outTelCnt + "\u4EF6," + telX_tb + ":" + outTelXCnt + "\u4EF6," + teldetails_tb + ":" + outTeldetailsCnt + "\u4EF6)\n", 1);
				}

			A_pactDone.push(A_pactid[pactCounter]);
			outTelCnt = outTelXCnt = outTeldetailsCnt = 0;
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
			var expFile = dataDir + teldetails_tb + date("YmdHis") + ".exp";

			if (false == this.expData(teldetails_tb, expFile, this.getSetting().NUM_FETCH)) {
				throw die(-1);
			}
		}

		for (var pid of Object.values(A_pactDone)) {
			if (!(-1 !== this.A_reserve.errPactId.indexOf(pid))) //トランザクション開始
				//モードがオーバーライトの時はデータをインポートする前にデリート
				{
					this.get_DB().beginTransaction();

					if ("O" == this.Mode) {
						O_BillModel.delTelDetailsData([pid], tableNo, [this.getSetting().CARID]);
					}

					if (0 != A_outPutTelDetails[pid].length) //tel_details_X_tb取込失敗
						{
							var rtn = this.get_DB().pgCopyFromArray(teldetails_tb, A_outPutTelDetails[pid]);

							if (rtn == false) {
								this.get_DB().rollback();
								this.errorOut(1000, "\n" + teldetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
								throw die(-1);
							} else {
								this.infoOut(teldetails_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
							}
						}

					if (0 != A_outPutTelX[pid].length) //tel_X_tbへデータ取込
						//tel_X_tb取込失敗
						{
							rtn = this.get_DB().pgCopyFromArray(telX_tb, A_outPutTelX[pid]);

							if (rtn == false) {
								this.get_DB().rollback();
								this.errorOut(1000, "\n" + telX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
								throw die(-1);
							} else {
								this.infoOut(telX_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
							}
						}

					if (undefined !== A_outPutTel[pid] == true && 0 != A_outPutTel[pid].length) //tel_tbへデータ取込
						//tel_tb取込失敗
						{
							rtn = this.get_DB().pgCopyFromArray("tel_tb", A_outPutTel[pid]);

							if (rtn == false) {
								this.get_DB().rollback();
								this.errorOut(1000, "\ntel_tb \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
								throw die(-1);
							} else {
								this.infoOut("tel_tb \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
							}
						}

					if (undefined !== amountData && 0 != amountData.length) {
						for (var amData of Object.values(amountData)) {
							rtn = this.get_DB().pgCopyFromArray(this.O_tam.getTableName(), amData);

							if (!rtn) {
								this.get_DB().rollback();
								this.errorOut(1000, "\n" + this.O_tam.getTableName() + "\u3078\u306E\u30C7\u30FC\u30BF\u633F\u5165\u5931\u6557\n", 0, "", "");
								throw die(-1);
							} else {
								this.infoOut(this.O_tam.getTableName() + "\u3078\u30C7\u30FC\u30BF\u633F\u5165\n", 1);
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
						this.errorOut(1000, "\u5185\u8A33\u30B3\u30FC\u30C9\u306E\u4EEE\u767B\u9332\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					} else {
						this.infoOut("utiwake_tb\u3078\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
					}

					this.get_DB().commit();
				}

				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				this.getOut().flushMessage();
				this.infoOut("utiwake_tb\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\n", 1);
				throw die(-1);
			}
		}

		for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動元ディレクトリ
		//移動先ディレクトリ
		{
			var fromDir = dataDir + A_pactDone[pactDoneCounter];
			var finDir = fromDir + "/fin";
			this.mvFile(fromDir, finDir);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("\uFF25\uFF2D\uFF2F\uFF22\uFF29\uFF2C\uFF25\u8ACB\u6C42\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 1);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};