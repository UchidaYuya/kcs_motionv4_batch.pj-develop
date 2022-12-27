//
//請求ダウンロード設定
//
//更新履歴
//2010/10/21	石崎公久	作成
//
//@uses ModelBase
//@uses CarrierModel
//@uses ClampModel
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/21
//
//
//
//請求ダウンロード設定
//
//@uses ModelBase
//@uses CarrierModel
//@uses ClampModel
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/10/21
//

require("model/ModelBase.php");

require("model/CarrierModel.php");

require("model/ClampModel.php");

//
//_carrier
//
//@var mixed
//@access protected
//
//
//_clamp
//
//@var mixed
//@access protected
//
//
//_settingAbles
//
//@var array
//@access protected
//
//
//コンストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
//
//getPactCarrierKeyHash
//
//@author
//@since 2010/10/21
//
//@param mixed $pactid
//@access public
//@return void
//
//
//checkCarrier
//
//@author
//@since 2010/10/21
//
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//getBDSettings
//
//@author
//@since 2010/10/22
//
//@param mixed $pactid
//@access public
//@return void
//
//
//setDeleteSetting
//
//@author
//@since 2010/10/22
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getClamps
//
//@author
//@since 2010/10/22
//
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//getClampRow
//
//@author
//@since 2010/11/19
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $detailno
//@access public
//@return void
//
//
//addClamp
//
//@author
//@since 2010/10/22
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $data
//@access public
//@return void
//
//
//editClamp
//
//@author
//@since 2010/11/16
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $detailno
//@param mixed $data
//@access public
//@return void
//
//
//removeClamp
//
//@author
//@since 2010/11/16
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $detailno
//@param mixed $data
//@access public
//@return void
//
//
//addKeyFile
//
//@author
//@since 2010/11/24
//
//@param mixed $pactid
//@access public
//@return void
//
//
//convertPem
//
//@author
//@since 2010/11/24
//
//@param mixed $pactid
//@param mixed $pass
//@access public
//@return void
//
//
//removeKeyFile
//
//@author
//@since 2010/11/24
//
//@param mixed $pactid
//@param mixed $file
//@access public
//@return void
//
//
//hideFilePath
//
//@author
//@since 2010/11/24
//
//@param mixed $data
//@access public
//@return void
//
//
//clampidのユニークチェック
//
//@author
//@since 2010/11/15
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $data
//@access public
//@return boolean
//
//
//checkParentTel
//
//@author
//@since 2010/11/16
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $data
//@access public
//@return void
//
//
//addParentTel
//
//@author
//@since 2010/11/16
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $data
//@access public
//@return void
//
//
//親番号編集
//
//@author
//@since 2010/11/16
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $prtelno
//@access public
//@return void
//
//
//親番号削除
//
//@author
//@since 2010/11/17
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $prtelno
//@access public
//@return void
//
//
//getParentTels
//
//@author
//@since 2010/10/22
//
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//getParentTel
//
//@author
//@since 2010/11/16
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $prtelno
//@access public
//@return void
//
//
//unsetDeleteSetting
//
//@author
//@since 2010/10/22
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getCarId
//
//@author
//@since 2010/11/17
//
//@access public
//@return void
//
//
//getClampString
//
//@author
//@since 2010/11/17
//
//@access public
//@return void
//
//
//getKeyFileList
//
//@author
//@since 2010/11/19
//
//@param mixed $carid
//@access public
//@return void
//
//
//_getCarrier
//
//@author
//@since 2010/10/21
//
//@access protected
//@return void
//
//
//_getClamp
//
//@author
//@since 2010/10/22
//
//@access protected
//@return void
//
class BDSettingsModel extends ModelBase {
	constructor() {
		super();
		this._settingAbleCarriers = [1, 3, 4];
	}

	getPactCarrierKeyHash(pactid) {
		var temp = this._getCarrier().getPactCarrierKeyHash(pactid);

		var count = count(temp);

		if (0 < count) {
			for (var key in temp) {
				var value = temp[key];

				if (!(-1 !== this._settingAbleCarriers.indexOf(key))) {
					delete temp[key];
				}
			}
		}

		return temp;
	}

	checkCarrier(pactid, carid) {
		var temp = this.getPactCarrierKeyHash(pactid);
		var count = count(temp);

		if (0 < count) {
			for (var key in temp) {
				var value = temp[key];

				if (carid == key) {
					return true;
				}
			}
		}

		return false;
	}

	getBDSettings(pactid, carid) {
		var select = "SELECT " + "count(*) " + "FROM " + "billdata_delete_setting_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND carid=" + this.getDB().dbQuote(carid, "int", true);
		var res = this.getDB().queryOne(select);

		if (1 == res) {
			return true;
		}

		return false;
	}

	setDeleteSetting(pactid, carid) {
		var insert = "INSERT INTO " + "billdata_delete_setting_tb (" + "pactid, " + "carid" + ") VALUES ( " + this.getDB().dbQuote(pactid, "integer", true) + ", " + this.getDB().dbQuote(carid, "integer", true) + " )";
		return this.getDB().exec(insert);
	}

	getClamps(pactid, carid) {
		return this._getClamp().getClamps(pactid, carid);
	}

	getClampRow(pactid, carid, detailno) {
		return this._getClamp().getClampRow(pactid, carid, detailno);
	}

	addClamp(pactid, carid, data) {
		return this._getClamp().addClamp(pactid, carid, data);
	}

	editClamp(pactid, carid, detailno, data) {
		return this._getClamp().editClamp(pactid, carid, detailno, data);
	}

	removeClamp(pactid, carid, detailno, data) {
		return this._getClamp().removeClamp(pactid, carid, detailno, data);
	}

	addKeyFile(pactid) {
		return this._getClamp().addKeyFile(pactid);
	}

	convertPem(pactid, pass) {
		return this._getClamp().convertPem(pactid, pass);
	}

	removeKeyFile(pactid, file) {
		return this._getClamp().removeKeyFile(pactid, file);
	}

	hideFilePath(data) {
		for (var key in data) {
			var val = data[key];

			if (!!val.key_file) {
				var pos = strrpos(val.key_file, "/");

				if (pos) {
					data[key].key_file = val.key_file.substr(pos + 1);
				}
			}
		}

		return data;
	}

	checkClamp(pactid, carid, data) {
		var sql = "SELECT count(*) FROM clamp_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND clampid=" + this.get_DB().dbQuote(data, "text", true);

		if (0 != this.get_DB().queryOne(sql)) {
			return false;
		}

		return true;
	}

	checkParentTel(pactid, carid, data) {
		var sql = "SELECT COUNT(*) FROM bill_prtel_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND prtelno=" + this.get_DB().dbQuote(data.prtelno, "text", true);

		if (0 != this.get_DB().queryOne(sql)) {
			return false;
		}

		return true;
	}

	addParentTel(pactid, carid, data) {
		return this._getClamp().addParentTel(pactid, carid, data);
	}

	editParentTel(pactid, carid, prtelno, data) {
		return this._getClamp().editParentTel(pactid, carid, prtelno, data);
	}

	removeParentTel(pactid, carid, prtelno) {
		return this._getClamp().removeParentTel(pactid, carid, prtelno);
	}

	getParentTels(pactid, carid) {
		var select = "SELECT " + "* " + "FROM " + "bill_prtel_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " " + "ORDER BY " + "prtelno";
		return this.getDB().queryHash(select);
	}

	getParentTel(pactid, carid, prtelno) {
		var select = "SELECT " + "* " + "FROM " + "bill_prtel_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND prtelno = " + this.getDB().dbQuote(prtelno, "text", true);
		return this.getDB().queryRowHash(select);
	}

	unsetDeleteSetting(pactid, carid) {
		var delete = "DELETE FROM billdata_delete_setting_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND carid=" + this.getDB().dbQuote(carid, "inte", true);
		return this.getDB().exec(delete);
	}

	getCarId() {
		if (preg_match("/docomo/", _SERVER.PHP_SELF)) {
			return +this.getSetting().car_docomo;
		} else if (preg_match("/au/", _SERVER.PHP_SELF)) {
			return +this.getSetting().car_au;
		} else if (preg_match("/softbank/", _SERVER.PHP_SELF)) {
			return +this.getSetting().car_softbank;
		}
	}

	getClampString() {
		if (preg_match("/docomo/", _SERVER.PHP_SELF)) {
			var H_str = {
				clampid: "docomoID",
				clamppasswd: "\u30D1\u30B9\u30EF\u30FC\u30C9",
				prtelno: "\u89AA\u96FB\u8A71\u756A\u53F7",
				prtelname: "\u8868\u793A\u540D\u79F0"
			};
		} else if (preg_match("/au/", _SERVER.PHP_SELF)) {
			H_str = {
				clampid: "\u30E6\u30FC\u30B6ID",
				code: "\u3054\u8ACB\u6C42\u30B3\u30FC\u30C9",
				clamppasswd: "\u30D1\u30B9\u30EF\u30FC\u30C9",
				key_file: "\u30AD\u30FC\u30D5\u30A1\u30A4\u30EB",
				key_pass: "\u30AD\u30FC\u30D5\u30A1\u30A4\u30EB\u30D1\u30B9\u30EF\u30FC\u30C9",
				prtelno: "\u8ACB\u6C42\u5148\u30B3\u30FC\u30C9",
				prtelname: "\u8868\u793A\u540D\u79F0"
			};
			H_str.key_file_n = H_str.key_file + "\u540D";
			H_str.key_file_i = H_str.key_file + "ID";
		} else if (preg_match("/softbank/", _SERVER.PHP_SELF)) {
			H_str = {
				clampid: "\u7BA1\u7406\u8005ID",
				clamppasswd: "\u30D1\u30B9\u30EF\u30FC\u30C9",
				prtelno: "\u89AA\u96FB\u8A71\u756A\u53F7",
				prtelname: "\u8868\u793A\u540D\u79F0"
			};
		}

		return H_str;
	}

	getKeyFileList(pactid, carid, mode = "hash") {
		return this._getClamp().getKeyFileList(pactid, carid, mode);
	}

	_getCarrier() {
		if (!this._carrier instanceof CarrierModel) {
			this._carrier = new CarrierModel();
		}

		return this._carrier;
	}

	_getClamp() {
		if (!this._clamp instanceof ClampModel) {
			this._clamp = new ClampModel();
		}

		return this._clamp;
	}

};