import ModelBase from "../../model/ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";
import BillModel from "../BillModel";
import PostModel from "../PostModel";
import ImportCanonView from "../../view/script/ImportCanonView"
import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import { ScriptDB } from "../../../script/batch/lib/script_db";

// const fs = require('fs');
//機種名
//コピー機ID
//使用者名
//カウンター
//基本料金
//合算ミニマム料金
//基本料金
//ミニマム料金
//付属品金額
//割引額
//割増額
//合計
//消費税
//object member
//member
//
//__construct
//
//@author web
//@since 2013/06/19
//
//@access public
//@return void
//
//
//インポート対象のXテーブルを設定
//
//@author web
//@since 2013/06/22
//
//@param mixed $tableNo
//@access public
//@return void
//
//
//処理候補の中からpact_tbにない会社をリスト化
//
//@author web
//@since 2013/06/19
//
//@access public
//@return void
//
//
//請求データディレクトリを設定
//
//@author web
//@since 2013/06/19
//
//@param mixed $path
//@access public
//@return void
//
//
//請求データディレクトリを取得
//
//@author web
//@since 2013/06/19
//
//@param mixed $path
//@access public
//@return void
//
//
//処理対象のcaridを設定
//
//@author web
//@since 2013/06/19
//
//@param mixed $carid
//@access public
//@return void
//
//
//処理対象のcaridを取得
//
//@author web
//@since 2013/06/19
//
//@access public
//@return void
//
//
//処理対象社をリスト化
//
//@author web
//@since 2013/06/19
//
//@access public
//@return void
//
//
//請求ファイルの解析・COPY用配列作成
//
//@author web
//@since 2013/06/22
//
//@access public
//@return void
//
//
//請求データをcopy_details_xx_tbにCOPY
//
//@author web
//@since 2013/06/22
//
//@access public
//@return void
//
//
//コピー機をcopy_xx_tbにCOPY
//
//@author web
//@since 2013/06/22
//
//@access public
//@return void
//
//
//請求データを削除
//
//@author web
//@since 2013/06/22
//
//@access public
//@return void
//
//
//コピー機の存在チェック
//
//@author web
//@since 2013/06/23
//
//@param mixed $data
//@param mixed $table
//@access protected
//@return void
//
//
//begin
//
//@author web
//@since 2013/06/22
//
//@access public
//@return void
//
//
//rollback
//
//@author web
//@since 2013/06/26
//
//@access private
//@return void
//
//
//commit
//
//@author web
//@since 2013/06/22
//
//@access public
//@return void
//
//
//処理候補のリストを取得
//
//@author web
//@since 2013/06/19
//
//@access public
//@return void
//
//
//処理候補社数を取得
//
//@author web
//@since 2013/06/19
//
//@access public
//@return void
//
//
//setView
//
//@author web
//@since 2013/06/19
//
//@param mixed $view
//@access public
//@return void
//
//
//getView
//
//@author web
//@since 2013/06/19
//
//@access public
//@return void
//
//
//MtScriptAmbientクラスのオブジェクトを取得
//
//@author web
//@since 2013/06/19
//
//@access public
//@return void
//
//
//BillModelのオブジェクトを取得
//
//@author web
//@since 2013/06/19
//
//@access protected
//@return void
//
//
//PostModelのオブジェクトを取得
//
//@author web
//@since 2013/06/19
//
//@access protected
//@return void
//
//
//処理中のpactidを設定
//
//@author web
//@since 2013/06/25
//
//@param mixed $pactid
//@access public
//@return void
//
//
//インポート用配列の初期化
//
//@author web
//@since 2013/06/25
//
//@access private
//@return void
//
//
//resultCount
//
//@author web
//@since 2013/06/26
//
//@access public
//@return void
//
//
//getSuccessPacts
//
//@author web
//@since 2013/06/26
//
//@access public
//@return void
//
//
//setOutPutBill
//
//@author web
//@since 2013/06/26
//
//@param mixed $billData
//@access private
//@return void
//
//
//setOutPutCopy
//
//@author web
//@since 2013/06/26
//
//@param mixed $table
//@param mixed $inputData
//@param mixed $copyData
//@access private
//@return void
//
//
//initializeBillValue
//
//@author web
//@since 2013/06/19
//
//@param mixed $codeList
//@param mixed $serial
//@access private
//@return void
//
//
//mergeBillData
//
//@author web
//@since 2013/06/19
//
//@param mixed $billData
//@param mixed $rows
//@access private
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/06/19
//
//@access public
//@return void
//
export default class ImportCanonModel extends ModelBase {
	inputBillData: Array<any>;
	inputCopyData: string | any[];
	inputCopyXData: string | any[];
	addCopyCnt: number;
	addBillRow: number;
	pactList: Array<any>;
	pactCount: number;
	unregistPact: Array<any>;
	copyTable: string;
	copyXTable: string;
	copyDetailsTable: string;
	successPacts: Array<any>;
	importCodes: string[];
	tableNo: number = 0;
	commonDataDir: string | undefined;
	targetCarrier: string | undefined;
	pactId: number = 0;
	dataDir: string = "";
	canonView!: ImportCanonView;
	scriptAmbient!: MtScriptAmbient;
	billModel!: BillModel;
	postModel!: PostModel;

	static COL_MACNAME = 0;
	static COL_COPYID = 1;
	static COL_USERNAME = 3;
	static COL_COUNTER = 11;
	static COL_ADD_BASIC = 12;
	static COL_ADD_MIN = 13;
	static COL_BASIC = 14;
	static COL_MIN_CHARGE = 16;
	static COL_ACCESSORIES = 36;
	static COL_DISCOUNT = 44;
	static COL_PREMIUM = 45;
	static COL_TOTAL = 41;
	static COL_TAX = 42;
	static CODE_ADD_BASIC = "001";
	static CODE_ADD_MIN = "002";
	static CODE_BASIC = "003";
	static CODE_MIN_CHARGE = "004";
	static CODE_ACCESSORIES = "005";
	static CODE_DISCOUNT = "006";
	static CODE_PREMIUM = "007";
	static CODE_TOTAL = "008";
	static CODE_TAX = "009";

	constructor() {
		super();
		this.inputBillData = Array();
		this.inputCopyData = Array();
		this.inputCopyXData = Array();
		this.addCopyCnt = 0;
		this.addBillRow = 0;
		this.pactList = Array();
		this.pactCount = 0;
		this.unregistPact = Array();
		this.copyTable = "copy_tb";
		this.copyXTable = "copy_tableNo_tb";
		this.copyDetailsTable = "copy_details_tableNo_tb";
		this.successPacts = Array();
		this.getSetting().loadConfig("copy");
		this.setTargetCarrier(this.getSetting().CANON_COPY_COID);
		this.importCodes = [ImportCanonModel.CODE_ADD_BASIC, ImportCanonModel.CODE_ADD_MIN, ImportCanonModel.CODE_BASIC, ImportCanonModel.CODE_MIN_CHARGE, ImportCanonModel.CODE_ACCESSORIES, ImportCanonModel.CODE_DISCOUNT, ImportCanonModel.CODE_PREMIUM, ImportCanonModel.CODE_TOTAL, ImportCanonModel.CODE_TAX];
	}

	setTableNo(tableNo: number) {
		// if (is_numeric(tableNo)) {
		if (!isNaN(tableNo)) {
			this.tableNo = tableNo;
			this.copyXTable = this.copyXTable.replace(/tableNo/g, this.tableNo.toString());
			this.copyDetailsTable = this.copyDetailsTable.replace(/tableNo/g, this.tableNo.toString());
		}
	}

	async setUnregistPacts() {
// 2022cvt_015
		// var sql = "SELECT pactid FROM pact_tb WHERE pactid IN (" + ", ".join(this.getPactList()) + ") GROUP BY pactid ORDER BY pactid";
		var sql = "SELECT pactid FROM pact_tb WHERE pactid IN (" +  this.getPactList().join(",") + ") GROUP BY pactid ORDER BY pactid";
// 2022cvt_015
		var list = await this.get_DB().queryCol(sql);
		// this.unregistPact = array_diff(this.getPactList(), list);
		this.unregistPact = this.getPactList().filter((x: any) => !list.includes(x));
	}

	setCommonDataDir(path = "") {
		var dir: string;
		// if (!is_null(path)) {
		if (!path) {
// 2022cvt_015
			dir = path;
		} else {
			dir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.getView().get_HArgv("-y") + "/" + this.getSetting().get("COPY_CANON_DIR") + "/";
		}

		if (this.getScriptAmbient().isDirCheck(dir)) {
			this.commonDataDir = dir;
		}

		return this;
	}

	getCommonDataDir() {
		return this.commonDataDir;
	}

	setTargetCarrier(carid: string | undefined) {
		this.targetCarrier = carid;
		return this;
	}

	getTargetCarrier() {
		return this.targetCarrier;
	}

	makePactList() {
		this.pactList = this.getScriptAmbient().getPactList(this.setCommonDataDir().commonDataDir!, this.getView().get_HArgv("-p"));

		if (Array.isArray(this.pactList)) {
			this.pactCount = this.pactList.length;
		}

		this.setUnregistPacts();
		return this;
	}

	async analysisFile() {
		this.initialize();
// 2022cvt_015
		var codeList = await this.getBillModel().getCopyUtiwake([this.getTargetCarrier()]);

		if (-1 !== this.unregistPact.indexOf(this.pactId)) {
			this.errorOut(1000, "pactId=" + this.pactId + "：登録されていない会社です\n", 0, "", "");
			return false;
		}

		this.dataDir = this.commonDataDir + "/" + this.pactId;
// 2022cvt_015
		var fileList = this.getScriptAmbient().getFileList(this.dataDir);

		var billData = Array();
		var copyData = Array();

		if (0 < fileList.length) {
// 2022cvt_015
			for (var file of (fileList)) {
				// var fp = fopen(this.dataDir + "/" + file, "r");
				var buffer = fs.readFileSync(this.dataDir + "/" + file, "utf8");
				var text = Encoding.convert(buffer, {
					from: "SJIS",
					to: "UNICODE",
					type: "string"
				});
				var lines = text.toString().split("\r\n");

// 2022cvt_015
				var lineCnt = 0;

				// while (false !== (row = fgets(fp))) {
				for (var row of lines) {
					lineCnt++;

					if (1 == lineCnt) {
						continue;
					}

// 2022cvt_015
					// var c_row = mb_convert_encoding(row, "UTF-8", "SJIS");
// 2022cvt_015
					// var rows = c_row.split(",");
					var rows = row.split(",");

					if (!(undefined !== billData[rows[ImportCanonModel.COL_COPYID]])) {
						billData[rows[ImportCanonModel.COL_COPYID]] = this.initializeBillValue(codeList, rows[ImportCanonModel.COL_COPYID]);
					}

					this.mergeBillData(billData[rows[ImportCanonModel.COL_COPYID]], rows);

					if (!(undefined !== copyData[rows[ImportCanonModel.COL_COPYID]])) {
// 2022cvt_015
						var username = rows[ImportCanonModel.COL_USERNAME];

						if (!!rows[ImportCanonModel.COL_USERNAME + 1]) {
							username += "    " + rows[ImportCanonModel.COL_USERNAME + 1];
						}

						if (!!rows[ImportCanonModel.COL_USERNAME + 2]) {
							username += "    " + rows[ImportCanonModel.COL_USERNAME + 2];
						}

						copyData[rows[ImportCanonModel.COL_COPYID]] = {
							pactid: this.pactId,
							postid: this.getPostModel().getRootPostid(this.pactId, 0, this.tableNo.toString()),
							copycoid: this.getTargetCarrier(),
							copyid: rows[ImportCanonModel.COL_COPYID],
							copyname: rows[ImportCanonModel.COL_MACNAME],
							username: (rows[ImportCanonModel.COL_USERNAME] + "    " + rows[ImportCanonModel.COL_USERNAME + 1] + "    " + rows[ImportCanonModel.COL_USERNAME + 2]).replace(/ * |  $/g, ""),
							delete_flg: "f",
							dummy_flg: "f",
							fixdate: this.get_DB().getNow(),
							recdate: this.get_DB().getNow()
						};
					}
				}
			}
		}

// 2022cvt_015
		for (var billKey of (billData)) {
// 2022cvt_015
			for (var billDetail of (billKey)) {
				this.setOutPutBill(billDetail);
			}
		}

// 2022cvt_015
		for (var copyDetail of (copyData)) //現在テーブルにコピー機をインポート
		{
			if ("N" == this.getView().get_HArgv("-t") || "n" == this.getView().get_HArgv("-t")) //存在するコピー機は追加リストに加えない
				{
					if (!this.existsCopyRow(copyDetail, this.copyTable)) {
						this.setOutPutCopy(this.copyTable, this.inputCopyData, copyDetail);
					}
				}

			if (!this.existsCopyRow(copyDetail, this.copyXTable)) {
				this.setOutPutCopy(this.copyXTable, this.inputCopyXData, copyDetail);
			}
		}

		this.successPacts[this.pactId] = {
			pactid: this.pactId,
			addrow: this.addBillRow,
			addcopy: this.addCopyCnt
		};
		return true;
	}

	importBillData() {
		if (1 > this.inputBillData.length) {
			this.errorOut(1000, "インポートする請求データが生成されていません\n", 0, "", "");
			return -1;
		}

		{
			let _tmp_0 = this.inputBillData;

// 2022cvt_015
			for (var key in _tmp_0) {
// 2022cvt_015
				var data = _tmp_0[key];

				if (!data.charge && 0 !== data.charge) {
					this.inputBillData[key].charge = 0;
				}

				if (!data.printcount && 0 !== data.printcount) {
					this.inputBillData[key].printcount = 0;
				}
			}
		}
// 2022cvt_015
		var result = this.get_DB().pgCopyFromArray(this.copyDetailsTable, this.inputBillData);

		if (!result) {
			this.rollback();
			this.errorOut(1000, "請求データのインポートに失敗\n", 0, "", "");
			return false;
		}

		return true;
	}

	importCopy() {
		if (0 < this.inputCopyData.length) {
// 2022cvt_015
			var result = this.get_DB().pgCopyFromArray(this.copyTable, this.inputCopyData);

			if (!result) {
				this.rollback();
				return false;
			}
		}

		if (0 < this.inputCopyXData.length) {
			result = this.get_DB().pgCopyFromArray(this.copyXTable, this.inputCopyXData);

			if (!result) {
				this.rollback();
				return false;
			}
		}

		return true;
	}

	deleteDetailsData() {
// 2022cvt_015
		var mode = this.getView().get_HArgv("-e");
		var dbh!: ScriptDB;

		if ("O" == mode || "o" == mode) {
// 2022cvt_015
			var result = this.getBillModel().delCopyDetailsData([this.pactId], this.tableNo.toString(), [this.getTargetCarrier()]);
		}

		// if (PEAR.isError(result)) {
		if (dbh.isError()) {
			this.rollback();
			return false;
		}

		return true;
	}

	async existsCopyRow(data: { pactid: any; copyid: any; copycoid: any; }, table: string) {
// 2022cvt_015
		var result = false;
// 2022cvt_015
		var sql = "SELECT COUNT(*) " + "FROM " + table + " " + "WHERE " + "pactid=" + this.get_DB().dbQuote(data.pactid, "int", true) + " AND copyid=" + this.get_DB().dbQuote(data.copyid, "text", true) + " AND copycoid=" + this.get_DB().dbQuote(data.copycoid, "int", true);

		if (0 < await this.get_DB().queryOne(sql)) {
			result = true;
		}

		return result;
	}

	begin() {
		this.get_DB().beginTransaction();
		return this;
	}

	rollback() {
		this.get_DB().rollback();
		this.initialize();
		return this;
	}

	commit() {
		this.get_DB().commit();
	}

	getPactList() {
		return this.pactList;
	}

	getPactCount() {
		return this.pactCount;
	}

	setView(view: ImportCanonView) {
// 2022cvt_026
		// require("view/script/ImportCanonView.php");

		if (view instanceof ImportCanonView) {
			this.canonView = view;
		}

		return this;
	}

	getView() {
		return this.canonView;
	}

	getScriptAmbient() {
		if (!(this.scriptAmbient instanceof MtScriptAmbient)) {
			this.scriptAmbient = new MtScriptAmbient();
		}

		return this.scriptAmbient;
	}

	getBillModel() {
		if (!(this.billModel instanceof BillModel)) {
			this.billModel = new BillModel();
		}

		return this.billModel;
	}

	getPostModel() {
		if (!(this.postModel instanceof PostModel)) {
			this.postModel = new PostModel();
		}

		return this.postModel;
	}

	setPactId(pactid: number) {
		// if (is_numeric(pactid)) {
		if (!isNaN(pactid)) {
			this.pactId = pactid;
		}

		return this;
	}

	initialize() {
		this.inputBillData = Array();
		this.inputCopyData = Array();
		this.inputCopyXData = Array();
		this.addCopyCnt = 0;
		this.addBillRow = 0;
		this.successPacts[this.pactId].addrow = this.addBillRow;
		this.successPacts[this.pactId].addcopy = this.addCopyCnt;
	}

	resultCount() {
// 2022cvt_015
		var copy: number;
// 2022cvt_015
		var bill = copy = 0;

// 2022cvt_015
		for (var cnts of (this.successPacts)) {
			bill += cnts["addrow"];
			copy += cnts["addcopy"];
		}

		this.successPacts["all"] = { "addrow": bill, "addcopy": copy }
		return this;
	}

	getSuccessPacts() {
		return this.successPacts;
	}

	setOutPutBill(billData) {
		this.setOutPut(this.copyDetailsTable, this.inputBillData, billData);
		this.addBillRow++;
	}

	setOutPutCopy(table, inputData, copyData) {
		this.setOutPut(table, inputData, copyData);
		this.addCopyCnt++;
	}

	initializeBillValue(codeList: { [x: string]: { [x: string]: { name: any; }; }; }, serial: string) {
// 2022cvt_015
		var initDatas = Array();
// 2022cvt_015
		var detailNo = 0;

// 2022cvt_015
		for (var code of (this.importCodes)) {
			initDatas[code] = {
				pactid: this.pactId,
				copyid: serial,
				copycoid: this.getTargetCarrier(),
				code: code,
				codename: codeList[this.getTargetCarrier()!][code].name,
				charge: undefined,
				taxkubun: "個別",
				printcount: undefined,
				detailno: detailNo++,
				recdate: this.get_DB().getNow()
			};
		}

		return initDatas;
	}

	mergeBillData(billData: { [key: string]: any }, rows: any[]) {
		billData[ImportCanonModel.CODE_ADD_BASIC].charge = rows[ImportCanonModel.COL_ADD_BASIC];
		billData[ImportCanonModel.CODE_ADD_MIN].charge = rows[ImportCanonModel.COL_ADD_MIN];
		billData[ImportCanonModel.CODE_BASIC].charge = rows[ImportCanonModel.COL_BASIC];
		billData[ImportCanonModel.CODE_MIN_CHARGE].charge = rows[ImportCanonModel.COL_MIN_CHARGE];
		billData[ImportCanonModel.CODE_ACCESSORIES].charge = rows[ImportCanonModel.COL_ACCESSORIES];
		billData[ImportCanonModel.CODE_TOTAL].charge = rows[ImportCanonModel.COL_TOTAL];
		billData[ImportCanonModel.CODE_TAX].charge = rows[ImportCanonModel.COL_TAX];
		billData[ImportCanonModel.CODE_DISCOUNT].charge += rows[ImportCanonModel.COL_DISCOUNT];
		billData[ImportCanonModel.CODE_PREMIUM].charge += rows[ImportCanonModel.COL_PREMIUM];
		billData[ImportCanonModel.CODE_TOTAL].printcount += rows[ImportCanonModel.COL_COUNTER];
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
