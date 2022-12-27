//error_reporting(E_ALL|E_STRICT);
//
//BillRestrictionMenuProc
//
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2019/04/23
//

require("MtSession.php");

require("process/ProcessBaseHtml.php");

require("model/Admin/BillRestriction/BillRestrictionMenuModel.php");

require("view/Admin/BillRestriction/BillRestrictionMenuView.php");

require("BillUtil.php");

require("model/PactModel.php");

require("model/FuncModel.php");

//
//
//
//__construct
//
//@author web
//@since 2019/04/23
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//
//@author web
//@since 2019/04/23
//
//@access protected
//@return void
//
//
//get_Model
//
//@author web
//@since 2019/04/23
//
//@access protected
//@return void
//
//
//checkFunc
//権限があるかチェックする
//@author web
//@since 2019/04/23
//
//@access public
//@return void
//
//
//doExecute
//
//@author web
//@since 2019/04/23
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//
//@author web
//@since 2019/04/23
//
//@access public
//@return void
//
class BillRestrictionMenuProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
	}

	get_View() {
		return new BillRestrictionMenuView();
	}

	get_Model() {
		return new BillRestrictionMenuModel();
	}

	checkFunc() {
		var O_func = new FuncModel();
		if (!(undefined !== _SESSION.admin_shopid)) return false;
		if (!(undefined !== _SESSION.admin_memid)) return false;
		var funcs = O_func.getAdminFuncs(_SESSION.admin_shopid, _SESSION.admin_memid);

		if (!(-1 !== funcs.indexOf(20))) {
			return false;
		}

		return true;
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//modelオブジェクトの生成
	//$O_model = $this->get_Model();
	//権限チェック
	//検索フォームの作成
	//表示件数のフォーム
	//-----------------------------------------------------------------------------------
	//会社一覧を取得(請求の公開情報を付与、請求閲覧制限権限が付与されている会社で検索)
	//-----------------------------------------------------------------------------------
	//検索時に使用するgroupidの設定
	//groupid=0ならgroupidを検索条件に含めない(全ての会社を表示する)
	//対象の会社一覧を取得
	//-----------------------------------------------------------------------------------
	//先月と今月の年月を計算しよう
	//-----------------------------------------------------------------------------------
	//今月と前月を取得しよう
	//今年
	//去年
	//今月
	//先月
	//月が1未満になってたら年が変わっとる
	//-----------------------------------------------------------------------------------
	//会社情報に請求の確定日などの情報を付与する
	//-----------------------------------------------------------------------------------
	{
		var O_view = this.get_View();
		O_view.startCheck();
		this.checkFunc();
		var O_pact = new PactModel();

		if (!this.checkFunc()) {
			this.errorOut(6, "", 0, "/index_admin.php");
		}

		var pacts = Array();
		var sess = O_view.getLocalSession();
		var search = sess.post;
		O_view.makeForm();
		O_view.makeFormLimit();

		if (_SESSION.admin_groupid != 0) {
			search.groupid = _SESSION.admin_groupid;
		}

		search.fncid = [270];
		pacts = O_pact.getPactSerach(sess.page, sess.view.limit, Array(), search, Array());
		var pcnt = !pacts ? 0 : pacts[0].pcnt;
		var year_now = +date("Y");
		var year_prev = year_now;
		var month_now = +date("m");
		var month_prev = month_now - 1;

		if (month_prev < 1) {
			month_prev += 12;
			year_prev--;
		}

		var time_prev = mktime(0, 0, 0, month_prev, 1, year_prev);
		var time_now = mktime(0, 0, 0, month_now, 1, year_now);

		if (pcnt > 0) //計算に必要なものを事前にDBから読み込んでおく
			//請求確定日などのtime値を算出する
			{
				var O_bill = new BillUtil();
				var pactid_list = Array();

				for (var key in pacts) {
					var value = pacts[key];
					pactid_list.push(value.pactid);
				}

				O_bill.preloadBillRestriction(pactid_list);

				for (var key in pacts) //-----------------------------------------------------------------------------------
				//電話請求関連の情報を付与
				//-----------------------------------------------------------------------------------
				//今月
				//前月
				//電話請求の、早め公開のやつ。現在がbr_timeより前であるなら、対象の請求を公開する
				//-----------------------------------------------------------------------------------
				//請求合計関連の情報を付与
				//-----------------------------------------------------------------------------------
				//今月
				//前月
				//請求合計の、早め公開のやつ。現在がbr_timeより前であるなら、対象の請求を公開する
				{
					var value = pacts[key];
					pacts[key].tel = Array();
					pacts[key].sum = Array();
					var temp = Array();
					var time = O_bill.getFixedTelTime(value.pactid, year_now, month_now);
					temp.is_fixed = O_bill.isFixedTel(value.pactid, undefined, year_now, month_now);
					temp.fixdate = date("m/d", time);
					temp.time = time;
					pacts[key].tel.now = temp;
					time = O_bill.getFixedTelTime(value.pactid, year_prev, month_prev);
					temp.is_fixed = O_bill.isFixedTel(value.pactid, undefined, year_prev, month_prev);
					temp.fixdate = date("m/d", time);
					temp.time = time;
					pacts[key].tel.prev = temp;
					var br = O_bill.getBillRestriction(value.pactid, 1);

					if (!br) {
						pacts[key].tel.br_time = 0;
					} else {
						pacts[key].tel.br_time = mktime(0, 0, 0, br.month + 1, 1, br.year) - 1;
					}

					time = O_bill.getFixedSumTime(value.pactid, year_now, month_now);
					temp.is_fixed = O_bill.isFixedSum(value.pactid, undefined, year_now, month_now);
					temp.fixdate = date("m/d", time);
					temp.time = time;
					pacts[key].sum.now = temp;
					time = O_bill.getFixedSumTime(value.pactid, year_prev, month_prev);
					temp.is_fixed = O_bill.isFixedTel(value.pactid, undefined, year_prev, month_prev);
					temp.fixdate = date("m/d", time);
					temp.time = time;
					pacts[key].sum.prev = temp;
					br = O_bill.getBillRestriction(value.pactid, 0);

					if (!br) {
						pacts[key].sum.br_time = 0;
					} else {
						pacts[key].sum.br_time = mktime(0, 0, 0, br.month + 1, 1, br.year) - 1;
					}
				}
			}

		O_view.displaySmarty(pacts, pcnt, sess.page, sess.view.limit, year_now, month_now, time_now, year_prev, month_prev, time_prev);
	}

	__destruct() {
		super.__destruct();
	}

};