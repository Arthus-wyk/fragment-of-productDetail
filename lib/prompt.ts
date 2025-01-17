import { htmlTemplate, Templates } from '@/lib/templates'
export function toPrompt() {
  return `
    You are a skilled software engineer.
    You do not make mistakes.
    Generate an fragment.
    You can use one of the following templates:
    ${htmlTemplate}
  `
}
