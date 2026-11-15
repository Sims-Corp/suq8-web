// Password reset page. The reset email links here with ?token_hash=...&type=recovery
// (see site/README.md for the email template). The hash is verified directly, which
// works with the app's sign-in flow; no code verifier from the phone is needed.
(function () {
  var cfg = window.SUQ8;
  var client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  var statusEl = document.getElementById('status');
  var form = document.getElementById('form');
  var submit = document.getElementById('submit');

  function show(message, kind) {
    statusEl.textContent = message;
    statusEl.className = 'status' + (kind ? ' ' + kind : '');
  }

  async function verifyLink() {
    var params = new URLSearchParams(window.location.search);
    var tokenHash = params.get('token_hash');
    if (!tokenHash || params.get('type') !== 'recovery') {
      show('This link is not valid. Request a new reset email from the app.', 'error');
      return;
    }
    var result = await client.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' });
    if (result.error) {
      show('This link has expired or was already used. Request a new reset email from the app.', 'error');
      return;
    }
    show('');
    form.hidden = false;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    var password = document.getElementById('password').value;
    var confirm = document.getElementById('confirm').value;
    if (password !== confirm) {
      show('The two passwords do not match.', 'error');
      return;
    }
    submit.disabled = true;
    var result = await client.auth.updateUser({ password: password });
    if (result.error) {
      show(result.error.message, 'error');
      submit.disabled = false;
      return;
    }
    await client.auth.signOut();
    form.hidden = true;
    show('Password updated. Open SUQ8 on your phone and sign in.', 'ok');
  });

  verifyLink();
})();
