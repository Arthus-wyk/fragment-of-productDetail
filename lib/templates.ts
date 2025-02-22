import templates from './templates.json'

export default templates
export type Templates = typeof templates
export type TemplateId = keyof typeof templates
export type TemplateConfig = typeof templates[TemplateId]

export function templatesToPrompt(templates: Templates) {
  return `${Object.entries(templates).map(([id, t], index) => `${index + 1}. ${id}: "${t.instructions}". File: ${t.file || 'none'}. Dependencies installed: ${t.lib.join(', ')}. Port: ${t.port || 'none'}.`).join('\n')}`
}
export const htmlTemplate = (backgroundColor:string|undefined) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>
        // generate title here
      </title>
      <!-- 引入 Tailwind CSS -->
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="${backgroundColor && backgroundColor}">
      <div class="container mx-auto p-4">
         
      </div>
      
      <script>
        // generate code here
      </script>
    </body>
  </html>
`;

export const originalLayout=(backgroundColor:string|undefined) =>
 `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>经典左图右文布局</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${backgroundColor && backgroundColor} min-h-screen flex items-center justify-center">
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- 左侧图片骨架 -->
      <div class="md:w-1/2 bg-gray-200 h-64 md:h-auto animate-pulse">
        <!-- Image -->
      </div>

      <!-- 右侧内容骨架 -->
      <div class="p-6 md:w-1/2 space-y-4">
        <div class="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div class="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>
    </div>
  </div>
</body>
</html>
`
export const splitLayout=(backgroundColor:string|undefined) =>
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>分屏布局</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${backgroundColor && backgroundColor} min-h-screen flex items-center justify-center">
  <div class="container mx-auto p-4">
    <!-- 顶部大图 -->
    <div class="bg-gray-200 h-64 rounded-lg animate-pulse"></div>

    <!-- 下方内容 -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 左侧内容 -->
      <div class="space-y-4">
        <div class="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>

      <!-- 右侧购买信息 -->
      <div class="space-y-4">
        <div class="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>
    </div>
  </div>
</body>
</html>
`
export const verticalLayout=(backgroundColor:string|undefined) =>`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>图片轮播布局</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${backgroundColor && backgroundColor} min-h-screen flex items-center justify-center">
  <div class="container mx-auto p-4">
    <!-- 图片轮播骨架 -->
    <div class="bg-gray-200 h-64 rounded-lg animate-pulse"></div>

    <!-- 商品详情 -->
    <div class="mt-6 bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div class="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div class="h-12 bg-gray-200 rounded animate-pulse"></div>
      <div class="h-10 bg-gray-200 rounded w-1/4 animate-pulse"></div>
    </div>
  </div>
</body>
</html>
`
export const fullScreenLayout=(backgroundColor:string|undefined) =>`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>全屏布局</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${backgroundColor && backgroundColor}">
  <div class="min-h-screen flex">
    <!-- 左侧图片区域 -->
    <div class="flex-1 bg-gray-200 animate-pulse"></div>

    <!-- 右侧内容区域 -->
    <div class="w-full lg:w-1/3 bg-white shadow-lg p-6 flex flex-col justify-between">
      <!-- 商品信息骨架 -->
      <div class="space-y-4">
        <div class="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div class="h-12 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <!-- 固定的购买按钮 -->
      <div class="mt-6">
        <button class="h-12 bg-blue-500 text-white rounded w-full animate-pulse"></button>
      </div>
    </div>
  </div>
</body>
</html>
`