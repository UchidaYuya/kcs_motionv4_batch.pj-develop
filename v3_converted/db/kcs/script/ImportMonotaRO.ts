//
//ものたろう取込み(伊達
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
error_reporting(E_ALL);

require("process/script/ImportMonotaroProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
	var O_Proc = new ImportMonotaroProc();
	O_Proc.execute();
} catch (ex) {
	if (ex instanceof MtExcept) //Motion拡張例外はここで受ける、コンストラクターの例外など
		{
			console.log(ex);
		} else if (true) //一般的な例外はここで受ける、基本的には来ないはず
		{
			console.log(ex);
		}
}

throw die(0);