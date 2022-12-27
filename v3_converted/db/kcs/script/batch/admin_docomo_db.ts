//===========================================================================
//機能：DB側プロセス管理プロセス(ドコモ専用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//一時停止時の待機秒数
//この権限があればV3型シミュレーションを行う
//---------------------------------------------------------------------------
//機能：DB側プロセス管理プロセス(ドコモ専用)
error_reporting(E_ALL);

require("lib/process_base.php");

const G_PROCNAME_ADMIN_DOCOMO_DB = "admin_docomo_db";
const G_OPENTIME_ADMIN_DOCOMO_DB = "0000,2400";
const SLEEP_SEC = 60;
const AUTH_V3_SIM = 120;

//親番号や管理コード送付先のチェックを中止するか
//インポート前にテーブルをクリアするか
//batchlog_tbにレコードができるのを待つか
//動作モードの配列(各要素はi,c,t,T,s,Sの一文字)
//i	インポート
//c	計算など
//t	統計情報抽出(V2型顧客)
//T	統計情報抽出(ホットライン型顧客)
//s	シミュレーション(V2型顧客)
//S	シミュレーション(ホットライン型顧客)
//実行前にclampfileのエラーステータスを消すならtrue
//メール送信を止めるならtrue
//一度だけ起動するならtrue
//CSVファイル名
//ホットラインの顧客ID
//ログを圧縮するならtrue
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：ARGVの読み込み終了後に実行される
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//機能：DBのセッションを開始する
//返値：深刻なエラーが発生したらfalseを返す
//機能：DBのセッションを終了する
//引数：commitするならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客ID・年月のディレクトリを作成する
//引数：顧客ID
//年
//月
//ログインスタンスを返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客・年月単位のログから、プロセス全体のログに戻す
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：インポートを実行する
//引数：ホットラインならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客に対して日次インポートを実行する
//引数：顧客ID
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客に対して日次インポートを実行する(ロック内部)
//引数：顧客ID
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客に対してインポートを実行する
//引数：顧客ID
//返値：深刻なエラーが発生したらfalseを返す
//機能：インポートプロセスを呼び出す
//引数：顧客ID
//{fname}[detailno][year][month][type][idx]を受け取り、ファイル名を返す
//{"$year,$month,$detailno" => 子プロセス実行結果}を返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：必要ならchangeoverを実行する
//引数：顧客ID
//年
//月
//ログインスタンス
//返値：深刻なエラーが発生したらfalseを返す
//機能：インポート実行結果を書き込む
//引数：顧客ID
//{fname}[detailno][year][month][type][idx]
//{"$year,$month" => 子プロセス実行結果}
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：clampdb_index_tbのフラグを更新する
//引数：レコードを更新する顧客ID(空文字列なら条件無し)
//レコードを更新するクランプ連番(空文字列なら条件無し)
//レコードを更新する年(空文字列なら条件無し)
//レコードを更新する月(空文字列なら条件無し)
//レコードを更新する条件
//書き込む条件
//返値：深刻なエラーが発生したらfalseを返す
//機能：clampdb_index_tbから、条件に合致する顧客を取り出す
//引数：array(pactid => array(array(year, month) ...))を返す
//検索するフラグのハッシュ
//V2型顧客を取得するか(今月,過去)
//ホットライン型顧客を取得するか(今月,過去)
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：計算等を実行する
//引数：ホットラインならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：統計情報抽出を実行する
//引数：ホットラインならtrue
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：シミュレーションを実行する
//引数：ホットラインならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：ログファイルを圧縮する
//機能：ログファイルの圧縮の下請
//引数：見つかったファイルを追加して返す
//検索するパス
//現在のレベル
//機能：圧縮すべきファイルならtrueを返す
//引数：ファイル名
class ProcessAdminDocomoDB extends ProcessDefault {
	ProcessAdminDocomoDB(procname, logpath, opentime) {
		this.ProcessDefault(procname, logpath, opentime);

		if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) {
			this.m_db_temp = new ScriptDB(this.m_listener, GLOBALS.G_dsn_temp);
		} else this.m_db_temp = this.m_db;

		this.m_args.addSetting({
			f: {
				type: "int"
			},
			e: {
				type: "int"
			},
			i: {
				type: "string"
			},
			R: {
				type: "int"
			},
			C: {
				type: "string"
			},
			E: {
				type: "int"
			},
			x: {
				type: "int"
			},
			X: {
				type: "int"
			},
			G: {
				type: "int"
			}
		});
		this.m_forceflag = false;
		this.m_clearflag = false;
		this.m_mode = ["i", "I", "c", "C", "t", "T"];
		this.m_restore_error = true;
		this.m_stop_mail = true;
		this.m_waitflag = false;
		this.m_A_pactid_hotline = Array();
		var sql = "select pactid from pact_tb where type='H' order by pactid;";
		var result = this.m_db.getAll(sql);

		for (var A_line of Object.values(result)) this.m_A_pactid_hotline.push(A_line[0]);

		this.m_oneshot = true;
		this.m_is_compress_log = true;
	}

	getProcname() {
		return "DB\u5074\u30D7\u30ED\u30BB\u30B9\u7BA1\u7406\u30D7\u30ED\u30BB\u30B9(\u30C9\u30B3\u30E2\u5C02\u7528)";
	}

	commitArg(args) {
		if (!ProcessDefault.commitArg(args)) return false;

		switch (args.key) {
			case "f":
				this.m_forceflag = args.value;
				break;

			case "e":
				this.m_clearflag = args.value;
				break;

			case "i":
				var remain = args.value;
				this.m_mode = Array();

				while (remain.length) {
					var c = remain.substr(0, 1);
					remain = remain.substr(1);

					switch (c) {
						case "i":
						case "I":
						case "c":
						case "C":
						case "t":
						case "T":
						case "s":
						case "S":
							if (!(-1 !== this.m_mode.indexOf(c))) this.m_mode.push(c);
							break;

						case "r":
						case "R":
							break;

						case ",":
							break;

						default:
							this.putError(G_SCRIPT_WARNING, "\u4E0D\u660E\u306A-i\u30AA\u30D7\u30B7\u30E7\u30F3" + c);
							return false;
					}
				}

				break;

			case "R":
				this.m_restore_error = args.value;
				break;

			case "C":
				this.m_csv_name = args.value;
				break;

			case "E":
				this.m_stop_mail = !args.value;
				break;

			case "x":
				this.m_waitflag = args.value;
				break;

			case "X":
				this.m_oneshot = args.value;
				break;

			case "G":
				this.m_is_compress_log = args.value;
				break;
		}

		return true;
	}

	commitArgsAfter() {
		if (!ProcessDefault.commitArgsAfter()) return false;

		if (0 == this.m_csv_name.length) {
			this.m_csv_name = str_replace("%s", date("YmdHis"), G_DOCOMO_ALERT_CSV);
		}

		return true;
	}

	getUsage() {
		var rval = ProcessDefault.getUsage();
		rval.push(["-f={0|1}", "\u9001\u4ED8\u5148\u30B3\u30FC\u30C9\u306E\u30C6\u30B9\u30C8\u3092\u7701\u7565\u3059\u308B\u304B(0)"]);
		rval.push(["-e={0|1}", "\u30A4\u30F3\u30DD\u30FC\u30C8\u524D\u306BDB\u304B\u3089\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3059\u308B\u304B(0)"]);
		rval.push(["-i=i,c,t,T,s,S,r,R", "\u5B9F\u884C\u5185\u5BB9(iIcCtT)\u2193"]);
		rval.push(["-", "i:\u30A4\u30F3\u30DD\u30FC\u30C8(V2\u578B\u9867\u5BA2)"]);
		rval.push(["-", "I:\u30A4\u30F3\u30DD\u30FC\u30C8(\u30DB\u30C3\u30C8\u30E9\u30A4\u30F3\u578B\u9867\u5BA2)"]);
		rval.push(["-", "c:\u8A08\u7B97\u7B49(V2\u578B\u9867\u5BA2)"]);
		rval.push(["-", "C:\u8A08\u7B97\u7B49(\u30DB\u30C3\u30C8\u30E9\u30A4\u30F3\u578B\u9867\u5BA2)"]);
		rval.push(["-", "t:\u7D71\u8A08\u60C5\u5831\u62BD\u51FA(V2\u578B\u9867\u5BA2)"]);
		rval.push(["-", "T:\u7D71\u8A08\u60C5\u5831\u62BD\u51FA(\u30DB\u30C3\u30C8\u30E9\u30A4\u30F3\u578B\u9867\u5BA2)"]);
		rval.push(["-", "s:\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3(V2\u578B\u9867\u5BA2)"]);
		rval.push(["-", "S:\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3(\u30DB\u30C3\u30C8\u30E9\u30A4\u30F3\u578B\u9867\u5BA2)"]);
		rval.push(["-R={0|1}", "\u5B9F\u884C\u524D\u306Bclampfile\u306E\u30A8\u30E9\u30FC\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u6D88\u3059\u304B(1)"]);
		rval.push(["-C=fname", "\u30C9\u30B3\u30E2CSV\u30D5\u30A1\u30A4\u30EB\u540D"]);
		rval.push(["-E={0|1}", "\u30B7\u30E7\u30C3\u30D7\u3042\u3066\u30E1\u30FC\u30EB\u3092\u9001\u4FE1\u3059\u308B\u304B(0)"]);
		rval.push(["-x={0|1}", "batchlog_tb\u306B\u30EC\u30B3\u30FC\u30C9\u304C\u3067\u304D\u308B\u306E\u3092\u5F85\u3064\u304B(0)"]);
		rval.push(["-X={0|1}", "\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u306E\u9593\u306F\u52D5\u4F5C\u3057\u7D9A\u3051\u308B\u304B(0)"]);
		rval.push(["-G={0|1}", "\u30ED\u30B0\u3092\u5727\u7E2E\u3059\u308B\u306A\u30891(1)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessDefault.getManual();
		rval += "\u9001\u4ED8\u5148\u30B3\u30FC\u30C9\u30C1\u30A7\u30C3\u30AF";
		if (this.m_forceflag) rval += "\u305B\u305A";
		rval += "\n";
		rval += "\u30A4\u30F3\u30DD\u30FC\u30C8\u524D\u306BDB\u304B\u3089\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664";
		rval += this.m_clearflag ? "\u3059\u308B" : "\u3057\u306A\u3044";
		rval += "\n";
		rval += "\u52D5\u4F5C";
		if (-1 !== this.m_mode.indexOf("i")) rval += "/\u30A4\u30F3\u30DD\u30FC\u30C8V2";
		if (-1 !== this.m_mode.indexOf("I")) rval += "/\u30A4\u30F3\u30DD\u30FC\u30C8\u30DB\u30C3\u30C8";
		if (-1 !== this.m_mode.indexOf("c")) rval += "/\u8A08\u7B97\u7B49V2";
		if (-1 !== this.m_mode.indexOf("C")) rval += "/\u8A08\u7B97\u7B49\u30DB\u30C3\u30C8";
		if (-1 !== this.m_mode.indexOf("t")) rval += "/\u7D71\u8A08V2";
		if (-1 !== this.m_mode.indexOf("T")) rval += "/\u7D71\u8A08\u30DB\u30C3\u30C8";
		if (-1 !== this.m_mode.indexOf("s")) rval += "/\u30B7\u30DF\u30E5V2";
		if (-1 !== this.m_mode.indexOf("S")) rval += "/\u30B7\u30DF\u30E5\u30DB\u30C3\u30C8";
		rval += "\n";
		rval += "\u5B9F\u884C\u524D\u306Bclampfile\u306E\u30A8\u30E9\u30FC\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\u306B";
		rval += this.m_restore_error ? "\u623B\u3059" : "\u623B\u3055\u306A\u3044";
		rval += "\n";
		rval += "\u30C9\u30B3\u30E2CSV\u30D5\u30A1\u30A4\u30EB\u540D:" + this.m_csv_name + "\n";
		rval += "\u30B7\u30E7\u30C3\u30D7\u3042\u3066\u30E1\u30FC\u30EB\u3092\u9001\u4FE1";
		rval += this.m_stop_mail ? "\u3057\u306A\u3044" : "\u3059\u308B";
		rval += "\n";
		rval += "batchlog_tb\u306E\u30EC\u30B3\u30FC\u30C9\u3092" + (this.m_waitflag ? "\u5F85\u3064" : "\u5F85\u305F\u306A\u3044") + "\n";
		if (this.m_oneshot) rval += "\u4E00\u56DE\u3060\u3051\u5B9F\u884C\n";else rval += "\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u306E\u9593\u306F\u52D5\u4F5C\u3057\u7D9A\u3051\u308B\n";
		rval += "\u30ED\u30B0\u3092\u5727\u7E2E" + (this.m_is_compress_log ? "\u3059\u308B" : "\u3057\u306A\u3044") + "\n";
		return rval;
	}

	beginDB() {
		this.m_db.begin();
		if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.begin();
		return true;
	}

	endDB(status) {
		if (this.m_debugflag) {
			if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.rollback();
			this.m_db.rollback();
			this.putError(G_SCRIPT_INFO, "rollback\u30C7\u30D0\u30C3\u30B0\u30E2\u30FC\u30C9");
		} else if (!status) {
			if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.rollback();
			this.m_db.rollback();
		} else {
			if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.commit();
			this.m_db.commit();
		}

		return true;
	}

	begin_log(pactid, year, month, log) {
		log.setPath(this.m_listener, this.m_curpath, pactid + "_" + sprintf("%04d%02d", year, month) + "/");
		this.m_listener.m_A_listener = Array();
		this.m_listener.putListener(log);
		this.m_listener.putListener(this.m_listener_error);
		return true;
	}

	end_log() {
		this.m_listener.m_A_listener = Array();
		this.m_listener.putListener(this.m_listener_process);
		this.m_listener.putListener(this.m_listener_error);
		return true;
	}

	do_execute() {
		while (this.isOpen()) //V2とホットラインの二回実行する
		//一回だけ実行するなら終了する
		{
			for (var cnt = 0; cnt < 2; ++cnt) //インポートを行う
			{
				var req_hotline = 0 == cnt ? false : true;
				if (!this.do_import(req_hotline)) return false;
				if (!this.isOpen()) return true;
				if (!this.do_calc(req_hotline)) return false;
				if (!this.isOpen()) return true;
				if (!this.do_trend(req_hotline)) return false;
				if (!this.isOpen()) return true;
				if (!this.do_recom(req_hotline)) return false;
				if (!this.isOpen()) return true;
			}

			if (this.m_oneshot) break;
			sleep(SLEEP_SEC);
		}

		return true;
	}

	do_import(req_hotline) //ロック開始
	//clampweb_type_tbから、ダウンロードが完了している顧客IDを取り出す
	//clampweb_daily_tbから、存在する顧客IDを取り出す
	//ロック終了
	//月次と日次のpactidを合成する
	{
		var is_v2 = -1 !== this.m_mode.indexOf("i") && !req_hotline;
		var is_hotline = -1 !== this.m_mode.indexOf("I") && req_hotline;
		if (!is_v2 && !is_hotline) return true;
		this.beginDB();
		this.lockWeb(this.m_db_temp, "lock_admin_docomo_db");
		var sql = "select pactid from clampweb_type_tb";
		sql += " where coalesce(is_ready,false)=true";
		sql += " and env=" + G_CLAMP_ENV;
		if (this.m_pactid.length) sql += " and pactid=" + this.m_pactid;
		if (this.m_A_skippactid.length) sql += " and pactid not in (" + this.m_A_skippactid.join(",") + ")";
		sql += " and pactid in (";
		sql += "select pactid from clampweb_index_tb";
		sql += " where env=" + G_CLAMP_ENV;
		if (is_hotline) sql += " and coalesce(is_hotline,false)=true";
		if (is_v2) sql += " and coalesce(is_hotline,false)=false";
		sql += ")";
		sql += " group by pactid";
		sql += " order by pactid";
		sql += ";";
		var A_result = this.m_db_temp.getAll(sql);
		var A_monthly = Array();

		for (var A_line of Object.values(A_result)) A_monthly.push(A_line[0]);

		sql = "select pactid from clampweb_daily_tb";
		sql += " where env=" + G_CLAMP_ENV;
		if (this.m_pactid.length) sql += " and pactid=" + this.m_pactid;
		if (this.m_A_skippactid.length) sql += " and pactid not in (" + this.m_A_skippactid.join(",") + ")";
		sql += " and pactid in (";
		sql += "select pactid from clampweb_index_tb";
		sql += " where env=" + G_CLAMP_ENV;
		if (is_hotline) sql += " and coalesce(is_hotline,false)=true";
		if (is_v2) sql += " and coalesce(is_hotline,false)=false";
		sql += ")";
		sql += " group by pactid";
		sql += " order by pactid";
		sql += ";";
		A_result = this.m_db_temp.getAll(sql);
		var A_daily = Array();

		for (var A_line of Object.values(A_result)) A_daily.push(A_line[0]);

		this.unlockWeb(this.m_db_temp);
		this.endDB(true);
		var A_pactid = A_monthly;

		for (var pactid of Object.values(A_daily)) if (!(-1 !== A_pactid.indexOf(pactid))) A_pactid.push(pactid);

		for (var pactid of Object.values(A_pactid)) //実行可能時間を超えていれば終了
		{
			if (!this.isOpen()) {
				this.putError(G_SCRIPT_WARNING, "\u30A4\u30F3\u30DD\u30FC\u30C8\u5B9F\u884C\u4E2D\u306B\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u30AA\u30FC\u30D0\u30FC" + pactid);
				break;
			}

			if (-1 !== A_monthly.indexOf(pactid)) if (!this.do_import_pactid(pactid)) return false;
			if (-1 !== A_daily.indexOf(pactid)) if (!this.do_import_daily(pactid)) return false;
		}

		return true;
	}

	do_import_daily(pactid) ////ロック開始
	//ロック終了
	{
		this.beginDB();
		this.lockWeb(this.m_db_temp, "lock_admin_docomo_db");
		var status = this.do_import_daily_in_lock(pactid);
		this.unlockWeb(this.m_db_temp);
		this.endDB(true);
		return status;
	}

	do_import_daily_in_lock(pactid) //clampweb_daily_tbから、処理可能なファイル種別を取り出す
	//{fname,type...}[year][month][detailno][type]
	//インポートを行う
	{
		var sql = "select detailno,year,month,type,idx,fid";
		sql += " from clampweb_daily_tb";
		sql += " where pactid=" + pactid;
		sql += " and env=" + G_CLAMP_ENV;
		sql += " order by detailno,year,month,type,idx,fid";
		sql += ";";
		var result = this.m_db_temp.getHash(sql);
		var A_info = Array();

		for (var H_line of Object.values(result)) {
			var year = H_line.year;
			if (!(undefined !== A_info[year])) A_info[year] = Array();
			var month = H_line.month;
			if (!(undefined !== A_info[year][month])) A_info[year][month] = Array();
			var detailno = H_line.detailno;
			if (!(undefined !== A_info[year][month][detailno])) A_info[year][month][detailno] = Array();
			var type = H_line.type;
			if (!(undefined !== A_info[year][month][detailno][type])) A_info[year][month][detailno][type] = Array();
			A_info[year][month][detailno][type].push(H_line);
		}

		for (var year in A_info) {
			var H_month = A_info[year];

			for (var month in H_month) //ディレクトリを作成して、ログ出力先を切り替える
			//ディレクトリが無ければ作成する
			//ファイルをエクスポートして、削除する
			//該当のレコードをclampweb_daily_tbから削除する
			//ログを元に戻す
			{
				var H_details = H_month[month];
				var log = new ProcessLog();

				if (!this.begin_log(pactid, year, month, log)) {
					return false;
				}

				var path = G_CLAMP_DOCOMO_FIN;
				path = str_replace("/fin/", "/", path);
				path = str_replace("/docomo/", "/docomo_daily/", path);
				path = str_replace("@p", pactid, path);
				path = str_replace("@y", sprintf("%04d%02d", year, month), path);
				var dir = "";
				var remain = path;

				while (remain.length) {
					var idx = undefined;
					if (false === (idx = strpos(remain, "/"))) break;
					dir += remain.substr(0, idx + 1);
					remain = remain.substr(idx + 1);
					if (file_exists(dir)) continue;

					if (!mkdir(dir)) {
						this.putError(G_SCRIPT_WARNING, "\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u4F5C\u6210\u5931\u6557" + dir);
						return false;
					}
				}

				for (var detailno in H_details) {
					var H_type = H_details[detailno];

					for (var type in H_type) //出力先ディレクトリから該当の種別のファイルを削除する
					{
						var A_line = H_type[type];
						var fname = type + "_" + detailno + "_" + year + "_" + month + "_" + "*" + ".csv";
						var flist = Array();
						exec("ls -1 " + path + fname + " 2> /dev/null", flist);

						for (var fname of Object.values(flist)) unlink(fname);

						for (var H_line of Object.values(A_line)) //ファイル名を決定する
						//エクスポートする
						{
							fname = H_line.type + "_" + H_line.detailno + "_" + H_line.year + "_" + H_line.month + "_" + date("d") + "_" + H_line.idx + ".csv";

							if (!this.m_db_temp.loExport(path + fname + ".gz", H_line.fid, false)) //失敗したら処理を打ち切る
								{
									this.putError(G_SCRIPT_WARNING, "loExport:" + H_line.fid + ":" + path + fname + ".gz");
									return false;
								}

							if (!this.processGzip(path + fname + ".gz", false)) //失敗したら処理を打ち切る
								{
									this.putError(G_SCRIPT_WARNING, "gzip:" + path + fname + ".gz");
									return false;
								}

							this.m_db_temp.loUnlink(H_line.fid, false);
						}
					}
				}

				sql = "delete from clampweb_daily_tb";
				sql += " where pactid=" + pactid;
				sql += " and env=" + G_CLAMP_ENV;
				sql += " and year=" + year;
				sql += " and month=" + month;
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db_temp.query(sql);

				if (!this.end_log()) {
					return false;
				}

				delete log;
			}
		}

		return true;
	}

	do_import_pactid(pactid) ////ロック開始
	//clampweb_details_tbから、処理可能なファイル種別を取り出す
	//{fname}[detailno][year][month][type][idx]
	//ロック終了
	//インポートを実行する
	//{"$year,$month,$detailno" => 子プロセス実行結果}
	////ロック開始
	//ロック終了
	{
		this.beginDB();
		this.lockWeb(this.m_db_temp, "lock_admin_docomo_db");
		var A_info = Array();
		var sql = "select detailno,year,month,type,idx,fid";
		sql += " from clampweb_details_tb";
		sql += " where pactid=" + pactid;
		sql += " and env=" + G_CLAMP_ENV;
		sql += " order by detailno,year,month,type,idx,fid";
		sql += ";";
		var result = this.m_db_temp.getAll(sql);
		this.unlockWeb(this.m_db_temp);
		this.endDB(true);

		for (var A_line of Object.values(result)) {
			var detailno = A_line[0];
			var year = A_line[1];
			var month = A_line[2];
			var type = A_line[3];
			var idx = A_line[4];
			var fid = A_line[5];
			if (!(undefined !== A_info[detailno])) A_info[detailno] = Array();
			if (!(undefined !== A_info[detailno][year])) A_info[detailno][year] = Array();
			if (!(undefined !== A_info[detailno][year][month])) A_info[detailno][year][month] = Array();
			if (!(undefined !== A_info[detailno][year][month][type])) A_info[detailno][year][month][type] = Array();
			A_info[detailno][year][month][type].push(fid);
		}

		var H_return_status = Array();
		if (!this.do_import_pactid_exec(pactid, A_info, H_return_status)) return false;
		this.beginDB();
		this.lockWeb(this.m_db_temp, "lock_admin_docomo_db");
		var status = this.do_import_pactid_store(pactid, A_info, H_return_status);
		this.unlockWeb(this.m_db_temp);
		this.endDB(true);
		return status;
	}

	do_import_pactid_exec(pactid, A_info, H_return_status) //取り出したファイルをインポートする
	{
		for (var detailno in A_info) {
			var A_detailno = A_info[detailno];

			for (var year in A_detailno) {
				var A_year = A_detailno[year];

				for (var month in A_year) //年月が古すぎる場合、インポートせずに無視する
				//必要なら、changeoverを実行する
				//ロック開始
				//ロック終了
				//インポートを実行する
				//ASP利用料挿入
				{
					var A_month = A_year[month];
					var diff_month = 12 * (date("Y") - year) + (date("n") - month);

					if (4 < diff_month) //インポートには成功した事にする
						//(ラージオブジェクトは削除される)
						{
							this.putError(G_SCRIPT_WARNING, "\u53E4\u3059\u304E\u308B\u30D5\u30A1\u30A4\u30EB\u304C\u3042\u3063\u305F\u306E\u3067" + "\u30A4\u30F3\u30DD\u30FC\u30C8\u305B\u305A\u306B\u7121\u8996" + "/pactid:=" + pactid + "/detailno:=" + detailno + "/year:=" + year + "/month:=" + month);
							H_return_status[year + "," + month + "," + detailno] = 1;
							continue;
						}

					var log = new ProcessLog();
					if (!this.begin_log(pactid, year, month, log)) return false;
					var path = log.m_path;
					if ("/" != path[path.length - 1]) path += "/";
					var fname = path + "*.cla.gz";
					var flist = Array();
					exec(`ls -1 ${fname} 2> /dev/null`, flist);

					for (var fname of Object.values(flist)) unlink(fname);

					fname = path + "*.cla";
					flist = Array();
					exec(`ls -1 ${fname} 2> /dev/null`, flist);

					for (var fname of Object.values(flist)) unlink(fname);

					if (!this.do_changeover(pactid, year, month, log)) return false;
					this.beginDB();

					for (var type in A_month) {
						var A_type = A_month[type];
						var cnt = 0;

						for (var fid of Object.values(A_type)) {
							var tgtname = path + type + "_" + detailno + "_" + year + "_" + month + "_" + cnt + ".cla.gz";
							++cnt;

							if (!this.m_db_temp.loExport(tgtname, fid, false)) //失敗したら処理を打ち切る
								{
									this.putError(G_SCRIPT_WARNING, "loExport:" + fid);
									return false;
								}
						}
					}

					this.endDB(true);
					var arg = [{
						key: "m",
						value: 0
					}, {
						key: "l",
						value: log.m_path
					}, {
						key: "k",
						value: 0
					}, {
						key: "p",
						value: pactid
					}, {
						key: "y",
						value: sprintf("%04d%02d", year, month)
					}, {
						key: "r",
						value: this.m_repeatflag ? 1 : 0
					}, {
						key: "d",
						value: this.m_debugflag ? 1 : 0
					}, {
						key: "f",
						value: this.m_forceflag ? 1 : 0
					}, {
						key: "e",
						value: this.m_clearflag ? 1 : 0
					}, {
						key: "M",
						value: 2
					}, {
						key: "E",
						value: this.m_stop_mail ? 0 : 1
					}, {
						key: "s",
						value: log.m_path
					}];
					var proc = new ScriptCommand(this.m_listener, false);
					if (-1 !== this.m_A_pactid_hotline.indexOf(pactid)) proc.m_stop_warning = true;
					var status = proc.execute(G_PHP + " import_docomo.php", arg, Array());
					arg = [{
						key: "m",
						value: 0
					}, {
						key: "l",
						value: log.m_path
					}, {
						key: "k",
						value: 0
					}, {
						key: "p",
						value: pactid
					}, {
						key: "y",
						value: sprintf("%04d%02d", year, month)
					}, {
						key: "r",
						value: this.m_repeatflag ? 1 : 0
					}, {
						key: "d",
						value: this.m_debugflag ? 1 : 0
					}, {
						key: "c",
						value: G_CARRIER_DOCOMO
					}];
					delete proc;
					sleep(3);
					H_return_status[year + "," + month + "," + detailno] = status;

					if (!status) {
						if (-1 !== this.m_A_pactid_hotline.indexOf(pactid)) this.putError(G_SCRIPT_INFO, "\u30A4\u30F3\u30DD\u30FC\u30C8\u5931\u6557" + pactid + "/" + year + "/" + month + "/" + detailno);else this.putError(G_SCRIPT_WARNING, "\u30A4\u30F3\u30DD\u30FC\u30C8\u5931\u6557" + pactid + "/" + year + "/" + month + "/" + detailno);
					}

					arg = [{
						key: "e",
						value: "O"
					}, {
						key: "p",
						value: pactid
					}, {
						key: "y",
						value: sprintf("%04d%02d", year, month)
					}];
					proc = new ScriptCommand(this.m_listener, false);

					if (-1 !== this.m_A_pactid_hotline.indexOf(pactid)) {
						proc.m_stop_warning = true;
					}

					status = proc.execute(G_PHP + " ../FlatEverySecondMonth.php", arg, Array());
					delete proc;
					sleep(3);

					if (!status) {
						if (-1 !== this.m_A_pactid_hotline.indexOf(pactid)) this.putError(G_SCRIPT_INFO, "\u30A4\u30F3\u30DD\u30FC\u30C8\u5931\u6557(\u5E73\u6E96\u5316)" + pactid + "/" + year + "/" + month + "/" + detailno);else this.putError(G_SCRIPT_WARNING, "\u30A4\u30F3\u30DD\u30FC\u30C8\u5931\u6557(\u5E73\u6E96\u5316)" + pactid + "/" + year + "/" + month + "/" + detailno);
					}

					if (!this.end_log()) return false;
					delete log;
				}
			}
		}

		return true;
	}

	do_changeover(pactid, year, month, log) //部署情報があるか確認
	{
		var sql = "select count(*) from post_" + this.m_table_no.get(year, month) + "_tb where pactid=" + pactid + ";";
		if (this.m_db.getOne(sql)) return true;
		this.putError(G_SCRIPT_INFO, "changeover\u5B9F\u884C" + pactid + "/" + year + "/" + month);
		var arg_changeover = [{
			key: "m",
			value: 0
		}, {
			key: "l",
			value: log.m_path
		}, {
			key: "k",
			value: 0
		}, {
			key: "p",
			value: pactid
		}, {
			key: "y",
			value: sprintf("%04d%02d", year, month)
		}, {
			key: "r",
			value: this.m_repeatflag ? 1 : 0
		}, {
			key: "d",
			value: this.m_debugflag ? 1 : 0
		}];
		var proc = new ScriptCommand(this.m_listener, false);

		if (!proc.execute(G_PHP + " changeover.php", arg_changeover, Array())) {
			this.putError(G_SCRIPT_WARNING, "changeover\u5B9F\u884C\u5931\u6557" + pactid + "/" + year + "/" + month);
			return false;
		}

		return true;
	}

	do_import_pactid_store(pactid, A_info, H_return_status) {
		var A_type_details = G_CLAMP_DOCOMO_TEL_TYPE.split(",");
		var A_type_comm = G_CLAMP_DOCOMO_COMM_TYPE.split(",");
		var A_type_info = G_CLAMP_DOCOMO_INFO_TYPE.split(",");
		var A_type_bill = G_CLAMP_DOCOMO_BILL_TYPE.split(",");

		for (var detailno in A_info) {
			var A_detailno = A_info[detailno];

			for (var year in A_detailno) {
				var A_year = A_detailno[year];

				for (var month in A_year) //請求明細を取り出したらtrue
				//通信明細を取り出したらtrue
				//情報料明細を取り出したらtrue
				//請求書情報を取り出したらtrue
				//clampdb_index_tbのis_details,comm,info,billをtrueにする
				//また、それ以後の処理フラグをfalseに戻す
				{
					var A_month = A_year[month];
					var is_details = false;
					var is_comm = false;
					var is_info = false;
					var is_bill = false;
					var key = year + "," + month + "," + detailno;

					if (!(undefined !== H_return_status[key]) || !H_return_status[key]) //インポートができなかったので、ファイルを残しておく
						{
							this.putError(G_SCRIPT_INFO, "\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u305F\u306E\u3067\u30E9\u30FC\u30B8\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u524A\u9664\u305B\u305A" + pactid + "/" + year + "/" + month + "/" + detailno);
							continue;
						}

					for (var type in A_month) //WEB側DBからラージオブジェクトを削除する
					//clampweb_details_tbから不要になったレコードを削除する
					//clampweb_type_tbから不要になったレコードを削除する
					//clampdb_type_tbの該当するis_readyをtrueにする
					//処理が終わったファイル種別のフラグを立てる
					{
						var A_type = A_month[type];

						for (var fid of Object.values(A_type)) {
							if (!this.m_db_temp.loUnlink(fid, false)) //失敗しても処理を続ける
								{
									this.putError(G_SCRIPT_WARNING, "loUnlink" + fid);
								}
						}

						var sqlwhere = "";
						sqlwhere += " where pactid=" + pactid;
						sqlwhere += " and detailno=" + detailno;
						sqlwhere += " and year=" + year;
						sqlwhere += " and month=" + month;
						sqlwhere += " and type='" + this.m_db_temp.escape(type) + "'";
						var sql = "delete from clampweb_details_tb";
						sql += sqlwhere;
						sql += " and env=" + G_CLAMP_ENV;
						sql += ";";
						this.putError(G_SCRIPT_SQL, sql);
						this.m_db_temp.query(sql);
						sql = "delete from clampweb_type_tb";
						sql += sqlwhere;
						sql += " and env=" + G_CLAMP_ENV;
						sql += ";";
						this.putError(G_SCRIPT_SQL, sql);
						this.m_db_temp.query(sql);
						sql = "update clampdb_type_tb";
						sql += " set is_ready=true";
						sql += ",fixdate='" + date("Y-m-d H:i:s") + "'";
						sql += sqlwhere;
						sql += ";";
						this.putError(G_SCRIPT_SQL, sql);
						this.m_db.query(sql);
						if (-1 !== A_type_details.indexOf(type)) is_details = true;
						if (-1 !== A_type_comm.indexOf(type)) is_comm = true;
						if (-1 !== A_type_info.indexOf(type)) is_info = true;
						if (-1 !== A_type_bill.indexOf(type)) is_bill = true;
					}

					var H_to = Array();
					if (is_details) H_to.is_details = true;
					if (is_comm) H_to.is_comm = true;
					if (is_info) H_to.is_info = true;
					if (is_bill) H_to.is_bill = true;

					if (is_details || is_comm) {
						H_to.is_calc = false;
						H_to.is_trend = false;
						H_to.is_recom = false;
					}

					if (!this.update_clampdb_index_tb(pactid, detailno, year, month, Array(), H_to)) return false;
				}
			}
		}

		return true;
	}

	update_clampdb_index_tb(pactid, detailno, year, month, H_from, H_to) {
		var sql = "update clampdb_index_tb";
		sql += " set fixdate='" + date("Y-m-d H:i:s") + "'";

		for (var key in H_to) {
			var value = H_to[key];
			sql += "," + key + "=" + (value ? "true" : "false");
		}

		var H_cond = Array();
		if (pactid.length) H_cond.pactid = pactid;
		if (detailno.length) H_cond.detailno = detailno;
		if (year.length) H_cond.year = year;
		if (month.length) H_cond.month = month;
		var is_where = true;

		for (var key in H_cond) {
			var value = H_cond[key];
			if (is_where) sql += " where";else sql += " and";
			is_where = false;
			sql += " " + key + "=" + value;
		}

		for (var key in H_from) {
			var value = H_from[key];
			if (is_where) sql += " where";else sql += " and";
			is_where = false;

			if (Array.isArray(value)) {
				sql += "(";
				var is_or = false;

				for (var local_key in value) {
					var local_value = value[local_key];
					if (is_or) sql += " or";
					is_or = true;
					sql += " coalesce(" + local_key + ",false)=" + (local_value ? "true" : "false");
				}

				sql += ")";
			} else sql += " coalesce(" + key + ",false)=" + (value ? "true" : "false");
		}

		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	get_clampdb_index_tb(H_result, H_from, A_is_v2, A_is_hotline) //顧客で絞り込み
	//最大で過去四ヶ月に制限する
	//顧客・年月の順にソート
	{
		var sql = "select index_tb.pactid,index_tb.year,index_tb.month";
		sql += " from clampdb_index_tb as index_tb";
		sql += " left join pact_tb";
		sql += " on index_tb.pactid=pact_tb.pactid";
		var is_where = true;

		if (this.m_pactid.length) {
			if (is_where) sql += " where";else sql += " and";
			is_where = false;
			sql += " index_tb.pactid=" + this.m_pactid;
		}

		if (this.m_A_skippactid.length) {
			if (is_where) sql += " where";else sql += " and";
			is_where = false;
			sql += " index_tb.pactid not in (" + this.m_A_skippactid.join(",") + ")";
		}

		for (var key in H_from) {
			var value = H_from[key];
			if (is_where) sql += " where";else sql += " and";
			is_where = false;

			if (Array.isArray(value)) {
				sql += "(";
				var is_or = false;

				for (var local_key in value) {
					var local_value = value[local_key];
					if (is_or) sql += " or";
					is_or = true;
					sql += " coalesce(index_tb." + local_key + ",false)=" + (local_value ? "true" : "false");
				}

				sql += ")";
			} else sql += " coalesce(index_tb." + key + ",false)=" + (value ? "true" : "false");
		}

		var year = this.m_year;
		var month = this.m_month;
		if (is_where) sql += " where";else sql += " and";
		is_where = false;
		sql += " (";

		for (var cnt = 0; cnt < 4; ++cnt) //V2とホットラインで絞り込み
		{
			if (cnt) sql += " or";
			sql += "(";
			sql += "index_tb.year=" + year + " and index_tb.month=" + month;
			var A_types = Array();
			if (A_is_v2[cnt ? 1 : 0]) A_types.push("'M'");
			if (A_is_hotline[cnt ? 1 : 0]) A_types.push("'H'");
			if (A_types.length) sql += " and pact_tb.type in (" + A_types.join(",") + ")";else sql += " and 1=0";
			sql += ")";
			--month;

			if (0 == month) {
				month = 12;
				--year;
			}
		}

		sql += ")";
		sql += " group by index_tb.pactid,index_tb.year,index_tb.month";
		sql += " order by index_tb.pactid,index_tb.year,index_tb.month";
		sql += ";";
		var result = this.m_db.getAll(sql);
		H_result = Array();
		var cur_pactid = "";
		var A_ym = Array();

		for (var A_line of Object.values(result)) {
			var pactid = A_line[0];

			if (strcmp(pactid, cur_pactid)) {
				if (A_ym.length && cur_pactid.length) H_result[cur_pactid] = A_ym;
				A_ym = Array();
				cur_pactid = pactid;
			}

			var ym = [A_line[1], A_line[2]];
			A_ym.push(ym);
		}

		if (A_ym.length && cur_pactid.length) H_result[cur_pactid] = A_ym;
		return true;
	}

	do_calc(req_hotline) //請求明細がダウンロード済みであり、計算等がまだの顧客を取り出す
	{
		var is_v2 = -1 !== this.m_mode.indexOf("c") && !req_hotline;
		var is_hotline = -1 !== this.m_mode.indexOf("C") && req_hotline;
		var H_result = Array();
		if (!this.get_clampdb_index_tb(H_result, {
			is_calc: false,
			is_details: true
		}, [is_v2, false], [is_hotline, is_hotline])) return false;

		for (var pactid in H_result) //実行可能時間を超えていれば終了
		{
			var A_ym = H_result[pactid];

			if (!this.isOpen()) {
				this.putError(G_SCRIPT_WARNING, "\u8A08\u7B97\u4E2D\u306B\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u30AA\u30FC\u30D0\u30FC" + pactid);
				break;
			}

			for (var A_line of Object.values(A_ym)) //ディレクトリを作成して、ログ出力先を切り替える
			//ホットライン電話追加を行う
			//計算等実行済みフラグを立てる
			{
				var year = A_line[0];
				var month = A_line[1];
				this.putError(G_SCRIPT_INFO, "\u8A08\u7B97\u7B49\u5B9F\u884C" + pactid + "/" + year + "/" + month);
				var log = new ProcessLog();
				if (!this.begin_log(pactid, year, month, log)) return false;
				var common = [{
					key: "m",
					value: 0
				}, {
					key: "l",
					value: log.m_path
				}, {
					key: "k",
					value: 0
				}, {
					key: "p",
					value: pactid
				}, {
					key: "y",
					value: sprintf("%04d%02d", year, month)
				}, {
					key: "r",
					value: this.m_repeatflag ? 1 : 0
				}, {
					key: "d",
					value: this.m_debugflag ? 1 : 0
				}];
				var status = true;
				var proc = new ScriptCommand(this.m_listener, false);
				var arg = [{
					key: "C",
					value: this.m_csv_name
				}];
				if (status && !proc.execute(G_PHP + " insert_tel_docomo.php", arg, common)) status = false;
				arg = [{
					key: "c",
					value: G_CARRIER_DOCOMO
				}, {
					key: "C",
					value: this.m_csv_name
				}];
				if (status && !proc.execute(G_PHP + " alert.php", arg, common)) status = false;
				arg = [{
					key: "c",
					value: G_CARRIER_DOCOMO
				}];
				if (status && !proc.execute(G_PHP + " recent_telcnt.php", arg, common)) status = false;
				arg = [{
					key: "c",
					value: G_CARRIER_DOCOMO
				}];
				if (status && !proc.execute(G_PHP + " decorate_comm.php", arg, common)) status = false;
				arg = Array();
				if (status && !proc.execute(G_PHP + " calc.php", arg, common)) status = false;
				delete proc;
				if (!this.end_log()) return false;
				delete log;

				if (status) //ロック開始
					//ロック終了
					{
						this.beginDB();
						status = this.update_clampdb_index_tb(pactid, "", year, month, {
							is_calc: false,
							is_details: true
						}, {
							is_calc: true
						});
						this.endDB(status);
						if (!status) return false;
					} else {
					this.putError(G_SCRIPT_WARNING, "\u8A08\u7B97\u7B49\u5B9F\u884C\u5931\u6557" + pactid + "/" + year + "/" + month);
				}
			}
		}

		return true;
	}

	do_trend(req_hotline) //請求明細がダウンロード済みであり、統計情報抽出がまだの顧客を取り出す
	//{"$pactid,$year,$month"}
	//処理が必要な顧客に対してループ
	//predata実行時にtrend_mainを実行した条件を保存する
	//通話明細がダウンロード済みであり、統計情報抽出がまだの顧客を取り出す
	//統計情報抽出済みフラグを立てる
	{
		var is_v2 = -1 !== this.m_mode.indexOf("t") && !req_hotline;
		var is_hotline = -1 !== this.m_mode.indexOf("T") && req_hotline;
		var H_result = Array();
		if (!this.get_clampdb_index_tb(H_result, {
			is_trend: false,
			is_details: true
		}, [is_v2, false], [is_hotline, is_hotline])) return false;
		var A_store = Array();

		for (var pactid in H_result) //実行可能時間を超えていれば終了
		{
			var A_ym = H_result[pactid];

			if (!this.isOpen()) {
				this.putError(G_SCRIPT_WARNING, "\u7D71\u8A08\u60C5\u5831\u62BD\u51FA\u4E2D\u306B\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u30AA\u30FC\u30D0\u30FC(\u8ACB\u6C42\u660E\u7D30)" + pactid);
				break;
			}

			for (var A_line of Object.values(A_ym)) //ディレクトリを作成して、ログ出力先を切り替える
			//predataを実行する
			//統計情報抽出済みフラグを立てるために保存する
			{
				var year = A_line[0];
				var month = A_line[1];
				this.putError(G_SCRIPT_INFO, "\u7D71\u8A08\u60C5\u5831\u62BD\u51FA(\u8ACB\u6C42\u660E\u7D30)" + pactid + "/" + year + "/" + month);
				var log = new ProcessLog();
				if (!this.begin_log(pactid, year, month, log)) return false;
				var common = [{
					key: "m",
					value: 0
				}, {
					key: "l",
					value: log.m_path
				}, {
					key: "k",
					value: 0
				}, {
					key: "p",
					value: pactid
				}, {
					key: "y",
					value: sprintf("%04d%02d", year, month)
				}, {
					key: "r",
					value: this.m_repeatflag ? 1 : 0
				}, {
					key: "d",
					value: this.m_debugflag ? 1 : 0
				}];
				var status = true;
				var proc = new ScriptCommand(this.m_listener, false);
				var arg = [{
					key: "c",
					value: G_CARRIER_DOCOMO
				}];
				if (status && !proc.execute(G_PHP + " predata.php", arg, common)) status = false;
				arg = [{
					key: "c",
					value: G_CARRIER_DOCOMO
				}];
				if (status && !proc.execute(G_PHP + " trend_main.php", arg, common)) status = false;
				arg = [{
					key: "c",
					value: G_CARRIER_DOCOMO
				}];
				if (status && !proc.execute(G_PHP + " trend_graph.php", arg, common)) status = false;
				delete proc;
				if (!this.end_log()) return false;
				delete log;

				if (status) {
					A_store.push(`${pactid},${year},${month}`);
				} else {
					this.putError(G_SCRIPT_WARNING, "\u7D71\u8A08\u60C5\u5831\u62BD\u51FA(\u8ACB\u6C42\u660E\u7D30)" + pactid + "/" + year + "/" + month);
				}
			}
		}

		var A_store_predata = A_store;
		H_result = Array();
		if (!this.get_clampdb_index_tb(H_result, {
			is_trend: false,
			is_comm: true
		}, [is_v2, false], [is_hotline, is_hotline])) return false;

		for (var pactid in H_result) //実行可能時間を超えていれば終了
		{
			var A_ym = H_result[pactid];

			if (!this.isOpen()) {
				this.putError(G_SCRIPT_WARNING, "\u7D71\u8A08\u60C5\u5831\u62BD\u51FA\u4E2D\u306B\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u30AA\u30FC\u30D0\u30FC(\u901A\u8A71\u660E\u7D30)" + pactid);
				break;
			}

			for (var A_line of Object.values(A_ym)) //ディレクトリを作成して、ログ出力先を切り替える
			//当該条件でtrend_mainを実行していなければ、trend_mainを実行する
			//統計情報抽出済みフラグを立てるために保存する
			{
				year = A_line[0];
				month = A_line[1];
				this.putError(G_SCRIPT_INFO, "\u7D71\u8A08\u60C5\u5831\u62BD\u51FA(\u901A\u8A71\u660E\u7D30)" + pactid + "/" + year + "/" + month);
				log = new ProcessLog();
				if (!this.begin_log(pactid, year, month, log)) return false;
				common = [{
					key: "m",
					value: 0
				}, {
					key: "l",
					value: log.m_path
				}, {
					key: "k",
					value: 0
				}, {
					key: "p",
					value: pactid
				}, {
					key: "y",
					value: sprintf("%04d%02d", year, month)
				}, {
					key: "r",
					value: this.m_repeatflag ? 1 : 0
				}, {
					key: "d",
					value: this.m_debugflag ? 1 : 0
				}];
				status = true;
				proc = new ScriptCommand(this.m_listener, false);

				if (!(-1 !== A_store_predata.indexOf(`${pactid},${year},${month}`))) //trend_mainを実行する
					{
						arg = [{
							key: "c",
							value: G_CARRIER_DOCOMO
						}];
						if (status && !proc.execute(G_PHP + " trend_main.php", arg, common)) status = false;
						arg = [{
							key: "c",
							value: G_CARRIER_DOCOMO
						}];
						if (status && !proc.execute(G_PHP + " trend_graph.php", arg, common)) status = false;
					}

				delete proc;
				if (!this.end_log()) return false;
				delete log;

				if (status) {
					A_store.push(`${pactid},${year},${month}`);
				} else {
					this.putError(G_SCRIPT_WARNING, "\u7D71\u8A08\u60C5\u5831\u62BD\u51FA(\u901A\u8A71\u660E\u7D30)" + pactid + "/" + year + "/" + month);
				}
			}
		}

		for (var keys of Object.values(A_store)) //ロック開始
		//ロック終了
		{
			var A_keys = keys.split(",");

			if (A_keys.length < 3) {
				this.putError(G_SCRIPT_WARING, "internal:do_trend(0)");
				continue;
			}

			var pactid = A_keys[0];
			year = A_keys[1];
			month = A_keys[2];

			if (!pactid.length || !year.length || !month.length) {
				this.putError(G_SCRIPT_WARNING, "internal:do_trend(1)");
				continue;
			}

			this.beginDB();
			status = true;
			if (status && !this.update_clampdb_index_tb(pactid, "", year, month, {
				is_trend: false,
				is_details: true
			}, {
				is_trend: true
			})) status = false;
			if (status && !this.update_clampdb_index_tb(pactid, "", year, month, {
				is_trend: false,
				is_comm: true
			}, {
				is_trend: true
			})) status = false;
			this.endDB(status);
			if (!status) return false;
		}

		return true;
	}

	do_recom(req_hotline) {
		var is_v2 = -1 !== this.m_mode.indexOf("s") && !req_hotline;
		var is_hotline = -1 !== this.m_mode.indexOf("S") && req_hotline;
		if (!is_v2 && !is_hotline) return true;
		var H_result = Array();
		if (!this.get_clampdb_index_tb(H_result, {
			is_recom: false,
			is_calc: true
		}, [is_v2, is_v2], [is_hotline, is_hotline])) return false;

		for (var pactid in H_result) //実行可能時間を超えていれば終了
		//ディレクトリを作成して、ログ出力先を切り替える
		//V3型顧客かどうかを調べる
		//シミュレーションを実行する
		//ログを元に戻す
		{
			var A_ym = H_result[pactid];

			if (!this.isOpen()) {
				this.putError(G_SCRIPT_WARNING, "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u5B9F\u884C\u4E2D\u306B\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u30AA\u30FC\u30D0\u30FC" + pactid);
				break;
			}

			var year = "";
			var month = "";

			for (var A_line of Object.values(A_ym)) {
				year = A_line[0];
				month = A_line[1];
			}

			if (!year.length || !month.length) continue;
			this.putError(G_SCRIPT_INFO, "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u5B9F\u884C" + pactid + "/" + year + "/" + month);
			var log = new ProcessLog();
			if (!this.begin_log(pactid, year, month, log)) return false;
			var no = this.m_table_no.get(year, month);
			var sql = "select count(*) as count from trend_" + no + "_tb";
			sql += " where pactid=" + pactid;
			sql += ";";
			var is_trend = 0 < this.m_db.getOne(sql);
			sql = "select count(*) from fnc_relation_tb where fncid=" + AUTH_V3_SIM + " and pactid=" + pactid + ";";
			var is_v3_sim = 0 < this.m_db.getOne(sql);

			if (is_v3_sim) //V3型顧客のシミュレーションを行う
				{
					var common = [{
						key: "m",
						value: 0
					}, {
						key: "l",
						value: log.m_path
					}, {
						key: "k",
						value: 0
					}, {
						key: "p",
						value: pactid
					}, {
						key: "y",
						value: sprintf("%04d%02d", year, month)
					}, {
						key: "r",
						value: this.m_repeatflag ? 1 : 0
					}, {
						key: "d",
						value: this.m_debugflag ? 1 : 0
					}];
					var status = true;
					var proc = new ScriptCommand(this.m_listener, false);
					var arg = [{
						key: "c",
						value: G_CARRIER_DOCOMO
					}];
					if (!proc.execute(G_PHP + " recom3.php", arg, common)) status = false;
					delete proc;
				} else //V2型顧客のシミュレーションを行う
				{
					common = [{
						key: "m",
						value: 0
					}, {
						key: "l",
						value: log.m_path
					}, {
						key: "k",
						value: 0
					}, {
						key: "p",
						value: pactid
					}, {
						key: "y",
						value: sprintf("%04d%02d", year, month)
					}, {
						key: "r",
						value: this.m_repeatflag ? 1 : 0
					}, {
						key: "d",
						value: this.m_debugflag ? 1 : 0
					}];
					status = true;
					proc = new ScriptCommand(this.m_listener, false);

					if (is_trend) //統計情報あり(統計情報の有無によって処理に違いはない)
						{
							arg = [{
								key: "c",
								value: G_CARRIER_DOCOMO
							}];
							if (!proc.execute(G_PHP + " recom.php", arg, common)) status = false;
						} else //統計情報なし(統計情報の有無によって処理に違いはない)
						{
							arg = [{
								key: "c",
								value: G_CARRIER_DOCOMO
							}];
							if (!proc.execute(G_PHP + " recom.php", arg, common)) status = false;
						}

					delete proc;
				}

			if (!this.end_log()) return false;
			delete log;

			if (status) //ロック開始
				//シミュレーション実行済みフラグを立てる
				//ロック終了
				{
					this.beginDB();
					status = this.update_clampdb_index_tb(pactid, "", "", "", {
						is_recom: false,
						is_calc: true
					}, {
						is_recom: true
					});
					this.endDB(status);
					if (!status) return false;
				} else this.putError(G_SCRIPT_WARNING, "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u5B9F\u884C\u5931\u6557" + pactid + "/" + year + "/" + month);
		}

		return true;
	}

	compressLog() {
		if (!this.m_is_compress_log) return true;
		this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u5727\u7E2E\u958B\u59CB");
		var A_file = Array();
		if (!this.compressLogLevel(A_file, this.m_listener_process.m_path, 0)) return false;

		for (var fname of Object.values(A_file)) {
			if (!this.processGzip(fname, true)) return false;
		}

		return true;
	}

	compressLogLevel(A_file: {} | any[], path, level) {
		var fname;
		if (30 < level) return false;
		++level;
		var O_dir = opendir(path);

		while (false !== (fname = readdir(O_dir))) {
			if ("." === fname || ".." == fname) continue;
			var fullpath = path + fname;
			if (is_link(fullpath)) continue;

			if (is_dir(fullpath)) {
				if (!this.compressLogLevel(A_file, fullpath + "/", level)) return false;
			}

			if (is_file(fullpath)) {
				if (this.compressLogIsTarget(fullpath)) A_file.push(fullpath);
			}
		}

		closedir(O_dir);
		return true;
	}

	compressLogIsTarget(fullpath) {
		if (preg_match("/\\.(insert|delete|log)(|\\.[0-9]+)$/", fullpath)) return true;
		return false;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_DB) log = G_LOG_ADMIN_DOCOMO_DB;
var proc = new ProcessAdminDocomoDB(G_PROCNAME_ADMIN_DOCOMO_DB, log, G_OPENTIME_ADMIN_DOCOMO_DB);
if (!proc.readArgs(undefined)) throw die(1);

if (proc.m_waitflag) {
	var is_exec = false;
	var sql = "select count(*) from batchlog_tb";
	sql += " where log='admin_docomo_ok'";
	sql += " and status='begin'";
	sql += " and recdate>'" + date("Y") + "-" + date("n") + "-" + date("d") + "'";
	sql += ";";

	while (true) {
		if (!proc.isOpen()) break;

		if (proc.m_db.getOne(sql)) {
			var status = proc.execute();
			proc.compressLog();
			is_exec = true;
			break;
		}

		sleep(60);
	}

	if (!is_exec) proc.putError(G_SCRIPT_WARNING, "\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u4E2D\u306Bbatchlog_tb\u306Eadmin_docomo_ok\u304Cbegin\u306B\u306A\u3089\u306A\u304B\u3063\u305F");else {
		sql = "update batchlog_tb set status='done'";
		sql += " where log='admin_docomo_ok'";
		sql += " and status='begin'";
		sql += " and recdate>'" + date("Y") + "-" + date("n") + "-" + date("d") + "'";
		sql += ";";
		proc.beginDB();
		proc.m_db.query(sql);
		proc.endDB(true);
	}
} else {
	status = proc.execute();
	proc.compressLog();
	if (!status) throw die(1);
}

throw die(0);