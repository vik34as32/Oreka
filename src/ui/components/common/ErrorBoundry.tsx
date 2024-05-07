import { Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

function ErrorBoundary({ children, activePageId }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (e:ErrorEvent) => {
      console.error("e:",e);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  useEffect(() => {
    setHasError(false);
  },[activePageId])

  if (hasError) {
    // You can render a fallback UI here
    return (
      <div style={{display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh', }}>
        <Card sx={{ width: 300 }}>
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
              Problem in page
            </Typography>
            <Typography variant="body2">
              <br />
              There is some problem in page, please delete page.
            </Typography>
          </CardContent>
        </Card>
      </div>
      
    )
  }

  return children;
}

export default ErrorBoundary;