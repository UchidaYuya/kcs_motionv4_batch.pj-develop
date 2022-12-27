//
//Voltaデータ取込処理
//
//更新履歴：<br>
//2010/08/05 宝子山浩平 作成
//
//@package script
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2010/08/05
//@uses ImportVoltaBillProc
//
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
error_reporting(E_ALL);

require("process/script/ImportVoltaBillProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new ImportVoltaBillProc();
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