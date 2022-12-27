//
//請求データからプラン、パケット等を電話管理に反映する
//
//更新履歴：<br>
//2012/01/24 宝子山浩平 作成
//
//@package script
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2012/01/24
//@uses ReflectBillingData
//
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
error_reporting(E_ALL);

require("process/script/ReflectBillingDataProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new ReflectBillingDataProc();
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