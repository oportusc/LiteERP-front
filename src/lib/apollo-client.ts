import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Leer el token desde la estructura de Zustand
  let token = null;
  let activeCompanyId = null;
  
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const authData = JSON.parse(authStorage);
      token = authData.state?.token;
    }
    
    // Leer el activeCompanyId desde el companies store
    const companiesStorage = localStorage.getItem('companies-storage');
    if (companiesStorage) {
      const companiesData = JSON.parse(companiesStorage);
      activeCompanyId = companiesData.state?.activeCompanyId;
    }
  } catch (error) {
    console.error('Error reading data from localStorage:', error);
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'x-company-id': activeCompanyId || "", // Incluir el companyId en los headers
    }
  }
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
