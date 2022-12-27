//機能：FJP人事マスタファイルの、事前検査バッチ
//作成：森原
//プロセス解説文字列
//実行可能時間
//機能：FJP人事マスタファイルの、事前検査バッチ
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/fjp_hrm_const.php");

require("lib/fjp_hrm_common.php");

const G_PROCNAME_FJP_HRM_PRECHECK = "fjp_hrm_precheck";
const G_OPENTIME_FJP_HRM_PRECHECK = "0000,2400";

//親プロセスを使わず単独動作ならtrue
//設定ファイル名(省略したらデフォルト値)
//年
//月
//実行する会社ID
//実行しない会社ID
//処理内容
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
//-----------------------------------------------------------------------
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
class ProcessFJPHRMPreCheck extends ProcessBase {
	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime);
		this.m_is_standalone = true;
		this.m_fname_setting = "";
		this.m_year = date("Y");
		this.m_month = date("n");
		this.m_A_pactid_in = Array();
		this.m_A_pactid_out = Array();
		this.m_waytype = FJP_WAYTYPE_CUR_NEW;
		this.m_args.addSetting({
			a: {
				type: "int"
			},
			s: {
				type: "string"
			},
			y: {
				type: "int"
			},
			p: {
				type: "string"
			},
			P: {
				type: "string"
			},
			I: {
				type: "int"
			}
		});
	}

	getProcname() {
		return "FJP\u4EBA\u4E8B\u30DE\u30B9\u30BF\u4E8B\u524D\u691C\u67FB\u30D7\u30ED\u30BB\u30B9";
	}

	commitArg(args) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "a":
				this.m_is_standalone = 0 != args.value;
				break;

			case "s":
				this.m_fname_setting = args.value;
				break;

			case "y":
				var src = args.value;

				if (6 != src.length || !is_numeric(src)) {
					this.putError(G_SCRIPT_WARNING, `起動年月不正${src}`);
					return false;
				}

				var year = src.substr(0, 4) + 0;
				var month = src.substr(4, 2) + 0;

				if (month < 1 || 12 < month) {
					this.putError(G_SCRIPT_WARNING, `起動月不正${src}`);
					return false;
				}

				if (year < 2000 || 2100 < year) {
					this.putError(G_SCRIPT_WARNING, `起動年不正${src}`);
					return false;
				}

				this.m_year = year;
				this.m_month = month;
				break;

			case "I":
				if (FJP_WAYTYPE_CUR != args.value && FJP_WAYTYPE_CUR_NEW != args.value && 2 != args.value) {
					this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-I\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
					return false;
				}

				this.m_waytype = args.value;
				break;

			case "p":
				var A_pactid = args.value.split(",");
				this.m_A_pactid_in = Array();

				for (var pactid of Object.values(A_pactid)) {
					if (!is_numeric(pactid)) {
						this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-p\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
						return false;
					}

					if (!(-1 !== this.m_A_pactid_in.indexOf(pactid))) this.m_A_pactid_in.push(pactid);
				}

				break;

			case "P":
				A_pactid = args.value.split(",");
				this.m_A_pactid_out = Array();

				for (var pactid of Object.values(A_pactid)) {
					if (!is_numeric(pactid)) {
						this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-P\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
						return false;
					}

					if (!(-1 !== this.m_A_pactid_out.indexOf(pactid))) this.m_A_pactid_out.push(pactid);
				}

				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessBase.getUsage();
		rval.push(["-a={0|1}", "\u89AA\u30D7\u30ED\u30BB\u30B9\u304B\u3089\u547C\u3076\u306A\u30890(1)"]);
		rval.push(["-s=fname", "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB(\u30D5\u30EB\u30D1\u30B9)\u7701\u7565\u3057\u305F\u3089\u30C7\u30D5\u30A9\u30EB\u30C8\u5024"]);
		rval.push(["-y=yyyymm", "\u51E6\u7406\u5BFE\u8C61\u5E74\u6708(\u73FE\u5728\u306E\u5E74\u6708)"]);
		rval.push(["-p=number,number", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u5B9F\u884C\u3059\u308BDB\u4F1A\u793EID(\u7701\u7565\u3057\u305F\u3089\u5168)"]);
		rval.push(["-P=number,number", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u5B9F\u884C\u3057\u306A\u3044DB\u4F1A\u793EID(\u7701\u7565\u3057\u305F\u3089\u5168)"]);
		rval.push(["-I={0|1}", "\u51E6\u7406\u5185\u5BB9/0\u306A\u3089\u73FE\u5728/1\u306A\u3089\u73FE\u5728+\u904E\u53BB\u6700\u65B0\u6708/2\u306A\u3089\u5168\u90E8" + "(\u73FE\u5728+\u904E\u53BB\u6700\u65B0\u6708)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessBase.getManual();
		rval += (this.m_is_standalone ? "\u5358\u72EC\u52D5\u4F5C" : "\u89AA\u30D7\u30ED\u30BB\u30B9\u304B\u3089\u547C\u3073\u51FA\u3057") + "\n";
		rval += "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306F" + (this.m_fname_setting.length ? this.m_fname_setting : "\u30C7\u30D5\u30A9\u30EB\u30C8\u5024") + "\n";
		rval += "\u5E74\u6708" + this.m_year + "/" + sprintf("%02d", this.m_month) + "\n";
		rval += "\u5B9F\u884C\u3059\u308BDB\u4F1A\u793EID";
		if (!this.m_A_pactid_in.length) rval += ":\u5168\u793E";else rval += ":" + this.m_A_pactid_in.join(":");
		rval += "\n";
		rval += "\u5B9F\u884C\u3057\u306A\u3044DB\u4F1A\u793EID";
		if (!this.m_A_pactid_out.length) rval += ":\u5168\u793E";else rval += ":" + this.m_A_pactid_out.join(":");
		rval += "\n";
		if (FJP_WAYTYPE_CUR == this.m_waytype) rval += "\u73FE\u5728\u306E\u307F";else if (FJP_WAYTYPE_CUR_NEW == this.m_waytype) rval += "\u73FE\u5728+\u904E\u53BB\u6700\u65B0\u6708";else rval += "\u5168\u90E8";
		rval += "\n";
		return rval;
	}

	do_execute() //モデルを作成する
	//設定ファイルが開けなかったら終了する
	{
		var O_model = new FJPProcCheckType(this.m_listener, this.m_db, this.m_table_no, this.m_year, this.m_month, this.m_listener_process.m_path, this.m_is_standalone, this.m_fname_setting, this.m_waytype, this.m_A_pactid_in, this.m_A_pactid_out);
		if (O_model.isFailSetting()) return false;
		return O_model.execute();
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
var proc = new ProcessFJPHRMPreCheck(G_PROCNAME_FJP_HRM_PRECHECK, log, G_OPENTIME_FJP_HRM_PRECHECK);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);