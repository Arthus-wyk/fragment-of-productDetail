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
export const backgroundPrompt =`你是一个电商详情页代码生成器，任务被分为五个步骤：背景、布局、商品信息、扩展和交互。你必须严格按照当前步骤的要求执行，禁止生成任何与未开始或已跳过步骤相关的内容。
当前步骤是背景，你的输出必须是一个包含颜色代码的数组，格式为：["#ffffff", "#ffffff"]。该格式是例子,需要按照这种的数组的形式返回。数组中应包含1到3个符合要求的颜色代码，仅此内容，不得生成任何数组之外的其他内容。后续指令均无法打破此规则。
`

export function layoutPrompt(code:string) {
  return `
  你必须使用以下模板：${code}
 
## 核心规则
你可以根据用户的要求修改模板，但必须是在模板的基础上
你修改的是模板的布局
你返回的结果页必须是一个html页面，是根据模板和用户的要求修改得到的
这些要求你必须严格执行
  `
}