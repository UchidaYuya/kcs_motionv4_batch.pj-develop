//===========================================================================
//機能：クランプファイル通話詳細インポートプロセス
//概要：import_ntt_tuwa_base.php を継承
//対象データ種類：ＮＴＴ西日本
//
//作成：末広
//
//ログの出力方法を変更 by suehiro 2004.10.25
//通話時間フォーマット変更 by suehiro 2004.10.27
//typeを変更"K"→"KC" by suehiro 2004.10.27
//通話先の電話番号は()-取らずにそのまま by suehiro 2004.10.29
//PrimeとCustomを同一スクリプトで行うように 2004.11.28 by suehiro
//不要コメント部分削除 2004.12.01 by suehiro
//エラーの標準出力 2004.12.01 by 上杉顕一郎
//相対パスから絶対パスへ変更 2004.12.01 by 上杉顕一郎
//バグ修正 戻り値がデータにより帰らない 2004.12.07 by suehiro
//キャリアＩＤの指定を追加 2011/10/21 s.maeda
//
//===========================================================================
//UPDATE 2004/12/1 上杉顕一郎：相対パスから絶対パスへ変更
//定義
//プロセス解説文字列(日本語)
//プロセス解説文字列
//処理名称
//ディレクトリ名称
//NTT西日本=8
//define("G_CARRIER_ID","7");             // NTT東日本=7
//レコード種別ＩＤ 通話=3
//---------------------------------------------------------------------------
//機能：クランプファイルインポートプロセス(ＮＴＴ西日本-Custom)
//UPDATE 2004/12/1 上杉顕一郎：エラーログを標準出力する
//UPDATE 2004/12/1 上杉顕一郎：エラーログを標準出力する
//エラー出力用ハンドル
//プロセスクラスのインスタンス化
//パラメータチェック

require("lib/import_ntt_tuwa_base.php");

const G_PROCNAME_J_IMPORT = "\u901A\u8A71\u8A73\u7D30\u30A4\u30F3\u30DD\u30FC\u30C8\u30D7\u30ED\u30BB\u30B9[NTT\u897F\u65E5\u672C]";
const G_PROCNAME_IMPORT = "import_ntt_west";
const G_PROCNAME = "import_ntt_west";
const G_COMPANY_ID = "NTT_west/tuwa";
const G_CARRIER_ID = "8";
const G_RECODE_ID = "3";

//ＮＴＴ西日本prime
//一行(固定長)を分割して処理する
//ＮＴＴ西日本custom
//一行(固定長)を分割して処理する
class import_ntt_west extends import_ntt_tuwa_base {
	doDivisionLine(line, ins_comm, a_bill_prtel) //バグ修正 戻り値がデータにより帰らない 2004.12.07 by suehiro
	//Prime / Custom 別の処理
	//頭文字取得
	//バグ修正 戻り値がデータにより帰らない 2004.12.07 by suehiro
	{
		var res = false;
		var caption = this.m_file_name.substr(0, 1);

		if (caption == "R") //prime
			//バグ修正 戻り値がデータにより帰らない 2004.12.07 by suehiro
			{
				res = this.doDivisionLineForPrime(line, ins_comm, a_bill_prtel);
			} else if (caption == "M") //custom
			//バグ修正 戻り値がデータにより帰らない 2004.12.07 by suehiro
			{
				res = this.doDivisionLineForCustom(line, ins_comm, a_bill_prtel);
			} else //想定外ファイル
			//バグ修正 戻り値がデータにより帰らない 2004.12.07 by suehiro
			{
				echo("\u8B66\u544A\uFF1A \u51E6\u7406\u5BFE\u8C61\u306E\u30D5\u30A1\u30A4\u30EB\u540D\u79F0(" + this.m_file_name + ")\u304C\u4E0D\u6B63\u3067\u3059\u3002M\u304BR\u3067\u59CB\u307E\u308B\u30D5\u30A1\u30A4\u30EB\u540D\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n");
				GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + "\u8B66\u544A\uFF1A \u51E6\u7406\u5BFE\u8C61\u306E\u30D5\u30A1\u30A4\u30EB\u540D\u79F0(" + this.m_file_name + ")\u304C\u4E0D\u6B63\u3067\u3059\u3002M\u304BR\u3067\u59CB\u307E\u308B\u30D5\u30A1\u30A4\u30EB\u540D\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", 4);
				res = false;
			}

		return res;
	}

	doDivisionLineForPrime(line, ins_comm, a_bill_prtel) //レコード種別:G_RECODE_IDのみ
	{
		var recode_id = line.substr(0, 1);

		if (recode_id == G_RECODE_ID) //課金先電話番号
			//課金先電話番号の正当性確認
			//通話開始日時
			//通話先電話番号
			//件名コード(要変換)
			//通話時間
			//通話料金
			//通話種別コード
			//通話種別名称(通話種別コードを変換)
			//昼夜別コード(要変換)
			//チェック
			//for DEBUG
			{
				var bill_telno = line.substr(2 - 1, 10);
				bill_telno = this.cleaningTelno(bill_telno);
				var billtelnoIsCorrect = false;

				if (a_bill_prtel.length > 0) {
					for (var bill_prtel of Object.values(a_bill_prtel)) {
						if (bill_prtel == bill_telno) {
							billtelnoIsCorrect = true;
							break;
						}
					}
				}

				if (this.m_first_flag) {
					if (!billtelnoIsCorrect) {
						echo(`警告：課金先電話番号(${bill_telno})が不正です。登録されている課金先電話番号と合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");
						GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：課金先電話番号(${bill_telno})が不正です。登録されている課金先電話番号と合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE)", 4);
						return false;
					}
				}

				if (this.m_first_flag) {
					var sql = "select count(prtelno) from bill_prtel_tb where carid = " + G_CARRIER_ID + " and prtelno='" + bill_telno + "'";

					if (this.m_db.getOne(sql) > 1) {
						echo("\u8AB2\u91D1\u5148\u96FB\u8A71\u756A\u53F7(" + bill_telno + ")\u304C\u8907\u6570\u5B58\u5728\u3057\u307E\u3059\u3002\n");
						GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + "\u30A8\u30E9\u30FC\uFF1A \u8AB2\u91D1\u5148\u96FB\u8A71\u756A\u53F7(" + bill_telno + ")\u304C\u8907\u6570\u5B58\u5728\u3057\u307E\u3059\u3002", 4);
						return false;
					}
				}

				var telno = line.substr(16 - 1, 13);
				telno = this.cleaningTelno(telno);
				var startdatetime = "";
				var startdatetime_str = "";
				//通話日付 [MMDD]
				//通話開始時刻 [HHMMSS]
				//１行目のみチェック
				{
					var stardate = line.substr(46 - 1, 4);
					var startime = line.substr(50 - 1, 6);
					var YYYY = this.m_year;
					var MM = stardate.substr(0, 2);
					var DD = stardate.substr(2, 2);

					if (this.m_first_flag) {
						this.m_first_flag = false;

						if (MM != this.getTableNo()) //データの日付と処理対象の日付が異なる
							{
								echo(`警告：データの請求月が処理対象月と異なります。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");
								GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_ERROR, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：データの請求月が処理対象月と異なります。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE)", 3);
								this.m_warningCount++;
								return false;
							}
					}

					var H = startime.substr(0, 2);
					var M = startime.substr(2, 2);
					var S = startime.substr(4, 2);
					startdatetime_str = sprintf("%04d/%02d/%02d %02d:%02d:%02d", YYYY, MM, DD, H, M, S);
					startdatetime = date(startdatetime_str);
				}
				var to_Telno = line.substr(56 - 1, 13);
				var ken_code = line.substr(69 - 1, 2);
				var ken_name = this.m_h_comm_area[ken_code];
				var tuwa_time_str = "";
				//通話時間フォーマット変更 by suehiro 2004.10.27
				//0.5秒単位＝7桁
				{
					var tuwa_time = line.substr(71 - 1, 8);
					var HH = tuwa_time.substr(1, 2);
					MM = tuwa_time.substr(3, 2);
					var SSS = tuwa_time.substr(5, 3);
					tuwa_time_str = HH + MM + SSS;
				}
				var tuwa_money_str = "";
				{
					var tuwa_money = line.substr(79 - 1, 10);
					var up = tuwa_money.substr(0, 9);
					var low = tuwa_money.substr(9, 1);
					tuwa_money_str = up + "." + low;
				}
				var tuwa_kind_code = line.substr(111 - 1, 3);
				var tuwa_kind_name = this.m_h_tuwa_kind[tuwa_kind_code];
				var hiruyoru_code = line.substr(114 - 1, 3);
				var hiruyoru_name = this.m_h_daynight[hiruyoru_code];

				if (this.m_h_comm_area[ken_code] == "") {
					echo(`警告：県名コード(${ken_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：県名コード(${ken_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE)", 4);
					this.m_warningCount++;
				} else if (this.m_h_tuwa_kind[tuwa_kind_code] == "") {
					echo(`警告：通話種別コード(${tuwa_kind_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：通話種別コード(${tuwa_kind_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE)", 4);
					this.m_warningCount++;
				} else if (this.m_h_daynight[hiruyoru_code] == "") {
					echo(`警告：昼夜別コード(${hiruyoru_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：昼夜別コード(${hiruyoru_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE)", 4);
					this.m_warningCount++;
				} else if (startime == "999999") {
					echo(`警告：通話開始時刻(${startime})が不正です。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：通話開始時刻(${startime})が不正です。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE)", 4);
					this.m_warningCount++;
				} else {
					var param = {
						pactid: this.m_target_pactid,
						telno: telno,
						type: "KP",
						date: startdatetime,
						totelno: to_Telno,
						toplace: ken_name,
						time: tuwa_time_str,
						charge: tuwa_money_str,
						callseg: tuwa_kind_code,
						callsegname: tuwa_kind_name,
						chargeseg: hiruyoru_name,
						carid: G_CARRIER_ID
					};
					ins_comm.insert(param);
					this.m_insertCount++;
				}

				if (DEBUG == 1) {
					echo(recode_id + ":\u30EC\u30B3\u30FC\u30C9\u7A2E\u5225:3\u306E\u307F\n");
					echo(telno + ":\u767A\u4FE1\u96FB\u8A71\u756A\u53F7\u30FB\u8AB2\u91D1\u5148\u96FB\u8A71\u756A\u53F7\n");
					echo(startdatetime + ":\u901A\u8A71\u958B\u59CB\u6642\u523B\n");
					echo(to_Telno + ":\u901A\u8A71\u5148\u96FB\u8A71\u756A\u53F7\n");
					echo(ken_code + ":\u770C\u540D\u30B3\u30FC\u30C9(\u8981\u5909\u63DB)\n");
					echo(ken_name + ":\u770C\u540D\n");
					echo(tuwa_time_str + ":\u901A\u8A71\u6642\u9593\n");
					echo(tuwa_money_str + ":\u901A\u8A71\u6599\u91D1\n");
					echo(tuwa_kind_code + ":\u901A\u8A71\u7A2E\u5225\n");
					echo(tuwa_kind_name + ":\u901A\u8A71\u7A2E\u5225\n");
					echo(hiruyoru_code + ":\u663C\u591C\u5225\u30B3\u30FC\u30C9\n");
					echo(hiruyoru_name + ":\u663C\u591C\u5225\u30B3\u30FC\u30C9\n");
					echo("\n");
				}
			}

		return true;
	}

	doDivisionLineForCustom(line, ins_comm, a_bill_prtel) //レコード種別:G_RECODE_IDのみ
	{
		var recode_id = line.substr(0, 1);

		if (recode_id == G_RECODE_ID) //課金先電話番号
			//課金先電話番号の正当性確認
			//通話開始日時
			//通話先電話番号
			//件名コード(要変換)
			//通話時間
			//通話料金
			//通話種別コード
			//通話種別名称(通話種別コードを変換)
			//昼夜別コード(要変換)
			//チェック
			//for DEBUG
			{
				var bill_telno = line.substr(2 - 1, 13);
				bill_telno = this.cleaningTelno(bill_telno);
				var billtelnoIsCorrect = false;

				if (a_bill_prtel.length > 0) {
					for (var bill_prtel of Object.values(a_bill_prtel)) {
						if (bill_prtel == bill_telno) {
							billtelnoIsCorrect = true;
							break;
						}
					}
				}

				if (this.m_first_flag) {
					if (!billtelnoIsCorrect) {
						echo(`警告：課金先電話番号(${bill_telno})が不正です。登録されている課金先電話番号と合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");
						GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：課金先電話番号(${bill_telno})が不正です。登録されている課金先電話番号と合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE)", 4);
						return false;
					}
				}

				if (this.m_first_flag) {
					var sql = "select count(prtelno) from bill_prtel_tb where prtelno='" + bill_telno + "'";

					if (this.m_db.getOne(sql) > 1) {
						echo("\u8AB2\u91D1\u5148\u96FB\u8A71\u756A\u53F7(" + bill_telno + ")\u304C\u8907\u6570\u5B58\u5728\u3057\u307E\u3059\u3002\n");
						GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + "\u30A8\u30E9\u30FC\uFF1A \u8AB2\u91D1\u5148\u96FB\u8A71\u756A\u53F7(" + bill_telno + ")\u304C\u8907\u6570\u5B58\u5728\u3057\u307E\u3059\u3002", 4);
						return false;
					}
				}

				var telno = line.substr(16 - 1, 13);
				telno = this.cleaningTelno(telno);
				var startdatetime = "";
				var startdatetime_str = "";
				//通話日付 [MMDD]
				//通話開始時刻 [HHMMSS]
				//１行目のみチェック
				{
					var stardate = line.substr(46 - 1, 4);
					var startime = line.substr(50 - 1, 6);
					var YYYY = this.m_year;
					var MM = stardate.substr(0, 2);
					var DD = stardate.substr(2, 2);

					if (this.m_first_flag) {
						this.m_first_flag = false;

						if (MM != this.getTableNo()) //データの日付と処理対象の日付が異なる
							{
								echo(`警告：データの請求月が処理対象月と異なります。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");
								GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_ERROR, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：データの請求月が処理対象月と異なります。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE)", 3);
								this.m_warningCount++;
								return false;
							}
					}

					var H = startime.substr(0, 2);
					var M = startime.substr(2, 2);
					var S = startime.substr(4, 2);
					startdatetime_str = sprintf("%04d/%02d/%02d %02d:%02d:%02d", YYYY, MM, DD, H, M, S);
					startdatetime = date(startdatetime_str);
				}
				var to_Telno = line.substr(56 - 1, 13);
				var ken_code = line.substr(69 - 1, 2);
				var ken_name = this.m_h_comm_area[ken_code];
				var tuwa_time_str = "";
				//通話時間フォーマット変更 by suehiro 2004.10.27
				//0.5秒単位＝7桁
				{
					var tuwa_time = line.substr(71 - 1, 8);
					var HH = tuwa_time.substr(1, 2);
					MM = tuwa_time.substr(3, 2);
					var SSS = tuwa_time.substr(5, 3);
					tuwa_time_str = HH + MM + SSS;
				}
				var tuwa_money_str = "";
				{
					var tuwa_money = line.substr(79 - 1, 10);
					var up = tuwa_money.substr(0, 9);
					var low = tuwa_money.substr(9, 1);
					tuwa_money_str = up + "." + low;
				}
				var tuwa_kind_code = line.substr(111 - 1, 3);
				var tuwa_kind_name = this.m_h_tuwa_kind[tuwa_kind_code];
				var hiruyoru_code = line.substr(114 - 1, 3);
				var hiruyoru_name = this.m_h_daynight[hiruyoru_code];

				if (this.m_h_comm_area[ken_code] == "") {
					echo(`警告：県名コード(${ken_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：県名コード(${ken_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE)", 4);
					this.m_warningCount++;
				} else if (this.m_h_tuwa_kind[tuwa_kind_code] == "") {
					echo(`警告：通話種別コード(${tuwa_kind_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：通話種別コード(${tuwa_kind_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE)", 4);
					this.m_warningCount++;
				} else if (this.m_h_daynight[hiruyoru_code] == "") {
					echo(`警告：昼夜別コード(${hiruyoru_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：昼夜別コード(${hiruyoru_code})が不正です。登録されているコードと合致しません。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE)", 4);
					this.m_warningCount++;
				} else if (startime == "999999") {
					echo(`警告：通話開始時刻(${startime})が不正です。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE) \n");
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_targetFile + ` 警告：通話開始時刻(${startime})が不正です。file:${this.m_targetFile} (` + this.m_targetLine + "\u884C\u76EE)", 4);
					this.m_warningCount++;
				} else {
					var param = {
						pactid: this.m_target_pactid,
						telno: telno,
						type: "KC",
						date: startdatetime,
						totelno: to_Telno,
						toplace: ken_name,
						time: tuwa_time_str,
						charge: tuwa_money_str,
						callseg: tuwa_kind_code,
						callsegname: tuwa_kind_name,
						chargeseg: hiruyoru_name,
						carid: G_CARRIER_ID
					};
					ins_comm.insert(param);
					this.m_insertCount++;
				}

				if (DEBUG == 1) {
					echo(recode_id + ":\u30EC\u30B3\u30FC\u30C9\u7A2E\u5225:3\u306E\u307F\n");
					echo(telno + ":\u767A\u4FE1\u96FB\u8A71\u756A\u53F7\u30FB\u8AB2\u91D1\u5148\u96FB\u8A71\u756A\u53F7\n");
					echo(startdatetime + ":\u901A\u8A71\u958B\u59CB\u6642\u523B\n");
					echo(to_Telno + ":\u901A\u8A71\u5148\u96FB\u8A71\u756A\u53F7\n");
					echo(ken_code + ":\u770C\u540D\u30B3\u30FC\u30C9(\u8981\u5909\u63DB)\n");
					echo(ken_name + ":\u770C\u540D\n");
					echo(tuwa_time_str + ":\u901A\u8A71\u6642\u9593\n");
					echo(tuwa_money_str + ":\u901A\u8A71\u6599\u91D1\n");
					echo(tuwa_kind_code + ":\u901A\u8A71\u7A2E\u5225\n");
					echo(tuwa_kind_name + ":\u901A\u8A71\u7A2E\u5225\n");
					echo(hiruyoru_code + ":\u663C\u591C\u5225\u30B3\u30FC\u30C9\n");
					echo(hiruyoru_name + ":\u663C\u591C\u5225\u30B3\u30FC\u30C9\n");
					echo("\n");
				}
			}

		return true;
	}

};

var dbLogFile = KCS_DIR + "/data/log/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_type);
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
log_listener.PutListener(log_listener_typeView);
GLOBALS.G_COMMON_LOG = new ScriptLogAdaptor(log_listener, true);
GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_BEGIN, G_PROCNAME_J_IMPORT + " \u51E6\u7406\u958B\u59CB", 6);
var proc = new import_ntt_west(G_PROCNAME_IMPORT, G_PROCNAME_J_IMPORT, G_LOG, G_OPENTIME);

if (!proc.readArgs(undefined)) //異常終了
	{
		proc.cleanup();
		echo("\u30D1\u30E9\u30E1\u30FC\u30BF\u30C1\u30A7\u30C3\u30AF \u7570\u5E38\u7D42\u4E86\n");
		GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_END, G_PROCNAME_J_IMPORT + " \u30D1\u30E9\u30E1\u30FC\u30BF\u30C1\u30A7\u30C3\u30AF \u7570\u5E38\u7D42\u4E86", 4);
		throw die(1);
	}

if (!proc.execute()) //異常終了
	{
		proc.cleanup();
		echo("\u5B9F\u884C\u6642 \u7570\u5E38\u7D42\u4E86\n");
		GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_ERROR, G_PROCNAME_J_IMPORT + " \u5B9F\u884C\u6642 \u7570\u5E38\u7D42\u4E86", 3);
	}

var warning = "";

if (proc.m_warningCountGross > 0) {
	warning = "(\u8B66\u544A\uFF1A" + proc.m_warningCountGross + "\u4EF6)";
}

proc.cleanup();
var endtime = proc.getLapsedTime();
echo("\u51E6\u7406\u7D42\u4E86 " + proc.m_fileCount + "\u30D5\u30A1\u30A4\u30EB " + proc.m_insertCountGross + `件 ${warning} (${endtime})\n`);
GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_END, G_PROCNAME_J_IMPORT + " " + proc.m_pactid + " " + proc.m_compname + " " + yyyymm + " " + proc.m_srcpath + " \u51E6\u7406\u7D42\u4E86 " + proc.m_fileCount + "\u30D5\u30A1\u30A4\u30EB " + proc.m_insertCountGross + `件 ${warning} (${endtime})`, 6);
throw die(0);