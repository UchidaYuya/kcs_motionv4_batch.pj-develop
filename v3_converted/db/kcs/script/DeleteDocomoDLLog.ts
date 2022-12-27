//admin_docomo_webのログ削除バッチ。
///kcs_db/log/dl_docomoのログを削除する(現在より２ヶ月前のログが対象)
//20151026 伊達作成
//ディレクトリ削除関数だよ
//ここからメイン処理
//ディレクトリ一覧の取得
//削除するべきディレクトリか判定していくよ

require("../conf/batch_setting.php");

const LOG_DIR = KCS_DIR + "/log/dl_docomo";

function delete_directory(directory) //最後にディレクトリ削除
{
	var dirs = scandir(directory);

	for (var dir of Object.values(dirs)) {
		if (dir == ".") continue;
		if (dir == "..") continue;
		var temp = directory + "/" + dir;

		if (is_dir(temp)) //ディレクトリの場合は再帰
			{
				delete_directory(temp);
			} else //ファイルの場合は削除
			{
				unlink(temp);
			}
	}

	rmdir(directory);
};

var dirs = scandir(LOG_DIR);

for (var dir of Object.values(dirs)) //ディレクトリか判断する
//２ヶ月以前のディレクトリか判定する
{
	if (is_dir(LOG_DIR + "/" + dir) == false) continue;
	if (dir.length != 6) continue;
	if (!is_numeric(dir)) continue;
	var year = dir.substr(0, 4);
	var month = dir.substr(4, 2);
	var now = Date.now() / 1000;
	var dir_time = mktime(0, 0, 0, month + 2, 1, year);
	if (dir_time > now) continue;
	delete_directory(LOG_DIR + "/" + dir);
}