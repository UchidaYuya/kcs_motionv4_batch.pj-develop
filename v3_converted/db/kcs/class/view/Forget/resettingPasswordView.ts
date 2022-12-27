//
//パスワード再設定ビュー
//
//@uses ViewSmarty
//@package
//@author igarashi
//@since 2012/12/05
//

require("view/ViewSmarty.php");

//
//getParam
//
//@author igarashi
//@since 2012/12/05
//
//@access public
//@return void
//
//
//setModelObject
//
//@author igarashi
//@since 2012/12/04
//
//@param mixed $mObj
//@access public
//@return void
//
//
//getLoginId
//
//@author igarashi
//@since 2012/12/05
//
//@access public
//@return void
//
//
//getMailAddr
//
//@author igarashi
//@since 2012/12/05
//
//@access public
//@return void
//
//
//getFinish
//
//@author web
//@since 2012/12/20
//
//@access public
//@return void
//
//
//setTplFile
//
//@author igarashi
//@since 2012/12/07
//
//@param mixed $tplFile
//@access public
//@return void
//
//
//setTplPath
//
//@author igarashi
//@since 2012/12/07
//
//@param mixed $tplPath
//@access public
//@return void
//
//
//setPactCode
//
//@author igarashi
//@since 2012/12/11
//
//@param mixed $pactcode
//@access public
//@return void
//
//
//getPactCode
//
//@author igarashi
//@since 2012/12/11
//
//@access public
//@return void
//
//
//setGroupId
//
//@author igarashi
//@since 2012/12/11
//
//@param mixed $groupid
//@access public
//@return void
//
//
//getGroupId
//
//@author igarashi
//@since 2012/12/11
//
//@access public
//@return void
//
//
//setVerisign
//
//@author web
//@since 2013/02/01
//
//@param mixed $verisign
//@access public
//@return void
//
//
//getVerisign
//
//@author web
//@since 2013/02/01
//
//@access public
//@return void
//
//
//transfer
//
//@author igarashi
//@since 2012/12/05
//
//@access public
//@return void
//
//
//setMessage
//
//@author igarashi
//@since 2012/12/10
//
//@param mixed $label
//@param mixed $message
//@access public
//@return void
//
//
//displaySmarty
//
//@author igarashi
//@since 2012/12/04
//
//@access public
//@return void
//
class resettingPasswordView extends ViewSmarty {
	getParam() {
		if (0 < _POST.length) {
			for (var key in _POST) {
				var val = _POST[key];

				if (preg_match("/loginid/", key)) {
					this.loginId = val;
					this.get_Smarty().assign("loginId", val);
				} else if (preg_match("/mail/", key)) {
					this.mailAddr = val;
					this.get_Smarty().assign("mailAddr", val);
				}
			}
		}

		if (0 < _GET.length) {
			for (var key in _GET) {
				var val = _GET[key];

				if (preg_match("/finish/", key)) {
					this.finish = true;
				}
			}
		}
	}

	setModelObject(mObj) {
		this._mObj = mObj;
	}

	getLoginId() {
		return this.loginId;
	}

	getMailAddr() {
		return this.mailAddr;
	}

	getFinish() {
		return this.finish;
	}

	setTplFile(tplFile) {
		if (!tplFile) {
			tplFile = "password.tpl";
		}

		this.tplFile = tplFile;
	}

	setTplPath(tplPath) {
		if (!tplPath) {
			tplPath = KCS_DIR + "/template/Forget/";
		}

		this.tplPath = tplPath;

		if (!preg_match("/\\/$/", tplPath)) {
			this.tplPath = tplPath + "/";
		}

		if (is_dir(tplPath)) {
			var dirName = _SERVER.PHP_SELF.replace(/password.php$/g, "compile");

			dirName = KCS_DIR + "/smarty_compile" + dirName;

			if (!is_dir(dirName)) {
				mkdir(dirName, "0755", true);
			}
		}
	}

	setPactCode(pactcode) {
		this.pactCode = pactcode;
	}

	getPactCode() {
		return this.pactCode;
	}

	setGroupId(groupid) {
		this.groupId = groupid;
	}

	getGroupId() {
		return this.groupId;
	}

	setVerisign(verisign) {
		this.verisign = false;

		if ("OFF" == verisign) {
			this.verisign = true;
		}
	}

	getVerisign() {
		return this.verisign;
	}

	transfer() //Smartyの設定
	{
		require("model/GroupModel.php");

		require("Authority.php");

		var row = this._mObj.getCompRow();

		var O_group = new GroupModel();

		if (1 < row.groupid) {
			var backurl = O_group.getGroupName(row.groupid) + "/hotline.php";
		} else {
			backurl = "Hotline/";
		}

		var auth = new Authority();
		var res = auth.chkPactAuth(206, row.pactid, true);
		var useridIni = auth.getUseridIni(row.pactid);
		this.get_Smarty().assign("grouptitle", O_group.getGroupTitle(row.groupid, row.type, row.language));

		if ("H" == row.type) {
			this.get_Smarty().assign("backurl", backurl);
			return true;
		} else {
			var cnt = substr_count(_SERVER.SCRIPT_NAME, "/");
			backurl = "";

			for (var i = 1; i < cnt; i++) {
				backurl += "../";
			}

			backurl += O_group.getGroupName(row.groupid);

			if (res) {
				backurl += "/" + useridIni + "/";
			}

			this.get_Smarty().assign("backurl", backurl);
			return true;
		}

		this.get_Smarty().assign("backurl", "/" + backurl);
		return true;
	}

	setMessage(label, message) {
		this.get_Smarty().assign(label, message);
	}

	displaySmarty() {
		var group = new GroupModel();
		this.get_Smarty().assign("grouptitle", group.getGroupTitle(this.groupId));
		this.get_Smarty().assign("newPassword", this._mObj.getPassword());
		this.get_Smarty().assign("groupid", this.groupId);
		this.get_Smarty().assign("noverisign", this.verisign);

		if (this._mObj.getIsUser()) {
			this.gSess().clearSessionKeySelf("passReset");
			this.get_Smarty().display(this.tplPath + "finish.tpl");
		} else {
			this.gSess().setSelf("passReset", 1);
			this.get_Smarty().display(this.tplPath + this.tplFile);
		}
	}

};