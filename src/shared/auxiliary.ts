import { normalizeBase } from './text'
import type { MorphToken } from './types'

const AUX_MEANINGS: Record<string, string[]> = {
  き: ['過去'],
  けり: ['過去', '詠嘆'],
  つ: ['完了', '強意'],
  ぬ: ['完了', '強意'],
  たり: ['完了', '存続'],
  り: ['存続'],
  ず: ['打消'],
  じ: ['打消推量', '打消意志'],
  まじ: ['打消推量', '打消意志', '不可能', '禁止'],
  べし: ['推量', '意志', '可能', '当然', '命令', '適当'],
  む: ['推量', '意志', '勧誘', '仮定'],
  らむ: ['現在推量', '原因推量', '伝聞'],
  らし: ['推定'],
  けむ: ['過去推量', '原因推量', '伝聞'],
  まし: ['反実仮想', 'ためらい'],
  まほし: ['願望'],
  たし: ['希望'],
  なり: ['断定', '伝聞', '推定'],
  めり: ['推定', '婉曲'],
}

const AUX_MEANING_EXTRAS = ['である', '〜である']

export const AUX_MEANING_SUGGESTIONS = Array.from(
  new Set([
    ...Object.values(AUX_MEANINGS).flat(),
    ...AUX_MEANING_EXTRAS,
  ]),
)

export const extractMeaningHints = (token: MorphToken) => {
  const base = normalizeBase(token.base)
  const tag = token.base.includes('-') ? token.base.split('-')[1] : ''
  if (tag) {
    if (tag === '断定') return ['断定', 'である', '〜である']
    if (tag === '伝聞') return ['伝聞']
    if (tag === '推定') return ['推定']
  }
  return AUX_MEANINGS[base] ?? []
}
