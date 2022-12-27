//
//電話新規登録Model
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/04/03
//@uses ManagementTelModel
//@uses AssetsModModel
//@uses ExtensionTelModel
//@uses ExtensionSettingTbModel
//
//
//
//電話新規登録Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/04/03
//@uses ManagementTelModel
//

require("model/Management/Tel/ManagementTelModel.php");

require("model/Management/Assets/ManagementAssetsModel.php");

require("model/ExtensionTelModel.php");

require("model/ExtensionSettingTbModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/03
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param MtOutput $O_manage
//@access public
//@return void
//
//
//既に登録済みか調べる
//
//@author houshiyama
//@since 2008/04/03
//
//@param mixed $H_post
//@param mixed $O_form
//@access public
//@return void
//
//
//データ、権限などをチェック
//
//@author houshiyama
//@since 2008/08/01
//
//@param mixed $H_view
//@param mixed $H_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/03
//
//@access public
//@return void
//
class TelAddModel extends ManagementTelModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	checkInputError(H_post, O_form) {
		var O_assets = new ManagementAssetsModel(this.O_db, this.H_G_Sess, this.O_Manage);
		this.setTableName(this.YM);
		O_assets.setTableName(this.YM);

		if (undefined !== H_post.addsubmit === true) //重複チェック
			//関連電話の存在チェック
			{
				if (undefined !== H_post.telno_view == true && "" != H_post.telno_view && undefined !== H_post.flag == true) {
					if (this.checkTelExist(this.O_Manage.convertNoView(H_post.telno_view), H_post.carid) == true) {
						if (this.H_G_Sess.language == "ENG") {
							O_form.setElementErrorWrapper("telno_view", "Phone number has already been registered.");
						} else {
							O_form.setElementErrorWrapper("telno_view", "\u767B\u9332\u6E08\u307F\u306E\u96FB\u8A71\u756A\u53F7\u3067\u3059");
						}
					}
				}

				if (undefined !== H_post.extensionno && H_post.extensionno != "") {
					var O_setting = new ExtensionSettingTbModel();
					var H_setting = O_setting.getPactSetting(this.H_G_Sess.pactid);

					if (!H_setting) {
						if (this.H_G_Sess.language == "ENG") {
							O_form.setElementErrorWrapper("extensionno", "\u4F7F\u7528\u3067\u304D\u308B\u5185\u7DDA\u756A\u53F7\u306F\u3042\u308A\u307E\u305B\u3093");
						} else {
							O_form.setElementErrorWrapper("extensionno", "\u4F7F\u7528\u3067\u304D\u308B\u5185\u7DDA\u756A\u53F7\u306F\u3042\u308A\u307E\u305B\u3093");
						}
					} else {
						var H_cur = reset(H_setting);

						for (var carid in H_setting) {
							var H_car = H_setting[carid];

							if (carid != H_post.carid) {
								if (H_post.extensionno >= H_car.min_no && H_post.extensionno <= H_car.max_no) {
									if (this.H_G_Sess.language == "ENG") {
										O_form.setElementErrorWrapper("extensionno", "\u4ED6\u306E\u96FB\u8A71\u4F1A\u793E\u306B\u8A2D\u5B9A\u3055\u308C\u305F\u7BC4\u56F2\u5185\u306E\u5185\u7DDA\u756A\u53F7\u3067\u3059");
									} else {
										O_form.setElementErrorWrapper("extensionno", "\u4ED6\u306E\u96FB\u8A71\u4F1A\u793E\u306B\u8A2D\u5B9A\u3055\u308C\u305F\u7BC4\u56F2\u5185\u306E\u5185\u7DDA\u756A\u53F7\u3067\u3059");
									}

									break;
								}
							}
						}

						if (!!H_setting[H_post.carid]) {
							if (H_post.extensionno.length > H_cur.digit_number) {
								if (this.H_G_Sess.language == "ENG") {
									O_form.setElementErrorWrapper("extensionno", "\u5165\u529B\u3055\u308C\u305F\u5185\u7DDA\u756A\u53F7\u306E\u6841\u6570\u304C\u8A2D\u5B9A\u3055\u308C\u305F\u7BC4\u56F2\u3092\u8D8A\u3048\u3066\u307E\u3059");
								} else {
									O_form.setElementErrorWrapper("extensionno", "\u5165\u529B\u3055\u308C\u305F\u5185\u7DDA\u756A\u53F7\u306E\u6841\u6570\u304C\u8A2D\u5B9A\u3055\u308C\u305F\u7BC4\u56F2\u3092\u8D8A\u3048\u3066\u307E\u3059");
								}
							} else if (H_post.extensionno < H_setting[H_post.carid].min_no || H_post.extensionno > H_setting[H_post.carid].max_no) {
								if (this.H_G_Sess.language == "ENG") {
									O_form.setElementErrorWrapper("extensionno", "\u5165\u529B\u3055\u308C\u305F\u5185\u7DDA\u756A\u53F7\u304C\u8A2D\u5B9A\u3055\u308C\u305F\u7BC4\u56F2\u5185\u3067\u306F\u3042\u308A\u307E\u305B\u3093");
								} else {
									O_form.setElementErrorWrapper("extensionno", "\u5165\u529B\u3055\u308C\u305F\u5185\u7DDA\u756A\u53F7\u304C\u8A2D\u5B9A\u3055\u308C\u305F\u7BC4\u56F2\u5185\u3067\u306F\u3042\u308A\u307E\u305B\u3093");
								}
							}
						}
					}

					var O_extension = new ExtensionTelModel();
					O_extension.setTableNo(this.H_Tb.tableno);

					if (O_extension.checkExtensionNoExists(this.H_G_Sess.pactid, H_post.telno, H_post.carid, H_post.extensionno)) {
						if (this.H_G_Sess.language == "ENG") {
							O_form.setElementErrorWrapper("extensionno", "Extension number has already been registered.");
						} else {
							O_form.setElementErrorWrapper("extensionno", "\u767B\u9332\u6E08\u307F\u306E\u5185\u7DDA\u756A\u53F7\u3067\u3059");
						}
					}

					if ("" != H_post.contractdate.Y + H_post.contractdate.m + H_post.contractdate.d) {
						var firstdate = date("Ymd", mktime(0, 0, 0, date("m"), 1, date("Y")));
						var contractdate = date("Ymd", mktime(0, 0, 0, H_post.contractdate.m, H_post.contractdate.d, H_post.contractdate.Y));

						if (this.O_Set.manage_clamp_date > this.A_Time[2] && contractdate != "" && contractdate < firstdate) {
							O_extension.setTableNo(this.H_Tb.pretableno);

							if (O_extension.checkExtensionNoExists(this.H_G_Sess.pactid, H_post.telno, H_post.carid, H_post.extensionno)) {
								if (this.H_G_Sess.language == "ENG") {
									O_form.setElementErrorWrapper("extensionno", "Extension number has already been registered.(previous month's data)");
								} else {
									O_form.setElementErrorWrapper("extensionno", "\u767B\u9332\u6E08\u307F\u306E\u5185\u7DDA\u756A\u53F7\u3067\u3059\uFF08\u524D\u6708\uFF09");
								}
							}
						}
					}
				}

				for (var cnt = 0; cnt < H_post.asscnt; cnt++) //端末情報取得利用
				{
					if (undefined !== H_post["get_flg_" + cnt] == true && H_post["get_flg_" + cnt] == 1) {
						var type = "mod";
					} else {
						type = "add";
					}

					if (undefined !== H_post["assetsno_" + cnt] == true && "" != H_post["assetsno_" + cnt] && "0" == H_post["get_flg_" + cnt]) {
						if (O_assets.checkAssetsNoExist(H_post["assetsno_" + cnt], type) == true) {
							if (this.H_G_Sess.language == "ENG") {
								O_form.setElementErrorWrapper("assetsno_" + cnt, "Management No. has already been registered.");
							} else {
								O_form.setElementErrorWrapper("assetsno_" + cnt, "\u767B\u9332\u6E08\u307F\u306E\u7BA1\u7406\u756A\u53F7\u3067\u3059");
							}
						}
					}

					if ("" != H_post.contractdate.Y + H_post.contractdate.m + H_post.contractdate.d) {
						firstdate = date("Ymd", mktime(0, 0, 0, date("m"), 1, date("Y")));
						contractdate = date("Ymd", mktime(0, 0, 0, H_post.contractdate.m, H_post.contractdate.d, H_post.contractdate.Y));

						if (this.O_Set.manage_clamp_date > this.A_Time[2] && contractdate != "" && contractdate < firstdate) {
							if (O_assets.checkAssetsNoExist(H_post["assetsno_" + cnt], type, true) == true) {
								if (this.H_G_Sess.language == "ENG") {
									O_form.setElementErrorWrapper("assetsno_" + cnt, "Management No. has already been registered.(previous month's data)");
								} else {
									O_form.setElementErrorWrapper("assetsno_" + cnt, "\u767B\u9332\u6E08\u307F\u306E\u7BA1\u7406\u756A\u53F7\u3067\u3059\uFF08\u524D\u6708\uFF09");
								}
							}
						}
					}
				}

				if (undefined !== H_post.rel_telno_view === true && "" != H_post.rel_telno_view && undefined !== H_post.flag == true) //関連電話の部署
					{
						if (this.checkTelExist(this.O_Manage.convertNoView(H_post.rel_telno_view), H_post.rel_carid) == false) {
							if (this.H_G_Sess.language == "ENG") {
								O_form.setElementErrorWrapper("rel_telno_view", "Phone number does not exist.");
							} else {
								O_form.setElementErrorWrapper("rel_telno_view", "\u5B58\u5728\u3057\u306A\u3044\u96FB\u8A71\u756A\u53F7\u3067\u3059");
							}
						}

						if (H_post.rel_telno_view == H_post.telno_view && H_post.rel_carid == H_post.carid) {
							if (this.H_G_Sess.language == "ENG") {
								O_form.setElementErrorWrapper("rel_telno_view", "Phone number is the same as the one you are trying to register.");
							} else {
								O_form.setElementErrorWrapper("rel_telno_view", "\u767B\u9332\u3057\u3088\u3046\u3068\u3057\u3066\u3044\u308B\u96FB\u8A71\u756A\u53F7\u3068\u540C\u3058\u3067\u3059");
							}
						}

						var A_postid = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.tableno);
						var rel_postid = this.get_DB().queryOne("select postid from " + this.H_Tb.tel_tb + " where " + this.makeCommonTelWhere(this.O_Manage.convertNoView(H_post.rel_telno_view), H_post.rel_carid));

						if (-1 !== A_postid.indexOf(rel_postid) == false) {
							if (this.H_G_Sess.language == "ENG") {
								O_form.setElementErrorWrapper("rel_telno_view", "Unauthorized phone number");
							} else {
								O_form.setElementErrorWrapper("rel_telno_view", "\u6A29\u9650\u4E0B\u306B\u306A\u3044\u96FB\u8A71\u756A\u53F7\u3067\u3059");
							}
						}
					}
			}

		this.checkAddAuth(H_post);
	}

	checkDataAuth(H_view: {} | any[], H_sess: {} | any[], H_g_sess: {} | any[]) //名前が長いので
	//契約日チェック
	{
		var H_post = H_sess.SELF.post;

		if ("" != H_post.contractdate.Y + H_post.contractdate.m + H_post.contractdate.d) {
			var firstdate = date("Ymd", mktime(0, 0, 0, date("m"), 1, date("Y")));
			var contractdate = date("Ymd", mktime(0, 0, 0, H_post.contractdate.m, H_post.contractdate.d, H_post.contractdate.Y));

			if (this.O_Set.manage_clamp_date > this.A_Time[2] && contractdate != "" && contractdate < firstdate) //前月に存在しない部署
				{
					var sql = "select count(postid) from " + this.H_Tb.pre_post_tb + " where " + " pactid = " + this.getDB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and " + " postid = " + this.getDB().dbQuote(H_post.recogpostid, "integer", true);
					var cnt = this.getDB().queryOne(sql);

					if (cnt == 0) {
						if (this.H_G_Sess.language == "ENG") {
							H_view.message = "Date of the last month or the month before was specified for the contract date.  As the department did not exist in the previous month, billing will be started from the next month.";
						} else {
							H_view.message = "\u5951\u7D04\u65E5\u304C\u5148\u6708\u4EE5\u524D\u306E\u65E5\u4ED8\u304C\u6307\u5B9A\u3055\u308C\u307E\u3057\u305F\u304C\u3001\u96FB\u8A71\u306E\u6240\u5C5E\u90E8\u7F72\u304C\u5148\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u305F\u3081\u3001\u6765\u6708\u304B\u3089\u306E\u8ACB\u6C42\u5BFE\u8C61\u306B\u306A\u308A\u307E\u3059\u3002";
						}
					} else //前月の部署一覧取得
						{
							var A_post = this.getPostidList(H_sess[TelAddModel.PUB].current_postid, 1, this.H_Tb.pretableno);

							if (-1 !== A_post.indexOf(H_post.recogpostid) == false) {
								if (this.H_G_Sess.language == "ENG") {
									H_view.O_AddFormUtil.setElementErrorWrapper("contractdate", "Not authorized for the last month's data of the registered department.  Change the contract date to a date in this month or later.");
								} else {
									H_view.O_AddFormUtil.setElementErrorWrapper("contractdate", "\u767B\u9332\u90E8\u7F72\u3078\u306E\u5148\u6708\u5206\u306E\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u5951\u7D04\u65E5\u3092\u4ECA\u6708\u4EE5\u964D\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
								}
							} else {
								if (this.H_G_Sess.language == "ENG") {
									H_view.message = "Because date of the last month or the month before was specified for the contract date, this phone number will be included in this month's bill.";
								} else {
									H_view.message = "\u5951\u7D04\u65E5\u306B\u5148\u6708\u4EE5\u524D\u306E\u65E5\u4ED8\u304C\u6307\u5B9A\u3055\u308C\u305F\u306E\u3067\u3001\u3053\u306E\u96FB\u8A71\u756A\u53F7\u306F\u4ECA\u6708\u5206\u306E\u8ACB\u6C42\u5BFE\u8C61\u306B\u306A\u308A\u307E\u3059\u3002";
								}
							}
						}
				}
		}
	}

	__destruct() {
		super.__destruct();
	}

};