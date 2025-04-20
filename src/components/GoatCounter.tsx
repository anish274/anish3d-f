import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';

interface GoatCounterProps {
  code?: string;
}

// Default GoatCounter code - replace with your actual code
const defaultCode = 'anish3d';

export const GoatCounter = ({ code = defaultCode }: GoatCounterProps) => {
  const router = useRouter();

  // Track page views on route change
  useEffect(() => {
    // @ts-ignore - GoatCounter is added by the script
    const handleRouteChange = () => window.goatcounter?.count?.();
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        data-goatcounter={`https://${code}.goatcounter.com/count`}
        src="//gc.zgo.at/count.js"
      />
    </>
  );
};