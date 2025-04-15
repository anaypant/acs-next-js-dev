**Project Goal:** Refactor a Next.js application using the Pages Router to enforce strict development standards, improve maintainability, migrate authentication from Supabase to AWS Cognito, and utilize Next.js API Routes as a secure proxy layer to an existing AWS API Gateway.

**Core Technologies:**

* **Frontend Framework:** Next.js (Latest Stable Version \- adhering to Pages Router structure as specified)  
* **Authentication:** AWS Cognito (replacing Supabase)  
* **Backend:** Existing AWS API Gateway (accessed via Next.js API Routes)  
* **Styling:** (Choose one and enforce it: e.g., Tailwind CSS, CSS Modules, Styled Components)  
* **Language:** TypeScript (for type safety and better developer experience)

---

**I. Project Structure (`/`)**

@TODO.  
---

**II. Pages (`<page>/page.tsx`) Standards**

1. **Metadata Header:** Every file in **app**`/` MUST start with:

   // Last Modified: YYYY-MM-DD by \[Contributor Name\]

**Variable Definitions:** All static text, configuration values, API endpoint paths (referring to internal Next.js API routes), or magic numbers used within the page component MUST be defined as constants at the top of the file, below imports and the metadata header.

// Last Modified: 2025-04-14 by Jane Doe  
import React from 'react';  
import PageLayout from '@/components/layout/PageLayout';  
import UserProfileCard from '@/components/featureX/UserProfileCard';  
import useApi from '@/hooks/useApi'; // Example hook to call internal API

const PAGE\_TITLE \= "User Profile";  
const USER\_API\_ENDPOINT \= '/api/proxy/users/me'; // Internal API route

const ProfilePage: React.FC \= () \=\> {  
    // ... page logic ...  
};  
export default ProfilePage;

**Component Composition:** Pages should primarily compose components imported from the `/components` directory. Avoid defining complex JSX structures directly within the page file. The page's responsibility is orchestration and data fetching/passing.

// Correct: Page orchestrates layout and feature components  
const ProfilePage: React.FC \= () \=\> {  
  const { data: userData, isLoading, error } \= useApi(USER\_API\_ENDPOINT);

  return (  
    \<PageLayout title={PAGE\_TITLE}\>  
      {isLoading && \<LoadingSpinner /\>}  
      {error && \<ErrorMessage message={error.message} /\>}  
      {userData && \<UserProfileCard user={userData} /\>}  
    \</PageLayout\>  
  );  
};

1. **No Inline Component Definitions:** Do NOT define new React components (function or class components) within a page file. If a piece of UI is needed, create it in the `/components` directory and import it.  
2. **Data Fetching:** Use Next.js data fetching methods (`getServerSideProps` or `getStaticProps` for Pages Router) where appropriate, especially for initial page load data or SEO-critical content. Client-side data fetching (e.g., via `useEffect` and a custom hook like `useApi`) is suitable for dynamic data loaded after initial render or based on user interaction. Data fetching logic itself should ideally call functions defined in `lib/apiClient.ts`.  
3. **Authentication Checks:** Protected pages should implement checks (e.g., using the `useAuth` hook) and handle redirects or display appropriate UI for unauthenticated users. This logic might be centralized using a Higher-Order Component (HOC) or within `getServerSideProps`.

---

**III. Components (`components/`) Standards**

1. **Creation Criteria:** Create a component if:  
   * It is used in more than one place.  
   * It is used only once but represents a significant, self-contained piece of UI logic or structure that would clutter the page file if defined inline.  
2. **Modularity & Reusability:** Components should be designed to be as self-contained and reusable as possible. Avoid tight coupling to specific page contexts unless absolutely necessary (pass data via props).  
3. **Props:** Define clear `Props` interfaces using TypeScript for every component.  
4. **Structure:** Organize components into logical subdirectories (`common`, `layout`, `featureX`).  
5. **Styling:** Adhere strictly to Tailwind utility classes.  
6. **Comments:** Add comments for complex logic, non-obvious props, or tricky CSS. Use JSDoc for component descriptions and props.

---

**IV. API Routes (`/api/`) Standards**

1. **Purpose (BFF):** API Routes serve as the Backend-for-Frontend. Their primary roles are:  
   * Handling authentication logic (Cognito callback, session management).  
   * Acting as a secure proxy to the downstream AWS API Gateway.  
   * Potentially aggregating data from multiple downstream services (if applicable).  
   * *Not* for heavy business logic (which should reside in the AWS backend).  
2. **Authentication & Authorization:**  
   * Secure endpoints that require authentication by validating the user's session (e.g., reading and verifying a secure, HTTP-only session cookie set during the Cognito callback).  
   * Extract user identity/token from the validated session to pass downstream to AWS API Gateway if needed (e.g., in an `Authorization` header).  
3. **Proxy Implementation (`/api/proxy/[...slug].ts` or specific routes):**  
   * Read the incoming request (method, body, headers, query parameters).  
   * Construct the target URL for the AWS API Gateway (use environment variables for the base URL).  
   * Forward the request to the API Gateway, including necessary headers (e.g., `Authorization` with a user token if required by the backend, potentially an API key if needed for the Gateway itself).  
   * Handle the response from API Gateway (status code, body, headers) and forward it back to the Next.js client.  
   * Implement robust error handling (catch network errors, non-2xx responses from API Gateway) and return consistent error responses to the client.  
4. **Cognito Integration (`/api/auth/`):**  
   * `callback.ts`: This is CRUCIAL. It receives the authorization `code` from Cognito, exchanges it for tokens (ID, access, refresh) using your Cognito App Client secret (NEVER expose this client-side), validates the tokens, potentially fetches user info, and establishes a secure session for the user (e.g., encrypting session data and storing it in an HTTP-only cookie).  
   * `logout.ts`: Clears the session cookie. Optionally redirects to the Cognito logout endpoint to invalidate the Cognito session globally.  
   * `session.ts`: Reads the session cookie, validates it, and returns current user information (or null/error if not authenticated). Called by the client-side `useAuth` hook or similar.  
5. **Environment Variables:** Use environment variables (`process.env.VARIABLE_NAME`) for all sensitive information (Cognito secrets, API Gateway URL, API keys). Do NOT hardcode these.  
6. **Input Validation:** Validate incoming request bodies or query parameters before processing or proxying.  
7. **Security:**  
   * Use secure, HTTP-only cookies for session management.  
   * Validate all external input.  
   * Ensure proper CORS configuration if needed (though less critical if API routes are only called from your own frontend).  
   * Do not expose backend secrets or verbose error messages to the client.

---

**V. Authentication Flow (AWS Cognito)**

1. **Login Initiation:** User clicks "Login" \-\> Frontend redirects to the AWS Cognito Hosted UI endpoint (URL constructed using `lib/awsCognito.ts` helpers, includes `response_type=code`, `client_id`, `redirect_uri`, `scope`). The `redirect_uri` MUST point to your `pages/auth/callback.tsx` page.  
2. **Cognito Interaction:** User authenticates with Cognito (Username/Password, Social Provider, etc.).  
3. **Callback Redirect:** Cognito redirects the user's browser back to your `redirect_uri` (`https://yourdomain.com/auth/callback`) with an authorization `code` and `state` parameter in the URL query string.  
4. **Client-Side Callback Page (`pages/auth/callback.tsx`):**  
   * This page renders briefly (e.g., showing a spinner).  
   * It extracts the `code` and `state` from the URL.  
   * It makes a POST request to the *server-side* Next.js API route: `/api/auth/callback`, sending the `code`.  
5. **Server-Side Callback Handler (`pages/api/auth/callback.ts`):**  
   * Receives the `code` from the client-side page.  
   * Makes a secure, server-to-server POST request to the Cognito Token Endpoint (`https://<your-cognito-domain>/oauth2/token`). This request includes the `code`, `grant_type=authorization_code`, `client_id`, `client_secret` (from environment variables), and `redirect_uri`.  
   * Receives ID, access, and refresh tokens from Cognito.  
   * Validates the tokens (especially the ID token signature and claims).  
   * Creates a session object containing essential user info and potentially tokens (or just user identifiers).  
   * Encrypts the session data.  
   * Sets a secure, HTTP-only cookie containing the encrypted session data.  
   * Responds to the client-side callback page (`pages/auth/callback.tsx`) with success (e.g., status 200, maybe user info).  
6. **Client-Side Completion:** The `pages/auth/callback.tsx` receives the success response from `/api/auth/callback`. It can then update the global `AuthContext` state (triggering UI changes) and redirect the user to their profile or dashboard page.  
7. **Authenticated Requests:** Subsequent requests from the browser to Next.js API Routes will automatically include the session cookie. The API routes (especially proxy routes) will:  
   * Read and decrypt/validate the session cookie using logic shared with `/api/auth/callback.ts`.  
   * If valid, proceed with the action (e.g., proxying to AWS API Gateway, potentially adding an `Authorization: Bearer <access_token>` header if the backend requires it and the access token was stored in the session).  
   * If invalid/missing, return a 401 Unauthorized error.

---

**VI. Code Quality & Workflow**

* **TypeScript:** Enable `strict` mode in `tsconfig.json`. Use types everywhere.  
* **Linting/Formatting:** Configure ESLint and Prettier with strict rules. Integrate into CI/CD and pre-commit hooks. Enforce rules during Pull Request reviews.  
* **Environment Variables:** Clearly define required environment variables. Use `.env.local` for development secrets (add to `.gitignore`), and manage production/staging variables securely via deployment platform settings. Remember the `NEXT_PUBLIC_` prefix distinction for client-side access.  
* **Git Workflow:** Use a standard branching strategy (e.g., Gitflow). Require Pull Requests for merging into main branches. Enforce code reviews focusing on adherence to these standards.  
* **Testing:** Implement a testing strategy:  
  * **Unit Tests (Jest/Vitest \+ React Testing Library):** For individual components, hooks, and utility functions.  
  * **Integration Tests:** Test interactions between components, context, and API calls (mocking API routes).  
  * **API Route Tests:** Test API route logic, including authentication and proxying (can use tools like `next-test-api-route-handler`).  
  * **E2E Tests (Cypress/Playwright):** Test critical user flows through the UI.