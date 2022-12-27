//===========================================================================
//機能：auシミュレーション、sim_trend_X_tb読込のための設定
//
//作成：中西
//最終更新日: 2006/10/24
//===========================================================================

// 通話の分類、国内=1と国際=2
// 全ての通話typeは、このリストに登録されている必要があります
export const H_tuwa_type = [
	{ "通話明細": 1 },
	{ "各種ダイヤルサービス通話明細": 1 },
	{ "分計通話明細": 1 },
	{ "ａｕ国際電話通話明細": 2 },
	{ "ドコモローミング通話明細": 2 },
	{ "グローバルパスポート通話明細": 2 },
	{ "グローバルエキスパート通話明細": 2 },
	{ "ハローメッセンジャー通話明細": 1 },
	{ "グロパス（ＣＤＭＡ）通話明細": 2 },
	{ "グロパス（ＧＳＭ）通話明細": 2 },
	{ "テレビ電話通話明細": 1 },
	{ "ａｕ国際電話分計通話明細": 2 },
	{ "ａｕ世界（ＧＳＭ）通話明細": 2 },
	{ "ａｕ世界（ＣＤＭＡ）通話明細": 2 },
	{ "ａｕ世界（ＶｏＬＴＥ）通話明細": 2 },
	/* 新たな通話タイプが出現した場合、ここに追加せよ */
];

// パケットタイプ -> コードのマスター表
// EZ=10, ブラウジング=20, データ通信=30, 99=その他(除外)
// 全ての通信typeは、このリストに登録されている必要があります
export const H_packet_type = [
	{ "ＰＣサイトビューアー通信明細": 20 },
	{ "グローバルパスポートパケット通信明細": 30 },
	{ "パケット通信明細（ＢＲＥＷ）": 10 },
	{ "パケット通信明細（ＢＲＥＷデータ）": 10 },
	{ "パケット通信明細（ＥＺＷＩＮインターＮ）": 10 },
	{ "パケット通信明細（ＥＺＷＩＮメール）": 10 },
	{ "パケット通信明細（ＥＺｗｅｂ＠ｍａｉｌ）": 10 },
	{ "パケット通信明細（ＥＺｗｅｂｍｕｌｔｉ）": 10 },
	{ "パケット通信明細（ａｕ．ＮＥＴ）": 30 },
	{ "パケット通信明細（データ通信）": 30 },
	{ "Ｃメール送信明細": 99 },
	{ "パケット通信明細（ハローメッセンジャー）": 99 },
	{ "グロパス（ＣＤＭＡ）通信明細（ＥＺ）": 99 },
	{ "グロパス（ＣＤＭＡ）通信明細（Ｅメール）": 99 },
	{ "グロパスパケット通信明細（Ｅメール）": 99 },
	{ "グロパスパケット通信明細（ＥＺ）": 99 },
	{ "パケット通信明細（ＥＺＷＩＮインターＮ）": 10 },
	{ "グロパス（ＧＳＭ）通信明細（Ｅメール）": 99 },
	{ "パケット通信明細（ａｕ．ＮＥＴ）その他": 30 },
	{ "パケット通信明細（データ通信）その他": 30 },
	{ "グロパス（ＧＳＭ）Ｃメール送信明細": 99 },
	{ "グロパス（ＧＳＭ）通信明細（ＥＺ）": 99 },
	{ "グロパス（ＧＳＭ）通信明細（ＰＣサイト）": 99 },
	{ "パケット通信明細（ａｕ．ＮＥＴ）特定機種": 30 },
	{ "パケット通信明細（データ通信）特定機種": 30 },
	{ "パケット通信明細（対象カーナビ接続）": 30 },
	{ "パケット通信明細（ＩＳ／ａｕ．ＮＥＴ）": 30 },
	{ "パケット通信明細（ＩＳ・ａｕ．Ｎ・Ｗｉ）": 30 },
	{ "グロパス通信明細（データ）": 99 },
	{ "グロパス（ＣＤＭＡ）通話明細": 99 },
	{ "グロパス（ＣＤＭＡ）通信明細（ＰＣサイ）": 99 },
	{ "パケット通信明細（ＬＴＥ）": 30 },
	{ "グロパス通信明細（ＬＴＥ）": 30 },
	{ "パケット通信明細（ＬＴＥ、ＷｉＭＡＸ２＋": 30 },
	{ "ａｕ世界サービス通信明細（ＬＴＥ）": 99 },
	{ "ａｕ世界（ＧＳＭ）通信明細（ＥＺ）": 99 },
	{ "ａｕ世界（ＧＳＭ）通信明細（Ｅメール）": 99 },
	{ "ａｕ世界（ＣＤＭＡ）通信明細（Ｅメール）": 99 },
	/* 新たな通信タイプが出現した場合、ここに追加せよ */
];

//パケットのtoplace -> 詳細分類コードのマスター表
export const H_packet_detail = [
	{ "メール": 11 },
	{ "ＥＺ": 12 },
	{ "データ": 13 },
	{ "": 13 }	// 空文字列。null もここに分類する。
	/* 新たなタイプが出現した場合、ここに追加せよ */
];
export const Packet_detail_null = 13;	// nullの場合の分類先

// デジタル通信に分類されるタイプ
export const A_data_comm_type = "データダイヤル";