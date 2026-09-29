## Pull Request Submission

### Student Details
- **Student Name:** Malligaarjunan AVK
- **Assigned No.:** 09
- **Application Name:** CTA Generator
- **Branch Name:** `09_CTA_Generator`

---

### Description of Implementation

**CUE** is an AI-powered Instagram Caption Call-To-Action (CTA) studio designed for content creators who need to optimize their engagement strategies. The application generates contextually relevant, conversion-focused CTAs tailored to Instagram's algorithm and audience behavior patterns.

**What it addresses:**
- Creators struggle to craft CTAs that balance authenticity with conversion goals
- Generic templates don't account for content type, audience, or platform nuances
- Manual CTA ideation is time-consuming and often lacks data-driven optimization

**How it works:**
1. **Input Phase:** Creators input their post content, target audience, campaign goal (e.g., "drive website traffic," "increase followers," "boost engagement"), and content category (reel, carousel, story, etc.)
2. **AI Generation:** The Claude API analyzes the context and generates 3-5 personalized CTA options with explanations for why each works
3. **Visual Preview:** Each CTA is displayed with Instagram-native formatting to show exactly how it will appear in captions
4. **One-Click Export:** Creators copy generated CTAs directly to their clipboard for immediate use

**Technical Implementation:**
- Built with Next.js for fast, responsive UX
- Custom design system featuring glass morphism UI, pill-shaped navigation, and shader effects
- Real-time API streaming for instant CTA generation feedback
- Type-safe TypeScript throughout for reliability
- Optimized for mobile-first (Instagram creator workflow)

---

### Tech Stack Used
- **Frontend / Framework:** Next.js 15 (React 19) + TypeScript
- **Backend / Language:** Node.js with Next.js API routes
- **LLM / APIs Used:** Anthropic Claude API (for CTA generation)
- **Styling:** TailwindCSS + PostCSS
- **Design System:** Custom design tokens with Vollkorn/Archivo typefaces

---

### Demonstration
- [x] Application runs locally without errors
- [ ] Screenshots or Demo GIF attached below
- [ ] Live demo link (if hosted, e.g., Vercel): [Add link here]

<!-- Paste screenshots or links here -->

---

### Submission Checklist
- [x] Branch strictly follows the naming format: `<No>_<Product_Name>`
- [x] Code is organized inside a dedicated folder with a clear `README.md`
- [x] A `package.json` is provided
- [x] `.env.example` is provided (NO secret API keys are committed)
- [x] Clear setup and execution instructions are included in the README
