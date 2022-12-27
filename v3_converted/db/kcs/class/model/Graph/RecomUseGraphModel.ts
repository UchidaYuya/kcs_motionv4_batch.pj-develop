//
//利用状況グラフModelクラス
//
//@package Graph
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/12/18
//@uses ModelBase
//
//
//
//利用状況グラフModelクラス
//
//@package Graph
//@subpackage Model
//@author houshiyama
//@since 2008/12/18
//@uses ModelBase
//

require("model/ModelBase.php");

require("MtTableUtil.php");

require("MtTableUtil.php");

require("model/PostModel.php");

require("MtUtil.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/12/18
//
//@param objrct $O_db0
//@param array $H_g_sess
//@access public
//@return void
//
//
//利用状況データを生成する <br>
//
//@author houshiyama
//@since 2008/12/19
//
//@access public
//@return void
//
//
//sim_trend_X_tbへのSQL文のselect句を作成する
//
//@author houshiyama
//@since 2008/12/18
//
//@access private
//@return void
//
//
//sim_trend_X_tbへのSQL文のfrom句を作成する
//
//@author houshiyama
//@since 2008/12/19
//
//@param mixed $tb
//@access private
//@return void
//
//
//sim_trend_X_tbへのSQL文のwhere句を作成する
//
//@author houshiyama
//@since 2008/12/19
//
//@param array $A_code
//@access private
//@return void
//
//
//今月のシミュレーションが行われているかチェック
//
//@author houshiyama
//@since 2009/01/21
//
//@access private
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/12/18
//
//@access public
//@return void
//
class RecomUseGraphModel extends ModelBase {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess);
		this.H_G_Sess = H_g_sess;
		this.O_Post = new PostModel();
	}

	getList(H_sess) //結果配列
	//年月
	//取得するコード
	//今月のシミュレーションが行われているかチェック
	//月数の分ループ
	{
		var H_data = Array();
		var year = date("Y");
		var month = date("m");
		var A_code = ["tuwasum", "packetsum"];

		if (this.checkSimThisMonth(H_sess) == true) //開始は今月
			{
				var start = 1;
			} else //開始は前月
			{
				start = 2;
			}

		for (var cnt = start; cnt <= 24; cnt++) //テーブル番号取得
		//配下指定ならば部署一覧取得
		{
			var ym = date("Ym", mktime(0, 0, 0, month - cnt, 1, year));
			var tableno = MtTableUtil.getTableNo(ym, true);

			if ("all" == H_sess.range) {
				var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.current_postid, tableno);
			} else {
				A_post = [this.H_G_Sess.current_postid];
			}

			if (A_post.length > 0) {
				var sql = "select " + this.makeSimTrendSelectSQL() + " from " + this.makeSimTrendFromSQL(tableno) + " where " + this.makeSimTrendWhereSQL(A_post, H_sess, A_code) + " group by st.code ";
				var A_data = this.get_DB().queryKeyAssoc(sql);

				if (A_data.length > 0) //時間表記
					{
						if (this.H_G_Sess.language === "ENG") {
							A_data.tuwaview = Math.floor(Math.round(A_data.tuwasum) / 3600) + " hours " + Math.floor(Math.round(A_data.tuwasum) % 3600 / 60) + " minutes " + Math.floor(Math.round(A_data.tuwasum) % 3600) % 60 + " seconds";
						} else {
							A_data.tuwaview = Math.floor(Math.round(A_data.tuwasum) / 3600) + "\u6642\u9593" + Math.floor(Math.round(A_data.tuwasum) % 3600 / 60) + "\u5206" + Math.floor(Math.round(A_data.tuwasum) % 3600) % 60 + "\u79D2";
						}
					} else {
					if (this.H_G_Sess.language === "ENG") {
						A_data.tuwaview = "0 hours 0 minutes 0 seconds";
					} else {
						A_data.tuwaview = "0\u6642\u95930\u52060\u79D2";
					}

					A_data.tuwasum = undefined;
					A_data.packetsum = undefined;
				}
			} else {
				if (this.H_G_Sess.language === "ENG") {
					A_data.tuwaview = "0 hours 0 minutes 0 seconds";
				} else {
					A_data.tuwaview = "0\u6642\u95930\u52060\u79D2";
				}

				A_data.tuwasum = undefined;
				A_data.packetsum = undefined;
			}

			A_data.year = ym.substr(0, 4);
			A_data.month = ltrim(ym.substr(4, 2), "0");
			H_data[ym] = A_data;
		}

		return H_data;
	}

	makeSimTrendSelectSQL() {
		var A_col = ["code", "avg(st.value)"];
		return A_col.join(",");
	}

	makeSimTrendFromSQL(tableno) {
		var str = "sim_trend_" + tableno + "_tb as st " + "inner join tel_" + tableno + "_tb as te " + "on st.pactid = te.pactid and st.carid = te.carid and st.telno = te.telno";
		return str;
	}

	makeSimTrendWhereSQL(A_post: {} | any[], H_sess: {} | any[], A_code: {} | any[]) //pactidは必須
	//postidは必須
	//code
	//電話番号の指定があれば
	//検索条件を結合してSQL文にする
	{
		var A_where = Array();
		A_where.push("st.pactid=" + this.get_DB().dbquote(this.H_G_Sess.pactid, "integer", true, "pactid"));
		A_where.push("te.postid in (" + A_post.join(",") + ")");
		A_where.push("st.code in ('" + A_code.join("','") + "')");

		if ("one" == H_sess.range) {
			var telno = MtUtil.convertNoView(H_sess.telno);
			A_where.push("st.telno = " + this.get_DB().dbquote(telno, "text", true, "telno"));
		}

		A_where.push("st.carid = " + this.get_DB().dbquote(H_sess.carid, "integer", true, "carid"));
		var sql = A_where.join(" and ");
		return sql;
	}

	checkSimThisMonth(H_sess) {
		var sql = "select count(simid) from sim_index_tb " + " where " + " pactid=" + this.get_DB().dbquote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and year=" + date("Y") + " and carid_before=" + this.get_DB().dbquote(H_sess.carid, "integer", true, "carid") + " and month=" + date("n") + " and status=2" + " and is_manual=false" + " and is_save=false" + " and is_change_carrier=false";
		var cnt = this.get_DB().queryOne(sql);

		if (is_numeric(cnt) == true && cnt > 0) {
			return true;
		} else {
			return false;
		}
	}

	__destruct() {
		super.__destruct();
	}

};