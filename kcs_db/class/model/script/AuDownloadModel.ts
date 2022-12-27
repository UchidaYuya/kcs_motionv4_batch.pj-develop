//au brossデータ ダウンロード （Model）


import MtScriptAmbient from '../../MtScriptAmbient';
import ModelBase from '../ModelBase';


export default class AuDownloadModel extends ModelBase {
	O_msa: MtScriptAmbient;
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}
};
