//
//受注Model基底クラス
//
//更新履歴：<br>
//2008/07/17igarashi 作成
//
//@package Order
//@subpackage Model
//@author igarashi
//@filesource
//@since 2008/07/17
//
//
//
//注文フォーム用Model基底クラス
//
//@uses ModelBase
//@package
//@author igarashi
//@since 2008/07/17
//

require("MtAuthority.php");

require("OrderModelBase.php");

require("OrderUtil.php");

require("MDB2.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/07/17
//
//@param MtSetting $O_Set0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//取得したオーダー情報から指定したカラムだけを配列に入れて返す
//
//@author igarashi
//@since 2008/07/17
//
//@param $H_order
//@param $column 抽出したいカラム名
//
//@access public
//@return array
//
//
//振替先を取得する
//
//@author igarashi
//@since 2008/06/24
//
//@param shopid
//
//@access public
//@return hash
//
//
//電話管理から取得した情報を電話番号をキーにオーダー情報とマージする
//
//@author igarashi
//@since 2008/07/17
//
//@param $H_order
//@param $H_manage
//
//@access public
//@return hash
//
//
//mergeOrderAndManageDataBLP
//
//@author web
//@since 2012/08/03
//
//@param mixed $H_order
//@param mixed $H_manage
//@access public
//@return void
//
//
//渡された電話番号の情報を電話管理から取得する
//
//@author igarashi
//@since 2008/07/17
//
//@param $A_telno
//
//@access public
//@return hash
//
//
//getTelManageInfoAcc
//
//@author web
//@since 2013/12/11
//
//@param mixed $A_telno
//@param mixed $H_order
//@access public
//@return void
//
//
//価格表IDを取得する
//
//@author igarashi
//@since 2008/08/01
//
//@param $H_order
//
//@access pubic
//@return integer
//
//
//サブステータスの最小値と最大値を取得する
//
//@author igarashi
//@since 2008/08/10
//
//@access protected
//@return hash
//
//
//渡された受注情報の会社のうち、資産管理権限を持った会社を返す<br>
//
//@author igarashi
//@since 2008/08/11
//
//@param $pactid
//
//@access public
//@return hash
//
//
//引数の会社情報から、任意の会社権限が設定されているpactidを返す
//
//@author hanashima
//@since 2020/11/20
//
//@param $H_order
//@param $fnc_ininame
//
//@access public
//@return hash
//
//
//sqlを実行する
//
//@author igarashi
//@since 2008/08/12
//
//@param $H_sql
//@param $debag trueなら終了後にrollback
//
//@access public
//@return none
//
//
//execUpdateStatusHandの1次元配列バージョン。<br>
//sqlを実行する<br>
//rollbackはMtDBUtilではなくここで管理する<br>
//execの返り値がobjectならrollbackしてる
//
//@author igarashi
//@since 2008/08/31
//
//@param $H_sql(orderidをキーにした2次元連想配列)
//@param $debag trueなら終了後にrollback
//
//@access public
//@return mixed
//
//
//sqlを実行する<br>
//rollbackはMtDBUtilではなくここで管理する<br>
//execの返り値がobjectならrollbackしてる
//
//@author igarashi
//@since 2008/08/31
//
//@param $H_sql(orderidをキーにした2次元連想配列)
//@param $debag trueなら終了後にrollback
//
//@access public
//@return mixed
//
//
//空かもしれない配列をマージして返す
//
//@author igarashi
//@since 2008/09/09
//
//
//
//sql文にANDが必要ならつける
//
//@author igarashi
//@since 2008/08/26
//
//@param $sql
//@param $separate(連結したい区切り文字)
//
//@access public
//@return mixed
//
//
//sql文に接続子が必要かを判断する<br>
//flgがtrueなら接続子+後続のsqlを連結して返す
//falseなら接続子のみ返す
//
//@author igarashi
//@since 2008/09/21
//
//@param $sql
//@param $second
//@param $separate
//@param $flg
//
//@access public
//@return string
//
//
//文字列の時間を配列に入れて返す
//
//@author igarashi
//@since 2008/10/04
//
//
//
//@access public
//@return hash
//
//
//渡された配列を日時の文字列にして返す
//
//@author igarashi
//@since 2009/01/20
//
//@param mixed $H_date
//@param mixed $hour
//@access public
//@return void
//
//
//渡された日付が空なら、指定した日付を返す。<br>
//指定日もなければ、現在の時間を返す(Y:m:d H:i:s)
//
//@author igarashi
//@since 2008/10/23
//
//@param $date
//@param $nowtime
//
//@access public
//@return date
//
//
//渡された日付が空なら、指定した日付を返す。<br>
//指定日もなければ、現在の時間を返す(Y:m:d)
//
//@author igarashi
//@since 2008/10/23
//
//@param $date
//@param $nowtime
//
//@access public
//@return date
//
//
//渡された日付を基準に、指定した年月日を返す
//
//@author igarashi
//@since 2009/01/20
//
//@param mixed $basedate
//@param mixed $H_specify
//@param mixed $makeflg
//@param mixed $arrayflg
//@access public
//@return void
//
//
//メール本文作成
//
//@author igarashi
//@since 2008/09/29
//
//@param $mailtype：メールのタイプ
//@param $H_mailparam：メールに使用するパラメータの配列
//
//@access public
//@return $H_mailcontent：題名と本文
//
//
//getAuth
//
//@author
//@since 2010/10/29
//
//@access protected
//@return void
//k-42
//
//
//getAuth
//
//@author
//@since 2010/10/29
//
//@access protected
//@return void
//k-42
//
//
//setBillModel
//
//@author web
//@since 2013/04/10
//
//@param mixed $obj
//@access public
//@return void
//
//
//getBillModel
//
//@author web
//@since 2013/04/10
//
//@access protected
//@return void
//
//
//setBillView
//
//@author web
//@since 2013/04/10
//
//@param mixed $obj
//@access public
//@return void
//
//
//getBillView
//
//@author web
//@since 2013/04/10
//
//@access protected
//@return void
//
//
//状況に応じたSQLを作成する
//
//@author date
//@since 2015/05/18
//
//
//@access public
//@return array
//
//電話管理から電話の詳細を取得する
//電話管理の削除予約を入れる
//
//makeInsertTel
//
//@author web
//@since 2015/05/18
//
//@param mixed $tel_info
//@access public
//@return void
//
//TelRelAssetsを更新するSQLを取得する
//kaiban_telnoをnullにする
//改番を行うレコードを取得
//
//getTelDetailByKaiban
//
//@author web
//@since 2015/05/20
//
//@param mixed $orderid
//@param mixed $detail_sort
//@access public
//@return void
//
//
//ユーザーが入力した電話番号が重複していないかチェックする
//
//@author date
//@since 2015/05/20
//
//@param $pactid
//@param $carid
//@param $telno
//@param $teldetail
//
//@access public
//@return mix
//
//
//checkKaibanSorceTelnoExists
//改番元の番号が存在するかチェックを行う
//@author web
//@since 2015/05/22
//
//@param mixed $orderid
//@param mixed $ordertype
//@param mixed $pactid
//@param mixed $carid
//@param mixed $teldetail
//@access public
//@return void
//
//
//checkTelnoMulti
//指定されたキャリア、pactにて、重複する電話番号がないか確認する
//@author web
//@since 2015/05/21
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telno
//@access public
//@return void
//
//
//checkUserInputTelnoKaibanChange
//改番を押したが、番号を変更せずに更新した場合にエラーを返す。
//telnoはarrray( detail_sort=>telnoという形式で渡すこと。
//@author date
//@since 2015/05/20
//
//@param string $H_view
//@param string $H_view
//@param mixed $telno
//@access public
//@return void
//
//
//checkUserInputTelnoKaibanMulti
//
//@author date
//改番予定の番号が既に使われていないか確認する
//確認したいdetail_sortを配列をkeyにして渡すこと。array(detail_sort=>"")
//@since 2015/05/20
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $detail_sorts
//@access public
//@return void
//
//
//getOrderTelnoToDetailSort
//受取ったtelnoのdetail_sortを返す
//@author date
//@since 2015/05/21
//
//@param mixed $orderid
//@param mixed $telno
//@access public
//@return void
//
//
//checkKaibanOrderByTelno
//指定した注文の電話番号が改番対象か調べる
//@author date
//@since 2015/05/21
//
//@param string $val
//@access public
//@return void
//
//
//checkKaibanTelnoExistsByTelno
//改番先の番号が存在しているか確認する
//@author date
//@since 2015/05/21
//
//@param mixed $orderid
//@param mixed $telno
//@access public
//@return void
//
//改番元の番号が存在している？
//
//checkTelnoExistsByTelno
//指定した番号が存在していればtrue
//@author date
//@since 2015/05/21
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telnoe
//@access public
//@return void
//
//
//getOrderFormercarid
//
//@author date
//@since 2015/05/22
//
//@param mixed $oerderid
//@param $ $telno
//@access public
//@return void
//
//
//デストラクタ
//gt
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class ShopOrderModelBase extends OrderModelBase {
	constructor(O_db0, H_g_sess: {} | any[], site_flg = ShopOrderModelBase.SITE_USER) {
		super(O_db0, H_g_sess, ShopOrderModelBase.SITE_SHOP);
		this.errsql = "";
		this.O_UserAuth = undefined;
		this.errsql = "";
	}

	extractOrderColumn(H_order, column = "telno", A_in = false) {
		var A_telno = Array();

		if (false == A_in) {
			for (var val of Object.values(H_order)) {
				if (undefined != val[column]) {
					A_telno.push(val[column]);
				}
			}
		} else if (true == Array.isArray(A_in)) {
			for (var val of Object.values(H_order)) {
				if (true == (-1 !== A_in.indexOf(val.detail_sort))) {
					if (undefined != val[column]) {
						A_telno.push(val[column]);
					}
				}
			}
		}

		return A_telno;
	}

	getTransfer(A_shopid, myshopid) //$H_trans = $this->get_DB()->queryAssoc($sql);
	//		$H_trans[""] = "選択なし";
	//		ksort($H_trans, SORT_NUMERIC);
	{
		var sql = "SELECT sh.shopid, '['||sh.postcode||']'||name FROM shop_tb sh " + "INNER JOIN transfer_rel_tb trel ON sh.shopid=trel.toshopid WHERE trel.fromshopid IN (" + A_shopid.join(", ") + ")" + " AND sh.shopid != " + myshopid + " ORDER BY postcode";
		var res = this.get_DB().queryAssoc(sql);
		var H_trans = {
			"": "\u9078\u629E\u306A\u3057"
		};
		H_trans += res;
		return H_trans;
	}

	mergeOrderAndManageData(H_order, H_manage) //detail_sort順に並べ
	{
		var ordcnt = H_order.length;
		var telcnt = H_manage.length;

		for (var idx = 0; idx < ordcnt; idx++) {
			for (var loop = 0; loop < telcnt; loop++) {
				if (H_order[idx].telno == H_manage[loop].telno) //! キーが重複してる場合はH_orderが優先される !
					{
						for (var key of Object.values(H_manage)) {
							for (var nam in key) //オーダー情報になければ管理の情報を使う -> オーダー情報を優先する。
							//表示すべきでない情報はオーダーに持つと破綻しますよ
							{
								var val = key[nam];

								if (false == (undefined !== H_order[idx][nam]) || "" == H_order[idx][nam]) {
									H_order[idx][nam] = H_manage[loop][nam];
								}
							}
						}

						H_result[H_order[idx].detail_sort] = H_order[idx] + H_manage[loop];
					}
			}

			H_result[H_order[idx].detail_sort] = H_order[idx];
		}

		if (true == Array.isArray(H_result)) {
			ksort(H_result);
		}

		return H_result;
	}

	mergeOrderAndManageDataBLP(H_order, H_manage) //detail_sort順に並べ
	{
		for (var key in H_order) {
			var orderInfo = H_order[key];
			H_result[orderInfo.detail_sort] = orderInfo;

			if (undefined !== H_manage[orderInfo.telno]) {
				{
					let _tmp_0 = H_manage[orderInfo.telno];

					for (var col in _tmp_0) {
						var telInfo = _tmp_0[col];

						if (!(undefined !== H_result[orderInfo.detail_sort][col]) || !H_result[orderInfo.detail_sort][col]) {
							H_result[orderInfo.detail_sort][col] = telInfo;
						}
					}
				}
			}
		}

		if (true == Array.isArray(H_result)) {
			ksort(H_result);
		}

		return H_result;
	}

	getTelManageInfo(A_telno, H_order, tagcarid = false, key = false) //電話番号がないなら処理しない
	//必要ならキャリアで縛る
	//想定した使い方では注文情報とマージするので縛る必要はないし、MNPだとちょっと難しい
	//付属品やその他の場合、端末情報がないためキャリアで縛らないと複数の同電話番号端末がヒットしてしまう
	{
		if (1 > A_telno.length) {
			return undefined;
		}

		var sql = "SELECT " + "tel.telno, tel.telno_view, tel.buyselid, ase.assetsid, tel.machine, tel.color, " + "tel.contractdate, ase.pay_startdate, ase.pay_frequency, ase.pay_monthly_sum, " + "buy.buyselname, tel.carid " + "FROM tel_tb tel " + "INNER JOIN tel_rel_assets_tb rel ON tel.telno=rel.telno " + "INNER JOIN assets_tb ase ON rel.assetsid=ase.assetsid AND ase.pactid=" + this.get_DB().dbQuote(H_order.order.pactid, "int", true) + " " + "LEFT JOIN buyselect_tb buy ON tel.buyselid=buy.buyselid " + "WHERE tel.pactid=" + this.get_DB().dbQuote(H_order.order.pactid, "int", true) + " AND rel.main_flg=true " + " AND tel.telno in ('" + A_telno.join("', '") + "')";

		if (true == tagcarid) {
			sql += " AND tel.carid=" + H_order.order.carid + " AND rel.carid=" + H_order.order.carid;
		}

		if (!key) {
			return this.get_DB().queryHash(sql);
		} else {
			return this.get_DB().queryKeyAssoc(sql);
		}
	}

	getTelManageInfoAcc(A_telno, H_order) //電話番号がないなら処理しない
	{
		if (1 > A_telno.length) {
			return undefined;
		}

		var sql = "SELECT " + "tel.telno, tel.telno_view, tel.buyselid, tel.machine, tel.color, " + "tel.contractdate, tel.carid " + "FROM tel_tb tel " + "WHERE tel.pactid=" + this.get_DB().dbQuote(H_order.order.pactid, "int", true) + " AND tel.telno in ('" + A_telno.join("', '") + "')";
		return this.get_DB().queryRowHash(sql);
	}

	getPriceListID(H_order) {
		var sql = "SELECT ppid FROM mt_order_pattern_tb " + "WHERE carid=" + H_order.carid + " AND cirid=" + H_order.cirid + " AND type='" + H_order.ordertype + "'";
		return this.get_DB().queryOne(sql);
	}

	getSubStatusBorder() {
		var sql = "SELECT min(status), max(status) FROM mt_status_tb " + "WHERE subflg=true";
		return this.get_DB().queryHash(sql);
	}

	getAssetsAuth(H_order) {
		var sql = "SELECT pactid, fncid FROM fnc_relation_tb " + "WHERE pactid IN (" + this.extractOrderColumn(H_order, "pactid").join(", ") + ") AND fncid=" + this.O_order.asets_fnc;
		return this.get_DB().queryKeyAssoc(sql);
	}

	getAnyAuth(H_order, fncIniname) {
		var sql = "SELECT fr.pactid FROM fnc_relation_tb fr " + "inner join function_tb f on f.fncid = fr.fncid " + "WHERE fr.pactid IN (" + this.extractOrderColumn(H_order, "pactid").join(", ") + ") AND f.ininame = " + this.get_DB().dbQuote(fncIniname, "text", true);
		return this.get_DB().queryCol(sql);
	}

	execUpdateStatus(H_sql, debag = false) {
		this.get_DB().beginTransaction();

		for (var val of Object.values(H_sql)) {
			if (undefined != val && "" != val) {
				this.get_DB().exec(val);
			}
		}

		if (true == debag) {
			this.get_DB().rollback();
			this.getOut().warningOut(0, " !! DebagMode !!", false);
		} else {
			this.get_DB().commit();
		}

		return true;
	}

	execUpdateStatusHandRow(H_sql, debag = false) {
		if (1 > H_sql.length) {
			return false;
		}

		var A_err = Array();
		var errflg = false;

		for (var key in H_sql) {
			var val = H_sql[key];
			this.get_DB().beginTransaction();

			if (true == PEAR.isError(this.get_DB().exec(val, false))) {
				this.errsql = val;

				if (true == debag) {
					console.log(val);
				}

				A_err.push({
					orderid: key,
					err: "<span style=\"color:red\">\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F</span><br>"
				});
				this.get_DB().rollback();
				errflg = true;
				break;
			} else {
				if (true == debag) {
					this.get_DB().rollback();
				} else {
					this.get_DB().commit();
				}
			}
		}

		if (true == errflg) {
			return A_err;
		} else {
			return "exec";
		}
	}

	execUpdateStatusHand(H_sql, debag = false) //sqlがないときは終われ
	//orderidごとに処理
	//全件失敗
	{
		if (1 > H_sql.length) {
			return {
				flg: "fail"
			};
		}

		var A_err = Array();
		var A_suc = Array();
		var A_errsql = Array();

		for (var orderid in H_sql) //初期化
		//各sqlを実行
		//debagモードとどこかでエラー吐いてたらrollback
		{
			var idx = H_sql[orderid];
			var errflg = false;
			var sucflg = false;
			this.get_DB().beginTransaction();

			for (var val of Object.values(idx)) {
				if (undefined != val && "" != val) //objectが返ってきたらエラー
					{
						if (true == PEAR.isError(this.get_DB().exec(val, false))) //失敗したidは取っておこう
							//ミスってますフラグをたてる
							{
								A_err.push({
									orderid: orderid,
									err: "<span style=\"color:red\">\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F</span>"
								});
								errflg = true;
								this.errsql += val + "\n";

								if (true == debag) {
									console.log(val);
								}

								break;
							} else //array_push($A_suc, array("orderid"=>$orderid));
							{
								sucflg = true;
								A_suc.push(orderid);
							}
					}
			}

			if (true == errflg || true == debag) {
				this.get_DB().rollback();

				if (true == debag) {
					this.getOut().warningOut(0, " !! DebagMode !!", false);
				}
			} else {
				this.get_DB().commit();
			}
		}

		if (true == errflg && false == sucflg) {
			H_result.flg = "fail";
			H_result.info = A_err;
			H_result.errsql = this.errsql;
			return H_result;
		} else if (false == errflg && true == sucflg) {
			H_result.flg = "exec";
			return H_result;
		} else if (true == errflg && true == sucflg) {
			H_result.flg = "part";
			H_result.err = A_err;
			H_result.suc = A_suc;
			H_result.errsql = this.errsql;
			return H_result;
		} else {
			H_result.flg = "fail";
			H_result.err = A_err;
			H_result.suc = A_suc;
			H_result.errsql = this.errsql;
			return H_result;
		}
	}

	mergeCheckArray(A_data, A_info, mode = "merge") {
		if (0 < A_data.length) {
			if (0 < A_info.length) //両方とも存在したらくっつける
				{
					if ("merge" == mode) {
						return array_merge(A_data, A_info);
					} else {
						return A_data + A_info;
					}
				} else {
				return A_data;
			}
		} else if (0 < A_info.length) {
			return A_info;
		}

		return Array();
	}

	sqlConnect(sql, separate = "AND ") {
		if ("" != sql) {
			return separate;
		}

		return "";
	}

	sqlConnectEx(sql, second, separate = "AND ", flg = false) //接続子のみ返すならこっち
	{
		if (false == flg) {
			if ("" != sql && "" != second) {
				return separate;
			}
		} else {
			if ("" != sql && "" != second) {
				return separate + second;
			} else if ("" != second) {
				return second;
			}
		}

		return "";
	}

	makeDateHash(date, hour = false) {
		H_date.y = date.substr(0, 4);
		H_date.m = date.substr(5, 2);
		H_date.d = date.substr(8, 2);

		if (true == hour) {
			if (12 < date.length) {
				H_date.h = date.substr(11, 2);
			} else //0じゃなきゃダメです。どうしても代えたかったら引数足して指定できるようにして。
				{
					H_date.h = 0;
				}
		}

		return H_date;
	}

	makeDateString(H_date, hour = false) {
		if (true == (undefined !== H_date.Y)) {
			var result = H_date.Y;
		} else {
			result = H_date.y;
		}

		if (undefined == result || "" == result) {
			return "";
		}

		result += "-" + str_pad(H_date.m, 2, "0", STR_PAD_LEFT);
		result += "-" + str_pad(H_date.d, 2, "0", STR_PAD_LEFT);

		if (true == hour) {
			if (true == (undefined !== H_date.H)) {
				result += " " + str_pad(H_date.H, 2, "0", STR_PAD_LEFT) + ":00:00";
			} else {
				result += " " + str_pad(H_date.h, 2, "0", STR_PAD_LEFT) + ":00:00";
			}
		}

		return result;
	}

	makeNowTimeData(date, nowtime = "") //日付が空なら代わりの日付を入れる
	{
		if ("" == date || undefined == date) //代わりの日付が指定されていないなら現在時刻を入れる
			{
				if ("" == nowtime || undefined == nowtime) {
					nowtime = MtDateUtil.getNow();
				}

				date = nowtime;
			}

		return date;
	}

	makeDateData(date, nowtime = "") {
		if ("" == nowtime) {
			nowtime = this.O_order.today;
		}

		if ("" == date || undefined == date) {
			date = nowtime;
		}

		return date;
	}

	makeSpecifyDate(basedate, H_specify, makeflg = false, arrayflg = false) //基準日がなくて補正もしないなら終われ
	//trueなら配列で返す
	{
		if ("" == basedate && false == makeflg) {
			return false;
		} else {
			var H_base = this.makeDateHash(this.makeNowTimeData(basedate, ""), true);
			H_base = getdate(mktime(0, 0, H_base.h, H_base.m, H_base.d, H_base.y));
			var makedate = date("Y-m-d h", mktime(0, 0, H_base.h, H_base.mon + H_specify.m, H_base.mday + H_specify.d, H_base.year + H_specify.y));
		}

		if (true == arrayflg) {
			return this.makeDateHash(makedate, true);
		} else {
			return makedate;
		}
	}

	makeFinishOrderMail(mailtype, H_mailparam) //受注種別とキャリアと回線種別
	//受付番号桁揃え
	//振り分け
	//complete		:	完了（最終承認者と申請者に飛ぶ）
	//ordercancell	:	キャンセル（最終承認者と申請者に飛ぶ）
	//完了（最終承認者と申請者に飛ぶ）
	{
		var ptn_sql = "SELECT " + "usertypename " + "FROM " + "mt_order_pattern_tb " + "WHERE " + "type = '" + H_mailparam.type + "' " + "AND carid = " + H_mailparam.carid + " " + "AND cirid = " + H_mailparam.cirid;
		var usertypename = this.get_DB().queryOne(ptn_sql);
		var orderidstr = str_pad(H_mailparam.orderid, 10, "0", STR_PAD_LEFT);

		if (mailtype == "complete") //キャンセル（最終承認者と申請者に飛ぶ）
			{
				var subject = "KCS Motion\uFF1A" + usertypename + "\u306E\u6CE8\u6587\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F\uFF08" + orderidstr + "\uFF09";
				var message = "<< KCS Motion : \u53D7\u6CE8\u5B8C\u4E86\u306E\u304A\u77E5\u3089\u305B >>\n";
				message += "-------------------------------------------------------------\n";
				message += usertypename + "\u306E\u6CE8\u6587\u306E\u51E6\u7406\u3092\u5B8C\u4E86\u3057\u305F\u3053\u3068\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n";
				message += "\n";
				message += "KCS Motion\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
				message += "\u53D7\u4ED8\u756A\u53F7\u306F " + orderidstr + " \u3067\u3059\u3002\n";
				message += "\n";
				message += "https://" + _SERVER.SERVER_NAME + "/\n";
				message += "-------------------------------------------------------------\n";
			} else if (mailtype == "ordercancell") {
			subject = "KCS Motion\uFF1A" + usertypename + "\u306E\u6CE8\u6587\u304C\u30AD\u30E3\u30F3\u30BB\u30EB\u3055\u308C\u307E\u3057\u305F\uFF08" + orderidstr + "\uFF09";
			message = "<< KCS Motion : \u53D7\u6CE8\u30AD\u30E3\u30F3\u30BB\u30EB\u306E\u304A\u77E5\u3089\u305B >>\n";
			message += "-------------------------------------------------------------\n";
			message += usertypename + "\u306E\u6CE8\u6587\u304C\u30AD\u30E3\u30F3\u30BB\u30EB\u3055\u308C\u307E\u3057\u305F\u3053\u3068\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n";
			message += "\n";
			message += "KCS Motion\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
			message += "\u53D7\u4ED8\u756A\u53F7\u306F " + orderidstr + " \u3067\u3059\u3002\n";
			message += "\n";
			message += "https://" + _SERVER.SERVER_NAME + "/\n";
			message += "-------------------------------------------------------------\n";
		}

		delete orderidstr;
		var H_mailcontent = {
			subject: subject,
			message: message
		};
		return H_mailcontent;
	}

	setAuth(pactid = "") {
		if (is_numeric(pactid) && !!pactid) {
			this.O_UserAuth = MtAuthority.singleton(pactid);
		} else {
			return false;
		}

		return this.O_UserAuth;
	}

	getAuth() {
		return this.O_UserAuth;
	}

	setBillModel(obj) {
		require("model/Order/BillingModelBase.php");

		if (obj instanceof BillingBillModel) {
			this.billModel = obj;
		}
	}

	getBillModel() {
		return this.billModel;
	}

	setBillView(obj) {
		require("view/Order/BillingViewBase.php");

		if (obj instanceof BillingViewBase) {
			this.billView = obj;
		}
	}

	getBillView() {
		return this.billView;
	}

	makeUpdateSQLCtrl_kaiban(orderid, teldetail, H_g_sess) //order_tb取得
	//mt_order_teldetail_tb取得
	//$teldetail = $this->getTelDetailByKaiban($orderid);	//	渡すようにしました
	//mt_order_teldetail_tbのkaiban_noとkaiban_telno_viewをnullにする
	{
		var A_sql = Array();
		var sql = "SELECT carid,pactid,postid,division,fee FROM mt_order_tb WHERE orderid=" + orderid;
		var order = this.get_DB().queryRowHash(sql);
		var nowdate = MtDateUtil.getNow();

		for (var key in teldetail) //$A_sql = $A_sql + $sql;
		//電話の更新
		//$tel_info["orderdate"] = "";		//	ここも上書きするのか確認
		//tel_rel_assets更新
		//SQL作成
		//ちょっとテスト
		{
			var value = teldetail[key];
			if (is_null(value.kaiban_telno) == true) continue;
			var tel_info = this.getTelDetail(order.pactid, order.carid, value.telno);

			if (!(undefined !== tel_info.pactid)) {
				continue;
			}

			sql = this.makeInsertTelReserve(order.carid, order.pactid, order.postid, value.telno, value.telno_view, value.expectdate, value.userid, order.division, order.fee, nowdate, A_sql);
			var freeword1 = "\n" + tel_info.telno_view;
			tel_info.telno = value.kaiban_telno;
			tel_info.telno_view = value.kaiban_telno_view;
			tel_info.recdate = nowdate;
			tel_info.fixdate = nowdate;
			A_sql.push(this.makeInsertTel(tel_info));
			sql = this.makeUpdateTelRelAssets(order.pactid, order.carid, nowdate, value.telno, value.kaiban_telno);
			A_sql.push(sql);
			var history = "INSERT INTO mt_order_history_tb " + "(orderid, chdate, shopid, shopname, shopperson, shopcomment, status) " + "VALUES (" + this.get_DB().dbQuote(orderid, "int", true) + ", " + this.get_DB().dbQuote(nowdate, "date", true) + ", " + this.get_DB().dbQuote(H_g_sess.shopid, "int", false) + ", " + this.get_DB().dbQuote(H_g_sess.shopname, "text", false) + ", " + this.get_DB().dbQuote(H_g_sess.personname, "text", false) + ", " + this.get_DB().dbQuote(value.telno_view + "\u304B\u3089" + value.kaiban_telno_view + "\u306E\u6539\u756A\u3092\u884C\u3044\u307E\u3057\u305F", "text", false) + ", " + this.get_DB().dbQuote(value.substatus, "int", true) + ")";
			A_sql.push(history);

			if (value.substatus < this.O_order.st_sub_prcfin) //処理済前、フリー1に書き込むだけ
				{
					A_sql.push("update mt_order_teldetail_tb set " + "freeword1 = coalesce(freeword1, '') || " + this.get_DB().dbQuote(freeword1, "text") + " " + "where " + " orderid=" + this.get_DB().dbQuote(orderid, "text", true) + " " + "and detail_sort=" + this.get_DB().dbQuote(value.detail_sort, "int", true));
				} else //処理済後、フリー1とtel_detail更新
				{
					A_sql.push("update mt_order_teldetail_tb set " + "freeword1 = coalesce(freeword1, '') || " + this.get_DB().dbQuote(freeword1, "text") + "," + "telno=" + this.get_DB().dbQuote(value.kaiban_telno, "text", true) + "," + "telno_view=" + this.get_DB().dbQuote(value.kaiban_telno_view, "text", true) + " " + "where " + " orderid=" + this.get_DB().dbQuote(orderid, "text", true) + " " + "and detail_sort=" + this.get_DB().dbQuote(value.detail_sort, "int", true));
				}
		}

		sql = this.makeUpdateOrderTelDetailKaibanNull(orderid, nowdate);
		A_sql.push(sql);
		var result = {
			err: err,
			sql: {
				[orderid]: A_sql
			}
		};
		return result;
	}

	getTelDetail(pactid, carid, telno) {
		var sql = "SELECT * from tel_tb where pactid=" + pactid + " and carid=" + carid + " and telno='" + telno + "'";
		return this.get_DB().queryRowHash(sql);
	}

	makeInsertTelReserve(carid, pactid, postid, telno, telno_view, expectdate, userid, division, fee, nowdate, dst_sql = undefined) //電話管理に反映しない会社は登録しない
	//端末は削除しない
	//ユーザー名
	//解約でも削除しない会社であればsqlを登録しない
	//実行日の取得
	//割賦は見ない
	//		$date = $this->makeDateHash($O_tel->getAcquittanceDate($pactid, $carid, $telno, $H_date));
	//		$tempdate = mktime(0, 0, 0, $date["m"], $date["d"], $date["y"]);
	//		$date = getdate($tempdate);
	//		if($nowtime > $tempdate){
	//			$date = getdate($nowtime);
	//		}elseif("一括支払" == $fee){
	//			$date = getdate($nowtime);
	//		}
	//処理日を削除予約日にする
	{
		var A_sql = Array();

		if (this.getRegistType() == false) {
			return Array();
		}

		var delflg = 0;
		var username = "\u30B7\u30B9\u30C6\u30E0\u306B\u3088\u308B\u524A\u9664";

		if (true == (-1 !== this.O_Set.A_dont_del_tel_pactid.indexOf(pactid))) {
			return Array();
		}

		var O_tel = new TelModel();
		var H_date = this.makeDateHash(nowdate);
		var nowtime = mktime(0, 0, 0, H_date.m, H_date.d, H_date.y);
		var date = getdate(nowtime);
		var execdate = this.makeDateString(this.makeDateHash(date.year + "-" + str_pad(date.mon, 2, "0", STR_PAD_LEFT) + "-" + str_pad(date.mday, 2, "0", STR_PAD_LEFT)));

		if (undefined !== expectdate) {
			var expecttime = strtotime(expectdate);
			var exectime = strtotime(execdate);

			if (expecttime > exectime) {
				execdate = expectdate;
			}
		}

		if (undefined == userid || undefined == username) //$username = $H_user["username"];	//	usernameは固定なのでコメントにしておく
			{
				var sql = "SELECT userid, username FROM user_tb WHERE type='SU' AND pactid=" + pactid;
				var H_user = this.get_DB().queryRowHash(sql);
				userid = H_user.userid;
			}

		sql = "SELECT COUNT(*) " + "FROM " + "tel_reserve_tb " + "WHERE " + "exe_state=0" + " AND pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND add_edit_flg=" + this.get_DB().dbQuote(3, "int", true) + " AND telno=" + this.get_DB().dbQuote(telno, "text", true) + " AND reserve_date=" + this.get_DB().dbQuote(execdate, "text", true);
		var check = this.get_DB().queryOne(sql);

		if (0 == check) {
			sql = "INSERT INTO tel_reserve_tb " + "(pactid, postid, telno, telno_view, carid, add_edit_flg, reserve_date, " + "exe_postid, exe_userid, exe_name, order_flg, delete_type, recdate, fixdate, division) " + "VALUES(" + this.get_DB().dbQuote(pactid, "int", true) + ", " + this.get_DB().dbQuote(postid, "int", true) + ", " + this.get_DB().dbQuote(telno, "text", true) + ", " + this.get_DB().dbQuote(telno_view, "text", true) + ", " + this.get_DB().dbQuote(carid, "int", true) + ", " + this.get_DB().dbQuote(3, "int", true) + ", " + this.get_DB().dbQuote(execdate, "date", true) + ", " + this.get_DB().dbQuote(postid, "int", true) + ", " + this.get_DB().dbQuote(userid, "int", true) + ", " + this.get_DB().dbQuote(username, "text", true) + ", " + this.get_DB().dbQuote(true, "boolean", true) + ", " + this.get_DB().dbQuote(delflg, "int", true) + ", " + this.get_DB().dbQuote(nowdate, "date", true) + ", " + this.get_DB().dbQuote(nowdate, "date", true) + ", " + this.get_DB().dbQuote(division, "int") + ")";
			A_sql.push(sql);

			if (is_null(dst_sql) == false) {
				dst_sql.push(sql);
			}
		}

		sql = "SELECT COUNT(*) FROM tel_reserve_tb " + "WHERE " + "exe_state=0" + " AND pactid=" + pactid + " AND carid=" + carid + " AND telno='" + telno + "'" + " AND reserve_date >='" + execdate + "'";
		check = this.get_DB().queryOne(sql);

		if (0 < check) //管理予約を削除することをmng_logに書いておく
			//$mnglogsql = $this->makeManagementLogSQL($H_g_sess, $H_sess, $H_order, $H_permit, $nowtime, true);
			//array_push($A_sql, $res_del_sql, $mnglogsql);
			{
				var res_del_sql = "DELETE FROM tel_reserve_tb " + "WHERE " + "exe_state=0" + " AND pactid=" + pactid + " AND carid=" + carid + " AND telno='" + telno + "'" + " AND reserve_date >'" + execdate + "'";
				A_sql.push(res_del_sql);

				if (is_null(dst_sql) == false) {
					dst_sql.push(sql);
				}
			}

		return A_sql;
	}

	makeInsertTel(tel_info) {
		var sql = "select column_name,data_type,is_nullable from information_schema.columns where table_name='tel_tb'";
		var datatype = this.get_DB().queryHash(sql);
		var teltb = Array();

		for (var i = 0; i < datatype.length; i++) {
			if (datatype[i].data_type == "timestamp without time zone") {
				var type = "timestamp";
			} else if (datatype[i].data_type == "bigint") {
				type = "int";
			} else {
				type = datatype[i].data_type;
			}

			var notnull = datatype[i].is_nullable == "NO" ? true : false;
			teltb[datatype[i].column_name] = {
				type: type,
				notnull: notnull
			};
		}

		var cols = Array();
		var vals = Array();

		for (var col in tel_info) {
			var val = tel_info[col];

			if (undefined !== teltb[col]) {
				cols.push(col);
				vals.push(this.get_DB().dbQuote(val, teltb[col].type, teltb[col].notnull));
			}
		}

		sql = "INSERT INTO tel_tb (" + cols.join(", ") + ") VALUES(" + vals.join(", ") + ")";
		return sql;
	}

	makeUpdateTelRelAssets(pactid, carid, fixdate, telno_prev, telno_next) //tel_rel_assets_tbの更新
	{
		var sql = "UPDATE tel_rel_assets_tb set " + "telno=" + this.get_DB().dbQuote(telno_next, "text", true) + " " + ",fixdate=" + this.get_DB().dbQuote(fixdate, "date", true) + " " + "WHERE pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " and carid = " + this.get_DB().dbQuote(carid, "int", true) + " and telno=" + this.get_DB().dbQuote(telno_prev, "text", true);
		return sql;
	}

	makeUpdateOrderTelDetailKaibanNull(orderid, fixdate) //tel_rel_assets_tbの更新
	{
		var sql = "UPDATE mt_order_teldetail_tb set" + " kaiban_telno=" + this.get_DB().dbQuote(undefined, "text", false) + ",kaiban_telno_view=" + this.get_DB().dbQuote(undefined, "text", false) + ",fixdate=" + this.get_DB().dbQuote(fixdate, "date", true) + " " + "WHERE " + "orderid = " + this.get_DB().dbQuote(orderid, "int", true) + " and kaiban_telno is not null " + " and substatus >= " + this.O_order.st_sub_prcfin + " " + " and substatus < " + this.O_order.st_delete;
		return sql;
	}

	getTelDetailByKaiban(orderid, detail_sort) {
		if (Array.isArray(detail_sort) == false || detail_sort.length < 1) {
			return undefined;
		}

		var sql = "SELECT telno,telno_view,expectdate,userid,detail_sort,substatus,kaiban_telno,kaiban_telno_view " + "FROM mt_order_teldetail_tb " + "WHERE orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " and  detail_sort in (" + detail_sort.join(",") + ")";
		return this.get_DB().queryHash(sql);
	}

	checkUserInputTelnoKaiban(pactid, carid, telno, teldetail) //telnoがnullでなければ、番号変更チェックする(改番で変更されてない番号があればエラー出す)
	//改番する番号が対象。番号が変更されているかもチェック
	//重複確認
	//受注詳細内に重複した番号がなければ、tel_tbともチェック
	{
		var result = "";
		var telno_kaiban = Array();
		var A_telno = Array();
		var temp = "";

		for (var key in teldetail) {
			var value = teldetail[key];

			if (!value.kaiban_telno) {
				continue;
			}

			var tel1 = this.O_order.convertNoView(telno[value.detail_sort]);
			var tel2 = value.telno;

			if (tel1 == tel2) //番号が変更されていない
				{
					if (temp != "") {
						temp += ",";
					}

					temp += tel1;
				} else //番号が変更されている。
				{
					telno_kaiban[value.detail_sort] = telno[value.detail_sort];
				}
		}

		if (temp != "") {
			result += "\u96FB\u8A71\u756A\u53F7\u3092\u5909\u66F4\u3057\u3066\u304F\u3060\u3055\u3044(" + temp + ")";
		}

		if (1 > telno_kaiban.length) {
			return result;
		}

		for (var val of Object.values(telno_kaiban)) {
			A_telno.push(this.O_order.convertNoView(val));
		}

		A_telno = array_count_values(A_telno);

		for (var key in A_telno) {
			var val = A_telno[key];

			if ("" != key) {
				if (1 < val) {
					result = "\u96FB\u8A71\u756A\u53F7\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002\u51E6\u7406\u5185\u5BB9\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044";
					return result;
				}
			}
		}

		if ("" == result) {
			var A_key = Object.keys(A_telno);
			var sql = "SELECT telno FROM tel_tb " + "WHERE carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND telno IN ('" + A_key.join("', '") + "')";
			var H_dup = this.get_DB().queryCol(sql);

			for (var val of Object.values(H_dup)) {
				result += "\u65E2\u306B\u540C\u3058\u96FB\u8A71\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059(" + val + ")";
			}
		}

		return result;
	}

	checkKaibanSorceTelnoExists(orderid, ordertype, pactid, carid, teldetail) //指定された電話番号が電話管理に存在しているかチェック
	{
		var temp = "";

		for (var key in teldetail) //キャリアの設定
		{
			var value = teldetail[key];
			var temp_carid = carid;

			if (ordertype == this.O_order.type_mnp) //MNPの場合は処理済かそうでないかでキャリアを変える必要がある
				{
					if (value.substatus < this.O_order.st_sub_prcfin) //処理済前オーダーです
						{
							temp_carid = this.getOrderFormercarid(orderid, value.telno);
						}
				}

			if (this.checkTelnoExists(pactid, temp_carid, value.telno) == false) {
				if (temp != "") {
					temp += ",";
				}

				temp += value.telno;
			}
		}

		if (temp != "") {
			result += "\u3053\u306E\u756A\u53F7\u306F\u96FB\u8A71\u7BA1\u7406\u306B\u5B58\u5728\u3057\u3066\u3044\u306A\u3044\u305F\u3081\u6539\u756A\u3067\u304D\u307E\u305B\u3093(" + temp + ")";
			return result;
		}

		return "";
	}

	checkTelnoMulti(pactid, carid, telno) //ハイフン抜く
	//受注詳細内に重複した番号がなければ、tel_tbともチェック
	{
		if (Array.isArray(telno) == false || !telno) {
			return Array();
		}

		var A_telno = Array();

		for (var val of Object.values(telno)) {
			A_telno.push(val.replace(/-/g, ""));
		}

		A_telno = array_count_values(A_telno);
		var A_key = Object.keys(A_telno);
		var sql = "SELECT telno FROM tel_tb " + "WHERE carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND telno IN ('" + A_key.join("', '") + "')";
		return this.get_DB().queryCol(sql);
	}

	checkUserInputTelnoKaibanChange(pactid, carid, telno) {
		return "";
	}

	checkUserInputTelnoKaibanMulti(orderid, detail_sort) //kaiban_telno取得
	//既に登録されているかチェック
	//ありましたか
	{
		if (!detail_sort) {
			return "";
		}

		var sql = "SELECT pactid,carid FROM mt_order_tb WHERE orderid=" + orderid;
		var order = this.get_DB().queryRowHash(sql);
		sql = "SELECT kaiban_telno FROM mt_order_teldetail_tb where orderid=" + orderid + " and detail_sort in (" + detail_sort.join(",") + ")" + " and kaiban_telno is not null";
		var kaiban_telno = this.get_DB().queryCol(sql);
		var multi_telno = this.checkTelnoMulti(order.pactid, order.carid, kaiban_telno);

		if (!multi_telno) //ないです
			{
				return "";
			}

		return "\u6539\u756A\u306E\u756A\u53F7\u304C\u65E2\u306B\u4F7F\u308F\u308C\u3066\u3044\u307E\u3059(" + multi_telno.join(",") + ")";
	}

	getOrderTelnoToDetailSort(orderid, telno) {
		var sql = "SELECT detail_sort FROM mt_order_teldetail_tb " + "WHERE " + "orderid = " + this.get_DB.dbQuote(orderid, "int", true) + " and telno in ('" + telno.join("','") + "')";
		return this.get_DB().queryCol(sql);
	}

	checkKaibanOrderByTelno(orderid, telno) {
		var sql = "SELECT count(*) FROM mt_order_teldetail_tb " + "WHERE orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " and telno=" + this.get_DB().dbQuote(telno, "text", true) + " and kaiban_telno is not null";
		var res = this.get_DB().queryOne(sql);

		if (res > 0) {
			return true;
		}

		return false;
	}

	checkKaibanTelnoExistsByTelno(orderid, pactid, carid, telno) //$sql = "SELECT tel_tb.telno,mt_order_teldetail_tb.kaiban_telno FROM tel_tb ".
	//				" join mt_order_teldetail_tb on".
	//						" mt_order_teldetail_tb.orderid =".$this->get_DB()->dbQuote( $orderid,"int",true).
	//						" and mt_order_teldetail_tb.telno =".$this->get_DB()->dbQuote( $telno,"text",true).
	//					" WHERE".
	//						" tel_tb.telno = mt_order_teldetail_tb.kaiban_telno".
	//						" and  tel_tb.pactid = ".$this->get_DB()->dbQuote($pactid,"int",true).
	//						" and tel_tb.carid=".$this->get_DB()->dbQuote($carid,"int",true);
	{
		var sql = "SELECT kaiban_telno FROM mt_order_teldetail_tb WHERE" + " orderid =" + this.get_DB().dbQuote(orderid, "int", true) + " and telno = " + this.get_DB().dbQuote(telno, "text", true);
		var kaiban_telno = this.get_DB().queryOne(sql);

		if (!kaiban_telno) {
			return false;
		}

		sql = "SELECT count(*) FROM tel_tb WHERE" + " pactid =" + this.get_DB().dbQuote(pactid, "int", true) + " and carid = " + this.get_DB().dbQuote(carid, "int", true) + " and telno = " + this.get_DB().dbQuote(kaiban_telno, "text", true);
		var res = this.get_DB().queryOne(sql);

		if (res > 0) {
			return true;
		}

		return false;
	}

	checkTelnoExists(pactid, carid, telno) {
		var sql = "SELECT count(*) FROM tel_tb " + " WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " and carid=" + this.get_DB().dbQuote(carid, "int", true) + " and telno=" + this.get_DB().dbQuote(telno, "text", true);
		var res = this.get_DB().queryOne(sql);

		if (res > 0) {
			return true;
		}

		return false;
	}

	getOrderFormercarid(orderid, telno) {
		var sql = "SELECT formercarid FROM mt_order_teldetail_tb WHERE " + " orderid = " + this.get_DB().dbQuote(orderid, "int", true) + " and telno=" + this.get_DB().dbQuote(telno, "text", true);
		var res = this.get_DB().queryOne(sql);
		return res;
	}

	__destruct() {
		super.__destruct();
	}

};