//
//証明書期限切れ警告メール
//
//更新履歴：<br>
//2010/06/17 宮澤龍彦 作成
//
//@author miyazawa<miyazawa@motion.co.jp>
//@filesource
//@since 2010/06/217
//
//
//対応するプロセスを読み込む
error_reporting(E_ALL);

var _SESSION = Array();

require("process/script/CertificateWarningMailProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new CertificateWarningMailProc();
  O_Proc.execute();
} catch (ex) {
  if (ex instanceof MtExcept) //Motion拡張例外はここで受ける、コンストラクターの例外など
    {
      MtExcept.finalMtExceptHandler(ex);
    } else if (true) //一般的な例外はここで受ける、基本的には来ないはず
    {
      MtExcept.finalExceptHandler(ex);
    }
}

throw die(0);