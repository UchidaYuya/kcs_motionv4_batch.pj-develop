//
//運送ID全件ダウンロードProccess
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@filesource
//@subpackage Proccess
//@uses ManagementDownloadProcBase
//@uses TransitDownloadView
//@uses TransitFullDownloadModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//HealthcareFullDownloadProc
//管理情報全件ダウンロード
//@uses ManagementDownloadProcBase
//@package
//@author date
//@since 2015/06/15
//

require("process/Management/ManagementDownloadProcBase.php");

require("view/Management/Healthcare/Download/HealthcareDownloadView.php");

require("model/Management/Healthcare/Download/HealthcareFullDownloadModel.php");

//
//__construct
//コンストラクタ
//@author date
//@since 2015/06/15
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//ビューの取得
//@author date
//@since 2015/06/15
//
//@access protected
//@return void
//
//
//get_Model
//モデルの取得
//@author date
//@since 2015/06/15
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
class HealthcareFullDownloadProc extends ManagementDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new HealthcareDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new HealthcareFullDownloadModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};