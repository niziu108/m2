'use client';

import Script from 'next/script';

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

/* Piksel Facebooka. Renderuje go wyłącznie CookieBar, po zgodzie na cookies: bez kliknięcia
   „Akceptuję” nic nie pobiera się z Facebooka ani nic do niego nie idzie. Z tego samego powodu
   nie ma tu wersji <noscript>: bez JavaScriptu nie da się wyrazić zgody. */
export default function FbPixel() {
  if (!PIXEL_ID) return null;

  return (
    // lazyOnload: przy kolejnej wizycie piksel startuje po wczytaniu strony i nie konkuruje ze
    // zdjęciami o łącze. Po kliknięciu zgody strona jest już wczytana, więc rusza od razu.
    <Script id="fb-pixel" strategy="lazyOnload">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
