//
//電話詳細表示Model
//
//更新履歴：<br>
//2008/08/24 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/08/24
//@uses ManagementTelModel
//
//
//
//電話詳細表示Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/08/24
//@uses ManagementTelModel
//

require("model/Management/Tel/ManagementTelModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/08/24
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//削除用sql文作成
//
//@author houshiyama
//@since 2008/08/24
//
//@param array $H_H_sess
//@access public
//@return void
//
//
//電話用の設定項目取得
//
//@author houshiyama
//@since 2008/08/24
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/24
//
//@access public
//@return void
//
class TelReserveDetailModel extends ManagementTelModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getDetail(H_sess) //テーブル名の決定
	//配下の部署一覧取得
	//電話データ取得
	//電話データを１次元配列に整形
	//消えた項目補い
	//オプション取得
	//表示用割引サービス、オプション作成
	//予約種別
	{
		var A_id = split(":", H_sess.SELF.id);
		var telno = A_id[0];
		var carid = A_id[1];
		var reserve_date = A_id[2];
		var flg = A_id[3];
		this.setTableName(H_sess[TelReserveDetailModel.PUB].cym);
		var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid);
		var H_res = this.get_db().queryHash(this.makeTelReserveSelectOneSQL(telno, carid, reserve_date, flg));
		var H_data = this.putOneTelData(H_res, true);
		H_data.asscnt = H_res.length;
		H_data.postname = H_res[0].postname;
		H_data.carname = H_res[0].carname;
		H_data.cirname = H_res[0].cirname;
		H_data.arname = H_res[0].arname;
		H_data.buyselname = H_res[0].buyselname;
		H_data.planname = H_res[0].planname;
		H_data.packetname = H_res[0].packetname;
		H_data.pointname = H_res[0].pointname;
		H_data.billusername = H_res[0].billusername;
		H_data.reserve_date = H_res[0].reserve_date;
		H_data.add_edit_flg = H_res[0].add_edit_flg;
		H_data.exe_name = H_res[0].exe_name;
		H_data.exe_postname = H_res[0].exe_postname;
		H_data.exe_state = H_res[0].exe_state;
		H_data.kousiptnname = H_res[0].patternname;
		var H_op = this.getOptionDiscountData(H_res[0].carid, H_res[0].cirid, true);
		H_data.discounts_view = this.convertOptionView(H_op, H_data.discounts);
		H_data.options_view = this.convertOptionView(H_op, H_data.options);

		if (H_res[0].movepostid != "") {
			H_data.movepostname = this.getPostName(H_res[0].movepostid);
		}

		H_data.webreliefservice_lng = this.translateWebService(H_data.webreliefservice);

		if (H_data.add_edit_flg == TelReserveDetailModel.ADDMODE) {
			H_data.add_edit_view = "\u65B0\u898F";
			H_data.add_edit_view_eng = "New register";
		} else if (H_data.add_edit_flg == TelReserveDetailModel.MODMODE) {
			H_data.add_edit_view = "\u5909\u66F4";
			H_data.add_edit_view_eng = "Change";
		} else if (H_data.add_edit_flg == TelReserveDetailModel.MOVEMODE) {
			H_data.add_edit_view = "\u79FB\u52D5";
			H_data.add_edit_view_eng = "Shift";
		} else if (H_data.add_edit_flg == TelReserveDetailModel.DELMODE) {
			H_data.add_edit_view = "\u524A\u9664";
			H_data.add_edit_view_eng = "Delete";
		}

		if (H_data.length > 1) //配下の電話で無ければ消す
			{
				if (-1 !== A_post.indexOf(H_data.postid) == false) {
					delete H_data;
				}
			}

		return H_data;
	}

	getViewProperty() {
		var H_prop = this.getManagementProperty(TelReserveDetailModel.TELMID);

		for (var key in H_prop) {
			var value = H_prop[key];

			if (preg_match("/select/", key)) {
				var temp = value.split(":");
				H_prop[key] = temp[0];
			}
		}

		return H_prop;
	}

	__destruct() {
		super.__destruct();
	}

};