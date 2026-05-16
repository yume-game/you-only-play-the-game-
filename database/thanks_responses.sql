-- thanks_responsesテーブルの作成
-- thanks.tsx（感謝ゲーム）で使用されるクイズ回答データ保存用テーブル

CREATE TABLE thanks_responses (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT,
  session_id TEXT,
  total_points INTEGER NOT NULL DEFAULT 0,
  selected_values JSONB DEFAULT '[]'::jsonb,
  action_plans JSONB DEFAULT '[]'::jsonb,
  gender TEXT,
  age_group TEXT,
  enjoyment_rating INTEGER CHECK (enjoyment_rating >= 1 AND enjoyment_rating <= 10),
  improvement_rating INTEGER CHECK (improvement_rating >= 1 AND improvement_rating <= 10)
);

/*
Step 2: インデックス作成（別々に実行）
以下を1つずつ実行してください：

CREATE INDEX idx_thanks_responses_created_at ON thanks_responses(created_at DESC);
CREATE INDEX idx_thanks_responses_user_id ON thanks_responses(user_id);
CREATE INDEX idx_thanks_responses_session_id ON thanks_responses(session_id);
CREATE INDEX idx_thanks_responses_total_points ON thanks_responses(total_points);
CREATE INDEX idx_thanks_responses_gender ON thanks_responses(gender);
CREATE INDEX idx_thanks_responses_age_group ON thanks_responses(age_group);
*/

/*
Step 3: 関数とトリガー作成（別々に実行）

CREATE OR REPLACE FUNCTION update_thanks_responses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_thanks_responses_updated_at
    BEFORE UPDATE ON thanks_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_thanks_responses_updated_at();
*/

/*
Step 4: RLS設定（別々に実行）

ALTER TABLE thanks_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON thanks_responses FOR INSERT WITH CHECK (true);
-- SELECTポリシーは付与しない。anon keyで全件読み取りを防ぐため。
*/

-- テーブルとカラムのコメント
COMMENT ON TABLE thanks_responses IS 'thanks.tsx（感謝ゲーム）の回答データを保存するテーブル';
COMMENT ON COLUMN thanks_responses.id IS '主キー（自動採番）';
COMMENT ON COLUMN thanks_responses.created_at IS 'レコード作成日時';
COMMENT ON COLUMN thanks_responses.updated_at IS 'レコード更新日時';
COMMENT ON COLUMN thanks_responses.user_id IS 'ユーザー識別ID（localStorage）';
COMMENT ON COLUMN thanks_responses.session_id IS 'セッション識別ID';
COMMENT ON COLUMN thanks_responses.total_points IS '獲得した合計ポイント';
COMMENT ON COLUMN thanks_responses.selected_values IS '選択された価値観（JSONB配列）';
COMMENT ON COLUMN thanks_responses.action_plans IS '行動プラン（JSONB配列）';
COMMENT ON COLUMN thanks_responses.gender IS '性別';
COMMENT ON COLUMN thanks_responses.age_group IS '年代';
COMMENT ON COLUMN thanks_responses.enjoyment_rating IS 'ゲームの楽しさ評価（1-10）';
COMMENT ON COLUMN thanks_responses.improvement_rating IS 'ゲームの改善効果評価（1-10）';

-- ============================================================
-- affiliate_clicksテーブル（全ゲーム共通）
-- selfworthrelative.tsx等で既に使用されているテーブル
-- thanks, selfworth, その他全てのゲームのアフィリエイトデータをここに保存
-- ============================================================

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT,
  session_id TEXT,
  game_name TEXT NOT NULL,
  gender TEXT,
  age_group TEXT,
  enjoyment_rating INTEGER CHECK (enjoyment_rating >= 1 AND enjoyment_rating <= 10),
  improvement_rating INTEGER CHECK (improvement_rating >= 1 AND improvement_rating <= 10),
  affiliate_clicked BOOLEAN NOT NULL DEFAULT false,
  affiliate_pattern_index INTEGER DEFAULT 0
);

/*
Step 5: affiliate_clicksテーブルのインデックス作成（別々に実行）

CREATE INDEX idx_affiliate_clicks_created_at ON affiliate_clicks(created_at DESC);
CREATE INDEX idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);
CREATE INDEX idx_affiliate_clicks_session_id ON affiliate_clicks(session_id);
CREATE INDEX idx_affiliate_clicks_game_name ON affiliate_clicks(game_name);
CREATE INDEX idx_affiliate_clicks_affiliate_clicked ON affiliate_clicks(affiliate_clicked);
*/

/*
Step 6: affiliate_clicksテーブルのRLS設定（別々に実行）

ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON affiliate_clicks FOR INSERT WITH CHECK (true);
-- SELECTポリシーは付与しない。anon keyで全件読み取りを防ぐため。
*/

-- テーブルとカラムのコメント
COMMENT ON TABLE affiliate_clicks IS 'アフィリエイトクリック追跡用テーブル（全ゲーム共通）';
COMMENT ON COLUMN affiliate_clicks.id IS '主キー（自動採番）';
COMMENT ON COLUMN affiliate_clicks.created_at IS 'レコード作成日時';
COMMENT ON COLUMN affiliate_clicks.user_id IS 'ユーザー識別ID';
COMMENT ON COLUMN affiliate_clicks.session_id IS 'セッション識別ID';
COMMENT ON COLUMN affiliate_clicks.game_name IS 'ゲーム名（thanks, selfworth, selfworthrelative等）';
COMMENT ON COLUMN affiliate_clicks.gender IS '性別';
COMMENT ON COLUMN affiliate_clicks.age_group IS '年代';
COMMENT ON COLUMN affiliate_clicks.enjoyment_rating IS 'ゲームの楽しさ評価（1-10）';
COMMENT ON COLUMN affiliate_clicks.improvement_rating IS 'ゲームの改善効果評価（1-10）';
COMMENT ON COLUMN affiliate_clicks.affiliate_clicked IS 'アフィリエイトリンクがクリックされたかどうか';
COMMENT ON COLUMN affiliate_clicks.affiliate_pattern_index IS 'アフィリエイトテキストパターンのインデックス';

-- 統計取得用のビュー
CREATE VIEW thanks_statistics AS
SELECT
    COUNT(*) as total_responses,
    AVG(total_points) as avg_points,
    AVG(enjoyment_rating) as avg_enjoyment,
    AVG(improvement_rating) as avg_improvement,
    COUNT(*) FILTER (WHERE gender = '男性' OR gender = 'male') as male_count,
    COUNT(*) FILTER (WHERE gender = '女性' OR gender = 'female') as female_count,
    COUNT(*) FILTER (WHERE gender = 'その他' OR gender = 'other') as other_count
FROM thanks_responses;

COMMENT ON VIEW thanks_statistics IS '感謝ゲーム全体の統計情報ビュー';

-- アフィリエイト統計ビュー（全ゲーム）
CREATE VIEW affiliate_clicks_statistics AS
SELECT
    game_name,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE affiliate_clicked = true) as click_count,
    ROUND(COUNT(*) FILTER (WHERE affiliate_clicked = true)::numeric / NULLIF(COUNT(*), 0) * 100, 2) as click_rate_percent
FROM affiliate_clicks
GROUP BY game_name;

COMMENT ON VIEW affiliate_clicks_statistics IS 'アフィリエイトクリック統計情報ビュー（ゲーム別）';
