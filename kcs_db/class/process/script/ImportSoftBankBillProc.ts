import MtTableUtil from "../../MtTableUtil";
import PactModel from "../../model/PactModel";
import BillModel from "../../model/BillModel";
import PostModel from "../../model/PostModel";
import TelModel from "../../model/TelModel";
import FuncModel from "../../model/FuncModel";
import ProcessBaseBatch from "../ProcessBaseBatch";
import ClampModel from "../../model/ClampModel";
import ImportSoftBankView from "../../view/script/ImportSoftBankView";
import ImportSoftBankModel from "../../model/script/ImportSoftBankModel";
import PATH from 'path';

//処理が終了した pactid を格納するための配列
//
//コンストラクタ
//
//@author houshiyama
//@since 2011/04/08/
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author houshiyama
//@since 2011/04/08/
//
//@param array $H_param
//@access protected
//@return void
//
//
//PactModel取得
//
//@author
//@since 2011/04/08/
//
//@access protected
//@return void
//
//
//PostModel取得
//
//@author
//@since 2011/04/08/
//
//@access protected
//@return void
//
//
//BillModel取得
//
//@author
//@since 2011/04/08/
//
//@access protected
//@return void
//
//
//FuncModel取得
//
//@author
//@since 2011/04/08/
//
//@access protected
//@return void
//
//
//TelModel取得
//
//@author houshiyama
//@since 2011/04/13
//
//@access protected
//@return void
//
//
//初期処理
//
//@author
//@since 2011/04/08/
//
//@access protected
//@return void
//
//
//終了処理
//
//@author
//@since 2011/04/08/
//
//@param mixed $exit
//@access protected
//@return void
//
//
//データディレクトリ取得
//
//@author
//@since 2011/04/08/
//
//@access protected
//@return void
//
//
//処理対象のpactid取得
//
//@author
//@since 2011/04/08/
//
//@param mixed $dir
//@param mixed $pactid
//@access protected
//@return void
//
//
//対象テーブル決定
//
//@author
//@since 2011/04/08/
//
//@access protected
//@return void
//
//
//取込処理
//
//@author
//@since 2011/04/08/
//
//@param mixed $pactid
//@access protected
//@return void
//
//
//ファイル名の整合性チェック
//
//@author houshiyama
//@since 2011/04/14
//
//@param mixed $pactid
//@param mixed $fileName
//@access private
//@return void
//
//
//メンバー変数に内訳コードをセット
//
//@author houshiyama
//@since 2011/04/13
//
//@access private
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2011/04/08/
//
//@access public
//@return void
//
export default class ImportSoftBankBillProc extends ProcessBaseBatch {
	A_pactDone: any[];
	exit: any;
	O_View: ImportSoftBankView;
	O_Model: any;
	A_pactid: any;
	H_pactid: any;
	BackUpFlg: string = "";
	dataDir: any;
	details_tb: any;
	Mode: string = "";
	tableNo: any;
	O_PactModel: any;
	O_PostModel: any;
	O_BillModel: any;
	O_FuncModel: any;
	O_TelModel: any;
	PactId: string = "";
	BillDate: string = "";
	TargetTable: string = "";
	isDirCheck: any;
	utiwake_tb: any;
	manage_tb: any;
	manageX_tb: any;
	H_utiwake: any;
	A_unregist: any;

	static TOTAL_POSTNAME = "総計";
	static TOTAL_CODENAME = "合計";
	static ASPCODE = "ASP";
	static ASXCODE = "ASX";
	static ASPCODENAME = "ASP使用料";
	static ASXCODENAME = "ASP使用料消費税";
	static SCRIPTNAME = "ImportSoftBankBill";

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.A_pactDone = Array();
		this.exit = 0;
		this.getSetting().loadConfig("softbank");
		this.O_View = new ImportSoftBankView();
		this.O_Model = new ImportSoftBankModel(this.get_MtScriptAmbient());
	}

	async doExecute(H_param: {} | any[] = Array()) //初期処理
	//終了処理
	{
		var A_outPut:any;
		this.preExecute();

		try //処理完了したpactidを格納
		//内訳コード取得
		//pactid 毎に処理する
		//処理したpactあり
		{
// 2022cvt_015
			var A_pactDone = Array();
			this.setUtiwakeHash();

// 2022cvt_015
			for (var pcnt = 0; pcnt < this.A_pactid.length; pcnt++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
			{
				if (undefined !== this.H_pactid[this.A_pactid[pcnt]] == false) {
					this.warningOut(1000, "契約ＩＤ：" + this.A_pactid[pcnt] + " は pact_tb に登録されていません スキップします\n", 1);
					continue;
				}

				A_outPut[this.A_pactid[pcnt]] = this.import(this.A_pactid[pcnt]);

				if (false == A_outPut[this.A_pactid[pcnt]]) {
					this.exit = -1;
					continue;
				}

				A_pactDone.push(this.A_pactid[pcnt]);
			}

// 2022cvt_015
			for (var key in A_pactDone) //未登録内訳コードがあれば登録してここで終了
			{
// 2022cvt_015
				var pid = A_pactDone[key];

				if (!!A_outPut[pid].utiwake_tb) //トランザクション開始
					//コミット
					{
						this.get_DB().beginTransaction();

						if (false == await this.get_DB().pgCopyFromArray("utiwake_tb", A_outPut[pid].utiwake_tb)) {
							this.get_DB().rollback();
							this.errorOut(1000, "utiwake_tb へのデータ取込に失敗しました\n", 0, "", "");
							throw process.exit(-1);// 2022cvt_009
						}

						this.warningOut(1000, "契約ＩＤ" + pid + " 未登録内訳コードが存在したので仮登録して処理を中断しました\n", 1);
						this.get_DB().commit();
						delete A_pactDone[key];
						this.exit = -1;
					}
			}

			if (A_pactDone.length > 0) //エクスポートする場合
				{
					if ("Y" == this.BackUpFlg) {
// 2022cvt_015
						// var expFile = this.dataDir + this.details_tb + date("YmdHis") + ".exp";
						var expFile = this.dataDir + this.details_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";

						if (false == this.expData(this.details_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
							throw new Error("バックアップファイル作成失敗");
						}
					}

// 2022cvt_015
					for (var pid of (A_pactDone)) //トランザクション開始
					//モードがオーバーライトの時はデータをインポートする前に削除
					//コミット
					//処理が完了したファイルを移動
					//移動元ディレクトリ
					//移動先ディレクトリ
					{
						this.get_DB().beginTransaction();

						if ("O" == this.Mode) {
							this.getBillModel().delTelDetailsData([pid], this.tableNo, [this.getSetting().SOFTBANK_CARID]);
							this.infoOut(this.details_tb + "のデータ削除完了\n", 1);
						}

						{
							let _tmp_0 = A_outPut[pid];

// 2022cvt_015
							for (var table in _tmp_0) {
// 2022cvt_015
								var H_data = _tmp_0[table];

								if (H_data.length > 0) {
									if (false == await this.get_DB().pgCopyFromArray(table, H_data)) {
										this.get_DB().rollback();
										this.errorOut(1000, "\n" + table + " へのデータ取込に失敗しました\n", 0, "", "");
										throw process.exit(-1);// 2022cvt_009
									} else {
										this.infoOut(table + " へデーターインポート完了\n", 1);
									}
								}
							}
						}
						this.get_DB().commit();
// 2022cvt_015
						var fromDir = this.dataDir + pid;
// 2022cvt_015
						var finDir = fromDir + "/fin";
						this.mvFile(fromDir, finDir);
					}
				}
		} catch (e:any) {
			this.infoOut(e.getMessage(), 1);
			this.exit = -1;
		}

		this.getOut().flushMessage();
		this.postExecute(this.exit);
	}

	getPactModel() {
		if (!(this.O_PactModel instanceof PactModel)) {
			this.O_PactModel = new PactModel();
		}

		return this.O_PactModel;
	}

	getPostModel() {
		if (!(this.O_PostModel instanceof PostModel)) {
			this.O_PostModel = new PostModel();
		}

		return this.O_PostModel;
	}

	getBillModel() {
		if (!(this.O_BillModel instanceof BillModel)) {
			this.O_BillModel = new BillModel();
		}

		return this.O_BillModel;
	}

	getFuncModel() {
		if (!(this.O_FuncModel instanceof FuncModel)) {
			this.O_FuncModel = new FuncModel();
		}

		return this.O_FuncModel;
	}

	getTelModel() {
		if (!(this.O_TelModel instanceof TelModel)) {
			this.O_TelModel = new TelModel();
		}

		return this.O_TelModel;
	}

	preExecute() //処理開始
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//対象テーブル番号を取得
	//請求データディレクトリを取得
	//処理する契約ＩＤを取得する
	//対象テーブルセット
	//会社マスターを作成
	{
		this.infoOut("ソフトバンク請求明細データインポート開始\n", 1);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");
		this.tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		this.dataDir = this.getDataDir(this.BillDate);
		this.A_pactid = this.getPactList(this.dataDir, this.PactId);
		this.setTargetTables();
		this.H_pactid = this.getPactModel().getPactIdCompNameFromPact();
	}

	postExecute(exit: number | undefined) //スクリプトの二重起動防止ロック解除
	//終了
	{
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("ソフトバンク請求明細データインポート終了\n", 1);
		throw process.exit(exit);// 2022cvt_009
	}

	getDataDir(date: any) //請求データディレクトリを取得
	//請求データディレクトリチェック（スクリプト終了）
	{
// 2022cvt_015
		var dataDir = this.O_Model.getDataDir(date);

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, this.getSetting().SOFTBANK + "請求データファイルディレクトリ" + dataDir + "がみつかりません\n", 0, "", "");
			throw process.exit(-1);// 2022cvt_009
		}

		return dataDir;
	}

	getPactList(dir: string, pactid: string) //処理する契約ＩＤを取得する
	//処理する契約ＩＤが１件もない場合（スクリプト終了）
	{
// 2022cvt_015
		var A_pactid = super.getPactList(dir, pactid);
		A_pactid.sort();

		if (0 == A_pactid.length) {
			this.errorOut(1000, "請求データファイルがみつかりません\n", 0, "", "");
			throw process.exit(-1);// 2022cvt_009
		}

		return A_pactid;
	}

	setTargetTables() //テーブル名設定
	{
		this.utiwake_tb = "utiwake_tb";
		this.manage_tb = "tel_tb";
		this.manageX_tb = "tel_" + this.tableNo + "_tb";
		this.details_tb = "tel_details_" + this.tableNo + "_tb";
	}

	import(pactid: string) //出力用配列
	//内訳コード
	//請求明細
	//電話管理テーブル
	//電話管理テーブル
	//pactid 毎の請求データディレクトリ設定
	//請求データファイル名を取得
	//請求データファイルがなかった場合（スクリプト続行 次のpactidへスキップ）
	//全ファイルデータ配列
	//未登録配列
	//ファイル数分処理する
	//未登録内訳コードがあればここで終了
	//請求月用のルート部署を取得
	//請求月テーブルより電話番号マスターを取得する
	//ASP料金が true:発生する、false:発生しない
	//ASP料金が発生する場合
	//現在テーブルにも追加する場合
	//ファイルデータを１電話番号ずつ処理
	//tel_details_tb へ登録
	{
		var A_outPut:{[key:string]:Array<any>} = {};

// 2022cvt_015
		// var A_outPut = Array();
		A_outPut[this.utiwake_tb] = Array();
		A_outPut[this.details_tb] = Array();
		A_outPut[this.manageX_tb] = Array();
		A_outPut.tel_amount_bill_tb = Array();
// 2022cvt_015
		var dataDirPact = this.dataDir + pactid;
// 2022cvt_015
		var A_billFile = this.getFileList(dataDirPact);

		if (0 == A_billFile.length) {
			this.warningOut(1000, "契約ＩＤ：" + pactid + " の請求データファイルがみつかりません スキップします\n", 1);
			return false;
		}

		A_billFile.sort();
// 2022cvt_015
		var A_allFileData = Array();
// 2022cvt_015
		var A_utiwakeNew = Array();

// 2022cvt_015
		for (var fcnt = 0; fcnt < A_billFile.length; fcnt++) //ファイルデータ配列
		//未登録内訳コード取得
		{
			if (!this.checkFileName(pactid, dataDirPact + "/" + A_billFile[fcnt])) {
				this.warningOut(1000, "契約ＩＤ：" + pactid + " とファイル名が一致しません スキップします\n", 1);
				return false;
			}

// 2022cvt_015
			var A_fileData = Array();
// 2022cvt_015
			var A_tmpUtiwakeNew = this.O_Model.getUnregistCode(dataDirPact + "/" + A_billFile[fcnt], this.H_utiwake);

			if (!A_tmpUtiwakeNew) //データファイルを取得
				{
					if (!(A_fileData = this.O_Model.getBillData(pactid, dataDirPact + "/" + A_billFile[fcnt]))) {
						this.warningOut(1000, "契約ＩＤ：" + pactid + " の請求データファイルが不正な為、スキップします\n", 1);
						return false;
					} else //複数ファイルデータをマージ
						{
							// A_allFileData = array_merge(A_allFileData, A_fileData);
							A_allFileData = A_allFileData.concat(A_fileData);
						}
				} else {
				A_utiwakeNew = A_utiwakeNew + A_tmpUtiwakeNew;
			}
		}

		if (!!A_utiwakeNew) //utiwake_tb へ登録用配列
			{
// 2022cvt_015
				for (var H_row of (A_utiwakeNew)) {
					this.O_Model.setOutPut(this.utiwake_tb, A_outPut[this.utiwake_tb], H_row);
					this.H_utiwake[H_row.code] = {
						name: H_row.name,
// 2022cvt_016
						taxtype: H_row.taxtype,
// 2022cvt_016
						codetype: H_row.codetype
					};
				}

				return A_outPut;
			}

		this.A_unregist = Array();
// 2022cvt_015
		var A_codeInFile = this.O_Model.convertSimpleArray(A_allFileData, "code");
		{
			let _tmp_1 = this.H_utiwake;

// 2022cvt_015
			for (var code in _tmp_1) {
// 2022cvt_015
				var H_row = _tmp_1[code];

// 2022cvt_016
				if (H_row.codetype == ImportSoftBankModel.UNREGIST_CODETYPE) {
					if (-1 !== A_codeInFile.indexOf(code)) {
						this.warningOut(1000, "契約ＩＤ：" + pactid + " 内訳コード:" + code + " が仮登録のままです\n", 1);
						this.A_unregist.push(code);
					}
				}
			}
		}

		if (0 != this.A_unregist.length) {
			this.warningOut(1000, ImportSoftBankBillProc.SCRIPTNAME + "::仮登録の内訳コードがあります\n", 1);
			return false;
		}

		this.infoOut(this.H_pactid[pactid] + "(" + pactid + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
// 2022cvt_015
		var rootPostidX = this.getPostModel().getRootPostid(pactid, 0, this.tableNo);
// 2022cvt_015
		var H_telnoX = Array();
// 2022cvt_015
		var aspFlg = false;
		var asxCharge;

		if (-1 !== Object.keys(this.getFuncModel().getPactFunc(pactid, undefined, false)).indexOf("fnc_asp") == true) //ASP料金を取得
			{
				aspFlg = true;
// 2022cvt_015
				var aspCharge = this.getBillModel().getAspCharge(pactid, this.getSetting().SOFTBANK_CARID);

				if ("" == aspCharge) {
					this.warningOut(1000, "契約ＩＤ：" + pactid + " のＡＳＰ利用料が設定されていない為、スキップします\n", 1);
					return false;
				}

// 2022cvt_015
				asxCharge = +(aspCharge * this.getSetting().get("excise_tax"));
			}

		H_telnoX = this.getTelModel().getCaridTelno(pactid, this.tableNo, [this.getSetting().SOFTBANK_CARID]);

		if ("N" == this.TargetTable) //現在テーブルより電話番号マスターを取得する array(telno)
			//電話管理テーブル
			//今月用のルート部署を取得
			{
// 2022cvt_015
				var H_telno = this.getTelModel().getCaridTelno(pactid, undefined, [this.getSetting().SOFTBANK_CARID]);
				A_outPut[this.manage_tb] = Array();
// 2022cvt_015
				var rootPostid = this.getPostModel().getRootPostid(pactid, 0);
			}

// 2022cvt_015
		var telnod: any;
// 2022cvt_015
		var H_telDone = Array();

// 2022cvt_015
		for (var H_row of (A_allFileData)) //tel_X_tb に電話番号がない場合
		{
			H_row.postid = rootPostidX;

			if (!!H_row.telno && -1 !== H_telnoX[this.getSetting().get("SOFTBANK_CARID")].indexOf(H_row.telno) == false) //tel_X_tb へ登録する必要有り
				//電話番号リストに追加
				//現在テーブルにも追加する場合（過去テーブルに無いときだけ追加）
				{
					this.O_Model.setOutPut(this.manageX_tb, A_outPut[this.manageX_tb], H_row);
					H_telnoX[this.getSetting().get("SOFTBANK_CARID")].push(H_row.telno);

					if ("N" == this.TargetTable) //tel_tb に電話番号がない場合
						{
							H_row.postid = rootPostid;

							if (-1 !== H_telno[this.getSetting().get("SOFTBANK_CARID")].indexOf(H_row.telno) == false) //tel_tb へ登録する必要有り
								//電話番号リストに追加
								{
									this.O_Model.setOutPut(this.manage_tb, A_outPut[this.manage_tb], H_row);
									H_telno[this.getSetting().get("SOFTBANK_CARID")].push(H_row.telno);
								}
						}
				}
		}

// 2022cvt_015
		var A_telnoDone = Array();

// 2022cvt_015
		for (var cnt = 0; cnt < A_allFileData.length; cnt++) //tel_amount_bill_tb へ登録
		{
// 2022cvt_015
			var H_row = A_allFileData[cnt];

			if (H_row.telno == "") {
				if (H_row.postname == ImportSoftBankBillProc.TOTAL_POSTNAME && H_row.codename == ImportSoftBankBillProc.TOTAL_CODENAME) {
					H_row.year = this.BillDate.substring(0, 4);
					H_row.month = this.BillDate.substring(4, 2);
					this.O_Model.setOutPut("tel_amount_bill_tb", A_outPut.tel_amount_bill_tb, H_row);
				}
			} else //ASP使用料
				{
					this.O_Model.setOutPut(this.details_tb, A_outPut[this.details_tb], H_row);

					if (true == aspFlg && undefined !== A_allFileData[cnt + 1] && H_row.telno !== A_allFileData[cnt + 1].telno) {
						H_row.detailno += 2;
						H_row.code = ImportSoftBankBillProc.ASPCODE;
						H_row.codename = ImportSoftBankBillProc.ASPCODENAME;
						H_row.charge = aspCharge;
						this.O_Model.setOutPut(this.details_tb, A_outPut[this.details_tb], H_row);
						H_row.detailno++;
						H_row.code = ImportSoftBankBillProc.ASXCODE;
						H_row.codename = ImportSoftBankBillProc.ASXCODENAME;
						H_row.charge = asxCharge;
						this.O_Model.setOutPut(this.details_tb, A_outPut[this.details_tb], H_row);
					}
				}
		}

		return A_outPut;
	}

	async checkFileName(pactid: string, fileName: string) //78 会社名に.があるとだめを修正
	//$A_file = preg_split("/_|\./", $H_path["basename"]);
	//basenameから拡張子を抜く
	{
// 2022cvt_015
		// var H_path = pathinfo(fileName);
		var H_path = PATH.parse(fileName);
// 2022cvt_015
		// var A_path = H_path.dirname.split("/");
		var A_path = H_path.dir.split("/");
	
// 2022cvt_015
		// var basename = preg_replace("/\\." + H_path.extension + "$/", "", H_path.basename);
		// var basename = H_path.basename.replace("/\\." + H_path.extension + "$/", "");
		var basename = H_path .base.replace("/\\." + H_path.ext + "$/", "");
// 2022cvt_015
		var A_file = [basename.substring(0, basename.length - 7), basename.substring(-6), H_path .ext];

		if (!A_file) {
			this.warningOut(1000, "契約ＩＤ：" + pactid + " ファイル名が不正です " + fileName + "\n", 1);
			return false;
		}

		if (A_path[3] !== A_file[1]) {
			this.warningOut(1000, "契約ＩＤ：" + pactid + " ファイル名の対象年月がディレクトリと違っています " + fileName + "\n", 1);
			return false;
		}

// 2022cvt_015
		var O_model = new ClampModel();
// 2022cvt_015
		var A_clamps = await O_model.getClamps(pactid, this.getSetting().SOFTBANK_CARID);
// 2022cvt_015
		var flag = false;

// 2022cvt_015
		for (var H_clamp of (A_clamps)) {
			if (H_clamp.clampid === A_file[0]) {
				flag = true;
				break;
			}
		}

		if (flag == false) {
			this.warningOut(1000, "契約ＩＤ：" + pactid + " のclampidがファイル名 :" + fileName + " と一致しません\n", 1);
			return false;
		}

		return true;
	}

	setUtiwakeHash() //内訳種別マスター情報を取得
	{
// 2022cvt_015
		var H_utiwake = this.getBillModel().getUtiwake([this.getSetting().get("SOFTBANK_CARID")]);
		this.H_utiwake = H_utiwake[this.getSetting().get("SOFTBANK_CARID")];
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
