import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';

export default function ComponentsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold">UI Components</h1>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content. You can put any content here.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With different content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>More card content goes here. You can customize this as needed.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Form Elements */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Elements</h2>
        <div className="max-w-md space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>
          <Button type="submit">Sign In</Button>
        </div>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading State</h2>
        <div className="p-8 border rounded-lg">
          <Loading text="Loading content..." />
        </div>
      </section>

      {/* Responsive Text */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Responsive Typography</h2>
        <div className="space-y-4">
          <p className="text-fluid-2xl">Fluid 2XL Text</p>
          <p className="text-fluid-xl">Fluid XL Text</p>
          <p className="text-fluid-lg">Fluid Large Text</p>
          <p className="text-fluid-base">Fluid Base Text</p>
          <p className="text-fluid-sm">Fluid Small Text</p>
          <p className="text-fluid-xs">Fluid Extra Small Text</p>
        </div>
      </section>
    </div>
  );
}
