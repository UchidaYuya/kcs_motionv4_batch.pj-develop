//ポイント調整　インポート(model)
//2008/03/07

import TweakModel from "../TweakModel";
import TelModel from "../TelModel";
import MtScriptAmbient from "../../MtScriptAmbient";
import PostModel from "../PostModel";
import MtTableUtil from "../../MtTableUtil";
import { sprintf } from "../../../db_define/define";

export default class TweakPointImportModel extends TweakModel {
	TweakPointTable: string;
	A_TweakPointTableT: any[];
	constructor(O_msa: MtScriptAmbient) {
		super(O_msa);
		this.TweakPointTable = "tweak_point_tb";
		this.A_TweakPointTableT = [["pactid", "integer", true], ["userpostid", "text", true], ["billdate", "date", true], ["d_thispoint", "integer"], ["d_usedpoint", "integer"], ["d_allpoint", "integer"], ["au_thispoint", "integer"], ["au_usedpoint", "integer"], ["au_allpoint", "integer"], ["count_flag", "integer"], ["recdate", "timestamp", true], ["fixdate", "timestamp", true]];
	}

	set_FormatCSV(H_format: {} | any[]) //$this->O_MtScriptAmbient->set_FormatCSV($H_format);
	{}

	get_ImportDataCSVHash(import_file: string) {
		var data;
		var H_point = Array();

		while (data = this.O_MtScriptAmbient.get_ImportDataCSVLine(import_file)) {
			if (false === Array.isArray(data) && -1 === data) {
				this.errorOut(0, "インポートファイルのフォーマットが不正です、ご確認ください。" + import_file + "\n");
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

	countPoint(H_point: {} | any[] | any) //部署ごとにサマリーしたハッシュ
	{
		var H_point_ex = Array();

		for (var upost in H_point) //事業者CDが9桁に満たなかった場合 左を0詰め
		//7桁に区切った事業所ID
		{
			var value = H_point[upost];

			// if (9 > mb_strlen(upost)) {
			if (9 > upost.split('').length) {
// 2022cvt_021
				var postid = sprintf("%09d", upost);
			} else {
				postid = upost;
			}

			postid = postid.substr(0, 7);

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

	tweakPointMonthBeforeFormat(pactid: number, yyyymm: { substr: (arg0: number, arg1: number) => number; }, H_data: { [x: string]: any; }, flag: any) {
		var now = this.getDB().getNow();
		var A_data = Array();

		for (var postid in H_data) {
			var value = H_data[postid];
			var H_tmp;
			H_tmp.pactid = pactid;
			H_tmp.postid = postid;
			H_tmp.billdate = new Date(yyyymm.substr(4, 2) - 1, yyyymm.substr(0, 4) -1, 1 );
			H_tmp.d_allpoint = value.docomo;
			H_tmp.au_allpoint = value.au;
			H_tmp.count_flag = flag;
			H_tmp.recdate = now;
			H_tmp.fixdate = now;
			A_data.push(H_tmp);
		}

		return A_data;
	}

	async selectAllPoint(pactid: string, yyyymm: string, flag: boolean) {
		var H_tmp = Array();
		var yyyymmdd = this.yyyymmConcierge(yyyymm, flag);
		var sql = "SELECT postid, d_allpoint, au_allpoint FROM tweak_point_tb WHERE billdate = '" + yyyymmdd + "' AND pactid = " + pactid;
		var A_tmp = await this.get_DB().queryHash(sql);

		for (var value of A_tmp) {
			H_tmp[value.postid].d_allpoint = value.d_allpoint;
			H_tmp[value.postid].au_allpoint = value.au_allpoint;
		}

		return H_tmp;
	}

	async pointPostFromTel(H_tel: any[], pactid: number, yyyymm: string) {
		let O_post = new PostModel();
		let H_point = Array();

		for (var telno in H_tel) //docomo
		{
			var value = H_tel[telno];
			var carid = "";

			if (value.docomo > 0) {
				let postid = await this.getTelPostid(pactid, telno, this.getSetting().get("car_docomo"), yyyymm);

				if (false == postid) {
					this.errorOut(1000, "電話番号（" + telno + "）が、第" + (this.getSetting().get("suo_cd_post_level") + 1) + "階層より上層に設定されています。\n");
					continue;
				}

				var tmp = await O_post.getPostData(postid, MtTableUtil.getTableNo(yyyymm));
				postid = tmp.userpostid;
				if (postid == Number(postid)) {
					postid = Number(postid);
					if (false == (undefined !== H_point[postid].d_thispoint)) {
						H_point[postid].d_usepoint = 0;
					}

					if (false == (undefined !== H_point[postid].d_usepoint)) {
						H_point[postid].d_usepoint = value.docomo;
					} else {
						H_point[postid].d_usepoint += value.docomo;
					}
				}
			}

			if (value.au > 0) {
				let postid = await this.getTelPostid(pactid, telno, this.getSetting().get("car_au"), yyyymm);

				if (false == postid) {
					this.errorOut(1000, "電話番号（" + telno + "）が、第" + (this.getSetting().get("suo_cd_post_level") + 1) + "階層より上層に設定されています。\n");
					continue;
				}

				tmp = O_post.getPostData(postid, MtTableUtil.getTableNo(yyyymm));
				postid = tmp.userpostid;
				if (postid == Number(postid)) {
					postid = Number(postid);
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
		}

		return H_point;
	}

	yyyymmConcierge(yyyymm: string, flag: boolean) {
		if (flag == true) {
			const month_minus = new Date().getMonth();
			var yyyymmdd = new Date().toJSON().slice(0,10).replace(/-/g,'-');
		} else {
			yyyymmdd = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
		}

		return yyyymmdd;
	}

	async selectRisePoint(pactid: string, yyyymm: string, flag: boolean) {
		var H_tmp = Array();
		var yyyymmdd = this.yyyymmConcierge(yyyymm, flag);
		var sql = "SELECT postid, d_thispoint, au_thispoint FROM tweak_point_tb WHERE billdate = '" + yyyymmdd + "' AND pactid = " + pactid;
		var A_tmp = await this.get_DB().queryHash(sql);

		for (var value of A_tmp) {
			H_tmp[value.postid].d_thispoint = value.d_thispoint;
			H_tmp[value.postid].au_thispoint = value.au_thispoint;
		}

		return H_tmp;
	}

	get_TableName() {
		return this.TweakPointTable;
	}

	async insertUpdate(A_point: string | any[]) {
		var rollback_flag = false;
		this.getDB().beginTransaction();

		for (var cnt = 0; cnt < A_point.length; cnt++) //update
		{
			var now = this.getDB().getNow();
			var select = "SELECT count(*) FROM tweak_point_tb WHERE pactid = " + A_point[cnt].pactid + " AND postid = '" + A_point[cnt].postid + "' AND billdate = '" + A_point[cnt].billdate + "'";
			var res = await this.getDB().queryOne(select);

			if (1 == res) {
				var update = "UPDATE tweak_point_tb" + " SET " + " d_usedpoint = " + A_point[cnt].d_usepoint + ", " + " d_allpoint = " + A_point[cnt].d_allpoint + ", " + " au_usedpoint = " + A_point[cnt].au_usepoint + ", " + " au_allpoint = " + A_point[cnt].au_allpoint + ", " + " fixdate = '" + now + "' " + " WHERE " + " pactid = " + A_point[cnt].pactid + " AND postid = '" + A_point[cnt].postid + "' AND billdate = '" + A_point[cnt].billdate + "'";
				res = this.getDB().exec(update);
			} else if (0 == res) {
				var insert = "INSERT INTO tweak_point_tb(" + "pactid," + "postid," + "billdate," + "d_thispoint," + "d_usedpoint," + "d_allpoint," + "au_thispoint," + "au_usedpoint," + "au_allpoint," + "recdate," + "fixdate" + " ) values( " + A_point[cnt].pactid + ", " + "'" + A_point[cnt].postid + "', " + "'" + A_point[cnt].billdate + "', " + A_point[cnt].d_thispoint + ", " + A_point[cnt].d_usepoint + ", " + A_point[cnt].d_allpoint + ", " + A_point[cnt].au_thispoint + ", " + A_point[cnt].au_usepoint + ", " + A_point[cnt].au_allpoint + ", " + "'" + now + "', " + "'" + now + "'" + ")";
				res = this.getDB().exec(insert);
			} else {
				this.errorOut(1000, "データの更新に失敗しました pactid[" + A_point[cnt].pactid + "] postid[" + A_point[cnt].postid + "] billdate[" + A_point[cnt].billdate + "]\n");
				res = false;
			}

			if (1 != res) {
				rollback_flag = true;
			}
		}

		if (true == rollback_flag) {
			this.errorOut(1000, "上記のエラーが発生しましたので、データの更新をいたしません。\n");
			this.getDB().rollback();
		}

		this.infoOut(A_point.length + "件データの更新に成功しました。");
		this.getDB().commit();
	}
};
