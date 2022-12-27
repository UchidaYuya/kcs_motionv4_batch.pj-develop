//ＫＧ通話明細データ（転送用詳細ファイル）取込処理 （Process）

import MtTableUtil from '../../MtTableUtil';
import PactModel from '../../model/PactModel';
import BillModel from '../../model/BillModel';
import KgImportTuwaView from '../../view/script/KgImportTuwaView';
import ProcessBaseBatch from '../ProcessBaseBatch';
import KgImportTuwaModel from '../../model/script/KgImportTuwaModel';
import { array_merge_recursive } from '../../array_merge_recursive';

export default class KgImportTuwaProc extends ProcessBaseBatch {
	O_View: KgImportTuwaView;
	O_Model: KgImportTuwaModel;
	PactId!: string;
	BillDate: string | undefined;
	BackUpFlg: string | undefined;
	Mode: string | undefined;
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this.getSetting().loadConfig("kg");
		this.O_View = new KgImportTuwaView();
		this.O_Model = new KgImportTuwaModel(this.get_MtScriptAmbient());
	}

	async doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.infoOut(this.getSetting().get("KG_TUWA") + "開始\n", 1);
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
// 2022cvt_015
		const dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.BillDate + this.getSetting().get("KG_DIR_TUWA") + "/";

		if (this.isDirCheck(dataDir) == false) {
			this.errorOut(1000, "通話明細データファイルディレクトリ（" + dataDir + "）がみつかりません\n", 0, "", "");
			throw process.exit(-1);
		} else //処理する契約ＩＤ配列を初期化
			{
				var A_pactid = Array();
				A_pactid = this.getPactList(dataDir, this.PactId);
				A_pactid.sort();
				var pactCnt = A_pactid.length;

				if (0 == pactCnt) {
					this.errorOut(1000, "通話明細データファイルがみつかりません\n", 0, "", "");
					throw process.exit(-1);
				}

				var A_pactDone = Array();
			}

		const O_PactModel = new PactModel();
		const H_pactid = O_PactModel.getPactIdCompNameFromPact();
		const O_BillModel = new BillModel();
		const tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		const commhistory_tb = "commhistory_" + tableNo + "_tb";
		let outCommhistCnt = 0;

		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //通話明細の掛け元番号に登録されていないものがあるかどうか false:無し、true:有り
		{
			let errFlg = false;

			if (undefined !== H_pactid[A_pactid[pactCounter]] == false) //次のpactidへスキップ
				{
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " は pact_tb に登録されていません スキップします\n", 1);
					continue;
				} else //pactid 毎の通話明細データディレクトリ設定
				{
					const dataDirPact = dataDir + A_pactid[pactCounter];
					const A_tuwaFile = this.getFileList(dataDirPact);
					const fileCnt = A_tuwaFile.length;

					if (0 == fileCnt) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の通話明細データファイルがみつかりません スキップします\n", 1);
							continue;
						}

					A_tuwaFile.sort();
					let fileErrFlg = false;
					var H_allFileData: any = Array();
					for (let fileCounter = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
					//データファイル名から東京分か大阪分かを判断する
					{
						var H_fileData: any = Array();

						if (A_tuwaFile[fileCounter].match("/^" + this.getSetting().get("FILE_HEAD_TOKYO") + "/") == true) //大阪用部門ファイル
							{
								var baseName = this.getSetting().get("FILE_HEAD_TOKYO");
							} else if (A_tuwaFile[fileCounter].match("/^" + this.getSetting().get("FILE_HEAD_OSAKA") + "/") == true) //不明ファイル
							{
								baseName = this.getSetting().get("FILE_HEAD_OSAKA");
							} else //次のpactidへスキップ
							{
								this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の通話明細データファイル" + A_tuwaFile[fileCounter] + "の種類が不明な為、スキップします\n", 1);
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
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の通話明細データファイルが不正な為、スキップします\n", 1);
							continue;
						} else //必要なデータのみ保持する
						{
							var H_editAllFileData = this.O_Model.editBillData(H_allFileData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_tuwaFile.join(",") + "\n", 0);
				}

			const H_telnoX = await this.O_Model.getTelnoBasename(A_pactid[pactCounter], tableNo, this.getSetting().get("CARID"));
			var A_tmpCommhist = Array();
			var A_outPutCommhist: any = Array();
			var A_baseName : string[]= Object.keys(H_editAllFileData);
			A_baseName.sort();

			for (let baseName of A_baseName) //総行数取得
			{
				const A_telno = Object.keys(H_editAllFileData[baseName]);
				A_telno.sort();

				for (let telno of Object.values(A_telno)) //電話番号を文字列認識させる
				{
					telno = telno + "";
					let telnoOut = "";
					let telExistFlgX = true;
					this.chkTelno(telno, H_telnoX, baseName, telExistFlgX, telnoOut);

					if (telExistFlgX) //電話番号のチェックはするが処理中のpactidのデータはインポートはしない
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の tel_" + tableNo + "_tb に電話番号 " + telno + " が存在しません\n", 1);
							errFlg = true;
							continue;
						}

					if (false == errFlg) //明細番号一覧を取得
						{
							var A_detailno = Object.keys(H_editAllFileData[baseName][telno]);
							A_detailno.sort();

							for (var detailno of Object.values(A_detailno)) //commhistory_X_tb 出力用配列へ格納
							{
								A_tmpCommhist.push({
									pactid: A_pactid[pactCounter],
									telno: telnoOut,
									type: this.getSetting().get("TUWA_TYPE"),
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
								outCommhistCnt++;
							}
						}
				}
			}

			if (false == errFlg) {
				A_outPutCommhist = A_tmpCommhist.concat(A_outPutCommhist);
				A_pactDone.push(A_pactid[pactCounter]);
				this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") インポートファイル出力完了(" + commhistory_tb + ":" + outCommhistCnt + "件)\n", 1);
			}

			outCommhistCnt = 0;
		}

		const pactDoneCnt = A_pactDone.length;

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
			{
				this.warningOut(1000, "インポート可能な通話明細データがありませんでした\n", 1);
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw process.exit(0);
			}

		if ("Y" == this.BackUpFlg) {
			const expFile = dataDir + commhistory_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("");+ ".exp";

			if (false == this.expData(commhistory_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
				throw process.exit(-1);
			}
		}

		this.get_DB().beginTransaction();

		if ("O" == this.Mode) {
			O_BillModel.delCommhistoryData(A_pactDone, tableNo, [this.getSetting().get("CARID")]);
		}

		const outCnt = A_outPutCommhist.length;

		if (0 != outCnt) //一定行数以上は分割して複数回で取込む
			{
				const roopCnt = Math.floor(outCnt / this.getSetting().get("NUM_FETCH")) + 1;

				for (let doCnt = 0; doCnt < roopCnt; doCnt++) //一定行数を取り出す
				{
					const A_doCommhist = A_outPutCommhist.slice(doCnt * this.getSetting().get("NUM_FETCH"), this.getSetting().get("NUM_FETCH"));
					const rtn = await this.get_DB().pgCopyFromArray(commhistory_tb, A_doCommhist);

					if (rtn == false) {
						this.get_DB().rollback();
						this.errorOut(1000, "\n" + commhistory_tb + " へのデータ取込に失敗しました\n", 0, "", "");
						throw process.exit(-1);// 2022cvt_009
					}
				}

				this.infoOut(commhistory_tb + " へデーターインポート完了\n", 1);
			}

		this.get_DB().commit();

		for (let pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動元ディレクトリ
		{
			const fromDir = dataDir + A_pactDone[pactDoneCounter];
			const finDir = fromDir + "/fin";
			this.mvFile(fromDir, finDir);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut(this.getSetting().get("KG_TUWA") + "終了\n", 1);
	}

	chkTelno(telno: string, H_telno: any[], baseName: any, telExistFlg: boolean, telnoOut: string) //東京データの場合
	{
		if (baseName == this.getSetting().get("FILE_HEAD_TOKYO")) //tel_(X_)tb(東京分) に電話番号があるかチェックする
			{
				if (-1 !== H_telno[this.getSetting().get("BASENAME_TOKYO")].indexOf(telno) == false) //電話番号に枝番号を付与し、再度tel_(X_)tb(東京分) に電話番号があるかチェックする
					{
						if (-1 !== H_telno[this.getSetting().get("BASENAME_TOKYO")].indexOf(telno + this.getSetting().get("LINE_BRANCH_TKY")) == false) //tel_(X_)tb へ登録する必要有り
							{
								telExistFlg = false;

								if (-1 !== H_telno[this.getSetting().get("BASENAME_OSAKA")].indexOf(telno) == false) //tel_(X_)tb(大阪分) に電話番号がある場合
									{
										telnoOut = telno;
									} else //電話番号に枝番を付与
									{
										telnoOut = telno + this.getSetting().get("LINE_BRANCH_TKY");
									}
							} else {
							telnoOut = telno + this.getSetting().get("LINE_BRANCH_TKY");
						}
					} else {
					telnoOut = telno;
				}
			} else //tel_(X_)tb(大阪分) に電話番号があるかチェックする
			{
				if (-1 !== H_telno[this.getSetting().get("BASENAME_OSAKA")].indexOf(telno) == false) //電話番号に枝番号を付与し、再度tel_(X_)tb(大阪分) に電話番号があるかチェックする
					{
						if (-1 !== H_telno[this.getSetting().get("BASENAME_OSAKA")].indexOf(telno + this.getSetting().get("LINE_BRANCH_OSK")) == false) //tel_(X_)tb へ登録する必要有り
							{
								telExistFlg = false;

								if (-1 !== H_telno[this.getSetting().get("BASENAME_TOKYO")].indexOf(telno) == false) //tel_(X_)tb(東京分) に電話番号がある場合
									{
										telnoOut = telno;
									} else //電話番号に枝番を付与
									{
										telnoOut = telno + this.getSetting().get("LINE_BRANCH_OSK");
									}
							} else {
							telnoOut = telno + this.getSetting().get("LINE_BRANCH_OSK");
						}
					} else {
					telnoOut = telno;
				}
			}
	}

};

