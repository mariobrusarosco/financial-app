import { Button } from './Button';

export function ButtonDemo() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Button Component Demo</h1>
        
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small Button</Button>
            <Button size="md">Medium Button</Button>
            <Button size="lg">Large Button</Button>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">States</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => alert('Button clicked!')}>Clickable</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>
      </div>
    </div>
  );
} 