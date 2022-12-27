//
//電話番号に関する情報を取得するモデル
//
//@uses ModelBase
//@uses MtTableUtil
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/01
//
//
//
//テーブルに関する情報を取得するモデル
//
//@uses ModelBase
//@uses MtTableUtil
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/01
//

require("ModelBase.php");

require("MtTableUtil.php");

//
//主に使用するテーブル名(tel_XX_tb)
//
//@var string
//@access private
//
//
//主に使用するテーブル名(tel_details_XX_tb)
//
//@var string
//@access private
//
//
//主に使用するテーブル名(tel_details_XX_tb)
//
//@var string
//@access private
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
//英数以外の文字を削除して返す<br>
//static呼び出し可能
//
//@author ishizaki
//@since 2008/04/01
//
//@param string $telno
//@access public
//@return string
//
//
//登録されている電話番号を取得する
//
//@author maeda
//@since 2008/04/11
//
//@param mixed $pactid 契約ＩＤ
//@param mixed $tableno 対象テーブルＮＯ
//@param array $A_carid 対象carid
//@access public
//@return array(CARID => array(telno))
//
//更新履歴
//現在テーブルにも対応 2008/07/30 s.maeda
//
//
//電話の所属している部署のシステム部署ＩＤとユーザ部署ＩＤを取得する
//
//@author maeda
//@since 2009/04/09
//
//@param mixed $pactid
//@param mixed $tableno
//@param mixed $cardi
//@access public
//@return void
//
//
//キャリアが異なる同一電話番号で部署ＩＤが全て同じ電話番号のリストを取得する
//
//@author maeda
//@since 2008/08/05
//
//@param mixed $pactid 契約ＩＤ
//@param mixed $tableno 対象テーブルＮＯ
//@param array $A_carid 対象carid
//@access public
//@return array(telno => postid)
//
//
//tel_details_XX_tb から対応pactidのレコードを抜き出す
//
//@author ishizaki
//@since 2008/04/01
//
//@param integer $pactid
//@param string $yyyymm
//@param string $add_where
//@access public
//@return Array
//
//
//tel_details_XX_tbから、ポイントフラグがついた請求情報のみ抜き出す
//
//@author ishizaki
//@since 2008/04/09
//
//@param mixed $pactid
//@param mixed $yyyymm
//@param mixed $add_where
//@access public
//@return void
//
//
//対象顧客のauの請求情報から各電話の合計金額のみを取得する
//
//@author ishizaki
//@since 2008/04/11
//
//@param mixed $pactid
//@param mixed $yyyymm
//@param mixed $carid
//@access public
//@return void
//
//
//AUの請求情報から各電話の合計金額を取得する
//
//@author ishizaki
//@since 2008/04/11
//
//@param mixed $pactid
//@param mixed $yyyymm
//@param mixed $add_where
//@access public
//@return void
//
//
//getTelDetailsPointflagDataに caridのWHERE句を足して実行する
//
//@author ishizaki
//@since 2008/04/08
//
//@param mixed $pactid
//@param mixed $yyyymm
//@param mixed $carid
//@access public
//@return void
//
//
//point_tb からaddpointを返す
//
//@author ishizaki
//@since 2008/04/23
//
//@param mixed $pactid
//@param mixed $telno
//@param mixed $carid
//@param mixed $yyyymm
//@access public
//@return void
//
//
//WHERE句にcarid を追加して返す
//
//@author ishizaki
//@since 2008/04/08
//
//@param integer $carid
//@param string $where
//@access private
//@return string
//
//
//tel_details_XX_tb から対応pactidのレコードを削除し件数を返す
//
//@author ishizaki
//@since 2008/04/04
//
//@param integer $pactid
//@param string $yyyymm
//@param string $add_where
//@access public
//@return integer
//
//
//調整後のデータを更新する
//
//更新が成功すると true
//
//@author ishizaki
//@since 2008/04/04
//
//@param string $yyyymm
//@param array $A_details
//@access public
//@return true
//
//
//指定された電話会社、電話番号がtel_tbに存在するかチェックする
//
//@author maeda
//@since 2008/08/08
//
//@param mixed $pactid 契約ＩＤ
//@param mixed $telno 電話番号
//@param mixed $carid 電話会社
//@access public
//@return 成功：指定された電話会社、電話番号で存在した場合 => 2 を返す
//指定された電話会社以外で電話番号が存在した場合 => 1 を返す
//指定された電話会社以外でも電話が存在しなかった場合 => 0 を返す
//失敗：false
//
//
//料金プラン、オプション、割引サービス、買い方で違約金が発生するかチェックする
//
//@author maeda
//@since 2008/08/13
//
//@param mixed $pactid 契約ＩＤ
//@param mixed $telno 電話番号
//@param mixed $carid 電話会社
//@access public
//@return 成功：違約金チェック結果の連想配列
//array("plan" => array("judge" => 0:違約金発生無し、1:違約金発生有り),
//array("option" => array("judge" => 0:違約金発生無し、1:違約金発生有り),
//array("buyselect" => array("judge" => 0:違約金発生無し、1:違約金発生有り, "charge" => 違約金))
//失敗：false
//
//
//割賦の完済月の翌月を返す
//
//@author igarashi
//@since 2008/11/04
//
//@param $pactid
//@param $carid
//@param $telno
//@param $H_date
//
//@access public
//@return string
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
class TelModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
		this.TelTable = "tel_tb";
		this.TelDetailsTable = "tel_details_tb";
		this.UtiwakeTable = "utiwake_tb";
	}

	telnoFromTelview(telno) {
		return telno.replace(/[^a-zA-Z0-9]/g, "");
	}

	getCaridTelno(pactid, tableno = undefined, A_carid = Array()) //現在テーブル
	//carid 指定があった場合
	//レコード数
	//１行ずつ処理し連想配列に格納する array(CARID => array(telno))
	//carid 指定があった場合
	{
		var H_dbData = Array();

		if (undefined == tableno) //過去テーブル
			{
				var tableName = "tel_tb";
			} else {
			tableName = "tel_" + tableno + "_tb";
		}

		var sql = "select carid,telno " + "from " + tableName + " " + "where pactid = " + pactid + " ";

		if (0 != A_carid.length) {
			sql += "and carid in (" + A_carid.join(",") + ") ";
		}

		sql += "order by carid,telno";
		var H_result = this.getDB().queryHash(sql);
		var recCnt = H_result.length;

		for (var recCounter = 0; recCounter < recCnt; recCounter++) {
			if (false == (undefined !== H_dbData[H_result[recCounter].carid])) {
				H_dbData[H_result[recCounter].carid] = [H_result[recCounter].telno];
			} else {
				H_dbData[H_result[recCounter].carid].push(H_result[recCounter].telno);
			}
		}

		if (0 != A_carid.length) //登録がないキャリアは空の配列を作成
			{
				for (var carid of Object.values(A_carid)) {
					if (undefined !== H_dbData[carid] == false) {
						H_dbData[carid] = Array();
					}
				}
			}

		return H_dbData;
	}

	getPostInfo(pactid, tableno = undefined, carid) //現在テーブル
	//レコード数
	//検索結果が０件でない場合
	{
		var H_dbData = Array();

		if (undefined == tableno) //過去テーブル
			{
				var tel_tb = "tel_tb";
				var post_tb = "post_tb";
			} else {
			tel_tb = "tel_" + tableno + "_tb";
			post_tb = "post_" + tableno + "_tb";
		}

		var sql = "select te.telno,po.postid,po.userpostid,te.text1 " + "from " + tel_tb + " te inner join " + post_tb + " po on te.pactid = po.pactid and te.postid = po.postid " + "where te.pactid = " + pactid + " and " + "te.carid = " + carid + " " + "order by telno,postid";
		var H_result = this.getDB().queryHash(sql);
		var recCnt = H_result.length;

		if (0 != recCnt) {
			for (var cnt = 0; cnt < recCnt; cnt++) //枝番除去
			{
				var telno = H_result[cnt].telno;
				telno = str_replace(this.getSetting().LINE_BRANCH_TKY, "", telno);
				telno = str_replace(this.getSetting().LINE_BRANCH_OSK, "", telno);
				H_dbData[H_result[cnt].text1][telno] = {
					postid: H_result[cnt].postid,
					userpostid: H_result[cnt].userpostid
				};
			}
		}

		return H_dbData;
	}

	getTelnoPostid(pactid, tableno = undefined, A_carid = Array()) //現在テーブル
	//レコード数
	//検索結果が０件でない場合
	{
		var H_dbData = Array();

		if (undefined == tableno) //過去テーブル
			{
				var tableName = "tel_tb";
			} else {
			tableName = "tel_" + tableno + "_tb";
		}

		var sql = "select distinct telno,postid " + "from " + tableName + " " + "where pactid = " + pactid + " ";

		if (0 != A_carid.length) {
			sql += "and carid in (" + A_carid.join(",") + ") ";
		}

		sql += "order by telno,postid";
		var H_result = this.getDB().queryHash(sql);
		var recCnt = H_result.length;

		if (0 != recCnt) //キャリアが異なる同一電話番号で異なる部署ＩＤがあるかどうか（true:無い、false:有る）
			//１行ずつ処理し連想配列に格納する array(telno => postid)
			//最終行の処理
			{
				var uniqFlg = true;

				for (var recCounter = 0; recCounter < recCnt; recCounter++) //最初の行以外
				{
					if (0 != recCounter) //１件前と電話番号が異なる場合
						{
							if (oldTelno != H_result[recCounter].telno) //キャリアが異なる同一電話番号で異なる部署ＩＤが無い場合
								{
									if (true == uniqFlg) {
										H_dbData[oldTelno] = oldPostid;
									} else {
										uniqFlg = true;
									}
								} else {
								uniqFlg = false;
							}
						}

					var oldTelno = H_result[recCounter].telno;
					var oldPostid = H_result[recCounter].postid;
				}

				if (true == uniqFlg) {
					H_dbData[oldTelno] = oldPostid;
				}

				return H_dbData;
			}
	}

	getTelDetailsData(pactid, yyyymm, add_where = "") //WHERE句を追加する
	{
		var tablename = MtTableUtil.makeTableName(this.TelDetailsTable, MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT * FROM " + tablename + " WHERE pactid = " + this.get_DB().dbQuote(pactid, "integer");
		sql += add_where;
		return this.get_DB().queryHash(sql);
	}

	getTelDetailsPointflagData(pactid, yyyymm, add_where = undefined) {
		var tablename = MtTableUtil.makeTableName(this.TelDetailsTable, MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT tel.telno, sum(tel.charge) AS charge FROM " + tablename + " tel " + "INNER JOIN utiwake_tb uti ON tel.code = uti.code and tel.carid = uti.carid " + "WHERE tel.pactid = " + this.get_DB().dbQuote(pactid, "integer") + " AND uti.point = true ";
		sql += add_where;
		sql += " GROUP BY tel.telno ORDER BY tel.telno";
		return this.get_DB().queryHash(sql);
	}

	getTelDetailsPointAU(pactid, yyyymm, carid) {
		var where = "";
		where = this.addWhereCarid(carid, where);
		return this.getTelDetailsTotalAU(pactid, yyyymm, where);
	}

	getTelDetailsTotalAU(pactid, yyyymm, add_where = undefined) {
		var tablename = MtTableUtil.makeTableName(this.TelDetailsTable, MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName(this.TelTable, MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT tel.telno, tel.charge, te.planid FROM " + tablename + " tel " + "INNER JOIN " + tel_tb + " te ON tel.telno = te.telno AND tel.pactid = te.pactid AND tel.carid = te.carid " + "WHERE tel.pactid = " + this.get_DB().dbQuote(pactid, "integer") + " " + "AND tel.code = " + this.get_DB().dbQuote(this.getSetting().suo_au_totalcode, "string") + add_where;
		return this.get_DB().queryHash(sql);
	}

	getTelDetailsPointflagCar(pactid, yyyymm, carid) {
		var where = "";
		where = this.addWhereCarid(carid, where);
		return this.getTelDetailsPointflagData(pactid, yyyymm, where);
	}

	getTelAddPoint(pactid, telno, carid, yyyymm) {
		var tablename = MtTableUtil.makeTableName(this.TelTable, MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT pt.addpoint" + " FROM " + tablename + " tel" + " INNER JOIN point_tb pt ON tel.pointstage = pt.pointid AND tel.carid = pt.pointid" + " WHERE tel.pactid = " + this.get_DB().dbQuote(pactid, "integer") + " AND tel.carid = " + this.get_DB().dbQuote(carid, "integer") + " AND tel.telno = " + this.get_DB().dbQuote(telno, "string");
		var tmp = this.get_DB().queryHash(sql);

		if (false == (undefined !== tmp[0].addpoint)) {
			return this.getSetting().suo_docomo_default_point;
		}

		return tmp[0].addpoint;
	}

	addWhereCarid(carid, where = "") {
		return where + " AND tel.carid = " + this.get_DB().dbQuote(carid, "integer");
	}

	delTelDetailsData(pactid, yyyymm, add_where = undefined) {
		var tablename = MtTableUtil.makeTableName(this.TelDetailsTable, MtTableUtil.getTableNo(yyyymm));
		var sql = "DELETE FROM " + tablename + " WHERE pactid = " + pactid;

		if (false == is_null(add_where)) {
			sql += add_where;
		}

		return this.get_DB().exec(sql);
	}

	insertCopyTelDetailsData(yyyymm, A_details) {
		var tablename = MtTableUtil.makeTableName(this.TelDetailsTable, MtTableUtil.getTableNo(yyyymm));
		return this.get_DB().pgCopyFromArray(tablename, A_details);
	}

	chkCarid(pactid, telno, carid) //パラメータチェック
	//検索成功
	{
		if ("" == +(pactid || "" == String(telno || "" == +carid))) {
			return false;
		}

		var sql = "select carid " + "from tel_tb " + "where pactid = " + pactid + " " + "and telno = '" + telno + "' " + "order by carid";
		var H_result = this.getDB().queryHash(sql);

		if (PEAR.isError(H_result) == false) //レコード数
			//指定された電話会社以外にも電話番号が存在しない
			//検索失敗
			{
				var recCnt = H_result.length;

				if (0 == recCnt) {
					return 0;
				} else //指定された電話会社とは別の電話会社に電話番号が存在していた場合
					{
						for (var recCounter = 0; recCounter < recCnt; recCounter++) //指定された電話会社に電話番号が存在していた場合
						{
							if (H_result[recCounter].carid == +carid) {
								return 2;
							}
						}

						return 1;
					}
			} else {
			return false;
		}
	}

	chkPenalty(pactid, telno, carid) //パラメータチェック
	//検索成功
	{
		var H_rtn = Array();

		if ("" == +(pactid || "" == String(telno || "" == +carid))) {
			return false;
		}

		var sql = "select planid,options,discounts,buyselid,date(orderdate) as orderdate " + "from tel_tb " + "where pactid = " + pactid + " " + "and telno = '" + telno + "' " + "and carid = " + carid;
		var H_result = this.getDB().queryHash(sql);

		if (PEAR.isError(H_result) == false) //レコード数
			//指定された電話番号が存在しない
			//検索失敗
			{
				var recCnt = H_result.length;

				if (0 == recCnt) {
					H_rtn.plan.judge = 0;
					H_rtn.option.judge = 0;
					H_rtn.buyselect.judge = 0;
					H_rtn.buyselect.charge = 0;
				} else //プランが登録されていない場合
					//オプションと割引サービスの両方が登録されていない場合
					//買い方が登録されていない場合
					{
						if ("" == +H_result[0].planid) //プランが登録されている場合
							{
								H_rtn.plan.judge = 0;
							} else //違約金の発生する可能性があるプランかをチェックする
							//検索成功
							{
								sql = "select penaltyflg from plan_tb where planid = " + H_result[0].planid;
								var rtnPlan = this.getDB().queryOne(sql);

								if (PEAR.isError(rtnPlan) == false) //違約金発生なし
									//検索失敗
									{
										if (false == rtnPlan) //違約金発生あり
											{
												H_rtn.plan.judge = 0;
											} else {
											H_rtn.plan.judge = 1;
										}
									} else {
									return false;
								}
							}

						if ("" == String(H_result[0].options && "" == String(H_result[0].discounts))) //オプションと割引サービスのどちらか一方でもが登録されている場合
							{
								H_rtn.option.judge = 0;
							} else {
							var A_option = Array();

							if ("" != String(H_result[0].options)) {
								A_option = array_merge(A_option, Object.keys(unserialize(H_result[0].options)));
							}

							if ("" != String(H_result[0].discounts)) {
								A_option = array_merge(A_option, Object.keys(unserialize(H_result[0].discounts)));
							}

							if (0 != A_option.length) //違約金の発生する可能性があるオプションかをチェックする
								//検索成功
								{
									sql = "select count(*) from option_tb " + "where opid in (" + A_option.join(",") + ") " + "and penaltyflg = true";
									var rtnOption = this.getDB().queryOne(sql);

									if (PEAR.isError(rtnOption) == false) //違約金発生なし
										//検索失敗
										{
											if (0 == rtnOption) //違約金発生あり
												{
													H_rtn.option.judge = 0;
												} else {
												H_rtn.option.judge = 1;
											}
										} else {
										return false;
									}
								} else {
								H_rtn.option.judge = 0;
							}
						}

						if ("" == +H_result[0].buyselid) //プランが登録されている場合
							{
								H_rtn.buyselect.judge = 0;
								H_rtn.buyselect.charge = 0;
							} else //違約金の発生する可能性がある買い方かをチェックする
							//検索成功
							{
								sql = "select penaltyflg from buyselect_tb where buyselid = " + H_result[0].buyselid;
								var rtnBuysel = this.getDB().queryOne(sql);

								if (PEAR.isError(rtnBuysel) == false) //違約金が発生しない買い方
									//検索失敗
									{
										if (false == rtnBuysel) //違約金が発生する買い方
											{
												H_rtn.buyselect.judge = 0;
												H_rtn.buyselect.charge = 0;
											} else //購入日が登録されていない場合
											{
												if ("" == H_result[0].orderdate) {
													H_rtn.buyselect.judge = 0;
													H_rtn.buyselect.charge = 0;
												} else //経過月数の計算方法
													//docomo：購入日の翌月末までが１ヶ月目。購入日が１日の場合は当月末までが１ヶ月目。
													//au：購入日の当月末までが１ヶ月目。
													//emobile：購入日の翌月末までが１ヶ月目。
													//現在日を配列へ格納
													//購入日を配列へ格納
													//購入日から経過月数を取得
													//購入日の登録が未来月だった場合は警告は出さない
													//違約金を取得
													//検索成功
													{
														var A_now = split("-", this.getDB().getToday());
														var A_orderDate = split("-", H_result[0].orderdate);
														var span = +(A_now[0] - +A_orderDate[0]) * 12 + +(A_now[1] - +A_orderDate[1]);

														if (span < 0) //購入日の登録が現在月以前だった場合
															{
																H_rtn.buyselect.judge = 0;
																H_rtn.buyselect.charge = 0;
															} else //購入日と現在が同月の場合は経過月数は１にする
															{
																if (0 == span) //購入日と現在の月が異なる場合
																	{
																		span = 1;
																	} else //docomoの場合
																	{
																		if (1 == carid) //購入日が１日の場合は経過月数を＋１する
																			{
																				if (1 == +A_orderDate[2]) {
																					span++;
																				}
																			} else if (3 == carid) {
																			span++;
																		}
																	}
															}

														sql = "select chargetype,charge,spanto from penalty_tb " + "where keyid = " + H_result[0].buyselid + " " + "and keyidtype = 'BS' " + "and carid = " + carid + " " + "and spanfrom <= " + span + " " + "and spanto >= " + span;
														var H_rtnPenalty = this.getDB().queryHash(sql);

														if (PEAR.isError(H_rtnPenalty) == false) //違約金無し
															//検索失敗
															{
																if (H_rtnPenalty.length == 0) //違約金有り
																	{
																		H_rtn.buyselect.judge = 0;
																		H_rtn.buyselect.charge = 0;
																	} else if (H_rtnPenalty.length == 1) //期間により固定金額の場合
																	{
																		H_rtn.buyselect.judge = 1;

																		if ("K" == H_rtnPenalty[0].chargetype) //月額計算の場合
																			{
																				H_rtn.buyselect.charge = H_rtnPenalty[0].charge;
																			} else if ("M" == H_rtnPenalty[0].chargetype) //違約金を計算する
																			{
																				H_rtn.buyselect.charge = (H_rtnPenalty[0].spanto - span + 1) * H_rtnPenalty[0].charge;
																			}
																	} else {
																	return false;
																}
															} else {
															return false;
														}
													}
											}
									} else {
									return false;
								}
							}
					}
			} else {
			return false;
		}

		return H_rtn;
	}

	getAcquittanceDate(pactid, carid, telno, H_date) //資産管理から割賦回数と割賦開始月を取得
	//割賦回数も割賦開始月も空ならすぐ削除
	{
		var sql = "SELECT " + "ast.pay_frequency, ast.pay_startdate " + "FROM " + "assets_tb ast " + "INNER JOIN tel_rel_assets_tb rel ON ast.assetsid=rel.assetsid " + "WHERE " + "rel.pactid=" + pactid + " AND rel.carid=" + carid + " AND rel.telno='" + telno + "'" + " AND rel.main_flg=true";
		var H_tel = this.get_DB().queryRowHash(sql);
		var basetime = mktime(0, 0, 0, H_date.m, H_date.d, H_date.y);

		if (undefined == H_tel.pay_frequency && undefined == H_tel.pay_startdate) {
			var month = 0;
		} else if (undefined != H_tel.pay_frequency && undefined == H_tel.pay_startdate) {
			if (1 == H_tel.pay_frequency) {
				month = 0;
			} else {
				month = +H_tel.pay_frequency;
			}
		} else if (undefined == H_tel.pay_frequency && undefined != H_tel.pay_startdate) {
			var H_temp = getdate(mktime(0, 0, 0, H_tel.pay_startdate.substr(5, 2), H_tel.pay_startdate.substr(8, 2), H_tel.pay_startdate.substr(0, 4)));
			return date("Y-m-d", mktime(0, 0, 0, H_temp.mon + 25, 1, H_temp.year));
		} else if (undefined != H_tel.pay_frequency && undefined != H_tel.pay_startdate) {
			H_temp = getdate(mktime(0, 0, 0, H_tel.pay_startdate.substr(5, 2), H_tel.pay_startdate.substr(8, 2), H_tel.pay_startdate.substr(0, 4)));
			return date("Y-m-d", mktime(0, 0, 0, H_temp.mon + +H_tel.pay_frequency + 1, 1, H_temp.year));
		} else {
			month = 0;
		}

		return date("Y-m-d", mktime(0, 0, 0, H_date.m + month, 1, H_date.y));
	}

	__destruct() {
		super.__destruct();
	}

};