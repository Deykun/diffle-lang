import { useEffect } from 'react';

import { CookiesName } from '@common-types';

import { TRACKER_GA_ID } from '@const';

import { useSelector } from '@store';

export default function useAddTrackersScriptsIfNeeded() {
  const isGoogleAnalyticsAccepted = useSelector(state => state.app.cookies[CookiesName.GOOGLE_ANALYTICS]);

  useEffect(() => {
    if (isGoogleAnalyticsAccepted && TRACKER_GA_ID) {
      const isAlreadyAdded = document.getElementById('tracker-ga');

      if (isAlreadyAdded) {
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKER_GA_ID}`;
      script.async = true;
      script.id = 'tracker-ga';

      document.getElementsByTagName('head')[0]?.appendChild(script);

      const scriptText = document.createElement('script');
      // eslint-disable-next-line max-len
      scriptText.innerText = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${TRACKER_GA_ID}');`;

      document.getElementsByTagName('head')[0]?.appendChild(scriptText);
    }
  }, [isGoogleAnalyticsAccepted]);
}
