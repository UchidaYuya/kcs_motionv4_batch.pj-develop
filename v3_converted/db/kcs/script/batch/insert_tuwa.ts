//===========================================================================
//機能：tuwa_charge.phpを作る(ドコモ専用)
//
//作成：森原
//===========================================================================
//
//MOVA 1,2,3,4,5,6,7 := (平日昼間,夜間,休日昼間,夜間,土曜,深夜,その他)
//PHS 9,10,11,12,13 := (平日,夜間,休日,夜間,その他)
//FOMA 13,14 := (標準,お得)
//recid := G_RECID_DOCOMO_OTHER,OWN,AWAY,OWN_PHS,AWAY_PHS,FIX
//area := 1,2,3,4,5,6,7,8,9,29
//:= (北海道,東北,北陸,中央,東海,関西,中国,四国,九州,未確定)
//planid,carid
//tmid,recid,mintime,maxtime,sec,yen,
//通話料マスター
//plan_tbからMOVA,CITY,FOMAでinvflgがtrueのもののうち、
//処理しようとしているプラン名に合致しないものを抜き出す
//→そのようなプランがあれば警告を出して終了
//現行のtuwa_charge_tbをファイルに落として削除
//一個づつ追加
//$db->commit();
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_common.php");

var A_param = [{
	common: {
		cirid: G_CIRCUIT_FOMA,
		mintime: 0,
		maxtime: 3600 * 24
	},
	key: [{
		planname: ["\uFF26\uFF2F\uFF2D\uFF21\u30D7\u30E9\u30F3\uFF13\uFF19"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		common: {
			sec: 30
		}
	}],
	value: [[[G_RECID_DOCOMO_FIX], {
		tmid: [1, 2],
		yen: 15.5
	}, {
		tmid: [3, 4, 5, 6],
		yen: 10.5
	}], [[G_RECID_DOCOMO_OWN], {
		tmid: [1, 2],
		yen: 17
	}, {
		tmid: [3, 4, 5, 6],
		yen: 12
	}], [[G_RECID_DOCOMO_AWAY], {
		tmid: [1, 2],
		yen: 18.5
	}, {
		tmid: [3, 4, 5, 6],
		yen: 13
	}], [[G_RECID_DOCOMO_OWN_PHS, G_RECID_DOCOMO_AWAY_PHS], {
		tmid: [1, 2],
		yen: 22
	}, {
		tmid: [3, 4, 5, 6],
		yen: 15.5
	}]]
}, {
	common: {
		cirid: G_CIRCUIT_FOMA,
		mintime: 0,
		maxtime: 3600 * 24
	},
	key: [{
		planname: ["\uFF26\uFF2F\uFF2D\uFF21\u30D7\u30E9\u30F3\uFF14\uFF19"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		common: {
			sec: 30
		}
	}],
	value: [[[G_RECID_DOCOMO_FIX], {
		tmid: [1, 2],
		yen: 14
	}, {
		tmid: [3, 4, 5, 6],
		yen: 10
	}], [[G_RECID_DOCOMO_OWN], {
		tmid: [1, 2],
		yen: 15.5
	}, {
		tmid: [3, 4, 5, 6],
		yen: 11
	}], [[G_RECID_DOCOMO_AWAY], {
		tmid: [1, 2],
		yen: 17.5
	}, {
		tmid: [3, 4, 5, 6],
		yen: 12
	}], [[G_RECID_DOCOMO_OWN_PHS, G_RECID_DOCOMO_AWAY_PHS], {
		tmid: [1, 2],
		yen: 20.5
	}, {
		tmid: [3, 4, 5, 6],
		yen: 14.5
	}]]
}, {
	common: {
		cirid: G_CIRCUIT_FOMA,
		mintime: 0,
		maxtime: 3600 * 24
	},
	key: [{
		planname: ["\uFF26\uFF2F\uFF2D\uFF21\u30D7\u30E9\u30F3\uFF16\uFF17"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		common: {
			sec: 30
		}
	}],
	value: [[[G_RECID_DOCOMO_FIX], {
		tmid: [1, 2],
		yen: 13
	}, {
		tmid: [3, 4, 5, 6],
		yen: 9
	}], [[G_RECID_DOCOMO_OWN], {
		tmid: [1, 2],
		yen: 14.5
	}, {
		tmid: [3, 4, 5, 6],
		yen: 10
	}], [[G_RECID_DOCOMO_AWAY], {
		tmid: [1, 2],
		yen: 16
	}, {
		tmid: [3, 4, 5, 6],
		yen: 11
	}], [[G_RECID_DOCOMO_OWN_PHS, G_RECID_DOCOMO_AWAY_PHS], {
		tmid: [1, 2],
		yen: 19
	}, {
		tmid: [3, 4, 5, 6],
		yen: 13
	}]]
}, {
	common: {
		cirid: G_CIRCUIT_FOMA,
		mintime: 0,
		maxtime: 3600 * 24
	},
	key: [{
		planname: ["\uFF26\uFF2F\uFF2D\uFF21\u30D7\u30E9\u30F3\uFF11\uFF10\uFF10"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		common: {
			sec: 30
		}
	}],
	value: [[[G_RECID_DOCOMO_FIX], {
		tmid: [1, 2],
		yen: 12
	}, {
		tmid: [3, 4, 5, 6],
		yen: 8.5
	}], [[G_RECID_DOCOMO_OWN], {
		tmid: [1, 2],
		yen: 13.5
	}, {
		tmid: [3, 4, 5, 6],
		yen: 9.5
	}], [[G_RECID_DOCOMO_AWAY], {
		tmid: [1, 2],
		yen: 14.5
	}, {
		tmid: [3, 4, 5, 6],
		yen: 10
	}], [[G_RECID_DOCOMO_OWN_PHS, G_RECID_DOCOMO_AWAY_PHS], {
		tmid: [1, 2],
		yen: 17.5
	}, {
		tmid: [3, 4, 5, 6],
		yen: 12
	}]]
}, {
	common: {
		cirid: G_CIRCUIT_FOMA,
		mintime: 0,
		maxtime: 3600 * 24
	},
	key: [{
		planname: ["\uFF26\uFF2F\uFF2D\uFF21\u30D7\u30E9\u30F3\uFF11\uFF15\uFF10"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		common: {
			sec: 30
		}
	}],
	value: [[[G_RECID_DOCOMO_FIX], {
		tmid: [1, 2],
		yen: 11
	}, {
		tmid: [3, 4, 5, 6],
		yen: 7.5
	}], [[G_RECID_DOCOMO_OWN], {
		tmid: [1, 2],
		yen: 12
	}, {
		tmid: [3, 4, 5, 6],
		yen: 8.5
	}], [[G_RECID_DOCOMO_AWAY], {
		tmid: [1, 2],
		yen: 13.5
	}, {
		tmid: [3, 4, 5, 6],
		yen: 9.5
	}], [[G_RECID_DOCOMO_OWN_PHS, G_RECID_DOCOMO_AWAY_PHS], {
		tmid: [1, 2],
		yen: 15.5
	}, {
		tmid: [3, 4, 5, 6],
		yen: 11
	}]]
}, {
	common: {
		cirid: G_CIRCUIT_FOMA,
		mintime: 0,
		maxtime: 3600 * 24
	},
	key: [{
		planname: ["\u30D3\u30B8\u30CD\u30B9\u30D7\u30E9\u30F3"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		common: {
			sec: 60
		}
	}],
	value: [[[G_RECID_DOCOMO_FIX], {
		tmid: [1, 2],
		yen: 15
	}, {
		tmid: [3, 4, 5, 6],
		yen: 30
	}], [[G_RECID_DOCOMO_OWN], {
		tmid: [1, 2],
		yen: 10
	}, {
		tmid: [3, 4, 5, 6],
		yen: 30
	}], [[G_RECID_DOCOMO_AWAY], {
		tmid: [1, 2],
		yen: 15
	}, {
		tmid: [3, 4, 5, 6],
		yen: 30
	}], [[G_RECID_DOCOMO_OWN_PHS, G_RECID_DOCOMO_AWAY_PHS], {
		tmid: [1, 2],
		yen: 20
	}, {
		tmid: [3, 4, 5, 6],
		yen: 21
	}]]
}, {
	common: {
		cirid: G_CIRCUIT_CITY,
		mintime: 0,
		maxtime: 3600 * 24
	},
	key: [{
		planname: ["\u30D7\u30E9\u30F3\uFF21"],
		arid: [4],
		common: {
			yen: 10
		}
	}, {
		planname: ["\u30D7\u30E9\u30F3\uFF24"],
		arid: [4],
		common: {
			yen: 10
		}
	}, {
		planname: ["\u304A\u306F\u306A\u3057\u30D7\u30E9\u30B9\uFF33"],
		arid: [4],
		common: {
			yen: 10
		}
	}],
	value: [[[G_RECID_DOCOMO_FIX], {
		tmid: [1],
		sec: 26
	}, {
		tmid: [2],
		sec: 43.5
	}, {
		tmid: [3, 4, 5],
		sec: 47.5
	}, {
		tmid: [6],
		sec: 65
	}], [[G_RECID_DOCOMO_OWN], {
		tmid: [1],
		sec: 25
	}, {
		tmid: [2],
		sec: 41.5
	}, {
		tmid: [3, 4, 5],
		sec: 45.5
	}, {
		tmid: [6],
		sec: 62.5
	}], [[G_RECID_DOCOMO_AWAY], {
		tmid: [1],
		sec: 20
	}, {
		tmid: [2],
		sec: 37
	}, {
		tmid: [3, 4, 5],
		sec: 37
	}, {
		tmid: [6],
		sec: 51.5
	}], [[G_RECID_DOCOMO_OWN_PHS, G_RECID_DOCOMO_AWAY_PHS], {
		tmid: [1],
		sec: 20
	}, {
		tmid: [2],
		sec: 21
	}, {
		tmid: [3, 4, 5],
		sec: 21
	}, {
		tmid: [6],
		sec: 21
	}]]
}, {
	common: {
		cirid: G_CIRCUIT_CITY,
		mintime: 0,
		maxtime: 3600 * 24
	},
	key: [{
		planname: ["\u30D7\u30E9\u30F3\uFF23"],
		arid: [4],
		common: Array()
	}],
	value: [[[G_RECID_DOCOMO_FIX], {
		tmid: [1],
		sec: 26,
		yen: 15
	}, {
		tmid: [2],
		sec: 43.5,
		yen: 15
	}, {
		tmid: [3, 4, 5],
		sec: 47.5,
		yen: 15
	}, {
		tmid: [6],
		sec: 65,
		yen: 15
	}], [[G_RECID_DOCOMO_OWN], {
		tmid: [1],
		sec: 25,
		yen: 10
	}, {
		tmid: [2],
		sec: 41.5,
		yen: 10
	}, {
		tmid: [3, 4, 5],
		sec: 45.5,
		yen: 10
	}, {
		tmid: [6],
		sec: 62.5,
		yen: 10
	}], [[G_RECID_DOCOMO_AWAY], {
		tmid: [1],
		sec: 20,
		yen: 10
	}, {
		tmid: [2],
		sec: 37,
		yen: 10
	}, {
		tmid: [3, 4, 5],
		sec: 37,
		yen: 10
	}, {
		tmid: [6],
		sec: 51.5,
		yen: 10
	}], [[G_RECID_DOCOMO_OWN_PHS, G_RECID_DOCOMO_AWAY_PHS], {
		tmid: [1],
		sec: 20,
		yen: 10
	}, {
		tmid: [2],
		sec: 21,
		yen: 10
	}, {
		tmid: [3, 4, 5],
		sec: 21,
		yen: 10
	}, {
		tmid: [6],
		sec: 21,
		yen: 10
	}]]
}, {
	common: {
		cirid: G_CIRCUIT_CITY
	},
	key: [{
		planname: ["\u9577\u5F97\u30D7\u30E9\u30F3"],
		arid: [4],
		common: {
			sec: 60
		}
	}],
	value: [[[G_RECID_DOCOMO_FIX], {
		tmid: [1],
		mintime: 0,
		maxtime: 60,
		yen: 26.25
	}, {
		tmid: [1],
		mintime: 60,
		maxtime: 120,
		yen: 21
	}, {
		tmid: [1],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 15.75
	}, {
		tmid: [2],
		mintime: 0,
		maxtime: 60,
		yen: 15.75
	}, {
		tmid: [2],
		mintime: 60,
		maxtime: 120,
		yen: 10.5
	}, {
		tmid: [2],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 10.5
	}, {
		tmid: [3, 4, 5],
		mintime: 0,
		maxtime: 60,
		yen: 15.75
	}, {
		tmid: [3, 4, 5],
		mintime: 60,
		maxtime: 120,
		yen: 10.5
	}, {
		tmid: [3, 4, 5],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 10.5
	}, {
		tmid: [6],
		mintime: 0,
		maxtime: 60,
		yen: 10.5
	}, {
		tmid: [6],
		mintime: 60,
		maxtime: 120,
		yen: 9.45
	}, {
		tmid: [6],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 7.35
	}], [[G_RECID_DOCOMO_OWN], {
		tmid: [1],
		mintime: 0,
		maxtime: 60,
		yen: 31.5
	}, {
		tmid: [1],
		mintime: 60,
		maxtime: 120,
		yen: 21
	}, {
		tmid: [1],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 15.75
	}, {
		tmid: [2],
		mintime: 0,
		maxtime: 60,
		yen: 21
	}, {
		tmid: [2],
		mintime: 60,
		maxtime: 120,
		yen: 10.5
	}, {
		tmid: [2],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 10.5
	}, {
		tmid: [3, 4, 5],
		mintime: 0,
		maxtime: 60,
		yen: 15.75
	}, {
		tmid: [3, 4, 5],
		mintime: 60,
		maxtime: 120,
		yen: 10.5
	}, {
		tmid: [3, 4, 5],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 10.5
	}, {
		tmid: [6],
		mintime: 0,
		maxtime: 60,
		yen: 10.5
	}, {
		tmid: [6],
		mintime: 60,
		maxtime: 120,
		yen: 9.45
	}, {
		tmid: [6],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 7.35
	}], [[G_RECID_DOCOMO_AWAY], {
		tmid: [1],
		mintime: 0,
		maxtime: 60,
		yen: 31.5
	}, {
		tmid: [1],
		mintime: 60,
		maxtime: 120,
		yen: 21
	}, {
		tmid: [1],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 21
	}, {
		tmid: [2],
		mintime: 0,
		maxtime: 60,
		yen: 21
	}, {
		tmid: [2],
		mintime: 60,
		maxtime: 120,
		yen: 10.5
	}, {
		tmid: [2],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 10.5
	}, {
		tmid: [3, 4, 5],
		mintime: 0,
		maxtime: 60,
		yen: 15.75
	}, {
		tmid: [3, 4, 5],
		mintime: 60,
		maxtime: 120,
		yen: 10.5
	}, {
		tmid: [3, 4, 5],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 10.5
	}, {
		tmid: [6],
		mintime: 0,
		maxtime: 60,
		yen: 10.5
	}, {
		tmid: [6],
		mintime: 60,
		maxtime: 120,
		yen: 10.5
	}, {
		tmid: [6],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 10.5
	}], [[G_RECID_DOCOMO_OWN_PHS, G_RECID_DOCOMO_AWAY_PHS], {
		tmid: [1],
		mintime: 0,
		maxtime: 60,
		yen: 30.45
	}, {
		tmid: [1],
		mintime: 60,
		maxtime: 120,
		yen: 28.35
	}, {
		tmid: [1],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 25.2
	}, {
		tmid: [2],
		mintime: 0,
		maxtime: 60,
		yen: 30.45
	}, {
		tmid: [2],
		mintime: 60,
		maxtime: 120,
		yen: 26.25
	}, {
		tmid: [2],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 24.15
	}, {
		tmid: [3, 4, 5],
		mintime: 0,
		maxtime: 60,
		yen: 30.45
	}, {
		tmid: [3, 4, 5],
		mintime: 60,
		maxtime: 120,
		yen: 26.25
	}, {
		tmid: [3, 4, 5],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 24.15
	}, {
		tmid: [6],
		mintime: 0,
		maxtime: 60,
		yen: 30.45
	}, {
		tmid: [6],
		mintime: 60,
		maxtime: 120,
		yen: 26.25
	}, {
		tmid: [6],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 24.15
	}]]
}, {
	common: {
		cirid: G_CIRCUIT_MOVA,
		mintime: 0,
		maxtime: 3600 * 24
	},
	key: [{
		planname: ["\u30D7\u30E9\u30F3\uFF21"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8],
		common: {
			yen: 10
		}
	}, {
		planname: ["\u30D9\u30FC\u30B7\u30C3\u30AF\u30D7\u30E9\u30F3"],
		arid: [9],
		common: {
			yen: 10
		}
	}, {
		planname: ["\u304A\u306F\u306A\u3057\u30D7\u30E9\u30B9\uFF2C", "\u304A\u306F\u306A\u3057\u30D7\u30E9\u30B9 \uFF2C"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		common: {
			yen: 12
		}
	}, {
		planname: ["\u30D7\u30E9\u30F3\uFF22"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8],
		common: {
			yen: 14
		}
	}, {
		planname: ["\u30D1\u30FC\u30BD\u30CA\u30EB\u30D7\u30E9\u30F3"],
		arid: [9],
		common: {
			yen: 14
		}
	}, {
		planname: ["\u304A\u306F\u306A\u3057\u30D7\u30E9\u30B9\uFF22\uFF29\uFF27", "\u304A\u306F\u306A\u3057\u30D7\u30E9\u30B9 \uFF22\uFF29\uFF27"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		common: {
			yen: 11
		}
	}, {
		planname: ["\u304A\u306F\u306A\u3057\u30D7\u30E9\u30B9\uFF2D", "\u304A\u306F\u306A\u3057\u30D7\u30E9\u30B9 \uFF2D"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		common: {
			yen: 13
		}
	}],
	value: [[[G_RECID_DOCOMO_FIX], {
		tmid: [1],
		sec: 26
	}, {
		tmid: [2],
		sec: 30.5
	}, {
		tmid: [3, 4, 5],
		sec: 34.5
	}, {
		tmid: [6],
		sec: 47.5
	}], [[G_RECID_DOCOMO_OWN], {
		tmid: [1],
		sec: 18
	}, {
		tmid: [2],
		sec: 26.5
	}, {
		tmid: [3, 4, 5],
		sec: 30
	}, {
		tmid: [6],
		sec: 41.5
	}], [[G_RECID_DOCOMO_AWAY], {
		tmid: [1],
		sec: 16
	}, {
		tmid: [2],
		sec: 23.5
	}, {
		tmid: [3, 4, 5],
		sec: 26.5
	}, {
		tmid: [6],
		sec: 36.5
	}], [[G_RECID_DOCOMO_OWN_PHS, G_RECID_DOCOMO_AWAY_PHS], {
		tmid: [1],
		sec: 20
	}, {
		tmid: [2],
		sec: 21
	}, {
		tmid: [3, 4, 5],
		sec: 21
	}, {
		tmid: [6],
		sec: 21
	}]]
}, {
	common: {
		cirid: G_CIRCUIT_MOVA,
		mintime: 0,
		maxtime: 3600 * 24
	},
	key: [{
		planname: ["\u30D3\u30B8\u30CD\u30B9\u30D7\u30E9\u30F3"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		common: {
			sec: 60
		}
	}],
	value: [[[G_RECID_DOCOMO_FIX, G_RECID_DOCOMO_AWAY], {
		tmid: [1],
		yen: 15
	}, {
		tmid: [2, 3, 4, 5, 6],
		yen: 30
	}], [[G_RECID_DOCOMO_OWN], {
		tmid: [1],
		yen: 10
	}, {
		tmid: [2, 3, 4, 5, 6],
		yen: 30
	}], [[G_RECID_DOCOMO_OWN_PHS, G_RECID_DOCOMO_AWAY_PHS], {
		tmid: [1],
		yen: 20
	}, {
		tmid: [2, 3, 4, 5, 6],
		yen: 21
	}]]
}, {
	common: {
		cirid: G_CIRCUIT_MOVA
	},
	key: [{
		planname: ["\u9577\u5F97\u30D7\u30E9\u30F3"],
		arid: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		common: {
			sec: 60
		}
	}],
	value: [[[G_RECID_DOCOMO_FIX], {
		tmid: [1],
		mintime: 0,
		maxtime: 60,
		yen: 26.25
	}, {
		tmid: [1],
		mintime: 60,
		maxtime: 120,
		yen: 21
	}, {
		tmid: [1],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 15.75
	}, {
		tmid: [2],
		mintime: 0,
		maxtime: 60,
		yen: 23.1
	}, {
		tmid: [2],
		mintime: 60,
		maxtime: 120,
		yen: 19.95
	}, {
		tmid: [2],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 14.7
	}, {
		tmid: [3, 4, 5],
		mintime: 0,
		maxtime: 60,
		yen: 21
	}, {
		tmid: [3, 4, 5],
		mintime: 60,
		maxtime: 120,
		yen: 17.85
	}, {
		tmid: [3, 4, 5],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 12.6
	}, {
		tmid: [6],
		mintime: 0,
		maxtime: 60,
		yen: 14.7
	}, {
		tmid: [6],
		mintime: 60,
		maxtime: 120,
		yen: 12.6
	}, {
		tmid: [6],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 9.45
	}], [[G_RECID_DOCOMO_OWN], {
		tmid: [1],
		mintime: 0,
		maxtime: 60,
		yen: 36.75
	}, {
		tmid: [1],
		mintime: 60,
		maxtime: 120,
		yen: 31.5
	}, {
		tmid: [1],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 22.05
	}, {
		tmid: [2],
		mintime: 0,
		maxtime: 60,
		yen: 26.25
	}, {
		tmid: [2],
		mintime: 60,
		maxtime: 120,
		yen: 21
	}, {
		tmid: [2],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 16.8
	}, {
		tmid: [3, 4, 5],
		mintime: 0,
		maxtime: 60,
		yen: 21
	}, {
		tmid: [3, 4, 5],
		mintime: 60,
		maxtime: 120,
		yen: 21
	}, {
		tmid: [3, 4, 5],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 14.7
	}, {
		tmid: [6],
		mintime: 0,
		maxtime: 60,
		yen: 15.75
	}, {
		tmid: [6],
		mintime: 60,
		maxtime: 120,
		yen: 14.7
	}, {
		tmid: [6],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 10.5
	}], [[G_RECID_DOCOMO_AWAY], {
		tmid: [1],
		mintime: 0,
		maxtime: 60,
		yen: 37.8
	}, {
		tmid: [1],
		mintime: 60,
		maxtime: 120,
		yen: 32.55
	}, {
		tmid: [1],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 26.25
	}, {
		tmid: [2],
		mintime: 0,
		maxtime: 60,
		yen: 26.25
	}, {
		tmid: [2],
		mintime: 60,
		maxtime: 120,
		yen: 21
	}, {
		tmid: [2],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 19.95
	}, {
		tmid: [3, 4, 5],
		mintime: 0,
		maxtime: 60,
		yen: 21
	}, {
		tmid: [3, 4, 5],
		mintime: 60,
		maxtime: 120,
		yen: 21
	}, {
		tmid: [3, 4, 5],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 16.8
	}, {
		tmid: [6],
		mintime: 0,
		maxtime: 60,
		yen: 15.75
	}, {
		tmid: [6],
		mintime: 60,
		maxtime: 120,
		yen: 15.75
	}, {
		tmid: [6],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 12.6
	}], [[G_RECID_DOCOMO_OWN_PHS, G_RECID_DOCOMO_AWAY_PHS], {
		tmid: [1],
		mintime: 0,
		maxtime: 60,
		yen: 30.45
	}, {
		tmid: [1],
		mintime: 60,
		maxtime: 120,
		yen: 28.35
	}, {
		tmid: [1],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 25.2
	}, {
		tmid: [2],
		mintime: 0,
		maxtime: 60,
		yen: 30.45
	}, {
		tmid: [2],
		mintime: 60,
		maxtime: 120,
		yen: 26.25
	}, {
		tmid: [2],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 24.15
	}, {
		tmid: [3, 4, 5],
		mintime: 0,
		maxtime: 60,
		yen: 30.45
	}, {
		tmid: [3, 4, 5],
		mintime: 60,
		maxtime: 120,
		yen: 26.25
	}, {
		tmid: [3, 4, 5],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 24.15
	}, {
		tmid: [6],
		mintime: 0,
		maxtime: 60,
		yen: 30.45
	}, {
		tmid: [6],
		mintime: 60,
		maxtime: 120,
		yen: 26.25
	}, {
		tmid: [6],
		mintime: 120,
		maxtime: 3600 * 24,
		yen: 24.15
	}]]
}];
var err = new ScriptLogFile(G_SCRIPT_ALL, "stdout");
var db = new ScriptDB(err);
var sql = "select planid,planname,arid,cirid from plan_tb";
sql += " where invflg=true";
sql += " and carid=" + G_CARRIER_DOCOMO;
sql += " and cirid in (";
sql += G_CIRCUIT_FOMA + "," + G_CIRCUIT_MOVA + "," + G_CIRCUIT_CITY;
sql += ")";
sql += ";";
var A_plan = db.getHash(sql);
var A_bad = Array();
var A_good = Array();

for (var line of Object.values(A_plan)) {
	var match = false;

	for (var param of Object.values(A_param)) {
		if (line.cirid != param.common.cirid) continue;

		for (var key of Object.values(param.key)) {
			if (!(-1 !== key.planname.indexOf(line.planname))) continue;

			if (-1 !== key.arid.indexOf(line.arid)) {
				if (!(-1 !== A_good.indexOf(line.planid))) A_good.push(line.planid);
				match = true;
			}
		}
	}

	if (!match) {
		A_bad.push(line.planid);
		echo("\u30DE\u30B9\u30BF\u30FC\u306B\u5B58\u5728\u305B\u305A/" + line.planname + "(" + line.planid + "/" + line.cirid + "/" + line.arid + ")\n");
	}
}

db.begin();
var sqlfrom = " from tuwa_charge_tb";
sqlfrom += " where carid=" + G_CARRIER_DOCOMO;
sqlfrom += " and planid in (";
var comma = false;

for (var id of Object.values(A_good)) {
	if (comma) sqlfrom += ",";
	comma = true;
	sqlfrom += id;
}

sqlfrom += ")";
db.backup("./tuwa_charge_tb.delete", "select *" + sqlfrom + ";");
db.query("delete" + sqlfrom + ";");
var ins = new TableInserter(err, db, getcwd() + "/tuwa_charge_tb.insert", true);
ins.begin("tuwa_charge_tb");

for (var plan of Object.values(A_plan)) {
	var planid = plan.planid;
	if (!(-1 !== A_good.indexOf(planid))) continue;

	for (var param of Object.values(A_param)) {
		if (plan.cirid != param.common.cirid) continue;
		var A_common = param.common;
		A_common.planid = planid;
		A_common.carid = G_CARRIER_DOCOMO;
		var A_value = param.value;

		for (var key of Object.values(param.key)) {
			if (!(-1 !== key.planname.indexOf(plan.planname))) continue;
			if (!(-1 !== key.arid.indexOf(plan.arid))) continue;
			var common = A_common;
			{
				let _tmp_0 = key.common;

				for (var key in _tmp_0) {
					var value = _tmp_0[key];
					common[key] = value;
				}
			}

			for (var A_master of Object.values(A_value)) {
				var A_recid = Array();

				for (var master of Object.values(A_master)) {
					if (0 == A_recid.length) {
						A_recid = master;
						continue;
					}

					var tgt = common;

					for (var key in master) {
						var value = master[key];
						tgt[key] = value;
					}

					var A_tmid = tgt.tmid;

					for (var recid of Object.values(A_recid)) {
						tgt.recid = recid;

						for (var tmid of Object.values(A_tmid)) {
							tgt.tmid = tmid;
							ins.insert(tgt);
						}
					}
				}
			}
		}
	}
}

ins.end();
db.rollback();