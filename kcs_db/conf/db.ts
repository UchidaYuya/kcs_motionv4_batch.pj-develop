// export interface global {}
var dbUser = "web";	
var dbPass = trim(file_get_contents("/kcs/conf/dbpassw"));	//外部ファイル記述
var dbHost = "localhost:5432";
//$dbHost = "192.168.30.34:6543";	//pool無し
var dbName = "check-kcsmotion";

// MySQL="mysql", PostgreSQL="pgsql", MS SQL-Server="mssql", ODBC="odbc" などを指定
var dbType = "pgsql";

global.G_dsn = "$dbType://$dbUser:$dbPass@$dbHost/$dbName";

// コネクションプールする
global.GH_dboption = { persistent : true };
/*
$GLOBALS["GH_dboption"] = array("persistent" => true
								"portability" => MDB2_PORTABILITY_ALL ^ MDB2_PORTABILITY_EMPTY_TO_NULL
								);
*/
// コネクションプールしない
//$H_dboption = false;

