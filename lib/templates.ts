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
