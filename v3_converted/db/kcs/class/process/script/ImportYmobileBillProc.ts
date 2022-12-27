//Ymobileインポート
//    WILLCOMのインポートを元にしている
//    (WILLCOMとファイル構成が同じと聞いたので・・)
//    2019527 伊達改造
//
//error_reporting(E_ALL|E_STRICT);
//
//ImportYmobileBillProc
//Ymobileのインポート
//@uses ProcessBaseBatch
//@package
//@author web
//@since 2019/05/27
//

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/FuncModel.php");

require("model/TelModel.php");

require("model/ClampModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/ImportYmobileBillView.php");

require("model/script/ImportYmobileBillModel.php");

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
class ImportYmobileBillProc extends ProcessBaseBatch {
	static TOTAL_POSTNAME = "\u7DCF\u8A08";
	static TOTAL_CODENAME = "\u5408\u8A08";
	static ASPCODE = "ASP";
	static ASXCODE = "ASX";
	static ASPCODENAME = "ASP\u4F7F\u7528\u6599";
	static ASXCODENAME = "ASP\u4F7F\u7528\u6599\u6D88\u8CBB\u7A0E";
	static SCRIPTNAME = "ImportYmobileBill";

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.A_pactDone = Array();
		this.exit = 0;
		this.getSetting().loadConfig("ymobile");
		this.O_View = new ImportYmobileBillView();
		this.O_Model = new ImportYmobileBillModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //初期処理
	//終了処理
	{
		this.preExecute();

		try //処理完了したpactidを格納
		//内訳コード取得
		//pactid 毎に処理する
		//処理したpactあり
		{
			var A_pactDone = Array();
			this.setUtiwakeHash();

			for (var pcnt = 0; pcnt < this.A_pactid.length; pcnt++) //pactid が会社マスターに登録されていない場合（スクリプト続行 次のpactidへスキップ）
			{
				if (undefined !== this.H_pactid[this.A_pactid[pcnt]] == false) {
					this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + this.A_pactid[pcnt] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
					continue;
				}

				A_outPut[this.A_pactid[pcnt]] = this.import(this.A_pactid[pcnt]);

				if (false == A_outPut[this.A_pactid[pcnt]]) {
					this.exit = -1;
					continue;
				}

				A_pactDone.push(this.A_pactid[pcnt]);
			}

			for (var key in A_pactDone) //未登録内訳コードがあれば登録してここで終了
			{
				var pid = A_pactDone[key];

				if (!!A_outPut[pid].utiwake_tb) //トランザクション開始
					//コミット
					{
						this.get_DB().beginTransaction();

						if (false == this.get_DB().pgCopyFromArray("utiwake_tb", A_outPut[pid].utiwake_tb)) {
							this.get_DB().rollback();
							this.errorOut(1000, "utiwake_tb \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
							throw die(-1);
						}

						this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + pid + " \u672A\u767B\u9332\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u5B58\u5728\u3057\u305F\u306E\u3067\u4EEE\u767B\u9332\u3057\u3066\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3057\u305F\n", 1);
						this.get_DB().commit();
						delete A_pactDone[key];
						this.exit = -1;
					}
			}

			if (A_pactDone.length > 0) //エクスポートする場合
				{
					if ("Y" == this.BackUpFlg) {
						var expFile = this.dataDir + this.details_tb + date("YmdHis") + ".exp";

						if (false == this.expData(this.details_tb, expFile, this.getSetting().NUM_FETCH)) {
							throw new Error("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30D5\u30A1\u30A4\u30EB\u4F5C\u6210\u5931\u6557");
						}
					}

					for (var pid of Object.values(A_pactDone)) //トランザクション開始
					//モードがオーバーライトの時はデータをインポートする前に削除
					//コミット
					//処理が完了したファイルを移動
					//移動元ディレクトリ
					//移動先ディレクトリ
					{
						this.get_DB().beginTransaction();

						if ("O" == this.Mode) {
							this.getBillModel().delTelDetailsData([pid], this.tableNo, [this.getSetting().CARID]);
							this.infoOut(this.details_tb + "\u306E\u30C7\u30FC\u30BF\u524A\u9664\u5B8C\u4E86\n", 1);
						}

						{
							let _tmp_0 = A_outPut[pid];

							for (var table in _tmp_0) {
								var H_data = _tmp_0[table];

								if (H_data.length > 0) {
									if (false == this.get_DB().pgCopyFromArray(table, H_data)) {
										this.get_DB().rollback();
										this.errorOut(1000, "\n" + table + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
										throw die(-1);
									} else {
										this.infoOut(table + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
									}
								}
							}
						}
						this.get_DB().commit();
						var fromDir = this.dataDir + pid;
						var finDir = fromDir + "/fin";
						this.mvFile(fromDir, finDir);
					}
				}
		} catch (e) {
			this.infoOut(e.getMessage(), 1);
			this.exit = -1;
		}

		this.getOut().flushMessage();
		this.postExecute(this.exit);
	}

	getPactModel() {
		if (!this.O_PactModel instanceof PactModel) {
			this.O_PactModel = new PactModel();
		}

		return this.O_PactModel;
	}

	getPostModel() {
		if (!this.O_PostModel instanceof PostModel) {
			this.O_PostModel = new PostModel();
		}

		return this.O_PostModel;
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

	getTelModel() {
		if (!this.O_TelModel instanceof TelModel) {
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
		this.infoOut("Y!mobile(\u65E7WILLCOM)\u8ACB\u6C42\u660E\u7D30\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);
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
		this.setTargetTables(this.BillDate);
		this.H_pactid = this.getPactModel().getPactIdCompNameFromPact();
	}

	postExecute(exit) //スクリプトの二重起動防止ロック解除
	//終了
	{
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("Y!mobile(\u65E7WILLCOM)\u8ACB\u6C42\u660E\u7D30\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 1);
		throw die(exit);
	}

	getDataDir(date) //請求データディレクトリを取得
	//請求データディレクトリチェック（スクリプト終了）
	{
		var dataDir = this.O_Model.getDataDir(date);

		if (this.isDirCheck(dataDir, "rw") == false) {
			this.errorOut(1000, this.getSetting().WILLCOM + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			throw die(-1);
		}

		return dataDir;
	}

	getPactList(dir, pactid) //処理する契約ＩＤを取得する
	//処理する契約ＩＤが１件もない場合（スクリプト終了）
	{
		var A_pactid = super.getPactList(dir, pactid);
		A_pactid.sort();

		if (0 == A_pactid.length) {
			this.errorOut(1000, "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0, "", "");
			throw die(-1);
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

	import(pactid) //出力用配列
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
		var A_outPut = Array();
		A_outPut[this.utiwake_tb] = Array();
		A_outPut[this.details_tb] = Array();
		A_outPut[this.manageX_tb] = Array();
		A_outPut.tel_amount_bill_tb = Array();
		var dataDirPact = this.dataDir + pactid;
		var A_billFile = this.getFileList(dataDirPact);

		if (0 == A_billFile.length) {
			this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + pactid + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
			return false;
		}

		A_billFile.sort();
		var A_allFileData = Array();
		var A_utiwakeNew = Array();

		for (var fcnt = 0; fcnt < A_billFile.length; fcnt++) //ファイルデータ配列
		//未登録内訳コード取得
		{
			if (!this.checkFileName(pactid, dataDirPact + "/" + A_billFile[fcnt])) {
				this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + pactid + " \u3068\u30D5\u30A1\u30A4\u30EB\u540D\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093 \u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
				return false;
			}

			var A_fileData = Array();
			var A_tmpUtiwakeNew = this.O_Model.getUnregistCode(dataDirPact + "/" + A_billFile[fcnt], this.H_utiwake);

			if (!A_tmpUtiwakeNew) //データファイルを取得
				{
					if (!(A_fileData = this.O_Model.getBillData(pactid, dataDirPact + "/" + A_billFile[fcnt]))) {
						this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + pactid + " \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u4E0D\u6B63\u306A\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
						return false;
					} else //複数ファイルデータをマージ
						{
							A_allFileData = array_merge(A_allFileData, A_fileData);
						}
				} else {
				A_utiwakeNew = A_utiwakeNew + A_tmpUtiwakeNew;
			}
		}

		if (!!A_utiwakeNew) //utiwake_tb へ登録用配列
			{
				for (var H_row of Object.values(A_utiwakeNew)) {
					this.O_Model.setOutPut(this.utiwake_tb, A_outPut[this.utiwake_tb], H_row);
					this.H_utiwake[H_row.code] = {
						name: H_row.name,
						taxtype: H_row.taxtype,
						codetype: H_row.codetype
					};
				}

				return A_outPut;
			}

		this.A_unregist = Array();
		var A_codeInFile = this.O_Model.convertSimpleArray(A_allFileData, "code");
		{
			let _tmp_1 = this.H_utiwake;

			for (var code in _tmp_1) {
				var H_row = _tmp_1[code];

				if (H_row.codetype == ImportYmobileBillModel.UNREGIST_CODETYPE) {
					if (-1 !== A_codeInFile.indexOf(code)) {
						this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + pactid + " \u5185\u8A33\u30B3\u30FC\u30C9:" + code + " \u304C\u4EEE\u767B\u9332\u306E\u307E\u307E\u3067\u3059\n", 1);
						this.A_unregist.push(code);
					}
				}
			}
		}

		if (0 != this.A_unregist.length) {
			this.warningOut(1000, ImportYmobileBillProc.SCRIPTNAME + "::\u4EEE\u767B\u9332\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u3059\n", 1);
			return false;
		}

		this.infoOut(this.H_pactid[pactid] + "(" + pactid + ")" + this.BillDate + " " + A_billFile.join(",") + "\n", 0);
		var rootPostidX = this.getPostModel().getRootPostid(pactid, 0, this.tableNo);
		var H_telnoX = Array();
		var aspFlg = false;

		if (-1 !== Object.keys(this.getFuncModel().getPactFunc(pactid, undefined, false)).indexOf("fnc_asp") == true) //ASP料金を取得
			{
				aspFlg = true;
				var aspCharge = this.getBillModel().getAspCharge(pactid, this.getSetting().CARID);

				if ("" == aspCharge) {
					this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + pactid + " \u306E\uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n", 1);
					return false;
				}

				var asxCharge = +(aspCharge * this.getSetting().excise_tax);
			}

		H_telnoX = this.getTelModel().getCaridTelno(pactid, this.tableNo, [this.getSetting().CARID]);

		if ("N" == this.TargetTable) //現在テーブルより電話番号マスターを取得する array(telno)
			//電話管理テーブル
			//今月用のルート部署を取得
			{
				var H_telno = this.getTelModel().getCaridTelno(pactid, undefined, [this.getSetting().CARID]);
				A_outPut[this.manage_tb] = Array();
				var rootPostid = this.getPostModel().getRootPostid(pactid, 0);
			}

		var telno = undefined;
		var H_telDone = Array();

		for (var H_row of Object.values(A_allFileData)) //tel_X_tb に電話番号がない場合
		{
			H_row.postid = rootPostidX;

			if (!!H_row.telno && -1 !== H_telnoX[this.getSetting().CARID].indexOf(H_row.telno) == false) //tel_X_tb へ登録する必要有り
				//電話番号リストに追加
				//現在テーブルにも追加する場合（過去テーブルに無いときだけ追加）
				{
					this.O_Model.setOutPut(this.manageX_tb, A_outPut[this.manageX_tb], H_row);
					H_telnoX[this.getSetting().CARID].push(H_row.telno);

					if ("N" == this.TargetTable) //tel_tb に電話番号がない場合
						{
							H_row.postid = rootPostid;

							if (-1 !== H_telno[this.getSetting().CARID].indexOf(H_row.telno) == false) //tel_tb へ登録する必要有り
								//電話番号リストに追加
								{
									this.O_Model.setOutPut(this.manage_tb, A_outPut[this.manage_tb], H_row);
									H_telno[this.getSetting().CARID].push(H_row.telno);
								}
						}
				}
		}

		var A_telnoDone = Array();

		for (var cnt = 0; cnt < A_allFileData.length; cnt++) //tel_amount_bill_tb へ登録
		{
			var H_row = A_allFileData[cnt];

			if (H_row.telno == "") {
				if (H_row.postname == ImportYmobileBillProc.TOTAL_POSTNAME && H_row.codename == ImportYmobileBillProc.TOTAL_CODENAME) {
					H_row.year = this.BillDate.substr(0, 4);
					H_row.month = this.BillDate.substr(4, 2);
					this.O_Model.setOutPut("tel_amount_bill_tb", A_outPut.tel_amount_bill_tb, H_row);
				}
			} else //ASP使用料
				{
					this.O_Model.setOutPut(this.details_tb, A_outPut[this.details_tb], H_row);

					if (true == aspFlg && undefined !== A_allFileData[cnt + 1] && H_row.telno !== A_allFileData[cnt + 1].telno) {
						H_row.detailno += 2;
						H_row.code = ImportYmobileBillProc.ASPCODE;
						H_row.codename = ImportYmobileBillProc.ASPCODENAME;
						H_row.charge = aspCharge;
						this.O_Model.setOutPut(this.details_tb, A_outPut[this.details_tb], H_row);
						H_row.detailno++;
						H_row.code = ImportYmobileBillProc.ASXCODE;
						H_row.codename = ImportYmobileBillProc.ASXCODENAME;
						H_row.charge = asxCharge;
						this.O_Model.setOutPut(this.details_tb, A_outPut[this.details_tb], H_row);
					}
				}
		}

		return A_outPut;
	}

	checkFileName(pactid, fileName) //78 会社名に.があるとだめを修正
	//$A_file = preg_split("/_|\./", $H_path["basename"]);
	//basenameから拡張子を抜く
	{
		var H_path = pathinfo(fileName);
		var A_path = H_path.dirname.split("/");
		var basename = preg_replace("/\\." + H_path.extension + "$/", "", H_path.basename);
		var A_file = [basename.substr(0, basename.length - 7), basename.substr(-6), H_path.extension];

		if (!A_file) {
			this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + pactid + " \u30D5\u30A1\u30A4\u30EB\u540D\u304C\u4E0D\u6B63\u3067\u3059 " + fileName + "\n", 1);
			return false;
		}

		if (A_path[3] !== A_file[1]) {
			this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + pactid + " \u30D5\u30A1\u30A4\u30EB\u540D\u306E\u5BFE\u8C61\u5E74\u6708\u304C\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3068\u9055\u3063\u3066\u3044\u307E\u3059 " + fileName + "\n", 1);
			return false;
		}

		var O_model = new ClampModel();
		var A_clamps = O_model.getClamps(pactid, this.getSetting().CARID);
		var flag = false;

		for (var H_clamp of Object.values(A_clamps)) {
			if (H_clamp.clampid === A_file[0]) {
				flag = true;
				break;
			}
		}

		if (flag == false) {
			this.warningOut(1000, "\u5951\u7D04\uFF29\uFF24\uFF1A" + pactid + " \u306Eclampid\u304C\u30D5\u30A1\u30A4\u30EB\u540D\uFF1A" + fileName + " \u3068\u4E00\u81F4\u3057\u307E\u305B\u3093\n", 1);
			return false;
		}

		return true;
	}

	setUtiwakeHash() //内訳種別マスター情報を取得
	{
		var H_utiwake = this.getBillModel().getUtiwake([this.getSetting().CARID]);
		this.H_utiwake = H_utiwake[this.getSetting().CARID];
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};