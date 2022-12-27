//au brossデータ ダウンロード （Process）

import ProcessBaseBatch from '../ProcessBaseBatch';
import AuDownloadView from '../../view/script/AuDownloadView';
import AuDownloadModel from '../../model/script/AuDownloadModel';
import SBDownloadModel from '../../model/script/SBDownloadModel';
import { execSync } from 'child_process';
import ClampModel from '../../model/ClampModel';

const fs = require('fs');
export default class AuDownloadProc extends ProcessBaseBatch {
	O_View: AuDownloadView;
	O_Model: AuDownloadModel;
	O_SB_Model: SBDownloadModel;
	PactId!: string;
	EndFlg: string | undefined;
	BillDate: string | undefined;
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this.getSetting().loadConfig("au_download");
		this.O_View = new AuDownloadView();
		this.O_Model = new AuDownloadModel(this.get_MtScriptAmbient());
		this.O_SB_Model = new SBDownloadModel(this.get_DB());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.EndFlg = this.O_View.get_HArgv("-s");
		const nowYyyyMm: any = this.getYyyyMm(false);

		if ("none" == this.O_View.get_HArgv("-y")) //請求年月指定有り
			{
				this.BillDate = nowYyyyMm;
				var BillDateNoneFlg = true;
			} else {
			this.BillDate = this.O_View.get_HArgv("-y");
			BillDateNoneFlg = false;
		}

		const baseDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/";
		const dlfp = fs.readFileSync(baseDir + "dl_au_list", "w");
		var A_success = Array();

		if ("all" == this.PactId) //pact指定がある場合
			{
				var pactParam: string | undefined = undefined;
			} else {
			pactParam = this.PactId;
		}

		var H_outClampError: any = Array();
		const O_ClampModel = new ClampModel();
		let H_clampData: any = O_ClampModel.getClampList(this.getSetting().get("CARID"), this.getSetting().get("CHK_PACTID"), this.getSetting().get("A_LOGIN_STATUS"));
		var now = this.get_DB().getNow();

		if (H_clampData.length == 0) //エラーメッセージ出力
			{
				this.infoOut("\nログインテスト用のＩＤが登録されていない為、終了します\n\n", 1);
				H_outClampError.push({
					pactid: 0,
					carid: this.getSetting().get("CARID"),
					error_type: "logintest",
					message: "ログインテスト用のＩＤが登録されていない為、処理を終了します",
					is_send: "false",
					recdate: now,
					fixdate: now
				});
				this.endScript();
			}

		const chkKeyFile = H_clampData.M[this.getSetting().get("CHK_PACTID")][0].key_file;
		const chkKeyPass = H_clampData.M[this.getSetting().get("CHK_PACTID")][0].key_pass;
		const chkCompname = H_clampData.M[this.getSetting().get("CHK_PACTID")][0].compname;

		// if (false == this.goLogin(chkKeyFile, chkKeyPass)) //エラーメッセージ出力
		// 	{
		// 		this.infoOut("\n" + chkCompname + " 様でダウンロードサイトへログインできなかった為、処理を終了します（証明書）\n\n", 1);
		// 		H_outClampError.push({
		// 			pactid: 0,
		// 			carid: this.getSetting().get("CARID"),
		// 			error_type: "logintest",
		// 			message: "テスト用のＩＤでダウンロードサイトへログインできなかった為、処理を終了します",
		// 			is_send: "false",
		// 			recdate: now,
		// 			fixdate: now
		// 		});
		// 		this.endScript();
		// 	}

		var rtn = this.doLogin(H_clampData.M[this.getSetting().get("CHK_PACTID")][0].clampid, H_clampData.M[this.getSetting().get("CHK_PACTID")][0].clamppasswd, H_clampData.M[this.getSetting().get("CHK_PACTID")][0].code, chkKeyFile, chkKeyPass);

		if (this.getSetting().get("ERR_LOGIN_STR1").indexOf(rtn) >=0 || this.getSetting().get("ERR_LOGIN_STR2").indexOf(rtn) >= 0) //エラーメッセージ出力
			{
				this.infoOut("\n" + chkCompname + " 様でダウンロードサイトへログインできなかった為、処理を終了します\n\n", 1);
				H_outClampError.push({
					pactid: 0,
					carid: this.getSetting().get("CARID"),
					error_type: "logintest",
					message: "テスト用のＩＤでダウンロードサイトへログインできなかった為、処理を終了します",
					is_send: "false",
					recdate: now,
					fixdate: now
				});
				this.endScript();
			} else //ログイン判定に成功したら最終ダウンロード日を更新する 20091130miya
			{
				var H_loginTest: any = Array();
				H_loginTest.push({
					pactid: this.getSetting().get("CHK_PACTID"),
					carid: this.getSetting().get("CARID"),
					detailno: 0,
					year: new Date().getFullYear(),
					month: new Date().getMonth()+1,
					type: "LoginCheck",
					dldate: undefined,
					is_ready: undefined,
					is_details: undefined,
					is_comm: undefined,
					is_info: undefined,
					is_calc: undefined,
					is_trend: undefined,
					is_recom: undefined,
					fixdate: now
				});
				this.doImport(H_loginTest, "clamp_index_tb");
			}

		H_clampData = Array();
		H_clampData = O_ClampModel.getClampList(this.getSetting().get("CARID"), pactParam, this.getSetting().get("A_LOGIN_STATUS"));

		if (H_clampData.length == 0) //エラーメッセージ出力
			{
				this.infoOut("\nn有効なログインＩＤが登録されていない為、終了します\n\n", 1);
				H_outClampError.push({
					pactid: 0,
					carid: this.getSetting().get("CARID"),
					error_type: "login",
					message: "有効なログインＩＤが登録されていない為、処理を終了します",
					is_send: "false",
					recdate: now,
					fixdate: now
				});
				this.endScript();
			}

		var H_downloadedData: any = O_ClampModel.getDownloadedList(this.getSetting().get("CARID"));
		var curFlg = true;

		if ("none" == this.O_View.get_HArgv("-y") && "all" == this.PactId) //特定の会社で当月のデータがダウンロードされていない場合
			{
				if (false == (undefined !== H_downloadedData[this.getSetting().get("CHK_PACTID")][nowYyyyMm])) //当月データがダウンロード可能か不明の為 false に設定
					{
						curFlg = false;
						var tmpDir = "/tmp/au-check/";
						this.makeDir(tmpDir);
						var sessid = this.getSessid(rtn);

						for (let targetFile of Object.values(this.getSetting().get("A_FILE_TYPE"))) //ダウンロードメニューページへ
						{
							var A_zipRtn = Array();
							rtn = this.goDownloadMenu(chkKeyFile, chkKeyPass, sessid);
							sessid = this.getSessid(rtn);
							rtn = this.chgBillDate(chkKeyFile, chkKeyPass, sessid, nowYyyyMm);
							sessid = this.getSessid(rtn);
							var element = "ELE_NO_" + targetFile;
							this.doDownload(chkKeyFile, chkKeyPass, sessid, nowYyyyMm, this.getSetting()[element], tmpDir, A_zipRtn);

							if (A_zipRtn.length != 0) {
								curFlg = true;
								execSync("/bin/rm -rf " + tmpDir).toString();
								break;
							}
						}

						execSync("/bin/rm -rf " + tmpDir).toString();
					}
			}

		var A_downloadedPactid = Object.keys(H_downloadedData);
		var A_compType = Object.keys(H_clampData);
		A_compType.sort();
		var H_outClampIndex: any = Array();

		for (var compType of A_compType) //会社一覧を取得
		{
			var A_pactid = Object.keys(H_clampData[compType]);
			A_pactid.sort();

			for (var pactid of A_pactid) //実行時間制限がある場合
			{
				if ("Y" == this.EndFlg) //現在時を取得
					{
						var hour = this.getHh();

						if (hour >= this.getSetting().get("ENDHOUR")) //エラーメッセージ出力
							{
								this.infoOut("ダウンロード制限時間(0時～" + this.getSetting().get("ENDHOUR") + "時)外の為、処理を終了します\n\n", 1);
								H_outClampError.push({
									pactid: 0,
									carid: this.getSetting().get("CARID"),
									error_type: "login",
									message: "ダウンロード制限時間(0時～" + this.getSetting().get("ENDHOUR") + "時)外の為、処理を終了します",
									is_send: "false",
									recdate: now,
									fixdate: now
								});
								this.doImport(H_outClampError, "clamp_error_tb");
								this.doImport(H_outClampIndex, "clamp_index_tb");
								this.endScript();
							}
					}

				if (false == (-1 !== A_downloadedPactid.indexOf(pactid))) //新規ではない場合
					{
						var newFlg = true;
					} else {
					newFlg = false;
				}

				if (false == curFlg && false == newFlg) {
					continue;
				}

				if (true == BillDateNoneFlg) //新規の場合
					{
						if (true == newFlg) //当月から過去分までの請求年月リストを取得する
							{
								var A_billDate = this.getBillDate(this.getSetting().get("MONTH_CNT"));
							} else {
							A_billDate = [this.BillDate];
						}
					} else {
					A_billDate = [this.BillDate];
				}

				var A_detailno = Object.keys(H_clampData[compType][pactid]);

				for (var detailno of Object.values(A_detailno)) //ログインページへ
				{
					var loginid = H_clampData[compType][pactid][detailno].clampid;
					var passwd = H_clampData[compType][pactid][detailno].clamppasswd;
					var recCode = H_clampData[compType][pactid][detailno].code;
					var keyFile = H_clampData[compType][pactid][detailno].key_file;
					var keyPass = H_clampData[compType][pactid][detailno].key_pass;
					rtn = this.goLogin(keyFile, keyPass);

					// if (false == rtn) //エラーメッセージ出力
					// 	{
					// 		this.infoOut("\n" + H_clampData[compType][pactid][detailno].compname + "(pactid = " + pactid + ")のご請求コード(" + recCode + ")の証明書が不正か存在しない為、処理をスキップします\n\n", 1);
					// 		now = this.get_DB().getNow();
					// 		H_outClampError.push({
					// 			pactid: pactid,
					// 			carid: this.getSetting().get("CARID"),
					// 			error_type: "login",
					// 			message: H_clampData[compType][pactid][detailno].compname + "(pactid = " + pactid + ")のご請求コード(" + recCode + ")の証明書が不正か存在しない為、処理をスキップします",
					// 			is_send: "false",
					// 			recdate: now,
					// 			fixdate: now
					// 		});
					// 		continue;
					// 	}

					rtn = this.doLogin(loginid, passwd, recCode, keyFile, keyPass);

					if (this.getSetting().get("ERR_LOGIN_STR1").indexOf(rtn) >= 0 || this.getSetting().get("ERR_LOGIN_STR2").indexOf(rtn) >= 0) //ログインステータスを失敗で更新
						{
							O_ClampModel.updateStatus(pactid, detailno, this.getSetting().get("CARID"), this.getSetting().get("FAILURE"));
							this.infoOut("\n" + H_clampData[compType][pactid][detailno].compname + "(pactid = " + pactid + ")のご請求コード(" + recCode + ")ログインＩＤでログインできなかった為、処理をスキップします\n\n", 1);
							now = this.get_DB().getNow();
							H_outClampError.push({
								pactid: pactid,
								carid: this.getSetting().get("CARID"),
								error_type: "login",
								message: H_clampData[compType][pactid][detailno].compname + "(pactid = " + pactid + ")のご請求コード(" + recCode + ")ログインＩＤでログインできなかった為、処理をスキップします",
								is_send: "false",
								recdate: now,
								fixdate: now
							});
							continue;
						} else //ログインステータスが未検証の場合
						{
							if (this.getSetting().get("INITIAL") == H_clampData[compType][pactid][detailno].login_status) //ログインステータスを成功で更新
								{
									O_ClampModel.updateStatus(pactid, detailno, this.getSetting().get("CARID"), this.getSetting().get("SUCCESS"));
								}

							for (var billDate of A_billDate) //当月データがなく、請求年月が当月の場合
							{
								if (false == curFlg && billDate == nowYyyyMm) {
									continue;
								}

								var A_targetFile = Array();
								var dataDir = baseDir + billDate;
								this.makeDir(dataDir);
								dataDir += this.getSetting().get("CARRIER_DIR");
								this.makeDir(dataDir);
								var dataBillDir = dataDir + this.getSetting().get("BILL_DIR");
								this.makeDir(dataBillDir);
								var dataTuwaDir = dataDir + this.getSetting().get("TUWA_DIR");
								this.makeDir(dataTuwaDir);
								var dataPactBillDir = dataBillDir + "/" + pactid;
								this.makeDir(dataPactBillDir);
								var dataPactTuwaDir = dataTuwaDir + "/" + pactid;
								this.makeDir(dataPactTuwaDir);

								if (undefined !== H_downloadedData[pactid] == true) //対象請求年月でダウンロード済みのファイルがある場合
									{
										if (undefined !== H_downloadedData[pactid][billDate] == true) //未ダウンロードファイルリストを取得
											{
												A_targetFile = this.getSetting().get("A_FILE_TYPE").filter((x: any) => !H_downloadedData[pactid][billDate].type.includes(x));
											} else {
											A_targetFile = this.getSetting().get("A_FILE_TYPE");
										}
									} else {
									A_targetFile = this.getSetting().get("A_FILE_TYPE");
								}

								if (0 == A_targetFile.length) //処理をスキップ
									{
										continue;
									} else //最終ダウンロード成功日から一定日数経過している場合
									{
										if ("all" == this.PactId && true == (undefined !== H_downloadedData[pactid][billDate].dldate) && "" != H_downloadedData[pactid][billDate].dldate[0]) //dldateが空でないか条件追加 20091201miya
											{
												if (false == this.chkRetry(H_downloadedData[pactid][billDate].dldate)) //処理をスキップ
													{
														continue;
													}
											}
									}

								sessid = this.getSessid(rtn);

								for (let targetFile of A_targetFile) //ダウンロードメニューページへ
								{
									A_zipRtn = Array();
									rtn = this.goDownloadMenu(keyFile, keyPass, sessid);
									sessid = this.getSessid(rtn);
									rtn = this.chgBillDate(keyFile, keyPass, sessid, billDate);
									sessid = this.getSessid(rtn);
									element = "ELE_NO_" + targetFile;

									if (true == (-1 !== this.getSetting().get("A_BILL_TYPE").indexOf(targetFile))) //ファイルが通話明細
										{
											var filePath: any = dataPactBillDir;
										} else if (true == (-1 !== this.getSetting().get("A_TUWA_TYPE").indexOf(targetFile))) {
										filePath = dataPactTuwaDir;
									}

									this.doDownload(keyFile, keyPass, sessid, billDate, this.getSetting()[element], filePath, A_zipRtn);

									if (A_zipRtn.length != 0) //ダウンロードステータス更新
										{
											now = this.get_DB().getNow();
											H_outClampIndex.push({
												pactid: pactid,
												carid: this.getSetting().get("CARID"),
												detailno: detailno,
												year: billDate.substr(0, 4),
												month: billDate.substr(4, 2),
												type: targetFile,
												dldate: now,
												is_ready: true,
												is_details: undefined,
												is_comm: undefined,
												is_info: undefined,
												is_calc: undefined,
												is_trend: undefined,
												is_recom: undefined,
												fixdate: now
											});
											A_success.push(pactid + "_" + billDate);
										}
								}

								if (0 < A_success.length) {
									A_success = A_success.filter(function (value, index, self) {return self.indexOf(value) === index});

									for (var sucval of Object.values(A_success)) {
										fs.writeFileSync(dlfp, sucval + "\n");// 2022cvt_006
									}

									A_success = Array();
								}
							}

							if ("" == H_clampData[compType][pactid][detailno].pass_changedate || false == this.chkExpirePass(H_clampData[compType][pactid][detailno].pass_changedate, H_clampData[compType][pactid][detailno].pass_interval)) //セッションＩＤを取得
								{
									sessid = this.getSessid(rtn);
									rtn = this.goPasswdMenu(keyFile, keyPass, sessid);
									sessid = this.getSessid(rtn);
									rtn = this.goPasswdConfirm(keyFile, keyPass, sessid, H_clampData[compType][pactid][detailno].clamppasswd, this.getSetting().get("DUMMY_PASSWORD"));
									sessid = this.getSessid(rtn);
									var updateCnt = this.getUpdateCnt(rtn);
									rtn = this.doPasswdChg(keyFile, keyPass, sessid, H_clampData[compType][pactid][detailno].clamppasswd, this.getSetting().get("DUMMY_PASSWORD"), updateCnt);
									sessid = this.getSessid(rtn);
									rtn = this.goPasswdMenu(keyFile, keyPass, sessid);
									sessid = this.getSessid(rtn);
									rtn = this.goPasswdConfirm(keyFile, keyPass, sessid, this.getSetting().get("DUMMY_PASSWORD"), H_clampData[compType][pactid][detailno].clamppasswd);
									sessid = this.getSessid(rtn);
									updateCnt = this.getUpdateCnt(rtn);
									rtn = this.doPasswdChg(keyFile, keyPass, sessid, this.getSetting().get("DUMMY_PASSWORD"), H_clampData[compType][pactid][detailno].clamppasswd, updateCnt);
									O_ClampModel.updatePassChgDate(pactid, detailno, this.getSetting().get("CARID"), this.get_DB().getNow());
								}
						}
				}
			}
		}

		this.doImport(H_outClampError, "clamp_error_tb");
		this.doImport(H_outClampIndex, "clamp_index_tb");
		fs.closeSync(dlfp);
		this.endScript();
	}

	endScript() //スクリプトの二重起動防止ロック解除
	{
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		throw process.exit(0);
	}

	splitNow() //現在時を取得
	{
		var now = this.get_DB().getNow();
		return now.split(" ");
	}

	splitDate(A_date: string) {
		return A_date.split("-");
	}

	splitTime(A_time: string) {
		return A_time.split(":");
	}

	getHh() {
		var A_now = this.splitNow();
		var A_time = this.splitTime(A_now[1]);
		return A_time[0];
	}

	getYyyyMm(arrayFlg = false) //文字列で返す
	{
		var A_now = this.splitNow();
		var A_date = this.splitDate(A_now[0]);

		if (false == arrayFlg) //配列で返す
			{
				var YyyyMm = A_date[0] + A_date[1];
				return YyyyMm;
			} else {
			return A_date.slice(0, 2);
		}
	}

	getBillDate(months: number) //ダウンロード対象は１年まで
	{
		var A_billDate = Array();

		if (12 < months) {
			months = 12;
		}

		var A_date: any = this.getYyyyMm(true);

		for (var count = 0; count < months; count++) {
			var year = A_date[0];
			var month = A_date[1] - count;

			if (1 > month) {
				year -= 1;
				month += 12;
			}

			if (10 > month) {
				month = 0 + month;
			}

			A_billDate.push(year + month);
		}

		return A_billDate;
	}

	setOptions(handle: any, sslKey: number, sslPass: string, params: any, cookieFlg = false) //2015-02-18 証明書不要になったので削除
	{
		// curl_setopt(handle, CURLOPT_VERBOSE, this.getSetting().get("VERBOSE"));
		// curl_setopt(handle, CURLOPT_SSL_VERIFYHOST, this.getSetting().get("VERIFYHOST"));
		// curl_setopt(handle, CURLOPT_SSL_VERIFYPEER, this.getSetting().get("VERIFYPEER"));
		// curl_setopt(handle, CURLOPT_SSLVERSION, this.getSetting().get("SSLVERSION"));
		// curl_setopt(handle, CURLOPT_RETURNTRANSFER, this.getSetting().get("RETURNTRANSFER"));
		// curl_setopt(handle, CURLOPT_FOLLOWLOCATION, this.getSetting().get("FOLLOWLOCATION"));
		// curl_setopt(handle, CURLOPT_POST, this.getSetting().POST);
		// curl_setopt(handle, CURLOPT_POSTFIELDS, params);

		// if (this.getSetting().existsKey("PROXY") && this.getSetting().get(PROXY)) {
		// 	curl_setopt(handle, CURLOPT_PROXY, this.getSetting().get("PROXY"));
		// 	curl_setopt(handle, CURLOPT_HTTPPROXYTUNNEL, true);

		// 	if (this.getSetting().existsKey("PROXY_PORT") && this.getSetting().get(PROXY_PORT)) {
		// 		curl_setopt(handle, CURLOPT_PROXYPORT, this.getSetting().get("PROXY_PORT"));
		// 	}

		// 	if (this.getSetting().existsKey("PROXY_USER") && this.getSetting().PROXY_USER && this.getSetting().existsKey("PROXY_PASSWORD") && this.getSetting().get(PROXY_PASSWORD)) {
		// 		var userpwd = this.getSetting().PROXY_USER + ":" + this.getSetting().get("PROXY_PASSWORD");
		// 		curl_setopt(handle, CURLOPT_PROXYUSERPWD, userpwd);
		// 	}
		// }

		// if (true == cookieFlg) {
		// 	curl_setopt(handle, CURLOPT_COOKIEJAR, this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/au_cookie/cookie");
		// 	curl_setopt(handle, CURLOPT_COOKIEFILE, this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/au_cookie/tmp");
		// }
	}

	goLogin(sslKey: number, sslPass: string) //POST パラメータ設定
	{
		// var params = {
		// 	action: "769",
		// 	disp: "",
		// 	loginchk: "off"
		// };
		// var handle = curl_init(this.getSetting().get("URL_GO_LOGIN"));
		// this.setOptions(handle, sslKey, sslPass, params, false);
		// var rtn = curl_exec(handle);
		// curl_close(handle);
		// return rtn;
	}

	doLogin(loginid: any, passwd: any, recCode: any, sslKey: number, sslPass: string) //POST パラメータ設定
	{
		// var params = {
		// 	action: "769",
		// 	screen_title: "769",
		// 	reqCD: recCode,
		// 	userID: loginid,
		// 	password: passwd
		// };
		// var fp =  fs.closeSync(this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/au_cookie/tmp", "w");
		// var handle = curl_init(this.getSetting().get("URL_DO_LOGIN"));
		// this.setOptions(handle, sslKey, sslPass, params, false);
		// curl_setopt(handle, CURLOPT_COOKIEJAR, this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/au_cookie/cookie");
		// curl_setopt(handle, CURLOPT_WRITEHEADER, fp);
		// var rtn = curl_exec(handle);
		// fs.closeSync(fp);
		// curl_close(handle);
		// return rtn;
	}

	getSessid(source: any) {
		var result = source.indexOf(this.getSetting().get("SESSION_NAME"));
		var A_lineData = result.split("\n");
		var target = A_lineData[0];
		var A_data = target.split("\"");
		return A_data[2];
	}

	getUpdateCnt(source: any) {
		var result = source.indexOf("updateKaisu");
		var A_lineData = result.split("\n");
		var target = A_lineData[0];
		var A_data = target.split("'");
		return A_data[1];
	}

	goDownloadMenu(sslKey: number, sslPass: string, sessid: any) //POST パラメータ設定
	{
		// var params = {
		// 	[this.getSetting().get("SESSION_NAME")]: sessid,
		// 	dispFrame: "1",
		// 	dispMenu: "",
		// 	action: "1793",
		// 	disp: "",
		// 	command: "check"
		// };
		// var handle = curl_init(this.getSetting().get("URL_GO_DOWNLOAD"));
		// this.setOptions(handle, sslKey, sslPass, params, true);
		// var rtn = curl_exec(handle);
		// curl_close(handle);
		// return rtn;
	}

	chgBillDate(sslKey: number, sslPass: string, sessid: any, billDate: any) //POST パラメータ設定
	{
		// var params = {
		// 	[this.getSetting().get("SESSION_NAME")]: sessid,
		// 	action: "1793",
		// 	command: "chgdate",
		// 	"dclkFnEmail.disp": "true",
		// 	"dclkFnEmail.viewString": "海外でのEメールご利用について",
		// 	"dclkFnEmail.urlLink": "https://bross.kddi.com/global.html",
		// 	screen_title: "1793",
		// 	taisyoDate: billDate
		// };
		// var handle = curl_init(this.getSetting().get("URL_CHG_BILLDATE"));
		// this.setOptions(handle, sslKey, sslPass, params, true);
		// var rtn = curl_exec(handle);
		// curl_close(handle);
		// return rtn;
	}

	doDownload(sslKey: number, sslPass: string, sessid: any, billDate: any, eleNo: string, filePath: string, A_zipRtn: any) //POST パラメータ設定
	{
		// var params = {
		// 	[this.getSetting().get("SESSION_NAME")]: sessid,
		// 	action: "1793",
		// 	command: "download",
		// 	"dclkFnEmail.disp": "true",
		// 	"dclkFnEmail.viewString": "海外でのEメールご利用について",
		// 	"dclkFnEmail.urlLink": "https://bross.kddi.com/global.html",
		// 	screen_title: "1793",
		// 	taisyoDate: billDate,
		// 	["monthlyDataList[" + eleNo + "].downloadFlg"]: "1",
		// 	["monthlyDataList[" + eleNo + "].downloadKbn"]: "1"
		// };
		// var handle = curl_init(this.getSetting().get("URL_DO_DOWNLOAD"));
		// var fp = fs.openSync(filePath + "/downloaded-file.zip", "w");
		// this.setOptions(handle, sslKey, sslPass, params, true);
		// var rtn = curl_exec(handle);
		// fs.writeFileSync(fp, rtn);// 2022cvt_006
		// fs.closeSync(fp);

		// if (fs.existsSync(filePath + "/downloaded-file.zip")) {
		// 	var zipCheckCode: any = execSync("/usr/bin/unzip -t " + filePath + "/downloaded-file.zip");
		// 	if (zipCheckCode.match("/^No errors detected/")) {
		// 		execSync("/usr/bin/unzip -o -d " + filePath + " " + filePath + "/downloaded-file.zip", A_zipRtn);
		// 	} else {
		// 		A_zipRtn = Array();
		// 	}

		// 	fs.unlink(filePath + "/downloaded-file.zip");// 2022cvt_007
		// } else {
		// 	this.infoOut(filePath + "/downloaded-file.zipがありません\n\n", 1);
		// }

		// curl_close(handle);
		// return rtn;
	}

	goPasswdMenu(sslKey: number, sslPass: string, sessid: any) //POST パラメータ設定
	{
		// var params = {
		// 	[this.getSetting().get("SESSION_NAME")]: sessid,
		// 	dispFrame: "1",
		// 	dispMenu: "",
		// 	action: "1537",
		// 	disp: "",
		// 	command: "check"
		// };
		// var handle = curl_init(this.getSetting().get("URL_GO_PASSWD"));
		// this.setOptions(handle, sslKey, sslPass, params, true);
		// var rtn = curl_exec(handle);
		// curl_close(handle);
		// return rtn;
	}

	goPasswdConfirm(sslKey: number, sslPass: string, sessid: any, oldPasswd: any, newPasswd: any) //POST パラメータ設定
	{
		// var params = {
		// 	[this.getSetting().get("SESSION_NAME")]: sessid,
		// 	action: "1537",
		// 	errFlag: "",
		// 	command: "CHECK",
		// 	pswdKbn: "F",
		// 	updateKaisu: "0",
		// 	screen_title: "1537",
		// 	oldPass: oldPasswd,
		// 	newPass: newPasswd,
		// 	newPassCnf: newPasswd
		// };
		// var handle = curl_init(this.getSetting().get("URL_CONFIRM_PASSWD"));
		// this.setOptions(handle, sslKey, sslPass, params, true);
		// var rtn = curl_exec(handle);
		// curl_close(handle);
		// return rtn;
	}

	doPasswdChg(sslKey: number, sslPass: string, sessid: any, oldPasswd: any, newPasswd: any, updateCnt: any) //POST パラメータ設定
	{
		// var params = {
		// 	[this.getSetting().get("SESSION_NAME")]: sessid,
		// 	action: "1537",
		// 	errFlag: "",
		// 	command: "SAVE",
		// 	pswdKbn: "F",
		// 	updateKaisu: updateCnt,
		// 	screen_title: "1537",
		// 	oldPass: oldPasswd,
		// 	newPass: newPasswd,
		// 	newPassCnf: newPasswd
		// };
		// var handle = curl_init(this.getSetting().get("URL_CHG_PASSWD"));
		// this.setOptions(handle, sslKey, sslPass, params, true);
		// var rtn = curl_exec(handle);
		// curl_close(handle);
		// return rtn;
	}

	async doImport(H_inputData: any, table: string) //トランザクション開始
	{
		this.get_DB().beginTransaction();

		if (0 != H_inputData.length) //アップデート可能なテーブル、これを設定しないとclamp_index_tb用のデータでclamp_error_tbにUPDATEしようとする 20091201miya
			{
				var A_updatable = ["clamp_index_tb"];
				var indcnt = 0;

				if (true == (-1 !== A_updatable.indexOf(table))) //$A_updatableを条件追加 20091201miya
					//SBの関数流用 20091130miya
					{
						indcnt = await this.O_SB_Model.getClampIndexCount(H_inputData);
					}

				if (true == 0 < indcnt && true == (-1 !== A_updatable.indexOf(table))) //$A_updatableを条件追加 20091201miya
					//SBの関数流用 20091130miya
					{
						var rtn = this.O_SB_Model.updateClampIndexFixdate(H_inputData);
					} else {
					rtn = await this.get_DB().pgCopyFromArray(table, H_inputData);
				}

				if (!rtn) //取込成功
					{
						this.get_DB().rollback();
						this.errorOut(1000, "\n" + table + " へのデータ取込に失敗しました\n", 0, "", "");
						throw process.exit(-1);// 2022cvt_009
					} else //$this->infoOut($table . " へデーターインポート完了\n",1);	// メール削減のためコメントアウト 20091120miya
					{}
			}

		this.get_DB().commit();
	}

	getMonthEndDay(year: any, month: number) {
		var day = new Date(year,month + 1,0, 0, 0, 0).getTime() / 1000;
		return new Date(day);
	}

	chkExpirePass(date: any, month: number) //有効期限残り１ヶ月以内
	{
		if (1 > month) {
			month = 1;
		}

		var A_date = date.split("-");
		A_date[1] += month - 1;
		var endDay = this.getMonthEndDay(A_date[0], A_date[1]);

		if (A_date[2] > endDay) {
			A_date[2] = endDay;
		}

		var A_now = this.splitNow();
		var A_nowDate: any = A_now[0].split("-");

		if (new Date(A_date[0],A_date[1],A_date[2],0, 0, 0).getTime() / 1000 <= new Date(A_nowDate[0],A_nowDate[1],A_nowDate[2],0, 0, 0).getTime() / 1000) //有効期限まだ大丈夫
			{
				return false;
			} else {
			return true;
		}
	}

	chkRetry(A_date: any[]) //ダウンロード日付の降順でソート
	{
		A_date.sort();
		var A_dlDate = A_date[0].split("-");
		var A_now = this.splitNow();
		var A_nowDate: any[] = A_now[0].split("-");

		if (this.getSetting().get("RETRY_DAY") < this.compareDate(A_nowDate[0], A_nowDate[1], A_nowDate[2], A_dlDate[0], A_dlDate[1], A_dlDate[2])) {
			return false;
		} else {
			return true;
		}
	}

	compareDate(year1: number, month1: number, day1: number, year2: number, month2: number, day2: number) //1日は86400秒
	{
		var date1 = new Date(year1,month1,day1,0, 0, 0).getTime() / 1000;
		var date2 = new Date(year2,month2,day2,0, 0, 0).getTime() / 1000;
		var diff = date1 - date2;
		var diffDay = diff / 86400;
		return diffDay;
	}

};
