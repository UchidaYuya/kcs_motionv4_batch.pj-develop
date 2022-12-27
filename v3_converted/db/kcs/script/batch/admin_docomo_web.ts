//===========================================================================
//機能：WEB側プロセス管理プロセス(ドコモ専用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//一時停止時の待機秒数
//---------------------------------------------------------------------------
//V3形式のMtSetting型は定数が衝突するので、衝突しない設定ファイル型
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/download_docomo.php");

const G_PROCNAME_ADMIN_DOCOMO_WEB = "admin_docomo_web";
const G_OPENTIME_ADMIN_DOCOMO_WEB = "0000,2400";
const SLEEP_SEC = 60;

//array(設定項目 => 設定内容);
//機能：コンストラクタ
//機能：項目名があればtrueを返す
//引数：設定項目
//機能：値を返す
//引数：設定項目
//設定項目が無かった場合に返す値
//機能：ファイルを読み出す
//引数：ファイル名
class IniSettingType {
	constructor() {
		this.m_H_param = Array();
	}

	isOk(key) {
		return undefined !== this.m_H_param[key];
	}

	get(key, def = false) {
		return undefined !== this.m_H_param[key] ? this.m_H_param[key] : def;
	}

	read(fname) //インクルードパスの中でファイルを探す
	{
		var delim = ":";
		if (undefined !== global[PATH_SEPARATOR]) delim = PATH_SEPARATOR;
		var A_dir = get_include_path().split(delim);

		for (var dir of Object.values(A_dir)) {
			if (!dir.length) continue;
			if ("/" !== dir[dir.length - 1]) dir += "/";

			if (file_exists(dir + fname)) {
				fname = dir + fname;
				break;
			}
		}

		if (!file_exists(fname)) return;
		var H_param = parse_ini_file(fname);

		for (var key in H_param) {
			var value = H_param[key];
			this.m_H_param[key] = value;
		}
	}

};

//一時DBの接続用
//実行するクランプID
//除外するクランプID
//一度だけ起動するならtrue
//プロセス番号
//管理用でログイン(0,1,2->未チェック,失敗,成功)
//管理用がDL成功していなくてもDLするならtrue
//何日間DLが無ければ以後無視するか(0なら無視しない)
//プロキシの設定をiniファイルから読むならtrue
//プロキシのアドレス
//プロキシのポート
//proxyのアドレスとポート以外のパラメーターに関して
//サイト構成変更を検出した際の待機秒数
//サイト構成変更するクランプIDの上限
//clampidあたりのサイト構成変更許容回数の上限
//clampid => サイト構成変更の検出回数
//サイト構成上限に達したクランプID
//サイト構成を検出したが、その後復帰できたクランプID
//サイト構成復帰のログレベル
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
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
//-----------------------------------------------------------------------
//機能：処理の後に呼ばれる
//引数：do_executeの実行ステータス
//返値：深刻なエラーが発生したらfalseを返す
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：ダウンロード処理
//引数：DBインスタンス
//試行期間リセット指示があればtrue
//管理用で試行したらtrue
//ダウンロードに成功したらfalseを返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：試行期間切り替えを行う
//引数：DBインスタンス
//管理用を試行したらtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：ダウンロードが必要なクランプIDを捜す
//引数：DBインスタンス
//管理用を試行したらtrue
//ダウンロードが必要なクランプIDを返す
//パスワードを返す
//二段階認証のクッキーを返す
//ネットワーク暗証番号を返す
//ホットラインならtrueを返す
//管理用ならtrueを返す
//日次ダウンロードを行うならtrueを返す
////{fname}[year][month][type][fidx]を返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：実際のダウンロードを行う
//引数：DBインスタンス
//ID
//パスワード
//二段階認証のクッキー
//ネットワーク暗証番号
//ホットラインならtrue
//{fname}[year][month][type][fidx]
//ログインに成功したらtrueを返す
//ログインが割り込まれたらtrueを返す
//ログインに失敗したらtrueを返す(管理用で失敗したらfalse)
//サイト構成変更ならtrueを返す
//申込が不十分ならtrueを返す
//端末登録されていなければtrueを返す
//端末登録されたがクッキーが無効になればtrueを返す
//ネットワーク暗証番号が不正ならtrueを返す
//日次ダウンロードするならtrue
//日次ダウンロードしたファイルを返す
//IDがロックされていたらtrueを返す
//管理用アカウントならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：ログインが必要な年月を取り出す
//引数：DBインスタンス
//DLしようとしているアカウントのID
//array(array("year" => yyyy, "month" => mm))を返す
//管理用IDならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：ログイン復帰動作を行う
//引数：DBインスタンス
//ID
//パスワード
//ホットラインならtrue
//ログインに失敗したらtrueを返す
//ログイン結果
//返値：深刻なエラーが発生したらfalseを返す
//機能：ダウンロードしたファイルをDBに格納する(同時にis_runningをfalseに設定)
//引数：DBインスタンス
//管理用を試行したらtrue
//ID
//パスワード
//{fname}[year][month][type][fidx]
//ログインに成功したらtrue
//ログインが割り込まれたらtrue
//サイト構成変更ならtrue
//申込が不十分ならtrue
//端末登録がまだならtrue
//端末登録が無効になったらtrue
//ネットワーク暗証番号が不正ならtrue
//管理用アカウントならtrue
//ログインに失敗したらtrue(管理用でログインできなければfalse)
//日次ダウンロードするならtrue
//日次ダウンロードしたファイル
//IDがロックされていたらtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：SQLのWHERE節のうち、m_A_id_in,outの部分を返す
//引数：テーブル名
//返値：WHERE節の条件(先頭はWHEREではない/先頭は空白文字ではない)
//機能：当月を含めた過去四ヶ月分の年月部分を作る
//引数：テーブル名
class ProcessAdminDocomoWeb extends ProcessBase {
	ProcessAdminDocomoWeb(procname, logpath, opentime) //proxyパスワード
	//サイト構成変更関連の値を初期化する
	//5分待機する
	//クランプIDは30個まで許容する
	//クランプIDあたり3回だけ許容する
	//復帰はDEBUG扱い
	{
		this.ProcessBase(procname, logpath, opentime);

		if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) {
			this.m_db_temp = new ScriptDB(this.m_listener, GLOBALS.G_dsn_temp);
		} else this.m_db_temp = this.m_db;

		this.m_args.addSetting({
			c: {
				type: "string"
			},
			C: {
				type: "string"
			},
			x: {
				type: "int"
			},
			X: {
				type: "int"
			},
			s: {
				type: "int"
			},
			S: {
				type: "int"
			},
			H: {
				type: "string"
			},
			P: {
				type: "string"
			}
		});
		this.m_A_id_in = Array();
		this.m_A_id_out = Array();
		this.m_oneshot = true;
		this.m_index = 0;
		this.m_check_admin = 0;
		this.m_ignore_preadmin = false;
		this.m_ignore_days = 3;
		this.m_is_ini = true;
		this.m_proxy_host = "";
		this.m_proxy_port = "";
		this.m_proxy_param = Array();
		this.m_sleep_change = 60 * 5;
		this.m_limit_change_all = 30;
		this.m_limit_change = 3;
		this.m_H_change = Array();
		this.m_A_change_error = Array();
		this.m_A_change_thru = Array();
		this.m_log_level_change = G_SCRIPT_DEBUG;
	}

	getProcname() {
		return "WEB\u5074\u30D7\u30ED\u30BB\u30B9\u7BA1\u7406\u30D7\u30ED\u30BB\u30B9(\u30C9\u30B3\u30E2\u5C02\u7528)";
	}

	commitArg(args) {
		if (!ProcessBase.commitArg(args)) return false;

		switch (args.key) {
			case "c":
				this.m_A_id_in = args.value.split(",");
				break;

			case "C":
				this.m_A_id_out = args.value.split(",");
				break;

			case "x":
				this.m_oneshot = args.value;
				break;

			case "X":
				this.m_index = args.value;
				break;

			case "s":
				this.m_ignore_preadmin = args.value;
				break;

			case "S":
				this.m_ignore_days = args.value;
				break;

			case "H":
				this.m_proxy_host = args.value;
				this.m_is_ini = false;
				break;

			case "P":
				this.m_proxy_port = args.value;
				this.m_is_ini = false;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessBase.getUsage();
		rval.push(["-c=clamp_id[,clamp_id ... ]", "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3059\u308B\u30AF\u30E9\u30F3\u30D7ID(\u3059\u3079\u3066)"]);
		rval.push(["-C=clamp_id[,clamp_id ... ]", "\u9664\u5916\u3059\u308B\u30AF\u30E9\u30F3\u30D7ID(\u7121\u3057)"]);
		rval.push(["-x={0|1}", "\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u306E\u9593\u306F\u52D5\u4F5C\u3057\u7D9A\u3051\u308B\u304B(0)"]);
		rval.push(["-X=0...", "\u30D7\u30ED\u30BB\u30B9\u756A\u53F7(0)"]);
		rval.push(["-s={0|1}", "\u7BA1\u7406\u7528DL\u304C\u307E\u3060\u3067\u3082DL\u3059\u308B\u306A\u30891(0)"]);
		rval.push(["-S=0,1,2,3...", "\u4F55\u65E5\u9593DL\u304C\u7121\u3051\u308C\u3070\u30ED\u30B0\u30A4\u30F3\u3092\u4E2D\u6B62\u3059\u308B\u304B/0\u306A\u3089\u5E38\u306B\u30ED\u30B0\u30A4\u30F3(3)"]);
		rval.push(["-H=addr", "\u30D7\u30ED\u30AD\u30B7\u306E\u30A2\u30C9\u30EC\u30B9(common.ini\u306E\u5024\u3092\u4F7F\u7528)"]);
		rval.push(["-P=port", "\u30D7\u30ED\u30AD\u30B7\u306E\u30DD\u30FC\u30C8(common.ini\u306E\u5024\u3092\u4F7F\u7528)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessBase.getManual();
		rval += "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3059\u308B\u30AF\u30E9\u30F3\u30D7ID:";
		if (this.m_A_id_in.length) rval += this.m_A_id_in.join(",");else rval += "\u3059\u3079\u3066";
		rval += "\n";
		rval += "\u9664\u5916\u3059\u308B\u30AF\u30E9\u30F3\u30D7ID:";
		if (this.m_A_id_out.length) rval += this.m_A_id_out.join(",");else rval += "\u7121\u3057";
		rval += "\n";
		if (this.m_oneshot) rval += "\u4E00\u56DE\u3060\u3051\u5B9F\u884C\n";else rval += "\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u306E\u9593\u306F\u52D5\u4F5C\u3057\u7D9A\u3051\u308B\n";
		rval += "\u30D7\u30ED\u30BB\u30B9\u756A\u53F7:" + this.m_index + "\n";
		rval += (this.m_ignore_preadmin ? "\u7BA1\u7406\u7528DL\u304C\u307E\u3060\u3067\u3082DL\u3059\u308B" : "\u7BA1\u7406\u7528DL\u304C\u307E\u3060\u306A\u3089DL\u3057\u306A\u3044") + "\n";
		if (this.m_ignore_days <= 0) rval += "\u6700\u7D42DL\u65E5\u306B\u304B\u304B\u308F\u3089\u305A\u5E38\u306B\u30ED\u30B0\u30A4\u30F3\u3059\u308B" + "\n";else rval += "\u6700\u7D42DL\u65E5\u304B\u3089" + this.m_ignore_days + "\u65E5\u305F\u3063\u305F\u3089\u30ED\u30B0\u30A4\u30F3\u3057\u306A\u3044" + "\n";

		if (this.m_is_ini) {
			rval += "\u30D7\u30ED\u30AD\u30B7\u306Fcommon.ini\u304B\u3089\u8AAD\u307F\u51FA\u3059\n";
		} else {
			if (this.m_proxy_host.length && this.m_proxy_port.length) {
				rval += "\u30D7\u30ED\u30AD\u30B7\u306F" + this.m_proxy_host + ":" + this.m_proxy_port + "\n";
			} else {
				rval += "\u30D7\u30ED\u30AD\u30B7\u306F\u4F7F\u7528\u3057\u306A\u3044\n";
			}
		}

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

	end(status) //基底型の同名メソッドを呼び出す
	{
		if (!super.end(status)) return false;

		if (this.m_A_change_error.length) {
			var msg = "\u30B5\u30A4\u30C8\u69CB\u6210\u5909\u66F4\u306B\u3088\u308A\u30D5\u30A1\u30A4\u30EB\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u306B\u5931\u6557";
			msg += "/clampid:=" + this.m_A_change_error.join(",");
			this.putError(G_SCRIPT_WARNING, msg);
		}

		if (this.m_A_change_thru.length) {
			msg = "\u30B5\u30A4\u30C8\u69CB\u6210\u5909\u66F4\u3092\u691C\u51FA\u3057\u305F\u304C\u3001\u518D\u8A66\u884C\u3067\u6210\u529F";
			msg += "(\u7279\u5225\u306A\u51E6\u7406\u306F\u4E0D\u8981)";
			msg += "/clampid:=" + this.m_A_change_thru.join(",");
			this.putError(this.m_log_level_change, msg);
		}

		return true;
	}

	do_execute() //実行中フラグをclampweb_function_tbに記入したらtrue
	//返値
	//管理者の試行を行ったらtrue
	//必要ならプロキシの設定を読み出す
	{
		var O_db = this.m_db_temp;
		var is_execute = false;
		var status = true;
		var is_try_admin = false;

		if (this.m_is_ini) //proxyユーザーの取得
			{
				var O_setting = new IniSettingType();
				O_setting.read("common.ini");
				this.m_proxy_host = O_setting.get("PROXY", "");
				this.m_proxy_port = O_setting.get("PROXY_PORT", "");
				var temp = O_setting.get("PROXY_USER", "");

				if (temp != "") {
					this.m_proxy_param.proxy_user = temp;
				}

				temp = O_setting.get("PROXY_PASSWORD", "");

				if (temp != "") {
					this.m_proxy_param.proxy_password = temp;
				}
			}

		var msg = "\u30D7\u30ED\u30AD\u30B7\u4F7F\u7528\u305B\u305A";

		if (this.m_proxy_host.length && this.m_proxy_port.length) {
			msg = "\u30D7\u30ED\u30AD\u30B7\u306F" + this.m_proxy_host + ":" + this.m_proxy_port;

			if (undefined !== this.m_proxy_param.proxy_user) {
				msg += ":" + this.m_proxy_param.proxy_user;
			}

			if (undefined !== this.m_proxy_param.proxy_password) {
				msg += ":" + this.m_proxy_param.proxy_password;
			}
		}

		this.putError(G_SCRIPT_DEBUG, msg);

		while (true) //ダウンロードを実行したらtrue
		//実行可能時間を超えていないか確認
		//ダウンロード処理
		{
			var is_empty = true;

			if (!this.isOpen()) {
				if (!is_execute) this.putError(G_SCRIPT_WARNING, "\u524D\u56DE\u5B9F\u884C\u3055\u308C\u305Fadmin_docomo_web\u304C\u7D42\u4E86\u3057\u3066\u3044\u306A\u304B\u3063\u305F\u306E\u3067" + "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u304C\u4E00\u5207\u884C\u3048\u306A\u304B\u3063\u305F");
				break;
			}

			this.beginDB();
			O_db.lock("clampweb_function_tb");
			var sql = "select command from clampweb_function_tb;";
			var result = O_db.getAll(sql);
			var is_stop = false;
			var is_run = false;
			var is_reset = false;

			for (var A_line of Object.values(result)) {
				if (!strcmp("stop", A_line[0])) is_stop = true;
				if (!strcmp("run" + this.m_index, A_line[0])) is_run = true;
				if (!strcmp("reset", A_line[0])) is_reset = true;
			}

			if (is_stop) //停止指示があるのでループを抜ける
				{
					this.endDB(true);
					this.putError(G_SCRIPT_INFO, "\u7D42\u4E86\u6307\u793A\u53D7\u9818");
					break;
				}

			if (is_execute) this.endDB(true);else {
				if (is_run) {
					this.endDB(true);
					sleep(SLEEP_SEC);
					continue;
				} else //実行中フラグをclampweb_function_tbに追加する
					{
						sql = "insert into clampweb_function_tb" + "(command,fixdate)" + "values(" + "'run" + this.m_index + "'" + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
						this.putError(G_SCRIPT_SQL, sql);
						O_db.query(sql);
						this.endDB(true);
						is_execute = true;
					}
			}

			if (!this.download(O_db, is_reset, is_try_admin, is_empty)) {
				status = false;
				break;
			}

			if (is_empty && this.m_oneshot) break;
		}

		if (is_execute) //実行中フラグをclampweb_function_tbから削除する
			{
				this.beginDB();
				O_db.lock("clampweb_function_tb");
				sql = "delete from clampweb_function_tb" + " where command='run" + this.m_index + "'" + ";";
				this.putError(G_SCRIPT_SQL, sql);
				O_db.query(sql);
				this.endDB(true);
			}

		return status;
	}

	download(O_db, is_reset, is_try_admin, is_empty) //試行期間切り替え
	//{fname}[year][month][type][fidx]
	//DL管理用ならtrue
	//日次ダウンロードをおこなうならtrue
	{
		if (is_reset) {
			this.lockWeb(O_db, "lock_admin_docomo_web" + this.m_index);
			this.beginDB();
			var status = this.reset(O_db, is_try_admin);
			this.endDB(status);
			this.unlockWeb(O_db);
			if (!status) return false;
		}

		var id = "";
		var password = "";
		var cookie1 = "";
		var pin = "";
		var is_hotline = false;
		var A_info = Array();
		this.lockWeb(O_db, "lock_admin_docomo_web" + this.m_index);
		this.beginDB();
		var is_admin = false;
		var is_daily = false;
		status = this.findId(O_db, is_try_admin, id, password, cookie1, pin, is_hotline, is_admin, is_daily, A_info);
		var A_info_orig = A_info;
		this.endDB(status);
		this.unlockWeb(O_db);
		if (!status) return false;

		if (!id.length) //ダウンロード可能なアカウントが残っていないので待機して戻る
			{
				if (!this.m_oneshot) sleep(SLEEP_SEC);
				return true;
			}

		for (var cnt = 0; cnt <= this.m_limit_change; ++cnt) //毎時56分から後なら待機する(以前は57分だった)
		//ダウンロード実行
		//使わなくなっている
		//ログインが割り込まれたらtrueになる
		//ログインに失敗したらtrueになる
		//サイト構成変更ならtrueになる
		//申込が不十分ならtrueになる
		//二段階認証が有効だが端末登録がまだならtrueになる
		//二段階認証の端末が無効になったらtrueになる
		//ネットワーク暗証番号が不正ならtrueになる
		//IDがロックされていたらtrue
		//日次ダウンロードしたファイル
		//サイト構成変更を検出していないか上限に達したので、ループを抜ける
		{
			while (56 <= date("i")) {
				sleep(10);
			}

			var is_login = false;
			var is_break = false;
			var is_fail = false;
			var is_change = false;
			var is_unfinished = false;
			var is_unregisted = false;
			var is_badcookie = false;
			var is_badpin = false;
			var is_lock = false;
			var A_daily = Array();
			A_info = A_info_orig;
			status = true;

			try {
				status = this.doDownload(O_db, id, password, cookie1, pin, is_hotline, A_info, is_login, is_break, is_fail, is_change, is_unfinished, is_unregisted, is_badcookie, is_badpin, is_daily, A_daily, is_lock, is_admin);
			} catch (e) {
				this.putError(G_SCRIPT_INFO, "\u4F8B\u5916\u767A\u751F(" + id + ")" + e.getMessage());
				is_change = true;
			}

			this.lockWeb(O_db, "lock_admin_docomo_web" + this.m_index);
			this.beginDB();
			var status2 = this.storeFile(O_db, is_try_admin, id, password, A_info, is_login, is_break, is_change, is_unfinished, is_unregisted, is_badcookie, is_badpin, is_admin, is_fail, is_daily, A_daily, is_lock);
			this.endDB(status2);
			this.unlockWeb(O_db);

			if (is_fail) //ログインに失敗した
				//何もせずに、ループを抜ける
				{} else if (is_unfinished || is_unregisted || is_badcookie || is_badpin) //申込が不十分か、端末登録がまだ
				//何もせずに、ループを抜ける
				{} else if (is_change) //サイト構成変更を検出した
				{
					if (!(undefined !== this.m_H_change[id])) this.m_H_change[id] = 0;
					this.m_H_change[id] = this.m_H_change[id] + 1;
					if (!(-1 !== this.m_A_change_error.indexOf(id))) this.m_A_change_error.push(id);

					if (this.m_H_change.length <= this.m_limit_change_all && this.m_H_change[id] <= this.m_limit_change) //上限に達していないので、スリープの後に再試行する
						{
							sleep(this.m_sleep_change);
							continue;
						}
				} else //サイト構成変更を検出しなかった
				{
					if (-1 !== this.m_A_change_error.indexOf(id)) //このIDで前回にサイト構成変更が起こっている
						{
							this.m_A_change_thru.push(id);
							var A_temp = Array();

							for (var eid of Object.values(this.m_A_change_error)) if (strcmp(id, eid)) A_temp.push(eid);

							this.m_A_change_error = A_temp;
						}
				}

			is_empty = false;
			status = status & status2;
			break;
		}

		return status;
	}

	reset(O_db, is_try_admin) //起動時にクランプIDが明示されたら何もしない
	//リセット指示を削除する
	//管理用ログインでのログイン結果を初期化する
	{
		if (this.m_A_id_in.length) return true;
		var sql = "update clampweb_index_tb set is_try=false";
		sql += ",fixdate='" + date("Y-m-d H:i:s") + "'";
		var in_out = this.getInOut();
		if (in_out.length) sql += " where " + in_out;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		O_db.query(sql);
		sql = "delete from clampweb_function_tb" + " where command='reset'" + ";";
		this.putError(G_SCRIPT_SQL, sql);
		O_db.query(sql);
		this.m_check_admin = 0;
		return true;
	}

	findId(O_db, is_try_admin, id, password, cookie1, pin, is_hotline, is_admin, is_daily, A_info) //clampweb_index_tbから、is_tryとis_runnningがfalseのidを一つ取り出す
	//ただし、clampweb_type_tbに、is_readyがfalseのレコードがある事
	//ただし、実行するクランプIDを指定した場合は、is_tryは見ない
	//ただし、日次ダウンロードする場合は、clampweb_type_tbを見ない
	//それ以外はクランプID順
	//clampweb_index_tbから、パスワードとis_hotlineとis_dailyを取り出す
	//ダウンロードが必要な年月・ファイル種別を取り出す
	//管理用アカウントでダウンロード済みの年月を取り出す
	//is_runningをtrueにする
	{
		var sql = "select index_tb.env as env" + ",index_tb.clampid as id" + ",index_tb.is_hotline" + ",(case when true=index_tb.is_admin then 1 else 0 end)";
		sql += " from clampweb_index_tb as index_tb";
		sql += " left join (";
		sql += " select env,pactid,detailno from clampweb_type_tb";
		sql += " where coalesce(is_ready,false)=false";
		sql += " and " + this.getYearMonth();
		sql += " group by env,pactid,detailno";
		sql += ") as type_tb";
		sql += " on index_tb.env=type_tb.env";
		sql += " and index_tb.pactid=type_tb.pactid";
		sql += " and index_tb.detailno=type_tb.detailno";
		sql += " where coalesce(is_running,false)=false";
		if (!this.m_A_id_in.length) sql += " and (coalesce(is_try,false)=false" + " or (coalesce(is_admin,false)=true and index_tb.detailno=0)" + " or coalesce(is_daily,false)=true)";
		if (is_try_admin) sql += " and (coalesce(is_admin,false)=false" + " or index_tb.detailno!=0)";
		sql += " and coalesce(is_fail,false)=false";
		sql += " and length(coalesce(index_tb.clampid,''))>0";
		sql += " and length(coalesce(index_tb.clamppassword,''))>0";
		sql += " and (type_tb.env is not null" + " or coalesce(is_daily,false)=true)";
		var in_out = this.getInOut("index_tb");
		if (in_out.length) sql += " and " + in_out;
		sql += " group by index_tb.env,index_tb.clampid" + ",index_tb.is_hotline,index_tb.is_admin";
		sql += " order by index_tb.env" + ",coalesce(index_tb.is_admin,false) desc" + ",coalesce(index_tb.is_hotline,false)" + ",index_tb.clampid";
		sql += " limit 1";
		sql += ";";
		var result = O_db.getAll(sql);
		if (0 == result.length || 0 == result[0][1].length) return true;
		id = result[0][1];
		is_admin = result[0][3];
		sql = "select clamppassword";
		sql += ",(case when coalesce(is_hotline,false)=true then 1 else 0 end)";
		sql += ",(case when coalesce(is_daily,false)=true then 1 else 0 end)";
		sql += ",coalesce(cookie1,'') as cookie1";
		sql += ",coalesce(pin,'') as pin";
		sql += " from clampweb_index_tb";
		sql += " where clampid='" + this.m_db.escape(id) + "'";
		if (!this.m_A_id_in.length) sql += " and (coalesce(is_try,false)=false" + " or coalesce(is_admin,false)=true" + " or coalesce(is_daily,false)=true)";
		sql += " and coalesce(is_running,false)=false";
		sql += " and coalesce(is_fail,false)=false";
		sql += " and length(coalesce(clampid,''))>0";
		sql += " and length(coalesce(clamppassword,''))>0";
		sql += ";";
		result = O_db.getAll(sql);
		password = "";
		cookie1 = "";
		pin = "";
		is_hotline = false;
		is_daily = false;

		for (var A_line of Object.values(result)) {
			if (password.length && strcmp(password, A_line[0])) this.putError(G_SCRIPT_WARNING, "\u30AF\u30E9\u30F3\u30D7\u30D1\u30B9\u30EF\u30FC\u30C9\u6DF7\u5728(\u51E6\u7406\u7D9A\u884C)" + id);
			password = A_line[0];
			if (cookie1.length && strcmp(cookie1, A_line[3])) this.putError(G_SCRIPT_WARNING, "\u4E8C\u6BB5\u968E\u8A8D\u8A3C\u30AF\u30C3\u30AD\u30FC\u6DF7\u5728(\u51E6\u7406\u7D9A\u884C)" + id);
			cookie1 = A_line[3];
			if (pin.length && strcmp(pin, A_line[4])) this.putError(G_SCRIPT_WARNING, "\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u6DF7\u5728(\u51E6\u7406\u7D9A\u884C)", id);
			pin = A_line[4];
			is_hotline = is_hotline || A_line[1];
			is_daily = is_daily || A_line[2];
		}

		A_info = Array();
		sql = "select type_tb.year,type_tb.month,type_tb.type";
		sql += " from clampweb_type_tb as type_tb";
		sql += " left join clampweb_index_tb as index_tb";
		sql += " on type_tb.env=index_tb.env";
		sql += " and type_tb.pactid=index_tb.pactid";
		sql += " and type_tb.detailno=index_tb.detailno";
		sql += " left join clampweb_ready_tb as ready_tb";
		sql += " on type_tb.env=ready_tb.env";
		sql += " and type_tb.pactid=ready_tb.pactid";
		sql += " and type_tb.detailno=ready_tb.detailno";
		sql += " and type_tb.year=ready_tb.year";
		sql += " and type_tb.month=ready_tb.month";
		sql += " where index_tb.clampid='" + O_db.escape(id) + "'";
		sql += " and coalesce(type_tb.is_ready,false)=false";
		sql += " and " + this.getYearMonth("type_tb");

		if (0 < this.m_ignore_days && !is_admin) //最後のDLから指定日数が経過したらDLしない
			{
				sql += " and '" + date("Y-m-d H:i:s") + "'<=(" + "coalesce(ready_tb.dldate,'" + date("Y-m-d H:i:s") + "') + '" + this.m_ignore_days + " days'" + ")";
			}

		sql += " group by type_tb.year,type_tb.month,type_tb.type";
		sql += " order by type_tb.year,type_tb.month,type_tb.type";
		sql += ";";
		result = O_db.getAll(sql);
		var A_admin_ym = Array();
		if (!this.getReqYM(O_db, id, A_admin_ym, is_admin)) return false;

		for (var H_line of Object.values(result)) {
			var year = H_line[0];
			var month = H_line[1];
			var type = H_line[2];

			if (!is_admin && !this.m_ignore_preadmin) //管理用でDLできていない年月はDLしない
				{
					var is_ready = false;

					for (var H_line of Object.values(A_admin_ym)) {
						if (H_line.year == year && H_line.month == month) {
							is_ready = true;
							break;
						}
					}

					if (!is_ready) continue;
				}

			if (!(undefined !== A_info[year])) A_info[year] = Array();
			if (!(undefined !== A_info[year][month])) A_info[year][month] = Array();
			if (!(undefined !== A_info[year][month][type])) A_info[year][month][type] = Array();
		}

		sql = "update clampweb_index_tb set is_running=true";
		sql += ",fixdate='" + date("Y-m-d H:i:s") + "'";
		sql += " where clampid='" + O_db.escape(id) + "'";
		sql += " and clamppassword='" + O_db.escape(password) + "'";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		O_db.query(sql);
		return true;
	}

	doDownload(O_db, id, password, cookie1, pin, is_hotline, A_info, is_login, is_break, is_fail, is_change, is_unfinished, is_unregisted, is_badcookie, is_badpin, is_daily, A_daily, is_lock, is_admin) //ダウンロードすべきファイルがなければ正常終了
	//最終ログイン日時を記録する
	//情報料以外と情報料と請求書情報で三回ループする
	//is_dailyなら請求内訳と料金明細を追加
	{
		__write_log("\n" + date("Y-m-d H:i:s"));

		__write_log("\tid=" + id);

		is_break = false;
		is_change = false;
		is_unfinished = false;
		is_unregisted = false;
		is_badcookie = false;
		is_badpin = false;
		if (!A_info.length && !is_daily) return true;
		this.putError(G_SCRIPT_DEBUG, "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u51E6\u7406\u958B\u59CB:" + id + "/" + (is_hotline ? "H" : "V"));
		this.putError(G_SCRIPT_DEBUG, "\u30E1\u30E2\u30EA\u4F7F\u7528\u91CF" + memory_get_usage());
		var O_clamp = new download_docomo_type(this.m_listener, this.m_proxy_host, this.m_proxy_port, this.m_proxy_param);
		var login_status = O_clamp.login(id, password, cookie1, pin);
		is_lock = 5 == login_status;

		if (6 == login_status) //申込が不十分
			{
				is_unfinished = true;
				return true;
			}

		if (7 == login_status) //端末登録がまだ
			{
				is_unregisted = true;
				return true;
			}

		if (8 == login_status) //端末登録が無効になった
			{
				is_badcookie = true;
				return true;
			}

		if (2 == login_status) //ログインが割り込まれた
			{
				is_break = true;
				return true;
			}

		if (4 == login_status || 3 == login_status || login_status && is_admin) //ログイン中にHTTPS通信が切断された
			{
				is_change = true;
				return true;
			}

		if (0 != login_status) {
			this.putError(G_SCRIPT_INFO, "\u30ED\u30B0\u30A4\u30F3\u5931\u6557" + login_status + "/\u5FA9\u5E30\u52D5\u4F5C\u958B\u59CB" + id);
			delete O_clamp;
			return this.recover(O_db, id, password, is_hotline, is_fail, login_status);
		}

		this.putError(G_SCRIPT_INFO, "\u30ED\u30B0\u30A4\u30F3\u6210\u529F" + id);
		is_login = true;
		var sql = "delete from clampweb_login_tb" + " where clampid='" + O_db.escape(id) + "'" + ";";
		this.putError(G_SCRIPT_SQL, sql);
		O_db.query(sql);
		sql = "insert into clampweb_login_tb" + "(clampid,fixdate)values('" + O_db.escape(id) + "'" + ",'" + date("Y-m-d H:i:s") + "')" + ";";
		this.putError(G_SCRIPT_SQL, sql);
		O_db.query(sql);

		for (var cnt = 0; cnt < 3; ++cnt) //情報料ならダウンロードの準備をする
		{
			var is_details = 0 == cnt;
			var is_info = 1 == cnt;
			var is_bill = 2 == cnt;

			if (is_info) {
				if (4 == O_clamp.prepare_info()) //ネットワーク暗証番号不正
					{
						is_badpin = true;
						return true;
					}
			}

			if (is_bill) O_clamp.prepare_bill();

			for (var year in A_info) {
				var A_month = A_info[year];

				for (var month in A_month) //2007年7月より古いデータは処理しない
				{
					var A_type = A_month[month];
					if (year < 2007 || 2007 == year && month < 7) continue;
					if (is_details) O_clamp.prepare_details();

					for (var type in A_type) //情報料以外か情報料に応じてスキップする
					{
						var dummy = A_type[type];

						if (is_details) {
							if (!(-1 !== O_clamp.get_type_details().indexOf(type)) && !(-1 !== O_clamp.get_type_comm().indexOf(type))) continue;
						} else if (is_info) {
							if (!(-1 !== O_clamp.get_type_info().indexOf(type))) continue;
						} else if (is_bill) {
							if (!(-1 !== O_clamp.get_type_bill().indexOf(type))) continue;
						}

						var tempdir = this.m_listener_process.m_path;
						if ("/" != tempdir[tempdir.length - 1]) tempdir += "/";
						var tgtname = tempdir + this.m_index + "_" + id + "_" + sprintf("%04d%02d", year, month) + type + "%02d.cla";
						var A_files = Array();
						var rval = O_clamp.get_file(A_files, year, month, type, tgtname, tempdir);

						if (4 == rval) //ネットワーク暗証番号不正
							{
								is_badpin = true;
								return true;
							} else if (3 == rval) //サイト構成変更?
							{
								is_change = true;
							} else if (2 == rval) //ログインが割り込まれた
							{
								is_break = true;
							}

						for (var fname of Object.values(A_files)) {
							if (!this.processGzip(fname, true)) {
								this.putError(G_SCRIPT_ERROR, `GZIP圧縮失敗${fname}`);
								delete O_clamp;
								return false;
							}

							A_info[year][month][type].push(fname + ".gz");
						}

						if (is_break || is_change) {
							delete O_clamp;
							return true;
						}
					}
				}
			}
		}

		if (is_daily) //wayが0なら請求内訳,1なら料金明細
			{
				for (var way = 0; way < 2; ++way) //ダウンロード可能な年月を取り出す
				{
					var A_type = way ? O_clamp.get_type_daily() : O_clamp.get_type_p();
					var A_A_ym = Array();

					if (way) {
						if (4 == O_clamp.prepare_daily(A_A_ym)) //ネットワーク暗証番号不正
							{
								is_badpin = true;
								return true;
							}
					} else {
						O_clamp.prepare_p(A_A_ym);
					}

					if (!A_A_ym.length) {
						this.putError(G_SCRIPT_INFO, "\u65E5\u6B21\u60C5\u5831" + (way ? "\u6599\u91D1\u660E\u7D30" : "\u8ACB\u6C42\u5185\u8A33") + "\u5E74\u6708\u7121\u3057" + id);
					} else //最新のデータを取り出す
						{
							var A_ym = A_A_ym[A_A_ym.length - 1];
							var year = A_ym.year;
							var month = A_ym.month;

							for (var type of Object.values(A_type)) {
								tempdir = this.m_listener_process.m_path;
								if ("/" != tempdir[tempdir.length - 1]) tempdir += "/";
								tgtname = tempdir + this.m_index + "_" + id + "_" + sprintf("%04d%02d", year, month) + type + "%02d.cla";
								A_files = Array();
								rval = O_clamp.get_file(A_files, year, month, type, tgtname, tempdir);

								if (4 == rval) //ネットワーク暗証番号不正
									{
										is_badpin = true;
										return true;
									} else if (3 == rval) //サイト構成変更?
									{
										is_change = true;
									} else if (2 == rval) //ログインが割り込まれた
									{
										is_break = true;
									}

								var A_gz = Array();

								for (var fname of Object.values(A_files)) {
									if (!this.processGzip(fname, true)) {
										this.putError(G_SCRIPT_ERROR, `GZIP圧縮失敗${fname}`);
										delete O_clamp;
										return false;
									}

									A_gz.push(fname + ".gz");
								}

								var A_item = {
									year: year,
									month: month,
									type: type,
									fname: A_gz
								};
								A_daily.push(A_item);

								if (is_break || is_change) {
									delete O_clamp;
									return true;
								}
							}
						}
				}
			}

		delete O_clamp;
		return true;
	}

	getReqYM(O_db, id, A_ym, is_admin) //管理用なら、すべてログインさせる
	//clampweb_ready_tbから、管理用IDのレコードを取り出す
	{
		A_ym = Array();

		if (is_admin) {
			return true;
		}

		var sql = "select index_tb.clampid";
		sql += " from clampweb_index_tb as index_tb";
		sql += " where coalesce(index_tb.is_admin,false)=true";
		sql += " and length(coalesce(index_tb.clampid,''))>0";
		sql += " and length(coalesce(index_tb.clamppassword,''))>0";
		sql += " order by detailno";
		sql += " limit 1";
		sql += ";";
		var result = O_db.getAll(sql);

		if (0 == result.length) {
			this.putError(G_SCRIPT_WARNING, "\u30ED\u30B0\u30A4\u30F3\u691C\u67FB\u7528\u30A2\u30AB\u30A6\u30F3\u30C8\u304C\u5B58\u5728\u3057\u306A\u3044");
			return true;
		}

		var admin_id = result[0][0];
		sql = "select ready_tb.year,ready_tb.month";
		sql += " from clampweb_index_tb as index_tb";
		sql += " left join clampweb_ready_tb as ready_tb";
		sql += " on index_tb.env=ready_tb.env";
		sql += " and index_tb.pactid=ready_tb.pactid";
		sql += " and index_tb.detailno=ready_tb.detailno";
		sql += " where index_tb.clampid='" + O_db.escape(admin_id) + "'";
		sql += " and ready_tb.dldate is not null";
		sql += " group by ready_tb.year,ready_tb.month";
		sql += " order by ready_tb.year,ready_tb.month";
		sql += ";";
		result = O_db.getAll(sql);

		for (var A_line of Object.values(result)) {
			var year = A_line[0];
			var month = A_line[1];
			A_ym.push({
				year: year,
				month: month
			});
		}

		return true;
	}

	recover(O_db, id, password, is_hotline, is_fail, login_status_orig) {
		var login_fault = false;

		if (1 == this.m_check_admin) {
			login_fault = true;
		} else if (2 == this.m_check_admin) {
			login_fault = false;
		} else //検査用アカウントのIDとパスワードを取得
			//ここではclampweb_index_tbをロックしない
			//検査用アカウントでログイン
			{
				var sql = "select index_tb.clampid,index_tb.clamppassword,index_tb.cookie1,pin";
				sql += " from clampweb_index_tb as index_tb";
				sql += " where coalesce(index_tb.is_admin,false)=true";
				sql += " and length(coalesce(index_tb.clampid,''))>0";
				sql += " and length(coalesce(index_tb.clamppassword,''))>0";
				sql += " order by detailno";
				sql += " limit 1";
				sql += ";";
				var result = O_db.getAll(sql);

				if (0 == result.length) {
					this.putError(G_SCRIPT_WARNING, "\u30ED\u30B0\u30A4\u30F3\u691C\u67FB\u7528\u30A2\u30AB\u30A6\u30F3\u30C8\u304C\u5B58\u5728\u3057\u306A\u3044");
					login_fault = true;
				}

				var admin_id = result[0][0];
				var admin_password = result[0][1];
				var admin_cookie1 = result[0][2];
				var admin_pin = result[0][3];

				if (!login_fault) {
					try {
						var O_clamp = new download_docomo_type(this.m_listener, this.m_proxy_host, this.m_proxy_port, this.m_proxy_param);
						var login_status = O_clamp.login(admin_id, admin_password, admin_cookie1, admin_pin);
						delete O_clamp;
					} catch (e) {
						login_status = 4;
					}

					if (0 != login_status) {
						this.putError(G_SCRIPT_WARNING, "\u30ED\u30B0\u30A4\u30F3\u691C\u67FB\u7528\u30A2\u30AB\u30A6\u30F3\u30C8\u3067\u306E\u30ED\u30B0\u30A4\u30F3\u304C\u3067\u304D\u306A\u304B\u3063\u305F/" + "\u30AF\u30E9\u30F3\u30D7\u30B5\u30A4\u30C8\u304C\u4F5C\u696D\u4E2D\u306E\u53EF\u80FD\u6027" + admin_id);
						login_fault = true;
					}
				}

				this.m_check_admin = login_fault ? 1 : 2;
			}

		if (login_fault) {
			this.lockWeb(O_db, "lock_admin_docomo_web" + this.m_index);
			this.beginDB();
			sql = "update clampweb_index_tb set is_try=true";
			sql += ",fixdate='" + date("Y-m-d H:i:s") + "'";
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			O_db.query(sql);
			this.endDB(true);
			this.unlockWeb(O_db);
			return false;
		} else //ホットライン・V2とも、error_tbにメッセージ追加
			//警告メールにメッセージ出力
			//ログイン失敗フラグを立てる
			{
				this.beginDB();
				sql = "select env,pactid from clampweb_index_tb" + " where clampid='" + O_db.escape(id) + "'" + " group by env,pactid" + ";";
				result = O_db.getAll(sql);

				if (0 == result.length) {
					this.putError(G_SCRIPT_WARNING, `ホットライン型顧客のエラー出力先が確定できず/${id}`);
				} else {
					O_db.lock("clampweb_error_tb");

					for (var A_line of Object.values(result)) {
						var env = A_line[0];
						var pactid = A_line[1];
						var message = "login";
						sql = "insert into clampweb_error_tb" + "(env,pactid,carid,message,fixdate)" + "values(" + env + "," + pactid + "," + G_CARRIER_DOCOMO + ",'" + O_db.escape(message) + "'" + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
						this.putError(G_SCRIPT_SQL, sql);
						O_db.query(sql);
					}
				}

				this.endDB(true);
				sql = "select env,pactid,compname from clampweb_index_tb";
				sql += " where clampid='" + O_db.escape(id) + "'";
				sql += " group by env,pactid,compname";
				sql += ";";
				result = O_db.getAll(sql);
				var msg = `ログイン失敗/${id}`;
				if (5 == login_status_orig) msg = `IDがロックされていたためログイン失敗/${id}`;else if (1 == login_status_orig) msg = `ID・パスワードが違うためログイン失敗/${id}`;

				for (var A_line of Object.values(result)) {
					msg += "/" + A_line[2] + "(" + A_line[0] + ":" + A_line[1] + ")";
				}

				var status = G_SCRIPT_INFO;
				if (5 == login_status_orig || 3 == login_status_orig) status = G_SCRIPT_WARNING;
				this.putError(status, msg);
				is_fail = true;
			}

		return true;
	}

	storeFile(O_db, is_try_admin, id, password, A_info, is_login, is_break, is_change, is_unfinished, is_unregisted, is_badcookie, is_badpin, is_admin, is_fail, is_daily, A_daily, is_lock) //ダウンロードが必要な環境・年月・ファイル種別を取得
	//必要なものだけを格納
	//一個でもファイルをインポートしたらtrue
	//すべてのファイルを削除
	//管理用を試行したらフラグを立てる
	{
		var sqlym = this.getYearMonth();
		var sql = "select type_tb.env,type_tb.pactid,type_tb.detailno";
		sql += ",type_tb.year,type_tb.month,type_tb.type";
		sql += " from clampweb_type_tb as type_tb";
		sql += " left join clampweb_index_tb as index_tb";
		sql += " on type_tb.env=index_tb.env";
		sql += " and type_tb.pactid=index_tb.pactid";
		sql += " and type_tb.detailno=index_tb.detailno";
		sql += " where index_tb.clampid='" + O_db.escape(id) + "'";
		sql += " and coalesce(type_tb.is_ready,false)=false";
		sql += " and " + sqlym;
		sql += ";";
		var result = Array();

		if (is_break || is_change || is_unfinished || is_unregisted || is_badcookie || is_badpin) //ログインが割り込まれたか、サイト構成変更されたので、
			//ダウンロード済みのファイルは保存せずに削除する
			//ログインが割り込まれた場合は警告を出す
			{
				var errmsg = "";
				if (is_change) errmsg += "\u30B5\u30A4\u30C8\u69CB\u6210\u5909\u66F4";
				if (is_break) errmsg += "\u30ED\u30B0\u30A4\u30F3\u304C\u5272\u308A\u8FBC\u307E\u308C\u305F";
				if (is_unfinished) errmsg += "\u7533\u8FBC\u304C\u672A\u5B8C\u6210\u306A\u306E\u3067MyDocomo\u304B\u3089\u7533\u8FBC\u304C\u5FC5\u8981";
				if (is_unregisted) errmsg += "\u4E8C\u6BB5\u968E\u8A8D\u8A3C\u304C\u6709\u52B9\u3060\u304C\u7AEF\u672B\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044";
				if (is_badcookie) errmsg += "\u4E8C\u6BB5\u968E\u8A8D\u8A3C\u306E\u7AEF\u672B\u30AF\u30C3\u30AD\u30FC\u304C\u7121\u52B9\u306B\u306A\u3063\u305F(\u518D\u767B\u9332\u304C\u5FC5\u8981)";
				if (is_badpin) errmsg = "\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u304C\u4E0D\u6B63";
				errmsg += "/clampid:=" + id;
				sql = "select pactid from clampweb_index_tb";
				sql += " where clampid='" + O_db.escape(id) + "'";
				sql += " group by pactid";
				sql += " order by pactid";
				sql += ";";
				var A_pactid = O_db.getHash(sql);

				for (var H_pactid of Object.values(A_pactid)) errmsg += "/pactid:=" + H_pactid.pactid;

				if (is_break || is_unfinished || is_unregisted || is_badcookie || is_badpin) this.putError(G_SCRIPT_WARNING, errmsg);
			} else {
			result = O_db.getAll(sql);
		}

		var is_in_all = false;

		for (var A_line of Object.values(result)) {
			var env = A_line[0];
			var pactid = A_line[1];
			var detailno = A_line[2];
			var year = A_line[3];
			var month = A_line[4];
			var type = A_line[5];

			if (undefined !== A_info[year] && undefined !== A_info[year][month] && undefined !== A_info[year][month][type]) //一個でもファイルをインポートしたらtrue
				{
					var A_fname = A_info[year][month][type];
					if (0 == A_fname.length) continue;
					var is_in = false;
					var fidx = 0;

					for (var fname of Object.values(A_fname)) //ファイルをインポート
					{
						var fid = O_db.loImport(fname);

						if (!fid.length) {
							this.putError(G_SCRIPT_ERROR, "loImport");
							return false;
						}

						sql = "insert into clampweb_details_tb" + "(env,pactid,detailno,year," + "month,type,idx,fid,fixdate)" + "values(" + env + "," + pactid + "," + detailno + "," + year + "," + month + ",'" + O_db.escape(type) + "'" + "," + fidx + "," + fid + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
						this.putError(G_SCRIPT_SQL, sql);
						O_db.query(sql);
						++fidx;
						is_in = true;
						is_in_all = true;
					}

					if (is_in) //clampweb_type_tbのis_readyをtrueに設定
						//clampweb_ready_tbのdldateを更新
						{
							sql = "update clampweb_type_tb set is_ready=true";
							sql += ",fixdate='" + date("Y-m-d H:i:s") + "'";
							sql += " where env=" + env;
							sql += " and pactid=" + pactid;
							sql += " and detailno=" + detailno;
							sql += " and year=" + year;
							sql += " and month=" + month;
							sql += " and type='" + O_db.escape(type) + "'";
							sql += ";";
							this.putError(G_SCRIPT_SQL, sql);
							O_db.query(sql);
							sql = "select count(*) from clampweb_ready_tb";
							sql += " where env=" + env;
							sql += " and pactid=" + pactid;
							sql += " and detailno=" + detailno;
							sql += " and year=" + year;
							sql += " and month=" + month;
							sql += ";";

							if (0 < O_db.getOne(sql)) //更新
								{
									sql = "update clampweb_ready_tb";
									sql += " set dldate='" + date("Y-m-d H:i:s") + "'";
									sql += " ,fixdate='" + date("Y-m-d H:i:s") + "'";
									sql += " where env=" + env;
									sql += " and pactid=" + pactid;
									sql += " and detailno=" + detailno;
									sql += " and year=" + year;
									sql += " and month=" + month;
									sql += ";";
									this.putError(G_SCRIPT_SQL, sql);
									O_db.query(sql);
								} else //追加
								{
									sql = "insert into clampweb_ready_tb";
									sql += "(env,pactid,detailno,year," + "month,dldate,fixdate)";
									sql += "values";
									sql += "(" + env;
									sql += "," + pactid;
									sql += "," + detailno;
									sql += "," + year;
									sql += "," + month;
									sql += ",'" + date("Y-m-d H:i:s") + "'";
									sql += ",'" + date("Y-m-d H:i:s") + "'";
									sql += ")";
									sql += ";";
									this.putError(G_SCRIPT_SQL, sql);
									O_db.query(sql);
								}
						}
				}
		}

		for (var year in A_info) {
			var A_month = A_info[year];

			for (var month in A_month) {
				var A_type = A_month[month];

				for (var type in A_type) {
					var A_fname = A_type[type];

					for (var fname of Object.values(A_fname)) {
						if (file_exists(fname)) {
							unlink(fname);
						} else {
							this.putError(is_change || is_break || is_unfinished || is_unregisted || is_badcookie || is_badpin ? G_SCRIPT_BATCH : G_SCRIPT_WARNING, "\u524A\u9664\u3059\u308B\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u3089\u306A\u3044(\u51E6\u7406\u7D9A\u884C)" + fname);
						}
					}
				}
			}
		}

		if (is_daily && A_daily.length) //日次ファイルを保存する
			//保存が必要な環境・顧客ID・クランプ連番を取り出す
			//日次のgzファイルを削除する
			{
				sql = "select env,pactid,detailno from clampweb_index_tb";
				sql += " where clampid='" + O_db.escape(id) + "'";
				sql += " and coalesce(is_daily,false)=true";
				sql += ";";

				if (is_break || is_change || is_unfinished || is_unregisted || is_badcookie || is_badpin) //ログインが割り込まれたかサイト構成変更を検出したので保存しない
					{
						var A_pact = Array();
					} else {
					A_pact = O_db.getHash(sql);
				}

				for (var H_pact of Object.values(A_pact)) {
					for (var H_daily of Object.values(A_daily)) //clampweb_daily_tbから、同一年月種別のレコードを削除する
					//clampweb_daily_tbに、レコードを挿入する
					{
						sql = "select fid from clampweb_daily_tb";
						sql += " where env=" + H_pact.env;
						sql += " and pactid=" + H_pact.pactid;
						sql += " and detailno=" + H_pact.detailno;
						sql += " and year=" + H_daily.year;
						sql += " and month=" + H_daily.month;
						sql += " and type='" + O_db.escape(H_daily.type) + "'";
						sql += ";";
						var A_fid = O_db.getHash(sql);

						for (var H_fid of Object.values(A_fid)) //削除に失敗しても処理を続ける
						{
							O_db.loUnlink(H_fid.fid, false);
						}

						sql = "delete from clampweb_daily_tb";
						sql += " where env=" + H_pact.env;
						sql += " and pactid=" + H_pact.pactid;
						sql += " and detailno=" + H_pact.detailno;
						sql += " and year=" + H_daily.year;
						sql += " and month=" + H_daily.month;
						sql += " and type='" + O_db.escape(H_daily.type) + "'";
						sql += ";";
						this.putError(G_SCRIPT_SQL, sql);
						O_db.query(sql);
						var idx = 0;

						for (var fname of Object.values(H_daily.fname)) //ファイルをインポート
						{
							fid = O_db.loImport(fname);

							if (!fid.length) {
								this.putError(G_SCRIPT_ERROR, "loImport");
								return false;
							}

							sql = "insert into clampweb_daily_tb" + "(env,pactid,detailno,year," + "month,type,idx,fid,fixdate)" + "values(" + H_pact.env + "," + H_pact.pactid + "," + H_pact.detailno + "," + H_daily.year + "," + H_daily.month + ",'" + O_db.escape(H_daily.type) + "'" + "," + idx + "," + fid + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
							this.putError(G_SCRIPT_SQL, sql);
							O_db.query(sql);
							++idx;
							is_in_all = true;
						}
					}
				}

				for (var H_item of Object.values(A_daily)) {
					for (var fname of Object.values(H_item.fname)) {
						if (file_exists(fname)) {
							unlink(fname);
						} else {
							this.putError(is_change || is_break || is_unfinished || is_unregisted || is_badcookie || is_badpin ? G_SCRIPT_BATCH : G_SCRIPT_WARNING, "\u524A\u9664\u3059\u308B\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u3089\u306A\u3044(\u51E6\u7406\u7D9A\u884C)" + fname);
						}
					}
				}
			}

		sql = "update clampweb_index_tb set is_running=false";
		if (!this.m_A_id_in.length) sql += ",is_try=true";
		sql += ",is_fail=" + (is_fail && !is_lock ? "true" : "false");
		sql += ",fixdate='" + date("Y-m-d H:i:s") + "'";
		sql += " where clampid='" + O_db.escape(id) + "'";
		sql += " and clamppassword='" + O_db.escape(password) + "'";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		O_db.query(sql);
		if (is_admin) is_try_admin = true;

		if (is_admin && is_in_all) {
			sql = "update clampweb_index_tb set is_try=false";
			sql += ",fixdate='" + date("Y-m-d H:i:s") + "'";
			sql += " where clampid!='" + O_db.escape(id) + "'";
			sql += " and coalesce(is_admin,false)=false";
			sql += " and coalesce(is_running,false)=false";
			sql += " and coalesce(is_try,false)=true";
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			O_db.query(sql);
		}

		if (this.m_A_id_in.length || is_daily) this.m_A_id_out.push("" + id);
		return true;
	}

	getInOut(table_name = "") {
		var sql = "";
		var A_id = this.m_A_id_in;

		if (A_id.length) {
			if (table_name.length) sql += table_name + ".";
			sql += "clampid in (";

			for (var cnt = 0; cnt < A_id.length; ++cnt) {
				if (cnt) sql += ",";
				sql += "'" + this.m_db.escape(A_id[cnt]) + "'";
			}

			sql += ")";
		}

		A_id = this.m_A_id_out;

		if (A_id.length) {
			if (sql.length) sql += " and ";
			if (table_name.length) sql += table_name + ".";
			sql += "clampid not in (";

			for (cnt = 0;; cnt < A_id.length; ++cnt) {
				if (cnt) sql += ",";
				sql += "'" + this.m_db.escape(A_id[cnt]) + "'";
			}

			sql += ")";
		}

		return sql;
	}

	getYearMonth(table_name = "") {
		if (table_name.length) table_name = table_name + ".";
		var year = date("Y");
		var month = date("m");
		var sqlym = "";

		for (var cnt = 0; cnt < 4; ++cnt) {
			if (sqlym.length) sqlym += " or";
			sqlym += " (" + table_name + "year=" + year + " and " + table_name + "month=" + month + ")";
			--month;

			if (0 == month) {
				month = 12;
				--year;
			}
		}

		sqlym = "(" + sqlym + ")";
		return sqlym;
	}

};

checkClient(G_CLIENT_BOTH);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_WEB) log = G_LOG_ADMIN_DOCOMO_WEB;
var proc = new ProcessAdminDocomoWeb(G_PROCNAME_ADMIN_DOCOMO_WEB, log, G_OPENTIME_ADMIN_DOCOMO_WEB);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);