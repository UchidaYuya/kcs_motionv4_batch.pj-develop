//===========================================================================
//機能：本番-CHECK1DB自動レストアバッチ(FJ専用)
//
//作成：森原
//===========================================================================
//○FJ本番に関する前提
//
//1)FJ本番マシンは、10.252.31.100である。
//2)FJ本番マシンのWEB側ルートディレクトリは /usr/fjp_kcs/web/kcs/
//であり、au用のダウンロードキーファイルは/usr/fjp_kcs/web/kcs/conf/au_dlkey
//にある。
//3)DBのkcsmotionは /dbbackups/FJP1/kcsmotion-Last.gz にバックアップされている。
//4)DBのkcsmotion-storageは
///dbbackups/FJP1/kcsmotion-storage-Last.gz にバックアップされている。
//○FJチェック環境に関する前提
//
//1)DB名はkcsmotionとkcsmotion-storageである。check-kcsmotionではない。
//2)pg_restoreは、postgresアカウントで実行する。
//UNIX側のユーザは任意。
//3)バッチの実行者はdv354993である。
//4)sshを使ってFJ本番のファイルをrsyncするための秘密鍵ファイルは
///home/dv354993/.ssh/rsa_FJP1_dv354993user にある。
//5)バッチ起動時に存在する/home/dv354993/.pgpassは削除して良い。
//6)ユーザdv354993は、sudoを使って、http stopとhttp startが可能である。
//7)DB側のルートディレクトリは/kcs_db/で、WEB側は/kcs/である。
//8)FJ本番のDBでバックアップされたファイルは、
///home/dv354993/restore/FJP1/kcsmotion-Last.gz と
///home/dv354993/restore/FJP1/kcsmotion-storage-Last.gz で参照可能である。
//9) FJ本番環境のDB側の/kcs/data/strage/は、
///home/dv354993/kcs_db/data/strage/kcsmotion-storage/ で参照可能である。
//10)FJ本番の/kcs_db/より下は、/home/dv354993/restore/FJP1/に
//同期されている。
//11)batch_setting.phpで定義されているG_SMTP_HOSTとG_SMTP_PORTを
//使って、メール送信ができる。メール送信者と受信者は共に
//batch_error@kcs-next-dev.com である。
//pg_restoreなどを実行するときに使うパスワードファイル。
//バッチ内部で生成し、削除する。
//本番のDBでバックアップしたファイルが置いてあるディレクトリ。
//pg_restoreを実行する作業ディレクトリでもある。
//このバッチが出力するログファイル
//pg_restoreが書き込むDB名
//pg_restoreが書き込むDB名(ストレージ側)
//pg_restoreで使用する、postgresのアカウント
//DBのバックアップファイル名(ファイルそのものはLOCAL_DIRに存在する)
//DBのバックアップファイル名(ストレージ側)
//FJ本番から、auダウンロードキーファイルをこちらにコピーするための外部コマンド
//正常に動作しなかった場合は、チェック側の/kcs/log/rsync.logに追記される。
//現在のストレージディレクトリを削除して、
//nfs経由でFJ本番のストレージディレクトリの内容を
//こちらにコピーするための外部コマンド
//正常に動作しなかった場合は、チェック側の/kcs/log/rsync.logに追記される。
//
//1) /kcs_db/data/strage/kcsmotion-storage/ 配下のファイルをすべて削除
//2) /home/dv354993/restore/FJP1/data/strage/kcsmotion-storage/ 配下の
//すべてのファイルを /kcs_db/data/strage/kcsmotion-storage/ にコピー。
//
//歴史的な理由で、strageとstorageが混在しているので注意。
//ログファイルを作る
//ログ出力
//ログに出力する際に追加する、環境名(ログ以外では使用しない)
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

const PASS_FILE = "/home/dv354993/.pgpass";
const LOCAL_DIR = "/home/dv354993/restore/FJP1/";
const LOGFILE = "/kcs_db/log/batch/autoRestore.log";
const DATABASE = "kcsmotion";
const DATABASESTORAGE = "kcsmotion-storage";
const USERNAME = "postgres";
const BACKUP_DATABASE = "kcsmotion-Last";
const BACKUP_STORAGEDATABASE = "kcsmotion-storage-Last";
const CONFSYNC = "/usr/bin/rsync -va --delete -e \"ssh -i /home/dv354993/.ssh/rsa_FJP1_dv354993user\" web@10.252.31.100:/kcs/conf/au_dlkey /kcs/conf >> /kcs/log/rsync.log";
const DATACP = "/bin/rm -rf /kcs_db/data/strage/kcsmotion-storage/*;/bin/cp -pRf /home/dv354993/restore/FJP1/data/strage/kcsmotion-storage/* /kcs_db/data/strage/kcsmotion-storage/ >> /kcs/log/rsync.log";
var logger = fopen(LOGFILE, "w");
print(date("Y-m-d H:i:s") + " \u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u30D0\u30C3\u30C1\u958B\u59CB\n");
fwrite(logger, date("y-m-d h:i:s") + " \u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u30D0\u30C3\u30C1\u958B\u59CB\n");
var env = "FJP1";
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

if (file_exists(LOCAL_DIR + BACKUP_DATABASE + ".gz") == true) //DBドロップ
	//DBクリエイト
	//DBレストア
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

		exec("/bin/gunzip -f " + LOCAL_DIR + BACKUP_DATABASE + ".gz", output);
		exec("/usr/local/pgsql/bin/pg_restore -U postgres  -d " + DATABASE + " " + LOCAL_DIR + BACKUP_DATABASE, output);
	} else {
	print(BACKUP_DATABASE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
	fwrite(logger, BACKUP_DATABASE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
	errExit(env + "CHECK1\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5931\u6557", DATABASE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
}

if (file_exists(LOCAL_DIR + BACKUP_STORAGEDATABASE + ".gz") == true) //DBドロップ
	//DBクリエイト
	//DBレストア
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

		exec("/bin/gunzip -f " + LOCAL_DIR + BACKUP_STORAGEDATABASE + ".gz", output);
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