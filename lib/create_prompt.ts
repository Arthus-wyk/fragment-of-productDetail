import { Key } from "lucide-react";
import { text } from "stream/consumers";

export const create_prompt = (byAI: string, name: string, price: string,pic:string, desc: string, spec: string, content: Array<string>, style: string, layout: string, interactive: Array<string>): string => {
    const sections = [
        {
            key: 'customer_reviews',
            text: `
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
        },

        { key: 'faq', text: " -FAQ: Generate common questions and answers to help users resolve typical concerns." },
        {
            key: 'after_sales_service', text: `
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
          `},
        { key: 'promotions', text: " -Discount Information: Display current promotional activities (such as discounts, promotions, coupons, etc.)." },
        { key: 'social_sharing', text: " -Social Sharing: Include social sharing buttons, allowing users to share the product on social platforms (such as Facebook, Twitter, WeChat, etc.)." },
        {
            key: 'product_recommendations',
            text: `2. **Recommendations Section:**
                - font color should be black
                - Title: "Recommended for You".
                - Layout: Use a **responsive grid layout** that adapts to different screen sizes:
                    - Display 4 products in a single row for large screens.
                    - Adjust to 2 products per row on medium screens and 1 product per row on small screens.
                - Each recommended product card includes:
                    - **Product Name**: Randomly generate a realistic and relevant product name based on the product type. Ensure the name is concise and descriptive, e.g., "Wireless Bluetooth Headphones" or "4K Ultra HD Smart TV".
                    - **Price**: Randomly generate a reasonable price between $10 and $1000. Display the price as a numerical value with a dollar sign, e.g., "$199.99".
                    - **Image**: Display a product image using the URL: "https://image1.juramaia.com/img_v3_02gj_1c93b755-1998-4f5f-958d-e45fd942882g.jpg".
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
        }
    ];
    const sectionsInteractive = [
        { key: 'live_chat', text: '-Live Chat: Integrate a live chat function on the page, allowing users to interact with customer service or support agents in real-time.' },
        { key: 'dynamic_interaction', text: "- Dynamic Interaction: Some elements on the page should have dynamic interaction effects, such as animations, transitions, scroll effects, etc., to enhance user experience." },
    ];

    const productDetails = sections
        .filter(section => content.includes(section.key))  // Filter content based on selected keys
        .map(section => section.text)  // Map to the corresponding text
        .join("\n");  // Join all sections with a new line
    const productStyle = () => {
        switch (style) {
            case 'simple':
                return `- Simple Style: 
                    The page should feature a clean and minimalist design with minimal elements to highlight the product. 
                    Background Color: Linear gradient from #f5f5f5 to #e0e0e0. These colors should dominate the page to provide a clean and fresh appearance.,the font color should be black`;
            case 'modern':
                return `- Modern Style: 
                    The page should have a modern and stylish feel, focusing on clean design and intuitive user experience. 
                    Background Color: Linear gradient from #3f51b5 (indigo) to #2196f3 (blue) for a sleek and contemporary aesthetic. Ensure bold contrasts between background and text,the font color should be black`;
            case 'vintage':
                return `- Vintage Style: 
                    The page should incorporate retro elements and design, using nostalgic color schemes and fonts. 
                    Background Color: Linear gradient from #f4a261 (soft orange) to #e76f51 (burnt sienna), or #FFE4C4 (light brown) for a warm, retro look. Avoid overly bright colors,the font color should be black`;
            case 'tech':
                return `- Tech Style: 
                    The page should have a futuristic look with technology-inspired designs and elements. 
                    Background Color: Linear gradient from #0f2027 (dark teal) to #2c5364 (blue-green) to #00c6ff (neon blue), futuristic vibe.the font color should be black`;
            case 'minimalist':
                return `- Minimalist Style: 
                    The page should embrace ultra-minimalist design with whitespace and clean typography. 
                    Background Color: Linear gradient from #ffffff (pure white) to #f9f9f9 (soft light gray). to maintain simplicity and clarity, avoiding any patterns or complex elements,the font color should be black`;
            case 'cartoon':
                return `- Cartoon Style: 
                    The page should use cartoonish elements and vibrant colors, making it fun and friendly. 
                    Background Color: Linear gradient from #ff9a9e (soft pink) to #fad0c4 (peach) to #fbc2eb (lavender). Ensure the colors evoke a playful atmosphere.the font color should be black`;
            case 'luxury':
                return `- Luxury Style: 
                    The page should have a luxurious and refined design suitable for high-end products. 
                    Background Color: Linear gradient from #2c3e50 (charcoal gray) to #bdc3c7 (silver) to #f7f8f8 (platinum white). to enhance the premium feel,the font color should be black`;
            default:
                return null;
        }
    }
    const productLayout = () => {
        switch (layout) {
            case 'scroll':
                return '-Single Page Scroll: The page should have a single scrolling layout, with all content displayed on one page, and users can view it by scrolling.';
            case 'split':
                return '-Split Screen Layout: The page should have a split-screen layout, typically with the left side showing the product image and the right side showing details like the description, price, etc.';
            case 'grid':
                return '-Grid Layout: The page content should be arranged in a grid layout, usually used for the recommended product section, displaying products in rows and columns.';
            case 'card':
                return '-Card Layout: The page should have a card-style layout, where each product is displayed as an individual card, typically including images, price, name, etc.';
            default:
                return null;
        }
    }
    const productInteractive = sectionsInteractive
        .filter(section => content.includes(section.key))  // Filter content based on selected keys
        .map(section => section.text)  // Map to the corresponding text
        .join("\n");  // Join all sections with a new line
//     return `The fragment should create a visually appealing product details page for an e-commerce website, similar to Amazon's layout.  Ensure the page is styled elegantly and responsively, with proper spacing, font sizes, and colors to enhance user experience.
//         Verify the generated code works in a Next.js environment and does not cause errors like Error: The default export is not a React Component in page: "/". The background color and accent color of the web page must strictly follow the color and style in the style.
//         "In the generated components, please ensure the following to avoid the error Error: Text content does not match server-rendered HTML:

// Client-side Rendering: Avoid generating any dynamic content during server-side rendering, especially content that depends on useState, useEffect, or other hooks that produce dynamic data.
// Placeholder Usage: During the initial render, use placeholder content (e.g., 'Loading...') to replace the actual dynamic content. This ensures that the real content is only rendered after the client-side render is complete.
// Delay Dynamic Data Generation: Use useEffect or useLayoutEffect hooks to delay the generation of dynamic content, ensuring it only runs after the client-side render.
//         The page should include:
//         1. **Product Details Section:**
//         ${byAI==='1' ?
//             ` - Product Name: Randomly generate a realistic and relevant product name based on the product type. The name should sound like something you would typically find in an online store, e.g., "Wireless Bluetooth Headphones" or "4K Ultra HD Smart TV". Avoid using generic or nonsensical names.
//         - Product Price: Randomly generate a reasonable price between $10 and $1000. The price should be displayed as a numerical value with a dollar sign, e.g., "$199.99". Avoid using placeholder text like "AI-Generated Price".
//         - Product Image: A product image using the URL: "https://image1.juramaia.com/716d48abf1fb5fb636acd73a599b790d.png".
//         - Product Description: Randomly generated by AI (a detailed description highlighting the product\'s features).
//         - Product Specification:Randomly generated by AI (realistic and relevant option) Includes color, size, and other available options (if applicable).
//         `:
//             `- Product Name:${name}
//              - Product Price:${price}
//              - Product Image:A product image using the URL:${pic}
//              - Product Description:${desc}
//              - Product Specification:${spec}`
//         }
       
//         ${productDetails}
//         **Page Styles:**
//             Based on the user's style selection, the page should have the following characteristics:
            
//             ${productStyle()}
//             Ensure the background contrasts well with text and images.
            

//         **Layout Styles:**
//             Based on the user's layout selection, the page should have the following characteristics:
//             ${productLayout()}
//         **Interactivity Features:**
//             Based on the user's interactive feature selection, the page should include the following options:
//             ${productInteractive}
//         `;
return `The fragment should create a visually appealing product details page for an e-commerce website, similar to Amazon's layout.  Ensure the page is styled elegantly and responsively, with proper spacing, font sizes, and colors to enhance user experience.
 The background color and accent color of the web page must strictly follow the color and style in the style.
The page should include:
1. **Product Details Section:**
${byAI==='1' ?
    ` - Product Name: Randomly generate a realistic and relevant product name based on the product type. The name should sound like something you would typically find in an online store, e.g., "Wireless Bluetooth Headphones" or "4K Ultra HD Smart TV". Avoid using generic or nonsensical names.
- Product Price: Randomly generate a reasonable price between $10 and $1000. The price should be displayed as a numerical value with a dollar sign, e.g., "$199.99". Avoid using placeholder text like "AI-Generated Price".
- Product Image: A product image using the URL: "https://image1.juramaia.com/716d48abf1fb5fb636acd73a599b790d.png".
- Product Description: Randomly generated by AI (a detailed description highlighting the product\'s features).
- Product Specification:Randomly generated by AI (realistic and relevant option) Includes color, size, and other available options (if applicable).
`:
    `- Product Name:${name}
     - Product Price:${price}
     - Product Image:A product image using the URL:${pic}
     - Product Description:${desc}
     - Product Specification:${spec}`
}

${productDetails}
**Page Styles:**
    Based on the user's style selection, the page should have the following characteristics:
    
    ${productStyle()}
    Ensure the background contrasts well with text and images.
    

**Layout Styles:**
    Based on the user's layout selection, the page should have the following characteristics:
    ${productLayout()}
**Interactivity Features:**
    Based on the user's interactive feature selection, the page should include the following options:
    ${productInteractive}
`;
}