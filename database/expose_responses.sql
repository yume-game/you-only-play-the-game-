-- expose_responsesテーブルの作成
-- expose.tsx（エクスポージャーゲーム）の全データを保存する統合テーブル

-- ============================================================
-- expose_responsesテーブル（全データ統合）
-- ============================================================

CREATE TABLE expose_responses (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- ユーザー情報
  user_id TEXT,
  session_id TEXT,
  gender TEXT,
  age_group TEXT,

  -- プロフィールデータ
  self_care_answer TEXT,
  valuable_things TEXT,
  why_answers JSONB DEFAULT '[]'::jsonb,
  strongest_desire_index INTEGER,
  strongest_desire_text TEXT,
  discomfort_origin TEXT,
  fear_description TEXT,

  -- 恐怖レベル測定
  pre_fear_level DECIMAL(4,1) CHECK (pre_fear_level >= 0 AND pre_fear_level <= 10),
  post_fear_level DECIMAL(4,1) CHECK (post_fear_level >= 0 AND post_fear_level <= 10),
  fear_change DECIMAL(4,1),
  recovery_rate INTEGER,

  -- ゲーム結果
  total_points INTEGER NOT NULL DEFAULT 0,
  action_plans JSONB DEFAULT '[]'::jsonb,
  enjoyment_rating INTEGER CHECK (enjoyment_rating >= 1 AND enjoyment_rating <= 10),
  improvement_rating INTEGER CHECK (improvement_rating >= 1 AND improvement_rating <= 10)
);

-- ============================================================
-- インデックス作成
-- ============================================================

CREATE INDEX idx_expose_responses_created_at ON expose_responses(created_at DESC);
CREATE INDEX idx_expose_responses_user_id ON expose_responses(user_id);
CREATE INDEX idx_expose_responses_session_id ON expose_responses(session_id);

-- ============================================================
-- RLS設定
-- ============================================================

ALTER TABLE expose_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON expose_responses FOR INSERT WITH CHECK (true);
-- SELECTポリシーは付与しない。anon keyで全件読み取りを防ぐため。

-- ============================================================
-- 更新トリガー
-- ============================================================

CREATE OR REPLACE FUNCTION update_expose_responses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_expose_responses_updated_at
    BEFORE UPDATE ON expose_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_expose_responses_updated_at();

-- ============================================================
-- テーブルとカラムのコメント
-- ============================================================

COMMENT ON TABLE expose_responses IS 'エクスポージャーゲームの全データを保存する統合テーブル';
COMMENT ON COLUMN expose_responses.id IS '主キー（自動採番）';
COMMENT ON COLUMN expose_responses.created_at IS 'レコード作成日時';
COMMENT ON COLUMN expose_responses.updated_at IS 'レコード更新日時';
COMMENT ON COLUMN expose_responses.user_id IS 'ユーザー識別ID';
COMMENT ON COLUMN expose_responses.session_id IS 'セッション識別ID';
COMMENT ON COLUMN expose_responses.gender IS '性別';
COMMENT ON COLUMN expose_responses.age_group IS '年代';
COMMENT ON COLUMN expose_responses.self_care_answer IS '自分を大切にする理由の回答';
COMMENT ON COLUMN expose_responses.valuable_things IS '大切なものの回答';
COMMENT ON COLUMN expose_responses.why_answers IS 'なぜ？の回答（JSONB配列、5つまで）';
COMMENT ON COLUMN expose_responses.strongest_desire_index IS '最も強い欲求のインデックス（1-5）';
COMMENT ON COLUMN expose_responses.strongest_desire_text IS '最も強い欲求のテキスト';
COMMENT ON COLUMN expose_responses.discomfort_origin IS '不快感の起源の回答';
COMMENT ON COLUMN expose_responses.fear_description IS '恐れているものの説明';
COMMENT ON COLUMN expose_responses.pre_fear_level IS 'エクスポージャー前の恐怖レベル（0-10）';
COMMENT ON COLUMN expose_responses.post_fear_level IS 'エクスポージャー後の恐怖レベル（0-10）';
COMMENT ON COLUMN expose_responses.fear_change IS '恐怖レベルの変化量（pre - post）';
COMMENT ON COLUMN expose_responses.recovery_rate IS '回復率（パーセント）';
COMMENT ON COLUMN expose_responses.total_points IS '獲得した合計ポイント';
COMMENT ON COLUMN expose_responses.action_plans IS '行動プラン（JSONB配列：いつ、どこで、何をする）';
COMMENT ON COLUMN expose_responses.enjoyment_rating IS 'ゲームの楽しさ評価（1-10）';
COMMENT ON COLUMN expose_responses.improvement_rating IS 'ゲームの改善効果評価（1-10）';

-- ============================================================
-- 統計取得用ビュー
-- ============================================================

CREATE VIEW expose_statistics AS
SELECT
    COUNT(*) as total_responses,
    AVG(total_points) as avg_points,
    AVG(enjoyment_rating) as avg_enjoyment,
    AVG(improvement_rating) as avg_improvement,
    AVG(pre_fear_level) as avg_pre_fear,
    AVG(post_fear_level) as avg_post_fear,
    AVG(fear_change) as avg_fear_reduction,
    AVG(recovery_rate) as avg_recovery_rate,
    COUNT(*) FILTER (WHERE fear_change > 0) as improved_count,
    COUNT(*) FILTER (WHERE gender = '男性' OR gender = 'male') as male_count,
    COUNT(*) FILTER (WHERE gender = '女性' OR gender = 'female') as female_count
FROM expose_responses;

COMMENT ON VIEW expose_statistics IS 'エクスポージャーゲーム全体の統計情報ビュー';
