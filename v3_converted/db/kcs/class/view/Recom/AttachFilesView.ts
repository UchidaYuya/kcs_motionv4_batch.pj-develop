//
//注文ファイルアップロード
//
//更新履歴：<br>
//2010/12/03	石崎公久	作成<br>
//<br>
//CODE
//E001 ファイルサイズオーバー（5MB）
//E002 未対応の拡張子
//E003 ダウンロード対象のファイルが存在しない
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

require("view/ViewSmarty.php");

//
//tempDir
//
//@var mixed
//@access protected
//
//
//_files
//
//@var mixed
//@access protected
//
//
//_fileCount
//
//@var mixed
//@access protected
//
//
//nextFilename
//
//@var mixed
//@access protected
//
//
//_model
//
//@var mixed
//@access protected
//
//
//_checkDirs
//
//@var array
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
//setModel
//
//@author
//@since 2011/02/17
//
//@param mixed $model
//@access public
//@return void
//
//
//getModel
//
//@author
//@since 2011/02/17
//
//@access public
//@return void
//
//
//startCheck
//
//@author
//@since 2010/12/08
//
//@access public
//@return void
//
//
//setAssign
//
//@author ishizaki
//@since 2008/08/13
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//_makeDir
//
//@author
//@since 2010/12/06
//
//@param mixed $dir
//@access protected
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
//checkCGIParam
//
//@author ishizaki
//@since 2008/09/05
//
//@access public
//@return void
//
//
//_setError
//
//@author
//@since 2010/12/17
//
//@param mixed $code
//@access protected
//@return void
//
//
//_assignError
//
//@author
//@since 2010/12/17
//
//@access protected
//@return void
//
//
//_assignErrorTranslate
//
//@author
//@since 2010/12/17
//
//@param mixed $code
//@access protected
//@return void
//
//
//assignSmarty
//
//@author ishizaki
//@since 2008/09/05
//
//@access protected
//@return void
//
//
//displaySmarty
//
//@author ishizaki
//@since 2008/07/30
//
//@param string $err_str
//@access public
//@return void
//
//
//displayHTML
//
//@author ishizaki
//@since 2008/08/01
//
//@access public
//@return void
//
//
//displayError
//
//@author
//@since 2010/12/17
//
//@access public
//@return void
//
//
//_isExistAttacheFile
//
//@author
//@since 2011/02/17
//
//@param mixed $orderid
//@param mixed $dir
//@access public
//@return void
//
//
//_attachedFile
//
//@author
//@since 2011/02/17
//
//@param mixed $orderid
//@param mixed $dir
//@access protected
//@return void
//
//
//_attachedFile
//
//@author
//@since 2011/02/17
//
//@param mixed $orderid
//@param mixed $dir
//@access protected
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
class AttachFilesView extends ViewSmarty {
	static PUB_KEY = "/OrderAttach";
	static PATTERN = "/\\.(xls|xlt|pdf|doc|ppt|zip|lzh|html|htm|text|txt|xlsx|docx|pptx)$/i";
	static ERROR_KEY = "/ErrorOrderAttach";

	constructor() {
		super();
		this._checkDirs = ["order", "recog", "shop"];
		this._files = Array();
		this._fileCount = 0;
		this._nextFilename = 0;
	}

	setModel(model) {
		this._model = model;
		return this;
	}

	getModel() {
		if (!(undefined !== this._model) || !(this._model instanceof OrderLightModel)) {
			throw new Error();
		}

		return this._model;
	}

	startCheck() {
		super.startCheck();
		return this;
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	_makeDir(dir) {
		if (!file_exists(dir)) {
			if (!mkdir(dir)) {
				throw new Error();
			}
		}
	}

	_checkFileDir() //セッションIDのディレクトリ
	{
		if (is_null(this._tempDir)) {
			this._tempDir = KCS_DIR + "/files/temp_" + session_id();

			this._makeDir(this._tempDir);

			this._tempDir += "/order";

			this._makeDir(this._tempDir);
		}

		var tempFilesSession = this.gSess().getPub(AttachFilesView.PUB_KEY);

		if (is_null(tempFilesSession)) {
			tempFilesSession = Array();
			tempFilesSession.order = Array();
		}

		var fh = opendir(this._tempDir);

		while (false !== (file = readdir(fh))) {
			if (file != "." && file != "..") {
				if (!(undefined !== tempFilesSession.order[file])) {
					unlink(this._tempDir + "/" + file);
					continue;
				}

				this._files.push(file);
			}
		}

		this._fileCount = this._files.length;

		this._files.sort();

		for (var i = 0; i < this._fileCount; i++) {
			if (this._nextFilename == this._files[i]) {
				this._nextFilename++;
			}
		}
	}

	checkCGIParam() {
		this._checkFileDir();

		if (0 < _POST.length) {
			if (0 < _FILES.length) {
				for (var key in _FILES) {
					var value = _FILES[key];

					if ("" == value.name) {
						break;
					}

					if (this._fileCount > 2) {
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

					var f_name = this._tempDir + "/" + this._nextFilename;
					var tempInfo = this.gSess().getPub(AttachFilesView.PUB_KEY);

					if (is_null(tempInfo)) {
						tempInfo = Array();
						tempInfo.order = Array();
					}

					tempInfo.order[this._nextFilename] = _FILES[key];
					this.gSess().setPub(AttachFilesView.PUB_KEY, tempInfo);
					var res = move_uploaded_file(_FILES[key].tmp_name, f_name);
				}
			}

			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.setAssign("fileCount", this._fileCount);
		this.setAssign("tempFiles", this.gSess().getPub(AttachFilesView.PUB_KEY));
	}

	_setError(code) {
		var error = this.gSess().getPub(AttachFilesView.ERROR_KEY);

		if (is_null(error)) {
			error = Array();
		}

		error.push(code);
		this.gSess().setPub(AttachFilesView.ERROR_KEY, error);
	}

	_assignError() {
		var error = this.gSess().getPub(AttachFilesView.ERROR_KEY);

		if (!is_null(error) && Array.isArray(error)) {
			for (var value of Object.values(error)) {
				this._assignErrorTranslate(value);
			}
		}

		this.gSess().clearSessionPub(AttachFilesView.ERROR_KEY);
	}

	_assignErrorTranslate(code) {
		switch (code) {
			case "E001":
				this.H_assign.errstr += "ENG" == this.gSess().language ? "The file size to 5MB<br>\n" : "\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u306F5MB\u307E\u3067\u3067\u3059<br>\n";
				break;

			case "E002":
				this.H_assign.errstr += "ENG" == this.gSess().language ? "Unsupported file type<br>\n" : "\u672A\u5BFE\u5FDC\u306E\u62E1\u5F35\u5B50\u3067\u3059<br>\n";
				break;

			case "E003":
				this.H_assign.errstr += "ENG" == this.gSess().language ? "File not found. May have been deleted.<br>\n" : "\u5BFE\u8C61\u306E\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u524A\u9664\u3055\u308C\u305F\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002<br>\n";
				break;
		}
	}

	assignSmarty() {
		this._assignError();

		if (0 < this.H_assign.length) {
			{
				let _tmp_0 = this.H_assign;

				for (var key in _tmp_0) {
					var value = _tmp_0[key];
					this.get_Smarty().assign(key, value);
				}
			}
		}
	}

	displaySmarty(err_str = "") {
		this.get_Smarty().assign("err_str", err_str);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	displayHTML() {
		this.assignSmarty();

		if ("ENG" == this.gSess().language) {
			var template = this.getDefaultTemplate();
			template = str_replace("template", "template/eng", template);
			this.get_Smarty().display(template);
		} else {
			this.get_Smarty().display(this.getDefaultTemplate());
		}
	}

	displayError() {
		if ("ENG" == this.gSess().language) {
			var template = "/kcs/template/eng/MTOrder/error.tpl";
		} else {
			template = "/kcs/template/MTOrder/error.tpl";
		}

		this.get_Smarty().display(template);
		throw die(0);
	}

	_isExistAttacheFile(orderid, dir) {
		var res = this._attachedFile(orderid, dir);

		this._attachedShop(orderid, dir);
	}

	_attachedFile(orderid, dir) {
		for (var name of Object.values(this._checkDirs)) {
			var temp = dir + "/" + name;

			if (!is_dir(temp)) {
				continue;
			}

			var fh = opendir(temp);

			while (false !== (file = readdir(fh))) {
				if (file != "." && file != "..") {
					return this.getModel().signedAttachFlag(orderid);
				}
			}
		}

		return this.getModel().signedAttachFlag(orderid, false);
	}

	_attachedShop(orderid, dir) {
		var temp = dir + "/hidden";

		if (!is_dir(temp)) {
			return;
		}

		var fh = opendir(temp);

		while (false !== (file = readdir(fh))) {
			if (file != "." && file != "..") {
				return this.getModel().signedAttachShopFlag(orderid);
			}
		}

		return this.getModel().signedAttachShopFlag(orderid, false);
	}

	__destruct() {
		super.__destruct();
	}

};