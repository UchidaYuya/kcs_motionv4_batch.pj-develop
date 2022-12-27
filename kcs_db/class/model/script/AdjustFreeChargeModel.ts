import ModelBase from "../../model/ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";

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
export default class AdjustFreeChargeModel extends ModelBase {
	O_msa: MtScriptAmbient;
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	async getSumChargeTaxType(pactid: string, tableno: string, carid: string, A_code = Array()) //対象内訳種別コードの指定があった場合
	//ＳＱＬ実行
	//レコード件数取得
	//array(telno => array(税区分 => 通話料金))
	{
// 2022cvt_016
// 2022cvt_015
		var sql = "select td.telno,ut.taxtype,sum(td.charge) as charge from " + "tel_details_" + tableno + "_tb td inner join utiwake_tb ut on td.carid = ut.carid and td.code = ut.code " + "where td.pactid = " + pactid + " and " + "td.carid = " + carid + " and " + "ut.taxtype in ('" + this.getSetting().get("TAX_GASSAN") + "','" + this.getSetting().get("TAX_KOBETSU") + "','" + this.getSetting().get("TAX_HIKAZEI") + "') ";

		if (0 != A_code.length) {
			sql += " and td.code in ('" + A_code.join("','") + "') ";
		}

// 2022cvt_016
		sql += "group by td.telno,ut.taxtype " + "order by td.telno,ut.taxtype";
// 2022cvt_015
		var H_rtn = await this.getDB().queryHash(sql);
// 2022cvt_015
		var recCnt = H_rtn.length;
// 2022cvt_015
		var H_data = Array();

// 2022cvt_015
		for (var cnt = 0; cnt < recCnt; cnt++) {
// 2022cvt_016
			H_data[H_rtn[cnt].telno][H_rtn[cnt].taxtype] = H_rtn[cnt].charge;
		}

		return H_data;
	}

	async getChargeKobetsu(pactid: string, tableno: string, carid: string, A_code = Array()) //対象内訳種別コードの指定があった場合
	//ＳＱＬ実行
	//レコード件数取得
	//array(telno => array(内訳種別コード => 料金))
	{
// 2022cvt_016
// 2022cvt_015
		var sql = "select td.telno,td.code,td.charge from " + "tel_details_" + tableno + "_tb td inner join utiwake_tb ut on td.carid = ut.carid and td.code = ut.code " + "where td.pactid = " + pactid + " and " + "td.carid = " + carid + " and " + "ut.taxtype = '" + this.getSetting().get("TAX_KOBETSU") + "' ";

		if (0 != A_code.length) {
			sql += " and td.code in ('" + A_code.join("','") + "') ";
		}

		sql += "order by td.telno,td.code";
// 2022cvt_015
		var H_rtn = await this.getDB().queryHash(sql);
// 2022cvt_015
		var recCnt = H_rtn.length;
// 2022cvt_015
		var H_data = Array();

// 2022cvt_015
		for (var cnt = 0; cnt < recCnt; cnt++) {
			H_data[H_rtn[cnt].telno][H_rtn[cnt].code] = H_rtn[cnt].charge;
		}

		return H_data;
	}

	getTelSumChargeGassan(pactid: string, tableno: string, carid: string, A_exceptCode = Array()) {
// 2022cvt_016
// 2022cvt_015
		var sql = "select td.telno,sum(td.charge) from " + "tel_details_" + tableno + "_tb td inner join utiwake_tb ut on td.carid = ut.carid and td.code = ut.code " + "where td.pactid = " + pactid + " and " + "td.carid = " + carid + " and " + "ut.taxtype = '" + this.getSetting().get("TAX_GASSAN") + "' and " + "ut.codetype = '" + this.getSetting().get("CODE_TYPE") + "'";

		if (0 != A_exceptCode.length) {
			sql += " and td.code not in ('" + A_exceptCode.join("','") + "')";
		}

		sql += " group by td.telno order by td.telno";
		return this.getDB().queryAssoc(sql);
	}

	async getTelTaxKobetsu(pactid, tableno, carid, A_exceptCode = Array()) //明細毎に個別に消費税を計算（小数点以下切捨て）したものを集計する
	//除外する内訳種別コードの指定があった場合
	//ＳＱＬ実行
	//レコード件数取得
	//レコード件数分処理する
	{
// 2022cvt_016
// 2022cvt_015
		var sql = "select td.telno,td.charge * cast(" + this.getSetting().get("TAX_RATE") + " as real) as charge from " + "tel_details_" + tableno + "_tb td inner join utiwake_tb ut on td.carid = ut.carid and td.code = ut.code " + "where td.pactid = " + pactid + " and " + "td.carid = " + carid + " and " + "ut.taxtype = '" + this.getSetting().get("TAX_KOBETSU") + "' and " + "ut.codetype = '" + this.getSetting().get("CODE_TYPE") + "'";

		if (0 != A_exceptCode.length) {
			sql += " and td.code not in ('" + A_exceptCode.join("','") + "')";
		}

		sql += " order by td.telno";
// 2022cvt_015
		var H_rtn = await this.getDB().queryHash(sql);
// 2022cvt_015
		var recCnt = H_rtn.length;
// 2022cvt_015
		var H_data = Array();

// 2022cvt_015
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

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
