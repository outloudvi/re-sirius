import { expect } from "chai"
import decodeMsgpackResponse from "./decodeMsgpackResponse"
import hexToBuffer from "./hexToBuffer"
import { ExtBuffer } from "msgpack-lite/lib/ext-buffer"

const payloadOne = `
92 d4 62 01 c6 00 00 00 02 10 90 92 c7 03 62 cd
0a 50 c6 00 00 05 db f8 8f 98 0b da 09 f6 5b 7b
22 45 6c 65 6d 65 6e 74 22 3a 20 31 2c 0d 0a 20
22 44 61 74 61 22 3a 20 22 e3 80 8c e3 83 af e3
83 bc e3 83 ab e3 83 89 e3 83 80 e3 82 a4 e3 82
b9 e3 82 bf e3 83 bc 20 e5 a4 a2 e3 81 ae e3 82
b9 e3 83 86 e3 83 a9 e3 83 aa e3 82 a6 e3 83 a0
e3 80 8d e3 82 92 e3 81 94 e5 88 a9 e7 94 a8 e3
81 84 e3 81 9f e3 81 a0 e3 81 8d e8 aa a0 e3 81
ab e3 81 82 e3 82 8a e3 81 8c e3 81 a8 e3 81 86
e3 81 94 e3 81 96 e3 81 84 e3 81 be e3 81 99 e3
80 82 22 7d 0d 0a 2c 98 00 1b 32 98 00 a0 90 e4
ba 88 e5 91 8a e3 80 91 92 00 f1 11 83 99 e3 83
b3 e3 83 88 e3 80 8c 67 6f 64 20 69 73 20 6e 6f
20 2f 77 2f 20 68 65 72 65 e3 80 8d 73 00 11 a4
88 00 1d a6 5b 00 1a 33 5b 00 bd 81 82 e3 82 89
e3 81 99 e3 81 98 2b 00 19 34 2b 00 f0 13 45 64
65 6e e5 8a a0 e5 85 a5 e5 89 8d e3 81 ae e5 a4
a7 e9 bb 92 e3 81 af e3 80 81 e6 86 a7 e3 82 8c
15 00 e0 8a 87 e5 9b a3 e3 81 a7 e6 b4 bb e8 ba
8d 59 00 f1 05 82 8b e3 81 b1 e3 82 93 e3 81 a0
e9 81 94 e3 82 92 e7 be a8 fa 00 d1 97 e3 81 8f
e6 80 9d e3 81 a3 e3 81 a6 ae 00 f3 09 9f e3 80
82 0d 0a e3 80 8e e4 bb 8a e5 b9 b4 e3 81 93 e3
81 9d e3 82 b7 6b 01 f1 0b 82 b9 e3 81 ab e8 a1
8c e3 81 8f e3 80 8f e3 81 a8 ef bc 93 e5 9b 9e
e7 9b ae 98 01 11 aa ba 01 41 87 e3 82 a3 33 00
10 a7 25 01 81 82 92 e5 8f 97 e3 81 91 86 00 d0
8c e2 80 95 e2 80 95 e7 b5 90 e6 9e 9c b9 00 20
81 be 74 00 20 81 97 80 00 b1 82 82 e4 b8 8d e5
90 88 e6 a0 bc 86 00 f4 00 e8 87 aa e4 bf a1 e3
82 92 e5 a4 b1 e3 81 84 e2 00 41 8c e6 86 8e bb
00 a7 bf e3 81 ab e5 a4 89 e3 82 8f c1 00 14 8f
15 01 10 ab 15 01 21 95 91 d6 00 40 ae e6 89 8b
48 00 b1 b7 ae e3 81 97 e4 bc b8 e3 81 b9 77 00
af ae e3 81 af e2 80 a6 e2 80 a6 03 02 01 0a a8
01 cf e9 96 8b e5 82 ac e6 9c 9f e9 96 93 a8 01
0c f3 0c 32 30 32 33 e5 b9 b4 37 e6 9c 88 33 31
e6 97 a5 20 31 37 3a 30 30 20 ef bd 9e 20 1b 00
50 38 e6 9c 88 38 1a 00 5d 32 32 3a 30 30 4f 00
19 33 f7 01 08 71 02 6d e6 a6 82 e8 a6 81 31 00
0a 28 02 02 a5 00 31 e4 b8 ad 06 01 70 8c e5 85
ac e6 bc 94 96 02 88 80 8c e5 8d 94 e5 8a 9b 12
00 60 e7 a8 bd e5 8f a4 1e 00 80 82 92 e3 83 97
e3 83 ac 70 00 03 36 02 a4 93 e3 81 a8 e3 81 a7
e3 80 81 85 03 f1 01 9f e3 83 8a e6 b6 88 e8 b2
bb e9 87 8f e3 82 84 18 00 a0 b3 e3 82 a2 e3 81
aa e3 81 a9 93 01 51 bf 9c e3 81 98 d1 01 07 29
03 21 83 9d 0f 00 01 35 03 84 82 92 e7 8d b2 e5
be 97 9c 02 02 66 00 10 8c 69 00 21 81 8d 99 02
11 99 01 02 04 26 00 10 97 ad 01 0f 4d 00 05 08
71 00 21 80 8c 65 00 04 9d 03 00 28 04 11 88 93
02 01 99 02 80 80 8d e8 a7 a3 e6 94 be ce 00 21
81 aa 75 03 10 b3 22 01 00 49 04 41 b3 e3 82 ad
06 00 77 b0 e5 a0 b1 e9 85 ac a4 00 0f 95 00 22
10 af ca 04 07 b3 00 90 e4 ba a4 e6 8f 9b e6 89
80 69 01 00 1d 04 f8 04 a6 e3 80 81 3c 63 6f 6c
6f 72 3d 23 65 65 35 66 35 66 3e bc 00 40 e2 98
85 33 55 01 22 82 af fb 04 21 3c 2f 2c 00 4f 3e
e3 82 84 36 00 08 21 53 52 68 01 03 2f 05 04 34
00 c3 e4 bb 96 e8 b1 aa e8 8f af e3 81 aa de 00
22 81 a8 91 00 00 6a 01 00 98 03 0f 82 01 03 0d
67 02 0f 98 02 07 01 78 00 04 e0 01 00 e0 00 0f
fd 04 05 0a aa 02 01 34 00 04 af 01 00 bb 00 05
43 00 70 af e7 89 b9 e5 ae 9a a4 03 07 07 01 01
1d 02 f1 04 9f e3 81 af e5 b1 9e e6 80 a7 e3 82
92 e7 b7 a8 e6 88 90 24 02 13 a6 d7 02 21 82 92
a2 04 14 86 d7 00 00 bf 02 60 e5 85 a5 e6 89 8b
b3 02 81 81 8c e5 a2 97 e5 8a a0 33 00 03 fe 05
4b 0d 0a 0d 0a 57 01 6f e5 af be e8 b1 a1 83 01
01 f1 05 0d 0a e3 83 bb e9 80 a3 e5 b0 ba e9 87
8e e5 88 9d e9 ad 85 14 00 53 e7 83 8f e6 a3 95
05 01 11 00 61 e8 90 ac e5 ae b9 0b 00 61 e7 ad
86 e5 b3 b6 74 00 4f 90 e3 82 8c 71 00 06 02 d8
00 04 ba 01 06 96 00 aa 66 66 36 37 39 64 3e e6
86 90 22 00 00 a3 01 0b ba 06 0a 62 01 61 e4 b8
80 e8 87 b4 79 00 01 e2 05 28 82 8b d4 00 01 02
01 09 50 01 44 31 e4 ba ba 54 01 02 1c 02 11 94
04 04 11 ab 9c 01 0f ab 01 02 12 ae a8 03 02 5d
01 56 32 35 ef bc 85 62 01 00 39 04 08 bf 01 12
a8 bf 00 cf e3 81 ae e4 b8 a1 e6 96 b9 e3 81 8c
a2 00 0c 09 e3 01 af 9f e5 a0 b4 e5 90 88 e3 81
af 8f 00 14 29 35 30 8f 00 00 6f 06 00 5c 04 00
37 01 09 35 01 0a da 02 cd e6 b3 a8 e6 84 8f e4
ba 8b e9 a0 85 2b 00 0a 60 01 00 0c 02 01 1a 06
01 77 03 71 b1 e3 82 b8 e3 83 a5 74 04 40 ab e5
8f 8a 62 04 07 06 04 93 e5 86 85 e5 ae b9 e3 81
af 4d 08 00 33 05 70 8f e5 a4 89 e6 9b b4 98 00
24 82 8b df 00 11 8c 77 01 0f a2 08 0b 19 36 25
06 ce 49 6e 66 6f 72 6d 61 74 69 6f 6e 2f 51 06
19 35 2c 00 51 e4 bb 8a e5 be 0b 09 20 82 82 a8
04 0f 72 09 27 51 82 88 e3 82 8d 5d 02 71 8f e3
81 8a e9 a1 98 6f 07 02 7e 09 0a 6e 01 3f 5d d9
39 45 09 1d 02 58 01 92 ef bc 81 d6 ff 64 c5 7d
d0 06 00 e0 02 04 ab 45 76 65 6e 74 2f 32 30 30
30 31 92 d4 62 01 c6 00 00 00 02 10 90 92 d4 62
01 c6 00 00 00 02 10 90 92 d4 62 01 c6 00 00 00
02 10 90                                       
`

const decodedOne = [
  11,
  '[{"Element": 1,\r\n "Data": "「ワールドダイスター 夢のステラリウム」をご利用いただき誠にありがとうございます。"}\r\n,{"Element": 2,\r\n "Data": "【予告】イベント「god is no /w/ here」について"}\r\n,{"Element": 3,\r\n "Data": "あらすじ"}\r\n,{"Element": 4,\r\n "Data": "Eden加入前の大黒は、憧れの劇団で活躍するぱんだ達を羨ましく思っていた。\r\n『今年こそシリウスに行く』と３回目のオーディションを受けるが――結果はまたしても不合格。\r\n自信を失い憧れが憎しみに変わっていく大黒に、救いの手を差し伸べたのは……。"}\r\n,{"Element": 3,\r\n "Data": "開催期間"}\r\n,{"Element": 4,\r\n "Data": "2023年7月31日 17:00 ～ 2023年8月8日 22:00"}\r\n,{"Element": 3,\r\n "Data": "イベント概要"}\r\n,{"Element": 4,\r\n "Data": "期間中に「公演」「協力公演」「稽古」をプレイすることで、スタミナ消費量やスコアなどに応じてイベントポイントを獲得することができます。\r\n獲得したイベントポイントに応じて「イベントストーリー」解放、ならびにランキング報酬を獲得できます。\r\n獲得したイベントポイントは「イベント交換所」にて、<color=#ee5f5f>イベント★3アクター</color>や<color=#ee5f5f>イベントSRポスター</color>他豪華な報酬と交換することができます。"}\r\n,{"Element": 3,\r\n "Data": "イベントポイントについて"}\r\n,{"Element": 4,\r\n "Data": "イベントポイントは特定のアクターまたは属性を編成して公演を行うことで、入手量が増加します。\r\n\r\n<color=#ee5f5f>対象アクター</color>\r\n・連尺野初魅\r\n・烏森大黒\r\n・萬容\r\n・筆島しぐれ\r\n\r\n<color=#ee5f5f>対象属性</color>\r\n<color=#ff679d>憐属性</color>"}\r\n\r\n,{"Element": 4,\r\n "Data": "一致しているアクターまたは属性を1人編成するごとにイベントポイントの獲得量が25％増加し、アクターと属性の両方が一致しているアクターを編成した場合はイベントポイントの獲得量が50％増加します。"}\r\n,{"Element": 3,\r\n "Data": "注意事項"}\r\n,{"Element": 4,\r\n "Data": "・開催スケジュール及びイベント内容は予告なく変更する場合がございます。"}\r\n,{"Element": 6,\r\n "Data": "Information/0"}\r\n,{"Element": 5,\r\n "Data": "今後とも「ワールドダイスター 夢のステラリウム」をよろしくお願いいたします。"}\r\n]',
  "【予告】イベント「god is no /w/ here」開催！",
  ExtBuffer(Buffer.from([100, 197, 125, 208]), 255),
  ExtBuffer(Buffer.from([100, 197, 125, 208]), 255),
  2,
  4,
  "Event/20001",
]

it("decodeMsgpackResponse", function () {
  expect(decodeMsgpackResponse(hexToBuffer(payloadOne))).deep.eq(decodedOne)
})
