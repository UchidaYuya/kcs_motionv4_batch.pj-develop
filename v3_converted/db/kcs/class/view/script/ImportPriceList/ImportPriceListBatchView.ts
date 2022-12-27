//
//価格表インポート
//
//更新履歴：<br>
//2008/10/21 上杉勝史 作成
//
//@uses ViewBase
//@package PriceList
//@author katsushi
//@since 2008/10/21
//
//
//error_reporting(E_ALL);
//
//価格表インポート
//
//@uses ViewBase
//@package PriceList
//@author katsushi
//@since 2008/10/21
//

require("view/ViewBase.php");

require("MtSetting.php");

require("MtOutput.php");

require("model/ShopModel.php");

//
//コンストラクター
//
//@author katsushi
//@since 2008/11/10
//
//@access public
//@return void
//
//
//getStep
//
//@author katsushi
//@since 2008/11/11
//
//@access public
//@return void
//
//
//setGroupHash
//
//@author katsushi
//@since 2008/11/11
//
//@access protected
//@return void
//
//
//getGroupid
//
//@author katsushi
//@since 2008/11/10
//
//@access public
//@return void
//
//
//getShopid
//
//@author katsushi
//@since 2008/11/10
//
//@access public
//@return void
//
//
//getImportFileName
//
//@author katsushi
//@since 2008/11/10
//
//@access public
//@return void
//
//
//setImportFileName
//
//@author katsushi
//@since 2008/11/11
//
//@param mixed $import_file_name
//@access public
//@return void
//
//
//setScriptLog
//
//@author katsushi
//@since 2008/11/10
//
//@param mixed $logfile
//@access public
//@return void
//
//
//getArgs
//
//@author katsushi
//@since 2008/11/10
//
//@access public
//@return void
//
//
//displayHelp
//
//@author katsushi
//@since 2008/11/10
//
//@param mixed $msg
//@access public
//@return void
//
//
//displayStart
//
//@author katsushi
//@since 2008/11/11
//
//@access public
//@return void
//
//
//echoLine
//
//@author katsushi
//@since 2008/11/12
//
//@param string $msg
//@param string $str
//@access public
//@return void
//
//
//echoListMsg
//
//@author katsushi
//@since 2008/11/12
//
//@param array $A_msg
//@access public
//@return void
//
//
//echoSimple
//
//@author katsushi
//@since 2008/11/12
//
//@param string $msg
//@access public
//@return void
//
//
//chkConfirm
//
//@author katsushi
//@since 2008/11/11
//
//@param mixed $ret
//@access public
//@return void
//
//
//getSTDIN
//
//@author katsushi
//@since 2008/11/11
//
//@param mixed $msg
//@access public
//@return void
//
//
//デストラクタ
//
//@author katsushi
//@since 2008/11/10
//
//@access public
//@return void
//
class ImportPriceListBatchView extends ViewBase {
	constructor() {
		super();
		this.O_shopmodel = new ShopModel();
		this.H_group = Array();
		this.H_shop = Array();
		this.setGroupHash();
		this.import_file_name = undefined;
		this.groupid = undefined;
		this.shopid = undefined;
		this.exectype = undefined;
		this.yesno = undefined;
	}

	getStep() {
		return undefined;
	}

	setGroupHash() {
		this.getSetting().loadConfig("group");

		for (var i = 0; i <= this.getSetting().max_groupid; i++) {
			if (this.getSetting().existsKey("groupid" + i) == true) {
				this.H_group[this.getSetting()["groupid" + i]] = i;
			}
		}
	}

	getGroupid() {
		return this.groupid;
	}

	getShopid() {
		return this.shopid;
	}

	getImportFileName() {
		return this.import_file_name;
	}

	setImportFileName(import_file_name) //存在チェック
	//拡張子チェック
	{
		if (file_exists(import_file_name) == false) {
			return false;
		}

		var H_file = pathinfo(import_file_name);

		if (preg_match("/^xls$/i", H_file.extension) == false) {
			return false;
		}

		this.import_file_name = import_file_name;
		return true;
	}

	setScriptLog(logfile) {
		this.getOut().set_ScriptLog(logfile);
	}

	getArgs() //help
	//不明なオプションのチェック
	{
		var A_args = _SERVER.argv;
		A_args.shift();

		if (-1 !== A_args.indexOf("--help") == true) {
			this.displayHelp();
		}

		if (A_args.length < 2) {
			this.displayHelp("\u5F15\u6570\u304C\u8DB3\u308A\u307E\u305B\u3093");
		}

		var A_chkarg = Array();

		for (var i = 0; i < A_args.length; i++) //読み込むEXCELファイル
		{
			if (preg_match("/^\\-f=/", A_args[i]) == true) {
				var arg_import_file_name = A_args[i].replace(/^\-f=/g, "");

				if (this.setImportFileName(arg_import_file_name) == false) {
					this.displayHelp("\u6307\u5B9A\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u304C\u5B58\u5728\u3057\u306A\u3044\u304BEXCEL\u30D5\u30A1\u30A4\u30EB\u3067\u306F\u3042\u308A\u307E\u305B\u3093");
				}

				A_chkarg.push(A_args[i]);
			}

			if (preg_match("/^\\-g=/", A_args[i]) == true) {
				var arg_groupname = A_args[i].replace(/^\-g=/g, "");
				var tmp_groupid = this.H_group[arg_groupname];

				if (this.groupid !== undefined) {
					if (this.groupid != tmp_groupid) {
						this.displayHelp("\u8907\u6570\u306E\u30B0\u30EB\u30FC\u30D7\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059");
					}
				}

				if (undefined !== arg_postcode == true) //$H_shop = $this->O_shopmodel->getShopFromPostcode($tmp_groupid, $arg_postcode);
					{
						var H_shop = this.O_shopmodel.getShopFromloginid(tmp_groupid, arg_postcode);

						if (Array.isArray(H_shop) == false || H_shop.length < 1) {
							this.displayHelp("\u6307\u5B9A\u3055\u308C\u305F\u30B0\u30EB\u30FC\u30D7\u5185\u306B\u8CA9\u58F2\u5E97\u30B3\u30FC\u30C9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
						}

						this.H_shop = H_shop;
						this.shopid = H_shop.shopid;
					}

				this.groupid = tmp_groupid;
				A_chkarg.push(A_args[i]);
			}

			if (preg_match("/^\\-G=/", A_args[i]) == true) {
				var arg_groupid = A_args[i].replace(/^\-G=/g, "");

				if (is_numeric(arg_groupid) == false) {
					this.displayHelp("\u30B0\u30EB\u30FC\u30D7ID\u306F\u534A\u89D2\u6570\u5B57\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044");
				}

				if (this.groupid !== undefined) {
					if (this.groupid != arg_groupid) {
						this.displayHelp("\u8907\u6570\u306E\u30B0\u30EB\u30FC\u30D7\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059");
					}
				}

				if (undefined !== arg_postcode == true) //$H_shop = $this->O_shopmodel->getShopFromPostcode($arg_groupid, $arg_postcode);
					{
						H_shop = this.O_shopmodel.getShopFromloginid(arg_groupid, arg_postcode);

						if (Array.isArray(H_shop) == false || H_shop.length < 1) {
							this.displayHelp("\u6307\u5B9A\u3055\u308C\u305F\u30B0\u30EB\u30FC\u30D7\u5185\u306B\u8CA9\u58F2\u5E97\u30B3\u30FC\u30C9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
						}

						this.H_shop = H_shop;
						this.shopid = H_shop.shopid;
					}

				this.groupid = +arg_groupid;
				A_chkarg.push(A_args[i]);
			}

			if (preg_match("/^\\-p=/", A_args[i]) == true) {
				var arg_postcode = A_args[i].replace(/^\-p=/g, "");

				if (this.groupid !== undefined) //$H_shop = $this->O_shopmodel->getShopFromPostcode($this->groupid, $arg_postcode);
					{
						H_shop = this.O_shopmodel.getShopFromloginid(this.groupid, arg_postcode);

						if (Array.isArray(H_shop) == false || H_shop.length < 1) {
							this.displayHelp("\u6307\u5B9A\u3055\u308C\u305F\u30B0\u30EB\u30FC\u30D7\u5185\u306B\u8CA9\u58F2\u5E97\u30B3\u30FC\u30C9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
						}

						if (this.shopid !== undefined) {
							if (this.shopid != H_shop.shopid) {
								this.displayHelp("\u8907\u6570\u306E\u8CA9\u58F2\u5E97\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059");
							}
						}

						this.H_shop = H_shop;
						this.shopid = H_shop.shopid;
					}

				A_chkarg.push(A_args[i]);
			}

			if (preg_match("/^\\-S=/", A_args[i]) == true) {
				var arg_shopid = +A_args[i].replace(/^\-S=/g, "");

				if (is_numeric(arg_shopid) == false) {
					this.displayHelp("shopid\u306F\u534A\u89D2\u6570\u5B57\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044");
				}

				H_shop = this.O_shopmodel.getShopFromShopid(arg_shopid);

				if (Array.isArray(H_shop) == false || H_shop.length < 1) {
					this.displayHelp("\u6307\u5B9A\u3055\u308C\u305F\u8CA9\u58F2\u5E97\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
				}

				if (this.shopid !== undefined) {
					if (this.shopid != arg_shopid) {
						this.displayHelp("\u8907\u6570\u306E\u8CA9\u58F2\u5E97\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059");
					}
				}

				if (this.groupid !== undefined) {
					if (this.groupid != H_shop.groupid) {
						this.displayHelp("\u8907\u6570\u306E\u30B0\u30EB\u30FC\u30D7\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059");
					}
				}

				this.H_shop = H_shop;
				this.shopid = H_shop.shopid;
				this.groupid = H_shop.groupid;
				A_chkarg.push(A_args[i]);
			}

			if (A_args[i] == "--yes") {
				this.yesno = "yes";
				A_chkarg.push(A_args[i]);
			}

			if (A_args[i] == "--no") {
				this.yesno = "no";
				A_chkarg.push(A_args[i]);
			}

			if (A_args[i] == "--silent") {
				this.exectype = "silent";

				if (this.yesno === undefined) {
					this.yesno = "no";
				}

				A_chkarg.push(A_args[i]);
			}
		}

		var A_unknown = array_diff(A_args, A_chkarg);

		if (A_unknown.length > 0) {
			this.displayHelp("\u4E0D\u660E\u306A\u30AA\u30D7\u30B7\u30E7\u30F3: " + A_unknown.join(", "));
		}

		if (this.import_file_name === undefined) {
			this.displayHelp("EXCEL\u30D5\u30A1\u30A4\u30EB\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044");
		}

		if (this.groupid === undefined) {
			this.displayHelp("\u30B0\u30EB\u30FC\u30D7\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044");
		}

		if (this.shopid === undefined) {
			this.shopid = 0;
		}
	}

	displayHelp(msg = "") {
		if (msg != "") {
			echo("\u30E1\u30C3\u30BB\u30FC\u30B8: " + msg + "\n");
		}

		echo("Usage: " + basename(_SERVER.SCRIPT_NAME) + "\n");
		echo("\n");
		echo("Option(s)\n");
		echo("\t-f=[EXCEL\u30D5\u30A1\u30A4\u30EB\u540D]\t\u5FC5\u9808\n");
		echo("\t-g=[\u30B0\u30EB\u30FC\u30D7\u540D]     \t\u5FC5\u9808(\u30B0\u30EB\u30FC\u30D7ID\u3001\u8CA9\u58F2\u5E97ID\u3092\u5165\u529B\u3057\u305F\u5834\u5408\u306F\u4E0D\u8981)\n");
		echo("\t-G=[\u30B0\u30EB\u30FC\u30D7ID]     \t\u5FC5\u9808(\u30B0\u30EB\u30FC\u30D7\u540D\u3001\u8CA9\u58F2\u5E97ID\u3092\u5165\u529B\u3057\u305F\u5834\u5408\u306F\u4E0D\u8981)\n");
		echo("\t-p=[\u8CA9\u58F2\u5E97\u30B3\u30FC\u30C9]   \t\u7BA1\u7406\u8005\u3068\u3057\u3066\u53D6\u308A\u8FBC\u3080\u5834\u5408\u306F\u4E0D\u8981\n");
		echo("\t-S=[\u8CA9\u58F2\u5E97ID]\n");
		echo("\t--yes            \t\u554F\u3044\u5408\u308F\u305B\u3092\u5168\u3066yes\u3067\u5B9F\u884C\u3057\u307E\u3059\n");
		echo("\t--no            \t\u554F\u3044\u5408\u308F\u305B\u3092\u5168\u3066no\u3067\u5B9F\u884C\u3057\u307E\u3059\n");
		echo("\t--silent            \t\u6A19\u6E96\u51FA\u529B\u3092\u884C\u3044\u307E\u305B\u3093\uFF08--yes\u3068\u7D44\u307F\u5408\u308F\u305B\u3066\u4F7F\u7528\u3001\u6307\u5B9A\u304C\u306A\u3044\u5834\u5408\u306F--no\u3067\u5B9F\u884C\uFF09\n");
		echo("\t--help            \t\u30D8\u30EB\u30D7\u306E\u8868\u793A\uFF08\u3053\u306E\u753B\u9762\uFF09\n");
		echo("\n");
		echo("Example\n");
		echo("   \u7BA1\u7406\u8005\n");
		echo("\t$ " + basename(_SERVER.SCRIPT_NAME) + " -f=example.xls -g=kcs\n");
		echo("\t$ " + basename(_SERVER.SCRIPT_NAME) + " -f=example.xls -G=1\n");
		echo("   \u8CA9\u58F2\u5E97\n");
		echo("\t$ " + basename(_SERVER.SCRIPT_NAME) + " -f=example.xls -g=kcs -p=kcsdemo\n");
		echo("\t$ " + basename(_SERVER.SCRIPT_NAME) + " -f=example.xls -G=1 -p=kcsdemo\n");
		echo("\t$ " + basename(_SERVER.SCRIPT_NAME) + " -f=example.xls -S=16\n");
		echo("   \u305D\u306E\u4ED6\n");
		echo("\t$ " + basename(_SERVER.SCRIPT_NAME) + " -f=example.xls -g=kcs -p=kcsdemo --yes --silent\n");
		echo("\n");
		throw die(0);
	}

	displayStart() {
		if (this.exectype != "silent") {
			echo("\n");
			this.echoLine("\u5B9F\u884C\u5185\u5BB9");
			echo("EXCEL\u30D5\u30A1\u30A4\u30EB: " + this.getImportFileName() + "\n");
			echo("\u30B0\u30EB\u30FC\u30D7: " + array_search(this.getGroupid(), this.H_group) + " (" + this.getGroupid() + ")\n");
			echo("\u53D6\u8FBC\u5148: ");

			if (this.getShopid() == 0) {
				echo("\u7BA1\u7406\u8005\n");
			} else {
				echo(this.H_shop.name + " (" + this.H_shop.postcode + ")\n");
			}

			this.echoLine(undefined, "-");
		}
	}

	echoLine(msg = "", str = "=") {
		if (this.exectype != "silent") {
			if (msg != "") {
				msg = " " + msg + " ";
			}

			var tmp = str_pad(mb_convert_encoding(msg, "SJIS-win"), 60, str, STR_PAD_BOTH) + "\n";
			echo(mb_convert_encoding(tmp, "UTF-8", "SJIS-win"));
		}
	}

	echoListMsg(A_msg: {} | any[]) {
		if (this.exectype != "silent") {
			for (var i = 0; i < A_msg.length; i++) {
				echo(i + 1 + ". " + A_msg[i] + "\n");
			}
		}
	}

	echoSimple(msg = "", lf = true) {
		if (this.exectype != "silent") {
			echo(msg);

			if (lf == true) {
				echo("\n");
			}
		}
	}

	chkConfirm(ret) {
		if (this.yesno == "yes") {
			return true;
		}

		if (this.yesno == "no") {
			return false;
		}

		if (preg_match("/^(y|yes)$/i", ret) == true) {
			return true;
		} else {
			return false;
		}
	}

	getSTDIN(msg) {
		if (this.exectype == "silent") {
			return true;
		}

		if (this.yesno == "yes") {
			echo(msg + ": Y\n");
			return "Y";
		}

		if (this.yesno == "no") {
			echo(msg + ": n\n");
			return "n";
		}

		echo(msg + ": ");
		return fgets(STDIN).trim();
	}

	__destruct() {
		super.__destruct();
	}

};