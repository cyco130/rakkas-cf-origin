import { Link } from "rakkasjs";

export default function HomePage() {
  return (
    <main>
      <h1>This is the front</h1>
      <nav>
        <ul>
          <li>
            <Link href="/edge">Edge page</Link>
          </li>
          <li>
            <Link href="/origin">Origin page</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
