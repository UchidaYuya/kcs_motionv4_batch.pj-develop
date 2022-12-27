//===========================================================================
//機能：シミュレーションプロセス(夜間自動実行)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//===========================================================================
//機能：シミュレーションプロセス(夜間自動実行)
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_recom_base3.php");

require("lib/update_recom_docomo3.php");

require("lib/update_recom_au3.php");

require("lib/update_recom_softbank3.php");

require("lib/update_recom_index3.php");

const G_PROCNAME_RECOM3 = "recom3v";
const G_OPENTIME_RECOM3 = "0000,2400";

//追加ログ出力レベル
//sim_log_tbを保存するならtrue
//処理するキャリアID
//処理する電話番号
//処理しない電話番号
//シミュレーション期間
//当月のデータがあっても処理をするならtrue
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：一個のARGVの内容を確認する
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//-----------------------------------------------------------------------
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
//機能：25日用の処理を行う
//引数：顧客ID
//作業ファイル保存先
//テーブル番号
//返値：深刻なエラーが発生したらfalseを返す
class ProcessRecom extends ProcessDefault {
	constructor(procname, logpath, opentime) //デフォルト値の設定
	{
		super(procname, logpath, opentime);
		this.m_is_timeout = true;
		this.m_args.addSetting({
			D: {
				type: "int"
			},
			L: {
				type: "int"
			},
			c: {
				type: "string"
			},
			t: {
				type: "string"
			},
			T: {
				type: "string"
			},
			s: {
				type: "string"
			},
			x: {
				type: "int"
			}
		});
		this.m_level = 3;
		this.m_is_write_log = false;
		this.m_A_carid = [G_CARRIER_ALL];
		this.m_A_telno_in = Array();
		this.m_A_telno_out = Array();
		this.m_A_monthcnt = [1, 2, 3, 6, 12];
		this.m_force_sim = false;
	}

	getProcname() {
		return "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u30D7\u30ED\u30BB\u30B9(\u81EA\u52D5\u5B9F\u884C)";
	}

	checkArg(args) {
		if (!super.checkArg(args)) return false;

		switch (args.key) {
			case "c":
				var result = args.value.split(",");

				for (var item of Object.values(result)) {
					if (!ctype_digit(item)) {
						this.putError(G_SCRIPT_ERROR, "\u30AD\u30E3\u30EA\u30A2ID\u4E0D\u6B63" + args.value);
						return false;
					}
				}

				break;

			case "s":
				var A_month = args.value.split(",");

				for (var month of Object.values(A_month)) {
					if (month < 1 || 12 < month) {
						this.putError(G_SCRIPT_ERROR, `シミュレーション期間が不正${month}`);
						return false;
					}
				}

				if (0 == A_month.length) {
					this.putError(G_SCRIPT_ERROR, "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u671F\u9593\u304C\u306A\u3044" + args.value);
					return false;
				}

				break;
		}

		return true;
	}

	commitArg(args) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "D":
				this.m_level = args.value;
				break;

			case "L":
				this.m_is_write_log = args.value;
				break;

			case "c":
				this.m_A_carid = args.value.split(",");
				break;

			case "t":
				var telno = args.value.split(",");

				for (var no of Object.values(telno)) this.m_A_telno_in.push(no);

				break;

			case "T":
				telno = args.value.split(",");

				for (var no of Object.values(telno)) this.m_A_telno_out.push(no);

				break;

			case "s":
				this.m_A_monthcnt = Array();
				var A_month = args.value.split(",");

				for (var month of Object.values(A_month)) {
					if (1 <= month && month <= 12) {
						if (!(-1 !== this.m_A_monthcnt.indexOf(month))) this.m_A_monthcnt.push(month);
					}
				}

				break;

			case "x":
				this.m_force_sim = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = super.getUsage();
		rval.push(["-D=0,1,2", "\u8FFD\u52A0\u30ED\u30B0\u51FA\u529B\u30EC\u30D9\u30EB"]);
		rval.push(["-L={0,1}", "sim_log_tb\u3092\u4FDD\u5B58\u3059\u308B\u306A\u30891(0)"]);
		rval.push(["-c=1,2,3", "\u51E6\u7406\u3059\u308B\u30AD\u30E3\u30EA\u30A2ID(1,3,4)"]);
		rval.push(["-t=telno[,telno...]", "\u51E6\u7406\u3059\u308B\u96FB\u8A71\u756A\u53F7(\u5168\u90E8)"]);
		rval.push(["-T=telno[,telno...]", "\u51E6\u7406\u3057\u306A\u3044\u96FB\u8A71\u756A\u53F7(\u306A\u3057)"]);
		rval.push(["-s=num[,num...]", "\u51E6\u7406\u3059\u308B\u6708\u6570(1,3,6,12)"]);
		rval.push(["-x={0|1}", "\u5F53\u6708\u3092\u51E6\u7406\u6E08\u307F\u3067\u3082\u518D\u5B9F\u884C\u3059\u308B\u306A\u30891(0)"]);
		return rval;
	}

	getManual() {
		var rval = super.getManual();
		rval += "\u8FFD\u52A0\u30ED\u30B0\u51FA\u529B\u30EC\u30D9\u30EB:" + this.m_level + "\n";
		rval += "sim_log_tb\u306B\u4FDD\u5B58" + (this.m_is_write_log ? "\u3059\u308B" : "\u3057\u306A\u3044") + "\n";
		rval += "\u51E6\u7406\u3059\u308B\u30AD\u30E3\u30EA\u30A2:" + this.m_A_carid.join(",") + "\n";

		if (this.m_A_telno_in.length) {
			rval += "\u51E6\u7406\u3059\u308B\u96FB\u8A71\u756A\u53F7:" + this.m_A_telno_in.join(",") + "\n";
		}

		if (this.m_A_telno_out.length) {
			rval += "\u51E6\u7406\u3057\u306A\u3044\u96FB\u8A71\u756A\u53F7:" + this.m_A_telno_out.join(",") + "\n";
		}

		rval += "\u51E6\u7406\u3059\u308B\u671F\u9593:" + this.m_A_monthcnt.join(",") + "\n";
		rval += "\u5F53\u6708\u51E6\u7406\u6E08\u306E\u5834\u5408:" + (this.m_force_sim ? "\u5B9F\u884C\u3059\u308B" : "\u5B9F\u884C\u3057\u306A\u3044") + "\n";
		return rval;
	}

	executePactid(pactid, logpath) {
		if (-1 !== this.m_A_carid.indexOf(G_CARRIER_ALL)) {
			this.m_A_carid = [G_CARRIER_DOCOMO, G_CARRIER_AU, UpdateRecomSoftbank.g_carid];
		}

		var no = this.getTableNo();
		return this.executeSim(pactid, logpath, no);
	}

	executeSim(pactid, logpath, no) //更新型を作成する
	//統計情報がなければ処理を打ち切る
	//挿入準備を行う
	//挿入処理を行う
	{
		var O_index = new UpdateRecomIndex(this.m_listener, this.m_db, this.m_table_no);
		var H_ym = {
			year: this.m_year,
			month: this.m_month
		};

		if (!O_index.isReadyTrend(H_ym, pactid, this.m_A_carid)) {
			this.putError(G_SCRIPT_INFO, "sim_trend_X_tb\u306Bcarid(" + this.m_A_carid.join(",") + ")\u306E\u30EC\u30B3\u30FC\u30C9\u304C\u7121\u3044\u306E\u3067\u51E6\u7406\u305B\u305A" + pactid);
			return true;
		}

		if (!this.m_force_sim) //当月が処理済みなら処理を打ち切る
			//夜間実行の結果を取り出す
			//is_hotlineは無視する
			//回線管理からのシミュレーション結果を取り出す
			//is_hotlineがtrue
			//両方の内、どちらかでもあれば処理済みである
			{
				var A_simid = O_index.getSimID(pactid, [UpdateRecomIndex.g_status_end], undefined, undefined, [false], [false], {
					year: this.m_year,
					month: this.m_month
				}, this.m_A_carid, Array());
				var A_simid_2 = O_index.getSimID(pactid, [UpdateRecomIndex.g_status_end], undefined, undefined, [false], [true], {
					year: this.m_year,
					month: this.m_month
				}, this.m_A_carid, [true]);

				if (A_simid.length || A_simid_2.length) {
					this.putError(G_SCRIPT_INFO, "\u5F53\u6708\u51E6\u7406\u6E08\u307F" + pactid + "/" + this.m_year + "/" + this.m_month + "/" + A_simid.join(","));
					return true;
				}
			}

		var O_inserter_details = new TableInserter(this.m_listener, this.m_db, logpath + "sim_details_tb.insert", true);
		O_inserter_details.setUnlock();
		var O_inserter_index = new TableInserter(this.m_listener, this.m_db, logpath + "sim_index_tb.insert", true);
		O_inserter_index.setUnlock();
		var O_inserter_log = new TableInserter(this.m_listener, this.m_db, logpath + "sim_log_tb.insert", true);
		O_inserter_log.setUnlock();

		if (!O_inserter_index.begin("sim_index_tb")) {
			this.putError(G_SCRIPT_ERROR, "sim_index_tb->begin\u5931\u6557");
			return false;
		}

		if (!O_inserter_details.begin("sim_details_tb")) {
			this.putError(G_SCRIPT_ERROR, "sim_details_tb->begin\u5931\u6557");
			return false;
		}

		if (!O_inserter_log.begin("sim_log_tb")) {
			this.putError(G_SCRIPT_ERROR, "sim_log_tb->begin\u5931\u6557");
			return false;
		}

		if (-1 !== this.m_A_carid.indexOf(G_CARRIER_DOCOMO)) {
			var O_docomo = new UpdateRecomDocomo(this.m_listener, this.m_db, this.m_table_no, O_inserter_log, this.m_level);
			O_index.addCarrier(G_CARRIER_DOCOMO, O_docomo);
		}

		if (-1 !== this.m_A_carid.indexOf(G_CARRIER_AU)) {
			var O_au = new UpdateRecomAU(this.m_listener, this.m_db, this.m_table_no, O_inserter_log, this.m_level);
			O_index.addCarrier(G_CARRIER_AU, O_au);
		}

		if (-1 !== this.m_A_carid.indexOf(UpdateRecomSoftbank.g_carid)) {
			var O_softbank = new UpdateRecomSoftbank(this.m_listener, this.m_db, this.m_table_no, O_inserter_log, this.m_level);
			O_index.addCarrier(UpdateRecomSoftbank.g_carid, O_softbank);
		}

		for (var carid of Object.values(this.m_A_carid)) //既存レコードを削除する
		//is_saveとis_manualが両方ともfalseのレコードを削除する
		//-tと-Tオプションで条件を指定しても、すべてが削除される
		//is_hotlineは無視する
		//同時に、is_manualがtrueでis_hotlineがtrueのレコードも削除する
		//is_hotlineがtrue
		{
			A_simid = O_index.getSimID(pactid, [UpdateRecomIndex.g_status_end], carid, carid, [false], [false], Array(), Array(), Array());
			A_simid_2 = O_index.getSimID(pactid, [UpdateRecomIndex.g_status_end], carid, carid, [false], [true], Array(), Array(), [true]);

			for (var simid of Object.values(A_simid_2)) if (!(-1 !== A_simid.indexOf(simid))) A_simid.push(simid);

			if (A_simid.length) {
				this.putError(G_SCRIPT_INFO, "\u65E2\u5B58\u81EA\u52D5\u30EC\u30B3\u30FC\u30C9\u524A\u9664" + A_simid.join(","));

				if (!O_index.deleteSimID(A_simid, logpath + "sim_details_tb.delete." + carid, false)) {
					this.putError(G_SCRIPT_WARNING, "sim_details_tb(\u81EA\u52D5)\u524A\u9664\u5931\u6557" + carid);
					return false;
				}

				if (!O_index.deleteSimID(A_simid, logpath + "sim_index_tb.delete." + carid, true)) {
					this.putError(G_SCRIPT_WARNING, "sim_index_tb\u524A\u9664\u5931\u6557" + carid);
					return false;
				}
			}

			var A_param = O_index.createIndex(pactid, carid, carid, this.m_year, this.m_month, this.m_A_monthcnt, [0, 1, 2], [true, false]);
			var H_part = O_index.partIndex(A_param);
			var A_simid_error = Array();

			if (!O_index.execute(O_inserter_details, A_simid_error, H_part, this.m_A_telno_in, this.m_A_telno_out, strftime("%Y-%m-%d"))) {
				this.putError(G_SCRIPT_WARNING, "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u5931\u6557" + pactid + "/" + carid);
				return false;
			}

			O_index.putIndex(O_inserter_index, A_param, A_simid_error);
		}

		if (!O_inserter_index.end()) {
			this.putError(G_SCRIPT_ERROR, "sim_index_tb->end\u5931\u6557");
			return false;
		}

		if (!O_inserter_details.end()) {
			this.putError(G_SCRIPT_ERROR, "sim_details_tb->end\u5931\u6557");
			return false;
		}

		if (this.m_is_write_log) {
			if (!O_inserter_log.end()) {
				this.putError(G_SCRIPT_ERROR, "sim_log_tb->end\u5931\u6557");
				return false;
			}
		} else {
			this.putError(G_SCRIPT_INFO, "sim_log_tb\u3078\u306F\u66F8\u304D\u8FBC\u307E\u305A");
		}

		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
var proc = new ProcessRecom(G_PROCNAME_RECOM3, log, G_OPENTIME_RECOM3);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);