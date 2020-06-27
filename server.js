// サーバーサイドのフレームワークexpressのインポート
const express = require('express')

// pathを使うのでインポート
const path = require('path')


// データベースを利用するためにmongoを扱うapiをインポート
// server.js のあるtarminalに$yarn add mongoose
const mongoose = require('mongoose')

// データの型(schema)を定義する。
const UserSchema = new mongoose.Schema({
  // データの型を入力
  name: String,  // 文字
  age: Number,  // 数字
  email: String  // 文字
})

// 定義したデータの型を使える（検索、削除、更新等ができる）形にする。専用のクラスを使う。
const User = mongoose.model("User", UserSchema)
// 検索、削除、更新等でUserを使う。





// サーバサイドのフレームワークexpressを起動
const app = express()

// buildファイルにアクセスできるようにする。
app.use(express.static(path.join(__dirname, "/build")))

// ミドルウェアの設定
app.use(express.urlencoded({ extend: true }))
app.use(express.json())

// リクエストに対する処理を書く。
// getリクエストの場合、app.get(url, (リクエスト、レスポンス)=>{リクエストとレスポンスを用いた処理})
// 第二引数はコールバック関数
// app.get("/api/users", (req, res) => {
//   console.log("getリクエストを受け取りました。")
//   // レスポンスを返す。json形式（連想配列）でレスポンスを返している。
//   res.json({
//     msg: "getリクエストがサーバーに届きました。"
//   })
// })

// データベースのurlを定義する。mondodb://localhost/DB名
const dbUrl = "mongodb://localhost/users"

// データベースとサーバーを接続する。
mongoose.connect(dbUrl, (err) => {
  if (err) console.error(err)
  console.log("データベースと接続完了")
})



app.get("/api/users", (req, res) => {
  console.log("getリクエストを受け取りました。")
  // レスポンスを返す。json形式（連想配列）でレスポンスを返している。
  // res.json({
  //   msg: "getリクエストがサーバーに届きました。",
  //   deta: [
  //     {
  //       name: '佐藤', age: '25', email: 'sat@gmail.com'
  //     },
  //     {
  //       name: '阿部', age: '48', email: 'hiroshi@yahoo.co.jp'
  //     },
  //   ]
  // })
  
  // -----------------------------------
  // GETボタンが押された際にデータベースに保存されているデータがクライアント側に反映されるコードを書く。
  // サーバ側で行う処理は、
      // 1. データベースに保存されているデータを全て取得。
      // 2. クライアント側に送る。
  
      // 1. データベースに保存されているデータを全て取得=条件なし検索を使う。User.find({}, (エラー, 該当したデータの配列)=>{})

  User.find({}, (err, userArrey)=>{
    // エラーの場合errを送る。
    // console.errorでもok。
    if (err) res.send(err)
  
    // 以下json形式
    res.json({
      msg:"データベース内のデータを反映します。",
      deta: userArrey // mongoのidが入っている
    })
  })
  // -----------------------------------
// mongoのデータベース内にidが保存されている。

})




// リクエストがPOSTの場合
app.post("/api/users", (req, res) => {
  console.log("postリクエストを受け取りました。") //<- ターミナル
  console.log(`${req.body.name}のデータが送信されました。`)
  // res.json({ //<-ブラウザのコンソールに表示
//     msg: `${req.body.name}のデータを受け取りました。`
  // })


  // ------------------------------

  // 以下に新しくデータを受け取ってデータベースに保存するコードを記述。
  // クラスなので、
    //new モデル名(保存したいデータ).save(コールバック関数)
    // でデータベースにデータを保存できる。

  new User({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email
  }).save(err=>{
    // エラーの場合errを送る。
    // console.errorでも可。
    if(err) res.send(err)
    res.json({
      msg:`${req.body.name}のデータを保存しました。`
    })
  })
  // -----------------------------
})



// --------- delete --------
// リクエストがDELETEの場合

// 1.削除するUserを指定。id
// 2.サーバから削除。findByIdAndRemove()を使う。[モデル名].findByIdAndRemove(id, callback)
// 3.クライアントにレスポンスを返す。

app.delete("/api/users", (req, res) => {
  console.log("deleteリクエストを受け取りました。")//<- ターミナル

  // const { id } = req.body
  const id = req.body
  console.log(id)

  User.findByIdAndRemove(id, err => {
    if (err) res.send(err)
    res.json({ //<-ブラウザのコンソールに表示
      msg: `${id}のデータを削除しました。`
    })
  })
})

// herokuでデプロイした際に上記url以外は基本的にReactファイルを表示するようにする。
app.get("*", (req, res)=> {
  res.sendFile(path.join(__diename, "/build/index.html"))
})

// herokuでデプロイする際のポート番号を設定する。
const port = process.env.PORT || 3001




// サーバーの起動
  // app.listen(3001, (err) => {
  app.listen(port, (err) => {
  if (err) console.error(err)
  console.log(`listening on port 3001`)
})

// node.jsで書いてる




