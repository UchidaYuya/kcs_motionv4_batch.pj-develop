//WILLCOM DLプロセス
//2013/06/17 上杉勝史 作成
//
import ProcessBaseBatch from "../ProcessBaseBatch";
import WillcomDownloadModel from "../../model/script/WillcomDownloadModel";
import WillcomDownloadView from "../../view/script/WillcomDownloadView";
import ClampModel from "../../model/ClampModel";
import { sprintf } from "../../../db_define/define";

const fs = require("fs");

export default class WillcomDownloadProc extends ProcessBaseBatch {
	O_View: WillcomDownloadView;
	O_Model: WillcomDownloadModel;
	O_ClampModel: ClampModel;
	BillDate: string | undefined;
	PactId: string | undefined;
	EndFlg: string | undefined;
	constructor(H_param: {} | any[] = Array()) //// view の生成
	//// model の生成
	{
		super(H_param);
		this.getSetting().loadConfig("willcom_download");
		this.getSetting().loadConfig("willcom");
		this.O_View = new WillcomDownloadView(this.getSetting(), this.getOut());
		this.O_Model = new WillcomDownloadModel(this.get_DB());
		this.O_ClampModel = new ClampModel(this.get_DB());
	}

	async doExecute(H_param: {} | any[] = Array()) 
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		var fp = fs.openSync(this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/dl_willcom_list", "w");
		this.lockProcess(this.O_View.get_ScriptName());
		this.BillDate = this.O_View.get_HArgv("-y");
		this.PactId = this.O_View.get_HArgv("-p");
		this.EndFlg = this.O_View.get_HArgv("-s");

		if ("Y" == this.EndFlg) //現在時を取得
			//終了時間が過ぎている場合
			//ループを抜けて終了処理へ
			{
				var hour = this.getHh();

				if (hour >= this.getSetting().get("ENDHOUR")) //中断する旨 DBに書き込む？
					//スクリプトの二重起動防止ロック解除
					//スクリプト終了処理
					{
						this.infoOut("\nダウンロード制限時間(0時～" + this.getSetting().get("ENDHOUR") + "時)外の為、処理を終了します\n\n", 1);
						this.unLockProcess(this.O_View.get_ScriptName());
						this.set_ScriptEnd();
						throw process.exit(-1);
					}
			}

		if ("all" == this.PactId) {
			this.PactId = "";
		}

		var BillDateNoneFlg = false;

		if ("none" == this.BillDate) //先月の日付
			{
				var thismonth = new Date().toJSON().slice(0,10).replace(/-/g,'');
				// var thismonth = date("Y,m,d", mktime(0, 0, 0, date("n"), date("j"), date("Y")));
				var A_tm = thismonth.split("/,/");
				// var A_tm = preg_split("/,/", thismonth);
				this.BillDate = A_tm[0] + A_tm[1];
				BillDateNoneFlg = true;
			}

		var now = this.get_DB().getNow();

		var date = new Date()
		date.setDate(date.getDate()-3);
		var daysago3 = date.toJSON().slice(0,10).replace(/-/g,'-');

		var days1st = new Date().toJSON().slice(0,8).replace(/-/g,'-') + "01";
		var H_outClampError = Array();
		var H_clampData:any = this.O_ClampModel.getClampList(this.getSetting().get("CARID"), this.getSetting().get("CHK_PACTID"), this.getSetting().get("A_LOGIN_STATUS"));

		if (H_clampData.length == 0) //エラーメッセージ出力
			//エラーメール出力
			//スクリプトの二重起動防止ロック解除
			//終了処理へ
			{
				this.infoOut("\nログインテスト用のＩＤが登録されていない為、終了します\n\n", 1);
				this.O_View.H_error.push({
					type: "logintest",
					message: "ログインテスト用のＩＤが登録されていない為、終了します"
				});
				this.O_Model.InsertClampError(this.getSetting().get("CHK_PACTID"), this.getSetting().get("CARID"), this.O_View.H_error);
				this.O_View.H_error = Array();
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw process.exit(-1);
			}

		this.O_View.loginid = H_clampData.M[this.getSetting().get("CHK_PACTID")][0].clampid;
		this.O_View.password = H_clampData.M[this.getSetting().get("CHK_PACTID")][0].clamppasswd;
		this.O_View.pactid = this.getSetting().get("CHK_PACTID");
		var H_result_py = this.O_View.doExecute("login");

		if (false == (undefined !== H_result_py[this.getSetting().get("CHK_PACTID") + "_"].login) || false === H_result_py[this.getSetting().get("CHK_PACTID") + "_"].login) //ログイン判定：失敗
			//エラーメール出力
			//スクリプトの二重起動防止ロック解除
			//終了処理へ
			{
				var chkCompname = H_clampData.M[this.getSetting().get("CHK_PACTID")][0].compname;
				this.infoOut("\n" + chkCompname + " 様でダウンロードサイトへログインできなかった為、処理を終了します\n\n", 1);
				this.O_View.H_error.push({
					type: "logintest",
					message: "テスト用のＩＤでダウンロードサイトへログインできなかった為、処理を終了します"
				});
				this.O_Model.InsertClampError(this.getSetting().get("CHK_PACTID"), this.getSetting().get("CARID"), this.O_View.H_error);
				this.O_View.H_error = Array();
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw process.exit(-1);
			} else //ログイン判定に成功したら最終ダウンロード日を更新する
			{
				var H_loginTest = Array();
				H_loginTest.push({
					pactid: this.getSetting().get("CHK_PACTID"),
					carid: this.getSetting().get("CARID"),
					detailno: 0,
					year: new Date().getFullYear(),
					month: (new Date().getMonth()+1).toString().padStart(2, '0'),
					type: "Call",
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
				this.doImport(H_loginTest);
			}

		var H_clampinfo = await this.O_ClampModel.getClampList(this.getSetting().get("CARID"), this.PactId, this.getSetting().get("A_LOGIN_STATUS"));
		var H_outClampIndex = Array();
		var A_listed = Array();

		if (H_clampinfo.length > 0) //$this->infoOut("カウント：" . count($H_clampinfo) . "件\n",1);
			{
				var H_downloadedData = this.O_ClampModel.getDownloadedList(this.getSetting().get("CARID"));
				var A_downloadedPactid = Object.keys(H_downloadedData);

				for (var type_data of H_clampinfo) {
					for (var pactid in type_data) //新規登録された会社かどうかチェックする（clamp_index_tbにレコードがあるかないかで判断
					{
						var pact_data = type_data[pactid];

						if (false == (-1 !== A_downloadedPactid.indexOf(pactid))) //新規ではない場合
							{
								var newFlg = true;
							} else {
							newFlg = false;
						}

						if (true == BillDateNoneFlg) //新規の場合
							//請求年月指定有りの場合は新規でも指定年月のみダウンロード対象
							{
								if (true == newFlg) //当月から過去分までの請求年月リストを取得する
									//新規ではない場合
									{
										var A_billDate = this.getBillDate(this.getSetting().get("MONTH_CNT"));
									} else {
									A_billDate = [this.BillDate];
								}
							} else {
							A_billDate = [this.BillDate];
						}

						var H_stop_login = Array();

						if (true == Array.isArray(A_billDate) && true == A_billDate.length > 0) {
							for (var yyyymm of A_billDate) //まだその会社・その月のデータをDL済みでなければ処理を実行
							{
								var H_pyindex;

								if (undefined !== H_downloadedData[pactid][yyyymm]) {
									H_pyindex = H_downloadedData[pactid][yyyymm];
								}

								var dldate;
								var dl_again: boolean = false;

								if (true == Array.isArray(H_pyindex.dldate)) {
									for (var dldate of H_pyindex.dldate) {
										// if (true == (Date.parse(dldate))) {
										// 	dl_again = false;
										// } else {
											dl_again = true;
										// }
									}
								}

								if (false == Array.isArray(H_pyindex) || true == Array.isArray(H_pyindex) && false != dl_again) //viewに年月をセット
									//WILLCOMのDLサイトの月数は利用月なので、サイトに渡すパラメータは-1する
									//請求年月ディレクトリを取得
									//willcomディレクトリ
									//ダウンロードDIR
									//請求ディレクトリ
									//通話ディレクトリ
									//会社ごとのデータを回す
									//ダウンロードリスト書き込み済み配列
									{
										this.O_View.date_y = yyyymm.substr(0, 4);
										this.O_View.date_m = yyyymm.substr(4, 2);
										var date_y_dl = this.O_View.date_y;
										var date_m_dl = this.O_View.date_m - 1;
									
										if (1 > date_m_dl) {
											date_y_dl -= 1;
											date_m_dl += 12;
										}

										this.O_View.date_y_dl = date_y_dl;
										this.O_View.date_m_dl = date_m_dl;
										var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + yyyymm;
										this.makeDir(dataDir);
										var willcomDir = dataDir + this.getSetting().WILLCOM_DIR;
										this.makeDir(willcomDir);
										var dlDir = willcomDir + "/zip";
										this.makeDir(dlDir);
										this.O_View.download_dir = dlDir;
										var dataBillDir = willcomDir + this.getSetting().get("BILL_DIR");
										this.makeDir(dataBillDir);
										var dataTuwaDir = willcomDir + this.getSetting().get("TUWA_DIR");
										this.makeDir(dataTuwaDir);
										A_listed = Array();

										for (var detailno in pact_data) //ログイン失敗をキャッチしてブレイク
										//必要なパラメータが揃っていればダウンロード
										{
											var param = pact_data[detailno];

											if (true == (undefined !== H_stop_login[pactid][detailno]) && true == H_stop_login[pactid][detailno]) {
												break;
											}

											var pactBillDir = dataBillDir + "/" + pactid;
											var pactTuwaDir = dataTuwaDir + "/" + pactid;
											this.makeDir(pactBillDir);
											this.makeDir(pactTuwaDir);
											this.O_View.extract_path = pactTuwaDir;

											if ("" != param.clampid && "" != param.clamppasswd && "" != pactid) //ダウンロード
												//$H_result_pyはログイン/DLの実行結果。DLは1件ずつだから配列には1件しか入ってこない。
												//キーが[PACTID_YYYYMM]の["dl"]と["login"]にtrue/falseを入れている
												{
													this.O_View.loginid = param.clampid;
													this.O_View.password = param.clamppasswd;
													this.O_View.pactid = Number(pactid);
													this.O_View.detailno = detailno;
													H_result_py = this.O_View.doExecute("dl");

													if (true === H_result_py[pactid + "_" + yyyymm].login) {
														if (true == (undefined !== H_result_py[pactid + "_" + yyyymm].dl) && true === H_result_py[pactid + "_" + yyyymm].dl) //ファイルの種類
															//再ダウンロードのときはdldateを更新しない
															//ダウンロードステータス更新
															//begin
															//clamp_tbアップデート実行
															//$this->infoOut("pactid=" . $pactid . " WILCOMM請求情報をダウンロード\n",1);
															//コミット
															//ダウンロードステータス登録
															//ダウンロードリストファイルに書き込む
															//ダウンロードリストに書き込み済みなら配列に入れる（リストに二回入れないため）
															{
																var targetFile = "Call";
																var dldate_new = undefined;

																if (true == dl_again) {
																	if (!dldate) {
																		dldate_new = now;
																	} else {
																		dldate_new = dldate;
																	}
																} else {
																	dldate_new = now;
																}

																H_outClampIndex.push({
																	pactid: pactid,
																	carid: this.getSetting().get("CARID"),
																	detailno: detailno,
																	year: this.O_View.date_y,
																	month: this.O_View.date_m,
																	type: targetFile,
																	dldate: dldate_new,
																	is_ready: true,
																	is_details: undefined,
																	is_comm: undefined,
																	is_info: undefined,
																	is_calc: undefined,
																	is_trend: undefined,
																	is_recom: undefined,
																	fixdate: now
																});
																this.get_DB().beginTransaction();
																this.O_Model.updateClamp(pactid, detailno, true);
																this.get_DB().commit();
																this.doImport(H_outClampIndex);
																H_outClampIndex = Array();

																if (false == (-1 !== A_listed.indexOf(pactid + "_" + yyyymm))) {
																	fs.writeFileSync(fp, pactid + "_" + yyyymm + "\n");
																	A_listed.push(pactid + "_" + yyyymm);
																}
															}
													} else if (false === H_result_py[pactid + "_" + yyyymm].login) //clamp_tbアップデート実行
														{
															this.O_Model.updateClamp(pactid, detailno, false);
															H_stop_login[pactid][detailno] = true;
															this.infoOut("pactid=" + pactid + " detailno=" + detailno + " ログイン失敗につきこの企業のDLを中断\n", 1);
														}
												}
										}
									}
							}
						}

						this.O_Model.InsertClampError(pactid, this.getSetting().get("CARID"), this.O_View.H_error);
						this.O_View.H_error = Array();
					}
				}
			} else //$this->infoOut("WILLCOMのダウンロード対象がない\n",1);
			{}

		this.unLockProcess(this.O_View.get_ScriptName());

		if ("all" == this.PactId || "" == this.PactId) {
			var H_failedData = this.O_ClampModel.getFailedList(this.getSetting().get("CARID"), new Date().getFullYear(), (new Date().getMonth()+1).toString().padStart(2, '0'));

			if (true == (undefined !== H_failedData) && true == Array.isArray(H_failedData)) {
				for (var fkey in H_failedData) {
					var fval = H_failedData[fkey];
// 2022cvt_021
					var needle = fval.pactid + "_" + fval.year + sprintf("%02d", fval.month);

					if (false == (-1 !== A_listed.indexOf(needle))) {
						fs.writeFileSync(fp, needle + "\n");
						A_listed.push(needle);
					}
				}
			}
		}

		fs.close(fp);
		this.set_ScriptEnd();
	}

	splitNow() //現在時を取得
	{
		var now = this.get_DB().getNow();
		return now.split(" ");
		// return split(" ", now);
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
	//請求年月リスト作成
	{
		var A_billDate = Array();

		if (12 < months) {
			months = 12;
		}

		var A_date:any = this.getYyyyMm(true);

		for (var count = 0; count < months; count++) {
			var year = A_date[0];
			var month:any = A_date[1] - count;

			if (1 > month) {
				year -= 1;
				month += 12;
			}

			if (10 > month) {
				month = "0" + month;
			}

			A_billDate.push(year + month);
		}

		return A_billDate;
	}
	async doImport(H_outClampIndex: string | any[] | undefined | any) //トランザクション開始
	//clamp_index_tbへデータ取込
	{
		this.get_DB().beginTransaction();

		if (0 != H_outClampIndex.length) //データがあれば最終更新日上書き
			//clamp_index_tb取込失敗
			{
				var indcnt = await this.O_Model.getClampIndexCount(H_outClampIndex);

				if (true == 0 < indcnt) {
					var rtn = await this.O_Model.updateClampIndexFixdate(H_outClampIndex);
				} else {
					rtn = await this.get_DB().pgCopyFromArray("clamp_index_tb", H_outClampIndex);
				}

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + "clamp_index_tb" + " へのデータ取込に失敗しました\n", 0, "", "");
					throw process.exit(-1);
				} else //$this->infoOut("clamp_index_tb" . " へデーターインポート完了\n",1);
					{}
			}

		this.get_DB().commit();
	}
};
