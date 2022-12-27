//
//受注Viewの基底クラス
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
//受注Viewの基底クラス
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/06/30
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/ViewFinish.php");

require("MtSession.php");

require("OrderUtil.php");

require("MtUniqueString.php");

//
//ディレクトリ名
//
//
//ディレクトリ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//
//セッションオブジェクト
//
//@var object
//@access protected
//
//
//基底呼出しオブジェクト
//
//@var object
//@access protected
//
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
//一括状態変更、振替、振替キャンセル用のParamチェック
//
//@author igarashi
//@since 2008/08/03
//
//@access protected
//@return none
//
//
//価格表IDをsessionに入れる
//
//@author igarashi
//@since 2008/08/01
//
//@param $listid
//
//@access public
//@return  hash
//
//
//ローカルセッションを取得する
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return void
//
//
//指定したキー以外のsessionを消す
//
//@author igarashi
//@since 2008/06/30
//
//@param $sess(SESSIONキー名)空の場合はself::pub
//
//@access public
//@return void
//
//
//self::PUB以外のSESSIONを消す
//
//@author igarashi
//@since 2008/08/21
//
//@access public
//@return none
//
//
//表示に使用する物を格納する配列を返す
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return mixed
//
//
//最低限必要なセッション情報が無ければエラー表示
//
//@author igarashi
//@since 2008/06/30
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//ヘッダに埋め込むjavascriptを返す
//
//@author igarashi
//@since 2008/07/15
//
//@access protected
//@return str
//
//
//取得したオーダー情報をSESSIONに格納する
//
//@author igarashi
//@since 2008/08/03
//
//@param $H_info
//@return none
//
//
//formをフリーズする
//
//@author igarashi
//@since 2008/07/24
//
//@access public
//@return none
//
//
//QuickFormにデフォルト値を入れる
//
//@author igarashi
//@since 2008/07/23
//
//@param $H_view セットしたい値の配列
//
//@access public
//@return none
//
//
//更新の後処理
//
//@author igarashi
//@since 2008/09/18
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
//setBillView
//
//@author web
//@since 2013/04/10
//
//@param mixed $obj
//@access public
//@return void
//
//
//getBillView
//
//@author web
//@since 2013/04/10
//
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
class ShopOrderDetailViewBase extends ViewSmarty {
	static PUB = "/MTOrder";

	constructor(H_param = Array()) {
		H_param.site = ViewBaseHtml.SITE_SHOP;
		super(H_param);
		this.O_Sess = this.gSess();
		this.H_Dir = this.O_Sess.getPub(ShopOrderDetailViewBase.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
		this.O_order = OrderUtil.singleton();
	}

	checkCGIParam() //POST、GETにもcsrfトークンの値がない場合、トークンの発行を行う
	{
		var sess = this.getLocalSession();

		if (true == (undefined !== _GET.o)) {
			if (is_numeric(_GET.o)) {
				this.H_Dir.orderid = _GET.o;
			} else {
				this.getOut().errorOut(5, "orderid\u304C\u6587\u5B57\u5217\u3067\u3059-->" + _GET.o + "<--", false, "/Shop/menu.php");
			}
		} else if (true == (undefined !== sess[ShopOrderDetailViewBase.PUB].orderid)) {
			if (true == Array.isArray(sess[ShopOrderDetailViewBase.PUB].orderid)) {
				this.getOut().errorOut(5, "orderid\u306E\u5F62\u5F0F\u306B\u8AA4\u308A\u304C\u3042\u308A\u307E\u3059", false, "/Shop/menu.php");
			}

			this.H_Dir.orderid = sess[ShopOrderDetailViewBase.PUB].orderid;
		} else {
			if (undefined !== _POST.hidden_orderid && !!_POST.orderid) {
				this.H_Dir.orderid = _POST.orderid;
			} else {
				this.getOut().errorOut(5, "orderid\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093-->" + _GET.o + "\u3068" + sess[ShopOrderDetailViewBase.PUB].orderid + "<--", false, "/Shop/menu.php");
			}
		}

		if (_SERVER.PHP_SELF == "/Shop/MTOrder/order_detail.php") //受注詳細のみで行う・・
			{
				if (!_POST.csrfid && !_GET.csrfid) //csrfid
					{
						var O_unique = MtUniqueString.singleton();
						this.O_Sess.setPub(ShopOrderDetailViewBase.PUB, this.H_Dir);
						var csrfid = O_unique.getNewUniqueId();
						header("Location: " + _SERVER.PHP_SELF + "?csrfid=" + csrfid);
						throw die();
					}
			}

		if (!(undefined !== this.H_Dir.orderid) || !this.H_Dir.orderid || !is_numeric(this.H_Dir.orderid)) {
			this.getOut().errorOut(5, "\u3069\u3046\u3057\u3088\u3046\u3082\u306A\u304B\u3063\u305F", false, "/Shop/menu.php");
		}

		if (true == (undefined !== _POST.r)) //formの情報だけでいい
			{
				this.H_olddate = _POST;
			} else {
			this.H_olddate = "";
		}

		this.checkCGIParamPeculiar();
		this.O_Sess.setSelfAll(this.H_Local);
		this.O_Sess.setPub(ShopOrderDetailViewBase.PUB, this.H_Dir);
	}

	checkLumpProcCGIParam() //POSTにorderidがあればkeyを配列にする(menu画面から来た場合)
	{
		var sess = this.getLocalSession();

		if (true == _POST.transid) {
			var H_order = Object.keys(_POST.transid);
		} else if (true == (undefined !== sess[ShopOrderDetailViewBase.PUB].orderid)) {
			if (true == Array.isArray(sess[ShopOrderDetailViewBase.PUB].orderid)) {
				H_order = sess[ShopOrderDetailViewBase.PUB].orderid;
			}
		} else if (true == (undefined !== _GET.oid)) {
			H_order = [_GET.oid];
		}

		if (true == (undefined !== _POST.exitsub)) {
			this.H_Local.exitsub = _POST.exitsub;
		}

		if (true == (undefined !== _POST.confirm)) {
			this.H_Local.confirm = _POST.confirm;
		}

		if (0 < H_order.length) {
			this.H_Dir.orderid = H_order;
		} else {
			this.getOut().errorOut(5, "ShopOrderDetailViewBase(Lump)::orderid\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false, "/Shop/menu.php");
		}

		this.checkCGIParamPeculiar();
	}

	setPriceListID(listid) {
		this.H_Dir.listid = listid;
		this.O_Sess.setPub(ShopOrderDetailViewBase.PUB, this.H_Dir);
		return this.getLocalSession();
	}

	getLocalSession() {
		var H_sess = {
			[ShopOrderDetailViewBase.PUB]: this.O_Sess.getPub(ShopOrderDetailViewBase.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	clearUnderSession(A_exc: {} | any[]) {
		this.clearLastForm();
		this.O_Sess.clearSessionExcludeListPub(A_exc);
	}

	clearSessionSELF() {
		this.O_Sess.clearSessionExcludePub(ShopOrderDetailViewBase.PUB);
	}

	get_View() {
		return this.H_View;
	}

	checkBaseParamError(H_sess, H_g_sess) //最低限必要なセッションが無ければエラー
	{
		if (undefined !== H_sess[ShopOrderDetailViewBase.PUB].orderid == false || undefined !== H_sess[ShopOrderDetailViewBase.PUB].type == false || undefined !== H_sess[ShopOrderDetailViewBase.PUB].carid == false || undefined !== H_sess[ShopOrderDetailViewBase.PUB].cirid == false) {
			this.errorOut(8, "session\u304C\u7121\u3044", false);
			throw die();
		}
	}

	makePankuzuLinkHash() {
		if (this.O_Sess.docomo_only == true) {
			var H_link = {
				"": "\u30E1\u30CB\u30E5\u30FC",
				"/Shop/MTOrder/order_menu.php": "\u30AA\u30FC\u30C0\u4E00\u89A7",
				"/Shop/MTOrder/order_detail.php": "\u53D7\u6CE8\u8A73\u7D30"
			};
		} else {
			H_link = {
				"": "\u30E1\u30CB\u30E5\u30FC",
				"/Shop/MTOrder/menu.php": "\u53D7\u6CE8\u4E00\u89A7",
				"/Shop/MTOrder/order_detail.php": "\u53D7\u6CE8\u8A73\u7D30"
			};
		}

		return H_link;
	}

	getHeaderJS() {
		return "<script language=\"JavaScript\" src=\"/js/shooprder.js\"></script>";
	}

	setSessionOrderInfo(key, H_info) {
		this.H_Local.dbget[key] = H_info;
		this.O_Sess.setSelfAll(this.H_Local);
	}

	validate(H_sess, H_errmsg = "") {
		var errflg = false;

		if (1 <= H_errmsg.length && "" != H_errmsg) {
			for (var val of Object.values(H_errmsg)) {
				if (true == Array.isArray(val)) {
					for (var cval of Object.values(val)) {
						if ("" != cval || undefined != cval) {
							errflg = true;
						}
					}
				} else if ("" != val || undefined != val) {
					errflg = true;
				}
			}
		}

		if (false == errflg) {
			if (true == (undefined !== H_sess.confirm)) {
				if (this.H_view.FormUtil.validateWrapper()) {
					this.H_view.FormUtil.freezeWrapper();
				}
			}
		}
	}

	setDefaultsForm(H_defaults) {
		this.H_view.FormUtil.setDefaultsWrapper(H_defaults);
	}

	endUpdateProc(A_key) {
		this.clearUnderSession(A_key);
		this.writeLastForm();
	}

	displaySmarty() {}

	setBillView(obj) {
		require("view/Order/BillingViewBase.php");

		if (obj instanceof BillingViewBase) {
			this.billView = obj;
		}

		return this.billView;
	}

	getBillView() {
		return this.billView;
	}

	__destruct() {
		super.__destruct();
	}

};