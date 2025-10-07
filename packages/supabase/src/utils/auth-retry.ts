// Shared retry utility function with exponential backoff for authentication operations
export const retryAuthOperation = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  operation: string = 'Auth operation'
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry for certain types of errors
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        // Authentication errors that shouldn't be retried
        const nonRetryableErrors = [
          'invalid login credentials',
          'email not confirmed',
          'user already registered',
          'invalid email',
          'email not found',
          'rate limit',
          'too many requests',
          'captcha verification failed',
          'signup disabled',
          'invalid captcha',
          'user not found'
        ];
        
        if (nonRetryableErrors.some(err => errorMessage.includes(err))) {
          console.warn(`${operation} failed with non-retryable error:`, error.message);
          throw error;
        }
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        console.error(`${operation} failed after ${maxRetries + 1} attempts:`, lastError?.message);
        throw error;
      }
      
      // Wait before retrying (exponential backoff with jitter)
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.warn(`${operation} attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms...`, error.message);
    }
  }
  
  throw lastError;
};