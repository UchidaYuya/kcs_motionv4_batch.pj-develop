//error_reporting(E_ALL|E_STRICT);
//
//AddBillMasterProc
//マスタ一覧の表示
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2015/11/11
//

require("MtUniqueString.php");

require("process/ProcessBaseHtml.php");

require("model/Bill/AddBill/AddBillAddModel.php");

require("view/Bill/AddBill/AddBillAddView.php");

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
class AddBillAddProc extends ProcessBaseHtml {
	static PUB = "/Bill";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AddBillAddView();
	}

	get_Model(H_g_sess) {
		return new AddBillAddModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//define.iniを読み込む
	//権限一覧取得
	//権限チェック
	//-----------------------------------------------------------------------------------
	//データの設定(編集、追加で設定する)
	//-----------------------------------------------------------------------------------
	////-----------------------------------------------------------------------------------
	//		//	マスターからのデータ取得
	//		//-----------------------------------------------------------------------------------
	//		$tempdata = array();
	//		if( $H_sess["SELF"]["post"]["submit_elem"] == "tempsubmit" ){
	//			if( empty($H_sess["SELF"]["post"]["select_tempid"])){
	//				//	マスタデータの割り当てはなし
	//				$tempdata = array();
	//			}else{
	//				//	マスタデータの取得
	//				$tempdata = $O_model->getTempData( $H_g_sess["pactid"],$H_sess["SELF"]["post"]["select_tempid"] );
	//			}
	//		}
	//-----------------------------------------------------------------------------------
	//フォームのデフォルト値の作成
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//マスターからのデータ取得
	//-----------------------------------------------------------------------------------
	//tempidを配列にして取得
	//大分類一覧を取得する
	//中分類一覧を取得する
	//小分類一覧を取得する
	//商品コード一覧を取得する
	//商品名の一覧を取得する
	////	原価と金額を取得する
	//		if( !empty($form_default["productcode"]) ){
	//			$res = $O_model->getTempCostAndPrice($H_g_sess["pactid"],$form_default["productcode"]);
	//			$cost = $res["cost"];
	//			$price = $res["price"];
	//			$tax = $res["tax"];
	//		}else
	//		if( !empty($form_default["productname"]) ){
	//			$res = $O_model->getTempCostAndPrice($H_g_sess["pactid"],$form_default["productname"]);
	//			$cost = $res["cost"];
	//			$price = $res["price"];
	//			$tax = $res["tax"];
	//		}else{
	//			$price = "";
	//			$cost = "";
	//			$tax = "";
	//		}
	//$form_default["price"] = $price;
	//		$form_default["cost"] = $cost;
	//		$form_default["tax"] = $tax;
	//		$cost *= $form_default["num"];
	//		$price *= $form_default["num"];
	//		$tax = $price * $form_default["excise_tax"];
	//-----------------------------------------------------------------------------------
	//フォームの登録を行う
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//フォームの項目チェックと、DBの更新について
	//-----------------------------------------------------------------------------------
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var H_define_ini = parse_ini_file(KCS_DIR + "/conf_sync/define.ini", true);
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_addbill_input") == false) {
			this.errorOut(6, "", false);
		}

		var H_sess = O_view.getLocalSession();

		if (H_sess.SELF.id != "" && H_sess.SELF.id_sub != "") //変更の場合、データを取得する
			//取得したらpostに設定して取得しなおす
			//セッションを取得しなおす
			{
				var H_data = O_model.getAddBillData(H_g_sess.pactid, H_sess.SELF.id, H_sess.SELF.id_sub);
				O_view.setAddBillData(H_data);
				H_sess = O_view.getLocalSession();
			}

		var H_tree = O_model.getTreeJS(H_g_sess.pactid, H_g_sess.postid, H_sess[AddBillAddProc.PUB].pid);
		var tree_js = H_tree.js;
		var form_default = O_view.getFormDefault(H_sess.SELF.post, H_define_ini.Other.excise_tax);
		var co_list = O_model.getCoList();

		if (!(undefined !== form_default.coid)) {
			form_default.coid = key(co_list);
		}

		var templist = O_model.getTempList(H_g_sess.pactid, H_g_sess.userid, form_default.coid);
		var tempid = Object.keys(templist);
		var class1 = O_model.getTempClass1(H_g_sess.pactid, tempid);
		var class2 = O_model.getTempClass2(H_g_sess.pactid, tempid, form_default.class1);
		var class3 = O_model.getTempClass3(H_g_sess.pactid, tempid, form_default.class1, form_default.class2);
		var productcode = O_model.getTempProductCode(H_g_sess.pactid, tempid, form_default.class1, form_default.class2, form_default.class3);
		var productname = O_model.getTempProductName(H_g_sess.pactid, tempid, form_default.class1, form_default.class2, form_default.class3);
		var form_element = O_view.getFormElement(H_g_sess.pactid, co_list, class1, class2, class3, productcode, productname);
		O_view.makeForm(H_g_sess.pactid, form_element, form_default);

		if (O_view.validate() == true) {
			if (H_sess.SELF.post.addsubmit == O_view.NextName) //フォームをフリーズする
				{
					O_view.freezeForm();
				} else if (H_sess.SELF.post.addsubmit == O_view.RecName) //CSRF
				//ID取得
				//sql文を作成
				//DB更新成功
				{
					var O_unique = MtUniqueString.singleton();
					O_unique.validate(H_sess.SELF.post.csrfid);

					if (strpos(_SERVER.REQUEST_URI, "AddBillAdd2.php")) //受付番号に追加ならこっち
						{
							var id = H_sess.SELF.id;
							var id_sub = O_model.getNextIdSub(H_g_sess.pactid, H_sess.SELF.id);
						} else if (strpos(_SERVER.REQUEST_URI, "AddBillMod.php")) //更新ならこっち
						{
							id = H_sess.SELF.id;
							id_sub = H_sess.SELF.id_sub;
						} else //新規ならこっち
						{
							id = O_model.getNextId(H_g_sess.pactid);
							id_sub = O_model.getNextIdSub(H_g_sess.pactid, id);
						}

					var A_sql = O_model.makeAddSQL(H_g_sess.pactid, H_sess[AddBillAddProc.PUB].pid, H_g_sess.userid, id, id_sub, H_sess.SELF.post, H_sess.SELF.post.productcode, productcode[H_sess.SELF.post.productcode], productname[H_sess.SELF.post.productname], H_sess.SELF.post.card_name);

					if (O_model.execDB(A_sql) == true) //完了画面
						{
							O_view.endAddView(id, id_sub);
							throw die();
						} else //エラー画面
						{
							this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Menu/menu.php");
						}
				}
		} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		O_view.displaySmarty(H_tree, tree_js);
	}

	__destruct() {
		super.__destruct();
	}

};