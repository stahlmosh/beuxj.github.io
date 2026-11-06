import { contact, legal, site } from '../data/site'

const UPDATED = 'November 2026'

/** Plain-English terms and privacy notes for a static portfolio. Edit the wording freely. */
export function TermsPage() {
  const email = contact.email
  return (
    <article className="terms">
      <a className="back-link" href="#/">
        <span aria-hidden="true">←</span> Back to home
      </a>
      <h1 className="terms-title">Terms &amp; Privacy</h1>
      <p className="terms-updated">Last updated {UPDATED}</p>

      <section>
        <h2>1. About this site</h2>
        <p>
          This is the personal portfolio of {site.name}, a {site.descriptor.toLowerCase()}. It exists to show my work to
          players, collaborators and employers. By using the site you agree to these terms.
        </p>
      </section>

      <section>
        <h2>2. My work and your use of it</h2>
        <p>
          The games, art, code, writing, logo and design on this site are mine unless a page says otherwise. You are free to
          look, share a link and quote a short piece with credit. Please don&apos;t copy, resell or reuse my work, or pass it off
          as yours, without asking me first.
        </p>
        <p>
          Game engines, tools, fonts and other third-party names (for example Unreal Engine, Godot or itch.io) belong to their
          owners. Mentioning them does not mean they sponsor or endorse me.
        </p>
      </section>

      <section>
        <h2>3. Downloads and outside links</h2>
        <p>
          Game builds and files are offered as they are, with no promise they will run on your device or be free of bugs.
          Download and run them at your own risk, and keep your security software on. Links to other sites are for
          convenience. I don&apos;t control those sites and I&apos;m not responsible for what they contain.
        </p>
      </section>

      <section>
        <h2>4. Work in progress</h2>
        <p>
          Projects and descriptions change as I make and update things. I try to keep the site accurate, but I can&apos;t promise
          everything is complete or current.
        </p>
      </section>

      <section>
        <h2>5. Your privacy</h2>
        <ul>
          <li>No accounts, forms, advertising or analytics scripts on this site.</li>
          <li>Fonts and images are served with the site itself, not loaded from other companies.</li>
          <li>
            Your browser remembers one setting, whether you view games as Reader or List, in its local storage. It never leaves
            your device. Clearing your browser data removes it.
          </li>
          <li>
            The company hosting this site may keep standard server logs (such as IP address and time of visit) for security and
            reliability. I don&apos;t use them to identify you.
          </li>
          <li>
            If you email me, I use your message only to reply. I won&apos;t sell or share it. Tell me if you&apos;d like it deleted.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Liability</h2>
        <p>
          To the extent the law allows, I&apos;m not liable for any loss or damage from using this site, its downloads or the sites
          it links to. Nothing here limits rights you have under the law that cannot be limited.
        </p>
      </section>

      <section>
        <h2>7. Changes</h2>
        <p>I may update these terms from time to time. The date at the top shows when they last changed.</p>
      </section>

      {legal.governingLaw && (
        <section>
          <h2>8. Governing law</h2>
          <p>These terms are governed by the laws of {legal.governingLaw}.</p>
        </section>
      )}

      <section>
        <h2>Questions</h2>
        {email ? (
          <p>
            Write to <a href={`mailto:${email}`}>{email}</a>.
          </p>
        ) : (
          import.meta.env.DEV && <p className="terms-missing">Dev note: set `contact.email` in src/data/site.ts to show an address here.</p>
        )}
      </section>
    </article>
  )
}
