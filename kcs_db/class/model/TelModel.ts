
import MtTableUtil from '../MtTableUtil';
import ModelBase from './ModelBase';
 
export default class TelModel extends ModelBase {
	TelTable: string;
	TelDetailsTable: string;
	UtiwakeTable: string;
	static telnoFromTelview: any;
	constructor(O_db = undefined) {
		super(O_db);
		this.TelTable = "tel_tb";
		this.TelDetailsTable = "tel_details_tb";
		this.UtiwakeTable = "utiwake_tb";
	}

	telnoFromTelview(telno: string) {
		return telno.replace(/[^a-zA-Z0-9]/g, "");
	}

	async getCaridTelno(pactid: string, tableno:string | undefined = undefined, A_carid = Array()) //現在テーブル
	{
		const H_dbData = Array();

		if (undefined == tableno) //過去テーブル
			{
				var tableName = "tel_tb";
			} else {
			tableName = "tel_" + tableno + "_tb";
		}

		let sql = "select carid,telno " + "from " + tableName + " " + "where pactid = " + pactid + " ";

		if (0 != A_carid.length) {
			sql += "and carid in (" + A_carid.join(",") + ") ";
		}

		sql += "order by carid,telno";
		const H_result = await this.getDB().queryHash(sql);
		const recCnt = H_result.length;

		for (let recCounter = 0; recCounter < recCnt; recCounter++) {
			if (false == (undefined !== H_dbData[H_result[recCounter].carid])) {
				H_dbData[H_result[recCounter].carid] = [H_result[recCounter].telno];
			} else {
				H_dbData[H_result[recCounter].carid].push(H_result[recCounter].telno);
			}
		}

		if (0 != A_carid.length) //登録がないキャリアは空の配列を作成
			{
				for (const carid of Object.values(A_carid)) {
					if (undefined !== H_dbData[carid] == false) {
						H_dbData[carid] = Array();
					}
				}
			}

		return H_dbData;
	}

	async getPostInfo(pactid: number, tableno: string, carid: any) //現在テーブル
	//レコード数
	{
		const H_dbData = Array();
		let tel_tb:string;
		let post_tb:string;
		if (undefined == tableno) //過去テーブル
		{
			tel_tb = "tel_tb";
			post_tb = "post_tb";
		} else {
			tel_tb = "tel_" + tableno + "_tb";
			post_tb = "post_" + tableno + "_tb";
		}

		const sql = "select te.telno,po.postid,po.userpostid,te.text1 " + "from " + tel_tb + " te inner join " + post_tb + " po on te.pactid = po.pactid and te.postid = po.postid " + "where te.pactid = " + pactid + " and " + "te.carid = " + carid + " " + "order by telno,postid";
		const H_result = await this.getDB().queryHash(sql);

		const recCnt = H_result.length;
		
		if (0 != recCnt) {
			for (let cnt = 0; cnt < recCnt; cnt++) //枝番除去
			{
				let telno = H_result[cnt].telno;
				telno = telno.replace(this.getSetting().get("LINE_BRANCH_TKY"), "");
				telno = telno.replace(this.getSetting().get("LINE_BRANCH_OSK"), "");
				H_dbData[H_result[cnt].text1][telno] = {
					postid: H_result[cnt].postid,
					userpostid: H_result[cnt].userpostid
				};
			}
		}

		return H_dbData;
	}

	async getTelnoPostid(pactid: number, tableno: string | undefined, A_carid = Array()) //現在テーブル
	//レコード数
	//検索結果が０件でない場合
	{
		const H_dbData = Array();
		let tableName:string;
		if (undefined == tableno) //過去テーブル
			{
				tableName = "tel_tb";
			} else {
				tableName = "tel_" + tableno + "_tb";
		}

		let sql = "select distinct telno,postid " + "from " + tableName + " " + "where pactid = " + pactid + " ";

		if (0 != A_carid.length) {
			sql += "and carid in (" + A_carid.join(",") + ") ";
		}

		sql += "order by telno,postid";
		const H_result = await this.getDB().queryHash(sql);
		const recCnt = H_result.length;

		if (0 != recCnt) //キャリアが異なる同一電話番号で異なる部署ＩＤがあるかどうか（true:無い、false:有る）
			//１行ずつ処理し連想配列に格納する array(telno => postid)
			{
				let uniqFlg = true;

				for (let recCounter = 0; recCounter < recCnt; recCounter++) //最初の行以外
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

	getTelDetailsData(pactid: number, yyyymm: string, add_where = "") //WHERE句を追加する
	{
		const tablename = MtTableUtil.makeTableName(this.TelDetailsTable, MtTableUtil.getTableNo(yyyymm));
		let sql = "SELECT * FROM " + tablename + " WHERE pactid = " + this.get_DB().dbQuote(pactid, "integer");
		sql += add_where;
		return this.get_DB().queryHash(sql);
	}

	getTelDetailsPointflagData(pactid: number, yyyymm:string, add_where = undefined) {
		const tablename = MtTableUtil.makeTableName(this.TelDetailsTable, MtTableUtil.getTableNo(yyyymm));
		let sql = "SELECT tel.telno, sum(tel.charge) AS charge FROM " + tablename + " tel " + "INNER JOIN utiwake_tb uti ON tel.code = uti.code and tel.carid = uti.carid " + "WHERE tel.pactid = " + this.get_DB().dbQuote(pactid, "integer") + " AND uti.point = true ";
		sql += add_where;
		sql += " GROUP BY tel.telno ORDER BY tel.telno";
		return this.get_DB().queryHash(sql);
	}

	getTelDetailsPointAU(pactid: number, yyyymm:string, carid: number) {
		let where:any = "";
		where = this.addWhereCarid(carid, where);
		return this.getTelDetailsTotalAU(pactid, yyyymm, where);
	}

	getTelDetailsTotalAU(pactid: number, yyyymm:string, add_where = undefined) {
		const tablename = MtTableUtil.makeTableName(this.TelDetailsTable, MtTableUtil.getTableNo(yyyymm));
		const tel_tb = MtTableUtil.makeTableName(this.TelTable, MtTableUtil.getTableNo(yyyymm));
		const sql = "SELECT tel.telno, tel.charge, te.planid FROM " + tablename + " tel " + "INNER JOIN " + tel_tb + " te ON tel.telno = te.telno AND tel.pactid = te.pactid AND tel.carid = te.carid " + "WHERE tel.pactid = " + this.get_DB().dbQuote(pactid, "integer") + " " + "AND tel.code = " + this.get_DB().dbQuote(this.getSetting().get("suo_au_totalcode"), "string") + add_where;
		return this.get_DB().queryHash(sql);
	}

	getTelDetailsPointflagCar(pactid: number, yyyymm:string, carid: number) {
		let where:any = "";
		where = this.addWhereCarid(carid, where);
		return this.getTelDetailsPointflagData(pactid, yyyymm, where);
	}

	getTelAddPoint(pactid: number, telno: number, carid: number, yyyymm:string) {
		const tablename = MtTableUtil.makeTableName(this.TelTable, MtTableUtil.getTableNo(yyyymm));
		const sql = "SELECT pt.addpoint" + " FROM " + tablename + " tel" + " INNER JOIN point_tb pt ON tel.pointstage = pt.pointid AND tel.carid = pt.pointid" + " WHERE tel.pactid = " + this.get_DB().dbQuote(pactid, "integer") + " AND tel.carid = " + this.get_DB().dbQuote(carid, "integer") + " AND tel.telno = " + this.get_DB().dbQuote(telno, "string");
		const tmp = this.get_DB().queryHash(sql);

		if (false == (undefined !== tmp[0].addpoint)) {
			return this.getSetting().get("suo_docomo_default_point");
		}

		return tmp[0].addpoint;
	}

	addWhereCarid(carid: number, where = "") {
		return where + " AND tel.carid = " + this.get_DB().dbQuote(carid, "integer");
	}

	delTelDetailsData(pactid: number, yyyymm: string, add_where: string) {
		const tablename = MtTableUtil.makeTableName(this.TelDetailsTable, MtTableUtil.getTableNo(yyyymm));
		let sql = "DELETE FROM " + tablename + " WHERE pactid = " + pactid;

		if (!add_where) {
			sql += add_where;
		}

		return this.get_DB().exec(sql);
	}

	insertCopyTelDetailsData(yyyymm:string, A_details: string) {
		const tablename = MtTableUtil.makeTableName(this.TelDetailsTable, MtTableUtil.getTableNo(yyyymm));
		return this.get_DB().pgCopyFromArray(tablename, A_details);
	}

	async chkCarid(pactid: string, telno: string, carid: string) //パラメータチェック
	//検索成功
	{
		if ("" == (pactid || "" == String(telno || "" == carid))) {
			return false;
		}

		const sql = "select carid " + "from tel_tb " + "where pactid = " + pactid + " " + "and telno = '" + telno + "' " + "order by carid";
		const H_result = await this.getDB().queryHash(sql);

		if (!H_result == false) //レコード数
			//指定された電話会社以外にも電話番号が存在しない
			//検索失敗
			{
				const recCnt = H_result.length;

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

	async chkPenalty(pactid: string, telno: string, carid: string | number) //パラメータチェック
	//検索成功
	{
		const H_rtn: any = Array();

		if ("" == (pactid || "" == String(telno || "" == carid))) {
			return false;
		}

		let sql = "select planid,options,discounts,buyselid,date(orderdate) as orderdate " + "from tel_tb " + "where pactid = " + pactid + " " + "and telno = '" + telno + "' " + "and carid = " + carid;
		const H_result = await this.getDB().queryHash(sql);

		if (!H_result == false) //レコード数
			//指定された電話番号が存在しない
			//検索失敗
			{
				const recCnt = H_result.length;

				if (0 == recCnt) {
					H_rtn.plan.judge = 0;
					H_rtn.option.judge = 0;
					H_rtn.buyselect.judge = 0;
					H_rtn.buyselect.charge = 0;
				} else //プランが登録されていない場合
					{
						if ("" == H_result[0].planid) //プランが登録されている場合
							{
								H_rtn.plan.judge = 0;
							} else //違約金の発生する可能性があるプランかをチェックする
							//検索成功
							{
								sql = "select penaltyflg from plan_tb where planid = " + H_result[0].planid;
								const rtnPlan = await this.getDB().queryOne(sql);

								if (!rtnPlan == false) //違約金発生なし
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
								A_option = A_option.concat( Object.keys(JSON.stringify( H_result[0].options )));
							}

							if ("" != String(H_result[0].discounts)) {
								A_option = A_option.concat(Object.keys(JSON.stringify( H_result[0].discounts )));
							}

							if (0 != A_option.length) //違約金の発生する可能性があるオプションかをチェックする
								//検索成功
								{
									const sql = "select count(*) from option_tb " + "where opid in (" + A_option.join(",") + ") " + "and penaltyflg = true";
									var rtnOption = await this.getDB().queryOne(sql);

									if (!rtnOption == false) //違約金発生なし
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

						if ("" == H_result[0].buyselid) //プランが登録されている場合
							{
								H_rtn.buyselect.judge = 0;
								H_rtn.buyselect.charge = 0;
							} else //違約金の発生する可能性がある買い方かをチェックする
							//検索成功
							{
								let sql = "select penaltyflg from buyselect_tb where buyselid = " + H_result[0].buyselid;
								const rtnBuysel = await this.getDB().queryOne(sql);

								if (!rtnBuysel) //違約金が発生しない買い方
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
													{
														const A_now = this.getDB().getToday().split("-");
														const A_orderDate = H_result[0].orderdate.split("-");
														let span = (Number(A_now[0]) - Number(A_orderDate[0]))*12 + (Number(A_now[1]) - Number(A_orderDate[1]));

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
														const H_rtnPenalty = await this.getDB().queryHash(sql);

														if (!H_rtnPenalty == false) //違約金無し
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

	async getAcquittanceDate(pactid: number, carid: number, telno: number, H_date: any) //資産管理から割賦回数と割賦開始月を取得
	//割賦回数も割賦開始月も空ならすぐ削除
	{
		const sql = "SELECT " + "ast.pay_frequency, ast.pay_startdate " + "FROM " + "assets_tb ast " + "INNER JOIN tel_rel_assets_tb rel ON ast.assetsid=rel.assetsid " + "WHERE " + "rel.pactid=" + pactid + " AND rel.carid=" + carid + " AND rel.telno='" + telno + "'" + " AND rel.main_flg=true";
		const H_tel = await this.get_DB().queryRowHash(sql);

		if (undefined == H_tel.pay_frequency && undefined == H_tel.pay_startdate) {
			var month = 0;
		} else if (undefined != H_tel.pay_frequency && undefined == H_tel.pay_startdate) {
			if (1 == H_tel.pay_frequency) {
				month = 0;
			} else {
				month = +H_tel.pay_frequency;
			}
		} else if (undefined == H_tel.pay_frequency && undefined != H_tel.pay_startdate) {
			var H_temp = new Date(H_tel.pay_startdate.substr(0, 4), H_tel.pay_startdate.substr(5, 2), H_tel.pay_startdate.substr(8, 2),0, 0, 0).toJSON().slice(0,10).replace(/-/g,'');
			var year = parseInt(H_temp.substring(0, 4));
			var mon = parseInt(H_temp.substring(4, 6));
			return new Date(year,mon + 25, 1,0, 0, 0).toJSON().slice(0,10).replace(/-/g,'-');
		} else if (undefined != H_tel.pay_frequency && undefined != H_tel.pay_startdate) {
			H_temp = new Date(H_tel.pay_startdate.substr(0, 4),H_tel.pay_startdate.substr(5, 2), H_tel.pay_startdate.substr(8, 2),0, 0, 0 ).toJSON().slice(0,10).replace(/-/g,'');
			var year = parseInt(H_temp.substring(0, 4));
			var mon = parseInt(H_temp.substring(4, 6));
			return new Date(year,mon + H_tel.pay_frequency + 1, 1,0, 0, 0 ).toJSON().slice(0,10).replace(/-/g,'-');
		} else {
			month = 0;
		}

		return new Date(H_date.y,H_date.m + month, 1,0, 0, 0 ).toJSON().slice(0,10).replace(/-/g,'-');
	}


};