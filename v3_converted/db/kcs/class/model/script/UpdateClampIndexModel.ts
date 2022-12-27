//
//clamp_index_tbアップデートモデル
//
//@uses ModelBase
//@package UpdateClampIndex
//@filesource
//@author miyazawa
//@since 2009/10/27
//
//
//
//clamp_index_tbアップデートモデル
//
//@uses ModelBase
//@package UpdateClampIndex
//@author miyazawa
//@since 2009/10/27
//

require("model/ModelBase.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2009/10/27
//
//@param objrct $O_db0
//@access public
//@return mixed
//
//
//clamp_index_tbアップデート
//
//@author miyazawa
//@since 2009/10/27
//
//@param mixed $H_val
//@access public
//@return void
//
//
//__destruct
//
//@author miyazawa
//@since 2009/10/27
//
//@access public
//@return void
//
class UpdateClampIndexModel extends ModelBase {
	constructor(O_db0) {
		super(O_db0);
	}

	updateIndex(H_val = Array()) {
		if (true == 0 < H_val.length) //既にtrueだったらfalseにしない（複数の枝番がある場合、後に処理されたものにデータがないとtrueがfalseで上書きされてしまう）20100115miya
			{
				var sql = "SELECT count(pactid) FROM clamp_index_tb ";
				sql += "WHERE " + H_val.column + " = true AND year='" + H_val.year + "' AND month='" + H_val.month + "' AND carid=" + H_val.carid + " AND pactid=" + H_val.pactid;
				var true_cnt = this.get_DB().queryOne(sql);

				if (1 > true_cnt) //clamp_index_tbアップデート文作成
					//$this->debugOut( $upd_sql."\n" );	// デバッグ表示
					//$this->infoOut( $upd_sql."\n" );	// 情報表示、printの代わりにこれを使う
					//clamp_index_tbアップデート実行
					{
						var upd_sql = "UPDATE clamp_index_tb SET " + H_val.column + " = " + H_val.result + " ";
						upd_sql += "WHERE year='" + H_val.year + "' AND month='" + H_val.month + "' AND carid=" + H_val.carid + " AND pactid=" + H_val.pactid;
						return this.get_DB().query(upd_sql);
					} else {
					return true;
				}
			}

		return false;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};