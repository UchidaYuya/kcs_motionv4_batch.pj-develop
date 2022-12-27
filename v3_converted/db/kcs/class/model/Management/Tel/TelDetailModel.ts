//
//電話詳細表示Model
//
//更新履歴：<br>
//2008/06/17 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/06/17
//@uses ManagementTelModel
//
//
//
//電話詳細表示Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/06/17
//@uses ManagementTelModel
//

require("model/Management/Tel/ManagementTelModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/06/17
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//詳細情報取得
//
//@author houshiyama
//@since 2008/06/17
//
//@param array $H_H_sess
//@access public
//@return void
//
//
//電話用の設定項目取得
//
//@author houshiyama
//@since 2008/06/17
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/06/17
//
//@access public
//@return void
//
class TelDetailModel extends ManagementTelModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getDetail(H_sess) //テーブル名の決定
	//配下の部署一覧取得
	//電話データ取得
	//消えた項目補い
	//tablenoもviewに渡す
	//地域会社無は表示しない
	//表示用割引サービス、オプション作成
	//関連電話取得
	{
		var A_id = split(":", H_sess.SELF.id);
		var telno = A_id[0];
		var carid = A_id[1];
		this.setTableName(H_sess[TelDetailModel.PUB].cym);
		var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.tableno);
		var H_res = this.get_db().queryHash(this.makeTelSelectOneSQL(telno, carid));

		if (H_res.length < 1) {
			return undefined;
		}

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
		H_data.kousiptnname = H_res[0].patternname;
		H_data.tableno = this.H_Tb.tableno;

		if (H_data.arid == 100) {
			H_data.arname = "";
		}

		var H_op = this.getOptionDiscountData(H_res[0].carid, H_res[0].cirid, true);
		H_data.discounts_view = this.convertOptionView(H_op, H_data.discounts);
		H_data.options_view = this.convertOptionView(H_op, H_data.options);
		H_data.webreliefservice_lng = this.translateWebService(H_data.webreliefservice);
		var H_rel_tel = this.get_DB().queryHash(this.makeRelTelListSQL(H_data.telno, H_data.carid));
		H_data.rel_tel = this.makeRelTelDataArray(H_data.telno, H_data.carid, H_rel_tel);

		if (H_data.length > 1) //配下の電話で無ければ消す
			{
				if (-1 !== A_post.indexOf(H_data.postid) == false) {
					delete H_data;
				}
			}

		return H_data;
	}

	getViewProperty() {
		var H_prop = this.getManagementProperty(TelDetailModel.TELMID);

		for (var key in H_prop) {
			var value = H_prop[key];

			if (preg_match("/^select/", key)) {
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