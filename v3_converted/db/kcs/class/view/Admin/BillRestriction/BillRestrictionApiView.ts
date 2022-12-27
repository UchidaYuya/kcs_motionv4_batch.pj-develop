require("MtSession.php");

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//__construct
//
//@author web
//@since 2018/09/11
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author web
//@since 2018/09/11
//
//@access public
//@return void
//
//
//getLocalSession
//
//@author web
//@since 2018/09/25
//
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2018/09/11
//
//@access public
//@return void
//
class BillRestrictionApiView extends ViewSmarty {
	constructor() {
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.O_Sess = MtSession.singleton();
	}

	checkCGIParam() //グループぽよ
	//GETパラメーターは削除する
	{
		this.H_Local = this.O_Sess.getSelfAll();

		if (undefined !== _GET.g) {
			this.H_Local.groupid = +_GET.g;
		}

		if (undefined !== _GET.p) {
			this.H_Local.pactid = +_GET.p;
		}

		if (!(undefined !== this.H_Local.carid)) //初期値はドコモ(´･ω･`)
			{
				this.H_Local.carid = 1;
			}

		this.O_Sess.SetSelfAll(this.H_Local);

		if (!!_GET) {
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	getLocalSession() {
		return this.H_Local;
	}

	__destruct() {
		super.__destruct();
	}

};