//===========================================================================
//機能：本番-CHECK1DB自動レストアバッチ
//
//作成：宝子山
//===========================================================================
//パスワードファイル
//DB作業ディレクトリ
//DBデータディレクトリ
//DB名
//DB名
//DB接続ユーザ名
//ログ出力
//バックアップ元ファイル名
//バックアップ元ファイル名
//パスワードファイル作成
//パスワード情報書き込み
//パスワードファイルクローズ
//ファイル権限変更
//httpd停止
//バックアップデータがあった場合
//バックアップデータがあった場合(kcsv2-strage)
//httpd起動
//vacuumdb
//au_dlkeyを同期
//strageを同期
//パスワードファイル削除
///////////////////////////////////////////////////////
//エラーがあった場合はエラーメッセージをメールで送付
//////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//メール送信
///////////////////////////////////////////////////////
error_reporting(E_ALL);

require("../../conf/batch_setting.php");

require("Mail.php");

require("lib/script_db.php");

const PASS_FILE = "/home/web/.pgpass";
const LOCAL_DIR = "/nfs/I1FILE1/dbbackups/";
const PGDATA = "/usr/local/pgsql/data/";
const LOGFILE = "/kcs_db/log/batch/autoRestore.log";
const DATABASE = "check-kcsmotion";
const DATABASESTORAGE = "check-kcsmotion-storage";
const USERNAME = "postgres";
var logger = fopen(LOGFILE, "w");
print(date("Y-m-d H:i:s") + " \u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u30D0\u30C3\u30C1\u958B\u59CB\n");
fwrite(logger, date("y-m-d h:i:s") + " \u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u30D0\u30C3\u30C1\u958B\u59CB\n");

if (!(undefined !== argv[1]) || !preg_match("/-(AM|KM)/", argv[1])) {
	print("\u30D0\u30C3\u30C1\u306E\u4F7F\u7528\u65B9\u6CD5\u304C\u9055\u3044\u307E\u3059\n\u5F15\u6570\u306B -AM\u3000or -KM \u304C\u5FC5\u8981\u3067\u3059\n");
	fwrite(logger, "\u30D0\u30C3\u30C1\u306E\u4F7F\u7528\u65B9\u6CD5\u304C\u9055\u3044\u307E\u3059\n");
	throw die();
}

if (argv[1] == "-AM") {
	var env = "AM";
} else if (argv[1] == "-KM") {
	env = "KM";
} else {
	print("\u30D0\u30C3\u30C1\u306E\u4F7F\u7528\u65B9\u6CD5\u304C\u9055\u3044\u307E\u3059\n\u5F15\u6570\u306B -AM\u3000or -KM \u304C\u5FC5\u8981\u3067\u3059\n");
	fwrite(logger, "\u30D0\u30C3\u30C1\u306E\u4F7F\u7528\u65B9\u6CD5\u304C\u9055\u3044\u307E\u3059\n");
	throw die();
}

const BACKUP_DATABASE = env + "DB1-dump-kcsmotion-Last";
const BACKUP_STORAGEDATABASE = env + "DB1-dump-kcsmotion-storage-Last";
const CONFSYNC = "/usr/bin/rsync -va --delete -e \"ssh -i /home/web/.ssh/dsa_" + env + "DB1_webuser\" web@" + env + "DB1:/nfs/web/kcs/conf/au_dlkey /kcs/conf >> /kcs/log/rsync.log";
const DATACP = "/bin/rm -rf /kcs_db/data/strage/check-kcsmotion-storage/*;/bin/cp -pRf /nfs/I1FILE1/kcs_db/data/strage/kcsmotion-storage/* /kcs_db/data/strage/check-kcsmotion-storage/ >> /kcs/log/rsync.log";
var fp = fopen(PASS_FILE, "w");
fwrite(fp, "*:*:*:" + USERNAME + ":" + G_DB_PASS);
fclose(fp);
chmod(PASS_FILE, 600);
var output = Array();
exec("/usr/bin/sudo /etc/rc.d/init.d/httpd stop", output);

for (var i = 0; i < output.length; i++) {
	if (preg_match("/\u5931\u6557/", output[i])) {
		print("apache\u306E\u505C\u6B62\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
		fwrite(logger, "apache\u306E\u505C\u6B62\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n" + print_r(output, true) + "\n");
		errExit(env + "CHECK1\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5931\u6557", "apache\u306E\u505C\u6B62\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	}
}

if (file_exists(LOCAL_DIR + BACKUP_DATABASE) == true) //DBドロップ
	//DBクリエイト
	//DBレストア
	//exec("/bin/gunzip -f " . LOCAL_DIR . BACKUP_DATABASE . ".gz", $output);
	//バックアップデータがなかった場合(kcsv2)
	{
		exec("/usr/local/pgsql/bin/dropdb " + DATABASE + " -U postgres", output);

		for (i = 0;; i < output.length; i++) {
			if (preg_match("/ERROR|failed/", output[i])) {
				print(DATABASE + "\u306Edropdb\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
				fwrite(logger, DATABASE + "\u306Edropdb\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n" + print_r(output, true) + "\n");
				errExit(env + "CHECK1\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5931\u6557", DATABASE + "\u306Edropdb\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
			}
		}

		exec("/usr/local/pgsql/bin/createdb " + DATABASE + " -U postgres", output);

		for (i = 0;; i < output.length; i++) {
			if (preg_match("/ERROR|failed/", output[i])) {
				print(DATABASE + "\u306Ecreatedb\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
				fwrite(logger, DATABASE + "\u306Ecreatedb\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n" + print_r(output, true) + "\n");
				errExit(env + "CHECK1\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5931\u6557", DATABASE + "\u306Ecreatedb\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
			}
		}

		exec("/usr/local/pgsql/bin/pg_restore -U postgres  -d " + DATABASE + " " + LOCAL_DIR + BACKUP_DATABASE, output);
	} else {
	print(BACKUP_DATABASE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
	fwrite(logger, BACKUP_DATABASE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
	errExit(env + "CHECK1\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5931\u6557", DATABASE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
}

if (file_exists(LOCAL_DIR + BACKUP_STORAGEDATABASE) == true) //DBドロップ
	//DBクリエイト
	//DBレストア
	//exec("/bin/gunzip -f " . LOCAL_DIR . BACKUP_STORAGEDATABASE . ".gz", $output);
	//バックアップデータがなかった場合(kcsv2-strage)
	{
		exec("/usr/local/pgsql/bin/dropdb " + DATABASESTORAGE + " -U postgres", output);

		for (i = 0;; i < output.length; i++) {
			if (preg_match("/ERROR|failed/", output[i])) {
				print(DATABASESTORAGE + "\u306Edropdb\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
				fwrite(logger, DATABASESTORAGE + "\u306Edropdb\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n" + print_r(output, true) + "\n");
				errExit(env + "CHECK1\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5931\u6557", DATABASESTORAGE + "\u306Edropdb\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
			}
		}

		exec("/usr/local/pgsql/bin/createdb " + DATABASESTORAGE + " -U postgres", output);

		for (i = 0;; i < output.length; i++) {
			if (preg_match("/ERROR|failed/", output[i])) {
				print(DATABASESTORAGE + "\u306Ecreatedb\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
				fwrite(logger, DATABASESTORAGE + "\u306Ecreatedb\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n" + print_r(output, true) + "\n");
				errExit(env + "CHECK1\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5931\u6557", DATABASESTORAGE + "\u306Ecreatedb\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
			}
		}

		exec("/usr/local/pgsql/bin/pg_restore -U postgres  -d " + DATABASESTORAGE + " " + LOCAL_DIR + BACKUP_STORAGEDATABASE, output);
	} else {
	print(BACKUP_STORAGEDATABASE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
	fwrite(logger, BACKUP_STORAGEDATABASE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
	errExit(env + "CHECK1\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5931\u6557", BACKUP_STORAGEDATABASE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
}

exec("/usr/bin/sudo /etc/rc.d/init.d/httpd start", output);

for (i = 0;; i < output.length; i++) {
	if (preg_match("/\u5931\u6557/", output[i])) {
		print("apache\u306E\u8D77\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
		fwrite(logger, "apache\u306E\u8D77\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n" + print_r(output, true) + "\n");
		errExit(env + "CHECK1\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5931\u6557", "apache\u306E\u8D77\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	}
}

exec("/usr/local/pgsql/bin/vacuumdb -U postgres --analyze " + DATABASE, output);
exec(CONFSYNC, output);
exec(DATACP, output);
unlink(PASS_FILE);
print(date("Y-m-d H:i:s") + " " + env + "CHECK1\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u30D0\u30C3\u30C1\u7D42\u4E86\n");
fwrite(logger, date("Y-m-d H:i:s") + " " + env + "CHECK1\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u30D0\u30C3\u30C1\u7D42\u4E86\n");
mailSend(env + "CHECK1\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u6210\u529F", "\u672C\u756ADB\u3068\u306E\u540C\u671F\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F\n" + print_r(output, true));
fclose(logger);
throw die(0);

function errExit(subject, errStr) //パスワードファイルが残っている場合
{
	mailSend(subject, errStr);

	if (file_exists(PASS_FILE) == true) //パスワードファイルを削除
		{
			unlink(PASS_FILE);
		}

	throw die(1);
};

function mailSend(subject, errStr) {
	var O_mail = Mail.factory("smtp", {
		host: G_SMTP_HOST,
		port: G_SMTP_PORT
	});
	var to = "batch_error@kcs-next-dev.com";
	var from = "batch_error@kcs-next-dev.com";
	var message = mb_convert_encoding(errStr, "JIS");
	var H_headers = {
		Date: date("r"),
		To: to,
		From: from
	};
	H_headers["Return-Path"] = from;
	H_headers["MIME-Version"] = "1.0";
	H_headers.Subject = mb_encode_mimeheader(subject, "JIS");
	H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
	H_headers["Content-Transfer-Encoding"] = "7bit";
	H_headers["X-Mailer"] = "Motion Mailer v2";
	var rval = O_mail.send([to], H_headers, message);
};