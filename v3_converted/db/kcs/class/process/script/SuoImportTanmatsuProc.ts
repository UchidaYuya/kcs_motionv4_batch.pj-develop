//
//ＳＵＯ 端末購買データ（ＫＣＳ）取込処理 （Process）
//
//更新履歴：<br>
//2008/04/01 前田 聡 作成
//電話番号存在チェックで頭の０の有り無しを判断できていなかったのを修正 2010/12/02 前田
//
//SuoImportTanmatsuProc
//
//@package SUO
//@subpackage Process
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2008/04/01
//@uses ProcessBaseBatch
//@uses MtTableUtil
//@uses PactModel
//@uses BillModel
//@uses PostModel
//@uses TelModel
//@uses SuoImportTanmatsuView
//@uses SuoImportTanmatsuModel
//
//
//error_reporting(E_ALL|E_STRICT);

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/TelModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/SuoImportTanmatsuView.php");

require("model/script/SuoImportTanmatsuModel.php");

//
//コンストラクタ
//
//@author maeda
//@since 2008/04/22
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2008/04/22
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
class SuoImportTanmatsuProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("tanmatsu_kcs");
		this.O_View = new SuoImportTanmatsuView();
		this.O_Model = new SuoImportTanmatsuModel(this.get_MtScriptAmbient());
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
	//ASP料金関連の明細を再度入れなおす前に削除する
	//tel_details_X_tbへデータ取込
	//処理が完了したファイルを移動
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.infoOut("\u7AEF\u672B\u8CFC\u8CB7\u30C7\u30FC\u30BF\uFF08\uFF2B\uFF23\uFF33\uFF09\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + this.getSetting().TANMATSU_KCS_DIR + "/";

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, this.getSetting().TANMATSU_KCS + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
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
		var A_carid = [this.getSetting().car_docomo, this.getSetting().car_willcom, this.getSetting().car_au, this.getSetting().car_softbank];
		var H_utiwake = O_BillModel.getUtiwake(A_carid);
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var telX_tb = "tel_" + tableNo + "_tb";
		var teldetails_tb = "tel_details_" + tableNo + "_tb";
		var outTelXCnt = outTeldetailsCnt = 0;

		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //ASP料金が true:発生する、false:発生しない
		//pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		//PostModelインスタンスを作成
		//請求月用のルート部署を取得
		//TelModelインスタンスを作成
		//請求月テーブルより電話番号マスターを取得する array(CARID => array(telno))
		//請求月テーブルより既に取込されている請求明細でASP料金を除いた最大detailno を取得する
		//tel_detailからASP、ASX、ASPXを取得
		//出力用配列
		//総行数取得
		//１行前の電話番号
		//ファイルデータを１行ずつ処理
		//END FOR ファイルデータを１行ずつ処理
		//detailno を再採番しなかったものを手を加えずそのままtel_details_X_tb 出力用配列へ格納
		//正常処理が完了した pactid のみリストに追加
		{
			var aspFlg = false;

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
					//データファイルチェックでエラーがあった場合（カンマの数、必須項目、キャリア番号）
					{
						var A_fileData = Array();
						var A_fileNameEle = split("-", str_replace(".csv", "", A_billFile[fileCounter].toLowerCase()));

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
						} else //請求データを電話番号、コード順 でソート
						{
							A_allFileData.sort();
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}

			var O_PostModel = new PostModel();
			var rootPostidX = O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo);
			var O_TelModel = new TelModel();
			var H_telX = O_TelModel.getCaridTelno(A_pactid[pactCounter], tableNo, this.getSetting().A_CARID_LIST);
			var H_telDetailXMaxno = O_BillModel.getMaxDetailnoList(A_pactid[pactCounter], tableNo, this.getSetting().A_CARID_LIST, this.getSetting().A_ASP_CODE);
			var H_telDetailXAsp = O_BillModel.getTelDetailsData(A_pactid[pactCounter], tableNo, this.getSetting().A_CARID_LIST, this.getSetting().A_ASP_CODE);
			var A_outPutTelDetails = Array();
			var A_outPutTelX = Array();
			var allFileDataCnt = A_allFileData.length;
			var now = this.get_DB().getNow();
			var oldTelno = "";

			for (var allCounter = 0; allCounter < allFileDataCnt; allCounter++) //電話番号取得
			//carid変数
			//carid取得
			//tel_details_X_tb に請求がある場合
			//tel_details_X_tb 出力用配列へ格納
			//税区分が個別の場合は消費税を計算する(消費税０円は除く)
			{
				var A_lineData = split(",", rtrim(A_allFileData[allCounter]));
				var telno = O_TelModel.telnoFromTelview(A_lineData[0]);
				var caridStr = "CARID" + A_lineData[4];
				var carid = this.getSetting()[caridStr];

				if (true == (undefined !== H_telDetailXMaxno[carid][telno])) //detailno をインクリメント
					//tel_details_X_tb に請求がない場合
					{
						H_telDetailXMaxno[carid][telno]++;
					} else //detailno を初期化
					//電話が１件も登録されてないキャリアの場合は初期化する
					{
						H_telDetailXMaxno[carid][telno] = 0;

						if (undefined !== H_telX[carid] == false) {
							H_telX[carid] = Array();
						}

						if (-1 !== H_telX[carid].indexOf(telno) == false) //arid変数
							//arid取得
							//cirid変数
							//cirid取得
							//tel_X_tb 出力用配列へ格納
							//チェック用配列にも追加
							{
								var aridStr = "ARID" + A_lineData[4];
								var arid = this.getSetting()[aridStr];
								var ciridStr = "CIRID" + A_lineData[4];
								var cirid = this.getSetting()[ciridStr];
								A_outPutTelX.push({
									pactid: A_pactid[pactCounter],
									postid: rootPostidX,
									telno: telno,
									telno_view: A_lineData[0],
									userid: undefined,
									carid: carid,
									arid: arid,
									cirid: cirid,
									machine: undefined,
									color: undefined,
									planid: undefined,
									planalert: undefined,
									packetid: undefined,
									packetalert: undefined,
									pointstage: undefined,
									employeecode: undefined,
									username: undefined,
									mail: undefined,
									orderdate: undefined,
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
									date1: undefined,
									date2: undefined,
									memo: undefined,
									movepostid: undefined,
									moveteldate: undefined,
									delteldate: undefined,
									recdate: now,
									fixdate: now,
									options: undefined,
									contractdate: undefined,
									finishing_f: undefined,
									schedule_person_name: undefined,
									schedule_person_userid: undefined,
									schedule_person_postid: undefined,
									kousiflg: undefined,
									kousiptn: undefined,
									exceptflg: undefined,
									handflg: undefined,
									hand_detail_flg: undefined,
									username_kana: undefined,
									kousi_fix_flg: undefined,
									int4: undefined,
									int5: undefined,
									int6: undefined,
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
									buyselid: undefined,
									discounts: undefined,
									simcardno: undefined,
									pre_telno: undefined,
									pre_carid: undefined,
									dummy_flg: undefined,
									webreliefservice: undefined,
									recogcode: undefined,
									pbpostcode: undefined,
									cfbpostcode: undefined,
									ioecode: undefined,
									coecode: undefined,
									pbpostcode_first: undefined,
									pbpostcode_second: undefined,
									cfbpostcode_first: undefined,
									cfbpostcode_second: undefined,
									commflag: undefined
								});
								outTelXCnt++;
								H_telX[carid].push(telno);
							}
					}

				A_outPutTelDetails.push({
					pactid: A_pactid[pactCounter],
					telno: telno,
					code: A_lineData[1],
					codename: H_utiwake[carid][A_lineData[1]].name,
					charge: A_lineData[3],
					taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[carid][A_lineData[1]].taxtype],
					detailno: H_telDetailXMaxno[carid][telno],
					recdate: now,
					carid: carid,
					tdcomment: mb_convert_encoding(A_lineData[2], "UTF-8", "SJIS"),
					pretelno: undefined,
					realcnt: undefined
				});
				outTeldetailsCnt++;

				if (-1 !== this.getSetting().A_CALC_TAX.indexOf(H_utiwake[carid][A_lineData[1]].taxtype) == true && 0 != +(A_lineData[3] * this.getSetting().excise_tax)) //detailno をインクリメント
					//消費税レコード出力
					{
						H_telDetailXMaxno[carid][telno]++;
						A_outPutTelDetails.push({
							pactid: A_pactid[pactCounter],
							telno: telno,
							code: this.getSetting().TAX_CODE,
							codename: H_utiwake[carid][this.getSetting().TAX_CODE].name,
							charge: +(A_lineData[3] * this.getSetting().excise_tax),
							taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[carid][this.getSetting().TAX_CODE].taxtype],
							detailno: H_telDetailXMaxno[carid][telno],
							recdate: now,
							carid: carid,
							tdcomment: undefined,
							pretelno: undefined,
							realcnt: undefined
						});
						outTeldetailsCnt++;
					}

				if (allCounter != 0 && oldTelno != telno || allCounter == allFileDataCnt - 1) //最終行の場合
					//ASP料金明細が発生している電話の場合
					{
						if (allCounter == allFileDataCnt - 1) {
							var chkCarid = carid;
							var chkTelno = telno;
						} else {
							chkCarid = oldCarid;
							chkTelno = oldTelno;
						}

						if (true == (undefined !== H_telDetailXAsp[chkCarid][chkTelno])) //detailno を２インクリメント
							//detailnoでソート
							//明細分処理する
							//detailnoを採番しなおしたものは配列から除く
							{
								H_telDetailXMaxno[chkCarid][chkTelno] += 2;
								H_telDetailXAsp[chkCarid][chkTelno].sort();

								for (var H_meisai of Object.values(H_telDetailXAsp[chkCarid][chkTelno])) //tel_details_X_tb 出力用配列へ格納
								//detailno をインクリメント
								{
									A_outPutTelDetails.push({
										pactid: H_meisai.pactid,
										telno: chkTelno,
										code: H_meisai.code,
										codename: H_meisai.codename,
										charge: H_meisai.charge,
										taxkubun: H_meisai.taxkubun,
										detailno: H_telDetailXMaxno[chkCarid][chkTelno],
										recdate: H_meisai.recdate,
										carid: chkCarid,
										tdcomment: H_meisai.tdcomment,
										pretelno: H_meisai.prtelno,
										realcnt: H_meisai.realcnt
									});
									H_telDetailXMaxno[chkCarid][chkTelno]++;
								}

								delete H_telDetailXAsp[chkCarid][chkTelno];
							}
					}

				var oldCarid = carid;
				oldTelno = telno;
			}

			for (var aspCarid of Object.values(Object.keys(H_telDetailXAsp))) {
				for (var aspTelno of Object.values(Object.keys(H_telDetailXAsp[aspCarid]))) {
					{
						let _tmp_0 = H_telDetailXAsp[aspCarid][aspTelno];

						for (var aspDetailno in _tmp_0) //tel_details_X_tb 出力用配列へ格納
						{
							var H_meisai = _tmp_0[aspDetailno];
							A_outPutTelDetails.push({
								pactid: H_meisai.pactid,
								telno: aspTelno,
								code: H_meisai.code,
								codename: H_meisai.codename,
								charge: H_meisai.charge,
								taxkubun: H_meisai.taxkubun,
								detailno: aspDetailno,
								recdate: H_meisai.recdate,
								carid: aspCarid,
								tdcomment: H_meisai.tdcomment,
								pretelno: H_meisai.prtelno,
								realcnt: H_meisai.realcnt
							});
						}
					}
				}
			}

			A_pactDone.push(A_pactid[pactCounter]);
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(" + telX_tb + ":" + outTelXCnt + "\u4EF6," + teldetails_tb + ":" + outTeldetailsCnt + "\u4EF6)\n", 1);
			outTelXCnt = outTeldetailsCnt = 0;
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

		this.get_DB().beginTransaction();
		O_BillModel.delTelDetailsData(A_pactDone, tableNo, A_carid, this.getSetting().A_ASP_CODE);

		if (0 != A_outPutTelDetails.length) //$teldetails_tb取込失敗
			{
				var rtn = this.get_DB().pgCopyFromArray(teldetails_tb, A_outPutTelDetails);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + teldetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(teldetails_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		if (0 != A_outPutTelX.length) //tel_X_tbへデータ取込
			//$teldetails_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray(telX_tb, A_outPutTelX);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + telX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(telX_tb + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
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
		this.infoOut("\u7AEF\u672B\u8CFC\u8CB7\u30C7\u30FC\u30BF\uFF08\uFF2B\uFF23\uFF33\uFF09\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 1);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};