//===========================================================================
//機能：予備ＤＢ自動レストアバッチ マスターＤＢ用
//
//作成：前田
//更新：2010/4/12　仮想ＯＳ化に伴いＰＧ修正 s.maeda
//2010/07/09 サーバー保守契約の関係上、予備環境の自動レストアはＤＢ１台となったのでセカンダリＤＢへの同期は中止する　s.maeda
//2010/07/13 バックアップデータを解凍せずに実行 s.maeda
//2010/07/26 古いバックアップデータを削除 s.maeda
//===========================================================================
//パスワードファイル
//マスターＤＢ作業ディレクトリ
//define("REMOTE_DIR", "/home/web/restore/remote/");	// セカンダリＤＢ作業ディレクトリ
//マスターＤＢデータディレクトリ
//セカンダリＤＢデータディレクトリ
//define("HOST_MASTER", "192.168.2.51");				// マスターＤＢ ＩＰアドレス
//セカンダリＤＢ ＩＰアドレス
//define("PORT_PGPOOL","5432");						// pgpool使用ポート
//define("PORT_MASTER","6543");						// マスターＤＢ使用ポート
//define("PORT_SECOND","7654");						// セカンダリＤＢ使用ポート
//レストア時マスターＤＢ使用ポート
//ＤＢ名
//ＤＢ名
//ＤＢ接続ユーザ名
//define("USERNAME","web");						// ＤＢ接続ユーザ名
//define("POST_START", "POSTGRES_START");				// セカンダリＤＢへＤＢ起動指示
//define("POST_STARTED", "POSTGRES_STARTED");			// マスターＤＢへＤＢ起動完了報告
//define("POST_END", "POSTGRES_END");					// セカンダリＤＢへＤＢ終了指示
//define("POST_ENDED", "POSTGRES_ENDED");				// マスターＤＢへＤＢ終了完了報告
//define("USER_MASTER", "web");							//
//define("USER_SECOND", "web");							//
//本番ＤＢのバックアップデータを待つ際のsleepの間隔秒数（１５分）
//本番ＤＢのバックアップデータを待つ際のsleepの最大秒数（５時間経過した場合は処理を終了する）
//define("DB_WAIT_INTERVAL", 60);						// ＤＢ起動、終了を待つ際のsleepの間隔秒数（１分）
//define("MAX_DB_WAIT_INTERVAL", 600);				// ＤＢ起動、終了を待つ際のsleepの最大秒数（１０分経過した場合は処理を終了する）
//ログ出力
//print date("Y-m-d H:i:s") . mb_convert_encoding(" 自動レストアバッチ開始\n", "UTF-8", "EUC_JP");
//積算秒数初期化
//バックアップファイルの転送が完了し、完了したことを知らせる
//YYYYMMDDファイルが転送されているかチェック
//バックアップファイルの転送が完了していない場合はsleepし、
//一定時間経過した場合は処理を終了する
//パスワードファイル作成
//パスワード情報書き込み
//fwrite($fp, "*:*:*:" . USERNAME . ":" . G_DB_PASS_TEMP);
//パスワードファイルクローズ
//ファイル権限変更
//少し待たないと次のＤＢ処理でエラーになる
//予備環境が起動中かどうか調べる
//起動中のデータベースにkcsv2があるかチェック
//バックアップ完了ファイルを削除
//予備環境は起動させずに待機させるためコメントアウト
//// マスターＤＢ停止
////exec('/usr/bin/sudo -u postgres pg_ctl.org -p ' . PORT_MASTER . ' -m f stop');
//exec('/usr/bin/sudo -u postgres /usr/local/pgsql/bin/pg_ctl.org -p ' . PORT_MASTER . ' -D ' . PGDATA_MASTER . ' -m f stop');
//// セカンダリＤＢを停止する指示用ファイルを作成
//exec('/bin/touch ' . LOCAL_DIR . POST_END);
//// セカンダリへ停止を指示するファイルを転送する
//exec('/usr/bin/scp ' . LOCAL_DIR . POST_END . ' ' . USER_SECOND . '@' . HOST_SECOND . ":" . REMOTE_DIR);
//// セカンダリＤＢを停止する指示用ファイルを削除
//unlink(LOCAL_DIR . POST_END);
//// 積算秒数初期化
//$waitSec = 0;
//// セカンダリＤＢが停止したかどうかをチェック
//// ＤＢ終了完了報告ファイルが転送されているかチェック
//// ＤＢ終了完了報告ファイルの転送が完了していない場合はsleepし、
//// 一定時間経過した場合は処理を終了する
//while(file_exists(LOCAL_DIR . POST_ENDED) == false){
//	// 積算秒数チェック
//	if($waitSec > MAX_DB_WAIT_INTERVAL){
//		print mb_convert_encoding("セカンダリＤＢから停止完了の応答がない為、処理を終了します\n", "UTF-8", "EUC_JP");
//		errExit("予備環境自動レストア失敗", "セカンダリＤＢから停止完了の応答がない為、処理を終了します");
//	}
//	sleep(DB_WAIT_INTERVAL);
//	$waitSec = $waitSec + DB_WAIT_INTERVAL;
//}
//// ＤＢ終了完了報告を削除
//unlink(LOCAL_DIR . POST_ENDED);
//// pgpool停止
//exec('/usr/bin/sudo -u postgres /usr/local/bin/pgpool -m f stop');
//別プロセスでポートを変えてマスターＤＢ起動
//ＤＢドロップ
//ＤＢクリエイト
//// バックアップデータ解凍
//exec('/bin/gunzip -f ' . LOCAL_DIR . DATABASE . '-' . date("D") . '.gz');
//exec('/bin/gunzip -f ' . LOCAL_DIR . DATABASESTORAGE . '-' . date("D") . '.gz');
//バックアップデータがあった場合(kcsv2)
//if(file_exists(LOCAL_DIR . DATABASE . '-' . date("D")) == true){
//バックアップデータがあった場合(kcsv2-strage)
//if(file_exists(LOCAL_DIR . DATABASESTORAGE . '-' . date("D")) == true){
//// バックアップデータ圧縮
//exec('/bin/gzip ' . LOCAL_DIR . DATABASE . '-' . date("D"));
//exec('/bin/gzip ' . LOCAL_DIR . DATABASESTORAGE . '-' . date("D"));
//2010/07/26 古いバックアップデータを削除 s.maeda
//バックアップデータを移動
//vacuumdb
//マスターＤＢ停止
//2010/07/09 サーバー保守契約の関係上、予備環境の自動レストアはＤＢ１台となったのでセカンダリＤＢへの同期は中止する　s.maeda
//マスターＤＢとセカンダリＤＢとで同期をとる
//exec('/usr/bin/sudo -u postgres /usr/bin/rsync -av --delete -e \'ssh -i /home/postgres/.ssh/dsa_KMDB2-RES_postgres\' ' . PGDATA_MASTER . ' ' . HOST_SECOND . ':' . PGDATA_SECOND);
//予備環境は起動させずに待機させるためコメントアウト
//// マスターＤＢ起動
//popen('/usr/bin/sudo -u postgres /usr/local/pgsql/bin/pg_ctl.org -o \'-p ' . PORT_MASTER . '\' -D ' . PGDATA_MASTER . ' -w start', 'r');
//// セカンダリＤＢを起動するよう指示用ファイルを作成
//exec('/bin/touch ' . LOCAL_DIR . POST_START);
//// セカンダリへ起動を指示するファイルを転送する
//exec('/usr/bin/scp ' . LOCAL_DIR . POST_START . ' ' . USER_SECOND . '@' . HOST_SECOND . ":" . REMOTE_DIR);
//// セカンダリＤＢを起動する指示用ファイルを削除
//unlink(LOCAL_DIR . POST_START);
//// セカンダリＤＢが起動したかどうかをチェック
//// ＤＢ起動完了報告ファイルが転送されているかチェック
//// ＤＢ起動完了報告ファイルの転送が完了していない場合はsleepし、
//// 一定時間経過した場合は処理を終了する
//while(file_exists(LOCAL_DIR . POST_STARTED) == false){
//	// 積算秒数チェック
//	if($waitSec > MAX_DB_WAIT_INTERVAL){
//		print mb_convert_encoding("セカンダリＤＢから起動完了の応答がない為、処理を終了します\n", "UTF-8", "EUC_JP");
//		errExit("予備環境自動レストア失敗", "セカンダリＤＢから起動完了の応答がない為、処理を終了します");
//	}
//	sleep(DB_WAIT_INTERVAL);
//	$waitSec = $waitSec + DB_WAIT_INTERVAL;
//}
//// ＤＢ起動完了報告を削除
//unlink(LOCAL_DIR . POST_STARTED);
//// 別プロセスでpgpool起動
//popen('/usr/bin/sudo -u postgres /usr/local/bin/pgpool -n >> /dev/null 2>&1 &', 'r');
//// 少し待たないと次のＤＢ処理でエラーになる
//sleep(5);
//// vacuumdb
//exec('/usr/local/pgsql/bin/vacuumdb.org -U postgres --analyze ' . DATABASE);
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
const LOCAL_DIR = "/home/web/restore/";
const PGDATA_MASTER = "/usr/local/pgsql/data/";
const PGDATA_SECOND = "/usr/local/pgsql/data/";
const HOST_SECOND = "192.168.2.62";
const PORT_TEMP = "6666";
const DATABASE = "kcsmotion";
const DATABASESTORAGE = "kcsmotion-storage";
const USERNAME = "postgres";
const DATA_WAIT_INTERVAL = 900;
const MAX_DATA_WAIT_INTERVAL = 18000;
print(date("Y-m-d H:i:s") + " \u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u30D0\u30C3\u30C1\u958B\u59CB\n");
var waitSec = 0;

while (file_exists(LOCAL_DIR + date("Ymd")) == false) //積算秒数チェック
{
	if (waitSec > MAX_DATA_WAIT_INTERVAL) {
		print("\u672C\u756A\uFF24\uFF22\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30D5\u30A1\u30A4\u30EB\u304C\u8EE2\u9001\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
		errExit("\u4E88\u5099\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5931\u6557", "\u672C\u756A\uFF24\uFF22\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30D5\u30A1\u30A4\u30EB\u304C\u8EE2\u9001\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	}

	sleep(DATA_WAIT_INTERVAL);
	waitSec = waitSec + DATA_WAIT_INTERVAL;
}

var fp = fopen(PASS_FILE, "w");
fwrite(fp, "*:*:*:" + USERNAME + ":" + G_DB_PASS);
fclose(fp);
chmod(PASS_FILE, 600);
sleep(5);
exec("/usr/local/pgsql/bin/psql.org -U postgres -l", A_rtn);

for (var rtn of Object.values(A_rtn)) //予備環境が既に起動中の場合は自動レストアしない
{
	var A_tmp = split("\\|", rtn);
	var tmp = A_tmp[0].trim();

	if (tmp == DATABASE) {
		print("\u4E88\u5099\u74B0\u5883\u304C\u8D77\u52D5\u4E2D\u306E\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\u4E88\u5099\u74B0\u5883\u304C\u672C\u756A\u74B0\u5883\u3068\u3057\u3066\u52D5\u4F5C\u3057\u3066\u3044\u308B\u5834\u5408\u306F\u3001\u672C\u30D0\u30C3\u30C1\u3092\u505C\u6B62\u3057\u3066\u304F\u3060\u3055\u3044\n");
		errExit("\u4E88\u5099\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5B9F\u884C\u305B\u305A", "\u4E88\u5099\u74B0\u5883\u304C\u8D77\u52D5\u4E2D\u306E\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\u4E88\u5099\u74B0\u5883\u304C\u672C\u756A\u74B0\u5883\u3068\u3057\u3066\u52D5\u4F5C\u3057\u3066\u3044\u308B\u5834\u5408\u306F\u3001\u672C\u30D0\u30C3\u30C1\u3092\u505C\u6B62\u3057\u3066\u304F\u3060\u3055\u3044");
	}
}

unlink(LOCAL_DIR + date("Ymd"));
popen("/usr/bin/sudo -u postgres /usr/local/pgsql/bin/pg_ctl.org -o '-p " + PORT_TEMP + "' -D " + PGDATA_MASTER + " -w start", "r");
sleep(5);
exec("/usr/local/pgsql/bin/dropdb.org " + DATABASE + " -U postgres -p " + PORT_TEMP);
exec("/usr/local/pgsql/bin/dropdb.org " + DATABASESTORAGE + " -U postgres -p " + PORT_TEMP);
exec("/usr/local/pgsql/bin/createdb.org " + DATABASE + " -U postgres -p " + PORT_TEMP);
exec("/usr/local/pgsql/bin/createdb.org " + DATABASESTORAGE + " -U postgres -p " + PORT_TEMP);

if (file_exists(LOCAL_DIR + DATABASE + "-" + date("D") + ".gz") == true) //マスターＤＢレストア
	//exec('/usr/local/pgsql/bin/psql.org -U postgres -e ' . DATABASE . ' -p ' . PORT_TEMP . ' < ' . LOCAL_DIR . DATABASE . '-' . date("D"));
	//バックアップデータがなかった場合(kcsv2)
	{
		exec("/bin/gunzip -c " + LOCAL_DIR + DATABASE + "-" + date("D") + ".gz | /usr/local/pgsql/bin/psql.org -U postgres -e " + DATABASE + " -p " + PORT_TEMP);
	} else //マスターＤＢ停止
	{
		print(DATABASE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
		exec("/usr/bin/sudo -u postgres /usr/local/pgsql/bin/pg_ctl.org -p " + PORT_TEMP + " -D " + PGDATA_MASTER + " -m f stop");
		errExit("\u4E88\u5099\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5931\u6557", DATABASE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	}

if (file_exists(LOCAL_DIR + DATABASESTORAGE + "-" + date("D") + ".gz") == true) //マスターＤＢレストア
	//exec('/usr/local/pgsql/bin/psql.org -U postgres -e ' . DATABASESTORAGE . ' -p ' . PORT_TEMP . ' < ' . LOCAL_DIR . DATABASESTORAGE . '-' . date("D"));
	//バックアップデータがなかった場合(kcsv2-strage)
	{
		exec("/bin/gunzip -c " + LOCAL_DIR + DATABASESTORAGE + "-" + date("D") + ".gz | /usr/local/pgsql/bin/psql.org -U postgres -e " + DATABASESTORAGE + " -p " + PORT_TEMP);
	} else //マスターＤＢ停止
	{
		print(DATABASESTORAGE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
		exec("/usr/bin/sudo -u postgres /usr/local/pgsql/bin/pg_ctl.org -p " + PORT_TEMP + " -D " + PGDATA_MASTER + " -m f stop");
		errExit("\u4E88\u5099\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u5931\u6557", DATABASESTORAGE + "\u30EC\u30B9\u30C8\u30A2\u7528\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	}

exec("/bin/rm -f " + LOCAL_DIR + "fin/*");
exec("/bin/mv -f " + LOCAL_DIR + DATABASE + "-" + date("D") + ".gz " + LOCAL_DIR + "fin/");
exec("/bin/mv -f " + LOCAL_DIR + DATABASESTORAGE + "-" + date("D") + ".gz " + LOCAL_DIR + "fin/");
exec("/usr/local/pgsql/bin/vacuumdb.org -U postgres -p " + PORT_TEMP + " --analyze " + DATABASE);
exec("/usr/bin/sudo -u postgres /usr/local/pgsql/bin/pg_ctl.org -p " + PORT_TEMP + " -D " + PGDATA_MASTER + " -m f stop");
unlink(PASS_FILE);
print(date("Y-m-d H:i:s") + " \u4E88\u5099\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u30D0\u30C3\u30C1\u7D42\u4E86\n");
mailSend("\u4E88\u5099\u74B0\u5883\u81EA\u52D5\u30EC\u30B9\u30C8\u30A2\u6210\u529F", "\u672C\u756A\uFF24\uFF22\u3068\u306E\u540C\u671F\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F");
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