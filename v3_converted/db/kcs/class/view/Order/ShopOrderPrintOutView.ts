//
//受注印刷Viewクラス
//
//更新履歴：<br>
//2008/06/30 igarashi 作成
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/06/30
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//受注印刷Viewクラス
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/06/30
//@uses MtSetting
//@uses MtSession
//

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/Order/ShopOrderDetailView.php");

//
//コンストラクタ <br>
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return void
//
//
//CGIパラメータを取得する
//
//@author igarashi
//@since 2008/07/03
//
//@access public
//@return none
//
//
//Smartyによる表示
//
//@author igarashi
//@since 2008/06/30
//
//@param mixed $O_form
//@access protected
//@return void
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return void
//
class ShopOrderPrintOutView extends ShopOrderDetailView {
	constructor(H_param = Array()) {
		super(H_param);
	}

	checkCGIParamPeculiar() {
		var sess = this.getLocalSession();

		if (true == (undefined !== _POST.print)) {
			this.H_Dir.orderid = _POST.print;
		} else if (true == (undefined !== sess[ShopOrderPrintOutView.PUB].orderid)) {
			this.H_Dir.orderid = sess[ShopOrderPrintOutView.PUB].orderid;
		} else {
			this.getOut().errorOut(5, "orderid\u304C\u306A\u3044", false);
		}

		if (true == (undefined !== _GET.m)) {
			this.H_Dir.printmode = _GET.m;
		} else {
			delete this.H_Dir.printmode;
		}

		this.O_Sess.setSelfAll(this.H_Local);
		this.O_Sess.setPub(ShopOrderPrintOutView.PUB, this.H_Dir);
	}

	displaySmarty(H_g_sess, H_sess, H_view, A_PactAuth = Array()) //状況に応じてテンプレートファイルを変える
	{
		this.get_Smarty().assign("H_order", H_view.order);
		this.get_Smarty().assign("H_machine", H_view.machine);
		this.get_Smarty().assign("H_acce", H_view.acce);
		this.get_Smarty().assign("H_sub", array_merge(H_view.machine, H_view.acce));
		this.get_Smarty().assign("H_regist", H_view.regist);
		this.get_Smarty().assign("H_correct", H_view.correct);
		this.get_Smarty().assign("postcode", H_view.transcode);
		this.get_Smarty().assign("H_calc", H_view.calc.indiv);
		this.get_Smarty().assign("H_allcalc", H_view.calc.total);
		this.get_Smarty().assign("H_user", H_view.user);
		this.get_Smarty().assign("H_option", H_view.option);
		this.get_Smarty().assign("H_discounts", H_view.discounts);
		this.get_Smarty().assign("H_service", H_view.service);
		this.get_Smarty().assign("telviewflg", H_view.telviewflg);
		this.get_Smarty().assign("nowtime", H_view.nowtime);
		this.get_Smarty().assign("printuser", H_g_sess.personname);
		this.get_Smarty().assign("A_PactAuth", A_PactAuth);

		if (true == (undefined !== H_sess[ShopOrderPrintOutView.PUB].printmode) && "cert" == H_sess[ShopOrderPrintOutView.PUB].printmode) {
			this.get_Smarty().display("print_certificate.tpl");
		} else if (true == (-1 !== this.O_order.A_machinebuyview.indexOf(H_view.order.ordertype))) {
			this.get_Smarty().display("print_machine.tpl");
		} else {
			this.get_Smarty().display("print_plan.tpl");
		}
	}

	__destruct() {
		super.__destruct();
	}

};