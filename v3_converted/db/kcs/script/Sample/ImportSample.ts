//
//インポート系バッチのサンプル
//
//更新履歴：<br>
//2008/02/27 石崎 作成
//
//@package Sample
//@author ishizaki
//@filesource
//@since 2008/02/27
//
//対応するプロセスを読み込む
//
error_reporting(E_ALL);

require("process/script/Sample/ImportProcSample.php");

GLOBALS.debugging = true;

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new ImportProcSample();
  O_Proc.execute();
} catch (ex) {
  if (ex instanceof MtExcept) //Motion拡張例外はここで受ける、コンストラクターの例外など
    {
      MtExcept.finalMtExceptHandler(ex);
    } else if (true) //一般的な例外はここで受ける、基本的には来ないはず
    {
      MtExcept.finalExceptHandler(ex);
    }
}

throw die(0);