import { NextRequest, NextResponse } from 'next/server';
import { sanitizeText, sanitizeUrl } from '@/lib/sanitization';
import { validateData, discordIntegrationSchema, slackIntegrationSchema, telegramIntegrationSchema } from '@/lib/validation';
import { validateCsrf } from '@/lib/csrf';

// Mock data for integrations - in production this would come from database
const integrations = [
  {
    id: 'discord',
    name: 'Discord',
    description: 'Интеграция с Discord серверами',
    connected: false,
    icon: '🎮',
    webhookUrl: null,
    botToken: null,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Интеграция с рабочими пространствами Slack',
    connected: false,
    icon: '💬',
    webhookUrl: null,
    accessToken: null,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Интеграция с Telegram ботами',
    connected: false,
    icon: '📱',
    botToken: null,
    webhookUrl: null,
  },
];

export async function GET() {
  try {
    // In production, fetch from database
    return NextResponse.json({ integrations });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch integrations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF token
    const csrfValidation = await validateCsrf(request);
    if (!csrfValidation.valid) {
      return NextResponse.json(
        { error: csrfValidation.error },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { integrationId, action, config } = body;

    // Sanitize inputs
    const sanitizedIntegrationId = sanitizeText(integrationId);
    const sanitizedAction = sanitizeText(action);

    const integration = integrations.find(i => i.id === sanitizedIntegrationId);
    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      );
    }

    if (sanitizedAction === 'connect') {
      // Validate and sanitize configuration based on integration type
      let validationResult;

      if (sanitizedIntegrationId === 'discord') {
        validationResult = validateData(discordIntegrationSchema, config);
      } else if (sanitizedIntegrationId === 'slack') {
        validationResult = validateData(slackIntegrationSchema, config);
      } else if (sanitizedIntegrationId === 'telegram') {
        validationResult = validateData(telegramIntegrationSchema, config);
      } else {
        return NextResponse.json(
          { error: 'Unsupported integration type' },
          { status: 400 }
        );
      }

      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid configuration', details: validationResult.errors.format() },
          { status: 400 }
        );
      }

      // Sanitize URLs if present
      const sanitizedConfig = {
        ...validationResult.data,
        webhookUrl: validationResult.data.webhookUrl ? sanitizeUrl(validationResult.data.webhookUrl) : undefined,
      };

      // In production, validate tokens with respective APIs
      // For now, just mark as connected
      integration.connected = true;
      Object.assign(integration, sanitizedConfig);

      return NextResponse.json({
        success: true,
        integration: {
          id: integration.id,
          name: integration.name,
          connected: integration.connected,
        }
      });
    }

    if (sanitizedAction === 'disconnect') {
      integration.connected = false;
      // Clear sensitive data
      if (sanitizedIntegrationId === 'discord') {
        integration.botToken = null;
        integration.webhookUrl = null;
      }
      if (sanitizedIntegrationId === 'slack') {
        integration.accessToken = null;
        integration.webhookUrl = null;
      }
      if (sanitizedIntegrationId === 'telegram') {
        integration.botToken = null;
        integration.webhookUrl = null;
      }

      return NextResponse.json({
        success: true,
        integration: {
          id: integration.id,
          name: integration.name,
          connected: integration.connected,
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error managing integration:', error);
    return NextResponse.json(
      { error: 'Failed to manage integration' },
      { status: 500 }
    );
  }
}