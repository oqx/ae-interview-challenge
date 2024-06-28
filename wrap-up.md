## Questions

### What issues, if any, did you find with the existing code?
- Unstable function references
- A bit of props drilling from App.tsx
- Utility/type directort using a JSX capital case convention
- Login didn't persist on reload
- Types for Account were incorrect (should have been snake case)

### What issues, if any, did you find with the request to add functionality?
It was pretty bare bones. Can't judge it much as a side effect. I did add a `transaction_history` table in order to query transactions by date and sum them up. I also added some error response bodies in order to provide error context to the client as a toast.

### Would you modify the structure of this project if you were to start it over? If so, how?
- I'd add a router to the client and a `pages` directory to avoid stuffing everything into a components directory. Beyond that, I did add a pnpm workspace in order to symlink shared projects, and also updated the `api` build tool from `tsc` to `tsup` in order to transpile symlinked esm packages. 

I also ejected CRA to omit symlinked packages from the `babel-loader` exclude so that they're transpiled in the client as well.

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
- I didn't add much in the way of styling. That's something I'd likely improve.

### If you were to continue building this out, what would you like to add next?
- Cat image fractals. I joke!

### If you have any other comments or info you'd like the reviewers to know, please add them below.
- Full disclosure: my SQL is a bit rusty, but I imagine I could pick it back up fairly quick. If you're looking for someone who can write SQL like a mad man out of the gate, I might not be a good fit. Aside from that, I have a pretty solid breadth of knowledge when it comes to the javascript domain -- from build tools to pipelines, to various infra services.