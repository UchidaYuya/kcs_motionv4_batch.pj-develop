//
//ユーザーの行動履歴を記録する。
//旧V2型で行動履歴を記録するため
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/05/07
//
//
//
//ユーザーの行動履歴を記録する
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/05/07
//

require("MtExcept.php");

require("MtSession.php");

require("ModelBase.php");

//
//行動履歴から除外されるディレクトリのパターン
//
//@var mixed
//@access private
//
//
//コンストラクター。
//このモデルの場合 new ではなく singletonを用いること。
//
//@author nakanita
//@since 2008/05/07
//
//@access public
//@return void
//
//
//ただ１つしか無いこのモデルのインスタンスを取得する。
//new の代わりに、このメソッドによってインスタンスを得ること。
//
//@author nakanita
//@since 2008/04/03
//
//@access public
//@return void
//
//
//Actlog除外ファイルを読み込む
//
//@author nakanita
//@since 2008/04/02
//
//@access private
//@return void
//
//
//行動履歴ログに書き込む
//
//@author nakanita
//@since 2008/05/07
//
//@param string $memo
//@param string $phpself 呼び出された機能の置かれているフルパス、PHP_SELFの値を期待している
//@param boolean $forced 強制的に書き込む
//@access public
//@return void
//
//
//デストラクター
//
//@author nakanita
//@since 2008/05/07
//
//@access public
//@return void
//
class Actlog {
	static O_Instance = undefined;

	constructor() {
		this.getExceptDirs();
	}

	static singleton() //まだインスタンスが生成されていなければ
	{
		if (Actlog.O_Instance == undefined) {
			Actlog.O_Instance = new Actlog();
		}

		return Actlog.O_Instance;
	}

	getExceptDirs() {
		var exfname = this.getSetting().KCS_DIR + "/conf/actlog_except.txt";

		if (false == file_exists(exfname)) {
			MtExcept.raise("Actlog\u9664\u5916\u30D5\u30A1\u30A4\u30EB" + exfname + "\u304C\u8AAD\u307F\u53D6\u308C\u307E\u305B\u3093.");
		}

		var exfile = fopen(exfname, "r");

		if (exfile == false) {
			MtExcept.raise("Actlog\u9664\u5916\u30D5\u30A1\u30A4\u30EB" + exfile + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		}

		this.A_ExceptDirs = Array();

		while ((line = fgets(exfile)) != undefined) {
			if (feof(exfile)) {
				break;
			}

			line = line.trim();

			if (line == "") {
				continue;
			}

			if (preg_match("/^#/", line)) //行頭の # はコメント
				{
					continue;
				}

			line = "/" + line.replace(/\//g, "\\/") + "/";
			this.A_ExceptDirs.push(line);
		}

		fclose(exfile);
	}

	setActlog(memo, phpself, forced) //強制書き込みoffの場合
	{
		if (forced == false) //ディレクトリがパターンにあてはまっていれば何もしない
			{
				for (var reg of Object.values(this.A_ExceptDirs)) {
					if (preg_match(reg, phpself)) {
						return;
					}
				}
			}

		var now_time = "'" + date("Y-m-d H:i:s") + "'";
		var sess = MtSession.singleton();

		if (sess.pactid == "") {
			this.getOut().debugOut("setActlog:\u30ED\u30B0\u30A4\u30F3\u30BB\u30C3\u30B7\u30E7\u30F3\u304C\u7121\u3044");
			return;
		}

		var sql = "insert into actlog_tb(recdate, pactid, postid, userid, dir, memo, session) " + "values (" + now_time + "," + sess.pactid + "," + sess.postid + "," + sess.userid + "," + this.get_DB().dbQuote(phpself, "string") + "," + this.get_DB().dbQuote(memo, "string") + "," + this.get_DB().dbQuote(sess.getSerialize(), "string") + ")";
		this.get_DB().exec(sql);
	}

	__destruct() {}

};