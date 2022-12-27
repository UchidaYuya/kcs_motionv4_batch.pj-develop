//
//資産データ設定 （Model）
//
//更新履歴：<br>
//2011/01/24 宝子山浩平 作成
//
//@package script
//@subpackage Model
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2011/01/24
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author houshiyama
//@since 2011/01/24
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//資産設定対象リスト取得
//
//@author
//@since 2011/01/24
//
//@param mixed $pactId
//@param mixed $carid
//@param mixed $telno
//@access public
//@return void
//
//
//端末レコード作成
//
//@author
//@since 2011/01/25
//
//@param mixed $value
//@param mixed $A_list
//@access public
//@return void
//
//
//データ更新
//
//@author
//@since 2011/01/31
//
//@access public
//@return void
//
//
//assets_tbへのインサート用配列を作る
//
//@author
//@since 2011/01/25
//
//@param mixed $value
//@access public
//@return void
//
//
//レコード作成
//
//@author
//@since 2011/01/25
//
//@param mixed $H_value
//@access public
//@return void
//
//
//テーブル番号設定
//
//@author
//@since 2011/01/24
//
//@param mixed $tableNo
//@access public
//@return void
//
//
//pactidをメンバー変数に設定
//
//@author
//@since 2011/01/25
//
//@param integer $pactId
//@access public
//@return void
//public function setPactId(integer $pactId) {
//$this->PactId = $pactId;
//}
//
//
//pactidを取得
//
//@author
//@since 2011/01/25
//
//@access public
//@return void
//public function getPactId() {
//if (is_numeric($this->PactId) == false) {
//throw new Exception("pactidが取得出来ません\n", 1);
//}
//return $this->PactId;
//}
//
//
//インサート時に使用するassetsidのシーケンス番号を取得
//
//@author houshiyama
//@since 2011/01/24
//
//@access public
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2011/01/24
//
//@access public
//@return void
//
class SetAssetsRecordsModel extends ModelBase {
	static SEPARATOR = ":";
	static DEFAULT_ASSETSTYPEID = 1;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
		this.Now = date("Y-m-d H:i:s");
	}

	getList(pactId, carId = undefined, telNo = undefined) {
		var sql = "select te.pactid,te.postid,te.carid,te.telno " + "from " + this.TelTb + " te " + "left join " + this.TelRelAssetsTb + " tra " + "on te.pactid=tra.pactid and te.carid=tra.carid and te.telno=tra.telno " + "where " + "te.pactid=" + this.getDB().dbQuote(pactId, "integer", true) + " and tra.pactid is null " + " and (te.dummy_flg = false or te.dummy_flg is null) ";

		if (is_null(carId) == false) {
			sql += " and te.carid=" + this.getDB().dbQuote(carId, "integer", true);
		}

		if (is_null(telNo) == false) {
			sql += " and te.telno=" + this.getDB().dbQuote(telNo, "text", true);
		}

		var A_res = this.getDB().queryHash(sql);
		return A_res;
	}

	createAssetsRecords(value, A_list) {
		this.getDB().beginTransaction();
		var H_assets = this.getValueHash(value);

		for (var H_row of Object.values(A_list)) //assets_X_tbへレコード作成
		{
			H_assets.pactid = H_row.pactid;
			H_assets.postid = H_row.postid;
			H_assets.assetsid = this.getNextAssetsid();

			if (this.createRecord(this.AssetsTb, H_assets) == false) {
				this.getDB().rollback();
				throw new Error(this.AssetsTb + "\u3078\u306E\u30EC\u30B3\u30FC\u30C9\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 1);
			}

			var H_rel = {
				pactid: H_row.pactid,
				carid: H_row.carid,
				telno: H_row.telno,
				assetsid: H_assets.assetsid,
				main_flg: "true",
				recdate: this.Now,
				fixdate: this.Now
			};

			if (this.createRecord(this.TelRelAssetsTb, H_rel) == false) {
				this.getDB().rollback();
				throw new Error(this.TelRelAssetsTb + "\u3078\u306E\u30EC\u30B3\u30FC\u30C9\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 1);
			}

			this.infoOut("pactid:" + H_row.pactid + ",carid:" + H_row.carid + ",telno:" + H_row.telno + ",assetsid:" + H_assets.assetsid + "\u30EC\u30B3\u30FC\u30C9\u4F5C\u6210\n", 1);
		}

		this.getDB().commit();
	}

	updateAssetsRecords(pactId, carId = undefined, telNo = undefined, value = undefined) {
		var H_value = this.getValueHash(value);

		if (-1 !== Object.keys(H_value).indexOf("recdate") == true) {
			delete H_value.recdate;
		}

		var H_info = this.getTableInfo(this.AssetsTb);
		var A_val = Array();

		for (var key in H_value) {
			var val = H_value[key];

			if (-1 !== Object.keys(H_info).indexOf(key) == false) {
				this.infoOut(key + "\u3000\u306F\u5B58\u5728\u3057\u306A\u3044\u30AB\u30E9\u30E0\u3067\u3059\n", 1);
				continue;
			}

			A_val.push(key + "=" + this.getDB().dbQuote(val, H_info[key].type, true));
		}

		if (!A_val == true) {
			return false;
		}

		var sql = "update " + this.AssetsTb + " set " + A_val.join(",") + " where assetsid in (select assetsid from " + this.TelRelAssetsTb + " where pactid=" + pactId;

		if (is_null(carId) == false) {
			sql += " and carid=" + this.getDB().dbQuote(carId, "integer", true);
		}

		if (is_null(telNo) == false) {
			sql += " and telno=" + this.getDB().dbQuote(telNo, "text", true);
		}

		sql += ")";
		this.infoOut(sql + "\n", 1);
		return this.getDB().query(sql);
	}

	getValueHash(value) {
		var H_value = {
			assetstypeid: SetAssetsRecordsModel.DEFAULT_ASSETSTYPEID,
			recdate: this.Now,
			fixdate: this.Now
		};

		if (is_null(value) == false) {
			var H_col = value.split(",");

			for (var valStr of Object.values(H_col)) {
				var H_tmp = valStr.split(":");
				H_value[H_tmp[0]] = H_tmp[1];
			}
		}

		return H_value;
	}

	createRecord(table, H_value) //not nullのカラム
	//insert 文作成
	//notnull項目のチェック
	{
		var H_info = this.getTableInfo(table);
		var A_notnull = Array();

		for (var key in H_info) {
			var H_row = H_info[key];

			if (H_row.notnull == "t" && H_row.default_value == undefined) {
				A_notnull.push(key);
			}
		}

		var A_key = Array();
		var A_val = Array();
		var A_ok = Array();

		for (var key in H_value) {
			var val = H_value[key];

			if (-1 !== Object.keys(H_info).indexOf(key) == false) {
				this.infoOut(key + "\u3000\u306F\u5B58\u5728\u3057\u306A\u3044\u30AB\u30E9\u30E0\u3067\u3059\n", 1);
				continue;
			}

			if (-1 !== A_notnull.indexOf(key) == true) {
				A_ok.push(key);
			}

			A_key.push(key);
			A_val.push(this.getDB().dbQuote(val, H_info[key].type, true));
		}

		var A_err = array_diff(A_notnull, A_ok);

		if (!A_err == false) {
			for (var col of Object.values(A_err)) {
				this.infoOut(col + "\u3000\u306FNOT NULL\u30AB\u30E9\u30E0\u3067\u3059\n", 1);
			}

			return false;
		}

		var sql = "insert into " + table + " (" + A_key.join(",") + ") values (" + A_val.join(",") + ")";
		return this.getDB().query(sql);
	}

	setTables(tableNo = undefined) {
		if (is_null(tableNo) == true) {
			var no = "";
		} else {
			no = str_pad(tableNo, 2, "0", STR_PAD_LEFT) + "_";
		}

		this.TelTb = "tel_" + no + "tb";
		this.TelRelAssetsTb = "tel_rel_assets_" + no + "tb";
		this.AssetsTb = "assets_" + no + "tb";
	}

	getNextAssetsid() {
		var assetsid = this.get_db().queryOne("select nextval('assets_parent_tb_assetsid_seq')");
		return assetsid;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};