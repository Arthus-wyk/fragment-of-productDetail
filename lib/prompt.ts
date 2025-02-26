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
                  页面应采用干净、简约的设计，以最少的元素突出产品。注重简洁、清晰的结构和留白，营造视觉平衡的布局。设计应引导用户将注意力集中在产品上，突出展示产品的图片、标题、价格和核心信息。
                  关键设计特点：
                  布局：
                  使用居中、单列布局，确保产品始终是视觉的焦点。
                  保持充分的内边距和外边距，以打造简洁且不杂乱的外观。
                  有策略地使用留白，将各部分内容分隔开，并避免视觉拥挤。
                  排版：
                  选择具有干净线条和中性调性的无衬线字体（例如 Helvetica、Arial 或 Open Sans）。
                  通过使用不同的字体大小区分产品标题、价格和描述，建立清晰的层次感。
                  保持文字简洁，避免使用不必要的装饰性元素。
                  避免使用可能分散注意力的渐变或图案。
                  产品焦点：
                  使用一个大尺寸、高质量的产品图片占位符作为主要的视觉焦点。
                  避免使用动画效果或过多干扰用户注意力的元素。
                  操作按钮：
                  按钮应使用高对比度的强调色（例如蓝色或橙色），在中性设计中突出显示。
                  响应式设计：
                  确保设计能够适应不同设备，包括桌面端、平板电脑和手机。
                  优先设计适合移动端的布局，提供大尺寸、适合触控的操作按钮。
                  可选功能：
                  在产品图片周围添加轻微的阴影或边框，以增强图片的层次感。
                  可选择在页面顶部添加一个面包屑导航或返回按钮，便于用户导航。
                  保持整体外观优雅且专业，确保每一个设计元素都能为突出产品服务。`
    case '2':
      return `- Modern Style: 
                  The page should have a modern and stylish feel, focusing on intuitive user experience, and visual appeal. Use bold typography, dynamic layouts, and a balanced color scheme to create an engaging and professional page that feels current and user-friendly.
                  Key Aspects:
                  Layout:
                  Create consistent spacing and alignment to enhance readability and navigation.
                  Include subtle transitions or animations to add a sense of interactivity without overwhelming the user.
                  Typography:
                  Use bold, modern fonts to draw attention to key elements like headlines, product names, and CTAs (call-to-actions).
                  Maintain a clear hierarchy using size, weight, and color to guide the user’s focus.
                  Visuals:
                  use dynamic placements to immediately grab attention.
                  User Experience:
                  Incorporate intuitive navigation (e.g., sticky menus, clear icons, or drop-down menus).
                  Design interactive elements like buttons, hover effects, and cards to feel responsive and seamless.
                  Call-to-Actions:
                  Use large, eye-catching buttons or minimalistic links for primary actions (e.g., "Buy Now," "Learn More").
                  Ensure all CTAs are strategically placed and easy to interact with.`
    case '3':
      return `- Vintage Style: 
                The page should incorporate retro elements and design, using nostalgic color schemes, fonts, and layouts inspired by past eras. Focus on creating a warm and inviting atmosphere that reflects classic aesthetics while maintaining functionality and clarity.
                Key Aspects:
                Color Scheme:
                Adopt a palette of muted or pastel tones, such as beige, sepia, olive green, mustard yellow, burgundy, or soft pink.
                Use subtle gradients or textures (e.g., paper texture, grain filter) to add a sense of time-worn charm.
                Typography:
                Opt for serif fonts or script fonts reminiscent of classic prints or handwritten text styles.
                Combine decorative headlines with clean, legible body text to balance vintage flair and readability.
                Visual Elements:
                Add subtle embellishments, such as shadows, outlines, or weathering effects, to enhance the retro feel.
                Layout:
                Use symmetrical or centered layouts inspired by traditional print design, posters, or old newspapers.
                Include layered elements (e.g., overlapping sections or polaroid-style images) to mimic scrapbooks or analog visuals.
                User Experience:
                Maintain clarity in navigation and CTAs while embedding retro elements (e.g., buttons styled like ticket stubs or typewriter keys).
                Ensure the page is responsive and adapts to modern devices without losing the vintage charm.
              `
    case '4':
      return `- Cartoon Style:
            The page should use cartoonish elements and vibrant colors to create a lively, playful, and engaging experience. Prioritize a fun and friendly aesthetic that appeals to users of all ages. Use hand-drawn or illustrated styles where appropriate, and balance creativity with usability to ensure the page remains functional and easy to navigate.、
            Key Aspects:
            Color Scheme:
            Use a bright and cheerful color palette, incorporating colors like sky blue, sunshine yellow, bubblegum pink, mint green, and vibrant orange.
            Add gradients or subtle shadows to make the colors pop and enhance the playful feel.
            Typography:
            Choose rounded or quirky fonts that resemble handwriting or comic book styles for headlines or decorative text.
            Pair the playful fonts with simple, readable fonts for body text to maintain balance and clarity.
            Visual Elements:
            Use speech bubbles, thought clouds, or hand-drawn arrows to emphasize key messages or guide users.
            Add textures, doodles, or small animations (e.g., a character waving or bouncing elements) to enhance interactivity.
            Layout:
            Prioritize a dynamic and modular layout that feels light-hearted, with elements like curved shapes, asymmetrical grids, or overlapping layers.
            Use rounded or irregular content blocks to avoid sharp edges and evoke a softer, friendlier look.
            User Experience:
            Ensure navigation is intuitive and easy to follow, blending cartoonish styling with functional elements like buttons and menus.
            Add playful hover effects or animations to buttons and links (e.g., buttons changing color or icons wiggling).
            Optional Features:
            Use illustrated transitions or loaders, such as spinning icons or an animated character walking across the screen.
            Focus on evoking joy and creativity while maintaining a seamless and enjoyable browsing experience. `
    case '5':
      return `- Luxury Style:
"The page should have a luxurious and refined design, exuding elegance and sophistication to appeal to high-end clientele. Focus on premium aesthetics, attention to detail, and a sense of exclusivity while maintaining a seamless and intuitive user experience. Every design element should feel polished, well-crafted, and aligned with the standards of upscale products or services.

Key Aspects:
Color Scheme:
Use a rich, sophisticated palette, such as deep tones (e.g., black, navy, emerald, burgundy) complemented with metallic accents like gold, rose gold, or silver,but don't change the background color in body tag.
Incorporate gradients, subtle textures (e.g., satin, silk, or marble effects), or contrasts between matte and glossy finishes to create depth and elegance.
Typography:
Opt for clean and elegant serif or sans-serif typefaces that exude refinement.
Use bold, dramatic fonts for headers combined with subtle and readable body text to establish a clear visual hierarchy.
Incorporate letter-spacing and capitalization for a modern, minimalist luxurious look.
Visual Elements:
Add premium details such as thin lines, geometric patterns, or intricate borders to enhance exclusivity.
Use subtle animations (e.g., image fades, text reveals, or smooth transitions) to elevate the polished feel.
Layouts:
Lean towards a minimalist layout with well-balanced sections, ample white space, and clear alignment.
Use asymmetry or diagonal layouts strategically to create a modern and unique aesthetic.
Highlight key features or products with hero sections, full-width banners, or spotlight areas.
User Experience:
Prioritize ease of navigation with clean menus, clear CTA buttons, and intuitive layouts.
Include interactive elements like hover effects, scroll-triggered animations, or parallax backgrounds for an immersive experience.
Ensure responsive design to deliver a flawless user experience across all devices.
Optional Features:
Include premium touches like an animated logo, elegant transitions (e.g., fade-ins or slides), or a luxurious preloader (e.g., swirling gold lines on a dark backdrop).
Add trust-building elements such as customer testimonials, featured awards, or brand heritage sections styled with sophisticated design.
`
    default:
      return null
  }
}
const productLayout = (value: string) => {
  switch (value) {
    case '1':
      return `-页面内容和结构：页面布局：页面以 HTML5 结构为基础，
      用 header, main, 和 footer 标签进行分区。网页内容包括：导航栏、商品图片、
      商品信息（标题、价格和描述）购买按钮、商品详情、用户评论、推荐商品和底部操作栏。
      顶部导航栏：
      左边显示返回按钮的图标（可以使用具体符号 < ）。
      中间为商标名。
      右侧显示购物车
      商品展示区域：一个大矩形区域显示具体的商品主图,用骨架屏显示
      图片下方 4 个小方形占位符，模拟缩略图的样式。
      商品信息：商品名称显示为骨架屏。商品描述部分用三行骨架屏。
      商品价格使用短骨架屏
      操作按钮：
      显示两个可点击的具体按钮：
      一个按钮写加入购物车。
      另一个按钮写立即购买。
      商品详情：
      使用骨架屏
      用户头像使用骨架屏显示
      底部固定操作栏：
      左边用具体圆形图标表示“收藏”功能。
      中间为“加入购物车”的完整按钮。
      右边为“立即购买”的完整按钮，按钮文字具体显示。
      `
    case '2':
      return `分屏布局：
“页面应采用分屏布局，屏幕分为两个部分，呈现出视觉上的平衡感和良好的用户体验。这种布局应充分利用空间，通常左侧展示产品图片，右侧展示产品详情，包括描述、价格及行动号召（CTA）等内容。设计应注重清晰性和聚焦点，同时营造现代感、简约风和吸引人的设计风格。

关键点：
分屏组成：
将页面分为两个对等或比例协调的部分，确保两侧视觉平衡且不相互压制，实现结构和谐。
左侧通常用于呈现产品图片，右侧则展示文字内容及操作元素。
可用分割线、渐变效果或背景颜色/纹理对比来增强视觉分离感。
左侧（产品图片） ：
一个大正方形形区域显示具体的商品主图,用骨架屏显示确保视觉焦点始终聚焦在商品展示上，
支持交互效果，如悬停放大或滚动切换不同角度的产品图片。
背景设计应简洁或略加纹理，以保证图片部分视觉优先级。
右侧（详情与操作） ：
包括重要的产品信息，如名称、描述、主要功能、价格和用户评价等。
商品信息：商品名称显示为骨架屏。商品描述部分用三行骨架屏。
商品价格使用短骨架屏
突出主要行动号召按钮（如“加入购物车”、“立即购买”），便于用户快速操作。
通过合理的字体设计和间距，建立清晰的内容层次结构，提升扫描阅读的便捷性。
可选加入信任标志，如安全支付图标、评分或运费说明，增加用户信心。
视觉设计：
左右两部分可使用互补或对比色方案，既强化分屏效果，又提升内容可读性。
加入轻微动态效果（如元素淡入、滑入），使过渡更为流畅和生动。
确保字体、按钮样式、间距的一致性，整体风格协调统一。
响应式设计：
确保分屏布局能够无缝适配不同设备大小。
在小屏幕（如手机）上，调整为上下堆叠结构，图片置于上方，详细信息位于下方。
保证所有交互按钮在触屏设备上的点击操作流畅便捷。
可选特色：
添加固定式元素（如悬浮CTA按钮或固定显示的产品名称与价格），便于用户滚动页面时快速访问操作。
支持个性化推荐，如在分屏布局下方展示最近浏览产品或相关产品推荐。
通过注重清晰性、平衡感与功能性，该设计能够有效展示产品并引导用户完成核心操作。”`
    case '3':
      return `模块布局：
“页面内容应采用模块布局，以美观且整齐的方式呈现，通常在推荐商品等版块中使用。设计需要将商品整齐排列成行和列，确保对齐清晰、结构统一，从而提升可读性和用户的参与感。模块布局需具备响应式特点，能够无缝适配各种屏幕尺寸，同时保持视觉均衡和功能性。

关键点：
模块结构：
商品的详情信息部分采用模块结构，但整体页面还是自上而下的结构
页面分为多个模块，每个模块专注于特定类型的信息（如图片模块、规格模块、详情模块等）。
同一页面展示的模块可以以平铺形式、折叠形式或跳转标签(tab)的方式排列。
一个大正方形形区域显示具体的商品主图,用骨架屏显示确保视觉焦点始终聚焦在商品展示上，
商品信息：商品名称显示为骨架屏。商品描述部分用三行骨架屏。
商品价格使用短骨架屏
使用边框、阴影或悬停效果区分各个模块，增加视觉识别度。
保持模块间距一致，营造整洁统一的视觉效果。
视觉层次：
利用字体设计和色彩对比强调关键信息，如折扣价格或限量提醒。
可为特定商品添加标签或标志（如“新品”、“促销”或“畅销”）以提升吸引力。
交互与功能增强：
提供交互性，悬停效果
在主要模块上加上点击的CTA按钮（如“加入购物车”或“查看详情”）。
响应式设计：

确保交互元素适合触屏操作，例如设计较大的可点击按钮和适合手势操作的间距。
可选功能：
添加“加载更多”按钮或无限滚动功能，以便更好地管理大量商品，同时避免模块内容过于臃肿。
为加载状态添加占位符（如骨架屏），避免模块区域空白，提升用户对性能的感知。
模块布局应注重清晰性、可用性和美观性，同时高效展示商品，从而最大化用户的参与度和转化率。”`
    case '4':
      return `卡片式布局：
“页面的商品详情部分应采用卡片式布局，围绕单个商品设计，呈现精致简洁的视觉风格。此布局需着重展示商品的核心信息，包括突出的商品图片、名称、价格、简短描述及关键行动号召按钮（如“加入购物车”或“立即购买”）。设计应保持简洁有序，既吸引用户注意力，又提供流畅的操作体验。

关键点：
卡片结构：
使用比例协调的卡片布局，留出适度的间距，确保外观整洁大方。
突出商品图片为核心视觉元素，其下或旁边展示核心信息，如商品名称、价格及简短描述。
运用模块化设计，以便灵活添加额外信息，如评分、库存状态或配送信息。
商品图片：
一个大正方形形区域显示具体的商品主图,用骨架屏显示，应占据约50%-60%的卡片空间。
商品信息：商品名称显示为骨架屏。商品描述部分用三行骨架屏。
商品价格使用短骨架屏
排版与关键信息：
确保排版有清晰的层次感：商品名称需醒目加粗，其次是价格和简短描述，采用较小但清晰的字体。
使用对比色或标识（如“促销”、“限时折扣”）突出优惠信息。
确保所有文字信息对齐一致，提升可读性和视觉美感。
交互功能：
关键CTA按钮（如“加入购物车”、“立即购买”）需尺寸合适、位置醒目、设计显著。
添加悬停效果或动画，例如按钮颜色变化或缩略图平滑切换等。
可选互动模块，如“快速查看评价”、“加入收藏”图标或分享按钮，提升用户体验。
移动端友好设计：
确保卡片布局响应式，能够自适应小屏幕设备。
在移动端采用堆叠式布局，商品图片置于上方，其他信息依次排列在下方。
为按钮和交互功能优化点击区域，符合触屏设备的操作习惯。
可选功能：
添加选项卡或折叠部分，用于展示详细描述、产品规格或用户评价等信息，减少视觉拥挤。
实现悬浮功能，如固定显示“立即购买”按钮或浮动的价格信息，方便用户操作。
增加可信任标识，例如“100%正品保证”或安全支付图标，增强用户信任感。
整体卡片式布局应以突出商品信息为核心，为用户带来赏心悦目且便捷高效的浏览体验，同时促进购买转化。”`
    default:
      return null
  }
}
export function layoutSubmitPrompt(
  bg: string | undefined,
  value1: string,
  value2: string,
) {
  return `你需要按照以下要求生成对应风格和布局的html代码，
  但禁止出现具体数据，所有数据都用Skeleton骨架屏代替，图片也需要用骨架屏：
  风格：${productStyle(value1)}
  布局：${productLayout(value2)}
  你可以参考此模版${htmlTemplate(bg)}
  在不修改body的style的情况下满足风格和布局
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
