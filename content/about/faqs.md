# FAQs

### How is Japa different from Jest or Vitest?
Jest and Vitest are born out of the frontend ecosystem. Therefore a lot of tooling in their ecosystems focuses mainly on the front end. 

Also, both frameworks use transpilers to transform your JavaScript code before executing it. **Jest uses babel and Vitest uses Vite**.

On the other hand, Japa focuses only on testing the backend applications and libraries written for the Node.js runtime. As a result:

- We do not transpile or bundle your code since there is no need to do that.
- The ecosystem plugins are more focused on the backend. For example, we have official plugins for testing API endpoints and server-rendered applications.

Apart from these fundamental differences, Japa features like [Datasets](../docs/datasets.md), [re-imagined lifecycle hooks](../docs/lifecycle-hooks.md) shines on their own.

### Why does Japa not have a file watcher?
Japa is meant to blend with your existing workflow vs. shipping its development tools.

If you already have a backend application, you might be using some file watcher to restart the development server. We encourage you to use the same watcher to re-run tests on file change.
