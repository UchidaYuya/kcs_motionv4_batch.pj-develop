//
//ＳＵＯ 福山運輸購買データ取込処理
//
//更新履歴：<br>
//2010/02/03 宮澤龍彦 作成
//
//@package SUO
//@author miyazawa<miyazawa@motion.co.jp>
//@filesource
//@since 2010/02/03
//@uses SuoImportFukuyamaProc
//
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
error_reporting(E_ALL);

require("process/script/SuoImportFukuyamaProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new SuoImportFukuyamaProc();
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