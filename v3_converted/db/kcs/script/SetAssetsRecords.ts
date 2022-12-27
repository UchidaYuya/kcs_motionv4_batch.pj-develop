//
//assets_tb（assets_X_tb）のレコード設定
//
//更新履歴：<br>
//2011/01/21 宝子山浩平 作成
//
//@package script
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2010/11/26
//@uses SuoImportPark24Proc
//
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
error_reporting(E_ALL);

require("process/script/SetAssetsRecordsProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new SetAssetsRecordsProc();
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