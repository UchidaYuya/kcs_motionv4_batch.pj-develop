//
//
//
//更新履歴：<br>
//2016/01/08 伊達幸祐 作成
//
//@package
//@author
//@filesource
//@since 2016/01/08
//@uses CalcAddBillProc
//
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
error_reporting(E_ALL);

require("process/script/CalcAddBillProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new CalcAddBillProc();
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