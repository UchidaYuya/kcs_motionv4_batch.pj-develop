//
//FelicaDLバッチ
//
//更新履歴：<br>
//2010/04/22 宮澤龍彦 作成
//
//@package script
//@author miyazawa<miyazawa@motion.co.jp>
//@filesource
//@since 2010/04/22
//@uses FelicaDownloadProc
//
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
error_reporting(E_ALL);

require("process/script/FelicaDownloadProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new FelicaDownloadProc();
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