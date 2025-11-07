# Slashコマンド作成ベストプラクティス

## このドキュメントの目的

Windsurf専用のスラッシュコマンド／Cascadeワークフローを設計・保守する際の指針をまとめる。公式ドキュメントと実務知見を基軸にしつつ、CursorやClaude Codeのベストプラクティスは参考情報として取り込み、Windsurf向けに再解釈した内容を提供する。

## デザイン原則

- **短く記憶しやすい構文**: `/`に続く語は用途が即座に想起できる短いスラッグにする。[^cursor-blog]
- **コンテキスト予算の意識**: 余計なテキストを避け、必要最低限の指示・テンプレートを埋め込む。[^claude-doc]
- **ツール権限の明示**: 実行可能な外部ツールやCLIを明文化し、必要に応じてMemoriesやRulesで制限する。[^claude-doc]
- **チェイン構築を想定した分割**: 他のワークフロー／コマンドから呼び出しやすい粒度で分解する。[^windsurf-docs]
- **継続改善**: 作業後のフィードバックを取り込みテンプレート化し、チーム全体の品質を底上げする。[^paulduvall]

## コマンド設計

### ファイル配置と命名

- すべてのワークフローを`.windsurf/workflows/`配下に配置し、ファイル名がそのまま`/workflow-name`になる構造を徹底する。[^windsurf-docs]
- ファイルは1ワークフロー1Markdownとし、YAML frontmatterを使わずにタイトルと本文だけで完結させる。
- 命名は短いスラッグで揃え、`build-and-test`など連想しやすい語を採用する。[^cursor-blog]

### ステップ設計

- 各ステップは箇条書きで書き、Cascadeに期待するアクションと目的を明文化する。[^windsurf-docs]
- 分岐が必要な場合は「IF ... THEN ...」など自然言語で条件を記述し、曖昧な指示を避ける。
- 反復処理は「FOR EACH ...」など明確な繰り返し構文を用いて、Cascadeがステップを正しく繰り返せるようにする。[^claude-doc]

### 依存関係と再利用

- 他のワークフローを呼び出す場合はステップ内で`Call /workflow-name`と明確に記述する。[^windsurf-docs]
- 事前条件（リポジトリの状態、必要な環境変数など）はワークフロー冒頭で宣言し、実行前チェックを促す。[^paulduvall]
- 頻出タスクは専用ワークフローとして切り出し、複数ワークフローから呼び出すことで重複を排除する。[^cursor-blog]

### 情報参照とコンテキスト節約

- 長文ドキュメントや規約は`@README.md`のように参照パスで示し、必要時のみCascadeに展開させる。[^claude-doc]
- ステップは簡潔な文章でまとめ、12,000文字のワークフロー上限やCascadeのコンテキスト制限を超えないよう配慮する。[^windsurf-docs]

## UXとレスポンス設計

1. **エージェントへの指示精度**
   - 期待するステップ・禁止事項・検証指標を明記し、自由回答に頼らない。[^paulduvall]
2. **ツール実行と権限**
   - ステップ内で実行するCLIやMCPツールを明記し、必要に応じてMemories/Rulesで許可設定を行う。[^paulduvall][^claude-doc]
3. **コンテキスト管理**
   - ワークフロー全体で12,000文字制限があるため、ステップは短く保ち、詳細説明は別資料に切り出す。[^windsurf-docs]
   - 他IDEでも文字数制限が厳格な事例が報告されているため、ベストプラクティスとして簡潔さを維持する。[^claude-doc]
4. **エラーハンドリング**
   - 想定外の状況時にユーザーへエスカレーションする指示を含め、自己判断で危険な操作を続行しない。[^paulduvall]
   - 成功条件や完了報告フォーマットを定義し、アウトプットのばらつきを抑える。

## セキュリティと権限管理

- **権限管理**: WindsurfのMemories/Rulesで危険なコマンドの実行権限を役割ごとに制限する。[^paulduvall]
- **ツールホワイトリスト**: `allowed-tools`やRulesで許可されたツールのみ呼び出す設計にし、ワイルドカード許容は避ける。[^claude-doc]
- **監査ログ**: 実行者ID、コマンド文字列、入力引数、レスポンス結果を記録し、機密情報はマスクしたうえで改変有無を追跡可能にする。
- **レート制御**: 誤操作やDoSを防ぐため、連続実行制限やクールダウン設定を検討する。

## 運用・保守

1. **ドキュメント整備**
   - ワークフロー名称と起動コマンド、必要権限、参照するRulesをREADMEにまとめ、オンボーディングを短縮する。[^paulduvall]
2. **テストとモニタリング**
   - 単体テストでパラメータ解析、統合テストで外部依存を検証。
   - SLAとしてレスポンスタイムと成功率を計測し、逸脱時に通知する。
3. **ユーザーフィードバックループ**
   - コマンド内からフィードバックリンクを案内し、改善チケット化する。[^cursor-blog]
4. **テンプレート化**
   - ワークフロー作成時は共通テンプレート（目的、前提、手順、検証）を再利用しDRYを徹底。
5. **レビューとガバナンス**
   - コマンドの改修はコードレビューとセキュリティレビューを経てリリースし、変更履歴を残す。

## コマンド仕様テンプレート

```markdown
# /example の仕様

## 概要
- 目的: 説明文
- 利用者: 想定ロール

## 入力
- フォーマット: `/example <target> [--options]`
- バリデーション: 必須・任意項目、制約条件

## 処理
- 即時レスポンス: 成功時に返すメッセージ例
- 遅延レスポンス: response_urlで送信する追加情報

## 失敗時の対応
- 代表的なエラー: メッセージ / 再試行手順 / エスカレーション先

## 運用
- ログ出力: 含める項目
- 監視: SLA、警告閾値
```

## 実装前チェックリスト

- [ ] コマンド名／スラッグと目的が即座に理解できるか
- [ ] 説明・手順がコンテキスト上限内に収まっているか
- [ ] 必要なCLI/MCPツールとMemories/Rules上の権限要件を宣言しているか
- [ ] 依存するワークフローや参照ファイルを明示しているか
- [ ] エスカレーション指示と完了報告フォーマットを含んでいるか
- [ ] READMEやRulesに掲載し、チームへ周知済みか
- [ ] 最新のコード／セキュリティレビューを通過しているか

## 参考リンク（ベストプラクティス）

- Windsurf Docs: [Workflows](https://docs.windsurf.com/windsurf/cascade/workflows)
- Paul Duvall: [Using Windsurf Rules, Workflows, and Memories](https://www.paulmduvall.com/using-windsurf-rules-workflows-and-memories/)
- Eugeniusz Zabłocki: [Streamline Your Development Workflow with Cursor Slash Commands](https://ezablocki.com/posts/cursor-slash-commands/)
- egghead.io: [Speed Up Your Agents with Cursor Slash Commands](https://egghead.io/speed-up-your-agents-with-cursor-slash-commands~ze5ag)
- Claude Docs: [Slash commands](https://docs.claude.com/en/docs/claude-code/slash-commands)

[^windsurf-docs]: Windsurf Docs, "Workflows" (<https://docs.windsurf.com/windsurf/cascade/workflows>)
[^paulduvall]: Paul Duvall, "Using Windsurf Rules, Workflows, and Memories" (<https://www.paulmduvall.com/using-windsurf-rules-workflows-and-memories/>)
[^cursor-blog]: Eugeniusz Zabłocki, "Streamline Your Development Workflow with Cursor Slash Commands" (<https://ezablocki.com/posts/cursor-slash-commands/>)
[^claude-doc]: Claude Docs, "Slash commands" (<https://docs.claude.com/en/docs/claude-code/slash-commands>)
