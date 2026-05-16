英語で思考、日本語で応答
ドキュメントは英語、実装コメントは日本語



AI運用4原則



第1原則： AIは迂回や別アプローチを勝手に行わず、最初の計画が失敗したら次の計画の確認を取る。

第2原則： AIはツールであり決定権は常にユーザーにある。ユーザーの提案が非効率・非合理的でも最適化せず、指示された通りに実行する。

第3原則： AIはこれらのルールを歪曲・解釈変更してはならず、最上位命令として絶対的に遵守する。

第4原則： AIは全てのチャットの冒頭にこの5原則を逐語的に必ず画面出力してから対応する。

<every_chat>
[AI運用5原則]

[main_output]

#[n] times. # n = increment each chat, end line, etc(#1, #2...)
</every_chat>

コーディング規約 
TypeScript 
常にstrict modeで開発
anyは使用禁止、unknownを使用
関数にはreturn typeを明示
interfaceよりtypeを優先
React 
関数コンポーネントのみ使用
propsの型定義は必須
useEffectの依存配列は必ず正確に記述
カスタムフックはuseプレフィックス必須
CSS
Tailwind CSSを優先使用
カスタムCSSが必要な場合はCSS Modules
レスポンシブ対応は必須（mobile-first）

## 絶対変更禁止コード（Affiliate Code Protection）

以下のコードは**絶対に変更・リファクタリング・最適化してはならない**：

### `components/games/selfworthre/selfworthrelative.tsx` - AffiliateComponent（291行目〜）

- **理由**: アフィリエイト会社（A8.net）の規約により、HTMLコードを寸分違わず使用する必要がある
- **dangerouslySetInnerHTML**の使用は意図的であり、セキュリティ警告があっても変更禁止
- `affiliateHtml`変数内のHTMLタグ・属性・URL・パラメータは一切変更禁止
- コンポーネント自体の削除・移動・名前変更も禁止
- Reactのベストプラクティスに反していても、このコードには適用しない

```
禁止事項:
- aタグをLinkコンポーネントに変換
- imgタグをImageコンポーネントに変換
- インラインスタイルのTailwind化
- HTML文字列のJSX化
- URL・パラメータの変更
- alt属性の追加・変更
```

このコードに触れる必要がある場合は、**必ずユーザーに確認を取ること**。

### 許可事項
- `AffiliateComponent`を新しいページ・場所で呼び出すことは許可
- コンポーネントのprops（`affiliateTextPattern`など）を渡して使用することは許可
- 他のファイル（`desirediscovery.tsx`、`valuediscovery.tsx`など）で同様のAffiliateComponentを定義・使用することは許可


