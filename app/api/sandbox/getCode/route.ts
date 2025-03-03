import { FragmentSchema } from '@/lib/schema'
import { ExecutionResultInterpreter, ExecutionResultWeb } from '@/lib/types'
import { Sandbox } from '@e2b/code-interpreter'


export async function POST(req: Request) {
  const {
    fragment,
    userID,
    apiKey,
  }: { fragment: FragmentSchema; userID: string; apiKey?: string } =
    await req.json()
  
}
