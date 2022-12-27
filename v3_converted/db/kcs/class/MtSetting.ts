//
//設定ファイル(ini)を読み込みメンバー変数に入れる
//
//更新履歴：<br>
//2008/02/05 上杉勝史 作成
//
//@package Base
//@subpackage Config
//@author katsushi
//@filesource
//@since 2008/02/05
//
//
//
//設定ファイル(ini)を読み込みメンバー変数に入れるクラスライブラリ<br>
//common.iniを標準で読み込む
//
//@package Base
//@subpackage Config
//@author katsushi
//@since 2008/02/05
//
//使用例<br>
//common.iniのセッション有効期限(sesslimit)を取得する例
//<code>
//require_once("MtSetting.php");
//$ini =& MtSetting::singleton();
//echo $ini->sesslimit;
//</code>
//
//db.iniのDB接続ユーザ(db_user)を取得する例
//<code>
//require_once("MtSetting.php");
//$ini =& MtSetting::singleton();
//$ini->loadConfig("db");
//echo $ini->db_user;
//</code>
//

require("MtExcept.php");

//
//インスタンス生成確認用
//
//@var object
//@access private
//@static
//
//
//設定内容保存用
//
//@var array
//@access private
//
//
//読み込んだ設定ファイル一覧を格納
//
//@var array
//@access private
//
//
//コンストラクタ
//
//メンバー変数の初期化<br>
//iniファイルの取得<br>
//privateなのでnewは出来ない（必ずsingletonを呼ぶ）
//
//@author katsushi
//@since 2008/02/05
//
//@access private
//@return void
//
//
//singletonパターン
//
//必ず一つだけしかインスタンスを生成しない為に実装
//
//@author katsushi
//@since 2008/02/05
//
//@static
//@access public
//@return self::$O_Instance
//
//
//設定一覧を得る<br>
//旧コードの互換性のために用意したメソッド<br>
//基本的に旧コードからの参照以外に使用してはならない
//
//@author nakanita
//@since 2008/02/08
//
//@access public
//@return array
//
//
//__get（特殊メソッド）
//
//存在しないメンバー変数にアクセスされた時に呼ばれる<br>
//iniから読み込まれたメンバー変数($H_Conf)から対応する値を返す
//
//@author katsushi
//@since 2008/02/05
//
//@param string $property_name メンバー変数名
//@access public
//@return mixed 対応するメンバー変数の値
//@uses MtExcept
//
//
//新たに設定ファイル(ini)を読み込みメンバー変数に追加する
//
//@author katsushi
//@since 2008/02/05
//
//@param string $type 設定ファイル名（.iniを除いたもの）
//@access public
//@return void
//@uses MtExcept
//
//
//設定ファイル(ini)を読み込む処理
//
//読み込み済みと存在しない場合は何もしない
//
//@author katsushi
//@since 2008/02/05
//
//@param string $type default = "common" 設定ファイル名（.iniを除いたもの）
//@access private
//@return void
//@uses MtExcept
//
//
//iniファイルの存在チェック
//
//include_pathで指定されているディレクトリを検索し<br>
//見つかった時点でフルパスでファイル名を返す<br>
//※include_pathの記述順に検索するので注意
//
//@author katsushi
//@since 2008/02/07
//
//@param string $inifile 設定ファイル名（.ini付き）
//@static
//@access private
//@return $fullinifile or false 設定ファイル名（フルパス）
//
//
//existsKey
//
//@author katsushi
//@since 2008/09/19
//
//@param mixed $property_name
//@access public
//@return void
//
class MtSetting {
	static O_Instance = undefined;

	constructor() {
		this.H_Conf = Array();
		this.A_ConfList = Array();
	}

	static singleton() //インスタンスが既に生成されていない場合のみインスタンス生成
	{
		if (MtSetting.O_Instance == undefined) {
			MtSetting.O_Instance = new MtSetting();
			MtSetting.O_Instance.parseIni();
		}

		return MtSetting.O_Instance;
	}

	getConf() {
		return this.H_Conf;
	}

	__get(property_name) {
		if (undefined !== this.H_Conf[property_name] == false) {
			MtExcept.raise("\u6307\u5B9A\u3055\u308C\u305F\u8A2D\u5B9A\u9805\u76EE\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093(" + property_name + ")");
		}

		if (strpos(property_name, "A_") === 0) {
			return this.H_Conf[property_name].split(",");
		} else {
			if (Array.isArray(this.H_Conf[property_name]) == true) {
				var H_ret = this.H_Conf[property_name];

				for (var key in H_ret) {
					var val = H_ret[key];

					if (strpos(key, "A_") === 0) {
						H_ret[key] = val.split(",");
					}
				}

				return H_ret;
			}

			return this.H_Conf[property_name];
		}
	}

	loadConfig(type) //引数チェック
	{
		if ("string" === typeof type == false) {
			MtExcept.raise("\u5F15\u6570\u306F\u6587\u5B57\u5217\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044(" + type + ")");
		}

		if (type == "") {
			MtExcept.raise("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB(ini)\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044(" + type + ")");
		}

		this.parseIni(type);
	}

	parseIni(type = "common") //iniファイル名
	//連想配列として読み込むかどうかを調べる（ファイル名がH_から始まる場合は連想配列として読み込む）
	{
		var inifile = type + ".ini";
		var process_sections = false;

		if (strpos(type, "H_") === 0) {
			process_sections = true;
		}

		if (-1 !== this.A_ConfList.indexOf(inifile) == false) //ファイルの存在チェック
			//読み込んだiniを読み込み済み一覧に追加
			//読み込んだ一覧から定数にする(大文字と_)の変数名
			//読み込んだ設定内容を追加
			{
				var fullinifile = this.existsIni(inifile);

				if (fullinifile == false) {
					MtExcept.raise("\u6307\u5B9A\u3055\u308C\u305F\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB(ini)\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093(" + inifile + ")");
				}

				var H_ini = parse_ini_file(fullinifile, process_sections);
				this.A_ConfList.push(inifile);

				for (var key in H_ini) {
					var value = H_ini[key];

					if (preg_match("/^[A-Z_]+$/", key) == true) {
						if (!(undefined !== global[key])) {
							global[key] = value;
						}
					}
				}

				this.H_Conf = array_merge(Array.from(H_ini), Array.from(this.H_Conf));
			}
	}

	existsIni(inifile) {
		var A_inc_path = get_include_path().split(PATH_SEPARATOR);

		for (var i = 0; i < A_inc_path.length; i++) //連続した"/"をとる
		//フルパスで存在チェックして存在した時点でフルパスでファイル名を返す
		{
			var fullinifile = A_inc_path[i] + "/" + inifile;
			fullinifile = fullinifile.replace(/\/\//g, "/");

			if (file_exists(fullinifile) == true) {
				return fullinifile;
			}
		}

		return false;
	}

	existsKey(property_name) {
		if (undefined !== this.H_Conf[property_name] == true) {
			return true;
		}

		return false;
	}

};