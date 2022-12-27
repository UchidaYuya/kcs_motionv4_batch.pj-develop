//
//ドコモ二段階認証
//
//更新履歴：<br>
//2018/05/25 森原浩司 作成
//
//@package script
//@author morihara<morihara@motion.ne.jp>
//@filesource
//@since 2018/05/25
//@uses DocomoTerminalRegistProc
//
//
//対応するプロセスを読み込む
error_reporting(E_ALL);

require("process/script/DocomoTerminalRegistProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new DocomoTerminalRegistProc();
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