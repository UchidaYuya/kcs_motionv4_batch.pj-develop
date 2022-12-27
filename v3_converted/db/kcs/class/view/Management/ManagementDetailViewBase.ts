//
//詳細画面のView基底
//
//更新履歴：<br>
//2008/03/10 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/27
//@filesource
//@uses ManagementViewBase
//
//
//error_reporting(E_ALL);
//
//詳細画面のView基底
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/27
//@uses ManagementViewBase
//

require("view/Management/ManagementViewBase.php");

require("MtPostUtil.php");

//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/03/27
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//セッションが無い時デフォルト値を入れる
//
//最初のアクセス時のみ2重登録防止セッションを作る<br>
//
//@author houshiyama
//@since 2008/03/27
//
//@access private
//@return void
//
//
//詳細画面共通のCGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//一覧で指定されたIDをセッションに入れる<br>
//請求からきた場合は必要なセッションを作る<br>
//（カレント部署、カレント年月作成）<br>
//（一覧表示の部署の絞込み条件作成）<br>
//（請求から呼ばれたフラグ作成）<br>
//
//@author houshiyama
//@since 2008/03/27
//
//@access public
//@return void
//
//
//パラメータチェック <br>
//
//管理情報基底のパラメータチェック<br>
//
//@author houshiyama
//@since 2008/03/27
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//データのエラーチェック
//
//@author houshiyama
//@since 2008/05/01
//
//@param mixed $H_data
//@param mixed $H_sess
//@access public
//@return void
//
//
//Smartyを用いた画面表示<br>
//
//各データをSmartyにassign<br>
//jsもここでassignしています<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/03/27
//
//@param array $A_auth（権限一覧）
//@param array $H_data（表示データ）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/03/27
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/27
//
//@access public
//@return void
//
class ManagementDetailViewBase extends ManagementViewBase {
	constructor() {
		super();
	}

	setDefaultSession() {}

	checkCGIParam() //最初のアクセス時
	{
		this.setDefaultSession();

		if (undefined !== _GET.id == true) //請求からきた時
			{
				this.H_Local.id = _GET.id;

				if (undefined !== _GET.prm == true) //部署ID、カレント年月を取得
					//部署表示条件は管理内では常にあるのでここで作る
					//請求から来たフラグ
					{
						var A_prm = split(":", _GET.prm);
						this.H_Dir.current_postid = A_prm[0];
						var year = A_prm[1].substr(0, 4);
						var month = str_pad(A_prm[1].substr(4), 2, "0", STR_PAD_LEFT);
						this.H_Dir.cym = year + month;
						this.H_Dir.posttarget = 0;
						this.O_Sess.setPub(ManagementDetailViewBase.PUB, this.H_Dir);
						this.H_Local.bill = 0;
					}
			}

		this.O_Sess.setSelfAll(this.H_Local);
	}

	checkParamError(H_sess, H_g_sess) //管理情報基底のパラメータチェック
	//IDが無ければエラー
	{
		this.checkBaseParamError(H_sess, H_g_sess);

		if (undefined !== H_sess.SELF.id == false) {
			this.errorOut(8, "\u30AD\u30FC\u6307\u5B9A\u304C\u7121\u3044", false, "./menu.php", "\u9589\u3058\u308B");
		}
	}

	checkDataError(H_data, H_sess) {
		if (Array.isArray(H_data) == false || H_data.length < 2) {
			if (undefined !== H_sess.bill == true) {
				this.errorOut(35, "\u30C7\u30FC\u30BF\u304C\u7121\u3044", false, "./menu.php", "\u9589\u3058\u308B");
			} else {
				this.errorOut(35, "\u6A29\u9650\u304C\u7121\u3044", false, "./menu.php", "\u9589\u3058\u308B");
			}
		}
	}

	displaySmarty(A_auth: {} | any[], H_data: {} | any[], H_prop: {} | any[]) //部署名
	//assign
	//S185
	//display
	{
		var O_post = new MtPostUtil();
		H_data.postname = O_post.getPostTreeBand(this.O_Sess.pactid, this.O_Sess.postid, H_data.postid, H_data.tableno, " -> ", "", 1, true, false);
		this.get_Smarty().assign("A_auth", A_auth);
		this.get_Smarty().assign("H_data", H_data);
		this.get_Smarty().assign("H_prop", H_prop);
		this.get_Smarty().assign("propcnt", H_prop.length);
		this.get_Smarty().assign("js", this.getHeaderJS());
		this.get_Smarty().assign("receiptdate_flg", -1 !== A_auth.indexOf("fnc_receipt"));
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	getHeaderJS() {
		var str = "<script language=\"Javascript\" src=\"/js/subwindow.js\"></script>";
		return str;
	}

	__destruct() {
		super.__destruct();
	}

};