## Reflection Questions

### 1. Why do we store the token in localStorage? What is one security risk of doing so, and what is a more secure alternative?

We store the token in `localStorage` because it persists even after the page is refreshed or the browser is closed, so the user stays logged in. It is also simple to use, since we can read it with `localStorage.getItem('token')` whenever we need to attach it to a request. The main security risk is XSS (cross-site scripting): if an attacker manages to run malicious JavaScript on the page, that script can read the token and use it to impersonate the user. A more secure alternative is storing the JWT in an `httpOnly` cookie, which JavaScript cannot access, ideally with the `Secure` and `SameSite` flags set as well.

### 2. What is the purpose of the AuthContext? Why not just pass the token as a prop to each component?

The `AuthContext` holds the authentication state (`user`, `token`, `login`, `logout`, `isAuthenticated`) in one global place so any component can access it through the `useAuth()` hook. Passing the token as a prop would mean sending it through every component between the top of the app and the component that needs it, even components that never use it. This is called prop drilling, and it makes the code messy and hard to maintain. With context, components like `ProtectedRoute`, `Login`, and `Students` read what they need directly, and there is a single source of truth for login state.

### 3. What happens on the frontend when the JWT expires? Describe the user experience you would want to implement.

When the JWT expires (after 1 hour in this project), the backend rejects requests with a 401 Unauthorized response, and the Students page would just show a fetch error because the app still thinks the user is logged in. The experience I would want is for the app to detect the 401 response, automatically call `logout()` to clear the old token, and redirect the user to `/login`. It should also show a clear message such as "Your session has expired, please log in again." Ideally, after logging back in, the user would be returned to the page they were on instead of starting over.

### 4. What is the difference between the backend's requireAuth middleware (from Lesson 5) and the frontend's ProtectedRoute component? Why do we need both?

The `requireAuth` middleware runs on the server and verifies the JWT on every request to a protected API route, so it actually protects the data. The `ProtectedRoute` component runs in the browser and only decides which page to show, redirecting logged-out users to `/login` for a better user experience. The frontend check alone is not secure because anyone can modify the JavaScript or call the API directly with a tool like Postman. The backend check alone would work for security but would give a poor experience, since users could open protected pages and just see errors. We need both: `ProtectedRoute` for usability and `requireAuth` for real security.