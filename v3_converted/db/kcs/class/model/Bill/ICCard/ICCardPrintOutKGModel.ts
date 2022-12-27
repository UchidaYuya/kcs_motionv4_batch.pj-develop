//
//ICCardPrintOutPersonalModel
//交通費出力PDFモデル
//@uses ModelBase
//@package
//@author date
//@since 2015/11/02
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("TableMake.php");

//
//__construct
//コンストラクタ
//@author date
//@since 2015/11/02
//
//@param mixed $O_db0
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//setAllAuthIni
//権限の設定
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
//
//getList
//交通費一覧の取得
//@author web
//@since 2015/11/10
//
//@param mixed $pactid
//@param mixed $coid
//@param mixed $userid
//@param mixed $tblno
//@access public
//@return void
//
//
//getUserInfo
//ユーザー情報の取得
//@author web
//@since 2015/11/10
//
//@access public
//@return void
//
//
//get_AuthIni
//権限の取得
//@author date
//@since 2015/11/02
//
//@access public
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
class ICCardPrintOutKGModel extends ModelBase {
	constructor(O_db0, H_g_sess) {
		super(O_db0);
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		this.setAllAuthIni();
	}

	modifier_mb_truncate(string, length = 80, etc = "...") {
		if (length == 0) {
			return "";
		}

		if (mb_strlen(string) > length) {
			return mb_substr(string, 0, length) + etc;
		} else {
			return string;
		}
	}

	setAllAuthIni() //shop側では使用しない
	{
		if (undefined !== this.H_G_Sess.pactid == true) {
			var super = false;

			if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
				super = true;
			}

			var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
			var A_pactauth = this.O_Auth.getPactFuncIni();
			this.A_Auth = array_merge(A_userauth, A_pactauth);
		} else {
			this.A_Auth = Array();
		}
	}

	getList(pactid, coid, userid, tblno) //テーブル取得
	//." limit 25 offset 0";
	//var_dump( $H_data );
	//exit();
	{
		if (tblno == "") //未確定テーブル
			{
				var iccard_history_tb = "iccard_history_tb";
				var iccard_tb = "iccard_tb";
				var post_tb = "post_tb";
				var fixflg_check = " and history_tb.fixflg=true";
			} else //確定
			//過去月の場合は確定フラグを見ない
			{
				iccard_history_tb = "iccard_history_" + tblno + "_tb";
				iccard_tb = "iccard_" + tblno + "_tb";
				post_tb = "post_" + tblno + "_tb";
				fixflg_check = "";
			}

		var sql = "select" + " cast(history_tb.usedate as date) as history_tb_date," + "date_part('dow',history_tb.usedate) as history_tb_dow," + "history_tb.iccardtype as history_tb_iccardtype," + "history_tb.type as history_tb_type," + "history_tb.start as history_tb_start," + "history_tb.destination as history_tb_destination," + "history_tb.in_facility as history_tb_in_facility," + "history_tb.out_facility as history_tb_out_facility," + "history_tb.waytype as history_tb_waytype," + "history_tb.visit as history_tb_visit," + "history_tb.charge as history_tb_charge," + "history_tb.note as history_tb_note," + "history_tb.uniqueid as history_tb_uniqueid," + "history_tb.iccardcoid as history_tb_iccardcoid," + "(case when history_tb.handflg then 1 else 0 end) as history_tb_handflg" + " from" + " " + iccard_history_tb + " as history_tb " + " left join " + " " + iccard_tb + " as ic_tb on" + " history_tb.pactid=ic_tb.pactid" + " and history_tb.iccardid=ic_tb.iccardid" + " and history_tb.iccardcoid=ic_tb.iccardcoid" + " and history_tb.handflg=ic_tb.handflg" + " left join" + " " + post_tb + " as post_x_tb on" + " ic_tb.pactid=post_x_tb.pactid" + " and ic_tb.postid=post_x_tb.postid" + " where" + " history_tb.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and coalesce(history_tb.delflg,false)=false" + " and ic_tb.userid is not null" + " and ic_tb.userid=" + this.get_DB().dbQuote(userid, "integer", true) + " and ic_tb.iccardcoid=" + this.get_DB().dbQuote(coid, "integer", true) + " and coalesce(ic_tb.delflg,false)=false" + fixflg_check + " order by history_tb_date asc,history_tb.usedate asc,history_tb.detailno asc";
		var H_data = this.get_DB().queryHash(sql);
		return H_data;
	}

	getUserInfo(userid) {
		var sql = "select" + " usr.username" + ",usr.building" + ",usr.employeecode" + ",post.postname" + " from" + " user_tb as usr" + " left join" + " post_tb as post on" + " usr.postid=post.postid" + " where" + " usr.userid=" + this.get_DB().dbQuote(userid, "integer", true);
		var res = this.get_DB().queryRowHash(sql);
		return res;
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	__destruct() {
		super.__destruct();
	}

};