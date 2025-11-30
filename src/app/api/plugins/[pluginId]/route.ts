import { NextRequest, NextResponse } from 'next/server';

// Mock plugin data
const plugins = [
  {
    id: 'chat-enhancer',
    name: 'Chat Enhancer Pro',
    description: 'Расширенные возможности чата с эмодзи, стикерами и эффектами',
    version: '2.1.0',
    author: { name: 'ChatMasters', verified: true },
    category: 'chat',
    rating: 4.8,
    reviewCount: 1250,
    downloads: 15420,
    price: 19.99,
    currency: 'USD',
    status: 'available',
    installedVersion: null,
  },
  {
    id: 'moderation-suite',
    name: 'Advanced Moderation Suite',
    description: 'Комплексная система модерации с ИИ-фильтрами',
    version: '3.2.1',
    author: { name: 'SecurityFirst', verified: true },
    category: 'moderation',
    rating: 4.7,
    reviewCount: 890,
    downloads: 8750,
    price: 49.99,
    currency: 'USD',
    status: 'installed',
    installedVersion: '3.2.1',
  },
];

// GET /api/plugins/[pluginId] - Get plugin details
export async function GET(
  request: NextRequest,
  { params }: { params: { pluginId: string } }
) {
  try {
    const plugin = plugins.find(p => p.id === params.pluginId);

    if (!plugin) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
    }

    return NextResponse.json(plugin);

  } catch (error) {
    console.error('Get plugin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/plugins/[pluginId] - Update plugin (install/uninstall/update)
export async function PUT(
  request: NextRequest,
  { params }: { params: { pluginId: string } }
) {
  try {
    const { action } = await request.json();
    const pluginIndex = plugins.findIndex(p => p.id === params.pluginId);

    if (pluginIndex === -1) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
    }

    const plugin = plugins[pluginIndex];

    switch (action) {
      case 'install':
        plugin.status = 'installed';
        plugin.installedVersion = plugin.version;
        break;

      case 'uninstall':
        plugin.status = 'available';
        plugin.installedVersion = null;
        break;

      case 'update':
        // Mock update logic
        plugin.installedVersion = plugin.version;
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      plugin
    });

  } catch (error) {
    console.error('Update plugin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/plugins/[pluginId] - Uninstall plugin
export async function DELETE(
  request: NextRequest,
  { params }: { params: { pluginId: string } }
) {
  try {
    const pluginIndex = plugins.findIndex(p => p.id === params.pluginId);

    if (pluginIndex === -1) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
    }

    const plugin = plugins[pluginIndex];
    plugin.status = 'available';
    plugin.installedVersion = null;

    return NextResponse.json({
      success: true,
      message: 'Plugin uninstalled successfully'
    });

  } catch (error) {
    console.error('Delete plugin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}