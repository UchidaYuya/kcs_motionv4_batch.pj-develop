//
//ＫＧ通話明細データ（転送用詳細ファイル）取込処理 （Process）
//
//更新履歴：<br>
//2009/05/11 前田 聡 作成
//2009/10/19 通話先所在地欄に呼種区分を入れる 前田
//
//KgImportTuwaProc
//
//@package script
//@subpackage Process
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/05/11
//@uses MtTableUtil
//@uses PactModel
//@uses BillModel
//@uses ProcessBaseBatch
//@uses KgImportBillView
//@uses KgImportBillModel
//
//
//error_reporting(E_ALL|E_STRICT);

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/KgImportTuwaView.php");

require("model/script/KgImportTuwaModel.php");

//
//コンストラクタ
//
//@author maeda
//@since 2009/05/11
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2009/05/11
//
//@param array $H_param
//@access protected
//@return void
//
//
//chkTelno
//
//@author maeda
//@since 2009/05/13
//
//@param mixed $telno：電話番号
//@param mixed $H_telno：登録済み電話番号リスト
//@param mixed $baseName：拠点識別子
//@param mixed $telExistFlg：電話登録フラグ
//@param mixed $telnoOut：出力用電話番号
//@access public
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2009/05/11
//
//@access public
//@return void
//
class KgImportTuwaProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("kg");
		this.O_View = new KgImportTuwaView();
		this.O_Model = new KgImportTuwaModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//処理開始
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//通話明細データディレクトリを取得
	//通話明細データディレクトリチェック（スクリプト終了）
	//PactModelインスタンス作成
	//会社マスターを作成
	//BillModelインスタンスを作成
	//対象テーブル番号を取得
	//テーブル名設定
	//出力件数カウント
	//pactid 毎に処理する
	//END FOR pactid 毎に処理する
	//処理する件数が０件なら直ちに終了する
	//モードがオーバーライトの時はデータをインポートする前にデリート
	//commhistory_X_tbへデータ取込
	//処理が完了したファイルを移動
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.infoOut(this.getSetting().KG_TUWA + "\u958B\u59CB\n", 1);
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + this.getSetting().KG_DIR_TUWA + "/";

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, "\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
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
					this.errorOut(1000, "\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
					throw die(-1);
				}

				var A_pactDone = Array();
			}

		var O_PactModel = new PactModel();
		var H_pactid = O_PactModel.getPactIdCompNameFromPact();
		var O_BillModel = new BillModel();
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var commhistory_tb = "commhistory_" + tableNo + "_tb";
		var outCommhistCnt = 0;

		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //通話明細の掛け元番号に登録されていないものがあるかどうか false:無し、true:有り
		//pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		//請求月テーブルより電話番号マスターを取得する array(basename(予備項目１)  => array(telno))
		//出力用配列
		//通話明細（出力準備用）
		//通話明細（出力用）
		//拠点一覧を取得
		//ファイルデータを拠点毎に処理
		//ファイルデータを拠点毎に処理 END
		//正常処理が完了した pactid のみリストに追加
		{
			var errFlg = false;

			if (undefined !== H_pactid[A_pactid[pactCounter]] == false) //次のpactidへスキップ
				//pactid が会社マスターに登録されている場合
				{
					this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
					continue;
				} else //pactid 毎の通話明細データディレクトリ設定
				//通話明細データファイル名を取得
				//処理するファイル数
				//通話明細データファイルがなかった場合（スクリプト続行 次のpactidへスキップ）
				//ファイルエラーフラグ
				//全ファイルデータ配列
				//ファイル数分処理する
				//１ファイルでも不備があれば、そのpactidはスキップする（スクリプト続行 次のpactidへスキップ）
				//ログ出力
				{
					var dataDirPact = dataDir + A_pactid[pactCounter];
					var A_tuwaFile = this.getFileList(dataDirPact);
					var fileCnt = A_tuwaFile.length;

					if (0 == fileCnt) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						}

					A_tuwaFile.sort();
					var fileErrFlg = false;
					var H_allFileData = Array();

					for (var fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
					//データファイル名から東京分か大阪分かを判断する
					//データファイルが東京分の場合
					//データファイルを取得
					//データファイルチェックでエラーがあった場合（項目数）
					{
						var H_fileData = Array();

						if (preg_match("/^" + this.getSetting().FILE_HEAD_TOKYO + "/", A_tuwaFile[fileCounter]) == true) //大阪用部門ファイル
							{
								var baseName = this.getSetting().FILE_HEAD_TOKYO;
							} else if (preg_match("/^" + this.getSetting().FILE_HEAD_OSAKA + "/", A_tuwaFile[fileCounter]) == true) //不明ファイル
							{
								baseName = this.getSetting().FILE_HEAD_OSAKA;
							} else //次のpactidへスキップ
							{
								this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB" + A_tuwaFile[fileCounter] + "\u306E\u7A2E\u985E\u304C\u4E0D\u660E\u306A\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
								continue;
							}

						H_fileData = this.O_Model.chkBillData(dataDirPact + "/" + A_tuwaFile[fileCounter], baseName);

						if (H_fileData == false) //データファイルチェックでエラーがなかった場合
							{
								fileErrFlg = true;
							} else //複数ファイルデータをマージ
							{
								H_allFileData = array_merge_recursive(H_allFileData, H_fileData);
							}
					}

					if (true == fileErrFlg) //次のpactidへスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u4E0D\u6B63\u306A\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
							continue;
						} else //必要なデータのみ保持する
						//array(電話番号 => DBDATA)
						{
							var H_editAllFileData = this.O_Model.editBillData(H_allFileData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_tuwaFile.join(",") + "\n", 0);
				}

			var H_telnoX = this.O_Model.getTelnoBasename(A_pactid[pactCounter], tableNo, this.getSetting().CARID);
			var A_tmpCommhist = Array();
			var A_outPutCommhist = Array();
			var A_baseName = Object.keys(H_editAllFileData);
			A_baseName.sort();

			for (var baseName of Object.values(A_baseName)) //総行数取得
			//電話番号一覧を取得
			//ファイルデータを１電話番号ずつ処理
			//ファイルデータを１電話番号ずつ処理 END
			{
				var allFileDataCnt = H_allFileData[baseName].length;
				var A_telno = Object.keys(H_editAllFileData[baseName]);
				A_telno.sort();

				for (var telno of Object.values(A_telno)) //電話番号を文字列認識させる
				//出力用電話番号
				//電話番号がtel_X_tb に存在しているかどうか true：存在する、false：存在しない
				//電話番号の存在チェック
				{
					var telno = telno + "";
					var telnoOut = "";
					var telExistFlgX = true;
					this.chkTelno(telno, H_telnoX, baseName, telExistFlgX, telnoOut);

					if (false == telExistFlgX) //電話番号のチェックはするが処理中のpactidのデータはインポートはしない
						//次の電話番号へスキップ
						{
							this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306E tel_" + tableNo + "_tb \u306B\u96FB\u8A71\u756A\u53F7 " + telno + " \u304C\u5B58\u5728\u3057\u307E\u305B\u3093\n", 1);
							errFlg = true;
							continue;
						}

					if (false == errFlg) //明細番号一覧を取得
						//明細を１件ずつ処理する
						//明細を１件ずつ処理する END
						{
							var A_detailno = Object.keys(H_editAllFileData[baseName][telno]);
							A_detailno.sort();

							for (var detailno of Object.values(A_detailno)) //commhistory_X_tb 出力用配列へ格納
							{
								A_tmpCommhist.push({
									pactid: A_pactid[pactCounter],
									telno: telnoOut,
									type: this.getSetting().TUWA_TYPE,
									date: H_editAllFileData[baseName][telno][detailno].date,
									totelno: H_editAllFileData[baseName][telno][detailno].totelno,
									toplace: H_editAllFileData[baseName][telno][detailno].toplace,
									fromplace: undefined,
									time: H_editAllFileData[baseName][telno][detailno].time,
									charge: H_editAllFileData[baseName][telno][detailno].charge,
									byte: undefined,
									callseg: undefined,
									callsegname: undefined,
									chargeseg: undefined,
									discountseg: undefined,
									occupseg: undefined,
									kubun1: undefined,
									kubun2: undefined,
									kubun3: undefined,
									carid: this.getSetting().CARID,
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
								outCommhistCnt++;
							}
						}
				}
			}

			if (false == errFlg) {
				A_outPutCommhist = array_merge(A_outPutCommhist, A_tmpCommhist);
				A_pactDone.push(A_pactid[pactCounter]);
				this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(" + commhistory_tb + ":" + outCommhistCnt + "\u4EF6)\n", 1);
			}

			outCommhistCnt = 0;
		}

		var pactDoneCnt = A_pactDone.length;

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
			//終了
			{
				this.warningOut(1000, "\u30A4\u30F3\u30DD\u30FC\u30C8\u53EF\u80FD\u306A\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw die(0);
			}

		if ("Y" == this.BackUpFlg) {
			var expFile = dataDir + commhistory_tb + date("YmdHis") + ".exp";

			if (false == this.expData(commhistory_tb, expFile, this.getSetting().NUM_FETCH)) {
				throw die(-1);
			}
		}

		this.get_DB().beginTransaction();

		if ("O" == this.Mode) {
			O_BillModel.delCommhistoryData(A_pactDone, tableNo, [this.getSetting().CARID]);
		}

		var outCnt = A_outPutCommhist.length;

		if (0 != outCnt) //一定行数以上は分割して複数回で取込む
			{
				var roopCnt = Math.floor(outCnt / this.getSetting().NUM_FETCH) + 1;

				for (var doCnt = 0; doCnt < roopCnt; doCnt++) //一定行数を取り出す
				//取込み
				//commhistory_X_tb取込失敗
				{
					var A_doCommhist = A_outPutCommhist.slice(doCnt * this.getSetting().NUM_FETCH, this.getSetting().NUM_FETCH);
					var rtn = this.get_DB().pgCopyFromArray(commhistory_tb, A_doCommhist);

					if (rtn == false) {
						this.get_DB().rollback();
						this.errorOut(1000, "\n" + commhistory_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
						throw die(-1);
					}
				}

				this.infoOut(commhistory_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
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
		this.infoOut(this.getSetting().KG_TUWA + "\u7D42\u4E86\n", 1);
	}

	chkTelno(telno, H_telno, baseName, telExistFlg, telnoOut) //東京データの場合
	{
		if (baseName == this.getSetting().FILE_HEAD_TOKYO) //tel_(X_)tb(東京分) に電話番号があるかチェックする
			//tel_(X_)tb(東京分) に電話番号がない場合
			//大阪データの場合
			{
				if (-1 !== H_telno[this.getSetting().BASENAME_TOKYO].indexOf(telno) == false) //電話番号に枝番号を付与し、再度tel_(X_)tb(東京分) に電話番号があるかチェックする
					//tel_(X_)tb(東京分) に電話番号がない場合
					//tel_(X_)tb(東京分) に電話番号がある場合
					{
						if (-1 !== H_telno[this.getSetting().BASENAME_TOKYO].indexOf(telno + this.getSetting().LINE_BRANCH_TKY) == false) //tel_(X_)tb へ登録する必要有り
							//tel_(X_)tb(大阪分) に電話番号があるかチェックする
							//tel_(X_)tb(大阪分) に電話番号がない場合
							//tel_(X_)tb(東京分) に電話番号がある場合
							{
								telExistFlg = false;

								if (-1 !== H_telno[this.getSetting().BASENAME_OSAKA].indexOf(telno) == false) //tel_(X_)tb(大阪分) に電話番号がある場合
									{
										telnoOut = telno;
									} else //電話番号に枝番を付与
									{
										telnoOut = telno + this.getSetting().LINE_BRANCH_TKY;
									}
							} else {
							telnoOut = telno + this.getSetting().LINE_BRANCH_TKY;
						}
					} else {
					telnoOut = telno;
				}
			} else //tel_(X_)tb(大阪分) に電話番号があるかチェックする
			//tel_(X_)tb(大阪分) に電話番号がない場合
			{
				if (-1 !== H_telno[this.getSetting().BASENAME_OSAKA].indexOf(telno) == false) //電話番号に枝番号を付与し、再度tel_(X_)tb(大阪分) に電話番号があるかチェックする
					//tel_(X_)tb(大阪分) に電話番号がない場合
					//tel_(X_)tb(大阪分) に電話番号がある場合
					{
						if (-1 !== H_telno[this.getSetting().BASENAME_OSAKA].indexOf(telno + this.getSetting().LINE_BRANCH_OSK) == false) //tel_(X_)tb へ登録する必要有り
							//tel_(X_)tb(東京分) に電話番号があるかチェックする
							//tel_(X_)tb(東京分) に電話番号がない場合
							//tel_(X_)tb(大阪分) に電話番号がある場合
							{
								telExistFlg = false;

								if (-1 !== H_telno[this.getSetting().BASENAME_TOKYO].indexOf(telno) == false) //tel_(X_)tb(東京分) に電話番号がある場合
									{
										telnoOut = telno;
									} else //電話番号に枝番を付与
									{
										telnoOut = telno + this.getSetting().LINE_BRANCH_OSK;
									}
							} else {
							telnoOut = telno + this.getSetting().LINE_BRANCH_OSK;
						}
					} else {
					telnoOut = telno;
				}
			}
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};