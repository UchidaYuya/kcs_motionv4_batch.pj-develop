//
//注文の請求管理用モデルベース
//
//@uses ModelBase
//@package
//@author web
//@since 2013/03/22
//

require("model/ModelBase.php");

//
//__construct
//
//@author web
//@since 2013/03/22
//
//@access public
//@return void
//
//
//支払い方法を文字列に変換
//
//@author web
//@since 2013/03/26
//
//@param mixed $id
//@access public
//@return void
//
//
//部署ツリー作成
//
//@author web
//@since 2013/03/28
//
//@access public
//@return void
//
//
//過去のデフォルト請求先・部署紐付けを削除
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
//
//指定した会社の標準請求先を取得
//
//@author web
//@since 2013/04/04
//
//@access public
//@return void
//
//
//指定した請求先情報を取得
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
//
//指定した請求先情報を取得
//
//@author web
//@since 2013/04/03
//
//@param mixed $id
//@param mixed $override
//@access public
//@return void
//
//
//請求先情報を更新
//
//@author web
//@since 2013/04/09
//
//@access public
//@return void
//
//
//queryExecute
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
//
//setView
//
//@author web
//@since 2013/03/22
//
//@param mixed $view
//@access public
//@return void
//
//
//getView
//
//@author web
//@since 2013/03/22
//
//@access protected
//@return void
//
//
//getBillingViewBase
//
//@author web
//@since 2013/04/05
//
//@access private
//@return void
//
//
//setPactId
//
//@author web
//@since 2013/04/10
//
//@param mixed $pactid
//@access public
//@return void
//
//
//setPostId
//
//@author web
//@since 2013/04/10
//
//@param mixed $postid
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/03/22
//
//@access public
//@return void
//
class BillingModelBase extends ModelBase {
	static PUB = "/MTOrder";
	static BILL = 1;
	static POST = 2;
	static CONFIRM = 3;
	static EXECUTE = 4;

	constructor(O_db0 = undefined) {
		super(O_db0);
		this.sqls = Array();
	}

	changeString(id) {
		var result = false;

		if (1 == id) {
			result = "\u9280\u884C\u632F\u8FBC";
		} else if (2 == id) {
			result = "\u73FE\u91D1";
		} else if (3 == id) {
			result = "\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9";
		} else if (4 == id) {
			result = "\u305D\u306E\u4ED6";
		}

		return result;
	}

	getPostTree() {
		var sql = "SELECT " + "p.postid, p.postname, p.userpostid, r.level " + "FROM " + "post_tb p " + "INNER JOIN post_relation_tb r ON p.postid=r.postidchild " + "WHERE " + "p.pactid=" + this.get_DB().dbQuote(this.getView().gSess().pactid, "int", true) + " " + "AND p.postid=" + this.get_DB().dbQuote(this.getView().gSess().postid, "int", true) + " ";
		var parentRow = this.get_DB().queryRowHash(sql);
		sql = "SELECT " + "p.postid, p.postname, p.userpostid, r.postidparent, r.level " + "FROM " + "post_tb p " + "INNER JOIN post_relation_tb r ON p.postid=r.postidchild " + "WHERE " + "p.pactid=" + this.get_DB().dbQuote(this.getView().gSess().pactid, "int", true) + " " + "AND r.level > " + parentRow.level + " " + "ORDER BY " + "r.level desc," + "p.userpostid";
		var postList = this.get_DB().queryHash(sql);
		var H_post = Array();
		var view_str = "";
		var cnt = postList.length;

		for (var i = 0; i < cnt; i++) {
			if (!(undefined !== H_post[postList[i].postidparent])) {
				H_post[postList[i].postidparent] = "";
			}

			if (0 == postList[i].level) {
				H_post[postList[i].postid] = serialize({
					postid: postList[i].postid,
					postname: str_repeat("&nbsp;&nbsp;&nbsp;", postList[i].level - parentRow.level) + postList[i].postname + " (" + postList[i].userpostid + ")"
				}) + H_post[postList[i].postid];
			} else {
				H_post[postList[i].postidparent] += "<><>" + serialize({
					postid: postList[i].postid,
					postname: str_repeat("&nbsp;&nbsp;&nbsp;", postList[i].level - parentRow.level) + postList[i].postname + " (" + postList[i].userpostid + ")"
				});
				H_post[postList[i].postidparent] += serialize({
					postid: postList[i].postid,
					postname: str_repeat("&nbsp;&nbsp;&nbsp;", postList[i].level - parentRow.level) + postList[i].postname + " (" + postList[i].userpostid + ")"
				}) + "<><>";

				if (!!H_post[postList[i].postid]) {
					H_post[postList[i].postidparent] += H_post[postList[i].postid];
					delete H_post[postList[i].postid];
				}
			}
		}

		view_str = H_post[this.getView().gSess().postid];
		var A_view = preg_split("/<><>/", view_str);

		for (var i in A_view) {
			var c = A_view[i];

			if (!!c) {
				postView.push(unserialize(c));
			}
		}

		var postView = array_merge([{
			postid: parentRow.postid,
			postname: parentRow.postname + " (" + parentRow.userpostid + ")"
		}], Array.from(postView));
		return postView;
	}

	deletePastView() {
		var data = this.getView().gSess().getSelfAll();

		if (undefined !== data.defaultflg) //会社すべてのデフォルト設定をfalseに
			{
				this.sqls.push("UPDATE order_billing_tb SET defaultflg=false WHERE pactid=" + this.get_DB().dbQuote(this.pactid, "int", true));
			}

		return this;
	}

	getDefaultBill(pactid = undefined) {
		if (is_null(pactid)) {
			pactid = this.getView().gSess().pactid;
		}

		var lang = this.getBillingViewBase().getLangLists("billhow");
		var language = this.getView().gSess().language;

		if (is_null(language)) {
			language = "JPN";
		}

		var sql = "SELECT b.id, b.billname, b.billpost, b.receiptname, b.zip1, b.zip2, b.addr1, b.addr2, b.building, b.billtel, b.defaultflg, b.billhow, " + "CASE b.billhow " + "WHEN 'bank' THEN '" + lang.bank[language] + "' " + "WHEN 'cash' THEN '" + lang.cash[language] + "' " + "WHEN 'card' THEN '" + lang.card[language] + "' " + "WHEN 'misc' THEN '" + lang.misc[language] + "' " + "END AS billhowview " + "FROM " + "order_billing_tb b " + "WHERE " + "b.pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " " + "AND b.defaultflg=true";
		return this.get_DB().queryRowHash(sql);
	}

	getDetail(id) {
		var lang = this.getBillingViewBase().getLangLists("billhow");
		var language = this.getView().gSess().language;

		if (is_null(language)) {
			language = "JPN";
		}

		var sql = "SELECT id, billname, billpost, receiptname, zip1, zip2, addr1, addr2, building, billtel, billhow, " + "CASE billhow " + "WHEN 'bank' THEN '" + lang.bank[language] + "' " + "WHEN 'cash' THEN '" + lang.cash[language] + "' " + "WHEN 'card' THEN '" + lang.card[language] + "' " + "WHEN 'misc' THEN '" + lang.misc[language] + "' " + "END AS billhowview, " + "CASE defaultflg " + "WHEN true THEN 1 " + "ELSE 0 " + "END AS defaultflg " + " FROM order_billing_tb " + "WHERE " + "id=" + this.get_DB().dbQuote(id, "int", true);
		"WHEN 'misc' THEN '" + (this.billData = this.get_DB().queryRowHash(sql));
		var view = this.getView();

		if (method_exists(this.getView(), "assign")) {
			this.getView().assign("billdata", this.billData);
		}

		return this;
	}

	getBillData(id = undefined, override = false) {
		if (!is_numeric(id)) {
			var d = this.getView().gSess().getSelfAll();
			id = d.id;
		}

		if (override || is_null(this.billData)) {
			if (is_numeric(id)) {
				this.getDetail(id);
			}
		}

		return this.billData;
	}

	updateRegisteredOrderBillingData() {
		var lSess = this.getBillingViewBase().getLocalSession();

		if (undefined !== lSess.SELF.billid && !!lSess.SELF.billid) {
			var billData = this.getBillData(lSess.SELF.billid);
			var sql = "UPDATE mt_order_tb " + "SET " + "billname=" + this.get_DB().dbQuote(billData.billname, "text", false) + ", " + "billpost=" + this.get_DB().dbQuote(billData.billpost, "text", false) + ", " + "receiptname=" + this.get_DB().dbQuote(billData.receiptname, "text", false) + ", " + "billzip1=" + this.get_DB().dbQuote(billData.zip1, "text", false) + ", " + "billzip2=" + this.get_DB().dbQuote(billData.zip2, "text", false) + ", " + "billaddr1=" + this.get_DB().dbQuote(billData.addr1, "text", false) + ", " + "billaddr2=" + this.get_DB().dbQuote(billData.addr2, "text", false) + ", " + "billbuild=" + this.get_DB().dbQuote(billData.building, "text", false) + ", " + "billtel=" + this.get_DB().dbQuote(billData.billtel, "text", false) + ", " + "billhow=" + this.get_DB().dbQuote(billData.billhow, "text", false) + " " + "WHERE " + "orderid=" + this.get_DB().dbQuote(lSess[BillingModelBase.PUB].orderid, "int", true);
			return PEAR.isError(this.get_DB().exec(sql, false));
		}

		return true;
	}

	queryExecute() {
		this.get_DB().beginTransaction();

		for (var sql of Object.values(this.sqls)) {
			if (PEAR.isError(this.get_DB().query(sql))) {
				this.get_DB().rollback();
				return false;
			}
		}

		this.get_DB().commit();
		return true;
	}

	setView(view) {
		if ("object" === typeof view) {
			this.view = view;

			if (is_numeric(this.getView().gSess().pactid)) {
				this.pactid = this.getView().gSess().pactid;
			}

			if (is_numeric(this.getView().gSess().postid)) {
				this.postid = this.getView().gSess().postid;
			}
		}
	}

	getView() {
		return this.view;
	}

	getBillingViewBase() {
		require("view/Order/BillingViewBase.php");

		if (this.viewBase instanceof BillingViewBase) {
			return this.getView();
		}

		var view = this.getView();

		if (view instanceof BillingViewBase) {
			return view;
		}

		return new BillingViewBase();
	}

	setPactId(pactid) {
		if (is_numeric(pactid)) {
			this.pactid = pactid;
		}
	}

	setPostId(postid) {
		if (is_numeric(postid)) {
			this.postid = postid;
		}
	}

	__destruct() {
		super.__destruct();
	}

};