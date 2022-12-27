//バッチの基底クラス

import { SiteType } from '../MtOutput';
import MtScriptAmbient from '../MtScriptAmbient';
import ProcessBaseDB from '../process/ProcessBaseDB';

const path = require('path');
const fs = require("fs");

export default class ProcessBaseBatch extends ProcessBaseDB {
	ScriptEnd: boolean;
	O_MtScriptAmbient: MtScriptAmbient;
	constructor(H_param: {} | any[] = Array()) //バッチの共通設定
	{
		super(SiteType.BATCH, H_param);
		this.ScriptEnd = false;
		this.O_MtScriptAmbient = new MtScriptAmbient();
		this.getOut().scriptCommonOut("@BEGIN-KCSMotionScript: " + __filename + " 開始\n");
		this.getSetting().loadConfig("define");
		this.getSetting().loadConfig("batch");
	}

	set_ScriptEnd() {
		this.ScriptEnd = true;
		this.get_DB().disconnect();
	}

	get_MtScriptAmbient() {
		return this.O_MtScriptAmbient;
	}

	set_Dirs(scriptname: string) //固有ディレクトリ作成場所
	{
		var log_dir_name = path.parse(scriptname).name;
		var log_dir = this.getSetting().get("script_own_dir") + "/" + log_dir_name;

		if (false == this.O_MtScriptAmbient.isDirCheck(log_dir)) //作成に失敗
			{
				this.infoOut("スクリプト固有ディレクトリが存在しないため、作成します：" + log_dir + "\n");
				const path = require('path')
				if (false == fs.mkdirSync(path.join(log_dir))) {
					this.errorOut(0, "ディレクトリの作成に失敗しました。処理を終了します。\n");
				}
			}

		this.O_MtScriptAmbient.set_ScriptLog(log_dir);
	}

	isDirCheck(dirpath: string, flag = "rw") {
		return this.O_MtScriptAmbient.isDirCheck(dirpath, flag);
	}

	getPactList(datadir: string, argv_p: string) {
		return this.O_MtScriptAmbient.getPactList(datadir, argv_p);
	}

	getFileList(datadir: string) {
		return this.O_MtScriptAmbient.getFileList(datadir);
	}

	expData(table: string, outFileName: string, fetchRow: string) {
		return this.O_MtScriptAmbient.expData(table, outFileName, fetchRow);
	}

	mvFile(fromDir: string, toDir: string) {
		return this.O_MtScriptAmbient.mvFile(fromDir, toDir);
	}

	makeDir(targetDir: string) {
		return this.O_MtScriptAmbient.makeDir(targetDir);
	}

	lockProcess(scriptname: string) {
		return this.O_MtScriptAmbient.lockProcess(scriptname);
	}

	unLockProcess(scriptname: string) {
		return this.O_MtScriptAmbient.unLockProcess(scriptname);
	}

	isFileCheck(filepath: string) {
		return this.O_MtScriptAmbient.isFileCheck(filepath);
	}

};
