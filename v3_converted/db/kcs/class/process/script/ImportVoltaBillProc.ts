//
//Voltaデータ取込処理 （Process）
//
//更新履歴：<br>
//2010/08/05 宝子山浩平 作成
//
//@package script
//@subpackage Process
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2010/08/05
//@uses MtTableUtil
//@uses PactModel
//@uses BillModel
//@uses FuncModel
//@uses ProcessBaseBatch
//@uses ImportVoltaView
//@uses ImportVoltaModel
//
//error_reporting(E_ALL|E_STRICT);
//
//Voltaデータ取込処理 （Process）
//
//@uses ProcessBaseBatch
//@package script
//@author houshiyama
//@since 2010/08/05
//

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/ImportVoltaBillView.php");

require("model/script/ImportVoltaBillModel.php");

//
//コンストラクタ
//
//@author maeda
//@since 2010/08/05
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2010/08/05
//
//@param array $H_param
//@access protected
//@return void
//
//
//通信処理
//
//@author houshiyama
//@since 2010/08/06
//
//@access protected
//@return void
//
//
//利用明細の取込処理
//
//@author houshiyama
//@since 2010/08/06
//
//@param mixed $A_usehistories
//@access protected
//@return void
//
//
//請求明細の取込処理
//
//@author houshiyama
//@since 2010/08/06
//
//@param mixed $A_usehistories
//@access protected
//@return void
//
//
//pactcodeからpactid取得（メンバー変数）
//
//@author houshiyama
//@since 2010/08/09
//
//@param mixed $pactcode
//@access protected
//@return bool
//protected function getPactIdFromPactcode($pactcode)
//{
//foreach ($this->A_pact as $H_pact) {
//if ($pactcode == $H_pact["ev_pactcode"]) {
//return $H_pact["pactid"];
//}
//}
//return false;
//}
//
//
//請求用のディレクトリ作成
//
//@author houshiyama
//@since 2010/08/09
//
//@access protected
//@return $billDir
//
//
//pact毎のディレクトリ作成
//
//@author houshiyama
//@since 2010/08/09
//
//@param mixed $pactid
//@access protected
//@return $pactDir
//
//
//BillModel取得
//
//@author houshiyama
//@since 2010/08/09
//
//@access protected
//@return BillModel
//
//
//FuncModel取得
//
//@author houshiyama
//@since 2010/08/09
//
//@access protected
//@return FuncModel
//
//
//PactModel取得
//
//@author houshiyama
//@since 2010/08/09
//
//@access protected
//@return PactModel
//
//
//デストラクタ
//
//@author maeda
//@since 2010/08/05
//
//@access public
//@return void
//
class ImportVoltaBillProc extends ProcessBaseBatch {
	static BILL_DIR = "bill";
	static REQUEST_TO = "sales/list/";
	static SUCCESS_CODE = "1000";
	static TAX_KUBUN = "\u5185\u7A0E";

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//設定取得
	//View,Modelの生成
	//請求データディレクトリを取得
	{
		super(H_param);
		this.getSetting().loadConfig("volta");
		this.O_View = new ImportVoltaBillView();
		this.O_Model = new ImportVoltaBillModel(this.get_MtScriptAmbient());
		this.dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate + this.getSetting().VOLTA_DIR + "/" + ImportVoltaBillProc.BILL_DIR + "/";
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//処理開始
	//終了
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.infoOut("Volta\u8ACB\u6C42\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);

		try //スクリプトの二重起動防止ロック
		//引数の値をメンバーに
		//対象テーブル番号を取得
		//未確定に対応 20100924miya
		//通信
		{
			this.lockProcess(this.O_View.get_ScriptName());
			this.A_pact = this.O_Model.getPactIds(this.O_View.get_HArgv("-p"));
			this.BillDate = this.O_View.get_HArgv("-y");
			this.BackUpFlg = this.O_View.get_HArgv("-b");

			if ("none" == this.BillDate) {
				this.tableNo = "";
			} else {
				this.tableNo = MtTableUtil.getTableNo(this.BillDate, false);
			}

			var H_response = this.requestVoltaApi(this.A_pact);

			if (!("usehistories" in H_response)) {
				this.infoOut("\u5229\u7528\u660E\u7D30\u60C5\u5831\u306F\u3042\u308A\u307E\u305B\u3093\n", 1);
			} else {
				this.importUseHistories(H_response.usehistories);
			}

			if (!("details" in H_response)) {
				this.infoOut("\u8ACB\u6C42\u660E\u7D30\u60C5\u5831\u306F\u3042\u308A\u307E\u305B\u3093\n", 1);
			} else {
				this.importDetails(H_response.details);
			}
		} catch (e) {
			this.infoOut(e.getMessage(), 1);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("Volta\u8ACB\u6C42\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 1);
	}

	requestVoltaApi(A_pact) //月指定 未確定に対応 20100924miya
	//cgiパラメータ
	//ヘッダー追加
	//オプション
	//通信
	{
		var url = this.getSetting().VOLTA_URL + ImportVoltaBillProc.REQUEST_TO;

		if ("none" == this.BillDate) {
			var yearmonth = date("Ym");
		} else {
			yearmonth = this.BillDate;
		}

		var H_params = Array();
		H_params.apikey = this.getSetting().API_KEY;
		H_params.yearmonth = yearmonth;
		H_params.pactcodes = Array();

		for (var H_pact of Object.values(A_pact)) {
			H_params.pactcodes.push(H_pact.ev_pactcode);
		}

		var H_header = [this.getSetting().VOLTA_HEADER, this.getSetting().VOLTA_CONTENT_TYPE];
		var H_option = {
			http: {
				method: "POST",
				content: http_build_query(H_params),
				header: H_header.join("\r\n")
			}
		};

		if (!(contents = file_get_contents(url, false, stream_context_create(H_option)))) {
			throw new Error("\u901A\u4FE1\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\n");
		}

		parse_str(contents, H_response);

		if (H_response.responsecode != 1000) {
			throw new Error("\u901A\u4FE1\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\n");
		}

		return H_response;
	}

	importUseHistories(A_usehistories) //未確定に対応 20100924miya
	//エクスポート
	{
		if ("" == this.tableNo) {
			var table = "ev_usehistory_tb";
		} else {
			table = "ev_usehistory_" + this.tableNo + "_tb";
		}

		var pactid = "";
		var pactcode = "";
		var A_output = Array();
		var A_pactid = Array();
		var now = this.get_DB().getNow();

		if ("Y" == this.BackUpFlg) {
			var expFile = this.getBillDir() + "/" + table + date("YmdHis") + ".exp";

			if (!this.expData(table, expFile, this.getSetting().NUM_FETCH)) {
				throw die(-1);
			}
		}

		for (var H_row of Object.values(A_usehistories)) //pactid取得
		{
			if (!(pactid = this.getPactModel().getPactIdFromAgentIdPactcode(H_row.agentid, H_row.pactcode))) {
				throw new Error("agentid,pactcode\u304B\u3089pactid\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\n");
			}

			if (pactcode != H_row.pactcode) {
				pactcode = H_row.pactcode;
				var pactDir = this.getPactDir(pactid);
				A_pactid.push(pactid);
			}

			A_output.push({
				pactid: pactid,
				evid: H_row.loginid,
				evcoid: ImportVoltaModel.EV_CO_ID,
				charge_date: H_row.charge_date,
				charge_station: H_row.stationname,
				charge_type: H_row.charge_type,
				charge_start: H_row.evstarttime,
				charge_end: H_row.evendtime,
				charge_time: H_row.charge_time,
				charge_power: 0,
				charge_fee: H_row.selectprice,
				uniqueid: H_row.transactionid,
				delflg: "false",
				recdate: now,
				charge_usestart: H_row.usestarttime,
				charge_useend: H_row.useendtime,
				charge_usetime: H_row.charge_usetime
			});
		}

		if (A_output.length > 0) //トランザクション開始
			//元データ削除
			{
				this.get_DB().beginTransaction();
				this.getBillModel().delEvUseHistoryData(A_pactid, this.tableNo, [ImportVoltaModel.EV_CO_ID]);

				if (!this.get_DB().pgCopyFromArray(table, A_output)) //取込失敗した会社をev_index_tbに記録 20100924miya
					{
						this.get_DB().rollback();
						this.errorOut(1000, "\n" + table + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
						this.O_Model.recordEvIndex(A_output, "false");
						throw die(-1);
					} else //取り込んだ会社をev_index_tbに記録 2010924miya
					{
						this.O_Model.recordEvIndex(A_output, "true");
						this.infoOut(table + " \u3078\u5229\u7528\u660E\u7D30\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
					}
			}
	}

	importDetails(A_details) //未確定に対応 20100924miya
	//エクスポート
	{
		if ("" == this.tableNo) {
			var table = "ev_details_tb";
		} else {
			table = "ev_details_" + this.tableNo + "_tb";
		}

		var pactcode = "";
		var A_output = Array();
		var A_pactid = Array();
		var now = this.get_DB().getNow();
		var detailno = 0;

		if ("Y" == this.BackUpFlg) {
			var expFile = this.getBillDir() + "/" + table + date("YmdHis") + ".exp";

			if (!this.expData(table, expFile, this.getSetting().NUM_FETCH)) {
				throw die(-1);
			}
		}

		for (var cnt = 0; cnt < A_details.length; cnt++) //pactid取得
		//ID単位最終レコード
		{
			var pactid;
			var H_row = A_details[cnt];

			if (!(pactid = this.getPactModel().getPactIdFromAgentIdPactcode(H_row.agentid, H_row.pactcode))) {
				throw new Error("agentid,pactcode\u304B\u3089pactid\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\n");
			}

			if (pactcode != H_row.pactcode) //会社権限リストを取得
				{
					pactcode = H_row.pactcode;
					var H_function = this.getFuncModel().getPactFunc(pactid, undefined, false);
					var H_kamoku = this.O_Model.getKamokuName(pactid);
					var pactDir = this.getPactDir(pactid);
					A_pactid.push(pactid);
				}

			if (!(undefined !== A_details[cnt - 1]) || A_details[cnt].loginid != A_details[cnt - 1].loginid) {
				detailno = 0;
			}

			A_output.push({
				pactid: pactid,
				evid: H_row.loginid,
				evcoid: ImportVoltaModel.EV_CO_ID,
				code: H_row.code,
				codename: H_row.codename,
				number: H_row.number,
				charge: H_row.charge,
				taxkubun: ImportVoltaBillProc.TAX_KUBUN,
				detailno: detailno,
				recdate: now
			});
			detailno++;

			if (!(undefined !== A_details[cnt + 1]) || A_details[cnt].loginid != A_details[cnt + 1].loginid) //ASP料金が発生する場合
				{
					var aspCharge = 0;
					var asxCharge = 0;

					if (-1 !== Object.keys(H_function).indexOf("fnc_asp")) //ASP料金を取得
						{
							if (!(aspCharge = this.getBillModel().getEvAspCharge(pactid, ImportVoltaModel.EV_CO_ID))) {
								this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + pactid + " \u306E\uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
								continue;
							}

							asxCharge = +(aspCharge * this.getSetting().excise_tax);
						}

					A_output.push({
						pactid: pactid,
						evid: H_row.loginid,
						evcoid: ImportVoltaModel.EV_CO_ID,
						code: "ASP",
						codename: H_kamoku[ImportVoltaBillModel.ASP_KAMOKUID],
						number: 1,
						charge: aspCharge,
						taxkubun: undefined,
						detailno: detailno + 1,
						recdate: now
					});
					A_output.push({
						pactid: pactid,
						evid: H_row.loginid,
						evcoid: ImportVoltaModel.EV_CO_ID,
						code: "ASX",
						codename: H_kamoku[ImportVoltaBillModel.ASX_KAMOKUID],
						number: 1,
						charge: asxCharge,
						taxkubun: undefined,
						detailno: detailno + 2,
						recdate: now
					});
				}
		}

		if (A_output.length > 0) //トランザクション開始
			//元データ削除
			{
				this.get_DB().beginTransaction();
				this.getBillModel().delEvDetailsData(A_pactid, this.tableNo, [ImportVoltaModel.EV_CO_ID]);

				if (!this.get_DB().pgCopyFromArray(table, A_output)) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + table + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else {
					this.infoOut(table + " \u3078\u8ACB\u6C42\u660E\u7D30\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}
	}

	getBillDir() //ディレクトリ作成
	{
		var billDir = this.dataDir;

		if (this.isDirCheck(billDir, "rw") == false) {
			if (false === system("/bin/mkdir -p " + billDir)) {
				throw new Error("\u8ACB\u6C42\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\n");
			}
		}

		return billDir;
	}

	getPactDir(pactid) //ディレクトリ作成
	{
		var pactDir = this.dataDir + "/" + pactid + "/";

		if (this.isDirCheck(pactDir, "rw") == false) {
			if (false === system("/bin/mkdir -p " + pactDir)) {
				throw new Error("pact\u7528\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\n");
			}
		}

		return pactDir;
	}

	getBillModel() {
		if (!this.O_BillModel instanceof BillModel) {
			this.O_BillModel = new BillModel();
		}

		return this.O_BillModel;
	}

	getFuncModel() {
		if (!this.O_FuncModel instanceof FuncModel) {
			this.O_FuncModel = new FuncModel();
		}

		return this.O_FuncModel;
	}

	getPactModel() {
		if (!this.O_PactModel instanceof PactModel) {
			this.O_PactModel = new PactModel();
		}

		return this.O_PactModel;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};