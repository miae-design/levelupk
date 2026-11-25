# Level Up K with MiAe Ssem ／ 새봄에 한국어 교실

福島県郡山市の韓国語教室「セボメ韓国語教室（새봄에 한국어 교실）」と、オンラインレッスン、Amazon KDP のオリジナル教材・音声を紹介する公式サイトです。

- サイト: https://miae-design.github.io/levelupk/
- 聖句ページ（1〜12月・音声つき）: https://miae-design.github.io/levelupk/verse.html ／ 礼拝出席カードのQRコードからのみ案内（サイト内にリンクなし・検索非公開）
- LINE 公式アカウント: [@155sxowo](https://line.me/R/ti/p/@155sxowo)
- お問い合わせ: levelupk.ssem@gmail.com

## ファイル構成

```
index.html            トップページ（教材・教室・オンライン・プロフィール）
verse.html            1月〜12月の聖句ページ（月切り替え・音声）
cards.html            KDP絵本の「ことばカード」（25巻・375語・音声／タイトル・よくできました）
css/style.css         サイト全体のデザイン
css/verse.css         聖句ページ用の追加デザイン
css/cards.css         ことばカード用の追加デザイン
js/i18n.js            日本語／英語／韓国語の文章
js/app.js             画面切り替え・音声プレーヤー・パスワード
assets/               ロゴ・写真・LINE QR
assets/photos/         ことばカードの実写真（135点・第5巻の15語は色見本・出典は assets/photos/CREDITS.md）
assets/fonts/         ことばカード用ハングル書体（サブセット）
images/               教室ページの写真（Crowdpic・出典は images/CREDITS.md）
audio/                音声ファイル
audio/vol2/           第2巻のことば・タイトル・よくできました（bom.mp3 など）
audio/vol3/           第3巻のことば・タイトル・よくできました
audio/cards/          巻をまたいで使う音声の置き場（今は空）
```

## 絵本の音声を入れる（先生向け）

`audio/vol{巻番号}/` フォルダに、ことばの名前（スラッグ）でファイルを置くと、`cards.html` に再生ボタンが出ます。

```
audio/vol2/bom.mp3          → 第2巻 봄
audio/vol3/jadongcha.mp3    → 第3巻 자동차
audio/vol2/title.mp3        → 第2巻のタイトル（?w=title&v=2）
audio/vol2/jalhaesseoyo.mp3 → 第2巻の「잘했어요」（?w=jalhaesseoyo&v=2）
```

- まず `audio/vol{巻番号}/` を探し、同じスラッグが1つの巻にしか無いことばは `audio/cards/` も探します。
  同じスラッグが複数の巻にあるとき（bae＝3巻ふね・4巻なし・6巻おなか、nun、jajeongeo、pul＝7巻くさ・23巻のり）は、
  別の巻の音声が流れないよう `audio/vol{巻番号}/` だけを見ます。
- `.mp3` がなければ `.m4a`、`.wav` の順に探します。無いことばは「音声準備中 ／ Audio Coming Soon」と表示されます。
- 今入っている音声は第2巻15語＋タイトル＋よくできました、第3巻15語＋タイトル＋よくできましたの計34ファイルです。
- 第1・4〜25巻は録音待ちです（絵本のQRは今も開き、ことば・写真・意味は表示されます）。16〜25巻は写真もまだ無く、ことばと意味だけを表示します。
- 45語の一覧・録音チェック表は `kdp_cards/녹음용_단어_목록_45개.md`（ワークスペース）にあります。6巻「우리 몸」の15語は `kdp_cards/vol6_body/녹음용_단어_목록_6권.md`、7巻「하늘 · 땅 · 바다」の15語は `kdp_cards/vol7_sky_land_sea/녹음용_단어_목록_7권.md`、8巻「곤충」の15語は `kdp_cards/vol8_insects/녹음용_단어_목록_8권.md`、9巻「숫자／すうじ」の15語は `kdp_cards/vol9_numbers/녹음용_단어_목록_9권.md`、10巻「동물 2」の15語は `kdp_cards/vol10_animals2/녹음용_단어_목록_10권.md` です。
- ことばと翻訳は `cards.html` の `VOLUMES` の中だけを書き換えてください。
- ページは `noindex, nofollow`、`index.html` からのリンクなし（絵本のQR専用）。QR は `cards.html?w=スラッグ` です。

## ことばカードの写真（じっさいの しゃしん／Real Photo）

各ことばカードには、音声の下に「📷 じっさいの しゃしん ／ 실제 모습 ／ Real Photo」の写真を1枚ずつ表示します。

- 写真ファイル: `assets/photos/v{巻}-{スラッグ}.jpg`（800×600・JPEG）。例：`v3-bae.jpg`（ふね）、`v4-bae.jpg`（なし）、`v6-bae.jpg`（おなか）
- 出典データ: `cards.html` の `PHOTOS`（ファイル・作者・ライセンス・Commonsのページ）。カード下のクレジット表示に使います。
- 一覧表: `assets/photos/CREDITS.md`（写真135点の作者・ライセンス・出典URL）
- 写真135点のうち132点は Wikimedia Commons の自由利用ライセンス（CC0／パブリックドメイン／CC BY／CC BY-SA）、3点（第9巻の 백・천・만）は当教室で作った数字の画像（CC0・自作）です。CC BY・CC BY-SA の写真は作者名とライセンスをカード下に表示しています。
- 第11〜25巻（한국 음식・식기・부엌・옷・가방・신발・스포츠・악기・공룡・우주・가구・전자기기・가전・병원・약국・직업・채소・유치원・학용품・장난감・가족）は写真がまだ無いため、写真の欄は出さずにことばと意味だけを表示します。写真を入れるときは `assets/photos/v{巻}-{スラッグ}.jpg` を置き、`PHOTOS` に出典を足してください。
- 写真を差し替えるときは、`assets/photos/` のファイルを同じ名前で置き換えるだけで表示されます（`PHOTOS` の出典も書き換えてください）。

## 聖句の音声を入れる（先生向け）

`audio/` フォルダに、月の番号に合わせたファイル名で置くだけで、`verse.html` に再生ボタンが出ます。

```
audio/verse_01.mp3  → 1月
audio/verse_02.mp3  → 2月
…
audio/verse_12.mp3  → 12月
```

- `.mp3` がなければ `.m4a`、`.wav` の順に探します。どちらも無い月は「音声準備中（先生がまもなくアップロード予定です）」と表示されます。
- 聖句の文章は `verse.html` の `VERSES` の中だけを書き換えてください。
- 聖書の引用は、韓国語＝개역개정、日本語＝口語訳です（礼拝出席カードと同じ）。

## 公開について

このリポジトリは GitHub Pages で公開しています（公開ブランチは `gh-pages`、ルート）。

- サイト: https://miae-design.github.io/levelupk/
- 聖句ページ: https://miae-design.github.io/levelupk/verse.html?m=1 （出席カードのQR専用。サイト内にリンクを置かず、`noindex` を設定）

`main` が原稿、`gh-pages` が公開用です。更新したら両方に push します。

```bash
git add -A && git commit -m "update"
git push origin main
git push -f origin main:gh-pages
```

（リポジトリの Settings → Pages で公開ブランチを `main` に変更すれば、以後は `git push origin main` だけで公開できます。）

© 2026 Level Up K with MiAe Ssem
