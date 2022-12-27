//ＫＧ請求データ（転送用内線別月報ファイル）取込処理 （Process）

import MtTableUtil from '../../MtTableUtil';
import PactModel from '../../model/PactModel';
import BillModel from '../../model/BillModel';
import PostModel from '../../model/PostModel';
import FuncModel from '../../model/FuncModel';
import ProcessBaseBatch from '../../process/ProcessBaseBatch';
import KgImportBillView from '../../view/script/KgImportBillView';
import KgImportBillModel from '../../model/script/KgImportBillModel';

export default class KgImportBillProc extends ProcessBaseBatch {
	O_View: KgImportBillView;
	O_Model: KgImportBillModel;
	PactId!: string;
	BillDate: string | undefined;
	BackUpFlg: string | undefined;
	Mode: string | undefined;
	TargetTable: string | undefined;

	constructor(H_param:any= Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this.getSetting().loadConfig("kg");
		this.O_View = new KgImportBillView();
		this.O_Model = new KgImportBillModel(this.get_MtScriptAmbient());
	}

	async doExecute(H_param: any = Array()) //固有ログディレクトリの作成取得

	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.infoOut(this.getSetting().get("KG_BILL") + "開始\n", 1);
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");
		const dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.BillDate + this.getSetting().get("KG_DIR_BILL") + "/";
	
		if (this.isDirCheck(dataDir) == false) {
			this.errorOut(1000, "請求データファイルディレクトリ（" + dataDir + "）がみつかりません\n", 0, "", "");
			throw process.exit(-1);
		} else //処理する契約ＩＤ配列を初期化
			{
				var A_pactid = Array();

				// 処理する契約ＩＤを取得する
				A_pactid = this.getPactList(dataDir, this.PactId);
				
				A_pactid.sort();

				// 処理する契約ＩＤ数
				var pactCnt = A_pactid.length;

				if (0 == pactCnt) {
					this.errorOut(1000, "請求データファイルがみつかりません\n", 0, "", "");
					throw process.exit(-1);
				}

				// 処理が終了した pactid を格納するための配列を初期化
				var A_pactDone = Array();
			}

		const O_PactModel = new PactModel();
		// 会社マスターを作成
		let H_pactid = await O_PactModel.getPactIdCompNameFromPact();
		H_pactid = {
			'0': { pactid: 0, compname: '管理者・販売店用' },
			'3': { pactid: 3, compname: '株式会社ＮＨＫグローバルメディアサービス' },
			'4': { pactid: 4, compname: '兼松コミュニケーションズ株式会社' },
			'5': { pactid: 5, compname: '兼松株式会社' },
			'6': { pactid: 6, compname: '兼松株式会社（モバイル）' }
		}

		const O_BillModel = new BillModel();
		// 内訳種別マスター情報を取得
		const H_utiwake = await O_BillModel.getUtiwake([this.getSetting().get("CARID")]);
		console.log("check H_utiwake >>>",H_utiwake);
		
		// テーブル名設定
		const tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		const telX_tb:string = "tel_" + tableNo + "_tb";
		const teldetails_tb:string = "tel_details_" + tableNo + "_tb";

		// 出力件数カウント
		let outTeldetailsCnt:number = 0;
		let outTelXCnt:number = outTeldetailsCnt;
		let outTelCnt:number  = outTelXCnt;
			
		// pactid 毎に処理する
		for (let pactCounter = 0; pactCounter < pactCnt; pactCounter++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
		{
			// pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
			if (!H_pactid[A_pactid[pactCounter]])
			{
				this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " は pact_tb に登録されていません スキップします\n", 1);
				continue;
			} else {
				// pactid 毎の請求データディレクトリ設定	
				const dataDirPact = dataDir + A_pactid[pactCounter];
				// 請求データファイル名を取得
				const A_billFile = this.getFileList(dataDirPact);
				// 処理するファイル数
				const fileCnt:number = A_billFile.length;
				// 請求データファイルがなかった場合（スクリプト続行 次のpactidへスキップ）
				if (0 == fileCnt) 
				{
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイルがみつかりません スキップします\n", 1);
					continue;
				}
				
				A_billFile.sort();

				var fileErrFlg = false; // ファイルエラーフラグ
				var H_allFileData = Array(); // 全ファイルデータ配列	

						// ファイル数分処理する
				for (let fileCounter = 0; fileCounter < fileCnt; fileCounter++)
				{
					let H_fileData:any = {};
					
					if (A_billFile[fileCounter].match(this.getSetting().get("FILE_HEAD_TOKYO"))) 
					{
						var baseName = this.getSetting().get("FILE_HEAD_TOKYO");
					} else if (A_billFile[fileCounter].match(this.getSetting().get("FILE_HEAD_OSAKA"))) 	// 大阪用部門ファイル
					{
						baseName = this.getSetting().get("FILE_HEAD_OSAKA");
					} else 
					{
						this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイル" + A_billFile[fileCounter] + "の種類が不明な為、スキップします\n", 1);
						continue;
					}
					
					// データファイルを取得
					H_fileData = this.O_Model.chkBillData(dataDirPact + "/" + A_billFile[fileCounter], baseName);

					// データファイルチェックでエラーがあった場合（項目数）
					if (H_fileData == false)
					{
						fileErrFlg = true;
					} else //複数ファイルデータをマージ
					{
						H_allFileData = { ...H_allFileData,  ...H_fileData};
					}
				}

				if (true == fileErrFlg){
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " の請求データファイルが不正な為、スキップします\n", 1);
					continue;
				} else {
					// 必要なデータのみ保持する
					// array(電話番号 => array(明細行番号 => DBDATA)
					var H_editAllFileData = this.O_Model.editBillData(H_allFileData);
					console.log("check H_editAllFileData >>>", H_editAllFileData );
				}

				// ログ出力
				this.infoOut(H_pactid[A_pactid[pactCounter]] + "(" + A_pactid[pactCounter] + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
			}
			const O_PostModel = new PostModel();
			// 請求月用のルート部署を取得
			let rootPostidX = await O_PostModel.getRootPostid(A_pactid[pactCounter], 0, tableNo); 
			rootPostidX = 4729;
			console.log("check rootPostidX >>>>",rootPostidX)
			// 請求月テーブルより電話番号マスターを取得する array(basename(予備項目１)  => array(telno))
			let H_telnoX = await this.O_Model.getTelnoBasename(A_pactid[pactCounter], tableNo, this.getSetting().get("CARID"));
			H_telnoX =  {
				'text1:**': [
				  '2043', '2058',    '2061',    '2082', '2111', '2115',
				  '2154', '2192',    '2202',    '2203', '2204', '2212',
				  '2216', '2228',    '2253',    '2271', '2272', '2274',
				  '2284', '2300',    '2302',    '2321', '2325', '2340',
				  '2343', '2364',    '2412',    '2427', '2443', '2477',
				  '2482', '2488',    '2490',    '2499', '2502', '2503',
				  '2510', '2513',    '2515',    '2542', '2551', '2554',
				  '2561', '2562',    '2565',    '2567', '2579', '2592',
				  '2593', '2600',    '2606OSK', '2607', '2612', '2618',
				  '2624', '2627',    '2631',    '2635', '2647', '2651',
				  '2652', '2653',    '2671',    '2681', '2682', '2683',
				  '2687', '2700',    '2701',    '2703', '2706', '2717',
				  '2720', '2720TKY', '2721',    '2722', '2724', '2732',
				  '2733', '2740',    '2747',    '2781', '2788', '2790',
				  '2808', '2816',    '2828',    '2830', '2834', '2839',
				  '2840', '2852',    '2860',    '2865', '2866', '2880',
				  '2901', '2909',    '2921',    '2927'
				]
			}
			// console.log("check H_telnoX >>>>",H_telnoX)

			let aspFlg:boolean = false; // ASP料金が true:発生する、false:発生しない
			const O_FuncModel = new FuncModel();
		
			// 会社権限リストを取得
			let H_pactFunc = await O_FuncModel.getPactFunc(A_pactid[pactCounter], undefined, false);
			H_pactFunc = {
				fnc_copyright: [ 'fnc_copyright', 1 ],
				fnc_billprice: [ 'fnc_billprice', 4 ],
				fnc_order_docomo: [ 'fnc_order_docomo', 26 ],
				fnc_order_au: [ 'fnc_order_au', 27 ],
				fnc_order_softbank: [ 'fnc_order_softbank', 28 ],
				fnc_occupseg: [ 'fnc_occupseg', 32 ],
				fnc_kojinbetu_vw: [ 'fnc_kojinbetu_vw', 35 ],
				fnc_teldetail_view_shop: [ 'fnc_teldetail_view_shop', 44 ],
				fnc_not_anbun: [ 'fnc_not_anbun', 45 ],
				fnc_tel_reserve: [ 'fnc_tel_reserve', 79 ],
				fnc_joker_login: [ 'fnc_joker_login', 80 ],
				fnc_joker_operate: [ 'fnc_joker_operate', 81 ],
				fnc_order_emobile: [ 'fnc_order_emobile', 85 ],
				fnc_mt_price_shop: [ 'fnc_mt_price_shop', 135 ],
				commhistory_charge: [ 'commhistory_charge', 154 ]
			  }
						  
			// ASP料金が発生する場合
			if (H_pactFunc.hasOwnProperty('fnc_asp') == true)
			{
				aspFlg = true;
				// ＡＳＰ料金を取得
				var aspCharge = await O_BillModel.getAspCharge(A_pactid[pactCounter], this.getSetting().get("CARID"));
				
				if ("" == aspCharge)
				{
					this.warningOut(1000, "契約ＩＤ：" + A_pactid[pactCounter] + " のＡＳＰ利用料が設定されていない為、スキップします\n", 1);
					continue;
				}
				
				var asxCharge: any = aspCharge * Number(this.getSetting().get("excise_tax"));
				
			}

			var A_outPutTelDetails: any = Array();
			var A_outPutTelX: any = Array();

			// 現在テーブルにも追加する場合
			if ("N" == this.TargetTable)
			{
				// 現在テーブルより電話番号マスターを取得する array(basename(予備項目１) => array(telno))
				var H_telno:any = await this.O_Model.getTelnoBasename(A_pactid[pactCounter], undefined, this.getSetting().get("CARID"));
				H_telno =  {
					'text1:**': [
					  '2631', '2700', '2717', '2721', '2722', '2909', '3023',
					  '3024', '3217', '3322', '3777', '4000', '4001', '4002',
					  '4004', '4005', '4007', '4008', '4009', '4011', '4012',
					  '4016', '4017', '4020', '4025', '4027', '4028', '4029',
					  '4034', '4035', '4036', '4040', '4042', '4043', '4044',
					  '4045', '4048', '4049', '4090', '4100', '4101', '4102',
					  '4103', '4104', '4105', '4106', '4107', '4108', '4109',
					  '4120', '4121', '4122', '4123', '4124', '4125', '4126',
					  '4127', '4128', '4129', '4130', '4133', '4134', '4135',
					  '4136', '4137', '4138', '4139', '4140', '4141', '4142',
					  '4300', '4310', '4311', '4312', '4313', '4314', '4320',
					  '4321', '4322', '4323', '4324', '4325', '4326', '4327',
					  '4330', '4331', '4332', '4333', '4334', '4335', '4336',
					  '4337', '4398', '4999', '5001', '5003', '5004', '5005',
					  '5007', '5008'
					]
				  }
				// console.log("check H_telno >>> ",H_telno);
				
				var A_outPutTel:any = Array();
			}

			var now = this.get_DB().getNow();
			// 拠点一覧を取得
			var A_baseName:any = Object.keys(H_editAllFileData);
			A_baseName.sort();

			for (var baseName of A_baseName) //総行数取得
			{
				// 電話番号一覧を取得
				var A_telno = Object.keys(H_editAllFileData[baseName]);
				A_telno.sort();

				for (var telno of Object.values(A_telno)) //電話番号を文字列認識させる
				{
					// 電話番号を文字列認識させる
					var telno = telno + "";
					var telnoOut = "";
					var telAddFlgX = false;
					var baseNameOut = "null";
					this.chkTelno(telno, H_telnoX, baseName, telAddFlgX, telnoOut, baseNameOut);
					if ("N" == this.TargetTable) //tel_tb に登録する必要があるかどうか false：無、true：有
					{
						var telAddFlg:any = false;
						this.chkTelno(telno, H_telno, baseName, telAddFlg, telnoOut, baseNameOut);
					}
					var A_detailno = Object.keys(H_editAllFileData[baseName][telno]);
					console.log("check A_detailno >>>",A_detailno);
					
					A_detailno.sort();
					
					for ( var detailno of Object.values(A_detailno)) //内訳コードマスターに存在しないコードがあった場合は処理中止
					{	
						console.log("check H_utiwake >>>",H_utiwake)
						console.log("check H_editAllFileData >>>", H_editAllFileData)
						if (!H_utiwake[this.getSetting().get("CARID")][H_editAllFileData[baseName][telno][detailno].code]) {
							this.errorOut(1000, "登録されていない内訳コード[" + H_editAllFileData[baseName][telno][detailno].code + "]が見つかりました。\n内訳コードを更新してから、再度処理を行ってください。\n", 0, "", "");
							throw process.exit(-1);
						}
						A_outPutTelDetails.push({
							pactid: A_pactid[pactCounter],
							telno: telnoOut,
							code: H_editAllFileData[baseName][telno][detailno].code,
							codename: H_utiwake[this.getSetting().get("CARID")][H_editAllFileData[baseName][telno][detailno].code].name,
							charge: H_editAllFileData[baseName][telno][detailno].charge,
							taxkubun: this.getSetting().getArray("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][H_editAllFileData[baseName][telno][detailno].code].taxtype],
							detailno: detailno,
							recdate: now,
							carid: this.getSetting().get("CARID"),
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
							carid: this.getSetting().get("CARID"),
							arid: this.getSetting().get("ARID"),
							cirid: this.getSetting().get("CIRID"),
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
							carid: this.getSetting().get("CARID"),
							arid: this.getSetting().get("ARID"),
							cirid: this.getSetting().get("CIRID"),
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
						// detailno++;
						// detailno++;
						A_outPutTelDetails.push({
							pactid: A_pactid[pactCounter],
							telno: telnoOut,
							code: this.getSetting().UTIWAKE_ASP_CODE,
							codename: H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_ASP_CODE")]?.name,
							charge: aspCharge,
							taxkubun: this.getSetting().getArray("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_ASP_CODE")]?.taxtype],
							// detailno: detailno,
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
								telno: telnoOut,
								code: this.getSetting().get("UTIWAKE_ASX_CODE"),
								codename: H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_ASX_CODE")]?.name,
								charge: asxCharge,
								taxkubun: this.getSetting().getArray("A_TAX_KUBUN")[H_utiwake[this.getSetting().get("CARID")][this.getSetting().get("UTIWAKE_ASX_CODE")]?.taxtype],
								// detailno: detailno,
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

			if (false == this.expData(teldetails_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
				throw process.exit(-1);
			}
		}

		this.get_DB().beginTransaction();

		if ("O" == this.Mode) {
			O_BillModel.delTelDetailsData(A_pactDone, tableNo, [this.getSetting().get("CARID")]);
		}

		if (0 != A_outPutTelDetails.length) //tel_details_X_tb取込失敗
			{
				var rtn = await this.get_DB().pgCopyFromArray(teldetails_tb, A_outPutTelDetails);
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
			rtn = await this.get_DB().pgCopyFromArray(telX_tb, A_outPutTelX);

			if (rtn == false) {
				this.get_DB().rollback();
				this.errorOut(1000, "\n" + telX_tb + " へのデータ取込に失敗しました\n", 0, "", "");
				throw process.exit(-1);
			} else {
				this.infoOut(telX_tb + " へデーターインポート完了\n", 1);
			}
		}

		if (A_outPutTel && 0 != A_outPutTel.length) //tel_tbへデータ取込
			//tel_tb取込失敗
		{
			rtn = await this.get_DB().pgCopyFromArray("tel_tb", A_outPutTel);

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
		this.infoOut(this.getSetting().get("KG_BILL") + "終了\n", 1);
	}

	chkTelno(telno: string, H_telno: {}, baseName: string, telAddFlg: boolean, telnoOut: string, baseNameOut: string) //東京データの場合
	{	
		if (baseName == this.getSetting().get("FILE_HEAD_TOKYO"))
			{
				if (H_telno[this.getSetting().get("BASENAME_TOKYO")]?.hasOwnProperty(telno) == false) //電話番号に枝番号を付与し、再度tel_(X_)tb(東京分) に電話番号があるかチェックする
					{
						if (-1 !== H_telno[this.getSetting().get("BASENAME_TOKYO")].hasOwnProperty(telno + this.getSetting().get("LINE_BRANCH_TKY")) == false) //tel_(X_)tb へ登録する必要有り
							{
								telAddFlg = true;
								baseNameOut = this.getSetting().get("BASENAME_TOKYO");

								if (H_telno[this.getSetting().get("BASENAME_OSAKA")].hasOwnProperty(telno) == false) //tel_(X_)tb(大阪分) に電話番号がある場合
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
				if (H_telno[this.getSetting().get("BASENAME_OSAKA")]?.hasOwnProperty(telno) == false) //電話番号に枝番号を付与し、再度tel_(X_)tb(大阪分) に電話番号があるかチェックする
				{
					if (H_telno[this.getSetting().get("BASENAME_OSAKA")].hasOwnProperty(telno + this.getSetting().get("LINE_BRANCH_OSK")) == false ) //tel_(X_)tb へ登録する必要有り
					{
						telAddFlg = true;
						baseNameOut = this.getSetting().get("BASENAME_OSAKA");
						if (H_telno[this.getSetting().get("BASENAME_TOKYO")]?.hasOwnProperty(telno) == false) //tel_(X_)tb(東京分) に電話番号がある場合
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