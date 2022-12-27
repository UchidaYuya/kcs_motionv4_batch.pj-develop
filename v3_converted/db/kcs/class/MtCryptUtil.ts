//
//暗号化クラス
//
//更新履歴：<br>
//2008/02/18 上杉勝史 作成
//
//@package Base
//@subpackage Crypt
//@author katsushi
//@filesource
//@since 2008/02/18
//
//
//
//暗号化クラスライブラリ(Mcrypt使用)<br>
//
//@package Base
//@subpackage Crypt
//@author katsushi
//@uses MtSetting
//@uses MtOutput
//@since 2008/02/18
//
//使用例<br>
//文字列の暗号化
//<code>
//require_once("MtCryptUtil.php");
//$O_crypt =& MtCryptUtil::singleton();
//echo $O_crypt->getCrypt("暗号化文字列");
//</code>
//

require("MtSetting.php");

require("MtOutput.php");

//
//インスタンス生成確認用
//
//@var object
//@access private
//@static
//
//
//暗号化モジュールリソース
//
//@var resource
//@access private
//
//
//暗号化ベクトル
//
//@var string
//@access private
//
//
//暗号化キー
//
//@var string
//@access private
//
//
//MtOutputオブジェクト
//
//@var object
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
//@since 2008/02/18
//
//@static
//@access public
//@return self::$O_Instance
//
//
//暗号化モジュールの生成
//
//@author katsushi
//@since 2008/02/18
//
//@access private
//@return resource
//
//
//暗号化モジュールを閉じる
//
//@author katsushi
//@since 2008/02/20
//
//@access private
//@return boolean
//
//
//暗号関数初期化ベクトルの生成
//
//@author katsushi
//@since 2008/02/18
//
//@access private
//@return string
//
//
//暗号化モジュールの初期化
//
//@author katsushi
//@since 2008/02/18
//
//@param string $key
//@access private
//@return boolean
//
//
//暗号化モジュールのバッファクリア
//
//@author katsushi
//@since 2008/02/20
//
//@access private
//@return boolean
//
//
//暗号化処理
//
//@author katsushi
//@since 2008/02/20
//
//@param string $str
//@param string $key
//@access public
//@return string
//
//
//復号化処理
//
//@author katsushi
//@since 2008/02/20
//
//@param string $str
//@param string $key
//@access public
//@return string
//
//
//デストラクタ
//
//@author katsushi
//@since 2008/02/20
//
//@access public
//@return void
//
class MtCryptUtil {
	static O_Instance = undefined;

	constructor() {
		var conf = MtSetting.singleton();
		this.Key = conf.kcsmotion_key;
		this.O_MtOutput = MtOutput.singleton();
		this.R_Module = this.openModule();
		this.IV = this.createIV();
	}

	static singleton() //インスタンスが既に生成されていない場合のみインスタンス生成
	{
		if (MtCryptUtil.O_Instance == undefined) {
			MtCryptUtil.O_Instance = new MtCryptUtil();
		}

		return MtCryptUtil.O_Instance;
	}

	openModule() //モジュール生成
	{
		var module = mcrypt_module_open(MCRYPT_TripleDES, "", MCRYPT_MODE_ECB, "");

		if (module == false) {
			this.O_MtOutput.put("MtCryptUtil::openModule: \u30E2\u30B8\u30E5\u30FC\u30EB\u751F\u6210\u5931\u6557", MtOutput.LVL_ERROR);
		}

		return module;
	}

	closeModule() {
		if (is_null(this.R_Module) == false) {
			mcrypt_module_close(this.R_Module);
		}

		return true;
	}

	createIV() //ベクトル生成
	//return mcrypt_create_iv(mcrypt_enc_get_iv_size($this->R_Module), MCRYPT_DEV_RANDOM);
	{
		return mcrypt_create_iv(mcrypt_enc_get_iv_size(this.R_Module), MCRYPT_DEV_URANDOM);
	}

	cryptInit(key = undefined) //負の値が返ってきたらエラー(falseもエラー)
	{
		if (key == undefined) {
			key = this.Key;
		}

		var init = mcrypt_generic_init(this.R_Module, key, this.IV);

		if (init < 0) {
			switch (init) {
				case -3:
					this.O_MtOutput.put("MtCryptUtil::cryptInit: \u30AD\u30FC\u9577\u304C\u4E0D\u6B63", MtOutput.LVL_ERROR);
					break;

				case -4:
					this.O_MtOutput.put("MtCryptUtil::cryptInit: \u30E1\u30E2\u30EA\u306E\u78BA\u4FDD\u306B\u5931\u6557", MtOutput.LVL_ERROR);
					break;

				default:
					this.O_MtOutput.put("MtCryptUtil::cryptInit: \u305D\u306E\u4ED6\u306E\u30A8\u30E9\u30FC", MtOutput.LVL_ERROR);
			}
		}

		return true;
	}

	cryptEnd() {
		var deinit = mcrypt_generic_deinit(this.R_Module);

		if (deinit == false) {
			this.O_MtOutput.put("MtCryptUtil::cryptEnd: \u7D42\u4E86\u5931\u6557", MtOutput.LVL_ERROR);
		}

		return true;
	}

	getCrypt(str, key = undefined) {
		if (key == undefined) {
			key = this.Key;
		}

		this.cryptInit(key);
		var crypt_str = mcrypt_generic(this.R_Module, str);
		this.cryptEnd();
		return bin2hex(crypt_str);
	}

	getDecrypt(str, key = undefined) {
		if (key == undefined) {
			key = this.Key;
		}

		if (preg_match("/[^0-9a-fA-F]/", str) == true) {
			this.O_MtOutput.put("MtCryptUtil::getDecrypt: \u5F15\u6570\u304C16\u9032\u6570\u3067\u306F\u306A\u3044(" + str + ")", MtOutput.LVL_ERROR);
		}

		this.cryptInit(key);
		var decrypt = mdecrypt_generic(this.R_Module, pack("H*", str));
		this.cryptEnd();
		return decrypt.trim();
	}

	__destruct() {
		this.closeModule();
	}

};