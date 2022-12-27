//過去に渡って電話利用グラフデータの準備を行う
//データ準備のため、最初に1回だけかけるスクリプト
//2009/02/25	T.Naka
//対象キャリア一覧
//開始する年月
//$year = 2008;
//$month = 7;
var A_carid = [1, 3, 4];
var year = 2009;
var month = 1;

for (var past = 0; past < 24; past++) //print $past . " : " . $yyyymm . "\n";
//1ヶ月前に遡る
{
	var yyyymm = year + sprintf("%02d", month);

	for (var carid of Object.values(A_carid)) //コマンドライン
	{
		var cmd = "php trend_graph.php -c=" + carid + " -y=" + yyyymm + " -m=0 -k=0";
		print("* Do " + cmd + "\n");
		system(cmd, status);

		if (status != 0) {
			print(`ERROR: ${cmd} の実行失敗！\n`);
			throw die(1);
		}
	}

	if (--month <= 0) {
		month = 12;
		--year;
	}
}