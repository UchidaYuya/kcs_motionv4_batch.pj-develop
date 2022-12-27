//
//販売店受注一覧<br>
//
//更新履歴:<br>
//2008/06/20
//
//@users OrderFormProcBase
//@packages Order
//@subpacckage Process
//@author igarashi
//@since 2008/06/20
//
//
//販売店受注一覧Proc
//
//@uses OrderListMenuProc
//@package Order
//@author igarashi
//@since 2008/08/03
//

require("process/Order/OrderListMenuProc.php");

require("model/Order/ShopOrderMenuModel.php");

require("view/Order/ShopOrderMenuDocomoView.php");

require("model/Order/ShopOrderModelBase.php");

require("OrderUtil.php");

require("MtDateUtil.php");

require("process/Order/ShopOrderMenuProc.php");

//
class ShopOrderMenuDocomoProc extends ShopOrderMenuProc {
  constructor() {
    super();
  }

  get_ShopOrderMenuView() {
    return new ShopOrderMenuDocomoView();
  }

  __destruct() {
    super.__destruct();
  }

};