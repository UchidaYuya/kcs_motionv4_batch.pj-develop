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

require("view/Recom/AttachFilesView.php");

//
//_tempUpDir
//
//@var mixed
//@access protected
//
//
//_tempHiddenDir
//
//@var mixed
//@access protected
//
//
//_upfiles
//
//@var mixed
//@access protected
//
//
//_hiddenfiles
//
//@var mixed
//@access protected
//
//
//_upfileCount
//
//@var mixed
//@access protected
//
//
//_hiddenfileCount
//
//@var mixed
//@access protected
//
//
//_upNextFilename
//
//@var mixed
//@access protected
//
//
//_hiddenNextFilename
//
//@var mixed
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
//_checkFileDir
//
//@author
//@since 2010/12/03
//
//@access protected
//@return void
//
//
//_initUploaded
//
//@author
//@since 2010/12/14
//
//@param mixed $type
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
class AttachFilesActView extends AttachFilesView {
	static UP_DIR = "shop";
	static HIDDEN_DIR = "hidden";
	static ORDER_KEY = "/MTOrder";
	static ATTACH_INFO = "attach_shop.txt";
	static HIDDEN_INFO = "attach_shop.txt";

	constructor(args) {
		super(args);
		this._upfiles = Array();
		this._hiddenfiles = Array();
		this._upfileCount = 0;
		this._hiddenfileCount = 0;
		this._upNextFilename = 0;
		this._hiddenNextFilename = 0;
	}

	_checkFileDir() {
		var tempDir = KCS_DIR + "/files/temp_" + session_id();

		if (!file_exists(tempDir) || !is_dir(tempDir)) {
			this._makeDir(tempDir);
		}

		if (is_null(this._tempUpDir)) {
			this._tempUpDir = tempDir + "/" + AttachFilesActView.UP_DIR;

			this._makeDir(this._tempUpDir);
		}

		if (is_null(this._tempHiddenDir)) {
			this._tempHiddenDir = tempDir + "/" + AttachFilesActView.HIDDEN_DIR;

			this._makeDir(this._tempHiddenDir);
		}

		var tempFilesSession = this.gSess().getPub(AttachFilesActView.PUB_KEY);

		if (is_null(tempFilesSession)) {
			tempFilesSession = Array();
			tempFilesSession[AttachFilesActView.UP_DIR] = Array();
			tempFilesSession[AttachFilesActView.HIDDEN_DIR] = Array();
		}

		this._initUploaded(AttachFilesActView.UP_DIR);

		this._initUploaded(AttachFilesActView.HIDDEN_DIR);
	}

	_initUploaded(type) {
		if (AttachFilesActView.UP_DIR == type) {
			var dir = this._tempUpDir;
			var files = this._upfiles;
			var nextfilename = this._upNextFilename;
			var filecount = this._upfileCount;
		} else {
			dir = this._tempHiddenDir;
			files = this._hiddenfiles;
			nextfilename = this._hiddenNextFilename;
			filecount = this._hiddenfileCount;
		}

		var tempFilesSession = this.gSess().getPub(AttachFilesActView.PUB_KEY);

		if (is_null(tempFilesSession)) {
			tempFilesSession = Array();
			tempFilesSession[AttachFilesActView.UP_DIR] = Array();
			tempFilesSession[AttachFilesActView.HIDDEN_DIR] = Array();
		}

		var fh = opendir(dir);

		while (false !== (file = readdir(fh))) {
			if (file != "." && file != "..") {
				if (!(undefined !== tempFilesSession[type][file])) {
					unlink(dir + "/" + file);
					continue;
				}

				files.push(file);
			}
		}

		filecount = files.length;
		files.sort();

		for (var i = 0; i < filecount; i++) {
			if (nextfilename == files[i]) {
				nextfilename++;
			}
		}
	}

	checkCGIParam() {
		this._checkFileDir();

		if (0 < _POST.length) {
			if (0 < _FILES.length) {
				for (var key in _FILES) {
					var value = _FILES[key];

					if ("attachfiles" == key) {
						var type = AttachFilesActView.UP_DIR;
						var filecount = this._upfileCount;
						var dir = this._tempUpDir;
						var nextfilename = this._upNextFilename;
					} else {
						type = AttachFilesActView.HIDDEN_DIR;
						filecount = this._hiddenfileCount;
						dir = this._tempHiddenDir;
						nextfilename = this._hiddenNextFilename;
					}

					if ("" == value.name) {
						break;
					}

					if (filecount > 2) {
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

					var f_name = dir + "/" + nextfilename;
					var tempInfo = this.gSess().getPub(AttachFilesActView.PUB_KEY);

					if (is_null(tempInfo)) {
						tempInfo = Array();
						tempInfo[AttachFilesActView.UP_DIR] = Array();
						tempInfo[AttachFilesActView.HIDDEN_DIR] = Array();
					}

					tempInfo[type][nextfilename] = _FILES[key];
					this.gSess().setPub(AttachFilesActView.PUB_KEY, tempInfo);
					var res = move_uploaded_file(_FILES[key].tmp_name, f_name);
				}
			}

			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.setAssign("upfileCount", this._upfileCount);
		this.setAssign("hiddenfileCount", this._hiddenfileCount);
		this.setAssign("tempFiles", this.gSess().getPub(AttachFilesActView.PUB_KEY));
	}

	__destruct() {
		super.__destruct();
	}

};