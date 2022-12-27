//
//暗号化クラス
//
//@filesource
//@package Base
//@subpackage CryptUtil
//@since 2004/09/10
//@author 上杉勝史
//
//
//
//暗号化クラス
//
//@filesource
//@package Base
//@subpackage CryptUtil
//@since 2004/09/10
//@author 上杉勝史
//
//

require("common.php");

require("ErrorUtil.php");

//
//tb
//
//@var mixed
//@access public
//
//
//iv
//
//@var mixed
//@access public
//
//
//コンストラクタ
//
//@access public
//@return void
//
//
//暗号化
//
//@param str $str 暗号化する文字列
//@param str $key 暗号種
//@return str 暗号化された文字列
//
//
//復号化
//
//@param str $str 暗号化された文字列
//@param str $key 暗号種
//@return str 復号化された文字列
//
//
//暗号化モジュールの生成
//
//[引　数] : なし
//[返り値] : モジュールリソース
//
//
//暗号関数初期化ベクトルの生成
//
//@return 初期化ベクトル
//
//
// 暗号化モジュールの初期化
//
// [引　数] : モジュールリソース
//			 暗号化キー
//			 初期化ベクトル
// [返り値] : なし
//
//
// 暗号化モジュールの終了
//
// [引　数] : モジュールリソース
// [返り値] : なし
//
class CryptUtil {
	CryptUtil() //ErrorUtilオブジェクト
	{
		this.td = this.openModule();
		this.iv = this.createIV();

		if (GLOBALS.GO_errlog == false) {
			GLOBALS.GO_errlog = new ErrorUtil();
		}
	}

	getCrypt(str, key = "") {
		if (key == "") {
			key = GLOBALS.kcsmotion_key;
		}

		this.cryptInit(key);
		var crypt_str = mcrypt_generic(this.td, str);
		this.cryptEnd();
		return bin2hex(crypt_str);
	}

	getDecrypt(str, key = "") {
		if (key == "") {
			key = GLOBALS.kcsmotion_key;
		}

		this.cryptInit(key);
		var decrypt = mdecrypt_generic(this.td, pack("H*", str));
		this.cryptEnd();
		return rtrim(decrypt);
	}

	openModule() {
		return mcrypt_module_open(MCRYPT_TripleDES, "", MCRYPT_MODE_ECB, "");
	}

	createIV() {
		if (this.td == "") {
			GLOBALS.GO_errlog.errorOut(4, "\u6697\u53F7\u521D\u671F\u5316\u30D9\u30AF\u30C8\u30EB\u751F\u6210\u30A8\u30E9\u30FC");
		}

		return mcrypt_create_iv(mcrypt_enc_get_iv_size(this.td), MCRYPT_DEV_URANDOM);
	}

	cryptInit(key) {
		if (this.td == "" || key == "" || this.iv == "") {
			GLOBALS.GO_errlog.errorOut(4, "\u6697\u53F7\u5316\u30E2\u30B8\u30E5\u30FC\u30EB\u521D\u671F\u5316\u30A8\u30E9\u30FC");
		}

		return mcrypt_generic_init(this.td, key, this.iv);
	}

	cryptEnd() {
		return mcrypt_generic_end(this.td);
	}

};