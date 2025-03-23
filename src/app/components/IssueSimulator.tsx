'use client';
import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Heading, 
  Text, 
  Spinner,
  Stack
} from '@chakra-ui/react';
import { Alert } from '@chakra-ui/react';

const IssueSimulator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{status: string; message: string} | null>(null);
  const [isSpinningUp, setIsSpinningUp] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://todo.app.local/api';

  const simulateIssue = async (issueType: string) => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(`${apiUrl}/issues/simulate?type=${issueType}`);
      
      if (response.status === 503 || response.status === 502) {
        // Service might be spinning up (common with free Render tier)
        setIsSpinningUp(true);
        
        // Wait 5 seconds and try once more
        setTimeout(() => {
          simulateIssue(issueType);
        }, 5000);
        return;
      }
      
      setIsSpinningUp(false);
      const data = await response.json();
      setResult({ status: data.status, message: data.message });
    } catch (error) {
      setResult({ status: 'error', message: 'Failed to simulate issue. The service might be unavailable.' });
    } finally {
      setLoading(false);
    }
  };

  const simulateServiceDown = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(`${apiUrl}/issues/service-down`, {
        method: 'POST',
      });
      
      if (response.status === 503 || response.status === 502) {
        // Service might be spinning up
        setIsSpinningUp(true);
        
        // Wait 5 seconds and try once more
        setTimeout(() => {
          simulateServiceDown();
        }, 5000);
        return;
      }
      
      setIsSpinningUp(false);
      if (!response.ok) {
        const data = await response.json().catch(() => ({
          status: 'error', 
          message: `HTTP Error: ${response.status}`
        }));
        setResult(data);
      } else {
        setResult({ 
          status: 'success', 
          message: 'Service down simulation triggered successfully' 
        });
      }
    } catch (error) {
      setResult({ 
        status: 'error', 
        message: 'Failed to simulate service down. The service might be unavailable.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>Issue Simulator</Heading>
      
      {isSpinningUp && (
        <Alert.Root status="info" mb={4}>
          <Alert.Indicator />
          <Stack direction="row">
            <Spinner size="sm" />
            <Box>
              <Alert.Title>Backend is starting up</Alert.Title>
              <Alert.Description>
                Please wait while the backend service starts up. This may take up to 30 seconds.
              </Alert.Description>
            </Box>
          </Stack>
        </Alert.Root>
      )}
      
      {result && (
        <Alert.Root 
          status={result.status === 'success' ? 'success' : 'error'} 
          mb={4}
        >
          <Alert.Indicator />
          <Box>
            <Alert.Title>{result.status === 'success' ? 'Success' : 'Error'}</Alert.Title>
            <Alert.Description>{result.message}</Alert.Description>
          </Box>
        </Alert.Root>
      )}
      
      <Stack direction="column" gap={3} align="stretch">
        <Text>Click any button to simulate different issues:</Text>
        <Button 
          colorPalette="yellow" 
          onClick={() => simulateIssue('slow')}
          loading={loading && !isSpinningUp}
        >
          Simulate Slow Response
        </Button>
        <Button 
          colorPalette="orange" 
          onClick={() => simulateIssue('error')}
          loading={loading && !isSpinningUp}
        >
          Simulate Error
        </Button>
        <Button 
          colorPalette="red" 
          onClick={simulateServiceDown}
          loading={loading && !isSpinningUp}
        >
          Simulate Service Down
        </Button>
      </Stack>
    </Box>
  );
};

export default IssueSimulator; 