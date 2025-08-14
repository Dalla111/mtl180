export async function onRequest(context) {
  // Get the original page response from the next function in the chain.
  const response = await context.next();

  // Get the Firebase config from the secure environment variables you set in Cloudflare.
  const firebaseConfig = {
    apiKey: context.env.VITE_FIREBASE_API_KEY,
    authDomain: context.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: context.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: context.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: context.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: context.env.VITE_FIREBASE_APP_ID,
  };

  // This creates a new script tag containing your secure config.
  // It's safer than trying to find and replace a placeholder.
  const injectionScript = `<script>window.firebaseConfig = ${JSON.stringify(firebaseConfig)};</script>`;

  // Use HTMLRewriter to safely inject the new script tag just before the closing </head> tag.
  return new HTMLRewriter()
    .on('head', {
      element(element) {
        element.append(injectionScript, { html: true });
      },
    })
    .transform(response);
}
