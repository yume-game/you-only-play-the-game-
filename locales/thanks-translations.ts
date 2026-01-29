export const thanksTranslations = {
  ja: {
    // IntroPage
    intro_title: "ポジティブに生きるための感謝をするゲーム",
    intro_subtitle: "あなたの世界のないマスではなくプラスを見えるようにするために感謝が有効です。",
    intro_description: "1問30秒です。直感で答えてみましょう！ではいってらっしゃい！（※完全無料です。）",
    intro_privacy: "あなたを守るため、個人情報は入力しないでください。　ex 　佐々木君がではなく　ｓ君がとしましょう。",
    intro_terms: "利用規約",
    intro_agree: "同意する",
    intro_start: "スタート",
    intro_loading: "ゲームを読み込み中...",
    intro_checking_device: "デバイスを確認中...",

    // QuizPage
    quiz_question: "人生のすべてにおいて、感謝していることを書いてください",
    quiz_answer_placeholder: "回答",
    quiz_answer_button: "回答\nする",
    quiz_answer_button_golden: "回答\nする\n(+300pt)",
    quiz_complete_button: "感謝しきった。（次のステージへ）",
    quiz_complete_button_moving: "移動中...",
    quiz_end_button: "終える",
    quiz_help_button: "ヘルプ",
    quiz_help_title: "ヘルプ",
    quiz_help_content: "本気を出せばイスなどにも感謝できます",
    quiz_help_close: "閉じる",
    quiz_problem: "問題",
    quiz_time_remaining: "残り時間:",
    quiz_seconds: "秒",
    quiz_target_points: "目標700pt",

    // ResultPage
    result_title: "あなたの価値観診断結果",
    result_total_points: "合計ポイント",
    result_average_points: "全国平均",
    result_share_message: "★yumeのゲーム　　スクショしてSNSに投稿しよう！★",
    result_selected_values_title: "💎 あなたが選んだ価値観",
    result_action_plan_title: "🎯 あなたの行動プラン",
    result_action_plan_when: "いつ:",
    result_action_plan_action: "行動:",
    result_action_plan_why: "なぜ:",
    result_action_plan_not_entered: "未入力",
    result_restart_button: "もう一度診断する",
    result_exit_button: "終了",
    result_affiliate_headline: "{headline}",

    // Common
    points: "pt",
  },
  en: {
    // IntroPage
    intro_title: "Gratitude Game for Positive Living",
    intro_subtitle: "Gratitude is effective in making you see the positives rather than the negatives in your world.",
    intro_description: "30 seconds per question. Answer intuitively! Let's go! (*Completely free.)",
    intro_privacy: "To protect you, please don't enter personal information. e.g., Use 'Mr. S' instead of 'Mr. Sasaki'.",
    intro_terms: "Terms of Service",
    intro_agree: "Agree",
    intro_start: "Start",
    intro_loading: "Loading game...",
    intro_checking_device: "Checking device...",

    // QuizPage
    quiz_question: "Write what you are grateful for in all aspects of life",
    quiz_answer_placeholder: "Answer",
    quiz_answer_button: "Submit\nAnswer",
    quiz_answer_button_golden: "Submit\nAnswer\n(+300pts)",
    quiz_complete_button: "Finished expressing gratitude. (Next Stage)",
    quiz_complete_button_moving: "Moving...",
    quiz_end_button: "End",
    quiz_help_button: "Help",
    quiz_help_title: "Help",
    quiz_help_content: "If you really try, you can even be grateful for chairs and such",
    quiz_help_close: "Close",
    quiz_problem: "Question",
    quiz_time_remaining: "Time Remaining:",
    quiz_seconds: "sec",
    quiz_target_points: "Target 700pts",

    // ResultPage
    result_title: "Your Values Assessment Results",
    result_total_points: "Total Points",
    result_average_points: "National Average",
    result_share_message: "★yume's Game　　Screenshot and share on social media!★",
    result_selected_values_title: "💎 Your Selected Values",
    result_action_plan_title: "🎯 Your Action Plan",
    result_action_plan_when: "When:",
    result_action_plan_action: "Action:",
    result_action_plan_why: "Why:",
    result_action_plan_not_entered: "Not entered",
    result_restart_button: "Take Assessment Again",
    result_exit_button: "Exit",
    result_affiliate_headline: "{headline}",

    // Common
    points: "pts",
  },
}

export type ThanksTranslationKey = keyof typeof thanksTranslations.ja
