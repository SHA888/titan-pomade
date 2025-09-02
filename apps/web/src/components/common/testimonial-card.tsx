import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating?: number;
}

export function TestimonialCard({ name, role, content, avatar, rating = 5 }: TestimonialCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <span className="font-semibold text-primary">{avatar}</span>
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{role}</CardDescription>
          </div>
        </div>
        <div className="flex mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">&quot;{content}&quot;</p>
      </CardContent>
    </Card>
  );
}