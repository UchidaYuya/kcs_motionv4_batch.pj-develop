//memo
//	現在の部署情報を何度も取っているので、最初にまとめて取得してそれを使いまわすほうがよさそう
//require_once("common.php");
//
//PostTemporaryModel
//仮部署モデル
//@uses ModelBase
//@package
//@author web
//@since 2018/01/10
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
//型
//テーブル名
//実行者
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
//createIni
//iniファイルの作成
//@author web
//@since 2018/05/01
//
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
//getNextID
//
//@author web
//@since 2018/01/10
//
//@access public
//@return void
//
//
//getPostList
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
//getPostDataById
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
//addSpesialPost
//特殊部署を追加する
//@author web
//@since 2018/01/23
//
//@param mixed $pactid
//@param mixed $A_post_temporary
//@param mixed $userpostid_root
//@param mixed $sp_parent_delete
//@access private
//@return void
//
//
//readPost
//部署データ作成
//@author web
//@since 2018/01/23
//
//@access private
//@return void
//
//
//makeInsertPersonnelSQL
//ヘッダー的なやつのインサートSQL作成
//@author web
//@since 2018/01/23
//
//@param mixed $tempid
//@param mixed $pactid
//@param mixed $ini
//@access private
//@return void
//
//
//makeInsertPostSQL
//部署SQL作成
//@author web
//@since 2018/01/23
//
//@param mixed $tempid
//@param mixed $data
//@access private
//@return void
//
//
//insertPostTemporary
//仮部署登録
//@author web
//@since 2018/01/10
//
//@param mixed $tempid
//@param mixed $pactid
//@param mixed $column_rule
//@access public
//@return void
//
//
//getTemporary
//仮部署情報取得
//@author web
//@since 2018/01/11
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getPostTemporaryTree
//仮部署ツリー情報の取得
//@author web
//@since 2018/01/11
//
//@param mixed $pactid
//@access public
//@return void
//
//
//createUserData
//ユーザー情報作成
//社員番号をキーにしてデータを作り直す
//
//@author web
//@since 2018/01/24
//
//@param mixed $pactid
//@param mixed $ini
//@param mixed $post_data
//@param mixed $user_source
//@access private
//@return void
//
//
//createTelData
//電話データ取得
//@author web
//@since 2018/01/29
//
//@param mixed $pactid
//@param mixed $ini
//@param string $post_data
//@param mixed $tel_source
//@access private
//@return void
//
//
//getUserData
//ユーザーデータ取得
//@author web
//@since 2018/01/25
//
//@access public
//@return void
//
//
//getTelData
//電話データ取得
//@author web
//@since 2018/01/25
//
//@access public
//@return void
//
//
//makeInsertUserSQL
//ユーザー情報を書き込み
//@author web
//@since 2018/01/24
//
//@param mixed $tempid
//@param mixed $user_data
//@access private
//@return void
//
//
//makeInsertTelSQL
//電話情報をDBに書き込み
//@author web
//@since 2018/01/29
//
//@param mixed $tempid
//@param mixed $tel_data
//@access private
//@return void
//
//
//getLatestID
//指定したpactidの最も最新なIDを取得する
//@author web
//@since 2018/04/17
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getSuperUserID
//
//@author web
//@since 2018/05/21
//
//@param mixed $pactid
//@access private
//@return void
//
//
//getRootPost
//ルート部署取得
//@author web
//@since 2018/05/28
//
//@param mixed $pactid
//@access private
//@return void
//
//
//execReorgnization
//組織の再編成を行う
//@author web
//@since 2018/02/21
//
//@param mixed $pactid	顧客ID
//@param mixed $id		人事ID
//@param mixed $tbno	テーブル番号 post_%s_tbとして使う
//@access public
//@return void
//
//
//makeReorgPostCurrentData
//電話のみ更新、ユーザーのみ更新、の際に使う
//現状のpost_tbからmakeReorgPostDataの内容を作成する
//@author web
//@since 2018/05/29
//
//@access private
//@return void
//
//
//makeReorgPostData
//
//@author web
//@since 2018/05/15
//
//@param mixed $pactid 				顧客ID
//@param mixed $id 					人事Id
//@param mixed $post_column 			追加部署項目
//@param mixed $tel_when_post_deleted 	電話が残っている部署が削除対象になっていた時の対応
//@access private
//@return void
//
//
//____getColumnArray
//defに合わせてvalueの値をSQL用に変換する
//@author web
//@since 2018/04/17
//
//@param mixed $def
//@param mixed $value
//@access private
//@return void
//
//
//makeReorgPostSql
//部署追加、更新SQLを作成
//@author web
//@since 2018/03/09
//
//@param mixed $pactid 				顧客ID
//@param mixed $postdata 				部署データ
//@param mixed $delete_postid_list		削除対象の部署ID
//@param mixed $postid_escape			退避先部署
//@param mixed $post_column 			部署の追加管理項目の設定ルール
//@param mixed $recdate				記録日
//@access private
//@return void
//
//
//makeReorgnazationUserData
//反映用ユーザーデータの作成
//@author web
//@since 2018/02/26
//
//@param mixed $pactid 				顧客ID
//@param mixed $pid 					personnel_tbのID
//@param mixed $postdata 				部署データ
//@param mixed $delete_postid_list 	削除される部署一覧
//@access private
//@return void
//
//
//makeUserLogData
//
//@author web
//@since 2018/05/24
//
//@param mixed 	$kind,
//@param mixed 	$recdate
//@access private
//@return void
//
//
//makeReorgnaizationUserSql
//
//@author web
//@since 2018/02/28
//
//@param mixed $pactid 		部署ID
//$param mixed $postid_exec	実行者の所属する部署ID(rootid)
//@param mixed $userid_exec	実行者のuserid(superuseidを入れること)
//@param mixed $user_add 		追加するユーザー
//@param mixed $user_update 	更新するユーザー
//@param mixed $user_delete	削除するユーザー
//@param mixed $user_escape 	退避するユーザー
//@param mixed $postid 		退避先の部署ID
//@param 	 $recdate 			更新日
//@access private
//@return void
//
//
//getReorgTelData
//
//@author web
//@since 2018/03/06
//
//@param mixed $pactid
//@param mixed $pid
//@param mixed $postdata
//@param mixed $delete_postid_list
//@access public
//@return void
//
//
//makeUserLogDataOfTel
//
//@author web
//@since 2018/05/24
//
//@param mixed		$pactid,
//@param mixed 	$postid_exec,
//@param mixed 	$postname_exec,
//@param mixed 	$userid_exec,
//@param mixed 	$kind,
//@param mixed 	$recdate
//@access private
//@return void
//
//
//makeReorgTelData
//
//@author web
//@since 2018/03/06
//
//@param mixed $pactid 			顧客ID
//@param 	 $tel_update 			電話対象
//@param mixed $delete_postid_list 削除部署
//@param mixed $postid_escape 		退避先部署
//@param mixed $recdate 			更新日
//@access private
//@return void
//
//
//getFkTables
//
//@author web
//@since 2018/02/26
//
//@param mixed $table
//@access public
//@return void
//
//
//getAddColumnType
//管理追加項目のタイプを取得
//@author web
//@since 2018/03/09
//
//@param mixed $column_rule
//@access private
//@return void
//
////	
//	private function getPostRemain($pactid){
//		//	部署に残っている電話などがある部署を調べる
//		$fktables = $this->getFkTables($this->tablename["post_tb"]);
//		var_dump( $fktables );
//		foreach( $fktables as $value ){
//			if( $value["to_column"] != "postid" ){
//				continue;
//			}
//			$value["tablename"]
//		}
//		
//		$sql = "SELECT"
//					." post.postid"
//					.",post.postname"
//					.",CASE WHEN count( addbill_tb.postid ) > 0 THEN true ELSE false END as addbill_tb"
//					.",CASE WHEN count( tel_tb.postid ) > 0 THEN true ELSE false END as tel_tb"
//				." FROM post_tb as post"
//					." LEFT JOIN addbill_tb on addbill_tb.postid=post.postid"
//					." LEFT JOIN tel_tb on tel_tb.postid=post.postid"
//				." WHERE"
//					." post.pactid=" . $this->get_DB()->dbQuote( $pactid,"integer",true )
//				." GROUP BY"
//					." post.postid"
//					.",post.postname";
//		$res = $this->get_DB()->queryKeyAssoc( $sql );
//		return $res;
//	}
class ReorgnizationModel extends ModelBase {
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

	constructor() //iniファイルの初期化
	//全てのpactの値を変換しているが、正直、対象の会社だけでいいと思うので、めっちゃ暇な時に修正しよう
	{
		super();
		this.ini = undefined;
		this.tablename = Array();
		this.column_type = Array();
		this.post_list = undefined;
		this.exec_pactid = undefined;
		this.exec_postid = undefined;
		this.exec_postname = undefined;
		this.exec_userid = undefined;

		var _ini = parse_ini_file(KCS_DIR + "/conf_sync/import_post.ini", true);

		this.ini = Array();

		for (var key in _ini) {
			var value = _ini[key];
			this.ini[key] = this.convertIni(value);
		}
	}

	convertIni(ini) //電話の更新する追加管理項目(一応、それ以外のカラムも更新できるようにはなっている)
	//
	//ユーザー権限について
	//user_funcについて、ユーザー権限かどうかチェック機構を後ほどつける
	//スーパーユーザーは全ての権限を付与するという処理が必要だと思う
	//退避部署
	{
		var res = ini;

		if (undefined !== ini.tel_when_post_deleted) //想定外の値が設定されてたらエラーとかにしたほうが良いが後でやろう・・
			{} else //値が設定されてない時は0を設定しておく
			{
				res.tel_when_post_deleted = 0;
			}

		if (undefined !== ini.tel_column_clear_move) //値チェックとかしたほうがいい・・
			{} else //空を設定しておこう・・
			{
				res.tel_column_clear_move = "";
			}

		if (undefined !== ini.tel_column_rule) {
			res.tel_column_rule = ini.tel_column_rule.split(",");
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

		return res;
	}

	dbQuote(value, type, bNotNull) //データ型に合わせて返す
	{
		var t = {
			[ReorgnizationModel.TYPE_STRING]: "text",
			[ReorgnizationModel.TYPE_INTEGER]: "integer",
			[ReorgnizationModel.TYPE_TIMESTAMP]: "timestamp",
			[ReorgnizationModel.TYPE_DATE]: "date",
			[ReorgnizationModel.TYPE_BOOL]: "bool"
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
			int: ReorgnizationModel.TYPE_INTEGER,
			text: ReorgnizationModel.TYPE_STRING,
			timestamp: ReorgnizationModel.TYPE_TIMESTAMP,
			bool: ReorgnizationModel.TYPE_BOOL
		};
		var res = Array();

		while (row = pg_fetch_assoc(temp)) {
			var type = ereg_replace("[0-9]", "", row.typname);

			if (undefined !== types[type]) {
				res[row.attname] = types[type];
			} else //未設定の型(typesに設定すること)
				{
					res[row.attname] = ReorgnizationModel.TYPE_ERROR;
					echo("type error(" + tablename + ")" + __filename + "(" + 270 + ")" + "\n");
					throw die();
				}
		}

		return res;
	}

	getNextID() //IDの取得
	{
		var sql = "select nextval( 'personnel_id' )";
		return this.get_DB().queryOne(sql);
	}

	getPostList(pactid) {
		if (is_null(this.post_list)) //---------------------------------------------------------------------------------------
			//部署の取得
			//---------------------------------------------------------------------------------------
			//---------------------------------------------------------------------------------------
			//iniファイルの設定
			//---------------------------------------------------------------------------------------
			//---------------------------------------------------------------------------------------
			//対象部署の指定(is_target)
			//---------------------------------------------------------------------------------------
			{
				var sql = "select" + " post.postid" + ",post.postname" + ",post.userpostid" + ",post.fix_flag" + ",rel.postidparent" + ",rel.level" + ",recog.postidto as postidrecog" + " from " + this.tablename.post_tb + " as post" + " join " + this.tablename.post_relation_tb + " rel on rel.pactid = post.pactid and rel.postidchild = post.postid" + " LEFT JOIN recognize_tb recog ON recog.pactid=post.pactid and recog.postidfrom = post.postid" + " where" + " post.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " order by" + " rel.level";
				this.post_list = this.get_DB().queryKeyAssoc(sql);
				var ini = this.ini[pactid];

				if (!ini.target_userpostid) {
					{
						let _tmp_0 = this.post_list;

						for (var key in _tmp_0) {
							var value = _tmp_0[key];
							this.post_list[key].is_target = true;
						}
					}
				} else //ここで$root_checkがfalseの場合は何かしらするべき・・だとは思うがが
					{
						var root_check = false;
						{
							let _tmp_1 = this.post_list;

							for (var key in _tmp_1) {
								var value = _tmp_1[key];
								var is_target = false;

								if (root_check) //親が対象部署なら子も対象部署
									{
										if (this.post_list[value.postidparent].is_target) {
											is_target = true;
										}
									} else //親みつけた
									{
										if (value.userpostid == ini.target_userpostid) {
											is_target = true;
											root_check = true;
										}
									}

								this.post_list[key].is_target = is_target;
							}
						}
					}
			}

		return this.post_list;
	}

	getPostDataById(pactid, postid) {
		var post = this.getPostList(pactid);
		return undefined !== post[postid] ? post[postid] : undefined;
	}

	addSpecialPost(pactid, A_post_temporary, userpostid_root, sp_parent_delete, tel_when_post_deleted, post_not_delete_tel) //----------------------------------------------------------------------------------------------
	//返却値
	//----------------------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------------
	//post_tbの特殊部署処理。
	//仮部署に特殊部署を追加する
	//----------------------------------------------------------------------------------------------
	//特殊部署処理の値を取得。
	//0,1以外の値を設定した場合、1を設定する
	//現在の部署構成を取得
	//操作対象部署でないものは特殊部署扱い
	//----------------------------------------------------------------------------------------------
	//特殊部署の追加について
	//----------------------------------------------------------------------------------------------
	{
		var res = {
			result: true,
			add_posts: Array(),
			error: Array()
		};
		var post_list = Array();

		if (undefined !== sp_parent_delete && -1 !== [0, 1].indexOf(sp_parent_delete)) {
			sp_parent_delete = sp_parent_delete;
		} else {
			sp_parent_delete = 1;
		}

		var post_now = this.getPostList(pactid);

		for (var key in post_now) {
			var value = post_now[key];

			if (!value.is_target) {
				post_now[key].fix_flag = true;
			}
		}

		if (tel_when_post_deleted == 2) //---------------電話がある部署は特別部署とするぽよ------------------
			{
				var sql = "SELECT postid FROM " + this.tablename.tel_tb + " WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " GROUP BY postid";
				var tel_pact_list = this.get_DB().queryCol(sql);

				for (var value of Object.values(tel_pact_list)) //部署の存在チェック
				{
					if (!(undefined !== post_now[value])) //電話があるが部署がない・・
						{
							continue;
						}

					post_now[value].fix_flag = true;
				}
			}

		if (!!post_not_delete_tel) //----電話のカラムが指定された値の場合、所属部署を特別部署とする-----
			//電話の任意のカラムが任意の値だった場合、特殊部署とする
			{
				var where = "";

				for (var key in post_not_delete_tel) {
					var value = post_not_delete_tel[key];

					if (key != 0) {
						where += " or ";
					}

					var column = value[0];
					var type = this.column_type.tel_tb[value[0]];
					var val = this.dbQuote(value[1], type, true);
					where += column + "=" + val;
				}

				sql = "SELECT postid FROM " + this.tablename.tel_tb + " WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND (" + where + ")" + " GROUP BY postid";
				tel_pact_list = this.get_DB().queryCol(sql);

				for (var value of Object.values(tel_pact_list)) //部署の存在チェック
				{
					if (!(undefined !== post_now[value])) //電話があるが部署がない・・
						{
							continue;
						}

					post_now[value].fix_flag = true;
				}
			}

		for (var postid in post_now) //特別部署です？
		//ユーザー部署ID
		//部署名
		//親部署
		//追加部署情報
		//追加する
		//特殊部署の親追加する
		//親部署ID
		//特殊部署のユーザー部署ID
		//特殊部署の親を追加するために、親部署を遡る・・
		{
			var postdata = post_now[postid];

			if (!postdata.fix_flag) //continue;	//	特別部署ではない・・
				{
					echo("\u3053\u3053\u306F\u5F8C\u3067\u306F\u305A\u3059\u3053\u3068\n");
				}

			if (undefined !== A_post_temporary[postdata.userpostid]) //存在していたので、この部署は追加しない
				{
					continue;
				}

			if (postdata.is_target) //追加部署としない
				//continue;
				{
					echo("\u3053\u3053\u306F\u5F8C\u3067\u306F\u305A\u3059\u3053\u3068\n");
				}

			var temp = Array();
			temp[ReorgnizationModel.POST_IDX_USERPOSTID] = postdata.userpostid;
			temp[ReorgnizationModel.POST_IDX_POSTNAME] = postdata.postname;
			temp[ReorgnizationModel.POST_IDX_USERPOSTID_PARENT] = post_now[postdata.postidparent].userpostid;

			if (is_null(postdata.postidrecog)) {
				temp[ReorgnizationModel.POST_IDX_USERPOSTID_RECOG] = undefined;
			} else {
				temp[ReorgnizationModel.POST_IDX_USERPOSTID_RECOG] = post_now[postdata.postidrecog].userpostid;
			}

			temp[ReorgnizationModel.POST_IDX_COLUMN_DEF] = "\u3053\u3053\u306F\u5F8C\u3067\u5BFE\u5FDC";
			post_list[postdata.userpostid] = temp;
			var current = postdata.postidparent;
			var userpostid_prev = postdata.userpostid;

			switch (+sp_parent_delete) {
				case 0:
					while (1) {
						var parent = post_now[current];

						if (parent.level == 0) //親部署が見つからないままルート部署まできてしまったのでここで終わり
							//ルート部署を設定
							{
								post_list[postdata.userpostid][ReorgnizationModel.POST_IDX_USERPOSTID_PARENT] = userpostid_root;
								break;
							} else if (undefined !== A_post_temporary[parent.userpostid] || undefined !== post_list[parent.userpostid]) //親部署が見つかったので設定して終わり
							{
								post_list[postdata.userpostid][ReorgnizationModel.POST_IDX_USERPOSTID_PARENT] = parent.userpostid;
								break;
							}

						current = parent.postidparent;
					}

					break;

				case 1:
					while (1) {
						parent = post_now[current];
						temp = undefined;

						if (parent.level == 0) //ルート部署・・終わり
							{
								post_list[userpostid_prev][ReorgnizationModel.POST_IDX_USERPOSTID_PARENT] = userpostid_root;
								break;
							} else if (undefined !== A_post_temporary[parent.userpostid] || undefined !== post_list[parent.userpostid]) //部署あったのでここで終わり
							{
								break;
							} else //部署追加する
							//ユーザー部署ID
							//部署名
							//親部署
							//追加部署情報
							{
								temp = Array();
								temp[ReorgnizationModel.POST_IDX_USERPOSTID] = parent.userpostid;
								temp[ReorgnizationModel.POST_IDX_POSTNAME] = parent.postname;
								temp[ReorgnizationModel.POST_IDX_USERPOSTID_PARENT] = post_now[parent.postidparent].userpostid;

								if (is_null(parent.postidrecog)) {
									temp[ReorgnizationModel.POST_IDX_USERPOSTID_RECOG] = undefined;
								} else //
									{
										temp[ReorgnizationModel.POST_IDX_USERPOSTID_RECOG] = post_now[parent.postidrecog].userpostid;
									}

								temp[ReorgnizationModel.POST_IDX_COLUMN_DEF] = "\u3053\u3053\u306F\u5F8C\u3067\u5BFE\u5FDC";
								post_list[parent.userpostid] = temp;
								userpostid_prev = parent.userpostid;
							}

						current = parent.postidparent;
					}

					break;
			}
		}

		res.add_posts = post_list;
		return res;
	}

	createPostData(pactid, ini, source) //----------------------------------------------------------------------------------------------
	//データ修正・・userpostidをキーにする・・
	//----------------------------------------------------------------------------------------------
	//$userpostid_root = $source[0][ self::POST_IDX_USERPOSTID ];
	//ルート部署複数チェック
	//----------------------------------------------------------------------------------------------
	//特殊部署を追加
	//----------------------------------------------------------------------------------------------
	//エラーチェック
	//$result["data"] = array_merge( $tree_data,$res["add_posts"] );
	//マージだと追加分のkeyが変更されてしまうのでやめた
	{
		var result = {
			result: false,
			error: Array(),
			data: undefined,
			data_source: undefined,
			data_add: undefined
		};
		var post_error = Array();
		var userpostid_root = undefined;
		var tree_data = Array();
		post_error = Array();
		var post_root_error = Array();

		for (var value of Object.values(source)) //ユーザー部署IDのユニークチェック
		{
			var key = value[ReorgnizationModel.POST_IDX_USERPOSTID];

			if (undefined !== tree_data[key]) //この部署はユニークではない
				{
					post_error.push(key);
				}

			if (value[ReorgnizationModel.POST_IDX_USERPOSTID_PARENT] == value[ReorgnizationModel.POST_IDX_USERPOSTID]) //ユーザー部署IDと上位部署が同じならルート部署
				{
					if (is_null(userpostid_root)) //ここがルート部署
						{
							userpostid_root = value[ReorgnizationModel.POST_IDX_USERPOSTID];
						} else //ルート部署が既に設定されているためエラーとする
						{
							post_root_error.push(value[ReorgnizationModel.POST_IDX_USERPOSTID]);
						}
				}

			tree_data[key] = value;
		}

		if (!!post_root_error) {
			result.error.push("\u90E8\u7F72ID\u3068\u4E0A\u4F4D\u90E8\u7F72\u304C\u540C\u3058\u3082\u306E\u304C2\u3064\u4EE5\u4E0A\u3042\u308A\u307E\u3059\u30021\u3064\u3060\u3051\u306B\u3057\u3066\u304F\u3060\u3055\u3044(" + userpostid_root + "," + post_root_error.join(",") + ")");
		}

		if (!!post_error) //部署がユニークではない
			{
				result.error.push("\u90E8\u7F72ID\u304C\u30E6\u30CB\u30FC\u30AF\u3058\u3083\u306A\u3044\u3088(" + post_error.join(",") + ")");
			}

		if (!!result.error) {
			return result;
		}

		delete source;
		var res = this.addSpecialPost(pactid, tree_data, userpostid_root, ini.sp_parent_delete, ini.tel_when_post_deleted, ini.post_not_delete_tel);

		if (!res.result) {
			array_merge(result.error, res.error);
			return result;
		}

		post_error = Array();

		for (var userpostid in tree_data) {
			var value = tree_data[userpostid];

			if (!(undefined !== tree_data[value[ReorgnizationModel.POST_IDX_USERPOSTID_PARENT]])) {
				post_error.push(value[ReorgnizationModel.POST_IDX_USERPOSTID_PARENT]);
			}
		}

		if (!!post_error) {
			result.error.push("\u89AA\u90E8\u7F72\u6307\u5B9A\u3055\u308C\u3066\u3044\u308B\u304C\u5B58\u5728\u3057\u306A\u3044\u90E8\u7F72(" + post_error.join(",") + ")");
			return result;
		}

		post_error = Array();

		for (var userpostid in tree_data) {
			var value = tree_data[userpostid];

			if (!(undefined !== tree_data[value[ReorgnizationModel.POST_IDX_USERPOSTID_RECOG]])) {
				post_error.push(value[ReorgnizationModel.POST_IDX_USERPOSTID_RECOG]);
			}
		}

		if (!!post_error) {
			result.error.push("\u627F\u8A8D\u90E8\u7F72\u6307\u5B9A\u3055\u308C\u3066\u3044\u308B\u304C\u5B58\u5728\u3057\u306A\u3044\u90E8\u7F72(" + post_error.join(",") + ")");
			return result;
		}

		result.result = "true";
		result.data_source = tree_data;
		result.data_add = res.add_posts;
		{
			let _tmp_2 = res.add_posts;

			for (var key in _tmp_2) {
				var value = _tmp_2[key];
				tree_data[key] = value;
			}
		}
		result.data = tree_data;
		return result;
	}

	makeInsertPersonnelSQL(pid, pactid) //データの内容
	//post_temporary_tbのSQL文作成
	{
		var data = Array();
		data.id = this.get_DB().dbQuote(pid, "integer", true);
		data.pactid = this.get_DB().dbQuote(pactid, "integer", true);
		var keys = Object.keys(data);
		return "INSERT INTO personnel_tb (" + keys.join(",") + ")VALUES(" + data.join(",") + ")";
	}

	makeInsertPostSQL(tempid, data) {
		var sql = "";

		if (!data) {
			return "";
		}

		for (var key in data) {
			var value = data[key];

			if (sql != "") {
				sql += ",";
			}

			sql += "(" + this.get_DB().dbQuote(tempid, "integer", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.POST_IDX_USERPOSTID], "text", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.POST_IDX_POSTNAME], "text", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.POST_IDX_USERPOSTID_PARENT], "text", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.POST_IDX_USERPOSTID_RECOG], "text", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.POST_IDX_COLUMN_DEF], "text", true) + ")";
		}

		return "INSERT INTO personnel_post_tb" + " (personnel_id ,userpostid,postname,userpostid_parent,userpostid_recog,column_def)VALUES" + sql;
	}

	insertPersonnel(pactid, post_source, user_source, tel_source, tbno = "") //ID取得
	//iniファイルから取得
	//tel_tbのカラムを取得するぽよ(tel_xx_tbにする必要はあるのか・・)
	//テーブル一覧だよ・・
	//----------------------------------------------------------------------------------------------
	//データ作成
	//----------------------------------------------------------------------------------------------
	//部署データ作成
	//ヘッダーSQL
	//部署のSQL
	//特殊部署などは追加しないようにした
	//特殊部署などを含んだ部署ツリーは反映の度に都度作成するようにするぽよ
	//ユーザーのSQL作成
	//電話のSQL作成
	//----------------------------------------------------------------------------------------------
	//DB反映
	//----------------------------------------------------------------------------------------------
	//トランザクション開始
	//現状のものを削除
	{
		var result = {
			result: false,
			error: Array()
		};
		var column_rule = "";

		if (!(undefined !== this.ini[pactid])) {
			result.error.push("ini\u30D5\u30A1\u30A4\u30EB\u3067pactid=" + pactid + "\u306E\u8A2D\u5B9A\u304C\u306A\u3044");
			return result;
		}

		var ini = this.ini[pactid];
		this.column_type.tel_tb = this.getColumnType("tel_tb");
		this.tablename = Array();
		this.tablename.post_tb = !tbno ? "post_tb" : "post_" + tbno + "_tb";
		this.tablename.post_relation_tb = !tbno ? "post_relation_tb" : "post_relation_" + tbno + "_tb";
		this.tablename.tel_tb = !tbno ? "tel_tb" : "tel_" + tbno + "_tb";
		var post_data = this.createPostData(pactid, ini, post_source);

		if (!post_data.result) {
			return post_data;
		}

		var user_data = this.createUserData(pactid, ini, post_data.data, user_source);

		if (!user_data.result) {
			return user_data;
		}

		var tel_data = this.createTelData(pactid, ini, post_data.data, tel_source);

		if (!tel_data.result) {
			return tel_data;
		}

		var tempid = this.getNextID();
		var sql_personnel = this.makeInsertPersonnelSQL(tempid, pactid);
		var sql_post = this.makeInsertPostSQL(tempid, post_data.data_source);

		if (!user_data.data) {
			var sql_user = "";
		} else {
			sql_user = this.makeInsertUserSQL(tempid, user_data.data);
		}

		var sql_tel = this.makeInsertTelSQL(tempid, tel_data.data);
		this.get_DB().beginTransaction();
		var sql = "delete from personnel_tb where pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		var res = this.get_DB().query(sql);

		if (res === false) {
			result.error.push("\u4EBA\u4E8B\u524A\u9664\u5931\u6557");
			this.get_DB().rollback();
			return result;
		}

		res = this.get_DB().query(sql_personnel);

		if (res === false) {
			result.error.push("\u4EBA\u4E8B\u30A4\u30F3\u30B5\u30FC\u30C8\u5931\u6557");
			this.get_DB().rollback();
			return result;
		}

		if (sql_post != "") {
			res = this.get_DB().query(sql_post);

			if (res === false) {
				result.error.push("\u90E8\u7F72\u30A4\u30F3\u30B5\u30FC\u30C8\u5931\u6557");
				this.get_DB().rollback();
				return result;
			}
		}

		if (sql_user != "") {
			res = this.get_DB().query(sql_user);

			if (res === false) {
				result.error.push("\u30E6\u30FC\u30B6\u30FC\u30A4\u30F3\u30B5\u30FC\u30C8\u5931\u6557");
				this.get_DB().rollback();
				return result;
			}
		}

		res = this.get_DB().query(sql_tel);

		if (res === false) {
			result.error.push("\u96FB\u8A71\u30A4\u30F3\u30B5\u30FC\u30C8\u5931\u6557");
			this.get_DB().rollback();
			return result;
		}

		this.get_DB().commit();
		result.result = true;
		result.id = tempid;
		return result;
	}

	getPersonnel(pactid, pid = undefined) //ツリーの取得
	{
		var sql = "SELECT * FROM personnel_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true);

		if (!is_null(pid)) {
			sql += " and id = " + this.get_DB().dbQuote(pid, "integer", true);
		}

		return this.get_DB().queryHash(sql);
	}

	getPersonnelPost(pactid, id, option: {} | any[] = Array()) //------------------------------------------------------------------------------------
	//データ取得
	//------------------------------------------------------------------------------------
	//特殊部署を追加・・
	//createPostData用に作り直す(´･ω･`)
	//部署データ作成する
	//特殊部署なども追加されて部署ツリーを作成する
	//ここらへん改良すれば、csvの内容をDBに登録しなくてもよくなるやんけ
	//またデータの形式を戻す(´･ω･`)
	//この辺は作り直したい感あるかもしれない
	//------------------------------------------------------------------------------------
	//新部署に現部署情報の追加
	//optionに以下を設定
	//$option["add_post_flg"] = true
	//$option["pactid"] = pactid
	//------------------------------------------------------------------------------------
	{
		var res = {
			result: false,
			data: Array(),
			error: Array()
		};
		var left_join = "";
		var select = "";
		var sql = "SELECT" + " tree.userpostid" + ",tree.postname" + ",tree.userpostid_parent" + ",tree.userpostid_recog" + ",tree.column_def" + " FROM  personnel_post_tb as tree " + " WHERE" + " personnel_id=" + this.get_DB().dbQuote(id, "integer", true);
		var post = this.get_DB().queryHash(sql);
		var post_source = Array();

		for (var key in post) //ユーザー部署ID
		//親部署
		//部署名
		//承認部署
		//追加部署情報
		{
			var value = post[key];
			var temp = Array();
			temp[ReorgnizationModel.POST_IDX_USERPOSTID] = value.userpostid;
			temp[ReorgnizationModel.POST_IDX_USERPOSTID_PARENT] = value.userpostid_parent;
			temp[ReorgnizationModel.POST_IDX_POSTNAME] = value.postname;
			temp[ReorgnizationModel.POST_IDX_USERPOSTID_RECOG] = value.userpostid_recog;
			temp[ReorgnizationModel.POST_IDX_COLUMN_DEF] = value.column_def;
			post_source.push(temp);
		}

		post_source = this.createPostData(pactid, this.ini[pactid], post_source);
		post = Array();
		{
			let _tmp_3 = post_source.data;

			for (var key in _tmp_3) {
				var value = _tmp_3[key];
				temp = Array();
				temp.userpostid = value[ReorgnizationModel.POST_IDX_USERPOSTID];
				temp.postname = value[ReorgnizationModel.POST_IDX_POSTNAME];
				temp.userpostid_parent = value[ReorgnizationModel.POST_IDX_USERPOSTID_PARENT];
				temp.userpostid_recog = value[ReorgnizationModel.POST_IDX_USERPOSTID_RECOG];
				temp.column_def = value[ReorgnizationModel.POST_IDX_COLUMN_DEF];
				post.push(temp);
			}
		}
		delete post_source;

		if (undefined !== option.add_post_flg && option.add_post_flg) //現部署に同じuserpostidが存在する場合、その部署のpostidを付与する
			//前はJOINして情報付与してたけど、やめた(´･ω･`)
			//$select .= ",post.postid";
			//$left_join .= " left join ".$this->tablename["post_tb"]." post on "
			//." post.pactid = ".$this->get_DB()->dbQuote($option["pactid"],"integer",true )
			//." and post.userpostid = tree.userpostid";
			//値をpostidだけにすると値が配列じゃなくなるので、true追加した
			{
				sql = "SELECT userpostid,postid,true FROM " + this.tablename.post_tb + " WHERE pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
				temp = this.get_DB().queryKeyAssoc(sql);

				for (var key in post) {
					var value = post[key];

					if (undefined !== temp[value.userpostid]) {
						post[key].postid = temp[value.userpostid].postid;
					} else {
						post[key].postid = undefined;
					}
				}
			}

		if (undefined !== option.add_level && option.add_level) //重複チェック
			{
				var tree = Array();
				var dup = Array();

				for (var key in post) //部署ID => 親部署のデータを作る
				{
					var value = post[key];

					if (undefined !== tree[value.userpostid]) //部署IDの重複チェックを行っておく・・・
						{
							dup.push(value.userpostid);
						} else //親部署設定
						{
							tree[value.userpostid] = {
								key: key,
								parent: value.userpostid == value.userpostid_parent ? undefined : value.userpostid_parent,
								level: undefined
							};
						}
				}

				if (!!dup) {
					res.error.push("\u91CD\u8907\u306E\u90E8\u7F72ID\u304C\u5B58\u5728\u3057\u307E\u3059(" + dup.join(",") + ")");
					return res;
				}

				for (var key in tree) //$tree[$key]["level"] = $level;			//	階層の設定ぽよ
				//階層の設定ぽよ
				{
					var value = tree[key];
					var parent = value.parent;
					var level = 0;

					while (!is_null(parent)) {
						parent = tree[parent].parent;
						level++;
					}

					post[value.key].level = level;
				}
			}

		if (undefined !== option.key && !!post) //指定されたカラムが存在する？
			{
				if (!(undefined !== post[0][option.key])) {
					res.error.push("key\u3067\u6307\u5B9A\u3055\u308C\u305F\u30AB\u30E9\u30E0\u304C\u3042\u308A\u307E\u305B\u3093(" + option.key + ")");
					return res;
				}

				var _post = Array();

				for (var key in post) {
					var value = post[key];
					_post[value[option.key]] = value;
				}

				post = _post;
				delete _post;
			}

		res.data = post;
		res.result = true;
		return res;
	}

	createUserData(pactid, ini, post_data, user_source) //エラーチェック
	//重複社員コードあり
	{
		var result = {
			result: false,
			error: Array(),
			data: undefined
		};
		var data = Array();
		var dup_emp = Array();
		var A_loginid = Array();
		var A_loginid_dup = Array();
		var inv_post = Array();

		for (var key in user_source) //社員番号重複チェック
		{
			var value = user_source[key];

			if (undefined !== data[value[ReorgnizationModel.USER_IDX_EMPLOYEECODE]]) {
				dup_emp[value[ReorgnizationModel.USER_IDX_EMPLOYEECODE]] = true;
			}

			if (undefined !== A_loginid_dup[value[ReorgnizationModel.USER_IDX_LOGINID]]) {
				A_loginid_dup[value[ReorgnizationModel.USER_IDX_LOGINID]] = true;
			}

			if (!(undefined !== post_data[value[ReorgnizationModel.USER_IDX_USERPOSTID]])) {
				inv_post.push(value[ReorgnizationModel.USER_IDX_USERPOSTID]);
			}

			data[value[ReorgnizationModel.USER_IDX_EMPLOYEECODE]] = value;
		}

		if (!!dup_emp) {
			result.error.push("\u30E6\u30FC\u30B6\u30FC:\u91CD\u8907\u793E\u54E1\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u3059(" + Object.keys(dup_emp).join(",") + ")");
		}

		if (!!inv_post) {
			result.error.push("\u30E6\u30FC\u30B6\u30FC:\u6240\u5C5E\u90E8\u7F72\u304C\u3042\u308A\u307E\u305B\u3093(" + inv_post.join(",") + ")");
		}

		if (!!A_loginid_dup) {
			result.error.push("\u30E6\u30FC\u30B6\u30FC:\u30ED\u30B0\u30A4\u30F3ID\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059(" + Object.keys(A_loginuid_dup).join(",") + ")");
		}

		if (!result.error) //ない
			{
				result.result = true;
				result.data = data;
			} else {
			result.result = false;
		}

		return result;
	}

	createTelData(pactid, ini, post_data, source) //エラーチェック
	//重複社員コードあり
	{
		var result = {
			result: false,
			error: Array(),
			data: undefined
		};
		var data = Array();
		var dup_emp = Array();
		var inv_post = Array();

		for (var key in source) //
		{
			var value = source[key];

			if (undefined !== data[value[ReorgnizationModel.TEL_IDX_EMPLOYEECODE]]) {
				dup_emp[value[ReorgnizationModel.TEL_IDX_EMPLOYEECODE]] = true;
			}

			if (!(undefined !== post_data[value[ReorgnizationModel.TEL_IDX_USERPOSTID]])) {
				inv_post[value[ReorgnizationModel.TEL_IDX_USERPOSTID]] = true;
			}

			data.push(value);
		}

		if (!!dup_emp) {
			result.error.push("\u96FB\u8A71:\u91CD\u8907\u793E\u54E1\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u3059(" + Object.keys(dup_emp).join(",") + ")");
		}

		if (!!inv_post) {
			result.error.push("\u96FB\u8A71:\u6240\u5C5E\u90E8\u7F72\u304C\u3042\u308A\u307E\u305B\u3093(" + Object.keys(inv_post).join(",") + ")");
		}

		if (!result.error) //ない
			{
				result.result = true;
				result.data = data;
			} else {
			result.result = false;
		}

		return result;
	}

	getUserData(id) {
		var sql = "SELECT * FROM" + " personnel_user_tb" + " WHERE" + " personnel_id = " + this.get_DB().dbQuote(id, "integer", true);
		return this.get_DB().queryHash(sql);
	}

	getTelData(id) {
		var sql = "SELECT * FROM" + " personnel_tel_tb" + " WHERE" + " personnel_id = " + this.get_DB().dbQuote(id, "integer", true);
		return this.get_DB().queryHash(sql);
	}

	makeInsertUserSQL(tempid, user_data) {
		var sql = "";

		for (var key in user_data) {
			var value = user_data[key];

			if (sql != "") {
				sql += ",";
			}

			sql += "(" + this.get_DB().dbQuote(tempid, "integer", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_USERNAME], "text", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_EMPLOYEECODE], "text", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_LOGINID], "text", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_PASSWORD], "text", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_USERPOSTID], "text", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_MAIL], "text", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_LANGUAGE], "integer", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_FUNC], "integer", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_ACCEPTMAIL1], "integer", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_ACCEPTMAIL2], "integer", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_ACCEPTMAIL3], "integer", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_ACCEPTMAIL4], "integer", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.USER_IDX_ACCEPTMAIL5], "integer", true) + ")";
		}

		return "INSERT INTO personnel_user_tb" + " (" + " personnel_id" + ",username" + ",employeecode" + ",loginid" + ",passwd" + ",userpostid" + ",mail" + ",language" + ",func_class" + ",acceptmail1" + ",acceptmail2" + ",acceptmail3" + ",acceptmail4" + ",acceptmail5" + ")VALUES" + sql;
	}

	makeInsertTelSQL(tempid, tel_data) {
		var sql = "";

		for (var key in tel_data) {
			var value = tel_data[key];

			if (sql != "") {
				sql += ",";
			}

			sql += "(" + this.get_DB().dbQuote(tempid, "integer", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.TEL_IDX_USERPOSTID], "text", true) + "," + this.get_DB().dbQuote(value[ReorgnizationModel.TEL_IDX_EMPLOYEECODE], "text") + "," + this.get_DB().dbQuote(value[ReorgnizationModel.TEL_IDX_USERNAME], "text") + "," + this.get_DB().dbQuote(value[ReorgnizationModel.TEL_IDX_MAIL], "text") + "," + this.get_DB().dbQuote(value[ReorgnizationModel.TEL_IDX_SORT], "integer") + "," + this.get_DB().dbQuote(value[ReorgnizationModel.TEL_IDX_COLUMN_DEF], "text") + ")";
		}

		return "INSERT INTO personnel_tel_tb" + " (" + " personnel_id" + ",userpostid" + ",employeecode" + ",username" + ",mail" + ",sort" + ",column_def" + ")VALUES" + sql;
	}

	getLatestID(pactid) {
		var sql = "select max(id) from personnel_tb where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		return this.get_DB().queryOne(sql);
	}

	getSuperUserID(pactid) {
		var sql = "SELECT userid FROM user_tb WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND type = 'SU'";
		return this.get_DB().queryOne(sql);
	}

	getRootPost(pactid) {
		var db = this.get_DB();
		var sql = "SELECT" + " post.postid" + ",post.postname" + " FROM post_tb AS post" + " JOIN post_relation_tb rel ON" + " rel.pactid=" + db.dbQuote(pactid, "integer", true) + " AND rel.level = 0" + " AND post.postid=rel.postidchild" + " WHERE " + " post.pactid=" + db.dbQuote(pactid, "integer", true);
		return this.get_DB().queryRowHash(sql);
	}

	execReorganization(pactid, id = undefined, tbno = "") //
	//
	//tel_tbのカラムを取得するぽよ(tel_xx_tbにする必要はあるのか・・)
	//テーブル一覧だよ・・
	//実行者
	//スーパーユーザー
	//iniのエラー処理も後で必要だろう
	//idが未設定の場合は最新のものを使用する
	//データがあるかチェキする
	//----------------------------------------------------------------------------------------------
	//部署追加SQL作成
	//----------------------------------------------------------------------------------------------
	//部署情報取得、削除対象部署取得
	//----------------------------------------------------------------------------------------------
	//ユーザー情報
	//----------------------------------------------------------------------------------------------
	//var_dump( $sql_post["sql"] );
	//var_dump( $sql_tel["sql"] );
	//var_dump( $sql_user["sql"] );
	//ユーザーの追加の実行
	//部署削除を行う
	//$this->get_DB()->rollback();
	{
		var result = {
			result: false,
			error: Array(),
			data: undefined
		};
		var A_sql_post_add = undefined;
		var A_sql_post_update = Array();
		var postid_escape = undefined;
		this.column_type.tel_tb = this.getColumnType("tel_tb");
		this.tablename = Array();
		this.tablename.post_tb = !tbno ? "post_tb" : "post_" + tbno + "_tb";
		this.tablename.post_relation_tb = !tbno ? "post_relation_tb" : "post_relation_" + tbno + "_tb";
		this.tablename.tel_tb = !tbno ? "tel_tb" : "tel_" + tbno + "_tb";
		var post = this.getRootPost(pactid);
		this.exec_pactid = pactid;
		this.exec_postid = post.postid;
		this.exec_postname = post.postname;
		this.exec_userid = this.getSuperUserID(pactid);
		var userid_su = this.exec_userid;
		var ini = this.ini[pactid];

		if (is_null(id) || id == 0) {
			id = this.getLatestID(pactid);

			if (!id) {
				result.error.push(pactid + "\u306E\u30C7\u30FC\u30BF\u304C\u306A\u3044\u305F\u3081\u5B9F\u884C\u3067\u304D\u307E\u305B\u3093");
				return result;
			}
		}

		var per = this.getPersonnel(pactid, id);

		if (!per) {
			result.error.push("\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093(personnel_tb.id=" + id + ")");
			return result;
		}

		per = per[0];
		var recdate = this.get_DB().getNow();
		var bChangePost = false;

		if (bChangePost) //csv(DB)から読込
			{
				var postdata = this.makeReorgPostData(pactid, per.id, ini.post_column_rule, ini.tel_when_post_deleted, ini.target_userpostid);
			} else //現状の部署情報から作成し、変更は行わない
			{
				postdata = this.makeReorgPostCurrentData(pactid);
			}

		if (!postdata.result) {
			return postdata;
		}

		if (!ini.escape_post) //部署削除時の退避先部署が設定されてない場合、ルート部署を退避先とする
			{
				postid_escape = postdata.postid_root;
			} else //部署削除時の退避先部署が設定されている場合、該当の部署が存在するか確認する
			{
				if (undefined !== postdata.post[ini.escape_post]) //該当部署が存在する
					{
						postid_escape = postdata.post[ini.escape_post].postid;
					} else //該当部署が存在しない
					{
						result.error.push("\u90E8\u7F72\u524A\u9664\u6642\u306E\u9000\u907F\u90E8\u7F72\u306E" + ini.escape_post + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
						result.error.push("ini\u306Eescape_post\u3068\u90E8\u7F72\u30C7\u30FC\u30BF\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044");
						return result;
					}
			}

		if (bChangePost) //SQL作成
			//エラーチェック
			{
				var sql_post = this.makeReorgPostSql(pactid, postdata.post, postdata.delete_postid_list, postid_escape, ini.post_column_rule, recdate);

				if (!sql_post.result) //$result["result"] = false;
					//$result["error"][] = "部署処理エラー";
					{
						return sql_post;
					}
			} else //何も変更は行わない、空の配列を入れておく
			{
				sql_post.sql = Array();
			}

		if (!tbno) {
			var userdata = this.makeReorgUserData(pactid, per.id, postdata.post, postdata.delete_postid_list);

			if (!userdata.result) {
				return userdata;
			}

			var sql_user = this.makeReorgUserSql(pactid, userdata.add, userdata.update, userdata.delete, userdata.escape, postid_escape, ini.user_func, postdata.post, recdate);

			if (!sql_user.result) {
				return sql_user;
			}
		}

		var teldata = this.getReorgTelData(pactid, per.id, postdata.post, postdata.delete_postid_list, ini.tel_column_rule);

		if (!teldata.result) {
			return teldata;
		}

		var sql_tel = this.makeReorgTelSql(pactid, teldata.update, postdata.delete_postid_list, postid_escape, ini.tel_when_post_deleted, ini.tel_column_clear_move, ini.tel_column_rule, postdata.post, recdate);

		if (!sql_tel.result) {
			return sql_tel;
		}

		this.get_DB().beginTransaction();
		{
			let _tmp_4 = sql_post.sql;

			for (var key in _tmp_4) //nullやarrayが空の場合は何もしない
			{
				var sql = _tmp_4[key];

				if (!sql) {
					continue;
				}

				if (key == "del") {
					continue;
				}

				if (Array.isArray(sql)) {
					for (var s of Object.values(sql)) //現状の部署リレーション削除
					{
						var res = this.get_DB().query(s);

						if (res === false) {
							result.error.push(key + "\u306E\u5931\u6557");
							this.get_DB().rollback();
							return result;
						}
					}
				} else //現状の部署リレーション削除
					{
						res = this.get_DB().query(sql);

						if (res === false) {
							result.error.push(key + "\u306E\u5931\u6557");
							this.get_DB().rollback();
							return result;
						}
					}
			}
		}

		if (!tbno) {
			{
				let _tmp_5 = sql_user.sql;

				for (var key in _tmp_5) //nullやarrayが空の場合は何もしない
				{
					var sql = _tmp_5[key];

					if (!sql) {
						continue;
					}

					if (Array.isArray(sql)) //配列の場合
						{
							for (var s of Object.values(sql)) {
								res = this.get_DB().query(s);

								if (res === false) {
									result.error.push(key + "\u306E\u5931\u6557");
									this.get_DB().rollback();
									return result;
								}
							}
						} else //単品
						{
							res = this.get_DB().query(sql);

							if (res === false) {
								result.error.push(key + "\u306E\u5931\u6557");
								this.get_DB().rollback();
								return result;
							}
						}
				}
			}
		}

		{
			let _tmp_6 = sql_tel.sql;

			for (var key in _tmp_6) //nullやarrayが空の場合は何もしない
			{
				var sql = _tmp_6[key];

				if (!sql) {
					continue;
				}

				if (Array.isArray(sql)) {
					for (var s of Object.values(sql)) //現状の部署リレーション削除
					{
						res = this.get_DB().query(s);

						if (res === false) {
							result.error.push(key + "\u306E\u5931\u6557");
							this.get_DB().rollback();
							return result;
						}
					}
				} else //現状の部署リレーション削除
					{
						res = this.get_DB().query(sql);

						if (res === false) {
							result.error.push(key + "\u306E\u5931\u6557");
							this.get_DB().rollback();
							return result;
						}
					}
			}
		}

		if (undefined !== sql_post.sql.del && !!sql_post.sql.del) {
			res = this.get_DB().query(sql_post.sql.del);

			if (res === false) {
				result.error.push(key + "\u306E\u5931\u6557");
				this.get_DB().rollback();
				return result;
			}
		}

		this.get_DB().commit();
		result.result = true;
		return result;
	}

	makeReorgPostCurrentData(pactid) //rootの設定ぽよ
	//結果いれる
	{
		var A_result = {
			result: false,
			error: Array(),
			delete_postid_list: Array(),
			post: Array(),
			postid_root: undefined
		};
		var post_tb = this.getPostList(pactid);
		var postid_root = undefined;
		var post = Array();

		for (var postid in post_tb) //ルートの取得
		{
			var data = post_tb[postid];
			var temp = Array();
			temp.userpostid = data.userpostid;
			temp.postname = data.postname;
			temp.userpostid_parent = post_tb[data.postidparent].userpostid;

			if (is_null(data.postidrecog)) {
				temp.userpostid_recog = undefined;
			} else {
				temp.userpostid_recog = post_tb[data.postidrecog].userpostid;
			}

			temp.column_def = "";
			temp.postid = postid;
			temp.level = data.level;
			temp.update_flg = true;
			temp.is_target = data.is_target;
			post[data.userpostid] = temp;

			if (data.level == 0) {
				postid_root = postid;
			}
		}

		A_result.postid_root = postid_root;
		A_result.postname_root = post_tb[postid_root].postname;
		A_result.result = true;
		A_result.post = post;
		return A_result;
	}

	makeReorgPostData(pactid, id, post_column, tel_when_post_deleted, target_userpostid) //現部署の削除すべき部署一覧を格納する
	//ルート部署IDを保存しておく
	//人事データの追加すべき部署一覧を格納する
	//ルート部署
	//----------------------------------------------------------------------------------------------
	//現部署のpostid取得(過去部署の部署追加の際に、postidを参照するため)
	//----------------------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------------
	//人事データの部署を読み込む
	//----------------------------------------------------------------------------------------------
	//エラーチェック
	//----------------------------------------------------------------------------------------------
	//現状の部署と人事データの部署を比較し、削除すべき部署か判定
	//----------------------------------------------------------------------------------------------
	//操作不可部署だが、削除されようとしているものがある場合はエラーにする
	//----------------------------------------------------------------------------------------------
	//配下内、配下外の部署修正が適切かチェック(is_target)
	//具体的には、target_userpostidを除いた、親のis_targetがfalseならエラー
	//----------------------------------------------------------------------------------------------
	{
		var A_del_postid = Array();
		var postid_root = 0;
		var A_add_post = Array();
		var post_tb_now = Array();
		postid_root = 0;
		var A_result = {
			result: false,
			error: Array(),
			delete_postid_list: Array(),
			post: Array(),
			postid_root: undefined
		};

		if (this.tablename.post_tb !== "post_tb") {
			var sql = "SELECT" + " userpostid" + ",postid" + ",level" + " FROM post_tb as post " + " LEFT JOIN post_relation_tb rel on" + " rel.pactid = post.pactid" + " and rel.postidchild = post.postid" + " where" + " post.pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
			post_tb_now = this.get_DB().queryKeyAssoc(sql);
		}

		var post_tb = this.getPostList(pactid);
		var res = this.getPersonnelPost(pactid, id, {
			add_level: true,
			add_post_flg: true,
			pactid: pactid,
			key: "userpostid"
		});

		if (!res.result) {
			return res;
		}

		var person_post_tb = res.data;
		var error_delete_post = Array();

		for (var postid in post_tb) //trueの場合、この部署を削除する
		{
			var post = post_tb[postid];
			var flag = true;

			if (post.level == 0) //ルート部署は保存しておく
				{
					flag = false;
					postid_root = postid;
					var postname_root = post.postname;
				} else {
				for (var p_post of Object.values(person_post_tb)) {
					if (post.userpostid === p_post.userpostid) {
						flag = false;
						break;
					}
				}
			}

			if (flag) //操作不可部署なのに消されようとしている場合はメモる
				{
					if (!post.is_target) {
						error_delete_post.push(post.userpostid);
					}

					A_result.delete_postid_list.push(postid);
				}
		}

		if (!!error_delete_post) {
			A_result.error.push("\u64CD\u4F5C\u4E0D\u53EF\u90E8\u7F72\u304C\u524A\u9664\u5BFE\u8C61\u306B\u306A\u3063\u3066\u3044\u307E\u3059(" + error_delete_post.join(",") + ")");
			return A_result;
		}

		if (tel_when_post_deleted == 0 && !!A_result.delete_postid_list) //削除対象部署に電話があるならエラーとする
			{
				sql = "SELECT postid FROM " + this.tablename.tel_tb + " WHERE pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND postid in (" + A_result.delete_postid_list.join(",") + ")" + " GROUP BY postid";
				var tel_post = this.get_DB().queryCol(sql);

				if (!!tel_post) {
					A_result.error.push("\u524A\u9664\u5BFE\u8C61\u90E8\u7F72\u306B\u96FB\u8A71\u304C\u5B58\u5728\u3057\u307E\u3059(postid=" + tel_post.join(",") + ")");
					A_result.error.push("tel_when_post_deleted\u306E\u8A2D\u5B9A\u30921\u306B\u3059\u308B\u3068\u9000\u907F\u90E8\u7F72\u3078\u79FB\u52D5");
					A_result.error.push("tel_when_post_deleted\u306E\u8A2D\u5B9A\u30922\u306B\u3059\u308B\u3068\u90E8\u7F72\u3092\u7279\u5225\u90E8\u7F72\u6271\u3044\u3057\u3066\u5B9F\u884C\u3057\u307E\u3059");
					return A_result;
				}
			}

		for (var idx in person_post_tb) //この部署は操作不能不可部署です？
		//if( !is_null( $postid ) && !$post_tb[$postid]["is_target"] ){
		//echo $post_tb[$postid]["userpostid"]."\n";
		//}
		//ルート部署は更新とする
		//既に存在する部署は更新とする
		//それ以外は追加とする
		//$update_flag = ( $value["level"] == 0 || !is_null( $value["postid"] ) );
		//更新フラグ
		//更新フラグがfalseなら新規追加
		//postidの指定を行う
		////	ルート部署の部署IDをつけておく
		//			//	多分必要ないのでコメント
		//			if( $value["level"] == 0 ){
		//				$person_post_tb[$idx]["postid"] = $postid_root;
		//			}
		//is_target設定する
		{
			var value = person_post_tb[idx];
			var postid = value.postid;
			var update_flag = value.level == 0 && postid_root != 0 || !is_null(value.postid);
			person_post_tb[idx].update_flg = update_flag;

			if (!update_flag) {
				if (value.level == 0) //そもそも部署がない場合(過去テーブルではあり得る)の場合は現部署のルート部署postidを使用する
					//現部署のルート部署ID使う
					{
						for (var nkey in post_tb_now) {
							var nvalue = post_tb_now[nkey];

							if (nvalue.level == 0) {
								postid_root = nvalue.postid;
								postid = postid_root;
								break;
							}
						}
					} else if (undefined !== post_tb_now[value.userpostid]) //現部署の部署ID使う
					{
						postid = post_tb_now[value.userpostid].postid;
					} else //新規部署ID
					{
						sql = "select nextval('post_tb_postid_seq'::regclass)";
						postid = this.getDB().queryOne(sql);
					}
			}

			person_post_tb[idx].postid = postid;

			if (!!target_userpostid && undefined !== post_tb[postid]) {
				person_post_tb[idx].is_target = post_tb[postid].is_target;

				if (-1 !== A_result.delete_postid_list.indexOf(postid)) {
					A_result.error.push("\u64CD\u4F5C\u4E0D\u53EF\u90E8\u7F72\u304C\u524A\u9664\u5BFE\u8C61\u306B\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059(" + post_tb[postid].userpostid + ")");
					return A_result;
				}
			} else {
				person_post_tb[idx].is_target = true;
			}
		}

		for (var key in person_post_tb) //操作部署対象外かチェック
		{
			var value = person_post_tb[key];

			if (!value.is_target) //操作対象ではない
				{
					continue;
				}

			if (person_post_tb[value.userpostid_parent].is_target) //親が操作対象なので問題ない
				{
					continue;
				}

			if (target_userpostid == value.userpostid) //操作対象部署のルートなので問題ない
				{
					continue;
				}

			A_result.error.push("\u64CD\u4F5C\u975E\u5BFE\u79F0\u90E8\u7F72\u3060\u304C\u64CD\u4F5C\u5BFE\u8C61\u306B\u306A\u3063\u3066\u3044\u308B(" + value.userpostid + ")");
		}

		if (!!A_result.error) {
			return A_result;
		}

		A_result.result = true;
		A_result.post = person_post_tb;
		A_result.postid_root = postid_root;
		A_result.postname_root = postname_root;
		return A_result;
	}

	____getColumnArray(def, column_str) //追加管理項目をパイプで区切って配列にする
	//column_strが空の場合はnullとする
	//追加管理項目の設定を行うぽよ
	{
		var temp = Array();
		var col_value = !column_str ? undefined : column_str.split("|");

		for (var i in def) //col_valueがnullでなければ値を入れる
		{
			var c = def[i];
			var a = "NULL";

			if (!is_null(col_value) && undefined !== col_value[i]) {
				switch (c.type) {
					case ReorgnizationModel.TYPE_STRING:
						a = this.get_DB().dbQuote(col_value[i], "text");
						break;

					case ReorgnizationModel.TYPE_INTEGER:
						a = this.get_DB().dbQuote(col_value[i], "integer");
						break;

					case ReorgnizationModel.TYPE_TIMESTAMP:
						a = this.get_DB().dbQuote(col_value[i], "timestamp");
						break;

					case ReorgnizationModel.TYPE_DATE:
						a = this.get_DB().dbQuote(col_value[i], "date");
						break;
				}
			}

			temp[c.column] = a;
		}

		return temp;
	}

	makeReorgPostSql(pactid, postdata, delete_postid_list, postid_escape, post_column, recdate) //userpostidからpostdataのkeyが取れるようにしておく
	//結果ぽよ
	//結果。trueなら成功
	//エラー内容
	//リレーション削除
	//未処理の注文の更新
	//post_tb.postidにキーを張っているテーブルを取得
	//部署削除
	//追加する部署
	//更新する部署
	//追加するリレーション
	//更新内容テンプレ
	//----------------------------------------------------------------------------------------------
	//部署リレーション削除
	//----------------------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------------
	//部署のアップデート、追加SQL作成
	//----------------------------------------------------------------------------------------------
	//追加テンプレ
	//部署追加管理項目を追加する
	//追加SQLの作成
	//追加SQLの作成
	{
		var userpostid_to_idx = Array();
		var postid_root = undefined;
		var res = Array();
		res.result = false;
		res.error = Array();
		sql.sql = Array();
		res.sql.rel_del = undefined;
		res.sql.order_array = Array();
		res.sql.table_array = Array();
		res.sql.del = undefined;
		res.sql.add = undefined;
		res.sql.update_array = Array();
		res.sql.rel = undefined;
		recdate = this.get_DB().dbQuote(recdate, "timestamp", true);
		res.sql.rel_del = "delete from " + this.tablename.post_relation_tb + " where pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		var temp = Array();
		temp.pactid = this.get_DB().dbQuote(pactid, "integer", true);
		temp.postid = undefined;
		temp.userpostid = undefined;
		temp.postname = undefined;
		temp.recdate = recdate;
		temp.fixdate = recdate;
		var add_column_type = this.getAddColumnType(post_column);

		if (!add_column_type.result) {
			return add_column_type;
		}

		var sql_add = "";

		for (var key in postdata) //操作対象部署でのみ操作する
		{
			var value = postdata[key];

			if (value.is_target) //追加管理項目だよ
				//追加管理項目をパイプで区切って配列にする
				{
					var add_columns = this.____getColumnArray(add_column_type.data, value.column_def);

					if (value.update_flg) //更新SQL
						//更新の場合は追加管理項目の設定しない
						{
							var __up_sql = "";

							for (var k in add_columns) {
								var v = add_columns[k];
								__up_sql += "," + k + "=" + v;
							}

							var sql = "UPDATE " + this.tablename.post_tb + " SET" + " userpostid=" + this.get_DB().dbQuote(value.userpostid, "text", true) + ",postname=" + this.get_DB().dbQuote(value.postname, "text", true) + ",fixdate=" + recdate + __up_sql + " WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and postid=" + this.get_DB().dbQuote(value.postid, "integer", true);
							res.sql.update_array.push(sql);
						} else //値いれる
						//管理項目入れる
						//SQLを積む
						{
							temp.postid = this.get_DB().dbQuote(value.postid, "integer", true);
							temp.userpostid = this.get_DB().dbQuote(value.userpostid, "text", true);
							temp.postname = this.get_DB().dbQuote(value.postname, "text", true);

							for (var col in add_columns) {
								var colval = add_columns[col];
								temp[col] = colval;
							}

							if (sql_add != "") {
								sql_add += ",";
							}

							sql_add += "(" + temp.join(",") + ")";
						}
				}

			userpostid_to_idx[postdata[key].userpostid] = key;
		}

		if (sql_add != "") {
			res.sql.add = "INSERT INTO " + this.tablename.post_tb + " (" + Object.keys(temp).join(",") + ")VALUES" + sql_add;
		}

		temp = Array();
		temp.pactid = this.get_DB().dbQuote(pactid, "integer", true);
		temp.postidparent = 0;
		temp.postidchild = 0;
		temp.level = 0;
		sql_add = "";

		for (var key in postdata) //SQLを積む
		{
			var value = postdata[key];
			var idx = userpostid_to_idx[value.userpostid_parent];
			temp.postidparent = this.get_DB().dbQuote(postdata[idx].postid, "integer", true);
			temp.postidchild = this.get_DB().dbQuote(value.postid, "integer", true);
			temp.level = this.get_DB().dbQuote(value.level, "integer", true);

			if (sql_add != "") {
				sql_add += ",";
			}

			sql_add += "(" + temp.join(",") + ")";

			if (value.level == 0) {
				postid_root = value.postid;
			}
		}

		if (sql_add != "") {
			res.sql.rel = "INSERT INTO " + this.tablename.post_relation_tb + " (" + Object.keys(temp).join(",") + ")VALUES" + sql_add;
		}

		if (!!delete_postid_list) //削除対象部署の未承認注文と販売店処理を取得
			//承認処理中
			//販売店処理中
			//未承認と
			{
				sql = "SELECT orderid,status FROM mt_order_tb" + " WHERE " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND postid IN (" + delete_postid_list.join(",") + ")" + " AND status <= 130" + " AND status != 30";
				var orderid_list = this.get_DB().queryKeyAssoc(sql);
				var orderid_recog = Array();
				var orderid_shop = Array();

				if (!!orderid_list) //もうこの情報は使わないので解放する
					{
						for (var orderid in orderid_list) {
							var status = orderid_list[orderid];

							if (status < 50) //承認中処理
								{
									orderid_recog.push(orderid);
								} else //販売店処理中
								{
									orderid_shop.push(orderid);
								}
						}

						delete orderid_list;
					}

				if (!!orderid_recog) {
					if (undefined !== this.ini.not_recog_order) {
						switch (this.ini.not_recog_order) {
							case 0:
								res.error.push("\u672A\u627F\u8A8D\u6CE8\u6587\u304C\u3042\u308B\u305F\u3081\u51E6\u7406\u505C\u6B62\u3057\u307E\u3057\u305F");
								res.error.push("\u672A\u627F\u8A8D\u6CE8\u6587\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u3066\u5B9F\u884C\u3057\u305F\u3044\u5834\u5408\u306Fnot_recog_order=1\u306B\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044");
								return res;

							case 1:
								var where = " WHERE" + " orderid IN (" + orderid_recog.join(",") + ")";
								res.sql.order_array.push("update mt_order_teldetail_tb set substatus=" + ReorgnizationModel.ORDERSTATUS_DELETE + where);
								res.sql.order_array.push("update mt_order_sub_tb set substatus=" + ReorgnizationModel.ORDERSTATUS_DELETE + where);
								res.sql.order_array.push("update mt_order_tb set status=" + ReorgnizationModel.ORDERSTATUS_DELETE + where);
								break;

							default:
								res.error.push("not_recog_order\u304C\u7121\u52B9\u306A\u5024");
								res.error.push("1:status\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3068\u3059\u308B");
								res.error.push("0:\u30A8\u30E9\u30FC\u3068\u3057\u3066\u51E6\u7406\u3092\u6B62\u3081\u308B");
								return res;
						}
					}

					delete orderid_recog;
				}

				if (!!orderid_shop) //とりあえずルートに・・
					//もうこの情報は使わないので解放する
					{
						res.sql.order_array.push("update mt_order_tb set " + "postid=" + this.getDB().dbQuote(postid_escape, "integer", true) + " where " + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and orderid in (" + orderid_shop.join(",") + ")");
						delete orderid_shop;
					}
			}

		if (!!delete_postid_list) {
			var tables = this.getFkTables(this.tablename.post_tb);

			for (var table of Object.values(tables)) //削除条件
			{
				where = " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and " + table.from_column + " IN (" + delete_postid_list.join(",") + ")";

				if (table.from_column == "postidchild" || table.from_column == "postidfrom" || table.tablename == "faq_rel_pact_tb" || table.tablename == "info_relation_tb" || table.tablename == "post_rel_shop_info_tb" || table.tablename == "shop_relation_tb" || table.tablename == "iccard_close_tb") {
					res.sql.table_array.push("delete from " + table.tablename + where);
				} else {
					res.sql.table_array.push("update " + table.tablename + " set " + table.from_column + "=" + this.getDB().dbQuote(postid_escape, "integer", true) + where);
				}
			}
		}

		if (!!delete_postid_list) {
			res.sql.del = "DELETE FROM " + this.tablename.post_tb + " WHERE " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND postid IN (" + delete_postid_list.join(",") + ")";
		}

		res.result = true;
		return res;
	}

	makeReorgUserData(pactid, pid, postdata, delete_postid_list) //----------------------------------------------------------------------------------------------
	//人事データ取得
	//ログインIDをキーにして作成
	//----------------------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------------
	//現在登録されているログインIDを取得
	//----------------------------------------------------------------------------------------------
	//user_nowにuserpostid追加
	//上のSQLにpost_tbをJOINしてuserpostidを取得しようとしたが、なぜか正しい値が入ってこないので
	//getPostListから取得することにした
	//使わないので解放
	//----------------------------------------------------------------------------------------------
	//ユーザーの追加と更新
	//----------------------------------------------------------------------------------------------
	//更新と追加ユーザー
	//ユーザーが現在所属している部署が、操作不可部署
	{
		var crypt = MtCryptUtil.singleton();
		var A_result = {
			result: false,
			error: Array(),
			delete: Array(),
			update: Array(),
			escape: Array(),
			add: Array()
		};
		var sql = "SELECT loginid,* from personnel_user_tb" + " WHERE personnel_id = " + this.get_DB().dbQuote(pid, "integer", true);
		var user_new = this.get_DB().queryKeyAssoc(sql);
		sql = "SELECT" + " loginid" + ",postid" + ",userid" + ",type" + ",fix_flag" + ",postid" + " FROM user_tb" + " WHERE pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		var user_now = this.get_DB().queryKeyAssoc(sql);
		var post_tb = this.getPostList(pactid);

		for (var key in user_now) {
			var value = user_now[key];
			user_now[key].userpostid = undefined !== post_tb[value.postid] ? post_tb[value.postid].userpostid : undefined;
		}

		delete post_tb;
		var error_user = Array();
		var error_post = Array();

		for (var loginid in user_new) //部署情報の取得
		//既に登録されているユーザーの場合は取得
		//postid設定しておく
		//ユーザーの所属部署、移動先部署が操作対象部署か調べる
		{
			var value = user_new[loginid];
			var post = postdata[value.userpostid];
			var user_old = undefined !== user_now[loginid] ? user_now[loginid] : undefined;
			value.postid = post.postid;

			if (!post.is_target) //error:操作対象外部署・・部署IDを保存しておく・・
				{
					error_post[post.userpostid] = true;
				}

			if (!is_null(user_old)) {
				if (undefined !== postdata[user_old.userpostid] && !postdata[user_old.userpostid].is_target) {
					error_user[loginid] = true;
				} else {
					post = this.getPostDataById(pactid, user_old.postid);

					if (!is_null(post) && !post.is_target) {
						error_user[loginid] = true;
					}
				}
			}

			if (is_null(user_old)) //存在していないので追加
				{
					value.postid_prev = undefined;
					value.userid = this.getDB().queryOne("select nextval('user_tb_userid_seq'::regclass) ");
					A_result.add[loginid] = value;
				} else //既に存在しているユーザーは更新
				{
					value.postid_prev = user_old.postid;
					value.userid = user_old.userid;
					A_result.update[loginid] = value;
				}
		}

		if (!!error_user || !!error_post) {
			if (!!error_user) {
				A_result.error.push("\u73FE\u5728\u3001\u64CD\u4F5C\u4E0D\u53EF\u90E8\u7F72\u306B\u6240\u5C5E\u3057\u3066\u3044\u307E\u3059(" + Object.keys(error_user).join(",") + ")");
			}

			if (!!error_post) {
				A_result.error.push("\u79FB\u52D5\u5148\u3001\u8FFD\u52A0\u5148\u306E\u90E8\u7F72\u304C\u64CD\u4F5C\u4E0D\u53EF\u90E8\u7F72\u3067\u3059(" + Object.keys(error_post).join(",") + ")");
			}

			A_result.error.push("user.csv\u3001post.csv\u3001ini\u306Etarget_userpostid\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044");
		}

		if (!!A_result.error) {
			return A_result;
		}

		for (var loginid in user_now) //人事データにデータがない場合は削除するようにしていたが、削除しないようなのでコメントにした
		//			//	更新か削除か
		//			if( isset( $user_new[$loginid] ) ){
		//				//	このユーザーは人事データにより更新される
		//				continue;
		//			}
		//スーパーユーザーは何もしない
		{
			var value = user_now[loginid];

			if (value.type === "SU") {
				continue;
			}

			if (value.fix_flag) //部署が削除されている場合、退避部署へ移動させる必要がある
				{
					if (-1 !== delete_postid_list.indexOf(value.postid)) {
						A_result.escape[value.userid] = {
							loginid: loginid,
							postid: value.postid
						};
					}

					continue;
				}

			if (!(undefined !== user_new[loginid])) //追加、更新のユーザーは省いて処理をする
				//削除部署にいるユーザーは削除する
				{
					if (-1 !== delete_postid_list.indexOf(value.postid)) {
						A_result.delete[value.userid] = {
							loginid: loginid,
							postid: value.postid
						};
					}
				}
		}

		A_result.result = true;
		return A_result;
	}

	makeLogTemplate(kind, recdate) //実行対象、実行者の設定とkindの設定
	//対象の顧客ID
	//実行した部署(ルート固定)
	//実行した部署名(ルート部署名)
	//実行したユーザー(スーパーユーザ)
	//実行日
	//実行ユーザー名
	//ユーザーならU
	//ここから下は随時書き換える必要がある
	//対象部署ID
	//タイプ・・追加、変更、など
	{
		var temp = Array();
		temp.pactid = this.get_DB().dbQuote(this.exec_pactid, "integer", true);
		temp.postid = this.get_DB().dbQuote(this.exec_postid, "integer", true);
		temp.postname = this.get_DB().dbQuote(this.exec_postname, "text", true);
		temp.userid = this.get_DB().dbQuote(this.exec_userid, "integer", true);
		temp.recdate = this.get_DB().dbQuote(recdate, "timestamp", true);
		temp.username = "'\u30B7\u30B9\u30C6\u30E0'";
		temp.joker_flag = "0";
		temp.kind = this.get_DB().dbQuote(kind, "text", true);
		temp.targetpostid = 0;
		temp.type = "''";
		temp.comment1 = "''";
		temp.comment1_eng = "''";
		temp.comment2 = "''";
		temp.comment2_eng = "''";
		return temp;
	}

	makeReorgUserSql(pactid, user_add, user_update, user_delete, user_escape, postid_escape, user_func_list, postdata, recdate) //結果ぽよ
	//結果。trueなら成功
	//エラー内容
	//ユーザー追加SQL
	//ユーザー追加のログ
	//ユーザー更新
	//ユーザー更新
	//
	//
	//追加ユーザーへの権限追加
	//---------------------------------------------------------------------------------------
	//パスワード暗号化
	//---------------------------------------------------------------------------------------
	///--------------------------------------------------------------------------------------
	//ユーザーテンプレ情報
	///--------------------------------------------------------------------------------------
	//標準のお知らせメール
	//重要なお知らせメール
	//価格表メール
	//申請、承認関連メール
	//注文時販売店からのメール
	//言語
	//レコード登録日
	//レコード更新日
	//$temp["zip"]			= null;
	//$temp["addr1"]			= null;
	//$temp["addr2"]			= null;
	//$temp["building"]		= null;
	//$temp["telno"]			= null;
	//$temp["faxno"]			= null;
	//固定IDフラグ
	//ログ情報のテンプレ
	//--------------------------------------------------------------------------------------
	//ユーザー追加SQL
	//--------------------------------------------------------------------------------------
	//sqlの作成
	//更新しない項目を消す
	//ユーザーIDは更新しない
	//会社は更新しない
	//ログインIDは更新しない
	//記録日は更新しない
	//言語は更新しない？
	//sqlログの作成の作成
	{
		var res = Array();
		res.result = false;
		res.error = Array();
		res.sql = Array();
		res.sql.add = "";
		res.sql.add_log = "";
		res.sql.update = Array();
		res.sql.update_log = "";
		res.sql.delete = "";
		res.sql.delete_log = "";
		res.sql.escape = "";
		res.sql.add_func = "";
		var O_crypt = MtCryptUtil.singleton();
		var temp = Array();
		temp.userid = 0;
		temp.pactid = this.get_DB().dbQuote(pactid, "integer", true);
		temp.username = undefined;
		temp.employeecode = undefined;
		temp.postid = undefined;
		temp.loginid = undefined;
		temp.passwd = undefined;
		temp.type = this.get_DB().dbQuote("US", "text", true);
		temp.mail = undefined;
		temp.acceptmail1 = this.get_DB().dbQuote(0, "integer", true);
		temp.acceptmail2 = this.get_DB().dbQuote(0, "integer", true);
		temp.acceptmail3 = this.get_DB().dbQuote(0, "integer", true);
		temp.acceptmail4 = this.get_DB().dbQuote(0, "integer", true);
		temp.acceptmail5 = this.get_DB().dbQuote(0, "integer", true);
		temp.language = this.get_DB().dbQuote("JPN", "text", true);
		temp.recdate = this.get_DB().dbQuote(recdate, "timestamp", true);
		temp.fixdate = this.get_DB().dbQuote(recdate, "timestamp", true);
		temp.fix_flag = this.get_DB().dbQuote(false, "bool", true);
		var log_info = this.makeLogTemplate("U", recdate);
		var sql_log_head = "INSERT INTO mnglog_tb (" + Object.keys(log_info).join(",") + ")VALUES";
		var sql = "";
		var sql_log = "";

		for (var loginid in user_add) //標準のお知らせメール
		//重要なお知らせメール
		//価格表メール
		//申請、承認関連メール
		//注文時販売店からのメール
		//言語
		//ログ
		{
			var value = user_add[loginid];
			temp.userid = this.get_DB().dbQuote(value.userid, "integer", true);
			temp.username = this.get_DB().dbQuote(value.username, "text", true);
			temp.employeecode = this.get_DB().dbQuote(value.employeecode, "text", true);
			temp.postid = this.get_DB().dbQuote(value.postid, "text", true);
			temp.loginid = this.get_DB().dbQuote(loginid, "text", true);
			temp.passwd = "'" + O_crypt.getCrypt(value.passwd) + "'";
			temp.mail = this.get_DB().dbQuote(value.mail, "text", true);
			temp.acceptmail1 = this.get_DB().dbQuote(value.acceptmail1, "integer", true);
			temp.acceptmail2 = this.get_DB().dbQuote(value.acceptmail2, "integer", true);
			temp.acceptmail3 = this.get_DB().dbQuote(value.acceptmail3, "integer", true);
			temp.acceptmail4 = this.get_DB().dbQuote(value.acceptmail4, "integer", true);
			temp.acceptmail5 = this.get_DB().dbQuote(value.acceptmail5, "integer", true);
			var lang = "";

			switch (value.language) {
				case 0:
					lang = "JPN";
					break;

				case 1:
					lang = "ENG";
					break;

				default:
					lang = "JPN";
					break;
			}

			temp.language = this.get_DB().dbQuote(lang, "text", true);

			if (sql != "") {
				sql += ",";
			}

			sql += "(" + temp.join(",") + ")";
			log_info.targetpostid = this.get_DB().dbQuote(value.postid, "integer", true);
			log_info.type = this.get_DB().dbQuote("\u8FFD\u52A0", "text", true);
			log_info.comment1 = this.get_DB().dbQuote("ID\uFF1A" + loginid, "text", true);
			log_info.comment2 = this.get_DB().dbQuote("\u30E6\u30FC\u30B6\u65B0\u898F\u8FFD\u52A0", "text", true);
			log_info.comment1_eng = this.get_DB().dbQuote("ID\uFF1A" + loginid, "text", true);
			log_info.comment2_eng = this.get_DB().dbQuote("New user registration", "text", true);
			sql_log += (sql_log == "" ? "" : ",") + "(" + log_info.join(",") + ")";
		}

		if (sql != "") //ログ
			{
				var keys = Object.keys(temp);
				res.sql.add = "INSERT INTO user_tb(" + keys.join(",") + ")VALUES" + sql;
				res.sql.add_log = sql_log_head + sql_log;
			}

		sql = "";
		sql_log = "";
		delete temp.userid;
		delete temp.pactid;
		delete temp.loginid;
		delete temp.recdate;
		delete temp.language;
		delete temp.fix_flag;
		keys = Object.keys(temp);

		for (var loginid in user_update) //標準のお知らせメール
		//重要なお知らせメール
		//価格表メール
		//申請、承認関連メール
		//注文時販売店からのメール
		//言語
		//SQL作成
		//ログ
		{
			var value = user_update[loginid];
			temp.username = this.get_DB().dbQuote(value.username, "text", true);
			temp.employeecode = this.get_DB().dbQuote(value.employeecode, "text", true);
			temp.postid = this.get_DB().dbQuote(value.postid, "text", true);
			temp.passwd = "'" + O_crypt.getCrypt(value.passwd) + "'";
			temp.mail = this.get_DB().dbQuote(value.mail, "text", true);
			temp.acceptmail1 = this.get_DB().dbQuote(value.acceptmail1, "integer", true);
			temp.acceptmail2 = this.get_DB().dbQuote(value.acceptmail2, "integer", true);
			temp.acceptmail3 = this.get_DB().dbQuote(value.acceptmail3, "integer", true);
			temp.acceptmail4 = this.get_DB().dbQuote(value.acceptmail4, "integer", true);
			temp.acceptmail5 = this.get_DB().dbQuote(value.acceptmail5, "integer", true);
			lang = "";

			switch (value.language) {
				case 0:
					lang = "JPN";
					break;

				case 1:
					lang = "ENG";
					break;

				default:
					lang = "JPN";
					break;
			}

			temp.language = this.get_DB().dbQuote(lang, "text", true);
			sql = "";

			for (var col in temp) {
				var v = temp[col];

				if (sql != "") {
					sql += ",";
				}

				sql += col + "=" + v;
			}

			sql = "UPDATE user_tb SET " + sql + " WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and userid=" + this.get_DB().dbQuote(value.userid, "integer", true);
			res.sql.update.push(sql);
			var movemsg = "";
			var movemsg_eng = "";

			if (!is_null(value.postid_prev) && value.postid != value.postid_prev) {
				var post_prev = this.getPostDataById(pactid, value.postid_prev);
				var post_next = postdata[value.userpostid];
				movemsg = "\u304A\u3088\u3073" + post_prev.postname + "\u304B\u3089" + post_next.postname + "\u3078\u6240\u5C5E\u90E8\u7F72\u79FB\u52D5";
				movemsg_eng = " and its department move from " + post_prev.postname + " to " + post_next.postname;
			}

			log_info.targetpostid = this.get_DB().dbQuote(value.postid, "integer", true);
			log_info.type = this.get_DB().dbQuote("\u5909\u66F4", "text", true);
			log_info.comment1 = this.get_DB().dbQuote("ID\uFF1A" + loginid + "\u306E\u5185\u5BB9\u5909\u66F4" + movemsg, "text", true);
			log_info.comment2 = this.get_DB().dbQuote("\u30E6\u30FC\u30B6\u767B\u9332\u5185\u5BB9\u5909\u66F4", "text", true);
			log_info.comment1_eng = this.get_DB().dbQuote("Information change of ID\uFF1A" + loginid + movemsg_eng, "text", true);
			log_info.comment2_eng = this.get_DB().dbQuote("User information change", "text", true);
			sql_log += (sql_log == "" ? "" : ",") + "(" + log_info.join(",") + ")";
		}

		if (sql_log != "") {
			res.sql.update_log = sql_log_head + sql_log;
		}

		if (!!user_delete) //ユーザー削除
			//ログ
			{
				res.sql.delete = "DELETE FROM user_tb WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND userid IN (" + Object.keys(user_delete).join(",") + ")";
				sql_log = "";

				for (var userid in user_delete) {
					var data = user_delete[userid];
					log_info.targetpostid = this.get_DB().dbQuote(data.postid, "integer", true);
					log_info.type = this.get_DB().dbQuote("\u524A\u9664", "text", true);
					log_info.comment1 = this.get_DB().dbQuote("ID\uFF1A" + data.loginid + "\u3092\u524A\u9664", "text", true);
					log_info.comment2 = this.get_DB().dbQuote("\u30E6\u30FC\u30B6\u524A\u9664", "text", true);
					log_info.comment1_eng = this.get_DB().dbQuote("Delete ID\uFF1A" + data.loginid, "text", true);
					log_info.comment2_eng = this.get_DB().dbQuote("User deletion", "text", true);
					sql_log += (sql_log == "" ? "" : ",") + "(" + log_info.join(",") + ")";
				}

				res.sql.delete_log = sql_log_head + sql_log;
			}

		if (!!user_escape) //ログ
			{
				res.sql.escape = "UPDATE user_tb SET" + " postid=" + this.get_DB().dbQuote(postid_escape, "integer", true) + "  WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND userid IN (" + Object.keys(user_escape).join(",") + ")";
				sql_log = "";
				post_next = this.getPostDataById(pactid, postid_escape);

				for (var userid in user_escape) {
					var data = user_escape[userid];
					post_prev = this.getPostDataById(pactid, data.postid);
					movemsg = "\u304A\u3088\u3073" + post_prev.postname + "\u304B\u3089" + post_next.postname + "\u3078\u6240\u5C5E\u90E8\u7F72\u79FB\u52D5";
					movemsg_eng = " and its department move from " + post_prev.postname + " to " + post_next.postname;
					log_info.targetpostid = this.get_DB().dbQuote(postid_escape, "integer", true);
					log_info.type = this.get_DB().dbQuote("\u5909\u66F4", "text", true);
					log_info.comment1 = this.get_DB().dbQuote("ID\uFF1A" + data.loginid + "\u306E\u5185\u5BB9\u5909\u66F4", "text", true);
					log_info.comment2 = this.get_DB().dbQuote("\u30E6\u30FC\u30B6\u767B\u9332\u5185\u5BB9\u5909\u66F4", "text", true);
					log_info.comment1_eng = this.get_DB().dbQuote("Information change of ID\uFF1A" + data.loginid, "text", true);
					log_info.comment2_eng = this.get_DB().dbQuote("User information change", "text", true);
					sql_log += (sql_log == "" ? "" : ",") + "(" + log_info.join(",") + ")";
				}

				res.sql.escape_log = sql_log_head + sql_log;
			}

		sql = "";

		for (var loginid in user_add) {
			var value = user_add[loginid];

			if (!(undefined !== user_func_list[value.func_class])) {
				res.error.push("user_func" + value.func_class + "\u306F\u5B58\u5728\u3057\u307E\u305B\u3093");
				return res;
			}

			for (var funcid of Object.values(user_func_list[value.func_class])) {
				if (sql != "") {
					sql += ",";
				}

				sql += "(" + this.get_DB().dbQuote(pactid, "integer", true) + "," + this.get_DB().dbQuote(value.userid, "integer", true) + "," + this.get_DB().dbQuote(funcid, "integer", true) + ")";
			}
		}

		if (sql != "") {
			res.sql.add_func = "INSERT INTO fnc_relation_tb (pactid,userid,fncid)VALUES" + sql;
		}

		res.result = true;
		return res;
	}

	getReorgTelData(pactid, pid, postdata, delete_postid_list, tel_column_rule) //社員番号、メールアドレスはユニークの前提として処理を行う
	//----------------------------------------------------------------------------------------------
	//電話データ取得
	//carid,telnoでソートして、電話の順番を固めること
	//また、check_emp,sortでソートして、社員番号を優先させること
	//----------------------------------------------------------------------------------------------
	//更新するものと追加するもので振り分ける
	//電話の移動
	//tel_column_ruleの確認
	//iniの初期化時に確認すればいい気もする
	//更新するカラム数
	//部署一覧
	//エラーメッセージ表示
	{
		var A_result = {
			result: false,
			error: Array(),
			update: Array()
		};
		var sql = "SELECT" + " tel.telno" + ",tel.telno_view" + ",tel.carid" + ",tel.postid as postid_old" + ",psn.employeecode as employeecode" + ",psn.mail as mail" + ",CASE psn.employeecode" + " WHEN null THEN false" + " WHEN '' THEN false" + " WHEN tel.employeecode THEN true" + " ELSE false" + " END as check_emp" + ",CASE psn.mail" + " WHEN null THEN false" + " WHEN '' THEN false" + " WHEN tel.mail THEN true" + " ELSE false" + " END as check_mail" + ",psn.sort" + ",psn.userpostid" + ",psn.column_def" + " FROM" + " personnel_tel_tb AS psn" + " JOIN " + this.tablename.tel_tb + " tel ON" + " tel.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND (tel.employeecode = psn.employeecode OR tel.mail = psn.mail)" + " WHERE" + " personnel_id = " + this.get_DB().dbQuote(pid, "integer", true) + " ORDER BY" + " tel.carid" + ",tel.telno" + ",check_emp desc" + ",psn.sort";
		var tel = this.get_DB().queryHash(sql);
		var message = "";
		var temp = Array();
		temp.carid = 0;
		temp.cirid = 0;
		temp.telno = "";

		for (var cidx in tel_column_rule) {
			var cval = tel_column_rule[cidx];

			if (!(undefined !== this.column_type.tel_tb[cval])) {
				A_result.error.push("tel_tb\u306B" + cval + "\u306F\u3042\u308A\u307E\u305B\u3093");
				A_result.error.push("ini\u306Etel_column_rule\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044");
				return A_result;
			}
		}

		var tel_column_rule_count = tel_column_rule.length;
		var error_post_prev = Array();
		var error_post_next = Array();
		var post_tb = this.getPostList(pactid);

		for (var key in tel) //部署の存在チェック
		//移動先の部署が操作不可部署？
		//初期化するぽよ
		//部署ID
		//追加管理項目など(実際はそれ以外のカラムも操作できるよ)
		{
			var value = tel[key];

			if (!(undefined !== postdata[value.userpostid])) {
				if (message != "") {
					message += ",";
				}

				message += value.userpostid;
				continue;
			}

			if (value.carid == temp.carid && value.telno == temp.telno) {
				continue;
			}

			var post_prev = post_tb[value.postid_old];

			if (!post_prev.is_target) {
				error_post_prev[value.telno + "(" + post_prev.userpostid + ")"] = true;
			}

			var post_next = postdata[value.userpostid];

			if (!post_next.is_target) {
				error_post_next[post_next.userpostid] = true;
			}

			temp = Array();
			temp.postid_old = value.postid_old;
			temp.postid = post_next.postid;
			temp.carid = value.carid;
			temp.telno = value.telno;
			temp.telno_view = value.telno_view;
			temp.employeecode = value.employeecode;
			temp.mail = value.mail;
			temp.userpostid = value.userpostid;
			var column = value.column_def.split("|");

			if (tel_column_rule_count != column.length) {
				A_result.error.push("\u96FB\u8A71\u7BA1\u7406\u9805\u76EE\u306E\u66F4\u65B0\u5BFE\u8C61\u306B\u4E0D\u5099\u304C\u3042\u308A\u307E\u3059");
				A_result.error.push("tel.csv\u306E" + value.telno + "\u306E\u78BA\u8A8D\u3068ini\u306Etel_column_rule\u306E\u78BA\u8A8D\u3092\u3057\u3066\u304F\u3060\u3055\u3044");
				return A_result;
			}

			for (var cidx in tel_column_rule) {
				var cval = tel_column_rule[cidx];
				temp[cval] = column[cidx];
			}

			A_result.update.push(temp);
		}

		if (message != "") {
			A_result.error.push("\u90E8\u7F72ID\u304C\u3042\u308A\u307E\u305B\u3093(" + message + ")");
			return A_result;
		}

		if (!!error_post_prev) {
			A_result.error.push("\u64CD\u4F5C\u4E0D\u53EF\u90E8\u7F72\u306B\u6240\u5C5E\u3057\u3066\u3044\u308B\u96FB\u8A71\u304C\u79FB\u52D5\u5BFE\u8C61\u306B\u306A\u3063\u3066\u3044\u307E\u3059(" + Object.keys(error_post_prev).join(",") + ")");
			A_result.error.push("tel.csv\u304B\u3089\u5916\u3059\u304B\u3001\u64CD\u4F5C\u5BFE\u8C61\u90E8\u7F72\u3092\u5909\u66F4\u3057\u3066\u304F\u3060\u3055\u3044");
			return A_result;
		}

		if (!!error_post_next) {
			A_result.error.push("\u96FB\u8A71\u306E\u79FB\u52D5\u5148\u306E\u90E8\u7F72\u306F\u64CD\u4F5C\u4E0D\u53EF\u90E8\u7F72\u3067\u3059(" + Object.keys(error_post_next).join(",") + ")");
			A_result.error.push("post.csv\u3067\u79FB\u52D5\u5148\u3092\u5909\u66F4\u3057\u3066\u304F\u3060\u3055\u3044");
			return A_result;
		}

		A_result.result = true;
		return A_result;
	}

	makeLogTemplateOfTel(type, carid, telno_view, trg_postid, recdate) //対象の部署
	{
		var db = this.get_DB();
		var telno = str_replace("-", "", telno_view);
		temp.mid = 1;
		temp.pactid = db.dbQuote(this.exec_pactid, "integer", true);
		temp.postid = db.dbQuote(this.exec_postid, "integer", true);
		temp.userid = db.dbQuote(this.exec_userid, "integer", true);
		temp.username = db.dbQuote("\u30B7\u30B9\u30C6\u30E0", "text", true);
		temp.manageno = db.dbQuote(telno, "text", true);
		temp.manageno_view = db.dbQuote(telno_view, "text", true);
		temp.coid = db.dbQuote(carid, "text", true);
		var post = this.getPostDataById(this.exec_pactid, trg_postid);
		temp.trg_postid = db.dbQuote(trg_postid, "integer", false);
		temp.trg_postname = db.dbQuote(post.postname, "text", false);
		temp.joker_flag = db.dbQuote(0, "integer", true);
		temp.recdate = db.dbQuote(recdate, "timestamp", true);

		switch (type) {
			case "change":
				temp.type = db.dbQuote("\u5909\u66F4", "text", true);
				temp.comment = db.dbQuote("\u96FB\u8A71\u5909\u66F4", "text", true);
				temp.comment_eng = db.dbQuote("Change phone", "text", true);
				temp.trg_postid_aft = db.dbQuote(undefined, "integer", false);
				temp.trg_postname_aft = db.dbQuote(undefined, "text", false);
				break;

			case "move":
				temp.type = db.dbQuote("\u79FB\u52D5", "text");
				temp.comment = db.dbQuote("\u96FB\u8A71\u79FB\u52D5\uFF08" + recdate.substr(0, 4) + "\u5E74" + recdate.substr(4, 2) + "\u6708" + recdate.substr(6, 2) + "\u65E5\uFF09", "text");
				temp.comment_eng = db.dbQuote("Phone shift \uFF08" + recdate.substr(0, 8) + "\uFF09", "text", true);
				temp.trg_postid_aft = db.dbQuote(undefined, "integer", false);
				temp.trg_postname_aft = db.dbQuote(undefined, "text", false);
				break;

			default:
				return false;
				break;
		}

		return temp;
	}

	makeReorgTelSql(pactid, tel_update, delete_postid_list, postid_escape, tel_when_post_deleted, tel_column_clear_move, tel_column_rule, postdata, recdate) //結果ぽよ
	//結果。trueなら成功
	//エラー内容
	//電話更新SQL
	//電話更新SQL
	//削除部署からの退避
	//削除部署からの退避のログ
	//---------------------------------------------------------------------------------------
	//パスワード暗号化
	//---------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------
	//更新SQL(電話の移動)
	//--------------------------------------------------------------------------------------
	{
		var res = Array();
		res.result = false;
		res.error = Array();
		res.sql = Array();
		res.sql.update = Array();
		res.sql.update_log = "";
		res.sql.move_log = "";
		res.sql.escape = "";
		res.sql.escape_log = "";
		var column_clear = !tel_column_clear_move ? Array() : tel_column_clear_move.split(",");
		var posttree = Array();
		var O_crypt = MtCryptUtil.singleton();
		var sql_log_move = "";
		var sql_log_update = "";

		for (var value of Object.values(tel_update)) //値追加管理項目の更新
		//部署が移動
		//--------------------------------------------------------------------------------------
		//変更しました、というログ
		//--------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------
		//移動しました、というログ
		//--------------------------------------------------------------------------------------
		{
			var sql_update = "";

			for (var col_name of Object.values(tel_column_rule)) {
				if (undefined !== value[col_name]) {
					var col = this.dbQuote(value[col_name], this.column_type.tel_tb[col_name], true);
					sql_update += "," + col_name + "=" + col;
				} else {
					res.error.push(value.telno + "\u306E\u30AB\u30E9\u30E0(" + col_name + ")\u306E\u66F4\u65B0\u306E\u5024\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
					res.error.push("tel.csv\u3068ini\u306Etel_column_rule\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044");
					return res;
				}
			}

			if (value.postid_old !== value.postid) //部署移動する
				//移動時にカラムの値をクリア
				{
					sql_update = ",postid=" + this.get_DB().dbQuote(value.postid, "integer", true);

					for (var c of Object.values(column_clear)) {
						sql_update += "," + c + "=null";
					}
				}

			var sql = "UPDATE " + this.tablename.tel_tb + " SET " + " employeecode=" + this.get_DB().dbQuote(value.employeecode, "text", true) + ",mail=" + this.get_DB().dbQuote(value.mail, "text", true) + sql_update + " WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND telno=" + this.get_DB().dbQuote(value.telno, "text", true) + " AND carid=" + this.get_DB().dbQuote(value.carid, "integer", true);
			res.sql.update.push(sql);
			{
				var temp = this.makeLogTemplateOfTel("change", value.carid, value.telno_view, value.postid_old, recdate);
				var db = this.get_DB();
				sql_log_update += (sql_log_update == "" ? "" : ",") + "(" + temp.join(",") + ")";

				if (res.sql.update_log == "") {
					res.sql.update_log = "INSERT INTO management_log_tb (" + Object.keys(temp).join(",") + ")VALUES";
				}
			}

			if (value.postid_old !== value.postid) //新部署親子のツリー構造
				{
					if (!(undefined !== posttree[value.postid])) {
						var current = value.userpostid;
						var msg_new = "";

						do {
							var post = postdata[current];

							if (msg_new != "") {
								msg_new += " -> ";
							}

							msg_new += post.postname + "(" + post.userpostid + ")";
							current = post.userpostid_parent;
						} while (post.level > 0);

						posttree[value.postid] = msg_new;
					}

					temp = this.makeLogTemplateOfTel("move", value.carid, value.telno_view, value.postid_old, recdate);
					db = this.get_DB();
					temp.trg_postid_aft = db.dbQuote(value.postid, "integer", true);
					temp.trg_postname_aft = db.dbQuote(posttree[value.postid], "text", true);
					sql_log_move += (sql_log_move == "" ? "" : ",") + "(" + temp.join(",") + ")";

					if (res.sql.move_log == "") {
						res.sql.move_log = "INSERT INTO management_log_tb (" + Object.keys(temp).join(",") + ")VALUES";
					}
				}
		}

		if (sql_log_move != "") {
			res.sql.move_log += sql_log_move;
		}

		if (sql_log_update != "") {
			res.sql.update_log += sql_log_update;
		}

		if (!!delete_postid_list && tel_when_post_deleted == 1) {
			res.sql.escape = "UPDATE " + this.tablename.tel_tb + " SET" + " postid=" + this.get_DB().dbQuote(postid_escape, "integer", true) + "  WHERE" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " AND postid IN (" + delete_postid_list.join(",") + ")";
		}

		res.result = true;
		return res;
	}

	getFkTables(table) //指定テーブルに外部参照しているテーブル・カラム一覧
	{
		var row;
		var sql = "select " + " c.relname," + " a.attname," + " a_c.attname as column_name," + " co.conname " + " from " + " pg_catalog.pg_constraint co" + " inner join pg_class c on co.conrelid = c.oid " + " inner join pg_attribute as a on c.oid=a.attrelid and a.attnum=any(co.conkey) " + " inner join pg_class c_c on co.confrelid = c_c.oid " + " inner join pg_attribute as a_c on c_c.oid=a_c.attrelid and a_c.attnum=any(co.confkey) " + " where " + " co.confrelid = (select a.attrelid from " + " pg_catalog.pg_attribute a " + " inner join pg_class c on a.attrelid=c.oid " + " where " + " c.relname = '" + table + "' " + " and " + " a.attnum > 0 " + " and " + " not a.attisdropped " + " group by attrelid) " + " and " + " a.attnum > 0 " + " and " + " not a_c.attisdropped " + " order by a_c.attnum,c.relname ";
		var result = pg_query(this.getDB().connection(), sql);
		var fktables = Array();

		while (row = pg_fetch_assoc(result)) {
			var fcols = Array();
			fcols.tablename = row.relname;
			fcols.from_column = row.attname;
			fcols.to_column = row.column_name;
			fcols.conname = row.conname;
			fktables.push(fcols);
		}

		return fktables;
	}

	getAddColumnType(column_rule) {
		var rules = column_rule.split(",");
		var res = {
			result: false,
			error: Array(),
			data: Array()
		};
		var data = Array();
		var message = "";

		for (var key in rules) {
			var value = rules[key];
			var type = ReorgnizationModel.TYPE_ERROR;

			if (preg_match("/^ptext/", value)) {
				type = ReorgnizationModel.TYPE_STRING;
			} else if (preg_match("/^pint/", value)) {
				type = ReorgnizationModel.TYPE_INTEGER;
			} else if (preg_match("/^pdate/", value)) {
				type = ReorgnizationModel.TYPE_DATE;
			} else //無効なやつ
				{
					if (message != "") {
						message += ",";
					}

					message += value;
					continue;
				}

			data.push({
				column: value,
				type: type
			});
		}

		if (message != "") {
			res.error.push("\u90E8\u7F72\u306E\u8FFD\u52A0\u7BA1\u7406\u9805\u76EE\u3067\u7121\u52B9\u306A\u30AB\u30E9\u30E0\u3067\u3059(" + message + ")");
			return res;
		}

		res.data = data;
		res.result = true;
		return res;
	}

};