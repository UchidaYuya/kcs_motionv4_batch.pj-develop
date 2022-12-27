//===========================================================================
//機能：VACUUMDBをpgpool経由ではなく、postgresに直接なげるよう改修（KM環境用）
//
//2010/9/9
//作成：前田
//===========================================================================
//パスワードファイル
//マスターＤＢ ＩＰアドレス
//define("HOST_SECOND", "192.168.30.12");				// セカンダリＤＢ ＩＰアドレス
//マスターＤＢ使用ポート
//define("PORT_MASTER","6543");						// マスターＤＢ使用ポート
//define("PORT_SECOND","6543");						// セカンダリＤＢ使用ポート
//ＤＢ名
//ＤＢ名
//ＤＢ接続ユーザ名
//ログ出力
//パスワードファイル作成
//パスワード情報書き込み
//パスワードファイルクローズ
//ファイル権限変更
//少し待たないと次のＤＢ処理でエラーになる
//vacuumdb
//print date("Y-m-d H:i:s") . " " . DATABASESTORAGE . "@" . HOST_SECOND . " 開始\n";
//exec('/usr/local/pgsql/bin/vacuumdb.org -h ' . HOST_SECOND . ' -U ' . USERNAME . ' -p ' . PORT_SECOND . ' --analyze ' . DATABASESTORAGE);
//print date("Y-m-d H:i:s") . " " .DATABASE . "@" . HOST_SECOND . " 開始\n";
//exec('/usr/local/pgsql/bin/vacuumdb.org -h ' . HOST_SECOND . ' -U ' . USERNAME . ' -p ' . PORT_SECOND . ' --analyze ' . DATABASE);
//パスワードファイル削除
error_reporting(E_ALL);

require("../../conf/batch_setting.php");

require("Mail.php");

require("lib/script_db.php");

const PASS_FILE = "/home/web/.pgpass";
const HOST_MASTER = "192.168.30.11";
const PORT_MASTER = "5432";
const DATABASE = "kcsmotion";
const DATABASESTORAGE = "kcsmotion-storage";
const USERNAME = "postgres";
print(date("Y-m-d H:i:s") + " \uFF36\uFF21\uFF23\uFF35\uFF35\uFF2D\u958B\u59CB\n");
var fp = fopen(PASS_FILE, "w");
fwrite(fp, "*:*:*:" + USERNAME + ":" + G_DB_PASS);
fclose(fp);
chmod(PASS_FILE, 600);
sleep(5);
print(date("Y-m-d H:i:s") + " " + DATABASESTORAGE + "@" + HOST_MASTER + " \u958B\u59CB\n");
exec("/usr/local/pgsql/bin/vacuumdb.org -h " + HOST_MASTER + " -U " + USERNAME + " -p " + PORT_MASTER + " --analyze " + DATABASESTORAGE);
print(date("Y-m-d H:i:s") + " " + DATABASE + "@" + HOST_MASTER + " \u958B\u59CB\n");
exec("/usr/local/pgsql/bin/vacuumdb.org -h " + HOST_MASTER + " -U " + USERNAME + " -p " + PORT_MASTER + " --analyze " + DATABASE);
unlink(PASS_FILE);
print(date("Y-m-d H:i:s") + " \uFF36\uFF21\uFF23\uFF35\uFF35\uFF2D\u7D42\u4E86\n");
throw die(0);