//
//ポイント表示Viewの基底クラス
//
//更新履歴<br>
//2008/04/10 石崎公久 作成
//
//@uses ViewSmarty
//@abstract
//@package SUO
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/10
//@filesource
//
//
//
//TweakPointViewBase
//
//@uses ViewSmarty
//@abstract
//@package SUO
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/10
//

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

//
//A_PointList
//
//@var mixed
//@access protected
//
//
//TweakNavi
//
//@var mixed
//@access protected
//
//
//BillDate
//
//@var mixed
//@access protected
//
//
//コンストラクタ
//
//@author ishizaki
//@since 2008/04/11
//
//@access public
//@return void
//
//
//setPointList
//
//@author ishizaki
//@since 2008/05/01
//
//@param mixed $A_point_list
//@access public
//@return void
//
//
//setBilldate
//
//@author ishizaki
//@since 2008/05/01
//
//@param mixed $date
//@access public
//@return void
//
//
//displaySmarty
//
//@author ishizaki
//@since 2008/05/01
//
//@access public
//@return void
//
//
//getTweakNavi
//
//@author ishizaki
//@since 2008/05/01
//
//@access public
//@return void
//
class TweakPointViewBase extends ViewSmarty {
	constructor(H_navi) {
		super();
		this.A_PointList = Array();
		this.TweakNavi = MakePankuzuLink.makePankuzuLinkHTML(H_navi);
	}

	setPointList(A_point_list) {
		this.A_PointList = A_point_list;
	}

	setBilldate(date) {
		this.BillDate = sprintf("%04d\u5E74%2d\u6708", date.substr(0, 4), date.substr(5, 7));
	}

	displaySmarty() {
		this.get_Smarty().assign("billdate", this.BillDate);
		this.get_Smarty().assign("pactlistcount", this.A_PointList.length);
		this.get_Smarty().assign("A_pactlist", this.A_PointList);
		this.get_Smarty().assign("page_path", this.TweakNavi);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	getTweakNavi() {
		return this.TweakNavi;
	}

	__destruct() {
		super.__destruct();
	}

};