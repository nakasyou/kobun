import { Show, createEffect, createSignal, type Accessor } from 'solid-js'
import {
  AUX_MEANING_SUGGESTIONS,
  extractMeaningHints,
} from '../../shared/auxiliary'
import { normalizeBase, normalizeInput, splitMeaningInput } from '../../shared/text'
import type { ClassicalSample } from '../../shared/types'

type AuxQuizProps = {
  sample: ClassicalSample
  onRandomize: () => void
  quizIndex: Accessor<number>
  setQuizIndex: (value: number) => void
}

function AuxQuiz(props: AuxQuizProps) {
  const [meaningInput, setMeaningInput] = createSignal('')
  const [baseInput, setBaseInput] = createSignal('')
  const [meaningCorrect, setMeaningCorrect] = createSignal(false)
  const [baseCorrect, setBaseCorrect] = createSignal(false)
  const [meaningIncorrect, setMeaningIncorrect] = createSignal(false)
  const [baseIncorrect, setBaseIncorrect] = createSignal(false)
  const [meaningAnswer, setMeaningAnswer] = createSignal('')
  const [baseAnswer, setBaseAnswer] = createSignal('')
  const [quizFeedback, setQuizFeedback] = createSignal('')
  const [isAutoAdvancing, setIsAutoAdvancing] = createSignal(false)
  let meaningInputRef!: HTMLInputElement
  let baseInputRef!: HTMLInputElement

  const auxTokens = () =>
    props.sample.tokens.filter((token) => token.pos === '助動詞')
  const currentAux = () => auxTokens()[props.quizIndex()] ?? null

  const resetQuiz = () => {
    props.setQuizIndex(0)
    setMeaningInput('')
    setBaseInput('')
    setMeaningCorrect(false)
    setBaseCorrect(false)
    setMeaningIncorrect(false)
    setBaseIncorrect(false)
    setMeaningAnswer('')
    setBaseAnswer('')
    setQuizFeedback('')
    setIsAutoAdvancing(false)
    queueMicrotask(() => {
      meaningInputRef?.focus()
    })
  }

  const advanceToNextSample = () => {
    if (isAutoAdvancing()) return
    setIsAutoAdvancing(true)
    props.onRandomize()
  }

  const advanceQuiz = () => {
    const nextIndex = props.quizIndex() + 1
    if (nextIndex >= auxTokens().length) {
      props.setQuizIndex(nextIndex)
      setMeaningInput('')
      setBaseInput('')
      setMeaningCorrect(false)
      setBaseCorrect(false)
      setMeaningIncorrect(false)
      setBaseIncorrect(false)
      setMeaningAnswer('')
      setBaseAnswer('')
      setQuizFeedback('全問正解！')
      queueMicrotask(() => {
        advanceToNextSample()
      })
      return
    }

    props.setQuizIndex(nextIndex)
    setMeaningInput('')
    setBaseInput('')
    setMeaningCorrect(false)
    setBaseCorrect(false)
    setMeaningIncorrect(false)
    setBaseIncorrect(false)
    setMeaningAnswer('')
    setBaseAnswer('')
    setQuizFeedback('正解！')
    queueMicrotask(() => {
      meaningInputRef?.focus()
    })
  }

  const handleMeaningCheck = () => {
    const target = currentAux()
    if (!target) return

    const meaningHints = extractMeaningHints(target)
    const meaningParts = splitMeaningInput(meaningInput())
    const meaningOk =
      meaningHints.length === 0 ||
      meaningHints.some((hint) =>
        meaningParts.includes(normalizeInput(hint)),
      )

    if (!meaningOk) {
      const meaningLabel =
        meaningHints.length > 0 ? meaningHints.join(' / ') : '（辞書未登録）'
      setMeaningCorrect(false)
      setMeaningIncorrect(true)
      setMeaningAnswer(meaningLabel)
      setQuizFeedback('意味: 不正解')
      return
    }

    setMeaningCorrect(true)
    setMeaningIncorrect(false)
    setMeaningAnswer('')
    if (baseCorrect()) {
      advanceQuiz()
      return
    }

    const message =
      meaningHints.length > 0
        ? '意味: 正解！原型を入力してください。'
        : '意味は辞書未登録のため判定をスキップしました。原型を入力してください。'
    setQuizFeedback(message)
    queueMicrotask(() => {
      baseInputRef?.focus()
    })
  }

  const handleBaseCheck = () => {
    const target = currentAux()
    if (!target) return

    const expectedBase = normalizeBase(target.base)
    const normalizedBase = normalizeInput(baseInput())
    const normalizedExpectedBase = normalizeInput(expectedBase)

    if (normalizedBase !== normalizedExpectedBase) {
      setBaseCorrect(false)
      setBaseIncorrect(true)
      setBaseAnswer(expectedBase)
      setQuizFeedback('原型: 不正解')
      return
    }

    setBaseCorrect(true)
    setBaseIncorrect(false)
    setBaseAnswer('')
    if (meaningCorrect()) {
      advanceQuiz()
      return
    }

    setQuizFeedback('原型: 正解！意味を入力してください。')
    queueMicrotask(() => {
      meaningInputRef?.focus()
    })
  }

  const handleMeaningKeyDown = (event: KeyboardEvent) => {
    if (event.isComposing || event.key !== 'Enter') return
    event.preventDefault()
    handleMeaningCheck()
  }

  const handleBaseKeyDown = (event: KeyboardEvent) => {
    if (event.isComposing || event.key !== 'Enter') return
    event.preventDefault()
    handleBaseCheck()
  }

  createEffect(() => {
    props.sample.text
    resetQuiz()
    if (auxTokens().length === 0 && props.sample.source !== 'サンプルなし') {
      queueMicrotask(() => {
        advanceToNextSample()
      })
    }
  })

  return (
    <section class="rounded-3xl bg-white p-7 shadow-lg shadow-slate-200">
      <div class="mb-4 flex flex-col gap-2">
        <h2 class="text-xl font-semibold text-slate-900">助動詞クイズ</h2>
        <p class="text-sm text-slate-500">
          文章中の助動詞について、意味と原型をそれぞれ Enter で判定します。
        </p>
      </div>
      <div class="rounded-2xl bg-emerald-50 px-5 py-4">
        <Show
          when={auxTokens().length > 0}
          fallback={
            <div class="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <p>この文章には助動詞が含まれていません。</p>
            </div>
          }
        >
          <div class="mt-4">
            <Show
              when={currentAux()}
              fallback={
                <div class="flex flex-col gap-3 text-sm text-slate-600">
                  <p>この文章の助動詞はすべて完了しました。</p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      class="rounded-full bg-white px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-200"
                      type="button"
                      onClick={resetQuiz}
                    >
                      もう一度
                    </button>
                  </div>
                </div>
              }
            >
              {(token) => (
                <div class="mt-3 flex flex-col gap-3">
                  <div class="text-sm text-slate-700">
                    {props.quizIndex() + 1} / {auxTokens().length} :
                    <span class="ml-2 rounded-full bg-white px-2 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                      {token().surface}
                    </span>
                  </div>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    意味
                    <input
                      class={`mt-1 rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none ${
                        meaningIncorrect()
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-emerald-200 focus:border-emerald-400'
                      }`}
                      value={meaningInput()}
                      onInput={(event) => {
                        setMeaningInput(event.currentTarget.value)
                        if (meaningCorrect()) setMeaningCorrect(false)
                      }}
                      onKeyDown={handleMeaningKeyDown}
                      placeholder="例: 過去 / 推定 など"
                      enterKeyHint="next"
                      list="meaning-suggestions"
                      ref={meaningInputRef}
                    />
                    <datalist id="meaning-suggestions">
                      {AUX_MEANING_SUGGESTIONS.map((suggestion) => (
                        <option value={suggestion} />
                      ))}
                    </datalist>
                    <Show when={meaningIncorrect()}>
                      <span class="text-[0.65rem] font-semibold text-red-500">
                        正解: {meaningAnswer()}
                      </span>
                    </Show>
                    <span class="text-[0.65rem] font-medium text-slate-400">
                      Enter で意味を判定
                    </span>
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    原型
                    <input
                      class={`mt-1 rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none ${
                        baseIncorrect()
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-emerald-200 focus:border-emerald-400'
                      }`}
                      value={baseInput()}
                      onInput={(event) => {
                        setBaseInput(event.currentTarget.value)
                        if (baseCorrect()) setBaseCorrect(false)
                      }}
                      onKeyDown={handleBaseKeyDown}
                      placeholder="例: けり / なり"
                      enterKeyHint="done"
                      ref={baseInputRef}
                    />
                    <Show when={baseIncorrect()}>
                      <span class="text-[0.65rem] font-semibold text-red-500">
                        正解: {baseAnswer()}
                      </span>
                    </Show>
                    <span class="text-[0.65rem] font-medium text-slate-400">
                      Enter で原型を判定
                    </span>
                  </label>
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      class="rounded-full bg-white px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-200"
                      type="button"
                      onClick={resetQuiz}
                    >
                      最初から
                    </button>
                  </div>
                  <Show when={quizFeedback()}>
                    <p class="text-xs font-semibold text-emerald-700">
                      {quizFeedback()}
                    </p>
                  </Show>
                </div>
              )}
            </Show>
          </div>
        </Show>
      </div>
    </section>
  )
}

export default AuxQuiz
