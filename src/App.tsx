import { For, createSignal } from 'solid-js'
import './App.css'

type MorphToken = {
  surface: string
  base: string
  pos: string
  reading: string
}

type ClassicalSample = {
  text: string
  source: string
  tokens: MorphToken[]
}

const SAMPLES: ClassicalSample[] = [
  {
    text: 'いづれの御時にか、女御更衣あまた候ひ給ひける中に、',
    source: '『源氏物語』桐壺',
    tokens: [
      { surface: 'いづれ', base: 'いづれ', pos: '代名詞', reading: 'イズレ' },
      { surface: 'の', base: 'の', pos: '格助詞', reading: 'ノ' },
      { surface: '御時', base: '御時', pos: '名詞', reading: 'オントキ' },
      { surface: 'に', base: 'に', pos: '格助詞', reading: 'ニ' },
      { surface: 'か', base: 'か', pos: '係助詞', reading: 'カ' },
      { surface: '女御', base: '女御', pos: '名詞', reading: 'ニョゴ' },
      { surface: '更衣', base: '更衣', pos: '名詞', reading: 'コウイ' },
      { surface: 'あまた', base: 'あまた', pos: '副詞', reading: 'アマタ' },
      { surface: '候ひ', base: '候ふ', pos: '動詞', reading: 'ソウライ' },
      { surface: '給ひ', base: '給ふ', pos: '動詞', reading: 'タマイ' },
      { surface: 'ける', base: 'けり', pos: '助動詞', reading: 'ケル' },
      { surface: '中', base: '中', pos: '名詞', reading: 'ナカ' },
      { surface: 'に', base: 'に', pos: '格助詞', reading: 'ニ' },
    ],
  },
  {
    text: '祇園精舎の鐘の声、諸行無常の響きあり。',
    source: '『平家物語』',
    tokens: [
      { surface: '祇園精舎', base: '祇園精舎', pos: '名詞', reading: 'ギオンショウジャ' },
      { surface: 'の', base: 'の', pos: '格助詞', reading: 'ノ' },
      { surface: '鐘', base: '鐘', pos: '名詞', reading: 'カネ' },
      { surface: 'の', base: 'の', pos: '格助詞', reading: 'ノ' },
      { surface: '声', base: '声', pos: '名詞', reading: 'コエ' },
      { surface: '、', base: '、', pos: '記号', reading: '、' },
      { surface: '諸行無常', base: '諸行無常', pos: '名詞', reading: 'ショギョウムジョウ' },
      { surface: 'の', base: 'の', pos: '格助詞', reading: 'ノ' },
      { surface: '響き', base: '響き', pos: '名詞', reading: 'ヒビキ' },
      { surface: 'あり', base: 'あり', pos: '動詞', reading: 'アリ' },
      { surface: '。', base: '。', pos: '記号', reading: '。' },
    ],
  },
  {
    text: '春はあけぼの。やうやう白くなりゆく山ぎは、',
    source: '『枕草子』',
    tokens: [
      { surface: '春', base: '春', pos: '名詞', reading: 'ハル' },
      { surface: 'は', base: 'は', pos: '係助詞', reading: 'ハ' },
      { surface: 'あけぼの', base: 'あけぼの', pos: '名詞', reading: 'アケボノ' },
      { surface: '。', base: '。', pos: '記号', reading: '。' },
      { surface: 'やうやう', base: 'やうやう', pos: '副詞', reading: 'ヨウヨウ' },
      { surface: '白く', base: '白し', pos: '形容詞', reading: 'シロク' },
      { surface: 'なり', base: 'なる', pos: '動詞', reading: 'ナリ' },
      { surface: 'ゆく', base: 'ゆく', pos: '動詞', reading: 'ユク' },
      { surface: '山ぎは', base: '山ぎは', pos: '名詞', reading: 'ヤマギワ' },
      { surface: '、', base: '、', pos: '記号', reading: '、' },
    ],
  },
  {
    text: '徒然なるままに、日くらし硯にむかひて、',
    source: '『徒然草』',
    tokens: [
      { surface: '徒然', base: '徒然', pos: '名詞', reading: 'ツレヅレ' },
      { surface: 'なる', base: 'なり', pos: '助動詞', reading: 'ナル' },
      { surface: 'ままに', base: 'ままに', pos: '副詞', reading: 'ママニ' },
      { surface: '、', base: '、', pos: '記号', reading: '、' },
      { surface: '日', base: '日', pos: '名詞', reading: 'ヒ' },
      { surface: 'くらし', base: 'くらす', pos: '動詞', reading: 'クラシ' },
      { surface: '硯', base: '硯', pos: '名詞', reading: 'スズリ' },
      { surface: 'に', base: 'に', pos: '格助詞', reading: 'ニ' },
      { surface: 'むかひて', base: 'むかふ', pos: '動詞', reading: 'ムカイテ' },
      { surface: '、', base: '、', pos: '記号', reading: '、' },
    ],
  },
]

const pickRandomSample = (currentText: string) => {
  const candidates = SAMPLES.filter((sample) => sample.text !== currentText)
  const pool = candidates.length > 0 ? candidates : SAMPLES
  return pool[Math.floor(Math.random() * pool.length)]
}

function App() {
  const [sample, setSample] = createSignal(SAMPLES[0])

  const handleRandomize = () => {
    setSample((current) => pickRandomSample(current.text))
  }

  return (
    <div class="min-h-screen bg-slate-50 text-slate-900">
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <header class="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-pink-50 to-indigo-100 px-8 py-10 shadow-xl">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            古文ミニツール
          </p>
          <h1 class="text-3xl font-bold text-slate-900 sm:text-4xl">
            ランダム古文の形態素解析
          </h1>
          <p class="max-w-2xl text-base leading-relaxed text-slate-700">
            クリックするたびに、古文の一節をランダムに選び、表形式で形態素の情報を表示します。
          </p>
          <button
            class="w-fit rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            type="button"
            onClick={handleRandomize}
          >
            ランダムに解析
          </button>
        </header>

        <main class="grid gap-8 lg:grid-cols-2 lg:items-start">
          <section class="flex flex-col gap-4 rounded-3xl bg-white p-7 shadow-lg shadow-slate-200">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  本文
                </p>
                <p class="mt-2 text-lg leading-relaxed text-slate-800">
                  {sample().text}
                </p>
              </div>
              <span class="w-fit rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold text-indigo-600">
                {sample().source}
              </span>
            </div>
            <div class="text-sm text-slate-500">
              トークン数: {sample().tokens.length}
            </div>
          </section>

          <section class="rounded-3xl bg-white p-7 shadow-lg shadow-slate-200">
            <div class="mb-4 flex flex-col gap-2">
              <h2 class="text-xl font-semibold text-slate-900">形態素解析結果</h2>
              <p class="text-sm text-slate-500">
                表層形・原形・品詞・読みを一覧で確認できます。
              </p>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-[520px] w-full border-collapse text-left text-sm">
                <thead class="bg-slate-50 text-slate-500">
                  <tr>
                    <th class="border-b border-slate-200 px-4 py-3 font-semibold">
                      表層形
                    </th>
                    <th class="border-b border-slate-200 px-4 py-3 font-semibold">
                      原形
                    </th>
                    <th class="border-b border-slate-200 px-4 py-3 font-semibold">
                      品詞
                    </th>
                    <th class="border-b border-slate-200 px-4 py-3 font-semibold">
                      読み
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={sample().tokens}>
                    {(token) => (
                      <tr class="even:bg-slate-50">
                        <td class="border-b border-slate-100 px-4 py-3">
                          {token.surface}
                        </td>
                        <td class="border-b border-slate-100 px-4 py-3">
                          {token.base}
                        </td>
                        <td class="border-b border-slate-100 px-4 py-3">
                          {token.pos}
                        </td>
                        <td class="border-b border-slate-100 px-4 py-3">
                          {token.reading}
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
