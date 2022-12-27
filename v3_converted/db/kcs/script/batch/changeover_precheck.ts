//===========================================================================
//機能：テーブル順送り事前検査プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：テーブル順送りプロセス
error_reporting(E_ALL);

require("lib/process_base.php");

const G_PROCNAME_CHANGEOVER_PRECHECK = "changeover_precheck";
const G_OPENTIME_CHANGEOVER_PRECHECK = "0000,2400";

//部署情報の最大階層数
//エラーが発生済みならtrue(pactid毎にfalseに初期化される)
//現在実行中のpactid(ログ出力で使用する)
//1なら来月だけ検査
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
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客全体の処理を行う
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
//機能：iccard_X_tb,iccard_tbのpostidが混在がない事を確認する
//引数：顧客ID
//機能：与えられたテーブルの部署IDが他pactであれば画面に表示する
//機能：SELECT文を実行して、結果が一件でもあれば画面に表示する
//備考：見出し文字列とSQL文の%%の部分は、検査する深さに応じて変換される
//複数の深さを一括検査する
//機能：SELECT文を実行して、結果が一件でもあれば画面に表示する
//備考：見出し文字列とSQL文の%%の部分は、検査する深さに応じて変換される
//一つだけの深さを検査する
//機能：post_relation_tb, _x_tbのループ検出を行う
//機能：post_relation_tb, _x_tbのループ検出を行う
//機能：post_relation_tb, _x_tbのループ検出を再帰呼び出しで行う
//機能：一回目の不整合が発生したメッセージを表示する
//備考：二回目以降なら何もしない
//機能：文字列に含まれる%%を年月に合致する数値に置換して返す
//機能：来月の年月を返す
class ProcessChangeoverPreCheck extends ProcessDefault {
	static g_postid_nest = 128;

	ProcessChangeoverPreCheck(procname, logpath, opentime) //delflgがtrueでも処理する
	{
		this.ProcessDefault(procname, logpath, opentime);
		this.m_is_skip_delflg = false;
		this.m_is_error = false;
		this.m_num_month = 0;
		this.m_args.addSetting({
			n: {
				type: "int"
			}
		});
	}

	getProcname() {
		return "\u30C6\u30FC\u30D6\u30EB\u9806\u9001\u308A\u4E8B\u524D\u691C\u67FB\u30D7\u30ED\u30BB\u30B9";
	}

	commitArg(args) {
		if (!ProcessDefault.commitArg(args)) return false;

		switch (args.key) {
			case "n":
				this.m_num_month = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessDefault.getUsage();
		rval.push(["-n={0|1}", "\u6765\u6708\u3060\u3051\u691C\u67FB\u3059\u308B\u306A\u30891(1)"]);
		rval.push(["", "-y\u30AA\u30D7\u30B7\u30E7\u30F3\u306F\u3001\u5F53\u6708\u306E\u5E74\u6708\u3067\u3042\u308B\u3002"]);
		rval.push(["", "\u305F\u3068\u3048\u3070\u73FE\u5728\u304C2009/11\u306A\u3089\u3001-y=200911\u3068\u306A\u308B\u3002"]);
		rval.push(["", "\u4E0A\u8A18\u3067\u3055\u3089\u306B-n=1\u306E\u5834\u5408\u3001" + "2009/12\u306Bchangeover\u304C\u64CD\u4F5C\u3059\u308B\u30C6\u30FC\u30D6\u30EB\u3092\u691C\u67FB\u3059\u308B\u3002"]);
		rval.push(["", "\u90E8\u7F72\u306E\u30EB\u30FC\u30D7\u30C1\u30A7\u30C3\u30AF\u306F\u3001" + "2009/11\u306B\u79D1\u76EE\u8A08\u7B97\u3092\u884C\u3046\u30C6\u30FC\u30D6\u30EB\u3092\u691C\u67FB\u3059\u308B\u3002"]);
		return rval;
	}

	getManual() {
		var rval = ProcessDefault.getManual();

		if (this.m_num_month) {
			var year = this.m_year;
			var month = this.m_month;
			rval += year + "/" + month + "/15" + "\u306Bcalc.php\u304C\u53C2\u7167\u3059\u308B\u90E8\u7F72\u9023\u4FC2\u60C5\u5831\u3067\u30EB\u30FC\u30D7\u3092\u691C\u67FB\n";
			this.getNextMonth(year, month);
			rval += year + "/" + month + "/1" + "\u306Bchangeover.php\u304C\u64CD\u4F5C\u3059\u308B\u30C6\u30FC\u30D6\u30EB\u3092\u691C\u67FB\n";
		} else {
			rval += "\u3059\u3079\u3066\u306E\u30C6\u30FC\u30D6\u30EB\u3092\u691C\u67FB\n";
		}

		return rval;
	}

	do_execute() //全社共通の処理を行う
	{
		var status = this.executeOnce();
		if (!status) return false;
		return ProcessDefault.do_execute();
	}

	executeOnce() //pg_poolの有無が設定通りか確認する
	//トランザクションを開始する(show pool_status用)
	{
		if (!this.beginDB()) return false;
		var result = this.m_db.query("show pool_status;", false);
		var is_pool_db = !DB.isError(result);

		if (is_pool_db) //pool_statusがあったので、masterとsecondaryの状況を取り出す
			//DBから取得した内容をハッシュに取得する
			//server_statusかbackend_statusを取得する
			//masterが接続可能ならtrue
			//secondaryが接続可能ならtrue
			//server_statusの書式が変更になったらtrue
			{
				var line;
				var A_line = Array();

				while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) A_line.push(line);

				result.free();
				var server_status = "";
				var backend_status0 = "";
				var backend_status1 = "";

				for (var H_line of Object.values(A_line)) {
					if (!(undefined !== H_line.item) || !(undefined !== H_line.value)) continue;
					if (!strcmp(H_line.item, "server_status")) server_status = H_line.value;
					if (!strcmp(H_line.item, "backend status0")) backend_status0 = H_line.value;
					if (!strcmp(H_line.item, "backend status1")) backend_status1 = H_line.value;
				}

				var is_master = false;
				var is_secondary = false;
				var is_bad = false;

				if (server_status.length) //pgpool ver1の書式が有効である
					//server_statusを空白で分割し、生きているクラスタを捜す
					{
						var A_status = split(" ", server_status);
						if (!(undefined !== A_status[3])) is_bad = true;else {
							if (!strcasecmp("up", A_status[3])) is_master = true;else if (strcasecmp("down", A_status[3])) is_bad = true;
						}
						if (!(undefined !== A_status[7])) is_bad = true;else {
							if (!strcasecmp("up", A_status[7])) is_secondary = true;else if (strcasecmp("down", A_status[7])) is_bad = true;
						}
					} else if (backend_status0.length && backend_status1.length) //pgpool ver2の書式が有効である
					{
						if (!strcmp(backend_status0, "2")) is_master = true;
						if (!strcmp(backend_status1, "2")) is_secondary = true;
					} else is_bad = true;
			}

		if (!this.endDB(false)) return false;
		var setting_name = "conf/batch_setting.php";
		var is_pool_setting = "undefined" !== typeof G_USE_PG_POOL_DSN && G_USE_PG_POOL_DSN;
		if (is_pool_db && !is_pool_setting) this.putError(G_SCRIPT_WARNING, "pg_pool\u3092\u5229\u7528\u3057\u3066\u3044\u308B\u304C\u3001" + setting_name + "\u306E\u8A2D\u5B9A\u306F" + "pg_pool\u3092\u5229\u7528\u3057\u306A\u3044\u306B\u306A\u3063\u3066\u3044\u308B");
		if (!is_pool_db && is_pool_setting) this.putError(G_SCRIPT_WARNING, "pg_pool\u3092\u5229\u7528\u3057\u3066\u3044\u306A\u3044\u304C\u3001" + setting_name + "\u306E\u8A2D\u5B9A\u306F" + "pg_pool\u3092\u5229\u7528\u3059\u308B\u306B\u306A\u3063\u3066\u3044\u308B");
		if (!is_pool_db) return true;
		if (is_bad) this.putError(G_SCRIPT_WARNING, "show pool_status\u306Eserver_status\u306E\u66F8\u5F0F\u304C\u5909\u66F4\u3055\u308C\u305F/" + server_status);

		for (var cnt = 0; cnt < 2; ++cnt) {
			var is = cnt ? is_secondary : is_master;
			var label = cnt ? "\u30BB\u30AB\u30F3\u30C0\u30EA" : "\u30DE\u30B9\u30BF\u30FC";

			if (!is) {
				this.putError(G_SCRIPT_INFO, "pg_pool\u306E" + label + "\u5074\u304Cdown\u306A\u306E\u3067\u63A5\u7D9A\u305B\u305A");
				continue;
			}

			var dsn = cnt ? GLOBALS.G_dsn_pg_pool_secondary : GLOBALS.G_dsn_pg_pool_master;
			var db = DB.connect(dsn);

			if (DB.isError(db)) {
				this.putError(G_SCRIPT_WARNING, "pg_pool\u306E" + label + "\u5074\u304Cup\u306A\u306E\u306B\u63A5\u7D9A\u3067\u304D\u306A\u3044");
			} else {
				this.putError(G_SCRIPT_INFO, "pg_pool\u306E" + label + "\u5074\u304Cup\u3067\u3001\u63A5\u7D9A\u306B\u6210\u529F\u3057\u305F");
				db.disconnect();
				delete db;
			}
		}

		if (!is_master && !is_secondary) this.putError(G_SCRIPT_WARNING, "show pool_status\u306Eserver_status\u304C" + "\u4E21\u65B9\u30C0\u30A6\u30F3\u3057\u3066\u3044\u308B/" + server_status);
		return true;
	}

	executePactid(pactid, logpath) //以下、テーブル名の「_XX」部分は%%とする
	//post_relation_x_tb
	//tel_tb, tel_x_tb
	//tel_bill_x_tb
	//bill_x_tb
	//kousi_tel_bill_x_tb
	//kousi_bill_x_tb
	//card_tb, card_x_tb
	//card_post_bill_x_tb
	//card_bill_x_tb
	//purchase_tb, purchase_x_tb
	//purchase_post_bill_x_tb
	//purchase_bill_x_tb
	//copy_tb, copy_x_tb
	//copy_post_bill_x_tb
	//copy_bill_x_tb
	//transit_tb, transit_x_tb
	//transit_post_bill_x_tb
	//transit_bill_x_tb
	//ev_tb, ev_x_tb
	//ev_post_bill_x_tb
	//ev_bill_x_tb
	//healthcare_tb, healthcare_x_tb
	//healthcare_post_bill_x_tb
	//healthcare_bill_x_tb
	//SUO19
	//addbill_post_bill_x_tb
	//healthcare_bill_x_tb
	//assets_tb, assets_x_tb
	//post_deleted_tb
	//tel_deleted_tb
	//post_relation_deleted_tb
	//assets_deleted_tb
	//change_post_tb
	//tel_rel_assets_deleted_tbのassetsidと、assets_deleted_tbのassetsid
	//tel_rel_assets_tb, _x_tbのassetsidと、assets_tbのassetsid
	//post_relation_tb, _x_tbのループ検出を行う
	//iccard_X_tb,iccard_tbのpostidが混在がない事を確認する
	//エラーが一件も発生していなければログを残す
	{
		this.m_is_error = false;
		this.m_current_pactid = pactid;
		this.checkPostid("post_relation%%_tb", "postidparent", [0, 1, 2], Array(), "post%%_tb", pactid);
		this.checkPostid("post_relation%%_tb", "postidchild", [0, 1, 2], Array(), "post%%_tb", pactid);
		this.checkPostid("tel%%_tb", "postid", [0, 1, 2], ["carid", "telno"], "post%%_tb", pactid);
		this.checkPostid("tel_bill%%_tb", "postid", [1, 2], ["carid", "telno"], "post%%_tb", pactid);
		this.checkPostid("bill%%_tb", "postid", [1, 2], ["flag", "carid"], "post%%_tb", pactid);
		this.checkPostid("kousi_tel_bill%%_tb", "postid", [1, 2], ["carid", "telno"], "post%%_tb", pactid);
		this.checkPostid("kousi_bill%%_tb", "postid", [1, 2], ["flag", "carid"], "post%%_tb", pactid);
		this.checkPostid("card%%_tb", "postid", [0, 1, 2], ["cardno"], "post%%_tb", pactid);
		this.checkPostid("card_post_bill%%_tb", "postid", [1, 2], ["flag", "cardcoid"], "post%%_tb", pactid);
		this.checkPostid("card_bill%%_tb", "postid", [1, 2], ["cardcoid", "cardno"], "post%%_tb", pactid);
		this.checkPostid("purchase%%_tb", "postid", [0, 1, 2], ["purchcoid", "purchid"], "post%%_tb", pactid);
		this.checkPostid("purchase_post_bill%%_tb", "postid", [1, 2], ["purchcoid", "flag"], "post%%_tb", pactid);
		this.checkPostid("purchase_bill%%_tb", "postid", [1, 2], ["purchid", "purchcoid"], "post%%_tb", pactid);
		this.checkPostid("copy%%_tb", "postid", [0, 1, 2], ["copyid", "copycoid"], "post%%_tb", pactid);
		this.checkPostid("copy_post_bill%%_tb", "postid", [1, 2], ["copycoid", "flag"], "post%%_tb", pactid);
		this.checkPostid("copy_bill%%_tb", "postid", [1, 2], ["copyid", "copycoid"], "post%%_tb", pactid);
		this.checkPostid("transit%%_tb", "postid", [0, 1, 2], ["tranid", "trancoid"], "post%%_tb", pactid);
		this.checkPostid("transit_post_bill%%_tb", "postid", [1, 2], ["trancoid", "flag"], "post%%_tb", pactid);
		this.checkPostid("transit_bill%%_tb", "postid", [1, 2], ["tranid", "trancoid"], "post%%_tb", pactid);
		this.checkPostid("ev%%_tb", "postid", [0, 1, 2], ["evid", "evcoid"], "post%%_tb", pactid);
		this.checkPostid("ev_post_bill%%_tb", "postid", [1, 2], ["evcoid", "flag"], "post%%_tb", pactid);
		this.checkPostid("ev_bill%%_tb", "postid", [1, 2], ["evid", "evcoid"], "post%%_tb", pactid);
		this.checkPostid("healthcare%%_tb", "postid", [0, 1, 2], ["healthid", "healthcoid"], "post%%_tb", pactid);
		this.checkPostid("healthcare_post_bill%%_tb", "postid", [1, 2], ["healthcoid", "flag"], "post%%_tb", pactid);
		this.checkPostid("healthcare_bill%%_tb", "postid", [1, 2], ["healthid", "healthcoid"], "post%%_tb", pactid);
		this.checkPostid("addbill_post_bill%%_tb", "postid", [1, 2], ["postid"], "post%%_tb", pactid);
		this.checkPostid("addbill%%_tb", "postid", [1, 2], ["addbillid", "addbillid_sub"], "post%%_tb", pactid);
		this.checkPostid("assets%%_tb", "postid", [0, 1, 2], ["assetsid"], "post%%_tb", pactid);
		this.checkPostid("post_deleted_tb", "postid", [0], Array(), "post%%_tb", pactid);
		this.checkPostid("tel_deleted_tb", "postid", [0], ["carid", "telno"], "post%%_tb", pactid);
		this.checkPostid("post_relation_deleted_tb", "postidparent", [0], Array(), "post%%_tb", pactid);
		this.checkPostid("post_relation_deleted_tb", "postidchild", [0], Array(), "post%%_tb", pactid);
		this.checkPostid("assets_deleted_tb", "postid", [0], ["assetsid"], "post%%_tb", pactid);
		this.checkPostid("change_post_tb", "postid", [0], ["changepostid"], "post%%_tb", pactid);
		this.checkPostid("change_post_tb", "postidaft", [0], ["changepostid"], "post%%_tb", pactid);
		this.executeItem("tel_rel_assets_deleted_tb\u306Eassetsid\u304C\u4ED6pact\u306E\u5024\u3067\u3042\u308B" + "(assets_deleted_tb)", "select r.pactid as pactid,r.assetsid as assetsid" + ",r.carid as carid" + ",r.telno as telno" + " from tel_rel_assets_deleted_tb as r" + " left join assets_deleted_tb as p" + " on r.assetsid=p.assetsid" + " where r.pactid=" + pactid + " and r.pactid!=p.pactid" + " order by r.pactid,r.assetsid", [0]);
		this.executeItem("tel_rel_assets_deleted_tb\u306Eassetsid\u304C\u4ED6pact\u306E\u5024\u3067\u3042\u308B(assets_tb)", "select r.pactid as pactid,r.assetsid as assetsid" + ",r.carid as carid" + ",r.telno as telno" + " from tel_rel_assets_deleted_tb as r" + " left join assets_tb as p" + " on r.assetsid=p.assetsid" + " where r.pactid=" + pactid + " and r.pactid!=p.pactid" + " order by r.pactid,r.assetsid", [0]);
		this.executeItem("tel_rel_assets%%_tb\u306Eassetsid\u304C\u4ED6pact\u306E\u5024\u3067\u3042\u308B", "select r.pactid as pactid,r.assetsid as assetsid" + ",r.carid as carid" + ",r.telno as telno" + " from tel_rel_assets%%_tb as r" + " left join assets%%_tb as p" + " on r.assetsid=p.assetsid" + " where r.pactid=" + pactid + " and r.pactid!=p.pactid" + " order by r.pactid,r.assetsid", [0, 1, 2]);
		this.executeRoop(pactid);
		this.executeICCardPostid(pactid);

		if (!this.m_is_error) {
			this.putError(G_SCRIPT_INFO, "\u554F\u984C\u306A\u3057" + "(pactid:=" + this.m_current_pactid + ")");
		}

		return true;
	}

	executeICCardPostid(pactid) {
		var root_tb = "iccard%%_tb";
		var A_depth = [0, 1, 2];
		var label = root_tb + "\u306Epostid\u304C\u8907\u6570\u5B58\u5728\u3059\u308B";
		var sql = "select pactid,userid from (" + " select pactid,userid,postid from " + root_tb + " where pactid=" + pactid + " group by pactid,userid,postid" + " ) as sub_tb" + " group by pactid,userid" + " having count(*)>1" + ";";
		this.executeItem(label, sql, A_depth);
	}

	checkPostid(root_tb, column, A_depth: {} | any[], A_add: {} | any[], post_tb, pactid, post_tb_postid = "") {
		if (!post_tb_postid.length) post_tb_postid = "postid";
		var label = root_tb + "\u306E" + column + "\u304C\u4ED6pact\u306E\u5024\u3067\u3042\u308B";
		var sql = "select r.pactid as pactid";
		sql += ",r." + column + " as " + column;

		for (var add of Object.values(A_add)) sql += ",r." + add + " as " + add;

		sql += " from " + root_tb + " as r";
		sql += " left join " + post_tb + " as p";
		sql += " on r." + column + "=p." + post_tb_postid;
		sql += " where r.pactid=" + pactid;
		sql += " and r.pactid!=p.pactid";
		sql += " order by r.pactid,r." + column;
		sql += ";";
		this.executeItem(label, sql, A_depth);
	}

	executeItem(label, sql, A_depth: {} | any[]) {
		var target_cnt = -1;

		if (1 == this.m_num_month) //来月のテーブル番号を決定する
			{
				var year = this.m_year;
				var month = this.m_month;
				this.getNextMonth(year, month);
				target_cnt = this.m_table_no.get(year, month);
			}

		for (var depth of Object.values(A_depth)) {
			switch (depth) {
				case 0:
					this.executeItemOnce(label, sql, 0);
					break;

				case 1:
					for (var cnt = 0; cnt < 12; ++cnt) if (target_cnt < 0 || cnt + 1 == target_cnt) this.executeItemOnce(label, sql, cnt + 1);

					break;

				case 2:
					if (target_cnt < 0) for (cnt = 0;; cnt < 12; ++cnt) this.executeItemOnce(label, sql, cnt + 12 + 1);
					break;
			}
		}
	}

	executeItemOnce(label, sql, depth) {
		sql = this.convertSql(sql, depth);
		label = this.convertSql(label, depth);
		var result = this.m_db.getHash(sql);
		if (!result.length) return true;
		this.putWarningFirst();
		this.putError(G_SCRIPT_INFO, label);
		print(label + "\n");
		this.putError(G_SCRIPT_SQL, sql);
		print("\t" + sql + "\n");
		var line = "";
		var is_first = true;
		{
			let _tmp_0 = result[0];

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				if (!is_first) line += "\t";
				is_first = false;
				line += key;
			}
		}
		this.putError(G_SCRIPT_SQL, line);
		print(line + "\n");

		for (var H_line of Object.values(result)) {
			line = "";
			is_first = true;

			for (var key in H_line) {
				var value = H_line[key];
				if (!is_first) line += "\t";
				is_first = false;
				line += value;
			}

			this.putError(G_SCRIPT_SQL, line);
			print(line + "\n");
		}

		print("\n");
	}

	executeRoop(pactid) {
		var target_cnt = -1;

		if (1 == this.m_num_month) //当月のテーブル番号を決定する
			{
				var year = this.m_year;
				var month = this.m_month;
				target_cnt = this.m_table_no.get(year, month);
			}

		this.executeRoopItem(pactid, 0);

		for (var cnt = 0; cnt < 12; ++cnt) if (target_cnt < 0 || cnt + 1 == target_cnt) this.executeRoopItem(pactid, cnt + 1);

		if (target_cnt < 0) for (cnt = 0;; cnt < 12; ++cnt) this.executeRoopItem(pactid, cnt + 12 + 1);
	}

	executeRoopItem(pactid, depth) //連係情報を読み出す
	//全部署の部署IDを読み出す
	//直下の子部署を作る
	//連係情報をトップからたどって、連係情報のループが無い事を確認する
	{
		var rel_name = this.convertSql("post_relation%%_tb", depth);
		var post_name = this.convertSql("post%%_tb", depth);
		var A_top = Array();
		var A_rel = Array();
		var sql = "select postidparent,postidchild,level";
		sql += " from " + rel_name;
		sql += " where pactid=" + pactid;
		sql += " order by level,postidparent";
		sql += ";";
		var result = this.m_db.getHash(sql);

		for (var line of Object.values(result)) {
			var level = line.level;
			var parent = line.postidparent;
			var child = line.postidchild;

			if (0 == level) //トップが見つかった
				{
					A_top.push(parent);
				}

			var rel = {
				parent: parent,
				child: child,
				level: level
			};
			if (!(-1 !== A_rel.indexOf(rel))) A_rel.push(rel);
		}

		if (!A_rel.length) {
			this.putError(G_SCRIPT_INFO, rel_name + "\u306B" + pactid + "\u306E\u30EC\u30B3\u30FC\u30C9\u304C\u7121\u3044\u306E\u3067\u30EB\u30FC\u30D7\u691C\u51FA\u306F\u884C\u308F\u305A");
			return;
		}

		if (1 != A_top.length) {
			this.putWarningFirst();
			var label = rel_name + "\u306E\u30EC\u30D9\u30EB0\u306E\u30EC\u30B3\u30FC\u30C9\u304C\u4E00\u3064\u3067\u306F\u306A\u3044(\u30EB\u30FC\u30D7\u691C\u51FA\u306F\u884C\u308F\u305A)" + A_top.join(",");
			print(label + "\n");
			this.putError(G_SCRIPT_INFO, label);
			return;
		}

		var toppostid = A_top[0];
		var A_relation = Array();
		sql = "select postid from " + post_name;
		sql += " where pactid=" + pactid;
		sql += " order by postid";
		sql += ";";
		result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) //注目している部署ID
		//直下の部署ID
		{
			var postid = line[0];
			var A_child = Array();

			for (var H_rel of Object.values(A_rel)) //注目している部署IDが、連係情報の親でなければスキップ
			{
				if (strcmp(H_rel.parent, postid)) continue;
				if (!strcmp(H_rel.child, postid)) continue;
				if (!(-1 !== A_child.indexOf(H_rel.child))) A_child.push(H_rel.child);
			}

			A_relation[postid] = A_child;
		}

		this.executeRoopItemRec(pactid, rel_name, Array(), 0, A_relation, toppostid);
	}

	executeRoopItemRec(pactid, rel_name, A_postid, nest, A_relation, postid) //呼び出し階層が深すぎないか確認する
	//部署ツリーにループが無い事を確認する
	//子部署に対してループする
	{
		if (ProcessChangeoverPreCheck.g_postid_nest <= nest) {
			this.putWarningFirst();
			var label = rel_name + "\u306E\u30EC\u30D9\u30EB\u304C\u6DF1\u3059\u304E\u308B/" + postid + "/" + A_postid.join(",");
			print(label + "\n");
			this.putError(G_SCRIPT_INFO, label);
			return false;
		}

		++nest;

		if (-1 !== A_postid.indexOf(postid)) {
			this.putWarningFirst();
			label = rel_name + "\u306B\u30EB\u30FC\u30D7\u304C\u5B58\u5728\u3059\u308B/" + postid + "/" + A_postid.join(",");
			print(label + "\n");
			this.putError(G_SCRIPT_INFO, label);
			return false;
		}

		A_postid.push(postid);
		var A_id = Array();
		if (undefined !== A_relation[postid]) A_id = A_relation[postid];

		for (var child of Object.values(A_id)) {
			if (!this.executeRoopItemRec(pactid, rel_name, A_postid, nest, A_relation, child)) return false;
		}

		return true;
	}

	putWarningFirst() {
		if (!this.m_is_error) {
			this.putError(G_SCRIPT_WARNING, "\u6708\u521D\u9806\u9001\u308A\u30D7\u30ED\u30BB\u30B9\u4E8B\u524D\u30C1\u30A7\u30C3\u30AF\u3067\u4E0D\u6574\u5408\u691C\u51FA" + "(pactid:=" + this.m_current_pactid + ")");
		}

		this.m_is_error = true;
	}

	convertSql(text, depth) {
		if (0 == depth) return str_replace("%%", "", text);else if (is_numeric(depth)) {
			if (0 <= depth && depth < 10) depth = "0" + depth;
			depth = "_" + depth;
			return str_replace("%%", depth, text);
		}
		return text;
	}

	getNextMonth(year, month) {
		++month;

		if (13 == month) {
			++year;
			month = 1;
		}
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_DB) log = G_LOG_ADMIN_DOCOMO_DB;
var proc = new ProcessChangeoverPreCheck(G_PROCNAME_CHANGEOVER_PRECHECK, log, G_OPENTIME_CHANGEOVER_PRECHECK);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);