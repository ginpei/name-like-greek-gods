# Change a Japanese name to something like a Greek God

ギリシア神話風の名前を付けるやつです。

## ご使用になる前に

```
$ npm clone https://github.com/ginpei/name-like-greek-gods.git
$ cd name-like-greek-gods
$ npm install
```

## 使い方

こんな感じの書式です。

```
npm start [name [url of Wikipedia]]
```

例:

```
$ npm start ギンペイ

(…省略…)

Fetching...
https://ja.wikipedia.org/wiki/%E3%82%AE%E3%83%AA%E3%82%B7%E3%82%A2%E7%A5%9E%E8%A9%B1
OK
# ギリシア神話 - Wikipedia
- ギンペイーリアス
- ギンペイア
- ギンペイストス
- ギンペイドーン
- ギンペイル
(…省略…)
done.
```

ローマ皇帝も可:

```
$ npm start ギンペイ https://ja.wikipedia.org/wiki/%E3%83%AD%E3%83%BC%E3%83%9E%E7%9A%87%E5%B8%9D%E4%B8%80%E8%A6%A7

(…省略…)

Fetching...
https://ja.wikipedia.org/wiki/%E3%83%AD%E3%83%BC%E3%83%9E%E7%9A%87%E5%B8%9D%E4%B8%80%E8%A6%A7
OK
# ローマ皇帝一覧 - Wikipedia
- ギンペイタリア
- ギンペイウス
- ギンペイタリカ
- ギンペイア
- ギンペイスス
(…省略…)
done.
```

URLはエンコード済みである必要があります:

```
$ npm start ギンペイ https://ja.wikipedia.org/wiki/ローマ皇帝一覧

(…省略…)

Fetching...
https://ja.wikipedia.org/wiki/ローマ皇帝一覧
** NG **
{ [Error: server status]
  url: 'https://ja.wikipedia.org/wiki/ローマ皇帝一覧',
  statusCode: 400 }
```
