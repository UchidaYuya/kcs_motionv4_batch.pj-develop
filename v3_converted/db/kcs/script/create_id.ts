//引数です
//-----------------------------------------------------------------------
//引数未指定ならヘルプ出す
//-----------------------------------------------------------------------
//idの指定チェック
//id取得
//表示する
//おわり

require("MtDBUtil.php");

var param = Array();

if (argv.length == 1) {
	echo("userid\u30925\u500B\u53D6\u5F97\u3057\u305F\u3044\u5834\u5408\u306F\u4EE5\u4E0B\u306E\u3088\u3046\u306B\n");
	echo("php create_id.php -id=user -num=5\n");
	echo("\n");
	echo("postid\u30926\u500B\u53D6\u5F97\u3057\u305F\u3044\u5834\u5408\u306F\u4EE5\u4E0B\u306E\u3088\u3046\u306B\n");
	echo("php create_id.php -id=post -num=6\n");
	throw die(1);
}

var is_error = false;

for (var i = 1; i < argv.length; i++) //引数の値の書式などチェック
{
	if (!preg_match("/^-(id|num)=/", argv[i])) {
		is_error = true;
		continue;
	}

	var a = argv[i].split("=");
	a[0] = str_replace("-", "", a[0]);

	switch (a[0]) {
		case "id":
			if (!preg_match("/^(user|post)$/", a[1])) {
				echo("id\u306Fuser\u304Bpost\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\n");
				is_error = true;
				break;
			}

			switch (a[1]) {
				case "user":
					a[1] = "user_tb_userid_seq";
					break;

				case "post":
					a[1] = "post_tb_postid_seq";
					break;
			}

			break;

		case "num":
			if (!is_numeric(a[1])) {
				echo("\u6570\u5024\u3044\u308C\u3066\u304F\u3060\u3055\u3044\n");
				is_error = true;
			}

			break;
	}

	if (is_error) {
		continue;
	}

	if (undefined !== param[a[0]]) {
		echo(a[0] + "\u306E\u6307\u5B9A\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\n");
		continue;
	}

	param[a[0]] = a[1];
}

if (!(undefined !== param.id)) {
	echo("id\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044(-id=userid|-id=postid)\n");
	is_error = true;
}

if (!(undefined !== param.num)) {
	echo("num\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044(-num=1)\n");
	is_error = true;
}

if (is_error) {
	echo("\u5F15\u6570\u30A8\u30E9\u30FC\u3067\u3059\n");
	throw die(1);
}

var db = MtDBUtil.singleton();
echo(sprintf("%s\u306E\u30B7\u30FC\u30B1\u30F3\u30B9\u304B\u3089%d\u500B\u53D6\u5F97\n", param.id, param.num));
var sql = sprintf("SELECT nextval('%s') FROM generate_series(1, %d);", param.id, +param.num);
var res = db.queryCol(sql);

for (var value of Object.values(res)) {
	echo(value + "\n");
}