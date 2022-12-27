
import { ProcessBase } from './lib/process_base';
// import {  } from './lib/fjp_hrm_const';
import { FJP_WAYTYPE_CUR, FJP_WAYTYPE_CUR_NEW, FJP_IMPORT_POST_MODE_6, FJP_IMPORT_POST_MODE_4, FJP_IMPORT_POST_MODE_400, FJPProcImportType } from './lib/fjp_hrm_common';
import { G_SCRIPT_WARNING } from './lib/script_log';
import { G_LOG, G_LOG_HAND, sprintf } from '../../db_define/define';

const G_PROCNAME_FJP_HRM_IMPORT = "fjp_hrm_import";
const G_OPENTIME_FJP_HRM_IMPORT = "0000,2400";

export class ProcessFJPHRMImport extends ProcessBase {

	m_is_standalone: boolean;
	m_fname_setting: string = "";

	m_year: any;
	m_month: any;
	m_fname_user: string = "";
	m_fname_post: string = "";
	m_is_ignore_schedule: boolean;

	m_waytype_ignore_schedule: any;
	m_diff_days: number;
	m_is_protect_file: any;
	m_A_pactcode_in = Array();
	m_A_pactcode_out = Array();
	m_A_pactcode_in_user = Array();
	m_A_pactcode_out_user = Array();
	m_A_pactcode_in_post = Array();
	m_A_pactcode_out_post = Array();
	m_is_save: boolean;
	m_A_pactid_in = Array();
	m_A_pactid_out = Array();

	m_waytype: number;
	m_userpostid_mode: number;

	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime);
		this.m_is_standalone = true;
		this.m_fname_setting = "";

		var d = new Date();

		// this.m_year = date("Y");
		this.m_year = d.getFullYear();
		// this.m_month = date("n");
		this.m_month = new Date().getMonth()+1;
		this.m_fname_user = "";
		this.m_fname_post = "";
		this.m_is_ignore_schedule = false;
		this.m_waytype_ignore_schedule = FJP_WAYTYPE_CUR;
		this.m_diff_days = 0;
		this.m_is_protect_file = false;
		this.m_A_pactcode_in = Array();
		this.m_A_pactcode_out = Array();
		this.m_A_pactcode_in_user = Array();
		this.m_A_pactcode_out_user = Array();
		this.m_A_pactcode_in_post = Array();
		this.m_A_pactcode_out_post = Array();
		this.m_is_save = true;
		this.m_A_pactid_in = Array();
		this.m_A_pactid_out = Array();
		this.m_waytype = 3;
		this.m_userpostid_mode = 2;
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
			W: {
				type: "string"
			},
			S: {
				type: "string"
			},
			i: {
				type: "int"
			},
			I: {
				type: "int"
			},
			D: {
				type: "string"
			},
			M: {
				type: "int"
			},
			c: {
				type: "string"
			},
			C: {
				type: "string"
			},
			u: {
				type: "string"
			},
			U: {
				type: "string"
			},
			v: {
				type: "string"
			},
			V: {
				type: "string"
			},
			X: {
				type: "int"
			},
			p: {
				type: "string"
			},
			P: {
				type: "string"
			},
			w: {
				type: "int"
			},
			n: {
				type: "int"
			}
		});
	}

	getProcname() {
		// return "FJP\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u30D7\u30ED\u30BB\u30B9";
		return "FJP人事マスタインポートプロセス";
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

				// if (6 != src.length || !is_numeric(src)) {
				if (6 != src.length || isNaN(Number(src))) {
					this.putError(G_SCRIPT_WARNING, `起動年月不正${src}`);
					return false;
				}

				// var year = src.substr(0, 4) + 0;
				var year = src.substring(0, 4) + 0;
				// var month = src.substr(4, 2) + 0;
				var month = src.substring(4, 2) + 0;

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

			case "W":
				this.m_fname_post = args.value;
				break;

			case "S":
				this.m_fname_user = args.value;
				break;

			case "i":
				this.m_is_ignore_schedule = 0 != args.value;
				break;

			case "I":
				if (FJP_WAYTYPE_CUR != args.value && FJP_WAYTYPE_CUR_NEW != args.value) {
					// this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-I\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
					this.putError(G_SCRIPT_WARNING, "不正な-Iオプション:" + args.value);
					return false;
				}

				this.m_waytype_ignore_schedule = args.value;
				break;

			case "D":
				// if (!is_numeric(args.value)) {
				if (!isNaN(Number(args.value))) {
					// this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-D\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
					this.putError(G_SCRIPT_WARNING, "不正な-Dオプション:" + args.value);
					return false;
				}

				this.m_diff_days = args.value;
				break;

			case "M":
				this.m_is_protect_file = 0 != args.value;
				break;

			case "c":
				var A_pactcode = args.value.split(",");
				this.m_A_pactcode_in = Array();

				// for (var pactcode of Object.values(A_pactcode)) {
				for (var pactcode of A_pactcode) {
					pactcode = "C" + pactcode;
					if (!(-1 !== this.m_A_pactcode_in.indexOf(pactcode))) this.m_A_pactcode_in.push(pactcode);
				}

				break;

			case "C":
				A_pactcode = args.value.split(",");
				this.m_A_pactcode_out = Array();

				// for (var pactcode of Object.values(A_pactcode)) {
				for (var pactcode of A_pactcode) {
					pactcode = "C" + pactcode;
					if (!(-1 !== this.m_A_pactcode_out.indexOf(pactcode))) this.m_A_pactcode_out.push(pactcode);
				}

				break;

			case "u":
				A_pactcode = args.value.split(",");
				this.m_A_pactcode_in_user = Array();

				// for (var pactcode of Object.values(A_pactcode)) {
				for (var pactcode of A_pactcode) {
					pactcode = "C" + pactcode;
					if (!(-1 !== this.m_A_pactcode_in_user.indexOf(pactcode))) this.m_A_pactcode_in_user.push(pactcode);
				}

				break;

			case "U":
				A_pactcode = args.value.split(",");
				this.m_A_pactcode_out_user = Array();

				// for (var pactcode of Object.values(A_pactcode)) {
				for (var pactcode of A_pactcode) {
					pactcode = "C" + pactcode;
					if (!(-1 !== this.m_A_pactcode_out_user.indexOf(pactcode))) this.m_A_pactcode_out_user.push(pactcode);
				}

				break;

			case "v":
				A_pactcode = args.value.split(",");
				this.m_A_pactcode_in_post = Array();

				// for (var pactcode of Object.values(A_pactcode)) {
				for (var pactcode of A_pactcode) {
					pactcode = "C" + pactcode;
					if (!(-1 !== this.m_A_pactcode_in_post.indexOf(pactcode))) this.m_A_pactcode_in_post.push(pactcode);
				}

				break;

			case "V":
				A_pactcode = args.value.split(",");
				this.m_A_pactcode_out_post = Array();

				// for (var pactcode of Object.values(A_pactcode)) {
				for (var pactcode of A_pactcode) {
					pactcode = "C" + pactcode;
					if (!(-1 !== this.m_A_pactcode_out_post.indexOf(pactcode))) this.m_A_pactcode_out_post.push(pactcode);
				}

				break;

			case "X":
				this.m_is_save = "0" != args.value;
				break;

			case "p":
				var A_pactid = args.value.split(",");
				this.m_A_pactid_in = Array();

				// for (var pactid of Object.values(A_pactid)) {
				for (var pactid of A_pactid) {
					// if (!is_numeric(pactid)) {
					if (isNaN(Number(pactid))) {
						// this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-p\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
						this.putError(G_SCRIPT_WARNING, "正な-pオプション:" + args.value);
						return false;
					}

					if (!(-1 !== this.m_A_pactid_in.indexOf(pactid))) this.m_A_pactid_in.push(pactid);
				}

				break;

			case "P":
				A_pactid = args.value.split(",");
				this.m_A_pactid_out = Array();

				// for (var pactid of Object.values(A_pactid)) {
				for (var pactid of A_pactid) {
					// if (!is_numeric(pactid)) {
					if (isNaN(Number(pactid))) {
						// this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-P\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
						this.putError(G_SCRIPT_WARNING, "不正な-Pオプション:" + args.value);
						return false;
					}

					if (!(-1 !== this.m_A_pactid_out.indexOf(pactid))) this.m_A_pactid_out.push(pactid);
				}

				break;

			case "w":
				this.m_waytype = args.value;
				break;

			case "n":
				if (!(-1 !== [0, 1, 2].indexOf(args.value))) {
					// this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-n\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
					this.putError(G_SCRIPT_WARNING, "不正な-nオプション:" + args.value);
				}

				this.m_userpostid_mode = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		// var rval = ProcessBase.getUsage();
		var rval = this.getUsage();
		// rval.push(["-a={0|1}", "\u89AA\u30D7\u30ED\u30BB\u30B9\u304B\u3089\u547C\u3076\u306A\u30890(1)"]);
		// rval.push(["-s=fname", "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB(\u30D5\u30EB\u30D1\u30B9)\u7701\u7565\u3057\u305F\u3089\u30C7\u30D5\u30A9\u30EB\u30C8\u5024"]);
		// rval.push(["-y=yyyymm", "\u51E6\u7406\u5BFE\u8C61\u5E74\u6708(\u73FE\u5728\u306E\u5E74\u6708)"]);
		// rval.push(["-S=fname", "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB(\u30D5\u30EB\u30D1\u30B9)\u7701\u7565\u3057\u305F\u3089DB\u304B\u3089"]);
		// rval.push(["-W=fname", "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB(\u30D5\u30EB\u30D1\u30B9)\u7701\u7565\u3057\u305F\u3089DB\u304B\u3089"]);
		// rval.push(["-i={0|1}", "DB\u304B\u3089\u8AAD\u3080\u5834\u5408\u306B\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\u3092\u7121\u8996\u3059\u308B\u306A\u30891(0)"]);
		// rval.push(["-I={0|1}", "\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\u7121\u8996\u3067\u306E\u5185\u5BB9/0\u306A\u3089\u73FE\u5728/1\u306A\u3089\u73FE\u5728+\u904E\u53BB(\u73FE\u5728)"]);
		// rval.push(["-D=number", "\u88DC\u6B63\u65E5\u6570(0)"]);
		// rval.push(["-M={0|1}", "\u30D5\u30A1\u30A4\u30EB\u3092\u79FB\u52D5\u30FB\u524A\u9664\u3057\u306A\u3044\u306A\u30891(0)"]);
		// rval.push(["-c=code,code", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u5B9F\u884C\u3059\u308B\u4F1A\u793E\u30B3\u30FC\u30C9(\u4EBA\u4E8B\u30FB\u8077\u5236)(\u7701\u7565\u3057\u305F\u3089\u5168)"]);
		// rval.push(["-C=code,code", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u5B9F\u884C\u3057\u306A\u3044\u4F1A\u793E\u30B3\u30FC\u30C9(\u4EBA\u4E8B\u30FB\u8077\u5236)(\u7701\u7565\u3057\u305F\u3089\u5168)"]);
		// rval.push(["-u=code,code", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u5B9F\u884C\u3059\u308B\u4F1A\u793E\u30B3\u30FC\u30C9(\u4EBA\u4E8B)(\u7701\u7565\u3057\u305F\u3089\u5168)"]);
		// rval.push(["-U=code,code", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u5B9F\u884C\u3057\u306A\u3044\u4F1A\u793E\u30B3\u30FC\u30C9(\u4EBA\u4E8B)(\u7701\u7565\u3057\u305F\u3089\u5168)"]);
		// rval.push(["-v=code,code", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u5B9F\u884C\u3059\u308B\u4F1A\u793E\u30B3\u30FC\u30C9(\u8077\u5236)(\u7701\u7565\u3057\u305F\u3089\u5168)"]);
		// rval.push(["-V=code,code", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u5B9F\u884C\u3057\u306A\u3044\u4F1A\u793E\u30B3\u30FC\u30C9(\u8077\u5236)(\u7701\u7565\u3057\u305F\u3089\u5168)"]);
		// rval.push(["-X={0|1}", "\u30A4\u30F3\u30DD\u30FC\u30C8\u524D\u306EDB\u3092\u4FDD\u5B58\u3059\u308B\u306A\u30891(1)"]);
		// rval.push(["-p=number,number", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u5B9F\u884C\u3059\u308BDB\u4F1A\u793EID(\u7701\u7565\u3057\u305F\u3089\u5168)"]);
		// rval.push(["-P=number,number", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u5B9F\u884C\u3057\u306A\u3044DB\u4F1A\u793EID(\u7701\u7565\u3057\u305F\u3089\u5168)"]);
		// rval.push(["-w={1|2|3}", "1\u306A\u3089\u4EBA\u4E8B/2\u306A\u3089\u8077\u5236/3\u306A\u3089\u4EBA\u4E8B+\u8077\u5236"]);
		// rval.push(["-n={0|1|2}", "0\u306A\u3089\u8077\u5236\u30B3\u30FC\u30C9\u306F4\u6841/1\u306A\u308900+4\u6841/2\u306A\u30896\u6841/\u7701\u7565\u3057\u305F\u30896\u6841"]);


		rval.push(["-a={0|1}", "親プロセスから呼ぶなら0(1)"]);
		rval.push(["-s=fname", "設定ファイル(フルパス)省略したらデフォルト値"]);
		rval.push(["-y=yyyymm", "処理対象年月(現在の年月)"]);
		rval.push(["-S=fname", "人事マスタファイル(フルパス)省略したらDBから"]);
		rval.push(["-W=fname", "職制マスタファイル(フルパス)省略したらDBから"]);
		rval.push(["-i={0|1}", "DBから読む場合にスケジュールを無視するなら1(0)"]);
		rval.push(["-I={0|1}", "スケジュール無視での内容/0なら現在/1なら現在+過去(現在)"]);
		rval.push(["-D=number", "補正日数(0)"]);
		rval.push(["-M={0|1}", "ファイルを移動・削除しないなら1(0)"]);
		rval.push(["-c=code,code", "(カンマで複数)実行しない会社コード(人事・職制)(省略したら全)"]);
		rval.push(["-C=code,code", "(カンマで複数)実行しない会社コード(人事・職制)(省略したら全)"]);
		rval.push(["-u=code,code", "(カンマで複数)実行する会社コード(人事)(省略したら全)"]);
		rval.push(["-U=code,code", "(カンマで複数)実行しない会社コード(人事)(省略したら全)"]);
		rval.push(["-v=code,code", "(カンマで複数)実行する会社コード(職制)(省略したら全)"]);
		rval.push(["-V=code,code", "(カンマで複数)実行しない会社コード(職制)(省略したら全)"]);
		rval.push(["-X={0|1}", "インポート前のDBを保存するなら1(1)"]);
		rval.push(["-p=number,number", "(カンマで複数)実行するDB会社ID(省略したら全)"]);
		rval.push(["-P=number,number", "(カンマで複数)実行しないDB会社ID(省略したら全)"]);
		rval.push(["-w={1|2|3}", "1なら人事/2なら職制/3なら人事+職制"]);
		rval.push(["-n={0|1|2}", "0なら職制コードは4桁/1なら00+4桁/2なら6桁/省略したら6桁"]);
		return rval;
	}

	getManual() {
		// var rval = ProcessBase.getManual();
		var rval = this.getManual();
		// rval += (this.m_is_standalone ? "\u5358\u72EC\u52D5\u4F5C" : "\u89AA\u30D7\u30ED\u30BB\u30B9\u304B\u3089\u547C\u3073\u51FA\u3057") + "\n";
		rval += (this.m_is_standalone ? "単独動作" : "親プロセスから呼び出し") + "\n";
		// rval += "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306F" + (this.m_fname_setting.length ? this.m_fname_setting : "\u30C7\u30D5\u30A9\u30EB\u30C8\u5024") + "\n";
		rval += "設定ファイルは" + (this.m_fname_setting.length ? this.m_fname_setting : "デフォルト値") + "\n";
// 2022cvt_021
		// rval += "\u5E74\u6708" + this.m_year + "/" + sprintf("%02d", this.m_month) + "\n";
		rval += "年月" + this.m_year + "/" + sprintf("%02d", this.m_month) + "\n";

		if (this.m_fname_user.length || this.m_fname_post.length) {
			// rval += "\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306F" + (this.m_fname_user.length ? this.m_fname_user : "\u7121\u3057") + "\n";
			// rval += "\u8077\u5236\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306F" + (this.m_fname_post.length ? this.m_fname_post : "\u7121\u3057") + "\n";
			rval += "人事マスタファイルは" + (this.m_fname_user.length ? this.m_fname_user : "無し") + "\n";
			rval += "職制マスタファイルは" + (this.m_fname_post.length ? this.m_fname_post : "無し") + "\n";

		} else {
			// rval += "\u4EBA\u4E8B\u30FB\u8077\u5236\u30DE\u30B9\u30BF\u306FDB\u304B\u3089\n";
			// rval += "\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\u3092\u7121\u8996" + (this.m_is_ignore_schedule ? "\u3059\u308B" : "\u3057\u306A\u3044") + "\n";
			rval += "人事・職制マスタはDBから\n";
			rval += "スケジュールを無視" + (this.m_is_ignore_schedule ? "するB" : "しない") + "\n";

		}

		// rval += "\u51E6\u7406\u5185\u5BB9\u306F";
		rval += "処理内容は";

		if (this.m_fname_user.length || this.m_fname_post.length || this.m_is_ignore_schedule) {
			// if (FJP_WAYTYPE_CUR == this.m_waytype_ignore_schedule) rval += "\u73FE\u5728\u306E\u307F";else rval += "\u73FE\u5728+\u904E\u53BB\u6700\u65B0\u6708";
			if (FJP_WAYTYPE_CUR == this.m_waytype_ignore_schedule) rval += "現在のみ";else rval += "現在+過去最新月";
			rval += "\n";
		// } else rval += "DB\u304B\u3089" + "\n";
		} else rval += "DBから" + "\n";

		// rval += "\u88DC\u6B63\u65E5\u6570:" + this.m_diff_days + "\u65E5\n";
		// rval += "\u30D5\u30A1\u30A4\u30EB\u3092\u79FB\u52D5\u30FB\u524A\u9664" + (this.m_is_protect_file ? "\u3057\u306A\u3044" : "\u3059\u308B") + "\n";
		// rval += "\u5B9F\u884C\u3059\u308B\u4F1A\u793E\u30B3\u30FC\u30C9(\u4EBA\u4E8B\u30FB\u8077\u5236)";
		// if (!this.m_A_pactcode_in.length) rval += ":\u5168\u793E";else {
		rval += "補正日数:" + this.m_diff_days + "日\n";
		rval += "ファイルを移動・削除" + (this.m_is_protect_file ? "しない" : "する") + "\n";
		rval += "実行する会社コード(人事・職制)";
		if (!this.m_A_pactcode_in.length) rval += ":全社";else {

			// for (var pactcode of Object.values(this.m_A_pactcode_in)) rval += ":" + pactcode.substr(1);
			for (var pactcode of this.m_A_pactcode_in) rval += ":" + pactcode.substring(1);
		}
		rval += "\n";
		// rval += "\u5B9F\u884C\u3057\u306A\u3044\u4F1A\u793E\u30B3\u30FC\u30C9(\u4EBA\u4E8B\u30FB\u8077\u5236)";
		rval += "実行しない会社コード(人事・職制)";
		// if (!this.m_A_pactcode_out.length) rval += ":\u5168\u793E";else {
		if (!this.m_A_pactcode_out.length) rval += ":全社";else {
			// for (var pactcode of Object.values(this.m_A_pactcode_out)) rval += ":" + pactcode.substr(1);
			for (var pactcode of this.m_A_pactcode_out) rval += ":" + pactcode.substring(1);
		}
		rval += "\n";
		// rval += "\u5B9F\u884C\u3059\u308B\u4F1A\u793E\u30B3\u30FC\u30C9(\u4EBA\u4E8B)";
		rval += "実行する会社コード(人事)";
		// if (!this.m_A_pactcode_in_user.length) rval += ":\u5168\u793E";else {
		if (!this.m_A_pactcode_in_user.length) rval += ":全社";else {
			// for (var pactcode of Object.values(this.m_A_pactcode_in_user)) rval += ":" + pactcode.substr(1);
			for (var pactcode of this.m_A_pactcode_in_user) rval += ":" + pactcode.substring(1);
		}
		rval += "\n";
		// rval += "\u5B9F\u884C\u3057\u306A\u3044\u4F1A\u793E\u30B3\u30FC\u30C9(\u4EBA\u4E8B)";
		rval += "実行しない会社コード(人事)";
		// if (!this.m_A_pactcode_out_user.length) rval += ":\u5168\u793E";else {
		if (!this.m_A_pactcode_out_user.length) rval += ":全社";else {
			// for (var pactcode of Object.values(this.m_A_pactcode_out_user)) rval += ":" + pactcode.substr(1);
			for (var pactcode of this.m_A_pactcode_out_user) rval += ":" + pactcode.substring(1);
		}
		rval += "\n";
		// rval += "\u5B9F\u884C\u3059\u308B\u4F1A\u793E\u30B3\u30FC\u30C9(\u8077\u5236)";
		rval += "実行する会社コード(職制)";
		// if (!this.m_A_pactcode_in_post.length) rval += ":\u5168\u793E";else {
		if (!this.m_A_pactcode_in_post.length) rval += ":全社";else {
			// for (var pactcode of Object.values(this.m_A_pactcode_in_post)) rval += ":" + pactcode.substr(1);
			for (var pactcode of this.m_A_pactcode_in_post) rval += ":" + pactcode.substring(1);
		}
		rval += "\n";
		// rval += "\u5B9F\u884C\u3057\u306A\u3044\u4F1A\u793E\u30B3\u30FC\u30C9(\u8077\u5236)";
		rval += "実行しない会社コード(職制)";
		// if (!this.m_A_pactcode_out_post.length) rval += ":\u5168\u793E";else {
		if (!this.m_A_pactcode_out_post.length) rval += ":全社";else {
			// for (var pactcode of Object.values(this.m_A_pactcode_out_post)) rval += ":" + pactcode.substr(1);
			for (var pactcode of this.m_A_pactcode_out_post) rval += ":" + pactcode.substring(1);
		}
		rval += "\n";
		// rval += "\u30A4\u30F3\u30DD\u30FC\u30C8\u524D\u306EDB\u3092\u4FDD\u5B58" + (this.m_is_save ? "\u3059\u308B" : "\u3057\u306A\u3044") + "\n";
		rval += "インポート前のDBを保存" + (this.m_is_save ? "する" : "しない") + "\n";
		// rval += "\u5B9F\u884C\u3059\u308BDB\u4F1A\u793EID";
		rval += "実行するDB会社ID";
		// if (!this.m_A_pactid_in.length) rval += ":\u5168\u793E";else rval += ":" + this.m_A_pactid_in.join(":");
		if (!this.m_A_pactid_in.length) rval += ":全社";else rval += ":" + this.m_A_pactid_in.join(":");
		rval += "\n";
		// rval += "\u5B9F\u884C\u3057\u306A\u3044DB\u4F1A\u793EID";
		rval += "実行しないDB会社ID";
		// if (!this.m_A_pactid_out.length) rval += ":\u5168\u793E";else rval += ":" + this.m_A_pactid_out.join(":");
		if (!this.m_A_pactid_out.length) rval += ":全社";else rval += ":" + this.m_A_pactid_out.join(":");
		rval += "\n";
		// rval += "\u51E6\u7406\u5185\u5BB9\u306F";
		rval += "処理内容は";

		switch (this.m_waytype) {
			case 1:
				// rval += "\u4EBA\u4E8B\u306E\u307F";
				rval += "人事のみ";
				break;

			case 2:
				// rval += "\u8077\u5236\u306E\u307F";
				rval += "職制のみ";
				break;

			default:
				// rval += "\u4EBA\u4E8B\u30FB\u8077\u5236";
				rval += "人事・職制";
				break;
		}

		rval += "\n";
		// rval += "\u8077\u5236\u30B3\u30FC\u30C9\u306F";
		rval += "職制コードは";

		switch (this.m_userpostid_mode) {
			case 0:
				// rval += "4\u6841";
				rval += "4桁";
				break;

			case 1:
				// rval += "4\u6841\u306E\u5148\u982D\u306B00\u8FFD\u52A0";
				rval += "4桁の先頭に00追加";
				break;

			case 2:
				// rval += "6\u6841";
				rval += "6桁";
				break;
		}

		rval += "\n";
		return rval;
	}

	async do_execute() //モデルを生成する
	//設定ファイルが開けなかったら終了する
	//何もしないならトランザクション破棄とする
	{
		var waytype = this.m_waytype;
		if (1 != waytype && 2 != waytype) waytype = 3;
		var A_pactcode_in_user = this.m_A_pactcode_in_user;
		var A_pactcode_out_user = this.m_A_pactcode_out_user;
		var A_pactcode_in_post = this.m_A_pactcode_in_post;
		var A_pactcode_out_post = this.m_A_pactcode_out_post;

		// for (var pactcode of Object.values(this.m_A_pactcode_in)) {
		for (var pactcode of this.m_A_pactcode_in) {
			if (!(-1 !== A_pactcode_in_user.indexOf(pactcode))) A_pactcode_in_user.push(pactcode);
			if (!(-1 !== A_pactcode_in_post.indexOf(pactcode))) A_pactcode_in_post.push(pactcode);
		}

		// for (var pactcode of Object.values(this.m_A_pactcode_out)) {
		for (var pactcode of this.m_A_pactcode_out) {
			if (!(-1 !== A_pactcode_out_user.indexOf(pactcode))) A_pactcode_out_user.push(pactcode);
			if (!(-1 !== A_pactcode_out_post.indexOf(pactcode))) A_pactcode_out_post.push(pactcode);
		}

		var userpostid_mode = FJP_IMPORT_POST_MODE_6;

		if (0 == this.m_userpostid_mode) {
			userpostid_mode = FJP_IMPORT_POST_MODE_4;
		} else if (1 == this.m_userpostid_mode) {
			userpostid_mode = FJP_IMPORT_POST_MODE_400;
		}

		var O_model = new FJPProcImportType(this.m_listener, this.m_db, this.m_table_no, this.m_year, this.m_month, this.m_listener_process!.m_path, this.m_is_standalone, this.m_fname_setting, this.m_fname_user, this.m_fname_post, this.m_is_ignore_schedule.toString(), this.m_waytype_ignore_schedule, this.m_diff_days, this.m_is_protect_file || this.m_debugflag, A_pactcode_in_user, A_pactcode_out_user, A_pactcode_in_post, A_pactcode_out_post, this.m_is_save.toString(), this.m_A_pactid_in, this.m_A_pactid_out, waytype, userpostid_mode);
		if (O_model.isFailSetting()) return false;
		this.beginDB();
		var is_skip = false;
		// var is_ok = await O_model.execute(is_skip);
		var is_ok = await O_model.execute();
		if (is_skip) is_ok = false;
		this.endDB(is_ok);
		return is_ok;
	}

};

(() => {
	// checkClient(G_CLIENT_DB);

	var log = G_LOG;
	if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;

	var proc = new ProcessFJPHRMImport(G_PROCNAME_FJP_HRM_IMPORT, log, G_OPENTIME_FJP_HRM_IMPORT);
	if (!proc.readArgs(undefined)) throw process.exit(1);
	if (!proc.execute()) throw process.exit(1);
	throw process.exit(0);
});