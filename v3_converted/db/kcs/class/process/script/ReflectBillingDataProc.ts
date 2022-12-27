//
//プラン、パケット反映処理 （Process）
//
//更新履歴：<br>
//2012/01/24/ 宝子山浩平 作成
//
//ImportSoftBankBillProc
//
//@package script
//@subpackage Process
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2012/01/24/
//@uses MtTableUtil
//@uses PactModel
//@uses PostModel
//@uses FuncModel
//@uses ProcessBaseBatch
//@uses ImportSoftBankBillView
//@uses ImportSoftBankBillModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ReflectBillingDataProc
//
//@uses ProcessBaseBatch
//@package
//@author web
//@since 2012/01/24
//

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/PostModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/ReflectBillingDataView.php");

require("model/ReflectBillingDataModel.php");

require("Log.php");

require("MtMailUtil.php");

require("MtSetting.php");

//
//コンストラクタ
//
//@author web
//@since 2012/01/24
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author web
//@since 2012/01/24
//
//@param array $H_param
//@access protected
//@return void
//
//
//_tweek
//
//@author web
//@since 2012/03/13
//
//@param mixed $carid
//@access protected
//@return void
//
//
//初期処理
//
//@author web
//@since 2012/01/25
//
//@access protected
//@return void
//
//
//終了処理
//
//@author web
//@since 2012/01/26
//
//@access protected
//@return void
//
//
//PactModel取得
//
//@author web
//@since 2012/01/25
//
//@access protected
//@return void
//
//
//PostModel取得
//
//@author web
//@since 2012/01/25
//
//@access protected
//@return void
//
//
//FuncModel取得
//
//@author web
//@since 2012/01/25
//
//@access protected
//@return void
//
class ReflectBillingDataProc extends ProcessBaseBatch {
	static SCRIPTNAME = "ReflectBillingData";
	static DEPENDS_ORDER = 3;
	static NOW_TABLE = 2;

	constructor(H_param: {} | any[] = Array()) //Viewの生成
	//Modelの生成
	{
		super(H_param);
		this._updateMessage = undefined;
		this._warningMessage = undefined;
		this._instantLogFileNameA = undefined;
		this._instantLogFileZipA = undefined;
		this._instantLogFileA = undefined;
		this._instantLogFileB = undefined;
		this._logDir = undefined;
		this.carName = {
			"1": "Docomo",
			"3": "au"
		};
		this._view = new ReflectBillingDataView();
		this._model = new ReflectBillingDataModel();
		var instant = date("Ymdhis");
		var logopt = {
			mode: 600,
			timeFormat: "%Y/%m/%d %X"
		};
		this._logDir = this.getSetting().script_own_dir + "/" + basename(this._view.get_ScriptName(), ".php");
		this._instantLogFileNameA = this._logDir + "/_" + instant + "_A.log";
		this._instantLogFileZipA = this._logDir + "/_" + instant + "_A.zip";
		this._instantLogFileA = Log.singleton("file", this._instantLogFileNameA, _SERVER.PHP_SELF, logopt);
		this._instantLogFileB = Log.singleton("file", this._logDir + "/_" + instant + "_B.log", _SERVER.PHP_SELF, logopt);
		this._mail = new MtMailUtil();
		this._set = MtSetting.singleton();
	}

	doExecute(H_param: {} | any[] = Array()) //初期処理
	//終了処理
	{
		try {
			this.preExecute();

			try {
				switch (this.Carid) {
					case 1:
					case 3:
						this._tweek(this.Carid);

						break;

					default:
						throw new Error("\u975E\u5BFE\u5FDC\u306E\u30AD\u30E3\u30EA\u30A2ID: " + this.Carid);
						break;
				}
			} catch (e) {
				this.infoOut(e.getMessage(), 1);
			}
		} catch (e) {
			this.infoOut(e.getMessage(), 1);
		}

		if (!is_null(this._warningMessage)) {
			this._instantLogFileA.log("\n" + this._warningMessage, 6);

			exec("zip " + this._instantLogFileZipA + " " + this._instantLogFileNameA);
			unlink(this._instantLogFileNameA);
			var message = "\u30D7\u30E9\u30F3\u30FB\u30D1\u30B1\u30C3\u30C8\u4E0D\u660E\u56DE\u7DDA\u304C\u3042\u308A\u307E\u3059\u3002\u8A73\u3057\u304F\u306F\u300C" + this._instantLogFileZipA + "\u300D\u3092\u3054\u89A7\u304F\u3060\u3055\u3044";

			this._mail.send(this._set.mail_def_errorto, message, this._set.mail_error_from, "\u30D7\u30E9\u30F3\u30FB\u30D1\u30B1\u30C3\u30C8\u53CD\u6620", this._set.mail_error_from_name);
		}

		if (!is_null(this._updateMessage)) {
			this._instantLogFileB.log("\n" + this._updateMessage, 6);
		}

		this.getOut().flushMessage();
		this.postExecute();
	}

	_tweek(carid) {
		this.infoOut(this.carName[carid] + " \u958B\u59CB\n", 1);

		for (var pactid of Object.values(this._pactIdList)) {
			this.infoOut("pactid: " + pactid + "\n", 1);
			var rollback = false;
			this.get_DB().beginTransaction();

			var type = this._model.getFunctionType(pactid);

			var telList = this._model.getTelnoList(pactid, carid, this.tableNo);

			var telListNow = this._model.getTelnoListNow(pactid, carid);

			var telListLength = telList.length;

			if (0 < telListLength) {
				for (var i = 0; i < telListLength; i++) //現在月に反映
				{
					if (rollback) {
						continue;
					}

					var telno = telList[i].telno;
					var planid = telList[i].planid;
					var packetid = telList[i].packetid;
					var cirid = telList[i].cirid;
					var arid = telList[i].arid;
					var buyselid = telList[i].buyselid;
					var nowTable = false;

					if (type == ReflectBillingDataProc.DEPENDS_ORDER) {
						nowTable = true;

						if (this._model.searchOrder(pactid, carid, telno)) {
							nowTable = false;
							this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") \u5BFE\u8C61\u671F\u9593\u306B\u6CE8\u6587\u304C\u5B58\u5728\u3059\u308B\u305F\u3081\u73FE\u5728\u6708\u306E\u66F4\u65B0\u3092\u884C\u308F\u306A\u3044\u3088\u3046\u306B\u5909\u66F4\n", 1);
						}
					} else if (type == ReflectBillingDataProc.NOW_TABLE) {
						nowTable = true;
					}

					if (is_null(buyselid)) {
						var message = "Pactid(" + pactid + ") telno(" + telno + ") \u306E buyselid \u304C\u5BFE\u8C61\u6708\u306B\u5165\u529B\u3055\u308C\u3066\u3044\u306A\u3044\u305F\u3081\u3001\u30D7\u30E9\u30F3\u30FB\u30D1\u30B1\u30C3\u30C8\u3092\u7D5E\u308C\u307E\u305B\u3093\u3067\u3057\u305F\n";
						this._warningMessage += message;
						this.infoOut(message, 1);
						continue;
					}

					this.infoOut("buyselid \u304C\u5BFE\u8C61\u6708\u306B\u5165\u529B\u3055\u308C\u3066\u3044\u308B\u305F\u3081\u3001\u30D7\u30E9\u30F3\u30FB\u30D1\u30B1\u30C3\u30C8\u306E\u7D5E\u308A\u8FBC\u307F\u3092\u8A66\u307F\u307E\u3059\n", 1);
					this.infoOut("\u30D7\u30E9\u30F3\u306E\u7D5E\u308A\u8FBC\u307F\u3092\u8A66\u307F\u307E\u3059\n", 1);

					if (!is_null(planid)) {
						try {
							var newPlan = this._model.searchPlan(pactid, carid, telno, this.tableNo, arid, cirid, buyselid);

							if (!newPlan) {
								message = "Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D7\u30E9\u30F3\u5019\u88DC\u304C0\u4EF6\u306E\u305F\u3081\u3001\u30D7\u30E9\u30F3\u3092\u7D5E\u308C\u307E\u305B\u3093\u3067\u3057\u305F\n";
								this._warningMessage += message;
								this.infoOut(message, 1);
								continue;
							} else if (newPlan == planid) {
								this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D7\u30E9\u30F3\u5019\u88DC\u3068\u5143\u306E\u30D7\u30E9\u30F3\u304C\u540C\u3058\u305F\u3081\u3001\u30D7\u30E9\u30F3\u306E\u5909\u66F4\u3092\u3057\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
							} else {
								var res = this._model.updatePlan(pactid, carid, telno, newPlan, this.tableNo);

								if (PEAR.isError(res) || res != 1) {
									rollback = true;
									this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D7\u30E9\u30F3\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 1);
									this.infoOut("Pactid(" + pactid + ") \u306E\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\n", 1);
									continue;
								} else {
									message = "Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D7\u30E9\u30F3\u3092" + planid + "\u304B\u3089" + newPlan + "\u306B\u5909\u66F4\u3057\u307E\u3057\u305F\n";
									this._updateMessage += message;
									this.infoOut(message, 1);
								}
							}

							if (nowTable) {
								if (undefined !== telListNow[telno]) {
									if (newPlan == telListNow[telno].planid) {
										this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D7\u30E9\u30F3\u5019\u88DC\u3068\u73FE\u5728\u6708\u306E\u30D7\u30E9\u30F3\u304C\u540C\u3058\u305F\u3081\u3001\u73FE\u5728\u6708\u306E\u30D7\u30E9\u30F3\u3092\u5909\u66F4\u3057\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
									} else {
										res = this._model.updatePlan(pactid, carid, telno, newPlan);

										if (PEAR.isError(res) || res != 1) {
											rollback = true;
											this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u73FE\u5728\u6708\u306E\u30D7\u30E9\u30F3\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 1);
											this.infoOut("Pactid(" + pactid + ") \u306E\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\n", 1);
											continue;
										} else {
											message = "Pactid(" + pactid + ") telno(" + telno + ") \u306E\u73FE\u5728\u6708\u306E\u30D7\u30E9\u30F3\u3092" + telListNow[telno].planid + "\u304B\u3089" + newPlan + "\u306B\u5909\u66F4\u3057\u307E\u3057\u305F\n";
											this._updateMessage += message;
											this.infoOut(message, 1);
										}
									}
								} else {
									this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") \u304C\u73FE\u5728\u6708\u306B\u5B58\u5728\u3057\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
								}
							}
						} catch (e) {
							this._warningMessage += e.getMessage();
							this.infoOut(e.getMessage() + "\n", 1);
						}
					} else {
						message = "Pactid(" + pactid + ") telno(" + telno + ") \u306E planid \u304C\u5BFE\u8C61\u6708\u306B\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3067\u3057\u305F\n";
						this._warningMessage = message;
						this.infoOut(message, 1);
					}

					this.infoOut("\u30D1\u30B1\u30C3\u30C8\u306E\u7D5E\u308A\u8FBC\u307F\u3092\u8A66\u307F\u307E\u3059\n", 1);

					if (!is_null(packetid)) {
						try {
							var newPacket = this._model.searchPacket(pactid, carid, telno, this.tableNo, arid, cirid, buyselid);

							if (!newPacket) {
								message = "Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D1\u30B1\u30C3\u30C8\u5019\u88DC\u304C0\u4EF6\u306E\u305F\u3081\u3001\u30D1\u30B1\u30C3\u30C8\u3092\u7D5E\u308C\u307E\u305B\u3093\u3067\u3057\u305F\n";
								this._warningMessage += message;
								this.infoOut(message, 1);
								continue;
							} else if (newPacket == packetid) {
								this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D1\u30B1\u30C3\u30C8\u5019\u88DC\u3068\u5143\u306E\u30D1\u30B1\u30C3\u30C8\u304C\u540C\u3058\u305F\u3081\u3001\u30D1\u30B1\u30C3\u30C8\u306E\u5909\u66F4\u3092\u3057\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
							} else {
								res = this._model.updatePacket(pactid, carid, telno, newPacket, this.tableNo);

								if (PEAR.isError(res) || res != 1) {
									rollback = true;
									this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D1\u30B1\u30C3\u30C8\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 1);
									this.infoOut("Pactid(" + pactid + ") \u306E\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\n", 1);
									continue;
								} else {
									message = "Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D1\u30B1\u30C3\u30C8\u3092" + packetid + "\u304B\u3089" + newPacket + "\u306B\u5909\u66F4\u3057\u307E\u3057\u305F\n";
									this._updateMessage += message;
									this.infoOut(message, 1);
								}
							}

							if (nowTable) {
								if (undefined !== telListNow[telno]) {
									if (newPacket == telListNow[telno].packetid) {
										this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u30D1\u30B1\u30C3\u30C8\u5019\u88DC\u3068\u73FE\u5728\u6708\u306E\u30D1\u30B1\u30C3\u30C8\u304C\u540C\u3058\u305F\u3081\u3001\u73FE\u5728\u6708\u306E\u30D1\u30B1\u30C3\u30C8\u3092\u5909\u66F4\u3057\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
									} else {
										res = this._model.updatePacket(pactid, carid, telno, newPacket);

										if (PEAR.isError(res) || res != 1) {
											rollback = true;
											this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") \u306E\u73FE\u5728\u6708\u306E\u30D1\u30B1\u30C3\u30C8\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 1);
											this.infoOut("Pactid(" + pactid + ") \u306E\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\n", 1);
											continue;
										} else {
											message = "Pactid(" + pactid + ") telno(" + telno + ") \u306E\u73FE\u5728\u6708\u306E\u30D1\u30B1\u30C3\u30C8\u3092" + telListNow[telno].packetid + "\u304B\u3089" + newPacket + "\u306B\u5909\u66F4\u3057\u307E\u3057\u305F\n";
											this._updateMessage += message;
											this.infoOut(message, 1);
										}
									}
								} else {
									this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") \u304C\u73FE\u5728\u6708\u306B\u5B58\u5728\u3057\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
								}
							}
						} catch (e) {
							this._warningMessage += e.getMessage();
							this.infoOut(e.getMessage() + "\n", 1);
						}
					} else {
						message = "Pactid(" + pactid + ") telno(" + telno + ") \u306E packetid \u304C\u5BFE\u8C61\u6708\u306B\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3067\u3057\u305F\n";
						this._warningMessage = message;
						this.infoOut(message, 1);
					}
				}
			} else {
				this.infoOut("pactid: " + pactid + " \u306B\u306F\u8ACB\u6C42\u60C5\u5831\u3092\u6301\u3061\u3001\u96FB\u8A71\u7BA1\u7406\u306B\u3082\u5B58\u5728\u3057\u3066\u3044\u308B\u96FB\u8A71\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\n", 1);
			}

			if (rollback) {
				this.get_DB().rollback();
				this.infoOut("\u30C7\u30FC\u30BF\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002Pactid(" + pactid + ")\u306E\u51E6\u7406\u3092\u30ED\u30FC\u30EB\u30D0\u30C3\u30AF\u3057\u307E\u3059\n");
			} else {
				this.get_DB().commit();
				this.infoOut("Pactid(" + pactid + ")\u306E\u51E6\u7406\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F\n");
			}
		}

		this.infoOut(this.carName[carid] + " \u7D42\u4E86\n", 1);
	}

	preExecute() //処理開始
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//$this->BackUpFlg   = $this->_view->get_HArgv("-b");
	//対象テーブル番号を取得
	//処理する契約ＩＤを取得する
	{
		this.infoOut("\u30D7\u30E9\u30F3\u3001\u30D1\u30B1\u30C3\u30C8\u53CD\u6620\u958B\u59CB\n", 1);
		this.set_Dirs(this._view.get_ScriptName());
		this.lockProcess(this._view.get_ScriptName());
		this._pactId = this._view.get_HArgv("-p");
		this.BillDate = this._view.get_HArgv("-y");
		this.Carid = this._view.get_HArgv("-c");
		this.tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		this._pactIdList = this._getPactList(this._pactId);
	}

	_getPactList(pactid) {
		return this._model.initialize(pactid).getPactIdList();
	}

	postExecute() //スクリプトの二重起動防止ロック解除
	//終了
	{
		this.unLockProcess(this._view.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("\u30D7\u30E9\u30F3\u3001\u30D1\u30B1\u30C3\u30C8\u53CD\u6620\u7D42\u4E86\n", 1);
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

	getFuncModel() {
		if (!this.O_FuncModel instanceof FuncModel) {
			this.O_FuncModel = new FuncModel();
		}

		return this.O_FuncModel;
	}

	__destruct() {
		if (!is_null(this._view)) {
			this.unLockProcess(this._view.get_ScriptName());
		}
	}

};