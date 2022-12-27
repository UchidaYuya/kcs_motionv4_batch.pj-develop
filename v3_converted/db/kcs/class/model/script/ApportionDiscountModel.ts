//
//kddiサービス取込み 伊達
//
//error_reporting(E_ALL|E_STRICT);
//電話番号
//課税通話料金+非課税通話料金
//課税通話料金
//非課税通話料金
//課税の割引料金
//非課税の割引料金
//税金
//課税のdetailno
//非課税のdetailno
//税金のdetailno
//課税の割引料金の数
//非課税の割引料金の数
//部署ID
//detailnoの末尾
//ユーザー側での追加。
//
//ImportMonotaroModel
//Monotaro取込み
//@uses ModelBase
//@package
//@author web
//@since 2017/01/26
//

require("ImportBaseModel.php");

require("MtAuthority.php");

const CLM_TELNO = 0;
const CLM_TUWA = 1;
const CLM_TUWA_K = 2;
const CLM_TUWA_H = 3;
const CLM_WARI_K = 4;
const CLM_WARI_H = 5;
const CLM_TAX = 6;
const CLM_DETAILNO_K = 7;
const CLM_DETAILNO_H = 8;
const CLM_DETAILNO_TAX = 9;
const CLM_CODE_K = 10;
const CLM_CODE_H = 11;
const CLM_POSTID = 12;
const CLM_DETAILNO_TAIL = 13;
const CLM_TUWA_TAX = 100;
const CLM_NEW_TUWA_TAX = 101;
const CLM_NEW_WARI = 102;
const CLM_NEW_WARI_K = 103;
const CLM_NEW_WARI_H = 104;
const CLM_TUWA_OVER = 105;

//pactidの保存
//権限
//
//__construct
//コンストラクタ
//@author web
//@since 2017/01/26
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//setManageTableName
//テーブル名の設定
//@author web
//@since 2017/02/22
//
//@param mixed $name
//@access public
//@return void
//
//
//getBackUpTableNameList
//バックアップ対象のテーブル名一覧を返す
//@author web
//@since 2017/02/23
//
//@access public
//@return void
//
//
//setPactID
//pactidの設定と、それに対する初期化処理
//登録済みの電話番号などの一覧を取得する
//@author web
//@since 2017/02/02
//
//@param mixed $pactid
//@param mixed $mode
//@access public
//@return void
//
//
//getUtiwakeInfo
//内訳コードを返す
//@author web
//@since 2017/07/19
//
//@param mixed $code
//@access private
//@return void
//
//
//getASP
//ASP料金の取得。権限がない、設定されてない場合はNULLを返す
//@author web
//@since 2017/07/19
//
//@access public
//@return void
//
//
//getDetatailNo
//detailno取得
//@author date
//@since 2017/02/28
//
//@access private
//@return void
//
//
//outErrorInfo
//エラー出力
//@author web
//@since 2017/06/19
//
//@param mixed $title
//@param array $args
//@access private
//@return void
//
//
//getPrtelnoList
//対象の親番号一覧を取得する
//@author web
//@since 2017/06/19
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $prtelno
//@access private
//@return void
//
//
//getTelBill
//
//@author web
//@since 2017/06/29
//
//@param mixed $xx
//@param mixed $pactid
//@param mixed $carid
//@param mixed $prtelno
//@access public
//@return void
//
//
//getUtiwake
//指定した内訳コードの取得
//@author web
//@since 2017/07/10
//
//@param array $code_list
//@access private
//@return void
//
//private function getUtiwake($carid,array $code_list){
//		$str = "";
//		foreach( $code_list as $key => $value ){
//			if( $str != "" ){
//				$str .= ",";
//			}
//			$str .= $this->get_DB()->dbQuote($value,"text",true);
//		}		
//		$sql = "select code,name,taxtype from utiwake_tb where"
//					." carid=".$this->get_DB()->dbQuote($carid,"integer",true)
//					." and code in (".$str.")";
//		return $this->get_DB()->queryKeyAssoc( $sql );
//	}
//
//getPostRelation
//部署親子関係
//@author web
//@since 2017/07/05
//
//@param mixed $pactid
//@access public
//@return void
//
//
//checkProcessed
//対象の親番号は既に処理済みであるか確認
//@author web
//@since 2017/07/19
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $prtelno
//@access public
//@return void
//
//
//update_details
//更新処理
//@author web
//@since 2017/07/18
//
//@param mixed $H_tel
//@param mixed $k_type
//@param mixed $h_type
//@param mixed $t_type
//@access private
//@return void
//
//
//deleteASP
//対象のレコード削除
//@author web
//@since 2017/07/19
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $prtelno
//@param mixed $A_free_code_kazei
//@param mixed $A_free_code_hikazei
//@param mixed $tax_code
//@access private
//@return void
//
//
//update
//対象の会社の親番号を更新する
//arg_prtelnoがNULLの場合は、全ての親番号を対象とする
//
//@author web
//@since 2017/06/19
//
//@param mixed $pactid
//@param mixed $arg_prtelno
//@access public
//@return void
//
//public function update( $pactid,$carid,$arg_prtelno = NULL ){
//		//--------------------------------------------------------------------------------
//		//	DB更新
//		//--------------------------------------------------------------------------------
//		//	とらんざくしょん！
//		$this->get_DB()->beginTransaction();
//		//	内訳テーブルのみインサートする
//		if( !$this->execInsertData("utiwake_tb") ){
//			$this->get_DB()->rollback();	//	エラーの場合はロールバック
//			return false;
//		}
//		//	DBに反映する
//		$this->get_DB()->commit();
//		return true;
//	}
//
//__destruct
//デストラクタ
//@author web
//@since 2017/01/26
//
//@access public
//@return void
//
class ApportionDiscountModel extends ImportBaseModel {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.pactid = 0;
		this.utiwake = undefined;
		this.asp = undefined;
		this.A_Auth = Array();
	}

	setTableName() {
		if (is_null(this.tbno)) {
			return false;
		}

		this.tbname.tel_details_xx_tb = "tel_details_" + this.tbno + "_tb";
		return true;
	}

	getBackUpTableNameList() {
		return [this.tbname.tel_details_xx_tb];
	}

	setPactID(pactid, carid, asp_code, asx_code) //権限について
	//内訳の取得を行う
	//ASPが有効かチェック
	{
		this.pactid = pactid;
		var O_Auth = MtAuthority.singleton(pactid);
		this.A_Auth = O_Auth.getPactFuncIni();
		var sql = "select code,name,taxtype,codetype from utiwake_tb where" + " carid=" + this.get_DB().dbQuote(carid, "integer", true);
		this.utiwake = this.get_DB().queryKeyAssoc(sql);
		this.asp = undefined;

		if (-1 !== this.A_Auth.indexOf("fnc_asp")) //ASP利用料のチェック
			{
				sql = "select charge,manual from asp_charge_tb where" + " carid = " + this.get_DB().dbQuote(carid, "integer") + " and pactid = " + this.get_DB().dbQuote(pactid, "integer");
				this.asp = this.get_DB().queryRowHash(sql);

				if (is_null(this.asp)) {
					this.errorOut(1000, "pactid=" + pactid + "\u306F\u300CASP\u5229\u7528\u6599\u8868\u793A\u8A2D\u5B9A\u300D\u6A29\u9650\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u304C\u3001asp_charge_tb\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\n", 0, "", "");
				}

				if (!(undefined !== this.utiwake[asp_code])) {
					this.errorOut(1000, "pactid=" + pactid + "\u306F\u300CASP\u5229\u7528\u6599\u8868\u793A\u8A2D\u5B9A\u300D\u6A29\u9650\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u304C\u3001ASP\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\n", 0, "", "");
					this.asp = undefined;
				}

				if (!(undefined !== this.utiwake[asx_code])) {
					this.errorOut(1000, "pactid=" + pactid + "\u306F\u300CASP\u5229\u7528\u6599\u8868\u793A\u8A2D\u5B9A\u300D\u6A29\u9650\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u304C\u3001ASX\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\n", 0, "", "");
					this.asp = undefined;
				}

				if (is_null(this.asp)) {
					return false;
				}
			}

		return true;
	}

	getUtiwakeInfo(code) {
		if (undefined !== this.utiwake[code]) {
			return this.utiwake[code];
		}

		return undefined;
	}

	getASP() {
		if (is_null(this.asp)) {
			return undefined;
		}

		return this.asp.charge;
	}

	getDetailNo(telno) //登録されていないtelnoのdetailnoの初期化
	//カウンターを足しておく
	{
		if (!(undefined !== this.detailno[telno])) {
			this.detailno[telno] = 0;
		}

		var res = this.detailno[telno];
		this.detailno[telno]++;
		return res;
	}

	outErrorInfo(title, args: {} | any[] = Array()) //変数の表示
	{
		this.infoOut(title + "(" + __filename + "," + 237 + ")\n", 0);

		for (var key in args) {
			var value = args[key];
			this.infoOut("\t" + key + "=" + value + "\n", 0);
		}

		this.errorOut(1000, "\u505C\u6B62\u3057\u307E\u3057\u305F\n", 0, "", "");
	}

	getPrtelnoList(pactid, carid) //親番号一覧を返す
	{
		var sql = "select replace(prtelno,'-','') as idx ,true" + " from bill_prtel_tb " + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true);
		return this.get_DB().queryKeyAssoc(sql);
	}

	getTelBill(pactid, carid, prtelno, code_tuwa, code_kazei_waribiki, code_hikazei_waribiki, tax_kubun, code_tax, asp_code, asx_code) //tax_kubun[1]は合算
	//tax_kubun[4]は非対象等
	//code_kは、どの割引コードが使われていたか、複数の割引コードが使われていた場合の優先度の処理を行っている。
	//code_kとcode_hは割引通話のiniファイル上のkey。
	//例として、iniにて以下の設定がされているとして
	//FREE_CODE_KAZEI="A01|割引","210|割引"
	//請求の内訳がA01の場合、code_kには0、210なら1が入る。
	//また、A01と210が同時に使われていたらcode_kには0が入る。
	//--------------------------------------------------------------------------------------------
	//電話の一覧作成用。割引、消費税がない電話請求があったら電話の台数が正しく取れないので、その対策
	//--------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------
	//通話料のSQLを作成
	//--------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------
	//割引と税金のSQLを作成
	//--------------------------------------------------------------------------------------------
	//課税通話料の割引コードについて
	//非課税通話料の割引コードについて
	//税金コードもいれる
	//--------------------------------------------------------------------------------------------
	//通話料と割引料をunionして、集計を行う。これで各番号の通話料、割引料が算出できる
	//--------------------------------------------------------------------------------------------
	//部署情報を追加する
	//Hashだとカラム名のサイズが大きすぎたので、Assocのほうが良さげ・・
	//return $this->get_DB()->queryHash( $sql );
	//return $this->get_DB()->queryAssoc( $sql );
	{
		var sql_tel_list = "select" + " telno" + ",0 as charge" + ",0 as no" + ",null as code_k" + ",null as code_h" + ",false as is_tuwa" + ",0 as bill_type" + " from (" + " select" + " telno" + " from tel_details_" + this.tbno + "_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and prtelno=" + this.get_DB().dbQuote(prtelno, "text", true) + " group by telno" + ") as temp";
		var sql_tuwa = "select" + " telno" + ",charge" + ",0 as no" + ",null as code_k" + ",null as code_h" + ",true as is_tuwa" + ",case " + " when taxkubun = " + tax_kubun[1] + " then 1" + " when taxkubun = " + tax_kubun[4] + " then 2" + " end as bill_type" + " from tel_details_" + this.tbno + "_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and prtelno=" + this.get_DB().dbQuote(prtelno, "text", true) + " and code in (" + code_tuwa + ")";
		var sql_where_waribiki = "";
		var sql_code_k = "";
		var sql_code_h = "";

		for (var key in code_kazei_waribiki) //割引コードの指定
		//割引コードと対になる割引詳細文
		//複数のコードがあるならorを付ける
		//caseについて
		{
			var value = code_kazei_waribiki[key];
			var temp = "(det.code=" + value[0];
			temp += undefined !== value[1] ? " and hist.details1 = " + value[1] + ")" : ")";

			if (sql_where_waribiki != "") {
				sql_where_waribiki += " or ";
			}

			sql_where_waribiki += temp;
			sql_code_k += " when det.code = " + value[0] + " then " + key;
		}

		for (var key in code_hikazei_waribiki) //割引コードの指定
		//割引コードと対になる割引詳細文
		//複数のコードがあるならorを付ける
		//caseについて
		{
			var value = code_hikazei_waribiki[key];
			temp = "(det.code=" + value[0];
			temp += undefined !== value[1] ? " and hist.details1 = " + value[1] + ")" : ")";

			if (sql_where_waribiki != "") {
				sql_where_waribiki += " or ";
			}

			sql_where_waribiki += temp;
			sql_code_h += " when det.code = " + value[0] + " then " + key;
		}

		if (!!code_tax) {
			if (sql_where_waribiki != "") {
				sql_where_waribiki += " or ";
			}

			sql_where_waribiki += "( det.code in (" + code_tax + "))";
		}

		var sql_waribiki = "select" + " det.telno" + ",det.charge" + ",det.detailno as no" + ",case" + sql_code_k + " else null end as code_k" + ",case" + sql_code_h + " else null end as code_h" + ",false as is_tuwa" + ",case" + " when det.code in (" + code_tax + ") then 31" + " when det.taxkubun = " + tax_kubun[1] + " then 11" + " when det.taxkubun = " + tax_kubun[4] + " then 12" + " else null end as bill_type" + " from tel_details_" + this.tbno + "_tb as det" + " JOIN billhistory_" + this.tbno + "_tb hist on" + " hist.pactid=det.pactid" + " and hist.carid=det.carid" + " and hist.telno=det.telno" + " and hist.code=det.code" + " and hist.charge_details=det.charge" + " where" + " det.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and det.carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and det.prtelno=" + this.get_DB().dbQuote(prtelno, "text", true) + "and (" + sql_where_waribiki + ")";
		var sql_post_select = "";
		var sql_post_join = "";
		sql_post_select = ",tel.postid";
		sql_post_join = " join tel_" + this.tbno + "_tb tel on" + " tel.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tel.carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and tel.telno=det.telno";
		var sql = "select" + " det.telno" + ",sum(case when det.is_tuwa then det.charge else 0 end) as charge_tuwa" + ",sum(case when det.bill_type=1 then det.charge else 0 end) as charge_tuwa_k" + ",sum(case when det.bill_type=2 then det.charge else 0 end) as charge_tuwa_h" + ",sum(case when det.bill_type=11 then det.charge else 0 end) as charge_wari_k" + ",sum(case when det.bill_type=12 then det.charge else 0 end) as charge_wari_h" + ",sum(case when det.bill_type=31 then det.charge else 0 end) as tax" + ",min(case when det.bill_type=11 then det.no end) as detailno_k" + ",min(case when det.bill_type=12 then det.no end) as detailno_h" + ",min(case when det.bill_type=31 then det.no end) as detailno_tax" + ",min(det.code_k) as code_k" + ",min(det.code_h) as code_h" + sql_post_select + ",(" + " select max(detailno) from tel_details_" + this.tbno + "_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and telno=det.telno" + " and code not in (" + this.get_DB().dbQuote(asp_code, "text", true) + "," + this.get_DB().dbQuote(asp_code, "text", true) + ")" + ") as maxno" + " from ( (" + sql_tuwa + ") union all (" + sql_waribiki + ") union all (" + sql_tel_list + ")) as det" + sql_post_join + " group by det.telno" + sql_post_select + " order by charge_tuwa desc";
		return this.get_DB().queryAll(sql, MDB2_FETCHMODE_ORDERED, false);
	}

	getPostRelation(pactid) {
		var sql = "select " + " postidchild,postidparent,level" + " from post_relation_" + this.tbno + "_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " order by level";
		return this.get_DB().queryHash(sql);
	}

	checkProcessed(pactid, carid, prtelno, tdcomments: {} | any[]) {
		var sql = "select true  from tel_details_" + this.tbno + "_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and prtelno=" + this.get_DB().dbQuote(prtelno, "text", true) + " and tdcomment in (" + tdcomments.join(",") + ")";
		var res = this.get_DB().queryOne(sql);
		return is_null(res) ? false : true;
	}

	update_details(pactid, carid, prtelno, H_tel, update_k_type, insert_k_code, insert_k_detail, kazei_tdcomment, update_h_type, insert_h_code, insert_h_detail, hikazei_tdcomment, update_t_type, insert_t_code, insert_t_detail, tax_tdcomment, kubun_kazei, kubun_hikazei, A_free_code_kazei, A_free_code_hikazei, tax_code, tax_rate, asp_code, asx_code) //内訳テーブルの取得を行う
	//税金内訳コード名
	//差込テンプレ
	//税金合計
	//電話番号ごとに
	//割引、税額、ASP、ASXの削除。
	//差替え時のみ削除を行う
	//割引と税額レコードいれる
	//ASP利用料の追加。
	{
		var sql_insert = "";
		var recdate = this.get_DB().dbQuote(this.nowdate, "timestamp", true);
		var temp = this.getUtiwakeInfo(str_replace("'", "", tax_code));
		var tax_codename = this.get_DB().dbQuote(temp.name, "text", true);
		var temp_insert = {
			pactid: this.get_DB().dbQuote(pactid, "integer", true),
			telno: undefined,
			code: undefined,
			codename: this.get_DB().dbQuote(undefined, "text", true),
			charge: undefined,
			taxkubun: undefined,
			detailno: undefined,
			recdate: recdate,
			carid: this.get_DB().dbQuote(carid, "integer", true),
			tdcomment: this.get_DB().dbQuote(undefined, "text"),
			prtelno: this.get_DB().dbQuote(prtelno, "text", true),
			realcnt: this.get_DB().dbQuote(undefined, "integer")
		};
		var tax_total = 0;

		for (var key in H_tel) {
			var value = H_tel[key];
			tax_total += value[CLM_NEW_TUWA_TAX];
		}

		for (var key in H_tel) //電話番号
		//税区分
		//課税割引の更新作業
		//-----------------------------------------------------------------------------------
		//非課税
		//-----------------------------------------------------------------------------------
		//税区分
		//-----------------------------------------------------------------------------------
		//税金の対応
		//-----------------------------------------------------------------------------------
		{
			var value = H_tel[key];
			var add_no = 0;
			var detailno_tail = value[CLM_DETAILNO_TAIL] + 1 + add_no;
			temp_insert.telno = this.get_DB().dbQuote(value[CLM_TELNO], "text", true);
			temp_insert.taxkubun = kubun_kazei;
			temp_insert.tdcomment = kazei_tdcomment;

			if (update_k_type == "0") //-----------------------------------------------------------------------------------
				//差替え時の処理
				//-----------------------------------------------------------------------------------
				{
					if (value[CLM_NEW_WARI_K] != 0) //割引料金が発生している場合、insert文を作るよ
						//デフォルト値を入れましょう
						//割引額
						//既存のレコードがある場合は差額を入れる
						//既にデータがあるなら・・カンマつける
						{
							temp = temp_insert;
							temp.charge = this.get_DB().dbQuote(value[CLM_NEW_WARI_K], "integer", true);

							if (value[CLM_DETAILNO_K] > 0) //既にレコードがある場合は元のdetailnoの場所に入れる
								//並び順
								//内訳コード
								//コード名
								{
									var code = str_replace("'", "", A_free_code_kazei[value[CLM_CODE_K]][0]);
									var utiwake = this.getUtiwakeInfo(code);
									temp.detailno = this.get_DB().dbQuote(value[CLM_DETAILNO_K] + add_no, "integer", true);
									temp.code = A_free_code_kazei[value[CLM_CODE_K]][0];
									temp.codename = this.get_DB().dbQuote(utiwake.name, "text", false);
								} else //既存レコードがない場合は差込む
								//並び順
								//内訳コード
								//詳細
								{
									temp.detailno = this.get_DB().dbQuote(detailno_tail, "integer", true);
									temp.code = this.get_DB().dbQuote(insert_k_code, "text", true);
									temp.codename = this.get_DB().dbQuote(insert_k_detail, "text", true);
									detailno_tail++;
								}

							if (sql_insert != "") {
								sql_insert += ",";
							}

							sql_insert += "(" + temp.join(",") + ")";
						}
				} else //-----------------------------------------------------------------------------------
				//差込時
				//-----------------------------------------------------------------------------------
				//新しい割引額と現在の割引額の差を求める
				//差額がある場合は追記するぽよ
				{
					var wari = value[CLM_NEW_WARI_K] - value[CLM_WARI_K];

					if (wari != 0) //デフォルト値を入れましょう
						//割引額
						//並び順
						//内訳コード
						//詳細
						//既にデータがあるなら・・カンマつける
						{
							temp = temp_insert;
							temp.charge = this.get_DB().dbQuote(wari, "integer", true);
							temp.detailno = this.get_DB().dbQuote(detailno_tail, "integer", true);
							temp.code = this.get_DB().dbQuote(insert_k_code, "text", true);
							temp.codename = this.get_DB().dbQuote(insert_k_detail, "text", true);
							detailno_tail++;

							if (sql_insert != "") {
								sql_insert += ",";
							}

							sql_insert += "(" + temp.join(",") + ")";
						}
				}

			temp_insert.taxkubun = kubun_hikazei;
			temp_insert.tdcomment = hikazei_tdcomment;

			if (update_h_type == "0") //-----------------------------------------------------------------------------------
				//差替え時の処理
				//-----------------------------------------------------------------------------------
				{
					if (value[CLM_NEW_WARI_H] != 0) //割引料金が発生している場合、insert文を作るよ
						//デフォルト値を入れましょう
						//割引額
						//既存のレコードがある場合は差額を入れる
						//既にデータがあるなら・・カンマつける
						{
							temp = temp_insert;
							temp.charge = this.get_DB().dbQuote(value[CLM_NEW_WARI_H], "integer", true);

							if (value[CLM_DETAILNO_H] > 0) //既にレコードがある場合は元のdetailnoの場所に入れる
								//並び順
								//内訳コード
								//コード名
								{
									code = str_replace("'", "", A_free_code_hikazei[value[CLM_CODE_H]][0]);
									utiwake = this.getUtiwakeInfo(code);
									temp.detailno = this.get_DB().dbQuote(value[CLM_DETAILNO_H] + add_no, "integer", true);
									temp.code = A_free_code_hikazei[value[CLM_CODE_H]][0];
									temp.codename = this.get_DB().dbQuote(utiwake.name, "text", false);
								} else //既存レコードがない場合は差込む
								//並び順
								//内訳コード
								//詳細
								{
									temp.detailno = this.get_DB().dbQuote(detailno_tail, "integer", true);
									temp.code = this.get_DB().dbQuote(insert_h_code, "text", true);
									temp.codename = this.get_DB().dbQuote(insert_h_detail, "text", true);
									detailno_tail++;
								}

							if (sql_insert != "") {
								sql_insert += ",";
							}

							sql_insert += "(" + temp.join(",") + ")";
						}
				} else //-----------------------------------------------------------------------------------
				//差込時
				//-----------------------------------------------------------------------------------
				//新しい割引額と現在の割引額の差を求める
				//差額がある場合は追記するぽよ
				{
					wari = value[CLM_NEW_WARI_H] - value[CLM_WARI_H];

					if (wari != 0) //デフォルト値を入れましょう
						//割引額
						//並び順
						//内訳コード
						//詳細
						//既にデータがあるなら・・カンマつける
						{
							temp = temp_insert;
							temp.charge = this.get_DB().dbQuote(wari, "integer", true);
							temp.detailno = this.get_DB().dbQuote(detailno_tail, "integer", true);
							temp.code = this.get_DB().dbQuote(insert_h_code, "text", true);
							temp.codename = this.get_DB().dbQuote(insert_h_detail, "text", true);
							detailno_tail++;

							if (sql_insert != "") {
								sql_insert += ",";
							}

							sql_insert += "(" + temp.join(",") + ")";
						}
				}

			if (tax_total > 0) //税区分
				{
					temp_insert.taxkubun = this.get_DB().dbQuote(undefined, "text", false);
					temp_insert.tdcomment = tax_tdcomment;

					if (update_t_type == "0") //-----------------------------------------------------------------------------------
						//差替え時の処理
						//-----------------------------------------------------------------------------------
						{
							var charge = value[CLM_TAX] + value[CLM_NEW_TUWA_TAX] - value[CLM_TUWA_TAX];

							if (charge != 0) //デフォルト値を入れましょう
								//既存のレコードがある場合は差額を入れる
								//既にデータがあるなら・・カンマつける
								{
									temp = temp_insert;
									temp.charge = this.get_DB().dbQuote(charge, "integer", true);

									if (value[CLM_DETAILNO_TAX] > 0) //既にレコードがある場合は元のdetailnoの場所に入れる
										//並び順
										//内訳コード
										{
											temp.detailno = this.get_DB().dbQuote(value[CLM_DETAILNO_TAX] + add_no, "integer", true);
											temp.code = tax_code;
											temp.codename = tax_codename;
										} else //既存レコードがない場合は差込む
										//並び順
										//内訳コード
										//詳細
										{
											temp.detailno = this.get_DB().dbQuote(detailno_tail, "integer", true);
											temp.code = this.get_DB().dbQuote(insert_t_code, "text", true);
											temp.codename = this.get_DB().dbQuote(insert_t_detail, "text", true);
											detailno_tail++;
										}

									if (sql_insert != "") {
										sql_insert += ",";
									}

									sql_insert += "(" + temp.join(",") + ")";
								}
						} else //-----------------------------------------------------------------------------------
						//差込時
						//-----------------------------------------------------------------------------------
						//新しい割引額と現在の割引額の差を求める
						//差額がある場合は追記するぽよ
						{
							var tax = value[CLM_NEW_TUWA_TAX] - value[CLM_TUWA_TAX];

							if (tax != 0) //デフォルト値を入れましょう
								//割引額
								//並び順
								//内訳コード
								//詳細
								//既にデータがあるなら・・カンマつける
								{
									temp = temp_insert;
									temp.charge = this.get_DB().dbQuote(tax, "integer", true);
									temp.detailno = this.get_DB().dbQuote(detailno_tail, "integer", true);
									temp.code = this.get_DB().dbQuote(insert_t_code, "text", true);
									temp.codename = this.get_DB().dbQuote(insert_t_detail, "text", true);
									detailno_tail++;

									if (sql_insert != "") {
										sql_insert += ",";
									}

									sql_insert += "(" + temp.join(",") + ")";
								}
						}
				}
		}

		var sql_sum = "select sum(charge)  from tel_details_" + this.tbno + "_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and prtelno=" + this.get_DB().dbQuote(prtelno, "text", true);
		var sum_old = this.get_DB().queryOne(sql_sum);
		this.get_DB().beginTransaction();
		this.deleteASP(pactid, carid, prtelno, update_k_type == "0" ? A_free_code_kazei : undefined, update_h_type == "0" ? A_free_code_hikazei : undefined, update_t_type == "0" && tax_total > 0 ? tax_code : undefined, asp_code, asx_code);
		var res = this.get_DB().exec("insert into tel_details_" + this.tbno + "_tb" + " (pactid,telno,code,codename,charge,taxkubun,detailno,recdate,carid,tdcomment,prtelno,realcnt) values " + sql_insert);
		var asp_charge = this.getASP();

		if (!is_null(asp_charge)) {
			var asp = this.getUtiwakeInfo(asp_code);
			var asx = this.getUtiwakeInfo(asx_code);
			var sql = "insert into tel_details_" + this.tbno + "_tb (pactid,telno,code,codename,charge,taxkubun,detailno,recdate,carid,tdcomment,prtelno,realcnt)" + "(select" + " " + this.get_DB().dbQuote(pactid, "integer", true) + ",telno" + ",code" + ",codename" + ",charge" + ",null" + ",detailno + detailno_add" + "," + recdate + "," + this.get_DB().dbQuote(carid, "integer", true) + ",null" + ",null" + ",null" + " from" + " (" + "select telno,max(detailno) as detailno from tel_details_" + this.tbno + "_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and prtelno =" + this.get_DB().dbQuote(prtelno, "text", true) + " group by telno" + ") as tel_tb" + " join (" + " select" + " " + this.get_DB().dbQuote(asp_code, "text", true) + " as code" + "," + this.get_DB().dbQuote(asp.name, "text", true) + " as codename" + "," + this.get_DB().dbQuote(asp_charge, "integer", true) + " as charge" + ", 2 as detailno_add" + " union" + " select" + " " + this.get_DB().dbQuote(asx_code, "text", true) + " as code" + "," + this.get_DB().dbQuote(asx.name, "text", true) + " as codename" + "," + this.get_DB().dbQuote(+(asp_charge * tax_rate), "integer", true) + " as charge" + ", 3 as detailno_add" + ") asp on true" + ")";
			res = this.get_DB().exec(sql);
		}

		var sum_new = this.get_DB().queryOne(sql_sum);
		var error = false;

		if (sum_old == sum_new) {
			this.get_DB().commit();
		} else {
			error = true;
			this.get_DB().rollback();
		}

		return {
			error: error,
			sum_old: sum_old,
			sum_new: sum_new
		};
	}

	deleteASP(pactid, carid, prtelno, A_free_code_kazei, A_free_code_hikazei, tax_code, asp_code, asx_code) //課税通話料の割引コードについて
	//sql作成
	//削除SQLに書き換える
	{
		var sql_where_waribiki = "";

		if (!is_null(A_free_code_kazei)) {
			for (var key in A_free_code_kazei) //割引コードの指定
			//割引コードと対になる割引詳細文
			//複数のコードがあるならorを付ける
			{
				var value = A_free_code_kazei[key];
				var temp = "(det.code=" + value[0];
				temp += undefined !== value[1] ? " and hist.details1 = " + value[1] + ")" : ")";

				if (sql_where_waribiki != "") {
					sql_where_waribiki += " or ";
				}

				sql_where_waribiki += temp;
			}
		}

		if (!is_null(A_free_code_hikazei)) {
			for (var key in A_free_code_hikazei) //割引コードの指定
			//割引コードと対になる割引詳細文
			//複数のコードがあるならorを付ける
			{
				var value = A_free_code_hikazei[key];
				temp = "(det.code=" + value[0];
				temp += undefined !== value[1] ? " and hist.details1 = " + value[1] + ")" : ")";

				if (sql_where_waribiki != "") {
					sql_where_waribiki += " or ";
				}

				sql_where_waribiki += temp;
			}
		}

		if (!is_null(tax_code)) {
			if (!!tax_code) {
				if (sql_where_waribiki != "") {
					sql_where_waribiki += " or ";
				}

				sql_where_waribiki += "( det.code in (" + tax_code + "))";
			}
		}

		if (sql_where_waribiki != "") {
			sql_where_waribiki += " or ";
		}

		sql_where_waribiki += "( det.code in (" + this.get_DB().dbQuote(asp_code, "text", true) + "," + this.get_DB().dbQuote(asx_code, "text", true) + "))";
		var sql_tel = " select det.pactid,det.telno,det.carid,det.detailno,det.code" + " from" + " (select telno from tel_details_" + this.tbno + "_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and prtelno=" + this.get_DB().dbQuote(prtelno, "text", true) + " group by telno" + " ) as telno_list" + " JOIN tel_details_" + this.tbno + "_tb det on" + " det.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and det.telno=telno_list.telno" + " LEFT JOIN billhistory_" + this.tbno + "_tb hist on" + " hist.pactid=det.pactid" + " and hist.carid=det.carid" + " and hist.telno=det.telno" + " and hist.code=det.code" + " and hist.charge_details=det.charge" + " where " + sql_where_waribiki;
		var sql = "delete from tel_details_" + this.tbno + "_tb where (pactid,telno,carid,detailno,code) in (" + sql_tel + ")";
		return this.get_DB().exec(sql);
	}

	__destruct() {
		super.__destruct();
	}

};