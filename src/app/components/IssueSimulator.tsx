'use client';
import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Heading, 
  Text, 
  Spinner,
  Stack,
  SimpleGrid,
  Code
} from '@chakra-ui/react';
import { Alert } from '@chakra-ui/react';

interface ErrorResult {
  status: string;
  message: string;
  httpStatus?: number;
  details?: string;
}

const IssueSimulator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ErrorResult | null>(null);
  const [isSpinningUp, setIsSpinningUp] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://todo.app.local/api';

  const simulateIssue = async (issueType: string) => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(`${apiUrl}/issues/simulate?type=${issueType}`, {
        // Add cache control headers to prevent caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
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
      
      // Handle different response status codes
      try {
        const data = await response.json();
        setResult({ 
          status: response.ok ? 'success' : 'error', 
          message: data.message || `HTTP ${response.status}: ${response.statusText}`,
          httpStatus: response.status,
          details: data.status ? `Status: ${data.status}` : undefined
        });
      } catch (parseError) {
        // Handle non-JSON responses
        const text = await response.text().catch(() => 'No response body');
        setResult({ 
          status: 'error', 
          message: `Failed to parse response (HTTP ${response.status})`,
          httpStatus: response.status,
          details: text.length > 100 ? `${text.substring(0, 100)}...` : text
        });
      }
    } catch (error: any) {
      setResult({ 
        status: 'error', 
        message: error.message || 'Failed to simulate issue. The service might be unavailable.',
        details: error.toString()
      });
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
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json'
        }
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
      
      try {
        const data = await response.json();
        setResult({ 
          status: response.ok ? 'success' : 'error', 
          message: data.message || `HTTP ${response.status}: ${response.statusText}`,
          httpStatus: response.status
        });
      } catch (parseError) {
        // If response is not valid JSON
        const text = await response.text().catch(() => 'No response body');
        setResult({ 
          status: 'error', 
          message: `Failed to parse response (HTTP ${response.status})`,
          httpStatus: response.status,
          details: text.length > 100 ? `${text.substring(0, 100)}...` : text
        });
      }
    } catch (error: any) {
      setResult({ 
        status: 'error', 
        message: error.message || 'Failed to simulate service down.',
        details: error.toString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Get alert status based on HTTP status code
  const getAlertStatus = (httpStatus?: number): "error" | "warning" | "info" | "success" => {
    if (!httpStatus) return "error";
    
    if (httpStatus >= 500) return "error";
    if (httpStatus >= 400) return "warning";
    if (httpStatus >= 300) return "info";
    return "success";
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
          status={getAlertStatus(result.httpStatus)} 
          mb={4}
        >
          <Alert.Indicator />
          <Box>
            <Alert.Title>
              {result.httpStatus 
                ? `HTTP ${result.httpStatus}` 
                : (result.status === 'success' ? 'Success' : 'Error')}
            </Alert.Title>
            <Alert.Description>{result.message}</Alert.Description>
            {result.details && (
              <Code fontSize="xs" mt={2} p={1} maxWidth="100%" overflow="auto">
                {result.details}
              </Code>
            )}
          </Box>
        </Alert.Root>
      )}
      
      <Stack direction="column" gap={3} align="stretch" mb={4}>
        <Text>Click any button to simulate different issues:</Text>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="5">
          <Button 
            colorPalette="yellow" 
            onClick={() => simulateIssue('slow')}
            loading={loading && !isSpinningUp}
          >
            Simulate Slow Response
          </Button>
          
          <Button 
            colorPalette="red" 
            onClick={() => simulateIssue('error')}
            loading={loading && !isSpinningUp}
          >
            Simulate Server Error (500)
          </Button>
          
          <Button 
            colorPalette="orange" 
            onClick={() => simulateIssue('not-found')}
            loading={loading && !isSpinningUp}
          >
            Simulate Not Found (404)
          </Button>
          
          <Button 
            colorPalette="orange" 
            onClick={() => simulateIssue('bad-request')}
            loading={loading && !isSpinningUp}
          >
            Simulate Bad Request (400)
          </Button>
          
          <Button 
            colorPalette="orange" 
            onClick={() => simulateIssue('unauthorized')}
            loading={loading && !isSpinningUp}
          >
            Simulate Unauthorized (401)
          </Button>
          
          <Button 
            colorPalette="orange" 
            onClick={() => simulateIssue('forbidden')}
            loading={loading && !isSpinningUp}
          >
            Simulate Forbidden (403)
          </Button>
        </SimpleGrid>
        
        <Button 
          colorPalette="red" 
          onClick={simulateServiceDown}
          loading={loading && !isSpinningUp}
        >
          Simulate Service Down
        </Button>
      </Stack>
      
      <Text fontSize="sm" color="gray.500" mt={4}>
        These simulations help test how the application handles various error conditions.
      </Text>
    </Box>
  );
};

export default IssueSimulator; 