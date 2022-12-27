//error_reporting(E_ALL|E_STRICT);
//
//エラー画面表示を行うＶＩＥＷ
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ViewSmarty
//@uses GroupModel
//@package Base
//@subpackage View
//@filesource
//@author nakanita
//@since 2008/03/06
//
//
//
//エラー画面表示を行うＶＩＥＷ
//
//@uses ViewBase
//@package Base
//@subpackage View
//@author nakanita
//@since 2008/02/08
//

require("Log.php");

// require("view/ViewSmarty.php");

// require("model/GroupModel.php");
import ViewSmarty from '../view/ViewSmarty';
import GroupModel from '../model/GroupModel';
import MtSetting from '../MtSetting';

//
//ショップＩＤ、ショップ側かどうかの判断に用いている
//
//@var integer
//@access private
//
//
//設定一覧
//
//@var mixed
//@access private
//
//
//グループmodel
//
//@var mixed
//@access private
//
//
//メインメニューに戻るエラー種別
//
//@var array
//@access private
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param integer $traceflg0 トレースを行うかどうかのフラグ
//@param integer $shopid default="" ショップＩＤ
//@access public
//@return void
//
//
//メインメニューに戻るエラー種別を設定する
//
//@author nakanita
//@since 2008/03/06
//
//@param array $A_err メインメニューに戻るエラーコードを含んだ配列
//@access public
//@return void
//
//
//エラー画面表示
//
//@author nakanita
//@since 2008/03/06
//
//@param string $errormessage エラーメッセージ
//@param integer $code
//@param string $goto 戻り先指定 "GOTOP" の場合はトップに戻る
//@param string $buttonstr 戻りボタンの表記
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/04/10
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//

const fs = require("fs"); 
const path = require('path');
export default class ViewError extends ViewSmarty {
	ShopID: string;
	A_error_main: any;
	O_Conf: any;
	O_group: GroupModel;
	constructor(shopid = "") {
		var H_param = {
			common: true,
			skip: true
		};
		super(H_param);
		this.O_Conf = MtSetting.singleton();
		this.O_group = new GroupModel();
		this.ShopID = shopid;
		this.A_error_main = Array();
		
	}

	setErrorMain(A_err: {} | any[]) {
		this.A_error_main = A_err;
	}

	display(errormessage, code = 0, goto = "", buttonstr = "戻 る") //エラー時の戻り先の指定.
	//DEBUG *
	//		print( "<HTML><HEAD></HEAD><BODY>" );
	//		print( $errormessage );
	//		print( "<BR><BR><a href=\"javascript:history.back()\">戻る</a>" );
	//		print( "</BODY></HTML>" );
	{
		if (goto != "") //戻り先の指定があればそこへ 20040709miya修正
			{
				if (goto == "GOTOP") //ショップから来た場合はショップのトップに戻る.20061006naka修正
					{
						if (this.ShopID != "" || "/^\\/Shop/".match(process.PHP_SELF)) //"/Shop"以下で実行
							//ショップから来た場合はショップのメニューに戻る.
							{
								var backurl = "/Shop/menu.php";
							} else //通常メニューに戻る.
							{
								backurl = "/Menu/menu.php";
							}
					} else {
					backurl = goto;
				}
			} else //戻り先の指定がなければ場合によって違う
			{
				if (-1 !== this.A_error_main.indexOf(code)) //20040629森原修正
					{
						var backdir = "";

						if ("" == global.GROUPID) {
							global.GROUPID = _POST.group;
						}

						if ("" != global.GROUPID) {
							backdir = "/" + this.O_group.getGroupName(global.GROUPID);
						}

						if (this.ShopID != "" || "/^\\/Shop/".match(process.PHP_SELF)) //"/Shop"以下で実行
							//ショップから来た場合はショップのトップに戻る.
							{
								backurl = backdir + "/index_shop.php";
							} else //通常の場合は通常トップに戻る.
							{
								backurl = backdir + "/";
							}
					} else //メニューに戻る.
					{
						if (!"/\\/menu\\.php/".match(process.PHP_SELF) && fs.existsSync(path.dirname(process.SCRIPT_FILENAME) + "/menu.php") == true) {
							backurl = path.dirname(process.PHP_SELF) + "/menu.php";
						} else //１つ前に戻る.
							{
								backurl = "javascript:history.back();";
							}
					}
			}

		this.get_Smarty().assign("backurl", backurl);
		this.get_Smarty().assign("msg", errormessage);
		this.get_Smarty().assign("buttonstr", buttonstr);
		this.get_Smarty().assign("js", this.getHeaderJS());
		this.get_Smarty().display("err.tpl");
	}

	getHeaderJS() {
		var str = "<script language=\"Javascript\" src=\"/js/subwindow.js\"></script>";
		return str;
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};