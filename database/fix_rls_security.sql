-- ============================================================
-- RLSセキュリティ修正マイグレーション
-- 問題: "Allow public select" USING (true) により
--       anon keyを持つ誰でも全ユーザーデータを読み取れる
--       "Allow public update" USING (true) により
--       pervasivenessの任意行を上書きできる
-- ============================================================

-- SELECTポリシー削除（実際に存在するテーブルのみ）
DROP POLICY IF EXISTS "Allow public select" ON quiz_responses_v2;
DROP POLICY IF EXISTS "Allow public select" ON quiz_responses_v3;
DROP POLICY IF EXISTS "Allow public select" ON pervasiveness_responses_v2;
DROP POLICY IF EXISTS "Allow public select" ON thanks_responses;
DROP POLICY IF EXISTS "Allow public select" ON affiliate_clicks;
DROP POLICY IF EXISTS "Allow public select" ON expose_responses;
DROP POLICY IF EXISTS "Allow public select" ON logic_game_responses_v2;

-- UPDATEポリシー削除（pervasivenessはINSERTに変更したため不要）
DROP POLICY IF EXISTS "Allow public update" ON pervasiveness_responses_v2;

-- 確認用（実行後にSELECT/UPDATEが残っていないことを確認）
-- SELECT schemaname, tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public';
