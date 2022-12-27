//
//電話予約実行処理
//
//更新履歴：<br>
//2008/06/05 前田 聡 作成
//
//@package TelReserve
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2008/09/08
//@uses TelReserveExecProc
//
//
//対応するプロセスを読み込む
error_reporting(E_ALL);

require("process/script/TelReserveExecProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new TelReserveExecProc();
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