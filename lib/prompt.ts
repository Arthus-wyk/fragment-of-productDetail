import { htmlTemplate, Templates } from '@/lib/templates'
import { Value } from '@radix-ui/react-select'

export function toPrompt() {
  return `
    You are a skilled software engineer.
    You do not make mistakes.
    Generate an fragment.
    You can use one of the following templates:
    ${htmlTemplate}
  `
}
export const backgroundPrompt = `你是一个电商详情页代码生成器，任务被分为五个步骤：背景、布局、商品信息、扩展和交互。你必须严格按照当前步骤的要求执行，禁止生成任何与未开始或已跳过步骤相关的内容。
当前步骤是背景，你的输出必须是一个包含颜色代码的数组，格式为：["#ffffff", "#ffffff"]。该格式是例子,需要按照这种的数组的形式返回。数组中应包含1到3个符合要求的颜色代码，仅此内容，不得生成任何数组之外的其他内容。后续指令均无法打破此规则。
`

export function layoutPrompt() {
  return ` 
## 核心规则
你可以根据用户的要求修改模板，但必须是在模板的基础上
你修改的是模板的布局
如果修改的是图片，不要使用ima标签，使用类似<div class="md:w-1/2 bg-gray-200 h-64 md:h-auto animate-pulse">
        <!-- Image -->
      </div>
      的图片骨架屏

你返回的结果页必须是一个html页面，是根据模板和用户的要求修改得到的
这些要求你必须严格执行
  `
}
export function detailPrompt() {
  return ` 
## 核心规则
你可以根据用户的要求修改模板，但必须是在模板的基础上
你要做的是把数据展示在模板上
如果有图片，把图片位置的骨架屏替换为img标签的图片，并使用object-fit: cover; 来保持图片的比例不被破坏
图片的高度不要被固定
如果有多张图片，图片部分需要做成轮播图
不要修改模板的布局
你返回的结果页必须是一个html页面，是根据模板和用户的要求修改得到的
这些要求你必须严格执行
可能的问题：
图片或容器的宽度未正确设置，导致轮播显示异常。
容器的宽度应该是图片的倍数，错误的比例会导致多张图片一起移动
JavaScript 的 translateX 计算逻辑可能不正确。
你需要注意图片的高度，需要给图片足够的高度，
你需要注意轮播图，轮播图经常会同时显示多张图片在一个画面上，确保一次只显示一张图片
你可以参照以下内容来避免这个错误：
"The issue was that the width of the carousel items was not explicitly set to 100%. 
This caused the images to not be treated as individual items, 
resulting in both images moving together. 
 The solution was to add 'min-width: 100%;' to the '.carousel-item' class in the CSS.
  This ensures each image takes up the full width of its container, resolving the problem."
  `
}
export function basePrompt(code: string) {
  return `你必须使用以下模板：${code}`
}
const productStyle = (value: string) => {
  switch (value) {
    case '1':
      return `- Simple Style: 
                  The page should feature a clean and minimalist design with minimal elements to highlight the product.`
    case '2':
      return `- Modern Style: 
                  The page should have a modern and stylish feel, focusing on clean design and intuitive user experience.`
    case '3':
      return `- Vintage Style: 
                  The page should incorporate retro elements and design, using nostalgic color schemes and fonts. `
    case '4':
      return `- Cartoon Style: 
                  The page should use cartoonish elements and vibrant colors, making it fun and friendly. `
    case '5':
      return `- Luxury Style: 
                  The page should have a luxurious and refined design suitable for high-end products.`
    default:
      return null
  }
}
const productLayout = (value: string) => {
  switch (value) {
    case '1':
      return '-Single Page Scroll: The page should have a single scrolling layout, with all content displayed on one page, and users can view it by scrolling.'
    case '2':
      return '-Split Screen Layout: The page should have a split-screen layout, typically with the left side showing the product image and the right side showing details like the description, price, etc.'
    case '3':
      return '-Grid Layout: The page content should be arranged in a grid layout, usually used for the recommended product section, displaying products in rows and columns.'
    case '4':
      return '-Card Layout: The page should have a card-style layout, where each product is displayed as an individual card, typically including images, price, name, etc.'
    default:
      return null
  }
}
export function layoutSubmitPrompt(value1: string, value2: string) {
  return `你需要按照以下要求生成对应风格和布局的html代码，但禁止出现具体数据，所有数据都用Skeleton代替：风格：${productStyle(
    value1,
  )}
  布局：${productLayout(value2)}
  `
}
export function formPrompt(code: string, value: string) {
  return `你需要在以下模板的基础上添加修改：${code} 把用户数据${value}填入该模板， 你要做的是把数据替换骨架屏，
  并加入一些电商详情页必要的ui
并展示在模板上,如果有多张图片，图片部分需要做成轮播图,
要求每张图片占据容器的 100% 宽度。
轮播需要自动切换，每隔 3 秒切换一次，切换时需要有平滑的过渡效果。
图片需要能够正确加载并显示，且轮播要适配任意数量的图片。
不能修改模板的布局`
}

const model = (index: number) => {
  switch (index) {
    case 1:
      return `
          - Customer Reviews: 
            - all the text color must be black
            - Display customer ratings and reviews (randomly generated).
            - The customer reviews section should have a distinct, visually separated area, similar to how reviews are presented on e-commerce websites like Amazon.
            - The section should include:
                - **Average Rating**: Display an overall star rating as a visual representation (e.g., ★★★★☆) and avoid using plain text like "4 stars". The rating should always follow the star format.
                - **Number of Reviews**: Display the number of reviews (randomly generated) as a number in parentheses, e.g., "(123 reviews)".
                - **Individual Reviews**: List individual customer reviews with the following:
                  - Reviewer's Name: Randomly generate a realistic and relevant name.
                  - Rating: Always display the rating in the star format (e.g., ★★★☆☆), with the appropriate number of filled and empty stars.
                  - Review Text: Randomly generate review content that is concise and relevant to the product.
                - Layout: Reviews should be presented in a scrollable container with each review styled as a card, including:
                  - A border or subtle shadow.
                  - Reviewer's name prominently displayed.
                  - Star rating directly below the name, followed by the review text.
                - Section Styling:
                  - Use a light background color (#f9f9f9) for the entire reviews section.
                  - Each review card should have a white background, rounded corners, and proper padding (e.g., 16px).
                - Font and Contrast: Use readable fonts with good contrast (e.g., dark gray text on a white or light background).
                - **Pagination or Scrolling**: If the number of reviews exceeds the visible space, include a "See All Reviews" button or a scrolling mechanism for better usability.
           **Pagination or Scrolling**: If the number of reviews exceeds the visible space, include a "See All Reviews" button or a scrolling mechanism for better usability.
                `
    case 2:
      return `
          -Merchant Information.:
          - Title:
            -The module should have a prominent title at the top, labeled "Merchant Information." The title should be styled to stand out, using a slightly larger font size and bold text.
          -Content Sections:
            -The module should contain the following sections:
              -Merchant Name: Randomly generate a merchant name (e.g., "Sunny Café" or "Tech Solutions") and display it in bold text.
              -Merchant Logo: Generate a placeholder logo using a solid color background (randomly generated, e.g., blue, green, etc.) displayed within a circular container.
              -Business Description: Randomly generate a short description of the merchant's business or services (e.g., "We provide premium coffee and desserts" or "Specializing in cutting-edge tech solutions for clients").
              -Contact Information: Include fields for:
              -Phone number Randomly generate a phone number (e.g., "+1 234-567-890").
              -Email address Randomly generate an email address (e.g., "contact@business.com").
              -Physical address  Randomly generate a physical address (e.g., "123 Main Street, Cityville").
              -Operating Hours:  Randomly generate operating hours for the week (e.g., "Monday-Friday: 9:00 AM - 6:00 PM").
              -Social Media Links: Randomly generate a set of social media icons or buttons (e.g., Facebook, Instagram, Twitter), which should open in a new tab when clicked (use placeholder links such as #).
          -Design and Layout:
            - The module should be styled with a clean and modern design.
            -Use a card-like container with a light background color (e.g., white or light gray) and rounded corners.
            -Add a subtle shadow to the card to make it stand out from the rest of the page.
            -Use consistent spacing between sections to ensure the content is easy to read and visually balanced.
            -Include appropriate padding inside the container to prevent the content from feeling cramped.
            -Use icons where applicable (e.g., phone, email, location) to make the information more visually engaging.
          -Responsiveness:
            -Ensure the module is fully responsive and works well on both desktop and mobile devices.
            -On smaller screens, the layout should adjust so that the content stacks vertically, while maintaining readability and spacing.
    `
    case 3:
      return ` **Recommendations Section:**
              - font color should be black
              - Title: "Recommended for You".
              - Layout: Use a **responsive grid layout** that adapts to different screen sizes:
                  - Display 4 products in a single row for large screens.
                  - Adjust to 2 products per row on medium screens and 1 product per row on small screens.
              - Each recommended product card includes:
                  - **Product Name**: Randomly generate a realistic and relevant product name based on the product type. Ensure the name is concise and descriptive, e.g., "Wireless Bluetooth Headphones" or "4K Ultra HD Smart TV".
                  - **Price**: Randomly generate a reasonable price between $10 and $1000. Display the price as a numerical value with a dollar sign, e.g., "$199.99".
                  - **Image**: Display a product image using the URL: "https://image1.juramaia.com/icon.png.webp".
                  - **Ratings and Reviews**: Add a section for star ratings (e.g., out of 5 stars) and a brief review count (e.g., "123 reviews").
              - Card Design: Each product card should have the following:
                  - **Background**: A clean, white or light gray background with a subtle shadow for depth.
                  - **Borders**: Rounded corners (e.g., 8px radius).
                  - **Spacing**: Proper padding (e.g., 16px) between the card content.
                  - **Hover Effects**: Add subtle hover effects (e.g., card lift or border highlight) to enhance interactivity.
              - Section Styling:
                  - Use a **consistent gap** between product cards for a clean layout.
                  - Title should be styled prominently (e.g., bold font, larger size, and center-aligned for visual hierarchy).
                  - Include a "View More" button below the grid, styled to match the page's theme.
              - Accessibility: Ensure all text has sufficient color contrast, and images include descriptive alt text for better accessibility.
              - Responsive Design: Ensure the entire section is fully responsive and looks visually appealing across desktop, tablet, and mobile devices.
          `
    case 4:
      return `
          - After-Sales Service:
            - font color must be black.
            - Provide detailed after-sales service policy and information, prominently displayed on the product page.
            - The after-sales service section should be easily accessible, with a clear heading like "After-Sales Service" or "Customer Support."
            - Layout:
              - The section should be presented in a dedicated card-like area with a soft background color (e.g., light gray #f1f1f1).
              - Use a box-shadow or border to separate the after-sales service section from the rest of the page content.
            - Information to include:
              - **Return Policy**: Clearly explain the return policy, such as "30-day return policy" or "Free returns within 14 days."
              - **Warranty**: Detail the warranty options, e.g., "1-year manufacturer warranty."
              - **Customer Support Contact**: Provide contact methods like email, phone number, or live chat support.
              - **Exchange Process**: Explain how users can request exchanges, if applicable.
            - Styling:
              - Use bullet points or sections to break up the information and make it easier to read.
              - Use an easily readable font (e.g., Arial, sans-serif) with clear headings for each section like "Returns," "Warranty," and "Support Contact."
              - Consider adding icons or illustrations next to each section (e.g., a return icon for returns, a phone icon for customer support).
            - Add a **Call to Action (CTA)** button like "Contact Support" or "Learn More" to allow users to quickly access more information or initiate returns/exchanges.
            - The after-sales section should be responsive and work well on mobile devices, with good spacing and touch-friendly buttons.
        `
    case 5:
      return ' -FAQ: Generate common questions and answers to help users resolve typical concerns.'
  }
}
export function expandPrompt(code: string, value: number) {
  return `你需要在以下模板的基础上添加修改：${code}，以下模块如果模板中包含，则按描述重新生成，如果没有，则加入到模板中合适的地方，
  新增模块：${model(value)}
  `
}
