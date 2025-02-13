# AI


---
## Project 0: Intro

- Open your terminal and run the following command to create a new React project using Vite and install the required dependencies:

```bash
cd project-0
npm install
npm run dev
```

- **Ref**
  - [Article](https://medium.com/@codewithadurintiashok/integration-of-gemini-ai-in-react-8872025088de)


---
## Project 1: ChatBot V1

- Open your terminal and run the following command to create a new React project using Vite and install the required dependencies:

```bash
cd project-1-ChatBot-V1
npm install
npm run dev
```

- **Ref**
  - [Article](https://dev.to/tahrim_bilal/how-to-integrate-gemini-api-with-reactjs-a-step-by-step-guide-341b)
  - [src](https://github.com/Tahrim19/chatbot)

---
## Project 2: ChatBot V2

The previous App is not fully optimized. This version improves the rendering of the returned markdown for better display and handling.

- Open your terminal and run the following command to create a new React project using Vite and install the required dependencies:

```bash
cd project-2-ChatBot-V2
npm install
npm run dev
```

- `remark-gfm`
  - Supports **GitHub Flavored Markdown (GFM)** for **tables**, **task lists**, and **strikethroughs**.  
  - Without this, lists (`- item1`, `1. item2`) might not render correctly.
- `remark-breaks`
  - Ensures that Markdown **newlines (`\n`) are respected**.
  - Without this, single-line breaks might be ignored.
- `rehype-raw`
  - Allows **rendering inline HTML** inside Markdown.  
  - Example: `<b>Bold</b>` will work inside Markdown.  
  - ⚠️ Only use this if the Markdown source is **trusted**.
- Blocks Rendering
  - Uses **`react-syntax-highlighter`** for styling code blocks.
  - Code blocks (```js console.log("Hello") ```) will now **highlight properly**.

---
## Project 3: Google Gemini with Node.js 

- Open your terminal and run the following command to create a new React project using Vite and install the required dependencies:

```bash
cd project-3
npm install
npm run dev
```


- **Ref**
  - [Article](https://dev.to/arindam_1729/how-to-use-google-gemini-with-nodejs-2d39)

--- 

## Project Ideas

- AI workout Planner
  - Select fitness goal e.g. loose weight or gain muscles
  - LLM provides response
- AI Travel Guide
- AI Job Interview Coach
- AI recipe Generator



---
## Links
- [Gemini models](https://ai.google.dev/gemini-api/docs/models/gemini)
  - gemini-2.0-flash-001
  - gemini-2.0-flash-lite-preview-02-05
  - gemini-1.5-flash
  - gemini-1.5-pro
- [Generate structured output with the Gemini API](https://ai.google.dev/gemini-api/docs/structured-output?lang=python)
