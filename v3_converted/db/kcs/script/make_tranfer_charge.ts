//
//振替新テーブルデータ作成
//author igarashi
//

require("batch_setting.php");

require("MtDBUtil.php");

var O_db = MtDBUtil.singleton();
var sql = "SELECT max(transfer_level) FROM mt_transfer_tb";
var max = O_db.queryOne(sql);
sql = "SELECT ord.orderid, ord.shopid, sum(sub.number) AS macnum FROM mt_order_tb ord INNER JOIN mt_order_sub_tb sub ON ord.orderid=sub.orderid " + "WHERE sub.machineflg=true GROUP BY ord.orderid, ord.shopid ORDER BY orderid";
var H_macex = O_db.queryHash(sql);
sql = "SELECT ord.orderid, ord.shopid, sum(sub.number) AS acnum FROM mt_order_tb ord INNER JOIN mt_order_sub_tb sub ON ord.orderid=sub.orderid " + "WHERE sub.machineflg=false GROUP BY ord.orderid, ord.shopid ORDER BY orderid";
var H_accex = O_db.queryHash(sql);

for (var key in H_macex) {
	var val = H_macex[key];
	H_data[0][key][val.orderid].toshopid = val.shopid;
	H_data[0][key][val.orderid].machine = val.macnum;
	H_outproc[val.orderid] = {
		key: key,
		shop: val.shopid
	};
}

for (var key in H_accex) {
	var val = H_accex[key];

	if (true == (undefined !== H_outproc[val.orderid])) {
		H_data[0][H_outproc[val.orderid].key][val.orderid].toshopid = val.shopid;
		H_data[0][H_outproc[val.orderid].key][val.orderid].acce = val.acnum;
	} else {
		H_data[0][key][val.orderid].toshopid = val.shopid;
		H_data[0][key][val.orderid].acce = val.acnum;
	}
}

for (var i = 1; i <= max; i++) {
	var H_outproc = Array();
	var tag = i - 1;
	sql = "SELECT tr.orderid, tr.toshopid, tr.fromshopid, count(tr.detail_sort) " + "FROM mt_order_teldetail_tb det INNER JOIN mt_transfer_tb tr ON det.orderid=tr.orderid AND det.detail_sort=tr.detail_sort " + "WHERE det.machineflg=true AND tr.transfer_level=" + i + " GROUP BY tr.orderid, tr.toshopid, tr.fromshopid ORDER BY tr.orderid";
	var H_mactrns = O_db.queryHash(sql);

	for (var key in H_mactrns) {
		var val = H_mactrns[key];
		H_data[i][key][val.orderid].toshopid = val.toshopid;
		H_data[i][key][val.orderid].machine = val.count;
		H_outproc[val.orderid] = {
			key: key,
			shop: val.shopid
		};
		{
			let _tmp_0 = H_data[tag];

			for (var key in _tmp_0) {
				var tagval = _tmp_0[key];

				for (var orderid in tagval) {
					var value = tagval[orderid];

					if (orderid == val.orderid && value.toshopid == val.fromshopid) {
						H_data[tag][key][orderid].machine -= val.count;
						break;
					}
				}
			}
		}
	}

	sql = "SELECT tr.orderid, tr.toshopid, tr.fromshopid, count(tr.detail_sort) " + "FROM mt_order_sub_tb sub INNER JOIN mt_transfer_tb tr ON sub.orderid=tr.orderid AND sub.detail_sort=tr.detail_sort " + "WHERE sub.machineflg=false AND tr.transfer_level=" + i + " GROUP BY tr.orderid, tr.toshopid, tr.fromshopid ORDER BY tr.orderid";
	var H_acctrns = O_db.queryHash(sql);

	for (var key in H_acctrns) {
		var val = H_acctrns[key];

		if (true == (undefined !== H_outproc[val.orderid])) {
			if (H_data[i][H_outproc[val.orderid].key][val.orderid].toshopid != val.toshopid) {
				H_data[i][key][val.orderid].toshopid = val.toshopid;
				H_data[i][key][val.orderid].acce = val.count;
			} else {
				H_data[i][H_outproc[val.orderid].key][val.orderid].acce = val.count;
			}
		} else {
			H_data[i][key][val.orderid].toshopid = val.toshopid;
			H_data[i][key][val.orderid].acce = val.count;
		}

		{
			let _tmp_1 = H_data[tag];

			for (var key in _tmp_1) {
				var tagval = _tmp_1[key];

				for (var orderid in tagval) {
					var value = tagval[orderid];

					if (orderid == val.orderid && value.toshopid == val.fromshopid) {
						H_data[tag][key][orderid].acce -= val.count;
						break;
					}
				}
			}
		}
	}
}

var fp = fopen("/home/web/work_iga/insert_transfer_charge.sql", "w");

if (false == fp) {
	echo("\u30D5\u30A1\u30A4\u30EB\u751F\u6210\u5931\u6557");
	throw die();
}

var nowtime = "'" + O_db.getNow() + "'";

for (var level of Object.values(H_data)) {
	for (var detail of Object.values(level)) {
		for (var key in detail) {
			var val = detail[key];

			if (false == (undefined !== val.machine)) {
				var machine = 0;
			} else {
				machine = val.machine;
			}

			if (false == (undefined !== val.acce)) {
				var acce = 0;
			} else {
				acce = val.acce;
			}

			sql = "INSERT INTO mt_transfer_charge_shop_tb (orderid, shopid, maccnt, acccnt, recdate) VALUES(" + key + ", " + val.toshopid + ", " + machine + ", " + acce + ", " + nowtime + ");\n";
			fwrite(fp, sql);
		}
	}
}

fclose(fp);