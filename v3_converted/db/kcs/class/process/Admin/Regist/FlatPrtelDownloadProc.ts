//error_reporting(E_ALL|E_STRICT);
//
//FlatExemptDownloadProc
//
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2015/09/28
//

require("process/ProcessBaseHtml.php");

require("ManagementUtil.php");

require("view/Admin/Regist/FlatPrtelDownloadView.php");

require("model/Admin/Regist/FlatPrtelDownloadModel.php");

//
//__construct
//
//@author web
//@since 2015/09/28
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//
//@author web
//@since 2015/09/28
//
//@access protected
//@return void
//
//
//get_Model
//
//@author web
//@since 2015/09/28
//
//@access protected
//@return void
//
//
//doExecute
//
//@author web
//@since 2015/09/28
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//
//@author web
//@since 2015/09/28
//
//@access public
//@return void
//
class FlatPrtelDownloadProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new FlatPrtelDownloadView();
	}

	get_Model() {
		return new FlatPrtelDownloadModel(this.get_DB());
	}

	doExecute(H_param: {} | any[] = Array()) //idの取得
	//設定弄り
	//ini_set('max_execution_time', 6000);
	//ini_set('memory_limit', '2048M');
	//ini_set('memory_limit', '1600M');
	//view の生成
	//ログインチェック
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//ダウンロードデータの取得
	//ダウンロードファイル名決定
	//CSV出力
	{
		var docid = _GET.docid;
		var O_view = this.get_View();
		O_view.startCheckDownload();
		var O_model = this.get_Model(H_g_sess, O_manage);
		var H_sess = O_view.getLocalSession();
		var H_data = O_model.getPrtel(H_sess.pactid, _GET.flattype, _GET.mcntype);
		O_view.setFileName("\u89AA\u756A\u53F7\u30EA\u30B9\u30C8.csv");
		O_view.displayCSV(H_data, O_model);
	}

	__destruct() {
		super.__destruct();
	}

};