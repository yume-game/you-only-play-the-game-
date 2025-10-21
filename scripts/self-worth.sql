  -- 
  quiz_responsesテーブルの作成     
  CREATE TABLE quiz_responses (    
      id BIGSERIAL PRIMARY KEY,    
      created_at TIMESTAMPTZ       
  DEFAULT NOW(),
      total_points INTEGER NOT     
  NULL,
      affiliate_pattern_index      
  INTEGER NOT NULL,
      affiliate_clicked BOOLEAN    
   NOT NULL DEFAULT false,
      affiliate_click_type TEXT    
   NOT NULL DEFAULT 'unknown',     
      selected_values JSONB,       
      action_plans JSONB,
      structured_answers JSONB     
  );

  -- インデックスの追加（パフォ    
  ーマンス向上のため）
  CREATE INDEX
  idx_quiz_responses_created_at    
   ON quiz_responses
  (created_at);
  CREATE INDEX idx_quiz_respons    
  es_total_points ON
  quiz_responses
  (total_points);
  CREATE INDEX idx_quiz_respons    
  es_affiliate_clicked ON
  quiz_responses
  (affiliate_clicked);

  -- Row Level Security (RLS)      
  の有効化
  ALTER TABLE quiz_responses       
  ENABLE ROW LEVEL SECURITY;       

  -- 匿名ユーザーがデータを挿入    
  できるポリシー
  CREATE POLICY "Allow
  anonymous insert" ON
  quiz_responses
      FOR INSERT
      TO anon
      WITH CHECK (true);

  -- 必要に応じて、管理者が全デ    
  ータを見られるポリシー
  CREATE POLICY "Allow
  authenticated read" ON
  quiz_responses
      FOR SELECT
      TO authenticated
      USING (true);