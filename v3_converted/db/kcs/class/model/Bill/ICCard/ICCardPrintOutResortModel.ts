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
//readICCardIni
//設定ファイル読込
//@author web
//@since 2018/07/13
//
//@param mixed $pactid
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
//getChargeType
//交通機関名から費用の区分を取る
//@author web
//@since 2018/07/18
//
//@param mixed $facility
//@access private
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
class ICCardPrintOutResortModel extends ModelBase {
	constructor(O_db0, H_g_sess) {
		super(O_db0);
		this.ini = undefined;
		this.H_G_Sess = H_g_sess;
		this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		this.setAllAuthIni();
		this.ini = this.readICCardIni(this.H_G_Sess.pactid);
	}

	readICCardIni(pactid) {
		var _ini = parse_ini_file(KCS_DIR + "/conf_sync/iccard.ini", true);

		var ini = ini[0];

		if (undefined !== _ini[pactid]) {
			{
				let _tmp_0 = _ini[pactid];

				for (var key in _tmp_0) {
					var value = _tmp_0[key];
					ini[key] = value;
				}
			}
		}

		if (undefined !== ini.facility) {
			ini.facility = ini.facility.split(",");
		}

		return ini;
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

	getChargeType(facility) {
		var charge_type = 1;

		switch (facility) {
			case "\u30EC\u30F3\u30BF\u30AB\u30FC":
				charge_type = 2;
				break;

			case "\u30BF\u30AF\u30B7\u30FC":
				charge_type = 3;
				break;

			case "\u81EA\u793E\u30DB\u30C6\u30EB":
			case "\u4ED6\u793E\u30DB\u30C6\u30EB":
				charge_type = 4;
				break;

			case "\u5165\u6E6F\u7A0E":
			case "\u5BBF\u6CCA\u7A0E":
				charge_type = 5;
		}

		return charge_type;
	}

	getList(pactid, coid, userid, tblno) //テーブル取得
	//." limit 25 offset 0";
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

		for (var key in H_data) //type別に分ける
		{
			var value = H_data[key];
			var charge_type = 1;
			var facility = value.history_tb_in_facility;

			if (!is_numeric(value.history_tb_uniqueid)) //バス判定
				{
					charge_type = 1;

					if (!value.history_tb_start && !value.history_tb_destination && !(-1 !== this.ini.facility.indexOf(facility))) //出発地と目的地がない
						{
							facility = "\u30D0\u30B9";
						} else if (strpos(value.history_tb_in_facility, "\u30D0\u30B9") !== false) //名前にバスが入っている
						{
							facility = "\u30D0\u30B9";
						} else //交通機関名により区分とる
						//1の場合(旅費)は交通機関名を設定する
						{
							charge_type = this.getChargeType(value.history_tb_in_facility);

							if (charge_type == 1) {
								if (!(-1 !== this.ini.facility.indexOf(facility))) {
									facility = "\u96FB\u8ECA";
								}
							}
						}
				} else if (value.history_tb_handflg == true) //交通機関名から区分とる
				{
					charge_type = this.getChargeType(value.history_tb_in_facility);
				} else if (value.history_tb_iccardtype == "IC") //バス判定
				{
					if (!value.history_tb_start && !value.history_tb_destination) //出発地と目的地がない
						{
							facility = "\u30D0\u30B9";
						} else if (strpos(value.history_tb_in_facility, "\u30D0\u30B9") !== false) //名前にバスが入っている
						{
							facility = "\u30D0\u30B9";
						} else {
						facility = "\u96FB\u8ECA";
					}

					charge_type = 1;
				}

			H_data[key].charge_type = charge_type;
			H_data[key].facility = facility;
			H_data[key].history_tb_visit = this.modifier_mb_truncate(value.history_tb_visit, 12, "");
			H_data[key].history_tb_note = this.modifier_mb_truncate(value.history_tb_note, 12, "");
		}

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