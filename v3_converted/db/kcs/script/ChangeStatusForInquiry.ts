//
//お問合わせのステータスを一定期間で完了に更新
//
//@package script
//@author ishizaki
//@filesource
//@since 2011/03/09
//@uses ImportVoltaBillProc
//
//
//対応するプロセスを読み込む
error_reporting(E_ALL);

require("process/script/ChangeStatusForInquiryProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new ChangeStatusForInquiryProc();
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