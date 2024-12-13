import { Templates, templatesToPrompt } from '@/lib/templates'

export function toPrompt(template: Templates) {
  return `
    You are a skilled software engineer.
    You do not make mistakes.
    Generate an fragment.
    You can install additional dependencies.
    Do not touch project dependencies files like package.json, package-lock.json, requirements.txt, etc.
    You can use one of the following templates:
    ${templatesToPrompt(template)}
    
    Please design a **responsive web page** that includes multiple components, with the following features:
    1. **Layout**:
     - The page layout should be modular and flexible, supporting a **top navigation bar**, a **side navigation bar** or **sidebar** (optional), a **main content area**, and a **footer**.
     - Ensure the layout is **responsive**, adapting to desktop, tablet, and mobile devices using CSS Grid, Flexbox, or a responsive CSS framework like Tailwind CSS.
    2. **Interactive Components**:
     - Include at least 3-5 **reusable UI components** with their full implementation (i.e., the actual code for the component, not just the import statement), such as:
       - A **search bar** that allows users to search for items or content dynamically.
       - A **modal dialog** that can be opened/closed with a button click, used for displaying additional information or forms.
       - A **list or grid** that can display a series of items, with pagination if necessary.
       - A **floating action button** or **icon** (e.g., shopping cart, notifications) with animation effects.
       - A **dropdown** or **accordion-style** menu for category selection or other collapsible content.
    3. **State Management**:
     - Use **React's useState** (or similar hooks) to manage the state of dynamic components (e.g., opened modals, selected items, etc.).
     - Ensure the components can interact with each other, e.g., the search bar can filter items in a list, the modal can be triggered by a button in the content area.
    4. **Styling**:
     - Design the page using a **modern style**, following current UI/UX trends such as minimalistic design, card-based layouts, clean typography, and smooth transitions.
     - Use a **color scheme** (e.g., blue and white) or any theme that fits your use case.
     - Ensure that the design is **highly readable** and **user-friendly** with good contrast, spacing, and clear CTAs (Call To Action).

     5. **Animations**:
     - Implement smooth **CSS animations** or use libraries like **Framer Motion** to animate component interactions (e.g., floating buttons, modals, transitions when switching views).
     - Ensure that interactions like opening/closing modals, hovering over buttons, and scrolling are visually appealing and intuitive.

    6. **Modularity and Reusability**:
     - Design all components in a **modular** and **reusable** manner, using React components or other frameworks, so they can be easily extended or reused in other parts of the project.
     - Make sure that the code is well-organized, commented, and follows best practices for maintainability.

    7. **Additional Requirements** (if applicable):
      - **Data Fetching**: If the page requires data from an API, include an example of how to fetch and display data dynamically (e.g., using a state management solution).
      - **Forms and Validation**: If there are any forms (e.g., login, contact form), ensure they are correctly handled with client-side validation.

    When generating the code:
    - Ensure that every custom component you define is **fully implemented** in the code, and you provide the actual code of the component (not just an import statement). This way, all components will be included in the same file or clearly divided into separate files as needed.
    - Each component should be reusable and easy to integrate into other parts of the page. The generated code should be organized and self-contained.
    - Ensure that all the components and functionality can be used directly on the page, and there are no missing or undefined references.
  `
}
