import MtTableUtil from "../../MtTableUtil";
import PactModel from "../../model/PactModel";
import BillModel from "../../model/BillModel";
import PostModel from "../../model/PostModel";
import TelModel from "../../model/TelModel"
import ProcessBaseBatch from "../ProcessBaseBatch";
import SuoImportTanmatsuView from "../../view/script/SuoImportTanmatsuView";
import SuoImportTanmatsuModel from "../../model/script/SuoImportTanmatsuModel";
import * as Encoding from "encoding-japanese";

export default class SuoImportTanmatsuProc extends ProcessBaseBatch {
	O_View: SuoImportTanmatsuView;
	O_Model: SuoImportTanmatsuModel;
	PactId: string = "";
	BillDate: string = "";
	BackUpFlg: string = "";

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param); MtTableUtil
		this.getSetting().loadConfig("tanmatsu_kcs");
		this.O_View = new SuoImportTanmatsuView();
		this.O_Model = new SuoImportTanmatsuModel(this.get_MtScriptAmbient());
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
	//ASP料金関連の明細を再度入れなおす前に削除する
	//tel_details_X_tbへデータ取込
	//処理が完了したファイルを移動
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		var A_outPutTelDetails = Array();
		var A_outPutTelX = Array();
		var A_allFileData = Array();
		var A_pactid = Array();
		var pactCnt = A_pactid.length;
		var A_pactDone = Array();
		
		this.infoOut("端末購買データ（ＫＣＳ）インポート開始\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
// 2022cvt_015
		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.BillDate + this.getSetting().get("TANMATSU_KCS_DIR") + "/";

		if (this.isDirCheck(dataDir) == false) {
			this.errorOut(1000, this.getSetting().get("TANMATSU_KCS") + "請求データファイルディレクトリ（" + dataDir + "）がみつかりません\n", 0, "", "");
			process.exit(-1);// 2022cvt_009
		} else //処理する契約ＩＤ配列を初期化
			//処理する契約ＩＤを取得する
			//pactidでソート
			//処理する契約ＩＤ数
			//処理する契約ＩＤが１件もない場合（スクリプト終了）
			{
// 2022cvt_015
				A_pactid = Array();
				A_pactid = this.getPactList(dataDir, this.PactId);
				A_pactid.sort();
// 2022cvt_015
				pactCnt = A_pactid.length;

				if (0 == pactCnt) {
					this.errorOut(1000, "請求データファイルがみつかりません\n", 0, "", "");
					process.exit(-1);// 2022cvt_009
				}

// 2022cvt_015
				A_pactDone = Array();
			}

// 2022cvt_015
		var O_PactModel = new PactModel();
// 2022cvt_015
		var H_pactid = O_PactModel.getPactIdCompNameFromPact();
// 2022cvt_015
		var O_BillModel = new BillModel();
// 2022cvt_015
		var A_carid = [this.getSetting().get("car_docomo"), this.getSetting().get("car_willcom"), this.getSetting().get("car_au"), this.getSetting().get("car_softbank")];
// 2022cvt_015
		var H_utiwake = O_BillModel.getUtiwake(A_carid);
// 2022cvt_015
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
// 2022cvt_015
		var telX_tb = "tel_" + tableNo + "_tb";
// 2022cvt_015
		var teldetails_tb = "tel_details_" + tableNo + "_tb";
// 2022cvt_015
		var outTelXCnt = 0;
		var outTeldetailsCnt = 0;

// 2022cvt_015
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
// 2022cvt_015
			var aspFlg = false;

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
					A_allFileData = Array();

// 2022cvt_015
					for (var fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
					//ファイル名から請求年月とpactidを取得するための準備
					//ファイル名から請求年月をチェック
					//データファイルチェックでエラーがあった場合（カンマの数、必須項目、キャリア番号）
					{
// 2022cvt_015
						var A_fileData = Array();
// 2022cvt_020
// 2022cvt_015
						var A_fileNameEle = A_billFile[fileCounter].split("-", A_billFile[fileCounter].replace(".csv", "", A_billFile[fileCounter].toLowerCase()));

						if (A_fileNameEle[0] != this.BillDate) {
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイル " + A_billFile[fileCounter] + " の請求年月が不正です\n", 1);
							fileErrFlg = true;
						}

						if (A_fileNameEle[1] != A_pactid[pactCounter]) {
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイル " + A_billFile[fileCounter] + " のpactidが不正です\n", 1);
							fileErrFlg = true;
						}

						A_fileData = this.O_Model.chkBillData(dataDirPact + "/" + A_billFile[fileCounter]);

						if (!A_fileData) //データファイルチェックでエラーがなかった場合
							{
								fileErrFlg = true;
							} else //複数ファイルデータをマージ
							{
								A_allFileData = A_allFileData.concat(A_allFileData, A_fileData);
							}
					}

					if (true == fileErrFlg) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイルが不正な為、スキップします\n", 1);
							continue;
						} else //請求データを電話番号、コード順 でソート
						{
							A_allFileData.sort();
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
			var H_telX = O_TelModel.getCaridTelno(A_pactid[pactCounter], tableNo, this.getSetting().A_CARID_LIST);
// 2022cvt_015
			var H_telDetailXMaxno = O_BillModel.getMaxDetailnoList(A_pactid[pactCounter], tableNo, this.getSetting().A_CARID_LIST, this.getSetting().get("A_ASP_CODE"));
// 2022cvt_015
			var H_telDetailXAsp = O_BillModel.getTelDetailsData(A_pactid[pactCounter], tableNo, this.getSetting().A_CARID_LIST, this.getSetting().get("A_ASP_CODE"));
// 2022cvt_015
			A_outPutTelDetails = Array();
// 2022cvt_015
			A_outPutTelX = Array();
// 2022cvt_015
			var allFileDataCnt = A_allFileData.length;
// 2022cvt_015
			var now = this.get_DB().getNow();
// 2022cvt_015
			var oldTelno = "";

// 2022cvt_015
			for (var allCounter = 0; allCounter < allFileDataCnt; allCounter++) //電話番号取得
			//carid変数
			//carid取得
			//tel_details_X_tb に請求がある場合
			//tel_details_X_tb 出力用配列へ格納
			//税区分が個別の場合は消費税を計算する(消費税０円は除く)
			{
// 2022cvt_015
				var A_lineData = A_allFileData[allCounter].split(",", A_allFileData[allCounter].replace(A_allFileData[allCounter]));
// 2022cvt_015
				var telno = O_TelModel.telnoFromTelview(A_lineData[0]);
// 2022cvt_015
				var caridStr = "CARID" + A_lineData[4];
// 2022cvt_015
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
// 2022cvt_015
								var aridStr = "ARID" + A_lineData[4];
// 2022cvt_015
								var arid = this.getSetting()[aridStr];
// 2022cvt_015
								var ciridStr = "CIRID" + A_lineData[4];
// 2022cvt_015
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
// 2022cvt_016
					taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[carid][A_lineData[1]].taxtype],
					detailno: H_telDetailXMaxno[carid][telno],
					recdate: now,
					carid: carid,
					// tdcomment: mb_convert_encoding(A_lineData[2], "UTF-8", "SJIS"),
					tdcomment: Encoding.convert(A_lineData[2], {
						from: "SJIS",
						to: "UNICODE",
						type: "string"
				    }),
					// const iconv = new Iconv("SJIS-WIN" , "UTF8"),
					// const after = iconv.convert(A_lineData[2]),
					pretelno: undefined,
					realcnt: undefined
				});
				outTeldetailsCnt++;

// 2022cvt_016
				if (-1 !== this.getSetting().get("A_CALC_TAX").indexOf(H_utiwake[carid][A_lineData[1]].taxtype) == true && 0 != +(A_lineData[3] * this.getSetting().get("excise_tax"))) //detailno をインクリメント
					//消費税レコード出力
					{
						H_telDetailXMaxno[carid][telno]++;
						A_outPutTelDetails.push({
							pactid: A_pactid[pactCounter],
							telno: telno,
							code: this.getSetting().get("TAX_CODE"),
							codename: H_utiwake[carid][this.getSetting().get("TAX_CODE")].name,
							charge: +(A_lineData[3] * this.getSetting().get("excise_tax")),
// 2022cvt_016
							taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[carid][this.getSetting().get("TAX_CODE")].taxtype],
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
// 2022cvt_015
							var chkCarid = carid;
// 2022cvt_015
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

// 2022cvt_015
								for (var H_meisai of (H_telDetailXAsp[chkCarid][chkTelno])) //tel_details_X_tb 出力用配列へ格納
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

// 2022cvt_015
				var oldCarid = carid;
				oldTelno = telno;
			}

// 2022cvt_015
			for (var aspCarid of (Object.keys(H_telDetailXAsp))) {
// 2022cvt_015
				for (var aspTelno of (Object.keys(H_telDetailXAsp[parseInt(aspCarid)]))) {
					{
						let _tmp_0 = H_telDetailXAsp[parseInt(aspCarid)][aspTelno];

// 2022cvt_015
						for (var aspDetailno in _tmp_0) //tel_details_X_tb 出力用配列へ格納
						{
// 2022cvt_015
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
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") インポートファイル出力完了(" + telX_tb + ":" + outTelXCnt +  "件," + teldetails_tb + ":" + outTeldetailsCnt + "件)\n", 1);
			outTelXCnt = 0;
			outTeldetailsCnt = 0;
	}

// 2022cvt_015
		var pactDoneCnt = A_pactDone.length;

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
			//終了
			{
				this.warningOut(1000, "インポート可能な請求情報データがありませんでした\n", 1);
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				process.exit(0);// 2022cvt_009
			}

		if ("Y" == this.BackUpFlg) {
// 2022cvt_015
			var expFile = dataDir + teldetails_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + ".exp";

			if (false == this.expData(teldetails_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
				process.exit(-1);// 2022cvt_009
			}
		}

		this.get_DB().beginTransaction();
		O_BillModel.delTelDetailsData(A_pactDone, tableNo, A_carid, this.getSetting().get("A_ASP_CODE"));

		if (0 != A_outPutTelDetails.length) //$teldetails_tb取込失敗
			{
// 2022cvt_015
				var rtn = this.get_DB().pgCopyFromArray(teldetails_tb, A_outPutTelDetails);

				if (await rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + teldetails_tb + " へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);// 2022cvt_009
				} else {
					this.infoOut(teldetails_tb + " へデーターインポート完了\n", 1);
				}
			}

		if (0 != A_outPutTelX.length) //tel_X_tbへデータ取込
			//$teldetails_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray(telX_tb, A_outPutTelX);

				if (await rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + telX_tb + " へのデータ取込に失敗しました\n", 0, "", "");
					process.exit(-1);// 2022cvt_009
				} else {
					this.infoOut(telX_tb + " へデーターインポート完了\n", 1);
				}
			}

		this.get_DB().commit();

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
		this.infoOut("端末購買データ（ＫＣＳ）インポート終了\n", 1);
	}

	//	__destruct() //親のデストラクタを必ず呼ぶ
	//	{
	//		super.__destruct();
	//	}

};
