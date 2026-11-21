# Level Up K with MiAe Ssem ／ 새봄에 한국어 교실

福島県郡山市の韓国語教室「セボメ韓国語教室（새봄에 한국어 교실）」と、オンラインレッスン、Amazon KDP のオリジナル教材・音声を紹介する公式サイトです。

- サイト: https://miae-design.github.io/levelupk/
- 聖句ページ（1〜12月・音声つき）: https://miae-design.github.io/levelupk/verse.html ／ 礼拝出席カードのQRコードからのみ案内（サイト内にリンクなし・検索非公開）
- LINE 公式アカウント: [@155sxowo](https://line.me/R/ti/p/@155sxowo)
- お問い合わせ: miae71250@gmail.com

## ファイル構成

```
index.html            トップページ（教材・教室・オンライン・プロフィール）
verse.html            1月〜12月の聖句ページ（月切り替え・音声）
css/style.css         サイト全体のデザイン
css/verse.css         聖句ページ用の追加デザイン
js/i18n.js            日本語／英語／韓国語の文章
js/app.js             画面切り替え・音声プレーヤー・パスワード
assets/               ロゴ・写真・LINE QR
audio/                音声ファイル
```

## 聖句の音声を入れる（先生向け）

`audio/` フォルダに、月の番号に合わせたファイル名で置くだけで、`verse.html` に再生ボタンが出ます。

```
audio/verse_01.mp3  → 1月
audio/verse_02.mp3  → 2月
…
audio/verse_12.mp3  → 12月
```

- `.mp3` がなければ `.m4a` を探します。どちらも無い月は「音声準備中（先生がまもなくアップロード予定です）」と表示されます。
- 聖句の文章は `verse.html` の `VERSES` の中だけを書き換えてください。
- 聖書の引用は、韓国語＝개역개정、日本語＝口語訳です（礼拝出席カードと同じ）。

## 公開について

このリポジトリは GitHub Pages（`main` ブランチのルート）で公開しています。`index.html` を更新したら、変更をコミットして push すると数十秒で反映されます。

© 2026 Level Up K with MiAe Ssem
