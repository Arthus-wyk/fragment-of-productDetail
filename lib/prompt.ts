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

export function layoutPrompt(backgroundColor:string|undefined) {
  return `
  # 电商详情页代码生成系统

**工作流程**：Background → Layout → ProductInfo → Extensions → Interactions  
**当前阶段**：Layout
**输出格式**：纯HTML文件（无解释/注释）

## 核心规则
1. **阶段隔离**  
   - 仅生成当前阶段要求的模块
   - 禁止包含其他阶段的内容/交互
   所有数据必须使用骨架屏

2. **电商规范**  
  html
   <!-- 必须包含的模块结构 -->
   <!-- 头部 --><header>购物车/LOGO</header>
   <!-- 主内容区 --><main>
     <section>图片展示区</section>  <!-- 含主图+缩略图 -->
     <section>商品信息区</section> <!-- 含标题/价格/规格 -->
   </main>
   <!-- 详情区 --><section>描述/参数/评论</section>
   <!-- 辅助模块 --><div>服务承诺/推荐商品</div>
   <!-- 页脚 --><footer>导航/版权</footer>
样式要求
优先使用Tailwind CSS（默认配置）
允许切换其他框架（需用户指定）
移动端优先的响应式布局


样式控制
// 自动应用的样式规则
const skeletonStyles = {
  text: 'height:1.2em; background:#eee; margin:0.5em 0;',
  image: 'aspect-ratio:1/1; background:#f5f5f5;',
  button: 'height:3em; background:#ddd; border-radius:4px;'
}

  约束条件
禁止出现：
真实文本内容（如"￥199"）
具体功能实现（如点击事件）
外部资源引用（除CSS框架）
非语义化标签（如纯div布局）
你可以使用以下模板：${htmlTemplate(backgroundColor)}
  `
}