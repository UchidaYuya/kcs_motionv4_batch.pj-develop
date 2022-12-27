//
//ＫＧ対応 KCS Motion上の電話の所属部署がＦＥＳＴＡ上の電話の部署情報と同じかをチェックする
//
//更新履歴：<br>
//2009/04/08 前田 聡 作成
//
//@package script
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/04/08
//@uses KgCheckTelnoPostidProc
//
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
error_reporting(E_ALL);

require("process/script/KgCheckTelnoPostidProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new KgCheckTelnoPostidProc();
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