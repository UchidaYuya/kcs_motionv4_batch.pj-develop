//
//福山通運請求データ取込処理 （Process）
//
//更新履歴：<br>
//2010/02/03 宮澤龍彦 作成
//
//SuoImportFukuyamaProc
//
//@package SUO
//@subpackage Process
//@author miyazawa<miyazawa@motion.co.jp>
//@filesource
//@since 2010/02/03
//@uses MtTableUtil
//@uses PactModel
//@uses BillModel
//@uses PostModel
//@uses FuncModel
//@uses ProcessBaseBatch
//@uses SuoImportFukuyamaView
//@uses SuoImportFukuyamaModel
//
//
//error_reporting(E_ALL|E_STRICT);
//require_once("model/TransitModel.php");	// ●未実装

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/SuoImportFukuyamaView.php");

require("model/script/SuoImportFukuyamaModel.php");

//運送管理テーブルはまだない
//
//コンストラクタ
//
//@author miyazawa
//@since 2010/02/03
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author miyazawa
//@since 2010/02/03
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2010/02/03
//
//@access public
//@return void
//
class SuoImportFukuyamaProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("fukuyama");
		this.O_View = new SuoImportFukuyamaView();
		this.O_Model = new SuoImportFukuyamaModel(this.get_MtScriptAmbient());
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
	//請求明細集計用配列
	//pactid 毎に処理する
	//END FOR pactid 毎に処理する
	//集計した請求明細をtransit_details_X_tb 出力用配列へ格納
	//[pactid][tranid][trancoid][code][charge]
	//[pactid][tranid][trancoid][code][weight]
	//[pactid][tranid][trancoid][code][sendcount]
	//[pactid][tranid][trancoid][code][taxkubun]
	//[pactid][tranid][trancoid][code][detailno]
	//[pactid][tranid][trancoid][code][recdate]
	//処理する件数が０件なら直ちに終了する
	//契約ＩＤ分処理する
	//モードがオーバーライトの時はデータをインポートする前にデリート
	//処理が完了したファイルを移動
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.infoOut("\u798F\u5C71\u901A\u904B\u8ACB\u6C42\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + this.getSetting().TRANSIT_FUKUYAMA_DIR + "/";

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, this.getSetting().TRANSIT_FUKUYAMA + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
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
		var A_trancoid = [this.getSetting().CARID];
		var H_utiwake = O_BillModel.getTransitUtiwake(A_trancoid);
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var transitX_tb = "transit_" + tableNo + "_tb";
		var tranusehistory_tb = "transit_usehistory_" + tableNo + "_tb";
		var trandetails_tb = "transit_details_" + tableNo + "_tb";
		var outTranCnt = outTranXCnt = outTranusehistoryCnt = 0;
		var H_TransitDetails = Array();

		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		//PostModelインスタンスを作成
		//請求月用のルート部署を取得
		//TransitModelインスタンスを作成
		//$O_TransitModel = new TransitModel();
		//請求月テーブルより削除されていない運送ＩＤマスターを取得する array(tranid)
		//$A_tranidX = $O_TransitModel->getTranid($A_pactid[$pactCounter],$this->getSetting()->CARID,"false",$tableNo);
		//請求月テーブルより削除されている運送ＩＤマスターを取得する array(tranid)
		//$A_tranidXDel = $O_TransitModel->getTranid($A_pactid[$pactCounter],$this->getSetting()->CARID,"true",$tableNo);
		//ASP料金が true:発生する、false:発生しない
		//FuncModelインスタンスを作成
		//会社権限リストを取得
		//ASP料金が発生する場合
		//運送明細
		//請求明細
		//運送ＩＤ管理テーブル
		//削除フラグをfalseにする必要のある運送ＩＤリスト
		//現在テーブルにも追加する場合
		//運送ＩＤ一覧を取得
		//ファイルデータを１運送ＩＤずつ処理
		//ファイルデータを１運送ＩＤずつ処理 END
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
					//●正しいファイル名に対応する必要アリ ここから●
					//					// ファイル名から請求年月とpactidを取得するための準備
					//					$A_fileNameEle = split("-", str_replace(".txt", "", strtolower($A_billFile[$fileCounter])));
					//					// ファイル名から請求年月をチェック
					//					if($A_fileNameEle[0] != $this->BillDate){
					//						$this->warningOut(1000, "契約ＩＤ：" . $A_pactid[$pactCounter] .
					//										" の請求データファイル " . $A_billFile[$fileCounter] . " の請求年月が不正です\n",1);
					//						$fileErrFlg = true;
					//					}
					//					// ファイル名からpactidをチェック
					//					if($A_fileNameEle[1] != $A_pactid[$pactCounter]){
					//						$this->warningOut(1000, "契約ＩＤ：" . $A_pactid[$pactCounter] .
					//										" の請求データファイル " . $A_billFile[$fileCounter] . " のpactidが不正です\n",1);
					//						$fileErrFlg = true;
					//					}
					//●正しいファイル名に対応する必要アリ ここまで●
					//データファイルを取得
					//データファイルチェックでエラーがあった場合（項目数）
					{
						var A_fileData = Array();
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
						//array(得意先コード => array(発送年月 => array(原票番号 => array(行番号 => DBDATA)))
						{
							var H_editAllFileData = this.O_Model.editBillData(A_allFileData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}

			var O_PostModel = new PostModel();
			var rootPostidX = O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo);
			var A_tranidX = Array();
			var A_tranidXDel = Array();
			var aspFlg = false;
			var O_FuncModel = new FuncModel();
			var H_pactFunc = O_FuncModel.getPactFunc(A_pactid[pactCounter], undefined, false);

			if (-1 !== Object.keys(H_pactFunc).indexOf("fnc_asp") == true) //ＡＳＰ料金を取得
				{
					aspFlg = true;
					var aspCharge = O_BillModel.getTransitAspCharge(A_pactid[pactCounter], this.getSetting().CARID);

					if ("" == aspCharge) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						}

					var asxCharge = +(aspCharge * this.getSetting().excise_tax);
				}

			var A_outPutTransitUseHistory = Array();
			var A_outPutTransitDetails = Array();
			var A_outPutTransitX = Array();
			var A_undoTranidX = Array();

			if ("N" == this.TargetTable) //現在テーブルより削除されていない運送ＩＤマスターを取得する array(transitid)
				//$A_tranid = $O_TransitModel->getTranid($A_pactid[$pactCounter],$this->getSetting()->CARID,"false");
				//現在テーブルより削除されている運送ＩＤマスターを取得する array(tranid)
				//$A_tranidDel = $O_TransitModel->getTranid($A_pactid[$pactCounter],$this->getSetting()->CARID,"true");
				//運送ＩＤ管理テーブル
				//削除フラグをfalseにする必要のある運送ＩＤリスト
				{
					var A_tranid = Array();
					var A_tranidDel = Array();
					var A_outPutTransit = Array();
					var A_undoTranid = Array();
				}

			var allFileDataCnt = A_allFileData.length;
			var now = this.get_DB().getNow();
			var A_transit_id = Object.keys(H_editAllFileData);
			A_transit_id.sort();

			for (var transit_id of Object.values(A_transit_id)) //運送ＩＤが空のデータ（＝一括請求区分が一括ではない）は取り込みを行わない
			//detailno は運送ＩＤ毎に初期化
			//transit_X_tb に登録する必要があるかどうか false：無、true：有
			//transit_X_tb に運送ＩＤがない場合
			//発送日一覧を１件ずつ処理
			//売上日一覧を１件ずつ処理 END
			{
				if ("" == transit_id) {
					continue;
				}

				var transit_id = transit_id + "";
				var detailno = 0;
				var transitAddFlgX = false;

				if (-1 !== A_tranidX.indexOf(this.getSetting().LOGINID_HEADER + transit_id) == false) //削除済みの運送ＩＤとして登録が有る場合
					//運送ＩＤマスターに追加
					{
						if (-1 !== A_tranidXDel.indexOf(this.getSetting().LOGINID_HEADER + transit_id) == true) //削除を取り消す運送ＩＤリストに追加
							{
								A_undoTranidX.push(this.getSetting().LOGINID_HEADER + transit_id);
							} else //transit_X_tb へ登録する必要有り
							{
								transitAddFlgX = true;
							}

						A_tranidX.push(this.getSetting().LOGINID_HEADER + transit_id);
					}

				if ("N" == this.TargetTable) //transit_tb に登録する必要があるかどうか false：無、true：有
					//transit_tb に運送ＩＤがない場合
					{
						var transitAddFlg = false;

						if (-1 !== A_tranid.indexOf(this.getSetting().LOGINID_HEADER + transit_id) == false) //削除済みの運送ＩＤとして登録が有る場合
							//運送ＩＤマスターに追加
							{
								if (-1 !== A_tranidDel.indexOf(this.getSetting().LOGINID_HEADER + transit_id) == true) //削除を取り消す運送ＩＤリストに追加
									{
										A_undoTranid.push(this.getSetting().LOGINID_HEADER + transit_id);
									} else //transit_tb へ登録する必要有り
									{
										transitAddFlg = true;
									}

								A_tranid.push(this.getSetting().LOGINID_HEADER + transit_id);
							}
					}

				var A_senddate = Object.keys(H_editAllFileData[transit_id]);
				A_senddate.sort();

				for (var senddate of Object.values(A_senddate)) //原票番号一覧を取得
				//原票番号一覧を１件ずつ処理
				//原票番号一覧を１件ずつ処理 END
				{
					var A_slipno = Object.keys(H_editAllFileData[transit_id][senddate]);
					A_slipno.sort();

					for (var slipno of Object.values(A_slipno)) //原票番号の頭の数字の意味
					//99         ：往復宅配便
					//9［9以外］ ：メール便
					//1          ：着払い
					//2          ：着払い
					//3          ：宅配便
					//4          ：宅配便
					//6          ：宅配便
					//8          ：宅配便
					//原票行ＮＯ一覧を取得
					//原票行ＮＯ一覧を１件ずつ処理
					//原票行ＮＯ一覧を１件ずつ処理 END
					{
						var code = "";

						if ("9" == slipno.substr(0, 1) && "9" == slipno.substr(1, 1)) {
							code = "099";
						} else if ("9" == slipno.substr(0, 1) && "9" != slipno.substr(1, 1)) {
							code = "09N";
						} else if ("1" == slipno.substr(0, 1)) {
							code = "001";
						} else if ("2" == slipno.substr(0, 1)) {
							code = "002";
						} else if ("3" == slipno.substr(0, 1) || "4" == slipno.substr(0, 1) || "6" == slipno.substr(0, 1) || "8" == slipno.substr(0, 1)) {
							code = "003";
						} else {
							this.warningOut(1000, "\u4E0D\u660E\u306A\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059\uFF1A\u4F1D\u7968\u756A\u53F7" + slipno + " \n", 1);
						}

						var codename = H_utiwake[this.getSetting().CARID][code].name;
						var A_lineno = Object.keys(H_editAllFileData[transit_id][senddate][slipno]);
						A_lineno.sort();

						for (var lineno of Object.values(A_lineno)) //transit_usehistory_X_tb 出力用配列へ格納
						//請求明細を集計
						//[pactid][tranid][trancoid][code][charge]
						//[pactid][tranid][trancoid][code][weight]
						//[pactid][tranid][trancoid][code][sendcount]
						//[pactid][tranid][trancoid][code][taxkubun]
						//[pactid][tranid][trancoid][code][detailno]
						//[pactid][tranid][trancoid][code][recdate]
						//金額
						//重量
						//数量
						//税区分
						//transit_X_tb へ登録する必要有りの場合
						{
							A_outPutTransitUseHistory.push({
								pactid: A_pactid[pactCounter],
								tranid: this.getSetting().LOGINID_HEADER + transit_id,
								trancoid: this.getSetting().CARID,
								charge: H_editAllFileData[transit_id][senddate][slipno][lineno].charge,
								excise: H_editAllFileData[transit_id][senddate][slipno][lineno].excise,
								weight: H_editAllFileData[transit_id][senddate][slipno][lineno].weight,
								insurance: H_editAllFileData[transit_id][senddate][slipno][lineno].insurance,
								sendcount: H_editAllFileData[transit_id][senddate][slipno][lineno].sendcount,
								slipno: slipno,
								to_name: String(H_editAllFileData[transit_id][senddate][slipno][lineno].to_name),
								to_telno: H_editAllFileData[transit_id][senddate][slipno][lineno].to_telno,
								senddate: senddate,
								comment: H_editAllFileData[transit_id][senddate][slipno][lineno].comment,
								taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID][code].taxtype],
								detailno: detailno,
								recdate: now
							});

							if (true == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].charge)) {
								H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].charge = +(H_editAllFileData[transit_id][senddate][slipno][lineno].charge + +H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].charge);
							} else {
								H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].charge = +H_editAllFileData[transit_id][senddate][slipno][lineno].charge;
							}

							if (true == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].weight)) {
								H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].weight = +(H_editAllFileData[transit_id][senddate][slipno][lineno].weight + +H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].weight);
							} else {
								H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].weight = +H_editAllFileData[transit_id][senddate][slipno][lineno].weight;
							}

							if (true == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].sendcount)) {
								H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].sendcount = +(H_editAllFileData[transit_id][senddate][slipno][lineno].sendcount + +H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].sendcount);
							} else {
								H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].sendcount = +H_editAllFileData[transit_id][senddate][slipno][lineno].sendcount;
							}

							if (false == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].taxkubun)) {
								H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].taxkubun = this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID][code].taxtype];
							}

							if (false == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].detailno)) {
								H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].detailno = 0;
							}

							if (false == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].recdate)) {
								H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID][code].recdate = now;
							}

							if (0 != +H_editAllFileData[transit_id][senddate][slipno][lineno].excise) //金額
								//重量
								//数量
								//税区分
								//詳細番号
								{
									if (true == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["009"].charge)) {
										H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["009"].charge = +(H_editAllFileData[transit_id][senddate][slipno][lineno].excise + +H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["009"].charge);
									} else {
										H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["009"].charge = +H_editAllFileData[transit_id][senddate][slipno][lineno].excise;
									}

									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["009"].weight = 0;
									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["009"].sendcount = 0;
									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["009"].taxkubun = this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID]["009"].taxtype];

									if (false == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["009"].detailno)) {
										H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["009"].detailno = 1;
									}

									if (false == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["009"].recdate)) {
										H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["009"].recdate = now;
									}
								}

							if (0 != +H_editAllFileData[transit_id][senddate][slipno][lineno].insurance) //金額
								//重量
								//数量
								//税区分
								//詳細番号
								{
									if (true == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["008"].charge)) {
										H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["008"].charge = +(H_editAllFileData[transit_id][senddate][slipno][lineno].insurance + +H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["008"].charge);
									} else {
										H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["008"].charge = +H_editAllFileData[transit_id][senddate][slipno][lineno].insurance;
									}

									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["008"].weight = 0;
									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["008"].sendcount = 0;
									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["008"].taxkubun = this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID]["008"].taxtype];

									if (false == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["008"].detailno)) {
										H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["008"].detailno = 2;
									}

									if (false == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["008"].recdate)) {
										H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID]["008"].recdate = now;
									}
								}

							if (true == aspFlg) //金額
								//重量
								//数量
								//税区分
								//詳細番号
								//重量
								//数量
								//税区分
								//詳細番号
								{
									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASP.charge = +aspCharge;
									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASP.weight = 0;
									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASP.sendcount = 0;
									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASP.taxkubun = this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID].ASP.taxtype];

									if (false == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASP.detailno)) //小計表示挿入のため1つ飛ばす 20100427miya
										{
											H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASP.detailno = 4;
										}

									if (false == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASP.recdate)) {
										H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASP.recdate = now;
									}

									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASX.charge = +asxCharge;
									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASX.weight = 0;
									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASX.sendcount = 0;
									H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASX.taxkubun = this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID].ASX.taxtype];

									if (false == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASX.detailno)) //小計表示挿入のため1つ飛ばす 20100427miya
										{
											H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASX.detailno = 5;
										}

									if (false == (undefined !== H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASX.recdate)) {
										H_TransitDetails[A_pactid[pactCounter]][this.getSetting().LOGINID_HEADER + transit_id][this.getSetting().CARID].ASX.recdate = now;
									}
								}

							detailno++;
							outTranusehistoryCnt++;

							if (true == transitAddFlgX) //既存チェック
								{
									var tr_X_cnt = this.O_Model.transitIsExist(A_pactid[pactCounter], this.getSetting().LOGINID_HEADER + transit_id, this.getSetting().CARID, transitX_tb);

									if (true == 1 > tr_X_cnt) //transit_X_tb 出力用配列へ格納
										{
											A_outPutTransitX.push({
												pactid: A_pactid[pactCounter],
												postid: rootPostidX,
												tranid: this.getSetting().LOGINID_HEADER + transit_id,
												trancoid: this.getSetting().CARID,
												userid: undefined,
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
												deletedate: undefined,
												pre_tranid: undefined,
												pre_trancoid: undefined
											});
											outTranXCnt++;
										}

									transitAddFlgX = false;
								}

							if ("N" == this.TargetTable && true == transitAddFlg) //既存チェック
								{
									var tr_cnt = this.O_Model.transitIsExist(A_pactid[pactCounter], this.getSetting().LOGINID_HEADER + transit_id, this.getSetting().CARID, "transit_tb");

									if (true == 1 > tr_cnt) //transit_tb 出力用配列へ格納
										{
											A_outPutTransit.push({
												pactid: A_pactid[pactCounter],
												postid: rootPostidX,
												tranid: this.getSetting().LOGINID_HEADER + transit_id,
												trancoid: this.getSetting().CARID,
												userid: undefined,
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
												deletedate: undefined,
												pre_tranid: undefined,
												pre_trancoid: undefined
											});
											outTranCnt++;
										}

									transitAddFlg = false;
								}
						}
					}
				}
			}

			A_pactDone.push(A_pactid[pactCounter]);
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(transit_tb:" + outTranCnt + "\u4EF6," + transitX_tb + ":" + outTranXCnt + "\u4EF6," + tranusehistory_tb + ":" + outTranusehistoryCnt + "\u4EF6)\n", 1);
			outTranCnt = outTranXCnt = outTranusehistoryCnt = 0;
		}

		for (var key_pactid in H_TransitDetails) {
			var A_det_pactid = H_TransitDetails[key_pactid];

			for (var key_tranid in A_det_pactid) {
				var A_det_tranid = A_det_pactid[key_tranid];

				for (var key_trancoid in A_det_tranid) {
					var A_det_trancoid = A_det_tranid[key_trancoid];

					for (var key_code in A_det_trancoid) {
						var A_det_code = A_det_trancoid[key_code];
						A_outPutTransitDetails.push({
							pactid: key_pactid,
							tranid: key_tranid,
							trancoid: key_trancoid,
							code: key_code,
							codename: H_utiwake[this.getSetting().CARID][key_code].name,
							charge: A_det_code.charge,
							weight: A_det_code.weight,
							sendcount: A_det_code.sendcount,
							taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID][key_code].taxtype],
							detailno: A_det_code.detailno,
							recdate: A_det_code.recdate
						});
					}
				}
			}
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
			var expFile = dataDir + tranusehistory_tb + date("YmdHis") + ".exp";

			if (false == this.expData(tranusehistory_tb, expFile, this.getSetting().NUM_FETCH)) {
				throw die(-1);
			}
		}

		this.get_DB().beginTransaction();

		for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //運送ＩＤの削除フラグをfalseにする必要がある場合
		//if(count($A_undoTranidX) != 0){
		//$O_TransitModel->chgDelFlg($A_pactDone[$pactDoneCounter],$this->getSetting()->CARID,$A_undoTranidX,"false",$tableNo);
		//}
		//運送ＩＤの削除フラグをfalseにする必要がある場合
		//if(isset($A_undoTranid) == true && 0 != count($A_undoTranid)){
		//$O_TransitModel->chgDelFlg($A_pactDone[$pactDoneCounter],$this->getSetting()->CARID,$A_undoTranid,"false");
		//}
		{}

		if ("O" == this.Mode) {
			O_BillModel.delTransitUseHistoryData(A_pactDone, tableNo, A_trancoid);
			O_BillModel.delTransitDetailsData(A_pactDone, tableNo, A_trancoid);
		}

		if (0 != A_outPutTransitUseHistory.length) //transit_usehistory_X_tb取込失敗
			{
				var rtn = this.get_DB().pgCopyFromArray(tranusehistory_tb, A_outPutTransitUseHistory);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + tranusehistory_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(tranusehistory_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		if (0 != A_outPutTransitDetails.length) //transit_details_X_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray(trandetails_tb, A_outPutTransitDetails);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + trandetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(trandetails_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		if (0 != A_outPutTransitX.length) //transit_X_tbへデータ取込
			//transit_X_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray(transitX_tb, A_outPutTransitX);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + transitX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(transitX_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		if (undefined !== A_outPutTransit == true && 0 != A_outPutTransit.length) //transit_tbへデータ取込
			//transit_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray("transit_tb", A_outPutTransit);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\ntransit_tb \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut("transit_tb \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
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
		this.infoOut("\u798F\u5C71\u901A\u904B\u660E\u7D30\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 1);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};