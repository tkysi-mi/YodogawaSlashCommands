# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## リポジトリの目的

Windsurfで活用するスラッシュコマンドとワークフローの保管庫。開発ライフサイクル全般（調査・要件定義・設計・実装・テスト・Git運用）を対象としたMarkdownベースのワークフロー定義を蓄積し、他プロジェクトでも即座に呼び出せるナレッジベースを構築する。

## アーキテクチャ概要

### ディレクトリ構造

- `.windsurf/workflows/` — Windsurfスラッシュコマンドの実体。各Markdownファイルがコマンド定義になる
- `.windsurf/templates/` — 再利用可能なテンプレート（システム概要テンプレートなど）
- `slash-commands-best-practices.md` — ワークフロー作成の設計原則・セキュリティ・運用ガイドライン

### ワークフロー体系

開発フェーズごとに番号付きのワークフローを定義：

1. `/dev-1-plan-intake` — 依頼内容の収集と関係者合意
2. `/dev-2-planning` — PRD作成とアーキテクチャ設計
3. `/dev-3-system-design` — 詳細システム設計
4. `/dev-4-task-authoring` — Storyファイル作成とタスク化
5. `/dev-5-implementation` — 実装・テスト・PR作成
6. `/dev-6-commit-message` — コミットメッセージ生成
7. `/dev-7-swarm-qa` — マルチエージェントQA

加えて、`/create-workflow` が新規ワークフロー追加の標準手順を提供。

### 設計哲学

- **Markdown中心**: 実行可能コードは含めず、Windsurfのコマンド参照に特化
- **コンテキスト最適化**: 12,000文字制限を意識し、長文資料は`@path/to/file.md`形式で参照
- **チェイン構築**: ワークフロー間で`Call /workflow-name`により連携可能な粒度で分割
- **BMAD Method適用**: Analyst/PM/Architect/Devなど多層エージェント計画の考え方を反映
- **Claude-Flowスキル活用**: pair-programming、agentdb-vector-searchなど外部スキルの組み込み前提

## ワークフロー作成の基本手順

新規ワークフローを追加する際は、`@slash-commands-best-practices.md`の原則に従う：

1. **命名規約**: `.windsurf/workflows/`配下に用途が即座に想起できる短いスラッグ（例: `build-and-test.md`）
2. **セクション構成**: 目的 / 前提 / 手順 / 完了条件 / エスカレーション
3. **YAML frontmatterは使用しない**: Markdown本文のみで完結
4. **ステップ記法**: 番号付きまたは箇条書きで明示、分岐は「IF ... THEN ...」、反復は「FOR EACH ...」
5. **依存ワークフロー**: 他ワークフローを呼ぶ場合は`Call /workflow-name`と明記
6. **コンテキスト節約**: 長文は`@path/to/doc.md`参照、ワークフロー本文は必要最小限に

詳細は `/create-workflow` を実行するか `@slash-commands-best-practices.md` を参照。

## ワークフロー実行の前提条件

- Windsurfの`code_search`/`read_file`権限が適切に設定されていること
- 関連ドキュメント（PRD、設計書、チケット）が最新であること
- Git環境およびローカルテスト環境が整備されていること
- Memories/Rulesで危険なコマンド実行権限が適切に制限されていること

## 主要ファイルの役割

- `README.md` — リポジトリの使い方と更新ポリシー
- `slash-commands-best-practices.md` — ワークフロー設計のベストプラクティス集。公式ドキュメントとCursor/Claude Codeの知見を統合
- `.windsurf/templates/system-description-template.md` — PRD作成時のテンプレート（プロダクト概要・業務要件・機能要件・画面遷移・テストケース）

## 運用方針

- **DRY原則**: 重複・冗長な情報は統合し、参照形式で再利用
- **継続改善**: 実行後のフィードバックを定期的に反映し、ワークフロー品質を向上
- **セキュリティ**: Memories/Rulesで権限管理、監査ログ記録、レート制御を徹底
- **ドキュメント整備**: READMEに新規ワークフロー概要を追記し、チームへ周知

## Git運用

- ブランチ戦略は各プロジェクトのポリシーに従う（trunk-based推奨）
- コミットメッセージにはStory IDまたは課題番号を含める
- PR作成時はテンプレートを利用し、変更概要/テスト結果/影響範囲を明記

## 参考リンク

- Windsurf公式: https://docs.windsurf.com/windsurf/cascade/workflows
- Claude Code公式: https://docs.claude.com/en/docs/claude-code/slash-commands
- BMAD Method / Claude-Flow関連資料は各ワークフロー内で適宜参照
