//機能：FJP人事マスタファイルの、メール送信バッチ
//作成：森原
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//V3形式のMtSetting型は定数が衝突するので、衝突しない設定ファイル型
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/fjp_hrm_const.php");

require("Mail.php");

require("lib/fjp_hrm_common.php");

const G_PROCNAME_FJP_HRM_MAIL = "fjp_hrm_mail";
const G_OPENTIME_FJP_HRM_MAIL = "0000,2400";

//array(設定項目 => 設定内容);
//機能：コンストラクタ
//機能：項目名があればtrueを返す
//引数：設定項目
//機能：値を返す
//引数：設定項目
//設定項目が無かった場合に返す値
//機能：ファイルを読み出す
//引数：ファイル名
class FJPIniSettingType {
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

//機能：そのまま送信なら0/画面に表示なら1/送信先を切り替えるなら2
//機能：デバッグ用の送信先(空文字列ならデフォルト値)
//機能：メールのサブジェクト
//機能：サブジェクトの前後に解説を追加しないならtrue
//メールのBcc
//送信対象にするバッチ種別
//送信対象にするステータス
//送信対象にする送信済ステータス
//送信対象にするユニークID
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
class ProcessFJPHRMMail extends ProcessBase {
	constructor(procname, logpath, opentime) //未送信のみ
	{
		super(procname, logpath, opentime);
		this.m_debug_mode = 0;
		this.m_debug_addr = "";
		this.m_subject = "%1\u5B9F\u884C\u7D50\u679C\u306E\u304A\u77E5\u3089\u305B%3(%2)";
		this.m_is_fix_subject = false;
		this.m_A_bcc = Array();
		this.m_A_exectype = Array();
		this.m_A_status = Array();
		this.m_A_is_send = [false];
		this.m_A_uniqueid = Array();
		this.m_args.addSetting({
			D: {
				type: "int"
			},
			b: {
				type: "string"
			},
			s: {
				type: "string"
			},
			S: {
				type: "int"
			},
			B: {
				type: "string"
			},
			E: {
				type: "string"
			},
			R: {
				type: "string"
			},
			I: {
				type: "string"
			},
			U: {
				type: "string"
			}
		});
	}

	getProcname() {
		return "FJP\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30E1\u30FC\u30EB\u9001\u4FE1\u30D7\u30ED\u30BB\u30B9";
	}

	commitArg(args) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "D":
				this.m_debug_mode = args.value + 0;
				break;

			case "b":
				this.m_debug_addr = args.value;
				break;

			case "s":
				this.m_subject = args.value;
				break;

			case "S":
				this.m_is_fix_subject = 0 != args.value;
				break;

			case "B":
				this.m_A_bcc.push(args.value);
				break;

			case "E":
				var A_value = args.value.split(",");
				this.m_A_exectype = Array();

				for (var value of Object.values(A_value)) {
					if (!is_numeric(value)) {
						this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-E\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
						return false;
					}

					if (!(-1 !== this.m_A_exectype.indexOf(value))) this.m_A_exectype.push(value);
				}

				break;

			case "R":
				A_value = args.value.split(",");
				this.m_A_status = Array();

				for (var value of Object.values(A_value)) {
					if (!is_numeric(value)) {
						this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-R\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
						return false;
					}

					if (!(-1 !== this.m_A_status.indexOf(value))) this.m_A_status.push(value);
				}

				break;

			case "I":
				A_value = args.value.split(",");
				this.m_A_is_send = Array();

				for (var value of Object.values(A_value)) {
					if (!is_numeric(value)) {
						this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-E\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
						return false;
					}

					var value = 0 != value;
					if (!(-1 !== this.m_A_is_send.indexOf(value))) this.m_A_is_send.push(value);
				}

				break;

			case "U":
				A_value = args.value.split(",");
				this.m_A_uniqueid = Array();

				for (var value of Object.values(A_value)) {
					if (!is_numeric(value)) {
						this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-E\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
						return false;
					}

					if (!(-1 !== this.m_A_uniqueid.indexOf(value))) this.m_A_uniqueid.push(value);
				}

				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessBase.getUsage();
		rval.push(["-D={0|1|2}", "0\u306A\u3089\u9001\u4FE1/1\u306A\u3089\u753B\u9762\u306B\u8868\u793A/2\u306A\u3089\u9001\u4FE1\u5148\u3092\u30C7\u30D0\u30C3\u30B0\u7528\u306B\u5909\u66F4(0)"]);
		rval.push(["-b=aaa@bbb.ccc", "\u30C7\u30D0\u30C3\u30B0\u7528\u306E\u9001\u4FE1\u5148"]);
		rval.push(["-s=...", "\u30E1\u30FC\u30EB\u306E\u30B5\u30D6\u30B8\u30A7\u30AF\u30C8"]);
		rval.push(["-S={0|1}", "\u30B5\u30D6\u30B8\u30A7\u30AF\u30C8\u306E\u524D\u5F8C\u306B\u4F55\u3082\u4ED8\u3051\u306A\u3044\u306A\u30891(0)"]);
		rval.push(["-B=aaa@bbb.ccc", "Bcc\u306B\u8FFD\u52A0\u3059\u308B\u30A2\u30C9\u30EC\u30B9"]);
		rval.push(["-E=0,1,2...", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u9001\u4FE1\u5BFE\u8C61" + "/0\u306A\u3089\u53D6\u8FBC/1\u306A\u3089\u4E8B\u524D\u691C\u67FB/2\u306A\u3089\u30B3\u30D4\u30FC(\u5168)"]);
		rval.push(["-R=0,1", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u7D50\u679C/0\u306A\u3089\u6B63\u5E38/1\u306A\u3089\u4E0D\u6B63(\u5168)"]);
		rval.push(["-I=0,1", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u9001\u4FE1\u6E08\u304B/0\u306A\u3089\u672A/1\u306A\u3089\u6E08(\u672A\u9001\u4FE1)"]);
		rval.push(["-U=uniqueid,uniqueid", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)fjp_hrm_status_index_tb\u306Euniqueid(\u5168)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessBase.getManual();
		rval += "\u52D5\u4F5C\u30E2\u30FC\u30C9:";

		switch (this.m_debug_mode) {
			case 0:
				rval += "\u901A\u5E38\u52D5\u4F5C";
				break;

			case 1:
				rval += "\u753B\u9762\u306B\u8868\u793A";
				break;

			case 2:
				rval += "\u30C7\u30D0\u30C3\u30B0\u7528\u30A2\u30C9\u30EC\u30B9\u306B\u9001\u4FE1";
				break;
		}

		rval += "\n";
		rval += "\u30C7\u30D0\u30C3\u30B0\u7528\u30A2\u30C9\u30EC\u30B9:" + this.m_debug_addr + "\n";
		rval += "\u30B5\u30D6\u30B8\u30A7\u30AF\u30C8:" + this.m_subject + "\n";
		rval += "\u30B5\u30D6\u30B8\u30A7\u30AF\u30C8\u306E\u524D\u5F8C\u306B" + (this.m_is_fix_subject ? "\u4F55\u3082\u4ED8\u3051\u306A\u3044" : "\u89E3\u8AAC\u3092\u4ED8\u3051\u308B") + "\n";
		rval += "Bcc\u306E\u30A2\u30C9\u30EC\u30B9:" + this.m_A_bcc.join(",") + "\n";
		rval += "\u9001\u4FE1\u5BFE\u8C61";
		if (!this.m_A_exectype.length || this.m_A_uniqueid.length) rval += ":\u5168\u90E8";else {
			for (var exectype of Object.values(this.m_A_exectype)) {
				switch (exectype) {
					case 0:
						rval += "/\u53D6\u8FBC";
						break;

					case 1:
						rval += "/\u4E8B\u524D\u30C1\u30A7\u30C3\u30AF";
						break;

					case 2:
						rval += "/\u30B3\u30D4\u30FC";
						break;

					default:
						rval += "/\u4E0D\u660E" + exectype;
						break;
				}
			}
		}
		rval += "\n";
		rval += "\u5B9F\u884C\u7D50\u679C";
		if (!this.m_A_status.length || this.m_A_uniqueid.length) rval += ":\u5168\u90E8";else {
			for (var status of Object.values(this.m_A_status)) {
				switch (status) {
					case 0:
						rval += ":\u6B63\u5E38\u7D42\u4E86";
						break;

					default:
						rval += ":\u4E0D\u6B63\u7D42\u4E86";
						break;
				}
			}
		}
		rval += "\n";
		rval += "\u9001\u4FE1\u6E08\u304B\u5426\u304B";
		if (!this.m_A_is_send.length || this.m_A_uniqueid.length) rval += ":\u5168\u90E8";else {
			for (var is_send of Object.values(this.m_A_is_send)) {
				if (is_send) rval += "/\u9001\u4FE1\u6E08";else rval += "/\u672A\u9001\u4FE1";
			}
		}
		rval += "\n";
		rval += "\u9001\u4FE1\u9023\u756A";
		if (!this.m_A_uniqueid.length) rval += ":\u5168\u90E8";else rval += ":" + this.m_A_uniqueid.join(",");
		rval += "\n";
		return rval;
	}

	do_execute() //標準の送信先を作る
	//KCSの送信先を取り出す
	//モデルを作成する
	//トランザクション開始
	//メール送信を行う
	//トランザクション破棄または反映
	{
		var A_addr_param = [{
			type: FJP_MAIL_MOTION,
			to: [G_MAIL_TO]
		}];
		var O_ini = new FJPIniSettingType();
		O_ini.read("mail.ini");

		if (!strcasecmp("on", O_ini.get("mail_send", ""))) {
			if (O_ini.isOk("mail_def_errorto")) {
				A_addr_param.push({
					type: FJP_MAIL_KCS,
					to: [O_ini.get("mail_def_errorto", "")]
				});
			}
		}

		var subject = this.m_subject;

		if (this.m_is_fix_subject) {
			subject = str_replace("%3", "", subject);
		} else {
			var env = "";

			if ("undefined" !== typeof G_MAIL_SUBJECT) {
				var A_match = Array();
				if (preg_match("/\\([^\\)]*\\)/", G_MAIL_SUBJECT, A_match) && A_match.length) env = A_match[0];
			}

			subject = str_replace("%3", env, subject);
		}

		var O_model = new FJPProcMailType(this.m_listener, this.m_db, this.m_table_no, this.m_listener_process.m_path, this.m_debug_mode, this.m_debug_addr, subject, this.m_is_fix_subject, this.m_A_bcc, A_addr_param, this.m_A_exectype, this.m_A_status, this.m_A_is_send, this.m_A_uniqueid);
		this.beginDB();
		var is_ok = O_model.execute();
		this.endDB(is_ok);
		return is_ok;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_CLAMP) log = G_LOG_CLAMP;
var proc = new ProcessFJPHRMMail(G_PROCNAME_FJP_HRM_MAIL, log, G_OPENTIME_FJP_HRM_MAIL);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);