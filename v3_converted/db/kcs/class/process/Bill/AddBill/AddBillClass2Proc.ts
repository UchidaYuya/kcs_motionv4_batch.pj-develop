//error_reporting(E_ALL|E_STRICT);
//
//AddBillMasterProc
//マスタ一覧の表示
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2015/11/11
//
header("Contet-Type: application/json; charset=UTF-8");

require("MtUniqueString.php");

require("process/ProcessBaseHtml.php");

require("model/Bill/AddBill/AddBillModelBase.php");

require("view/Bill/AddBill/AddBillViewBase.php");

//
//__construct
//コンストラクタ
//@author date
//@since 2015/11/02
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//viewオブジェクトの取得
//@author date
//@since 2015/11/02
//
//@access protected
//@return void
//
//
//get_Model
//modelオブジェクトの取得
//@author date
//@since 2015/11/02
//
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//doExecute
//
//@author date
//@since 2015/11/02
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class AddBillClass2Proc extends ProcessBaseHtml {
	static PUB = "/Bill";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AddBillViewBase();
	}

	get_Model(H_g_sess) {
		return new AddBillModelBase(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	//権限チェック
	//-----------------------------------------------------------------------------------
	//マスターからのデータ取得
	//-----------------------------------------------------------------------------------
	//現在ログインしているユーザーが選択可能なマスタIDを取得する
	//tempidを配列にして取得
	//中分類一覧を取得する
	//小分類一覧を取得する
	//$res = array(
	//			"class1" => $O_view->makeOption($class1),
	//			"class2" => $O_view->makeOption($class2),
	//			"class3" => $O_view->makeOption($class3),
	//			"productcode" => $O_view->makeOption($productcode,true),
	//			"productname" => $O_view->makeOption($productname,true),
	//			"id" => $H_sess["SELF"]["post"]["id"],
	//		);
	//$test = json_encode($res);
	//var_dump( json_decode($test) );
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_addbill_input") == false) {
			this.errorOut(6, "", false);
		}

		var H_sess = O_view.getLocalSession();
		var templist = O_model.getTempList(H_g_sess.pactid, H_g_sess.userid, data.coid);
		var tempid = Object.keys(templist);
		var data = H_sess.SELF.post;
		var elem_no = 0;

		switch (data.elem) {
			case "coid":
				elem_no = 0;
				break;

			case "class1":
				elem_no = 1;
				break;

			case "class2":
				elem_no = 2;
				break;

			case "class3":
				elem_no = 3;
				break;
		}

		var class1 = O_model.getTempClass1(H_g_sess.pactid, tempid, data.coid);

		if (elem_no >= 1) {
			var class2 = O_model.getTempClass2(H_g_sess.pactid, tempid, data.coid, data.class1);
		} else {
			class2 = Array();
		}

		if (elem_no >= 2) {
			var class3 = O_model.getTempClass3(H_g_sess.pactid, tempid, data.coid, data.class1, data.class2);
		} else {
			class3 = Array();
		}

		if (class3 >= 3) //商品コード一覧を取得する
			//商品名の一覧を取得する
			{
				var productcode = O_model.getTempProductCode(H_g_sess.pactid, tempid, data.coid, data.class1, data.class2, data.class3);
				var productname = O_model.getTempProductName(H_g_sess.pactid, tempid, data.coid, data.class1, data.class2, data.class3);
			} else {
			productcode = Array();
			productname = Array();
		}

		var res = {
			class1: class1,
			class2: class2,
			class3: class3,
			productcode: productcode,
			productname: productname,
			id: H_sess.SELF.post.id
		};
		echo(JSON.stringify(res));
	}

	__destruct() {
		super.__destruct();
	}

};