//ＳＵＯ ソフトバンクテレコム請求・通話明細データ取込処理 （Process）


import BillModel from "../../model/BillModel";
import PactModel from "../../model/PactModel";
import PostModel from "../../model/PostModel";
import FuncModel from "../../model/FuncModel";
import MtTableUtil from "../../MtTableUtil";
import ProcessBaseBatch from "../ProcessBaseBatch";
import { SuoImportSoftTeleModel } from "../../model/script/SuoImportSoftTeleModel";
import { SuoImportSoftTeleView } from "../../view/script/SuoImportSoftTeleView";
import TelModel from "../../model/TelModel";

export default class SuoImportSoftTeleProc extends ProcessBaseBatch {
	O_View: SuoImportSoftTeleView;
	O_Model: SuoImportSoftTeleModel;
	PactId!: string;
	BillDate: string | undefined;
	BackUpFlg: string | undefined;
	Mode: string | undefined;
	TargetTable: string | undefined;
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.getSetting().loadConfig("sbtelecom");
		this.O_View = new SuoImportSoftTeleView();
		this.O_Model = new SuoImportSoftTeleModel(this.get_MtScriptAmbient());
	}

	async doExecute(H_param: {} | any[] = Array()) //メモリが足りないので・・
	{
		// ini_set("max_execution_time", 6000);
		// ini_set("memory_limit", "3000M");
		this.infoOut(this.getSetting().get("SBTELECOM") + "開始\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");
		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.BillDate + this.getSetting().get("SBTELECOM_DIR") + "/";

		if (this.isDirCheck(dataDir) == false) {
			this.errorOut(1000, this.getSetting().get("SBTELECOM") + "データファイルディレクトリ（" + dataDir + "）がみつかりません\n", 0, "", "");
			throw process.exit(-1);
		} else 
			{
				var A_pactid = Array();
				A_pactid = this.getPactList(dataDir, this.PactId);
				A_pactid.sort();
				var pactCnt = A_pactid.length;

				if (0 == pactCnt) {
					this.errorOut(1000, "データファイルがみつかりません\n", 0, "", "");
					throw process.exit(-1);
				}

				var A_pactDone = Array();
			}

		var O_PactModel = new PactModel();
		var H_pactid = O_PactModel.getPactIdCompNameFromPact();
		var O_BillModel = new BillModel();
		var H_utiwake = O_BillModel.getUtiwake([this.getSetting().get("CARID")]);
		var tableNo: any = MtTableUtil.getTableNo(this.BillDate, false);
		var telX_tb = "tel_" + tableNo + "_tb";
		var teldetails_tb = "tel_details_" + tableNo + "_tb";
		var commhistory_tb = "commhistory_" + tableNo + "_tb";
		var outCommhistoryCnt = 0;
		var outTeldetailsCnt = outCommhistoryCnt;
		var outTelXCnt = outTeldetailsCnt;
		var outTelCnt = outTelXCnt;
		let A_outPutTelDetails = Array();
		let A_outPutCommhistory = Array();
		let A_outPutTelX = Array();

		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		{
			if (undefined !== H_pactid[A_pactid[pactCounter]] == false) //次のpactidへスキップ
				//pactid が会社マスターに登録されている場合
				{
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " は pact_tb に登録されていません スキップします\n", 1);
					continue;
				} else //pactid 毎のデータディレクトリ設定
				{
					var dataDirPact = dataDir + A_pactid[pactCounter];
					var A_billFile = this.getFileList(dataDirPact);
					var fileCnt = A_billFile.length;

					if (0 == fileCnt) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のデータファイルがみつかりません スキップします\n", 1);
							continue;
						}

					A_billFile.sort();
					var fileErrFlg = false;
					var A_allSumData = Array();
					var A_allBillData = Array();
					var A_allTuwaData = Array();
					var H_dummyData: any = O_BillModel.getDummy(A_pactid[pactCounter], this.getSetting().get("CARID"), "", tableNo);

					if (H_dummyData.length == 0) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のダミー電話番号が設定されていません スキップします\n", 1);
							continue;
						}

					for (var fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイル名から請求年月とpactidを取得するための準備
					{
						var A_sumData = Array();
						var A_billData = Array();
						var A_tuwaData = Array();
						var A_fileNameEle =  A_billFile[fileCounter].toLowerCase().replace(".csv", "").split("-");

						if (A_fileNameEle[0] != this.BillDate) {
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + "のデータファイル" + A_billFile[fileCounter] + " の請求年月が不正です\n", 1);
							fileErrFlg = true;
						}

						if (A_fileNameEle[1] != A_pactid[pactCounter]) {
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のデータファイル " + A_billFile[fileCounter] + " のpactidが不正です\n", 1);
							fileErrFlg = true;
						}

						var rtnCode = this.O_Model.chkBillData(dataDirPact + "/" + A_billFile[fileCounter], A_sumData, A_billData, A_tuwaData);

						if (rtnCode == false) //データファイルチェックでエラーがなかった場合
							{
								fileErrFlg = true;
							} else //複数ファイルデータをマージ
							{
								A_allSumData = A_allSumData.concat(A_sumData);
								A_allBillData = A_allBillData.concat(A_billData);
								A_allTuwaData = A_allTuwaData.concat(A_tuwaData);
							}
					}

					if (true == fileErrFlg) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のデータファイルが不正な為、スキップします\n", 1);
							continue;
						} else //必要なデータのみ保持する
						{
							var billCharge = this.O_Model.editSumData(A_allSumData);
							var H_editAllBillData = this.O_Model.editBillData(A_allBillData);
							var H_editAllTuwaData = this.O_Model.editTuwaData(A_allTuwaData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}

			var O_PostModel = new PostModel();
			var rootPostidX = O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo);
			var O_TelModel = new TelModel();
			var H_telnoX = O_TelModel.getCaridTelno(A_pactid[pactCounter], tableNo, [this.getSetting().get("CARID")]);
			var aspFlg = false;
			var O_FuncModel = new FuncModel();
			var H_pactFunc = O_FuncModel.getPactFunc(A_pactid[pactCounter], undefined, false);
			let asxCharge;
			if (-1 !== Object.keys(H_pactFunc).indexOf("fnc_asp") == true) //ＡＳＰ料金を取得
				{
					aspFlg = true;
					var aspCharge = await O_BillModel.getAspCharge(A_pactid[pactCounter], this.getSetting().get("CARID"));

					if ("" == aspCharge) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のＡＳＰ利用料が設定されていない為、スキップします\n", 1);
							continue;
						}

					asxCharge = +(aspCharge * this.getSetting().get("excise_tax"));
				}

		
			let H_telno;
			if ("N" == this.TargetTable) 
				{
					H_telno = await O_TelModel.getCaridTelno(A_pactid[pactCounter], undefined, [this.getSetting().get("CARID")]);
					var A_outPutTel: any = Array();
				}

			var now = this.get_DB().getNow();
			var sumCharge = 0;
			var sumChargeInt = 0;
			var A_telno = Object.keys(H_editAllBillData);
			A_telno.sort();

			for (var telno of A_telno) 
			{
				var telno = telno + "";
				var telAddFlgX = false;

				if (-1 !== H_telnoX[this.getSetting().get("CARID")].indexOf(telno) == false) //tel_X_tb へ登録する必要有り
					{
						telAddFlgX = true;
					}

				if ("N" == this.TargetTable) //tel_tb に登録する必要があるかどうか false：無、true：有
					{
						var telAddFlg;

						if (-1 !== H_telno[this.getSetting().get("CARID")].indexOf(telno) == false) //tel_tb へ登録する必要有り
							{
								telAddFlg = true;
							}
					}

				var A_detailno = Object.keys(H_editAllBillData[telno]);
				A_detailno.sort();

				for (let detailno of A_detailno) //内訳コードマスターに存在しないコードがあった場合は処理中止
				{
					if (undefined !== H_utiwake[this.getSetting().get("CARID")][H_editAllBillData[telno][detailno].code] == false) {
						this.errorOut(1000, "登録されていない内訳コード[" + H_editAllBillData[telno][detailno].code + "]が見つかりました。\n内訳コードを更新してから、再度処理を行ってください。\n", 0, "", "");
						throw process.exit(-1);
					}

					A_outPutTelDetails.push({
						pactid: A_pactid[pactCounter],
						telno: telno,
						code: H_editAllBillData[telno][detailno].code,
						codename: H_utiwake[this.getSetting().get("CARID")][H_editAllBillData[telno][detailno].code].name,
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
					{
						var H_data = {
							pactid: A_pactid[pactCounter],
							postid: rootPostidX,
							telno: telno,
							userid: undefined,
							telno_view: H_editAllBillData[telno][0].telnoview,
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
					{
						// detailno++;
						// detailno++;
						A_outPutTelDetails.push({
							pactid: A_pactid[pactCounter],
							telno: telno,
							code: this.getSetting().UTIWAKE_ASP_CODE,
							codename: H_utiwake[this.getSetting().get("CARID")][this.getSetting().UTIWAKE_ASP_CODE].name,
							charge: aspCharge,
							taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().get("CARID")][this.getSetting().UTIWAKE_ASP_CODE].taxtype],
							detailno: "detailno",
							recdate: now,
							carid: this.getSetting().get("CARID"),
							tdcomment: undefined,
							prtelno: undefined,
							realcnt: undefined
						});
						outTeldetailsCnt++;

						if (0 != asxCharge) //ASP利用料消費税を出力
							{
								// detailno++;
								A_outPutTelDetails.push({
									pactid: A_pactid[pactCounter],
									telno: telno,
									code: this.getSetting().UTIWAKE_ASX_CODE,
									codename: H_utiwake[this.getSetting().get("CARID")][this.getSetting().UTIWAKE_ASX_CODE].name,
									charge: asxCharge,
									taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().get("CARID")][this.getSetting().UTIWAKE_ASX_CODE].taxtype],
									detailno: "detailno",
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
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + "\n" + (billCharge - +(sumCharge / 100)) + " 円金額が一致しません。調整額レコードに加算します\n", 1);
				}

			if (+(sumCharge / 100 - sumChargeInt != 0)) //tel_details_X_tb 出力用配列へ格納
				{
					let detailno = 0;
					A_outPutTelDetails.push({
						pactid: A_pactid[pactCounter],
						telno: H_dummyData[0].telno,
						code: this.getSetting().get("UTIWAKE_TYOUSEI_CODE"),
						codename: H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_TYOUSEI_CODE")].name,
						charge: +(sumCharge / 100 - sumChargeInt + (billCharge - +(sumCharge / 100))),
						taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_TYOUSEI_CODE")].taxtype],
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

			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") 請求明細ファイル出力完了(tel_tb:" + outTelCnt + "件," + telX_tb + ":" + outTelXCnt + "件," + teldetails_tb + ":" + outTeldetailsCnt + "件)\n", 1);
			A_telno = Object.keys(H_editAllTuwaData);
			A_telno.sort();

			for (var telno of A_telno) //電話番号を文字列認識させる
			{
				telno = telno + "";
				A_detailno = Object.keys(H_editAllTuwaData[telno]);
				A_detailno.sort();

				for (let detailno of A_detailno) //commhistory_X_tb 出力用配列へ格納
				{
					A_outPutCommhistory.push({
						pactid: A_pactid[pactCounter],
						telno: telno,
						type: this.getSetting().get("TUWA_TYPE"),
						date: H_editAllTuwaData[telno][detailno].date,
						totelno: H_editAllTuwaData[telno][detailno].totelno,
						toplace: undefined,
						fromplace: undefined,
						time: H_editAllTuwaData[telno][detailno].time,
						charge: H_editAllTuwaData[telno][detailno].charge,
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

			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") 通話明細ファイル出力完了(" + commhistory_tb + ":" + outCommhistoryCnt + "件)\n", 1);
			A_pactDone.push(A_pactid[pactCounter]);
			outTelCnt = outTelXCnt = outTeldetailsCnt = outCommhistoryCnt = 0;
		}

		var pactDoneCnt = A_pactDone.length;

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
			{
				this.warningOut(1000, "インポート可能なデータがありませんでした\n", 1);
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw process.exit(0);
			}

		if ("Y" == this.BackUpFlg) //請求明細バックアップファイル名
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
			{
				O_BillModel.delTelDetailsData(A_pactDone, tableNo, [this.getSetting().get("CARID")]);
				O_BillModel.delCommhistoryData(A_pactDone, tableNo, [this.getSetting().get("CARID")]);
			}

		if (0 != A_outPutTelDetails.length) //tel_details_X_tb取込失敗
			{
				var rtn = this.get_DB().pgCopyFromArray(teldetails_tb, A_outPutTelDetails);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + teldetails_tb + " へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);
				} else {
					this.infoOut(teldetails_tb + " へデーターインポート完了\n", 1);
				}
			}

		if (0 != A_outPutTelX.length) //tel_X_tbへデータ取込
			{
				rtn = this.get_DB().pgCopyFromArray(telX_tb, A_outPutTelX);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + telX_tb + " へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);
				} else {
					this.infoOut(telX_tb + " へデーターインポート完了\n", 1);
				}
			}

		if (undefined !== A_outPutTel == true && 0 != A_outPutTel.length) //tel_tbへデータ取込
			//tel_tb取込失敗
			{
				rtn = this.get_DB().pgCopyFromArray("tel_tb", A_outPutTel);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\ntel_tb へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);
				} else {
					this.infoOut("tel_tb へデーターインポート完了\n", 1);
				}
			}

		if (undefined !== A_outPutCommhistory == true && 0 != A_outPutCommhistory.length) //出力件数取得
			{
				var outCnt = A_outPutCommhistory.length;
				var roopCnt = Math.floor(outCnt / this.getSetting().get("NUM_FETCH")) + 1;

				for (var doCnt = 0; doCnt < roopCnt; doCnt++) //一定行数を取り出す
				{
					var A_doCommhistory = A_outPutCommhistory.slice(doCnt * this.getSetting().get("NUM_FETCH"), this.getSetting().get("NUM_FETCH"));
					rtn = this.get_DB().pgCopyFromArray(commhistory_tb, A_doCommhistory);

					if (rtn == false) {
						this.get_DB().rollback();
						this.errorOut(1000, "\n" + commhistory_tb + " へのデータ取込に失敗しました\n", 0, "", "");
						throw process.exit(-1);
					}
				}

				this.infoOut(commhistory_tb + " へデーターインポート完了\n", 1);
			}

		this.get_DB().commit();

		for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動元ディレクトリ
		{
			var fromDir = dataDir + A_pactDone[pactDoneCounter];
			var finDir = fromDir + "/fin";
			this.mvFile(fromDir, finDir);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut(this.getSetting().get("SBTELECOM") + "終了\n", 1);
	}
};