import MtTableUtil from "../../MtTableUtil";
import PactModel from "../../model/PactModel";
import BillModel from "../../model/BillModel";
import PostModel from "../../model/PostModel";
import FuncModel from "../../model/FuncModel";
import ProcessBaseBatch from "../ProcessBaseBatch";
import SuoImportPark24View from "../../view/script/SuoImportPark24View";
import SuoImportPark24Model from "../../model/script/SuoImportPark24Model";

//処理が終了した pactid を格納するための配列
//
//コンストラクタ
//
//@author houshiyama
//@since 2010/11/29
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author houshiyama
//@since 2010/11/29
//
//@param array $H_param
//@access protected
//@return void
//
//
//PactModel取得
//
//@author
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//PostModel取得
//
//@author
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//BillModel取得
//
//@author
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//FuncModel取得
//
//@author
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//初期処理
//
//@author
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//終了処理
//
//@author
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//データディレクトリ取得
//
//@author
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//処理対象のpactid取得
//
//@author
//@since 2010/12/08
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
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//取込処理
//
//@author
//@since 2010/12/08
//
//@param mixed $pactid
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/11/29
//
//@access public
//@return void
//
export default class SuoImportPARK24Proc extends ProcessBaseBatch {
	A_pactDone: any[];
	O_View: SuoImportPark24View;
	O_Model: SuoImportPark24Model;
	PactId: string = "";
	BillDate: string = "";
	BackUpFlg : string = "";
	Mode : string = "";
	TargetTable: string = "";
	tableNo: any;
	dataDir: any;
	A_pactid: any;
	H_pactid: any;
	H_utiwake: any;
	manage_tb: any;
	manageX_tb: any;
	usehistory_tb: any;
	details_tb: any;
	O_PactModel: any;
	O_PostModel: any;
	O_BillModel: any;
	O_FuncModel: any;

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.A_pactDone = Array();
		this.getSetting().loadConfig("park24");
		this.O_View = new SuoImportPark24View();
		this.O_Model = new SuoImportPark24Model(this.get_MtScriptAmbient());
	}

	async doExecute(H_param: {} | any[] = Array()) //初期処理
	{
		var A_outPut;
		this.preExecute();

		try //処理完了したpactidを格納
		//pactid 毎に処理する
		//処理したpactあり
		{
// 2022cvt_015
			var A_pactDone = Array();

// 2022cvt_015
			for (var pcnt = 0; pcnt < this.A_pactid.length; pcnt++) {
// 2022cvt_015
				A_outPut = this.import(this.A_pactid[pcnt]);

				//if (false == A_outPut) {
				if (!A_outPut) {
					continue;
				}

				A_pactDone.push(this.A_pactid[pcnt]);
			}

			if (A_pactDone.length > 0) //エクスポートする場合
				//モードがオーバーライトの時はデータをインポートする前にデリート
				//コミット
				//処理が完了したファイルを移動
				{
					if ("Y" == this.BackUpFlg) {
// 2022cvt_015
						var expFile = this.dataDir + this.usehistory_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ".exp";

						if (false == this.expData(this.usehistory_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
							throw new Error("バックアップファイル作成失敗");
						}

						expFile = this.dataDir + this.details_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ".exp";
						 

						if (false == this.expData(this.details_tb, expFile, this.getSetting().get("NUM_FETCH"))) {
							throw new Error("バックアップファイル作成失敗");
						}
					}

					this.get_DB().beginTransaction();

					if ("O" == this.Mode) {
						this.getBillModel().delCardUseHistoryData(A_pactDone, this.tableNo, [this.getSetting().PARK24_CARDCOID]);
						this.infoOut(this.usehistory_tb + "のデータ削除完了\n", 1);
						this.getBillModel().delCardDetailsData(A_pactDone, this.tableNo, [this.getSetting().PARK24_CARDCOID]);
						this.infoOut(this.details_tb + "のデータ削除完了\n", 1);
					}

// 2022cvt_015
					for (var table in A_outPut) {
// 2022cvt_015
						var H_data = A_outPut[table];

						if (H_data.length > 0) {
							if (false == await this.get_DB().pgCopyFromArray(table, H_data)) {
								this.get_DB().rollback();
								this.errorOut(1000, "\n" + table + " へのデータ取込に失敗しました\n", 0, "", "");
								throw process.exit(0);// 2022cvt_009
							} else {
								this.infoOut(table + " へデーターインポート完了\n", 1);
							}
						}
					}

					this.get_DB().commit();

// 2022cvt_015
					for (var cnt = 0; cnt < A_pactDone.length; cnt++) //移動元ディレクトリ
					//移動先ディレクトリ
					{
// 2022cvt_015
						var fromDir = this.dataDir + A_pactDone[cnt];
// 2022cvt_015
						var finDir = fromDir + "/fin";
						this.mvFile(fromDir, finDir);
					}
				}
		} catch (ex:any) {
			this.infoOut(ex.message, 1);
		}

		this.postExecute();
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

	preExecute() //処理開始
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//対象テーブル番号を取得
	//請求データディレクトリを取得
	//処理する契約ＩＤを取得する
	//対象テーブルセット
	//会社マスターを作成
	//内訳種別マスター情報を取得
	{
		this.infoOut("パーク２４請求データインポート開始\n", 1);
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
		this.H_utiwake = this.getBillModel().getCardUtiwake([this.getSetting().PARK24_CARDCOID]);
	}

	postExecute() //スクリプトの二重起動防止ロック解除
	//終了
	{
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("パーク２４明細データインポート終了\n", 1);
	}

	getDataDir(date: any) //請求データディレクトリを取得
	//請求データディレクトリチェック（スクリプト終了）
	{
// 2022cvt_015
		var dataDir = this.O_Model.getDataDir(date);

		if (this.isDirCheck(dataDir) == false) {
			this.errorOut(1000, this.getSetting().get("PARK24") + "請求データファイルディレクトリ（" + dataDir + "）がみつかりません\n", 0, "", "");
			throw process.exit(-1);// 2022cvt_009
		}

		return dataDir;
	}

	getPactList(dir: any, pactid: any) //処理する契約ＩＤを取得する
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
		this.manage_tb = "card_tb";
		this.manageX_tb = "card_" + this.tableNo + "_tb";
		this.usehistory_tb = "card_usehistory_" + this.tableNo + "_tb";
		this.details_tb = "card_details_" + this.tableNo + "_tb";
	}

	import(pactid: any):{[key:string]:Array<any>} //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
	//請求データファイル名を取得
	//請求データファイルがなかった場合（スクリプト続行 次のpactidへスキップ）
	//全ファイルデータ配列
	//ファイル数分処理する
	//ログ出力
	//請求月用のルート部署を取得
	//請求月テーブルより削除されていないカード番号マスターを取得する array(cardno)
	//請求月テーブルより削除されているカード番号マスターを取得する array(cardno)
	//ASP料金が true:発生する、false:発生しない
	//ASP料金が発生する場合
	//利用明細
	//請求明細
	//カード管理テーブル
	//削除フラグをfalseにする必要のあるカード番号リスト
	//現在テーブルにも追加する場合
	//ファイルデータを１カード番号ずつ処理
	//card_details_tb へ登録
	{
		var A_outPut:{[key:string]:Array<any>} = {};

		if (undefined !== this.H_pactid[pactid] == false) {
			this.warningOut(1000, "契約ＩＤ：" + pactid + " は pact_tb に登録されていません スキップします\n", 1);
			return A_outPut;
		}

// 2022cvt_015
		var dataDirPact = this.dataDir + pactid;
// 2022cvt_015
		var A_billFile = this.getFileList(dataDirPact);

		if (0 == A_billFile.length) {
			this.warningOut(1000, "契約ＩＤ：" + pactid + " の請求データファイルがみつかりません スキップします\n", 1);
			return A_outPut;
		}

		A_billFile.sort();
// 2022cvt_015
		var A_allFileData = Array();

// 2022cvt_015
		for (var fcnt = 0; fcnt < A_billFile.length; fcnt++) //ファイルデータ配列
		//データファイルを取得
		{
// 2022cvt_015
			var A_fileData = Array();

			if (!(A_fileData = this.O_Model.getBillData(pactid, dataDirPact + "/" + A_billFile[fcnt]))) {
				this.warningOut(1000, "契約ＩＤ：" + pactid + " の請求データファイルが不正な為、スキップします\n", 1);
				return A_outPut;
			} else //複数ファイルデータをマージ
				{
					A_allFileData = A_allFileData.concat(A_allFileData, A_fileData);
				}
		}

		this.infoOut(this.H_pactid[pactid] + "(" + pactid + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
// 2022cvt_015
		var rootPostidX = this.getPostModel().getRootPostid(pactid, 0, this.tableNo);
// 2022cvt_015
		var A_cardnoX = Array();
// 2022cvt_015
		var A_cardnoXDel = Array();
// 2022cvt_015
		var aspFlg = false;

		if (-1 !== Object.keys(this.getFuncModel().getPactFunc(pactid, undefined, false)).indexOf("fnc_asp") == true) //ASP料金を取得
			{
				aspFlg = true;
// 2022cvt_015
				var aspCharge = this.getBillModel().getCardAspCharge(pactid, this.getSetting().PARK24_CARDCOID);

				var asxCharge;
				if ("" == aspCharge) {
					this.warningOut(1000, "契約ＩＤ：" + pactid + " のＡＳＰ利用料が設定されていない為、スキップします\n", 1);
					return A_outPut;
				}

// 2022cvt_015
				asxCharge = +(aspCharge * this.getSetting().get("excise_tax"));
			}

// 2022cvt_015
		// var A_outPut:{[key:string]:Array<any>} = {};
		A_outPut[this.usehistory_tb] = Array();
		A_outPut[this.details_tb] = Array();
		A_outPut[this.manageX_tb] = Array();
		A_cardnoX = this.getBillModel().getCardnoList(this.manageX_tb, pactid);
// 2022cvt_015
		var A_cardnoDelX = this.getBillModel().getCardnoList(this.manageX_tb, pactid, true);
// 2022cvt_015
		var A_undoCardX = Array();

		if ("N" == this.TargetTable) //現在テーブルより削除されていないカード番号マスターを取得する array(cardno)
			//現在テーブルより削除されているカード番号マスターを取得する array(cardno)
			//カード管理テーブル
			//削除フラグをfalseにする必要のあるカード番号リスト
			//今月用のルート部署を取得
			{
// 2022cvt_015
				var A_cardno = this.getBillModel().getCardnoList(this.manage_tb, pactid);
// 2022cvt_015
				var A_cardnoDel = this.getBillModel().getCardnoList(this.manage_tb, pactid, true);
				A_outPut[this.manage_tb] = Array();
// 2022cvt_015
				var A_undoCard = Array();
// 2022cvt_015
				var rootPostid = this.getPostModel().getRootPostid(pactid, 0);
			}

// 2022cvt_015
		//var cardno ;
// 2022cvt_015
		var H_cardDone = Array();

		var A_undoCardno = Array();

// 2022cvt_015
		for (var H_row of (A_allFileData)) //card_X_tb にカード番号がない場合
		{
			H_row.postid = rootPostidX;

			if (-1 !== A_cardnoX.indexOf(H_row.cardno) == false) //削除済みのカード番号として登録が有る場合
				//カード番号リストに追加
				{
					if (-1 !== A_cardnoDelX.indexOf(H_row.cardno) == true) //削除を取り消すカード番号リストに追加
						{
							A_undoCardX.push(H_row.cardno);
						} else //card_X_tb へ登録する必要有り
						{
							this.O_Model.setOutPut(this.manageX_tb, A_outPut[this.manageX_tb], H_row);
						}

					A_cardnoX.push(H_row.cardno);
				}

			if ("N" == this.TargetTable) //card_tb にカード番号がない場合
				{
					H_row.postid = rootPostid;

					if (-1 !== A_cardno.indexOf(H_row.cardno) == false) //削除済みのカード番号として登録が有る場合
						//カード番号リストに追加
						{
							if (-1 !== A_cardnoDel.indexOf(H_row.cardno) == true) //削除を取り消すカード番号リストに追加
								{
									A_undoCardno.push(H_row.cardno);
								} else //card_tb へ登録する必要有り
								{
									this.O_Model.setOutPut(this.manage_tb, A_outPut[this.manage_tb], H_row);
								}

							A_cardno.push(H_row.cardno);
						}
				}

			this.O_Model.setOutPut(this.usehistory_tb, A_outPut[this.usehistory_tb], H_row);

			if (false == (-1 !== Object.keys(H_cardDone).indexOf(H_row.cardno))) {
				H_cardDone[H_row.cardno] = H_row;
			} else {
				H_cardDone[H_row.cardno].charge += H_row.charge;
			}
		}

// 2022cvt_015
		for (var cardno in Object.keys(H_cardDone)) //駐車料金
		//請求金額
		//ASP使用料
		{
// 2022cvt_015
			var H_row = H_cardDone[cardno];
			H_row.detailno = 0;
			this.O_Model.setOutPut(this.details_tb, A_outPut[this.details_tb], H_row);
			H_row.detailno++;
			H_row.code = SuoImportPark24Model.SEIKYU_CODE;
			H_row.codename = SuoImportPark24Model.SEIKYU_CODENAME;
			this.O_Model.setOutPut(this.details_tb, A_outPut[this.details_tb], H_row);

			if (true == aspFlg) {
				H_row.detailno += 2;
				H_row.code = SuoImportPark24Model.ASPX_CODE;
				H_row.codename = SuoImportPark24Model.ASPX_CODENAME;
// 2022cvt_015
				var H_tmp = H_row;
				H_tmp.charge = asxCharge;
				this.O_Model.setOutPut(this.details_tb, A_outPut[this.details_tb], H_tmp);
			}
		}

		return A_outPut;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
