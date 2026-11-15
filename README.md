# suq8-web

The public site for [suq8.com](https://suq8.com): static pages, no build step. Served by GitHub Pages
from the root of `main`. Nothing secret lives here: the app code is in a separate private repo.

| Page | Purpose |
|---|---|
| `index.html` | Landing page and early-access contact |
| `privacy.html` | Privacy policy (required by Google Play) |
| `confirmed.html` | Where the sign-up confirmation link ends |
| `reset.html` + `reset.js` | Sets a new password from the reset email |
| `config.js` | Hosted Supabase URL and anon key. Both are public by design; row-level security protects the data. **Never put a service-role key here.** |
| `vendor/supabase.js` | supabase-js 2.45.4, copied so the page loads no third-party script |
| `CNAME` | Tells GitHub Pages the custom domain |

Colours and fonts match the app (`theme_constants.dart`): teal `#006977`, yellow `#FFBF1F`, Lora headings,
Montserrat body. The logo is the app's launcher icon; replace `logo.png` and `favicon.png` when the new SUQ8
artwork exists (ticket E12-3).

## Supabase settings (dashboard, free)

Authentication, URL Configuration:
- Site URL: `https://suq8.com/confirmed.html`
- Redirect URLs: `https://suq8.com/**`

Authentication, Emails, templates:

**Confirm signup** keeps `{{ .ConfirmationURL }}`; after Supabase verifies it, the user lands on `confirmed.html`.

**Reset Password** links straight to the page with the token hash. This works with the app's sign-in flow;
the standard redirect link would need a code verifier stored on the phone.

```html
<h2>Reset your SUQ8 password</h2>
<p>Tap the button to choose a new password. The link works once.</p>
<p><a href="https://suq8.com/reset.html?token_hash={{ .TokenHash }}&type=recovery">Choose a new password</a></p>
<p>If you did not ask for this, you can ignore this email.</p>
```

Suggested subjects: "Confirm your SUQ8 account" and "Reset your SUQ8 password".

## Preview and test the reset page

1. `python3 -m http.server 8000`
2. Request a reset in the app (hosted variant) once the template above is saved.
3. In the email, copy the link, replace `https://suq8.com` with `http://localhost:8000`, open it.
4. Set a new password, then sign in with it in the app.

## Going live

Settings, Pages: deploy from `main`, root folder. At the registrar, point `suq8.com` at GitHub Pages
(four A records, plus a `www` CNAME) and turn on Enforce HTTPS once the certificate is issued.
Pushing to `main` publishes.

## If this repo is ever made private

On GitHub's free plan a private repo cannot serve Pages, and the site goes offline. Make it public again
or host the same folder on Firebase Hosting instead.
