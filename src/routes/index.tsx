import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

// Placeholder home page. Replaced in the book-list change.
function HomePage() {
  return (
    <main>
      <h1>Book Tracker</h1>
      <p>Coming soon.</p>
    </main>
  )
}
