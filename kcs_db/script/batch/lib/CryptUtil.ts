// 暗号化クラス
// 作成日：2004/09/10
// 作成者：上杉勝史
// import { pad, TripleDES } from "crypto-js";
import { enc, pad, mode, TripleDES } from "crypto-js";
import {KCSMOTION_KEY} from "./script_common";

export default class CryptUtil {
	td: any;
	iv: any;
	constructor() {
		this.td = this.openModule();
		this.iv = this.createIV();
	}

	getCrypt(str: any, key = "") {
		if (key == "") {
			key = KCSMOTION_KEY;
		}

		this.cryptInit(key);
		// var crypt_str = encrypt(this.td, str); 
		const tripleDesIv = enc.Utf8.parse("");
		const encrypt = TripleDES.encrypt( str, key, {
			iv: tripleDesIv,
			mode: mode.ECB,
			padding: pad.NoPadding
		}
		).toString();
		this.cryptEnd();
		return encrypt;
		// return bin2hex(crypt_str);
	}

	getDecrypt(str: any, key = "") {
		if (key == "") {
			key = KCSMOTION_KEY;
		}

		this.cryptInit(key);
	// var decrypt = decrypt(this.td, pack("H*", str));
	const tripleDesIv = str.Utf8.parse("H*");
		const decrypt = TripleDES.decrypt( str, key, {
				iv: tripleDesIv,
				mode: mode.ECB,
				padding: pad.NoPadding
			}).toString(enc.Utf8).trim();
		this.cryptEnd();
		return decrypt;
		// return decrypt.replace();
		// return rtrim(decrypt);
	}

	openModule() {
		// return mcrypt_module_open(MCRYPT_TripleDES, "", MCRYPT_MODE_ECB, "");
	}

	createIV() {
		if (this.td == "") {
			console.log("暗号初期化ベクトル生成エラー\n");
			throw process.exit();
		}

		// return mcrypt_create_iv(mcrypt_enc_get_iv_size(this.td), MCRYPT_DEV_RANDOM);
	}

	cryptInit(key: string) {
		if (this.td == "" || key == "" || this.iv == "") {
			console.log("暗号化モジュール初期化エラー\n");
			throw process.exit();
		}

		// return mcrypt_generic_init(this.td, key, this.iv);
	}

	cryptEnd() {
		// return mcrypt_generic_deinit(this.td);
	}

};
