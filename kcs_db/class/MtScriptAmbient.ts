//インポートバッチの設定ファイルの調査をする
//
//更新履歴
//2008/03/07 石崎公久　作成
import MtDBUtil from './MtDBUtil';
import MtOutput from './MtOutput';
import MtFileUtil from './MtFileUtil';

const fs = require('fs');
const path = require('path');
const Cursor = require('pg-cursor');

export default class MtScriptAmbient {
	O_DBh: MtDBUtil;
	O_Out: MtOutput;
	ScriptLog: string | undefined;
	YYYYMMLog: string | undefined;

	constructor() //DBオブジェクトを取得
	{
		this.O_DBh = MtDBUtil.singleton();
		this.O_Out = MtOutput.singleton();
	}

	isDirCheck(dirpath: string, flag = "rw") //存在確認
	{
		
		if (false == fs.existsSync(dirpath)) {
			return false;
		}

		if (-1 !== flag.indexOf("w") && false == fs.accessSync(dirpath , fs.constants.W_OK )) {
			return false;
		}

		if (-1 !== flag.indexOf("r") && false == fs.accessSync(dirpath , fs.constants.R_OK )) {
			return false;
		}

		return true;
	}

	isFileCheck(filepath: string, flag = "rw") //存在確認
	{
		if (false == fs.statSync(filepath).isDirectory()) {
			return "nothing";
		}

		if (-1 !== flag.indexOf("w") && false == fs.accessSync(filepath , fs.constants.W_OK )) {
			return "diswrite";
		}

		if (-1 !== flag.indexOf("r") && false == fs.accessSync(filepath , fs.constants.R_OK ))  {
			return "disread";
		}

		return true;
	}

	getPactList(datadir: string, pactid: string) {
		let A_dirs = Array();
		if (pactid != "all") {
			const filepath = path.join(datadir, pactid)
			if (fs.existsSync(filepath) == true && this.checkAccessMode(filepath , fs.constants.W_OK )) {// 2022cvt_003
				A_dirs.push(pactid);
			}
		} else {
			const filepath = path.join(datadir)
			
		    const readdirs = fs.readdirSync(filepath);
			
			readdirs.forEach((dirs: string) => {
				if (fs.existsSync(filepath) == true &&  this.checkAccessMode(filepath , fs.constants.W_OK ) && dirs != "." && dirs != "..") {
					A_dirs.push(dirs);
				}
			})
		}
		
		return A_dirs;
	}

	checkAccessMode(path, mode){
		try{
			fs.accessSync(path , mode)
			return true;
		}catch(e){
			return false;
		}
	}

	getFileList(datadir: string) //ファイル名を取得する
	{
		const A_fileList = Array();
		const dir_h = fs.readdirSync(datadir);
		
		dir_h.forEach(fileName => {
			if (true == fs.statSync(datadir + "/" + fileName).isFile()) {
				A_fileList.push(fileName);
			}
		})
		
		return A_fileList;
	}

	mvFile(fromDir: string, toDir: string) //移動先ディレクトリがなければ作成
	{
		if (fs.existsSync(toDir) == false) //移動先ディレクトリ作成失敗// 2022cvt_003
			{
				if (fs.mkdirSync(toDir, 755) == false) {
					this.O_Out.warningOut(1000, "移動先ディレクトリ(" + toDir + ")の作成に失敗しました\n", 1);
				} else {
					this.O_Out.infoOut("移動先ディレクトリ(" + toDir + ")作成完了\n", 0);
				}
			}
		const mvFileNames = fs.readdirSync(fromDir);
		
		mvFileNames.forEach(mvFileName => {//ファイルなら移動する// 2022cvt_005
			if ( fs.statSync(fromDir + "/" + mvFileName).isFile() == true) //移動が失敗した場合
				{
					if (fs.renameSync(fromDir + "/" + mvFileName, toDir + "/" + mvFileName) == false) {
						this.O_Out.warningOut(1000, "ファイルの移動に失敗しました(" + fromDir + "/" + mvFileName + "\n", 1);
					} else {
						this.O_Out.infoOut("ファイル移動完了(" + toDir + "/" + mvFileName + "\n", 1);
					}
				}
		})
	}

	makeDir(targetDir: string) {
		if (false == this.isDirCheck(targetDir)) {
			return fs.mkdirSync(targetDir, 755, true);
		} else {
			return true;
		}
	}

	expData(table: string, outFileName: string, fetchRow: string) //トランザクション内でないとカーソルが使えない
	{
		var sql = "select * from " + table;
		this.O_DBh.beginTransaction()
		.then(() => {
			var fp = fs.openSync(outFileName, "wt");

			if (false == fp) {
				this.O_Out.errorOut(1000, outFileName + "のファイルオープン失敗\n", 0, "", "");
				return false;
			}

			//ＤＢから結果取得
			const cursor = this.O_DBh.getDBH().query(new Cursor(sql));
			cursor.read(100, (err, rows) => {
				if (err) {
					throw err
				}

				if(rows.length == 0){
					fp.end();
				}

				rows.forEach(row => {
					fs.writeSync(fp, row.join("\t") + "\n")
				});

				this.O_DBh.commit();
				this.O_Out.infoOut(outFileName + " ファイルへバックアップ完了\n", 1);
				return true;
			})
		})

		return true
	}

	async lockProcess(name: string) //ロック日時を取得
	{	
		var now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
		await this.O_DBh.beginTransaction();

		var sql = "SELECT count(*) FROM clamptask_tb " + "WHERE command = '" + this.O_DBh.escape(name) + "' AND status = 1";
		var count = await this.O_DBh.queryOne(sql);

		if (0 != count) {
			this.O_DBh.rollback();
			this.O_Out.errorOut(0, "既に起動しています。\n");
			// throw process.exit(-1); 
		} else //$this->O_Out->infoOut("ロックしました。\n");	// メール削減のためコメントアウト 20091120miya
		{
			sql = "INSERT INTO clamptask_tb( command,status,recdate) " + "VALUES( '" + this.O_DBh.escape(name) + "', 1, '" + now + "')";
			await this.O_DBh.query(sql);
			await this.O_DBh.commit();
		}
	
		return true
	}

	async unLockProcess(name: string) //トランザクション
	//$this->O_Out->infoOut("ロック解除しました。\n");	// メール削減のためコメントアウト 20091120miya
	{
		await this.O_DBh.beginTransaction();
		var sql = "DELETE FROM clamptask_tb WHERE command = '" + this.O_DBh.escape(name) + "'";
		await this.O_DBh.query(sql);
		await this.O_DBh.commit();
		
		return true;
	}

	set_ScriptLog(dirpath: string) //メンバー変数の固有ログディレクトリにパスを入れる
	//固有ログの出力先
	//MtOutputにログの出力先を設定する
	{
		this.ScriptLog = dirpath;
		this.YYYYMMLog = dirpath + "/" + (new Date().getFullYear() + '' + (new Date().getMonth() + 1)) + ".log";
		this.O_Out.set_ScriptLog(this.YYYYMMLog);
	}

	get_ImportDataCSV(import_file: string) {
		var data;
		var A_data = Array();

		while (data = this.get_ImportDataCSVLine(import_file)) {
			A_data.push(data);
		}

		return A_data;
	}

	get_ImportDataCSVLine(import_file: string) :any
	{
		return MtFileUtil.csvReadLine(import_file);
	}
};
