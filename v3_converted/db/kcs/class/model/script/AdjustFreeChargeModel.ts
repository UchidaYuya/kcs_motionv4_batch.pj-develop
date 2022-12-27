//
//請求明細無料通話調整処理 （Model）
//
//更新履歴：<br>
//2009/06/16 前田 聡 作成
//
//AdjustFreeChargeModel
//
//@package script
//@subpackage Model
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/06/16
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author maeda
//@since 2009/06/16
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//無料通話適用可能な通話料金を税区分（合算、個別、非課税）毎に取得する
//
//@author maeda
//@since 2009/07/01
//
//@param mixed $pactid：契約ＩＤ
//@param mixed $tableno：過去月テーブル番号
//@param mixed $carid：キャリアＩＤ
//@param array $A_code：対象内訳種別コード
//@access public
//@return array(telno => array(税区分 => 通話料金))
//
//
//無料通話適用可能な通話料の内、税区分が個別のもの内訳データを取得する
//
//@author maeda
//@since 2009/07/01
//
//@param mixed $pactid：契約ＩＤ
//@param mixed $tableno：過去月テーブル番号
//@param mixed $carid：キャリアＩＤ
//@param array $A_code：対象内訳種別コード
//@access public
//@return array(telno => array(内訳種別コード => 料金))
//
//
//勘定科目が基本料、その他、通話料（無料通話料適用外）で税区分が合算のものの合計金額を取得する
//
//@author maeda
//@since 2009/07/01
//
//@param mixed $pactid：契約ＩＤ
//@param mixed $tableno：過去月テーブル番号
//@param mixed $carid：キャリアＩＤ
//@param array $A_exceptCode：除外する内訳種別コード
//@access public
//@return array(telno => 税区分が合算のものの合計金額)
//
//
//勘定科目が基本料、その他、通話料（無料通話料適用外）で税区分が個別のものの個別に計算した消費税合計を取得する
//
//@author maeda
//@since 2009/07/01
//
//@param mixed $pactid：契約ＩＤ
//@param mixed $tableno：過去月テーブル番号
//@param mixed $carid：キャリアＩＤ
//@param array $A_exceptCode：除外する内訳種別コード
//@access public
//@return array(telno => 税区分が個別のものの個別に計算した消費税合計額)
//
//
//__destruct
//
//@author maeda
//@since 2009/06/16
//
//@access public
//@return void
//
class AdjustFreeChargeModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	getSumChargeTaxType(pactid, tableno, carid, A_code = Array()) //対象内訳種別コードの指定があった場合
	//ＳＱＬ実行
	//レコード件数取得
	//array(telno => array(税区分 => 通話料金))
	{
		var sql = "select td.telno,ut.taxtype,sum(td.charge) as charge from " + "tel_details_" + tableno + "_tb td inner join utiwake_tb ut on td.carid = ut.carid and td.code = ut.code " + "where td.pactid = " + pactid + " and " + "td.carid = " + carid + " and " + "ut.taxtype in ('" + this.getSetting().TAX_GASSAN + "','" + this.getSetting().TAX_KOBETSU + "','" + this.getSetting().TAX_HIKAZEI + "') ";

		if (0 != A_code.length) {
			sql += " and td.code in ('" + A_code.join("','") + "') ";
		}

		sql += "group by td.telno,ut.taxtype " + "order by td.telno,ut.taxtype";
		var H_rtn = this.getDB().queryHash(sql);
		var recCnt = H_rtn.length;
		var H_data = Array();

		for (var cnt = 0; cnt < recCnt; cnt++) {
			H_data[H_rtn[cnt].telno][H_rtn[cnt].taxtype] = H_rtn[cnt].charge;
		}

		return H_data;
	}

	getChargeKobetsu(pactid, tableno, carid, A_code = Array()) //対象内訳種別コードの指定があった場合
	//ＳＱＬ実行
	//レコード件数取得
	//array(telno => array(内訳種別コード => 料金))
	{
		var sql = "select td.telno,td.code,td.charge from " + "tel_details_" + tableno + "_tb td inner join utiwake_tb ut on td.carid = ut.carid and td.code = ut.code " + "where td.pactid = " + pactid + " and " + "td.carid = " + carid + " and " + "ut.taxtype = '" + this.getSetting().TAX_KOBETSU + "' ";

		if (0 != A_code.length) {
			sql += " and td.code in ('" + A_code.join("','") + "') ";
		}

		sql += "order by td.telno,td.code";
		var H_rtn = this.getDB().queryHash(sql);
		var recCnt = H_rtn.length;
		var H_data = Array();

		for (var cnt = 0; cnt < recCnt; cnt++) {
			H_data[H_rtn[cnt].telno][H_rtn[cnt].code] = H_rtn[cnt].charge;
		}

		return H_data;
	}

	getTelSumChargeGassan(pactid, tableno, carid, A_exceptCode = Array()) {
		var sql = "select td.telno,sum(td.charge) from " + "tel_details_" + tableno + "_tb td inner join utiwake_tb ut on td.carid = ut.carid and td.code = ut.code " + "where td.pactid = " + pactid + " and " + "td.carid = " + carid + " and " + "ut.taxtype = '" + this.getSetting().TAX_GASSAN + "' and " + "ut.codetype = '" + this.getSetting().CODE_TYPE + "'";

		if (0 != A_exceptCode.length) {
			sql += " and td.code not in ('" + A_exceptCode.join("','") + "')";
		}

		sql += " group by td.telno order by td.telno";
		return this.getDB().queryAssoc(sql);
	}

	getTelTaxKobetsu(pactid, tableno, carid, A_exceptCode = Array()) //明細毎に個別に消費税を計算（小数点以下切捨て）したものを集計する
	//除外する内訳種別コードの指定があった場合
	//ＳＱＬ実行
	//レコード件数取得
	//レコード件数分処理する
	{
		var sql = "select td.telno,td.charge * cast(" + this.getSetting().TAX_RATE + " as real) as charge from " + "tel_details_" + tableno + "_tb td inner join utiwake_tb ut on td.carid = ut.carid and td.code = ut.code " + "where td.pactid = " + pactid + " and " + "td.carid = " + carid + " and " + "ut.taxtype = '" + this.getSetting().TAX_KOBETSU + "' and " + "ut.codetype = '" + this.getSetting().CODE_TYPE + "'";

		if (0 != A_exceptCode.length) {
			sql += " and td.code not in ('" + A_exceptCode.join("','") + "')";
		}

		sql += " order by td.telno";
		var H_rtn = this.getDB().queryHash(sql);
		var recCnt = H_rtn.length;
		var H_data = Array();

		for (var counter = 0; counter < recCnt; counter++) //array(telno => 税区分が個別のものの個別に計算した消費税合計額)
		{
			if (false == (undefined !== H_data[H_rtn[counter].telno])) {
				H_data[H_rtn[counter].telno] = Math.floor(H_rtn[counter].charge);
			} else {
				H_data[H_rtn[counter].telno] += Math.floor(H_rtn[counter].charge);
			}
		}

		return H_data;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};