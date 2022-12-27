//
//Xeroxインポートモデル
//
//@uses ModelBase
//@package
//@author web
//@since 2013/04/19
//

require("model/ModelBase.php");

require("MtScriptAmbient.php");

require("model/BillModel.php");

require("model/PostModel.php");

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
class ImportXeroxModel extends ModelBase {
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
		this.setTargetCarrier(this.getSetting().XEROX_COPY_COID);
	}

	setTableNo(tableNo) {
		if (is_numeric(tableNo)) {
			this.tableNo = tableNo;
			this.copyXTable = this.copyXTable.replace(/tableNo/g, this.tableNo);
			this.copyDetailsTable = this.copyDetailsTable.replace(/tableNo/g, this.tableNo);
		}
	}

	setUnregistPacts() {
		var sql = "SELECT pactid FROM pact_tb WHERE pactid IN (" + ", ".join(this.getPactList()) + ") GROUP BY pactid ORDER BY pactid";
		var list = this.get_DB().queryCol(sql);
		this.unregistPact = array_diff(this.getPactList(), list);
	}

	setCommonDataDir(path = undefined) {
		if (!is_null(path)) {
			var dir = path;
		} else {
			dir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.getView().get_HArgv("-y") + "/" + this.getSetting().COPY_XEROX_DIR + "/";
		}

		if (this.getScriptAmbient().isDircheck(dir)) {
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

	analysisFile() {
		this.initialize();
		var codeList = this.getBillModel().getCopyUtiwake([this.getTargetCarrier()]);

		if (-1 !== this.unregistPact.indexOf(this.pactId)) {
			this.errorOut(1000, "pactId=" + this.pactId + "\uFF1A\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u4F1A\u793E\u3067\u3059\n", 0, "", "");
			return false;
		}

		this.dataDir = this.commonDataDir + "/" + this.pactId;
		var fileList = this.getScriptAmbient().getFileList(this.dataDir);

		if (0 < fileList.length) {
			for (var file of Object.values(fileList)) {
				var detailNo, row;
				var fp = fopen(this.dataDir + "/" + file, "r");
				var lineCnt = detailNo = 0;

				while (false !== (row = fgets(fp))) //機種名に余計なのがあれば無視
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

					var c_row = mb_convert_encoding(row, "UTF-8");
					var rows = c_row.split(",");

					if (preg_match("/[^0-9a-zA-Z]/", row[ImportXeroxModel.COL_MACNAME])) {
						continue;
					}

					var billData = {
						pactid: this.pactId,
						copyid: rows[ImportXeroxModel.COL_COPYID],
						copycoid: this.getTargetCarrier(),
						code: ImportXeroxModel.CODE_MAINTE,
						codename: codeList[this.getTargetCarrier()][ImportXeroxModel.CODE_MAINTE].name,
						charge: rows[ImportXeroxModel.COL_MAINTE_COST],
						taxkubun: "\u500B\u5225",
						printcount: undefined,
						detailno: detailNo++,
						recdate: this.get_DB().getNow()
					};
					this.setOutPutBill(billData);
					billData = {
						pactid: this.pactId,
						copyid: rows[ImportXeroxModel.COL_COPYID],
						copycoid: this.getTargetCarrier(),
						code: ImportXeroxModel.CODE_BLACK,
						codename: codeList[this.getTargetCarrier()][ImportXeroxModel.CODE_BLACK].name,
						charge: rows[ImportXeroxModel.COL_BK_PRICE],
						taxkubun: "\u500B\u5225",
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
						codename: codeList[this.getTargetCarrier()][ImportXeroxModel.CODE_COLOR].name,
						charge: rows[ImportXeroxModel.COL_CL_PRICE],
						taxkubun: "\u500B\u5225",
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
						codename: codeList[this.getTargetCarrier()][ImportXeroxModel.CODE_USE].name,
						charge: rows[ImportXeroxModel.COL_USEBILL],
						taxkubun: "\u500B\u5225",
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
						codename: codeList[this.getTargetCarrier()][ImportXeroxModel.CODE_TAX].name,
						charge: rows[ImportXeroxModel.COL_TAX],
						taxkubun: "\u500B\u5225",
						printcount: undefined,
						detailno: detailNo++,
						recdate: this.get_DB().getNow()
					};
					this.setOutPutBill(billData);
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

	importBillData() {
		if (1 > this.inputBillData.length) {
			this.errorOut(1000, "\u30A4\u30F3\u30DD\u30FC\u30C8\u3059\u308B\u8ACB\u6C42\u30C7\u30FC\u30BF\u304C\u751F\u6210\u3055\u308C\u3066\u3044\u307E\u305B\u3093\n", 0, "", "");
			return -1;
		}

		{
			let _tmp_0 = this.inputBillData;

			for (var key in _tmp_0) {
				var data = _tmp_0[key];

				if (!data.charge && 0 !== data.charge) {
					this.inputBillData[key].charge = 0;
				}

				if (!data.printcount && 0 !== data.printcount) {
					this.inputBillData[key].printcount = 0;
				}
			}
		}
		var result = this.get_DB().pgCopyFromArray(this.copyDetailsTable, this.inputBillData);

		if (!result) {
			this.rollback();
			this.errorOut(1000, "\u8ACB\u6C42\u30C7\u30FC\u30BF\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\n", 0, "", "");
			return false;
		}

		return true;
	}

	importCopy() {
		if (0 < this.inputCopyData.length) {
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
		var mode = this.getView().get_HArgv("-e");

		if ("O" == mode || "o" == mode) {
			var result = this.getBillModel().delCopyDetailsData([this.pactId], this.tableNo, [this.getTargetCarrier()]);
		}

		if (PEAR.isError(result)) {
			this.rollback();
			return false;
		}

		return true;
	}

	existsCopyRow(data, table) {
		var result = false;
		var sql = "SELECT COUNT(*) " + "FROM " + table + " " + "WHERE " + "pactid=" + this.get_DB().dbQuote(data.pactid, "int", true) + " AND copyid=" + this.get_DB().dbQuote(data.copyid, "text", true) + " AND copycoid=" + this.get_DB().dbQuote(data.copycoid, "int", true);

		if (0 < this.get_DB().queryOne(sql)) {
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

	setView(view) {
		require("view/script/ImportXeroxView.php");

		if (view instanceof ImportXeroxView) {
			this.xeroxView = view;
		}

		return this;
	}

	getView() {
		return this.xeroxView;
	}

	getScriptAmbient() {
		if (!this.scriptAmbient instanceof MtScriptAmbient) {
			this.scriptAmbient = new MtScriptAmbient();
		}

		return this.scriptAmbient;
	}

	getBillModel() {
		if (!this.billModel instanceof BillModel) {
			this.billModel = new BillModel();
		}

		return this.billModel;
	}

	getPostModel() {
		if (!this.postModel instanceof PostModel) {
			this.postModel = new PostModel();
		}

		return this.postModel;
	}

	setPactId(pactid) {
		if (is_numeric(pactid)) {
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
		var copy;
		var bill = copy = 0;

		for (var cnts of Object.values(this.successPacts)) {
			bill += cnts.addrow;
			copy += cnts.addcopy;
		}

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
		this.setOutPut(this.copyDetailsTable, this.inputBillData, billData);
		this.addBillRow++;
	}

	setOutPutCopy(table, inputData, copyData) {
		this.setOutPut(table, inputData, copyData);
		this.addCopyCnt++;
	}

	__destruct() {
		super.__destruct();
	}

};