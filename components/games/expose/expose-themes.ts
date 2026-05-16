// エクスポージャーゲームのテーマデータ
// 各テーマには不快感の具体例とレベル別の行動プラン例が含まれる

export type ExposeTheme = {
  id: string
  name: string
  description: string
  icon: string
  color: string
  // 不快感の具体例（5パターン）
  discomfortExamples: string[]
  // レベル1〜5の行動プラン例
  levelExamples: {
    level: number
    when: string
    where: string
    what: string
  }[]
  // イントロページの説明文
  introText: string
  // クイズの追加説明（テーマに合わせた文言）
  quizContext: string
}

export const exposeThemes: ExposeTheme[] = [
  // 1. 完璧主義
  {
    id: "perfectionism",
    name: "完璧主義",
    description: "失敗への恐怖や「ちゃんとできないといけない」という不安",
    icon: "🎯",
    color: "from-blue-400 to-indigo-500",
    discomfortExamples: [
      "仕事でミスをして上司や同僚に失望されること",
      "プレゼンで言い間違えて恥をかくこと",
      "提出した書類に誤字脱字があること",
      "他人に自分の作業を見られて批判されること",
      "期限に間に合わず「できない人」と思われること"
    ],
    levelExamples: [
      { level: 1, when: "明日の朝", where: "自分の部屋で", what: "わざと誤字を1つ含むメモを書いてそのまま放置する" },
      { level: 2, when: "今週中", where: "職場/学校で", what: "ちょっとした雑談で「わからない」と正直に言う" },
      { level: 3, when: "来週", where: "友人との会話で", what: "自分の失敗談を1つ話す" },
      { level: 4, when: "2週間以内", where: "職場のミーティングで", what: "完璧に準備せずに質問や発言をする" },
      { level: 5, when: "1ヶ月以内", where: "上司や先輩の前で", what: "わからないことを素直に聞き、助けを求める" }
    ],
    introText: "完璧でなければいけないというプレッシャーから解放されましょう。失敗しても大丈夫だと脳に学習させます。",
    quizContext: "完璧主義による不安"
  },

  // 2. 女の子を誘う / 異性へのアプローチ
  {
    id: "asking-out",
    name: "異性を誘う",
    description: "好きな人に声をかけることや、誘うことへの恐怖",
    icon: "💕",
    color: "from-pink-400 to-rose-500",
    discomfortExamples: [
      "話しかけて無視されること",
      "誘ったら断られて恥ずかしい思いをすること",
      "相手に「キモい」と思われること",
      "周りの人に見られて笑われること",
      "連絡先を聞いて変な人だと思われること"
    ],
    levelExamples: [
      { level: 1, when: "今日", where: "コンビニやカフェで", what: "店員さんに笑顔で「ありがとうございます」と言う" },
      { level: 2, when: "明日", where: "通勤・通学途中で", what: "すれ違う人と目を合わせて会釈する" },
      { level: 3, when: "今週中", where: "職場/学校で", what: "異性の知り合いに「最近どう？」と話しかける" },
      { level: 4, when: "来週", where: "友人の集まりで", what: "初対面の異性と5分以上会話する" },
      { level: 5, when: "2週間以内", where: "気になる相手に", what: "「今度一緒に○○しない？」と誘ってみる" }
    ],
    introText: "異性に話しかけることへの恐怖を克服しましょう。断られても大丈夫だと脳に学習させます。",
    quizContext: "異性へのアプローチに関する不安"
  },

  // 3. 人前で話す / 社交不安
  {
    id: "public-speaking",
    name: "人前で話す",
    description: "注目されることや、人前でパフォーマンスすることへの恐怖",
    icon: "🎤",
    color: "from-purple-400 to-violet-500",
    discomfortExamples: [
      "大勢の前で頭が真っ白になること",
      "声が震えて変だと思われること",
      "質問されて答えられないこと",
      "話している途中で笑われること",
      "自分の話がつまらないと思われること"
    ],
    levelExamples: [
      { level: 1, when: "今日", where: "家の中で", what: "鏡の前で1分間自己紹介を練習する" },
      { level: 2, when: "明日", where: "家族や親しい友人に", what: "最近あった出来事を3分話す" },
      { level: 3, when: "今週中", where: "少人数の集まりで", what: "自分の意見を1つ発言する" },
      { level: 4, when: "来週", where: "会議やグループワークで", what: "準備なしで簡単な報告をする" },
      { level: 5, when: "1ヶ月以内", where: "10人以上の前で", what: "3分間のプレゼンや発表をする" }
    ],
    introText: "人前で話すことへの恐怖を段階的に克服しましょう。注目されても大丈夫だと脳に学習させます。",
    quizContext: "人前で話すことに関する不安"
  },

  // 4. 断られることへの恐怖 / 拒絶恐怖
  {
    id: "rejection",
    name: "断られる恐怖",
    description: "お願いや依頼を断られることへの恐怖",
    icon: "🙅",
    color: "from-orange-400 to-amber-500",
    discomfortExamples: [
      "頼み事をして「無理」と言われること",
      "助けを求めて冷たくされること",
      "誘いを断られて嫌われたと感じること",
      "意見を言って否定されること",
      "お願いして「迷惑」と思われること"
    ],
    levelExamples: [
      { level: 1, when: "今日", where: "お店で", what: "店員さんに商品の場所を聞く" },
      { level: 2, when: "明日", where: "家族に", what: "小さなお願いをする（お茶を入れてなど）" },
      { level: 3, when: "今週中", where: "友人に", what: "ちょっとした頼み事をする" },
      { level: 4, when: "来週", where: "職場/学校で", what: "同僚や友人に仕事の手伝いを頼む" },
      { level: 5, when: "2週間以内", where: "あまり親しくない人に", what: "断られる可能性があるお願いをしてみる" }
    ],
    introText: "断られることへの恐怖を克服しましょう。NOと言われても大丈夫だと脳に学習させます。",
    quizContext: "断られることに関する不安"
  },

  // 5. 他人の評価 / 評価恐怖
  {
    id: "judgment",
    name: "他人の評価",
    description: "他人にどう思われるかを過度に気にする恐怖",
    icon: "👀",
    color: "from-teal-400 to-cyan-500",
    discomfortExamples: [
      "変な人だと思われること",
      "陰で悪口を言われること",
      "能力が低いと見下されること",
      "周りから浮いていると思われること",
      "自分の服装や外見を批判されること"
    ],
    levelExamples: [
      { level: 1, when: "今日", where: "自宅で", what: "普段と違う服を着て鏡で見る" },
      { level: 2, when: "明日", where: "近所のコンビニで", what: "少しだけ普段と違う格好で買い物する" },
      { level: 3, when: "今週中", where: "知り合いの前で", what: "自分の趣味や好きなものを話す" },
      { level: 4, when: "来週", where: "グループの会話で", what: "多数派と違う意見を言ってみる" },
      { level: 5, when: "2週間以内", where: "人が多い場所で", what: "少し目立つ行動をしてみる（大きな声で店員を呼ぶなど）" }
    ],
    introText: "他人の評価への過度な恐怖を克服しましょう。どう思われても大丈夫だと脳に学習させます。",
    quizContext: "他人からの評価に関する不安"
  }
]

// テーマIDからテーマを取得
export const getThemeById = (id: string): ExposeTheme | undefined => {
  return exposeThemes.find(theme => theme.id === id)
}

// デフォルトテーマを取得（テーマが指定されていない場合）
export const getDefaultTheme = (): ExposeTheme => {
  return {
    id: "general",
    name: "不安・恐怖全般",
    description: "あなたが感じている不安や恐怖に向き合います",
    icon: "🌿",
    color: "from-lime-400 to-green-500",
    discomfortExamples: [
      "特定の状況で不安になること",
      "避けている行動があること",
      "恐怖を感じる場面があること",
      "緊張して動けなくなること",
      "不安で日常生活に支障が出ること"
    ],
    levelExamples: [
      { level: 1, when: "今日", where: "安全な場所で", what: "恐怖の対象について考える" },
      { level: 2, when: "明日", where: "自宅で", what: "恐怖の対象の写真や動画を見る" },
      { level: 3, when: "今週中", where: "外出先で", what: "恐怖の対象に少しだけ近づく" },
      { level: 4, when: "来週", where: "実際の場面で", what: "短時間だけ恐怖の状況に身を置く" },
      { level: 5, when: "2週間以内", where: "実際の場面で", what: "恐怖の状況に長く身を置く" }
    ],
    introText: "あなたが感じている不安や恐怖に段階的に向き合いましょう。",
    quizContext: "不安や恐怖"
  }
}
