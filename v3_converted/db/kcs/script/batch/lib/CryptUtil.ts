//
// 暗号化クラス
//
//
// 作成日：2004/09/10
// 作成者：上杉勝史
//

require("script_common.php");

//
// 暗号化
//
// [引　数] : 暗号化する文字列
// [返り値] : 暗号化された文字列
//
//
// 復号化
//
// [引　数] : 暗号化された文字列
// [返り値] : 復号化された文字列
//
//
// 暗号化モジュールの生成
//
// [引　数] : なし
// [返り値] : モジュールリソース
//
//
// 暗号関数初期化ベクトルの生成
//
// [引　数] : モジュールリソース
// [返り値] : 初期化ベクトル
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
	CryptUtil() {
		this.td = this.openModule();
		this.iv = this.createIV();
	}

	getCrypt(str, key = "") {
		if (key == "") {
			key = KCSMOTION_KEY;
		}

		this.cryptInit(key);
		var crypt_str = mcrypt_generic(this.td, str);
		this.cryptEnd();
		return bin2hex(crypt_str);
	}

	getDecrypt(str, key = "") {
		if (key == "") {
			key = KCSMOTION_KEY;
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
			print("\u6697\u53F7\u521D\u671F\u5316\u30D9\u30AF\u30C8\u30EB\u751F\u6210\u30A8\u30E9\u30FC\n");
			throw die();
		}

		return mcrypt_create_iv(mcrypt_enc_get_iv_size(this.td), MCRYPT_DEV_RANDOM);
	}

	cryptInit(key) {
		if (this.td == "" || key == "" || this.iv == "") {
			print("\u6697\u53F7\u5316\u30E2\u30B8\u30E5\u30FC\u30EB\u521D\u671F\u5316\u30A8\u30E9\u30FC\n");
			throw die();
		}

		return mcrypt_generic_init(this.td, key, this.iv);
	}

	cryptEnd() {
		return mcrypt_generic_deinit(this.td);
	}

};