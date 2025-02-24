'use client'

import { FragmentInterpreter } from './fragment-interpreter'
import { FragmentWeb } from './fragment-web'
import { ExecutionResult } from '@/lib/types'

export function FragmentPreview({ result }: { result: ExecutionResult|undefined}) {
  return <FragmentWeb result={result} />
}
