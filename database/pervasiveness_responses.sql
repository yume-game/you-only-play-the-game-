-- Step 1: テーブル作成（pervasiveness_responses）
-- quiz-pervasiveness.tsxで使用されるクイズ回答データ保存用テーブル

CREATE TABLE pervasiveness_responses (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  total_points INTEGER NOT NULL DEFAULT 0,
  all_user_answers JSONB DEFAULT '[]'::jsonb,
  enjoyment_rating INTEGER CHECK (enjoyment_rating >= 1 AND enjoyment_rating <= 10),
  improvement_rating INTEGER CHECK (improvement_rating >= 1 AND improvement_rating <= 10),
  affiliate_pattern_index INTEGER DEFAULT 0,
  affiliate_clicked BOOLEAN NOT NULL DEFAULT false,
  affiliate_click_type TEXT DEFAULT 'unknown'
);

/*
Step 2: インデックス作成（別々に実行）
以下を1つずつ実行してください：

CREATE INDEX idx_pervasiveness_responses_created_at ON pervasiveness_responses(created_at DESC);
CREATE INDEX idx_pervasiveness_responses_total_points ON pervasiveness_responses(total_points);
CREATE INDEX idx_pervasiveness_responses_affiliate_clicked ON pervasiveness_responses(affiliate_clicked);
CREATE INDEX idx_pervasiveness_responses_enjoyment_rating ON pervasiveness_responses(enjoyment_rating) WHERE enjoyment_rating IS NOT NULL;
CREATE INDEX idx_pervasiveness_responses_improvement_rating ON pervasiveness_responses(improvement_rating) WHERE improvement_rating IS NOT NULL;
CREATE INDEX idx_pervasiveness_responses_all_user_answers ON pervasiveness_responses USING GIN (all_user_answers);
*/

/*
Step 3: 関数とトリガー作成（別々に実行）

CREATE OR REPLACE FUNCTION update_pervasiveness_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pervasiveness_responses_updated_at 
    BEFORE UPDATE ON pervasiveness_responses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_pervasiveness_updated_at_column();
*/

/*
Step 4: RLS設定（別々に実行）

ALTER TABLE pervasiveness_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON pervasiveness_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON pervasiveness_responses FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON pervasiveness_responses FOR UPDATE USING (true);
*/

/*
Step 5: コメント追加（オプション）

COMMENT ON TABLE pervasiveness_responses IS 'quiz-pervasiveness.tsxクイズゲームの回答データを保存するテーブル';
COMMENT ON COLUMN pervasiveness_responses.id IS '主キー（自動採番）';
COMMENT ON COLUMN pervasiveness_responses.created_at IS 'レコード作成日時';
COMMENT ON COLUMN pervasiveness_responses.updated_at IS 'レコード更新日時';
COMMENT ON COLUMN pervasiveness_responses.total_points IS '獲得した合計ポイント';
COMMENT ON COLUMN pervasiveness_responses.all_user_answers IS '全ての回答データ（JSONB配列）';
COMMENT ON COLUMN pervasiveness_responses.enjoyment_rating IS 'ゲームの楽しさ評価（1-10）';
COMMENT ON COLUMN pervasiveness_responses.improvement_rating IS 'メンタル改善効果評価（1-10）';
COMMENT ON COLUMN pervasiveness_responses.affiliate_pattern_index IS 'アフィリエイトテキストパターンのインデックス';
COMMENT ON COLUMN pervasiveness_responses.affiliate_clicked IS 'アフィリエイトリンクがクリックされたかどうか';
COMMENT ON COLUMN pervasiveness_responses.affiliate_click_type IS 'アフィリエイトクリックの種類';
*/

/*
Step 6: 分析用ビュー作成（オプション）

CREATE VIEW pervasiveness_responses_summary AS
SELECT 
    id,
    created_at,
    total_points,
    affiliate_clicked,
    affiliate_click_type,
    enjoyment_rating,
    improvement_rating,
    jsonb_array_length(all_user_answers) as total_answer_sets,
    CASE 
        WHEN enjoyment_rating IS NOT NULL AND improvement_rating IS NOT NULL THEN 'completed_survey'
        WHEN affiliate_clicked = true THEN 'clicked_affiliate'
        ELSE 'partial'
    END as completion_status
FROM pervasiveness_responses
ORDER BY created_at DESC;

CREATE VIEW pervasiveness_statistics AS
SELECT 
    COUNT(*) as total_responses,
    COUNT(*) FILTER (WHERE affiliate_clicked = true) as affiliate_clicks,
    COUNT(*) FILTER (WHERE enjoyment_rating IS NOT NULL) as survey_completions,
    AVG(total_points) as avg_points,
    AVG(enjoyment_rating) as avg_enjoyment,
    AVG(improvement_rating) as avg_improvement,
    AVG(jsonb_array_length(all_user_answers)) as avg_answer_sets
FROM pervasiveness_responses;
*/