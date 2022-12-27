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

require("view/script/ImportDocomoHealthView.php");

require("model/script/ImportDocomoHealthModel.php");

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
class ImportDocomoHealthProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("docomo_health");
		this.O_View = new ImportDocomoHealthView();
		this.O_Model = new ImportDocomoHealthModel(this.get_MtScriptAmbient());
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
	//$H_utiwake = $O_BillModel->getTransitUtiwake($A_healthcoid);
	//対象テーブル番号を取得
	//テーブル名設定
	//出力件数カウント
	//請求明細集計用配列
	//PostModelインスタンスを作成
	//pactid 毎に処理する
	//END FOR pactid 毎に処理する
	//処理する件数が０件なら直ちに終了する
	//モードがオーバーライトの時はデータをインポートする前にデリート
	//処理が完了したファイルを移動
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.infoOut("\u30C9\u30B3\u30E2\u30D8\u30EB\u30B9\u30B1\u30A2\u53D6\u8FBC\n", 0);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + this.getSetting().DOCOMO_HEALTH_DIR + "/";

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, this.getSetting().DOCOMO_HEALTH + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
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
				var pactCnt = count(A_pactid);

				if (0 == pactCnt) {
					this.errorOut(1000, "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
					throw die(-1);
				}

				var A_pactDone = Array();
			}

		var O_PactModel = new PactModel();
		var H_pactid = O_PactModel.getPactIdCompNameFromPact();
		var O_BillModel = new BillModel();
		var A_healthcoid = [this.getSetting().CARID];
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var healthcare_X_tb = "healthcare_" + tableNo + "_tb";
		var healthcare_rechistory_tb = "healthcare_rechistory_" + tableNo + "_tb";
		var healthcare_details_tb = "healthcare_details_" + tableNo + "_tb";
		var outHealthCnt = outHealthXCnt = outHealthRecHisotryCnt = 0;
		var H_HealthcareDetails = Array();
		var O_PostModel = new PostModel();

		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //請求月用のルート部署を取得(int型)
		//FuncModelインスタンスを作成
		//会社権限リストを取得
		//請求月テーブルより削除されていない運送ＩＤマスターを取得する array(healthid)
		//請求月テーブルより削除されている運送ＩＤマスターを取得する array(healthid)
		//出力用配列
		//運送明細
		//運送ＩＤ管理テーブル
		//削除フラグをfalseにする必要のある運送ＩＤリスト
		//現在テーブルにも追加する場合
		//運送ＩＤ一覧を取得
		//ファイルデータを１運送ＩＤずつ処理
		//ファイルデータを１運送ＩＤずつ処理 END
		//正常処理が完了した pactid のみリストに追加
		{
			var rootPostidX = O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo);

			if (is_null(rootPostidX)) {
				this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306Fpost_" + tableNo + "_tb\u306B\u30EB\u30FC\u30C8\u90E8\u7F72\u304C\u3042\u308A\u307E\u305B\u3093\n", 1);
				continue;
			}

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
					var fileCnt = count(A_billFile);

					if (0 == fileCnt) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 0);
							continue;
						}

					A_billFile.sort();
					var fileErrFlg = false;
					var A_allFileData = Array();

					for (var fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
					//データファイルを取得(ファイル名を渡してチェックしている)
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
							var H_editAllFileData = this.O_Model.editBillData(dataDirPact, A_allFileData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}

			var O_FuncModel = new FuncModel();
			var H_pactFunc = O_FuncModel.getPactFunc(A_pactid[pactCounter], undefined, false);
			var A_healthidX = Array();
			var A_healthidXDel = Array();
			var A_outPutHealthcareRecHistory = Array();
			var A_outPutHealthcareX = Array();
			var A_undoHealthidX = Array();

			if ("N" == this.TargetTable) //現在テーブルより削除されていない運送ＩＤマスターを取得する array(transitid)
				//現在テーブルより削除されている運送ＩＤマスターを取得する array(tranid)
				//運送ＩＤ管理テーブル
				//削除フラグをfalseにする必要のある運送ＩＤリスト
				{
					var A_healthid = Array();
					var A_healthidDel = Array();
					var A_outPutHealthcare = Array();
					var A_undoHealthid = Array();
				}

			var allFileDataCnt = count(A_allFileData);
			var now = this.get_DB().getNow();
			var A_healthcare_id = Object.keys(H_editAllFileData);
			A_healthcare_id.sort();

			for (var health_id of Object.values(A_healthcare_id)) //運送ＩＤが空のデータ（＝一括請求区分が一括ではない）は取り込みを行わない
			//transit_X_tb に登録する必要があるかどうか false：無、true：有
			//health_X_tb に運送ＩＤがない場合
			//foreach( $H_editAllFileData[$health_id] as $history ){
			{
				health_id += "";

				if ("" == health_id) {
					continue;
				}

				var health_id = health_id + "";
				var healthAddFlgX = false;

				if (-1 !== A_healthidX.indexOf(health_id) == false) //削除済みの運送ＩＤとして登録が有る場合
					//運送ＩＤマスターに追加
					{
						if (-1 !== A_healthidXDel.indexOf(health_id) == true) //削除を取り消す運送ＩＤリストに追加
							{
								A_undoHealthidX.push(health_id);
							} else //transit_X_tb へ登録する必要有り
							{
								healthAddFlgX = true;
							}

						A_healthidX.push(health_id);
					}

				if ("N" == this.TargetTable) //health_tb に登録する必要があるかどうか false：無、true：有
					//healthcare_tb に運送ＩＤがない場合
					{
						var healthAddFlg = false;

						if (-1 !== A_healthid.indexOf(health_id) == false) //削除済みの運送ＩＤとして登録が有る場合
							//運送ＩＤマスターに追加
							{
								if (-1 !== A_healthidDel.indexOf(health_id) == true) //削除を取り消す運送ＩＤリストに追加
									{
										A_undoHealthid.push(health_id);
									} else //healthcare_tb へ登録する必要有り
									{
										healthAddFlg = true;
									}

								A_healthid.push(health_id);
							}
					}

				for (var history of Object.values(H_editAllFileData[health_id])) //明細
				//テーブルのカラム順にすること
				//transit_X_tb へ登録する必要有りの場合
				{
					var temp = Array();
					var year = this.BillDate.substr(0, 4);
					temp.pactid = A_pactid[pactCounter];
					temp.healthid = history.healthid;
					temp.healthcoid = this.getSetting().CARID;
					temp.recdate = now;
					temp.birthday = history.birthday;
					temp.gender = history.gender;
					temp.height = history.height;
					temp.weight = history.weight;
					temp.metabolism = history.metabolism;
					temp.datadate = year + "-" + history.datadate;
					temp.steps = history.steps;
					temp.move = history.move;
					temp.calories = history.calories;
					temp.amount_fatburned = history.amount_fatburned;
					temp.sleep = history.sleep;
					temp.measurement_start = history.measurement_start;
					temp.onset_sleep = history.onset_sleep;
					temp.wakeup = history.wakeup;
					temp.arousal_during_sleep = history.arousal_during_sleep;
					A_outPutHealthcareRecHistory.push(temp);
					outHealthRecHisotryCnt++;

					if (true == healthAddFlgX) //既存チェック
						//なければ追加
						{
							var res = this.O_Model.HealthcareIsExist(A_pactid[pactCounter], health_id, this.getSetting().CARID, healthcare_X_tb);

							if (1 > res) //healthcare_X_tb 出力用配列へ格納
								{
									A_outPutHealthcareX.push({
										pactid: A_pactid[pactCounter],
										postid: rootPostidX,
										healthid: health_id,
										healthcoid: this.getSetting().CARID,
										username: undefined,
										employeecode: undefined,
										registdate: undefined,
										remarks: undefined,
										fixdate: now,
										recdate: now,
										dummy_flg: "false",
										delete_flg: "false",
										deletedate: undefined
									});
									outHealthXCnt++;
								}

							healthAddFlgX = false;
						}

					if ("N" == this.TargetTable && true == healthAddFlg) //既存チェック
						{
							var count = this.O_Model.HealthcareIsExist(A_pactid[pactCounter], health_id, this.getSetting().CARID, "healthcare_tb");

							if (1 > count) //healthcare_tb 出力用配列へ格納
								{
									A_outPutHealthcare.push({
										pactid: A_pactid[pactCounter],
										postid: rootPostidX,
										healthid: health_id,
										healthcoid: this.getSetting().CARID,
										username: undefined,
										employeecode: undefined,
										registdate: undefined,
										remarks: undefined,
										fixdate: now,
										recdate: now,
										dummy_flg: "false",
										delete_flg: "false",
										deletedate: undefined
									});
									outHealthCnt++;
								}

							healthAddFlg = false;
						}
				}
			}

			A_pactDone.push(A_pactid[pactCounter]);
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(healthcare_tb:" + outHealthCnt + "\u4EF6," + healthcare_X_tb + ":" + outHealthXCnt + "\u4EF6," + healthcare_rechistory_tb + ":" + outHealthRecHisotryCnt + "\u4EF6)\n", 0);
			outHealthCnt = outHealthXCnt = outHealthRecHisotryCnt = 0;
		}

		var pactDoneCnt = count(A_pactDone);

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
			//終了
			{
				this.warningOut(1000, "\u30A4\u30F3\u30DD\u30FC\u30C8\u53EF\u80FD\u306A\u8ACB\u6C42\u60C5\u5831\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\n", 0);
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw die(0);
			}

		if ("Y" == this.BackUpFlg) {
			var expFile = dataDir + healthcare_rechistory_tb + date("YmdHis") + ".exp";

			if (false == this.expData(healthcare_rechistory_tb, expFile, this.getSetting().NUM_FETCH)) {
				throw die(-1);
			}
		}

		this.get_DB().beginTransaction();

		if ("O" == this.Mode) {
			O_BillModel.delHealthcareRecHistoryData(A_pactDone, tableNo, A_healthcoid);
		}

		if (0 != count(A_outPutHealthcareRecHistory)) //healthcare_rechistory_X_tb取込失敗
			{
				var rtn = this.get_DB().pgCopyFromArray(healthcare_rechistory_tb, A_outPutHealthcareRecHistory);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + healthcare_rechistory_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(healthcare_rechistory_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 0);
				}
			}

		if (0 != count(A_outPutHealthcareX)) //transit_X_tbへデータ取込
			//transit_X_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray(healthcare_X_tb, A_outPutHealthcareX);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + healthcare_X_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(healthcare_X_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 0);
				}
			}

		if (undefined !== A_outPutHealthcare == true && 0 != count(A_outPutHealthcare)) //healthcare_tbへデータ取込
			//healthcare_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray("healthcare_tb", A_outPutHealthcare);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\nhealthcare_tb \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut("healthcare_tb \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 0);
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
		this.infoOut("\u30C9\u30B3\u30E2\u30D8\u30EB\u30B9\u30B1\u30A2\u660E\u7D30\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 0);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};