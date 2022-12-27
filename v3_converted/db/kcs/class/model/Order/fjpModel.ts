require("MtSetting.php");

require("model/ModelBase.php");

//
//__construct
//
//@author igarashi
//@since 2011/06/09
//
//@access public
//@return void
//
//
//getCommFlag
//
//@author igarashi
//@since 2011/06/07
//
//@access public
//@return void
//
//
//getPreviousRecogUser
//
//@author igarashi
//@since 2011/06/08
//
//@access public
//@return void
//
//
//setPreviousRecog
//
//@author igarashi
//@since 2011/06/16
//
//@param mixed $H_order
//@access public
//@return void
//
//
//getUserID
//
//@author igarashi
//@since 2011/06/23
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $H_def
//@access public
//@return void
//
//
//getDefaultFJPExtension
//
//@author igarashi
//@since 2011/06/08
//
//@param mixed $H_def
//@param mixed $H_g_sess
//@param mixed $H_sess
//@access public
//@return void
//
//
//setDefaultFJPExtension
//
//@author igarashi
//@since 2011/06/16
//
//@param mixed $H_def
//@param mixed $H_order
//@access public
//@return void
//
//
//getUser
//
//@author igarashi
//@since 2011/06/09
//
//@param mixed $code
//@access public
//@return void
//
//
//getFjpExtension
//
//@author igarashi
//@since 2011/06/15
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telno
//@access protected
//@return void
//
//
//getOutsourcerInfo
//
//@author igarashi
//@since 2011/05/27
//
//@param mixed $id
//@access public
//@return void
//
//
//excludeElements
//
//@author igarashi
//@since 2011/06/10
//
//@param mixed $H_item
//@access public
//@return void
//
//
//settingSendhow
//
//@author igarashi
//@since 2011/06/20
//
//@param mixed $H_g_sess
//@param mixed $H_item
//@access public
//@return void
//
//
//reverseExtensionCode
//
//@author igarashi
//@since 2011/06/28
//
//@param mixed $code
//@access public
//@return void
//
//
//getPrivateApplyMailSendList
//
//@author igarashi
//@since 2011/07/08
//
//@param mixed $pactid
//@param mixed $postidto
//@param string $language
//@access public
//@return void
//
//
//setSendhow
//
//@author igarashi
//@since 2011/06/20
//
//@param mixed $H_def
//@access public
//@return void
//
//
//getSendhowEdit
//
//@author igarashi
//@since 2011/06/20
//
//@access public
//@return void
//
//
//getSelectExtension
//
//@author igarashi
//@since 2011/06/27
//
//@param mixed $ordertype
//@access public
//@return void
//
//
//getPostData
//
//@author igarashi
//@since 2011/06/16
//
//@param mixed $code
//@access public
//@return void
//
//
//renameTemplateValue
//
//@author igarashi
//@since 2011/06/27
//
//@param mixed $H_temp
//@access public
//@return void
//
//
//setExtensionReserve
//
//@author igarashi
//@since 2011/07/07
//
//@param mixed $H_tel
//@param mixed $H_order
//@access public
//@return void
//
//
//setAuth
//
//@author igarashi
//@since 2011/06/10
//
//@param mixed $auth
//@access public
//@return void
//
//
//checkAuth
//
//@author igarashi
//@since 2011/06/13
//
//@param mixed $fnc
//@access public
//@return void
//
//
//_getSetting
//
//@author igarashi
//@since 2011/06/20
//
//@access protected
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2011/06/09
//
//@access public
//@return void
//
class fjpModel extends ModelBase {
	static FNC_CO = "fnc_fjp_co";
	static FNC_SU = "fnc_fjp_su";
	static FNC_RECOG = "fnc_fjp_recog";
	static FNC_PRIVATE_RECOG = 209;

	constructor(publickey = "/MTOrder", auth) {
		super();
		this._fjpColumns = ["recogcode", "recogname", "pbpostcode_first", "pbpostcode_second", "pbpostname", "cfbpostcode_first", "cfbpostcode_second", "cfbpostname", "ioecode", "coecode", "fjpcommflag", "h_pbpostcode", "h_cfbpostcode", "h_recogcode", "h_recogname", "h_cfbpostcode_h", "h_pbpostcode_h", "h_cfbpostname", "h_pbpostname", "h_recoguserid"];
		this.Auth = {
			co: false,
			su: false,
			recog: false
		};
		this._sendhowedit = false;
		this._pub = publickey;

		if (Array.isArray(auth)) {
			this.setAuth(auth);
		} else if (is_numeric(auth)) {
			require("MtAuthority.php");

			var O_auth = MtAuthority.Singleton(auth);
			this.setAuth(Object.keys(O_auth.H_FuncPact.all));
		}
	}

	getOptionCommFlag() {
		return {
			"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
			auto: "\u81EA\u52D5\u66F4\u65B0\u3059\u308B",
			manual: "\u81EA\u52D5\u66F4\u65B0\u3057\u306A\u3044"
		};
	}

	getPreviousRecog(H_def, H_g_sess, H_sess, H_template) {
		if (!(undefined !== H_sess.SELF.submitName) && !(undefined !== H_sess.SELF.h_recogcode)) {
			if (undefined !== H_g_sess.userid) {
				var sql = "SELECT " + "u.employeecode, u.username, u.userid " + "FROM " + "mt_order_tb o " + "INNER JOIN user_tb u ON o.recoguserid=u.userid " + "WHERE " + "chargerid=" + this.get_DB().dbQuote(H_g_sess.userid, "int", true) + " " + "ORDER BY o.recdate DESC " + "LIMIT 1";
				var user = this.get_DB().queryRow(sql);

				if (Array.isArray(user)) {
					sql = "SELECT COUNT(userid) FROM fnc_relation_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(H_g_sess.pactid, "int", true) + " " + "AND userid=" + this.get_DB().dbQuote(user[2], "int", true) + " " + "AND fncid=" + this.get_DB().dbQuote(fjpModel.FNC_PRIVATE_RECOG, "int", true);

					if (0 < this.get_DB().queryOne(sql)) {
						var recog = user;
					}
				}
			}

			if (H_sess[this._pub].tempid == "") {
				if (Array.isArray(recog)) {
					H_def.recogcode = H_def.h_recogcode = recog[0];
					H_def.recogname = H_def.h_recogname = recog[1];
					H_def.h_recoguserid = recog[2];
				}
			} else {
				if (!H_template.h_recogcode) {
					H_def.recogcode = H_def.h_recogcode = recog[0];
					H_def.h_recoguserid = recog[2];
				} else {
					H_def.h_recoguserid = this.getUser(H_sess.SELF.h_recogcode, H_g_sess.pactid);
				}

				if (!H_template.h_recogname) {
					H_def.recogname = H_def.h_recogname = recog[1];
				}
			}
		} else {
			H_def.recogcode = H_sess.SELF.h_recogcode;
			H_def.recogname = H_sess.SELF.h_recogname;
			H_def.h_recoguserid = this.getUser(H_sess.SELF.h_recogcode, H_g_sess.pactid);
		}
	}

	setPreviousRecog(H_sess, H_def, H_order) {
		if (!(undefined !== H_sess.SELF.submitName)) {
			if (undefined !== H_order.recoguserid) {
				var sql = "SELECT username FROM user_tb WHERE userid=" + this.get_DB().dbQuote(H_order.recoguserid, "int", true);
				H_def.recogcode = H_def.h_recogcode = H_order.recogcode;
				H_def.recogname = H_def.h_recogname = this.get_DB().queryOne(sql);
				H_def.h_recoguserid = H_order.recoguserid;
			}
		} else {
			H_def.recogcode = H_sess.SELF.h_recogcode;
			H_def.recogname = H_sess.SELF.h_recogname;
			H_def.h_recoguserid = this.getUser(H_sess.SELF.h_recogcode, H_order.pactid);
		}
	}

	getClaimViewer(H_def, H_g_sess, H_sess) {
		if (!(undefined !== H_sess.SELF.submitName)) //fjpは常にデフォルトを注文者にするよう変更
			{
				H_def.userid = H_g_sess.userid;
				return H_def.userid;
			} else {
			return H_sess.SELF.userid;
		}
	}

	getDefaultFJPExtension(H_def, H_g_sess, H_sess, H_view, order_category_flag) {
		require("model/PostModel.php");

		require("model/Order/SearchPostModel.php");

		var O_post = new PostModel();
		var O_search = new SearchPostModel();
		var gettelinfo = ["A", "C", "Nmnp", "S"];

		if (!(undefined !== H_sess.SELF.submitName) && !(undefined !== H_sess.SELF.backName)) {
			if (-1 !== gettelinfo.indexOf(H_sess[this._pub].type)) //ioecode, coecode, commflag
				{
					var carid = H_sess[this._pub].carid;

					if ("Nmnp" == H_sess[this._pub].type) {
						carid = H_sess[this._pub].formercarid_0;
					}

					var H_extension = this.getFjpExtension(H_g_sess.pactid, carid, H_sess[this._pub].telinfo.telno0.telno, H_view.H_templatevalue);
					var spcode = O_search.splitCode(H_extension.pbpostcode);

					if (!spcode.split2) {
						spcode.split2 = "000";
					}

					H_def.pbpostname = H_def.h_pbpostname = H_extension.pbpostname;
					H_def.pbpostcode = H_def.h_pbpostcode = spcode.original;
					H_def.pbpostcode_first = H_def.pbpostcode_h = spcode.split1;
					H_def.pbpostcode_second = spcode.split2;
					spcode = O_search.splitCode(H_extension.cfbpostcode);

					if (!spcode.split2) {
						spcode.split2 = "000";
					}

					H_def.cfbpostname = H_def.h_cfbpostname = H_extension.cfbpostname;
					H_def.cfbpostcode = H_def.h_cfbpostcode = spcode.original;
					H_def.cfbpostcode_first = H_def.cfbpostcode_h = spcode.split1;
					H_def.cfbpostcode_second = spcode.split2;
					H_def.ioecode = H_extension.ioecode;
					H_def.coecode = H_extension.coecode;
					H_def.fjpcommflag = H_extension.commflag;

					if (!!H_view.H_templatevalue.ioecode) {
						H_def.ioecode = H_view.H_templatevalue.ioecode;
					}

					if (!!H_view.H_templatevalue.coecode) {
						H_def.coecode = H_view.H_templatevalue.coecode;
					}

					if (!!H_view.H_templatevalue.fjpcommflag) {
						H_def.fjpcommflag = H_view.H_templatevalue.fjpcommflag;
					}

					if (!!H_view.H_templatevalue.pbpostcode_second) {
						H_def.pbpostcode_second = H_def.h_pbpostcode_f = H_view.H_templatevalue.pbpostcode_second;
					}

					if (!!H_view.H_templatevalue.cfbpostcode_second) {
						H_def.cfbpostcode_second = H_def.h_cfbpostcode_f = H_view.H_templatevalue.cfbpostcode_second;
					}
				}

			if ("N" == H_sess[this._pub].type || "Nmnp" == H_sess[this._pub].type && is_null(H_extension)) //購入
				{
					var code = O_post.getPostData(H_view.recogpostid);
					var splitcode = O_search.splitCode(code.userpostid);

					if (!H_view.H_templatevalue.h_pbpostname) {
						H_def.pbpostname = H_def.h_pbpostname = H_view.recogpostname;
					}

					if (!H_view.H_templatevalue.h_pbpostcode) {
						H_def.pbpostcode = H_def.h_pbpostcode = splitcode.original;
					}

					if (!H_view.H_templatevalue.h_pbpostcode_h) {
						H_def.pbpostcode_first = H_def.pbpostcode_h = splitcode.split1;
					}

					if (!H_view.H_templatevalue.h_pbpostcode_f) {
						if (!!H_sess.SELF.pbpostcode_second) {
							splitcode.split2 = H_sess.SELF.pbpostcode_second;
						} else if (!!H_view.H_templatevalue.pbpostcode_second) {
							splitcode.split2 = H_view.H_templatevalue.pbpostcode_second;
						} else if (!spcode.split2) {
							splitcode.split2 = "000";
						}

						H_def.pbpostcode_second = H_def.h_pbpostcode_f = splitcode.split2;
					}

					if (!H_view.H_templatevalue.h_cfbpostname) {
						H_def.cfbpostname = H_def.h_cfbpostname = H_view.recogpostname;
					}

					if (!H_view.H_templatevalue.h_cfbpostcode) {
						H_def.cfbpostcode = H_def.h_cfbpostcode = splitcode.original;
					}

					if (!H_view.H_templatevalue.h_cfbpostcode_h) {
						H_def.cfbpostcode_first = H_def.cfbpostcode_h = splitcode.split1;
					}

					if (!H_view.H_templatevalue.h_cfbpostcode_f) {
						if (!!H_sess.SELF.cfbpostcode_second) {
							splitcode.split2 = H_sess.SELF.cfbpostcode_second;
						} else if (!!H_view.H_templatevalue.cfbpostcode_second) {
							splitcode.split2 = H_view.H_templatevalue.cfbpostcode_second;
						} else if (!spcode.split2) {
							splitcode.split2 = "000";
						}

						H_def.cfbpostcode_second = H_def.h_cfbpostcode_f = splitcode.split2;
					}
				}

			if (-1 !== ["N", "A", "C", "Nmnp", "S"].indexOf(H_sess[this._pub].type)) //顧客用部署IDと部署名称の取得
				//ユーザー部署IDの分割を行う
				//splitcodeのsplit1は先頭から4文字、split2は5文字目以降が入っているよ
				//default値の設定
				//購入負担元職制の左の値
				//負担元職制の左側の値
				{
					var postdata = O_post.getPostData(H_g_sess.postid);
					splitcode = O_search.splitCode(postdata.userpostid);
					var postname = postdata.postname;
					var first = splitcode.split1;

					if (!H_view.H_templatevalue.h_pbpostcode_h) //雛形の値がなければ、申請者の部署で上書きする
						{
							H_def.pbpostcode_first = H_def.pbpostcode_h = first;
						}

					H_def.h_pbpostcode_h = H_def.pbpostcode_first;

					if (!H_view.H_templatevalue.h_pbpostcode) {
						H_def.h_pbpostcode = first;
					}

					if (!H_view.H_templatevalue.h_pbpostcode_f) //初期値はブランク
						{
							var value = "";

							if (!!H_sess.SELF.pbpostcode_second) //SELFの値があるならそれを使う
								{
									value = H_sess.SELF.pbpostcode_second;
								} else if (!!H_view.H_templatevalue.pbpostcode_second) //雛形の値があるならそれを使う
								{
									value = H_view.H_templatevalue.pbpostcode_second;
								}

							H_def.pbpostcode_second = H_def.h_pbpostcode_f = value;
						}

					if (!H_view.H_templatevalue.h_pbpostname) //雛形の値がなければ、部署名をいれる
						{
							H_def.pbpostname = H_def.h_pbpostname = postname;
						}
				}
		} else {
			splitcode = O_search.splitCode(H_sess.SELF.h_pbpostcode);
			H_def.pbpostname = H_sess.SELF.h_pbpostname;
			H_def.pbpostcode_first = splitcode.split1;
			H_def.pbpostcode_second = H_sess.SELF.pbpostcode_second;
			splitcode = O_search.splitCode(H_sess.SELF.h_cfbpostcode);
			H_def.cfbpostname = H_sess.SELF.h_cfbpostname;
			H_def.cfbpostcode = splitcode.original;
			H_def.cfbpostcode_first = splitcode.split1;
			H_def.cfbpostcode_second = H_sess.SELF.cfbpostcode_second;
			H_def.ioecode = H_sess.SELF.ioecode;
			H_def.coecode = H_sess.SELF.coecode;
			H_def.fjpcommflag = H_sess.SELF.commflag;
		}
	}

	setDefaultFJPExtension(H_sess, H_def, H_order) {
		require("model/Order/SearchPostModel.php");

		var O_search = new SearchPostModel();

		if (!(undefined !== H_sess.SELF.submitName)) {
			if (undefined !== H_order.pbpostcode) {
				var code = this.getPostData(H_order.pactid, H_order.pbpostcode_first);
				var splitcode = O_search.splitCode(code.userpostid);
				H_def.pbpostname = H_def.h_pbpostname = code.postname;
				H_def.pbpostcode = H_def.h_pbpostcode = splitcode.original;
				H_def.pbpostcode_first = H_def.pbpostcode_h = splitcode.split1;

				if (!!splitcode.split2) {
					H_def.pbpostcode_second = H_def.pbpostcode_f = splitcode.split2;
				} else {
					if (undefined !== H_order.pbpostcode_second && !!H_order.pbpostcode_second) {
						H_def.pbpostcode_second = H_order.pbpostcode_second;
					} else {
						H_def.pbpostcode_second = H_def.pbpostcode_f = "000";
					}
				}
			}

			if (undefined !== H_order.cfbpostcode) {
				code = this.getPostData(H_order.pactid, H_order.cfbpostcode_first);
				splitcode = O_search.splitCode(code.userpostid);
				H_def.cfbpostname = H_def.h_cfbpostname = code.postname;
				H_def.cfbpostcode = H_def.h_cfbpostcode = splitcode.original;
				H_def.cfbpostcode_first = H_def.cfbpostcode_h = splitcode.split1;

				if (!!splitcode.split2) {
					H_def.cfbpostcode_second = H_def.cfbpostcode_f = splitcode.split2;
				} else {
					if (undefined !== H_order.cfbpostcode_second && !!H_order.cfbpostcode_second) {
						H_def.cfbpostcode_second = H_order.cfbpostcode_second;
					} else {
						H_def.cfbpostcode_second = H_def.cfbpostcode_f = "000";
					}
				}
			}

			H_def.fjpcommflag = H_order.commflag;
		} else {
			splitcode = O_search.splitCode(H_sess.SELF.h_pbpostcode);
			H_def.pbpostname = H_sess.SELF.h_pbpostname;
			H_def.pbpostcode = splitcode.original;
			H_def.pbpostcode_first = splitcode.split1;
			H_def.pbpostcode_second = splitcode.split2;
			splitcode = O_search.splitCode(H_sess.SELF.h_cfbpostcode);
			H_def.cfbpostname = H_sess.SELF.h_cfbpostname;
			H_def.cfbpostcode = splitcode.original;
			H_def.cfbpostcode_first = splitcode.split1;
			H_def.cfbpostcode_second = splitcode.split2;
		}
	}

	getUser(code, pactid) {
		if (!code || !pactid) {
			return false;
		}

		var sql = "SELECT " + "userid " + "FROM " + "user_tb " + "WHERE " + "pactid= " + this.get_DB().dbQuote(pactid, "int", true) + " AND employeecode=" + this.get_DB().dbQuote(code, "text", true);
		return this.get_DB().queryOne(sql);
	}

	getFjpExtension(pactid, carid, telno, H_template) //部署名がとれなければxxpostcodeも空にする(存在しないということ)
	{
		var sql = "SELECT " + "t.recogcode, t.pbpostcode, t.cfbpostcode, t.ioecode, t.coecode, t.commflag, " + "u.username, " + "p1.postname as pbpostname, p2.postname as cfbpostname " + "FROM " + "tel_tb t " + "LEFT JOIN user_tb u ON t.recogcode=u.employeecode " + "LEFT JOIN post_tb p1 ON t.pbpostcode_first=p1.userpostid " + "LEFT JOIN post_tb p2 ON t.cfbpostcode_first=p2.userpostid " + "WHERE " + "t.pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND t.carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND t.telno=" + this.get_DB().dbQuote(telno, "text", true);
		var result = this.get_DB().queryRowHash(sql);

		if (is_null(result.pbpostname)) {
			result.pbpostcode = undefined;
		}

		if (is_null(result.cfbpostname)) {
			result.cfbpostcode = undefined;
		}

		if (!!H_template.h_pbpostcode) {
			result.pbpostcode = H_template.h_pbpostcode;
			result.pbpostname = H_template.pbpostname;
		}

		if (!!H_template.h_cfbpostcode) {
			result.cfbpostcode = H_template.h_cfbpostcode;
			result.cfbpostname = H_template.cfbpostname;
		}

		if (!!H_template.ioecode) {
			result.ioecode = H_template.ioecode;
		} else if (undefined !== H_template.h_ioecode && !!H_template.h_ioecode) {
			result.ioecode = H_template.h_ioecode;
		}

		if (!!H_template.coecode) {
			result.coecode = H_template.coecode;
		} else if (undefined !== H_template.h_coecode && !!H_template.h_coecode) {
			result.coecode = H_template.h_coecode;
		}

		if (!!H_template.commflag) {
			result.commflag = H_template.commflag;
		} else if (undefined !== H_template.h_commflag && !!H_template.h_commflag) {
			result.commflag = H_template.h_commflag;
		}

		return result;
	}

	setOutsourcerInfo(form, id, cnt, target) {
		if (is_numeric(id)) {
			var sql = "SELECT " + "username, employeecode, mail " + "FROM " + "user_tb " + "WHERE " + "userid=" + this.getDB().dbQuote(id, "int", true);
			var OutsourcerInfo = this.getDB().queryRowHash(sql);

			if (!Array.isArray(target)) {
				for (var i = 0; i < cnt; i++) {
					form.O_OrderFormUtil.setDefaultsWrapper({
						["telusername_" + i]: OutsourcerInfo.username,
						["employeecode_" + i]: OutsourcerInfo.employeecode,
						["mail_" + i]: OutsourcerInfo.mail
					});
				}
			} else {
				for (var i of Object.values(target)) {
					form.O_OrderFormUtil.setDefaultsWrapper({
						["telusername_" + i]: OutsourcerInfo.username,
						["employeecode_" + i]: OutsourcerInfo.employeecode,
						["mail_" + i]: OutsourcerInfo.mail
					});
				}
			}
		}

		return false;
	}

	excludeElements(H_item, target = "inputname") {
		if (!this.Auth.co) {
			for (var key in H_item) {
				var element = H_item[key];

				if (!(-1 !== this._fjpColumns.indexOf(element[target]))) {
					result.push(element);
				}
			}

			return result;
		}

		return H_item;
	}

	settingSendhow(H_g_sess, H_item) {
		if (file_exists("/kcs/conf_sync/order_sendhow.ini")) {
			var O_Set = this._getSetting();

			O_Set.loadConfig("order_sendhow");
			var ininame = "A_delivonly_" + H_g_sess.groupid;

			if (O_Set.existsKey(ininame)) {
				if (-1 !== this.O_Set[ininame].indexOf(H_g_sess.pactid)) {
					this._sendhowedit = true;

					for (var key in H_item) {
						var element = H_item[key];

						if ("sendhow" == element.inputname) {
							if ("\u304A\u5C4A\u3051" == element.itemname || "\u6765\u5E97" == element.itemname) //unset($H_item[$key]);
								{
									H_item[key] = Array();
								}
						}
					}
				}
			}
		}

		return H_item;
	}

	reverseExtensionCode(code) {
		var result = Array();

		if (undefined !== code.recogcode) {
			var sql = "SELECT username FROM user_tb WHERE employeecode=" + this.get_DB().dbQuote(code.recogcode, "text", false);

			if (undefined !== code.pactid && is_numeric(code.pactid)) {
				sql += "AND pactid=" + this.get_DB().dbQuote(code.pactid, "int", true);
			}

			result.recogname = this.get_DB().queryOne(sql);
		}

		if (undefined !== code.pbpostcode_first) {
			sql = "SELECT postname FROM post_tb WHERE userpostid=" + this.get_DB().dbQuote(code.pbpostcode_first, "text", false);

			if (undefined !== code.pactid && is_numeric(code.pactid)) {
				sql += "AND pactid=" + this.get_DB().dbQuote(code.pactid, "int", true);
			}

			result.pbpostname = this.get_DB().queryOne(sql);
		}

		if (undefined !== code.cfbpostcode_first) {
			sql = "SELECT postname FROM post_tb WHERE userpostid=" + this.get_DB().dbQuote(code.cfbpostcode_first, "text", false);

			if (undefined !== code.pactid && is_numeric(code.pactid)) {
				sql += "AND pactid=" + this.get_DB().dbQuote(code.pactid, "int", true);
			}

			result.cfbpostname = this.get_DB().queryOne(sql);
		}

		return result;
	}

	getPrivateApplyMailSendList(orderid) //メール送信用(tmp)
	//配列の重複を削除する
	//メール送信用
	{
		if (!orderid) {
			var A_mail_list = Array();
			return A_mail_list;
		}

		var sql = "SELECT " + "usr.username AS to_name, usr.mail AS to " + "FROM " + "user_tb usr " + "WHERE " + "usr.userid=(SELECT recoguserid FROM mt_order_tb WHERE orderid=" + orderid + ") " + "AND usr.mail != '' AND usr.mail IS NOT NULL " + "AND usr.acceptmail4 = 1 " + "GROUP BY " + "usr.username, usr.mail";
		var H_get_mail = this.get_DB().queryHash(sql);
		var A_mail_list_tmp = Array();

		for (var i = 0; i < H_get_mail.length; i++) {
			var H_mailto = {
				to_name: strip_tags(H_get_mail[i].to_name),
				to: H_get_mail[i].to
			};
			A_mail_list_tmp.push(serialize(H_mailto));
		}

		A_mail_list = Array();
		A_mail_list_tmp = array_unique(A_mail_list_tmp);

		for (var key in A_mail_list_tmp) {
			var val = A_mail_list_tmp[key];
			A_mail_list.push(unserialize(val));
		}

		return A_mail_list;
	}

	setSendhow(H_def) {
		if (this._sendhowedit) {
			H_def.sendhow = "\u5B85\u914D\u4FBF";
		}
	}

	getSendhowEdit() {
		return this._sendhowedit;
	}

	getSelectExtension(ordertype) {
		var result = "all";

		if ("P" == ordertype || "D" == ordertype || "T" == ordertype || "M" == ordertype) {
			result = "recog";
		}

		return result;
	}

	getPostData(pactid, code) {
		var sql = "SELECT postid FROM post_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " " + " AND userpostid=" + this.get_DB().dbQuote(code, "text", true);
		var postid = this.get_DB().queryOne(sql);

		if (is_numeric(postid)) {
			require("model/PostModel.php");

			var O_post = new PostModel();
			return O_post.getPostData(postid);
		}

		return false;
	}

	renameTemplateValue(H_temp) {
		if (undefined !== H_temp.ioecode) {
			H_temp.h_ioecode = H_temp.ioecode;
		}

		if (undefined !== H_temp.coecode) {
			H_temp.h_coecode = H_temp.coecode;
		}

		if (undefined !== H_temp.fjpcommflag) {
			H_temp.h_commflag = H_temp.fjpcommflag;
		}
	}

	setExtensionReserve(H_tel, H_order) {
		var cols = ["recogcode", "pbpostcode", "pbpostcode_first", "pbpostcode_second", "fcfbpostcode", "cfbpostcode_first", "cfbpostcode_second", "ioecode", "coecode"];
		var extension = Array();

		for (var col of Object.values(cols)) {
			extension[col] = H_order[col];

			if (!extension[col]) {
				extension[col] = H_tel[col];
			}
		}

		return extension;
	}

	setAuth(auth) {
		if (-1 !== auth.indexOf(fjpModel.FNC_CO)) {
			this.Auth.co = true;
		}

		if (-1 !== auth.indexOf(fjpModel.FNC_SU)) {
			this.Auth.su = true;
		}

		if (-1 !== auth.indexOf(fjpModel.FNC_RECOG)) {
			this.Auth.recog = true;
		}
	}

	checkAuth(fnc) {
		return this.Auth[fnc];
	}

	_getSetting() {
		if (!this.O_Set instanceof MtSetting) {
			this.O_Set = MtSetting.singleton();
		}

		return this.O_Set;
	}

	__destruct() {
		super.__destruct();
	}

};