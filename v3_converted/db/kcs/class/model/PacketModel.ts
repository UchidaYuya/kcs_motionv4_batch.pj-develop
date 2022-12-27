//
//パケットテーブル（packet_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//
//
//
//パケットテーブル（packet_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $O_db
//@access public
//@return void
//
//
//packetidをキーにpacketnameを値にして返す
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $past
//@access public
//@return void
//
//
//packetidをキーにpacketname_engを値にして返す
//
//@author houshiyama
//@since 2008/12/09
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $past
//@access public
//@return void
//
//
//指定したキャリア、回線のパケットパック数を返す
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return void
//
//
//getPacketNameArray
//
//@author katsushi
//@since 2008/07/25
//
//@param array $A_packetid
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/05/21
//
//@access public
//@return void
//
class PacketModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getPacketKeyHash(carid, cirid = "", past = true, default_packetid = 0) //キャリアのみ指定
	//idをカンマで連結し重複を除く
	{
		var sql = "select packetid,packetname from packet_tb ";

		if ("" == cirid) {
			sql += " where carid=" + carid + " and packetid > 3000 ";
		} else {
			sql += " where carid=" + carid + " and cirid=" + cirid + " and packetid > 3000 ";
		}

		if (past == false) {
			if (default_packetid == 0) {
				sql += " and viewflg=true ";
			} else //電話管理には表示しない設定になっているものでも、現在設定されているなら表示する
				{
					sql += " and ( viewflg=true or packetid = " + default_packetid + ") ";
				}
		}

		sql += " order by sort";
		var H_res = this.get_DB().queryAssoc(sql);

		if ("" == cirid) {
			var H_data = Array();

			for (var oid in H_res) {
				var oname = H_res[oid];
				var hit = false;

				for (var nid in H_data) {
					var nname = H_data[nid];

					if (oname === nname) //IDを連結
						//重複を削除
						{
							var key = nid + "," + oid;
							H_data[key] = nname;
							delete H_data[nid];
							hit = true;
							break;
						}
				}

				if (false === hit) {
					H_data[oid] = oname;
				}
			}
		} else {
			H_data = H_res;
		}

		return H_data;
	}

	getPacketEngKeyHash(carid, cirid = "", past = true, default_packetid = 0) //キャリアのみ指定
	//idをカンマで連結し重複を除く
	{
		var sql = "select packetid,packetname_eng from packet_tb ";

		if ("" == cirid) {
			sql += " where carid=" + carid + " and packetid > 3000 ";
		} else {
			sql += " where carid=" + carid + " and cirid=" + cirid + " and packetid > 3000 ";
		}

		if (past == false) {
			if (default_packetid == 0) {
				sql += " and viewflg=true ";
			} else //電話管理には表示しない設定になっているものでも、現在設定されているなら表示する
				{
					sql += " and ( viewflg=true or packetid = " + default_packetid + ") ";
				}
		}

		sql += " order by sort";
		var H_res = this.get_DB().queryAssoc(sql);

		if ("" == cirid) {
			var H_data = Array();

			for (var oid in H_res) {
				var oname = H_res[oid];
				var hit = false;

				for (var nid in H_data) {
					var nname = H_data[nid];

					if (oname === nname) //IDを連結
						//重複を削除
						{
							var key = nid + "," + oid;
							H_data[key] = nname;
							delete H_data[nid];
							hit = true;
							break;
						}
				}

				if (false === hit) {
					H_data[oid] = oname;
				}
			}
		} else {
			H_data = H_res;
		}

		return H_data;
	}

	getPacketCnt(carid, cirid) {
		var sql = "select count(packetid) from packet_tb " + " where carid=" + carid + " and cirid=" + cirid + " and packetid > 3000 ";
		var H_data = this.get_DB().queryOne(sql);
		return H_data;
	}

	getPacketNameArray(A_packetid: {} | any[]) {
		var sql = "select packetname from packet_tb where packetid in (" + A_packetid.join(",") + ") order by sort";
		return this.get_DB().queryCol(sql);
	}

	__destruct() {
		super.__destruct();
	}

};