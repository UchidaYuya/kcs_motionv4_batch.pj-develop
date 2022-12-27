# 初期設定
nodejsをインストールしておく。
gitからプロジェクトをcloneしたら、下記のコマンドを実行する。
```
cd プロジェクトのフォルダ
npm ci
```

# コンパイル確認
```
cd プロジェクトのフォルダ
./node_modules/.bin/tsc  --outDir ./dist  ./script/script/AdjustFreeCharge.ts
```
Windowsの場合
```
プロジェクトのフォルダのフルパス\node_modules\.bin\tsc.cmd  --outDir ./dist  ./script/script/AdjustFreeCharge.ts
```

エラーが表示されず、/distのフォルダに指定したファイルと関連ファイルが出力されていればOK。

VSCODE の場合ターミナルを開くと、プロジェクトのフォルダがカレントディレクトリになっている。
Windowsの場合はポリシーを変更してtscコマンドを実行する。
'''
Set-ExecutionPolicy Unrestricted -Scope Process
./node_modules/.bin/tsc  --outDir ./dist  ./script/script/AdjustFreeCharge.ts
'''



