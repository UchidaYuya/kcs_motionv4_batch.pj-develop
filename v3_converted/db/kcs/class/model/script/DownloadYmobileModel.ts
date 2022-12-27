//Ymobileダウンロード
//    ソフトバンクのダウンロードを元にしている
//    (ソフトバンクとYmobileのサイト構成がドメイン以外同じなので・・)
//    2019527 伊達改造
//
//DownloadYmobileModel
//Ymobileのダウンロード
//@uses ModelBase
//@package
//@author web
//@since 2019/05/27
//

require("model/ModelBase.php");

require("MtDateUtil.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2009/06/05
//
//@param objrct $O_db0
//@access public
//@return void
//
//
//DLサイトへのログインID、パスワードを取得
//
//@author miyazawa
//@since 2009/05/28
//
//@param int $pactid 契約ID
//@access public
//@return
//
//
//clamp_index_tbに既存のデータかどうかチェック
//
//@author miyazawa
//@since 2009/11/26
//
//@param int $H_data WHERE条件
//@access public
//@return
//
//
//clamp_tbアップデート
//
//@author miyazawa
//@since 2009/05/28
//
//@param int $pactid 契約ID
//@param int $detailno 枝番
//@param boolean $login ログインの成功/失敗
//@access public
//@return void
//
//
//clamp_index_tbの最終ログイン日付アップデート
//
//@author miyazawa
//@since 2009/11/26
//
//@param int $H_data データとWHERE条件
//@access public
//@return
//
//
//clamp_error_tbインサート
//
//@author miyazawa
//@since 2009/06/05
//
//@param int $pactid 契約ID
//@param int $carid キャリアID
//@access public
//@return void
//
//
//__destruct
//
//@author miyazawa
//@since 2009/06/05
//
//@access public
//@return void
//
class DownloadYmobileModel extends ModelBase {
	constructor(O_db0) {
		super(O_db0);
	}

	getID(pactid = "") //pactid指定
	{
		var sql = "SELECT pactid, clampid, clamppasswd FROM clamp_tb WHERE carid=" + this.getSetting().car_softbank + " AND login_status != 1";

		if (true == (undefined !== pactid) && true == is_numeric(pactid)) {
			sql += " AND pactid=" + pactid;
		}

		return this.get_DB().queryHash(sql);
	}

	getClampIndexCount(H_outClampIndex = Array()) {
		var H_data = H_outClampIndex[0];
		var sql = "SELECT count(*) FROM clamp_index_tb WHERE pactid=" + H_data.pactid + " AND carid=" + H_data.carid + " AND year='" + H_data.year + "' AND month='" + H_data.month + "'";

		if (true == (undefined !== H_data.detailno) && "" != H_data.detailno) {
			sql += " AND detailno=" + H_data.detailno;
		}

		if (true == (undefined !== H_data.type) && "" != H_data.type) {
			sql += " AND type='" + H_data.type + "'";
		}

		return this.get_DB().queryOne(sql);
	}

	updateClamp(pactid, detailno, login) //clamp_tbアップデート文作成
	//clamp_tbアップデート実行
	//$this->debugOut( $upd_sql."\n" );	// デバッグ表示
	//$this->infoOut( $upd_sql."\n" );	// 情報表示、printの代わりにこれを使う
	{
		if (true == login) {
			var login_status = 1;
		} else {
			login_status = 2;
		}

		var upd_sql = "UPDATE clamp_tb SET login_status = " + login_status + " WHERE carid=" + this.getSetting().car_softbank + " AND pactid=" + pactid + " AND detailno=" + detailno;
		this.get_DB().query(upd_sql);
		return this.get_DB().query(upd_sql);
	}

	updateClampIndexFixdate(H_outClampIndex = Array()) {
		var H_data = H_outClampIndex[0];
		var sql = "UPDATE clamp_index_tb SET fixdate='" + H_data.fixdate + "'";

		if (true == (undefined !== H_data.dldate) && "" != H_data.dldate) {
			sql += ", dldate='" + H_data.dldate + "'";
		}

		if (true == (undefined !== H_data.dldate) && "" != H_data.is_ready) {
			var is_ready = H_data.is_ready;

			if (1 == is_ready) {
				is_ready = "true";
			} else if (0 == is_ready) {
				is_ready = "false";
			}

			sql += ", is_ready=" + is_ready;
		}

		sql += " WHERE pactid=" + H_data.pactid + " AND carid=" + H_data.carid + " AND year='" + H_data.year + "' AND month='" + H_data.month + "'";

		if (true == (undefined !== H_data.detailno) && "" != H_data.detailno) {
			sql += " AND detailno=" + H_data.detailno;
		}

		if (true == (undefined !== H_data.type) && "" != H_data.type) {
			sql += " AND type='" + H_data.type + "'";
		}

		return this.get_DB().query(sql);
	}

	InsertClampError(pactid, carid, H_error = Array()) //clamp_tbインサート文作成
	{
		if (true == H_error.length > 0) //clamp_tbインサート実行
			{
				var ins_sql = "";

				for (var A_row of Object.values(H_error)) {
					ins_sql += "INSERT INTO clamp_error_tb (pactid, carid, error_type, message, recdate) VALUES (";
					ins_sql += pactid + ", ";
					ins_sql += carid + ", ";
					ins_sql += "'" + A_row.type + "',";
					ins_sql += "'" + A_row.message + "',";
					ins_sql += "'" + MtDateUtil.getNow() + "'";
					ins_sql += "); ";
				}

				this.get_DB().query(ins_sql);
			}
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};