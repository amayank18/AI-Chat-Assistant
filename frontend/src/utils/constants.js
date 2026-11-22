export const DEFAULT_MODEL = 'gemini-flash-lite-latest';

export const MODELS = [
  { id: 'gemini-flash-lite-latest', name: 'Gemini Flash-Lite', description: 'Ultra fast, responsive, and lightweight' },
  { id: 'gemini-flash-latest', name: 'Gemini Flash', description: 'Fast, high-capability multimodal model' },
  { id: 'gemini-pro-latest', name: 'Gemini Pro', description: 'Advanced reasoning for complex problems' },
];

export const PROMPT_SUGGESTIONS = [
  {
    title: 'Explain Quantum Computing',
    prompt: 'Explain quantum computing in simple terms for a high school student.',
    category: 'Science',
  },
  {
    title: 'Write a React Custom Hook',
    prompt: 'Write a reusable React custom hook for debouncing input values with TypeScript.',
    category: 'Code',
  },
  {
    title: 'Design a RESTful API Schema',
    prompt: 'Design a clean, RESTful API structure for an e-commerce platform with orders, products, and users.',
    category: 'Architecture',
  },
  {
    title: 'Draft a Cold Outreach Email',
    prompt: 'Draft a polite, compelling cold outreach email to a potential startup investor.',
    category: 'Business',
  },
];
