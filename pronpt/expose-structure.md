# expose.tsx 構造ガイド

## ゲームフロー（gameState順）

```
intro → exposureQuiz → profileSetup → action → quizReview → prePainMeter → visualization → postPainMeter → survey → result
```

| # | gameState | 日本語名 | 説明 |
|---|-----------|----------|------|
| 1 | intro | イントロ | ゲーム開始画面、ミュート設定 |
| 2 | exposureQuiz | 理解度チェック | 説明3ページ + クイズ5問 |
| 3 | profileSetup | プロフィール | 性別、年代、恐怖の入力 |
| 4 | action | 行動リスト | いつ/どこで/何を（Lv1-6） |
| 5 | quizReview | 復習クイズ | 間違えた問題の復習（任意） |
| 6 | prePainMeter | 恐怖度測定（前） | エクスポージャー前の恐怖度 |
| 7 | visualization | 想像ページ | 30秒間の想像エクスポージャー |
| 8 | postPainMeter | 恐怖度測定（後） | エクスポージャー後の恐怖度 |
| 9 | survey | アンケート | 楽しさ/改善度の評価 |
| 10 | result | 結果 | ポイント、回復度、行動リスト表示 |

---

## コンポーネント構成（行番号付き）

| コンポーネント名 | 開始行 | 終了行（目安） | 説明 |
|------------------|--------|----------------|------|
| `AffiliateComponent` | 100 | 188 | アフィリエイト広告表示 |
| `LoadingPage` | 189 | 299 | ローディング画面 |
| `IntroPage` | 300 | 425 | イントロ画面（利用規約、開始ボタン） |
| `ExposureQuizPage` | 433 | 1145 | 説明3ページ + クイズ5問 |
| `QuizReviewPage` | 1146 | 1228 | 間違えた問題の復習 |
| `ProfileSetupPage` | 1229 | 1639 | プロフィール入力（性別、年代、恐怖など） |
| `ActionPlanPage` | 1646 | 2257 | 行動リスト作成（いつ/どこで/何を） |
| `PrePainMeterPage` | 2258 | 2538 | 恐怖度測定（前）+ 説明ページ |
| `PostPainMeterPage` | 2539 | 2744 | 恐怖度測定（後） |
| `AnxietyVisualizationPage` | 2745 | 3219 | 想像エクスポージャー（30秒カウントダウン） |
| `SurveyPage` | 3220 | 3284 | 楽しさ/改善度アンケート |
| `ResultPage` | 3285 | 3598 | 結果表示（ポイント、回復度） |
| `ExposeGame` | 3600 | 3926 | メインコンポーネント（状態管理） |

---

## 定数・フック（行番号付き）

| 名前 | 行 | 説明 |
|------|-----|------|
| `ActionPlan` type | 22-27 | 行動プランの型（when, where, what） |
| `Leaf` interface | 29-43 | 葉っぱアニメーション用 |
| `useInteractionSounds` | 46-78 | 効果音フック（typing, click, hover） |
| `affiliateTextPatterns` | 81-98 | アフィリエイトテキスト3パターン |
| `QUIZ_CAT_VIDEOS` | 426-431 | クイズ用猫動画リスト（3本） |
| `CAT_VIDEOS` | 1640-1644 | 行動リスト用猫動画リスト（3本） |

---

## ExposureQuizPage 内部構造（433-1145行）

### 状態変数
- `quizStarted`: クイズ開始フラグ
- `explainPage`: 説明ページ番号（0, 1, 2）
- `currentQuestion`: 現在の問題番号（0-4）
- `answered`: 回答済みフラグ
- `selectedAnswer`: 選択した回答
- `score`: 正解数
- `showResult`: 結果表示フラグ
- `wrongAnswers`: 間違えた問題のインデックス配列
- `showCatVideo`: 猫動画表示フラグ
- `explainCatVideo`: 説明ページ用猫動画（静止）
- `currentCatVideo`: クイズ用猫動画（正解時に再生）

### 説明ページ構成
- **ページ0（explainPage === 0）**: エクスポージャーとは何か？
- **ページ1（explainPage === 1）**: なぜエクスポージャーは効果的なのか？
- **ページ2（explainPage === 2）**: この三つの意識が、あなたのエクスポージャーをただす。

### クイズ問題（questions配列: 約490-550行）
5問のクイズ、各問題に`q`, `options`, `correct`, `fb_correct`, `fb_wrong`

---

## ProfileSetupPage 内部構造（1229-1639行）

### 入力項目
1. **恐怖の入力**（一番上）: `fearDescription`
2. **性別・年代**: `gender`, `ageGroup`
3. **大切なもの**: `selfCareAnswer`
4. **なぜ大切？x5**: `whyAnswers[0-4]`
5. **最も強い欲求選択**: `strongestDesire`
6. **不快感の起源**: `discomfortOrigin`

---

## ActionPlanPage 内部構造（1646-2257行）

### ステップ管理
- `showIntro`: 説明ページ表示フラグ
- `currentStep`: 'when' | 'where' | 'what' | 'confirmation'
- `currentLevel`: 現在のレベル（1-6）

### 流れ
1. 説明ページ（showIntro === true）
2. いつ？（when）→ 選択肢: 朝/昼/夜 + 自由記述
3. どこで？（where）→ 選択肢: 学校/職場/飲み会/遊び + 自由記述
4. 何をする？（what）→ 自由記述のみ
5. 確認画面（confirmation）→ レベル追加 or エクスポージャーへ

---

## PrePainMeterPage 内部構造（2258-2538行）

### 構成
1. **説明ページ**（showIntro === true）: やること・注意点
2. **恐怖度測定**: 温度計UI + スライダー（0-10）

---

## AnxietyVisualizationPage 内部構造（2745-3219行）

### 状態変数
- `currentPlanIndex`: 現在の行動プランインデックス
- `countdown`: カウントダウン（30秒）
- `phase`: 'intro' | 'visualization' | 'complete'

### 流れ
1. イントロ（行動プラン表示）
2. 30秒カウントダウン（visualization）
3. 完了（次の行動プランへ or 終了）

---

## ExposeGame 状態変数（3600-3623行）

| 変数名 | 型 | 説明 |
|--------|-----|------|
| `gameState` | string | 現在の画面状態 |
| `totalPoints` | number | 合計ポイント |
| `enjoymentRating` | number | 楽しさ評価（1-10） |
| `improvementRating` | number | 改善度評価（1-10） |
| `actionPlans` | ActionPlan[] | 行動プラン配列 |
| `gender` | string | 性別 |
| `ageGroup` | string | 年代 |
| `userId` | string | UUID |
| `sessionId` | string | UUID |
| `valuableThings` | string | 大切なもの |
| `preFearLevel` | number | エクスポージャー前の恐怖度 |
| `postFearLevel` | number | エクスポージャー後の恐怖度 |
| `isMuted` | boolean | ミュート状態 |
| `selfCareAnswer` | string | 自分を大切にする理由 |
| `whyAnswers` | string[] | なぜ？の回答（5つ） |
| `strongestDesire` | number \| null | 最も強い欲求のインデックス |
| `discomfortOrigin` | string | 不快感の起源 |
| `fearDescription` | string | 恐れているもの |
| `wrongQuizAnswers` | number[] | 間違えたクイズのインデックス |

---

## Supabaseテーブル

| テーブル名 | 保存タイミング | 行番号 |
|------------|----------------|--------|
| `expose_profile_data` | profileSetup完了時 | 3680-3702 |
| `expose_responses` | survey完了時 | 3740-3757 |
| `affiliate_clicks` | アフィリエイトクリック時 | ResultPage内 |

---

## 効果音ファイル

| ファイル | 使用場面 |
|----------|----------|
| `/sound/typing.mp3` | タイピング、クリック、ホバー |
| `/sound/nextpage.mp3` | ページ遷移ボタン |
| `/sound/100pt.mp3` | ポイント獲得 |
| `/sound/point.mp3` | 結果画面のドン効果 |
| `/sound/gamebgmchild.mp3` | BGM（ゲーム中） |
| `/sound/timeup.mp3` | タイムアップ |

---

## 猫動画ファイル

```
/movie_output/second_half_animecat.mp4
/movie_output/second_half_bangocat.mp4
/movie_output/second_half_fatcat.mp4
```

---

## 変更依頼の例

```
「ActionPlanPage（約1900行目）の確認画面で、
レベル追加ボタンに効果音を追加したい」

「ExposureQuizPage（約630行目）の説明ページ0で、
猫の画像を大きくしたい（w-24 → w-32）」

「ProfileSetupPage（約1350行目）の恐怖入力欄を、
一番上ではなく2番目に移動したい」
```
