//
//au brossデータ ダウンロード
//
//更新履歴：<br>
//2009/06/01 前田 聡 作成
//
//@package script
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/06/01
//@uses AuDonwloadProc
//
//
//対応するプロセスを読み込む
//$GLOBALS["debugging"] = true;
// error_reporting(E_ALL);// 2022cvt_011

// 2022cvt_026
// require("process/script/AuDownloadProc.php");
import MtExcept from '../class/MtExcept';
import AuDownloadProc from '../class/process/script/AuDownloadProc';

try //プロセスオブジェクトの生成
//プロセスの実行
{
// 2022cvt_015
  var O_Proc = new AuDownloadProc();
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

throw process.exit(0);// 2022cvt_009
