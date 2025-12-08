'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Zap, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Recommendation {
  id: string;
  title?: string;
  name?: string;
  category?: string;
  difficulty?: string;
  expertise?: string;
  reason?: string;
}

interface RecommendationsData {
  recommendations: {
    type: string;
    items?: Recommendation[];
    courses?: Recommendation[];
    features?: Recommendation[];
    users?: Recommendation[];
    featured?: Recommendation[];
    popular?: Recommendation[];
    reason: string;
  };
}

export default function RecommendationEngine() {
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async (activity?: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai/recommendations', {
        method: activity ? 'POST' : 'GET',
        headers: activity ? { 'Content-Type': 'application/json' } : undefined,
        body: activity ? JSON.stringify({ userId: 'current-user', activity }) : undefined,
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Recommendations error:', error);
      toast.error('Не удалось загрузить рекомендации');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'courses':
      case 'featured':
        return <BookOpen className="w-4 h-4" />;
      case 'features':
      case 'popular':
        return <Zap className="w-4 h-4" />;
      case 'users':
        return <Users className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getItems = () => {
    if (!recommendations?.recommendations) return [];

    const rec = recommendations.recommendations;
    return rec.items || rec.courses || rec.features || rec.users || rec.featured || rec.popular || [];
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            AI Рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const items = getItems();
  const reason = recommendations?.recommendations?.reason || '';

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getIcon(recommendations?.recommendations?.type || '')}
            AI Рекомендации
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchRecommendations('refresh')}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        {reason && (
          <p className="text-sm text-gray-600">{reason}</p>
        )}
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Рекомендации загружаются...
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm">
                    {item.title || item.name}
                  </h4>
                  <div className="flex gap-2 mt-1">
                    {item.category && (
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                    {item.difficulty && (
                      <Badge
                        variant={item.difficulty === 'beginner' ? 'default' :
                                item.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {item.difficulty}
                      </Badge>
                    )}
                    {item.expertise && (
                      <Badge variant="outline" className="text-xs">
                        {item.expertise}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Подробнее
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            Рекомендации обновляются на основе вашей активности
          </p>
        </div>
      </CardContent>
    </Card>
  );
}