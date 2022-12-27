//
//テストプロセスAJAX
//
//更新履歴：<br>
//2008/06/25 上杉勝史 作成
//
//@uses ProcessBaseHtml
//@package TEST
//@filesource
//@author katsushi
//@since 2008/06/25
//
//error_reporting(E_ALL|E_STRICT);
//
//
//テストプロセスAJAX
//
//@uses ProcessBaseHtml
//@package TEST
//@author katsushi
//@since 2008/06/25
//

require("process/ProcessBaseHtml.php");

require("model/TEST/TESTModel.php");

require("view/TEST/TESTJsonView.php");

//
//__construct
//
//@author katsushi
//@since 2008/06/25
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author katsushi
//@since 2008/06/25
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
class TESTJsonProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //// view の生成
	//// model の生成
	//Smartyによる表示
	{
		var cnt, A_option;
		var O_view = new TESTJsonView();
		var O_model = new TESTmodel();
		var where_sql = O_model.makeWhereSQL(O_view.getSearchColumn(), O_view.getSearchWord());
		var orderby_sql = O_model.makeOrderBySQL(O_view.getSortColumn(), O_view.getSortType());
		var limit_sql = O_model.makeLimitSQL(O_view.getLimit(), O_view.getOffset());
		[cnt, A_option] = O_model.getOption(where_sql, orderby_sql, limit_sql);
		O_view.sendJson(A_option, cnt);
	}

	__destruct() {
		super.__destruct();
	}

};