//
//注文ファイルアップロード
//
//更新履歴：<br>
//2010/12/03	石崎公久	作成<br>
//<br>
//CODE
//E001 ファイルサイズオーバー（5MB）
//E002 未対応の拡張子
//
//@uses ViewSmarty
//@package Order
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/12/03
//
//
//
//注文ファイルアップロード
//
//@uses ViewSmarty
//@package Order
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/12/03
//

require("view/Order/AttachFilesView.php");

//
//_dir
//
//@var mixed
//@access protected
//
//
//_fileInfo
//
//@var mixed
//@access protected
//
//
//_fileCount
//
//@var float
//@access protected
//
//
//_hiddenInfo
//
//@var mixed
//@access protected
//
//
//_hiddenCount
//
//@var float
//@access protected
//
//
//__construct
//
//@author ishizaki
//@since 2008/07/31
//
//@access public
//@return void
//
//
//_getDir
//
//@author
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//_getFileinfo
//
//@author
//@since 2010/12/08
//
//@access protected
//@return void
//
//
//_getHiddeninfo
//
//@author
//@since 2010/12/13
//
//@access protected
//@return void
//
//
//_writeFileInfo
//
//@author
//@since 2010/12/09
//
//@access protected
//@return void
//
//
//_writeHiddenInfo
//
//@author
//@since 2010/12/13
//
//@access protected
//@return void
//
//
//displayHTML
//
//@author
//@since 2011/02/17
//
//@access public
//@return void
//
//
//_checkFileDir
//
//@author
//@since 2010/12/03
//
//@access protected
//@return void
//
//
//_getReadOnlyFileinof
//
//@author
//@since 2010/12/10
//
//@param mixed $type
//@param mixed $dir
//@access protected
//@return void
//
//
//_setUpableFileinfo
//
//@author
//@since 2010/12/10
//
//@access protected
//@return void
//
//
//_setHiddenFileinfo
//
//@author
//@since 2010/12/13
//
//@access protected
//@return void
//
//
//_getNextFilename
//
//@author
//@since 2010/12/09
//
//@access protected
//@return void
//
//
//_getNextHiddenname
//
//@author
//@since 2010/12/13
//
//@access protected
//@return void
//
//
//checkCGIParam
//
//@author ishizaki
//@since 2008/09/05
//
//@access public
//@return void
//
//
//__destruct
//
//@author ishizaki
//@since 2008/07/30
//
//@access public
//@return void
//
class AttachFilesShopView extends AttachFilesView {
	static UP_DIR = "shop";
	static HIDDEN_DIR = "hidden";
	static ORDER_KEY = "/MTOrder";
	static ATTACH_INFO = "attach_shop.txt";
	static HIDDEN_INFO = "attach_hidden.txt";

	constructor(args) {
		super(args);
		this._dir = undefined;
		this._fileInfo = undefined;
		this._fileCount = 0;
		this._hiddenInfo = undefined;
		this._hiddenCount = 0;
	}

	_getDir() {
		if (is_null(this._dir)) {
			var orderdata = this.gSess().getPub(AttachFilesShopView.ORDER_KEY);
			this._dir = KCS_DIR + "/files/OrderFiles/" + orderdata.orderid;
		}

		return this._dir;
	}

	_getFileinfo() {
		if (is_null(this._fileInfo)) {
			var filepath = this._getDir() + "/" + AttachFilesShopView.ATTACH_INFO;

			if (file_exists(filepath)) {
				this._fileInfo = unserialize(file_get_contents(filepath));
				this._fileCount = this._fileInfo.length;
			}
		}

		return this._fileInfo;
	}

	_getHiddeninfo() {
		if (is_null(this._hiddenInfo)) {
			var filepath = this._getDir() + "/" + AttachFilesShopView.HIDDEN_INFO;

			if (file_exists(filepath)) {
				this._hiddenInfo = unserialize(file_get_contents(filepath));
				this._hiddenCount = this._hiddenInfo.length;
			}
		}

		return this._hiddenInfo;
	}

	_writeFileInfo() {
		if (!is_null(this._fileInfo)) {
			var filepath = this._getDir() + "/" + AttachFilesShopView.ATTACH_INFO;
			var fh = fopen(filepath, "w+");
			fwrite(fh, serialize(this._fileInfo));
			fclose(fh);
		}
	}

	_writeHiddenInfo() {
		if (!is_null(this._hiddenInfo)) {
			var filepath = this._getDir() + "/" + AttachFilesShopView.HIDDEN_INFO;
			var fh = fopen(filepath, "w+");
			fwrite(fh, serialize(this._hiddenInfo));
			fclose(fh);
		}
	}

	displayHTML() {
		var orderdata = this.gSess().getPub(AttachFilesShopView.ORDER_KEY);
		var unuploadable = this.getModel().unUploadAble(orderdata.orderid);
		this.setAssign("unuploadable", unuploadable);
		super.displayHTML();

		if (is_null(unuploadable)) {
			this._isExistAttacheFile(orderdata.orderid, this._getDir());
		}

		this._attachDeleteDecision(orderdata.orderid, this._getDir());
	}

	_checkFileDir() {
		this._makeDir(this._getDir());

		this.setAssign("fileinfo", this._setUpableFileinfo());
		this.setAssign("hiddeninfo", this._setHiddenFileinfo());
		this.setAssign("orderinfo", this._getReadOnlyFileinof("order"));
		this.setAssign("recoginfo", this._getReadOnlyFileinof("recog"));
	}

	_getReadOnlyFileinof(type) {
		var filepath = this._getDir() + "/attach_" + type + ".txt";
		var filedir = this._getDir() + "/" + type;

		if (file_exists(filepath) && file_exists(filedir) && is_dir(filedir)) {
			var fileinfo = unserialize(file_get_contents(filepath));

			if (!is_null(fileinfo) && fileinfo.length > 0) {
				for (var key in fileinfo) {
					var value = fileinfo[key];

					if (!file_exists(this._getDir() + "/" + type + "/" + key)) {
						fileinfo[key].visible = false;
					} else {
						fileinfo[key].visible = true;
					}
				}
			}

			return fileinfo;
		}

		return undefined;
	}

	_setUpableFileinfo() {
		this._makeDir(this._getDir() + "/" + AttachFilesShopView.UP_DIR);

		var fileinfo = this._getFileinfo();

		if (!is_null(fileinfo)) {
			for (var key in fileinfo) {
				var value = fileinfo[key];

				if (!file_exists(this._getDir() + "/" + AttachFilesShopView.UP_DIR + "/" + key)) {
					fileinfo[key].visible = false;
				} else {
					fileinfo[key].visible = true;
				}
			}
		}

		return fileinfo;
	}

	_setHiddenFileinfo() {
		this._makeDir(this._getDir() + "/" + AttachFilesShopView.HIDDEN_DIR);

		var fileinfo = this._getHiddeninfo();

		if (!is_null(fileinfo)) {
			for (var key in fileinfo) {
				var value = fileinfo[key];

				if (!file_exists(this._getDir() + "/" + AttachFilesShopView.HIDDEN_DIR + "/" + key)) {
					fileinfo[key].visible = false;
				} else {
					fileinfo[key].visible = true;
				}
			}
		}

		return fileinfo;
	}

	_getNextFilename() {
		var temp = 0;
		var temps = Array();

		if (!is_null(this._fileInfo)) {
			{
				let _tmp_0 = this._fileInfo;

				for (var key in _tmp_0) {
					var value = _tmp_0[key];
					temps.push(key);
				}
			}
			temps.sort();

			for (var value of Object.values(temps)) {
				if (value == temp) {
					temp++;
				}
			}
		}

		return temp;
	}

	_getNextHiddenname() {
		var temp = 0;
		var temps = Array();

		if (!is_null(this._hiddenInfo)) {
			{
				let _tmp_1 = this._hiddenInfo;

				for (var key in _tmp_1) {
					var value = _tmp_1[key];
					temps.push(key);
				}
			}
			temps.sort();

			for (var value of Object.values(temps)) {
				if (value == temp) {
					temp++;
				}
			}
		}

		return temp;
	}

	checkCGIParam() //一覧からは先にorderid格納しないと動かない
	{
		if (undefined !== _GET.o) {
			this.gSess().setPub(AttachFilesShopView.ORDER_KEY, {
				orderid: +_GET.o
			});
		}

		this._checkFileDir();

		if (0 < _POST.length) {
			if (0 < _FILES.length) {
				for (var key in _FILES) {
					var value = _FILES[key];

					if ("" == value.name) {
						break;
					}

					if (this._fileCount > 2 && key == "attachfiles") {
						break;
					}

					if (this._hiddenCount > 2 && key != "attachfiles") {
						break;
					}

					if (_FILES[key].name != "" && preg_match(AttachFilesView.PATTERN, _FILES[key].name) == false) {
						this._setError("E002");

						break;
					}

					if (_FILES[key].error == 2) {
						return true;
					}

					if (5242880 < _FILES[key].size) {
						this._setError("E001");

						break;
					}

					if ("attachfiles" == key) {
						var f_name = this._getDir() + "/" + AttachFilesShopView.UP_DIR + "/" + this._getNextFilename();

						this._fileInfo[this._getNextFilename()] = _FILES[key];

						this._writeFileInfo();
					} else {
						f_name = this._getDir() + "/" + AttachFilesShopView.HIDDEN_DIR + "/" + this._getNextHiddenname();
						this._hiddenInfo[this._getNextHiddenname()] = _FILES[key];

						this._writeHiddenInfo();
					}

					var res = move_uploaded_file(_FILES[key].tmp_name, f_name);
				}
			}

			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.setAssign("fileCount", this._fileCount);
		this.setAssign("hiddenCount", this._hiddenCount);
	}

	__destruct() {
		super.__destruct();
	}

};