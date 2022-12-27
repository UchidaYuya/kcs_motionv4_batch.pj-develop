//
//交通費データ取込バッチ
//
//更新履歴：<br>
//2010/04/19 宮澤龍彦 作成
//
//@package script
//@author miyazawa<miyazawa@motion.co.jp>
//@filesource
//@uses ImportFelicaProc
//
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
error_reporting(E_ALL);

require("process/script/ImportFelicaProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new ImportFelicaProc();
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