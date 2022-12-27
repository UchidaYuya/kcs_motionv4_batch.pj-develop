//暗号化クラス
//
//更新履歴：<br>
//2008/02/18 上杉勝史 作成
import MtOutput, { LvlType } from "./MtOutput";
import MtSetting from "./MtSetting";

export default class MtCryptUtil {
	static O_Instance: MtCryptUtil;
	O_MtOutput: MtOutput;
	R_Module: any;
	Key: any;
	IV: any;

	constructor() {
		var conf = MtSetting.singleton();
		this.Key = conf.get("kcsmotion_key");
		this.O_MtOutput = MtOutput.singleton();
		this.R_Module = this.openModule();
		this.IV = this.createIV();
	}

	static singleton() //インスタンスが既に生成されていない場合のみインスタンス生成
	{
		if (this.O_Instance == undefined) {
			this.O_Instance = new MtCryptUtil();
		}

		return this.O_Instance;
	}

	openModule() //モジュール生成
	{
		// var module = mcrypt_module_open(MCRYPT_TripleDES, "", MCRYPT_MODE_ECB, "");

		// if (module == false) {
		// 	this.O_MtOutput.put("MtCryptUtil::openModule: モジュール生成失敗", MtOutput.LVL_ERROR);
		// }

		// return module;
	}

	closeModule() {
		if ((!this.R_Module) == false) {
			// mcrypt_module_close(this.R_Module);
		}

		return true;
	}

	createIV() //ベクトル生成
	//return mcrypt_create_iv(mcrypt_enc_get_iv_size($this->R_Module), MCRYPT_DEV_RANDOM);
	{
		// return mcrypt_create_iv(mcrypt_enc_get_iv_size(this.R_Module), MCRYPT_DEV_URANDOM);
	}

	cryptInit(key = undefined) //負の値が返ってきたらエラー(falseもエラー)
	{
		if (key == undefined) {
			key = this.Key;
		}

		// var init = mcrypt_generic_init(this.R_Module, key, this.IV);

		// if (init < 0) {
		// 	switch (init) {
		// 		case -3:
		// 			this.O_MtOutput.put("MtCryptUtil::cryptInit: キー長が不正", MtOutput.LVL_ERROR);
		// 			break;

		// 		case -4:
		// 			this.O_MtOutput.put("MtCryptUtil::cryptInit: メモリの確保に失敗", MtOutput.LVL_ERROR);
		// 			break;

		// 		default:
		// 			this.O_MtOutput.put("MtCryptUtil::cryptInit: その他のエラー", MtOutput.LVL_ERROR);
		// 	}
		// }

		return true;
	}

	cryptEnd() {
		// var deinit = mcrypt_generic_deinit(this.R_Module);

		// if (deinit == false) {
		// 	this.O_MtOutput.put("MtCryptUtil::cryptEnd: 終了失敗", MtOutput.LVL_ERROR);
		// }

		return true;
	}

	getCrypt(str: string, key = undefined): number {
		if (key == undefined) {
			key = this.Key;
		}

		// this.cryptInit(key);
		// var crypt_str = mcrypt_generic(this.R_Module, str);
		// this.cryptEnd();
		// return bin2hex(crypt_str);
		return 0;
	}

	getDecrypt(str: string, key = undefined) {
		if (key == undefined) {
			key = this.Key;
		}

		if (str.match("/[^0-9a-fA-F]/")) {
			this.O_MtOutput.put("MtCryptUtil::getDecrypt: 引数が16進数ではない(" + str + ")", LvlType.ERROR);
		}

		this.cryptInit(key);
		// var decrypt = mdecrypt_generic(this.R_Module, pack("H*", str));
		this.cryptEnd();
		// return decrypt.trim();
	}
};