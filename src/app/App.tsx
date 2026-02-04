import { For, createMemo, createSignal } from 'solid-js'
import { getInitialSample, pickRandomSample } from '../features/samples/samples'
import AuxQuiz from '../features/quiz/AuxQuiz'
import type { ClassicalSample, MorphToken } from '../shared/types'
import './App.css'

type TokenSegment =
  | { kind: 'token'; token: MorphToken }
  | { kind: 'break' }

const buildTokenSegments = (sample: ClassicalSample): TokenSegment[] => {
  const segments: TokenSegment[] = []
  const { text, tokens } = sample
  let cursor = 0

  for (const token of tokens) {
    while (
      cursor < text.length &&
      (text[cursor] === '\n' || text[cursor] === '\r')
    ) {
      segments.push({ kind: 'break' })
      cursor += 1
    }
    segments.push({ kind: 'token', token })
    cursor += token.surface.length
  }

  while (cursor < text.length) {
    if (text[cursor] === '\n' || text[cursor] === '\r') {
      segments.push({ kind: 'break' })
    }
    cursor += 1
  }

  return segments
}

function App() {
  const [sample, setSample] = createSignal(getInitialSample())
  const [quizIndex, setQuizIndex] = createSignal(0)

  const auxTokens = createMemo(() =>
    sample().tokens.filter((token) => token.pos === '助動詞'),
  )
  const currentAux = createMemo(() => auxTokens()[quizIndex()] ?? null)
  const tokenSegments = createMemo(() => buildTokenSegments(sample()))

  const handleRandomize = () => {
    setSample(pickRandomSample(sample().text))
  }

  return (
    <div class="min-h-screen bg-slate-50 text-slate-900">
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <main class="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-start">
          <section class="flex flex-col gap-4 rounded-3xl bg-white p-7 shadow-lg shadow-slate-200">
            <div class="flex flex-col gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  本文
                </p>
                <p class="mt-2 text-lg leading-relaxed text-slate-800">
                  <For each={tokenSegments()}>
                    {(segment) =>
                      segment.kind === 'break' ? (
                        <br />
                      ) : (
                        <span
                          class={
                            segment.token === currentAux()
                              ? 'rounded bg-emerald-200 px-0.5 py-0.5 font-semibold text-emerald-900 shadow-sm shadow-emerald-200 ring-1 ring-emerald-300 transition-colors'
                              : 'transition-colors'
                          }
                          aria-current={
                            segment.token === currentAux() ? 'true' : undefined
                          }
                        >
                          {segment.token.surface}
                        </span>
                      )
                    }
                  </For>
                </p>
              </div>
            </div>
          </section>

          <AuxQuiz
            sample={sample()}
            onRandomize={handleRandomize}
            quizIndex={quizIndex}
            setQuizIndex={setQuizIndex}
          />
        </main>
      </div>
    </div>
  )
}

export default App
