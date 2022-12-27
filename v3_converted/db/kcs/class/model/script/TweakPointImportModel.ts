//
//ポイント調整　インポート(model)
//
//更新履歴：<br>
//2008/03/07
//
//@uses TweakModel
//@package SUO
//@subpackage Model
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/07
//
//
//
//ポイント調整　インポート(model)
//
//@uses TweakModel
//@package SUO
//@subpackage Model
//@author ishizaki
//@since 2008/03/07
//

require("model/TweakModel.php");

require("model/TelModel.php");

//
//主に使用するテーブル名
//
//@var string
//@access private
//
//
//TweakPointTable のカラムと型
//
//@var array
//@access private
//
//
//コンストラクト
//
//@author ishizaki
//@since 2008/03/07
//
//@param MtScriptAmbient $O_mas
//@access public
//@return void
//
//
//MtScriptAmbient にCSVのフォーマットを設定
//
//@author ishizaki
//@since 2008/03/17
//
//@param array $H_format
//@access public
//@return void
//
//
//CSVのデータをハッシュにして返す
//
//@author ishizaki
//@since 2008/03/17
//
//@param text $import_file
//@access public
//@return array
//
//
//ポイント情報を事業所レベルでサマリーし、ハッシュで返す
//
//@author ishizaki
//@since 2008/03/17
//
//@param array $H_point
//@access public
//@return array
//
//
//前月までの累計ポイントを取り込む
//
//引数のpact と年月-1の月に取り込みデータを入力する。<br>
//フラグのタイプにより枝番部署レベル(0)か、事業所レベル(1)か変更できる。
//
//@author ishizaki
//@since 2008/03/19
//
//@param mixed $pactid
//@param mixed $yyyymm
//@param mixed $H_data
//@param mixed $flag
//@access public
//@return void
//
//
//累計ポイントを取得
//
//指定したpactid、年月から累計ポイントを取得する。<br>
//flagにtrueをセットすると指定した年月よりさらに一ヶ月前から検索をかける。
//
//@author ishizaki
//@since 2008/03/21
//
//@param integer $pactid
//@param String $yyyymm
//@param boolean $flag
//@access public
//@return array
//
//
//電話単位の請求データを部署単位（SUOの設定階層）に纏める
//
//@author ishizaki
//@since 2008/04/28
//
//@param mixed $H_tel
//@param mixed $yyyymm
//@access public
//@return void
//
//
//YYYYMM形式をYYYYMMDD形式に変換する
//
//YYYYMM形式の末尾に01を足して月初を演出する。<br>
//flag にtrueが入力されている場合は、先月に変換する<br>
//
//@author ishizaki
//@since 2008/03/21
//
//@param mixed $yyyymm
//@param mixed $flag
//@access public
//@return string
//
//
//発生ポイントの取得
//
//@author ishizaki
//@since 2008/03/21
//
//@param integer $pactid
//@param string $yyyymm
//@param boolean $flag
//@access public
//@return array
//
//
//メインで使用するテーブルの名前を返す
//
//@author ishizaki
//@since 2008/03/19
//
//@access public
//@return string
//
//
//insertUpdate
//
//@author ishizaki
//@since 2008/06/06
//
//@param mixed $A_point
//@access public
//@return void
//
class TweakPointImportModel extends TweakModel {
	constructor(O_msa: ?MtScriptAmbient = undefined) {
		super(O_msa);
		this.TweakPointTable = "tweak_point_tb";
		this.A_TweakPointTableT = [["pactid", "integer", true], ["userpostid", "text", true], ["billdate", "date", true], ["d_thispoint", "integer"], ["d_usedpoint", "integer"], ["d_allpoint", "integer"], ["au_thispoint", "integer"], ["au_usedpoint", "integer"], ["au_allpoint", "integer"], ["count_flag", "integer"], ["recdate", "timestamp", true], ["fixdate", "timestamp", true]];
	}

	set_FormatCSV(H_format: {} | any[]) //$this->O_MtScriptAmbient->set_FormatCSV($H_format);
	{}

	get_ImportDataCSVHash(import_file) {
		var data;
		var H_point = Array();

		while (data = this.O_MtScriptAmbient.get_ImportDataCSVLine(import_file)) {
			if (false === Array.isArray(data) && -1 === data) {
				this.errorOut(0, "\u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u4E0D\u6B63\u3067\u3059\u3001\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002" + import_file + "\n");
			}

			var telno = TelModel.telnoFromTelview(data[0]);

			if (false == (undefined !== data[1]) || "" == data[1]) {
				data[1] = 0;
			}

			if (false == (undefined !== data[2]) || "" == data[2]) {
				data[2] = 0;
			}

			H_point[telno].docomo = data[1];
			H_point[telno].au = data[2];
		}

		return H_point;
	}

	countPoint(H_point: {} | any[]) //部署ごとにサマリーしたハッシュ
	{
		var H_point_ex = Array();

		for (var upost in H_point) //事業者CDが9桁に満たなかった場合 左を0詰め
		//7桁に区切った事業所ID
		{
			var value = H_point[upost];

			if (9 > mb_strlen(upost)) {
				var postid = sprintf("%09d", upost);
			} else {
				postid = upost;
			}

			postid = mb_substr(postid, 0, 7);

			if (false == (undefined !== H_point_ex[postid])) {
				H_point_ex[postid].docomo = value.docomo;
				H_point_ex[postid].au = value.au;
			} else {
				H_point_ex[postid].docomo += value.docomo;
				H_point_ex[postid].au += value.au;
			}
		}

		return H_point_ex;
	}

	tweakPointMonthBeforeFormat(pactid, yyyymm, H_data, flag) {
		var now = this.getDB().getNow();
		var A_data = Array();

		for (var postid in H_data) {
			var value = H_data[postid];
			H_tmp.pactid = pactid;
			H_tmp.postid = postid;
			H_tmp.billdate = date("Y-m-d", mktime(0, 0, 0, yyyymm.substr(4, 2) - 1, 1, yyyymm.substr(0, 4)));
			H_tmp.d_allpoint = value.docomo;
			H_tmp.au_allpoint = value.au;
			H_tmp.count_flag = flag;
			H_tmp.recdate = now;
			H_tmp.fixdate = now;
			A_data.push(H_tmp);
		}

		return A_data;
	}

	selectAllPoint(pactid, yyyymm, flag) {
		var H_tmp = Array();
		var yyyymmdd = this.yyyymmConcierge(yyyymm, flag);
		var sql = "SELECT postid, d_allpoint, au_allpoint FROM tweak_point_tb WHERE billdate = '" + yyyymmdd + "' AND pactid = " + pactid;
		var A_tmp = this.get_DB().queryHash(sql);

		for (var value of Object.values(A_tmp)) {
			H_tmp[value.postid].d_allpoint = value.d_allpoint;
			H_tmp[value.postid].au_allpoint = value.au_allpoint;
		}

		return H_tmp;
	}

	pointPostFromTel(H_tel, pactid, yyyymm) {
		var O_post = new PostModel();
		var H_point = Array();

		for (var telno in H_tel) //docomo
		{
			var value = H_tel[telno];
			var carid = "";

			if (value.docomo > 0) {
				var postid = this.getTelPostid(pactid, telno, this.getSetting().car_docomo, yyyymm);

				if (false == postid) {
					this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + telno + "\uFF09\u304C\u3001\u7B2C" + (this.getSetting().suo_cd_post_level + 1) + "\u968E\u5C64\u3088\u308A\u4E0A\u5C64\u306B\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u3002\n");
					continue;
				}

				var tmp = O_post.getPostData(postid, MtTableUtil.getTableNo(yyyymm));
				postid = tmp.userpostid;

				if (false == (undefined !== H_point[postid].d_thispoint)) {
					H_point[postid].d_usepoint = 0;
				}

				if (false == (undefined !== H_point[postid].d_usepoint)) {
					H_point[postid].d_usepoint = value.docomo;
				} else {
					H_point[postid].d_usepoint += value.docomo;
				}
			}

			if (value.au > 0) {
				postid = this.getTelPostid(pactid, telno, this.getSetting().car_au, yyyymm);

				if (false == postid) {
					this.errorOut(1000, "\u96FB\u8A71\u756A\u53F7\uFF08" + telno + "\uFF09\u304C\u3001\u7B2C" + (this.getSetting().suo_cd_post_level + 1) + "\u968E\u5C64\u3088\u308A\u4E0A\u5C64\u306B\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u3002\n");
					continue;
				}

				tmp = O_post.getPostData(postid, MtTableUtil.getTableNo(yyyymm));
				postid = tmp.userpostid;

				if (false == (undefined !== H_point[postid].au_thispoint)) {
					H_point[postid].au_usepoint = 0;
				}

				if (false == (undefined !== H_point[postid].au_uespoint)) {
					H_point[postid].au_usepoint = value.au;
				} else {
					H_point[postid].au_usepoint += value.au;
				}
			}
		}

		return H_point;
	}

	yyyymmConcierge(yyyymm, flag) {
		if (flag == true) {
			var yyyymmdd = date("Y-m-d", mktime(0, 0, 0, yyyymm.substr(4, 2) - 1, 1, yyyymm.substr(0, 4)));
		} else {
			yyyymmdd = date("Y-m-d", mktime(0, 0, 0, yyyymm.substr(4, 2), 1, yyyymm.substr(0, 4)));
		}

		return yyyymmdd;
	}

	selectRisePoint(pactid, yyyymm, flag) {
		var H_tmp = Array();
		var yyyymmdd = this.yyyymmConcierge(yyyymm, flag);
		var sql = "SELECT postid, d_thispoint, au_thispoint FROM tweak_point_tb WHERE billdate = '" + yyyymmdd + "' AND pactid = " + pactid;
		var A_tmp = this.get_DB().queryHash(sql);

		for (var value of Object.values(A_tmp)) {
			H_tmp[value.postid].d_thispoint = value.d_thispoint;
			H_tmp[value.postid].au_thispoint = value.au_thispoint;
		}

		return H_tmp;
	}

	get_TableName() {
		return this.TweakPointTable;
	}

	insertUpdate(A_point) {
		var rollback_flag = false;
		this.getDB().beginTransaction();

		for (var cnt = 0; cnt < A_point.length; cnt++) //update
		{
			var now = this.getDB().getNow();
			var select = "SELECT count(*) FROM tweak_point_tb WHERE pactid = " + A_point[cnt].pactid + " AND postid = '" + A_point[cnt].postid + "' AND billdate = '" + A_point[cnt].billdate + "'";
			var res = this.getDB().queryOne(select);

			if (1 == res) {
				var update = "UPDATE tweak_point_tb" + " SET " + " d_usedpoint = " + A_point[cnt].d_usepoint + ", " + " d_allpoint = " + A_point[cnt].d_allpoint + ", " + " au_usedpoint = " + A_point[cnt].au_usepoint + ", " + " au_allpoint = " + A_point[cnt].au_allpoint + ", " + " fixdate = '" + now + "' " + " WHERE " + " pactid = " + A_point[cnt].pactid + " AND postid = '" + A_point[cnt].postid + "' AND billdate = '" + A_point[cnt].billdate + "'";
				res = this.getDB().exec(update);
			} else if (0 == res) {
				var insert = "INSERT INTO tweak_point_tb(" + "pactid," + "postid," + "billdate," + "d_thispoint," + "d_usedpoint," + "d_allpoint," + "au_thispoint," + "au_usedpoint," + "au_allpoint," + "recdate," + "fixdate" + " ) values( " + A_point[cnt].pactid + ", " + "'" + A_point[cnt].postid + "', " + "'" + A_point[cnt].billdate + "', " + A_point[cnt].d_thispoint + ", " + A_point[cnt].d_usepoint + ", " + A_point[cnt].d_allpoint + ", " + A_point[cnt].au_thispoint + ", " + A_point[cnt].au_usepoint + ", " + A_point[cnt].au_allpoint + ", " + "'" + now + "', " + "'" + now + "'" + ")";
				res = this.getDB().exec(insert);
			} else {
				this.errorOut(1000, "\u30C7\u30FC\u30BF\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F pactid[" + A_point[cnt].pactid + "] postid[" + A_point[cnt].postid + "] billdate[" + A_point[cnt].billdate + "]\n");
				res = false;
			}

			if (1 != res) {
				rollback_flag = true;
			}
		}

		if (true == rollback_flag) {
			this.errorOut(1000, "\u4E0A\u8A18\u306E\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u306E\u3067\u3001\u30C7\u30FC\u30BF\u306E\u66F4\u65B0\u3092\u3044\u305F\u3057\u307E\u305B\u3093\u3002\n");
			this.getDB().rollback();
		}

		this.infoOut(A_point.length + "\u4EF6\u30C7\u30FC\u30BF\u306E\u66F4\u65B0\u306B\u6210\u529F\u3057\u307E\u3057\u305F\u3002");
		this.getDB().commit();
	}

	__destruct() {
		super.__destruct();
	}

};