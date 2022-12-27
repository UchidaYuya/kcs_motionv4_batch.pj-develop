//プラン、パケット反映処理 （Process）


import ProcessBaseBatch from "../ProcessBaseBatch";
import MtSetting from "../../MtSetting";
import MtMailUtil from "../../MtMailUtil";
import ReflectBillingDataModel from "../../model/ReflectBillingDataModel";
import ReflectBillingDataView from "../../view/script/ReflectBillingDataView";
import FuncModel from "../../model/FuncModel";
import PostModel from "../../model/PostModel";
import PactModel from "../../model/PactModel";
import MtTableUtil from "../../MtTableUtil";
import Logger from "../../log";
import { execSync } from "child_process";

const PATH = require('path');
const fs = require('fs');
export default class ReflectBillingDataProc extends ProcessBaseBatch {
	static SCRIPTNAME = "ReflectBillingData";
	static DEPENDS_ORDER = 3;
	static NOW_TABLE = 2;
	_updateMessage: string;
	_warningMessage: string;
	_instantLogFileNameA: string;
	_instantLogFileZipA: string;
	_instantLogFileB: string;
	_logDir: string;
	_instantLogFileA: string;
	_pactId: string | undefined;
	BillDate: string | undefined;
	Carid: number | undefined;
	_pactIdList: any;
	carName: { "1": string; "3": string; };
	_view: ReflectBillingDataView;
	_model: ReflectBillingDataModel;
	_mail: MtMailUtil;
	_set: MtSetting;
	tableNo: MtTableUtil | undefined;
	O_FuncModel: FuncModel | undefined;
	O_PostModel: PostModel | undefined;
	O_PactModel: PactModel | undefined;

	constructor(H_param: {} | any[] = Array()) //Viewの生成
	{
		super(H_param);
		this._updateMessage = "undefined";
		this._warningMessage = "undefined";
		this._instantLogFileNameA = "undefined";
		this._instantLogFileZipA = "undefined";
		this._instantLogFileA = "undefined";
		this._instantLogFileB = "undefined";
		this._logDir = "undefined";
		this.carName = {
			"1": "Docomo",
			"3": "au"
		};
		this._view = new ReflectBillingDataView();
		this._model = new ReflectBillingDataModel();
		var instant = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("");
		var logopt = {
			mode: 600,
			timeFormat: "%Y/%m/%d %X"
		};
		this._logDir = this.getSetting().get("script_own_dir") + "/" + PATH.parse(this._view.get_ScriptName(), ".php").basename;
		this._instantLogFileNameA = this._logDir + "/_" + instant + "_A.log";
		this._instantLogFileZipA = this._logDir + "/_" + instant + "_A.zip";
		this._instantLogFileA = Logger.singleton("file", this._instantLogFileNameA, __dirname, logopt);
		this._instantLogFileB = Logger.singleton("file", this._logDir + "/_" + instant + "_B.log", __dirname, logopt);
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
						throw new Error("非対応のキャリアID: " + this.Carid);
						break;
				}
			} catch (e) {
				this.infoOut(e.getMessage(), 1);
			}
		} catch (e) {
			this.infoOut(e.getMessage(), 1);
		}

		if (this._warningMessage) {
			// this._instantLogFileA.log("\n" + this._warningMessage, 6);
			Logger.log("\n" + this._warningMessage, 6);

			execSync("zip " + this._instantLogFileZipA + " " + this._instantLogFileNameA);
			fs.unlink(this._instantLogFileNameA);
			var message = "プラン・パケット不明回線があります。詳しくは「" + this._instantLogFileZipA + "」をご覧ください";

			this._mail.send(this._set.get("mail_def_errorto"), message, this._set.get("mail_error_from"), "プラン・パケット反映", this._set.get("mail_error_from_name"));
		}

		if (this._updateMessage) {
			// this._instantLogFileB.log("\n" + this._updateMessage, 6);
			Logger.log("\n" + this._updateMessage, 6);
		}

		this.getOut().flushMessage();
		this.postExecute();
	}

	async _tweek(carid: number) {
		this.infoOut(this.carName[carid] + " 開始\n", 1);

		for (var pactid of this._pactIdList) {
			this.infoOut("pactid: " + pactid + "\n", 1);
			var rollback = false;
			this.get_DB().beginTransaction();

			var type = this._model.getFunctionType(pactid);

			var telList = await this._model.getTelnoList(pactid, carid, this.tableNo);

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

						if (await this._model.searchOrder(pactid, carid, telno)) {
							nowTable = false;
							this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") 対象期間に注文が存在するため現在月の更新を行わないように変更\n", 1);
						}
					} else if (type == ReflectBillingDataProc.NOW_TABLE) {
						nowTable = true;
					}

					if (!buyselid) {
						var message = "Pactid(" + pactid + ") telno(" + telno + ") の buyselid が対象月に入力されていないため、プラン・パケットを絞れませんでした\n";
						this._warningMessage += message;
						this.infoOut(message, 1);
						continue;
					}

					this.infoOut("buyselid が対象月に入力されているため、プラン・パケットの絞り込みを試みます\n", 1);
					this.infoOut("プランの絞り込みを試みます\n", 1);

					if (planid) {
						try {
							var newPlan = this._model.searchPlan(pactid, carid, telno, this.tableNo, arid, cirid, buyselid);

							if (!newPlan) {
								message = "Pactid(" + pactid + ") telno(" + telno + ") ) のプラン候補が0件のため、プランを絞れませんでした\n";
								this._warningMessage += message;
								this.infoOut(message, 1);
								continue;
							} else if (newPlan == planid) {
								this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") のプラン候補と元のプランが同じため、プランの変更をしませんでした\n", 1);
							} else {
								var res = await this._model.updatePlan(pactid, carid, telno, newPlan, this.tableNo);

								if (res || res != 1) {
									rollback = true;
									this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") のプランの更新に失敗しました\n", 1);
									this.infoOut("Pactid(" + pactid + ") の処理を中断します\n", 1);
									continue;
								} else {
									message = "Pactid(" + pactid + ") telno(" + telno + ") のプランを" + planid + "から" + newPlan + "に変更しました\n";
									this._updateMessage += message;
									this.infoOut(message, 1);
								}
							}

							if (nowTable) {
								if (undefined !== telListNow[telno]) {
									if (newPlan == telListNow[telno].planid) {
										this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") のプラン候補と現在月のプランが同じため、現在月のプランを変更しませんでした\n", 1);
									} else {
										res = this._model.updatePlan(pactid, carid, telno, newPlan,this.tableNo);

										if (!res || res != 1) {
											rollback = true;
											this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") の現在月のプランの更新に失敗しました\n", 1);
											this.infoOut("Pactid(" + pactid + ") の処理を中断します\n", 1);
											continue;
										} else {
											message = "Pactid(" + pactid + ") telno(" + telno + ") の現在月のプランを" + telListNow[telno].planid + "から" + newPlan + "に変更しました\n";
											this._updateMessage += message;
											this.infoOut(message, 1);
										}
									}
								} else {
									this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") が現在月に存在しませんでした\n", 1);
								}
							}
						} catch (e) {
							this._warningMessage += e.getMessage();
							this.infoOut(e.getMessage() + "\n", 1);
						}
					} else {
						message = "Pactid(" + pactid + ") telno(" + telno + ") の planid が対象月に入力されていませんでした\n";
						this._warningMessage = message;
						this.infoOut(message, 1);
					}

					this.infoOut("パケットの絞り込みを試みます\n", 1);

					if (packetid) {
						try {
							var newPacket = this._model.searchPacket(pactid, carid, telno, this.tableNo, arid, cirid, buyselid);

							if (!newPacket) {
								message = "Pactid(" + pactid + ") telno(" + telno + ") のパケット候補が0件のため、パケットを絞れませんでした\n";
								this._warningMessage += message;
								this.infoOut(message, 1);
								continue;
							} else if (newPacket == packetid) {
								this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") のパケット候補と元のパケットが同じため、パケットの変更をしませんでした\n", 1);
							} else {
								res = await this._model.updatePacket(pactid, carid, telno, newPacket, this.tableNo);

								if (!res || res != 1) {
									rollback = true;
									this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") のパケットの更新に失敗しました\n", 1);
									this.infoOut("Pactid(" + pactid + ") の処理を中断します\n", 1);
									continue;
								} else {
									message = "Pactid(" + pactid + ") telno(" + telno + ") のパケットを" + packetid + "から" + newPacket + "に変更しました\n";
									this._updateMessage += message;
									this.infoOut(message, 1);
								}
							}

							if (nowTable) {
								if (undefined !== telListNow[telno]) {
									if (newPacket == telListNow[telno].packetid) {
										this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") のパケット候補と現在月のパケットが同じため、現在月のパケットを変更しませんでした\n", 1);
									} else {
										res = this._model.updatePacket(pactid, carid, telno, newPacket,this.tableNo);

										if (res || res != 1) {
											rollback = true;
											this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") の現在月のパケットの更新に失敗しました\n", 1);
											this.infoOut("Pactid(" + pactid + ") の処理を中断します\n", 1);
											continue;
										} else {
											message = "Pactid(" + pactid + ") telno(" + telno + ") の現在月のパケットを" + telListNow[telno].packetid + "から" + newPacket + "に変更しました\n";
											this._updateMessage += message;
											this.infoOut(message, 1);
										}
									}
								} else {
									this.infoOut("Pactid(" + pactid + ") telno(" + telno + ") が現在月に存在しませんでした\n", 1);
								}
							}
						} catch (e) {
							this._warningMessage += e.getMessage();
							this.infoOut(e.getMessage() + "\n", 1);
						}
					} else {
						message = "Pactid(" + pactid + ") telno(" + telno + ") の packetid が対象月に入力されていませんでした\n";
						this._warningMessage = message;
						this.infoOut(message, 1);
					}
				}
			} else {
				this.infoOut("pactid: " + pactid + " には請求情報を持ち、電話管理にも存在している電話がありませんでした\n", 1);
			}

			if (rollback) {
				this.get_DB().rollback();
				this.infoOut("データの更新に失敗しました。Pactid(" + pactid + ")の処理をロールバックします\n");
			} else {
				this.get_DB().commit();
				this.infoOut("Pactid(" + pactid + ")の処理が完了しました\n");
			}
		}

		this.infoOut(this.carName[carid] + " 終了\n", 1);
	}

	preExecute() 
	
	{
		this.infoOut("プラン、パケット反映開始\n", 1);
		this.set_Dirs(this._view.get_ScriptName());
		this.lockProcess(this._view.get_ScriptName());
		this._pactId = this._view.get_HArgv("-p");
		this.BillDate = this._view.get_HArgv("-y");
		this.Carid = this._view.get_HArgv("-c");
		this.tableNo = MtTableUtil.getTableNo(this.BillDate, false);
		this._pactIdList = this._getPactList(this._pactId);
	}

	async _getPactList(pactid) {
		return (await this._model.initialize(pactid)).getPactIdList();
	}

	postExecute() //スクリプトの二重起動防止ロック解除
	//終了
	{
		this.unLockProcess(this._view.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("プラン、パケット反映終了\n", 1);
	}

	getPactModel() {
		if (this.O_PactModel instanceof PactModel) {
			this.O_PactModel = new PactModel();
		}

		return this.O_PactModel;
	}

	getPostModel() {
		if (this.O_PostModel instanceof PostModel) {
			this.O_PostModel = new PostModel();
		}

		return this.O_PostModel;
	}

	getFuncModel() {
		if (this.O_FuncModel instanceof FuncModel) {
			this.O_FuncModel = new FuncModel();
		}

		return this.O_FuncModel;
	}

	__destruct() {
		if (this._view) {
			this.unLockProcess(this._view.get_ScriptName());
		}
	}

};
