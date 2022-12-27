//error_reporting(E_ALL|E_STRICT);
//
//AddBillMasterProc
//マスタ一覧の表示
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2015/11/11
//

require("process/ProcessBaseHtml.php");

require("MtUniqueString.php");

require("view/Bill/AddBill/AddBillModBulkView.php");

require("model/Bill/AddBill/AddBillModBulkModel.php");

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
class AddBillModBulkProc extends ProcessBaseHtml {
	static PUB = "/Bill";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.tb_all_flag = false;
	}

	get_View() {
		return new AddBillModBulkView();
	}

	get_Model(H_g_sess) {
		return new AddBillModBulkModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//define.iniを読み込む
	//権限一覧取得
	//権限チェック
	//-----------------------------------------------------------------------------------
	//データの設定(データ編集)
	//-----------------------------------------------------------------------------------
	//セッションを取得しなおす
	//------------------------------------------------------------------------------------------
	//フォームを作成するよ！！！
	//------------------------------------------------------------------------------------------
	//種別の取得
	//各IDごとのフォームを作成しよう
	//Formの登録
	//部署選択用
	//$H_tree = $O_model->getTreeJS( $H_g_sess["pactid"],$H_g_sess["postid"],$H_sess[self::PUB]["pid"]);
	//フォームにエラーがないなら
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
		var H_list = O_model.getList(H_g_sess.pactid, H_sess.SELF.id, H_sess.SELF.sort, this.tb_all_flag);

		for (var key in H_list) {
			var value = H_list[key];
			O_view.setAddBillData(value);
		}

		H_sess = O_view.getLocalSession();
		var form_default = O_view.getFormDefault(H_sess.SELF.post, H_define_ini.Other.excise_tax);
		var co_list = O_model.getCoList();
		var form_element = Array();

		for (var key in H_list) //現在ログインしているユーザーが選択可能なマスタIDを取得する
		//中分類一覧を取得する
		//商品コード一覧を取得する
		//商品名の一覧を取得する
		//フォームの作成
		//フォーム追加する
		//部署情報
		{
			var value = H_list[key];
			var elem_key = value.addbillid + ":" + value.addbillid_sub;
			var data = form_default.bill[elem_key];
			var templist = O_model.getTempList(H_g_sess.pactid, H_g_sess.userid, data.coid);
			var tempid = Object.keys(templist);
			var class1 = O_model.getTempClass1(H_g_sess.pactid, tempid);
			var class2 = O_model.getTempClass2(H_g_sess.pactid, tempid, data.class1);
			var class3 = O_model.getTempClass3(H_g_sess.pactid, tempid, data.class1, data.class2);
			var productcode = O_model.getTempProductCode(H_g_sess.pactid, tempid, data.class1, data.class2, data.class3);
			var productname = O_model.getTempProductName(H_g_sess.pactid, tempid, data.class1, data.class2, data.class3);
			var elem_edit = O_view.getFormElementEdit(elem_key, co_list, class1, class2, class3, productcode, productname);
			form_element = array_merge(form_element, elem_edit);
			H_list[key].cost = data.cost;
			H_list[key].price = data.price;
			H_list[key].tax = data.tax;
			H_list[key].userpostid = data.userpostid;
			H_list[key].postname = data.postname;
		}

		var elem = O_view.getFormElement();
		form_element = array_merge(form_element, elem);
		O_view.makeForm(H_g_sess.pactid, form_element, form_default);
		var H_tree = O_model.getTreeJS(H_g_sess.pactid, H_g_sess.postid, H_sess[AddBillModBulkProc.PUB].current_postid);

		if (O_view.validate() == true) {
			if (H_sess.SELF.post.modsubmit == O_view.NextName) //フォームをフリーズする
				{
					O_view.freezeForm();
				} else if (H_sess.SELF.post.modsubmit == O_view.ConfirmName) //CSRF
				//sql文を作成
				//DB更新成功
				{
					var O_unique = MtUniqueString.singleton();
					O_unique.validate(H_sess.SELF.post.csrfid);
					var A_sql = O_model.makeSQL(H_g_sess.pactid, H_sess.SELF.post, H_define_ini.Other.excise_tax);

					if (O_model.execDB(A_sql) == true) //if( true ){
						//今回の更新で対象となったaddbillidを取得
						//完了画面
						{
							var id_list = O_model.getIdOfSqlTarget();
							O_view.endView(H_sess, id_list);
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

		O_view.displaySmarty(H_list, H_tree, H_tree.js);
	}

	__destruct() {
		super.__destruct();
	}

};