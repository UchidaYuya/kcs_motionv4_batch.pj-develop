//
//オーダー取得・更新用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/04/01
//@uses OrderModel
//@uses OrderUtil
//
//
//追加 20090918miya
//
//注文フォーム用Model
//
//@uses ModelBase
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("OrderMainModel.php");

require("OrderUtil.php");

require("model/TelModel.php");

require("model/PostModel.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//指定した会社、キャリア、回線種別、部署に電話が存在するか確認する<br>
//部署に存在しない場合、条件から部署をぬいて(会社全体から)確認する
//
//@author igarashi
//@since 2008/05/21
//
//@pram $telno
//@pram $pactid
//@pram $cirid(回線種別)
//@pram $carid
//@pram $type(発注種別)
//@pram $postid
//
//@access public
//@return boolean
//
//
//指定した会社、キャリアに電話があるか確認<br>
//電話はあるが回線種別が異なる場合のチェックに使用する
//
//@author igarashi
//@since 2008/05/21
//
//@pram $telno
//@pram $pactid
//@pram $carid
//
//@access public
//@return boolean
//
//
//指定した会社、キャリアに電話があるか確認<br>
//電話はあるが地域が異なる場合のチェックに使用する
//
//@author igarashi
//@since 2008/05/21
//
//@param  $telno
//@param  $pactid
//@param  $carid
//@param  $arid(地域ID)
//
//@access public
//@return boolean
//
//
//指定した会社、キャリア、電話で使用できるプランか確認す<br>
//一度確定したあとで電話番号を書き換えた場合に生じるプランと地域のズレを検出するための関数
//
//@author igarashi
//@since 2008/05/21
//
//@param  $telno
//@param  $pactid
//@param  $carid
//@param  $planid
//@param  $packetid
//
//@access public
//@return boolean
//
//
//指定した会社、キャリア、電話で使用できるプランか確認す<br>
//一度確定したあとで電話番号を書き換えた場合に生じるプランと電話種別のズレを検出するための関数
//
//@author igarashi
//@since 2008/05/21
//
//@param  $telno
//@param  $pactid
//@param  $carid
//@param  $planid
//@param  $packetid
//
//@access public
//@return boolean
//
//
//指定した会社、キャリア、電話で使用できるプランか確認す<br>
//一度確定したあとで電話番号を書き換えた場合に生じるプランと電話種別のズレを検出するための関数
//
//@author igarashi
//@since 2008/05/21
//
//@param  $telno
//@param  $pactid
//@param  $carid
//@param  $planid
//@param  $packetid
//
//@access public
//@return boolean
//
//
//電話存在チェック（と、telno_view取得）
//
//@author miyazawa
//@since 2008/04/17
//
//@param int $pactid
//@param int $carid
//@param mixed $H_sess
//@access public
//@return
//
//
//指定した会社、キャリア、電話で使用できるプランか確認する<br>
//一度確定したあとで電話番号を書き換えた場合に生じるプランと電話種別のズレを検出するための関数
//
//@author igarashi
//@since 2008/05/21
//
//@param  $telno
//@param  $pactid
//@param  $type
//@param  $carid
//@param  $postid
//
//@access public
//@return hash
//
//public function checkTelInfo($telno, $pactid, $type, $carid, $postid="") {
//
//電話情報を渡して違約金をチェックする
//
//@author miyazawa
//@since 2008/09/08
//
//@param  $H_telinfo
//
//@access public
//@return hash
//
//public function checkTelInfo($telno, $pactid, $type, $carid, $postid="") {
//
//OrderFormから一件だけtelnoを渡して詳細情報を取得する関数
//
//@author miyazawa
//@since 2008/08/22
//
//@param  $H_sess
//@param  $H_g_sess
//
//@access public
//@return hash
//
//
//getPenaltyInfo
//MNPの違約金情報を取得する
//@author date
//@since 2015/11/26
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@param mixed $postid
//@param mixed $site_flg
//@access public
//@return void
//
//
//MNPチェック
//
//
//@author igarashi
//@since 2008/05/21
//
//@param  $telno
//@param  $pactid
//@param  $type
//@param  $carid
//
//@access public
//@return hash
//
//
//電話情報から登録部署を取得する（MNP用）
//
//
//@author miyazawa
//@since 2009/09/29
//
//@param  $H_sess
//@param  $H_g_sess
//
//@access public
//@return hash
//
//
//回線種別チェック<br>
//
//@author igarashi
//@since 2008/05/21
//
//@param  $telno
//@param  $pactid
//@param  $type
//@param  $carid
//@param  $postid
//
//@access public
//@return hash
//
//
//移行後のプラン名を返す
//
//
//@author igarashi
//@since 2008/05/21
//
//@param  $telno
//@param  $pactid
//@param  $type
//@param  $carid
//
//@access public
//@return hash
//
//
//現状引き継ぎのプラン名を取得する
//
//
//@author igarashi
//@since 2008/05/21
//
//@param  $fromplanid(移行前planid)
//
//@access public
//@return boolean
//
//
//部署の地域会社を取得する
//
//
//@author igarashi
//@since 2008/05/21
//
//@param  $fromplanid(移行前planid)
//
//@access public
//@return
//
//
//指定した会社の電話詳細情報項目名を取得する
//
//
//@author igarashi
//@since 2008/05/21
//
//@param  $pactid
//
//@access public
//@return hash
//
//
//指定した会社、キャリアの公私分計パターンを取得する
//
//
//@author igarashi
//@since 2008/05/21
//
//@param  $pactid
//@param  $carid
//
//@access public
//@return boolean
//
//
//電話詳細情報のデフォルト値作成
//
//@author miyazawa
//@since 2008/04/01
//
//@param mixed $H_sess
//@access public
//@return
//
//
//携帯キャリアを返す<br>
//caridが指定されていれば、そのキャリアを抜いて返す
//
//
//@author igarashi
//@since 2008/05/21
//
//@param integer $carid(返り値に含まないキャリア）
//@param boolean $eng(英語化）
//
//@access public
//@return hash
//
//
//会社内に指定したキャリア以外に電話が存在しないか確認<br>
//(複数キャリアに同一番号がないか）
//
//@author igarashi
//@since 2008/05/21
//
//@param $telno
//@param $pactid
//@param $carid
//
//@access public
//@return int(登録件数)
//
//
//指定したキャリアの代表地域会社を取得する
//
//@author igarashi
//@since 2008/05/21
//
//@param $H_info["carid"](キャリアID)
//
//@access public
//@return int
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class OrderTelInfoModel extends OrderMainModel {
	constructor(O_db0, H_g_sess, site_flg = OrderTelInfoModel.SITE_USER) //追加 20090918miya
	{
		super(O_db0, H_g_sess, site_flg);
		this.O_telmodel = new TelModel(O_db0);
		this.O_Out = this.getOut();
		this.O_Post = new PostModel();
	}

	checktelExist(telno, pactid, cirid, carid, type = "", postid = "") //postidが指定されていたらその部署内でチェック
	//引数に回線種別がない場合、あるいは0（解約や付属品）の場合
	{
		telno = str_replace("-", "", telno);
		var sql = "SELECT telno, cirid FROM tel_tb WHERE telno='" + telno + "' AND pactid=" + pactid + " AND carid=" + carid;

		if (postid != "") {
			sql += " AND postid=" + postid;
		}

		var H_exist = this.get_DB().queryHash(sql);

		if (cirid == "" || cirid == "5" || cirid == "10") {
			if (H_exist.length > 0) {
				return true;
			} else {
				return false;
			}
		} else if (type == "C" && carid == 1 && cirid == 2) {
			for (var key in H_exist) {
				var value = H_exist[key];

				if (value.cirid == cirid || value.cirid == 4) {
					return true;
				}
			}
		} else if (type == "S") {
			for (var key in H_exist) //FOMA、movaの場合
			{
				var value = H_exist[key];

				if (carid = 1 && (value.cirid == 1 || value.cirid == 2)) {
					return true;
				}
			}
		} else {
			for (var key in H_exist) {
				var value = H_exist[key];

				if (value.cirid == cirid) {
					return true;
				}
			}
		}

		return false;
	}

	checkTelCircuit(H_sess, H_g_sess) {
		for (var telno of Object.values(H_sess.SELF)) {
			var telno = str_replace("-", "", telno);
			var sql = "SELECT telno,cirid FROM tel_tb WHERE telno='" + telno + "' AND pactid=" + H_g_sess.pactid + " AND carid=" + H_sess["/MTOrder"].carid;
			H_exist[telno] = this.get_DB().queryRowHash(sql);

			if (H_exist.telno != "") {
				H_exist[telno].result = true;
			} else {
				H_exist[telno].result = false;
			}
		}

		return H_exist;
	}

	checkTelArea(telno, pactid, carid, arid) {
		telno = str_replace("-", "", telno);
		var sql = "SELECT telno, arid FROM tel_tb WHERE telno='" + telno + "' AND pactid=" + pactid + " AND carid=" + carid + " AND arid=" + arid;
		var H_exist = this.get_DB().queryRowHash(sql);

		if (H_exist.telno != "") {
			return true;
		} else {
			return false;
		}
	}

	checkTelPlanArea(telno, pactid, carid, planid = "", packetid = "") {
		telno = str_replace("-", "", telno);

		if (planid != "") {
			var sql = "SELECT tel.arid AS telarea, plan.arid AS planarea FROM tel_tb tel, plan_tb plan" + " WHERE tel.telno='" + telno + "' AND tel.pactid=" + pactid + " AND tel.carid=" + carid + " AND plan.planid=" + planid;
			var H_areas = this.get_DB().queryRowHash(sql);

			if (H_areas.telarea != H_areas.planarea) {
				return false;
			}
		}

		if (packetid != "") {
			sql = "SELECT tel.arid AS telarea, packet.arid AS packetarea FROM tel_tb tel, packet_tb packet" + " WHERE tel.telno='" + telno + "' AND tel.pactid=" + pactid + " AND tel.carid=" + carid + " AND packet.packetid=" + packetid;
			H_areas = this.get_DB().queryRowHash(sql);

			if (H_areas.telarea != H_areas.packetarea) {
				return false;
			}
		}

		return true;
	}

	CheckTelPlanCircuit(telno, pactid, carid, planid = "", packetid = "") {
		telno = str_replace("-", "", telno);

		if (planid != "") {
			var sql = "SELECT tel.cirid AS telcir, plan.cirid AS plancir FROM tel_tb tel, plan_tb plan" + " WHERE tel.telno='" + telno + "' AND tel.pactid=" + pactid + " AND tel.carid=" + carid + " AND plan.planid=" + planid;
			var H_cirs = this.get_DB().queryRowHash(sql);

			if (H_cirs.telcir != H_cirs.plancir) {
				return false;
			}
		}

		if (packetid != "") {
			sql = "SELECT tel.cirid AS telcir, packet.cirid AS packetcir FROM tel_tb tel, packet_tb packet" + " WHERE tel.telno='" + telno + "' AND tel.pactid=" + pactid + " AND tel.carid=" + carid + " AND packet.packetid=" + packetid;
			H_cirs = this.get_DB().queryRowHash(sql);

			if (H_areas.telcir != H_areas.packetcir) {
				return false;
			}
		}

		return true;
	}

	checkCiridRadio(ciridradio, plan = "", packet = "", A_option = "") {
		if (ciridradio == "") {
			return false;
		}

		if (plan != "") {
			var sql = "SELECT cirid FROM plan_tb WHERE planid=" + plan;
			var cirid = this.get_DB().queryOne(sql);

			if (cirid != ciridradio) {
				return false;
			}
		}

		if (packet != "") {
			sql = "SELECT cirid FROM packet_tb WHERE packetid=" + packet;
			cirid = this.get_DB().queryOne(sql);

			if (cirid != ciridradio) {
				return false;
			}
		}

		if (A_option != "" && A_option.length > 0) {
			var A_keys = Object.keys(A_option);
			sql = "SELECT cirid FROM option_tb WHERE opid=" + A_keys[0];
			cirid = this.get_DB().queryOne(sql);

			if (cirid != ciridradio) {
				return false;
			}
		}

		return true;
	}

	isTheTelExists(pactid, carid, H_sess: {} | any[]) //あいだが空いた複数件の入力を詰めるための変数 20090331miya
	{
		var needle = 0;

		for (var i = 0; i < 10; i++) {
			if (true == (undefined !== H_sess["telno" + i]) && true == 0 < H_sess["telno" + i].trim().length) //@return	成功：	指定された電話会社、電話番号で存在した場合 => 2 を返す
				//指定された電話会社以外で電話番号が存在した場合 => 1 を返す
				//指定された電話会社以外でも電話が存在しなかった場合 => 0 を返す
				//失敗：	false
				{
					var telno = H_sess["telno" + i];
					telno = telno.replace(/ /g, "");
					telno = telno.replace(/\-/g, "");
					telno = telno.replace(/\(/g, "");
					telno = telno.replace(/\)/g, "");

					if (telno != "") {
						var result = this.O_telmodel.chkCarid(pactid, telno, carid);
						A_result[needle].exist = result;

						if (result == 2 || result == 1) {
							var sql = "SELECT telno_view FROM tel_tb WHERE telno='" + telno + "' AND carid='" + carid + "' AND pactid=" + pactid;
							A_result[needle].telno_view = this.get_DB().queryOne(sql);
						}

						needle++;
					}
				}
		}

		return A_result;
	}

	checkTelInfo(H_sess, H_g_sess, postid = "") {
		if (false == (undefined !== H_sess.SELF) || H_sess.SELF == undefined) {
			return false;
		}

		var H_telinfo = Array();
		var idx = 0;
		{
			let _tmp_0 = H_sess.SELF;

			for (var keyName in _tmp_0) {
				var telno = _tmp_0[keyName];

				if ("othercarid" == keyName) {
					continue;
				}

				if (true == (undefined !== telno) && 0 < telno.length) //HLでハイフン入力が消えるので対策 20091117miya
					//部署IDが指定されていればsqlに部署IDを追加する
					//違約金チェック
					{
						var telno_org = telno;
						var telno = str_replace("-", "", telno);
						var sql = "SELECT \n\t\t\t\t\t\t tel.telno,\n\t\t\t\t\t\t tel.telno_view,\n\t\t\t\t\t\t tel.postid,\n\t\t\t\t\t\t tel.arid,\n\t\t\t\t\t\t tel.carid,\n\t\t\t\t\t\t tel.cirid,\n\t\t\t\t\t\t tel.userid,\n\t\t\t\t\t\t tel.username,\n\t\t\t\t\t\t tel.username AS telusername,\n\t\t\t\t\t\t tel.simcardno,\n\t\t\t\t\t\t tel.employeecode,\n\t\t\t\t\t\t tel.mail,\n\t\t\t\t\t\t tel.planid,\n\t\t\t\t\t\t tel.packetid,\n\t\t\t\t\t\t tel.text1,\n\t\t\t\t\t\t tel.text2,\n\t\t\t\t\t\t tel.text3,\n\t\t\t\t\t\t tel.text4,\n\t\t\t\t\t\t tel.text5,\n\t\t\t\t\t\t tel.text6,\n\t\t\t\t\t\t tel.text7,\n\t\t\t\t\t\t tel.text8,\n\t\t\t\t\t\t tel.text9,\n\t\t\t\t\t\t tel.text10,\n\t\t\t\t\t\t tel.text11,\n\t\t\t\t\t\t tel.text12,\n\t\t\t\t\t\t tel.text13,\n\t\t\t\t\t\t tel.text14,\n\t\t\t\t\t\t tel.text15,\n\t\t\t\t\t\t tel.int1,\n\t\t\t\t\t\t tel.int2,\n\t\t\t\t\t\t tel.int3,\n\t\t\t\t\t\t tel.int4,\n\t\t\t\t\t\t tel.int5,\n\t\t\t\t\t\t tel.int6,\n\t\t\t\t\t\t tel.date1,\n\t\t\t\t\t\t tel.date2,\n\t\t\t\t\t\t tel.date3,\n\t\t\t\t\t\t tel.date4,\n\t\t\t\t\t\t tel.date5,\n\t\t\t\t\t\t tel.date6,\n\t\t\t\t\t\t tel.mail1,\n\t\t\t\t\t\t tel.mail2,\n\t\t\t\t\t\t tel.mail3,\n\t\t\t\t\t\t tel.url1,\n\t\t\t\t\t\t tel.url2,\n\t\t\t\t\t\t tel.url3,\n\t\t\t\t\t\t tel.select1,\n\t\t\t\t\t\t tel.select2,\n\t\t\t\t\t\t tel.select3,\n\t\t\t\t\t\t tel.select4,\n\t\t\t\t\t\t tel.select5,\n\t\t\t\t\t\t tel.select6,\n\t\t\t\t\t\t tel.select7,\n\t\t\t\t\t\t tel.select8,\n\t\t\t\t\t\t tel.select9,\n\t\t\t\t\t\t tel.select10,\n\t\t\t\t\t\t tel.memo,\n\t\t\t\t\t\t tel.kousiflg,\n\t\t\t\t\t\t tel.kousiptn,\n\t\t\t\t\t\t tel.orderdate,\n\t\t\t\t\t\t tel.contractdate,\n\t\t\t\t\t\t tel.buyselid,\n\t\t\t\t\t\t ast.productid,\n\t\t\t\t\t\t tel.extensionno,\n\t\t\t\t\t\t tel.division " + "FROM tel_tb tel " + "LEFT JOIN tel_rel_assets_tb astrel ON tel.telno=astrel.telno AND tel.pactid=astrel.pactid AND tel.carid=astrel.carid AND astrel.main_flg=true " + "LEFT JOIN assets_tb ast ON astrel.assetsid=ast.assetsid " + " WHERE tel.telno='" + telno + "' AND tel.pactid=" + H_g_sess.pactid + " AND tel.carid=" + H_sess["/MTOrder"].carid;

						if (true == (undefined !== postid) && postid != "") {
							sql += " AND tel.postid=" + postid;
						}

						var result = this.get_DB().queryRowHash(sql);

						if (undefined != result) //公私分計情報を加工（tel_tbのkousiflgが0→order_teldetail_tbのkousiradioがon、tel_tbのkousiflgが1→order_teldetail_tbのkousiradioがoff）20060207miya
							{
								H_telinfo["telno" + idx] = result;

								if (H_telinfo["telno" + idx].kousiflg != "" && H_telinfo["telno" + idx].kousiflg == 0) {
									H_telinfo["telno" + idx].kousiradio = "on";
								} else if (H_telinfo["telno" + idx].kousiflg != "" && H_telinfo["telno" + idx].kousiflg == 1) {
									H_telinfo["telno" + idx].kousiradio = "off";
								}

								if (H_telinfo["telno" + idx].kousiptn != "") {
									H_telinfo["telno" + idx].kousi = H_telinfo["telno" + idx].kousiptn;
								}

								if ("S" == H_sess["/MTOrder"].type && 1 == H_sess["/MTOrder"].carid && true == (-1 !== [1, 2].indexOf(H_telinfo["telno" + idx].cirid)) && "" != H_telinfo["telno" + idx].planid) {
									var toplanname = this.getToPlan(H_telinfo["telno" + idx].planid);

									if ("" != toplanname) {
										H_telinfo["telno" + idx].toplanname = toplanname;
									}
								}
							} else //HLでハイフン入力が消えるので対策（$telnoを$telno_orgにした） 20091117miya
							{
								if ("H" != PACTTYPE) //$H_telinfo["telno" .$idx]["errcode"] = "この電話番号は登録されていません";	// 「errcode」は使ってないのでコメントアウト
									{
										if ("ENG" == H_g_sess.language) //「alert」の名前でcheckTelInfoOrderTypeと揃えた
											{
												H_telinfo["telno" + idx].alert = "This telephone number is not registered.";
											} else //「alert」の名前でcheckTelInfoOrderTypeと揃えた
											{
												H_telinfo["telno" + idx].alert = "\u3053\u306E\u96FB\u8A71\u756A\u53F7\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093";
											}
									}

								H_telinfo["telno" + idx].telno = telno;
								H_telinfo["telno" + idx].telno_view = telno_org;

								if ("" != H_sess[OrderTelInfoModel.PUB].buyselid) {
									H_telinfo["telno" + idx].buyselid = H_sess[OrderTelInfoModel.PUB].buyselid;
								}
							}

						if (true == (-1 !== ["Nmnp", "C", "S", "P", "Ppl", "Pdc", "Pop", "D"].indexOf(H_sess["/MTOrder"].type))) //@return	成功：違約金チェック結果の連想配列
							//array("plan" => array("judge" => 0:違約金発生無し、1:違約金発生有り),
							//array("option" => array("judge" => 0:違約金発生無し、1:違約金発生有り),
							//array("buyselect" => array("judge" => 0:違約金発生無し、1:違約金発生有り, "charge" => 違約金))
							//失敗：false
							{
								var H_penalty = this.O_telmodel.chkPenalty(H_g_sess.pactid, telno, H_sess["/MTOrder"].carid);

								if (true == Array.isArray(H_penalty)) {
									H_telinfo["telno" + idx].penalty = H_penalty;
								}
							}

						idx++;
					}
			}
		}
		return H_telinfo;
	}

	checkOrderPenalty(pactid, H_telinfo = Array()) {
		for (var key in H_telinfo) //違約金チェック
		{
			var val = H_telinfo[key];

			if (true == (undefined !== val.telno)) //@return	成功：違約金チェック結果の連想配列
				//array("plan" => array("judge" => 0:違約金発生無し、1:違約金発生有り),
				//array("option" => array("judge" => 0:違約金発生無し、1:違約金発生有り),
				//array("buyselect" => array("judge" => 0:違約金発生無し、1:違約金発生有り, "charge" => 違約金))
				//失敗：false
				{
					var H_penalty = this.O_telmodel.chkPenalty(pactid, val.telno, val.carid);

					if (true == Array.isArray(H_penalty)) {
						H_telinfo[key].penalty = H_penalty;
					}
				}
		}

		return H_telinfo;
	}

	checkTelInfoOne(H_sess, H_g_sess) {
		if (false == (undefined !== H_sess) || H_sess == undefined) {
			return false;
		}

		var session = MtSession.singleton();
		var H_telinfo = Array();

		if (true == (undefined !== H_sess.SELF.telno) && 0 < H_sess.SELF.telno.length) //存在しない電話は保存しない
			{
				H_sess.SELF.telno = str_replace("-", "", H_sess.SELF.telno);
				var sql = "SELECT telno, telno_view, postid, arid, carid, cirid, userid, username, username AS telusername, employeecode, mail, planid, packetid, " + "text1, text2, text3, text4, text5, text6, text7, text8, text9, text10, text11, text12, text13, text14, text15, int1, int2, int3, " + "int4, int5, int6, date1, date2, date3, date4, date5, date6, mail1, mail2, mail3, url1, url2, url3, " + "select1, select2, select3, select4, select5, select6, select7, select8, select9,select10, " + "memo, kousiflg, kousiptn, orderdate, contractdate, buyselid, division " + "FROM tel_tb WHERE telno='" + H_sess.SELF.telno + "' AND pactid=" + H_g_sess.pactid + " AND carid=" + H_sess["/MTOrder"].carid;
				var result = this.get_DB().queryRowHash(sql);

				if (undefined != result) {
					H_telinfo.telno0 = result;

					if (!is_null(session.OrderByCategory)) {
						if (session.OrderByCategory == "business") {
							if (result.division !== 1) {
								H_telinfo.telno0.alert = "\u696D\u52D9\u7528\u3067\u306F\u3042\u308A\u307E\u305B\u3093";
								H_telinfo.telno0.division = result.division;
								return H_telinfo;
							}
						} else if (session.OrderByCategory == "demo") {
							if (result.division !== 2) //xx
								{
									H_telinfo.telno0.alert = "\u30C7\u30E2\u7528\u3067\u306F\u3042\u308A\u307E\u305B\u3093";
									H_telinfo.telno0.division = result.division;
									return H_telinfo;
								}
						}
					}

					if (H_telinfo.telno0.kousiflg != "" && H_telinfo.telno0.kousiflg == 0) {
						H_telinfo.telno0.kousiradio = "on";
					} else if (H_telinfo.telno0.kousiflg != "" && H_telinfo.telno0.kousiflg == 1) {
						H_telinfo.telno0.kousiradio = "off";
					}

					if (H_telinfo.telno0.kousiptn != "") {
						H_telinfo.telno0.kousi = H_telinfo.telno0.kousiptn;
					}
				} else {
					if ("H" != PACTTYPE) {
						if ("ENG" == H_g_sess.language) {
							H_telinfo.telno0.alert = "This telephone number is not registered.";
						} else {
							H_telinfo.telno0.alert = "\u3053\u306E\u96FB\u8A71\u756A\u53F7\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093";
						}
					}
				}
			}

		return H_telinfo;
	}

	getPenaltyInfoMNP(H_sess, H_g_sess, postid, site_flg = OrderTelInfoModel.SITE_USER) //これがMNPを許可する部署のリスト
	//部署が混在した複数件のMNPを防ぐため、基準となるpostidを設定 20091021miya
	{
		if (false == (undefined !== H_sess.SELF) || H_sess.SELF == undefined) {
			return false;
		}

		var shopid = H_sess["/MTOrder"].shopid;

		if ("" == shopid) {
			shopid = H_g_sess.shopid;
		}

		var A_post = Array();

		if (site_flg == OrderTelInfoModel.SITE_SHOP) //ORDER BY levelで取ってきてるから一件目のlevelが最小
			{
				if (false == (undefined !== H_sess["/MTOrder"].carid) || false == is_numeric(H_sess["/MTOrder"].carid)) {
					this.O_Out.errorOut(8, "OrderTelInfoModel::checkTelInfoMNP  \u4EE3\u884C\u6CE8\u6587\u3067\u30BB\u30C3\u30B7\u30E7\u30F3\u306Bcarid\u304C\u306A\u3044", false);
				}

				var sql = "SELECT postid FROM shop_relation_tb WHERE pactid=" + H_g_sess.pactid + " AND shopid=" + shopid + " AND carid=" + H_sess["/MTOrder"].carid;
				var result = this.get_DB().queryCol(sql);

				if ("" != result) {
					A_post = result;
				}

				sql = "SELECT postidparent, level FROM post_relation_tb WHERE pactid=" + H_g_sess.pactid;
				sql += " AND postidparent IN (SELECT postid FROM shop_relation_tb WHERE pactid=" + H_g_sess.pactid + " AND shopid=" + shopid + " AND carid=" + H_sess["/MTOrder"].carid + ") ORDER BY level";
				var H_rel = this.get_DB().queryHash(sql);

				if (true == Array.isArray(H_rel) && true == (undefined !== H_rel[0].level)) {
					var top = H_rel[0].level;
					var A_treepost = Array();

					for (var val of Object.values(H_rel)) {
						if (top == val.level) //担当部署のうち最高レベルから配下の部署リストを取得する
							{
								var A_tmppost = this.O_Post.getChildList(H_g_sess.pactid, val.postidparent);
								A_treepost = array_merge(A_treepost, A_tmppost);
							}
					}

					A_post = array_merge(A_post, A_treepost);
				}
			} else {
			A_post = this.O_Post.getChildList(H_g_sess.pactid, postid);
		}

		A_post = array_unique(A_post);

		if (1 > A_post.length) //$this->O_Out->errorOut(8, "OrderTelInfoModel::checkTelInfoMNP  配下の部署リストが取得できない", false);
			{
				return Array();
			}

		{
			let _tmp_1 = H_sess.SELF;

			for (var key in _tmp_1) //$H_mnpは以下の形に整形される
			//array
			//0 =>
			//array
			//'telno' => string '09000000022' (length=11)
			//'formercarid' => string '3' (length=1)
			//'mnpno' => string 'test' (length=4)
			{
				var val = _tmp_1[key];
				var key = key.replace(/\_/g, "");
				var key_name = key.substr(0, key.length - 1);
				var key_no = ltrim(key, key_name);
				H_mnp[key_no][key_name] = val;
			}
		}
		var H_telinfo = Array();
		var idx = 0;
		var base_postid = undefined;

		for (var no in H_mnp) {
			var value = H_mnp[no];

			if (value.telno != "") //HLでハイフン入力が消えるので対策 20091117miya
				{
					var chkmnptel_org = value.telno;
					var chkmnptel = value.telno;
					chkmnptel = chkmnptel.replace(/ /g, "");
					chkmnptel = chkmnptel.replace(/\-/g, "");
					chkmnptel = chkmnptel.replace(/\(/g, "");
					chkmnptel = chkmnptel.replace(/\)/g, "");

					if (true == (undefined !== chkmnptel) && 0 < chkmnptel.length) //card指定
						//MNPの場合は部署IDが指定される
						//postid決め打ちではなくリストになった 0091016miya
						//まずキャリア・部署を含めたチェック
						//存在する場合
						{
							chkmnptel = str_replace("-", "", chkmnptel);
							var base_sql = "SELECT telno, telno_view, postid, arid, carid, cirid, userid, username, username AS telusername, employeecode, mail, planid, packetid, " + "text1, text2, text3, text4, text5, text6, text7, text8, text9, text10, text11, text12, text13, text14, text15, int1, int2, int3, " + "int4, int5, int6, date1, date2, date3, date4, date5, date6, mail1, mail2, mail3, url1, url2, url3, " + "select1, select2, select3, select4, select5, select6, select7, select8, select9, select10, " + "memo, kousiflg, kousiptn, orderdate, contractdate, buyselid, division " + "FROM tel_tb WHERE telno='" + chkmnptel + "' AND pactid=" + H_g_sess.pactid;
							var car_sql = " AND carid=" + value.formercarid;
							var post_sql = " AND postid IN (" + join(",", A_post) + ")";
							sql = base_sql + car_sql + post_sql;
							result = this.get_DB().queryRowHash(sql);

							if (undefined != result) //違約金チェック
								//@return	成功：違約金チェック結果の連想配列
								//array("plan" => array("judge" => 0:違約金発生無し、1:違約金発生有り),
								//array("option" => array("judge" => 0:違約金発生無し、1:違約金発生有り),
								//array("buyselect" => array("judge" => 0:違約金発生無し、1:違約金発生有り, "charge" => 違約金))
								//失敗：false
								{
									var H_penalty = this.O_telmodel.chkPenalty(H_g_sess.pactid, chkmnptel, value.formercarid);

									if (true == Array.isArray(H_penalty)) {
										H_telinfo["telno" + idx].penalty = H_penalty;
									}
								}
						}

					idx++;
				}
		}

		return H_telinfo;
	}

	checkTelInfoMNP(H_sess, H_g_sess, postid, site_flg = OrderTelInfoModel.SITE_USER) //これがMNPを許可する部署のリスト
	//部署が混在した複数件のMNPを防ぐため、基準となるpostidを設定 20091021miya
	{
		if (false == (undefined !== H_sess.SELF) || H_sess.SELF == undefined) {
			return false;
		}

		var shopid = H_sess["/MTOrder"].shopid;

		if ("" == shopid) {
			shopid = H_g_sess.shopid;
		}

		var A_post = Array();

		if (site_flg == OrderTelInfoModel.SITE_SHOP) //ORDER BY levelで取ってきてるから一件目のlevelが最小
			{
				if (false == (undefined !== H_sess["/MTOrder"].carid) || false == is_numeric(H_sess["/MTOrder"].carid)) {
					this.O_Out.errorOut(8, "OrderTelInfoModel::checkTelInfoMNP  \u4EE3\u884C\u6CE8\u6587\u3067\u30BB\u30C3\u30B7\u30E7\u30F3\u306Bcarid\u304C\u306A\u3044", false);
				}

				var sql = "SELECT postid FROM shop_relation_tb WHERE pactid=" + H_g_sess.pactid + " AND shopid=" + shopid + " AND carid=" + H_sess["/MTOrder"].carid;
				var result = this.get_DB().queryCol(sql);

				if ("" != result) {
					A_post = result;
				}

				sql = "SELECT postidparent, level FROM post_relation_tb WHERE pactid=" + H_g_sess.pactid;
				sql += " AND postidparent IN (SELECT postid FROM shop_relation_tb WHERE pactid=" + H_g_sess.pactid + " AND shopid=" + shopid + " AND carid=" + H_sess["/MTOrder"].carid + ") ORDER BY level";
				var H_rel = this.get_DB().queryHash(sql);

				if (true == Array.isArray(H_rel) && true == (undefined !== H_rel[0].level)) {
					var top = H_rel[0].level;
					var A_treepost = Array();

					for (var val of Object.values(H_rel)) {
						if (top == val.level) //担当部署のうち最高レベルから配下の部署リストを取得する
							{
								var A_tmppost = this.O_Post.getChildList(H_g_sess.pactid, val.postidparent);
								A_treepost = array_merge(A_treepost, A_tmppost);
							}
					}

					A_post = array_merge(A_post, A_treepost);
				}
			} else {
			A_post = this.O_Post.getChildList(H_g_sess.pactid, postid);
		}

		A_post = array_unique(A_post);

		if (1 > A_post.length) {
			this.O_Out.errorOut(8, "OrderTelInfoModel::checkTelInfoMNP  \u914D\u4E0B\u306E\u90E8\u7F72\u30EA\u30B9\u30C8\u304C\u53D6\u5F97\u3067\u304D\u306A\u3044", false);
		}

		H_mnp;
		{
			let _tmp_2 = H_sess.SELF;

			for (var key in _tmp_2) //$H_mnpは以下の形に整形される
			//array
			//0 =>
			//array
			//'telno' => string '09000000022' (length=11)
			//'formercarid' => string '3' (length=1)
			//'mnpno' => string 'test' (length=4)
			{
				var val = _tmp_2[key];
				var key = key.replace(/\_/g, "");
				var key_name = key.substr(0, key.length - 1);
				var key_no = ltrim(key, key_name);
				H_mnp[key_no][key_name] = val;
			}
		}
		var H_telinfo = Array();
		var idx = 0;
		var base_postid = undefined;

		for (var no in H_mnp) {
			var value = H_mnp[no];

			if (value.telno != "") //HLでハイフン入力が消えるので対策 20091117miya
				{
					var chkmnptel_org = value.telno;
					var chkmnptel = value.telno;
					chkmnptel = chkmnptel.replace(/ /g, "");
					chkmnptel = chkmnptel.replace(/\-/g, "");
					chkmnptel = chkmnptel.replace(/\(/g, "");
					chkmnptel = chkmnptel.replace(/\)/g, "");

					if (true == (undefined !== chkmnptel) && 0 < chkmnptel.length) //card指定
						//MNPの場合は部署IDが指定される
						//postid決め打ちではなくリストになった 0091016miya
						//まずキャリア・部署を含めたチェック
						//存在する場合
						{
							chkmnptel = str_replace("-", "", chkmnptel);
							var base_sql = "SELECT telno, telno_view, postid, arid, carid, cirid, userid, username, username AS telusername, employeecode, mail, planid, packetid, " + "text1, text2, text3, text4, text5, text6, text7, text8, text9, text10, text11, text12, text13, text14, text15, int1, int2, int3, " + "int4, int5, int6, date1, date2, date3, date4, date5, date6, mail1, mail2, mail3, url1, url2, url3, " + "select1, select2, select3, select4, select5, select6, select7, select8, select9, select10, " + "memo, kousiflg, kousiptn, orderdate, contractdate, buyselid, division " + "FROM tel_tb WHERE telno='" + chkmnptel + "' AND pactid=" + H_g_sess.pactid;
							var car_sql = " AND carid=" + value.formercarid;
							var post_sql = " AND postid IN (" + join(",", A_post) + ")";
							sql = base_sql + car_sql + post_sql;
							result = this.get_DB().queryRowHash(sql);

							if (undefined != result) //親番号はMNPさせない（これはMNPだけでなく削除のときもチェックする必要あり）
								//違約金チェック
								//@return	成功：違約金チェック結果の連想配列
								//array("plan" => array("judge" => 0:違約金発生無し、1:違約金発生有り),
								//array("option" => array("judge" => 0:違約金発生無し、1:違約金発生有り),
								//array("buyselect" => array("judge" => 0:違約金発生無し、1:違約金発生有り, "charge" => 違約金))
								//失敗：false
								//用途区分チェック
								{
									var prtelno_sql = "SELECT prtelno FROM bill_prtel_tb WHERE pactid=" + H_g_sess.pactid;
									var H_prtelno = this.get_DB().queryCol(prtelno_sql);

									for (var keycnt in H_prtelno) {
										var telcnt = H_prtelno[keycnt];
										H_prtelno[keycnt] = String(H_prtelno[keycnt]).replace(/-()/g, "");
									}

									if (-1 !== H_prtelno.indexOf(String(chkmnptel)) == true) {
										if ("ENG" == H_g_sess.language) {
											H_telinfo["telno" + idx].alert = "This telephone number is registered as a parent number. <br>Contact the person in charge.";
										} else {
											H_telinfo["telno" + idx].alert = "\u3053\u306E\u96FB\u8A71\u306F\u89AA\u756A\u53F7\u3068\u3057\u3066\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002<br>\u62C5\u5F53\u8005\u306B\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044";
										}
									} else //親番号でなければMNP許可
										//公私分計情報を加工（tel_tbのkousiflgが0→order_teldetail_tbのkousiradioがon、tel_tbのkousiflgが1→order_teldetail_tbのkousiradioがoff）20060207miya
										{
											H_telinfo["telno" + idx] = result;

											if (H_telinfo["telno" + idx].kousiflg != "" && H_telinfo["telno" + idx].kousiflg == 0) {
												H_telinfo["telno" + idx].kousiradio = "on";
											} else if (H_telinfo["telno" + idx].kousiflg != "" && H_telinfo["telno" + idx].kousiflg == 1) {
												H_telinfo["telno" + idx].kousiradio = "off";
											}

											if (H_telinfo["telno" + idx].kousiptn != "") {
												H_telinfo["telno" + idx].kousi = H_telinfo["telno" + idx].kousiptn;
											}
										}

									var H_penalty = this.O_telmodel.chkPenalty(H_g_sess.pactid, chkmnptel, value.formercarid);

									if (true == Array.isArray(H_penalty)) {
										H_telinfo["telno" + idx].penalty = H_penalty;
									}

									if (undefined == base_postid && true == (undefined !== H_telinfo["telno" + idx].postid)) {
										base_postid = H_telinfo["telno" + idx].postid;
									} else {
										if (undefined != H_telinfo["telno" + idx].postid && base_postid != H_telinfo["telno" + idx].postid) {
											if ("ENG" == H_g_sess.language) {
												H_telinfo["telno" + idx].alert = "MNP is not available with the telephones registered to different departments.";
											} else {
												H_telinfo["telno" + idx].alert = "\u7570\u306A\u308B\u90E8\u7F72\u306B\u767B\u9332\u3055\u308C\u305F\u96FB\u8A71\u3092\u4E00\u5EA6\u306BMNP\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093";
											}
										}
									}

									if (this.orderByCategoryFlag && !H_telinfo["telno" + idx].alert) {
										if (H_telinfo["telno" + idx].division !== this.orderByCategoryPattern) {
											switch (this.orderByCategoryPattern) {
												case 1:
													H_telinfo["telno" + idx].alert = "\u696D\u52D9\u7528\u3067\u306F\u3042\u308A\u307E\u305B\u3093";
													break;

												case 2:
													H_telinfo["telno" + idx].alert = "\u30C7\u30E2\u7528\u3067\u306F\u3042\u308A\u307E\u305B\u3093";
													break;
											}
										}
									}
								} else //自部署に存在しないときは電話番号の検索を会社内でやり直す
								{
									var result_without_post = this.get_DB().queryRowHash(base_sql + car_sql);

									if (result_without_post != "") //自部署以外に電話番号があればMNPさせない
										{
											if ("ENG" == H_g_sess.language) {
												H_telinfo["telno" + idx].alert = "MNP is not available with the telephone registered to other department.";
											} else {
												H_telinfo["telno" + idx].alert = "\u4ED6\u90E8\u7F72\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u96FB\u8A71\u3067MNP\u3092\u884C\u3046\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093";
											}
										} else //会社内にも電話が存在しない時は他キャリアで登録されてないか見る
										{
											var result_without_car = this.get_DB().queryRowHash(base_sql);

											if (result_without_car != "") //注文画面で「前のキャリア」で選ばれたキャリア以外のキャリアに番号が存在する場合、エラー
												{
													if ("ENG" == H_g_sess.language) {
														H_telinfo["telno" + idx].alert = "Previous carrier is invalid.";
													} else {
														H_telinfo["telno" + idx].alert = "\u5143\u306E\u30AD\u30E3\u30EA\u30A2\u304C\u9055\u3044\u307E\u3059";
													}
												} else //電話管理に存在しない電話番号はハイフンを除いた状態で11文字かつ半角数字とハイフン以外は入力不可 20130206 hoshi
												{
													if (11 != chkmnptel.length || true == preg_match("/[^0-9]/", chkmnptel)) {
														if (11 != chkmnptel.length) {
															if ("ENG" == H_g_sess.language) {
																H_telinfo["telno" + idx].alert = "\u96FB\u8A71\u756A\u53F7\u304C11\u6841\u3067\u306F\u3042\u308A\u307E\u305B\u3093\uFF08\u30CF\u30A4\u30D5\u30F3\u9664\u304F\uFF09";
															} else {
																H_telinfo["telno" + idx].alert = "\u96FB\u8A71\u756A\u53F7\u304C11\u6841\u3067\u306F\u3042\u308A\u307E\u305B\u3093\uFF08\u30CF\u30A4\u30D5\u30F3\u9664\u304F\uFF09";
															}
														} else {
															if ("ENG" == H_g_sess.language) {
																H_telinfo["telno" + idx].alert = "\u534A\u89D2\u6570\u5B57\u3068\u30CF\u30A4\u30D5\u30F3\u306E\u307F\u6709\u52B9\u3067\u3059";
															} else {
																H_telinfo["telno" + idx].alert = "\u534A\u89D2\u6570\u5B57\u3068\u30CF\u30A4\u30D5\u30F3\u306E\u307F\u6709\u52B9\u3067\u3059";
															}
														}
													} else //存在しない場合MNP許可（alertとは別にmnpalertを入れて注文フォームで表示する）
														//HLでハイフン入力が消えるので対策（$chkmnptelを$chkmnptel_orgにした） 20091117miya
														{
															if ("ENG" == H_g_sess.language) {
																H_telinfo["telno" + idx].mnpalert = "MNP is implemented with an unregistered telephone number <br>(succession of telephone information is not implemented).";
															} else {
																H_telinfo["telno" + idx].mnpalert = "\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u96FB\u8A71\u756A\u53F7\u3067MNP\u3092\u884C\u3044\u307E\u3059<br>\uFF08\u96FB\u8A71\u60C5\u5831\u306E\u5F15\u7D99\u304E\u306F\u884C\u308F\u308C\u307E\u305B\u3093\uFF09";
															}

															H_telinfo["telno" + idx].telno = chkmnptel;
															H_telinfo["telno" + idx].telno_view = chkmnptel_org;
														}
												}
										}
								}
						}

					idx++;
				}
		}

		return H_telinfo;
	}

	getRecogpostid(H_sess, H_g_sess) //POSTが来たとき
	//配列をユニークにする
	{
		H_mnp;
		var A_postid = Array();

		if (true == (undefined !== H_sess.SELF) && H_sess.SELF != undefined) //それぞれの電話の部署IDを取る
			//POSTがなくてtelinfoがあるとき(戻り時）
			{
				{
					let _tmp_3 = H_sess.SELF;

					for (var key in _tmp_3) //$H_mnpは以下の形に整形される
					//array
					//0 =>
					//array
					//'telno' => string '09000000022' (length=11)
					//'formercarid' => string '3' (length=1)
					//'mnpno' => string 'test' (length=4)
					{
						var val = _tmp_3[key];
						var key = key.replace(/\_/g, "");
						var key_name = key.substr(0, key.length - 1);
						var key_no = ltrim(key, key_name);
						H_mnp[key_no][key_name] = val;
					}
				}

				for (var kno in H_mnp) {
					var A_vr = H_mnp[kno];
					var telno = "";
					telno = A_vr.telno.replace(/ /g, "");
					telno = telno.replace(/\-/g, "");
					telno = telno.replace(/\(/g, "");
					telno = telno.replace(/\)/g, "");

					if ("" != telno && "" != A_vr.formercarid) {
						var sql = "SELECT postid FROM tel_tb WHERE telno='" + telno + "' AND carid=" + A_vr.formercarid + " AND pactid=" + H_g_sess.pactid;
						var result = this.get_DB().queryOne(sql);

						if ("" != result) {
							A_postid.push(result);
						}
					}
				}
			} else if ((false == (undefined !== H_sess.SELF) || H_sess.SELF == undefined) && (true == (undefined !== H_sess[OrderTelInfoModel.PUB].telinfo) && H_sess[OrderTelInfoModel.PUB].telinfo != undefined && true == Array.isArray(H_sess[OrderTelInfoModel.PUB].telinfo))) //どちらもなければfalseを返す
			{
				{
					let _tmp_4 = H_sess[OrderTelInfoModel.PUB].telinfo;

					for (var tk in _tmp_4) {
						var A_tv = _tmp_4[tk];

						if (true == (undefined !== A_tv.postid) && "" != A_tv.postid) {
							A_postid.push(A_tv.postid);
						}
					}
				}
			} else {
			return false;
		}

		A_postid = array_unique(A_postid);
		return A_postid;
	}

	checkTelInfoOrderType(H_tel, H_sess, H_g_sess) //回線種別名の英語化 20090428miya
	//警告
	{
		if ("ENG" == H_g_sess.language) {
			var cirname_str = "cirname_eng AS cirname";
		} else {
			cirname_str = "cirname";
		}

		if (false == (undefined !== H_tel) || H_tel == undefined) {
			return false;
		}

		var A_alert = Array();

		for (var key in H_tel) //解約，名義変更以外は回線種別をチェックする
		{
			var val = H_tel[key];

			if (preg_match("/(D|T|Tcp|Tpc|Tcc)/", H_sess["/MTOrder"].type) == false) //既にエラーメッセージがあった場合はそのまま表示
				{
					if (H_tel[key].alert != "") {
						A_alert[key].alert = H_tel[key].alert;
					} else //移行の場合は(DoCoMoならFOMA，MOVA / auならCDMA1x,WIN)が通るようにする．それ以外は回線種別が同一でないとだめ
						{
							if (H_sess["/MTOrder"].type == "S") //回線種別の混在をチェック
								//プラン変更の場合は回線種別の混在をチェック
								{
									if ("" != H_tel[key].cirid && H_tel[key].cirid != H_tel.telno0.cirid) //一件目の回線種別と比較
										//エラーメッセージ
										{
											if ("ENG" == H_g_sess.language) {
												A_alert[key].alert = "Telephone with a different service type is mixed.";
											} else {
												A_alert[key].alert = "\u7570\u306A\u308B\u56DE\u7DDA\u7A2E\u5225\u306E\u96FB\u8A71\u304C\u6DF7\u5728\u3057\u3066\u3044\u307E\u3059";
											}
										} else {
										if (ereg(H_tel[key].cirid, this.getSetting().shift_cir) == false || H_sess["/MTOrder"].carid != H_tel[key].carid) //回線種別名を取得する
											//エラーメッセージ
											{
												var sql = "SELECT " + cirname_str + " FROM circuit_tb WHERE cirid IN (" + this.getSetting().shift_cir + ") AND carid=" + H_sess["/MTOrder"].carid;
												var A_name = this.get_DB().queryCol(sql);

												if ("ENG" == H_g_sess.language) {
													A_alert[key].alert = "This telephone number is not of " + join(", ", A_name) + ".";
												} else {
													A_alert[key].alert = "\u3053\u306E\u756A\u53F7\u306F" + join("\u307E\u305F\u306F", A_name) + "\u3067\u306F\u3042\u308A\u307E\u305B\u3093";
												}
											} else //移行する回線種別を取り出しセッションに入れる
											{
												var regx = "/(,|" + H_tel[key].cirid + ")/";
												H_sess["/MTOrder"].shift_cirid = preg_replace(regx, "", this.getSetting().shift_cir);
											}
									}
								} else if (true == (-1 !== ["P", "Ppl", "Pdc", "Pop", "C"].indexOf(H_sess["/MTOrder"].type))) {
								if (H_sess["/MTOrder"].type == "C") {
									this.getSetting().loadConfig("order");

									if (this.getSetting().existsKey("A_not_change_cirid")) {
										var not_change_cirid = this.getSetting().A_not_change_cirid;

										if (-1 !== not_change_cirid.indexOf(H_tel[key].cirid)) {
											if ("ENG" == H_g_sess.language) {
												A_alert[key].alert = "Can not order this telephone number";
											} else {
												A_alert[key].alert = this.getSetting().not_change_error;
											}

											continue;
										}
									}
								}

								if ("" != H_tel[key].cirid && H_tel[key].cirid != H_tel.telno0.cirid) //一件目の回線種別と比較
									//エラーメッセージ
									{
										if ("ENG" == H_g_sess.language) {
											A_alert[key].alert = "Telephone with a different service type is mixed.";
										} else {
											A_alert[key].alert = "\u7570\u306A\u308B\u56DE\u7DDA\u7A2E\u5225\u306E\u96FB\u8A71\u304C\u6DF7\u5728\u3057\u3066\u3044\u307E\u3059";
										}
									}
							} else {
								if (H_sess["/MTOrder"].cirid != H_tel[key].cirid || H_sess["/MTOrder"].carid != H_tel[key].carid) //エラーメッセージ
									{
										sql = "SELECT " + cirname_str + " FROM circuit_tb WHERE cirid=" + H_sess["/MTOrder"].cirid + " AND carid=" + H_sess["/MTOrder"].carid;
										var name = this.get_DB().queryOne(sql);

										if ("ENG" == H_g_sess.language) {
											A_alert[key].alert = "Service type is different. This telephone number is not of" + name + ".";
										} else {
											A_alert[key].alert = "\u56DE\u7DDA\u7A2E\u5225\u304C\u7570\u306A\u308A\u307E\u3059\u3002\u3053\u306E\u756A\u53F7\u306F" + name + "\u3067\u306F\u3042\u308A\u307E\u305B\u3093";
										}
									}
							}
						}
				}
		}

		return A_alert;
	}

	getTelInfo(telno, pactid, type, carid) //SQL文
	//移行のプラン・オプション入力方式変更のため「現状引き継ぎ」の場合のプラン名を取得
	{
		telno = str_replace("-", "", telno);
		var sql = "SELECT telno_view, postid, arid, carid, cirid, userid, username, username AS telusername, employeecode, mail, planid, packetid, " + "text1, text2, text3, text4, text5, text6, text7, text8, text9, text10, text11, text12, text13, text14, text15, int1, int2, int3, " + "int4, int5, int6, date1, date2, date3, date4, date5, date6, mail1, mail2, mail3, url1, url2, url3, " + "select1, select2, select3, select4, select5, select6, select7, select8, select9, select10, " + "memo, kousiflg, kousiptn " + "FROM tel_tb WHERE telno='" + telno + "' AND pactid=" + pactid + " AND carid=" + carid;
		var H_telinfo = this.get_DB().queryRowHash(sql);

		if ("S" == type && 1 == carid && true == (-1 !== [1, 2].indexOf(H_telinfo.cirid)) && "" != H_telinfo.planid) {
			var toplanname = this.getToPlan(H_telinfo.planid);

			if (toplanname != "") {
				H_telinfo.toplanname = toplanname;
			}
		}

		return H_telinfo;
	}

	getToPlan(fromplanid) {
		var sql = "SELECT pl.planname FROM plan_tb pl, docomo_plan_shift_tb dps WHERE dps.fromplan=" + fromplanid + " AND dps.toplan=pl.planid";
		return this.get_DB().queryOne(sql);
	}

	getPostArea(pactid, postid, carid) //SQL文
	{
		var sql = "SELECT DISTINCT sh_car.arid FROM shop_carrier_tb sh_car, shop_relation_tb sh_rel " + "WHERE sh_rel.shopid=sh_car.shopid AND sh_rel.carid=sh_car.carid " + "AND sh_rel.pactid=" + pactid + " AND sh_rel.postid=" + postid + " AND sh_rel.carid=" + carid;
		return this.get_DB().queryOne(sql);
	}

	getTelProperty(pactid) //数値型、日付型、文字列型の順番なので並べ替えをする
	//ksort($H_property);
	{
		var sql = "SELECT col, colname FROM management_property_tb " + "WHERE " + "pactid=" + pactid + " AND mid=1" + " ORDER BY sort";
		var A_db = this.get_DB().queryAssoc(sql);
		var H_property = Array();

		for (var key in A_db) {
			var val = A_db[key];

			if (1 == preg_match("/^text(\\d{1}|\\d{2})/", key)) {
				H_property["1text_" + key.replace(/[^0-9]/g, "")] = val;
			} else if (1 == preg_match("/^int(\\d{1}|\\d{2})/", key)) {
				H_property["2int_" + key.replace(/[^0-9]/g, "")] = val;
			} else if (1 == preg_match("/^date(\\d{1}|\\d{2})/", key)) {
				H_property["3date_" + key.replace(/[^0-9]/g, "")] = val;
			} else if (1 == preg_match("/^mail(\\d{1}|\\d{2})/", key)) {
				H_property["4mail_" + key.replace(/[^0-9]/g, "")] = val;
			} else if (1 == preg_match("/^url(\\d{1}|\\d{2})/", key)) {
				H_property["5url_" + key.replace(/[^0-9]/g, "")] = val;
			} else if (1 == preg_match("/^select(\\d{1}|\\d{2})/", key)) {
				var temp = val.split(":");
				H_property["6select_" + key.replace(/[^0-9]/g, "")] = temp[0];
			}
		}

		for (var key in H_property) {
			var val = H_property[key];
			var keyname = key.replace(/^./g, "");
			keyname = keyname.replace(/_0/g, "");
			keyname = keyname.replace(/_/g, "");
			H_property[keyname] = val;
			delete H_property[key];
		}

		return H_property;
	}

	getKousi(pactid, carid) //DB接続エラーを検出してエラーメッセージを出力
	{
		var sql = "SELECT kousi.patternid, kousi.patternname, kousidef.kousiflg FROM kousi_pattern_tb kousi " + "INNER JOIN kousi_rel_pact_tb kousirel ON kousi.patternid = kousirel.patternid " + "LEFT OUTER JOIN kousi_default_tb kousidef ON kousi.patternid = kousidef.patternid " + "WHERE kousirel.pactid=" + pactid + " AND kousirel.carid=" + carid + " " + "ORDER BY kousidef.kousiflg, kousi.patternid";
		return this.get_DB().queryHash(sql);
	}

	makeTelDetailDefaultValue(H_sess) {
		var sql = "";
		return this.get_DB().queryHash(sql);
	}

	getPortableCarrier(carid = false, eng = false) //caridが指定されていればそのキャリアは返さない
	//英語化 20090428miya
	{
		if (carid != false) {
			var A_carid = Array();
			{
				let _tmp_5 = this.O_Set.A_potable_carid;

				for (var cnt in _tmp_5) {
					var content = _tmp_5[cnt];

					if (carid != this.O_Set.A_potable_carid[cnt]) {
						A_carid.push(content);
					}
				}
			}
		} else {
			A_carid.push(content);
		}

		if (true == eng) {
			var carname_str = "carname_eng AS carname";
		} else {
			carname_str = "carname";
		}

		if (A_carid.length == 0) {
			return Array();
		}

		var sql = "SELECT carid, " + carname_str + " FROM carrier_tb WHERE carid IN (";

		for (var cnt in A_carid) {
			var cont = A_carid[cnt];

			if (cnt == 0) {
				sql += A_carid[cnt];
			} else {
				sql += ", " + A_carid[cnt];
			}
		}

		sql += ") ORDER BY carid";
		var A_carrier = this.get_DB().queryAssoc(sql);
		return A_carrier;
	}

	mnpExistCheck(telno, pactid, carid) {
		var A_carid = getCarrier(carid);
		var cnt = 0;
		var sql = "SELECT count(*) FROM tel_tb WHERE telno='" + telno + "' AND pactid=" + pactid + " AND carid IN (";

		for (var key in A_carid) {
			var cont = A_carid[key];

			if (cnt == 0) {
				sql += key;
				cnt++;
			} else {
				sql += ", " + key;
			}
		}

		sql += ")";
		var result = this.get_DB().queryOne(sql);
		return result;
	}

	getAreatoCarrier(carid) {
		switch (carid) {
			case 1:
				var temp = 4;
				break;

			case 2:
				temp = 31;
				break;

			case 3:
				temp = 13;
				break;

			case 4:
				temp = 26;
				break;

			case 15:
				temp = 46;
				break;

			case 28:
				temp = 59;
				break;

			default:
				temp = 100;
				break;
		}

		return temp;
	}

	__destruct() {
		super.__destruct();
	}

};