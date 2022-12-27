//
//ソフトバンクダウンロードプロセス
//
//更新履歴：<br>
//2009/05/28 宮澤龍彦 作成
//
//@uses ProcessBaseBatch
//@package SBDownload
//@filesource
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/05/28
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ソフトバンクダウンロードプロセス
//
//@uses ProcessBaseBatch
//@package SBDownload
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/05/28
//

require("process/ProcessBaseBatch.php");

require("model/script/SBDownloadModel.php");

require("view/script/SBDownloadView.php");

require("model/ClampModel.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2009/06/05
//
//@param array $H_param
//@param array $H_argv
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author miyazawa
//@since 2009/06/05
//
//@param array $H_param
//@access protected
//@return void
//
//
//タイムスタンプを日付と時間部分に分割
//
//@author maeda
//@since 2009/06/03
//
//@access public
//@return 日付と時間の配列
//
//
//タイムスタンプの日付部分を年、月、日に分割
//
//@author maeda
//@since 2009/06/03
//
//@param mixed $A_date
//@access public
//@return 年、月、日の配列
//
//
//タイムスタンプの時間部分を時、分、秒に分割
//
//@author maeda
//@since 2009/06/03
//
//@param mixed $A_time
//@access public
//@return 時、分、秒の配列
//
//
//現在時間から時間を取得
//
//@author maeda
//@since 2009/06/03
//
//@access public
//@return 時間
//
//
//現在日付から年月を取得
//
//@author maeda
//@since 2009/06/03
//
//@access public
//@return 年月
//
//
//ダウンロード対象の請求年月を取得する
//
//@author maeda
//@since 2009/06/03
//
//@param mixed $months
//@access public
//@return void
//
//
//clamp_index_tbへデータ取込
//
//@author maeda
//@since 2009/06/03
//
//@param mixed $H_outClampIndex
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2009/06/05
//
//@access public
//@return void
//
class SBDownloadProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //// view の生成
	//// model の生成
	{
		super(H_param);
		this.getSetting().loadConfig("sb_download");
		this.getSetting().loadConfig("softbank");
		this.O_View = new SBDownloadView(this.getSetting(), this.getOut());
		this.O_Model = new SBDownloadModel(this.get_DB());
		this.O_ClampModel = new ClampModel(this.get_DB());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//処理開始
	//$this->infoOut("ソフトバンク自動ダウンロード処理開始\n",1);	// メール削減のためコメントアウト 20091120miya
	//ダウンロードリストファイルオープン
	//$fp = fopen($this->getSetting()->KCS_DIR . "/script/dl_sb_list", "w");
	//リストファイルのディレクトリ変更 20140710 s.maeda
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//実行時間制限がある場合
	//請求年月指定なしフラグ
	//3日前の日付 20091126miya
	//今月1日の日付 20091210miya
	//エラーメール出力用配列
	//ダウンロードエラーメール送信用テーブル
	//特定の会社のダウンロードＩＤ取得 （pactid、ID、PASSWORD、パスワード更新年月、更新間隔、失敗フラグ、Hotlineかどうか）
	//ＩＤリストが０件の場合
	//$H_data = $this->O_Model->getData( array() );
	//DLサイトへのログインID、パスワードを取得（softbankのみ、成功したものはもう取得しない）
	//[type][pactid][detailno]の配列に以下のパラメータが入ってくる
	//clampid
	//clamppasswd
	//code
	//key_file
	//key_pass
	//pass_changedate
	//pass_interval
	//compname
	//A_LOGIN_STATUSを条件に追加（0,1のみ） 20091208miya
	//出力用配列
	//ダウンロード進捗管理テーブル
	//ダウンロードリスト書き込み済み配列 20091013miya
	//一件でもあれば自動ダウンロードプロセス作動
	//スクリプトの二重起動防止ロック解除
	//最新月のclamp_index_tbから、取込失敗したデータがあれば加える 20091208miya
	//ただし会社指定されていないときのみ 20091210miya
	//終了
	//$this->infoOut("ソフトバンク自動ダウンロード処理終了\n",1);	// メール削減のためコメントアウト 20091120miya
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		var fp = fopen(this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/dl_sb_list", "w");
		this.lockProcess(this.O_View.get_ScriptName());
		this.BillDate = this.O_View.get_HArgv("-y");
		this.PactId = this.O_View.get_HArgv("-p");
		this.EndFlg = this.O_View.get_HArgv("-s");

		if ("Y" == this.EndFlg) //現在時を取得
			//終了時間が過ぎている場合
			//ループを抜けて終了処理へ
			{
				var hour = this.getHh();

				if (hour >= this.getSetting().ENDHOUR) //中断する旨 DBに書き込む？
					//スクリプトの二重起動防止ロック解除
					//スクリプト終了処理
					{
						this.infoOut("\n\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5236\u9650\u6642\u9593(0\u6642\uFF5E" + this.getSetting().ENDHOUR + "\u6642)\u5916\u306E\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
						this.unLockProcess(this.O_View.get_ScriptName());
						this.set_ScriptEnd();
						throw die(-1);
					}
			}

		if ("all" == this.PactId) {
			this.PactId = "";
		}

		var BillDateNoneFlg = false;

		if ("none" == this.BillDate) //先月の日付
			//$lastmonth = date("Y,m,d", mktime(0,0,0,date("n")-1,date("j"),date("Y")));
			//$A_lm = preg_split("/,/", $lastmonth);
			//$this->BillDate = $A_lm[0] . $A_lm[1];
			{
				var thismonth = date("Y,m,d", mktime(0, 0, 0, date("n"), date("j"), date("Y")));
				var A_tm = preg_split("/,/", thismonth);
				this.BillDate = A_tm[0] + A_tm[1];
				BillDateNoneFlg = true;
			}

		var now = this.get_DB().getNow();
		var daysago3 = date("Y-m-d", strtotime("-3 day"));
		var days1st = date("Y-m") + "-01";
		var H_outClampError = Array();
		var H_clampData = this.O_ClampModel.getClampList(this.getSetting().CARID, this.getSetting().CHK_PACTID, this.getSetting().A_LOGIN_STATUS);

		if (H_clampData.length == 0) //エラーメッセージ出力
			//エラーメール出力
			//スクリプトの二重起動防止ロック解除
			//終了処理へ
			{
				this.infoOut("\n\u30ED\u30B0\u30A4\u30F3\u30C6\u30B9\u30C8\u7528\u306E\uFF29\uFF24\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
				this.O_View.H_error.push({
					type: "logintest",
					message: "\u30ED\u30B0\u30A4\u30F3\u30C6\u30B9\u30C8\u7528\u306E\uFF29\uFF24\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u7D42\u4E86\u3057\u307E\u3059"
				});
				this.O_Model.InsertClampError(this.getSetting().CHK_PACTID, this.getSetting().CARID, this.O_View.H_error);
				this.O_View.H_error = Array();
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw die(-1);
			}

		this.O_View.loginid = H_clampData.M[this.getSetting().CHK_PACTID][0].clampid;
		this.O_View.password = H_clampData.M[this.getSetting().CHK_PACTID][0].clamppasswd;
		this.O_View.pactid = this.getSetting().CHK_PACTID;
		var H_result_py = this.O_View.doExecute("login");

		if (false === H_result_py[this.getSetting().CHK_PACTID + "_"].login) //ここの$H_result_pyのインデックスは「PACTID_」になってる（DLのところで同じことをやっている部分は「_」の後にYYYYMMがつく）
			//ログイン判定：失敗
			{
				if ("" != strstr(rtn, this.getSetting().ERR_LOGIN_STR1) || "" != strstr(rtn, this.getSetting().ERR_LOGIN_STR2)) //エラーメッセージ出力
					//エラーメール出力
					//スクリプトの二重起動防止ロック解除
					//終了処理へ
					{
						this.infoOut("\n" + chkCompname + " \u69D8\u3067\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30B5\u30A4\u30C8\u3078\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u306A\u304B\u3063\u305F\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
						this.O_View.H_error.push({
							type: "logintest",
							message: "\u30C6\u30B9\u30C8\u7528\u306E\uFF29\uFF24\u3067\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30B5\u30A4\u30C8\u3078\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u306A\u304B\u3063\u305F\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059"
						});
						this.O_Model.InsertClampError(this.getSetting().CHK_PACTID, this.getSetting().CARID, this.O_View.H_error);
						this.O_View.H_error = Array();
						this.unLockProcess(this.O_View.get_ScriptName());
						this.set_ScriptEnd();
						throw die(-1);
					}
			} else //ログイン判定に成功したら最終ダウンロード日を更新する 20091130miya
			{
				var H_loginTest = Array();
				H_loginTest.push({
					pactid: this.getSetting().CHK_PACTID,
					carid: this.getSetting().CARID,
					detailno: 0,
					year: date("Y"),
					month: date("m"),
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

		var H_clampinfo = this.O_ClampModel.getClampList(this.getSetting().CARID, this.PactId, this.getSetting().A_LOGIN_STATUS);
		var H_outClampIndex = Array();
		var A_listed = Array();

		if (H_clampinfo.length > 0) //$this->infoOut("カウント：" . count($H_clampinfo) . "件\n",1);
			//clamp_index_tbからダウンロード済みファイルリストを取得
			//過去にダウンロードしたことがある会社一覧を取得
			//clamp_infoを回して必要なデータを取得
			//$this->infoOut("ソフトバンク自動ダウンロード成功\n",1);
			{
				var H_downloadedData = this.O_ClampModel.getDownloadedList(this.getSetting().CARID);
				var A_downloadedPactid = Object.keys(H_downloadedData);

				for (var type_data of Object.values(H_clampinfo)) {
					for (var pactid in type_data) //新規登録された会社かどうかチェックする（clamp_index_tbにレコードがあるかないかで判断）
					//新規の場合
					//ダウンロード対象の請求年月リストを作成
					//請求年月指定無し
					//ログイン停止管理配列（ログインに失敗した企業はそこで止める）
					//$A_billDateを回してディレクトリ作成 YYYYMMで入ってる
					//エラークリア
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
										var A_billDate = this.getBillDate(this.getSetting().MONTH_CNT);
									} else {
									A_billDate = [this.BillDate];
								}
							} else {
							A_billDate = [this.BillDate];
						}

						var H_stop_login = Array();

						if (true == Array.isArray(A_billDate) && true == A_billDate.length > 0) {
							for (var yyyymm of Object.values(A_billDate)) //まだその会社・その月のデータをDL済みでなければ処理を実行
							{
								var H_pyindex = undefined;

								if (undefined !== H_downloadedData[pactid][yyyymm]) {
									H_pyindex = H_downloadedData[pactid][yyyymm];
								}

								var dldate = undefined;
								var dl_again = undefined;

								if (true == Array.isArray(H_pyindex.dldate)) {
									for (var dldate of Object.values(H_pyindex.dldate)) {
										if (true == strtotime(dldate)) {
											dl_again = false;
										} else {
											dl_again = true;
										}
									}
								}

								if (false == Array.isArray(H_pyindex) || true == Array.isArray(H_pyindex) && false != dl_again) //$dl_again条件追加 20091126miya
									//viewに年月をセット
									//SBのDLサイトの月数は利用月なので、サイトに渡すパラメータは-1する 20090904miya
									//請求年月ディレクトリを取得
									//請求年月ディレクトリ
									//softbankディレクトリ
									//ディレクトリ
									//請求・通話ディレクトリ
									//通話ディレクトリ追加 20091013miya
									//請求ファイルが新しくなりディレクトリを vodafone から SOFTBANK へ変更
									//請求・通話ディレクトリ
									//会社ごとのデータを回す
									//ダウンロードリスト書き込み済み配列 20091013miya
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
										var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + yyyymm;
										this.makeDir(dataDir);
										var softbankDir = dataDir + this.getSetting().SOFTBANK_DIR;
										dataDir += this.getSetting().CARRIER_DIR;
										this.makeDir(dataDir);
										this.makeDir(softbankDir);
										var dataBillDir = dataDir + this.getSetting().BILL_DIR;
										var dataTuwaDir = dataDir + this.getSetting().TUWA_DIR;
										var softbankBillDir = softbankDir + this.getSetting().BILL_DIR;
										this.makeDir(dataBillDir);
										this.makeDir(dataTuwaDir);
										this.makeDir(softbankBillDir);
										A_listed = Array();

										for (var detailno in pact_data) //ログイン失敗をキャッチしてブレイク
										//通話ディレクトリ追加 20091013miya
										//請求ファイルが新しくなりディレクトリを vodafone から SOFTBANK へ変更
										//会社ごとのディレクトリ作成
										//通話ディレクトリ追加 20091013miya
										//通話ディレクトリ追加 20091013miya
										//必要なパラメータが揃っていればダウンロード
										{
											var param = pact_data[detailno];

											if (true == (undefined !== H_stop_login[pactid][detailno]) && true == H_stop_login[pactid][detailno]) {
												break;
											}

											dataBillDir = dataDir + this.getSetting().BILL_DIR;
											dataTuwaDir = dataDir + this.getSetting().TUWA_DIR;
											softbankBillDir = softbankDir + this.getSetting().BILL_DIR;
											dataBillDir += "/" + pactid;
											dataTuwaDir += "/" + pactid;
											softbankBillDir += "/" + pactid;
											this.makeDir(dataBillDir);
											this.makeDir(dataTuwaDir);
											this.makeDir(softbankBillDir);
											this.O_View.extract_path = dataBillDir;
											this.O_View.extractNewBillPath = softbankBillDir;

											if ("" != param.clampid && "" != param.clamppasswd && "" != pactid) //ダウンロード
												//$H_result_pyはログイン/DLの実行結果。DLは1件ずつだから配列には1件しか入ってこない。キーが[PACTID_YYYYMM]の["dl"]と["login"]にtrue/falseを入れている
												{
													this.O_View.loginid = param.clampid;
													this.O_View.password = param.clamppasswd;
													this.O_View.pactid = pactid;
													H_result_py = this.O_View.doExecute("dl");

													if (true === H_result_py[pactid + "_" + yyyymm].login) {
														if (true == (undefined !== H_result_py[pactid + "_" + yyyymm].dl) && true === H_result_py[pactid + "_" + yyyymm].dl) //isset条件追加 20100706miya
															//ファイルの種類
															//再ダウンロードのときはdldateを更新しない 20100517miya
															//ダウンロードステータス更新
															//begin
															//clamp_tbアップデート実行
															//$this->infoOut("pactid=" . $pactid . " ソフトバンク請求情報をダウンロード\n",1);
															//コミット
															//ダウンロードステータス登録
															//ダウンロードリストファイルに書き込む
															//ダウンロードリストに書き込み済みなら配列に入れる（リストに二回入れないため）20091013miya
															{
																var targetFile = "Call";
																var dldate_new = undefined;

																if (true == dl_again) {
																	if (is_null(dldate)) {
																		dldate_new = now;
																	} else {
																		dldate_new = dldate;
																	}
																} else {
																	dldate_new = now;
																}

																H_outClampIndex.push({
																	pactid: pactid,
																	carid: this.getSetting().CARID,
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
																	fwrite(fp, pactid + "_" + yyyymm + "\n");
																	A_listed.push(pactid + "_" + yyyymm);
																}
															}
													} else if (false === H_result_py[pactid + "_" + yyyymm].login) //clamp_tbアップデート実行
														{
															this.O_Model.updateClamp(pactid, detailno, false);
															H_stop_login[pactid][detailno] = true;
															this.infoOut("pactid=" + pactid + " detailno=" + detailno + " \u30ED\u30B0\u30A4\u30F3\u5931\u6557\u306B\u3064\u304D\u3053\u306E\u4F01\u696D\u306EDL\u3092\u4E2D\u65AD\n", 1);
														}
												}
										}
									}
							}
						}

						this.O_Model.InsertClampError(pactid, this.getSetting().CARID, this.O_View.H_error);
						this.O_View.H_error = Array();
					}
				}
			} else //$this->infoOut("ソフトバンクのダウンロード対象がない\n",1);	// メール削減のためコメントアウト 20091120miya
			{}

		this.unLockProcess(this.O_View.get_ScriptName());

		if ("all" == this.PactId || "" == this.PactId) {
			var H_failedData = this.O_ClampModel.getFailedList(this.getSetting().CARID, date("Y"), date("m"));

			if (true == (undefined !== H_failedData) && true == Array.isArray(H_failedData)) {
				for (var fkey in H_failedData) {
					var fval = H_failedData[fkey];
					var needle = fval.pactid + "_" + fval.year + sprintf("%02d", fval.month);

					if (false == (-1 !== A_listed.indexOf(needle))) {
						fwrite(fp, needle + "\n");
						A_listed.push(needle);
					}
				}
			}
		}

		fclose(fp);
		this.set_ScriptEnd();
	}

	splitNow() //現在時を取得
	{
		var now = this.get_DB().getNow();
		return split(" ", now);
	}

	splitDate(A_date) {
		return split("-", A_date);
	}

	splitTime(A_time) {
		return split(":", A_time);
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

	getBillDate(months) //ダウンロード対象は１年まで
	//請求年月リスト作成
	{
		var A_billDate = Array();

		if (12 < months) {
			months = 12;
		}

		var A_date = this.getYyyyMm(true);

		for (var count = 0; count < months; count++) {
			var year = A_date[0];
			var month = A_date[1] - count;

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

	doImport(H_outClampIndex) //トランザクション開始
	//clamp_index_tbへデータ取込
	{
		this.get_DB().beginTransaction();

		if (0 != H_outClampIndex.length) //データがあれば最終更新日上書き 20091126miya
			//clamp_index_tb取込失敗
			{
				var indcnt = this.O_Model.getClampIndexCount(H_outClampIndex);

				if (true == 0 < indcnt) {
					var rtn = this.O_Model.updateClampIndexFixdate(H_outClampIndex);
				} else {
					rtn = this.get_DB().pgCopyFromArray("clamp_index_tb", H_outClampIndex);
				}

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + "clamp_index_tb" + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					throw die(-1);
				} else //$this->infoOut("clamp_index_tb" . " へデーターインポート完了\n",1);
					{}
			}

		this.get_DB().commit();
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};