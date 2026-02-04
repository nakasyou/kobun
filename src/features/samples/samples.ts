import type { ClassicalSample } from '../../shared/types'

const parsedModules = import.meta.glob('../../assets/parsed/*.json', { eager: true })
const SAMPLES: ClassicalSample[] = Object.entries(parsedModules)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([, module]) => (module as { default: ClassicalSample }).default)

const FALLBACK_SAMPLE: ClassicalSample = {
  text: 'corpus/*.txt を追加して解析 JSON を生成してください。',
  source: 'サンプルなし',
  tokens: [],
}

export const getInitialSample = () => {
  if (SAMPLES.length === 0) return FALLBACK_SAMPLE
  return SAMPLES[Math.floor(Math.random() * SAMPLES.length)]
}

export const pickRandomSample = (currentText: string) => {
  if (SAMPLES.length === 0) return FALLBACK_SAMPLE
  const candidates = SAMPLES.filter((sample) => sample.text !== currentText)
  const pool = candidates.length > 0 ? candidates : SAMPLES
  return pool[Math.floor(Math.random() * pool.length)]
}
