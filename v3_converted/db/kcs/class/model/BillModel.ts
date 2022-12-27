//
//請求に関するモデル
//
//@filesource
//@package Base
//@subpackage Model
//@author maeda
//@since 2008/04/08
//@uses ModelBase
//@uses MtDBUtil
//@uses MtSetting
//@uses MtOutput
//
//
//
//請求に関するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author maeda
//@since 2008/04/08
//

require("MtDBUtil.php");

require("MtOutput.php");

require("MtSetting.php");

require("ModelBase.php");

//
//コンストラクタ
//
//@author maeda
//@since 2008/04/08
//
//@param mixed $O_db
//@access public
//@return void
//
//
//カードリスト取得
//
//@author
//@since 2010/12/02
//
//@param mixed $card_tb
//@param mixed $pactid
//@access public
//@return void
//
//
//内訳種別マスターを取得
//
//@author maeda
//@since 2008/04/08
//
//@param mixed $A_Carid : マスター取得するキャリアＩＤリスト
//@access public
//@return 内訳種別マスター array(CARID => array(CODE => array(name => XXX, taxtype => XXX, codetype => XXX)))
//
//更新履歴
//戻り値配列にcodetypeを追加 2008/07/31 s.maeda
//
//
//カード用内訳種別マスターを取得
//
//@author houshiyama
//@since 2010/11/30
//
//@param mixed $A_cardcoid : マスター取得するカード会社ＩＤリスト
//@access public
//@return 内訳種別マスター array(CARDCOID => array(CODE => array(name => XXX, taxtype => XXX)))
//
//
//購買用内訳種別マスターを取得
//
//@author maeda
//@since 2008/05/01
//
//@param mixed $A_purchcoid : マスター取得するキャリアＩＤリスト
//@access public
//@return 内訳種別マスター array(PURCHCOID => array(CODE => array(name => XXX, taxtype => XXX)))
//
//
//コピー機用内訳種別マスターを取得
//
//@author maeda
//@since 2008/06/27
//
//@param mixed $A_copycoid : マスター取得するキャリアＩＤリスト
//@access public
//@return 内訳種別マスター array(COPYCOID => array(CODE => array(name => XXX, taxtype => XXX)))
//
//
//運送用内訳種別マスターを取得
//
//@author miyazawa
//@since 2010/02/03
//
//@param mixed $A_trancoid : マスター取得するキャリアＩＤリスト
//@access public
//@return 内訳種別マスター array(TRANCOID => array(CODE => array(name => XXX, taxtype => XXX)))
//
//
//キャリア毎、電話毎でdetailnoの最大値を取得する
//
//@author maeda
//@since 2008/04/11
//
//@param mixed $pactid		pactid
//@param mixed $tableno	テーブル番号
//@param array $A_carid 	対象となるキャリアＩＤリスト（デフォルト全キャリア）
//@param array $A_exceptCode 	除外する内訳種別コード（デフォルト指定無し）
//@access public
//@return データ配列 array(carid => array(telno => 最大detailno))
//
//
//tel_details_X_tbよりデータを取得する
//
//@author maeda
//@since 2008/04/11
//
//@param mixed $pactid 	pactid
//@param mixed $tableno 	テーブル番号
//@param array $A_carid 	対象となるキャリアＩＤリスト（デフォルト全キャリア）
//@param array $A_code 	対象となる内訳種別コード（デフォルト全内訳種別コード）
//@access public
//@return データ配列 array(CARID => array(telno => array(detailno => DBDATA)))
//
//
//tel_details_X_tb からデータを削除する
//
//@author maeda
//@since 2008/04/11
//
//@param mixed $pactid 	契約ＩＤ
//@param mixed $tableno 	テーブル番号
//@param array $A_carid 	キャリアＩＤリスト
//@param array $A_code 	内訳種別コード
//@access public
//@return void
//
//
//commhistory_X_tb からデータを削除する
//
//@author maeda
//@since 2009/05/14
//
//@param mixed $A_pactid：契約ＩＤ
//@param mixed $tableno：テーブル番号
//@param array $A_carid：キャリアＩＤリスト
//@access public
//@return void
//
//
//card_details_X_tb からデータを削除する
//
//@author
//@since 2010/12/08
//
//@param mixed $pactid 	契約ＩＤ
//@param mixed $tableno 	テーブル番号
//@param array $A_coid 	カード会社IDリスト
//@param array $A_code 	内訳種別コード
//@access public
//@return void
//
//
//card_usehistory_X_tb からデータを削除する
//
//@author
//@since 2010/12/08
//
//@param mixed $A_pactid	契約ＩＤ
//@param mixed $tableno	テーブル番号
//@param array $A_coid	カード会社IDリスト
//@access public
//@return void
//
//
//purchase_details_X_tb からデータを削除する
//
//@author maeda
//@since 2008/07/01
//
//@param mixed $A_pactid 		契約ＩＤ
//@param mixed $tableno 		テーブル番号
//@param array $A_purchcoid 	キャリアＩＤリスト
//@param array $A_code 		内訳種別コード
//@access public
//@return void
//
//
//copy_details_X_tb からデータを削除する
//
//@author maeda
//@since 2008/07/01
//
//@param mixed $A_pactid		契約ＩＤ
//@param mixed $tableno 		テーブル番号
//@param array $A_copycoid 	キャリアＩＤリスト
//@param array $A_code 		内訳種別コード
//@access public
//@return void
//
//
//copy_history_X_tb からデータを削除する
//
//@author maeda
//@since 2008/07/02
//
//@param mixed $A_pactid		契約ＩＤ
//@param mixed $tableno 		テーブル番号
//@param array $A_copycoid 	キャリアＩＤリスト
//@access public
//@return void
//
//
//transit_usehistory_X_tb からデータを削除する
//
//@author miyazawa
//@since 2010/03/04
//
//@param mixed $A_pactid		契約ＩＤ
//@param mixed $tableno 		テーブル番号
//@param array $A_copycoid 	キャリアＩＤリスト
//@access public
//@return void
//
//
//transit_details_X_tb からデータを削除する
//
//@author miyazawa
//@since 2010/03/08
//
//@param mixed $A_pactid		契約ＩＤ
//@param mixed $tableno 		テーブル番号
//@param array $A_copycoid 	キャリアＩＤリスト
//@access public
//@return void
//
//
//ev_usehistory_X_tb からデータを削除する
//
//@author houshiyama
//@since 2010/08/09
//
//@param mixed $A_pactid		契約ＩＤ
//@param mixed $tableno 		テーブル番号
//@param array $A_copycoid 	キャリアＩＤリスト
//@access public
//@return void
//
//
//ev_details_X_tb からデータを削除する
//
//@author houshiyama
//@since 2010/08/09
//
//@param mixed $A_pactid		契約ＩＤ
//@param mixed $tableno 		テーブル番号
//@param array $A_copycoid 	キャリアＩＤリスト
//@access public
//@return void
//
//
//ＡＳＰ料金テーブルからＡＳＰ料金を取得する
//
//@author maeda
//@since 2008/05/02
//
//@param mixed $pactid		契約ＩＤ
//@param mixed $carid 		キャリアＩＤ
//@access public
//@return void
//
//
//カードＡＳＰ料金テーブルからＡＳＰ料金を取得する
//
//@author maeda
//@since 2010/11/29
//
//@param mixed $pactid 	契約ＩＤ
//@param mixed $cardcoid 	カード会社ＩＤ
//@access public
//@return void
//
//
//購買ＡＳＰ料金テーブルからＡＳＰ料金を取得する
//
//@author maeda
//@since 2008/05/02
//
//@param mixed $pactid 	契約ＩＤ
//@param mixed $purchcoid 	購買キャリアＩＤ
//@access public
//@return void
//
//
//コピー機ＡＳＰ料金テーブルからＡＳＰ料金を取得する
//
//@author maeda
//@since 2008/07/01
//
//@param mixed $pactid 	契約ＩＤ
//@param mixed $purchcoid 	コピー機ＩＤ
//@access public
//@return void
//
//
//運送ＡＳＰ料金テーブルからＡＳＰ料金を取得する
//
//@author miyazawa
//@since 2010/02/03
//
//@param mixed $pactid 	契約ＩＤ
//@param mixed $trancoid 	購買キャリアＩＤ
//@access public
//@return void
//
//
//EV ASP料金テーブルからASP料金を取得する
//
//@author houshiyama
//@since 2010/08/09
//
//@param mixed $pactid 	契約ＩＤ
//@param mixed $trancoid 	購買キャリアＩＤ
//@access public
//@return void
//
//
//ダミー電話番号と所属部署を取得する
//
//@author maeda
//@since 2009/01/16
//
//@param mixed $pactid 	契約ＩＤ
//@param mixed $carid 		キャリアＩＤ
//@param mixed $reqno 		請求書親番号
//@access public
//@return void
//
//
//親番号から契約ＩＤを取得する
//
//@author maeda
//@since 2009/02/10
//
//@param mixed $carid
//@param mixed $prtelno
//@access public
//@return void
//
//
//会社全体の回線数を請求明細より取得
//
//@author maeda
//@since 2009/07/02
//
//@param mixed $pactid：契約ＩＤ
//@param mixed $tableno：過去月テーブル番号
//@param mixed $carid：キャリアＩＤ
//@access public
//@return 回線数
//
//
//請求データの料金を集計する
//
//@author maeda
//@since 2009/07/02
//
//@param mixed $pactid：契約ＩＤ
//@param mixed $tableno：過去月テーブル番
//@param mixed $carid：キャリアＩＤ
//@param array $A_code：対象内訳種別コードリスト
//@param array $A_telno：対象電話番号リスト
//@access public
//@return 料金集計金額
//
//
//請求データから電話の所属部署を取得する
//
//@author maeda
//@since 2009/07/02
//
//@param mixed $pactid：契約ＩＤ
//@param mixed $tableno：過去月テーブル番
//@param mixed $carid：キャリアＩＤ
//@access public
//@return array(部署ＩＤ => 電話番号)
//
//
//__destruct
//
//@author maeda
//@since 2008/04/08
//
//@access public
//@return void
//
class BillModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getCardnoList(card_tb, pactid, delete_flg = false) {
		var sql = "select cardno from " + card_tb + " where pactid=" + pactid;

		if (delete_flg == true) {
			sql += " and delete_flg=true";
		} else {
			sql += " and delete_flg=false";
		}

		var A_result = this.getDB().queryCol(sql);
		return A_result;
	}

	getUtiwake(A_Carid) //内訳種別分処理する
	{
		var sql = "select carid,code,name,taxtype,codetype " + "from utiwake_tb " + "where carid in (" + A_Carid.join(",") + ") " + "order by carid,code";
		var H_result = this.getDB().queryHash(sql);
		var CodeCnt = H_result.length;
		var H_Utiwake = Array();

		for (var CodeCounter = 0; CodeCounter < CodeCnt; CodeCounter++) //array(CARID => array(CODE => array(NAME => XXX, TAXTYPE => YYYY)))
		{
			H_Utiwake[H_result[CodeCounter].carid][H_result[CodeCounter].code] = {
				name: H_result[CodeCounter].name,
				taxtype: H_result[CodeCounter].taxtype,
				codetype: H_result[CodeCounter].codetype
			};
		}

		return H_Utiwake;
	}

	getCardUtiwake(A_cardcoid) //内訳種別分処理する
	{
		var sql = "select cardcoid,code,name,taxtype " + "from card_utiwake_tb " + "where cardcoid in (" + A_cardcoid.join(",") + ") " + "order by cardcoid,code";
		var H_result = this.getDB().queryHash(sql);
		var CodeCnt = H_result.length;
		var H_Utiwake = Array();

		for (var CodeCounter = 0; CodeCounter < CodeCnt; CodeCounter++) //array(CARDCOID => array(CODE => array(NAME => XXX, TAXTYPE => YYYY)))
		{
			H_Utiwake[H_result[CodeCounter].cardcoid][H_result[CodeCounter].code] = {
				name: H_result[CodeCounter].name,
				taxtype: H_result[CodeCounter].taxtype
			};
		}

		return H_Utiwake;
	}

	getPurchaseUtiwake(A_purchcoid) //内訳種別分処理する
	{
		var sql = "select purchcoid,code,name,taxtype " + "from purchase_utiwake_tb " + "where purchcoid in (" + A_purchcoid.join(",") + ") " + "order by purchcoid,code";
		var H_result = this.getDB().queryHash(sql);
		var CodeCnt = H_result.length;
		var H_Utiwake = Array();

		for (var CodeCounter = 0; CodeCounter < CodeCnt; CodeCounter++) //array(PURCHCOID => array(CODE => array(NAME => XXX, TAXTYPE => YYYY)))
		{
			H_Utiwake[H_result[CodeCounter].purchcoid][H_result[CodeCounter].code] = {
				name: H_result[CodeCounter].name,
				taxtype: H_result[CodeCounter].taxtype
			};
		}

		return H_Utiwake;
	}

	getCopyUtiwake(A_copycoid) //内訳種別分処理する
	{
		var sql = "select copycoid,code,name,taxtype " + "from copy_utiwake_tb " + "where copycoid in (" + A_copycoid.join(",") + ") " + "order by copycoid,code";
		var H_result = this.getDB().queryHash(sql);
		var CodeCnt = H_result.length;
		var H_Utiwake = Array();

		for (var CodeCounter = 0; CodeCounter < CodeCnt; CodeCounter++) //array(COPYCOID => array(CODE => array(NAME => XXX, TAXTYPE => YYYY)))
		{
			H_Utiwake[H_result[CodeCounter].copycoid][H_result[CodeCounter].code] = {
				name: H_result[CodeCounter].name,
				taxtype: H_result[CodeCounter].taxtype
			};
		}

		return H_Utiwake;
	}

	getTransitUtiwake(A_trancoid) //内訳種別分処理する
	{
		var sql = "SELECT trancoid,code,name,taxtype " + "FROM transit_utiwake_tb " + "WHERE trancoid IN (" + A_trancoid.join(",") + ") " + "ORDER BY trancoid,code";
		var H_result = this.getDB().queryHash(sql);
		var CodeCnt = H_result.length;
		var H_Utiwake = Array();

		for (var CodeCounter = 0; CodeCounter < CodeCnt; CodeCounter++) //array(TRANCOID => array(CODE => array(NAME => XXX, TAXTYPE => YYYY)))
		{
			H_Utiwake[H_result[CodeCounter].trancoid][H_result[CodeCounter].code] = {
				name: H_result[CodeCounter].name,
				taxtype: H_result[CodeCounter].taxtype
			};
		}

		return H_Utiwake;
	}

	getMaxDetailnoList(pactid, tableno, A_carid = Array(), A_exceptCode = Array()) //carid 指定があった場合
	//レコード数
	//１行ずつ処理し連想配列に格納する array(CARID => array(telno => MaxDetailno))
	{
		var H_dbData = Array();
		var sql = "select carid,telno,max(detailno) " + "from tel_details_" + tableno + "_tb " + "where pactid = " + pactid + " ";

		if (0 != A_carid.length) {
			sql += "and carid in (" + A_carid.join(",") + ") ";
		}

		if (0 != A_exceptCode.length) {
			sql += "and code not in ('" + A_exceptCode.join("','") + "') ";
		}

		sql += "group by carid,telno " + "order by carid,telno";
		var H_result = this.getDB().queryHash(sql);
		var recCnt = H_result.length;

		for (var recCounter = 0; recCounter < recCnt; recCounter++) {
			H_dbData[H_result[recCounter].carid][H_result[recCounter].telno] = H_result[recCounter].max;
		}

		return H_dbData;
	}

	getTelDetailsData(pactid, tableno, A_carid = Array(), A_code = Array()) //carid 指定があった場合
	//レコード数
	//１行ずつ処理し連想配列に格納する array(CARID => array(telno => array(detailno => DBDATA)))
	{
		var H_dbData = Array();
		var sql = "select * " + "from tel_details_" + tableno + "_tb " + "where pactid = " + pactid + " ";

		if (0 != A_carid.length) {
			sql += "and carid in (" + A_carid.join(",") + ") ";
		}

		if (0 != A_code.length) {
			sql += "and code in ('" + A_code.join("','") + "') ";
		}

		sql += "order by carid,telno,detailno";
		var H_result = this.getDB().queryHash(sql);
		var recCnt = H_result.length;

		for (var recCounter = 0; recCounter < recCnt; recCounter++) {
			H_dbData[H_result[recCounter].carid][H_result[recCounter].telno][H_result[recCounter].detailno] = {
				pactid: H_result[recCounter].pactid,
				code: H_result[recCounter].code,
				codename: H_result[recCounter].codename,
				charge: H_result[recCounter].charge,
				taxkubun: H_result[recCounter].taxkubun,
				recdate: H_result[recCounter].recdate,
				tdcomment: H_result[recCounter].tdcomment,
				prtelno: H_result[recCounter].prtelno,
				realcnt: H_result[recCounter].realcnt
			};
		}

		return H_dbData;
	}

	delTelDetailsData(A_pactid, tableno, A_carid = Array(), A_code = Array()) //carid 指定があった場合
	{
		var sql = "delete from tel_details_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_carid.length) {
			sql += "and carid in (" + A_carid.join(",") + ") ";
		}

		if (0 != A_code.length) {
			sql += "and code in ('" + A_code.join("','") + "') ";
		}

		return this.getDB().exec(sql);
	}

	delCommhistoryData(A_pactid, tableno, A_carid = Array()) //carid 指定があった場合
	{
		var sql = "delete from commhistory_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_carid.length) {
			sql += "and carid in (" + A_carid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delCardDetailsData(A_pactid, tableno, A_coid = Array(), A_code = Array()) //cardcoid 指定があった場合
	{
		var sql = "delete from card_details_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_coid.length) {
			sql += "and cardcoid in (" + A_coid.join(",") + ") ";
		}

		if (0 != A_code.length) {
			sql += "and code in ('" + A_code.join("','") + "') ";
		}

		return this.getDB().exec(sql);
	}

	delCardUsehistoryData(A_pactid, tableno, A_coid = Array()) //carid 指定があった場合
	{
		var sql = "delete from card_usehistory_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_coid.length) {
			sql += "and cardcoid in (" + A_coid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delPurchaseDetailsData(A_pactid, tableno, A_purchcoid = Array(), A_code = Array()) //purchcoid 指定があった場合
	{
		var sql = "delete from purchase_details_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_purchcoid.length) {
			sql += "and purchcoid in (" + A_purchcoid.join(",") + ") ";
		}

		if (0 != A_code.length) {
			sql += "and code in ('" + A_code.join("','") + "') ";
		}

		return this.getDB().exec(sql);
	}

	delCopyDetailsData(A_pactid, tableno, A_copycoid = Array(), A_code = Array()) //copycoid 指定があった場合
	{
		var sql = "delete from copy_details_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_copycoid.length) {
			sql += "and copycoid in (" + A_copycoid.join(",") + ") ";
		}

		if (0 != A_code.length) {
			sql += "and code in ('" + A_code.join("','") + "') ";
		}

		return this.getDB().exec(sql);
	}

	delCopyHistoryData(A_pactid, tableno, A_copycoid = Array()) //copycoid 指定があった場合
	{
		var sql = "delete from copy_history_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_copycoid.length) {
			sql += "and copycoid in (" + A_copycoid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delTransitUseHistoryData(A_pactid, tableno, A_trancoid = Array()) //trancoid 指定があった場合
	{
		var sql = "DELETE from transit_usehistory_" + tableno + "_tb " + "WHERE pactid IN (" + A_pactid.join(",") + ") ";

		if (0 != A_trancoid.length) {
			sql += "and trancoid in (" + A_trancoid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delTransitDetailsData(A_pactid, tableno, A_trancoid = Array()) //trancoid 指定があった場合
	{
		var sql = "DELETE from transit_details_" + tableno + "_tb " + "WHERE pactid IN (" + A_pactid.join(",") + ") ";

		if (0 != A_trancoid.length) {
			sql += "and trancoid in (" + A_trancoid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delEvUseHistoryData(A_pactid, tableno, A_coid = Array()) //未確定に対応 20100924miya
	//evcoid 指定があった場合
	{
		if ("" == tableno) {
			var table = "ev_usehistory_tb";
		} else {
			table = "ev_usehistory_" + tableno + "_tb";
		}

		var sql = "DELETE from " + table + " " + "WHERE pactid IN (" + A_pactid.join(",") + ") ";

		if (0 != A_coid.length) {
			sql += "and evcoid in (" + A_coid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delEvDetailsData(A_pactid, tableno, A_coid = Array()) //未確定に対応 20100924miya
	//evcoid 指定があった場合
	{
		if ("" == tableno) {
			var table = "ev_details_tb";
		} else {
			table = "ev_details_" + tableno + "_tb";
		}

		var sql = "DELETE from " + table + " " + "WHERE pactid IN (" + A_pactid.join(",") + ") ";

		if (0 != A_coid.length) {
			sql += "and evcoid in (" + A_coid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delHealthcareRecHistoryData(A_pactid, tableno, A_healthcoid = Array()) //trancoid 指定があった場合
	{
		var sql = "DELETE from healthcare_rechistory_" + tableno + "_tb " + "WHERE pactid IN (" + A_pactid.join(",") + ") ";

		if (0 != A_healthcoid.length) {
			sql += "and healthcoid in (" + A_healthcoid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	getAspCharge(pactid, carid) {
		var sql = "select charge from asp_charge_tb " + "where pactid = " + pactid + " " + "and carid = " + carid;
		return this.getDB().queryOne(sql);
	}

	getCardAspCharge(pactid, cardcoid) {
		var sql = "select charge from card_asp_charge_tb " + "where pactid = " + pactid + " " + "and cardcoid = " + cardcoid;
		return this.getDB().queryOne(sql);
	}

	getPurchaseAspCharge(pactid, purchcoid) {
		var sql = "select charge from purchase_asp_charge_tb " + "where pactid = " + pactid + " " + "and purchcoid = " + purchcoid;
		return this.getDB().queryOne(sql);
	}

	getCopyAspCharge(pactid, copycoid) {
		var sql = "select charge from copy_asp_charge_tb " + "where pactid = " + pactid + " " + "and copycoid = " + copycoid;
		return this.getDB().queryOne(sql);
	}

	getTransitAspCharge(pactid, trancoid) {
		var sql = "SELECT charge FROM transit_asp_charge_tb " + "WHERE pactid = " + pactid + " " + "AND trancoid = " + trancoid;
		return this.getDB().queryOne(sql);
	}

	getEvAspCharge(pactid, coid) {
		var sql = "SELECT charge FROM ev_asp_charge_tb " + "WHERE pactid = " + pactid + " " + "AND evcoid = " + coid;
		return this.getDB().queryOne(sql);
	}

	getDummy(pactid, carid, reqno = "", tableNo = "") //親番号が指定されている場合
	//dummy_tb から所属部署ＩＤが取得できた場合
	{
		var sql = "select telno,postid from dummy_tel_tb " + "where pactid = " + pactid + " and " + "carid = " + carid;

		if ("" != reqno.trim()) {
			sql = sql + " and reqno = '" + reqno + "'";
		}

		var H_data = this.getDB().queryHash(sql);

		if (H_data.length != 0 && H_data[0].postid != "") //本当にpost_X_tb に存在しているかチェックする
			//post_X_tb に部署が存在しなかった場合はdummy_tb で取得した部署ＩＤはなかったことにする
			{
				var tableName = "post_";

				if (tableNo != "") {
					tableName = tableName + tableNo + "_tb";
				} else {
					tableName = tableName + "_tb";
				}

				sql = "select postid from " + tableName + " where pactid = " + pactid + " and postid = " + H_data[0].postid;
				var rtn = this.getDB().queryOne(sql);

				if ("" == rtn) {
					H_data[0].postid = "";
				}
			}

		return H_data;
	}

	getPactid(carid, prtelno) //親番号の登録が無かった場合
	{
		var sql = "select pactid from bill_prtel_tb " + "where carid = " + carid + " and " + "prtelno = '" + prtelno + "'";
		var rtn = this.getDB().queryOne(sql);

		if ("" == rtn) //親番号の登録があった場合
			{
				return false;
			} else {
			return rtn;
		}
	}

	getTelCnt(pactid, tableno, carid) {
		var sql = "select count(distinct telno) from tel_details_" + tableno + "_tb " + "where pactid = " + pactid + " and " + "carid = " + carid;
		return this.getDB().queryOne(sql);
	}

	getSumCharge(pactid, tableno, carid, A_code = Array(), A_telno = Array()) {
		var sql = "select sum(charge) from tel_details_" + tableno + "_tb " + "where pactid = " + pactid + " and " + "carid = " + carid;

		if (0 != A_code.length) {
			sql += " and code in ('" + A_code.join("','") + "') ";
		}

		if (0 != A_telno.length) {
			sql += " and telno in ('" + A_telno.join("','") + "') ";
		}

		return this.getDB().queryOne(sql);
	}

	getPostidTelno(pactid, tableno, carid) {
		var sql = "select distinct te.postid,td.telno " + "from tel_details_" + tableno + "_tb td inner join tel_" + tableno + "_tb te " + "on td.carid = te.carid and td.pactid = te.pactid and td.telno = te.telno " + "where td.pactid = " + pactid + " and " + "td.carid = " + carid + " " + "order by te.postid,td.telno";
		var H_rtn = this.getDB().queryHash(sql);
		var recCnt = H_rtn.length;
		var H_data = Array();

		for (var counter = 0; counter < recCnt; counter++) {
			if (false == (undefined !== H_data[H_rtn[counter].postid])) {
				H_data[H_rtn[counter].postid] = [H_rtn[counter].telno];
			} else {
				H_data[H_rtn[counter].postid].push(H_rtn[counter].telno);
			}
		}

		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};