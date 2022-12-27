import ModelBase from "../ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";
import BillModel from "../../model/BillModel";
import PostModel from "../PostModel";
import ImportXeroxView from "../../view/script/ImportXeroxView";
import * as fs from "fs"
import * as Encoding from "encoding-japanese";
// const fs = require('fs');
//機種名
//コピー機ID
//機械維持料金
//黒モード枚数
//黒モード料金
//カラーモード枚数
//カラーモード料金
//請求書海金額
//消費税
//object member
//member
//
//__construct
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
//
//インポート対象のXテーブルを設定
//
//@author web
//@since 2013/04/22
//
//@param mixed $tableNo
//@access public
//@return void
//
//
//処理候補の中からpact_tbにない会社をリスト化
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
//
//請求データディレクトリを設定
//
//@author web
//@since 2013/04/19
//
//@param mixed $path
//@access public
//@return void
//
//
//請求データディレクトリを取得
//
//@author web
//@since 2013/04/19
//
//@param mixed $path
//@access public
//@return void
//
//
//処理対象のcaridを設定
//
//@author web
//@since 2013/04/19
//
//@param mixed $carid
//@access public
//@return void
//
//
//処理対象のcaridを取得
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
//
//処理対象社をリスト化
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
//
//請求ファイルの解析・COPY用配列作成
//
//@author web
//@since 2013/04/22
//
//@access public
//@return void
//
//
//請求データをcopy_details_xx_tbにCOPY
//
//@author web
//@since 2013/04/22
//
//@access public
//@return void
//
//
//コピー機をcopy_xx_tbにCOPY
//
//@author web
//@since 2013/04/22
//
//@access public
//@return void
//
//
//請求データを削除
//
//@author web
//@since 2013/04/22
//
//@access public
//@return void
//
//
//コピー機の存在チェック
//
//@author web
//@since 2013/04/23
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
//@since 2013/04/22
//
//@access public
//@return void
//
//
//rollback
//
//@author web
//@since 2013/04/26
//
//@access private
//@return void
//
//
//commit
//
//@author web
//@since 2013/04/22
//
//@access public
//@return void
//
//
//処理候補のリストを取得
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
//
//処理候補社数を取得
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
//
//setView
//
//@author web
//@since 2013/04/19
//
//@param mixed $view
//@access public
//@return void
//
//
//getView
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
//
//MtScriptAmbientクラスのオブジェクトを取得
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
//
//BillModelのオブジェクトを取得
//
//@author web
//@since 2013/04/19
//
//@access protected
//@return void
//
//
//PostModelのオブジェクトを取得
//
//@author web
//@since 2013/04/19
//
//@access protected
//@return void
//
//
//処理中のpactidを設定
//
//@author web
//@since 2013/04/25
//
//@param mixed $pactid
//@access public
//@return void
//
//
//インポート用配列の初期化
//
//@author web
//@since 2013/04/25
//
//@access private
//@return void
//
//
//resultCount
//
//@author web
//@since 2013/04/26
//
//@access public
//@return void
//
//
//getSuccessPacts
//
//@author web
//@since 2013/04/26
//
//@access public
//@return void
//
//
//setOutPutBill
//
//@author web
//@since 2013/04/26
//
//@param mixed $billData
//@access private
//@return void
//
//
//setOutPutCopy
//
//@author web
//@since 2013/04/26
//
//@param mixed $table
//@param mixed $inputData
//@param mixed $copyData
//@access private
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/04/19
//
//@access public
//@return void
//
export default class ImportXeroxModel extends ModelBase {
	inputBillData: any;
	inputCopyData: any;
	inputCopyXData: any;
	addCopyCnt: number;
	addBillRow: number;
	pactList: any;
	pactCount: number;
	unregistPact: any;
	copyTable: string;
	copyXTable: string;
	copyDetailsTable: string;
	successPacts: any;
	tableNo: any;
	commonDataDir: any;
	targetCarrier: any;
	pactId: any;
	dataDir: any;
	xeroxView: any;
	scriptAmbient: any;
	billModel: any;
	postModel: any;

	static COL_MACNAME = 1;
	static COL_COPYID = 2;
	static COL_MAINTE_COST = 3;
	static COL_BK_CNT = 4;
	static COL_BK_PRICE = 6;
	static COL_CL_CNT = 7;
	static COL_CL_PRICE = 9;
	static COL_USEBILL = 10;
	static COL_TAX = 11;
	static CODE_MAINTE = "001";
	static CODE_BLACK = "002";
	static CODE_COLOR = "003";
	static CODE_USE = "004";
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
		this.setTargetCarrier(this.getSetting().get("XEROX_COPY_COID"));
	}

	setTableNo(tableNo) {
		// if (is_numeric(tableNo)) {
		if (!isNaN(Number(tableNo))) {
			this.tableNo = tableNo;
			this.copyXTable = this.copyXTable.replace(/tableNo/g, this.tableNo);
			this.copyDetailsTable = this.copyDetailsTable.replace(/tableNo/g, this.tableNo);
		}
	}

	async setUnregistPacts() {
// 2022cvt_015
        // var sql = "SELECT pactid FROM pact_tb WHERE pactid IN (" + ", ".join(this.getPactList()) + ") GROUP BY pactid ORDER BY pactid";
		var sql = "SELECT pactid FROM pact_tb WHERE pactid IN (" + this.getPactList().join(",") + ") GROUP BY pactid ORDER BY pactid";
// 2022cvt_015
		var list = await this.get_DB().queryCol(sql);
		// this.unregistPact = array_diff(this.getPactList(), list);
		this.unregistPact = this.getPactList().filter(x => !list.includes(Number(x)));
	}

	setCommonDataDir(path = undefined) {
		var dir;
		// if (!is_null(path)) {
		if (path) {
// 2022cvt_015
			dir = path;
		} else {
			dir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + this.getView().get_HArgv("-y") + "/" + this.getSetting().get("COPY_XEROX_DIR") + "/";
		}

		if (this.getScriptAmbient().isDirCheck(dir)) {
			this.commonDataDir = dir;
		}

		return this;
	}

	getCommonDataDir() {
		return this.commonDataDir;
	}

	setTargetCarrier(carid) {
		this.targetCarrier = carid;
		return this;
	}

	getTargetCarrier() {
		return this.targetCarrier;
	}

	makePactList() {
		this.pactList = this.getScriptAmbient().getPactList(this.setCommonDataDir().commonDataDir, this.getView().get_HArgv("-p"));

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

		if (this.unregistPact.includes(this.pactId)) {
			this.errorOut(1000, "pactId=" + this.pactId + "：登録されていない会社です\n", 0, "", "");
			return false;
		}

		this.dataDir = this.commonDataDir + "/" + this.pactId;
// 2022cvt_015
		var fileList = this.getScriptAmbient().getFileList(this.dataDir);

		if (0 < fileList.length) {
// 2022cvt_015
			for (var file of (fileList)) {
// 2022cvt_015
				var detailNo, row;
// 2022cvt_015
				// var fp = fopen(this.dataDir + "/" + file, "r");
				var buffer = fs.readFileSync(this.dataDir + "/" + file, "utf8");
				var text = Encoding.convert(buffer, {
					from: "SJIS",
					to: "UNICODE",
					type: "string"
				});
				var lines = text.toString().split("\r\n");
	
// 2022cvt_015
				var lineCnt = detailNo = 0;

				// while (false !== (row = fgets(fp))) //機種名に余計なのがあれば無視
				for (let row in lines) //機種名に余計なのがあれば無視
				//黒モード
				//カラー
				//利用料金
				//消費税
				//現在テーブルにコピー機をインポート
				{
					lineCnt++;

					if (1 == lineCnt) {
						continue;
					}

// 2022cvt_015
					// var c_row = mb_convert_encoding(row, "UTF-8");
// 2022cvt_015
                    // var rows = c_row.split(",");
					var rows = row.split(",");

// 2022cvt_019
					// if (preg_match("/[^0-9a-zA-Z]/", row[ImportXeroxModel.COL_MACNAME])) {
					//if (row[ImportXeroxModel.COL_MACNAME].match("/[^0-9a-zA-Z]/")) {
					//	continue;
					//}

// 2022cvt_015
					let billData = {
						pactid: this.pactId,
						copyid: rows[ImportXeroxModel.COL_COPYID],
						copycoid: this.getTargetCarrier(),
						code: ImportXeroxModel.CODE_MAINTE,
						codename: codeList[this.getTargetCarrier()][ImportXeroxModel.CODE_MAINTE]?.name,
						charge: rows[ImportXeroxModel.COL_MAINTE_COST],
						taxkubun: "個別",
						printcount: '',
						detailno: detailNo++,
						recdate: this.get_DB().getNow()
					};
					await this.setOutPutBill(billData);
					billData = {
						pactid: this.pactId,
						copyid: rows[ImportXeroxModel.COL_COPYID],
						copycoid: this.getTargetCarrier(),
						code: ImportXeroxModel.CODE_BLACK,
						codename: codeList[this.getTargetCarrier()][ImportXeroxModel.CODE_BLACK]?.name,
						charge: rows[ImportXeroxModel.COL_BK_PRICE],
						taxkubun: "個別",
						printcount: rows[ImportXeroxModel.COL_BK_CNT],
						detailno: detailNo++,
						recdate: this.get_DB().getNow()
					};
					this.setOutPutBill(billData);
					billData = {
						pactid: this.pactId,
						copyid: rows[ImportXeroxModel.COL_COPYID],
						copycoid: this.getTargetCarrier(),
						code: ImportXeroxModel.CODE_COLOR,
						codename: codeList[this.getTargetCarrier()][ImportXeroxModel.CODE_COLOR]?.name,
						charge: rows[ImportXeroxModel.COL_CL_PRICE],
						taxkubun: "個別",
						printcount: rows[ImportXeroxModel.COL_CL_CNT],
						detailno: detailNo++,
						recdate: this.get_DB().getNow()
					};
					this.setOutPutBill(billData);
					billData = {
						pactid: this.pactId,
						copyid: rows[ImportXeroxModel.COL_COPYID],
						copycoid: this.getTargetCarrier(),
						code: ImportXeroxModel.CODE_USE,
						codename: codeList[this.getTargetCarrier()][ImportXeroxModel.CODE_USE]?.name,
						charge: rows[ImportXeroxModel.COL_USEBILL],
						taxkubun: "個別",
						printcount: rows[ImportXeroxModel.COL_BK_CNT] + rows[ImportXeroxModel.COL_CL_CNT],
						detailno: detailNo++,
						recdate: this.get_DB().getNow()
					};
					this.setOutPutBill(billData);
					billData = {
						pactid: this.pactId,
						copyid: rows[ImportXeroxModel.COL_COPYID],
						copycoid: this.getTargetCarrier(),
						code: ImportXeroxModel.CODE_TAX,
						codename: codeList[this.getTargetCarrier()][ImportXeroxModel.CODE_TAX]?.name,
						charge: rows[ImportXeroxModel.COL_TAX],
						taxkubun: "個別",
						printcount: '',
						detailno: detailNo++,
						recdate: this.get_DB().getNow()
					};
					this.setOutPutBill(billData);
// 2022cvt_015
					var copyData = {
						pactid: this.pactId,
						postid: this.getPostModel().getRootPostid(this.pactId, 0, this.tableNo),
						copycoid: this.getTargetCarrier(),
						copyid: rows[ImportXeroxModel.COL_COPYID],
						copyname: rows[ImportXeroxModel.COL_MACNAME],
						delete_flg: "f",
						dummy_flg: "f",
						fixdate: this.get_DB().getNow(),
						recdate: this.get_DB().getNow()
					};

					if ("N" == this.getView().get_HArgv("-t") || "n" == this.getView().get_HArgv("-t")) //存在するコピー機は追加リストに加えない
						{
							if (!this.existsCopyRow(copyData, this.copyTable)) {
								this.setOutPutCopy(this.copyTable, this.inputCopyData, copyData);
							}
						}

					if (!this.existsCopyRow(copyData, this.copyXTable)) {
						this.setOutPutCopy(this.copyXTable, this.inputCopyXData, copyData);
					}
				}
			}
		}

		this.successPacts[this.pactId] = {
			pactid: this.pactId,
			addrow: this.addBillRow,
			addcopy: this.addCopyCnt
		};
		return true;
	}

	async importBillData() {
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
		var result = await this.get_DB().pgCopyFromArray(this.copyDetailsTable, this.inputBillData);

		if (!result) {
			this.rollback();
			this.errorOut(1000, "請求データのインポートに失敗\n", 0, "", "");
			return false;
		}

		return true;
	}

	async importCopy() {
		if (0 < this.inputCopyData.length) {
// 2022cvt_015
			var result = await this.get_DB().pgCopyFromArray(this.copyTable, this.inputCopyData);

			if (!result) {
				this.rollback();
				return false;
			}
		}

		if (0 < this.inputCopyXData.length) {
			result = await this.get_DB().pgCopyFromArray(this.copyXTable, this.inputCopyXData);

			if (!result) {
				this.rollback();
				return false;
			}
		}

		return true;
	}

	async deleteDetailsData() {
// 2022cvt_015
		var mode = this.getView().get_HArgv("-e");
		var dbh: any;

		if ("O" == mode || "o" == mode) {
// 2022cvt_015
			var result = await this.getBillModel().delCopyDetailsData([this.pactId], this.tableNo, [this.getTargetCarrier()]);
		}

		// if (PEAR.isError(result)) {
		if (dbh?.isError(result)) {
			this.rollback();
			return false;
		}

		return true;
	}

	async existsCopyRow(data, table) {
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
		return this.get_DB().beginTransaction();
	}

	rollback() {
		this.initialize();
		return this.get_DB().rollback();
	}

	commit() {
		return this.get_DB().commit();
	}

	getPactList() {
		return this.pactList;
	}

	getPactCount() {
		return this.pactCount;
	}

	setView(view) {
// 2022cvt_026
		// require("view/script/ImportXeroxView.php");

		if (view instanceof ImportXeroxView) {
			this.xeroxView = view;
		}

		return this;
	}

	getView() {
		return this.xeroxView;
	}

	getScriptAmbient() : MtScriptAmbient {
		if (!(this.scriptAmbient instanceof MtScriptAmbient)) {
			this.scriptAmbient = new MtScriptAmbient();
		}

		return this.scriptAmbient;
	}

	getBillModel() : BillModel {
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

	setPactId(pactid) {
		// if (is_numeric(pactid)) {
		if (!isNaN(Number(pactid))) {
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
		this.successPacts = {
			[this.pactId] : {
				addrow : this.addBillRow,
				addcopy : this.addCopyCnt
			}
		}
	}

	resultCount() {
// 2022cvt_015
		var copy;
// 2022cvt_015
		var bill = copy = 0;

// 2022cvt_015
		Object.values(this.successPacts).forEach(cnts => {
			const item = cnts as { addrow, addcopy };
			bill += item.addrow  ;
			copy += item.addcopy;
		})

		this.successPacts.all = {
			addrow: bill,
			addcopy: copy
		};
		return this;
	}

	getSuccessPacts() {
		return this.successPacts;
	}

	setOutPutBill(billData) {
		this.addBillRow++;
		return this.setOutPut(this.copyDetailsTable, this.inputBillData, billData);
	}

	setOutPutCopy(table, inputData, copyData) {
		this.setOutPut(table, inputData, copyData);
		this.addCopyCnt++;
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
