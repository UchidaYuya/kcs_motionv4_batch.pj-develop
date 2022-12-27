import { PATH_SEPARATOR } from '../db_define/define';
import MtExcept from './MtDateUtil';

export default class MtSetting {
	static O_Instance : MtSetting | undefined;
	H_Conf: any;
	A_ConfList: any;

	//個別のiniファイルから参照される値
	SUM_KUBUN?: string;
	BILL_KUBUN?: string;
	TUWA_KUBUN?: string;
	KCCS_NTTEAST_CARID?: string;
	KCCS_NTTWEST_CARID?: string;
	KCCS_CARID?: string;
	CODENAME_TAX?: string;
	UTIWAKE_TAX_CODE?: string;
	CODENAME_CHARGE?: string;
	PARK24_DIR?: string;
	PARK24_CARDCOID?: string;
	LOGINID_HEADER?: string;
	SOFTBANK_DIR?: string;
	SOFTBANK_CARID?: string;
	SOFTBANK_CIRID?: string;
	KCCS?: string;
	A_CSRID_LIST: any[] = Array();
	A_CARID_LIST: any[] = Array();
	A_TAX_KUBUN: any[] = Array();
	KCCS_ARID?: string;
	KCCS_NTTEAST_ARID?: string;
	KCCS_NTTEAST_CIRID?: string;
	KCCS_NTTWEST_ARID?: string;
	KCCS_NTTWEST_CIRID?: string;
	UTIWAKE_ASX_CODE?: string;
	DATA_DIR?: string;
	XEROX_COPY_COID?: string;
	COPY_XEROX_DIR?: string;
	WILLCOM_CARID?: string;
	WILLCOM?: string;
	EMOBILE?: string;
	EMOBILE_DIR?: string;
	DELIMITER?: string;
	SOFTBANK?: string;
	UTIWAKE_ASP_CODE?: string;
	CANON_COPY_COID?: string;
	WILLCOM_CIRID?: string;
	WILLCOM_DIR?: string;
	KCCS_CIRID?: string;
	
	constructor() {
		this.H_Conf = Array();
		this.A_ConfList = Array();

	}

	static singleton() //インスタンスが既に生成されていない場合のみインスタンス生成
	{
		if (this.O_Instance == undefined) {
			this.O_Instance = new MtSetting();
			this.O_Instance.parseIni();
		}

		return this.O_Instance;
	}

	getConf() {
		return this.H_Conf;
	}

	get(property_name:string) {
		if (undefined !== this.H_Conf[property_name] == false) {
			MtExcept.raise("指定された設定項目が見つかりません(" + property_name + ")");
		}

		return this.H_Conf[property_name];
	}

	getArray(property_name:string) : any[]{
		if (undefined !== this.H_Conf[property_name] == false) {
			MtExcept.raise("指定された設定項目が見つかりません(" + property_name + ")");
		}

		return this.H_Conf[property_name].split(',');
	}

	loadConfig(type: string) //引数チェック
	{
		this.parseIni(type);
	}

	parseIni(type = "common") //iniファイル名
	//連想配列として読み込むかどうかを調べる（ファイル名がH_から始まる場合は連想配列として読み込む）
	{
		var inifile = type + ".ini";
		var process_sections = false;

		if (type.indexOf("H_") === 0) {
			process_sections = true;
		}

		if (-1 !== this.A_ConfList.indexOf(inifile) == false) //ファイルの存在チェック
			//読み込んだiniを読み込み済み一覧に追加
			//読み込んだ一覧から定数にする(大文字と_)の変数名
			//読み込んだ設定内容を追加
		{

			const path = require('path')
			const fixture = path.join("./conf", inifile)

			const loadIniFile = require('read-ini-file');
			const H_ini = loadIniFile.sync(fixture);

			this.A_ConfList.push(inifile);

			Object.keys(H_ini).forEach(key => {
				if(typeof H_ini[key] == 'object'){
					Object.keys(H_ini[key]).forEach(key1 => {
						if(typeof H_ini[key][key1] != 'object'){
							this.H_Conf[key1] = H_ini[key][key1];
						}
					});
				} else {
					this.H_Conf[key] = H_ini[key];
				}
			});
		}
	}

	existsKey(property_name: string | number) {
		if (undefined !== this.H_Conf[property_name] == true) {
			return true;
		}

		return false;
	}

};