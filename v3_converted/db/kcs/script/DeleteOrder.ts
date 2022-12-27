//
//過去の注文を削除
//
//@package script
//@author igarashi
//@filesource
//@since 2011/09/13
//@uses ImportVoltaBillProc
//
//
//対応するプロセスを読み込む
error_reporting(E_ALL);

require("process/script/DeleteOrderProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new DeleteOrderProc();
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
echo("\n");