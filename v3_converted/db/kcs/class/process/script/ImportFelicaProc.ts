//
//Felicaデータ取込処理 （Process）
//
//更新履歴：<br>
//2010/04/19 宮澤龍彦 作成
//
//ImportFelicaProc
//
//@package Felica
//@subpackage Process
//@author miyazawa<miyazawa@motion.co.jp>
//@filesource
//@since 2010/04/19
//@uses MtTableUtil
//@uses PactModel
//@uses BillModel
//@uses PostModel
//@uses FuncModel
//@uses ProcessBaseBatch
//@uses ImportFelicaView
//@uses ImportFelicaModel
//
//
//error_reporting(E_ALL|E_STRICT);

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/ImportFelicaView.php");

require("model/script/ImportFelicaModel.php");

//
//コンストラクタ
//
//@author miyazawa
//@since 2010/04/19
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author miyazawa
//@since 2010/04/19
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2010/04/19
//
//@access public
//@return void
//
class ImportFelicaProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("felica");
		this.O_View = new ImportFelicaView();
		this.O_Model = new ImportFelicaModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //処理開始
	//$this->infoOut("Felica明細データインポート開始\n",1);	// メール削減のためコメントアウト 20100924miya
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//除外pactid 20100713miya
	//請求データディレクトリを取得
	//除外pactidを整形 20100713miya
	//PactModelインスタンス作成
	//会社マスターを作成
	//BillModelインスタンスを作成
	//処理するキャリアＩＤリスト
	//内訳種別マスター情報を取得
	//$H_utiwake = $O_BillModel->getFelicaUtiwake($A_iccardcoid);
	//対象テーブル番号を取得
	//テーブル名設定
	//出力件数カウント
	//明細データファイル名を取得
	//処理するファイル数
	//ファイル名順でソート
	//ファイルエラーフラグ
	//全ファイルデータ配列
	//ファイル数分処理する
	//１ファイルでも不備があれば、そのpactidはスキップする（スクリプト続行 次のpactidへスキップ）
	//ASP料金が true:発生する、false:発生しない
	//利用種別配列
	//出力用配列
	//Felica明細
	//取り込めない明細
	//総行数取得
	//FelicaＩＤ一覧を取得
	//$A_iccard_id = array_keys($H_editAllFileData);
	//sort($A_iccard_id);
	//iccardid => array(pactid, userid)の配列
	//出力用配列にセット
	//$this->infoOut(" インポートファイル出力完了(" . $iccardhistory_tb . ":" . $outTranhistoryCnt . "社)\n",1);	// メール削減のためコメントアウト 20100924miya
	//取込失敗明細を別ファイルにする
	//iccard_history_tbへデータ取込
	//コミット
	//処理が完了したファイルを移動
	//移動元ディレクトリ
	//移動先ディレクトリ
	//$this->mvFile($fromDir,$finDir)で移動していたがいちいち移動完了メールが飛ぶので自前に変更 20101008miya
	//ファイルの移動
	//スクリプトの二重起動防止ロック解除
	//終了
	//$this->infoOut("Felica明細データインポート終了\n",1);	// メール削減のためコメントアウト 20100924miya
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.ExPactId = this.O_View.get_HArgv("-P");
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + this.getSetting().FELICA_DIR + "/";
		var A_expactid = Array();

		if (undefined != this.ExPactId) {
			this.ExPactId = this.ExPactId.trim();

			if ("none" != this.ExPactId) {
				A_expactid = split(",", this.ExPactId);

				for (var expactid of Object.values(A_expactid)) {
					if (false == is_numeric(expactid)) //pactidが数字じゃなかったら中止
						//スクリプトの二重起動防止ロック解除
						//スクリプト終了処理
						{
							this.infoOut("\n\u9664\u5916pactid\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
							this.unLockProcess(this.O_View.get_ScriptName());
							this.set_ScriptEnd();
							throw die(-1);
						}
				}
			}
		}

		if (this.isDirCheck(dataDir, "rw") == false) {
			if (false == file_exists(dataDir)) //データディレクトリがなかったら作成するようにした 20101001miya
				{
					mkdir(dataDir, 755, true);
				}
		} else //処理する契約ＩＤ配列を初期化
			//処理する契約ＩＤを取得する
			//pactidでソート
			{
				var A_pactid = Array();
				A_pactid = this.getPactList(dataDir, this.PactId);
				A_pactid.sort();
			}

		var O_PactModel = new PactModel();
		var H_pactid = O_PactModel.getPactIdCompNameFromPact();
		var O_BillModel = new BillModel();
		var A_iccardcoid = [this.getSetting().CARID];
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var iccardhistory_tb = "iccard_history_tb";
		var outTranhistoryCnt = 0;
		var A_billFile = this.getFileList(dataDir);
		var fileCnt = A_billFile.length;
		A_billFile.sort();
		var fileErrFlg = false;
		var A_allFileData = Array();

		for (var fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
		//データファイルを取得
		//データファイルチェックでエラーがあった場合（項目数）
		{
			var A_fileData = Array();
			A_fileData = this.O_Model.chkBillData(dataDir + A_billFile[fileCounter]);

			if (A_fileData === false) //データファイルチェックでエラーがなかった場合
				{
					fileErrFlg = true;
				} else //複数ファイルデータをマージ
				{
					A_allFileData = array_merge(A_allFileData, A_fileData);
				}
		}

		if (true == fileErrFlg) //次のpactidへスキップ
			{
				this.warningOut(1000, "\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u4E0D\u6B63\u306A\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
				continue;
			} else //必要なデータのみ保持する
			//重複削除 20100706miya
			{
				var H_editAllFileData = this.O_Model.uniqueBillData(A_allFileData);
			}

		var aspFlg = false;
		var H_iccardtype = {
			"1": "IC",
			"2": "SF\u30C1\u30E3\u30FC\u30B8",
			"3": "\u5207\u7B26\u8CFC\u5165",
			"4": "\u78C1\u6C17\u5238\u7CBE\u7B97",
			"5": "\u4E57\u308A\u8D8A\u3057\u7CBE\u7B97",
			"6": "\u7A93\u53E3\u51FA\u5834",
			"7": "\u65B0\u898F",
			"8": "\u63A7\u9664",
			"14": "\u30D0\u30B9\u7B49\u306E\u5747\u4E00\u904B\u8CC3",
			"15": "\u30D0\u30B9\u7B49",
			"17": "\u518D\u767A\u884C",
			"19": "\u6599\u91D1\u51FA\u5834",
			"20": "\u30AA\u30FC\u30C8\u30C1\u30E3\u30FC\u30B8",
			"21": "\u30D0\u30B9\u7B49\u30C1\u30E3\u30FC\u30B8",
			"70": "\u7269\u8CA9",
			"72": "\u30DD\u30A4\u30F3\u30C8\u30C1\u30E3\u30FC\u30B8",
			"75": "\u5165\u5834\u30FB\u7269\u8CA9"
		};
		var A_outPutFelicaHistory = Array();
		var A_not_importable = Array();
		var allFileDataCnt = H_editAllFileData.length;
		var now = this.get_DB().getNow();
		var H_pact_user = Array();

		for (var A_val of Object.values(H_editAllFileData)) //iccardidからpactid、useridを取得
		{
			if (false == (-1 !== H_pact_user.indexOf(A_val[2]))) {
				var A_pu = this.O_Model.getPactUserFromIccard(A_val[2]);
				H_pact_user[A_val[2]] = A_pu;
			}

			var pactid = H_pact_user[A_val[2]].pactid;
			var userid = H_pact_user[A_val[2]].userid;

			if ("" != pactid && "" != userid) //除外pactidを取り除く 20100713miya
				{
					if (false == (-1 !== A_expactid.indexOf(pactid))) //iccard_history_tb 出力用配列へ格納（pactidごとに別れて入る）
						{
							if (false == (undefined !== A_outPutFelicaHistory[pactid])) {
								A_outPutFelicaHistory[pactid] = Array();
							}

							A_outPutFelicaHistory[pactid].push({
								pactid: pactid,
								iccardid: A_val[2],
								iccardcoid: this.getSetting().CARID,
								detailno: A_val[1],
								iccardtype: "IC",
								type: undefined,
								start: A_val[5],
								in_facility: A_val[4],
								out_facility: A_val[6],
								destination: A_val[7],
								waytype: "\u7247\u9053",
								visit: undefined,
								charge: A_val[8],
								uniqueid: A_val[9],
								note: undefined,
								handflg: "FALSE",
								delflg: "FALSE",
								fixflg: "FALSE",
								usedate: A_val[0],
								recdate: now,
								fixdate: undefined
							});
						} else //iccard_history_tb 明細取込失敗配列へ格納
						{
							A_not_importable.push(A_val);
						}
				} else //iccard_history_tb 明細取込失敗配列へ格納
				{
					A_not_importable.push(A_val);
				}
		}

		outTranhistoryCnt = A_outPutFelicaHistory.length;

		if (0 < A_not_importable.length) {
			if (false == file_exists(dataDir + "false/")) {
				mkdir(dataDir + "false/", 744, true);
			}

			var falseFile = dataDir + "false/false" + date("Ymd") + ".txt";
			var fp = fopen(falseFile, "w");
			flock(fp, LOCK_EX);

			for (var line of Object.values(A_not_importable)) {
				fputs(fp, join(",", line) + "<br>");
			}

			flock(fp, LOCK_UN);
			fclose(fp);
		}

		var importCnt = outTranhistoryCnt;

		if (0 == importCnt) //$this->warningOut(1000, "インポート可能な明細データがありませんでした\n",1);	// メール削減のためコメントアウト 20100924miya
			//スクリプトの二重起動防止ロック解除
			//終了
			{
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw die(0);
			}

		if ("Y" == this.BackUpFlg) {
			var expFile = dataDir + iccardhistory_tb + date("YmdHis") + ".exp";

			if (false == this.expData(iccardhistory_tb, expFile, this.getSetting().NUM_FETCH)) {
				throw die(-1);
			}
		}

		this.get_DB().beginTransaction();

		if (0 != A_outPutFelicaHistory.length) {
			for (var p_id in A_outPutFelicaHistory) //iccard_history_tb取込失敗
			{
				var A_pactdata = A_outPutFelicaHistory[p_id];
				var rtn = this.get_DB().pgCopyFromArray(iccardhistory_tb, A_pactdata);

				if (rtn == false) //取込失敗した会社をiccard_index_tbに記録 20100729miya
					{
						this.get_DB().rollback();
						this.errorOut(1000, "\n" + iccardhistory_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
						this.O_Model.recordICCardIndex(p_id, A_pactdata, "false");
					} else //$this->infoOut($iccardhistory_tb . " へデータ取込完了\n",1);	// メール削減のためコメントアウト 20100924miya
					//取り込んだ会社をiccard_index_tbに記録 20100729miya
					{
						this.O_Model.recordICCardIndex(p_id, A_pactdata, "true");
					}
			}
		}

		this.O_Model.deleteDuplicateBillData();
		this.get_DB().commit();
		var fromDir = dataDir;
		var finDir = fromDir + "fin";

		if (is_dir(finDir) == false) {
			mkdir(finDir, 744);
		}

		clearstatcache();
		var dirh = opendir(fromDir);

		while (mvFileName = readdir(dirh)) //ファイルなら移動する
		{
			if (is_file(fromDir + "/" + mvFileName) == true) //移動が失敗した場合
				{
					if (rename(fromDir + "/" + mvFileName, finDir + "/" + mvFileName) == false) {
						this.warningOut(1000, "\u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + fromDir + "/" + mvFileName + "\n", 1);
					}
				}

			clearstatcache();
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};