-- Step 1: テーブル作成（quiz_responses）
-- selfworth.tsxで使用されるクイズ回答データ保存用テーブル

CREATE TABLE quiz_responses (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  total_points INTEGER NOT NULL DEFAULT 0,
  affiliate_pattern_index INTEGER NOT NULL DEFAULT 0,
  affiliate_clicked BOOLEAN NOT NULL DEFAULT false,
  affiliate_click_type TEXT DEFAULT 'unknown',
  user_answers JSONB DEFAULT '[]'::jsonb,
  enjoyment_rating INTEGER CHECK (enjoyment_rating >= 1 AND enjoyment_rating <= 10),
  improvement_rating INTEGER CHECK (improvement_rating >= 1 AND improvement_rating <= 10),
  quiz_completion_count INTEGER GENERATED ALWAYS AS (jsonb_array_length(user_answers)) STORED
);

/*
Step 2: インデックス作成（別々に実行）
以下を1つずつ実行してください：

CREATE INDEX idx_quiz_responses_created_at ON quiz_responses(created_at DESC);
CREATE INDEX idx_quiz_responses_total_points ON quiz_responses(total_points);  
CREATE INDEX idx_quiz_responses_affiliate_clicked ON quiz_responses(affiliate_clicked);
CREATE INDEX idx_quiz_responses_completion_count ON quiz_responses(quiz_completion_count);
CREATE INDEX idx_quiz_responses_enjoyment_rating ON quiz_responses(enjoyment_rating) WHERE enjoyment_rating IS NOT NULL;
CREATE INDEX idx_quiz_responses_improvement_rating ON quiz_responses(improvement_rating) WHERE improvement_rating IS NOT NULL;
CREATE INDEX idx_quiz_responses_user_answers ON quiz_responses USING GIN (user_answers);
*/

/*
Step 3: 関数とトリガー作成（別々に実行）

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quiz_responses_updated_at 
    BEFORE UPDATE ON quiz_responses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
*/

/*
Step 4: RLS設定（別々に実行）

ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON quiz_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON quiz_responses FOR SELECT USING (true);
*/

-- テーブルとカラムのコメント
COMMENT ON TABLE quiz_responses IS 'selfworth.tsxクイズゲームの回答データを保存するテーブル';
COMMENT ON COLUMN quiz_responses.id IS '主キー（自動採番）';
COMMENT ON COLUMN quiz_responses.created_at IS 'レコード作成日時';
COMMENT ON COLUMN quiz_responses.updated_at IS 'レコード更新日時';
COMMENT ON COLUMN quiz_responses.total_points IS '獲得した合計ポイント';
COMMENT ON COLUMN quiz_responses.affiliate_pattern_index IS 'アフィリエイトテキストパターンのインデックス';
COMMENT ON COLUMN quiz_responses.affiliate_clicked IS 'アフィリエイトリンクがクリックされたかどうか';
COMMENT ON COLUMN quiz_responses.affiliate_click_type IS 'アフィリエイトクリックの種類（survey_completion/unknown等）';
COMMENT ON COLUMN quiz_responses.user_answers IS '「欲求が見つかった」ボタンを押したときの解答内容（JSONB配列）';
COMMENT ON COLUMN quiz_responses.enjoyment_rating IS 'ゲームの楽しさ評価（1-10）アンケート完了時のみ設定';
COMMENT ON COLUMN quiz_responses.improvement_rating IS 'ゲームの改善効果評価（1-10）アンケート完了時のみ設定';
COMMENT ON COLUMN quiz_responses.quiz_completion_count IS '完了した問題数（user_answersの配列長から自動計算）';

-- 分析用のビュー（オプション）
CREATE VIEW quiz_responses_summary AS
SELECT 
    id,
    created_at,
    total_points,
    affiliate_clicked,
    affiliate_click_type,
    enjoyment_rating,
    improvement_rating,
    quiz_completion_count,
    jsonb_array_length(user_answers) as answer_sets_count,
    CASE 
        WHEN enjoyment_rating IS NOT NULL AND improvement_rating IS NOT NULL THEN 'completed_survey'
        WHEN affiliate_clicked = true THEN 'clicked_affiliate'
        ELSE 'partial'
    END as completion_status
FROM quiz_responses
ORDER BY created_at DESC;

COMMENT ON VIEW quiz_responses_summary IS 'クイズ回答データのサマリービュー（分析用）';

-- 統計取得用のビュー（オプション）
CREATE VIEW quiz_statistics AS
SELECT 
    COUNT(*) as total_responses,
    COUNT(*) FILTER (WHERE affiliate_clicked = true) as affiliate_clicks,
    COUNT(*) FILTER (WHERE enjoyment_rating IS NOT NULL) as survey_completions,
    AVG(total_points) as avg_points,
    AVG(enjoyment_rating) as avg_enjoyment,
    AVG(improvement_rating) as avg_improvement,
    AVG(quiz_completion_count) as avg_quiz_completion
FROM quiz_responses;

COMMENT ON VIEW quiz_statistics IS 'クイズゲーム全体の統計情報ビュー';