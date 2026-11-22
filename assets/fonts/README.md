# cards.html で使うハングル書体

`nanum-barun-gothic-bold.subset.woff2`（約 11 KB）

- 書体: **NanumBarunGothic Bold（나눔바른고딕）** / 2013 NHN Corporation / FONTRIX Inc.
- ライセンス: SIL Open Font License 1.1（`LICENSE-NanumBarunGothic.txt`）。商用可・再配布可。
- このファイルは元フォントの**サブセット**（cards.html に出てくる文字だけ）です。字形はそのまま。
- 選んだ理由: 幼児・日本語話者の学習者向けに
  ① 濃音（ㄲ・ㄸ・ㅃ・ㅆ・ㅉ）が **2 つの字に分かれて** 見える（`ㄲ` が `刀` にならない）
  ② `ㅈ`・`ㅉ` が `大` ではなく **カタカナの `ス` の形**、`ㅊ` はその上に短い画
  （絵本 `kdp_cards/` と同じ書体で、印刷物と画面の字形が一致します）

## 作り直すとき

文字を足したら（新しい言葉を追加したら）、下のコマンドで作り直してください。
`tmp/cards_charset.txt` は cards.html と cards.css に出てくる文字の一覧です。

```bash
python3 - <<'PY'
src = open('website/levelupk_v3/cards.html', encoding='utf-8').read()
css = open('website/levelupk_v3/css/cards.css', encoding='utf-8').read()
keep = set()
for ch in set(src + css):
    o = ord(ch)
    if 0xAC00 <= o <= 0xD7A3 or 0x3130 <= o <= 0x318F or 0x20 <= o <= 0x7E: keep.add(ch)
    elif ch in '·・—–…「」『』〜♪': keep.add(ch)
open('tmp/cards_charset.txt', 'w', encoding='utf-8').write(''.join(sorted(keep)))
PY

python3 -m fontTools.subset fonts_rounded/NanumBarunGothic-Bold.ttf \
  --text-file=tmp/cards_charset.txt --flavor=woff2 --layout-features='' \
  --no-hinting --desubroutinize \
  --output-file=website/levelupk_v3/assets/fonts/nanum-barun-gothic-bold.subset.woff2
```
