//
//ＫＧ請求データ（転送用内線別月報ファイル）取込処理 （Process）
//
//更新履歴：<br>
//2009/04/15 前田 聡 作成
//
//KgImportBillProc
//
//@package script
//@subpackage Process
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/04/15
//@uses MtTableUtil
//@uses PactModel
//@uses BillModel
//@uses PostModel
//@uses FuncModel
//@uses ProcessBaseBatch
//@uses KgImportBillView
//@uses KgImportBillModel
//
//
//error_reporting(E_ALL|E_STRICT);

// require("MtTableUtil.php");

// require("model/PactModel.php");

// require("model/BillModel.php");

// require("model/PostModel.php");

// require("model/FuncModel.php");

// require("process/ProcessBaseBatch.php");

// require("view/script/KgImportBillView.php");

// require("model/script/KgImportBillModel.php");

import MtTableUtil from '../../MtTableUtil';
import PactModel from '../../model/PactModel';
import BillModel from '../../model/BillModel';
import PostModel from '../../model/PostModel';
import FuncModel from '../../model/FuncModel';
import ProcessBaseBatch from '../../process/ProcessBaseBatch';
import KgImportBillView from '../../view/script/KgImportBillView';
import KgImportBillModel from '../../model/script/KgImportBillModel';

//
//コンストラクタ
//
//@author maeda
//@since 2009/04/15
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2009/04/15
//
//@param array $H_param
//@access protected
//@return void
//
//
//chkTelno
//
//@author maeda
//@since 2009/05/08
//
//@param mixed $telno：電話番号
//@param mixed $H_telno：登録済み電話番号リスト
//@param mixed $baseName：拠点識別子
//@param mixed $telAddFlg：電話登録フラグ
//@param mixed $telnoOut：出力用電話番号
//@param mixed $baseNameOut：出力用拠点名
//@access public
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2009/04/15
//
//@access public
//@return void
//
export default class KgImportBillProc extends ProcessBaseBatch {
	O_View: KgImportBillView;
	O_Model: KgImportBillModel;
	PactId: any;
	BillDate: any;
	BackUpFlg: any;
	Mode: any;
	TargetTable: any;
	constructor(H_param:any= Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.getSetting().loadConfig("kg");
		this.O_View = new KgImportBillView();
		this.O_Model = new KgImportBillModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得

	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.infoOut(this.getSetting().KG_BILL + "\u958B\u59CB\n", 1);
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + this.getSetting().KG_DIR_BILL + "/";

		if (this.isDirCheck(dataDir) == false) {
			this.errorOut(1000, "請求データファイルディレクトリ（" + dataDir + "）がみつかりません\n", 0, "", "");
			throw process.exit(-1);
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
					this.errorOut(1000, "請求データファイルがみつかりません\n", 0, "", "");
					throw process.exit(-1);
				}

				var A_pactDone = Array();
			}

		var O_PactModel = new PactModel();
		var H_pactid:string = O_PactModel.getPactIdCompNameFromPact();
		var O_BillModel = new BillModel();
		var H_utiwake = O_BillModel.getUtiwake([this.getSetting().CARID]);
		var tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		var telX_tb:string = "tel_" + tableNo + "_tb";
		var teldetails_tb:string = "tel_details_" + tableNo + "_tb";
		var outTelCnt:number  = 0;
		var outTelXCnt:number = 0;
		var outTeldetailsCnt:number = 0;

		for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		{
			if (undefined !== H_pactid[A_pactid[pactCounter]] == false) //次のpactidへスキップ
				//pactid が会社マスターに登録されている場合
				{
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " は pact_tb に登録されていません スキップします\n", 1);
					continue;
				} else //pactid 毎の請求データディレクトリ設定
				{
					var dataDirPact = dataDir + A_pactid[pactCounter];
					var A_billFile = this.getFileList(dataDirPact);
					var fileCnt:number = A_billFile.length;

					if (0 == fileCnt) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイルがみつかりません スキップします\n", 1);
							continue;
						}

					A_billFile.sort();
					var fileErrFlg = false;
					var H_allFileData = Array();

					for (var fileCounter:number = 0; fileCounter < fileCnt; fileCounter++) //ファイルデータ配列
					{
						var H_fileData:any = Array();

						if (this.getSetting().FILE_HEAD_TOKYO + "/", A_billFile[fileCounter].match("/^") == true) //大阪用部門ファイル
							{
								var baseName = this.getSetting().FILE_HEAD_TOKYO;
							} else if (this.getSetting().FILE_HEAD_OSAKA + "/", A_billFile[fileCounter].match("/^") == true) //不明ファイル
							{
								baseName = this.getSetting().FILE_HEAD_OSAKA;
							} else //次のpactidへスキップ
							{
								this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイル" + A_billFile[fileCounter] + "の種類が不明な為、スキップします\n", 1);
								continue;
							}

						H_fileData = this.O_Model.chkBillData(dataDirPact + "/" + A_billFile[fileCounter], baseName);

						if (H_fileData == false) //データファイルチェックでエラーがなかった場合
							{
								fileErrFlg = true;
							} else //複数ファイルデータをマージ
							{
								H_allFileData = H_allFileData.concat(H_fileData);
							}
					}

					if (true == fileErrFlg) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイルが不正な為、スキップします\n", 1);
							continue;
						} else //必要なデータのみ保持する
						//array(電話番号 => array(明細行番号 => DBDATA)
						{
							var H_editAllFileData = this.O_Model.editBillData(H_allFileData);
						}

					this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
				}

			var O_PostModel = new PostModel();
			var rootPostidX = O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo);
			var H_telnoX = this.O_Model.getTelnoBasename(A_pactid[pactCounter], tableNo, this.getSetting().CARID);
			var aspFlg:boolean = false;
			var O_FuncModel = new FuncModel();
			var H_pactFunc = O_FuncModel.getPactFunc(A_pactid[pactCounter], undefined, false);

			if (-1 !== Object.keys(H_pactFunc).indexOf("fnc_asp") == true) //ＡＳＰ料金を取得
				{
					aspFlg = true;
					var aspCharge = O_BillModel.getAspCharge(A_pactid[pactCounter], this.getSetting().CARID);

					if ("" == aspCharge) //次のpactidへスキップ
						{
							this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のＡＳＰ利用料が設定されていない為、スキップします\n", 1);
							continue;
						}

					var asxCharge:any = +(aspCharge * this.getSetting().excise_tax);
				}

			var A_outPutTelDetails:any = Array();
			var A_outPutTelX:any = Array();

			if ("N" == this.TargetTable) //現在テーブルより電話番号マスターを取得する array(basename(予備項目１) => array(telno))
				//電話番号管理テーブル
				{
					var H_telno:any = this.O_Model.getTelnoBasename(A_pactid[pactCounter], undefined, this.getSetting().CARID);
					var A_outPutTel:any = Array();
				}

			var now = this.get_DB().getNow();
			var A_baseName = Object.keys(H_editAllFileData);
			A_baseName.sort();

			for (var baseName of Object.values(A_baseName)) //総行数取得
			{
				var allFileDataCnt = H_allFileData[baseName].length;
				var A_telno = Object.keys(H_editAllFileData[baseName]);
				A_telno.sort();

				for (var telno of Object.values(A_telno)) //電話番号を文字列認識させる

				{
					var telno = telno + "";
					var telnoOut = "";
					var telAddFlgX = false;
					var baseNameOut = "null";
					this.chkTelno(telno, H_telnoX, baseName, telAddFlgX, telnoOut, baseNameOut);

					if ("N" == this.TargetTable) //tel_tb に登録する必要があるかどうか false：無、true：有
						//電話番号の存在チェック
						{
							var telAddFlg:any = false;
							this.chkTelno(telno, H_telno, baseName, telAddFlg, telnoOut, baseNameOut);
						}

					var A_detailno_tmp = Object.keys(H_editAllFileData[baseName][telno]);
					var A_detailno = A_detailno_tmp.map(function(item) {
						return parseInt(item, 10);
					});
					
					A_detailno.sort();
					var detailno = 0;
					for ( detailno of Object.values(A_detailno)) //内訳コードマスターに存在しないコードがあった場合は処理中止
					{
						if (undefined !== H_utiwake[this.getSetting().CARID][H_editAllFileData[baseName][telno][detailno].code] == false) {
							this.errorOut(1000, "登録されていない内訳コード[" + H_editAllFileData[baseName][telno][detailno].code + "]が見つかりました。\n内訳コードを更新してから、再度処理を行ってください。\n", 0, "", "");
							throw process.exit(-1);
						}

						A_outPutTelDetails.push({
							pactid: A_pactid[pactCounter],
							telno: telnoOut,
							code: H_editAllFileData[baseName][telno][detailno].code,
							codename: H_utiwake[this.getSetting().CARID][H_editAllFileData[baseName][telno][detailno].code].name,
							charge: H_editAllFileData[baseName][telno][detailno].charge,
							taxkubun: this.getSetting().A_TAX_KUBUN[H_utiwake[this.getSetting().CARID][H_editAllFileData[baseName][telno][detailno].code].taxtype],
							detailno: detailno,
							recdate: now,
							carid: this.getSetting().CARID,
							tdcomment: undefined,
							prtelno: undefined,
							realcnt: undefined
						});
						outTeldetailsCnt++;
					}

					if (telAddFlgX) //tel_X_tb 出力用配列へ格納
						//フラグを戻す
						{
							var H_data = {
								pactid: A_pactid[pactCounter],
								postid: rootPostidX,
								telno: telnoOut,
								telno_view: telnoOut,
								carid: this.getSetting().CARID,
								arid: this.getSetting().ARID,
								cirid: this.getSetting().CIRID,
								text1: baseNameOut,
								recdate: now,
								fixdate: now
							};
							this.O_Model.setOutPut(telX_tb, A_outPutTelX, H_data);
							outTelXCnt++;
							telAddFlgX = false;
						}

					if ("N" == this.TargetTable && telAddFlg) //tel_tb 出力用配列へ格納
						//フラグを戻す
						{
							H_data = {
								pactid: A_pactid[pactCounter],
								postid: rootPostidX,
								telno: telnoOut,
								telno_view: telnoOut,
								carid: this.getSetting().CARID,
								arid: this.getSetting().ARID,
								cirid: this.getSetting().CIRID,
								text1: baseNameOut,
								recdate: now,
								fixdate: now
							};
							this.O_Model.setOutPut("tel_tb", A_outPutTel, H_data);
							outTelCnt++;
							telAddFlg = false;
						}

					if (true == aspFlg) //合計用に２つ進める
						//ASP利用料を出力
						{
							detailno++;
							detailno++;
							A_outPutTelDetails.push({
								pactid: A_pactid[pactCounter],
								telno: telnoOut,
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
									A_outPutTelDetails.push({
										pactid: A_pactid[pactCounter],
										telno: telnoOut,
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
			}

			A_pactDone.push(A_pactid[pactCounter]);
			this.infoOut(H_pactid[A_pactid[pactCounter]] + " (pactid=" + A_pactid[pactCounter] + ") インポートファイル出力完了(tel_tb:" + outTelCnt + "件," + telX_tb + ":" + outTelXCnt + "件," + teldetails_tb + ":" + outTeldetailsCnt + "件)\n", 1);
			outTelCnt = outTelXCnt = outTeldetailsCnt = 0;
		}

		var pactDoneCnt = A_pactDone.length;

		if (0 == pactDoneCnt) //スクリプトの二重起動防止ロック解除
			//終了
			{
				this.warningOut(1000, "インポート可能な請求情報データがありませんでした\n", 1);
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw process.exit(0);
			}

		if ("Y" == this.BackUpFlg) {
			var nwdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("");
			var expFile = dataDir + teldetails_tb + nwdate + ".exp";

			if (false == this.expData(teldetails_tb, expFile, this.getSetting().NUM_FETCH)) {
				throw process.exit(-1);
			}
		}

		this.get_DB().beginTransaction();

		if ("O" == this.Mode) {
			O_BillModel.delTelDetailsData(A_pactDone, tableNo, [this.getSetting().CARID]);
		}

		if (0 != A_outPutTelDetails.length) //tel_details_X_tb取込失敗
			{
				var rtn = this.get_DB().pgCopyFromArray(teldetails_tb, A_outPutTelDetails);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + teldetails_tb + "へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);
				} else {
					this.infoOut(teldetails_tb + " へデーターインポート完了\n", 1);
				}
			}

		if (0 != A_outPutTelX.length) //tel_X_tbへデータ取込
			//tel_X_tb取込失敗
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
		this.infoOut(this.getSetting().KG_BILL + "終了\n", 1);
	}

	chkTelno(telno, H_telno, baseName, telAddFlg, telnoOut, baseNameOut) //東京データの場合
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
							{
								telAddFlg = true;
								baseNameOut = this.getSetting().BASENAME_TOKYO;

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
					{
						if (-1 !== H_telno[this.getSetting().BASENAME_OSAKA].indexOf(telno + this.getSetting().LINE_BRANCH_OSK) == false) //tel_(X_)tb へ登録する必要有り
							{
								telAddFlg = true;
								baseNameOut = this.getSetting().BASENAME_OSAKA;

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

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};