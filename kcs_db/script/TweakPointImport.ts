//
//ポイント調整　ポイントインポート
//
//更新履歴：<br>
//2008/03/05 石崎公久 作成
//
//@author ishizaki<ishizaki@motion.co.jp>
//@filesource
//@since 2008/03/05
//
//
//対応するプロセスを読み込む
// error_reporting(E_ALL);// 2022cvt_011

// 2022cvt_026
// require("process/script/TweakPointImport.php");
import TweakPointImport from "../../script/class/process/script/TweakPointImport";
import MtExcept from "../class/MtExcept";

try //プロセスオブジェクトの生成
//プロセスの実行
{
// 2022cvt_015
  var O_Proc = new TweakPointImport();
  O_Proc.doExecute();
} catch (ex) {
  if (ex instanceof MtExcept) //Motion拡張例外はここで受ける、コンストラクターの例外など
    {
      MtExcept.finalMtExceptHandler(ex);
    } else if (true) //一般的な例外はここで受ける、基本的には来ないはず
    {
      MtExcept.finalExceptHandler(ex);
    }
}

throw process.exit(0);// 2022cvt_009
