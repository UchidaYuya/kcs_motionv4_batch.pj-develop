//memo
//	現在の部署情報を何度も取っているので、最初にまとめて取得してそれを使いまわすほうがよさそう
//require_once("common.php");
//
//ReorgnizationModel2
//部署編成
//@uses ModelBase
//@package
//@author web
//@since 2018/06/22
//

require("ModelBase.php");

require("MtCryptUtil.php");

//インサート時のarrayの配列インデックス。
//配列に文字列を使用するとメモリを多く使うので、なるべく避ける試み
//PHPにもenum欲しいね・・
//personnel_tbのID
//ユーザー部署ID
//親部署
//部署名
//承認部署
//追加部署情報
//ユーザー
//personnel_tbのid
//名前
//社員コード
//ログインID
//パスワード
//ユーザー部署ID
//メール
//言語
//権限区分
//標準のお知らせを受け取る
//重要なお知らせを受け取る
//価格表メールを受け取る
//申請・承認関連メール
//標準のお知らせを受け取る
//電話
//personnel_tbのID
//ユーザー部署ID
//社員コード
//ユーザー名
//MAIL
//元ソースの行順
//追加管理項目
//注文のstatus
//キャンセル
//取消
//カラムの型
//不明の型
//不明の型
//文字列
//数値型
//タイムスタンプ
//日付型
//bool型
//前部署、次部署でターゲット指定されている？
//指定された部署はターゲット部署
//部署がない
//ターゲット部署ではない
//テーブル名、カラムのタイプ
//使用するテーブル名	$table_name["tel_tb"] = "tel_xx_tb";など
//カラムのタイプ		$column_type["tel_tb"]["int1"] = TYPE_INTEGER;
//部署情報
//usetpostidからpostidを知りたい場合はu2sを使用する
//post_prev[postid] = 現在の部署情報
//$post_prev_u2s[userpostid] = postid;の配列
//post_next[postid] = 変更後の部署情報
//$post_next_u2s[userpostid] = postid;の配列
//postidとsuperuser
//ルート部署ID
//スーパーユーザー情報
//電話情報
//電話情報
//実行した会社、部署、ユーザーなどのデータ
//
//options・・
//更新用データ
//更新用データ
//
//__construct
//コンストラクタ
//@author web
//@since 2018/01/10
//
//@access public
//@return void
//
//
//initialize
//初期化
//@author web
//@since 2018/06/08
//
//@param string $tbno
//@access public
//@return void
//
//
//getTelList
//
//@author web
//@since 2018/06/12
//
//@access private
//@return void
//
//
//createIni
//iniファイルの作成
//@author web
//@since 2018/05/01
//
//@access private
//@return void
//
//private function makeLogTemplate( $kind ){
//		$temp = array();
//		//	実行者データの取得	
//		$exec = $this->getExecData();
//		//	実行対象、実行者の設定とkindの設定
//		$temp["pactid"]			= $this->get_DB()->dbQuote($exec["pactid"],"integer",true);		//	対象の顧客ID
//		$temp["postid"]			= $this->get_DB()->dbQuote($exec["postid"],"integer",true);		//	実行した部署(ルート固定)
//		$temp["postname"]		= $this->get_DB()->dbQuote($exec["postname"],"text",true);		//	実行した部署名(ルート部署名)
//		$temp["userid"]			= $this->get_DB()->dbQuote($exec["userid"],"integer",true);		//	実行したユーザー(スーパーユーザ)
//		$temp["recdate"]		= $this->get_DB()->dbQuote($exec["recdate"],"timestamp",true);				//	実行日
//		$temp["username"]		= "'システム'";		//	実行ユーザー名
//		$temp["joker_flag"]		= "0";
//		$temp["kind"]			= $this->get_DB()->dbQuote($kind,"text",true);		//	ユーザーならU
//		//	ここから下は随時書き換える必要がある
//		$temp["targetpostid"]	= 0;		//	対象部署ID	
//		$temp["type"]			= "''";		//	タイプ・・追加、変更、など
//		$temp["comment1"]		= "''";				
//		$temp["comment1_eng"]	= "''";			
//		$temp["comment2"]		= "''";		
//		$temp["comment2_eng"]	= "''";
//		return $temp;
//	}
//
//makeLogTemplateOfTel
//更新内容
//@author web
//@since 2018/06/22
//
//@param mixed $tel_list
//@param mixed $update_list
//@access private
//@return void
//
//
//dbQuote
//
//@author web
//@since 2018/05/01
//
//@param mixed $value
//@param mixed $type
//@param mixed $bNootNull
//@access private
//@return void
//
//
//getColumnType
//テーブルのカラムとデータ型の取得
//@author web
//@since 2018/05/01
//
//@param mixed $tablename
//@access private
//@return void
//
//
//getPostPrevList
//tablenameに入ってるテーブル情報で部署情報取得
//iniでtarget_userpostidが設定されていた場合、その部署と配下部署以外では操作が行えないようにする
//@author web
//@since 2018/05/16
//
//@param mixed $pactid
//@access private
//@return void
//
//
//getPostPrevDataRoot
//現在のルート部署を取得する
//@author web
//@since 2018/06/22
//
//@access private
//@return void
//
//
//getSuperUser
//
//@author web
//@since 2018/06/22
//
//@access private
//@return void
//
//
//initExecData
//
//@author web
//@since 2018/06/22
//
//@access private
//@return void
//
//
//getExecData
//実行した会社、部署、ユーザーなど取得する
//@author web
//@since 2018/06/22
//
//@access private
//@return void
//
//
//getPostDataBySID
//this->tablenameに登録されているpost_tbから取得
//@author web
//@since 2018/05/24
//
//@param mixed $pactid
//@param mixed $postid
//@access private
//@return void
//
//
//getPostPrevDataByUID
//
//@author web
//@since 2018/06/12
//
//@param mixed $userpostid
//@access private
//@return void
//
//
//getPostNextList
//次の部署リストをpostidを指定して取得
//@author web
//@since 2018/06/12
//
//@access private
//@return void
//
//
//getPostNextDataBySID
//次の部署をpostidを指定して取得
//@author web
//@since 2018/06/12
//
//@param mixed $postid
//@access private
//@return void
//
//
//getPostNextDataByUID
//userpostidから部署情報から取得
//@author web
//@since 2018/06/12
//
//@param mixed $userpostid
//@access private
//@return void
//
//
//isTargetPostByUID
//指定された部署IDがターゲット部署か
//@author web
//@since 2018/06/12
//
//@param mixed $userpostid
//@access private
//@return void
//
//
//isTargetPostNextBySID
//
//@author web
//@since 2018/06/12
//
//@param mixed $postid
//@access private
//@return void
//
//
//isTargetPostBySID
//
//@author web
//@since 2018/06/12
//
//@param mixed $postid
//@access private
//@return void
//
//
//isTargetPostNextByUID
//次部署が移動有効？
//@author web
//@since 2018/06/12
//
//@param mixed $userpostid
//@access private
//@return void
//
//
//checkSourceTel
//電話の移動情報のエラーチェック
//@author web
//@since 2018/06/12
//
//@param mixed $source
//@access private
//@return void
//
//
//execute
//部署再編成の実行
//@author web
//@since 2018/06/12
//
//@param mixed $post_source
//@param mixed $user_source
//@param mixed $tel_source
//@param mixed $mode
//@access public
//@return void
//
//
//outputUpdateTelInfo
//電話の更新情報
//@author web
//@since 2018/06/21
//
//@access public
//@return void
//
//
//checkError
//
//@author web
//@since 2018/06/21
//
//@access public
//@return void
//
//
//makeUpdateTelSql
//更新SQL作成
//@author web
//@since 2018/06/14
//
//@access private
//@return void
//
//
//update
//
//@author web
//@since 2018/06/14
//
//@access public
//@return void
//
class ReorgnizationModel2 extends ModelBase {
	static POST_IDX_ID = 0;
	static POST_IDX_USERPOSTID = 1;
	static POST_IDX_USERPOSTID_PARENT = 2;
	static POST_IDX_POSTNAME = 3;
	static POST_IDX_USERPOSTID_RECOG = 4;
	static POST_IDX_COLUMN_DEF = 5;
	static USER_IDX_ID = 0;
	static USER_IDX_USERNAME = 1;
	static USER_IDX_EMPLOYEECODE = 2;
	static USER_IDX_LOGINID = 3;
	static USER_IDX_PASSWORD = 4;
	static USER_IDX_USERPOSTID = 5;
	static USER_IDX_MAIL = 6;
	static USER_IDX_LANGUAGE = 7;
	static USER_IDX_FUNC = 8;
	static USER_IDX_ACCEPTMAIL1 = 9;
	static USER_IDX_ACCEPTMAIL2 = 10;
	static USER_IDX_ACCEPTMAIL3 = 11;
	static USER_IDX_ACCEPTMAIL4 = 12;
	static USER_IDX_ACCEPTMAIL5 = 13;
	static TEL_IDX_ID = 0;
	static TEL_IDX_USERPOSTID = 1;
	static TEL_IDX_EMPLOYEECODE = 2;
	static TEL_IDX_USERNAME = 3;
	static TEL_IDX_MAIL = 4;
	static TEL_IDX_SORT = 5;
	static TEL_IDX_COLUMN_DEF = 6;
	static ORDERSTATUS_CANCEL = 230;
	static ORDERSTATUS_DELETE = 220;
	static TYPE_ERROR = 0;
	static TYPE_NULL = 1;
	static TYPE_STRING = 2;
	static TYPE_INTEGER = 3;
	static TYPE_TIMESTAMP = 4;
	static TYPE_DATE = 5;
	static TYPE_BOOL = 6;
	static eTARGET_OK = 0;
	static eTARGET_NONE = 1;
	static eTARGET_NOT = 2;

	constructor() {
		super();
		this.ini = undefined;
		this.tablename = Array();
		this.column_type = Array();
		this.post_prev = undefined;
		this.post_prev_u2s = undefined;
		this.post_next = undefined;
		this.post_next_u2s = undefined;
		this.postid_root = undefined;
		this.superuser = undefined;
		this.tel_list = undefined;
		this.exec_data = Array();
		this.pactid = undefined;
		this.options = Array();
		this.update_data = undefined;
	}

	initialize(pactid, options, tbno = "") //tel_tbのカラムを取得するぽよ(tel_xx_tbにする必要はあるのか・・)
	//テーブル一覧だよ・・
	//iniの取得
	//optionsで上書き
	//optionsの値をvalidateする関数を作ったほうが良いかもしれない
	//初期化しておく・・
	{
		this.pactid = pactid;
		this.column_type.tel_tb = this.getColumnType("tel_tb");
		this.tablename = Array();
		this.tablename.post_tb = !tbno ? "post_tb" : "post_" + tbno + "_tb";
		this.tablename.post_relation_tb = !tbno ? "post_relation_tb" : "post_relation_" + tbno + "_tb";
		this.tablename.tel_tb = !tbno ? "tel_tb" : "tel_" + tbno + "_tb";
		var ini = parse_ini_file(KCS_DIR + "/conf_sync/reorgnization.ini", true);

		if (undefined !== ini[pactid]) {
			this.options = this.convertIni(ini[pactid]);
		} else if (undefined !== ini[0]) {
			this.options = this.convertIni(ini[0]);
		} else {
			this.options = Array();
		}

		for (var key in options) {
			var value = options[key];
			this.options[key] = value;
		}

		var post = this.getPostPrevList();
	}

	getTelList() {
		var sql_col = "";

		if (this.tel_list) {
			return this.tel_list;
		}

		var cols = Array();

		if (!!this.options.tel_column_rule) {
			for (var col of Object.values(this.options.tel_column_rule)) {
				cols[col] = true;
			}
		}

		if (Array.isArray(this.options.tel_column_clear_move)) {
			for (var col of Object.values(this.options.tel_column_clear_move)) {
				cols[col] = true;
			}
		}

		if (!!cols) {
			sql_col = "," + Object.keys(cols).join(",");
		}

		var sql = "SELECT" + " telno" + ",telno_view" + ",carid" + ",postid" + ",employeecode" + ",mail" + ",username" + sql_col + " FROM " + this.tablename.tel_tb + " WHERE" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " ORDER BY" + " carid" + ",telno";
		this.tel_list = this.get_DB().queryHash(sql);
		return this.tel_list;
	}

	convertIni(ini) //電話移動時にクリアされるカラム
	//電話の更新する追加管理項目(一応、それ以外のカラムも更新できるようにはなっている)
	//
	//ユーザー権限について
	//user_funcについて、ユーザー権限かどうかチェック機構を後ほどつける
	//スーパーユーザーは全ての権限を付与するという処理が必要だと思う
	//退避部署
	//電話リストで対象ではないものはマークを付ける
	//宣言されてないならnullいれておく
	{
		var res = ini;

		if (undefined !== ini.tel_when_post_deleted) //想定外の値が設定されてたらエラーとかにしたほうが良いが後でやろう・・
			{} else //値が設定されてない時は0を設定しておく
			{
				res.tel_when_post_deleted = 0;
			}

		if (undefined !== ini.tel_column_clear_move && !!ini.tel_column_clear_move) //値チェックとかしたほうがいい・・
			{
				res.tel_column_clear_move = ini.tel_column_clear_move.split(",");
			} else //空を設定しておこう・・
			{
				res.tel_column_clear_move = undefined;
			}

		if (undefined !== ini.tel_column_rule) {
			res.tel_column_rule = rtrim(ini.tel_column_rule).split(",");
		} else {
			res.tel_column_rule = Array();
		}

		if (undefined !== ini.post_not_delete_tel) //値を分ける
			{
				var temp = ini.post_not_delete_tel.split(",");
				var post_not_delete_tel = Array();

				for (var key in temp) //$post_not_delete_tel[ $c[0] ] = $c[1];	//
				{
					var value = temp[key];
					var c = value.split("|");
					post_not_delete_tel.push(c);
				}

				res.post_not_delete_tel = post_not_delete_tel;
			} else //空を設定しておこう・・
			{
				res.post_not_delete_tel = Array();
			}

		res.user_func = Array();

		for (var key in ini) //ユーザー権限の箇所を抜粋する
		//$res[user_func][index] = 権限の配列の形にする
		{
			var value = ini[key];

			if (strpos(key, "user_func") !== 0) {
				continue;
			}

			if (!value) //権限なしは空のarrayを入れる・・
				{
					var func = Array();
				} else //事前に配列にしておく
				{
					func = value.split(",");
				}

			res.user_func[str_replace("user_func", "", key)] = func;
		}

		if (!(undefined !== ini.escape_post)) {
			res.escape_post = "";
		}

		if (!(undefined !== ini.target_userpostid)) {
			res.target_userpostid = undefined;
		}

		if (undefined !== res.tel_not_move_employeecode) //配列にしておく
			{
				res.tel_not_move_employeecode = ini.tel_not_move_employeecode.split(",");
			} else {
			res.tel_not_move_employeecode = undefined;
		}

		if (!(undefined !== res.tel_dead_mark)) {
			res.tel_dead_mark = undefined;
		}

		return res;
	}

	makeLogForTel(recdate) //更新ある？
	//実行者データ(主にsuperuser情報ぽよ)
	//DB情報
	//ここは固定
	//ここから下は固定ではない
	//更新情報取得
	//電話一覧取得
	//変更があるならログ追加
	{
		if (!(undefined !== this.update_data.tel.update)) //ないので終わり
			{
				return true;
			}

		var logs = Array();
		var exec = this.getExecData();
		var db = this.get_DB();
		var temp = Array();
		temp.mid = 1;
		temp.pactid = db.dbQuote(exec.pactid, "integer", true);
		temp.postid = db.dbQuote(exec.postid, "integer", true);
		temp.userid = db.dbQuote(exec.userid, "integer", true);
		temp.username = db.dbQuote("\u30B7\u30B9\u30C6\u30E0", "text", true);
		temp.joker_flag = db.dbQuote(0, "integer", true);
		temp.recdate = db.dbQuote(recdate, "timestamp", true);
		temp.coid = undefined;
		temp.trg_postid = undefined;
		temp.trg_postname = undefined;
		temp.manageno = undefined;
		temp.manageno_view = undefined;
		temp.type = undefined;
		temp.comment = undefined;
		temp.comment_eng = undefined;
		temp.trg_postid_aft = undefined;
		temp.trg_postname_aft = undefined;
		var update_list = this.update_data.tel.update;
		var tel_list = this.getTelList();

		for (var tel_idx in update_list) //----------------------------------------------------------------------
		//この電話の基本データ設定
		//----------------------------------------------------------------------
		//----------------------------------------------------------------------
		//userpostid以外に変更がある場合、変更ログ入れる
		//----------------------------------------------------------------------
		{
			var update = update_list[tel_idx];
			var move_log = undefined;
			var change_log = undefined;
			var tel = tel_list[tel_idx];
			var post = this.getPostPrevDataBySID(tel.postid);
			temp.coid = db.dbQuote(tel.carid, "integer", true);
			temp.trg_postid = db.dbQuote(post.postid, "integer", false);
			temp.trg_postname = db.dbQuote(post.postname, "text", false);
			temp.manageno = db.dbQuote(tel.telno, "text", true);
			temp.manageno_view = db.dbQuote(tel.telno_view, "text", true);
			var up = update;

			if (undefined !== up.userpostid) {
				delete up.userpostid;
			}

			if (!!up) {
				temp.type = db.dbQuote("\u5909\u66F4", "text", true);
				temp.comment = db.dbQuote("\u96FB\u8A71\u5909\u66F4", "text", true);
				temp.comment_eng = db.dbQuote("Change phone", "text", true);
				temp.trg_postid_aft = db.dbQuote(undefined, "integer", false);
				temp.trg_postname_aft = db.dbQuote(undefined, "text", false);
				logs.push(temp);
			}

			if (undefined !== update.userpostid) //ログ追加
				{
					temp.type = db.dbQuote("\u79FB\u52D5", "text", true);
					temp.comment = db.dbQuote("\u96FB\u8A71\u79FB\u52D5\uFF08" + recdate.substr(0, 4) + "\u5E74" + recdate.substr(4, 2) + "\u6708" + recdate.substr(6, 2) + "\u65E5\uFF09", "text");
					temp.comment_eng = db.dbQuote("Phone shift \uFF08" + recdate.substr(0, 8) + "\uFF09", "text", true);
					var post_next = this.getPostNextDataByUID(update.userpostid);
					temp.trg_postid_aft = db.dbQuote(post_next.postid, "integer", false);
					temp.trg_postname_aft = db.dbQuote(post_next.tree, "text", false);
					logs.push(temp);
				}
		}

		A_result.result = true;
		A_result.data = logs;
		return A_result;
	}

	dbQuote(value, type, bNotNull = false) //データ型に合わせて返す
	{
		var t = {
			[ReorgnizationModel2.TYPE_STRING]: "text",
			[ReorgnizationModel2.TYPE_INTEGER]: "integer",
			[ReorgnizationModel2.TYPE_TIMESTAMP]: "timestamp",
			[ReorgnizationModel2.TYPE_DATE]: "date",
			[ReorgnizationModel2.TYPE_BOOL]: "bool"
		};

		if (undefined !== t[type]) {
			return this.get_DB().dbQuote(value, t[type], bNotNull);
		}

		return this.get_DB().dbQuote(value, "text", bNotNull);
	}

	getColumnType(tablename) //文字列じゃなくて数値で保存する
	//各カラムの型を設定
	{
		var row;
		var sql = "SELECT" + " attr.attname" + ",typ.typname" + " FROM" + " pg_attribute attr" + " INNER JOIN pg_type typ ON (attr.atttypid = typ.oid)" + " WHERE" + " attrelid = '" + tablename + "'::regclass" + " AND NOT attisdropped" + " AND attnum > 0";
		var temp = pg_query(this.getDB().connection(), sql);
		var types = {
			int: ReorgnizationModel2.TYPE_INTEGER,
			text: ReorgnizationModel2.TYPE_STRING,
			timestamp: ReorgnizationModel2.TYPE_TIMESTAMP,
			bool: ReorgnizationModel2.TYPE_BOOL
		};
		var res = Array();

		while (row = pg_fetch_assoc(temp)) {
			var type = ereg_replace("[0-9]", "", row.typname);

			if (undefined !== types[type]) {
				res[row.attname] = types[type];
			} else //未設定の型(typesに設定すること)
				{
					res[row.attname] = ReorgnizationModel2.TYPE_ERROR;
					echo("type error(" + tablename + ")" + __filename + "(" + 540 + ")" + "\n");
					throw die();
				}
		}

		return res;
	}

	getPostPrevList() //---------------------------------------------------------------------------------------
	//対象部署の指定(is_target)
	//---------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------
	//userpostidからのpostid逆引き用リスト作成
	//---------------------------------------------------------------------------------------
	{
		if (!is_null(this.post_prev)) {
			return this.post_prev;
		}

		var sql = "select" + " post.postid" + ",post.postname" + ",post.userpostid" + ",post.fix_flag" + ",rel.postidparent" + ",rel.level" + ",recog.postidto as postidrecog" + " from " + this.tablename.post_tb + " as post" + " join " + this.tablename.post_relation_tb + " rel on rel.pactid = post.pactid and rel.postidchild = post.postid" + " LEFT JOIN recognize_tb recog ON recog.pactid=post.pactid and recog.postidfrom = post.postid" + " where" + " post.pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " order by" + " rel.level";
		this.post_prev = this.get_DB().queryKeyAssoc(sql);
		{
			let _tmp_0 = this.post_prev;

			for (var postid in _tmp_0) //ルート部署IDの設定
			{
				var post = _tmp_0[postid];
				this.post_prev[postid].postid = postid;

				if (post.level == 0) {
					this.postid_root = postid;
				}

				var str = post.postname + "(" + post.userpostid + ")";

				if (post.level > 0) {
					var parentid = post.postidparent;
					this.post_prev[postid].tree = this.post_prev[parentid].tree + " -> " + str;
				} else {
					this.post_prev[postid].tree = str;
				}
			}
		}

		if (!this.options.target_userpostid) {
			{
				let _tmp_1 = this.post_prev;

				for (var key in _tmp_1) {
					var value = _tmp_1[key];
					this.post_prev[key].is_target = true;
				}
			}
		} else //ここで$root_checkがfalseの場合は何かしらするべき・・だとは思うがが
			{
				var root_check = false;
				{
					let _tmp_2 = this.post_prev;

					for (var key in _tmp_2) {
						var value = _tmp_2[key];
						var is_target = false;

						if (root_check) //親が対象部署なら子も対象部署
							{
								if (this.post_prev[value.postidparent].is_target) {
									is_target = true;
								}
							} else //親みつけた
							{
								if (value.userpostid == this.options.target_userpostid) {
									is_target = true;
									root_check = true;
								}
							}

						this.post_prev[key].is_target = is_target;
					}
				}
			}

		this.post_prev_u2s = Array();
		{
			let _tmp_3 = this.post_prev;

			for (var postid in _tmp_3) {
				var value = _tmp_3[postid];
				this.post_prev_u2s[value.userpostid] = postid;
			}
		}
		return this.post_prev;
	}

	getPostPrevDataRoot() {
		return this.getPostPrevDataBySID(this.postid_root);
	}

	getSuperUser() //既に読込済みであれば
	//スーパーユーザー
	{
		if (!is_null(this.superuser)) {
			return this.superuser;
		}

		this.superuser = undefined;
		var db = this.get_DB();
		var sql = "SELECT * FROM user_tb" + " WHERE " + " pactid=" + db.dbQuote(this.pactid, "integer", true) + " AND type = 'SU'" + " ORDER BY recdate" + " LIMIT 1";
		this.superuser = db.queryRowHash(sql);
		return this.superuser;
	}

	initExecData() //ルート部署とスーパーユーザーの取得
	//実行者や実行日など
	//実行した会社(pactidと同じ値だが、一応分けておく)
	//実行した部署ID(ルート部署)
	//実行した部署名(ルート部署)
	//実行者のID(スーパーユーザー)
	//実行日・・・これはSQL作成時に設定しなおすようにしよう・・
	{
		var post_root = this.getPostPrevDataRoot();
		var superuser = this.getSuperUser();
		this.exec_data = Array();
		this.exec_data.pactid = this.pactid;
		this.exec_data.postid = post_root.postid;
		this.exec_data.postname = post_root.postname;
		this.exec_data.userid = superuser.userid;
		this.exec_data.recdate = this.getDB().getNow();
		return this.exec_data;
	}

	getExecData() //ないなら作る
	{
		if (!this.exec_data) {
			return this.initExecData();
		}

		return this.exec_data;
	}

	getPostPrevDataBySID(postid) {
		var post = this.getPostPrevList(postid);
		return undefined !== post[postid] ? post[postid] : undefined;
	}

	getPostPrevDataByUID(userpostid) {
		if (undefined !== this.post_prev_u2s[userpostid]) {
			return this.getPostPrevDataBySID(this.post_prev_u2s[userpostid]);
		}

		return undefined;
	}

	getPostNextList() //次の部署ツリーが設定されてれば返す
	{
		if (!is_null(this.post_next)) {
			return this.post_next;
		}

		return this.getPostPrevList();
	}

	getPostNextDataBySID(postid) {
		var post = this.getPostNextList(pactid);
		return undefined !== post[postid] ? post[postid] : undefined;
	}

	getPostNextDataByUID(userpostid) //部署の再編データがなければ現部署情報を返す
	{
		if (is_null(this.post_next_u2s)) {
			return this.getPostPrevDataByUID(userpostid);
		}

		if (undefined !== this.post_next_u2s[userpostid]) {
			return this.getPostNextDataBySID(this.post_next_u2s[userpostid]);
		}

		return undefined;
	}

	isTargetPostPrevBySID(postid) //現部署
	{
		var post = this.getPostPrevDataBySID(postid);

		if (is_null(post)) //部署ない
			{
				return ReorgnizationModel2.eTARGET_NONE;
			} else {
			if (post.is_target) //ターゲット部署
				{
					return ReorgnizationModel2.eTARGET_OK;
				} else //ターゲット部署ではない
				{
					return ReorgnizationModel2.eTARGET_NOT;
				}
		}

		return ReorgnizationModel2.eTARGET_ERROR;
	}

	isTargetPostNextBySID(postid) //現部署
	{
		var post = this.getPostNextDataBySID(postid);

		if (is_null(post)) //部署ない
			{
				return ReorgnizationModel2.eTARGET_NONE;
			} else {
			if (post.is_target) //ターゲット部署
				{
					return ReorgnizationModel2.eTARGET_OK;
				} else //ターゲット部署ではない
				{
					return ReorgnizationModel2.eTARGET_NOT;
				}
		}

		return ReorgnizationModel2.eTARGET_ERROR;
	}

	isTargetPostPrevByUID(userpostid) //現部署
	{
		var post = this.getPostPrevDataByUID(userpostid);

		if (is_null(post)) //部署ない
			{
				return ReorgnizationModel2.eTARGET_NONE;
			} else {
			if (post.is_target) //ターゲット部署
				{
					return ReorgnizationModel2.eTARGET_OK;
				} else //ターゲット部署ではない
				{
					return ReorgnizationModel2.eTARGET_NOT;
				}
		}

		return ReorgnizationModel2.eTARGET_ERROR;
	}

	isTargetPostNextByUID(userpostid) //次部署
	{
		var post = this.getPostNextDataByUID(userpostid);

		if (is_null(post)) //部署ない
			{
				return ReorgnizationModel2.eTARGET_NONE;
			} else {
			if (post.is_target) //ターゲット部署
				{
					return ReorgnizationModel2.eTARGET_OK;
				} else //ターゲット部署ではない
				{
					return ReorgnizationModel2.eTARGET_NOT;
				}
		}

		return ReorgnizationModel2.eTARGET_ERROR;
	}

	checkSourceTel(source) //エラーチェック
	//重複社員コード
	{
		var result = {
			result: false,
			error: Array()
		};
		var data = Array();
		var dup_emp = Array();
		var post_none = Array();

		for (var key in source) //同じ社員番号が存在している
		{
			var value = source[key];

			if (undefined !== data[value[ReorgnizationModel2.TEL_IDX_EMPLOYEECODE]]) {
				dup_emp[value[ReorgnizationModel2.TEL_IDX_EMPLOYEECODE]] = true;
			}

			var res = this.isTargetPostNextByUID(value[ReorgnizationModel2.TEL_IDX_USERPOSTID]);

			if (res != ReorgnizationModel2.eTARGET_OK) {
				post_none[value[ReorgnizationModel2.TEL_IDX_USERPOSTID]] = true;
			}
		}

		if (!!dup_emp) {
			result.error.push("\u96FB\u8A71:\u91CD\u8907\u793E\u54E1\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u3059(" + Object.keys(dup_emp).join(",") + ")");
		}

		if (!!post_none) {
			result.error.push("\u96FB\u8A71:\u5B58\u5728\u3057\u306A\u3044\u90E8\u7F72\u3067\u3059(" + Object.keys(post_none).join(",") + ")");
			result.error.push("tel.csv\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044");
		}

		if (!result.error) //ない
			{
				result.result = true;
			} else {
			result.result = false;
		}

		return result;
	}

	makeTelData(tel_source) //社員番号での移動先
	//メールでの移動先部署
	//データの確認
	//移動先部署のチェック
	//結果は成功じゃあ・・
	//移動する電話
	//エラー
	//現在登録されている電話で、条件に一致しない電話一覧
	{
		var A_result = Array();
		A_result.result = false;
		A_result.update = Array();
		A_result.update_error = Array();
		A_result.not_match = Array();
		A_result.error = Array();
		var tel_ref_e = Array();
		var tel_ref_m = Array();
		var post_error = Array();
		var res = this.checkSourceTel(tel_source);

		if (!res.result) {
			return res;
		}

		for (var key in tel_source) //移動先ユーザー部署が有効かチェックする
		{
			var value = tel_source[key];
			var userpostid = value[ReorgnizationModel2.TEL_IDX_USERPOSTID];

			if (!(undefined !== post_error[userpostid])) //移動先が有効かチェックする
				{
					var tgt = this.isTargetPostNextByUID(userpostid);

					switch (tgt) {
						case ReorgnizationModel2.eTARGET_OK:
							break;

						case ReorgnizationModel2.eTARGET_NOT:
							post_error[userpostid] = true;
							break;

						case ReorgnizationModel2.eTARGET_NONE:
							post_error[userpostid] = true;
							break;

						case ReorgnizationModel2.eTARGET_ERROR:
							post_error[userpostid] = true;
							break;
					}
				}

			var temp = value[ReorgnizationModel2.TEL_IDX_EMPLOYEECODE];

			if (!!temp) {
				tel_ref_e[temp] = key;
			}

			temp = value[ReorgnizationModel2.TEL_IDX_MAIL];

			if (!!temp) {
				tel_ref_m[temp] = key;
			}
		}

		if (!!post_error) {
			A_result.error.push("\u79FB\u52D5\u3067\u304D\u306A\u3044\u3001\u307E\u305F\u306F\u5B58\u5728\u3057\u306A\u3044\u90E8\u7F72\u3067\u3059(" + Object.keys(post_error).join(",") + ")");
			return A_result;
		}

		var update = Array();
		var update_errors = Array();
		var not_match = Array();
		var tel_list = this.getTelList();

		for (var tel_idx in tel_list) //移動先
		//電話情報
		//移動条件
		//移動先があるかチェックする
		//----------------------------------------------------------------------------------------------
		//更新項目があるなら・・
		//----------------------------------------------------------------------------------------------
		{
			var value = tel_list[tel_idx];
			var update_error = Array();
			var to_move = undefined;
			temp = Array();

			if (!!this.options.tel_not_move_employeecode && -1 !== this.options.tel_not_move_employeecode.indexOf(value.employeecode)) //指定された社員番号は無視する
				{
					continue;
				} else if (undefined !== tel_ref_e[value.employeecode]) //社員番号で移動する
				{
					to_move = tel_ref_e[value.employeecode];
				} else if (undefined !== tel_ref_m[value.mail]) //メールで移動する
				{
					to_move = tel_ref_m[value.mail];
				}

			var post_prev = this.getPostPrevDataBySID(value.postid);

			if (is_null(to_move)) //----------------------------------------------------------------------------------------------
				//移動先がないor退職された人
				//----------------------------------------------------------------------------------------------
				//操作対象部署でデータにない電話(マークつける)
				{
					if (post_prev.is_target) //マーク設定されてるならつける
						{
							if (!!this.options.tel_dead_mark) {
								var mark = this.options.tel_dead_mark;

								if (strpos(value.username, mark) !== 0) {
									temp.username = mark + value.username;
								}
							}

							not_match[tel_idx] = true;
						}
				} else //移動元部署が対象外
				{
					if (!post_prev.is_target) {
						update_error.push("\u3053\u306E\u96FB\u8A71\u306E\u6240\u5C5E\u90E8\u7F72\u306F\u5909\u66F4\u5BFE\u8C61\u5916\u3067\u3059(" + post_prev.userpostid + ")");
					}

					if (value.employeecode != tel_source[to_move][ReorgnizationModel2.TEL_IDX_EMPLOYEECODE]) //社員番号更新
						{
							temp.employeecode = tel_source[to_move][ReorgnizationModel2.TEL_IDX_EMPLOYEECODE];
						}

					if (value.mail != tel_source[to_move][ReorgnizationModel2.TEL_IDX_MAIL]) //メール更新
						{
							temp.mail = tel_source[to_move][ReorgnizationModel2.TEL_IDX_MAIL];
						}

					if (post_prev.userpostid != tel_source[to_move][ReorgnizationModel2.TEL_IDX_USERPOSTID]) //部署移動
						//移動先部署取得
						//移動先部署が対象外?
						{
							temp.userpostid = tel_source[to_move][ReorgnizationModel2.TEL_IDX_USERPOSTID];
							var post_next = this.getPostNextDataByUID(temp.userpostid);

							if (!post_next.is_target) {
								update_error.push("\u79FB\u52D5\u5148\u90E8\u7F72\u304C\u5BFE\u8C61\u5916(" + post_next.userpostid + ")");
							}

							if (Array.isArray(this.options.tel_column_clear_move)) {
								for (var col of Object.values(this.options.tel_column_clear_move)) //nullでなければnullにする
								{
									if (value[col] != undefined) {
										temp[col] = undefined;
									}
								}
							}
						}

					if (!!this.options.tel_column_rule) {
						var a = tel_source[to_move][ReorgnizationModel2.TEL_IDX_COLUMN_DEF];
						a = a.split("|");
						{
							let _tmp_4 = this.options.tel_column_rule;

							for (var key in _tmp_4) {
								var col = _tmp_4[key];

								if (value[col] != a[key]) //追加項目更新
									{
										temp[col] = a[key];
									}
							}
						}
					}
				}

			if (!!temp) {
				update[tel_idx] = temp;
			}

			if (!!update_error) {
				update_errors[tel_idx] = update_error;
			}
		}

		A_result.result = true;
		A_result.update = update;
		A_result.update_error = update_errors;
		A_result.not_match = not_match;
		return A_result;
	}

	makeData(post_source, user_source, tel_source) {
		var update_data = Array();

		if (!is_null(tel_source)) {
			var res = this.makeTelData(tel_source);

			if (res.result) {
				delete res.result;
				delete res.error;
				update_data.tel = res;
				delete res;
			} else {
				return res.error;
			}
		}

		this.update_data = update_data;
		return true;
	}

	outputUpdateTelInfo() //データ存在チェック
	//電話更新
	//更新しない電話一覧
	{
		var res = 0;

		if (!this.update_data.tel.update) {
			echo("-----------------------------");
			echo("\u96FB\u8A71\u66F4\u65B0\u306A\u3057");
			echo("-----------------------------\n");
			return;
		}

		var tel_list = this.getTelList();
		echo("-----------------------------");
		echo("\u96FB\u8A71\u66F4\u65B0\u60C5\u5831");
		echo("-----------------------------\n");
		{
			let _tmp_5 = this.update_data.tel.update;

			for (var tel_idx in _tmp_5) //更新対象の電話について
			//現在の電話の部署取得
			{
				var update_col = _tmp_5[tel_idx];
				var tel = tel_list[tel_idx];
				var post_prev = this.getPostPrevDataBySID(tel.postid);
				echo("\u3007");
				echo("\u30AD\u30E3\u30EA\u30A2(" + tel.carid + ")");
				echo("\t");
				echo("\u96FB\u8A71(" + tel.telno + ")");
				echo("\t");
				echo("\u90E8\u7F72(" + post_prev.userpostid + ")");
				echo("\u306E\u66F4\u65B0\u9805\u76EE");
				echo("\n");

				for (var col in update_col) {
					var value = update_col[col];

					if (col == "userpostid") {
						var post = this.getPostNextDataByUID(value);
						var col = "postid";
						var value = post.postid;
						tel.usertpostid = post_prev.userpostid;
					}

					echo(sprintf("%10s\t", col));
					echo(sprintf("%20s\t", "(" + (!tel[col] ? "null" : tel[col]) + ")"));
					echo(" \u304B\u3089 ");
					echo(sprintf("%20s\t", "(" + (!value ? "null" : value) + ")"));
					echo("\n");
				}

				if (undefined !== this.update_data.tel.update_error[tel_idx]) {
					echo("\t----------");
					echo("error");
					echo("----------\n");

					for (var error_str of Object.values(this.update_data.tel.update_error[tel_idx])) {
						echo("\t" + error_str + "\n");
					}
				} else {
					res++;
				}

				echo("----------------------------------------------------------\n");
			}
		}

		if (!!this.update_data.tel.not_match) {
			echo("\n");
			echo("-----------------------");
			echo("\u6761\u4EF6\u306B\u5408\u81F4\u3057\u306A\u3044\u96FB\u8A71\u4E00\u89A7");
			echo("-----------------------\n");
		}

		{
			let _tmp_6 = this.update_data.tel.not_match;

			for (var tel_idx in _tmp_6) {
				var ___data = _tmp_6[tel_idx];
				echo(tel_list[tel_idx].telno + "\n");
			}
		}
		return res;
	}

	getError() //電話のエラーチェック
	{
		A_result.result = true;
		A_result.error = Array();

		if (!!this.update_data.tel.update_error) {
			A_result.error.push("\u66F4\u65B0\u3067\u304D\u306A\u3044\u96FB\u8A71\u304C\u5B58\u5728\u3057\u3066\u3044\u308B");
		}

		A_result.result = !!A_result.error;
		return A_result;
	}

	makeUpdateTelSql(recdate) //更新なし
	//電話更新
	//ログ追加
	{
		var A_result = Array();
		A_result.error = Array();
		A_result.result = false;
		A_result.sql = Array();

		if (!this.update_data.tel) {
			A_result.result = true;
			return A_result;
		}

		var tel_list = this.getTelList();
		{
			let _tmp_7 = this.update_data.tel.update;

			for (var idx in _tmp_7) //更新カラムについて
			//更新対象の電話について
			//SQL作成
			{
				var update_col = _tmp_7[idx];
				var a = Array();

				for (var col in update_col) {
					var value = update_col[col];

					if (col == "userpostid") {
						var post = this.getPostNextDataByUID(value);
						var col = "postid";
						var value = post.postid;
					}

					a.push(col + "=" + this.dbQuote(value, this.column_type.tel_tb[col]));
				}

				var tel = tel_list[idx];
				var sql = "UPDATE " + this.tablename.tel_tb + " SET " + a.join(",") + " WHERE" + " pactid=" + this.get_DB().dbQuote(this.pactid, "integer", true) + " AND telno=" + this.get_DB().dbQuote(tel.telno, "text", true) + " AND carid=" + this.get_DB().dbQuote(tel.carid, "integer", true);
				A_result.sql.push(sql);
			}
		}
		var logs = this.makeLogForTel(recdate);

		if (!logs.result) {
			return logs;
		}

		sql = "";

		for (var log of Object.values(logs.data)) {
			if (sql != "") {
				sql += ",";
			}

			sql += "(" + log.join(",") + ")";
		}

		if (sql != "") {
			A_result.sql.push("INSERT INTO management_log_tb (" + Object.keys(logs.data[0]).join(",") + ")VALUES" + sql);
		}

		A_result.result = true;
		return A_result;
	}

	update() //エラーある？
	//電話
	//$this->get_DB()->rollback();
	{
		var A_result = Array();
		A_result.result = false;
		A_result.error = Array();
		var sql = Array();
		var recdate = this.get_DB().getNow();
		var res = this.getError();

		if (res.result) {
			return res;
		}

		if (undefined !== this.update_data.tel) {
			sql.tel = this.makeUpdateTelSql(recdate);
		}

		this.get_DB().beginTransaction();

		if (undefined !== sql.tel) {
			for (var s of Object.values(sql.tel.sql)) {
				res = this.get_DB().query(s);

				if (!is_numeric(res)) {
					A_result.error.push("\u96FB\u8A71\u66F4\u65B0\u5931\u6557(" + s + ")");
					this.get_DB().rollback();
					return A_result;
				}
			}
		}

		this.get_DB().commit();
		A_result.result = true;
		return A_result;
	}

};