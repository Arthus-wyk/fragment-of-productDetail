import { TemplateId } from './templates'
import { ExecutionError, Result } from '@e2b/code-interpreter'

type ExecutionResultBase = {
  sbxId: string
}

export type ExecutionResultInterpreter = ExecutionResultBase & {
  template: 'code-interpreter-v1'
  stdout: string[]
  stderr: string[]
  runtimeError?: ExecutionError
  cellResults: Result[]
}
export type questionQuery={
  byAI:'0'|'1'
  name?:string
  price?:string
  pic?:string[]
  desc?:string
  spec?:string
  content:string[]
  style:string
  layout:string
  interactive:string[]
}

export type ExecutionResultWeb = {
  code: string
}

export type ExecutionResult = ExecutionResultWeb
