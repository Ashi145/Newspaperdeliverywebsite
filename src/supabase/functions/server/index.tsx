import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper function to get user from access token
async function getUserFromToken(authHeader: string | null) {
  if (!authHeader) {
    return { user: null, error: 'No authorization header' };
  }

  const accessToken = authHeader.split(' ')[1];
  if (!accessToken) {
    return { user: null, error: 'No access token' };
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) {
    return { user: null, error: 'Unauthorized' };
  }

  return { user, error: null };
}

// Sign up route
app.post('/make-server-9cb37aa1/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error: any) {
    console.error('Sign up error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Get customer info
app.get('/make-server-9cb37aa1/customer-info', async (c) => {
  try {
    const { user, error } = await getUserFromToken(c.req.header('Authorization'));
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const customerInfo = await kv.get(`customer_info:${user.id}`);
    
    if (!customerInfo) {
      return c.json({ error: 'Customer info not found' }, 404);
    }

    return c.json(customerInfo);
  } catch (error: any) {
    console.error('Error fetching customer info:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Save customer info
app.post('/make-server-9cb37aa1/customer-info', async (c) => {
  try {
    const { user, error } = await getUserFromToken(c.req.header('Authorization'));
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { fullName, telephone, address, plotNumber, streetNumber } = body;

    if (!fullName || !telephone || !address || !plotNumber || !streetNumber) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    const customerInfo = {
      fullName,
      telephone,
      address,
      plotNumber,
      streetNumber,
      userId: user.id,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`customer_info:${user.id}`, customerInfo);

    return c.json({ success: true, data: customerInfo });
  } catch (error: any) {
    console.error('Error saving customer info:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Get subscription
app.get('/make-server-9cb37aa1/subscription', async (c) => {
  try {
    const { user, error } = await getUserFromToken(c.req.header('Authorization'));
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const subscription = await kv.get(`subscription:${user.id}`);
    
    if (!subscription) {
      return c.json({ error: 'No subscription found' }, 404);
    }

    return c.json(subscription);
  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Create/Update subscription
app.post('/make-server-9cb37aa1/subscription', async (c) => {
  try {
    const { user, error } = await getUserFromToken(c.req.header('Authorization'));
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { plan, newspaper } = body;

    if (!plan) {
      return c.json({ error: 'Plan is required' }, 400);
    }

    const planDetails = {
      daily: { name: 'Daily', price: '$1.2 (UGX 3,500)' },
      monthly: { name: 'Monthly', price: '$34 (UGX 125,000)' },
      premium: { name: 'Premium', price: '$142 (UGX 505,000)' }
    };

    const selectedPlan = planDetails[plan as keyof typeof planDetails];
    if (!selectedPlan) {
      return c.json({ error: 'Invalid plan' }, 400);
    }

    if (plan === 'daily' && !newspaper) {
      return c.json({ error: 'Newspaper selection required for daily plan' }, 400);
    }

    const subscription = {
      userId: user.id,
      plan,
      planName: selectedPlan.name,
      planPrice: selectedPlan.price,
      newspaper: newspaper || null,
      startDate: new Date().toISOString(),
      active: true
    };

    await kv.set(`subscription:${user.id}`, subscription);

    return c.json(subscription);
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Health check
app.get('/make-server-9cb37aa1/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get news updates
app.get('/make-server-9cb37aa1/news', async (c) => {
  try {
    const { user, error } = await getUserFromToken(c.req.header('Authorization'));
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const source = c.req.query('source') || 'all';
    const newsApiKey = Deno.env.get('NEWS_API_KEY');

    if (!newsApiKey) {
      // Return sample news if API key is not configured
      const sampleArticles = generateSampleNews(source);
      return c.json({ articles: sampleArticles });
    }

    try {
      // Fetch from NewsAPI
      const query = source === 'all' ? 'Uganda' : source === 'social' ? 'Uganda social media' : source;
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${newsApiKey}`
      );

      if (!response.ok) {
        throw new Error('NewsAPI request failed');
      }

      const data = await response.json();
      
      const articles = data.articles?.map((article: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        title: article.title || 'No title',
        description: article.description || 'No description available',
        source: article.source?.name || 'Unknown Source',
        url: article.url || '#',
        publishedAt: article.publishedAt || new Date().toISOString(),
        image: article.urlToImage || 'https://images.unsplash.com/photo-1573812195421-50a396d17893?w=400'
      })) || [];

      return c.json({ articles });
    } catch (apiError) {
      console.error('NewsAPI error:', apiError);
      // Fallback to sample news
      const sampleArticles = generateSampleNews(source);
      return c.json({ articles: sampleArticles });
    }
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

function generateSampleNews(source: string) {
  const now = new Date();
  const sources = ['New Vision', 'Daily Monitor', 'Daily Nation', 'Bukedde'];
  
  const sampleArticles = [
    {
      id: `${Date.now()}-1`,
      title: 'Uganda Economy Shows Strong Growth in Q4',
      description: 'The latest economic reports indicate robust growth across multiple sectors, with agriculture and services leading the way.',
      source: 'New Vision',
      url: '#',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
      image: 'https://images.unsplash.com/photo-1573812195421-50a396d17893?w=400'
    },
    {
      id: `${Date.now()}-2`,
      title: 'Kampala Traffic Solutions Announced',
      description: 'City officials unveil comprehensive plan to address traffic congestion in the capital with new infrastructure projects.',
      source: 'Daily Monitor',
      url: '#',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
      image: 'https://images.unsplash.com/photo-1573812195421-50a396d17893?w=400'
    },
    {
      id: `${Date.now()}-3`,
      title: 'Education Sector Receives Major Funding Boost',
      description: 'Government announces significant investment in education infrastructure and teacher training programs nationwide.',
      source: 'Daily Nation',
      url: '#',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 90).toISOString(),
      image: 'https://images.unsplash.com/photo-1573812195421-50a396d17893?w=400'
    },
    {
      id: `${Date.now()}-4`,
      title: 'Local Football Team Wins Regional Championship',
      description: 'Celebrations erupt as the national team secures victory in the regional tournament finals.',
      source: 'New Vision',
      url: '#',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
      image: 'https://images.unsplash.com/photo-1573812195421-50a396d17893?w=400'
    },
    {
      id: `${Date.now()}-5`,
      title: 'Healthcare Initiative Launches Across Districts',
      description: 'New mobile health clinics to provide essential services to rural communities starting next month.',
      source: 'Daily Monitor',
      url: '#',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 180).toISOString(),
      image: 'https://images.unsplash.com/photo-1573812195421-50a396d17893?w=400'
    },
    {
      id: `${Date.now()}-6`,
      title: 'Technology Hub Opens in Central Business District',
      description: 'State-of-the-art facility aims to support startups and innovation in the growing tech sector.',
      source: 'Daily Nation',
      url: '#',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 240).toISOString(),
      image: 'https://images.unsplash.com/photo-1573812195421-50a396d17893?w=400'
    }
  ];

  if (source !== 'all') {
    return sampleArticles.filter(article => 
      article.source.toLowerCase().includes(source.toLowerCase())
    );
  }

  return sampleArticles;
}

Deno.serve(app.fetch);