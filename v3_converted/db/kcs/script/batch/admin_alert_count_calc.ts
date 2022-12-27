//
//au・softbankの警告・電話カウント・計算バッチ
//
//更新履歴：<br>
//2009/10/28 宮澤龍彦 作成
//
//@package script
//@author miyazawa<miyazawa@motion.co.jp>
//@filesource10/28
//@uses AdminAlertCountCalcProc
//
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
error_reporting(E_ALL);

require("process/script/AdminAlertCountCalcProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new AdminAlertCountCalcProc();
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