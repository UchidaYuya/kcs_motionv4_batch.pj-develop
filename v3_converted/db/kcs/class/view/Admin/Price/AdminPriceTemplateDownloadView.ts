//
//価格表テンプレートダウンロードビュー
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/08
//@filesource
//@uses ViewBase
//
//
//価格表テンプレートダウンロードビュー
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/08
//@uses ViewBase
//

require("view/ViewBaseHtml.php");

//
//template_name
//
//@var string
//@access protected
//
//
//template_path
//
//@var string
//@access protected
//
//
//コンストラクタ
//
//@author kitamura
//@since 2009/09/08
//
//@access public
//@return void
//
//
//画面表示
//
//@author kitamura
//@since 2009/09/08
//
//@access public
//@return void
//
//
//テンプレートファイルのパスを設定
//
//@author kitamura
//@since 2009/09/08
//
//@access protected
//@return void
//
class AdminPriceTemplateDownloadView extends ViewBaseHtml {
	constructor(site = undefined) {
		if (true == is_null(site)) {
			site = ViewBaseHtml.SITE_ADMIN;
		}

		super({
			site: site
		});
		this.template_name = "price_list.xls";
	}

	display() {
		this.setTemplatePath();

		if (!is_readable(this.template_path)) {
			this.errorOut(4, this.template_path + "\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
		}

		header("Cache-Control: private");
		header("Pragma: private");
		header("Content-type: applicatioin/octet-stream;");
		header("Content-Disposition: attachment; filename=\"" + this.template_name + "\"");
		header("Content-Length: " + filesize(this.template_path));
		header("Content-Transfer-Encoding: binary");
		ob_clean();
		echo(file_get_contents(this.template_path));
		throw die();
	}

	setTemplatePath() //テンプレートファイルのパス
	{
		this.template_path = this.getSetting().KCS_DIR + "/class/view/Admin/Price/" + this.template_name;
	}

};