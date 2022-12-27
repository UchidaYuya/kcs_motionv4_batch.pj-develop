//===========================================================================
//機能：クランプダウンロードリスト作成プロセス(ドコモ専用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//クランプ日次ダウンロードの権限番号
//---------------------------------------------------------------------------
//機能：クランプダウンロードリスト作成プロセス(ドコモ専用)
error_reporting(E_ALL);

require("lib/process_base.php");

const G_PROCNAME_REGIST_CLAMP_DOCOMO = "regist_clamp_docomo";
const G_OPENTIME_REGIST_CLAMP_DOCOMO = "0000,2400";
const FNCID_CLAMP_DAILY = 87;

//一時DBの接続用
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：処理の前に呼ばれる
//返値：深刻なエラーが発生したらfalseを返す
//機能：処理の後に呼ばれる
//引数：do_executeの実行ステータス
//返値：深刻なエラーが発生したらfalseを返す
//機能：DBのセッションを開始する
//返値：深刻なエラーが発生したらfalseを返す
//機能：DBのセッションを終了する
//引数：commitするならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客ごとの処理(一ヶ月ごと)
//引数：顧客ID
//作業ファイル保存先
//ログインチェック用ならtrue
//日次ダウンロードをするならtrue
//ホットライン型顧客ならtrue
//clamp_tbの{id,passwd,detailno,login_status}[]
//処理する年
//処理する月
//当月を処理していたらtrue
//dbからwebへのコピーのみ実行するならtrue
//返値：深刻なエラーが発生したらfalseを返す
class ProcessRegistClampDocomo extends ProcessDefault {
	ProcessRegistClampDocomo(procname, logpath, opentime) //clampweb_function_tbがrunでないのにclampweb_index_tbがrunなら警告
	{
		this.ProcessDefault(procname, logpath, opentime);

		if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) {
			this.m_db_temp = new ScriptDB(this.m_listener, GLOBALS.G_dsn_temp);
		} else this.m_db_temp = this.m_db;

		var sql = "select count(*) from clampweb_function_tb";
		sql += " where command like '%run%'";
		sql += ";";

		if (0 == this.m_db_temp.getOne(sql)) {
			sql = "select count(*) from clampweb_index_tb";
			sql += " where coalesce(is_running,false)=true";
			sql += ";";

			if (0 < this.m_db_temp.getOne(sql)) {
				this.putError(G_SCRIPT_WARNING, "admin_docomo_web.php\u304C\u4E0D\u6B63\u7D42\u4E86\u5F8C\u306Bclear_clamptask.php\u3092" + "\u5B9F\u884C\u3057\u3066\u3044\u306A\u3044");
			}
		}

		this.m_is_skip_delflg = false;
	}

	getProcname() {
		return "\u30AF\u30E9\u30F3\u30D7\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30EA\u30B9\u30C8\u4F5C\u6210\u30D7\u30ED\u30BB\u30B9(\u30C9\u30B3\u30E2\u5C02\u7528)";
	}

	begin() {
		if (!ProcessDefault.begin()) return false;
		return this.lockWeb(this.m_db_temp, "lock_regist_" + G_CLAMP_ENV);
	}

	end(status) {
		if (!this.unlockWeb(this.m_db_temp)) return false;
		return ProcessDefault.end(status);
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

	executePactid(pactid, logpath) //顧客情報の取得
	//ログインチェック用ならtrue
	//日次ダウンロードするか
	//社名
	//ホットライン型顧客ならtrue
	//clamp_tbの{id,passwd,detailno,login_status}[]
	//クランプアカウントを持たないならclampweb_index_tbから削除する
	//年
	//月
	{
		var is_admin = G_CLAMP_ADMIN == pactid;
		var sql = "select count(*) from fnc_relation_tb where pactid=" + pactid + " and fncid=" + FNCID_CLAMP_DAILY + ";";
		var is_daily = 0 < this.m_db.getOne(sql);
		var compname = "";
		var is_hotline = false;
		sql = "select coalesce(type,'M'),compname from pact_tb";
		sql += " where pactid=" + pactid;
		sql += ";";
		var result = this.m_db.getAll(sql);

		if (result.length) {
			if (!strcmp("H", result[0][0])) is_hotline = true;
			compname = result[0][1];
		}

		var A_clamp = Array();
		sql = "select clampid,clamppasswd,detailno" + ",coalesce(login_status,0) as login_status" + ",coalesce(cookie1,'') as cookie1" + ",coalesce(pin,'') as pin";
		sql += " from clamp_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " and pactid not in(";
		sql += "select pactid from pact_tb";
		sql += " where delflg=true";
		sql += ")";
		sql += " order by detailno";
		sql += ";";
		result = this.m_db.getHash(sql);

		if (0 == result.length) {
			sql = "delete from clampweb_index_tb" + " where pactid=" + pactid;
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db_temp.query(sql);
			return true;
		}

		A_clamp = result;
		var year = this.m_year;
		var month = this.m_month;
		var limit = 4;

		for (var cnt = 0; cnt < limit; ++cnt) {
			--month;

			if (0 == month) {
				month = 12;
				--year;
			}
		}

		for (cnt = 0;; cnt < limit; ++cnt) {
			++month;

			if (13 == month) {
				month = 1;
				++year;
			}

			var cur_ym = month == this.m_month && year == this.m_year;
			var is_web_only = !cur_ym;
			if (is_hotline) is_web_only = false;
			if (!this.executePactid2(pactid, logpath, is_admin, is_daily, is_hotline, compname, A_clamp, year, month, cur_ym, is_web_only)) return false;
		}

		return true;
	}

	executePactid2(pactid, logpath, is_admin, is_daily, is_hotline, compname, A_clamp, year, month, cur_ym, is_web_only) //detailnoに対してループ
	{
		if (!is_web_only) //部署情報が無ければchangeover
			{
				var sql = "select count(*) from post_" + this.m_table_no.get(year, month) + "_tb where pactid=" + pactid + ";";

				if (0 == this.m_db.getOne(sql)) //changeover実行
					{
						var proc = new ScriptCommand(this.m_listener, false);
						var arg_changeover = [{
							key: "m",
							value: 0
						}, {
							key: "l",
							value: logpath
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
							key: "x",
							value: 0
						}];
						this.putError(G_SCRIPT_INFO, "changeover\u5B9F\u884C" + pactid + "/" + year + "/" + month);
						if (!proc.execute(G_PHP + " changeover.php", arg_changeover, Array())) return false;
						sleep(3);
					}
			}

		var A_type = G_CLAMP_DOCOMO_TEL_TYPE.split(",");
		var temp = G_CLAMP_DOCOMO_COMM_TYPE.split(",");

		for (var type of Object.values(temp)) A_type.push(type);

		temp = G_CLAMP_DOCOMO_INFO_TYPE.split(",");

		for (var type of Object.values(temp)) A_type.push(type);

		temp = G_CLAMP_DOCOMO_BILL_TYPE.split(",");

		for (var type of Object.values(temp)) A_type.push(type);

		for (var H_clamp of Object.values(A_clamp)) //dbからwebへのコピーのみ実行するなら、
		//db側テーブルへのレコードの追加は行わない
		//コピーが必要なファイル種別
		//当月なら、clampweb_index_tbへのコピー
		//clampdb_ready_tbとclampweb_read_tbからdldateが新しい方を取り出す
		//clampdb_type_tbのfixdateの方が新しければそちらにする
		//最新の日付があれば更新する
		{
			var id = H_clamp.clampid;
			var password = H_clamp.clamppasswd;
			var detailno = H_clamp.detailno;
			var login_status = H_clamp.login_status;
			var cookie1 = H_clamp.cookie1;
			var pin = H_clamp.pin;

			if (!is_web_only) //clampdb_index_tbへのダウンロードリストの作成
				{
					sql = "select count(*) from clampdb_index_tb" + " where pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + ";";

					if (0 == this.m_db.getOne(sql)) {
						sql = "insert into clampdb_index_tb" + "(pactid,detailno,year,month,fixdate)" + "values(" + pactid + "," + detailno + "," + year + "," + month + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
						this.putError(G_SCRIPT_SQL, sql);
						this.m_db.query(sql);
					}

					for (var type of Object.values(A_type)) //clampdb_type_tbへのダウンロードリストの作成
					{
						sql = "select count(*) from clampdb_type_tb" + " where pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + " and type='" + this.m_db.escape(type) + "'" + ";";

						if (0 == this.m_db.getOne(sql)) {
							sql = "insert into clampdb_type_tb" + "(pactid,detailno,year," + "month,type,is_ready,fixdate)" + "values(" + pactid + "," + detailno + "," + year + "," + month + ",'" + this.m_db.escape(type) + "'" + ",false" + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
							this.putError(G_SCRIPT_SQL, sql);
							this.m_db.query(sql);
						}
					}
				}

			sql = "select type from clampdb_type_tb" + " where pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + " and coalesce(is_ready,false)=false" + ";";
			var result = this.m_db.getAll(sql);
			var A_rectype = Array();

			for (var H_line of Object.values(result)) A_rectype.push(H_line[0]);

			if (cur_ym) {
				sql = "select clampid,clamppassword" + ",coalesce(cookie1,'') as cookie1" + ",coalesce(pin,'') as pin" + ",(case when coalesce(is_fail,false)=false then 0" + " else 1 end) as is_fail" + ",(case when coalesce(is_daily,false)=false then 0" + " else 1 end) as is_daily" + ",(case when coalesce(is_admin,false)=false then 0" + " else 1 end) as is_admin" + ",(case when coalesce(is_hotline,false)=false then 0" + " else 1 end) as is_hotline" + " from clampweb_index_tb" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid + " and detailno=" + detailno + ";";
				var A_result = this.m_db_temp.getHash(sql);

				if (0 == A_result.length) //レコードを追加する
					{
						sql = "insert into clampweb_index_tb" + "(env,pactid,detailno,cookie1,pin," + "is_hotline,is_admin,is_daily,compname" + ",clampid,clamppassword,is_try,is_running" + ",is_fail,fixdate)" + "values" + "(" + G_CLAMP_ENV + "," + pactid + "," + detailno + ",'" + this.m_db_temp.escape(cookie1) + "'" + ",'" + this.m_db_temp.escape(pin) + "'" + "," + (is_hotline ? "true" : "false") + "," + (is_admin ? "true" : "false") + "," + (is_daily ? "true" : "false") + ",'" + this.m_db_temp.escape(compname) + "'" + ",'" + this.m_db_temp.escape(id) + "'" + ",'" + this.m_db_temp.escape(password) + "'" + ",false,false" + "," + (2 == login_status ? "true" : "false") + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
						this.putError(G_SCRIPT_SQL, sql);
						this.m_db_temp.query(sql);
					} else {
					for (var H_result of Object.values(A_result)) {
						if (strcmp(H_result.clamppassword, password) || strcmp(H_result.clampid, id) || strcmp(H_result.cookie1, cookie1) || strcmp(H_result.pin, pin) || H_result.is_daily != (is_daily ? 1 : 0) || H_result.is_hotline != (is_hotline ? 1 : 0) || H_result.is_admin != (is_admin ? 1 : 0)) //IDかパスワードが違えば反映する
							{
								sql = "update clampweb_index_tb" + " set clamppassword='" + this.m_db_temp.escape(password) + "'" + ",clampid='" + this.m_db_temp.escape(id) + "'" + ",compname='" + this.m_db_temp.escape(compname) + "'" + ",cookie1='" + this.m_db_temp.escape(cookie1) + "'" + ",pin='" + this.m_db_temp.escape(pin) + "'" + ",is_hotline=" + (is_hotline ? "true" : "false") + ",is_admin=" + (is_admin ? "true" : "false") + ",is_daily=" + (is_daily ? "true" : "false") + ",fixdate='" + date("Y-m-d H:i:s") + "'" + ",is_fail=" + (2 == login_status ? "true" : "false") + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid + " and detailno=" + detailno + ";";
								this.putError(G_SCRIPT_SQL, sql);
								this.m_db_temp.query(sql);
							} else //IDとパスワードが同じなら、ログイン状態を統一する
							{
								if (0 == login_status) //DB側が未検証なので、
									//strage側の情報をDB側に反映する
									{
										sql = "update clamp_tb";
										sql += " set login_status=" + (H_result.is_fail ? 2 : 1);
										sql += " where pactid=" + pactid;
										sql += " and detailno=" + detailno;
										sql += " and carid=" + G_CARRIER_DOCOMO;
										sql += ";";
										this.putError(G_SCRIPT_SQL, sql);
										this.m_db.query(sql);
									} else if (1 == login_status) //DB側は成功なので、
									//strage側が失敗ならDB側も失敗にする
									{
										if (H_result.is_fail) {
											sql = "update clamp_tb";
											sql += " set login_status=2";
											sql += " where pactid=" + pactid;
											sql += " and detailno=" + detailno;
											sql += " and carid=" + G_CARRIER_DOCOMO;
											sql += ";";
											this.putError(G_SCRIPT_SQL, sql);
											this.m_db.query(sql);
										}
									} else //DB側は失敗なので、
									//strage側も失敗にする
									{
										sql = "update clampweb_index_tb" + " set fixdate='" + date("Y-m-d H:i:s") + "'" + ",is_fail=true" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid + " and detailno=" + detailno + ";";
										this.putError(G_SCRIPT_SQL, sql);
										this.m_db_temp.query(sql);
									}
							}
					}
				}
			}

			for (var type of Object.values(A_rectype)) //clampweb_type_tbへのコピー
			{
				sql = "select count(*) from clampweb_type_tb" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + " and type='" + this.m_db_temp.escape(type) + "'" + ";";

				if (0 == this.m_db_temp.getOne(sql)) {
					sql = "insert into clampweb_type_tb" + "(env,pactid,detailno,year,month,type,is_ready,fixdate)" + "values(" + G_CLAMP_ENV + "," + pactid + "," + detailno + "," + year + "," + month + ",'" + this.m_db_temp.escape(type) + "'" + ",false" + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
					this.putError(G_SCRIPT_SQL, sql);
					this.m_db_temp.query(sql);
				}
			}

			var H_dl = {
				type: undefined,
				db: undefined,
				web: undefined
			};
			sql = "select * from clampdb_type_tb" + " where pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + " and coalesce(is_ready,false)=true" + " and fixdate is not null" + " order by fixdate desc" + " limit 1" + ";";
			var H_type = this.m_db.getHash(sql);
			if (H_type.length) H_dl.type = H_type[0].fixdate;
			sql = "select * from clampdb_ready_tb" + " where pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + " and dldate is not null" + " order by dldate desc" + " limit 1" + ";";
			var H_db = this.m_db.getHash(sql);
			if (H_db.length) H_dl.db = H_db[0].dldate;
			sql = "select * from clampweb_ready_tb" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + " and dldate is not null" + " order by dldate desc" + " limit 1" + ";";
			var H_web = this.m_db_temp.getHash(sql);
			if (H_web.length) H_dl.web = H_web[0].dldate;
			var dldate = undefined;

			for (var key in H_dl) {
				var value = H_dl[key];
				if (!(undefined !== value)) continue;
				if (undefined !== dldate && value < dldate) continue;
				dldate = value;
			}

			if (undefined !== dldate) //DB側
				{
					if (!(undefined !== H_dl.db)) //DB側に追加する
						{
							sql = "insert into clampdb_ready_tb" + "(pactid,detailno,year,month,dldate,fixdate)" + "values" + "(" + pactid + "," + detailno + "," + year + "," + month + ",'" + dldate + "'" + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
							this.putError(G_SCRIPT_SQL, sql);
							this.m_db.query(sql);
						} else if (H_dl.db < dldate) //DB側を更新する
						{
							sql = "update clampdb_ready_tb" + " set dldate='" + dldate + "'" + " ,fixdate='" + date("Y-m-d H:i:s") + "'" + " where pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + ";";
							this.putError(G_SCRIPT_SQL, sql);
							this.m_db.query(sql);
						}

					if (!(undefined !== H_dl.web)) //WEB側に追加する
						{
							sql = "insert into clampweb_ready_tb" + "(env,pactid,detailno,year,month,dldate,fixdate)" + "values" + "(" + G_CLAMP_ENV + "," + pactid + "," + detailno + "," + year + "," + month + ",'" + dldate + "'" + ",'" + date("Y-m-d H:i:s") + "'" + ")" + ";";
							this.putError(G_SCRIPT_SQL, sql);
							this.m_db_temp.query(sql);
						} else if (H_dl.web < dldate) //WEB側を更新する
						{
							sql = "update clampweb_ready_tb" + " set dldate='" + dldate + "'" + " ,fixdate='" + date("Y-m-d H:i:s") + "'" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + ";";
							this.putError(G_SCRIPT_SQL, sql);
							this.m_db_temp.query(sql);
						}
				}
		}

		if (cur_ym) //削除されたクランプIDをダウンロードリストから取り除く
			{
				var A_detailno = Array();

				for (var H_clamp of Object.values(A_clamp)) A_detailno.push(H_clamp.detailno);

				sql = "delete from clampdb_index_tb" + " where pactid=" + pactid;
				if (A_detailno.length) sql += " and detailno not in(" + A_detailno.join(",") + ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
				sql = "delete from clampdb_type_tb" + " where pactid=" + pactid;
				if (A_detailno.length) sql += " and detailno not in(" + A_detailno.join(",") + ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
				sql = "delete from clampdb_ready_tb" + " where pactid=" + pactid;
				if (A_detailno.length) sql += " and detailno not in(" + A_detailno.join(",") + ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
				sql = "delete from clampweb_index_tb" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid;
				if (A_detailno.length) sql += " and detailno not in(" + A_detailno.join(",") + ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db_temp.query(sql);
				sql = "delete from clampweb_type_tb" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid;
				if (A_detailno.length) sql += " and detailno not in(" + A_detailno.join(",") + ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db_temp.query(sql);
				sql = "delete from clampweb_ready_tb" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid;
				if (A_detailno.length) sql += " and detailno not in(" + A_detailno.join(",") + ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db_temp.query(sql);
			}

		return true;
	}

};

checkClient(G_CLIENT_BOTH);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_DB) log = G_LOG_ADMIN_DOCOMO_DB;
var proc = new ProcessRegistClampDocomo(G_PROCNAME_REGIST_CLAMP_DOCOMO, log, G_OPENTIME_REGIST_CLAMP_DOCOMO);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
proc.putError(G_SCRIPT_WARNING, "\u6B63\u5E38\u7D42\u4E86");
throw die(0);