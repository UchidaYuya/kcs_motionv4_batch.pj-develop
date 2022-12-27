
import { ProcessBase, } from './lib/process_base';
// import {  } from './lib/fjp_hrm_const';
// require("Mail.php");

import { FJPProcMailType, FJP_MAIL_MOTION, FJP_MAIL_KCS } from './lib/fjp_hrm_common';
import { G_SCRIPT_WARNING,  } from './lib/script_log'
import { G_LOG, PATH_SEPARATOR, G_MAIL_TO } from '../../db_define/define';

import { G_MAIL_SUBJECT } from '../../conf/batch_setting';
import * as fs from 'fs';

import { parse_ini_file, get_include_path } from 'properties-reader';
// const parse_ini_file = require('properties-reader');
// const get_include_path = require('properties-reader');

const G_PROCNAME_FJP_HRM_MAIL = "fjp_hrm_mail";
const G_OPENTIME_FJP_HRM_MAIL = "0000,2400";


export class FJPIniSettingType {

	m_H_param: any;

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

		// for (var dir of Object.values(A_dir)) {
		for (var dir of A_dir) {
			if (!dir.length) continue;
			if ("/" !== dir[dir.length - 1]) dir += "/";

			// if (file_exists(dir + fname)) {
			if (fs.existsSync(dir + fname)) {
				fname = dir + fname;
				break;
			}
		}

		// if (!file_exists(fname)) return;
		if (!fs.existsSync(fname)) return;
		var H_param = parse_ini_file(fname);

		for (var key in H_param) {
			var value = H_param[key];
			this.m_H_param[key] = value;
		}
	}

};

export class ProcessFJPHRMMail extends ProcessBase {

	m_debug_mode: number = 0;
	m_debug_addr: string = "";
	m_subject: any;
	m_is_fix_subject: any;
	m_A_bcc: any;

	m_A_exectype: any;
	m_A_status: any;
	m_A_is_send: any;
	m_A_uniqueid: any;
	m_args: any;

	constructor(procname, logpath, opentime) //未送信のみ
	{
		super(procname, logpath, opentime);
		this.m_debug_mode = 0;
		this.m_debug_addr = "";
		// this.m_subject = "%1\u5B9F\u884C\u7D50\u679C\u306E\u304A\u77E5\u3089\u305B%3(%2)";
		this.m_subject = "%1実行結果のお知らせ%3(%2)";
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
		// return "FJP\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30E1\u30FC\u30EB\u9001\u4FE1\u30D7\u30ED\u30BB\u30B9";
		return "FJP人事マスタメール送信プロセス";
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

				// for (var value of Object.values(A_value)) {
				for (var value of A_value) {
					// if (!is_numeric(value)) {
					if (isNaN(Number(value))) {
						// this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-E\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
						this.putError(G_SCRIPT_WARNING, "不正な-Eオプション:" + args.value);
						return false;
					}

					if (!(-1 !== this.m_A_exectype.indexOf(value))) this.m_A_exectype.push(value);
				}

				break;

			case "R":
				A_value = args.value.split(",");
				this.m_A_status = Array();

				// for (var value of Object.values(A_value)) {
				for (var value of A_value) {
					// if (!is_numeric(value)) {
					if (isNaN(Number(value))) {
						// this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-R\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
						this.putError(G_SCRIPT_WARNING, "不正な-Rオプション:" + args.value);
						return false;
					}

					if (!(-1 !== this.m_A_status.indexOf(value))) this.m_A_status.push(value);
				}

				break;

			case "I":
				A_value = args.value.split(",");
				this.m_A_is_send = Array();

				// for (var value of Object.values(A_value)) {
				for (var value of A_value) {
					// if (!is_numeric(value)) {
					if (isNaN(Number(value))) {
						// this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-E\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
						this.putError(G_SCRIPT_WARNING, "不正な-Eオプション:" + args.value);
						return false;
					}

					// var value = 0 != value;
					value = 0 != value;
					if (!(-1 !== this.m_A_is_send.indexOf(value))) this.m_A_is_send.push(value);
				}

				break;

			case "U":
				A_value = args.value.split(",");
				this.m_A_uniqueid = Array();

				// for (var value of Object.values(A_value)) {
				for (var value of A_value) {
					// if (!is_numeric(value)) {
					if (isNaN(Number(value))) {
						// this.putError(G_SCRIPT_WARNING, "\u4E0D\u6B63\u306A-E\u30AA\u30D7\u30B7\u30E7\u30F3:" + args.value);
						this.putError(G_SCRIPT_WARNING, "不正な-Eオプション:" + args.value);
						return false;
					}

					if (!(-1 !== this.m_A_uniqueid.indexOf(value))) this.m_A_uniqueid.push(value);
				}

				break;
		}

		return true;
	}

	getUsage() {
		// var rval = ProcessBase.getUsage();
		var rval = this.getUsage();
		// rval.push(["-D={0|1|2}", "0\u306A\u3089\u9001\u4FE1/1\u306A\u3089\u753B\u9762\u306B\u8868\u793A/2\u306A\u3089\u9001\u4FE1\u5148\u3092\u30C7\u30D0\u30C3\u30B0\u7528\u306B\u5909\u66F4(0)"]);
		// rval.push(["-b=aaa@bbb.ccc", "\u30C7\u30D0\u30C3\u30B0\u7528\u306E\u9001\u4FE1\u5148"]);
		// rval.push(["-s=...", "\u30E1\u30FC\u30EB\u306E\u30B5\u30D6\u30B8\u30A7\u30AF\u30C8"]);
		// rval.push(["-S={0|1}", "\u30B5\u30D6\u30B8\u30A7\u30AF\u30C8\u306E\u524D\u5F8C\u306B\u4F55\u3082\u4ED8\u3051\u306A\u3044\u306A\u30891(0)"]);
		// rval.push(["-B=aaa@bbb.ccc", "Bcc\u306B\u8FFD\u52A0\u3059\u308B\u30A2\u30C9\u30EC\u30B9"]);
		// rval.push(["-E=0,1,2...", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u9001\u4FE1\u5BFE\u8C61" + "/0\u306A\u3089\u53D6\u8FBC/1\u306A\u3089\u4E8B\u524D\u691C\u67FB/2\u306A\u3089\u30B3\u30D4\u30FC(\u5168)"]);
		// rval.push(["-R=0,1", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u7D50\u679C/0\u306A\u3089\u6B63\u5E38/1\u306A\u3089\u4E0D\u6B63(\u5168)"]);
		// rval.push(["-I=0,1", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)\u9001\u4FE1\u6E08\u304B/0\u306A\u3089\u672A/1\u306A\u3089\u6E08(\u672A\u9001\u4FE1)"]);
		// rval.push(["-U=uniqueid,uniqueid", "(\u30AB\u30F3\u30DE\u3067\u8907\u6570)fjp_hrm_status_index_tb\u306Euniqueid(\u5168)"]);
		
		rval.push(["-D={0|1|2}", "0なら送信/1なら画面に表示/2なら送信先をデバッグ用に変更(0)"]);
		rval.push(["-b=aaa@bbb.ccc", "デバッグ用の送信先"]);
		rval.push(["-s=...", "メールのサブジェクト"]);
		rval.push(["-S={0|1}", "サブジェクトの前後に何も付けないなら1(0)"]);
		rval.push(["-B=aaa@bbb.ccc", "Bccに追加するアドレス"]);
		rval.push(["-E=0,1,2...", "(カンマで複数)送信対象" + "/0なら取込/1なら事前検査/2ならコピー(全)"]);
		rval.push(["-R=0,1", "(カンマで複数)結果/0なら正常/1なら不正(全)"]);
		rval.push(["-I=0,1", "(カンマで複数)送信済か/0なら未/1なら済(未送信)"]);
		rval.push(["-U=uniqueid,uniqueid", "(カンマで複数)fjp_hrm_status_index_tbのuniqueid(全)"]);

		return rval;
	}

	getManual() {
		// var rval = ProcessBase.getManual();
		var rval = this.getManual();
		// rval += "\u52D5\u4F5C\u30E2\u30FC\u30C9:";
		rval += "動作モード:";

		switch (this.m_debug_mode) {
			case 0:
				// rval += "\u901A\u5E38\u52D5\u4F5C";
				rval += "通常動作";
				break;

			case 1:
				rval += "画面に表示";
				break;

			case 2:
				rval += "デバッグ用アドレスに送信";
				break;
		}

		rval += "\n";
		// rval += "\u30C7\u30D0\u30C3\u30B0\u7528\u30A2\u30C9\u30EC\u30B9:" + this.m_debug_addr + "\n";
		// rval += "\u30B5\u30D6\u30B8\u30A7\u30AF\u30C8:" + this.m_subject + "\n";
		// rval += "\u30B5\u30D6\u30B8\u30A7\u30AF\u30C8\u306E\u524D\u5F8C\u306B" + (this.m_is_fix_subject ? "\u4F55\u3082\u4ED8\u3051\u306A\u3044" : "\u89E3\u8AAC\u3092\u4ED8\u3051\u308B") + "\n";
		// rval += "Bcc\u306E\u30A2\u30C9\u30EC\u30B9:" + this.m_A_bcc.join(",") + "\n";
		// rval += "\u9001\u4FE1\u5BFE\u8C61";
		rval += "デバッグ用アドレス:" + this.m_debug_addr + "\n";
		rval += "サブジェクト:" + this.m_subject + "\n";
		rval += "サブジェクトの前後に" + (this.m_is_fix_subject ? "何も付けない" : "解説を付ける") + "\n";
		rval += "Bccのアドレス:" + this.m_A_bcc.join(",") + "\n";
		rval += "送信対象";
		// if (!this.m_A_exectype.length || this.m_A_uniqueid.length) rval += ":\u5168\u90E8";else {
		if (!this.m_A_exectype.length || this.m_A_uniqueid.length) rval += ":全部";else {
			// for (var exectype of Object.values(this.m_A_exectype)) {
			for (var exectype of this.m_A_exectype) {
				switch (exectype) {
					case 0:
						// rval += "/\u53D6\u8FBC";
						rval += "/取込";
						break;

					case 1:
						// rval += "/\u4E8B\u524D\u30C1\u30A7\u30C3\u30AF";
						rval += "/事前チェック";
						break;

					case 2:
						// rval += "/\u30B3\u30D4\u30FC";
						rval += "/コピー";
						break;

					default:
						// rval += "/\u4E0D\u660E" + exectype;
						rval += "/不明" + exectype;
						break;
				}
			}
		}
		rval += "\n";
		// rval += "\u5B9F\u884C\u7D50\u679C";
		rval += "実行結果";
		// if (!this.m_A_status.length || this.m_A_uniqueid.length) rval += ":\u5168\u90E8";else {
		if (!this.m_A_status.length || this.m_A_uniqueid.length) rval += ":全部";else {
			// for (var status of Object.values(this.m_A_status)) {
			for (var status of this.m_A_status) {
				switch (status) {
					case 0:
						// rval += ":\u6B63\u5E38\u7D42\u4E86";
						rval += ":正常終了";
						break;

					default:
						// rval += ":\u4E0D\u6B63\u7D42\u4E86";
						rval += ":不正終了";
						break;
				}
			}
		}
		rval += "\n";
		// rval += "\u9001\u4FE1\u6E08\u304B\u5426\u304B";
		rval += "送信済か否か";
		// if (!this.m_A_is_send.length || this.m_A_uniqueid.length) rval += ":\u5168\u90E8";else {
		if (!this.m_A_is_send.length || this.m_A_uniqueid.length) rval += ":全部";else {
			// for (var is_send of Object.values(this.m_A_is_send)) {
			for (var is_send of this.m_A_is_send) {
				// if (is_send) rval += "/\u9001\u4FE1\u6E08";else rval += "/\u672A\u9001\u4FE1";
				if (is_send) rval += "/送信済";else rval += "/未送信";
			}
		}
		rval += "\n";
		// rval += "\u9001\u4FE1\u9023\u756A";
		rval += "送信連番";
		// if (!this.m_A_uniqueid.length) rval += ":\u5168\u90E8";else rval += ":" + this.m_A_uniqueid.join(",");
		if (!this.m_A_uniqueid.length) rval += ":全部";else rval += ":" + this.m_A_uniqueid.join(",");
		rval += "\n";
		return rval;
	}

	async do_execute() //標準の送信先を作る
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

		// if (!strcasecmp("on", O_ini.get("mail_send", ""))) {
		if (!(O_ini.get("mail_send").toUpperCase() === "on".toUpperCase())) {
			if (O_ini.isOk("mail_def_errorto")) {
				A_addr_param.push({
					type: FJP_MAIL_KCS,
					// to: [O_ini.get("mail_def_errorto", "")]
					to: [O_ini.get("mail_def_errorto")]
				});
			}
		}

		var subject = this.m_subject;

		if (this.m_is_fix_subject) {
			// subject = str_replace("%3", "", subject);
			subject =  subject.replace("%3", "");
		} else {
			var env = "";

			if ("undefined" !== typeof G_MAIL_SUBJECT) {
				var A_match = Array();
				// if (preg_match("/\\([^\\)]*\\)/", G_MAIL_SUBJECT, A_match) && A_match.length) env = A_match[0];
			}

			// subject = str_replace("%3", env, subject);
			subject = subject.replace("%3", env);
		}

		var O_model = new FJPProcMailType(this.m_listener, this.m_db, this.m_table_no, this.m_listener_process!.m_path, this.m_debug_mode.toString(), this.m_debug_addr, subject, this.m_is_fix_subject, this.m_A_bcc, A_addr_param, this.m_A_exectype, this.m_A_status, this.m_A_is_send, this.m_A_uniqueid);
		this.beginDB();
		var is_ok = await O_model.execute();
		this.endDB(is_ok);
		return is_ok;
	}

};

(() => {
	// checkClient(G_CLIENT_DB);
	var log = G_LOG;
	// if ("undefined" !== typeof G_LOG_CLAMP) log = G_LOG_CLAMP;
	var proc = new ProcessFJPHRMMail(G_PROCNAME_FJP_HRM_MAIL, log, G_OPENTIME_FJP_HRM_MAIL);
	if (!proc.readArgs(undefined)) throw process.exit(1);
	if (!proc.execute()) throw process.exit(1);
	throw process.exit(0);
})();