# データベースセットアップ手順

## SQLファイル概要

1. **quiz_responses.sql** - selfworth.tsx用のテーブル
2. **pervasiveness_responses.sql** - quiz-pervasiveness.tsx用のテーブル

## 実行順序

### 1. selfworth.tsx用テーブル作成

#### Step 1: テーブル作成
```sql
-- quiz_responses.sqlの最初の部分を実行
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
```

#### Step 2: インデックス作成（1つずつ実行）
```sql
CREATE INDEX idx_quiz_responses_created_at ON quiz_responses(created_at DESC);
CREATE INDEX idx_quiz_responses_total_points ON quiz_responses(total_points);  
CREATE INDEX idx_quiz_responses_affiliate_clicked ON quiz_responses(affiliate_clicked);
CREATE INDEX idx_quiz_responses_completion_count ON quiz_responses(quiz_completion_count);
CREATE INDEX idx_quiz_responses_enjoyment_rating ON quiz_responses(enjoyment_rating) WHERE enjoyment_rating IS NOT NULL;
CREATE INDEX idx_quiz_responses_improvement_rating ON quiz_responses(improvement_rating) WHERE improvement_rating IS NOT NULL;
CREATE INDEX idx_quiz_responses_user_answers ON quiz_responses USING GIN (user_answers);
```

### 2. quiz-pervasiveness.tsx用テーブル作成

#### Step 1: テーブル作成
```sql
-- pervasiveness_responses.sqlの最初の部分を実行
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
```

#### Step 2: インデックス作成（1つずつ実行）
```sql
CREATE INDEX idx_pervasiveness_responses_created_at ON pervasiveness_responses(created_at DESC);
CREATE INDEX idx_pervasiveness_responses_total_points ON pervasiveness_responses(total_points);
CREATE INDEX idx_pervasiveness_responses_affiliate_clicked ON pervasiveness_responses(affiliate_clicked);
CREATE INDEX idx_pervasiveness_responses_enjoyment_rating ON pervasiveness_responses(enjoyment_rating) WHERE enjoyment_rating IS NOT NULL;
CREATE INDEX idx_pervasiveness_responses_improvement_rating ON pervasiveness_responses(improvement_rating) WHERE improvement_rating IS NOT NULL;
CREATE INDEX idx_pervasiveness_responses_all_user_answers ON pervasiveness_responses USING GIN (all_user_answers);
```

## データ構造の違い

### quiz_responses（selfworth.tsx用）
- `user_answers` - 「欲求が見つかった」ボタン押下時の回答データ
- アフィリエイトクリック時とアンケート完了時にデータ保存

### pervasiveness_responses（quiz-pervasiveness.tsx用）  
- `all_user_answers` - 全ての問題の回答データ
- アンケート完了時に基本データ保存、アフィリエイトクリック時に更新

## 注意事項

1. **構文エラー回避**: 各SQLブロックを段階的に実行
2. **権限設定**: 本番環境ではRLSポリシーを適切に設定
3. **インデックス**: 大量データがある場合は非ピーク時に作成推奨