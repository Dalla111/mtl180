export async function onRequest(context) {
  // Get the original page response
  const response = await context.next();

  // Get the Firebase config from secure environment variables
  const firebaseConfig = {
    apiKey: context.env.VITE_FIREBASE_API_KEY,
    authDomain: context.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: context.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: context.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: context.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: context.env.VITE_FIREBASE_APP_ID,
  };

  // A simple transformer that finds and replaces the placeholder
  const transformer = new HTMLRewriter().on('script', {
    element(element) {
      const scriptContent = element.text;
      if (scriptContent.includes('__FIREBASE_CONFIG__')) {
        const newScriptContent = scriptContent.replace(
          '__FIREBASE_CONFIG__',
          JSON.stringify(firebaseConfig)
        );
        element.replace(newScriptContent, { html: true });
      }
    },
  });

  // Apply the transformation to the response
  return transformer.transform(response);
}