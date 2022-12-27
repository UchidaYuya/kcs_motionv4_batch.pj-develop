//===========================================================================
//機能：クランプファイル通話詳細インポートプロセス-基底クラス
//
//作成：末広秀樹
//
//2004.08.27 by suehiro : Prime+Custom同一スクリプトで処理する為、ファイル名所をメンバ変数へ確保する対応
//2004.08.28 by suehiro : オプション -e の値を a or o に変更
//2004.12.01 by suehiro : 不要コメント部分削除
//2004.12.02 by suehiro ログ出力追加
//2004.12.02 by suehiro 失敗時は、ロックを残す（漏れ）
//2004.12.02 by suehiro バグ対応 : $this->m_target_pactid 取得方法修正
//2004.12.07 by suehiro 不要メッセージログ保存先削除
//2004.12.07 by 上杉顕一郎： 完了ディレクトリに移動を追加
//2004.12.07 by 上杉顕一郎： 実行確認を削除
//
//===========================================================================
//実行可能時間
//デバッグスイッチ
//1:on 1以外:off
//作業環境のルート
//## バッチのcommon.phpに入れよう
//---------------------------------------------------------------------------
//機能：クランプファイル通話詳細インポートプロセス-基底クラス

require("lib/process_base.php");

require("Log.php");

const G_OPENTIME = "0000,2400";
const DEBUG = 0;
const KCS_DIR = "/kcs";

//インポート前にテーブルをクリアするか
//ファイルを読み出すパス(nullならclampfile_tbから)
//DBから読む場合に、読み出す種別
//ローカル(スクリプト毎)なログ出力
//インポートファイルの出力先
//pactid=all を指定した場合、ディレクトリ名称から複数のpactidを積む
//処理中のm_a_pactidsの要素No.
//処理対象のpactid
//for ロギング
//開始時刻(経過時間算定のため)
//処理中のファイル
//処理中の行
//処理した行数(ファイル毎)
//処理した行数
//警告した行数(ファイル毎)
//警告した行数
//処理したファイル数
//処理名称（日本語）
//処理名称（半角英数）
//通話明細で使用するエリアコードデータ
//通話明細で使用する国コードデータ
//通話明細で使用する通話種別
//通話明細で使用する昼夜深
//通話明細で使用する昼夜深
//ファイル毎初期処理フラグ
//処理対象ファイル名称
//-----------------------------------------------------------------------
//機能：コンストラクタ
//引数：
//プロセス名(ログ保存フォルダに使用する)
//プロセス名２バイト文字(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//-----------------------------------------------------------------------
//機能：ARGVを処理する
//引数：ARGV(nullならグローバルのARGVを使用する)
//最初の一個を無視するならtrue
//返値：深刻なエラーが発生したらfalseを返す
//データディレクトリのPathなど初期化
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、実行するか問い合わせる
//返値：実行すべきならtrueを返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//機能：処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//不要ディレクトリ削除
//ここをオーバーライトして使用する
//一行(固定長)を分割して処理する
//update 2004/12/7 上杉顕一郎
//完了ディレクトリへ移動
//update end
//共通
//一ファイルを処理する
//共通
//共通電話番号の余分文字削除
//共通
//指定ディレクトリ以下のファイル・ディレクトリを返す
//$type
//file : ファイルのみ
//dir  : ディレクトリのみ
//both : ディレクトリ・ファイル両方
//共通
//経過時間を文字列で返す [HH:MM:SS]
class import_ntt_tuwa_base extends ProcessDefault {
	import_ntt_tuwa_base(procname, procname_j, logpath, opentime) //初期化
	//県名コード→県名
	//通話種別コード→通話種別名称
	//昼夜深別コード→昼夜深別名称
	//昼夜深別コード→昼夜深別名称(国際用)
	{
		this.ProcessDefault(procname, logpath, opentime, true);
		this.m_args.addSetting({
			e: {
				type: "string"
			},
			p: {
				type: "string"
			},
			y: {
				type: "string"
			},
			b: {
				type: "string"
			}
		});
		this.m_clearflag = "";
		this.m_insertCountGross = 0;
		this.m_warningCountGross = 0;
		this.m_fileCount = 0;
		this.m_beginTime = Date.now() / 1000;
		this.m_active_pact_idx = 0;
		this.m_procname = procname;
		this.m_procname_j = procname_j;
		var sql = "select code, name, type from comm_area_tb where carid=" + G_CARRIER_ID;

		if (DEBUG == 1) {
			echo(sql + "\n");
		}

		var O_result = this.m_db.query(sql);

		if (count(O_result) != 0) {
			var row;
			var count = 0;

			while (row = O_result.fetchRow()) {
				if ("Pr" == row[2]) {
					this.m_h_comm_area[row[0]] = row[1];
				} else if ("Co" == row[2]) {
					this.m_h_wld_area[row[0]] = row[1];
				}
			}
		}

		O_result.free();
		sql = "select code,name from tuwa_tb where carid=" + G_CARRIER_ID;

		if (DEBUG == 1) {
			echo(sql + "\n");
		}

		O_result = this.m_db.query(sql);

		if (count(O_result) != 0) {
			count = 0;

			while (row = O_result.fetchRow()) {
				this.m_h_tuwa_kind[row[0]] = row[1];
			}
		}

		O_result.free();
		sql = "select code,name from daynight_tb where servicetype='NONE' and carid=" + G_CARRIER_ID;

		if (DEBUG == 1) {
			echo(sql + "\n");
		}

		O_result = this.m_db.query(sql);

		if (count(O_result) != 0) {
			count = 0;

			while (row = O_result.fetchRow()) {
				this.m_h_daynight[row[0]] = row[1];
			}
		}

		O_result.free();
		sql = "select code,name from daynight_tb where servicetype='30' and carid=" + G_CARRIER_ID;

		if (DEBUG == 1) {
			echo(sql + "\n");
		}

		O_result = this.m_db.query(sql);

		if (count(O_result) != 0) {
			count = 0;

			while (row = O_result.fetchRow()) {
				this.m_h_daynight_wld[row[0]] = row[1];
			}
		}

		O_result.free();
	}

	readArgs(A_argv, skip_first = true) //リセット
	//データディレクトリのPathなど初期化
	{
		this.m_year = "";
		this.m_month = "";

		if (!this.m_args.readAll(A_argv, skip_first)) {
			this.m_args.writeLog(this.m_listener);
			return false;
		}

		if (!this.checkArgs() || !this.commitArgs()) {
			return false;
		}

		var has_error = false;
		//01
		{
			if (this.m_clearflag == "") {
				echo("-e \u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044[\u5FC5\u9808]\n");
				has_error = true;
			}

			if (this.m_pactid == "") {
				echo("-p \u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044[\u5FC5\u9808]\n");
				has_error = true;
			}

			if (this.m_year == "" || this.m_month == "") {
				echo("-y \u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044[\u5FC5\u9808]\n");
				has_error = true;
			}

			if (this.m_backupflag == "") {
				echo("-b \u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044[\u5FC5\u9808]\n");
				has_error = true;
			}

			if (has_error) //エラー発生時終了
				{
					return false;
				}
		}
		var res = this.each_init();
		return res;
	}

	each_init() //インポートファイルの出力先のPath
	//ログオブジェクト生成
	//ディレクトリ確認
	//エラー出力用ハンドル
	//ソースフォルダのパスを生成
	//ログフォルダのパスを生成
	//ログ出力
	{
		var yyyymm = sprintf("%04d%02d", this.m_year, this.m_month);
		this.m_exppath = KCS_DIR + "/data/" + yyyymm + "/" + G_COMPANY_ID;
		var dbLogFileDir = KCS_DIR + "/data/" + yyyymm + "/" + G_COMPANY_ID;

		if (!file_exists(dbLogFileDir)) {
			echo("\u4F5C\u696D\u7528\u306E\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + dbLogFileDir + ")\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002\n");
			GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " \u4F5C\u696D\u7528\u306E\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + dbLogFileDir + ")\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002", 4);
			return false;
		}

		var dbLogFile = dbLogFileDir + "/" + date("Ymd") + ".log";
		var log_listener = new ScriptLogBase(0);
		var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
		log_listener.PutListener(log_listener_type);
		this.o_log = new ScriptLogAdaptor(log_listener, true);
		echo("\u30ED\u30FC\u30AB\u30EB\u30ED\u30B0\uFF1A" + KCS_DIR + "/data/" + yyyymm + "/" + G_COMPANY_ID + "/" + date("Ymd") + ".log\n");
		yyyymm = sprintf("%04d%02d", this.m_year, this.m_month);

		if (this.m_pactid != "all") //指定
			{
				this.m_target_pactid = this.m_pactid;
				this.m_srcpath = KCS_DIR + "/data/" + yyyymm + "/" + G_COMPANY_ID + "/" + this.m_pactid;
			} else //all
			{
				this.m_srcpath = KCS_DIR + "/data/" + yyyymm + "/" + G_COMPANY_ID;
			}

		this.m_logpath = KCS_DIR + "/data/" + yyyymm;
		this.m_args.writeLog(this.m_listener);
		return true;
	}

	commitArg(args) {
		switch (args.key) {
			case "e":
				this.m_clearflag = args.value.toLowerCase();
				break;

			case "p":
				this.m_pactid = args.value.toLowerCase();
				break;

			case "y":
				var src = args.value;
				this.m_year = 0 + src.substr(0, 4);
				this.m_month = 0 + src.substr(4, 2);

				if (this.m_year > date(Y)) {
					echo("\u51E6\u7406\u5BFE\u8C61\u6708\u306B\u672A\u6765\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002\n");
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + ` 処理対象月に未来の年月を指定 (${src}) `, 4);
					return false;
				}

				if (this.m_year == date(Y)) {
					if (this.m_month > date(m)) {
						echo("\u51E6\u7406\u5BFE\u8C61\u6708\u306B\u672A\u6765\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002\n");
						GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + ` 処理対象月に未来の年月を指定 (${src}) `, 4);
						return false;
					}
				}

				if (this.getTableNo() > 12) {
					echo("\u51E6\u7406\u5BFE\u8C61\u6708\u306B\u4E00\u5E74\u4EE5\u4E0A\u524D\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002\n");
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + ` 処理対象月に一年以上前の年月を指定 (${src}) `, 4);
					return false;
				}

				break;

			case "b":
				this.m_backupflag = args.value.toLowerCase();
				break;

			case "h":
				var A_usage = this.getUsage();
				var maxlength = 0;

				for (var usage of Object.values(A_usage)) {
					var len = usage[0].length;
					if (maxlength < len) maxlength = len;
				}

				++maxlength;
				var body = "";

				for (var usage of Object.values(A_usage)) {
					var line = "\t" + usage[0];

					while (line.length < maxlength) line += " ";

					line += usage[1];
					body += line + "\n";
				}

				console.log(body);
				throw die(0);
		}

		return true;
	}

	getUsage() {
		var rval = Array();
		rval.push(["-e={a|o}", "\u30A4\u30F3\u30DD\u30FC\u30C8\u524D\u306BDB\u304B\u3089\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664 a:\u3057\u306A\u3044[append]\u3001o:\u3059\u308B[overwrite]"]);
		rval.push(["-p={(pactid)|ALL}", " pactid:\u51E6\u7406\u5BFE\u8C61\u9867\u5BA2\u306E\u6307\u5B9A\u3001 ALL:\u5168\u9867\u5BA2"]);
		rval.push(["-y={YYYYMM}", "\u51E6\u7406\u5BFE\u8C61\u5E74\u6708(\u8ACB\u6C42\u5E74\u6708)"]);
		rval.push(["-b={Y|n}", "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3092\u884C\u3046\u304B"]);
		return rval;
	}

	askManual() //pact 存在確認
	//対象年月のフォーマットチェック
	{
		if (!this.m_manualflag) return true;
		echo(this.getManual());
		var hasError_flag = false;

		if (this.m_pactid != "all") {
			if (is_numeric(this.m_pactid)) {
				var sql = "select count(pactid) from pact_tb where pactid='" + this.m_pactid + "'";
				this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + " SQL\uFF1A" + sql + " ", 6);

				if (this.m_db.getOne(sql) == 0) {
					echo("\u6307\u5B9A\u306E\u5BFE\u8C61\u9867\u5BA2(" + this.m_pactid + ")\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002\n");
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " \u6307\u5B9A\u306E\u5BFE\u8C61\u9867\u5BA2(" + this.m_pactid + ")\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002", 4);
					hasError_flag = true;
				} else {
					sql = "select compname from pact_tb where pactid='" + this.m_pactid + "'";
					this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + " SQL\uFF1A" + sql + " ", 6);
					this.m_compname = this.m_db.getOne(sql);
				}
			} else {
				echo("\u5BFE\u8C61\u9867\u5BA2\u6307\u5B9A\u306E\u5024(" + this.m_pactid + ")\u304C\u4E0D\u6B63\u3067\u3059\u3002\n");
				GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " \u5BFE\u8C61\u9867\u5BA2\u6307\u5B9A\u306E\u5024(" + this.m_pactid + ")\u304C\u4E0D\u6B63\u3067\u3059\u3002", 4);
				hasError_flag = true;
			}
		} else {
			this.m_compname = " ";
		}

		var yyyymm = this.m_year + this.m_month;

		if (!is_numeric(yyyymm)) {
			echo("\u5BFE\u8C61\u5E74\u6708(\u8ACB\u6C42\u5E74\u6708)\u6307\u5B9A\u306E\u5024(" + this.m_pactid + ")\u304C\u4E0D\u6B63\u3067\u3059\u3002\n");
			GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " \u5BFE\u8C61\u5E74\u6708(\u8ACB\u6C42\u5E74\u6708)\u6307\u5B9A\u306E\u5024(" + this.m_pactid + ")\u304C\u4E0D\u6B63\u3067\u3059\u3002", 4);
			hasError_flag = true;
		}

		if (!(this.m_clearflag == "a" || this.m_clearflag == "o")) {
			echo("\u30EC\u30B3\u30FC\u30C9\u524A\u9664\u30D5\u30E9\u30B0\u306E\u5024(" + this.m_clearflag + ")\u306F\u4E0D\u6B63\u3067\u3059\u3002\n");
			GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " \u30EC\u30B3\u30FC\u30C9\u524A\u9664\u30D5\u30E9\u30B0\u306E\u5024(" + this.m_clearflag + ")\u306F\u4E0D\u6B63\u3067\u3059\u3002", 4);
			hasError_flag = true;
		}

		if (!(this.m_backupflag == "y" || this.m_backupflag == "n")) {
			echo("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30D5\u30E9\u30B0\u306E\u5024(" + this.m_backupflag + ")\u306F\u4E0D\u6B63\u3067\u3059\u3002\n");
			GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " \u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30D5\u30E9\u30B0\u306E\u5024(" + this.m_backupflag + ")\u306F\u4E0D\u6B63\u3067\u3059\u3002", 4);
			hasError_flag = true;
		}

		if (!file_exists(this.m_srcpath)) {
			echo("\u5BFE\u8C61\u306E\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002\n");
			GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " \u5BFE\u8C61\u306E\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + this.m_srcpath + ")\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002", 4);
			hasError_flag = true;
		}

		var backup_path = KCS_DIR + "/data/exp/";

		if (!file_exists(backup_path)) {
			mkdir(backup_path);
		}

		var log_path = KCS_DIR + "/data/log/";

		if (!file_exists(log_path)) {
			mkdir(log_path);
		}

		if (hasError_flag) {
			return false;
		}

		yyyymm = sprintf("%04d%02d", this.m_year, this.m_month);
		GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_INFO, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + " " + "\u30D1\u30E9\u30E1\u30FC\u30BF\u60C5\u5831", 6);
		return true;
	}

	getManual() //01
	//04
	//05
	//06
	//07
	//08
	//09
	{
		var rval = "";
		if (this.m_debugflag) rval += "\u30C7\u30D0\u30C3\u30B0\u30E2\u30FC\u30C9\n";
		rval += "\u30ED\u30C3\u30AF\u5236\u5FA1" + (this.m_lockflag ? "\u3042\u308A" : "\u306A\u3057") + "\n";
		rval += "\u52D5\u4F5C\u8A31\u53EF\u6642\u523B";

		if (this.m_checktime) {
			for (var pair of Object.values(this.m_opentime.m_A_time)) rval += "/" + pair[0] + "-" + pair[1];
		} else rval += "\u305B\u305A";

		rval += "\n";

		if (this.m_clearflag == "a") {
			rval += "\u30A4\u30F3\u30DD\u30FC\u30C8\u524D\u306BDB\u304B\u3089\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3057\u306A\u3044(append)\n";
		} else {
			rval += "\u30A4\u30F3\u30DD\u30FC\u30C8\u524D\u306BDB\u304B\u3089\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3059\u308B(overwrite)\n";
		}

		if (this.m_backupflag == "y") {
			rval += "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B\n";
		} else {
			rval += "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044\n";
		}

		rval += "\u5BFE\u8C61\u9867\u5BA2" + this.m_pactid + "\n";
		rval += "\u5BFE\u8C61\u5E74\u6708(\u8ACB\u6C42\u5E74\u6708)" + this.m_year + "\u5E74" + this.m_month + "\u6708\n";
		rval += "\u30BD\u30FC\u30B9\u30D5\u30A9\u30EB\u30C0" + this.m_srcpath + "\n";
		return rval;
	}

	execute() //2004.12.02 by suehiro 失敗時は、ロックを残す
	{
		if (!this.askManual()) return true;

		if (!this.isOpen()) {
			echo("\u52D5\u4F5C\u53EF\u80FD\u6642\u9593\u5916\n");
			GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + " \u52D5\u4F5C\u53EF\u80FD\u6642\u9593\u5916 ", 4);
			throw die(1);
		}

		if (!this.init()) return false;
		var startime = this.getLapsedTime();
		var manual = this.getManual();
		manual = manual.split("\n");

		for (var line of Object.values(manual)) {
			if (line.length) {}
		}

		if (!this.lock(true)) {
			echo("\u30ED\u30C3\u30AF\u5931\u6557\n");
			GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_ERROE, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + " \u30ED\u30C3\u30AF\u5931\u6557 ", 3);
			return false;
		}

		if (!this.begin()) {
			if (!this.lock(false)) return false;
			echo("begin()\u5931\u6557\n");
			GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_ERROE, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + " begin()\u5931\u6557 ", 3);
			return false;
		}

		var status = this.do_execute();
		status &= this.end(status);

		if (status) //成功時（ロックを外す)
			{
				status &= this.lock(false);
			}

		var endtime = this.getLapsedTime();
		return status;
	}

	do_execute() //コピー分作成
	//インポートインスタンスを初期化
	//インポートインスタンスにデータを構築
	//ファイル一覧取得 : オプション -p
	{
		this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + " \u51E6\u7406\u958B\u59CB ", 6);
		var no = this.getTableNo();

		if (no > 12) //対象外 範囲：01-12
			{
				echo(" \u30A8\u30E9\u30FC\uFF1A\u30A4\u30F3\u30B5\u30FC\u30C8\u7528\u30C6\u30FC\u30D6\u30EB\u306E\u5BFE\u8C61\u304C\u7BC4\u56F2\u5916\u3067\u3059 : commhistory_" + no + "_tb \n");
				GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_INFO, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + " \u30A8\u30E9\u30FC\uFF1A\u30A4\u30F3\u30B5\u30FC\u30C8\u7528\u30C6\u30FC\u30D6\u30EB\u306E\u5BFE\u8C61\u304C\u7BC4\u56F2\u5916\u3067\u3059 : commhistory_" + no + "_tb ", 3);
				return false;
			}

		var ins_filepath = this.m_exppath + "/commhistory_" + no + "_tb_" + date(YmdHis) + ".ins";
		var ins_comm = new TableInserter_tuwa(this.m_listener, this.m_db, ins_filepath, false);
		ins_comm.begin("commhistory_" + no + "_tb");

		if (this.m_pactid == "all") //case : pactid=all : 複数ディレクトリ＆複数ファイル
			//対象データチェック
			{
				var a_res = this.getdirtree(this.m_srcpath, "dir");

				if (a_res) {
					if (DEBUG == 1) {
						echo("HIT! " + this.m_srcpath + "\n");
					}

					for (var data of Object.values(a_res)) //2004.12.02 by suehiro バグ対応 : $this->m_target_pactid 取得方法修正
					//pactidの正当性チェック
					{
						var a_temp = split("/", data);
						this.m_target_pactid = a_temp[a_temp.length - 1];
						var sql = "select count(pactid) from pact_tb where pactid='" + this.m_target_pactid + "'";
						this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + " SQL\uFF1A" + sql + " ", 6);

						if (this.m_db.getOne(sql) == 0) {
							echo("\u8B66\u544A\uFF1A\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u793A\u3059\u5BFE\u8C61\u9867\u5BA2(" + this.m_target_pactid + ")\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002\n");
							GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + "\u8B66\u544A\uFF1A\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u793A\u3059\u5BFE\u8C61\u9867\u5BA2(" + this.m_target_pactid + ")\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002", 4);
							this.m_warningCount++;
							continue;
						} else //会社名取得
							{
								sql = "select compname from pact_tb where pactid='" + this.m_target_pactid + "'";
								this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + " SQL\uFF1A" + sql + " ", 6);
								this.m_compname = this.m_db.getOne(sql);
							}

						var a_res2 = this.getdirtree(data, "file");

						if (a_res2) {
							for (var data2 of Object.values(a_res2)) //インサート用ファイル（コピー分）作成
							{
								if (DEBUG == 1) {
									echo(`    ${data2}\n`);
								}

								this.doDivisionFile(data2, ins_comm);
							}
						}
					}
				} else //指定ディレクトリ以下が空
					{
						if (DEBUG == 1) {
							echo("NO HIT! " + this.m_srcpath + "\n");
						}

						echo("\u6307\u5B9A\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + this.m_srcpath + ")\u4EE5\u4E0B\u304C\u7A7A\n");
						this.o_log.putError(G_SCRIPT_WARNING, this.m_procname_j + " \u6307\u5B9A\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + this.m_srcpath + ")\u4EE5\u4E0B\u304C\u7A7A ", 6);
						return false;
					}
			} else //case : pactid=指定ID : 複数ファイル
			//対象データチェック
			{
				a_res = this.getdirtree(this.m_srcpath, "file");

				if (a_res) {
					if (DEBUG == 1) {
						echo("HIT! " + this.m_srcpath + "\n");
					}

					for (var data of Object.values(a_res)) //インサート用ファイル（コピー分）作成
					{
						if (DEBUG == 1) {
							echo(`${data}\n`);
						}

						this.doDivisionFile(data, ins_comm);
					}
				} else //指定ディレクトリ以下が空
					{
						if (DEBUG == 1) {
							echo("NO HIT! " + this.m_srcpath + "\n");
						}

						echo("\u6307\u5B9A\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + this.m_srcpath + ")\u4EE5\u4E0B\u304C\u7A7A\n");
						this.o_log.putError(G_SCRIPT_WARNING, this.m_procname_j + " \u6307\u5B9A\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + this.m_srcpath + ")\u4EE5\u4E0B\u304C\u7A7A ", 6);
						return false;
					}
			}

		if (this.m_insertCountGross > 0) //対象テーブルのバックアップ(backupフラグ有効時) : オプション -b
			{
				if (this.m_backupflag == "y") //バックアップ
					//仕様を元に戻す場合に備えて残してある by suehiro
					//$sqlfrom = " from commhistory_" . $no . "_tb";
					//				$sqlfrom .= " where ";
					//				if( $this->m_pactid != "all" ) {
					//					$sqlfrom .= " pactid=" . $this->m_pactid;
					//				} else {
					//					foreach ($this->m_a_pactids as $pactid) {
					//						$pactids[] = " pactid=" . $pactid;
					//					}
					//					$sqlfrom .= join(" and ",$pactids);
					//				}
					//				$sqlfrom .= " and carid=" . G_CARRIER_ID;
					//				$this->o_log->putError(G_SCRIPT_INFO,  $this->m_procname_j." SQL：バックアップ : select *" . $sqlfrom." ", 6 );
					//				$exp_file_path = KCS_DIR."/data/exp/commhistory_".$no."_tb_".date(YmdHis).".exp";
					//				if ( ! $this->m_db->backup($exp_file_path, "select *" . $sqlfrom . ";")) {
					{
						var startime = this.getLapsedTime();
						echo(`処理：バックアップ 開始 (${startime})\n`);
						this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：バックアップ 開始 (${startime}) `, 6);
						var exp_file_path = KCS_DIR + "/data/exp/commhistory_" + no + "_tb_" + date(YmdHis) + ".exp";

						if (!this.m_db.backupAll(exp_file_path, "commhistory_" + no + "_tb")) {
							var endtime = this.getLapsedTime();
							echo(`バックアップ失敗 (${endtime})\n`);
							this.o_log.putError(G_SCRIPT_ERROR, this.m_procname_j + ` エラー：バックアップ失敗 (${endtime}) `, 3);
							GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_ERROR, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + ` エラー：バックアップ失敗 (${endtime}) `, 3);
						}

						endtime = this.getLapsedTime();
						echo(`処理：バックアップ 終了 (${endtime})\n`);
						this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：バックアップ 終了 : ${exp_file_path} : (${endtime}) `, 6);
						GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_INFO, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + ` 出力：バックアップファイル : ${exp_file_path} (${endtime}) `, 6);
					}

				if (this.m_clearflag == "o") //テーブルクリア
					//既存のレコードを削除
					{
						startime = this.getLapsedTime();
						echo(`処理：テーブルクリア 開始 (${startime})\n`);
						this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：テーブルクリア 開始 (${startime}) `, 6);
						var sqlfrom = " from commhistory_" + no + "_tb";
						sqlfrom += " where ";

						if (this.m_pactid != "all") {
							sqlfrom += " pactid=" + this.m_pactid;
						} else {
							delete pactids;

							for (var pactid of Object.values(this.m_a_pactids)) {
								pactids.push(" pactid=" + pactid);
							}

							sqlfrom += join(" and ", pactids);
						}

						sqlfrom += " and carid=" + G_CARRIER_ID;
						sql = "delete" + sqlfrom;

						if (DEBUG == 1) {
							echo("SQL:" + sql + "\n");
						}

						this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` SQL：テーブルクリア : ${sql} `, 6);
						this.m_db.query(sql);
						endtime = this.getLapsedTime();
						echo(`処理：テーブルクリア 終了 (${endtime})\n`);
						this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：テーブルクリア 終了 (${endtime}) `, 6);
					}

				startime = this.getLapsedTime();
				echo(`処理：インサート実行 開始 (${startime})\n`);
				this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：インサート実行 開始 (${startime}) `, 6);
				ins_comm.end();
				endtime = this.getLapsedTime();
				echo(`処理：インサート実行 終了 (${endtime})\n`);
				this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：インサート実行 終了 (${endtime}) `, 6);
				this.o_log.putError(G_SCRIPT_WARNING, this.m_procname_j + ` 処理終了 (${endtime})`, 6);
				GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_INFO, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + ` 出力：インサート用コピー文ファイル : ${ins_filepath} (${endtime}) `, 6);
				return true;
			}
	}

	cleanup() //不要ディレクトリ削除
	{
		var a_logdirs = this.getdirtree(KCS_DIR + "/data", "dir");

		if (a_logdirs) {
			for (var dir_path of Object.values(a_logdirs)) {
				if (strpos(dir_path, this.m_procname)) {
					var a_logfiles = this.getdirtree(dir_path);

					for (var file_path of Object.values(a_logfiles)) {
						unlink(file_path);
					}

					rmdir(dir_path);
				}
			}
		}
	}

	doDivisionLine(line, ins_comm, a_bill_prtel) {
		return false;
	}

	finMove(targetName) //ファイルの移動
	{
		var finDir = dirname(targetName) + "/fin";

		if (is_dir(finDir) == false) //完了ディレクトリの作成
			{
				if (mkdir(finDir, 700) == false) {
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_INFO, this.m_procname_j + " " + this.m_pactid + " " + this.m_compname + " " + yyyymm + " " + this.m_srcpath + ` 出力：インサート用コピー文ファイル : ${ins_filepath} (${endtime}) `, 6);
					GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F:" + finDir + "\n", 4);
					return false;
				}
			}

		clearstatcache();
		echo(`処理：ファイル移動:${targetName}\n`);

		if (rename(targetName, finDir + "/" + basename(targetName)) == false) {
			GLOBALS.G_COMMON_LOG.putError(G_SCRIPT_WARNING, this.m_procname_j + " " + this.m_target_pactid + " " + this.m_compname + " " + yyyymm + " \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F:" + targetName + "\n", 4);
			return false;
		}

		return true;
	}

	doDivisionFile(path, ins_comm) //対象 pactid の 親電話番号・請求番号を取得
	//UPDATE 2004/12/07 上杉顕一郎
	//UPDATE 2004/12/07 上杉顕一郎
	//処理成功の場合、完了ディレクトリに移動
	{
		var A_path = split("/", path);
		this.m_file_name = A_path[count(A_path) - 1];
		this.m_targetFile = path;
		this.m_targetLine = 0;
		this.m_insertCount = 0;
		this.m_warningCount = 0;
		this.m_fileCount++;
		this.m_first_flag = true;
		var sql = "select prtelno from bill_prtel_tb where pactid=" + this.m_target_pactid + " and carid=" + G_CARRIER_ID;

		if (DEBUG == 1) {
			echo(sql + "\n");
		}

		this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + " SQL\uFF1A\u5BFE\u8C61 pactid \u306E \u89AA\u96FB\u8A71\u756A\u53F7\u30FB\u8ACB\u6C42\u756A\u53F7\u3092\u53D6\u5F97 : " + sql + " ", 6);
		var O_result = this.m_db.query(sql);

		if (count(O_result) != 0) {
			var row;
			var count = 0;

			while (row = O_result.fetchRow()) {
				a_bill_prtel.push(this.cleaningTelno(row[0]));
			}
		} else //親番号が設定されていない pactid
			{}

		O_result.free();
		echo(`処理：ファイルオープン:${path}\n`);
		var starttime = this.getLapsedTime();
		this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：ファイルオープン:${path} (${starttime}) `, 6);
		var fp = fopen(path, "r");
		var errFlg = false;

		while (!feof(fp)) {
			this.m_targetLine++;
			var buf = fgets(fp, 1024);
			buf = chop(buf);

			if (!this.doDivisionLine(buf, ins_comm, a_bill_prtel)) //ファイル処理中にエラー
				//UPDATE 2004/12/07 上杉顕一郎
				{
					errFlg = true;
					break;
				}
		}

		fclose(fp);
		var endtime = this.getLapsedTime();
		echo(`処理：ファイルクローズ:${path}\n`);
		this.o_log.putError(G_SCRIPT_INFO, this.m_procname_j + ` 処理：ファイルクローズ:${path} ` + this.m_insertCount + "/" + this.m_targetLine + `行 (${endtime}) `, 6);
		this.m_insertCountGross += this.m_insertCount;
		this.m_warningCountGross += this.m_warningCount;

		if (errFlg == false) {
			this.finMove(path);
		}
	}

	cleaningTelno(srctelno) {
		var desttelno = srctelno;
		desttelno = str_replace("(", "", desttelno);
		desttelno = str_replace(")", "", desttelno);
		desttelno = str_replace("-", "", desttelno);
		desttelno = str_replace(" ", "", desttelno);
		return desttelno;
	}

	getdirtree(dir, type = "file") //ディレクトリでなければ false を返す
	//戻り値用の配列
	{
		if (!is_dir(dir)) {
			return false;
		}

		var tree = Array();

		if (handle = opendir(dir)) //uasort() でないと添え字が失われます
			{
				var file;

				while (false !== (file = readdir(handle))) //自分自身と上位階層のディレクトリを除外
				{
					if (file != "." && file != "..") {
						if (type == "file") {
							if (!is_dir(dir + "/" + file)) {
								tree[file] = dir + "/" + file;
							}
						} else if (type == "dir") {
							if (is_dir(dir + "/" + file)) {
								tree[file] = dir + "/" + file;
								this.m_a_pactids.push(file);
							}
						} else {
							tree[file] = dir + "/" + file;
						}
					}
				}

				closedir(handle);
				uasort(tree, "strcmp");
			}

		return tree;
	}

	getLapsedTime() {
		return gmstrftime("%T", Date.now() / 1000 - this.m_beginTime);
	}

};

//機能：ログ出力を行う
//引数：メッセージ種別
//メッセージ
class TableInserter_tuwa extends TableInserter {
	log(type, message) //機能を止めるための空実装
	{}

};