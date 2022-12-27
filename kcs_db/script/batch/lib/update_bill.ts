import TableNo, * as script_db from "../../batch/lib/script_db";
import { G_KAMOKU_LIMIT } from "../../batch/lib/script_common";
import DBAdaptorCarid from "../../batch/lib/update_tel_bill";
import { G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING, ScriptLogBase } from "../../batch/lib/script_log";
import { ScriptDB } from "../../batch/lib/script_db";

//bill_X_tbの集計種別
//kousi_bill_X_tbの集計種別
//summary_bill_X_tbの集計種別
//集計種別の個数
//部署情報の最大階層数
//集計種別 => 集計パラメータ
//集計パラメータは以下のハッシュ
//ただし、テーブル名の%1は番号で置き換える
//inserter => データ挿入型
//src => 集計元のテーブル名
//tgt => 集計先のテーブル名
//column => array(カラム名)
//phone => 回線数を集計するならカラム名
//処理しない集計パラメータは、inserterがnullを指している
//summaryのcolumnは、当初は空配列
//処理が必要な集計種別
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：有効な集計種別のデータ挿入インスタンスを設定する
//引数：集計種別
//データ挿入インスタンス
//機能：集計先テーブルから古いデータを削除する
//引数：顧客ID
//キャリアID(空文字列なら全キャリア)
//年
//月
//保存先ファイル名(空文字列ならファイル保存せず)
//集計種別
//返値：深刻なエラーが発生したらfalseを返す
//機能：bill_X_tbを作る
//引数：顧客ID
//請求情報のあるキャリアだけを集計するならtrue
//キャリアID(空文字列なら全キャリア)
//年
//月
//数式マスター(summary_bill_tbを作成する場合のみ)
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//以下protected
//機能：集計先のテーブル名を返す
//引数：集計パラメータ
//テーブル番号
//返値：テーブル名
//機能：集計元のテーブル名を返す
//引数：集計パラメータ
//テーブル番号
//返値：テーブル名
//機能：集計が必要なキャリアを絞り込む
//引数：顧客ID
//請求情報のあるキャリアだけを集計するならtrue
//キャリアID
//テーブル番号
//返値：array(集計キャリア => array(対象キャリア))
//機能：部署の連係情報を作る
//引数：トップの部署IDを返す
//array(親部署 => 直下の子部署)を返す
//array(親部署 => 全ての配下部署)を返す
//顧客ID
//テーブル番号
//返値：深刻なエラーが発生したらfalseを返す
//備考：直下の子部署にも、全ての配下部署にも、親部署を含まない
//機能：連係情報にループが無い事を確認しつつ、全ての配下部署を作る
//引数：全ての配下部署を作成して返す
//配下部署を返す
//ここまで出現した部署ID
//処理レベル
//連係情報
//注目している部署ID
//返値：ループがあるか、部署ツリーが深すぎるならfalseを返す
//備考：再帰呼び出しを行う
//機能：集計種別毎・部署毎・キャリア毎のダミー回線数を返す
//引数：array(集計種別 => 集計パラメータ)
//顧客ID
//テーブル番号
//返値：array(集計種別 => 部署ID => array(キャリアID => ダミー回線数)))
//機能：部署移動した回線数を返す
//引数：array(集計種別 => 集計パラメータ)
//顧客ID
//テーブル番号
//array(親部署 => 全ての配下部署)
//返値：array(集計種別 => 部署ID => array(キャリアID => 減算が必要な回線数)))
//機能：一個の部署を処理する
//引数：配下部署の合計を返す
//注目している部署ID
//顧客ID
//テーブル番号
//array(集計キャリアID => array(対象キャリアID))
//array(親部署 => 直下の子部署)
//集計種別毎・部署毎・キャリア毎のダミー回線数
//集計種別毎・部署毎・キャリア毎の移動回線数
//array(集計種別 => 集計パラメータ)
//備考：再帰的に呼び出される
//備考：配下部署の合計は、以下の形式
//array(
//集計種別 => array(
//キャリアID => array(
//カラム名 => 全ての配下部署の合計,
//)
//)
//)
//ただし、集計キャリアの結果は含まない
//ただし、部署移動の回線数減算処理は行っていない
//返値：深刻なエラーが発生したらfalseを返す
//機能：自部署・各キャリアの集計を行う
//引数：自部署の合計を返す
//注目している部署ID
//顧客ID
//テーブル番号
//array(集計キャリアID => array(対象キャリアID))
//集計種別毎・部署毎・キャリア毎のダミー回線数
//array(集計種別 => 集計パラメータ)
//返値：深刻なエラーが発生したらfalseを返す
//機能：配下部署・各キャリアの集計を行う
//引数：配下部署の合計を返す(重複回線の補正前)
//配下部署の合計を返す(重複回線の補正後)
//自部署の合計
//注目している部署ID
//顧客ID
//テーブル番号
//array(集計キャリアID => array(対象キャリアID))
//array(親部署 => 直下の子部署)
//集計種別毎・部署毎・キャリア毎のダミー回線数
//集計種別毎・部署毎・キャリア毎の移動回線数
//array(集計種別 => 集計パラメータ)
//返値：深刻なエラーが発生したらfalseを返す
//備考：executePostを再帰的に呼び出す
//備考：自部署か配下部署の全キャリアの集計を行う
//引数：集計結果
//フラグ
//注目している部署ID
//顧客ID
//テーブル番号
//array(集計キャリアID => array(対象キャリアID))
//array(集計種別 => 集計パラメータ)
//返値：深刻なエラーが発生したらfalseを返す
//機能：集計種別毎の結果を加算する
//引数：加算した結果を返す
//加算するハッシュ(集計種別 => キャリア毎の結果)
//機能：キャリア毎の結果を加算する
//引数：加算した結果を返す
//加算するハッシュ(キャリアID => カラム名毎の結果)
//機能：カラム名毎の結果を加算する
//引数：加算した結果を返す
//加算するハッシュ(カラム名 => 金額など)
//機能：空の結果を返す
//引数：集計パラメータ
//キャリアID
export default class UpdateBill extends DBAdaptorCarid {
	m_A_param: any;
	m_A_index!: any[];
	DBAdaptorCarid: any;
	getTableNo: any;
	putError: any;
	escape: any;
	m_db: any;
	m_H_carid_all: any[][] | undefined;

	static g_index_bill = 0;
	static g_index_kousi = 1;
	static g_index_summary = 2;
	static g_index_size = 3;
	static g_postid_nest = 128;

	UpdateBill(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo) //集計パラメータを作るが、一部は未処理
	//inserterは無い
	//summary_bill_X_tbのcolumnは空配列
	//bill_X_tbの集計パラメータ
	//kousi_bill_X_tbの集計パラメータ
	//summary_bill_X_tbの集計パラメータ
	//この時点では、処理が必要な集計種別は無い
	{
		this.DBAdaptorCarid(listener, db, table_no);
		this.m_A_param[UpdateBill.g_index_bill] = {
			inserter: undefined,
			src: "tel_bill_%1_tb",
			tgt: "bill_%1_tb",
			column: "charge,excise,aspcharge,aspexcise,point".split(","),
			phone: "phone"
		};

// 2022cvt_015
		for (var cnt = 0; cnt < G_KAMOKU_LIMIT; ++cnt) this.m_A_param[UpdateBill.g_index_bill].column.push("kamoku" + (1 + cnt));

		this.m_A_param[UpdateBill.g_index_kousi] = {
			inserter: undefined,
			src: "kousi_tel_bill_%1_tb",
			tgt: "kousi_bill_%1_tb",
			column: ["publiccharge", "publictax", "privatecharge", "privatetax", "charge", "tax"],
			phone: "phone"
		};
		this.m_A_param[UpdateBill.g_index_summary] = {
			inserter: undefined,
			src: "summary_tel_bill_%1_tb",
			tgt: "summary_bill_%1_tb",
			column: Array(),
			phone: ""
		};
		this.m_A_index = Array();
	}

	setInserter(index: number, O_inserter: script_db.TableInserter) {
		if (!(undefined !== this.m_A_param[index])) return;
		this.m_A_param[index].inserter = O_inserter;
		if (!(-1 !== this.m_A_index.indexOf(index))) this.m_A_index.push(index);
	}

	async delete(pactid: string, carid: string, year: string, month: string, fname: string | any[], index: number) //削除対象のキャリアIDを決定する
	//SQL文のFROM以降を作る
	{
// 2022cvt_015
		var table_no = this.getTableNo(year, month);
// 2022cvt_015
		var H_carid = await this.getCarid(pactid, false, carid, table_no);

		if (!H_carid.length) //対象のキャリアが無かった
			{
				this.putError(G_SCRIPT_INFO, "削除対象のキャリア無し" + pactid + "/" + carid + "/" + year + "/" + month);
				return true;
			}

// 2022cvt_015
		var A_carid = Array();

// 2022cvt_015
		for (var carid_all in H_carid) {
// 2022cvt_015
			var A_id = H_carid[carid_all];
			if (!(-1 !== A_carid.indexOf(carid_all))) A_carid.push(carid_all);

// 2022cvt_015
			for (var id of (A_id)) if (!(-1 !== A_carid.indexOf(id))) A_carid.push(id);
		}

// 2022cvt_015
		var sqlfrom = " from " + this.getTableNameTgt(this.m_A_param[index], table_no);
		sqlfrom += " where pactid=" + this.escape(pactid);

		if (A_carid.length) {
			sqlfrom += " and carid in (" + A_carid.join(",") + ")";
		}

		if (fname.length) {
			if (!this.m_db.backup(fname, "select *" + sqlfrom + ";")) return false;
		}

// 2022cvt_015
		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	async execute(pactid: string, is_details_only: boolean, carid: string, year: string, month: string, H_summary: any[]) //集計するキャリアを決定する
	//部署移動した回線数を取り出す
	//データの追加の準備をする
	//部署を再帰的に処理する
	{
// 2022cvt_015
		var table_no = this.getTableNo(year, month);
// 2022cvt_015
		var H_carid = await this.getCarid(pactid, is_details_only, carid, table_no);

		if (!H_carid.length) //trueを返すが、処理はしていない
			{
				this.putError(G_SCRIPT_WARNING, "集計対象のキャリア無し" + pactid + "/" + carid + "/" + year + "/" + month);
				return true;
			}

// 2022cvt_015
		var A_index = this.m_A_index;
// 2022cvt_015
		var A_param = Array();

// 2022cvt_015
		for (var index of (A_index)) //summary_bill_X_tbなら、集計パラメータを完成させる
		{
			A_param[index] = this.m_A_param[index];
			A_param[index].inserter = this.m_A_param[index].inserter;

			if (UpdateBill.g_index_summary == index) {
				A_param[index].column = Array();

// 2022cvt_015
				for (var col in H_summary) {
// 2022cvt_015
					var H_param = H_summary[col];
					if (!(-1 !== A_param[index].column.indexOf(col))) A_param[index].column.push(col);
				}
			}
		}

		if (!A_param.length || !A_index.length) {
			this.putError(G_SCRIPT_WARNING, "集計種別無し" + pactid + "/" + carid + "/" + year + "/" + month);
			return false;
		}

// 2022cvt_015
		var toppostid: any;
// 2022cvt_015
		var A_relation = Array();
// 2022cvt_015
		var A_child_all = Array();
		if (!this.createRelation(toppostid, A_relation, A_child_all, pactid, table_no)) return false;
// 2022cvt_015
		var H_dummy = this.getDummy(A_param, pactid, table_no);
// 2022cvt_015
		var H_move = this.getMove(A_param, pactid, table_no, A_child_all);

// 2022cvt_015
		for (var index_1 in A_param) {
// 2022cvt_015
			var H_param = A_param[index_1];
// 2022cvt_015
			var table_name = this.getTableNameTgt(H_param, table_no);

			if (!H_param.inserter.begin(table_name)) {
				this.putError(G_SCRIPT_WARNING, "データ追加準備失敗" + pactid);
				return false;
			}
		}

// 2022cvt_015
		var A_sum_rec = Array();
		if (!this.executePost(A_sum_rec, toppostid, pactid, table_no, H_carid, A_relation, await H_dummy, await H_move, A_param)) return false;

// 2022cvt_015
		for (var index_2 in A_param) {
// 2022cvt_015
			var H_param = A_param[index_2];

			if (!H_param.inserter.end()) {
				this.putError(G_SCRIPT_WARNING, "データ追加失敗" + pactid);
				return false;
			}
		}

		return true;
	}

	getTableNameTgt(H_param: { tgt: string; }, table_no: any) {
// 2022cvt_020
		// return str_replace("%1", table_no, H_param.tgt);
		return H_param.tgt.replace("%1", table_no);
	}

	getTableNameSrc(H_param: { src: string; }, table_no: any) {
// 2022cvt_020
        // return str_replace("%1", table_no, H_param.src);
		return H_param.src.replace("%1", table_no);
	}

	async getCarid(pactid: string, is_details_only: boolean, carid: string | any[], table_no: string) //請求明細に存在するキャリアを決定する
	//請求明細にあるキャリアで、集計キャリア => 対象を作る
	//目的のキャリアIDから絞り込む
	//結果が空配列になれば
	{
// 2022cvt_015
		var A_carid_details = Array();

		if (is_details_only) //請求情報を見る
			{
// 2022cvt_015
				var sql = "select carid from tel_details_" + table_no + "_tb";
				sql += " where pactid=" + this.escape(pactid);
				sql += " group by carid";
				sql += " order by carid";
				sql += ";";
// 2022cvt_015
				var result = this.m_db.getAll(sql);

// 2022cvt_015
				for (var A_line of await (result)) {
					if (!(-1 !== A_carid_details.indexOf(A_line[0]))) A_carid_details.push(A_line[0]);
				}
			} else //対象となる全キャリアとする
			{
				{
					let _tmp_0 = this.m_H_carid_all;

// 2022cvt_015
					for (var carid_all in _tmp_0) {
// 2022cvt_015
						var A_id = _tmp_0[carid_all];
						if (!(-1 !== A_carid_details.indexOf(carid_all))) A_carid_details.push(carid_all);

// 2022cvt_015
						for (var id of (A_id)) if (!(-1 !== A_carid_details.indexOf(id))) A_carid_details.push(id);
					}
				}
			}

// 2022cvt_015
		var H_carid_all = Array();
		{
			let _tmp_1 = this.m_H_carid_all;

// 2022cvt_015
			for (var carid_all in _tmp_1) //対象キャリアが一個でも残っていれば、集計キャリアと共に対象とする
			{
// 2022cvt_015
				var A_id_from = _tmp_1[carid_all];
// 2022cvt_015
				var A_id_to = Array();

// 2022cvt_015
				for (var id of (A_id_from)) //対象キャリアが、請求明細にあるキャリアでなければ対象外である
				{
					if (!(-1 !== A_carid_details.indexOf(id))) continue;
					if (!(-1 !== A_id_to.indexOf(id))) A_id_to.push(id);
				}

				if (A_id_to.length) {
					H_carid_all[carid_all] = A_id_to;
				}
			}
		}
// 2022cvt_015
		var H_carid: { [key: string]: any } = {};

		if (!carid.length) //全キャリアが対象である
			{
				H_carid = H_carid_all;
			} else {
// 2022cvt_015
			for (var carid_all in H_carid_all) {
// 2022cvt_015
				var A_id = H_carid_all[carid_all];

				if (carid == carid_all) //集計キャリアが指定されている
					//集計キャリアと、対象の全てのキャリアを対象とする
					{
						H_carid = {
							[carid_all]: A_id
						};
						break;
					}

// 2022cvt_015
				var is_break = false;

// 2022cvt_015
				for (var id of (A_id)) {
					if (carid == id) //個別キャリアが指定された
						//そのキャリアと、集計キャリアのみとする
						{
							H_carid = {
								[carid_all]: [id]
							};
							is_break = true;
							break;
						}
				}

				if (is_break) break;
			}
		}

		if (!H_carid.length) //集計キャリアだけの結果を返す
			{
				if (!carid.length) {
					{
						let _tmp_2 = this.m_H_carid_all;

// 2022cvt_015
						for (var carid_all in _tmp_2) {
// 2022cvt_015
							var A_id_from = _tmp_2[carid_all];
							H_carid[carid_all] = Array();
						}
					}
				} else {
					{
						let _tmp_3 = this.m_H_carid_all;

// 2022cvt_015
						for (var carid_all in _tmp_3) {
// 2022cvt_015
							var A_id_from = _tmp_3[carid_all];

							if (carid == carid_all) //集計キャリアが指定されている
								//集計キャリアのみを対象とする
								{
									H_carid = {
										[carid_all]: Array()
									};
								}

							is_break = false;

// 2022cvt_015
							for (var id of (A_id)) {
								if (carid == id) //個別キャリアが指定された
									//そのキャリアの集計キャリアのみとする
									{
										H_carid = {
											[carid_all]: Array()
										};
										is_break = true;
										break;
									}
							}

							if (is_break) break;
						}
					}
				}
			}

		return H_carid;
	}

	async createRelation(toppostid: string | any[], A_relation: any[], A_child_all: any[], pactid: string, table_no: string) //連係情報を読み出す
	//直下の子部署を作る
	//連係情報をトップからたどって、連係情報のループが無い事を確認する
	//同時に、全ての配下部署を作る
	{
		toppostid;
		A_relation = Array();
		A_child_all = Array();
// 2022cvt_015
		var A_rel = Array();
// 2022cvt_015
		var sql = "select postidparent,postidchild,level";
		sql += " from post_relation_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " order by level,postidparent";
		sql += ";";
// 2022cvt_015
		var result = this.m_db.getHash(sql);

// 2022cvt_015
		for (var line of await (result)) {
// 2022cvt_015
			var level = line.level;
// 2022cvt_015
			var parent = line.postidparent;
// 2022cvt_015
			var child = line.postidchild;

			if (0 == level) //トップが見つかった
				{
					if (toppostid.length) {
						this.putError(G_SCRIPT_WARNING, "トップの部署が複数ある" + pactid + "/" + table_no + "/" + toppostid + "/" + line.postidparent);
						return false;
					}

					toppostid = line.postidparent;
				}

// 2022cvt_015
			var rel = {
				parent: parent,
				child: child,
				level: level
			};
			if (!(-1 !== A_rel.indexOf(rel))) A_rel.push(rel);
		}

		if (0 == toppostid.length) {
			this.putError(G_SCRIPT_WARNING, "部署情報取得失敗" + "(トップの部署がない)" + pactid);
			return false;
		}

		sql = "select postid from post_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " order by postid";
		sql += ";";
		result = this.m_db.getAll(sql);

// 2022cvt_015
		for (var line of await (result)) //注目している部署ID
		//直下の部署ID
		{
// 2022cvt_015
			var postid = line[0];
// 2022cvt_015
			var A_child = Array();

// 2022cvt_015
			for (var H_rel of (A_rel)) //注目している部署IDが、連係情報の親でなければスキップ
			{
// 2022cvt_022
				// if (strcmp(H_rel.parent, postid)) continue;
				if (H_rel.parent.localeCompare(postid)) continue;
// 2022cvt_022
				// if (!strcmp(H_rel.child, postid)) continue;
				if (!H_rel.child.localeCompare(postid)) continue;
				if (!(-1 !== A_child.indexOf(H_rel.child))) A_child.push(H_rel.child);
			}

			A_relation[postid] = A_child;
		}

		A_child = Array();
		if (!this.checkRelation(A_child_all, A_child, Array(), 0, A_relation, toppostid)) return false;
		return true;
	}

	checkRelation(A_child_all: any[], A_child: any[], A_postid: any[], nest: number, A_relation: any[], postid: any) //呼び出し階層が深すぎないか確認する
	//部署ツリーにループが無い事を確認する
	//子部署に対してループする
	{
		if (UpdateBill.g_postid_nest <= nest) {
			this.putError(G_SCRIPT_WARNING, "部署情報取得失敗" + "(部署ツリーのレベルが深すぎる)" + postid + "/" + A_postid.join(","));
			return false;
		}

		++nest;

		if (-1 !== A_postid.indexOf(postid)) {
			this.putError(G_SCRIPT_WARNING, "部署情報取得失敗" + "(部署ツリーにループが存在する)" + postid + "/" + A_postid.join(","));
			return false;
		}

		A_postid.push(postid);
// 2022cvt_015
		var A_id = Array();
		if (undefined !== A_relation[postid]) A_id = A_relation[postid];

// 2022cvt_015
		for (var child of (A_id)) {
// 2022cvt_015
			var A_child_own = Array();
			if (!this.checkRelation(A_child_all, A_child_own, A_postid, nest, A_relation, child)) return false;

// 2022cvt_015
			for (var id of (A_child_own)) if (!(-1 !== A_child.indexOf(id))) A_child.push(id);
		}

		A_child_all[postid] = A_child;
		if (!(-1 !== A_child.indexOf(postid))) A_child.push(postid);
		return true;
	}

	async getDummy(A_param: any[], pactid:any, table_no: any) //集計種別に対してループする
	{
// 2022cvt_015
		var H_dummy = Array();

// 2022cvt_015
		for (var index in A_param) //ダミー回線数を読み出す
		//キャリアIDは全て読み出す(不要な部分があるが、量は少ない)
		{
// 2022cvt_015
			var H_param = A_param[index];
			if (!H_param.phone.length) continue;
			H_dummy[index] = Array();
// 2022cvt_015
			var sql = "select child_tb.postid as postid";
			sql += ",child_tb.carid as carid";
			sql += ",count(*) as total";
			sql += " from dummy_tel_tb";
			sql += " left join " + this.getTableNameSrc(H_param, table_no) + " as child_tb";
			sql += " on dummy_tel_tb.pactid = child_tb.pactid";
			sql += " and dummy_tel_tb.telno = child_tb.telno";
			sql += " and dummy_tel_tb.carid = child_tb.carid";
			sql += " where dummy_tel_tb.pactid = " + this.escape(pactid);
			sql += " and child_tb.pactid is not null";
			sql += " group by child_tb.postid,child_tb.carid";
			sql += " having count(*)>0";
			sql += " order by child_tb.postid,child_tb.carid";
			sql += ";";
// 2022cvt_015
			var result = this.m_db.getHash(sql);

// 2022cvt_015
			for (var H_line of await (result)) {
// 2022cvt_015
				var postid = H_line.postid;
// 2022cvt_015
				var carid = H_line.carid;
				if (!(undefined !== H_dummy[index][postid])) H_dummy[index][postid] = Array();
				H_dummy[index][postid][carid] = H_line.total;
			}
		}

		return H_dummy;
	}

	async getMove(A_param: any[], pactid: string, table_no: any, A_child_all: any[]) //集計種別に対してループする
	{
// 2022cvt_015
		var H_move = Array();

// 2022cvt_015
		for (var index in A_param) //トップの部署から見て、部署移動した電話を取り出す
		//ダミー回線は元から回線数に入っていないので無視して良い
		//キャリアIDは全て読み出す(不要な部分があるが、量は少ない)
		{
// 2022cvt_015
			var H_param = A_param[index];
			if (!H_param.phone.length) continue;
			H_move[index] = Array();
// 2022cvt_015
			var sql = "select child_tb.carid as carid";
			sql += ",child_tb.telno as telno";
			sql += " from " + this.getTableNameSrc(H_param, table_no) + " as child_tb";
			sql += " left join dummy_tel_tb";
			sql += " on child_tb.telno=dummy_tel_tb.telno";
			sql += " and child_tb.carid=dummy_tel_tb.carid";
			sql += " and child_tb.pactid=dummy_tel_tb.pactid";
			sql += " where child_tb.pactid=" + this.escape(pactid);
			sql += " and dummy_tel_tb.telno is null";
			sql += " group by child_tb.carid,child_tb.telno";
			sql += " having count(*)>1";
			sql += ";";
// 2022cvt_015
			var A_carid_telno = this.m_db.getHash(sql);

// 2022cvt_015
			for (var H_carid_telno of await (A_carid_telno)) //以下のキャリアID・電話番号が部署移動している
			//所属している部署をすべて取り出す
			//親部署に対してループする
			{
// 2022cvt_015
				var carid = H_carid_telno.carid;
// 2022cvt_015
				var telno = H_carid_telno.telno;
				sql = "select postid from " + this.getTableNameSrc(H_param, table_no) + " where pactid=" + this.escape(pactid) + " and carid=" + carid + " and telno='" + telno + "'" + " group by postid" + ";";
// 2022cvt_015
				var result = this.m_db.getAll(sql);
// 2022cvt_015
				var A_postid = Array();

// 2022cvt_015
				for (var A_line of await (result)) A_postid.push(A_line[0]);

// 2022cvt_015
				for (var parent in A_child_all) //配下部署と親部署に異動部署が何個含まれているか確認する
				{
// 2022cvt_015
					var A_child = A_child_all[parent];
// 2022cvt_015
					var match = 0;

// 2022cvt_015
					for (var postid of (A_child)) if (-1 !== A_postid.indexOf(postid)) ++match;

					if (-1 !== A_postid.indexOf(parent)) ++match;
					if (match <= 1) continue;
					match -= 1;
					if (!(undefined !== H_move[index][parent])) H_move[index][parent] = Array();
					if (!(undefined !== H_move[index][parent][carid])) H_move[index][parent][carid] = 0;
					H_move[index][parent][carid] += match;
				}
			}
		}

		return H_move;
	}

	executePost(A_sum_rec: any[], postid: any, pactid: string, table_no: any, H_carid: { [key: string]: any; }, A_relation: any[], H_dummy: any[], H_move: any[], A_param: any[]) //-------------------------------------------------------------------
	//自部署・各キャリアの集計を行う
	//$A_sum_recと同じ形式
	//$A_sum_recと同じ形式
	{
// 2022cvt_015
		var A_sum_own = Array();
		if (!this.executePostOwn(A_sum_own, postid, pactid, table_no, H_carid, H_dummy, A_param)) return false;
// 2022cvt_015
		var A_sum_child = Array();
		if (!this.executePostChild(A_sum_rec, A_sum_child, A_sum_own, postid, pactid, table_no, H_carid, A_relation, H_dummy, H_move, A_param)) return false;
		if (!this.executePostAllCarid(A_sum_own, "0", postid, pactid, table_no, H_carid, A_param)) return false;
		if (!this.executePostAllCarid(A_sum_child, "1", postid, pactid, table_no, H_carid, A_param)) return false;
		return true;
	}

	async executePostOwn(A_sum_own: any[], postid: string | number, pactid: string, table_no: string, H_carid: { [key: string]: any; }, H_dummy: any[], A_param: any[]) //集計対象のキャリアIDを決定する
	{
// 2022cvt_015
		var A_carid = Array();

// 2022cvt_015
		for (var carid_all in H_carid) {
// 2022cvt_015
			var A_id = H_carid[carid_all];

// 2022cvt_015
			for (var id of (A_id)) if (!(-1 !== A_carid.indexOf(id))) A_carid.push(id);
		}

		if (!A_carid.length) return true;

// 2022cvt_015
		for (var index in A_param) //子テーブルから集計を行う
		//結果に対してループする
		//必要な項目を追加して、保存する
		{
// 2022cvt_015
			var H_param = A_param[index];
			A_sum_own[index] = Array();

// 2022cvt_015
			for (var carid of (A_carid)) A_sum_own[index][carid] = this.getEmptyResult(H_param, carid);

// 2022cvt_015
			var sql = "";
			sql += " select";
			sql += " sub_tb.carid as carid";
			if (H_param.phone.length) sql += ",count(child_tb.*) as " + this.escape(H_param.phone);

// 2022cvt_015
			for (var key of (H_param.column)) sql += ",sum(coalesce(" + key + ",0)) as " + key;

			sql += " from (select pactid,carid,postid from carrier_tb";
			sql += ",post_" + table_no + "_tb";
			sql += " where carid in (" + A_carid.join(",") + ")";
			sql += " and pactid=" + this.escape(pactid);
			sql += " and postid=" + this.escape(postid);
			sql += " order by carid,postid";
			sql += ") as sub_tb";
			sql += " left join " + this.getTableNameSrc(H_param, table_no) + " as child_tb";
			sql += " on sub_tb.carid=child_tb.carid";
			sql += " and sub_tb.postid=child_tb.postid";
			sql += " and sub_tb.pactid=child_tb.pactid";
			sql += " group by sub_tb.carid";
			sql += ";";
// 2022cvt_015
			var result = this.m_db.getHash(sql);
			
// 2022cvt_015
			for (var H_line of await (result)) //除外回線数があれば減算する
			{
// 2022cvt_015
				var carid = H_line.carid;

				if (H_param.phone.length && undefined !== H_dummy[index][postid][carid]) {
					H_line[H_param.phone] -= H_dummy[index][postid][carid];
				}

				this.addByColumn(A_sum_own[index][carid], H_line);
			}

			{
				let _tmp_4 = A_sum_own[index];

// 2022cvt_015
				for (var carid_2 in _tmp_4) {
// 2022cvt_015
					var H_line = _tmp_4[carid_2];
					H_line.pactid = pactid;
					H_line.postid = postid;
					H_line.flag = "0";
					// H_line.recdate = "'" + date("Y-m-d H:i:s") + "'";
					H_line.recdate = "'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
					H_param.inserter.insert(H_line);
				}
			}
		}

		return true;
	}

	executePostChild(A_sum_rec: any[], A_sum_child: any[], A_sum_own: any[], postid: string | number, pactid: string, table_no: any, H_carid: { [key: string]: any; }, A_relation: any[], H_dummy: any[], H_move: any[], A_param: any[]) //集計対象のキャリアIDを決定する
	//直下の子部署に対してループする
	//自部署の結果を加算する
	//部署移動の回線数補正を行う前の結果を、上位の関数に返す
	//集計種別に対してループする
	{
// 2022cvt_015
		var A_carid = Array();

// 2022cvt_015
		for (var carid_all in H_carid) {
// 2022cvt_015
			var A_id = H_carid[carid_all];

// 2022cvt_015
			for (var id of (A_id)) if (!(-1 !== A_carid.indexOf(id))) A_carid.push(id);
		}

		A_sum_rec = Array();
		A_sum_child = Array();

// 2022cvt_015
		for (var index in A_param) {
// 2022cvt_015
			var H_param = A_param[index];
			A_sum_rec[index] = Array();
			A_sum_child[index] = Array();

// 2022cvt_015
			for (var carid of (A_carid)) {
				A_sum_rec[index][carid] = this.getEmptyResult(H_param, carid);
				A_sum_child[index][carid] = this.getEmptyResult(H_param, carid);
			}
		}

// 2022cvt_015
		var A_child = Array();
		if (undefined !== A_relation[postid]) A_child = A_relation[postid];

// 2022cvt_015
		for (var child of (A_child)) //直下部署に対して再帰呼び出しを行う
		{
// 2022cvt_015
			var A_sum_item = Array();
			if (!this.executePost(A_sum_item, child, pactid, table_no, H_carid, A_relation, H_dummy, H_move, A_param)) return false;
			this.addByIndex(A_sum_child, A_sum_item);
		}

		this.addByIndex(A_sum_child, A_sum_own);
		A_sum_rec = A_sum_child;

// 2022cvt_015
		for (var index in A_param) //移動回線数があれば、減算する
		{
// 2022cvt_015
			var H_param = A_param[index];

			if (H_param.phone.length && undefined !== H_move[index][postid]) {
				{
					let _tmp_5 = H_move[index][postid];

// 2022cvt_015
					for (var carid_3 in _tmp_5) {
// 2022cvt_015
						var move = _tmp_5[carid_3];
						if (undefined !== A_sum_child[index][carid]) A_sum_child[index][carid][H_param.phone] -= move;
					}
				}
			}

			{
				let _tmp_6 = A_sum_child[index];

// 2022cvt_015
				for (var carid_4 in _tmp_6) //必要な項目を追加して記録する
				{
// 2022cvt_015
					var H_line = _tmp_6[carid_4];
					H_line.pactid = pactid;
					H_line.postid = postid;
					H_line.flag = "1";
					// H_line.recdate = "'" + date("Y-m-d H:i:s") + "'";
					H_line.recdate = "'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
					H_param.inserter.insert(H_line);
				}
			}
		}

		return true;
	}

	async executePostAllCarid(A_sum: any[], flag: string, postid: any, pactid: string, table_no: any, H_carid: { [key: string]: any; }, A_param: any[]) //集計種別に対してループする
	{
// 2022cvt_015
		for (var index in A_param) //キャリア集合に対してループする
		{
// 2022cvt_015
			var H_param = A_param[index];

// 2022cvt_015
			for (var carid_all in H_carid) //対象キャリアの結果を加算する
			//集計対象のキャリアに対してループする
			//キャリアIDを全キャリアにする
			//必要な項目を追加して記録する
			{
// 2022cvt_015
				var A_carid = H_carid[carid_all];
// 2022cvt_015
				var H_line = this.getEmptyResult(H_param, carid_all);

// 2022cvt_015
				for (var carid of (A_carid)) //個別の結果があれば、結果を足し込む
				{
					if (undefined !== A_sum[index][carid]) this.addByColumn(H_line, A_sum[index][carid]);
				}

				H_line.carid = carid_all;
				H_line.pactid = pactid;
				H_line.postid = postid;
				H_line.flag = flag;
				// H_line.recdate = "'" + date("Y-m-d H:i:s") + "'";
				H_line.recdate = "'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
				H_param.inserter.insert(H_line);
			}
		}

		return true;
	}

	addByIndex(H_tgt: any[], H_src: any[]) {
// 2022cvt_015
		for (var index in H_src) {
// 2022cvt_015
			var H_index = H_src[index];
			if (!(undefined !== H_tgt[index])) H_tgt[index] = Array();
			this.addByCarid(H_tgt[index], H_index);
		}
	}

	addByCarid(H_tgt: { [key: string]: any; }, H_src: { [key: string]: any; }) {
// 2022cvt_015
		for (var carid in H_src) {
// 2022cvt_015
			var H_carid = H_src[carid];
			if (!(undefined !== H_tgt[carid])) H_tgt[carid] = Array();
			this.addByColumn(H_tgt[carid], H_carid);
		}
	}

	addByColumn(H_tgt: { [key: string]: any; carid?: any; }, H_src: { [key: string]: any; carid: any; }) //caridは単純にコピーする
	{
// 2022cvt_015
		for (var key in H_src) //carid以外を合計する
		{
// 2022cvt_015
			var value = H_src[key];
// 2022cvt_022
			// if (!strcmp("carid", key)) continue;
			if (!"carid".localeCompare(key)) continue;
			if (!(undefined !== H_tgt[key])) H_tgt[key] = 0;
			H_tgt[key] = H_tgt[key] + value;
		}

		H_tgt.carid = H_src.carid;
	}

	getEmptyResult(H_param: { column: any; phone: string; }, carid: string) {
// 2022cvt_015
		var H_tgt: { [key: string]: any } = {
			carid: carid
		};

// 2022cvt_015
		for (var key of (H_param.column)) H_tgt[key] = 0;

		if (H_param.phone.length) H_tgt[H_param.phone] = 0;
		return H_tgt;
	}

};
