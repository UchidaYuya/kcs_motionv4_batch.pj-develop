//
//ＫＧ請求データ（転送用内線別月報ファイル）取込処理
//
//更新履歴：<br>
//2009/04/15 前田 聡 作成
//
//@package script
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/04/15
//@uses KgImportBillProc
//
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
error_reporting(E_ALL);

require("process/script/KgImportBillProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new KgImportBillProc();
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