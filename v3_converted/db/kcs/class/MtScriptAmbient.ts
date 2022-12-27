//
//インポートバッチの設定ファイルの調査をする
//
//更新履歴
//2008/03/07 石崎公久　作成
//
//@package Base
//@subpackage Scirpt
//@filesource
//@since 2008/03/07
//@author ishizaki<ishizaki@motion.co.jp>
///
///**
//require_once("File/CSV.php");
//
//インポートバッチの設定ファイルの調査をする
//
//@package Base
//@subpackage Scirpt
//@author ishizaki
//@since 2008/02/26
//

require("MtDBUtil.php");

require("MtOutput.php");

require("MtFileUtil.php");

//
//DBオブジェクト
//
//@var MtDBUtil
//@access private
//
//
//アウトプットオブジェクト
//
//@var MtOutput
//@access private
//
//
//固有のログファイルまでのディレクトリ
//
//@var text
//@access private
//
//
//書き込み先のログファイル名
//
//@var mixed
//@access private
//
//
//インポート系のスクリプトの引数を使いやすい形に整形する
//
//@author ishizaki
//@since 2008/02/26
//
//@access public
//@return void
//
//
//ディレクトリのチェック
//
//引数で指定されたディレクトリが下記の通りならtrue
//１．存在する<br>
//２．書き込み権限がある<br>
//３．読み込み権限がある<br>
//<br>
//$flag に渡された引数により、チェックの内容を変更する事が<br>
//できる。初期値は rw で、読込書込の確認両方。<br>
//r 読込確認<br>
//w 書込確認<br>
//
//@author ishizaki
//@since 2008/03/13
//
//@param text $dirpath
//@param boolean $flag default rw
//@access public
//@return boolean
//
//
//ファイルの存在／読み込み／書き込み権限の確認
//
//@author ishizaki
//@since 2008/03/14
//
//@param mixed $filepath
//@param string $flag
//@access public
//@return void
//
//
//対象pactidの一覧を取得
//
//第２引数で受け取ったpactid が all の場合、第１引数のディレクトリを<br>
//検索し、そのディレクトリに含まれるpactid の一覧を返します。<br>
//all ではなく、そのままpactid が代入されていたら、そのディレクトリの<br>
//存在、書き込み権限を調べてtrue ならば、そのpactid を返します。<br>
//
//@author ishizaki
//@since 2008/03/12
//
//@param text $datadir 検索対象データディレクトリ
//@param mixed $pactid pactid 対象pactid
//@access public
//@return Array
//
//
//指定されたディレクトリ配下のファイル名を取得する
//
//@author maeda
//@since 2008/04/09
//
//@param text $datadir ディレクトリ名
//@access public
//@return $A_fileList ファイル名配列
//
//
//指定されたディレクトリ配下のファイルを指定されたディレクトリへ移動する
//
//@author maeda
//@since 2008/04/22
//
//@param mixed $fromDir 移動元ディレクトリ
//@param mixed $toDir	移動先ディレクトリ
//@access public
//@return void
//
//
//ディレクトリの存在チェックを行い、無い場合はディレクトリを作成する
//
//@author maeda
//@since 2009/06/02
//
//@param mixed $targetDir：チェック、作成するディレクトリ
//@access public
//@return true:ディレクトリが存在する若しくは作成成功、false：作成失敗
//
//
//テーブルデータをファイルにバックアップする
//
//@author maeda
//@since 2008/04/17
//
//@param mixed $table テーブル名
//@param mixed $outFileName 出力ファイル名（フルパス）
//@param mixed $fetchRow 一度にFETCHする行数
//@access public
//@return true:成功、false:失敗
//
//
//スクリプトの二重起動防止用のロック
//
//@author ishizaki
//@since 2008/03/12
//
//@param String $name
//@access public
//@return void
//
//
//スクリプトの二重起動防止用のロックを解除
//
//@author ishizaki
//@since 2008/03/13
//
//@param String $name
//@access public
//@return void
//
//
//MtOutput の出力先にログファイルを追加する
//
//@author ishizaki
//@since 2008/03/14
//
//@param mixed $dirpath
//@access public
//@return void
//
//
//インポートファイルを二重配列にしてかえす
//
//@author ishizaki
//@since 2008/04/09
//
//@param mixed $import_file
//@access public
//@return void
//
//
//インポートファイルから１レコードずつ取得
//
//@author ishizaki
//@since 2008/03/14
//
//@param mixed $import_file
//@access public
//@return array
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class MtScriptAmbient {
	constructor() //DBオブジェクトを取得
	//アプトプットオブジェクトを取得
	{
		this.O_DBh = MtDBUtil.singleton();
		this.O_Out = MtOutput.singleton();
	}

	isDirCheck(dirpath, flag = "rw") //存在確認
	{
		if (false == is_dir(dirpath)) {
			return false;
		}

		if (false !== strpos(flag, "w") && false == is_writable(dirpath)) {
			return false;
		}

		if (false !== strpos(flag, "r") && false == is_readable(dirpath)) {
			return false;
		}

		return true;
	}

	isFileCheck(filepath, flag = "rw") //存在確認
	{
		if (false == is_file(filepath)) {
			return "nothing";
		}

		if (false !== strpos(flag, "w") && false == is_writable(filepath)) {
			return "diswrite";
		}

		if (false !== strpos(flag, "r") && false == is_readable(filepath)) {
			return "disread";
		}

		return true;
	}

	getPactList(datadir, pactid) {
		var A_dirs = Array();

		if (pactid != "all") {
			if (is_dir(datadir + "/" + pactid) == true && is_writable(datadir + "/" + pactid) == true) {
				A_dirs.push(pactid);
			}
		} else {
			var dirs;
			var dir_h = opendir(datadir);

			while (dirs = readdir(dir_h)) {
				if (is_dir(datadir + "/" + dirs) == true && is_writable(datadir + "/" + dirs) == true && dirs != "." && dirs != "..") {
					A_dirs.push(dirs);
				}

				clearstatcache();
			}

			closedir(dir_h);
		}

		return A_dirs;
	}

	getFileList(datadir) //ファイル名を取得する
	{
		var fileName;
		var A_fileList = Array();
		var dir_h = opendir(datadir);

		while (fileName = readdir(dir_h)) {
			if (true == is_file(datadir + "/" + fileName)) {
				A_fileList.push(fileName);
			}

			clearstatcache();
		}

		return A_fileList;
	}

	mvFile(fromDir, toDir) //移動先ディレクトリがなければ作成
	//ファイルの移動
	{
		if (is_dir(toDir) == false) //移動先ディレクトリ作成失敗
			{
				if (mkdir(toDir, 755) == false) {
					this.O_Out.warningOut(1000, "\u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + toDir + ")\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 1);
				} else {
					this.O_Out.infoOut("\u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + toDir + ")\u4F5C\u6210\u5B8C\u4E86\n", 0);
				}
			}

		clearstatcache();
		var dirh = opendir(fromDir);

		while (mvFileName = readdir(dirh)) //ファイルなら移動する
		{
			if (is_file(fromDir + "/" + mvFileName) == true) //移動が失敗した場合
				{
					if (rename(fromDir + "/" + mvFileName, toDir + "/" + mvFileName) == false) {
						this.O_Out.warningOut(1000, "\u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + fromDir + "/" + mvFileName + "\n", 1);
					} else {
						this.O_Out.infoOut("\u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u5B8C\u4E86(" + toDir + "/" + mvFileName + "\n", 1);
					}
				}

			clearstatcache();
		}

		closedir(dirh);
	}

	makeDir(targetDir) {
		if (false == this.isDirCheck(targetDir)) {
			return mkdir(targetDir, 755, true);
		} else {
			return true;
		}
	}

	expData(table, outFileName, fetchRow) //トランザクション内でないとカーソルが使えない
	//エクスポートファイルを開く
	//エクスポートファイルオープン失敗
	//無限ループ
	//コミット
	{
		var sql = "select * from " + table;
		this.O_DBh.beginTransaction();
		var fp = fopen(outFileName, "wt");

		if (false == fp) {
			this.O_Out.errorOut(1000, outFileName + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557\n", 0, "", "");
			return false;
		}

		this.O_DBh.exec("declare exp_cur cursor for " + sql);

		for (; ; ) //ＤＢから結果取得
		{
			var result = pg_query(this.O_DBh.connection(), "fetch " + fetchRow + " in exp_cur");

			if (false == result) //ファイルクローズ
				//カーソルを開放
				{
					this.O_Out.warningOut(1000, "Fetch ERROR " + sql + "\n", 1);
					fclose(fp);
					this.O_DBh.exec("close exp_cur");
					return false;
				}

			var A_line = pg_fetch_array(result);

			if (A_line == false) //ループ終了
				{
					break;
				}

			var str = "";

			do //データ区切り記号、初回のみ空
			{
				var delim = "";

				for (var item of Object.values(A_line)) //データ区切り記号
				//値がない場合はヌル（\N）をいれる
				{
					str += delim;
					delim = "\t";

					if (item == undefined) //nullを表す記号
						{
							str += "\\N";
						} else {
						str += item;
					}
				}

				str += "\n";
			} while (A_line = pg_fetch_array(result));

			if (fputs(fp, str) == false) //カーソルを開放
				{
					this.O_Out.warningOut(1000, outFileName + "\u3078\u306E\u66F8\u304D\u8FBC\u307F\u5931\u6557\u3001" + sql + "\n", 1);
					fclose(fp);
					this.O_DBh.exec("close exp_cur");
					return false;
				}
		}

		this.O_DBh.commit();
		this.O_Out.infoOut(outFileName + " \u30D5\u30A1\u30A4\u30EB\u3078\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u5B8C\u4E86\n", 1);
		return true;
	}

	lockProcess(name) //ロック日時を取得
	//トランザクション
	//0以外だったら同じスクリプトが既に起動中
	{
		var now = date("Y-m-d H:i:s");
		this.O_DBh.beginTransaction();
		var sql = "SELECT count(*) FROM clamptask_tb " + "WHERE command = '" + this.O_DBh.escape(name) + "' AND status = 1";
		var count = this.O_DBh.queryOne(sql);

		if (0 != count) {
			this.O_DBh.rollback();
			this.O_Out.errorOut(0, "\u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\u3002\n");
			throw die(-1);
		} else //$this->O_Out->infoOut("ロックしました。\n");	// メール削減のためコメントアウト 20091120miya
			{
				sql = "INSERT INTO clamptask_tb( command,status,recdate) " + "VALUES( '" + this.O_DBh.escape(name) + "', 1, '" + now + "')";
				this.O_DBh.query(sql);
				this.O_DBh.commit();
			}

		return true;
	}

	unLockProcess(name) //トランザクション
	//$this->O_Out->infoOut("ロック解除しました。\n");	// メール削減のためコメントアウト 20091120miya
	{
		this.O_DBh.beginTransaction();
		var sql = "DELETE FROM clamptask_tb WHERE command = '" + this.O_DBh.escape(name) + "'";
		this.O_DBh.query(sql);
		this.O_DBh.commit();
		return true;
	}

	set_ScriptLog(dirpath) //メンバー変数の固有ログディレクトリにパスを入れる
	//固有ログの出力先
	//MtOutputにログの出力先を設定する
	{
		this.ScriptLog = dirpath;
		this.YYYYMMLog = dirpath + "/" + date("Ym") + ".log";
		this.O_Out.set_ScriptLog(this.YYYYMMLog);
	}

	get_ImportDataCSV(import_file) {
		var data;
		var A_data = Array();

		while (data = this.get_ImportDataCSVLine(import_file)) {
			A_data.push(data);
		}

		return A_data;
	}

	get_ImportDataCSVLine(import_file) //if(true == is_null($this->O_FileCSVConf)){
	//			$this->O_FileCSVConf = File_CSV::discoverFormat($import_file);
	//		}
	//		return $this->checkFormatCSV(File_CSV::read($import_file, $this->O_FileCSVConf));
	{
		return MtFileUtil.csvReadLine(import_file);
	}

	__destruct() {}

};