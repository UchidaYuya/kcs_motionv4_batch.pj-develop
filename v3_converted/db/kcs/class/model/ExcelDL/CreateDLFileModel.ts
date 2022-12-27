//
//エクセルダファイル生成Model
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/06/24
//@uses ManagementModelBase
//@uses CardCoModel
//
//
//
//エクセルダファイル生成Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/06/24
//@uses ModelBase
//@uses CardCoModel
//

require("model/ModelBase.php");

require("MtPostUtil.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("model/Bill/ETC/BillEtcDetailsModel.php");

require("model/Bill/Purchase/BillPurchaseDetailsModel.php");

require("model/Bill/Copy/BillCopyDetailsModel.php");

require("model/Bill/Transit/BillTransitDetailsModel.php");

require("model/Bill/AddBill/AddBillMenuModel.php");

//
//ディレクトリ名
//
//
//アルファパーチェスのMID
//
//
//テーブル名一覧取得
//
//@var mixed
//@access protected
//
//
//権限オブジェクト
//
//@var mixed
//@access protected
//
//
//権限一覧
//
//@var mixed
//@access protected
//
//
//グローバルセッション
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/06/24
//
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//@uses AuthModel
//@uses PostModel
//
//
//権限一覧を取得する
//
//@author houshiyama
//@since 2008/06/24
//
//@access public
//@return array
//
//
//権限一覧のゲッター
//
//@author houshiyama
//@since 2008/06/24
//
//@access public
//@return void
//
//
//SQL中で使用するテーブルの名前を決める
//
//@author houshiyama
//@since 2008/06/24
//
//@param mixed $cym
//@access protected
//@return void
//
//
//getPostDate
//
//@author houshiyama
//@since 2008/07/01
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//データを取得
//
//@author houshiyama
//@since 2008/06/25
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $O_util
//@access public
//@return void
//
//
//SUOのカバー用にETCの合計データを取得する
//
//@author houshiyama
//@since 2008/07/08
//
//@param array $H_post
//@param mixed $coid
//@access public
//@return void
//
//
//SUOのカバー用に購買の合計データを取得する
//
//@author houshiyama
//@since 2008/07/08
//
//@param array $H_post
//@param mixed $coid
//@access public
//@return void
//
//
//SUOのカバー用にコピー機の合計データを取得する
//
//@author houshiyama
//@since 2008/07/23
//
//@param array $H_post
//@param mixed $coid
//@access public
//@return void
//
//
//getSUOCoverTransitSum
//
//@author igarashi
//@since 2010/03/10
//
//@param array $H_post
//@param mixed $coid
//@access public
//@return void
//
//
//getAddbillCoList
//種別の取得
//@author web
//@since 2016/01/21
//
//@access public
//@return void
//
//
//getAddBillCoBillSum
//それぞれの種別の合計値の取得
//@author web
//@since 2016/09/29
//
//@param mixed $cym
//@param mixed $pactid
//@param mixed $postid
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/21
//
//@access public
//@return void
//
class CreateDLFileModel extends ModelBase {
	static PUB = "/ExcelDL";
	static SATMID = "103";
	static ADDBILLMID = "243";

	constructor(H_g_sess: {} | any[]) {
		super(this.get_DB());
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		this.setAllAuthIni();
	}

	setAllAuthIni() {
		var super = false;

		if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
			super = true;
		}

		var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
		var A_pactauth = this.O_Auth.getPactFuncIni();
		this.A_Auth = array_merge(A_userauth, A_pactauth);
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	setTableName(cym) //対象テーブル番号の取得
	//対象テーブル名
	{
		var O_table = new MtTableUtil();
		this.H_Tb.tableno = O_table.getTableNo(cym);
		this.H_Tb.tel_tb = "tel_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.post_tb = "post_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.post_relation_tb = "post_relation_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.card_tb = "card_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.purchase_tb = "purchase_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.copy_tb = "copy_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.tel_details_tb = "tel_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.bill_tb = "tel_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.tel_bill_tb = "tel_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.card_details_tb = "card_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.card_post_bill_tb = "card_post_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.card_bill_tb = "card_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.purchase_details_tb = "purchase_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.purchase_post_bill_tb = "purchase_post_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.purchase_bill_tb = "purchase_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.copy_details_tb = "copy_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.copy_post_bill_tb = "copy_post_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.copy_bill_tb = "copy_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.transit_tb = "transit_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.transit_bill_tb = "transit_bill_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.transit_details_tb = "transit_details_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.transit_usehistory_tb = "transit_usehistory_" + this.H_Tb.tableno + "_tb";
		this.H_Tb.transit_post_bill_tb = "transit_post_bill_" + this.H_Tb.tableno + "_tb";
	}

	getPostData(postid, cym) {
		this.setTableName(cym);
		var sql = "select " + " userpostid," + "postname," + "zip," + "addr1," + "addr2," + "building," + "telno," + "faxno " + " from " + this.H_Tb.post_tb + " where " + " postid=" + postid;
		var H_data = this.get_DB().queryRowHash(sql);

		if (Array.isArray(H_data) == false || H_data.length < 1) {
			echo("\u90E8\u7F72\u60C5\u5831\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
			throw die();
		}

		return H_data;
	}

	getList(H_g_sess, H_sess, O_util, O_view) //請求モデルを呼び出すので請求モデル用配列要素を準備
	//配下すべての時
	{
		var O_billmodel = undefined;
		H_sess["/Bill"].current_postid = H_sess.SELF.post.postid;
		H_sess["/Bill"].cym = H_sess.SELF.post.cym;
		H_sess.SELF.dlmode = 0;
		H_sess.SELF.sort = "0,a";
		H_sess.SELF.hsort = "0,a";

		if ("0" === H_sess.SELF.post.posttarget) {}

		if ("2" === H_sess.SELF.post.mtype) {
			O_billmodel = new BillEtcDetailsModel(this.get_DB(), H_g_sess, O_util);
		} else if ("3" === H_sess.SELF.post.mtype || CreateDLFileModel.SATMID === H_sess.SELF.post.mtype) {
			O_billmodel = new BillPurchaseDetailsModel(this.get_DB(), H_g_sess, O_util);
		} else if ("4" === H_sess.SELF.post.mtype) {
			O_billmodel = new BillCopyDetailsModel(this.get_DB(), H_g_sess, O_util);
		} else if ("5" === H_sess.SELF.post.mtype) {
			O_billmodel = new BillTransitDetailsModel(this.get_DB(), H_g_sess, O_util);
		} else if (CreateDLFileModel.ADDBILLMID === H_sess.SELF.post.mtype) //追加請求のエクセルダウンロード
			//次のページまで空行で埋める
			{
				var addbill_model = new AddBillMenuModel(this.get_DB(), H_g_sess);
				addbill_model.initialize(H_sess["/Bill"].cym);
				var postlist = addbill_model.getPostListAll(H_g_sess.pactid, H_sess["/Bill"].cym, H_sess["/Bill"].current_postid);
				var bill_cnt = addbill_model.getBillListCount(H_g_sess.pactid, H_sess["/Bill"].cym, H_sess["/Bill"].current_postid);
				O_view.setDataCnt(bill_cnt);

				for (var postid of Object.values(postlist)) {
					var H_data = addbill_model.getBillList(H_g_sess.pactid, H_sess["/Bill"].cym, postid, 0, "0,a", Array(), 0, 1, false);

					if (!!H_data) {
						O_view.writeStartDataLine();
						O_view.writeAddBillUseDataLine(H_data);
					}
				}

				O_view.writeBrankToNextPage();
			}

		if (!is_null(O_billmodel)) {
			O_billmodel.setTableName(H_sess.SELF.post.cym);
			H_data = O_billmodel.getList(H_sess, true, O_view);
		}
	}

	getSUOCoverEtcSum(H_post: {} | any[], coid) //自部署のみ
	{
		if (H_post.posttarget === "0") {
			var flag = "1";
		} else {
			flag = "0";
		}

		this.setTableName(H_post.cym);
		var sql = "select coalesce(charge,0) as charge from " + this.H_Tb.card_post_bill_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and postid=" + this.get_DB().dbQuote(H_post.postid, "integer", true) + " and flag=" + this.get_DB().dbQuote(flag, "text", true) + " and cardcoid=" + this.get_DB().dbQuote(coid, "integer", true);
		var res = this.get_DB().queryOne(sql);
		return res;
	}

	getSUOCoverPurchaseSum(H_post: {} | any[], coid) //自部署のみ
	{
		if (H_post.posttarget === "0") {
			var flag = "1";
		} else {
			flag = "0";
		}

		this.setTableName(H_post.cym);
		var sql = "select coalesce(charge,0)+coalesce(excise,0) as charge from " + this.H_Tb.purchase_post_bill_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and postid=" + this.get_DB().dbQuote(H_post.postid, "integer", true) + " and flag=" + this.get_DB().dbQuote(flag, "text", true) + " and purchcoid=" + this.get_DB().dbQuote(coid, "integer", true);
		var res = this.get_DB().queryOne(sql);
		return res;
	}

	getSUOCoverCopySum(H_post: {} | any[], coid) //自部署のみ
	{
		if (H_post.posttarget === "0") {
			var flag = "1";
		} else {
			flag = "0";
		}

		this.setTableName(H_post.cym);
		var sql = "select coalesce(charge,0)+coalesce(excise,0) as charge from " + this.H_Tb.copy_post_bill_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and postid=" + this.get_DB().dbQuote(H_post.postid, "integer", true) + " and flag=" + this.get_DB().dbQuote(flag, "text", true) + " and copycoid=" + this.get_DB().dbQuote(coid, "integer", true);
		var res = this.get_DB().queryOne(sql);
		return res;
	}

	getSUOCoverTransitSum(H_post: {} | any[], coid) //自部署のみ
	{
		if (H_post.posttarget === "0") {
			var flag = "1";
		} else {
			flag = "0";
		}

		this.setTableName(H_post.cym);
		var sql = "select coalesce(charge,0)+coalesce(excise,0) as charge from " + this.H_Tb.transit_post_bill_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and postid=" + this.get_DB().dbQuote(H_post.postid, "integer", true) + " and flag=" + this.get_DB().dbQuote(flag, "text", true) + " and trancoid=" + this.get_DB().dbQuote(coid, "integer", true);
		var res = this.get_DB().queryOne(sql);
		return res;
	}

	getAddBillCoList() {
		var sql = "select coid,coname from addbill_co_tb" + " where" + " defaultflg=true" + " and pactid=" + this.H_G_Sess.pactid + " ORDER BY sort";
		return this.get_DB().queryAssoc(sql);
	}

	getAddBillCoBillSum(cym, pactid, postid) {
		var O_table = new MtTableUtil();
		var tbno = O_table.getTableNo(cym);
		var tbname = "addbill_post_bill_" + tbno + "_tb";
		var sql = "select coid,price,tax from " + tbname + " where" + " pactid =" + this.get_DB().dbQuote(pactid, "integer", true) + " and postid =" + this.get_DB().dbQuote(postid, "integer", true) + " and flag = 1";
		return this.get_DB().queryKeyAssoc(sql);
	}

	__destruct() {
		super.__destruct();
	}

};