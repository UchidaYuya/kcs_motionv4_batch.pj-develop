//
//SUO
//
//更新履歴：<br>
//2008/04/25 石崎公久 作成
//
//@author ishizaki<ishizaki@motion.co.jp>
//@filesource
//@since 2008/04/25
//
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
error_reporting(E_ALL);

require("process/script/SuoImportEtcUfjNicosProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new SuoImportEtcUfjNicosProc();
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