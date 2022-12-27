//
//電話変更用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/05/14
//@uses ManagementTelModel
//@uses AssetsModModel
//@uses ExtensionTelModel
//@uses ExtensionSettingTbModel
//
//
//
//電話変更用モデル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/05/14
//@uses ManagementTelModel
//

require("model/Management/Tel/ManagementTelModel.php");

require("model/Management/Assets/AssetsModModel.php");

require("model/ExtensionTelModel.php");

require("model/ExtensionSettingTbModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/14
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param MtOutput $O_manage
//@access public
//@return void
//
//
//指定された電話番号の電話情報を取得（最初のアクセス時） <br>
//
//テーブル名の決定 <br>
//指定された電話番号の電話情報を取得 <br>
//前月分の該当データのシステムIDを取得（当月変更時のみ） <br>
//指定された管理番号の端末情報を取得 <br>
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//更新文を作成する
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $H_sess
//@param boolean $pre
//@access public
//@return string
//
//
//管理記録用insert文作成
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_post
//@access public
//@return string
//
//
//DBが必要なエラーチェック <br>
//既に登録済みかチェック（キー変更時） <br>
//前月に存在するかチェック（前月も変更時） <br>
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $H_sess
//@param mixed $O_form
//@access public
//@return void
//
//
//指定した電話を削除（変更画面専用）<br>
//
//キー変更時に使用されるので元のキーを指定<br>
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $H_get
//@access protected
//@return void
//
//
//checkAssInput
//
//@author houshiyama
//@since 2008/07/30
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/14
//
//@access public
//@return void
//
class TelModModel extends ManagementTelModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getManageInfo(H_sess: {} | any[]) //テーブル名の決定
	//データ取得
	//対象が無ければエラー
	//postのパラメータあり
	//ajax用のhidden要素に値を入れる
	//初期値作成
	//部署ID設定
	//端末数を持つ
	//端末管理権限在りのときは端末フォーム追加（新規端末登録用）
	//関連電話取得
	//tablenoもviewに渡す
	{
		this.setTableName(H_sess[TelModModel.PUB].cym);
		var H_res = this.get_db().queryHash(this.makeTelSelectOneSQL(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, O_assets));

		if (!H_res) {
			this.errorOut(19, "\u51E6\u7406\u5BFE\u8C61\u304C\u7121\u3044(" + H_sess.SELF.get.manageno + ")", false, "./menu.php");
			throw die();
		}

		var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, H_sess[TelModModel.PUB].current_postid, this.H_Tb.tableno);

		if (-1 !== A_post.indexOf(H_res[0].postid) === false) {
			this.errorOut(19, "\u51E6\u7406\u5BFE\u8C61\u304C\u914D\u4E0B\u306B\u7121\u3044", false, "./menu.php");
			throw die();
		}

		var H_data = this.putOneTelData(H_res);
		var postflg = false;
		{
			let _tmp_0 = H_sess.SELF.post;

			for (var key in _tmp_0) {
				var val = _tmp_0[key];

				if (preg_match("/main_flg/", key)) {
					postflg = true;
				}
			}
		}

		for (var key in H_data) {
			var val = H_data[key];

			if (preg_match("/id$/", key) == true) {
				var ajkey = key.replace(/id$/g, "aj");
				H_data[ajkey] = val;
			}

			if ("kousiptn" == key) {
				H_data.kousiptnid = val;
				H_data.kousiptnaj = val;
			}

			if ("kousiflg" == key && "0" != val && !val) {
				H_data.kousiflg = "2";
			}

			if ("discounts" == key && val != "") {
				H_data.discountid = unserialize(val);
				H_data.discountaj = this.O_Manage.convertCheckBoxStr(H_data.discountid);
			}

			if ("options" == key && val != "") {
				H_data.opid = unserialize(val);
				H_data.opaj = this.O_Manage.convertCheckBoxStr(H_data.opid);
			}

			if ("webreliefservice" == key && !!val) {
				H_data.webrelief = val;
			}

			if (preg_match("/main_flg/", key) && true == postflg) {
				delete H_data[key];
			}
		}

		H_sess.SELF.post = array_merge(H_data, H_sess.SELF.post);
		H_sess.SELF.post.recogpostid = H_data.postid;

		if (!(undefined !== H_sess.SELF.post.asscnt)) {
			H_sess.SELF.post.asscnt = H_res.length;
		}

		if (false == postflg && H_res.length == 1) {
			H_sess.SELF.post.main_flg_0 = 0;

			if (this.checkAssInput(H_sess.SELF.post) === false) {
				H_sess.SELF.post.asscnt = 0;
			}
		} else {
			for (var cnt = 0; cnt < H_res.length; cnt++) {
				if (H_sess.SELF.post["main_flg_" + cnt] === true) {}
			}
		}

		if (false == postflg && -1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_co") == true && -1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_us") == true) {
			H_sess.SELF.post.asscnt++;
		}

		if (0 === H_sess.SELF.post.asscnt) {
			H_sess.SELF.post.asscnt++;
		}

		H_sess.SELF.pre_extensionno = H_data.extensionno;
		var A_reltel = this.get_DB().queryHash(this.makeRelTelListSQL(H_sess.SELF.get.manageno, H_sess.SELF.get.coid));
		A_post = Array();
		A_reltel = this.makeRelTelDataArray(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, A_reltel);
		H_sess.SELF.rel_tel = A_reltel;
		H_sess.SELF.tableno = this.H_Tb.tableno;
	}

	makeModManageSQL(H_sess, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_tb;
		} else {
			tb = this.H_Tb.tel_tb;
		}

		var sql = this.makeUpdateTelSQL(H_sess.SELF, tb);
		return sql;
	}

	makeModLogSQL(H_post: {} | any[], cym) {
		if ("" == H_post.recogpostname) {
			H_post.recogpostname = this.getPostName(H_post.recogpostid);
		}

		var str = this.makePastLogStr(cym);
		var A_val = [TelModModel.TELMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, this.O_Manage.convertNoView(H_post.telno_view), H_post.telno_view, H_post.carid, "\u96FB\u8A71\u5909\u66F4" + str, "Change phone" + str, H_post.recogpostid, "", H_post.recogpostname, "", this.H_G_Sess.joker, "\u5909\u66F4", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	checkInputError(H_sess, O_form, chgflg) //端末用クラスオブジェクトの生成
	//名前が長いので・・・
	{
		var O_assets = new AssetsModModel(this.O_db, this.H_G_Sess, this.O_Manage);
		this.setTableName(H_sess[TelModModel.PUB].cym);
		O_assets.setTableName(H_sess[TelModModel.PUB].cym);
		var H_post = H_sess.SELF.post;
		var H_get = H_sess.SELF.get;

		if (undefined !== H_post.modsubmit === true) //既に登録済みかチェック（キー変更時）
			//入力値をループ（管理番号を探す）
			//予約の重複チェック
			{
				if (chgflg == true) {
					if (this.checkTelExist(H_post.telno_view, H_post.carid) == true) {
						if (this.H_G_Sess.language == "ENG") {
							O_form.setElementErrorWrapper("telno_view", "Phone number has already been registered.");
						} else {
							O_form.setElementErrorWrapper("telno_view", "\u767B\u9332\u6E08\u307F\u306E\u96FB\u8A71\u756A\u53F7\u3067\u3059");
						}
					}

					if (undefined !== H_post.pastflg == true && H_post.pastflg == 1) {
						if (this.checkTelExist(H_post.telno_view, H_post.carid, true) == true) {
							if (this.H_G_Sess.language == "ENG") {
								O_form.setElementErrorWrapper("telno_view", "Phone number has already been registered.(previous month's data)");
							} else {
								O_form.setElementErrorWrapper("telno_view", "\u767B\u9332\u6E08\u307F\u306E\u96FB\u8A71\u756A\u53F7\u3067\u3059\uFF08\u524D\u6708\uFF09");
							}
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

					if (O_extension.checkExtensionNoExists(this.H_G_Sess.pactid, H_post.telno, H_post.carid, H_post.extensionno, true)) {
						if (this.H_G_Sess.language == "ENG") {
							O_form.setElementErrorWrapper("extensionno", "Extension number has already been registered.");
						} else {
							O_form.setElementErrorWrapper("extensionno", "\u767B\u9332\u6E08\u307F\u306E\u5185\u7DDA\u756A\u53F7\u3067\u3059");
						}
					}

					if (undefined !== H_post.pastflg == true && H_post.pastflg == 1) {
						O_extension.setTableNo(this.H_Tb.pretableno);

						if (O_extension.checkExtensionNoExists(this.H_G_Sess.pactid, H_post.telno, H_post.carid, H_post.extensionno, true)) {
							if (this.H_G_Sess.language == "ENG") {
								O_form.setElementErrorWrapper("extensionno", "Extension number has already been registered.(previous month's data)");
							} else {
								O_form.setElementErrorWrapper("extensionno", "\u767B\u9332\u6E08\u307F\u306E\u5185\u7DDA\u756A\u53F7\u3067\u3059\uFF08\u524D\u6708\uFF09");
							}
						}
					}
				}

				var A_assetsno = Array();
				var A_assid = Array();

				for (var key in H_post) //管理番号が来たら重複チェック
				{
					var val = H_post[key];

					if (preg_match("/^assetsno_/", key) == true) //同じフォーム番号の端末ＩＤを抜きだす
						{
							var ass_no = key.replace(/assetsno/g, "");
							var assetsid = "assetsid" + ass_no;
							var pre_assetsno = "pre_assetsno" + ass_no;
							var get_flg = "get_flg" + ass_no;
							var type = "mod";

							if (H_post[assetsid] == "" || val != H_post[pre_assetsno]) //端末情報取得利用
								{
									if (undefined !== H_post[get_flg] == true && H_post[get_flg] == 1) {
										type = "mod";
									} else {
										type = "add";
									}
								}

							if (O_assets.checkAssetsNoExist(val, type) == true) {
								if (this.H_G_Sess.language == "ENG") {
									O_form.setElementErrorWrapper(key, "Management No. has already been registered.");
								} else {
									O_form.setElementErrorWrapper(key, "\u767B\u9332\u6E08\u307F\u306E\u7BA1\u7406\u756A\u53F7\u3067\u3059");
								}
							}

							if ("1" == H_post.pastflg) {
								if (H_post[assetsid] == "" || val != H_post[pre_assetsno]) {
									var pre_type = "add";
								} else {
									if (O_assets.checkAssetsExist(H_post[assetsid], true) == true) {
										pre_type = "mod";
									} else {
										pre_type = "add";
									}
								}

								if (O_assets.checkAssetsNoExist(val, pre_type, true) == true) {
									if (this.H_G_Sess.language == "ENG") {
										O_form.setElementErrorWrapper(key, "Management No. has already been registered. (previous month's data)");
									} else {
										O_form.setElementErrorWrapper(key, "\u767B\u9332\u6E08\u307F\u306E\u7BA1\u7406\u756A\u53F7\u3067\u3059\uFF08\u524D\u6708\u5206\uFF09");
									}
								}
							}

							if (val != "") {
								if (-1 !== A_assetsno.indexOf(val) == false) {
									A_assetsno.push(val);
								} else {
									if (this.H_G_Sess.language == "ENG") {
										O_form.setElementErrorWrapper(key, "Duplicate management No.");
									} else {
										O_form.setElementErrorWrapper(key, "\u7BA1\u7406\u756A\u53F7\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059");
									}
								}
							}
						}

					if (preg_match("/assetsid/", key) == true) {
						if (val != "") //端末そのもの
							{
								if (-1 !== A_assid.indexOf(val) == false) {
									A_assid.push(val);
								} else {
									if (this.H_G_Sess.language == "ENG") {
										O_form.setElementErrorWrapper(key.replace(/id/g, "no"), "Duplicate handset");
									} else {
										O_form.setElementErrorWrapper(key.replace(/id/g, "no"), "\u7AEF\u672B\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059");
									}
								}
							}
					}

					if (preg_match("/main_flg/", key) == true) {
						ass_no = key.replace(/main_flg/g, "");
						var ass_rel_check = "ass_rel_check" + ass_no;

						if (undefined !== H_post[ass_rel_check][1] == true && H_post[ass_rel_check][1] == "1" || undefined !== H_post[ass_rel_check][2] == true && H_post[ass_rel_check][2] == "1") {
							if (this.H_G_Sess.language == "ENG") {
								O_form.setElementErrorWrapper(ass_rel_check, "In-use handset can not be removed.");
							} else {
								O_form.setElementErrorWrapper(ass_rel_check, "\u4F7F\u7528\u4E2D\u306E\u7AEF\u672B\u306F\u5916\u305B\u307E\u305B\u3093");
							}
						}
					}
				}

				if (undefined !== H_post.modtype == true && H_post.modtype == "reserve") //存在チェック
					{
						var reserve_date = H_post.moddate.Y + "-" + H_post.moddate.m + "-" + H_post.moddate.d;
						var cnt = this.checkTelReserveExist(H_get.manageno, H_get.coid, reserve_date, TelModModel.MODMODE);

						if (cnt > 0) //$O_err = new ViewError();
							//					$O_err->display( "入力された電話会社、電話番号、予約日と同じものが既に登録されています。", 0, $_SERVER["PHP_SELF"] . "?r=1", "戻る" );
							//					exit();
							{
								if (this.H_G_Sess.language == "ENG") {
									O_form.setElementErrorWrapper("modtype", "Duplicate date of reservation");
								} else {
									O_form.setElementErrorWrapper("modtype", "\u4E88\u7D04\u65E5\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059");
								}
							}

						if (this.checkShopReceivingOrder(H_get.manageno, H_get.coid)) {
							if (!(undefined !== O_form.O_Form._errors.telno_view)) {
								O_form.setElementErrorWrapper("telno_view", "\u3053\u306E\u96FB\u8A71\u756A\u53F7\u306F\u6CE8\u6587\u4E2D\u3067\u3059\u306E\u3067\u5909\u66F4\u4E88\u7D04\u306F\u51FA\u6765\u307E\u305B\u3093");
							}
						}
					}

				if (undefined !== H_post.pastflg == true && H_post.pastflg == 1) //fjp権限あり
					//存在チェック
					{
						if (-1 !== this.A_Auth.indexOf("fnc_fjp_co") == true) //存在チェック
							{
								if (H_post.pbpostcode_first != "") {
									cnt = this.checkPreUserPostidAuth(H_post.pbpostcode_first);

									if (cnt < 1) {
										O_form.setElementErrorWrapper("pastflg", "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u304C\u524D\u6708\u306B\u5B58\u5728\u3057\u307E\u305B\u3093\u3002\u524D\u6708\u5206\u3082\u5909\u66F4\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044");
									}
								}

								if (H_post.cfbpostcode_first != "") {
									cnt = this.checkPreUserPostidAuth(H_post.cfbpostcode_first);

									if (cnt < 1) {
										O_form.setElementErrorWrapper("pastflg", "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u304C\u524D\u6708\u306B\u5B58\u5728\u3057\u307E\u305B\u3093\u3002\u524D\u6708\u5206\u3082\u5909\u66F4\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044");
									}
								}
							}

						var A_prepostid = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.pretableno);
						cnt = this.checkPreTelAuth(H_get.manageno, H_get.coid, A_prepostid);

						if (cnt < 1) {
							if (this.H_G_Sess.language == "ENG") {
								O_form.setElementErrorWrapper("pastflg", "Phone number does not exist in the previous month.  Uncheck the change for the previous month.");
							} else {
								O_form.setElementErrorWrapper("pastflg", "\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u96FB\u8A71\u3067\u3059\u3002\u524D\u6708\u5206\u3082\u5909\u66F4\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044");
							}
						}
					}

				if (undefined !== H_post.rel_telno_view === true && "" != H_post.rel_telno_view) //関連電話の部署
					{
						if (this.checkTelExist(this.O_Manage.convertNoView(H_post.rel_telno_view), H_post.rel_carid) == false) {
							if (this.H_G_Sess.language == "ENG") {
								O_form.setElementErrorWrapper("rel_telno_view", "Phone number does not exist.");
							} else {
								O_form.setElementErrorWrapper("rel_telno_view", "\u5B58\u5728\u3057\u306A\u3044\u96FB\u8A71\u756A\u53F7\u3067\u3059");
							}
						}

						if (this.checkTelRelTelExist(this.O_Manage.convertNoView(H_post.telno_view), H_post.carid, this.O_Manage.convertNoView(H_post.rel_telno_view), H_post.rel_carid) == true) {
							if (this.H_G_Sess.language == "ENG") {
								O_form.setElementErrorWrapper("rel_telno_view", "Phone number has already been related");
							} else {
								O_form.setElementErrorWrapper("rel_telno_view", "\u95A2\u9023\u6E08\u306E\u96FB\u8A71\u756A\u53F7\u3067\u3059");
							}
						}

						if (H_post.rel_telno_view === H_post.telno_view && H_post.rel_carid == H_post.carid) {
							if (this.H_G_Sess.language == "ENG") {
								O_form.setElementErrorWrapper("rel_telno_view", "Phone number is same as the number being edited");
							} else {
								O_form.setElementErrorWrapper("rel_telno_view", "\u7DE8\u96C6\u4E2D\u306E\u96FB\u8A71\u756A\u53F7\u3068\u540C\u3058\u3067\u3059");
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

		for (cnt = 0;; cnt < H_post.asscnt; cnt++) //端末フォームの印を取り一台分だけ抜き取る
		//入力があるか調べる
		{
			var H_tmp = this.O_Manage.getOneAssFormValue(H_post, cnt);

			if (undefined !== H_post.modtype == true && "now" == H_post.modtype && undefined !== H_tmp.main_flg == true && H_post.asscnt > 1 && this.checkAssFormInput(H_tmp) == false) {
				if (this.H_G_Sess.language == "ENG") {
					O_form.setElementErrorWrapper("assetsno_" + cnt, "Handset without entry can not be in-use");
				} else {
					O_form.setElementErrorWrapper("assetsno_" + cnt, "\u5165\u529B\u306E\u7121\u3044\u7AEF\u672B\u306F\u4F7F\u7528\u4E2D\u306B\u3067\u304D\u307E\u305B\u3093");
				}
			}
		}
	}

	makeDelManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_tb;
		} else {
			tb = this.H_Tb.tel_tb;
		}

		var sql = this.makeDelTelSQL(this.O_Manage.convertNoView(H_post.pre_telno_view), H_post.pre_carid, tb);
		return sql;
	}

	checkAssInput(H_post) {
		for (var key in H_post) {
			var val = H_post[key];

			if (preg_match("/_(\\d)$/", key) == true) {
				if ("" != val) {
					return true;
				}
			}
		}

		return false;
	}

	__destruct() {
		super.__destruct();
	}

};